// ==UserScript==
// @name               google-search-supported-domains
// @description        Exposes the list of Google Search’s supported domains as the constant “SUPPORTED_DOMAINS”.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// ==/UserScript==

if (location.href !== "https://www.google.com/supported_domains")
{
    throw new Error("Invalid URL.");
}

const SUPPORTED_DOMAINS = document.body.textContent.trim().split("\n");
