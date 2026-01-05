// ==UserScript==
// @name        Gazelle to bB Crossposter
// @description Fills the bB upload form with data from a Gazelle tracker
// @namespace   BlackNullerNS
// @include     http*://passtheheadphones.me/torrents.php*
// @include     http*://passtheheadphones.me/artist.php?id=*
// @include     http*://passtheheadphones.me/top10.php*
// @include     http*://apollo.rip/torrents.php*
// @include     http*://apollo.rip/artist.php?id=*
// @include     http*://apollo.rip/top10.php*
// @version     1.4
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/13016-bencode-encoder-decoder/code/Bencode%20encoderdecoder.js?version=79776
// @downloadURL https://update.greasyfork.org/scripts/12948/Gazelle%20to%20bB%20Crossposter.user.js
// @updateURL https://update.greasyfork.org/scripts/12948/Gazelle%20to%20bB%20Crossposter.meta.js
// ==/UserScript==

var removeTags = [
    "staff.picks"
];

var trackerUrl = 'https://' + window.location.hostname + '/';

var span, pos, lnk, announceLink, item;
var styleAdded = false;

var enableAllTorrents = GM_getValue("configEnableAllTorrents", false);

GM_registerMenuCommand("bB Crossposter: " + (enableAllTorrents ? "Limit to snatched torrents" : "Enable for all torrents"), function(){
    enableAllTorrents ? GM_deleteValue("configEnableAllTorrents") : GM_setValue("configEnableAllTorrents", true);
    location.reload();
});

var enableBacklinks = GM_getValue("configEnableBacklinks", false);

GM_registerMenuCommand("bB Crossposter: Toggle backlinks", function(){
    enableBacklinks = !enableBacklinks;
    if (enableBacklinks) {
        GM_setValue("configEnableBacklinks", true);
        alert("Backlinks enabled");
    } else {
        GM_deleteValue("configEnableBacklinks");
        alert("Backlinks disabled");
    }
});

var bb = document.createElement('a');
bb.textContent = '+bB';
bb.setAttribute('href', '#');
bb.setAttribute('title', 'Crosspost to bB');

var userId = document.getElementById('nav_userinfo').firstElementChild.getAttribute('href').split('?id=')[1];

if (document.location.href.indexOf('type=seeding&userid=' + userId) > -1 || document.location.href.indexOf('type=uploaded&userid=' + userId) > -1 || document.location.href.indexOf('type=leeching&userid=' + userId) > -1 || document.location.href.indexOf('type=snatched&userid=' + userId) > -1) {
    var t, torrents = document.getElementsByClassName('torrent_links_block');

    for (var i = 0, l = torrents.length; i < l; i++) {
        t = torrents.item(i);
        pos = t.lastElementChild.nextSibling;
        t.insertBefore(document.createTextNode(" | "), pos);

        lnk = bb.cloneNode(true);
        lnk.onclick = crossPostToBb;

        t.insertBefore(lnk, pos);
    }

    return;
}

if (enableAllTorrents) {
    var rows = document.querySelectorAll('a[title="Download"]');

    if (rows.length > 0) {
        for (var i = 0, l = rows.length; i < l; i++) {
            pos = rows.item(i);

            lnk = bb.cloneNode(true);
            lnk.onclick = crossPostToBb;

            if (pos.nextSibling) {
                pos.parentNode.insertBefore(lnk, pos.nextSibling);
                pos.parentNode.insertBefore(document.createTextNode(" | "), pos.nextSibling);
            } else {
                pos.parentNode.appendChild(document.createTextNode(" ["));
                pos.parentNode.appendChild(lnk);
                pos.parentNode.appendChild(document.createTextNode("]"));
            }
        }
        return;
    }

} else {
    var rows = document.querySelectorAll(".tl_snatched, .wcds_seeding, .wcds_snatched, .wcds_uploaded, .wcds_leeching");

    if (rows.length > 0) {
        for (var i = 0, l = rows.length; i < l; i++) {
            item = rows.item(i);

            if (item.classList.contains("tl_snatched")) {
                if (!item.parentNode.className) {
                    span = item.parentNode.parentNode.firstElementChild;
                } else {
                    continue;
                }
            } else {
                span = item.parentNode.firstElementChild;
            }

            pos = span.lastElementChild.nextSibling;
            span.insertBefore(document.createTextNode(" | "), pos);

            lnk = bb.cloneNode(true);
            lnk.onclick = crossPostToBb;

            span.insertBefore(lnk, pos);
        }

        return;
    }
}

