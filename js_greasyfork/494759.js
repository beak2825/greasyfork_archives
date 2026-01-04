// ==UserScript==
// @name     Bandcamp Volume Control
// @description Change the volume for all audio on discover pages
// @version  1.1
// @include  https://bandcamp.com/discover*
// @run-at   document-start
// @license MIT
// @namespace https://greasyfork.org/users/1300587
// @downloadURL https://update.greasyfork.org/scripts/494759/Bandcamp%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/494759/Bandcamp%20Volume%20Control.meta.js
// ==/UserScript==

unsafeWindow.volume = localStorage.getItem('volume') ?? 1.0;

window.addEventListener('beforescriptexecute', async e => {
  const src = e.target.src;

  // Cancel loading the original Vue script
  if (!src.includes('DiscoverApp.vue')) return;
  e.preventDefault();
  e.stopPropagation();

  // Inject the desired volume directly into the js text
  let script = await fetch(src).then(res => res.text());
  script = script.replace(
    /(\w+) *= *new Audio[^;]*;/,
    `$& $1.volume = window.volume; window.audio = $1;`);

  // Add the modified script back to the page
  const elem = document.createElement('script');
  elem.type = 'module';
  elem.textContent = script;
  document.head.appendChild(elem);
});

const addVolumeBar = () => {
   // Clone the existing audio bar into a volume bar
  const seeker = document.querySelector('.player-bottom');
  if (!seeker) return;
  const vol = seeker.cloneNode(true);

  vol.querySelectorAll('.playback-time').forEach(s => s.style.visibility = 'hidden');
  vol.querySelector('input').value = unsafeWindow.volume;
	seeker.parentElement.appendChild(vol);

  // On volume change update the current audio object
  vol.addEventListener('input', e => {
    unsafeWindow.volume = vol.querySelector('input').value;
    localStorage.setItem('volume', unsafeWindow.volume);
    unsafeWindow.audio.volume = unsafeWindow.volume;
  });

  document.removeEventListener('click', addVolumeBar);
};

document.addEventListener('click', addVolumeBar);
