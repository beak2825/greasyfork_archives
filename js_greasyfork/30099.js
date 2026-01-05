// ==UserScript==
// @name        TehConnection for Letterboxd
// @namespace   TODO github or userscript repo here.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @author      huck
// @description Implements torrent search results from Teh on Letterboxd film pages.
// @include     *letterboxd.com/*
// @version     0.1.1
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30099/TehConnection%20for%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/30099/TehConnection%20for%20Letterboxd.meta.js
// ==/UserScript==///**

this.$ = this.jQuery = jQuery.noConflict(true);

/*
USER SETTINGS
 */

// Teh login data
var username = 'CHANGE THIS';
var password = 'CHANGE THIS';

// Release scan settings - choose desired properties.
var scene = [true, false];
var resolution = ['Standard Def', '720p', '1080p', '1080i', '2160p'];
var codec = ['XviD', 'DivX', 'h.264', 'x264', 'DVDR', 'MPEG-2', 'AVC', 'VC-1'];

// Behaviour
var show_name = false; // Show full release name.
var show_dl = true; // Show direct download link.
var redirect = false; // Redirect 'USER/film/FILM_TITLE' to '/film/FILM_TITLE'.

/*
CODE
 */

// Teh API - made by me (huck), adjusted to userscript use.
var headers = {
    'Content-type': 'application/x-www-form-urlencoded',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'tehapi'
};

var TehAPI = function TehAPI(username, password){
    if (!(this instanceof TehAPI)) {
        return new TehAPI(username, password);
    }
    this.username = username;
    this.password = password;
    this.SERVER = 'https://tehconnection.eu';
    this.headers = headers;
};

TehAPI.prototype.login = function login(cb) {
    var LOGIN_PAGE = this.SERVER + '/login.php';
    GM_xmlhttpRequest({
        method: "POST",
        url: LOGIN_PAGE,
        headers: headers,
        data: "username=" + this.username + "&password=" + this.password,
        onload: cb
        });
};

TehAPI.prototype.get_group = function get_group(imdb, cb) {
    var PAGE = this.SERVER + '/upload.php';
    var params = "?action=get_group&imdb=" + imdb;
    GM_xmlhttpRequest({
        method: "GET",
        url: PAGE + params,
        headers: headers,
        onload: cb
    });
};

TehAPI.prototype.release_check = function release_check(group_id, scene, resolution, codec, cb) {
    var PAGE = this.SERVER + '/upload.php';
    var params = "?" +
        "action=dupe_check" +
        "&group=" + group_id +
        "&scene=" + scene +
        "&resolution=" + resolution +
        "&codec=" + codec;
    GM_xmlhttpRequest({
        method: "GET",
        url: PAGE + params,
        headers: headers,
        onload: cb
    });
};

TehAPI.prototype.release_search = function release_search(name, cb) {
    var PAGE = this.SERVER +  '/torrents.php';
    var params = "?" +
        "action=search" +
        "&release_name=" + name;
    GM_xmlhttpRequest({
        method: "GET",
        url: PAGE + params,
        headers: headers,
        onload: cb
    });
};

TehAPI.prototype.logout = function logout(cb) {
    var LOGOUT_PAGE = this.SERVER + '/logout.php';
    GM_xmlhttpRequest({
        method: "GET",
        url: LOGOUT_PAGE,
        headers: headers,
        onload: cb
    });
};


// Letterboxd implementation.
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

function get_imdb(href) {
    var from = href.indexOf("imdb.com/title/tt") + 17;
    if(from < 17)
        return null;
    var to = href.indexOf("/", from);
    if(to < 0)
        to = href.length;
    return href.substring(from, to);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function show_release(json_data, panel, info, direct_dl) {
    var release_item = document.createElement('li');
    var a = document.createElement("a");
    a.innerHTML=info.c +" / " + info.r;
    if (info.s) {
        a.innerHTML = a.innerHTML + " / Scene";
    }
    if (show_name)
        a.innerHTML = a.innerHTML + "<br />" + json_data.releases[0].name.replaceAll(".", ".\u200B");
    a.setAttribute('href', json_data.releases[0].url);
    a.setAttribute('target', "_blank");
    a.setAttribute('class', 'torrent');
    release_item.append(a);
    if (direct_dl !== undefined) {
        var a_dl = document.createElement("a");
        a_dl.innerHTML='<br />[DL]';
        a_dl.setAttribute('href', direct_dl);
        release_item.append(a_dl);
    }
    panel.append(release_item);
}

function xpath(query) {
    return document.evaluate(query, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

(function () {
    var href = window.location.href;
    if(!href.contains("letterboxd.com/film/") && href.contains("/film/") && redirect) {
        window.location.replace(window.location.protocol + unsafeWindow.filmData.path);
    }
    else if(href.contains("letterboxd.com/film/")){
        GM_addStyle("a.torrent {margin-right: 10px; margin-left: 10px;}");
        var imdbUrl = $(".text-link a").first().attr("href");
        var tc = new TehAPI(username, password);
        tc.login(tc.get_group(get_imdb(imdbUrl), function (response) {
            if(response.statusText == "OK"){
                var json_response = JSON.parse(response.responseText);
                if(json_response.status == "ok"){
                    var group_id = json_response.group_id;
                    if(group_id !== null){
                        var panel = $("#userpanel ul");
                        var panel_actual = panel[0];
                        for (var i = 0; i < scene.length; i++){
                            for (var j = 0; j < resolution.length; j++){
                                for (var k = 0; k < codec.length; k++) {
                                    (function(info) { // TODO Learn this.
                                        tc.release_check(group_id, Number(info.s), info.r, info.c, function (data) {
                                            var json_data = JSON.parse(data.responseText);
                                            if (json_data.status == "ok"){
                                                if (json_data.releases.length > 0){
                                                    if (show_dl) {
                                                        tc.release_search(json_data.releases[0].name, function (dl_data) {
                                                            var json_dl_data = JSON.parse(dl_data.responseText);
                                                            show_release(json_data, panel_actual, info, json_dl_data.releases[0].dl);
                                                        });
                                                    } else {
                                                        show_release(json_data, panel_actual, info);
                                                    }
                                                }
                                            }
                                        });
                                    })({s: scene[i], r: resolution[j], c: codec[k]});
                                }
                            }
                        }
                    } else {
                        throw "Film not found in TC library.";
                    }
                } else {
                    throw json_response.error;
                }
            } else {
                throw "Something went wrong";
            }
        }));
        tc.logout();
    }
})();