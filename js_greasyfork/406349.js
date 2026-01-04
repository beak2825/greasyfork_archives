// ==UserScript==
// @name        DoodleGoneUpdated
// @namespace   http://localhost
// @description Replace the Google logo with a hosted image
// @version     1.1
// @include     http://*.google.*/*
// @include     https://*.google.*/*
// @resource    logo https://www.google.com/search?q=google+logo&safe=strict&rlz=1C1SQJL_frCA832CA832&sxsrf=ALeKk03hT0s4ZKuW8id2_mc_fWX-_yIKYQ:1593628617276&tbm=isch&source=iu&ictx=1&fir=IPKCJ_XMu6rtsM%252Cemlt7K6Cp7MftM%252C%252Fm%252F0b34hf&vet=1&usg=AI4_-kT_215pzXFRMU0fz5sJ1jH1yzVS0w&sa=X&ved=2ahUKEwjMxoud2azqAhVehHIEHZ3TCWgQ_B0wE3oECAsQAw#imgrc=IPKCJ_XMu6rtsM
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/406349/DoodleGoneUpdated.user.js
// @updateURL https://update.greasyfork.org/scripts/406349/DoodleGoneUpdated.meta.js
// ==/UserScript==
// 
var oldLogo = document.getElementById('hplogo');
var newLogo = document.createElement('img');
newLogo.id = "User-Logo";
newLogo.border = 'no'
newLogo.src = GM_getResourceURL ("logo");
oldLogo.parentNode.replaceChild(newLogo, oldLogo);
