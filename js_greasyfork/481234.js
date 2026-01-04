// ==UserScript==
// @name         Pter Movie Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.10
// @description  Auto get movie&TV info from douban&imdb for Pterclub
// @author       BbLaCk
// @match        https://pterclub.com/upload.php*
// @match        https://pterclub.com/edit.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481234/Pter%20Movie%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/481234/Pter%20Movie%20Uploady.meta.js
// ==/UserScript==

async function fill_form(response) {
    let data = response.response;
    let poster = data['poster'];
    function up2imgbb(){
        GM.xmlHttpRequest({
            method: "GET",
            url: 'https://api.imgbb.com/1/upload?key=cc322c352c9f362350d05c7823995020&image='+poster,
            responseType: 'json',
            onload: function (response) {
                if (response.response.success === true) {poster = response.response.data.display_url;}
                const descr =data['format'];
                const img_descr =  `[img]${poster}[/img]` + descr.replace(/\[img].*\[\/img]/,'') ;
                $('#descr').val(img_descr)
            }
        })
    }
    await up2imgbb();
    if (data['site'] === 'douban'){
        var trans_titles='',directors='',casts='';
        if (data['foreign_title'].length == 0){ trans_titles= data['chinese_title']}
        else {
            data.trans_title.forEach(function (trans_title) {
                let reg_title = trans_title.replace(/[a-zA-Z\s]/g,'');
                if (reg_title.length != 0 && reg_title != trans_title){reg_title = trans_title}
                trans_titles += reg_title + ' '
            });
        }
        data.director.forEach(function (director) {
            directors = /(.+?)\s/.exec(director['name']).pop()
        });
        var actors = data.cast.slice(0,3);
        actors.forEach(function (cast) {
            casts += /(.+?)\s/.exec(cast['name']).pop()+' '
        });
        let subtitle = trans_titles + ' | ' + "导演：" + directors + ' | ' + '主演：' + casts;
        subtitle= subtitle.replace(/\s+/g,' ');
        $('input[name="url"][type="text"]').val(data['imdb_link']);
        $('input[name="small_descr"]').val(subtitle)
    }
}


function triger(url) {
    function get_info(url) {
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://gen.cattool.eu.org/?url="+url,
            responseType: "json",
            onload: fill_form
        });
    }
    if (url.indexOf("douban.com/") !== -1){ get_info(url)}
    else {
        let id = /\/(tt\d+)/.exec(url).pop();
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://gen.cattool.eu.org/?search="+id,
            responseType: "json",
            onload: function (response) {
                try {
                    url = response.response.data[0].link;
                    $('input[name="douban"]').val(url);

                }
                catch (TypeError)  {console.log('no douban page')}
                finally {get_info(url);}
            }
        });
    }
}

function writeInto(){
    const subtitle = $('input[name="small_descr"]');
    const cstext = subtitle.val() + "[国语中字]";
    subtitle.val(cstext);
}

function replaceimg(){
    let descr = $('#descr').val();
    let poster = /\[img](.*)\[\/img]/.exec(descr)[1];
    console.log(poster);
    GM.xmlHttpRequest({
        method: "GET",
        url: 'https://api.imgbb.com/1/upload?key=cc322c352c9f362350d05c7823995020&image='+poster,
        responseType: 'json',
        onload: function (response) {
            if (response.response.success === true) {poster = response.response.data.display_url;}
            console.log('OK');
            const img_descr = descr.replace(/\[img].*\[\/img]/,`[img]${poster}[/img]`) ;
            $('#descr').val(img_descr)
        }
    })
}


(function() {
    'use strict';
    let name = $('input[name="name"][type="text"]');
    let imdb_url = $('input[name="url"][type="text"]');
    let douban_url = $('input[name="douban"]');
    let subtitle = $('input[name="small_descr"]');

    name.after('<a href="javascript:;" id="imgbb" style="color:green">Imgbb it</a>');
    imdb_url.after('<a href="javascript:;" id="fill_imdb" style="color:green">Auto Fill</a>');
    douban_url.after('<a href="javascript:;" id="fill_douban" style="color:green">Auto Fill</a>');
    subtitle.after('<a href="javascript:;" id="fill_cs" style="color:green">[国语中字]</a>');
    $('#imgbb').click(function () {replaceimg()});
    $('#fill_cs').click(function () {writeInto()});
    $('#fill_imdb').click(function () {triger(imdb_url.val())});
    $('#fill_douban').click(function () {triger(douban_url.val())})
})();
