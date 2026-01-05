// ==UserScript==
// @name          	Google Video Youtube Player
// @namespace     	http://www.webmonkey.com
// @description   	Autoplay youtube videos "www.google./video" in little popup next to the link on mouse over; To proper working please disable dynamic search in google settings and switch off all yours "Youtube autoplay OFF";
// @include     	*www.google.*
// @exclude 		*plus.google*
// @version         1.0.2.1
// @downloadURL https://update.greasyfork.org/scripts/17374/Google%20Video%20Youtube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/17374/Google%20Video%20Youtube%20Player.meta.js
// ==/UserScript==


var _video =null;
var _lastYoutubeLink =null;
var _button =null;

var _absoluteMouseX;
var _absoluteMouseY;

var __frameWidth  =440;
var __frameHeight =260;
var __frameDealey =1200;


(
function()
{
	var _linkList = document.getElementsByTagName('a');
	var _linkFirst;
	
	var _mouseDownElements =0;
	var window1;

	var _httpGoogle  ="http://www.youtube.";
	var _httpsGoogle ="https://www.youtube.";

	
	if((
			window.location.href.match("www.google.") &&
			window.location.href.match("&tbm=vid") &&
			//window.location.href.match("&newwindow=1") &&
			true
		) ==false )
	{
		return;
	}
	
	
	_video = createVideoPopup();
	
	
	for(var i=0; i< _linkList.length; i++)
	{
		var _link = _linkList[i];
		
		var _onmousedown = _link.getAttribute('OnMouseDown');
		var _href = _link.getAttribute("href");
					
		if( _onmousedown &&
			_href &&
			( _href.match(_httpGoogle) || _href.match(_httpsGoogle) )
		)
		{
			_mouseDownElements++;
			
			if( _linkFirst ==null )
				_linkFirst = _link;
				
			_link.removeAttribute('onMouseDown');
				
			//_link.addEventListener("mouseover",
				//"funcDealey = setTimeout('showAlert()', 100)"
				/*function(event)
				{
					_absoluteMouseX = event.pageX;
					_absoluteMouseY = event.pageY;
					
					playVideo(_video, this.href);
				}*/
				
				/* function(event)
				{
					setTimeout(
						function(event)
						{
							_absoluteMouseX = event.pageX;
							_absoluteMouseY = event.pageY;
							
							playVideo(_video, this.href);
						}
						,1000)
				} */
			//);
			
			
			_link.onmouseover = function(event)
			{
				var _this_link = this;
				var delay = setTimeout(
					//function(){ showAlert(); }
					function() { playVideo(event, _this_link.href); }
					, __frameDealey);
					
				_this_link.onmouseout = function()
				{
					clearTimeout(delay);
					stopVideo();
				};
			}
			
			/* 
			_link.addEventListener("mouseout",
				//"clearTimeout(funcDelay)"
				function(event)
				{
					clearTimeout(funcDelay);
					
					stopVideo(_video);
				}
			); */
		}
	}

	
	if( _mouseDownElements >0 )
	{
		_button 		= document.createElement("input");
		_button.type 		="button";
		/* _button.value 	="Found <a> OnMouseDown =" +_mouseDownElements; */
		_button.value 	= 'videos [' +_mouseDownElements +'] :: first [' +_linkFirst.getAttribute('href') +']';
		//_button.value 	= window.location.href.substr(0, 30);
		/* _button.href 		=_linkFirst.getAttribute('href'); */
		/* _button.href 		=document.href; */
		/* _button.onclick 		=showAlert; */
		/* _button.onclick 		=window.location.href =_button.href; */
		/* _button.onclick 		=followLink; */
		/* _button.onmouseover 	=showAlert; */
		/* _button.setAttribute('onClick', 'window.location.href ="' +_linkFirst +'"'); */
		/* _button.setAttribute('onClick', 'openLink;'); */
		/* _button.setAttribute('onMouseOver', 'window.open("' +_linkFirst.getAttribute('href') +'")'); */
		_button.setAttribute('style', 'font-size:12px; position:absolute; top:150px; left:135px; visibility:hidden');
		
		//add event listener
		_button.addEventListener("click",
			function(event) {
				/* window.location.href ='Students.html'; */
				/* window.open( _button.href ); */
				/* alert('follow link  "' +_button.href +'"'); */
				/* followLink(_button.href); */
				playVideo(_video, this.href);
			}
		);
		
		_button.addEventListener("mouseover",
			function(event) {
				/* window.location.href ='Students.html'; */
				/* window.open( _button.href ); */
				/* alert('follow link  "' +_button.href +'"'); */
				/* followLink(_button.href); */
				playVideo(_video, this.href);
			}
		);
		
		_button.addEventListener("mouseout",
			function(event) {
				/* window.location.href ='Students.html'; */
				/* alert('follow link  "' +_button.href +'"'); */
				/* closeOldWindow(); */
				stopVideo(_video);
			}
		);
		
		document.body.appendChild(_button);
	}
}
)();

