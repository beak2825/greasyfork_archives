// ==UserScript==
// @name         shikiPlus
// @author       chsa13
// @description  script add viewer and playeer on shikimori
// @namespace    http://shikimori.me/
// @version      2.1.8
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @license      MIT
// @copyright    Copyright © 2024 chsa13. All rights reserved.
// @downloadURL https://update.greasyfork.org/scripts/503677/shikiPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/503677/shikiPlus.meta.js
// ==/UserScript==
let RonobeLibLink = "https://ranobelib.me/ru/"
let MangaLibLink = "https://test-front.mangalib.me/ru/"
let AnimeLibLink = "https://anilib.me/ru/anime/"
let LibSocialApiLink = 'https://api.cdnlibs.org/api'

function launchFullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}
function addStyles(){
    $(document.body).append($("<style>").prop("type", "text/css").html(`
    .shiki-plus .iframe{
        width: 100%;
        height: unset;
        aspect-ratio: 1.36;
        min-height: 650px;
        border: none;
    }
    .shiki-plus .black-div {
        position: absolute;
        background-color: black;
        width: 100%;
        height: unset;
        aspect-ratio: 1.36;
        min-height: 650px;
        border: none;
    }
    .shiki-plus .options {
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .shiki-plus .options .sweatcher {
        opacity: 1;
        display: flex;
        align-items: center;
        font-size: 20px;
        color: var(--color-text-primary, --font-main, #F8F8F2);
        white-space: nowrap;
    }
    .shiki-plus .options .sweatcher span {
        margin-right: 10px;
        color: var(--color-text-primary, --font-main, #112233);
    }
    .shiki-plus .options .sweatcher .variant {
        min-width: unset;
        margin-bottom: unset;
        margin-right: 10px;
    }
    .shiki-plus .options .sweatcher .variant.selected {
        opacity: 0.85;
    }
    @media (max-width: 768px) {
        .shiki-plus .hide-on-mobile-text {
            display: none !important;
        }
    }
    `))
}
function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") fn();
    else document.addEventListener('DOMContentLoaded', fn);
}

async function sleep(timeMs) {
    await new Promise(resolve => setTimeout(resolve, timeMs));
}

async function GetResourceAsync(uri, config = {}) {
    return await new Promise((resolve, reject) => {
        $.ajax(Object.assign({
            url: uri,
            dataType: 'json',
            async: true,
            cache: false,
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            success: function(res) {
                resolve(res);
            },
            error: function(xhr) {
                reject(xhr);
            }
        }, config));
    });
}


async function createReader(hrefs, type) {
    let shikiPlus = $("<div>").addClass("shiki-plus")
    let options = $("<div>").addClass("options");
    let link
    if (type == "manga") {
        link = MangaLibLink + hrefs[0] + "/read/v01/c01";
    } else if (type == "ranobe") {
        link = RonobeLibLink + hrefs[0] + "/read/v01/c01";
    }
    let iframe = $("<iframe>").addClass("iframe").attr({
        'allowFullScreen': 'allowfullscreen',
        "src": link,
    });
    let blackdiv = $("<div>").addClass("black-div");
    iframe.on("load", ()=>{
        blackdiv.remove();
    })
    shikiPlus.append(options).append(blackdiv).append(iframe)
    let currentVal = 0
    let variants = []
    let sweatcher = $("<div>").addClass("sweatcher");
    sweatcher.append($("<span>").text("Выбрать версию:").addClass("hide-on-mobile-text"))
    for (let i in hrefs) {
        let variant = $("<div>").addClass("b-link_button").addClass("dark").addClass("variant").text((String(Number(i) + 1)));
        variant.on("click", ()=>{
            if (i == currentVal) return
            let link
            if (type == "manga") {
                link = MangaLibLink + hrefs[i] + "/read/v01/c01";
            } else if (type == "ranobe") {
                link = RonobeLibLink + hrefs[i] + "/read/v01/c01";
            }
            for (let i of variants){
                i.removeClass("selected")
            }
            variant.addClass("selected")
            currentVal = i
            iframe.attr("src", link)
        })
        sweatcher.append(variant);
        variants.push(variant)
    }
    variants[0].addClass("selected")

    if (hrefs.length >= 2) options.append(sweatcher);
    let fullScreenBtn = $("<div>").addClass("full-screen-btn").addClass("b-link_button").addClass("dark").text("Полноэкранный режим");


    fullScreenBtn.on("click", ()=>{
        // fullScreenBtn.removeClass("touched")
        launchFullScreen(iframe[0]);
    })
    options.append(fullScreenBtn);

    let container = $('.b-db_entry');
    let aboutSection = container.find('.c-about');
    let descriptionSection = $('.c-description');
    let imageSection = container.find('.c-image');

    // Проверка на мобильную версию
    if ($(window).width() <= 768) {
        if (imageSection.length) {
            imageSection.append(shikiPlus);
        }
    } else if (aboutSection.length && descriptionSection.length) {
        shikiPlus.insertBefore(descriptionSection);
    }
}


