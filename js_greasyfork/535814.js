// ==UserScript==
// @name         Add to Obtainium
// @namespace    https://naeembolchhi.github.io/
// @version      0.8
// @description  Shows an "Add to Obtainium" button on various Obtainium-supported app websites.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @match        http*://f-droid.org/*/packages/*/*
// @match        http*://cloudflare.f-droid.org/*/packages/*/*
// @match        http*://f-droid.org/packages/*/*
// @match        http*://cloudflare.f-droid.org/packages/*/*
// @match        http*://www.apkmirror.com/apk/*/*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='-464.57' x2='-402.59' y1='485.32' y2='413.87' gradientTransform='matrix(2.83 0 0 -2.83 1398.77 1413.1)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%239b58dc'/%3E%3Cstop offset='1' stop-color='%23321c92'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M204.93 285.91c-3.79-2.01-25.95-14.29-129.75-71.9-28.88-16.03-56.7-31.45-61.8-34.26C1.78 173.37 0 171.8 0 167.96c0-2.01 4.63-14.89 15.48-43.06 8.51-22.1 16.04-41.47 16.73-43.04 1.57-3.58 4.09-6.61 6.56-7.89 2.31-1.19 60.02-22.27 62.97-23 3.18-.78 5.92.72 7.54 4.14.78 1.64 4 10.1 7.17 18.81 3.17 8.71 7.88 21.58 10.48 28.6 5.95 16.1 6.17 18.38 2.03 20.82-1.1.65-8.23 3.45-15.86 6.22-7.63 2.77-14.9 5.65-16.17 6.39-2.92 1.7-3.36 4.33-1.08 6.44.91.84 15.57 9.2 32.59 18.59 47.56 26.23 44.92 25.04 48.09 21.62 1.55-1.68 29.97-73.94 31.6-80.37.7-2.74.62-3.13-.87-4.33-2.03-1.64-1.74-1.71-20.41 4.89-18.5 6.54-20.26 6.68-22.74 1.79-1.3-2.57-21.23-57.3-22.47-61.7-.8-2.85.18-5.55 2.58-7.13 1-.65 15.5-6.22 32.23-12.36 24.82-9.12 31.14-11.19 34.37-11.24 4.17-.07 4.71.22 81.09 42.48 5.29 2.93 8.12 6.01 8.12 8.86 0 1.13-18.94 51.37-42.09 111.64-32.65 85-42.5 109.94-43.92 111.2-2.43 2.13-4.41 2.04-9.06-.42Z' fill='url(%23a)'/%3E%3C/svg%3E
// @require      https://update.greasyfork.org/scripts/535813/1589729/QR-Code-Generator.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535814/Add%20to%20Obtainium.user.js
// @updateURL https://update.greasyfork.org/scripts/535814/Add%20to%20Obtainium.meta.js
// ==/UserScript==

