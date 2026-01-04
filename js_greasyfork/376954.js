// ==UserScript==
// @name         get_iplayer helper
// @namespace    http://tampermonkey.net/
// @include      http://www.bbc.co.uk/*
// @include      https://www.bbc.co.uk/*
// @version      0.50
// @description  Adds bright pink buttons to every program in BBC's iPlayer website (https://www.bbc.co.uk/iplayer) that allows quick programming of open source downloader get_iplayer Web PVR Manager (available at https://github.com/get-iplayer/get_iplayer/wiki/installation)
// @author       Jake Lewis ( no relation to Phil ).
// @supportURL   jakelewis3d@gmail.com
// @connect     bbc.co.uk
// @connect     localhost
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/376954/get_iplayer%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376954/get_iplayer%20helper.meta.js
// ==/UserScript==


//There are three types of pages this script is designed to work on:
//  catagory pages such as https://www.bbc.co.uk/iplayer/categories/arts/featured
//  episodes pages such as https://www.bbc.co.uk/iplayer/episodes/b006m86d
//  episode  pages such as https://www.bbc.co.uk/iplayer/episode/b0c0bt44/eastenders-15012019


//(function() {
//    'use strict';

    //variables that can be passed to get_iplayer's Web PVR Manager - they are set on our banner in the bbc page

    var recordDirectoryLabel = "recordDirectory";// user should fill in their own value on screen
    var PVRLabel = "PVR";//http://localhost:1935"//the default.
    var fps25Label = "fps25"; //0 ;//the default.
    var forceLabel = "force";// = 0;//the default.
    var modesLabel = "modes";// = best
    var subtitlesLabel ="subtitles";// = 0;// the default.
    var thumbLabel = "thumb";// = 0;// the default.
    var metadataLabel = "metadata";// = 0;// the default.




    var appendCatLabel = "appendCat";// = 0
    var appendNameLabel = "appendName";// = 1
    var appendEpisodeLabel = "appendEpisode";//=1




    var Get_iPlayerHelper_Category = "Get_iPlayerHelper_Category";

    $(document).ready(function() {
        console.log("get_ihelper: A helper script to be used with get_iplayer: https://github.com/get-iplayer/get_iplayer/wiki/installation ");
        console.log("get_ihelper: Bugs to jakelewis3d@gmail.com. Be sure to include: OS, Browser type, the bbc URL, and a good description of the issue. ");

        (async () => {

            await GM.deleteValue("localhostPort");

            var keys = await GM.listValues();
            for (var i = 0; i < keys.length; i++){
                //console.log("get_ihelper: "+keys[i]+" "+ await GM.getValue(keys[i]));
            }

            parsePage();
        })();//async
    });

function createBaseControl(prettyName, label, inputNode){
    var controlSpan = document.createElement("span");
    var labelNode = document.createElement("label");
    labelNode.style="white-space: nowrap";
    labelNode.for = label;
    labelNode.innerText = prettyName;
    controlSpan.appendChild(labelNode);
    if(inputNode!=null){
        labelNode.appendChild(inputNode);}
    return controlSpan;
}

function createTextControl(prettyName, label, placeholding, defaultString){


        var inputNode = document.createElement('input');
        inputNode.type = 'text';
        inputNode.id = inputNode.name = label;
        (async () => { inputNode.value = await GM.getValue(label, defaultString); })();
        inputNode.placeholder = placeholding;
        inputNode.onchange = function(){
            (async () => { await GM.setValue(label, inputNode.value); })();
        }

      //return createBaseControl(prettyName, label, inputNode);
        return inputNode;
}

    function createCheckControl(prettyName, label, defaultString){

        var inputNode = document.createElement('input');
        inputNode.type = 'checkbox';
        inputNode.id = inputNode.name = label;
        (async () => { var v = await GM.getValue(label, defaultString);
                       inputNode.checked = v=="1";
        })();
        inputNode.onchange = function(){
            (async () => { var v = "0";
                          if(inputNode.checked){v = "1" }
                          await GM.setValue(label, v ); })();
        }
       return createBaseControl(prettyName, label, inputNode);

}

