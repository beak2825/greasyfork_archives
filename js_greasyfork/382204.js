// ==UserScript==
// @name         淘票票开发环境切换
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       huaixu.zy
// @match        *://*.taopiaopiao.com/*
// @match        *://*.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382204/%E6%B7%98%E7%A5%A8%E7%A5%A8%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/382204/%E6%B7%98%E7%A5%A8%E7%A5%A8%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

// codepenurl: https://codepen.io/broven/pen/XQPpNP
// html strigifyer: https://codebeautify.org/string-builder
// css: https://codepen.io/castrolol/full/oXpLNR

const LOCAL_DEV_PREFIX = 'm';
const LOCAL_DEV_PORT = '8000';

const repoMap = {
    'dianying': [
        'artiste-comment',
        'show-replies',
        'show-preview',
        'topic-detail'
    ]
}
function getRepo(page = '') {
    for(let key in repoMap) {
        for (let item of repoMap[key]) {
            if (item === page) {
                return key;
            }
        }
    }
    return false;
}



(function() {
    // 公共环境相互切换 (预发, 日常, 线上)
    // 公共环境和本地环境相互切换
    'use strict';
    const url = location.href;
    const isPublic = /.*:\/\/(h5|wapp)\.(m|wapa|waptest).(taopiaopiao|taobao)\.com\/.*\/pages/.test(url);
    const panel =   '   <div class="chrome-tpp-panel-wrap">  '  +
          '     <div id="chrome-tpp-current" class="chrome-tapp-panel">dev</div>  '  +
          '     <div class="chrome-tapp-panel">m</div>  '  +
          '     <div class="chrome-tapp-panel">wapa</div>  '  +
          '     <div class="chrome-tapp-panel">waptest</div>  '  +
          '     <div class="chrome-tapp-panel">dev</div>  '  +
          '       '  +
          '  </div>  ' ;
    var styles = {

        //.chrome-tpp-panel-wrap
        chromeTppPanelWrapClass: {
            position: "fixed",
            top: "40%",
            size: "10px",
            left: "0%",
            width: "41px",
            'z-index': 9999,
            overflow: "hidden"
        },
        //.chrome-tapp-panel
        chromeTappPanelClass: {
            border: "1px solid green",
            textAlign: "center"
        },
        //#chrome-tpp-current
        chromeTppCurrentId: {
            backgroundColor: "#27e05773"
        }
    }

    const $panel = $(panel);
    $('body').append($panel);
    $('#chrome-tpp-current').css(styles.chromeTppCurrentId).text(isPublic ? url.split('.')[1]: 'dev');
    $('.chrome-tpp-panel-wrap').css(styles.chromeTppPanelWrapClass);
    $('.chrome-tapp-panel').css(styles.chromeTappPanelClass);
    bindEvents();
    function bindEvents() {
        $('.chrome-tpp-panel-wrap').on('click', (e) => {
            console.log('click');
            const env = $(e.target).text();
            changeEnv(env);
        })
    }
    function changeEnv(env = 'dev') {
        let resultUrl = location.href;
        if (isPublic) {

            // 公共切本地
            if (env === 'dev') {
                /** http://wapp.m.taobao.com | /app/dianying | /pages/recommend-film-comments/index.html
             -> http://m.m.taobao.com:8000/pages/recommend-film-comments/index.html
             */
                let localurl = url.replace(/\/app\/.*?\//, `:${LOCAL_DEV_PORT}/`) //  /app/xxx -> :8000
                localurl = localurl.replace(/.*?\/\/(wapp|h5)\./, `http://${LOCAL_DEV_PREFIX}.`) // http(s)://h5 -> http://m
                resultUrl = localurl;

            } else {
                // 公共环境互切
                resultUrl = url.replace(/(https)?:\/\/(.*?)\.(.*?)\./, (match, p1, p2, p3)=>{return `${p1}://${p2}.${env}.`});
            }
        } else {
            // 从dev切换到公共环境
            const repo = getRepo(url.split('/')[4]);
            if (repo !== false){

                // 0: "http:"
                // 1: ""
                // 2: "m.m.taobao.com:8000"
                // 3: "pages"
                // 4: "artiste-comment"
                // 5: "index.html?commentId=93&__webview_options__=showOptionMenu%3DNO"
                let urlArr = url.split('/')
                urlArr[0] = 'https:';
                if (env === 'waptest'){
                    urlArr[0] = 'http:';
                }
                // 处理domain
                urlArr[2] = urlArr[2].split(':')[0].split('.');
                urlArr[2][0] = 'h5';
                urlArr[2][1] = env;
                urlArr[2] = urlArr[2].join('.');
                urlArr.splice(3, 0, 'app');
                urlArr.splice(4, 0, repo);
                resultUrl = urlArr.join('/');
            }

        }
        console.log(resultUrl);
        location.href = resultUrl;
    }


})();