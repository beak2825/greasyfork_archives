// ==UserScript==
// @name               deAMP
// @name:zh-TW         deAMP
// @name:zh-CN         deAMP
// @description        AMP sucks, thus no AMP thanks.
// @description:zh-TW  垃圾 AMP，好走不送。
// @description:zh-CN  垃圾 AMP，好走不送。
// @icon               data:image/webp;base64,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
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            2.3.2
// @license            MIT
// @match              *://*/*
// @exclude-match      *://web.archive.org/web/*
// @run-at             document-end
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.deleteValue
// @grant              GM.registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/uuid-random@1.3.2/uuid-random.min.js
// @supportURL         https://greasyfork.org/scripts/450569/feedback
// @downloadURL https://update.greasyfork.org/scripts/450569/deAMP.user.js
// @updateURL https://update.greasyfork.org/scripts/450569/deAMP.meta.js
// ==/UserScript==

let t;
{
    const translations =
    {
        "en": {
            COMMAND: "Reset Session Key",
            MESSAGE: "Session key has been reseted.",
        },
        "zh-TW": {
            COMMAND: "重設工作階段密鑰",
            MESSAGE: "工作階段密鑰已被重設。",
        },
    };

    let locale = "en";
    for (let _locale of navigator.languages.map((language) => new Intl.Locale(language)))
    {
        if (_locale.language === "zh")
        {
            _locale = new Intl.Locale("zh", { region: _locale.maximize().region });
        }
;
        if (_locale.baseName in translations)
        {
            locale = _locale.baseName;
            break;
        }
    }

    t = translations[locale];
}

(async () =>
{
    const SESSION_KEY = await getSessionKey();

    const isAmp = document.documentElement.hasAttribute("⚡") || document.documentElement.hasAttribute("amp");
    const canonical = document.head.querySelector("link[rel=canonical][href]");

    if (isAmp && (canonical !== null))
    {
        const lastVisit = sessionStorage.getItem(SESSION_KEY);

        if (location.href === lastVisit)
        {
            console.debug("[deAMP] Last visited URL is the current URL, abort redirection.");
            sessionStorage.removeItem(SESSION_KEY);
        }
        else if (location.href === canonical.href)
        {
            console.debug("[deAMP] Canonical URL is the current URL, abort redirection.");
            sessionStorage.removeItem(SESSION_KEY);
        }
        else
        {
            console.debug(`[deAMP] Redirecting to canonical URL: ${canonical.href}`);

            sessionStorage.setItem(SESSION_KEY, location.href);
            location.replace(canonical.href);
        }
    }
    else
    {
        console.debug("[deAMP] Not an AMP page.");
        sessionStorage.removeItem(SESSION_KEY);
    }

    async function getSessionKey()
    {
        let key = await GM.getValue("SESSION_KEY");
        if (key) { return key; }

        key = uuid();
        GM.setValue("SESSION_KEY", key);
        return key;
    }
})();

GM.registerMenuCommand?.(t.COMMAND, () =>
{
    setTimeout(async () =>
    {
        await GM.deleteValue("SESSION_KEY");
        alert(t.MESSAGE);
    }, 0);
});
