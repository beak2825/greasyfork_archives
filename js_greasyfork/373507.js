// ==UserScript==
// @name 知乎隐藏标题
// @version  1.0.1
// @namespace Violentmonkey Scripts
// @match  *://www.zhihu.com/*
// @include *://www.zhihu.com/*
// @grant none
// @description 公司浏览知乎，隐藏大字标题
// @downloadURL https://update.greasyfork.org/scripts/373507/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/373507/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(x=>{
  
    var init = ()=>{
		
        if(isURL("www.zhihu.com")){
          
			setInterval(fun=>{
			  paras = document.getElementsByClassName('QuestionHeader-title');
			  for(i=0;i<paras.length;i++){
				   //删除元素 元素.parentNode.removeChild(元素);
				  if (paras[i] != null)
					  paras[i].parentNode.removeChild( paras[i]);
			  }
			},500);
          
		}
       
    };
    
    init();

  
    function isURL(x){
        return window.location.href.indexOf(x) != -1;
    }
  
})()