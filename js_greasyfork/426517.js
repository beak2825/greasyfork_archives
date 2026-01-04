// ==UserScript==
// @name         Puzzle-pipes mouse pan
// @namespace    https://xandaros.dyndns.org/
// @version      0.2
// @description  Adds panning with middle mouse button to puzzle-pipes
// @author       Xandaros
// @match        https://www.puzzle-pipes.com/*
// @icon         https://www.google.com/s2/favicons?domain=puzzle-pipes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426517/Puzzle-pipes%20mouse%20pan.user.js
// @updateURL https://update.greasyfork.org/scripts/426517/Puzzle-pipes%20mouse%20pan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        let dragEnabled = false;
        let dragPosition = {
            left: 0,
            top: 0,
            mouseX: 0,
            mouseY: 0,
        };

        function startDrag(e) {
            const el = $("#puzzleContainerOverflowDiv");
            dragEnabled = true;
            dragPosition.left = el.scrollLeft();
            dragPosition.top = $(window).scrollTop();
            dragPosition.mouseX = e.clientX;
            dragPosition.mouseY = e.clientY;
        }

        function stopDrag() {
            dragEnabled = false;
        }

        function doDrag(e) {
            const el = $("#puzzleContainerOverflowDiv");
            const dx = e.clientX - dragPosition.mouseX;
            const dy = e.clientY - dragPosition.mouseY;

            el.scrollLeft(dragPosition.left - dx);
            $(window).scrollTop(dragPosition.top - dy);
        }

        $("#game").on("mousedown", e => {
            if (e.button == 1) {
                startDrag(e);
                return false;
            }
        });
        $("#game").on("mouseup", e => {
            if (e.button == 1) {
                stopDrag();
            }
        });
        $("#game").on("mouseleave", e => {
            stopDrag();
        });

        $("#game").on("mousemove", e => {
            if (dragEnabled) {
                doDrag(e);
                return true;
            }
        });

    });
})();