// ==UserScript==
// @name         Ex124OJ
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Extend 124OJ!
// @author       Sukwants
// @license      MIT
// @match        http://124.221.194.184/*
// @icon         https://ex124oj.pond.ink/images/icon.png
// @grant        unsafeWindow
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      ex124oj.pond.ink
// @run-at       document-start
// @require      http://124.221.194.184/js/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455093/Ex124OJ.user.js
// @updateURL https://update.greasyfork.org/scripts/455093/Ex124OJ.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 579:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exAnnouncements = void 0;
function exAnnouncements() {
    var PostsExp = /<body[\s\S]*?>([\s\S]*?)<\/body>/;
    var WrittenByExp = /^by (.*)$/;
    var DateTimeExp = /^(.*?) .*$/;
    if (document.getElementsByClassName('uoj-content')[0].children[0].children[0].children[0]) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ex124oj.pond.ink/categories/Announcements/",
            nocache: true,
            onload: function (data) {
                var Announcements = document.querySelector('div.uoj-content > div.card.card-default > div.card-body > div.row > div:first-child > table');
                if (Announcements) {
                    Announcements.querySelector('thead > tr').innerHTML = '<th style="width:30%">公告</th><th style="width:10%"></th><th style="width:10%"></th><th style="width:30%">Ex 公告</th><th style="width:10%"></th><th style="width:10%"></th>';
                    var trs = Announcements.querySelectorAll('tbody > tr');
                    for (var tr = 0; tr < trs.length - 1; ++tr) {
                        if (trs[tr].innerHTML) {
                            trs[tr].innerHTML = (trs[tr].children.length > 2 ? trs[tr].innerHTML : '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>') + '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>';
                            if (WrittenByExp.test(trs[tr].children[1] && trs[tr].children[1].innerHTML)) {
                                trs[tr].children[1].innerHTML = trs[tr].children[1].innerHTML.match(WrittenByExp)[1];
                            }
                            if (DateTimeExp.test(trs[tr].children[2] && trs[tr].children[2].innerHTML)) {
                                trs[tr].children[2].innerHTML = '<small>' + trs[tr].children[2].textContent.match(DateTimeExp)[1] + '</small>';
                            }
                        }
                    }
                    trs[trs.length - 1].innerHTML = '<td class="text-right" colspan="3"><a href="/announcements">所有公告……</a></td><td class="text-right" colspan="3"><a href="https://ex124oj.pond.ink/categories/Announcements/">所有公告……</a></td>';
                    var PostsPage = (new DOMParser()).parseFromString(data.response, 'text/html');
                    var Posts = PostsPage.querySelectorAll('article');
                    for (var i = 0; i < Posts.length && i < 5; ++i) {
                        var title = Posts[i].querySelector('a.post-title-link');
                        Announcements.querySelector('tbody').children[i].children[3].innerHTML = "<a href=\"https://ex124oj.pond.ink".concat(title.getAttribute('href'), "\">").concat(title.innerText, "</a>");
                        Announcements.querySelector('tbody').children[i].children[4].innerHTML = '<a class="uoj-username" href="https://ex124oj.pond.ink/" style="color:rgb(40,173,202)">Ex124OJ</a>';
                        var date = Posts[i].querySelector('time');
                        Announcements.querySelector('tbody').children[i].children[5].innerHTML = '<small>' + date.getAttribute('content') + '</small>';
                    }
                }
            }
        });
    }
}
exports.exAnnouncements = exAnnouncements;


/***/ }),

/***/ 690:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.changeIcon = exports.Background = void 0;
var variables_1 = __webpack_require__(449);
function Background() {
    if (variables_1.BackgroundImage) {
        var titlebar = document.querySelector('div.container > div:first-child');
        if (titlebar) {
            titlebar.style.marginLeft = titlebar.style.marginRight = '-15px';
        }
        GM_addStyle("\nbody {\n    background: url(".concat(variables_1.BackgroundImage, ");\n    background-repeat: no-repeat;\n    background-attachment: fixed;\n    background-position: 50% 50%;\n    background-size: cover;\n}\n.uoj-content {\n    background-color: ").concat(!variables_1.Darktheme ? '#fff' : '#222', ";\n    margin: 16px -16px;\n    padding: 16px 16px;\n    opacity: 0.85;\n    border-radius: 8px;\n}\n.navbar {\n    margin: 16px -16px;\n    padding: 8px 16px;\n    opacity: 0.85;\n    border-radius: 8px;\n}\n.giscus {\n    opacity: 0.85;\n}\n        "));
    }
}
exports.Background = Background;
function getIcon() {
    if (variables_1.SiteIconImage)
        return variables_1.SiteIconImage;
    else
        return '/images/logo.png';
}
function changeIcon() {
    var LogoURLRegExp = /^.*\/images\/logo(_small){0,1}.png$/;
    var Links = document.getElementsByTagName('link');
    for (var link in Links) {
        if (Links[link] && Links[link].nodeType && Links[link].getAttribute('rel') == 'shortcut icon') {
            Links[link].setAttribute('href', getIcon());
        }
    }
    var Icons = document.getElementsByTagName('img');
    for (var icon in Icons) {
        if (Icons[icon] instanceof Element && Icons[icon].nodeType === Node.ELEMENT_NODE) {
            var srcAttribute = Icons[icon].getAttribute('src');
            if (srcAttribute !== null && LogoURLRegExp.test(srcAttribute)) {
                if (!Icons[icon].getAttribute('style')) {
                    Icons[icon].setAttribute('src', getIcon());
                    Icons[icon].setAttribute('style', 'width:100%;height:auto;object-fit:cover');
                }
                else {
                    Icons[icon].setAttribute('src', getIcon());
                }
            }
        }
    }
}
exports.changeIcon = changeIcon;


/***/ }),

/***/ 480:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeCopy = void 0;
var variables_1 = __webpack_require__(449);
function CodeCopy() {
    if (!(/^.*\/manage\/statement(\?.*){0,1}$/).test(window.location.href)) {
        var CodeBlocks = document.getElementsByTagName('pre');
        var _loop_1 = function (cb) {
            if (CodeBlocks[cb] && CodeBlocks[cb].nodeType) {
                var Content_1 = CodeBlocks[cb].innerText;
                CodeBlocks[cb].style.position = 'relative';
                var CopyButton_1 = document.createElement('button');
                CodeBlocks[cb].insertBefore(CopyButton_1, CodeBlocks[cb].children[0]);
                CopyButton_1.setAttribute('class', 'copybutton');
                CopyButton_1.setAttribute('id', "copybutton".concat(cb));
                if (variables_1.Darktheme)
                    CopyButton_1.setAttribute('style', "color: white;");
                CopyButton_1.innerHTML = '<i class="fa-solid fa-copy"></i>';
                CopyButton_1.onclick = function () {
                    GM_setClipboard(Content_1, 'text');
                    CopyButton_1.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(function () { CopyButton_1.innerHTML = '<i class="fa-solid fa-copy"></i>'; }, 500);
                };
            }
        };
        for (var cb in CodeBlocks) {
            _loop_1(cb);
        }
    }
}
exports.CodeCopy = CodeCopy;


/***/ }),

