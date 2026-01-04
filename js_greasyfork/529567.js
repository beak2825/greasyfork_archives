// ==UserScript==
// @name         GIPHY legacy gifmaker export to GIF
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dump canvas to GIF
// @author       CODEX & RZR1911
// @match        https://giphy.com/create/gifmaker*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529567/GIPHY%20legacy%20gifmaker%20export%20to%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/529567/GIPHY%20legacy%20gifmaker%20export%20to%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GetGiphyLegacyCanvas() {
        const ReactCanvas = document.getElementsByClassName('LseTRCTVuhsl6arwQUvpF')[0];
        if (!ReactCanvas) {
            console.error(`Failed to find React canvas for legacy gif maker.`);
            return null;
        }

        const FiberKey = Object.keys(ReactCanvas).find(key => key.startsWith("__reactFiber$"));
        if (!FiberKey) {
            console.error(`Failed to find react fiber key for ${ReactCanvas}`);
            return null;
        }

        let FiberNode = ReactCanvas[FiberKey];
        while (FiberNode) {
            if (FiberNode.stateNode && typeof FiberNode.stateNode.getWrappedComponent === "function") {
                return FiberNode.stateNode.getWrappedComponent();
            }
            FiberNode = FiberNode.return;
        }

        console.error(`Failed to find canvas from react fibernode ${ReactCanvas[FiberKey]}`);
        return null;
    }

    function createGIF(framesArray) {
        const firstFrame = framesArray[0];
        const gif = new GIF({
            workers: 4,
            quality: 8,
            width: firstFrame.data.width,
            height: firstFrame.data.height,
            workerScript: '/static/public/workers/gif.worker.js',
        });

        framesArray.forEach(frame => {
            console.log(frame);
            gif.addFrame(frame.data, {
                delay: frame.delay,
                copy: true
            });
        });

        gif.on('finished', function(blob) {
            console.log('finished');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'giphy_export.gif';
            link.click();
            URL.revokeObjectURL(url);
        });

        gif.render();
        console.log('rendering');
    }

    function ExportGif() {
        const canvasComponent = GetGiphyLegacyCanvas();
        if (!canvasComponent) {
            console.error('Could not find Giphy canvas component');
            return;
        }

        const frames = canvasComponent.getFrames();
        if (!frames || !Array.isArray(frames)) {
            console.error('Failed to get frames Array from canvas');
            return;
        }

        createGIF(frames);
    }

    function observeButton() {
        const observer = new MutationObserver((mutations, obs) => {
            const buttons = document.querySelectorAll('._6WZyciPmD3H_QZtPwGaAq._1Fba10Vcpc4_UBtLy_oMYy');
            if (buttons.length > 1 && !buttons[1].textContent.includes('Export GIF')) {
                const button = buttons[1];
                console.log('Second button found', button);

                const newButton = button.cloneNode(true);
                newButton.classList.remove("_3HPxzg225YhJydf2_YUlBl");
                newButton.textContent = 'Export GIF :D';
                newButton.onclick = ExportGif;

                button.parentNode.replaceChild(newButton, button);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeButton();
})();