function loadTorrentInfo(a, callback)
{
    var tr = a.closest('tr');

    var id = ('id' in tr && tr.id)
        ? tr.id.replace('torrent', '')
        : a.parentNode.firstElementChild.getAttribute('href').split('&id=')[1].split('&')[0];

	GM_xmlhttpRequest({
		url: trackerUrl + 'ajax.php?action=torrent&id=' + id,
		method: 'GET',
		onload: function(response){
            try {
    			var data = JSON.parse(response.responseText);

    			if (data.status !== 'success') {
    				alert('Request failed!');
    				return;
    			}
            } catch (e) {
                alert('Bad response from Gazelle API');
                return;
            }

            if (!('torrent' in data.response)) {
                alert('Unexpected response from Gazelle API');
                return;
            }

            callback(data.response);
		},
		onerror: function(response){
			alert('API request error!');
		},
		timeout: 7000,
		ontimeout: function(response){
			alert('API request timed out!');
		}
	});

    return false;
}

function getBacklink(data)
{
    return enableBacklinks ? "\nCrossposted from [url=" + trackerUrl + "torrents.php?id=" + data.group.id + "&torrentid=" + data.torrent.id + "]" + window.location.hostname + "[/url]" : "";
}

function crossPostToBb(data)
{
    var i;

    if (!('torrent' in data)) {
        return loadTorrentInfo(this, crossPostToBb);
    }

    if (!styleAdded) {
        var style = document.createElement("style");
        style.textContent = "#bbConfirm { color: #333; position:fixed;width:260px;top:50%;left:50%;margin-top:-5%;margin-left:-130px;padding:30px;display:inline-block;border:1px solid #666;border-radius:6px;-moz-box-shadow: 0px 0px 7px #2e2e2e;-webkit-box-shadow: 0px 0px 7px #2e2e2e;box-shadow: 0px 0px 7px #2e2e2e;background:#fff;text-align:center;z-index:200;transition:all 0.5s;transition-delay:0s; } "
            + "#bbConfirm button { border: 1px solid #aaa; cursor: pointer; padding: 3px 7px; border-radius: 3px; background-color: #f8f8f8; } "
            + "#bbConfirm button:hover { background-color: #f0f0f0; } "
            + "#bbConfirm a { color:#007DC6; } "
            + "#bbConfirm a:hover { color:#222; } ";
        document.head.appendChild(style);
        styleAdded = true;
    }

    var form = document.createElement('form');
    form.setAttribute('target', '_blank');
    form.setAttribute('method', 'post');
    form.setAttribute('action', 'https://baconbits.org/upload.php');

    input(form, 'type', data.group.categoryName);

    var artist = '';
    var groupName = data.group.name.replace(/&amp;/g, '&');

    if (data.group.categoryName === 'Music') {
        var media = data.torrent.media;
        if (media === 'WEB') media = 'Web';

        if (data.group.musicInfo.artists.length > 2) {
            artist = 'Various Artists';
        } else if (data.group.musicInfo.artists.length === 2) {
            artist = data.group.musicInfo.artists[0].name + ' & ' + data.group.musicInfo.artists[1].name;
        } else {
            artist = data.group.musicInfo.artists[0].name;
        }
        artist = artist.replace(/&amp;/g, '&');

        input(form, 'artist', artist);
        input(form, 'media', media);
        input(form, 'format', data.torrent.format);
        input(form, 'bitrate', data.torrent.encoding);

        if (data.torrent.remasterTitle) {
            input(form, 'remaster', 1);
            input(form, 'remaster_year', data.torrent.remasterYear);
            input(form, 'remaster_title', data.torrent.remasterTitle);
        }
    }

    var backLink = getBacklink(data);

    if (data.group.categoryName === 'Music' || data.group.categoryName === 'Audiobooks') {
        input(form, 'album_desc', strip(data.group.wikiBody));
        input(form, 'release_desc', strip(data.torrent.description + backLink));
    } else {
        input(form, 'desc', strip(data.group.wikiBody) + "\n" + strip(data.torrent.description + backLink));
    }

    input(form, 'submit', 'true');
    input(form, 'image', data.group.wikiImage);
    input(form, 'title', groupName);
    input(form, 'year', data.group.year);

    var tags = [];
    console.log(data.group.tags);
    for (i = 0; i < data.group.tags.length; i++) {
        console.log(data.group.tags[i]);
        if (removeTags.indexOf(data.group.tags[i]) === -1) {
            tags.push(data.group.tags[i]);
        }
    }

    input(form, 'tags', tags.join(', '));

    if (data.torrent.scene) {
        input(form, 'scene', 1);
    }

	var div = document.createElement("div");
	div.setAttribute("id","bbConfirm");

	var dl = document.createElement("a");
	dl.style.cursor = "pointer";
	dl.appendChild(document.createTextNode("Download modified torrent"));
    dl.onclick = function(){
    	GM_xmlhttpRequest({
    		url: trackerUrl + "torrents.php?action=download&id=" + data.torrent.id,
    		method: 'GET',
            responseType: "arraybuffer",
            timeout: 10000,
        	ontimeout: function() {
        		alert('Unable to fetch the torrent!');
        	},
        	onerror: function() {
        		alert('Unable to fetch the torrent!');
        	},
    		onload: function(response){
                var filename = (artist ? artist + " - " : "") + groupName + (data.group.year ? " (" + data.group.year + ")" : "") + (data.torrent.format ? " [" + data.torrent.format + (data.torrent.format === "MP3" ? " " + data.torrent.encoding : "") + "]" : "") + " [bB].torrent";

                if (announceLink) {
                    downloadTorrent(response.response, filename);
                    return;
                }

                var binary = response.response;

            	GM_xmlhttpRequest({
            		url: "https://baconbits.org/upload.php",
            		method: 'GET',
            		onload: function(response){
                        announceLink = response.responseText.split('http://tracker.baconbits.org:34000/')[1].split('/')[0];
                        announceLink = 'http://tracker.baconbits.org:34000/' + announceLink + '/announce';
                        downloadTorrent(binary, filename);
                    },
                    timeout: 10000,
                    ontimeout: function() {
                		alert('Unable to fetch announce link!');
                	},
                    onerror: function() {
                		alert('Unable to fetch announce link!');
                	}
                });
            }
        });
    };

    var dldiv = document.createElement("div");
    dldiv.style.marginBottom = '18px';
    dldiv.appendChild(dl);

	var search = document.createElement("div");
    search.style.marginBottom = '18px';
    search.textContent = 'Searching bB...';

    var btnText = "Repost to bB";

	var btn = document.createElement("button");
	btn.type = "submit";
	btn.appendChild(document.createTextNode(btnText));

	var a = document.createElement("a");
	a.style.cursor = "pointer";
	a.appendChild(document.createTextNode("Cancel"));

    div.appendChild(search);
    div.appendChild(dldiv);
    div.appendChild(btn);
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
    div.appendChild(a);

    form.appendChild(div);

	document.body.appendChild(form);

    if (data.torrent.hasLog && (trackerUrl.indexOf('passtheheadphones') > -1 || trackerUrl.indexOf('apollo') > -1)) {
        btn.textContent = 'Loading LOG, please wait...';
        btn.setAttribute('disabled', true);

        var logUrl = trackerUrl.indexOf('passtheheadphones') > -1
            ? trackerUrl + 'torrents.php?action=loglist&torrentid=' + data.torrent.id
            : trackerUrl + 'torrents.php?action=viewlog&torrentid=' + data.torrent.id;

    	GM_xmlhttpRequest({
    		url: logUrl,
    		method: 'GET',
    		onload: function(response){
                if (response.responseText.indexOf('<pre') === -1) {
                    return;
                }

                var dom = document.createElement("div");
                dom.insertAdjacentHTML("afterbegin", response.responseText.replace(/<img /g, '<meta '));
                var logs = dom.getElementsByTagName("pre");

                if (logs.length > 0) {
                    var release_desc = data.torrent.description ? strip(data.torrent.description) + "\n\n" : "";
                    for (var i = 0, l = logs.length; i < l; i++) {
                        release_desc += "[spoiler=LOG][pre]" + decodeHTML(logs.item(i).textContent) + "[/pre][/spoiler]\n";
                    }
                    input(form, 'release_desc', (release_desc.trim() + backLink).trim());
                }

                btn.removeAttribute('disabled');
                btn.textContent = btnText;
    		},
    		onerror: function(response){
                btn.textContent = btnText;
                btn.removeAttribute('disabled');
                alert('LOG request error!');
    		},
    		timeout: 7000,
    		ontimeout: function(response){
                btn.textContent = btnText;
                btn.removeAttribute('disabled');
                alert('LOG request timed out!');
    		}
    	});
    }
    
	form.onsubmit = function(){
        setTimeout(function(){
            form.parentNode.removeChild(form);
        }, 1000);
	};

	a.onclick = function(){
        form.parentNode.removeChild(form);
	};

    var url = data.group.categoryName === 'Music'
        ? 'https://baconbits.org/torrents.php?artistname='+ encodeURIComponent(artist) +'&action=advanced&torrentname='+ encodeURIComponent(groupName) +'&format='+ encodeURIComponent(data.torrent.format) +'&disablegrouping=1'
        : 'https://baconbits.org/torrents.php?disablegrouping=1&searchstr=' + encodeURIComponent(groupName);

	GM_xmlhttpRequest({
		url: url,
		method: 'GET',
		onload: function(response){
            if (response.responseText.indexOf('action=download') === -1) {
                search.innerHTML = '<a href="'+ url +'" target="_blank">No duplicates found on bB, go ahead!</a>';
                return;
            }

            div.style.width = '600px';
            div.style.marginLeft = '-300px';

            var searchLink = document.createElement('a');
            searchLink.setAttribute('href', url);
            searchLink.setAttribute('target', '_blank');
            searchLink.style.fontWeight = 'bold';
            searchLink.textContent = 'Found on bB:';

            search.textContent = '';
            search.appendChild(searchLink);
            search.appendChild(document.createElement('br'));

            var dom = document.createElement("div");
            dom.insertAdjacentHTML("afterbegin", response.responseText.replace(/<img /g, '<meta '));

            var td, a, row, results = dom.getElementsByClassName("torrent");

            for (var i = 0, l = results.length; i < l; i++) {
                td = results.item(i).firstElementChild.nextElementSibling;

                remove(td.firstElementChild);
                remove(td.lastElementChild);

                while (td.lastElementChild.tagName === 'BR') {
                    remove(td.lastElementChild);
                }

                row = document.createElement('div');
                row.innerHTML = td.innerHTML + ' [' + td.nextElementSibling.nextElementSibling.nextElementSibling.textContent + ']';

                row.firstElementChild.setAttribute('href', 'https://baconbits.org/' + row.firstElementChild.getAttribute('href'));

                if (row.firstElementChild.nextElementSibling) {
                    row.firstElementChild.nextElementSibling.setAttribute('href', 'https://baconbits.org/' + row.firstElementChild.nextElementSibling.getAttribute('href'));
                }

                search.appendChild(row);
            }

		},
		timeout: 7000,
		ontimeout: function(response){
            search.textContent = 'bB request timed out!';
		}
	});

    return false;
}

