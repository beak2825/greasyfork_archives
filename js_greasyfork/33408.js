// ==UserScript==
// @name         Slide-Project
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  Cast in the name of Asuka, Ye Not Guilty.
// @author       ECHibiki /qa/
// @match http://boards.4chan.org/*/
// @match https://boards.4chan.org/*/
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/33408/Slide-Project.user.js
// @updateURL https://update.greasyfork.org/scripts/33408/Slide-Project.meta.js
// ==/UserScript==


//Downloaded from https://greasyfork.org/en/scripts/33408-slide-project
//0.6.2 tagging

var board = "qa";

var show = false;

var windowDisplayed = false;
var reducedList = [];
var selectiveList = [];
var fullList = [];
var OPList = [];
var taggings = [];

var exclude = false;
var include = false;

var spoof;
var set = false;
var refreshedTimes;
var topThread;

var JSONPage;
var URLStored;
var endURLStored;

var JSONTag;
var pagesLoaded = 0;
var smallestTag;
var loopPage = 0;
var loopOne = false;
var imgURL

var numberOfPosts;

var pageNo;
//console.log = function(){};
var imageNotSet = true;
var dictionary = [ ];

var setPostAndPage = function(){
    console.log(smallestTag);
    numberOfPosts = Math.floor(Math.random() * 100 % 20);
    console.log("Post No: " + numberOfPosts);

    pageNo = Math.floor(Math.random() * 100 % ((smallestTag / 20)));
    console.log("Page No: " + pageNo);4
};

//console.log = function(){};

function getURL(event){
    if(event.ctrlKey) {
        if(include){
            document.getElementById("inclusions").value += this.href.substr(this.href.lastIndexOf('/') + 1) + "\n";
            event.preventDefault();
            event.stopPropagation();
        }
        else if(exclude){
            document.getElementById("exclusions").value += this.href.substr(this.href.lastIndexOf('/') + 1) + "\n";
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

///https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript///
var getJSON = function(url, callback, extra) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response, extra);
        } else {
            callback(status);
        }
    };
    xhr.send();
};

function inclusionWindow(){
    //container
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "inclusionBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click",  inclusionToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "inclusionWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click",  inclusionToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("Inclusions(SEPAREATE ENTRIES WITH COMMAS_____AND/OR LINE BREAKS[,])");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var inclusionInput = document.createElement("textarea");
    inclusionInput.setAttribute("style", "width:98.5%;height:80px");
    inclusionInput.setAttribute("id", "inclusions");
    containerDiv.appendChild(inclusionInput);

    var confirmTable = document.createElement("table");
    confirmTable.setAttribute("style", "text-align:center;");
    confirmTable.setAttribute("id", "buttonTable");
    containerDiv.appendChild(confirmTable);

    var tableLastContents = document.createElement("tr");

    var tableCloseButton = document.createElement("input");
    var tableSetButton =  document.createElement("input");
    var tableClearButton = document.createElement("input");

    var tableCloseCol = document.createElement("td");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("id", "tableCloseButton");
    tableCloseButton.setAttribute("value", "Close");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click", inclusionToggle);
    tableCloseCol.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCol);

    var tableSetCol = document.createElement("td");
    tableSetButton.setAttribute("type", "button");
    tableSetButton.setAttribute("id", "tableSetButton");
    tableSetButton.setAttribute("value", "Set");
    tableSetButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableSetButton.addEventListener("click", function(){
        var list = (document.getElementById("inclusions").value).replace(new RegExp("[> ]", "g"), "");
        console.log(list);
        window.localStorage.setItem("Thread-Inclusions", list);
        if(list !== null)
            inclusionList(list);
        include = true;
        exclude = false;
        inclusionToggle();
    });
    tableSetCol.appendChild(tableSetButton);
    tableLastContents.appendChild(tableSetCol);

    var tableClearCol = document.createElement("td");
    tableClearButton.setAttribute("type", "button");
    tableClearButton.setAttribute("id", "tableClearButton");
    tableClearButton.setAttribute("value", "Clear");
    tableClearButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableClearButton.addEventListener("click", function(){
        document.getElementById("inclusions").value = "";
    });
    tableClearCol.appendChild(tableClearButton);
    tableLastContents.appendChild(tableClearCol);

    confirmTable.appendChild(tableLastContents);

    document.body.appendChild(windowDiv);
}

function inclusionList(list){
    var inclusions = list.split(/[\r\n,]/);
    var inclusionLength = inclusions.length;
    selectiveList = [];
    console.log("LIST LENGTH: " + inclusionLength);

    fullList.forEach(function(json){
        json = "" + json;
        //console.log(json);
        for (var i = 0 ; i < inclusionLength ; i++){
            //console.log(inclusions[i]);
            //console.log(json);
            if(json === inclusions[i]){
                //console.log(json);
                selectiveList.push(json);
                break;
            }
        }
    });
    //console.log(selectiveList);
}

function inclusionToggle(){
    if(windowDisplayed){
        document.getElementById("inclusionWindow").style.display = "none";
        document.getElementById("inclusionBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("inclusionWindow").style.display = "inline-block";
        document.getElementById("inclusionBackground").style.display = "inline-block";
        windowDisplayed = true;
    }
}

function inclusionButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Slide-Project: Inclusion Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:75px;right:32px");
    button.addEventListener("click", inclusionWindow);
    if(document.body === null){
        setTimeout(inclusionButton, 30);
    }
    else{
        document.body.appendChild(button);
        button.addEventListener("click", inclusionToggle);
    }
}

function inclusionRetrieval(){
    var threadInclusions = window.localStorage.getItem("Thread-Inclusions");
    console.log(threadInclusions);
    document.getElementById("inclusions").value = threadInclusions;
    if(threadInclusions !== null)
        inclusionList(threadInclusions);
}

function exclusionWindow(){
    //container
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "exclusionBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click",  exclusionToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "exclusionWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click",  exclusionToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("Exclusions(SEPAREATE ENTRIES WITH COMMAS_____AND/OR LINE BREAKS[,])");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var exclusionInput = document.createElement("textarea");
    exclusionInput.setAttribute("style", "width:98.5%;height:80px");
    exclusionInput.setAttribute("id", "exclusions");
    containerDiv.appendChild(exclusionInput);

    var confirmTable = document.createElement("table");
    confirmTable.setAttribute("style", "text-align:center;");
    confirmTable.setAttribute("id", "buttonTable");
    containerDiv.appendChild(confirmTable);

    var tableLastContents = document.createElement("tr");

    var tableCloseButton = document.createElement("input");
    var tableSetButton =  document.createElement("input");
    var tableClearButton = document.createElement("input");

    var tableCloseCol = document.createElement("td");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("id", "tableCloseButton");
    tableCloseButton.setAttribute("value", "Close");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click", exclusionToggle);
    tableCloseCol.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCol);

    var tableSetCol = document.createElement("td");
    tableSetButton.setAttribute("type", "button");
    tableSetButton.setAttribute("id", "tableSetButton");
    tableSetButton.setAttribute("value", "Set");
    tableSetButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableSetButton.addEventListener("click", function(){
        var list = (document.getElementById("exclusions").value).replace(new RegExp("[> ]", "g"), "");
        //console.log(list);
        window.localStorage.setItem("Thread-Exclusions", list);
        if(list !== null)
            exclusionList(list);
        exclude = true;
        include = false;
        exclusionToggle();
    });
    tableSetCol.appendChild(tableSetButton);
    tableLastContents.appendChild(tableSetCol);

    var tableClearCol = document.createElement("td");
    tableClearButton.setAttribute("type", "button");
    tableClearButton.setAttribute("id", "tableClearButton");
    tableClearButton.setAttribute("value", "Clear");
    tableClearButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableClearButton.addEventListener("click", function(){
        document.getElementById("exclusions").value = "";
    });
    tableClearCol.appendChild(tableClearButton);
    tableLastContents.appendChild(tableClearCol);

    confirmTable.appendChild(tableLastContents);

    document.body.appendChild(windowDiv);
}

function exclusionList(list){
    var exclusions = list.split(/[\r\n,]/);
    var excludeLength = exclusions.length;
    reducedList = [];
    fullList.forEach(function(json){
        var pass = true;
        json = "" + json;
        //console.log(json);
        for (var i = 0 ; i < excludeLength ; i++){
            //console.log(exclusions[i]);
            if(json === exclusions[i]){
                pass = false;
                break;
            }
        }
        if(pass){
            reducedList.push(json);
        }
    });
    //console.log(reducedList);
}

