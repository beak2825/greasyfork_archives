// ==UserScript==
// @name         Bypass ArabSeed
// @name:ar      تخطي عرب سيد
// @namespace    Violentmonkey Scripts
// @version      2.4.5
// @description  Automatically bypass the countdown and show the download link
// @description:ar هذا السكربت مخصص لتحسين تجربتك على موقع عرب سيد من خلال تجاوز العراقيل المختلفة مثل مؤقت العد التنازلي، النوافذ المنبثقة، التحويلات المزيفة، وفتح صفحة التحميل مباشرةً. استمتع بتجربة مشاهدة سلسة دون انقطاع!
// @author       Ezio Auditore
// @license      MIT
// @icon         https://i.imgur.com/purcqbc.png
// @match        https://m.gameshop4u.com/*
// @match        https://m.gamehub.cam/*
// @match        https://adding.quest/*
// @match        https://zplay.gamezone.cam/*
// @match        https://gamestation.cam/*
// @match        https://gplay.gameplanet.cam/*
// @match        https://tplay.techplanet.cam/*
// @match        https://eplay2.gameplanet.cam/*
// @match        https://plg7.reviewpalace.net/*
// @match        https://tplay2.techplanet.cam/*
// @match        https://migration.cam/*
// @match        https://m.hegra.cam/*
// @match        https://m.regenzi.site/*
// @match        https://m.monafes.site/*
// @match        https://m.reviewpalace.net/*
// @match        https://m.techland.live/*
// @match        https://forgee.xyz/*
// @match        https://m.forgee.xyz/*
// @match        https://kalosha.site/*
// @match        https://reviewpalace.net/*
// @match        https://jurbana.site/*
// @match        https://hawsa.site/*
// @match        https://gamevault.cam/*
// @match        https://safary.site/*
// @match        https://logenzi.site/*
// @match        https://maftou7.site/*
// @match        https://mar3a.site/*
// @match        https://be7alat.site/*
// @match        https://mastaba.site/*
// @match        https://gamezone.cam/*
// @match        https://robou3.site/*
// @match        https://mar3a.site/*
// @match        https://dl4all.online/*
// @match        https://cheapou.site/*
// @match        https://hegry.site/*
// @match        https://playarena.cam/*
// @match        https://moshakes.site/*
// @match        https://joyarcade.cam/*
// @match        https://gameflare.cam/*
// @match        https://shallal.site/*
// @match        https://marcmello.site/*
// @match        https://mal3oub.site/*
// @match        https://shabory.site/*
// @match        https://marshoush.site/*
// @match        https://ka3boly.site/*
// @match        https://muhager.site/*
// @match        https://ofreok.online/*
// @match        https://ofre15.online/*
// @match        https://a.asd.homes/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527229/Bypass%20ArabSeed.user.js
// @updateURL https://update.greasyfork.org/scripts/527229/Bypass%20ArabSeed.meta.js
// ==/UserScript==


/**
 * Merged and Optimized Script for URL Normalization, Ad Blocking, and Download Button Modification
 *
 * This script performs the following tasks:
 * 1. Overrides window.open to block unwanted domains.
 * 2. Normalizes the current URL by appending domain-specific parameters.
 * 3. Skips meta-refresh redirects.
 * 4. Hides countdown timers and reveals the primary download button.
 * 5. Observes dynamic DOM changes to block unwanted redirects and ads.
 * 6. Modifies the download button to directly redirect to MP4 files, with specific handling for ofreok.online.
 *
 * The code is organized with professional inline comments and JSDoc-style blocks
 * for ease of understanding, extending, and updating.
 */

