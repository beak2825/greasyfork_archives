// ==UserScript==
// @name         更好的蔡徐坤
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  把所有检测到的图片替换为蔡徐坤图片，并支持动态加载
// @author       BAIYU
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507399/%E6%9B%B4%E5%A5%BD%E7%9A%84%E8%94%A1%E5%BE%90%E5%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/507399/%E6%9B%B4%E5%A5%BD%E7%9A%84%E8%94%A1%E5%BE%90%E5%9D%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const caiXukunImages = [
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/920ac09b6e0ee714317940f0d38ca10f845f2b9aecd164d5b72d0e62f9009eac44411ed83f20ef14dae8895101511665?pictype=scale&from=30111&version=3.3.3.3&fname=Kk1.gif&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/2321bf24da1477d92fe882f8ffd178d9360df085215c9d26af90870620c9256f48f0e9844eb94a1d8dfcf92a217e000f?pictype=scale&from=30111&version=3.3.3.3&fname=Kk2.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/14c6728dcb28e48f90c5cf155ec0a5c5ee5f4b8de31e3d7fbbd82f99e36d3929964f759095cc9d3c0e97d215c5302403?pictype=scale&from=30111&version=3.3.3.3&fname=Kk.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/de92e1bf3e9ef045ce82b01e55d5e947361ea64920384604ef1f5bcf218ddf4a0da1e18018d3254e697544eb7f7e4c84?pictype=scale&from=30111&version=3.3.3.3&fname=7da427e5bcea4ef78693ff074f66b536.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/3f2376fe94d7c7be08ab4bfe665cfc395e542718d2f1367c733140352fa4a7c40c38691839499028447428de1fe49a3e?pictype=scale&from=30111&version=3.3.3.3&fname=6312f405a9564ec2a489afa5e17f58e1.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/d892beaf7963503cf4536d628c0177dec7e556c117ac1f1ce03ed1d2bf2cfa64dba644d6f31364df519c6696eb10364f?pictype=scale&from=30111&version=3.3.3.3&fname=05adbce69f7d46d7a8173077dcffc726.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/0545564d2b9f3da54d19dde2881d141e13ade89abb78b2b3758f8f1064e0761063679b9471fe90e866e9764f938f3998?pictype=scale&from=30111&version=3.3.3.3&fname=07c8c9d64e0b443794aebb602346064a.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/7f6e688875268e1a85c374da643d7a5507a08d34c8711747246715d848b14c77d34206204d0a3a0df0552e0e8a6afe2b?pictype=scale&from=30111&version=3.3.3.3&fname=%E8%94%A1%E5%BE%90%E5%9D%A4%20049_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/632caf6e39a0ea93dcb38b65157fa6c0e4f796c7c131a3e814e44dfa9049b95780b522fd0a2efcb00ed9815e3002f667?pictype=scale&from=30111&version=3.3.3.3&fname=3dbbb92a20584fcaa72edd95688004f1.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/5854df9ea1a8015fd35867e5c26efa07fd2836ff9b508adb62b809dae538f4f461c930008f6a039160019bfad0aff560?pictype=scale&from=30111&version=3.3.3.3&fname=116f09d1c77f46f5a9c407958e2ed868.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/0fc851de92f7b1e538f55f87a52f2ea4d1be1fbab77539c4c7ab3083e31f9a6c1996082a834b87acc2cab3c1e819332d?pictype=scale&from=30111&version=3.3.3.3&fname=%E8%94%A1%E5%BE%90%E5%9D%A4%E6%9E%95%E5%B7%BE%E5%8C%85%E5%B0%8F%E9%BB%84%E9%B8%A1%E5%A4%B4%E8%A1%A8%E6%83%85%E5%8C%85%20%E8%A1%A8%E6%83%85%E5%8C%85%20%E8%81%8A%E5%A4%A9%20%E5%9B%BE%E7%89%87%20%E6%90%9E%E7%AC%91%20%E6%95%B4%E8%9B%8A%20_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/841acb041aa5bdd800d9f894af922be773812db4f4c7257887da1eb0c35f95513b45ca129f4bff67c13346c91a77fb8a?pictype=scale&from=30111&version=3.3.3.3&fname=b21aa48d5afb4181a5e338c3f13816d0.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/9500e553fd7bc8f8ef0b65be7a10abb9f584440a7fdfc6e8cddf3a8070f91a54bbdaff081c15315897fba2ed9bd15409?pictype=scale&from=30111&version=3.3.3.3&fname=c688f6b99ca94778bd141d14e2752c95.jpg&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/6b27a7e8a8f3dfcfdc1295de8b3fd52877f072456b8fae38b403be2e9a8c9b82a4bbf899622495d99f4c9221d9ae4c86?pictype=scale&from=30111&version=3.3.3.3&fname=62b331055a524866ab6f455817c19292.png&size=320',
        'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/84ad19f529552160542d254b587fa49b85b01ccc08d134d71bc11b98216637081541eba46c13f4b74a0464b9e636b4a5?pictype=scale&from=30111&version=3.3.3.3&fname=bd19431fb70b4652a1d12aa1145b38b6.png&size=320'
    ];

    const enableLogging = true;

    function log(message) {
        if (enableLogging) {
            console.log(message);
        }
    }

    function replaceImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.replaced) {
                const randomImage = caiXukunImages[Math.floor(Math.random() * caiXukunImages.length)];
                img.src = randomImage;
                img.srcset = '';
                img.dataset.replaced = true;
                log(`图片替换为：${randomImage}`);
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            replaceImages();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // I初次更换
    replaceImages();

    window.addEventListener('resize', replaceImages);
})();
