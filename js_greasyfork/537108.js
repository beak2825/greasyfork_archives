// ==UserScript==
// @name         Rift of Siphoning Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Lets you know when rift of power will become active and plays a sound
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manarion.com
// @match        *://manarion.com/*
// @grant        none
// @author       Pin AKA Pinbo AKA Shock
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537108/Rift%20of%20Siphoning%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/537108/Rift%20of%20Siphoning%20Tracker.meta.js
// ==/UserScript==

const MIN_TIME_UNTIL_NEXT = 3 * 60 * 60 * 1000; // 3 hours
const MAX_TIME_UNTIL_NEXT = 6 * 60 * 60 * 1000; // 6 hours

const CLASSNAMES = {
    container: "siphoning-tracker__container",
    next_event_container: "siphoning-tracker__next-event-container",
};

const SELECTORS = {
    siphoning_tracker_container: `.${CLASSNAMES.container}`,
    siphoning_tracker_next_event_container: `.${CLASSNAMES.next_event_container}`,
};

const $ = window.jQuery;

const localStorageHelper = {
  key: "riftOfSiphoningState",

  init(){
    if(!localStorage.getItem(this.key))
      this.set({active: false, last_active: 0 });
  },

  get() {
    return JSON.parse(localStorage.getItem(this.key));
  },

  setProperty(key, value) {
    const current = this.get();
    current[key] = value;
    this.set(current);
  },

  set(data){
    localStorage.setItem(this.key, JSON.stringify(data));
  },
};

const riftTracker = {
  init(){
    localStorageHelper.init();
  },

  tick() {
      const {active, last_active } = localStorageHelper.get();

      if (this.isActive()){
          if (!active){
            playSound("https://cdn.freesound.org/previews/757/757143_10996917-lq.mp3");
          }
          localStorageHelper.set({ active: true, last_active: Date.now() });
      }
      else{
        if (active && Date.now() - last_active < 60 * 1000){
            localStorageHelper.set({ active: false, last_active: Date.now() });
        }
        localStorageHelper.setProperty("active", false);
      }

      updateTracker();
  },

  isActive() {
    return $("div.border-primary:contains('Siphoning Rift of Power')").length > 0;
  },

  getNext() {
    const {active, last_active } = localStorageHelper.get();

    if (last_active < Date.now() - MAX_TIME_UNTIL_NEXT) return null;

    const min = new Date(last_active + MIN_TIME_UNTIL_NEXT);
    const max = new Date(last_active + MAX_TIME_UNTIL_NEXT);
    return { min, max };
  },

  getLocalStorage(){
      return localStorageHelper.get();
  }
};

function playSound(sound){
    var audio = new Audio(sound);
    audio.volume = .5;
    audio.play();
}

function createSiphoningTracker() {
    const $mainContainer = $("div.grid.grid-cols-4");
    if ($mainContainer.length === 0) return;

    const mainContainerElement = $mainContainer[0];

    const siphoningTrackerContainer = Object.assign(document.createElement("div"), {
      className: `${CLASSNAMES.container} col-span-4 lg:col-span-2`,
    });

    const innerDiv = Object.assign(document.createElement("div"), {
      className: "border-primary shadow-primary w-full border p-2 text-center",
    });

    const heading = Object.assign(document.createElement("h2"), {
      className: "text-lg",
      textContent: "Siphoning Tracker",
    });

   const paragraph = Object.assign(document.createElement("p"), {
     className: `${CLASSNAMES.next_event_container} text-foreground text-sm`,
     innerHTML: "Initializing ..."
   });


    innerDiv.appendChild(heading);
    innerDiv.appendChild(paragraph);
    siphoningTrackerContainer.appendChild(innerDiv);
    mainContainerElement.prepend(siphoningTrackerContainer);
}

function updateTracker(){
    const { active, last_active } = riftTracker.getLocalStorage();
    const nextEvent = riftTracker.getNext();

    const $trackerContainer = $(SELECTORS.siphoning_tracker_next_event_container);
    if (!$trackerContainer || $trackerContainer.length === 0){
        console.error("[Siphoning Tracker] container not found while trying to update it!");
        return;
    }

    const trackerContainerElement = $trackerContainer[0];
    trackerContainerElement.innerHTML = active ? "Currently Active" : nextEvent ?
     `Next one between <strong>${nextEvent.min.toLocaleTimeString()}</strong> and <strong>${nextEvent.max.toLocaleTimeString()}</strong>`
     : "Unknown";

}

$(function () {
    let loaded = false;

    //Wait for load
    const waitForElement = setInterval(() => {
      const $main = $("div.grid.grid-cols-4:visible");
      if ($main.length) {
        loaded = true;
        clearInterval(waitForElement);
        riftTracker.init();
        if ($(SELECTORS.siphoning_tracker_container).length === 0) {
          createSiphoningTracker();
          updateTracker();
        }
      }
    }, 500);

    //Update tracker
    setInterval(() => {
      if (!loaded) return;
      riftTracker.tick();
    }, 500)
});
