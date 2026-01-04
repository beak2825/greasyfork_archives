// ==UserScript==
// @name         Jpdb stonks
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Add a reward system to jpdb that motivate you to study
// @author       Calonca
// @match        https://jpdb.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @license GPLv2
// @namespace https://greasyfork.org/users/956173-calonca
// @downloadURL https://update.greasyfork.org/scripts/457452/Jpdb%20stonks.user.js
// @updateURL https://update.greasyfork.org/scripts/457452/Jpdb%20stonks.meta.js
// ==/UserScript==



const done_num_key = "revsDone";
const done_session_num_key = "revsDoneSession";
const done_correct_session_num_key = "revsDoneCorrect";
const can_get_reward_key = "hasGotReward";
const coins_tot_key = "coins_total";
const coins_session_key = "coins_session";
const last_daily_chest_key = "last_daily_chest_date";
const last_session_accuracy_key = "last_session_accuracy";


const reward_interval = 25;
const bundle_review_cards = 25;
const review_card_reward_likelihood = 0.05;


//debug values
// const reward_interval = 2;
// const bundle_review_cards = 2;
// const review_card_reward_likelihood = 1;

const review_card_reward = 11;
const review_card_cost = 10;


let style = document.createElement("style");
style.type = "text/css";


const debug = false;

(function() {
    'use strict';

    //Set values in first script usage
    if (GM_getValue(done_num_key)==null){
        GM_setValue(done_num_key,0)
    }
    if (GM_getValue(can_get_reward_key)==null){
        GM_setValue(can_get_reward_key,false)
    }
    if (GM_getValue(coins_tot_key)==null){
        GM_setValue(coins_tot_key,0)
    }
    if (GM_getValue(coins_session_key)==null){
        GM_setValue(coins_session_key,0)
    }
    if (GM_getValue(done_session_num_key)==null){
        GM_setValue(done_session_num_key,0)
    }
    if (GM_getValue(last_session_accuracy_key)==null){
        GM_setValue(last_session_accuracy_key,0)
    }
    if (GM_getValue(done_correct_session_num_key)==null){
        GM_setValue(done_correct_session_num_key,0)
    }
    if (GM_getValue(last_daily_chest_key)==null){
        let date = new Date();
        //set last daily chest to yesterday
        date.setDate(date.getDate()-1);
        GM_setValue(last_daily_chest_key,date.toDateString())
    }

    //if page url is review page
    if (window.location.href.includes("review")){
        on_review_page();
    }



})();


