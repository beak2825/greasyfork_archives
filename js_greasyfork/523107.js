// ==UserScript==
// @name         URL Cleaner Revamped
// @namespace    URL Cleaner Revamped
// @description  Script that removes tracking parameters and cleans URLs from major websites
// @version      0.0.1
// @author       https://github.com/notschema
// @license      GPL version 3 or any later version
// @contributionURL https://www.paypal.com/donate/?business=ML7FE7CLAD3B4
// @contributionAmount $1

// @include      https://www.youtube.com/*
// @include      https://www.facebook.com/*
// @include      https://www.linkedin.com/*
// @include      https://www.etsy.com/*
// @include      /^https:\/\/[a-z0-9.]*\.?amazon(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/.*$/
// @include      /^https:\/\/[a-z0-9.]*\.?google(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/.*$/
// @include      /^https:\/\/[a-z0-9.]*twitter.com\/.*$/

// @exclude      /^https:\/\/[a-z0-9.]*\.?amazon(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/(?:gp\/(?:cart|buy|css|legacy|your-account).*|sspa.*)$/
// @exclude      https://apis.google.com/*
// @exclude      https://accounts.google.com/*
// @exclude      https://support.google.com/*
// @exclude      https://www.google.com/recaptcha/*
// @exclude      https://hangouts.google.com/webchat/*
// @exclude      https://gsuite.google.com/*
// @exclude      https://calendar.google.com/*
// @exclude      https://docs.google.com/spreadsheets/*
// @exclude      https://takeout.google.com/*

// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/523107/URL%20Cleaner%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/523107/URL%20Cleaner%20Revamped.meta.js
// ==/UserScript==

// Removed support for the following sites on Tuesday, January 07, 2025, 8 PM AEDT:
// - Disqus
// - IMDB
// - Newegg
// - Yahoo
// - Target
// - eBay
// - Pocket
// - Bing


// TODO: Fix Amazon /hz/ page filtering and /gp/ links to /my-account/

