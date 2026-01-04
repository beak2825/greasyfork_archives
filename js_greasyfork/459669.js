// ==UserScript==
// @name         Youtube - Floating Related Videos Pane
// @namespace    https://greasyfork.org/users/222319
// @version      1.0.1
// @description  Scroll related videos while still watching videos.
// @author       Nomicwave
// @license      MIT License <https://opensource.org/licenses/MIT>
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459669/Youtube%20-%20Floating%20Related%20Videos%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/459669/Youtube%20-%20Floating%20Related%20Videos%20Pane.meta.js
// ==/UserScript==

const dom = {
    playerContainer: null,
    playerControls: null,
    theaterContainer: null,
    toggle: null
}

const floatState = {
    disabled: 'disabled',
    normal: 'normal',
    always: 'always',
}

const floatClass = {
    enabled: 'frvp-enabled',
    theater: 'frvp-theater-mode',
}

function loadFloatStyle() {
    const cssText = `
    .frvp-enabled #secondary {
        position: sticky !important;
        top: 56px;
        height: calc(100vh - 56px);
    }

    .frvp-enabled ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer {
        box-shadow: inset 0 10px 15px -10px rgb(0 0 0 / 40%);
        overflow: hidden;
        overflow-y: overlay;
        overscroll-behavior-y: contain;
        height: calc(100vh - 56px - var(--ytd-margin-6x) - 51px);
        margin: 0 calc(var(--ytd-margin-6x) * -1) 0 calc(var(--ytd-margin-6x) * -1);
        padding: 0 var(--ytd-margin-6x) 0 var(--ytd-margin-6x);
    }

    .frvp-enabled.frvp-theater-mode ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer {
        height: calc(100vh - 56px - 51px);
    }

    .frvp-enabled ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer::-webkit-scrollbar {
        width: 10px;
    }

    .frvp-enabled ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer::-webkit-scrollbar-thumb {
        background: var(--yt-spec-badge-chip-background);
        background-repeat: no-repeat;
        border-radius: 10px;
    }

    .frvp-enabled ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer::-webkit-scrollbar-track {
        background: transparent;
    }`

    let style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = cssText;
    } else {
        style.appendChild(document.createTextNode(cssText));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
};

function createToggleButton() {
    let div = document.createElement('div');
    div.innerHTML = (`
    <div id="float-state-toggle" class="style-scope ytd-menu-renderer" button-renderer="" style="margin-left: 8px;">
		<div>
			<button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading " aria-label="Share" style="">
				<div class="yt-spec-button-shape-next__icon" aria-hidden="true" style="margin-left: 0; margin-right: 0;">
					<div style="width: 24px; height: 24px;">
						<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
							<g mirror-in-rtl="" class="style-scope yt-icon">
								<path
									d="M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z"
									class="style-scope yt-icon"></path>
								<path
									d="M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z"
									class="style-scope yt-icon"></path>
							</g>
						</svg>
						<!--css-build:shady-->
					</div>
				</div>
			</button>
		</div>
		<tp-yt-paper-tooltip fit-to-visible-bounds="" offset="8" role="tooltip" tabindex="-1" style="inset: 83.5px auto auto 594.664px;">
			<!--css-build:shady-->
			<div id="tooltip" class="style-scope tp-yt-paper-tooltip frvp-toggle-tooltip" style="text-transform:capitalize;">Toggle floating pane (disable, normal, always)</div>
		</tp-yt-paper-tooltip>
	</div>`).trim();
    return div.firstChild;
}

function waitForElement(selector, exist = true) {
    return new Promise(resolve => {
        if (!!document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (!!document.querySelector(selector) === exist) {
                if (exist) resolve(document.querySelector(selector));
                else resolve(exist);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getFloatState() {
    return localStorage.getItem('floating-pane') ?? floatState.normal;
}

function setFloatState(state) {
    localStorage.setItem('floating-pane', state);
    floatStateChanged(state);
    dom.toggle.getElementsByClassName('frvp-toggle-tooltip')[0].innerText = state;
}

function floatStateChanged(state) {
    if (state === floatState.disabled) {
        observer.disconnect();
        document.body.classList.remove(floatClass.enabled, floatClass.theater);
    } else {
        if (state === floatState.normal && !(dom.theaterContainer.childNodes.length) ||
            state === floatState.always) {
            document.body.classList.add(floatClass.enabled);
            if (dom.theaterContainer.childNodes.length)
                document.body.classList.add(floatClass.theater);
        }
        observer.observe(dom.theaterContainer, { childList: true });
    }
}

const observer = new MutationObserver(async function (e) {
    await delay(1); // delays immediate changes
    // to allow the player state to change first
    let state = getFloatState();
    if (state === floatState.normal) {
        if (e[0].addedNodes.length) document.body.classList.remove(floatClass.enabled);
        else document.body.classList.add(floatClass.enabled);
    } else if (state === floatState.always) {
        if (e[0].addedNodes.length) document.body.classList.add(floatClass.theater);
        else document.body.classList.remove(floatClass.theater);
    }
});

async function instateToggleButton() {

    console.log('Ok');
    let clearSignal = await waitForElement('#float-state-toggle', false);
    dom.playerControls = await waitForElement('ytd-app > #content > #page-manager > ytd-watch-flexy > #columns #primary > #primary-inner > #below > ytd-watch-metadata > #above-the-fold > #top-row > #actions > #actions-inner > #menu > ytd-menu-renderer > #top-level-buttons-computed');

    dom.toggle = createToggleButton();
    dom.toggle.addEventListener('click', function (e) {
        let states = Object.values(floatState);
        let currentState = getFloatState();
        let currentStateIndex = states.indexOf(currentState)
        let nextStateIndex = (currentStateIndex + 1) % (states.length);
        let nextState = states[nextStateIndex];
        setFloatState(nextState);
    });

    let state = getFloatState();
    floatStateChanged(state);

    dom.toggle.getElementsByClassName('frvp-toggle-tooltip')[0].innerText = state;
    dom.playerControls.appendChild(dom.toggle)

    observeUrlChange();
}

const observeUrlChange = () => {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                instateToggleButton();
                observer.disconnect();
            }
        });
    });
    observer.observe(body, { childList: true, subtree: true });
};

(async function() {

    dom.playerContainer = await waitForElement('#player-container-inner');
    dom.theaterContainer = await waitForElement('#player-theater-container');

    loadFloatStyle();
    instateToggleButton();
})();
