// ==UserScript==
// @name         YouTube LiveChat Enhancer
// @namespace    http://james0x57.com/
// @version      0.2
// @description  enhance livechat on youtube
// @author       James0x57
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370213/YouTube%20LiveChat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/370213/YouTube%20LiveChat%20Enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //## Begin Code I didn't write
    // credit: https://stackoverflow.com/a/6969486/1527109
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  //## End Code I didn't write

  var fcs = function(fn) { //functionalCommentString
    /*Function By James Atherton - http://geckocodes.org/?hacker=James0x57 */
    /*You are free to copy and alter however you'd like so long as you leave the credit intact! =)*/
    return fn.toString().replace(/^(\r?\n|[^\/])*\/\*!?(\r?\n)*|\s*\*\/(\r|\n|.)*$/gi,"");
  };

  function addCSS(css) {
    var el = document.createElement('div');
    el.innerHTML = '<b>CSS</b><style type="text/css">' + css + '</style>';
    el = el.childNodes[1];
    if (el) document.getElementsByTagName('head')[0].appendChild(el);
    return el;
  }

  // https://gist.github.com/James0x57/da84cc2bb6087db5f041387b0a586e6c
  //## Begin Selector Observation Code
    var selectors = [];
    (new MutationObserver(
      function (mutationsList) {
        var s, selector, nodeMatches
        var slen = selectors.length
        for (s = 0; s < slen; s++) {
          selector = selectors[s]
          nodeMatches = node => node.nodeType === 1 && node.matches(selector.childSelector)

          mutationsList.forEach(mu => {
            if (mu.type === "childList" && mu.target.matches(selector.parentSelector)) {
              var addedMatches = Array.prototype.filter.call(mu.addedNodes, nodeMatches)
              var removedMatches = Array.prototype.filter.call(mu.removedNodes, nodeMatches)
              addedMatches.length && selector.inserted.call(null, addedMatches)
              removedMatches.length && selector.removed.call(null, removedMatches)
            }
          })
        }
      }
    )).observe(document.documentElement, {
      childList: true,
      subtree: true
    })

    // watch the parentSelector for the specific children to be added or removed,
    // call inserted as that parentSelector > children are added and they match childSelector
    // call removed as that parentSelector > children are removed and they match childSelector (note they won't be in the dom any more)
    // inserted and removed callbacks are called with the matching elements passed in as the only parameter (is an array)
    var onParentChildSelectors = function (opts) {
      var nullFn = () => {}
      selectors.push(Object.assign({
        parentSelector: "",
        childSelector: "",
        inserted: nullFn,
        removed: nullFn
      }, opts))
    }

    // remove all watch selectors:
    // offSelector({ parentSelector }) -> matching that selector
    // offSelector({ parentSelector, childSelector }) -> matching that selector
    // offSelector({ parentSelector, inserted }) -> matching that parentSelector && matching that inserted function
    // offSelector({ parentSelector, childSelector, inserted }) -> matching that selector && matching that inserted function
    // offSelector({ parentSelector, childSelector, removed }) -> matching that selector && matching that removed function
    // offSelector({ parentSelector, childSelector, inserted, removed }) -> matching that selector, inserted function, and removed function
    var offSelector = function (opts) {
      for (let s = 0; s < selectors.length; s++) {
        let selectorObj = selectors[s]
        let comp = Object.assign({}, selectorObj, opts)
        let matchingProps = ["parentSelector", "childSelector", "inserted", "removed"].filter(prop => selectorObj[prop] === comp[prop])
        if (matchingProps.length === 4) {
          selectors.splice(s, 1)
          s--
        }
      }
    }
  //## End Selector Observation Code

  addCSS(fcs(function() {/*!
    @keyframes jca_highlight {
      0% {
        background: #88ccff;
      }
      100% {
        background: transparent;
      }
    }

    .jca-jump-highlight {
      animation: jca_highlight 2s;
    }

    .jca-user-ref {
      background-color: rgba(128, 128, 128, 0.15);
      cursor: pointer;
    }
    .jca-user-ref:before {
      content: "@";
    }
  */}))

  var userInfo = {}

  var userRefClickFn = function () {
    var userRefSpan = this
    var referencedMessageEl = document.querySelector('yt-live-chat-renderer #chat #items #' + userRefSpan.getAttribute("data-last-id"))
    if (referencedMessageEl) {
      referencedMessageEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      })
      referencedMessageEl.classList.add("jca-jump-highlight")
      setTimeout(() => referencedMessageEl.classList.remove("jca-jump-highlight"), 1000)
    }
  }

  var createSpanAndReferenceUsers = function (text) {
    var span = document.createElement("span")
    // sort with longer names first because if somebody's name is a subset of another user's. eg "Amber S" and "Amber" then we'll get the right one
    var users = Object.keys(userInfo).sort((a, b) => b.length - a.length || a.localeCompare(b));
    users.forEach(user => {
      let info = userInfo[user]
      text = text.replace(info.userNameRx, `<span class="jca-user-ref" data-last-id="${info.escapedId}">${user}</span>`)
    })
    span.className = "jca-text-node-into-span"
    span.innerHTML = text
    span.querySelectorAll(".jca-user-ref").forEach(function (userSpan) {
      userSpan.addEventListener("click", userRefClickFn.bind(userSpan), false)
    })
    return span
  }

  var decorateMessage = function (messageEl) {
    // console.log(messageEl.textContent)
    var messageParts = messageEl.childNodes || []

    messageParts.forEach(node => {
      if (node.nodeType === 3) { // textNode
        let text = node.textContent
        let hasUserRef = /@/.test(text)
        if (hasUserRef) {
          let span = createSpanAndReferenceUsers(text)
          messageEl.replaceChild(span, node)
        }
      }
    })
  }

  var handleNewChat = function (chatEl) {
    var escapedId = chatEl.id.replace(/%/g, "\\%")
    var user = chatEl.querySelector("#author-name").textContent.trim()
    var messageEl = chatEl.querySelector("#message")
    var message = messageEl && messageEl.textContent.trim()
    userInfo[user] = {
      user,
      userNameRx: new RegExp("@" + escapeRegExp(user) + "\\b", "gi"),
      lastId: chatEl.id,
      escapedId,
      lastMessage: message
    }
    messageEl && decorateMessage(messageEl)
  }

  onParentChildSelectors({
    parentSelector: "yt-live-chat-renderer #chat #items",
    childSelector: "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer",
    inserted: addedChatEls => addedChatEls.forEach(handleNewChat)
    // removed
  })
})()
