/* jshint esversion: 6 */
// ==UserScript==
// @name         MSPA link fixerer
// @version      1
// @description  Replaces MSPA indexed links to Homestuck with links to Homestuck.com.
// @author       EtchJetty
// @license MIT
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/909980
// @downloadURL https://update.greasyfork.org/scripts/444511/MSPA%20link%20fixerer.user.js
// @updateURL https://update.greasyfork.org/scripts/444511/MSPA%20link%20fixerer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  replaceLinks();

  // story6: 1900 (hs)
  // story5: 1892 (hs-beta)
  // story4: 218 (ps)
  // story3: n/a (midnight crew)
  // story2: 135 (bardquest)
  // story1: 1 (jb)

  function replaceLinks() {
    Array.from(document.getElementsByTagName("a")).forEach(function (a) {
      //  console.log(a.href);
      const regex = /(?:http.*mspaintadventures\.com\/.*|\?)s=\d.*p=(\d{1,6})/gm;
      const baseurl = `https://www.homestuck.com/`;
      const hssubst = baseurl + `story`;
      const hsbetasubst = baseurl + `beta`;
      const pssubst = baseurl + `problem-sleuth`;
      // const mcsubst = baseurl + `404`;
      const bqsubst = baseurl + `bard-quest`;
      const jbsubst = baseurl + `jailbreak`;

      // The substituted value will be contained in the result variable

      let m;

      const hrefex = a.href.toString().slice(a.href.toString().length - 4);
      if (hrefex.slice(0, -1) == "?s=") {
        //if this is just a story link, no page
        switch (parseInt(hrefex[hrefex.length - 1])) {
          case 6:
            a.href = hssubst;
            break;
          case 5:
            a.href = hsbetasubst;
            break;
          case 4:
            a.href = pssubst;
            break;
          case 3:
            a.href = "http://www.mspaintadventures.com/test_index.php?s=3"; // mc doesn't exist on homestuck.com as far as i know
            break;
          case 2:
            a.href = bqsubst;
            break;
          case 1:
            a.href = jbsubst;
            break;
        }
      } else {
        while ((m = regex.exec(a.href.toString())) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          var match = parseInt(m[1]); // get just the matched value
          switch (true) {
            case match > 1900:
              match = match - 1900;
              a.href = hssubst + "/" + match;
              break;

            case 1892 < match && match < 1900:
              match = match - 1892;
              a.href = hsbetasubst + "/" + match;
              break;

            case 218 < match && match < 1892:
              match = match - 218;
              a.href = pssubst + "/" + match;
              break;

            case 135 < match && match < 218:
              match = match - 135;
              a.href = bqsubst + "/" + match;
              break;

            case 1 < match && match < 135:
              match = match - 1;
              a.href = jbsubst + "/" + match;
              break;
          }
        }
      }
    });
  }
})();
