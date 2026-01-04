// ==UserScript==
// @name         Super Omegle
// @namespace    https://openuserjs.org/user/burn
// @version      1.0
// @description  Removes banners. Write first/second message and auto-reconnect when disconnected. User defined message buttons. Quick skip and exit buttons.
// @author       NA
// @copyright    2019, burn (https://openuserjs.org//users/burn)
// @license      MIT
// @match        https://www.omegle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408375/Super%20Omegle.user.js
// @updateURL https://update.greasyfork.org/scripts/408375/Super%20Omegle.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var options = {
            greetingMessage1 : "Hey! How are you?",
            greetingMessage2 : "Would you like to chat?",
            originalWidth: null,
            originalHeight: null,
            screenHeight: window.innerWidth,
            screenWidth: window.innerHeight,
            disconnectOnIdle : {
                timeoutId : null
            },
            leaveSiteMessageDisabled: true,
            buttonMessages: {
                "From?": "Where are you from?",
                "LOL": "LOL",
            }
        },

        BreakException = {},
        targetNode = document.querySelector('body'),
        observerConfig = { attributes: false, childList: true, subtree: true },
        tId1 = null,
        tId2 = null,
        tId3 = null,
        tId4 = null,
        previousListLength = 0,
        getRndIntBetween = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        callback = function(mutationsList, observer) {
        try {
            mutationsList.forEach(function (mutation) {
                var entry = {
                    mutation: mutation,
                    el: mutation.target,
                    value: mutation.target.textContent,
                    oldValue: mutation.oldValue
                };

                if (entry.el.classList.contains("statuslog")) {
                    if (targetNode.classList.contains("inconversation")) {
                        tId1 === null && (tId1 = window.setTimeout(
                            function() {
                                if(!document.querySelector(".sendbtn").getAttribute('sendMsg') || document.querySelector(".sendbtn").getAttribute('sendMsg') === "firstMessage") {
                                    sendMessage(options.greetingMessage1);
                                    document.querySelector(".sendbtn").setAttribute("sendMsg", "secondMessage");
                                }
                                if(options.greetingMessage2 && options.greetingMessage2 != '') {
                                   tId2 === null && (tId2 = window.setTimeout(
                                       function() {
                                           if(document.querySelector(".sendbtn").getAttribute('sendMsg') === "secondMessage") {
                                               sendMessage(options.greetingMessage2);
                                           }
                                       }
                                   , getRndIntBetween(1.0*1000, 3.0*1000)));
                                }
                            }
                        , getRndIntBetween(1.0*1000, 3.0*1000)) );



                        var elem2 = document.getElementById("abovevideosexybtn");
                        if( elem2 != null) {
                            elem2.parentElement.removeChild(elem2);
                        }

                        var elem3 = document.getElementById("videologo");
                        if( elem3 != null) {
                            elem3.parentElement.removeChild(elem3);
                        }

                        // Resize video windows and chat
                        var othervideoElem = document.getElementById("othervideo");
                        var selfvideoElem = document.getElementById("selfvideo");
                        var disconnetBtn = document.querySelector(".disconnectbtn");
                        if( othervideoElem != null && options.otherVideoSize == null) {
							 console.log("width: "+options.screenWidth+"   height: " + options.screenHeight);

                            options.otherVideoSize = { width: (1.4 * parseInt(othervideoElem.style.width)), height: (1.4 * parseInt(othervideoElem.style.height)) };
                            options.selfVideoSize = { width: (parseInt(selfvideoElem.style.width)/1.4), height: (parseInt(selfvideoElem.style.height)/1.4) };
                            options.originalHeight = othervideoElem.style.height;
                        }

                        othervideoElem.setAttribute("style", "width: "+options.otherVideoSize.width+"px; height: "+options.otherVideoSize.height+"px; top: 0px;");
                        selfvideoElem.setAttribute("style", "z-index: 100; width: "+Math.floor(options.selfVideoSize.width)+"px; height: "+Math.floor(options.selfVideoSize.height)+"px;");

                       // Add buttons
                        if(!document.getElementById("skipButton")) {
                            var disconnetBtnWidth = window.getComputedStyle(disconnetBtn).getPropertyValue('width');
                            var disconnetBtnHeight = window.getComputedStyle(disconnetBtn).getPropertyValue('height');

                            var mainContainer = document.createElement("div");
                            mainContainer.id = "mainContainer"
                            var containerWidth = Math.floor(options.otherVideoSize.width) - Math.floor(options.selfVideoSize.width);
                            mainContainer.setAttribute("style", "z-index: 100; margin-left: "+Math.floor(options.selfVideoSize.width+5)+"px; margin-top: "+Math.floor(options.otherVideoSize.height)+"px; width: "+containerWidth+"px; height: "+Math.floor(options.selfVideoSize.height)+"px;");
                            insertAfter(othervideoElem, mainContainer);

                            var buttonContainer = document.createElement("div");
                            buttonContainer.id = "buttonContainer"
                            buttonContainer.setAttribute("style", "width: "+containerWidth+"px;");
                            mainContainer.appendChild(buttonContainer);

                            var skipButton = document.createElement("button");
                            skipButton.innerHTML = "Skip";
                            skipButton.id = "skipButton"
                            skipButton.setAttribute("style", "width: "+disconnetBtnWidth+"; height: "+disconnetBtnHeight+"; margin-right: 5px; margin-top: 3px;");
                            skipButton.onclick = function() { disconnectChat(); };
                            buttonContainer.appendChild(skipButton);

                            var exitButton = document.createElement("button");
                            exitButton.innerHTML = "Exit";
                            exitButton.id = "exitButton"
                            exitButton.setAttribute("style", "width: "+disconnetBtnWidth+"; height: "+disconnetBtnHeight+"; margin-right: 5px; margin-top: 3px;");
                            exitButton.onclick = function() {
                                if(options.leaveSiteMessageDisabled) {
                                    window.onbeforeunload = null;
                                }
                                location.href = "https://www.omegle.com/";
                            };
                            buttonContainer.appendChild(exitButton);

                            var chatContainer = document.createElement("div");
                            chatContainer.id = "chatContainer"
                            chatContainer.setAttribute("style", "width: "+containerWidth+"px;");
                            mainContainer.appendChild(chatContainer);
                            Object.keys(options.buttonMessages).forEach(function(key) {
                                var dynamicButton = document.createElement("button");
                                dynamicButton.innerHTML = key;
                                dynamicButton.id = key.replace(/\D/g,'') + "Button"
                                dynamicButton.setAttribute("style", "width: "+((parseInt(disconnetBtnWidth)/2)+10)+"px; height: "+((parseInt(disconnetBtnHeight)/2)+10)+"px; margin-right: 5px; margin-top: 3px;");
                                dynamicButton.onclick = function() {
                                    sendMessage(options.buttonMessages[key]);
                                };
                                chatContainer.appendChild(dynamicButton);
                            });

                            var optionContainer = document.createElement("div");
                            optionContainer.id = "optionContainer"
                            optionContainer.setAttribute("style", "width: "+containerWidth+"px; vertical-align : bottom;");
                            mainContainer.appendChild(optionContainer);

                            var timebox = document.createElement("INPUT");
                            timebox.id = "timebox"
                            timebox.setAttribute("type", "text");
                            timebox.setAttribute("maxlength", "3");
                            timebox.value = "60";

                            var disconnectOnIdleCheckbox = document.createElement("INPUT");
                            disconnectOnIdleCheckbox.id = "disconnectOnIdleCheckbox"
                            disconnectOnIdleCheckbox.setAttribute("type", "checkbox");
                            disconnectOnIdleCheckbox.checked = true;

                            optionContainer.appendChild(disconnectOnIdleCheckbox);
                            optionContainer.appendChild(document.createTextNode('Disconnect after '));
                            optionContainer.appendChild(timebox);
                            optionContainer.appendChild(document.createTextNode(' seconds '));
                        }

                        var logwrapperElem = document.getElementsByClassName("logwrapper")[0];
                        if( logwrapperElem != null) {
                            var logwrapperElemWidth = options.otherVideoSize.width + 15;
                            logwrapperElem.setAttribute("style", "top: 0px; margin-left: "+Math.floor(logwrapperElemWidth)+"px;");

                            var controlwrapperElem = document.getElementsByClassName("controlwrapper")[0];
                            if( controlwrapperElem != null) {
                                controlwrapperElem.setAttribute("style", "margin-left: "+Math.floor(logwrapperElemWidth)+"px;");
                            }
                        }

                    }
                }
                if (entry.el.firstChild && entry.el.firstChild.classList) {
                    tId1 = null;
                    tId2 = null;
                    tId3 = null;
                    tId4 = null;

                    var noButton = document.querySelector("body > div.chatbox3 > div > div > div.logwrapper > div.logbox > div > div > div > div:nth-child(2) > div:nth-child(2)");
                    if(noButton) {
                        noButton.click();
                    }

                    if (entry.el.firstChild.classList.contains("logitem")) {
                        var logs = document.querySelectorAll('.logitem');
                        if (logs.length == 1 && document.querySelector("body > div.chatbox3 > div > div > div.logwrapper > div.logbox > div > div:nth-child(1) > p").innerText.includes('now chatting with a random stranger. Say STAND WITH HONG KONG AGAINST THE CCP!')) {

                        }
                        if (logs.length > previousListLength) {
                            var text = logs[ logs.length - 1 ].innerText;
                            console.log(text);
                            var disconnectOnIdleCheckboxElem = document.getElementById("disconnectOnIdleCheckbox");
                            var timeboxElem = document.getElementById("timebox");
                            if(disconnectOnIdleCheckboxElem) {
                                if (disconnectOnIdleCheckboxElem.checked) {
                                    clearTimeout(options.disconnectOnIdle.timeoutId);
                                    options.disconnectOnIdle.timeoutId = null;
                                }

                                if (disconnectOnIdleCheckboxElem.checked &&
                                    options.disconnectOnIdle.timeoutId === null) {
                                    options.disconnectOnIdle.timeoutId = window.setTimeout(function() {
                                        if (disconnectOnIdleCheckboxElem.checked) {
                                            console.log("Timeout");
                                            disconnectChat();
                                        }
                                    }, (timeboxElem.value * 1000));
                                }
                            }
                        }
                        if (document.querySelector(".newbtn .disconnectbtn")) {
                            previousListLength = 0;
                            document.querySelector(".sendbtn").setAttribute("sendMsg", "firstMessage");
                            window.setTimeout(function() {
                                document.querySelector(".newbtn .disconnectbtn")
                                && document.querySelector(".newbtn .disconnectbtn").click();
                            }, getRndIntBetween(1.2 * 1000, 1.8 * 1000));
                        }
                    }
                }
            });
        } catch(e) {
            if (e !== BreakException) throw e;
        }
    };

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function disconnectChat() {
        var stopButton = document.querySelector(".disconnectbtn");
        if(stopButton.innerText.indexOf('Stop') != -1) {
            stopButton.click();
        }

        var reallyButton = document.querySelector(".disconnectbtn");
        if(reallyButton.innerText.indexOf('Really?') != -1) {
            reallyButton.click();
        }

        var newButton = document.querySelector(".disconnectbtn");
        if(newButton.innerText.indexOf('New') != -1) {
            newButton.click();
        }
    }

    function sendMessage(message) {
        var btnSubmit = document.querySelector(".sendbtn");
        var textarea = document.querySelector(".chatmsg");
        if(!btnSubmit.disabled) {
            textarea.value = message;
            btnSubmit != null && btnSubmit.click();
        }
    }

    if(document.querySelector(".sendbtn")) {
       document.querySelector(".sendbtn").setAttribute("sendMsg", "firstMessage");
    }
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, observerConfig);


	var elem1 = document.getElementById("header");
	elem1.parentElement.removeChild(elem1);

	var elem2 = document.getElementById("abovevideosexybtn");
    if( elem2 != null) {
        elem2.parentElement.removeChild(elem2);
    }
    var elem3 = document.getElementById("videologo");
    if( elem3 != null) {
        elem3.parentElement.removeChild(elem3);
    }

    if(options.leaveSiteMessageDisabled) {
        window.onbeforeunload = null;
    }

})();