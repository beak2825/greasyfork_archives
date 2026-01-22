// ==UserScript==
// @name         Audio Output Picker
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Pick a preferred audio output device for HTML5 audio and video elements.
// @author       hacker09
// @include      *
// @icon         https://i.imgur.com/RHFAjq3.png
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/539828/Audio%20Output%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/539828/Audio%20Output%20Picker.meta.js
// ==/UserScript==

(async()=>{
  'use strict';
  const findMediaElement = async ()=>{ //Finds the active media element, whether it's a <video> or an <audio> tag.
    while (true) {
      let mediaElement = document.querySelector('video, audio, .video-stream'); //Look for the standard video player OR any audio element first.
      if (mediaElement) {return mediaElement;}
      await new Promise(resolve => setTimeout(resolve, 150)); //If nothing is found, wait and retry.
    }
  };

  const getDevicesWithPermission = async () => { //Get permissions and devices.
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "audiooutput");
  };

  const mediaElement = await findMediaElement(); //Find the active <video> or <audio> element.
  const setDevice = (id) => mediaElement.setSinkId(id);

  const applySavedDevice = async () => {
    const savedLabel = GM_getValue(location.href) || GM_getValue(location.hostname); //Retrieve saved Name/Label instead of ID.
    if (savedLabel) { //Only act if a saved setting exists.
      const devices = await getDevicesWithPermission();
      const target = devices.find(d => d.label === savedLabel); //Find the current ID for the saved Name.
      if(target){ setDevice(target.deviceId); }
    }
  };

  const selectAudioDevice = async (scope) => {
    const devices = await getDevicesWithPermission(); //Ask for mic permission.
    if (!devices || devices.length === 0) return; //Exit if mic permission denied or no devices.

    const choice = parseInt(prompt(devices.map((d,i) => `${i+1}: ${d.label||`Device ${i+1}`}`).join('\n')), 10)-1;
    if(devices[choice]) {
      const key = scope === 'URL' ? location.href : location.hostname;
      GM_setValue(key, devices[choice].label); //Save the label (Name) to persist across ID changes.
      setDevice(devices[choice].deviceId);
      location.reload(); //Reload to apply the setting and update the menu text from "Save" to "DELETE".
    }
  };

  ['URL', 'DOMAIN'].forEach(scope => {
    const key = scope === 'URL' ? location.href : location.hostname;
    if (GM_getValue(key)) {
      GM_registerMenuCommand(`DELETE ${scope}`, () => {
        GM_deleteValue(key);
        location.reload();
      });
    } else {
      GM_registerMenuCommand(`Save ${scope}`, () => selectAudioDevice(scope));
    }
  });

  mediaElement.addEventListener('loadedmetadata', applySavedDevice);
  applySavedDevice(); //Attempt to apply immediately in case metadata is already loaded.
})();