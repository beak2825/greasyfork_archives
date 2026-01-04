// ==UserScript==
// @name         janitorai reroll
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Simply reroll result automatically since all free service are completed shit
// @author       James
// @icon         https://ella.janitorai.com/hotlink-ok/logo.png
// @license      MIT
// @match        https://janitorai.com/chats/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/547541/janitorai%20reroll.user.js
// @updateURL https://update.greasyfork.org/scripts/547541/janitorai%20reroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inProgress = false;
    var lastMessageText;
    var receivedResponse = false;
    var stop = false;

    var intervalTime = 10;

    var randomInterval = true;
    var responseLength = 200;
    var numberRetry = 50;
    var numberCurrentReroll = 0;

    var style = document.createElement('style');
    style.innerHTML = 'body {font-family: Arial, Helvetica, sans-serif;}.my-modal-reroll {display: none; /* Hidden by default */position: fixed; /* Stay in place */z-index: 20; /* Sit on top */padding-top: 100px; /* Location of the box */left: 0;top: 0;width: 100%; /* Full width */height: 100%; /* Full height */overflow: auto; /* Enable scroll if needed */background-color: rgb(0,0,0); /* Fallback color */background-color: rgba(0,0,0,0.4); /* Black w/ opacity */font-size: 18px;}.my-modal-content-reroll {background-color: black;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;color: #42b01a}.my-close-reroll {color: #aaaaaa;float: right;font-size: 28px;font-weight: bold;}.my-close-reroll:hover,.my-close-reroll:focus {color: red;text-decoration: none;cursor: pointer;}';
    document.head.appendChild(style);

    var elemDiv = document.createElement('div');
    document.body.appendChild(elemDiv);
    elemDiv.innerHTML = '<div id="myModalReroll" class="my-modal-reroll"><div class="my-modal-content-reroll"><span id="my-close-reroll" class="my-close-reroll">&times;</span>Lenght of time (In seconds): <input type="number" id="my-interval-time" value="10"><br>Random interval add (Add 1-5 second to every attempt): <input id="my-random-interval-time" type="checkbox" checked=true><br>Length response minimum (Number of characters): <input type="number" id="my-length-response" value="200"><br>Number of maximum reroll allows: <input type="number" id="my-number-reroll" value="50"><br><div>In progress: </div><div id="in-progress">❌</div> <div id="my-number-of-reroll"></div><br><input type="button" id="my-reroll-button" value="Start Reroll">  <input type="button" id="my-reroll-button-stop" value="Stop"></div></div>';

    var modal = document.getElementById("myModalReroll");
    var span = document.getElementById("my-close-reroll");
    var divRerollNumber = document.getElementById("my-number-of-reroll");

    span.onclick = function() {
        modal.style.display = "none";//The x button to close
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";//When the user clicks anywhere outside of the modal, close it
        }
    }

    document.onkeydown = function(){
        if(window.event && window.event.keyCode == 112)//F1 keyboard listen
        {
            openModal();//Hidden button to active pop-up
        }
    }

    function openModal(){
        modal.style.display = "block";
    }

    var myRerollButton = document.getElementById("my-reroll-button");
    myRerollButton.onclick = function() { startRerolling();};

    var myRerollButtonStop = document.getElementById("my-reroll-button-stop");
    myRerollButtonStop.onclick = function() { stopOperation();};

    var listOfMessage;
    var newestMessage;
    var timeoutId;
    var intervalID;
    var MessageTextCss;

    (async () => {
        let intervalTimeSaved = await GM.getValue('intervalTime', false);
        let randomIntervalSaved = await GM.getValue('randomInterval', -5);
        let responseLengthSaved = await GM.getValue('responseLength', false);
        let numberRetrySaved = await GM.getValue('numberRetry', false);
        if(intervalTimeSaved != false){
            intervalTime = intervalTimeSaved;
            document.getElementById("my-interval-time").value = intervalTime;
        }
        if(randomIntervalSaved != -5){
            randomInterval = randomIntervalSaved;
            document.getElementById("my-random-interval-time").checked = randomInterval;
        }
        if(responseLengthSaved != false){
            responseLength = responseLengthSaved;
            document.getElementById("my-length-response").value = responseLength;
        }
        if(numberRetrySaved != false){
            numberRetry = numberRetrySaved;
            document.getElementById("my-number-reroll").value = numberRetry;
        }
    })();

    function startRerolling(){
        myRerollButton.disabled = true;
        numberCurrentReroll = 0;
        document.getElementById("in-progress").innerText = "✅";
        divRerollNumber.textContent = "";
        listOfMessage = document.querySelectorAll('[data-index]');
        MessageTextCss = listOfMessage[listOfMessage.length - 2].children[0].children[1].children[1].children[1].className;
        lastMessageText = listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss)[listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss).length - 1].outerText;

        intervalTime = parseInt(document.getElementById("my-interval-time").value);
        randomInterval = document.getElementById("my-random-interval-time").checked;
        responseLength = parseInt(document.getElementById("my-length-response").value);
        numberRetry = parseInt(document.getElementById("my-number-reroll").value);

        if(Number.isInteger(intervalTime) && Number.isInteger(responseLength) && Number.isInteger(numberRetry)){
            GM.setValue("intervalTime", intervalTime);
            GM.setValue("randomInterval", randomInterval);
            GM.setValue("responseLength", responseLength);
            GM.setValue("numberRetry", numberRetry);
        }
        if(randomInterval){
            intervalTime = intervalTime + Math.floor(Math.random() * 5);
        }

        if(Number.isInteger(intervalTime) && Number.isInteger(responseLength) && Number.isInteger(numberRetry)){
            let retries = numberRetry;//open router daily or gemini, you could change it to higher if you got premium in either

            intervalID = setInterval(_ => {
                if(document.getElementsByClassName('_stopButton_17cr1_1').length == 0){//Stop button doesn't exist, which mean we are not waiting for a response anymore
                    if(checkFinishEarly()){
                        stopOperation();
                        return;
                    }
                    if(!inProgress){
                        inProgress = true;

                        let randomNumber = Math.floor(Math.random() * 5);
                        if(!randomInterval) randomNumber = 0;

                        timeoutId = setTimeout(_ => {

                            try {
                                listOfMessage = document.querySelectorAll('div[data-index]');//If message error type interfere, may need more precise code here
                                newestMessage = listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss)[listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss).length - 1];//We need to check if response is minimum length wanted
                                if(listOfMessage[listOfMessage.length - 1].getElementsByClassName('_autoResizeTextarea_48ugw_1').length != 0){//An edit button has been activated, user interruption, should mean it okay to stop
                                    stopOperation();
                                    return;
                                }
                                if(lastMessageText != newestMessage.outerText && newestMessage.outerText.length >= responseLength){//response different and of comfort minimum lenght, This mean all reroll gave a succesful response otherwise we keep going
                                    stopOperation();
                                    return;
                                }else{
                                    if(document.getElementsByClassName('_botChoiceButton_sisz1_26 _right_sisz1_44').length != 0){//Reroll button from response
                                        document.getElementsByClassName('_botChoiceButton_sisz1_26 _right_sisz1_44')[0].click();
                                    }
                                    if(document.querySelectorAll('[aria-label="Re-generate last answer"]').length != 0){//Reroll button from message
                                        document.querySelectorAll('[aria-label="Re-generate last answer"]')[0].click();
                                    }
                                }
                            } catch(error){
                                console.log("error:");
                                console.log(error);
                                stopOperation();
                                /*
                                //Keeping this here, if I rather still doing rerolling if there unknow error
                                if(document.getElementsByClassName('_botChoiceButton_nr7g7_21 _right_nr7g7_39').length != 0){//Reroll button from response
                                    //document.getElementsByClassName('_botChoiceButton_nr7g7_21 _right_nr7g7_39')[0].click();
                                }
                                if(document.querySelectorAll('[aria-label="Re-generate last answer"]').length != 0){//Reroll button from message
                                    //document.querySelectorAll('[aria-label="Re-generate last answer"]')[0].click();
                                }
                                */
                            }

                            retries--;

                            divRerollNumber.textContent = "Reroll commited: " + (numberRetry - retries);

                            inProgress = false;

                        }, (intervalTime + randomNumber) * 1000);//Transform second to millisecond

                    }

                }

                if(retries <= 0){
                    stopOperation();

                }
            }, 2000);//Every 2 second check current status

        }

    }

    function checkFinishEarly(){
        try {
            let listOfMessage = document.querySelectorAll('div[data-index]');//If message error type interfere, may need more precise code here
            let newestMessage = listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss)[listOfMessage[listOfMessage.length - 1].getElementsByClassName(MessageTextCss).length - 1];//We need to check if response is minimum length wanted
            if(listOfMessage[listOfMessage.length - 1].getElementsByClassName('_autoResizeTextarea_48ugw_1').length != 0){//An edit button has been activated, user interruption, should mean it okay to stop
                return true;
            }
            if(lastMessageText != newestMessage.outerText && newestMessage.outerText.length >= responseLength){//response different and of comfort minimum lenght, This mean all reroll gave a succesful response otherwise we keep going
                return true;
            }
        } catch(error){
            console.log("error Early:");
            console.log(error);
        }
    }

    function stopOperation(){
        document.getElementById("in-progress").innerText = "❌";
        inProgress = false;
        myRerollButton.disabled = false;
        clearTimeout(timeoutId);
        clearInterval(intervalID);
    }

    elemDiv = document.createElement('div');
    elemDiv.innerHTML = '<div class="_tooltipContainer_1v19f_40"><button id="button-for-reroll-modal" type="button" class="_controlPanelButton_1v19f_8" style="color: rgb(255, 255, 255);" aria-label="reroll this message"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.771 511.771" xml:space="preserve"><g transform="translate(1 1)"><g><g><path d="M506.771,100.257c0-4.289-2.415-7.773-5.734-8.942c-1.412-0.804-2.783-1.318-3.998-1.435L253.514-0.314c-1.829-0.914-4.571-0.914-6.4,0L11.09,81.386c-1.733,0.019-3.385,0.451-4.433,1.499c-0.566,0.566-1.126,1.228-1.638,1.943C3.765,86.354,3,88.275,3,90.2v310.857c0,3.657,1.829,7.314,5.486,8.229L246.2,509.857c0.914,0.914,2.743,0.914,3.657,0.914c0.627,0,1.253-0.007,1.88-0.302c0.849-0.261,1.616-0.665,2.198-1.107l245.522-90.934c3.657-0.914,6.4-4.571,6.4-8.229V104.338C506.437,103.194,506.771,101.838,506.771,100.257z M249.857,17.971l219.429,80.457l-219.429,73.143L38.657,90.2L249.857,17.971zM21.286,103.914l219.429,84.114v299.886L21.286,394.657V103.914z M259,487.914V188.943l228.571-76.19v290.133L259,487.914z"/><path d="M450.086,154.2c-10.057,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C467.457,164.257,459.229,154.2,450.086,154.2z"/><path d="M378.771,263.914c-10.057,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C396.143,273.971,388.829,263.914,378.771,263.914z"/><path d="M312.943,384.6c-10.057,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C330.314,394.657,322.086,384.6,312.943,384.6z"/><path d="M189.514,199.914c-10.057,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C206.886,209.971,199.571,200.829,189.514,199.914z"/><path d="M57.857,145.971c-9.143,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C75.229,155.114,67.914,145.971,57.857,145.971z"/><path d="M186.771,391.914c-10.057,0-17.371,10.057-17.371,21.943s8.229,21.943,17.371,21.943c10.057,0,17.371-10.057,17.371-21.943C204.143,401.971,196.829,391.914,186.771,391.914z"/><path d="M57.857,338.886c-10.057,0-17.371,10.057-17.371,21.943c0,11.886,8.229,21.943,17.371,21.943c9.143,0,16.457-10.057,16.457-21.943C74.314,348.943,67,338.886,57.857,338.886z"/><path d="M271.8,93.857c0-10.057-10.057-17.371-21.943-17.371c-11.886,0-21.943,7.314-21.943,17.371c0,10.057,10.057,17.371,21.943,17.371C261.743,111.229,271.8,103,271.8,93.857z"/></g></g></g></svg></button></div>';
    setTimeout(() => {
        document.body.getElementsByClassName('_menuWrapper_hs488_2')[0].prepend(elemDiv);
    }, "3000");
    setTimeout(() => {
        document.getElementById("button-for-reroll-modal").onclick = openModal;
    }, "4000");


})();