/***/ 103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContestStandings = exports.ContestHome = exports.ContestsCard = void 0;
var variables_1 = __webpack_require__(449);
var utils_1 = __webpack_require__(593);
function ContestsCard() {
    var content = document.querySelector('div.uoj-content');
    if (content && content.children.length > 1) {
        var TabList = document.createElement('ul');
        content.insertBefore(TabList, content.children[0]);
        TabList.setAttribute('class', 'nav nav-tabs');
        TabList.setAttribute('role', 'tablist');
        var TabContent = document.createElement('div');
        content.insertBefore(TabContent, content.children[1]);
        TabContent.setAttribute('class', 'tab-content');
        TabContent.style.marginBottom = '20px';
        TabContent.style.marginTop = '20px';
        var counter = 0;
        for (var i = 2; i < content.children.length; i++) {
            // console.log(content.children[i].tagName);
            if (content.children[i].tagName.toUpperCase() == 'H4') {
                var isActive = !counter;
                var title = document.createElement('li');
                TabList.appendChild(title);
                title.setAttribute('class', 'nav-item');
                var titleText = content.children[i].textContent;
                if (titleText) {
                    titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1);
                    title.innerHTML = "<a class=\"nav-link".concat(isActive ? ' active' : '', "\" href=\"#card").concat(counter, "\" role=\"tab\" data-toggle=\"tab\" aria-selected=\"true\">").concat(titleText, "</a>");
                }
                var card = document.createElement('div');
                TabContent.appendChild(card);
                card.setAttribute('class', "tab-pane".concat(isActive ? ' active' : ''));
                card.setAttribute('id', "card".concat(counter));
                content.removeChild(content.children[i]);
                counter++;
            }
            else if (counter) {
                TabContent.children[counter - 1].appendChild(content.children[i]);
            }
            else {
                content.removeChild(content.children[i]);
            }
            i--;
        }
    }
}
exports.ContestsCard = ContestsCard;
function ContestHome() {
    var content = document.querySelector('div.uoj-content');
    if (content && content.querySelectorAll('div').length < 2) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ex124oj.pond.ink/api/contest/".concat((0, utils_1.isContest)()[1]),
            nocache: true,
            onload: function (data) {
                if (data.status == 200) {
                    var res = JSON.parse(data.response);
                    var title = document.querySelector('head > title');
                    if (title && res.title) {
                        title.innerHTML = res.title;
                    }
                    var content_1 = document.querySelector('div.uoj-content');
                    if (content_1 && res.content) {
                        content_1.innerHTML = res.content;
                        eval('unsafeWindow.$(".countdown").countdown();');
                    }
                }
            }
        });
    }
}
exports.ContestHome = ContestHome;
function PinLineHeader() {
    var lines = document.querySelectorAll('div#standings > div.table-responsive > table tr');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var x = 0;
        for (var j = 0; j < line.children.length && j < 3; j++) {
            line.children[j].style.position = 'sticky';
            line.children[j].style.left = x + 'px';
            line.children[j].classList.add('checked');
            x = x + parseFloat(window.getComputedStyle(line.children[j]).width);
        }
    }
}
var ContestHomepage;
function ProblemTitles() {
    var solve = function () {
        var lines = document.querySelectorAll('div#standings > div.table-responsive > table tr');
        var problems = {};
        var rows = ContestHomepage.querySelectorAll('table > tbody > tr');
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].children.length >= 2) {
                var id = rows[i].children[0].textContent, title = rows[i].children[1].textContent;
                if (id && title) {
                    problems[id] = "".concat(id, ". ").concat(title);
                }
            }
        }
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            for (var j = 3; j < line.children.length; j++) {
                var title = lines[0].children[j].querySelector('a');
                if (title && title.textContent && problems[title.textContent]) {
                    line.children[j].title = problems[title.textContent];
                }
            }
        }
    };
    if (ContestHomepage) {
        solve();
    }
    else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "/contest/".concat(contest_id),
            nocache: true,
            onload: function (data) {
                ContestHomepage = (new DOMParser()).parseFromString(data.response, 'text/html');
                solve();
            }
        });
    }
}
var Problemchecked = [];
function ShowStandings() {
    PinLineHeader();
    ProblemTitles();
    var lines = document.querySelectorAll('div#standings > div.table-responsive > table tr');
    if (!lines.length) {
        return;
    }
    var sum = 0;
    for (var k = 0; k < lines.length; k++) {
        var _loop_1 = function (i) {
            if (Problemchecked[i - 3]) {
                lines[k].children[i].classList.add('checked');
                if (k == 0)
                    sum++;
            }
            lines[k].children[i].addEventListener('click', function (event) {
                var target = event.target;
                if (target.tagName === 'A') {
                    return;
                }
                Problemchecked[i - 3] = !Problemchecked[i - 3];
                displayStandings();
            });
        };
        for (var i = 3; i < lines[k].children.length; i++) {
            _loop_1(i);
        }
    }
    if (sum == 0) {
        return;
    }
    var scores = document.querySelectorAll('div#standings > div.table-responsive > table > tbody > tr > td:nth-child(3) > div > span.uoj-score');
    for (var i = 0; i < scores.length; i++) {
        scores[i].style.color = getColOfScore(standings[i][0] / sum);
    }
}
function displayStandings() {
    var standingsArea = document.querySelector('div#standings');
    if (!standingsArea) {
        return;
    }
    var lines = standingsArea.querySelectorAll('div.table-responsive > table tr');
    var headline = lines[0];
    var Problemsum = headline.children.length - 3;
    var Usersum = lines.length - 1;
    // let checked = false;
    // for (let i = 0; i < Problemsum; i++) {
    //     checked = checked || Problemchecked[i];
    // }
    for (var i = 0; i < Usersum; i++) {
        var name_1 = standings[i][2][0];
        standings[i][0] = standings[i][1] = 0;
        for (var j = 0; j < Problemsum; j++) {
            if ((Problemchecked[j] /* || !checked*/) && score[name_1][j] !== undefined) {
                standings[i][0] += score[name_1][j][0], standings[i][1] += score[name_1][j][1];
            }
        }
    }
    standings.sort(function (a, b) {
        return a[0] != b[0] ? b[0] - a[0] : a[1] - b[1];
    });
    for (var i = 0; i < Usersum; i++) {
        if (!i || standings[i][0] != standings[i - 1][0] || standings[i][1] != standings[i - 1][1]) {
            standings[i][3] = i + 1;
        }
        else {
            standings[i][3] = standings[i - 1][3];
        }
    }
    var tableBefore = document.querySelector('div.table-responsive');
    if (tableBefore && tableBefore.children[0]) {
        var ScrollRight = parseInt(window.getComputedStyle(tableBefore.children[0]).width) - tableBefore.scrollLeft;
        showStandings();
        ShowStandings();
        var tableAfter = document.querySelector('div.table-responsive');
        if (tableAfter && tableAfter.children[0]) {
            tableAfter.scrollLeft = parseInt(window.getComputedStyle(tableAfter.children[0]).width) - ScrollRight;
        }
    }
}
function NavBar(ProblemSum) {
    var navtabs = document.querySelector('div.uoj-content ul[role=tablist]');
    if (!navtabs) {
        return;
    }
    var navbar = document.createElement('div');
    navtabs.before(navbar);
    navbar.setAttribute('style', variables_1.Darktheme ? 'border-bottom: 1px solid #2e2e30;' : 'border-bottom: 1px solid #dee2e6;');
    var floatright = document.createElement('div');
    navbar.appendChild(floatright);
    floatright.setAttribute('class', 'float-right');
    var unselectall = document.createElement('a');
    floatright.appendChild(unselectall);
    unselectall.setAttribute('class', 'btn btn-info btn-sm');
    unselectall.setAttribute('target', '_blank');
    unselectall.style.color = '#fff';
    unselectall.style.cursor = 'pointer';
    unselectall.addEventListener('click', function () {
        Problemchecked = new Array(ProblemSum).fill(true);
        displayStandings();
    });
    unselectall.innerHTML = '全选';
    var selectall = document.createElement('a');
    floatright.appendChild(selectall);
    selectall.setAttribute('class', 'btn btn-primary btn-sm');
    selectall.setAttribute('target', '_blank');
    selectall.style.color = '#fff';
    selectall.style.cursor = 'pointer';
    selectall.addEventListener('click', function () {
        Problemchecked = new Array(ProblemSum).fill(false);
        displayStandings();
    });
    selectall.innerHTML = '全不选';
    navbar.appendChild(navtabs);
    navtabs.setAttribute('style', 'border-bottom: none');
}
function ContestStandings() {
    GM_addStyle("\ndiv#standings > div.table-responsive > table > thead > tr > th:nth-child(-n+3)::before,\ndiv#standings > div.table-responsive > table > tbody > tr > td:nth-child(-n+3)::before {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    right: 100%;\n    width: 1px;\n    height: 100%;\n    background-color: ".concat(variables_1.Darktheme ? '#2e2e30' : '#dee2e6', ";\n}\n\ndiv#standings > div.table-responsive > table > thead > tr > th.checked, \ndiv#standings > div.table-responsive > table > tbody > tr:nth-of-type(even) > td.checked {\n    background-color: ").concat(variables_1.Darktheme ? '#192523' : '#F4FFFF', ";\n}\ndiv#standings > div.table-responsive > table > tbody > tr:nth-of-type(odd) > td.checked {\n    background-color: ").concat(variables_1.Darktheme ? '#1F2B29' : '#F0FFFF', ";\n}\n\n"));
    var ProblemSum = document.querySelectorAll('div#standings > div.table-responsive > table > thead > tr > th').length - 3;
    Problemchecked = new Array(ProblemSum).fill(true);
    displayStandings();
    NavBar(ProblemSum);
}
exports.ContestStandings = ContestStandings;


/***/ }),

/***/ 992:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiscussionCard = void 0;
var variables_1 = __webpack_require__(449);
var variables_2 = __webpack_require__(449);
function DiscussionCard() {
    var _a;
    var footer = document.querySelector('div.uoj-footer');
    if (footer) {
        var discrd = document.createElement('div');
        discrd.setAttribute('class', 'giscus');
        footer.insertBefore(discrd, footer.firstChild);
        var writebutton = document.createElement('button');
        writebutton.setAttribute('class', 'btn btn-search btn-outline-primary');
        writebutton.style.height = 'calc(1.5em + 0.75rem + 2px)';
        writebutton.innerHTML = '<i class="fa fa-pen"> 写评论';
        writebutton.onclick = function () {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        };
        footer.insertBefore(writebutton, discrd);
        GM_addElement('script', {
            'src': 'https://giscus.app/client.js',
            'data-repo': 'Pond-Ink/Ex124OJ-discussions',
            'data-repo-id': 'R_kgDOImiZLA',
            'data-category': 'Ideas',
            'data-category-id': 'DIC_kwDOImiZLM4CTCIj',
            'data-mapping': 'pathname',
            'data-strict': '1',
            'data-reactions-enabled': '1',
            'data-emit-metadata': '0',
            'data-input-position': 'bottom',
            'data-theme': variables_2.Darktheme ? 'noborder_dark' : 'light',
            'data-lang': 'zh-CN',
            'data-loading': 'lazy',
            'crossorigin': 'anonymous',
            'async': ''
        });
        GM_addStyle("\n.giscus {\n    display: ".concat((variables_1.Academic == true ? 'none' : 'unset'), ";\n}\n.giscus-frame {\n    margin-top: 20px;\n}\n        "));
        var lanButton = document.getElementsByClassName('btn-group dropright mb-3')[0];
        var blankLine = document.createElement('div');
        blankLine.style.marginTop = '20px';
        (_a = lanButton.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(blankLine, lanButton);
    }
}
exports.DiscussionCard = DiscussionCard;


/***/ }),

/***/ 18:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.changeGravatarURL = void 0;
function changeGravatarURL() {
    var GravatarURLRegExp = /\/\/cn.gravatar.com\/avatar\/(.*)/;
    var Gravatars = document.querySelectorAll('img');
    for (var i in Gravatars) {
        if (Gravatars[i] && Gravatars[i].nodeType
            && GravatarURLRegExp.test(Gravatars[i].getAttribute('src'))
            && Gravatars[i].getAttribute('alt').toLowerCase().includes('avatar')) {
            Gravatars[i].setAttribute('src', '//cravatar.cn/avatar/' + Gravatars[i].getAttribute('src').match(GravatarURLRegExp)[1]);
        }
    }
}
exports.changeGravatarURL = changeGravatarURL;


/***/ }),

/***/ 819:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


