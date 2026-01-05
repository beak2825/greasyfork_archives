// ==UserScript==
// @name           The Pirate Helper
// @description    Enhances your pirating experience!
// @author         Noah Keller http://github.com/noahtkeller
// @version        6.0
// @namespace      github.com/noahtkeller
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @include        http*://thepiratebay.*
// @include        http*://www.imdb.*/title/tt*
// @grant          GM_xmlhttpRequest
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/10670/The%20Pirate%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/10670/The%20Pirate%20Helper.meta.js
// ==/UserScript==

var magnet_img = "data:image/gif;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==";

var browser = function (name) {
    var n = 'unknown';
    if (GM_info.scriptHandler === 'Tampermonkey')
        n = 'chrome';
    else if (typeof window.opera !== 'undefined')
        n = 'opera';
    else if (typeof GM_info.scriptWillUpdate === 'number')
        n = 'opera';
    else if (typeof GM_info.scriptWillUpdate === 'boolean')
        n = 'firefox';
    return typeof name === 'undefined' ? n : n === name;
};

var site = function (check) {
    var s = '';
    var f = ('' + document.location).split(/^http(s)?\:\/\/(www\.)?/)[3].split('/')[0];
    if (typeof f !== 'undefined')
        s = f.split(/\.[a-zA-Z](\.[a-zA-Z])?/)[0];
    else
        s = null;
    return typeof check === 'undefined' ? s : s === check;
};

var get_data = function (args) {
    args.post = typeof args.post === 'undefined' ? false : args.post;
    var post_data = '';
    if (typeof args.post === 'object')
        for (var d in args.post)
            post_data += (post_data === '' ? '' : '&') + d + '=' + args.post[d];
    GM_xmlhttpRequest({
        method: args.post === false ? 'GET' : 'POST',
        data: post_data,
        url: args.url,
        onload: function(rD) {
            var xmlDoc = $.parseHTML(rD.responseText);
            if (typeof args.onload === 'function')
                args.onload(xmlDoc, rD);
        },
        ontimeout: function(rD) {
            var xmlDoc = $.parseHTML(rD.responseText);
            if (typeof args.ontimeout === 'function')
                args.ontimeout(xmlDoc, rD);
        },
        onerror: function(rD) {
            var xmlDoc = $.parseHTML(rD.responseText);
            if (typeof args.onerror === 'function')
                args.onerror(xmlDoc, rD);
        }
    });
};




var getTorrents = function() {
    var title = $($('h1.header span[itemprop="name"]')[0]).text();
    var year = $($('#overview-top > h1 > span.nobr > a')[0]).text();

    get_data({
        url: 'https://thepiratebay.am/search/' + title + ' ' + year + '/0/7/0',
        onload: function(data, text) {
            var results = $('table#searchResult tbody tr', text.response);
            for (var i = 0; i < results.length; i++) {
                var result = $(results[i]);
                var info = $('td', result);

                var magnet = $('a[title="Download this torrent using magnet"]', info[1]).attr('href').trim();
                var title = $('a.detLink', info[1]).text().trim();
                var uploader = $('a.detDesc', info[1]).text().trim();
                var seeds = $(info[2]).text().trim();
                var leeches = $(info[3]).text().trim();

                $('<tr><td style="text-align: center;"><a href=\'' + magnet + '\'><img src=\'' + magnet_img + '\'/></a></td><td>' + title + '<br/><small>by: ' + uploader + '</small></td><td style="text-align: center;">' +
                    seeds + '</td><td style="text-align: center;">' + leeches + '</td></tr>').appendTo('div#torrentResults table');

                if (i === 0) {
                    var mag_img = $('<img style="cursor: pointer;" src=\'' + magnet_img + '\'/>');
                    mag_img.click(function() {
                        $('#torrentResults').toggle();
                    });
                    $('div.infobar').prepend('&nbsp;&nbsp;<span class="ghost">|</span>');
                    $('div.infobar').prepend(mag_img);
                }

            }

        }
    })
};

if (site('imdb')) {
    var results = $('<div class="article" id="torrentResults"><table cellpaddng=".2em" cellspacing="0" width="100%"><tr><td style="width: 5%; font-weight: bold; color: red; text-align: center"><span onclick="$(\'#torrentResults\').hide();" style="cursor: pointer;">X</span></td><td style="width: 85%;">Title</td><td style="text-align: center; width: 5%;">S</td><td style="text-align: center;">L</td></tr></table></div>');
    results.hide();
    results.insertBefore('div.title-overview');
    var torrent_data = getTorrents();
} else if (site('thepiratebay')) {
    $('div#main-content').css('margin', 0);
}