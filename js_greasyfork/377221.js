// ==UserScript==
// @name         realpython
// @namespace    http://www.jiangyixin.top/
// @version      0.1
// @description  清理realpython多余元素，便于阅读
// @author       jiangyixin
// @match        *://realpython.com/*
// @resource     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377221/realpython.user.js
// @updateURL https://update.greasyfork.org/scripts/377221/realpython.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        function set_timer(name, clas) {
        	window[name] = window.setInterval(function () {
        		if ($(clas).length == 1) {
        			$(clas).remove();
        			window.clearInterval(window[name]);
        		}
        	}, 1000);
        }
        set_timer('share', '#at4-share');
    	var ts = $('.sidebar-module.sidebar-module-inset.border');
    	if (ts.length > 1) {
    		$(ts[0]).remove();
    	}
    	$('.navbar.sticky-top.navbar-expand-lg.navbar-dark.flex-column').remove();
    	$('.sidebar-module.sidebar-module-inset.p-0').remove();
    	$('.drip-tab-container').remove();
        $('.card.mb-3.bg-secondary').remove();
        $('.col-12.rounded.p-0.w-100.mt-2.mb-4').remove();
        $('.mx-3.py-5.mb-5.mt-0.alert.alert-light.border.text-dark').remove();
        $('.sidebar-module.sidebar-module-inset.p-0.my-4').remove();
        $('.card.mt-4').remove();
        $('.footer').remove();
    }

})();