// SVG Icons
const svgIcons = {
  "obtainium": `<svg id="obtainiumlogo" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300"><defs><linearGradient id="a" x1="-464.57" x2="-402.59" y1="485.32" y2="413.87" gradientTransform="matrix(2.83 0 0 -2.83 1398.77 1413.1)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9b58dc"/><stop offset="1" stop-color="#321c92"/></linearGradient></defs><path d="M204.93 285.91c-3.79-2.01-25.95-14.29-129.75-71.9-28.88-16.03-56.7-31.45-61.8-34.26C1.78 173.37 0 171.8 0 167.96c0-2.01 4.63-14.89 15.48-43.06 8.51-22.1 16.04-41.47 16.73-43.04 1.57-3.58 4.09-6.61 6.56-7.89 2.31-1.19 60.02-22.27 62.97-23 3.18-.78 5.92.72 7.54 4.14.78 1.64 4 10.1 7.17 18.81 3.17 8.71 7.88 21.58 10.48 28.6 5.95 16.1 6.17 18.38 2.03 20.82-1.1.65-8.23 3.45-15.86 6.22-7.63 2.77-14.9 5.65-16.17 6.39-2.92 1.7-3.36 4.33-1.08 6.44.91.84 15.57 9.2 32.59 18.59 47.56 26.23 44.92 25.04 48.09 21.62 1.55-1.68 29.97-73.94 31.6-80.37.7-2.74.62-3.13-.87-4.33-2.03-1.64-1.74-1.71-20.41 4.89-18.5 6.54-20.26 6.68-22.74 1.79-1.3-2.57-21.23-57.3-22.47-61.7-.8-2.85.18-5.55 2.58-7.13 1-.65 15.5-6.22 32.23-12.36 24.82-9.12 31.14-11.19 34.37-11.24 4.17-.07 4.71.22 81.09 42.48 5.29 2.93 8.12 6.01 8.12 8.86 0 1.13-18.94 51.37-42.09 111.64-32.65 85-42.5 109.94-43.92 111.2-2.43 2.13-4.41 2.04-9.06-.42Z" fill="url(#a)"/></svg>`,
  "qr": `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300"><rect width="51.37" height="51.37" x="162.05" y="162.23" rx="25.69" ry="25.69"/><rect width="51.37" height="51.37" x="248.63" y="162.23" rx="25.69" ry="25.69"/><rect width="51.37" height="51.37" x="162.05" y="248.63" rx="25.69" ry="25.69"/><circle cx="231.02" cy="231.11" r="18.68"/><path d="M90.29 0H46.7C20.91 0 0 20.91 0 46.7v43.59c0 25.8 20.91 46.7 46.7 46.7h43.59c25.8 0 46.7-20.91 46.7-46.7V46.7C137 20.91 116.09 0 90.29 0Zm9.34 87.18c0 6.88-5.57 12.45-12.45 12.45H49.82c-6.88 0-12.45-5.57-12.45-12.45V49.82c0-6.88 5.57-12.45 12.45-12.45h37.36c6.88 0 12.45 5.57 12.45 12.45v37.36ZM90.29 163H46.7C20.9 163 0 183.91 0 209.7v43.59c0 25.8 20.91 46.7 46.7 46.7h43.59c25.8 0 46.7-20.91 46.7-46.7V209.7c0-25.8-20.91-46.7-46.7-46.7Zm9.34 87.18c0 6.88-5.57 12.45-12.45 12.45H49.82c-6.88 0-12.45-5.57-12.45-12.45v-37.36c0-6.88 5.57-12.45 12.45-12.45h37.36c6.88 0 12.45 5.57 12.45 12.45v37.36ZM253.3 0h-43.59c-25.8 0-46.7 20.91-46.7 46.7v43.59c0 25.8 20.91 46.7 46.7 46.7h43.59c25.8 0 46.7-20.91 46.7-46.7V46.7C300 20.9 279.09 0 253.3 0Zm9.34 87.18c0 6.88-5.57 12.45-12.45 12.45h-37.36c-6.88 0-12.45-5.57-12.45-12.45V49.82c0-6.88 5.57-12.45 12.45-12.45h37.36c6.88 0 12.45 5.57 12.45 12.45v37.36Z"/></svg>`,
  "copy": `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300"><path d="M11.31 114.58C22.19 91.94 42.46 79.36 75 75.16c3.58-23.12 10.99-48.03 35.81-62.02C129.77 2.45 162.65-1.75 208.54.66c30.27 1.59 66.95 8.17 82.09 45.21 6.06 14.84 9.56 40.88 9.36 69.65-.21 29.27-4.33 55.18-11.02 69.32-10.87 22.94-31.21 35.67-63.91 39.91-3.63 23.95-11.4 49.64-38.23 63.25-14.33 7.27-39.9 11.64-70.15 11.97-1.23.01-2.45.02-3.67.02-27.62 0-52.48-3.47-67.01-9.4-21.33-8.7-34.66-24.89-40.74-49.51-7.49-30.29-8.24-96.77 6.05-126.52v.02Zm132.52 147.46c39.08-4.06 43.57-18.9 45.68-57.16 2.39-43.23-1.43-70.68-11.37-81.58-10.53-11.56-37.26-12.79-48.68-13.32-40.48-1.87-69.37 2.44-79.25 11.82-6.22 5.91-9.25 16.62-10.69 24.57-3.17 17.49-2.79 35.85-2.19 51.69.05 1.33.1 2.69.14 4.08.68 20.16 1.52 45.25 20.71 53.95 19.42 8.8 62.82 8.32 85.62 5.95h.03ZM112.54 73.13l24.94.57.26.02c20.04 1.91 37.92 4.28 53.83 13.95 33.83 20.56 34.61 63.71 35.24 98.39 0 .48.02.96.03 1.44 15.71-2.68 26.51-8.32 31.61-24.91 7.06-22.99 6.69-79.29-.67-100.4-4.23-12.14-11.15-18-25.52-21.61-10.93-2.74-28.18-4.21-45.69-4.21-20.89 0-42.15 2.09-53.44 6.62-13.25 5.32-18.04 15.51-20.59 30.15Z"/></svg>`
};

