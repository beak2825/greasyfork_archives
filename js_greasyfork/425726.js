// ==UserScript==
// @name         The Ultimate Ratio Script (time, score/min, projected times)
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  Uses time from your computer to calculate your ratio and expected time to get milestones based on that
// @author       MrCheese#4666
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425726/The%20Ultimate%20Ratio%20Script%20%28time%2C%20scoremin%2C%20projected%20times%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425726/The%20Ultimate%20Ratio%20Script%20%28time%2C%20scoremin%2C%20projected%20times%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add HTML elements
    const textContainer = document.createElement("div");
    const gui = document.createElement("div");
    document.body.appendChild(textContainer);
    document.body.appendChild(gui);

    // Enabled/disabled lines
    var dispLine1 = false;
    var dispLine2 = true;
    var dispLine3 = true;
    var dispLine4 = false;
    var dispLine5 = true;
    var dispLine6 = true;

    // Set variables
    var time = '00:00:00';
    var rawTime = 0;
    var rawRatio = 0;
    var showText = true;
    var _100k = false;
    var _500k = false;
    var _1m = false;
    var _1_5m = false;
    var _2m = false;
    var _100kTime = '100k 00:00:00';
    var _500kTime = '500k 00:00:00';
    var _1mTime = '1.0m 00:00:00';
    var _1_5mTime = '1.5m 00:00:00';
    var _2mTime = '2.0m 00:00:00';
    var ratio = '0/min';

    updateText();

    gui.outerHTML = `
<div class='parent' id='menu' style='user-select:none; position:fixed; bottom:43%; right:0.75%; text-align:center; width:7.5vw; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'>
    <div class='child' style='line-height:2vh; opacity:75%'>
        [Z] toggle menu
        [X] toggle text
        <hr>
    </div>
    <button class='child' type='button' id='button1' value='off' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#E69F6C; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button2' value='on' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#FF73FF; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button3' value='on' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#C980FF; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button4' value='off' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#71B4FF; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button5' value='on' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#FFED3F; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button6' value='on' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#FF7979; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
</div>
`;
    if (localStorage.getItem('menu') == 'hide') {
        menu.style.display = "block";
    } else {
        localStorage.setItem('menu', 'hide');
    }

    addButtonListener('button1');
    addButtonListener('button2');
    addButtonListener('button3');
    addButtonListener('button4');
    addButtonListener('button5');
    addButtonListener('button6');

    updateGui();

    function addButtonListener(id) {
        document.getElementById(id).addEventListener("click", function() {buttonAction(id)});
        document.getElementById(id).addEventListener("mouseenter", function() {lightenColor(id)});
        document.getElementById(id).addEventListener("mouseleave", function() {resetColor(id)});
    }

    function lightenColor(id) {
        document.getElementById(id).style.opacity = '100%'
    }

    function resetColor(id) {
        document.getElementById(id).style.opacity = '75%'
    }

    // Removes "diep.io" text above the minimap to preserve space (by ABC)
    const crx = CanvasRenderingContext2D.prototype;
    crx.fillText = new Proxy(crx.fillText, {
        apply: function(f, _this, args) {
            const text = args[0];
            if (args[0] === "diep.io") {
                args[0] = "";
            }
            f.apply(_this, args);
        }
    });
    crx.strokeText = new Proxy(crx.strokeText, {
        apply: function(f, _this, args) {
            const text = args[0];
            if (args[0] === "diep.io") {
                args[0] = "";
            }
            f.apply(_this, args);
        }
    });

    // Button action
    function buttonAction(id) {
        let button = document.getElementById(id);
        if (button.value == "on") button.value = "off"
        else button.value = "on"

        if (id == 'button1') {
            if (dispLine1 == true) dispLine1 = false
            else dispLine1 = true
        }
        if (id == 'button2') {
            if (dispLine2 == true) dispLine2 = false
            else dispLine2 = true
        }
        if (id == 'button3') {
            if (dispLine3 == true) dispLine3 = false
            else dispLine3 = true
        }
        if (id == 'button4') {
            if (dispLine4 == true) dispLine4 = false
            else dispLine4 = true
        }
        if (id == 'button5') {
            if (dispLine5 == true) dispLine5 = false
            else dispLine5 = true
        }
        if (id == 'button6') {
            if (dispLine6 == true) dispLine6 = false
            else dispLine6 = true
        }

        updateText();
        updateGui();
    }

    // Update GUI
    function updateGui() {
        let button1Text = '100k: ' + document.getElementById('button1').value;
        let button2Text = '500k: ' + document.getElementById('button2').value;
        let button3Text = '1.0m: ' + document.getElementById('button3').value;
        let button4Text = '1.5m: ' + document.getElementById('button4').value;
        let button5Text = '2.0m: ' + document.getElementById('button5').value;
        let button6Text = 'Ratio: ' + document.getElementById('button6').value;

        document.getElementById('button1').innerHTML = button1Text;
        document.getElementById('button2').innerHTML = button2Text;
        document.getElementById('button3').innerHTML = button3Text;
        document.getElementById('button4').innerHTML = button4Text;
        document.getElementById('button5').innerHTML = button5Text;
        document.getElementById('button6').innerHTML = button6Text;
    }

    // Reset times at the start of each round
    function resetTimes() {
        _100kTime = '100k 00:00:00';
        _500kTime = '500k 00:00:00';
        _1mTime = '1.0m 00:00:00';
        _1_5mTime = '1.5m 00:00:00';
        _2mTime = '2.0m 00:00:00';
        ratio = '0/min';
    }

    // Press X to toggle text and Z to toggle menu
    document.body.onkeydown = function(e) {
        if (e.keyCode === 88) {
            if (showText == false) {
                textContainer.style.opacity = '100%';
                showText = true;
            } else {
                textContainer.style.opacity = '0%';
                showText = false;
            }
        }

        if (e.keyCode === 90) {
            var menu = document.getElementById('menu');
            if (menu.style.display === "none") {
                menu.style.display = "block";
            } else {
                menu.style.display = "none";
            }
        }
    }

    // Get current score (by ABC)
    let _rScore = "0";
    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
        apply(fillRect, ctx, [text, x, y, ...blah]) {

            if (text.startsWith('Score: ')) _rScore = text

            fillRect.call(ctx, text, x, y, ...blah);
        }
    });

    const getScore = () => {
        if (!input.should_prevent_unload()) return -1;
        return parseFloat(_rScore.slice(7).replace(/,/g, ''));
    }

    // Parse time for projected score times
    function timeParse(score) {
        let _time = (score / rawRatio) * 60;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (_time >= 3600) {
            hours = Math.round(_time / 3600 - 0.5);
            _time -= hours * 3600;
            if (hours < 10) hours = '0' + hours;
        } else hours = '00';

        if (_time >= 60) {
            minutes = Math.round(_time / 60 - 0.5);
            _time -= minutes * 60;
            if (minutes < 10) minutes = '0' + minutes;
        } else minutes = '00';

        if (_time !== 0) {
            seconds = Math.round(_time);
            if (seconds < 10) seconds = '0' + seconds;
        } else seconds = '00';

        let parsedTime = hours + ':' + minutes + ':' + seconds;
        return parsedTime;
    }

    // Update text
    function updateText() {
        let line1 = _100kTime;
        let line2 = _500kTime;
        let line3 = _1mTime;
        let line4 = _1_5mTime;
        let line5 = _2mTime;
        let line6 = ratio;
        if (dispLine1 == false) line1 = ''
        if (dispLine2 == false) line2 = ''
        if (dispLine3 == false) line3 = ''
        if (dispLine4 == false) line4 = ''
        if (dispLine5 == false) line5 = ''
        if (dispLine6 == false) line6 = ''

        textContainer.innerHTML = `
<div class="parent" style='pointer-events:none; user-select:none; position:fixed; text-align:right; bottom:24%; right:1.3%; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:1.85vh; opacity:65%; text-shadow:black 0.18vh 0vh,black -0.18vh 0vh,black 0vh -0.18vh,black 0vh 0.18vh,black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'>
<div class="child" style='font-size:3.1vh; text-shadow:black 0.2vh 0vh, black -0.2vh 0vh, black 0vh -0.2vh, black 0vh 0.2vh, black 0.2vh 0.2vh, black -0.2vh 0.2vh, black 0.2vh -0.2vh, black -0.2vh -0.2vh, black 0.1vh 0.2vh, black -0.1vh 0.2vh, black 0.1vh -0.2vh, black -0.1vh -0.2vh, black 0.2vh 0.1vh, black -0.2vh 0.1vh, black 0.2vh -0.1vh, black -0.2vh -0.1vh'>${time}</div>
<div class="child">${line1}</div>
<div class="child">${line2}</div>
<div class="child">${line3}</div>
<div class="child">${line4}</div>
<div class="child">${line5}</div>
<div class="child">${line6}</div>
</div>
`;
    }

    // Main code (runs once a second)
    setInterval(() => {

        // Get time and display on main timer
        if (input.should_prevent_unload()) {
            let [hours, minutes, seconds] = time.split(':');
            if (parseInt(seconds) + 1 !== 60) {
                let addZero = (parseInt(seconds) + 1).toString().length == 1 ? '0' : '';
                seconds = `${addZero}${parseInt(seconds) + 1}`;
                rawTime += 1;
            } else {
                if (parseInt(minutes) + 1 !== 60) {
                    let addZero = (parseInt(minutes) + 1).toString().length == 1 ? '0' : '';
                    seconds = '00';
                    minutes = `${addZero}${parseInt(minutes) + 1}`;
                } else {
                    let addZero = (parseInt(hours) + 1).toString().length == 1 ? '0' : '';
                    seconds = '00';
                    minutes = '00';
                    hours = `${addZero}${parseInt(hours) + 1}`;
                }
            }

            time = `${hours}:${minutes}:${seconds}`;
        } else if (!input.should_prevent_unload()) {
            time = '00:00:00';
            rawTime = 0;
        }

        // Check if score is 0
        if (getScore() !== -1) {
            if (getScore() == 0) resetTimes()
            else {

                // Calculate and display ratio
                if (rawTime != 0) ratio = getScore() / (rawTime / 60);
                    else ratio = 0;
                    rawRatio = ratio;

                if (ratio >= 1000000) {
                    ratio /= 1000000;
                    ratio = ratio.toFixed(2);
                    ratio = ratio + 'm';
                } else if (ratio >= 1000) {
                    ratio /= 1000;
                    ratio = ratio.toFixed(2);
                    ratio = ratio + 'k';
                } else ratio = Math.round(ratio);
                ratio = ratio + '/min'

                // Display projected score times
                if (getScore() < 100000) {
                    _100kTime = '100k ' + timeParse(100000);
                } else if (_100k == false) {
                    _100kTime = '100k ' + time;
                    _100k = true;
                }

                if (getScore() < 500000) {
                    _500kTime = '500k ' + timeParse(500000);
                } else if (_500k == false) {
                    _500kTime = '500k ' + time;
                    _500k = true;
                }

                if (getScore() < 1000000) {
                    _1mTime = '1.0m ' + timeParse(1000000);
                } else if (_1m == false) {
                    _1mTime = '1.0m ' + time;
                    _1m = true;
                }

                if (getScore() < 1500000) {
                    _1_5mTime = '1.5m ' + timeParse(1500000);
                } else if (_1_5m == false) {
                    _1_5mTime = '1.5m ' + time;
                    _1_5m = true;
                }

                if (getScore() < 2000000) {
                    _2mTime = '2.0m ' + timeParse(2000000);
                } else if (_2m == false) {
                    _2mTime = '2.0m ' + time;
                    _2m = true;
                }
            }
        }

        // Update text
        updateText();
    }, 1000);
})();