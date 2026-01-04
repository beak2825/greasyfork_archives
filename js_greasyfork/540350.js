// ==UserScript==
// @name         Morning Star Bypass
// @namespace    https://friendlyuser1.github.io/
// @version      2025-06-21
// @description  Bypass Morning Star reading limit (subscribe if you can!)
// @author       FriendlyUser1
// @match        https://morningstaronline.co.uk/article/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAmtJREFUOE+Vkk1IFGEYx5/nndldRBO1LhJevLm5u7XtznoJjN1VhKjAEDsYRRiUSLe8dk2QqENhCEVBZSEEHXJdty+CdN11bVgk6FDRN1lq5ka78z5PzEyOqRA1p3l/839+83/nHYT/uHL7m6uKS4sNkVTu6coY/sv8i942D3yvqCzMvfP9LHwbeFWTD3XcBmnOWoIHzc3qJliq+lMWepidM9e3vF53fV3ZZibZxWT0AUMNIBaF6u4JJbJDlmAi5m8SRE4tk5HHta3pXm42HfN1A/ElQPyIqJxhMvoRcIGwrCGSSn+xBNnW4C5ZKj5esx0hTmjj+sWpqG+QmY8B4lcUOICozBPiS0RRHR7N3LAEmWhgN7G8v0aAYlhL6Z1TUV+WmYOImANVPcWl0k1WRUdkTLfytiAeaCEpE2sF8GG5bkt9xZu5RWZwm1sA5moA8Cgud9vOxPSoI5hsCexBQ97dcCKKuwtk8doGroq92phu5a0GUzHfPia+syEoRA6Idqzn6HIdCCdyI44g2xrokCU57AQRCBjEX9adWipv5e0Gcf9BlnTdAgKJGZ4Ds9f524QyzSSDjlBRj2jJmSuOIB3ffhikcdkCiAVCHEGirpUBBjyLiL3ApJqMFdEdSepDqw2i/qPMZAEAnBeIp4npnPNGobQj01VmLrcjokdL6RdWG8T8x4HIAoD4CYXSztJ48lvAVFFeK5YLs8BcY2fgpJbKn3cEmVhjLxGsgNdbyz3etz8M+ysjfA4nnx1KR33vgbnW3oLaF0nO9DuCyXhjSAElaj9UFsKj04Prjy5jtkSsNLnB/KhpXJ8w738BhqoEIDpcpo0AAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540350/Morning%20Star%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/540350/Morning%20Star%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("paywall-overlay").style.display = "none";
})();