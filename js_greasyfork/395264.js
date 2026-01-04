// ==UserScript==
// @name         百度贴吧右键菜单进行回复
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  小手一动经验到手
// @author       大西瓜一块五一斤
// @match        https://tieba.baidu.com/p/*
// @grant        none
// @run-at context-menu
// @downloadURL https://update.greasyfork.org/scripts/395264/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E8%BF%9B%E8%A1%8C%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395264/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E8%BF%9B%E8%A1%8C%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    //回复内容
    //var content = "对了我找佳珊，看到她请替我向她问声好。";
    //var content='<img pic_type="1" src="http://tiebapic.baidu.com/forum/w%3D580/sign=e19cdfc15010b912bfc1f6f6f3fcfcb5/ea2f26a0cd11728b6b9d1458dffcc3cec2fd2ccc.jpg" class="BDE_Image" onload="EditorUI.resizeImage(this, 560)" unselectable="on" height="260" width="360">';
    var content = '<p><img pic_type="1" src="http://tiebapic.baidu.com/forum/w%3D580/sign=e19cdfc15010b912bfc1f6f6f3fcfcb5/ea2f26a0cd11728b6b9d1458dffcc3cec2fd2ccc.jpg" class="BDE_Image" onload="EditorUI.resizeImage(this, 560)" unselectable="on" height="260" width="360"></p><p>如果有一天我要借钱那一定问杰尼龟借</p><p>因为他只会说杰尼杰尼</p>';

    document.getElementById("ueditor_replace").scrollIntoView({
        behavior: "auto"
    });

    setTimeout(function() {
        //document.getElementById("ueditor_replace").children[0].innerText = content;
        document.getElementById("ueditor_replace").children[0].innerHTML = content;
        document.getElementsByClassName("poster_submit")[0].click();
    },
    1000)

})();