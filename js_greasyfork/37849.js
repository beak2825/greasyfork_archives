// ==UserScript==
// @name          TagPro ModFather
// @description   Shows available mods on the TagPro website, Notifies when new Mods are released, And more...
// @author        Ko
// @version       0.5.2.alpha
// @match         http://*.koalabeast.com/*
// @match         greasyfork.org/modfather
// @match         watball.github.io/chat-macros/
// @supportURL    https://www.reddit.com/message/compose/?to=Wilcooo
// @website       https://redd.it/no-post-yet
// @icon          https://raw.githubusercontent.com/wilcooo/TagPro-ModFather/master/icon.png
// @download      https://raw.githubusercontent.com/wilcooo/TagPro-ModFather/master/tpmf.user.js
// @license       MIT
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         GM_xmlhttpRequest
// @connect       script.google.com
// @connect       script.googleusercontent.com
// @require       https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/37849/TagPro%20ModFather.user.js
// @updateURL https://update.greasyfork.org/scripts/37849/TagPro%20ModFather.meta.js
// ==/UserScript==


const debug = true;

/* TODO LIST for first release:

Author list

Built-in editor?

Replace 'alerts' with 'modals'

Maybe replace 'displayMessage' with 'modals'




/* Later versions:

(a) A system for userscript authors and/or moderators of ModFather to submit new scripts, and update/edit the data.
(b) A system to count installs and upvotes, and maybe somehow keeps track of which scripts are installed.
(c) Reviews by users, and a report system
(d) A way for mods to show their settings inside ModFather, so that all mods' options are customizable in a central place.



*/





// Constants //initialization


// There are still a lot hard-coded strings that need to be put up here.
const words = {
    english:{
        error_xhr: "Something went wrong while getting ModFather data.",
        error_getDatabase: "Could not grab the data from the database because the following error occured: ",
        watball_hint: "This mod will not automatically install. To manually do this, you will have to <i>download</i> the script and then drag the downloaded file into your browser window."
    }
}

const language = 'english';


const DASHBOARD_URL = {
    'chrome' : "chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=dashboard",
    'firefox' : "moz-extension://b12b5c7e-21b5-4eb0-b3f7-9d47696b73a8/options.html#nav=dashboard",
    'edge' : "ms-browser-extension://edgetampermonkeynet_JanBiniokTampermonkey_gz80c7jhhn2hw/options.html#nav=dashboard",
    'safari' : "safari-extension://net.tampermonkey.safari-G3XV72R5TC/b2bc49bd/options.html#nav=dashboard",
    'opera' : "chrome-extension://mfdhdgbonjidekjkjmjaneanmdmpmidf/options.html#nav=dashboard",
};



// In case the mod doesn't have an IMAGE
const filler_image = 'https://i.imgur.com/mrYPBlh.png';


var sd_converter = new showdown.Converter();

var makeHtml = markdown => sd_converter.makeHtml(markdown);


var sort_filter = {
    sort: 'hot',
    tag_filter: null,
    author_filter: null,
};

// GETTING THE DATABASE


const DATABASE_URL = "https://script.google.com/macros/s/AKfycbybe8e37-gpfe3cqN53UxZbvqVdysjFfdN5e1pDeqeJtAvnjaI/exec";

function prepareDatabase(data) {

    data.lastUpdated = Number(data.lastUpdated);

    // Add all updates to their respective mods
    if (data.UPDATES) {
        for (let update of data.UPDATES) {
            update.TIMESTAMP = new Date(update.TIMESTAMP).getTime();

            for (var mod of data.MODS) if (update.MOD == mod.NAME) break;

            mod.UPDATES = (mod.UPDATES || []).concat( update );
        }
    } else mod.UPDATES = [];

    var modID = 0;

    for (let mod of data.MODS) {
        mod.TIMESTAMP = new Date(mod.TIMESTAMP).getTime();

        // Make these comma seperated lists real lists:
        if(mod.TAGS) mod.TAGS = mod.TAGS.split(',');
        else mod.TAGS = [];

        var split_authors = mod.AUTHORS.split(',');
        mod.AUTHORS = [];

        for (var author_name of split_authors) {
            var author = null;
            for (var a of data.AUTHORS)
                if (author_name == a.ID) author = a;

            if (author) {
                // Link authors to mods and vice versa
                mod.AUTHORS.push(author);
                author.MODS = (author.MODS || []).concat( mod );
            } else{
                console.log(split_authors, author_name, author);
            }
        }
    }

    for (let author of data.AUTHORS) author.TIMESTAMP = new Date(author.TIMESTAMP).getTime();

    return data;
}

// Defining 'getJSON', using jQuery (faster) or falling back to XHR

getJSON = window.$ && $.getJSON || function(url, data, success) {


    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                console.error( words[language].error_xhr , xhr);
            }
        }
    };

    xhr.open("GET", url + '?' + data , true);
    xhr.send();
};

var getDatabase = new Promise(function(resolve,reject){
    try{

        // STEP 1: grab data from database

        getJSON(DATABASE_URL, "time", function(stripped) {

            try{
                console.log('STRIPPED',stripped);

                if ( stripped.lastUpdated > GM_getValue("database",{lastUpdated:0}).lastUpdated ) {
                    console.log('IT WORKED!');

                    getJSON(DATABASE_URL, "full", function(data) {

                        try {

                            GM_setValue("database",data);

                            // STEP 2: prepare the data in the right format

                            // STEP 3: resolve the promise with all the data.
                            resolve( prepareDatabase(data) );

                        } catch(e) {

                            var reason = e;
                            reject( words[language].error_getDatabase +reason);
                        }

                    });
                }

                else resolve( prepareDatabase( GM_getValue("database") ) );

            } catch(e) {

                var reason = e;
                reject( words[language].error_getDatabase +reason);
            }
        });

    } catch(e) {

        var reason = e;
        reject( words[language].error_getDatabase +reason);
    }
});

