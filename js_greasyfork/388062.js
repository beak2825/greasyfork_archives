// ==UserScript==
// @name         Scratch Stage Positioner
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Moves the S3.0 Scratch Stage to the left.
// @author       DamienVesper
// @match        *://scratch.mit.edu/*
// @match        *://*.scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388062/Scratch%20Stage%20Positioner.user.js
// @updateURL https://update.greasyfork.org/scripts/388062/Scratch%20Stage%20Positioner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    LEGAL
     - All code licensed under the Apache 2.0 License. Code copyright 2019 by DamienVesper. All rights reserved.
     - All code reproductions must include the below insigna.
     - Any reproductions of this and other related works that are found to be in violence of this code will be reported and removed.
                         ____                                            _
     |\   \      /      |    |                                          |_|
     | \   \    /       |____|  __   __   __   __   __    __ __   __ __      __   __
     | /    \  /        |      |  | |  | |  | |  | |  |  |  |  | |  |  | |  |  | |  |
     |/      \/         |      |    |__| |__| |    |__|_ |  |  | |  |  | |  |  | |__|
                                            |                                       |
                                          __|                                     __|
    */

    var editorElem = document.querySelector(`.gui_editor-wrapper_2DYcj`);
    if(!editorElem) return;

    document.querySelector(`.gui_editor-wrapper_2DYcj`).remove();
    document.querySelector(`.gui_flex-wrapper_uXHkj`).appendChild(editorElem);
})();