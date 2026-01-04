// ==UserScript==
// @name         Tumblr get video source
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Gets the video source url for the first video on a tumblr post.
// @author       You
// @match        https://*.tumblr.com/post/*
// @match        https://www.tumblr.com/video/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/38039/Tumblr%20get%20video%20source.user.js
// @updateURL https://update.greasyfork.org/scripts/38039/Tumblr%20get%20video%20source.meta.js
// ==/UserScript==

if(window.top !== window.self) {
  const videoSourceElem = document.querySelector('video source');
  if(!videoSourceElem){
    return;
  }
  window.top.postMessage({
    iframeVideoUrl: window.location.href,
    iframeVideoSrc: videoSourceElem.src
  }, "*")
  return
}


const parentPostID = window.location.href.split('/')[4]
let iframeVideoSrc = ''

window.addEventListener('message', function(event) {
  if(!event.data.iframeVideoUrl || !event.data.iframeVideoSrc) {
    return
  }
  const iframeVideoID = event.data.iframeVideoUrl.split('/')[5]

 if(parentPostID === iframeVideoID){
    iframeVideoSrc = event.data.iframeVideoSrc
    if(iframeVideoSrc.endsWith('/480')){
      iframeVideoSrc = iframeVideoSrc.slice(0, -3)
    }
    console.log(iframeVideoSrc)
  }
}, false)

function getVideoUrl(){
  // GM_setClipboard(iframeVideoSrc)
  
  var textarea = document.createElement('textarea')

  textarea.setAttribute('id', 'linksTextarea')
  textarea.setAttribute('style', `
    position: absolute;
    top: 60px;
    left:40px;
    width:1000px;
    height:500px;
    background-color:white;
    z-index:100000;
    padding:10px;
  `)
  textarea.value = iframeVideoSrc
  document.body.appendChild(textarea)
  window.scrollTo(0,0)
}

GM_registerMenuCommand('Get Video Url', getVideoUrl)

