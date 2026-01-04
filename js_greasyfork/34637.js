// ==UserScript==
// @name         Adfly-skipper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically skip ad-fly
// @author       giuseppe-dandrea
// @match        http*://q.gs/*
// @match        http*://j.gs/*
// @match        http*://adf.ly/*
// @match        http*://queuecosm.bid/*
// @match        http*://threadsphere.bid/*
// @match        http*://restorecosm.bid/*
// @match        http*://clearload.bid/*
// @match        http*://bc.vc/*
// @match        http*://swzz.xyz/*
// @match        http*://vcrypt.net/*
// @match        http*://swiftviz.net/*
// @match        http*://4snip.pw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34637/Adfly-skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/34637/Adfly-skipper.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.indexOf("q.gs") != -1 ||
    url.indexOf("j.gs") != -1 ||
    url.indexOf("adf.ly") != -1 ||
    url.indexOf("queuecosm.bid") != -1 ||
    url.indexOf("threadsphere.bid") != -1 ||
    url.indexOf("restorecosm.bid") != -1 ||
    url.indexOf("clearload.bid") != -1 ||
    url.indexOf("swiftviz.net") != -1 ) {
    adfly_bypass();
}
else if (url.indexOf("bc.vc") != -1 ) {
    bcvc_bypass();
}
else if (url.indexOf("swzz.xyz") != -1 ) {
    swzz_bypass();
}
else if (url.indexOf("vcrypt.net") != -1 ) {
    vcrypt_bypass();
}
else if (url.indexOf("linkshrink.net") != -1 ) {
    linkshrink_bypass();
}
else if (url.indexOf("4snip.pw") != -1) {
    foursnip_bypass();
}

function adfly_bypass() {
    var href = "";
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		href = $('#skip_bu2tton')[0].href;
        if (href === "") {
            adfly_bypass();
        }
        else {
            window.open(href, '_self');
        }
	});
}

function bcvc_bypass() {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		if ($('#skip_btt').size() === 1) {
            $('#skip_btt').trigger('click');
        }
        else {
            bcvc_bypass();
        }
	});
}

function swzz_bypass() {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		if ($('body > div.container > div.row > div > a').length === 1) {
            $('body > div.container > div.row > div > a').trigger('click');
        }
        else {
            swzz_bypass();
        }
	});
}

function vcrypt_bypass() {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		if ( $('body > center > center > form > input.btncontinue').length ) {
            $('body > center > center > form > input.btncontinue').trigger('click');
        }
        else if( $('body > div > div:nth-child(2) > div > div > a:nth-child(4)').length ) {
            $('body > div > div:nth-child(2) > div > div > a:nth-child(4)').trigger('click');
        }
        else if ( $('body > center > center > div > form > input.btncontinue').length ) {
            $('body > center > center > div > form > input.btncontinue').trigger('click');
        }
        else {
            vcrypt_bypass();
        }
	});
}

function linkshrink_bypass() {
    new Promise((resolve) => setTimeout(resolve, 8000)).then(() => {
		if ($('#btd').length === 1) {
            $('#btd').trigger('click');
        }
        else {
            linkshrink_bypass();
        }
	});
}

function foursnip_bypass() {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        if ($('#invisibleCaptchaShortlink').length) {
            $('#invisibleCaptchaShortlink').trigger('click');
        } else {
            foursnip_bypass();
        }
    });
}