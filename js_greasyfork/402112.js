// ==UserScript==
// @name         Reddit whitelist
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match          http://*.reddit.com/*
// @match          https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402112/Reddit%20whitelist.user.js
// @updateURL https://update.greasyfork.org/scripts/402112/Reddit%20whitelist.meta.js
// ==/UserScript==



(function() {
    function InitaliseKeys(){
        if (localStorage.getItem("whitelistSubreddits") === null) {
            localStorage.setItem('whitelistSubreddits','[{"SubTitle":"Placeholder","SubCategory":"Other","importance":"0"},{"SubTitle":"Placeholder","SubCategory":"Other","importance":"0"}]');
        }
        if (localStorage.getItem("whitelistCategories") === null) {
            localStorage.setItem('whitelistCategories','["Other"]');
        }
        if (localStorage.getItem("WhitelistOtherUrls") === null) {
            localStorage.setItem('WhitelistOtherUrls','');

        }
        if (localStorage.getItem("pauseTimer") === null) {
            localStorage.setItem('pauseTimer',0000000000000);
        }
        if (localStorage.getItem("customLinks") === null) {
            localStorage.setItem('customLinks','[{"title":"Wikipedia","url":"https://www.wikipedia.org/"},{"title":"Google","url":"https://www.google.com"}]');
        }
    }
    var whitelistSubreddits = JSON.parse(localStorage.getItem( 'whitelistSubreddits' ));
    var customLinks = JSON.parse(localStorage.getItem( 'customLinks' ));
    console.log("customlinks"+customLinks);
    var pauseTimer = JSON.parse(localStorage.getItem( 'pauseTimer' ));
    var date = new Date();
    var version = "1.2";


    //console.log(whitelistSubreddits);
    //equationvariables
    var number1;
    var number2;
    var getNumbersSolution;


    var productive = false;
    var currentUrl = getUrl();
    //console.log("currenturl: "+ currentUrl);
    var currentPastebin = "https://greasyfork.org/en/scripts/396683/versions/new"
    var currentlyOpenSubreddit;
    var seconds = 0;
    var string2;
    //local storage explained https://www.youtube.com/watch?v=T9GWHFDcELQ
    string2 = currentUrl.toUpperCase();
    var subredditStringArray = string2.split('/');
    InitaliseKeys();

//math5min, mathSub
    var mathArray = ["true", "false"];

    whitelistSubreddits = whitelistSubreddits.sort((a, b) => parseFloat(a.test) - parseFloat(b.test));
    // @require      https://greasyfork.org/scripts/396683-reddit-whitelist-list/code/Reddit%20whitelist-list.user.js

    var subreddits = JSON.parse(localStorage.getItem( 'whitelistSubreddits' ));
    var SubCategories = JSON.parse(localStorage.getItem( 'whitelistCategories' ));
    //var SubCategories = ["Languages", "Reading", "Music", "Projects", "IT", "Gardening", "SelfHelp","RepsAndClothing","FitnessAndFood","Other","RealityCheck"];
    //console.log("test");
    //console.log(subreddits[1].SubTitle.toUpperCase);
    isSubredditInList();

    isSubredditInList();
    function copytoclipboard() {
        /* Get the text field */
        var copyText = document.getElementById("myInput");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alert("Copied the text: " + copyText.value);
    }
    function getUrl(){
        //console.log("geturl");
        return window.location.toString();
    }
    isSubredditInList();
    if(productive == true){
        if(mathArray[1] == true){
            if(mathEquation()){}else{productive = false
                                    }

        }
    }
    if (productive == false) {
        // replaceContent();
        if(pauseTimer < date){
            replaceContentSortByCategories();
        }else{compareTimestamp();}

    }



    function mathEquation(){
        var solution = 0;
        while(solution % 10 == 0 || solution < 50){



            var nr1 = Math.floor(Math.random() * 10) + 10;
            var nr2 = Math.floor(Math.random() * 10)+ 5;
            solution = nr1 * nr2

        }

        var favDrink = prompt(nr1 + ' * ' +nr2 , "");

        if(favDrink == solution){
            return true
        }
        else{return false;}

    }

    // function isSubredditInList(){
    //
    //
    //   for (var i = 0, len = subreddits.length; i < len; i++) {
    //     var string1 = subreddits[i].toUpperCase();
    //     console.log(i);
    //     var string2  = currentUrl.toUpperCase();
    //     if (string2.includes(string1)) {
    //       productive = true;
    //       alert("Productive");
    //     }
    //     console.log("subreddit count:" + i );
    //   }
    // }
    function isSubredditInList(){
        //console.log("function isSubredditInList()")

        //console.log("test2:");
        //console.log(currentUrl);

        for (var i = 0, len = whitelistSubreddits.length; i < len; i++) {
            //console.log(subreddits[i]["SubTitle"].toUpperCase());
            // console.log(currentUrl.toUpperCase());
            var subredditStringArray = whitelistSubreddits[i].SubTitle.toUpperCase();

            // string2  = string2.search(/\/R\/.*\//);
            // var string2  = currentUrl.toUpperCase();
            // console.log("is: " + subredditStringArray + " in " + string2);
            //console.log()
            if (string2.includes(subredditStringArray) || window.location.href.indexOf("/m/") > -1 || window.location.href.indexOf("/user/") > -1) { //or if url contains /m/

                    productive = true;
                    currentlyOpenSubreddit = whitelistSubreddits[i].SubTitle;
                    // alert("Productive");

            }
            //console.log("subreddit count:" + i );
        }

    }


    function removeContent(){
        var content = document.body;
        content.remove();
    }



    function replaceContentSortByCategories(){
        document.write(version);
        document.write("<br>");
        /*removeContent(); (not needed)*/
        document.write('<button id="editMode">Edit</button><br>');
        //document.write('<button id="pauseMode">5 Minutes</button><br>');


function getNumbers(){
    //console.log("getnumbers");
        getNumbersSolution = 0;
        while(getNumbersSolution % 10 == 0 || getNumbersSolution < 50){
            number1 = Math.floor(Math.random() * 10) + 10;
            number2 = Math.floor(Math.random() * 10) + 5;
            getNumbersSolution = number1 * number2;

        }
}




        getNumbers();
document.write('-----------------------------------------------------------------<br>');
document.write(number1+' * ' + number2 + ' = <input type="number"   placeholder="Solution" id="solutionField"> <button id="pauseMode">5 Minutes</button>');
document.write('<br>');
document.write('-----------------------------------------------------------------<br>');





        if(!subredditStringArray[4] == undefined){
            subredditStringArray[4] = subredditStringArray[4].replace(/(\B)[^ ]*/g,match =>(match.toLowerCase())).replace(/^[^ ]/g,match=>(match.toUpperCase()))
        }


        /* ----------------------------Add New form */
        document.write('<input type="text"style="display: none" class="delete-card" value="'+ subredditStringArray[4] +'" id="inputSubreddit">');
        document.write('<input type="text"style="display: none" class="delete-card"   placeholder="Importance" id="inputImportance" list="importanceList">');


        document.write('<datalist id="importanceList">');
        document.write('<option value="0">');
        document.write('<option value="1">');
        document.write('<option value="2">');
        document.write('<option value="3">');
        document.write('<option value="4">');
        document.write('<option value="5">');
        document.write('<option value="6">');
        document.write('<option value="7">');
        document.write('<option value="8">');
        document.write('<option value="9">');
        document.write('<option value="10">');

        document.write('</datalist>');


        document.write('<input type="text" style="display: none" class="delete-card" placeholder="Category" id="inputCategory" list="category"> ');

        document.write('<datalist id="category">');

        //get categorys from local storage
        var whitelistCategories = JSON.parse(localStorage.getItem( 'whitelistCategories' ));
        for(var i = 0; i < whitelistCategories.length; i++) {
            document.write('<option value="'+ whitelistCategories[i] +'">');
        }

        document.write('</datalist>');
        document.write('<button style="display: none" class="delete-card" id="addCurrentSubreddit">add Subreddit</button><br>');

        document.write(' <input style="display: none" class="delete-card" type="text" value=[{"SubTitle":"Placeholder","SubCategory":"Other","importance":"0"},{"SubTitle":"Placeholder","SubCategory":"Other","importance":"0"}] id="importform">');
        document.write('<button style="display: none" class="delete-card" id="Importbtn">import</button>');




        var favArray = [];
        var favString = "https://www.reddit.com/r/"
        for (var i = 0, len = subreddits.length; i < len; i++) {
            if (0 < subreddits[i].importance) {
                favString = favString + subreddits[i].SubTitle+'+';
            }
        }



        for (var i = 0, len = favArray.length; i < len; i++) {
            favString = favString + favArray[i]+'+';
        }


        document.write('<h2>Custom Links</h2>');
        for (var i = 0, len = customLinks.length; i < len; i++) {
            //console.log(subreddits[i]["SubTitle"].toUpperCase());
            // console.log(currentUrl.toUpperCase());
            var custonLinkTitle = customLinks[i].title;
            var custonLinkUrl = customLinks[i].url;
            document.write('<a href="'+custonLinkUrl+'" target="_blank">'+custonLinkTitle+'</a><br>');
        }
        document.write(' <input type="text" value=[{"title":"Wikipedia","url":"https://www.wikipedia.org/"},{"title":"Google","url":"https://www.google.com"}] id="importformLinks">');
        document.write('<button id="ImportLinksbtn">import</button>');

        document.write('<h2><a href="'+favString+'">Favourites</a></h2>');
        document.write(' </div>');



        //displayfavourites

        document.write('<div class="container" style="display:flex;>');



        document.write('<div class="categoryCard" style="max-width: 300px;"> ');
        //document.write('<h2><a href="https://www.reddit.com/user/MakesMeLookFat/m/' + SubCategories[s] + '">' + SubCategories[s] + '</a></h2>');

        for (var i = 0, len = subreddits.length; i < len; i++) {
            if (0 < subreddits[i].importance) {
                /*document.write('<div class="card"><div class="cardTop"><span class="accordion" >▽</span><div class="subreddit"><a href="/r/' + subreddits[i]["SubTitle"] + '">' + capitalizeFirstLetter(subreddits[i]["SubTitle"]) + ' </a></div>' + '<div class="top"><a href="/r/' + subreddits[i]["SubTitle"] +  '/top/?t=all">⬆️</a></div></div></div>');*/
                document.write('<div class="card" border-width:2px; style="background-color:rgba('+ ((subreddits[i]["importance"]*2)*35) +', '+ ((subreddits[i]["importance"]*2)*10) +', 0, '+ ((subreddits[i]["importance"]*2)/25) +');">');
                document.write('<div class="cardTop" ><button style="display: none" class="delete-card" name="'+ subreddits[i]["SubTitle"] +'">X</button><button class="accordion" id="accordion_'+subreddits[i]["SubTitle"]+'">▽</button><button class="accordion" style="display:none" id="accordion_'+subreddits[i]["SubTitle"]+'">▽</button><div class="subreddit"><a target="_blank" href="/r/' + subreddits[i]["SubTitle"] + '">' + capitalizeFirstLetter(subreddits[i]["SubTitle"]) + ' </a></div>' + '<div class="top"><a href="/r/' + subreddits[i]["SubTitle"] +  '/top/?t=all">⬆️</a></div></div>');
                document.write('<div class="panel" id="panel_'+subreddits[i]["SubTitle"]+'">"SubViews":"0", "subCount":"0"</div>');
                document.write('</div>');
            }
        }
        document.write('</div>');
        document.write('</div>');



        //write all categories and subreddits


        document.write('<div class="container" style="display:flex;>');
        document.write('<div class="container">');

        for (var s = 0; s < SubCategories.length; s++) {
            var plusString = "";

            for (var i = 0, len = subreddits.length; i < len; i++) {
                //console.log("cat"+SubCategories[s])
                //console.log("sub"+subreddits[i]["SubCategory"])
                if (SubCategories[s] == subreddits[i]["SubCategory"]) {
                    plusString += subreddits[i]["SubTitle"] + "+";
                    //console.log(plusString);
                }
            }

            document.write('<div class="categoryCard">');
            document.write('<h2><a href="https://www.reddit.com/r/' + plusString + '">' + SubCategories[s] + '</a></h2>');
            for (var i = 0, len = subreddits.length; i < len; i++) {
                if (SubCategories[s] == subreddits[i]["SubCategory"]) {
                    /*document.write('<div class="card"><div class="cardTop"><span class="accordion" >▽</span><div class="subreddit"><a href="/r/' + subreddits[i]["SubTitle"] + '">' + capitalizeFirstLetter(subreddits[i]["SubTitle"]) + ' </a></div>' + '<div class="top"><a href="/r/' + subreddits[i]["SubTitle"] +  '/top/?t=all">⬆️</a></div></div></div>');*/

                    if(subreddits[i]["importance"] == 0){
document.write('<div class="card" border-width:2px; style="background-color:rgba(255,255,255,1);">');
                       }else{
                    document.write('<div class="card" border-width:2px; style="background-color:rgba('+ ((subreddits[i]["importance"]*2)*35) +', '+ ((subreddits[i]["importance"]*2)*10) +', 0, 1);">');
                }
                    document.write('<div class="cardTop" ><button style="display: none" class="delete-card" name="'+ subreddits[i]["SubTitle"] +'">X</button><button class="accordion" id="accordion_'+subreddits[i]["SubTitle"]+'">▽</button><button class="accordion" style="display:none" id="accordion_'+subreddits[i]["SubTitle"]+'">▽</button><div class="subreddit"><a target="_blank" href="/r/' + subreddits[i]["SubTitle"] + '">' + capitalizeFirstLetter(subreddits[i]["SubTitle"]) + ' </a></div>' + '<div class="top"><a href="/r/' + subreddits[i]["SubTitle"] +  '/top/?t=all">⬆️</a></div></div>');
                    document.write('<div class="panel" id="panel_'+subreddits[i]["SubTitle"]+'">"SubViews":"0", "subCount":"0"</div>');
                    document.write('</div>');
                }
            }
            document.write('</div>');
        }
        document.write('</div>');
        accordion()
        window.stop();
    }



    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /*----unused?
function addSubredditsToList(){
    var newSubTitle = document.getElementById("newSubTitle").value;
    var newSubCategory = document.getElementById("newSubCategory").value;
    subreddits.fill(',{"SubTitle": newSubTitle , "SubCategory": newSubCategory , "SubViews":"0", "subCount":"0"}');

    document.write('<input name="savedataoriginale" id="newSubTitle" type="text" value="">');
    document.write('<input name="savedataoriginale" id="newSubCategory" type="text" value="">');
    document.write('<input id="clickMe" type="button" value="AddSub"/>');
}

*/

    //------------------------------------------------------- Log Time spent in each subreddit
    function logSubredditTime(){
        while (window.onfocus) {
            if (productive) {
                setInterval(function () {
                    seconds++;
                    // console.log(seconds);
                }, 1000);
            }
        }
    }




    /*--------------------------------------------ADD Style----------------------------*/

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    const sheet = document.getElementById("GM_addStyleBy8626").sheet,
          rules = (sheet.rules || sheet.cssRules);

    for (let i=0; i<rules.length; i++)
        document.querySelector("pre").innerHTML += rules[i].cssText + "\n";

    function accordion(){

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                /* Toggle between adding and removing the "active" class,
to highlight the button that controls the panel*/
                this.classList.toggle("active");

                /* Toggle between hiding and showing the active panel */
                var panel = document.getElementById(this.id.replace("accordion_", "panel_"));
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });

        }

        function nextInDOM(_selector, _subject) {
            var next = getNext(_subject);
            while(next.length != 0) {
                var found = searchFor(_selector, next);
                if(found != null) return found;
                next = getNext(next);
            }
            return null;
        }
        function getNext(_subject) {
            if(_subject.next().length > 0) return _subject.next();
            return getNext(_subject.parent());
        }
        function searchFor(_selector, _subject) {
            if(_subject.is(_selector)) return _subject;
            else {
                var found = null;
                _subject.children().each(function() {
                    found = searchFor(_selector, $(this));
                    if(found != null) return false;
                });
                return found;
            }
            return null; // will/should never get here
        }


        GM_addStyle("a { color:#222; }");
        GM_addStyle(".container { font:x-small verdana,arial,helvetica,sans-serif; }");
        GM_addStyle("#notionLinks { font:x-small verdana,arial,helvetica,sans-serif; }");
        GM_addStyle(".container { display: flex;flex-direction: row;flex-wrap: wrap;    justify-content: center; }");
        GM_addStyle(".categoryCard { @media (min-width: 992px) { width: 25%; } }");
        GM_addStyle("a { text-decoration:none; }");
        GM_addStyle(".top, .subreddit, .container { text-align: center; }");
        GM_addStyle(".subreddit { font-size: 16px;  }");
        GM_addStyle(".top { font-size: 12px; }");
        GM_addStyle("#notionLinks { font-size: 16px; }");
        GM_addStyle(".cardTop { display: flex; padding: 0px 5px; margin: 1px; align-items: center; }");
        GM_addStyle(".card { border: 1px solid grey; border-radius: 20px; }");
        GM_addStyle(".cardTop { justify-content: space-between; }");
        GM_addStyle(".panel {padding: 0 18px;background-color: white;display: none;overflow: hidden;}");
        GM_addStyle("button{background: none;color: inherit;border: none;padding: 0;font: inherit;cursor: pointer;outline: inherit;}");

        GM_addStyle("body{background-image: url('https://i.imgur.com/bLgvimH.png');background-size: 150% 150%;}");
        //console.log("bg-here");
        GM_addStyle("h2 { margin-block-end: 0.23em; }");



        //temp();
        function temp(){
            localStorage.setItem('whitelistSubreddits','[{"SubTitle": "FreeKarma4U","SubCategory": "Other","importance": "0"},{"SubTitle": "Shortcuts","SubCategory": "IT","importance": "0"},{"SubTitle": "ArtefactPorn","SubCategory": "Other","importance": "0"},{"SubTitle": "AmateurRoomPorn","SubCategory": "Other","importance": "0"},{"SubTitle": "BackgroundArt","SubCategory": "Other","importance": "0"},{"SubTitle": "drawings","SubCategory": "Other","importance": "0"},{"SubTitle": "Dreamboxers","SubCategory": "Projects","importance": "0"},{"SubTitle": "researchvideos","SubCategory": "Other","importance": "0"},{"SubTitle": "ShitLiberalsSay","SubCategory": "Other","importance": "0"},{"SubTitle": "ShittyBuildingPorn","SubCategory": "Other","importance": "0"},{"SubTitle": "ShittyEarthPorn","SubCategory": "Other","importance": "0"},{"SubTitle": "slavelabour","SubCategory": "Other","importance": "0"},{"SubTitle": "startup","SubCategory": "Other","importance": "0"},{"SubTitle": "Magic","SubCategory": "Other","importance": "0"},{"SubTitle": "malelivingspace","SubCategory": "Other","importance": "0"},{"SubTitle": "Mindblowing_Posts","SubCategory": "Other","importance": "0"},{"SubTitle": "NationalPhotoSubs","SubCategory": "Other","importance": "0"},{"SubTitle": "playingcards","SubCategory": "Other","importance": "0"},{"SubTitle": "raining","SubCategory": "Other","importance": "0"},{"SubTitle": "SwitchNSPs","SubCategory": "Other","importance": "0"},{"SubTitle": "vagabond","SubCategory": "Other","importance": "0"},{"SubTitle": "videography","SubCategory": "Other","importance": "0"},{"SubTitle": "remoteplaces","SubCategory": "Other","importance": "0"},{"SubTitle": "PropagandaPosters","SubCategory": "Other","importance": "0"},{"SubTitle": "EpicMounts","SubCategory": "Other","importance": "0"},{"SubTitle": "Epstein","SubCategory": "Other","importance": "0"},{"SubTitle": "geometric","SubCategory": "Other","importance": "0"},{"SubTitle": "GeometryIsNeat","SubCategory": "Other","importance": "0"},{"SubTitle": "stuffyoushouldknow","SubCategory": "Other","importance": "0"},{"SubTitle": "SmarterEveryDay","SubCategory": "Other","importance": "0"},{"SubTitle": "lectures","SubCategory": "Other","importance": "0"},{"SubTitle": "GirlGamers","SubCategory": "Other","importance": "0"},{"SubTitle": "gonwild","SubCategory": "Other","importance": "0"},{"SubTitle": "history","SubCategory": "Other","importance": "0"},{"SubTitle": "HongKong","SubCategory": "Other","importance": "0"},{"SubTitle": "CorporateFacepalm","SubCategory": "Other","importance": "0"},{"SubTitle": "fakealbumcovers","SubCategory": "Other","importance": "0"},{"SubTitle": "rance","SubCategory": "Languages","importance": "0"},{"SubTitle": "languagelearning","SubCategory": "Languages","importance": "0"},{"SubTitle": "learnfrench","SubCategory": "Languages","importance": "0"},{"SubTitle": "audiobooks","SubCategory": "Reading","importance": "0"},{"SubTitle": "bangers","SubCategory": "Music","importance": "0"},{"SubTitle": "basstabs","SubCategory": "Music","importance": "0"},{"SubTitle": "beatheads","SubCategory": "Music","importance": "0"},{"SubTitle": "Chilledout","SubCategory": "Music","importance": "0"},{"SubTitle": "hiphopheads","SubCategory": "Music","importance": "5"},{"SubTitle": "GermanRap","SubCategory": "Music","importance": "5"},{"SubTitle": "makinghiphop","SubCategory": "Music","importance": "0"},{"SubTitle": "WeAreTheMusicMakers","SubCategory": "Music","importance": "0"},{"SubTitle": "Inmersion","SubCategory": "Music","importance": "0"},{"SubTitle": "rocksmith","SubCategory": "Music","importance": "7"},{"SubTitle": "gymmusic","SubCategory": "Music","importance": "0"},{"SubTitle": "woodworking","SubCategory": "Projects","importance": "6"},{"SubTitle": "InstagramMarketing","SubCategory": "Projects","importance": "0"},{"SubTitle": "homeoffice","SubCategory": "Projects","importance": "0"},{"SubTitle": "EntrepreneurRideAlong","SubCategory": "Projects","importance": "0"},{"SubTitle": "books","SubCategory": "Reading","importance": "0"},{"SubTitle": "EatCheapAndHealthy","SubCategory": "FitnessAndFood","importance": "0"},{"SubTitle": "gainit","SubCategory": "FitnessAndFood","importance": "0"},{"SubTitle": "Cooking","SubCategory": "FitnessAndFood","importance": "0"},{"SubTitle": "Fitness","SubCategory": "FitnessAndFood","importance": "0"},{"SubTitle": "Repsneakers","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "RepTime","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "BoostMasterLin","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "CoutureReps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "streetwearstartup","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "unbranded","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "goosemasterkim","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "FashionReps","SubCategory": "RepsAndClothing","importance": "5"},{"SubTitle": "QualityReps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "DesignerReps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "FashionRepsBST","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "Flexicas","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "JewelryReps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "nosurf","SubCategory": "SelfHelp","importance": "6"},{"SubTitle": "nonutnovember","SubCategory": "SelfHelp","importance": "0"},{"SubTitle": "pornfree","SubCategory": "SelfHelp","importance": "6"},{"SubTitle": "noMusic","SubCategory": "SelfHelp","importance": "0"},{"SubTitle": "cacti","SubCategory": "Gardening","importance": "0"},{"SubTitle": "druggardening","SubCategory": "Gardening","importance": "0"},{"SubTitle": "succulents","SubCategory": "Gardening","importance": "0"},{"SubTitle": "whatsthisplant","SubCategory": "Gardening","importance": "0"},{"SubTitle": "proplifting","SubCategory": "Gardening","importance": "0"},{"SubTitle": "houseplants","SubCategory": "Gardening","importance": "0"},{"SubTitle": "hydro","SubCategory": "Gardening","importance": "0"},{"SubTitle": "IndoorGarden","SubCategory": "Gardening","importance": "0"},{"SubTitle": "Jarrariums","SubCategory": "Gardening","importance": "0"},{"SubTitle": "matureplants","SubCategory": "Gardening","importance": "0"},{"SubTitle": "magicplantsexchange","SubCategory": "Gardening","importance": "0"},{"SubTitle": "plantbreeding","SubCategory": "Gardening","importance": "0"},{"SubTitle": "PlantedTank","SubCategory": "Gardening","importance": "0"},{"SubTitle": "plantsandpots","SubCategory": "Gardening","importance": "0"},{"SubTitle": "Euphorbiaceae","SubCategory": "Gardening","importance": "0"},{"SubTitle": "EuropeanPlantSwap","SubCategory": "Gardening","importance": "0"},{"SubTitle": "gardening","SubCategory": "Gardening","importance": "0"},{"SubTitle": "Greenhouses","SubCategory": "Gardening","importance": "0"},{"SubTitle": "algorithms","SubCategory": "IT","importance": "0"},{"SubTitle": "Archiveteam","SubCategory": "IT","importance": "0"},{"SubTitle": "Automate","SubCategory": "IT","importance": "0"},{"SubTitle": "automation","SubCategory": "IT","importance": "0"},{"SubTitle": "BaPCSalesEurope","SubCategory": "IT","importance": "0"},{"SubTitle": "buildapcsaleseu","SubCategory": "IT","importance": "0"},{"SubTitle": "devblogs","SubCategory": "IT","importance": "0"},{"SubTitle": "web_design","SubCategory": "IT","importance": "0"},{"SubTitle": "webdev","SubCategory": "IT","importance": "0"},{"SubTitle": "WebdevTutorials","SubCategory": "IT","importance": "0"},{"SubTitle": "TheHappieMakers","SubCategory": "IT","importance": "0"},{"SubTitle": "sysadmin","SubCategory": "IT","importance": "0"},{"SubTitle": "npm","SubCategory": "IT","importance": "0"},{"SubTitle": "node","SubCategory": "IT","importance": "0"},{"SubTitle": "programming","SubCategory": "IT","importance": "0"},{"SubTitle": "MachinesLearn","SubCategory": "IT","importance": "0"},{"SubTitle": "learnprogramming","SubCategory": "IT","importance": "0"},{"SubTitle": "Heavymind","SubCategory": "Other","importance": "0"},{"SubTitle": "gamedev","SubCategory": "IT","importance": "0"},{"SubTitle": "gamedevexpo","SubCategory": "IT","importance": "0"},{"SubTitle": "jailbreak","SubCategory": "IT","importance": "5"},{"SubTitle": "learnjava","SubCategory": "IT","importance": "0"},{"SubTitle": "Guitar","SubCategory": "Music","importance": "0"},{"SubTitle": "LearnGuitar","SubCategory": "Music","importance": "0"},{"SubTitle": "antiwork","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "CapitalistBurnout","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "ClimateActionPlan","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "collapse","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "doomsdaycult","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "lostgeneration","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "preppers","SubCategory": "RealityCheck","importance": "0"},{"SubTitle": "DecorReps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "RepLadies","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "sneakerreps","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "RepTronics","SubCategory": "RepsAndClothing","importance": "0"},{"SubTitle": "Flipping","SubCategory": "Projects","importance": "0"},{"SubTitle": "MacMiller","SubCategory": "Other","importance": "5"},{"SubTitle": "privacy","SubCategory": "IT","importance": "4"},{"SubTitle": "notion","SubCategory": "IT","importance": "4"}]');
        }


        //console.log( localData);

        updateCategories();

        function updateCategories(){
            var categoryset = new Set();


            //console.log("test")
            //console.log(whitelistSubreddits[1].SubCategory)


            //console.log(whitelistSubreddits.SubCategory);
            for(var i = 0; i < whitelistSubreddits.length; i++) {
                //console.log(whitelistSubreddits[i].SubCategory);
                categoryset.add(whitelistSubreddits[i].SubCategory);

            }
            categoryset = Array.from(categoryset).join('","');
            categoryset= '["'+ categoryset +'"]';
            localStorage.setItem('whitelistCategories',categoryset);
            //console.log("categorysetz:");
            //console.log(categoryset);
        }


        // ----------------------------------------------add new-------------------------------------------------


        function addSubreddit(SubTitle, SubCategory , importance){

            //console.log(SubTitle, SubCategory, importance)
            whitelistSubreddits.push({"id":whitelistSubreddits.length,"SubTitle": SubTitle,"SubCategory": SubCategory,"importance": importance});
            whitelistSubreddits = JSON.stringify(whitelistSubreddits);
            localStorage.setItem('whitelistSubreddits',whitelistSubreddits);
        }

        //addSubreddit("testssub", "SubCategory" , "1");


        // ________________From form
        function addSubredditFromForm () {
            var inputSubreddit = document.getElementById("inputSubreddit");
            var inputCategory = document.getElementById("inputCategory");
            var inputImportance = document.getElementById("inputImportance");
            addSubreddit(inputSubreddit.value, inputCategory.value , inputImportance.value);
            alert ("clicked");
        }

        var myDiv = document.querySelector ("#addCurrentSubreddit");
        if (myDiv) {
            myDiv.addEventListener ("click", addSubredditFromForm , false);
        }
        var myDiv = document.querySelector ("#editMode");
        if (myDiv) {
            myDiv.addEventListener ("click", toggle_visibility , false);
        }
        function toggle_visibility(edit) {
            var elements = document.getElementsByClassName("delete-card");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = elements[i].style.display == 'inline' ? 'none' : 'inline';
               // console.log("this:");
                var attribute = elements[i].getAttribute("name");
                elements[i].addEventListener("click", function(){removeSubreddit(attribute);}, false);
               // console.log(attribute);
            }

        }

        var myDiv = document.querySelector ("#pauseMode");
        if (myDiv) {
            myDiv.addEventListener ("click", addPause , false);
        }


        function addPause(){

//console.log(document.getElementById("solutionField").innerHTML);

            var equationInput = document.getElementById("solutionField").value;
            if(equationInput == getNumbersSolution){
                localStorage.setItem('pauseTimer', date.getTime()+300000);
                location.reload();
            }else{
            if(equationInput > 0){
                alert(number1 +" * "+ number2 +" = "+ getNumbersSolution);
                                location.reload();

               }
            }

    }

        // ________________Import text form
        function importForm () {
            var importform = document.getElementById("importform");
//add confirm method------
            localStorage.setItem('whitelistSubreddits',importform.value);
        }

        var myDivImport = document.querySelector ("#Importbtn");
        if (myDivImport) {
            myDivImport.addEventListener ("click", importForm, false);
        }