function exclusionToggle(){
    if(windowDisplayed){
        document.getElementById("exclusionWindow").style.display = "none";
        document.getElementById("exclusionBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("exclusionWindow").style.display = "inline-block";
        document.getElementById("exclusionBackground").style.display = "inline-block";
        windowDisplayed = true;
    }
}

function exclusionButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Slide-Project: Exclusion Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:45px;right:30px");
    button.addEventListener("click", exclusionWindow);
    if(document.body === null){
        setTimeout(exclusionButton, 30);
    }
    else{
        document.body.appendChild(button);
        button.addEventListener("click", exclusionToggle);
    }
}

function exclusionRetrieval(){
    var threadExclusions = window.localStorage.getItem("Thread-Exclusions");
    document.getElementById("exclusions").value = threadExclusions;
    if(threadExclusions !== null)
        exclusionList(threadExclusions);
}

function dictionaryWindow(){
    //container
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "dictionaryBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click",  dictionaryToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "dictionaryWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click",  dictionaryToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("Dictionary(SEPERATE ENTRIES WITH #; and NEW LINE)");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var dictionaryInput = document.createElement("textarea");
    dictionaryInput.setAttribute("style", "width:98.5%;height:80px");
    dictionaryInput.setAttribute("id", "dictionary");
    containerDiv.appendChild(dictionaryInput);

    var confirmTable = document.createElement("table");
    confirmTable.setAttribute("style", "text-align:center;");
    confirmTable.setAttribute("id", "buttonTable");
    containerDiv.appendChild(confirmTable);

    var tableLastContents = document.createElement("tr");

    var tableCloseButton = document.createElement("input");
    var tableSetButton =  document.createElement("input");
    var tableClearButton = document.createElement("input");

    var tableCloseCol = document.createElement("td");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("id", "tableCloseButton");
    tableCloseButton.setAttribute("value", "Close");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click", dictionaryToggle);
    tableCloseCol.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCol);

    var tableSetCol = document.createElement("td");
    tableSetButton.setAttribute("type", "button");
    tableSetButton.setAttribute("id", "tableSetButton");
    tableSetButton.setAttribute("value", "Set");
    tableSetButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableSetButton.addEventListener("click", function(){
        var list = (document.getElementById("dictionary").value);
        //console.log(list);
        window.localStorage.setItem("Thread-Dictionary", list);
        /*if(list !== null)
            dictionaryList(list);*/
        dictionaryToggle();
    });
    tableSetCol.appendChild(tableSetButton);
    tableLastContents.appendChild(tableSetCol);

    var tableClearCol = document.createElement("td");
    tableClearButton.setAttribute("type", "button");
    tableClearButton.setAttribute("id", "tableClearButton");
    tableClearButton.setAttribute("value", "Clear");
    tableClearButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableClearButton.addEventListener("click", function(){
        document.getElementById("dictionary").value = "";
    });
    tableClearCol.appendChild(tableClearButton);
    tableLastContents.appendChild(tableClearCol);

    confirmTable.appendChild(tableLastContents);

    document.body.appendChild(windowDiv);
}

function dictionaryList(list){
    dictionary = list.split(/#;\n/);
}

function dictionaryToggle(){
    if(windowDisplayed){
        document.getElementById("dictionaryWindow").style.display = "none";
        document.getElementById("dictionaryBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("dictionaryWindow").style.display = "inline-block";
        document.getElementById("dictionaryBackground").style.display = "inline-block";
        windowDisplayed = true;
    }
}

function dictionaryButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Slide-Project: Dictionary Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:105px;right:25px");
    button.addEventListener("click", dictionaryWindow);
    if(document.body === null){
        setTimeout(dictionaryButton, 90);
    }
    else{
        document.body.appendChild(button);
        button.addEventListener("click", dictionaryToggle);
    }
}

function dictionaryRetrieval(){
    var threadDictionary = window.localStorage.getItem("Thread-Dictionary");
    document.getElementById("dictionary").value = threadDictionary;
    if(threadDictionary !== null)
        exclusionList(threadDictionary);
}

function taggingWindow(){
    //container
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "taggingBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click",  taggingToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "taggingWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click",  taggingToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("taggings(FORMAT <KEYWORD==TAGGING>");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var taggingInput = document.createElement("textarea");
    taggingInput.setAttribute("style", "width:98.5%;height:80px");
    taggingInput.setAttribute("id", "taggings");
    containerDiv.appendChild(taggingInput);

    var confirmTable = document.createElement("table");
    confirmTable.setAttribute("style", "text-align:center;");
    confirmTable.setAttribute("id", "buttonTable");
    containerDiv.appendChild(confirmTable);

    var tableLastContents = document.createElement("tr");

    var tableCloseButton = document.createElement("input");
    var tableSetButton =  document.createElement("input");
    var tableClearButton = document.createElement("input");

    var tableCloseCol = document.createElement("td");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("id", "tableCloseButton");
    tableCloseButton.setAttribute("value", "Close");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click", taggingToggle);
    tableCloseCol.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCol);

    var tableSetCol = document.createElement("td");
    tableSetButton.setAttribute("type", "button");
    tableSetButton.setAttribute("id", "tableSetButton");
    tableSetButton.setAttribute("value", "Set");
    tableSetButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableSetButton.addEventListener("click", function(){
        var list = ((document.getElementById("taggings").value).replace(new RegExp("(\n|<)", "g"), "")).replace(new RegExp(">", "g"), "\n");
        console.log(list);
        window.localStorage.setItem("Thread-Taggings", document.getElementById("taggings").value);
        if(list !== null)
            taggingList(list);
        taggingToggle();
    });
    tableSetCol.appendChild(tableSetButton);
    tableLastContents.appendChild(tableSetCol);

    var tableClearCol = document.createElement("td");
    tableClearButton.setAttribute("type", "button");
    tableClearButton.setAttribute("id", "tableClearButton");
    tableClearButton.setAttribute("value", "Clear");
    tableClearButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableClearButton.addEventListener("click", function(){
        document.getElementById("taggings").value = "";
    });
    tableClearCol.appendChild(tableClearButton);
    tableLastContents.appendChild(tableClearCol);

    confirmTable.appendChild(tableLastContents);

    var addedInfo = document.createElement("p");
    addedInfo.setAttribute("style", "font-size:10px;text-align:center");
    var addedText = document.createTextNode(
        "Search the code for \"var tagSet = function(comment){\" to see the preset tags");
    addedInfo.appendChild(addedText);
    windowDiv.appendChild(addedInfo);

    document.body.appendChild(windowDiv);
}

function taggingList(list){
    taggings = list.split("\n");
}

function taggingToggle(){
    if(windowDisplayed){
        document.getElementById("taggingWindow").style.display = "none";
        document.getElementById("taggingBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("taggingWindow").style.display = "inline-block";
        document.getElementById("taggingBackground").style.display = "inline-block";
        windowDisplayed = true;
    }
}

function taggingButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Slide-Project: Tagging Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:135px;right:32px");
    button.addEventListener("click", taggingWindow);
    if(document.body === null){
        setTimeout(taggingButton, 30);
    }
    else{
        document.body.appendChild(button);
        button.addEventListener("click", taggingToggle);
    }
}

function taggingRetrieval(){
	var threadTaggings = window.localStorage.getItem("Thread-Taggings");
    console.log(threadTaggings);
    document.getElementById("taggings").value = threadTaggings;
    if(threadTaggings !== null)
        taggingList(threadTaggings);
}

