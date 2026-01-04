// ==UserScript==
// @name         职培云——pc上传照片1
// @namespace    
// @version      0.1
// @description  配合  职培云刷课——pc上传照片2 一起使用
// @author       TBC
// @match        *://px.class.com.cn/study/myclass/*
// @match        *://px.class.com.cn/player/index/photo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426994/%E8%81%8C%E5%9F%B9%E4%BA%91%E2%80%94%E2%80%94pc%E4%B8%8A%E4%BC%A0%E7%85%A7%E7%89%871.user.js
// @updateURL https://update.greasyfork.org/scripts/426994/%E8%81%8C%E5%9F%B9%E4%BA%91%E2%80%94%E2%80%94pc%E4%B8%8A%E4%BC%A0%E7%85%A7%E7%89%871.meta.js
// ==/UserScript==

(function() {
    import('https://nimiq.github.io/qr-scanner/qr-scanner.min.js').then((module) => {
        const QrScanner = module.default;
        console.log(QrScanner)

        setTimeout(()=>{
            var c = document.createElement('canvas');
            var img = document.getElementById('signImg') || document.getElementById('qrCode');
            c.height = img.naturalHeight;
            c.width = img.naturalWidth;
            c.id= 'test'
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, c.width, c.height);
            document.body.append(c);

            //console.log(document.getElementById('qrCode'))
            QrScanner.scanImage(c)
                .then(result =>{
                window.open(result);
            } )
                .catch(error => console.log(error || 'No QR code found.'));

        },500)
    });

})();