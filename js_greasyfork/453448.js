// ==UserScript==
// @name        动漫花园屏蔽指定项（首页+）
// @namespace   Violentmonkey Scripts
// @match       https://share.dmhy.org/
// @match       https://share.dmhy.org/topics/list/page/*
// @grant       none
// @version     1.0
// @author      RoachLin
// @description 2022/9/30 00:00:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/453448/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E9%A1%B9%EF%BC%88%E9%A6%96%E9%A1%B5%2B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453448/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E9%A1%B9%EF%BC%88%E9%A6%96%E9%A1%B5%2B%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
        //屏蔽指定分类
        //3:漫畫
        //6:日劇
        //12:特攝
        //var sorts = [3, 6, 12];
        var sorts = [111, 222, 333];
        var a = document.querySelectorAll("a[href]");
        for (var i = 0; i < a.length; ++i) {
                for (var j = 0; j < sorts.length; ++j) {
                        if (a[i].href == "https://share.dmhy.org/topics/list/sort_id/" + sorts[j] && a[i].title == "") {
                                a[i].parentElement.parentElement.remove();
                        }
                }
        }
 
        //屏蔽指定字幕组
        var teams = [1111, 2222, 3333];
        var a = document.querySelectorAll("a[href]");
        for (var i = 0; i < a.length; ++i) {
                for (var j = 0; j < teams.length; ++j) {
                        if (a[i].href == "https://share.dmhy.org/topics/list/team_id/" + teams[j]) {
                                a[i].parentElement.parentElement.parentElement.remove();
                        }
                }
        }
 
        //屏蔽指定用户
        var users = [1111111, 2222222, 3333333];
        var a = document.querySelectorAll("a[href]");
        for (var i = 0; i < a.length; ++i) {
                for (var j = 0; j < users.length; ++j) {
                        if (a[i].href == "https://share.dmhy.org/topics/list/user_id/" + users[j]) {
                                a[i].parentElement.parentElement.remove();
                        }
                }
        }
 
        //屏蔽指定标题内容
        var str = ["111", "222"];
        var a = document.querySelectorAll("a[href]");
        for (var i = 0; i < a.length; ++i) {
                for (var j = 0; j < str.length; ++j) {
                        if (a[i].innerText.includes(str[j])) {
                                a[i].parentElement.parentElement.remove();
                        }
                }
        }
})();