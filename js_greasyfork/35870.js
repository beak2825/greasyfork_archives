// ==UserScript==
// @name Catproxy 4chan cache
// @description Automatic proxy and archival for 4chan images/videos/audio
// @namespace Violentmonkey Scripts
// @match *://*.4chan.org/*
// @match *://4chan.org/*
// @grant        GM_addStyle
// @run-at document-start
// @version 0.0.1.20171201002550
// @downloadURL https://update.greasyfork.org/scripts/35870/Catproxy%204chan%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/35870/Catproxy%204chan%20cache.meta.js
// ==/UserScript==


GM_addStyle ("\
@keyframes nodeInserted {  \
    from {  \
        outline-color: #fff; \
    }\
    to {  \
        outline-color: #000;\
    } \
}\
\
@-moz-keyframes nodeInserted {  \
    from {  \
        outline-color: #fff; \
    }\
    to {  \
        outline-color: #000;\
    }  \
}\
\
@-webkit-keyframes nodeInserted {  \
    from {  \
        outline-color: #fff; \
    }\
    to {  \
        outline-color: #000;\
    }  \
}\
\
@-ms-keyframes nodeInserted {  \
    from {  \
        outline-color: #fff; \
    }\
    to {  \
        outline-color: #000;\
    } \
}\
\
@-o-keyframes nodeInserted {  \
    from {  \
        outline-color: #fff; \
    }\
    to {  \
        outline-color: #000;\
    }  \
} \
\
img, video, audio {\
    animation-duration: 0.01s;\
    -o-animation-duration: 0.01s;\
    -ms-animation-duration: 0.01s;\
    -moz-animation-duration: 0.01s;\
    -webkit-animation-duration: 0.01s;\
    animation-name: nodeInserted;\
    -o-animation-name: nodeInserted;\
    -ms-animation-name: nodeInserted;\
    -moz-animation-name: nodeInserted;\
    -webkit-animation-name: nodeInserted;\
}\
");

/*
var images = document.getElementsByTagName("img");
for (var i=0; i<images.length; i++) {
	var proxy = "https://catproxy-winceptor.c9users.io/proxy?url=";
	var originalurl = images[i].src;
	var proxyurl = proxy + encodeURIComponent(originalurl);
	images[i].src = proxyurl;
}
*/

var proxy = "https://catproxy-winceptor.c9users.io/proxy?url=";

var count = 1;
var eloadevent = function(event){
  if (event.animationName == 'nodeInserted') {
    //console.log(count + ": " + event.target + " added to DOM!");
    //count++;
    
    
	  var originalurl = event.target.src;
    var proxyurl = proxy + encodeURIComponent(originalurl);
    if (!originalurl.split(proxy)[1]) {
      event.target.src = proxyurl;
      console.log(originalurl + " served through catproxy");
    }
	  
	  
    //event.target.textContent = 'Element ' + count++ + ' has been parsed!';
  }
  
}
        
document.addEventListener('animationstart', eloadevent, false);
document.addEventListener('MSAnimationStart', eloadevent, false);
document.addEventListener('webkitAnimationStart', eloadevent, false);