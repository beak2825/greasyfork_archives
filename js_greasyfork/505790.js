// ==UserScript==
// @name     spankbang.com playlist videos link grabber
// @description This adds a button to spankbang playlists to grab links to all videos of this playlist
// @namespace https://sleazyfork.org/it/users/1091587
// @version  1.0.0
// @license MIT
// @grant    none
// @match    https://*.spankbang.com/*/playlist/*
// @downloadURL https://update.greasyfork.org/scripts/505790/spankbangcom%20playlist%20videos%20link%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/505790/spankbangcom%20playlist%20videos%20link%20grabber.meta.js
// ==/UserScript==

(function() {
  'use strict';

    var btnContainer = document.querySelector('.profile');

    var linkGrabberBtn = document.createElement('button');
    linkGrabberBtn.onclick = grabVideoList;
    linkGrabberBtn.classList.add('buttons', 'ft-button-bordered', 'ft-button-size-sm');
    linkGrabberBtn.innerText = 'Get all video links';

    btnContainer.appendChild(linkGrabberBtn);

    var footer = document.querySelector('footer');

    var linkGrabberBtnEnd = document.createElement('button');
    linkGrabberBtnEnd.onclick = grabVideoList;
    linkGrabberBtnEnd.classList.add('buttons', 'ft-button-bordered', 'ft-button-size-sm');
    linkGrabberBtnEnd.innerText = 'Get all video links';

    footer.before(linkGrabberBtnEnd);

function grabVideoList(){
    var linkList = [];
    var videoPlaylists = document.querySelectorAll(":not(.videos)> .video-list");
    for(var i = 0; i< videoPlaylists.length; i++){
        var links = videoPlaylists[i].querySelectorAll(".video-item > a");
        linkList.push(...links);
    }
    console.log(linkList.length);
    for(var j = 0; j< linkList.length; j++){
      console.log(linkList[j].href);
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

    //start X
    var buttonContainerEnd = document.createElement('div');
    buttonContainerEnd.className = 'userButtons';
    var closeBtnEnd = document.createElement('div');
    var innerCloseBtnEnd = document.createElement('button');
    closeBtnEnd.classList.add('close-button-end');
    closeBtnEnd.classList.add('mainButton');
    closeBtnEnd.classList.add('addFriendButton');
    closeBtnEnd.classList.add('add');
    innerCloseBtnEnd.innerText = 'X';
    innerCloseBtnEnd.className = 'buttonBase'
    closeBtnEnd.onclick = RemoveOuterModalPanel;
    closeBtnEnd.appendChild(innerCloseBtnEnd);
    buttonContainerEnd.appendChild(closeBtnEnd);
    innerModalDiv.appendChild(buttonContainerEnd);

    innerModalDiv.style.backgroundColor = '#1b1b1b';
    innerModalDiv.style.margin = 'auto';
    innerModalDiv.style.padding = '20px';
    innerModalDiv.style.border = '1px solid #888';
    innerModalDiv.style.width = '80%';
    innerModalDiv.style.color = '#ababab';
    innerModalDiv.style.overflowY = 'auto';
    innerModalDiv.style.height = '80%';

//founds!
    var length = document.createElement('p');
    length.innerHTML = linkList.length+" videos found!";
//Copy manager start
      var copyAllLinksBtn = document.createElement('button');
      copyAllLinksBtn.textContent = 'Copy All Links';
      copyAllLinksBtn.className = 'copy-all-links-btn';
      copyAllLinksBtn.classList.add('buttons', 'ft-button-bordered', 'ft-button-size-sm');

      innerModalDiv.appendChild(copyAllLinksBtn);

      copyAllLinksBtn.onclick = function() {
          let textToCopy = '';
          linkList.forEach(link => {
              textToCopy += link.href + '\n';
          });

          navigator.clipboard.writeText(textToCopy)
              .then(() => {
              copyAllLinksBtn.textContent = 'Copied!';
          })
              .catch(err => {
              copyAllLinksBtn.textContent = 'Error!';
          });

      };



    innerModalDiv.appendChild(length);
    for(var i = 0; i < linkList.length; i++){
      var a = document.createElement('a');
      a.innerHTML = linkList[i].href;
      a.href = linkList[i].href;
      innerModalDiv.appendChild(a);
      innerModalDiv.appendChild(document.createElement('br'));
    }

    //end x
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


    outerModalDiv.appendChild(innerModalDiv);
    document.body.appendChild(outerModalDiv);

      // Copy manager end
      var copyAllLinksBtnEnd = document.createElement('button');
      copyAllLinksBtnEnd.textContent = 'Copy All Links';
      copyAllLinksBtnEnd.className = 'copy-all-links-btn';
      copyAllLinksBtnEnd.classList.add('buttons', 'ft-button-bordered', 'ft-button-size-sm');

      innerModalDiv.appendChild(copyAllLinksBtnEnd);

      copyAllLinksBtnEnd.onclick = function() {
          let textToCopy = '';
          linkList.forEach(link => {
              textToCopy += link.href + '\n';
          });

          navigator.clipboard.writeText(textToCopy)
              .then(() => {
              copyAllLinksBtnEnd.textContent = 'Copied!';
          })
              .catch(err => {
              copyAllLinksBtnEnd.textContent = 'Error!';
          });

      };

  }

  function RemoveOuterModalPanel(){
    var toRemove = document.getElementById('playlistVidsLinkContainingModalPanel');
    toRemove.parentNode.removeChild(toRemove);
  }

})();