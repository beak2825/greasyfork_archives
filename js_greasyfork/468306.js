// ==UserScript==
// @name         GoLocale
// @namespace    https://github.com/tonioriol/userscripts
// @version      0.4.1
// @description  Automatically redirects URLs to their preferred language equivalents
// @author       Toni Oriol
// @match        *://*/*
// @icon         data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%234A90E2%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z%22/%3E%3C/svg%3E
// @grant        GM.getValue
// @grant        GM.setValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/468306/GoLocale.user.js
// @updateURL https://update.greasyfork.org/scripts/468306/GoLocale.meta.js
// ==/UserScript==

// Configuration groups
const LANGUAGE_CONFIG = {
  targetLang: "ca",
  altLang: "va"
};

const DETECTION_CONFIG = {
  urlParams: ["lang", "ln", "hl"]
};


// Utility functions
const getBaseDomain = (hostname) => {
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[0].length >= 2 && parts[0].length <= 3) {
    const possibleLangCode = parts[0].toLowerCase();
    if (/^[a-z]{2,3}$/.test(possibleLangCode)) {
      return parts.slice(1).join('.');
    }
  }
  return hostname;
};

const getStorageKey = (domain, type) => `golocale_${type}_${getBaseDomain(domain)}`;

const notify = (message, buttonText, callback) => {
  document.getElementById('golocale-notify')?.remove();
  
  const notification = document.createElement('div');
  notification.id = 'golocale-notify';
  notification.innerHTML = `
    <div
      style="position: fixed; top: 10px; right: 10px; z-index: 999999; padding: 12px 12px 12px 32px; background: #333; color: white; border-radius: 4px; font: 14px sans-serif; ${!buttonText ? 'cursor: pointer;' : ''}"
      ${!buttonText ? 'onclick="this.parentElement.remove()"' : ''}>
      <button
        style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; background: #666; color: white; border: none; border-radius: 0; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;"
        onclick="this.parentElement.parentElement.remove()">
        ×
      </button>
      <span>${message}</span>
      ${buttonText ? `
        <button
          class="golocale-action-btn"
          style="margin-left: 8px; padding: 4px 8px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">
          ${buttonText}
        </button>
      ` : ''}
    </div>
  `;
  
  // Add event listener for action button
  if (buttonText && callback) {
    const actionBtn = notification.querySelector('.golocale-action-btn');
    actionBtn.onclick = () => {
      notification.remove();
      callback();
    };
  }
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove?.(), 30000);
};

