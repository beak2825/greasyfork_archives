// ==UserScript==
// @name       Ingame-Alliance
// @include    http*://forum.fussballcup.de*
// @version    0.1.5
// @description  Zeigt Statistiken über die eigene Mannschaft auf der Foren Seite
// @copyright  Klaid, 2013 edited by mot33, 2020
// @connect      fussballcup.de
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @require     http://code.jquery.com/jquery-1.10.2.min.js
// @require     http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @exclude     https://forum.fussballcup.de/newattachment.php*
// @exclude     https://forum.fussballcup.de/inlinemod.php*
// @exclude     https://forum.fussballcup.de/login.php*
// @resource    jqUI_CSS  http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css
// @resource    IconSet1  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_222222_256x240.png
// @resource    IconSet2  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_454545_256x240.png
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30514/Ingame-Alliance.user.js
// @updateURL https://update.greasyfork.org/scripts/30514/Ingame-Alliance.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var iconSet1    = GM_getResourceURL ("IconSet1");
var iconSet2    = GM_getResourceURL ("IconSet2");
var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");
jqUI_CssSrc     = jqUI_CssSrc.replace (/url\(images\/ui\-bg_.*00\.png\)/g, "");
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_222222_256x240\.png/g, iconSet1);
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_454545_256x240\.png/g, iconSet2);

GM_addStyle (jqUI_CssSrc);

var vorhanden = 0;
var einladung = 0;
var call = 0;
var jetzt = new Date();
function firstUse()
{
    if(!GM_getValue('Forum_Greeting02'))
    {
        document.getElementsByTagName("body")[0].innerHTML += " <div id=\"dialog\" title=\"Forum Looker v0.1\"><p>Vielen Dank für die Installation von diesem Tool, welche nun erfolgreich abgeschlossen wurde.</p><p> Dieses Tool wird versuchen das Spiel mit dem Forum ein wenig zu verknüpfen. Anregungen und Ideen können jederzeit im passenden Thread gestellt werden.</p><p>Viel Spaß mit dem Tool wünscht:<br>mot33</p></div>";
        $( "#dialog" ).dialog({
            modal: true,
            width: 500,
            height: 250,
            show: {
                effect: "blind",
                duration: 2000
            },
            hide: {
                effect: "explode",
                duration: 2000
            }
        });
        GM_setValue('Forum_Greeting02', true);
    }
}
function outputFreundschaftsspiele()
{
    call++;
    if(call == 2)
    {
        document.getElementById("f90").innerHTML += "<div class='smallfont' style='margin-top:6px'><strong><font color='green'>Freie Tage:</font> "+ (vorhanden + einladung) +"</strong> (Davon an <font color='#B2C92A'>"+(einladung)+" Tagen</font> vorhandene Einladung)</div>";
        
    }
}
function getFreundschaftsspiele()
{
    
    var month = (jetzt.getMonth()+2);
    var year = jetzt.getFullYear();
    if(month == 13)
    {
        month = 1;
        year +=1;
    }
    
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://fussballcup.de/index.php?w=301&area=user&module=Calendar&action=friendly&complex=0&squad=&club=",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(responseDetails){
            var inhalt = responseDetails.responseText;
            vorhanden += (inhalt.split("tt_dayFree\"").length-2);
            einladung += (inhalt.split("selectable invitation").length-1);
            if(inhalt.indexOf("Du wurdest ausgeloggt") == -1)
            {
                outputFreundschaftsspiele();
            }
        }	
    });
    
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://fussballcup.de/index.php?w=301&area=user&module=Calendar&action=friendly&complex=0&m="+ month +"&y="+ year +"&squad=0&club=",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(responseDetails){
            var inhalt = responseDetails.responseText;
            vorhanden += (inhalt.split("tt_dayFree\"").length-2);
            einladung += (inhalt.split("selectable invitation").length-1);
            outputFreundschaftsspiele();
        }	
    });
    
}

