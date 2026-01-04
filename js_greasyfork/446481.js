// ==UserScript==
// @name         Vnav.io In-Game Time Overlay
// @namespace    https://gist.github.com/JustaSqu1d/8314ae50960cd16ae833a7148868820e
// @version      1.3.2
// @description  A Vnav.io In-Game Time display. For World Record attempts and general usage.
// @author       JustaSqu1d (https://github.com/JustaSqu1d)
// @match        https://vnav.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446481/Vnavio%20In-Game%20Time%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/446481/Vnavio%20In-Game%20Time%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Add HTML elements

    console.log('Vnav.io In-Game Time Overlay v1.3.2 Loaded');

    const button = document.createElement("button");

    const textContainer = document.createElement("div");

    function updateSettings() {
        showTime = document.getElementById("time").checked;
        showRatio = document.getElementById("ratio").checked;
        showPrediction = document.getElementById("pred").checked;
        showWR = document.getElementById("wr").checked;
        lock = document.getElementById("lock").checked;
        updateText();
    };

    function settings() {
        div.style.position = "absolute";
        div.style.width = window.innerWidth / 3 + "px";
        div.style.height = window.innerHeight + "px";
        div.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        div.style.zIndex = "1";
        div.innerHTML = `
        <br>
        <br>
        <table style="color: white"> 
        <tr>
            <th>Show Time</th>
            <th><input id="time" type="checkbox" ${showTime ? "checked" : ""}/></th>
        </tr>
        <tr>
            <th>Show Ratio</th>
            <th><input id="ratio" type="checkbox" ${showRatio ? "checked" : ""}/></th>
        </tr>
        <tr>
            <th>Show Prediction</th>
            <th><input id="pred" type="checkbox" ${showPrediction ? "checked" : ""}/></th>
        </tr>
        <tr>
            <th>Show WR</th>
            <th><input id="wr" type="checkbox" ${showWR ? "checked" : ""}/></th>
        </tr>
        <tr>
            <th>Lock Overlay</th>
            <th><input id="lock" type="checkbox" ${lock ? "checked" : ""}/></th>
        </tr>
        </table>`;

        var apply = document.createElement("button");
        apply.innerHTML = "Apply";
        apply.style.color = "white";
        apply.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        apply.style.fontSize = "20px";
        apply.style.height = "50px";
        apply.style.position = "absolute";
        apply.style.zIndex = "2";
        apply.onclick = updateSettings;

        div.appendChild(apply);

        showSettings = !showSettings;
        if (showSettings) {
            button.innerHTML = "<";
            document.body.append(div);
        } else {
            button.innerHTML = ">";
            document.body.removeChild(div);
        };
    };

    textContainer.style.position = "absolute";
    textContainer.style.top = "75px";
    textContainer.style.left = "25px";
    textContainer.style.zIndex = "0";

    document.body.appendChild(textContainer);
    document.body.append(button);

    button.innerHTML = ">";
    button.style.color = "white";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    button.style.fontSize = "20px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.position = "absolute";
    button.style.zIndex = "2";
    button.onclick = settings;

    // Set variables
    var time = '0:00:000';
    var start = 0;
    var present = 0;
    var fontSizeIndex = 4;
    var showText = true;
    var ratio = '-/min';
    var alive = false;
    var rawRatio = 0;
    var death = 0;
    var ship = "Auto 4";
    var gamemode = "FFA";
    var wr = "Fetching...";
    var categoryIndex = 0;
    var clicked = false;
    var oldCategoryIndex = categoryIndex;

    var showSettings = false;
    var showTime = false;
    var showRatio = false;
    var showPrediction = false;
    var showWR = false;
    var lock = false;

    if (localStorage.getItem("showTime") == "true") {
        showTime = true;
    } else {
        localStorage.setItem("showTime", "true");
    }

    if (localStorage.getItem("showRatio") == "true") {
        showRatio = true;
    } else {
        localStorage.setItem("showRatio", "true");
    }

    if (localStorage.getItem("showPrediction") == "true") {
        showPrediction = true;
    } else {
        localStorage.setItem("showPrediction", "true");
    }

    if (localStorage.getItem("showWR") == "true") {
        showWR = true;
    } else {
        localStorage.setItem("showWR", "true");
    }

    if (localStorage.getItem("fontSizeIndex") != fontSizeIndex) {
        fontSizeIndex = localStorage.getItem("fontSizeIndex");
    }

    var div = document.createElement("div");

    const fontSizes = ["xx-small",
        "x-small",
        "small",
        "medium",
        "large",
        "x-large",
        "xx-large"
    ];
    const categories = ["High Score",
        "Fast 500k",
        "Fast 1m",
        "Fast 1,5m"
    ];

    updateText();
    events.addEventListener('spawn', function () {
        resetTimes();

        alive = true;
        start = new Date();
        start = start.getTime();
        start = start / 1000;
    });

    events.addEventListener('spawn', function () {
        ship = network.mockups[world.player.type].name;
    });

    events.addEventListener('death', function () {
        alive = false;
        death = new Date();
        death = death.getTime();
        death /= 1000;

        var timeDelta2 = death - start;
        var hours = parseInt(timeDelta2 / 3600);
        timeDelta2 -= hours * 3600;
        var minutes = parseInt(timeDelta2 / 60);
        timeDelta2 -= minutes * 60;
        var seconds = parseInt(timeDelta2);
        timeDelta2 -= seconds;
        var milliseconds = parseInt(timeDelta2 * 1000);

        if (milliseconds.toString().length == 1) {
            milliseconds = "00" + milliseconds;
        }
        else if (milliseconds.toString().length == 2) {
            milliseconds = "0" + milliseconds;
        };

        if (parseInt(seconds) !== 60) {
            let addZero = (parseInt(seconds)).toString().length == 1 ? '0' : '';
            seconds = `${addZero}${parseInt(seconds)}`;
        } else {
            if (parseInt(minutes) !== 60) {
                seconds = '00';
                minutes = `${parseInt(minutes)}`;
            } else {
                seconds = '00';
                minutes = '00';
                hours = `${parseInt(hours)}`;
            };
        };

        if (hours == 0) {
            time = `${minutes}:${seconds}.${milliseconds}`;
        }
        else {
            time = `${hours}:${minutes}:${seconds}.${milliseconds}`;
        }
        updateText();
    });

    // Reset times at the start of each round
    function resetTimes() {
        time = '0:00:000';
        start = 0;
        present = 0;
        ratio = '-/min';
    };
    // Make the DIV element draggable:
    dragElement(textContainer);

    function dragElement(elmnt) {
        if (lock) {
            return;
        }
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            if (lock) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            if (lock) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            if (lock) {
                return;
            }
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    // Press X to toggle text; O to increase size; L to decrease size
    document.body.onkeydown = function (e) {
        if (e.key == "x") {
            if (showText == false) {
                textContainer.style.opacity = '100%';
                button.style.opacity = '100%';
                showText = true;
            } else {
                textContainer.style.opacity = '0%';
                button.style.opacity = '0%';
                showText = false;
            };
        }
        else if (e.key == "o") {
            if (fontSizeIndex < 6) fontSizeIndex += 1;
        }
        else if (e.key == "l") {
            if (fontSizeIndex > 0) fontSizeIndex -= 1;
        }
        if (showWR) {
            if ((e.key == "[") && (showWR)) {
                if (categoryIndex < 3) categoryIndex += 1;
                else { categoryIndex = 0 };
                clicked = true;
                sleep(500).then(() => {
                    clicked = false;
                });
            }
            else if ((e.key == "]") && (showWR)) {
                if (categoryIndex > 0) categoryIndex -= 1;
                else { categoryIndex = 3 };

                clicked = true;
                sleep(500).then(() => {
                    clicked = false;
                });
            };
        };
        updateText();
    };

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    // Update text
    function updateText() {
        var score = world.player.score.value;
        if (score < 500000) {
            var target = 500000;
        }
        else {
            var target = score - (score % 1000000) + 1000000;
        };
        var ratioCal = rawRatio;
        if (ratioCal == 0) {
            var estTimeFormated = "500k: -:-";
        }
        else {
            var estTime = target / ratioCal;
            var hours = parseInt(estTime / 60);
            estTime -= hours * 60;
            var minutes = parseInt(estTime);
            estTime -= minutes;
            var seconds = parseInt(estTime * 60);

            if (seconds.toString().length == 1) {
                seconds = "0" + seconds;
            }
            if (minutes.toString().length == 1 && hours !== 0) {
                minutes = "0" + minutes;
            }

            if (hours == 0) {
                var formatTimeEst = `${minutes}:${seconds}`;
            }
            else {
                var formatTimeEst = `${hours}:${minutes}:${seconds}`;
            }
            if (target !== 500000) { var estTimeFormated = `${intToString(target)}: ${formatTimeEst}`; }
            else { var estTimeFormated = `500k: ${formatTimeEst}`; };
        };
        textContainer.style.fontSize = fontSizes[fontSizeIndex];

        textContainer.innerHTML = `<div class = "parent" style='font-style:normal'></div>`;
        if (showTime) {
            textContainer.innerHTML += `<div class="child" style='color:#03fc7f'>${time}</text>`;
        };
        if (showRatio) {
            textContainer.innerHTML += `<div class="child" style='color:#44d9ff'>${ratio}</text>`;
        };
        if (showPrediction) {
            textContainer.innerHTML += `<div class="child" style='color:#fa4983'>${estTimeFormated}</text>`;
        };
        if (showWR) {
            textContainer.innerHTML += `<div class="child" style='color:#eee154'>WR: ${wr}</text>`;
        };

        if (clicked) {
            textContainer.innerHTML += `
            <div class="child" style='color:#8466dc'>Category: ${categories[categoryIndex]}</text>`;
        };

    };

    function intToString(value) {
        var suffixes = ["", "k", "m", "b", "t"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
        if (shortValue % 1 != 0) {
            shortValue = shortValue.toFixed(1);
        };
        return shortValue + suffixes[suffixNum];
    };

    function numberWithCommas(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    function fetchWorldRecord() {
        const request = new XMLHttpRequest();

        request.addEventListener("readystatechange", () => {
            var category = categories[categoryIndex];
            if (request.readyState == 4) {
                var wrData = JSON.parse(request.responseText);
                if (wrData.hours + wrData.minutes + wrData.seconds == 0) {
                    wr = `None`;
                }
                else if (category.includes("Fast")) {
                    if (wrData.seconds.toString().length == 1) {
                        wrData.seconds = "0" + wrData.seconds;
                    };
                    if (wrData.minutes.toString().length == 1 && wrData.hours !== 0) {
                        wrData.minutes = "0" + wrData.minutes;
                    };
                    if (wrData.hours == 0) {
                        wr = `${wrData.minutes}:${wrData.seconds}`;
                    }
                    else {
                        wr = `${wrData.hours}:${wrData.minutes}:${wrData.seconds}`;
                    };
                }
                else {
                    wr = `${numberWithCommas(wrData.score)}`;
                };
            };
        });

        request.open('POST', 'https://vnavwr.up.railway.app/api/');
        request.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({
            "ship": ship,
            "mode": gamemode,
            "category": categories[categoryIndex],
            "place": "1"
        });
        request.send(data);
    };

    // Main code (runs 250 times a second)
    setInterval(() => {
        if (alive) {
            present = new Date();
            present = present.getTime() / 1000;
            // present -= 1;
            var timeDelta = present - start;

            // Get time and display on main timer
            var timeDelta2 = timeDelta;
            var hours = parseInt(timeDelta2 / 3600);
            timeDelta2 -= hours * 3600;
            var minutes = parseInt(timeDelta2 / 60);
            timeDelta2 -= minutes * 60;
            var seconds = parseInt(timeDelta2);
            timeDelta2 -= seconds;
            var milliseconds = parseInt(timeDelta2 * 1000);

            if (milliseconds.toString().length == 1) {
                milliseconds = "00" + milliseconds;
            }
            else if (milliseconds.toString().length == 2) {
                milliseconds = "0" + milliseconds;
            };

            if (parseInt(seconds) !== 60) {
                let addZero = (parseInt(seconds)).toString().length == 1 ? '0' : '';
                seconds = `${addZero}${parseInt(seconds)}`;
            } else {
                if (parseInt(minutes) !== 60) {
                    seconds = '00';
                    minutes = `${parseInt(minutes)}`;
                } else {
                    seconds = '00';
                    minutes = '00';
                    hours = `${parseInt(hours)}`;
                };
            };
            if (hours == 0) {
                time = `${minutes}:${seconds}:${milliseconds}`;
            }
            else {
                time = `${hours}:${minutes}:${seconds}:${milliseconds}`;
            };

            // Calculate and display ratio

            if (start != 0) {
                ratio = (world.player.score.value / (timeDelta / 60));
                rawRatio = (world.player.score.value / (timeDelta / 60));
            }
            else {
                ratio = 0;
            };
            if (timeDelta <= 15) {
                ratio = '-';
                rawRatio = 0;
            } else if (ratio >= 1000000) {
                ratio /= 1000000;
                ratio = ratio.toFixed(2);
                ratio = ratio + 'm';
            } else if (ratio >= 1000) {
                ratio /= 1000;
                ratio = ratio.toFixed(2);
                ratio = ratio + 'k';
            } else ratio = Math.round(ratio);
            ratio = ratio + '/min';

            // Update text
            updateText();
        };
    }, 4);

    //Checking player ship every second
    setInterval(() => {
        if (!showTime) {
            localStorage.setItem("showTime", "false");
        }
        else if (localStorage.getItem("showTime") == "true") {
            showTime = true;
        }
        else {
            localStorage.setItem("showTime", "true");
        };

        if (!showRatio) {
            localStorage.setItem("showRatio", "false");
        }
        else if (localStorage.getItem("showRatio") == "true") {
            showRatio = true;
        }
        else {
            localStorage.setItem("showRatio", "true");
        };

        if (!showPrediction) {
            localStorage.setItem("showPrediction", "false");
        }
        else if (localStorage.getItem("showPrediction") == "true") {
            showPrediction = true;
        }
        else {
            localStorage.setItem("showPrediction", "true");
        };

        if (!showWR) {
            localStorage.setItem("showWR", "false");
        }
        else if (localStorage.getItem("showWR") == "true") {
            showWR = true;
        }
        else {
            localStorage.setItem("showWR", "true");
        };

        if (localStorage.getItem("fontSizeIndex") != fontSizeIndex) {
            localStorage.setItem("fontSizeIndex", fontSizeIndex);
        }

        if (alive && (ship != network.mockups[world.player.type].name || oldCategoryIndex !== categoryIndex)) {
            ship = network.mockups[world.player.type].name;
            fetchWorldRecord();
        };
        oldCategoryIndex = categoryIndex;
        if (window.gamemode == "ffa") {
            gamemode = "FFA";
            fetchWorldRecord();
        }
        else {
            gamemode = "2 Teams";
            fetchWorldRecord();
        };
    }, 1000);
})();