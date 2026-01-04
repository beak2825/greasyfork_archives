// ==UserScript==
// @name               Block Baidu Hot List
// @name:zh-CN         百度热点搜索屏蔽
// @namespace          h
// @version            1.1
// @description        Just Block Baidu Hot List
// @description:zh-CN  百度热点搜索栏目屏蔽
// @author             hoothin
// @include            http*://www.baidu.com/*
// @include            http*://m.baidu.com/*
// @grant              none
// @run-at             document-start
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 未测试
// @compatible         opera 未测试
// @compatible         safari 未测试
// @contributionURL    null
// @contributionAmount 1
// @downloadURL https://update.greasyfork.org/scripts/31648/Block%20Baidu%20Hot%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/31648/Block%20Baidu%20Hot%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';



    function addLoadEvent(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {  
            window.onload = function() {
                oldonload();
                func();
            };
        }
    }



    function t(){
        $(".opr-toplist-table").remove();
        $(".opr-recommends-merge-panel").remove();
        $(".opr-recommends-merge-mbGap").remove();
        console.log(" hot list table removed !");
    }

    if('undefined' === typeof window.jQuery){
         addLoadEvent(t);
    }else{
        t();
        console.log("biu~");
    }

var setInterval_id;

setInterval_id = setInterval(function(){
    if(document.querySelector("#content_right") ){
       $$("#content_right",'remove','all');
       //clearInterval(setInterval_id);
    }
},100);

function $$(selector,operation,nodes_model){
	var model = nodes_model || 'one';

	switch(operation){

		case 'hide':
			if(  model =='one' ){
				var  page_ele = document.querySelector(selector) ;
				if(!page_ele){
					return;
				}
				page_ele.style.display = "none" ;
			}else{
				var  arr =  document.querySelectorAll(selector);
				if(!arr){
					return;
				}
				Array.prototype.forEach.call(arr,function(e){e.style.display = "none";});

			}
		break;


		case 'remove':
			if(  model =='one' ){
				var  page_elem = document.querySelector(selector) ;
				if(!page_elem){
					return;
				}
				page_elem.parentNode.removeChild(page_elem);
			}else{
				var  arr_remove =  document.querySelectorAll(selector);
				if(!arr_remove){
					return;
				}
				Array.prototype.forEach.call(arr_remove,function(e){e.parentNode.removeChild(e);});
			}
		break;

		default:
			if(model ==='one'){
				return  document.querySelector(selector) ;
			}else{
				return  document.querySelectorAll(selector);
			}
	}
}

})();