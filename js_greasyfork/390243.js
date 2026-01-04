// ==UserScript==
// @name         屏蔽知乎华为PTSD用户回答
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  欢迎提供名单!
// @author       海军
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390243/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%8D%8E%E4%B8%BAPTSD%E7%94%A8%E6%88%B7%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/390243/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%8D%8E%E4%B8%BAPTSD%E7%94%A8%E6%88%B7%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
        removeHuaweiPTSD();
    }

    window.onscroll = function() {
        removeHuaweiPTSD();
    }

    var lock = false;
    var lists = ['立党','扩散性百万甜面包', '赵先生'];
    function removeHuaweiPTSD(){if(lock){return}lock=true;var t=document.getElementById('QuestionAnswers-answers');var items=t.querySelectorAll('.List-item');var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=items[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var item=_step.value;var a=item.querySelector('meta[itemprop="name"]');if(a&&lists.indexOf(a.getAttribute('content'))!==-1){if(item.parentNode){item.parentNode.removeChild(item)}}}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return!=null){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError;}}}lock=false}
    
})();