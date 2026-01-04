// ==UserScript==
// @name               GSMArena Calculate Screen Size
// @namespace          QOAL/gsmarena/calculateScreenSize
// @description        Uses information on the page to calculate the dimensions of a phone's screen
// @author             QOAL
// @version            1
// @grant              none
// @match              https://www.gsmarena.com/*
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/431432/GSMArena%20Calculate%20Screen%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/431432/GSMArena%20Calculate%20Screen%20Size.meta.js
// ==/UserScript==

/*

	Works with any phone that states the diagonal size of the screen, and the aspect ratio.
  It also works when comparing phones.
    It will fail if one of the phones is missing either the size or aspect ratio.
    This could be worked around, but I'm keeping this simple.

*/

(function(){
	'use strict';

  const resEles = document.querySelectorAll('[data-spec="displayresolution"]');
  const sizeEles = document.querySelectorAll('[data-spec="displaysize"]');

	if (!resEles && !sizeEles || (resEles.length !== sizeEles.length)) {
      return
	}

  const diagonalRegEx = /(\d+\.\d+) inches/
  const ratioRegEx = /(\d+:\d+) ratio/

  for (let i = 0; i < resEles.length; i++) {

    let resEle = resEles[i];
    let sizeEle = sizeEles[i];

    const resText = resEle.textContent;
    const sizeText = sizeEle.textContent;

    const ratioPair = resText.match(ratioRegEx)[1].split(":").map(n=>parseInt(n));
    const diagonal = parseFloat(sizeText.match(diagonalRegEx)[1]);

    const ratioBig = Math.max(...ratioPair);
    const ratioLittle = Math.min(...ratioPair);

    const aspectRatio = ratioBig / ratioLittle;

    const factor = diagonal / aspectRatio;

    const width = ratioLittle * factor;
    const height = ratioBig * factor;

    const screenInfo = `≈ ${(height * 2.54).toFixed(2)} x ${(width * 2.54).toFixed(2)} mm (${(height / 10).toFixed(2)} x ${(width / 10).toFixed(2)} in)`;

    sizeEle.appendChild(document.createElement("br"));
    sizeEle.appendChild(document.createTextNode(screenInfo));

  }

})()
