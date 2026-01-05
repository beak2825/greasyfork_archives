// ==UserScript==
// @name         Drag sidebar
// @namespace    http://your.homepage/
// @version      0.3.2
// @description  Permite arrastrar los elementos de la barra lateral de taringa/mi
// @author       You
// @include      http://www.taringa.net/mi*
// @include      http://www.taringa.net/mi/*
// @include      http://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12195/Drag%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/12195/Drag%20sidebar.meta.js
// ==/UserScript==
/*jshint multistr: true */

$(document).ready(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.innerHTML = "$(\".section-mi #sidebar br\").remove(); \
	$(\".section-mi #sidebar div.box.mi-ads\").remove(); \
	$(\".section-mi #sidebar .box h2:contains('Cumpleaños')\").parent().parent().attr('id', 'sideCumple'); \
	$(\".section-mi #sidebar .box h2:contains('En vivo')\").parent().parent().attr('id', 'sideVivo'); \
	$(\".section-mi #sidebar .box form input[name='pin_add']\").parent().parent().attr('id', 'sidePinAdd'); \
	$(\".section-mi #sidebar .box h2:contains('Buscar en Shouts')\").parent().parent().attr('id', 'sideBuscarS'); \
	$(\".section-mi #sidebar .box h2:contains('Usuarios recomendados')\").parent().parent().attr('id', 'sideUsersR'); \
	$(\".section-mi #sidebar .box a[href='/buscar/amigos/']\").parent().remove(); \
	$(\".section-mi #sidebar .box h2:contains('Seguidos online')\").parent().parent().attr('id', 'sideSeguidos'); \
	var setCookieExpiry = 20000; \
	$('.section-mi #sidebar').sortable({ \
	    containment: \".section-mi #sidebar\", \
	    scroll: false, \
	    items: \"> div.box\" \
	}); \
	var setSelector = \".section-mi #sidebar\"; \
	var setCookieName = \"tsideorder\"; \
	 \
	function setOrder() { \
	    createCookie(setCookieName, $(setSelector).sortable(\"toArray\",{items: \"> div.box\"}), setCookieExpiry); \
	} \
	 \
	function restoreOrder() { \
	    var list = $(setSelector); \
	    if (list == null) return; \
	    var cookie = readCookie(setCookieName); \
	    if (!cookie) return; \
	    var IDs = cookie.split(\",\"); \
	    var items = list.sortable(\"toArray\",{items: \"> div.box\"}); \
	    var rebuild = new Array(); \
	    for (var v = 0, len = items.length; v < len; v++) { \
	        rebuild[items[v]] = items[v]; \
	    } \
	    for (var i = 0, n = IDs.length; i < n; i++) { \
	        var itemID = IDs[i]; \
	        if (itemID in rebuild) { \
	        	if(i == 0){ \
	        		$(\".section-mi #sidebar.ui-sortable\").children(\"#\" + itemID).prependTo(\".section-mi #sidebar.ui-sortable\"); \
	        	}else{ \
	        		var prevItem = IDs[i - 1]; \
	        		if(prevItem in rebuild){ \
	        			$(\".section-mi #sidebar.ui-sortable\").children(\"#\" + itemID).insertAfter($(\".section-mi #sidebar.ui-sortable\").children(\"#\" + prevItem)); \
	        		}else{ \
	        			$(\".section-mi #sidebar.ui-sortable\").children(\"#\" + itemID).appendTo(\".section-mi #sidebar.ui-sortable\"); \
	        		} \
	        	}   \
	        } \
	    } \
	} \
	jQuery(document).ready(function() { \
	    $(\".section-mi #sidebar\").sortable({ \
	        axis: \"y\", \
	        cursor: \"move\", \
	        update: function() { \
	            setOrder(); \
	        } \
	    }); \
	    restoreOrder(); \
	});";
    document.body.appendChild( scriptElement );
});