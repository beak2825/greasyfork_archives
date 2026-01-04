// ==UserScript==
// @name        Tuleador de Copyright
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.6
// @author      elmarceloc
// @description 19/1/2021 0:48:56
// @downloadURL https://update.greasyfork.org/scripts/420381/Tuleador%20de%20Copyright.user.js
// @updateURL https://update.greasyfork.org/scripts/420381/Tuleador%20de%20Copyright.meta.js
// ==/UserScript==

function isYoutube(getURL){
	if(typeof getURL!=='string') return false;
	var newA = document.createElement('A');
	newA.href = getURL;
	var host = newA.hostname;
	var srch = newA.search;
	var path = newA.pathname;
	
	if(host.search(/youtube\.com|youtu\.be/)===-1) return false;
	if(host.search(/youtu\.be/)!==-1) return path.slice(1);
	if(path.search(/embed/)!==-1) return /embed\/([A-z0-9]+)(\&|$)/.exec(path)[1];
	var getId = /v=([A-z0-9]+)(\&|$)/.exec(srch);
	if(host.search(/youtube\.com/)!==-1) return !getId ? '':getId[1];
	
}

var stopVideos = function () {
	var videos = document.querySelectorAll('iframe, video');
	Array.prototype.forEach.call(videos, function (video) {
		if (video.tagName.toLowerCase() === 'video') {
			video.pause();
		} else {
			var src = video.src;
			video.src = src;
		}
	});
};

url = ''
setInterval(function(){ 
if(isYoutube(url) &&  window.location.href != url){
  console.log('youtube')
  setTimeout(function () {
    if(document.body.contains(document.getElementsByClassName('more-button')[0])) document.getElementsByClassName('more-button')[0].click()
    

    setTimeout(function () {
        if(typeof document.querySelectorAll('.ytd-metadata-row-header-renderer')[0] != 'undefined'){
          //alert('COPYRIGHT!!')
          stopVideos()

          setTimeout(function () {
              var element = document.getElementById("notify");
              element.parentNode.removeChild(element);
            },3000) 


         var div = document.createElement('div');
          div.innerHTML = `
              <div style="    
      background-color: #ffe303;
      background-image: url('https://i.imgur.com/d3XZvav.png');
      background-size:cover;
      height: 30px;
      width: 190px;
      z-index: 1000;
      position: fixed;
      color: white;
      padding-top: 60px;
      font-size: 20px;
      text-align: center;
      border-radius:5px;
      font-family: cursive;
      text-shadow: 2px 2px 2px black;
      font-weight: bold;" id="notify">
              Tiene COPYRIGHT!!
              </div>
          `;

          document.body.appendChild(div)


        }
    },200) 
    
    
  },1000) 

}
  url = window.location.href

   }, 500);