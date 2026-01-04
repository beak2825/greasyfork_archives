// ==UserScript==
// @name           Light AJAX plugin
// @description    Light AJAX plugin by IvanSkvortsov
// @description:ru Упрощенная версия AJAX плагина от IvanSkvortsov
// @include        *://*
// @author         IvanSkvortsov
// @date           2017.08.04
// @version        1.0.0
// @grant          none
// ==/UserScript==

(function(){
	var queue = [], requestInProgress = false, queueCleaned = true;
	function createXHttp()
	{
		if( window.XMLHttpRequest )
			return new XMLHttpRequest();
		else if( window.ActiveXObject ){
			var types = [
				'Msxml3.XMLHTTP',
				'Msxml2.XMLHTTP.6.0',
				'Msxml2.XMLHTTP.3.0',
				'Msxml2.XMLHTTP',
				'Microsoft.XMLHTTP',
			];
			for( let i = 0; i < types.length; ++i )
			{
				try{
					return new ActiveXObject(types[i]);
				}catch(error){}
			}
			console.error("[createXHttp] can't create ActiveXObject");
		}else{
			console.error("[createXHttp] can't create xhttp object");
		}
		return null;
	}
	function getXHttpRequest(){
		if( !(queue.length > 0) )
			return null;
		var request = queue[0];
		request.method = request.method || 'GET';
		if( request.method.toUpperCase() === 'GET' && request.data && request.data !== '' )
		{
			request.url += '?' + request.data;
			request.data = '';
		}
		request.async = (typeof request.async !== 'boolean' ? true : request.async );
		return request;
	}
	function handleXHttpEvent( type, xhttp, request, event ){
		var response;
		if( request[type] )
		{
			response = xhttp;
			response.lengthComputable = xhttp.lengthComputable || event.lengthComputable || false;
			response.loaded = xhttp.loaded || event.loaded || 0;
			response.total = xhttp.total || event.total || 0;
			response.url = xhttp.responseURL || request.url;
			
			request[type].call( response, response.responseText );
			if( type === 'onerror' || type === 'onload' ||
				(type === 'onreadystatechange' && response.readyState == 4 && response.status == 200 && !request.onload ) )
			{
				requestInProgress = false;
				request.delay = request.delay > 20 ? request.delay : 20;
				setTimeout( XHttpRequest, request.delay );
			}
		}
	}
	function initXHttpEvents( xhttp, request ){
		var types = ['onabort', 'onerror', 'onload', 'onloadend', 'onloadstart', 'onprogress',
			'onreadystatechange', 'ontimeout',];
		function addXHttpEventListener(type){
			if( request[type] )
				xhttp[type] = function XHttpEvents(event){handleXHttpEvent(type, xhttp, request, event);};
		}
		types.forEach( addXHttpEventListener );
	}
	function initXHttp( xhttp, request ){
		initXHttpEvents( xhttp, request );
		for( let key in request.headers )
			xhttp.setRequestHeader( key, request.headers[key] );
	}
	function XHttpRequest(){
		var request, xhttp;
		request = getXHttpRequest();
		if( request && (requestInProgress === false || request.async === true) && queue.length > 0 )
		{
			queue.shift();
			requestInProgress = true;
			xhttp = createXHttp();
			initXHttp( xhttp, request );
			xhttp.open( request.method, request.url, request.async );
			xhttp.send( request.data || null );
		}
	}
	function constructXHttpRequest( url, settings ){
		var request = createNewObject(settings);
		request.url = url;
		return request;
	}
	function createNewObject( obj ){
		if( !obj )
			return {};
		var new_obj = {}, key, val;
		for( key in obj )
		{
			val = obj[key];
			if( Object.prototype.hasOwnProperty.call(obj, key) && val )
				new_obj[key] = val;
		}
		return new_obj;
	}
	window.ISL = window.ISL || {};
	// AJAX API
	ISL.ajaxClean = function(){
		queue.length = 0;
		requestInProgress = false;
		queueCleaned = true;
	};
	ISL.ajaxLength = function(){ return queue.length; };
	ISL.ajaxAddXHR = function(){
		var request, url, settings;
		switch( arguments.length )
		{
			case 0:
				return;
			case 1:
				request = arguments[0];
				if( request.length )
					request.forEach( function(req){ queue.push(req);} );
				else
					queue.push(request);
				break;
			case 2:
				url = arguments[0];
				settings = arguments[1];
				if( url.length )
					url.forEach( function(u){queue.push(constructXHttpRequest(u, settings));});
				else
					queue.push( constructXHttpRequest(url, settings) );
				break;
			default:
				console.error("[ajaxAddXHR] invalid number of arguments");
				return;
		}
		queueCleaned = false;
	};
	ISL.ajax = function(){
		this.ajaxAddXHR(arguments);
		XHttpRequest();
	};
})();