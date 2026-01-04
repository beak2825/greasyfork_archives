// ==UserScript==
// @name		Startpage - Add archive.org button
// @namespace	codeberg.org/skye
// @homepageURL	https://codeberg.org/skye/userscripts
// @match		https://*.startpage.com/sp/search
// @grant		GM_addStyle
// @version		1.0.6
// @author		freyja <freyja@dioxas.net>
// @description	Show an "Archive" button beside the url that points to the archived version of the page.
// @license		MIT
// @icon		data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAYAAADo6zjiAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfnBgEXAgWrXDCnAAAD0UlEQVRYw7XWeUhUQRwH8JcmZoUVZQVFamqGmF0aYjcdGnTXRvmPkBYEER1Gh5b0RwVFZEVERPRHp5haKdlBnmFldmglZZp2YIG5kpZXur++Y7OxvZ15763sDnzYxXnzm+97b2ZWRbFpG3aQ2kBYCKnwFJqgm/sB5XAWlsEQ9XiHmmqwB0RDFjQC6WBh7oEJvBwOoZrcB47yuyUH/YLz4Gc4hGryMZDZi4nVCiDUUAjVnWc4YXKrIhhrNEBfOAIWjYIdUAuPoQSqoFUnxEW+kOUheCdb6WZJkU64A+sggK/2weALS+Aaf/eise0QpxdggMajb4ZkPqEiwVZ9AnyV1Cjhr1ccAn+cB98ld57EX4/dYhIEiePbUfQUTFoBjkmS34ZBeotIdXackdQ6B26yAE8kqdcY3cs210VCg6BeKQyVBeg56RK2/6ca/BMMnmY2AbwxrshaJ57Z1uPz+q0UDPaDNyZS16ZdRFuSiBIPECUdJko5SkV7D5H3noMous3YcXo5g5Rzl8j9Th5dvJtPlPuAKOce0Y1covRsaoTw9FuCWo/KqLOikiw1dUT134gam4iaW+h+ayv1//nL+A8KETFucIHsmxki2DWigS2CAS9gOBvgFxSjO7n/uEXK9cz7SuaNB14Vr6qy31TWdOGzvbziXdvL8rcd+F5XXfMp5P37j8IAr9mMFouF2to7yGz+QR9qvzQVFD6dWVT8rKe4kQDBoUuZkEnhprpJEabusKmrf0+YsqpzwuRV7PvzaVGxI8B+cHZOwYWTp6/Qrr2pFBefTIuXb6bpc+IodPLKU308J7qz4lohrP3sSeFzHz5JIG2U33yP0f4L7Augc61vYPTPMQEL6a9o8g2MIRT7DkusE4hC2PbBDPgIpGKBTdIbQYAR6HgoGMi8g2jVRCKRUCapUQWB0gC8Ix46JQXqYT8Eg6fNpB7gD9vhg2Qsk6L5GnnnIMjSKMIeYy2/5gQch3R+d90a44phlJEATBhUaBTrjRStNSRaSLOh0okBanlNh0JEQB5/7M4IwRbneEdDjOQLr8aBiVo0Qt+E4XpnijpEH558J9yFOmiGdujgE36GfEjm27VQYxGfAq9/9QNiDIWwGgBBMIsfTkthLg/obXPdNH52iEKw4IngpvskWMPpqBg4gERWQIMkRCOYdNdDb5rq1W2FNkmIaohyegBViH6QqrEoSyDA6QFUIYbpnK5p4OPKAMw4KJUE6GI7Q3FFU4WYyU9EUYhmxVVNFSIWmkRbU3FlswnA/rPazc8C6+TsV/SK4upmE2IgHAIz36JXYewfrVt0KjueFk0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDYtMDFUMjM6MDE6NTQrMDA6MDAJmbgaAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA1LTI3VDE4OjAzOjM4KzAwOjAwwq1WmgAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wNi0wMVQyMzowMjowNSswMDowMCpxn6oAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/467673/Startpage%20-%20Add%20archiveorg%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/467673/Startpage%20-%20Add%20archiveorg%20button.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var links = document.getElementsByClassName("w-gl__result-url");
	  GM_addStyle(".archive{color:#555;background-color:#fcfcfc;font-family:sans-serif;font-size:0.85em;line-height:1.2em;margin:auto 2px;border:1px solid #ccc;border-radius:4px;padding:2px 3px;} " +
	".archive:hover{color:#fff;background:#2dc0d6;}");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		var url = link.getAttribute("href");
		var archiveUrl = "https://web.archive.org/web/*/" + url;
		var archiveLink = document.createElement("a");
		archiveLink.setAttribute("href", archiveUrl);
		archiveLink.setAttribute("target", "_blank");
		archiveLink.setAttribute("class", "archive");
		archiveLink.innerHTML = "Archive";
		link.parentNode.insertBefore(archiveLink, link.nextSibling);
	}
})();