function createWatcher(href) {
    let shikiPlus = $("<div>").addClass("shiki-plus")
    let iframe = $("<iframe>").addClass("iframe").attr({
        "src": AnimeLibLink + href.split("?")[0] + "/watch",
        "allowFullScreen": "allowfullscreen"
    });

    let blackdiv = $("<div>").addClass("black-div");
    shikiPlus.append(blackdiv).append(iframe)
    // Находим контейнер
    let container = $('.b-db_entry');
    let descriptionSection = $('.c-description');

    // Проверяем, существует ли нужный элемент
    if (descriptionSection.length) {
        // Если это мобильное устройство
        if ($(window).width() <= 768) {
            let cImageElement = container.find('.c-image');
            if (cImageElement.length) {
                cImageElement.append(shikiPlus);
            }
        } else {
            shikiPlus.insertBefore(descriptionSection);
        }
    }
    iframe.on("load", ()=>{
        blackdiv.remove();
    })
}


async function addBtn() {
    if (document.querySelector('.shikiPlus')) return
    let lic = false
    let btn = $("<div>").addClass("shikiPlus").addClass("b-link_button").addClass("dark")
    let href = ""
    let type
        if (location.href.includes("/animes/")) {
        type = "anime"
        let id = document.querySelector('.b-user_rate').getAttribute('data-target_id')
        let title = document.querySelector("meta[property='og:title']").getAttribute('content')
        try {
            title = title.split(" ")[0]
        }
        catch {return}
        href = ""
        let fl = false
        for (let i = 1; i < 100; i++){
            if (fl){break}
            let response = await GetResourceAsync(`${LibSocialApiLink}/anime?page=${i}&q=${title}`)
            for (let i in response.data) {
                if (id == response.data[i].shikimori_href.split("/")[4]) {
                    lic = response.data.is_licensed
                    href = response.data[i].slug_url
                    fl = true
                    break
                }
            }
            if (response.meta.to == null){
                fl = true
                break
            }
        }
        btn.text("Смотреть")
    }
    else if (location.href.includes("/mangas/")) {
        let links = document.querySelectorAll(".mangalib > a")
        type = "manga"
        btn.text("Читать")
        await findInLinks(links)
    }
    else if (location.href.includes("/ranobe/")) {
        let links = document.querySelectorAll(".ranobelib > a")
        type = "ranobe"
        btn.text("Читать")
        await findInLinks(links)
    }
    async function findInLinks(as) {
        href = []
        for (let i in as) {
            if (as[i].href) {
                i = (as[i].href.split("?")[0].replace("https://ranobelib.me/", "").replace("https://mangalib.me/", "").replace("ru/", "").replace("book/", "").replace("ranobes/", "").replace("ranobe/", "").replace("manga/", "").replace("mangas/", ""))
                let response = await GetResourceAsync(LibSocialApiLink + "/manga/" + i)
                lic = response.data.is_licensed
                href.push(response.data.slug_url)
            }
        }
    }
    btn.on("click", ()=>{
        btn.remove();
        document.querySelector('.c-description').style.cssText = `
            margin-left:0;
        `
        if (type == "anime"){
            createWatcher(href)
        }
        else if (type == "manga" || type == "ranobe"){
            createReader(href, type)
        }
    })
    if (!lic && (href || href.length)) 
        document.querySelectorAll('.c-image').forEach(e => e.appendChild(btn[0]))
}
ready(addStyles)
ready(addBtn)