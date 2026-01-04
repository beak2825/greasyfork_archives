// ==UserScript==
// @name         New Userscript with Achievements Claim
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Banfaucet
// @author       You
// @match        https://banfaucet.com/ptc*
// @match        https://banfaucet.com/links*
// @match        https://banfaucet.com/achievements*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @license MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529805/New%20Userscript%20with%20Achievements%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/529805/New%20Userscript%20with%20Achievements%20Claim.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    /* --------------------- Common Functions --------------------- */

    // Hàm sleep hỗ trợ delay theo mili giây
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // safeFetch: Nếu request đến banfaucet.com trả về status 403 và tiêu đề không phải "Just a moment...", reload lại trang.
    async function safeFetch(url, options = {}) {
        let response = await fetch(url, options);
        if (response.status === 403 && url.includes("banfaucet.com")) {
            if (document.title.trim() !== "Just a moment...") {
                console.warn(`Response 403 từ ${url}. Reloading page...`);
                console.log(`Đang chờ 10 giây trước khi gọi verify URL...`);
                await sleep(10 * 1000);
                window.location.reload();
            } else {
                console.warn(`Response 403 từ ${url} nhưng trang đang ở challenge ("Just a moment...").`);
            }
        }
        return response;
    }

    // gmFetch: Bọc GM_xmlhttpRequest thành Promise để sử dụng async/await.
    function gmFetch(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest(Object.assign({}, options, {
                onload: function(response) {
                    resolve(response);
                },
                onerror: function(error) {
                    reject(error);
                }
            }));
        });
    }

    // Hàm lấy captcha token sử dụng GM_xmlhttpRequest cho ads
    async function getCaptchaToken(adsUrl, siteKey) {
        const apiUrl = 'http://localhost:3000/cf-clearance-scraper';
        const payload = {
            url: adsUrl,       // URL của trang ads cần xử lý
            siteKey: siteKey,  // SiteKey tương ứng từ trang ads
            mode: "turnstile-min"
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: function(response) {
                    console.log("Response từ cf-clearance-scraper:", response.responseText);
                    try {
                        let data = JSON.parse(response.responseText);
                        if (data.token) {
                            console.log("Captcha token:", data.token);
                            resolve(data.token);
                        } else {
                            console.error("Không tìm thấy token trong response:", data);
                            resolve(null);
                        }
                    } catch (e) {
                        console.error("Lỗi khi parse JSON:", e);
                        resolve(null);
                    }
                },
                onerror: function(err) {
                    console.error("Lỗi khi gọi API cf-clearance-scraper:", err);
                    resolve(null);
                }
            });
        });
    }

    // verifyCaptcha: Gửi POST để xác minh captcha
    async function verifyCaptcha(verifyUrl, captchaToken, csrfToken, token) {
        const data = new URLSearchParams();
        data.append("captcha", "recaptchav2");
        data.append("cf-turnstile-response", captchaToken);
        data.append("g-recaptcha-response", captchaToken);
        data.append("csrf_token_name", csrfToken);
        data.append("token", token);

        try {
            let response = await fetch(verifyUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data.toString()
            });
            let result = await response.text();
            console.log("Kết quả xác minh captcha:", result);
        } catch (err) {
            console.error("Lỗi khi xác minh captcha:", err);
        }
    }

    /* --------------------- Shortlink Bypass Functions --------------------- */

    // Hàm getShortlinks: Lấy danh sách shortlink có tên "Adlink", "shrinkme", "shrinkearn", "chainfo", "clk.sh"
    // Lưu ý: Chỉ lấy các URL có domain chứa "banfaucet.com"
    async function getShortlinks() {
        try {
            let response = await safeFetch("https://banfaucet.com/links", { credentials: 'include' });
            let html = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let results = [];
            // Danh sách tên hợp lệ (so sánh không phân biệt chữ hoa chữ thường)
            const validNames = ["adlink", "shrinkme", "shrinkearn", "clk.sh"];

            let cards = doc.querySelectorAll('.card-lg');
            cards.forEach(card => {
                let titleElem = card.querySelector('h5.title');
                if (titleElem) {
                    let titleText = titleElem.textContent.trim().toLowerCase();
                    if (validNames.includes(titleText)) {
                        let aElem = card.querySelector('a.btn-one');
                        let url = aElem ? aElem.getAttribute('href') : null;
                        // Kiểm tra URL có chứa "banfaucet.com" hay không
                        if (url && url.includes("banfaucet.com")) {
                            let viewElem = card.querySelector('.pill-wrap1 .pill.yellow');
                            let viewText = viewElem ? viewElem.textContent.trim() : '';
                            results.push({ name: titleElem.textContent.trim(), url: url, views: viewText });
                        }
                    }
                }
            });
            return results;
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu shortlink:", err);
            return [];
        }
    }

    // processShortLink: Xử lý bypass cho 1 shortlink
    async function processShortLink(linkObj) {
        try {
            console.log("Xử lý shortlink:", linkObj);
            let response1 = await safeFetch(linkObj.url, { credentials: 'include' });
            let html1 = await response1.text();
            let parser = new DOMParser();
            let doc1 = parser.parseFromString(html1, 'text/html');

            let scriptContent = "";
            let scriptTags = doc1.getElementsByTagName('script');
            for (let script of scriptTags) {
                if (script.textContent.includes("location.href")) {
                    scriptContent = script.textContent;
                    break;
                }
            }
            let destUrlMatch = scriptContent.match(/location\.href\s*=\s*"([^"]+)"/);
            if (!destUrlMatch || !destUrlMatch[1]) {
                console.error("Không tìm thấy URL đích trong shortlink response.");
                return;
            }
            let destUrl = destUrlMatch[1];
            console.log("URL đích sau shortlink:", destUrl);

            // Gọi API bypass shortlink
            let bypassApi = `https://syid.my.id/in.php?apikey=Huanrose_101721744849&url=${encodeURIComponent(destUrl)}`;
            let bypassResponse = await gmFetch({
                method: "GET",
                url: bypassApi,
                headers: {
                    "Cache-Control": "max-age=0",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-User": "?1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Ch-Ua": `"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"`,
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": `"Windows"`,
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
                    "Priority": "u=0, i"
                }
            });
            let text2 = bypassResponse.responseText;
            console.log("Kết quả từ bypass API:", text2);
            let bypassMatch = text2.match(/url:"([^"]+)"&"time:(\d+)"/);
            if (!bypassMatch || !bypassMatch[1] || !bypassMatch[2]) {
                console.error("Không parse được kết quả từ bypass API.");
                return;
            }
            let backUrl = bypassMatch[1];
            let waitTime = parseInt(bypassMatch[2], 10);
            console.log("Back URL ban đầu:", backUrl, "Thời gian chờ (giây):", waitTime);

            backUrl = backUrl.replace('/back/', '/verify/');
            console.log("Back URL sau khi sửa:", backUrl);

            console.log(`Đang chờ ${waitTime} giây trước khi gọi verify URL...`);
            await sleep(waitTime * 1000);
            let response3 = await safeFetch(backUrl, { credentials: 'include' });
            console.log("Response từ verify URL:", response3);
            console.log("Bypass shortlink hoàn thành.");
        } catch (err) {
            console.error("Lỗi khi xử lý shortlink:", err);
        }
    }

    async function mainLoopShortlinks() {
        while (true) {
            let shortLinks = await getShortlinks();
            console.log("Danh sách shortlink:", shortLinks);
            if (shortLinks.length === 0) {
                console.log("Không còn shortlink. Kết thúc bypass shortlink.");
                break;
            }
            await processShortLink(shortLinks[0]);
            await sleep(3000);
        }
    }

    /* --------------------- Ads Bypass Functions --------------------- */

    // getAdUrls: Lấy danh sách ads từ trang /ptc
    async function getAdUrls() {
        try {
            let response = await safeFetch("https://banfaucet.com/ptc", { credentials: 'include' });
            let html = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            const buttons = doc.querySelectorAll('.claim-card button');
            let ads = [];
            buttons.forEach(btn => {
                const onclickAttr = btn.getAttribute('onclick');
                const regex = /window\.location\s*=\s*'([^']+)'/;
                const match = onclickAttr && onclickAttr.match(regex);
                if (match && match[1]) {
                    const card = btn.closest('.claim-card');
                    let waitSeconds = 0;
                    if (card) {
                        const pillYellow = card.querySelector('.pill.yellow');
                        if (pillYellow) {
                            let waitText = pillYellow.textContent.trim();
                            let waitMatch = waitText.match(/(\d+)/);
                            if (waitMatch) {
                                waitSeconds = parseInt(waitMatch[1], 10);
                            }
                        }
                    }
                    ads.push({ url: match[1], wait: waitSeconds });
                }
            });
            return ads;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ads:", error);
            return [];
        }
    }

    // loadAd: Xử lý bypass cho 1 ad
    async function loadAd(ad) {
        try {
            let response = await safeFetch(ad.url, { credentials: 'include' });
            let html = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            console.log(`Đang chờ ${ad.wait} giây trước khi xử lý captcha của ad...`);
            await sleep(ad.wait * 1000);

            const iframe = doc.getElementById('ads');
            if (iframe) {
                console.log("Ad đã được load, tìm thấy iframe với src:", iframe.src);
            } else {
                console.log("Không tìm thấy iframe cho ad này.");
            }
            const recaptchaElem = doc.querySelector('.g-recaptcha[data-sitekey]');
            const sitekey = recaptchaElem ? recaptchaElem.getAttribute('data-sitekey') : null;
            if (sitekey) {
                console.log("Tìm thấy data-sitekey:", sitekey);
            } else {
                console.log("Không tìm thấy data-sitekey trong ad.");
            }
            const csrfTokenElem = doc.querySelector('input[name="csrf_token_name"]');
            const tokenElem = doc.querySelector('input[name="token"]');
            const csrfTokenValue = csrfTokenElem ? csrfTokenElem.value : '';
            const tokenValue = tokenElem ? tokenElem.value : '';
            if (sitekey) {
                let captchaToken = await getCaptchaToken(ad.url, sitekey);
                if (captchaToken) {
                    const verifyUrl = ad.url.replace("/view/", "/verify/");
                    await verifyCaptcha(verifyUrl, captchaToken, csrfTokenValue, tokenValue);
                }
            }
        } catch (err) {
            console.error("Lỗi khi load ad:", err);
        }
    }

    async function mainLoopAds() {
        while (true) {
            let ads = await getAdUrls();
            console.log("Danh sách ads:", ads);
            if (ads.length === 0) {
                console.log("Không còn ads. Kết thúc bypass ads.");
                break;
            }
            await loadAd(ads[0]);
            await sleep(3000);
        }
    }

    /* --------------------- Achievements Claim Function --------------------- */

    // claimAchievements: Sau khi 2 task hoàn thành, duyệt trang achievements và claim những achievement đã hoàn thành
    async function claimAchievements() {
        try {
            console.log("Đang lấy achievements ban đầu...");
            let response = await safeFetch("https://banfaucet.com/achievements", { credentials: 'include' });
            let html = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let achievementCards = doc.querySelectorAll(".card-lg");
            let claimActions = [];

            // Lấy danh sách các form action từ các achievement đã hoàn thành (width: 100%)
            achievementCards.forEach(card => {
                let limitBar = card.querySelector(".limit-bar");
                if (limitBar && limitBar.getAttribute("style") && limitBar.getAttribute("style").includes("width: 100%")) {
                    let form = card.querySelector("form");
                    if (form && form.action) {
                        claimActions.push(form.action);
                    }
                }
            });
            console.log("Danh sách claim actions:", claimActions);

            // Với mỗi action, trước khi gửi claim, lấy lại CSRF token mới từ trang achievements
            for (let action of claimActions) {
                console.log("Lấy lại CSRF token cho action:", action);
                let freshResponse = await safeFetch("https://banfaucet.com/achievements", { credentials: 'include' });
                let freshHtml = await freshResponse.text();
                let freshDoc = new DOMParser().parseFromString(freshHtml, 'text/html');

                // Tìm card có form action trùng khớp
                let matchingCard = Array.from(freshDoc.querySelectorAll(".card-lg")).find(card => {
                    let form = card.querySelector("form");
                    return form && form.action === action;
                });

                if (!matchingCard) {
                    console.warn("Không tìm thấy card có form action:", action);
                    continue;
                }

                let csrfInput = matchingCard.querySelector('input[name="csrf_token_name"]');
                if (!csrfInput) {
                    console.warn("Không tìm thấy CSRF token cho action:", action);
                    continue;
                }

                let csrf = csrfInput.value;
                let postData = new URLSearchParams();
                postData.append("csrf_token_name", csrf);

                console.log("Claiming achievement tại:", action, "với CSRF token mới:", csrf);
                let claimResponse = await fetch(action, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: postData.toString()
                });
                let claimResult = await claimResponse.text();
                console.log("Kết quả claim cho", action, ":", claimResult);

                // Tùy chọn: chờ một chút giữa các lần claim
                await sleep(2000);
            }
        } catch (err) {
            console.error("Error claiming achievements:", err);
        }
    }

    /* --------------------- Main Concurrent Execution --------------------- */

    console.log("Chạy đồng thời bypass shortlink và bypass ads...");
    await Promise.all([ mainLoopShortlinks(), mainLoopAds() ]);
    console.log("Cả 2 task đều đã kết thúc.");

    // Sau khi 2 task hoàn thành, claim achievements
    await claimAchievements();
    console.log("Achievements đã được claim (nếu có).");
})();
