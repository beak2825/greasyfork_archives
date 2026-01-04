// ==UserScript==
// @name        WaniKani SRS Indicator TEST
// @namespace   xrmicah
// @author      xrmicah
// @description Show current item's srs level
// @run-at      document-end
// @include     https://www.wanikani.com/review/session*
// @include     http://www.wanikani.com/review/session*
// @version     0.1.40
// @run-at      document-end
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/400686/WaniKani%20SRS%20Indicator%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/400686/WaniKani%20SRS%20Indicator%20TEST.meta.js
// ==/UserScript==
// constants
const SCRIPT_NAME = "Wanikani SRS Indicator";
const CURRENT_EVENT_ITEM_UPDATE_STRING = "currentItemUpdated";
// indicator ui styles
const SRS_INDICATOR_STYLES = "xr-styles";
const SRS_INDICATOR_CONTAINER_ID = "xr-srsindicator-container";
const SRS_INDICATOR_DIV_CONTAINER_ID = "xr-srsindicator-div__container";
const SRS_INDICATOR_DIV_ID = "xr-srsindicator-div";
const SRS_INDICATOR_TEXT_DIV_ID = 'xr-srsindicatortext-div';

// danger circles styles
const SRS_DANGER_CIRCLE_DIV_CLASS = "xr-srsdangercircle-div";
const SRS_DANGER_CIRCLE_ANIMATION_CLASS = 'xr-srsdangercircle__animation';
// toggle settngs styles
const SRS_TOGGLE_INPUT_ID = 'xr-srstoggle-input';
const SRS_TOGGLE_CONTAINER_ID = 'xr-srstogglecontainer-div';
const SRS_TOGGLE_DIV_ID = 'xr-srstoggle-div';

const LS_SETTINGS_KEY = 'xr-srs-indicator-settings';
const CASE_MAP = {
  4: {
    copy: "Guruing",
  },
  6: {
    copy: "Mastering",
  },
  7: {
    copy: "Enlightening",
  },
  8: {
    copy: "Burning",
  },
};

// styles
const scriptStyles = `
 #${SRS_INDICATOR_CONTAINER_ID} {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   margin-top: 16px;
   display: flex;
   justify-content: center;
 }
 #${SRS_INDICATOR_DIV_CONTAINER_ID} {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
 }
 #${SRS_INDICATOR_DIV_ID} {
  padding: 4px;
 }
 #${SRS_INDICATOR_TEXT_DIV_ID} {
   display: inline-block;
   color: red;
   user-select: none;
 }
 #${SRS_TOGGLE_CONTAINER_ID} {
   position:relative;
   border-top: solid;
   background-color: #e0e2e0;
   padding-top: 1px;
   padding-bottom: 1px;
 }
 .${SRS_DANGER_CIRCLE_DIV_CLASS} {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
  display: inline-block;
  margin: 4px;
 }
 .${SRS_DANGER_CIRCLE_ANIMATION_CLASS} {
  animation: pulse 1s infinite;
 }
 @keyframes pulse {
   0% {
     transform: scale(0.9);
     box-shadow: 0 0 0 0 rgba(235, 6, 20, 0.9);
   }
   70% {
     transform: scale(1);
     box-shadow: 0 0 0 10px rgba(235, 6, 20, 0);
   }
   100% {
     transform: scale(0.9)
   }
 }
 `;

const createCurrentItemUpdateEvent = (srsLevelNumber) =>
  new CustomEvent(CURRENT_EVENT_ITEM_UPDATE_STRING, {
    detail: {
      srsLevelNumber
    },
  });

const getSrsIndicatorConfiguration = () => {
  const lsSettings = localStorage.getItem(LS_SETTINGS_KEY);
  if (lsSettings) {
    return lsSettings;
  } else {
    return undefined;
  }
}

const createToggleCheckbox = () => {
  const toggleSettings = getSrsIndicatorConfiguration();
  // the default is the indicator is on so if there are no toggle settings then checbox OR if toggle settings are anything but off we also checkbox
  const initialCheckboxValue = toggleSettings && toggleSettings === 'false' ? false : true;
  const toggleContainer = document.createElement('div');
  toggleContainer.setAttribute('id', SRS_TOGGLE_CONTAINER_ID);
  const toggleDiv = document.createElement('div');
  toggleDiv.setAttribute('id', SRS_TOGGLE_DIV_ID);
  const toggleInput = document.createElement('input');
  toggleInput.setAttribute('id', SRS_TOGGLE_INPUT_ID)
  toggleInput.setAttribute('type', 'checkbox');
  if (initialCheckboxValue){
    toggleInput.setAttribute('checked', '');
  }
  toggleInput.addEventListener('change', (event) => {
    localStorage.setItem(LS_SETTINGS_KEY, event.srcElement.checked);
      const dangerCircles =  document.getElementsByClassName(SRS_DANGER_CIRCLE_DIV_CLASS);
      for(let dangerCircle of dangerCircles) {
        if (event.srcElement.checked) {
          // apply animation
          dangerCircle.setAttribute('class', `${SRS_DANGER_CIRCLE_DIV_CLASS} ${SRS_DANGER_CIRCLE_ANIMATION_CLASS}`)
        } else {
          dangerCircle.setAttribute('class', `${SRS_DANGER_CIRCLE_DIV_CLASS}`);
        }
      }
  });
  const toggleInputLabel = document.createElement('label');
  toggleInputLabel.setAttribute('for', SRS_TOGGLE_INPUT_ID);
  toggleInputLabel.textContent = 'Flashing';
  toggleDiv.appendChild(toggleInput);
  toggleDiv.appendChild(toggleInputLabel);
  toggleContainer.appendChild(toggleDiv);

  return toggleContainer;
};

