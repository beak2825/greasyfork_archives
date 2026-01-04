// ==UserScript==
// @name         Fanfou Local Blacklist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为饭否网页端加入了本地屏蔽功能，只要消息转发链中包含屏蔽列表中的用户，就能屏蔽那条消息。（暂时不能考虑因为消息过长被挤掉的用户）
// @author       You
// @include      http://www.fanfou.com/*
// @include      http://fanfou.com/*
// @include      https://www.fanfou.com/*
// @include      https://fanfou.com/*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/39738/Fanfou%20Local%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/39738/Fanfou%20Local%20Blacklist.meta.js
// ==/UserScript==

var settingsPage = async function() {
  var li = document.querySelector('#settings ul>li:nth-last-child(2)');
  li.firstChild.textContent = '屏蔽';
  if (li.classList.contains('current')) {
    var container = document.querySelector('#settings .nf');
    // Empty the container
    var range = document.createRange();
    range.selectNodeContents(container);
    range.deleteContents();

    // Add filter options
    // No better and convinient way, style and dom conform to fanfou's original design
    var words = await GM_getValue('filter_words');
    if (!words) words = '[]';
    words = JSON.parse(words);
    var display_words = words.join("\n");
    var textarea = document.createElement('textarea');
      textarea.id = 'filter_words';
      textarea.name = 'filter_words_list';
      textarea.rows = Math.min(20, Math.max(10, words.length));
      textarea.cols = 50;
      textarea.value = display_words;
    var label = document.createElement('label');
      label.classList.add('label_input');
      label.htmlFor = textarea.id;
      label.textContent = '屏蔽词列表(回车分隔)';
    var p1 = document.createElement('p');
    p1.style.margin = '10px 0';
    p1.appendChild(label);
    p1.appendChild(textarea);

    var input = document.createElement('input');
    input.type = 'button';
    input.classList.add('formbutton');
    input.value = '保存';
    var clicking = false;
    input.onclick = async function() {
      if (!clicking) {
        clicking = true;
        words = textarea.value.split("\n");
        await GM_setValue('filter_words', JSON.stringify(words));
        clicking = false;
      }
    };
    var p2 = document.createElement('p');
    p2.classList.add('act');
    p2.appendChild(input);
    container.appendChild(p1);
    container.appendChild(p2);
  }
};

var usersPage = async function(list) {
  var url = decodeURIComponent(window.location.pathname);
  var blocked = list.includes(url);
  var actions = document.querySelector('#panel .actions');
  if (actions === null)
    actions = document.querySelector('#profile-protected .actions');
  var addButton = document.createElement('a');
  addButton.href = 'javascript:void(0);';
  var setButton = function(b) {
    addButton.className = b?'bl':'bh';
    addButton.text = b?'取消屏蔽':'本地屏蔽';
  };
  var clicking = false;
  addButton.onclick = async function(e) {
    if (clicking) return false;
    clicking = true;
    if (blocked) {
      var index = list.indexOf(url);
      list.splice(index, 1);
    } else {
      list.push(url);
    }
    blocked = !blocked;
    setButton(blocked);
    await GM_setValue('blacklist', JSON.stringify(list));
    clicking = false;
  };
  setButton(blocked);
  actions.appendChild(addButton);
};

var homePage = async function(list) {
  var words = await GM_getValue('filter_words');
  if (!words) words = '[]';
  words = JSON.parse(words);
  var watch = function(target, mutate) {
    var updating = false;
    //var target = document.querySelector(selector);
    var UpdateTL = function() {
      if (updating) return;
      updating = true;
      var messages = target.children;
      //var bad_msgs = [];
      for (var i=0; i<messages.length; ++i) {
        var message = messages[i];
        var bad = false;
        var users = Array.from(message.querySelectorAll('.former'));
        users.push(message.querySelector('.author'));
        var blames = [];
        bad = bad || list.some(function(path){
          return users.some(function(user){
            var res = decodeURIComponent(user.href).endsWith(decodeURIComponent(path));
            if (res) blames.push('@'+user.textContent);
            return res;
          });
        });
        var messageContent = message.querySelector('.content').textContent;
        bad = bad || words.some(function(word){
          var res = word.length > 0 && messageContent.includes(word);
          if (res) blames.push(word);
          return res;
        });
        //if (bad) bad_msgs.push(message);
        if (!bad) message.classList.add("good"); else {
          message.setAttribute("data-blame", "因" + blames.join(',') + "而被屏蔽");
          message.classList.add("bad");
        }
      }
      //bad_msgs.forEach(function(msg) {msg.remove();});
      updating = false;
    };
    var observer = new MutationObserver(UpdateTL);
    observer.observe(mutate, {childList: true});
    UpdateTL();
  };
  var stream = document.querySelector('#stream ol');
  watch(stream, stream);
  window.onhashchange = function(){
    var stream = document.querySelector('#stream ol');
    console.log(stream);
    watch(stream, stream);
  };
  //if (location.hash.length > 0) watch('#stream ol', document.querySelector('#main'));

  stream.onclick = function(e) {
    if (e.target.classList.contains('bad')) {
      e.target.classList.toggle('trouble');
    }
  };

  var navbar = document.querySelector('#navigation .ui-roundedbox-content>ul');
  var a = document.createElement('a');
  a.textContent = '取消屏蔽';
  a.href = ' ';
  var clicking = false;
  a.onclick = function(e) {
    var stream = document.querySelector('#stream ol');
    e.preventDefault();
    if (!clicking) {
      clicking = true;
      if (a.textContent == '取消屏蔽') {
        a.textContent = '恢复屏蔽';
      } else {
        a.textContent = '取消屏蔽';
      }
      for (var i=0; i<stream.children.length; ++i) {
        stream.children[i].classList.toggle('unblock');
      }
      clicking = false;
    }
    return false;
  };
  var li = document.createElement('li');
  li.appendChild(a);
  navbar.appendChild(li);
};

(async function() {
  'use strict';
  if (window.location.pathname == '/home' || window.location.pathname == '/mentions') {
    GM_addStyle('#stream>ol>li { display:none }');
    GM_addStyle('#stream>ol>li.good { display:block }');
    GM_addStyle('#stream>ol>li.bad.unblock { display:block }');
    GM_addStyle('#stream>ol>li.bad:not(.trouble)>.content { filter: blur(10px) }');
    GM_addStyle('#stream>ol>li.bad:not(.trouble)>.author { filter: blur(10px) }');
    GM_addStyle('#stream>ol>li.bad:not(.trouble)>.stamp { filter: blur(10px) }');
    GM_addStyle('#stream>ol>li.bad:not(.trouble)>.avatar { filter: blur(10px) grayscale(100%) }');
    GM_addStyle(`#stream>ol>li.bad:not(.trouble)::before { 
      text-align: center;
      font-size: 1em;
      position: absolute;
      content: attr(data-blame);
      width: 100%;
      display: flex;
      height: 100%;
      top: 0;
      left: 0;
      justify-content: center;
      align-items: center;
      color: firebrick;
    }`);
  }

  var list = await GM_getValue('blacklist');
  if (!list) list = '[]';
  list = JSON.parse(list);
  list = list.map(id => decodeURIComponent(id));

  document.addEventListener("DOMContentLoaded", async function(){
    if (window.location.pathname.startsWith('/settings')) {
      await settingsPage();
    } else if (window.location.pathname != '/home' && window.location.pathname != '/mentions') {
      await usersPage(list);
    } else {
      await homePage(list);
    }
  });
})();