// Making it global (handy for debugging)
if(debug)gdat = getDatabase;

// GreasyFetching
// This code runs on greasyfork.org/modfather
// Only on that domain we can use the following code to find out what scripts are installed and enabled.

if (window.location.hostname.toLowerCase() == 'greasyfork.org' && window.location.pathname.toLowerCase() == '/modfather') {

    // Remove the 404 warning, and replace it with a custom explanation.
    var header, text;
    if (( header = document.getElementById('main-header') )) header.hidden = true;
    if (( text = document.getElementsByClassName('text-content')[0] )) text.innerHTML = "<h1>Don't close this webpage!</h1><p>TagPro ModFather is trying to find out what scripts you have installed. This tab will close automatically within a few seconds.</p>";
    document.title = "Do not close!";
    document.querySelector('link[rel=icon]').href = "http://koalabeast.com/favicon.ico";




    var checkScripts = function(){
        GM_setValue('TampermonkeyInstalled',true);

        getDatabase.then(function(database){

            var pending = 0,
                installedMods = {};

            database.MODS.forEach( function(mod,m) {

                pending++;

                TM.isInstalled( mod.NAME, mod.NAMESPACE, function(result) {
                    installedMods[m] = result;
                    mod.INSTALLED = result;

                    if (--pending == 0) { // If all mods are checked
                        GM_setValue('installedMods', installedMods);

                        window.close();

                        if (text) text.innerHTML = "<h1>You may close this webpage</h1><p>TagPro ModFather has found out what scripts you have installed. Automatically closing this window failed, you may do that now.</p>";
                        document.title = "Close me";
                    }
                });
            });

        });
    };




    if (!window.external) {
        GM_setValue('TampermonkeyInstalled',false);
        window.close();
    }

    else {
        var TM = window.external.Tampermonkey;
        if (TM) checkScripts();
        else setTimeout(function(){
            if (TM) checkScripts();
            else {
                GM_setValue('TampermonkeyInstalled',false);
                window.close();
            }
        },1e3);
    }

    return;
}


if (window.location.hostname.toLowerCase() == 'watball.github.io' && window.location.pathname.toLowerCase() == '/chat-macros/') {



    /*<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Modal Header</h4>
      </div>
      <div class="modal-body">
        <p>Some text in the modal.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>


data-toggle="modal" data-target="#myModal"*/


    var watball_modal = document.createElement('div');
    watball_modal.id = 'watball-modal';
    watball_modal.className = 'modal fade';
    watball_modal.setAttribute('role','dialog');
    document.body.appendChild(watball_modal);

    var modal_dialog = document.createElement('div');
    modal_dialog.className = 'modal-dialog';
    watball_modal.appendChild(modal_dialog);

    var modal_content = document.createElement('div');
    modal_content.className = 'modal-content';
    modal_dialog.appendChild(modal_content);

    var modal_header = document.createElement('div');
    modal_header.className = 'modal-header';
    modal_header.innerHTML += '<button type="button" class="close" data-dismiss="modal">&times;';
    modal_header.innerHTML += '<h4 class="modal-title">A message from ModFather';
    modal_content.appendChild(modal_header);

    var modal_body = document.createElement('div');
    modal_body.className = 'modal-body';
    modal_body.innerHTML += '<p>' + words[language].watball_hint;
    modal_content.appendChild(modal_body);

    var modal_footer = document.createElement('div');
    modal_footer.className = 'modal-footer';
    modal_footer.innerHTML += '<button type="button"class="btn btn-default" data-dismiss="modal">Close';
    modal_content.appendChild(modal_footer);

    document.getElementById('generate').setAttribute('data-toggle','modal')
    document.getElementById('generate').setAttribute('data-target','#watball-modal')
}




// This function opens greasyfork.org/modfather, which will make the code above run.
// When succeeded, the 'done' function is run.
function greasyFetch(done=null){
    GM_setValue('TampermonkeyInstalled',false);
    var gf_tab = GM_openInTab('https://greasyfork.org/modfather',true);
    gf_tab.onclose = done;
}





// Adding the 'ModFather' tab to the nav-bar (on every page)

var navBar = document.getElementById('site-nav');      // This is that menu bar on the top of every homepage (Groups, Leaderboards, Maps... etc.)

if (navBar) {         // If you are on a page with the navBar (I guess everywhere except in-game)


    // Create the button

    var navButton = document.createElement('li');
    navButton.id = 'nav-modfather';
    navButton.innerHTML = '<a href="/modfather" style="color:#8BC34A">ModFather</a>';

    // Add it between the 'maps' and 'texture pack' button.
    navBar.getElementsByTagName('ul')[0].insertBefore(navButton, document.getElementById('nav-textures') );


}





// If we are on the /ModFather page (after clicking on the nav-bar button)

