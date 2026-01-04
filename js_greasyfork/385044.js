// ==UserScript==
// @name         Fuck ZhiHu Anonymous Users
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  block anonymous users in zhihu
// @author       miniJoy
// @match        https://www.zhihu.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385044/Fuck%20ZhiHu%20Anonymous%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/385044/Fuck%20ZhiHu%20Anonymous%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';


function cleanUser() {
    var items = document.getElementsByClassName('List-item')
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var name = item.getElementsByClassName('UserLink AuthorInfo-name')[0].innerText;
        //console.log(name, name === '匿名用户');
        if (name === '匿名用户') {
            item.hidden =true;
            //var context = item.getElementsByClassName('RichContent-inner');
            //context[0].innerText = "匿名用户，回答已经被自动屏蔽"
        }
    }
}

function cleanIndexUser() {
    if(document.getElementsByClassName('Topstory-recommend') === undefined ||
      document.getElementsByClassName('Topstory-recommend').length === 0 ||
      document.getElementsByClassName('Topstory-recommend')[0].firstChild === undefined) {
        // 当前页面可能不是首页, 因此不进行操作
        return;
    }

    var items = document.getElementsByClassName('Topstory-recommend')[0].firstChild;

    var child = items.firstChild;
    var last = items.lastChild;

    while(child != last){
        var info = child.getElementsByClassName('ContentItem AnswerItem');
        if(info[0]!== undefined){
            var name = JSON.parse(info[0].attributes[1].nodeValue).authorName;
            if (name === '匿名用户') {
                //console.log(JSON.parse(info[0].attributes[1].nodeValue))
                child.hidden = true;
            }
        }
        child = child.nextSibling;
    }
}

function cleanAll(){
    cleanUser();
    cleanIndexUser();
}


window.setInterval(cleanAll, 1000);


})();