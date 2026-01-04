// ==UserScript==
// @name        worker.mturk.com2ClassicAllHITs
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @description Forwards https://worker.mturk.com/ to https://worker.mturk.com/projects?filters[qualified]=false&filters[masters]=false&sort=num_hits_desc&filters[min_reward]=0
//              Useful for when finishing a queue of HITs and want the classic results before the January 11th, 2018 change.
// @include     https://worker.mturk.com/
// @version     1.0.20180118
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37599/workermturkcom2ClassicAllHITs.user.js
// @updateURL https://update.greasyfork.org/scripts/37599/workermturkcom2ClassicAllHITs.meta.js
// ==/UserScript==
if (location.href == "https://worker.mturk.com/")
location.assign("https://worker.mturk.com/projects?filters[qualified]=false&filters[masters]=false&sort=num_hits_desc&filters[min_reward]=0");
