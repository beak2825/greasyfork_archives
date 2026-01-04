// ==UserScript==
// @name         From KissAnime to MAL
// @version      1.0
// @description  Generates an xml-File from KissAnime Bookmarks that can be imported to MAL. The original script was created by Hentai God(GreasyFork) / Thorus111(reddit) / TheTh0rus(self named) and just modified by me to fix some issues and fit my needs.
// @author       TheBerzzeker
// @match        *://kissanime.ru/BookmarkList*
// @connect      myanimelist.net
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @namespace https://greasyfork.org/users/294634
// @downloadURL https://update.greasyfork.org/scripts/382226/From%20KissAnime%20to%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/382226/From%20KissAnime%20to%20MAL.meta.js
// ==/UserScript==

function XMLWriter(a,b){if(a)this.encoding=a;if(b)this.version=b};(function(){XMLWriter.prototype={encoding:'ISO-8859-1',version:'1.0',formatting:'indented',indentChar:'\t',indentation:1,newLine:'\n',writeStartDocument:function(a){this.close();this.stack=[];this.standalone=a},writeEndDocument:function(){this.active=this.root;this.stack=[]},writeDocType:function(a){this.doctype=a},writeStartElement:function(c,d){if(d)c=d+':'+c;var a=this,b=a.active,e={n:c,a:{},c:[]};if(b){b.c.push(e);this.stack.push(b)}else a.root=e;a.active=e},writeEndElement:function(){this.active=this.stack.pop()||this.root},writeAttributeString:function(a,b){if(this.active)this.active.a[a]=b},writeString:function(a){if(this.active)this.active.c.push(a)},writeElementString:function(a,b,c){this.writeStartElement(a,c);this.writeString(b);this.writeEndElement()},writeCDATA:function(a){this.writeString('<![CDATA['+a+']]>')},writeComment:function(a){this.writeString('<!-- '+a+' -->')},flush:function(){var a=this,b='',c='',d=a.indentation,e=a.formatting.toLowerCase()=='indented',f='<?xml version="'+a.version+'" encoding="'+a.encoding+'"';if(a.stack&&a.stack[0])a.writeEndDocument();if(a.standalone!==undefined)f+=' standalone="'+!!a.standalone+'"';f+=' ?>';f=[f];if(a.doctype&&a.root)f.push('<!DOCTYPE '+a.root.n+' '+a.doctype+'>');if(e){while(d--)b+=a.indentChar}if(a.root)k(a.root,c,b,f);return f.join(e?a.newLine:'')},close:function(){var a=this;if(a.root)j(a.root);a.active=a.root=a.stack=null},getDocument:window.ActiveXObject?function(){}:function(){return(new DOMParser()).parseFromString(this.flush(),'text/xml')}};function j(a){var l=a.c.length;while(l--){if(typeof a.c[l]=='object')j(a.c[l])}a.n=a.a=a.c=null};function k(a,b,c,d){var e=b+'<'+a.n,f=a.c.length,g,h,i=0;for(g in a.a)e+=' '+g+'="'+a.a[g]+'"';e+=f?'>':' />';d.push(e);if(f){do{h=a.c[i++];if(typeof h=='string'){if(f==1)return d.push(d.pop()+h+'</'+a.n+'>');else d.push(b+c+h)}else if(typeof h=='object')k(h,b+c,c,d)}while(i<f);d.push(b+'</'+a.n+'>')}}})();

var blobData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data) {
        var xml = data,
            blob = new Blob([xml], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        return url;
    };
}());

////////////////////////////////////
var NR_OF_THREADS = 10;
////////////////////////////////////

var current = 0;
var working = 0;

const all = document.getElementsByClassName("trAnime");
const animes = document.getElementsByClassName("aAnime");
var watching = 0;
var watchedcomplete = 0;
var ongoing = 0;
var unwatched = 0;
var notaired = 0;
var total = all.length;
var anime_ids = [];
var request_limit = 0;
var requests =[];

