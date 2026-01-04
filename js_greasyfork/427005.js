// ==UserScript==
// @name         我爱二维码
// @namespace    gqqnbig.me
// @version      0.1
// @description  把页面链接变成二维码，方便微信扫码
// @author       gqqnbig
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require     https://cdn.jsdelivr.net/npm/easyqrcodejs@4.3.5/dist/easy.qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/427005/%E6%88%91%E7%88%B1%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/427005/%E6%88%91%E7%88%B1%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createQR(elements, index) {
        let element=elements[index];
        let link=element.href;
        if(link.startsWith('http')===false)
            return;

        let options= { text: link };
        let height=element.offsetHeight;
        let qrSize;
        if(height<=20)
            qrSize=25;
        else if(height<=40)
            qrSize=64;
        else
        {
            qrSize=128;
            options['logo']='https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon32_wx_logo.png';
        }
        options['height']=qrSize;
        options['width']=qrSize;
        new QRCode(element, options);
        let canvas=element.querySelector('canvas');
        if(canvas.offsetHeight>0)
            element.attributes.removeNamedItem('href');
        else
            //Failed to generate QR code.
            canvas.remove();

        index++;
        if(index<elements.length)
            setTimeout(createQR, 1, elements, index);

    }

    let anchors=document.querySelectorAll("a[href]");


    if(anchors.length>0)
        createQR(anchors, 0);

})();