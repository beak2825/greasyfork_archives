// ==UserScript==
// @name         FAForumSFWversion
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allow you to hide NSFW topics or mark them with a red prefix, you can specify tags to filter in order to take new words in account
// @author       MissNook
// @match        http://forums.furaffinity.net/*
// @match  https://forums.furaffinity.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368376/FAForumSFWversion.user.js
// @updateURL https://update.greasyfork.org/scripts/368376/FAForumSFWversion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tagsToCheck = localStorage.tagsToCheck ? localStorage.tagsToCheck.split(",") : ["nsfw", "nswf", "not sfw", "fetish", "diaper", "inflation", "vore", "bondage"];
    var content = document.getElementById("top");

    function addNSFWPrefix(){
        var threads = content.getElementsByClassName("structItem--thread");

        var prefixNSFW = document.createElement("a");
        prefixNSFW.className = "prefixLink prefixForNSFW  label label--red";
        prefixNSFW.innerHTML = "<span class='prefix prefixRed'>NSFW</span>"
        prefixNSFW.style.marginRight = ".35em";

        var len = threads.length,
            i = 0;
        for(; i<len;i++){
            var threadTitles = threads[i].getElementsByClassName("structItem-title");
            var threadTitleContents = threadTitles[0].getElementsByTagName("a");
            var idTitle = threadTitleContents.length > 1 ? 1 : 0;
            var currThreadTitle = threadTitleContents[idTitle];

            if(matchInArray(currThreadTitle.innerText, tagsToCheck)){
                threads[i].className += " NSFWtagged";
                currThreadTitle.parentNode.insertBefore(prefixNSFW.cloneNode(true), currThreadTitle);
            }
        }
    }
    addNSFWPrefix();

    function addTagInput(){
        var nav = content.getElementsByClassName("block-outer")[0];
        var divTag = document.createElement("div");
        divTag.className = "primaryControls";
        divTag.style = "text-align:right;";
        var validateButtonClass = "button--primary button";
        var hideButtonClass = "button button--icon button--icon--preview";
        var inputClass = "input";
        divTag.innerHTML = "<span class='p-description'><b>Tags to filter for NSFW : </b></span><input type='search' id='tagsNSFWInput' class='"+ inputClass +"' title='Enter your tags to filter as NSFW'><button class='" + validateButtonClass + "' id='btnValidateInputNSFW'>Validate tags change</button><button class='"+hideButtonClass+"' id='btnHideNSFW'>Hide NSFW</button>";
        var input = divTag.getElementsByClassName(inputClass)[0];
        input.value = tagsToCheck.join(";");
        input.style = "width:20em;";
        input.style.display = "inline";
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            //press enter
            if (event.keyCode === 13) {
                manageNewTags();
            }
        });

        var btnValidInput = divTag.childNodes[2];
        btnValidInput.onclick = manageNewTags;
        btnValidInput.style.cursor = "pointer";
        btnValidInput.style.marginLeft = "10px";

        var hideBtn = divTag.lastChild;
        hideBtn.style.cursor = "pointer";
        hideBtn.style.marginLeft = "10px";
        hideBtn.onclick = showHideNSFW;

        nav.appendChild(divTag);
    }
    addTagInput();

    function showHideNSFW(){
        var nsfwTaggedContents = content.getElementsByClassName("NSFWtagged");
        var toggleBtn = document.getElementById("btnHideNSFW");
        var hide = toggleBtn.innerText == "Hide NSFW";
        toggleBtn.innerText = hide ? "Show NSFW" : "Hide NSFW";

        var len = nsfwTaggedContents.length,
            i = 0;
        for(; i<len;i++){
            nsfwTaggedContents[i].style.display = hide ? "none": "table";
        }
    }


    function fillTagsWithUserTag(){
        var inputNSFW = document.getElementById("tagsNSFWInput");
        var tempTabTags = inputNSFW.value.split(";");
         var len = tempTabTags.length,
            i = 0;
        for(; i<len;i++){
            if(tempTabTags[i] == ""){
                tempTabTags.splice(i,1);
            }
        }
        tagsToCheck = tempTabTags;
        localStorage.tagsToCheck = tagsToCheck;
    }

    function reinitThreads(){
        var threads = content.getElementsByClassName("NSFWtagged");
        var len = threads.length,
            i = 0;
        for(; i<len;i++){
            var thread = threads[0];
            var nsfwPrefix = thread.getElementsByClassName("prefixForNSFW")[0];
            nsfwPrefix.parentNode.removeChild(nsfwPrefix);
            thread.className = thread.className.replace(" NSFWtagged","");
        }
    }

    function manageNewTags(){
        fillTagsWithUserTag();
        reinitThreads();
        addNSFWPrefix();
    }

    function matchInArray(string, expressions) {
        var len = expressions.length,
            i = 0;
        for (; i < len; i++) {
            if (string.match(new RegExp(expressions[i],'gi'))) {
                return true;
            }
        }
        return false;
    };
})();
