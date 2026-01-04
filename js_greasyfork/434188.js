// ==UserScript==
// @name         Special Claims - Quick Tickets
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Provides a button to the QuickLink in the KBs
// @author       You
// @match        https://intranet.netfor.net/*
// @match        https://intranet.netfor.com/*
// @icon         https://www.google.com/s2/favicons?domain=netfor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434188/Special%20Claims%20-%20Quick%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/434188/Special%20Claims%20-%20Quick%20Tickets.meta.js
// ==/UserScript==

var toolbarhtml = '<table><tbody><tr><td id="ticketQuickLinks" style="padding-right: 10px;"></td><td id="nameSearch"><span class="spacer" style="float: right">&nbsp;</span><span class="title" :="" style="font-size:16px!important;margin-left:0"><b>Ticket History</b></span></td><td id="searchHistory"><ul class="horizontalUL formelement" id="ContactID.wrapper" title=""><li class="textentry"><input type="text" id="historyName"></li><li class="buttonType_History buttonState_Normal buttonStyle" id="historyBtn" button:onclick=""></li><li class="buttonType_Endcap buttonState_Normal"></li></ul></td></tr></tbody></table><div id="TableHistory"> </div>'

var toolbar = document.createElement('div');
toolbar.classname = "toolbar noprint";
toolbar.style.paddingTop = '5px';
toolbar.innerHTML = toolbarhtml;


var divQuickTickets = document.createElement('div');
divQuickTickets.classname = "toolbar noprint";
var buttons = "<span class='title' style='font-size:16px!important;margin-left:10px'><b>Quick Ticket Links:</b></span><button id='orderEntry' style='margin-left:10px'>Order Entry</button><button id='orderEntryLost' style='margin-left:10px'>Lost Voucher Order Entry</button><button id='puaBackdate' style='margin-left:10px'>PUA Backdate</button>";
divQuickTickets.innerHTML = buttons;
document.getElementsByClassName("noprint")[0].append(toolbar);
document.getElementById("ticketQuickLinks").append(divQuickTickets);
document.getElementById("orderEntry").onclick = function(){
    var kb = new XMLHttpRequest();
    if (document.URL.search(".net/") == -1)
    {
        kb.open("GET", 'https://intranet.netfor.com/modules.php?name=Knowledge&file=article&CompCode=INDWD&article_id=39792', true);
    }
    else
    {
        kb.open("GET", 'https://intranet.netfor.net/modules.php?name=Knowledge&file=article&CompCode=INDWD&article_id=39792', true);
    }
    kb.send();
    kb.onreadystatechange = function() {
        if (kb.readyState == 4) {
            var link = new DOMParser().parseFromString(kb.responseText, 'text/html').querySelectorAll("ol ol li a")[2].href;
            window.location=link;
        }
    };
};
document.getElementById("orderEntryLost").onclick = function(){
    var kb = new XMLHttpRequest();
    if (document.URL.search(".net/") == -1)
    {
        kb.open("GET", 'https://intranet.netfor.com/modules.php?name=Knowledge&file=article&CompCode=&article_id=41195', true);
    }
    else
    {
        kb.open("GET", 'https://intranet.netfor.net/modules.php?name=Knowledge&file=article&CompCode=&article_id=41195', true);
    }
    kb.send();
    kb.onreadystatechange = function() {
        if (kb.readyState == 4) {
            var link = new DOMParser().parseFromString(kb.responseText, 'text/html').querySelectorAll("ol ol li a")[0].href;
            window.location=link;
        }
    };
};
document.getElementById("puaBackdate").onclick = function(){
    var kb = new XMLHttpRequest();
    if (document.URL.search(".net/") == -1)
    {
        kb.open("GET", 'https://intranet.netfor.com/modules.php?name=Knowledge&file=article&CompCode=INDWD&article_id=39792', true);
    }
    else
    {
        kb.open("GET", 'https://intranet.netfor.net/modules.php?name=Knowledge&file=article&CompCode=INDWD&article_id=39792', true);
    }
    kb.send();
    kb.onreadystatechange = function() {
        if (kb.readyState == 4) {
            var link = new DOMParser().parseFromString(kb.responseText, 'text/html').querySelectorAll("ol ol li a")[2].href;
            window.location=link;
        }
    };
};
document.getElementById("historyBtn").onclick = function(){
    var historyHTML = document.createElement('div');
    document.getElementById("TableHistory").innerHTML = "";
    var name = document.getElementById('historyName').value;
    var names, name2
    name = name.trim()
    getHistoryTable(name);
    if(name.includes(","))
    {
        names = name.split(",");
        name2 = names[1].trim() + " " + names[0].trim(); //first name last name
        getHistoryTable(name2);
    }
    else if(name.includes(" "))
    {
        names = name.split(" ");
        name2 = names[1].trim() + ", " + names[0].trim(); //last name, first name
        getHistoryTable(name2);
    }
}

