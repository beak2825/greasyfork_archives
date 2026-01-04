// ==UserScript==
// @name         Copy information of apps from Play Store to post on Mobilism
// @namespace    https://github.com/AbdurazaaqMohammed/userscripts
// @version      1.0.4.2
// @description  Copy information of apps from Play Store and format it to post on Mobilism
// @author       Abdurazaaq Mohammed
// @match        https://play.google.com/store/apps/*
// @grant        GM_setClipboard
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490026/Copy%20information%20of%20apps%20from%20Play%20Store%20to%20post%20on%20Mobilism.user.js
// @updateURL https://update.greasyfork.org/scripts/490026/Copy%20information%20of%20apps%20from%20Play%20Store%20to%20post%20on%20Mobilism.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getInfo() {
    const aboutAppButtons = document.getElementsByClassName('google-material-icons VfPpkd-kBDsod W7A5Qb')
    for (let i=0; i<aboutAppButtons.length; i++){
      aboutAppButtons[i].click(); // have to open the about page to load the info
    }

    setTimeout ( function () {
      const title = document.querySelector('h1').textContent;
      var appVersion = document.querySelector("#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.HQdjr.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div > div.fysCi > div:nth-child(3) > div:nth-child(1) > div.reAt0").textContent;
      var requiredVersion = document.querySelector('#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.HQdjr.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div > div.fysCi > div:nth-child(3) > div:nth-child(3) > div.reAt0').textContent;
      if (requiredVersion.startsWith('Varies with device')) {
        for (let i=5; i<5+6; i++) { // check version and requirements for your linked google devices
          requiredVersion = "#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.HQdjr.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div > div.fysCi > div:nth-child(" + i + ") > div:nth-child(5) > div.reAt0";
          if (document.querySelector(requiredVersion)) {
            appVersion =  document.querySelector(requiredVersion.replace('div:nth-child(5) > div.reAt0', 'div:nth-child(2) > div.reAt0')).textContent;
            requiredVersion = document.querySelector(requiredVersion).textContent;
            break;
          }
        }
      }
      const desc = document.querySelector("#yDmH0d > div:nth-child(30) > div.VfPpkd-wzTsW > div > div > div > div > div.fysCi > div:nth-child(1)").innerText.replace(/\p{Emoji}/gu, '');
      var changelog = document.querySelector("#yDmH0d > c-wiz.SSPGKf.Czez9d > div > div > div.tU8Y5c > div.wkMJlb.YWi3ub > div > div.qZmL0 > div:nth-child(1) > c-wiz:nth-child(3) > section > div > div") ? document.querySelector("#yDmH0d > c-wiz.SSPGKf.Czez9d > div > div > div.tU8Y5c > div.wkMJlb.YWi3ub > div > div.qZmL0 > div:nth-child(1) > c-wiz:nth-child(3) > section > div > div").innerText : 'No changelog';
      if (changelog.startsWith('This app may share') || changelog.startsWith('No data shared')) changelog = document.querySelector("#yDmH0d > c-wiz.SSPGKf.Czez9d > div > div > div.tU8Y5c > div.wkMJlb.YWi3ub > div > div.qZmL0 > div:nth-child(1) > c-wiz:nth-child(5) > section > div > div") ? document.querySelector("#yDmH0d > c-wiz.SSPGKf.Czez9d > div > div > div.tU8Y5c > div.wkMJlb.YWi3ub > div > div.qZmL0 > div:nth-child(1) > c-wiz:nth-child(5) > section > div > div").innerText : 'No changelog';
      changelog = changelog.replace(/\p{Emoji}/gu, '');
      const firstLine = desc.split('\n')[0];
      const postDesc = desc.split('\n').slice(1).join('\n');
      const postTitle = `[b]${title} v${appVersion}[/b]`;
      const postRequirements = `[u]Requirements:[/u] ${requiredVersion}`;
      const postOverview = `[u]Overview:[/u] ${firstLine}`;
      const img = `YOU STILL HAVE TO PUT THE IMAGE\n[break]`;
      const modInfo = ''; //put mod info if you want
      const postChangelog = `[u]What's New:[/u]\n${changelog}`;
      const adsField = '[b]This app has no advertisements[/b]';
      const playstoreLink = `[u]More Info:[/u]\n[code]${window.location.href}[/code]`;
      const dlLinks = `[u]Download Instructions:[/u]\nUniversal\n\nMirror:\n\narmeabi-v7a\n\nMirror:\n\narm64-v8a\n\nMirror:\n\nx86\n\nMirror:\n\nx86_64\n\nMirror:\n`;
      const msg = 'Trouble downloading? Read [url=https://forum.mobilism.org/viewtopic.php?f=19&t=649944][b]This[/b][/url].';
      const fullInfo = `${postTitle}\n${postRequirements}\n${postOverview}\n\n${img}\n${postDesc}\n${modInfo}\n${postChangelog}\n\n${adsField}\n\n${playstoreLink}\n${dlLinks}\n${msg}`;

      if (fullInfo) {
        GM_setClipboard(fullInfo);
        alert('Copied info to clipboard.');
      } else {
        alert('Error; try increase the loading time in the script');
      }
    }, 2000) //loading time in milliseconds
  }

  getInfo();
})();