//smallest tag determination
var smallestTagCount = 3;
var setImageFromDanbooru = function(err, data, tag1){
    if(document.getElementById("checkIMG").checked == true){
        if (err != null) {
            console.log('Something went wrong: ' + err);
            alert("Danbooru Server Did Not Perform request -- Error: "  + err);
            pageNo = 1;
            numberOfPosts = 0;
        }
        else {
            if(data == ""){
                console.log("MISS");
                smallestTag /= 1;
                smallestTagCount--;
                setPostAndPage();
                if(smallestTagCount !== 0)  getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
                return;

            }
            JSONPage = data;
            if(JSONPage.length < 20){
                numberOfPosts = Math.floor(Math.random() * 100 % JSONPage.length);
                if(pageNo == 0)
                    console.log("SMALL RESULTS: Image number " + numberOfPosts + " out of " + JSONPage.length);
            }
            while(JSONPage["" + numberOfPosts] !== undefined){
                var endURL = JSONPage["" + numberOfPosts].file_url;
                var URL = "https://danbooru.donmai.us" + endURL;
                endURLStored = JSONPage["" + numberOfPosts].file_url;
                URLStored = "https://danbooru.donmai.us" + endURL;
                imgURL = URL;

                console.log("URL: " + URL);
                console.log("PageNo: " +pageNo);
                console.log("PostNo: " +numberOfPosts);
                console.log(data["" + numberOfPosts]);
                smallestTagCount = 3;
                var fail = false;

                if(endURL === undefined ||
                   endURL.indexOf(".mp4") > -1 || endURL.indexOf(".webm") > -1 || endURL.indexOf(".swf") > -1 || endURL.indexOf(".zip") > -1){
                    numberOfPosts++;
                    if(numberOfPosts == 20){
                        numberOfPosts = 0;
                        pageNo++;
                        console.log("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1");
                        getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
                        return;
                    }
                    continue;
                }
                else if( /*JSONPage["" + numberOfPosts]["tag_string"].indexOf(tag1) == -1 && */JSONPage["" + numberOfPosts]["rating"] != "s"){
                    fail = true;;
                }

                if(fail){
                    numberOfPosts++;
                    if(numberOfPosts == 20){
                        numberOfPosts = 0;
                        pageNo++;
                        getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
                        return;
                    }
                    continue;
                }
                else{
                    if(JSONPage["" + numberOfPosts].file_size >= 4000000){
                        if( endURL.indexOf(".gif") > -1 ){
                            numberOfPosts++;
                            if(numberOfPosts == 20){
                                numberOfPosts = 0;
                                pageNo++;
                                getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
                                return;
                            }
                        }
                        var endURL = JSONPage["" + numberOfPosts].large_file_url;
                        var URL = "https://danbooru.donmai.us" + endURL;
                        endURLStored = JSONPage["" + numberOfPosts].file_url;
                        URLStored = "https://danbooru.donmai.us" + endURL;
                        imgURL = URL;
                        console.log("URL: " + URL);
                        console.log("PageNo: " +pageNo);
                        console.log("PostNo: " +numberOfPosts);
                    }
                    var xhr = new GM_xmlhttpRequest(({
                        method: "GET",
                        url: URL,
                        responseType : "arraybuffer",
                        onload: function(response)
                        {
                            var blob;
                            if(endURL.indexOf(".jpg") > -1)
                                blob = new Blob([response.response], {type:"image/jpeg"});
                            else if(endURL.indexOf(".png") > -1)
                                blob = new Blob([response.response], {type:"image/png"});
                            else if(endURL.indexOf(".gif") > -1)
                                blob = new Blob([response.response], {type:"image/gif"});


                            var name = "";
                            var r = Math.round(Math.random() * 10) % 2;
                            console.log("NAME RANDOM: " + r);
                            if(r == 0){
                                name =  endURLStored.replace(/(data|cached)/g, "");
                                name = name.replace(/\//g, "");
                            }
                            else if(r == 1){
                                name =  Date.now() + "." + blob.type.split("/")[1];
                            }
                            console.log("NAME: " + name);
                            console.log("----------------");
                            console.log("Blob: " + blob);
                            console.log("MIME: " + blob.type);
                            console.log("Name: " + name);

                            //SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
                            var detail = {file:blob, name:name};
                            if (typeof cloneInto === 'function') {
                                detail  = cloneInto(detail , document.defaultView);
                            }
                            console.log("Detail: " +detail);
                            document.getElementById("dump-list").firstChild.click();
                            document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

                            //document.getElementById("url-button").click();
                            numberOfPosts++;
                            if(numberOfPosts == 20){
                                numberOfPosts = 0;
                                pageNo++;
                            }
                        }
                    }));
                    //break condition
                    return;
                }
            }
        }
    }
};

function loli_check(comment){
                var rand = Math.floor(Math.random() * 100) % 10;
            console.log("RANDOM: " + rand);
            if(rand == 0)
                return "non_non_biyori";
            else if(rand == 1)
                return "fate/kaleid_liner_prisma_illya";
            //KANCOLLE
            else if(rand == 2){
                rand = Math.floor(Math.random() * 100) % 5;
                if(rand == 0)
                    return "ro-500_(kantai_collection)";
                else if(rand == 1)
                    return "i-58_(kantai_collection)";
                else if(rand == 2)
                    return "i-168_(kantai_collection)";
                else if(rand == 3)
                    return "i-401_(kantai_collection)";
                else if(rand == 4)
                    return "i-58_(kantai_collection)";
            }
            //FATE GO
            else if(rand == 3){
                rand = Math.floor(Math.random() * 100) % 3;
                if(rand == 0)
                    return "shuten_douji_(fate/grand_order)";
                else if(rand == 1)
                    return "elizabeth_bathory_(brave)_(fate)";
                else
                    "wu_zetian_(fate/grand_order)";
            }
            else if(rand == 4)
                return "kodama_fumika";
            //IDOLM@STER
            else if(rand == 5){
                rand = Math.floor(Math.random() * 100) % 2;
                if(rand == 0)
                    return "sakurai_momoka";
                else
                    return "futaba_anzu";
            }
            else if(rand == 6)
                return "as109";
            else if(rand == 7)
                return "ichigo_mashimaro";
            else if(rand == 8)
                return "aikatsu!";
            else if(rand == 9)
                return "northern_ocean_hime";
            else
                return "gochuumon_wa_usagi_desu_ka?";
}

function touhou_check(comment){
    if(comment.indexOf("reimu") > -1) return "hakurei_reimu";
    if(comment.indexOf("youmu") > -1 ) return "konpaku_youmu";
    if(comment.indexOf("alice") > -1 ) return "alice_margatroid";
    if(comment.indexOf("aya") > -1) return "shameimaru_aya";
    var rand = Math.floor(Math.random() * 100) % 8;
    console.log("RANDOM: " + rand);
    if(rand == 0)
        return "hijiri_byakuren";
    else if (rand == 1)
        return "reiuji_utsuho";
    else if(rand == 2)
        return "hakurei_reimu";
    else if(rand ==3)
        return "konpaku_youmu";
    else if(rand ==4)
        return "hecatia_lapislazuli";
    else if(rand ==5)
        return "kochiya_sanae";
    else if(rand == 6)
        return "Koishi Komeiji";
    else if(rand == 7)
        return "alice_margatroid";
    else
        return "yakumo_yukari";
}

var tagSet = function(comment){
    if (comment !== undefined)
        comment = comment.toLowerCase();
    console.log("Comment: " + comment);

    var customTaggings = [];
    taggings.forEach(function(e){
        customTaggings.push(e);
    })
    console.log(customTaggings);

    if(document.getElementById("checkReactiveIMG").checked == true && comment !== undefined){

        for (var i = 0 ;  i < customTaggings.length; i++){
            if(customTaggings[i] == "") continue;
            customTaggings[i] = customTaggings[i].split("==");
            console.log(customTaggings[i]);
            console.log(new RegExp("(^| |;)" + customTaggings[i][0]+ "($| |;)"));
            if(comment.match(new RegExp("(^| |;)" + customTaggings[i][0]+ "($| |;)"))) return customTaggings[i][1];

        }
console.log("CUSTOMS FAIL");
        //PLACE NEW ENTRIES INSIDE HERE

        //HOW TO ADD ENTRIES:
        //-----------THE FORMAT--------------
        // if(comment.indexOf("THE WORD IN THE OP's POST") > -1 ) return "THE_DANBOORU_TAG_IT_WILL_USE_TO_GET_AN_IMAGE";

        if(comment.indexOf("biplane") > -1 ) return "aircraft";
        if(comment.indexOf("akatsuki") > -1 ) return "akatsuki_(kantai_collection)"
        if(( comment.indexOf("anya") > -1 || comment.indexOf("anastasia") > -1 )&& comment.indexOf("sanya") == -1) return "anastasia_(idolmaster)"
        if(comment.indexOf("homu") > -1) return "Akemi_Homura";
        if(comment.indexOf("akitsu maru") > -1) return "akitsu_maru_(kantai_collection)";
        if(comment.indexOf("alice") > -1 ) return "alice_margatroid";
        if(comment.indexOf("asashio") > -1 ) return "asashio_(kantai_collection)"
        if(comment.indexOf("aya") > -1) return "shameimaru_aya";

         if(comment.indexOf("humilitat") > -1 ||comment.indexOf("knot") > -1 ) return "bondage";

        if(comment.match(new RegExp(/cat /)) || comment.indexOf("neko") > -1) return "cat_ears"
        if(comment.match(new RegExp(/hey\nho/))) return "cheerleader"
        if(comment.indexOf("chess") > -1) return "chess_piece"
        if(comment.indexOf("cirno") > -1) return "cirno"
        if(comment.indexOf("code geass") > -1 ){
            var rand = Math.floor(Math.random() * 100) % 2;
            if(rand == 0)
                return "kururugi_suzaku";
            else
                return "lelouch_lamperouge";
        }

        if(comment.indexOf("tanning") > -1) return "dark_skin";
        if(comment.indexOf("dagashi kashi") > -1) return "dagashi_kashi";
        if(comment.indexOf("donut") > -1) return "doughnut"
        if(comment.indexOf("pet") > -1) return "dog";

        if(comment.indexOf("eureka") > -1) return "eureka_seven_(series)";

        if(comment.indexOf("fate") > -1) return "fate_(series)";
        if(comment.indexOf("fireworks") > -1) return "fireworks"

        if(comment.indexOf("halloween") > -1) return "halloween";
        if(comment.indexOf("euphonium") > -1) return "hibike!_euphonium"
        if(comment.indexOf("raythalosm") > -1 || comment.indexOf("hibiki") > -1) return "hibiki_(kantai_collection)"
         if(comment.indexOf("pleiades")>-1) return"houkago_no_pleiades";
        if(comment.indexOf("mushroom") > -1) return "hoshi_shouko";

        if(comment.indexOf("fire") > -1 || comment.indexOf("flame") > -1) return "fire";
        if(comment.indexOf("flower") > -1) return "flower";

        if(comment.indexOf("gangut") > -1 || comment.indexOf("seamen") > -1) return "gangut_(kantai_collection)";

        if(comment.indexOf("burger") > -1) return "hamburger";
        if(comment.indexOf("hand holding") > -1) return "hand_holding"
        if(comment.indexOf("hecatia") > -1) return "hecatia_lapislazuli";
        if(comment.indexOf("tenshi") > -1 || comment.match(/eating a .* so cute/)) return "hinanawi_tenshi";
        if(comment.indexOf("enjoyee") > -1 || comment.indexOf("nue") > -1) return "houjuu_nue"
        if(comment.indexOf("horo") > -1) return "holo";

                if(comment.indexOf("iowa") > -1) return "iowa_(kantai_collection)";

        if(comment.indexOf("kantoku") > -1) return "kantoku"
        if(comment.indexOf("daisuki") > -1 || comment.indexOf("キッス") > -1) return "kiss";
        if(comment.indexOf("kizuna") > -1) return "kizuna_ai"
        if(comment.indexOf("animal") > -1 || comment.indexOf("friend") > -1) return "kemono_friends";
        if(comment.indexOf("komeiji") > -1 ) return "komeiji_koishi";
        if(comment.indexOf("satori") > -1 ) return "komeiji_satori";
        if(comment.indexOf("kotatsu") > -1 ) return "kotatsu";

        if(comment.indexOf("maid") > -1) return "maid";
        if(comment.indexOf("madotsuki") > -1 ) return "madotsuki"
        if(comment.match(new RegExp(/$ze^/))) return "kirisame_marisa"
        if(comment.indexOf("snail") > -1 ) return "hachikuji_mayoi"
        if(comment.indexOf("mecha musume") > -1 ) return "mecha_musume"
        if(comment.indexOf("mika") > -1 && comment.indexOf("panzer") > -1) return "mika_(girls_und_panzer)"
        if(comment.indexOf("moon") > -1 ) return "moon"
        if(comment.indexOf("musashi") > -1 ) return "musashi_(kantai_collection)"

        if((comment.indexOf("loli") > -1 || comment.indexOf("pedophile") > -1) && comment.indexOf("nadeko") == -1) return loli_check(comment);

        if(comment.indexOf("sandbox") > -1 ) return "playground";

        if(comment.indexOf("nadeko") > -1 ) return "sengoku_nadeko"
        if(comment.indexOf("board freeze") > -1) return "neptune_(choujigen_game_neptune)"
        if(comment.indexOf("nico nico") > -1 ) return "yazawa_nico"

        if(comment.indexOf("one-piece") > -1) return "one-piece_swimsuit";
        if(comment.indexOf("onigiri") > -1) return "onigiri";

        if(comment.indexOf("penguin") > -1) return "penguin";
        if(comment.indexOf("pleated skirt") > -1) return "pleated_skirt";
        if(comment.indexOf("pout") > -1) return "pout";

        if(comment.indexOf("reimu") > -1) return "hakurei_reimu";
        if(comment.indexOf("reisen") > -1) return "reisen_udongein_inaba";
        if(comment.indexOf("gorgon") > -1 || comment.indexOf("rider") > -1) return "rider";
        if(comment.indexOf("ro-500") > -1) return "ro-500_(kantai_collection)";
        if(comment.indexOf("rwby") > -1) return "rwby";

        if(comment.indexOf("saber") > -1 ) return "saber";
        if(comment.indexOf("sachiko") > -1 || comment.indexOf("/qa/") > -1 ) return "koshimizu_sachiko"
        if(comment.indexOf("sanae") > -1 ) return "kochiya_sanae";
        if(comment.indexOf("sanya") > -1 ) return "sanya_v_litvyak"
        if(comment.indexOf("sayaka") > -1 ) return "miki_sayaka"
        if(comment.indexOf("sawamura") > -1 ) return "sawamura_spencer_eriri"
        if(comment.indexOf("short pants") > -1) return "shorts";
        if(comment.indexOf("shinobu") > -1 ) return "oshino_shinobu"
        if(comment.indexOf("seifuku") > -1 ) return "serafuku"
        if(comment.indexOf("serval") > -1 ) return "serval_(kemono_friends)";
        if(comment.indexOf("skeleton") > -1 ) return "skeleton"
        if(comment.indexOf("stripe") > -1 ) return "shimakaze_(kantai_collection)"
        if((comment.indexOf("smile") > -1 || comment.indexOf("nice") > -1 ) && comment.indexOf("youmu") == -1 ){
            var rand = Math.floor(Math.random() * 100) % 3;
            console.log("RANDOM: " + rand);
            if(rand == 0)
                return "smiley_face" ;
            else  if(rand == 1)
                return "happy";
            else
                return "^_^";
        }
        if(comment.indexOf("snow") > -1) return "snow";
        if(comment.indexOf("feet") > -1) return "soles";
        if(comment.indexOf("exercise") > -1) return "bike_shorts";
        if(comment.indexOf("desu") > -1) return "suiseiseki";

        if(comment.match(new RegExp(/(^| )tea($| )/g))) return "tea";
        if(comment.indexOf("tewi") > -1) return "inaba_tewi";
        if(comment.indexOf("touhou") > -1 || comment.indexOf("2hu") > -1 ) return touhou_check(comment);
        if(comment.indexOf("yohane") > -1) return "tsushima_yoshiko";
        if(comment.indexOf("twintail") > -1) return "twintails";

        if(comment.indexOf("vegitation") > -1 || comment.indexOf("vegetation") > -1 ){
            var rand = Math.floor(Math.random() * 100) % 2;
            if(rand == 0)
                return "flower_field";
            else
                return "tree";
        }
        if(comment.indexOf("generals for lazy people guide") > -1) return "washing_machine";
        if(comment.indexOf("witch") > -1) return "witch_hat";

        if(comment.indexOf("yamato") > -1 ) return "yamato_(kantai_collection)"
        if(comment.indexOf("youmu") > -1 ) return "konpaku_youmu";
        if(comment.indexOf("yotsuba") > -1 ) return "yotsubato!";
        if(comment.indexOf("poi?") > -1 ) return "yuudachi_(kantai_collection)";
        if(comment.indexOf("ゆっくり") > -1) return "yukkuri_shiteitte_ne";
        if(comment.indexOf("yuri") > -1) return "yuri";

        if(comment.indexOf("zzz") > -1) return "sleeping";
    }
    //PLACING THEM HERE WILL CHANGE THE DEFAULT IMAGE
    //THIS IS THE DEFAULT IMAGE TAG
    if(true) return "";
}

var setPost = function(URL){
    var xhr = new GM_xmlhttpRequest(({
        method: "GET",
        url: URL,
        responseType : "json",
        onload: function(data){
            data = data.response;
            console.log(URL);
            console.log(data);
            smallestTag = parseInt(data[0]["post_count"]);
            setPostAndPage();
            if(data[0]["name"] == "1girl") data[0]["name"]  = "";
            console.log("Tag1-SP: " + data[0]["name"]);
            getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + data[0]["name"] + "+rating%3Asafe&ms=1", setImageFromDanbooru, data[0]["post_count"]);
        }}));
}

