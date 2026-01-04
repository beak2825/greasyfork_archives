// ==UserScript==
// @name         CoFun++
// @namespace    http://tampermonkey.net/
// @version      0.5.12
// @description  Try to beautify CoFun!
// @author       HeziCyan
// @license      GPL-3.0-or-later
// @match        *://59.61.219.58:81/*
// @match        *://192.168.4.252:81/*
// @icon         http://59.61.219.58:81/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443828/CoFun%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/443828/CoFun%2B%2B.meta.js
// ==/UserScript==

(function() {
'use strict';

GM_addStyle([
  '.tablesorter-default .header,',
  '.tablesorter-default .tablesorter-header {',
  '    background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);',
  '    background-position: center right;',
  '    background-repeat: no-repeat;',
  '    cursor: pointer;',
  '    white-space: normal;',
  '}',
  '.tablesorter-default thead .headerSortUp,',
  '.tablesorter-default thead .tablesorter-headerSortUp,',
  '.tablesorter-default thead .tablesorter-headerAsc {',
  '    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);',
  '}',
  '.tablesorter-default thead .headerSortDown,',
  '.tablesorter-default thead .tablesorter-headerSortDown,',
  '.tablesorter-default thead .tablesorter-headerDesc {',
  '    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);',
  '}',
  '.tablesorter-default thead .sorter-false {',
  '    background-image: none;',
  '    cursor: default;',
  '    padding: 4px;',
  '}',
].join('\n'));

const blackredNum = 20;
const badgeList = {
  '/u461': {
    text: 'miku',
    'background-color': '#39C5BB',
    'color': 'white',
    'font-family': '"Source Sans Pro", Arial, sans-serif',
  },
  '/u468': {
    text: 'loli',
    'background-color': '#66CCFF',
    'color': 'white',
    'font-family': '"Source Sans Pro", Arial, sans-serif',
  },
  '/u78': {
    text: 'God',
    'background-color': '#000000',
    'color': 'white',
    'font-family': '"Source Sans Pro", Arial, sans-serif',
  },
  '/u454': {
    text: 'maple',
    'background-color': '#17ABDC',
    'color': 'white',
    'font-family': '"Source Sans Pro", Arial, sans-serif',
  },
};

const domain = window.location.origin;
const path = window.location.pathname;
const userPage = /^\/u\d+$/;
const rankPage = /^\/ranklist\/\d*$/;
const seriesPage = /^\/series\d+$/;
const problemListPage = /^\/problem\/\d*$/;
const searchPage = /^\/search\/.+$/;

let info = GM_getValue('cofun-user-info', {});
function pushInfo() {
  GM_setValue('cofun-user-info', info);
}
function queryRankList() {
  $.ajax({
    type: 'GET',
    url: domain + '/ranklist/',
    async: false,
    success: function(data) {
      let rank = {time: new Date().getTime(), list: []};
      let html = new DOMParser().parseFromString(data, 'text/html');
      for (let i = 1; i <= blackredNum; ++i) {
        let userid =
            html.querySelector(`#content > table > tbody > tr:nth-child(${
                                   i + 1}) > td.usercol.span3 > a`)
                .getAttribute('href');
        rank.list.push(userid);
      }
      info.rank = rank;
      pushInfo();
    },
  });
  return info.rank.list;
}
function getRankList() {
  if (!('rank' in info) || $.isEmptyObject(info.rank.time))
    return queryRankList();
  let rank = info.rank;
  if (new Date().getTime() - rank.time > 3600000) return queryRankList();
  return rank.list;
}

function getBlackredHTML(name) {
  let ele = document.createElement('span');
  ele.setAttribute('class', 'user-blackred');
  if (name[0] === '*') {
    ele.textContent = name.substr(0, 3);
    return ele.outerHTML + name.substr(3);
  } else {
    ele.textContent = name[0];
    return ele.outerHTML + name.substr(1);
  }
}
function setBlackred(ele) {
  if (ele.getAttribute('class') != 'user-red') return;
  let userid = ele.getAttribute('href');
  let list = getRankList();
  if (!list.includes(userid)) return;
  ele.title = ele.title.replace('王者', '宗师');
  ele.innerHTML = getBlackredHTML(ele.text);
}
function setBlackredTitle() {
  let userid = window.location.pathname;
  let re = /^\/u[1-9]\d+$/;
  if (!re.test(userid)) return;
  let title = document.querySelector('#content > h3');
  let nick = title.firstChild;
  if (nick.textContent != '王者') return;
  let list = getRankList();
  if (!list.includes(userid)) return;
  nick.textContent = '宗师';
  let s = title.innerHTML;
  let name = s.substring(s.lastIndexOf('&nbsp;') + 6);
  title.innerHTML = nick.outerHTML + '&nbsp;&nbsp;' + getBlackredHTML(name);
}

function getBadge(attr, cursor) {
  let badge = document.createElement('span');
  badge.setAttribute('class', 'user-badge');
  for (let i in attr) {
    if (i === 'text') continue;
    $(badge).css(i, attr[i]);
  }
  badge.textContent = attr.text;
  $(badge).css('cursor', cursor);
  return badge;
}
function setBadge(ele, cursor, outer) {
  let userid = ele.getAttribute('href');
  if (!(userid in badgeList)) return;
  let badge = getBadge(badgeList[userid], cursor);
  if (outer) {
    ele.parentElement.appendChild(badge);
  } else {
    ele.appendChild(badge);
  }
}
function setBadgeTitle() {
  let userid = window.location.pathname;
  if (!(userid in badgeList)) return;
  let title = document.querySelector('#content > h3');
  let badge = getBadge(badgeList[userid], 'default');
  $(badge).css('font-size', '0.7em');
  title.innerHTML += '&nbsp;&nbsp;';
  title.appendChild(badge);
}

function display(ele, cursor, outer) {
  setBlackred(ele);
  setBadge(ele, cursor, outer);
}
function displayTitle() {
  setBlackredTitle();
  setBadgeTitle();
}
displayTitle();

// 更新 badge 和黑红名
let work = false;
let set = new Set();
let update = function() {
  work = true;
  let users = document.getElementsByClassName('usercol');
  for (let user of users) {
    if (set.has(user)) continue;
    set.add(user);
    display(user.firstChild, 'default', true);
  }
  work = false;
};
update();
$('#content > table > tbody').bind('DOMSubtreeModified', function() {
  if (!work) update();
});
display(
    document.querySelector(
        'body > div.navbar.navbar-inverse.navbar-fixed-top > div > div > div > ul.nav.pull-right > li > ul > li:nth-child(1) > a'),
    'pointer', false);

// 显示 AC 题目差异
if (userPage.test(path)) {
  // 移除 AC 列表上一个奇怪的空白，然后 AC 列表就可以圆角边框了
  $('.table > thead > tr:nth-child(1)').remove();
  let myUser =
      document
          .querySelector(
              'body > div.navbar.navbar-inverse.navbar-fixed-top > div > div > div > ul.nav.pull-right > li > ul > li:nth-child(1) > a')
          .href;
  let myList = new Set();
  $.ajax({
    type: 'GET',
    url: myUser,
    async: false,
    success: function(data) {
      let problemList = $(data).find('.table > tbody')[1].children;
      for (let problem of problemList) {
        myList.add(problem.children[0].textContent);
      }
    },
  });
  let problemList = $('.table > tbody')[1].children;
  for (let problem of problemList) {
    if (myList.has(problem.children[0].textContent)) {
      $(problem).addClass('alert alert-success');
    }
  }
}

// 添加表格排序
$(function() {
  const option = {
    sortReset: true,
    sortRestart: true,
  };
  if (userPage.test(path)) {
    $('#content > .table').eq(1).tablesorter({
      ...option,
      headers: {
        2: {sorter: false},
        3: {sortInitialOrder: 'desc'},
        4: {sortInitialOrder: 'desc'},
        5: {sortInitialOrder: 'desc'},
        6: {sortInitialOrder: 'desc'},
      },
    });
  }
  if (rankPage.test(path)) {
    $('#content > .table').tablesorter({
      ...option,
      headers: {
        1: {sorter: false},
        3: {sorter: false},
        4: {sortInitialOrder: 'desc'},
        5: {sortInitialOrder: 'desc'},
      },
    });
  }
  if (seriesPage.test(path)) {
    $('#content > .table').tablesorter({
      ...option,
      headers: {
        1: {sorter: false},
        3: {sorter: false},
        4: {sortInitialOrder: 'desc'},
        5: {sortInitialOrder: 'desc'},
        6: {sortInitialOrder: 'desc'},
      },
    });
  }
  if (problemListPage.test(path)) {
    $('#content > .table').tablesorter({
      ...option,
      headers: {
        1: {sorter: false},
        3: {sorter: false},
        4: {sortInitialOrder: 'desc'},
        5: {sortInitialOrder: 'desc'},
        6: {sortInitialOrder: 'desc'},
      },
    });
  }
  if (searchPage.test(path)) {
    $('#content > .table').tablesorter({
      ...option,
      headers: {
        1: {sorter: false},
        3: {sorter: false},
        4: {sortInitialOrder: 'desc'},
        5: {sortInitialOrder: 'desc'},
        6: {sortInitialOrder: 'desc'},
      },
    });
  }
})

if (window.top != window) {
  // 删除 IFrame 内的多余元素
  let navbar = document.querySelector('body > div.ui.three.item.menu');
  let title = document.querySelector(
      'body > div.ui.main.container > div.ui.center.aligned.grid');
  let buttons = document.querySelector(
      'body > div.ui.main.container > div:nth-child(2) > div:nth-child(1)');
  navbar.parentElement.removeChild(navbar);
  title.parentElement.removeChild(title);
  buttons.parentElement.removeChild(buttons);
  // 修改 IFrame 内的代码框显示
  let codes = document.getElementsByClassName('lang-plain');
  while (codes.length != 0) {
    let code = codes[0];
    let parent = code.parentElement;
    let content = code.innerHTML;
    content = content.split(' <br>').join('').trim();
    parent.innerHTML = content;
  }
}

window.addEventListener('load', function() {
  let iframe = document.getElementById('FakeIFrame');
  console.log('IFrame status now:');
  console.log(iframe !== null);
  if (iframe === null) return;

  // 高度自适应
  iframe.height = iframe.contentDocument.documentElement.scrollHeight;

  let note =
      document.querySelector('#content > section:nth-child(5) > div > p');
  note.style.marginTop = '15px';
  note.style.fontWeight = 'bold';
  note.style.color = 'darkred';

  // 删除多余元素
  let desc = document.querySelector('#content > section:nth-child(5) > h2');
  let input = document.querySelector('#content > section:nth-child(7)');
  let output = document.querySelector('#content > section:nth-child(8)');
  let samin = document.querySelector('#content > section:nth-child(9)');
  let samout = document.querySelector('#content > section:nth-child(10)');
  let hint = document.querySelector('#content > section:nth-child(11)');
  let source = document.querySelector('#content > section:nth-child(12)');
  let parent = input.parentElement;
  desc.parentElement.removeChild(desc);
  parent.removeChild(input);
  parent.removeChild(output);
  parent.removeChild(samin);
  parent.removeChild(samout);
  parent.removeChild(hint);
  parent.removeChild(source);
}, false);
})();
