// ==UserScript==
// @name         MooMoo.io Ad Removal and Lag Remover (Work In Progress)
// @version      v1.8
// @description  Removes ads in MooMoo.io. Fixes bugs that AdBlocker won't catch. This script is not backdoored and will never be. Please give feedback and tell us if this works. This also blurs the pixel a little to make your game run smoother.
// @author       Morpehus and Ivan
// @match        *://*.moomoo.io/*
// @namespace    https://www.youtube.com/ivansucksatgaming
// @namespace    https://www.youtube.com/channel/UCKYi6q-dq2yiNdEHPuJRMxw
// @downloadURL https://update.greasyfork.org/scripts/408037/MooMooio%20Ad%20Removal%20and%20Lag%20Remover%20%28Work%20In%20Progress%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408037/MooMooio%20Ad%20Removal%20and%20Lag%20Remover%20%28Work%20In%20Progress%29.meta.js
// ==/UserScript==
document.querySelectorAll("#adCard, #pre-content-container").forEach(function(a){
a.remove();
});
document.getElementsByClassName("menuCard")[4].remove();
document.getElementsByClassName("menuCard")[2].remove();
window.devicePixelRatio = 0.8;
$("#moomooio_728x90_home").parent().css({display: "none"});

/* Cookie Shit remover */
document.getElementById("onetrust-consent-sdk").remove();