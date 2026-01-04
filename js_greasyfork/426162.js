// ==UserScript==
// @name        MV Music Subforum Player
// @namespace   MVSoundSystem
// @version     1
// @description Much enjoy, so MV, very Music
// @author      Parserito
// @match       https://www.mediavida.com/foro/musica/*
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426162/MV%20Music%20Subforum%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/426162/MV%20Music%20Subforum%20Player.meta.js
// ==/UserScript==


(function() {
    const buttonText = 'Tócamelas';
    let ytIds = '';
    const ytRegex = "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
    const links = document.getElementsByTagName('a');
    for(let j = 0; j < links.length; j++){
        const id = links[j].href;
        const matches = id.match(ytRegex);
        if(matches && !ytIds.includes(id)) {
          ytIds = ytIds.length ? `${ytIds},${matches[1]}` : matches[1];
        }
    }


//iframe reproductor youtube

document.getElementById("post-container").innerHTML +=
    `<div data-s9e-mediaembed="youtube" class="embed r16-9 yt det">
        <div id='player-container' class="affixed" style="display: none; width: 648px;height: 365px;right: 20px !important;">
            <iframe width="648" height="365" src="https://www.youtube.com/embed/''?playlist=${ytIds}" frameborder="0" allowfullscreen ></iframe>
        </div>
    </div>`;

//botón para mostrar/ocultar la playlist

document.getElementsByClassName("brand-short")[0].innerHTML += `<div id='toggle-player'
    onMouseOver="this.style.backgroundColor='darkgray'"
    onMouseOut="this.style.backgroundColor='gray'"
    style="
        background-color: gray;
        width: 100px;
        text-align: center;
        border: 2px solid white;
        border-radius: 20px;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
    ">
        ${buttonText}
    </div>`;

//Al pulsar en el botón mostrar/ocultar la playlist

document.getElementById("toggle-player").addEventListener('click', () => {
    const playerContainer = document.getElementById("player-container");
    if (playerContainer.style.display === "none") {
        playerContainer.style.display = "block";
    } else {
        playerContainer.style.display = "none";
    }
});
})();