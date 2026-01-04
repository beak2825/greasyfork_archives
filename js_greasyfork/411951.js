// ==UserScript==
// @name         WES
// @namespace    none
// @version      0.1.2.4
// @description  .win enhancement suite - stable version
// @author       melvin
// @include      https://communities.win/*
// @include      https://consumeproduct.win/*
// @include      https://gavinmcinnes.win/*
// @include      https://kotakuinaction.win/*
// @include      https://kotakuinaction2.win/*
// @include      https://omegacanada.win/*
// @include      https://patriots.win/*
// @include      https://weekendgunnit.win/*
// @include      https://greatawakening.win/*
// @include      https://ip2always.win/*
// @include      https://tuckercarlson.win/*
// @include      https://conspiracies.win/*
// @resource     TEST_CSS https://raw.githubusercontent.com/ilovestaples/wes/master/wes/css/settingscss.css
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @connect      api.imgur.com
// @downloadURL https://update.greasyfork.org/scripts/411951/WES.user.js
// @updateURL https://update.greasyfork.org/scripts/411951/WES.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("WES " + GM.info.script.version);

    /************************ 0. Setup ************************/

    var wes = {
        params: {
            expandMedia : false,
            enableBookmarks: false,
        },

        expandMedia : function(media){
            if(media && media.hasAttribute("data-action")){
                media.click();
            }

            $(media).closest('.post').find('.content').first().removeAttr('data-opened');
        }
    }

    var tags = GM.getValue("tags", "{}").then(function(val) {

        console.log(val);
        var userTags = JSON.parse(val);
        var authors = document.getElementsByClassName("author");
        for(var author of authors){

            var user = author.innerText.trim();

            if(userTags[user]){
                var tag = createTag();
                tag.id = "";
                tag.style.color = userTags[user].color;
                tag.style.backgroundColor = userTags[user].backgroundColor;
                tag.textContent = userTags[user].text;
                author.parentElement.insertBefore(tag, author.nextSibling);
                tag.addEventListener("click", function(){userTaggerShowForm(this)});
            }
            else {
                var tagbutton = createTagButton();
                author.appendChild(tagbutton);
                tagbutton.querySelector("button").addEventListener("click", function(e){e.preventDefault(); userTaggerShowForm(this)});
                author.addEventListener("mouseover", function(){ try{this.querySelector(".tag-button-container").style.display = "inline";}catch(error){}});
                author.addEventListener("mouseout", function(){ try{this.querySelector(".tag-button-container").style.display = "none";}catch(error){}});
            }
        }

        tags = userTags;
    });



    /************************ 1. General Enhancers ************************/

    /************************ 1.1. Create navigation bar ************************/

    function generalEnhancerAddNavigationBar() {


        if(!wes.params.enableBookmarks){
            console.log("Navigation bar disabled. Check back in the next update.")
            return;
        }

        var topBarCss = '.tool-bar-link {text-decoration: none;color: white;font-family: sans-serif;font-size: 13px;}.tool-bar-link {color:#fff;-moz-transition: all 0.1s ease-in;-o-transition: all 0.1s ease-in;-webkit-transition: all 0.1s ease-in;transition: all 0.1s ease-in;}.tool-bar-link:hover { color: #ff9d07; text-shadow: 0px 0px 8px #ff9d07;-moz-transition: all 0.1s ease-in;-o-transition: all 0.1s ease-in;-webkit-transition: all 0.1s ease-in; transition: all 0.1s ease-in;}.tool-bar-link:active {color: #ff9d07; text-shadow: 0px 0px 3px #ff9d07;-moz-transition: all 0.1s ease-in;-o-transition: all 0.1s ease-in;-webkit-transition: all 0.1s ease-in; transition: all 0.1s ease-in;}.bar-link{ font-family: sans-serif;font-size: 13px; color: white; text-decoration: none; position: relative;}.bar-link::after{ content: ""; background: white;mix-blend-mode: exclusion; width: calc(90% + 20px); height: 0; position: absolute; bottom: -3px; left: -6px;transition: all .3s cubic-bezier(0.445, 0.05, 0.55, 0.95);}.bar-link:hover::after{height: calc(100% + 8px)}';

        var topBarStyle = document.createElement('style');
        topBarStyle.className = "style-tag";
        document.body.appendChild(topBarStyle);

        var appendedTopBarStyle = document.querySelector(".style-tag");
        if(appendedTopBarStyle){
            appendedTopBarStyle.innerHTML = topBarCss;
        }

        const winsitesArray = ["patriots", "consumeproduct", "conspiracies", "omegacanada", "kotakuinaction", "kotakuinaction2", "gavinmcinnes", "tuckercarlson", "weekendgunnit", "greatawakening", "ip2always", "communities"];

        var topBar = document.createElement('div');
        topBar.className = "top-bar"
        topBar.style.height = "30px";
        topBar.style.backgroundColor = "black";
        topBar.style.width = "auto";
        topBar.style.opacity = 0.5;
        topBar.style.display = "flex";
        topBar.style.alignItems = "center";
        topBar.style.position = "absolute";
        topBar.style.zIndex = 5;

        var linklist = document.createElement('ul');
        linklist.style.listStyle = "none";

        for (var i = 0; i < winsitesArray.length; i++) {

            addWhiteSpaceToList(linklist);

            var newli = document.createElement('li');
            newli.style.display = "inline";
            newli.style.color = "white";
            newli.style.padding = "5px";

            var newlink = document.createElement('a');
            newlink.href = "https://" + winsitesArray[i] + ".win/";
            newlink.innerHTML = winsitesArray[i];
            newlink.className = "bar-link";
            newlink.padding = "10px"

            newli.appendChild(newlink);
            linklist.appendChild(newli);

            addWhiteSpaceToList(linklist);

            if (i < winsitesArray.length - 1) {
                addDividerToList(linklist)
            }
        }

        topBar.appendChild(linklist);

        var wrapper = document.getElementsByClassName("wrapper");
        var header = document.getElementsByClassName("header");

        if(wrapper[0] && header[0]){
            wrapper[0].insertBefore(topBar, header[0]);
        }

        var themeSwitcher = document.querySelector(".theme-switcher");
        if(themeSwitcher){
            themeSwitcher.style.zIndex = 1;
        }

    }

    /************************ 1.2 Post/comment point redirection ************************/

    function generalEnhancerAddPointRedirection(){
        var navuser = document.querySelector(".nav-user.active");
        if(navuser){

          var username = navuser.children[0].children[0].text;
          var postKarma = document.createElement('a');
          var commentKarma = document.createElement('a');

          postKarma.href = "https://" + window.location.hostname +"/u/" + username + "/?type=post";
          commentKarma.href = "https://" + window.location.hostname +"/u/" + username + "/?type=comment";

          var pointsText = navuser.children[0].childNodes[2];
          var pointsTextContent = pointsText.textContent;

          var postKarmaText = pointsTextContent.substring(pointsTextContent.indexOf("(") + 1, pointsTextContent.indexOf("•") - 1);
          var commentKarmaText = pointsTextContent.substring(pointsTextContent.indexOf("•") + 2, pointsTextContent.indexOf(")"));

          postKarma.innerHTML = postKarmaText;
          postKarma.title = "submitted"
          commentKarma.innerHTML = commentKarmaText;
          commentKarma.title = "comments";

          var sp = document.createElement('span');
          var text1 = document.createElement('text');
          var text2 = document.createElement('text');
          var text3 = document.createElement('text');

          text1.textContent = "(";
          text2.textContent = " • ";
          text3.textContent = ")";

          sp.appendChild(text1);
          sp.appendChild(postKarma);
          sp.appendChild(text2);
          sp.appendChild(commentKarma);
          sp.appendChild(text3);

          navuser.children[0].insertBefore(sp, pointsText);
          navuser.children[0].removeChild(pointsText);
        }
    }

    /************************ 1.3 Settings ************************/

    function displaySettings(){

        var overlay = document.getElementById("overlay");
        overlay.style.display = "flex";
        overlay.style.zIndex = "999";

        var menu = document.getElementById("wes-settings-menu");
        menu.style.display = "block";
        menu.style.zIndex = "1000";

        loadTagsTable();
    }


    function hideSettingsOut(){
        if (!$('#wes-settings-menu').is(':hover')) {
            hideSettings();
        }
    }

    function hideSettings(){

        var overlay = document.getElementById("overlay");
        overlay.style.display = "none";
        overlay.style.zIndex = "-999";

        var menu = document.getElementById("wes-settings-menu");
        menu.style.display = "none";
        menu.style.zIndex = "-1000";

        unloadTagsTable();
    }

    function showGeneralSettings(){
        var sections = document.body.querySelectorAll(".section-container");
        for(var section of sections){section.style.display = "none";}
        document.getElementById("settings-general-sc").style.display = "block";

    }

    function showTagSettings(){
        var sections = document.body.querySelectorAll(".section-container");
        for(var section of sections){section.style.display = "none";}
        document.getElementById("settings-tags-sc").style.display = "block";
    }

    function addSettings(){

        var overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.style.position = "fixed";
        overlay.style.display = "none";
        overlay.style.zIndex = "-999";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)";

        document.body.appendChild(overlay);

        var settingsMenu = document.createElement("div");
        settingsMenu.id = "wes-settings-menu";
        settingsMenu.style.display = "none";
        settingsMenu.style.zIndex = "-1000";
        settingsMenu.style.width = "900px";
        settingsMenu.style.height = "600px";
        settingsMenu.style.backgroundColor = "#444a4f";

        overlay.appendChild(settingsMenu);

        var settingsCSS = document.createElement("style");
        settingsCSS.innerHTML = 'dialog {padding: 10px;}nav {padding: 10px; display: flex;justify-content: space-between;}.sections-list {color: white;font-size: small}.credits {color: white;font-size: small;display: flex;}.section-container {padding: 10px;}fieldset {border: 1px solid;border-radius: 3px;padding: 0.35em 0.625em;margin: 0px 2px;border-color: gray;}legend {color: white;padding: 1px;font-size: smaller;}.svg-inline--fa.fa-times.fa-w-11.close {cursor: pointer;}#utTable {border-collapse: collapse;border: 1px double gray;font-size: smaller;}td {border: 1px double gray;padding: 3px;}.settings-button:hover {text-decoration: underline;}.section-container {height: 750px;overflow: auto;}';
        var settingsMainHTML = '<div id="wes-settings" class="dialog"> <nav> <div class="sections-list"><a class="tab-general settings-button" href="javascript:;">General</a> | <a class="tab-tags settings-button" href="javascript:;">Tagged Users</a> </div> <div class="credits"> <a class="settings-button" href="https://github.com/ilovestaples/wes/" target="_blank">WES</a>&nbsp;|&nbsp; <a class="settings-button" id="wes-menu-version" href="https://github.com/ilovestaples/wes/blob/master/CHANGELOG.md" target="_blank">version_number</a>&nbsp;|&nbsp; <a class="settings-button" href="https://gitreports.com/issue/ilovestaples/wes" target="_blank">Issues</a>&nbsp;|&nbsp; <span id="settings-close" style="cursor: pointer;" class="settings-button" title="Close"><span class="fa fa-times close"></span></span> </div> </nav> <div id="settings-general-sc" class="section-container"> <section class="section-advanced"> <fieldset> <legend>General Settings</legend> <span style="font-size: smaller; color: white;">In future updates, user customizable settings will be here.</span> </fieldset> </section> </div> <div id="settings-tags-sc" class="section-container"> <section class="section-advanced"> <fieldset> <legend>Tagged Users</legend> <table id="utTable" style="width:100%"> </table> </fieldset> </section> </div></div>';

        const my_css = GM_getResourceText("TEST_CSS");
        GM_addStyle(my_css);

        document.body.appendChild(settingsCSS);
        settingsMenu.innerHTML = settingsMainHTML;

        document.getElementById("wes-menu-version").innerHTML = GM.info.script.version;
        document.getElementById("settings-tags-sc").style.display = "none";
        document.getElementById("settings-tags-sc").style.overflow = "auto";
        document.getElementById("settings-tags-sc").style.height = "500px";
        document.body.querySelector(".tab-general").addEventListener("click", showGeneralSettings);
        document.body.querySelector(".tab-tags").addEventListener("click", showTagSettings);
        document.getElementById("settings-close").addEventListener("click", hideSettings);

    }

    function settingsButton(){
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "aria-hidden", true);
        svg.setAttributeNS(null, "focusable", false);
        svg.setAttributeNS(null, "preserveAspectRatio", "xMidYMid meet");
        svg.style = "vertical-align: -0.3em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg); cursor: pointer;";
        svg.setAttributeNS(null, "class", "delete-tag-button");
        svg.setAttributeNS(null, "width", "1.0em");
        svg.setAttributeNS(null, "height", "1.0em");
        svg.setAttributeNS(null, "viewBox", "0 0 512 512");

        var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttributeNS(null, "fill","currentColor");
        path1.setAttributeNS(null, "d","M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36l-67.88-11.31l-11.31-67.88l74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16c-47.38-11.74-99.55.91-136.58 37.93c-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5c24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22c37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24c0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z");

        var label = document.createElement("label");
        label.className = "settings-button-label";

        var button = document.createElement("button");
        button.style.display = "none";

        var container = document.createElement("span");
        container.className = "settings-button-container";
        container.style.display = "block";

        svg.appendChild(path1);
        label.appendChild(svg);
        label.appendChild(button);
        container.appendChild(label);
        return container;
    }

    function generalEnhancerAddSettingsButton(){

        var navuser = document.querySelector(".nav-user.active");
        if(navuser){

          addSettings();

          var overlay = document.getElementById("overlay");
          overlay.addEventListener("click", hideSettingsOut);

          var dropdown = document.body.querySelector(".dropdown-content");
          var link = document.createElement("a");
          link.setAttribute("href", "javascript:;");
          link.innerHTML = "WES 👨‍🌾";
          link.addEventListener("click", displaySettings);
          dropdown.insertBefore(link, dropdown.lastElementChild);

        }


    }



    /************************ 2. Main Page Enhancers ************************/

    /************************ 2.1. Create tools bar ************************/

    function mainPageEnhancerAddToolBar(){

        var container = document.querySelector(".container");
        var wrapperHome = document.querySelector(".wrapper.home");

        if(wrapperHome && container){

            var tools_bar = document.createElement('div');
            tools_bar.className = "top-bar"
            tools_bar.style.height = "30px";
            tools_bar.style.backgroundColor = "black";
            tools_bar.style.width = "auto";
            tools_bar.style.opacity = 0.5;
            tools_bar.style.display = "flex";
            tools_bar.style.alignItems = "center";
            tools_bar.style.justifyContent = "center"

            var toolslist = document.createElement('ul');
            toolslist.style.listStyle = "none";

            var newli = document.createElement('li');
            newli.style.display = "inline";
            newli.style.color = "white";

            var newlink = document.createElement('a');
            newlink.href = "#";

            newlink.innerHTML = "expand content";
            newlink.className = "tool-bar-link";
            newlink.padding = "10px";
            newlink.id = "expand-media";

            newli.appendChild(newlink);
            toolslist.appendChild(newli);
            tools_bar.appendChild(toolslist);

            wrapperHome.insertBefore(tools_bar, container);


            /************************ 2.1.1 expand media ************************/

            var expandMediaButton = document.getElementById('expand-media');

            expandMediaButton.onclick = function(){

                var thu = document.getElementsByClassName("thumb");
                var len = thu.length;

                for(var i = 0; i < len /*- 1*/ ; i++){
                    wes.expandMedia(thu[i]);
                }

                wes.params.expandMedia = !wes.params.expandMedia;
            }
        }
    }


    /************************ 2.2 Automatically expand content ************************/

    function mainPageEnhancerAutoExpandMedia(){

        //if im on a main page, expand (or not) content in next pages automatically
        var postList = document.querySelector(".post-list");//maybe find another way of checking if im on a main page
        if(postList){

            const plmoConfig = { attributes: false, childList: true, subtree: false };
            const plmoCallback = function(mutationsList, observer) {
                if(wes.params.expandMedia){
                    for(let mutation of mutationsList){

                        for(let node of mutation.addedNodes){
                            var media = node.querySelector(".thumb");
                            wes.expandMedia(media);
                        }
                    }
                }
            }

            const postListObserver = new MutationObserver(plmoCallback);
            postListObserver.observe(postList, plmoConfig);
        }
    }

    /*************** 2.3 Add Tag Buttons on Infinite Scroll ****************/

    function mainPageEnhancerAddTagButtons(){

        //if im on a main page, expand (or not) content in next pages automatically
        var postList = document.querySelector(".post-list");//maybe find another way of checking if im on a main page
        if(postList){

            const plmoConfig = { attributes: false, childList: true, subtree: false };
            const plmoCallback = function(mutationsList, observer) {
                for(let mutation of mutationsList){
                    for(let node of mutation.addedNodes){
                        var author = node.querySelector(".author");

                        //refactor this some day
                        var user = author.innerText.trim();
                        if(tags[user]){
                            var tag = createTag();
                            tag.id = "";
                            tag.style.color = tags[user].color;
                            tag.style.backgroundColor = tags[user].backgroundColor;
                            tag.textContent = tags[user].text;
                            author.parentElement.insertBefore(tag, author.nextSibling);
                            tag.addEventListener("click", function(){userTaggerShowForm(this)});
                        }
                        else {
                            var tagbutton = createTagButton();
                            author.appendChild(tagbutton);
                            tagbutton.querySelector("button").addEventListener("click", function(){userTaggerShowForm(this)});
                            author.addEventListener("mouseover", function(){ try{this.querySelector(".tag-button-container").style.display = "inline";}catch(error){}});
                            author.addEventListener("mouseout", function(){ try{this.querySelector(".tag-button-container").style.display = "none";}catch(error){}});
                        }
                    }
                }
            }

            const postListObserver = new MutationObserver(plmoCallback);
            postListObserver.observe(postList, plmoConfig);
        }
    }

    /************************ 3. Comments Enhancers ************************/

    /************************ 3.1. Automatic Quotes ************************/

    //return True if a mutated object exists, its class is _className and its mutation type is _mutationType
    function objMutated(m, _className, _mutationType){
        return m.target.className && (!m.target.className.toString().localeCompare(_className)) && m.type === _mutationType;
    }

    function isMessage(m){
        return (!m.target.parentElement.className.toString().localeCompare("message")) || (!m.target.parentElement.parentElement.className.toString().localeCompare("message"));
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        text = text.split("\r\n");
        while(text.indexOf("") > -1){
            text.splice(text.indexOf(""), 1);
        }
        return text;
    }

    function commentsEnhancerAddAutomaticQuotes(){

        //save selected text before replying
        var selectedText = "";
        document.body.onmouseup = function(){
            selectedText = getSelectionText();
        }

        //make a MutationObserver for comments
        const moConfig = { attributes: true, childList: true, subtree: true };
        const moCallback = function(mutationsList, observer) {
            for(let mutation of mutationsList){

                //add expandos when editing a comment
                if(objMutated(mutation, "content", "childList")){
                    if(!mutation.target.querySelector(".inline-expand-content-button")){
                        singleCommentExpandMedia(mutation.target);
                    }
                }

                //add expandos when replying to a post or comment
                if(objMutated(mutation, "comment", "childList")){
                    var child = mutation.addedNodes[0];
                    try{
                        if(!child.querySelector(".inline-expand-content-button")){
                            singleCommentExpandMedia(child.querySelector(".content"));
                        }
                    }catch (error) {console.log(error)}
                }


                //autoquotes
                var commentLines = "";
                var textarea = "";
                var replyFormAdded = objMutated(mutation, "body", "childList");
                var replyFormShown = objMutated(mutation, "form reply active", "attributes");

                //if its the first time the reply button was clicked:
                if(replyFormAdded){
                    if(isMessage(mutation)){
                        commentLines = mutation.target.querySelector('.content').children;
                    }
                    else { commentLines = mutation.target.querySelector('.rendered').children;}
                }

                //if im expanding the reply form
                if(replyFormShown){
                    if(isMessage(mutation)){
                        commentLines = mutation.target.parentElement.querySelector('.content').children;
                    }
                    else { commentLines = mutation.target.parentElement.querySelector('.rendered').children;}
                }

                if(replyFormAdded || replyFormShown){
                    textarea = mutation.target.querySelector("textarea");
                    for(let line of selectedText){
                        for(let commentLine of commentLines){

                            if(commentLine.innerText.includes(line)){
                                textarea.value += "> " + line + "\n\n";
                            }
                        }
                    }

                    //keep this functionality in the 'reply' button for as long as the comment box is being displayed
                    mutation.target.parentElement.querySelector('a[data-action="reply"]').onclick = function(){

                        var selectedTextReplyOnClick = getSelectionText();
                        var textareaReplyOnClick = this.parentElement.parentElement.querySelector("textarea");
                        var commentLinesReplyOnClick = "";

                        if(isMessage(mutation)){
                            commentLinesReplyOnClick = this.parentElement.parentElement.querySelector('.content').children;
                        }
                        else{
                            commentLinesReplyOnClick = this.parentElement.parentElement.querySelector('.rendered').children;
                        }

                        try {
                            for(let line of selectedTextReplyOnClick){
                                for(let commentLine of commentLinesReplyOnClick){

                                    if(commentLine.innerText.includes(line)){
                                        textareaReplyOnClick.value += "> " + line + "\n\n";
                                    }
                                }
                            }
                        }
                        catch (error){
                            console.log(error);
                        }
                    }
                }

                //if im hitting cancel, reset the textbox
                if(objMutated(mutation, "form reply", "attributes")){
                    textarea = mutation.target.querySelector("textarea");
                    textarea.value = "";
                    mutation.target.parentElement.querySelector('a[data-action="reply"]').onclick = "";

                }
            }
        };

        const commentsObserver = new MutationObserver(moCallback);

        var comments = document.getElementsByClassName("comment");
        for (var j = 0; j < comments.length; j++) {
            comments[j].onmousedown = function(){
                commentsObserver.observe(this, moConfig);
            }
        }

        const messagesObserver = new MutationObserver(moCallback); //TODO: Use a different config and callback.

        var messagesToObserve = document.getElementsByClassName("message");
        console.log(messagesToObserve);
        for (var k = 0; k < messagesToObserve.length; k++){
            messagesToObserve[k].onmousedown = function(){
                messagesObserver.observe(this, moConfig);
            }
        }

        /* expando related code, move somewhere else*/
        /*make a mutations observer for the comment list*/

        const moConfig_cl = { attributes: true, childList: true, subtree: true };
        const moCallback_cl = function(mutationsList, observer) {
            for(let mutation of mutationsList){
                var childListMutation = mutation.target.className && (!mutation.target.className.toString().localeCompare("comment-list")) && mutation.type === 'childList';
                if (childListMutation){
                    var addedNodes = mutation.addedNodes;
                    if(!addedNodes[0].className.toString().localeCompare("comment")){
                        singleCommentExpandMedia(addedNodes[0].querySelector(".content"));
                    }

                }
            }
        }

        const commentListObserver = new MutationObserver(moCallback_cl);
        var commentList = document.body.querySelector(".comment-list");
        commentListObserver.observe(commentList, moConfig_cl);

    }

    /************************ 3.2. Expand Content in Comments ************************/

    var mediaLinkDictionary = {};

    /* type checks*/

    function isExpandable(link){
        return isImage(link.href) || isVideoFile(link.href) || isTweet(link.href) || isYoutubeLink(link.href) || isImgurAlbum(link.href) || isImgurGallery(link.href) || isStreamable(link.href) || isBitchute(link.href) || isBannedVideo(link.href) || isMAGAVideo(link.href) || isLBRYVideo(link.href) || isOdyseeVideo(link.href);
    }

    function isImage(url){
        var imageExtensions = [".jpg",".jpeg",".png",".gif",".webp"];
        var length = imageExtensions.length;
        for(var i = 0; i < length; i++){
            if(url.includes(imageExtensions[i])){
                return true;
            }
        }
        return false;
    }

    function isVideoFile(url){
        var videoExtensions = [".mp4",".webm"];
        var length = videoExtensions.length;
        for(var i = 0; i < length; i++){
            if(url.includes(videoExtensions[i])){
                return true;
            }
        }
        return false;
    }

    function isTweet(url){
        return !url.search("(https:\/\/twitter.com\/.*?\/(status)\/)");
    }

    function isYoutubeLink(url){
        var ytregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        return url.search(ytregexp) >= 0;
    }

    function isImgurAlbum(url){
        var imgurAlbumRegExp = /imgur.com\/a\/.{0,20}/;
        return url.search(imgurAlbumRegExp) >= 0;
    }

    function isImgurGallery(url){
        var imgurGalleryRegExp = /imgur.com\/gallery\/.{0,20}/;
        return url.search(imgurGalleryRegExp) >= 0;
    }

    function isStreamable(url){
        var streamableRegex = /https:\/\/streamable\.com\/.*/;
        return url.search(streamableRegex) >= 0;
    }

    function isBitchute(url){
        var bitchuteRegex = /https:\/\/(www.)*bitchute\.com\/video\/.*/;
        return url.search(bitchuteRegex) >= 0;
    }

    function isBannedVideo(url){
        var bannedVideoRegex = /https:\/\/banned\.video\/watch\?.*/;
        return url.search(bannedVideoRegex) >= 0;
    }

    function isMAGAVideo(url){
        var MAGAVideoRegex = /https:\/\/video\.maga\.host\/videos\/watch\/.*/;
        return url.search(MAGAVideoRegex) >= 0;
    }

    function isLBRYVideo(url){
        var LBRYVideoRegex = /https:\/\/lbry\.tv\/@.*\:.*\/.*/;
        return url.search(LBRYVideoRegex) >= 0;
    }

    function isOdyseeVideo(url){
        var OdyseeVideoRegex = /https:\/\/odysee\.com\/@.*\:.*\/.*/;
        return url.search(OdyseeVideoRegex) >= 0;
    }

    function getYoutubeId(url){
        var ID = '';
        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if(url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        }
        else {
            ID = url;
        }
        return ID;
    }

    /* imgur */

    function alterImgurAlbumInterface(imgurAlbumMain, albumData) {

        console.log(albumData);
        if(albumData.data.title){imgurAlbumMain.querySelector(".expando-imgur-album-title").innerHTML = '\"' + albumData.data.title + '\"';}
        imgurAlbumMain.querySelector(".expando-imgur-album-size").innerHTML = albumData.data.images_count;
        imgurAlbumMain.querySelector(".expando-imgur-album-image-number").innerHTML = 1;


        var imgurAlbumImageLinks = [];
        for(var media of albumData.data.images){
          imgurAlbumImageLinks.push(media.link);
        }


        var imgurAlbumContent = imgurAlbumMain.querySelector(".expando-imgur-album-content");

        if(isImage(imgurAlbumImageLinks[0])){
            imgurAlbumContent.appendChild(createImageElement(imgurAlbumImageLinks[0]));
        }
        else if(isVideoFile(imgurAlbumImageLinks[0])){
            imgurAlbumContent.appendChild(createVideoElement(imgurAlbumImageLinks[0]));
        }


        var index = 0;
        var buttons = imgurAlbumMain.querySelectorAll("button");

        buttons[0].onclick = function(){
          if(index > 0){
            var link = imgurAlbumImageLinks[--index];
          }
          else{
            index = imgurAlbumImageLinks.length-1;
            link = imgurAlbumImageLinks[index];
            this.innerHTML = "Previous";
            buttons[1].innerHTML = "First";
          }
            if(index < imgurAlbumImageLinks.length-1){buttons[1].innerHTML = "Next";}

            var media = undefined;
            if(isImage(link)){media = createImageElement(link);}
            else if(isVideoFile(link)){media = createVideoElement(link);}

            imgurAlbumMain.querySelector(".expando-imgur-album-image-number").innerHTML = index + 1;

            imgurAlbumContent.removeChild(imgurAlbumContent.firstElementChild);
            imgurAlbumMain.querySelector(".expando-imgur-album-content").appendChild(media);

            if(index == 0){
                this.innerHTML = "Last";
            }
        }


        buttons[1].onclick = function(){
          if(index < imgurAlbumImageLinks.length-1){
            var link = imgurAlbumImageLinks[++index];
          }
          else{
              index = 0;
              link = imgurAlbumImageLinks[index];
              this.innerHTML = "Next";
              buttons[0].innerHTML = "Last";
          }
            if(index > 0){buttons[0].innerHTML = "Previous";}

            var media = undefined;
            if(isImage(link)){media = createImageElement(link);}
            else if(isVideoFile(link)){media = createVideoElement(link);}

            imgurAlbumMain.querySelector(".expando-imgur-album-image-number").innerHTML = index + 1;
            imgurAlbumContent.removeChild(imgurAlbumContent.firstElementChild);
            imgurAlbumMain.querySelector(".expando-imgur-album-content").appendChild(media);

            if(index == imgurAlbumImageLinks.length-1){
                this.innerHTML = "First";
            }

        }
    }

    function expandoImgurAlbumInterfaceCss(){
        var imgurAlbumInterfaceCss = document.createElement("style");
        imgurAlbumInterfaceCss.innerHTML = ".expandoNavigationBtn { display: inline-block; text-align: center; text-decoration: none; margin: 1px 0; border: solid 1px transparent; border-radius: 4px; padding: 0.2em 0.2em; color: #ffffff; background-color: black;}.expandoNavigationBtn:active { transform: translateY(1px); filter: saturate(150%);}.expandoNavigationBtn:hover { color: black; border-color: currentColor; background-color: white;}.expandoNavigationBtn:focus { outline: none;}.expandoNavigationBtn { outline: none;}.expandoNavigationBtn::-moz-focus-inner { border: none;}";
        document.body.appendChild(imgurAlbumInterfaceCss);

    }

    function expandoImgurAlbumCreateImage(url){
        var img = document.createElement("img");
        img.src = url;
        img.style.maxWidth = "1000px";
        return img;
    }

    function createImgurAlbumInterface(){

        var baseName = "expando-imgur-album";

        var expandoImgurAlbumMain = document.createElement("div");
        expandoImgurAlbumMain.id = "expando-imgur-album-main";

        var expandoImgurAlbumControls = document.createElement("div");
        var expandoImgurAlbumTitle = document.createElement("div");
        expandoImgurAlbumTitle.className = "expando-imgur-album-title";

        var expandoImgurAlbumSize = document.createElement("div");
        var expandoImgurInlineAlbumSize = document.createElement("span");
        expandoImgurInlineAlbumSize.className = baseName + "-size";

        var expandoImgurInlineAlbumImageNumber = document.createElement("span");
        expandoImgurInlineAlbumImageNumber.className = baseName + "-image-number";

        var expandoImgurAlbumContent = document.createElement("div");
        expandoImgurAlbumContent.className = "expando-imgur-album-content";

        var expandoImgurPreviousButton = document.createElement("button");
        expandoImgurPreviousButton.innerHTML = "Last";
        expandoImgurPreviousButton.className = "expandoNavigationBtn";

        var expandoImgurNextButton = document.createElement("button");
        expandoImgurNextButton.innerHTML = "Next";
        expandoImgurNextButton.className = "expandoNavigationBtn";

        //expandoImgurAlbumSize.appendChild(document.createTextNode("Showing "));
        expandoImgurAlbumSize.appendChild(expandoImgurInlineAlbumImageNumber);
        expandoImgurAlbumSize.appendChild(document.createTextNode(" of "));
        expandoImgurAlbumSize.appendChild(expandoImgurInlineAlbumSize);

        expandoImgurAlbumControls.appendChild(expandoImgurPreviousButton);
        expandoImgurAlbumControls.appendChild(expandoImgurNextButton);

        expandoImgurAlbumMain.appendChild(expandoImgurAlbumTitle);
        expandoImgurAlbumMain.appendChild(expandoImgurAlbumSize);
        expandoImgurAlbumMain.appendChild(expandoImgurAlbumControls);
        expandoImgurAlbumMain.appendChild(expandoImgurAlbumContent);

        return expandoImgurAlbumMain;
    }

    /* create media */

    function createImageElement(src){
        var media = document.createElement("img");
        media.src = src;
        return media;
    }

    function createVideoElement(src){
        var media = document.createElement("video");
        media.src = src;
        var extlength = media.src.length - media.src.lastIndexOf(".") - 1;
        var type = media.src.slice(-extlength);
        media.setAttribute("type", "video/" + type);
        media.setAttribute("controls","");
        return media;
    }

    function createTweetElement(src){
        var tweetlink = document.createElement("a");
        tweetlink.href = src;

        var media = document.createElement("blockquote");
        media.className = "twitter-tweet";
        media.appendChild(tweetlink);
        return media;
    }

    function createNullElement(src){
        return null;
    }

    /* finishers */

    function twitterWidget(src, div){
        var scr = document.createElement("script");
            scr.id = "tweet-script";
            scr.charset = "utf-8";
            scr.src= "https://platform.twitter.com/widgets.js";
            scr.async = true;
            document.body.appendChild(scr);
    }

    function youtubeWidget(src, div){
        var videoId = getYoutubeId(src);
        if(src.includes("t=")){
            var split = src.split("=");
            var startTime = split[split.length-1].split("s")[0];
            videoId += "?start=" + startTime;
        }

        var obj = {"video": {"value": "<iframe title='YouTube video player' type=\"text/html\" width='640'  height='390' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0' allowFullScreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function imgurAlbumGalleryFinisher(src, div){
        var album = mediaLinkDictionary[src];
        if(album.data.images_count > 2){
            expandoImgurAlbumInterfaceCss();
            alterImgurAlbumInterface(div, album);
        }
    }

    function streamableWidget(src, div){
        var split = src.split("/");
        var videoid = split[split.length-1];

        var obj = {"video": {"value": "<div style='width: 100%; height: 0px; position: relative; padding-bottom: 56.25%;'><iframe class='streamable-embed' src='https://streamable.com/o/" + videoid + "' frameborder='0' scrolling='no' style='width: 100%; height: 100%; position: absolute;' allowfullscreen></iframe></div>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function bitchuteWidget(src, div){
        var split = src.split("/");
        var videoid = "";

        var last = split[split.length-1];
        if(last.length > 0) {videoid = last}
        else {videoid = split[split.length-2];}

        var obj = {"video": {"value": "<iframe title='Bitchute video player' type=\"text/html\" width='640'  height='390' src='https://www.bitchute.com/embed/" + videoid + "' frameborder='0' allowFullScreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function bannedVideoWidget(src, div){

        var split = src.split("=");
        var videoid = split[split.length-1];

        var obj = {"video": {"value": "<iframe title='Infowars video player' type=\"text/html\" width='640'  height='390' src='https://api.banned.video/embed/" + videoid + "' frameborder='0' allowFullScreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function MAGAVideoWidget(src, div){
        var split = src.split("/");
        var videoid = split[split.length-1];

        var obj = {"video": {"value": "<iframe width='560' height='315' sandbox='allow-same-origin allow-scripts allow-popups' src='https://video.maga.host/videos/embed/" + videoid + "' frameborder='0' allowfullscreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function LBRYVideoWidget(src, div){
        var split = src.split("/");
        var videoid = split[split.length-1];

        var obj = {"video": {"value": "<iframe id='lbry-iframe' width='560' height='315' src='https://lbry.tv/$/embed/" + videoid + "' allowfullscreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function OdyseeVideoWidget(src, div){
        var split = src.split("/");
        var videoid = split[split.length-1];

        var obj = {"video": {"value": "<iframe id='lbry-iframe' width='560' height='315' src='https://odysee.com/$/embed/" + videoid + "' allowfullscreen></iframe>"}};

        $("#"+div.id).html(obj.video.value);
    }

    function noop (){}

    function expandMedia(node){

        var div = document.createElement("div");
        div.style = "resize: both";
        div.id = "id" + Math.random().toString(16).slice(2);
        node.setAttribute("data-media-id", div.id);

        var mediaSource = node.getAttribute("data-media-source");
        var mediaType = node.getAttribute("data-media-type");
        var media = expandos[mediaType].createMedia(mediaSource);

        /*fix this some day*/
        if(!mediaType.localeCompare("imgurAlbum") || !mediaType.localeCompare("imgurGallery")){
            var albumHash = mediaSource.split("/");
            albumHash = albumHash[albumHash.length-1];

            var apiUrl = "https://api.imgur.com/3/album/";
            var albumData = mediaLinkDictionary[mediaSource];

            if(!mediaType.localeCompare("imgurGallery")){apiUrl = "https://api.imgur.com/3/gallery/album/";}


            if(albumData === undefined){
                GM_xmlhttpRequest ( {
                    method: "GET",
                    url: apiUrl + albumHash,
                    headers: {
                        "Authorization": "Client-ID 1d8d9b36339e0e2"
                    },
                    onload: function (response) {
                        if(response.status === 404){
                            media = document.createTextNode("404: not found");
                            if(media){div.appendChild(media);}
                            node.setAttribute("data-media-id", div.id);
                            node.parentElement.insertBefore(div, node.nextSibling);
                            return;
                        }
                        console.log (response.responseText);

                        var reqAlbumData = JSON.parse(response.responseText);
                        mediaLinkDictionary[mediaSource] = reqAlbumData;

                        if(reqAlbumData.data.images_count > 2){
                            media = createImgurAlbumInterface();
                        }
                        else{
                            var singleMedia = reqAlbumData.data.images[0].link;
                            if(isVideoFile(singleMedia)){
                                media = createVideoElement(singleMedia);
                            }
                            else if(isImage(singleMedia)){
                                media = createImageElement(singleMedia);
                            }
                        }

                        if(media){div.appendChild(media);}
                        node.setAttribute("data-media-id", div.id);
                        node.parentElement.insertBefore(div, node.nextSibling);

                        if(reqAlbumData.data.images_count > 2){
                            expandoImgurAlbumInterfaceCss();
                            alterImgurAlbumInterface(div, reqAlbumData);
                        }
                    }
                } );
                return;
            }

            if(albumData.data.images_count > 2){
                media = createImgurAlbumInterface();
            }
            else{
                var singleMedia = albumData.data.images[0].link;
                if(isVideoFile(singleMedia)){
                    media = createVideoElement(singleMedia);
                }
                else if(isImage(singleMedia)){
                    media = createImageElement(singleMedia);
                }
            }
        }

        if(media){div.appendChild(media);}

        node.setAttribute("data-media-id", div.id);
        node.parentElement.insertBefore(div, node.nextSibling);

        expandos[mediaType].finisher(mediaSource, div);

    }


    function contractMedia(node){
        var id = node.getAttribute("data-media-id");
        var media = document.getElementById(id);
        node.parentElement.removeChild(media);
        node.removeAttribute("data-media-id");

    }

    var expandos = {
        image: {
            svgwidth: "1.1em",
            svgheight: "1.1em",
            svgviewBox: "0 -3 35 35",
            svgpath: "M10 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3zM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18z",
            createMedia: createImageElement,
            finisher: noop,
            },
        video: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createVideoElement,
            finisher: noop,
            },
        tweet: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 60 60",
            svgpath: "M60 16l-6 1l4-5l-7 2c-9-10-23 1-19 10C16 24 8 12 8 12s-6 9 4 16l-6-2c0 6 4 10 11 12h-7c4 8 11 8 11 8s-6 5-17 5c33 16 53-14 50-30z",
            createMedia: createTweetElement,
            finisher: twitterWidget,
            },
        youtubeVideo: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: youtubeWidget,
            },
        imgurAlbum: {
            svgwidth: "1.1em",
            svgheight: "1.1em",
            svgviewBox: "0 -3 35 35",
            svgpath: "M10 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3zM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18z",
            createMedia: createNullElement,
            finisher: imgurAlbumGalleryFinisher,
            },
        imgurGallery: {
            svgwidth: "1.1em",
            svgheight: "1.1em",
            svgviewBox: "0 -3 35 35",
            svgpath: "M10 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3zM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18z",
            createMedia: createNullElement,
            finisher: imgurAlbumGalleryFinisher,
            },
        streamable: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: streamableWidget,
            },
        bitchute: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: bitchuteWidget,
            },
        bannedVideo: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: bannedVideoWidget,
            },
        MAGAVideo: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: MAGAVideoWidget,
            },
        LBRYVideo: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: LBRYVideoWidget,
            },
        OdyseeVideo: {
            svgwidth: "1.2em",
            svgheight: "1.2em",
            svgviewBox: "0 -3 20 20",
            svgpath: "M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z",
            createMedia: createNullElement,
            finisher: OdyseeVideoWidget,
            }
    }

    function getMediaType(url){
        if(isImage(url)){return "image";}
        else if (isVideoFile(url)){return "video";}
        else if (isTweet(url)){return "tweet";}
        else if (isYoutubeLink(url)){return "youtubeVideo";}
        else if (isImgurAlbum(url)){return "imgurAlbum";}
        else if (isImgurGallery(url)){return "imgurGallery";}
        else if (isStreamable(url)){return "streamable";}
        else if (isBitchute(url)){return "bitchute";}
        else if (isBannedVideo(url)){return "bannedVideo";}
        else if (isMAGAVideo(url)){return "MAGAVideo";}
        else if (isLBRYVideo(url)){return "LBRYVideo";}
        else if (isOdyseeVideo(url)){return "OdyseeVideo";}
        return "notMedia";
    }

    function createExpandoButton(url){

        var type = getMediaType(url);
        if (!type.localeCompare("notMedia")){return};

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "aria-hidden", true);
        svg.setAttributeNS(null, "focusable", false);
        svg.setAttributeNS(null, "preserveAspectRatio", "xMidYMid meet");
        svg.setAttributeNS(null, "class", "inline-expand-content-button");
        svg.setAttributeNS(null, "width", expandos[type].svgwidth);
        svg.setAttributeNS(null, "height", expandos[type].svgheight);
        svg.setAttributeNS(null, "viewBox", expandos[type].svgviewBox);
        svg.style = "-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg); padding-left: 3px; cursor: pointer";

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "fill","currentColor");
        path.setAttributeNS(null, "d",expandos[type].svgpath);

        var label = document.createElement("label");
        label.className = "expando-checkbox-label";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        var container = document.createElement("div");
        container.className = "expando-checkbox-container";
        container.setAttribute("data-media-type", type);
        container.setAttribute("data-media-source", url);

        svg.appendChild(path);
        label.appendChild(svg);
        label.appendChild(checkbox);
        container.appendChild(label);

        checkbox.addEventListener( 'change', function() {
            if(this.checked) {
                this.parentElement.querySelector("path").style.fill = "#e7c6ac";
                expandMedia(this.parentElement.parentElement);
            } else {
                this.parentElement.querySelector("path").style.fill = "currentColor";
                contractMedia(this.parentElement.parentElement);
            }
        });

        return container;
    }


    function singleCommentExpandMedia(content){
        var links = content.querySelectorAll("a");
        for(var link of links){
            if(isExpandable(link)){
                link.parentElement.insertBefore(createExpandoButton(link.href), link.nextSibling);
            }
        }

        var style = document.createElement("style");
        style.innerHTML = ".expando-checkbox-container{display: inline-block}.expando-checkbox-label { display: block; position: relative; padding-left: 0px; margin-bottom: 0px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}.expando-checkbox-label input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;}.expando-checkbox-label:hover input { background-color: #ccc;}.expando-checkbox-label input:checked { display: block;}";
        document.body.appendChild(style);
    }

    function commentsEnhancerExpandMedia(){

        var posts = document.getElementsByClassName("content");

        for(var post of posts){
            var links = post.querySelectorAll("a");
            for(var link of links){
                if(isExpandable(link)){
                    link.parentElement.insertBefore(createExpandoButton(link.href), link.nextSibling);
                }
            }
        }

        var style = document.createElement("style");
        style.innerHTML = ".expando-checkbox-container{display: inline-block}.expando-checkbox-label { display: block; position: relative; padding-left: 0px; margin-bottom: 0px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}.expando-checkbox-label input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;}.expando-checkbox-label:hover input { background-color: #ccc;}.expando-checkbox-label input:checked { display: block;}";
        document.body.appendChild(style);
    }


    /************************ MAIN ************************/

    generalEnhancerAddNavigationBar();
    generalEnhancerAddPointRedirection();
    generalEnhancerAddSettingsButton();
    mainPageEnhancerAddToolBar();
    mainPageEnhancerAutoExpandMedia();
    mainPageEnhancerAddTagButtons();


    //if im viewing a post:
    if(document.location.href.search("/p/") > 0){
        commentsEnhancerAddAutomaticQuotes();
        commentsEnhancerExpandMedia();
    }

    var userPostsOrCommentsRegex = /\/u\/.*\/\?type=(\bpost\b|\bcomment\b)/;
    var messagesPageRegex = /\/messages/;
    var userPageRegex = /\/u\/.*/;

    if(document.location.href.search(userPageRegex) > 0) {
        commentsEnhancerExpandMedia();
    }

    if (document.location.href.search(messagesPageRegex) > 0){
        commentsEnhancerAddAutomaticQuotes();
    }



    /************************ 7. Update notification ************************/


    //Thank you: https://codepen.io/takaneichinose/pen/eZoZxv

    class MessageBox {
        constructor(id, option) {
            this.id = id;
            this.option = option;
        }

        show(msg, label = "Close", callback = null) {
            if (this.id === null || typeof this.id === "undefined") {
                // if the ID is not set or if the ID is undefined

                throw "Please set the 'ID' of the message box container.";
            }

            if (msg === "" || typeof msg === "undefined" || msg === null) {
                // If the 'msg' parameter is not set, throw an error

                throw "The 'msg' parameter is empty.";
            }

            if (typeof label === "undefined" || label === null) {
                // Of the label is undefined, or if it is null

                label = "Close";
            }

            let option = this.option;

            let msgboxArea = document.querySelector(this.id);
            let msgboxBox = document.createElement("DIV");
            let msgboxContent = document.createElement("DIV");
            let msgboxClose = document.createElement("A");

            if (msgboxArea === null) {
                // If there is no Message Box container found.

                throw "The Message Box container is not found.";
            }

            // Content area of the message box
            msgboxContent.classList.add("msgbox-content");
            msgboxContent.innerHTML = msg;

            // Close button of the message box
            msgboxClose.classList.add("msgbox-close");
            msgboxClose.setAttribute("href", "#");
            msgboxClose.innerText = label;

            // Container of the Message Box element
            msgboxBox.classList.add("msgbox-box");
            msgboxBox.appendChild(msgboxContent);

            if (option.hideCloseButton === false
                || typeof option.hideCloseButton === "undefined") {
                // If the hideCloseButton flag is false, or if it is undefined

                // Append the close button to the container
                msgboxBox.appendChild(msgboxClose);
            }

            msgboxArea.appendChild(msgboxBox);

            msgboxClose.addEventListener("click", (evt) => {
                evt.preventDefault();

                if (msgboxBox.classList.contains("msgbox-box-hide")) {
                    // If the message box already have 'msgbox-box-hide' class
                    // This is to avoid the appearance of exception if the close
                    // button is clicked multiple times or clicked while hiding.

                    return;
                }

                this.hide(msgboxBox, callback);
            });

            if (option.closeTime > 0) {
                this.msgboxTimeout = setTimeout(() => {
                    this.hide(msgboxBox, callback);
                }, option.closeTime);
            }
        }

        hide(msgboxBox, callback) {
            if (msgboxBox !== null) {
                // If the Message Box is not yet closed

                msgboxBox.classList.add("msgbox-box-hide");
            }

            msgboxBox.addEventListener("transitionend", () => {
                if (msgboxBox !== null) {
                    // If the Message Box is not yet closed

                    msgboxBox.parentNode.removeChild(msgboxBox);

                    clearTimeout(this.msgboxTimeout);

                    if (callback !== null) {
                        // If the callback parameter is not null
                        callback();
                    }
                }
            });
        }
    }

    // Creation of Message Box class, and the sample usage
    let msgboxbox = new MessageBox("#msgbox-area", {
        closeTime: 7000,
        hideCloseButton: false
    });


    var version = GM.getValue("wes_version");
    version.then(function(result) {

        var compareVersions = GM.info.script.version.localeCompare(result);

        if(compareVersions){

            var notificationCss = '.msgbox-area { max-height: 100%; position: fixed; bottom: 15px; left: 20px; right: 20px;}.msgbox-area .msgbox-box { font-size: inherit; color: #ffffff; background-color: rgba(0, 0, 0, 0.8); padding: 18px 20px; margin: 0 0 15px; display: flex; align-items: center; position: relative; justify-content: space-between; border-radius: 12px; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.65); transition: opacity 300ms ease-in;}.msgbox-area .msgbox-box.msgbox-box-hide { opacity: 0;}.msgbox-area .msgbox-box:last-child { margin: 0;}.msgbox-area .msgbox-content { flex-shrink: 1;}.msgbox-area .msgbox-close { color: #ffffff; font-weight: bold; text-decoration: none; margin: 0 0 0 20px; flex-grow: 0; flex-shrink: 0; position: relative; transition: text-shadow 225ms ease-out;}.msgbox-area .msgbox-close:hover { text-shadow: 0 0 3px #efefef;}@media (min-width: 481px) and (max-width: 767px) { .msgbox-area { left: 80px; right: 80px; }}@media (min-width: 768px) { .msgbox-area { width: 480px; height: 0; top: 15px; left: auto; right: 15px; }}.msgbox-area { font-size: 16px;}.msgbox-message-container { text-align: center; width: 100vw; height: 100vh; padding: 20px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; flex-direction: column;}.msgbox-message-container h1, .msgbox-message-container h3 { margin: 10px 20px;}.msgbox-message-container p { margin: 5px 20px;}.msgbox-message-button { font-size: 18px; font-weight: bold; font-family: inherit; color: white; background-color: #1476ff; width: 250px; border: solid 2px #005de0; padding: 10px 20px; cursor: pointer; outline: none; box-shadow: 0 5px #005de0; transition: background-color 100ms ease-out, box-shadow 100ms ease-out, transform 100ms ease-out;}.msgbox-message-button:hover, .msgbox-message-button:focus, .msgbox-message-button:active { background-color: #2e85ff;}.msgbox-message-button:active { background-color: #0068fa; box-shadow: 0 0 #005de0; transform: translateY(5px);} .msgbox-link { color: #007BA7; text-decoration: none;}.msgbox-link:hover { text-decoration: underline;}.msgbox-link:active { color: black;}.msgbox-link:visited { color: #007BA7;}';

            var notificationStyle = document.createElement("style");
            notificationStyle.id = "notification-style";
            document.body.appendChild(notificationStyle);

            var appendedNotificationStyle = document.getElementById("notification-style");
            if(appendedNotificationStyle){
                appendedNotificationStyle.innerHTML = notificationCss;
            }

            var messageBoxArea = document.createElement("div");
            messageBoxArea.id = "msgbox-area";
            messageBoxArea.className = "msgbox-area";

            document.body.appendChild(messageBoxArea);


            var message = "WES has been updated to <a class=\"msgbox-link\" href=\"https://github.com/ilovestaples/wes/blob/master/CHANGELOG.md\" target=\"_blank\">version " + GM.info.script.version + "</a>";
            msgboxbox.show(message, null);

            GM.setValue("wes_version",GM.info.script.version);
        }
    });



    /************************ User Tagger *******************************/

    var taggerDialogStyle = document.createElement("style");
    taggerDialogStyle.innerHTML = '.userTagger-dialog {display: flex;flex-direction: column;width: 350px;background-color: white;font-family: sans-serif;font-size: 12px;padding: 2px;}.userTagger-dialog-header {height: 40px;font-size: larger;display: flex;align-items: center;justify-content: space-between;font-weight: bold;background-color: ghostwhite;}.userTagger-dialog-header-container {display: flex;justify-content: space-between;width: 350px;}.userTagger-header-user-container {display: flex;justify-content: space-between;padding-left: 4px;}#userTagger-header-user-username {padding-left: 4px;max-width: 250px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;}.userTagger-header-controls-container {display: flex;justify-content: space-between;}.userTagger-dialog-controls-container {border: 1px red solid;display: flex;justify-content: space-between;}.WESDialogContents{ padding: 5px;}.fieldPair {display: flex;align-items: center;padding: 4px 0px 4px 0px;}.fieldPair-label {width: 85px;}.fieldPair-text {min-width: 240px;float: left;}.wes-usertagger-footer {display: flex;justify-content: space-between;align-content: center;align-items: center;}.userTag {padding: 0 4px;border: 1px solid #c7c7c7;border-radius: 3px;font-size: .9em;max-width: 150px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;vertical-align: text-bottom;line-height: normal;margin: 0px 2px 0px 2px;cursor: pointer;}';

    document.body.appendChild(taggerDialogStyle);



    function userTaggerShowForm(obj){

        var pos = cumulativeOffset(obj.parentElement);

        var user = obj.closest(".author");
        if(!user){user = obj.parentElement.querySelector(".author");}

        user = user.textContent.trim();

        var formMarkup = document.createElement("div");
        formMarkup.innerHTML = '<div class="userTagger-dialog" style="position: absolute; top: ' +pos.top+'px; left: '+pos.left+'px; z-index:10"> <h3 class="userTagger-dialog-header"> <div class="userTagger-dialog-header-container"> <div class="userTagger-header-user-container"> <svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" cursor="pointer" style="vertical-align: -0.275em; transform: rotate(360deg);" class="tag-button" width="1.2em" height="1.2em" viewBox="0 0 24 24"> <g transform="translate(24 0) scale(-1 1)"> <g fill="none"> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M2 8v8a1 1 0 0 0 1 1h13.62a1 1 0 0 0 .76-.35l3.428-4a1 1 0 0 0 0-1.3l-3.428-4a1 1 0 0 0-.76-.35H3a1 1 0 0 0-1 1zM0 8v8a3 3 0 0 0 3 3h13.62a3 3 0 0 0 2.278-1.048l3.428-4a3 3 0 0 0 0-3.904l-3.428-4A3 3 0 0 0 16.62 5H3a3 3 0 0 0-3 3z"></path> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M15 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 2a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"></path> </g> </g> </svg> <span id="userTagger-header-user-username">user</span> </div> <div class="userTagger-header-controls-container"> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> </svg> <button id="tagDialogIgnoreUser" style="display: none;"></button> </label> </span> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label" title="close"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" cursor="pointer" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> <path d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L12 13.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L10.586 12L7.757 9.172a1 1 0 0 1 1.415-1.415L12 10.586l2.828-2.829a1 1 0 0 1 1.415 1.415L13.414 12z" fill="#538cc6"/> <rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" /> </svg> <button id="tagDialogClose" style="display: none;"></button> </label> </span> </div> </div> </h3> <div data-hover-element="1" class="WESHoverBody WESDialogContents"> <form id="userTaggerToolTip"> <div class="fieldPair"><label class="fieldPair-label" for="userTaggerText">Text</label><input class="fieldPair-text" type="text" id="userTaggerText" value=""></div> <div class="fieldPair"> <label class="fieldPair-label" for="userTaggerColor">Color</label> <select id="userTaggerColor"> <option style="color: inherit; background-color: none" value="none">none</option> <option style="color: black; background-color: aqua" value="aqua">aqua</option> <option style="color: white; background-color: black" value="black">black</option> <option style="color: white; background-color: blue" value="blue">blue</option> <option style="color: white; background-color: cornflowerblue" value="cornflowerblue">cornflowerblue</option> <option style="color: white; background-color: fuchsia" value="fuchsia">fuchsia</option> <option style="color: white; background-color: gray" value="gray">gray</option> <option style="color: white; background-color: green" value="green">green</option> <option style="color: black; background-color: lime" value="lime">lime</option> <option style="color: white; background-color: maroon" value="maroon">maroon</option> <option style="color: white; background-color: navy" value="navy">navy</option> <option style="color: white; background-color: olive" value="olive">olive</option> <option style="color: white; background-color: orange" value="orange">orange</option> <option style="color: white; background-color: orangered" value="orangered">orangered</option> <option style="color: black; background-color: pink" value="pink">pink</option> <option style="color: white; background-color: purple" value="purple">purple</option> <option style="color: white; background-color: red" value="red">red</option> <option style="color: black; background-color: silver" value="silver">silver</option> <option style="color: white; background-color: teal" value="teal">teal</option> <option style="color: black; background-color: white" value="white">white</option> <option style="color: black; background-color: yellow" value="yellow">yellow</option> </select> </div> <div class="fieldPair" style="flex-wrap: wrap"><label class="fieldPair-label" for="userTaggerPreview">Preview</label><span id="userTaggerPreview"><span class="RESUserTag"><a id="userTagPreview" class="userTag" title="set a tag" href="javascript:void 0">&nbsp;</a></span></span></div> <div class="wes-usertagger-footer"><span id="view-tagged-users" style=" color:blue; cursor: pointer">View tagged users</span><input type="button" id="userTaggerSave" value="✓ save tag" formaction=""></div> </form> </div></div>';

        var formJS = document.createElement("script");
        formJS.innerHTML = 'var userTaggerCloseButton = document.body.querySelector("#tagDialogClose");userTaggerCloseButton.addEventListener("click", destroyDialog);var userTaggerText = document.body.querySelector("#userTaggerText");userTaggerText.addEventListener("input", updateTagPreview);var colorSelector = document.body.querySelector("#userTaggerColor");colorSelector.addEventListener("input", updateTagPreview);var saveButton = document.body.querySelector("#userTaggerSave");saveButton.addEventListener("click", saveTag);function createTag() { var tag = document.createElement("span"); tag.className = "userTag"; tag.id = "userTagPreview"; return tag;}function updateTagPreview(e) { console.log(e); if (e.target.id.localeCompare("userTaggerText") === 0) { if (e.target.textLength == 1) { var preview = document.body.querySelector("#userTaggerPreview"); var tagPreview = preview.querySelector(".userTag"); var tagPreviewNew = createTag(); var tagPreviewParent = tagPreview.parentElement; tagPreviewParent.appendChild(tagPreviewNew); tagPreviewParent.removeChild(tagPreview); tagPreviewNew.style.color = colorSelector.selectedOptions[0].style.color; tagPreviewNew.style.backgroundColor = colorSelector.selectedOptions[0].style.backgroundColor; } document.body.querySelector("#userTagPreview").textContent = e.target.value; } else if (e.target.id.localeCompare("userTaggerColor") === 0) { var preview = document.body.querySelector("#userTagPreview"); console.log(e.target.selectedOptions[0].style.color); console.log(e.target.selectedOptions[0].style.backgroundColor); console.log(preview); preview.style.color = e.target.selectedOptions[0].style.color; preview.style.backgroundColor = e.target.selectedOptions[0].style.backgroundColor; }}function saveTag(){ console.log("tag saved"); destroyDialog();}function destroyDialog(){ var dialog = document.querySelector(".userTagger-dialog"); dialog.parentElement.removeChild(dialog);}';

        document.body.appendChild(formMarkup);
        document.getElementById("userTagger-header-user-username").innerHTML = user;

        if(tags[user]){

            var formTagTextInput = document.getElementById("userTaggerText");
            formTagTextInput.value = tags[user].text;

            var formTagColorSelect = document.getElementById("userTaggerColor");
            formTagColorSelect.value = tags[user].backgroundColor;

            var preview = document.getElementById("userTagPreview");
            preview.innerText = tags[user].text;
            preview.style.color = tags[user].color;
            preview.style.backgroundColor = tags[user].backgroundColor;
        }

        formjs();
    }


    /*Tagger dialog code*/
    function createTag() {
        var tag = document.createElement("span");
        tag.className = "userTag";
        tag.id = "userTagPreview";
        return tag;
    }

    function updateTagPreview(e) {

        var colorSelector = document.body.querySelector("#userTaggerColor");

        if (e.target.id.localeCompare("userTaggerText") === 0) {
            if (e.target.textLength == 1) {
                var preview = document.body.querySelector("#userTaggerPreview");
                var tagPreview = preview.querySelector(".userTag");
                var tagPreviewNew = createTag();
                var tagPreviewParent = tagPreview.parentElement;
                tagPreviewParent.appendChild(tagPreviewNew);
                tagPreviewParent.removeChild(tagPreview);
                tagPreviewNew.style.color = colorSelector.selectedOptions[0].style.color;
                tagPreviewNew.style.backgroundColor = colorSelector.selectedOptions[0].style.backgroundColor;
            }
            document.body.querySelector("#userTagPreview").textContent = e.target.value;
        } else if (e.target.id.localeCompare("userTaggerColor") === 0) {
            var rdpreview = document.body.querySelector("#userTagPreview");
            rdpreview.style.color = e.target.selectedOptions[0].style.color;
            rdpreview.style.backgroundColor = e.target.selectedOptions[0].style.backgroundColor;
        }
    }

    /*SAVE HANDLER*/

    function saveTag(){



        var user = document.body.querySelector("#userTagger-header-user-username").innerText.trim();

        var utc = document.body.querySelector("#userTaggerColor");
        var tagData = {
            color : utc.selectedOptions[0].style.color,
            backgroundColor : utc.selectedOptions[0].style.backgroundColor,
            text : document.body.querySelector("#userTagPreview").textContent
        }


        if(!tags[user]){
            console.log("tag doesnt exist");
            var authors = document.body.querySelectorAll(".author");
            for(var author of authors){
                if(!author.innerText.trim().localeCompare(user)){
                    var tbc = author.querySelector(".tag-button-container");
                    author.removeChild(tbc);

                    var tag = createTag();
                    tag.id = "";
                    tag.style.color = tagData.color;
                    tag.style.backgroundColor = tagData.backgroundColor;
                    tag.textContent = tagData.text;
                    author.parentElement.insertBefore(tag, author.nextSibling);
                    tag.addEventListener("click", function(){userTaggerShowForm(this)});
                }
            }
        }



        tags[user] = tagData;
        GM.setValue("tags",JSON.stringify(tags));

        destroyDialog();

        //if user already had a tag, refresh it
        var allTags = document.body.querySelectorAll(".userTag");
        for(var tag of allTags){
            if(!tag.previousSibling.innerText.trim().localeCompare(user)){
                tag.style.color = tags[user].color;
                tag.style.backgroundColor = tags[user].backgroundColor;
                tag.innerText = tags[user].text;
            }
        }
    }

    function destroyDialog(){

        var dialog = document.querySelector(".userTagger-dialog");
        dialog.parentElement.removeChild(dialog);

    }

    function formjs(){
        var userTaggerCloseButton = document.body.querySelector("#tagDialogClose");
        userTaggerCloseButton.addEventListener("click", destroyDialog);

        var userTaggerText = document.body.querySelector("#userTaggerText");
        userTaggerText.addEventListener("input", updateTagPreview);
        var colorSelector = document.body.querySelector("#userTaggerColor");
        colorSelector.addEventListener("input", updateTagPreview);

        var viewTaggedUsers = document.getElementById("view-tagged-users");
        viewTaggedUsers.addEventListener("click", viewTaggedUsers_f);


        /*SAVE*/

        var saveButton = document.body.querySelector("#userTaggerSave");
        saveButton.addEventListener("click", saveTag);
    }

    function viewTaggedUsers_f(){
        displaySettings();
        showTagSettings();
    }

    /*End tagger dialog code*/


    function cumulativeOffset(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left + 15
        };
    };

    function createTagButton(){

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "aria-hidden", true);
        svg.setAttributeNS(null, "focusable", false);
        svg.setAttributeNS(null, "preserveAspectRatio", "xMidYMid meet");
        svg.style = "vertical-align: -0.0em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg); cursor: pointer; padding-left: 3px";
        svg.setAttributeNS(null, "class", "tag-button");
        svg.setAttributeNS(null, "width", "1.4em");
        svg.setAttributeNS(null, "height", "0.9em");
        svg.setAttributeNS(null, "viewBox", "5 3 16 16");

        var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttributeNS(null, "fill","#369");
        path1.setAttributeNS(null, "fill-rule","evenodd");
        path1.setAttributeNS(null, "clip-rule","evenodd");
        path1.setAttributeNS(null, "d","M2 8v8a1 1 0 0 0 1 1h13.62a1 1 0 0 0 .76-.35l3.428-4a1 1 0 0 0 0-1.3l-3.428-4a1 1 0 0 0-.76-.35H3a1 1 0 0 0-1 1zM0 8v8a3 3 0 0 0 3 3h13.62a3 3 0 0 0 2.278-1.048l3.428-4a3 3 0 0 0 0-3.904l-3.428-4A3 3 0 0 0 16.62 5H3a3 3 0 0 0-3 3z");

        var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttributeNS(null, "fill","#369");
        path2.setAttributeNS(null, "fill-rule","evenodd");
        path2.setAttributeNS(null, "clip-rule","evenodd");
        path2.setAttributeNS(null, "d","M15 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 2a3 3 0 1 0 0-6a3 3 0 0 0 0 6z");

        var g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g1.setAttributeNS(null, "transform","translate(24 0) scale(-1 1)");
        var g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g2.setAttributeNS(null, "fill","none");


        var label = document.createElement("label");
        label.className = "tag-button-label";

        var button = document.createElement("button");
        button.style.display = "none";

        var container = document.createElement("span");
        container.className = "tag-button-container";
        container.style.display = "none";


        g2.appendChild(path1);
        g2.appendChild(path2);
        g1.appendChild(g2);
        svg.appendChild(g1);
        label.appendChild(svg);
        label.appendChild(button);
        container.appendChild(label);
        return container;
    }

    function loadTagsTable(){

        GM.getValue("tags", "{}").then(function(val) {

            var userTags = JSON.parse(val);

            var taggedUsersTable = document.getElementById("utTable");

            var thead = document.createElement("thead");
            var thUser = document.createElement("th");
            thUser.innerHTML = "User";
            thUser.style.color = "white";
            thUser.style.width = "45%";

            var thTag = document.createElement("th");
            thTag.innerHTML = "Tag";
            thTag.style.color = "white";
            thTag.style.width = "45%";

            var thActions = document.createElement("th");
            thActions.innerHTML = "Actions";
            thActions.style.color = "white";

            thead.appendChild(thUser);
            thead.appendChild(thTag);
            thead.appendChild(thActions);
            taggedUsersTable.appendChild(thead);

            for (var key in userTags) {

                if (userTags.hasOwnProperty(key)) {

                    var row = taggedUsersTable.insertRow(0);

                    var userCell = row.insertCell(-1);
                    var userText = document.createElement("span");
                    userText.innerText = key.toString();
                    userText.style.color = "white";
                    userCell.appendChild(userText);

                    var tag = createTag();
                    tag.id = "";
                    tag.style.color = userTags[key].color;
                    tag.style.backgroundColor = userTags[key].backgroundColor;
                    tag.textContent = userTags[key].text;
                    tag.addEventListener("click", function(){userTaggerShowFormTable(this)});

                    var tagCell = row.insertCell(-1);
                    tagCell.appendChild(tag);

                    var deleteButton = deleteTagButton();
                    deleteButton.querySelector("button").addEventListener("click", function(){deleteTag(this);});

                    var actionsCell = row.insertCell(-1);
                    actionsCell.appendChild(deleteButton);

                    /*var editButton = editTagButton();
                    editButton.querySelector("button").addEventListener("click", function(){userTaggerShowFormTable(this)});
                    actionsCell.appendChild(editButton);*/
                    actionsCell.style = "text-align: center;";

                }
            }
        });
    }

    function unloadTagsTable(){
        var table = document.getElementById("utTable");
        while (table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }
    }

    function deleteTag(obj){

        if(confirm("Do you wish to delete this tag?")){
            var user = obj.closest("tr").querySelector("span").innerText;
            delete tags[user];
            GM.setValue("tags",JSON.stringify(tags));

            var tr = obj.closest("tr");
            obj.closest("tbody").removeChild(tr);


            var authors = document.body.querySelectorAll(".author");
            for(var author of authors){
                if(!author.innerText.trim().localeCompare(user)){
                    var tag = author.nextSibling;
                    var tagButton = createTagButton();
                    author.parentElement.removeChild(tag);
                    author.appendChild(tagButton);

                    tagButton.querySelector("button").addEventListener("click", function(){userTaggerShowForm(this)});
                }
            }
        }
    }

    function userTaggerShowFormTable(obj){

        var currentDialog = document.body.querySelector(".userTagger-dialog");
        if(currentDialog){currentDialog.parentElement.removeChild(currentDialog);}

        var div = document.getElementById("settings-tags-sc");

        var pos = cumulativeOffset(obj.closest("tr").querySelector(".userTag"));

        var postop = pos.top - div.scrollTop;

        var user = obj.closest("tr").querySelector("span").innerText;

        var formMarkup = document.createElement("div");
        //formMarkup.innerHTML = '<div class="userTagger-dialog" style="position: absolute; inset: ' +postop+'px auto auto '+pos.left+'px;"> <h3 class="userTagger-dialog-header"> <div class="userTagger-dialog-header-container"> <div class="userTagger-header-user-container"> <svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" cursor="pointer" style="vertical-align: -0.275em; transform: rotate(360deg);" class="tag-button" width="1.2em" height="1.2em" viewBox="0 0 24 24"> <g transform="translate(24 0) scale(-1 1)"> <g fill="none"> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M2 8v8a1 1 0 0 0 1 1h13.62a1 1 0 0 0 .76-.35l3.428-4a1 1 0 0 0 0-1.3l-3.428-4a1 1 0 0 0-.76-.35H3a1 1 0 0 0-1 1zM0 8v8a3 3 0 0 0 3 3h13.62a3 3 0 0 0 2.278-1.048l3.428-4a3 3 0 0 0 0-3.904l-3.428-4A3 3 0 0 0 16.62 5H3a3 3 0 0 0-3 3z"></path> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M15 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 2a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"></path> </g> </g> </svg> <span id="userTagger-header-user-username">user</span> </div> <div class="userTagger-header-controls-container"> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> </svg> <button id="tagDialogIgnoreUser" style="display: none;"></button> </label> </span> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label" title="close"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" cursor="pointer" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> <path d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L12 13.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L10.586 12L7.757 9.172a1 1 0 0 1 1.415-1.415L12 10.586l2.828-2.829a1 1 0 0 1 1.415 1.415L13.414 12z" fill="#538cc6"/> <rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" /> </svg> <button id="tagDialogClose" style="display: none;"></button> </label> </span> </div> </div> </h3> <div data-hover-element="1" class="WESHoverBody WESDialogContents"> <form id="userTaggerToolTip"> <div class="fieldPair"><label class="fieldPair-label" for="userTaggerText">Text</label><input class="fieldPair-text" type="text" id="userTaggerText" value=""></div> <div class="fieldPair"> <label class="fieldPair-label" for="userTaggerColor">Color</label> <select id="userTaggerColor"> <option style="color: inherit; background-color: none" value="none">none</option> <option style="color: black; background-color: aqua" value="aqua">aqua</option> <option style="color: white; background-color: black" value="black">black</option> <option style="color: white; background-color: blue" value="blue">blue</option> <option style="color: white; background-color: cornflowerblue" value="cornflowerblue">cornflowerblue</option> <option style="color: white; background-color: fuchsia" value="fuchsia">fuchsia</option> <option style="color: white; background-color: gray" value="gray">gray</option> <option style="color: white; background-color: green" value="green">green</option> <option style="color: black; background-color: lime" value="lime">lime</option> <option style="color: white; background-color: maroon" value="maroon">maroon</option> <option style="color: white; background-color: navy" value="navy">navy</option> <option style="color: white; background-color: olive" value="olive">olive</option> <option style="color: white; background-color: orange" value="orange">orange</option> <option style="color: white; background-color: orangered" value="orangered">orangered</option> <option style="color: black; background-color: pink" value="pink">pink</option> <option style="color: white; background-color: purple" value="purple">purple</option> <option style="color: white; background-color: red" value="red">red</option> <option style="color: black; background-color: silver" value="silver">silver</option> <option style="color: white; background-color: teal" value="teal">teal</option> <option style="color: black; background-color: white" value="white">white</option> <option style="color: black; background-color: yellow" value="yellow">yellow</option> </select> </div> <div class="fieldPair" style="flex-wrap: wrap"><label class="fieldPair-label" for="userTaggerPreview">Preview</label><span id="userTaggerPreview"><span class="RESUserTag"><a id="userTagPreview" class="userTag" title="set a tag" href="javascript:void 0">&nbsp;</a></span></span></div> <div class="wes-usertagger-footer"><input type="button" id="userTaggerSave" value="✓ save tag" formaction=""></div> </form> </div></div>';
        formMarkup.innerHTML = '<div class="userTagger-dialog" style="position: absolute; top: ' +postop+'px; left: '+pos.left+'px;"> <h3 class="userTagger-dialog-header"> <div class="userTagger-dialog-header-container"> <div class="userTagger-header-user-container"> <svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" cursor="pointer" style="vertical-align: -0.275em; transform: rotate(360deg);" class="tag-button" width="1.2em" height="1.2em" viewBox="0 0 24 24"> <g transform="translate(24 0) scale(-1 1)"> <g fill="none"> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M2 8v8a1 1 0 0 0 1 1h13.62a1 1 0 0 0 .76-.35l3.428-4a1 1 0 0 0 0-1.3l-3.428-4a1 1 0 0 0-.76-.35H3a1 1 0 0 0-1 1zM0 8v8a3 3 0 0 0 3 3h13.62a3 3 0 0 0 2.278-1.048l3.428-4a3 3 0 0 0 0-3.904l-3.428-4A3 3 0 0 0 16.62 5H3a3 3 0 0 0-3 3z"></path> <path fill="#538cc6" fill-rule="evenodd" clip-rule="evenodd" d="M15 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 2a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"></path> </g> </g> </svg> <span id="userTagger-header-user-username">user</span> </div> <div class="userTagger-header-controls-container"> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> </svg> <button id="tagDialogIgnoreUser" style="display: none;"></button> </label> </span> <span class="tag-button-container" style="padding-left: 2px;"> <label class="tag-button-label" title="close"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" cursor="pointer" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"> <path d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L12 13.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L10.586 12L7.757 9.172a1 1 0 0 1 1.415-1.415L12 10.586l2.828-2.829a1 1 0 0 1 1.415 1.415L13.414 12z" fill="#538cc6"/> <rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" /> </svg> <button id="tagDialogClose" style="display: none;"></button> </label> </span> </div> </div> </h3> <div data-hover-element="1" class="WESHoverBody WESDialogContents"> <form id="userTaggerToolTip"> <div class="fieldPair"><label class="fieldPair-label" for="userTaggerText">Text</label><input class="fieldPair-text" type="text" id="userTaggerText" value=""></div> <div class="fieldPair"> <label class="fieldPair-label" for="userTaggerColor">Color</label> <select id="userTaggerColor"> <option style="color: inherit; background-color: none" value="none">none</option> <option style="color: black; background-color: aqua" value="aqua">aqua</option> <option style="color: white; background-color: black" value="black">black</option> <option style="color: white; background-color: blue" value="blue">blue</option> <option style="color: white; background-color: cornflowerblue" value="cornflowerblue">cornflowerblue</option> <option style="color: white; background-color: fuchsia" value="fuchsia">fuchsia</option> <option style="color: white; background-color: gray" value="gray">gray</option> <option style="color: white; background-color: green" value="green">green</option> <option style="color: black; background-color: lime" value="lime">lime</option> <option style="color: white; background-color: maroon" value="maroon">maroon</option> <option style="color: white; background-color: navy" value="navy">navy</option> <option style="color: white; background-color: olive" value="olive">olive</option> <option style="color: white; background-color: orange" value="orange">orange</option> <option style="color: white; background-color: orangered" value="orangered">orangered</option> <option style="color: black; background-color: pink" value="pink">pink</option> <option style="color: white; background-color: purple" value="purple">purple</option> <option style="color: white; background-color: red" value="red">red</option> <option style="color: black; background-color: silver" value="silver">silver</option> <option style="color: white; background-color: teal" value="teal">teal</option> <option style="color: black; background-color: white" value="white">white</option> <option style="color: black; background-color: yellow" value="yellow">yellow</option> </select> </div> <div class="fieldPair" style="flex-wrap: wrap"><label class="fieldPair-label" for="userTaggerPreview">Preview</label><span id="userTaggerPreview"><span class="RESUserTag"><a id="userTagPreview" class="userTag" title="set a tag" href="javascript:void 0">&nbsp;</a></span></span></div> <div class="wes-usertagger-footer"><input type="button" id="userTaggerSave" value="✓ save tag" formaction=""></div> </form> </div></div>';

        document.body.appendChild(formMarkup);
        document.body.querySelector(".userTagger-dialog").style.zIndex = 1001;

        console.log(user);
        var headerName = document.getElementById("userTagger-header-user-username");
        headerName.textContent = user;

        console.log(document.getElementById("userTagger-header-user-username"));

        if(tags[user]){

            var formTagTextInput = document.getElementById("userTaggerText");
            formTagTextInput.value = tags[user].text;

            var formTagColorSelect = document.getElementById("userTaggerColor");
            formTagColorSelect.value = tags[user].backgroundColor;

            var preview = document.getElementById("userTagPreview");
            preview.innerText = tags[user].text;
            preview.style.color = tags[user].color;
            preview.style.backgroundColor = tags[user].backgroundColor;
        }

        formjsTable();
    }

    function formjsTable(){
        var userTaggerCloseButton = document.body.querySelector("#tagDialogClose");
        userTaggerCloseButton.addEventListener("click", destroyDialog);

        var userTaggerText = document.body.querySelector("#userTaggerText");
        userTaggerText.addEventListener("input", updateTagPreview);
        var colorSelector = document.body.querySelector("#userTaggerColor");
        colorSelector.addEventListener("input", updateTagPreview);


        /*SAVE*/

        var saveButton = document.body.querySelector("#userTaggerSave");
        saveButton.addEventListener("click", saveTagTable);
    }

    function saveTagTable(){

        var user = document.body.querySelector("#userTagger-header-user-username").innerText.trim();

        var utc = document.body.querySelector("#userTaggerColor");
        var tagData = {
            color : utc.selectedOptions[0].style.color,
            backgroundColor : utc.selectedOptions[0].style.backgroundColor,
            text : document.body.querySelector("#userTagPreview").textContent
        }


        if(!tags[user]){
            console.log("tag doesnt exist");
            var authors = document.body.querySelectorAll(".author");
            for(var author of authors){
                if(!author.innerText.trim().localeCompare(user)){
                    var tbc = author.querySelector(".tag-button-container");
                    author.removeChild(tbc);

                    var tag = createTag();
                    tag.id = "";
                    tag.style.color = tagData.color;
                    tag.style.backgroundColor = tagData.backgroundColor;
                    tag.textContent = tagData.text;
                    author.parentElement.insertBefore(tag, author.nextSibling);
                    tag.addEventListener("click", function(){userTaggerShowForm(this)});
                }
            }
        }



        tags[user] = tagData;
        GM.setValue("tags",JSON.stringify(tags));

        destroyDialog();

        //if user already had a tag, refresh it
        var allTags = document.body.querySelector(".container").querySelectorAll(".userTag");
        for(var tag of allTags){
            if(!tag.previousSibling.innerText.trim().localeCompare(user)){
                tag.style.color = tags[user].color;
                tag.style.backgroundColor = tags[user].backgroundColor;
                tag.innerText = tags[user].text;
            }
        }

        unloadTagsTable();
        loadTagsTable();
    }


    function darkThemeOn(){
        return !document.body.className.localeCompare("theme-dark");
    }

    function pickThemeColor(){
        return (darkThemeOn() ? 'white' : 'black');
    }

    function deleteTagButton(){
        var icon = document.createElement("span");
        icon.innerHTML = '<i class="fas fa-times" style=" font-size:large ;color: white; cursor: pointer" title="Remove Tag"></i>';

        var label = document.createElement("label");
        label.className = "delete-tag-button-label";

        var button = document.createElement("button");
        button.style.display = "none";

        var container = document.createElement("span");
        container.className = "delete-tag-button-container";
        container.style.display = "visible";
        container.style.paddingRight = "5px";

        label.appendChild(icon);
        label.appendChild(button);
        container.appendChild(label);
        return container;
    }

    /************************ 8.2 Misc functions ************************/


    //appends a white space to a list
    function addWhiteSpaceToList(list){
        var space = document.createElement('li');
        space.style.display = "inline";
        space.style.color = "white";
        space.innerHTML = "&nbsp"
        list.appendChild(space);
    }

    //appends a pipe '|' to a list
    function addDividerToList(list){
        var divider = document.createElement('li');
        divider.style.display = "inline";
        divider.style.color = "white";
        divider.innerHTML = "|";
        list.appendChild(divider);
    }


})();
