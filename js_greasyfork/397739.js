// ==UserScript==
// @name         微软文档快捷助手
// @namespace    https://bathur.cn/
// @version      0.1
// @description  Put the action list in Microsoft document to right side
// @author       Bathur
// @match        *://docs.microsoft.com/zh-cn/*
// @grant        none

// @create       2020-03-11
// @copyright    2020+, Bathur.cn
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/397739/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E5%BF%AB%E6%8D%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397739/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E5%BF%AB%E6%8D%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rightSide = document.getElementById('affixed-right-container');
    if (typeof(rightSide) != "undefined" && rightSide !=null){
        var actionList = document.getElementsByClassName('action-list has-flex-justify-content-start has-flex-justify-content-end-tablet is-flex is-flex-row has-flex-wrap has-flex-grow is-unstyled')[0];
        var listLenght = actionList.children.length;
    
        var hrDivNode = document.createElement('div');
        hrDivNode.setAttribute('class', 'has-border-bottom has-padding-bottom-small has-margin-bottom-small');
        rightSide.prepend(hrDivNode);
    
        for (let index = listLenght - 2; index >= 0; index--) {
            actionList.children[index].setAttribute('style', 'display: block;');
            rightSide.prepend(actionList.children[index]);
        }
    }

    /*
    document.onkeydown = function(e){
        var keyCode = window.event ? e.keyCode : e.which;
        if(keyCode == 83){
            $("#language-toggle").click();
        }
    }
    */
})();