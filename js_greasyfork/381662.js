// ==UserScript==
// @name         Discord Message Colors
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Mikerific's Message Color Codes. Invisible for anyone without this script or the BetterDiscord plugin.
// @author       Mikerific
// @match        https://discordapp.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381662/Discord%20Message%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/381662/Discord%20Message%20Colors.meta.js
// ==/UserScript==

var prefixs = ["&0", "&1", "&2", "&3", "&4", "&5", "&6", "&7", "&8", "&9", "&a", "&b", "&c", "&d", "&e", "&f", "&r", "~r", "~o", "~y", "~g", "~c", "~b"];
var darktheme = document.querySelector('.theme-light') == null;
setTimeout(function(){
    //Update colors on start
    handle();

    //Update colors on channel change
    var href = location.href;
    setInterval(function(){
        if(location.href != href) {
            handle();
            href = location.href;
        }
    }, 100);

    //Update colors on message sent
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if(mutation.addedNodes.length >= 1) {
                if(mutation.addedNodes[0].className != null) {
                    if(mutation.addedNodes[0].classList.value.includes("message") || mutation.addedNodes[0].classList.value.includes("container")) {
                        darktheme = document.querySelector('.theme-light') == null;
                        handle();
                    }
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document, {attributes: true, childList: true, subtree: true});

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    //Convert Color Codes to Whitespace Codes
    function CtoW(code) {
        switch(code) {
            case "&0": return "\u200B\u200D\u200B\u200B\u200B";
            case "&1": return "\u200B\u200D\u200B\u200B\u200C";
            case "&2": return "\u200B\u200D\u200B\u200B\u200D";
            case "&3": return "\u200B\u200D\u200B\u200C\u200B";
            case "&4": return "\u200B\u200D\u200B\u200C\u200C";
            case "&5": return "\u200B\u200D\u200B\u200C\u200D";
            case "&6": return "\u200B\u200D\u200B\u200D\u200B";
            case "&7": return "\u200B\u200D\u200B\u200D\u200C";
            case "&8": return "\u200B\u200D\u200B\u200D\u200D";
            case "&9": return "\u200B\u200D\u200C\u200B\u200B";
            case "&a": return "\u200B\u200D\u200C\u200B\u200C";
            case "&b": return "\u200B\u200D\u200C\u200B\u200D";
            case "&c": return "\u200B\u200D\u200C\u200C\u200B";
            case "&d": return "\u200B\u200D\u200C\u200C\u200C";
            case "&e": return "\u200B\u200D\u200C\u200C\u200D";
            case "&f": return "\u200B\u200D\u200C\u200D\u200B";
            case "&r": return "\u200B\u200D\u200C\u200D\u200C";
            case "~r": return "```diff\n-";
            case "~o": return "```glsl\n#";
            case "~y": return "```fix\n";
            case "~g": return "```css\n";
            case "~c": return "```yaml\n";
            case "~b": return "```md\n#";
            default: return "";
        }
    }

    //Handle color changes
    function handle() {
        $(".da-scrollbar").off("keydown");
        $(`textarea[class*=scrollbar]`).on("keydown", function(e){
            if(e.which == 13 && !e.shiftKey){
                if(e.target.value.trim() == "/colors") {
                e.preventDefault();
                darktheme = document.querySelector('.theme-light') == null;
                var darkcode = "#DCDDDE";
                if(darktheme) {
                    darkcode = "#DCDDDE";
                } else {
                    darkcode = "#747F8D";
                }
                $('div[class*=messagesWrapper]')[0].firstElementChild.firstElementChild.appendChild(createElementFromHTML("<div style='text-align: center;'>"+
                    "<span style='color: "+darkcode+"'>Message Colors:</span><br>"+
                    "<table style='margin: auto;'>"+
                        "<tbody>"+
                            "<tr>"+
                                "<td style='color: #000000'>&0</td>"+
                                "<td style='color: #0000AA'>&1</td>"+
                                "<td style='color: #00AA00'>&2</td>"+
                                "<td style='color: #00AAAA'>&3</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td style='color: #AA0000'>&4</td>"+
                                "<td style='color: #AA00AA'>&5</td>"+
                                "<td style='color: #FFAA00'>&6</td>"+
                                "<td style='color: #AAAAAA'>&7</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td style='color: #555555'>&8</td>"+
                                "<td style='color: #5555FF'>&9</td>"+
                                "<td style='color: #55FF55'>&a</td>"+
                                "<td style='color: #55FFFF'>&b</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td style='color: #FF5555'>&c</td>"+
                                "<td style='color: #FF55FF'>&d</td>"+
                                "<td style='color: #FFFF55'>&e</td>"+
                                "<td style='color: #FFFFFF'>&f</td>"+
                        "</tbody>"+
                    "</table>"+
                    "<span style='color: "+darkcode+"'>&r = Reset</span>"+
                    '</div>'));
                    $('div[class*=messagesWrapper]')[0].firstElementChild.firstElementChild.scrollTop = $('div[class*=messagesWrapper]')[0].firstElementChild.firstElementChild.scrollHeight;
                    e.target.selectionStart = 0;
                    e.target.selectionEnd = e.target.value.length;
                    document.execCommand("insertText", false, "");
                }
                e.target.focus();
                while(e.target.value.includes("&0") || e.target.value.includes("&1") || e.target.value.includes("&2") || e.target.value.includes("&3") || e.target.value.includes("&4") || e.target.value.includes("&5") || e.target.value.includes("&6") || e.target.value.includes("&7") || e.target.value.includes("&8") || e.target.value.includes("&9") || e.target.value.includes("&a") || e.target.value.includes("&b") || e.target.value.includes("&c") || e.target.value.includes("&d") || e.target.value.includes("&e") || e.target.value.includes("&f") || e.target.value.includes("&r")) {
                    e.target.selectionStart = e.target.value.indexOf("&");
                    if(e.target.selectionStart + 2 <= e.target.value.length) {
                        e.target.selectionEnd = e.target.selectionStart + 2;
                        var colorCode = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
                        if(prefixs.includes(colorCode)) {
                            document.execCommand("insertText", false, CtoW(colorCode));
                            e.target.selectionStart = e.target.value.length;
                            e.target.selectionEnd = e.target.value.length;
                            document.execCommand("insertText", false, "\u2063");
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                while(e.target.value.includes("~r") || e.target.value.includes("~o") || e.target.value.includes("~y") || e.target.value.includes("~g") || e.target.value.includes("~c") || e.target.value.includes("~b")) {
                    e.target.selectionStart = e.target.value.indexOf("~");
                    if(e.target.selectionStart + 2 <= e.target.value.length) {
                        e.target.selectionEnd = e.target.selectionStart + 2;
                        var colorCode = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
                        if(prefixs.includes(colorCode)) {
                            document.execCommand("insertText", false, CtoW(colorCode));
                            e.target.selectionStart = e.target.value.length;
                            e.target.selectionEnd = e.target.value.length;
                            document.execCommand("insertText", false, "```");
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                return true;
            }
        });
        var messages = document.querySelectorAll(`div[class*=markup]`);
        for(var i = 0; i < messages.length; i++) {
            if(messages[i].innerHTML.includes("\u2063")) {
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200B\u200B", "<span style='color: #000000'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200B\u200C", "<span style='color: #0000AA'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200B\u200D", "<span style='color: #00AA00'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200C\u200B", "<span style='color: #00AAAA'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200C\u200C", "<span style='color: #AA0000'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200C\u200D", "<span style='color: #AA00AA'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200D\u200B", "<span style='color: #FFAA00'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200D\u200C", "<span style='color: #AAAAAA'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200B\u200D\u200D", "<span style='color: #555555'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200B\u200B", "<span style='color: #5555FF'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200B\u200C", "<span style='color: #55FF55'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200B\u200D", "<span style='color: #55FFFF'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200C\u200B", "<span style='color: #FF5555'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200C\u200C", "<span style='color: #FF55FF'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200C\u200D", "<span style='color: #FFFF55'>");
                messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200D\u200B", "<span style='color: #FFFFFF'>");
                if(darktheme) {
                    messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200D\u200C", "<span style='color: #DCDDDE'>");
                } else {
                    messages[i].innerHTML = messages[i].innerHTML.replace("\u200B\u200D\u200C\u200D\u200C", "<span style='color: #747F8D'>");
                }
                messages[i].innerHTML = messages[i].innerHTML.replace("\u2063", "</span>");
            }
        }
    }
}, 5000);