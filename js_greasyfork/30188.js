// ==UserScript==
// @name           Youtube Thumbs
// @namespace      hr
// @description    mouseover to animate thumbs
// @version        1.1
// @include        http://*youtube.com*
// @include        https://*youtube.com*
// @exclude        http*://img.youtube.com/vi/*
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/30188/Youtube%20Thumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/30188/Youtube%20Thumbs.meta.js
// ==/UserScript==
const LOOP_INTERVAL = 700; // 1000 = 1 second
var loopHandler, img, imgs, defaultname, endname;

scriptinit();
function scriptinit() {
    document.addEventListener('mouseover', mo, false);
}

GM_registerMenuCommand('Youtube Thumbs: toogle buttons', function(){GM_setValue('noButtons',!GM_getValue('noButtons'));});

function mo(evt)
{
	if( evt.target.nodeName=='IMG' && evt.target.getAttribute('src') && evt.target.getAttribute('src').search(/default\.jpg/)>-1 )
	{
		defaultname = evt.target.getAttribute('src').match(/\/[^\/]+\.jpg/);
        endname = evt.target.getAttribute('src').match(/\?.*/);
		start(evt);
		evt.target.addEventListener('mouseout', end, false);		
	}
}


function start(evt)
{
	img = evt.target;
	imgZIndex(evt);
	img.setAttribute('src', img.getAttribute('src').replace(/\/[^\/]+\.jpg.*/, '/1.jpg'));
	loopHandler = setInterval(loop, LOOP_INTERVAL);
}


function loop()
{
	if(!img){
		clearInterval(loopHandler);
		return;
	}
	var num = parseInt( img.getAttribute('src').match(/(\d)\.jpg/)[1] );
	if(num==3) 
		num = 1;
	else 
		num++;
	img.setAttribute('src', img.getAttribute('src').replace(/\d\.jpg/, +num+'.jpg')); 
}


function end(evt)
{
	var node;
	clearInterval(loopHandler);
	evt.target.setAttribute('src', img.getAttribute('src').replace(/\/[^\/]+\.jpg/, defaultname).concat(endname));
    
	img.style.zIndex = null;
	img = null;
}


function imgZIndex(evt){
	if(GM_getValue('noButtons') || evt.ctrlKey){
		img.style.zIndex = '999999999';
	}else{
		img.style.zIndex = null;
	}	
}

window.addEventListener('spfdone', scriptinit);
