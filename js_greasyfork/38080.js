// ==UserScript==
// @name     Report It
// @description Chung tay cùng cộng đồng đưa Beat về nơi an nghỉ cuối cùng.
// @version  5
// @grant    none
// @match        *://m.facebook.com/BanHoiVozerTraLoi*
// @match        *://m.facebook.com/beatvn.page*
// @match        *://m.facebook.com/beatvn.troll*
// @match        *://m.facebook.com/zoom.beatvn*
// @match        *://m.facebook.com/beatvn.quotes*
// @match        *://m.facebook.com/beatvn.world*
// @match        *://m.facebook.com/beatvn.video*
// @match        *://m.facebook.com/beatvn.sport*
// @match        *://m.facebook.com/pages/more*
// @match        *://m.facebook.com/report*
// @match        *://m.facebook.com/nfx/basic/question*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/169098
// @downloadURL https://update.greasyfork.org/scripts/38080/Report%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/38080/Report%20It.meta.js
// ==/UserScript==

// chờ 15-30 phút giữa 2 lần report
var DELAY_BETWEEN_REPORT_MIN = 15 * 60;
var DELAY_BETWEEN_REPORT_MAX = 30 * 60;


function randomize(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}

if (/BanHoiVozerTraLoi|beatvn\.page|beatvn\.troll|zoom\.beatvn|beatvn\.quotes|beatvn\.world|beatvn\.video|beatvn\.sport/i.test(window.location.href)) {
    setTimeout(function() {
        $('table[role="presentation"] a[href^="/pages/more/"]').get(0).dispatchEvent(new MouseEvent('click'));
        $('table[role="presentation"] a[href^="/report/"]').get(0).dispatchEvent(new MouseEvent('click'));
    }, randomize(DELAY_BETWEEN_REPORT_MIN * 1000, DELAY_BETWEEN_REPORT_MAX * 1000));

} else if (/\/pages\/more/.test(window.location.href)) {
    if (/nfx_after_report=yes/.test(window.location.href)) {
				setTimeout(function() {
            $('table[role="presentation"] a[href^="/nfx/basic/question/"]').get(0).dispatchEvent(new MouseEvent('click'));
        }, randomize(DELAY_BETWEEN_REPORT_MIN * 1000, DELAY_BETWEEN_REPORT_MAX * 1000));
    } else {
        setTimeout(function() {
            $('table[role="presentation"] a[href^="/nfx/basic/question/"]').get(0).dispatchEvent(new MouseEvent('click'));
        }, randomize(5000, 15000));
    }

} else if (/\/nfx\/basic\/question/.test(window.location.href)) {
    setTimeout(function() {
        if ($('table[role="presentation"] input[name="done"]').length > 0) {
            $('table[role="presentation"] input[name="done"]').get(0).dispatchEvent(new MouseEvent('click'));
        } else {
            if ($('table[role="presentation"] input[value="harassment"]').length > 0) {
                $('table[role="presentation"] input[value="harassment"]').get(0).dispatchEvent(new MouseEvent('click'));
            } else {
                $('table[role="presentation"] input[value="REPORT_CONTENT"]').get(0).dispatchEvent(new MouseEvent('click'));
            }
            $('table[role="presentation"] input[type="submit"]').get(0).dispatchEvent(new MouseEvent('click'));
        }
    }, randomize(5000, 15000));
};