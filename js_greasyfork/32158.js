// ==UserScript==
// @name           AJAX plugin for IML
// @description    ajax plugin used by Iron Man
// @namespace      https://greasyfork.org/users/136230
// @description:ru ajax плагин от Iron Man
// @include        *
// @author         Iron_man
// @date           2018.02.04
// @version        1.0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/32158/AJAX%20plugin%20for%20IML.user.js
// @updateURL https://update.greasyfork.org/scripts/32158/AJAX%20plugin%20for%20IML.meta.js
// ==/UserScript==
(function(){
	IML.extend({
		ajax: function( request ){
			if( !request )
				return;
			var evt_types = ['onload', 'onreadystatechange', 'onerror', 'onprogress'],
				xhr, key;
			request.method = request.method || 'GET';
			if( request.method.toUpperCase() === 'GET' && request.data ){
				request.url += '?' + request.data;
				request.data = '';
			}
			request.async = request.async === false ? request.async : true;
			if( window.XMLHttpRequest )
				xhr = new XMLHttpRequest();
			else if( window.ActiveXObject ){
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			}
			if( !xhr ){
				console.error("[IML.ajax] can't create xhr");
				return;
			}
			xhr.open( request.method, request.url, request.async );
			for( key in request.headers )
				xhr.setRequestHeader( key, request.headers[key] );
			evt_types.forEach( function(type){
				if( request[type] )
					xhr[type] = function(event){request[type].call( xhr, xhr.responseText, event );};
			});
			xhr.send( request.data || null );
		},
	});
})();