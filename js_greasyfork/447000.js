// ==UserScript==
// @name         RARBG Helper (RARBG 助手)
// @version      1.0.0
// @description  根据 IMDB ID 一键搜索 RARBG BT 资源!
// @author       Zhifeng Hu
// @icon         https://dyncdn.me/static/20/img/logo_dark_nodomain2_optimized.png
// @match        http*://www.imdb.com/title/tt*/*
// @run-at       document-end
// @grant        none
// @namespace    https://github.com/huzhifeng/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447000/RARBG%20Helper%20%28RARBG%20%E5%8A%A9%E6%89%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447000/RARBG%20Helper%20%28RARBG%20%E5%8A%A9%E6%89%8B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('RARBG Helper');

    let t1 = setInterval(function () {
        console.log(new Date());
        if (document.getElementById('rarbg_helper_id') === null) {
            addRarbgHelper();
        }
    }, 1000);

    function addRarbgHelper() {
        var imdbid = location.href.match(/tt\d+/);
        console.log('imdbid: ' + imdbid);

        var rarbg_url = 'https://rarbg.to/torrents.php?search=' + imdbid;
        var rarbg_url_movie_x265_1080 = rarbg_url + '&category%5B%5D=54'; // Movies/x265/1080
        var rarbg_url_tv_hd = rarbg_url + '&category%5B%5D=41'; // TV HD Episodes
        var links = '<a href="' + rarbg_url + '" target="_blank">All</a> | '
        const metadata = document.querySelector('ul[data-testid="hero-title-block__metadata"]');
        if (metadata.firstChild.textContent === 'TV Series') {
            links += '<a href="' + rarbg_url_tv_hd + '" target="_blank">TV</a>';
        } else {
            links += '<a href="' + rarbg_url_movie_x265_1080 + '" target="_blank">Movie</a>';
        }
        const imdb_rating = document.querySelector('div[data-testid="hero-rating-bar__aggregate-rating"]');
        var rarbg_helper = imdb_rating.cloneNode(true);
        rarbg_helper.setAttribute('data-testid', 'rarbg_helper');
        rarbg_helper.setAttribute('id', 'rarbg_helper_id');
        rarbg_helper.innerHTML = '<div class="sc-f6306ea-1 kWSNWJ">RARBG Helper</div><div>' + links + '</div>';
        imdb_rating.insertAdjacentElement('beforebegin', rarbg_helper);

        // 清除定时器
        clearInterval(t1);
    }
})();
