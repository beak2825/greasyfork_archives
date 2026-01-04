// ==UserScript==
// @name        get douban info at BYRBT moive|北邮人增加豆瓣评分及收藏按钮 
// @author      Exhen
// @description 在北邮人增加豆瓣评分，看过的显示评分,没看过的增加“看过”“想看”按钮
// @namespace   exhen_js
// @include     http://bt.byr.cn/torrents.php*
// @include     https://bt.byr.cn/torrents.php*
// @include     http://bt.byr.cn/details.php*
// @include     https://bt.byr.cn/details.php*
// @icon        http://bt.byr.cn/favicon.ico
// @connect     douban.com
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     20180115.1
// @downloadURL https://update.greasyfork.org/scripts/36947/get%20douban%20info%20at%20BYRBT%20moive%7C%E5%8C%97%E9%82%AE%E4%BA%BA%E5%A2%9E%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E5%8F%8A%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/36947/get%20douban%20info%20at%20BYRBT%20moive%7C%E5%8C%97%E9%82%AE%E4%BA%BA%E5%A2%9E%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E5%8F%8A%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==



var dialog_html = '<div id="dialog" style="width: 550px; left: 50%; top: 50%; margin-top: -201px; margin-left: -276px;"> <div> <style> .InterestRating-Tip { background: #fffbf4; border: 1px solid #ffeed6; color: #494949; font-size: 12px; text-align: center; padding: 4px 0 3px; margin: 17px 0; } .interest-form-hd { padding: 12px 18px; width: 100%; margin: 0 -18px 15px; clear: both; background: #ebf5ea; overflow: hidden; } .interest-form-hd h2 { margin: 0; line-height: 1.2; background-color: #ffffff00; font: 15px Arial, Helvetica, sans-serif; font-size: 16px; color: #072; } .topbar-wrapper { margin-bottom: 5px; } .interest_form .interest-setting, .interest_form .comment, .interest_form .comment-label { width: 98%; } .interest-rating { float: left; } .tags-switch { text-align: right; } .interest_form .private { float: right; } #dialog { color: #111; position: fixed; z-index: 103; top: 50%; left: 50%; width: 550px; margin-top: -140px; background-color: #FFFFFF; padding: 0; border: 1px solid #bbb; -moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px; font-size: 13px; } .indentpop1 { padding: 0 18px; } #advtags { display: inline-block; width: 100%; margin-top: 10pt; } .interest_form .interest-setting, .interest_form .comment, .interest_form textarea { border: 1px solid #ccc; padding: 3px; font-size: 14px; overflow: auto; width: 98%; resize: none; } #dialog li { display: list-item; text-align: -webkit-match-parent; margin: 0; padding: 0; } #dialog .pl { color: #666666; } #dialog #stars{ color:grey; font-size:20px; } ul { list-style-type: none; margin: 0; padding: 0; list-style: none; } .interest_form .comment-label .num { float: right; color: #333; } .interest_form dt { float: left; width: 65px; color: #666; } .interest-form-ft { padding: 10px 18px; width: 100%; margin: 0 -18px; clear: both; background: #e9eef2; border-top: 1px solid #d9e2e9; overflow: hidden; margin-top: 15px; text-align: right; } .interest-form-ft label input, .interest_form label input { margin: 1px 4px; vertical-align: text-bottom; } .interest-form-ft .share-label input { margin-bottom: 0; } .interest-form-ft .bn-flat input { font-size: 14px; } .lnk-flat, .lnk-confirm, .bn-flat input { border: none; height: 25px; padding: 0 14px; color: #333; background: transparent url(/f/shire/05e1173…/pics/site/sp_all_2.png) repeat-x 0 -700px \9; font-size: 12px; margin: 0 !important; cursor: pointer; -webkit-appearance: none; border-radius: 2px; -moz-border-radius: 2px; -webkit-border-radius: 2px; background-image: -moz-linear-gradient(-90deg, #fcfcfc 0, #e9e9e9 100%); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #fcfcfc), color-stop(1, #e9e9e9)); } .lnk-flat, .lnk-confirm, .bn-flat { display: -moz-inline-box; display: inline-block; border-width: 1px; border-style: solid; border-color: #bbb #bbb #999; color: #444; border-radius: 3px; -moz-border-radius: 3px; -webkit-border-radius: 3px; overflow: hidden; vertical-align: middle; } .interest-form-hd .gact a:link, .interest-form-hd .gact a:hover { line-height: 1.2; padding: 0 3px; } .gact a:visited, a.gact:visited { color: #BBBBBB; font-size: 12px; text-decoration: none; text-align: center; } .gact a:link, a.gact:link { color: #BBBBBB; font-size: 12px; text-decoration: none; text-align: center; } .gact { color: #BBBBBB; font-size: 12px; text-align: center; cursor: pointer; } .rr { float: right; } </style> <div class="indentpop1 clearfix"> <div style="display:none;"> <input type="hidden" name="ck" value="GbAS"> </div> <input type="hidden" name="interest" value="collect"> <div class="interest-form-hd"> <span class="gact rr"> <a href="javascript:;" onclick="close_dialog()">x</a> </span> <h2>添加收藏：我看过这部电影</h2> </div> <div class="topbar-wrapper"> <span class="interest-rating"> <div class="j a_stars"> <span class="rate_stars">给个评价吧?(可选): <span id="rating"> <span id="stars"> <span class="stars" onclick="setRating(1)" onmouseover="starFocus(1,true)" onmouseout="starFocus(1,false)">☆</span> <span class="stars" onclick="setRating(2)" onmouseover="starFocus(2,true)" onmouseout="starFocus(2,false)">☆</span> <span class="stars" onclick="setRating(3)" onmouseover="starFocus(3,true)" onmouseout="starFocus(3,false)">☆</span> <span class="stars" onclick="setRating(4)" onmouseover="starFocus(4,true)" onmouseout="starFocus(4,false)">☆</span> <span class="stars" onclick="setRating(5)" onmouseover="starFocus(5,true)" onmouseout="starFocus(5,false)">☆</span> </span> <!-- <span id="rateword" class="pl">还行</span> --> <input id="n_rating" type="hidden" value="3" name="rating"> </span> </span> </div> </span> <!-- <div class="tags-switch"> <a id="showtags" rel="高级(标签和短评) ▼" href="javascript:void(0)">缩起 ▲</a> </div> --></div> <input id="foldcollect" name="foldcollect" value="U" type="hidden"> <ul id="advtags" class="interest_form" style="display: inline-block;"> <li class="comment-label"> <span id="left_n" class="num">140</span> 简短评论: </li> <li> <textarea name="comment" class="comment" id="comment" maxlength="350"></textarea> </li> <li class="private"> <input id="inp-private" name="private" type="checkbox" onClick="checkPrivate(this.checked)"> <label class="pl" for="inp-private">仅自己可见</label> </li> <li> <div id="error" class="errnotnull"> </div> </li> </ul> <div class="interest-form-ft" id="submits"> <div class="sync-setting pl"> <label>分享到</label> <label class="share-label share-shuo" for="share-shuo"> <input id="share-shuo" name="share-shuo" value="douban" type="checkbox">我的广播 </label> <!-- <a id="lnk-sync-setting" class="no-visited no-hover" href="https://movie.douban.com/settings/sync" target="_blank"> --> <!-- <img src="https://img3.doubanio.com/f/movie/9389c4e5cab0cd1089a189d607d296c31ddb1bc0/pics/movie/share_g.png" alt="发送信息到新浪微博">发送信息到新浪微博</a> --> </div> <style type="text/css"> .sync-setting { float: left; } #lnk-sync-setting, #lnk-sync-setting:hover, #lnk-sync-setting:visited { vertical-align: middle; color: #0192b5; background: none; line-height: 27px; margin-right: 8px; } #lnk-sync-setting img { vertical-align: baseline; *vertical-align: middle; opacity: .5; filter: alpha(opacity=50); display: inline-block; width: 10px; height: 10px; *display: inline; zoom: 1; position: relative; top: 1px; margin-left: 5px; } #lnk-sync-setting:hover img { opacity: .8; background: none; filter: alpha(opacity=80); } .share-label { margin: 8px; cursor: pointer; vertical-align: middle; *vertical-align: text-bottom; } .interest-form-ft .share-label input { margin-bottom: 0; } .interest-form-ft { text-align: right; } .interest-form-ft .bn-flat { float: none; } .interest-form-ft .sync-setting { float: left; line-height: 25px; } </style> <span class="bn-flat"> <input type="submit" value="保存" name="save"> </span> </div> </div> </div> </div>';









var myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = '<style> .doubanRatingIcon { border: 0; vertical-align: text-bottom } .doubanRatingText { font-size: 14px; border-radius: 5px; color: #000; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-weight: bold; text-decoration: none; margin: 5px 0; } span.ofTen { color: #666; font-size: 9px; } button { padding: 0px 7px 0px 0px; line-height: 22px; height: 24px; background: transparent no-repeat url(http://bt.byr.cn/ckfinder/userfiles/images/douban_button.png) right top !important; border-style: hidden; line-height: 22px; letter-spacing: 3px; cursor: pointer; color: #000; height: 24px; font: normal 12px sans-serif; margin-right: 10px; text-decoration: none; } button span { background: transparent no-repeat url(http://bt.byr.cn/ckfinder/userfiles/images/douban_button.png);  font-size: 12px; font-family: sans-serif;  padding: 4px 1px 3px 11px;  } </style>';
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);


var myScriptFunction = document.createElement('script');
myScriptFunction.innerHTML = 'function setRating(rating) { $("#n_rating").attr("rating", rating); $("#dialog #stars span").slice(0, rating).text("★"); $("#dialog #stars span").slice(0, rating).css("color", "#f9ba23"); $("#dialog #stars span").slice(rating, 5).text("☆"); $("#dialog #stars span").slice(rating, 5).css("color", "grey"); } function checkPrivate(disabled) { $("#share-shuo").attr("disabled", disabled); $(".share-shuo").css("color",disabled?"#ccc":"#666666"); } function close_dialog() { $("#dialog").remove(); } function starFocus(num, stat) { if (stat) { $("#dialog #stars span").slice(0, num).text("★"); $("#dialog #stars span").slice(0, num).css("color", "#f9ba23"); } else { $("#dialog #stars span").slice($("#n_rating").attr("rating"), num).text("☆"); $("#dialog #stars span").slice($("#n_rating").attr("rating"), num).css("color", "grey"); } }';
document.getElementsByTagName("head")[0].appendChild(myScriptFunction);




