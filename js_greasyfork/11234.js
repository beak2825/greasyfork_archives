// ==UserScript==
// @name          CH CrowdSource-OneSpace WorkStation Antifavorites
// @description   Add indicators next to the task types you don't like, the opposite of the built-in 'Favorites' stars. Also standardizes the format of half-cent tasks' listings.
// @version       1.1c
// @author        clickhappier
// @namespace     clickhappier
// @include       https://work.crowdsource.com/
// @include       https://work.crowdsource.com/jobs*
// @include       https://work.onespace.com/
// @include       https://work.onespace.com/jobs*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/11234/CH%20CrowdSource-OneSpace%20WorkStation%20Antifavorites.user.js
// @updateURL https://update.greasyfork.org/scripts/11234/CH%20CrowdSource-OneSpace%20WorkStation%20Antifavorites.meta.js
// ==/UserScript==


// adapted from CH Block Using HIT Scraper's Blocklist


// use localStorage instead of GM's storage
//if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {  // these grants aren't declared, so the answer's always no
    this.GM_getValue = function(key,def) {
        return localStorage[key] || def;
        };
    this.GM_setValue = function(key,value) {
        return localStorage[key]=value;
        };
    this.GM_deleteValue = function(key) {
        return localStorage.removeItem(key);
        };
//}


// load antifav list
console.log("CS WS Antifav script loaded");
var antifavListContents;
if ( !GM_getValue("crowdsource_antifav_list") )
{
    GM_setValue("crowdsource_antifav_list","nothing antifavorited yet");
}
if ( GM_getValue("crowdsource_antifav_list") )
{
    antifavListContents = GM_getValue("crowdsource_antifav_list").split('^');
}


// check antifav list
function antifavListCheck(r,t)
{
    var tempList = antifavListContents.map(function(item){ return item.toLowerCase().replace(/\s+/g," "); });
    var foundR = -1;
    var foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase().replace(/\s+/g," "));
    foundT = tempList.indexOf(t.toLowerCase().replace(/\s+/g," "));
    var found = foundR == -1 && foundT == -1;
    return found;  // returns false (making !(antifavListCheck(x,y)) true) if task should be antifaved, returns true if it shouldn't be antifaved
}


// antifav list editor interface
var antifavlistdiv = document.createElement('div');
var antifavlisttextarea = document.createElement('textarea');

antifavlistdiv.style.position = 'fixed';
antifavlistdiv.style.width = '510px';
antifavlistdiv.style.height = '250px';
antifavlistdiv.style.left = '50%';
antifavlistdiv.style.right = '50%';
antifavlistdiv.style.margin = '-250px 0px 0px -250px';
antifavlistdiv.style.top = '300px';
antifavlistdiv.style.padding = '5px';
antifavlistdiv.style.border = '2px';
antifavlistdiv.style.backgroundColor = 'black';
antifavlistdiv.style.color = 'white';
antifavlistdiv.style.zIndex = '100';
antifavlistdiv.setAttribute('id','antifavEditor');
antifavlistdiv.style.display = 'none';

antifavlisttextarea.style.padding = '2px';
antifavlisttextarea.style.width = '500px';
antifavlisttextarea.style.height = '180px';
antifavlisttextarea.title = 'Antifavorites List';
antifavlisttextarea.style.color = 'black';
antifavlisttextarea.setAttribute('id','antifavEditor_text');

antifavlistdiv.textContent = 'This Antifavorites list will place a frowny-face ☹ next to CrowdSource task titles you prefer to avoid. Separate titles with the ^ character. Click Save to apply changes.';
antifavlistdiv.style.fontSize = '12px';
antifavlistdiv.appendChild(antifavlisttextarea);

var save_AFbutton = document.createElement('button');
var cancel_AFbutton = document.createElement('button');

save_AFbutton.textContent = 'Save';
save_AFbutton.setAttribute('id', 'save_antifavlist');
save_AFbutton.style.height = '18px';
save_AFbutton.style.width = '100px';
save_AFbutton.style.fontSize = '10px';
save_AFbutton.style.paddingLeft = '3px';
save_AFbutton.style.paddingRight = '3px';
save_AFbutton.style.backgroundColor = 'white';
save_AFbutton.style.color = 'black'; 
save_AFbutton.style.marginLeft = '5px';