function getHistoryTable(name)
{
    var history = new XMLHttpRequest();
    if (document.URL.search(".net/") == -1)
    {
        console.log("Geting .com")
        history.open("GET", 'https://intranet.netfor.com/modules.php?name=Tickets&file=history&type=Contact&CustID=&Contact=' + name + '&CompCode=INDWD&popup=true', true);
    }
    else
    {
        console.log("Geting .net")
        history.open("GET", 'https://intranet.netfor.net/modules.php?name=Tickets&file=history&type=Contact&CustID=&Contact=' + name + '&CompCode=INDWD&popup=true', true);
    }
    history.onreadystatechange = function() {
        if (history.readyState === 4) {
            var historyTable = new DOMParser().parseFromString(history.responseText, 'text/html').querySelector("table.results");
            document.querySelectorAll('table.results')[0]
            if(historyTable.querySelectorAll('tbody')[0].rows.length > 0)
            {
                document.getElementById("TableHistory").append(historyTable)
                getDates();
            }
        }
    };
    history.send();
}
window.getHistoryTable = function getHistoryTable(name, date = "")
{

    document.getElementById("TableHistory").innerHTML = "";
    var history = new XMLHttpRequest();
    if (document.URL.search(".net/") == -1)
    {
        console.log("Geting .com")
        history.open("GET", 'https://intranet.netfor.com/modules.php?name=Tickets&file=history&type=Contact&CustID=&Contact=' + name + '&CompCode=INDWD&popup=true', true);
    }
    else
    {
        console.log("Geting .net")
        history.open("GET", 'https://intranet.netfor.net/modules.php?name=Tickets&file=history&type=Contact&CustID=&Contact=' + name + '&CompCode=INDWD&popup=true', true);
    }
    history.onreadystatechange = function() {
        if (history.readyState === 4) {
            var historyTable = new DOMParser().parseFromString(history.responseText, 'text/html').querySelector("table.results");
            document.querySelectorAll('table.results')[0]
            if(historyTable.querySelectorAll('tbody')[0].rows.length > 0)
            {
                document.getElementById("TableHistory").append(historyTable)
                getDates();
            }
        }
    };
    history.send();
}

function getDates(date = "")
{
    let limit;
    if(document.querySelectorAll('tr.pointer').length > 15)
    {
        limit = 15
    }
    else
    {
        limit = document.querySelectorAll('tr.pointer').length
    }
    for (var i = 0; i < limit; i++) {
        let ticket = new XMLHttpRequest();
        if (document.URL.search(".net/") == -1)
        {
            console.log("Geting .com")
            ticket.open("GET", 'https://intranet.netfor.com/modules.php?name=Tickets&file=edit&CallID=' + document.querySelectorAll('tr.pointer')[i].cells[1].textContent);
        }
        else
        {
            console.log("Geting .net")
            ticket.open("GET", 'https://intranet.netfor.net/modules.php?name=Tickets&file=edit&CallID=' + document.querySelectorAll('tr.pointer')[i].cells[1].textContent);
        }
        ticket.onreadystatechange = (function(x) {
            return function() {
                if (ticket.readyState == 4 && ticket.status === 200) {
                    let html = new DOMParser().parseFromString(ticket.responseText, 'text/html');
                    try {
                        let historyTable = html.getElementById('Task_1').children[2].getElementsByClassName('textArea textAreaInstructions')[0].innerText.match('RECEIVED DATE: ?(.*)\n')[1];
                        document.querySelectorAll('tr.pointer')[x].cells[9].remove()
                        document.querySelectorAll('tr.pointer')[x].cells[0].innerHTML = historyTable;
                    }
                    catch
                    {
                        document.querySelectorAll('tr.pointer')[x].cells[9].remove()
                        document.querySelectorAll('tr.pointer')[x].cells[0].innerHTML = "No Date";
                    }
                    try
                    {
                        let taskTable = html.querySelectorAll('table.newresults tbody')[html.querySelectorAll('table.newresults tbody').length-1].querySelectorAll('tr.header th')[1].textContent;
                        document.querySelectorAll('tr.pointer')[x].cells[4].innerHTML = taskTable;
                    }
                    catch (error)
                    {
                        document.querySelectorAll('tr.pointer')[x].cells[4].innerHTML = error;
                    }
                }
            }
        })(i);
        ticket.send();
    }
}

