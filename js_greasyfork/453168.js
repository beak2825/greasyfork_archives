// ==UserScript==
// @name         魔戒Lcg汉化插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ringsdb和dragncards的汉化插件
// @author       saltbox1211
// @match        https://ringsdb.com/**
// @match        https://www.dragncards.com/room/**
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant    GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ringsdb.com
// @run-at document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/453168/%E9%AD%94%E6%88%92Lcg%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453168/%E9%AD%94%E6%88%92Lcg%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// 等价于以下写法


(async function() {
    'use strict';
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
    async function getJSON(url,tag) {
        try {
            let response = await fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {

                window[tag] = myJson

            });
        } catch (error) {

        }
    }
    function getDeckNameList(){
        var cards = document.querySelectorAll("a.card")
        var to_replace = {}
        for(var i = 0;i < cards.length;i++)
        {
            var card = cards[i]
            var card_name = card.innerText.split('(')[0].trim() + '_' + i
            to_replace[card_name] = card
        }
        return to_replace
    }
    function translate(to_trans){
        for(const en_name_index in to_trans)
        {
            var en_name = en_name_index.split("_")[0]
            var name_table = window["name_mapping_data"]
            var chi_name = name_table[en_name]
            if(chi_name == undefined)
            {
                chi_name = name_table[en_name.toLowerCase()]
            }
            var card_obj = to_trans[en_name_index]
            if(chi_name != undefined)
            {
                card_obj.innerText = card_obj.innerText.replace(en_name,chi_name)
            }
        }
    }


    function replaceImage(node){
        var cur_url = document.documentURI
        var ringdb_head = cur_url.substring(0,20)
        if(ringdb_head != 'https://ringsdb.com/')
        {
            return
        }
        var request_header = 'https://raw.githubusercontent.com/slatbox/DragnCards-CardImages/chinese_sim/'
        var card_content = node[0].parentElement.parentElement.parentElement.parentElement
        //console.log(card_content)
        var card_type = card_content.getElementsByClassName("card-type")[0].textContent.split(".")[0].trim()
        var card_sphere = card_content.getElementsByClassName("col-xs-6 modal-info card-content")[0].children[1].textContent.split('.')[1].trim()
        var card_name = document.getElementsByClassName("modal-title card-name")[0].textContent.trim()
        //console.log(card_type)
        //console.log(card_sphere)
        //console.log(card_name)

        var card_chi_name = window["name_mapping_data"][card_name]
        if(card_chi_name != undefined)
        {
            document.getElementsByClassName("modal-title card-name")[0].textContent = card_chi_name
        }
        var id_table = window["id_mapping_data"]
        var card_id = id_table[card_name + '_' + card_type + '_' + card_sphere]
        //console.log(card_id)
        if(card_id != undefined)
        {
            node[0].src = request_header + card_id + '.jpg'
        }

    }
    function replaceText (jNode) {
        var cur_url = document.documentURI
        var ringdb_head = cur_url.substring(0,20)
        if(ringdb_head != 'https://ringsdb.com/')
        {
            return
        }
        var name_dict = getDeckNameList()
        translate(name_dict)
    }
    function replacePlayImg (jNode) {
        var dragn_header = document.documentURI.substr(0,27)
        if(dragn_header != 'https://www.dragncards.com/')
        {
            return
        }
        for(var i = 0;i < jNode.length;i++)
        {
            var src = jNode[i].src // "/images/cards/English/51223bd0-ffd1-11df-a976-0801200c9007.jpg"
            var id = src.split('English/')[1]
            //console.log(id)
            //var id = pieces[pieces.length - 1]
            var request_header = 'https://raw.githubusercontent.com/slatbox/DragnCards-CardImages/chinese_sim/'
            var new_src = request_header + id
            jNode[i].src = new_src
        }


    }
    async function main(){
        // rings db
        var name_mapping_data_url = 'https://raw.githubusercontent.com/slatbox/DragnCards-CardImages/chinese_sim/name_mapping_data.json'
        var name_id_mapping_data_url = 'https://raw.githubusercontent.com/slatbox/DragnCards-CardImages/chinese_sim/id_mapping_data.json'
        await getJSON(name_mapping_data_url,"name_mapping_data")
        await getJSON(name_id_mapping_data_url,"id_mapping_data")
        waitForKeyElements("a.card",replaceText);
        waitForKeyElements("img.img-responsive",replaceImage);
        waitForKeyElements("img.absolute",replacePlayImg);
    }
    main()

}


)();