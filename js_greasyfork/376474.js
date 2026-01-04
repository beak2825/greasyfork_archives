// ==UserScript==
// @name         BL R9.75 Play BJ Script
// @namespace    Bootleggers R9.75
// @version      0.0.10
// @description  Automate BJ
// @author       BD
// @match        https://www.bootleggers.us/blackjack.php
// @update       https://greasyfork.org/scripts/376474-bl-r9-75-play-bj-script/code/BL%20R975%20Play%20BJ%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376474/BL%20R975%20Play%20BJ%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376474/BL%20R975%20Play%20BJ%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var doubleIfLose = true;
    var dblBtnDisabled = true;
    var lastBtnPressed;
    $("<center><input id='playbtn' type='button' value='Start Playing!'></input></center><br>").insertBefore($(".BL-casino-table")[0]);
    var bjTimer;
    var ogBet;
    var maxBet = $('[data-area="max_bet"]')[0].innerText.replace(/[$,]/g, "");
    var maxBetsLost = 0;
    var maxBetPct = 0.015625;//0.03125
    $('[name="amount"]')[0].value = Math.floor(maxBet*maxBetPct);

    $("#playbtn").on("click", function() {
        if ($("#playbtn")[0].value == "Start Playing!") {
            bjTimer = setInterval(RunScript, 1000);
            ogBet = document.querySelectorAll("[name='amount']")[0].value;
            $("#playbtn")[0].value = "Stop Playing!";
        } else {
            clearInterval(bjTimer);
            $("#playbtn")[0].value = "Start Playing!";
        }
    });

    function RunScript() {
        var betBtn = document.querySelectorAll("[value='Bet!']")[0];
        var hitBtn = document.querySelectorAll("[value='Hit!']")[0];
        var dblBtn = document.querySelectorAll("[value='Double!']")[0]
        var splitBtn = document.querySelectorAll("[data-action='split']")[0];
        var standBtn = document.querySelectorAll("[value='Stand!']")[0];
        var insuranceBtn = document.querySelectorAll("[data-action='no-insurance']")[0];
        var dealersCard = $(".value")[0] ? $(".value")[0].textContent == "1/11" ? 14 : $(".value")[0].textContent*1 : null;
        var yourCards = [];
        var cardsPile;
        $($(".value").get().reverse()).each(function(i) {
            if (this.textContent != "") {
                yourCards[0] = this.textContent;
				cardsPile = ($(".value").length -1) - i;
                return false;
            }
        });

        if (betBtn.clientHeight) {
            if ($(".result").length) {
                var collectiveResult = 0
                if ($(".player.win").length) {
                    if (($("[name='amount']")[0].value >= (ogBet/maxBetPct)) && (maxBetsLost != 0)) {
                        if (lastBtnPressed == "bet") {
                            maxBetsLost -= 1.5;
                        } else {
                            maxBetsLost -= $(".player.win").length;
                        }
                    }
                    collectiveResult += $(".player.win").length;
                }
                if ($(".player.loss").length) {
                    if ($("[name='amount']")[0].value >= (ogBet/maxBetPct)) {
                        maxBetsLost += $(".player.win").length;
                    }
                    collectiveResult -= $(".player.loss").length;
                }
                if (collectiveResult >= 1) {
                    if (maxBetsLost <= 0) {
                        maxBetsLost = 0;
                        $("[name='amount']")[0].value = ogBet;
                    } else if (maxBetsLost == 0.5) {
                        $("[name='amount']")[0].value = (ogBet/maxBetPct)/2;
                    } else {
                        $("[name='amount']")[0].value = (ogBet/maxBetPct);
                    }
                } else {
                    var betMultiplier = doubleIfLose ? 2 : 1;
                    betMultiplier = lastBtnPressed == "dbl" ? betMultiplier * 2 : betMultiplier;
                    if (collectiveResult != 0) {
                        if ($("[name='amount']")[0].value * betMultiplier * collectiveResult * -1 <= (ogBet/maxBetPct)) {
                            $("[name='amount']")[0].value = $("[name='amount']")[0].value * betMultiplier * collectiveResult * -1;
                        } else {
                            maxBetsLost += (collectiveResult * -1);
                            $("[name='amount']")[0].value = (ogBet/maxBetPct);
                        }
                    }
                }
            }
            console.log(maxBetsLost);
            betBtn.click();
            lastBtnPressed = "bet";
        } else if (insuranceBtn.clientHeight) {
            insuranceBtn.click();
        } else if (yourCards[0]) {
            if (yourCards[0].includes("/")) {
                yourCards[0] = $(".value")[cardsPile].textContent.split("/")[0]*1;
                yourCards[1] = $(".value")[cardsPile].textContent.split("/")[1]*1;
            }
            var splitBet = splitBtn.clientHeight;
            var hardBet = ((yourCards.length == 1) && (!splitBet));
            var softBet = ((yourCards.length == 2) && (!splitBet));
            if (dealersCard == 2) {
                if (hardBet) {
                    //Hard bet
                    if (yourCards[0] <= 12) {
                        if ((yourCards[0] == 10) || (yourCards[0] == 11)) {
                            if (dblBtn.clientHeight) {
                                dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                                lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                            } else {
                                hitBtn.click();
                            }
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 13) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    //Soft bet
                    if (yourCards[1] <= 17) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 18) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    //Split
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 12) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if ((yourCards[0] >= 14) && (yourCards[0] <= 18)) {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 3) {
                if (hardBet) {
                    if (yourCards[0] <= 12) {
                        if ((dblBtn.clientHeight) && ((yourCards[0] == 9) || (yourCards[0] == 10) || (yourCards[0] == 11))) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 13) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        if ((dblBtn.clientHeight) && (yourCards[1] == 17)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] >= 18){
                        if ((dblBtn.clientHeight) && (yourCards[1] == 18)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            standBtn.click();
                            lastBtnPressed = "stand";
                        }
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 8) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if (yourCards[0] >= 12) {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 4) {
                if (hardBet) {
                    if (yourCards[0] <= 11) {
                        if ((dblBtn.clientHeight) && (yourCards[0] >= 9)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 12) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        if ((dblBtn.clientHeight) && (yourCards[1] >= 15)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] >= 18){
                        if ((dblBtn.clientHeight) && (yourCards[1] == 18)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            standBtn.click();
                            lastBtnPressed = "stand";
                        }
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] == 8) {
                        hitBtn.click();
                    } else if (yourCards[0] <= 18) {
                        splitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                }
            } else if (dealersCard == 5) {
                if (hardBet) {
                    if (yourCards[0] <= 11) {
                        if ((dblBtn.clientHeight) && (yourCards[0] >= 9)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 12) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if (yourCards[1] >= 18) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            standBtn.click();
                            lastBtnPressed = "stand";
                        }
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] == 8) {
                        hitBtn.click();
                    } else if (yourCards[0] <= 18) {
                        splitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                }
            } else if (dealersCard == 6) {
                if (hardBet) {
                    if (yourCards[0] <= 11) {
                        if ((dblBtn.clientHeight) && (yourCards[0] >= 9)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 12) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if (yourCards[1] >= 18) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            standBtn.click();
                            lastBtnPressed = "stand";
                        }
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] == 8) {
                        hitBtn.click();
                    } else if (yourCards[0] <= 18) {
                        splitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                }
            } else if (dealersCard == 7) {
                if (hardBet) {
                    if (yourCards[0] <= 16) {
                        if ((dblBtn.clientHeight) && ((yourCards[0] == 10) || yourCards[0] == 11)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 17) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 18) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if ((yourCards[0] == 8) || (yourCards[0] == 12)) {
                        hitBtn.click();
                    } else if ((yourCards[0] == 18) || (yourCards[0] == 20)) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 8) {
                if (hardBet) {
                    if (yourCards[0] <= 16) {
                        if ((dblBtn.clientHeight) && ((yourCards[0] == 10) || yourCards[0] == 11)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 17) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 17) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 18) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 14) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 9) {
                if (hardBet) {
                    if (yourCards[0] <= 16) {
                        if ((dblBtn.clientHeight) && ((yourCards[0] == 10) || yourCards[0] == 11)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 17) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 18) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 19) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        if (dblBtn.clientHeight) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 14) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 10) {
                if (hardBet) {
                    if (yourCards[0] <= 16) {
                        if ((dblBtn.clientHeight) && (yourCards[0] == 11)) {
                            dblBtnDisabled ? hitBtn.click() : dblBtn.click();
                            lastBtnPressed = dblBtnDisabled ? "hit" : "dbl";
                        } else {
                            hitBtn.click();
                        }
                    } else if (yourCards[0] >= 17) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 18) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 19) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        hitBtn.click();
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 14) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if (yourCards[0] == 18) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else {
                        splitBtn.click();
                    }
                }
            } else if (dealersCard == 11) {
                if (hardBet) {
                    if (yourCards[0] <= 16) {
                        hitBtn.click();
                    } else if (yourCards[0] >= 17) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (softBet) {
                    if (yourCards[1] <= 18) {
                        hitBtn.click();
                    } else if (yourCards[1] >= 19) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    }
                } else if (splitBet) {
                    if (yourCards[0] == 10) {
                        hitBtn.click();
                    } else if (yourCards[1] == 12) {
                        splitBtn.click();
                    } else if (yourCards[0] <= 14) {
                        hitBtn.click();
                    } else if (yourCards[0] == 20) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else if (yourCards[0] == 18) {
                        standBtn.click();
                        lastBtnPressed = "stand";
                    } else {
                        splitBtn.click();
                    }
                }
            }
        }
    }
});