function on_review_page(){
    function getPercentage(done, remaining){
        if (debug) return "50%";
        return (100*((done % reward_interval)/reward_interval)).toFixed(2)+"%"+", earned coins: "+GM_getValue(coins_session_key);

    }

    function getDoneAndRemainingString(done, remaining){
        return "&nbspdone:&nbsp"+done+"&nbsp|&nbsp"+"remaining:&nbsp"+remaining;
    }

    //Progress bar
    let outerBar = document.createElement("div");
    outerBar.className = "outerBar";

    let innerBar = document.createElement("div");
    innerBar.className = "innerBar";
    outerBar.appendChild(innerBar);

    let learnNavItem = document.querySelectorAll(".nav-item")[0]
    let span = learnNavItem.childNodes[1];
    let revNum = span.textContent;

    function onShowOptions(){
        print("showing options");
    }

    outerBar.onclick = onShowOptions;
    let showAnswerButton = document.getElementById("show-answer");
    if (showAnswerButton){
        waitForKeyElements (
            "#grade-3"
            , afterShowingGradeButtons
        );
    }

    //returns the number of coins given by the chest
    function random_chest_reward(){
        const max_reward = 50;
        const min_reward = 20;
        return Math.floor(Math.random() * (max_reward - min_reward + 1) + min_reward);
    }

    //returns the number of coins given by the chest
    function daily_chest_reward(){
        const max_reward = 200;
        const min_reward = 100;
        return Math.floor(Math.random() * (max_reward - min_reward + 1) + min_reward);    
    }
        

    //Add elements to the document
    updateBar();
    if (document.getElementsByClassName("main-row")[0]){//Doing review
        addBar();
    }else {//Continue or finish screen
        let parent = document.getElementsByClassName("container bugfix")[0];
        let importantText = document.getElementsByTagName('h5')[0]
        if (importantText.innerHTML == "Good job! You've finished all of your due cards!"){//Finish screen
            let resetText = document.createElement("h5");
            resetText.innerHTML = "Progress bar has been reset";
            parent.insertBefore(resetText,parent.childNodes[1]);
        }
    }

    if (GM_getValue(done_session_num_key) >=  reward_interval){
        let buy_screen = createBuyScreen();
        let container = document.getElementsByClassName("container bugfix")[0];
        //replace component of class container bugfix with buy screen
        container.parentElement.replaceChild(buy_screen,container);

    }else if (Math.random() < review_card_reward_likelihood && GM_getValue(can_get_reward_key)) {//add a reward if random is greater than 0.5
        let daily_chest = false; 
        //if the last daily chest was not today
        let date = new Date();
        if (GM_getValue(last_daily_chest_key) != date.toDateString()){
            if (Math.random() < 0.5)
                daily_chest = true;
        }
        //replace component of class container bugfix with reward text
        let container = document.getElementsByClassName("container bugfix")[0];
        let rewardText = document.createElement("h5");
            //Add an large emoticon of a reward chest
        let emoticon = document.createElement("p");

        if (daily_chest){
            rewardText.innerHTML = "Congratulations! You've earned a daily reward!";
            emoticon.innerHTML = "🎁 🎁 🎁";
        }else{
            rewardText.innerHTML = "Congratulations! You've earned a reward!";
            emoticon.innerHTML = "🎁";
        }
        emoticon.style.fontSize = "70px";
            
        rewardText.appendChild(emoticon);
        rewardText.id = "rewardText";
        let prev_element = container.childNodes[0];
        container.replaceChild(rewardText,prev_element);
        //write a text to open the chest
        let action_text = document.createElement("h5");
        action_text.innerHTML = "Click the chest to open it";
        container.appendChild(action_text);
        //get component after container bugfix
        let element2 = document.getElementsByClassName("with-bottom-padding-1")[0];
        element2.remove();
        //restore state before reward
        emoticon.onclick = function(){
            //update coins with randon reward
            let coins = GM_getValue(coins_tot_key);
            let coins_session = GM_getValue(coins_session_key);
            let reward = 0
            if (daily_chest){
                reward = daily_chest_reward();
            }else{
                reward = random_chest_reward();
            }
            GM_setValue(coins_tot_key,coins+reward);
            GM_setValue(coins_session_key,coins_session+reward);
            //if daily chest
            if (daily_chest){
                GM_setValue(last_daily_chest_key,date.toDateString());
            }
            //print how many coins you got
            let coinsText = document.createElement("h5");
            coinsText.innerHTML = "You got "+reward+" coins!";
            container.replaceChild(coinsText,rewardText);
            //add coins emoji
            let coinsEmoji = document.createElement("p");
            coinsEmoji.innerHTML = "💰";
            coinsEmoji.style.fontSize = "70px";
            coinsText.appendChild(coinsEmoji);
            action_text.innerHTML = "Click the coins to continue";
            
            coinsEmoji.onclick = function(){
                console.log("restoring previous state");
                let element = document.getElementsByClassName("container bugfix")[0];
                element.replaceChild(prev_element,coinsText);
                //instert element2 after container bugfix
                element.parentElement.insertBefore(element2,element.nextSibling);
                action_text.remove();
                GM_setValue(can_get_reward_key,false);
                updateBar();
            };
            
        }
    }


    function updateBar(){
        let remaining = reward_interval - GM_getValue(done_session_num_key);
        let percentage = getPercentage(GM_getValue(done_session_num_key),remaining);
        innerBar.style.width = percentage;
        innerBar.innerHTML = getDoneAndRemainingString(GM_getValue(done_session_num_key),remaining)+"&nbsp|&nbsp"+percentage;
    }

    //Reset reviews count
    function reset(){
        //GM_setValue(done_num_key,0);
        GM_setValue(done_session_num_key,0);
        GM_setValue(coins_session_key,0);
        updateBar();
    }

    /**
    * @param {String} HTML representing a single element
    * @return {Element}
    */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    //Increase done review count on button click
    function increase_done_and_coins() {
        increase_done();
        GM_setValue(coins_tot_key,GM_getValue(coins_tot_key)+review_card_reward);
        GM_setValue(coins_session_key,GM_getValue(coins_session_key)+review_card_reward);
        GM_setValue(can_get_reward_key,true);
        GM_setValue(done_correct_session_num_key,GM_getValue(done_correct_session_num_key)+1);

    }

    function increase_done(){
        console.log("increasing done");
        GM_setValue(done_num_key,GM_getValue(done_num_key)+1);
        GM_setValue(done_session_num_key,GM_getValue(done_session_num_key)+1);
    }

    //Add behaviour to grading buttons
    function afterShowingGradeButtons(){
        GM_setValue(can_get_reward_key,false);
        outerBar.onclick = null;
        document.getElementById("grade-1").addEventListener ("click", increase_done, false);
        document.getElementById("grade-2").addEventListener ("click", increase_done, false);

        document.getElementById("grade-3").addEventListener ("click", increase_done_and_coins, false);
        document.getElementById("grade-4").addEventListener ("click", increase_done_and_coins, false);
        document.getElementById("grade-5").addEventListener ("click", increase_done_and_coins, false);
        
    }

    function addBar(){
        let elementAfter = document.getElementsByClassName("main-row")[0];
        elementAfter.parentElement.insertBefore(outerBar,elementAfter);
    }
}

