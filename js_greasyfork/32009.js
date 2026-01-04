// ==UserScript==
// @name           Super Light AJAX plugin
// @description    Super Light AJAX plugin by IvanSkvortsov
// @description:ru Супер упрощенная версия AJAX плагина от IvanSkvortsov
// @include        *://*
// @author         IvanSkvortsov
// @date           2017.08.05
// @version        1.0.5
// @grant          none
// ==/UserScript==
(function(){
	var lqueue = [], lrequestInProgress = false, lqueueCleaned = true;
	var activeXs = ['Msxml3.XMLHTTP', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP',];
	var events = ['onabort', 'onerror', 'onload', 'onloadend', 'onloadstart', 'onprogress', 'onreadystatechange', 'ontimeout',];
	function XHttpRequestLight(){
		var request = lqueue[0], xhttp = null, i, key;
		if(!( request && (lrequestInProgress === false || request.async === true) && lqueue.length > 0 ))
			return;
		// handle request:
		request.method = request.method || 'GET';
		if( request.method.toUpperCase() === 'GET' && request.data ){
			request.url += '?' + request.data;
			request.data = null;
		}
		request.async = typeof request.async === 'boolean' ? request.async : true;
		// createXmlHttpRequest:
		if( window.XMLHttpRequest )
			xhttp = new XMLHttpRequest();
		else if( window.ActiveXObject ){
			for( i = 0; i < activeXs.length; ++i ){
				try{xhttp = new ActiveXObject(activeXs[i]);}
				catch(error){continue;}
				break;
			}
			if( !xhttp ){
				console.error("[XHttpRequestLight] can't create ActiveXObject");
				return;
			}
		}else{
			console.error("[XHttpRequestLight] can't create XmlHttpRequest object");
			return;
		}
		xhttp.open( request.method, request.url, request.async );
		lrequestInProgress = true;
		lqueue.shift();
		for( key in request.headers )
			xhttp.setRequestHeader( key, request.headers[key] );
		xhttp.url = request.url;
		// handle XmlHttpRequest events
		events.forEach(function(type){
			if( request[type] ){
				xhttp[type] = function(event){
					xhttp.lengthComputable = event.lengthComputable || false;
					xhttp.loaded = event.loaded || 0;
					xhttp.total = event.total || 0;
					request[type].call(xhttp, xhttp.responseText);
					if( type === 'onerror' || type === 'onload' || (type === 'onreadystatechange' && xhttp.readyState == 4 && xhttp.status == 200 && !request.onload)){
						lrequestInProgress = false;
						request.delay = request.delay > 20 ? request.delay : 20;
						setTimeout( XHttpRequestLight, request.delay );
					}
				};
			}
		});
		xhttp.send( request.data || null);
	}
	function createNewRequest( url, settings )
	{
		var key, val, request = {};
		for( key in settings )
		{
			val = settings[key];
			if( Object.prototype.hasOwnProperty.call( settings, key ) && val )
				request[key] = val;
		}
		request.url = url;
		return request;
	}
	window.ISL = window.ISL || {};
	// AJAX API
	ISL.lajaxAddXHR = function(){
		var request, url, settings;
		switch(arguments.length){
			case 0:
				return;
			case 1:
				request = arguments[0];
				if( request.length )
					lqueue = lqueue.concat( request );
				else
					lqueue.push(request);
				break;
			case 2:
				url = arguments[0];
				settings = arguments[1];
				if( url.length )
					url.forEach(function(u){ lqueue.push(createNewRequest(u, settings));} );
				else
					lqueue.push(createNewRequest(url, settings));
				break;
			default:
				console.error("[lajaxAddXHR] invalid number of arguments: " + arguments.length);
				return;
		}
		lqueueCleaned = false;
	};
	ISL.lajax = function(){
		ISL.lajaxAddXHR.apply(this, arguments);
		XHttpRequestLight();
	};
	ISL.lajaxClean = function(){
		lqueue.length = 0;
		lrequestInProgress = false;
		lqueueCleaned = true;
	};
	ISL.lajaxLength = function(){ return lqueue.length; };
})();