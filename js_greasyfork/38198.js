// ==UserScript==
// @name         淘宝搜索助手
// @namespace    https://github.com/yeomanye
// @version      0.2.0
// @description  自动保留淘宝搜索的筛选条件，点击按钮即可再运用
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @author       Ming Ye
// @match        https://s.taobao.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38198/%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/38198/%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = false;
    var log = myDebugger.consoleFactory("taobao-assistant","log",null);
    var debugTrue = myDebugger.debugTrue; 
    var interval;
    var tagClickHandler = function(evt){
        var target = evt.target;
        var className = target.parentNode.className;
        var targetClass = target.className;
        if(className.indexOf('J_Ajax') < 0 && targetClass.indexOf('J_Ajax') < 0 && targetClass.indexOf('J_SubmitMulti') < 0) return;
        //延时，保证能够正确的读取到
        setTimeout(function(){
            var aElms = document.querySelectorAll('.crumb.g-clearfix .icon-tag.J_Ajax');
            var arr = [];
            for(var i=0,len=aElms.length;i<len;i++){
                var tmpArr = aElms[i].title.split('：')[1].split(',');
                for(var j=0,len2=tmpArr.length;j<len2;j++){
                    arr.push(tmpArr[j]);
                }
            }
            log.logObj('arr',arr);
            localStorage.setItem('preSeaTagName',JSON.stringify(arr));
            createTag();
        },600);
    };
    var createTag = function(){
        var panel = document.querySelector('.crumb.g-clearfix');
        if(!panel || panel.length === 0) {
            clearInterval(interval);
            return interval = setInterval(createTag,500);
        }
        clearInterval(interval);
        var target = document.querySelector('.icon-tag.toggle-btn.recover-filter');
        if(target) return;
        var newA = document.createElement('a');
        newA.href = '#';
        newA.innerText = '恢复筛选';
        newA.className = 'icon-tag toggle-btn recover-filter';
        panel.appendChild(newA);
        newA.addEventListener('click',searchTags);
    };
    var init = function(){
        document.body.addEventListener('click',tagClickHandler);
        createTag();
    };
    var searchTags = function(){
        var preTagArr = JSON.parse(localStorage.getItem('preSeaTagName'));
        var tagElms = document.getElementsByClassName('J_Ajax');
        var tagArr = [];
        for(var i=0,len=tagElms.length;i<len;i++){
            tagArr.push(tagElms[i].innerText);
        }
        var queryStr = '&cps=yes&ppath=',len = queryStr.length;
        preTagArr.forEach(function(str){
            var index = tagArr.indexOf(str);
            if(index >= 0)queryStr+=tagElms[index].getAttribute('trace-click').replace('cps:yes_s;ppath:','')+'%3B';
        });
        queryStr = queryStr.substr(0,queryStr.length-3);
        if(queryStr.length !== len - 1)
        location.search += queryStr;
    };
    var arrayIsEq = function(arr1,arr2){
        if(!arr1 || !arr2) return false;
        var len1 = arr1.length,len2 = arr2.length;
        if(len1 !== len2) return false;
        for(var i=0;i<len1;i++){
            if(arr1[i]!==arr2[i])return false;
        }
        return true;
    };
    init();
})();