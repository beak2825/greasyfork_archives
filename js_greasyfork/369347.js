// ==UserScript==
// @name         OB Onekey-Info-Generator
// @namespace    exhen32@live.com
// @version      2018061002
// @description  Ourbits 一键获取信息
// @author       Exhen
// @match        https://ourbits.club/upload.php*
// @match        http://ourbits.club/upload.php*
// @match        https://ourbits.club/offers.php?add_offer=1*
// @match        http://ourbits.club/offers.php?add_offer=1*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://ourbits.club/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/369347/OB%20Onekey-Info-Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/369347/OB%20Onekey-Info-Generator.meta.js
// ==/UserScript==

var getDoc = function (url, meta, callback) {
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


var getBlob = function (url, referer, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': null,
            'referer': referer
        },
        responseType: 'blob',
        onload: function (responseDetail) {
            if (responseDetail.status >= 200 && responseDetail.status < 300) {
                callback(responseDetail.response);
            }
        }
    })
}

var compressImg = function (file, options, callback) {
    imgtype = 'image/jpeg';
    var self = this;
    // 用FileReader读取文件
    var reader = new FileReader();
    // 将图片读取为base64
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
        var base64 = evt.target.result;
        // 创建图片对象
        var img = new Image();
        // 用图片对象加载读入的base64
        img.src = base64;
        img.onload = function () {
            var that = this,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            canvas.setAttribute('width', that.width);
            canvas.setAttribute('height', that.height);
            // 将图片画入canvas
            ctx.drawImage(that, 0, 0, that.width, that.height);

            // 压缩到指定体积以下（M）
            if (options.size) {
                //console.log('size');
                var scale = 0.9;
                (function f(scale) {
                    if (base64.length / 1024 / 1024 > options.size && scale > 0) {
                        base64 = canvas.toDataURL(imgtype, scale);
                        scale = scale - 0.1;
                        f(scale);
                    } else {
                        callback(base64);

                    }
                })(scale);
            } else if (options.scale) {
                //console.log('scale');

                // 按比率压缩
                base64 = canvas.toDataURL(imgtype, options.scale);
                callback(base64);
            }

        }
    }
};


var postAttach = function (blob, filename, callback) {
    compressImg(blob, { "size": 2 }, function (base64) {

        var base64Arr = base64.split(',');
        var imgtype = '';
        var base64String = '';
        if (base64Arr.length > 1) {
            //如果是图片base64，去掉头信息
            base64String = base64Arr[1];
            imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
        }
        // 将base64解码
        var bytes = atob(base64String);
        //var bytes = base64;
        var bytesCode = new ArrayBuffer(bytes.length);
        // 转换为类型化数组
        var byteArray = new Uint8Array(bytesCode);

        // 将base64转换为ascii码
        for (var i = 0; i < bytes.length; i++) {
            byteArray[i] = bytes.charCodeAt(i);
        }

        // 生成Blob对象（文件对象）
        blob = new Blob([bytesCode], { type: imgtype });
        //console.log(blob);

        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        formData.append('file', blob, filename);
        xhr.open('POST', '/attachment.php');
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let match = xhr.responseText.match(/(?<=\[attach\]).*(?=\[\/attach\])/);
                if (match) callback(match);
            }
        };






    });
}


var postAttach_picgd = function (blob, filename, callback) {

    getDoc('https://www.picgd.com', null, function (doc, res, meta) {
        var auth_token = res.responseText.match(/(?<=auth_token=).*(?=")/);
        var myDate=new Date();
        var formDataTest = new FormData();
        formDataTest.append('source', blob, filename);
        formDataTest.append('type', 'file');
        formDataTest.append('action', 'upload');
        
        formDataTest.append('timestamp', myDate.getTime());
        formDataTest.append('auth_token', auth_token);
        formDataTest.append('nsfw', '0');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://www.picgd.com/json',
            headers: {
                'User-agent': window.navigator.userAgent,

            },
            data: formDataTest,
            onload: function (responseDetail) {
                if(responseDetail.status==200){
                    let name = JSON.parse(responseDetail.responseText).image.file.resource.chain.image.slice(14);
                    callback(responseDetail.status,name);    
                }
                else{
                    //console.log(responseDetail.responseText);
                    callback( responseDetail.status,JSON.parse(responseDetail.responseText).error.message);
                }
                

            }
        })

    })





}