// Conditional styles
function styleIf() {
  let web = window.location.hostname;

  if (web.match(/f.droid/)) {
    return ``;
  } else if (web.match(/apkmirror/)) {
    return `
      #masthead .site-toolbar .search-bar {
        margin-right: 28.5rem;
      }
      #obtainButton {
        right: calc(1.5 * var(--orem));
      }
      @media screen and (max-width: 991px) {
        .searchbox-parent.open {
          right: 300px;
        }
      }
      @media screen and (max-width: 750px) {
        #obtainButton {
          right: calc(1.25 * var(--orem));
        }
        #masthead .site-toolbar .search-bar {
          margin-right: 17.75rem;
        }
        .searchbox-parent.open {
          right: 190px;
        }
      }
    `;
  }
}

// Button Style
const buttonStyle = `
:root {
  --orem: 16px;
}
body .site-title {
  width: fit-content;
}
body > .site-wrapper {
  position: relative;
}
#obtainButton a {
  color: inherit;
  text-decoration: none;
  opacity: 1;
}
#obtainButton * {
  box-sizing: content-box;
  transition: transform .05s linear, border-radius .05s linear;
}
#obtainButton {
  position: absolute;
  right: calc(2 * var(--orem));
  margin-top: calc(.75 * var(--orem)) calc(.5 * var(--orem)) calc(.5 * var(--orem)) calc(.5 * var(--orem));
  z-index: 999;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  transition: top .15s linear;
  top: calc(-3.5 * var(--orem));
}
#obtainButton.visible {
  top: 0;
}
#obtainButton .obtain-fixed {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}
#obtainButton .obtain-main svg {
  height: calc(2 * var(--orem));
  width: calc(2 * var(--orem));
}
#obtainButton .obtain-main {
  padding: calc(.85 * var(--orem)) calc(.75 * var(--orem)) calc(.5 * var(--orem)) calc(.75 * var(--orem));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(.5 * var(--orem));
  height: calc(2.25 * var(--orem));
  background: #ebe1ff;
  transform: translateY(calc(-.35 * var(--orem)));
  border-radius: 0 0 0 calc(.5 * var(--orem));
  cursor: pointer;
}
#obtainButton .obtain-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  font-family: inherit;
}
#obtainButton .obtain-qr,
#obtainButton .obtain-copy {
  padding: calc(.85 * var(--orem)) calc(.5 * var(--orem)) calc(.5 * var(--orem)) calc(.5 * var(--orem));
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(2.25 * var(--orem));
  width: calc(2.25 * var(--orem));
  transform: translateY(calc(-.35 * var(--orem)));
  border-radius: 0 0 calc(.5 * var(--orem)) 0;
  cursor: pointer;
  background: #9B58DC;
  background: linear-gradient(113deg, rgba(155, 88, 220, 1) 0%, rgba(50, 28, 146, 1) 100%);
  fill: #ffffff;
}
#obtainButton .obtain-copy {
  --_bg-color: #242424;
  border-radius: 0 0 0 0;
  background: var(--_bg-color);
}
#obtainButton .obtain-main:active,
#obtainButton .obtain-qr:active,
#obtainButton .obtain-copy:active {
  transform: translateY(0);
  border-radius: 0 0 calc(.5 * var(--orem)) calc(.5 * var(--orem));
}
#obtainButton .obtain-qr svg,
#obtainButton .obtain-copy svg {
  height: calc(1.75 * var(--orem));
  width: calc(1.75 * var(--orem));
}
#obtainButton .obtain-small {
  font-size: calc(.8 * var(--orem));
}
#obtainButton .obtain-large {
  font-size: calc(1.2 * var(--orem));
  font-weight: 700;
}
#obtainButton #obtain-qr-display {
  position: fixed;
  top: calc(4 * var(--orem));
  border-radius: calc(.5 * var(--orem));
  overflow: hidden;
  background: #fefefe;
  display: none;
  height: 0;
  max-height: 0;
  overflow: hidden;
  transition: height .1s ease-in-out, max-height .1s ease-in-out;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
#obtainButton #obtain-qr-display canvas {
  margin: calc(.75 * var(--orem));
  width: calc(40 * var(--orem));
  max-width: calc(100svw - (3.5 * var(--orem)));
  aspect-ratio: 1/1;
}
#obtainButton #obtain-qr-display img {
  display: none;
}
#obtainButton #obtain-qr-display.visible {
  display: block;
}
#obtainButton #obtain-qr-display.visible.animate {
  height: calc((40 * var(--orem)) + (.75 * var(--orem)) + (.75 * var(--orem)));
  max-height: calc(100svw - (3.5 * var(--orem)) + (.75 * var(--orem)) + (.75 * var(--orem)));
}
@media screen and (max-width: 750px) {
  #obtainButton {
    right: calc(1 * var(--orem));
  }
  #obtainButton .obtain-fixed .obtain-text {
    display: none;
  }
}
` + styleIf();