//@ts-nocheck
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NameStyle = void 0;
var variables_1 = __webpack_require__(449);
var ccfbadgecode = function (color) { return "<svg width=\"1em\" height=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1600.000000 1600.000000\" style=\"margin-bottom:.25em!important;bottom:10px;--fa-badge-color:".concat(color, ";\"><g transform=\"translate(0.000000,1600.000000) scale(0.100000,-0.100000)\" fill=\"var(--fa-badge-color)\" stroke=\"none\"><path d=\"M7757 15990 c-453 -44 -890 -196 -1257 -437 -187 -124 -312 -227 -470 -390 -247 -253 -426 -521 -560 -839 -24 -54 -44 -101 -46 -103 -2 -2 -38 11 -81 29 -515 216 -1090 266 -1648 145 -505 -110 -976 -368 -1348 -739 -432 -430 -700 -976 -789 -1606 -20 -144 -17 -565 5 -710 38 -242 96 -459 179 -663 22 -54 38 -100 37 -101 -2 -2 -53 -24 -114 -50 -308 -131 -580 -314 -834 -561 -443 -432 -716 -972 -808 -1600 -24 -168 -24 -562 0 -730 92 -626 365 -1168 803 -1595 153 -149 248 -226 407 -331 142 -95 285 -172 432 -235 61 -26 112 -48 114 -50 1 -1 -15 -47 -37 -101 -83 -204 -141 -421 -179 -663 -22 -144 -25 -567 -5 -705 49 -342 131 -609 273 -895 377 -758 1084 -1298 1914 -1465 216 -43 290 -50 550 -50 187 1 279 5 365 18 242 38 459 96 663 179 54 22 100 38 101 37 2 -2 22 -49 46 -103 141 -334 319 -596 585 -862 238 -238 449 -391 730 -529 853 -418 1839 -373 2649 120 236 143 496 367 678 585 158 188 317 447 414 675 26 61 48 111 49 113 2 2 54 -17 117 -42 209 -83 440 -143 683 -178 120 -17 552 -17 670 0 50 7 144 24 210 37 1083 217 1932 1066 2150 2150 43 216 50 290 50 550 -1 187 -5 279 -18 365 -38 242 -96 459 -179 663 -22 54 -38 100 -37 101 2 2 49 22 103 46 334 141 596 319 862 585 172 172 247 263 368 447 596 907 592 2106 -12 3013 -123 185 -222 304 -388 465 -243 236 -538 431 -841 556 -48 20 -90 38 -92 39 -1 2 15 48 37 102 83 204 141 421 179 663 22 144 25 567 5 705 -49 340 -132 610 -273 895 -377 756 -1085 1299 -1909 1464 -222 45 -294 51 -555 51 -187 -1 -279 -5 -365 -18 -242 -38 -459 -96 -663 -179 -54 -22 -100 -38 -101 -37 -2 2 -22 49 -45 104 -202 478 -572 926 -1002 1211 -343 227 -723 374 -1125 434 -157 24 -501 34 -647 20z m2823 -5244 c44 -22 139 -112 492 -469 472 -477 489 -497 503 -614 8 -64 -15 -162 -53 -219 -38 -58 -4132 -4121 -4198 -4166 -64 -44 -145 -63 -223 -54 -126 15 -95 -12 -959 858 -438 442 -988 997 -1223 1233 -491 494 -484 484 -484 635 0 153 -10 140 498 642 512 507 507 503 657 503 152 -1 109 35 878 -740 l679 -685 1522 1510 c837 830 1537 1521 1556 1536 64 48 121 65 215 61 69 -3 96 -9 140 -31z\"/></g></svg>"); };
var ffcbadgecode = function (color) { return "<svg width=\"1em\" height=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1600.000000 1600.000000\" style=\"margin-bottom:.25em!important;bottom:10px;--fa-badge-color:".concat(color, ";\"><g transform=\"translate(0.000000,1600.000000) scale(0.100000,-0.100000)\" fill=\"var(--fa-badge-color)\" stroke=\"none\"><path d=\"M7757 15990 c-453 -44 -890 -196 -1257 -437 -187 -124 -312 -227 -470 -390 -247 -253 -426 -521 -560 -839 -24 -54 -44 -101 -46 -103 -2 -2 -38 11 -81 29 -515 216 -1090 266 -1648 145 -505 -110 -976 -368 -1348 -739 -432 -430 -700 -976 -789 -1606 -20 -144 -17 -565 5 -710 38 -242 96 -459 179 -663 22 -54 38 -100 37 -101 -2 -2 -53 -24 -114 -50 -308 -131 -580 -314 -834 -561 -443 -432 -716 -972 -808 -1600 -24 -168 -24 -562 0 -730 92 -626 365 -1168 803 -1595 153 -149 248 -226 407 -331 142 -95 285 -172 432 -235 61 -26 112 -48 114 -50 1 -1 -15 -47 -37 -101 -83 -204 -141 -421 -179 -663 -22 -144 -25 -567 -5 -705 49 -342 131 -609 273 -895 377 -758 1084 -1298 1914 -1465 216 -43 290 -50 550 -50 187 1 279 5 365 18 242 38 459 96 663 179 54 22 100 38 101 37 2 -2 22 -49 46 -103 141 -334 319 -596 585 -862 238 -238 449 -391 730 -529 853 -418 1839 -373 2649 120 236 143 496 367 678 585 158 188 317 447 414 675 26 61 48 111 49 113 2 2 54 -17 117 -42 209 -83 440 -143 683 -178 120 -17 552 -17 670 0 50 7 144 24 210 37 1083 217 1932 1066 2150 2150 43 216 50 290 50 550 -1 187 -5 279 -18 365 -38 242 -96 459 -179 663 -22 54 -38 100 -37 101 2 2 49 22 103 46 334 141 596 319 862 585 172 172 247 263 368 447 596 907 592 2106 -12 3013 -123 185 -222 304 -388 465 -243 236 -538 431 -841 556 -48 20 -90 38 -92 39 -1 2 15 48 37 102 83 204 141 421 179 663 22 144 25 567 5 705 -49 340 -132 610 -273 895 -377 756 -1085 1299 -1909 1464 -222 45 -294 51 -555 51 -187 -1 -279 -5 -365 -18 -242 -38 -459 -96 -663 -179 -54 -22 -100 -38 -101 -37 -2 2 -22 49 -45 104 -202 478 -572 926 -1002 1211 -343 227 -723 374 -1125 434 -157 24 -501 34 -647 20z m-1670 -4681 c55 -20 88 -51 573 -533 283 -282 722 -718 976 -970 l461 -457 794 787 c437 434 869 863 961 954 184 182 245 223 343 235 75 10 175 -15 237 -58 25 -17 239 -228 475 -467 323 -328 435 -447 453 -485 21 -42 25 -65 25 -145 0 -82 -4 -103 -27 -152 -28 -60 18 -13 -1506 -1538 l-454 -455 793 -800 c436 -440 868 -875 959 -967 182 -184 223 -245 235 -343 10 -75 -15 -175 -58 -237 -17 -25 -228 -239 -467 -475 -328 -323 -447 -435 -485 -453 -42 -21 -65 -25 -145 -25 -82 0 -103 4 -152 27 -60 28 -14 -17 -1539 1507 l-456 456 -544 -535 c-299 -294 -737 -726 -974 -961 -336 -333 -441 -430 -479 -448 -101 -46 -213 -46 -311 0 -56 26 -88 57 -582 559 -340 345 -372 380 -391 433 -29 78 -30 185 -1 264 20 55 51 88 533 573 282 283 719 723 971 977 l458 462 -529 538 c-291 296 -720 732 -955 968 -333 336 -430 441 -448 479 -46 101 -46 213 0 311 26 56 57 88 559 582 335 330 381 372 430 391 76 29 189 29 267 1z\"/></g></svg>"); };
var tagbadgecode = function (color, text) { return "<span style=\"background-color:".concat(color, ";padding:0.2em 0.6em;border-radius:.2em;color:#fff;font-size:0.7em;font-weight:bold;display:inline-block\">").concat(text, "</span>"); };
function avail(name) {
    return !variables_1.GroupBelong[name] || variables_1.GroupsEnabled.includes(variables_1.GroupBelong[name]);
}
function getUserLink_Ex124OJ(username, rating, addSymbol) {
    if (!username) {
        return '';
    }
    if (addSymbol == undefined) {
        addSymbol = true;
    }
    var text = username, at, color = getColOfRating(rating);
    if (username.charAt(0) == '@') {
        at = true;
        username = username.substr(1);
    }
    if (variables_1.NameColorList && variables_1.NameColorList[username] && avail(username)) {
        text = '';
        for (var char = 1; char < variables_1.NameColorList[username].length; char++) {
            text += "<font style=\"color:".concat(variables_1.NameColorList[username][char], "\">").concat(username.substring(char - 1, char), "</font>");
        }
        text += username.substring(variables_1.NameColorList[username].length - 1);
        if (at)
            text = '@' + text;
        color = variables_1.NameColorList[username][0];
    }
    if (variables_1.CCFBadgeList && variables_1.CCFBadgeList[username]) {
        for (var j in variables_1.CCFBadgeList[username]) {
            text += " ".concat(ccfbadgecode(variables_1.CCFBadgeList[username][j]));
        }
    }
    if (variables_1.FFCBadgeList && variables_1.FFCBadgeList[username]) {
        for (var j in variables_1.FFCBadgeList[username]) {
            text += " ".concat(ffcbadgecode(variables_1.FFCBadgeList[username][j]));
        }
    }
    if (variables_1.TagBadgeList && variables_1.TagBadgeList[username] && avail(username)) {
        for (var j in variables_1.TagBadgeList[username]) {
            text += " ".concat(tagbadgecode(variables_1.TagBadgeList[username][j].color, variables_1.TagBadgeList[username][j].text));
        }
    }
    if (addSymbol) {
        if (rating >= 2500) {
            text += '<sup>';
            for (var i = 2500; i <= rating; i += 200) {
                text += "&alefsym;";
            }
            text += "</sup>";
        }
    }
    return '<a class="uoj-username" href="' + uojHome + '/user/profile/' + username + '" style="color:' + color + '">' + text + '</a>';
}
function getUserSpan_Ex124OJ(username, rating, addSymbol) {
    if (!username) {
        return '';
    }
    if (addSymbol == undefined) {
        addSymbol = true;
    }
    var text = username, at, color = getColOfRating(rating);
    if (username.charAt(0) == '@') {
        at = true;
        username = username.substr(1);
    }
    if (variables_1.NameColorList && variables_1.NameColorList[username] && avail(username)) {
        text = '';
        for (var char = 1; char < variables_1.NameColorList[username].length; char++) {
            text += "<font style=\"color:".concat(variables_1.NameColorList[username][char], "\">").concat(username.substring(char - 1, char), "</font>");
        }
        text += username.substring(variables_1.NameColorList[username].length - 1);
        if (at)
            text = '@' + text;
        color = variables_1.NameColorList[username][0];
    }
    if (variables_1.CCFBadgeList && variables_1.CCFBadgeList[username]) {
        for (var j in variables_1.CCFBadgeList[username]) {
            text += " ".concat(ccfbadgecode(variables_1.CCFBadgeList[username][j]));
        }
    }
    if (variables_1.FFCBadgeList && variables_1.FFCBadgeList[username]) {
        for (var j in variables_1.FFCBadgeList[username]) {
            text += " ".concat(ffcbadgecode(variables_1.FFCBadgeList[username][j]));
        }
    }
    if (variables_1.TagBadgeList && variables_1.TagBadgeList[username] && avail(username)) {
        for (var j in variables_1.TagBadgeList[username]) {
            text += " ".concat(tagbadgecode(variables_1.TagBadgeList[username][j].color, variables_1.TagBadgeList[username][j].text));
        }
    }
    if (addSymbol) {
        if (rating >= 2500) {
            text += '<sup>';
            for (var i = 2500; i <= rating; i += 200) {
                text += "&alefsym;";
            }
            text += "</sup>";
        }
    }
    return '<span class="uoj-username" style="color:' + color + '">' + text + '</span>';
}
function uoj_honor_Ex124OJ() {
    return this.each(function () {
        var honor = $(this).text();
        var rating = $(this).data("rating");
        if (isNaN(rating)) {
            return;
        }
        var text = honor, color = getColOfRating(rating);
        if (variables_1.NameColorList && variables_1.NameColorList[honor]) {
            text = '';
            for (var char = 1; char < variables_1.NameColorList[honor].length; char++) {
                text += "<font style=\"color:".concat(variables_1.NameColorList[honor][char], "\">").concat(honor.substring(char - 1, char), "</font>");
            }
            text += honor.substring(variables_1.NameColorList[honor].length - 1);
            color = variables_1.NameColorList[honor][0];
        }
        if (variables_1.CCFBadgeList && variables_1.CCFBadgeList[honor]) {
            for (var j in variables_1.CCFBadgeList[honor]) {
                text += " ".concat(ccfbadgecode(variables_1.CCFBadgeList[honor][j]));
            }
        }
        if (variables_1.FFCBadgeList && variables_1.FFCBadgeList[honor]) {
            for (var j in variables_1.FFCBadgeList[honor]) {
                text += " ".concat(ffcbadgecode(variables_1.FFCBadgeList[honor][j]));
            }
        }
        if (variables_1.TagBadgeList && variables_1.TagBadgeList[honor]) {
            for (var j in variables_1.TagBadgeList[honor]) {
                text += " ".concat(tagbadgecode(variables_1.TagBadgeList[honor][j].color, variables_1.TagBadgeList[honor][j].text));
            }
        }
        if (rating >= 2500) {
            text += '<sup>';
            for (var i = 2500; i <= rating; i += 200) {
                text += "&alefsym;";
            }
            text += "</sup>";
        }
        $(this).css("color", color).html(text);
        if (variables_1.GroupBelong[honor]) {
            $(this).attr('title', "Ex124OJ Group: ".concat(variables_1.GroupBelong[honor]));
        }
    });
}
function launchNameStyle() {
    var _a, _b;
    unsafeWindow.getUserLink = getUserLink_Ex124OJ;
    unsafeWindow.getUserSpan = getUserSpan_Ex124OJ;
    (_b = (_a = unsafeWindow.$) === null || _a === void 0 ? void 0 : _a.fn) === null || _b === void 0 ? void 0 : _b.uoj_honor = uoj_honor_Ex124OJ;
}
function NameStyle() {
    unsafeWindow.launchNameStyle = launchNameStyle;
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = "\n        launchNameStyle();\n    ";
    document.head.appendChild(script);
    $(document).ready(function () {
        launchNameStyle();
    });
}
exports.NameStyle = NameStyle;