function init() {
    document.documentElement.innerHTML += "<div style='position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:white;color:black;text-align:center;z-index:100000;' id='BMMAL'></div>";
    var span = document.createElement("span");
    span.id = "counter";
    var bar = document.createElement("progress");
    bar.setAttribute("value", 0);
    bar.setAttribute("max", total);
    bar.style = "width: 100%;";
    bar.id = "bar";
    var alertEl = document.createElement("span");
    alertEl.id = "alertHolder";
    alertEl.style = "color: red;";
    document.getElementById("BMMAL").appendChild(bar);
    document.getElementById("BMMAL").appendChild(span);
    document.getElementById("BMMAL").appendChild(document.createElement("br"));
    document.getElementById("BMMAL").appendChild(alertEl);
    table_initialize();
    for(var i = 1; i <= NR_OF_THREADS; i++){ requests.push(0); mainLoop(i);}
}

var v = new XMLWriter();
v.encoding = "UTF-8";
v.writeStartDocument(true);
v.writeStartElement('myanimelist');

function httpRequest(url, query, param, threadNum,episode) {
    GM.xmlHttpRequest({
        method: "GET",
        url: url + encodeURI(query),
        synchronous: true,
        headers: {
            "User-Agent": "Mozilla/5.0"
        },
        onload: function(response) {
            if(response.responseText.indexOf("Too Many Requests") == -1) {
                if(url.indexOf("anime.php") > -1) {
                    handleSearch(response.responseText, param, query, threadNum,episode);
                    console.log(current);
                } else {
                    handleAnime(response.responseText, param, url, threadNum,episode);
                }
            } else {

                --working;
                var cell = document.getElementById("thread" + threadNum);
                var timefunction;

                ++request_limit; requests[threadNum] = 1;
                if(request_limit==NR_OF_THREADS){
                    //addAlert("MAL refused access due to too many requests. Waiting 25 seconds... (Thread " + threadNum + ")");
                    time_decrease(cell,threadNum,25,timefunction);
                    //cell.innerHTML ='<p style="background-color:rgb(255, 106, 108);">Thread #' + threadNum + ' (Waiting 20 seconds.... Too many requests) </p>';
                    setTimeout(function() { mainLoop(threadNum); }, 25000);
                }
                else{
                    //addAlert("MAL refused access due to too many requests. Waiting 15 seconds... (Thread " + threadNum + ")");
                    time_decrease(cell,threadNum,15,timefunction);
                    //cell.innerHTML ='<p style="background-color:rgb(255, 106, 108);">Thread #' + threadNum + ' (Waiting 10 seconds.... Too many requests) </p>';
                    setTimeout(function() { mainLoop(threadNum); }, 15000);
                }

            }
        }
    });
}

function time_decrease(cell,i,time,func){
    cell.innerHTML ='<p style="background-color:rgb(255, 106, 108);">Thread #' + i + ' (Waiting ' + time + ' seconds.... Too many requests) </p>';
    --time;
    if(time > 0) setTimeout(time_decrease,1000,cell,i,time,func);
}


function handleSearch(data, param, query, threadNum,episode) {
    try {
        console.log("searching for '" + query + "'...");

        var link = true_name(data);
        console.log("found link: " + link);

        httpRequest(link, "", param, threadNum,episode);
    } catch(e) {
        console.log("Error:" +e);
        handleError("could not find anime '" + query + "'", threadNum);
    }
}

function true_name(data){
    var ok = true;
    var split = data.split(' <a class="hoverinfo_trigger" href="');
    var link = split[1].split('"')[0];
    var id = link.split("myanimelist.net/anime/")[1].split("/")[0];
    var nr=2;
        while(ok){
            if(anime_ids.findIndex(element => element === id)>-1){
                link = split[nr++].split('"')[0];
                id = link.split("myanimelist.net/anime/")[1].split("/")[0];
            }
            else ok =false;
        }
    anime_ids.push(id);
    return link;
}


function handleAnime(data, param, url, threadNum,episode) {
    try {
        console.log("handling anime: " + url);
        var watched = 0;
        if(param == "Completed") {
            watched = data.split('<span class="dark_text">Episodes:</span>')[1].split('</div>')[0];
        }else if (param == "Watching"){
            watched = episode;
        }
        v.writeStartElement('anime');
        v.writeElementString('series_animedb_id',""+url.split('https://myanimelist.net/anime/')[1].split('/')[0]+"");
        v.writeElementString('my_status',""+param+"");
        v.writeElementString('update_on_import','1');
        v.writeElementString('my_watched_episodes',""+watched+"");
        v.writeEndElement();
    } catch(e) {
        handleError("Scraping-error at " + url);
    }

    if(param == "Completed") {
                    ++watchedcomplete;
    } else if (param == "Plan to Watch") {
                    ++unwatched;
    } else if (param == "Watching"){
                    ++watching;
    }

    ++current;
    document.getElementById("bar").value += 1;
    document.getElementById("counter").innerHTML = "<b>" + current + " / " + total + "</b>";
    mainLoop(threadNum);
}



