// ==UserScript==
// @name         iMGRSRC.ru - Thumbs and downloads albums
// @name:ru      iMGRSRC.ru - Эскизы и скачивание альбомов
// @namespace    http://imgsrc.ru/
// @version      0.5.6
// @description  iMGRSRC.ru: downloading albums in one archive, thumbnails of albums in the list.
// @description:ru   iMGRSRC.ru: скачивание альбомов одним архивом, эскизы альбомов в списке.
// @author       Krita
// @include      http://imgsrc.ru/*
// @include      https://imgsrc.ru/*
// @include      http://*.icdn.ru/*
// @include      https://*.icdn.ru/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect *
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @downloadURL https://update.greasyfork.org/scripts/367338/iMGRSRCru%20-%20Thumbs%20and%20downloads%20albums.user.js
// @updateURL https://update.greasyfork.org/scripts/367338/iMGRSRCru%20-%20Thumbs%20and%20downloads%20albums.meta.js
// ==/UserScript==

GM_addStyle ( `
#downloadZip{
cursor: pointer;
}
.usrprev IMG{
height: 72px;
margin: 0 10px;
width: 90px;
margin: 0 8px;
object-fit: cover;
}
`);




var lang_ru = {
    cfg_title: 'Настройки iMGSRC.RU',
    cfg_thumbnails: 'Эскизов каждого альбома в списке',
    cfg_skip_warning: 'Пропустить предупреждения',
    alb_download: "скачать альбом (zip)",
    alb_getlink: "получение ссылок",
    ald_getimage: "скачивание",
    alb_error: "Ошибка! Попробуйте отключить Adblock или другие расширения."
};

var lang_en = {
    cfg_title: 'iMGSRC.RU Settings',
    cfg_thumbnails: 'Thumbnails of each album in the list',
    cfg_skip_warning: 'Skip warnings',
    alb_download: "download album (zip)",
    alb_getlink: "getting links",
    ald_getimage: "downloading",
    alb_error: "Error! Try disabling Adblock or other extensions."
};

var locale = navigator.language || navigator.userLanguage;
var lang = locale === "ru" ? lang_ru : lang_en;

var cfg = new MonkeyConfig({
    title: lang.cfg_title,
    menuCommand: true,
    params: {
        thumbnails: {
            label: lang.cfg_thumbnails,
            type: 'select',
            choices: ['off', 4, 5, 6, 7, 8, 9, 10],
            default: 5
        },
        skip_warning: {
            label: lang.cfg_skip_warning,
            type: 'checkbox',
            default: true
        }
    },
    onSave: function (values) {
        location.reload();
    }
});

setCookie('iamlegal', 'yeah');

$("<span> | <a id='downloadZip'>" + lang.alb_download + "</a></span> ").insertBefore($('a#bp'));
$('#downloadZip').on('click', downloadZip);

//if (cfg.get('skip_warning') && ($("input[name=pwd][type=hidden]").length > 0))
//    window.location.replace($("form").attr('action') + "?" + $("form").serialize());


if (cfg.get('thumbnails') !== 'off') {
    $('.tdd td').css('height', '92px');
    $('.tdd th a').remove();
    $('.unveil50').remove();
    $('.tdd td:first-of-type a[target]').each(function (i, elem) {
        loadThumbs($(elem).attr('href'), elem);
    });
}

//const PR_SELECTOR = "tr:nth-child(3) table:nth-child(1) img";
const PR_SELECTOR = "td img.prev";


