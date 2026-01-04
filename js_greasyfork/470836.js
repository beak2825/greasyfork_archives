// ==UserScript==
// @name           Easy Breezy Fandom
// @namespace      colinphill.com
// @description    Automatically redirects from Fandom to various Breezewiki instances.
// @description:en Automatically redirects from Fandom to various Breezewiki instances.
// @match          https://*.fandom.com/wiki/*
// @noframes
// @run-at         document-start
// @grant          GM_xmlhttpRequest
// @version        0.1
// @author         Colin P. Hill
// @license        CC0
// @license        Unlicense
// @downloadURL https://update.greasyfork.org/scripts/470836/Easy%20Breezy%20Fandom.user.js
// @updateURL https://update.greasyfork.org/scripts/470836/Easy%20Breezy%20Fandom.meta.js
// ==/UserScript==

'use strict';

// Accepts a small subset of fetch options. Maybe someday we'll get a real GM_fetch.
const GM_xhr = (url, {method, signal, keepalive}) => {
  return new Promise((resolve, reject) => {
    const reqDetails = {
      url: url,
      method: method,
      // This is a forbidden header, but I'm not sure if GM_xmlhttpRequest respects that.
      headers: {'Connection': keepalive},
      onload: (event) => {
        event.ok = event.status >= 200 && event.status < 300
        if (event.ok) {
          resolve(event)
        } else {
          reject(event)
        }
      },
      timeout: 10000
    }
    for (const event of ['abort', 'error', 'timeout']) {
      reqDetails[event] = (event) => {
        console.log(`Error retrieving ${url}: ${event}`)
        reject(event)
      }
    }
    const control = GM_xmlhttpRequest(reqDetails)
    signal.addEventListener('abort', () => control.abort())
    if (signal.aborted) {
      control.abort()
    }
  })
}

const subdomainURL = (url, host) =>
  url.host = url.host.replace(/(?<=(\.|^))fandom\.com$/, host)
const pathPrefixURL = (url, host) => {
  url.pathname = "/" + /^[^.]+/.exec(url.hostname)[0] + url.pathname
  url.host = host
}

const tryRedirect = (params) => {
  const {host, updateURL = pathPrefixURL} =
        typeof params === "string" ? {host: params} : params
  console.log("Host: " + host)
  const url = new URL(window.location)
  //url.host = url.host.replace(/(?<=(\.|^))fandom\.com$/, host)
  updateURL(url, host)
  if (url.href === window.location.href) {
    throw new Error("URL was not modified for " + host)
  }
  console.log("Attempting to fetch %s", url)
  return GM_xhr(
    url,
    {
      method: 'HEAD',
      keepalive: true,
      signal: AbortSignal.timeout(2000)
    }
  ).then((response) => {
    console.log("OK response from %s: %o", host, response)
    if (response.ok) {
      window.location.replace(url)
    }
    return response.ok
  }).catch((e) => {
    console.error("Error fetching %s: %o", url, e)
    console.log(e)
    return false
  })
}

// Ordered from fastest to slowest at the time that I tested them
[
  "antifandom.com",
  "bw.artemislena.eu",
  "bw.vern.cc",
  "breezewiki.com"
].reduce(
  (p, host) => p.then(r => r || tryRedirect(host)),
  Promise.resolve(false)
)

// TODO: Enable script on breezewiki instances and have it redirect only on failure
