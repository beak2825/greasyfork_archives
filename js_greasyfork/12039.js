// ==UserScript==
// @name         4chan Text Functions
// @namespace    Wolvan_PicartoTV_4chan_Chat_Functions
// @version      1.3
// @description  Allows usage of [spoiler]Spoilers[/spoiler] and >greentext inside of picarto chats
// @author       Wolvan
// @match        *://*.picarto.tv/*
// @run-at       document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12039/4chan%20Text%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/12039/4chan%20Text%20Functions.meta.js
// ==/UserScript==

// Get Picarto's jQuery instance, no need to polute it with our own
//var $ = window.jQuery;

// A function to inject CSS into the site
function addCSS(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// A function that lets me retrieve the text the user has selected
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

// On appending a new message to the messages container we replace the new message's control codes ([spoiler]/[/spoiler]) with properly css-formatted <s> tags
// We also bind the mouseover and mouseout events to hide the spoilers again when you remove the mousecursor
// Lastly we check if the first char of the message is > and turn the message green
var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    var selection = $("#msgs > li:last > div > div > span:not(.timestamp, .my_timestamp):last");
	if (typeof(selection) !== "undefined") {
        if ($("#spoilers").is(":checked")) {
            var incoming = selection.html();
            if (typeof(incoming) !== "undefined") {
                var processed = incoming.replace(/\[spoiler\]/gi, "<s>").replace(/\[\/spoiler\]/gi, "</s>");
                var countS = (processed.match(/<s>/g) || []).length;
                var countSE = (processed.match(/<\/s>/g) || []).length;
                var countDiff = countS - countSE;
                if (countDiff > 0) {
                    for(i = 0; i <= countDiff; i++) {
                        processed = processed + "</s>";
                    }
                }
                selection.html(processed).find("s").mouseover(function() {
                    $(this).css("color", "white");
                }).mouseout(function() {
                    $(this).css("color", "black");
                });
            }
        }
	}
    if ($("#greentext").is(":checked")) {
        if (selection.text().startsWith(">")) {
            selection.css("color", "#8ba446");
        }
    }
    observer.observe(document.querySelector('#msgs'), {
        childList: true,
        subtree: true
    });
});

observer.observe(document.querySelector('#msgs'), {
    childList: true,
    subtree: true
});

// Add the CSS to have the spoilers be black boxes without a strikethrough
addCSS(' \
	s { \
		background-color: black; \
		color: black; \
		text-decoration: none; \
	}\
');

// Allow Ctrl+S to use as hotkey for spoiler tags
$("#msg").bind('keydown', function(event) {
    if ($("#kb_shortcuts").is(":checked")) {
        if (event.ctrlKey || event.metaKey) {
            if (String.fromCharCode(event.which).toLowerCase() === "s") {
                event.preventDefault();
                if (getSelectionText() !== "") {
                    var fullmsg = $("#msg").val();
                    $("#msg").val(fullmsg.replace(getSelectionText(), "[spoiler]" + getSelectionText() + "[/spoiler]"))
                } else {
                    var caretPos = document.getElementById("msg").selectionStart;
                    var textAreaTxt = jQuery("#msg").val();
                    var txtToAdd = "[spoiler][/spoiler]";
                    jQuery("#msg").val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
                    document.getElementById("msg").selectionStart = caretPos + 9;
                    document.getElementById("msg").selectionEnd = caretPos + 9;
                }
            }
        }
    }
});

// Append Settings to the settings menu
var spoilers = GM_getValue("enableSpoiler", true) ? "checked" : "";
var greentext = GM_getValue("enableGreentext", true) ? "checked" : "";
var shortcuts = GM_getValue("enableShortcuts", true) ? "checked" : "";

$("#functions > table > tbody > tr:nth-child(4)").after(' \
    <tr> \
            <td class="functionDesc"><b>4chan Text Functions:</b></td> \
            </tr> \
	<tr> \
		<td class="functionDesc">Spoilers</td> \
		<td class="functionButton"> \
			<label class="switch switch-green"> \
			<input type="checkbox" class="switch-input" id="spoilers" ' + spoilers + '> \
			<span class="switch-label" data-on="On" data-off="Off"></span> \
			<span class="switch-handle"></span> \
			</label> \
		</td> \
	</tr> \
	<tr> \
		<td class="functionDesc">Greentext</td> \
		<td class="functionButton"> \
			<label class="switch switch-green"> \
			<input type="checkbox" class="switch-input" id="greentext" ' + greentext + '> \
			<span class="switch-label" data-on="On" data-off="Off"></span> \
			<span class="switch-handle"></span> \
			</label> \
		</td> \
	</tr> \
	<tr> \
		<td class="functionDesc">Keyboard Shortcuts</td> \
		<td class="functionButton"> \
			<label class="switch switch-green"> \
			<input type="checkbox" class="switch-input" id="kb_shortcuts" ' + shortcuts + '> \
			<span class="switch-label" data-on="On" data-off="Off"></span> \
			<span class="switch-handle"></span> \
			</label> \
		</td> \
	</tr> \
');

$("#spoilers").change(function() {
    GM_setValue("enableSpoiler", $(this).is(":checked"));
});
$("#greentext").change(function() {
    GM_setValue("enableGreentext", $(this).is(":checked"));
});
$("#kb_shortcuts").change(function() {
    GM_setValue("enableShortcuts", $(this).is(":checked"));
});