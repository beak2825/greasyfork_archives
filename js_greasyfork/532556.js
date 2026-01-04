// ==UserScript==
// @name         Cloudflare Turnstile Bypass with 2Captcha
// @namespace    http://yourdomain.com/
// @version      1.1
// @description  Solves Cloudflare Turnstile using 2Captcha
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532556/Cloudflare%20Turnstile%20Bypass%20with%202Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/532556/Cloudflare%20Turnstile%20Bypass%20with%202Captcha.meta.js
// ==/UserScript==

const axios = require('axios');

// API Key from 2Captcha (আপনারটা এখানে বসান)
const API_KEY = '4429633d0beca8b7e7142514e2965e57';

// CAPTCHA site key ও target URL (এগুলো আপনার পেজ অনুযায়ী বসাতে হবে)
const SITE_KEY = 'YOUR_SITE_KEY_HERE';
const PAGE_URL = 'https://example.com'; // যেই পেজে CAPTCHA আছে

// Step 1: CAPTCHA Solve Request পাঠানো
async function requestCaptchaSolution() {
    try {
        const res = await axios.post('http://2captcha.com/in.php', null, {
            params: {
                key: API_KEY,
                method: 'turnstile', // যদি Turnstile হয়, নাহলে 'userrecaptcha'
                sitekey: SITE_KEY,
                pageurl: PAGE_URL,
                json: 1
            }
        });

        if (res.data.status === 1) {
            console.log('Captcha ID:', res.data.request);
            return res.data.request;
        } else {
            throw new Error('CAPTCHA request failed: ' + res.data.request);
        }
    } catch (err) {
        console.error('Error requesting CAPTCHA:', err.message);
    }
}

// Step 2: সলিউশন পাওয়ার জন্য Wait ও Poll করা
async function getCaptchaResult(captchaId) {
    try {
        while (true) {
            const res = await axios.get('http://2captcha.com/res.php', {
                params: {
                    key: API_KEY,
                    action: 'get',
                    id: captchaId,
                    json: 1
                }
            });

            if (res.data.status === 1) {
                console.log('CAPTCHA Solved:', res.data.request);
                return res.data.request;
            } else if (res.data.request === 'CAPCHA_NOT_READY') {
                console.log('Waiting for solution...');
                await new Promise(r => setTimeout(r, 5000));
            } else {
                throw new Error('Error getting CAPTCHA result: ' + res.data.request);
            }
        }
    } catch (err) {
        console.error('Error getting solution:', err.message);
    }
}

// Full Flow
(async () => {
    const captchaId = await requestCaptchaSolution();
    if (captchaId) {
        const solution = await getCaptchaResult(captchaId);
        console.log('\nUse this token in your request:', solution);

        // এখানে আপনি এই টোকেন দিয়ে যেই রিকুয়েস্ট করবেন সেটি তৈরি করতে পারেন।
    }
})();