(function () {
  "use strict";

  // Log initialization with the current hostname.
  console.log("Script initialized on:", window.location.hostname);

  /*****************************************************
   * Anti-Inspection / UnGrabber Bypass               *
   *****************************************************/
  Object.defineProperty(window, "mdpUnGrabber", { value: {}, writable: false });
  Object.defineProperty(window, "UnGrabber", {
    value: function () {
      return { init: function () {} };
    },
    writable: false,
  });

  /*****************************************************
   * 1. Override window.open to Block Unwanted Domains *
   *****************************************************/
  const blockedDomainsForWindowOpen = [
    "videovils.click",
    "href.li",
    "aabroishere.website",
    "fulvideozrt.click",
    "href.li",
    "pub-9c4ec7f3f95c448b85e464d2b533aac1.r2.dev",
    "ntryiwl.click",
  ];
  const originalWindowOpen = window.open;
  window.open = function (url, name, features) {
    try {
      const parsedUrl = new URL(url, window.location.href);
      if (
        blockedDomainsForWindowOpen.some((domain) =>
          parsedUrl.hostname.includes(domain)
        )
      ) {
        console.log("Blocked window.open call to:", url);
        return null;
      }
    } catch (e) {
      console.error("Error parsing URL in window.open override:", e);
    }
    return originalWindowOpen.call(window, url, name, features);
  };

  /*****************************************************
   * 2. Utility & Helper Functions                     *
   *****************************************************/

  /**
   * Placeholder for applying custom DOM filters.
   * Extend this function to add any custom filtering logic as needed.
   */
  function applyCustomFilters() {
    // TODO: Implement custom filtering logic if required.
  }

  /**
   * Force-reveals hidden content and removes fake elements for ofreok.online
   * Priority: 1 (Executes immediately on ofreok.online)
   */
  function forceRevealContent() {
    // Reveal hidden download links
    const realDownloadLinks = [
      document.getElementById("btn"),
      document.querySelector('a[href*=".mp4"]'),
      document.querySelector('a[href*="/direct/"]'),
    ].filter(Boolean);

    realDownloadLinks.forEach((link) => {
      link.style.display = "block";
      link.style.visibility = "visible";
    });

    // Remove fake elements
    const elementsToRemove = [
      "#countdown",
      "#downloadButton",
      ".modalDialog",
      "#modal",
    ].join(", ");
    document.querySelectorAll(elementsToRemove).forEach((el) => el.remove());

    // Force-show all hidden elements
    document.querySelectorAll('[style*="display: none"]').forEach((el) => {
      el.style.display = "block !important";
      el.style.visibility = "visible !important";
    });
  }

  /**
   * Disables common anti-adblock detectors for ofreok.online
   * Priority: 2 (Runs after content reveal on ofreok.online)
   */
  function disableAntiBypass() {
    // Kill countdown timers
    if (typeof countdown !== "undefined") {
      countdown.start = () => {};
      countdown.stop = () => {};
      if (countdown.container) {
        countdown.container.style.display = "none";
      }
    }

    // Block common detection scripts
    const blockedPatterns = [
      /adblock/i,
      /blockadblock/i,
      /adsbygoogle/i,
      /pagead2\.googlesyndication/i,
    ];
    Object.defineProperty(window, "adsbygoogle", {
      value: [],
      writable: false,
    });

    // Disable mutation observers (specific to page scripts)
    if (typeof MutationObserver !== "undefined") {
      MutationObserver.prototype.observe = function () {
        console.log("[Bypass] MutationObserver disabled");
      };
    }
  }

  /**
   * Observer to maintain bypass state for ofreok.online
   * Priority: Persistent (Runs continuously on ofreok.online)
   */
  function createDomGuard() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Re-apply bypass on new elements
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            if (node.matches("#countdown, .modalDialog")) {
              node.remove();
            }
            node
              .querySelectorAll?.('[style*="display: none"]')
              .forEach((el) => {
                el.style.display = "block";
              });
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  // Immediate execution for ofreok.online
  if (["ofreok.online", "ofre15.online"].includes(window.location.hostname)) {
    forceRevealContent();
    disableAntiBypass();
    createDomGuard();

    // Add the new functionality for ofreok.online
    function showRealDownload() {
      var realLink = document.querySelector("a#btn");
      if (realLink) {
        realLink.style.display = "block"; // Make the real link visible
      }
    }

    function hideFakeElements() {
      var fakeForm = document.querySelector("form#btn");
      var clickMeDiv = document.querySelector("div#clickme");
      if (fakeForm) {
        fakeForm.style.display = "none"; // Hide the fake form
      }
      if (clickMeDiv) {
        clickMeDiv.style.display = "none"; // Hide the clickme div
      }
    }

    // Check if the real link is already present in the DOM
    if (document.querySelector("a#btn")) {
      // If the real link exists, show it and hide fake elements
      showRealDownload();
      hideFakeElements();
    } else {
      // If the real link isn't present, simulate form submission
      var fakeForm = document.querySelector("form#btn");
      if (fakeForm) {
        console.log("Submitting fake form to reveal real content");
        fakeForm.submit(); // Submit the form to load the real link
      }
    }

    // Reinforce bypass every 2 seconds
    setInterval(() => {
      forceRevealContent();
      disableAntiBypass();
      showRealDownload();
      hideFakeElements();
    }, 2000);
  }

  /**
   * Normalizes the current URL by appending specific parameters based on the domain.
   *
   * It checks for conditions such as external download button links and applies
   * domain-specific modifications. If a redirection occurs, the function returns true.
   *
   * @returns {boolean} True if a redirection occurred, otherwise false.
   */
  function normalizeUrl() {
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;
    const urlPattern = /\/category\/.+\?r=\d+$/; // Matches URLs like /category/... with trailing ?r=digits

    // Check if the download button (#btn) exists and its href points to an external file host.
    const downloadBtn = document.getElementById("btn");
    if (downloadBtn) {
      const externalHosts = [
        "turbobit.net",
        "up-4ever.net",
        "frdl.io",
        "filespayouts.com",
        "bigwarp.io",
        "nitroflare.com",
      ];
      if (externalHosts.some((host) => downloadBtn.href.includes(host))) {
        console.log(
          "Download button points to external file host; skipping URL normalization."
        );
        return false;
      }
    }

    // Define domain flags for internal handling (unchanged from original)
    const isMonafesSite = hostname === "m.monafes.site";
    const isGamehubCam = hostname === "m.gamehub.cam";
    const isTechlandLive = hostname === "m.techland.live";
    const isReviewpalaceNet = hostname === "m.reviewpalace.net";
    const isForgeeXyz =
      hostname === "forgee.xyz" || hostname === "m.forgee.xyz";
    const isKaloshaSite = hostname === "kalosha.site";
    const isReviewpalaceNetDesktop = hostname === "reviewpalace.net";
    const isJurbanaSite = hostname === "jurbana.site";
    const isHawsaSite = hostname === "hawsa.site";
    const isGamevaultCam = hostname === "gamevault.cam";
    const isSafarySite = hostname === "safary.site";
    const isLogenziSite = hostname === "logenzi.site";
    const isMaftou7Site = hostname === "maftou7.site";
    const isMar3aSite = hostname === "mar3a.site";
    const isBe7alatSite = hostname === "be7alat.site";
    const isMastabaSite = hostname === "mastaba.site";
    const isGamezoneCam = hostname === "gamezone.cam";
    const isRobou3Site = hostname === "robou3.site";
    const isDl4allOnline = hostname === "dl4all.online";
    const isCheapouSite = hostname === "cheapou.site";
    const isHegrySite = hostname === "hegry.site";
    const isPlayarenaCam = hostname === "playarena.cam";
    const isMoshakesSite = hostname === "moshakes.site";
    const isJoyarcadeCam = hostname === "joyarcade.cam";
    const isGameflareCam = hostname === "gameflare.cam";
    const isShallalSite = hostname === "shallal.site";
    const isMarcmelloSite = hostname === "marcmello.site";
    const isMal3oubSite = hostname === "mal3oub.site";
    const isShaborySite = hostname === "shabory.site";
    const isMarshoushSite = hostname === "marshoush.site";
    const isKa3bolySite = hostname === "ka3boly.site";
    const isMuhagerSite = hostname === "muhager.site";
    const isOfreokOnline = hostname === "ofreok.online";
    const isOfre15Online = hostname === "ofre15.online";

    // Special handling for Kalosha.site (unchanged)
    if (isKaloshaSite) {
      const hasGameParam = currentUrl.includes("game=");
      const hasGmzParam = currentUrl.includes("gmz=1");
      const hasDgameParam = currentUrl.includes("dgame=");
      if (hasGameParam && !hasGmzParam && !hasDgameParam) {
        const separator = currentUrl.includes("?") ? "&" : "?";
        window.location.replace(currentUrl + separator + "gmz=1");
        return true;
      }
      return false;
    }

    // Special bypass for reviewpalace.net desktop version (unchanged)
    if (isReviewpalaceNetDesktop) {
      const pstRegex = /[?&]pst=\d+$/;
      if (pstRegex.test(currentUrl) && !/&gmz=1/.test(currentUrl)) {
        const separator = currentUrl.includes("?") ? "&" : "?";
        window.location.replace(currentUrl + separator + "gmz=1");
        return true;
      }
    }

    // Special handling for jurbana.site (unchanged)
    if (isJurbanaSite) {
      const gameRegex = /[?&]game=\d+$/;
      if (gameRegex.test(currentUrl) && !currentUrl.includes("gmz=1")) {
        const separator = currentUrl.includes("?") ? "&" : "?";
        window.location.replace(currentUrl + separator + "gmz=1");
        return true;
      }
    }

    // Special handling for a.asd.homes
    if (
      hostname === "a.asd.homes" &&
      currentUrl.includes("/category/downloadz/") &&
      currentUrl.includes("r=") &&
      !currentUrl.includes("asd4a=1")
    ) {
      const separator = currentUrl.includes("?") ? "&" : "?";
      // Add both asd4a=1 and asd7b=1 if not present
      let newUrl = currentUrl + separator + "asd4a=1";
      if (!currentUrl.includes("asd7b=1")) {
        newUrl += "&asd7b=1";
      }

      if (!currentUrl.includes("asd7h=1")) {
        newUrl += "&asd7h=1";
      }

      if (!currentUrl.includes("asd7m=1")) {
        newUrl += "&asd7m=1";
      }
      
      if (!currentUrl.includes("asd7n=1")) {
        newUrl += "asd7n=1";
      }

      window.location.replace(newUrl);
      return true;
    }

    // List of bypass domains (ofreok.online already included)
    const bypassDomains = [
      "hawsa.site",
      "gamevault.cam",
      "safary.site",
      "logenzi.site",
      "maftou7.site",
      "mar3a.site",
      "be7alat.site",
      "mastaba.site",
      "gamezone.cam",
      "robou3.site",
      "dl4all.online",
      "cheapou.site",
      "hegry.site",
      "playarena.cam",
      "moshakes.site",
      "joyarcade.cam",
      "gameflare.cam",
      "shallal.site",
      "marcmello.site",
      "mal3oub.site",
      "shabory.site",
      "marshoush.site",
      "ka3boly.site",
      "muhager.site",
      "ofreok.online",
      "ofre15.online",
    ];

    // Apply tfs=1 bypass for bypassDomains (unchanged)
    if (
      bypassDomains.includes(hostname) &&
      window.location.search.includes("r=") &&
      !window.location.search.includes("tfs=1")
    ) {
      const separator = window.location.href.includes("?") ? "&" : "?";
      window.location.replace(window.location.href + separator + "tfs=1");
      return true;
    }

    // Apply domain-specific normalization (unchanged)
    if (urlPattern.test(currentUrl)) {
      if (isMonafesSite && !/&t=1&mon=1/.test(currentUrl)) {
        window.location.replace(`${currentUrl}&t=1&mon=1`);
        return true;
      } else if (isGamehubCam) {
        // Custom logic: if r= is found, add mon=1 after it (if not already present)
        if (/r=\d+/.test(currentUrl) && !/mon=1/.test(currentUrl)) {
          // Insert mon=1 after the r=number
          const updatedUrl = currentUrl.replace(/(r=\d+)/, "$1&mon=1");
          window.location.replace(updatedUrl);
          return true;
        }
        return false;
      } else if (isTechlandLive && !/&t=1&etu=1/.test(currentUrl)) {
        window.location.replace(`${currentUrl}&t=1&etu=1`);
        return true;
      } else if (isReviewpalaceNet && !/&t=1&tuh=1/.test(currentUrl)) {
        window.location.replace(`${currentUrl}&t=1&tuh=1`);
        return true;
      } else if (isForgeeXyz) {
        let updatedUrl = currentUrl;
        if (!/&mon=1/.test(currentUrl)) {
          updatedUrl += "&mon=1";
        }
        if (hostname === "m.forgee.xyz" && !/&monz=1/.test(currentUrl)) {
          updatedUrl += "&monz=1";
        }
        if (updatedUrl !== currentUrl) {
          window.location.replace(updatedUrl);
          return true;
        }
      } else if (!/&t=1/.test(currentUrl)) {
        window.location.replace(`${currentUrl}&t=1`);
        return true;
      }
    }
    return false;
  }

  /**
   * Detects and handles meta-refresh redirects by scanning for meta tags.
   */
  function skipMetaRedirect() {
    try {
      const metaRefresh = document.querySelector('meta[http-equiv="Refresh"]');
      if (metaRefresh) {
        const content = metaRefresh.getAttribute("content");
        const redirectUrl = content.split("URL=")[1];
        if (redirectUrl) {
          console.log("Meta refresh detected. Redirecting to:", redirectUrl);
          window.location.replace(redirectUrl);
        }
      }
    } catch (error) {
      console.error("Error in skipMetaRedirect:", error);
    }
  }

  /**
   * Hides countdown timers and ensures the primary download button is visible.
   */
  function skipCountdownsAndButtons() {
    try {
      const countdown = document.getElementById("countdown");
      const downloadButton = document.getElementById("btn");
      if (countdown) {
        countdown.style.display = "none";
      }
      if (downloadButton) {
        downloadButton.style.display = "block";
      }
    } catch (error) {
      console.error("Error in skipCountdownsAndButtons:", error);
    }
  }

  /**
   * Observes dynamic DOM changes to reapply custom filters and block unwanted redirects.
   */
  function handleDynamicRedirectsAndAds() {
    const blockedDomainsForAds = [
      "fulvideozrt.click",
      "videovils.click",
      "another-ad-domain.com",
      "yet-another-ad-domain.com",
      "href.li",
      "pub-9c4ec7f3f95c448b85e464d2b533aac1.r2.dev",
      "ntryiwl.click",
    ];

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          applyCustomFilters();
          const links = document.querySelectorAll("a");
          links.forEach((link) => {
            const href = link.getAttribute("href");
            if (
              href &&
              blockedDomainsForAds.some((domain) => href.includes(domain))
            ) {
              link.removeAttribute("href");
              console.log("Blocked redirect to:", href);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
  }

  /*****************************************************
   * 3. Main Execution Flow                            *
   *****************************************************/

  /**
   * Main function to initialize the script after the page is fully loaded.
   */
  function initScript() {
    if (normalizeUrl()) {
      return;
    }

    skipMetaRedirect();
    skipCountdownsAndButtons();

    const dynamicAdDomains = ["asd.quest", "asd.rest", "asd.show"];
    if (dynamicAdDomains.includes(window.location.hostname)) {
      handleDynamicRedirectsAndAds();
      const filterObserver = new MutationObserver((mutations) => {
        mutations.forEach(() => applyCustomFilters());
      });
      filterObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    /*********************************************
     * 4. Download Button Modification            *
     *********************************************/
    if (["ofreok.online", "ofre15.online"].includes(window.location.hostname)) {
      // Specific handling for ofreok.online
      forceRevealContent();
      disableAntiBypass();

      // Enhanced download button handler for ofreok.online
      document.querySelectorAll("a, button").forEach((element) => {
        if (/(download|تحميل)/i.test(element.textContent)) {
          element.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              const directLink =
                document.querySelector('a[href*=".mp4"]')?.href ||
                document.querySelector("video")?.src;
              if (directLink) {
                console.log("Redirecting to direct link:", directLink);
                window.location.href = directLink;
              }
            },
            true
          );
        }
      });
    } else {
      // General handling for other domains
      let downloadButton = document.querySelector(
        'a.download-button, button.download-button, a[href*="movie="]'
      );
      if (!downloadButton) {
        downloadButton = Array.from(
          document.querySelectorAll("a, button")
        ).find((el) => /download/i.test(el.textContent));
      }
      if (downloadButton) {
        console.log("Download button found. Attaching click interceptor.");
        downloadButton.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            let mp4Link = document.querySelector('a[href$=".mp4"]');
            if (!mp4Link) {
              const allMp4Links = document.querySelectorAll('a[href*=".mp4"]');
              if (allMp4Links.length > 0) {
                mp4Link = allMp4Links[0];
              }
            }

            if (mp4Link) {
              console.log("Redirecting to MP4:", mp4Link.href);
              window.location.href = mp4Link.href;
            } else {
              console.log("No MP4 link found. Initiating backup detection...");
              const videoElement = document.querySelector("video");
              if (videoElement && videoElement.src) {
                window.location.href = videoElement.src;
              }
            }
          },
          true
        );
      }
    }
  }

  // Wait for DOMContentLoaded or document-start to initialize the script as early as possible.
  function initScriptWrapper() {
    try {
      initScript();
    } catch (e) {
      console.error("Error in initScript:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScriptWrapper);
  } else {
    initScriptWrapper();
  }
})();
