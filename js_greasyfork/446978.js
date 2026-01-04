// ==UserScript==
// @name         RallyDateStamp
// @namespace    http://tampermonkey.net/
// @version      3.0
// @license      GNU GPLv3
// @description  Adds a date stamp button to rich-text toolbar, right click buttons for options.
// @author       John Gallant
// @match        https://*.rallydev.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require http://code.jquery.com/jquery-latest.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// Ported to new Rally version.  What a pain in the butt that was.  Had to learn CKEditor :(
//  Removed auto_at keybind becaus Rally's is better now and the auto_stamping, because that was stupid.

// @downloadURL https://update.greasyfork.org/scripts/446978/RallyDateStamp.user.js
// @updateURL https://update.greasyfork.org/scripts/446978/RallyDateStamp.meta.js
// ==/UserScript==

//Options and default values for each.
var userName = envConfig.globalContext.user.DisplayName;
//var userName = "tester";
var myColor = GM_getValue("myColor") || "#808080";
var bold=GM_getValue("bold") || false;
var italic=GM_getValue("italic");
var underline=GM_getValue("underline")|| false;
//ar style=GM_getValue("style");
var fixLinks = GM_getValue("fixLinks")|| false;;



//set these defaults if they're null, can't use the default shortcut above because it sets the default when the value is saved as false.  That shortcut only works for a default of false.
if (italic == null){italic = true;}


//Wait for rich text toolbar to appear.
waitForKeyElements ("div.ck-editor", addButtons);

//If the fix link menu option is enabled, wait for the link menu to appear.
if (fixLinks) {waitForKeyElements ("div.chr-CopyFieldGroup-inputControlsInput", linkFixer);}


//This is the function that fixes the links in the popup to be more useful.
function linkFixer(){
    var link = document.getElementsByClassName("chr-CopyFieldGroup-inputControlsInput")[1].getElementsByTagName("input")[0];
    if (!link) {return;}
    var linktext = link.value;

    //Link text is split into three pieces, anything inside of brackets is the number, then anything inside parethasis URL, the rest through the end of the string is the descriptionm.
    //Making it:
    //linkItems[0] - The original text
    //linkItems[1] - Bug number
    //linkItems[2] - URL
    //linkItems[3] - Description
    var linkItems = linktext.match(/(\[.*\])(\(.*\)): (.*$)/);
    var linkItems2 = linktext.match(/\[(.*)\]\((.*)\): (.*$)/);

    var label

    //Test that we found a link, that it has the correct parts in the text and that we hadn't already fixed it.
    if (link && linkItems && linkItems.length == 4 && !link.classList.contains("linkFixed")){
        label = document.getElementsByClassName("chr-CopyFieldGroup")[1].getElementsByTagName("span")[0];
        label.textContent = "[Number] Name (URL)";

        //Change the text to be [Number] Description (URL)
        link.value = linkItems[1] + " " + linkItems[3] + " " + linkItems[2];
        link.classList.add("linkFixed");
    }

    link = document.getElementsByClassName("chr-CopyFieldGroup-inputControlsInput")[2].getElementsByTagName("input")[0];

    //Same test as before, but since link changed have to test again for the new link.
    if (link && linkItems && linkItems.length == 4 && !link.classList.contains("linkFixed")){
        label = document.getElementsByClassName("chr-CopyFieldGroup")[2].getElementsByTagName("span")[0];
        label.textContent = "RobotFramework Markdown";
        if (linkItems&&linkItems.length == 4 && !link.classList.contains("linkFixed")){
            //Recycle HTML to be be [Number] Description
            link.value = "["+ linkItems2[2] + "|" + linkItems2[1] + "] " + linkItems2[3];
            link.classList.add("linkFixed");
        }
    }

    link = document.getElementsByClassName("chr-CopyFieldGroup-inputControlsInput")[3].getElementsByTagName("input")[0];

    //Same test as before, but since link changed have to test again for the new link.
    if (link && linkItems && linkItems.length == 4 && !link.classList.contains("linkFixed")){
        label = document.getElementsByClassName("chr-CopyFieldGroup")[3].getElementsByTagName("span")[0];
        label.textContent = "Number and Name in plain text";
        if (linkItems&&linkItems.length == 4 && !link.classList.contains("linkFixed")){
            //Recycle HTML to be be [Number] Description
            link.value = linkItems[1] + " " + linkItems[3];
            link.classList.add("linkFixed");
        }
    }

}