function parsePage(){

    var orbModules = document.querySelector('#orb-modules');
    if(orbModules != null){
        var controlsDiv = document.createElement("div");
        controlsDiv.style.background = "#F54997";
        controlsDiv.style.color = "white";
        controlsDiv.style.padding = "5px 5px";
        //controlsDiv.style.margin = "5px 5px";
        orbModules.parentNode.insertBefore(controlsDiv, orbModules);


        var tbl = document.createElement('table');
        //tbl.style.width = '100%';
        //tbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');
            var row1 = document.createElement('tr');
                var reclabel = document.createElement('td'); row1.appendChild(reclabel);
                    reclabel.appendChild( createBaseControl("  Recording Directory: ", recordDirectoryLabel));
                var rec = document.createElement('td'); row1.appendChild(rec)
                    rec.appendChild( createTextControl("  Recording Directory: ", recordDirectoryLabel, " Enter file directory "),"" );
                var dir = document.createElement('td'); row1.appendChild(dir)
                    dir.appendChild( createCheckControl(" prepend Category Dir ", appendCatLabel, "0"));
                    dir.appendChild( createCheckControl(" prepend Name Dir ",appendNameLabel, "1"));
                    dir.appendChild( createCheckControl(" prepend Episode Dir ",appendEpisodeLabel, "1"));
             tbdy.appendChild(row1);

             var row2 = document.createElement('tr');
                var modeslabel = document.createElement('td'); row2.appendChild(modeslabel);
                    modeslabel.appendChild( createBaseControl("Recording Modes: ", modesLabel));
                var modes = document.createElement('td'); row2.appendChild(modes)
                    modes.appendChild( createTextControl("  modes: ", modesLabel, "",'best') );
                var checks = document.createElement('td'); row2.appendChild(checks)
                    checks.appendChild( createCheckControl("  fps25 ", fps25Label, "0") );
                    checks.appendChild( createCheckControl("  force ", forceLabel, "0") );
                    checks.appendChild( createCheckControl("  subtitles ", subtitlesLabel, "0") );
                    checks.appendChild( createCheckControl("  thumb ", thumbLabel,"0"));
                    checks.appendChild( createCheckControl("  metadata ", metadataLabel, "0"));
             tbdy.appendChild(row2);

             var row3 = document.createElement('tr');
                var portlabel = document.createElement('td'); row3.appendChild(portlabel);
                    portlabel.appendChild( createBaseControl("PVR: ", PVRLabel));
                var port = document.createElement('td'); row3.appendChild(port)
                    port.appendChild( createTextControl("PVR: ", PVRLabel, "", "http://localhost:1935") );
             tbdy.appendChild(row3);


        tbl.appendChild(tbdy);
        controlsDiv.appendChild(tbl);

    }



        var categoryString = "";
        var nameString = "";
        var episodeString = "";
        var isCategoriesPage = true;


        //on an individual programme/episode page
        if(window.location.href.includes("www.bbc.co.uk/iplayer/episode/")){
            var myLocation = document.createElement('a');// just a dummy
            myLocation.href = window.location.href;
            var urlParams = new URLSearchParams(window.location.search);
            if(urlParams.has(Get_iPlayerHelper_Category)){
                categoryString = decodeURIComponent(urlParams.get(Get_iPlayerHelper_Category));
                urlParams.delete(Get_iPlayerHelper_Category);
                myLocation.search = urlParams.toString();
            }
            var nameElement = document.querySelector('span.typo');
            if(nameElement != null) nameString = nameElement.innerText;
           // var singleElement = document.querySelector('div.playback-content');
            var singleElement = document.querySelector('div.hero-meta__content');
            //console.log("get_ihelper: "+"singleElement.length:"+singleElement.length);
            if(singleElement!=null ){
                singleElement.insertBefore(createButtons(myLocation, categoryString, nameString, episodeString, nameString), singleElement.children[0]);
            }
            isCategoriesPage = false;

        }

        //on an episodes page
        var headerElement = document.querySelector('h1.hero-header__title');
        if(headerElement!=null){
            if(window.location.href.includes("www.bbc.co.uk/iplayer/episodes/")){
                isCategoriesPage = false;
                nameString = headerElement.innerText;
                var catElement = document.querySelector('div.hero-header__label');
                if(catElement != null){
                    categoryString = catElement.innerText;}


            }
        }



    //on all pages




        var targetElements = document.querySelectorAll('div.content-item');
        console.log("get_ihelper"+"targetElements.length:"+targetElements.length);


        for (var i = 0; i < targetElements.length; i++) {

            var targetElement = targetElements[i];
            console.log("get_ihelper"+i+" "+ targetElement);
            var content_item__link = targetElement.querySelector('a.content-item__link');
            if(content_item__link != null){
                var contentItemLabels = content_item__link.querySelector('div.content-item__labels');
                if(contentItemLabels!=null){
                    var catElement2 = contentItemLabels.querySelector('span.typo');
                    if(catElement2 != null){
                        if(isCategoriesPage){
                            categoryString = catElement2.innerText;}
                    }
                }
                var titleElement = content_item__link.querySelector('div.content-item__title');
                if( titleElement != null ){
                    if(isCategoriesPage){
                        nameString = titleElement.innerText;
                        if(nameString.endsWith("...") && titleElement.querySelector('span.tvip-hide')!=null){ //bbc uses this to hide the end of long titles
                            nameString = nameString.substring(0, nameString.length-3);
                        }
                    }
                }
                targetElement.insertBefore(createButtons(content_item__link, categoryString, nameString, episodeString, episodeString, nameString), content_item__link);
            }else{
                // a 'This Episode' element in episodes page
                content_item__link = targetElement.querySelector('span.content-item__link');
                if(content_item__link!=null){
                    if(content_item__link.innerText.includes('This Episode')){
                       targetElement.insertBefore(createButtons(location,categoryString, nameString, episodeString, nameString), content_item__link);
                    }
                }
            }

           if(isCategoriesPage){
               categoryString = "";
               nameString = "";
           }




        }//targetElements



        var targetEls = document.querySelectorAll('li.grid__item');
        console.log("get_ihelper li.grid__item targetElements.length:"+targetEls.length);
        for (var it = 0; it < targetEls.length; it++) {
            var targetEl = targetEls[it];
            var content_item = targetEl.querySelector('a');
            if(content_item != null){
                var contentItemLab = content_item.querySelector('div.content-item-root__meta');
                if(contentItemLab!=null){
                    if(isCategoriesPage){
                        nameString = contentItemLab.innerText;
                    }else{
                        episodeString = contentItemLab.innerText;
                    }
                    // console.log("get_ihelper episodeString:"+episodeString);
                }
                targetEl.prepend(createButtons(content_item, categoryString, nameString, episodeString, nameString));//, content_item);
            }
        }


}

