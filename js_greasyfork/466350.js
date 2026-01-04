// ==UserScript==
// @name         山西易安在线培训平台-100anquan-扫尾工作
// @namespace    v+++++++shuake345+++++++++++
// @version      0.1
// @description  私人专用，不要下载，秒刷+V：shuake345
// @author       Vx：shuake345
// @match        *://*.100anquan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466350/%E5%B1%B1%E8%A5%BF%E6%98%93%E5%AE%89%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0-100anquan-%E6%89%AB%E5%B0%BE%E5%B7%A5%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/466350/%E5%B1%B1%E8%A5%BF%E6%98%93%E5%AE%89%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0-100anquan-%E6%89%AB%E5%B0%BE%E5%B7%A5%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    function fh() {
		window.history.go(-1)
	}

	function gb() {
		window.close()
	}

	function sx() {
		window.location.reload()
	}
    setTimeout(sx,645200)
    function Bfy(){
        var Kcun=document.querySelectorAll("body > div.content > ul > li > ol > li > div.class_details_bottom > a> i")//[16].click()
    var Kcing=document.querySelector('a>h3.learning')
    for (var i = 0; i < Kcun.length; i++) {
        if (Kcun[i].innerText == "未学完" ||Kcun[i].innerText == "未学习" ) {
        Kcun[i].click()
            break
        }
		}
    }
    setInterval(Bfy,5421)
    function dj(){

    }

})();