/***/ }),

/***/ 823:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Problem = void 0;
var utils_1 = __webpack_require__(593);
var variables_1 = __webpack_require__(449);
var code_1 = __webpack_require__(480);
function appendsource() {
    var mathjaxconfig = document.createElement('script');
    mathjaxconfig.type = 'text/x-mathjax-config';
    mathjaxconfig.innerHTML = "\n        MathJax.Hub.Config({\n            showProcessingMessages: false,\n            tex2jax: {\n                inlineMath: [[\"$\", \"$\"], [\"\\\\(\", \"\\\\)\"]],\n                processEscapes:true\n            },\n            menuSettings: {\n                zoom: \"Hover\"\n            }\n        });\n    ";
    document.head.appendChild(mathjaxconfig);
    var mathjax = document.createElement('script');
    mathjax.src = '//cdn.bootcss.com/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML';
    document.head.appendChild(mathjax);
    var jquery = document.createElement('script');
    jquery.src = 'http://124.221.194.184/js/jquery.form.min.js';
    document.head.appendChild(jquery);
    var shtypical = document.createElement('link');
    shtypical.type = 'text/css';
    shtypical.rel = 'stylesheet';
    shtypical.href = 'http://124.221.194.184/css/sh_typical.min.css';
    document.head.append(shtypical);
    var shmain = document.createElement('script');
    shmain.src = 'http://124.221.194.184/js/sh_main.min.js';
    document.head.appendChild(shmain);
    shmain.addEventListener('load', function () {
        sh_highlightDocument();
    });
}
function Problem() {
    GM_addStyle("\n.partly-hidden {\n    transition: opacity 125ms;\n}\n.partly-hidden:not(:hover) {\n    opacity: 0;\n}\n    ");
    var uojcontent = document.querySelector('div.uoj-content');
    if (!uojcontent) {
        return;
    }
    if (!uojcontent.querySelectorAll('.page-header').length) {
        var lostpage_1 = document.body.innerHTML;
        uojcontent.innerHTML = "\n<div class=\"row d-flex justify-content-center\">\n    <span class=\"badge badge-secondary mr-1\" id=\"time-limit\">\u65F6\u95F4\u9650\u5236:</span>\n    <span class=\"badge badge-secondary mr-1\" id=\"memory-limit\">\u7A7A\u95F4\u9650\u5236:</span>\n</div>\n<div class=\"float-right\">\n    <div class=\"uoj-click-zan-block\" id=\"vote\"></div>\n</div>\n".concat((function () {
            if ((0, utils_1.isProblem)()[2]) {
                return "\n<div class=\"page-header row\">\n    <h1 class=\"col-md-3 text-left\" id=\"contest-name\"><small></small></h1>\n    <h1 class=\"col-md-7 text-center\" id=\"problem-name\"></h1>\n    <div class=\"col-md-2 text-right\" id=\"contest-countdown\"></div>\n</div>\n        ";
            }
            else {
                return "<h1 class=\"page-header text-center\" id=\"problem-name\"></h1>";
            }
        })(), "\n<a role=\"button\" class=\"btn btn-info float-right\" href=\"").concat((0, utils_1.isProblem)()[2] ? "/contest/".concat((0, utils_1.isProblem)()[2]) : '', "/problem/").concat((0, utils_1.isProblem)()[3], "/statistics\"><span class=\"glyphicon glyphicon-stats\"></span> \u7EDF\u8BA1</a>\n\n<ul class=\"nav nav-tabs\" role=\"tablist\">\n    <li class=\"nav-item\"><a class=\"nav-link active\" href=\"#tab-statement\" role=\"tab\" data-toggle=\"tab\"><span class=\"glyphicon glyphicon-book\"></span> \u63CF\u8FF0</a></li>\n    ").concat((0, utils_1.isProblem)()[2] ? "<li class=\"nav-item\"><a class=\"nav-link\" id=\"nav-contest\" href=\"/contest/".concat((0, utils_1.isProblem)()[2], "\" role=\"tab\">\u8FD4\u56DE\u6BD4\u8D5B</a></li>") : '', "\n</ul>\n<div class=\"tab-content\">\n    <div class=\"tab-pane active\" id=\"tab-statement\">\n    </div>\n</div>");
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ex124oj.pond.ink/api".concat((0, utils_1.isProblem)()[2] ? "/contest/".concat((0, utils_1.isProblem)()[2]) : '', "/problem/").concat((0, utils_1.isProblem)()[3]),
            nocache: true,
            onload: function (data) {
                if (data.status == 200) {
                    var res = JSON.parse(data.response);
                    var title = document.querySelector('head > title');
                    if (title && res.title) {
                        title.innerHTML = res.title;
                    }
                    var problename = document.querySelector('#problem-name');
                    if (problename && res.problemname) {
                        problename.innerHTML = res.problemname;
                    }
                    var contestname = document.querySelector('#contest-name');
                    if (contestname && res.contestname) {
                        contestname.innerHTML = res.contestname;
                    }
                    var statement = document.querySelector('#tab-statement');
                    if (statement && res.statement) {
                        statement.innerHTML = res.statement;
                    }
                    var timelimit = document.querySelector('#time-limit');
                    if (timelimit && res.timelimit) {
                        timelimit.innerHTML = res.timelimit;
                    }
                    var memorylimit = document.querySelector('#memory-limit');
                    if (memorylimit && res.memorylimit) {
                        memorylimit.innerHTML = res.memorylimit;
                    }
                    var vote = document.querySelector('#vote');
                    if (vote && res.vote) {
                        vote.innerHTML = res.vote;
                        eval('$(".uoj-click-zan-block").click_zan_block();');
                    }
                    var countdown = document.querySelector('#contest-countdown');
                    if (countdown && res.script) {
                        eval(res.script);
                    }
                    appendsource();
                    (0, code_1.CodeCopy)();
                }
                else {
                    document.body.innerHTML = lostpage_1;
                }
            }
        });
    }
    var tabcontent = document.querySelector('div.tab-content');
    if (tabcontent) {
        var navbar_1 = document.createElement('div');
        tabcontent.before(navbar_1);
        navbar_1.setAttribute('style', 'border-bottom: 1px solid ' + (variables_1.Darktheme ? '#2e2e30' : '#dee2e6;'));
        var statisticsButton = document.querySelector('div.uoj-content > a[role=button]');
        if (statisticsButton)
            navbar_1.appendChild(statisticsButton);
        var DownloadTag_1 = document.createElement('a');
        navbar_1.appendChild(DownloadTag_1);
        DownloadTag_1.setAttribute('role', 'button');
        DownloadTag_1.setAttribute('class', 'btn btn-secondary float-right partly-hidden');
        DownloadTag_1.setAttribute('href', '/download.php?type=problem&id=' + (0, utils_1.isProblem)()[3]);
        DownloadTag_1.setAttribute('target', '_blank');
        DownloadTag_1.innerHTML = '<span class="glyphicon glyphicon-download-alt"></span> 下载数据';
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://ex124oj.pond.ink/api/problem/".concat((0, utils_1.isProblem)()[3], "/markdown"),
            onload: function (data) {
                if (data.status === 200) {
                    var copy_md_1 = document.createElement('a');
                    navbar_1.insertBefore(copy_md_1, DownloadTag_1);
                    copy_md_1.setAttribute('role', 'button');
                    copy_md_1.setAttribute('class', 'btn btn-primary float-right');
                    copy_md_1.setAttribute('href', 'javascript:void(0)');
                    copy_md_1.innerHTML = '<i class="fa-brands fa-markdown"></i> 复制 MD';
                    var problem_md_text_1 = data.response;
                    copy_md_1.addEventListener('click', function () {
                        GM_setClipboard(problem_md_text_1, "text");
                        copy_md_1.innerHTML = '<i class="fa-solid fa-check"></i> 复制 MD';
                        setTimeout(function () { copy_md_1.innerHTML = '<i class="fa-brands fa-markdown"></i> 复制 MD'; }, 500);
                    });
                }
                else {
                    console.error('fail to get markdown text');
                }
            }
        });
        var navtabs = document.querySelector('div.uoj-content > ul[role=tablist]');
        if (navtabs) {
            navbar_1.appendChild(navtabs);
            navtabs.setAttribute('style', 'border-bottom: none');
            var TJTag = document.createElement('li');
            navtabs.insertBefore(TJTag, null);
            TJTag.setAttribute('class', 'nav-item partly-hidden');
            var TJInnerTag = document.createElement('a');
            TJTag.appendChild(TJInnerTag);
            TJInnerTag.setAttribute('role', 'tab');
            TJInnerTag.setAttribute('class', 'nav-link');
            TJInnerTag.setAttribute('href', '/download.php?type=tj&id=' + (0, utils_1.isProblem)()[3]);
            TJInnerTag.innerHTML = '<span class="glyphicon glyphicon-book"></span> 题解';
        }
    }
}
exports.Problem = Problem;


