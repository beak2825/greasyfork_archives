// ==UserScript==
// @name         Server Browser NI
// @namespace    -
// @version      1.1
// @description  Server Browser in-dev for NI website
// @author       Kaasovic
// @match        http://mimir.nordinvasion.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16101/Server%20Browser%20NI.user.js
// @updateURL https://update.greasyfork.org/scripts/16101/Server%20Browser%20NI.meta.js
// ==/UserScript==

var url = window.location.href;
var servers = [];

$(document).ready(function () {
    $('#nav ul li:first').append('<ul><li><a href="/character.php?mode=ServerBrowser">Server Browser</a></li></ul>'); //Link to the server browser in the nav bar
        if (url.match(/\/character\.php\?mode=ServerBrowser/)) {
        $('#contents_body').empty(); //clear all of the elements in the container 

        //adding a return button
        var returnbutton = document.createElement('button'); 
        returnbutton.innerHTML = 'Exit Server Browser';
        returnbutton.setAttribute("class","minimal w100");
        returnbutton.setAttribute("style","margin-right: 20px;");
        returnbutton.setAttribute("type","button");
        returnbutton.setAttribute("position","absolute");
        returnbutton.onclick = function () {
            window.history.back(); //go back 1 page
        };
        $('#contents_body').append(returnbutton); //adding button to the page

        //begin retrieving the server list at nordinvasion.com/server-links.html
        $.ajax({
            url: 'https://nordinvasion.com/server-links.html', //Pass URL here 
            type: "GET", //Also use GET method
            success: function (data) {
                //get Server info 
                jQuery('#contents_body').append("<div class='primary-class-trees' style='height:auto; width:auto; margin: 20px; padding: 20px;' id='servers'><div id='normal'><h3>Normal Servers:</h3><div class='seperator'></div></div><div id='hard'><h3>Hard Servers:</h3><div class='seperator'></div></div><div id='ragnarok'><h3>Ragnarok Servers:</h3><div class='seperator'></div></div><div id='cavalry'><h3>Cavalry Servers:</h3><div class='seperator'></div></div><div id='beginner'><h3>Beginner Servers:</h3><div class='seperator'></div></div><div id='other'><h3>Other Servers:</h3><div class='seperator'></div></div></div>");

                jQuery($(data).find('a')).each(function () {
                    servers.push($(this).attr('href')); //add server link to array
                    //checking difficulty
                    if($(this).text().indexOf("Normal") >= 0)
                    {
                        jQuery('#normal').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                    else if($(this).text().indexOf("Hard") >= 0)
                    {
                        jQuery('#hard').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                    else if($(this).text().indexOf("Ragnarok") >= 0)
                    {
                        jQuery('#ragnarok').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                    else if($(this).text().indexOf("Cavalry") >= 0)
                    {
                        jQuery('#cavalry').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                    else if($(this).text().indexOf("Beginner") >= 0)
                    {
                        jQuery('#beginner').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                    else
                    {
                        jQuery('#other').append("<div class='class-tree' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                    }
                });
                //refreshing stats every 2000ms 
                setInterval(function () {
                    for (var i = 0; i < servers.length; i++){
                        LoadServerData(servers[i]);
                    }                   
                }, 2000);
            }
        });
    }
});

function LoadServerData(link) {
    $.ajax({
        url: link, //Pass URL here 
        type: "GET", //Also use GET method
        success: function (serverdata) { //using xml parser to retrieve xml data
            var xml = serverdata,
                xmlDoc = $.parseXML( xml ),
                $xml = $( xmlDoc ),
                $servername = $xml.find( "Name" ),
                $players = $xml.find( "NumberOfActivePlayers" ),
                $maxplayers = $xml.find( "MaxNumberOfPlayers" ),
                $mapname = $xml.find( "MapName" );

            //updating the divs with new data
            document.getElementById(link).innerHTML = "<table style='height:190px; width:190px;'><tr><td><h3>"+$servername.text()+"</h3></td></tr><tr><td>Map: <b>"+$mapname.text()+"</b></td></tr><tr><td><progress value='"+$players.text()+"' max='"+$maxplayers.text()+"'></progress></br>"+$players.text()+"/"+$maxplayers.text()+" players</td></tr></table>";
        },
        error: function (ajaxContext) {
            //if the ajax request failes, add a empty server with the name error
            document.getElementById(link).innerHTML = "<table style='height:190px; width:190px;'><tr><td><h3>Error</h3></td></tr><tr><td>---</td></tr><tr><td>---</td></tr></table>";
        }
    });
}