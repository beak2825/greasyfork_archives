// ==UserScript==
// @name         五网优化
// @namespace    https://penicillin.github.io/
// @version      2024-05-23
// @description  科学显示五网网页
// @author       Penicillinm
// @grant        none

// @include       https://www.fjpg.cn/contents/view?aid=*
// @include       https://www.fjpg.cn/contents/list?tid=*

// @include       http://www.minyun.com.cn/contents/view?aid=*
// @include       http://www.minyun.com.cn/contents/list?tid=*

// @include       http://www.mtpm.com/contents/view?aid=*
// @include       http://www.mtpm.com/contents/list?tid=*

// @include       http://www.minyun.com.cn/contents/view?aid=*

// @include       http://www.fjeship.com/contents/view?aid=*
// @include       http://www.fjeship.com/contents/list?tid=*

// @include       https://www.fjcqjy.com/html/fc/*

// @downloadURL https://update.greasyfork.org/scripts/493523/%E4%BA%94%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493523/%E4%BA%94%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var styleElement = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(styleElement);

//港口集团
if (document.URL.match(/fjpg.cn/)){
    styleElement.append('table {width: 100%;}');
    styleElement.append('.left_ce {display: none !important;}');
    styleElement.append('.right_ce {width: 100% !important;}');
    styleElement.append('#page li a {display: block !important;width:100% !important;}');
    styleElement.append('.right_ce table tr {height: auto !important;}');
    styleElement.append('* {user-select: unset !important;}');
    if(!document.match(/结果公示/)){styleElement.append('.right_ce {width: 100%;line-height: 1.2em;}')};
}

//闽运集团
if (document.URL.match(/www.minyun.com.cn\/contents\/view/)){
    styleElement.append('.article-content table {width: 100% !important;}');
    styleElement.append('body {background: none !important;}');
    styleElement.append('.article-content {width: 100% !important;left:0px !important;}');
    if(!document.match(/结果公示/)){styleElement.append('.article-content {width: 100% !important;left:0px !important;line-height: 1.2em !important;}')};
}
if (document.URL.match(/www.minyun.com.cn\/contents\/list/)){
    styleElement.append('.page div li {background: unset;border-radius: 5px;}');
    styleElement.append('.page div li a {color: #000 !important;}');
    styleElement.append('.thisclass a{display: block;  width: 20px;}');
}

//贸托
if (document.URL.match(/www.mtpm.com\/contents\/view/)){
    styleElement.append('.ny-left {display: none !important;}');
    styleElement.append('.ny-right {width: 100% !important;left:0px !important;}');
    styleElement.append('.ny-right .right-site {width: 100% !important;}');
    styleElement.append('.ny-right .c-right-box {width: 100% !important;}');
    styleElement.append('.ny-right .c-right-box span {width: 100% !important;line-height: 1.2em !important;}');
    styleElement.append('.ny-right .c-right-box table {width: 100% !important;}');
    styleElement.append('.ny-right .c-right-box table tr {height: auto !important;}');
    styleElement.append('.ny-right .c-right-box table tr td {height: auto !important;}');
}
if (document.URL.match(/www.mtpm.com\/contents\/list/)){
    styleElement.append('.right-box div li {display: inline-block;padding: 5px;border: 1px solid;margin: 0px 5px 10px;line-height: 1.2em !important;border-radius: 10px;}');
    styleElement.append('.thisclass {background-color:lightskyblue;}');
}


//八方
if (document.URL.match(/www.fjeship.com\/contents\/view/)){
    styleElement.append('* {font-weight: unset !important;font-family:unset !important;}');
    styleElement.append('.ny-left ,.viewbox{display: none !important;}');
    styleElement.append('.ny-right {width: 100% !important;left:0px !important;}');
    styleElement.append('.ny-right .right-site {width: 100% !important;}');
    styleElement.append('.ny-right .right-box {width: 100% !important;}');
    styleElement.append('.ny-right .right-box span {line-height: 1.2em !important;}');
    styleElement.append('.ny-right .right-box table {width: 100% !important;}');
    styleElement.append('.ny-right .right-box table tr {height: auto !important;}');
    styleElement.append('.ny-right .right-box table tr td {height: auto !important;}');
}
if (document.URL.match(/www.fjeship.com\/contents\/list/)){
    styleElement.append('.thisclass a{display: block;  width: 20px;  background: antiquewhite;  border-radius: 5px;}');
}

//产权
if (document.URL.match(/www.fjcqjy.com/)){
    styleElement.append('.mytools {display: none !important;}');
    styleElement.append('.project_box .project_content p {line-height: 1.2em !important;}');
    styleElement.append('.project_box .project_content table {width: 100% !important;}');
    styleElement.append('html body.bodyBg div.footer.footer--newsyears {height: auto !important;}');
    styleElement.append('html body.bodyBg div.footer.footer--newsyears div.col{display: none !important;}');
}