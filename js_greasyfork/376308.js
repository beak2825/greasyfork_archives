// ==UserScript==
// @name         知乎自动不感兴趣
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动给知乎主页推荐内容标记所有标签不感兴趣并提交
// @author       江洋
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376308/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/376308/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clickMoreOperations = function(buttonClassName) {
        // 选中更多操作
        let moreOperations = document.querySelector(buttonClassName)
        if (moreOperations == null) {
            location.reload();
        }
        moreOperations.click()
    }


    var getMenu = function(menuClassName) {
        // 得到操作菜单
        return document.querySelector(menuClassName)
    }


    var markTag = function(tagClassName) {
        // 选择不感兴趣的标签
        let uninterestTag = document.querySelectorAll(tagClassName)
        for(var i = 0; i < uninterestTag.length; i++) {
            uninterestTag[i].click()
        }
    }


    var clickSubmitButton = function(buttonClassName) {
        // 点击提交按钮
        let submitButton = document.querySelector(buttonClassName)
        submitButton.click()
    }


    var articleMenu = function(menuClassName) {
        // 文章
        let menu = document.querySelector(menuClassName)
        menu.click()

        markTag('.TopstoryItem-uninterestTag')
        clickSubmitButton('.TopstoryItem-actionButton')
    }


    var answerMenu = function(menu) {
        // 回答
        let menu_childs = menu.childNodes
        if (menu_childs.length == 4) {
            menu_childs[3].click()
        } else if (menu_childs.length == 3) {
            menu_childs[2].click()
        }
        markTag('.TopstoryItem-uninterestTag')
        clickSubmitButton('.TopstoryItem-actionButton')
    }


    var sbZhihu = function() {
        clickMoreOperations('.OptionsButton')
        let menu = getMenu('.AnswerItem-selfMenu')
        if (menu == null) {
            articleMenu('.ItemOptions-selfMenuItem')
        } else {
            answerMenu(menu)
        }
    }


    var timer = setInterval(sbZhihu, 1000)
})();