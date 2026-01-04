// ==UserScript==
// @name           AJAX plugin - SkIvLib
// @description    AJAX plugin by Ivan Skvortsov
// @description:ru AJAX плагин от Ivan Skvortsov
// @include        *://*
// @author         Ivan Skvortsov
// @version        1.1.3
// @grant          none
// ==/UserScript==

(function(){
	var clog = function(){};
	if( !clog )
		clog = console.log;
	var factory = [], queue = [], request_in_progress = false, queue_cleaned = true;
	var xhttpResponse = [];
	function addXHttpResponse( responseText )
	{
		if( typeof responseText !== 'string' )
			return xhttpResponse.push({invalid: true});
		xhttpResponse.push({
			invalid: false,
			text: responseText,
			get bytes(){ return this.text.length; },
			get Kb(){ return this.bytes/1024; },
			get Mb(){ return this.bytes/(1024 * 1024); },
		});
	}
	function queueStatus()
	{
		return "queueStatus:\n" +
			"queue.length = " + queue.length + "\n" +
			"in_progress  = " + request_in_progress + "\n" +
			"cleaned      = " + queue_cleaned + "\n" +
			"--------------";
	}
	function requestStatus( request )
	{
		return "requestStatus:\n" +
			"method = " + request.method + "\n" +
			"url    = " + request.url + "\n" +
			"async  = " + request.async + "\n" +
			"data   = " + request.data + "\n" +
			//"onload = " + request.onload + "\n" +
			"--------------";
	}
	function createNewObject( obj )
	{
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
	function initXHttpFactory()
	{
		if( factory && factory.length > 0 )
			return;
		clog( "initXHttpFactory");
		factory = [
			function(){ return new XMLHttpRequest();},
			function(){ return new ActiveXObject('Msxml3.XMLHTTP');},
			function(){ return new ActiveXObject('Msxml2.XMLHTTP.6.0');},
			function(){ return new ActiveXObject('Msxml2.XMLHTTP.3.0');},
			function(){ return new ActiveXObject('Msxml2.XMLHTTP');},
			function(){ return new ActiveXObject('Microsoft.XMLHTTP');},
		];
	}
	function createXHttp()
	{
		clog("createXHttp");
		initXHttpFactory();
		for( let i = 0; i < factory.length; ++i )
		{
			try{
				return factory[i]();
			}catch(error){}
		}
		console.error("[createXHttp] can't create xhttp object");
		return null;
	}
	function getXHttpRequest()
	{
		clog("getXHttpRequest : queue.length = " + queue.length);
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
		request.store = (typeof request.store !== 'boolean' ? false: request.store );
		clog( requestStatus(request) );
		return request;
	}
	function handleXHttpEvent( type, xhttp, request, event )
	{
		clog("handleXHttpEvent : url=" + request.url + ", type=" + type + ", readyState=" + xhttp.readyState + ", status=" + xhttp.status );
		var context, response;
		if( request[type] )
		{
			response = xhttp;
			response.lengthComputable = xhttp.lengthComputable || event.lengthComputable || false;
			response.loaded = xhttp.loaded || event.loaded || 0;
			response.total = xhttp.total || event.total || 0;
			response.url = xhttp.responseURL || request.url;
			
			context = request.context || response;
			request[type].call( context, response.responseText );
			if( type === 'onerror' || type === 'onload' ||
				(type === 'onreadystatechange' && response.readyState == 4 && response.status == 200 && !request.onload ) )
			{
				addXHttpResponse( (request.store ? response.responseText : undefined) );
				request_in_progress = false;
				request.delay = request.delay > 20 ? request.delay : 20;
				setTimeout( XHttpRequest, request.delay );
			}
		}
	}
	function initXHttpEvents( xhttp, request )
	{
		var types = [
			'onabort',
			'onerror',
			'onload',
			'onloadend',
			'onloadstart',
			'onprogress',
			'onreadystatechange',
			'ontimeout',
		];
		function addXHttpEventListener(type){
			if( request[type] )
				xhttp[type] = function XHttpEvents(event){handleXHttpEvent(type, xhttp, request, event);};
		}
		types.forEach( addXHttpEventListener );
		clog("initXHttpEvents: ", xhttp);
	}
	function initXHttp( xhttp, request )
	{
		initXHttpEvents( xhttp, request );
		for( let key in request.headers )
		{
			xhttp.setRequestHeader( key, request.headers[key] );
		}
	}
	function XHttpRequest()
	{
		var request, xhttp;
		request = getXHttpRequest();
		if( request && (request_in_progress === false || request.async === true) && queue.length > 0 )
		{
			clog("XHttpRequest");
			queue.shift();
			request_in_progress = true;
			xhttp = createXHttp();
			initXHttp( xhttp, request );
			clog("XHttpRequest : url=" + request.url + ", readyState=" + xhttp.readyState + ", status=" + xhttp.status );
			xhttp.open( request.method, request.url, request.async );
			xhttp.send( request.data || null );
		}
	}
	function addXHttpRequest( ...args )
	{
		var request, url, settings;
		switch( args.length )
		{
			case 0:
				return;
			case 1:
				request = args[0];
				clog("request: ", request);
				if( request.length )
					request.forEach( function(req){ queue.push(req);} );
				else
					queue.push(request);
				break;
			case 2:
				url = args[0];
				settings = args[1];
				clog("request: url=" + url + ", settings: ", settings);
				if( url.length )
					url.forEach( function(u){queue.push(constructXHttpRequest(u, settings));});
				else
					queue.push( constructXHttpRequest(url, settings) );
				break;
			default:
				return;
		}
		queue_cleaned = false;
	}
	function constructXHttpRequest( url, settings )
	{
		var request = createNewObject(settings);
		request.url = url;
		return request;
	}
	function cleanXHttpQueue()
	{
		xhttpResponse.length = 0;
		queue.length = 0;
		request_in_progress = false;
		queue_cleaned = true;
	}
	function queueLength()
	{
		return queue.length;
	}
	function getXHttpResponse(index)
	{
		if( !index || index < 0 )
			return xhttpResponse;
		else if( xhttpResponse.length > 0 )
			return xhttpResponse[index];
		else
			return {text: '', invalid: true, bytes:0, Kb: 0, Mb: 0};
	}
	window.SkIvLib = window.SkIvLib || {};
	// AJAX API
	SkIvLib.ajaxResponse = getXHttpResponse;
	SkIvLib.ajaxClean = cleanXHttpQueue;
	SkIvLib.ajaxLength = queueLength;
	SkIvLib.ajaxStatus = queueStatus;
	SkIvLib.ajaxAddXHR = addXHttpRequest;
	SkIvLib.ajax = function(...args)
	{
		xhttpResponse.length = 0;
		addXHttpRequest(...args);
		console.log("SkIvLib.ajax(): length = " + this.ajaxLength());
		XHttpRequest();
	};
})();