// ==UserScript==
// @name        Load Avatar
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description 8/20/2020, 2:49:30 PM
// @downloadURL https://update.greasyfork.org/scripts/410825/Load%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/410825/Load%20Avatar.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* eslint-disable no-undef */

const avatars = {
  bell: {
    hat: '13',
    nick: 'Bell',
    eyes: '18',
    body: '11',
    mouth: '21',
    thumbnail: 'url(https://i.imgur.com/XqsFi7L.png)'
  },
  calcifer: {
    hat: '7',
    nick: 'calcifer',
    eyes: '18',
    body: '10',
    mouth: '1',
    thumbnail: 'url(https://i.imgur.com/czTkRDX.png)'
  }
};

addButton(avatars.calcifer);

function addButton(avatarObject) {
  const button = document.querySelector("#avatarSelectorRandomize").cloneNode(true);
  button.style.top = '25px';
  button.style.borderRadius = '50%';
  button.style.backgroundImage = avatarObject.thumbnail;
  button.onclick = () => {
    setAvatar(avatarObject);
  };
  document.querySelector("#avatarSelector").append(button);
}

function setAvatar(avatar) {
	const settings = JSON.parse(localStorage.getItem('settings'));
	settings.hat = avatar.hat;
	settings.nick = avatar.nick;
	settings.eyes = avatar.eyes;
	settings.body = avatar.body;
	settings.mouth = avatar.mouth;
	localStorage.setItem('settings', JSON.stringify(settings));
	location.reload();
}