// Generate F-Droid Link
function fdroidLink() {
  const appName = document.querySelector('h3.package-name').textContent.replace(/[\t\n]/g,''),
        appID = window.location.pathname.replace(/.*packages\/(.*)\//,'$1'),
        appURL = window.location.href.replace(/\/$/,'');

  const settingsJSON = `
    {
      "filterVersionsByRegEx": "",
      "trySelectingSuggestedVersionCode": true,
      "autoSelectHighestVersionCode": false,
      "trackOnly": false,
      "versionExtractionRegEx": "",
      "matchGroupToUse": "",
      "versionDetection": true,
      "useVersionCodeAsOSVersion": false,
      "apkFilterRegEx": "",
      "invertAPKFilter": false,
      "autoApkFilterByArch": true,
      "appName": "replacethiswithappnamelater",
      "appAuthor": "",
      "shizukuPretendToBeGooglePlay": false,
      "allowInsecure": false,
      "exemptFromBackgroundUpdates": false,
      "skipUpdateNotifications": false,
      "about": "",
      "refreshBeforeDownload": false
    }
  `.replace(/[\s\n]/g,'').replace(/\"/g,'\\"');

  const mainJSON = `
    {
      "id": "${appID}",
      "url": "${appURL}",
      "author": "replacethiswithauthornamelater",
      "name": "replacethiswithappnamelater",
      "preferredApkIndex": 0,
      "additionalSettings": "replacethiswithsettingslater",
      "overrideSource": "FDroid"
    }
  `.replace(/[\s\n]/g,'')
   .replace(/replacethiswithsettingslater/, settingsJSON)
   .replace(/replacethiswithauthornamelater/, 'F-Droid official')
   .replace(/replacethiswithappnamelater/g, appName);

  // return `https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/${encodeURIComponent(mainJSON)}`;
  return `obtainium://app/${encodeURIComponent(mainJSON)}`;
}

// Generate APK Mirror Link
function apkmirrorLink() {
  const appAuthor = document.querySelector('.dev-title').textContent.replace(/^by\s/i,''),
        appID = document.querySelector('a[href*="play.google.com"]').href.replace(/.*id=/,'') || Date.now(),
        urlArray = window.location.pathname.split('/'),
        appURL = window.location.origin + `/${urlArray[1]}/${urlArray[2]}/${urlArray[3]}/`,
        appName = document.querySelector(`#breadcrumbs a[href='/${urlArray[1]}/${urlArray[2]}/${urlArray[3]}/']`).textContent;

  const settingsJSON = `
    {
      "fallbackToOlderReleases": true,
      "filterReleaseTitlesByRegEx": "",
      "trackOnly": true,
      "versionExtractionRegEx": "",
      "matchGroupToUse": "",
      "versionDetection": true,
      "releaseDateAsVersion": false,
      "useVersionCodeAsOSVersion": false,
      "apkFilterRegEx": "",
      "invertAPKFilter": false,
      "autoApkFilterByArch": true,
      "appName": "replacethiswithappnamelater",
      "appAuthor": "replacethiswithauthornamelater",
      "shizukuPretendToBeGooglePlay": false,
      "allowInsecure": false,
      "exemptFromBackgroundUpdates": false,
      "skipUpdateNotifications": false,
      "about": "",
      "refreshBeforeDownload": false
    }
  `.replace(/[\s\n]/g,'').replace(/\"/g,'\\"');

  const mainJSON = `
    {
      "id": "${appID}",
      "url": "${appURL}",
      "author": "replacethiswithauthornamelater",
      "name": "replacethiswithappnamelater",
      "preferredApkIndex": 0,
      "additionalSettings": "replacethiswithsettingslater",
      "overrideSource": null
    }
  `.replace(/[\s\n]/g,'')
   .replace(/replacethiswithsettingslater/, settingsJSON)
   .replace(/replacethiswithauthornamelater/g, appAuthor)
   .replace(/replacethiswithappnamelater/g, appName);

  // return `https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/${encodeURIComponent(mainJSON)}`;
  return `obtainium://app/${encodeURIComponent(mainJSON)}`;
}

// Get right link for Obtainium
function obtainiumLink() {
  let web = window.location.hostname;

  if (web.match(/f.droid/)) {
    return fdroidLink();
  } else if (web.match(/apkmirror/)) {
    return apkmirrorLink();
  }
}

// Button Content
const buttonContent = `
  <div class="obtain-fixed">
    <a href="${obtainiumLink()}" class="obtain-main">${svgIcons.obtainium}<div class="obtain-text"><span class="obtain-small">Add to</span><span class="obtain-large">Obtainium</span></div></a>
    <div class="obtain-copy">${svgIcons.copy}</div>
    <div class="obtain-qr">${svgIcons.qr}</div>
  </div>
  <div id="obtain-qr-display"></div>
`;

// Add a button
function addButton() {
  let obtain = document.createElement('obtain');
  obtain.innerHTML = `<style type="text/css">${buttonStyle}</style>${buttonContent}`;
  obtain.id = "obtainButton";

  let web = window.location.hostname,
      buttonParent = 'body';

  if (web.match(/f.droid/)) {
    buttonParent = 'body > .site-wrapper';
  } else if (web.match(/apkmirror/)) {
    buttonParent = 'body #masthead .site-toolbar';
  }

  document.querySelector(buttonParent).appendChild(obtain);

  setTimeout(() => {
    document.querySelector('#obtainButton').classList.add('visible');
  }, 10);
}

// Generate and place QR
function makeQR() {
  let qrlink = 'https://apps.obtainium.imranr.dev/redirect?r=' + obtainiumLink();
  let target = document.querySelector('#obtain-qr-display');

  doqr(qrlink, 1, "#fefefe", "#000000", target);
}

// Copy function
function copyString(string) {
  let copyButton = document.querySelector('.obtain-copy');

  navigator.clipboard.writeText(string)
    .then(() => {
      // success
      copyButton.setAttribute('style','--_bg-color: #4caf50');
    })
    .catch(() => {
      // failure
      copyButton.setAttribute('style','--_bg-color: #f44336');
    });

  setTimeout(() => {
    copyButton.removeAttribute('style');
  }, 800);
}

// Event listeners
function listenClick() {
  document.addEventListener('click', (e) => {
    let qrButton = document.querySelector('.obtain-qr'),
        qrImage = document.querySelector('#obtain-qr-display'),
        copyButton = document.querySelector('.obtain-copy')

    if (qrButton.contains(e.target) && !qrImage.classList.contains('visible')) {
      qrImage.classList.add('visible');
      setTimeout(() => {
        qrImage.classList.add('animate');
      }, 10);
    } else if (qrButton.contains(e.target) && qrImage.classList.contains('visible')) {
      qrImage.classList.remove('animate');
      setTimeout(() => {
        qrImage.classList.remove('visible');
      }, 100);
    } else if (!qrImage.contains(e.target) && qrImage.classList.contains('visible')) {
      qrImage.classList.remove('animate');
      setTimeout(() => {
        qrImage.classList.remove('visible');
      }, 100);
    }

    if (copyButton.contains(e.target)) {
      copyString('https://apps.obtainium.imranr.dev/redirect?r=' + obtainiumLink());
    }
  });
}

addButton();
makeQR();
listenClick();