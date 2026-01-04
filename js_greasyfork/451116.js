// ==UserScript==
// @name         Jpdb custom components
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Allows custom components for kanji
// @author       Calonca
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/search*
// @match        https://jpdb.io/review*
// @match        https://jpdb.io/edit_mnemonic*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @license GPLv2
// @downloadURL https://update.greasyfork.org/scripts/451116/Jpdb%20custom%20components.user.js
// @updateURL https://update.greasyfork.org/scripts/451116/Jpdb%20custom%20components.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //#Utility functions
    //
    function getCCList(){//returns custom component array from mnemonic
        let mnemonic = document.getElementsByClassName("mnemonic")[0];
        if (mnemonic == null){
            return [];
        }else {
            let componetsPharagraph =
                Array.from(mnemonic.childNodes)
            .filter(p=>p.nodeName=="P")
            .map(p=>p.innerHTML)
            .find(t=>t.includes("Composed of: "));
            if (componetsPharagraph){
                return componetsPharagraph.substring(componetsPharagraph.indexOf(':') + 2).split(",");
            }else return [];
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

    //#Dom update functions
    //
    function updateComponents(){

        const componentsList = document.getElementsByClassName("subsection-composed-of-kanji")[0].getElementsByClassName("subsection")[0].childNodes;
        const componentsLen = componentsList.length;

        let customSpellingList = getCCList();
        const customSpellingLen = customSpellingList.length;
        if (customSpellingLen>0){
            let nodesToRemove = componentsLen-customSpellingLen;
            //Removes nodes if the custom componets are less then the original ones
            for (let i=0;i<nodesToRemove;i++){
                componentsList[0].parentNode.removeChild(componentsList[customSpellingLen])
            }
            //Replaces the kanji/radical/spelling and the keyword/description
            for (let i=0;i<customSpellingLen;i++){

                if (i>=componentsLen){//Duplicates nodes if we have more custom componets then the original ones
                    componentsList[0].parentNode.appendChild(componentsList[0].cloneNode(true));
                }
                let plain = componentsList[i].querySelector(".spelling .plain")
                plain.innerHTML = customSpellingList[i];
                plain.href = "/kanji/"+customSpellingList[i]+"#a"

                //Gets the keyword for each component
                const URL = plain.href;
                fetch(URL)
                    .then(res => res.text())
                    .then(text => {
                    //Creates a new html document from requested page
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(text, "text/html");

                    let desc = doc.querySelector(".vbox.gap .subsection").innerHTML;
                    componentsList[i].querySelector(".description").innerHTML = desc;
                }).catch(err => console.log(err));

            }
        }
    }

    function addEditButton(){
        let editlink = document.querySelector("a[href*='/edit_mnemonic']");
        if (editlink==null) return;
        let div =editlink.parentNode.parentNode;
        let memEditButton = div.querySelector(".subsection-label a");
        let coSubsectionLabel = document.querySelector(".subsection-composed-of-kanji .subsection-label");
        let memEditButtonClone = memEditButton.cloneNode(true);
        memEditButtonClone.href += "&co=1";//This parameter is used to differentiate if a user is editing a mnemonic or a component. It is only present when editing components.

        coSubsectionLabel.appendChild(htmlToElement('<span style="opacity: 0.5">*</span>'));
        coSubsectionLabel.appendChild(htmlToElement('&nbsp;'));
        coSubsectionLabel.appendChild(memEditButtonClone);

    }

    function updateMemLine(){
        if (getCCList().length==0){
            let textArea = document.getElementsByTagName("textarea")[0];
            let componentsStr = "\n\nComposed of: "+Array.from(document.querySelectorAll(".spelling .plain")).map(a=>a.innerHTML).join(',');
            textArea.innerHTML += componentsStr;
        }
    }

    function updateComponentsAndAddButton (){
        updateComponents();
        addEditButton();
    }

    //#Running different functions based on the current page
    //
    if(window.location.href.indexOf("https://jpdb.io/kanji") > -1 || window.location.href.indexOf("https://jpdb.io/search") > -1 ) {//Search has been included for cases when there is only one result
        updateComponentsAndAddButton();
    } else if (window.location.href.indexOf("https://jpdb.io/review") > -1){//If reviewing wait for mnemonic to show up before adding the components
        waitForKeyElements (
            ".mnemonic"
            , updateComponentsAndAddButton
        );
    } else if (window.location.href.indexOf("https://jpdb.io/edit_mnemonic") > -1){
        const urlParams = new URLSearchParams(document.location.href);
        if (urlParams.get('co')=="1"){
            updateMemLine();
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

