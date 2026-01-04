// ==UserScript==
// @name         MooMoo.io/Foes.io miner blocker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Blocks crytocurrency miners from running
// @author       someRandomGuy
// @match        *://moomoo.io/*
// @match        *://foes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40662/MooMooioFoesio%20miner%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/40662/MooMooioFoesio%20miner%20blocker.meta.js
// ==/UserScript==

Worker = null;