(() => {
    const currHost = location.host;
    const currPath = location.pathname;
    const currSearch = location.search;
    const amazon = /^[a-z.]*\.?amazon(\.[a-z]{2,3})?(\.[a-z]+)?$/;
    const google = /^[a-z.]*\.?google(\.[a-z]{2,3})?(\.[a-z]+)?$/;

    const amazonParams = /&?_?(encoding|crid|sprefix|ref|th|url|ie|pf_rd_[^&#]*?|pd_rd_[^&#]*?|bbn|rw_html_to_wsrp|ref_|content-id)(=[^&#]*)?($|&)/g;
    const youtubeParams = /&(feature|src_vid|annotation_id|[gh]l)(=[^&#]*)?($|&)/g;
    const twitterParams = /&(src|ref_src|ref_url|vertical|s)(=[^&#]*)?($|&)/g;
    const facebookParams = /&(set)(=[^&#]*)?($|&)/g;
    const googleParams = /(?:&|^)(uact|iflsig|sxsrf|ved|source(id)?|s?ei|tab|tbo|h[ls]|authuser|n?um|ie|aqs|as_qdr|bav|bi[wh]|bs|bvm|cad|channel|complete|cp|s?client|d[pc]r|e(ch|msg|s_sm)|g(fe|ws)_rd|gpsrc|noj|btnG|o[eq]|p(si|bx|f|q)|rct|rlz|site|spell|tbas|usg|xhr|gs_[a-z]+)(=[^&#]*)?(?=$|&)/g;
    const linkedinParams = /&(eBP|refId|trackingId|trk|flagship3_search_srp_jobs|lipi|lici)(=[^&#]*)?($|&)/g;
    const etsyParams = /&(click_key|click_sum|ref|pro|frs|ga_order|ga_search_type|ga_view_type|ga_search_query|sts|organic_search_click|plkey)(=[^&#]*)?($|&)/g;

    if (currHost == "www.linkedin.com") {
        setCurrUrl(cleanLinkedin(currSearch));
        cleanLinks(parserAll);
        return;
    }
    if (currHost == "www.etsy.com") {
        setCurrUrl(cleanEtsy(currSearch));
        cleanLinks(parserAll);
        return;
    }
    if (currHost === "www.youtube.com") {
        if (currPath === "/redirect") {
            location.href = cleanYoutubeRedir(currSearch);
        }
        if (currPath === "/watch") {
            setCurrUrl(cleanYoutube(currSearch));
        }
        cleanLinks(parserYoutube);
        return;
    }
    if (google.test(currHost)) {
        if (currPath === "/url" || currPath === "/imgres") {
            location.href = cleanGenericRedir(currSearch);
        }
        if (!currSearch && !/[&#]q=/.test(location.hash)) {
            return;
        }
        setCurrUrl(cleanGoogle(currPath + currSearch));
        changeState(googleInstant);
        if (currSearch.includes("tbm=isch")) {
            cleanLinksAlways(parserGoogleImages);
        } else {
            cleanLinks(parserGoogle);
        }
        return;
    }
    if (amazon.test(currHost)) {
        if (currPath.includes("/dp/")) {
            setCurrUrl(cleanAmazonItemdp(location));
        } else if (currPath.includes("/gp/product")) {
            setCurrUrl(cleanAmazonItemgp(location));
        } else if (currSearch) {
            setCurrUrl(cleanAmazonParams(currSearch));
        }
        cleanLinks(parserAmazon);
        onhashchange = deleteHash();
        return;
    }
    if (currHost == "twitter.com") {
        if (currSearch) {
            setCurrUrl(cleanTwitterParams(currSearch));
        }
        cleanLinks(parserTwitter);
        return;
    }
    if (currHost == "www.facebook.com") {
        if (currSearch) {
            setCurrUrl(cleanFacebookParams(currSearch));
        }
        cleanLinks(parserFacebook);
        return;
    }

    function setCurrUrl(url) {
        history.replaceState(null, null, url);
    }
    function deleteHash() {
        history.replaceState(null, null, " ");
    }
    function observe(func) {
        new MutationObserver(func).observe(document, { childList: true, subtree: true });
    }
    function cleanLinks(linkParser) {
        observe(function () {
            for (let a of document.links) {
                if (a.cleaned) {
                    continue;
                }
                if (a.protocol && a.protocol.startsWith("http")) {
                    linkParser(a);
                }
                a.cleaned = 1;
            }
        });
    }
    function cleanLinksAlways(linkParser) {
        observe(function () {
            for (let a of document.links) if (a.protocol && a.protocol.startsWith("http")) {
                linkParser(a);
            }
        });
    }
    function googleInstant(url) {
        let parts = url.split("#");
        if (parts.length !== 2) {
            return url;
        }
        let hash = parts[1];
        if (hash === "imgrc=_") {
            return " ";
        }
        if (/(^|&)q=/.test(hash)) {
            return "?" + hash;
        }
        return "#" + hash;
    }
    function changeState(mod) {
        history.realPushState = history.pushState;
        history.realReplaceState = history.replaceState;
        history.pushState = function () {
            history.realPushState(null, null, mod(arguments[2]));
        };
        history.replaceState = function () {
            history.realReplaceState(null, null, mod(arguments[2]));
        };
    }

})();

/* * Link parsing functions */

function parserAll(a) {
    let host = a.host;
    let path = a.pathname;
    if (a.cleaned) {
        return;
    }

    if (google.test(host)) {
        if (path === "/imgres" || path === "/url") {
            a.href = cleanGenericRedir(a.search);
        } else if (a.search) {
            a.search = cleanGoogle(a.search);
        }
        return;
    }

    if (host === "www.youtube.com") {
        if (path === "/watch") {
            a.search = cleanYoutube(a.search);
        } else if (path === "/redirect") {
            a.href = cleanYoutubeRedir(a.search);
        }
        a.cleaned = 1;
        return;
    }

    parserAmazon(a);

    if (a.search) {
        a.search = cleanUtm(a.search);
    }

    if (a.hash) {
        a.hash = cleanUtm(a.hash);
    }

    a.cleaned = 1;
}

function parserGoogle(a) {
    a.removeAttribute("onmousedown");
    parserAll(a);
}

function parserGoogleImages(a) {
    let jsaction = a.getAttribute("jsaction");
    if (jsaction && jsaction.includes("down:irc.rl")) {
        console.log(a);
        a.removeAttribute("jsaction");
    }

    a.removeAttribute("onmousedown");
    parserAll(a);
}

function parserYoutube(a) {
    parserAll(a);
    let text = a.innerText;
    let href = a.getAttribute("href");
    if (text === href || (text.endsWith("...") && href.startsWith(text.slice(0, -3)))) {
        a.innerText = href;
    }
}

function parserAmazon(a) {
    if (!amazon.test(a.host)) {
        return;
    }

    if (a.pathname.includes("black-curtain-redirect.html")) {
        a.href = cleanAmazonRedir(location);
    } else if (a.pathname.includes("/dp/")) {
        a.href = cleanAmazonItemdp(a);
    } else if (a.pathname.includes("/gp/product")) {
        a.href = cleanAmazonItemgp(a);
    } else if (a.pathname.includes("/picassoRedirect")) {
        a.href = cleanGenericRedir(a.search);
        a.search = "";
    } else if (a.search) {
        a.href = cleanAmazonParams(a.href);
    }

    if (a.pathname.includes("/ref=")) {
        a.pathname = cleanAmazonParams(a.pathname);
    }
}

function parserTwitter(a) {
    if (a.host !== "t.co") {
        return;
    }

    let fake = "t.co" + a.pathname;
    let real = a.getAttribute("data-expanded-url");
    if (real) {
        a.href = real;
        a.removeAttribute("data-expanded-url");
        sessionStorage.setItem(fake, real);
        return;
    }

    if (!a.classList.contains("TwitterCard-container")) {
        return;
    }

    real = sessionStorage.getItem(fake);
    if (real) {
        a.href = real;
    }
}

function parserFacebook(a) {
    let onclick = a.getAttribute("onclick");
    if (!onclick || !onclick.startsWith("LinkshimAsyncLink")) {
        return;
    }

    if (a.host !== "l.facebook.com") {
        return;
    }

    a.href = cleanGenericRedir(a.search);
    a.removeAttribute("onclick");
    a.removeAttribute("onmouseover");
}

/*
 * URL string functions
 */

function cleanGoogle(url) {
    return url.replace("?", "?&").replace(googleParams, "").replace("&", "");
}

function cleanLinkedin(url) {
    return url.replace("?", "?&").replace(linkedinParams, "").replace("&", "");
}

function cleanEtsy(url) {
    return url.replace("?", "?&").replace(etsyParams, "").replace("&", "");
}

function cleanTwitterParams(url) {
    return url.replace("?", "?&").replace(twitterParams, "").replace("&", "");
}

function cleanYoutube(url) {
    return url.replace("?", "?&").replace(youtubeParams, "").replace("&", "");
}

function cleanFacebookParams(url) {
    return url.replace("?", "?&", "#").replace(facebookParams, "").replace("&", "");
}

function cleanAmazonParams(url) {
    return url.replace("?", "?&").replace(amazonParams, "").replace("&", "").replace(/\?$/, "");
}

function cleanAmazonItemgp(a) {
    let item = a.pathname.match(/\/[A-Z0-9]{10}/);
    return a.origin + "/gp/product" + item + a.hash;
}

function cleanAmazonItemdp(a) {
    let item = a.pathname.match(/\/dp(\/[A-Z0-9]{10})/)[1];
    return a.origin + "/dp" + item + a.hash;
}

function cleanYoutubeRedir(url) {
    return decodeURIComponent(url.match(/[?&]q=([^&]+)/).pop());
}

function cleanAmazonRedir(url) {
    return decodeURIComponent(url.match(/[?&]redirectUrl=([^&]+)/).pop());
}

function cleanGenericRedir(url) {
    return decodeURIComponent(url.match(/[?&](new|img)?u(rl)?=([^&]+)/i).pop());
}

function cleanGenericRedir2(url) {
    return decodeURIComponent(url.match(/[?&]\w*url=([^&]+)/i).pop());
}

function cleanUtm(url) {
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
        var pars = urlparts[1].split(/[&;]/g);
        for (var i = pars.length; (i -= 1) > 0;) {
            if (/^utm_/.test(pars[i])) {
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    return url;
}