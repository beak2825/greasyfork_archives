// ==UserScript==
// @name         My Anime List: Mass Delete Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script adds a mass-delete button to the sidebar of your anime list, if you want to empty every single anime from your list. Please back-up your lists before use. I don't know if the script works with different versions/themes of anime lists.
// @author       TheBerzzeker
// @match        *://myanimelist.net/animelist/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382227/My%20Anime%20List%3A%20Mass%20Delete%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/382227/My%20Anime%20List%3A%20Mass%20Delete%20Button.meta.js
// ==/UserScript==

function initialize(){


    if(check()){

    var sidebar = document.getElementsByClassName("list-menu-float");
    var button1 = document.createElement("DIV");
    button1.className = "icon-menu export MassDelete";
    button1.addEventListener ("click", GetAllAnime, false);


    button1.innerHTML ='<svg class =  "icon icon-export MassDelete" left:"13px" top:"12px" version="1.1" width="21px" height="24px" viewBox="0 0 21 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <g transform = "translate(-1.000000, 0.000000)"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></g></svg>'
    button1.innerHTML += '<span class="text">Mass Delete</span>';
    sidebar[0].appendChild(button1);

    }
}

function check(){

   
   var header = document.getElementsByClassName("username");
   var username = header[0];
   console.log(username.innerHTML);

    if(username.innerHTML.includes("Your")){
        return true;}

    return false;


}

var allAnime = [];

function GetAllAnime(){ //gets all the ids from all the anime loaded on the page
var doc = document.documentElement.innerHTML.split("/ownlist/anime/");
var id;

    for(var i =1;i<doc.length;++i){
       id = doc[i].split("/")[0];
       allAnime.push(id);
    }

    if (confirm("This action will delete EVERY SINGLE anime entry in your anime list!\n\nThis action is NOT REVERSIBLE!\n\nPlease export your list for back-up before proceeeding. This can be done with the Export button in the sidebar.\n\nPress OK if you want to continue ERASING YOUR LIST.")) {

        if(confirm("Are you SURE you're SURE you want to DELETE EVERY ENTRY ON YOUR ANIME LIST , and you've backed it up?")){
        Erase();
            alert("Deleting List\n\nPlease refresh your page after a few seconds (up to a minute if you have a reaaaaaly long list)");
        }
        else alert("Well aren't you glad I added a double-check?");
    }
    else alert("NO anime was deleted from your list.\nYou can always back-up your list before doing anything rash!");


}

function Erase(){

    for(var i =0;i<allAnime.length;++i){
        var link = "/ownlist/anime/" + allAnime[i] + "/delete";
        console.log(link);
        var frame = create_frame(i);
        frame.addEventListener('load',post(link,frame));

    }


}

function create_frame(i){
    var iframe = document.createElement("iframe");
    iframe.setAttribute("name","script-frame"+i);
    document.getElementById("fancybox-inner").appendChild(iframe);

    return iframe;
}

var loaded = 0;
function post(path,frame) {
    var method = "post";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target",frame.name);

    document.body.appendChild(form);
    form.submit();

    ++loaded;
    if(loaded == allAnime.length) setTimeout(function(){location.reload();},5000);

}


initialize();