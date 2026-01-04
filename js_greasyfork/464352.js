// ==UserScript==
// @name         字幕库 Zimuku 自动输入验证码
// @namespace    bryan
// @version      0.2
// @description  获取并自动输入zimuku搜索页面验证码，首次打开搜索页面请等待数秒来加载第三方库
// @author       bryanyan
// @match        https://so.zimuku.org/*
// @license      AGPL License
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/2.1.4/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/464352/%E5%AD%97%E5%B9%95%E5%BA%93%20Zimuku%20%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/464352/%E5%AD%97%E5%B9%95%E5%BA%93%20Zimuku%20%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Function to recognize captcha
  async function recognizeCaptcha(imageDataUrl) {
    const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'eng', { tessedit_char_whitelist: '0123456789' });
    return text.replace(/\D/g, ''); // Remove non-digit characters
  }

  // Get captcha image element
  const captchaImage = document.querySelector('img.verifyimg[alt="verify_img"]');
  if (!captchaImage) {
    console.error('Captcha image not found');
    return;
  }

  // Get captcha input element
  const captchaInput = document.querySelector('input#intext[type="text"]');
  if (!captchaInput) {
    console.error('Captcha input not found');
    return;
  }

  // Get captcha submit button
  const captchaSubmit = document.querySelector('input[type="submit"][value="点击继续访问网站"]');
  if (!captchaSubmit) {
    console.error('Captcha submit button not found');
    return;
  }

  // Recognize captcha and fill input
  const captchaText = await recognizeCaptcha(captchaImage.src);
  captchaInput.value = captchaText;

  // Click submit button
  captchaSubmit.click();
})();