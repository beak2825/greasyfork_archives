// ==UserScript==
// @name         Strava Global Heatmap TMS server link generator for JOSM
// @namespace    http://ursus.id.lv
// @version      0.5
// @description  Generates Strava Global Heatmap TMS server link for OpenStreetMap JOSM editor
// @author       UrSuS
// @match        *.strava.com/maps/global-heatmap*
// @icon         https://www.google.com/s2/favicons?domain=strava.com
// @grant        GM_cookie
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/425091/Strava%20Global%20Heatmap%20TMS%20server%20link%20generator%20for%20JOSM.user.js
// @updateURL https://update.greasyfork.org/scripts/425091/Strava%20Global%20Heatmap%20TMS%20server%20link%20generator%20for%20JOSM.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const specificHrefPartial = "/login?redirect";

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  waitForElm(`a[href*="${specificHrefPartial}"]`).then((elm) => {
    elm.click();
  });

  waitForElm('[data-key="my-routes"]').then((elm) => {
    addButton(getTMSlink);
  });

  function addButton(onclick, cssObj) {
    const oFindDiv = document.querySelectorAll('[data-key="my-routes"]');
    const oParentDiv = oFindDiv[0].parentNode;

    let oBtnTMSDiv = document.createElement("Div");
    oBtnTMSDiv.innerHTML =
      "<div><a target='_blank'><span>Get TMS Link for JOSM</span></a></div>";

    const oAElem = oBtnTMSDiv.getElementsByTagName("a")[0];

    oAElem.style.cssText =
      "background-color: #fc5200;color: #fff;border: 2px solid #da3400;border-radius: 16px;padding: 6px 10px; font-weight: 600;text-decoration: none;height: 36px;align-items: center;display: inline-flex;cursor: pointer;";
    oAElem.onclick = onclick;

    oParentDiv.appendChild(oBtnTMSDiv);
  }

  async function getCookies() {
    console.log("Start Fetching cookies");
    return new Promise((resolve) =>
      GM_cookie.list({ domain: ".strava.com" }, (cookies) => resolve(cookies))
    );
  }

  async function getTMSlink() {
    //Valid values for heatmap color: hot, blue, purple, gray, bluered, orange
    //Valid values for type of data: all, ride, run (walk, hike), water, winter.

    const oUrlParams = new URLSearchParams(window.location.search);
    // const aCookieNames = [
    //   "CloudFront-Policy",
    //   "CloudFront-Key-Pair-Id",
    //   "CloudFront-Signature",
    //   "CloudFront-Expires",
    // ];

    let sCookieString = "";
    const aCookies = await getCookies();
    const aForbiddenChars = [",", ":"];

    aCookies.forEach((mCookie) => {
      if (!aForbiddenChars.some(sChar => mCookie.value.includes(sChar))) {
        sCookieString += `${mCookie.name}=${mCookie.value};`;
      }
    });

    if (sCookieString !== "") {
      console.log("Paste URL");

      const urlText = `tms[3,15]:https://content-a.strava.com/identified/globalheat/${oUrlParams
        .get("sport")
        .toLowerCase()}/${oUrlParams
          .get("gColor")
          .toLowerCase()}/{zoom}/{x}/{y}.png{header(cookie,${sCookieString})}`;

      navigator.clipboard.writeText(urlText).then(
        () => {
          alert("TMS URL copied to clipboard!");
        },
        (oError) => {
          console.error("Error ", oError);
        }
      );
    } else {
      alert("Cookie is empty, please refresh and try again");
    }
  }
})();
