// ==UserScript==
// @name         Sehuatang
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description 鼠标悬停在javLibrary图片上时显示该视频类型。
// @author       MC
// @license MIT
// @description lalala
// @match        https://*.app/*
// @match        https://*.jable.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hgl52.app
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/475990/Sehuatang.user.js
// @updateURL https://update.greasyfork.org/scripts/475990/Sehuatang.meta.js
// ==/UserScript==


"use strict";

let regex =/((?:(?!(boy|oy|hjd|jd|com|om|SIS|IS|sis)))[A-Za-z]{2,5})-?\d{3,5}/

let get_av_from_server = (code, video) => {

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.mingren.life/av/${code}`,
        responseType: "json",
        onload: function (result) {
            let server = result.response;
            if (server && server.DownloadMovies.length > 0) {
                // is already downloaded
                if (server.mosic || !server.subtitle) {
                    video.style.backgroundColor = "pink"
                } else {
                    video.parentNode.parentNode.remove()
                }
            } else {
                video.style.color = "green"
            }
        },
        onerror: function (e) {
            console.error(e);
            throw "search error";
        }
    });
}


var get_tags = function(code, video){
    let url = `https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${code}`
    let filterLst = ['数位马赛克', '单体作品', '薄马赛克']
    let important = ['强奸', '凌辱', '轮奸', '监禁', '调教', '肛交']
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "document",
        onload: function (result) {
            let string = "";
            let video_page = result.response;
            try {
                let genres = [...video_page.querySelector("#video_genres").getElementsByClassName("genre")].map(genre => {
                    return genre.innerText
                }).filter(genre => {
                    if (filterLst.includes(genre)) {
                        return false
                    }
                    return true
                })
                let img = video_page.querySelector("#video_jacket_img")
                let parent = video.parentNode
                let badges = document.createElement("div")
                genres.forEach(genre => {
                    const b = document.createElement("span")
                    b.innerText = genre
                    if (important.includes(genre)) {
                        b.style.backgroundColor = "pink"
                    } else {
                        b.style.backgroundColor = "#5cb85c"
                    }
                    b.style.padding = ".2em .6em .3em"
                    b.style.borderRadius = ".25em"
                    b.style.margin = ".2em"
                    badges.appendChild(b)
                })
                img.style.height = "80%"
                img.style.width = "80%"
                parent.appendChild(badges)
                parent.appendChild(img)
            } catch {}


        },
        onerror: function (e) {
            console.error(code, e);
            throw "search error";
        }
    });
}


let main = () => {
    let videos = document.getElementsByClassName("xst");
    for (let video of videos) {
        let t = video.innerText
        const m = t.match(regex);
        if (!m) {
            continue
        }
        get_av_from_server(m[0], video)
        get_tags(m[0], video)
    }
}

let main2 = () => {
    let videos = document.getElementsByClassName("title");
    for (let video of videos) {
        let t = video.innerText
        const m = t.match(regex);
        if (!m) {
            continue
        }
        get_av_from_server(m[0], video)

    }
}

main()

document.getElementsByClassName("title-with-avatar")[0].onclick = () => {
    main2()
}
