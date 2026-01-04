// ==UserScript==
// @name         HPS Counter Bloxd.io
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Bloxd.io HPS Counter
// @author       Orazix
// @match        *://*.bloxd.io/*
// @grant        none
// @license MIT
// @copyright 2024, Orazix (https://openuserjs.org/users/Orazix)
// @downloadURL https://update.greasyfork.org/scripts/509793/HPS%20Counter%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/509793/HPS%20Counter%20Bloxdio.meta.js
// ==/UserScript==

(function() {

    let copyFlag = false;
    let hosst = "";
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [resource, config] = args;
        if (resource.includes('/persisted/keep-alive')) {
            if (hosst != resource){

                hosst = resource;
            }
        }
        return originalFetch.apply(this, args);
    };
    document.addEventListener('keydown', function(event) {
        if (event.key === 'g') {
            const rw = document.querySelectorAll('.TextFromServer.undefined');

            rw.forEach(function(element) {
                element.addEventListener("mousedown", function() {
                    if (!copyFlag) {
                        const textContent = element.textContent;
                        const chat = document.getElementsByClassName("ChatMessages")[0];
                        const serverDiv = document.createElement("div");
                        const textDiv = document.createElement("div");
                        const contentDiv = document.createElement("div");
                        serverDiv.className = "MessageWrapper";
                        textDiv.className = "TextFromServer undefined";
                        contentDiv.className = "IndividualText undefined";

                        navigator.clipboard.writeText(textContent).then(function() {

                            contentDiv.textContent = "Successfully Copied to Clipboard!"
                            contentDiv.style.color = "rgb(255,255,0)";



                        }).catch(function(err) {
                            contentDiv.textContent = "Failed to Copied to Clipboard!"
                            contentDiv.style.color = "rgb(255,0,0)";
                        });
                        textDiv.appendChild(contentDiv);
                        serverDiv.appendChild(textDiv);
                        chat.appendChild(serverDiv);
                        copyFlag = true; // Set the flag to true after copying
                    }
                });

                element.addEventListener("mouseup", function() {
                    copyFlag = false; // Reset the flag when the mouse is released
                });

                element.addEventListener("mouseenter", function() {
                    element.style.fontSize = "1.2em";
                });

                element.addEventListener("mouseleave", function() {
                    element.style.fontSize = "";
                });
            });
        }
    });
    document.addEventListener('keydown', function (event){
        var fpsWrapper =document.querySelector("#HPS");
        var fpsWrapper1 =document.querySelector("#DPHPS");
        var fpsWrapper2 =document.querySelector("#DPS");
        var cpsButton =document.querySelector("#CPS");
        if (event.key == "Delete" && !fpsWrapper && !fpsWrapper1 && !fpsWrapper2 && !cpsButton){
            var checkInterval = setInterval(function() {
                var checkHealth = document.querySelector(".BottomScreenStatBarBackground")
                var chatWrapper = document.querySelector('.RightOfChatWrapper');
                var coordWrapper = document.querySelector(".CoordinatesWrapper");

                if (checkHealth || coordWrapper) {
                    // Create the FPSWrapperDiv
                    var fpsWrapper = document.createElement('div');
                    fpsWrapper.className = 'FpsWrapperDiv';
                    fpsWrapper.id = "HPS";

                    var fpsText = document.createElement('div');
                    fpsText.textContent = 'HPS';

                    var fpsNumber = document.createElement('div');
                    fpsNumber.className = 'FpsNumberDiv';

                    fpsNumber.textContent = '0';

                    fpsWrapper.appendChild(fpsText);
                    fpsWrapper.appendChild(fpsNumber);

                    // Add FPSWrapperDiv to the RightOfChatWrapper
                    chatWrapper.appendChild(fpsWrapper);
                    var fpsWrapper1 = document.createElement('div');
                    fpsWrapper1.className = 'FpsWrapperDiv';
                    fpsWrapper1.id = "DPHPS";

                    var fpsText1 = document.createElement('div');
                    fpsText1.textContent = 'DPHPS';

                    var fpsNumber1 = document.createElement('div');
                    fpsNumber1.className = 'FpsNumberDiv';
                    fpsNumber1.textContent = '0';

                    fpsWrapper1.appendChild(fpsText1);
                    fpsWrapper1.appendChild(fpsNumber1);

                    // Add FPSWrapperDiv to the RightOfChatWrapper
                    chatWrapper.appendChild(fpsWrapper1);
                    var fpsWrapper2 = document.createElement('div');
                    fpsWrapper2.className = 'FpsWrapperDiv';
                    fpsWrapper2.id = "DPS";

                    var fpsText2 = document.createElement('div');
                    fpsText2.textContent = 'DPS';


                    var fpsNumber2 = document.createElement('div');
                    fpsNumber2.className = 'FpsNumberDiv';
                    fpsNumber2.textContent = '0';

                    fpsWrapper2.appendChild(fpsText2);
                    fpsWrapper2.appendChild(fpsNumber2);

                    // Add FPSWrapperDiv to the RightOfChatWrapper
                    chatWrapper.appendChild(fpsWrapper2);

                    var ping = document.createElement('div');
                    ping.className = 'FpsWrapperDiv';
                    ping.id = "PING";

                    var pingtext = document.createElement('div');
                    pingtext.textContent = 'Ping';

                    var pingNum = document.createElement('div');
                    pingNum.className = 'FpsNumberDiv';
                    pingNum.textContent = '0';

                    ping.appendChild(pingtext);
                    ping.appendChild(pingNum);

                    // Add FPSWrapperDiv to the RightOfChatWrapper
                    coordWrapper.appendChild(ping);
                    var cpsWrapper = document.createElement('div');
                    cpsWrapper.className = 'FpsWrapperDiv';
                    cpsWrapper.id = "CPS";

                    var cpsText = document.createElement('div');
                    cpsText.textContent = 'CPS';

                    var cpsNumber = document.createElement('div');
                    fpsNumber.className = 'FpsNumberDiv';

                    cpsNumber.textContent = '0';

                    cpsWrapper.appendChild(cpsText);
                    cpsWrapper.appendChild(cpsNumber);
                    coordWrapper.appendChild(cpsWrapper);
                    clearInterval(checkInterval);

                }
            }, 1000);


            var damageTimes = [];
            var damages = [];

            var previousHealth=100;
            var inter = setInterval(function(){
                var fpsWrapper =document.querySelector("#HPS");
                var fpsWrapper1 =document.querySelector("#DPHPS");
                var fpsWrapper2 =document.querySelector("#DPS");
                var cpsButton =document.querySelector("#CPS");
                if (fpsWrapper || cpsButton){
                    clearInterval(inter);
                    var fpsNumber = fpsWrapper.children[1];
                    var fpsNumber1 = fpsWrapper1.children[1];

                    var fpsNumber2 = fpsWrapper2.children[1];
                    var cpsValue = cpsButton.children[1];
                    var clickTimes = [];

                    document.addEventListener('mousedown', function (event) {
                        cpsButton.style.background = "rgba(0,255,0,0.4)";
                        if (event.button === 0) {
                            countClick();
                        } else if (event.button === 2) {
                            countClick();
                        }
                    });
                    document.addEventListener('mouseup', function (event) {

                        cpsButton.style.backgroundColor = "rgba(0,0,0,0.4)";
                    });



                    function countClick() {
                        var currentTime = new Date().getTime();
                        clickTimes.push(currentTime);
                        updateCPS();
                    }

                    function updateCPS() {
                        var currentTime = new Date().getTime();
                        var oneSecondAgo = currentTime - 1000;
                        var count = 0;

                        for (var i = clickTimes.length - 1; i >= 0; i--) {
                            if (clickTimes[i] >= oneSecondAgo) {
                                count++;
                            } else {
                                break;
                            }
                        }

                        cpsValue.textContent = count;
                    }


                    function resetClickCount() {
                        clickTimes = [];
                        updateCPS();
                    }

                    const targetNode = document.getElementsByClassName('BottomScreenStatBarText SmallTextBold')[0];

                    // Create an observer instance linked to the callback function
                    const observer = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                                let texts = targetNode.textContent;
                                let damage_taken = parseInt(texts.trim().split("/"));
                                if (previousHealth===100 || damage_taken !== previousHealth){

                                    console.log(previousHealth);
                                    console.log(damage_taken);
                                    if (previousHealth > damage_taken){
                                        damages.push(previousHealth-damage_taken)
                                    };
                                    previousHealth = damage_taken;
                                    countHit();

                                };
                                console.log(damages);
                            }
                        }
                    });

                    // Start observing the target node for configured mutations
                    observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
                    fpsWrapper.style.background = "rgba(0,255,0,0.4)";
                    fpsWrapper1.style.background = "rgba(0,255,0,0.4)";
                    fpsWrapper2.style.background = "rgba(0,255,0,0.4)";
                    function countHit() {
                        var currentTime1 = new Date().getTime();
                        damageTimes.push(currentTime1);
                        updateHPS();
                    }

                    function updateHPS() {
                        var currentTime1 = new Date().getTime();
                        var oneSecondAgo1 = currentTime1 - 1000;
                        var count1 = 0;
                        var count2 = 0;

                        for (var i = damageTimes.length - 1; i >= 0; i--) {
                            if (damageTimes[i] >= oneSecondAgo1) {
                                count1++;
                            } else {
                                break;
                            }
                        }
                        if (damageTimes[damageTimes.length-1] - damageTimes[damageTimes.length-2] >= 1000){
                            damages=[damages[damages.length-1]];
                        }

                        for (let e of damages){
                            count2 += e;
                        };

                        fpsNumber.textContent = count1;
                        fpsNumber1.textContent = Math.round(count2/(damages.length+1))
                        fpsNumber2.textContent = count2;

                        if (count1 >= 6 && count1 < 8){
                            fpsWrapper.style.backgroundColor = "rgba(255,165,0,0.4)";
                        }else if (count1 >= 8){
                            fpsWrapper.style.backgroundColor = "rgba(255,0,0,0.4)";
                        }else if (count1 <6){
                            fpsWrapper.style.backgroundColor = "rgba(0,255,0,0.4)";
                        }
                    }

                    function resetHitCount() {
                        damageTimes = [];
                        damages = [];
                        updateHPS();
                    }

                }
            },1000);

            function ping1(host, pong) {

                var started = new Date().getTime();

                var http = new XMLHttpRequest();

                http.open("POST", host, /*async*/true);
                http.onreadystatechange = function() {
                    if (http.readyState == 4) {
                        var ended = new Date().getTime();

                        var milliseconds = ended - started;

                        if (pong != null) {
                            pong(milliseconds);
                        }
                    }
                };
                try {
                    http.send(null);
                } catch(exception) {
                    // this is expected
                }

            }
            let seetm = setInterval(function(){
                var p1 =document.querySelector("#PING");
                if (!p1){
                    console.log("cleared");
                    clearInterval(seetm);
                }
                if (hosst != "" && p1){
                    ping1(hosst, function(result){
                        var p =document.querySelector("#PING");
                        if (p){
                            console.log(p);
                            if (result <=100){
                                p.style.background ="rgba(0,255,0,0.4)";
                            }else if (result >= 100 && result <=200){
                                p.style.background ="rgba(255,125,0,0.4)";

                            }else{
                                p.style.background ="rgba(255,0,0,0.4)";
                            }
                            p.children[1].textContent =result;
                        }
                        //pingNum.textContent=result;
                    });
               }else{
                   var p =document.querySelector("#PING");
                   if (p){
                       p.children[1].textContent ="-1";
                   }
               }
            },1000);
        }
   });
})();