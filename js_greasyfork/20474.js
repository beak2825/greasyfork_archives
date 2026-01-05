// ==UserScript==
// @name            Unified Forum Identifier
// @namespace       http://matthewammann.com
// @description     Unified identifier in the forums.
// @version         1.02
// @date            06/10/16
// @author          adv0catus & Ruudiluca
// @include         *://www.kongregate.com/forums/*
// @downloadURL https://update.greasyfork.org/scripts/20474/Unified%20Forum%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/20474/Unified%20Forum%20Identifier.meta.js
// ==/UserScript==
 
// Original script by arcaneCoder and updated by musicdemon. Repurposed by adv0catus and Ruudiluca.

/* Created by arcaneCoder - www.kongregate.com/accounts/arcaneCoder
Leave these headers intact if you modify this script.*/
 
var pattn = new RegExp ( "-row$" );
var elem = document.getElementsByTagName ( "tr" );
var nameSave    = new Array ( elem.length );
var table;

function update ()


/* Community Administrators */

{
    var img = "data:image/gif;base64,R0lGODlhDQALADAOACH5BAEAAA4ALAAAAAANAAsAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAhCAP0IHEiwoEE/hQr22reP18J97gzSo5cQYsKCytwVojfsoB930BheNDhsX6F2+zxORLivY0FeDHvB3EfPo82bAgMCADs=";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Community Administrators in alphabetical order:
           
            var arr = ["IAmTheCandyman", "JohannasGarden", "PumpkinBrigade", "SugarMonkey", "trickyrodent", "QueentakesRook"];
            if(arr.indexOf(username) > -1) {
                //alert("Community Administrator found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Community Administrator</p>";
            }
        }
    }
}

/* Quality Assurance Administrators */

{
    var img = "data:image/gif;base64,R0lGODlhDQALADAOACH5BAEAAA4ALAAAAAANAAsAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAhCAP0IHEiwoEE/hQr22reP18J97gzSo5cQYsKCytwVojfsoB930BheNDhsX6F2+zxORLivY0FeDHvB3EfPo82bAgMCADs=";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Quality Assurance Administrators in alphabetical order:
           
            var arr = ["Dreamjuice", "jclor", "joe1017", "NanaYeah"];
            if(arr.indexOf(username) > -1) {
                //alert("Quality Assurance Administrator found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Quality Assurance</p>";
            }
        }
    }
}

/* Global Moderators */

{
    var img = "data:image/png;base64,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";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames of the remaining Global Moderators in alphabetical order:
           
            var arr = ["Akasharoo", "Alcari", "AlisonH", "Allen42", "ApprenticeChief", "awalters", "Bob10110", "Cylomar", "diabolotry", "Dvice", "Everlovely", "Felednis", "fgfgfg", "Flippy1988", "frankiesmum", "FrozenCereal", "Gevock", "Granvieja", "Grimok", "Hellraiser1977", "Iamnotamod", "Imbulletproof", "JesseMH8", "jimmy_taynor", "kaosfury", "Keckers", "Kikicoops", "KiwiBob", "lockman", "LoonyLizard", "meppz", "MeMe44", "morgoth1", "Mr_Gulible", "MrGravy", "mykexyyz", "Noisebot", "Olimm", "Peacefrog", "Planktos", "Rachiface", "Ravennka", "RemoWilliams", "Rockefelon", "resterman", "Satanfisken", "septic", "Sir_Fratley", "stanwise", "strawberry777", "SquareOne", "tkkttony", "Toa_of_Pi", "Tsuppo", "Twoam", "uzzbuzz", "Valmoer", "VforVendetta", "Vorpal_Steak", "Welder", "whiskerchu", "xela248", "Zerakil", "Zil_"];
            if(arr.indexOf(username) > -1) {
                //alert("Global Moderator found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Global Moderator</p>";
            }
        }
    }
}

/* Room Owners */

