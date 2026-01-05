// ==UserScript==
// @name       快传文件改名
// @namespace  http://userscripts.org/scripts/show/155005
// @version    0.21
// @description  让快传显示文件的原来的名字，而不是被压缩过的
// @match      http://kuai.xunlei.com/d/*
// @copyright  2012+, G yc
// @downloadURL https://update.greasyfork.org/scripts/2434/%E5%BF%AB%E4%BC%A0%E6%96%87%E4%BB%B6%E6%94%B9%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/2434/%E5%BF%AB%E4%BC%A0%E6%96%87%E4%BB%B6%E6%94%B9%E5%90%8D.meta.js
// ==/UserScript==
var links = document.getElementsByClassName("file_name");
var i = 0;
for(i = 0; i <= links.length - 1; i++) {
    if(links[i].title != links[i].innerText) {
        links[i].innerText = links[i].title;
    }
}
var addStyle = function (cssText) {
    var head = document.querySelector('head');
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = cssText;
    head.appendChild(style);
};
var css = ' ' + '.adv_area, .file_right, .advl, .hot_list {' + '    display: none !important;' + '}' + '.file_left, .file_src, .file_src li {' + '    width: 100% !important;' + '    height: 100% !important;' + '}' + '.c_2, .c_2 a{' + '    width: auto !important;' + '}' + '.c4.status {' + '    width: 100px !important;' + '}' + '.c4 {' + '    float: right !important;' + '}';
addStyle(css);
var str = document.URL + "\n\r";
var files = document.getElementsByClassName("file_tr");
for(i = 0; i <= files.length - 1; i++) {
     str += files[i].innerText.trim() + "\n";
}
var txt = document.createElement("textarea");
txt.textContent = str;
txt.rows = links.length + 1;
txt.cols = "50";
var div = document.getElementsByClassName("file_left")[0];
div.appendChild(txt);