function createButtons(videoElement, catDirectory, nameDirectory, episodeDirectory, searchTerm){
    console.log("get_ihelper createButtons("+catDirectory+"/"+nameDirectory+"/"+episodeDirectory+")");
    var videoURL = videoElement.href;
    if(catDirectory.length>0){
        var urlParams = new URLSearchParams(videoElement.search);
        console.log("urlParams:"+urlParams.toString());
        if( urlParams.has(Get_iPlayerHelper_Category) == false){
           urlParams.append(Get_iPlayerHelper_Category, catDirectory);
           videoElement.search = urlParams.toString();} //this has to be passed in the url as it's not avail in the episode page
    }

    var buttonSpan = null;
    if(videoElement.parentNode !=null) buttonSpan = videoElement.parentNode.querySelector("span#helper_buttons");
    if(buttonSpan == null){
        buttonSpan = document.createElement("span");
        buttonSpan.id = "helper_buttons";
    }
    var safeCatDir = makeDirectorySafeName(catDirectory);
    var safeNameDir = makeDirectorySafeName(nameDirectory);
    var safeEpisodeDir = makeDirectorySafeName(episodeDirectory);
    buttonSpan.appendChild( createButton(videoURL, safeCatDir, safeNameDir, safeEpisodeDir, "", "Add QuickURL to Queue", 'pvr_queue') );
   // buttonSpan.appendChild( createButton('', safeCatDir, safeNameDir, safeEpisodeDir, searchTerm, "Search Get_iPlayer ", 'search_progs'));
    //console.log("get_ihelper: "+safeCatDir+"/"+safeNameDir+" search:"+searchTerm+" "+videoURL);
    return buttonSpan;
}


