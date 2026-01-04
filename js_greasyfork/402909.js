// ==UserScript==
// @name        PA UC Autochatter
// @namespace   Violentmonkey Scripts
// @match       https://www.uc.pa.gov/Chat/index.aspx
// @grant       none
// @version     4.0
// @author      Barkin MAD
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @description ~ Updated February 2021 ~
// @downloadURL https://update.greasyfork.org/scripts/402909/PA%20UC%20Autochatter.user.js
// @updateURL https://update.greasyfork.org/scripts/402909/PA%20UC%20Autochatter.meta.js
// ==/UserScript==

// In the below 4 fields enter your relevant information inbetween the quotes to be sent into chat. Do NOT delete anything that is not inbetween the quotes or it will break. Example: FIRSTNAME = "Dimitri";
const FIRSTNAME = 'FIRST NAME HERE';
const LASTNAME = 'LAST NAME HERE';
const EMAIL = 'EMAIL HERE';
const PHONE = 'PHONE NUM HERE';
const SUBJECT = 1; // This changes the subject, you can leave it as 1 as it doesnt really change anything.

// Warning! Do not edit anything below this message unless you know what you're doing. Things can break.
//.........................................................................................
//.WWW...WWWWW...WWW...AAAA......RRRRRRRRR....NNNN....NNN..III..NNNN....NNN.....GGGGGG.....
//.WWW...WWWWW...WWW...AAAAA.....RRRRRRRRRRR..NNNN....NNN..III..NNNN....NNN...GGGGGGGGGG...
//.WWWW..WWWWW..WWWW...AAAAA.....RRRRRRRRRRR..NNNNN...NNN..III..NNNNN...NNN...GGGGGGGGGGG..
//.WWWW..WWWWW..WWWW..AAAAAA.....RRR.....RRR..NNNNN...NNN..III..NNNNN...NNN..GGGG....GGGG..
//..WWW.WWWWWWW.WWW...AAAAAAA....RRR.....RRR..NNNNNN..NNN..III..NNNNNN..NNN..GGG......GG...
//..WWW.WWW.WWW.WWW..AAAA.AAA....RRRRRRRRRRR..NNNNNNN.NNN..III..NNNNNNN.NNN.NGGG...........
//..WWWWWWW.WWW.WWW..AAA..AAAA...RRRRRRRRRR...NNN.NNN.NNN..III..NNN.NNN.NNN.NGGG...GGGGGG..
//..WWWWWWW.WWWWWWW..AAAAAAAAA...RRRRRRRR.....NNN.NNNNNNN..III..NNN.NNNNNNN.NGGG...GGGGGG..
//...WWWWWW..WWWWW..AAAAAAAAAA...RRR..RRRR....NNN..NNNNNN..III..NNN..NNNNNN..GGG...GGGGGG..
//...WWWWW...WWWWW..AAAAAAAAAAA..RRR...RRRR...NNN..NNNNNN..III..NNN..NNNNNN..GGGG.....GGG..
//...WWWWW...WWWWW..AAA.....AAA..RRR....RRRR..NNN...NNNNN..III..NNN...NNNNN...GGGGGGGGGGG..
//...WWWWW...WWWWW.WAAA.....AAAA.RRR....RRRR..NNN....NNNN..III..NNN....NNNN...GGGGGGGGGG...
//...WWWW.....WWWW.WAA......AAAA.RRR.....RRRR.NNN....NNNN..III..NNN....NNNN.....GGGGGG.....
//.........................................................................................
// Warning! Do not edit anything below this message unless you know what you're doing. Things can break.

// JQuery selectors
const SELECTOR_BUTTON_OPEN_CHAT = '.cx-webchat-chat-button';
const SELECTOR_CHAT_WINDOW = '.cx-webchat';
const SELECTOR_MESSAGE = '.cx-message-text';
const SELECTOR_BUTTON_SEND_MSG = 'div.cx-send.cx-icon.i18n';

const INTERVAL_ELEMENT_PRESENT = 100;
const INTERVAL_MSG_LISTENER = 1000;
const INTERVAL_RESET = 2500;

