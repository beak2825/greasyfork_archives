// ==UserScript==
// @name        Umamusume - Show Resource Version
// @description Shows resource version string in a box for easy copying
// @namespace   fabulous.cupcake.jp.net
// @match       https://umamusume.cygames.jp/
// @grant       none
// @version     2021.04.28.4
// @author      FabulousCupcake
// @downloadURL https://update.greasyfork.org/scripts/425649/Umamusume%20-%20Show%20Resource%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/425649/Umamusume%20-%20Show%20Resource%20Version.meta.js
// ==/UserScript==

const copyToClipboard = str => {
    // Source: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const recordVersion = (resourceVersion, gameVersion) => {
  localStorage[gameVersion] = resourceVersion;
  
  // We also want to record version:checksum number in case
  // they decide to use a new resource version for the same game version
  const versionNumber = resourceVersion.split(":")?.[0];
  const checksum = resourceVersion.split(":")?.[1];
  localStorage[versionNumber] = checksum;
}

const printRecordedVersions = () => {
  let result = "GameVersion, ResourceVersionString\n";
  Object.keys(localStorage).forEach(gameVersion => {
    if (!gameVersion.includes(".")) return;
    const resourceString = localStorage[gameVersion];
    result += `${gameVersion}, ${resourceString}\n`;
  });
  result += "\n---\n\n";
  
  result += "ResourceVersionNumber, Checksum\n";
  Object.keys(localStorage).forEach(resourceVersionNumber => {
    if (resourceVersionNumber.includes(".")) return;
    const checksum = localStorage[resourceVersionNumber];
    result += `${resourceVersionNumber}, ${checksum}\n`;
  });
  
  return result;
}

const getHashUsp = () => {
  const hashUsp = location.hash.split("?")?.[1];
  return new URLSearchParams(hashUsp);
}

const showResourceVersionBox = (resourceVersion, gameVersion) => {
  const versionNumber = resourceVersion.split(":")?.[0];
  const checksum = resourceVersion.split(":")?.[1];

  const el = `
<div class="resVerBox">
  <dl>
    <dt>Resource Version</dt>
    <dd>${resourceVersion}</dd>
    <dt>Version Number</dt>
    <dd>${versionNumber}</dd>
    <dt>Checksum</dt>
    <dd>${checksum}</dd>
    <dt>Game Version</dt>
    <dd>${gameVersion}</dd>
    <br />
    <center>
      <input type="button" value="Show Past Versions" class="show-version" />
    </center>
  </dl>
</div>`;
  const stylesheet = `
.resVerBox {
  position: absolute;
  z-index: 999999999999;
  top: 220px;
  right: -15px;
  padding: 1.5em 2.25em 1.5em 1.5em;
  
  border: 4px solid #69c10c;
  border-radius: 15px;
  background: white;
  font-family: sans-serif;
}

.resVerBox dt {
  font-weight: bold;
  border-bottom: 1px solid #794016;
}

.resVerBox dt:not(:first-child) {
  margin-top: 0.5em;
}

.resVerBox dd {
  cursor: pointer;
  transition: background 300ms ease;
  font-family: Consolas;
}

.resVerBox dd:hover {
  background: #f5caba;
}

.resVerBox dd:active {
  transition: none;
  background: #da8;
}

`;
  
  // Insert CSS
  var stylesheetEl = document.createElement('style');
  stylesheetEl.innerHTML = stylesheet;
  document.body.appendChild(stylesheetEl);
  
  // Insert Element
  document.body.insertAdjacentHTML("beforeend", el);
  
  // Add event listener
  const ddEls = document.querySelectorAll(".resVerBox dd");
  Array.from(ddEls).forEach(dd => {
    dd.addEventListener("click", () => {
      copyToClipboard(dd.textContent);
    });
  });
  
  document.querySelector(".resVerBox .show-version").addEventListener("click", () => {
    window.alert(printRecordedVersions());
  });
}

const main = () => {
  const hashUsp = getHashUsp();
  const resourceVersion = hashUsp.get("r");
  const gameVersion = hashUsp.get("v")
  if (!resourceVersion) return;

  recordVersion(resourceVersion, gameVersion);
  showResourceVersionBox(resourceVersion, gameVersion);  
}

main();