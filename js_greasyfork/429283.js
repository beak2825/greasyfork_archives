// ==UserScript==
// @name         Twitch filtered chat
// @namespace    xContrary
// @version      1.11
// @description  Adds a second chat window which will only display mod/vip/broadcaster/verified/mentions messages.
// @author       Paco020295
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/429283/Twitch%20filtered%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/429283/Twitch%20filtered%20chat.meta.js
// ==/UserScript==

var $ = jQuery;

var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);

GM_addStyle(".chat-line__message.filtered.broadcaster { background-image: linear-gradient(to right, #18181b, #24008f); }" +
            ".chat-line__message.filtered.vip { background-image: linear-gradient(to right, #18181b, #441d1dd1); }" +
            ".chat-line__message.filtered.moderator { background-image: linear-gradient(to right, #18181b, #2a4c2e); }" +
            ".chat-line__message.filtered.verified { background-image: linear-gradient(to right, #18181b, #24008f); }" +
            ".chat-line__message.filtered.mention { background-image: linear-gradient(to right, #18181b, #565935); }");

const defaults = {
    streamersToCheck: [],
    streamersToAvoid: []
};

let stored = defaults;

function readOptions() {
    try {
        const s = localStorage.getItem('twitch-cleaner-options');
        stored = s ? JSON.parse(s) : defaults;
    } catch (e) {
        console.error(e);
    }
}

function storeOptions(options) {
    stored.streamersToAvoid = stored.streamersToAvoid.filter((str) => str !== '');
    stored.streamersToCheck = stored.streamersToCheck.filter((str) => str !== '');
    localStorage.setItem(
        'twitch-cleaner-options',
        JSON.stringify(options));
}


var msgClass = '.chat-line__message, .vod-message';
var filteredChatWindow = $('<div id="filteredChat"></div>');
var filteredChatContainer = $('<div id="filteredChatContainer"></div>');

(function() {
    'use strict';
    //filteredChatWindow.draggable();
    //filteredChatWindow.resizable();
    filteredChatWindow.css({
        "background-color": "#18181b",
        "width": "104%",
        "height": "40%",
        "right": "-17px",
        "z-index": "9999",
        "overflow-y": "scroll",
        "overflow-x": "hidden",
        "border": "solid",
        "border-color": "#e5e5e5",
        "border-width": "3px",
    });

    filteredChatContainer.css({
        "mix-blend-mode": "difference",
        "color": "white",
    });
    readOptions();

    document.arrive(".chat-room", function(elm) {
        createFilteredChat();
        createButton();
    });
    document.arrive("#VIEWER_CARD_ID", function(elm){
        let userName = elm.querySelector('a[rel="noopener noreferrer"]').innerHTML;

        var addUser = document.createElement("div");
        addUser.innerHTML = 'Highlight ➕';
        addUser.style.backgroundColor = '#18181b';
        addUser.style.padding = '10px';
        addUser.style.cursor = 'pointer';
        addUser.onclick = function() {
            if(!stored.streamersToCheck.includes(userName)){
                stored.streamersToCheck.unshift(userName);
                storeOptions(stored);
            }
        };
        var avoidUser = document.createElement("div");
        avoidUser.innerHTML = 'Avoid ⛔';
        avoidUser.style.backgroundColor = '#18181b';
        avoidUser.style.padding = '10px';
        avoidUser.style.cursor = 'pointer';
        avoidUser.onclick = function() {
            if(!stored.streamersToAvoid.includes(userName)){
                stored.streamersToAvoid.unshift(userName);
                storeOptions(stored);
            }
        };

        elm.append(addUser);
        elm.append(avoidUser);
    });
})();

function createFilteredChat(){
    listenToMessages();
    var chatScroller = $('div[data-a-target=chat-scroller]');
    var charContent = $('.chat-room__content');
    //chatScroller.css({"z-index": "10", "background-color": "#18181b"})
    charContent.css({"max-height": "70%"});
    $('.chat-room').prepend(filteredChatWindow);
    filteredChatWindow.append(filteredChatContainer);
    filteredChatContainer.html('');
}

