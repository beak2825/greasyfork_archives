// ==UserScript==
// @name         AppleTV+ Subtitle
// @version      0.0.1
// @description  BETA: Permet de DL les sous titres sur AppleTV+
// @author       Tesla/Poseidon/Keevar
// @match        https://tv.apple.com/fr/show/*
// @match        https://tv.apple.com/fr/episode/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @namespace    https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/391923/AppleTV%2B%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/391923/AppleTV%2B%20Subtitle.meta.js
// ==/UserScript==

(function(open) {
    var LANG = "fr-FR";
    var URL_noforced = "";
    var URL_forced = "DISABLE";
    var title = "";
    var ep_title = "";

    var json_episodes = null;
    var episode_info = null;

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState==4 && this.responseURL.indexOf("/episodes?")!== -1){
                var reader = new FileReader();
                reader.onload = function() {
                    if (json_episodes==null)
                        json_episodes=obj = JSON.parse(reader.result);
                    //console.log(reader.result);
                }
                reader.readAsText(this.response);
            }
            if (json_episodes ==null && episode_info ==null && this.readyState==4 &&
                this.responseURL.indexOf("https://tv.apple.com/api/uts/v2/view/product/")!== -1 &&
                this.responseURL.indexOf("?utsk=")!== -1){
                var reader = new FileReader();
                reader.onload = function() {
                    if (episode_info==null)
                        episode_info=obj = JSON.parse(reader.result);
                    //console.log(reader.result);
                }
                reader.readAsText(this.response);
            }
            else if (this.readyState==4 && this.responseURL.indexOf("https://play.itunes.apple.com/WebObjects/MZPlay.woa/hls/subscription/playlist.m3u8?cc=")!== -1)
            {
                var ret = this.responseText;
                var doc = parseHtml(ret);
                let ligne = ret.split("\n");
                for (var i = 0; i < ligne.length; i++)
                {

                    if (title=="" && ligne[i].indexOf("com.apple.hls.title")!== -1)
                    {
                        let regex = /VALUE="(.*)"/gm;
                        let found = regex.exec(ligne[i]);
                        if (found && found.length==2)
                        {
                            title=found[1].split("\",")[0];
                        }
                    }
                    else if (ep_title=="" && ligne[i].indexOf("com.apple.hls.episode-title")!== -1)
                    {
                        let regex = /VALUE="(.*)"/gm;
                        let found = regex.exec(ligne[i]);
                        if (found && found.length==2)
                        {
                            ep_title=found[1].split("\",")[0];
                        }
                    }
                    // FR no forced
                    else if (URL_noforced=="" && ligne[i].indexOf("LANGUAGE=\""+LANG+"\"")!== -1 && ligne[i].indexOf("FORCED=NO")!== -1)
                    {
                        URL_noforced = getUrl(ligne[i]);
                        let subtitle = getText(URL_noforced);
                        let episodeID = getEpID(ep_title);
                        download("data:text/html,"+subtitle, episodeID+"__"+title+"_"+ep_title+".webvtt");
                    }
                    else if (URL_forced=="" && ligne[i].indexOf("LANGUAGE=\""+LANG+"\"")!== -1 && ligne[i].indexOf("FORCED=YES")!== -1)
                    {
                        URL_forced= getUrl(ligne[i]);
                        let subtitle = getText(URL_noforced);
                        let episodeID = getEpID(ep_title);
                        download("data:text/html,"+subtitle, episodeID+"__"+title+"_"+ep_title+"_FORCED.webvtt");
                    }
                    //LANGUAGE="fr-FR";
                    //FORCED=NO;
                    //URI="";
                }
            }



        }, false);
        open.apply(this, arguments);
    };

    function getUrl(ligne)
    {
        let regex = /URI="(.*)"/gm;
        let found = regex.exec(ligne);
        if (found && found.length==2)
        {
            let m3u_text = getText(found[1]);
            let m3u_text_ligne = m3u_text.split("\n");
            for (var j = 0; j < m3u_text_ligne.length; j++)
            {
                if (m3u_text_ligne[j].indexOf(".webvtt")!== -1)
                {

                    var to = found[1].lastIndexOf('/');
                    to = to == -1 ? found[1].length : to + 1;
                    var url_path = found[1].substring(0, to);
                    url_path = url_path+m3u_text_ligne[j];
                    return url_path
                }
            }
        }
    }

    function parseHtml(html) {

        // replace html, head and body tag with html_temp, head_temp and body_temp
        html = html.replace(/<!DOCTYPE HTML>/i, '<doctype></doctype>');
        html = html.replace(/(<\/?(?:html)|<\/?(?:head)|<\/?(?:body))/ig, '$1_temp');

        // wrap the dom into a <container>: the html() function returns only the contents of an element
        html = "<container>"+html+"</container>";
        var element = $(html); // parse the html

        return element;
    }

    function convertBackToHtml(element) {

        // reset the initial changes (_temp)
        var extended_html = element.html();
        extended_html = extended_html.replace(/<doctype><\/doctype>/, '<!DOCTYPE HTML>');
        extended_html = extended_html.replace(/(<\/?html)_temp/ig, '$1');
        extended_html = extended_html.replace(/(<\/?head)_temp/ig, '$1');
        extended_html = extended_html.replace(/(<\/?body)_temp/ig, '$1');

        // replace all &quot; inside data-something=""
        while(extended_html.match(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g)) {
            extended_html = extended_html.replace(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g, "$1'$3");
        }

        return extended_html;
    }

    function readStringLocalStorage(name){
        return localStorage.getItem("shout_"+name);
    }

    function readBoolLocalStorage(name){
        return (localStorage.getItem("shout_"+name) == 'true');
    }

    function readListLocalStorage(name){
        let value = localStorage.getItem("shout_"+name);
        if (value)
            return value.split(",");
        return;
    }

    function writeLocalStorage(name, value){
        localStorage.setItem("shout_"+name, value);
    }


    function download(dataurl, filename) {
        var a = document.createElement("a");
        a.href = dataurl;
        a.setAttribute("download", filename);
        a.click();
    }

    function getText(URL){
        var request = new XMLHttpRequest();
        request.open('GET', URL, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            return request.responseText;
        }
    }

    function getEpID(title_str)
    {
        if (episode_info!=null)
        {
            if (episode_info.data.content.title.indexOf(title_str)!== -1)
            {
                return "S"+('0' + episode_info.data.content.seasonNumber).slice(-2)+"E"+('0' + episode_info.data.content.episodeNumber).slice(-2)
            }
        }
        else if (json_episodes!=null)
        {
            for (var i = 0; i < json_episodes.data.episodes.length; i++)
            {
                if (json_episodes.data.episodes[i].title.indexOf(title_str)!== -1)
                {
                    return "S"+('0' + json_episodes.data.episodes[i].seasonNumber).slice(-2)+"E"+('0' + json_episodes.data.episodes[i].episodeNumber).slice(-2)
                }
            }
        }
        return "S..E..";
    }


})(XMLHttpRequest.prototype.open);