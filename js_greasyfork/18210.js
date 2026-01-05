// ==UserScript==
// @name        miterunau_bottom
// @namespace   miterunau
// @description looking this page
// @include     *
// @version     1.1.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/18210/miterunau_bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/18210/miterunau_bottom.meta.js
// ==/UserScript==
(function($){
    var cBox = $('<div>').attr('id', 'cBox').css({
    	"height":"10px",
    	"width"	:"10px",
    	"z-index":1000000000,
    	"position":"fixed",
    	"background":"blue",
    	"top":2,
    	"left":2
    });
    $('body').filter(function(index){
    	return $('iframe').contents().find('body').parent().prop("tagName");
    }).append(cBox);
    function miterunau(){
	    f = 'http://twitter.com/home?status=' + encodeURIComponent('みてるなう｜' + document.title + ' - ' + location.href);
	    a = function() {
	        if (!window.open(f, '_blank', 'width=800,height=600')) location.href = f;
	    };
	    if (/Firefox/.test(navigator.userAgent)) {
	        setTimeout(a, 0);
	    } else {
	        a();
	    }
    }
    var p = document.getElementById('cBox');
    p.addEventListener('click', miterunau, false);
})(jQuery);
