// ==UserScript==
// @name         YTDL CORE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Core Code for getting YouTube Download Links, when on youtube.com with a PC UserAgent. credits @maple3142
// @author       You
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433956/YTDL%20CORE.user.js
// @updateURL https://update.greasyfork.org/scripts/433956/YTDL%20CORE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = "TSIhiZ5jRB0"
	const parseQuery = s => [...new URLSearchParams(s).entries()].reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
    const playerRes = ytplayer?.config?.args?.raw_player_response
    stream = playerRes.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			console.log(`video %s stream: %o`, id, stream)
			for (const obj of stream) {
				if (obj.s) {
					obj.s = decsig(obj.s)
					obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`
				}
			}
})();