function downloadTorrent(binary, filename)
{
    var str = '';
    var data_str = new Uint8Array(binary);
    for (var i = 0, l = data_str.length; i < l; ++i) {
        str += String.fromCharCode(data_str[i]);
    }

    var torrent = bencode.decode(str);

    torrent.info.unique = random_string(30);
    torrent.announce = announceLink;

    var uri = "data:application/x-bittorrent;base64," + btoa(bencode.encode(torrent));

    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = decodeHTML(filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function remove(node)
{
    node.parentNode.removeChild(node);
}

function val2key(val, array)
{
    for (var key in array) {
        this_val = array[key];
        if(this_val == val){
            return key;
            break;
        }
    }
}

function input(form, name, value)
{
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);

    form.appendChild(input);
}

function strip(html)
{
    html = html.replace(/<a href="javascript:void\(0\);" onclick="BBCode\.spoiler\(this\);">Show<\/a>/g, '');
    html = html.replace(/<blockquote class="[^"]*?spoiler[^"]*?">([.\s\S]+?)<\/blockquote>/g, "[spoiler]$1[/spoiler]");
    html = html.replace(/<a.*?href="[a-z]+.php\?[^"]+".*?>(.+?)<\/a>/g, "$1");

    html = html.replace(/<a.*?href="([^"]+)".*?>(.+?)<\/a>/g, "[url=$1]$2[/url]");
    html = html.replace(/<img.*?src="([^"]+)".*?>/g, "[img]$1[/img]");
    html = html.replace(/<span class="size(\d+)">(.+?)<\/span>/g, "[size=$1]$2[/size]");
    html = html.replace(/<span style="color: ([^"]+?);">(.+?)<\/span>/g, "[color=$1]$2[/color]");
    html = html.replace(/<ol.*?>(.+?)<\/ol>/g, "[list=1]\n$1[/list]");
    html = html.replace(/<ul.*?>(.+?)<\/ul>/g, "[list]\n$1[/list]");
    html = html.replace(/<li.*?>(.+?)<\/li>/g, "[*]$1\n");
    html = html.replace(/<b>(.+?)<\/b>/g, "[b]$1[/b]");
    html = html.replace(/<strong>(.+?)<\/strong>/g, "[b]$1[/b]");
    html = html.replace(/<i>(.+?)<\/i>/g, "[i]$1[/i]");
    html = html.replace(/<em>(.+?)<\/em>/g, "[i]$1[/i]");
    html = html.replace(/<s>(.+?)<\/s>/g, "[s]$1[/s]");
    html = html.replace(/<u>(.+?)<\/u>/g, "[u]$1[/u]");

    html = html.replace(/\[hide/g, "[spoiler");
    html = html.replace(/\[\/hide\]/g, "[/spoiler]");

    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    tmp = tmp.textContent || tmp.innerText || "";
    tmp = tmp.trim();

    return tmp;
}

function random_string(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function decodeHTML(str)
{
    var d = document.createElement('div');
    d.innerHTML = str;
    return d.textContent;
}