function createButton(){
    const container = document.querySelector('.chat-input__buttons-container');
    if (!container) return;

    const counterContainer = document.createElement('div');
    counterContainer.id = 'counter-container';
    counterContainer.style.cursor = 'pointer';
    counterContainer.style.userSelect = 'none';
    counterContainer.innerHTML = '🚯';
    counterContainer.onclick = () => {
        showOptions();
    };
    container.childNodes[1].prepend(counterContainer);
}

function addStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.appendChild(style);
}

function hideOptions() {
  document.getElementById('options-container').style.display = 'none';
}

function showOptions() {
    readOptions();

    let optionsContainer = document.getElementById('options-container');
    if (!optionsContainer) {
        addStyle(`
      #options-container {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 30em;
        z-index: 99999;
        padding: 1.5em ;
        background-color: #18181b;
        color: white;
        border: 1px solid black;
      }

      #options-container .close-button {
        position: absolute;
        top: .5em;
        right: 1em;
        cursor: pointer;
      }

      #options-container label {
        display: inline-block;
        width: 15em;
      }

      #options-container label span,
      #options-container p span {
        cursor: help;
        text-decoration: underline;
      }

      #options-container > div:not(:last-child) {
        margin-bottom: 1em;
      }

      #options-container select {
        width: 100%;
        max-width: 100%;
        height: 10em;
        font-family: inherit;
        line-height: 1em;
        padding: .5em;
        background-color: #18181b;
        color: white;
      }

      #options-container .button {
        text-align: right;
      }

      #options-container .button input {
        padding: 3px;
      }

      #options-container input {
        margin-top: 8px;
        width: 100%;
        background-color: #292930;
        color: white;
        padding: 6px;
      }

      .input-container button {
        padding: 10px;
        border-style: solid;
        border-color: #b54d4dd1;
        margin-left: 5px;
      }
    `);

        document.body.insertAdjacentHTML('beforeend',
      `<div id="options-container">
        <div class="close-button"
          id="twitchCleaner__closeButton">X</div>
        <div>
          <p>Highlight
            <span class="help" title="Add streamers to this list to highlight them in yellow">(HELP)</span>
          </p>
          <div class="input-container" style="display: flex;">
            <select class="input" id="streamersToCheckSelect" name="streamersToCheck" multiple>${stored.streamersToCheck.map(streamer => `<option value="${streamer}">${streamer}</option>`).join('')}</select>
            <button id="removeCheckbutton">🗑️</button>
          </div>
          <div class="input-container" style="display: flex;">
            <input name="streamersToCheck" placeholder="Add to highlight" type="text" id="streamersToCheckInput">
            <button id="addCheckButton" style="margin-top: 8px;">➕</button>
          </div>
        </div>
        <div>
          <p>
            Avoid:
            <span class="help" title="Add streamers to this list to filter them out of the special chat">(HELP)</span>
          </p>
          <div class="input-container" style="display: flex;">
            <select class="input" id="streamersToAvoidSelect" name="streamersToAvoid" multiple>${stored.streamersToAvoid.map(streamer => `<option value="${streamer}">${streamer}</option>`).join('')}</select>
            <button id="removeAvoidButton">🗑️</button>
          </div>
          <div class="input-container" style="display: flex;">
            <input name="streamersToAvoid" placeholder="Add to avoid" type="text" id="streamersToAvoidInput">
            <button id="addAvoidButton" style="margin-top: 8px;" >➕</button>
          </div>
      </div>`);

        optionsContainer = document.getElementById('options-container');

        const {
            top,
            left
        } = document.getElementById('counter-container').getBoundingClientRect();

        const {
            width,
            height,
        } = optionsContainer.getBoundingClientRect();

        optionsContainer.style.left = left - width + 'px';
        optionsContainer.style.top = top - height + 'px';
        optionsContainer.style.display = 'block';

        document.getElementById('twitchCleaner__closeButton').onclick = hideOptions;

        document.getElementById('removeCheckbutton').onclick = () => { removeOptions('streamersToCheckSelect'); };
        document.getElementById('addCheckButton').onclick = () => { addOption('streamersToCheckInput'); };
        document.getElementById('removeAvoidButton').onclick = () => { removeOptions('streamersToAvoidSelect'); };
        document.getElementById('addAvoidButton').onclick = () => { addOption('streamersToAvoidInput'); };

    } else {
        reloadOptions();

        optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
    }
}