{
    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAC5SURBVChTY7xe7fSfgUTABKVJAixQGgxEXeIYhB3iwexfv34x/Hj2hOHnp08Mnw/NZfj14hpYHARQbPp45QzD70/vwOwns4oZfj84zCCqZ8Ag4lMIFoMBFE0g076/+wBngwzBBnD6STisl0E2rhHszDdb+qGiEIBTE8gfrHxCDB9vXEPxDwigaGKT0GJg5WYEs0EKX1+6APYTKICQAYomfh0TBk5RRTAbpBBkGwiAQhRkIAzQK3IZGACdwkSoEOrgNwAAAABJRU5ErkJggg==";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Room Owners in alphabetical order:
           
            var arr = ["95Romaalleb96", "AerohillB", "arnoc", "Ayrus", "BaconMaster93", "Beckyweck", "blackchips", "BlueFox57", "Borjoize", "calarooni", "Catguy", "Cavalaria", "CheshireHalli", "Cidy5", "coolepronkie", "CowFriend", "Crinkle", "Cubicon", "Cylomar", "Dacister", "Dagny16", "darkkillerman", "deepestpassion", "Destan", "donteatglue1", "Dr_G_Sto", "dragonewyn", "Entheomancer", "epeen", "Executioner", "Falcon_", "fgfgfg", "Frankiesmum", "FrozenCereal", "Granvieja", "Grimnok", "Guidoido", "Gwenhwyfar", "Haecceitas", "hbic", "HellTemplar", "hothot12", "JakeInTheBox", "JamieWolfyCook", "jimmy_raynor", "joebob23", "jukka979", "kfsw", "kikicoops", "KiwiBob", "Klatu", "Kology", "laxvio", "lockman", "LoonyLizard", "MadWilly", "MeMe44", "meppz", "moorsy", "Mr_Gulible", "MrNewsman", "NieDeiCieli", "nitetrooper93", "NOMADE", "OneBurntWitch", "OneToughChick", "OneOfThose", "Papouk", "pausey", "piepje28", "piperjean99", "Planktos", "PraetorianGuard", "Precarious", "PsichoGhost", "Psykotix", "radur", "Rajesh1999", "Revennka", "resterman", "Rockefelon", "Shawdon666", "ShikuOkami", "ShortPigen", "SinkTheBismarck", "SirButcher", "Sir_Fratley", "Sirago", "SJOKER", "Skullbat1", "Tarantulka", "Toa_of_Pi", "tSteve", "Twoam", "UltimateChaos", "valrossen", "VforVendetta", "Vorpal_Steak", "Welder", "xela248", "Yelhsa", "Yllib", "Zil_"];
            if(arr.indexOf(username) > -1) {
                //alert("Room Owner found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Room Owner</p>";
            }
        }
    }
}

/* Game Jam #1 participants */

{
    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACySURBVChTYzRNn/6fgUTABKVJAixQGgyi7XUY8iNtoDwGhldv3jNcvP+WYdHaEww3P3yBiqLZtPPgHYYb9z+AcW7rFoblu68yWGhJM1Sn+0BVQACKpjcMPxi+fP8OxicfP2FYevAKw/aTVxk0FAUY1AV4oKqI8NPzlz/AtACvAJgGAaID4sPnD1AWDk08nJxg53jqCjNEumqD/YgcECjxhB56n79+Zzhx7SlG6NErchkYAAnESBrRqfoJAAAAAElFTkSuQmCC";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Game Jam #1 participants in alphabetical order:
           
            var arr = ["0rava", "1ashl", "aaronsantiago", "AIexT", "agusmao", "Aldrinsalazar", "aptriangle", "ArsenG1", "ArtsFox", "BrainyBeard", "Cal010", "cathelper", "chesster415", "ClausGahrn", "CrazyDinoGames", "CreativeTurtle", "DaBarr", "DeanFarrington", "DonM83", "duolon", "Dynamo21", "egyszervolt", "Fleecemaster", "gblim", "GeanieGames", "HeynongMan", "Holy2334", "JamsRamen", "jeagle747", "jcourt", "JTtheLlama", "JurgisT", "Kasmilus", "Meerkatjie", "moraleszez", "MossyStump", "Ohbye", "Palups", "PlayerOfRPG", "PxlPaladin", "Pio6", "say892", "SCLT", "Shay9999", "silentviper", "simpleicarus", "takosman3", "TheIjzm", "ThePenguin11", "Toa_of_Pi", "totoyan", "uzzbuzz", "Vhalkar7", "yvolcano4"];
            if(arr.indexOf(username) > -1) {
                //alert("Game Jam #1 participant found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Game Jam #1</p>";
            }
        }
    }
}

/* Spam Wranglers */

{
    var img = "data:image/gif;base64,R0lGODlhDQALAEAQACH5BAEAABAALAAAAAANAAsAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAhRAGvV2iVwYEGCAnftajeMoUNeBBHum6hv4r52B2sJ20dP4MZhEQXy4rhrn7B2EBNqtLhPpcFaI+ltNIiQ4MaOL0OOnEivZsGBDofRHBrSZ62AADs=";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Spam Wranglers in alphabetical order:
           
            var arr = ["Bluji"];
            if(arr.indexOf(username) > -1) {
                //alert("Spam Wrangler found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Spam Wrangler</p>";
            }
        }
    }
} 
update();