if (window.location.pathname.toLowerCase() == '/modfather') {


    // Make the navBar button active
    navButton.classList.add('active-tab');
    // Change the page title
    document.title = 'TagPro ModFather';


    // Add ModFather content to the page

    for (var MF_content of document.body.children) if (MF_content.classList.contains('container')) break;

    MF_content.id = "MF_content";
    MF_content.innerHTML = `<div class="row"><div class="col-md-12">  <h1 class="header-title">ModFather</h1>  <ul id="MF_tablist" class="tab-list"></ul>  <div id="MF_tabcontent" class="tab-content">`;

    MF_tablist    = document.getElementById('MF_tablist');
    MF_tabcontent = document.getElementById('MF_tabcontent');


    // Add some tabs to the tablist

    var list_tab = MF_tablist.appendChild( document.createElement('li') );
    list_tab.innerHTML = '<a>List view</a>';
    list_tab.onclick = ()=>selectTab('list');
    list_tab.id = 'MF_tab_list';

    var tile_tab = MF_tablist.appendChild( document.createElement('li') );
    tile_tab.innerHTML = '<a>Tile view</a>';
    tile_tab.onclick = ()=>selectTab('tile');
    tile_tab.id = 'MF_tab_tile';

    var authors_tab = MF_tablist.appendChild( document.createElement('li') );
    authors_tab.innerHTML = '<a>Authors</a>';
    authors_tab.onclick = ()=>selectTab('authors');
    authors_tab.id = 'MF_tab_authors';

    var help_tab = MF_tablist.appendChild( document.createElement('li') );
    help_tab.innerHTML = '<a>Help / FAQ</a>';
    help_tab.onclick = ()=>selectTab('help');
    help_tab.id = 'MF_tab_help';

    var contribute_tab = MF_tablist.appendChild( document.createElement('li') );
    contribute_tab.innerHTML = '<a>Contribute!</a>';
    contribute_tab.onclick = ()=>selectTab('contribute');
    contribute_tab.id = 'MF_tab_contribute';


    // Add the corresponding content containers of those tabs to the page

    var list_content = MF_tabcontent.appendChild( document.createElement('div') );
    list_content.className = 'tab-pane';
    list_content.id = 'MF_content_list';

    var tile_content = MF_tabcontent.appendChild( document.createElement('div') );
    tile_content.className = 'tab-pane';
    tile_content.id = 'MF_content_tile';

    var authors_content = MF_tabcontent.appendChild( document.createElement('div') );
    authors_content.className = 'tab-pane';
    authors_content.id = 'MF_content_authors';

    var help_content = MF_tabcontent.appendChild( document.createElement('div') );
    help_content.className = 'tab-pane';
    help_content.id = 'MF_content_help';

    var contribute_content = MF_tabcontent.appendChild( document.createElement('div') );
    contribute_content.className = 'tab-pane';
    contribute_content.id = 'MF_content_contribute';







    // Create the explanation/sort/filter bubble
    var explanation_bubble = document.createElement('p')
    explanation_bubble.className = 'explanation-bubble';
    explanation_bubble.innerHTML = 'Customize TagPro by installing mods. <span id="sort-options-list" class="pull-right"> Sort by ';

    var sort_options_list = explanation_bubble.getElementsByTagName('span')[0];

    // Add some sort options (same style as the texture pack selector)
    sort_options_list.innerHTML += '<span class="sort mod-sort" onclick=MF_setSort("hot")><a> Hot ';
    sort_options_list.innerHTML += '<span class="sort mod-sort" onclick=MF_setSort("new")><a> New ';
    sort_options_list.innerHTML += '<span class="sort mod-sort" onclick=MF_setSort("best")><a> Best ';
    sort_options_list.innerHTML += '<span class="sort mod-sort" onclick=MF_setSort("name")><a> Name ';

    explanation_bubble.innerHTML += '<hr><div class="row"><span id="bubble-author-filter" class="col-xs-6"></span><span id="bubble-tag-filter" class="col-xs-6"></span>';






    // Put some content in the content containers; first, the 'List Mods' tab

    // Add the explanation above the mods
    list_content.innerHTML += '<div class="row">  <div class="col-md-12" id="list-explanation-bubble">';

    list_content.children[0].innerHTML += '<div class="col-md-12"> <table class="table table-stripped"><col width=1><col width=1><col width=1><thead id="list-thead"></thead><tbody id="list-tbody"></tbody>';

    var list_thead = document.getElementById('list-thead');
    var list_tbody = document.getElementById('list-tbody');


    list_thead.innerHTML = '<tr> <th title=Icon>  <th title=Installs> I  <th title=Upvotes> U  <th> Name  <th> Summary  <th> Tags  <th> Authors  <th>';

    list_tbody.innerHTML = '<td colspan=999 align=center> <div class=spinner> <div class=spinner-item></div> <div class=spinner-item></div> <div class=spinner-item></div> <div class=spinner-item></div>';




    // Second: the 'Tile' tab

    tile_content.innerHTML += '<div class="row">  <div class="col-md-12" id="tile-explanation-bubble">';


    tile_content.children[0].innerHTML += '<div id="tiles">';

    var tile_list = document.getElementById('tiles');






    // Put some content in the content containers; fourthly, the 'help' tab
    help_content.innerHTML += 'This is the TagPro ModFather. You can contribute by adding mods to its database. If you want to help in another way or have feedback, send a message to <a href="https://www.reddit.com/message/compose/?to=Wilcooo">Ko</a>';
    help_content.innerHTML += `
        <p>The database is currently being updated via three Google Forms, one for
        <i><a href="https://docs.google.com/forms/d/1xJ9rGAeYAWG8-nZbjjXJKhteP893xwBsjo07YAqymd8/viewform">adding authors</a></i>, one for
        <i><a href="https://docs.google.com/forms/d/1ID5NlYCVYxXKuXudPud6x9rdRMcV9RQf2UXtKFXWD6g/viewform">adding mods</a></i> and one for
        <i><a href="https://docs.google.com/forms/d/1QIylJov7XAOZSqzWMIVR7tIFaJ5-ZsAb9nHE_9aYnR4/viewform">updating the changelog</a></i> of a mod.
        I plan to make custom forms right here in ModFather to make it possible to change or delete authors and mods, as well as a way to undo actions and possibly some sort of permission system.

        <p>The database will keep the same structure though, so mods that are added via the Google Forms won't need to be re-added when the new system gets activated.

        <p>The source of this mod, as well as more information is on its <a href="https://github.com/Wilcooo/TagPro-ModFather">GitHub repo</a>.
        `;




    // Put content in the 'Contribute' tab
    contribute_content.innerHTML += `
        Welcome to the 'Contribute' tab, I'm glad you want to help! You can do so in various ways:
        <ul style="padding:20px; list-style:disc;">
            <li> Submit a mod to ModFather that you've created or found somewhere else</li>
            <li> Add or update information to mods already in the database</li>
            <li> </i>
        </ul>

    `;









    // Make List entrys, Tile entrys and Buttons for every mod
    getDatabase.then(function(database) {

        database.MODS.forEach(function(mod) {

            mod.LIST = document.createElement('tr');
            mod.LIST.style.height = '50px';

            mod.LIST.innerHTML += mod.ICON ? '<td> <img width=24 height=24 src=' + mod.ICON + '>' : '<td>';
            mod.LIST.innerHTML += '<td> ? ';
            mod.LIST.innerHTML += '<td> ? ';
            mod.LIST.innerHTML += '<td>' + mod.NAME;
            mod.LIST.innerHTML += '<td class="list-summary">' + mod.SUMMARY;

            mod.LIST.innerHTML += '<td>';
            for (let tag of mod.TAGS)
                mod.LIST.lastChild.innerHTML += '<span class="sort tag-filter" onclick=MF_setTagFilter("' + tag + '")><a>' + tag + '</a></span> ';

            mod.LIST.innerHTML += '<td>';
            for (let author of mod.AUTHORS)
                mod.LIST.lastChild.innerHTML += '<span class="sort author-filter" onclick=MF_setAuthorFilter("' + author.NAME + '")><a>' + author.NAME + '</a></span> ';

            mod.LIST.innerHTML += '<td class="list-button">';

            mod.LIST.onclick = click => click.target.tagName != 'A' ? openInfoBox(mod) : 0;





            mod.TILE = document.createElement('div');
            mod.TILE.className = "col-xs-12 col-sm-6 col-md-4 col-lg-3";
            mod.TILE.innerHTML += '<div class="tile-choice">';

            mod.TILE.firstChild.innerHTML += '<span class="tile-rating" title="Installs and Upvotes">?  ?';
            mod.TILE.firstChild.innerHTML += '<div class="tile-name">' + mod.NAME;

            mod.TILE.firstChild.innerHTML += '<div class="tile-authors">' + (mod.AUTHORS.length ? ' by ': '&nbsp;');
            for (let author of mod.AUTHORS)
                mod.TILE.firstChild.lastChild.innerHTML += '<span class="sort author-filter" onclick=MF_setAuthorFilter("' + author.NAME + '")><a>' + author.NAME + '</a></span> ';

            mod.TILE.firstChild.innerHTML += '<hr><div style="background-image:url(' + (mod.IMAGE || filler_image) + ')" class="tile-image"><hr>';
            mod.TILE.firstChild.innerHTML += '<div class="tile-summary">' + mod.SUMMARY;
            mod.TILE.firstChild.innerHTML += '<div class="tile-button">';

            mod.TILE.firstChild.innerHTML += '<div class="tile-tags">';
            for (let tag of mod.TAGS)
                mod.TILE.firstChild.lastChild.innerHTML += '<span class="sort tag-filter" onclick=MF_setTagFilter("' + tag + '")><a>' + tag + '</a></span> ';

            mod.TILE.onclick = click => click.target.tagName != 'A' ? openInfoBox(mod) : 0;






            mod.BUTTON = document.createElement('a');
            mod.BUTTON.setAttribute('data-install-link', mod.LINK);
            mod.BUTTON.setAttribute('data-name', mod.NAME);
            mod.BUTTON.className = "MF-loading";
            mod.BUTTON.innerHTML = "<div class=spinner> <div class=spinner-item></div> <div class=spinner-item></div> <div class=spinner-item></div>";

            mod.BUTTON.onclick = function(click){

                if ([...click.target.classList].includes('MF-install') ||
                    [...click.target.classList].includes('MF-update') ||
                    [...click.target.classList].includes('MF-retry')) {

                    console.log('INSTALLING', click.target.getAttribute('data-install-link'));

                    click.target.className = "MF-loading";
                    var installer = GM_openInTab(click.target.getAttribute('data-install-link'),true);
                    installer.close();

                    click.target.INSTALLING = true;

                    window.addEventListener("focus", update_installed, {once:true});
                }

                else if ( [...click.target.classList].includes('MF-remove') ) {
                    console.log('REMOVING', click.target.getAttribute('data-name'));

                    click.target.className = "MF-loading";

                    if (GM_getValue('TampermonkeyInstalled') && DASHBOARD_URL[getBrowser()] ) {

                        if (confirm('Click on the bin icon next to the script(s) that you want to remove.\n\nPlease close the tab whenever you are ready to get back.')) {

                            let TM_dashboard = GM_openInTab( DASHBOARD_URL[getBrowser()] , false);

                            TM_dashboard.onclose = function(){
                                if (document.getElementById('msg_backFromRemove')) {
                                    document.getElementById('msg_backFromRemove').remove();
                                    update_installed();
                                }
                            };

                            displayMessage('Welcome back! Click this bubble to redetect which mods are installed/removed','msg_backFromRemove',TM_dashboard.onclose);
                        } else click.target.className = "MF-remove";
                    } else if (GM_getValue('TampermonkeyInstalled')) {

                        displayMessage('I haven\'t added support for your browser yet, sorry! <p> Go to Tampermonkey\'s <i>dashboard</i> to remove scripts. You can usually get there by clicking its <img onclick="MF_wrongIcon()" src="http://tampermonkey.net/images/icon_grey.png" height=24> icon. <p> Then click this bubble to redetect which mods are installed/removed','msg_backFromRemove',function(){
                            document.getElementById('msg_backFromRemove').remove();
                            update_installed();
                        });
                    } else {

                        displayMessage('Tampermonkey is not detected. Go to your userscript managers\' dashboard to remove scripts. Then click this bubble to redetect which mods are installed/removed','msg_backFromRemove',function(){
                            document.getElementById('msg_backFromRemove').remove();
                            update_installed();
                        });
                    }
                }

                else if ( [...click.target.classList].includes('MF-enable') ) {
                    console.log('ENABLING', click.target.getAttribute('data-name'));

                    click.target.className = "MF-loading";

                    if (GM_getValue('TampermonkeyInstalled') && DASHBOARD_URL[getBrowser()] ) {

                        if (confirm('Switch the slider next to the script(s) that you want to enable/disable.\n\nPlease close the tab whenever you are ready to get back.')) {
                            let TM_dashboard = GM_openInTab( DASHBOARD_URL[getBrowser()] , false);

                            TM_dashboard.onclose = function(){
                                if (document.getElementById('msg_backFromEnable')) {
                                    document.getElementById('msg_backFromEnable').remove();
                                    update_installed();
                                }
                            };

                            displayMessage('Welcome back! Click this bubble to redetect which mods are enabled/disabled','msg_backFromEnable',TM_dashboard.onclose);
                        } else click.target.className = "MF-enable";
                    } else if (GM_getValue('TampermonkeyInstalled')) {

                        displayMessage('I haven\'t added support for your browser yet, sorry! <p> Go to Tampermonkey\'s <i>dashboard</i> to enable scripts. You can usually get there by clicking its <img onclick="MF_wrongIcon()" src="http://tampermonkey.net/images/icon_grey.png" height=24> icon. <p> Then click this bubble to redetect which mods are enabled/disabled','msg_backFromEnable',function(){
                            document.getElementById('msg_backFromEnable').remove();
                            update_installed();
                        });
                    } else {

                        displayMessage('Tampermonkey is not detected. Go to your userscript managers\' dashboard to enable scripts. Then click this bubble to redetect which mods are enabled/disable','msg_backFromEnable',function(){
                            document.getElementById('msg_backFromEnable').remove();
                            update_installed();
                        });
                    }
                }
            };

        });

        update_sort_filter();

        update_installed();
    });














    // The info-modal with mod-details:

    var infoBox = document.createElement('div');
    infoBox.className = 'modal fade';
    infoBox.id = 'MF-infoBox';

    document.body.appendChild(infoBox);

    infoBox.innerHTML =
    `
    <div class="modal-dialog" style="width:80%">

      <!-- Modal content-->
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id="MF-infoBox-name">Mod</h4>
          <subtitle>by <span id="MF-infoBox-authors">Some Ball</span>
        </div>

        <div class="modal-body">
          <div id="MF-infoBox-install"></div>
          <div id="MF-infoBox-summary">This mod lets you take over the world!</div><hr>
          <div id="MF-infoBox-updates">- Bug Fixes<br>- New Features</div>
          <div id="MF-infoBox-description">You've found the most awesome mod! Install it now to be amazed :)</div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default close" data-dismiss="modal">Close</button>
          <div id="MF-infoBox-buttons"></div>
          <div id="MF-infoBox-tags"></div>
          <p style="font-size:10px;">The style of this popup needs some polishing i.m.o.<br>Contact me if you know CSS and have a good taste
        </div>
      </div>

    </div>
    `;

    infoBox.name        = document.getElementById('MF-infoBox-name');
    infoBox.authors     = document.getElementById('MF-infoBox-authors');
    infoBox.install     = document.getElementById('MF-infoBox-install');
    infoBox.summary     = document.getElementById('MF-infoBox-summary');
    infoBox.updates     = document.getElementById('MF-infoBox-updates');
    infoBox.description = document.getElementById('MF-infoBox-description');
    infoBox.buttons     = document.getElementById('MF-infoBox-buttons');
    infoBox.tags        = document.getElementById('MF-infoBox-tags');


    var openInfoBox = function(mod) {

        $('#MF-infoBox').modal();

        infoBox.name.innerText = mod.NAME;

        infoBox.authors.innerHTML = '';

        for (let author of mod.AUTHORS)
            infoBox.authors.innerHTML += '<span class="sort author-filter" onclick=MF_setAuthorFilter("' + author.NAME + '")><a>' + author.NAME + '</a></span> ';

        infoBox.install.innerHTML = '';
        infoBox.install.appendChild( mod.BUTTON );

        infoBox.summary.innerText = mod.SUMMARY;

        console.log(mod);

        infoBox.updates.innerText = mod.UPDATES && mod.UPDATES[mod.UPDATES.length-1] && mod.UPDATES[mod.UPDATES.length-1].NOTES || 'no updates';

        if ( mod.UPDATES && mod.UPDATES[mod.UPDATES.length-1] ) {
            infoBox.updates.innerHTML = makeHtml(mod.UPDATES[mod.UPDATES.length-1].NOTES);
            infoBox.updates.hidden = false;
        } else infoBox.updates.hidden = true;

        infoBox.description.innerHTML = makeHtml(mod.DESCRIPTION);

        infoBox.buttons.innerHTML = '';

        if (mod.WEBSITE) infoBox.buttons.innerHTML += '<a href="'+mod.WEBSITE+'">WEBSITE</a> ';

        if (mod.REDDIT) {
            infoBox.buttons.innerHTML += '<a href="'+mod.REDDIT+'"><img src="https://i.imgur.com/nSaYH3g.png"></a> ';
        }

        if (mod.SOURCE) infoBox.buttons.innerHTML += '<a href="'+mod.SOURCE+'">SOURCE</a> ';

        if (mod.UPDATES && mod.UPDATES.length) infoBox.buttons.innerHTML += 'LAST UPDATE: '+mod.UPDATES[mod.UPDATES.length-1].DATE;

        infoBox.tags.innerHTML = '';

        for (let tag of mod.TAGS)
            infoBox.tags.innerHTML += '<span class="sort tag-filter" onclick=MF_setTagFilter("' + tag + '")><a>' + tag + '</a></span> ';

    };

    $('#MF-infoBox').on('hidden.bs.modal',update_sort_filter);



    selectTab();














    // Add some rules to the stylesheet
    // Find the correct styleSheet
    for (var styleSheet of document.styleSheets) if (styleSheet.href.includes('/style.css')) break;

    // The explanation-bubble appears above the mods list. (and contains the sort options)
    styleSheet.insertRule(".explanation-bubble { background: #383838; border-radius: 3px; border: 1px solid #3c3c3c; padding: 10px; margin-top: 0; }");
    styleSheet.insertRule(".sort { cursor: pointer }");

    // The install/remove/etc. buttons
    styleSheet.insertRule(".MF-install, .MF-remove, .MF-update, .MF-error, .MF-enable, .MF-retry, .MF-loading { overflow:hidden; font-size: 90%; width: 90px; height: 24px; text-align: center; display: inline-block; font-weight: bold; border-radius: 3px; text-transform: upper-case; }");
    styleSheet.insertRule(".MF-install, .MF-remove, .MF-update, .MF-error, .MF-enable, .MF-retry { cursor: pointer; onclick:'MF_clickInstall()' }");

    styleSheet.insertRule(".MF-install { color: #222; background: #CDDC39; border: 1px solid #827717; box-shadow: 0 3px #827717; }");
    styleSheet.insertRule(".MF-install:after { content: 'INSTALL'; }");
    styleSheet.insertRule(".MF-install:hover, .MF-install:focus { color: #222; background: #B4C333; }");
    styleSheet.insertRule(".MF-install .spinner { display : none }");

    styleSheet.insertRule(".MF-remove { color: #fff; background: #0E8AE0; border: 1px solid #095C96; box-shadow: 0 3px #095C96; }");
    styleSheet.insertRule(".MF-remove:after { content: '✓'; }");
    styleSheet.insertRule(".MF-remove:hover, .MF-remove:focus { background: #DC8B39; color: #C32C27; border: 1px solid #834D18; box-shadow: 0 3px #834D18; }");
    styleSheet.insertRule(".MF-remove:hover:after, .MF-remove:focus:after { content: \"REMOVE\" ; }");
    styleSheet.insertRule(".MF-remove .spinner { display : none }");

    styleSheet.insertRule(".MF-update { color: #222; background: #FFDE33; border: 1px solid #808000; box-shadow: 0 3px #808000; }");
    styleSheet.insertRule(".MF-update:after { content: '⚠'; }");
    styleSheet.insertRule(".MF-update:hover, .MF-update:focus { color: #222; background: #E6C82E; }");
    styleSheet.insertRule(".MF-update:hover:after, .MF-update:focus:after { content: 'UPDATE' ; }");
    styleSheet.insertRule(".MF-update .spinner { display : none }");

    styleSheet.insertRule(".MF-enable { color: #222; background: #FFDE33; border: 1px solid #808000; box-shadow: 0 3px #808000; }");
    styleSheet.insertRule(".MF-enable:after { content: '⚠'; }");
    styleSheet.insertRule(".MF-enable:hover, .MF-enable:focus { color: #222; background: #E6C82E; }");
    styleSheet.insertRule(".MF-enable:hover:after, .MF-enable:focus:after { content: 'ENABLE' ; }");
    styleSheet.insertRule(".MF-enable .spinner { display : none }");

    styleSheet.insertRule(".MF-retry { color: #222; background: #DC3939; border: 1px solid #832218; box-shadow: 0 3px #832218; }");
    styleSheet.insertRule(".MF-retry:after { content: '✗'; }");
    styleSheet.insertRule(".MF-retry:hover, .MF-retry:focus { color: #222; background: #F64040; }");
    styleSheet.insertRule(".MF-retry:hover:after, .MF-retry:focus:after { content: 'RETRY' ; }");
    styleSheet.insertRule(".MF-retry .spinner { display : none }");

    styleSheet.insertRule(".MF-loading { cursor:auto; background: #A48AA4; border: 1px solid #838383; box-shadow: 0 3px #838383; }");



    // Now for the tile-view CSS
    styleSheet.insertRule(".tile-choice { overflow: auto; background: #383838; border-radius: 3px; margin-bottom: 20px; padding: 8px; border: 1px solid #3c3c3c; cursor: help; } ");
    styleSheet.insertRule(".tile-choice:hover { box-shadow: rgba(100, 200, 100, 0.4) 0px 0px 15px 5px; }");
    styleSheet.insertRule(".tile-rating { font-size:11px; float:right; }");
    styleSheet.insertRule(".tile-name { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; height:26px; color: #8BC34A; font-size: 22px; font-weight: bold; }");
    styleSheet.insertRule(".tile-authors { text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }");

    styleSheet.insertRule(".tile-image { padding-top:75%; background-size:contain; background-repeat:no-repeat; background-position:center; }");

    styleSheet.insertRule(".tile-summary { position:relative; font-size:16px; height:40px; overflow:hidden; }");
    styleSheet.insertRule(".tile-summary:after { position:absolute; content:''; padding-right:150px; bottom:0; right:0; wdith:100%; height:20px; background:linear-gradient(to right, #38383800, #383838FF 80% );  }");

    styleSheet.insertRule(".tile-button { float:right; margin-top:16px; }");
    styleSheet.insertRule(".tile-tags { font-size:16px; margin-right:100px; height:40px; overflow:hidden; }");
    styleSheet.insertRule(".tile-choice hr { padding-top: 8px; border-top: 2px solid #3c3c3c; margin: 8px 0 4px; }");



    // Highlighting the table rows
    styleSheet.insertRule("#list-tbody tr:hover { cursor:help; box-shadow: rgba(100, 200, 100, 0.4) 0 0 15px 5px  inset;  }");

    // More table CSS
    styleSheet.insertRule(".list-summary { font-size:16px; }");





    // infoBox
    /*infoBox.name        = document.getElementById('MF-infoBox-name');
    infoBox.authors     = document.getElementById('MF-infoBox-authors');
    infoBox.install     = document.getElementById('MF-infoBox-install');
    infoBox.summary     = document.getElementById('MF-infoBox-summary');
    infoBox.updates     = document.getElementById('MF-infoBox-updates');
    infoBox.description = document.getElementById('MF-infoBox-description');
    infoBox.buttons     = document.getElementById('MF-infoBox-buttons');
    infoBox.tags        = document.getElementById('MF-infoBox-tags');*/

    styleSheet.insertRule("#MF-infoBox .modal-header { background-color:#8BC34A; text-align:center; }");
    styleSheet.insertRule("#MF-infoBox .modal-header h4 { font-size:30px; }");
    styleSheet.insertRule("#MF-infoBox .modal-header .close { font-size:30px; float:right; font-weight: bolder; border: none; background: none; opacity: .3; }");
    styleSheet.insertRule("#MF-infoBox .modal-header .close:hover { opacity: .7; }");
    styleSheet.insertRule("#MF-infoBox .modal-header subtitle { font-style:italic; }");
    styleSheet.insertRule("#MF-infoBox .modal-header a { color:#0E8AE0; }");
    styleSheet.insertRule("#MF-infoBox .modal-header a:hover { color:#0277BD; }");

    styleSheet.insertRule("#MF-infoBox-install { float:right; }");
    styleSheet.insertRule("#MF-infoBox-summary { text-align:center; }");

    styleSheet.insertRule("#MF-infoBox-updates { border-color: aqua; border-style: dotted; border-radius: 10px; margin: auto; width: 80%; margin-top: 20px; font-size: medium; padding: 10px; }");

    styleSheet.insertRule("#MF-infoBox-description { margin:auto; width:90%; }");
    styleSheet.insertRule("#MF-infoBox-description img { margin:auto; width:90%; display:block; } ")

    styleSheet.insertRule("#MF-infoBox .modal-footer { background-color:#8BC34A; text-align:center; }");
    styleSheet.insertRule("#MF-infoBox .modal-footer a { color:#0E8AE0; }");
    styleSheet.insertRule("#MF-infoBox .modal-footer a:hover { color:#0277BD; }");
    styleSheet.insertRule("#MF-infoBox .modal-footer .close { float:right; }");


}


