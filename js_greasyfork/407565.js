// ==UserScript==
// @name         知乎邀请清除助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键清除知乎邀请
// @author       lovefengruoqing
// @match        https://*.zhihu.com/creator/featured-question/invited
// @match        http://*.zhihu.com/creator/featured-question/invited
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407565/%E7%9F%A5%E4%B9%8E%E9%82%80%E8%AF%B7%E6%B8%85%E9%99%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407565/%E7%9F%A5%E4%B9%8E%E9%82%80%E8%AF%B7%E6%B8%85%E9%99%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function removeAll(){
        var questionList = document.querySelector('.ToolsQuestionInvited-questionList');

        var questionLists = questionList.querySelectorAll('button.ToolsQuestionItem-toolButton');
        var len = questionLists.length;
        for(var j = 0; j < len; j++){
            var one = questionLists[j];
            one.click();
        }

        return len;
    }

    const sleep = time => new Promise((resolve) => {
        setTimeout(resolve, time * 1000);
    });

    const getNewContent = () => {
        window.scrollTo(0, 0);
        window.scrollTo(0, 1);
    }

    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'Button SearchBar-askButton Button--primary Button--red');
    deleteBtn.innerHTML = '删除当前';

    deleteBtn.onclick = function(e){
        removeAll();
    };

    var refreshBtn = document.createElement('button');
    refreshBtn.setAttribute('class', 'Button SearchBar-askButton Button--primary Button--red');
    refreshBtn.innerHTML = '更新';

    refreshBtn.onclick = function(e){
        getNewContent();
    };

    var deleteAllBtn = document.createElement('button');
    deleteAllBtn.setAttribute('class', 'Button SearchBar-askButton Button--primary Button--red');
    deleteAllBtn.innerHTML = '一键删除所有';

    deleteAllBtn.onclick = async (e) => {
        let timer = setInterval(() => {
            getNewContent();
        }, 10);
        while(removeAll()){
            await sleep(2.5);
        }
        clearInterval(timer);
        alert('done!');
    };


    setTimeout(function(){
        var wrapper = document.querySelector('.Creator-SubTab')
        wrapper.appendChild(deleteBtn);
        wrapper.appendChild(refreshBtn);
        wrapper.appendChild(deleteAllBtn);
    }, 100);

})();