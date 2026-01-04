// ==UserScript==
// @name         Cyberiana AFK System
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  The most advanced AFK system for CSGOClicker v2.
// @author       Cyberiana/Anastasia
// @match        https://csgoclicker.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoclicker.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470177/Cyberiana%20AFK%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/470177/Cyberiana%20AFK%20System.meta.js
// ==/UserScript==

const sellprice = 100;
const keepfloat = 0.0000;

(function () {
    'use strict';

    // Custom HTML code
    const htmlCode = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Cyberiana AFK</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik&display=swap" rel="stylesheet">
</head>

<body>

    <div class="topbar">
        <div class="toplogo"></div>
        <div class="logocont">AFK system</div>
    </div>

    <div class="option-picker">
        <div class="arrow left" id="left-arrow">&lt;</div>
        <div class="case" id="ccase">CS:GO Weapon Case</div>
        <div class="arrow right" id="right-arrow">&gt;</div>
    </div>

    <div class="content">

        <div class="unbox">
            <div class="dot"></div>
            <div class="item">Placeholder Item (Wear)</div>
            <div class="itemfloat">0.000000000000000</div>
            <div class="itemprice">Milspec - $0.00</div>
            <div class="timer">
                <div class="tlabel">6s</div>
                <div class="treel"></div>
            </div>
        </div>

    </div>

    <div id="sidebar" class="sidebar">

        <div class="opener">
            <div class="title">User Info</div>
            <div class="user">Ana (76734857399200)</div>
            <div class="balance">Balance: <b>$1,000,000.00</b></div>
            <div class="invval">Inv Value: <b>$1,000.00</b></div>
        </div>

        <div class="divider"></div>

        <div class="chat">
            <div class="title">Chat (WIP-Coming Soon)</div>
        </div>

    </div>

    <script src="script.js"></script>

</body>

</html>
`;

    // Custom CSS code
    const cssCode = `
/* Your CSS code here */
* {
    font-family: 'Rubik', sans-serif;
}

body {
    background-color: rgb(22, 22, 22);
    color: rgb(255, 255, 255);
    overflow: hidden;
}

.case {
    opacity: 1;
    transition: opacity 0.10s;
    font-size: 35px;
    font-weight: bold;
    user-select: none;
}

.option-picker {
    position: fixed;
    bottom: 2%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
}

.arrow {
    font-size: 25px;
    font-weight: bold;
    margin: 0 50px;
    user-select: none;
    cursor: pointer;
    filter: drop-shadow(0 0 0 rgba(255, 165, 0, 0));
    transition: filter 0.3s;
}

.arrow:hover {
    filter: drop-shadow(0 0 15px rgb(166, 234, 255));
}

.left {
    margin-left: 20%;
    transition: box-shadow 0.3s;
}

.right {
    margin-right: 20%;
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    height: 90%;
    position: absolute;
}

.timer {
    display: flex;
    flex-wrap: wrap;
}

.itemprice {
    width: 100%;
}

.treel {
    margin-left: 30px;
    margin-top: 5.5px;
    position: absolute;
    height: 10px;
    width: 265px;
    background-color: rgb(158, 158, 158);
}

.sidebar {
    height: 100%;
    width: 20%;
    background-color: rgb(11, 11, 11);
    position: absolute;
    right: 0;
    top: 0;
}

.opener {
    height: 9.5%;
    background-color: rgb(15, 15, 15);
    text-align: center;
    justify-content: center;
    padding-top: 5px;
}

.opener * {
    font-size: 1.75vh;
}

.chat {
    height: 90.5%;
    background-color: rgb(15, 15, 15);
    padding-top: 5px;
    text-align: center;
    justify-content: center;
}

.chat * {
    font-size: 1.75vh;
}

.divider {
    height: 1px;
    background-color: rgb(7, 7, 7);
}

.unbox {
    display: flex;
    flex-wrap: wrap;
    max-width: 300px;
}

.dot {
    margin-left: 1px;
    margin-top: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: blue;
    position: absolute;
}

.item {
    padding-left: 20.5px;
    font-size: 25px;
    max-width: 2500px;
    min-width: 1500px;
}

.itemfloat {
    width: 100%;
}

.smallt {
    font-size: 15px;
}

.title {
    margin-top: -5px;
    height: 20px;
    width: 100%;
    background-color: rgb(12, 12, 12);
}

.topbar {
    left: 0;
    top: 0;
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 10%;
    background-color: #111;
}

.toplogo {
    position: absolute;
    top: 20%;
    height: 50%;
    width: 10%;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('https://i.ibb.co/RhX63FN/logo-inv.png');
}

.logocont {
    position: absolute;
    top: 60%;
    left: 3.5%;
    font-size: 1.5vh;
}

::-webkit-scrollbar {
    width: 6px;
    /* Adjust as needed */
}

::-webkit-scrollbar-thumb {
    background-color: #888;
    /* Color of the scrollbar thumb */
    border-radius: 3px;
    /* Rounded corners of the thumb */
}

::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* Color of the thumb on hover */
}
`;

    setTimeout(() => {
        // Injecting the HTML and CSS into the current webpage
        document.open();
        document.write(htmlCode);
        document.write(`<style>${cssCode}</style>`);
        document.write('<script src="script.js"></script>');
        document.close();


        const cases = [
            "CS:GO Weapon Case",
            "eSports 2013 Case",
            "Operation Bravo Case",
            "eSports 2013 Winter Case",
            "CS:GO Weapon Case 2",
            "CS:GO Weapon Case 3",
            "Winter Offensive Weapon Case",
            "Operation Phoenix Weapon Case",
            "Huntsman Weapon Case",
            "Operation Breakout Weapon Case",
            "Operation Vanguard Weapon Case",
            "Chroma 2 Case",
            "eSports 2014 Summer Case",
            "Falchion Case",
            "Shadow Case",
            "Chroma Case",
            "Revolver Case",
            "Operation Wildfire Case",
            "Chroma 3 Case",
            "Glove Case",
            "Spectrum 2 Case",
            "Clutch Case",
            "Gamma Case",
            "Spectrum Case",
            "Operation Hydra Case",
            "Gamma 2 Case"
        ];

        const ccaseElement = document.getElementById('ccase');
        let currentIndex = 0;

        function fadeOutAndChangeText(newText) {
            ccaseElement.style.opacity = 0;
            setTimeout(() => {
                ccaseElement.textContent = newText;
                fadeIn();
            }, 120);
        }

        function fadeIn() {
            ccaseElement.style.opacity = 1;
        }

        function scrollLeft() {
            currentIndex = (currentIndex - 1 + cases.length) % cases.length;
            fadeOutAndChangeText(cases[currentIndex]);
        }

        function scrollRight() {
            currentIndex = (currentIndex + 1) % cases.length;
            fadeOutAndChangeText(cases[currentIndex]);
        }

        document.getElementById('left-arrow').addEventListener('click', scrollLeft);
        document.getElementById('right-arrow').addEventListener('click', scrollRight);

        function getData(dataKey) {
            return fetch('https://api.csgoclicker.net/v1/profile/', {
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.hasOwnProperty(dataKey)) {
                        return data[dataKey];
                    } else {
                        throw new Error('Invalid data key');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        getData('name')
            .then(name => {
                console.log('Name:', name);
                return getData('steamId')
                    .then(steamId => {
                        console.log('Steam ID:', steamId);
                        document.getElementsByClassName('user')[0].innerText = `${name} (${steamId})`;
                    });
            });

        getData('balance')
            .then(balance => {
                console.log('Balance:', balance);
                document.getElementsByClassName('balance')[0].innerHTML = `Balance: <b>$${(balance / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`
            });

        runProgressBar();

    }, 5000);

    function customSend(socket, data) {
        socket.send(`42${JSON.stringify(data)}`);
    }

    function getWear(float) {
        if (float >= 0 && float <= 0.07) {
            return 'Factory New';
        } else if (float > 0.07 && float <= 0.15) {
            return 'Minimal Wear';
        } else if (float > 0.15 && float <= 0.38) {
            return 'Field-Tested';
        } else if (float > 0.38 && float <= 0.45) {
            return 'Well-Worn';
        } else if (float > 0.45 && float <= 1) {
            return 'Battle-Scarred';
        } else {
            return 'Unknown';
        }
    }

    const colors = {
        "milspec": "#1757cf",
        "restricted": "#710193",
        "classified": "#dc2ef0",
        "covert": "#f23030",
        "gold": "#f2ae30"
    }

    function getPrice(item) {
        if (PriceList.hasOwnProperty(item)) {
            return PriceList[item];
        }
    }

    window.sockets = [];
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const socket = new nativeWebSocket(...args);
        socket.addEventListener('message', function (event) {
            console.log('Received message.');

            if (event.data.includes("case opened")) {
                let startIndex = event.data.indexOf("[{");
                let endIndex = event.data.lastIndexOf("}]") + 2;
                let itemsStr = event.data.substring(startIndex, endIndex);
                let items = JSON.parse(itemsStr);
                let gold = items[38].rarity == "gold";
                console.log(items[38]);
                document.getElementsByClassName('item')[0].innerText = `${(gold ? "★ " : "")}${(items[38].stattrak ? "StatTrak™ " : "")}${items[38].primaryName} | ${items[38].secondaryName} (${getWear(items[38].float)})`
                document.getElementsByClassName('itemfloat')[0].innerText = `${items[38].float}`
                let fname = `${(gold ? "★ " : "")}${(items[38].stattrak ? "StatTrak™ " : "")}${items[38].primaryName} | ${items[38].secondaryName} (${getWear(items[38].float)})`
                let sold = (getPrice(fname) < sellprice) ? "Sold" : "Kept"
                document.getElementsByClassName('itemprice')[0].innerText = `${(items[38].rarity).charAt(0).toUpperCase() + (items[38].rarity).slice(1)} - $${(getPrice(fname))} (${sold})`
                document.getElementsByClassName('dot')[0].style.backgroundColor = colors[items[38].rarity];
                // 42["sell item",["75fe7161-1abb-11ee-be69-5d329c11f3d2"]]
                if (getPrice(fname) < sellprice) {
                    if (items[38].float > keepfloat) {
                        customSend(window.sockets[0], ["sell item", [`${items[38].id}`]]);
                        console.log("Sold")
                    } else {
                        console.log("Kept due to float.")
                    }
                } else {
                    console.log("Kept due to price.")
                }

                function getData(dataKey) {
                    return fetch('https://api.csgoclicker.net/v1/profile/', {
                        credentials: 'include'
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.hasOwnProperty(dataKey)) {
                                return data[dataKey];
                            } else {
                                throw new Error('Invalid data key');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }

                getData('balance')
                    .then(balance => {
                        console.log('Balance:', balance);
                        document.getElementsByClassName('balance')[0].innerHTML = `Balance: <b>$${(balance / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`
                    });
            }

        });

        window.sockets.push(socket);
        return socket;
    };


    function runProgressBar() {
        const progressBar = document.getElementsByClassName('treel')[0];
        const tlabel = document.getElementsByClassName('tlabel')[0];
        const totalTime = 6000; // 13 seconds in milliseconds
        const defaultLength = 265; // default length in pixels
        const decreaseAmount = defaultLength / (totalTime / 100); // decrease amount per interval
        const countDownInterval = 1000; // 1 second per interval

        let currentLength = defaultLength;
        let remainingTime = totalTime / 1000; // convert to seconds

        const progressBarInterval = setInterval(() => {
            currentLength -= decreaseAmount;
            progressBar.style.width = currentLength + 'px';

            if (currentLength <= 0) {
                clearInterval(progressBarInterval);
                progressBar.style.width = '0';

                // Restart the progress bar and countdown after 15 seconds
                setTimeout(() => {
                    let ccase = document.getElementById('ccase').innerText;
                    customSend(window.sockets[0], ["buy case", {
                        "caseName": ccase, "amount": 1
                    }])
                    customSend(window.sockets[0], ["open case", ccase]);
                    runProgressBar();
                }, totalTime - 5500);
            }
        }, 100);

        const countDownIntervalId = setInterval(() => {
            remainingTime -= 1;
            tlabel.textContent = remainingTime + 's';

            if (remainingTime <= 0) {
                clearInterval(countDownIntervalId);
            }
        }, countDownInterval);
    }

})();