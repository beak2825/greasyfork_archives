// ==UserScript==
// @name         Audible Wishlist search MAM
// @namespace    https://greasyfork.org/en/users/171187-eivl
// @version      0.1
// @description  Add "MAM" button to Audible Wishlist
// @author       eivl
// @include      https://www.audible.com/wishlist*
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/38624/Audible%20Wishlist%20search%20MAM.user.js
// @updateURL https://update.greasyfork.org/scripts/38624/Audible%20Wishlist%20search%20MAM.meta.js
// ==/UserScript==

// TODO : Fix so script reloads when you change page or change size
// ATM i use this link : https://www.audible.com/wishlist?pageNum=1&itemsPerPage=50
// list of books

    var tb = document.getElementsByClassName("bc-table-row")[0].parentNode;

    // Skip first element, it is the header
    for (i = 1; i < tb.rows.length; i++) {

        // Cell with title
        var tdtitle = tb.rows[i].cells.item(1);
        // Cell with author
        var tdauthor = tb.rows[i].cells.item(2);
        // Book title
        var title = tdtitle.getElementsByTagName('a')[0].innerHTML;

        // Get author
        var author = tdauthor.getElementsByTagName('a')[0].text.trim();

        // Create search-link for title (from Slengpung Audible search MAM script)

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title;
        a.target = "_new";
        var text = document.createTextNode("[ Search on MAM: Title ]");
        a.appendChild(text);
        li.appendChild(a);

        // Append link to author cell
        var list = tdauthor.getElementsByClassName('bc-list')[0];
        list.appendChild(li);

        // Create search-link for title+author (from Slengpung Audible search MAM script)
        li = document.createElement("li");
        a = document.createElement("a");
        a.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title + "%20" + author;
        a.target = "_new";
        text = document.createTextNode("[ Search on MAM: Title + Author ]");
        a.appendChild(text);
        li.appendChild(a);

        // Append link to author cell
        list = tdauthor.getElementsByClassName('bc-list')[0];
        list.appendChild(li);

    }


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
        delete controlObj [controlKey];
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