function createButton(videoURL, catDirectory, nameDirectory, episodeDirectory, searchTerm, label, nextPage){

            var addButton = document.createElement("button");
            addButton.appendChild(document.createTextNode(label));
            //addButton.style.width = "170px";
            //addButton.style.left = "15%";
            addButton.style.backgroundColor = "#F54997";
            addButton.style.color = "white";
            addButton.style.textAlign = "center";
            addButton.style.padding = "2px 5px";
            addButton.style.margin = "0px 5px";
            addButton.style.fontSize = "9px";
            addButton.style.border = "3px";
            addButton.style.cursor = "pointer";
            addButton.style.borderRadius = "2px";
            //addButton.style.fontFamily = "Roboto, Arial, sans-serif";
            addButton.style.textDecoration = "none";

            //our data
            addButton.videoURL = videoURL;
            addButton.catDirectory = catDirectory;
            addButton.nameDirectory = nameDirectory;
            addButton.episodeDirectory = episodeDirectory;





            addButton.onclick = function buttonClick(evt){

                (async () => {
                      console.log("get_ihelper: "+evt.target.videoURL);

                    var directorySeperator = "\\"; //    "\\"  for windows, "/" for linux, mac
                    var directoryName = "";
                    if( await GM.getValue(appendCatLabel, "1")=="1" && evt.target.catDirectory.length > 0) directoryName += directorySeperator+evt.target.catDirectory;
                    if( await GM.getValue(appendNameLabel, "1")=="1"&& evt.target.nameDirectory.length >0) directoryName += directorySeperator+evt.target.nameDirectory;
                    if( await GM.getValue(appendEpisodeLabel, "1")=="1"&& evt.target.episodeDirectory.length >0) directoryName += directorySeperator+evt.target.episodeDirectory;
                    var metadataString = await GM.getValue(metadataLabel, "1")=="1" ? 'generic' : '';


                      post( await GM.getValue(PVRLabel,"http://localhost:1935")+'/', {
                           'SEARCH':searchTerm,
                           'SEARCHFIELDS':'name',
                           'PROGTYPES': 'tv',
                           'URL': evt.target.videoURL,
                           'NEXTPAGE':nextPage,
                           'OUTPUT': await GM.getValue(recordDirectoryLabel, "") + directoryName,
                           'FORCE':await GM.getValue(forceLabel, "0"),
                           'FPS25': await GM.getValue(fps25Label, "0"),
                           'MODES': await GM.getValue(modesLabel, "best"),
                           'SUBTITLES':await GM.getValue(subtitlesLabel,"0"),
                           'THUMB':    await GM.getValue(thumbLabel,"0"),
                           'METADATA': metadataString
                           }
                      );
                 })();

            };
    return addButton;
}


function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("target", "_blank");//disable this for easier debugging

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);


            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

var safeCharRegex = /[<>/\|?*.]/g;

function makeDirectorySafeName(inString){

    //get_iplayer can't write to directories with this character in the name!
    inString = inString.replace("’","'"); //at least looks similar.

    //remove Windows illegal directory characters
    inString = inString.replace(":", "-");
    inString = inString.replace('"', "'");//at least looks similar.

    return inString.replace(safeCharRegex, '_');
}



//})();