const getOrCreateSRSIndicatorNode = (srsLevelNumber) => {
  let srsIndicatorContainer = document.getElementById(SRS_INDICATOR_CONTAINER_ID);
  if (srsIndicatorContainer) {
    return srsIndicatorContainer;
  }
  // create srs indicator components
  srsIndicatorContainer = document.createElement("div");
  const srsDangerCircleSpanOne = document.createElement('div');
  const srsDangerCircleSpanTwo = document.createElement('div');

  const srsIndicatorDivContainer = document.createElement('div');
  const srsIndicatorDiv = document.createElement("div");
  const srsIndicatorSpan = document.createElement('div');


  // set ids for style
  srsIndicatorDivContainer.setAttribute('id', SRS_INDICATOR_DIV_CONTAINER_ID);
  srsIndicatorContainer.setAttribute("id", SRS_INDICATOR_CONTAINER_ID);
  srsIndicatorDiv.setAttribute("id", SRS_INDICATOR_DIV_ID);
  srsIndicatorSpan.setAttribute('id', SRS_INDICATOR_TEXT_DIV_ID);
  let dangerCircleStyles = '';
  if (localStorage.getItem(LS_SETTINGS_KEY) !== 'false') {
    dangerCircleStyles = `${SRS_DANGER_CIRCLE_DIV_CLASS} ${SRS_DANGER_CIRCLE_ANIMATION_CLASS}`
  } else {
    dangerCircleStyles = `${SRS_DANGER_CIRCLE_DIV_CLASS}`;
  }
     // set classes on danger circles
  srsDangerCircleSpanOne.setAttribute('class', dangerCircleStyles);
  srsDangerCircleSpanTwo.setAttribute('class', dangerCircleStyles);

  // combine
  srsIndicatorDiv.appendChild(srsDangerCircleSpanOne);
  srsIndicatorDiv.appendChild(srsIndicatorSpan);
  srsIndicatorDiv.appendChild(srsDangerCircleSpanTwo);
  srsIndicatorDivContainer.appendChild(srsIndicatorDiv);

  srsIndicatorDiv.addEventListener('click', (event) => {
    if (!document.getElementById(SRS_TOGGLE_CONTAINER_ID)) {
      const toggle = createToggleCheckbox();
      srsIndicatorDivContainer.appendChild(toggle);
    } else {
      document.getElementById(SRS_TOGGLE_CONTAINER_ID).remove();
    }
  });
  srsIndicatorContainer.appendChild(srsIndicatorDivContainer);

  // return parent node
  return srsIndicatorContainer;
};

const addScriptStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = scriptStyles;
  style.setAttribute("id", SRS_INDICATOR_STYLES);
  document.head.appendChild(style);
};

const main = () => {
  const currentReviewItem = $.jStorage.get("currentItem");
  const targetParent = document.querySelector("#question");
  // set up listeners
  targetParent.addEventListener(CURRENT_EVENT_ITEM_UPDATE_STRING, (e) => {
    // remove node if it exists
    if (!CASE_MAP[e.detail.srsLevelNumber]) {
      const srsIndicatorDivNode = document.getElementById(SRS_INDICATOR_CONTAINER_ID);
      return srsIndicatorDivNode && srsIndicatorDivNode.remove();
    }
    const srsIndicatorDivNode = getOrCreateSRSIndicatorNode();
    srsIndicatorDivNode.children[0].children[0].children[1].textContent =
      CASE_MAP[e.detail.srsLevelNumber].copy;

    targetParent.appendChild(srsIndicatorDivNode);
  });
  $.jStorage.listenKeyChange("currentItem", () => {
    const srsLevelNumber = $.jStorage.get("currentItem").srs;
    targetParent.dispatchEvent(createCurrentItemUpdateEvent(srsLevelNumber));
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#xr-srsindicator-div') && document.getElementById(SRS_TOGGLE_CONTAINER_ID)) {
      document.getElementById(SRS_TOGGLE_CONTAINER_ID).remove();
    }
  });
  // add styles
  addScriptStyles();
  // kick off script for initial element
  targetParent.dispatchEvent(
    createCurrentItemUpdateEvent(currentReviewItem.srs)
  );
};

main();