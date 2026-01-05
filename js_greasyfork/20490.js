// ==UserScript==
// @name            Forum Games Forum Identifier
// @namespace       http://matthewammann.com
// @description     Identifies Regulars and Guests in the forums.
// @version         1.02
// @date            06/10/16
// @author          adv0catus & Ruudiluca
// @include         *://www.kongregate.com/forums/36*/*
// @include			*://www.kongregate.com/forums/7099*/*
// @include			*://www.kongregate.com/forums/7100*/*
// @downloadURL https://update.greasyfork.org/scripts/20490/Forum%20Games%20Forum%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/20490/Forum%20Games%20Forum%20Identifier.meta.js
// ==/UserScript==
 
// Original script by arcaneCoder and updated by musicdemon. Repurposed by adv0catus and Ruudiluca.

/* Created by arcaneCoder - www.kongregate.com/accounts/arcaneCoder
Leave these headers intact if you modify this script.*/
 
var pattn = new RegExp ( "-row$" );
var elem = document.getElementsByTagName ( "tr" );
var nameSave    = new Array ( elem.length );
var table;

function update ()

/* Regulars */

{
    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFSSURBVChTfZGty8JQFMafjYFa7HaTzSwGwWoSTCYxrC1ps9tsNv+KFYd/gck2WFxUBHUbTHTzvPcc3QU/eH9wuB/PPXfPfWYcj0caDoewLAvX6xVEhHK5jFKphFqthlarhcFgANM0cblcILiuS2qQ6nQ61G63qdlsUr1e1/tc8/lc3Ud0Op0Inudp4ReO42h9s9lQmqbvTXme0/l8ltu4lB1pLHTbtunxeJCpFhr2XbynUqmgWq3C9/2XCnS7XdxuN1ivtbDdbqE+D8MwEEUR1us1lsulaNPpFP1+H8oJ3uz9ql6vJ5aYwvabPbYfxzHCMMRisZA9lS7G47HMNZ/pqSYpJggCra1WKwnqK/LP9JjJZKJ1hhP9t4nnTKHz+xjzfr+r9ZOn/hy5VADIsgzKmuzz+3a7HaxGo4HZbCaH+ADDkRckSYLRaIT9fi//6HA44A98lUz4InskLQAAAABJRU5ErkJggg==";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Regulars in alphabetical order:
           
            var arr = ["2Cents", "AAAAPPLE", "Aax5", "AbusedZebra", "AdeebNafees", "adv0catus", "afklol", "arkenarken", "back900", "BCLEGENDS", "Behemoth542", "BestMte", "blakzer", "Blood_Shadow", "BLOODYRAIN10001", "Bluji", "boomyfun", "Captain_Catface", "chesshawk", "cl0wn3r", "coolo2011", "Cowfriend", "CrimsonBlaze", "CYrusmaster", "Darkboy5846", "devourer359", "Distant_Tsunami", "djrockstar", "Dman18", "DoomlordKravoka", "DragonArcherZ", "dreamsdragon1998", "DrOctaganapus2", "Drovoxx", "EbilWulf", "EEESMAN2424", "ElLocoXII", "Ethyri", "Evancolem", "FelineForumer", "Firespread", "FlameFlight", "Fogfun", "funiax", "Gambi69", "gaminguru", "gammaflux", "gandalf5166", "Ganthro", "Gastly101", "Ghostreconz", "Glomple", "Gonkeymonkey", "GottaAskTheMan", "GotterakaThing", "hamuka", "HappyYay", "Helltank", "hero122", "Hyped", "ilovekirby12", "ilvon", "InfiniteExpanse", "its_a_alt", "JaumeBG", "jerenator", "Jimbo14", "Johanna_T", "Kadleon", "Kidudeman", "kilozombie", "King_Matt", "KingofLlamas", "kingzak13", "Knoob85687", "koopa112", "Kranix", "Lebossle", "lei_wulong", "LightningB017", "locks888", "LouWeed", "magik98", "MaistlinRajere", "Marh", "MasterCheif987", "Mebomb", "Minnakht", "Morrrr", "Myhome16", "MyNameIsNothing", "Mysterymason", "N1NjA546", "nikeas", "NimbusCloud26", "occooa", "ocelot", "overfrost", "Pigjr1", "pludrpladr", "Pokarnor", "Precarious", "Pulsaris", "puzzledan", "qwertyuiopazs", "RaceBandit", "racefan12", "RandomTurtle", "REALinsanemonkey", "reaper765", "RiddleOfRevenge", "rokun", "Rosate", "S_98", "Sabin7", "SamsterSamster", "sarothat410", "sebba", "Sellyme", "sgtawesome16", "shadowkirby21", "Shandys", "SilentSam", "SilentSand", "SilverEvil", "simeng", "sirwoofy", "SoundFXMan", "speedy250", "Spikeabc", "SpiritfChaos", "Squidward568", "Stone667", "SupHomies", "SypherKhode822", "T6salt", "Taiboss", "TailsTheFox12", "tehdarkside", "TheAznSensation", "TheDarkFlame", "thedude0", "TheIdiocyWizard", "TheJesterOfPain", "therealsirmark4", "thijsel", "tracymirkin123", "TwistedCakez", "Twiton", "undeadcupcake3", "Underlord", "uzzbuzz", "Vara", "viper11475", "walfordking", "WiiPlayer113", "wiiwonder", "Woon1957", "Xandrya", "XYTWO", "yeasy", "yiu113", "Zakhep2", "Zeeco", "ZigZagZombie", "ZombiestookmyTV", "Zzzip50"];
            if(arr.indexOf(username) > -1) {
                //alert("Regular found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Regular</p>";
            }
        }
    }
}

