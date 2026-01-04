// ==UserScript==
// @name         DRGN.DOUBLE
// @description  bot
// @namespace    tuxuuman:drgn.best.double
// @version      0.2.1
// @author       tuxuuman<tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://drgn.best/double
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394890/DRGNDOUBLE.user.js
// @updateURL https://update.greasyfork.org/scripts/394890/DRGNDOUBLE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var auto = false;
    var baseBet = 0;
    var currBet = 0;
    var lastLose = false;
    var lastColor = "";
    var betTimer = null;

    window.notifyMe = function(text) {
        console.log(text);
    }

    window.startAuto = function(bet) {
        if(!auto) {
            if(!bet) {
                window.notifyMe("Укажите базовую ставку!", "error");
                return;
            }

            auto = true;
            baseBet = bet;
            console.log("Waiting for new round...");
            window.notifyMe("Ожидаем начало следущего раунда...", "warning");
            document.getElementById("autobet").innerText = "СТОП";
        } else {
            clearTimeout(betTimer);
            auto = false;
            document.getElementById("autobet").innerText = "СТАРТ";
        }
    }


    const WebSocketProxy = new Proxy(window.WebSocket, {
        construct(target, args) {
            //console.log(args);
            const instance = new target(...args);
            const openHandler = (event) => {
                console.log('Open', event);
                window.notifyMe("WEBSOCKET CONNECTION HOOKED!\nСоединение успешно перехвачено!", "success");
                    document.getElementsByClassName("menu-cont")[0].innerHTML += "<br><div id=\"calypsotoolz\"><input id=\"autobet-value\" placeholder=\"Значение для авто-ставок\">" +
                        "<button class=\"buttoninzc\" id=\"autobet\" onclick=\"startAuto(document.getElementById('autobet-value').value);\">СТАРТ</button></div>";
            };

            const messageHandler = (event) => {
                window.bla = event.data;

                try {
                    if(auto && event.data.toString().indexOf("double_roll") != -1) {
                        var parsed;
                        try {
                            parsed = JSON.parse(event.data.substring(2));
                            console.log(parsed);
                        } catch(e) {}
                        if(currBet == 0) {

                            // только начинаем ставить
                            betTimer = setTimeout(function() {
                               // var betRed = randomInteger(1, 2) == 1;
                                lastColor = "black";
                                setBet(baseBet);
                               // window.notifyMe("СТАВИМ " + currBet + " НА " + (betRed ? "RED" : "BLACK"), "success");
                                /*if(betRed) {
                                    document.getElementsByClassName("header-side-d rr1 betButton")[0].click();
                                } else {
                                    document.getElementsByClassName("header-side-d rr3 betButton")[0].click();
                                    lastColor = "black";
                                }*/
                                document.getElementsByClassName("header-side-d rr0 betButton")[0].click();
                            }, randomInteger(10000, 15000));
                            return;
                        }
                        var data = event.data.toString();
                        console.log("ROLLED: " + parsed[1].win_type);
                        var rolledN = parsed[1].win_type;

                        if(rolledN == "r" && lastColor == "red") {
                            window.notifyMe("ВЫИГРАЛИ!", "success");
                            setBet(baseBet);
                        } else if(rolledN == "b" && lastColor == "black") {
                            window.notifyMe("ВЫИГРАЛИ!", "success");
                            setBet(baseBet);
                        } else if(rolledN == "y" && lastColor == "yellow") {
                            window.notifyMe("ПРОИГРАЛИ, УВЕЛИЧИВАЕМ СТАВКУ: " + currBet * 2, "error");
                            setBet(currBet * 2);
                        } else {
                            window.notifyMe("ПРОИГРАЛИ, УВЕЛИЧИВАЕМ СТАВКУ: " + currBet * 2, "error");
                            setBet(currBet * 2);
                        }

                        betTimer = setTimeout(function() {
                            /*
                            var betRed = randomInteger(1, 2) == 1;
                            lastColor = "red";
                            window.notifyMe("СТАВИМ " + currBet + " НА " + (betRed ? "RED" : "BLACK"), "success");
                            if(betRed) {
                                document.getElementsByClassName("header-side-d rr1 betButton")[0].click();
                            } else {
                                document.getElementsByClassName("header-side-d rr3 betButton")[0].click();
                                lastColor = "black";
                            }*/
                                lastColor = "black";
                            document.getElementsByClassName("header-side-d rr0 betButton")[0].click();
                        }, randomInteger(10000, 15000));
                    }
                } catch(err) {}
            };

            const closeHandler = (event) => {
                console.log('Close', event);
                window.notifyMe("СОЕДИНЕНИЕ ПРЕРВАНО, ОБНОВИТЕ СТРАНИЦУ!", "error");
                var e = document.getElementById("calypsotoolz");
                e.parentNode.removeChild(e);
                clearTimeout(betTimer);
                instance.removeEventListener('open', openHandler);
                instance.removeEventListener('message', messageHandler);
                instance.removeEventListener('close', closeHandler);
            };

            instance.addEventListener('open', openHandler);
            instance.addEventListener('message', messageHandler);
            instance.addEventListener('close', closeHandler);

            const sendProxy = new Proxy(instance.send, {
                apply: function(target, thisArg, _args) {
                    // console.log('Send', _args);
                    target.apply(thisArg, _args);
                }
            });

            window.server = instance;
            instance.send = sendProxy;

            return instance;
        },
    });

    window.WebSocket = WebSocketProxy;

    function setBet(val) {
        currBet = val;
        document.getElementById("insumm").value = currBet;
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        document.getElementById('insumm').dispatchEvent(event);
    }

    function isRed(i) {
        return i >= 1 && i <= 7;
    }

    function isBlack(i) {
        return i >= 8 && i <= 14;
    }

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        return Math.round(rand);
    }
})();