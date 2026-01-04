// ==UserScript==
// @name         Pony Party
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You left your computer unlocked!
// @author       Pony Party
// @include      *
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373120/Pony%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/373120/Pony%20Party.meta.js
// ==/UserScript==

const maxDelay = 7;
const maxPonies = 100;
const initialDelay = 10000; // 10 seconds

const today = new Date();
const dayOfTheWeek = today.getDay(); // Sunday = 0, Saturday = 6.

const delay = (maxDelay - dayOfTheWeek); // range of 7 to 1
const delayRemoveOffset = (maxDelay - delay) * 100;
const delayAddSeconds = delay * 1000 + 100;
const delayRemoveSeconds = delay * 1000 + 100 + delayRemoveOffset;

const w = window.innerWidth;
const h = window.innerHeight;

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
  {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const imgArray = [
    'https://derpicdn.net/img/view/2012/10/21/128825__safe_artist-colon-centchi_oc_oc-colon-glittering+cloud_oc+only_animated_female_mare_pegasus_pony_simple+background_solo_transparent+background_.gif',
    'https://vignette.wikia.nocookie.net/mlp/images/4/45/FANMADE_Pinkie_Pie_walking.gif/revision/latest?cb=20120215225900',
    'https://vignette.wikia.nocookie.net/mlp/images/0/0d/FANMADE_Rainbow_Dash_trotting.gif/revision/latest/scale-to-width-down/528?cb=20121109035516',

];

let addedImageIds = [];

function generatePonies() {
    if (addedImageIds.length <= maxPonies)
    {
        let img = document.createElement('img');
        let positionX = Math.floor(Math.random() * w);
        let positionY = Math.floor(Math.random() * h);
        let size = Math.floor(Math.random() * 264);
        let imgIndex = Math.floor(Math.random() * (imgArray.length - 1));
        let randId = makeid();
        img.src = imgArray[imgIndex];
        img.id = randId;
        img.setAttribute('height', size);
        img.setAttribute('width', size);
        img.style="position:absolute; left:"+positionX+"px; top:"+positionY+"px; z-index:1000;";
        document.body.appendChild(img);
        addedImageIds.push(randId);
    }
}
function deletePonies() {
    let imgIndex = Math.floor(Math.random() * (addedImageIds.length - 1));
    let elem = document.getElementById(addedImageIds[imgIndex]);
    document.body.removeChild(elem);
    addedImageIds.splice(imgIndex,1);
}
function addRemovePonies() {
    setInterval(generatePonies, delayAddSeconds);
    setInterval(deletePonies, delayRemoveSeconds);
}
setTimeout(addRemovePonies, initialDelay);