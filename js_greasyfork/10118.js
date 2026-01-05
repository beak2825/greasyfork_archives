// ==UserScript==
// @name       Aurora Dot
// @namespace  http://www.swpc.noaa.gov/products/aurora-30-minute-forecast
// @version    1.0
// @description Display a red dot on your position on the aurora forecast website
// @include        http://www.swpc.noaa.gov/products/aurora-30-minute-forecast
// @copyright  2012+, TKWE
// @downloadURL https://update.greasyfork.org/scripts/10118/Aurora%20Dot.user.js
// @updateURL https://update.greasyfork.org/scripts/10118/Aurora%20Dot.meta.js
// ==/UserScript==

var x = 333;
var y = 563;

var matchingElements = [];
var divElements = document.getElementsByTagName('div');

for (var i = 0; i < divElements.length; i++)
{
  if (divElements[i].className == 'block block-delta-blocks block-page-title block-delta-blocks-page-title even block-without-title')
  {
    // Element exists with attribute. Add to array.
    matchingElements.push(divElements[i]);
  }
}

matchingElements[0].innerHTML = matchingElements[0].innerHTML.replace('</div>\n  </div>','</div>\n  </div>\n<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" style="position: absolute; top: '+y+'px; left: '+x+'px; height: 4px; width: 4px; z-index:5;"/>');