// ==UserScript==
// @id             exhen32@live.com
// @name           ptp增加豆瓣评分
// @description    douban rating at passthepopcorn |ptp增加豆瓣评分
// @author         Exhen
// @connect        douban.com
// @connect        bing.com
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @require        http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require        https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @include        https://passthepopcorn.me
// @match          https://passthepopcorn.me/*
// @version        20200708


// @namespace https://greasyfork.org/users/164956
// @downloadURL https://update.greasyfork.org/scripts/36874/ptp%E5%A2%9E%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/36874/ptp%E5%A2%9E%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==
$(document).ready(function () {
    var getDoc, getJSON, parseURL, postDoc;
    getDoc = function (url, meta, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-agent': window.navigator.userAgent,
                'Content-type': null
            },
            onload: function (responseDetail) {
                var doc;
                doc = '';
                if (responseDetail.status == 200) {
                    doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
                    if (doc == undefined) {
                        doc = document.implementation.createHTMLDocument('');
                        doc.querySelector('html').innerHTML = responseText;
                    }
                }
                callback(doc, responseDetail, meta);
            }
        });
    };
    postDoc = function (url, data, meta, callback) {
        GM_xmlhttpRequest({
            anonymous: true,
            method: 'POST',
            url: url,
            headers: {
                'User-agent': window.navigator.userAgent,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: data,
            onload: function (responseDetail) {
                callback(responseDetail.responseText, responseDetail, meta);
            }
        });
    };
    getJSON = function (url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/json'
            },
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    callback(JSON.parse(response.responseText), url);
                } else {
                    console.log('Error getting ' + url + ': ' + response.statusText);
                }
            }
        });
    };
    parseURL = function (url) {
        var a;
        a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function () {
                var i, len, ret, s, seg;
                ret = {};
                seg = a.search.replace(/^\?/, '').split('&');
                len = seg.length;
                i = 0;
                s = void 0;
                while (i < len) {
                    if (!seg[i]) {
                        i++;
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                    i++;
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    };



    $('.basic-movie-list__movie__ratings-and-tags').each(function () {
        console.log('helloworld');
        var imdb;
        var tags = $(this);
        imdb = tags.children().find('.basic-movie-list__movie__rating__title a').filter(function () {
            return $(this).text() == 'IMDb';
        }).attr('href');
        if (imdb && imdb.startsWith('http://www.imdb.com/')) imdb = imdb.slice(26, -1);
        else return;
        // console.log(imdb);
        var douban_rating, douban_url;

        var value = GM_getValue(imdb);
        if (value) {
            douban_url=value.split('￥')[0];
            title=value.split('￥')[1];
            douban_rating=value.split('￥')[2];
            tags.prepend($('.basic-movie-list__movie__rating-container').first().clone());
            var douban = tags.find('.basic-movie-list__movie__rating-container').first();
            douban.find('.basic-movie-list__movie__rating__title a').attr("href", 'https://movie.douban.com/subject/'+douban_url);
            douban.find('.basic-movie-list__movie__rating__title a').text("豆瓣");
            douban.find('.basic-movie-list__movie__rating__rating').text(douban_rating);
            tags.parent().find('a.basic-movie-list__movie__title').text(title);
        }
        else{
            getDoc("https://cn.bing.com/search?q=site%3Amovie.douban.com%2Fsubject+" + imdb, null, function (doc) {
                console.log(doc);
            if ($('#b_results', doc).length) {
                var result = $('.b_algo', doc).first();
                var title = result.find('a').first().text();
                title=title.replace(' (豆瓣)','').replace(' - Douban','');
                console.log(title)
                if (result.find('div.b_factrow').text().match('用户评级:')) {
                    douban_rating = result.find('div.b_factrow li div').filter(function () {
                        return $(this).text().match('用户评级:');
                    }).text().match(/(?<=用户评级:).*(?=\/)/)[0]
                    tags.prepend($('.basic-movie-list__movie__rating-container').first().clone());
                    var douban = tags.find('.basic-movie-list__movie__rating-container').first();
                    douban_url = result.find('a').first().attr('href');
                    douban.find('.basic-movie-list__movie__rating__title a').attr("href", douban_url);
                    douban.find('.basic-movie-list__movie__rating__title a').text("豆瓣");
                    douban.find('.basic-movie-list__movie__rating__rating').text(douban_rating);
                    douban_id=douban_url.match(/(?<=movie\.douban\.com\/subject\/).*(?=\/)/)[0];
            tags.parent().find('a.basic-movie-list__movie__title').text(title);
            GM_setValue(imdb,`${douban_id}￥${title}￥${douban_rating}`);
                }
                else return
            }


        });
        }




    });


    //let keys = GM_listValues();
    //for (let key of keys) {
     // GM_deleteValue(key);
    // }


});