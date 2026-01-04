// ==UserScript==
// @name         iOSMirror.cc Cookie Fetcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch and cache cookies intelligently for iOSMirror.cc with retries and verification.
// @author       Dev
// @match        *://iosmirror.cc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @license      MIT
// @grant        GM_getValue
// @grant        GM_notification
// @connect      iosmirror.cc
// @connect      userverify.netmirror.app
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521173/iOSMirrorcc%20Cookie%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/521173/iOSMirrorcc%20Cookie%20Fetcher.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const COOKIE_CACHE_KEY = "nfCookie";
  const COOKIE_TIME_KEY = "nfCookieTime";
  const COOKIE_EXPIRY_MS = 79200000; // 22 hours
  const VERIFY_TIMEOUT_MS = 25000;
  const MAX_RETRY_ATTEMPTS = 50;

  /**
   * Checks if a valid cached cookie is available.
   */
  async function getCachedCookie() {
    const cookieTime = await GM_getValue(COOKIE_TIME_KEY, null);
    if (cookieTime) {
      const timeDiff = new Date().getTime() - parseInt(cookieTime);
      if (timeDiff < COOKIE_EXPIRY_MS) {
        const cachedCookie = await GM_getValue(COOKIE_CACHE_KEY, null);
        if (cachedCookie) {
          console.log("Cookie retrieved from cache:", cachedCookie);
          return cachedCookie;
        }
      }
    }
    return null;
  }

  /**
   * Saves the cookie and its timestamp to cache.
   */
  async function cacheCookie(cookie) {
    await GM_setValue(COOKIE_CACHE_KEY, cookie);
    await GM_setValue(COOKIE_TIME_KEY, new Date().getTime().toString());
    console.log("Cookie cached successfully:", cookie);
  }

  /**
   * Performs the preliminary verification to prepare for cookie retrieval.
   */
  async function performPreliminaryVerification(addhash) {
    try {
      await fetch(`https://userverify.netmirror.app/verify?vhfd=${addhash}&a=y&t=${Math.random()}`, {
        method: "GET",
        credentials: "omit",
      });
      console.log("Preliminary verification completed.");
    } catch (error) {
      console.warn("Preliminary verification failed:", error);
    }
  }

  /**
   * Fetches the fresh cookie by interacting with the verification endpoint.
   */
  async function fetchFreshCookie() {
    console.log("Fetching fresh cookie...");

    // Step 1: Fetch the home page to extract addhash.
    const homeResponse = await fetch("https://iosmirror.cc/home");
    const homeText = await homeResponse.text();
    const addhashMatch = homeText.match(/data-addhash="(.*?)"/);

    if (!addhashMatch) {
      throw new Error("Unable to extract addhash from the homepage.");
    }
    const addhash = addhashMatch[1];
    console.log("Extracted addhash:", addhash);

    // Step 2: Perform preliminary verification.
    await performPreliminaryVerification(addhash);

    // Step 3: Verify and retrieve the cookie with retry mechanism.
    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      console.log(`Verification attempt ${attempt}`);
      try {
        const formData = new URLSearchParams();
        formData.append("verify", addhash);

        const verifyResponse = await fetch("https://iosmirror.cc/verify2.php", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "omit",
        });

        const verifyJson = await verifyResponse.json();
        console.log("Verification response:", verifyJson);

        if (verifyJson.statusup === "All Done") {
          const cookieHeader = verifyResponse.headers.get("set-cookie");
          if (cookieHeader) {
            const cookie = cookieHeader.split(";")[0];
            await cacheCookie(cookie);
            console.log("Cookie successfully fetched and cached:", cookie);
            return cookie;
          }
        }
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
        if (attempt === MAX_RETRY_ATTEMPTS) {
          throw new Error("Failed to fetch cookie after maximum retries.");
        }
      }

      // Delay between retries
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  /**
   * Main function to get the cookie.
   */
  async function fetchCookie() {
    // Step 1: Check for a cached cookie.
    const cachedCookie = await getCachedCookie();
    if (cachedCookie) {
      return cachedCookie;
    }

    // Step 2: Fetch a fresh cookie if no valid cached cookie is found.
    return await fetchFreshCookie();
  }

  // Script execution starts here.
  fetchCookie()
    .then((cookie) => {
      console.log("Final Cookie:", cookie);
      GM_notification({
        text: "Cookie fetched successfully.",
        title: "iOSMirror Cookie Fetcher",
        timeout: 5000,
      });
    })
    .catch((error) => {
      console.error("Error fetching cookie:", error);
      GM_notification({
        text: "Failed to fetch cookie.",
        title: "iOSMirror Cookie Fetcher",
        timeout: 5000,
      });
    });
})();
