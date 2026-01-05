// ==UserScript==
// @name         Hovercard follows
// @namespace    https://www.taringa.net/rata__7
// @version      0.4
// @description  Te dice si un usuario te sigue en la hovercard
// @author       Nezumi
// @match        *://www.taringa.net/*
// @downloadURL https://update.greasyfork.org/scripts/25840/Hovercard%20follows.user.js
// @updateURL https://update.greasyfork.org/scripts/25840/Hovercard%20follows.meta.js
// ==/UserScript==

// Se utiliza la funcion waitUntilExist que se agrega a jQuery para que cada hovercard pueda procesarse a medida que aparecen

;(function ($, window) {
    var intervals = {};
    var removeListener = function(selector) {
    	if (intervals[selector]) {
    		window.clearInterval(intervals[selector]);
    		intervals[selector] = null;
    	}
    };
    var found = 'waitUntilExists.found';
    $.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {
    	var selector = this.selector;
    	var $this = $(selector);
    	var $elements = $this.not(function() { return $(this).data(found); });
    	if (handler === 'remove') {
    		// Hijack and remove interval immediately if the code requests
    		removeListener(selector);
    	} else {
    		// Run the handler on all found elements and mark as found
    		$elements.each(handler).data(found, true);
    		if (shouldRunHandlerOnce && $this.length) {
    			// Element was found, implying the handler already ran for all 
    			// matched elements
    			removeListener(selector);
    		} else if (!isChild) {
    			// If this is a recurring search or if the target has not yet been 
    			// found, create an interval to continue searching for the target
    			intervals[selector] = window.setInterval(function () {
    				$this.waitUntilExists(handler, shouldRunHandlerOnce, true);
    			}, 250);
    		}
    	}
    	return $this;
    };
}(jQuery, window));

//Acá empieza mi código
var getSeguidores = function(id){
    console.log("Buscando seguidores...");
    var seguidores = {};
    var page = 1;
    var ok=true;
    while(ok){
      $.get('https://api.taringa.net/user/followers/view/' + id + '?trim_user=true&count=50&page='+ page, function(data){
        if(data.length > 0){
            data.forEach(function(u){
                seguidores[u] = true;
            });
            page++;
        } else {
            console.log("Fin seguidores");
            ok = false;
        }
      });
    }
    return seguidores;
};

var getTooltipUserId = function(tooltip){
    var str = tooltip.attr("class");
    str = str.substr(0,str.indexOf(' '));
    return parseInt(str.slice(10));
};

var tooltipUserFollowsMe = function(id){
    return typeof h_followers[id.toString()] !== 'undefined';
};

var hovercardFollows = function(){
    $(".tooltip-wrapper-v6").waitUntilExists(function(){
        var id = getTooltipUserId($(this));
        if(tooltipUserFollowsMe(id)){
            $('.user-status',$(this)).prepend('<span>Está siguiéndote</span>');
        }
    });
};

var h_nick = $('.user-name').html();
if(h_nick !== null){
    $.ajaxSetup({
        async: false
    });
    var h_followers = JSON.parse(localStorage.getItem("seguidores"));
    var lastFollowersCall = localStorage.getItem("seguidoresTime");
    var hoy = new Date();
    var limite = 1000*60*60*2; // 2 horas para recargar seguidores
    if(h_followers === null || lastFollowersCall === null || (hoy-Date.parse(lastFollowersCall)) > limite){
        h_followers = getSeguidores(global_data.user);
        localStorage.setItem("seguidores", JSON.stringify(h_followers));
        localStorage.setItem("seguidoresTime", hoy);
        console.log("Seguidores guardados :)");
    }
    hovercardFollows();
}
