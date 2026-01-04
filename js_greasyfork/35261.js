// ==UserScript==
// @name        TestYourBond Cheater
// @namespace   StephenP
// @description Avoid quarrelling with your friends because you didn't catch the right answer to all their questions (even if some are really stupid, like "Which mobile OS does John prefers: 1)Android 2)iOS"). This script makes the correct answer appear bold.
// @include     http*://testyourbond.site/*/quiz*/*
// @include     http*://testyourbond.site/quiz*/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35261/TestYourBond%20Cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/35261/TestYourBond%20Cheater.meta.js
// ==/UserScript==
document.getElementsByTagName('head')[0].innerHTML += '<style>.correct{font-weight: bold}</style>';