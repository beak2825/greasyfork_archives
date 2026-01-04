// ==UserScript==
// @name         京东搜索助手
// @namespace    https://github.com/yeomanye
// @version      0.1.0
// @description  自动保留京东搜索的筛选条件，点击按钮即可再运用
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @author       Ming Ye
// @match        https://search.jd.com/search?*
// @include        https://search.jd.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38307/%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/38307/%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = false;
    var log = myDebugger.consoleFactory("jd-assistant","log",null);
    var debugTrue = myDebugger.debugTrue; 
    var interval;
    var tagClickHandler = function(evt){
        var target = evt.target;
        var className = target.parentNode.parentNode.className;
        var targetClass = target.className;
        var targetId = target.id;
        if(className.indexOf('f-line') < 0 && className.indexOf('f-sort') < 0 && targetClass.indexOf('J_btnsConfirm') < 0 && targetId.indexOf('J-toolbar-load-hook') < 0) return;
        //延时，保证能够正确的读取到
        setTimeout(function(){
            var aElms = document.querySelectorAll('.crumb-select-item');
            //没有选中任何标签则返回
            if(aElms.length === 0)return;
            var arr = [];
            for(var i=0,len=aElms.length;i<len;i++){
                var tmpArr = aElms[i].title.split('、');
                for(var j=0,len2=tmpArr.length;j<len2;j++){
                    arr.push(tmpArr[j]);
                }
            }
            log.logObj('arr',arr);
            localStorage.setItem('jd-preSeaTagName',JSON.stringify(arr));
            createTag();
        },600);
    };
    var createTag = function(){
        setTimeout(function(){
            var panel = document.querySelector('.f-sort');
            var target = document.querySelector('.icon-tag.toggle-btn.recover-filter');
            if(target) return;
            var newA = document.createElement('a');
            newA.href = 'javascript:;';
            newA.innerText = '恢复筛选';
            newA.className = 'icon-tag toggle-btn recover-filter';
            panel.appendChild(newA);
            newA.addEventListener('click',searchTags);
        },1000);
    };
    var init = function(){
        document.body.addEventListener('click',tagClickHandler);
        createTag();
    };
    var searchTags = function(){
        var preTagArr = JSON.parse(localStorage.getItem('jd-preSeaTagName'));
        var tagElms = document.querySelectorAll('.J_valueList a');
        var tagArr = [];
        for(var i=0,len=tagElms.length;i<len;i++){
            tagArr.push(tagElms[i].innerText);
        }
        var queryStr = '&ev=',len = queryStr.length;
        var preType = '';
        preTagArr.forEach(function(str){
            var index = tagArr.indexOf(str);
            if(index >= 0){
                var tmpArr = tagElms[index].href.split('&');
                var hasSameType = true;//是否存在相同类型的标签
                tmpArr.forEach(function(str){
                    var i = str.search('ev=.+');
                    if(i>=0) {
                        var curType = str.split('_')[0];
                        if(curType !== preType)
                            queryStr += str.replace('ev=','');
                        else{
                            queryStr = queryStr.substr(0,queryStr.length - 3);
                            str = str.replace(curType+'_','%7C%7C');
                            queryStr += str;
                        }
                        preType = curType;
                    }
                });
            }
        });
        if(queryStr.length !== len)
        location.search += queryStr;
    };
    init();
})();