// ==UserScript==
// @name         4chan(You)
// @description  Reinstates (You) on 4chan
// @namespace    https://greasyfork.org/en/users/90468-kailuu
// @version      1.0
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @include      http://sys.4chan.org/*
// @include      https://sys.4chan.org/*
// @include      http://www.4chan.org/*
// @include      https://www.4chan.org/*
// @include      http://i.4cdn.org/*
// @include      https://i.4cdn.org/*
// @include      http://is.4chan.org/*
// @include      https://is.4chan.org/*
// @include      https://www.google.com/recaptcha/api2/anchor?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      https://www.google.com/recaptcha/api2/frame?*&k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      https://www.google.com/recaptcha/api2/frame?*&k=887877714&*
// @include      http://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      https://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @exclude      http://www.4chan.org/pass
// @exclude      https://www.4chan.org/pass
// @exclude      http://www.4chan.org/pass?*
// @exclude      https://www.4chan.org/pass?*
// @exclude      http://www.4chan.org/advertise
// @exclude      https://www.4chan.org/advertise
// @exclude      http://www.4chan.org/advertise?*
// @exclude      https://www.4chan.org/advertise?*
// @exclude      http://www.4chan.org/donate
// @exclude      https://www.4chan.org/donate
// @exclude      http://www.4chan.org/donate?*
// @exclude      https://www.4chan.org/donate?*
// @downloadURL https://update.greasyfork.org/scripts/26102/4chan%28You%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26102/4chan%28You%29.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".quotelink { \
	text-decoration: underline; \
	border: none; \
} \
.quotelink.ql-tracked:after \
{  \
content: \" (You)\"; \
}";

document.head.appendChild(css);