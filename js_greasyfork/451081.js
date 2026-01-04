// ==UserScript==
// @name         hobby_search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @homepageURL  https://github.com/swttkonjjj/hobby-search
// @description  在兴趣爱好数据库中增加bilibli和百度搜索
// @author       swtt
// @license      MIT
// @match        http://hobby.lkszj.info/info?id=*
// @icon         https://raw.githubusercontent.com/swttkonjjj/hobby-search/master/img/icon256.png
// @grant        GM_addStyle
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451081/hobby_search.user.js
// @updateURL https://update.greasyfork.org/scripts/451081/hobby_search.meta.js
// ==/UserScript==

function main() {
    let element = document.getElementById("info")
    let keyword = element.textContent

    let randUrl = 'http://hobby.lkszj.info/info?id='+window.randRequest
    let biliSearch = 'https://search.bilibili.com/all?keyword=' + keyword
    let baiduSearch = 'https://www.baidu.com/s?wd=' + keyword
    
    randUrl = "window.open('" + randUrl + "','_self')"
    biliSearch = '<a target="_blank" href=' + biliSearch + '><button id=biliSearch>bilibili搜索</button></a> '
    baiduSearch = '<a target="_blank" href=' + baiduSearch + '><button id=baiduSearch>Baidu搜索</button></a> '
    randHtml = '<div onclick="' + randUrl + '" id="random" class=icon-refresh data-title="搜索"></div>'

    element.innerHTML = '<table><td><div>' + biliSearch + baiduSearch + '</div></td>' +'<td>'+ randHtml + '</td>' +keyword

    if (keyword != ' - - - ') {
        clearInterval(myVar)
    }
}

let biliCss = '#biliSearch { height: 45px;background-color: #00aeec;border-radius: 5px;color: white;font-size: large;'
let baiduCss = '#baiduSearch { height: 45px;background-color: #4e6ef2;border-radius: 5px;color: white;font-size: large;'
let iconCss = '#random {cursor: pointer;border-radius: 50%;width: 30px;height: 30px;border: 2px solid currentColor;border-left: 2px solid transparent;position: relative;margin: 30px auto;}'

let afterCss = '#random::after {content: "";width: 5px;height: 5px;border-bottom: 2px solid currentColor;border-left: 2px solid currentcolor;position: absolute;top: 24px;left: 3px;transform: rotate(90deg);}'
GM_addStyle(biliCss)
GM_addStyle(baiduCss)
GM_addStyle(iconCss)
GM_addStyle(afterCss)

let myVar = setInterval(main, 100);

window.randRequest = "测试"
function random() {
    $.ajax({
        type: 'POST',
        url: "random",
        async:false,
        success: function (data) {
            window.randRequest = data["list"][0]["id"]
        }
    });
}

random()