// Extra functions


function displayMessage(innerHTML,id='',onclick=null) {

    var column = document.createElement('div');
    column.className = "col-md-8 col-md-offset-2";
    column.id = id;

    if (onclick) {
        column.onclick = onclick;
        column.style.cursor = 'pointer';
    }

    var message =  document.createElement('div');
    message.className = "msg";
    message.style.marginBottom = 20;
    message.innerHTML = innerHTML;
    message.style.color = "#A2A9FF";
    message.style.background = "#21216B";
    message.style.borderColor = "#0B0EBD";

    column.appendChild(message);

    var MF_content = document.getElementById('MF_content');
    MF_content.insertBefore( column, MF_content.firstChild );

}


function getBrowser() {

    if (window.chrome && window.chrome.webstore) return 'chrome';

    if (/edge/i.test(navigator.userAgent)) return 'edge';

    if (/constructor/i.test(window.HTMLElement)) return 'safari';

    if (/opera|opr/i.test(navigator.userAgent)) return 'opera';

    if (window.sidebar) return 'firefox';

    if(!GM_getValue('alertedWeirdBrowser',false)) {
        GM_setValue('alertedWeirdBrowser',true);
        alert('Hey there, I smell that you are using a weird broser. Uninstalling will have to be done manually.\n\nWill you please send a message to Ko (via the "contribute" tab) with the name of your browser? I might be able to add support for your browser. Thanks!\n\nYou won\'t see this message in the future :)');
    }

    return '';
}




