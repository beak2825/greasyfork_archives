// ==UserScript==
// @name         英华学堂自动刷课
// @version      1.2
// @description  自动下一集，自动输入验证码，仅个人使用。
// @author       se
// @match        *://zxshixun*/user/node*
// @match        *://gyxy*/user/node*
// @match        *://mooc*/user/node*
// @match        *://*/user/node*
// @match        *://*/user/login*
// @grant        GM_xmlhttpRequest
// @license     MIT
// @namespace    ss
// @connect      10djlj3701922.vicp.fun
// @connect      10djlj3701922.vicp.fun:27036
// @downloadURL https://update.greasyfork.org/scripts/534268/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/534268/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==



let version = "专业版"
// 引入 tesseract.js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@2/dist/tesseract.min.js';
document.body.appendChild(script);

script.onload = async function () {
    console.log('Tesseract.js 加载完成');

    let isRecognizing = false;  // 防止重复启动识别

    async function recognizeCaptcha() {
        try {
            const img = document.querySelector('img[src*="captcha"], img[src*="verify"], img');
            if (!img) {
                console.error('未找到验证码图片');
                return;
            }

            // 创建canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 灰度处理 + 更严格二值化
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imgData.data.length; i += 4) {
                const r = imgData.data[i];
                const g = imgData.data[i + 1];
                const b = imgData.data[i + 2];
                const avg = (r + g + b) / 3;
                const threshold = 120;  // 调整阈值，可能需要尝试不同的值
                const value = avg > threshold ? 255 : 0;
                imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = value;
            }
            ctx.putImageData(imgData, 0, 0);
            // 可以增加去噪的图像处理，例如通过模糊化等技术
            // 例如对图像进行高斯模糊，减少噪点
            ctx.filter = 'blur(1px)';  // 使用简单的模糊效果，可以改为其他算法
            ctx.drawImage(img, 0, 0);



            // OCR识别
            const { data: { text } } = await Tesseract.recognize(
                canvas,
                'eng',
                { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' } // 只识别字母和数字
            );

            let code = text.replace(/[^a-zA-Z0-9]/g, '').trim();
            console.log('识别到验证码:', code);

            if (!code || code.length < 4) {
                console.warn('识别错误，刷新验证码重试...');
                refreshCaptcha();
                return;
            }

            // 填写验证码
            const input = document.querySelector('input[placeholder*="验证码"], input[type="text"]');
            if (input) {
                input.value = code;
            }

            // 点击播放按钮
            const btn = document.querySelector('button, input[type="button"], input[type="submit"]');
            if (btn) {
                btn.click();
            }

            console.log('验证码已填写并提交！');

        } catch (e) {
            console.error('识别过程中出错:', e);
        }
    }


    function refreshCaptcha() {
        const img = document.querySelector('img[src*="captcha"], img[src*="verify"], img');
        if (img) {
            img.click();  // 刷新验证码
            console.log('点击刷新验证码');
        }
        setTimeout(recognizeCaptcha, 1200);  // 刷新后等待再识别
    }

    function startAutoRecognizer() {
        console.log('等待验证码出现...');
        const checkExist = setInterval(() => {
            const img = document.querySelector('img[src*="captcha"], img[src*="verify"], img');
            const input = document.querySelector('input[placeholder*="验证码"], input[type="text"]');
            if (img && input) {
                clearInterval(checkExist);
                console.log('找到验证码，开始识别！');
                setTimeout(recognizeCaptcha, 1000);
            }
        }, 500);  // 每0.5秒检查一次
    }

    startAutoRecognizer();
};
