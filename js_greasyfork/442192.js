// ==UserScript==
// @name         R10 AdFck
// @namespace    https://KekikAkademi.org/Kahve
// @description  R10.Net Reklam Engelleyici
// @copyright    2024, keyiflerolsun, https://t.me/KekikAkademi
// @version      1.41
// @license      GPLv3
// @author       @KekikAkademi
// @match        *://www.r10.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=r10.net
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442192/R10%20AdFck.user.js
// @updateURL https://update.greasyfork.org/scripts/442192/R10%20AdFck.meta.js
// ==/UserScript==


// ! Eleman Varsa Sil
function icinden_gec(secici) {
    let eleman = jQuery(secici)

    if (eleman.length) {
        eleman[0].remove()
    }

    return jQuery(secici)
}

// ! XPath Seçici
function x_path(STR_XPATH) {
    let xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    let xnodes = [];
    let xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

// ! XPATH Varsa Sil
function x_del(secici) {
    let eleman = x_path(secici)

    if (eleman.length) {
        eleman[0].remove()
    }

    return x_path(secici)
}

// ! verilen xpath bütün eşleşenlerini sil
function x_hepsi(xpath) {
    let divs = x_path(xpath);

    for (let i = 0; i < divs.length; i++) {
        divs[i].remove();
    }
}

// ! Link Yönlendirme İptali
function yonlendirme_sil() {
    let _yonlendir = 'https://www.r10.net/yonlendir/?adres='
    jQuery(`a[href^="${_yonlendir}"]`).each(function () {
        this.href = decodeURIComponent(this.href.replace(_yonlendir, "").split('&token')[0])
    })
}


// * Kaynak Kod Yüklenince
jQuery(document).ready(function () {

    // ! Üstteki Reklam Sil
    icinden_gec('section:contains("topbar")')

    // ! Üst Alt
    //x_del("//div[@class='breadCrumb']/preceding-sibling::div")
    //x_del("//div[@class='breadCrumb']/following-sibling::div")
    //x_del("//div[@class='pagination']/following-sibling::div")
    x_hepsi("//div[starts-with(@class, 'rc')]")
    x_hepsi("//li[starts-with(@class, 'ra')]")

    // ! Sol Taraftaki Reklamı Sil
    icinden_gec('.head:contains("Reklam")')
    jQuery('main').css('padding-left', 0)

    // ! Kategori İçi Sponsorlu
    icinden_gec('a[rel*="sponsored"]')

    // ! Blog Reklam Sil
    icinden_gec('div[class="blogposts"]')

    // ! Link Yönlendirme İptali
    yonlendirme_sil()

    // ! Blog Sponsorlu
    x_del("//span[contains(text(), 'SPONSORLU')]/ancestor::div[contains(@class, 'post')]")

    // ! Hedef Linklerin Reklamlarını Sil
    icinden_gec('a[href*="jetteknoloji"]')
    icinden_gec('a[href*="ticimax"]')
    icinden_gec('a[href*="ikas.com"]')
    icinden_gec('a[href*="3449409-ikas-e-ticaret"]')
    icinden_gec('a[href*="vallet.com.tr"]')
    icinden_gec('a[href*="paytr.com/sanal-pos?"]')
    icinden_gec('a[href*="paytr.com/neopos?"]')

    // ! Resimleri Sil
    icinden_gec('img[src*="cdn.r10.net/editor/3713/3758817470.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/27818/2549053017.gif"]')
    icinden_gec('img[src*="idrydigital.com/upload/banner1.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/3713/1230360301.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/27818/1648465821.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/100103/771510958.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/51273/3005339574.gif"]')
    icinden_gec('img[src*="cdn.r10.net/r10/i/sosyalmarket/1.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/113687/4136891095.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/3713/1758547484.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/27818/2636925725.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/3713/2723728029.png"]')
    icinden_gec('img[src*="cdn.r10.net/editor/27818/3819645078.gif"]')
    icinden_gec('img[src*="cdn.r10.net/editor/27818/3153451671.gif"]')
})


// * Sayfa Yüklenince
jQuery(window).on("load", function () {

    // ! PM Alanı Fix
    if (window.location.pathname == '/private.php') {
        jQuery('div.conversation')[0].style.width = null
        jQuery('div.conversation')[0].style.height = null
        jQuery('div.conversation div')[0].style.width = null
        jQuery('div.conversation div div')[0].style.width = null
    }

})



// * Her Saniye
function kontrolEt() {

    // ! Kategori Sponsor Reklam
    jQuery('li').filter(function () {
        return this.id.match(/sponsorReklam/)
    }).remove()


    // * URL Değişince
    if (window.location.href != eldekiURL) {

        // ! Link Yönlendirme İptali
        yonlendirme_sil()

        eldekiURL = window.location.href
    }
}

let eldekiURL = window.location.href
setInterval(kontrolEt, 1000)