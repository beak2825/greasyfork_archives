// ==UserScript==
// @name         Extend status marker syntax
// @namespace    http://statonions.com
// @version      0.3
// @description  Adds multichar and color support to status markers
// @author       Justice Noon
// @match        https://app.roll20.net/editor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395446/Extend%20status%20marker%20syntax.user.js
// @updateURL https://update.greasyfork.org/scripts/395446/Extend%20status%20marker%20syntax.meta.js
// ==/UserScript==
// Changelog:    Rely on d20 instead of d21

(function() {
	var pageReady = setInterval(() => {
		if (document.readyState == 'complete') {
			if (typeof d20 != 'undefined') {
				timeToGo();
				clearInterval(pageReady);
			}
		}
	}, 2000);

	function timeToGo() {
		d20.utils._status_regex = /^(?:(dead)|(#?[^@#]+)(?:@([^#]+))?(?:(#[\da-fA-F]{0,8}))?)$/;
		/*d21.utils.parseStatus = e=> {
			const t = d20.utils._status_regex.exec(e)
			, n = {
				dead: t && t[1] || null,
				icon: null,
				color: null,
				number: t && t[3] || null
			};
			if (t && t[2] && "dead" !== t[2])
				if (_.keys(d20.token_editor.colorMarkers).includes(t[2]))
					n.color = d20.token_editor.colorMarkers[t[2]];
				else {
					const e = _.find(token_marker_array, e=>e.tag === t[2]);
					if (!e)
						return !1;
					n.icon = e.id
				}
			return t && n
		}*/
	}

})();