// ==UserScript==
// @name         Доп. функции для стандартного картографа
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      0.1
// @description  Добавляет горячую клавишу ЙйQq, позволяющую пить глотки бодрости
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/no_combat.php
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489047/%D0%94%D0%BE%D0%BF%20%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489047/%D0%94%D0%BE%D0%BF%20%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B0.meta.js
// ==/UserScript==

// TODO: Проверить, сработает способ замены как в скрипте хп бар
// TODO: Сделать обновление страницы после сообщения о смерти моба

(function() {
    'use strict';

    // Intercept document creation and modify elements
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {

                  // Get all elements added to the document
                  var addedElements = mutation.addedNodes;
                  for (var i = 0; i < addedElements.length; i++) {
                        var script = addedElements[i];

                        if (script.tagName === "SCRIPT" && script.textContent.includes('function KeyP(e)')) {
                            //console.debug(script.tagName, script.baseURI, script.textContent);
                            //console.debug("tagName:", script.tagName, "baseURI:", script.baseURI, "element.color:", script.color);
                            // Split the script content into lines
                            var lines = script.textContent.split('\n');

                            // Find the index where you want to insert your line
                            var insertionIndex = lines.findIndex(function(line) {
                                return line.includes('case 39: case 68: CheckGT(5, 2); break;');
                            });

                            // Insert your line of code
                            if (insertionIndex !== -1) {
                                lines.splice(insertionIndex + 1, 0, "  case 81: window.top.loc.inv_snd.location.href = 'inv_wear.php?id=' + 27000; break;");
                            }

                            // Join the lines back together
                            var modifiedScript = lines.join('\n');

                            // Update the script content
                            script.textContent = modifiedScript;
                            observer.disconnect();
                        }
                  }
            }
        });
    });

    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });
})();