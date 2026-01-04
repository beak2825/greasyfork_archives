// ==UserScript==
// @name         Royal Road - clean up text for Text to Speach (TTS)
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Improve use of TTS (Text to Speach) app, like ReadAloud, on RR. This script removes artfacts and stops the TTS app to ommit some words. The app also removes the footer on chapter pages because it is annoying to hear in the TTS app. The app also removes <strong>repeated special characters</strong> like stacks of 20 '=' because it is very annoying to hear in the TTS app. 
// @author       djjudjju25
// @match        https://www.royalroad.com/fiction/*/*/chapter/*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520942/Royal%20Road%20-%20clean%20up%20text%20for%20Text%20to%20Speach%20%28TTS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520942/Royal%20Road%20-%20clean%20up%20text%20for%20Text%20to%20Speach%20%28TTS%29.meta.js
// ==/UserScript==

function clean() {
    'use strict';

    removeLessGreaterThan(document.getElementsByClassName('chapter-content')[0]);

    function removeLessGreaterThan(chapter) {
        if (chapter) {
            for (let x of chapter.children) {
                x.innerHTML = x.getInnerHTML()
                    .replace(/&lt;/g, '[')
                    .replace(/&gt;/g, ']')
                    .replace(/(\b)(Iv)(\b)/g, '$1Yve$3')
                    .replace(/(\b)(Sch)/g, '$1Sh')
                    .replace(/--+/g, "‒‒")
                    .replace(/==+/g, '==')
                    .replace(/\/\/+/g, '/')
                  ;
            }
        }
    }
}

function removeFooter() {
    document.getElementsByClassName('page-prefooter')[0]?.remove();
    document.getElementsByClassName('footer')[0]?.remove();
}

removeFooter();
clean();