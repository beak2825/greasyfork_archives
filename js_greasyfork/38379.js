// ==UserScript==
// @name        KissAnime switcher from default to fixed beta server
// @description Switches from the default server to the beta server.
// @author      @theweirdwhale
// @namespace 	theweirdwhale.tumblr.com
// @include *kissanime.ru/Anime/*/*&s=default
// @exclude *kissanime.ru/Anime/*/*&pfail=1*
// @version     1.4
// @run-at      document-Start
// @downloadURL https://update.greasyfork.org/scripts/38379/KissAnime%20switcher%20from%20default%20to%20fixed%20beta%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/38379/KissAnime%20switcher%20from%20default%20to%20fixed%20beta%20server.meta.js
// ==/UserScript==@@@@

location.href = location.href.replace(/&s=default/,"&s=beta&pfail=1");