//This is called every time na ew text field Ajaxes in, so it tries to determine which field it needs to add a button to next.
function addButtons(element){



    var textEditors = document.getElementsByClassName("ck-editor");
    var te, i = 0;
    var btn;
    for (te of textEditors){

        //only support 5 text boxes (zero based)
        if (i > 4) {break;}

        //Add the  buttons
        if (document.getElementById("DateStampBtn" + i) == null)
        {

            var btnContainer = document.createElement("span");
            var btn_span = document.createElement("span");
            var frameIndex = i;

            btn = document.createElement("span");
            btn.title = "Date Stamp (Ctrl+D) - Insert a name and date stamp before the current line. Right click for options. ";
            btn.id = "DateStampBtn" + i;
            btn.setAttribute("href", "javascript:void('Insert Name/Date Stamp')");
            btn.setAttribute("class", "ck ck-button");
            btn.setAttribute("role", "button");
            var toolbox = document.getElementsByClassName("ck-toolbar__items")[i];
            var btn_span = document.createElement("span");
            btn_span.setAttribute("class", "ck ck-button");
            btnContainer.setAttribute("class", "cke_button_icon cke_button_off");
            btn.style.border = "none";

            btn.setAttribute("style", " background-repeat: no-repeat; background-position: center;border: none;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5gYdDTk5eKO+PAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACESURBVDjLtVLbCcAgDDSlmwjOck6cRdzAQa5fBbWJRUsP8mNyjwSFZLCQc+4aqirW3DEjq6rcxFHQFWjJo7slYiaw4m6t8PZmCnhOXu/whltHz/2/G6zgs4C0P3G2q7eOAOhItVYppZjElFKIMfYmAEgy7BQAPhIs41bacScZztUDjrgATneZ8fsImrwAAAAASUVORK5CYII=');background-size:auto;");
            btn.onmouseover = function(){this.style.backgroundColor = "#cfe0fc"; this.classList.remove("cke_button_off");this.classList.add("cke_button_on")};
            btn.onmouseout = function(){this.style.backgroundColor = "transparent";this.classList.remove("cke_button_on");this.classList.add("cke_button_off")};
            //btn.appendChild(btn_span);
            toolbox.appendChild(btn);

            //Set all the event handlers for each text field as it loads.
            //The callback functions were giving me a hard time getting them to use the value of I when I set them rather than the value when called,
            //So I gave up and just pass them to different functions or hard code the parameters.
             switch(i) {
                case 0:
                    //When the button is clicked
                    btn.onclick = StampNameDate0;
                    //Ctrl+d hotkey
                    Mousetrap(document.getElementsByClassName("ck ck-editor__main")[i]).bind('ctrl+d', function() { StampNameDate0(); return false;});
                    break;
                case 1:
                    btn.onclick = StampNameDate1;
                    Mousetrap(document.getElementsByClassName("ck ck-editor__main")[i]).bind('ctrl+d', function()  { StampNameDate1(); return false; });


                    break;
                case 2:
                    btn.onclick = StampNameDate2;
                    Mousetrap(document.getElementsByClassName("ck ck-editor__main")[i]).bind('ctrl+d', function() { StampNameDate2(); return false; });



                    break;
                case 3:
                    btn.onclick = StampNameDate3;
                   Mousetrap(document.getElementsByClassName("ck ck-editor__main")[i]).bind('ctrl+d', function() { StampNameDate3(); return false; });


                    break;
                case 4:
                    btn.onclick = StampNameDate4;
                    Mousetrap(document.getElementsByClassName("ck ck-editor__main")[i]).bind('ctrl+d', function() { StampNameDate4(); return false; });


                    break;
            }

            //Prevent the context menu from popping up on right click of the button.
            btn.addEventListener('contextmenu', e => { config(); e.preventDefault();});



        }

        ++i;

    }


}



//This is the code that runs to add your name and date to the text field. Pass frameindex is which text box to add to,
//frameIndex is which textbox frame to stamp
//autoStampFunc a reference to the function to unbind from keydown when using autostamp.
function AddName(frameIndex, autoStampFunc ){
    //alert("Debug1");
 
    var d = new Date();

    var commentText = "[ " + userName + " - " + d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/\:\d\d /, ' ') + " ]\xa0" ;