$('form#compose td').filter(function () { return $(this).text() == '豆瓣链接' }).parent().addClass('douban');
var douban_button = $('<input type="button" class="douban_button" value="一键填写">');
douban_button.click(function () {
    var dburl = $('input[name="dburl"]')[0].value;
    var method = $('input[name="method"]:checked')[0].value;
    var pic_source=$('input[name="pic_source"]:checked')[0].value;
    //console.log(method);
    getDoc(dburl, null, function (doc, res, meta) {
        var douban_id = dburl.split('/')[4];
        var title_cn = $('#content > h1 > span', doc)[0].textContent.split(' ').shift();
        var director = $('div.article #info span.attrs:first', doc).text();
        var imdburl = $('div#info a[href^=\'http://www.imdb.com/title/tt\']', doc).attr('href');


        var moive_info = '';
        if (title_cn) { moive_info = moive_info + '\n◎片　　名　' + title_cn.replace(/ \/ /g, '\n　　　　　　' ); }
        var title_aka = $('div.article #info', doc).contents().filter(function () {
            return (this.nodeType === 3) && ($(this).prev().text() == "又名:");
        }).text().trim().replace(/ \/ /g, '/');
        if (title_aka) {
            moive_info = moive_info + '\n◎又　　名　' + title_aka;
        }
        var year = $('#content > h1 > span.year', doc).text().substr(1, 4);
        if (year) {
            moive_info = moive_info + '\n◎年　　代　' + year;
        }
        var region = $('div.article #info', doc).contents().filter(function () {
            return (this.nodeType === 3) && ($(this).prev().text() == "制片国家/地区:");
        }).text().trim().replace(/ \/ /g, '/');
        if (region) {
            moive_info = moive_info + '\n◎产　　地　' + region;
        }
        var genre = '';
        $('div.article #info span[property="v:genre"]', doc).each(function () { genre += $(this).text() + '/' });
        if (genre) {
            moive_info = moive_info + '\n◎类　　别　' + genre.slice(0, -1);
        }
        var language = $('div.article #info', doc).contents().filter(function () {
            return (this.nodeType === 3) && ($(this).prev().text() == "语言:");
        }).text().trim().replace(/ \/ /g, '/');
        if (language) {
            moive_info = moive_info + '\n◎语　　言　' + language;
        }
        var releaseDate = '';
        $('div.article #info [property="v:initialReleaseDate"]', doc).each(function () {
            releaseDate += $(this).text() + '/';
        })
        if (releaseDate) {
            moive_info = moive_info + '\n◎上映日期　' + releaseDate.slice(0, -1);
        }
        var doubanRating = $('strong.rating_num.ll', doc).text();
        if (doubanRating) {
            moive_info = moive_info + '\n◎豆瓣评分　' + doubanRating + '/10 from ' + $('a.rating_people span', doc).text().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + ' users';
        }
        moive_info = moive_info + '\n◎豆瓣链接　' + dburl;
        var duration = $('div.article #info', doc).contents().filter(function () {
            return ($(this).prev().attr('property') == "v:runtime") || ($(this).prev().text() == "片长:");
        }).text().trim();
        if (duration) {
            moive_info = moive_info + '\n◎片　　长　' + duration;
        }
        var director = $('div.article #info span.attrs:first', doc).text().replace(/ \/ /g, '\n　　　　　　' );
        if (director) {
            moive_info = moive_info + '\n◎导　　演　' + director;
        }
        var actors = $('div.article #info span.actor span.attrs', doc).contents().filter(function () {
            return $(this).attr("class") !== "more-actor";
        }).text().replace(/ \/ /g, '\n　　　　　　' );
        if (actors) {
            moive_info = moive_info + '\n◎主　　演　' + actors;
        }
        var intro = $('div.article div.related-info [property="v:summary"]', doc).text().replace(/ \n/g, '').replace(/ /g, '');
        if (intro) {
            moive_info = moive_info + '\n\n◎简　　介\n' + intro;
        }
        var award = '';
        $('ul.award', doc).each(function () {
            $(this).find('li').each(function () {
                award += $(this).text().replace(/\n/g, ' ').replace(/ +/g, '') + '　';
            })
            award += '\n　　'
        });
        if (award) {
            moive_info = moive_info + '\n◎获奖情况\n\n　　' + award;
        }
        getDoc(imdburl, null, function (doc_imdb, res, meta) {
            var imdb_rating = $('span[itemprop=ratingValue]', doc_imdb).text();
            if (imdb_rating) {
                $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/◎豆瓣评分/, '◎IMDb评分　' + imdb_rating + '/10 from ' + $('span[itemprop=ratingCount]', doc_imdb).text() + ' users' + '\n◎IMDb链接　' + imdburl + '\n◎豆瓣评分'));
            }

        })



        $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val(`[quote]请在这里上传海报并把本行文字删掉[/quote]\n[quote]${moive_info}\n[/quote]\n[quote][font=Courier New]\n请在这里补充INFO信息并把本行文字删掉\n[/quote]`);

        $('form#compose td').filter(function () { return ($(this).text() == 'IMDb链接')||$(this).text() == 'IMDB链接' }).parent().find('input')[0].value = imdburl;
        $('form#compose td').filter(function () { return $(this).text() == '副标题' }).parent().find('input')[0].value = title_cn + ' ' + $('div.article #info span.attrs:first', doc).text().replace(/ \/ /g,'/') + '导演作品';
        //console.log(title_cn, ' ', director, '导演作品');

        if (method == 'none') return;

        var posterAnchor = $('#mainpic img', doc);
        if (posterAnchor.attr('src') && (posterAnchor.attr('title') !== '点击上传封面图片')) {

            $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/请在这里上传海报并把本行文字删掉/, '已经找到可用海报，正在自动下载。'));
            var get_image_and_upload=function(url){
                getBlob(url, dburl, function (blob) {
                    if (!blob) {
                        $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已经找到可用海报，正在自动下载。/, '自动下载海报失败，请自行上传海报并把本行文字删掉。'));
                    }
                    $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已经找到可用海报，正在自动下载。/, '已成功下载海报，正在上传到OB服务器。'));
                    if (method == 'picgd') {
                        postAttach_picgd(blob, url.split('/')[7], function (status,name) {
                            if(status==200){
                                $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已成功下载海报，正在上传到OB服务器。/, '[img]https://' + name + '[/img]'));
                            }
                            else{
                                $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已成功下载海报，正在上传到OB服务器。/, '上传到picgd时发生错误：'+name ));
                            }
                          

                        })
                    }
                    else if (method == 'attach') {
                        postAttach(blob, url.split('/')[7], function (attach_id) {
                            $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已成功下载海报，正在上传到OB服务器。/, '[attach]' + attach_id + '[/attach]'));
                        })
                    }

                })
            }
            
            
            if(pic_source=='fast'){
                get_image_and_upload(posterAnchor.attr('src').replace(/s_ratio_poster/,'l').replace(/webp/,'jpg'));
                //console.log(posterAnchor.attr('src').replace(/s_ratio_poster/,'l').replace(/webp/,'jpg'));
            }
            if(pic_source=='size'){
                var postersUrl = 'https://movie.douban.com/subject/' + douban_id + '/photos?type=R&start=0&sortby=size&size=a&subtype=o';
                getDoc(postersUrl, null, function (doc1, res, meta) {
                    var aPosterUrl = $('.article > ul > li:nth-child(1) > div.cover > a', doc1).attr('href');
                    getDoc(aPosterUrl, null, function (doc2, res, meta) {
                        var hdPosterAnchor = $('span.magnifier > a', doc2);
                        if (hdPosterAnchor.attr('href') == '#') {
                            $('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val($('form#compose td').filter(function () { return $(this).text() == '简介*' }).parent().find('textarea').val().replace(/已经找到可用海报，正在自动下载。/, '未登录豆瓣，无法自动下载海报，请手动登陆豆瓣后重试，或自行上传海报并把本行文字删掉。'));
                            return;
                        }
                        //console.log(hdPosterAnchor.attr('href'))
                        
                        get_image_and_upload(hdPosterAnchor.attr('href'));
    
                    })
                })
            }
            // get the posters page's URL via movie.douban.com's customs
            
        }





        //alert( $(this).prev()[0].value);

    })
})
$('.douban td:last input').after(douban_button).after('<br>').after('<br>图片来源选择：<input type="radio" name="pic_source" value="fast" checked>直接用头图（匹配度高、速度快） <input type="radio" name="pic_source" value="size">优先大尺寸（稍慢）').after('<br>上传方式选择：<input type="radio" name="method" value="attach" checked>上传到附件（速度快，体积最大2M） <input type="radio" name="method" value="picgd">上传到OB图床（无体积限制，速度慢） <input type="radio" name="method" value="none">不自动上传图片');
