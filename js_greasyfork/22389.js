// ==UserScript==
// @name        JAV Library Search
// @description Add buttons to search on sukebei.nyaa.se.
// @namespace   rix.li
// @match       *://www.javlibrary.com/*
// @match       *://sukebei.nyaa.se/*
// @version     3.1
// @require     https://cdn.rawgit.com/emn178/js-sha1/c724643de09ae79f355e273cf2c1eec231d19a34/build/sha1.min.js
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/22389/JAV%20Library%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/22389/JAV%20Library%20Search.meta.js
// ==/UserScript==


var videoIdList = [];

function getSearchUrl(videoId) {
    return 'https://sukebei.nyaa.se/?page=search&cats=8_30&sort=5&term=' + encodeURIComponent(videoId) + '#' + encodeURIComponent(videoId);
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

if(window.location.hostname === 'www.javlibrary.com') {

    GM_addStyle('.icn_search{display: inline-block;width: 24px;height: 24px;background-repeat: no-repeat;margin: 0px 0px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABqUlEQVRIS7WWMY8BQRTHnz0SiWSFjkSz8ZV8AkKNXi7R6qlX4TOIUkEUdKIQhc0mKiWCmJv3zOYcb+bcWb/kn/fGy/xn3uwsQEiq1aqIRqMCAEIRetVqNbQWH4fD4bPVasHlcpG1cECv0WgEx+MRIJ1Os7sIQ+htnU4nmb+H8/kMViQSUcPwQW9L5VpKpRJMJhPYbrcwn8+h0WioypPYts2eH2q/39NN4Mhms+ycWyWTSaHtYLfbQTweh+FwCKlUitpFtdttqvu+T/FXuA6KxSLtUpo/1FDNZpPqruuy9UDYAbvAeDwmA9MVDuBqgbRHlM/nKeKD1eF5nsrMsAtsNhuKpiucy+VUZoZdoNfrUex0OhTvKRQKFAeDAUUjumsagA/09nNpripCJBKJH7V7aR8yKpPJKJsr6/VaZd8sFgt2biDjAoG63a6yu9Lv92nnaI4sl0t2HuqpBUxCc2S1WrH1lxdAoTkynU4fatr34C84jgOz2Yy+EFle7cAk6kB2J/P3gN5WLBZTw/CRP/5glctlNQyfSqVCbdBfDNnJwxn+V+hVr9elsxBfG9P38mJXH78AAAAASUVORK5CYII=);}');

    document.querySelectorAll('.video').forEach(function(video) {
        var videoId = video.querySelector('.id').innerText;
        videoIdList.push(videoId);
        var toolbar = video.querySelector('.toolbar');
        var a = document.createElement('a');
        a.classList.add('icn_search');
        a.title = 'Search it!';
        a.target = '_blank';
        a.href = getSearchUrl(videoId);
        toolbar.appendChild(a);
    });

    document.querySelectorAll('#video_favorite_edit').forEach(function(toolbar) {
        var videoId = document.querySelector('#video_id .text').innerText;
        videoIdList.push(videoId);
        var a = document.createElement('a');
        a.classList.add('smalldarkbutton');
        a.innerText = 'Search it!';
        a.target = '_blank';
        a.href = getSearchUrl(videoId);
        var span = document.createElement('span');
        span.classList.add('favoritetype');
        span.appendChild(a);
        toolbar.appendChild(span);
    });

    videoIdList = videoIdList.filter(unique);

    document.querySelectorAll(".displaymode .left").forEach(function(displayMode) {
        var a = document.createElement('a');
        a.classList.add('smalldarkbutton');
        a.innerText = 'Search all!';
        a.href = 'javascript:void(0);';
        a.addEventListener('click', function(e) {
            e.preventDefault();
            videoIdList.forEach(function(videoId) {
                window.open(getSearchUrl(videoId));
            });
        });
        var span = document.createElement('span');
        span.classList.add('favoritetype');
        span.appendChild(a);
        displayMode.appendChild(span);
    });
}

function getResultSize(result) {
    var sizeExpr = result.querySelector('.tlistsize').innerText.split(/\s+/);
    var quantity = parseFloat(sizeExpr[0]);
    var unit = sizeExpr[1];
    switch(unit) {
        case 'KiB':
            return quantity * 1024;
        case 'MiB':
            return quantity * Math.pow(1024, 2);
        case 'GiB':
            return quantity * Math.pow(1024, 3);
    }
    return NaN;
}

function isTrustedResult(result) {
    return result.classList.contains('trusted');
}

function bendecode(dataView) {
    var i = 0,
        info_start = -1,
        info_end = -1,
        info_hash;
    var text_decoder = new TextDecoder();

    function charIsNumber(char) {
        return char >= 48 && char <= 57;
    }

    function bendecode_integer() {
        var integer = 0,
            char, negative = false;
        if (dataView.getInt8(i) == 45) {
            negative = true;
            i++;
        }
        while (charIsNumber(char = dataView.getInt8(i))) {
            integer = integer * 10 + (char - 48);
            i++;
        }
        return negative ? (-integer) : integer;
    }

    function bendecode_string() {
        var l = bendecode_integer(),
            str = "";
        i++; // ':'
        var end = i + l;
        return text_decoder.decode(dataView.buffer.slice(i, (i += l)));
    }

    function bendecode_list() {
        i++;
        var list = [];
        while (dataView.getInt8(i) !== 101) { // 'e'
            list.push(decode());
        }
        i++;
        return list;
    }

    function bendecode_dictionary() {
        i++;
        var dic = {};
        while (dataView.getInt8(i) !== 101) { // 'e'
            var key = bendecode_string();
            if (key === 'info' && info_start < 0) {
                info_start = i;
            }
            var value = decode();
            if (key === 'info' && info_end < 0) {
                info_end = i;
                info_hash = sha1(dataView.buffer.slice(info_start, info_end));
            }
            dic[key] = value;
        }
        i++;
        return dic;
    }

    function decode() {
        if (i <= dataView.byteLength) {
            var char = dataView.getInt8(i);
            if (charIsNumber(char)) {
                return bendecode_string();
            } else if (char == 105) { // 'i'
                i++;
                var integer = bendecode_integer();
                i++;
                return integer;
            } else if (char == 108) { // 'l'
                return bendecode_list();
            } else if (char == 100) { // 'd'
                return bendecode_dictionary();
            }
        }
    }

    var result = decode();

    return {
        info_hash: info_hash,
        result: result
    };
}

function copyMagnetFromTorrentURL(url) {
    fetch(url).then(function(response) {
        response.arrayBuffer().then(function(arrayBuffer) {
            var torrent = bendecode(new DataView(arrayBuffer));
            var magnet = 'magnet:?xt=urn:btih:' + torrent.info_hash;
            GM_setClipboard(magnet);
            document.querySelector('.dl-copy').innerText = 'Copied!';
            setTimeout(function() {
                document.querySelector('.dl-copy').innerText = 'Copy magnet';
            }, 500);
        });
    });
}

if(window.location.hostname === 'sukebei.nyaa.se') {
    GM_addStyle('.dl-btn {color: #eee; border-radius: 8px; cursor: pointer; float: right; margin-right: 60px;} .dl-found{background-color: #333;} .dl-not-found {background-color: #a50202;} .dl-copy{background-color: #070;}');
    if (document.querySelector('.container') === null) {
        // on list result page
        var results = [];
        var videoId = window.location.hash.slice(1);
        var regex = new RegExp(videoId.replace(/-/g, '\\s*-?\\s*'), 'i');
        var notice = document.querySelector('span.notice');
        document.querySelectorAll('.tlistrow').forEach(function(row) {
            if (row.querySelector('.tlistname').innerText.match(regex))
                results.push(row);
        });

        if (!results.length) {
            var a = document.createElement('a');
            a.classList.add('notice');
            a.classList.add('dl-btn');
            a.classList.add('dl-not-found');
            a.href = 'javascript:void(0);';
            a.innerText = 'Best result not found!';
            insertAfter(a, notice);
        } else {
            var bestResult = results[0];
            var bestResultSize = getResultSize(bestResult);
            var bestResultTrusted = isTrustedResult(bestResult);
            if (!bestResultTrusted) {
                results.find(function(result) {
                    var resultSize = getResultSize(result);
                    var resultTrusted = isTrustedResult(result);
                    if (resultTrusted && (bestResultSize - resultSize) <= 100 * Math.pow(1024, 2)) {
                        bestResult = result;
                        return true;
                    }
                    return false;
                });
            }
            var torrentURL = bestResult.querySelector('.tlistdownload a').href;
            var downloadButton = document.createElement('a');
            downloadButton.classList.add('notice');
            downloadButton.classList.add('dl-btn');
            downloadButton.classList.add('dl-found');
            downloadButton.href = torrentURL;
            downloadButton.innerText = 'Download best result!';
            insertAfter(downloadButton, notice);
            var copyButton = document.createElement('a');
            copyButton.classList.add('notice');
            copyButton.classList.add('dl-btn');
            copyButton.classList.add('dl-copy');
            copyButton.href = 'javascript:void(0)';
            copyButton.innerText = 'Copy magnet';
            copyButton.addEventListener('click', function() {
                copyMagnetFromTorrentURL(torrentURL);
            });
            insertAfter(copyButton, notice);
        }
    } else {
        // on single result page
        var torrentURL = document.querySelector('.viewdownloadbutton a').href;
        var copyButton = document.createElement('a');
        copyButton.classList.add('notice');
        copyButton.classList.add('dl-btn');
        copyButton.classList.add('dl-copy');
        copyButton.href = 'javascript:void(0)';
        copyButton.innerText = 'Copy magnet';
        copyButton.addEventListener('click', function() {
            copyMagnetFromTorrentURL(torrentURL);
        });
        insertAfter(copyButton, document.querySelector('.viewdownloadbutton'));
    }
}
