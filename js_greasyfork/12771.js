// ==UserScript==
// @name        Hacker News Comment Folding
// @namespace   org.stevenhoward
// @description Fold comments on hacker news
// @include     https://news.ycombinator.com/item?id=*
// @version     6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12771/Hacker%20News%20Comment%20Folding.user.js
// @updateURL https://update.greasyfork.org/scripts/12771/Hacker%20News%20Comment%20Folding.meta.js
// ==/UserScript==
'use strict';

var koScript = document.createElement('script');
koScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js';
koScript.onload = function () {
  // Given an array, returns an object whose next() function returns either { value: (value) } or null at the end.
  function makeIterator (array) {
    var i = 0;

    return {
      next: () => i < array.length ? { value: array[i++], index: i - 1 } : null,
      peek: () => i < array.length ? { value: array[i], index: i } : null
    };
  }

  // Turn the provided list of comments (listof({ node, depth }))
  // into a tree-ish structure, i.e. listof({ node, children: [] })
  function treeify(comments, activeComment) {
    // Usage: setVisibility (visible, [node, [...]])
    function setVisibility(visible) {
      var nodes = Array.prototype.slice.call(arguments, 1);
      nodes.forEach(function (node) {
        node.style.display = visible ? 'block' : 'none';
      });
    }

    // pre: commentIterator.next() != null
    function TreeNodeViewModel (commentIterator, ancestorCollapsed) {
      let _this = this;

      let iterator = commentIterator.next();
      let comment = iterator.value;
      let index = iterator.index;

      _this.node = comment.node;
      _this.depth = comment.depth;
      _this.ancestorCollapsed = ancestorCollapsed;
      comment.ancestorCollapsed = ancestorCollapsed; //hack? hack.
      _this.collapsed = comment.collapsed;
      _this.children = treeifyHelper(commentIterator, comment.depth, ko.pureComputed(() => this.collapsed() || ancestorCollapsed()));

      _this.keyboardActive = ko.pureComputed(() => index == activeComment());
      
      _this.bindToDom = function () {
        let element = _this.node;

        let a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.dataset.bind = "text: collapsed() ? '[+]' : '[-]', click: function () { collapsed(!collapsed()); }";

        element.dataset.bind = "css: { keyboardActive: keyboardActive }, style: { display: ancestorCollapsed() ? 'none' : 'block', backgroundColor: keyboardActive() ? '#faffff' : 'inherit' }";
        element.querySelector('.comment').dataset.bind = "style: { display: collapsed() ? 'none' : 'block' }";
        element.querySelector('td[valign="top"]').dataset.bind = "style: { visibility: collapsed() ? 'hidden' : 'visible' }";

        let comhead = element.querySelector('.comhead');
        comhead.insertBefore(a, comhead.firstChild);

        ko.applyBindings(_this, element);
      }
    }

    // commentIterator: iterator that sequentially accesses comments
    // minimumDepth: stop processing when a node's depth <= minimumDepth
    // ancestorCollapsed: computed property indicating whether an ancestor is collapsed, and thus not even headers should be shown
    // precondition: zero or more comments are greater than minimumDepth
    function treeifyHelper(commentIterator, minimumDepth, ancestorCollapsed) {
      var commentTree = [];
      var comment;

      while ((comment = commentIterator.peek()) && comment.value.depth > minimumDepth) {
        let viewmodel = new TreeNodeViewModel(commentIterator, ancestorCollapsed);
        commentTree.push(viewmodel);
        viewmodel.bindToDom();
      }

      return commentTree;
    }

    return { node: null, children: treeifyHelper(makeIterator(comments), -1, ko.observable(false)) };
  }

  // Slice off the first 'athing,' which is the article title
  var things = Array.prototype.slice.call(document.querySelectorAll('.athing'), 1);

  // comments: listof({ 
  //  html: root node of the comment (includes indentation, buttons, text)
  //  depth: integer number of indentation "units" used to indent
  //})
  var comments = things.map(function (thing) {
    var ind = thing.querySelector('.ind img');
    var indentation = ind ? ind.width / 40 : null;
    return {
      node: thing,
      collapsed: ko.observable(false),
      depth: indentation
    };
  });

  var activeComment = (function (sessionStoreKey) {
    let activeItem = sessionStorage[sessionStoreKey];
    let index = 0;
    if (activeItem) {
      let selector = 'a[href="' + activeItem + '"]';
      for (; !comments[index].node.querySelector(selector) && index < comments.length; ++index) { }
      index = index < comments.length ? index : 0;
    }
    
    let obs = ko.observable(index);
    obs.subscribe(newValue => {
      let comment = comments[newValue];
      sessionStorage[sessionStoreKey] = comment.node.querySelector('a[href^="item?id="]').href.replace(/^.*[/]/g, '');
    });
    
    return obs;
  })('active_comment_' + document.location.href.match(/(\d+)$/)[0])

  var tree = treeify(comments, activeComment);
  
  activeComment.subscribe(newActiveComment => {
    let padding = 30;
    let rect = comments[newActiveComment].node.getClientRects()[0];
    let top = window.pageYOffset + rect.top - padding;
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: top
    });
  });

  function add_modulo(a, b, m) {
    // JavaScript doesn't handle modulo for negative numbers intuitively, so:
    // - find l = (a + b) % m, in the range (-m, m)
    // - find (l + m), in the range (0, 2m)
    // - find (l + m) % m, in the range (0, m)
    return ((a + b) % m + m) % m;
  }

  function seek (list, start, offset, done) {
   do { 
      start = add_modulo(start, offset, list.length); 
    } while (!done(list[start]));
  
    return start;
  }

  // Set a new active comment and ensure that any active elements on the page do not intercept the enter key.
  function seekActiveComment (comments, activeComment, direction, predicate) {
    activeComment(seek(comments, activeComment(), direction, predicate));
    document.activeElement.blur();
  }

  let pauseKeyboardNavigation = ko.observable(false);

  let inputs = document.querySelectorAll('input, textarea');
  Array.prototype.slice.call(inputs).forEach(element => {
    element.addEventListener('focus', _ => pauseKeyboardNavigation(true), true);
    element.addEventListener('blur', _ => pauseKeyboardNavigation(false), true);
  });
  
  document.body.addEventListener(
    'keydown', 
    function (e) {
      if (pauseKeyboardNavigation()) {
        return;
      }
      
      let i = activeComment();
      let c = comments[i];
      let key = String.fromCharCode(e.keyCode);
      
      switch (key) {
        case 'J':
          activeComment(seek(comments, i, 1, comment => !comment.ancestorCollapsed()));
          break;

        case 'K':
          activeComment(seek(comments, i, -1, comment => !comment.ancestorCollapsed()));
          break;
          
        case 'U':
          activeComment(seek(comments, i, 1, comment => comment.depth == 0));
          break;
          
        case 'I':
          activeComment(seek(comments, i, -1, comment => comment.depth == 0));
          break;
          
        case '\r': // enter
        case '\n':
        case 'C':
          c.collapsed(!c.collapsed());
          break;
          
        case 'P':
          if (c.depth != 0) {
            activeComment(seek(comments, i + 1, -1, comment => comment.depth == c.depth - 1));
          }
          
          break;
          
        case 'A':
          window.vote(c.node.querySelector('a[id^="up_"]'));
          
          break;
        case 'Z':
          window.vote(c.node.querySelector('a[id^="down_"]'));
          
          break;
          
        case '0':
        case '1':
        case '2':
        case '3':
        case '4': 
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          // 1-indexed links within the current comment
          let links = c.node.querySelectorAll('.c00 p > a');
          let keyNum = parseInt(key);
          if (keyNum < links.length) {
            links[keyNum].click();
          }
      }
    },
    true);
};

document.body.appendChild(koScript);