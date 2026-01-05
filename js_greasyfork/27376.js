// ==UserScript==
// @name         rarbg
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  rarbg增加豆瓣评分以及电影翻译。文档：http://blog.cyeam.com/kaleidoscope/2017/07/28/rarbg-douban
// @author       Bryce
// @match        *rarbg.org/torrents.php*
// @include      *rarbg*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27376/rarbg.user.js
// @updateURL https://update.greasyfork.org/scripts/27376/rarbg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var douban = function(i, name) {
        var rawName = name;
        for ( var r in Resolution ) {
            var tempI = name.indexOf(r);
            if ( tempI >= 0) {
                name = name.slice(0,tempI);
                name = name.replace(/\./g,' ').trim();
                //originName = engName[:i]
                //console.debug(name);
                var yearI = name.lastIndexOf(' ');
                name = name.slice(0, yearI);
                //console.debug(name);
                //var url = '//api.douban.com/v2/movie/search?q=' + name;
                var url = '//a.cyeam.com/douban/movie?s=' + name;
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                }).done(function( dd ) {
                    //console.debug(dd);
                    if (dd.count > 0 && dd.subjects.length>0) {
                        var chnname = dd.subjects[0].title;
                        //var figure = dd.subjects[0].images.large;
                        var rate = dd.subjects[0].rating.average;
                        var alt = dd.subjects[0].alt;

                        //console.debug(chnname,figure,rate,r);
                        // body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > table.lista2t > tbody > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)
                        var nameA = $('.lista2t').find('tr').eq(i).find('td').eq(1).find('a').eq(0);
                        //console.debug(rawName,tempI,name,chnname,rawName.slice(tempI));
                        nameA.text(chnname+"["+rawName+"]");

                        var scoreTd = $('.lista2t').find('tr').eq(i).find('td').eq(2);
                        scoreTd.html('<td><a href="'+alt+'">'+rate+'</a></td>');
                        //scoreTd.html('<td><a href="https://movie.douban.com/subject/19951149">5.9</a></td>');
                    }else {
                        console.error("查无此项",name,dd,url);
                    }
                }).fail(function( req,error ) {
                    console.error("网络错误",error,name,url,req);
                });

            }else {
                //console.debug("Not support res",name);
            }
        }


    };

    //14;17;42;44;45;46;47;48
    var obj = { 14: true,17:true,42:true,44:true,45:true,46:true,47:true,48:true };
    var Resolution = {"1080p": true, "DVDScr": true, "720p": true,"WEB-DL": true, "DVDRip": true, "DBRip": true, "WEBRip": true, "HDTV": true};
    $(document).ready(function() {
        var i = 0;
        $('.lista2t').find('tr').each(function(){
            if ( i===0) {
                $(this).find('td').eq(1).after('<td align="center" class="header6 header header40"><a class="anal tdlinkfull3" href="">豆瓣评分</a></td>');
            }else {
                var img = $(this).find('img').eq(0);
                var cat = img.attr('src');
                cat = cat.replace('.gif','');
                cat = cat.replace('//dyncdn.me/static/20/images/categories/cat_new','');
                $(this).find('td').eq(1).after('<td>暂不支持该分类</td>');
                if (cat in obj) {
                    var name =  $(this).find('td > a').eq(1).text();
                    douban(i, name);
                }else {
                    console.debug("Not support cat",cat);
                }
            }

            i++;
        });
    });
})();