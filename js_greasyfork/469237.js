// ==UserScript==
// @name         Shotwars cheat
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  This is the best cheat ever posted on shotwars.io !!! User interface, Music, Nickname manager, illegal chat (unlimited text length), crash bots (private access, you must have the customer password to be able to access features such as personal nickname or crash bots, get it by joining the following dedicated discord room : "https://discord.gg/8gu3fcb5 "). Enjoy !!
// @author       You
// @license      MIT
// @match        https://shotwars.io/
// @icon         https://tikstar-user-images.oss-cn-hongkong.aliyuncs.com/5c17_6687233396861682694.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469237/Shotwars%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/469237/Shotwars%20cheat.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function atMouseHover(elements, callback,) {
        elements.forEach(function (element) {
            element.addEventListener("mouseover", callback);
        });
    }
    function atMouseOut(elements, callback) {
        elements.forEach(function (element) {
            element.addEventListener("mouseout", callback);
        });
    }
    function atMouseClick(elements, callback) {
        elements.forEach(function (element) {
            element.onclick = callback;
        });
    }
    function atClickOutside(elements, errorLevel, callback) {
        window.onclick = function (event) {
            let errors = 0
            elements.forEach(function (element) {
                if (event.target !== element) {
                    errors++
                }
            })
            if (errors == errorLevel) {
                callback();
            }
        }
    }

    function HTMLcheat() {

        let Div = document.createElement("div");
        Div.style = "position: absolute; z-index: 100; width: 434px; height: 600px; background-color: black; box-shadow: white 0px 0px 8px 8px inset; top: 0px; left: 0px;";
        Div.id = "Div";
        document.body.appendChild(Div);

        let BlDiv = document.createElement("div");
        BlDiv.style = "position: absolute; z-index: 100; width: 389px; height: 352px; background-color: black; overflow-x: auto; top: 202px; left: 20px;";
        BlDiv.id = "BlDiv";
        Div.appendChild(BlDiv);

        let DivDisplayButton = document.createElement("button");
        DivDisplayButton.style = "border-width: 0px; position: absolute; z-index: 100; width: 39px; height: 25px; background-color: black; cursor: pointer; border-bottom-right-radius: 13px; color: red; box-shadow: white 0px 0px 8px 8px; top: 0px; left: 0px;";
        DivDisplayButton.innerHTML = "-";
        DivDisplayButton.id = "DivDisplayButton";
        atMouseHover([DivDisplayButton], function () { DivDisplayButton.style.backgroundColor = "#1a2160"; })
        atMouseOut([DivDisplayButton], function () { DivDisplayButton.style.backgroundColor = "black"; })
        atMouseClick([DivDisplayButton], function () {
            if (DivDisplayButton.innerHTML == "-") {
                DivDisplayButton.innerHTML = "+";
                DivDisplayButton.style.boxShadow = "none";
                for (let i = 0; i < 600; i++) {
                    Div.style.left = "" + (Number((Div.style.left).replace("px", "")) - 1) + "px";
                }
            } else if (DivDisplayButton.innerHTML == "+") {
                DivDisplayButton.innerHTML = "-";
                DivDisplayButton.style.boxShadow = "white 0px 0px 8px 8px";
                for (let i = 0; i < 600; i++) {
                    Div.style.left = "" + (Number((Div.style.left).replace("px", "")) + 1) + "px";
                }
            }
        })
        document.body.appendChild(DivDisplayButton);

        let NDiv = document.createElement("div");
        NDiv.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 10px; width: 328px; height: 162px; top: 20px; color: white; padding: 5px 5px 7px; background-color: black;";
        NDiv.id = "NDiv";
        BlDiv.appendChild(NDiv);

        let ExplainText1 = document.createElement('p');
        ExplainText1.style = "position: absolute; font-family: system-ui; left: 20px; top: 21px; color: white;";
        ExplainText1.innerHTML = "Change your nickname...";
        ExplainText1.id = "ExplainText1"
        NDiv.appendChild(ExplainText1);

        let triangleDownDiv = document.createElement("div");
        triangleDownDiv.style = "z-index: 1; cursor: pointer; position: absolute; top: 81px; left: 277px; width: 0px; height: 0px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid rgb(255, 255, 255); font-size: 0px; line-height: 0; float: left;";
        triangleDownDiv.id = "triangleDownDiv";
        NDiv.appendChild(triangleDownDiv);

        let nicknamesList = ["☜❶☞Limbo ☜❶☞", "D҉O҉N҉A҉T҉҉1K҉", "Sof's Cheat User", "𝓚𝖔𝝇𝖒𝖔𝝇", "ẌūℒΐǤắ₦", "ﮚ..λ.Ⱡ.₭.∑.Ʀ", "Đéɱǿή", "Føxŷ", "holy_Sneaker", "HowlClaw", "DarK_Knigt", "Ŧøթҹนķ", "ĴØЌÉŔ", "NeZoX", "K♚I♚N♚G", "Ѣеԉыȗ★ҜӪϯ", "_MaRiXyAnA_", "Im TuT_Ty_TrUp0_0", "çŤрẮχ", "Lemon4ik", "Early age", ">>¥¥♔Limbo♔¥¥<<", "Cr1stal", "ǤⒽǿⓈ†", "♠V1RUS♠", "⚡💥BlanderBot💥⚡", "Ďęмøņ", "ĶpĀčĀB4úĶ", "3Jlou_4uTep", "▀▄▀▄▀▄ FINISH ▀▄▀▄▀▄", "Utka_in_parks", "ℳ∑Đ\/Ē๖ۣۣۜD†₤₮", " Shooter ", "©ßЯ†ØÑ", "Fluffy", "|Power|™4ekHyTblu NigGa", "W1zarD", "Mr. Zadrot", "Haker♡", "He}I{g@H4uk", "ĢắḾ£b"];
        let nicknamesHTMLList = document.createElement('ul');
        let nicknamesHTMLelementsList = [];
        nicknamesList.forEach(function (element) {
            let li = document.createElement('li');
            li.style = "display: block; cursor: pointer; background-color: white; color: black; padding-top: 5px; padding-bottom: 5px; padding-left: 10px;"
            atMouseHover([li], function () {
                li.style.backgroundColor = "black";
                li.style.color = "white";
            })
            atMouseOut([li], function () {
                li.style.backgroundColor = "white";
                li.style.color = "black";
            })
            atMouseClick([li], function () {
                nicknameSelected = element;
                nicknameSetupp.innerHTML = nicknameSelected;
            })
            li.innerHTML = element;
            nicknamesHTMLList.appendChild(li);
            nicknamesHTMLelementsList.push(li);
        });
        nicknamesHTMLList.style = "position: absolute; display: none; overflow: auto; background-color: white; width: 250px; height: 59%; top: 122px; left: 30px; padding: 17px 19px 20px 20px; right: auto; margin-right: 0px; border-right-width: 22px;";
        nicknamesHTMLList.style.display = "none";
        BlDiv.appendChild(nicknamesHTMLList);

        let nicknameSetupp = document.createElement("p");
        let nicknameSelected = "Sof's Cheat User";
        let nicknamesHTMLListOpened = false;
        nicknameSetupp.style = "position: absolute; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 20px; width: 270px; top: 68px; color: white; padding-left: 19px; padding-top: 5px; padding-bottom: 7px; cursor: pointer; background-color: black;";
        nicknameSetupp.innerHTML = nicknameSelected;
        nicknameSetupp.id = "nicknameSetupp";
        atMouseHover([nicknameSetupp, triangleDownDiv], function () {
            nicknameSetupp.style.backgroundColor = "white";
            nicknameSetupp.style.color = "black";
            triangleDownDiv.style = "z-index: 1; cursor: pointer; position: absolute; top: 81px; left: 277px; width: 0px; height: 0px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid rgb(0, 0, 0); font-size: 0px; line-height: 0; float: left;";
        })
        atMouseOut([nicknameSetupp, triangleDownDiv], function () {
            if (nicknamesHTMLListOpened == false) {
                nicknameSetupp.style.backgroundColor = "black";
                nicknameSetupp.style.color = "white";
                triangleDownDiv.style = "z-index: 1; cursor: pointer; position: absolute; top: 81px; left: 277px; width: 0px; height: 0px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid rgb(255, 255, 255); font-size: 0px; line-height: 0; float: left;";
            }
        })
        atMouseClick([nicknameSetupp, triangleDownDiv], function () {
            if (nicknamesHTMLListOpened == false) {
                nicknamesHTMLListOpened = true;
                nicknamesHTMLList.style.display = "block";
            }
        })
        atClickOutside([nicknameSetupp, triangleDownDiv, nicknamesHTMLList], 3, function () {
            nicknameSetupp.style.backgroundColor = "black";
            nicknameSetupp.style.color = "white";
            triangleDownDiv.style = "z-index: 1; cursor: pointer; position: absolute; top: 81px; left: 277px; width: 0px; height: 0px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid rgb(255, 255, 255); font-size: 0px; line-height: 0; float: left;";
            nicknamesHTMLListOpened = false;
            nicknamesHTMLList.style.display = "none";
        })
        NDiv.appendChild(nicknameSetupp);

        let nicknameSetupButton = document.createElement("button");
        nicknameSetupButton.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 18px; width: 133px; height: 40px; top: 115px; color: white; padding: 5px 5px 7px; cursor: pointer; background-color: black;";
        nicknameSetupButton.innerHTML = "Valid nickname..."
        nicknameSetupButton.id = "nicknameSetupButton";
        atMouseHover([nicknameSetupButton], function () {
            nicknameSetupButton.style.backgroundColor = "white";
            nicknameSetupButton.style.color = "black";
        })
        atMouseOut([nicknameSetupButton], function () {
            nicknameSetupButton.style.backgroundColor = "black";
            nicknameSetupButton.style.color = "white";
        })
        atMouseClick([nicknameSetupButton], function () {
            document.getElementById("signDiv-username").value = nicknameSetupp.innerHTML;
        })
        NDiv.appendChild(nicknameSetupButton);

        let BDiv = document.createElement("div");
        BDiv.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 10px; width: 328px; height: 189px; top: 214px; color: white; padding: 5px 5px 7px; background-color: black;";
        BDiv.id = "BDiv";
        BlDiv.appendChild(BDiv);

        let ExplainText2 = document.createElement('p');
        ExplainText2.style = "position: absolute; font-family: system-ui; left: 20px; top: 21px; color: white;";
        ExplainText2.innerHTML = "Chat incredibles text...";
        ExplainText2.id = "ExplainText2"
        BDiv.appendChild(ExplainText2);

        let chatSetupp = document.createElement("textarea");
        let spamMsg = "Sof is cool !!";
        chatSetupp.style = "position: absolute; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 20px; width: 292px; top: 68px; color: white; padding-left: 19px; padding-top: 5px; resize: none; padding-bottom: 7px; background-color: black; height: 58px;";
        chatSetupp.placeholder = "Spam message...";
        chatSetupp.value = spamMsg;
        chatSetupp.spellcheck = "false";
        chatSetupp.id = "chatSetupp";
        BDiv.appendChild(chatSetupp);

        let spamSetupButton = document.createElement("button");
        spamSetupButton.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 18px; width: 167px; height: 40px; top: 141px; color: white; padding: 5px 5px 7px; cursor: pointer; background-color: black;";
        spamSetupButton.innerHTML = "Valid spam message..."
        spamSetupButton.id = "spamSetupButton";
        atMouseHover([spamSetupButton], function () {
            spamSetupButton.style.backgroundColor = "white";
            spamSetupButton.style.color = "black";
        })
        atMouseOut([spamSetupButton], function () {
            spamSetupButton.style.backgroundColor = "black";
            spamSetupButton.style.color = "white";
        })
        atMouseClick([spamSetupButton], function () {
            spamMsg = chatSetupp.value;
            document.getElementById("chattext").value = spamMsg;
        })
        BDiv.appendChild(spamSetupButton);

        let checkCase = document.createElement("p");
        checkCase.style = "position: absolute; z-index: -1; font-family: system-ui; text-align: center; box-shadow: white 0px 0px 0px 1px inset; left: 210px; height: 19px; width: 19px; top: 152px; font-size: 13px; color: white; padding: 0px 0 0 0; cursor: pointer; background-color: black;";
        checkCase.innerHTML = "✖";
        checkCase.id = "checkcase";
        atMouseHover([checkCase], function () {
            checkCase.style.backgroundColor = "white";
            checkCase.style.color = "black";
        })
        atMouseOut([checkCase], function () {
            if (checkCase.innerHTML == "✖") {
                checkCase.style.backgroundColor = "black";
                checkCase.style.color = "white";
            } else if (checkCase.innerHTML == "✔") {
                checkCase.style.backgroundColor = "white";
                checkCase.style.color = "black";
            }
        })
        atMouseClick([checkCase], function () {
            if (checkCase.innerHTML == "✖") {
                checkCase.innerHTML = "✔";
            } else if (checkCase.innerHTML == "✔") {
                checkCase.innerHTML = "✖";
            }
        })
        BDiv.appendChild(checkCase);

        let checkCaseText = document.createElement("p");
        checkCaseText.style = "position: absolute; font-family: system-ui; left: 237px; top: 150px; color: white;";
        checkCaseText.innerHTML = "Lock ꗃ";
        checkCaseText.id = "checkCaseText";
        document.onkeydown = function (m) {
            if (m.key == "Enter") {
                if (checkCase.innerHTML == "✔") {
                    document.getElementById("chattext").value = spamMsg;
                }
            }
        }
        BDiv.appendChild(checkCaseText);

        let CDiv = document.createElement("div");
        CDiv.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 10px; width: 328px; height: 162px; top: 434px; color: white; padding: 5px 5px 7px; background-color: black;";
        CDiv.id = "CDiv";
        BlDiv.appendChild(CDiv);

        let CaDiv = document.createElement("div");
        CaDiv.style = "position: absolute; z-index: 100; left: 10px; width: 328px; background-color: rgba(255,255,255,0.3); cursor: not-allowed; height: 162px; top: 434px; padding: 5px 5px 7px;";
        CaDiv.id = "CDiv";
        BlDiv.appendChild(CaDiv);

        let adminLogInput = document.createElement("input");
        adminLogInput.style = "position: absolute; border-color: transparent; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 30px; width: 266px; top: 53px; color: white; padding-left: 19px; padding-top: 5px; resize: none; padding-bottom: 7px; background-color: black;";
        adminLogInput.placeholder = "Client password...";
        adminLogInput.type = "password";
        Div.appendChild(adminLogInput);

        let ExplainText6 = document.createElement("p");
        ExplainText6.style = "position: absolute; top: 94px; left: 30px; color: white; font-family: system-ui;";
        ExplainText6.innerHTML = "Not Logged."
        Div.appendChild(ExplainText6);

        let ExplainText7 = document.createElement("p");
        ExplainText7.style = "position: absolute; font-size: 14px; top: 133px; left: 30px; color: white; font-family: system-ui;";
        ExplainText7.innerHTML = "You must login as client for have acces to server crash<br>and have your own nickname."
        Div.appendChild(ExplainText7);

        let adminLogButton = document.createElement("button");
        adminLogButton.style = "position: absolute; cursor: pointer; border-color: transparent; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 309px; width: 61px; top: 53px; color: white; padding-top: 5px; resize: none; padding-bottom: 7px; background-color: black;";
        adminLogButton.innerHTML = "Login";
        atMouseHover([adminLogButton], function () {
            adminLogButton.style.backgroundColor = "white";
            adminLogButton.style.color = "black";
        })
        atMouseOut([adminLogButton], function () {
            adminLogButton.style.backgroundColor = "black";
            adminLogButton.style.color = "white";
        })
        atMouseClick([adminLogButton], function () {
            if (adminLogInput.value == "PpYy2J2V") {
                ExplainText6.style.color = "green";
                ExplainText6.innerHTML = "Logged in.";
                ExplainText7.style.color = "green";
                ExplainText7.innerHTML = "Welcome client !";
                adminLogInput.style.display = "none";
                adminLogButton.style.display = "none";
                BlDiv.removeChild(CaDiv);
            } else {
                ExplainText6.style.color = "red";
                ExplainText6.innerHTML = "Wrong password !";
                ExplainText7.style.color = "red";
                ExplainText7.innerHTML = "Please, try again or ask to Sof (aka 'Raylazzz' or 'zzz the hacker', the dev of the script) to make you an client on this discord <br> chanel : 'https://discord.gg/8gu3fcb5'.<a href='https://discord.gg/8gu3fcb5' target='blank' style='position: absolute;font-size: 14px;left: 54px;top: 20px;color: #fb00ff;font-family: system-ui;'>https://discord.gg/8gu3fcb5</a>";
            }
        })
        Div.appendChild(adminLogButton);

        let ExplainText3 = document.createElement('p');
        ExplainText3.style = "position: absolute; font-family: system-ui; left: 20px; top: 21px; color: white;";
        ExplainText3.innerHTML = "Let's generate some crash bots...";
        ExplainText3.id = "ExplainText3"
        CDiv.appendChild(ExplainText3);

        let botsSetupp = document.createElement("input");
        let botsNumberToGenerate = 0;
        botsSetupp.style = "position: absolute; border-color: transparent; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 19px; width: 292px; top: 68px; color: white; padding-left: 19px; padding-top: 5px; resize: none; padding-bottom: 7px; background-color: black;";
        botsSetupp.placeholder = "Number of bots to generate...";
        botsSetupp.value = botsNumberToGenerate;
        botsSetupp.spellcheck = "false";
        botsSetupp.id = "chatSetupp";
        CDiv.appendChild(botsSetupp);

        let ExplainText4 = document.createElement('p');
        ExplainText4.style = "position: absolute; font-family: system-ui; left: 146px; top: 112px; color: white;";
        ExplainText4.innerHTML = "";
        ExplainText4.id = "ExplainText4"
        CDiv.appendChild(ExplainText4);

        let ValidCrashBotsButton = document.createElement("button");
        ValidCrashBotsButton.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 18px; width: 98px; height: 40px; top: 113px; color: white; padding: 5px 5px 7px; cursor: pointer; background-color: black;";
        ValidCrashBotsButton.innerHTML = "Generate..."
        ValidCrashBotsButton.id = "ValidCrashBotsButton";
        atMouseHover([ValidCrashBotsButton], function () {
            ValidCrashBotsButton.style.backgroundColor = "white";
            ValidCrashBotsButton.style.color = "black";
        })
        atMouseOut([ValidCrashBotsButton], function () {
            ValidCrashBotsButton.style.backgroundColor = "black";
            ValidCrashBotsButton.style.color = "white";
        })
        atMouseClick([ValidCrashBotsButton], function () {
            botsNumberToGenerate = botsSetupp.value;
            document.getElementById("signDiv-username").value = "Sof Bots."
            for (let i = 0; i < botsNumberToGenerate; i++) {
                if (ExplainText6.innerHTML == "Logged in.") {
                    play();
                }
            }
            document.getElementById("signDiv-username").value = nicknameSelected;
        })
        CDiv.appendChild(ValidCrashBotsButton);

        let Screen = document.createElement("div");
        Screen.style = "position: absolute; z-index: 0; width: 100%; height: 100%; cursor: crosshair;";
        Screen.id = "Screen";
        document.body.appendChild(Screen);


        let MDiv = document.createElement("div");
        MDiv.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 10px; width: 328px; height: 125px; top: 629px; color: white; padding: 5px 5px 7px; background-color: black;";
        MDiv.id = "MDiv";
        BlDiv.appendChild(MDiv);

        let ExplainText5 = document.createElement('p');
        ExplainText5.style = "position: absolute; font-family: system-ui; left: 20px; top: 21px; color: white;";
        ExplainText5.innerHTML = "Let's set the mood for this game <br>with music!";
        ExplainText5.id = "ExplainText5"
        MDiv.appendChild(ExplainText5);

        let music = document.createElement("iframe");
        music.id = "existing-iframe-example";
        music.style = "display: none;"
        music.src = "https://www.youtube.com/embed/v8lINsulm0M?autoplay=1&enablejsapi=1";

        let playMusicButton = document.createElement("button");
        playMusicButton.style = "position: absolute; z-index: -1; font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; left: 18px; width: 98px; height: 40px; top: 78px; color: white; padding: 5px 5px 7px; cursor: pointer; background-color: black;";
        playMusicButton.innerHTML = "Play a music..."
        playMusicButton.id = "playMusicButton";
        atMouseHover([playMusicButton], function () {
            playMusicButton.style.backgroundColor = "white";
            playMusicButton.style.color = "black";
        })
        atMouseOut([playMusicButton], function () {
            playMusicButton.style.backgroundColor = "black";
            playMusicButton.style.color = "white";
        })
        atMouseClick([playMusicButton], function () {
            document.body.appendChild(music);
        })
        MDiv.appendChild(playMusicButton);

        let buttonPlay = document.getElementById("joinerthing").parentNode;
        buttonPlay.style = "font-family: system-ui; box-shadow: white 0px 0px 0px 1px inset; width: 300px; height: 60px; color: white; padding: 5px 5px 7px; cursor: pointer; background-color: black; margin-bottom: 8px;";
        atMouseHover([buttonPlay, document.getElementById("joinerthing")], function () {
            buttonPlay.style.backgroundColor = "white";
            document.getElementById("joinerthing").style.color = "black";
        })
        atMouseOut([buttonPlay, document.getElementById("joinerthing")], function () {
            buttonPlay.style.backgroundColor = "black";
            document.getElementById("joinerthing").style.color = "white";
        })
        atMouseClick([buttonPlay, document.getElementById("joinerthing")], function () {
            if (ExplainText6.innerHTML !== "Logged in.") {
                document.getElementById("signDiv-username").value = nicknameSelected;
            }
            play();
        })
    }
    HTMLcheat();

})();