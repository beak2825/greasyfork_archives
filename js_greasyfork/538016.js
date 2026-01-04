// ==UserScript==
// @name         X.com (Twitter) To Nitter Redirector
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Automatically redirects all links from Twitter.com & X.com to the alternative Nitter frontend or vice versa
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVRYhe2WTU4bQRCFv9c2CYso8Swj7HhuEG4QcwLMCWIvcMQOTgA+AexQ7Ej4COQEtk+QyQkyCSBlN4OUVbCnsgCD/xkTUBTJbzfVrXpfdfV0Nyy11D+WHitR/jgqkdW+YB3IYYSgzlU/qf/c8cLheb9WCeKqF08ArDWiCkbu4oN3tIj5m+blvmEHs8YtsbpBLKdNmcKz2qvqYGwEoNCITpE2k8T20kKsNaKKk07SzJURur5tXGXIXdS8AMCNkEpFAOd0mG9e7qdJ6pxSzRPECQT9FbWdwx+K3ynfjL/c9PCGiND6Vj3f8TrTkuaPo5KyaqcBuMtp1bOa17otYGywO4btK6t2vhm3X3+MyhO5MneVpFFPtjVsDpAd+VjhKOnx3iA3ykEp61QqNOPYjI6ZdZUQIFcESw3w/IpgPDYCEEP8EquDDmfkyEmUJZWv1y69OUC8SjwX4EWPIEHfJEJsseVN4z/494c1tgc4FZSewBwz+zotPgKQhdZjGw9pov8TAGHNC4TtPYW7zSjOjQd+bHtHmFUlwkczN+sOTr57AQBk5JLEPovJXfsQaU5rs9OCiSMQOlzsJ5shU+uslpsJMHUFzre9jrD633rLCDP9ZG6eue+BQiOqALtIbx8CYNjG+fb0eyQVwEB+I1pPpPb4ET3fffTSeRCA34jWe3KbwnZJaX597drWfZVPABQ+ReUkISfDl1wRZ4ufiGbdTJ9KOPQESw0Atz2vIL1b1NjEQdqqZwIM5J9EfvKbsokS4EsqDvoviM3sO0YgCNwzWuGUS2appf4b/QHXNfBk6YeX2wAAAABJRU5ErkJggg==
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://nitter.net/*
// @match        https://xcancel.com/*
// @match        https://nitter.poast.org/*
// @match        https://nitter.privacyredirect.com/*
// @match        https://nitter.tiekoetter.com/*
// @match        https://nitter.space/*
// @match        https://lightbrd.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538016/Xcom%20%28Twitter%29%20To%20Nitter%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/538016/Xcom%20%28Twitter%29%20To%20Nitter%20Redirector.meta.js
// ==/UserScript==

(function () {
	 'use strict';
// By default userscript uses Twiiit.com provides links that automatically redirect from X.com (formerly Twitter) to working alternative Nitter frontend instances
	 window.location.assign((window.location.href.split("?")[0]).replace("x.com", "twiiit.com").replace("twitter.com", "twiiit.com"))

// Otherwise, usercript will automatically redirect from Twitter & alternative Nitter frontends to x.com
//	 window.location.assign((window.location.href.split("?")[0]).replace("twitter.com", "x.com").replace("nitter.net", "x.com").replace("xcancel.com", "x.com").replace("nitter.poast.org", "x.com").replace("nitter.privacyredirect.com", "x.com").replace("nitter.tiekoetter.com", "x.com").replace("nitter.space", "x.com").replace("lightbrd.com", "x.com"))  
})();