/***/ }),

/***/ 310:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = void 0;
var variables_1 = __webpack_require__(449);
function Settings() {
    var _a;
    GM_addStyle("\n.settings-overlay {\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    transition: visibility 0.4s, background 0.4s;\n    top: 0;\n    left: 0;\n    visibility: hidden;\n    z-index: 229;\n}\n.settings-popup-active .settings-overlay {\n    background: ".concat(variables_1.Darktheme ? 'rgb(255,255,255,.3)' : 'rgb(0,0,0,.3)', ";\n    visibility: visible;\n}\n.settings-popup {\n    width: 60%;\n    position: relative;\n    transform: translate(-50%, -50%);\n    top: 50%;\n    left: 50%;\n    visibility: hidden;\n    border-radius: .5rem;\n    padding: 20px 20px;\n}\n.settings-popup-active .settings-overlay .settings-popup {\n    background: ").concat(variables_1.Darktheme ? '#222' : '#ffffff', ";\n    visibility: visible;\n}\n.settings-popup .row {\n    padding: 0 30px 30px;\n}\n.settings-popup .row * {\n    margin-bottom: 0;\n}\n.settings-titlebar {\n    padding: 10px 20px 30px 20px !important;\n}\n.settings-titlebar h4 {\n    position: relative;\n    top: 50%;\n    left: 0;\n    transform: translate(0, -50%);\n}\n.settings-footerbar {\n    height: 60px;\n    padding: 20px 20px;\n}\n.switch {\n    position: relative;\n    vertical-align: middle;\n    width: 60px;\n    height: 28px;\n}\n.switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n.settings-popup-active .slider {\n    position: absolute;\n    visibility: visible;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: ").concat(variables_1.Darktheme ? '#333' : '#ccc', ";\n    transition: background-color .4s;\n    transition: visiblility 0s;\n    border-radius: 28px;\n}\n.settings-popup-active .slider:before {\n    position: absolute;\n    visibility: visible;\n    content: \"\";\n    height: 20px;\n    width: 20px;\n    left: 4px;\n    bottom: 4px;\n    background-color: ").concat(variables_1.Darktheme ? '#222' : '#ffffff', ";\n    transition: .4s;\n    border-radius: 50%;\n}\ninput:checked + .slider {\n    background-color: #28ADCA;\n}\ninput:checked + .slider:before {\n    transform: translateX(32px);\n}"));
    var HomepageEntrance = document.createElement('li');
    var NavBarTablist = document.querySelector('div[role=main] > div > ul[role=tablist]');
    NavBarTablist.insertBefore(HomepageEntrance, NavBarTablist.firstChild);
    HomepageEntrance.setAttribute('class', 'nav-item');
    HomepageEntrance.innerHTML = '<span style="padding: 0.5rem 1rem; cursor:pointer"><span style="background-color: #28adca;padding:0.2em 0.6em;border-radius: 1em;color:#fff;font-size: 0.7em;font-weight:bold;display:inline-block;position: relative;top: 50%;transform: translate(0,-50%);">Ex124OJ</span></span>';
    HomepageEntrance.onclick = function () {
        document.body.setAttribute('class', 'settings-popup-active');
    };
    var SettingsOverlay = document.createElement('div');
    document.body.insertBefore(SettingsOverlay, document.body.firstChild);
    SettingsOverlay.setAttribute('class', 'settings-overlay');
    var SettingsPopup = document.createElement('div');
    SettingsOverlay.appendChild(SettingsPopup);
    SettingsPopup.setAttribute('class', 'settings-popup');
    var SettingsTitlebar = document.createElement('div');
    SettingsPopup.appendChild(SettingsTitlebar);
    SettingsTitlebar.setAttribute('class', 'row settings-titlebar');
    SettingsTitlebar.innerHTML = '<h3 style="width:100%;height:3.5rem"><img src="https://ex124oj.pond.ink/images/icon.png" style="height:3.5rem;width:3.5rem;margin-right:10px"><span style="vertical-align:middle"> Ex124OJ 控制面板</span> <span style="vertical-align:middle;cursor:pointer;margin:0 10px" onclick="window.open(\'https://ex124oj.pond.ink/\');"><span style="height:1.75rem;line-height:3.5rem;vertical-align:middle;padding:0 .5rem;background-color:#28adca;border-radius:1em;color:#fff;font-size:1.2rem;font-weight:bold">Ex124OJ</span></span><span style="color:#7f7f7f;line-height:3.5rem;vertical-align:middle;font-size:1.2rem">' + variables_1.version + '</span></h3>';
    var SettingsCloseButton = document.createElement('span');
    SettingsPopup.appendChild(SettingsCloseButton);
    SettingsCloseButton.setAttribute('style', 'position: fixed;right: 20px;top:20px;cursor: pointer');
    SettingsCloseButton.setAttribute('onclick', 'document.body.setAttribute(\'class\', \'\');');
    SettingsCloseButton.innerHTML = '<h4><i class="fa fa-xmark"></i></h4>';
    var background = document.createElement('div');
    SettingsPopup.appendChild(background);
    background.setAttribute('class', 'row');
    var backgroundImageLabel = document.createElement('strong');
    background.appendChild(backgroundImageLabel);
    backgroundImageLabel.setAttribute('style', 'font-size: 1.25em');
    backgroundImageLabel.innerHTML = '背景图片&emsp;&emsp;&emsp;&emsp;';
    var backgroundImageInput = document.createElement('input');
    background.appendChild(backgroundImageInput);
    backgroundImageInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: initial');
    backgroundImageInput.setAttribute('class', 'form-control');
    var siteIcon = document.createElement('div');
    SettingsPopup.appendChild(siteIcon);
    siteIcon.setAttribute('class', 'row');
    var siteIconImageLabel = document.createElement('strong');
    siteIcon.appendChild(siteIconImageLabel);
    siteIconImageLabel.setAttribute('style', 'font-size: 1.25em');
    siteIconImageLabel.innerHTML = '网站图标&emsp;&emsp;&emsp;&emsp;';
    var siteIconImageInput = document.createElement('input');
    siteIcon.appendChild(siteIconImageInput);
    siteIconImageInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: initial');
    siteIconImageInput.setAttribute('class', 'form-control');
    var EnabledGroupsR = document.createElement('div');
    SettingsPopup.appendChild(EnabledGroupsR);
    EnabledGroupsR.setAttribute('class', 'row');
    var EnabledGroupsLabel = document.createElement('strong');
    EnabledGroupsR.appendChild(EnabledGroupsLabel);
    EnabledGroupsLabel.setAttribute('style', 'font-size: 1.25em');
    EnabledGroupsLabel.innerHTML = '选中组别&emsp;&emsp;&emsp;&emsp;';
    var EnabledGroupsInput = document.createElement('input');
    EnabledGroupsR.appendChild(EnabledGroupsInput);
    EnabledGroupsInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: initial');
    EnabledGroupsInput.setAttribute('class', 'form-control');
    var Switchs = document.createElement('div');
    SettingsPopup.appendChild(Switchs);
    Switchs.setAttribute('class', 'row');
    var academic = document.createElement('div');
    Switchs.appendChild(academic);
    var academicLabel = document.createElement('strong');
    academic.appendChild(academicLabel);
    academicLabel.setAttribute('style', 'font-size: 1.25em; vertical-align: middle;');
    academicLabel.innerHTML = '学术模式&emsp;&emsp;&emsp;&emsp;';
    var academicSwitch = document.createElement('label');
    academicSwitch.className = 'switch';
    academic.appendChild(academicSwitch);
    academicSwitch.innerHTML = '<input type="checkbox" id="AcademicSwitch" style="display: none;">\n<i id="AcademicSwitchIcon" class="slider"></i>';
    {
        var space = document.createElement('p');
        Switchs.appendChild(space);
        space.innerHTML = '&emsp;&emsp;&emsp;&emsp;';
    }
    var ligatures = document.createElement('div');
    Switchs.appendChild(ligatures);
    var ligaturesLabel = document.createElement('strong');
    ligatures.appendChild(ligaturesLabel);
    ligaturesLabel.setAttribute('style', 'font-size: 1.25em; vertical-align: middle;');
    ligaturesLabel.innerHTML = '代码连字&emsp;&emsp;&emsp;&emsp;';
    var ligaturesSwitch = document.createElement('label');
    ligaturesSwitch.className = 'switch';
    ligatures.appendChild(ligaturesSwitch);
    ligaturesSwitch.innerHTML = '<input type="checkbox" id="LigaturesSwitch" style="display: none;">\n<i id="LigaturesSwitchIcon" class="slider"></i>';
    {
        var space = document.createElement('p');
        Switchs.appendChild(space);
        space.innerHTML = '&emsp;&emsp;&emsp;&emsp;';
    }
    var darktheme = document.createElement('div');
    Switchs.appendChild(darktheme);
    var darkthemeLabel = document.createElement('strong');
    darktheme.appendChild(darkthemeLabel);
    darkthemeLabel.setAttribute('style', 'font-size: 1.25em; vertical-align: middle;');
    darkthemeLabel.innerHTML = '主题风格&emsp;&emsp;&emsp;&emsp;';
    var darkthemeSelect = document.createElement('select');
    darktheme.appendChild(darkthemeSelect);
    darkthemeSelect.classList.add('form-control');
    darkthemeSelect.style.display = 'inline-block';
    darkthemeSelect.style.width = 'unset';
    darkthemeSelect.style.verticalAlign = 'middle';
    darkthemeSelect.innerHTML = '<option value="follow">跟随系统</option><option value="light">Light</option><option value="dark">Dark</option>';
    var NewYearMagicR = document.createElement('div');
    var NameColorLabel = document.createElement('strong');
    var NameColorInput = document.createElement('input');
    var TagColorLabel = document.createElement('strong');
    var TagColorInput = document.createElement('input');
    var TagContentLabel = document.createElement('strong');
    var TagContentInput = document.createElement('input');
    NewYearMagicR.setAttribute('class', 'row');
    NewYearMagicR.appendChild(NameColorLabel);
    NameColorLabel.setAttribute('style', 'font-size: 1.25em');
    NameColorLabel.innerHTML = 'NameColor&emsp;';
    NewYearMagicR.appendChild(NameColorInput);
    NameColorInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: 100px');
    NameColorInput.setAttribute('class', 'form-control');
    NewYearMagicR.setAttribute('class', 'row');
    NewYearMagicR.appendChild(TagColorLabel);
    TagColorLabel.setAttribute('style', 'font-size: 1.25em');
    TagColorLabel.innerHTML = '&emsp;TagColor&emsp;';
    NewYearMagicR.appendChild(TagColorInput);
    TagColorInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: 100px');
    TagColorInput.setAttribute('class', 'form-control');
    NewYearMagicR.setAttribute('class', 'row');
    NewYearMagicR.appendChild(TagContentLabel);
    TagContentLabel.setAttribute('style', 'font-size: 1.25em');
    TagContentLabel.innerHTML = '&emsp;TagContent&emsp;';
    NewYearMagicR.appendChild(TagContentInput);
    TagContentInput.setAttribute('style', 'flex-grow: 1; height: 2em; width: 100px');
    TagContentInput.setAttribute('class', 'form-control');
    if (variables_1.NewYearMagic)
        SettingsPopup.appendChild(NewYearMagicR);
    backgroundImageInput.value = variables_1.BackgroundImage;
    siteIconImageInput.value = variables_1.SiteIconImage;
    EnabledGroupsInput.value = variables_1.EnabledGroups;
    document.getElementById('AcademicSwitch').checked = variables_1.Academic;
    document.getElementById('LigaturesSwitch').checked = variables_1.Ligatures;
    darkthemeSelect.value = variables_1.DarkthemeSelect;
    var UserName = (_a = document.getElementsByClassName('nav-link dropdown-toggle')[0].firstElementChild.childNodes[0].textContent) === null || _a === void 0 ? void 0 : _a.trimEnd();
    if (variables_1.NewYearMagic) {
        NameColorInput.value = variables_1.NameColorList[UserName].join(',');
        TagColorInput.value = variables_1.TagBadgeList[UserName][0].color;
        TagContentInput.value = variables_1.TagBadgeList[UserName][0].text;
    }
    var FooterRow = document.createElement('div');
    FooterRow.setAttribute('class', 'settings-footerbar');
    SettingsPopup.appendChild(FooterRow);
    var Ok = document.createElement('button');
    FooterRow.appendChild(Ok);
    Ok.setAttribute('class', 'btn btn-search btn-outline-primary float-right');
    Ok.innerHTML = '保存';
    Ok.onclick = function () {
        GM_setValue('BackgroundImage', backgroundImageInput.value);
        GM_setValue('SiteIconImage', siteIconImageInput.value);
        GM_setValue('EnabledGroups', EnabledGroupsInput.value);
        GM_setValue('Academic', document.getElementById('AcademicSwitch').checked);
        GM_setValue('Ligatures', document.getElementById('LigaturesSwitch').checked);
        GM_setValue('Darktheme', darkthemeSelect.value);
        if (variables_1.NewYearMagic && (NameColorInput.value != variables_1.NameColorList[UserName].join(',') || TagColorInput.value != variables_1.TagBadgeList[UserName][0].color || TagContentInput.value != variables_1.TagBadgeList[UserName][0].text)) {
            fetch("http://124.221.194.184/user/msg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    user_msg: "1",
                    receiver: variables_1.NewYearMagicBot,
                    message: "{\"NameColor\": ".concat(NameColorInput.value ? "\"".concat(NameColorInput.value, "\"") : "null", ", \"TagColor\": ").concat(TagColorInput.value ? "\"".concat(TagColorInput.value, "\"") : "null", ", \"TagContent\": ").concat(TagContentInput.value ? "\"".concat(TagContentInput.value, "\"") : "null", "}")
                }),
            });
            fetch("https://ex124oj.pond.ink/api/magic/".concat(UserName), {
                method: "POST",
                headers: {},
                body: new URLSearchParams({}),
            });
            var start = Date.now();
            while (Date.now() - start < 2000) { }
        }
        location.reload();
    };
    var Clear = document.createElement('button');
    FooterRow.appendChild(Clear);
    Clear.setAttribute('class', 'btn btn-search btn-outline-primary float-right');
    Clear.innerHTML = '恢复默认';
    Clear.onclick = function () {
        var values = GM_listValues();
        for (var value in values) {
            GM_deleteValue(values[value]);
        }
        location.reload();
    };
}
exports.Settings = Settings;


