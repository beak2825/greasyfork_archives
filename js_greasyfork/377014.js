// ==UserScript==
// @name         Dell Product List Export
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Easy one button to export your Dell Product List as a CSV file
// @author       Liew Xun
// @match        https://www.dell.com/support/assets-online/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377014/Dell%20Product%20List%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/377014/Dell%20Product%20List%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tbl = document.querySelector('table');
    let dataHeaders = '';
    let content = ''
    const addToContent = (d, i) => {
        if (i < 7 && i != 0) content += d.innerText + ',';
    }

    const addExportButton = () => {
        let pl = document.querySelector('#IdProductList');
        let button = document.createElement('button');
        button.className = 'btn btn-default';
        let btnText = document.createTextNode('Export');
        button.appendChild(btnText);
        button.style = 'margin-left:20px;';
        button.addEventListener('click', () => {
            dataHeaders = '';
            content = '';
            tbl.tHead.querySelectorAll('th').forEach((t, i) => {if (i < 7 && i != 0) dataHeaders += t.innerText + ','});
            for (let i = 0; i < tbl.tBodies.length; i++) {
                tbl.tBodies[i].querySelectorAll('td').forEach(addToContent);
                content += '\r\n';
            }
            let csv = dataHeaders + '\r\n' + content;
            console.log(csv);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'ProductList.csv';
            hiddenElement.click();
        });
        pl.appendChild(button);
    }

    window.onload = function(){
        //addLinkButton();
    }

     waitForKeyElements (
        '#IdProductList',
        addExportButton
        );


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
})();