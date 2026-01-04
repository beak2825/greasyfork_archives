// ==UserScript==
// @name         [not working] pelisenhd.org Bypass
// @version      1.8
// @description  Bypass the link shortener
// @author       Rust1667
// @match        *://desbloquea.me/l.php?i=*
// @match        https://desbloquea.me/
// @match        *://desbloquea.me/r.php?l=*
// @match        *://desbloquea.me/s.php?i=*
// @match        *://hdpastes.com/?v=*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pelisenhd.org
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/486337/%5Bnot%20working%5D%20pelisenhdorg%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/486337/%5Bnot%20working%5D%20pelisenhdorg%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rot13(input) {
        return input.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    //DESBLOQUEA.ME PAGE
    if (window.location.hostname === 'desbloquea.me') {

      // 1 SET THE COOKIE
      if (window.location.href.includes("desbloquea.me/l.php?i=")) {
        var referrer = document.referrer;
        if (referrer.includes("pelisenhd.org")) {
          const cookieToSet = "P9w_HDwe*651";
          document.cookie = `${cookieToSet} = Wn275; path=/`;
        } else {
          alert("You don't seem to be coming from pelisenhd.org (Referrer domain is not pelisenhd.org). Bypass may not work.");
        }

      // 2 Auto-click the button and transform popup into redirect
      } else if (window.location.href === "https://desbloquea.me/") {
        // Function to wait for a specified duration
        function wait(delay) {
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        // Function to wait until an element is loaded
        function waitForElement(selector, callback) {
            var element = document.querySelector(selector);
            if(element) {
                callback(element);
            } else {
                setTimeout(function() {
                    waitForElement(selector, callback);
                }, 500);
            }
        }

        // Wait for 1 second before proceeding
        wait(1000).then(() => {
            // Wait for the button to be loaded
            waitForElement('input#contador.button.button-purple', function(button) {
                // Click the button
                button.click();

            });
        });

        // Intercepting window.open method (convert popup into redirect)
        const open = window.open;
        window.open = function(url, target, features) {
            window.location.href = url;
            return window;
        };

      // 3 BYPASS THE INTERMEDIATE REDIRECT THAT HAPPENS AFTER CLICKING THE BUTTON ONCE YOU HAVE THE RIGHT COOKIE
      } else if (window.location.href.includes("desbloquea.me/r.php?l=")) {
        const urlParams = new URLSearchParams(window.location.search);
        const paramL = urlParams.get('l');
        if (paramL) {
            const decodedURL = decodeURIComponent(rot13(atob(paramL)));
            //alert("decoded:\n" + decodedURL);
            window.location.href = decodedURL;
        }

      // 4 Redundancy for the shortlinks in hdpastes.com, in case the in-page decoding doesnt work
      } else if (window.location.href.includes("desbloquea.me/s.php?i=")) {
        var currentURL = window.location.href;
        var encodedURL = currentURL.split('?i=')[1]
        var decodedURL = rot13(atob(atob(atob(atob(atob(encodedURL))))));
        var cleanURL = decodedURL.split('|')[0];
        window.location.replace(cleanURL);
      }

    }

    // HDPASTES.COM PAGE
    // 3 REPLACE LINK SHORTENERS IN THE DESTINATION PASTEBIN
    function replaceLinks() {
        const links = document.querySelectorAll('a[href^="https://hdpastes.com/go.php?out="]');
        links.forEach(link => {
            const encodedURL = link.getAttribute('href').split('?out=')[1];
            const decodedURL = decodeURIComponent(rot13(atob(encodedURL)));
            link.setAttribute('href', decodedURL);
        });
    }

    if (window.location.hostname === 'hdpastes.com' && window.location.href.includes("https://hdpastes.com/?v=")) {
      document.addEventListener('DOMContentLoaded', function() {
        replaceLinks();
      });

      // Mutation observer to handle dynamic content
      const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
              if (mutation.type === 'childList') {
                  replaceLinks();
              }
          });
      });
      observer.observe(document.body, { childList: true, subtree: true });

    }

})();