function importFormLinks () {
    var importformLinks = document.getElementById("importformLinks");

//add confirm method------
        localStorage.setItem('customLinks',importformLinks.value);






}


function confirm(){
var txt;
var r = confirm("Press a button!");
if (r == true) {
return true
} else {
return false
}

}
        var myDivImportLinks = document.querySelector ("#ImportLinksbtn");
        if (myDivImportLinks) {
            myDivImportLinks.addEventListener ("click", importFormLinks, false);
        }

        // remove subreddit to be added by delte function

        function removeSubreddit(subTitle){
            //console.log(subTitle);

            for( var i = 0; i < whitelistSubreddits.length; i++){
                if ( whitelistSubreddits[i].subTitle === subTitle) {
                    whitelistSubreddits.splice(i, 1);
                    whitelistSubreddits = JSON.stringify(whitelistSubreddits);
                    localStorage.setItem('whitelistSubreddits',whitelistSubreddits);
                }
            }
            //console.log("if subreddit id is not array position -1? then fix it!")
        }
        removeSubreddit("testssub");
        //removeSubreddit("");

        function shift(){
            //use https://www.positronx.io/javascript-array-push-pop-shift-unshift-methods/
            // use shift to place items somewehre else in array, usefull for drag and drop feature
        }

        function sort(){};


    }

    /*------------*/
