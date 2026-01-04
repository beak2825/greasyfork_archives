// ==UserScript==
// @name        no scroll
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @version     0.4
// @description prevent some websites from scrolling, edit this to include more websites
// @author      BZZZZ
// @include     /^https?\:\/\/woomy\.arras\.io\/([?#]|$)/
// @include     /^https?\:\/\/(ftb\.)?tankster\.io\/([?#]|$)/
// @include     /^https?\:\/\/spacewar\.cc\/([?#]|$)/
// @include     /^https?\:\/\/obstar\.io\/(play\/?)?([?#]|$)/
// @include     /^https?\:\/\/o?obstar\.glitch\.me\/(play\/?)?([?#]|$)/
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/423909/no%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/423909/no%20scroll.meta.js
// ==/UserScript==

document.getElementsByTagName("body")[0].setAttribute("onscroll","window.scrollTo(0,0);");