// ==UserScript==
// @name         hacks-Reverb
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Auto Seacher
// @author       You
// @match        https://www.bing.com/*=hacks-*
// @match        https://www.bing.com/search?FORM=U523DF&PC=U523&q=hacks-*
// @match        https://www.bing.com/search?q=hacks-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465972/hacks-Reverb.user.js
// @updateURL https://update.greasyfork.org/scripts/465972/hacks-Reverb.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
setInterval(()=>{
fetch("https://www.bing.com/rewardsapp/reportActivity?IG=B616D3E0928B4F90B9C768AAFA4511FF&IID=SERP.5059&FORM=U523DF&PC=U523&q=hacks-"+Math.random(), {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-arch": "\"arm\"",
    "sec-ch-ua-bitness": "\"64\"",
    "sec-ch-ua-full-version": "\"112.0.5615.137\"",
    "sec-ch-ua-full-version-list": "\"Chromium\";v=\"112.0.5615.137\", \"Google Chrome\";v=\"112.0.5615.137\", \"Not:A-Brand\";v=\"99.0.0.0\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-ch-ua-platform-version": "\"13.3.1\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.bing.com/search?FORM=U523DF&PC=U523&q=hacks-"+Math.random(),
  "referrerPolicy": "origin-when-cross-origin",
  "body": "url=https%3A//www.bing.com/search%3FFORM%3DU523DF%26PC%3DU523%26q%3Dhacks-"+Math.random()+"&V=web",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
setTimeout(()=>{
fetch("https://www.bing.com/rewardsapp/reportActivity?FORM=U523DF&PC=U523&q=hacks-"+Math.random(), {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-arch": "\"\"",
    "sec-ch-ua-bitness": "\"64\"",
    "sec-ch-ua-full-version": "\"112.0.5615.137\"",
    "sec-ch-ua-full-version-list": "\"Chromium\";v=\"112.0.5615.137\", \"Google Chrome\";v=\"112.0.5615.137\", \"Not:A-Brand\";v=\"99.0.0.0\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-model": "\"Nexus 5\"",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-ch-ua-platform-version": "\"6.0\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.bing.com/search?FORM=U523DF&PC=U523&q=hacks-"+Math.random(),
  "referrerPolicy": "origin-when-cross-origin",
  "body": "url=https%3A//www.bing.com/search%3FFORM%3DU523DF%26PC%3DU523%26q%3Dhacks-"+Math.random()+"&V=web",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
},500)
},1000)
})();