cancel_AFbutton.textContent = 'Cancel';
cancel_AFbutton.setAttribute('id', 'cancel_antifavlist');
cancel_AFbutton.style.height = '18px';
cancel_AFbutton.style.width = '100px';
cancel_AFbutton.style.fontSize = '10px';
cancel_AFbutton.style.paddingLeft = '3px';
cancel_AFbutton.style.paddingRight = '3px';
cancel_AFbutton.style.backgroundColor = 'white';
cancel_AFbutton.style.color = 'black';
cancel_AFbutton.style.marginLeft = '5px';

antifavlistdiv.appendChild(save_AFbutton);
antifavlistdiv.appendChild(cancel_AFbutton);
document.body.insertBefore(antifavlistdiv, document.body.firstChild);

// save and cancel for blocklist
function save_antifavlist() {
    var textarea = $("#antifavEditor_text");
    var text = textarea.val();
    var temp_block_list = text.split("^");
    var trimmed_list = [];
    for (var task in temp_block_list){
        if (temp_block_list[task].trim().length !== 0)
        	trimmed_list.push(temp_block_list[task].toLowerCase().trim());
    }
    GM_setValue("crowdsource_antifav_list",trimmed_list.join('^'));   
    antifavListContents = GM_getValue("crowdsource_antifav_list").split('^');
    console.log("Save antifav list complete");
    $("#antifavEditor").hide();
    // apply changes to current page
    antifavIt();
}
save_AFbutton.addEventListener("click", function(){ save_antifavlist(); }, false);
cancel_AFbutton.addEventListener("click", function(){ 
    // reset textarea contents upon cancel
    antifavListContents = GM_getValue("crowdsource_antifav_list").split('^');
    var textarea = $("#antifavEditor_text");
    var text = "";
    for (var i = 0; i < antifavListContents.length; i++){
        text += antifavListContents[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    // close editor
    $("#antifavEditor").hide(); 
}, false);


// display editor link
var antifavsEditorLink = document.createElement("span");
antifavsEditorLink.innerHTML = ' &nbsp; &nbsp; <a href="#" id="antifavEditorLink" style="font-size:75%;">Edit Antifaves</a>';
antifavsEditorLink.onclick = function()
{ 
    antifavListContents = GM_getValue("crowdsource_antifav_list").split('^');
    var textarea = $("#antifavEditor_text");
    var text = "";
    for (var i = 0; i < antifavListContents.length; i++){
        text += antifavListContents[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    $('#antifavEditor').show(); 
};
// $('h3:contains("Tasks")').not('h3:contains("Your Open Tasks")').find('span.glyphicon').after(antifavsEditorLink);
$('h1:contains("Tasks")').find('span:contains("Tasks")').after(antifavsEditorLink);



var taskTitle = "";

function antifavIt(jNode)
{

    $('a.claim').each(function()
    {
        taskTitle = $(this).text().trim();
        // if not already marked, not the Start buttons, and is on the antifaves list:
        if ( !$(this).hasClass('antifavTask') && (taskTitle != "Start") && !(antifavListCheck("noRequester",taskTitle)) )
        {
            console.log( "Antifaved: " + taskTitle );
            $(this).addClass('antifavTask');
            $(this).parent().prepend('<span class="antifavSymbol" style="font-size:125%;">☹</span> ');
        }
        // if already marked and no longer should be
        else if ( $(this).hasClass('antifavTask') && (antifavListCheck("noRequester",taskTitle)) )
        {
            console.log( "Un-antifaved: " + taskTitle );
            $(this).removeClass('antifavTask');
            $(this).parent().find('span.antifavSymbol').remove();
        }
    });

}


var taskReward = "";

function senseCents(jNode)
{

    $('span.task-info.reward strong').each(function()
    {
        taskReward = $(this).text().trim();
        if ( taskReward.indexOf("¢") > -1 )
        {
            console.log("half-cents found");                      // examples:
            taskReward = Number( taskReward.replace("¢", "") );   // 0.5c -> 0.5;  1.5c -> 1.5
            taskReward = taskReward*10;                           // 0.5 -> 5;  1.5 -> 15
            if ( taskReward < 10 )
            {
                taskReward = "0.00" + taskReward;                 // 5 -> 0.005
            }
            else
            {
                taskReward = "0.0" + taskReward;                  // 15 -> 0.015
            }
            $(this).text( "$" + taskReward );                     // $0.005;  $0.015
        }
    });

}



waitForKeyElements("a.claim", antifavIt);
waitForKeyElements("span.task-info.reward", senseCents);



//--- waitForKeyElements(): http://stackoverflow.com/a/8283815
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
)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                actionFunction (jThis);
                jThis.data ('alreadyFound', true);
            }
        } );
        btargetsFound   = true;
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
                500
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}