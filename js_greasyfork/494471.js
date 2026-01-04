// ==UserScript==
// @name         Optimization Script
// @namespace    http://tampermonkey.net/
// @description  Optimization11
// @author       FETeam
// @match        https://www.n11.com/genel/optimization-system-118162207
// @version      1.0
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494471/Optimization%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/494471/Optimization%20Script.meta.js
// ==/UserScript==

/**
 * Cookie Controller
 */
function setCookie(e, t, i) {
    let o = new Date;
    o.setTime(o.getTime() + 864e5 * i);
    let n = o.toUTCString();
    return document.cookie = `${e}=${t};expires=${n};path=/;SameSite=Strict;`
}

function getCookie(e) {
    let t = `${e}=`, i = document.cookie.split(';');
    for (let o = 0; o < i.length; o++) {
        let n = i[o];
        for (; ' ' == n.charAt(0);) n = n.substring(1);
        if (0 == n.indexOf(t)) return n.substring(t.length, n.length)
    }
    return !1
}

function checkCookie(e) {
    return !!e && document.cookie.includes(`${e}=`)
}

function clearCookie(e) {
    setCookie(e, '', -1)
}


function pushDataLayer(variation) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'InternalAB',
        'Variation': variation
    });
    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>dataLayer</b> gönderildi : ' + variation + ' </div>');
}

function optimizationRouter() {
    const optimizationTraffic = Math.random();
    if (optimizationTraffic <= 0.5) {
        document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>trafik</b> ayarlandı : teste girecek</div>');
        return 1;
    } else {
        document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>trafik</b> ayarlandı : teste girmeyecek</div>');
        return 0;
    }
}

const optOptions = {
    isActive: true,
    isCookiePermit: window.dataLayer.filter(item => item.categories)[0]?.categories.marketing || false,
    pageName: window.dataLayer.filter(item => item.pageName)[0]?.pageName || '',
    test_version_1: 'TESTNAME_A',
    test_version_2: 'TESTNAME_B'
};

/**
 * Optimization Styler
 * Test versiyonunda kullanılacak custom CSS'leri tanımlamak için kullanılır.
 * Farklı varyasyonlarda farklı stiller kullanılacak ise, fonksiiyon arttırılabilir.
 */
function addCustomCSS() {
    const customCSS = `
    .optimization-css {
        color:#000;
    }
`;
    document.head.insertAdjacentHTML('beforeend', `<style rel="stylesheet" class="optimization-styler">${customCSS}</style>`);
    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>CSS</b>: optimizasyon css eklendi</div>');
}

function versionA() {
    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>TEST</b>: ' + optOptions.test_version_1 + ' isimli teste girdi</div>');
    setCookie('Optimization', optOptions.test_version_1, 365);
    pushDataLayer(optOptions.test_version_1);

    // Functions

}

function versionB() {
    setCookie('Optimization', optOptions.test_version_2, 365);
    addCustomCSS();
    pushDataLayer(optOptions.test_version_2);
    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>TEST</b>: ' + optOptions.test_version_2 + ' isimli teste girdi</div>');

    $('.guide #testButton').css('background-color', 'red');
    $('.guide #testButton').text('Test Aktif');

    // Functions

}

/**
 * dataLayer DataPush
 * teste giren kullanıcı bilgisini dataLayer'a yollamak için kullanılır.
 * pushDataLayer('TESTNAME');
 */

function optimizationUtils() {

    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div>Optimization Script Loaded!!</div>');

    if (optOptions.isActive && optOptions.isCookiePermit && optOptions.pageName === 'static') {

        document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>User</b> : marketting onayı aktif, teste girebilir.</div>');

        if (!checkCookie('Optimization')) {
            setCookie('Optimization', '', 365);
            document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>Cookie</b> : Optimization isimli cookie oluşturuldu</div>');
        }

        const optimizationController = getCookie('Optimization');
        if (!optimizationController) {

            const testUser = optimizationRouter();
            switch (testUser) {
                case 0:
                    versionA();
                    break;
                case 1:
                    versionB();
                    break;
            }
        } else {
            switch (optimizationController) {
                case optOptions.test_version_1:
                    versionA();
                    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>TEST</b> : bu kullanıcı daha önce <b>' + optOptions.test_version_1 + '</b> isimli testi görmüş, tekrar aynı teste girdi</div>');
                    break;
                case optOptions.test_version_2:
                    versionB();
                    document.querySelector('.optimizationMessages .optiCodes').insertAdjacentHTML("beforeend", '<div><b>TEST</b> : bu kullanıcı daha önce <b>' + optOptions.test_version_2 + '</b> isimli testi görmüş, tekrar aynı teste girdi</div>');
                    break;
            }
        }
    }

}

window.addEventListener ? window.addEventListener("load", optimizationUtils, !1) : window.attachEvent ? window.attachEvent("onload", optimizationUtils) : window.onload = optimizationUtils;