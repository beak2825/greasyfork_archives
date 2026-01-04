// ==UserScript==
// @name         Craftnite.io cheat
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  try to take over the world!
// @author       You
// @match        https://craftnite.io/
// @icon         https://w7.pngwing.com/pngs/582/998/png-transparent-smiley-emoticon-devil-devil-smiley-sticker-online-chat-snout.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462757/Craftniteio%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/462757/Craftniteio%20cheat.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
    var spam_msg = '';
    var spam_lock = 'False';
    var chat_opened = false;
    var spam_count = 0;
    var displayInput = true;
    var getSpamInput = '';
    var SpamInput = document.createElement("input");
    var ValidButton1 = document.createElement("button");
    var divClass = document.createElement('div');
    var ExplainText2 = document.createElement('p');
    var discordLink = document.createElement('a');
    var SpeedSwimingEnabled = false;
    var cheatKick = ''
    document.getElementById("craftnite-io_300x250").remove();
    document.getElementById("cross-promo").remove();
    var FlyEnabled = false
    var BedrockEnabled = false
    divClass.style.display = 'block';
    divClass.id = "MyDIV";
    document.body.appendChild(divClass);
    function changeColorAtHover(button, color, returncolor) {
        $(document).ready(function () {
            $(button).hover(function () {
                $(button).css('background', color);
            },
                function () {
                    $(button).css('background', returncolor);
                });
        });
    }
    function modifyHTML() {
        ValidButton1.innerHTML = "valid"
        ExplainText2.innerHTML = "To spam, you must activate the spam button and then hold the 'enter' key for as long as you want.<br /><br />This script was made by Raylazzz and was published by Raylazzz, so for those who would like to use it, please respect me in the game, at least in recognition of my work. 😂<br /><br /><br />new update :<br /><br>The bedrock-cheat, useful to go under the bedrock :<br />To use it, you must, first, activate the option 'En / Disable bedrock cheat' then, go to the level of the bedrock. Here you can press Shift to go down and then Space to go up. To stabilize yourself, you must press Shift and then Space once.<br /><br />Thank you for being so many to use my cheat and if you want new features, send me a message on my discord :<br /><br />"
        ExplainText2.style = "font-family: Madera; font-size: 13px; background-color: black; width: 300px; top: 0px; right: 15px; color: white; border-radius: 15px; border-color: black; padding: 15px; position: absolute; z-index: 100; height: 90%; overflow-y: scroll;"
        discordLink.href = "https://discord.gg/gXTWT3Dp";
        discordLink.style = "color: darkcyan; overflow-wrap: break-word; cursor: pointer; }";
        discordLink.innerHTML = "https://discord.gg/gXTWT3Dp";
        discordLink.target = "blank";
        SpamInput.className = 'Spam input';
        SpamInput.placeholder = "Spam message...";
        SpamInput.addEventListener('keydown', function (e) {
            if (e.key != "Backspace") e.preventDefault();
            if (e.key.length == 1) SpamInput.value += e.key;
        });
        ValidButton1.style = "color: white; top:15px;left:230px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
        SpamInput.style = "font-family: Madera; font-size: 13px; background-color: black; color: white; top:15px;left:15px;position:absolute;z-index:99999;padding:15px;border-radius: 15px 15px 15px 15px;";
        ValidButton1.onclick = "myFunction()";
        ValidButton1.style.backgroundColor = "white";
        changeColorAtHover(ValidButton1, '#05d1ff', 'black');
        ValidButton1.style.backgroundColor = "black";
        document.getElementById('MyDIV').appendChild(ExplainText2);
        ExplainText2.appendChild(discordLink);
        ExplainText2.innerHTML += "<br><br>Enjoy the cheat !!<br><br><br>new update :<br><br>The fast swimming cheat, useful to be so fast in water :<br>To use it, you must activate the option 'En/Disable fast swimming cheat' then, go inside water, and just enjoy your speed ! More you hold the front (or back) key, more your speed increase, you just can to the limit border of the map in 20 sec, just that 🤯 !! <br><br><br>Auto join and auto select cheats features :<br><br>When you get disconnected, it's never nice, especially since you have to reactivate all the selected cheats, join... now, no more bother! You only have to press 1 button at the change of the page, and hop! You are in the game! Not to mention that, whether you clicked on this button or not, in any case, the three cheats fly, bedrock and fast swimming will be automatically selected! Only one key word: quickly!<br><br>Enjoy the update !";
        document.getElementById('MyDIV').appendChild(SpamInput);
        document.getElementById('MyDIV').appendChild(ValidButton1);
        document.getElementById('MyDIV').removeChild(SpamInput);
        getSpamInput = SpamInput.value;
        spam_msg = getSpamInput;
        console.log(getSpamInput);
        displayInput = false;
        ValidButton1.innerHTML = "change spam message"
        ValidButton1.style = "font-family: Madera; font-size: 13px; color: white; top:15px;left:15px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
        ValidButton1.style.backgroundColor = "black";
    }
    function HTMLButtonSpam() {
        ValidButton1.onclick = function () {
            if (displayInput == true) {
                document.getElementById('MyDIV').removeChild(SpamInput);
                getSpamInput = SpamInput.value;
                if (getSpamInput.slice(0, 1) != '/') {
                    spam_msg = getSpamInput;
                } else {
                    cheatKick = getSpamInput.slice(1, getSpamInput.length)
                    console.log(cheatKick);
                }
                displayInput = false;
                ValidButton1.innerHTML = "change spam message"
                ValidButton1.style = "font-family: Madera; font-size: 13px; color: white; top:15px;left:15px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
                ValidButton1.style.backgroundColor = "white";
            } else if (displayInput == false) {
                ValidButton1.style = "font-family: Madera; font-size: 13px; color: white; top:15px;left:240px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
                document.getElementById('MyDIV').appendChild(SpamInput);
                ValidButton1.innerHTML = "submit"
                document.getElementById('MyDIV').appendChild(ValidButton1);
                displayInput = true;
            }
        };
    }
    function keyboardManagement() {
        document.onkeydown = function (m) {
            if (m.key == "Enter") {
                if (chat_opened == false) {
                    chat_opened = true;
                } else if (chat_opened == true) {
                    chat_opened = false;
                }
                if (spam_lock == 'True') {
                    var elt = document.querySelector('input');
                    elt.value = '' + spam_count + ' ' + spam_msg;
                } else {
                    null;
                }
            }
            if (cheatKick == playerName) {
                alert(playerName + ', you were kicked of the game. Reason : Abusing cheat.');
                window.close();
            }
            if (chat_opened == true) {
                spam_count++
            }
            if (FlyEnabled == true) {
                G.CONFIG.a143 = 100
            } else if (FlyEnabled == false) {
                G.CONFIG.a143 = 0
            }
            if (BedrockEnabled == true) {
                if (m.key == " ") G.CONFIG.environmentOceanFloorHeight = 260;
                if (m.key == "Shift") {
                    G.CONFIG.environmentOceanFloorHeight = -10000;
                } else {
                    G.CONFIG.environmentOceanFloorHeight = 260;
                }
            } else if (BedrockEnabled == false) {
                G.CONFIG.environmentOceanFloorHeight = 260
            }
            if (SpeedSwimingEnabled) {
                G.CONFIG.a155 = 100
            } else if (!SpeedSwimingEnabled) {
                G.CONFIG.a155 = 0
            }
        }
    }
    function HTMLlabels() {
        var HTMLLabelsButton1 = document.createElement('button');
        var HTMLLabelsButton1Checked = true
        FlyEnabled = true
        HTMLLabelsButton1.innerHTML = 'En/Disable Fly Mode ✔';
        HTMLLabelsButton1.style = "font-family: Madera; font-size: 13px; background-color: #05d1ff; color: white; top:75px; left:15px; position:absolute; z-index:99999; padding:15px; cursor: pointer;border-radius: 15px 15px 15px 15px;";
        changeColorAtHover(HTMLLabelsButton1, '#05d1ff', '#05d1ff');
        HTMLLabelsButton1.onclick = function () {
            if (HTMLLabelsButton1Checked == true) {
                changeColorAtHover(HTMLLabelsButton1, '#05d1ff', "black");
                HTMLLabelsButton1.innerHTML = 'En/Disable Fly Mode ✖';
                G.CONFIG.a143 = 0
                FlyEnabled = false
                HTMLLabelsButton1Checked = false;
            } else if (HTMLLabelsButton1Checked == false) {
                changeColorAtHover(HTMLLabelsButton1, '#05d1ff', '#05d1ff');
                HTMLLabelsButton1.innerHTML = 'En/Disable Fly Mode ✔';
                G.CONFIG.a143 = 100
                FlyEnabled = true
                HTMLLabelsButton1Checked = true;
            }
        }
 
        var HTMLLabelsButton5 = document.createElement('button');
        var HTMLLabelsButton5Checked = true;
        BedrockEnabled = true
        HTMLLabelsButton5.innerHTML = 'En/Disable bedrock cheat ✔';
        HTMLLabelsButton5.style = "font-family: Madera; font-size: 13px; background-color: #05d1ff; color: white; top:195px;left:15px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
        changeColorAtHover(HTMLLabelsButton5, '#05d1ff', '#05d1ff');
        HTMLLabelsButton5.onclick = function () {
            if (HTMLLabelsButton5Checked == true) {
                changeColorAtHover(HTMLLabelsButton5, '#05d1ff', "black");
                HTMLLabelsButton5.innerHTML = 'En/Disable bedrock cheat ✖';
                G.CONFIG.environmentOceanFloorHeight = 260
                BedrockEnabled = false
                HTMLLabelsButton5Checked = false;
            } else if (HTMLLabelsButton5Checked == false) {
                changeColorAtHover(HTMLLabelsButton5, '#05d1ff', '#05d1ff');
                HTMLLabelsButton5.innerHTML = 'En/Disable bedrock cheat ✔';
                G.CONFIG.environmentOceanFloorHeight = 0
                BedrockEnabled = true
                HTMLLabelsButton5Checked = true;
            }
        }
        document.getElementById('MyDIV').appendChild(HTMLLabelsButton5);
 
        var HTMLLabelsButton6 = document.createElement('button');
        var HTMLLabelsButton6Checked = true;
        SpeedSwimingEnabled = true
        HTMLLabelsButton6.innerHTML = 'En/Disable fast swimming cheat ✔';
        HTMLLabelsButton6.style = "font-family: Madera; font-size: 13px; background: #05d1ff; color: white; top: 255px; left: 15px; position: absolute; z-index: 99999; padding: 15px; cursor: pointer; border-radius: 15px;";
        changeColorAtHover(HTMLLabelsButton6, '#05d1ff', '#05d1ff');
        HTMLLabelsButton6.onclick = function () {
            if (HTMLLabelsButton6Checked == true) {
                changeColorAtHover(HTMLLabelsButton6, '#05d1ff', "black");
                HTMLLabelsButton6.innerHTML = 'En/Disable fast swimming cheat ✖';
                G.CONFIG.a155 = 0
                SpeedSwimingEnabled = false
                HTMLLabelsButton6Checked = false;
            } else if (HTMLLabelsButton6Checked == false) {
                changeColorAtHover(HTMLLabelsButton6, '#05d1ff', '#05d1ff');
                HTMLLabelsButton6.innerHTML = 'En/Disable fast swimming cheat ✔';
                G.CONFIG.a155 = 100
                SpeedSwimingEnabled = true
                HTMLLabelsButton6Checked = true;
            }
        }
        document.getElementById('MyDIV').appendChild(HTMLLabelsButton6);
 
        document.getElementById('MyDIV').appendChild(HTMLLabelsButton1);
        var HTMLLabelsButton2 = document.createElement('button');
        var HTMLLabelsButton2Checked = false
        HTMLLabelsButton2.innerHTML = 'En/Disable Spam Mode ✖';
        HTMLLabelsButton2.style = "font-family: Madera; font-size: 13px; background-color: black; color: white; top:135px;left:15px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
        changeColorAtHover(HTMLLabelsButton2, '#05d1ff', 'black');
        HTMLLabelsButton2.onclick = function () {
            spam_count = 0;
            if (HTMLLabelsButton2Checked == true) {
                changeColorAtHover(HTMLLabelsButton2, '#05d1ff', 'black');
                HTMLLabelsButton2.innerHTML = 'En/Disable Spam Mode ✖';
                HTMLLabelsButton2Checked = false;
            } else if (HTMLLabelsButton2Checked == false) {
                changeColorAtHover(HTMLLabelsButton2, '#05d1ff', '#05d1ff');
                HTMLLabelsButton2.innerHTML = 'En/Disable Spam Mode ✔';
                HTMLLabelsButton2Checked = true;
            }
            if (spam_lock == 'True') {
                spam_lock = 'False';
            } else if (spam_lock == 'False') {
                spam_lock = 'True';
            }
        }
        document.getElementById('MyDIV').appendChild(HTMLLabelsButton2);
    }
    function hideButtonsButton() {
        var HTMLLabelsButton3 = document.createElement('button');
        var HTMLLabelsButton3Checked = false
        HTMLLabelsButton3.innerHTML = '⬅';
        HTMLLabelsButton3.style = "font-family: Madera; font-size: 13px; background-color: black; color: white; top:320px;height: 100px ;left:15px;position:absolute;z-index:99999;padding:15px;cursor: pointer;border-radius: 15px 15px 15px 15px;";
        HTMLLabelsButton3.onclick = function () {
            if (HTMLLabelsButton3Checked == true) {
                divClass.style.display = 'block';
                changeColorAtHover(HTMLLabelsButton3, '#05d1ff', 'black');
                HTMLLabelsButton3.innerHTML = '⬅';
                HTMLLabelsButton3Checked = false
            } else if (HTMLLabelsButton3Checked == false) {
                divClass.style.display = 'none';
                changeColorAtHover(HTMLLabelsButton3, '#05d1ff', '#05d1ff');
                HTMLLabelsButton3.innerHTML = '➡';
                HTMLLabelsButton3Checked = true
            }
        }
        document.body.appendChild(HTMLLabelsButton3);
 
    }
 
    var askForAutoJoin = confirm("do you want to activate the auto-join? It will join the game automatically.");
 
    modifyHTML();
    HTMLlabels();
    HTMLButtonSpam();
    hideButtonsButton();
    keyboardManagement();
 
    window.addEventListener('load', function () {
        if (askForAutoJoin) wwStartBtn();
    });
})();