var getDoc, getJSON, parseURL, postDoc;
getDoc = function (url, meta, callback)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': 'text/html; charset=utf-8'
        },
        onload: function (responseDetail)
        {
            var doc;
            doc = '';
            if (responseDetail.status == 200)
            {
                doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
                if (doc == undefined)
                {
                    doc = document.implementation.createHTMLDocument('');
                    doc.querySelector('html').innerHTML = responseText;
                }
            }
            callback(doc, responseDetail, meta);
        }
    });
};
postDoc = function (url, data, meta, callback)
{
    GM_xmlhttpRequest({
        anonymous: true,
        method: 'POST',
        url: url,
        headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': 'text/html; charset=utf-8'
        },
        data: data,
        onload: function (responseDetail)
        {
            callback(responseDetail.responseText, responseDetail, meta);
        }
    });
};
getJSON = function (url, callback)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response)
        {
            if (response.status >= 200 && response.status < 400)
            {
                callback(JSON.parse(response.responseText), url);
            } else
            {
                // console.log('Error getting ' + url + ': ' + response.statusText);
            }
        }
    });
};
parseURL = function (url)
{
    var a;
    a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function ()
        {
            var i, len, ret, s, seg;
            ret = {};
            seg = a.search.replace(/^\?/, '').split('&');
            len = seg.length;
            i = 0;
            s = void 0;
            while (i < len)
            {
                if (!seg[i])
                {
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


var doubanPlugin = function (imdb)
{
    // console.log("i1", imdb);
    var douban_icon = $('<button class="douban_icon"><span>豆瓣</span></button>');
    douban_icon.attr('imdb', imdb);
    douban_icon.click(function ()
    {
        // console.log('i2', imdb);
        var douban_id;
        $('button.douban_icon').filter(function ()
        {
            // console.log('current checking',imdb);
            return $(this).attr('imdb') == imdb;
        }).hide();
        getJSON('http://api.douban.com/v2/movie/search?q=' + imdb, function (res, url)
        {

            douban_id = res.subjects[0].id;
            var douban_rating = res.subjects[0].rating.average;
            // var imdb = url.slice(40);
            // console.log('slice got', imdb);
            // alert(douban_id);
            var douban_url = 'https://movie.douban.com/j/subject/' + douban_id + '/interest';

            var douban_rating_icon = $('<span><a><img class="doubanRatingIcon" src="https://www.douban.com/pics/icon/dou24.png" height="16"/></a><span class="doubanRatingText"> <span id="my_rating"></span><span class="ofTen">/10</span></span></span>');
            douban_rating_icon.find('a').attr('href', 'https://movie.douban.com/subject/' + douban_id);
            // rating_icon.append('my rating');
            // rating_icon.append((rating * 2));
            // rating_icon.append('/10');
            // rating_icon.attr('href', douban_url);
            getJSON(douban_url, function (res, url)
            {
                var douban_html = $(res.html);
                var user_stat = res.interest_status;
                var user_rating = douban_html.find('#n_rating').attr('value');
                var ck = douban_html.find('input[name="ck"]').attr('value');
                // console.log("ck=" + ck);
                if (user_stat)
                {
                    if (user_rating)
                    {
                        // alert('yes');
                        var rating_icon = $('<span><a><img class="doubanRatingIcon" src="http://bt.byr.cn/ckfinder/userfiles/images/douban_user_rating.png" height="16"/></a><span class="doubanRatingText"> <span id="my_rating"></span><span class="ofTen">/10</span></span></span>');
                        rating_icon.find('a').attr('href', 'https://movie.douban.com/subject/' + douban_id);
                        // rating_icon.append('my rating');
                        // rating_icon.append((rating * 2));
                        // rating_icon.append('/10');
                        // rating_icon.attr('href', douban_url);
                        rating_icon.find('#my_rating').text(user_rating * 2);
                        $('.imdbRatingPlugin').filter(function ()
                        {
                            // console.log('current checking',imdb);
                            return $(this).attr('data-title') == imdb;
                        }).parent().append(rating_icon);

                        $('.imdbRatingPlugin').filter(function ()
                        {
                            // console.log('current checking',imdb);
                            return $(this).attr('data-title') == imdb;
                        }).parent().append(user_stat == 'wish' ? '<span id="status">我想看这部电影</span>' : '<span id="status">我看过这部电影</span>');


                    }
                    else
                    {
                        collectPlugin(imdb, douban_id, ck);
                    }
                    $('button.douban_rating').filter(function ()
                    {
                        // console.log('current checking',imdb);
                        return $(this).attr('imdb') == imdb;
                    }).hide();
                }
                else
                {
                    wishPlugin(imdb, douban_id, ck);
                    collectPlugin(imdb, douban_id, ck);
                }
            });



            douban_rating_icon.find('#my_rating').text(douban_rating);
            $('.imdbRatingPlugin').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('data-title') == imdb;
            }).after(douban_rating_icon);

        });
    });

    // console.log('inPluginThisis', $(this).attr('class'));
    return douban_icon;
};

var wishPlugin = function (imdb, douban_id, ck)
{
    var douban_wish = $('<button class="douban_wish"><span>想看</span></button>');
    douban_wish.attr('imdb', imdb);
    douban_wish.click(function open_dialog()
    {
        $(this).after(dialog_html);
        $('#dialog .interest-form-hd h2').text('添加收藏：我想看这部电影');
        $('#dialog .interest-rating').remove();
        $("#dialog textarea.comment").keyup(function ()
        {
            var comment = $(this).attr('value');
            var eng = comment.match(/[^\x00-\xff]/gi), engCount = eng ? eng.length : 0, chsCount = comment.length - engCount;
            var maxlength = 140 + Math.ceil(chsCount / 2);
            $("#dialog textarea.comment").attr("maxlength", maxlength);
            $("#dialog span.num").text(maxlength - comment.length);
        });
        $(this).siblings().find('input[type="submit"]').click(function ()
        {
            var comment = $('#dialog').find('textarea').attr('value');
            var share = $('#dialog').find('#share-shuo:checked').attr('value');
            var private = $('#dialog').find('#inp-private:checked').attr('name');
            // console.log('share', share);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://movie.douban.com/j/subject/' + douban_id + '/interest',
                data: "ck=" + ck + "&interest=wish&" + "&foldwish=U&comment=" + comment + (share ? "&share-shuo=" + share : "") + (private ? "&private=on" : ""),
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                onload: function (responseDetails)
                {
                    alert(responseDetails.status +
                        ' ' + responseDetails.statusText);
                }
            });

            $('.imdbRatingPlugin').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('data-title') == imdb;
            }).parent().append('我想看这部电影');
            $('button.douban_wish').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('imdb') == imdb;
            }).hide();

            close_dialog();
        });
        // console.log(douban_id);
    });
    $('.imdbRatingPlugin').filter(function ()
    {
        // console.log('current checking',imdb);
        return $(this).attr('data-title') == imdb;
    }).parent().append(douban_wish);
};

