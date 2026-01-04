// ==UserScript==
// @name         药师帮价格排序
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  对药师帮搜索结果按价格排序
// @author       yl
// @match        http://dian.ysbang.cn/*
// @match        https://dian.ysbang.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/467555/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/467555/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

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

(function() {
    'use strict';
    function main() {
        console.log("main");
//         console.log(document.querySelector("div.searchKey").innerHTML);
        function sorter(isAsc) {
            console.log("sorter " + isAsc);
            let cart_item_list = document.querySelector('div.drug-list');
            let old_items = Array.from(cart_item_list.children);

            let indicies = new Array(old_items.length);
            for (let i = 0; i < indicies.length; ++i) {
                indicies[i] = i;
//                 console.log(old_items[i]);
//                 console.log(old_items[i].querySelector('div.price-wrap').textContent.split("¥")[1]);
            }
//             console.log(old_items[0].querySelector('div.price-wrap').textContent);
            indicies.sort((a, b) => {
                // console.log('---------------');
                // console.log(old_items[a]);
                // console.log(old_items[b]);
                let anode = old_items[a].querySelector('div.goods-price-all');
                let bnode = old_items[b].querySelector('div.goods-price-all');

                if (!anode) {
                    return 1;
                }
                if (!bnode) {
                    return -1;
                }
                // console.log(old_items[a]);
                // console.log(old_items[b]);

                let aval = 0;
                let bval = 0;
                var regEx = /[^\d|^\.]/g;
                if (anode.textContent.split("¥").length == 2){
                    aval = parseFloat(anode.textContent.split("¥")[1]);
                } else{
                    aval = parseFloat(anode.textContent.split("¥")[0].split("￥")[1].replace(regEx, ''));
                    // console.log(anode.textContent.split("¥")[0].split("￥")[1]);
                    // console.log(anode.textContent.split("¥")[0].split("￥")[1].replace(regEx, ''));
                }
                if (bnode.textContent.split("¥").length == 2){
                    bval = parseFloat(bnode.textContent.split("¥")[1]);
                } else{
                    bval = parseFloat(bnode.textContent.split("¥")[0].split("￥")[1].replace(regEx, ''));
                    // console.log(bnode.textContent.split("¥")[0].split("￥")[1]);
                    // console.log(bnode.textContent.split("¥")[0].split("￥")[1].replace(regEx, ''));
                }
                // console.log(anode.textContent.split("¥").length);
                // console.log(bnode.textContent.split("¥").length);
                // console.log(anode.textContent.split("¥"));
                // console.log(bnode.textContent.split("¥"));
                // console.log("aval：" + aval);
                // console.log("bval：" + bval);

                if (aval - bval == 0) {
                    return a - b;
                }

                if (isAsc) {
                    return aval - bval;
                }
                else {
                    return bval - aval;
                }
            });

            for (let i = 0; i < old_items.length; ++i) {
                cart_item_list.appendChild(old_items[indicies[i]]);
            }

        }

        if(document.querySelector("button.SortCartAsc")!=null){ return; }
        let sort_btn = document.createElement('div');
        sort_btn.className = 'SortCart';
        sort_btn.innerHTML = `<button class="SortCartAsc">升序</button><button class="SortCartDesc">降序</button>`;

//         document.querySelector("div.condition").appendChild(sort_btn);
        document.querySelector("div.condition").insertBefore(sort_btn, document.querySelector("div.condition").lastChild);
        document.querySelector("input.searchKey").style.borderColor  = "red";

        document.querySelector('.SortCartAsc').addEventListener('click', () => {sorter(true);});
        document.querySelector('.SortCartDesc').addEventListener('click', () => {sorter(false);});
        
        document.querySelector("div.drugListPage").setAttribute("style", "margin:0 auto;");
    }

    waitForKeyElements("input.searchKey", main);
})();
