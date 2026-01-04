// ==UserScript==
// @name         Kodlabuyu Beta Sürüm
// @namespace    http://tampermonkey.net/
// @version      2.8.2
// @description  Bölümleri çözer, tıklamadan önce kısa bir süre bekler ve sonraki bölüme geçer.
// @author       legendsciber
// @match        https://studiokodlabuyu.kodris.com/*
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540775/Kodlabuyu%20Beta%20S%C3%BCr%C3%BCm.user.js
// @updateURL https://update.greasyfork.org/scripts/540775/Kodlabuyu%20Beta%20S%C3%BCr%C3%BCm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- TÜM BÖLÜMLERİN ÇÖZÜMLERİ ---
    const solutions = {
        '1': `forward()`,
        '2': `forward(5)`,
        '3': `forward(3)
turn(right)
forward(3)`,
        '4': `forward(3)
turn(right)
forward(3)`,
        '5': `forward(3)
turn(right)
forward(3)`,
        '6': `turn(back)
forward(4)`,
        '7': `turn(back)
forward(3)
turn(left)
forward(2)`,
        '8': `forward()
getCarrot()`,
        '9': `forward(4)
turn(left)
forward(4)
getCarrot()`,
        '10': `forward()
forwardUp()
forward(2)
getCorn()`,
        '11': `forward(3)
turn(left)
forward(2)
turn(left)
forwardUp()
turn(right)
forward(4)
turn(right)
forward(3)
getCorn()`,
        '12': `forward(4)
forwardDown()
forward()
getCorn()`,
        '13': `forward(3)
turn(right)
forward()
forwardUp()
forward(4)
turn(left)
forward(3)
forwardDown()
forward()
getCorn()`,
        '14': `forward(7)
turn(left)
forward(2)
turn(left)
forward(2)
forwardUp()
forward(3)
turn(right)
forward(2)
forwardDown()
forward(3)
turn(right)
forward(4)
getCorn()`,
        '15': `forward(3)
turn(right)
forward(3)
forwardUp(2)
forward()
turn(left)
forwardDown(2)
forward(3)
getCorn()`,
        '16': `turtle.forward(3)
forward(6)
getBanana()`,
        '17': `turtle.forward(2)
forward(2)
turn(back)
turtle.forward(2)
forward(2)
getBanana()`,
        '18': `turtle.forward(2)
forward(5)
getBanana()
turn(back)
forward(2)
turtle.forward(2)
forward(2)
turn(back)
getBanana()
forward(4)
getBanana()`,
        '19': `forward()
forwardUp()
forward()
forwardDown()
forward(2)
getBanana()
forward()
turn(right)
turtle.forward(7)
forward(4)
getBanana()
turn(right)
forward()
forwardUp(2)
forwardDown(2)
forward()
turn(left)
forward(2)
getBanana()`,
        '20': `turtle.forward(2)
forward(3)
forwardUp()
forwardDown()
forward()
getBanana()
turn(left)
forward()
forwardUp()
forwardDown()
forward()
getBanana()
turn(left)
forward()
forwardUp()
forwardDown()
turtle.forward(4)
forward(3)
turn(left)
forward(2)
getBanana()`,
        '21': `repeat 3:
    forward()
    getBone()`,
        '22': `repeat 6:
    forward()
    getBone()`,
        '23': `repeat 3:
    forward(3)
    turn(right)
    getBone()`,
        '24': `repeat 3:
    turn(left)
    forward(4)
    getBone()`,
        '25': `repeat 5:
    turn(left)
    forward()
    getBone()
    turn(right)
    forward()
    getBone()`,
        '26': `repeat 3:
    turn(right)
    forward(2)
    getBone()
    turn(left)
    forward(2)
    getBone()`,
        '27': `repeat 3:
    forward()
    forwardUp()
    getBone()
    forwardDown()`,
        '28': `repeat 3:
    forwardUp()
    getBone()
    forwardDown()
    forwardUp()
    getBone()
    turn(left)
    forwardDown()`,
        '29': `repeat 3:
    turn(right)
    forwardUp(2)
    getBone()
    forwardDown(2)
    forward()`,
        '30': `repeat 3:
    turn(left)
    forwardUp()
    getBone()
    forwardDown()
    turn(right)
    forward(2)`,
            '31': `repeat 2:
    forward(3)
    getBone()
    turn(back)
    forward(3)`,
        '32': `repeat 4:
    forward(3)
    getBone()
    turn(back)
    forward(3)
    turn(right)`,
        '33': `repeat 4:
    forward()
    forwardUp()
    forwardDown()
    forward()
    getBone()
    turn(back)
    forward()
    forwardUp()
    forwardDown()
    forward()
    turn(right)`,
      '34': `repeat 2:
    turtle.forward(2)
    forward(2)
    getBone()
    turn(back)
    forward(2)
    turn(back)`,
        '35': `turtle.turn(left)
turtle.forward(3)
turtle.turn(right)
repeat 4:
    forward(2)
    getBone()
    turn(back)
    forward(2)
    turn(back)
    turtle.forward(2)`,
        '36': `turtle.forward(2)
turtle.turn(left)
repeat 4:
    forward(2)
    getBone()
    turn(back)
    forward(2)
    turtle.forward(2)`,
        '37': `repeat 4:
    turtle.forward(2)
    forward(2)
    getBone()
    turn(back)
    forward(4)
    getBone()
    turn(back)
    forward(2)`,
        '38': `forward()
turtle.turn(right)
repeat 3:
    turtle.forward(2)
    forward()
    getBone()
    turn(back)
    forward()`,
        '39': `forward()
turtle.turn(right)
repeat 3:
    turtle.forward(2)
    forward()
    getBone()
    turn(back)
    forward(2)
    getBone()
    turn(back)
    forward()`,
        '40': `repeat 4:
    forward(2)
    turn(left)
    forward(2)
    turn(right)
getBone()`,
        '41': `a=3
forward(a)
getBanana()`,
        '42': `a=3
forward(a)
getBanana()
forward(a)
getBanana()`,
        '43': `a=3
repeat a:
    forward(a)
    getBanana()
    turn(right)`,
        '44': `a=3
forward(a)
getBanana()
turtle.forward(a)
forward(a)
getBanana()`,
        '45': `a=2
turtle.forward(a)
repeat 3:
    forward(a)
    getBanana()`,
        '46': `a=2
forward()
forwardUp(a)
forward()
forwardDown(a)
forward(a)
getBanana()`,
        '47': `a=2
forward(a)
forwardUp(a)
forward()
forwardDown(a)
forward()
getBanana()
turn(left)
forward()
forwardUp(a)
forward()
forwardDown(a)
forward()
getBanana()`,
        '48': `a=3
forward()
forwardUp(a)
forward()
forwardDown(a)
forward()
getBanana()
turn(left)
repeat 2:
    forward(a)
    getBanana()`,
        '49': `a=3
repeat 2:
    forward()
    forwardUp(a)
    forward()
    forwardDown(a)
    getBanana()
    turn(right)`,
        '50': `a=2
forward(a)
forwardUp(a)
turn(right)
forwardDown(a)
forward(a)
getBanana()
b=3
forwardUp(b)
turn(right)
forwardDown(b)
forwardUp(b)
turn(right)
forwardDown(b)
turtle.forward(7)
forward(5)
getBanana()`
    };
    // -----------------------------------------------------------------

    let sceneStatus = {};
    setInterval(masterController, 500);

    function isElementVisible(el) {
        if (!el) return false;
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    function masterController() {
        const match = window.location.hash.match(/#scene\/(\d+)/);
        if (!match) return;

        const currentScene = match[1];
        if (!sceneStatus[currentScene]) {
            sceneStatus[currentScene] = { popupClosed: false, codeModeEntered: false, codeInjected: false };
        }
        const status = sceneStatus[currentScene];

        if (status.codeInjected) {
            const nextButton = document.querySelector('a.btn.big.next');
            if (isElementVisible(nextButton)) {
                nextButton.click();
            }
            return;
        }

        if (!status.popupClosed) {
            const okButton = document.querySelector('a.btn.big:not(.next)');
            if (isElementVisible(okButton)) {
                okButton.click();
                status.popupClosed = true;
            }
            return;
        }

        if (!status.codeModeEntered) {
            const codeModeButton = document.querySelector('#codeMode');
            if (isElementVisible(codeModeButton)) {
                codeModeButton.click();
                status.codeModeEntered = true;
            }
            return;
        }

        const solutionCode = solutions[currentScene];
        const runButton = document.querySelector('a.tip.tool.run');
        const editorContainer = document.getElementById('editor');

        if (solutionCode && typeof ace !== 'undefined' && editorContainer && runButton) {
            const editor = ace.edit(editorContainer);
            if (editor && editor.getValue().trim() !== solutionCode.trim()) {
                editor.setValue(solutionCode, 1);
                editor.clearSelection();

                setTimeout(function() {
                    runButton.click();
                }, 100);

                status.codeInjected = true;
                console.log(`Bölüm ${currentScene} için kod çalıştırıldı.`);
            }
        }
    }
})();