function reloadOptions (){
    for (let streamerStorage in stored) {
        let selectElement = document.getElementById(streamerStorage + 'Select');
        let inputElement = document.getElementById(streamerStorage + 'Input');

        selectElement.innerHTML = "";
        inputElement.value = "";
        for (let i = 0; i < stored[streamerStorage].length; i++) {
            var checkOption = document.createElement('option');
            checkOption.value = stored[streamerStorage][i];
            checkOption.text = stored[streamerStorage][i];
            selectElement.add(checkOption);
        }
    }
}

function addOption(inputId) {
    let inputElement = document.getElementById(inputId);
    let trimmedValue = inputElement.value.trim();
    if(trimmedValue !== "" && !stored.streamersToAvoid.includes(trimmedValue)) {
        stored[inputElement.name].unshift(trimmedValue);
        storeOptions(stored);
    }

    reloadOptions();
}

function removeOptions(selectId) {
    var selectElement = document.getElementById(selectId);
    var selectedOptions = Array.from(selectElement.selectedOptions);
    selectedOptions.forEach(function (option) {
        stored[selectElement.name] = stored[selectElement.name].filter(item => item !== option.value);
    });

    storeOptions(stored);
    reloadOptions();
}

function addMessageToFilter(messageContainer) {
    filteredChatContainer.append(messageContainer.cloneNode(true));
    let filteredMessages = document.getElementsByClassName('chat-line__message filtered');

    if (filteredMessages.length > 20){
        filteredMessages[0].remove()
    }
    $("#filteredChat").scrollTop($("#filteredChat")[0].scrollHeight + 10);
}

function listenToMessages(){
    document.querySelector(".chat-scrollable-area__message-container").arrive('.chat-line__message', function(newChat) {
        const hasModBadge = () => newChat.querySelectorAll('[class="chat-badge"][alt*="Moderator"]').length > 0;
        const hasVerifiedBadge = () => newChat.querySelectorAll('[class="chat-badge"][alt*="Verified"]').length > 0;
        const hasVipBadge = () => newChat.querySelectorAll('[class="chat-badge"][alt*="VIP"]').length > 0;
        const hasBroadcasterBadge = () => newChat.querySelectorAll('[class="chat-badge"][alt*="Broadcaster"]').length > 0;
        const hasStaffBadge = () => newChat.querySelectorAll('[class="chat-badge"][alt*="Staff"]').length > 0;
        const hasMention = () => newChat.querySelectorAll('[class="mention-fragment mention-fragment--recipient"], [class*="reply-line--mentioned"]').length > 0;
        const hasFollowingStreamer = () => Array.from(newChat.querySelectorAll('[class="chat-author__display-name"]')).some(element => stored.streamersToCheck.some(streamer => element.textContent == streamer));
        const hasAvoidStreamer = () => Array.from(newChat.querySelectorAll('[class="chat-author__display-name"]')).some(element => stored.streamersToAvoid.some(streamer => element.textContent == streamer));

        if (hasMention() || hasFollowingStreamer()){
            newChat.className = 'chat-line__message filtered mention';
            addMessageToFilter(newChat);
            return;
        }

        if (hasAvoidStreamer()){
            return;
        }

        if (hasStaffBadge()){
            newChat.className = 'chat-line__message filtered broadcaster';
            addMessageToFilter(newChat);
            return;
        }
        if (hasBroadcasterBadge()){
            newChat.className = 'chat-line__message filtered broadcaster';
            addMessageToFilter(newChat);
            return;
        }
        if (hasVerifiedBadge()){
            newChat.className = 'chat-line__message filtered verified';
            addMessageToFilter(newChat);
            return;
        }
        if (hasModBadge()){
            newChat.className = 'chat-line__message filtered moderator';
            addMessageToFilter(newChat);
            return;
        }

        if (hasVipBadge()){
            newChat.className = 'chat-line__message filtered vip';
            addMessageToFilter(newChat);
            return;
        }
    });
}

if (window.location.pathname.length > 1) {
    createFilteredChat();
    createButton();
    readOptions();
}