function reset_session(){
    GM_setValue(done_session_num_key,0);
    GM_setValue(coins_session_key,0);
    GM_setValue(done_correct_session_num_key,0);
    GM_setValue(can_get_reward_key,false);
}

function getAccuracy(){
    let done = GM_getValue(done_session_num_key);
    let correct = GM_getValue(done_correct_session_num_key);
    if (done == 0){
        return 0;
    }
    return (correct/done)*100;
}

function createBuyScreen() {
    const container = document.createElement('div');
    container.classList.add('container', 'bugfix');
  
    const heading = document.createElement('h5');
    heading.textContent = "You've finished the reviews card bundle!";
    container.appendChild(heading);

    //Add an large emoticon of a coin box with the number of coins you got
    let coins_you_got = document.createElement("h5");
    let num_coins = Number(GM_getValue(coins_tot_key));
    coins_you_got.innerHTML = "You have "+num_coins+" coins!";
    container.appendChild(coins_you_got);
    let coinsEmoji = document.createElement("p");
    coinsEmoji.innerHTML = "💰"; 
    coinsEmoji.style.fontSize = "70px";
    coins_you_got.appendChild(coinsEmoji);
    container.appendChild(coins_you_got);

    let accuracy_el = document.createElement("p");
    let accuracy_percentage = getAccuracy();
    accuracy_el.innerHTML = "Your accuracy is "+accuracy_percentage+"%, previously was "+GM_getValue(last_session_accuracy_key)+"%";
    accuracy_el.style.marginBottom = '0.5rem';
    accuracy_el.style.marginLeft = '0.5rem';
    if (accuracy_percentage < GM_getValue(last_session_accuracy_key)){
        accuracy_el.style.borderLeft = '1rem solid red';
    } else {
        accuracy_el.style.borderLeft = '1rem solid green';
    }
    accuracy_el.style.padding = '0.5rem';
    accuracy_el.style.paddingLeft = '0.7rem';
    container.appendChild(accuracy_el);

  
    const p1 = document.createElement('p');
    p1.style.marginBottom = '0.5rem';
    p1.style.marginLeft = '0.5rem';
    p1.style.borderLeft = '1rem solid green';
    p1.style.padding = '0.5rem';
    p1.style.paddingLeft = '0.7rem';
    p1.innerHTML = `You went through <span class="strong">` + GM_getValue(done_session_num_key) + `</span> reviews cards and earned <span class="strong">` + GM_getValue(coins_session_key) + `</span> coins.`;
    container.appendChild(p1);
  
    const p2 = document.createElement('p');
    p2.style.marginBottom = '0.5rem';
    p2.style.marginLeft = '0.5rem';
    p2.style.borderLeft = '1rem solid gray';
    p2.style.padding = '0.5rem';
    p2.style.paddingLeft = '0.7rem';
    p2.innerHTML = `You still have due items, buy another bundle of <span class="strong">` + bundle_review_cards + `</span> cards for <span class="strong">` + bundle_review_cards*review_card_cost + `</span> coins.`;
    container.appendChild(p2);
  
    const p4 = document.createElement('p');
    p4.style.paddingTop = '0.5rem';
    p4.textContent = "Do you want to continue?";
    container.appendChild(p4);
  
    const form1 = document.createElement('form');
    form1.method = 'post';
    form1.action = '/review';
    form1.style.display = 'inline';
  
    const input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'continue';
    input1.value = '1';
    form1.appendChild(input1);
  
    const input2 = document.createElement('input');
    input2.type
    input2.type = 'submit';
    input2.value = "Buy review bundle and continue";
    input2.onclick = function() {
        GM_setValue(coins_tot_key,Number(GM_getValue(coins_tot_key))-Number(bundle_review_cards*review_card_cost));
        //set last session accuracy
        GM_setValue(last_session_accuracy_key,getAccuracy());
        reset_session();
    };
    input2.classList.add('outline');
    input2.style.marginRight = '1rem';
    form1.appendChild(input2);
    container.appendChild(form1);

    const form2 = document.createElement('form');
    form2.method = 'post';
    form2.action = '/learn';
    form2.style.display = 'inline';

    const input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'finalize_review_session';
    input3.value = '1';
    form2.appendChild(input3);

    const input4 = document.createElement('input');
    input4.type = 'submit';
    input4.value = "No, I'm done for now.";
    input4.classList.add('outline', 'v1');
    input4.autofocus = true;
    form2.appendChild(input4);
    container.appendChild(form2);

    return container;
}


//The following function is used by the script.
//I Put it here instead of requires due to GreasyFolk rules, the original can be found at https://gist.github.com/BrockA/2625891
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
