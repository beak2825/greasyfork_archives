// ==UserScript==
// @name            EpochPwn
// @namespace       The Epoch Times - Ads & Paywall Removal
// @version         1.0
// @description     Paywall pwn for Epoch Times
// @author          asheroto + some changes from Anon
// @license         MIT
// @match           https://www.theepochtimes.com/*
// @icon            https://www.theepochtimes.com/favicon.ico
// @grant           GM_addElement
// @grant           GM_log
// @downloadURL https://update.greasyfork.org/scripts/443902/EpochPwn.user.js
// @updateURL https://update.greasyfork.org/scripts/443902/EpochPwn.meta.js
// ==/UserScript==

(function () {
  // Remove via CSS
  let css = `
        #landing-page { display: none; }
        .home-wall { display: none; }
        #main { overflow: unset !important; height: unset !important; }
        body { overflow: unset !important; }
        #main > div { border-top: unset; margin-top: 0px; }
        .right_col.noprint > div { margin: unset !important; }
        .top_ad { display: none; }
        #ad_right_top_300x250_1 { display: none; }
        .login_wrapper { display: none; }
        #partnership { display: none; }
        #footer { display: block !important; }
    `;
  let head = document.head || document.getElementsByTagName("head")[0], style = document.createElement("style");
  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
 
  // Run tag removal
  const blacklist = ["doubleclick.", "amazon-adsystem", "adnxs", "ads.", "modal__overlay"];
  const tags = ["script", "iframe", "div"];
  let repeat = setInterval(function ()
  { 
    tags.forEach(function (item)
    {
      document.getElementsByTagName(item).forEach(function (src)
      {
        blacklist.forEach(function (b)
        {
          var isDel = false;
          
          if (src.nodeName == "DIV" && src.classList.contains(b)) isDel = true;
          else if (src.nodeName != "DIV" && src.src.includes(b)) isDel = true;
          
          if (isDel && src)
          {
            console.log("----- [EpochPwn] Removing " + src.nodeName + ": " + src.cloneNode().outerHTML);
            src.parentNode.removeChild(src);
          }
        });
      });
    });
  }, 500);
 
  // Clear tag removal after 10 seconds
  setTimeout(function ()
  {
    clearInterval(repeat);
  }, 10000);
})();