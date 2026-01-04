

    // ==UserScript==
    // @name        	调整XIAAV论坛帖子宽度
    // @namespace   amer0798
    // @match        	*://xav4.sbs/*
    // @include     	https://xav4.sbs/
    // @require		https://code.jquery.com/jquery-latest.js
    // @version    	1.1
    // @icon         	https://xav4.sbs/favicon.ico
    // @grant       	none
    // @run-at		document-end
    // @license MIT
    // @description 	调整XIAAV论坛帖子宽度为95%
// @downloadURL https://update.greasyfork.org/scripts/458272/%E8%B0%83%E6%95%B4XIAAV%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458272/%E8%B0%83%E6%95%B4XIAAV%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6.meta.js
    // ==/UserScript==
     
    // 调整XIAAV论坛帖子宽度为95%
     
    // Your Settings here
    function Main()
    {
       $(".wp").width("98%")
    }
    Main()

