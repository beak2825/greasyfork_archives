// ==UserScript==
// @name         Skribbl / Skribbl.io QOL (Discontinued)
// @version      0.12.3
// @description  Quality of life improvements for Skribbl.io
// @author       4TSOS
// @match        *skribbl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @namespace    https://greasyfork.org/users/784494
// @downloadURL https://update.greasyfork.org/scripts/445058/Skribbl%20%20Skribblio%20QOL%20%28Discontinued%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445058/Skribbl%20%20Skribblio%20QOL%20%28Discontinued%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = "Skribbl.io";
    window.addEventListener('load', function() {
        const inputChat = document.querySelector("#inputChat");
        const inputName = document.querySelector("#inputName");
        const currentWord = document.querySelector("#currentWord");
        const header = document.querySelector("body > div.container-fluid > div.header");
        const timer = document.querySelector("#timer");
        const chatBox = document.querySelector("#boxMessages");
        const customWords = document.querySelector("#lobbySetCustomWords");
        const playerList = document.querySelector("#containerPlayerlist");
        const mutedPlayers = [];
        var currentWordLength = null;
        qol_setup();
        qol_gameChanges();
        qol_menuChanges();
        qol_style();
        qol_loadedAlert();
        function qol_setup() {
            if (!localStorage.getItem("avatars")) {
                localStorage.setItem("avatars", JSON.stringify([]))
            };
            if (!localStorage.getItem("wordlists")) {
                localStorage.setItem("wordlists", JSON.stringify([]))
            };
            var avatarHolder = document.createElement("div");
            var marker = 0;
            avatarHolder.id = "qol-saved-avatars";
            JSON.parse(localStorage.getItem("avatars")).forEach(function(item) {
                marker += 1
                var avatarLink = document.createElement("button");
                avatarLink.innerHTML = `#${marker} - ${item}`;
                avatarLink.onclick = function() {
                    localStorage.setItem("avatar", JSON.stringify(item));
                    window.location.reload();
                };
                avatarLink.id = `qol-saved-avatar-${marker}`;
                avatarHolder.appendChild(avatarLink);
            });
            document.querySelector("#loginAvatarCustomizeContainer").appendChild(avatarHolder)
        };
        function qol_gameChanges() {

            // Help & Bug Fixes

            function qol_help() {

                // Timer

                const gameTimerObserver = new MutationObserver(function() {
                    document.title = `(${timer.innerHTML}s) Skribbl.io`;
                });

                // Input Tracker (Counter)

                const gameWordObserver = new MutationObserver(function() {
                    currentWordLength = currentWord.innerHTML.length;
                    if (!document.querySelector("#formChat > h4")) {
                        var inputTracker = document.createElement("h4");
                        inputTracker.innerHTML = `(${inputChat.value.length}/${currentWordLength})`;
                        document.querySelector("#formChat").appendChild(inputTracker)
                    }
                    else {
                        document.querySelector("#currentWord > h4").innerHTML = `(${inputChat.value.trim().length}/${currentWordLength})`;
                    };
                });
                gameTimerObserver.observe(document.querySelector("#timer"), {childList: true, subtree: false, attributes: false});
                gameWordObserver.observe(document.querySelector("#currentWord"), {childList: true, subtree: false, attributes: false});

                // Input Tracker (Colouring)

                document.body.addEventListener('keydown', function() {
                    inputChat.focus();
                    inputName.focus();
                    setTimeout(function() {
                        if (document.querySelector("#formChat > h4")) {
                            document.querySelector("#formChat > h4").innerHTML = `(${inputChat.value.trim().length}/${currentWord.innerHTML.length})`;
                            if (inputChat.value.trim().length > currentWord.innerHTML.length || inputChat.value.trim().length < currentWord.innerHTML.length) {
                                document.querySelector("#formChat > h4").style.color = "red";
                            };
                            if (inputChat.value.trim().length == 0) {
                                document.querySelector("#formChat > h4").style.color = "black";
                            };
                            if (inputChat.value.trim().length == currentWord.innerHTML.length) {
                                document.querySelector("#formChat > h4").style.color = "green";
                            };
                        };
                    }, 100);
                });

                // Chat Scroll Fix & Name Highlighting

                const gameChatObserver = new MutationObserver(function() {
                    chatBox.scrollTop = chatBox.scrollHeight;
                    try {
                        if (mutedPlayers.includes(chatBox.lastChild.querySelector("b").innerHTML.trim().toLowerCase().replace(":", ""))) {
                            chatBox.lastChild.remove();
                        };
                    }
                    catch {
                        return;
                    };
                    try {
                        localStorage.getItem("name").toLowerCase().trim().split(' ').forEach(function(part) {
                            if (chatBox.lastChild.querySelector("span").innerHTML.toLowerCase().trim().includes(part)) {
                                chatBox.lastChild.style.background = "yellow";
                            };
                        });
                    }
                    catch {
                        return
                    };
                });
                gameChatObserver.observe(chatBox, {childList: true, subtree: false, attributes: false})
            };

            // Buttons

            function qol_buttons() {

                // Toggle Word & Clear Chat

                const qolButtonsList = document.createElement("div");
                const qolWordToggle = document.createElement("button");
                const qolClearChat = document.createElement("button");
                const qolCanvasToggle = document.createElement("button");
                qolButtonsList.id = "qol-header-buttons-list";
                qolWordToggle.id = "qol-word-toggle";
                qolWordToggle.className = "qol-button";
                qolWordToggle.innerHTML = "Hide Word";
                qolWordToggle.onclick = function() {
                    if (!document.querySelector("#currentWord").style.visibility) {
                        document.querySelector("#currentWord").style.visibility = "hidden";
                        document.querySelector("#qol-word-toggle").innerHTML = "Show Word";
                        return
                    }
                    else {
                        document.querySelector("#currentWord").removeAttribute("style");
                        document.querySelector("#qol-word-toggle").innerHTML = "Hide Word";
                        return
                    };
                };
                qolClearChat.id = "qol-clear-chat";
                qolClearChat.className = "qol-button";
                qolClearChat.innerHTML = "Clear Chat";
                qolClearChat.onclick = function() {
                    var chatMessages = document.querySelectorAll("#boxMessages > *");
                    chatMessages.forEach(function(message) {
                        message.remove();
                    });
                };
                qolCanvasToggle.id = "qol-canvas-toggle";
                qolCanvasToggle.className = "qol-button";
                qolCanvasToggle.innerHTML = "Hide Canvas";
                qolCanvasToggle.onclick = function() {
                    if (this.innerHTML.toLowerCase() == "hide canvas") {
                        document.querySelector("#canvasGame").style = `filter: brightness(0);`;
                        this.innerHTML = "Show Canvas";
                        return
                    };
                    if (this.innerHTML.toLowerCase() == "show canvas") {
                        document.querySelector("#canvasGame").style = `filter: none;`;
                        this.innerHTML = "Hide Canvas";
                        return
                    };
                };
                qolButtonsList.appendChild(qolWordToggle);
                qolButtonsList.appendChild(qolCanvasToggle);
                qolButtonsList.appendChild(qolClearChat);
                document.querySelector("#containerPlayerlist").appendChild(qolButtonsList);

                // Mute Buttons

                const playersObserver = new MutationObserver(function() {
                    var players = playerList.querySelector("#containerGamePlayers").childNodes;
                    players.forEach(function(player) {
                        if (!player.querySelector("#qol-mute-button")) {
                            var muteButton = document.createElement("img");
                            muteButton.id = "qol-mute-button";
                            muteButton.style.backgroundImage = "url(https://skribbl.io/res/audio.gif)";
                            muteButton.onclick = function() {
                                if (this.hasAttribute("style")) {
                                    this.removeAttribute("style")
                                    mutedPlayers.push(player.querySelector("div.info > div.name").innerHTML.toLowerCase());
                                    player.querySelector(".message").setAttribute("style", `visibility: hidden !important;`)
                                    return
                                };
                                if (!this.hasAttribute("style")) {
                                    this.setAttribute("style", `background: url(https://skribbl.io/res/audio.gif) !important; background-size: contain !important;`);
                                    mutedPlayers.pop(player.querySelector("div.info > div.name").innerHTML.toLowerCase());
                        player.querySelector(".message").removeAttribute("style");
                        return
                    };
                };
                            player.appendChild(muteButton);
                        };
                        if (player.querySelector("div.info > div.name").innerHTML.toLowerCase().includes("(you)")) {
                            player.querySelector("div.info > div.name").innerHTML = player.querySelector("div.info > div.name").innerHTML.replace(" (You)", "")
                        };
                    });
                });
                playersObserver.observe(document.querySelector("#containerGamePlayers"), {childList: true, attributes: false, subtree: true})
            };
            qol_help();
            qol_buttons();
        };
        function qol_publicChanges() {};
        function qol_privateChanges() {};
        function qol_uncategorized() {};
        function qol_menuChanges() {

            // Avatar Saving, Loading & Editing

            function qol_avatarOptions() {
                const qolButtonsList = document.createElement("div");
                const qolSetAvatar = document.createElement("button");
                const qolSaveAvatar = document.createElement("button");
                const qolClearAvatars = document.createElement("button");
                const qolRemoveAvatar = document.createElement("button");
                qolButtonsList.id = "qol-avatar-buttons-list";
                qolSetAvatar.id = "qol-set-avatar";
                qolSetAvatar.className = "qol-button";
                qolSetAvatar.innerHTML = "Set Avatar";
                qolSetAvatar.onclick = function() {
                    var newAvatar = prompt("Input the array for your new avatar.");
                    try {
                        if (newAvatar.trim().length >= 3 && newAvatar.includes(",")) {
                            if (newAvatar.includes("[", "]")) {
                                localStorage.setItem("avatar", newAvatar);
                                window.location.reload();
                            }
                            else {
                                newAvatar = `[${newAvatar}]`
                                localStorage.setItem("avatar", newAvatar);
                                window.location.reload();
                            };
                        }
                        else {
                            setInterval(function() {
                                window.location.reload()
                            }, 250);
                        };
                    }
                    catch {
                        setInterval(function() {
                            window.location.reload()
                        }, 250);
                    };
                };
                qolSaveAvatar.id = "qol-save-avatar";
                qolSaveAvatar.className = "qol-button";
                qolSaveAvatar.innerHTML = "Save Avatar";
                qolSaveAvatar.onclick = function() {
                    if (!localStorage.getItem("avatars").includes(JSON.parse(localStorage.getItem("avatar")))) {
                        var avatars = JSON.parse(localStorage.getItem("avatars"));
                        var saveAvatar = JSON.parse(localStorage.getItem("avatar"));
                        avatars.push(saveAvatar);
                        var avatarsRaw = JSON.stringify(avatars)
                        localStorage.setItem("avatars", avatarsRaw)
                        setInterval(function() {
                            window.location.reload()
                        }, 250)
                    }
                    else {
                        setInterval(function() {
                            window.location.reload()
                        }, 250)
                    };
                };
                qolClearAvatars.id = "qol-clear-avatars";
                qolClearAvatars.className = "qol-button";
                qolClearAvatars.innerHTML = "Clear Avatars";
                qolClearAvatars.onclick = function() {
                    localStorage.setItem("avatars", []);
                    window.location.reload();
                };
                qolRemoveAvatar.id = "qol-remove-avatar";
                qolRemoveAvatar.className = "qol-button";
                qolRemoveAvatar.innerHTML = "Remove Avatar";
                qolRemoveAvatar.onclick = function() {
                    var avatarRemove = prompt("Input the number of the avatar you want to remove.");
                    try {
                        if (!isNaN(avatarRemove) && avatarRemove.length > 0 && avatarRemove !== null) {
                            var avatarRemoveParsed = parseInt(avatarRemove);
                            var avatarRemoveFinal = avatarRemoveParsed - 1;
                            var avatars = JSON.parse(localStorage.getItem("avatars"));
                            avatars.splice(avatarRemoveFinal);
                            var avatarsRaw = JSON.stringify(avatars);
                            localStorage.setItem("avatars", avatarsRaw);
                            window.location.reload();
                        }
                        else {
                            setInterval(function() {
                                window.location.reload()
                            }, 250)
                        };
                    }
                    catch {
                        setInterval(function() {
                            window.location.reload()
                        }, 250)
                    };
                };
                qolButtonsList.appendChild(qolSaveAvatar);
                qolButtonsList.appendChild(qolSetAvatar);
                qolButtonsList.appendChild(qolClearAvatars);
                qolButtonsList.appendChild(qolRemoveAvatar)
                document.querySelector("#loginAvatarCustomizeContainer").appendChild(qolButtonsList)
            };
            function qol_minimizeUI() {
                document.querySelector("#screenLogin > div.login-content > div:nth-child(2)").remove();
                document.querySelector("#screenLogin > div.login-content > div.col-xs-12").remove();
                document.querySelector("#screenLogin > div.login-side-left").remove();
                document.querySelector("#screenLogin > div.login-side-right").remove();
            };
            qol_minimizeUI();
            qol_avatarOptions();
        };
    function qol_style() {
        var qolStyle = document.createElement("style");
        qolStyle.innerHTML = `.qol-button {background-color: #f0ad4e !important; border-color: #eea236 !important; color: #fff !important; height: fit-content !important; border: none !important;}
        #currentWord {display: flex !important; justify-content: center !important; flex-direction: row !important;}
        #formChat {display: flex !important; flex-direction: row !important;}
        #qol-header-buttons-list {display: flex !important; justify-content: center !important; flex-direction: column !important;}
        #qol-header-buttons-list .qol-button {padding: 5px !important; border: none !important;}
        .qol-button:hover {background: #ec971f !important;}
        #qol-avatar-buttons-list {display: flex !important; flex-direction: column !important;}
        #qol-saved-avatars {display: flex !important; flex-direction: column !important; overflow-y: scroll !important; min-height: 30px !important; max-height: 106.5px}
        #qol-saved-avatars button {color: orange !important; border: none !important; outline: auto !important;}
        #qol-mute-button:hover {cursor: pointer !important;}
        #qol-mute-button {background: url("https://skribbl.io/res/audio_off.gif"); background-size: contain !important; padding: 9% !important; background-repeat: no-repeat !important;}
        .avatarArrows {justify-content: start !important;}
        #votekickCurrentplayer {border: none !important; border-radius: 0px !important;}
        body > div > div.grecaptcha-badge {display: none !important;}
        #screenLogin > div.login-side-left, div.login-side-right {display: none !important;}
        #containerFreespace {display: none !important;}
        #screenLogin {display: flex; justify-content: center !important; min-height: 260px !important; max-height: 585px !important;}
        #containerPlayerlist {justify-content: normal !important;}
        #qol-alert {color: white !important; margin-left: auto !important; margin-right: auto !important; width: fit-content !important; background: black !important;}
        @media only screen and (max-width: 600px) {div.container-fluid:not(div.header, #screenLogin) {display: flex !important; flex-direction: row !important;}
        #containerLogoSmall {display: none !important;}
        #containerLogoBig {display: none !important;}
        #containerSidebar {display: flex !important; flex-direction: row !important; justify-content: end !important;}
        #containerChat {min-height: 310px !important; max-height: 560px !important;}
        #boxMessages {min-height: calc(300px - 34px) !important; max-height: calc(550px - 34px) !important;}
        #screenLogin {margin-top: 50% !important;}
        #loginAvatarCustomizeContainer {justify-content: space-evenly !important;}}
        @keyframes background {
        33% {background-size: 256px;}
        66% {background-size: 200px;}
        }
        body {animation-name: background; animation-iteration-count: infinite; animation-duration: 45s; animation-delay: 0s}`;
        document.head.appendChild(qolStyle);
    };
        function qol_loadedAlert() {
            var qolAlert = document.createElement("h1");
            qolAlert.id = "qol-alert";
            qolAlert.innerHTML = `Loaded in ${Math.floor(event.timeStamp)}ms`;
            document.body.appendChild(qolAlert);
            setTimeout(function() {document.querySelector("#qol-alert").remove()}, 2500);
        };
    });
})();