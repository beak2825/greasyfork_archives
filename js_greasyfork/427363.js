// ==UserScript==
// @name     afreecatv bj 차단
// @match    *://afreecatv.com/*
// @match    *://www.afreecatv.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_registerMenuCommand
// @grant    GM_deleteValue
// @version 0.0.1.20210709164605
// @namespace https://greasyfork.org/users/289839
// @description afreecatv bj 차단함
// @downloadURL https://update.greasyfork.org/scripts/427363/afreecatv%20bj%20%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427363/afreecatv%20bj%20%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==



var regex = [] // [/키워드1/, /키워드2/]
var bj = [] // ['abc123', 'def345']


////////////////////////////////////////////////////////

var bj_list = GM_getValue("bj_list")
var test = GM_getValue("bj_list")

if (test == null || test == "undefined" || test == []){
    GM_setValue("bj_list", bj)}

bj_list = bj_list.concat(bj)

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


window.addEventListener ("load", function () {
    waitForKeyElements ("#broadlist_area.cBox-list", bj_hide);
    //document.getElementsByTagName("html")[0].style.visibility = "visible";
    setTimeout(function(){document.getElementById("broadlist_area").style.visibility = "visible" }, 1000);


}, false);

const bodyObserver = new MutationObserver(function(mutations, observer) {
    bj_hide()
    //console.log('afafaf')
});


bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
});


function bj_hide (jNode) {

    $("#broadlist_area.cBox-list").find('.cBox-info').each(function(){
        //var cbox = $(this).find('.cBox-info')
        var li = $(this).closest('li')
        var title = $(this).find('a.title').attr('title');
        var uid = $(this).find('a.nick').attr('user_id');
        var nick = $(this).find('a.nick').text
        if (bj_list.includes(uid) || regex.some(rx => rx.test(title)) || regex.some(rx => rx.test(nick))) {
            li.hide()
            //li.remove()
        }

        //$('.reload').hide()
    });


    var cb = document.getElementById('broadlist_area').getElementsByClassName('cBox-info')

    for(var i = 0; i < cb.length; i++){
        var node = cb[i]
        if (node.getElementsByTagName("chadan").length == 0) {

            var newHTML = document.createElement ('chadan');
            newHTML.innerHTML = "<br><button id='hide" + i + "' type='button'>" + "차단</button>"
            node.append(newHTML);
            var hide = "hide" + i
            document.getElementById (hide).addEventListener (
                "click", ButtonClickAction, false
            );
        }

    }

}


function ButtonClickAction (zEvent) {

    var button_id = zEvent.srcElement.attributes.id.value
    var c = document.getElementById (button_id).parentNode.parentNode
    var user_id = c.getElementsByTagName('a')[1].attributes[1].value
    c.parentNode.style.display = 'none'
    bj_list.push(user_id)
    bj_list = bj_list.filter(onlyUnique).filter(Boolean)
    GM_setValue("bj_list", bj_list)

}

GM_addStyle ( multilineStr ( function () {/*!
    chadan {
        color:             black;
        background:             white;
        margin:                 5px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
        .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
        .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

