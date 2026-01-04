// ==UserScript==
// @name         Zombs.io AITO
// @namespace    https://www.youtube.com/channel/UCC4Q28czyJPjSPtYQerbPGw
// @version      null
// @description  Description goes there
// @author       DemostanisYt & Ultimate Mod
// @match        http://zombs.io/*
// @info         Info goes there
// @how-to-use   How to use goes there
// @downloadURL https://update.greasyfork.org/scripts/380504/Zombsio%20AITO.user.js
// @updateURL https://update.greasyfork.org/scripts/380504/Zombsio%20AITO.meta.js
// ==/UserScript==
window.onload = function() {
    const $ = function(className) {
        var elem = document.getElementsByClassName(className)
        if (elem.length > 1) return elem
        return elem[0]
    }

    setTimeout(function() {
        $("hud-settings-grid").innerHTML += "<div class='AITO'><li>Set up</li><div style='display: inline-block'>Please reload the tab </li><strong style='display: inline-block'>2 times</strong><div>Then, at the second time, please check the </li><strong style='display: inline-block'>\"Prevent this page from generating additional dialogues\"<strong><div style='display: inline-block'>Finally, click on the start button, and it's all good!</li><button class='btn btn-green start-aito'>Start AITO</button><button class='btn btn-green stop-aito'>Stop AITO</button>"
        setTimeout(function() {
            if (sessionStorage.ait === "true") {
                $("btn btn-green hud-intro-play").click()
            }
            var GoldObserver;
            var gold;
            var isInWorld = setInterval(function() {
                if (Game.currentGame.world.inWorld) {
                    clearInterval(isInWorld)
                    setTimeout(function() {

                        gold = Game.currentGame.world.localPlayer.entity.fromTick.gold
                        GoldObserver = function(goldAmount, doFunction) {
                            var Observer = setInterval(function() {
                                if (Game.currentGame.world.localPlayer.entity.fromTick.gold !== gold) {
                                    gold = Game.currentGame.world.localPlayer.entity.fromTick.gold
                                }
                                if (gold > goldAmount) {
                                    doFunction()
                                    clearInterval(Observer)
                                }
                            })
                        }
                        console.log(GoldObserver)
                        if (sessionStorage.ait === "true") {
                            GoldObserver(10500, function() {
                                if (sessionStorage.ait) {
                                    $("hud-spell-icon")[1].click()
                                    sessionStorage.ait = "true"
                                    Observer.observe($("hud-ticker-bar"), {
                                        attributes: true,
                                        attributeFilter: ['style']
                                    })
                                } else {
                                    sessionStorage.setItem("ait", "false")
                                }
                            })
                        }
                        var Observer = new MutationObserver(function(mutations) {
                            mutations.forEach(function(mutation) {
                                if ($("hud-ticker-bar").style.backgroundPosition === "-2.65417px 0px") {
                                    console.log("changed!")
                                    window.location.href = "http://zombs.io/#/" + Game.currentGame.options.serverId + "/" + Game.currentGame.ui.playerPartyShareKey + "/aito"
                                    window.location.reload()
                                }
                            })
                        })
                        $("btn btn-green start-aito").addEventListener("click", function() {
                            if (sessionStorage.ait) {
                                sessionStorage.ait = "true"
                                Observer.observe($("hud-ticker-bar"), {
                                    attributes: true,
                                    attributeFilter: ['style']
                                })
                            } else {
                                sessionStorage.setItem("ait", "false")
                            }
                        })
                        $("btn btn-green stop-aito").addEventListener("click", function stop() {
                            sessionStorage.ait = "false"
                        })
                    }, 500)
                }
            }, 100)
        }, 250)
    }, 1500)
}