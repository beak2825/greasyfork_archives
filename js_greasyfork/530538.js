// ==UserScript==
// @name         Quảng Cáo FB | Edit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FaceBook ADS
// @author       Evin_codebip
// @match        https://adsmanager.facebook.com/*
// @icon         https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/8PtnTFGuUVu.png
// @grant        none
// @run-at       document-start
// @license      MIT; Copyright (c) 2025 You - All rights reserved except for isSwitch variable
// @downloadURL https://update.greasyfork.org/scripts/530538/Qu%E1%BA%A3ng%20C%C3%A1o%20FB%20%7C%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/530538/Qu%E1%BA%A3ng%20C%C3%A1o%20FB%20%7C%20Edit.meta.js
// ==/UserScript==

// Biến kiểm soát switch (giả sử bạn đã định nghĩa ở đâu đó, nếu không thì mặc định là true)
let isSwitch = true;

(function() {
    'use strict';

    // Danh sách class cũ và mới cho btnBack
    const oldClassListBack = "x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 xggy1nq x1ja2u2z x6s0dn4 x1ejq31n xd10rxx x1sy0etr x17r0tee x3nfvp2 xdl72j9 x1q0g3np x2lah0s x193iq5w x1n2onr6 x1hl2dhg x87ps6o xxymvpz xlh3980 xvmahel x1lku1pv x1g40iwv x1g2r6go x16e9yqp x12w9bfk x15406qy x1lcm9me x1yr5g0i xrt01vj x10y3i5r xob88yx xaatb59 x1qgsegg xo1l8bm xbsr9hj x1v911su x1y1aw1k xwib8y2 x1swvt13 x1pi30zi".split(" ");
    const newClassListBack = "x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 xggy1nq x1ja2u2z x1h6gzvc x6s0dn4 x1ejq31n xd10rxx x1sy0etr x17r0tee x3nfvp2 xdl72j9 x1q0g3np x2lah0s x193iq5w x1n2onr6 x1hl2dhg x87ps6o xxymvpz xlh3980 xvmahel x1lku1pv x1g40iwv x1g2r6go x16e9yqp x12w9bfk x15406qy x1lcm9me x1yr5g0i xrt01vj x10y3i5r xtpvj6k xaatb59 x1qgsegg xo1l8bm x1v911su xis6omg x1y1aw1k xwib8y2 x1swvt13 x1pi30zi".split(" ");

    // Danh sách class cũ và mới cho btnPost
    const oldClassListPost = "x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 xggy1nq x1ja2u2z x1t137rt x6s0dn4 x1ejq31n xd10rxx x1sy0etr x17r0tee x3nfvp2 xdl72j9 x1q0g3np x2lah0s x193iq5w x1n2onr6 x1hl2dhg x87ps6o xxymvpz xlh3980 xvmahel x1lku1pv x1g40iwv x1g2r6go x16e9yqp x12w9bfk x15406qy x1lcm9me x1yr5g0i xrt01vj x10y3i5r xo1l8bm x140t73q xasdndc x1y1aw1k xwib8y2 x1swvt13 x1pi30zi".split(" ");
    const newClassListPost = "x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 xggy1nq x1ja2u2z x1h6gzvc x1t137rt x6s0dn4 x1ejq31n xd10rxx x1sy0etr x17r0tee x3nfvp2 xdl72j9 x1q0g3np x2lah0s x193iq5w x1n2onr6 x1hl2dhg x87ps6o xxymvpz xlh3980 xvmahel x1lku1pv x1g40iwv x1g2r6go x16e9yqp x12w9bfk x15406qy x1lcm9me x1yr5g0i xrt01vj x10y3i5r xo1l8bm x432r9b x60d0xz x1y1aw1k xwib8y2 x1swvt13 x1pi30zi".split(" ");

    // Hàm thay đổi class
    function replaceClasses(element, oldClasses, newClasses) {
        if (!element || !isSwitch) return;

        oldClasses.forEach(className => {
            element.classList.remove(className);
        });

        newClasses.forEach(className => {
            element.classList.add(className);
        });
    }

    // Hàm thay đổi text ở góc trên bên phải
    function distribution() {
        // Global
        let userName_campaign = document.querySelector('span[data-surface="/am/editor_drawer"] div.ellipsis > div.clearfix > div._4bl9 > span');
        let userStatus_campaign = document.querySelector('span[data-surface="/am/editor_drawer"] div.ellipsis > div.clearfix > div._4bl7');
        let isDistribution = document.querySelector("div[tabindex='0'] > div[role='table'] > div > div:nth-child(3) div._1gd5 > div:nth-child(2) > div._3pzj > div:first-child > div > span");

        // Edit
        let ad_disapproval_message_section = document.querySelector("#adgroupDisapprovalMessageEditorComponent ._5v33");

        // Biến kiểm tra trạng thái thay đổi của từng phần tử || Global
        let changedUserName = false;
        let changeduserStatus = false;
        let changedDistribution = false;

        // Biến kiểm tra trạng thái thay đổi của từng phần tử || Edit
        let changedAd_disapproval_message_section = false;

        // Thêm biến kiểm tra thay đổi class của Code 2 sang Code 1
        let changedCustomDiv = false;

        if (userName_campaign && userName_campaign.innerText !== "Đang hoạt động") {
            userName_campaign.innerText = "Đang hoạt động";
            changedUserName = true;
        }

        const htmlGreenButton = `<div class="x1yc453h x1kky2od x1y5rjcf">
                      <i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://z-p3-static.xx.fbcdn.net/rsrc.php/v3/y3/r/DeKP7dAAazZ.png?_nc_eui2=AeHFEiEVD3T0dNgan0LeKU-1S1GAk4DVEUtLUYCTgNURSxRMuIu42TpRbyihcXBxdR-13jFmCA1PdS5XAbUmlK3A&quot;); background-position: -250px -281px; background-size: auto; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i></div>`;
        if (userStatus_campaign && userStatus_campaign.innerHTML !== htmlGreenButton) {
            userStatus_campaign.innerHTML = htmlGreenButton;
            changeduserStatus = true;
        }

        let dataFake = '<div class="ellipsis"><div class="clearfix _ikh">' +
            '<div class="_4bl7"><div class="x1yc453h x1kky2od x1y5rjcf"><i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://z-p3-static.xx.fbcdn.net/rsrc.php/v3/y3/r/DeKP7dAAazZ.png?_nc_eui2=AeHFEiEVD3T0dNgan0LeKU-1S1GAk4DVEUtLUYCTgNURSxRMuIu42TpRbyihcXBxdR-13jFmCA1PdS5XAbUmlK3A&quot;); background-position: -250px -281px; background-size: auto; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i></div></div><div class="_4bl9"><span class="xmi5d70 x1fvot60 xo1l8bm xxio538 xbsr9hj xq9mrsl x1h4wwuj xeuugli">Đang hoạt động</span></div></div></div>';
        if (isDistribution && isDistribution.innerHTML !== dataFake) {
            isDistribution.innerHTML = dataFake;
            changedDistribution = true;
        }

        // Biến thay đổi || Edit
        if (ad_disapproval_message_section && ad_disapproval_message_section.style.display !== "none") {
            ad_disapproval_message_section.style.display = "none";
            changedAd_disapproval_message_section = true;
        }

        // Xử lý btnBack
        let btnBack = document.querySelector("div._705e > div > div > div > div._8hs3._8j6- > div.x2lah0s > div > div:first-child div[data-auto-logging-component-type='GeoButton']");
        let btnBackProcessed = false;
        if (btnBack) {
            replaceClasses(btnBack, oldClassListBack, newClassListBack);
            btnBack.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
            }, true);
            btnBack.style.pointerEvents = 'none';
            if (isSwitch && btnBack.textContent.trim() === "Quay lại") {
                btnBack.textContent = "Bỏ bản nháp";
            }
            btnBackProcessed = true;
        }

        // Xử lý btnPost
        let btnPost = document.querySelector("div._705e > div > div > div > div._8hs3._8j6- > div.x2lah0s > div > div:nth-child(2) div[data-auto-logging-component-type='GeoButton']");
        let btnPostProcessed = false;
        if (btnPost) {
            replaceClasses(btnPost, oldClassListPost, newClassListPost);
            btnPost.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
            }, true);
            btnPost.style.pointerEvents = 'none';
            btnPostProcessed = true;
        }

        // Xử lý thay đổi class từ Code 2 sang Code 1
        let changeDiv = document.querySelector("#ads_pe_container div._219p > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > div > div > div > div:first-child");
        if (changeDiv && isSwitch) {
            // Xóa class cũ
            changeDiv.className = '';
            // Thêm class của Code 1
            changeDiv.classList.add('x6s0dn4', 'x78zum5', 'x13fuv20', 'xu3j5b3', 'x1q0q8m5', 'x26u7qi', 'x178xt8z', 'xm81vs4', 'xso031l', 'xy80clv', 'xwebqov', 'xvyu6v8', 'xrsgblv', 'x10lij0i', 'xzolkzo', 'x12go9s9', 'x1rnf11y', 'xprq8jg', 'xo1l8bm', 'xbsr9hj', 'x1k4ywey', 'x13dflua', 'xxziih7', 'x12w9bfk', 'x14qfxbe', 'xexx8yu', 'x4uap5', 'x18d9i69', 'xkhd6sd', 'x15406qy');

            // Thay đổi class của div con thứ hai
            let childDiv = changeDiv.querySelector('div:nth-child(2)');
            if (childDiv) {
                childDiv.className = '';
                childDiv.classList.add('xw4jnvo', 'x1qx5ct2', 'xzolkzo', 'x12go9s9', 'x1rnf11y', 'xprq8jg', 'x13dflua', 'x6o7n8i', 'xxziih7', 'x12w9bfk', 'xo1l8bm', 'x140t73q', 'x19bke7z', 'x1psfjxj');
            }
            changedCustomDiv = true;
        }

        // Chỉ ngắt observer khi tất cả các phần tử đều được thay đổi ít nhất một lần
        if (changedUserName && changeduserStatus && changedDistribution && changedAd_disapproval_message_section && btnBackProcessed && btnPostProcessed && changedCustomDiv) {
            observer.disconnect();
            console.log("Đã thay đổi tất cả và ngắt observer.");
        } else {
            console.log("Chưa thay đổi hết: ",
                        "userName_campaign:", changedUserName,
                        "userStatus_campaign:", changeduserStatus,
                        "isDistribution:", changedDistribution,
                        "ad_disapproval_message_section:", changedAd_disapproval_message_section,
                        "btnBack:", btnBackProcessed,
                        "btnPost:", btnPostProcessed,
                        "changeDiv:", changedCustomDiv
                       );
        }
    }

    // Sử dụng MutationObserver để theo dõi DOM
    const observer = new MutationObserver((mutations, obs) => {
        distribution();
    });

    // Bắt đầu quan sát toàn bộ document
    observer.observe(document, {
        childList: true, // Theo dõi thay đổi trong các phần tử con
        subtree: true // Theo dõi toàn bộ cây DOM
    });

    // Thử thay đổi ngay lập tức (có thể không hiệu quả lúc document-start)
    distribution();

    // Your code here...
})();