// ==UserScript==
// @name        YouTube Playlist Time
// @namespace   YouTube Playlist Time
// @description Adds a timestamp of all videos' time combined.
// @author      kriscross07
// @include     *.youtube.com/*
// @version     1.6
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/11712/YouTube%20Playlist%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/11712/YouTube%20Playlist%20Time.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded',function(){
  var time,mins=0,interval=true;

  addControls();
  interval&&setInterval(addControls,100);
  
  function addControls(){
    if(time&&document.contains(time)||!/^https:\/\/www.youtube.com\/playlist/.test(location.href))return;
    
    time=document.createElement('span');
    
    time.onclick=updateTime;
    time.title=time.innerHTML='Click to update time.';
    
    document.querySelector('.playlist-actions').appendChild(time);
    updateTime();
  }
  function updateTime(){
    var stamps=document.querySelectorAll('.timestamp>span');
    mins=0;
    for(var i=0;i<stamps.length;i++){
      var min=stamps[i].innerHTML.split(':');
      mins+=min[1]>=30?parseInt(min[0])+1:parseInt(min[0]);
    }
    time.innerHTML=mins>60?(mins/60).toFixed(1)+' hours.':mins+' minutes.';
  }
});