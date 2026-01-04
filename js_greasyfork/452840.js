// ==UserScript==
// @name         Times Tables Rock Stars Hack
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  An overpowered ttrs cheat.
// @author       You
// @match        https://play.ttrockstars.com/*
// @icon         https://play.ttrockstars.com/ttrs-favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452840/Times%20Tables%20Rock%20Stars%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/452840/Times%20Tables%20Rock%20Stars%20Hack.meta.js
// ==/UserScript==
 
 
console.log("Initialisation complete!")
alert("Welcome to the best ttrs hack in the world. Press the space bar to auto answer a question for you. Do not press the spacebar too fast or the game's anticheat will kick you out.")
alert("Script made by Caronnavirus")
 
 
document.addEventListener('keydown', (e) => {
 
    if(e.code == "Space") {
            let ans
let question
 
let zero = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-n.key-shade")
let one = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(1)")
let two = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(2)")
let three = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(3)")
let four = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(1)")
let five = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(2)")
let six = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(3)")
let seven = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(1)")
let eight = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(2)")
let nine = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(3)")
let enter = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-garage > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-ent.ng-star-inserted")
 
 
let zeroStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-n.key-shade")
let oneStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(1)")
let twoStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(2)")
let threeStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(3)")
let fourStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(1)")
let fiveStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(2)")
let sixStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(3)")
let sevenStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(1)")
let eightStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(2)")
let nineStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(3)")
let enterStud = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-studio > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-ent.ng-star-inserted")
 
 
let zeroFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-n.key-shade")
let oneFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(1)")
let twoFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(2)")
let threeFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(1) > div:nth-child(3)")
let fourFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(1)")
let fiveFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(2)")
let sixFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(2) > div:nth-child(3)")
let sevenFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(1)")
let eightFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(2)")
let nineFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(3) > div:nth-child(3)")
let enterFest = document.querySelector("ttr-root > ttr-root-app > div > mat-sidenav-container > mat-sidenav-content > div > section > ttr-festival > ttr-game-holder > div > div > div.pedal-holder > ttr-game-footpedal > section.width-100 > ttr-game-numpad > div > div:nth-child(4) > div.key-ent.ng-star-inserted")
let keys = [zero, one, two, three, four, five, six, seven, eight, nine]
let studKeys = [zeroStud, oneStud, twoStud, threeStud, fourStud, fiveStud, sixStud, sevenStud, eightStud, nineStud]
let festKeys = [zeroFest, oneFest, twoFest, threeFest, fourFest, fiveFest, sixFest, sevenFest, eightFest, nineFest]
 
                       question = document.querySelector("ttr-game-question:nth-child(2)").innerText
        question = question.replace("×", "*");
        question = question.replace("÷", "/");
        ans = eval(question);
        console.log(ans);
        if(window.location.href == "https://play.ttrockstars.com/game/home/studio") {
                   if(ans.toString().length == 1) {
            studKeys[ans.toString()].click()
            enterStud.click()
        }
        if(ans.toString().length == 2) {
            studKeys[ans.toString().charAt(0)].click()
            studKeys[ans.toString().charAt(1)].click()
           enterStud.click()
        }
                    if(ans.toString().length == 3) {
            studKeys[ans.toString().charAt(0)].click()
            studKeys[ans.toString().charAt(1)].click()
                        studKeys[ans.toString().charAt(2)].click()
           enterStud.click()
        }
        } else if(window.location == "https://play.ttrockstars.com/game/home/garage") {
        if(ans.toString().length == 1) {
            keys[ans.toString()].click()
            enter.click()
        }
        if(ans.toString().length == 2) {
            keys[ans.toString().charAt(0)].click()
            keys[ans.toString().charAt(1)].click()
           enter.click()
        }
                    if(ans.toString().length == 3) {
            keys[ans.toString().charAt(0)].click()
            keys[ans.toString().charAt(1)].click()
            keys[ans.toString().charAt(2)].click()
           enter.click()
        }
        } else if(window.location == "https://play.ttrockstars.com/game/home/festival") {
        if(ans.toString().length == 1) {
            festKeys[ans.toString()].click()
            enterFest.click()
        }
        if(ans.toString().length == 2) {
            festKeys[ans.toString().charAt(0)].click()
            festKeys[ans.toString().charAt(1)].click()
           enterFest.click()
        }
                    if(ans.toString().length == 3) {
            festKeys[ans.toString().charAt(0)].click()
            festKeys[ans.toString().charAt(1)].click()
            festKeys[ans.toString().charAt(2)].click()
           enterFest.click()
        }
        }
 
 
    }
})