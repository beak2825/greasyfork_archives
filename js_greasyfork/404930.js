// ==UserScript==
// @name         Targetprocess: Show linked issues under Description
// @namespace    postsharp.net
// @version      1.0
// @description  Adds information about linked issues on the main page of each issue in Targetprocess, so you don't need to switch to another tab.
// @author       PostSharp Technologies
// @match        http://tp.postsharp.net/*
// @match        https://tp.postsharp.net/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404930/Targetprocess%3A%20Show%20linked%20issues%20under%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/404930/Targetprocess%3A%20Show%20linked%20issues%20under%20Description.meta.js
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

    function kaktus(jnode) {
       var idn = 2;
       var theStack = jnode.closest(".main-container");
       var id = theStack.find(".entity-id");
       idn = id.text();
       console.log(idn);
       if (!idn) {
          console.log("Good");
          setTimeout(function(){ kaktus(jnode); }, 3000);
          return;
       }
       var overComment = jnode.parent(); //.closest(".tabs-container");

       var linksChild = overComment.children(".petr-links");
       if (!linksChild || linksChild.length == 0) {
          var newChild = $("<div class='petr-links'></div>");
          overComment.prepend(newChild);
          linksChild = newChild;
       }
       if (idn[0] == '#') {
         idn = idn.substring(1);
       }
      linksChild.text("");
       $.ajax("https://tp.postsharp.net/api/v1/Assignables/" + idn + "?include=[Id,Name,MasterRelations[Master[Id,Name,EntityType],RelationType],SlaveRelations[Slave[Id,Name,EntityType],RelationType]]",
              {
           "dataType" : "xml"
       })
       .done(function(data) {

           var relations = $(data).find("Relation");


           if (relations.length) {
               var createdHtml = "";


               relations.each(function(index, xRelation) {
                   var anySlave = $(xRelation).children("Slave");
                   var anyMaster = $(xRelation).children("Master");
                   var relationType = $(xRelation).children("RelationType");
                   var relationName = relationType.attr("Name");
                   var iAmMaster = false;
                   var otherId = "";
                   var otherName = "";
                   if (anySlave.length) {
                       iAmMaster = true;
                       otherId = anySlave.attr("Id");
                       otherName = anySlave.attr("Name");
                   }
                   if (anyMaster.length) {
                       iAmMaster = false;
                       otherId = anyMaster.attr("Id");
                       otherName = anyMaster.attr("Name");
                   }

                   var linkHref = "https://tp.postsharp.net/entity/" + otherId;
                   var link = "<a href='" + linkHref + "'>#" + otherId + " " + otherName + "</a>";
                   var text = "This item is related to " + link + " (as a " + relationName + "). " + (iAmMaster ? "This item should be completed first." : "This item waits for that item.");

                   if (relationName == "Relation" || relationName == "Link") {
                       text = "This item is <b>related to</b> " + link + ". <i><small>(" + (iAmMaster ? "This item should be completed first." : "The relation should be completed first.") + ")</small></i>";
                   }
                   else if (relationName == "Blocker") {
                       if (iAmMaster) {
                           text = "This item <b><font color='red'>blocks</font></b> " + link + ".";
                       }
                       else {
                           text = "This item <b><font color='red'>is blocked by</font></b> " + link + ".";
                       }
                   }
                   else if (relationName == "Duplicate") {
                       text = "This item is a <b><font color='blue'>duplicate</font></b> of " + link + ".";
                   }
                   createdHtml += text + "<br>";
               });
               createdHtml += "<br>";
               linksChild.html(createdHtml);

          }
       });
    }

    waitForKeyElements (".view-comments", kaktus);
})();