/*
    //enter to solve equation
    // Get the input field
    var input = document.getElementById("solutionField");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("pauseMode").click();
        }
    });

document.getElementById('solutionField').onkeydown = function(e){
   if(e.keyCode == 13){
     addPause();
   }
};
*/


    function compareTimestamp(){
        var timeInMs;
        var timeStampLocalStorage;
 var timeLeft;
GM_addStyle("#header-img { position: fixed; }");
        //replace reddit logo
try {
        document.getElementById("header-img").classList.remove("default-header");
}
catch(err) {

}
    window.setInterval(function(){


        timeInMs = Date.now();
        timeStampLocalStorage = localStorage.getItem("pauseTimer");
        try {
        timeLeft = Math.round((localStorage.getItem("pauseTimer") - timeInMs)/1000);
        }
catch(err) {

}
       // console.log("compare: localstorage="+timeStampLocalStorage+"| datenow="+ timeInMs);
       // console.log("timeleft:"+ (localStorage.getItem("pauseTimer") - timeInMs)/1000);

        document.getElementById("header-img").innerHTML=timeLeft;
        if(timeStampLocalStorage < timeInMs){location.reload();}
  /// call your function here
}, 1000);
    }


    //-----------------IOS URL CHANGE RELOAD
    window.addEventListener('locationchange', function(){
        isSubredditInList();
    })
    /* These are the modifications: */
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });


})();