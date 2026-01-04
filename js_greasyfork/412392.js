// ==UserScript==
// @name         Mangadex Plus
// @namespace    https://greasyfork.org/users/553660
// @icon         https://mangadex.org/images/misc/navbar.svg
// @version      1.2.5
// @description  Adds extra features to Mangadex. These include: Custom Folders for Manga, Start & Continue Reading Button, Mark all Chapters as read/unread Button, Automatic Chapter Preloading & more to come!
// @author       Mr. M
// @match        https://mangadex.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/412392/Mangadex%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/412392/Mangadex%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
        Global values
    */

    const domain = window.location.hostname;
    const url = window.location;
    const nVer = "1.2";
    const current_user = document.getElementsByClassName("navbar-nav")[1].childNodes[3].childNodes[1].getAttribute("href").split("/")[2];
    var api_base_url;
    try{
        if (JSON.parse(GM_getValue("options")).options[0].active_api_url == 0){
            api_base_url = "https://mangadex.org/api/v2/";
        }
        else if (JSON.parse(GM_getValue("options")).options[0].active_api_url == 1){
            api_base_url = "https://api.mangadex.org/v2/"
        }
        else{
            api_base_url = "https://api.mangadex.org/v2/";
        }
    }
    catch(e){
        console.log(e);
        api_base_url = "https://api.mangadex.org/v2/";
    }

    console.log("Mangadex Plus >> Base API URL: " + api_base_url)

    //var api_base_url = "https://mangadex.org/api/v2/";

    /*
        Debug override
    */

    var title_entry_duplication = false; // true = allow dupes

    /*
        Global functions
    */

    // Get the domain from the visiting website
    function url_domain(data) {
        var a = document.createElement('a');
        a.href = data;
        return a.hostname;
    }

    // Add a global CSS style by inputting a String
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Get site subpage name/directory from provided url
    function getSubPage(directoryIndex){
        let url = document.location.href;
        var segment = url.replace(/^https?:\/\//, '').split('/')[directoryIndex];
        return segment;
    }

    // Get current Url
    function currentUrl(){
        return document.location.href;
    }

    /*
        Storage defaults
    */


    let first_time;

    if (GM_getValue("first_time") != "false"){
        first_time = false;
        GM_setValue("first_time", "false");
        //GM_setValue("folders_index", 0);
        let folders = {"folders" : []};
        GM_setValue("folders", JSON.stringify(folders));
        let options = {"options" : [{"preloading" : 0}]};
        GM_setValue("options", JSON.stringify(options));
        alert("Thank you for installing Mangadex Plus! Please go to Settings -> About to learn more about Mangadex Plus!")
    }

    // Version check (last version / newest version)

    if (GM_getValue("version") != nVer && first_time == undefined){
        GM_setValue("version", nVer);
        GM_setValue("update_notif", "true")
        alert("A feature update is here! MD+ has been updated to " + GM_getValue("version") + "! Check Change Log in MD+ Settings for more info!");
    }

    var red_badge;
    if (GM_getValue("update_notif") == "true"){
        GM_setValue("notif_badge", '<span class="badge badge-danger"> ! </span>')
    }
    else{
        GM_setValue("notif_badge", '')
    }


    if (JSON.parse(GM_getValue("options")).options[0].active_api_url == undefined){
        var temp_options = JSON.parse(GM_getValue("options")).options[0];
        temp_options.active_api_url = 1;
        temp_options = {"options": [temp_options]};
        GM_setValue("options", JSON.stringify(temp_options));
    }
    else if (JSON.parse(GM_getValue("options")).options[0].active_api_url == 0){
        alert("To Mangadex Plus user: \n\nMangadex has decided that the Old API URL will be removed in the coming week (as of 2021-03-09). In order for the script to continue working you must update your Base API " +
              "Url in the options of Mangadex Plus. \n\n!!! Please click the \"MD Plus\" button, select Options and switch the \"Base API URL\" option from \"Old\" to \"New\". " +
              "Do not forget to press the Save button for the changes to apply. THIS MESSAGE WILL BE PERSISTENT AND REAPPEAR IF YOU DON'T CHANGE THIS OPTION.");
    }

    /*
        Site functions
    */

    // Startup functions
    function startup(){

        if (getSubPage(1) == "title"){
            main("title");
        }
        else if (getSubPage(1) == "chapter"){
            main("chapter")
        }
        else{
            main("other");
        }

    }

    /*
        HTML Elements
    */

    // Color categorizing CSS classes -> "badge" || "text" + "-" + "success"/"danger"/"primary"/nothing
    //let friends_icon = '<span class="fas fa-user-friends fa-fw text-success" aria-hidden="true"></span>';

    //red_badge = '<span class="badge badge-danger"> ! </span>';
    //let green_badge = '<span class="badge badge-success"> ! </span>';

    //let msg_icon = '<span class="fas fa-envelope fa-fw text-danger" aria-hidden="true"></span>';

    let container = document.getElementsByClassName("navbar")[0];

    let pageMask = '<div class="page-mask"></div>';

    let closeButton = '<span aria-hidden="true" class="fas fa-times fa-fw plus-clsBtn"> To Exit click anywhere or press <i>Esc</i>.</span>';

    /*
        Functions and features
    */

    function main(level){

        let menuButton = '<li id="menuButton" class="nav-item dropdown mx-1 btn btn-secondary">' +
            '<a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"><span class="fas fa-plus-circle fa-fw " aria-hidden="true"></span>' +
            ' MD Plus ' + GM_getValue("notif_badge") +'</a>' +
            '<div class="dropdown-menu">' +
            '<p class="dropdown-item plus-folders"><span class="fas fa-folder fa-fw " aria-hidden="true"></span> Folders</p>' +
            '<p class="dropdown-item plus-options"><span class="fas fa-list fa-fw " aria-hidden="true"></span> Options</p>' +
            '<p class="dropdown-item plus-settings"><span class="fas fa-cog fa-fw " aria-hidden="true"></span> Settings ' + GM_getValue("notif_badge") + '</p>' +
            '</div>' +
            '</li>';

        if (level == "title" || (level == "chapter" || level == "other")){
            function mainButton(){

                container.insertAdjacentHTML("beforeend", menuButton);
                addGlobalStyle("#menuButton { position: fixed; z-index: 99999; top: 10px; right: 15px; list-style-type: none; border-radius: 0.25rem; padding: unset;}");
                addGlobalStyle("p.dropdown-item { margin: 0px; }");

                folders();
                settings();
                options();
            }
            mainButton();
        }

        if (level == "title"){
            function cardButtons(){
            }
            cardButtons();
            actionsBar();
        }

        if (level == "chapter"){
            function readerFeatures(){
                preload();
            }
            readerFeatures();
        }

    }

    function closeMenu(){
        addGlobalStyle(".plus-entries-box { height: unset; overflow-y: unset;}");
        try{
            for(let i = 0; i < document.getElementsByClassName("plus-box").length; i++){
                document.getElementsByClassName("plus-box")[i].remove();
            }
        }
        catch(e){
            console.log(e)
            throw e;
        }
        try{
            for(let j = 0; j < document.getElementsByClassName("page-mask").length; j++){
                document.getElementsByClassName("page-mask")[j].remove();
            }
            for(let k = 0; k < document.getElementsByClassName("plus-clsBtn").length; k++){
                document.getElementsByClassName("plus-clsBtn")[k].remove();
            }
            addGlobalStyle("body { overflow: unset;");
        }
        catch(e){
            console.log(e)
        }
        try{
            document.getElementsByClassName("plus-options-window")[0].remove();
            document.getElementsByClassName("page-mask")[0].remove();
            document.getElementsByClassName("plus-clsBtn")[0].remove();

            addGlobalStyle("body { overflow: unset;");
        }
        catch(e){
            //console.log(e)
        }
    }

    function settings(){

        let notes = "(*) This will restore default values for options.</br>" +
            "(**) This will wipe all Storage data (Folders and entries).</br>" +
            "(***) This will restore default values for options and wipe storage (Folders and entries)."

        let items = '<div x-placement="bottom-start" style="left: 0px !important;' +
            'right: 0px !important;' +
            'width: 800px !important;' +
            'margin-left: auto;' +
            'margin-right: auto;' +
            'margin-top: 100px;' +
            'margin-bottom: auto;" class="dropdown-menu show plus-box">' +
            '<div class="modal-header" style="padding-right: 1rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-top: 0rem;">' +
            '<h5 class="modal-title" id="homepage_settings_label" style="color: rgb(204, 204, 204) !important;">' +
            '<span class="fas fa-cog fa-fw " aria-hidden="true"></span> Mangadex Plus Settings</h5>' +
            '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">×</span></button></div>' +
            '<p class="dropdown-item plus-about" >' +
            '<span class="fas fa-info fa-fw " aria-hidden="true" ></span> About</p>' +
            '<p class="dropdown-item plus-change-log" >' +
            '<span class="fas fa-code fa-fw " aria-hidden="true" ></span> Change Log ' + GM_getValue("notif_badge") + '</p>' +
            '<p class="dropdown-item plus-reset" style="color: #f90 !important;">' +
            '<span class="fas fa-undo fa-fw " aria-hidden="true" style="color: #f90 !important;"></span> Reset Defaults (*)</p>' +
            '<p class="dropdown-item plus-wipe" style="color: #f90 !important;">' +
            '<span class="fas fa-trash fa-fw " aria-hidden="true" style="color: #f90 !important;"></span> Wipe Storage (**)</p>' +
            '<p class="dropdown-item plus-reset-wipe" style="color: #f00 !important;">' +
            '<span class="fas fa-exclamation-triangle fa-fw " aria-hidden="true" style="color: #f00 !important;"></span> Reset & Wipe Mangadex Plus (***)</p>' +
            '<div class="modal-footer"><p style="margin-bottom: 0px;color: rgb(204,204,204);">' + notes + '</p></div>'
        '</div>';

        function openSettingsMenu(){
            container.insertAdjacentHTML("afterbegin", items);
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-reset-wipe")[0].addEventListener("click", function(){resetMDP("rw")});
            document.getElementsByClassName("plus-reset")[0].addEventListener("click", function(){resetMDP("r")});
            document.getElementsByClassName("plus-wipe")[0].addEventListener("click", function(){resetMDP("w")});
            document.getElementsByClassName("plus-change-log")[0].addEventListener("click", changeLog);
            document.getElementsByClassName("plus-about")[0].addEventListener("click", about);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            addGlobalStyle("body { overflow: hidden;");
        }

        function about(){

            let text = "Welcome to Mangadex Plus!<br><br>" +
                "<b>\"What is Mangadex Plus?\"</b><br>Mangadex Plus is a Userscript that adds some useful features to Mangadex.<br><br>" +
                "<b>\"What are these Useful features you speak of?\"</b><br>These currently include:</p>" +
                "<ul><li>Custom folders</li><li>Marking all chapters of a Manga as read/unread</li><li>Start reading button</li>" +
                "<li>Automatic Chapter Preloading</li></ul>" +
                "<p>For more info on the features head to the <b>Change Log</b>. As of now these are all but more features will be added through time.<br><br>" +
                "<b>\"I really want a feature to be added to this script! Do you take suggestions?\"</b><br>I do so Welcomely. Please go to the GreasyFork page of this Userscript and add a suggestion there.<br><br>" +
                "<b>\"Hey! I found a bug! Where can I report It?\"</b><br> Please report bugs on the <a href='https://greasyfork.org/en/scripts/412392-mangadex-plus'>GreasyFork page of this Userscript</a>" +
                " and I'll do my best to fix them ASAP.<br><br>" +
                '</p><p style="color: gray"> To remove the red badge (<span class="badge badge-danger"> ! </span>) please reload the page.';

            let element = '<div x-placement="bottom-start" style="left: 0px !important;' +
                'right: 0px !important;' +
                'width: 800px !important;' +
                'margin-left: auto;' +
                'margin-right: auto;' +
                'margin-top: 100px;' +
                'margin-bottom: auto;" class="dropdown-menu show plus-box">' +
                '<div class="modal-header" style="padding-right: 1rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-top: 0rem;">' +
                '<h5 class="modal-title" id="homepage_settings_label" style="color: rgb(204, 204, 204) !important;">' +
                '<span class="fas fa-info fa-fw " aria-hidden="true"></span> About</h5>' +
                '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span></button></div>' +
                '<div class="" style="overflow-y: scroll; overflow-x: break-word; max-height: 400px; word-wrap: break-word; color: rgb(204,204,204); padding: 1rem; white-space: normal;">' +
                '<div style="color: darkgray;"><p>' + text + '</p></div></div>' +
                '<div class="modal-footer">' +
                '<a class="btn btn-secondary mx-auto plus-back-settings" style="display: block;width: max-content; color: rgb(204,204,204)">' +
                '<span class="fas fa-arrow-left fa-fw " aria-hidden="true"></span> Back to Settings</div>' +
                '</div>';

            closeMenu();

            container.insertAdjacentHTML("afterbegin", element);
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("plus-back-settings")[0].addEventListener("click", function(){closeMenu(); settings(); openSettingsMenu();});
            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            addGlobalStyle("body { overflow: hidden;");
        }

        function changeLog(){

            GM_setValue("update_notif", "false");
            //GM_setValue("notif_badge", "")

            let text = "Version 1.2.4 (17-Feb-2020)<br><br>" +
                "A new option for setting the active API base URL has been added. If you don't understand what an API is you can ignore this message." +
                "\nFor those that are still interested here is the rundown why this was added.\n\n" +
                "Mangadex has now (actually a little while ago) established a new server that handles just API requests and therefore set a new URL for accessing It. The problem is the new API server has some bugs...\n"+
                "The bug that I'm concerned with is just visual and may make you think the script is not working. When you press the button to set all chapters as read you expect all the icons to change to read. " +
                "Well, the new API has some \"caching\" issues and doesn't apply the change visually. The chapters will be set as read/unread but the icons won't display that change until you interact with them and refresh." +
                "This issue has now been present for quite a while so I decided to wait out the patch. It appears the patch will take some time and I don't know when the old API URL will get shut down so just in case " +
                "I added a feature that allows you to change the API's base URL when I can't publish an update.\n\n" +
                "By default, the option will be set to the \"Old\" URL, but if you experience issues with the script it may be related to this so in that case, I advise you to change the option to the \"New\" URL." +
                "<b><br><br>TL;DR:</b> Mangadex has a new API URL, the Older one is better (less bugs) but may stop working in the future. If something breaks in the script changing the option of the API URL to the " +
                "New URL may fix the issue." +

                "<br><br><p style='color: gray'> To remove the red badge (<span class='badge badge-danger'> ! </span>) please reload the page.</p>" +

                "<hr>Version 1.2 (10-Dec-2020)<br><br>" +
                "Bug fixes and improvements.<br><br><ul><li>Bug Fix: Folders with many entries now have a scroll wheel. Before the entries would overflow out of the screen</li>" +
                "<li>Bug Fix/Improvement: Before Mark As Read/Unread would apply only to one page of chapters (The page that is being visited). This wasn't really a bug " +
                "as It was an oversight by me while making the script not including this feature.</li></ul> Feature (per request).<br><br><ul><li><b>Continue reading: </b>" +
                "Start reading button now has a secondary feature (accessed by the new dropdown) that allows the user to continue where he left off. Important to note: " +
                "The script determines the chapter qualification based on the read/unread markers seen on the chapter list. Meaning you have to be logged in and follow the manga.</li></ul>" +
                "Regarding the Continue Reading button: In the future, I hope to add various types of chapter qualification determination. (Specifically: The reading progress indicator present on the title's page). " +
                "While I have new features in the works I can't always work on them (either busy or lazy) nor can I release them because of their instability. " +
                "But smaller feature requests like the one today can be prioritized and posted quicker. So If you also have any feel free to request them!" +

                "<hr>Version 1.1 (3-Nov-2020)<br><br>" +
                "Bug fixes and improvements.<br><br><ul><li>The Folders window/box now has the same width as all other windows.</li>" +
                "<li>Scrolling through the site while any MD+ windows are open is now disabled.</li>" +
                "<li>Bug fix: Now saving titles to folders only up to the ID of the link making it independent from title changes and immune to entry duplicating.</li>" +
                "<li>Changed the Userscript's description and added links to the <a href='https://greasyfork.org/en/scripts/412392-mangadex-plus'>Userscript's GreasyFork page</a> " +
                "in the About and Change Log sections.</li></ul>" +
                "I found out that mangadex is soon updating their API to v2 which will hopefully allow me to add some interesting features to the script. " +
                "I won't release these features (or even start coding) them for now because they are likely to break/stop working after the API is updated." +

                "<hr>Mangadex Plus version 1.0 is here! (3-Oct-2020)<br><br>" +
                "The very first version brings these features to the table:</p>" +
                "<ul><li><b>Custom folders:</b> You can make folders and add your chosen titles to It.</li><li><b>Mark all chapters of a Manga as read/unread:</b> " +
                "Saves you the trouble of having to mark all chapters individually.</li><li><b>Start reading button:</b> Goes to the first chapter of a Manga without having to scroll or switch pages.</li>" +
                "<li><b>Automatic Chapter Preloading:</b> Whenever you are in the reader (and are logged into your MD Account) the chapter will automatically start preloading. " +
                "You can turn this feature on/off in th Options Menu.</li></ul><p>" +
                "I am planning on improving the current features and adding new ones. If you have a suggestion/bug report please let me know on the " +
                "<a href='https://greasyfork.org/en/scripts/412392-mangadex-plus'>Userscript's GreasyFork page</a> forum.";

            let element = '<div x-placement="bottom-start" style="left: 0px !important;' +
                'right: 0px !important;' +
                'width: 800px !important;' +
                'margin-left: auto;' +
                'margin-right: auto;' +
                'margin-top: 100px;' +
                'margin-bottom: auto;" class="dropdown-menu show plus-box">' +
                '<div class="modal-header" style="padding-right: 1rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-top: 0rem;">' +
                '<h5 class="modal-title" id="homepage_settings_label" style="color: rgb(204, 204, 204) !important;">' +
                '<span class="fas fa-code fa-fw " aria-hidden="true"></span> Change Log</h5>' +
                '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span></button></div>' +
                '<div class="" style="overflow-y: scroll; max-height: 400px; word-wrap: break-word; color: rgb(204,204,204); padding: 1rem; white-space: normal;">' +
                '<div style="color: darkgray;">' + text + '</div></div>' +
                '<div class="modal-footer">' +
                '<a class="btn btn-secondary mx-auto plus-back-settings" style="display: block;width: max-content; color: rgb(204,204,204)">' +
                '<span class="fas fa-arrow-left fa-fw " aria-hidden="true"></span> Back to Settings</div>' +
                '</div>';

            closeMenu();

            container.insertAdjacentHTML("afterbegin", element);
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("plus-back-settings")[0].addEventListener("click", function(){closeMenu(); openSettingsMenu();});
            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            addGlobalStyle("body { overflow: hidden;");
        }

        function resetMDP(level){

            function prompt(level){

                let text_rw = "WARNING: By confirming this you will DELETE ALL Your Mangadex Plus saved data! This includes options and folders! \nAre you sure you want to proceed?";
                let text_r = "WARNING: By confirming this you will RESET ALL Your Mangadex Plus options to Default values! \nAre you sure you want to proceed?";
                let text_w = "WARNING: By confirming this you will WIPE ALL Your Mangadex Plus folders and It's Entries! \nAre you sure you want to proceed?";

                if (level == "rw"){
                    if (confirm(text_rw)) {
                        resets("rw");
                    }
                }
                else if (level == "r"){
                    if (confirm(text_r)) {
                        resets("r");
                    }
                }
                else if (level == "w"){
                    if (confirm(text_w)) {
                        resets("w");
                    }
                }

            }
            prompt(level);
        }

        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '27' || e.keyCode == '27') {
                closeMenu();
            }
        }
        document.onkeydown = checkKey;

        document.getElementsByClassName("plus-settings")[0].addEventListener("click", openSettingsMenu);

    }

    function folders(){

        function getFolders(){

            let folders = (JSON.parse(GM_getValue("folders"))).folders;

            let backFolder = '<p class="dropdown-item plus-disabled"><span class="fas fa-arrow-left fa-fw " aria-hidden="true"></span style="color: #333"> <i>..</i></p>'
            let createFolder = '<p class="dropdown-item plus-createFolder"><span class="fas fa-plus-circle fa-fw " aria-hidden="true"></span style="color: #333"> <i>Create New Folder</i></p>'
            let otherFolders = "";

            let edit_btn = '<p class="dropdown-item plus-edit-folder" title="Edit Folder Name" style="width: max-content;padding-left: 5px;padding-right: 5px; display: inline-table;">' +
                '<span aria-hidden="true" class="fas fa-pen fa-fw folder_0"></span></p>';
            let delete_btn = '<p class="dropdown-item plus-delete-folder" title="Delete Folder" style="width: max-content;padding-left: 5px;padding-right: 16px;">' +
                '<span aria-hidden="true" class="fas fa-trash fa-fw folder_0"></span></p>';

            for (let i = 0; i < folders.length; i++){
                otherFolders = otherFolders + '<div style="display: flex"><p class="dropdown-item"><span class="fas fa-folder-open fa-fw folder_' + (i) + '" aria-hidden="true">' +
                    '</span style="color: #333"> ' + folders[i].name + '</p>' + edit_btn + delete_btn + '</div>';
            }

            return backFolder + otherFolders + createFolder;
        }

        function folderItems(index){

            let backFolder = '<p class="dropdown-item plus-back"><span class="fas fa-arrow-left fa-fw " aria-hidden="true"></span style="color: #333"> <i>..</i></p>'

            let folders = (JSON.parse(GM_getValue("folders"))).folders;
            let folder_name = (JSON.parse(GM_getValue("folders"))).folders[index].name;

            let delete_btn = '<p class="dropdown-item plus-delete-entry" title="Delete Entry" style="width: max-content;padding-left: 5px;padding-right: 16px;">' +
                '<span aria-hidden="true" class="fas fa-trash fa-fw folder_0"></span></p>';

            let html = "";

            for (let i = 0; i < (folders[index].entries).length; i++){
                html = html + '<div style="display: flex"><a style="display: contents" href="' + folders[index].entries[i].link + '"><p class="dropdown-item plus-entry" title="' + folders[index].entries[i].title + '">' +
                    '<span class="fas fa-book fa-fw " aria-hidden="true"></span style="color: #333"> ' + folders[index].entries[i].title + '</p></a>' + delete_btn + '</div>';
            }

            html = backFolder + html;

            return '<div x-placement="bottom-start" style="left: 0px !important;' +
                'right: 0px !important;' +
                'width: 800px !important;' +
                'margin-left: auto;' +
                'margin-right: auto;' +
                'margin-top: 100px;' +
                'margin-bottom: auto;" class="dropdown-menu show plus-box">' +
                '<div class="modal-header" style="padding-right: 1rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-top: 0rem;">' +
                '<h5 class="modal-title" id="homepage_settings_label" style="color: rgb(204, 204, 204) !important;">' +
                '<span class="fas fa-folder-open fa-fw " aria-hidden="true"></span> ' + folder_name + '</h5>' +
                '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span></button></div><div class="plus-entries-box">' +
                html + '</div></div>';
        }

        function createFolder(){

            if (editing_busy == false){

                editing_busy = true;

                function writeFolder(){

                    let value = "" + document.getElementsByClassName("folderInput")[0].value;
                    let folders = JSON.parse(GM_getValue("folders"));

                    folders.folders[folders.folders.length] = {"name" : value + "", "entries" : []};
                    GM_setValue("folders", JSON.stringify(folders));
                    editing_busy = false;
                }

                let option = document.getElementsByClassName("dropdown-item plus-createFolder")[0];
                option.innerHTML = '<input class="folderInput" type="text" placeholder="When finished writing press Enter"></input>';
                document.getElementsByClassName("plus-createFolder")[0].removeEventListener("click", createFolder);

                function checkKey(e) {
                    e = e || window.event;
                    if (e.keyCode == '13') {
                        writeFolder();
                        closeMenu();
                        openFoldersMenu();
                        document.onkeydown = null
                    }
                }
                document.onkeydown = checkKey;

                document.getElementsByClassName("folderInput")[0].addEventListener("onsubmit", writeFolder);
                document.getElementsByClassName("folderInput")[0].select();

            }
        }

        function refreshFolders(){
            return '<div x-placement="bottom-start" style="left: 0px !important;' +
                'right: 0px !important;' +
                'width: 800px !important;' +
                'margin-left: auto;' +
                'margin-right: auto;' +
                'margin-top: 100px;' +
                'margin-bottom: auto;" class="dropdown-menu show plus-box" id="plus-entries">' +
                '<div class="modal-header" style="padding-right: 1rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-top: 0rem;">' +
                '<h5 class="modal-title" id="homepage_settings_label" style="color: rgb(204, 204, 204) !important;">' +
                '<span class="fas fa-folder fa-fw " aria-hidden="true"></span> Folders</h5>' +
                '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span></button></div>' +
                getFolders() +
                '</div>';
        }

        function openFoldersMenu(){
            container.insertAdjacentHTML("afterbegin", refreshFolders());
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");
            addGlobalStyle(".plus-disabled{ color: #555}");
            addGlobalStyle(".plus-disabled:hover{ background-color: unset; color: #555}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-createFolder")[0].addEventListener("click", createFolder);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            let folders = (JSON.parse(GM_getValue("folders"))).folders;

            for (let i = 0; i < folders.length; i++){
                document.getElementsByClassName("folder_" + i)[0].parentNode.addEventListener("click", function(){browseFolder(i)});
                document.getElementsByClassName("plus-delete-folder")[i].addEventListener("click", function(){deleteFolder(i)});
                document.getElementsByClassName("plus-edit-folder")[i].addEventListener("click", function(){editFolder(i)});
            }

            addGlobalStyle("body { overflow: hidden;");

        }

        function browseFolder(index){
            closeMenu();
            container.insertAdjacentHTML("afterbegin", folderItems(index));
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("plus-back")[0].addEventListener("click", function(){closeMenu();openFoldersMenu();})
            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            let folders = (JSON.parse(GM_getValue("folders"))).folders[index].entries;

            for (let i = 0; i < folders.length; i++){
                document.getElementsByClassName("plus-delete-entry")[i].addEventListener("click", function(){deleteEntry(index, i)});
            }
            if (folders.length > 14){
                addGlobalStyle(".plus-entries-box { height: 500px; overflow-y: scroll;}");
            }

            addGlobalStyle("body { overflow: hidden;");

        }

        function deleteFolder(index){

            let folder = JSON.parse(GM_getValue("folders"));

            function prompt(){
                if(confirm("Folder " + folder.folders[index].name + " will be deleted. Proceed?")){
                    folder.folders.splice(index, 1);
                    GM_setValue("folders", JSON.stringify(folder));
                    closeMenu();
                    openFoldersMenu();
                }
            }
            prompt();
        }

        function deleteEntry(folder, entry){

            let folders = JSON.parse(GM_getValue("folders"));

            function prompt(){
                if(confirm("\"" + folders.folders[folder].entries[entry].title + "\" will be removed from this Folder. Proceed?")){
                    folders.folders[folder].entries.splice(entry, 1);
                    GM_setValue("folders", JSON.stringify(folders));
                    closeMenu();
                    browseFolder(folder);
                }
            }
            prompt();
        }

        let editing_busy = false; // For folder name editing

        function editFolder(index){

            if (editing_busy == false){

                editing_busy = true;

                function writeFolder(){

                    let value = "" + document.getElementsByClassName("folderInput")[0].value;
                    let folders = JSON.parse(GM_getValue("folders"));

                    folders.folders[index].name = value;
                    GM_setValue("folders", JSON.stringify(folders));
                    editing_busy = false;
                }

                let folder = JSON.parse(GM_getValue("folders"));

                let option = document.getElementsByClassName("folder_" + index)[0].parentNode;
                option.innerHTML = '<input class="folderInput" type="text" placeholder="When finished writing press Enter"></input>';
                document.getElementsByClassName("folderInput")[0].value = "" + folder.folders[index].name

                var el = document.getElementsByClassName('folderInput')[0].parentNode,
                    elClone = el.cloneNode(true);
                el.parentNode.replaceChild(elClone, el);

                function checkKey(e) {
                    e = e || window.event;
                    if (e.keyCode == '13') {
                        writeFolder();
                        closeMenu();
                        openFoldersMenu();
                        document.onkeydown = null
                    }
                }
                document.onkeydown = checkKey;

                document.getElementsByClassName("folderInput")[0].addEventListener("onsubmit", writeFolder);
                document.getElementsByClassName("folderInput")[0].select();
            }


        }

        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '27' || e.keyCode == '27') {
                closeMenu();
            }
        }
        document.onkeydown = checkKey;

        document.getElementsByClassName("plus-folders")[0].addEventListener("click", openFoldersMenu);
        addGlobalStyle("p.dropdown-item { overflow: hidden;}");
        addGlobalStyle(".plus-delete-folder:hover { color: #f00;}");
        addGlobalStyle(".plus-delete-entry:hover { color: #f00;}");



    }

    function options(){

        var temp_storage = {
            "preloading" : JSON.parse(GM_getValue("options")).options[0].preloading,
            "active_api_url" : JSON.parse(GM_getValue("options")).options[0].active_api_url
        };

        var style = window.getComputedStyle(document.getElementById('homepage_settings_modal'));

        addGlobalStyle(".plus-options-window {position: fixed; left: 0px !important; right: 0px !important; width: 800px !important; margin-left: auto; margin-right: auto; margin-top: 100px; margin-bottom: auto; top: 100px;}");
        addGlobalStyle(".modal-footer{display: block;}");

        let preloading = '<div class="form-group row">' +
            '<label for="language" class="col-lg-3 col-form-label-modal">Auto preloading (*):</label>' +

            '<div class="col-lg-9">' +
            '<div class="dropdown bootstrap-select form-control">' +
            '<select class="form-control selectpicker">' +
            '<option selected="" value="1">On</option>' +
            '<option value="0">Off</option>' +
            '</select>' +
            '<button type="button" class="btn dropdown-toggle btn-light" data-toggle="dropdown" role="button" data-id="theme_id" title="N">' +
            '<div class="filter-option">' +
            '<div class="filter-option-inner">' +

            '<div class="filter-option-inner-inner plus-preloading-selected"> NaN </div>' +
            '</div>' +
            '</div>' +
            '</button>' +
            '<div class="dropdown-menu" role="combobox">' +
            '<div class="inner show" role="listbox" aria-expanded="false" tabindex="-1">' +
            '<ul class="dropdown-menu inner show plus-preloading-options">' +
            '<li><a role="option" class="dropdown-item" aria-disabled="false" aria-selected="false" tabindex="0"><span class=" bs-ok-default check-mark"></span><span class="text">On</span></a></li>' +
            '<li><a role="option" class="dropdown-item" aria-disabled="false" aria-selected="false" tabindex="0"><span class=" bs-ok-default check-mark"></span><span class="text">Off</span></a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        let base_api = '<div class="form-group row">' +
            '<label for="language" class="col-lg-3 col-form-label-modal">Base API URL (**):</label>' +

            '<div class="col-lg-9">' +
            '<div class="dropdown bootstrap-select form-control">' +
            '<select class="form-control selectpicker">' +
            '<option selected="" value="1">Old</option>' +
            '<option value="0">New</option>' +
            '</select>' +
            '<button type="button" class="btn dropdown-toggle btn-light" data-toggle="dropdown" role="button" data-id="theme_id" title="N">' +
            '<div class="filter-option">' +
            '<div class="filter-option-inner">' +

            '<div class="filter-option-inner-inner plus-base_api-selected"> NaN </div>' +
            '</div>' +
            '</div>' +
            '</button>' +
            '<div class="dropdown-menu" role="combobox">' +
            '<div class="inner show" role="listbox" aria-expanded="false" tabindex="-1">' +
            '<ul class="dropdown-menu inner show plus-base_api-options">' +
            '<li><a role="option" class="dropdown-item" aria-disabled="false" aria-selected="false" tabindex="0"><span class=" bs-ok-default check-mark"></span><span class="text">Old</span></a></li>' +
            '<li><a role="option" class="dropdown-item" aria-disabled="false" aria-selected="false" tabindex="0"><span class=" bs-ok-default check-mark"></span><span class="text">New</span></a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        let notes = '<p style="margin-top: 16px;">(*) Automatically starts preloading chapter when in the reader. Only works for logged-in users.<br>' +
            '(**) Default is set to Old. If you experience any issues with buttons not working try setting this to New.</p>';

        let options = //'<div id="plus-options-win" class="modal-dialog modal-dialog-centered modal-lg plus-options-window" role="document">' +
            '<div class="modal-content plus-options-window" style="z-index: 100000">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title" id="homepage_settings_label">' +
            '<span class="fas fa-list fa-fw " aria-hidden="true"></span> Mangadex Plus Options' +
            '</h5>' +
            '<button type="button" class="close plus-close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">×</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form method="post" id="homepage_settings_form">' +
            preloading +
            base_api +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<a class="btn btn-secondary mx-auto plus-options-save" style="display: block;width: max-content;">' +
            '<span class="fas fa-save fa-fw " aria-hidden="true"></span> Save' +
            '</a>' +
            notes +
            '</div>' +
            '</div>';
        //'</div>';

        function listeners(){
            //Listeners for options buttons
            for(let i = 0; i < document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a").length; i++){
                document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[i].addEventListener("click", function(){selectOption("preloading", i)});
            }
            for(let i = 0; i < document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a").length; i++){
                document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[i].addEventListener("click", function(){selectOption("active_api_url", i)});
            }
            document.getElementsByClassName("plus-options-save")[0].addEventListener("click", saveOptions);
        }

        function openOptionsMenu(){
            container.insertAdjacentHTML("afterbegin", options);
            addGlobalStyle("div.plus-box { position: fixed !important; right: 700px !important; left: 700px !important; top: 100px !important; z-index: 100001;}");

            container.insertAdjacentHTML("afterbegin", pageMask);
            addGlobalStyle(".page-mask { background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100000;}");

            container.insertAdjacentHTML("afterbegin", closeButton);
            addGlobalStyle(".plus-clsBtn { right: 150px !important; position: fixed !important; z-index: 100000; width: auto; color: white; background-color: #444;}");

            document.getElementsByClassName("page-mask")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-clsBtn")[0].addEventListener("click", closeMenu);
            document.getElementsByClassName("plus-close")[0].addEventListener("click", closeMenu);

            addGlobalStyle("body { overflow: hidden;");

            loadOptions();
            listeners();
        }

        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '27' || e.keyCode == '27') {
                closeMenu();
            }
        }

        let sample_options = {
            "options" : [
                {
                    "preloading" : 0,
                    "base_api" : 0
                }
            ]
        }

        function saveOptions(){

            GM_setValue("options", "{\"options\":[" + JSON.stringify(temp_storage) + "]}")
            location.reload()
        }

        function loadOptions(){
            var options = JSON.parse(GM_getValue("options"));

            let preloading = options.options[0].preloading;
            let base_api = options.options[0].active_api_url;

            selectOption("preloading", preloading);
            selectOption("active_api_url", base_api);
        }

        function selectOption(option, index){
            if(option == "preloading"){
                let val;
                for(let i = 0; i < document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a").length; i++){
                    try{
                        document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[i].classList.remove('selected');
                        document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[i].classList.remove('active');

                        val = document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[index].childNodes[1].innerHTML;
                    }
                    catch(e){/*Nothing*/}
                }

                document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[index].classList.add("active");
                document.getElementsByClassName("plus-preloading-options")[0].getElementsByTagName("a")[index].classList.add("selected");
                document.getElementsByClassName("plus-preloading-selected")[0].innerHTML = val;
                temp_storage.preloading = index;
            }
            if(option == "active_api_url"){
                let val;
                for(let i = 0; i < document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a").length; i++){
                    try{
                        document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[i].classList.remove('selected');
                        document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[i].classList.remove('active');

                        val = document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[index].childNodes[1].innerHTML;
                    }
                    catch(e){/*Nothing*/}
                }

                document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[index].classList.add("active");
                document.getElementsByClassName("plus-base_api-options")[0].getElementsByTagName("a")[index].classList.add("selected");
                document.getElementsByClassName("plus-base_api-selected")[0].innerHTML = val;
                temp_storage.active_api_url = index;
            }
        }

        document.onkeydown = checkKey;

        document.getElementsByClassName("plus-options")[0].addEventListener("click", openOptionsMenu);


    }

    function actionsBar(){

        function makeBar(){

            let bar = '<div class="row m-0 py-1 px-0 border-top">' +
                '<div class="col-lg-3 col-xl-2 strong">Mangadex+ Actions:</div>' +
                '<div class="col-lg-9 col-xl-10 plus-actionbar">' +
                '</div>' +
                '</div>';

            var position = document.getElementsByClassName("col-xl-9 col-lg-8 col-md-7")[0];

            position.insertAdjacentHTML("beforeend", bar);
        }

        function addToFolder(){

            function addEntry(index){

                let folders = JSON.parse(GM_getValue("folders"));

                let link = "https://" + domain + "/title/" + getSubPage(2).replace("#", "");

                let pass = true;

                for(let i = 0; i < folders.folders[index].entries.length; i++){
                    try{
                        if(link == folders.folders[index].entries[i].link){
                            pass = false;
                        }
                    }
                    catch(e){
                        alert(3)
                        if (e == TypeError){
                            pass = true;
                        }
                    }
                }
                if (pass || title_entry_duplication){
                    folders.folders[index].entries[folders.folders[index].entries.length] = {"title": "" + document.getElementsByClassName("card-header")[0].childNodes[3].innerHTML, "link" : "" + link};
                    GM_setValue("folders","" + JSON.stringify(folders));
                }

            }

            function listFolders(){

                let folders = JSON.parse(GM_getValue("folders"));
                let html = "";

                for (let i = 0; i < folders.folders.length; i++){
                    html = html + '<p class="dropdown-item plus-add-folder-' + i + '" ><span class="fas fa-folder-open fa-fw " aria-hidden="true" ></span> ' + folders.folders[i].name + '</p>';
                }

                return html;

            }

            let bar = '<div class="btn-group">' +
                '<button type="button" class="btn btn-secondary dropdown-toggle plus-folder-trigger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span class="fas fa-plus-circle fa-fw " aria-hidden="true"></span>' +
                '<span class="d-none d-xl-inline"> Add to Folder</span></button>' +
                '<div class="dropdown-menu dropdown-menu-right plus-actions-folders">' +
                listFolders() +
                '</div>' +
                '</div>&nbsp';

            let position2 = document.getElementsByClassName("plus-actionbar")[0];

            position2.insertAdjacentHTML("beforeend", bar);

            let folders = JSON.parse(GM_getValue("folders"));

            for (let i = 0; i < folders.folders.length; i++){
                document.getElementsByClassName("plus-add-folder-" + i)[0].addEventListener("click", function(){addEntry(i)});
            }

            function reloadFolders(){

                let index = document.getElementsByClassName("plus-actions-folders")[0].childNodes.length

                for(let i = 0; i < index; i++){
                    document.getElementsByClassName("plus-add-folder-" + i)[0].remove();
                }

                let position3 = document.getElementsByClassName("plus-actions-folders")[0];
                position3.insertAdjacentHTML("afterbegin", listFolders());
                let folders = JSON.parse(GM_getValue("folders"));

                for (let i = 0; i < folders.folders.length; i++){
                    document.getElementsByClassName("plus-add-folder-" + i)[0].addEventListener("click", function(){addEntry(i)});
                }

            }

            document.getElementsByClassName("plus-folder-trigger")[0].addEventListener("click", reloadFolders);
        }

        function markAs(){

            function mark(para){

                document.getElementsByClassName("plus-read-pos")[0].classList.remove("fa-eye");
                document.getElementsByClassName("plus-read-pos")[0].classList.add("fa-spinner");
                document.getElementsByClassName("plus-read-pos")[0].classList.add("fa-pulse");

                let api = api_base_url + "user/" + current_user + "/marker"; // API link for posting request to change read status
                //let api = api_base_url + "user/me/marker";
                let manga = getSubPage(2).replace("#", ""); // Current manga id
                let api2 = api_base_url + "manga/" + manga + "/chapters"; // API link for chapter ID's of this manga

                async function getChapters(){ // Gets all english chapters
                    var chapters_ = [];
                    let response = await fetch(api2);
                    var data = await response.json();
                    var length = data.data.chapters.length;

                    for (let i = 0; i < length; i++){
                        if (await data.data.chapters[length-i-1].language == "gb"){
                            await chapters_.push(data.data.chapters[length-i-1].id);
                        }
                    }
                    return chapters_;
                }
                let param;

                getChapters().then(x => {
                    var chapters_ = x;

                    async function post(chapters_, check){ // Posting the request to the API (check -> if it's the last request and passes page reload if it is)
                        // post body data
                        console.log(para, chapters_)
                        param = {
                            read : para,
                            chapters : chapters_
                        };


                        // request options
                        options = {
                            method: 'POST',
                            body: JSON.stringify(param),
                            headers: {
                                'Content-Type': 'application/json' //Mangadex requires this
                            },
                            credentials: "include"
                        }

                        // send POST request
                        fetch(api, options)
                            .then(res => res.json())
                            .then(res => console.log(res))
                            .then(function(){if(check == true){
                            document.location.reload() //Reloads page so the changes can be seen
                        }
                                            }
                                 );
                    }

                    async function countHandler(chapters_){ // Mangadex API limits 100 changes per request. This handles making enough requests of which the maximum is 100
                        let len = (parseInt(chapters_.length/100)+1)
                        if (chapters_.length > 100){
                            for(let i = 0; i < len; i++){
                                if(i == len-1){
                                    await post(chapters_, true)
                                }
                                else{
                                    await post(chapters_, false);
                                    chapters_.splice(0, 100);
                                }
                            }
                        }
                        else{
                            await post(chapters_, true)
                        }
                    }
                    countHandler(chapters_);

                })
            }

            let mark_button = '<div class="btn-group">' +
                '<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span class="fas fa-eye fa-fw plus-read-pos" aria-hidden="true"></span>' +
                '<span class="d-none d-xl-inline"> Mark All As </span></button>' +
                '<div class="dropdown-menu dropdown-menu-right">' +

                '<p class="dropdown-item plus-mark-read">' +
                '<span class="fas fa-eye fa-fw " aria-hidden="true" ></span> Read</p>' +

                '<p class="dropdown-item plus-mark-unread">' +
                '<span class="fas fa-eye-slash fa-fw " aria-hidden="true" ></span> Unread</p>' +

                '</div>' +
                '</div>&nbsp';

            let position2 = document.getElementsByClassName("plus-actionbar")[0];
            position2.insertAdjacentHTML("beforeend", mark_button);

            document.getElementsByClassName("plus-mark-read")[0].addEventListener("click", function(){mark(true)});
            document.getElementsByClassName("plus-mark-unread")[0].addEventListener("click", function(){mark(false)});
        }

        function startReading(){

            let manga_id = getSubPage(2).replace("#", "");
            let chapter_id = "";
            let api_url = api_base_url + "manga/" + manga_id + "/chapters";

            async function getapi(url) {

                let response = await fetch(url);

                var data = await response.json();
                var data2 = "";
                var length = data.data.chapters.length;
                for(let i = 0; i < length; i++){
                    if (await data.data.chapters[length-i-1].language == "gb"){
                        data2 = await data.data.chapters[length-i-1].id;
                        break;
                    }
                }

                return data2

            }

            getapi(api_url).then(x => {

                chapter_id = x;
                let link = "https://mangadex.org/chapter/" + chapter_id;

                let link2 = "";
                try{
                    let container = document.getElementsByClassName("chapter-container ")[0];
                    for(let i = 1; i < container.children.length; i++){
                        if(!container.children[i].children[0].children[0].children[0].children[0].classList.contains("grey")){
                            link2 = container.children[i-1].children[0].children[0].children[1].children[0].attributes.href.value;
                        }
                    }
                }
                catch(e){
                    link2 = "#";
                }
                let mark_button = '<div class="btn-group">' +
                    '<button class="btn btn-secondary" onclick="javascript:document.location.href = \'' + link + '\'">' +
                    '<span class="fas fa-book fa-fw"></span><span class="d-none d-xl-inline">&nbsp;Start Reading</span></button>' +
                    '<button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                    '<span class="sr-only">Toggle Dropdown</span></button>' +
                    '<div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-24px, 35px, 0px);">' +
                    '<a class=" dropdown-item" id="1" href="' + link2 + '"><span class="fas fa-book-reader fa-fw " aria-hidden="true" title="Continue Reading">' +
                    '</span> Continue Reading</a></div></div>';

                var position2 = document.getElementsByClassName("plus-actionbar")[0];
                position2.insertAdjacentHTML("beforeend", mark_button);

            });

        }

        makeBar();
        addToFolder();
        markAs();
        startReading();

    }

    function preload(){
        async function doPreload(){
            let index = 100;
            for (let i = 0; i < index; i++){
                if (document.getElementById("preload-all").getAttribute("disabled") == ""){
                    await new Promise(r => setTimeout(r, 100));
                }
                else{
                    document.getElementById("preload-all").click();
                    i = index;
                }
            }
        }

        let enabled = (JSON.parse(GM_getValue("options"))).options[0].preloading

        if (enabled == 0){
            doPreload();
        }

        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '37' || e.keyCode == '39') {
                doPreload();
            }
        }
        document.onkeydown = checkKey;
        document.getElementsByClassName("reader-images col-auto row no-gutters flex-nowrap m-auto text-center cursor-pointer directional constrained")[0].onclick = function(){doPreload()};

    }

    function resets(level){
        if(level == "r"){
            let options = {"options" : [{"preloading" : 0}]};
            GM_setValue("options", JSON.stringify(options));
            location.reload();
        }
        else if(level == "w"){
            let folders = {"folders" : []};
            GM_setValue("folders", JSON.stringify(folders));
            location.reload();
        }
        else if(level == "rw"){
            let options = {"options" : [{"preloading" : 0}]};
            GM_setValue("options", JSON.stringify(options));
            let folders = {"folders" : []};
            GM_setValue("folders", JSON.stringify(folders));
            GM_deleteValue("first_time");
            location.reload();
        }
    }

    startup();

})();