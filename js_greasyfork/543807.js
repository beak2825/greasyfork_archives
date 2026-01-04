// ==UserScript==
// @name         DSS: Faction Family Buttons - Stable
// @namespace    Dsuttz Scripts
// @version      0.7
// @description  Adds a title and faction family buttons
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543807/DSS%3A%20Faction%20Family%20Buttons%20-%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/543807/DSS%3A%20Faction%20Family%20Buttons%20-%20Stable.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
  
  // ===== CONFIGURATION =====
 
  //Replace with your Faction ID
 
  const YOUR_FACTION_ID = 29107;
 
  // To enable this functionality when you are: Travelling, or, when on the faction page of one of your family factions.
 
  //i.e. true/false
 
  const ENABLE_BUTTON_URL_MATCHING = true;
 
  // If you are using abbreviations for a faction name i.e. 3 or 4 character length, the recommended maximum number of buttons per row = 10
  // If you are using full faction names, the recommneded maximum number of buttons per row = 4 (There is some dynamic font sizing based on faction name length, but if you have a majorly long faction name
  // consider decreasing the number of buttons per row)
 
  //When used on mobile, in Torn PDA, or if for some crazy reason you like really thin browser windows on your desktop, the entered value is overwritten to 2 buttons per row.
 
  const BUTTONS_PER_ROW_DESKTOP = 4;
 
  // You can enter as many buttons as you want in here, it will automatically calculate the number of rows based on how many buttons you want in a row.
  // You can just copy and past the example line as many times as you like
 
  // Example where it will look stupid, if you have only two buttons configured, but you set 10 buttons per row, its gonna look rubbish. Ideally you don't want the total number of buttons to be less than
  // the number of buttons per row. I'm not coding it to handle this, be smart about it.
 
  // Format ['BUTTON NAME (FACTION or ABBREVIATON)',https://www.torn.com/factions.php?step=profile&ID=THE_FACTION_ID,'TOOL_TIP_TEXT'],
 
  const BUTTONS = [
	['Capacity X', 'https://www.torn.com/factions.php?step=profile&ID=16247', 'Capacity X'],
	['Fallen X', 'https://www.torn.com/factions.php?step=profile&ID=29107', 'Fallen X'],
	['Phoenix X', 'https://www.torn.com/factions.php?step=profile&ID=41291', 'Phoenix X'],
	['Med X', 'https://www.torn.com/factions.php?step=profile&ID=9528', 'Med X'],
  ];
 
 
 // ===== **DO NOT CHANGE BELOW THIS POINT!** =====
 
  // Singleton pattern - prevent multiple script instances
  const SCRIPT_ID = 'TORN_FACTION_FAMILY_BUTTONS_SINGLETON';
  
  if (window[SCRIPT_ID]) {
	console.log('[Injector] Script already running, aborting duplicate instance');
	return;
  }
  
  window[SCRIPT_ID] = true;
  console.log('[Injector] Script instance claimed, proceeding with initialization');
 
  
  // ===== **DO NOT CHANGE BELOW THIS POINT=====
 
  const BREAKPOINT = 784;
  const SMALL_CONTAINER = 372;
  const LARGE_CONTAINER = 764;
  const GAP = 10;
 
  // Simplified state tracking
  let isInjecting = false;
  let lastState = null;
  let hasInitialized = false;
  let pendingTimeout = null;
  let mutationObserver = null;
 
  const svgMarkup = `
	<svg xmlns="http://www.w3.org/2000/svg"
		 width="24" height="26.2"
		 viewBox="0 0 36.667 40"
		 fill="white"
		 style="display:block; vertical-align:middle;">
	  <path d="M123.415,180.642a35.171,35.171,0,0,1-11.082,18.94,35.168,35.168,0,0,1-11.081-18.94,32.632,32.632,0,0,0,11.081-4.2A32.593,32.593,0,0,0,123.415,180.642Zm7.252-5.975c0,14.3-8.447,26.828-18.334,33.333C102.447,201.495,94,188.972,94,174.667c5.857,0,13.342-1.675,18.333-6.667C117.325,172.992,124.81,174.667,130.667,174.667Zm-3.48,3.156a29.755,29.755,0,0,1-14.854-5.416,29.755,29.755,0,0,1-14.853,5.416c1.1,11.754,8.152,20.989,14.853,26.092C119.035,198.812,126.90,189.577,127.187,177.823Z" transform="translate(-94 -168)"/>
	</svg>
  `;
 
  function getUrlState() {
	const u = new URL(location.href);
	return {
	  step: u.searchParams.get('step'),
	  type: u.searchParams.get('type'),
	  hash: u.hash
	};
  }
 
  function shouldShowButtons() {
	const state = getUrlState();
	const isYourPage = state.step === 'your' && state.type === '1';
	const isBaseTab = isYourPage && (state.hash === '' || state.hash === '#/' || state.hash === '#');
	const isInfoTab = isYourPage && state.hash.startsWith('#/tab=info');
	const isButtonURL = ENABLE_BUTTON_URL_MATCHING && 
	  BUTTONS.some(([, link]) => location.search.includes(link.split('?')[1]));
	
	return isBaseTab || isInfoTab || isButtonURL;
  }
 
  function getStateSignature() {
	const state = getUrlState();
	return JSON.stringify({
	  step: state.step,
	  type: state.type,
	  hash: state.hash,
	  mobile: window.innerWidth <= BREAKPOINT,
	  shouldShow: shouldShowButtons()
	});
  }
 
  function waitForElement(selector, timeout = 5000) {
	return new Promise((resolve, reject) => {
	  const element = document.querySelector(selector);
	  if (element) {
		resolve(element);
		return;
	  }
	  
	  const observer = new MutationObserver(() => {
		const element = document.querySelector(selector);
		if (element) {
		  observer.disconnect();
		  resolve(element);
		}
	  });
	  
	  observer.observe(document.body, { childList: true, subtree: true });
	  
	  setTimeout(() => {
		observer.disconnect();
		reject(`Element not found: ${selector}`);
	  }, timeout);
	});
  }
 
  function getMountSelector(state, mobile) {
	if (mobile) {
	  if (state.step === 'your') {
		return state.hash && state.hash.includes('tab=info') 
		  ? 'div.title-black:nth-of-type(4), hr.m-top10'
		  : 'hr.m-top10:nth-of-type(4), hr.m-top10';
	  } else if (state.step === 'profile') {
		return 'div.title-black:nth-of-type(7), hr.m-top10';
	  }
	} else {
	  if (state.step === 'your') {
		return state.hash.startsWith('#/tab=info')
		  ? 'div.title-black:nth-child(4)'
		  : 'hr.m-top10:nth-child(4)';
	  } else if (state.step === 'profile') {
		return 'div.title-black:nth-child(7)';
	  }
	}
	return 'div.title-black, hr.m-top10';
  }
 
  async function performInjection() {
	if (isInjecting) return;
	isInjecting = true;
 
	try {
	  const currentState = getStateSignature();
	  const parsedState = JSON.parse(currentState);
 
	  // Skip if no change
	  if (lastState === currentState) {
		return;
	  }
 
	  // Remove if shouldn't show
	  if (!parsedState.shouldShow) {
		const existing = document.getElementById('custom-button-wrapper');
		if (existing) existing.remove();
		lastState = currentState;
		return;
	  }
 
	  // Clean up existing
	  const existing = document.getElementById('custom-button-wrapper');
	  if (existing) existing.remove();
 
	  const state = getUrlState();
	  const mobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	  const vw = window.innerWidth;
 
	  // Calculate layout
	  const isMobileLayout = vw <= BREAKPOINT;
	  const containerW = isMobileLayout ? SMALL_CONTAINER : LARGE_CONTAINER;
	  const cols = isMobileLayout ? 2 : BUTTONS_PER_ROW_DESKTOP;
	  const titlePadding = isMobileLayout ? 7 : 10;
	  const btnW = Math.floor((containerW - (cols - 1) * GAP) / cols);
 
	  // Find mount point
	  const mountSelector = getMountSelector(state, mobile);
	  const mountEl = await waitForElement(mountSelector);
 
	  // Create wrapper with faster animations
	  const wrapper = document.createElement('div');
	  wrapper.id = 'custom-button-wrapper';
	  wrapper.style.cssText = `
		width: 100%;
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transform: translateY(-5px);
		transition: opacity 0.15s ease, transform 0.15s ease;
	  `;
 
	  // Grid container
	  const gridContainer = document.createElement('div');
	  gridContainer.id = 'custom-button-injector';
	  gridContainer.style.cssText = `
		overflow: hidden;
		max-height: 0;
		transition: max-height 0.2s ease;
		width: ${containerW}px;
		margin: 10px auto;
		display: flex;
		flex-wrap: wrap;
		gap: ${GAP}px;
		justify-content: flex-start;
	  `;
 
	  // Title bar
	  const titleBar = document.createElement('div');
	  titleBar.id = 'custom-button-title';
	  titleBar.className = 'f-msg';
	  titleBar.style.cssText = `
		width: ${containerW + titlePadding * 2}px;
		padding: 0 ${titlePadding}px;
		margin: 10px auto 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-sizing: border-box;
		cursor: pointer;
		transition: background 0.1s ease;
		position: relative;
	  `;
 
	  const toggleIcon = document.createElement('div');
	  toggleIcon.innerHTML = '&#9650;';
	  toggleIcon.style.cssText = `
		position: absolute;
		right: 10px;
		font-size: 14px;
		transition: transform 0.2s ease;
		transform: rotate(180deg);
	  `;
 
	  titleBar.innerHTML = `
		<div style="margin-right:10px;display:flex;align-items:center">${svgMarkup}</div>
		<span style="line-height:1;flex-grow:1;text-align:center">Our Faction Family</span>
	  `;
	  titleBar.appendChild(toggleIcon);
 
	  let isCollapsed = true;
	  titleBar.addEventListener('click', () => {
		isCollapsed = !isCollapsed;
		if (isCollapsed) {
		  gridContainer.style.maxHeight = gridContainer.scrollHeight + 'px';
		  requestAnimationFrame(() => gridContainer.style.maxHeight = '0');
		} else {
		  gridContainer.style.maxHeight = gridContainer.scrollHeight + 'px';
		}
		toggleIcon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
	  });
 
	  // Create buttons
BUTTONS.forEach(([label, url, tooltip]) => {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = label;
  a.title = tooltip || label;
  a.className = 'f-msg'; // Keep the class for background/colors
  a.style.cssText = `
	flex: 0 0 ${btnW}px;
	color: white;
	border-radius: 8px;
	text-decoration: none;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.1s ease, opacity 0.1s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	height: 50px;
	font-size: ${label.length > 28 ? '8px' : label.length > 20 ? '12px' : '16px'};
	/* Override f-msg spacing */
	padding: 0 !important;
	margin: 0 !important;
	box-sizing: border-box !important;
  `;
  
  // Update hover effects to work with the inherited styling
  a.addEventListener('mouseover', () => {
	a.style.opacity = '0.8';
	a.style.filter = 'brightness(1.1)';
  });
  a.addEventListener('mouseout', () => {
	a.style.opacity = '1';
	a.style.filter = 'brightness(1)';
  });
		a.addEventListener('click', (e) => {
		  if (url.includes(YOUR_FACTION_ID)) {
			e.preventDefault();
			window.location.href = 'https://www.torn.com/factions.php?step=your&type=1#';
		  }
		});
 
		gridContainer.appendChild(a);
	  });
 
	  // Inject elements
	  wrapper.appendChild(titleBar);
	  wrapper.appendChild(gridContainer);
	  mountEl.insertAdjacentElement('beforebegin', wrapper);
 
	  // Animate in immediately
	  requestAnimationFrame(() => {
		wrapper.style.opacity = '1';
		wrapper.style.transform = 'translateY(0)';
	  });
 
	  lastState = currentState;
 
	} catch (error) {
	  console.error('[Injector] Error:', error);
	} finally {
	  isInjecting = false;
	}
  }
 
  function scheduleInjection(delay = 50) {
	if (pendingTimeout) clearTimeout(pendingTimeout);
	pendingTimeout = setTimeout(performInjection, delay);
  }
 
  function handleChange() {
	if (!hasInitialized) return;
	scheduleInjection(100);
  }
 
  // Initialize script
  function initialize() {
	if (hasInitialized) return;
	hasInitialized = true;
 
	// Set up observers
	let mutationTimeout;
	mutationObserver = new MutationObserver(() => {
	  if (mutationTimeout) clearTimeout(mutationTimeout);
	  mutationTimeout = setTimeout(handleChange, 50);
	});
	
	mutationObserver.observe(document.body, { 
	  childList: true, 
	  subtree: true 
	});
 
	let resizeTimeout;
	let lastMobileState = window.innerWidth <= BREAKPOINT;
	window.addEventListener('resize', () => {
	  if (resizeTimeout) clearTimeout(resizeTimeout);
	  resizeTimeout = setTimeout(() => {
		const nowMobile = window.innerWidth <= BREAKPOINT;
		if (nowMobile !== lastMobileState) {
		  lastMobileState = nowMobile;
		  scheduleInjection(150);
		}
	  }, 100);
	});
 
	// Initial injection
	scheduleInjection(0);
  }
 
  // Cleanup
  function cleanup() {
	if (mutationObserver) mutationObserver.disconnect();
	if (pendingTimeout) clearTimeout(pendingTimeout);
	const wrapper = document.getElementById('custom-button-wrapper');
	if (wrapper) wrapper.remove();
	delete window[SCRIPT_ID];
  }
 
  window.addEventListener('beforeunload', cleanup);
 
  // Start when ready
  if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 100));
  } else {
	setTimeout(initialize, 100);
  }
 
})();