var eventHeard = false;

var qrWindow;

var fileBar;
var threadSelect;
var textArea;
var addPost;
var dumpContainer;

var optionList;
var optionLength;
var inputString ;
var endString ;

var start;
var delay;
var now;

var threadsBack = 3;

function enhance4ChanX(){
    fileBar = document.getElementById("file-n-submit");

    if(!(exclude || include)){
        var qrWindow = document.getElementById("qr");
        if(document.getElementById("qrEnhanced") !== null) qrWindow.removeChild(document.getElementById("qrEnhanced"));
        var enhancementTable = document.createElement("table");
        enhancementTable.setAttribute("style", "text-align:center");
        enhancementTable.setAttribute("id", "qrEnhanced");
        qrWindow.appendChild(enhancementTable);

        var bottomRow = document.createElement("tr");
        var instrctions = document.createElement("p");
        var instrctionsText = document.createTextNode("Set either Inclusion or Exclusion bump types from the buttons on the top right.");
        instrctions.appendChild(instrctionsText);
        instrctions.appendChild(document.createElement("br"));
        instrctionsText = document.createTextNode("After done, reopen this window.");
        instrctions.appendChild(instrctionsText);
        bottomRow.appendChild(instrctions);
        enhancementTable.appendChild(bottomRow);
    }
    else if((exclude || include)){
        var qrWindow = document.getElementById("qr");
        if(document.getElementById("qrEnhanced") !== null) qrWindow.removeChild(document.getElementById("qrEnhanced"));
        var enhancementTable = document.createElement("table");
        enhancementTable.setAttribute("style", "text-align:center");
        enhancementTable.setAttribute("id", "qrEnhanced");
        qrWindow.appendChild(enhancementTable);

        var dList = document.getElementById("dump-list");
        var filenamecontainer = document.getElementById("qr-filename-container");
        var BGImg = "";
        var oldBGImg = "";

        var observer = new MutationObserver(function(mutate){
            BGImg = dList.firstChild.style.backgroundImage;
            if(BGImg !== oldBGImg && imgURL !== ""){
                console.log("CHANGED");
                dList.firstChild.style.backgroundImage = "url(" + imgURL + ")";
                console.log("CHANGED");
                oldBGImg = dList.firstChild.style.backgroundImage;
                console.log("CHANGED");
                console.log(imgURL);
            }
            else if (imgURL == ""){

            }
        });
        observer.observe(dList , {attributes: true,subtree:true, childList: true, characterData: true });

        document.getElementById("qr-filerm").addEventListener("click", function(){imgURL = "";});

        //modify settings
        qrWindow.setAttribute("class", "dialog reply-to-thread has-captcha captcha-v1 dump");
        threadSelect = qrWindow.childNodes[0].childNodes[2];
        textArea = qrWindow.childNodes[1].childNodes[1].childNodes[0];
        addPost = document.getElementById("add-post");
        dumpContainer = document.getElementById("dump-list");
        //console.log(textArea);
        while (threadSelect.firstChild) {
            threadSelect.removeChild(threadSelect.firstChild);
        }
        var i = 0;
        if(exclude) reducedList.forEach(function(thread){
            var option = document.createElement("option");
            option.setAttribute("value", thread);
            var optionText = document.createTextNode("Thread " + thread);
            option.appendChild(optionText);
            threadSelect.appendChild(option);
        });
        else selectiveList.forEach(function(thread){
            var option = document.createElement("option");
            option.setAttribute("value", thread);
            var optionText = document.createTextNode("Thread " + thread);
            option.appendChild(optionText);
            threadSelect.appendChild(option);
        });

        var buttonRow = document.createElement("tr");
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("style", "width:100%");
        button.setAttribute("value", "SET BUMP QUEUE");
        button.addEventListener("click", function(){
            qrWindow = document.getElementById("qr");
            fileBar = document.getElementById("file-n-submit");
            threadSelect = qrWindow.childNodes[0].childNodes[2];
            textArea = qrWindow.childNodes[1].childNodes[1].childNodes[0];
            addPost = document.getElementById("add-post");
            dumpContainer = document.getElementById("dump-list");

            optionList = threadSelect.childNodes;
            optionLength = optionList.length;
            inputString = ">>";;
            endString = "\n";

            if(document.getElementById("checkDictionary").checked == true){
                dictionary = [];
                var list = (document.getElementById("dictionary").value);
                //console.log(list);
                window.localStorage.setItem("Thread-Dictionary", list);
                if(list !== null)
                    dictionaryList(list);

                console.log("dictionary");
            }

//             if(document.getElementById("radioFore").checked == true){         /////////TODO
//                 //FILL THE ENTIRE QUEUE AT ONCE
//                 len = 0;
//                 var dictionaryLength = dictionary.length;
//                 console.log(dictionary.length);
//                 while(len < optionLength){
//                     optionList[len].selected = true;
//                     if(dictionaryLength == 0)  textArea.value = inputString + optionList[len].value + endString;
//                     else  textArea.value = inputString + optionList[len].value + endString + dictionary[Math.floor(Math.random() * 1000000) % (dictionaryLength - 1)];
//                     addPost.click();
//                     len++;
//                 }
//                 var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[optionLength - 1].value))]);
//                 console.log("Tag1: " + tag1);
//                 getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);

//                 //MOVE THE ENTRIES
//                 if(document.getElementById("checkReactive").checked == true){
//                     var fileBar = document.getElementById("file-n-submit");
//                     fileBar.childNodes[2].addEventListener("click", function(){
//                         if(!set){
//                             //console.log("A1");
//                             //dumpContainer.removeChild(dumpContainer.lastChild);
//                             set = true;
//                             var startTime =  Date.now();
//                             var fireTime =Date.now();
//                             var stageOne = false;
//                             if(document.getElementById("checkSpoofing").checked == true){
//                                 var fireInterval = (10000 + 3 *  Math.floor(Math.random() * 10000));
//                                 var loadInterval = 50000;
//                             }
//                             else{
//                                 var loadInterval = 17000;
//                             }
//                             setInterval(function(){
//                                 var currentTime = Date.now();
//                                 var spoof = document.getElementById("checkSpoofing").checked == true;
//                                 if(spoof && stageOne && (currentTime - fireTime) > fireInterval){
//                                     console.log("----FIRED---- " + (currentTime - fireTime) + ">" + fireInterval);
//                                     fileBar.childNodes[2].click();
//                                     startTime =  Date.now();
//                                     fireTime = Date.now();

//                                     fireInterval = (10000 + 3 *  Math.floor(Math.random() * 10000));

//                                     stageOne = false;
//                                 }
//                                 else if((currentTime - startTime) > loadInterval && !stageOne){
//                                     console.log("----LOADING---- " + (currentTime - startTime));
//                                     startTime =  Date.now();
//                                     fireTime = Date.now();
//                                     if(spoof){
//                                         fileBar.childNodes[2].click();
//                                         stageOne = true;
//                                     }

//                                     fullList = [];
//                                     OPList = [];
//                                     //console.log("A2");
//                                     getJSON('https://a.4cdn.org/'+ board+ '/catalog.json', function(err, data) {
//                                         if (err != null) {
//                                             console.log('Something went wrong: ' + err);
//                                         } else {
//                                             var i = 0;
//                                             data.forEach(function(ele){
//                                                 ele["threads"].forEach(function(e){
//                                                     i++;
//                                                     fullList.push(e["no"]);
//                                                     OPList.push(e["com"]);
//                                                 });
//                                             });
//                                             console.log(i);
//                                         }
//                                         var ele = document.forms[1].getElementsByTagName("A");
//                                         var len = ele.length;

//                                         //console.log(fullList);
//                                         //console.log(selectiveList);
//                                         if(include){
//                                             var list = (document.getElementById("inclusions").value).replace(new RegExp("[> ]", "g"), "");
//                                             //console.log(list);
//                                             window.localStorage.setItem("Thread-Inclusions", list);
//                                             if(list !== null)
//                                                 inclusionList(list);

//                                         }
//                                         else{
//                                             var list = (document.getElementById("exclusions").value).replace(new RegExp("[> ]", "g"), "");
//                                             //console.log(list);
//                                             window.localStorage.setItem("Thread-Exclusions", list);
//                                             if(list !== null)
//                                                 exclusionList(list);
//                                         }
//                                         for (var i = 0 ; i < len ; i++){
//                                             var item = ele.item(i);
//                                             //console.log(item.className);
//                                             if(item.className == "catalog-link"){
//                                                 item.removeEventListener("click", getURL);
//                                                 item.addEventListener("click", getURL);
//                                                 //console.log(item);
//                                             }
//                                         }

//                                         while (threadSelect.hasChildNodes()) {
//                                             threadSelect.removeChild(threadSelect.lastChild);
//                                         }
//                                         if(exclude) reducedList.forEach(function(thread){
//                                             //console.log(thread);
//                                             var option = document.createElement("option");
//                                             option.setAttribute("value", thread);
//                                             var optionText = document.createTextNode("Thread " + thread);
//                                             option.appendChild(optionText);
//                                             threadSelect.appendChild(option);
//                                         });
//                                         else selectiveList.forEach(function(thread){
//                                             //console.log(thread);
//                                             var option = document.createElement("option");
//                                             option.setAttribute("value", thread);
//                                             var optionText = document.createTextNode("Thread " + thread);
//                                             option.appendChild(optionText);
//                                             threadSelect.appendChild(option);
//                                         });

//                                         //REARANGE DUMP LIST
//                                         /*
//                                 selectiveList.reverse();
//                                 reducedList.reverse();
//                                 var dcNodes = dumpContainer.childNodes;
//                                 var i = 0;
//                                 if(exclude) reducedList.forEach(function(thread){
//                                     dcNodes.forEach(function(node){
//                                         var strings = node.childNodes[2].textContent.split("\n");
//                                         strings[0] = strings[0].replace(/[!$%^&*()_+ \->a-zA-Z]+/g, "");
//                                         if(parseInt(strings[0]) == thread){
//                                             console.log(thread);
//                                             dumpContainer.appendChild(node.cloneNode(true));
//                                             dumpContainer.removeChild(node);
//                                         }
//                                     });
//                                 });
//                                 else selectiveList.forEach(function(thread){
//                                     dcNodes.forEach(function(node){
//                                         var strings = node.childNodes[2].textContent.split("\n");
//                                         strings[0] = strings[0].replace(/[!$%^&*()_+ \->a-zA-Z]+/g, "");
//                                         if(parseInt(strings[0]) == thread){
//                                             console.log(thread);
//                                             dumpContainer.appendChild(node.cloneNode(true));
//                                             dumpContainer.removeChild(node);
//                                         }
//                                     });
//                                 });*/

//                                         //DESTROY AND REMAKE CONTAINER
//                                         //console.log("exec");
//                                         optionLength = optionList.length;

//                                         console.log(list);
//                                         console.log(optionList);
//                                         console.log(optionLength);
//                                         console.log(reducedList);
//                                         console.log(selectiveList);
//                                         console.log(fullList);


//                                         while (dumpContainer.childNodes.length !== 1) {
//                                             dumpContainer.firstChild.childNodes[0].click();
//                                         }
//                                         //FILL THE ENTIRE QUEUE AT ONCE
//                                         len = 0;
//                                         var dictionaryLength = dictionary.length;
//                                         console.log(dictionary.length);
//                                         while(len < optionLength){
//                                             optionList[len].selected = true;
//                                             if(dictionaryLength == 0)  textArea.value = inputString + optionList[len].value + endString;
//                                             else  textArea.value = inputString + optionList[len].value + endString + dictionary[Math.floor(Math.random() * 1000000) % (dictionaryLength - 1)];
//                                             addPost.click();
//                                             len++;
//                                         }

//                                         var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[optionLength - 1].value))]);
//                                         console.log(OPList);
//                                         console.log(optionList[optionLength - 1].value);
//                                         console.log(fullList.indexOf(parseInt(optionList[optionLength - 1].value)));
//                                         getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);

//                                         //RETRIEVE FROM JSON["CURRENT IMAGE NUMBER"] ---- USE FUNCTION()
//                                         //INCREASE CURRENT IMAGE NUMBER
//                                         //SET FIRST POST'S IMAGE

//                                         /*
//                                         fileBar.childNodes[2].click();
//                                         fileBar.childNodes[2].click();
//                                         */
//                                     }
//                                            );
//                                 }
//                             }, 1000);
//                         }
//                     });
//                 }
//                 else{
//                     fileBar.childNodes[2].addEventListener("click", function(){
//                         if(!set){

//                             document.addEventListener('QRPostSuccessful', function(e) {
//                                 threadSelect.removeChild(threadSelect.lastChild);
//                                 optionLength = optionList.length;
//                             }, false);

//                             set = true;
//                             var startTime =  Date.now();
//                             var fireTime =Date.now();
//                             var stageOne = false;
//                             var spoof = document.getElementById("checkSpoofing").checked == true;
//                             if(spoof){
//                                 var fireInterval = (10000 + 3 *  Math.floor(Math.random() * 10000));
//                                 var loadInterval = 50000;
//                             }
//                             else{
//                                 var loadInterval = 20000;
//                             }
//                             setInterval(function(){
//                                 var currentTime = Date.now();
//                                 spoof = document.getElementById("checkSpoofing").checked == true;
//                                 if(spoof  && stageOne && (currentTime - fireTime) > fireInterval){
//                                     console.log("----FIRED---- " + (currentTime - fireTime) + ">" + fireInterval);
//                                     fileBar.childNodes[2].click();
//                                     startTime =  Date.now();
//                                     fireTime = Date.now();

//                                     fireInterval = (10000 + 3 *  Math.floor(Math.random() * 10000));

//                                     stageOne = false;
//                                 }
//                                 else if((currentTime - startTime) > loadInterval && !stageOne){
//                                     console.log("----LOADING---- " + (currentTime - startTime));
//                                     startTime =  Date.now();
//                                     fireTime = Date.now();
//                                     if(spoof){
//                                         fileBar.childNodes[2].click();
//                                         stageOne = true;
//                                     }

//                                     var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[threadSelect.selectedIndex].value))]);
//                                     console.log("Tag1: " + tag1);
//                                     getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
//                                 }
//                             }, 1000);
//                         }
//                     });
//                 }

//             }
            /*else*/ if(document.getElementById("radioBack").checked == true){         /////////TODO
                //FILL THE ENTIRE QUEUE AT ONCE

                var oLen = optionList.length ;
                len = optionLength - 1;
                var dictionaryLength = dictionary.length;
                console.log(dictionary.length);
                do{
                    optionList[len].selected = true;
                    if(dictionaryLength == 0)  textArea.value = inputString + optionList[len].value + endString;
                    else  textArea.value = inputString + optionList[len].value + endString + dictionary[Math.floor(Math.random() * 1000000) % (dictionaryLength - 1)];
                    addPost.click();
                    len--;
                    // console.log("len: " + len + " oLen: " + (oLen - (oLen / 5)));
                }  while (exclude && ((len >= (oLen- (oLen / 5)) && oLen > 4) || (len >= 0 && oLen <= 4)) || (include && len >= 0));
                var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[optionLength - 1].value))]);

                setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");

                //MOVE THE ENTRIES
                if(document.getElementById("checkReactive").checked == true){
                    var fileBar = document.getElementById("file-n-submit");
                    fileBar.childNodes[2].addEventListener("click", function(){
                        if(!set){
                            document.addEventListener('QRPostSuccessful', function(e) {
                                setTimeout(function(){
                                    document.getElementById("dump-list").firstChild.click();
                                    var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[threadSelect.selectedIndex].value))]);
                                    console.log("Tag1-QRPS: " + tag1);
                                    console.log(threadSelect.selectedIndex);
                                    console.log(OPList);
                                    console.log(fullList);
                                    console.log(optionList);

                                    setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
                                    console.log("URLStored-QRPS: " + URLStored);
                                    refreshedTimes = Math.ceil(60000/loadInterval);
                                    console.log("RTimes-START: " + refreshedTimes)
                                    topThread = optionList[threadSelect.selectedIndex].value;
                                },3000);

                            }, false);
                            //console.log("A1");
                            //dumpContainer.removeChild(dumpContainer.lastChild);
                            set = true;
                            var startTime =  Date.now();
                            var fireTime = Date.now();
                            var stageOne = false;
                            if(document.getElementById("checkSpoofing").checked == true){
                                var fireInterval = (10000 + 3 *  Math.floor(Math.random() * 10000));
                                var loadInterval = 50000;
                            }
                            else{
                                var loadInterval = 18000;
                            }

                            refreshedTimes = Math.ceil(60000/loadInterval);
                            console.log("RTimes-START: " + refreshedTimes)

                            console.log("ABCDEF");

                            document.addEventListener('PostsInserted', function(e) {
                                console.log("ref")
                            }, false);

                            setInterval(function(){

                                var ele = document.forms[1].getElementsByTagName("A");
                                var len = ele.length;

                                for (var i = 0 ; i < len ; i++){
                                    var item = ele.item(i);
                                    //console.log(item.className);
                                    if(item.className == "catalog-link"){
                                        item.removeEventListener("click", getURL);
                                        item.addEventListener("click", getURL);
                                        //console.log(item);
                                    }
                                }

                                getJSON('https://a.4cdn.org/' + board +'/catalog.json', function(err, data) {
                                    var lastOffset = 0;
                                    eventHeard = false;

                                    //threadSelect =  qrWindow.childNodes[0].childNodes[2];
                                    reducedList = [];
                                    selectiveList = [];
                                    fullList = [];
                                    OPList = [];

                                    if (err != null) {
                                        console.log('Something went wrong: ' + err);
                                    } else {
                                        var i = 0;
                                        data.forEach(function(ele){
                                            ele["threads"].forEach(function(e){
                                                i++;
                                                fullList.push(e["no"]);
                                                OPList.push(e["com"]);
                                            });
                                        });
                                        console.log(i);
                                    }

                                    //console.log(fullList);
                                    //console.log(selectiveList);
                                    if(include){
                                        var list = (document.getElementById("inclusions").value).replace(new RegExp("[> ]", "g"), "");
                                        //console.log(list);
                                        window.localStorage.setItem("Thread-Inclusions", list);
                                        if(list !== null)
                                            inclusionList(list);
                                        else{
                                            console.log("--------LIST RETURN---------")
                                            return;
                                        }
                                    }
                                    else{
                                        var list = (document.getElementById("exclusions").value).replace(new RegExp("[> ]", "g"), "");
                                        //console.log(list);
                                        window.localStorage.setItem("Thread-Exclusions", list);
                                        if(list !== null)
                                            exclusionList(list);
                                        else{
                                            console.log("--------LIST RETURN---------")
                                            return;
                                        }
                                    }

                                    while (dumpContainer.childNodes.length !== 1 && !eventHeard) {
                                        dumpContainer.firstChild.childNodes[0].click();
                                    }

                                    while (threadSelect.hasChildNodes()) {
                                        threadSelect.removeChild(threadSelect.lastChild);
                                    }

                                    if(exclude){
                                        var rLen = reducedList.length;
                                        for(var x = 0 ; x < rLen - lastOffset ; x++){
                                            var option = document.createElement("option");
                                            option.setAttribute("value", reducedList[x]);
                                            var optionText = document.createTextNode("Thread " + reducedList[x]);
                                            option.appendChild(optionText);
                                            threadSelect.appendChild(option);
                                        }
                                    }
                                    else{
                                        var sLen = selectiveList.length;
                                        for(var x = 0 ; x < sLen - lastOffset ; x++){
                                            var option = document.createElement("option");
                                            option.setAttribute("value", selectiveList[x]);
                                            var optionText = document.createTextNode("Thread " + selectiveList[x]);
                                            option.appendChild(optionText);
                                            threadSelect.appendChild(option);
                                        }
                                    }
                                    //REARANGE DUMP LIST

                                    //DESTROY AND REMAKE CONTAINER
                                    //console.log("exec");
                                    optionList = threadSelect.childNodes;
                                    optionLength = optionList.length;

                                    console.log(list);
                                    console.log(optionList);
                                    console.log(optionLength);
                                    console.log(reducedList);
                                    console.log(selectiveList);
                                    console.log(fullList);

                                    //FILL THE ENTIRE QUEUE AT ONCE
                                    len = optionLength - 1;
                                    var dictionaryLength = dictionary.length;
                                    console.log(len);
                                    //dumpContainer.firstChild.click();
                                    //console.log(dumpContainer);
                                    //addPost.click();
                                    //dumpContainer.childNodes[1].click();
                                    var oLen = optionList.length ;
                                    do{
                                        optionList[len].selected = true;
                                        if (dictionaryLength == 0) textArea.value = inputString + optionList[len].value + endString;
                                        else  textArea.value = inputString + optionList[len].value + endString + dictionary[Math.floor(Math.random() * 1000000) % (dictionaryLength - 1)];
                                        addPost.click();
                                        len--;
                                    }while (exclude && ((len >= (oLen- (oLen / 5)) && oLen > 4) || (len >= 0 && oLen <= 4)) || (include && len >= 0));

                                    if(eventHeard) return;

                                    if(JSONPage["" + numberOfPosts].file_size >= 4000000){
                                        if( endURLStored === undefined || endURLStored.indexOf(".gif") > -1  ){
                                            numberOfPosts++;
                                            if(numberOfPosts == 20){
                                                numberOfPosts = 0;
                                                pageNo++;
                                                setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
                                                return;
                                            }
                                        }
                                        endURLStored = JSONPage["" + numberOfPosts].large_file_url;
                                        URLStored = "https://danbooru.donmai.us" + endURLStored;
                                        console.log("URLStored: " +  URLStored);
                                        console.log("PageNo: " +pageNo);
                                        console.log("PostNo: " +numberOfPosts);
                                    }
                                    console.log("URLStored-3: " + URLStored);

                                    console.log("TT: " + topThread);
                                    document.getElementById("dump-list").firstChild.click();
                                    if(topThread === optionList[optionList.length - 1].value){
                                        console.log("IMG REFRESH");
                                        console.log(topThread + " " + optionList[optionList.length - 1].value);
                                        if(endURLStored === undefined || URLStored == undefined){
                                            var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[optionList.length - 1].value))]);
                                            setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
                                        }
                                        else{
                                            var xhr = new GM_xmlhttpRequest(({
                                                method: "GET",
                                                url: URLStored,
                                                responseType : "arraybuffer",
                                                onload: function(response)
                                                {
                                                    if(eventHeard) return;
                                                    var blob;
                                                    if( endURLStored.indexOf(".jpg") > -1)
                                                        blob = new Blob([response.response], {type:"image/jpeg"});
                                                    else if( endURLStored.indexOf(".png") > -1)
                                                        blob = new Blob([response.response], {type:"image/png"});
                                                    else if( endURLStored.indexOf(".gif") > -1)
                                                        blob = new Blob([response.response], {type:"image/gif"});

                                                    var name = "";
                                                    var r = Math.round(Math.random() * 10) % 2;
                                                    console.log("NAME RANDOM: " + r);
                                                    if(r == 0){
                                                        name =  endURLStored.replace(/(data|cached)/g, "");
                                                        name = name.replace(/\//g, "");
                                                    }
                                                    else if(r == 1){
                                                        name =  Date.now() + "." + blob.type.split("/")[1];
                                                    }
                                                    console.log("NAME: " + name);

                                                    console.log("----------------");
                                                    console.log("URL: " + URLStored);
                                                    console.log("Blob: " + blob);
                                                    console.log("MIME: " + blob.type);
                                                    console.log("Name: " + name);

                                                    //SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
                                                    var detail = {file:blob, name:name};
                                                    if (typeof cloneInto === 'function') {
                                                        detail  = cloneInto(detail , document.defaultView);
                                                    }
                                                    console.log("Detail: " +detail);
                                                    document.getElementById("dump-list").firstChild.click();
                                                    document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));


                                                    refreshedTimes--;
                                                    console.log("RTimes: " + refreshedTimes)
                                                    if(refreshedTimes < 0 && refreshedTimes % 2 == -1){
                                                        console.log("A");
                                                        console.log(fileBar.childNodes[2])
                                                        fileBar.childNodes[2].click();
                                                        return;
                                                    }
                                                    else if(refreshedTimes < 0 && refreshedTimes % 2 == 0){
                                                        console.log("B");
                                                        console.log(fileBar.childNodes[3])
                                                        fileBar.childNodes[3].click();
                                                        return;
                                                    }
                                                }
                                            }));
                                        }
                                    }
                                    else{
                                        console.log("IMG SWITCH");
                                        var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[optionList.length - 1].value))]);
                                        setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
                                        refreshedTimes = Math.ceil(60000/loadInterval);
                                        console.log("RTimes-START: " + refreshedTimes)
                                    }
                                    topThread = optionList[optionList.length - 1].value;

                                }
                                       );
                            }, 20000);
                        }
                    });
                }
            }
            // else if(document.getElementById("radioChronological").checked == true){
            //     /////////MAKE REFERESH WITH IMAGES AND ADD IN DICTIONARY LOGIC
            //     i = 0;
            //     var orderedIndices = [];
            //     for (var i = 0 ; i < optionLength; i++) orderedIndices.push([i, optionList[i].value]);
            //     for (var i = 0 ; i < optionLength ; i++){
            //         for (var j = 0 ; j < optionLength ; j++){
            //             if(orderedIndices[i][1] < orderedIndices[j][1] ){
            //                 var temp = orderedIndices[j];
            //                 orderedIndices[j] = orderedIndices[i];
            //                 orderedIndices[i] = temp;
            //             }
            //         }
            //     }
            //     i = 0;
            //     console.log (orderedIndices);
            //     var dictionaryLength = dictionary.length;
            //     while(i < optionLength){
            //         optionList[orderedIndices[i][0]].selected = true;
            //         if(dictionaryLength == 0) textArea.value = inputString + orderedIndices[i][1] + endString;
            //         else  textArea.value = inputString + orderedIndices[i][1] + endString + dictionary[Math.floor(Math.random() * 1000) % (dictionaryLength - 1)];
            //         addPost.click();
            //         i++;
            //     }
            //     setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
            //     if(!set){
            //         set = true;
            //         setTimeout(
            //             setInterval(function(){
            //                 setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
            //             }, 20000)
            //             ,5000);
            //     }
            // }
        });
        buttonRow.appendChild(button);
        enhancementTable.appendChild(buttonRow);

        var styleRow = document.createElement("tr");
        // var labelFore = document.createElement("label");
        // //var labelTextFore = document.createTextNode("BUMP FROM TOP");
        // var labelTextFore = document.createTextNode("N/A");
        // labelFore.appendChild(labelTextFore);
        // var radioFore = document.createElement("input");
        // radioFore.setAttribute("type", "radio");
        // radioFore.setAttribute("id", "radioFore");
        // radioFore.setAttribute("name", "settings");
        var labelBack = document.createElement("label");
        var labelTextBack = document.createTextNode("BUMP FROM BOTTOM");
        labelBack.appendChild(labelTextBack);
        var radioBack = document.createElement("input");
        radioBack.setAttribute("type", "radio");
        radioBack.setAttribute("id", "radioBack");
        radioBack.setAttribute("name", "settings");
        radioBack.setAttribute("checked", "true");
        // var labelChronological = document.createElement("label");
        // var labelTextChronological = document.createTextNode("CHRONOLOGICAL");
        // var labelTextChronological = document.createTextNode("N/A");
        // labelChronological.appendChild(labelTextChronological);
        // var radioChronological= document.createElement("input");
        // radioChronological.setAttribute("type", "radio");
        // radioChronological.setAttribute("id", "radioChronological");
        // radioChronological.setAttribute("name", "settings");
        // styleRow.appendChild(labelFore);
        // styleRow.appendChild(radioFore);
        styleRow.appendChild(labelBack);
        styleRow.appendChild(radioBack);
        // styleRow.appendChild(labelChronological);
        // styleRow.appendChild(radioChronological);
        enhancementTable.appendChild(styleRow);

        //DECORATION ROW -- IMAGES AND DICTIONARY

        var decorationRow = document.createElement("TR");

        var labelDictionary = document.createElement("label");
        var labelTextDictionary = document.createTextNode("DICTIONARY BUMP");
        labelDictionary.appendChild(labelTextDictionary);
        var radioDictionary = document.createElement("input");
        radioDictionary.setAttribute("type", "checkbox");
        radioDictionary.setAttribute("id", "checkDictionary");
        radioDictionary.setAttribute("name", "reaction");
        decorationRow.appendChild(labelDictionary);
        decorationRow.appendChild(radioDictionary);

        var labelIMG = document.createElement("label");
        var labelTextIMG = document.createTextNode("IMAGE BUMP");
        labelIMG.appendChild(labelTextIMG);
        var checkIMG = document.createElement("input");
        checkIMG.setAttribute("type", "checkbox");
        checkIMG.setAttribute("id", "checkIMG");
        checkIMG.setAttribute("name", "reactionIMG");
        checkIMG.setAttribute("checked", "true");
        checkIMG.setAttribute("onclick", `if(this.checked) document.getElementById('checkReactiveIMG').disabled = false;
else document.getElementById('checkReactiveIMG').disabled = true;`);
        decorationRow.appendChild(labelIMG);
        decorationRow.appendChild(checkIMG);

        enhancementTable.appendChild(decorationRow);

        //IMAGES SET REACTIVE IMAGES TO BE SELECTABLE

        var reactiveRow = document.createElement("TR");

        var labelReactive = document.createElement("label");
        var labelTextReactive = document.createTextNode("REACTIVE BUMPING(NO REFRESHING)");
        labelReactive.appendChild(labelTextReactive);
        var radioReactive = document.createElement("input");
        radioReactive.setAttribute("type", "checkbox");
        radioReactive.setAttribute("id", "checkReactive");
        radioReactive.setAttribute("checked", "true");
        radioReactive.setAttribute("name", "reaction");
        reactiveRow.appendChild(labelReactive);
        reactiveRow.appendChild(radioReactive);
        enhancementTable.appendChild(reactiveRow);

        var labelReactiveIMG = document.createElement("label");
        var labelTextReactiveIMG = document.createTextNode("REACTIVE IMAGES(PRESETS)");
        labelReactiveIMG.appendChild(labelTextReactiveIMG);
        var radioReactiveIMG = document.createElement("input");
        radioReactiveIMG.setAttribute("type", "checkbox");
        radioReactiveIMG.setAttribute("id", "checkReactiveIMG");
        radioReactiveIMG.setAttribute("name", "reactionIMG");
        radioReactiveIMG.setAttribute("checked", "true");
        reactiveRow.appendChild(labelReactiveIMG);
        reactiveRow.appendChild(radioReactiveIMG);
        enhancementTable.appendChild(reactiveRow);

        var labelSpoofing = document.createElement("label");
        var labelTextSpoofing = document.createTextNode("SPOOFING");
        labelSpoofing.appendChild(labelTextSpoofing);
        var radioSpoofing = document.createElement("input");
        radioSpoofing.setAttribute("type", "checkbox");
        radioSpoofing.setAttribute("id", "checkSpoofing");
        radioSpoofing.setAttribute("name", "Spoof");
        reactiveRow.appendChild(labelSpoofing);
        reactiveRow.appendChild(radioSpoofing);
        enhancementTable.appendChild(reactiveRow);

        var bottomRow = document.createElement("tr");
        var instrctions = document.createElement("p");
        var type = "err";
        if(exclude) type = "Exclusion Bump.";
        else type = "Inclusion Bump.";
        var instrctionsText = document.createTextNode(type);
        instrctions.appendChild(instrctionsText);
        bottomRow.appendChild(instrctions);
        enhancementTable.appendChild(bottomRow);
    }


    var node = fileBar.childNodes[3];
    console.log(node);
    if(node !== undefined)
        fileBar.removeChild(fileBar.childNodes[3]);

    var button = document.createElement("input");
    button.setAttribute("type", "button");
    //button.setAttribute("style", "width:100%");
    button.setAttribute("value", "Cycle Image");
    button.setAttribute("id", "CycleImage");
    button.addEventListener("click", function(){

    var optionList = threadSelect.childNodes;
    var optionLength = optionList.length;
        document.getElementById("dump-list").firstChild.click();
        console.log(document.getElementById("dump-list"));
        var tag1 = tagSet(OPList[fullList.indexOf(parseInt(optionList[threadSelect.selectedIndex].value))]);
        console.log("Tag1: " + tag1);
        console.log(OPList);
        console.log(fullList);
        console.log(optionList);
        setPost("https://danbooru.donmai.us/tags.json?search[name_matches]=" + tag1 + "&search[order]=count");
        //getJSON("https://danbooru.donmai.us/posts.json?page=" + pageNo + "&utf8=%E2%9C%93&tags=" + tag1 + "+rating%3Asafe&ms=1", setImageFromDanbooru, tag1);
    });
    fileBar.appendChild(button);
}

