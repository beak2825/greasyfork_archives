// ==UserScript==
// @name         上海学习网数字阅读全自动任务脚本
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  自动执行所有学习任务，包含签到、视频打卡、音频打卡、阅读打卡、书评提交、照片上传打卡
// @match        https://szyd.shlll.net/*
// @author       xxxu00
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538694/%E4%B8%8A%E6%B5%B7%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%95%B0%E5%AD%97%E9%98%85%E8%AF%BB%E5%85%A8%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538694/%E4%B8%8A%E6%B5%B7%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%95%B0%E5%AD%97%E9%98%85%E8%AF%BB%E5%85%A8%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** === 配置区域 === ***/
    const DEBUG = true;
    const SHOW_ALERT = false;
    const DURATION = 10;
    const DELAY_MS = 1500;

    const COMMENT_LIST = [
        "一本好书，值得一读，值得推荐！",
        "内容丰富，受益匪浅，强烈推荐！",
        "讲解清晰，实用性强，点赞！",
        "非常精彩的书，读后有收获！",
        "好书不容错过，每天进步一点点。",
        "深入浅出，通俗易懂，非常喜欢。",
        "受益良多，感谢作者的付出。",
        "精彩纷呈，学习到了很多新知识。"
    ];

    const courseIds = ["3501367779455", "3501363586423", "3501363585849", "3501363847569", "3501362274926", "3501362274952", "3501362274539"];
    const audioIds = ["80", "79", "78", "77", "76", "75", "74", "73", "72", "71", "70", "69", "68"];
    const readBookIds = ["4392995807232", "4379005706240", "4379003871232", "4379002560512", "4378997055488", "4378996006912", "4379001511936", "4379011211264", "4379013308416", "4378998366208"];
    const commentBookIds = ["4392995807232", "4379005706240", "4379003871232", "4379002560512", "4378997055488", "4378996006912", "4379001511936", "4379011211264", "4379013308416", "4378998366208"];
    const imageUrls = [
        "https://cdn.shlll.net/2025Reading/2025/06/06/12702ce48d8e40268fe6cd923d8ffcf1.png",
        "https://cdn.shlll.net/2025Reading/2025/06/06/1274042c24d83163sfd3268fs22dcsf2.png",
        "https://cdn.shlll.net/2025Reading/2025/06/06/12702ce1482e4069ge6cd9323d8ffc63.png",
        "https://cdn.shlll.net/2025Reading/2025/06/06/12702ce9412a2069ge6cd9323d8ffc64.png",
        "https://cdn.shlll.net/2025Reading/2025/06/06/12702ce238de4069ge6cd9323d8ffc65.png",
        "https://cdn.shlll.net/2025Reading/2025/06/06/12702ce48d202695ff4d922bd78ffc16.png"
    ];

    const URLS = {
        SIGN: 'https://szyd.shlll.net/2025_reading_api/sign/actSign',
        VIDEO: 'https://szyd.shlll.net/2025_reading_api/courseRead/addCourseReadRecord',
        AUDIO: 'https://szyd.shlll.net/2025_reading_api/audioRead/addAudioReadRecord',
        READ: 'https://szyd.shlll.net/2025_reading_api/bookRead/addBookReadRecord',
        COMMENT: 'https://szyd.shlll.net/2025_reading_api/bookComment/addBookComment',
        PHOTO: 'https://szyd.shlll.net/2025_reading_api/photoInfo/addPhoto'
    };

    const log = (...args) => DEBUG && console.log('[SZYD]', ...args);
    const showMessage = msg => SHOW_ALERT ? alert(msg) : log(msg);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const getToken = () => (document.cookie.match(/Authorization=([^;]+)/) || [])[1] || null;

    function getHeaders(token) {
        return {
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'https://szyd.shlll.net',
            'Referer': 'https://szyd.shlll.net/home'
        };
    }

    function getRandom(list, count) {
        return list.slice().sort(() => Math.random() - 0.5).slice(0, count);
    }

    async function doSign(token) {
        try {
            const res = await fetch(URLS.SIGN, {
                method: 'POST',
                headers: getHeaders(token),
                credentials: 'include'
            });
            const data = await res.json();
            log('[签到]', data);
        } catch (e) {
            console.error('[签到失败]', e);
        }
    }

    async function postRead(token, id, type) {
        const url = type === 'video' ? URLS.VIDEO : URLS.AUDIO;
        const payload = type === 'video' ? { courseId: id, duration: DURATION } : { audioId: id, duration: DURATION };
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            log(`[${type}]`, id, await res.json());
        } catch (e) {
            console.error(`[${type}失败]`, id, e);
        }
    }

    async function postBookRead(token, bookId) {
        try {
            const res = await fetch(URLS.READ, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ bookId, duration: DURATION }),
                credentials: 'include'
            });
            log('[阅读]', bookId, await res.json());
        } catch (e) {
            console.error('[阅读失败]', bookId, e);
        }
    }

    async function postComment(token, bookId, content) {
        try {
            const res = await fetch(URLS.COMMENT, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ bookId, content }),
                credentials: 'include'
            });
            log('[评论]', bookId, await res.json());
        } catch (e) {
            console.error('[评论失败]', bookId, e);
        }
    }

    async function postPhoto(token, imageUrl) {
        try {
            const res = await fetch(URLS.PHOTO, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ imageUrl }),
                credentials: 'include'
            });
            log('[照片]', imageUrl, await res.json());
        } catch (e) {
            console.error('[照片失败]', imageUrl, e);
        }
    }

    async function main() {
        const token = getToken();
        if (!token) return alert("未获取到登录Token，请先登录！");

        await doSign(token);
        await sleep(DELAY_MS);

        for (const id of getRandom(courseIds, 2)) {
            await postRead(token, id, 'video');
            await sleep(DELAY_MS);
        }

        for (const id of getRandom(audioIds, 4)) {
            await postRead(token, id, 'audio');
            await sleep(DELAY_MS);
        }

        for (const id of getRandom(readBookIds, 5)) {
            await postBookRead(token, id);
            await sleep(DELAY_MS);
        }

        const books = getRandom(commentBookIds, 4);
        const comments = getRandom(COMMENT_LIST, 4);
        for (let i = 0; i < books.length; i++) {
            await postComment(token, books[i], comments[i]);
            await sleep(DELAY_MS);
        }

        for (const url of getRandom(imageUrls, 4)) {
            await postPhoto(token, url);
            await sleep(DELAY_MS);
        }

        alert("✅ 所有任务已完成！");
    }

    window.addEventListener('load', main);
})();
