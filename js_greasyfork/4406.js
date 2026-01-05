// ==UserScript==
// @name           E-Hentai Info on Hover
// @description    Displays additional gallery information when hovering over thumbnails. Only works in thumbnail mode.
// @namespace      http://userscripts.org/users/106844
// @include        http://e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        http://g.e-hentai.org/*
// @include        https://g.e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://exhentai.org/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @version        0.2.6
// @downloadURL https://update.greasyfork.org/scripts/4406/E-Hentai%20Info%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/4406/E-Hentai%20Info%20on%20Hover.meta.js
// ==/UserScript==

var save = function(key,value) {
    if (typeof(GM_setValue) !== 'undefined') GM_setValue(key,value);
    else localStorage.setItem(key,value);
};

var load = function(key,def) {
  	if (typeof(GM_getValue) !== 'undefined') return GM_getValue(key,def);
    else return (localStorage.getItem(key) || def);
};

var doRequest = function(url, method, data, callback) {
    if (typeof(GM_xmlhttpRequest) === 'undefined') {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() { callback(this); };
        xhr.send(data);
    } else {
        GM_xmlhttpRequest({
            url: url,
            method: method,
            data: data,
            onload: callback
        });
    }
};

/* * * * * * * * * */

var stringify = function(data) {
    var volatile = (new Date().valueOf() - data.posted*1000) < 1000*60*60*2;
    return data.gid + ':' + (volatile*1) + ':' + data.filesize + ':' + data.tags.join(',') + ':' + data.uploader;
};

var parse = function(data) {
    if (data && data[0] == '@') data = data.slice(1);
    var tokens = data.split(/:/);
	if (!tokens || tokens.length < 5) return null;
    return { gid: parseInt(tokens[0],10), volatile: parseInt(tokens[1],10) == 1,
        size: parseInt(tokens[2],10), tags: tokens[3].split(','), uploader: tokens[4] };
};

var getRegex = function(gid,flags) {
    return new RegExp('(@|^)' + gid + ':[^@]+',flags); 
};

/* * * * * * * * * */

var checkStorage = function(gid) {
    var data = load('g.cache',null);
    if (data === null) return null;
    var match = data.match(getRegex(gid));
    return match === null ? null : parse(match[0]);
};

var cleanStorage = function() {
    var data = load('g.cache',null), lastClean = load('g.lastClean',null);
    if (data === null) return;
    var now = new Date().valueOf(), hours = 1000*60*60;
    if (lastClean !== null && now - parseInt(lastClean,10) < 6*hours) return;
    data = data.split(/@/).filter(function(x) { var parsed = parse(x); return parsed && !parsed.volatile; });
    save('g.cache',data.join('@'));
    save('g.lastClean',now);
};

/* * * * * * * * * */

var startApiRequest = function(target) {
    apiBusy = true;
    var request = [ [ target.gid, target.token ] ], data = load('g.cache','');
    var temp = targets.filter(function(x) { return x.gid != target.gid && !getRegex(x.gid).test(data); });
    temp = temp.slice(0,24).map(function(x) { return [ x.gid, x.token ]; });
    request = request.concat(temp);
    request = JSON.stringify({ method: 'gdata', gidlist: request });
    doRequest('https://e-hentai.org/api.php', 'POST', request, function(data) { onApiLoad(target,data.responseText); });
};

var onApiLoad = function(target,response) {
    var data = load('g.cache',null);
    data = data === null ? [ ] : data.split(/@/);
    response = JSON.parse(response);
    response.gmetadata.forEach(function(x) { data.push(stringify(x)); });
    save('g.cache',data.slice(-1000).join('@'));
    apiBusy = false;
    if (timeout !== null) showData(target,checkStorage(target.gid));
};

/* * * * * * * * * */

var mouseOver = function(target) {
    if (apiBusy) return;
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(function() { hoverTimeout(target); },500);
};

var mouseLeave = function(target) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = null;
    target.target.classList.remove('gShow');
};

var hoverTimeout = function(target) {
    if (target.target.querySelector('.gData') !== null) {
        target.target.classList.add('gShow');
        return;
    }
    var data = checkStorage(target.gid);
    if (data !== null) showData(target,data);
    else startApiRequest(target);
};

/* * * * * * * * * */

var showData = function(target,data) {
    if (data === null) return;
    var div = document.createElement('div');
    var size = (Math.round(data.size/1024/1024*100)/100) + 'MB';
    div.appendChild(document.createElement('div')).innerHTML = size;
    if (data.uploader) {
        var uploader = document.createElement('a');
        uploader.href = window.location.origin + '/uploader/' + data.uploader;
        uploader.textContent = data.uploader;
        var uploaderContainer = document.createElement('span');
        uploaderContainer.appendChild(uploader);
        div.appendChild(uploaderContainer);
    }
    var tags = div.appendChild(document.createElement('div'));
    data.tags.forEach(function(x,n) {
        var a = tags.appendChild(document.createElement('a'));
        a.href = '/?f_search=' + x.replace(/\s/g,'+');
        a.innerHTML = x;
        if (n < data.tags.length-1) tags.appendChild(document.createTextNode(', '));
    });
    div.className = 'gData id1';
    target.target.appendChild(div);
    setTimeout(function() { target.target.classList.add('gShow'); },10);
};

/* * * * * * * * * */

var onPanda = (window.location.href.indexOf('exhentai') != -1);
var style = document.createElement('style');
style.innerHTML =
    '.gData { position: absolute; top: 0px; left: 0px; text-align: left; padding: 5px;' +
        'font-weight: bold; height: 100%; width: 95% !important; z-index: 1; font-size: 10px; margin: 0 !important;' +
        'border: none !important; border-radius: 0 !important; transition: left .5s; left: -300px;' +
        'color: ' + (onPanda ? 'white' : 'black') + '}' +
    '.gShow > .gData { left: 0px !important; }' +
    '.gData > :first-child:before { content: "Size: " }' +
    '.gData > :nth-child(2):not(:last-child):before { content: "Uploader: " }' +
    '.gData > :last-child:before { content: "Tags: " }' +
    '.gData > :last-child > a { color: ' + (onPanda ? 'white' : 'black') + ' !important; }' +
    '.gData > :last-child > a:hover { background: red !important; }' +
    '.automatedButton { z-index: 2; }';
document.head.appendChild(style);

/* * * * * * * * * */

var timeout = null, apiBusy = false;
var targets = Array.prototype.slice.call(document.querySelectorAll('.id3 > a'),0);

targets = targets.map(function(x) {
    var tokens = x.href.match(/g\/(\d+)\/([0-9a-f]{10,10})/);
    if (!tokens) return null;
    return { target: x, gid: parseInt(tokens[1],10), token: tokens[2] };
});
targets = targets.filter(function(x) { return x !== null; });

targets.forEach(function(x) {
    x.target.addEventListener('mouseover',function() { mouseOver(x); },false);
    x.target.addEventListener('mouseleave',function() { mouseLeave(x); },false);
});

cleanStorage();