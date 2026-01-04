// ==UserScript==
// @name     pornhub.com playlist videos link grabber
// @description This adds a button to pornhub playlists to grab links to all videos of this playlist
// @namespace https://sleazyfork.org/users/179893
// @version  1.0.0
// @license MIT
// @grant    none
// @match    https://*.pornhub.com/playlist/*
// @match    https://*.pornhubpremium.com/playlist/*
// @downloadURL https://update.greasyfork.org/scripts/427906/pornhubcom%20playlist%20videos%20link%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/427906/pornhubcom%20playlist%20videos%20link%20grabber.meta.js
// ==/UserScript==

(function() {
  'use strict';


var btnContainer = document.querySelector('#userPlaylistActions #js-playlistTabsNav');

var linkGrabberBtn = document.createElement('button');
linkGrabberBtn.onclick = grabVideoList;
linkGrabberBtn.classList.add('playlistButtons'); //playlistButtons tooltipTrig js-pop
var span = document.createElement('span');
span.innerText = 'Get all video links';
span.className = 'text';
linkGrabberBtn.appendChild(span);
btnContainer.appendChild(linkGrabberBtn);


function grabVideoList(){
    var videoPlaylist = document.getElementById("videoPlaylist");
    var linkList = videoPlaylist.querySelectorAll("span > a");
    for(var i = 0; i< linkList.length; i++){
      console.log(linkList[i].href);
    }
    showLinks(linkList);
  }
  
  function showLinks(linkList){
    var outerModalDiv = document.createElement('div');
    var innerModalDiv = document.createElement('div');
    outerModalDiv.id = 'playlistVidsLinkContainingModalPanel'; //use a long id to avoid name conflicts
    outerModalDiv.style.display = 'block';
    outerModalDiv.style.position = 'fixed';
    outerModalDiv.style.zIndex = '100';
    outerModalDiv.style.paddingTop = '100px';
    outerModalDiv.style.left = '0';
    outerModalDiv.style.top = '0';
    outerModalDiv.style.width = '100%';
    outerModalDiv.style.height = '100%';
    outerModalDiv.style.backgroundColor = 'rgb(0,0,0)';
    outerModalDiv.style.backgroundColor = 'rgb(0,0,0,0.4)';

    //add close btn
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'userButtons';
    var closeBtn = document.createElement('div');
    var innerCloseBtn = document.createElement('button');
    closeBtn.style.cssFloat = 'right';
    closeBtn.classList.add('mainButton');
    closeBtn.classList.add('addFriendButton');
    closeBtn.classList.add('add');

    innerCloseBtn.innerText = 'X';
    innerCloseBtn.className = 'buttonBase';
     
    closeBtn.onclick = RemoveOuterModalPanel;
    closeBtn.appendChild(innerCloseBtn);
    buttonContainer.appendChild(closeBtn);
    innerModalDiv.appendChild(buttonContainer);
  
    innerModalDiv.style.backgroundColor = '#1b1b1b';
    innerModalDiv.style.margin = 'auto';
    innerModalDiv.style.padding = '20px';
    innerModalDiv.style.border = '1px solid #888';
    innerModalDiv.style.width = '80%';
    innerModalDiv.style.color = '#ababab';
    innerModalDiv.style.overflowY = 'auto';
    innerModalDiv.style.height = '80%';
  
    var instructions1 = document.createElement('p');
    var instructions2 = document.createElement('p');
    var instructions3 = document.createElement('p');
    instructions1.innerHTML = 'Save the links to a local textfile (e.g. &quotC:\\Temp\\dl\\linklist.txt)&quot and run youtube-dl whith the -a argument and the path to the linklist.';
    instructions2.innerHTML = 'youtube-dl -a &quotC:\\Temp\\dl\\linklist.txt&quot';
    instructions3.innerHTML = 'Or just use jDownloader with the linklist';
    innerModalDiv.appendChild(instructions1);
    innerModalDiv.appendChild(instructions2);
    innerModalDiv.appendChild(instructions3);
  
    for(var i = 0; i < linkList.length; i++){
      var a = document.createElement('a');
      a.innerHTML = linkList[i].href;
      a.href = linkList[i].href;
      innerModalDiv.appendChild(a);
      innerModalDiv.appendChild(document.createElement('br'));
    }
    outerModalDiv.appendChild(innerModalDiv);
    document.body.appendChild(outerModalDiv);
  }

  function RemoveOuterModalPanel(){
    var toRemove = document.getElementById('playlistVidsLinkContainingModalPanel');
    toRemove.parentNode.removeChild(toRemove);
  }

})();