var collectPlugin = function (imdb, douban_id, ck)
{
    var douban_collect = $('<button class="douban_collect"><span>看过</span></button>');
    douban_collect.attr('imdb', imdb);
    douban_collect.click(function open_dialog()
    {
        $(this).after(dialog_html);
        $("#dialog textarea.comment").keyup(function ()
        {
            var comment = $(this).attr('value');
            var eng = comment.match(/[^\x00-\xff]/gi), engCount = eng ? eng.length : 0, chsCount = comment.length - engCount;
            var maxlength = 140 + Math.ceil(chsCount / 2);
            $("#dialog textarea.comment").attr("maxlength", maxlength);
            $("#dialog span.num").text(maxlength - comment.length);
        });
        $(this).siblings().find('input[type="submit"]').click(function ()
        {
            var user_rating = $('#dialog').find('#n_rating').attr('rating');
            var comment = $('#dialog').find('textarea').attr('value');
            var share = $('#dialog').find('#share-shuo:checked').attr('value');
            var private = $('#dialog').find('#inp-private:checked').attr('name');
            // console.log('share', share);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://movie.douban.com/j/subject/' + douban_id + '/interest',
                data: "ck=" + ck + "&interest=collect&" + (user_rating ? 'rating=' + user_rating : '') + "&foldcollect=U&comment=" + comment + (share ? "&share-shuo=" + share : "") + (private ? "&private=on" : ""),
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                onload: function (responseDetails)
                {
                    // alert(responseDetails.status +
                    //     ' ' + responseDetails.statusText + '\n\n' +
                    //     'Feed data:\n' + responseDetails.responseText);
                    alert(responseDetails.status +
                        ' ' + responseDetails.statusText);
                }
            });

            var rating_icon = $('<span><a><img class="doubanRatingIcon" src="http://bt.byr.cn/ckfinder/userfiles/images/douban_user_rating.png" height="16"/></a><span class="doubanRatingText"> <span id="my_rating"></span><span class="ofTen">/10</span></span>我看过这部电影</span>');
            rating_icon.find('a').attr('href', 'https://movie.douban.com/subject/' + douban_id);
            rating_icon.find('#my_rating').text(user_rating * 2);

            $('.imdbRatingPlugin').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('data-title') == imdb;

            }).parent().find('span#status').remove();

            $('.imdbRatingPlugin').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('data-title') == imdb;
            }).parent().append(rating_icon);
            $('button').filter(function ()
            {
                // console.log('current checking',imdb);
                return $(this).attr('imdb') == imdb;
            }).hide();

            close_dialog();
        });
        // console.log(douban_id);
    });
    $('.imdbRatingPlugin').filter(function ()
    {
        // console.log('current checking',imdb);
        return $(this).attr('data-title') == imdb;
    }).parent().append(douban_collect);
};


$('.torrents tbody tr .imdbRatingPlugin').each(function ()
{
    $(this).before('<br>');
    var imdb = $(this).attr('data-title');
    $(this).after(doubanPlugin(imdb));
});


$('#outer h1 .imdbRatingPlugin').each(function ()
{
    $(this).before('<br>');
    var imdb = $(this).attr('data-title');
    $(this).after(doubanPlugin(imdb));
    $('button.douban_icon').click();
});

