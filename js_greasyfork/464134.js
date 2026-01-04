// ==UserScript==
// @name         低端影视去广告
// @namespace    Teng
// @version      1.00
// @description  去除低端影视（ddys.art）广告（adblocker等去广告插件需把ddys添加到白名单）
// @author       teng
// @match        http*://ddys.art/*
// @grant        Teng
// @downloadURL https://update.greasyfork.org/scripts/464134/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/464134/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict'
	var pageUrl = window.location.href
    var pageHost = window.location.host

    //防抖函数
    function debound(fn, interval=10000){
        //第一次延迟10ms执行，后续延迟interval执行（interval默认为10000ms）
        let flag = null
        let delay = 10
        return function(){
            if(flag!==null){
                clearTimeout(flag)
                delay = interval
            }
            flag = setTimeout(()=>{
                fn()
            },delay)
        }
    }
    //低端影视处理函数
	function ddrk_handler(){
        if(document.getElementById('kasjbgih')){
            var mydiv=document.getElementById('kasjbgih')
            mydiv.style.height ='1px'
            mydiv.style.width = '1px'
            mydiv.style.position = 'absolute'
            mydiv.style.bottom = '10px'
        }
        if(document.querySelector('.cfa_popup')){
        	document.querySelector('.cfa_popup').remove()       
        }

	}
    //简单流程判断函数
	if (pageHost.includes("ddys")){
		ddrk_handler()
		    document.querySelector('.carousel-inner').firstElementChild.remove()
            document.querySelector('.carousel-inner').firstElementChild.classList.add('active')
    }else{
        console.log("脚本运行失败")
    }
})()