//    span.setAttribute("contenteditable", "false");

    //Link to the editor instance.
    var editor_element= document.getElementsByClassName("ck-editor__editable")[frameIndex];
    var editor=editor_element.ckeditorInstance;
    editor.model.change(writer => {
        // Get the current selection
        const selection = editor.model.document.selection;

        // Get the position at the start of the block element containing the selection
        const blockElement = selection.getFirstPosition().findAncestor('paragraph');

        // Get the position before the current block (this places it on a new line above)
        const positionBeforeBlock = writer.createPositionBefore(blockElement);

        // Create a new paragraph element
        const newParagraph = writer.createElement('paragraph');

//         console.log("bold: " + bold);
//         console.log("italic: " + italic);
//         console.log("underline: " + underline);

        // Create a text node for the new paragraph
        const textNode = writer.createText(commentText, {'fontColor': myColor});

        if (bold) {writer.setAttribute('bold', true, textNode); }// Set bold attribute to true
        if (italic) {writer.setAttribute('italic', true, textNode); }
        if (underline) {writer.setAttribute('underline', true, textNode); }
        // Append the text node to the new paragraph



        // Insert the new paragraph before the current block
        writer.insert(textNode, newParagraph);
        writer.insert(newParagraph, positionBeforeBlock);

    });

}



//This is the workaround to the trouble I had with event callbacks mentioned above.
//It passes a reference to itself so that it can unregister the event handler which called it in the first place.
// function autoStamp0(event){autoStampHandler(event, 0, autoStamp0);}
// function autoStamp1(event){autoStampHandler(event, 1, autoStamp1);}
// function autoStamp2(event){autoStampHandler(event, 2, autoStamp2);}
// function autoStamp3(event){autoStampHandler(event, 3, autoStamp3);}
// function autoStamp4(event){autoStampHandler(event, 4, autoStamp4);}
function StampNameDate0(){ AddName(0, false);}
function StampNameDate1(){ AddName(1, false);}
function StampNameDate2(){ AddName(2, false);}
function StampNameDate3(){ AddName(3, false);}
function StampNameDate4(){ AddName(4, false);}




