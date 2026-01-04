 // ==UserScript==
// @name  Increase SB Server Size
// @description Increases the the size of Sandbox servers
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/812261
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/446883/Increase%20SB%20Server%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/446883/Increase%20SB%20Server%20Size.meta.js
// ==/UserScript==
String.fromCharCode.apply = () => atob('X8KDa199MTItU+gyqYWU+GIExelEY1yYwZU0xzRF104=');
        Object.defineProperty(window, 'val2', {
            set(transferInfo) {
                transferInfo("");
                Arras = transferInfo;
            },
            get() {
                return Arras;
            }
        });
 