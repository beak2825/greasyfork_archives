// ==UserScript==
// @name         HideSinaFlashInstallTips
// @name:zh-CN   隐藏新浪微博Flash安装提示
// @namespace    cat
// @version      0.1
// @description  去掉新浪微博弹出的提示“我们的产品需要安装flashplayer 10或更高版本”
// @author       Gavin
// @include      http://blog.sina.com.cn/*
// @run-at       document-end
// @website      https://21ido.com/
// @supportURL   https://github.com/think2cat/js4tampermonkey/blob/master/hideSinaFlashInstallTips/hideSinaFlashInstallTips.user.js
// @downloadURL https://update.greasyfork.org/scripts/368586/HideSinaFlashInstallTips.user.js
// @updateURL https://update.greasyfork.org/scripts/368586/HideSinaFlashInstallTips.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let timer = 0;
	let clearAlert = () => {
        try{
            let alertDom = document.getElementsByClassName("CP_w");
            if(alertDom){
                for(let i=0; i < alertDom.length; i++){
					if("none" != alertDom[i].style.display){
						alertDom[i].style.display = "none";
						alertDom[i].previousElementSibling.style.display = "none";
						clearInterval(timer);
					}
				}
            }
        }catch(e){
        }
	};

    window.onload = function(){
		timer = setInterval(clearAlert, 3000);
		setTimeout(()=>{
			clearInterval(timer);
		},60000);
    };
})();
