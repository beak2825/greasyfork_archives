// ==UserScript==
// @name         Zing TV HTML5 Player Fix
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Sửa player Zing TV trên Chrome
// @author       You
// @match        http://tv.zing.vn/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19368/Zing%20TV%20HTML5%20Player%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/19368/Zing%20TV%20HTML5%20Player%20Fix.meta.js
// ==/UserScript==
function loadJwPlayer(playerId,playerOption){
    var jw_js=document.getElementById('jw_js');
      if(typeof jw_js=='undefined'||jw_js==null){
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.id="jw_js";
        script.src= 'https://content.jwplatform.com/libraries/QHJ5Iarr.js';
        //script.src='/js/jwplayer/jwplayer.js';
        head.appendChild(script);
        this.interval=setInterval(()=>{
          if (typeof jwplayer != 'undefined') {          
            jwplayer(playerId).setup(playerOption);
            clearInterval(this.interval);
          }
        },500);
      }
      else jwplayer(playerId).setup(playerOption);
}
(function() {
    if(navigator.userAgent.match(/Chrome/).length>0){        
    var script=$('script').text();
    var video_link=script.match(/http.*?.mp4/g);
    var sources=[];
    var quality=['360p','480p','720p'];
    for(var i=0;i<video_link.length;i++){
       sources.push({'file': video_link[i],'label': quality[i]});
	}
    console.log(sources);
    document.querySelector('._insideBackground').id='player';
    document.querySelector('._insideBackground').innerHTML='';
    loadJwPlayer('player',{'sources': sources,'autostart': true});
    }

})();