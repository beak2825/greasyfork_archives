// ==UserScript==
// @name           在当前页面加载链接网页
// @description    在当前页面加载链接网页，左滑后退
// @include        http://*
// @include        https://*
// @author         yechenyin
// @version        1.0
// @namespace 	   https://greasyfork.org/users/3586-yechenyin
// @grant       	 GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/32304/%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E9%93%BE%E6%8E%A5%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/32304/%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E9%93%BE%E6%8E%A5%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
  "use strict";
  var $ = function(selector, attributes) {
    if (selector.indexOf('<') === 0 || attributes) {
      var element;
      if (selector.indexOf('<') === 0)
        element = document.createElement(selector.substring(1, selector.length - 1));
      else
        element = document.createElement(selector);

      if (attributes) {
        for (var key in attributes) {
          element[key] = attributes[key];
        }
      }
      return nodeToNodeList(element);
    } else {
      return document.querySelectorAll(selector);
    }
  };
  function nodeToNodeList(node) {
    return Object.create(document.createDocumentFragment().childNodes, {
      length: {
        value: 1
      },
      0: {
        value: node,
        enumerable: true
      },
    });
  }


  NodeList.prototype.forEach = Array.prototype.forEach;
  NodeList.prototype.click = function(func) {
    this.forEach(function(node) {
      node.onclick = func;
    });
  };
  NodeList.prototype.on = function(eventName, func) {
    for (var i = 0; i < this.length; i++) {
      this[i].addEventListener(eventName, func);
    }
  };
  NodeList.prototype.append = function(element) {
    this.forEach(function(node) {
      for (var i = 0; i < element.length; i++) {
        node.appendChild(element[i]);
      }
    });
  };
  NodeList.prototype.appendTo = function(element) {
    if (typeof element == 'string')
      element = $(element);
    if (element instanceof NodeList) {
      this.forEach(function(node) {
        for (var i = 0; i < element.length; i++) {
          element[i].appendChild(node);
        }
      });
    }
  };
  NodeList.prototype.css = function(property, value) {
    this.forEach(function(node) {
      node.style[property] = value;
    });
  };
  NodeList.prototype.show = function() {
    this.css('display', 'block');
  };
  NodeList.prototype.last = function() {
    return nodeToNodeList(this[this.length - 1]);
  };
  NodeList.prototype.remove = function(func) {
    if (this && this.length > 0)
      Array.prototype.forEach.call(this, function(node) {
        node.parentNode.removeChild(node);
      });
  };

  var load_process_bar;
  function open_tab(href) {
    if ((location.protocol == 'https:' && href.indexOf('http:') === 0) || $('.new_top_tab').length > 10) {
      window.open(href);
    } else {
      var tab = $('<iframe>', {
        src: href,
        className: 'new_top_tab',
        style: 'display:block; position:fixed; top:0; left:0; width:100%; height:100%; overflow:scroll; background:#fff; border: none; z-index: ' + String(2147483647 - 10 + $('.new_top_tab').length)
      });
      $('body').append(tab);
      tab[0].onload = function() {
        // this.style.display = 'block';
        // if (load_process_bar)
        //   clearInterval(load_process_bar);
        // $('.tab_process_bar').remove();
        console.log($('body')[0]);
      };

      if (load_process_bar)
        clearInterval(load_process_bar);
      $('.tab_process_bar').remove();
      $('<div>', {
        className: 'tab_process_bar',
        style: 'position:fixed; bottom:0; left:0; width:0; height:3px; border: none; background:#00ccff; z-index: 2147483647'
      }).appendTo('body');
      var loaded = 0;
      var load_process_bar = setInterval(function() {
        loaded++;
        if (loaded <= 100) {
          $('.tab_process_bar').css('width', loaded + '%');
        //var color = '000000' + Math.floor(parseInt('00ccff', 16) + (parseInt('9933ff', 16) - parseInt('00ccff', 16)) * loaded / 1000).toString(16);
        //$('.tab_process_bar').css('background', 'linear-gradient(to right, #00ccff, #' + color.substr(color.length - 6) + ')');
        } else if ($('.tab_process_bar').length === 0) {
          clearInterval(load_process_bar);
        }
      }, 200);

    }
  }


  function getAncestorLink(element) {
    while (element.nodeName != "A") {
      element = element.parentNode;
    }
    if (element.nodeName === "A" && element.href && element.href.indexOf('javascript') !== 0)
      return element;
  }

  document.addEventListener('click', function(e) {
    var link = getAncestorLink(e.target);
    if (link) {
      e.preventDefault();
      if (window.self === window.top) {
        open_tab(link.href);
      } else {
        window.parent.postMessage(JSON.stringify({
          open_href: link.href
        }), '*');
      }
    }
  });

  if ('ontouchmove' in window && window.self !== window.top && $('title').length)
    console.log('touch in start');
  if (window.self !== window.top && $('title').length)
    window.parent.postMessage({
      loaded_href: location.href,
      loaded_title: document.title
    }, '*');

  window.addEventListener('message', function(e) {
    if (e.data === 'go_back') {
      $('.tab_process_bar').remove();
      $('.new_top_tab').last().remove();
    } else if ($('.tab_process_bar').length > 0 && e.data.loaded_href) {
      $('.tab_process_bar').remove();
      console.log(e.data);
      var href = e.data.loaded_href;
      $('iframe[src="' + href + '"]').css('display', 'block');
      if (href.indexOf(location.origin) === 0) {
        history.pushState({
          href: location.href,
          title: $('title')[0].textContent
        }, null, location.href);
        history.replaceState(null, null, href.replace(location.origin, ''));
        document.title = e.data.loaded_title;
      }
    } else if (e.data.open_href) {
      open_tab(e.data.href);
    } else if (e.data.move_tab) {
    console.log(e.data);
      $('.new_top_tab').last().css('left', e.data.move_tab + 'px');
    }
  }
  );

  window.addEventListener('popState', function(e) {
    if (history.state) {
      history.replaceState(null, null, e.state.href);
      document.title = e.state.title;
      console.log(document.title);
    }
  }
  );

  var min_swipe_x = 50;
  var max_swipe_y = 30;
  var touch_start_x = 0;
  var touch_start_y = 0;
  var touch_move_x = 0;
  var touch_move_y = 0;
  document.addEventListener('touchstart', function(e) {
    touch_start_x = e.touches[0].clientX;
    touch_start_y = e.touches[0].clientY;
  });
  document.addEventListener('touchmove', function(e) {
    //e.preventDefault();
    touch_move_x = e.touches[0].clientX;
    touch_move_y = e.touches[0].clientY;
    //if (touch_move_x - touch_start_x > 20 && touch_move_x - touch_start_x < 120 && window.self !== window.top)
       // window.parent.postMessage({move_tab: touch_move_x - touch_start_x}, '*');
  }, {
    passive: true
  });
  document.addEventListener('touchend', function(e) {
    console.log(touch_move_x - touch_start_x + ' ' + Math.abs(touch_move_y - touch_start_y));
    if (touch_move_x - touch_start_x > min_swipe_x && Math.abs(touch_move_y - touch_start_y) < max_swipe_y)
      if (window.self !== window.top) {
        window.parent.postMessage('go_back', '*');
      } else {
        history.go(-1);
    }

  });

})();
