// ==UserScript==
// @version      1.3.7
// @name         YouTube More Controls
// @description  TGShare + Adds buttons under a YouTube video with more playback speeds.
// @namespace    https://github.com/Galionix
// @icon https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @author       dimas
// @match        *://*.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432520/YouTube%20More%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/432520/YouTube%20More%20Controls.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/34077641/how-to-detect-page-navigation-on-youtube-and-modify-its-appearance-seamlessly
// https://stackoverflow.com/questions/19238791/how-to-use-waitforkeyelements-to-display-information-after-select-images

(function() {
	'use strict';
    
    
    /**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * @example
 * waitForKeyElements("div.comments", (element) => {
 *   element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 *   const iframe = document.querySelector('iframe');
 *   if (iframe) {
 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 *     return iframeDoc.querySelectorAll("div.comments");
 *   }
 *   return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 *                                                 If returns true, element will be processed again on subsequent iterations.
 * @param {boolean}           [waitOnce=true]    - Whether to stop after the first elements are found.
 * @param {number}            [interval=300]     - The time (ms) to wait between iterations.
 * @param {number}            [maxIntervals=-1]  - The max number of intervals to run (negative number for unlimited).
 */
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}
    
let url = window.location.href
let tgShare = document.createElement('div');

document.addEventListener('keypress', function(event) {
  if (event.key === 'p') {
    makeFullscreen()
  }
});

makeFullscreen()


function makeFullscreen(){
	let funcDone = false;
	const infoElemSelector = '#info.style-scope.ytd-video-primary-info-renderer';
	const colors = ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', '#97B2CD']; // https://www.schemecolor.com/wedding-in-india.php
	if (!funcDone) window.addEventListener('yt-navigate-start', addSpeeds);

	if (document.body && !funcDone) {
		waitForKeyElements(infoElemSelector, onKeyElementsExist); // eslint-disable-line no-undef
	}

    waitForKeyElements("#masthead-container",(el)=>{ // eslint-disable-line no-undef
        console.log({el})
        el.style.position="initial"
    })


    waitForKeyElements("video.video-stream.html5-main-video",(el)=>{ // eslint-disable-line no-undef
        console.log({el})
        el.style.height="100vh"
    })


    waitForKeyElements("#player-theater-container",(el)=>{ // eslint-disable-line no-undef
        console.log({el})
        el.style.height="100vh"
        el.style.maxHeight="initial"
    })

}


/**
 * @param string $url Absolute URL to share, e.g. "https://example.com/path/to/article?with=params"
 * @param string $text Optional comment to share URL with, e.g. "Check out this article!"
 * @return string Button HTML markup, feel free to modify to your taste
 */
function telegramForwardButton(url, text = '') {
  return `<button
style="background-color:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;padding: 1px 6px;"
  ><a target='__blank' href=\"tg://msg_url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}"
  style="display:flex; align-items:center; text-decoration:none; color:rgba(255,255,255,0.7); "
  ><svg

  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:cc="http://creativecommons.org/ns#"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
  xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" id="svg2"
  version="1.1" inkscape:version="0.91+devel r" width="15" height="15" viewBox="0 0 512 512" sodipodi:docname="telegram.svg"

  style="

    margin-right: var(--ytd-margin-base);

  >
  <metadata id="metadata8">
    <rdf:RDF>
      <cc:Work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
        <dc:title/>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs id="defs6"/>
  <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1920" inkscape:window-height="1024" id="namedview4" showgrid="false" showguides="false" inkscape:zoom="1.625" inkscape:cx="607.07692" inkscape:cy="256" inkscape:window-x="0" inkscape:window-y="29" inkscape:window-maximized="1" inkscape:current-layer="svg2"/>
  <circle style="opacity:1;fill:#4aaee8;fill-opacity:1;stroke:none;stroke-width:91.3417511;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="path3344" cx="256" cy="256" r="225"/>
  <path style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:91.3417511;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" d="m 263.5553,362.57139 c -2.47405,-2.49722 -11.18811,-17.70742 -19.36459,-33.80047 -8.17651,-16.09305 -16.52273,-31.62674 -18.54717,-34.51935 -2.30764,-3.29722 -15.36044,-11.13747 -34.98817,-21.01588 -35.30919,-17.77074 -40.05393,-21.58385 -39.09856,-31.42161 0.87293,-8.98884 4.4521,-10.8486 54.15657,-28.14004 22.73442,-7.90897 59.40415,-20.66244 81.4883,-28.34108 22.08414,-7.67862 42.60204,-13.96114 45.59532,-13.96114 6.24973,0 12.12164,5.52466 12.12164,11.40481 0,2.21336 -7.3663,25.29767 -16.36953,51.29851 -9.00326,26.00084 -19.33718,55.90095 -22.96426,66.44468 -12.2606,35.64064 -21.63633,59.51235 -24.7674,63.06053 -4.29348,4.86547 -11.88159,4.42194 -17.26215,-1.00896 z" id="path3340" inkscape:connector-curvature="0"/>
</svg>Share</a></button>`;
}
	function addSpeeds() {
	 url = window.location.href
		

		let bgColor = colors[0];
		let moreSpeedsDiv = document.createElement('div');
		moreSpeedsDiv.id = 'more-speeds';
moreSpeedsDiv.style.display ='flex'

		for (let i = 0.5; i < 2; i += .1) {
			if (i >= 0.5) { bgColor = colors[0]; }
			//if (i > 1) { i += .75; }
			if (i > 1) bgColor = colors[1];
			if (i > 2) bgColor = colors[2];

			let btn = document.createElement('button');
			btn.style.backgroundColor = bgColor;
			btn.style.marginRight = '4px';
			btn.style.border = '1px solid rgba(255,255,255,0.1)';
			btn.style.borderRadius = '2px';
			btn.style.color = 'rgba(255,255,255,0.7)';
			btn.style.fontSize = '8px'
			btn.style.cursor = 'pointer';
			btn.textContent = '×'+i.toFixed(1);
			btn.addEventListener('click', () => { document.getElementsByTagName('video')[0].playbackRate = i } );
			moreSpeedsDiv.appendChild(btn);
		}


console.log(url)
tgShare.style.margin = '0 0 0 auto'
tgShare.innerHTML = telegramForwardButton(url,'Зацени что нашёл!');

		if (funcDone) return;
		let infoElem = document.querySelector(infoElemSelector);
moreSpeedsDiv.append(tgShare);
		infoElem.parentElement.insertBefore(moreSpeedsDiv, infoElem);

		funcDone = true;
	}

    function hideSecondaryBar(){
    //const el = document.getElementById('secondary').style.display = 'none';

        //console.log({el});
    }

    function onKeyElementsExist(){
    addSpeeds()
    hideSecondaryBar()
    }

})();