const isTargetLanguage = (html) => {
  const targetLangs = [LANGUAGE_CONFIG.targetLang, LANGUAGE_CONFIG.altLang].filter(Boolean);
  console.log("[GoLocale] Checking if page is in target languages:", targetLangs);

  // Check HTML lang attribute first
  const langAttr = html.match(/<html[^>]*lang=["']([^"']*)/i);
  const lang = langAttr?.[1]?.toLowerCase();
  console.log("[GoLocale] HTML lang attribute found:", lang);

  const langCode = lang?.split("-")[0];
  if (targetLangs.includes(lang) || targetLangs.includes(langCode)) {
    console.log("[GoLocale] Page is already in target language (HTML attribute)");
    return true;
  }

  if (lang && !targetLangs.includes(langCode)) {
    console.log("[GoLocale] HTML lang attribute indicates different language, not using franc detection");
    return false;
  }

  // Use franc detection as fallback
  const detectedLang = francDetect(html);
  console.log("[GoLocale] Franc detected language code:", detectedLang);

  const mappedLang = iso6393To1[detectedLang];
  console.log("[GoLocale] Mapped to 2-letter code:", mappedLang);

  if (targetLangs.includes(mappedLang)) {
    console.log("[GoLocale] Page is in target language (detected by franc)");
    return true;
  }

  console.log("[GoLocale] Page is NOT in target language");
  return false;
};

const fetchAndCheckLanguage = async (url) => {
  console.log("[GoLocale] Testing URL candidate:", url);

  try {
    const response = await fetch(url);
    console.log("[GoLocale] Response status:", response.status);

    if (response.status >= 400) {
      console.log("[GoLocale] URL failed with status >= 400");
      return false;
    }

    const html = await response.text();
    console.log("[GoLocale] Fetched HTML length:", html.length);

    const result = isTargetLanguage(html);
    console.log("[GoLocale] URL candidate result:", result);
    return result;
  } catch (error) {
    console.error("[GoLocale] Error fetching URL:", url, error);

    // Try no-cors fallback
    console.log("[GoLocale] Trying no-cors fallback");
    try {
      const noCorsResponse = await fetch(url, { mode: "no-cors" });
      console.log("[GoLocale] No-cors response type:", noCorsResponse.type);
      if (noCorsResponse.type === "opaque") {
        console.log("[GoLocale] No-cors succeeded, assuming URL is valid");
        return true;
      }
    } catch (noCorsError) {
      console.error("[GoLocale] No-cors fallback also failed:", noCorsError);
    }

    return false;
  }
};

// URL generation strategies
const replaceLanguageCodes = (url, targetLang) => {
  const currentLangMap = typeof window !== 'undefined' ? window.langMap : global.langMap;
  const target = currentLangMap.get(targetLang);

  if (!target) {
    console.log("[GoLocale] Language not in ISO map, using pattern replacement for:", targetLang);
    return url.replace(/\/([a-z]{2,3})\//g, (match, langCode) => {
      return currentLangMap.has(langCode.toLowerCase()) ? `/${targetLang}/` : match;
    });
  }

  return url.replace(/(?<!\.)\b([a-z]{2,3})\b/gi, (match) => {
    const found = currentLangMap.get(match.toLowerCase());
    return found
      ? found.iso6391 === match.toLowerCase()
        ? target.iso6391 || match
        : found.iso6392B === match.toLowerCase()
        ? target.iso6392B || match
        : found.iso6392T === match.toLowerCase()
        ? target.iso6392T || match
        : match
      : match;
  });
};

const injectPath = (url, targetLang) => {
  const u = new URL(url);
  u.pathname = `/${targetLang}${u.pathname}`;
  return u.toString();
};

const replaceSubdomain = (url, targetLang) => {
  const u = new URL(url);
  const hostParts = u.hostname.split(".");
  const currentLangMap = typeof window !== 'undefined' ? window.langMap : global.langMap;

  if (hostParts.length >= 2 && currentLangMap.has(hostParts[0].toLowerCase())) {
    console.log("[GoLocale] Replacing subdomain language code:", hostParts[0], "with", targetLang);
    hostParts[0] = targetLang;
    u.hostname = hostParts.join(".");
    return u.toString();
  }

  return null;
};

const injectSubdomain = (url, targetLang) => {
  const u = new URL(url);
  u.hostname = `${targetLang}.${u.hostname}`;
  return u.toString();
};

const injectParams = (url, targetLang) => {
  return DETECTION_CONFIG.urlParams.map((param) => {
    const u = new URL(url);
    u.searchParams.set(param, targetLang);
    return u.toString();
  });
};

const generateUrlCandidates = (url) => {
  console.log("[GoLocale] Generating URL candidates for:", url);
  const candidates = [];
  const targetLangs = [LANGUAGE_CONFIG.targetLang, LANGUAGE_CONFIG.altLang].filter(Boolean);

  for (const targetLang of targetLangs) {
    console.log("[GoLocale] Generating candidates for language:", targetLang);

    // Strategy 1: Replace existing language codes
    candidates.push(replaceLanguageCodes(url, targetLang));

    // Strategy 2: Replace subdomain language codes
    const replacedSubdomainUrl = replaceSubdomain(url, targetLang);
    if (replacedSubdomainUrl) {
      candidates.push(replacedSubdomainUrl);
    }

    // Strategy 3: Path injection
    candidates.push(injectPath(url, targetLang));

    // Strategy 4: Subdomain injection
    candidates.push(injectSubdomain(url, targetLang));

    // Strategy 5: URL parameter injection
    candidates.push(...injectParams(url, targetLang));
  }

  console.log("[GoLocale] Total candidates generated:", candidates.length);
  return candidates;
};

const handleNotification = async () => {
  if (await GM.getValue("notify", false)) {
    await GM.setValue("notify", false);
    
    notify("GoLocale Redirected", "Stop", async () => {
      await GM.setValue(getStorageKey(location.hostname, 'user_disabled'), true);
      console.log("[GoLocale] User disabled redirects for domain:", getBaseDomain(location.hostname));
    });
  }
};

const tryRedirect = async () => {
  const url = location.href;
  console.log("[GoLocale] Starting redirect attempt for:", url);

  // Check if user has disabled redirects for this domain
  const userDisabledKey = getStorageKey(location.hostname, 'user_disabled');
  const userDisabled = await GM.getValue(userDisabledKey, false);
  
  if (userDisabled) {
    console.log("[GoLocale] Skipping - user disabled redirects for this domain");
    
    setTimeout(() => {
      if (!document.querySelector('[data-golocale]')) {
        notify("Redirects Disabled", "Enable", async () => {
          await GM.setValue(userDisabledKey, false);
          console.log("[GoLocale] Re-enabled redirects for domain:", getBaseDomain(location.hostname));
          notify("Redirects enabled!");
        });
      }
    }, 1000);
    
    return;
  }

  // Check if current page is already in target language
  console.log("[GoLocale] Checking current page language...");
  const currentPageHtml = document.documentElement.outerHTML;
  if (isTargetLanguage(currentPageHtml)) {
    console.log("[GoLocale] Current page is already in target language, no redirect needed");
    return;
  }

  const candidates = generateUrlCandidates(url);
  const filteredCandidates = candidates.filter((c) => c !== url);
  console.log("[GoLocale] Filtered candidates (excluding original URL):", filteredCandidates);

  // Test each candidate URL
  for (let i = 0; i < filteredCandidates.length; i++) {
    const candidate = filteredCandidates[i];
    console.log(`[GoLocale] Testing candidate ${i + 1}/${filteredCandidates.length}:`, candidate);

    if (await fetchAndCheckLanguage(candidate)) {
      console.log("[GoLocale] Found working candidate! Redirecting to:", candidate);
      await GM.setValue("notify", true);
      console.log("[GoLocale] Notification flag set");
      location.href = candidate;
      return;
    }
  }

  console.log("[GoLocale] No suitable candidates found, staying on current page");
};

// Main execution
(async () => {
  console.log("[GoLocale] Script starting...");

  if (typeof window === "undefined" || window !== window.top) {
    console.log("[GoLocale] Skipping - not in top-level window");
    return;
  }

  // Dynamic imports
  console.log("[GoLocale] Loading language detection libraries...");
  const { franc: francDetect } = await import("https://cdn.jsdelivr.net/npm/franc@6.2.0/+esm");
  const { iso6393: iso6393Data, iso6393To1 } = await import("https://cdn.jsdelivr.net/npm/iso-639-3@3.0.1/+esm");
  console.log("[GoLocale] Libraries loaded successfully");

  // Create language map for O(1) lookups
  window.langMap = new Map(
    iso6393Data.flatMap((lang) =>
      [lang.iso6391, lang.iso6392B, lang.iso6392T]
        .filter(Boolean)
        .map((code) => [code.toLowerCase(), lang])
    )
  );

  console.log("[GoLocale] Adding load event listener for notifications");
  window.addEventListener("load", async () => {
    await handleNotification();
    console.log("[GoLocale] Starting redirect process...");
    await tryRedirect();
    console.log("[GoLocale] Redirect process completed");
  });
})();

// Export functions for testing using CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    replaceLanguageCodes,
    injectPath,
    injectSubdomain,
    injectParams,
    isTargetLanguage
  };
}