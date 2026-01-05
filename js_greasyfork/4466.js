// ==UserScript==
// @author			Jonas Thelemann
// @description		Swaps the irritating link to the Chip Installer with the normal link for "manual" download.
// @description:de	Vertauscht den nervigen Link zum Chip Installer mit dem normalen Link zum "manuellen" Download.
// @grant			none
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAC/VBMVEXgABr//////f/fABr+///jABrjABv///38//+/DyT//v3dARrgABj+/v3//f38//3jABffABj/+P3//Pr/+fv//P3/t8T/uMO5EiTcAhj6////7PT///v+//3gAB3cAhriABj4///8/f/iABT/+v/eARfbAhr//P/cAR3nABrbAxXgABXjABz8//v/9/v//vqzEiX/+/v/7/TVBR3kABb///n/9PX/s73lABvZAxrZBBjgARP7//3mABj7//7/8vPdASDqABflAB3/8vTZAx7pABv2///dAhXIDCLUBCDnABb5//3/+/r/9/T/9PP/7++4ESbgAiDWBBrYABH8+//3/vj/9fH/t7/YAxrZAhb/+f//9ff/7vH/ur7EDSbQByS9ECPMCSL4//r/7vf/+vT/eorDEyzBDSnhBCTjASDlABn/+fj/8fH/8uz/ucX/s8D/sL7/srvBDCTOBiTmBiHpBCDQBh7eAR3qABrnABnbARLdARH/+/3/9fn2fIm+FyrJCCasFiXkBh3kAxzNAhv5//v9/fv/8vj/+/f/8PX/wMr/u8Plho/1f4/5fI+xFCraDim6ESa9DybTDSbZByTYASHnAR3UABb///b/+fb/9uz/6ez/7+r/3+fxfI26JDi3Eyq+DirFByXCECSwDSK1DSHfCB7IBRzRABvlARL1/P/6+vz6//T/6vP/5u//193/xcn/vMfsg4utKDfVBCW6EiS/DiLWAxP/+Pz6+fn//fP/5PL/+u7/4+v/1+T7g5L/epHrYHLbWWvoU2vVP1G/JjvFGzS7GjK2Gy6lFS3TDS3KDCrnBinPECjcBSi+CCLtAyC7Cx/XCR/SABH//vzy/fr3+PD/2e3/5+P/3N//zNn/xtP/qrv/orb/oa3/mKj8naD6j5nwh5X/dIvofof9bYXheITqcYLfb37iY3rSanLQTVy4RUy9NkfGMkWyJTq4ITO8ETPrCyS2CCD/5Pb/5Nz/y8f0bnnnZW/sSWTcUmLFSFizKjzHDS6qDhlHn07TAAAOyklEQVRo3u2aZ1QbRxDHV1eF7kB3lDh3kXQS6s0yWEoEgoCppptmg8HGODYY18S9xHGPne7u9N5777333nvvvfeXWSl5L5QDBRF/4n9ISCDt73Z3dnZn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
// @include			*chip.de/downloads/*
// @license			GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.txt
// @name			Chip Download Change
// @name:de			Chip Download Wechsel
// @namespace		https://greasyfork.org/users/4685
// @run-at			document-idle
// @version			3.0
// @downloadURL https://update.greasyfork.org/scripts/4466/Chip%20Download%20Wechsel.user.js
// @updateURL https://update.greasyfork.org/scripts/4466/Chip%20Download%20Wechsel.meta.js
// ==/UserScript==
var jsLink1 = jsLink2 = manualLink1 = manualLink2 = null;
var links = document.getElementsByTagName('a');
var regexA = /javascript:DownloadStartInit.+/;
var regexB = /(.+x\.chip\.de\/intern\/dl.+)/;
//Check every link
for (var i = 0, length = links.length; i < length; i++) {
  var link = links[i];
  //Find a javascript link
  if (regexA.test(link.href)) {
    //Save first and second (last) link
    if (jsLink1 == null) {
      jsLink1 = link;
    } else {
      jsLink2 = link;
    }
    //Find a "manual" download link
  } else if (regexB.test(link.href)) {
    //Save first and second (last) link
    if (manualLink1 == null) {
      manualLink1 = link;
    } else {
      manualLink2 = link;
    }
    //Replace text if there is a javascript link
    if (jsLink1 != null) {
      link.innerHTML = link.innerHTML.replace('Manuelle Installation', 'Chip-Installer');
    }
  }
}
//Swap links
jsLink2.href = manualLink1.href;
manualLink2.href = jsLink1.href;
jsLink1.href = jsLink2.href;
manualLink1.href = manualLink2.href;