function loadThumbs(tlink, elem) {
    $.get(tlink, function (data) {
        data = data.replace(/src=/g, "srcx=");

        var $html = $(data);

        //if ($("input[name=pwd][type=hidden]", $html).length > 0) {
        //    loadThumbs($("form", $html).attr('action') + "?" + $("form", $html).serialize(), elem);
        //     return;
        //}
        var curdiv = $("<br/><span class='usrprev'></span>").insertAfter($(elem));

        $(PR_SELECTOR, $html).each(function (j, previmg) {
            if (j >= cfg.get('thumbnails'))
                return;
               //console.log(previmg);
            var prvlink = $(previmg).attr('srcx').match(/\/\w+\/.+\d+/gm)[0] + ".html";

            prvlink = prvlink.replace('imgsrc.ru_', '');
            $(previmg).addClass("lazyload");
            curdiv.append('<a href="' + prvlink + '" target="_blank">' + previmg.outerHTML.replace(/srcx=/g, "src=") + '</a>');
        });
    });
}

function downloadZip() {
    $('#downloadZip').off('click').text(lang.alb_getlink + '...');
    var pageLinks = [window.location.pathname];

    $("a.navi:contains(\u{E836})").each(function () {
        pageLinks.push($(this).attr('href'));
    });

    try {
        eval('');
    } catch (e) {
        alert(lang.alb_error);
        location.reload();
    }

    var imglinks = [];
    var imgcount = 0;

    pageLinks.forEach(function (alblink, i, arr) {
        $.get(alblink, function (data) {

            data = data.replace(/src=(\W)(http:)*/g, "srcx=$1http:");

            $(data).find(PR_SELECTOR).each(function (j, previmg) {
                var onepage = $(previmg).parent().attr('href');
                if (onepage.startsWith('#'))
                    onepage = alblink;
                imgcount++;

                $.get(onepage, function (data) {
                    data = data.replace(/src=(\W)(http:)*/g, "srcx=$1http:");

                    var dirlink = getDirectLink(data);

                    if (imglinks.map(function (e) {
                        return e.name;
                    }).indexOf(dirlink.name))
                        dirlink.name = getNameFile(dirlink.name) + imglinks.length.pad(4) + getExtensionFile(dirlink.name);

                    imglinks.push(dirlink);

                    $("#downloadZip").text(lang.alb_getlink + ' (' + imglinks.length + '/' + imgcount + ')...');

                    if (imglinks.length === imgcount)
                      createZip(imglinks);
                });

            });

        });
    });
    //console.log(pageLinks);

}


function createZip(imglinks, nombre) {
    var zip = new JSZip();
    var count = 0;
    var name = nombre + ".zip";

    imglinks.forEach(function (image) {

        GM_xmlhttpRequest({
            method: "GET",
            url: image.url,
            responseType: 'blob',
            onload: function (response) {

                zip.file(image.name, response.responseText, {binary: true});
                count++;
                $("#downloadZip").text(lang.ald_getimage + ' (' + count + '/' + imglinks.length + ')...');

                if (count === imglinks.length) {
                    zip.generateAsync({type: 'blob'}).then(function (content) {
                        saveAs(content, $('title').text().split(',')[0] + '.zip');
                        $("#downloadZip").text(lang.alb_download).on('click', downloadZip);
                    });
                }
            }
        });
    });
}

function getDirectLink(data) {
    var imglink = $(data).find('#bpi').attr('srcx');
    var origtag = $(data).find('strong + a');
    if (origtag.text().endsWith('B'))
        var origlink = origtag.attr('href');

    var directlink = typeof origlink === 'undefined' ?  imglink : origlink;
    if (directlink.startsWith('//'))
        directlink = 'http:' + directlink;

    var filename = $(data).find('#bpi').attr('alt');
    console.log(directlink);

    var extension = directlink.match(/\.\w+?$/)[0];

    if (!filename.toLowerCase().endsWith(extension))
        filename += extension;

    return {url: directlink, name: filename};
}

function getExtensionFile(fl) {
    return fl.match(/\.\w+?$/)[0];
}

function getNameFile(fl) {
    return fl.substring(0, fl.length - getExtensionFile(fl).length);

}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

function setCookie(cookieName, cookieValue) {
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate
            + ";domain=.imgsrc.ru;path=/";
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}