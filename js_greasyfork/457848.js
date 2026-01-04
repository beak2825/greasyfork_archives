// ==UserScript==
// @name         从Discogs添加豆瓣条目2
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  配合从Discogs添加豆瓣条目使用
// @author       越洋飞机
// @match        https://music.douban.com/new_subject*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457848/%E4%BB%8EDiscogs%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE2.user.js
// @updateURL https://update.greasyfork.org/scripts/457848/%E4%BB%8EDiscogs%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const info = JSON.parse(window.name);
    const re = /\(\d+\)/ //去除括号
    const title = document.querySelector("#p_title");

    switch (true) {
        case !!title:
            title.value = info.title;
            var submit1 = document.querySelector("#content > div > div.article > form > fieldset > div.item.other > input");
            submit1.click();
            break;

        case info.numArtists > 3:
            while (info.numArtists > 3) {
                info.numArtists -= 1;
                const plusBtn = document.querySelector("#content > div > div.article > form > fieldset > div.item.list.musicians > ul li:last-child a");
                plusBtn.click();
            }
            break;

        default:
            for (let index = 0; index < info.artists.length; index++) {
                const artistInput = document.querySelector(`#content > div > div.article > form > fieldset > div.item.list.musicians > ul li:nth-child(${index + 1}) input.input_basic`);
                artistInput.value = info.artists[index].name.replace(re, "");
            }

            var genreInput = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(4) > div > div > label");
            var typeInput = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(5) > div > div > label");
            var formatInput = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(6) > div > div > label");
            var releaseInput = document.querySelector("#p_51");
            var labelInput = document.querySelector("#p_50");
            var tracklistInput = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(11) > ul > li > div > textarea");
            var infoInput = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(12) > ul > li > div > textarea");
            var reference = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(13) > ul > li > div > textarea");
            var genreRoot = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(4) > div > ul").getElementsByTagName("li");
            var typeRoot = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(5) > div > ul").getElementsByTagName("li");
            var formatRoot = document.querySelector("#content > div > div.article > form > fieldset > div:nth-child(6) > div > ul").getElementsByTagName("li");

            var randomIndex = Math.floor(Math.random() * info.genres.length);
            var genre = info.genres[randomIndex];

            switch (genre) {
                case "Blues":
                    genreRoot[0].getElementsByTagName("label")[0].click();
                    break;
                case "Classical":
                    genreRoot[1].getElementsByTagName("label")[0].click();
                    break;
                case "Electronic":
                    genreRoot[3].getElementsByTagName("label")[0].click();
                    break;
                case "Folk, World, & Country":
                    genreRoot[4].getElementsByTagName("label")[0].click();
                    break;
                case "Funk / Soul":
                    genreRoot[5].getElementsByTagName("label")[0].click();
                    break;
                case "Jazz":
                    genreRoot[6].getElementsByTagName("label")[0].click();
                    break;
                case "Latin":
                    genreRoot[7].getElementsByTagName("label")[0].click();
                    break;
                case "Pop":
                    genreRoot[8].getElementsByTagName("label")[0].click();
                    break;
                case "HipHop":
                    genreRoot[9].getElementsByTagName("label")[0].click();
                    break;
                case "Reggae":
                    genreRoot[10].getElementsByTagName("label")[0].click();
                    break;
                case "Rock":
                    genreRoot[11].getElementsByTagName("label")[0].click();
                    break;
                default:
                    genreInput.innerHTML = "请手动选择";
            }



            switch (info.type) {
                case "专辑":
                    typeRoot[0].getElementsByTagName("label")[0].click();
                    break;
                case "选集":
                    typeRoot[1].getElementsByTagName("label")[0].click();
                    break;
                case "EP":
                    typeRoot[2].getElementsByTagName("label")[0].click();
                    break;
                case "单曲":
                    typeRoot[3].getElementsByTagName("label")[0].click();
                    break;
                default:
                    typeInput.innerHTML = "请手动选择";
            }

            switch (info.format) {
                case "File":
                    formatRoot[1].getElementsByTagName("label")[0].click();
                    break;
                case "Vinyl":
                    formatRoot[3].getElementsByTagName("label")[0].click();
                    break;
                case "CD":
                case "CDr":
                    formatRoot[0].getElementsByTagName("label")[0].click();
                    break;
                case "Cassette":
                    formatRoot[2].getElementsByTagName("label")[0].click();
                    break;
                default:
                    formatInput.innerHTML = "请手动选择";
            }
            while (info.release.endsWith("-00")) {
                info.release = info.release.substring(0, info.release.length - 3);
            }
            releaseInput.value = info.release;
            labelInput.value = info.label.replace(re, "");
            tracklistInput.value = info.tracklist;
            console.log(info.styles)
            infoInput.innerHTML = "Genre: " + JSON.stringify(info.genres).replace(/[\[\]"]/g, '').replace(/,/g, ', ') + "\nStyle: " + JSON.stringify(info.styles).replace(/[\[\]"]/g, '').replace(/,/g, ', ') + (info.note !== 'None' ? `\nNote: \n${info.note.trim()}` : '') + "\nCountry: " + info.country;
            reference.innerHTML = "Link: " + info.link;
    }
}
)();