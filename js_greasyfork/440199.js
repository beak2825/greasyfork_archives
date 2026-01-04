// ==UserScript==
// @name         dismiss cookies warning
// @name:fr      suppression de l'avertissement des cookies
// @namespace    https://greasyfork.org/en/users/876222-zzz-the-hacker
// @version      0.4
// @description  Agrees to the cookies dialog to make it disappear forever
// @description:fr  Confirme l'acceptation des cookies pour le faire disparaître définitivement
// @author       zzz le hacker
// @include      https://consent.google.*/*
// @include      https://www.google.tld/*
// @include      https://starve.io/
// @include      https://www.google.com
// @include      https://www.youtube.com/
// @include      https://www.facebook.com/
// @include      https://twitter.com/
// @include      https://www.instagram.com/
// @include      http://www.baidu.com/
// @include      https://www.wikipedia.org/
// @include      https://www.reddit.com/
// @include      https://consent.yahoo.com/v2/collectConsent?sessionId=3_cc-session_83f05cbb-450a-4c64-a23a-bc67eb43a71f
// @include      https://yahoo.com/
// @include      https://www.amazon.com/
// @include      https://www.netflix.com/fr/
// @include      https://www.netflix.com/fr-en/
// @include      https://www.twitch.tv/
// @include      https://www.ebay.com/
// @include      https://moomoo.io/
// @include      https://diep.io
// @include      https://devast.io/
// @include      https://slither.io
// @include      https://krunker.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440199/dismiss%20cookies%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/440199/dismiss%20cookies%20warning.meta.js
// ==/UserScript==

(function(){
"use strict";
if (document.readyState != 'loading') consent();
else document.addEventListener('DOMContentLoaded', consent);

function consent() {
  var e=document.querySelector('#introAgreeButton');
  if (!e) e=document.querySelector('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.google.com/s"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://twitter.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://starve.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.google.*/*"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.google.tld/*"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://starve.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.google.com"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.youtube.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.facebook.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://twitter.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.instagram.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="http://www.baidu.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.wikipedia.org/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.reddit.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.yahoo.com/v2/collectConsent?sessionId=3_cc-session_83f05cbb-450a-4c64-a23a-bc67eb43a71f"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://yahoo.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.netflix.com/fr/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.netflix.com/fr-en/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.twitch.tv/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.ebay.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://diep.io"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://moomoo.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://devast.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://slither.io"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://krunker.io/"] button');
  e && e.click();
}

})();