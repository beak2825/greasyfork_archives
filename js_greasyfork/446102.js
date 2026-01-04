// ==UserScript==
// @name         Virus Detector(outdated script Please get my malware site blocker)
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Get alerted when you are on a harmful website.
// @author       Thundercatcher
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446102/Virus%20Detector%28outdated%20script%20Please%20get%20my%20malware%20site%20blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446102/Virus%20Detector%28outdated%20script%20Please%20get%20my%20malware%20site%20blocker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    {writePromise = new Promise((res) =>
    setTimeout(() => {
document.write('<h3 style="text-align: center;">This website looks like it contains a virus. Please proceed back to <a href="https://www.google.com/">Google</a></h3>'); (`
      `)
         res();
    }, 250)
  );
}
})()