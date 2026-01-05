// ==UserScript==
// @name         Wazeopedia false extlinks checker
// @namespace    http://wiki.waze.com/User:Biuick84/
// @version      0.1
// @description  Checks whether an internal link is wrongly referenced as external
// @author       biuick84
// @match        https://wiki.waze.com/wiki/api.php?format=json&action=query&prop=extlinks&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10852/Wazeopedia%20false%20extlinks%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/10852/Wazeopedia%20false%20extlinks%20checker.meta.js
// ==/UserScript==

function WazeopediaLinks_bootstrap()
{
    var xmlDoc;
    var patt = new RegExp("waze.com.*wiki");
    var printed=false;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",window.location.href,true);
    xmlhttp.onreadystatechange=function() 
        {
        if (xmlhttp.readyState==4) 
            {
            if (xmlhttp.status == 200) 
                {                   
                    xmlDoc = xmlhttp.responseText;
                    var teste = JSON.parse(xmlDoc);
                    for (var page in teste.query.pages)
                    {
                        printed=false;
                        for (var link in teste.query.pages[page].extlinks)
                        {
                            if (patt.test(teste.query.pages[page].extlinks[link]["*"]))
                            {
                                if (!printed) document.write('<a href="http://wiki.waze.com/wiki/' + teste.query.pages[page].title + '">' + teste.query.pages[page].title + '</a><br />');
                                document.write("<li>"+teste.query.pages[page].extlinks[link]["*"]+'</li>');
                                printed=true;
                            }
                        }
                    }
                }
            else
                {
                    alert("Error" + xmlhttp.statusText);
                }
        }
    }
    xmlhttp.send();
}


setTimeout(WazeopediaLinks_bootstrap,3000);