/***/ }),

/***/ 978:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Submission = void 0;
var code_1 = __webpack_require__(480);
var utils_1 = __webpack_require__(593);
function SubmissionCrack() {
    var content = document.querySelector('div.uoj-content');
    if (!content || !content.children.length && !content.children[0].className.includes('table-responsive')) {
        return;
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ex124oj.pond.ink/api/submission/".concat((0, utils_1.isSubmission)()[1]),
        nocache: true,
        onload: function (data) {
            if (data.status == 200) {
                SubmissionCard(JSON.parse(data.response));
            }
            else {
                SubmissionCard({});
            }
        },
        onerror: function (error) {
            SubmissionCard({});
        }
    });
}
function SubmissionCard(data) {
    var _a;
    GM_addStyle("\ndiv.tab-content > div.tab-pane.card {\n    border-top: none;\n    border-top-right-radius: 0;\n    border-top-left-radius: 0;\n}\n    ");
    var content = document.querySelector('div.uoj-content');
    if (content && content.children.length) {
        var TabList = document.createElement('ul');
        content.insertBefore(TabList, content.children[1]);
        TabList.setAttribute('class', 'nav nav-tabs');
        TabList.setAttribute('role', 'tablist');
        var TabContent = document.createElement('div');
        content.insertBefore(TabContent, content.children[2]);
        TabContent.setAttribute('class', 'tab-content');
        TabContent.style.marginBottom = '20px';
        var counter = 0, cardtitle = void 0;
        var flag = { answer: false, details: false };
        for (var i = 3; i < content.children.length; i++, counter++) {
            var classlist = content.children[i].getAttribute('class');
            if (classlist && classlist.includes('card')) {
                var isActive = !counter;
                var title = document.createElement('li');
                TabList.appendChild(title);
                title.setAttribute('class', 'nav-item');
                var titleText = (_a = content.children[i].querySelector('h4.card-title')) === null || _a === void 0 ? void 0 : _a.textContent;
                if (titleText) {
                    cardtitle = titleText.charAt(0).toUpperCase() + titleText.slice(1);
                    title.innerHTML = "<a class=\"nav-link".concat(isActive ? ' active' : '', "\" href=\"#card").concat(counter, "\" role=\"tab\" data-toggle=\"tab\" aria-selected=\"true\">").concat(cardtitle, "</a>");
                    if (cardtitle == 'Answer') {
                        flag.answer = true;
                    }
                    else if (cardtitle == '详细' || cardtitle == 'Details') {
                        flag.details = true;
                    }
                }
                var card = document.createElement('div');
                TabContent.appendChild(card);
                card.setAttribute('class', "tab-pane card".concat(isActive ? ' active' : ''));
                card.setAttribute('id', "card".concat(counter));
                var card_body = content.children[i].querySelector('div.card-body');
                if (cardtitle == 'Answer' && data.answer && data.answer.body) {
                    card_body = document.createElement('div');
                    card_body.classList.add('card-body');
                    card_body.innerHTML = data.answer.body;
                }
                else if ((cardtitle == '详细' || cardtitle == 'Details') && data.details && data.details.body) {
                    card_body = document.createElement('div');
                    card_body.classList.add('card-body');
                    card_body.innerHTML = data.details.body;
                }
                if (card_body) {
                    card.appendChild(card_body);
                }
                var card_footer = content.children[i].querySelector('div.card-footer');
                if (card_footer) {
                    card.appendChild(card_footer);
                }
                if (cardtitle == 'Answer' && data.answer && data.answer.footer) {
                    card_footer.innerHTML = data.answer.footer;
                }
                content.removeChild(content.children[i]);
                i--;
            }
        }
        if (!flag.answer && data.answer) {
            var isActive = !counter;
            var title = document.createElement('li');
            TabList.appendChild(title);
            title.setAttribute('class', 'nav-item');
            title.innerHTML = "<a class=\"nav-link".concat(isActive ? ' active' : '', "\" href=\"#card").concat(counter, "\" role=\"tab\" data-toggle=\"tab\" aria-selected=\"true\">Answer</a>");
            var card = document.createElement('div');
            TabContent.appendChild(card);
            card.setAttribute('class', "tab-pane card".concat(isActive ? ' active' : ''));
            card.setAttribute('id', "card".concat(counter));
            if (data.answer.body) {
                var card_body = document.createElement('div');
                card_body.classList.add('card-body');
                card_body.innerHTML = data.answer.body;
                card.appendChild(card_body);
            }
            if (data.answer.footer) {
                var card_body = document.createElement('div');
                card_body.classList.add('card-footer');
                card_body.innerHTML = data.answer.footer;
                card.appendChild(card_body);
            }
            counter++;
        }
        if (!flag.details) {
            var isActive = !counter;
            var title = document.createElement('li');
            TabList.appendChild(title);
            title.setAttribute('class', 'nav-item');
            title.innerHTML = "<a class=\"nav-link".concat(isActive ? ' active' : '', "\" href=\"#card").concat(counter, "\" role=\"tab\" data-toggle=\"tab\" aria-selected=\"true\">\u8BE6\u7EC6</a>");
            var card = document.createElement('div');
            TabContent.appendChild(card);
            card.setAttribute('class', "tab-pane card".concat(isActive ? ' active' : ''));
            card.setAttribute('id', "card".concat(counter));
            if (data.details.body) {
                var card_body = document.createElement('div');
                card_body.classList.add('card-body');
                card_body.innerHTML = data.details.body;
                card.appendChild(card_body);
            }
            counter++;
        }
        sh_highlightDocument();
        (0, code_1.CodeCopy)();
    }
}
function Submission() {
    SubmissionCrack();
}
exports.Submission = Submission;


