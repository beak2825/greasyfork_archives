// ==UserScript==
// @name          19B4's Nu-Kinja Script
// @version       2018.03.27
// @namespace     19B4-KS
// @description	  Works on Deadspin, io9, Gizmodo, Jalopnik, Jezebel, Kotaku, Lifehacker, The Root, Splinter News, and the AV Club
// @author        Austin "lash" Williamson
// @homepage      http://19B4.kinja.com/
// @include       http://gawker.com/*
// @include       https://gawker.com/*
// @include       http://*.gawker.com/*
// @include       https://*.gawker.com/*
// @include       http://jezebel.com/*
// @include       https://jezebel.com/*
// @include       http://*.jezebel.com/*
// @include       https://*.jezebel.com/*
// @include       http://jalopnik.com/*
// @include       https://jalopnik.com/*
// @include       http://*.jalopnik.com/*
// @include       https://*.jalopnik.com/*
// @include       http://kotaku.com/*
// @include       https://kotaku.com/*
// @include       http://*.kotaku.com/*
// @include       https://*.kotaku.com/*
// @include       http://io9.com/*
// @include       https://io9.com/*
// @include       http://*.io9.com/*
// @include       https://*.io9.com/*
// @include       http://gizmodo.kinja.com/*
// @include       https://gizmodo.kinja.com/*
// @include       http://*.gizmodo.kinja.com/*
// @include       https://*.gizmodo.kinja.com/*
// @include       http://gizmodo.com/*
// @include       https://gizmodo.com/*
// @include       http://*.gizmodo.com/*
// @include       https://*.gizmodo.com/*
// @include       http://lifehacker.com/*
// @include       https://lifehacker.com/*
// @include       http://*.lifehacker.com/*
// @include       https://*.lifehacker.com/*
// @include       http://deadspin.com/*
// @include       https://deadspin.com/*
// @include       http://*.deadspin.com/*
// @include       https://*.deadspin.com/*
// @include       http://kinja.com/*
// @include       https://kinja.com/*
// @include       http://*.kinja.com/*
// @include       https://*.kinja.com/*
// @include       https://*.theroot.com/*
// @include       http://theroot.com/*
// @include       http://*.theroot.com/*
// @include       https://theroot.com/*
// @include       https://splinternews.com/*
// @include       https://splinternews.com/
// @include       https://*.splinternews.com/*
// @include       http://splinternews.com/*
// @include       http://splinternews.com/
// @include       http://*.splinternews.com/*
// @include       https://avclub.com/*
// @include       https://*.avclub.com/*
// @include       http://avclub.com/*
// @include       http://*.avclub.com/*
// @include       https://earther.com/*
// @include       https://*.earther.com/*
// @include       http://earther.com/*
// @include       http://*.earther.com/*
// @include       https://theonion.com/*
// @include       https://*.theonion.com/*
// @include       http://theonion.com/*
// @include       http://*.theonion.com/*
// @resource nu-kinja https://cdn.rawgit.com/tinoesroho/kinjamprove/master/Kinjamprove/nu-kinja.css
// @run-at        document-start
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/29302/19B4%27s%20Nu-Kinja%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/29302/19B4%27s%20Nu-Kinja%20Script.meta.js
// ==/UserScript==

var nuKinja = GM_getResourceText ("nu-kinja");

GM_addStyle (nuKinja);