// ==UserScript==
// @name         Jpdb percentage bar
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Adds a progress bar during jpdb reviews
// @author       Calonca
// @match        https://jpdb.io/review
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @license GPLv2
// @namespace https://greasyfork.org/users/956173-calonca
// @downloadURL https://update.greasyfork.org/scripts/450996/Jpdb%20percentage%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/450996/Jpdb%20percentage%20bar.meta.js
// ==/UserScript==

let lightStyleSheet = `
.innerBar {
  width: 0%;
  height: 35px;
  background-color: #7baee9;
  text-align: center; /* To center it horizontally (if you want) */
  line-height: 35px; /* To center it vertically */
  color: white;
}
.outerBar {
  width: 100%;
  font-family: "Nunito Sans","Extra Sans JP","Noto Sans Symbols2","Segoe UI","Noto Sans JP","Noto Sans CJK JP","Hiragino Sans GB","Meiryo",sans-serif;
  /*width: 100vw;
  position: relative;
  left: calc(-50vw + 50%);*/
  background-color: #a2a2a2;
  text-align: center; /* To center it horizontally (if you want) */
}
/* Modal Content */
.modal-content {
  background-color: #ffffff;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
    `;

let darkStyleSheet = `
.innerBar {
  width: 0%;
  height: 35px;
  background-color: #3a76bf;/*#3266bf;*/
  text-align: center; /* To center it horizontally (if you want) */
  line-height: 35px; /* To center it vertically */
  color: white;
}
.outerBar {
  width: 100%;
  font-family: "Nunito Sans","Extra Sans JP","Noto Sans Symbols2","Segoe UI","Noto Sans JP","Noto Sans CJK JP","Hiragino Sans GB","Meiryo",sans-serif;
  /*width: 100vw;
  position: relative;
  left: calc(-50vw + 50%);*/
  background-color: #515151;/*#858585;*/
  text-align: center; /* To center it horizontally (if you want) */
}
/* Modal Content */
.modal-content {
  background-color: #181818;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
    `;

const styleSheet = `
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 35px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
`

const modalText = `
<div id="myModal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span id="close-settings" class="close">&times;</span>
    <h4 style="margin-top: 0;">Progress bar Options</h4>
    <h6 style="margin-top: 0;">Bar position</h6>
    <div style="margin-left: 1rem;">
      <div class="checkbox"><input type="radio" id="top-radio" name="pos" value="top"/>
        <label for="top-radio">Top</label></div>
      <div class="checkbox"><input type="radio" id="middle-radio" name="pos" value="middle" />
        <label for="middle-radio">Middle</label></div>
      <div class="checkbox"><input type="radio" id="bottom-radio" name="pos" value="bottom" />
        <label for="bottom-radio">Bottom</label></div>

    </div>
    <h6 style="margin-top: 0;">Reset progress bar</h6>
      <button type="button" id="reset-btn" style="margin-left: 1rem;margin-bottom: 1rem;">Reset</button>
    </br>
    <div class="modal-footer" style="
      border-top: 1px solid var(--answer-box-color);
      display: flex;
      justify-content: center;
      padding-top: 1.4rem;">
      <button type="button" id="save-btn">Save changes</button>
    </div>
  </div>
</div>`;

const doneNumKey = "revsDone";
const posKey = "position";
let style = document.createElement("style");
style.type = "text/css";
//Get theme
if (document.getElementsByClassName("dark-mode")[0]){
    style.innerHTML = styleSheet + darkStyleSheet;
}
else{
    style.innerHTML = styleSheet + lightStyleSheet;
}
(document.head || document.documentElement).appendChild(style);

const debug = false;

(function() {
    'use strict';
    if (GM_getValue(doneNumKey)==null){
        //Set values in first script usage
        GM_setValue(doneNumKey,0)
    }
    if (GM_getValue(posKey)==null){
        //Set values in first script usage
        GM_setValue(posKey,"middle")
    }

    function getPercentage(done, remaining){
        if (debug) return "50%";
        return (100*(done/(Number(done)+Number(remaining)))).toFixed(2)+"%";
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

    outerBar.onclick = onShowOptions;
    let showAnswerButton = document.getElementById("show-answer");
    if (showAnswerButton){
        waitForKeyElements (
            "#grade-3"
            , afterShowingGradeButtons
        );
    }

    //Closes the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

        //Add elements to the document
    updateBar();
    if (document.getElementsByClassName("main-row")[0]){//Doing review
        addBar();
        var modal = htmlToElement(modalText);
        document.getElementsByClassName("main-row")[0].appendChild(modal);
    }else {//Continue or finish screen
        let parent = document.getElementsByClassName("container bugfix")[0];
        let importantText = document.getElementsByTagName('h5')[0]
        if (importantText.innerHTML == "Good job! You've finished all of your due cards!"){//Finish screen
            let resetText = document.createElement("h5");
            resetText.innerHTML = "Progress bar has been reset";
            parent.insertBefore(resetText,parent.childNodes[1]);
            GM_setValue(doneNumKey,0);
        }
    }

    function updateBar(){
        let percentage = getPercentage(GM_getValue(doneNumKey),revNum);
        innerBar.style.width = percentage;
        innerBar.innerHTML = getDoneAndRemainingString(GM_getValue(doneNumKey),revNum)+"&nbsp|&nbsp"+percentage;
    }

    //Reset reviews count
    function reset(){
        modal.style.display = "none";
        GM_setValue(doneNumKey,0);
        updateBar();
    }

    //Saves the bar position and moves it
    function saveSettings (){
        let barPos = document.querySelector('input[name="pos"]:checked').value;
        modal.style.display = "none";
        if (barPos == null || barPos!=GM_getValue(posKey)){

            GM_setValue(posKey,barPos);
            outerBar.parentNode.removeChild(outerBar);
            addBar();
        }
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

    //Shows the modal
    function onShowOptions() {
        let el = document.getElementById(GM_getValue(posKey)+"-radio")
        el.checked=true;
        modal.style.display = "block";
        document.getElementById('save-btn').onclick = saveSettings;
        document.getElementById("reset-btn").onclick = reset;
        document.getElementById("close-settings").onclick = ()=>{modal.style.display = "none"};

    }

    //Increase done review count on button click
    function increaseDone() {
        GM_setValue(doneNumKey,GM_getValue(doneNumKey)+1);
    }

    //Add behaviour to grading buttons
    function afterShowingGradeButtons(){
        outerBar.onclick = null;
        document.getElementById("grade-3").addEventListener ("click", increaseDone , false);
        document.getElementById("grade-4").addEventListener ("click", increaseDone , false);
        document.getElementById("grade-5").addEventListener ("click", increaseDone , false);
    }

    function addBar(){
        let pos = GM_getValue(posKey);
        if (pos=='middle' || pos==null){
            let elementAfter = document.getElementsByClassName("main-row")[0];
            elementAfter.parentElement.insertBefore(outerBar,elementAfter);
        } else if (pos=='top'){
            let elementAfter = document.getElementsByClassName("nav minimal")[0];
            //let elementAfter = document.getElementsByClassName("container bugfix")[0];
            elementAfter.parentElement.insertBefore(outerBar,elementAfter);
        } else if (pos=='bottom'){
            let mainRow = document.getElementsByClassName("main-row")[0];
            mainRow.parentElement.appendChild(outerBar);
        }
    }

})();

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