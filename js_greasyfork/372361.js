// ==UserScript==
// @name         My Gaia Friends Full Avatar
// @namespace   gaiaupgrade
// @match       https://www.gaiaonline.com/mygaia/
// @version     1.0.2
// @grant       none
// @description View a friends full avatar on the My Gaia page
// @downloadURL https://update.greasyfork.org/scripts/372361/My%20Gaia%20Friends%20Full%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/372361/My%20Gaia%20Friends%20Full%20Avatar.meta.js
// ==/UserScript==
!function() {

let avatarBox = document.querySelectorAll('.dropBox');

for(let box of avatarBox) {
	box.addEventListener('mouseenter', mouseenter);
  box.addEventListener('mouseleave', mouseleave);
}

function mouseenter(evt) {
  let avatar = this.querySelector('.avatarImage');
  let fullAviBox = this.appendChild(document.createElement('div'));
  fullAviBox.className = 'fullavi';
  fullAviBox.style = 'position:absolute;bottom:0;left:0;background:#efffdf;border:1px solid #90c085';
  let username = fullAviBox.appendChild(document.createElement('span'));
  username.className = 'user_name';
  username.appendChild(document.createTextNode(avatar.offsetParent.querySelector('.user_name').textContent));
  let fullAvi = fullAviBox.appendChild(document.createElement('img'));
  fullAvi.src = avatar.src.replace('48x48.gif', 'flip.png');
}

function mouseleave(evt) {
  this.querySelector('.fullavi').remove();
}}()