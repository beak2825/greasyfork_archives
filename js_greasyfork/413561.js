// ==UserScript==
// @name        TwitchPiPButton
// @description Add a PiP button to twitch streams.
// @version     1.3
// @match       *://www.twitch.tv/*
// @copyright   2020+, Marcus Zhou
// @namespace   https://greasyfork.org/users/695707
// @downloadURL https://update.greasyfork.org/scripts/413561/TwitchPiPButton.user.js
// @updateURL https://update.greasyfork.org/scripts/413561/TwitchPiPButton.meta.js
// ==/UserScript==

function enterPictureInPicture() {
  document.querySelector("video")
    .requestPictureInPicture()
    .catch(error => {
      console.log(error);
    });
}

function injectPipBtn() {
  try {
    if (document.querySelector("button#_injectPipBtn") !== null) return;

    const actionContainer = document.querySelector(".player-controls__right-control-group");

    if (!actionContainer) {
      return; // Try again later.
    }

    const enterPipBtnDiv = document.createElement("div");
    enterPipBtnDiv.classList.add("sc-AxjAm");
    enterPipBtnDiv.classList.add("ScAttachedTooltipWrapper-v8mg6d-0");
    enterPipBtnDiv.classList.add("dLtTlU");
    enterPipBtnDiv.innerHTML = `
<button id="_injectPipBtn" class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"><span class="tw-button-icon__icon"><div style="width: 2rem; height: 2rem;"><div class="ScIconLayout-sc-1bgeryd-0 kbOjdP tw-icon"><div class="ScAspectRatio-sc-1sw3lwy-1 dNNaBC tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 gkBhyN"></div><svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path d="M 15.832031 5.832031 L 9.167969 5.832031 L 9.167969 10.832031 L 15.832031 10.832031 Z M 17.5 2.5 L 2.5 2.5 C 1.582031 2.5 0.832031 3.25 0.832031 4.167969 L 0.832031 15.832031 C 0.832031 16.75 1.582031 17.484375 2.5 17.484375 L 17.5 17.484375 C 18.417969 17.484375 19.167969 16.75 19.167969 15.832031 L 19.167969 4.167969 C 19.167969 3.25 18.417969 2.5 17.5 2.5 Z M 17.5 15.839844 L 2.5 15.839844 L 2.5 4.148438 L 17.5 4.148438 Z M 17.5 15.839844 "/></g></svg></div></div></div></span></button>
<div class="ScAttachedTooltip-v8mg6d-1 jouePo tw-tooltip" data-a-target="tw-tooltip-label" role="tooltip" direction="tw-tooltip--up">Picture-in-Picture</div>
`;

    const insertOffset = actionContainer.childNodes.length - 1;
    actionContainer.insertBefore(enterPipBtnDiv, actionContainer.childNodes[insertOffset]);
    
    document.querySelector("#_injectPipBtn").addEventListener("click", enterPictureInPicture);

    console.log("[TwitchPiPButton] Injected PiP Button.");
  } catch (err) {
    console.error("[TwitchPiPButton] " + err);
  }
}

setInterval(injectPipBtn, 1000);
