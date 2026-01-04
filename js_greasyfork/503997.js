// ==UserScript==
// @name         Good Old Kongregate
// @namespace    https://greasyfork.org/users/1206953
// @version      1.4.7
// @description  Gone but not forgotten - browse Kongregate with the pre-2023 style
// @author       Fancy2209, Matrix4348
// @match        *://www.kongregate.com/*
// @icon         https://matrix4348.github.io/logos/kongregate.png
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503997/Good%20Old%20Kongregate.user.js
// @updateURL https://update.greasyfork.org/scripts/503997/Good%20Old%20Kongregate.meta.js
// ==/UserScript==

// Various GM_* functions disappeared in Greasemonkey 4 (which is the Greasemonkey for modern Firefox), so we will define them as useless functions so the script does not break.
// I chose not to make them work in Greasemonkey 4 because the workaround (which is NOT hard to implement) would force us to use async functions in some places. This would, in my opinion, needlessly complexify
// the code.
if( typeof(GM_getValue)=="undefined" ){ GM_getValue=function(a,b){ return b; }; }
if( typeof(GM_setValue)=="undefined" ){ GM_setValue=function(){}; }
if( typeof(GM_registerMenuCommand)=="undefined" ){ GM_registerMenuCommand=function(){}; }
if( typeof(GM_unregisterMenuCommand)=="undefined" ){ GM_unregisterMenuCommand=function(){}; }

function registerMenuCommand(t,f,o){
    var n=GM_info.scriptHandler.toLowerCase();
    var v0=GM_info.version[0];
    if(n=="greasemonkey"){
        if(v0==4){
            // Do nothing... for now?
        }
        else{
            // A third argument breaks GM_registerMenuCommand ("accessKey must be a single character") on Pale Moon.
            // I am assuming that the problem is shared across all browsers, for Greasemonkey 3... and below.
            GM_registerMenuCommand(t,f);
        }
    }
    else{ GM_registerMenuCommand(t,f,o); }
}
////

var unsupported_pages = [
    // Use (|/fr|/de) after .com in order to take localized pages into account.
    // Notes: . is a wildcard for one character, * represents several occurences of what if follows, (?!X) means "only if not followed by X", (.*?) means anything.
    // Note: (\[A-Za-z0-9_\]) means anything that is a latin letter, arabic digit or underscore.
    "www.kongregate.com(|/fr|/de)/achievements",
    "www.kongregate.com(|/fr|/de)/search",
    "www.kongregate.com(|/fr|/de)/games(?!.)", // Target: https://www.kongregate.com/games but not https://www.kongregate.com/games_for_your_site or game pages
    "www.kongregate.com((?!/games/)|/fr(?!/games/)|/de(?!/games/))/(.*?)-games", // Targets: pages like https://www.kongregate.com/puzzle-games. Use of (?!/games/) because game names could end by "-games" or " games".
    "www.kongregate.com(|/fr|/de)/games/(\[A-Za-z0-9_\]*)/?(?!.)", // Targets: www.kongregate.com/games/dev and www.kongregate.com/games/dev/ but not www.kongregate.com/games/dev/game
];

function is_unsupported(){
    var url=document.location.href;
    for(let p of unsupported_pages){
        if(url.search(p)>-1){ return true; }
    }
    return false;
}

function PutWarningOnUnsupportedPages(A){
    if(typeof(document.body?.firstElementChild)!="undefined" && is_unsupported()){
        var d=document.createElement("div");
        d.style.textAlign="center";
        d.style.margin="5px";
        d.style.fontSize="12px";
        d.style.fontStyle="italic";
        var nv=(GM_info.scriptHandler+GM_info.version).toLowerCase().substring(0,13);
        var good, bad;
        good="<b>Good Old Kongregate is partly disabled by default on this page because some of its features might completely break it. However, you can toggle the full user script on and off on unsupported pages from the "+GM_info.scriptHandler+" menu (click the extension icon or right click the page).</b>";
        bad="<b>Good Old Kongregate is partly disabled by default on this page because some of its features might completely break it.</b>"; // Reminder: on Greasemonkey 4, most GM_ functions do not work.
        d.innerHTML= nv=="greasemonkey4" ? bad : good;
        document.body.insertBefore(d,document.body.firstElementChild);
    }
    else if(A){ setTimeout(function(B){ PutWarningOnUnsupportedPages(B); },1000, A-1); }
}

function toggle_command(){
    var x = { true: "Disable Good Old Kongregate on unsupported pages", false:"Enable Good Old Kongregate on unsupported pages" };
    var e = GM_getValue("enable_on_unsupported",false);
    if( GM_info.scriptHandler.toLowerCase()!="greasemonkey" || GM_info.version[0]>3 ){
        GM_unregisterMenuCommand(x[e]);
        registerMenuCommand(x[!e],toggle_command,{id:x[!e],autoClose:false});
    }
    GM_setValue("enable_on_unsupported",!e);
}

var x = { true: "Disable Good Old Kongregate on unsupported pages", false:"Enable Good Old Kongregate on unsupported pages" };
if( GM_info.scriptHandler.toLowerCase()!="greasemonkey" || GM_info.version[0]>3 ){
    registerMenuCommand(x[GM_getValue("enable_on_unsupported",false)],toggle_command,{id:x[GM_getValue("enable_on_unsupported",false)],autoClose:false});
} else{ registerMenuCommand("Enable or disable Good Old Kongregate on unsupported pages",toggle_command,{id:x[GM_getValue("enable_on_unsupported",false)],autoClose:false}); }


function TimeToLogin(active_user){
    function updatePlaylist() {
        if(!active_user.playLatersCount){
            active_user.playLatersCount=function(){ return 0; }
        }
        var e = active_user.playLatersCount();
        Array.from(document.getElementsByClassName("play-laters-count-link")).forEach(function (t) {
            t.title = e + " games in your playlist.";
            t.querySelector(".play-laters-count").innerHTML=e;
        });
    }
    function updateFavorites() {
        var e = active_user.favoritesCount();
        Array.from(document.getElementsByClassName("favorites-count-link")).forEach(function (t) { t.title = e + " favorites."; t.querySelector(".favorites-count").innerHTML=e; });
    }
    function updateFriendInfo(e) {
        Array.from(e.getElementsByClassName("friends_online_count")).forEach(function (e) { e.innerHTML=active_user.friendsOnlineCount(); });
        active_user.friendsOnlineCount() > 0
            ? Array.from(e.getElementsByClassName("friends_online_link")).forEach(function (e) { e.title = active_user.friendsOnlineNames(); })
        : Array.from(e.getElementsByClassName("friends_online_link")).forEach(function (e) { e.title = "No friends online."; });
    }

    var go=0, t = document.getElementById("welcome");
    if(typeof(active_user)!="undefined"){
        if (active_user.isAuthenticated() && t!=null){ go=1;}
    }
    if(go){
        var e = active_user.getAttributes();
        updateFriendInfo(t);
        updatePlaylist();
        updateFavorites();
        var n = document.createElement("img"); n.id = "welcome_box_small_user_avatar"; n.src = e.avatar_url; n.title = e.username; n.name = "user_avatar"; n.alt = "Avatar for " + e.username; n.height = 28; n.width = 28;
        t.querySelector("span#small_avatar_placeholder").innerHTML=""; t.querySelector("span#small_avatar_placeholder").appendChild(n);
        Array.from(t.getElementsByClassName("facebook_nav_item")).forEach(function (e) { active_user.isFacebookConnected() && e.hide(); });
        document.getElementById("mini-profile-level").setAttribute("class", "spritesite levelbug level_" + e.level);
        document.getElementById("mini-profile-level").setAttribute("title", "Level " + e.level);
        active_user.populateUserSpecificLinks(t);
        Array.from(t.getElementsByClassName("username_holder")).forEach(function (e) { e.innerHTML=active_user.username(); });
        var a = active_user.unreadShoutsCount() + active_user.unreadWhispersCount() + active_user.unreadGameMessagesCount();
        if(a > 0){
            document.getElementById("profile_bar_messages").classList.add("alert_messages");
            document.getElementById("profile_control_unread_message_count").innerHTML=a;
            document.getElementById("profile_control_unread_message_count").classList.add("mls","has_messages");
            document.getElementById("my-messages-link").setAttribute("title", active_user.unreadShoutsCount() + " shouts, " + active_user.unreadWhispersCount() + " whispers");
            0 !== active_user.unreadWhispersCount()
                ? document.getElementById("my-messages-link").setAttribute("href", "/accounts/" + active_user.username() + "/private_messages")
                : 0 !== active_user.unreadGameMessagesCount() && document.getElementById("my-messages-link").setAttribute("href", "/accounts/" + active_user.username() + "/game_messages");
        }
        if(null !== active_user.chipsBalance()){ document.getElementById("blocks_balance").innerHTML=active_user.chipsBalance(); }
        document.getElementById("blocks").style.display="";
        document.getElementById("guest_user_welcome_content").style.display="none";
        document.getElementById("nav_welcome_box").style.display="";
    }
    else{ setTimeout(function(){ TimeToLogin(unsafeWindow.active_user); },1); }
}

function ReopenChat(A,holodeck){
    var go=0;
    if(typeof(holodeck)!="undefined" && document.getElementById("chat_tab")!=null){
        if(holodeck.ready){ go=1; }
    }
    if(go){ document.getElementById("chat_tab").style.display="";}
    else if(A){ setTimeout(function(B){ ReopenChat(B,unsafeWindow.holodeck); },1000, A-1); }
}

function fill_games_tab(A,navigationData){
    if(typeof(navigationData)!="undefined"){
        if(navigationData.user.authenticated){
            document.getElementById("GOK_recently_played").setAttribute("href",navigationData.user.recently_played_path);
            var l=navigationData.games.recently_played.length;
            if(l>0){
                document.getElementById("GOK_no_recently_played_game").style.display="none";
                document.getElementById("GOK_recently_played_1").style.display="";
                document.getElementById("GOK1_image").setAttribute("src",navigationData.games.recently_played[0].icon_path);
                document.getElementById("GOK1_name").innerText=navigationData.games.recently_played[0].title;
                document.getElementById("GOK_recently_played_1").setAttribute("href",navigationData.games.recently_played[0].game_path);
                for(let k=1; k<l; k++){
                    document.getElementById("GOK_recently_played_"+(k+1)).setAttribute("href",navigationData.games.recently_played[k].game_path);
                    document.getElementById("GOK_recently_played_"+(k+1)).innerText=navigationData.games.recently_played[k].title;
                    document.getElementById("GOK_recently_played_"+(k+1)).style.display="";
                }
            }
            /*document.getElementById("GOK_playlist").setAttribute("href",navigationData.user.playlist_path);
            var p=navigationData.games.playlist.length;
            if(p>0){
                document.getElementById("GOK_no_playlist").style.display="none";
                document.getElementById("GOK_playlist_1").style.display="";
                document.getElementById("GOK_playlist_1_image").setAttribute("src",navigationData.games.playlist[0].icon_path);
                document.getElementById("GOK_playlist_1_name").innerText=navigationData.games.playlist[0].title;
                document.getElementById("GOK_playlist_1").setAttribute("href",navigationData.games.playlist[0].game_path);
                for(let k=1; k<p; k++){
                    document.getElementById("GOK_playlist_"+(k+1)).setAttribute("href",navigationData.games.playlist[k].game_path);
                    document.getElementById("GOK_playlist_"+(k+1)).innerText=navigationData.games.playlist[k].title;
                    document.getElementById("GOK_playlist_"+(k+1)).style.display="";
                }
            }
            else{ document.getElementById("GOK_no_playlist_text").innerText="Add games to play them later."; }*/
        }
    }
    else if(A){ setTimeout(function(B){ fill_games_tab(B,unsafeWindow.navigationData); },1000, A-1); }
}

function replace_css(remove_new){
    var N=document.head.querySelectorAll('link[rel="stylesheet"]');
    for(let n of N){
        if(n.href.search("gamepage_merged")>-1 && n.getAttribute("data-turbo-track")=="reload"){
            if(remove_new){ n.remove(); }
            let goodKongCSS = document.createElement('link');
            goodKongCSS.rel = 'stylesheet';
            goodKongCSS.setAttribute('data-turbo-track', 'reload');
            goodKongCSS.href = 'https://fancy2209.github.io/KOG/GamePage.css';
            document.head.appendChild(goodKongCSS);
        }
        else if(n.href.search("application_merged")>-1 && n.getAttribute("data-turbo-track")=="reload"){
            if(remove_new){ n.remove(); }
            let goodKongCSS = document.createElement('link');
            goodKongCSS.rel = 'stylesheet';
            goodKongCSS.setAttribute('data-turbo-track', 'reload');
            goodKongCSS.href = 'https://fancy2209.github.io/KOG/Main.css';
            document.head.appendChild(goodKongCSS);
        }
        else if(n.href.search("application-")>-1 && n.getAttribute("data-turbo-track")=="reload"){
            if(remove_new){ n.remove(); }
        }
    }
    // Because Kongregate obviously adds new content (like the medal of the "iron, fire and explosions" quest) with the new styles in mind, some parts of those must be kept.
    var s=document.createElement("style");
    s.innerHTML=`
    img,video {
        max-width: 100%;
        height: auto;
    }
    `;
    document.head.appendChild(s);
}

function replace_favicon(){
    var I=document.head.querySelectorAll('link[rel="icon"]');
    for(let i of I){
        if(i.type=="image/svg+xml"){ i.href = "https://github.com/Fancy2209/Good-Old-Kongregate/raw/main/Icon/icon.svg"; }
        else{ i.href = "https://raw.githubusercontent.com/Fancy2209/Good-Old-Kongregate/main/Icon/kong.png"; }
    }
}

function switch_banner(C){
    var e=document.getElementsByClassName("home_feat_items")[0].getElementsByClassName("focus")[0];
    if(C=="next"){
        e.classList.remove("focus");
        (e.nextElementSibling||e.parentElement.firstElementChild).classList.add("focus");
    }
    else if(C=="previous"){
        e.classList.remove("focus");
        (e.previousElementSibling||e.parentElement.lastElementChild).classList.add("focus");
    }
}

function replace_homepage_banners(node,homepage_primarywrap){
    let pw=document.createElement("div");
    pw.id="primarywrap";
    pw.classList.add("divider");
    let banners=node.getElementsByClassName("home_feat_items")[0].innerHTML;
    pw.innerHTML=homepage_primarywrap;
    node.parentElement.insertBefore(pw, node);
    node.remove();
    document.getElementsByClassName("home_feat_items")[0].innerHTML=banners;
    document.getElementsByClassName("home_feat_nav")[0].getElementsByClassName("prev")[0].addEventListener("click",function(){switch_banner("previous");});
    document.getElementsByClassName("home_feat_nav")[0].getElementsByClassName("next mls")[0].addEventListener("click",function(){switch_banner("next");});
}

function ThingsToDoAtTheEnd(holodeck){
    PutWarningOnUnsupportedPages(50);
    ReopenChat(50,holodeck);
};