const CHAT_END_PROMPTS = [
  "All of our chat agents are busy assisting other customers. We are unable to process your chat request at this time. Please try again later.",
  "Our office is closed. Please try again during our normal hours of operation.",
  "Due to an unexpected high wait time we are unable to process your chat request at this time. If you would like a response within four business days please email uccclaims@pa.gov. We apologize for any inconvenience and look forward to assisting you."
];

const PAULA_RESPONSES = {
    "Are you an employer? If you are contacting us about PUA or have a PUA claim, please answer NO.": 'No.',
    "Okay. You can ask me questions like, How do I file an unemployment claim?, or How do I know if I am eligible for unemployment?, So how can I help you today.": 'What is my payment status?',
    "Is there anything else I can help you with? Type YES or NO. If you have another question type YES and you will be prompted to ask it.": "Can I speak to an agent?",
    "Please feel free to ask your question now.": "Can I speak to an agent?",
    "What else can I help you with?": "Can I speak to an agent?"
};

// Waits for an element to exist if present is true, or to not exist if present is false. Process is called each interval while waiting. Callback is called when finished.
function onElementPresent(callback, element, waitingInterval, present = true, process = null){
    var elementReady = setInterval(function(){
        if(process != null){process()}
        if($(element).length == present){
            clearInterval(elementReady);
            callback();
        }
    }, waitingInterval);
}

function submitChatDetails() {
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    document.getElementById('cx_webchat_form_firstname').value = FIRSTNAME;
    document.getElementById('cx_webchat_form_firstname').dispatchEvent(event);
    document.getElementById('cx_webchat_form_lastname').value = LASTNAME;
    document.getElementById('cx_webchat_form_lastname').dispatchEvent(event);
    document.getElementById('cx_webchat_form_email').value = EMAIL;
    document.getElementById('cx_webchat_form_email').dispatchEvent(event);
    document.getElementById('cx_webchat_form_phone').value = PHONE;
    document.getElementById('cx_webchat_form_phone').dispatchEvent(event);
    document.getElementById('cx_webchat_form_subject').selectedIndex = SUBJECT;

    $(".cx-submit.cx-btn.cx-btn-primary.i18n").trigger("click");
    listenPAULA();
}

function listenPAULA(){
    console.log("Talking to Paula...");
    var lastMsgRespondedTo = '';
    var msgListenerInterval = setInterval(function(){
        var messages = $(SELECTOR_MESSAGE);
        if(messages.length > 0){
            var mostRecentMsg = messages.slice(-1)[0].textContent;
            var response = PAULA_RESPONSES[mostRecentMsg];
            
            if(response != undefined && lastMsgRespondedTo != mostRecentMsg){
                lastMsgRespondedTo = mostRecentMsg;
                console.log(mostRecentMsg + " => " + response);
                $('#cx_input')[0].value = response;
                $(SELECTOR_BUTTON_SEND_MSG).trigger('click');
            } else {
                for(i = 0; i < messages.length; i++){
                    var message = messages[i].textContent;
                    if(CHAT_END_PROMPTS.includes(message)){
                        console.log("End prompt detected: " + message);
                        clearInterval(msgListenerInterval);
                        location.reload();
                    }
                }
            }
        }
    }, INTERVAL_MSG_LISTENER);
}

function closeChat(){
    $('.cx-end-confirm').trigger('click');
    $('.cx-button-close').trigger('click');
}

function begin(){
    console.log("Autochatter started!");
    console.log("Closing previous chat session...");
    onElementPresent(function(){
        onElementPresent(function(){
            console.log("Opening new chat window...")
            $(SELECTOR_BUTTON_OPEN_CHAT).trigger('click');
            onElementPresent(submitChatDetails, SELECTOR_CHAT_WINDOW, INTERVAL_ELEMENT_PRESENT);
        }, SELECTOR_BUTTON_OPEN_CHAT, INTERVAL_ELEMENT_PRESENT);
    }, SELECTOR_CHAT_WINDOW, INTERVAL_ELEMENT_PRESENT, false, closeChat);
}

setTimeout(begin, INTERVAL_RESET);