// ==UserScript==
// @name 页内书签
// @namespace www.jjwt.com/
// @description 记录页面的当前位置，可以轻松从其他位置返回
// @include *
// @version 2.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/2660/%E9%A1%B5%E5%86%85%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/2660/%E9%A1%B5%E5%86%85%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==
function jjwtAddBookMark() {
  if (arguments.length == 2) {
    var bookMarkName = arguments[0];
    var currentYPostion = arguments[1];
  } 
  else {
    var bookMarkName = prompt('请输入书签名', '');
    var currentYPostion = window.pageYOffset;
  }
  if (bookMarkName != null && bookMarkName != '') {
    var ul = document.getElementById('jjwtBookMarkUl');
    var txt = document.createElement('input');
    txt.type = 'text';
    txt.value = bookMarkName;
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Go';
    btn.onclick = function (event) {
      window.scrollTo(0, currentYPostion);
    };
    var li = document.createElement('li');
    li.appendChild(txt);
    li.appendChild(btn);
    ul.appendChild(li);
  }
}
function jjwtInitBookMark() {
  jjwtAddStyle();
  if (!document.getElementById('jjwtBookMark')) {
    var bookmark_div = document.createElement('div');
    bookmark_div.id = 'jjwtBookMark';
    bookmark_div.onmouseover = mOver;
    bookmark_div.onmouseout = mOout;
    var div_nav = document.createElement('div');
    div_nav.id = 'jjwtBookMarkNav';
    var div_main = document.createElement('div');
    div_main.id = 'jjwtBookMarkMain';
    //增加 "页内标签"
    var h3 = document.createElement('h3');
    h3.className = 'jjwtBookMarkH3';
    h3.innerHTML = '页内标签';
    div_main.appendChild(h3);
    var h3a = document.createElement('h3');
    h3a.className = 'jjwtBookMarkH3';
    h3a.innerHTML = '页内标签';
    div_nav.appendChild(h3a);
    // 增加 "添加书签"按钮
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = '增加书签';
    btn.onclick = jjwtAddBookMark;
    div_main.appendChild(btn);
    var ul = document.createElement('ul');
    ul.id = 'jjwtBookMarkUl';
    div_main.appendChild(ul);
    bookmark_div.appendChild(div_nav);
    bookmark_div.appendChild(div_main);
    //增加默认标签
    document.body.appendChild(bookmark_div);
    jjwtAddBookMark('页面顶部', 0);
  };
}
function jjwtAddStyle() {
  if (!document.getElementById('jjwtBookMarkStyle') && window.self == window.top) {
    //先检查要建立的样式表ID是否存在，防止重复添加
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'jjwtBookMarkStyle';
    style.innerHTML = '#jjwtBookMark{' +
    'display:block;' +
    'position:fixed;' +
    'right:0px;' +
    'z-index:99999;' +
    'width:20px;' +
    'overflow:hidden;' +
    'top:220px;' +
    'visibility:visible;' +
    'font-size:12px;' +
    'background-color:#F1FEDD;' +
    'text-align:left !important;' +
    'word-break:break-all;' +
    '} ' +
    '#jjwtBookMarkNav{' +
    'width: 10px;' +
    'float: left;' +
    'word-break:break-all;' +
    '} ' +
    '#jjwtBookMarkMain{' +
    'float: left;' +
    'position: absolute;' +
    'left: 20px;' +
    'word-break:break-all;' +
    '} ' +
    '.jjwtBookMarkH3{' +
    'width: 50%;' +
    'cursor: pointer;' +
    'outline: 0px none;' +
    'text-index: 0.5em;' +
    'border-top: 1px solid #FBFBFB;' +
    'border-bottom: 1px solid #F2F1F1;' +
    'background-color: #F6F6F6;' +
    'float: left;' +
    'padding: 0px;' +
    'margin: 0px;' +
    'word-break:break-all;' +
    '} ' +
    '#jjwtBookMarkUl{' +
    'width: 90%;' +
    'float: left;' +
    'padding: 8px 0px;' +
    'margin-left: 2px;' +
    'overflow: hidden;' +
    'list-style: none outside none;' +
    'font-size:12px;' +
    'text-align:left !important;' +
    '} ' +
    '.jjwtBookMarkLi{' +
    'width: 47%;' +
    'height: 26px;' +
    'float: left;' +
    'margin: 2px;' +
    'list-style: none outside none;' +
    'padding: 0px;' +
    '} ';
    document.body.appendChild(style);
  };
};
function mOver() {
  document.getElementById('jjwtBookMark').style.width = '220px';
  document.getElementById('jjwtBookMark').style.height = '500px';
}
function mOout() {
  document.getElementById('jjwtBookMark').style.width = '20px';
  document.getElementById('jjwtBookMark').style.height = '80px';
}
jjwtInitBookMark();