/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TableStyle = void 0;
function TableStyle() {
    var Tables = document.getElementsByTagName('table');
    for (var table in Tables) {
        if (Tables[table].nodeType) {
            var parentNode = Tables[table].parentNode;
            var parentClass = parentNode.getAttribute('class');
            var classList = Tables[table].classList;
            if (parentClass !== 'legend' && classList.length === 0) {
                Tables[table].classList.add('table', 'table-bordered');
            }
        }
    }
    var ths = document.getElementsByTagName('th');
    for (var th in ths) {
        if (ths[th].nodeType && ths[th].getAttribute('align')) {
            ths[th].setAttribute('style', 'text-align:' + ths[th].getAttribute('align'));
        }
    }
}
exports.TableStyle = TableStyle;


/***/ }),

/***/ 446:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Theme = void 0;
var variables_1 = __webpack_require__(449);
function Theme() {
    GM_addElement('link', {
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        rel: 'stylesheet'
    });
    GM_addStyle("\n@import url(https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css);\ncode {\n    font-family: \"Fira Code\" !important;\n    ".concat(variables_1.Ligatures ? '' : 'font-variant-ligatures: none !important;', "\n}\n.card {\n    ").concat(variables_1.Darktheme ? 'border-color: rgba(255,255,255,.125); !important' : '', "\n}\n.card-footer {\n    ").concat(variables_1.Darktheme ? 'border-color: rgba(255,255,255,.03); !important' : '', "\n}\npre, pre.sh_sourceCode {\n").concat(variables_1.Darktheme ? "\n    color: #e0e0e0 !important;\n    background-color: #222 !important;\n    border-color: #2e2e30 !important;\n" : '', "\n}\ncode > span, code > span > span {\n    font-style: normal !important;\n    font-weight: 400 !important;\n}\ncode > span.sh_preproc, code > span.sh_preproc > span.sh_preproc,\ncode > span.sh_keyword, code > span.sh_keyword > span.sh_keyword,\ncode > span.sh_type, code > span.sh_type > span.sh_type {\n    color: ").concat(!variables_1.Darktheme ? '#8959a8' : '#cc99cd', " !important;\n}\ncode > span.sh_string, code > span.sh_string > span.sh_string,\ncode > span.sh_specialchar, code > span.sh_specialchar > span.sh_specialchar {\n    color: ").concat(!variables_1.Darktheme ? '#718c00' : '#7ec699', " !important;\n}\ncode > span.sh_cbracket, code > span.sh_cbracket > span.sh_cbracket {\n    color: ").concat(!variables_1.Darktheme ? '#4d4d4c' : '#cccccc', " !important;\n}\ncode > span.sh_symbol, code > span.sh_symbol > span.sh_symbol {\n    color: ").concat(!variables_1.Darktheme ? '#3e999f' : '#67cdcc', " !important;\n}\ncode > span.sh_number, code > span.sh_number > span.sh_number {\n    color: ").concat(!variables_1.Darktheme ? '#f5871f' : '#f08d49', " !important;\n}\ncode > span.sh_function, code > span.sh_function > span.sh_function {\n    color: ").concat(!variables_1.Darktheme ? '#4271ae' : '#f08d49', " !important;\n}\ncode > span.sh_comment, code > span.sh_comment > span.sh_comment {\n    color: ").concat(!variables_1.Darktheme ? '#8e908c' : '#999999', " !important;\n}\n.copybutton {\n    font-size: 1.1em;\n    width: 2.2em;\n    height: 2.2em;\n    padding: 0;\n    position: absolute;\n    top: 0;\n    right: 0;\n    background-color: ").concat(variables_1.Darktheme ? 'rgb(255,255,255,.1)' : 'rgb(0,0,0,.1)', ";\n    border: 0 solid transparent;\n    border-bottom-left-radius: .28571429rem;\n}\n.copybutton:hover {\n    background-color: ").concat(variables_1.Darktheme ? 'rgb(255,255,255,.2)' : 'rgb(0,0,0,.2);', ";\n}\n.copybutton:focus {\n    outline: none;\n}\n    "));
    if (variables_1.Darktheme) {
        GM_addStyle("\nbody {\n    color: #f2eee8;\n    background-color: #222;\n}\n\na.header-a {\n    color: #f2eee8;\n}\n\n.navbar-light .navbar-brand {\n    color: #fff\n}\n.navbar-light .navbar-brand:focus,.navbar-light .navbar-brand:hover {\n    color: #fff\n}\n.navbar-light .navbar-nav .nav-link {\n    color: rgba(255,255,255,.5)\n}\n.navbar-light .navbar-nav .nav-link:focus,.navbar-light .navbar-nav .nav-link:hover {\n    color: rgba(255,255,255,.75)\n}\n.navbar-light .navbar-nav .nav-link.disabled {\n    color: rgba(255,255,255,.25)\n}\n.navbar-light .navbar-nav .active>.nav-link,.navbar-light .navbar-nav .nav-link.active,.navbar-light .navbar-nav .nav-link.show,.navbar-light .navbar-nav .show>.nav-link {\n    color: #fff\n}\n.navbar-light .navbar-toggler {\n    color: rgba(255,255,255,.5);\n    border-color: rgba(255,255,255,.1)\n}\n.navbar-light .navbar-toggler-icon {\n    background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")\n}\n.navbar-light .navbar-text {\n    color: rgba(255,255,255,.5)\n}\n.navbar-light .navbar-text a {\n    color: #fff\n}\n.navbar-light .navbar-text a:focus,.navbar-light .navbar-text a:hover {\n    color: #fff\n}\n.bg-light {\n    background-color: #343a40!important\n}\na.bg-light:focus,a.bg-light:hover,button.bg-light:focus,button.bg-light:hover {\n    background-color: #1d2124!important\n}\n\n.uoj-footer {\n    border-top-color: #272b31;\n}\n\n.page-header {\n    border-color: #2e2e30;\n}\n\n.page-link, .page-item.disabled .page-link {\n    background-color: #222;\n    border-color: #2e2e30;\n}\n\n.card {\n    background-color: #222;\n}\n.card-header {\n    background-color: rgba(255,255,255,.03);\n    border-bottom-color: rgba(255,255,255,.125);\n}\n\n.card-uoj-accepted>.card-header,\n.card-uoj-wrong>.card-header,\n.card-uoj-acceptable-answer>.card-header,\n.card-uoj-tle>.card-header {\n    opacity: 0.9;\n}\n\n.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {\n    color: #f2eee8;\n    background-color: #222;\n    border-color: #2e2e30 #2e2e30 #222;\n}\n.nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {\n    border-color: #2e2e30 #2e2e30 #222;\n}\n.nav-tabs {\n    border-bottom-color: #2e2e30;\n}\n\n.bootstrap-switch .bootstrap-switch-handle-on, .bootstrap-switch .bootstrap-switch-handle-off, .bootstrap-switch .bootstrap-switch-label {\n    background-color: #222;\n    border-color: #2e2e30;\n    color: #f2eee8;\n}\n\n.table {\n    color: #f2eee8;\n}\n.table-striped tbody tr:nth-of-type(odd) {\n    background-color: rgba(255,255,255,.05);\n}\n.table-hover tbody tr:hover {\n    color: #cccccc;\n    background-color: rgba(255,255,255,.075);\n}\n.table thead th {\n    border-bottom-color: #2e2e30;\n}\n.table td, .table th {\n    border-color: #2e2e30;\n    border-top-color: #2e2e30;\n}\n.table-bordered td, .table-bordered th {\n    border-color: #2e2e30;\n}\n\n.form-control {\n    color: #f2eee8;\n    background-color: #222;\n    border-color: #2e2e30;\n}\n.form-control:focus {\n    color: #f2eee8;\n    background-color: #222;\n}\n\n.img-thumbnail, .img-rounded {\n    background-color: #222;\n}\n\n.list-group {\n    background-color: #222;\n}\n.list-group-item {\n    background-color: #222;\n    border-color: rgba(255, 255, 255, .125);\n}\n\n.dropdown-menu.show {\n    background-color: #222;\n    border-color: rgba(255, 255, 255, .15);\n}\n.dropdown-item {\n    color: #f2eee8;\n}\n.dropdown-item:focus, .dropdown-item:hover {\n    color: #f2eee8;\n    text-decoration: none;\n    background-color: #14171c;\n}\n\n.CodeMirror, .CodeMirror-scroll {\n    background-color: #222 !important;\n    color: #f2eee8 !important;\n}\n.CodeMirror pre {\n    background: transparent !important;\n}\n.CodeMirror-activeline-background, .CodeMirror-scroll {\n    background-color: #222 !important;\n}\n.CodeMirror div.CodeMirror-cursor {\n    border-left-color: white !important;\n}\n.CodeMirror-selected {\n    background: #464646 !important;\n}\n.CodeMirror-focused .CodeMirror-selected {\n    background: #464626 !important;\n}\n.CodeMirror-gutters, .CodeMirror-scroll > .CodeMirror-gutters {\n    background-color: #222 !important;\n    border-right-color: #59554f !important;\n    color: #59554f !important;\n}\n.CodeMirror-linenumber {\n    background-color: #222 !important;\n    color: #59554f !important;\n}\n.blog-content-md-editor-toolbar {\n    background: #343a40\n}\n\n#rating-tooltip {\n    background-color: rgb(0,17,17) !important;\n    border: rgb(0,34,34) !important;\n}\n\n#MathJax_ZoomFrame {\n    color: black;\n}\n\n.modal-content {\n    color: #f2eee8;\n    background-color: #222;\n    border-color: #2e2e30;\n}\n.modal-header {\n    color: #f2eee8;\n    background-color: #222;\n    border-color: #2e2e30;\n}\n.modal-footer {\n    color: #f2eee8;\n    background-color: #222;\n    border-color: #2e2e30;\n}\n\n        ");
    }
}
exports.Theme = Theme;