function handleError(msg, threadNum) {
    console.log(msg);
    addAlert(msg);
    mainLoop(threadNum);
}

function addAlert(txt) {
    document.getElementById("alertHolder").innerHTML += "<br>" + txt;
}

function mainLoop(threadNum) {
    var i = working;

    if(requests[threadNum] == 1){
        requests[threadNum] = 0;
        --request_limit;
        document.getElementById("thread" + threadNum).innerHTML = '<p style="background-color:rgb(60, 179, 113);">Thread #' + threadNum + '</p>';
    }

    if(i < animes.length) {

        var title = animes[i].innerHTML;
        title = title.replace(' (Dub)','');
        title = title.replace(' (Sub)','');
        title = title.replace('(Dub)','');
        title = title.replace('(Sub)','');
        title = title.replace('                 ','');
        title = title.replace('                ','');
        title = title.replace('  ','');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');

        ++working;

        if(all[i].innerHTML.indexOf("Completed") > -1){ //completed

            if(all[i].innerHTML.indexOf('style="display: inline" class="aRead"') > -1){
            httpRequest("http://myanimelist.net/anime.php?q=", title, "Completed", threadNum,0);

            }else if(all[i].innerHTML.indexOf('style="display: inline" class="aUnRead"') > -1) {
            httpRequest("http://myanimelist.net/anime.php?q=", title, "Plan to Watch", threadNum,0);
            }

        } else if (all[i].innerHTML.indexOf("Not yet aired") > -1){ //not yet aired
            httpRequest("http://myanimelist.net/anime.php?q=", title, "Plan to Watch", threadNum,0);
        }
        else {//ongoing

            if(all[i].innerHTML.indexOf('style="display: inline" class="aRead"') > -1){

                var epnumber = 0;
                if(all[i].innerHTML.indexOf('">Episode') > -1){
                epnumber = parseInt(all[i].innerHTML.split('">Episode')[1].split("</a>")[0]);
                }

            httpRequest("http://myanimelist.net/anime.php?q=", title, "Watching", threadNum,epnumber);

            }else if(all[i].innerHTML.indexOf('style="display: inline" class="aUnRead"') > -1) {
            httpRequest("http://myanimelist.net/anime.php?q=", title, "Plan to Watch", threadNum,0);
            }
        }
    } 

}


setInterval(function() {

    if(current == total) {
        v.writeStartElement('myinfo');

        v.writeElementString('user_export_type','1');
        v.writeElementString('user_total_anime',""+total+"");
        v.writeElementString('user_total_watching', ""+watching+"");
        v.writeElementString('user_total_completed',""+watchedcomplete+"");
        v.writeElementString('user_total_onhold','0');
        v.writeElementString('user_total_dropped','0');
        v.writeElementString('user_total_plantowatch',""+unwatched+"");

        v.writeEndElement();
        v.writeEndElement();
        v.writeEndDocument();
        document.getElementById("BMMAL").innerHTML = "<h3><a href='" + blobData(v.flush().replace('"true"','"yes"')) + "' id='MALdl' style='color:blue;font-weight:bold;' download='importToMAL.xml'>Download</a></h3>";


        current = 100000;
    } }, 1000);


/* Functions for creating a DIV table */
function table_initialize(){
    var table = document.createElement("DIV");
    table.className = "table";
    document.getElementById("BMMAL").appendChild(table);

    for(var i=1;i<=NR_OF_THREADS;++i){

        var row = addRow(table);

        var cell;
        cell = addCell(row,'<p style="background-color:rgb(60, 179, 113);">Thread #' + i + '</p>');
        cell.id = "thread" + i;

    }
}

//Method for adding a row
function addRow(table){
    var row=document.createElement("DIV");
    row.className = "table_row";
    table.appendChild(row);
    return row;
}
//Method for adding cells
function addCell(row,content){
    var cell = document.createElement("DIV");
    cell.className = "table_content";
    cell.innerHTML = content;
    row.appendChild(cell);
    return cell;
}




init();