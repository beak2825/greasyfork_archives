// ==UserScript==
// @name        Remove banner and avatar from GameFAQs profiles
// @namespace   temp
// @description:en  Remove banner and avatar from gamefaqs.com community profiles.
// @include     http://www.gamefaqs.com/community/*
// @version     1
// @grant       none
// @description Remove banner and avatar from gamefaqs.com community profiles.
// @downloadURL https://update.greasyfork.org/scripts/19490/Remove%20banner%20and%20avatar%20from%20GameFAQs%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/19490/Remove%20banner%20and%20avatar%20from%20GameFAQs%20profiles.meta.js
// ==/UserScript==

var pod_header = document.getElementsByClassName('pod_profile_header')[0];
pod_header.style.display="none";