/***/ }),

/***/ 720:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RandomProblem = void 0;
function RandomProblem() {
    var SearchBox = document.getElementById('form-search-problem');
    if (SearchBox) {
        var RandomButton = document.createElement('div');
        RandomButton.setAttribute('class', 'input-group-append');
        RandomButton.innerHTML = '<button class="btn btn-search btn-outline-primary" style="height: calc(1.5em + 0.75rem + 2px);" onclick="randomProblem();">随机跳题</button>';
        var RandomScript = document.createElement('script');
        RandomScript.innerHTML =
            "function randomProblem() {\n    const randomProblemId = Math.ceil(Math.random() * 3000);\n    ($.get('/problem/' + randomProblemId, (data, status) => {\n        if (status == 'success') {\n            window.location.href = '/problem/' + randomProblemId;\n        } else {\n            randomProblem();\n        }\n    })).error(() => {\n        randomProblem();\n    })\n}";
        SearchBox.after(RandomButton);
        RandomButton.after(RandomScript);
    }
}
exports.RandomProblem = RandomProblem;


/***/ }),

/***/ 593:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBlog = exports.isUserProfile = exports.isProblem = exports.isStandings = exports.isContest = exports.isContests = exports.isSubmission = exports.isHomepage = void 0;
var HomepageRegExp = /^http:\/\/124.221.194.184(\/)?(\?.*)?$/;
function isHomepage() {
    return window.location.href.match(HomepageRegExp);
}
exports.isHomepage = isHomepage;
var submissionRegExp = /^http:\/\/124.221.194.184\/submission\/(\d+)(\?.*)?$/;
function isSubmission() {
    return window.location.href.match(submissionRegExp);
}
exports.isSubmission = isSubmission;
var ContestsRegExp = /^http:\/\/124.221.194.184\/contests(\?.*)?$/;
function isContests() {
    return window.location.href.match(ContestsRegExp);
}
exports.isContests = isContests;
var ContestRegExp = /^http:\/\/124.221.194.184\/contest\/(\d+)(\?.*)?$/;
function isContest() {
    return window.location.href.match(ContestRegExp);
}
exports.isContest = isContest;
var StandingsRegExp = /^http:\/\/124.221.194.184\/contest\/(\d+)\/standings(\?.*)?$/;
function isStandings() {
    return window.location.href.match(StandingsRegExp);
}
exports.isStandings = isStandings;
var ProblemRegExp = /^http:\/\/124.221.194.184(\/contest\/(\d+))?\/problem\/(\d+)(\?.*)?$/;
function isProblem() {
    return window.location.href.match(ProblemRegExp);
}
exports.isProblem = isProblem;
var UserProfileRegExp = /^http:\/\/124.221.194.184\/user\/profile\/.+(\?.*)?$/;
function isUserProfile() {
    return window.location.href.match(UserProfileRegExp);
}
exports.isUserProfile = isUserProfile;
var BlogRegExp = /^http:\/\/124.221.194.184\/blog\/.+(\?.*)?$/;
function isBlog() {
    return window.location.href.match(BlogRegExp);
}
exports.isBlog = isBlog;


/***/ }),

/***/ 449:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVariables = exports.NewYearMagicBot = exports.NewYearMagic = exports.TagBadgeList = exports.FFCBadgeList = exports.CCFBadgeList = exports.NameColorList = exports.GroupBelong = exports.GroupsEnabled = exports.Darktheme = exports.DarkthemeSelect = exports.Ligatures = exports.Academic = exports.EnabledGroups = exports.SiteIconImage = exports.BackgroundImage = exports.version = void 0;
exports.version = "1.1.17";
function getRandomColorCode() {
    var letters = '0123456789ABCDEF';
    var colorCode = '#';
    for (var i = 0; i < 6; i++) {
        colorCode += letters[Math.floor(Math.random() * 16)];
    }
    return colorCode;
}
function getVariables() {
    exports.BackgroundImage = GM_getValue('BackgroundImage', '');
    exports.SiteIconImage = GM_getValue('SiteIconImage', '');
    exports.EnabledGroups = GM_getValue('EnabledGroups', '');
    exports.Academic = GM_getValue('Academic', false);
    exports.Ligatures = GM_getValue('Ligatures', true);
    exports.DarkthemeSelect = GM_getValue('Darktheme', "follow");
    exports.Darktheme = (exports.DarkthemeSelect == 'light' || exports.DarkthemeSelect == 'dark') ? exports.DarkthemeSelect == 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    exports.GroupsEnabled = exports.EnabledGroups.split(/\s*,\s*/);
    var variables = GM_getValue('public_variables', {});
    exports.GroupBelong = {};
    for (var group in variables.Groups) {
        for (var _i = 0, _a = variables.Groups[group]; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            exports.GroupBelong[name_1] = group;
        }
    }
    exports.NewYearMagic = variables.NewYearMagic;
    exports.NewYearMagicBot = variables.NewYearMagicBot;
    var randomcolor = getRandomColorCode();
    exports.NameColorList = variables.NameColorList;
    if (exports.NewYearMagic && variables.NewYearMagicNameColorList) {
        for (var i in variables.NewYearMagicNameColorList) {
            if (!variables.NewYearMagicNameColorList[i])
                continue;
            for (var j = 0; j < variables.NewYearMagicNameColorList[i].length; j++) {
                if (variables.NewYearMagicNameColorList[i][j])
                    exports.NameColorList[i][j] = variables.NewYearMagicNameColorList[i][j];
            }
        }
    }
    if (exports.NameColorList) {
        for (var i in exports.NameColorList) {
            for (var j = 0; j < exports.NameColorList[i].length; j++) {
                if (exports.NameColorList[i][j] == 'rand') {
                    exports.NameColorList[i][j] = randomcolor;
                }
            }
        }
    }
    exports.CCFBadgeList = variables.CCFBadgeList;
    if (exports.CCFBadgeList) {
        for (var i in exports.CCFBadgeList) {
            for (var j = 0; j < exports.CCFBadgeList[i].length; j++) {
                if (exports.CCFBadgeList[i][j] == 'rand') {
                    exports.CCFBadgeList[i][j] = randomcolor;
                }
            }
        }
    }
    exports.FFCBadgeList = variables.FFCBadgeList;
    if (exports.FFCBadgeList) {
        for (var i in exports.FFCBadgeList) {
            for (var j = 0; j < exports.FFCBadgeList[i].length; j++) {
                if (exports.FFCBadgeList[i][j] == 'rand') {
                    exports.FFCBadgeList[i][j] = randomcolor;
                }
            }
        }
    }
    exports.TagBadgeList = variables.TagBadgeList;
    if (exports.NewYearMagic && variables.NewYearMagicTagBadgeList) {
        for (var i in variables.NewYearMagicTagBadgeList) {
            for (var j = 0; j < variables.NewYearMagicTagBadgeList[i].length; j++) {
                if (variables.NewYearMagicTagBadgeList[i][j].color) {
                    exports.TagBadgeList[i][j].color = variables.NewYearMagicTagBadgeList[i][j].color;
                }
                if (variables.NewYearMagicTagBadgeList[i][j].text) {
                    exports.TagBadgeList[i][j].text = variables.NewYearMagicTagBadgeList[i][j].text;
                }
            }
        }
    }
    if (exports.TagBadgeList) {
        for (var i in exports.TagBadgeList) {
            for (var j = 0; j < exports.TagBadgeList[i].length; j++) {
                if (exports.TagBadgeList[i][j].color == 'rand') {
                    exports.TagBadgeList[i][j].color = randomcolor;
                }
            }
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ex124oj.pond.ink/public/variables.json",
        nocache: true,
        onload: function (data) {
            GM_setValue('public_variables', JSON.parse(data.response));
        }
    });
}
exports.getVariables = getVariables;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

/// <reference path="index.d.ts" />
__webpack_unused_export__ = ({ value: true });
var utils_1 = __webpack_require__(593);
var variables_1 = __webpack_require__(449);
var theme_1 = __webpack_require__(446);
var settings_1 = __webpack_require__(310);
var name_1 = __webpack_require__(819);
var appearance_1 = __webpack_require__(690);
var discussion_1 = __webpack_require__(992);
var code_1 = __webpack_require__(480);
var table_1 = __webpack_require__(900);
var toolbar_1 = __webpack_require__(720);
var announcement_1 = __webpack_require__(579);
var submission_1 = __webpack_require__(978);
var contest_1 = __webpack_require__(103);
var problem_1 = __webpack_require__(823);
var gravatar_1 = __webpack_require__(18);
(function () {
    'use strict';
    (0, variables_1.getVariables)();
    (0, theme_1.Theme)();
    (0, name_1.NameStyle)();
    document.addEventListener('DOMContentLoaded', function () {
        (0, settings_1.Settings)();
        (0, appearance_1.Background)();
        (0, appearance_1.changeIcon)();
        (0, discussion_1.DiscussionCard)();
        (0, code_1.CodeCopy)();
        (0, table_1.TableStyle)();
        (0, toolbar_1.RandomProblem)();
        if ((0, utils_1.isHomepage)())
            (0, announcement_1.exAnnouncements)();
        if ((0, utils_1.isSubmission)())
            (0, submission_1.Submission)();
        if ((0, utils_1.isContests)())
            (0, contest_1.ContestsCard)();
        if ((0, utils_1.isContest)())
            (0, contest_1.ContestHome)();
        if ((0, utils_1.isProblem)())
            (0, problem_1.Problem)();
        if ((0, utils_1.isUserProfile)() || (0, utils_1.isBlog)())
            (0, gravatar_1.changeGravatarURL)();
    });
    window.onload = function () {
        if ((0, utils_1.isStandings)())
            (0, contest_1.ContestStandings)();
    };
})();

})();

/******/ })()
;