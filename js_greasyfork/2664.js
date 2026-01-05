// ==UserScript==
// @name        WolMenu2
// @namespace   www.userscript.org
// @include     http*://*.conquerclub.com*/game.php*
// @version     1
// @grant       none
// @description This is a private script to be used by me and me only. no one else is allowed to have it or would even want it. Placed on Greasyfork for backup purposes only so please don't try and install this.
// @downloadURL https://update.greasyfork.org/scripts/2664/WolMenu2.user.js
// @updateURL https://update.greasyfork.org/scripts/2664/WolMenu2.meta.js
// ==/UserScript==

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function saveTextAsFile(textToWrite,fileNameToSaveAs)
{
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function GameLogAnalyser()
{
    saveTextAsFile(makeGameXMLFile(),"snapshots.gla");
}

function ConvertGameLogToXML(gamelog)
//removes the <> elements within the game log and converts it into an xml freindly format.
{
    //replace all line breaks <br> with <line> xml formatting. each line of the game log has <br> at the end of it
    gamelog=gamelog.replace(/<br>/g,"</line><line>");
    gamelog=gamelog.substring(6);
    gamelog="<line>" + gamelog;     //put <line> at the begginging of first line
    gamelog=gamelog.substring(0,gamelog.length-13);  //remove <line> from the end 
    gamelog=gamelog.replace(/<\/span><span>/g,"");
    return gamelog;
}

function GetPlayers()
//function to make an xml string of players in the game and return it
//<players>
//  <player>
//    <player_id>989898</player_id>
//    <player_color>r</player_color>
//    <player_name>player1</player_name>
//  </player>
//  <player>
//    <player_id>898989</player_id>
//    <player_color>g</player_color>
//    <player_name>player2</player_name>
//  </player>
//  .....
//</players>
{
    var result = "<players>";
    for (var i = 1 ; i < 13 ; i++)
    {
        var eid = "player_rank_" + i;
        var elem = document.getElementById(eid);
        if (elem !== null) 
        {
            var playerName = elem.innerHTML.split("</span>")[1];
            var playerId = elem.getAttribute("href").split("=")[2];
            eid = "player_prefix_" + i;
            var elem2 = document.getElementById(eid);
            var playerCol;
            if (elem2 !== null) 
                playerCol = elem2.innerHTML.split(":")[0];
            eid = "player_eliminated_" + i;
            var elem3 = document.getElementById(eid);
            var eliminated = "N";
            if (elem3.getAttribute("class"))
                eliminated = "Y";   
                
            result += "<player>";
            result += "<player_id>" + playerId + "</player_id>";
            result += "<player_color>" + playerCol + "</player_color>";
            result += "<player_name>" + playerName + "</player_name>";
            result += "<eliminated>" + eliminated + "</eliminated>";
            result += "</player>";
        }
    }
    result += "</players>";
    return result;
}

function GetSnapshot()
{
    var snapshot = "<snapshot>";
    var elements = document.getElementsByTagName('script');
    for (var i=0; i<elements.length; i++)
    {
        var text = elements[i].textContent;
        if (text.indexOf("map = {") != -1)
            snapshot += text;
    }
    snapshot += "</snapshot>";
    return snapshot;
}

function GameTypeFromElement(text)
{
    var result = "";
    switch (text)
    {
        case "Standard":
            result = "1";
            break;
        case "Doubles":
            result = "2";
            break;
        case "Triples":
            result = "3";
            break;
        case "Quadruples":
            result = "4";
            break;
        case "Polymorphic (4)":
            result = "P4";
            break;
        case "Polymorphic (3)":
            result = "P3";
            break;
        case "Polymorphic (2)":
            result = "P2";
            break; 
        case "Terminator":
            result = "T";
            break;
        case "Assassin":
            result = "A";
            break;
    }
    return result;
}

function GetGameType()
{
    var text = "<game_type>";
    
    var elements = document.getElementsByTagName('a');
    for (var i=0; i<elements.length; i++)
    {
        var gametype = GameTypeFromElement(elements[i].textContent);
        if (gametype != "")
            text += gametype;
    }
    
    text += "</game_type>";
    return text;
}

function GetInitialTroops()
{
    var result = "auto";
    var IsManual = $('a[href="/public.php?mode=instructions3#manual"]');
    if (IsManual.length >0) result = "manual";
    return result;
}

function GetPlayerWaiting()
{
    var result;
    for (var i = 1 ; i < 13 ; i++)
    {
        var eid = "player_icon_" + i;
        var elem = document.getElementById(eid);
        if (elem !== null) 
        {
            if (elem.getAttribute("class") == "status_green")
            {
                result = i;
                break;
            }
        }
    }
    return result;                
}

        
function GetPlayedFirst()
//establish which player went first and return
//red = 1, green= 2, blue = 3
{
    var result;
    var gamelog = document.getElementById("log").innerHTML;
    var a = gamelog.indexOf("</span> received");
    var b = gamelog.indexOf("</span> missed");
    if ( (a == -1) && (b == -1) )
    {
        result = GetPlayerWaiting()
    }
    else
    {
        if ((a == -1) && (b != -1)) c = b;
        if ((a != -1) && (b == -1)) c = a;
        if ((a != -1) && (b != -1)) c = (a<b)?a:b;

        var i
        var done = false;
        for (i = c; !done; i--)
        {
            if (gamelog.substring(i,i+19) == "<span class=\"player")
            {
                result = gamelog.substring(i+19,i+21);
                if (result[1] == "\"")
                    result = result[0];
                done = true;
            }
            if (i == 0) done = true;
        }
    }
    return result;
}

function makeGameXMLFile()
//create an xml string containng game information
//<game>
//    <game_number>768257654</game_number>
//    <game_log>
//        <line>game log text</line>
//        <line>game log text</line>
//        .....e.t.c
//    </game_log>
//</game>  
{
    var text = "<game>";
    text += "<game_number>" + document.title.split(" ")[4] + "</game_number>";   //game number
    text += "<game_log>" + ConvertGameLogToXML(document.getElementById("log").innerHTML) + "</game_log>";   //game log
    text += GetPlayers();
    text += GetSnapshot();
    text += GetGameType();
    text += "<round_number>" + document.getElementById("round").textContent + "</round_number>";
    text += "<initial_troops>" + GetInitialTroops() + "</initial_troops>";
    text += "<play_first>" + GetPlayedFirst() + "</play_first>";
    text += "</game>";
    return text;
}

function GameAnalysis()
{
    saveTextAsFile(makeGameXMLFile(),"CCGameData.xml");
}

function TestFunction()
{
    document.cookie = "SnapshotTrigger=" + document.title.split(" ")[4];
    //saveTextAsFile(ConvertGameLogToXML(document.getElementById("log").innerHTML),"cctest.xml");
}

function TriggerSnapshot()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
{
    var wString = document.title.split(" ")[4] + "_" + GetPlayerNumber() + "_" +document.getElementById("round").textContent;
    saveTextAsFile(wString,"TriggerSnapshot.txt");
}    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
function GetPlayerNumber()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
{
    return "1";
}  

function TestFunction2()
{
    var snapshottrigger = document.cookie;     
    snapshottrigger = snapshottrigger.split("SnapshotTrigger=")[1]
    snapshottrigger = snapshottrigger.split(";")[0];
    alert(snapshottrigger);
}

var leftBar = document.getElementById("leftColumn");
if(leftBar) 
{
    var ul = leftBar.getElementsByTagName("ul");
    if (ul[0]) 
    {
        var gmMenu = document.createElement('div');
        gmMenu.id="Wmen";
        var html = "<h3><b>Wolt Menu</b></h3>";
        gmMenu.innerHTML = html;
        ul[0].parentNode.appendChild(gmMenu);
        ul = document.createElement('ul');
        ul.style.borderWidth = "1px 1px 0px 1px";
        ul.style.width = "151px";
        ul.innerHTML+= "<li><a id=\"gameanalysis\" href=\"javascript:void(0);\"><span>Game Analysis</span></a></li>";
        ul.innerHTML+= "<li><a id=\"snapshotTrigger\" href=\"javascript:void(0);\"><span>Snapshot</span></a></li>";
        ul.innerHTML+= "<li><a id=\"testing2\" href=\"javascript:void(0);\"><span>Tester2</span></a></li>";
        gmMenu.appendChild(ul);
        //var lump = 'http://www.conquerclub.com/forum/ucp.php?i=167';
        
        document.getElementById('gameanalysis').addEventListener("click", function() {GameAnalysis();});
        document.getElementById('snapshotTrigger').addEventListener("click", function() {TriggerSnapshot();});
        document.getElementById('testing2').addEventListener("click", function() {TestFunction2();});
    }
}