// Keep track of the sorting & filters

MF_setSort = function (sort = null) {

    sort_filter.sort = sort;
    update_sort_filter();
};

MF_setTagFilter = function (tag_filter=null) {

    sort_filter.tag_filter = tag_filter;
    update_sort_filter();
};

MF_setAuthorFilter = function (author_filter=null) {

    sort_filter.author_filter = author_filter;
    update_sort_filter();
};

function update_sort_filter() {

    $('#MF-infoBox').modal('hide');

    var view = window.location.hash.substr(1);

    if (view == 'list') document.getElementById('list-explanation-bubble').appendChild(explanation_bubble);
    else  document.getElementById('tile-explanation-bubble').appendChild(explanation_bubble);

    var sort = sort_filter.sort,
        tag_filter = sort_filter.tag_filter,
        author_filter = sort_filter.author_filter;


    if (tag_filter) document.getElementById('bubble-tag-filter').innerHTML = '<a style="cursor:pointer" onclick="MF_setTagFilter()">🗙</a> Active filter: ' + tag_filter;
    else document.getElementById('bubble-tag-filter').innerHTML = '';

    if (author_filter) document.getElementById('bubble-author-filter').innerHTML = '<a style="cursor:pointer" onclick="MF_setAuthorFilter()">🗙</a> Showing mods by ' + author_filter;
    else document.getElementById('bubble-author-filter').innerHTML = '';

    var sorted_filtered_mods = [];

    getDatabase.then( function(database) {

        for (let mod of database.MODS) {

            if (( !tag_filter || mod.TAGS.includes(tag_filter)) &&
                ( !author_filter || mod.AUTHORS.reduce((c,n)=>c.concat(n.NAME),[]).includes(author_filter)) )
                sorted_filtered_mods.push(mod);
        }

        if (sort == 'name')
            sorted_filtered_mods.sort( function(a,b) {
                if ( a.NAME.toLowerCase < b.NAME.toLowerCase ) return -1;
                if ( a.NAME.toLowerCase > b.NAME.toLowerCase ) return +1;
                return 0;
            });

        // if (sort == 'hot')

        // if (sort == 'new')

        // if (sort == 'top')

        // Clear the list/tile
        if (view == 'list') while (list_tbody.firstChild) list_tbody.removeChild(list_tbody.firstChild);
        if (view == 'tile') while (tile_list.firstChild) tile_list.removeChild(tile_list.firstChild);

        // Fill again, but sorted && filtered

        for (let mod of sorted_filtered_mods) {

            if (view == 'list') {
                list_tbody.appendChild(mod.LIST);
                mod.LIST.getElementsByClassName("list-button")[0].appendChild( mod.BUTTON );

                //let img = mod.LIST.getElementsByTagName("img")[0];
                //img.src = img.getAttribute('data-src');
            }
            if (view == 'tile') {
                tile_list.appendChild(mod.TILE);
                mod.TILE.getElementsByClassName("tile-button")[0].appendChild( mod.BUTTON );

                //let img = mod.TILE.getElementsByTagName("img")[0];
                //img.src = img.getAttribute('data-src');
            }
        }

    });
};

