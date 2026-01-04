// ==UserScript==
// @name         sexyhub@xj
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  sexyhub.cc
// @author       You
// @match        https://sexyhub.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://unpkg.com/ajax-hook@2.1.2/dist/ajaxhook.min.js

// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/488310/sexyhub%40xj.user.js
// @updateURL https://update.greasyfork.org/scripts/488310/sexyhub%40xj.meta.js
// ==/UserScript==



(function() {
    // https://sexyhub.cc/#/banana    https://sexyhub.cc/#/banana/mov/detail?movId=61507  https://sexyhub.cc/#/banana/mov/search
// @require      https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js
    var parse = JSON.parse;
    //if (location.href == 'https://sexyhub.cc/#/banana') {
    JSON.parse = function(params) {
        //console.log("Hook JSON.parse ——> ", params);
        //debugger;
        let params1 = parse(params);
        if (params.indexOf('o0o0plpl11.xiangxiangapps.com') != -1) {
            params1.value = 'https://g28le8r6f058.xzjgz.com'
        }
        return params1;
    };

    /*
    var org = window.XMLHttpRequest.prototype.setRequestHeader;
    window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        if (key == 'x-cookie-auth') {
            //debugger;
            //arguments2 = ['cookie', 'xxx_api_auth=6631643966663733303237306265666365373431386432343032316665346630; path=/'];
            //arguments[0] = 'cookie';
            arguments[1] = '3637616135393536323563613632303634656362386131373264343939333035';
        }
        return org.apply(this, arguments);
    };
    */

    function play_video(url, player) {
        if (window.dp) {
            window.dp.pause()
            window.dp.destroy()
            window.dp = null;
        }
        window.dp = new DPlayer({
            element: player,
            autoplay: true,
            theme: '#FADFA3',
            loop: true,
            lang: 'zh',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            video: {
                url: url,
                //type: 'hls',
                /*
                type: "customHls",
                customType: {
                    customHls: function (video, player) {
                        const hls = new Hls();
                        hls.loadSource(video.src);
                        hls.attachMedia(video);
                    }
                } */

            }
        });
    }
    $(document).ready(function() {
        const { unProxy, originXhr } = ah.proxy({
        onRequest: (config, handler) => {
            if (config.url.indexOf("xiangjiaoVIP") != -1) {
                //console.log('log', config, config.url);
                //debugger;
                let xg_url = config.url;
                let id = xg_url.slice(xg_url.indexOf('=') + 1, xg_url.length);
                config.url = "https://g28le8r6f058.xzjgz.com/vod/reqdown/" + id;
                config.headers['x-cookie-auth'] = "3637616135393536323563613632303634656362386131373264343939333035";
                handler.next(config);
                //console.log('log', config, config.url);
                //debugger;
            } else if (config.url.indexOf("reqplay") != -1) {
                let xg_url = config.url;
                let id = xg_url.slice(xg_url.lastIndexOf('/') + 1, xg_url.length);
                config.url = "https://g28le8r6f058.xzjgz.com/vod/reqdown/" + id;
                config.headers['x-cookie-auth'] = "3637616135393536323563613632303634656362386131373264343939333035";
                handler.next(config);
            } else {
                handler.next(config);
            }
        },

        onResponse: (response, handler) => {
            if (response.config.url.indexOf("reqdown") != -1) {
                let res = parse(response.response);
                //debugger;
                let url2 = res.data.httpurl;
                window.m3 = url2
                //
                console.log('log', url2);
                handler.next(response)
            } else if (response.config.url.indexOf("search") != -1) {
                // location.href == 'https://sexyhub.cc/#/banana/mov/search'
                let res2 = parse(response.response);
                window.vodrows = res2.data.vodrows;
                //debugger;
            } else {
                handler.next(response)
            }
        }
        })


        if (location.href.indexOf("detail") != -1) {
            let element = document.querySelector('div.video-box');
            let element2 = document.createElement('div');
            let element3 = document.createElement('button');

            element3.type = "button"
            element3.id = "demo";
            element3.innerHTML = "click me";
            element2.id = 'dplayer';
            //document.getElementsByTagName('body')[0].appendChild(element3);
            element.after(element3);
            element3.after(element2);
            //element.after(element2);

        /*
        $.get(window.m3, function(data, status){
            console.log('log', data);
            alert('Data: ' + data + "\nStatus: "+ status);
        }
        ) */
            element3.addEventListener('click', function(){
                console.log('log', window.m3);
                play_video(window.m3, element2);
                //play_video('https://ns0df1.hbrhny.com/20240224/hisLoWRH/4000kb/hls/index.m3u8', element2);
                //document.body.removeChild(element);
                console.log(element2);
            }
          )
        }

        if (location.href.indexOf("search") != -1) {

            // ads.parentNode.removeChild(ads)
            let head_element = document.querySelector('div.head');
            let box_element = document.querySelector('div.history-box');
            let data_element = document.createElement('div');
            let button_element = document.createElement('button');
            button_element.innerHTML = 'click on';
            head_element.after(button_element);
            button_element.addEventListener('click', function(){
                let con_html = '';

                for (const [idx, element] of window.vodrows.entries()) {
                    let coverpic = element.coverpic;
                    let title = element.title;
                    let vodid = element.vodid;
                    let duration = element.duration;
                    let info = element.scorenum + ' ' + element.areaname + ' ' + element.catename;
                    con_html += `   <div class="mov-item">
    <div class="mov-cover">
     <img class="lazy_img" data-src="${coverpic}" src="${coverpic}" lazy="loaded" />
     <span class="time">${duration}</span>
    </div>
    <div data-v-2ec7fadf="">
     <div class="title">
     <a href="#/banana/mov/detail?movId=${vodid}">
      ${title}
      </a>
     </div>
     <div class="info">
       ${info}
     </div>
    </div>
   </div>`;
                }


                //console.log('log', con_html);
                data_element.innerHTML = con_html;
                button_element.after(data_element);
                //head_element.parentNode.removeChild(head_element);
            })

        }


    });
})();


/*
1920x1080   12331kb/hls
1280x720    4000kb/hls


*/



