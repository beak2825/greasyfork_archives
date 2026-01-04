// ==UserScript==
// @name        IManL ajax plugin
// @namespace   https://greasyfork.org/ru/users/136230-iron-man
// @description AJAX plugin for IManL library
// @include     *
// @version     1.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32047/IManL%20ajax%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/32047/IManL%20ajax%20plugin.meta.js
// ==/UserScript==
(function(){
	var responseSize = [], memoryCount = false;
	window.IManL = window.IManL || {};
	IManL.ajaxMemLength = function(){
		return responseSize.length;
	};
	IManL.ajaxMemClean = function(){responseSize.length = 0;};
	IManL.ajaxMemStart = function(){memoryCount = true;};
	IManL.ajaxMemStop = function(){ memoryCount = false;};
	IManL.ajaxMemTotalSize = function(){
		var totalSize = 0;
		responseSize.forEach( function(sz){
			totalSize += sz;
		});
		return totalSize;
	};
	IManL.ajaxMemSize = function size( index ){
		return responseSize[index || 0];
	};
	IManL.ajax = function ajax( request ){
		if( !request )
			return;
		var evt_types = ['onload', 'onreadystatechange', 'onerror', 'onprogress'],
			actx_types = ['Msxml3.XMLHTTP', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'],
			xhr, key, i, old_onload;
		request.method = request.method || 'GET';
		if( request.method.toUpperCase() === 'GET' && request.data ){
			request.url += '?' + request.data;
			request.data = '';
		}
		request.async = request.async === false ? request.async : true;
		old_onload = request.onload;
		if( old_onload && memoryCount ){
			request.onload = function(r){
				responseSize.push( r.length );
				old_onload.apply(this, arguments);
			};
		}else if( memoryCount ){
			request.onload = function(r){
				responseSize.push(r.length);
			};
		}
		if( window.XMLHttpRequest )
			xhr = new XMLHttpRequest();
		else if( window.ActiveXObject ){
			for( i = 0; i < actx_types.length; ++i ){
				try{
					xhr = new ActiveXObject(actx_types[i]);
				}catch(error){continue;}
				break;
			}
			if( !xhr ){
				console.error("[ajax] can't create ActiveXObject\ntypes: ", actx_types);
				return;
			}
		}else{
			console.error("[ajax] can't create xhr");
			return;
		}
		xhr.open( request.method, request.url, request.async );
		for( key in request.headers )
			xhr.setRequestHeader( key, request.headers[key] );
		evt_types.forEach( function(type){
			if( request[type] ){
				xhr[type] = function(event){request[type].call( xhr, xhr.responseText, event );};
			}
		});
		xhr.send( request.data || null );
	};
})();