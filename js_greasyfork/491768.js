// ==UserScript==
// @name         Last.fm Mini Artist Tags
// @namespace    http://thlayli.detrave.net
// @description  Adds miniature top tags to library artists pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      http://code.jquery.com/jquery-1.9.0.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-address@1.6.0/src/jquery.address.min.js
// @match        https://www.last.fm/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @version      1.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491768/Lastfm%20Mini%20Artist%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/491768/Lastfm%20Mini%20Artist%20Tags.meta.js
// ==/UserScript==

// set this to true to erase the stored API key (then change it back to true)
var reset_api_key = false;

var i = 0;
var ran_once = false;
var queued_artists = [];
var used_rows = [];
var api_key = GM_getValue("lastfm-api-key", "");

function get_toptags(artist){
    if(queued_artists.indexOf(artist) != -1){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist="+encodeURIComponent(artist)+"&api_key="+api_key+"&format=json",
            responseType: "json",
            onload: data => {
                queued_artists.splice(queued_artists.indexOf(artist),1);
                if(data.response.toptags){
                    var toptags = data.response.toptags.tag.slice(0,5).map(t => [t.name,t.url]);
                    var artist_link = $(".chartlist-row").find($("a[title='"+artist+"']"));
                    var span = document.createElement("span");
                    span.style = "margin-left: 0.5em; display: block; width: 50%";
                    span.innerHTML = '<section class="catalogue-tags" style="transform-origin: top left; transform: scale(0.7); margin-top: 0.3em;"><ul class="tags-list tags-list--global">'+toptags.map(t => '<li class="tag" style="margin-left: 5px;"><a style="padding-left: 0.7em; padding-right: 0.7em;" href="'+t[1].toLowerCase()+'">'+t[0].toLowerCase()+'</a></li>').join('')+'</ul></section>';
                    artist_link[0].after(span)
                }else{
                    console.log(data.response);
                }
            }
        });
    }
}

function main_func() {

    if(reset_api_key == true && GM_getValue("lastfm-api-key","") != ""){
        if(confirm("Do you really want to remove your existing API key from Last.fm Mini Artist Tags?")){
            GM_deleteValue("lastfm-api-key","")
        }else{
            reset_api_key = false;
        }
    }

   if(GM_getValue("lastfm-api-key","") == ""){

       $(".metadata-item").append('<div id="api_div" style="margin-top: 1em;">Enter a <a href="https://www.last.fm/api#getting-started">Last.fm API key</a> to activate Mini Artist Tags: <input id="gm_apikey" type="text"> <input type="button" id="gm_storekey" value="Save"></div>');
       $("#gm_storekey").click(function (){
           GM_setValue("lastfm-api-key",$("#gm_apikey").val());
           $("#api_div").remove();
           reset_api_key = false;
           main_func();
       });
       // stop checking for tags until we have an API key
       return false;

   }else{

       if($(".catalogue-tags").length == 0 && queued_artists.length == 0){

           $(".chartlist-row").each(function (){
               $(this).find($(".chartlist-name"))[0].style = "height: 4em;"
               var artist = $(this).find($(".chartlist-name > .link-block-target"));
               if(artist.text())
                   queued_artists.push(artist.text());
           });

           GM_addStyle(".chartlist-row { min-height: 61px; }");

           if($(".catalogue-tags").length == 0){
               queued_artists.map(function (artist){
                   setTimeout(function () {
                       if(queued_artists.includes(artist)){
                           //console.log("Loading tags for #"+(queued_artists.indexOf(artist)+1)+": "+artist);
                           get_toptags(artist);
                       }
                   }, 200 * i);

               });
           }
       }
   // allow waitforkeyelements to run again
   return true;
   }
};

$.address.change(function(event) {
    if($(".catalogue-tags").length == 0 && queued_artists.length == 0)
      waitForKeyElements('section[data-endpoint*="/library/artists"]', main_func);
});