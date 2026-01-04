// ==UserScript==
// @name         rewe Shop - Favourites - Sale Only
// @namespace    http://tampermonkey.net/
// @version      2025-01-13
// @description  When you go to your Favourites List in the shop, you can now show only articles that are on sale.
// @author       Kiki
// @match        https://shop.rewe.de/deine-produkte*
// @icon         https://shop.rewe.de/icons/favicon-48.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523002/rewe%20Shop%20-%20Favourites%20-%20Sale%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/523002/rewe%20Shop%20-%20Favourites%20-%20Sale%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addSwitch();
})();

function addSwitch()
{
    const newDiv = document.createElement("div");
  // use predefined class for better layout
  newDiv.classList.add("btn");
  newDiv.style.marginRight = "1.5em";
  newDiv.innerHTML = `
    <div style="display:inline-block; vertical-align: middle;">Sale Only:&nbsp;</div>
    <div style="display:inline-block; vertical-align: middle">
      <label class="switch">
        <input id="cbOffers" type="checkbox">
        <span class="slider round"></span>
      </label>
    </div>
  `;
  const parent = document.querySelector('.ths-shopping-navigation');
  parent.insertBefore(newDiv, parent.firstChild);
  // add handler
  const cb = document.querySelector('input#cbOffers');
  cb.addEventListener("change", offerModeChanged);

  addSwitchStyles();
}

function offerModeChanged()
{
    toggleStyle("div.lrms-productTile:not(:has(rdc-svg[name='badge-offer'])) { display: none; }");
}

function addSwitchStyles()
{
    addStyle(`
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
`);

    addStyle(`
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
`);

    addStyle(`
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
`);

    addStyle(`
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
`);

    addStyle(`
input:checked + .slider {
  background-color: #2196F3;
}
`);

    addStyle(`
input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}
`);

    addStyle(`
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
`);

    addStyle(`
.slider.round {
  border-radius: 34px;
}
`);

    addStyle(`
.slider.round:before {
  border-radius: 50%;
}
`);

}

/***************************************************************/
function addStyle(css)
{
  const sheet = getStyleSheet();
  if(findStyle(css) < 0)
  {
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
  }
  else
  {
    console.warn("Style already exists - not added");
  }
}

function getStyleTag()
{
  const myStyleId = "myAddedStyle0815";
  var style = document.getElementById(myStyleId);
  if(style == null)
  {
    style = document.createElement('style');
    style.type = 'text/css';
    style.id = myStyleId;
    document.head.appendChild(style);
  }
  return style;
}

function getStyleSheet()
{
  const
    tag = getStyleTag(),
    sheet = (tag.sheet || tag.styleSheet);
  return sheet;
}

function findStyle(css)
{
  var retVal = -1;
  const sheet = getStyleSheet(),
    rules = (sheet.rules || sheet.cssRules);

  /* saved rules always use double quotes,
     so we replace single quotes in our search string */
  css = css.replace(/'/g, "\"");
  /* saved rules are also re-formatted, so we eliminate
     any white-space below for the comparison */

  for (var i=0; i < rules.length; i++)
  {
    if(rules[i].cssText.replace(/\s/g, "") == css.replace(/\s/g, ""))
    {
      retVal = i;
      break;
    }
  }

  return retVal;
}

function deleteStyle(css)
{
  const sheet = getStyleSheet();
  var i = findStyle(css);
  if(i >= 0)
  {
    sheet.removeRule(i);
  }
  else
  {
    console.warn("Style to be deleted does not exist");
  }
}

function toggleStyle(css)
{
  if(findStyle(css) >= 0)
  {
    deleteStyle(css);
  }
  else
  {
    addStyle(css);
  }
}
