// ==UserScript==
// @name         OWoT ECF (Extra chat features)
// @namespace    owot_ecf
// @version      1.2.2
// @description  This adds extra chat features such as client-deleting, replying, linking and adding colors to messages.
// @author       e_g.
// @match        https://*.ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471698/OWoT%20ECF%20%28Extra%20chat%20features%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471698/OWoT%20ECF%20%28Extra%20chat%20features%29.meta.js
// ==/UserScript==

// 1.2.2 - Patched the famous vulnerability with links. This script can now be re-enabled in tampermonkey :)

send = function(msg){
    w.chat.send(msg);
}
random = function(min, max){
    return Math.random() * max + min;
}
bot = function(command, func){
    w.on("chatmod", function(e){
        e.id += "";
        if(Function("data", "return " + command)(e)){
            func(e, e.message.split(" ").slice(1), e.realUsername || e.nickname || e.id);
        };
    });
};
client_commands.bot = function(args){
    bot(args[0], Function("data, args, name", args.slice(1).join(" ")));
}
var hasDoneAction = false;
function findReply(e){
    var message = (e.message || [...e.element.children].at(-1).innerHTML);
    var extractedReply = message.substring(!e.message * 6, message.indexOf(")") + 2);
    var matchesSyntax = extractedReply.match(/^reply\(\d+\) /g);
    if(!matchesSyntax) return false;
    var replyDate = matchesSyntax[0].match(/\d+/)[0];
    var reply = [...chatRecordsPage, ...chatRecordsGlobal].filter(x => x.date == replyDate);
    if(reply[0] == undefined) return false;
    addChat(e.location || (e.field.id.startsWith("page") ? "page" : "global"), reply[0].id, "anon", "template", "<span id='template'></span>", "template", true);
    var template = document.getElementById("template").parentNode.parentNode;
    if(e.element) template.parentNode.insertBefore(template, e.element);
    template.outerHTML = reply[0].element.outerHTML;
    var finalReply = [...elm[(e.message ? e.location : e.field.id.startsWith("page") ? "page" : "global")+"_chatfield"].children].filter(x => x.outerHTML == reply[0].element.outerHTML);
    [...[...finalReply].at(-1).children].forEach(y => {y.style.fontSize = "10px"; y.id = ""});
    return finalReply;
};

w.on("chatmod", function(e){
    var field = e.location == "page" ? "Page" : "Global";
    e.replyOfMessage = findReply(e);
    if(e.replyOfMessage){
        e.message = e.message.replace(/reply\(\d+\) /, "");
    };
    setTimeout(function(){
        if(!e.id) return;
        var div = window["chatRecords" + field].filter(x=>x.date == e.date && x.id == e.id)[0].element;
        var matchLink = [...div.children].at(-1).innerHTML.match(/link\(.+\) /);
        if(matchLink){
            [...div.children].at(-1).outerHTML = `<a> </a><a style="color: #0070E0"><u>${[...div.children].at(-1).innerHTML.replace(/link\(.+\) /, "").substring(6)}</u></a>`;
            [...div.children].at(-1).href=matchLink[0].substring(5,matchLink[0].length-2);
            return;
        };
        var string = [...div.children].at(-1).children.length ? [...div.children].at(-1).children[0].innerHTML : [...div.children].at(-1).innerHTML;
        var hexValues = string.match(/#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)/g);
        var stringSpan = "<span>" + (string.split(/#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)/g).join`</span><span style="color: ">` + "</span>");
        if(hexValues){
            hexValues.forEach(x => stringSpan = stringSpan.replace(/<span style="color: ">/, `<span style="color: ${x}">`));
            if(stringSpan.startsWith("<span>&gt;")) return;
            [...div.children].at(-1).outerHTML = stringSpan;
        };
        div.onclick = function(x){
            if(!x.shiftKey) return;
            div.remove();
            if(!e.replyOfMessage) return;
            e.replyOfMessage.remove();
        };
        [...div.children].forEach(function(i){
            i.onclick = function(x){
                if(x.ctrlKey){
                    elm.chatbar.value = "reply(" + e.date + ") ";
                    elm.chatbar.focus();
                };
            };
        });
    });
    if(hasDoneAction) return;
    hasDoneAction = true;
    [...chatRecordsPage, ...chatRecordsGlobal].forEach(function(e){
        var field = e.location == "page" ? "Page" : "Global";
        e.replyOfMessage = findReply(e);
        if(e.replyOfMessage){
            [...e.element.children].at(-1).innerHTML = [...e.element.children].at(-1).innerHTML.replace(/reply\(\d+\) /, "");
        };
        var matchLink = [...e.element.children].at(-1).innerHTML.match(/link\(.+\) /);
        if(matchLink){
            [...e.element.children].at(-1).outerHTML = `<a> </a><a href=${matchLink[0].substring(5,matchLink[0].length-2)} style="color: #0070E0"><u>${[...e.element.children].at(-1).innerHTML.replace(/link\(.+\) /, "").substring(6)}</u></a>`;
            return;
        };
        var string = [...e.element.children].at(-1).innerHTML;
        var hexValues = string.match(/#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)/g);
        var stringSpan = "<span>" + (string.split(/#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)/g).join`</span><span style="color: ">` + "</span>");
        if(hexValues){
            hexValues.forEach(x => stringSpan = stringSpan.replace(/<span style="color: ">/, `<span style="color: ${x}">`));
            if(stringSpan.startsWith('<span>&nbsp;<span style="color: </span><span style="color: #789922">">&gt;')) return;
            [...e.element.children].at(-1).outerHTML = stringSpan;
        };
    });
    [...chatRecordsPage, ...chatRecordsGlobal].forEach(function(x){
        x.element.onclick = function(e){
            if(e.shiftKey) x.element.remove();
        };
        [...x.element.children].forEach(function(i){
            i.onclick = function(e){
            if(e.ctrlKey){
                elm.chatbar.value = "reply(" + x.date + ") ";
                elm.chatbar.focus();
            };
            };
        });
    });
});