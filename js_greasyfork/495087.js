// ==UserScript==
// @name        Wizebot Song Request Filter
// @namespace   Violentmonkey Scripts
// @match       https://tools.wizebot.tv/song_request/*
// @grant       none
// @version     1.0
// @author      Alexandre D'hont - N3verlate
// @description 16/05/2024 00:38:08
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495087/Wizebot%20Song%20Request%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/495087/Wizebot%20Song%20Request%20Filter.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {

  let songListHtml = [];
  const header = document.getElementsByClassName('song_request_head')[0];

  function getSongList() {
     let songsElem = document.querySelectorAll('.mdtc-clnplrv-free-media');

      songsElem.forEach((elem, i) => {
        if(i % 2 !== 0){
          songListHtml.push(elem)
        }
      });
  }

  const actionsDiv = document.createElement('div');
  actionsDiv.style.float = 'right';
  actionsDiv.style.marginRight = '50px';
  actionsDiv.style.display = 'flex';
  actionsDiv.style.flexDirection = 'row-reverse';

  const input = document.createElement('input');
  input.style.float = 'right';
  input.style.marginRight = '10px';
  input.style.marginTop = '-12px';
  input.style.padding = '10px'
  input.placeholder = "Filtrer par pseudo";

  input.addEventListener('keyup', (event) => {
    songListHtml.forEach((elem, i) => {
      const pseudo = elem.textContent
      console.log(pseudo.toLowerCase())
      if(pseudo.toLowerCase().includes(event.target.value)){
        elem.parentElement.parentElement.style.display = 'block';
      } else {
        elem.parentElement.parentElement.style.display = 'none';
      }
    });
  });

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';

  refreshButton.addEventListener('click', (event) => {
    getSongList();
  })

  actionsDiv.appendChild(refreshButton);
  actionsDiv.appendChild(input);


  header.appendChild(actionsDiv);

  setTimeout(() => {
      getSongList();
  }, 5000)
});