// ==UserScript==
// @name         NGA魔兽世界玩家优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  对NGA玩家社区提供魔兽世界玩家优化，去除和魔兽世界游戏无关的内容
// @author       Denis Ding
// @match        https://bbs.nga.cn
// @icon         https://ae01.alicdn.com/kf/Hac1a58055c5047cdb91349e91aa208d5k.jpg
// @grant        none
// @note         21-12-31 1.0 魔兽世界玩家提供界面优化
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437824/NGA%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E7%8E%A9%E5%AE%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437824/NGA%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E7%8E%A9%E5%AE%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){

        //隐藏和魔兽世界无关的右侧面板
        var rightDom = document.getElementById('indexBlockRight');
        rightDom.hidden = true;
        //修改左侧面板样式
        var leftDom = document.getElementById('indexBlockLeft');
        leftDom.style.width = "100%";
        leftDom.style.maxWidth = "1200px";
        leftDom.style.float = "none";
        leftDom.style.margin = "0 auto";
        //隐藏网事杂谈
        var indexBlockother = document.getElementById('indexBlockother');
        indexBlockother.hidden = true;
        //隐藏暴雪游戏
        var indexBlockbliz = document.getElementById('indexBlockbliz');
        indexBlockbliz.hidden = true;
        //隐藏社区事务
        var indexBlockclub = document.getElementById('indexBlockclub');
        indexBlockclub.hidden = true;
        //隐藏广告
        for(var dom of leftDom.parentNode.children){
            if(dom.tagName == 'DIV') {
                if(dom.id != 'indexBlockLeft' && dom.id != 'indexBlockLeft' && dom.classList[0] != 'clear') {
                    dom.hidden = true;
                }
            }
        }
        //头部
        var mainmenu = document.getElementById('mainmenu');
        mainmenu.style.width = "100%";
        mainmenu.style.maxWidth = "1200px";
        mainmenu.style.margin = "0 auto 168px auto";
        //导航条
        var m_nav = document.getElementById('m_nav');
        m_nav.style.width = "100%";
        m_nav.style.maxWidth = "1200px";
        m_nav.style.margin = "0 auto";
    }
})();