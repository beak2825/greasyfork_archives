// ==UserScript==
// @name         AMVdownloaderx
// @version      0.3.3
// @description  downloaderx quick
// @author       You
// @match        https://*/*
// @exclude      https://pro.teknodigitals.com/*
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @namespace https://greasyfork.org/users/40022
// @downloadURL https://update.greasyfork.org/scripts/526423/AMVdownloaderx.user.js
// @updateURL https://update.greasyfork.org/scripts/526423/AMVdownloaderx.meta.js
// ==/UserScript==

'use strict';

const getCookie = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

setTimeout(async function() {
    if(location.href.indexOf('https://poop.') != -1) {
        strfunc = "f" + $('script:contains(/jembud/)').html()?.split(';f')[3];

        if(strfunc) {
            funcName = strfunc.substring(9,18);
            eval(strfunc);
            location.href = `https://metrolagu.cam/jembud/${eval(funcName + "[11]")}`;
        }
        else {
            const baseURL = `${location.protocol}//${location.hostname}`;
            let vid = location.href.split('/').pop();
            if(location.href.indexOf('/e/') != -1 || location.href.indexOf('/d/') != -1) {
                location.href = `${baseURL}/p0?id=${vid}`;
            }

            else if(location.href.indexOf(`${baseURL}/p0?id=`) != -1) {
                document.body.innerHTML = `<div id="player"></div><div id="loading"></div>`;
                initializePlayer();
                fetchDirectLink().then(directLink => {
                    if (directLink) {
                        setTimeout(() => {
                            window.open(directLink);
                        }, 1000);
                    } else {
                        console.error("Failed to load video.");
                    }
                });
            }
        }

    }
    else if(location.href.indexOf('/watch?v=') != -1 || location.href.indexOf('/video?q=') != -1) {
        posid = $(document).text().indexOf('?id=') != -1 ? $(document).text().indexOf('?id=') : $(document).text().indexOf('&id=')
        vid = $(document).text().substring(posid,posid + 20).split('" ')[0].substring(4);
 
        location.href = `https://api.poophd.com/player.php?id=${vid}`;
    }
    else if(location.href.indexOf('api.poop') != -1) {
        setTimeout(() => {
            if($(document).text().indexOf('?key=&') != -1) {
                location.href = `https://vidply.com/e/${location.href.split('=')[1]}`;
            }
        }, 50);
    }
    else if((scriptTag = $('script:contains("/pass_md5/")')).length) {
        var scriptContent = scriptTag.html();
        var reqVid = scriptContent.match(/\/pass_md5\/[^\']+/)[0];
        document.write('loading...');
        $.get(reqVid, function(data) {
            let genMP = makePlay();
            location.href = data + genMP;
        });
    }
    else if(location.href.indexOf('https://go.msmbot.club/link') != -1) {
        const vid = location.pathname.split('/')[2];
        const hash = (new URLSearchParams(location.search)).get('n0nce');
        const tgid = getCookie('telegram_user_id');
        await fetch(`${location.protocol}//${location.hostname}/?wp_nonce=${hash}&id=${tgid}&file_shortcode=${vid}`)
        $("iframe").remove()
        window.close()
    }

    else {
        if( $("a:contains(Bot 1)").length > 0) {
            window.location.href = $("a:contains(Bot 1)").attr('href');
        }
        else if($("a[href^='https://pro.teknodigitals.com']").length) {
            window.location.href = $("a[href^='https://pro.teknodigitals.com']").attr('href');
        }
        else if($(".dlbutton a[href$='.html']").length) {
            window.location.href = $(".dlbutton a[href$='.html']").attr('href');
        }
    }
},5);