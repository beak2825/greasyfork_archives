// ==UserScript==
// @name         MPOS Start/END Coding
// @namespace    https://github.com/R0g3rT
// @version      2.1
// @license      MIT
// @description  burn rubber not your soul!!
// @author       R0g3rT
// @match        https://mpos.rameder.eu/backend/calendar/pendingcodings
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rameder.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487290/MPOS%20StartEND%20Coding.user.js
// @updateURL https://update.greasyfork.org/scripts/487290/MPOS%20StartEND%20Coding.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        if (windowHeight < 1200 && windowWidth < 1200) {
            setTimeout(function() {
                var cancelButton = document.querySelector('button.MuiButton-textPrimary');
                if (cancelButton) {
                    cancelButton.click();
                }

                var searchButton = document.querySelector('button[data-testid="Suche-iconButton"]');
                searchButton.click();

                setTimeout(function() {
                    navigator.clipboard.readText().then(function(clipText) {
                        if (clipText.length === 17) {
                            var input = document.querySelector('input[aria-label="Suche"]');
                            input.focus();
                           document.execCommand('insertText', false, clipText);

                            setTimeout(function() {
                                var viewButton = document.querySelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textSecondary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textSecondary MuiButton-sizeSmall MuiButton-textSizeSmall css-18xqcly"]');
                                viewButton.click();
  setTimeout(function() {
                                var viewButton = document.querySelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textSecondary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textSecondary MuiButton-sizeSmall MuiButton-textSizeSmall css-18xqcly"]');
                                viewButton.click();
                                setTimeout(function() {
                                    var successRadio = document.querySelector('input[type="radio"][value="success"]');
                                    if (successRadio) {
                                        successRadio.click();

                                        setTimeout(function() {
                                            var confirmButton = document.querySelector('button[type="submit"]');
                                            if (confirmButton) {
                                                confirmButton.click();
                                            }

                                            setTimeout(function() {
                                                window.close();
                                            }, 3000);
                                        }, 2000);
                                    } else {
                                        window.close();
                                    }
                                }, 1000);
                            }, 2000);
                                 }, 2000);
                        } else {
                            alert('Der Inhalt der Zwischenablage hat nicht die Länge von 17 Zeichen.');
                            window.close();
                        }
                    });
                }, 500);
            }, 5000);
        }
    


})();