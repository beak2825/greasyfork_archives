// ==UserScript==
// @name         TVTime fast search episodes at many torrent sites
// @namespace    http://www.evertonleite.com
// @version      4.2
// @description  Create links on each to-watch episodes to easily search and download it from many torrent sites, like 1337x, The Pirate Bay, EZTV, RARBG and others, that you can manually choose as your favorite torrent provider.
// @author       Everton Leite
// @include      *www.tvtime.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11986/TVTime%20fast%20search%20episodes%20at%20many%20torrent%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/11986/TVTime%20fast%20search%20episodes%20at%20many%20torrent%20sites.meta.js
// ==/UserScript==

var providers = [
    {id: "1337x", label: "1337x", url: "http://1337x.to/search/", sufix: "/1/"},
    {id: "thepiratebay", label: "The Pirate Bay", url: "https://thepiratebay.org/search/", sufix: ""},
    {id: "rarbg", label: "RARBG", url: "http://rarbg.to/torrents.php?search=", sufix: ""},
    {id: "eztv", label: "EZTV", url: "https://eztv.ag/search/", sufix: ""},
    {id: "extratorrent", label: "Extra Torrent", url: "http://extratorrent.cc/search/?search=", sufix: ""},
    {id: "torrentdownloads", label: "Torrent Downloads", url: "https://www.torrentdownloads.me/search/?search=", sufix: ""},
    {id: "demonoid", label: "Demonoid", url: "http://www.dnoid.me/files/?query=", sufix: ""},
    {id: "torlock", label: "Torlock", url: "https://www.torlock.com/all/torrents/", sufix: ".html"}
];

$(document).ready(function(){
    var provider_html = "";
    provider_html += "<style>";
    provider_html += "#torrent-provider-button{ float: right; font-size: 10px; box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px; margin-top: -18px; margin-right: -10px; cursor: pointer; background-color: #444444; color: #ffd90e; padding: 0px 5px; border-radius: 3px; position: relative; z-index: 101; }";
    provider_html += "#torrent-provider-button:hover{ background-color: #666; }";
    provider_html += "#torrent-provider-list{ display: none; list-style: none; box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px; text-align: right; position: absolute; width: 90px; right: 2px; font-size: 10px; line-height: 11px; background: #ffda0e; border-radius: 3px; padding: 0; margin-top: -7px; padding-top: 4px; padding-bottom: 2px; z-index: 100; }";
    provider_html += "#torrent-provider-list li{ padding: 1px 3px 0px 0px; cursor: pointer; color: #444; }";
    provider_html += "#torrent-provider-list li:hover, #torrent-provider-list li.selected{ background-color: #444; color: #ffee51; }";
    provider_html += "</style>";
    provider_html += "<div id='torrent-provider-button'>";
    provider_html += "torrent provider";
    provider_html += "</div>";
    provider_html += "<ul id='torrent-provider-list'>";
    for (var i=0; i<providers.length; i++){
        provider_html += "<li identifier='" + providers[i].id + "'" + (getTorrentProviderCookie() == providers[i].id || (getTorrentProviderCookie() === "" && providers[i].id == "1337x") ? " class='selected'" : "") + ">" + providers[i].label + "</li>";
    }
    provider_html += "</ul>";
    $("#to-watch").prepend(provider_html);
    $("#torrent-provider-button").on("click", function(){
        $("#torrent-provider-list").slideToggle(200);
    });
    $("#torrent-provider-list li").on("click", function(){
        setCookie("torrent-provider", $(this).attr("identifier"), 365);
        $("#torrent-provider-list li").removeClass("selected");
        $(this).addClass("selected");
        $("#torrent-provider-list").slideUp(200);
        update_dl_links(true);
    });
    update_dl_links();
});

function update_dl_links(update_html_only){
    $(".dl_links").remove();
    $("#to-watch .secondary-link").each(function(){
        var episode = $(this).prev().children("a").html();
        if (episode.match(/^(a-Z)*S[0-9]+E[0-9]+/)){
            var name = $(this).html();
            if (name.indexOf("(") >= 0){
                name = name.substring(0, name.indexOf("(") - 1);
            }
            var base_url = torrentProvider().url;
            var sufix = torrentProvider().sufix;
            var url = encodeURIComponent(name + " " + episode);
            url = url.replace(/%26amp%3B/g, "%20").replace(/\./g, "%20").replace(/'/g, "").replace(/[%20]{5,}/g, ' ');
            var target = $(this).parent().parent().children(".nav");
            var style = "font-size: 12px; position: absolute; font-weight: 700; font-family: ProximaNova;";
            var dl_div = "<div class='dl_links' style='float: left; margin-top: -4px;'>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 1080p" + sufix + "' style='margin-left: 30px; " + style + "' target='_blank'>1080p</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + sufix + "' style='margin-top: 12px; margin-left: 30px; " + style + "' target='_blank'>see all</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 720p" + sufix + "' style='margin-top: 0px; " + style + "' target='_blank'>720p</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 2160p" + sufix + "' style='margin-top: 12px; " + style + "' target='_blank'>4K</a>";
            dl_div += "</div>";
            $(target).prepend(dl_div);
        }
    });
    if (update_html_only !== true){
        setTimeout(function(){
            update_dl_links();
        }, 3000);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getTorrentProviderCookie(){
    return getCookie("torrent-provider");
}

function torrentProvider(){
    for (var i=0; i<providers.length; i++){
        if (providers[i].id == getTorrentProviderCookie()){
            return providers[i];
        }
    }
    return providers[0];
}