function openLink(aLink)
{
    alert('follow link  "' +aLink +'"');
	window.location.href = aLink;
}

function followLink(x)
{
    //alert('follow link  "' +x +'"');
	
	closeOldWindow();
    /* window1 = window.open(document.documentURI + x.getAttribute('href')); */
	window1 = window.open(x);
	/* window1.showModalDialog(); */
}

function showAlert()
{
    alert("Hello World");
}

function closeOldWindow()
{
	if (window1)
		window1.close();
}

function createVideoPopup()
{
	var _video 		=document.createElement("iframe");
	_video.type 	="text/html";
	/* _video.class	="youtube-player"; */
	_video.title	="youtube";
	_video.width	= __frameWidth;
	_video.height	= __frameHeight;
	_video.frameborder ='0';
	_video.scrolling ='no';
	_video.allowfullscreen ='0';
	/* _video.setAttribute('style', 'position:fixed; top:150px; right:10px; visibility:display'); */
	_video.setAttribute('style', 'visibility:hidden;');
	
	document.body.appendChild(_video);
		
	return _video;
}

function playVideo(event, aLink)
{
	_absoluteMouseX = event.pageX;
	_absoluteMouseY = event.pageY;
	
	var _href = aLink;
	// auto odtwarzanie
	_href +='?autoplay=1';
	// przyciski
	_href +='&autohide=1';
	// podobne filmy po zakończeniu odtwarzania
	_href +='&rel=0';
	// wyłączenie trybu pełnoekranowego
	_href +='&fs=0';
	
	_button.value = '[' +_absoluteMouseX +'; ' +_absoluteMouseY +']';
	
	if( _lastYoutubeLink !=null && _lastYoutubeLink == aLink )
		return;
	  
	_lastYoutubeLink = aLink
	
	
	var _posRight =5;
	var _posTop = _absoluteMouseY - __frameHeight/2;
	if( _posTop <125 )
		_posTop =125;
	
	var _posType ='absolute';
	
	
	_video.src = _href.replace("/watch?v=", "/embed/");
	/* _video.setAttribute('style', 'position:fixed; top:120px; right:5px; visibility:display'); */
	_video.setAttribute('style', 'position:' +_posType +'; top:' +_posTop +'px; right:' +_posRight +'px; visibility:display');
	_video.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
	
	/* _button.value = _video.src; */
	_button.value = '[' +_absoluteMouseX +'; ' +_absoluteMouseY +']';
	/* _button.setAttribute('style', 'visibility:hidden'); */
	
	//_video.play();
}

function stopVideo()
{
	_button.value =":: <PAUSE> ::";
	
	/* _video.setAttribute('style', 'visibility:hidden'); */
	_video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
	/* toggleVideo('hide'); */
	/* _video.pause(); */
}

function toggleVideo(state)
{
    // if state == 'hide', hide. Else: show video
    /* var div = _video;
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : ''; */
    /* func = state == 'hide' ? 'pauseVideo' : 'playVideo'; */
	
    _video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
}
