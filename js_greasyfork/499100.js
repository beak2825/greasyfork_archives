// ==UserScript==
// @name         tallent+rotate+yy+range
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  only for my environment [,.\ f vbn]
// @author       AstRatJP
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499100/tallent%2Brotate%2Byy%2Brange.user.js
// @updateURL https://update.greasyfork.org/scripts/499100/tallent%2Brotate%2Byy%2Brange.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // auto tallent getter
    const canvas = document.querySelector('canvas');
    const mouseDownTime = 300;
    const mouseDrugTime = 940;
    const buffer = 80;
    const basicTime = 800;

    function dragFromTo(x1, y1, x2, y2) {
        const mousemoveEvent1 = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x1,
            clientY: y1
        });
        const mousemoveEvent2 = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x2,
            clientY: y2
        });
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x1,
            clientY: y1
        });
        const mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x2,
            clientY: y2
        });
        canvas.dispatchEvent(mousemoveEvent1);
        canvas.dispatchEvent(mousedownEvent);
        setTimeout(() => {
            canvas.dispatchEvent(mousemoveEvent2);
            setTimeout(() => canvas.dispatchEvent(mouseupEvent), 100);
        }, 100);
    }

    function mousedown(x, y) {
        const mousemoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        canvas.dispatchEvent(mousemoveEvent);
        canvas.dispatchEvent(mousedownEvent);
    }

    function mouseup(x, y) {
        const mousemoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        const mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        canvas.dispatchEvent(mousemoveEvent);
        canvas.dispatchEvent(mouseupEvent);
    }

    const keydownL = new KeyboardEvent('keydown', {
        key: 'l',
        keyCode: 76,
        code: 'KeyL',
        which: 76,
        bubbles: true,
        cancelable: true
    });

    const keyupL = new KeyboardEvent('keyup', {
        key: 'l',
        keyCode: 76,
        code: 'KeyL',
        which: 76,
        bubbles: true,
        cancelable: true
    });

    const keydown8 = new KeyboardEvent('keydown', {
        key: '8',
        keyCode: 56,
        code: 'Key8',
        which: 56,
        bubbles: true,
        cancelable: true
    });

    const keyup8 = new KeyboardEvent('keyup', {
        key: '8',
        keyCode: 56,
        code: 'Key8',
        which: 56,
        bubbles: true,
        cancelable: true
    });

    const keydown0 = new KeyboardEvent('keydown', {
        key: '0',
        keyCode: 48,
        code: 'Key0',
        which: 48,
        bubbles: true,
        cancelable: true
    });

    const keyup0 = new KeyboardEvent('keyup', {
        key: '0',
        keyCode: 48,
        code: 'Key0',
        which: 48,
        bubbles: true,
        cancelable: true
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === '.') {
            mousedown(30, 710); //open talent
            mouseup(30, 710);
            setTimeout(() => { //reset tarent
                mousedown(510, 770);
                mouseup(510, 770);
            }, 250);
            setTimeout(() => { //drag
                dragFromTo(82, 648, 584, 425);
            }, basicTime);
            setTimeout(() => { //reach
                mousedown(77, 533);
                setTimeout(() => {
                    mouseup(77, 533);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime);
            setTimeout(() => { //antennae
                mousedown(286, 644);
                setTimeout(() => {
                    mouseup(286, 644);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime + mouseDownTime + buffer);
            setTimeout(() => { //loadout+mag
                mousedown(546, 500);
                setTimeout(() => {
                    mouseup(546, 500);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime + 2 * mouseDownTime + 2 * buffer);
            setTimeout(() => { //drag
                dragFromTo(434, 639, 59, 622);
            }, basicTime + mouseDrugTime + 3 * mouseDownTime + 3 * buffer);
            setTimeout(() => { //reload
                mousedown(83, 671);
                setTimeout(() => {
                    mouseup(83, 671);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 3 * mouseDownTime + 3 * buffer);
            setTimeout(() => { //rotation
                mousedown(194, 521);
                setTimeout(() => {
                    mouseup(194, 521);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 4 * mouseDownTime + 4 * buffer);
            setTimeout(() => { //second chance
                mousedown(441, 563);
                setTimeout(() => {
                    mouseup(441, 563);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 5 * mouseDownTime + 5 * buffer);
            setTimeout(() => { //medic
                mousedown(532, 730);
                setTimeout(() => {
                    mouseup(532, 730);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 6 * mouseDownTime + 6 * buffer);
            setTimeout(() => { //drag
                dragFromTo(546, 488, 0, 485);
            }, basicTime + 2 * mouseDrugTime + 7 * mouseDownTime + 7 * buffer);
            setTimeout(() => { //poison
                mousedown(345, 378);
                setTimeout(() => {
                    mouseup(345, 378);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 7 * mouseDownTime + 7 * buffer);
            setTimeout(() => { //concentrated poison
                mousedown(544, 470);
                setTimeout(() => {
                    mouseup(544, 470);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 8 * mouseDownTime + 8 * buffer);
            setTimeout(() => { //close
                mousedown(534, 320);
                mouseup(534, 320);
            }, basicTime + 3 * mouseDrugTime + 9 * mouseDownTime + 9 * buffer);
        }

        if (event.key === ',') {
            mousedown(30, 710); //open talent
            mouseup(30, 710);
            setTimeout(() => { //reset tarent
                mousedown(510, 770);
                mouseup(510, 770);
            }, 250);
            setTimeout(() => { //drag
                dragFromTo(82, 648, 584, 425);
            }, basicTime);
            setTimeout(() => { //dupe
                mousedown(259, 451);
                setTimeout(() => {
                    mouseup(259, 451);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime);
            setTimeout(() => { //loadout+mag
                mousedown(546, 500);
                setTimeout(() => {
                    mouseup(546, 500);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime + 1 * mouseDownTime + 1 * buffer);
            setTimeout(() => { //drag
                dragFromTo(434, 639, 59, 622);
            }, basicTime + mouseDrugTime + 2 * mouseDownTime + 2 * buffer);
            setTimeout(() => { //reload
                mousedown(83, 671);
                setTimeout(() => {
                    mouseup(83, 671);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 2 * mouseDownTime + 2 * buffer);
            setTimeout(() => { //health
                mousedown(473, 488);
                setTimeout(() => {
                    mouseup(473, 488);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 3 * mouseDownTime + 3 * buffer);
            setTimeout(() => { //second chance
                mousedown(441, 563);
                setTimeout(() => {
                    mouseup(441, 563);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 4 * mouseDownTime + 4 * buffer);
            setTimeout(() => { //drag
                dragFromTo(480, 601, 237, 598);
            }, basicTime + 2 * mouseDrugTime + 5 * mouseDownTime + 5 * buffer);
            setTimeout(() => { //medic
                mousedown(156, 431);
                setTimeout(() => {
                    mouseup(156, 431);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 5 * mouseDownTime + 5 * buffer);
            setTimeout(() => { //sharp
                mousedown(386, 679);
                setTimeout(() => {
                    mouseup(386, 679);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 6 * mouseDownTime + 6 * buffer);
            setTimeout(() => { //close
                mousedown(534, 320);
                mouseup(534, 320);
            }, basicTime + 3 * mouseDrugTime + 7 * mouseDownTime + 7 * buffer);
            setTimeout(() => {
                const mousedownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2,
                });
                canvas.dispatchEvent(mousedownEvent); //right click
                canvas.dispatchEvent(keydownL); //bubble build
                canvas.dispatchEvent(keydown8);
                setTimeout(() => {
                    canvas.dispatchEvent(keyup8);
                    canvas.dispatchEvent(keyupL);
                }, 100)
            }, basicTime + 3 * mouseDrugTime + 7 * mouseDownTime + 8 * buffer);
        }

        if (event.key === '\\') {
            mousedown(30, 710); //open talent
            mouseup(30, 710);
            setTimeout(() => { //reset tarent
                mousedown(510, 770);
                mouseup(510, 770);
            }, 250);
            setTimeout(() => { //drag
                dragFromTo(82, 648, 584, 425);
            }, basicTime);
            setTimeout(() => { //loadout+mag
                mousedown(546, 500);
                setTimeout(() => {
                    mouseup(546, 500);
                }, mouseDownTime)
            }, basicTime + mouseDrugTime);
            setTimeout(() => { //drag
                dragFromTo(434, 639, 59, 622);
            }, basicTime + mouseDrugTime + 1 * mouseDownTime + 1 * buffer);
            setTimeout(() => { //reload
                mousedown(83, 671);
                setTimeout(() => {
                    mouseup(83, 671);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 1 * mouseDownTime + 1 * buffer);
            setTimeout(() => { //health
                mousedown(274, 402);
                setTimeout(() => {
                    mouseup(274, 402);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 2 * mouseDownTime + 2 * buffer);
            setTimeout(() => { //second chance
                mousedown(441, 563);
                setTimeout(() => {
                    mouseup(441, 563);
                }, mouseDownTime)
            }, basicTime + 2 * mouseDrugTime + 3 * mouseDownTime + 3 * buffer);
            setTimeout(() => { //drag
                dragFromTo(480, 601, 237, 598);
            }, basicTime + 2 * mouseDrugTime + 4 * mouseDownTime + 4 * buffer);
            setTimeout(() => { //medic
                mousedown(417, 579);
                setTimeout(() => {
                    mouseup(417, 579);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 4 * mouseDownTime + 4 * buffer);
            setTimeout(() => { //sharp
                mousedown(492, 415);
                setTimeout(() => {
                    mouseup(492, 415);
                }, mouseDownTime)
            }, basicTime + 3 * mouseDrugTime + 5 * mouseDownTime + 5 * buffer);
            setTimeout(() => { //close
                mousedown(534, 320);
                mouseup(534, 320);
            }, basicTime + 3 * mouseDrugTime + 6 * mouseDownTime + 6 * buffer);
            setTimeout(() => {
                const mousedownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2,
                });
                canvas.dispatchEvent(mousedownEvent); //right click
                canvas.dispatchEvent(keydownL); //ramming flower
                canvas.dispatchEvent(keydown0);
                setTimeout(() => {
                    canvas.dispatchEvent(keyup0);
                    canvas.dispatchEvent(keyupL);
                }, 100)
            }, basicTime + 3 * mouseDrugTime + 7 * mouseDownTime + 8 * buffer);
        }
    });
    canvas.addEventListener('mousedown', (event) => {
        console.log(`mousedown at:　(${event.clientX}, ${event.clientY});`);
    });
    canvas.addEventListener('mouseup', (event) => {
        console.log(`mouseup at:　(${event.clientX}, ${event.clientY});`);
    });









    // te range
    var acanvas;
    var actx;
    let display = false;
    const range = [140,325,420];
    let rangeIndex = range.length-1;

    setTimeout(() => {
        acanvas = document.getElementById("canvas");
        actx = acanvas.getContext("2d");
        drawRange();
    }, 2000);

    function drawRange() {
        if (display) {
            actx.beginPath();
            actx.strokeStyle = "#ff6347";
            actx.lineWidth = 3;
            actx.arc(acanvas.width / 2, acanvas.height / 2, range[rangeIndex], 0, 2 * Math.PI);
            actx.stroke();
        }

        requestAnimationFrame(drawRange);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'f') display = !display;
    });

    document.addEventListener('wheel', (e) => {
        if (e.deltaY < 0) {
            rangeIndex++;
        } else {
            rangeIndex--;
        }
        console.log(range);
        if (rangeIndex < 0) rangeIndex = 0;
        if (rangeIndex > range.length-1) rangeIndex = range.length-1;
    });






    // rotate speed controllor
    function pressQKey() {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'q',
            keyCode: 81,
            code: 'KeyQ',
            which: 81,
            bubbles: true,
            cancelable: true
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'q',
            keyCode: 81,
            code: 'KeyQ',
            which: 81,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(keydownEvent);
        setTimeout(() => document.dispatchEvent(keyupEvent), 10);
    }

    function pressEKey() {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'e',
            keyCode: 69,
            code: 'KeyE',
            which: 69,
            bubbles: true,
            cancelable: true
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'e',
            keyCode: 69,
            code: 'KeyE',
            which: 69,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(keydownEvent);
        setTimeout(() => document.dispatchEvent(keyupEvent), 10);
    }

    function press4Key() {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: '4',
            keyCode: 52,
            code: 'Key4',
            which: 52,
            bubbles: true,
            cancelable: true
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            key: '4',
            keyCode: 52,
            code: 'Key4',
            which: 52,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(keydownEvent);
        document.dispatchEvent(keyupEvent);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'v' || e.keyCode === 86) {
            press4Key();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'b' || e.keyCode === 66) {
            pressQKey();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'n' || e.keyCode === 78) {
            pressEKey();
        }
    });

})();