/* Guests */

{
    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFySURBVChTXVK9zgFRED17kciSkIhWNKuUaBSiVHgAjcL7eAlaBY1EQoNCoZN4CD+FYCkQZNwzye7nc5KTnZk7M3fO7MXpdBLydrsJ0ev1pNlsSi6Xk2w2K/l8Xv1Op6Pnl8tFHBak02ksl0tUKhUEaDQaSKVSsM0wGo1gkzV+v9+Bx+Mh0+lUrK8cDAba8ReHw0FqtZocj0dxGHAcR7usViuUSiWcz2f1vxGNRpFMJuH7Pky329UgR/suYCMmBiSu1yvsHTCz2UwDrVYLr9dLbRa8329sNhvs93vldrulFEQiERWsWvr9vlAfF0PU6/VQ5zcJE4vFrA3tZoxRm3Pb1WO322nc5oEbDmCq1aoa1BbMziSOmEgk4LpuGAvB6/ghx+MxXbHL0DEDEvafhePh+XzKcDgMC9vtth78wt74VxR0WiwWYSHpeZ6Uy2UpFAr/4oQ+I+sgHo8rJ5MJ5vM51uu1PqFMJoNisQhqty/CLsnHB3OEPx1N15+MAAAAAElFTkSuQmCC";
    MainLoop: for ( var i=0; i < elem.length; i++)
    {
        var obj = elem[i];
       
        if ( pattn.test ( obj.id ) )
        {
            if ( !table ) table = obj.parentNode;
       
            var postID = obj.id.split ("-")[1];
            var username =  obj.getElementsByTagName("img")[0].title;
            nameSave[i] = username;
           
            //List of the usernames that are Guests in alphabetical order:
           
            var arr = ["10crystalmask01", "Aedan210", "aeviternal", "Andyb112", "Aran150", "Arecyl", "asher1111", "Ben_B", "Benjie007", "Bookworm52", "BrainpanSonata", "buzzerfly", "calebmock", "cllazyman", "CoolNoah23", "Danaroth", "DarkEvilSoul", "Dawn_to_Dusk", "doctorew", "efar", "Elldaman311", "flashdeath30", "FlyingCat", "Godzillasrabbid", "graveyard890", "hangman95", "Helkaine", "henrythe7th7", "hippyman27", "IAMMegamanX7", "Jamuak", "Jazzaboy", "jittyot", "joefield", "JoeySkywalker", "Jouteur", "kashuushian1542", "kboy101", "kingboo19", "Kuzco12", "linkisgreat7", "M_Blox", "mar12345", "marti000", "MasterZekrom", "maxijeje", "Mendacium", "mendelde", "michael222", "Micron15", "mikerspd", "mommyrocks2005", "Mortinor", "mount2010", "MrCollect", "NinjaMaster131", "OmegaDoom", "Richard91", "roliim", "seanison0151", "Serpentes", "shadow925", "SkieLight", "Sonicdude2", "SoulRazer", "Speaksforthedead", "SuperCaliFragi", "tbenn14", "TheAeronaut", "thelolofdeath", "thenewampkit", "TheWildJamie", "tommiboy500", "TribalSeedlings", "TurkeyPie", "urFEAR", "wercooler", "wizard96", "zedd236"];
            if(arr.indexOf(username) > -1) {
                //alert("Guest found!");
                obj.cells[0].innerHTML += "<p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.4em;' >&nbsp;</p><p style='font-size: 0.7em; color: #666;'><img src='" + img + "' />Guest</p>";
            }
        }
    }
}

update();