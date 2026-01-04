// ==UserScript==
// @name         mebook小书屋自动跳转百度云并填写密码
// @namespace    http://mebook.cc/
// @version      2.0
// @description  一键打开百度云链接并填写密码
// @author       Ming
// @match        http://mebook.cc/download.php?*
// @match        http://www.shuwu.mobi/download.php?*
// @match        http://mebook.cc/*.html*
// @match        http://www.shuwu.mobi/*.html*
// @match        https://cloud.189.cn/t/*
// @match        https://pan.baidu.com/share/init?*
// @match        https://pan.baidu.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374244/mebook%E5%B0%8F%E4%B9%A6%E5%B1%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6%E4%BA%91%E5%B9%B6%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/374244/mebook%E5%B0%8F%E4%B9%A6%E5%B1%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6%E4%BA%91%E5%B9%B6%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.location.toString();

    if (window.location.host === "mebook.cc" || window.location.host === "www.shuwu.mobi") {
        // 图书页显示百度下载、城通下载、天翼下载、原始下载按钮（并没有做跳转页面是否存在对应链接的判断）
        url = url.split("#")[0];//评论区链接#comment
        if (url.split(".").pop() === "html") {
            var downlinkArea = document.getElementsByClassName("downlink")[0];
            var downlink = downlinkArea.children[0].children[0].href;
            downlinkArea.children[0].children[0].href = downlinkArea.children[0].children[0].href + "&method=orign";
            var baiduBtn = '<strong><a class="downbtn" rel="external nofollow" title="百度下载" href="' + downlink + '&method=baidu' + '" target="_blank">百度下载</a></strong>';
            downlinkArea.insertAdjacentHTML("beforeEnd",baiduBtn);
            var chengtongBtn = '<strong><a class="downbtn" rel="external nofollow" title="城通下载" href="' + downlink + '&method=chengtong' + '" target="_blank">城通下载</a></strong>';
            downlinkArea.insertAdjacentHTML("beforeEnd",chengtongBtn);
            var tianyiBtn = '<strong><a class="downbtn" rel="external nofollow" title="天翼下载" href="' + downlink + '&method=tianyi' + '" target="_blank">天翼下载</a></strong>';
            downlinkArea.insertAdjacentHTML("beforeEnd",tianyiBtn);
        } else {

        // 下载页对应跳转
            var passPtag = document.getElementsByClassName("desc")[0].children[6].innerHTML;
            var method = RegExp("method=(.*)").exec(url);
            if (method) {
                method = method[1];//风格诡异的代码😂
            }
            if (method === "orign") {
                ;
            } else if (method === "chengtong") {
                var chengtongLink = document.getElementsByClassName("list")[0].children[1];
                window.location.href=chengtongLink.href;
            } else if (method === "tianyi") {
                var tianyiPwdMatch = new RegExp("天翼云盘密码：([0-9a-z]{4})");
                var tianyiPwd = tianyiPwdMatch.exec(passPtag)[1];
                if (tianyiPwd.length === 4) {
                    var tianyiLink = document.getElementsByClassName("list")[0].children[2];
                    window.location.href=tianyiLink.href + "#" + tianyiPwd;
                }
            } else {//兼容kakyuren的目录插件
                var baiduPwdMatch = new RegExp("百度网盘密码：([0-9a-z]{4})");
                var baiduPwd = baiduPwdMatch.exec(passPtag)[1];
                if (baiduPwd.length === 4) {
                    var baiduLink = document.getElementsByClassName("list")[0].children[0];
                    window.location.href=baiduLink.href + "#" + baiduPwd;
                }
            }
        }
    } else {
        if (window.location.host === "pan.baidu.com") {
            var baiduMatchPass = new RegExp("#([0-9a-zA-Z]{4})");
            var baiduPan = baiduMatchPass.exec(url)[1];

            if (baiduPan.length === 4) {
                var baiduInputTag = document.querySelector('.pickpw input[tabindex="1"], .access-box input#accessCode');
                baiduInputTag.value = baiduPan;
                document.querySelector('.pickpw a.g-button, .access-box a#getfileBtn').click();
            }
        }
        if (window.location.host === "cloud.189.cn") {
            var tianyiMathPass = new RegExp("#([0-9a-zA-Z]{4})");
            var tianyiPan = tianyiMathPass.exec(url)[1];

            if (tianyiPan.length === 4) {
                var tianyiInputTag = document.getElementById("code_txt");
                tianyiInputTag.value = tianyiPan;
                setTimeout('document.getElementsByClassName("visit")[0].click();', 1000);//天翼网盘点击延迟
            }
        }
    }
})();