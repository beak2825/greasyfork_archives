// ==UserScript==
// @name            Twitch revert layout
// @namespace       https://greasyfork.org/users/821661
// @match           https://www.twitch.tv/*
// @grant           none
// @run-at          document-start
// @version         1.1
// @author          hdyzen
// @description     Revert twitch layout
// @license         GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/520951/Twitch%20revert%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/520951/Twitch%20revert%20layout.meta.js
// ==/UserScript==
'use strict';

document.cookie = 'experiment_overrides={"experiments":{"abbeeb40-65b8-4d8a-970f-db96631f72be":"control"},"disabled":[]};path=/;domain=.twitch.tv;Secure';
