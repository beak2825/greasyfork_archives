// ==UserScript==
// @name        显示密码
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      yaohunzhanyue
// @description 2019/12/11 上午12:26:27
// @downloadURL https://update.greasyfork.org/scripts/393554/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/393554/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

show_pw();

function show_pw() {
  'use strict';
	var e, t;
	e = document.getElementsByTagName("input");
	for (var a = 0; a < e.length; a++)
		if (t = e[a], "password" == t.type.toLowerCase()) try {
			t.type = "text"
		} catch (e) {
			var r, n;
			r = document.createElement("input"), n = t.attributes;
			for (var o = 0; o < n.length; o++) {
				var i, c, d;
				i = n[o], c = i.nodeName, d = i.nodeValue, "type" != c.toLowerCase() && "height" != c && "width" != c & !!d && (r[c] = d)
			}
			t.parentNode.replaceChild(r, t)
		}
}