// ==UserScript==
// @name         Board Formatting
// @namespace    http://www.hacker-project.com/
// @version      1.3
// @description  Adds formatting for the code board
// @author       Kevin Mitnick
// @match        http://www.hacker-project.com/index.php?action=group*
// @match        http://hacker-project.com/index.php?action=group*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11018/Board%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/11018/Board%20Formatting.meta.js
// ==/UserScript==

function main() {
    
    // DEFINE YOUR NICKNAMES HERE
    var nns = [
        // FOR MASS NOTIFICATION, DO NOT CHANGE
        "all",
        
        // YOUR OWN NICKNAMES
        "your",
        "nicknames",
        "here"
    ];
    
    var username;
    var servers = document.getElementsByName("g_id")[0].getElementsByTagName("option");
    var firsttext = servers[0].innerHTML;
    var ind = firsttext.indexOf("'s");
    if (ind>-1) username=firsttext.substring(0, ind);
    
    var alltd = document.getElementsByTagName("fieldset")[0];
    if (new String(document.location.href).indexOf("&a2=leader")<0 && new String(document.location.href).indexOf("&a3=edit_post")<0) process(alltd);
    var numMessages;
    var as = document.getElementsByTagName("a");
    for (var i = 0; i < as.length; i++) if (as[i].href.indexOf("index.php?action=group")>-1) {
        if (as[i].innerHTML.indexOf("(")>-1) {
            numMessages = parseInt(as[i].innerHTML.substring(as[i].innerHTML.indexOf("(")+4, as[i].innerHTML.indexOf(")")-3));
            break;
        } 
        else {
            numMessages = 0;
            break;
        }
    }
    if (new String(document.location.href).indexOf("&a3=new_post")>-1) numMessages++;
    for (var x = 0; x < document.getElementsByClassName("emi8").length; x++) {
        var msgtd = document.getElementsByClassName("emi8")[x];
        if (x<numMessages) msgtd.style.backgroundColor="#4C4C00";
        for (var nni = 0; nni < nns.length; nni++) {
            var nn = nns[nni];
            if (msgtd.innerHTML.indexOf("@"+nn)>-1) msgtd.style.backgroundColor="#4C4C00";
        }
        if (username !== null && msgtd.innerHTML.indexOf(username)>-1) msgtd.style.backgroundColor="#4C4C00";
    }
}
function process(el) {
    var val = el.innerHTML;
    
    // XSS
    while (val.indexOf("[[")>-1) val = val.replace("[[", "<");
    while (val.indexOf("]]")>-1) val = val.replace("]]", ">");
    while (val.indexOf("blocked")>-1) val = val.replace("blocked", "script");
    el.innerHTML = val;
    
    var startingPoint = 0;
    while (val.indexOf("http", startingPoint)>-1) {
        startingPoint = val.indexOf("http", startingPoint);
        if (val.substring(startingPoint-2, startingPoint)=="l:") {
            var nextSpaceIndex = Math.min(val.indexOf("<", startingPoint), val.indexOf(" ", startingPoint));
            var href = val.substring(startingPoint, nextSpaceIndex);
            console.log(href);
            var first = val.substring(0, startingPoint), last = val.substring(nextSpaceIndex, val.length);
            var link = "<a href='"+href+"' target='_blank'>"+href+"</a>";
            console.log(link);
            el.innerHTML = first.substring(0, first.length-2)+link+last;
            val = el.innerHTML;
            startingPoint = val.indexOf(link)+link.length;
        }
        else startingPoint++;
    }
    
    var sar = [
        ["&gt;:)", "https://twemoji.maxcdn.com/72x72/1f608.png"],
        ["&gt;:d", "https://twemoji.maxcdn.com/72x72/1f608.png"],
        [":)", "https://twemoji.maxcdn.com/72x72/1f600.png"],
        ["xd", "https://twemoji.maxcdn.com/72x72/1f600.png"],
        [":|", "https://twemoji.maxcdn.com/72x72/1f610.png"],
        [":o", "https://twemoji.maxcdn.com/72x72/1f62e.png"],
        [":(", "https://twemoji.maxcdn.com/72x72/1f615.png"],
        [":d", "https://twemoji.maxcdn.com/72x72/1f603.png"],
        ["d:", "https://twemoji.maxcdn.com/72x72/1f627.png"],
        [";(", "https://twemoji.maxcdn.com/72x72/1f62a.png"],
        [":'(", "https://twemoji.maxcdn.com/72x72/1f62a.png"],
        [":p", "https://twemoji.maxcdn.com/72x72/1f61b.png"],
        [";p", "https://twemoji.maxcdn.com/72x72/1f60b.png"],
        [";)", "https://twemoji.maxcdn.com/72x72/1f609.png"]
    ];
    
    for (var sari = 0; sari < sar.length; sari++) {
        var sa = sar[sari];
        var s = sa[0];
        var addr = sa[1];
        var lastPos = 0-s.length;
        while (val.toLowerCase().indexOf(s, lastPos+s.length)>-1) {
            lastPos = val.toLowerCase().indexOf(s, lastPos+s.length);
            var first2 = val.substring(0, val.toLowerCase().indexOf(s));
            var last2 = val.substring(val.toLowerCase().indexOf(s)+s.length, val.length);
            if (first2.indexOf(" ", first2.length-1)>-1 || last2.substring(0, 1).indexOf(" ")>-1)el.innerHTML = first2+"<img src='"+addr+"' width='16px' style='position: relative; top: 3px;'/>"+last2;
            val = el.innerHTML;
        }
    }  
}

main();