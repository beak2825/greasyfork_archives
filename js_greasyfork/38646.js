// ==UserScript==
// @name         mTurk HIT Fullscreen Crosshair CSS (as Userscript)
// @namespace    salembeats
// @version      1.7
// @description  Userscript adapatation (and improvement) of code found at https://codepen.io/michaelsboost/pen/fnizu - applied to mTurk.
// @author       Cuyler Stuwe (salembeats) using code adapted from Michael Schwartz
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38646/mTurk%20HIT%20Fullscreen%20Crosshair%20CSS%20%28as%20Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38646/mTurk%20HIT%20Fullscreen%20Crosshair%20CSS%20%28as%20Userscript%29.meta.js
// ==/UserScript==

// *****************************************************************************

function isNotMturkFrame() {
	return !(
		window !== window.top &&
		document.referrer.includes("worker.mturk.com/projects/")
	);
}

if(isNotMturkFrame()) {return;}

// *****************************************************************************

// Just here for faster autocomplete suggestions.

const CROSSHAIR_STYLES = {
	DOTTED: "dotted",
	DASHED: "dashed",
	SOLID: "solid"
};

const CROSSHAIR_COLORS = {
	BLACK: "black",
	RED: "red",
	GREEN: "green",
	BLUE: "blue"
};

// *****************************************************************************
// SET UP YOUR CROSSHAIR STYLE HERE.
// *****************************************************************************

const CROSSHAIR_THICKNESS_PX                    = 1;
const CROSSHAIR_STYLE                           = CROSSHAIR_STYLES.DOTTED;
const CROSSHAIR_COLOR                           = CROSSHAIR_COLORS.RED;
const SHOULD_MODIFY_POINTER_TO_CROSSHAIR_CURSOR = true;

// *****************************************************************************

document.body.insertAdjacentHTML("beforeend", `
<div id="crosshair-h" class="hair"></div>
<div id="crosshair-v" class="hair"></div>
`);

document.head.insertAdjacentHTML("beforeend", `
<style>

* {

    ${SHOULD_MODIFY_POINTER_TO_CROSSHAIR_CURSOR ? "cursor: crosshair !important;" : ""}

}

#crosshair-h {

    width: 100%;

}

#crosshair-v {

    height: 100%;

}

.hair {

    position: fixed;
    top:0; left:0;

    margin-top: 0px; /* The offset here by the original author made zero sense. */
    margin-left: 0px; /* The offset here by the original author made zero sense. */

    background: transparent;

    border-top: ${CROSSHAIR_THICKNESS_PX}px ${CROSSHAIR_STYLE} ${CROSSHAIR_COLOR};
    border-left: ${CROSSHAIR_THICKNESS_PX}px ${CROSSHAIR_STYLE} ${CROSSHAIR_COLOR};

    pointer-events: none;

    z-index: ${Number.MAX_SAFE_INTEGER};

}
</style>
`);

let cH = document.getElementById('crosshair-h'),
	cV = document.getElementById('crosshair-v');

document.addEventListener("mousemove", e => {
	cH.style.top  = e.clientY + "px";
	cV.style.left = e.clientX + "px";
});