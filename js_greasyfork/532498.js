// ==UserScript==
// @name 随机网页背景
// @namespace wwdboy
// @version 2.0
// @description 公开第一版。随机网页背景，自带图片适用于电脑，可自行添加或删减图片地址以适应自己需要，亦可用于手机支持脚本的浏览器，配合这个脚本体验更佳：https://update.greasyfork.org/scripts/532495/%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%B0%83%E8%8A%82%E5%99%A8.user.js。能力有限，不喜勿喷。
// @author wwdboy
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @include /^(?:.*)$/
// @downloadURL https://update.greasyfork.org/scripts/532498/%E9%9A%8F%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/532498/%E9%9A%8F%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

        const images = [
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/110408140091d1f52023dd68cb_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/1G113140647-1_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/20221029235938y5lxas_small_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/fanmv_2560_1440_juk382r5eck9chp_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/wihlsd3yxl4_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/1130833_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/1134222_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/202210292359480xvvlc_small_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/204332_158287_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/505464_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/_uploads_allimg_170327_95-1F32G43226_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/lg7ygkkryh49wtondyvsbyoo1680x1050_%E5%89%AF%E6%9C%AC.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/PC-PICTURES-SMALL/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250612151257_182_upscayl_4x_realesrgan-x4plus_%E5%89%AF%E6%9C%AC.jpg"
    ];

    const img = images[Math.floor(Math.random() * images.length)];

    GM_addStyle(`
        body::before {
            content: "";
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -100;
            background-image: url(${img});
            background-position: center;
            background-size: cover;
            background-attachment: fixed;
            background-repeat: no-repeat;
            opacity: 1;
        }
    `);
})();