(function() {
    'use strict';

    // Find the Things

    const headerWrap = `
    <!--============ #header ============-->
      <div id="header">
        <div id="header_logo">
  <h3 id="playing"><strong>21,236</strong> online playing <strong>128,695</strong> free games!</h3>
  <h2 title="Kongregate">
    <a class="spritesite spriteall" title="Kongregate" id="kong_header_link" href="https://www.kongregate.com/">Kongregate</a>
  </h2>
</div>

        <div id="new_nav_wrapper">

<!-- Welcome Start -->
<div id="welcome">

  <!-- User Welcome Start -->
  <ul id="nav_welcome_box" class="welcome-user" style="display:none">
    <!-- Mini Profile Start -->
    <li class="profile profile_control">
      <a href="https://www.kongregate.com/accounts/Guest">
        <span id="small_avatar_placeholder"></span>
        <span class="username_holder"></span> <span id="mini-profile-level"></span>
      </a>
    </li>
    <!-- Mini Profile End -->
    <!-- Playlist Start -->
    <li class="playlist">
      <a class="play-laters-count-link" href="https://www.kongregate.com/my_playlist">
        <span aria-hidden="true" class="kong_ico mrs">p</span><span class="play-laters-count">0</span>
      </a>
    </li>
    <!-- Playlist End -->
    <!-- Favorites Start -->
    <li class="favorites">
      <a class="favorites-count-link" href="https://www.kongregate.com/accounts/Guest/favorites">
        <span aria-hidden="true" class="kong_ico mrs">l</span><span class="favorites-count">0</span>
      </a>
    </li>
    <!-- Favorites End -->
    <!-- Friends Start -->
    <li class="friends_online friends">
      <a class="friends_online_link" href="https://www.kongregate.com/accounts/Guest/friends">
        <span aria-hidden="true" class="kong_ico mrs">f</span><span class="friends_online_count"></span>
      </a>
    </li>
    <!-- Friends End -->
    <!-- Blocks Start -->
    <li class="blocks" style="display:none" id="blocks">
      <a href="https://www.kongregate.com/accounts/Guest/blocks_transactions">
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 110 110" class="blocks_ico">
              <path fill="#2996CC" d="M99.3.2H33.5c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4L3.2 26.5l-.4.4C1.1 28.7.1 31.1.1 33.6v65.8c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4V10c.1-5.3-4.2-9.7-9.5-9.8h-.2z"></path>
              <path d="M99.2 68.6H33.5c-2.9 0-5.6 1.3-7.5 3.4L3.5 94.6C1.6 96.2.4 98.4.1 100.9c.6 4.9 4.7 8.6 9.7 8.7h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c1.9-1.6 3.1-3.8 3.4-6.3-.5-5-4.7-8.8-9.7-8.8z" opacity=".2"></path>
              <path class="block-ico__optional" d="M30.7 23.4v-6.9c0-.6.4-1 1-1s1 .4 1 1v6.9c0 .6-.4 1-1 1-.5 0-1-.4-1-.9v-.1zm-11.1 69c.2-.2 8.6-8.6 8.8-8.9 2.9-3 4.3-3.7 9.2-3.7h10.1c1.3 0 2-2 0-2h-5.2c-8.5 0-9.8-2.9-9.8-9.8V52.5c0-.6-.4-1-1-1s-1 .4-1 1v21.2c.1 2.5-.7 5-2.3 6.9v.1c-.5.6-1 1.1-1.5 1.6l-8.9 9c-.7.9.5 2.3 1.6 1.1zm-5.9 6c.7-.8.7-.8 1.9-2.2.8-.9-.4-2.5-1.4-1.2-1.4 1.7-1.1 1.3-1.7 2-1.1 1.3.3 2.5 1.2 1.4z" opacity=".3"></path>
              <path fill="#A54942" d="M99.2 19H33.5c-2.9 0-5.6 1.2-7.5 3.4L3.5 44.9C1.6 46.5.4 48.7.1 51.2c.6 4.9 4.7 8.6 9.7 8.7h65.8c2.8 0 5.5-1.2 7.4-3.4L105.5 34c1.9-1.6 3.1-3.8 3.4-6.3-.5-5-4.7-8.7-9.7-8.7z"></path>
              <path fill="#FFB4A3" d="M105.7 33.9L83.2 56.4c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 59.8.2 55.4.2 50v21.3c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.6-3.4 7.4z"></path>
              <path fill="#FFF" d="M69.6 59.8h5.2V81h-5.2V59.8z"></path>
              <path class="block-ico__optional" fill="#FFDDD7" d="M64.7 59.7h2.9v21.2h-2.9V59.7zm-50.7 0h17.6v21.2H14V59.7z"></path>
              <path fill="#FFF" d="M26.7 59.7h2.9v21.2h-2.9z"></path>
              <path fill="#EA8A7A" d="M105.7 33.9L91.5 48.1v21.3l14.2-14.2c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.5-3.4 7.4zM86.9 52.7l-3.7 3.7c-.7.8-1.6 1.5-2.5 2.1v21.3c1-.5 1.8-1.2 2.5-2.1l3.7-3.7V52.7z"></path>
              <path fill="#C16863" d="M105.7 33.9l-3.8 3.8v21.2l3.8-3.8c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.5-3.4 7.4z"></path>
              <path fill="#2996CC" d="M109.1 10c0-5.4-4.4-9.8-9.8-9.8H33.5c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4L3.2 26.5l-.4.4C1.1 28.7.1 31.1.1 33.6V50c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.4-22.5c2.2-1.9 3.4-4.6 3.4-7.4l.2-16.5z" opacity=".8"></path>
              <path fill="#FFF" d="M23.6 102.4c3-.2 4.6-6.1-.8-6.1-3.6 0-8.6-1.7-8.8-4.8-.4-5.9-7-6.5-7 .6.1 12.2 9.1 10.7 16.6 10.3z" opacity=".2"></path>
              <path fill="#FFF" d="M33.2.2c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4-13.7 13.6c-7 6.9 20.9 6.8 32.3 3.5 21.3-6 48.7-.3 51.4-20.2H33.2z" opacity=".27"></path>
              <path fill="#FFF" d="M81.7 86.8c.6 0 1 .4 1 1V92c0 .6-.4 1-1 1s-1-.4-1-1v-4.2c0-.6.4-1 1-1zm-1 9.8V96c0-.6.4-1 1-1s1 .4 1 1v.7c0 .6-.4 1-1 1s-1-.5-1-1.1zm12.2-77.8c2.3-2.2 4.4-4.6 6.4-7.1.7-.9-.3-2.5-1.4-1.2-2.2 2.6-5.3 5.4-6.2 7s.2 2.2 1.2 1.3zM26.1 27h12.8c.6 0 1 .4 1 1s-.4 1-1 1H26.1c-.6 0-1-.4-1-1 0-.5.4-1 .9-1h.1zm-5.2 0h1.3c.6 0 1 .4 1 1s-.4 1-1 1h-1.3c-.6 0-1-.4-1-1 0-.5.4-1 .9-1h.1z" opacity=".55"></path>
              <path fill="#FFF" d="M85.6 22.7C82.2 26.2 81 27 75.8 27H45c-1.3 0-2 2 0 2h25.8c8.5 0 9.8 2.9 9.8 9.8v13.7c0 .6.4 1 1 1s1-.4 1-1V33.2c-.1-2.5.7-5 2.3-6.9v-.1c.5-.5 1.6-1.8 2.2-2.5.8-.8-.4-2.2-1.5-1z" opacity=".61"></path>
              <g class="block-ico__optional">
                  <path d="M55.5 100.9c14.7 1.9 34.3-24.6-3.9-17.1-11 2.2-22.8 13.7 3.9 17.1z" opacity=".14"></path>
                  <circle cx="100" cy="73" r="1.6" fill="#FFF" opacity=".35"></circle>
                  <path fill="#FFF" d="M9.4 59.7h2v21.2h-2z"></path>
                  <path fill="#FFF" d="M105.7 33.9L83.2 56.4c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 59.8.2 55.4.2 50v2c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4v-2c0 2.9-1.2 5.6-3.4 7.4z"></path>
                  <path fill="#A54942" d="M105.7 53.5L83.2 76c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 79.4.2 75 .2 69.6v2c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.5-4.6 3.4-7.5v-2c.1 2.9-1.2 5.6-3.4 7.5z"></path>
                  <path fill="#FFF" d="M33.7 85.7l.8 1.5 1.4.8-1.4.8-.8 1.4-.8-1.4-1.4-.8 1.4-.8.8-1.5zm32.4 3.4l.9 1.8 1.8 1-1.8.9-.9 1.9-1-1.9-1.8-.9 1.8-1 1-1.8zm25.5-14.2l.7 1.5 1.5.8-1.5.8-.7 1.4-.8-1.4-1.5-.8 1.5-.8.8-1.5zM32 35.2l2 3.7 3.7 2.2-3.7 2-2 3.9-2.2-3.9-3.7-2 3.7-2.2 2.2-3.7z"></path>
                  <circle cx="52.3" cy="6.6" r="1.2" fill="#FFF" opacity=".37"></circle>
                  <circle cx="66" cy="47.8" r="3.1" fill="#FFF" opacity=".35"></circle>
                  <circle cx="48.5" cy="39.8" r="2.1" fill="#FFF" opacity=".35"></circle>
                  <path fill="#FFF" d="M36.2 6c-5.3.7-11.4 4.6-8.6 9.1s9.7-.5 14-3.4S55.2 3.5 36.2 6z" opacity=".37"></path>
                  <path fill="#FFF" d="M84.5 12.5c-18.1-.2-9.1 4.5-5.2 4.5 5.5-.1 11.5.7 11.2 6.3-.6 8.8 8.7 11.5 9.4.9.6-8-4.1-11.6-15.4-11.7z" opacity=".14"></path>
                  <path fill="#FFF" d="M88.6 5.3l.8 1.4 1.4.9-1.4.7-.8 1.5-.8-1.5-1.4-.7 1.4-.9.8-1.4z"></path>
                  <path fill="#FFF" d="M7.4 38.1c.6 0 1 .4 1 1v8.8c0 .6-.4 1-1 1s-1-.4-1-1v-8.8c.1-.5.5-.9 1-1z" opacity=".7"></path>
                  <path fill="#FFF" d="M65 15.5l.9 1.5 1.6 1-1.6.8-.9 1.7-.9-1.7-1.6-.8 1.6-1 .9-1.5z"></path>
                  <path fill="#FFF" d="M1.1 47.3c-.4 0-.8-.4-.8-.8v-5.2c-.1-.4.3-.8.7-.9.4 0 .9.3.9.7v5.4c.1.4-.3.8-.8.8zm0-9.7c-.4 0-.8-.4-.8-.8v-3.5c0-2.6 1-5.1 2.7-7l.1-.1.4-.4L26.2 3.2l.4-.4.1-.1.1-.1C28.7.9 31.2 0 33.7 0h9.8c.4 0 .8.3.8.8 0 .4-.4.8-.8.8h-9.8c-2.1 0-4.2.8-5.8 2.2l-.1.1-.1.1-.4.4L4.7 27c-.1.1-.3.2-.4.4C2.8 29 2 31.2 2 33.4v3.5c-.1.4-.5.8-.9.7zm53.5-36h-6.1c-.4 0-.8-.4-.8-.8s.3-.8.8-.8h6.1c.4 0 .8.3.8.8.1.5-.3.8-.8.8zm53.9 9.6c-.4 0-.8-.3-.8-.8 0-4.9-3.9-8.8-8.8-8.8H60.7c-.4 0-.8-.4-.8-.8s.4-.8.8-.8h38.2c5.7 0 10.4 4.7 10.4 10.4 0 .4-.4.8-.8.8zm0 10.5c-.4 0-.8-.4-.8-.8v-6c0-.4.4-.8.8-.8s.8.4.8.8v6c0 .4-.4.8-.8.8z" opacity=".6"></path>
                  <circle cx="46.8" cy="86.7" r="1.6" fill="#FFF" opacity=".35"></circle>
                  <path fill="#FFF" d="M7.4 84.6c.6 0 1 .4 1 1v12.7c0 .6-.4 1-1 1s-1-.4-1-1V85.5c.1-.5.5-.9 1-.9z" opacity=".7"></path>
                  <path fill="#FFF" d="M54.2 103.8c0 .6-.4 1-1 1H40.5c-.6 0-1-.4-1-1s.4-1 1-1h12.7c.5 0 1 .5 1 1zm7.8 0c0 .6-.4 1-1 1h-2.9c-.6 0-1-.4-1-1s.4-1 1-1H61c.5 0 1 .5 1 1z" opacity=".76"></path>
                  <path d="M108.5 68.8c-.4 0-.8-.3-.8-.8V57.5c0-.4.4-.8.8-.8s.8.4.8.8V68c0 .4-.3.8-.8.8zm-24.4 36.3c-.2 0-.4-.1-.6-.2-.3-.3-.3-.8 0-1.1l21-21c2-1.7 3.1-4.2 3.2-6.8v-1.6c0-.4.4-.8.8-.8s.8.4.8.8V76c0 3.1-1.4 6-3.7 8l-21 21c-.2 0-.3.1-.5.1zm-9 4.9h-9c-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8h9c1.7 0 3.3-.5 4.7-1.4.4-.2.9-.2 1.1.2.2.4.2.9-.2 1.1l-.1.1c-1.6 1-3.6 1.6-5.5 1.6zm-13.7 0H10.6C4.8 110 0 105.2 0 99.4v-6.2c0-.4.4-.8.8-.8s.8.4.8.8v6.2c0 5 4 9 9 9h50.8c.4 0 .8.4.8.8s-.4.8-.8.8z" opacity=".4"></path>
                  <path fill="#FFF" d="M1.1 68.8c-.4 0-.8-.3-.8-.8v-6.1c-.1-.4.3-.8.7-.9.4 0 .9.3.9.7V68c.1.5-.3.8-.8.8.1 0 .1.1 0 0z"></path>
                  <path fill="#A54942" d="M108.4 46c-.4 0-.8-.4-.8-.8v-8.8c0-.4.4-.8.8-.8s.8.3.8.8v8.8c0 .4-.3.8-.8.8z"></path>
              </g>
          </svg>
          <span id="blocks_balance"></span>
          </a>
      </li>
    <!-- Blocks End -->
    <!-- Messages Start -->
    <li class="messages">
      <a class="my-messages" id="my-messages-link" href="https://www.kongregate.com/accounts/Guest/messages">
          <span id="profile_bar_messages"><span aria-hidden="true" class="kong_ico">m</span><span id="profile_control_unread_message_count" class="msg-count"></span></span>
      </a>
    </li>
    <!-- Messages End -->
    <!-- Settings Start -->
    <li class="settings profile_control">
      <span aria-hidden="true" class="kong_ico">s</span>
      <ul>
        <li>
          <a href="https://www.kongregate.com/accounts/Guest/edit">Settings</a>
        </li>
        <li>
          <a id="welcome_box_sign_out" href="#" onclick="signoutFromSite(); return false;">Sign Out</a>
          <script>
//<![CDATA[
            function signoutFromSite() {
              $('welcome_box_sign_out_indicator').show();
              $('welcome_box_sign_out').hide();

              var fb_uid = active_user.getAttributes().facebook_uid,
                  fb_auth_response = fb_uid && FB.getAuthResponse();

              if (fb_auth_response && fb_auth_response.userID == fb_uid) {
                FB.logout(function() { signoutFromSite(); });
                return false;
              }

              new Ajax.Request("/session", {
                method: 'delete',
                onComplete: function(request) {
                  var newLoc = request.responseJSON.path;

                  if (newLoc != document.location) {
                    document.location = newLoc;
                  } else {
                    document.location.reload();
                  }
                }
              });

              return false;
            }

//]]>
</script>          <span id="welcome_box_sign_out_indicator" class="spinner spinner_inverse" style="display:none" title="loading…">​</span>
        </li>
      </ul>
    </li>
    <!-- Settings End -->
  </ul>
  <!-- User Welcome End -->

  <!-- Guest Welcome Start -->
  <div id="guest_user_welcome_content" class="welcome-guest regtextSml" style="">
    <form id="nav_sign_in" onsubmit="if(window.DynamicFrameTarget){ new DynamicFrameTarget({form: this, callback: user_status.sessionStatus});}" action="https://www.kongregate.com/session" accept-charset="UTF-8" method="post"><input name="utf8" type="hidden" value="✓"><input type="hidden" name="authenticity_token" value="77llzYUs1GeOeyMF4wdShlHR+fDWMl3KmcMapfIKat8zBrqQCLbgDSecN02WbGgiVl1dJFiFwYO044rAKkJRDg==">

      <input type="hidden" name="from_welcome_box" id="from_welcome_box" value="true">
      <a title="Sign in with Facebook" class="facebook_signin_small sprite_facebook mrs" onclick="new FacebookAuthenticator({}); return false;" href="#">Sign in</a>
      <strong><a class="js-activate-inline-registration" href="#">Register</a></strong>
      or
      <label for="welcome_username_label">Sign in:</label>
      <span class="fields">
        <span class="field">
          <label id="welcome_username_label" for="welcome_username" class="text_label" style="">Username or email</label>
          <input type="text" name="username" id="welcome_username" value="" title="Username or email" tabindex="3" class="text_field">
        </span>
        <span class="field">
          <label id="welcome_password_label" for="welcome_password" class="text_label" style="">Password</label>
          <input type="password" name="password" id="welcome_password" value="" title="Password" tabindex="4" class="text_field">
        </span>
        <input type="submit" value="Sign In" tabindex="5" id="welcome_box_sign_in_button" class="submit spriteall spritesite" onclick="try{}catch(e){};if(!this.elem_welcome_box_sign_in_button){this.elem_welcome_box_sign_in_button=$('welcome_box_sign_in_button');this.spin_welcome_box_sign_in_button=$('welcome_box_sign_in_button_spinner');this.restore=function(t){return function(){t.elem_welcome_box_sign_in_button.show();t.spin_welcome_box_sign_in_button.hide();Event.stopObserving(window, 'unload', t.restore);}}(this);}this.elem_welcome_box_sign_in_button.hide();this.spin_welcome_box_sign_in_button.show();Event.observe(window, 'unload', this.restore);" data-disable-with="Sign In"><span id="welcome_box_sign_in_button_spinner" class="spinner spinner_inverse" style="display:none" title="loading…">​</span>
        <span id="remember_holder" style="display:none;">
          <input type="checkbox" name="remember_me" id="welcome_remember_me" value="true" class="imgMini" tabindex="6" checked="checked"> <label for="welcome_remember_me" id="welcome_remember_label" class="bd">Remember me</label>
        </span>
        <span id="forgot_holder" style="display:none;">
          <a class="password_recovery" tabindex="7" href="#" onclick="active_user.activatePasswordRecovery();; return false;">Forgot password?</a>
        </span>
      </span>
</form>  </div>
  <!-- Guest Welcome End -->

</div>
<!-- Welcome End -->


  <ul class="main_navigation js-nav">
    <!-- Start Games -->
<li id="main_nav_games" class="main_nav_item guest">
  <a class="main_nav_top_item" href="https://www.kongregate.com/games">Games</a>
  <div class="main_nav_menu" style="left: -663.433px; width: 1696px;"><div class="main_nav_menu_inner">

  <!-- Recent Games Start -->
  <div id="main_nav_games_im_playing" class="main_nav_category my_games_block mrl">
    <strong class="game_block_link">
  <a id="GOK_recently_played" href="https://www.kongregate.com/games" data-metric-tracker="js-wa-tc-Navigation-Recently_Played"><tr8n translation_key_id="7532" id="4807e18418b9a568274a246a5cf46b5d">Recently Played »</tr8n></a>
</strong>

       <a id="GOK_no_recently_played_game" class="no_games_block" href="https://www.kongregate.com/games">
        <span class="plus kong_ico" aria-hidden="true">+</span>
        <strong class="title"><tr8n translation_key_id="4682" id="d55e2658c6436b84daaf2004789d2023">Recently Played Games</tr8n></strong>
        <span class="desc"><tr8n translation_key_id="7429" id="2042ef2dfbc1df02c574f00b2063a484">Start playing now.</tr8n></span>
      </a>

      <a id="GOK_recently_played_1" href="" class="main mbs" data-metric-tracker="js-wa-tc-Navigation-Recently_Played" style="display:none">
         <span class="game_icon"><img id="GOK1_image" alt="" src=""></span>
         <span id="GOK1_name" class="name truncate_one_line"></span>
      </a>

      <a id="GOK_recently_played_2" href="" class="truncate extra js-wa-tc-Navigation-Recently_Played" style="display:none"></a>

      <a id="GOK_recently_played_3" href="" class="truncate extra js-wa-tc-Navigation-Recently_Played" style="display:none"></a>

  </div>
  <!-- Recent Games End -->
  <!-- Recommended Games Start -->
  <div id="main_nav_recommended_games" class="main_nav_category my_games_block mrl" style="display:null; visibility:hidden">
    <strong class="game_block_link">
      <a href="" data-metric-tracker="js-wa-tc-Navigation-Recommended"><tr8n translation_key_id="7430" id="47a7290cf0c4e3789335f6f622a9fd4c">My Recommended »</tr8n></a>
    </strong>

      <a class="no_games_block" href="https://www.kongregate.com/games">
        <span class="plus kong_ico" aria-hidden="true">+</span>
        <strong class="title"><tr8n translation_key_id="4682" id="d55e2658c6436b84daaf2004789d2023">Recommended Games</tr8n></strong>
        <span class="desc"><tr8n translation_key_id="7429" id="2042ef2dfbc1df02c574f00b2063a484">Start playing now.</tr8n></span>
      </a>

  </div>
  <!-- Recommended Games End -->
  <!-- Playlist Games Start -->
  <div id="main_nav_my_playlist" class="main_nav_category my_games_block mrl">
    <strong class="game_block_link">
      <a id="GOK_playlist" href="#" class="js-wa-tc-Navigation-Playlist"><tr8n translation_key_id="7431" id="d09ef4787d5e3c0182b7048923d4f3da">My Playlist »</tr8n></a>
    </strong>
    <a id="GOK_no_playlist" class="no_games_block js-activate-inline-registration" href="#">
      <span class="plus kong_ico" aria-hidden="true">+</span>
      <strong class="title"><span class="icon kong_ico" aria-hidden="true">p</span> <tr8n translation_key_id="6448" id="6ffe6d4f4800e3db93218cc72e5ef57d">My Playlist</tr8n></strong>
      <span id="GOK_no_playlist_text" class="desc"><tr8n translation_key_id="7432" id="0d41cf5977b5fa2c321f4b936fd2e377">Register to save games to play later.</tr8n></span>
    </a>
    <a id="GOK_playlist_1" href="" class="main mbs" data-metric-tracker="js-wa-tc-Navigation-Recently_Played" style="display:none">
         <span class="game_icon"><img id="GOK_playlist_1_image" alt="" src=""></span>
         <span id="GOK_playlist_1_name" class="name truncate_one_line"></span>
      </a>
    <a id="GOK_playlist_2" href="" class="truncate extra js-wa-tc-Navigation-Recently_Played" style="display:none"></a>
    <a id="GOK_playlist_3" href="" class="truncate extra js-wa-tc-Navigation-Recently_Played" style="display:none"></a>
  </div>
  <!-- Playlist Games End -->

  <!-- Categories Start -->
<dl id="main_nav_games_categories" class="main_nav_category">
  <dt class="main_nav_category_title pbs"><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/games"><tr8n translation_key_id="4807" id="2862bedfd879c3e77bcf3c6f7e316c64">Categories</tr8n></a></dt>
  <dd class="mtm">
    <ul class="main_nav_category_list">
      <li class="featured"><a data-metric-tracker="js-wa-tc-Navigation-Feature" href="https://www.kongregate.com/top-rated-games"><tr8n translation_key_id="4828" id="d760a8e9c05f22489e400f153123ea74">Top Rated</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/action-games"><tr8n translation_key_id="4675" id="7de879de63eac1879d6b22a01629d8b8">Action</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/multiplayer-games"><tr8n translation_key_id="4676" id="6fc7cdec9e54d4dc28874899ce6f3282">Multiplayer</tr8n></a></li>
      <li class="featured"><a data-metric-tracker="js-wa-tc-Navigation-Feature" href="https://www.kongregate.com/top-rated-games?sort=newest"><tr8n translation_key_id="8261" id="1dc823e083cd4aa6f232df5b735cb48f">Hot New</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/mmo-games"><tr8n translation_key_id="4815" id="6a828d3342cb6db551dec15b122dc248">MMO</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/adventure-rpg-games"><tr8n translation_key_id="5183" id="e134b45f61a33f4231408c64ff4eb1a2">Adventure &amp; RPG</tr8n></a></li>
      <li class="featured">

          <a data-metric-tracker="js-wa-tc-Navigation-Feature" class="js-activate-inline-registration" href="#">
            <span><tr8n translation_key_id="4827" id="c9282553bdba249264f8036eb2028fa2">My Favorites</tr8n></span>
          </a>

      </li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/strategy-defense-games"><tr8n translation_key_id="5181" id="8fba9d10e45c3816fa83ed3a98f79c24">Strategy &amp; Defense</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/shooter-games"><tr8n translation_key_id="4672" id="9a9a0e97bf92631df74b693c6135186e">Shooter</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/idle-games"><tr8n translation_key_id="4878" id="b025742cae655e6ca5b1b64e217ecfa1">Idle</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/upgrades-games"><tr8n translation_key_id="4708" id="8d2564251030e2620672229fd1e48a8e">Upgrades</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/tower-defense-games"><tr8n translation_key_id="4763" id="cc86fa28967243b8c989ff0a1563075f">Tower Defense</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/sports-racing-games"><tr8n translation_key_id="6769" id="1782db50f2860b6a686db1688b7c9126">Sports/Racing</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/5-minute-games"><tr8n translation_key_id="4913" id="9728c0927120cc818a1f472fa4039ac9">5 Minute</tr8n></a></li>
      <li class="more"><a data-metric-tracker="js-wa-tc-Navigation-Categories" href="https://www.kongregate.com/games"><tr8n translation_key_id="7427" id="b53d385fbd99e2f1e3ed3b3697890cbd">More Categories</tr8n></a></li>
    </ul>
  </dd>
  <dd class="main_nav_sub">
    <p class="main_nav_sub_title mbs"><em><tr8n translation_key_id="8262" id="2859792c0789a0161121358f8d091211">For Developers:</tr8n></em></p>
    <ul class="main_nav_sub_links">
      <li><a data-metric-tracker="js-wa-tc-Navigation-Developers" href="https://www.kongregate.com/games/new"><tr8n translation_key_id="8263" id="f588fd0640156fb6b9a7de8ae8000f0e">Upload your game</tr8n></a></li>
      <li><a data-metric-tracker="js-wa-tc-Navigation-Developers" href="https://developers.kongregate.com/" target="_blank"><tr8n translation_key_id="7426" id="ab4bc56938c0b465ebde30e946f9fab3">Developers Center</tr8n></a></li>
    </ul>
  </dd>
</dl>
<!-- Categories End -->
</div></div>
</li>
<!-- End Games -->

    <!-- Start Achievements -->
<li id="main_nav_achievements" class="main_nav_item guest">
  <a class="main_nav_top_item" href="https://www.kongregate.com/badges">Achievements</a>
  <div class="main_nav_menu" style="left: -663.433px; width: 1696px;"><div class="main_nav_menu_inner"></div></div>
</li>
<!-- End Achievements -->

    <!-- Start My Kong -->
<li id="main_nav_mykong" class="main_nav_item guest">
  <a class="main_nav_top_item" href="https://www.kongregate.com/community">My Kong</a>
  <div class="main_nav_menu" style="left: -663.433px; width: 1696px;">
  <div class="main_nav_menu_inner">
  <!-- Account Info Start -->
  <dl id="main_nav_mykong_activity" class="main_nav_category mrl">
    <dt class="main_nav_category_title pbs"><tr8n translation_key_id="7446" id="85519d4cd4c1ead401d71f1858bceacb">Trending with Friends</tr8n></dt>
    <dd id="main_nav_activity_upsell" class="mtm">
      <p><strong><tr8n translation_key_id="5199" id="fe64e4ecfe0910330496613639d3db60">Activity Feed</tr8n></strong></p>
      <p class="media regtextLrg">
        <span class="img kong_ico" aria-hidden="true">g</span>
        <span class="bd"><a href="#" class="js-activate-inline-registration"><tr8n translation_key_id="5167" id="be74407479cbeb47bda87703c271b676">Register</tr8n></a><tr8n translation_key_id="7447" id="cca66629ddc45d5fc515c8c815cf244a"> or </tr8n><a href="#" class="js-activate-inline-login"><tr8n translation_key_id="7448" id="9c0695235a34d0a39eaad64474598f49">sign in</tr8n></a><tr8n translation_key_id="7449" id="2a43f38813add6736d2835dcaf51a230"> to start receiving activity updates from around Kongregate!</tr8n></span>
      </p>
    </dd>
  </dl>
  <!-- Account Info End -->
  <!-- Forums Start -->
  <dl id="main_nav_mykong_forums" class="main_nav_category">
    <dt class="main_nav_category_title pbs"><a href="https://www.kongregate.com/forums"><tr8n translation_key_id="7903" id="0407960c13a31fbf9f8d2b3e256a6f8d">Forums »</tr8n></a></dt>
    <dd class="mtm">
      <ul class="main_nav_category_list">
        <li><a data-metric-tracker="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums/1-kongregate">Kongregate</a></li>
<li><a data-metric-tracker="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums/games">Game Forums</a></li>
<li><a data-metric-tracker="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums/3-general-gaming">General Gaming</a></li>
<li><a data-metric-tracker="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums/7-technical-support">Tech Support</a></li>
<li><a data-metric-tracker="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums/4-game-programming">Game Development</a></li>
        <li class="more"><a class="js-wa-tc-Navigation-Forums" href="https://www.kongregate.com/forums">All Forums</a></li>
      </ul>
    </dd>
  </dl>
  <!-- Forums End -->
</div>
</div>
</li>
<!-- End My Kong -->

    <!-- Start Dev -->
<li id="main_nav_dev" class="main_nav_item has-bounty-link guest">
  <a class="main_nav_top_item" href="https://developers.kongregate.com/">Dev</a>
  <div class="main_nav_menu" style="left: -663.433px; width: 1696px;">
    <div class="main_nav_menu_inner">
      <ul class="nav--dev-links">
        <li>
          <h3>Host Your Game on Kongregate</h3>
          <p class="mbm">An open platform for all web games! Get your games in front of thousands of users while monetizing through ads and virtual goods.</p>
          <p>Find <a href="https://docs.kongregate.com/">documentation and support</a> to get you started.</p>
          <a class="nav--dev-btn" href="https://www.kongregate.com/games/new">Upload Your Game</a>
        </li>
        <li>
          <h3>Our Publishing Program</h3>
          <p class="mbm">With our publishing program, we can help get your games to millions of users on multiple platforms!</p><p>
          </p><p>Also check our <a href="https://blog.kongregate.com/">developers blog</a>, where we publish new content weekly on game/data analysis, engineering and design insights, and more.</p>
          <a class="nav--dev-btn" href="https://developers.kongregate.com/">Visit Our Developers Site</a>
        </li>
        <li class="nav-dev-blocks">
          <a class="nav-dev-blocks__link" href="https://www.kongregate.com/badge_bounties">
            <strong class="nav-dev-blocks__label mam">
              Set <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 110 110" class="block-ico block-ico--simple">
  <path fill="#2996CC" d="M99.3.2H33.5c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4L3.2 26.5l-.4.4C1.1 28.7.1 31.1.1 33.6v65.8c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4V10c.1-5.3-4.2-9.7-9.5-9.8h-.2z"></path>
  <path d="M99.2 68.6H33.5c-2.9 0-5.6 1.3-7.5 3.4L3.5 94.6C1.6 96.2.4 98.4.1 100.9c.6 4.9 4.7 8.6 9.7 8.7h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c1.9-1.6 3.1-3.8 3.4-6.3-.5-5-4.7-8.8-9.7-8.8z" opacity=".2"></path>
  <path class="block-ico__optional" d="M30.7 23.4v-6.9c0-.6.4-1 1-1s1 .4 1 1v6.9c0 .6-.4 1-1 1-.5 0-1-.4-1-.9v-.1zm-11.1 69c.2-.2 8.6-8.6 8.8-8.9 2.9-3 4.3-3.7 9.2-3.7h10.1c1.3 0 2-2 0-2h-5.2c-8.5 0-9.8-2.9-9.8-9.8V52.5c0-.6-.4-1-1-1s-1 .4-1 1v21.2c.1 2.5-.7 5-2.3 6.9v.1c-.5.6-1 1.1-1.5 1.6l-8.9 9c-.7.9.5 2.3 1.6 1.1zm-5.9 6c.7-.8.7-.8 1.9-2.2.8-.9-.4-2.5-1.4-1.2-1.4 1.7-1.1 1.3-1.7 2-1.1 1.3.3 2.5 1.2 1.4z" opacity=".3"></path>
  <path fill="#A54942" d="M99.2 19H33.5c-2.9 0-5.6 1.2-7.5 3.4L3.5 44.9C1.6 46.5.4 48.7.1 51.2c.6 4.9 4.7 8.6 9.7 8.7h65.8c2.8 0 5.5-1.2 7.4-3.4L105.5 34c1.9-1.6 3.1-3.8 3.4-6.3-.5-5-4.7-8.7-9.7-8.7z"></path>
  <path fill="#FFB4A3" d="M105.7 33.9L83.2 56.4c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 59.8.2 55.4.2 50v21.3c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.6-3.4 7.4z"></path>
  <path fill="#FFF" d="M69.6 59.8h5.2V81h-5.2V59.8z"></path>
  <path class="block-ico__optional" fill="#FFDDD7" d="M64.7 59.7h2.9v21.2h-2.9V59.7zm-50.7 0h17.6v21.2H14V59.7z"></path>
  <path fill="#FFF" d="M26.7 59.7h2.9v21.2h-2.9z"></path>
  <path fill="#EA8A7A" d="M105.7 33.9L91.5 48.1v21.3l14.2-14.2c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.5-3.4 7.4zM86.9 52.7l-3.7 3.7c-.7.8-1.6 1.5-2.5 2.1v21.3c1-.5 1.8-1.2 2.5-2.1l3.7-3.7V52.7z"></path>
  <path fill="#C16863" d="M105.7 33.9l-3.8 3.8v21.2l3.8-3.8c2.2-1.9 3.4-4.6 3.4-7.4V26.5c0 2.8-1.2 5.5-3.4 7.4z"></path>
  <path fill="#2996CC" d="M109.1 10c0-5.4-4.4-9.8-9.8-9.8H33.5c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4L3.2 26.5l-.4.4C1.1 28.7.1 31.1.1 33.6V50c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.4-22.5c2.2-1.9 3.4-4.6 3.4-7.4l.2-16.5z" opacity=".8"></path>
  <path fill="#FFF" d="M23.6 102.4c3-.2 4.6-6.1-.8-6.1-3.6 0-8.6-1.7-8.8-4.8-.4-5.9-7-6.5-7 .6.1 12.2 9.1 10.7 16.6 10.3z" opacity=".2"></path>
  <path fill="#FFF" d="M33.2.2c-2.4 0-4.7.9-6.5 2.5l-.2.2-.4.4-13.7 13.6c-7 6.9 20.9 6.8 32.3 3.5 21.3-6 48.7-.3 51.4-20.2H33.2z" opacity=".27"></path>
  <path fill="#FFF" d="M81.7 86.8c.6 0 1 .4 1 1V92c0 .6-.4 1-1 1s-1-.4-1-1v-4.2c0-.6.4-1 1-1zm-1 9.8V96c0-.6.4-1 1-1s1 .4 1 1v.7c0 .6-.4 1-1 1s-1-.5-1-1.1zm12.2-77.8c2.3-2.2 4.4-4.6 6.4-7.1.7-.9-.3-2.5-1.4-1.2-2.2 2.6-5.3 5.4-6.2 7s.2 2.2 1.2 1.3zM26.1 27h12.8c.6 0 1 .4 1 1s-.4 1-1 1H26.1c-.6 0-1-.4-1-1 0-.5.4-1 .9-1h.1zm-5.2 0h1.3c.6 0 1 .4 1 1s-.4 1-1 1h-1.3c-.6 0-1-.4-1-1 0-.5.4-1 .9-1h.1z" opacity=".55"></path>
  <path fill="#FFF" d="M85.6 22.7C82.2 26.2 81 27 75.8 27H45c-1.3 0-2 2 0 2h25.8c8.5 0 9.8 2.9 9.8 9.8v13.7c0 .6.4 1 1 1s1-.4 1-1V33.2c-.1-2.5.7-5 2.3-6.9v-.1c.5-.5 1.6-1.8 2.2-2.5.8-.8-.4-2.2-1.5-1z" opacity=".61"></path>
  <g class="block-ico__optional">
    <path d="M55.5 100.9c14.7 1.9 34.3-24.6-3.9-17.1-11 2.2-22.8 13.7 3.9 17.1z" opacity=".14"></path>
    <circle cx="100" cy="73" r="1.6" fill="#FFF" opacity=".35"></circle>
    <path fill="#FFF" d="M9.4 59.7h2v21.2h-2z"></path>
    <path fill="#FFF" d="M105.7 33.9L83.2 56.4c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 59.8.2 55.4.2 50v2c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.4-4.6 3.4-7.4v-2c0 2.9-1.2 5.6-3.4 7.4z"></path>
    <path fill="#A54942" d="M105.7 53.5L83.2 76c-1.9 2.2-4.6 3.4-7.4 3.4H10C4.6 79.4.2 75 .2 69.6v2c0 5.4 4.4 9.8 9.8 9.8h65.8c2.8 0 5.5-1.2 7.4-3.4l22.5-22.5c2.2-1.9 3.5-4.6 3.4-7.5v-2c.1 2.9-1.2 5.6-3.4 7.5z"></path>
    <path fill="#FFF" d="M33.7 85.7l.8 1.5 1.4.8-1.4.8-.8 1.4-.8-1.4-1.4-.8 1.4-.8.8-1.5zm32.4 3.4l.9 1.8 1.8 1-1.8.9-.9 1.9-1-1.9-1.8-.9 1.8-1 1-1.8zm25.5-14.2l.7 1.5 1.5.8-1.5.8-.7 1.4-.8-1.4-1.5-.8 1.5-.8.8-1.5zM32 35.2l2 3.7 3.7 2.2-3.7 2-2 3.9-2.2-3.9-3.7-2 3.7-2.2 2.2-3.7z"></path>
    <circle cx="52.3" cy="6.6" r="1.2" fill="#FFF" opacity=".37"></circle>
    <circle cx="66" cy="47.8" r="3.1" fill="#FFF" opacity=".35"></circle>
    <circle cx="48.5" cy="39.8" r="2.1" fill="#FFF" opacity=".35"></circle>
    <path fill="#FFF" d="M36.2 6c-5.3.7-11.4 4.6-8.6 9.1s9.7-.5 14-3.4S55.2 3.5 36.2 6z" opacity=".37"></path>
    <path fill="#FFF" d="M84.5 12.5c-18.1-.2-9.1 4.5-5.2 4.5 5.5-.1 11.5.7 11.2 6.3-.6 8.8 8.7 11.5 9.4.9.6-8-4.1-11.6-15.4-11.7z" opacity=".14"></path>
    <path fill="#FFF" d="M88.6 5.3l.8 1.4 1.4.9-1.4.7-.8 1.5-.8-1.5-1.4-.7 1.4-.9.8-1.4z"></path>
    <path fill="#FFF" d="M7.4 38.1c.6 0 1 .4 1 1v8.8c0 .6-.4 1-1 1s-1-.4-1-1v-8.8c.1-.5.5-.9 1-1z" opacity=".7"></path>
    <path fill="#FFF" d="M65 15.5l.9 1.5 1.6 1-1.6.8-.9 1.7-.9-1.7-1.6-.8 1.6-1 .9-1.5z"></path>
    <path fill="#FFF" d="M1.1 47.3c-.4 0-.8-.4-.8-.8v-5.2c-.1-.4.3-.8.7-.9.4 0 .9.3.9.7v5.4c.1.4-.3.8-.8.8zm0-9.7c-.4 0-.8-.4-.8-.8v-3.5c0-2.6 1-5.1 2.7-7l.1-.1.4-.4L26.2 3.2l.4-.4.1-.1.1-.1C28.7.9 31.2 0 33.7 0h9.8c.4 0 .8.3.8.8 0 .4-.4.8-.8.8h-9.8c-2.1 0-4.2.8-5.8 2.2l-.1.1-.1.1-.4.4L4.7 27c-.1.1-.3.2-.4.4C2.8 29 2 31.2 2 33.4v3.5c-.1.4-.5.8-.9.7zm53.5-36h-6.1c-.4 0-.8-.4-.8-.8s.3-.8.8-.8h6.1c.4 0 .8.3.8.8.1.5-.3.8-.8.8zm53.9 9.6c-.4 0-.8-.3-.8-.8 0-4.9-3.9-8.8-8.8-8.8H60.7c-.4 0-.8-.4-.8-.8s.4-.8.8-.8h38.2c5.7 0 10.4 4.7 10.4 10.4 0 .4-.4.8-.8.8zm0 10.5c-.4 0-.8-.4-.8-.8v-6c0-.4.4-.8.8-.8s.8.4.8.8v6c0 .4-.4.8-.8.8z" opacity=".6"></path>
    <circle cx="46.8" cy="86.7" r="1.6" fill="#FFF" opacity=".35"></circle>
    <path fill="#FFF" d="M7.4 84.6c.6 0 1 .4 1 1v12.7c0 .6-.4 1-1 1s-1-.4-1-1V85.5c.1-.5.5-.9 1-.9z" opacity=".7"></path>
    <path fill="#FFF" d="M54.2 103.8c0 .6-.4 1-1 1H40.5c-.6 0-1-.4-1-1s.4-1 1-1h12.7c.5 0 1 .5 1 1zm7.8 0c0 .6-.4 1-1 1h-2.9c-.6 0-1-.4-1-1s.4-1 1-1H61c.5 0 1 .5 1 1z" opacity=".76"></path>
    <path d="M108.5 68.8c-.4 0-.8-.3-.8-.8V57.5c0-.4.4-.8.8-.8s.8.4.8.8V68c0 .4-.3.8-.8.8zm-24.4 36.3c-.2 0-.4-.1-.6-.2-.3-.3-.3-.8 0-1.1l21-21c2-1.7 3.1-4.2 3.2-6.8v-1.6c0-.4.4-.8.8-.8s.8.4.8.8V76c0 3.1-1.4 6-3.7 8l-21 21c-.2 0-.3.1-.5.1zm-9 4.9h-9c-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8h9c1.7 0 3.3-.5 4.7-1.4.4-.2.9-.2 1.1.2.2.4.2.9-.2 1.1l-.1.1c-1.6 1-3.6 1.6-5.5 1.6zm-13.7 0H10.6C4.8 110 0 105.2 0 99.4v-6.2c0-.4.4-.8.8-.8s.8.4.8.8v6.2c0 5 4 9 9 9h50.8c.4 0 .8.4.8.8s-.4.8-.8.8z" opacity=".4"></path>
    <path fill="#FFF" d="M1.1 68.8c-.4 0-.8-.3-.8-.8v-6.1c-.1-.4.3-.8.7-.9.4 0 .9.3.9.7V68c.1.5-.3.8-.8.8.1 0 .1.1 0 0z"></path>
    <path fill="#A54942" d="M108.4 46c-.4 0-.8-.4-.8-.8v-8.8c0-.4.4-.8.8-.8s.8.3.8.8v8.8c0 .4-.3.8-.8.8z"></path>
  </g>
</svg>
 Block Bounties on your game’s badges!
            </strong>
            <span class="nav-dev-blocks__btn mam">
              Set Bounties
            </span>
</a>          <a class="nav-dev-blocks__link" href="https://www.kongregate.com/promoted_listings">
            <strong class="nav-dev-blocks__label mam">
              Market your games on Kongregate with Promoted Listings!
            </strong>
            <span class="nav-dev-blocks__btn mam">
              Create Listings
            </span>
</a>        </li>
      </ul>
    </div>
  </div>
</li>
<!-- End Dev -->

    <!-- #search -->
<li class="search" id="search_bar">
<form onsubmit="$('nav_search_submit_button').onclick();" id="search" class="search" action="https://www.kongregate.com/search" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="✓">    <dl>
      <dt><div style="position:relative" id="game_title_chooser_outer"><input type="text" name="q" id="game_title" value="" tabindex="1" class="hintable game_title hinted_value" title="Search games &amp; more" autocomplete="off"><div style="display:none;" id="game_title_snapshot" class="game_chooser_selected"></div><div style="z-index: 20000; display: none;" id="game_title_auto_complete" class="game_chooser"></div><script>
//<![CDATA[
var game_title_auto_completer=new Ajax.CachedAutocompleter("game_title","game_title_auto_complete","/games/search?site_search=true",{"paramName":"search","method":"get","onShow":function(element,update){update.show();},"onHide":function(element,update){update.hide();},"minChars":3,"noAutoDefault":false,"forceActivation":true,"frequency":0.1,"callback":function(element,value){return game_indicator(element,value)},"afterUpdateElement":function(element,value){(function(m) { $("nav_search_submit_button").onclick(); game_title_auto_completer.submitted = true; document.location = m.url; })(eval('(' + value.down('.metadata').innerHTML + ')'));}});$('game_title').up('form').observe('submit', function() { if ('' == $('game_title').value) { $('search_game_id').value = ''; }});
//]]>
</script></div></dt>
    <dd><input type="submit" value="Search" id="nav_search_submit_button" tabindex="2" class="spritesite" onclick="try{}catch(e){};if(!this.elem_nav_search_submit_button){this.elem_nav_search_submit_button=$('nav_search_submit_button');this.spin_nav_search_submit_button=$('nav_search_submit_button_spinner');this.restore=function(t){return function(){t.elem_nav_search_submit_button.show();t.spin_nav_search_submit_button.hide();Event.stopObserving(window, 'unload', t.restore);}}(this);}this.elem_nav_search_submit_button.hide();this.spin_nav_search_submit_button.show();Event.observe(window, 'unload', this.restore);" data-disable-with="Search"><span id="nav_search_submit_button_spinner" class="spinner spinner_inverse" style="display:none" title="loading…">​</span></dd>
  </dl>
  <script>
//<![CDATA[

    game_title_auto_completer.hide = game_title_auto_completer.hide.wrap(
      function(hide) {
        Shim.hide('game_title_auto_completer');
        hide();
        $$('.hide_ad_always').invoke('show');
      }
    );

    game_title_auto_completer.show = game_title_auto_completer.show.wrap(
      function(show) {
        show();
        $$('.hide_ad_always').invoke('hide');
        Shim.shimElement(this.update, 'game_title_auto_completer');
    });

    game_title_auto_completer.options.onComplete = game_title_auto_completer.options.onComplete.wrap(function(original, args){
      original(args)
      this.index = this.entryCount-1;
      this.render()
    }.bind(game_title_auto_completer))

    Event.observe(game_title_auto_completer.element, 'keyup', function(event){
      if(!this.active && !this.submitted && event.keyCode == Event.KEY_RETURN){
        document.location = "/search?q=" + $('game_title').getValue()
        event.stop()
      } else if(event.keyCode == Event.KEY_BACKSPACE){
        this.index = this.entryCount-1;
        this.render()
      }
    }.bind(game_title_auto_completer))

    game_title_auto_completer.options.noAutoDefault = true

    function game_indicator(element,value) {
      if (!game_title_auto_completer.active) {
        $$('.game_chooser').first().update($('game_chooser_loading').innerHTML);
        $$('.game_chooser').first().show();
        $$('.game_chooser li.all').first().observe('click', function(e) { $('#search').submit(); });
        $$('.hide_ad_always').invoke('hide');
      }
      return value;
    }

//]]>
</script>  <div id="game_chooser_loading" style="display:none"><ul>
  <li class="loading"><div><span class="spinner">​</span></div></li>
    <li class="all"><a href="#" onclick="return false;"><span style="display:none"></span><span class="informal"><strong>see more results »</strong>
        <span class="metadata" style="display:none;">{"url":"/search"}</span>
        <div class="clear"></div></span></a>
    </li>
</ul>
<span style="display:block;clear:both;"></span>
</div>
</form></li><!-- /#search -->

  </ul>
</div>

      </div><!--============ /#header ============-->
`;
    const footer = `
  <div class="kongregate-logo mbl"><a class="spriteall spritesite kongregate-logo" href="https://www.kongregate.com/">Kongregate</a></div>
<div class="line">
<div class="unit size1of2">
  <div class="prs">
    <div class="line footer_links">
      <div class="unit size1of3">
        <ul>
          <li>
            <a href="https://www.facebook.com/kongregate">Be a Facebook Fan</a>
            <a class="icon" href="https://www.facebook.com/kongregate">
              <span class="spriteall spritesite facebook_icon"></span>
</a>            </li>
          <li>
            <a href="http://www.twitter.com/kongregate">Follow Us on Twitter</a>
            <a class="icon" href="http://www.twitter.com/kongregate">
              <span class="spriteall spritesite twitter_icon"></span>
</a>            </li>
          <li><a href="https://www.kongregate.com/pages/about">About Us</a></li>
          <li><a href="https://www.kongregate.com/feedbacks/new">Contact Us</a></li>
        </ul>
      </div>
      <div class="unit size1of3">
        <ul class="mhm">
          <li><a target="_blank" href="https://kong.zendesk.com/hc">Help/FAQ</a></li>
          <li><a href="https://www.kongregate.com/pages/conduct">Conduct Guidelines</a></li>
          <li><a href="https://www.kongregate.com/pages/terms">Terms of Service</a></li>
          <li><a href="https://www.kongregate.com/pages/privacy">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="unit size1of3 lastUnit">
        <ul>
          <li><a href="https://www.kongregate.com/games_for_your_site">Games for Your Site</a></li>
          <li><a href="https://www.kongregate.com/pages/logos-and-branding">Link to Kongregate</a></li>
          <li><a href="https://www.kongregate.com/pages/jobs">Job Opportunities</a></li>
          <li><a class="developer_icon spritesite" href="https://www.kongregate.com/games/new">Upload your Game</a></li>
        </ul>
      </div>
    </div>
  </div>
  <dl class="mtl footer_lang_selector">
<dt><strong>Language:</strong></dt>
  <dd class="selector-locale-fr"><a href="https://www.kongregate.com/?set_locale=true" data-lang="fr">Français</a></dd>
  <dd class="selected-locale-fr" style="display:none;"><strong><span class="flag_ico fr_lang spritesite"></span>Français</strong></dd>
  <dd class="selector-locale-en-US" style="display: none;"><a href="https://www.kongregate.com/?set_locale=true" data-lang="en-US">English</a></dd>
  <dd class="selected-locale-en-US"><strong><span class="flag_ico en-US_lang spritesite"></span>English</strong></dd>
  <dd class="selector-locale-de"><a href="https://www.kongregate.com/?set_locale=true" data-lang="de">Deutsch</a></dd>
  <dd class="selected-locale-de" style="display:none;"><strong><span class="flag_ico de_lang spritesite"></span>Deutsch</strong></dd>
</dl>

<script>
//<![CDATA[
$j( document ).ready(function() {
    if(active_user.getsNoTranslations()) return;

    Kongregate.languages = [];

      Kongregate.languages.push({'language': 'Français', 'locale': 'fr', 'default': false});
      Kongregate.languages.push({'language': 'English', 'locale': 'en-US', 'default': true});
      Kongregate.languages.push({'language': 'Deutsch', 'locale': 'de', 'default': false});

     $j('.footer_lang_selector').show();
     $j.each(Kongregate.languages, function(index, value){
      if(active_user.currentLocale() == value.locale) {
         $j('.selector-locale-' + value.locale).hide();
         $j('.selected-locale-' + value.locale).show();
      }
    });

    $j('[class^="selector-locale"] a').each(function(){
      var lang = $j(this).data().lang;
      var origin = $j(location)[0].protocol + "//" + $j(location)[0].host;
      var pathname = $j(location)[0].pathname;
      var queryString = $j(location)[0].search;
      var anchor = $j(location)[0].hash;

      lang = ((lang == 'en-US') ? '' : '/' + lang);

      if (queryString.indexOf('set_locale=true') == -1) {
        queryString += ((queryString.length > 0) ? '&' : '?') + 'set_locale=true';
      }

      var processed = false;

       $j.each(Kongregate.languages, function(index, value){
        if ((!value['default']) && (pathname.indexOf('/' + value.locale) == 0) && (!processed)) {
          pathname = pathname.substring(('/' + value.locale).length, pathname.length);
          processed = true;
        }
      });

      if (page_data.create_error) {
        pathname = pathname + '/new';
      }

      var url = origin + lang + pathname + queryString + anchor;

      this.href = url;
    });
});

//]]>
</script>
</div>
<div class="unit size1of2 lastUnit">
  <div class="plm">
    <h4 class="h4 mbs"><a href="#" onclick="lightbox.prototype.initializePremiumMembershipPurchase('footer'); return false;">Kong Plus</a></h4>
    <div class="media mbm pbm">
      <a class="spriteall spritesite large_kong_plus_icon img mts" data-test="footer-kplus-ico" href="#" onclick="lightbox.prototype.initializePremiumMembershipPurchase('footer'); return false;">Kong Plus</a>
      <p class="bd">
        Get more out of your Kongregate experience.  Take advantage of ad-free gaming, cool profile skins, automatic beta access, and private chat with Kong Plus.
        <a href="#" onclick="lightbox.prototype.initializePremiumMembershipPurchase('footer'); return false;">Learn more »</a>
      </p>
    </div>
  </div>
</div>
</div>

<a class="dev-footer-upsell" href="http://developers.kongregate.com/">
<span class="logo textreplace">Kongregate Develoeprs</span>
<span class="message">Are you a game developer? Visit our <em>Developers Site</em> where you can find documentation on our APIs and more information about publishing opportunities to further promote your game.</span>
<span class="link textreplace">Learn More</span>
</a>
<ul class="footer_sub clearfix">
<li class="kongregate_copyright">
  <span>© 2026 </span>
  <a class="spriteall spritesite" href="https://www.kongregate.com/">Kongregate</a>
  <span>&nbsp;&nbsp;All rights reserved.</span>
</li>
</ul>

</div>
`;
    const homepage_primarywrap =`
  <div id="primarywrap" class="divider">
  <div id="tr8n_language_selector_trigger"></div>
  <table id="primarylayout" cellpadding="0" cellspacing="0" border="0">
    <tbody><tr>
      <td id="skin_left_of_game"></td>
      <td class="maincontent">
          <div class="mbl" id="kong_home_af_blade_unit" style="display:none">
  <div id="kong_home_af_blade-ad-slot" class="ad-container"><script>
//<![CDATA[
if (!active_user.isPremium()) {
kong_ads.displayAd("kong_home_af_blade");}

//]]>
</script></div>
</div>
<div class="mbl" id="kong_home_af_728x90_unit" style="display:none">
  <div class="horizontal_ad ad hide_ad_always"><span><div id="kong_home_af_728x90-ad-slot" class="ad-container"><script>
//<![CDATA[
if (!active_user.isPremium()) {
kong_ads.displayAd("kong_home_af_728x90");}

//]]>
</script></div></span></div>
</div>

        <div id="global"></div>
        <div id="user_progress_bar_container" class="user_progress_pod_outer" style="display:none;">
<div class="user-progress">
  <p class="progress-box">
    <a id="progress_bar_hide_control" class="close" href=""><span id="user_progress_close" class="icon sprite_new_user textreplace">X</span></a>
    <span id="kongregate_progress_bar_message">
      <span class="text">Complete Initialization <strong>for <a href="/kreds" target="_blank">10 kreds</a></strong></span>
      <span class="kongbot sprite_new_user"></span>
    </span>
    <span id="klient_progress_bar_message" style="display:none;">
      <span class="text text--klient">Complete the
        <!-- Kartridge -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 967.9 230" height="30px" width="120px" alt="Kartridge" class="kartridge">
          <path fill="#FFF" d="M188.9 113.1l59.2-59.7c3.2-3.2.9-8.7-3.6-8.7H188c-1.9 0-3.8.8-5.1 2.1L122.6 108c-1.4 1.4-2.1 3.2-2.1 5.1 0 1.8.7 3.7 2.1 5.1l60.3 61.2c1.4 1.4 3.2 2.1 5.1 2.1h56.5c4.5 0 6.8-5.5 3.6-8.7l-59.2-59.7z"></path>
          <path d="M156.1 89l-23.8 24.1c-2.1 2.1-2.1 5.5 0 7.5l23.8 24V89z" opacity=".2"></path>
          <path fill="#5116DC" d="M156.1 85.3l-23.8 24.1c-2.1 2.1-2.1 5.5 0 7.5l23.8 24V85.3z"></path>
          <path d="M191.9 116.8l57.8-58.2c2.1-2.1 2.7-5.1 1.5-7.9-1.1-2.7-3.7-4.5-6.7-4.5H188c-2.5 0-4.9 1-6.6 2.8l-25.2 25.6V53.4c0-4-3.2-7.2-7.2-7.2h-35.7c-2.5 0-4.9 1-6.7 2.8L78.3 77.3c-.5.4-.9 1-.9 1.7v101.2c0 4 3.2 7.2 7.2 7.2h35.7c2.5 0 4.9-1 6.7-2.8l27.3-27.5 27 27.4c1.8 1.8 4.1 2.8 6.6 2.8h56.5c3 0 5.5-1.7 6.7-4.5 1.1-2.7.6-5.8-1.5-7.9l-57.7-58.1zm55.3 64.5c-.5 1.1-1.5 1.8-2.8 1.8H188c-1.4 0-2.7-.5-3.6-1.5L124 120.4c-1-1-1.5-2.2-1.5-3.6s.5-2.6 1.5-3.6L184.4 52c1-1 2.3-1.5 3.6-1.5h56.5c1.2 0 2.3.7 2.8 1.8s.2 2.4-.6 3.2l-59.2 59.7c-.4.4-.6.9-.6 1.5s.2 1.1.6 1.5l59.2 59.7c.8 1 1 2.3.5 3.4z" opacity=".2"></path>
          <path fill="#5116DC" d="M191.9 113.1l57.8-58.2c2.1-2.1 2.7-5.1 1.5-7.9-1.1-2.7-3.7-4.5-6.7-4.5H188c-2.5 0-4.9 1-6.6 2.8l-25.2 25.6V49.7c0-4-3.2-7.2-7.2-7.2h-35.7c-2.5 0-4.9 1-6.7 2.8L78.3 73.6c-.5.4-.9 1-.9 1.7v101.2c0 4 3.2 7.2 7.2 7.2h35.7c2.5 0 4.9-1 6.7-2.8l27.3-27.5 27 27.4c1.8 1.8 4.1 2.8 6.6 2.8h56.5c3 0 5.5-1.7 6.7-4.5 1.1-2.7.6-5.8-1.5-7.9l-57.7-58.1zm55.3 64.5c-.5 1.1-1.5 1.8-2.8 1.8H188c-1.4 0-2.7-.5-3.6-1.5L124 116.7c-1-1-1.5-2.2-1.5-3.6s.5-2.6 1.5-3.6l60.3-61.2c1-1 2.3-1.5 3.6-1.5h56.5c1.2 0 2.3.7 2.8 1.8s.2 2.4-.6 3.2l-59.2 59.7c-.4.4-.6.9-.6 1.5s.2 1.1.6 1.5l59.2 59.7c.9 1.1 1.1 2.3.6 3.4z"></path>
          <path d="M292.8 153.8V84h14.4v30.4l24-30.4h18l-26.7 33.4 28.5 36.5h-18.6l-25.2-33.2v33.2l-14.4-.1zm81.1 0h-14.8L385.8 84h17.4l26.8 69.8h-14.9l-5.6-15h-30l-5.6 15zM394.4 98l-10.2 27.5h20.3L394.4 98zm74.8 30.8h-10.5v25.1h-14.4V84h27.6c13.6 0 24.7 7.3 24.7 22.1 0 10.3-5.4 16.9-13.1 20l14.8 27.7h-15.7l-13.4-25zm1.5-13.4c5.4 0 11.1-2.4 11.1-9 0-6.7-5.8-8.7-11.2-8.7h-12v17.7h12.1zM530.6 98h-21V84H566v14h-21v55.8h-14.4V98zm73.9 30.8H594v25.1h-14.4V84h27.6c13.6 0 24.7 7.3 24.7 22.1 0 10.3-5.4 16.9-13.1 20l14.8 27.7h-15.7l-13.4-25zm1.5-13.4c5.4 0 11.1-2.4 11.1-9 0-6.7-5.8-8.7-11.2-8.7h-12v17.7H606zm59.4 38.4H651V84h14.4v69.8zm41.9 0h-21.1V84h21.4c24.3 0 39.4 12.8 39.4 34.8 0 20.8-15 35-39.7 35zm.6-56.1h-7.3v42.5h7.1c14.4 0 24.4-7.7 24.4-21.4.1-13.7-10.4-21.1-24.2-21.1zm90.3 57.2c-21.6 0-38.9-16.1-38.9-35.9 0-20.3 16.5-36 36.4-36 17.4 0 28.5 10.2 31.4 21.3l-14.1 4.3c-1.5-6-8-11.9-17.5-11.9-11.8 0-21.5 9.5-21.5 22.2 0 12.1 8.8 22.3 21.5 22.3 9.5 0 16.3-4.9 18-11.8h-21.2v-13.1h36.3v5.4c0 21.8-13.4 33.2-30.4 33.2zm92-70.9v13.6h-31.5v14.2h28.2v13.6h-28.2v15.1h31.7V154h-45.9V84h45.7z" opacity=".2"></path>
          <path fill="#5116DC" d="M292.8 149.9V80h14.4v30.4l24-30.4h18l-26.7 33.4 28.5 36.5h-18.6l-25.2-33.2v33.2h-14.4zm81.1 0h-14.8L385.8 80h17.4l26.8 69.8h-14.9l-5.6-15h-30l-5.6 15.1zM394.4 94l-10.2 27.5h20.3L394.4 94zm74.8 30.8h-10.5v25.1h-14.4V80h27.6c13.6 0 24.7 7.3 24.7 22.1 0 10.3-5.4 16.9-13.1 20l14.8 27.7h-15.7l-13.4-25zm1.5-13.4c5.4 0 11.1-2.4 11.1-9 0-6.7-5.8-8.7-11.2-8.7h-12v17.7h12.1zM530.6 94h-21V80H566v14h-21v55.8h-14.4V94zm73.9 30.8H594v25.1h-14.4V80h27.6c13.6 0 24.7 7.3 24.7 22.1 0 10.3-5.4 16.9-13.1 20l14.8 27.7h-15.7l-13.4-25zm1.5-13.4c5.4 0 11.1-2.4 11.1-9 0-6.7-5.8-8.7-11.2-8.7h-12v17.7H606zm59.4 38.5H651V80h14.4v69.9zm41.9 0h-21.1V80h21.4c24.3 0 39.4 12.8 39.4 34.8 0 20.8-15 35.1-39.7 35.1zm.6-56.2h-7.3v42.5h7.1c14.4 0 24.4-7.7 24.4-21.4.1-13.7-10.4-21.1-24.2-21.1zm90.3 57.3c-21.6 0-38.9-16.1-38.9-35.9 0-20.3 16.5-36 36.4-36 17.4 0 28.5 10.2 31.4 21.3l-14.1 4.3c-1.5-6-8-11.9-17.5-11.9-11.8 0-21.5 9.5-21.5 22.2 0 12.1 8.8 22.3 21.5 22.3 9.5 0 16.3-4.9 18-11.8h-21.2v-13.1h36.3v5.4c0 21.7-13.4 33.2-30.4 33.2zm92-71v13.6h-31.5v14.2h28.2v13.6h-28.2v15.1h31.7V150h-45.9V80h45.7zM901.7 80h8.3v1.5h-3.3v8.9h-1.6v-8.9h-3.3V80h-.1zm19.6 2.9l-3.4 7.6h-1.2l-3.4-7.6v7.6h-1.6V80h2.1l3.5 8 3.5-8h2.2v10.5h-1.6l-.1-7.6z"></path>
        </svg>
      Quest and earn <strong>an exclusive shiny kongpanion + 10 kreds</strong></span>
      <span class="arrow_seperator sprite_new_user"></span>
    </span>
    <span id="user_progress_percentage_number" class="percent"></span>
    <span class="progress" id="user_progress_bar_frame">
      <span id="user_progress_bar" class="bar"></span>
      <span id="user_progress_preview" class="preview">
        <span class="tooltip">15%</span>
        <span class="preview-bar"></span>
      </span>
      <span id="user_progress_reward_image" class="reward sprite_new_user"></span>
      <span id="user_progress_reward_image2" class="reward2 sprite_new_user" style="display:none;"></span>
    </span>
  </p>
  <div id="user_progress_bar_steps_container" class="steps">
    <a id="progress_bar_previous_control" class="prev" href="">« Previous</a>
    <ul id="user_progress_bar_steps" class="step-list"></ul>
    <a id="progress_bar_next_control" class="next" href="">Next »</a>
  </div>
  <div id="user_progress_bar_complete_message" class="congrats-msg">
    <p><strong>Congratulations!</strong> You’ve completed your Kongregate account!</p>
    <p>Keep exploring Kongregate with more <a href="/badges" target="_blank">badges</a> and <a href="/top-rated-games?sort=newest" target="_blank">games</a>!</p>
  </div>
  <div id="user_klient_progress_bar_complete_message" class="congrats-msg--klient">
    <p><strong>Congratulations!</strong> You’ve completed your Kartridge quest!</p>
    <p>Spend your hard earned kreds on some of <a href="/community-favorite-games" target="_blank">these games</a>!</p>
  </div>
</div>
<p id="progress_never_show_again_message" class="remove regtext" style="display:none;">
  Hide the progress bar forever?
  <a id="progress_never_show_again_confirm" class="remove-link" href="">Yes</a>
  <a id="progress_never_show_again_deny" class="remove-link" href="">No</a>
</p>
<script type="text/html" id="user_progress_bar_step_template">
  <li id="#{icon_id}_step" class="#{icon_id}-step step #{klient_step}"><a class="user-step-link" href="#{link_path}"><span class="step-inner"><span class="sprite_new_user icon"></span>#{link_content}</span></a></li>
</script>
</div>

            <h1 class="homepage_title">Kongregate: Play free games online</h1>
<div id="feature">

      <div class="home_feat_roll">
<ol class="home_feat_nav">
  <li class="prev"></li>
  <li class="next mls"></li>
</ol>
<ul class="home_feat_items"></ul>
</div>

  <!-- Pod Container Start -->
  <div id="home_pods">
    <!-- Blue Bar Start -->
    <div id="flash_messages_target"></div>

    <!-- Blue Bar End -->
    <!-- Hot New Games Start -->

<div id="latest_games_pod" class="games_pod js-roller home-pod" pod-name="latest_games" pod-panes-count="6">

<div class="home-pod-header">
<h2 class="home-pod-title">

  Hot New Games
  <a href="/top-rated-games?sort=newest">(see all)</a>

</h2>
<span class="pane_dots">
      <span class="spriteall spritesite active_dot dot_0 roller_dot">.</span>
      <span class="spriteall spritesite inactive_dot dot_1 roller_dot">.</span>
    <a href="#" onclick="Roller.rolodex['latest_games'].scrollToPreviousPaneAndStop(); return false;" class="spriteall spritesite roller_button roller_previous">Previous</a>
    <a href="#" onclick="Roller.rolodex['latest_games'].scrollToNextPaneAndStop(); return false;" class="spriteall spritesite roller_button roller_next">Next</a>
</span>
</div>

<div id="latest_games" class="games_pod_scrollable_container">
<div id="latest_games_scrollable" class="games_pod_scrollable js-roller-scrollable">
    <div class="ind_pane loaded">



<div data-game-impression-game-id="299519" data-game-impression-unit-type="latest_games" data-game-impression-position="0" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/HolydayStudios/firestone?haref=HP_HNG_firestone">
    <img class="game_icon image" title="" alt="Play Firestone Idle RPG" width="250" height="200" src="https://cdn3.kongcdn.com/game_icons/0070/1398/Kongregate_-_Halloween_Event_-_Appicon2023.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Firestone Idle RPG</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Clicker</span></li><li class="tag"><span class="term">Idle</span></li><li class="tag"><span class="term">Incremental</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.0</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="285013" data-game-impression-unit-type="latest_games" data-game-impression-position="1" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/tovrick/sword-fight?haref=HP_HNG_sword-fight">
    <img class="game_icon image" title="" alt="Play Sword Fight" width="250" height="200" src="https://cdn2.kongcdn.com/game_icons/0070/1250/SwordFightIcon_Unity_0_19_3.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Sword Fight</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Idle</span></li><li class="tag"><span class="term">Upgrades</span></li><li class="tag"><span class="term">Mouse Only</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.2</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="313848" data-game-impression-unit-type="latest_games" data-game-impression-position="2" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Playsaurus/poker-quest?haref=HP_HNG_poker-quest">
    <img class="game_icon image" title="" alt="Play Poker Quest RPG" width="250" height="200" src="https://cdn4.kongcdn.com/game_icons/0070/0687/250_200.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Poker Quest RPG</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Card</span></li><li class="tag"><span class="term">Fantasy</span></li><li class="tag"><span class="term">Mouse Only</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.2</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="283352" data-game-impression-unit-type="latest_games" data-game-impression-position="3" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/towardsmars/dungeon-crusher-soul-hunters?haref=HP_HNG_dungeon-crusher-soul-hunters">
    <img class="game_icon image" title="" alt="Play Dungeon Crusher: Soul Hunters" width="250" height="200" src="https://cdn4.kongcdn.com/game_icons/0070/1388/Dc.gif?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Dungeon Crusher: Soul Hunters</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Clicker</span></li><li class="tag"><span class="term">Multiplayer</span></li><li class="tag"><span class="term">Incremental</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  3.6</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="289806" data-game-impression-unit-type="latest_games" data-game-impression-position="4" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/RogueSword/dungeoneers?haref=HP_HNG_dungeoneers">
    <img class="game_icon image" title="" alt="Play Dungeoneers" width="250" height="200" src="https://cdn3.kongcdn.com/game_icons/0070/0626/dng_kongregate_250_200.jpg?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Dungeoneers</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Dungeon</span></li><li class="tag"><span class="term">Turn Based</span></li><li class="tag"><span class="term">Mouse Only</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.1</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="317607" data-game-impression-unit-type="latest_games" data-game-impression-position="5" data-game-impression-depth="0" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/HapiwakuProject/incremental-epic-hero?haref=HP_HNG_incremental-epic-hero">
    <img class="game_icon image" title="" alt="Play Incremental Epic Hero" width="250" height="200" src="https://cdn4.kongcdn.com/game_icons/0070/0808/KongregateThumbnail.jpg?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Incremental Epic Hero</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Incremental</span></li><li class="tag"><span class="term">Upgrades</span></li><li class="tag"><span class="term">Dungeon</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.1</span>
    </span>
</a>  </div>


    </div>
    <div class="ind_pane loaded">



<div data-game-impression-game-id="272366" data-game-impression-unit-type="latest_games" data-game-impression-position="0" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Panoramik/mighty-party?haref=HP_HNG_mighty-party">
    <img class="game_icon image" title="" alt="Play Mighty Party" width="250" height="200" src="https://cdn1.kongcdn.com/game_icons/0069/4671/Zombie_Love.jpg?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Mighty Party</strong>
      <ul class="tags">
        <li class="tag"><span class="term">CCG</span></li><li class="tag"><span class="term">Turn Based</span></li><li class="tag"><span class="term">Multiplayer</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.0</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="315606" data-game-impression-unit-type="latest_games" data-game-impression-position="1" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/tbiz5270/idle-monster-td?haref=HP_HNG_idle-monster-td">
    <img class="game_icon image" title="" alt="Play Idle Monster TD" width="250" height="200" src="https://cdn3.kongcdn.com/game_icons/0070/0770/kong_500x400_copy.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Idle Monster TD</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Tower Defense</span></li><li class="tag"><span class="term">Idle</span></li><li class="tag"><span class="term">Monster</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.1</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="287709" data-game-impression-unit-type="latest_games" data-game-impression-position="2" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/somethingggg/ngu-idle?haref=HP_HNG_ngu-idle">
    <img class="game_icon image" title="" alt="Play NGU IDLE" width="250" height="200" src="https://cdn4.kongcdn.com/game_icons/0070/0434/KongQuacky.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">NGU IDLE</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Incremental</span></li><li class="tag"><span class="term">Idle</span></li><li class="tag"><span class="term">Upgrades</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.5</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="161320" data-game-impression-unit-type="latest_games" data-game-impression-position="3" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/kanoapps/mob-wars-la-cosa-nostra?haref=HP_HNG_mob-wars-la-cosa-nostra">
    <img class="game_icon image" title="" alt="Play Mob Wars: La Cosa Nostra" width="250" height="200" src="https://cdn3.kongcdn.com/game_icons/0069/5323/LCN_KongIcon_250x200.png?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Mob Wars: La Cosa Nostra</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Multiplayer</span></li><li class="tag"><span class="term">Mouse Only</span></li><li class="tag"><span class="term">RPG</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  3.7</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="315604" data-game-impression-unit-type="latest_games" data-game-impression-position="4" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/SamuraiGames/another-chronicle-b-ver?haref=HP_HNG_another-chronicle-b-ver">
    <img class="game_icon image" title="" alt="Play Another Chronicle β.ver" width="250" height="200" src="https://cdn2.kongcdn.com/game_icons/0070/0774/main1_3_0.gif?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">Another Chronicle β.ver</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Text-Based</span></li><li class="tag"><span class="term">Upgrades</span></li><li class="tag"><span class="term">RPG</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  4.0</span>
    </span>
</a>  </div>





<div data-game-impression-game-id="311196" data-game-impression-unit-type="latest_games" data-game-impression-position="5" data-game-impression-depth="1" class="game js-game-hover">
  <a class="hover_game_info" href="https://www.kongregate.com/games/JoyBits/worlds-builder?haref=HP_HNG_worlds-builder">
    <img class="game_icon image" title="" alt="Play WORLDS Builder: Farm &amp; Craft" width="250" height="200" src="https://cdn2.kongcdn.com/game_icons/0069/9689/WORLDS_new_levels_gif.gif?i10c=img.resize(width:250,height:200)">
    <span class="info">
      <strong class="title truncate">WORLDS Builder: Farm &amp; Craft</strong>
      <ul class="tags">
        <li class="tag"><span class="term">Management</span></li><li class="tag"><span class="term">Mouse Only</span></li><li class="tag"><span class="term">Farm</span></li>
      </ul>
      <span class="rating"><span class="kong_ico" aria-hidden="true">*</span>  3.8</span>
    </span>
</a>  </div>


    </div>
</div>
</div>
</div>

    <!-- Hot New Games End -->
    <!-- Beta/Ad Start -->
      <div id="ad_games_pod" class="home-pod">
  <div class="square_ad ad"><div class="square_ad_wrapper"><span class="hide_ad_always"><div id="kong_home_af_300x250-ad-slot" class="ad-container"><script>
//<![CDATA[
if (!active_user.isPremium()) {
kong_ads.displayAd("kong_home_af_300x250");}

//]]>
</script></div><span class="bt-uid-tg" uid="5ab3c5d976-106" style="display: none !important"></span></span></div></div>
  <div id="ad_300x100" class="ad_336 ad mtl">
    <div id="kong_home_af_300x100-ad-slot" class="ad-container"><script>
//<![CDATA[
if (!active_user.isPremium()) {
kong_ads.displayAd("kong_home_af_300x100");}

//]]>
</script></div>
  </div>
  <div id="home_spotlight_feature" class="mtl" style="display:none;">
    <h6 class="h6 game_spotlights_heading ptm phm">Sponsored Listing</h6>
    <div id="kong_home_spotlight_af_281x90-ad-slot" class="ad-container premium_viewable"><script>
//<![CDATA[
kong_ads.displayAd("kong_home_spotlight_af_281x90");
//]]>
</script></div>
  </div>
</div>

    <!-- Beta/Add End -->
    <div id="kong_home_bf_728x90_unit">
      <div class="horizontal_ad ad hide_ad_always"><span><div id="kong_home_bf_728x90-ad-slot" class="ad-container"><script>
//<![CDATA[
if (!active_user.isPremium()) {
kong_ads.displayAd("kong_home_bf_728x90");}

//]]>
</script></div><span class="bt-uid-tg" uid="5ab3c60093-106" style="display: none !important"></span></span></div>
    </div>

    <!-- Highest Rated Games Start -->

<div id="popular_games_pod" class="js-roller home-pod" pod-name="popular_games" pod-panes-count="3">

<div class="home-pod-header">
<h2 class="home-pod-title">

  Highest Rated Games
  <a href="/games?sort=rating">(see all)</a>

</h2>
<span class="pane_dots">
      <span class="spriteall spritesite active_dot dot_0 roller_dot">.</span>
      <span class="spriteall spritesite inactive_dot dot_1 roller_dot">.</span>
      <span class="spriteall spritesite inactive_dot dot_2 roller_dot">.</span>
    <a href="#" onclick="Roller.rolodex['popular_games'].scrollToPreviousPaneAndStop(); return false;" class="spriteall spritesite roller_button roller_previous">Previous</a>
    <a href="#" onclick="Roller.rolodex['popular_games'].scrollToNextPaneAndStop(); return false;" class="spriteall spritesite roller_button roller_next">Next</a>
</span>
</div>

<div id="popular_games" class="games_pod_scrollable_container">
<div id="popular_games_scrollable" class="games_pod_scrollable js-roller-scrollable">
    <div class="ind_pane loaded">



<div data-game-impression-game-id="249627" data-game-impression-unit-type="popular_games" data-game-impression-position="0" data-game-impression-depth="0" class="game pam js-game-hover" id="highest_rated_game_249627">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/SoulGame/swords-and-souls"><img class="game_icon" title="Swords and Souls" alt="Play Swords and Souls" width="171" height="137" src="https://cdn1.kongcdn.com/game_icons/0063/9685/250x200_BETTER.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/SoulGame/swords-and-souls">
      <span class="txt truncate hover_game_info">Swords and Souls</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/arena-combat-games">Arena Combat</a></li><li class="tag"><a rel="tag" class="term" href="/fighting-games">Fighting</a></li><li class="tag"><a rel="tag" class="term" href="/upgrades-games">Upgrades</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    CHECKOUT THE SEQUEL!
http://steampowered.com/ap...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:60px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>4
      </span>
  </span>
</div>





<div data-game-impression-game-id="190329" data-game-impression-unit-type="popular_games" data-game-impression-position="1" data-game-impression-depth="0" class="game pam js-game-hover" id="highest_rated_game_190329">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/0rava/mutilate-a-doll-2"><img class="game_icon" title="Mutilate-a-Doll 2" alt="Play Mutilate-a-Doll 2" width="171" height="137" src="https://cdn4.kongcdn.com/game_icons/0070/0664/newlogo.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/0rava/mutilate-a-doll-2">
      <span class="txt truncate hover_game_info">Mutilate-a-Doll 2</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/ragdoll-games">Ragdoll</a></li><li class="tag"><a rel="tag" class="term" href="/sandbox-games">Sandbox</a></li><li class="tag"><a rel="tag" class="term" href="/physics-games">Physics</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    MaD2 is a virtual stressball physics sandbox ab...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:60px;"></li></ul>
  </span>
</div>





<div data-game-impression-game-id="151730" data-game-impression-unit-type="popular_games" data-game-impression-position="2" data-game-impression-depth="0" class="game pam js-game-hover" id="highest_rated_game_151730">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/Ninjakiwi/bloons-td-5"><img class="game_icon" title="Bloons TD 5" alt="Play Bloons TD 5" width="171" height="137" src="https://cdn2.kongcdn.com/game_icons/0044/9338/bloons-tower-defense5-300x250.jpg?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/Ninjakiwi/bloons-td-5">
      <span class="txt truncate hover_game_info">Bloons TD 5</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/tower-defense-games">Tower Defense</a></li><li class="tag"><a rel="tag" class="term" href="/bloons-games">Bloons</a></li><li class="tag"><a rel="tag" class="term" href="/monkey-games">Monkey</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    Bloons TD 5 has heaps of new features including...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:59px;"></li></ul>
  </span>
</div>


    </div>
    <div class="ind_pane loaded">



<div data-game-impression-game-id="316009" data-game-impression-unit-type="popular_games" data-game-impression-position="0" data-game-impression-depth="1" class="game pam js-game-hover" id="highest_rated_game_316009">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/siread/retro-bowl"><img class="game_icon" title="Retro Bowl" alt="Play Retro Bowl" width="171" height="137" src="https://cdn1.kongcdn.com/game_icons/0069/4343/icon_200.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/siread/retro-bowl">
      <span class="txt truncate hover_game_info">Retro Bowl</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/football-games">Football</a></li><li class="tag"><a rel="tag" class="term" href="/sports-games">Sports</a></li><li class="tag"><a rel="tag" class="term" href="/manager-games">Management</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    Retro Bowl is the perfect game for the armchair...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:59px;"></li></ul>
  </span>
</div>





<div data-game-impression-game-id="315580" data-game-impression-unit-type="popular_games" data-game-impression-position="1" data-game-impression-depth="1" class="game pam js-game-hover" id="highest_rated_game_315580">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/kupo707/epic-battle-fantasy-5"><img class="game_icon" title="Epic Battle Fantasy 5" alt="Play Epic Battle Fantasy 5" width="171" height="137" src="https://cdn4.kongcdn.com/game_icons/0069/3941/ebf5_kong_thumb.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/kupo707/epic-battle-fantasy-5">
      <span class="txt truncate hover_game_info">Epic Battle Fantasy 5</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/rpg-games">RPG</a></li><li class="tag"><a rel="tag" class="term" href="/adventure-games">Adventure</a></li><li class="tag"><a rel="tag" class="term" href="/strategy-games">Strategy</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    Go on a 30-hour turn-based RPG adventure!

It's...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:59px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>4
      </span>
  </span>
</div>





<div data-game-impression-game-id="195142" data-game-impression-unit-type="popular_games" data-game-impression-position="2" data-game-impression-depth="1" class="game pam js-game-hover" id="highest_rated_game_195142">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush-frontiers"><img class="game_icon" title="Kingdom Rush Frontiers" alt="Play Kingdom Rush Frontiers" width="171" height="137" src="https://cdn1.kongcdn.com/game_icons/0051/0118/IconoKongregate.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush-frontiers">
      <span class="txt truncate hover_game_info">Kingdom Rush Frontiers</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/tower-defense-games">Tower Defense</a></li><li class="tag"><a rel="tag" class="term" href="/strategy-games">Strategy</a></li><li class="tag"><a rel="tag" class="term" href="/defense-games">Defense</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    The world's most devilishly addictive defense g...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:59px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>4
      </span>
  </span>
</div>


    </div>
    <div class="ind_pane loaded">



<div data-game-impression-game-id="133293" data-game-impression-unit-type="popular_games" data-game-impression-position="0" data-game-impression-depth="2" class="game pam js-game-hover" id="highest_rated_game_133293">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush"><img class="game_icon" title="Kingdom Rush" alt="Play Kingdom Rush" width="171" height="137" src="https://cdn3.kongcdn.com/game_icons/0032/8367/KongregateThumb.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush">
      <span class="txt truncate hover_game_info">Kingdom Rush</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/tower-defense-games">Tower Defense</a></li><li class="tag"><a rel="tag" class="term" href="/strategy-games">Strategy</a></li><li class="tag"><a rel="tag" class="term" href="/defense-games">Defense</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    The kingdom is under attack! Defend your realm ...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:58px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>4
      </span>
  </span>
</div>





<div data-game-impression-game-id="266462" data-game-impression-unit-type="popular_games" data-game-impression-position="1" data-game-impression-depth="2" class="game pam js-game-hover" id="highest_rated_game_266462">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes"><img class="game_icon" title="Bit Heroes" alt="Play Bit Heroes" width="171" height="137" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes">
      <span class="txt truncate hover_game_info">Bit Heroes</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/rpg-games">RPG</a></li><li class="tag"><a rel="tag" class="term" href="/pixel-games">Pixel</a></li><li class="tag"><a rel="tag" class="term" href="/dungeon-games">Dungeon</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    Retro dungeon crawling MMO with PvP, Pets, Guil...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:58px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>2
      </span>
  </span>
</div>





<div data-game-impression-game-id="287709" data-game-impression-unit-type="popular_games" data-game-impression-position="2" data-game-impression-depth="2" class="game pam js-game-hover" id="highest_rated_game_287709">
  <a class="game_browser_icon game_ico_outer" href="https://www.kongregate.com/games/somethingggg/ngu-idle"><img class="game_icon" title="NGU IDLE" alt="Play NGU IDLE" width="171" height="137" src="https://cdn3.kongcdn.com/game_icons/0070/0434/KongQuacky.png?i10c=img.resize(width:171,height:137)"></a>
  <!-- Title -->
  <strong class="title">
    <a class="play_link" href="https://www.kongregate.com/games/somethingggg/ngu-idle">
      <span class="txt truncate hover_game_info">NGU IDLE</span>
</a>    </strong>
    <!-- Tags -->
    <ul class="tags">
      <li class="tag"><a rel="tag" class="term" href="/incremental-games">Incremental</a></li><li class="tag"><a rel="tag" class="term" href="/idle-games">Idle</a></li><li class="tag"><a rel="tag" class="term" href="/upgrades-games">Upgrades</a></li>
    </ul>
  <!-- Explanation/Description -->
  <p class="info hyphenate regtextSml">
    Everyone likes numbers that go up. Play NGU Idl...
  </p>
  <!-- Footer -->
  <span class="game_footer regtextSml">
    <!-- Rating -->
    <ul class="star-rating spritegame"><li class="current-rating spritegame spriteall" style="width:58px;"></li></ul>
      <!-- Badges -->
      <span class="badge_count">
        <span class="badge_count_ico kong_ico" aria-hidden="true">a</span>2
      </span>
  </span>
</div>


    </div>
</div>
</div>
</div>

    <!-- Highest Rated Games End -->

    <!-- Top Games This Month Start -->


<div id="top_games_this_month_pod" class="home-pod">
<div class="home-pod-header">
  <h2 class="home-pod-title">
    Top Games This Month
    <a href="/top-monthly-games">(see all)</a>
  </h2>
</div>
<ul>



<li data-game-impression-game-id="298297" data-game-impression-unit-type="top_games_this_month" data-game-impression-position="0" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Zamol/places?haref=HP_TGTM_places">
    <img class="game_icon" title="Stacked Idle" alt="Play Stacked Idle" width="93" height="74" src="https://cdn1.kongcdn.com/game_icons/0070/0981/logo.png?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Stacked Idle</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Incremental</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  3.2</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Zamol</strong></span>
</a>  </li>

</ul>
</div>


    <!-- Top Games This Month End -->
    <!-- Wide Trending Start -->
    <!-- Wide Trending End -->
    <div class="line">
      <!-- Mobile Games Start -->
      <div id="our_mobile_games_pod" class="home-pod">
<div class="home-pod-header">
  <h2 class="home-pod-title">
    Our Published Games
    <a href="https://www.kartridge.com/games?gameGroupId=403&amp;utm_medium=kongregate&amp;utm_source=mobile_game_pod&amp;utm_campaign=homepage&amp;utm_content=text_link">(see all)</a>
  </h2>
</div>
<div class="click_box">
  <style>
#our_mobile_games_pod .click_box {
  height: 284px;
  position: relative;
  z-index: 1;
}

#our_mobile_games_pod .click_link {
  background: transparent;
  display: block;
  height: 295px;
  width: 295px;
}

#our_mobile_games_pod .click_link:hover { background-position: 0 -44px; }

#our_mobile_games_pod .omgp-copy {
  background: transparent url('https://cdn2.kongcdn.com/assets/files/0002/7600/KongWeb-Promo_300x296.png') no-repeat 0 0;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: -13px;
  z-index: 1;
}


}
</style>

<div class="omgp-copy">
<h3 class="textreplace">Royal Idle - Medieval Quest</h3>
<p class="textreplace">Collect gold and emeralds, build your kingdom, and journey to new adventure!</p>
<a href="https://app.adjust.com/auzbih6?campaign=IF-All-Free-All-MobileGamePod-" target="_blank" class="click_link textreplace">Download on the App Store &amp; Get it on Google Play</a>
</div>


</div>
</div>

      <!-- Mobile Games End -->
      <!-- Most Played Games Start -->


<div id="most_played_games_pod" class="home-pod">
<div class="home-pod-header">
  <h2 class="home-pod-title">
    Most Played Games
    <a href="/most-played-games">(see all)</a>
  </h2>
</div>
<ul>



<li data-game-impression-game-id="316009" data-game-impression-unit-type="most_played_games" data-game-impression-position="0" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/siread/retro-bowl?haref=HP_MPG_retro-bowl">
    <img class="game_icon" title="Retro Bowl" alt="Play Retro Bowl" width="93" height="74" src="https://cdn1.kongcdn.com/game_icons/0069/4343/icon_200.png?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Retro Bowl</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Football</span></li><li class="tag"><span class="term">Sports</span></li><li class="tag"><span class="term">Management</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.6</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>siread</strong></span>
</a>  </li>




<li data-game-impression-game-id="271381" data-game-impression-unit-type="most_played_games" data-game-impression-position="1" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Throwdown/animation-throwdown?haref=HP_MPG_animation-throwdown">
    <img class="game_icon" title="Animation Throwdown" alt="Play Animation Throwdown" width="93" height="74" src="https://cdn4.kongcdn.com/game_icons/0070/1395/ezgif.com-resize__25_.gif?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Animation Throwdown</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Card</span></li><li class="tag"><span class="term">CCG</span></li><li class="tag"><span class="term">Turn Based</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.2</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Throwdown</strong></span>
</a>  </li>




<li data-game-impression-game-id="266462" data-game-impression-unit-type="most_played_games" data-game-impression-position="2" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes?haref=HP_MPG_bit-heroes">
    <img class="game_icon" title="Bit Heroes" alt="Play Bit Heroes" width="93" height="74" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Bit Heroes</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">RPG</span></li><li class="tag"><span class="term">Pixel</span></li><li class="tag"><span class="term">Dungeon</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.5</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Juppiomenz</strong></span>
</a>  </li>




<li data-game-impression-game-id="151730" data-game-impression-unit-type="most_played_games" data-game-impression-position="3" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/bloons-td-5?haref=HP_MPG_bloons-td-5">
    <img class="game_icon" title="Bloons TD 5" alt="Play Bloons TD 5" width="93" height="74" src="https://cdn1.kongcdn.com/game_icons/0044/9338/bloons-tower-defense5-300x250.jpg?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Bloons TD 5</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Tower Defense</span></li><li class="tag"><span class="term">Bloons</span></li><li class="tag"><span class="term">Monkey</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.6</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Ninjakiwi</strong></span>
</a>  </li>

</ul>
</div>


      <!-- Mosted Played Games End -->
      <!-- Community Favorite Games Start -->


<div id="community_favorites_pod" class="home-pod">
<div class="home-pod-header">
  <h2 class="home-pod-title">
    Community Favorites
    <a href="/community-favorite-games">(see all)</a>
  </h2>
</div>
<ul>



<li data-game-impression-game-id="271381" data-game-impression-unit-type="community_favorites" data-game-impression-position="0" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Throwdown/animation-throwdown?haref=HP_CF_animation-throwdown">
    <img class="game_icon" title="Animation Throwdown" alt="Play Animation Throwdown" width="93" height="74" src="https://cdn4.kongcdn.com/game_icons/0070/1395/ezgif.com-resize__25_.gif?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Animation Throwdown</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Card</span></li><li class="tag"><span class="term">CCG</span></li><li class="tag"><span class="term">Turn Based</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.2</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Throwdown</strong></span>
</a>  </li>




<li data-game-impression-game-id="266462" data-game-impression-unit-type="community_favorites" data-game-impression-position="1" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes?haref=HP_CF_bit-heroes">
    <img class="game_icon" title="Bit Heroes" alt="Play Bit Heroes" width="93" height="74" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Bit Heroes</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">RPG</span></li><li class="tag"><span class="term">Pixel</span></li><li class="tag"><span class="term">Dungeon</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.5</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>Juppiomenz</strong></span>
</a>  </li>




<li data-game-impression-game-id="299519" data-game-impression-unit-type="community_favorites" data-game-impression-position="2" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/HolydayStudios/firestone?haref=HP_CF_firestone">
    <img class="game_icon" title="Firestone Idle RPG" alt="Play Firestone Idle RPG" width="93" height="74" src="https://cdn3.kongcdn.com/game_icons/0070/1398/Kongregate_-_Halloween_Event_-_Appicon2023.png?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Firestone Idle RPG</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">Clicker</span></li><li class="tag"><span class="term">Idle</span></li><li class="tag"><span class="term">Incremental</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  4.0</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>HolydayStudios</strong></span>
</a>  </li>




<li data-game-impression-game-id="248326" data-game-impression-unit-type="community_favorites" data-game-impression-position="3" class="js-game-hover game-pod-med">
  <a class="hover_game_info" href="https://www.kongregate.com/games/synapticon/spellstone?haref=HP_CF_spellstone">
    <img class="game_icon" title="Spellstone" alt="Play Spellstone" width="93" height="74" src="https://cdn2.kongcdn.com/game_icons/0067/5197/kong_logo.jpg?i10c=img.resize(width:93)">
    <span class="title">
      <span class="txt truncate hover_game_info">Spellstone</span>
    </span>
    <ul class="tags">
      <li class="tag"><span class="term">CCG</span></li><li class="tag"><span class="term">Card</span></li><li class="tag"><span class="term">Turn Based</span></li>
    </ul>
      <span class="rating regtextSml"><span class="kong_ico" aria-hidden="true">*</span>  3.8</span>
    <span class="developer regtextSml truncate"><em>by</em> <strong>synapticon</strong></span>
</a>  </li>

</ul>
</div>


      <!-- Community Favorite Games End -->
    </div>
    <!-- Browse By Category start -->
    <div id="home-browse-pods" class="line">
      <div class="unit size2of3">

          <div id="browsebycategory" class="browse-by-category mhm">
            <div class="pod_header clearfix">
              <h2><a href="/games">Browse Top Games by Category</a></h2>
              <p class="pod_all"><a href="/games">(see all)</a></p>
            </div>
            <div class="line">
<div class="unit size1of2">
  <div class="mrm">
    <!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/card-games">Card</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="270326" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/RobotoGames/age-of-rivals?haref=HP_Card_age-of-rivals"><img class="game_icon" title="Age of Rivals" alt="Play Age of Rivals" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0065/8601/Kongregate_Icon_Small.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/RobotoGames/age-of-rivals?haref=HP_Card_age-of-rivals">Age of Rivals</a>
  </p>
    <p class="browse_developer">by
      RobotoGames
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:54px;"></li>
    </ul>
    <p><em class="num_rating">(4.19 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="271381" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Throwdown/animation-throwdown?haref=HP_Card_animation-throwdown"><img class="game_icon" title="Animation Throwdown" alt="Play Animation Throwdown" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Throwdown/animation-throwdown?haref=HP_Card_animation-throwdown">Animation Throwdown</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:54px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="123844" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/fighter106/spectromancer-gamers-pack?haref=HP_Card_spectromancer-gamers-pack"><img class="game_icon" title="Spectromancer: Gamer's Pack" alt="Play Spectromancer: Gamer's Pack" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0029/0619/welcome_png.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/fighter106/spectromancer-gamers-pack?haref=HP_Card_spectromancer-gamers-pack">Spectromancer: Gamer'...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:51px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="158442" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/nulllvoid/hd-xyth?haref=HP_Card_hd-xyth"><img class="game_icon" title="HD Xyth" alt="Play HD Xyth" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0042/1478/HDX_icon_250x200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/nulllvoid/hd-xyth?haref=HP_Card_hd-xyth">HD Xyth</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:51px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="208033" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/synapticon/tyrant-unleashed-web?haref=HP_Card_tyrant-unleashed-web"><img class="game_icon" title="Tyrant Unleashed" alt="Play Tyrant Unleashed" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0067/6091/tu_may4th__1_.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/synapticon/tyrant-unleashed-web?haref=HP_Card_tyrant-unleashed-web">Tyrant Unleashed</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:51px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/card-games">564&nbsp;more&nbsp;Card games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/idle-games">Idle</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="287709" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/somethingggg/ngu-idle"><img class="game_icon" title="NGU IDLE" alt="Play NGU IDLE" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0070/0434/KongQuacky.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/somethingggg/ngu-idle">NGU IDLE</a>
  </p>
    <p class="browse_developer">by
      somethingggg
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
    <p><em class="num_rating">(4.52 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="312748" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/JamesG466/incremancer"><img class="game_icon" title="Incremancer" alt="Play Incremancer" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0069/1970/zombie-512.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/JamesG466/incremancer">Incremancer</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="216826" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Playsaurus/clicker-heroes"><img class="game_icon" title="Clicker Heroes" alt="Play Clicker Heroes" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0064/3541/icon250x200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Playsaurus/clicker-heroes">Clicker Heroes</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="258553" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/XmmmX99/the-perfect-tower"><img class="game_icon" title="The Perfect Tower" alt="Play The Perfect Tower" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0064/7749/Image.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/XmmmX99/the-perfect-tower">The Perfect Tower</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="243608" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/GreenSatellite/trimps"><img class="game_icon" title="Trimps" alt="Play Trimps" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0065/8867/icon40.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/GreenSatellite/trimps">Trimps</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/idle-games">1304&nbsp;more&nbsp;Idle games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/strategy-defense-games">Strategy &amp; Defense</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="151730" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ninjakiwi/bloons-td-5"><img class="game_icon" title="Bloons TD 5" alt="Play Bloons TD 5" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0044/9338/bloons-tower-defense5-300x250.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/bloons-td-5">Bloons TD 5</a>
  </p>
    <p class="browse_developer">by
      Ninjakiwi
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:59px;"></li>
    </ul>
    <p><em class="num_rating">(4.61 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="195142" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush-frontiers"><img class="game_icon" title="Kingdom Rush Frontiers" alt="Play Kingdom Rush Frontiers" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0051/0118/IconoKongregate.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush-frontiers">Kingdom Rush Frontiers</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:59px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="133293" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush"><img class="game_icon" title="Kingdom Rush" alt="Play Kingdom Rush" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0032/8367/KongregateThumb.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ironhidegames/kingdom-rush">Kingdom Rush</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="222987" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ninjakiwi/bloons-monkey-city"><img class="game_icon" title="Bloons Monkey City" alt="Play Bloons Monkey City" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0057/9167/MonkeyCity-250x200-KongIcon.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/bloons-monkey-city">Bloons Monkey City</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="171311" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/kurechii/the-kings-league-odyssey"><img class="game_icon" title="The King's League: Odyssey" alt="Play The King's League: Odyssey" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0045/5359/KongThum500400.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/kurechii/the-kings-league-odyssey">The King's League: Od...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/strategy-defense-games">7346&nbsp;more&nbsp;Strategy &amp; Defense games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/puzzle-games">Puzzle</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="322653" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/KekGames/unpuzzlex"><img class="game_icon" title="UnpuzzleX" alt="Play UnpuzzleX" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0069/9792/_______2020_06_08_00_09_18_518.gif?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/KekGames/unpuzzlex">UnpuzzleX</a>
  </p>
    <p class="browse_developer">by
      KekGames
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
    <p><em class="num_rating">(4.49 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="320582" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/masasgames/escape-game-computer-office-escape"><img class="game_icon" title="Escape Game - Computer Office Escape" alt="Play Escape Game - Computer Office Escape" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0069/7983/icon_kongregate.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/masasgames/escape-game-computer-office-escape">Escape Game - Compute...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="292356" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/KekGames/unpuzzle-2"><img class="game_icon" title="Unpuzzle 2" alt="Play Unpuzzle 2" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0067/4526/KongIcon.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/KekGames/unpuzzle-2">Unpuzzle 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="320577" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/VasantJ/medieval-chronicles-9-part-2"><img class="game_icon" title="Medieval Chronicles 9 (Part 2)" alt="Play Medieval Chronicles 9 (Part 2)" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0069/7980/TitleScreen.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/VasantJ/medieval-chronicles-9-part-2">Medieval Chronicles 9...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="323368" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/VasantJ/medieval-chronicles-8-part-2"><img class="game_icon" title="Medieval Chronicles 8 (Part 2)" alt="Play Medieval Chronicles 8 (Part 2)" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0070/0366/TitleScreen.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/VasantJ/medieval-chronicles-8-part-2">Medieval Chronicles 8...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/puzzle-games">39549&nbsp;more&nbsp;Puzzle games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/shooter-games">Shooter</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="216711" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ninjakiwi/sas-zombie-assault-4"><img class="game_icon" title="SAS: Zombie Assault 4" alt="Play SAS: Zombie Assault 4" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0062/1792/SAS4_250x200_KongIcon.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/sas-zombie-assault-4">SAS: Zombie Assault 4</a>
  </p>
    <p class="browse_developer">by
      Ninjakiwi
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
    <p><em class="num_rating">(4.50 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="174645" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/JuiceTin/strike-force-heroes-2"><img class="game_icon" title="Strike Force Heroes 2" alt="Play Strike Force Heroes 2" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0046/3246/250x200KONG.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/JuiceTin/strike-force-heroes-2">Strike Force Heroes 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="171560" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Tacticsoft/supermechs"><img class="game_icon" title="Supermechs" alt="Play Supermechs" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0067/8000/kong_bannerr.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Tacticsoft/supermechs">Supermechs</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="149599" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/JuiceTin/strike-force-heroes"><img class="game_icon" title="Strike Force Heroes" alt="Play Strike Force Heroes" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0039/3628/Kong_250_x_200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/JuiceTin/strike-force-heroes">Strike Force Heroes</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="49854" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/ArmorGames/upgrade-complete"><img class="game_icon" title="UPGRADE COMPLETE!" alt="Play UPGRADE COMPLETE!" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0009/8236/UCkongtile.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/ArmorGames/upgrade-complete">UPGRADE COMPLETE!</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/shooter-games">15373&nbsp;more&nbsp;Shooter games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->

  </div>
</div>
<div class="unit size1of2 lastUnit">
  <div class="plm">
    <!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/mmo-games">MMO</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="266462" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Juppiomenz/bit-heroes?haref=HP_MMO_bit-heroes"><img class="game_icon" title="Bit Heroes" alt="Play Bit Heroes" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes?haref=HP_MMO_bit-heroes">Bit Heroes</a>
  </p>
    <p class="browse_developer">by
      Juppiomenz
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
    <p><em class="num_rating">(4.53 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="227576" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/iouRPG/idle-online-universe?haref=HP_MMO_idle-online-universe"><img class="game_icon" title="Idle Online Universe" alt="Play Idle Online Universe" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0070/0972/IOUShot.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/iouRPG/idle-online-universe?haref=HP_MMO_idle-online-universe">Idle Online Universe</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:49px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="280206" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ninjakiwi/tower-keepers?haref=HP_MMO_tower-keepers"><img class="game_icon" title="Tower Keepers" alt="Play Tower Keepers" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0067/6994/TK_250x200_KongIcon.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/tower-keepers?haref=HP_MMO_tower-keepers">Tower Keepers</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:50px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="269125" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/OasisGames/naruto-online?haref=HP_MMO_naruto-online"><img class="game_icon" title="Naruto Online" alt="Play Naruto Online" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0068/4333/250-200.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/OasisGames/naruto-online?haref=HP_MMO_naruto-online">Naruto Online</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:48px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="240290" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/BDAEntertainment/realm-of-empires?haref=HP_MMO_realm-of-empires"><img class="game_icon" title="Realm of Empires: Warlords Rising" alt="Play Realm of Empires: Warlords Rising" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0067/0197/RoE_KeyArt250x200KongregateUpdate.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/BDAEntertainment/realm-of-empires?haref=HP_MMO_realm-of-empires">Realm of Empires: War...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:51px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/mmo-games">151&nbsp;more&nbsp;MMO games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/adventure-rpg-games">Adventure &amp; RPG</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="249627" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/SoulGame/swords-and-souls"><img class="game_icon" title="Swords and Souls" alt="Play Swords and Souls" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0063/9685/250x200_BETTER.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/SoulGame/swords-and-souls">Swords and Souls</a>
  </p>
    <p class="browse_developer">by
      SoulGame
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:60px;"></li>
    </ul>
    <p><em class="num_rating">(4.65 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="315580" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/kupo707/epic-battle-fantasy-5"><img class="game_icon" title="Epic Battle Fantasy 5" alt="Play Epic Battle Fantasy 5" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0069/3941/ebf5_kong_thumb.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/kupo707/epic-battle-fantasy-5">Epic Battle Fantasy 5</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:59px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="266462" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Juppiomenz/bit-heroes"><img class="game_icon" title="Bit Heroes" alt="Play Bit Heroes" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0070/1394/BHQ.gif?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Juppiomenz/bit-heroes">Bit Heroes</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="230534" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/DustinAux/the-enchanted-cave-2"><img class="game_icon" title="The Enchanted Cave 2" alt="Play The Enchanted Cave 2" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0059/1576/icon250x200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/DustinAux/the-enchanted-cave-2">The Enchanted Cave 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="258157" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Puffballs_United/fleeing-the-complex"><img class="game_icon" title="Fleeing the Complex" alt="Play Fleeing the Complex" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0064/7406/FtCIcon.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Puffballs_United/fleeing-the-complex">Fleeing the Complex</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/adventure-rpg-games">10881&nbsp;more&nbsp;Adventure &amp; RPG games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/action-games">Action</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="151307" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/TogeProductions/infectonator-2"><img class="game_icon" title="Infectonator 2" alt="Play Infectonator 2" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0040/0085/Infectonator2-250x200.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/TogeProductions/infectonator-2">Infectonator 2</a>
  </p>
    <p class="browse_developer">by
      TogeProductions
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
    <p><em class="num_rating">(4.42 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="136305" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/JuicyBeast/burrito-bison-revenge"><img class="game_icon" title="Burrito Bison Revenge" alt="Play Burrito Bison Revenge" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0044/9272/bb2_250x200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/JuicyBeast/burrito-bison-revenge">Burrito Bison Revenge</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="146097" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/BerzerkStudio/sands-of-the-coliseum"><img class="game_icon" title="Sands of the Coliseum" alt="Play Sands of the Coliseum" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0037/9618/Icon250x200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/BerzerkStudio/sands-of-the-coliseum">Sands of the Coliseum</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="110126" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/ArmorGames/elephant-quest"><img class="game_icon" title="Elephant Quest" alt="Play Elephant Quest" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0056/3372/elephantq.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/ArmorGames/elephant-quest">Elephant Quest</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="153727" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/JuicyBeast/knightmare-tower"><img class="game_icon" title="Knightmare Tower" alt="Play Knightmare Tower" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0040/7334/kt_250-200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/JuicyBeast/knightmare-tower">Knightmare Tower</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/action-games">31125&nbsp;more&nbsp;Action games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/multiplayer-games">Multiplayer</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="145629" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Ninjakiwi/sas-zombie-assault-3"><img class="game_icon" title="SAS: Zombie Assault 3" alt="Play SAS: Zombie Assault 3" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0037/7746/Kongregate_250x200_Icon.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Ninjakiwi/sas-zombie-assault-3">SAS: Zombie Assault 3</a>
  </p>
    <p class="browse_developer">by
      Ninjakiwi
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
    <p><em class="num_rating">(4.43 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="158665" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/kChamp/shellshock-live-2"><img class="game_icon" title="ShellShock Live 2" alt="Play ShellShock Live 2" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0042/2147/kongthumb.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/kChamp/shellshock-live-2">ShellShock Live 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="193858" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Rob_Almighty/bad-eggs-online-2"><img class="game_icon" title="Bad Eggs Online 2" alt="Play Bad Eggs Online 2" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0050/7259/BEO2_Thumb3.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Rob_Almighty/bad-eggs-online-2">Bad Eggs Online 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="218450" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/FunkyPear/gravitee-wars-online"><img class="game_icon" title="Gravitee Wars Online" alt="Play Gravitee Wars Online" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0056/8298/gwo_kong_icon_252x202.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/FunkyPear/gravitee-wars-online">Gravitee Wars Online</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="149963" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/rokawar/rush-team-free-fps-multiplayers"><img class="game_icon" title="Rush Team Free FPS Multiplayers" alt="Play Rush Team Free FPS Multiplayers" width="26" height="21" src="https://cdn1.kongcdn.com/game_icons/0058/2149/250_200_RT_Icon__copy.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/rokawar/rush-team-free-fps-multiplayers">Rush Team Free FPS Mu...</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/multiplayer-games">716&nbsp;more&nbsp;Multiplayer games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->
<!-- .category -->
<div class="category">
<dl>
  <dt><a href="https://www.kongregate.com/sports-racing-games">Sports &amp; Racing</a></dt>
  <dd class="browse_games">
    <table cellspacing="0" cellpadding="0" border="0">

          <tbody><tr data-game-impression-game-id="316009" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="0" class="game_hover js-game-hover graybg">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/siread/retro-bowl"><img class="game_icon" title="Retro Bowl" alt="Play Retro Bowl" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0069/4343/icon_200.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/siread/retro-bowl">Retro Bowl</a>
  </p>
    <p class="browse_developer">by
      siread
    </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:59px;"></li>
    </ul>
    <p><em class="num_rating">(4.60 avg.)</em></p>
</td>
</tr>


          <tr data-game-impression-game-id="115608" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="1" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/light_bringer777/learn-to-fly-2"><img class="game_icon" title="Learn to Fly 2" alt="Play Learn to Fly 2" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0025/7656/thumbnail-kong.jpg?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/light_bringer777/learn-to-fly-2">Learn to Fly 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:58px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="257414" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="2" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/light_bringer777/learn-to-fly-3"><img class="game_icon" title="Learn to Fly 3" alt="Play Learn to Fly 3" width="26" height="21" src="https://cdn4.kongcdn.com/game_icons/0064/6770/logo474x379_250x200ratio_.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/light_bringer777/learn-to-fly-3">Learn to Fly 3</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:57px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="45630" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="3" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/light_bringer777/learn-to-fly"><img class="game_icon" title="Learn to Fly" alt="Play Learn to Fly" width="26" height="21" src="https://cdn2.kongcdn.com/game_icons/0008/9816/thumb_LTF.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/light_bringer777/learn-to-fly">Learn to Fly</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:56px;"></li>
    </ul>
</td>
</tr>


          <tr data-game-impression-game-id="10110" data-game-impression-unit-type="top_games_by_category" data-game-impression-position="4" class="game_hover js-game-hover ">
<td class="sm_game_icon">
  <a href="https://www.kongregate.com/games/Jiggmin/platform-racing-2"><img class="game_icon" title="Platform Racing 2" alt="Play Platform Racing 2" width="26" height="21" src="https://cdn3.kongcdn.com/game_icons/0068/5571/pr2.png?i10c=img.resize(width:26,height:21)"></a>
</td>
<td class="browse_game_title">
  <p>
    <a class="truncate_one_line hover_game_info" href="https://www.kongregate.com/games/Jiggmin/platform-racing-2">Platform Racing 2</a>
  </p>
  </td>
  <td class="browse_rating">
    <ul class="star-rating spritegame">
      <li class="current-rating spritegame spriteall" style="width:55px;"></li>
    </ul>
</td>
</tr>

      <tr>
       <td colspan="3" class="category_count">
         <a class="viewall" href="https://www.kongregate.com/sports-racing-games">8472&nbsp;more&nbsp;Sports &amp; Racing games »</a>
       </td>
      </tr>
    </tbody></table>
  </dd>
</dl>
</div><!-- /.category -->

  </div>
</div>
</div>

          </div>
      </div>
      <div class="unit size1of3 lastUnit">
        <div id="game_spotlights_pod" class="games_pod mhm mbl pbl">
          <div class="pod_header clearfix">
            <h2>Game Spotlights</h2>
          </div>
          <h6 class="h6 game_spotlights_heading mbs">Sponsored Listings</h6>
          <div id="kong_home_bf_281x90_1-ad-slot" class="ad-container premium_viewable"><script>
//<![CDATA[
kong_ads.displayAd("kong_home_bf_281x90_1");
//]]>
</script></div>
          <div id="kong_home_bf_281x90_2-ad-slot" class="ad-container premium_viewable"><script>
//<![CDATA[
kong_ads.displayAd("kong_home_bf_281x90_2");
//]]>
</script></div>
          <div id="kong_home_bf_281x90_3-ad-slot" class="ad-container premium_viewable"><script>
//<![CDATA[
kong_ads.displayAd("kong_home_bf_281x90_3");
//]]>
</script></div>
            <span class="horz-spotlight--upsell__wrapper">
  <h6 class="h6 game_spotlights_heading mtm mbs">Promoted Listings</h6>
  <span id="sane_browser_gamespotlight">
    <article class="horz-spotlight horz-spotlight--upsell">
      <a href="https://kong.zendesk.com/hc/en-us/articles/360043995471" class="horz-spotlight__link">
        <img alt="" class="horz-spotlight__img" src="https://cdn4.kongcdn.com/images/presentation/promo-upsell.png">
        <h3 class="horz-spotlight__title">
          Hey Developers!
        </h3>
        <p class="horz-spotlight__desc">
          Did you know you can promote your games in special listings around Kongregate using Blocks?
        </p>
        <span class="horz-spotlight__play">
          Learn more »
        </span>
      </a>
    </article>
  </span>
</span>

<script>
//<![CDATA[

  (function() {
      var displayUpsell = function(user) {
        if (user.isDeveloper()) {
          document.querySelector('.horz-spotlight--upsell__wrapper').classList.add('is-visible');
        }
      }

      if (active_user) {
        displayUpsell(active_user);
        active_user.addRunWhenAuthenticatedObserver(displayUpsell);
      }
  })();

//]]>
</script>
        </div>
        <div id="kongregate_social_connect_pod" class="mhm">
          <div class="pod_header clearfix">
            <h2>Stay Informed</h2>
          </div>
            <div class="pod_container">
              <a title="Sign in with Facebook" class="facebook_signin_large sprite_facebook mvl" onclick="new FacebookAuthenticator({}); return false;" href="#">Connect with Facebook</a>
              <div class="fb-facepile" data-size="medium" data-max-rows="1" data-width="270"></div>
            </div>
          <div class="pod_container twitter_container">
            <a href="https://twitter.com/kongregate" class="twitter-follow-button" data-show-count="true" data-size="large" data-lang="en">Follow @twitterapi</a>
          </div>
        </div>
      </div>
      <div id="extra_games" class="browse-by-category clear size1of1 unit">
        <!-- Extra games from infinite scroll are added here -->
      </div>
      <div id="show_more_categories" class="clear showmore_sprite">
        <div id="show_more_link">
          <a class="h6 h6_alt mhm pbs large_show_more_link" href="#" onclick="; return false;"><span class="large_show_more_area pam">Show More<span class="large_show_more_icon showmore_sprite"></span></span></a>
        </div>
        <div id="show_more_spinner" style="display: none;">
          <span class="spinner spinner_big">loading</span>
        </div>
      </div>
    </div>
    <!-- Browse By Category End -->
  </div>
  <!-- Pod Container End -->
</div>

      </td>
      <td id="skin_right_of_game"></td>
    </tr>
  </tbody></table>
</div>
`;

    var v1=0, v2=0, v3=0, v4=0, v5=0, v6=0, v7=0, v8=0, v9=0, v10=0;
    var targetNode = document;
    var config = { childList: true, subtree: true };
    var callback = (mutationList, observer) => {
        for (let mutation of mutationList) {
            for(let node of mutation.addedNodes){
                if (mutation.type === 'childList') {
                    if(v1==0 && node.tagName=="K-NAVBAR"){
                        v1=1;
                        let n=document.createElement("div");
                        n.id="headerwrap";
                        n.innerHTML = headerWrap;
                        node.parentElement.insertBefore(n, node);
                        node.remove();
                        TimeToLogin(unsafeWindow.active_user);
                        fill_games_tab(50,unsafeWindow.navigationData);
                        replace_css(!is_unsupported() || GM_getValue("enable_on_unsupported",false));
                        replace_favicon();
                    }
                    else if(v1==1 && node.tagName=="K-NAVBAR"){
                        node.remove();
                        // Note: sitewide_javascripts will raise the following exception: Uncaught TypeError: t(...).parentNode is null
                        // This does not seem to cause any issue besides polluting the console.
                    }
                    else if(v2==0 && node.id=="footer" && node.tagName=="K-FOOTER"){
                        v2=1;
                        let n=document.createElement("div");
                        n.id="footer";
                        n.classList.add("clearfix");
                        n.innerHTML = footer;
                        node.parentElement.insertBefore(n, node);
                        node.remove();
                    }
                    else if (v3==0 && node?.classList?.contains("sr-only")){
                        v3=1;
                        node.style.display="none"; // This hides the new "Play [game] at Kongregate!" div, that is only visible with the old style.
                    }
                    else if (v4==0 && 0==1){
                        v4=1;
                        // FREE
                    }
                    else if(v5==0 && node.id=="floating_game_holder"){
                        v5=1;
                        document.getElementById("floating_game_holder").parentNode.style.backgroundColor="#2b2b2b";
                        document.getElementsByClassName("gamepage_header_outer")[0].classList.add("mbm"); // space between game name and the game
                        document.getElementsByClassName("gamepage_header_outer")[0].classList.add("pbm"); // space between game name and the game
                        node.parentNode.classList.add("upper_gamepage"); // To add space right below the game
                    }
                    else if(v6==0 && node.id=="global"){ // Changes from December 14th, 2023 moved game page banners below games
                        v6=1;
                        let pN=document.getElementById("progress_bar_target").parentNode;
                        pN.insertBefore(node,document.getElementById("progress_bar_target"));
                        let n=document.createElement("div");
                        n.classList.add("gamepage_categories_outer");
                        pN.insertBefore(n,node); // This node contained links to game categories, for the moment it will be added empty, for the margin.
                    }
                    else if(v7==0 && 0==1){
                        v7=1;
                        // FREE
                    }
                    else if(v8==0 && document.URL=="https://www.kongregate.com/" && node.tagName=="MAIN"){
                        v8=1;
                        document.addEventListener("DOMContentLoaded",function(){ replace_homepage_banners(node,homepage_primarywrap); });
                    }
                    else if(v9==0 && node==document.body && document.getElementById("home")){
                        v9=1;
                        node.classList.remove('lang_other', 'lang_en');
                        node.classList.add('new_home', 'no_subwrap', 'grid960');
                    }
                    else if(v10==0 && (node.src||"").search("konstruct.min.js")>-1){
                        v10=1;
                        if( !is_unsupported() || GM_getValue("enable_on_unsupported",false) ){
                            node.remove();
                        }
                    }
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    ThingsToDoAtTheEnd(unsafeWindow.holodeck);

})();