function createHeader()
{
    document.getElementsByTagName("table")[0].getElementsByTagName("td")[1].style.color = "snow";
    document.getElementsByTagName("table")[0].getElementsByTagName("td")[1].vAlign = "top";
    document.getElementsByTagName("table")[0].getElementsByTagName("td")[1].align = "right";
    document.getElementsByTagName("table")[0].getElementsByTagName("td")[1].innerHTML = "<div id='tool_header' style='display: block; height: 75px; margin-right: 10px;'></div>";
    
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://fussballcup.de/index.php?w=301&area=user&module=main&action=home&_=",
        headers: {"Content-Type": "application/x-www-form-urlencoded" ,
                  'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
                  'Accept': 'application/atom+xml,application/xml,text/xml', },
        onload: function(responseDetails){           
            var inhalt = document.implementation.createHTMLDocument("");
            
            inhalt.documentElement.innerHTML = responseDetails.responseText;
            var name = inhalt.getElementsByClassName("self-link");
            var geld = inhalt.getElementsByClassName("currency-number");
            var credits = inhalt.getElementsByClassName("credits-number");
            if(name[0] && geld[0])
            {
                document.getElementById("tool_header").innerHTML += "<div id='tool_ani' style='display: none;'><div id='tool_box' style='display:inline-block; text-align: left; opacity:0.95; filter:alpha(opacity=95); border-bottom-right-radius: 10px;border-bottom-left-radius: 10px; margin-left: 10px; height: 100%; border: 1px solid #93C971; border-top:0px; background-color:#DAEAD0; color: black; padding: 5px; width: 250px;'><div style='display: block; font-weight: bold; font-size: 1.1em; border-bottom: 1px solid black;' id='tool_verein_name'>"+name[0].innerHTML+"</div><br><span style='display: inline-block; width:55px;'>Kasse:</span> "+geld[0].innerHTML+" €</div></div>";       
                
                if(credits[0].innerHTML > 0)
                {
                    document.getElementById("tool_box").innerHTML += "<br><span style='display: inline-block; width:55px;'>Credits:</span> "+credits[0].innerHTML;
                }
                
                $( "#tool_ani" ).show( 500 );
                $(function() {
                    $( "#tool_ani" ).tooltip({
                        track: true
                    });
                });
                
                var simu = inhalt.getElementById("simulation-invitations-counter");
                var Std = jetzt.getHours();
                var Min = jetzt.getMinutes();
                if(((Std == "13" || Std == "18") && Min < 11) || simu)
                {
                    var title = "Spielzeit";
                    if(simu)
                    {
                        if(simu.innerHTML == 1)
                        {
                            title = "Eine neue Simueinladung";
                        }
                        else
                        {
                            title = simu.innerHTML+" neue Simueinladungen";
                        }
                    }
                    else if(Std == "13")
                    {
                        title = "Turnierspiel läuft";
                    }
                        else if(Std == "18")
                        {
                            title = "Ligaspiel läuft";
                        }
                        document.getElementById("tool_verein_name").innerHTML += "<img src='https://abload.de/img/socceruuu1w.png' alt='ingame-Mail' height='20px' width='23px' style='margin-left: 5px;' title='"+ title +"'>";
                }
                
            }
            
        }	
    });
    
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://fussballcup.de/index.php?w=301&area=user&module=formation&action=index&_=*&path=index.php&layout=none",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(responseDetails){
            var inhalt = responseDetails.responseText;
            var for_count = inhalt.indexOf('Ungelesene Nachrichten');
            if(for_count != -1)
            {
                document.getElementById("tool_verein_name").innerHTML += "<a href='https://fussballcup.de/#/index.php?w=301&area=user&module=mail&action=index&_=1384196361' target='_blank'><img src='https://abload.de/img/icon-1332772_640jjuxp.png' alt='ingame-Mail' height='20px' width='31px' style='margin-left: 5px;' title='Ungelesene Nachricht' border='0'></a>";
                // document.getElementById("tool_header").innerHTML += "<div style='display:inline-block; opacity:0.95; text-align: left;border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; filter:alpha(opacity=95); margin-left: 10px; height: 100%; border: 1px solid #93C971; border-top: 0px; background-color:#DAEAD0; color: black; padding: 5px; width: 150px;'><a href='https://fussballcup.de/#/index.php?w=301&area=user&module=mail&action=index&_=1384196361' target='_blank'>Du hast ungelesene Nachrichten in deinem Postkasten!</a></div>";
            }
        }	
    });
}
function changeLayout()
{
    document.getElementById("f47").getElementsByTagName("div")[2].getElementsByTagName("a")[1].style.fontSize="1.3em";
}

firstUse();
createHeader();
getFreundschaftsspiele();
changeLayout();