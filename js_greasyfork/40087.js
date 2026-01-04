// ==UserScript==
// @name        kbd formatting button for stackexchange
// @description Adds the ability to quickly insert kbd formatting tags in the SE editor
// @namespace   http://blender.org
// @include     *.stackexchange.com/*
// @include     http://stackoverflow.com/*
// @include     http://askubuntu.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     7
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/40087/kbd%20formatting%20button%20for%20stackexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/40087/kbd%20formatting%20button%20for%20stackexchange.meta.js
// ==/UserScript==

//Credits to CoDEmanX and iKlsR
//see https://blender.meta.stackexchange.com/q/388/599 for discussion



//calls to GM functions must be outside of injected code, so put them here
function toggle_extra_markdown() {
    console.log("checkbox click, was", GM_getValue("extra_markdown", 1))

    if (GM_getValue("extra_markdown", 1) == 1) {
        GM_setValue("extra_markdown", 0);
    }
    else {
        GM_setValue("extra_markdown", 1);
    }
}
function get_prefs() {
    return GM_getValue("extra_markdown", 1);
}

//stuff which will be injected with jquery goes in main:
function main() {
    var pref_extra_markdown = 0
    console.log("running main!");

    function startInjection() {

        //add kbd button when any of these elements are clicked:
        $(document).on('click', 'a.edit-post', waitForButtonRow); //inline editing
        $(document).on('click', 'input#answer-from-ask', waitForButtonRow); //answering own question in ask questions page
        $(document).on('click', 'input[value="Add Another Answer"]', waitForButtonRow); //adding multiple answers
        //review editing:
        $(document).on('click', 'input[value="Improve"]', waitForButtonRow); //improving suggested edits
        $(document).on('click', 'input[value="Edit"]', waitForButtonRow); //editing close voted questions

        //define keyboard shortcut even handler (Ctrl+Y)
        $(document).on('keydown', "textarea.wmd-input", function(e) {
            if (e.ctrlKey && (e.which === 89)) {
                // turns out SE silently binds Ctrl+Y to redo in addition to Ctrl+Shift+Z; needless to say, us both messing with the content at the same time causes havoc, so we stop SE.
                // TODO: this doesn't always seem to work, possibly a race condition? May be best to bind to a different key.
                e.stopImmediatePropagation();
                insertKbdTag(this);
            }
        });

        waitForButtonRow();
    }

    function waitForButtonRow() {
        console.log("waiting for button row..")

        function testForButtonRow() { /*test for a .wmd-button-row every half a second until one is found*/
            if (counter < 60) {
                if ($(".wmd-button-row").length > 0) { //if button row(s) exist, test each one to see if it already has a kbd button
                    console.log("found .wmd-button-row");
                    $(".wmd-button-row").each(function() {console.log("does it have a kbd button? ", $(this).has(".wmd-kbd-button").length);console.log("id", $(this).attr("id"))});
                    $(".wmd-button-row").each(function() {
                        if ($(this).has(".wmd-kbd-button").length == 0) { //if no kbd button exists, inject one
                            console.log("does not contain kbd button, inserting one");
                            injectButton($(this));
                        }
                    });

                }
                else {
                    setTimeout(testForButtonRow, 500);
                    counter++;
                }
            }
            else {
                console.log("did not find a place to put kbd button within 30 seconds. giving up.");
                return;
            }
        }

        var counter = 0;
        setTimeout(testForButtonRow, 500); //bit of spacer time to allow SE js to execute and add button rows.
        //TODO: This causes a potential race condition (if SE js takes longer than 500ms), a better workaround would be nice..
    }

    function injectButton(buttonRow) {
        //abandonded attempt to make it work on unity answers:

            //console.log("host: " + window.location.hostname);
            //if (window.location.hostname != "answers.unity3d.com") {
                console.log("id-number:" + buttonRow.attr("id").replace(/[^0-9]+/g, ""))
                var kbdButtonId = 'wmd-kbd-button' + buttonRow.attr("id").replace(/[^0-9]+/g, "");
            /*}
            else {
                kbdButtonId = "";
            }*/

        var li = $("<li/>");
        li.attr('id', kbdButtonId);
        li.attr('title', 'Keyboard Shortcut <kbd> Ctrl+Y');
        li.addClass('wmd-button wmd-kbd-button');
        li.click(function() {
            insertKbdTag($(this).parents("div[class='wmd-container']").find("textarea").first()[0]);
        });

        //shuffle existing buttons around so kbd button is the one after image button
        var imgButton = $(buttonRow).children("[id^=wmd-image]");
        li.insertAfter(imgButton);

        li.css("left", parseInt(imgButton.css("left")) + 25 + "px"); //put kbd button 25 px after img button
        li.nextAll().each(function() {
           $(this).css("left", parseInt($(this).css("left")) + 25 + "px"); //move buttons after kbd button farther over
        });

        //Add image element with embedded png icon
        var img = $("<img/>").appendTo(li); //   Look at that slope :P.. ============>    \
        img.attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWk\
        AAAAUVBMVEUAAADMzMz6%2BvrQ0NDS0tL39%2Ff%2F%2F%2F8AAAAAAAAAAADZ2dlGRkYzMzPc3Nz09PSHh4\
        eOjo7R0dF5eXmYmJhOTk7t7e06OjrAwMC7u7tiYmLHx8fiGhLAAAAACnRSTlMd%2F%2F%2F%2Fcv%2F%2FAiQ\
        FjE%2F%2BXQAAAHdJREFUGNOd0LsawyAIQGHQGi0EL0l6ff8HLV83MFPO4PDLApAhom2UDEBhsSUCGGnxhQion\
        yadwmsqaz%2FR%2FcN11gOP76SRU2%2BTtp6Qq9PKq%2FZ2%2BmJdvG1Ot10fej6shvAfu7JxDGeXFErT1QVuMt\
        AWpUAG8lruP7kVCZBoOBuAAAAAAElFTkSuQmCC');



        //define RMB preferences menu
        $(li).on("contextmenu", function(e) {
            e.preventDefault();
            console.log("started creating context menu. pref_extra_markdown =", pref_extra_markdown)
            /*check if a preference menu already exists*/
            console.log("contextmenu.length: " + $("#kbd-context-menu").length)

            if ($("#kbd-context-menu").length < 1) { //ensure context menu doesn't already exist

            //console.log("contextmenu")
            var div = $("<div>").appendTo($(li).parent());
            div.attr("id", "kbd-context-menu")
            var pOffset = $(li).parent().offset();
            div.css({"position": "absolute", "left": (e.pageX-pOffset.left)+5 + "px", "top": (e.pageY-pOffset.top) + "px",
                     "background-color": "rgba(0,0,0,.7)",
                     "color": "#f8f8f8",
                     "padding": "5px",
                     "padding-top": "1px",
                     "border-radius": "5px",
                     "box-shadow": "5px 5px 10px rgba(0,0,0,.7)"});

            var ul = $("<ul>").appendTo(div);

            ul.css({"list-style": "none",
                    "margin": "3px",
                    "cursor": "default"});

            //styling for headings, links
            ul.append("<li id='kbd_info_links'>");
            $("#kbd_info_links").html("<a href='https://blender.meta.stackexchange.com/a/391/599' title='Go to meta post for discussion and feedback'>About</a>").css({"font-size": "6pt"});
            ul.append("<li id='kbd_context_title'>");
            $("#kbd_context_title").html("Preferences:<br><hr>").css({"font-weight": "bold"});
            $("#kbd_context_title hr").css({"margin": "0", "background-color": "rgba(200,200,200,.2)"});

                //TODO stylize checkbox

            ul.append("<li id='entry1'>");
            $("#entry1").html("Extra markdown <input type='checkbox' />");
            $("#entry1").attr("title", "Insert mouse and modifier key icons");
            $("#entry1 > input").css({"margin": "0"});
            //console.log("div height: " + div.css("height"));
            div.css({"top": (e.pageY-pOffset.top) - parseInt(div.css("height")) });

                //bind mouse sensors to the menu so it goes away on mouse off:
                var vanish_delay = setTimeout(function() {$("#kbd-context-menu").fadeOut(500,function() {$(this).remove()})}, 1500);
                div.mouseleave(function() {
                    vanish_delay = setTimeout(function() {$("#kbd-context-menu").fadeOut(500,function() {$(this).remove()})}, 500);
                })
                div.mouseenter(function() {
                    console.log("on context menu");
                    clearTimeout(vanish_delay);
                })

                /*store preferences*/
                if (typeof get_prefs === "function") { //for normal chrome extensions get_prefs will be outside of scope
                    console.log("toggle_markdown:", get_prefs());
                    if (get_prefs() == 1) {
                        $("#entry1 > input").prop("checked", 1);
                    }
                }
                else { //if being run as chrome extension, use normal variable instead
                    console.log("get_prefs not found, probably running as chrome extension.", "WARNING: preferences won't be saved accross page loads")
                    if (pref_extra_markdown == 1) {
                        $("#entry1 > input").prop("checked", 1);
                    }
                }

                //bind mouse click sensor to the checkbox:
                if (typeof toggle_extra_markdown === "function") {
                   $("#entry1 > input").click(toggle_extra_markdown)
                }
                else {
                    $("#entry1 > input").click(function(){pref_extra_markdown ^= 1}) //toggle non persistent var with xor operator
                }
            }
            else {
                $("#kbd-context-menu").remove() //right clicking on the icon when there is an existing context menu will remove it
            }
            console.log("finished creating context menu. pref_extra_markdown =", pref_extra_markdown)
        });
    }

    function insertKbdTag(txta) {

        if (txta.selectionStart == null) return;

        var start = txta.selectionStart;
        var end = txta.selectionEnd;
        var added = 0;
        var chars = txta.value;
        console.log("chars: " + chars);

        /*function to insert mousebutton icon references as needed*/
        function insertIcon(txta, mb) {

            function addRef(ref) { //function to test if image references exists, and add it if it doesn't
                if (txta.value.indexOf(ref) < 0) {
                    post = post + "\n\n  " + ref; //insert image reference at end of post
                }
            }

            console.log("mb", mb);

            switch (mb.toUpperCase()) {
                case "MW":
                    addRef("[MW]: http://i.stack.imgur.com/v1vyT.png (Mouse Wheel)");
                    break;
                case "LMB":
                    addRef("[LMB]: http://i.stack.imgur.com/FwrAW.png (Left Mouse Button)");
                    break;
                case "RMB":
                    addRef("[RMB]: http://i.stack.imgur.com/LPwD4.png (Right Mouse Button)");
                    break;
                case "MMB":
                    addRef("[MMB]: http://i.stack.imgur.com/OASpJ.png (Middle Mouse Button)");
                    break;
                case "WIN":
                    addRef("[WIN]: http://i.imgur.com/AAjIi.png (Windows key)"); //use http://i.stack.imgur.com/DHxcg.png for windows 9x logo
                    break;
                case "LINUX":
                    addRef("[LINUX]: http://i.stack.imgur.com/X9TZA.png (LINUX5EVAH -CharlesL)");
                    break;

            }
        }

        //separate selection from rest of body
        var pre = chars.slice(0, start);
        var post = chars.slice(end);

        if (start != end) {
            var sel = chars.slice(start, end);
            console.log("sel: " + sel);
            sel = sel.match(/(?:\S+|\s)/g); //split string around whitespace without deleting whitespace, thanks to this SO post: http://stackoverflow.com/a/24504047/2730823
            console.log("sel: " + sel);
            //remove extra spaces and replace them with kbd markdown
            //var lastElement = ""; //holds previous element
            var wasSpace = 0; //tracks if last element was a space
            var endSpaces = 0; //needed for special end cases
            var endSpace = 0;
            var refined_markdown = "";

            for (var char = 0; char < sel.length; char++) {

                console.log("element " + char + ": " + "'" + sel[char] + "'")
                //if current this element is a space, check to see if it should be replaced with a kbd
                if (sel[char] == " ") {
                    //if previous element was not a space, replace space with kbd
                    if (wasSpace != 1 && char != 0) {
                        sel.splice(char, 1, '</kbd><kbd>');
                        //added += 10;
                        wasSpace = 1;
                        endSpace = char;
                   }
                   else {
                       //console.log("asdf42")
                       //console.log(sel.join(""))
                       sel.splice(char, 1); //remove extra space
                       //console.log(sel.join(""))
                       wasSpace = 1;
                       char--; //go back one element
                   }
                }
                else {
                    wasSpace = 0;
                }
                if (wasSpace == 1) {
                    endSpaces ++;
                }
                else {
                    endSpaces = 0;
                }

                //test if get_prefs is defined, and if it is test if GM_value "extra markdown" is 1. If get_prefs is not defined, use the non-persistent variable:
                if (((typeof get_prefs === "function") ? get_prefs() : pref_extra_markdown) == 1 ) {
                    //console.log("element: " + sel[char])
                    switch(sel[char].toLowerCase()) {
                        case "control":
                        case "ctrl":
                            refined_markdown = "&#9096; Ctrl";
                            break;
                        case "alternate":
                        case "alt":
                            refined_markdown = "&#9095; Alt";
                            break;
                        case "shift":
                            refined_markdown = "&#8679; Shift";
                            break;
                        case "tab":
                            refined_markdown = "&#8633; Tab";
                            break;
                        case "delete":
                        case "del":
                            refined_markdown = "&#8998; Delete";
                            break;
                        case "enter":
                        case "return":
                            refined_markdown = "&#9166; Enter";
                            break;
                        case "backspace":
                            refined_markdown = "&#10229; Backspace";
                            break;
                        case "pageup":
                        case "pgup":
                            refined_markdown = "&#8670; Page up";
                            break;
                        case "pagedown":
                        case "pgdn":
                            refined_markdown = "&#8671; Page down";
                            break;
                        case "printscreen":
                            refined_markdown = "&#9113; Print Screen";
                            break;
                        case "up":
                            refined_markdown = "&#8593; Up arrow";
                            break;
                        case "left":
                            refined_markdown = "&#8592; Left arrow";
                            break;
                        case "right":
                            refined_markdown = "&#8594; Right arrow";
                            break;
                        case "down":
                            refined_markdown = "&#8595; Down arrow";
                            break;
                        case "caps":
                        case "capslock":
                            refined_markdown = "&#8682; Caps Lock"; //maybe use &#8684; instead?
                            break;
                        case "win":
                        case "windows":
                        case "windowskey":
                        case "winkey":
                            insertIcon(txta, "WIN");
                            refined_markdown = "![Windows key][WIN]";
                            break;
                        case "super":
                        case "linux":
                        case "linuxkey":
                        case "tuxkey":
                            insertIcon(txta, "LINUX");
                            refined_markdown = "![Linux key][LINUX]";
                            break;
                        case "meta":
                            refined_markdown = "&#9670; Meta";
                            break;


                            //mac thingies
                        case "command":
                        case "cmd":
                            refined_markdown = "&#8984; Cmd";
                            break;
                        case "option":
                        case "opt":
                            refined_markdown = "&#8997; Opt";
                            break;


                            //mouse things
                        case "wheel":
                        case "scrollwheel":
                        case "mousewheel":
                        case "mw":
                            insertIcon(txta, "MW");
                            refined_markdown = "![MW][MW] MW";
                            break;
                        case "mmb":
                            insertIcon(txta, "MMB");
                            refined_markdown = "![MMB][MMB] MMB";
                            break;
                        case "lmb":
                            insertIcon(txta, "LMB");
                            refined_markdown = "![LMB][LMB] LMB";
                            break;
                        case "rmb":
                            refined_markdown = "![RMB][RMB] RMB";
                            insertIcon(txta, "RMB");
                            break;
                    }
                console.log("refined_markdown: " + refined_markdown)
                console.log("refined_markdown.length: " + refined_markdown.length)
                if (refined_markdown.length > 0) {
                    //added += refined_markdown.length;
                    sel.splice(char, 1, refined_markdown);
                    refined_markdown = "";
                }
                }
            }
            //handle end case separatly; if there is more than 1 space at the end, the last array item is '</kbd><kbd>'
            //that will result in an extra <kbd> pair, so remove it.
            if (endSpaces > 0) {
                sel.splice(endSpace, 1);
            }

        }
        else { /*if there is no selection, assign sel to an array so that sel.join returns ""*/
            var sel = ["",];
        }
        //put everything back together again
        txta.value = pre + "<kbd>" + sel.join("") + "</kbd>" + post;
        added = sel.join("").length + 11
        //TODO, this is broken. Need to update cursor position calculation
        txta.selectionStart = txta.selectionEnd = pre.length + ((start == end) ? 5 : added); //remove the selection and move

        $(txta).focus();

        updateMarkdownPreview(txta);

        /*
        // jQuery-way doesn't work :(
        var evt = $.Event('keydown');
        evt.which = 17;
        evt.keyCode = 17; // Ctrl
        $(txta).trigger(e);

        // another failing attempt
        $(txta).trigger({
            type: "keydown",
            which : 17
        });
        */
    }

    //function to force update the live markdown render
    function updateMarkdownPreview(element) {

        var keyboardEvent = document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        /*keyboardEvent[initMethod](
                       "keydown", // event type : keydown, keyup, keypress
                        true, // bubbles
                        true, // cancelable
                        window, // viewArg: should be window
                        false, // ctrlKeyArg
                        false, // altKeyArg
                        false, // shiftKeyArg
                        false, // metaKeyArg
                        17, // keyCodeArg : unsigned long the virtual key code, else 0
                        0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        element.dispatchEvent(keyboardEvent);*/

        //horrible hack so undo after inserting kbd tags only removes kbd tags
        //TODO not sure why this works, need to investigate at some point..
        keyboardEvent[initMethod](
                       "keydown", // event type : keydown, keyup, keypress
                        true, // bubbles
                        true, // cancelable
                        document.defaultView, // viewArg: should be window
                        false, // ctrlKeyArg
                        false, // altKeyArg
                        false, // shiftKeyArg
                        false, // metaKeyArg
                        66, // keyCodeArg : unsigned long the virtual key code, else 0
                        0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        element.dispatchEvent(keyboardEvent);
        keyboardEvent[initMethod](
                       "keydown", // event type : keydown, keyup, keypress
                        true, // bubbles
                        true, // cancelable
                        document.defaultView, // viewArg: should be window
                        false, // ctrlKeyArg
                        false, // altKeyArg
                        false, // shiftKeyArg
                        false, // metaKeyArg
                        8, // keyCodeArg : unsigned long the virtual key code, else 0
                        0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        element.dispatchEvent(keyboardEvent);

    }


    startInjection() //call initial startup function (bind keyboard shortcuts, etc.)
}


//get jquery on chrome, thanks to this SO post: http://stackoverflow.com/a/12751531/2730823
if (typeof jQuery === "function") {
    console.log ("Running with local copy of jQuery!");
    main (jQuery);
}
else {
    console.log ("fetching jQuery from some 3rd-party server.");
    add_jQuery (main, "1.7.2");
}

function add_jQuery (callbackFn, jqVersion) {
    var jqVersion   = jqVersion || "1.7.2";
    var D           = document;
    var targ        = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode  = D.createElement ('script');
    scriptNode.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode          = D.createElement ("script");
        scriptNode.textContent  =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}