function startScript(){
    getJSON('https://a.4cdn.org/' + board + '/catalog.json',
            function(err, data) {
        if (err != null) {
            console.log('Something went wrong: ' + err);
        } else {
            var i = 0;
            data.forEach(function(ele){
                ele["threads"].forEach(function(e){
                    i++;
                    fullList.push(e["no"]);
                    OPList.push(e["com"]);
                });
            });
            console.log("THREAD COUNT: " + i);
        }
        exclusionButton();
        exclusionWindow();
        exclusionRetrieval();

        inclusionButton();
        inclusionWindow();
        inclusionRetrieval();

        dictionaryButton();
        dictionaryWindow();
        dictionaryRetrieval();

        taggingButton();
        taggingWindow();
        taggingRetrieval();
        var list = ((document.getElementById("taggings").value).replace(new RegExp("(\n|<)", "g"), "")).replace(new RegExp(">", "g"), "\n");
        if(list !== null)
            taggingList(list);

        var ele = document.forms[1].getElementsByTagName("A");
        var len = ele.length;
        for (var i = 0 ; i < len ; i++){
            var item = ele.item(i);
            //console.log(item.className);
            if(item.className == "catalog-link"){
                item.addEventListener("click", getURL);
                //console.log(item);
            }
        }
        document.getElementById("fourchanx-css").textContent += ".qr-preview { height: 489px; width: 489px; background-size: cover;}";
        loadedMessages(i);
    });
}

function loadedMessages(i){
    console.log("Slide-Project loaded");
    if(!show) console.log = function(){}
}

window.onload = function(){
    document.getElementsByClassName("qr-link")[0].addEventListener("click", enhance4ChanX);
}

/*
window.eval("console.log(\"test1\");\nprompt = function(message, defaultMsg){\nconsole.log(\"test2\");\n};\nprompt('op','ez');");

var script = document.createElement("SCRIPT");
var scriptText = document.createTextNode("console.log(\"test1\");\nprompt = function(message, defaultMsg){\nconsole.log(\"test2\");\n};\nprompt('op','ez');");
script.appendChild(scriptText);
document.head.appendChild(script);
*/

setTimeout(startScript,400);