//This is the config popup window
function config(){

    //if the form was created then show it, otherwise create it.
    if (document.getElementById("gmPopupContainer"))
    {
        $("#gmPopupContainer").show();
    }
    else
    {

        //Create the config form.
        $("body").append ( '                                                          \
<div id="gmPopupContainer">                                               \
<form> \
<div class="optionSection"> <span style="font-size: 120%; font-weight: bold;">Color:<br></span>                           \
\
<input class = "option" type="radio" id="black" name="gm_color" value="#000000">\
<label class = "option" for="black" style="color:black;">Black</label><br>\
\
<input class = "option" type="radio" id="grey" name="gm_color" value="#808080">\
<label class = "option" for="grey" style="color:grey;">Grey</label><br>\
\
<input class = "option" type="radio" id="lightblue" name="gm_color" value="#add8e6">\
<label class = "option" for="lightblue" style="color:lightblue;">Light Blue</label><br>\
\
<input class = "option" type="radio" id="blue" name="gm_color" value="#0000FF">\
<label class = "option" for="blue" style="color:blue;">Blue</label><br>\
\
<input class = "option" type="radio" id="green" name="gm_color" value="#008000">\
<label class = "option" for="green" style="color:green;">Green</label><br>\
\
<input class = "option" type="radio" id="red" name="gm_color" value="#FF0000">\
<label class = "option" for="red" style="color:red;">Red</label><br>\
\
<input class = "option" type="radio" id="pink" name="gm_color" value="#ffc0cb">\
<label class = "option" for="pink" style="color:pink;">Pink</label><br>\
\
<input class = "option" type="radio" id="brown" name="gm_color" value="#a52a2a">\
<label class = "option" for="brown" style="color:brown;">Brown</label><br>\
\
<input class = "option" type="radio" id="orange" name="gm_color" value="#ffa500">\
<label class = "option" for="orange" style="color:orange;">Orange</label><br><br>\
\
\
<label class = "option" for="color" >Custom Color: </label>\
<input class = "option" type="color" id="customColor" name="customColor" value="#000000"><br>\
\
</div>  \
<div class="optionSection"> <span style="font-size: 120%; font-weight: bold;">Style:<br></span>     \
<input class = "option" type="checkbox" id="italic" name="options-style" value="font-style:Italic;">\
<label class = "option" for="italic" style="font-style:italic">Italic</label><br>\
\
<input class = "option" type="checkbox" id="bold" name="options-style" value="font-weight: bold;">\
<label class = "option" for="bold" style="font-weight: bold;">Bold</label><br>\
\
<input class = "option" type="checkbox" id="underline" name="options-style" value="text-decoration:underline;">\
<label class = "option" for="underline" style="text-decoration:underline">Underline</label><br>\
\
</div>\
\
<div class="optionSection"> <span style="font-size: 120%; font-weight: bold;">Extras:<br></span>     \
<input class = "option" type="checkbox" id="fixLinks" name="options-FixLink" value="fixLinks">\
<label class = "option" for="fixLinks" >Improved item links popup menu.<br><br><br><br><br>\
<br><button id="gmSaveBtn" type="button">Save</button>  \
<button id="gmCloseDlgBtn" type="button">Cancel</button>         \
</div>  \
</form>                                                                   \
</div>                                                                    \
' );

        //--- Use jQuery to activate the dialog buttons.
        // This is what happens when you click the save/cancel buttons.
        $("#gmSaveBtn").click ( function () {


            var styleOption;
            var reloadPage = false;
            var customColor = document.getElementById("customColor");
            myColor = customColor.value;

            style="";
            var styleOption;

            styleOption=document.getElementById("bold");
            if (styleOption.checked){
                bold = true;
                style = style + styleOption.value;
            }
            else {bold = false}

            styleOption=document.getElementById("italic");
            if (styleOption.checked){
                italic = true;
                style = style + styleOption.value;
            }
            else {italic = false}

            styleOption=document.getElementById("underline");
            if (styleOption.checked){
                underline = true;
                style = style + styleOption.value;
            }
            else {underline = false;}


            var fixLinksOption = document.getElementById("fixLinks");
            //If you changed this option reload the page.
            if (reloadPage || fixLinksOption.checked != fixLinks){
                reloadPage = true
            }
            if (fixLinksOption.checked){
                fixLinks=true;
            }
            else {fixLinks=false;}

            GM_setValue("bold", bold);
            GM_setValue("italic", italic);
            GM_setValue("underline", underline);
            GM_setValue("style", style);
            GM_setValue("myColor", myColor);
//             GM_setValue("useAutoAt", useAutoAt);
//            GM_setValue("useAutoStamp", useAutoStamp);
            GM_setValue("fixLinks", fixLinks);

            $("#gmPopupContainer").hide ();
            if (reloadPage) {window.location.reload();}

        } );

        $("#gmCloseDlgBtn").click ( function () {
            $("#gmPopupContainer").hide ();
        } );


        //--- CSS styles make it work...
        GM_addStyle ("                                                 \
#gmPopupContainer {                                         \
position:               fixed;                          \
top:                    30%;                            \
left:                   20%;                            \
padding:                2em;                            \
background:             white;                     \
border:                 3px double black;               \
border-radius:          1ex;                            \
z-index:                777;                            \
}                                                           \
#gmPopupContainer button{                                   \
cursor:                 pointer;                        \
margin:                 1em 1em 0;                      \
border:                 1px outset buttonface;          \
}                                                           \
div.optionSection {\
display:inline-block; \
vertical-align: top; \
padding:20px;\
}\
.option{\
padding:3px;\
font-size:13px;\
}\
label.option{\
position: relative;\
bottom: 3px; \
}\
" );

    }
    //Check off the current selection after loading the options dialog
    var color, radios = document.getElementsByName("gm_color");
    var customColor = document.getElementById("customColor");
    customColor.onclick=clearRadios;

    for (color of radios){
        if (color.value.toLowerCase() === myColor.toLowerCase()){
            color.checked = true;
        }
        else {
            color.checked = false;
        }
        color.onclick = updateColor;
    }
    customColor.value=myColor;

    var styleOption
    styleOption=document.getElementById("bold");
    if (bold){ styleOption.checked = true;} else { styleOption.checked = false;}

    styleOption=document.getElementById("italic");
    if (italic){ styleOption.checked = true;} else { styleOption.checked = false;}

    styleOption=document.getElementById("underline");
    if (underline){ styleOption.checked = true;} else { styleOption.checked = false;}

//     var autoAtOption = document.getElementById("useAutoAt");
//     if (useAutoAt){ autoAtOption.checked = true;} else { autoAtOption.checked = false;}

//    var AutoStampOption = document.getElementById("useAutoStamp");
//    if (useAutoStamp){ AutoStampOption.checked = true;} else { AutoStampOption.checked = false;}

    var fixLinksOption = document.getElementById("fixLinks");
    if (fixLinks){ fixLinksOption.checked = true;} else { fixLinksOption.checked = false;}

    function updateColor(){
        var color, radios = document.getElementsByName("gm_color");
        var customColor = document.getElementById("customColor");
        for (color of radios){
            if (color.checked){
                customColor.value=color.value;
            }
        }

    }
    function clearRadios(){
        var color, radios = document.getElementsByName("gm_color");
        for (color of radios){
            color.checked = false;
        }
    }
}




//utility function to search elements by Xpath
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//waitForKeyElements script by BrockA found here:
//https://gist.github.com/BrockA/2625891
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
                                       1000
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}