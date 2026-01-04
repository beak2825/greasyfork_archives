// ==UserScript==
// @name       	webm
// @namespace  	http://www.wykop.pl/*
// @version    	1.1
// @description webmy na wykopie
// @include     *://www.wykop.pl/*
// @exclude     *://www.wykop.pl/cdn/*
// @exclude     *://www.wykop.pl/wykopalisko/*
// @grant 		none
// @copyright  	Arkatch
// @downloadURL https://update.greasyfork.org/scripts/34361/webm.user.js
// @updateURL https://update.greasyfork.org/scripts/34361/webm.meta.js
// ==/UserScript==
(function(){
	var entryiC = document.getElementsByClassName('entry iC');
function makeFrame(webmLink, comment){
	var player = document.createElement('video');
	var source = document.createElement('source');
	player.setAttribute('width', '480');
	player.setAttribute('height', '320');
	player.setAttribute('controls', '');
	source.setAttribute('src', ''+webmLink+'');
	source.setAttribute('type', 'video/webm');
	player.appendChild(source);
	comment.appendChild(player);
}


for(var i=0, j=entryiC.length;i<j;i++){
	var textComment = entryiC[i].getElementsByClassName('text');
	for(var k=0, l=textComment.length;k<l;k++){
		try{
			var hrefWebm = textComment[k].getElementsByTagName('a');
			
			for(var m=0, n=hrefWebm.length;m<n;m++){
				if(hrefWebm[m].innerText=="webm"){
					makeFrame(hrefWebm[m].getAttribute("href"), textComment[k]);
				}
			}
		}catch(e){
console.log(e);                
}
	}
}
})();