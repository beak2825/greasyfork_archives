// ==UserScript==
// @name         nga.blocker
// @namespace    http://ngacn.cc/
// @version      0.1
// @description  Block threads by titles and authors
// @author       OpenGG
// @match        https://bbs.ngacn.cc/thread.php?fid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34327/ngablocker.user.js
// @updateURL https://update.greasyfork.org/scripts/34327/ngablocker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var MatchWithArr = function MatchWithArr(fn) {
    return function (compare, arr) {
      for (var i = arr.length - 1; i > -1; --i) {
        if (fn(compare, arr[i])) {
          return true;
        }
      }
      return false;
    };
  };

  var random = Math.floor(Math.random() * Math.pow(2, 53));

  var clsHide = '_hydra_hidden_nga_' + random;

  var clsOptions = '_hydra_options_nga_' + random;

  var clsBtn = '_hydra_btn_nga_' + random;

  var css = '.' + clsHide + '{display:none}.' + clsBtn + '{position:absolute;top:100px;right:30px;opacity:0.6}.' + clsBtn + ':hover{opacity:1}.' + clsOptions + '{position:absolute;top:130px;right:30px;width:600px;padding:10px;background:#abc}.' + clsOptions + ' label{display:block}';

  var addStyle = function addStyle() {
    var style = document.createElement('style');

    style.textContent = css;

    (document.head || document.documentElement).appendChild(style);
  };

  var hideEl = function hideEl(el) {
    el.classList.add(clsHide);
  };

  var blockedTopics = (localStorage.blockedTopics || '').split(/\r?\n/);

  var blockedAuthors = (localStorage.blockedAuthors || '').split(/\r?\n/);

  var block = function block() {
    var rows = document.querySelectorAll('.topicrow');

    var matchAuthor = MatchWithArr(function (compare, item) {
      var matches = compare.match(/uid=(\d+)$/);
      var uid = matches && matches[1];
      return item === uid;
    });

    var matchTopic = MatchWithArr(function (compare, item) {
      return compare.indexOf(item) !== -1;
    });

    for (var i = rows.length - 1; i > -1; --i) {
      var row = rows[i];

      if (blockedAuthors.length > 0) {
        var author = row.querySelector('a.author');
        if (matchAuthor(author.href, blockedAuthors)) {
          hideEl(row);
          continue;
        }
      }

      if (blockedAuthors.length > 0) {
        var topic = row.querySelector('.topic');
        if (matchTopic(topic.textContent, blockedTopics)) {
          hideEl(row);
          continue;
        }
      }
    }
  };

  var optionsShow = false;
  var hideOptions = function hideOptions() {
    optionsShow = false;

    var el = document.querySelector('.' + clsOptions);

    if (el) {
      el.parentNode.removeChild(el);
    }
  };

  var showOptions = function showOptions() {
    optionsShow = true;
    var container = document.createElement('div');

    container.className = clsOptions;

    container.innerHTML = '<label>屏蔽标题关键字（每行一个）：<textarea placeholder="一行一个关键字"></textarea></label><label>屏蔽楼主UID（每行一个）：<textarea placeholder="一行一个UID"></textarea></label><button>保存</button>';

    var _container$querySelec = container.querySelectorAll('textarea'),
        blockTopicEl = _container$querySelec[0],
        blockAuthorEl = _container$querySelec[1];

    var save = container.querySelector('button');

    blockTopicEl.value = blockedTopics.join('\n');

    blockAuthorEl.value = blockedAuthors.join('\n');

    save.addEventListener('click', function () {
      localStorage.blockedTopics = blockTopicEl.value;

      localStorage.blockedAuthors = blockAuthorEl.value;

      hideOptions();

      location.reload();
    }, false);

    document.body.appendChild(container);
  };

  var addControls = function addControls() {
    var el = document.createElement('button');

    el.className = clsBtn;

    el.textContent = '屏蔽设置';

    el.onclick = function () {
      if (optionsShow) {
        hideOptions();
      } else {
        showOptions();
      }
    };

    document.body.appendChild(el);
  };

  var init = function init() {
    document.removeEventListener('DOMContentLoaded', init, false);

    addStyle();
    addControls();
    block();
  };

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, false);
  }
})();