var update_installed = function() {

    $('#MF-infoBox').modal('hide');

    greasyFetch(function(){

        if (!GM_getValue('TampermonkeyInstalled',false) && !GM_getValue('otherManager',false)) {

            displayMessage('Hey, I smell that you haven\'t installed <b>Tampermonkey</b> (or it\'s disabled). Without such a <i>userscript manager</i>, none of the mods on this page will work! <p> <li> <b><a href="https://tampermonkey.net" target="_blank">Install Tampermonkey</a></b> <li>Enable Tampermonkey by clicking its <img onclick="MF_wrongIcon()" src="http://tampermonkey.net/images/icon_grey.png" height=24> icon and <i>Disabled</i>  <li> click <b><a style="cursor:pointer" onclick=MF_otherManager()>here</a></b> if you surely have an (other) userscript manager.',
                          'Tampermonkey-Message');

        } else if (GM_getValue('TampermonkeyInstalled',false)) GM_setValue('otherManager',true);

        getDatabase.then(function(database) {
            for ( var m in GM_getValue('installedMods',{}) ) {
                var mod = database.MODS[m];
                mod.INSTALLED = true;

                if(mod.BUTTON.INSTALLING) mod.BUTTON.className = 'MF-retry';
                else mod.BUTTON.className = 'MF-remove';
            }

            var installedMods = GM_getValue('installedMods',{});

            database.MODS.forEach(function(mod,m){
                if (installedMods[m] && installedMods[m].installed) {

                    if (/*installedMods[m].version < mod.VERSION   TODO: VERSION CHECK*/false) mod.BUTTON.className = 'MF-update';
                    else if ( installedMods[m].enabled) mod.BUTTON.className = 'MF-remove';
                    else mod.BUTTON.className = 'MF-enable';
                }
                else if (mod.BUTTON.INSTALLING) {
                    mod.BUTTON.className = 'MF-retry';
                    mod.BUTTON.INSTALLING = false;
                }
                else mod.BUTTON.className = 'MF-install';
            });
        });
    });
};

MF_otherManager = function() {

    if (confirm('Are you sure? Tampermonkey is the only supported manager. With another one it isn\'t possible to see which scripts are installed, and upvotes won\'t work. \n\n Click "Ok" to hide the warning forever. You can still install Tampermonkey anytime if you change your mind.')) {
        GM_setValue('otherManager', true);

        document.getElementById('Tampermonkey-Message').remove();
    }
};

MF_wrongIcon = function() {

    alert('No, not this icon, but the one in the top-right. If you don\'t see it you\'ll probably just need to install Tampermonkey');
};

// Select the right tab based on the URL hash

function selectTab (tab = window.location.hash.substr(1)) {

    // Set the hash (if needed)
    window.location.hash = tab;

    // Deselect all tabs
    MF_tablist.childNodes.forEach(tab=>tab.classList.remove('active'));
    MF_tabcontent.childNodes.forEach(content=>content.classList.remove('active'));

    try {
        document.getElementById('MF_tab_'+tab).classList.add('active');
        document.getElementById('MF_content_'+tab).classList.add('active');
    } catch(e) {
        console.log('ModFather: Tab not found:',tab);
        if (tab != 'list') selectTab('list');
    }

    update_sort_filter();
}
