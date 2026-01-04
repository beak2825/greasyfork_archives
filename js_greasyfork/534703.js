// ==UserScript==
// @name         SM_BSL_FINAL
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Finalized script with gender override, UID logic, image uploads, name control, and seamless automation — by BRUTAL RAVNYX
// @author       BRUTAL RAVNYX
// @match        https://sma.sefapps.in/Citizen/Citizen/ScanQRCode
// @match        https://sma.sefapps.in/Citizen/Citizen/Add?UID=*
// @match        https://sma.sefapps.in/Citizen/Citizen?UID=*
// @match        https://sma.sefapps.in/Citizen/Citizen/Dashboard
// @match        https://sma.sefapps.in/*
// @grant        none
// @icon         https://i.postimg.cc/vH03MKxm/RAVNYX-1024-X1024-removebg-preview-1.png
// @downloadURL https://update.greasyfork.org/scripts/534703/SM_BSL_FINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/534703/SM_BSL_FINAL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const nameSourceURL = "https://baseline-names.glitch.me/MURGUD/names.txt";
    const imageLinks = [
    "https://i.postimg.cc/HLkjNvWL/IMG-20250428-WA0006.jpg",
    "https://i.postimg.cc/MG3XJ0Xm/IMG-20250428-WA0007.jpg",
    "https://i.postimg.cc/gj80hfsg/IMG-20250428-WA0008.jpg",
    "https://i.postimg.cc/85FcpF6Q/IMG-20250428-WA0009.jpg",
    "https://i.postimg.cc/k4k4BnQV/IMG-20250428-WA0010.jpg",
    "https://i.postimg.cc/1RqXbqSD/IMG-20250428-WA0011.jpg",
    "https://i.postimg.cc/ZKznm5Y2/IMG-20250428-WA0012.jpg",
    "https://i.postimg.cc/sgV2BHhJ/IMG-20250428-WA0013.jpg",
    "https://i.postimg.cc/nh0hqKKf/IMG-20250428-WA0014.jpg",
    "https://i.postimg.cc/Hs0xk1Vx/IMG-20250428-WA0015.jpg",
    "https://i.postimg.cc/mrnZ5b6d/IMG-20250428-WA0016.jpg",
    "https://i.postimg.cc/xCbjrWw9/IMG-20250428-WA0017.jpg",
    "https://i.postimg.cc/0Nj2n6ZM/IMG-20250428-WA0018.jpg",
    "https://i.postimg.cc/ZntbJwmp/IMG-20250428-WA0019.jpg",
    "https://i.postimg.cc/PJWtJ1fc/IMG-20250428-WA0020.jpg",
    "https://i.postimg.cc/G3G3XnPQ/IMG-20250428-WA0021.jpg",
    "https://i.postimg.cc/zGXJDLst/IMG-20250428-WA0022.jpg",
    "https://i.postimg.cc/Qxq8rgyK/IMG-20250428-WA0023.jpg",
    "https://i.postimg.cc/pdmR8wXK/IMG-20250428-WA0024.jpg",
    "https://i.postimg.cc/2ScC1kmz/IMG-20250428-WA0025.jpg",
    "https://i.postimg.cc/8CxDbZj9/IMG-20250428-WA0026.jpg",
    "https://i.postimg.cc/xCHQpLmC/IMG-20250428-WA0027.jpg",
    "https://i.postimg.cc/wMppC35k/IMG-20250428-WA0028.jpg",
    "https://i.postimg.cc/tJNjpy2G/IMG-20250428-WA0029.jpg",
    "https://i.postimg.cc/Yq8HPrv1/IMG-20250428-WA0030.jpg",
    "https://i.postimg.cc/CMGYjHYr/IMG-20250428-WA0031.jpg",
    "https://i.postimg.cc/3J3h94x8/IMG-20250428-WA0032.jpg",
    "https://i.postimg.cc/13tQhkFb/IMG-20250428-WA0033.jpg",
    "https://i.postimg.cc/0QgRSr4q/IMG-20250428-WA0034.jpg",
    "https://i.postimg.cc/RZDzMgQh/IMG-20250428-WA0035.jpg",
    "https://i.postimg.cc/9fwHzyJp/IMG-20250428-WA0036.jpg",
    "https://i.postimg.cc/nzv8Gp89/IMG-20250428-WA0037.jpg",
    "https://i.postimg.cc/bY9cGyHK/IMG-20250428-WA0038.jpg",
    "https://i.postimg.cc/hvrHNstS/IMG-20250428-WA0039.jpg",
    "https://i.postimg.cc/hvgkC6gy/IMG-20250428-WA0040.jpg",
    "https://i.postimg.cc/BQZWHrmt/IMG-20250428-WA0041.jpg",
    "https://i.postimg.cc/dt5bB5f6/IMG-20250428-WA0042.jpg",
    "https://i.postimg.cc/pL7gNpRn/IMG-20250428-WA0043.jpg",
    "https://i.postimg.cc/FKLwhNHC/IMG-20250428-WA0044.jpg",
    "https://i.postimg.cc/fRk6gxnN/IMG-20250428-WA0045.jpg",
    "https://i.postimg.cc/V69TbgMj/IMG-20250428-WA0046.jpg",
    "https://i.postimg.cc/8c1YdvBx/IMG-20250428-WA0047.jpg",
    "https://i.postimg.cc/mDWJDJcL/IMG-20250428-WA0048.jpg",
    "https://i.postimg.cc/NFpzd0dF/IMG-20250428-WA0049.jpg",
    "https://i.postimg.cc/RCRySPvm/IMG-20250428-WA0050.jpg",
    "https://i.postimg.cc/5NKrv6Hk/IMG-20250428-WA0051.jpg",
    "https://i.postimg.cc/6p7mhtn6/IMG-20250428-WA0052.jpg",
    "https://i.postimg.cc/BQnyXxvK/IMG-20250428-WA0053.jpg",
    "https://i.postimg.cc/mg06XJyY/IMG-20250428-WA0054.jpg",
    "https://i.postimg.cc/DzLpt6xt/IMG-20250428-WA0055.jpg",
    "https://i.postimg.cc/V6wZ1tT5/IMG-20250428-WA0056.jpg",
    "https://i.postimg.cc/Kz5qYzSf/IMG-20250428-WA0057.jpg",
    "https://i.postimg.cc/QCx6K3j3/IMG-20250428-WA0058.jpg",
    "https://i.postimg.cc/qBjDVzGM/IMG-20250428-WA0059.jpg",
    "https://i.postimg.cc/gjSgvT06/IMG-20250428-WA0060.jpg",
    "https://i.postimg.cc/xT8x0nsG/IMG-20250428-WA0061.jpg",
    "https://i.postimg.cc/vHKPTkjJ/IMG-20250428-WA0062.jpg",
    "https://i.postimg.cc/ht72dMRf/IMG-20250428-WA0063.jpg",
    "https://i.postimg.cc/q7VjXnpQ/IMG-20250428-WA0064.jpg",
    "https://i.postimg.cc/BvTNh663/IMG-20250428-WA0065.jpg",
    "https://i.postimg.cc/85T4xSJ6/IMG-20250428-WA0066.jpg",
    "https://i.postimg.cc/G2zKC5GS/IMG-20250428-WA0067.jpg",
    "https://i.postimg.cc/Y0sx4LX6/IMG-20250428-WA0068.jpg",
    "https://i.postimg.cc/nrzkcG1V/IMG-20250428-WA0069.jpg",
    "https://i.postimg.cc/bNZT7LJ3/IMG-20250428-WA0070.jpg",
    "https://i.postimg.cc/T270NBRK/IMG-20250428-WA0071.jpg",
    "https://i.postimg.cc/W1r7330Z/IMG-20250428-WA0072.jpg",
    "https://i.postimg.cc/9FspCTwV/IMG-20250428-WA0073.jpg",
    "https://i.postimg.cc/cJSB8Scb/IMG-20250428-WA0074.jpg",
    "https://i.postimg.cc/43Qb6SLN/IMG-20250428-WA0075.jpg",
    "https://i.postimg.cc/qRBcjxSc/IMG-20250428-WA0076.jpg",
    "https://i.postimg.cc/DZCrDb39/IMG-20250428-WA0077.jpg",
    "https://i.postimg.cc/yxkmzYVk/IMG-20250428-WA0078.jpg",
    "https://i.postimg.cc/VvpjsQ64/IMG-20250428-WA0079.jpg",
    "https://i.postimg.cc/gkLVSJS7/IMG-20250428-WA0080.jpg",
    "https://i.postimg.cc/CMQCsDND/IMG-20250428-WA0081.jpg",
    "https://i.postimg.cc/jSVzGbBS/IMG-20250428-WA0082.jpg",
    "https://i.postimg.cc/W4T017NR/IMG-20250428-WA0083.jpg",
    "https://i.postimg.cc/fbCmt0yV/IMG-20250428-WA0084.jpg",
    "https://i.postimg.cc/ht99nYqb/IMG-20250428-WA0085.jpg",
    "https://i.postimg.cc/QtM5pxK0/IMG-20250428-WA0086.jpg",
    "https://i.postimg.cc/Gt8y57QD/IMG-20250428-WA0087.jpg",
    "https://i.postimg.cc/MTrBt2yx/IMG-20250428-WA0088.jpg",
    "https://i.postimg.cc/cCpnyR9b/IMG-20250428-WA0089.jpg",
    "https://i.postimg.cc/jqmN7Tx4/IMG-20250428-WA0090.jpg",
    "https://i.postimg.cc/vHnn7KDF/IMG-20250428-WA0091.jpg",
    "https://i.postimg.cc/9Qj7LBq4/IMG-20250428-WA0092.jpg",
    "https://i.postimg.cc/zGSR6Rnx/IMG-20250428-WA0093.jpg",
    "https://i.postimg.cc/N0srcfDB/IMG-20250428-WA0094.jpg",
    "https://i.postimg.cc/PxNpC307/IMG-20250428-WA0095.jpg",
    "https://i.postimg.cc/0Q36DGsy/IMG-20250428-WA0096.jpg",
    "https://i.postimg.cc/MG9fK23R/IMG-20250428-WA0097.jpg",
    "https://i.postimg.cc/141fY94x/IMG-20250428-WA0098.jpg",
    "https://i.postimg.cc/c1r5QfYy/IMG-20250428-WA0099.jpg",
    "https://i.postimg.cc/NFHK4ys7/IMG-20250428-WA0100.jpg",
    "https://i.postimg.cc/VspZ45BS/IMG-20250428-WA0101.jpg",
    "https://i.postimg.cc/8PvKYDtZ/IMG-20250428-WA0102.jpg",
    "https://i.postimg.cc/BnGY9yz4/IMG-20250428-WA0103.jpg",
    "https://i.postimg.cc/YCfXpRcg/IMG-20250428-WA0104.jpg",
    "https://i.postimg.cc/QM8fV7sz/IMG-20250428-WA0105.jpg",
    "https://i.postimg.cc/SKgD9Kxx/IMG-20250428-WA0106.jpg",
    "https://i.postimg.cc/qRYwmZnf/IMG-20250428-WA0108.jpg",
    "https://i.postimg.cc/907psttD/IMG-20250428-WA0109.jpg",
    "https://i.postimg.cc/Df95LHnL/IMG-20250428-WA0110.jpg",
    "https://i.postimg.cc/jqwZWt0R/IMG-20250428-WA0111.jpg",
    "https://i.postimg.cc/RVwdRdZ8/IMG-20250428-WA0112.jpg",
    "https://i.postimg.cc/mgRw69cr/IMG-20250428-WA0113.jpg",
    "https://i.postimg.cc/DwggVzsP/IMG-20250428-WA0114.jpg",
    "https://i.postimg.cc/6QphBNfJ/IMG-20250428-WA0115.jpg",
    "https://i.postimg.cc/JhY5ndpy/IMG-20250428-WA0116.jpg",
    "https://i.postimg.cc/W3D6J6y5/IMG-20250428-WA0117.jpg",
    "https://i.postimg.cc/wvS55R8g/IMG-20250428-WA0118.jpg",
    "https://i.postimg.cc/yxcmL6s9/IMG-20250428-WA0119.jpg",
    "https://i.postimg.cc/XNCkjLdJ/IMG-20250428-WA0120.jpg",
    "https://i.postimg.cc/65xLyZfh/IMG-20250428-WA0121.jpg",
    "https://i.postimg.cc/ncKK7Ldf/IMG-20250428-WA0122.jpg",
    "https://i.postimg.cc/cLsRcNjg/IMG-20250428-WA0123.jpg",
    "https://i.postimg.cc/HLnbf9TT/IMG-20250428-WA0124.jpg",
    "https://i.postimg.cc/K8JnqHS9/IMG-20250428-WA0125.jpg",
    "https://i.postimg.cc/MTjVGZc4/IMG-20250428-WA0126.jpg",
    "https://i.postimg.cc/LsWjRgsL/IMG-20250428-WA0127.jpg",
    "https://i.postimg.cc/HnD58GXL/IMG-20250428-WA0128.jpg",
    "https://i.postimg.cc/FzySjPVV/IMG-20250428-WA0129.jpg",
    "https://i.postimg.cc/xjMLDCVN/IMG-20250428-WA0130.jpg",
    "https://i.postimg.cc/9F2ZWhc8/IMG-20250428-WA0131.jpg",
    "https://i.postimg.cc/sDJSxNXV/IMG-20250428-WA0132.jpg",
    "https://i.postimg.cc/FHsSLVd0/IMG-20250428-WA0133.jpg",
    "https://i.postimg.cc/Bvj1hZC6/IMG-20250428-WA0134.jpg",
    "https://i.postimg.cc/Qd4TkK1w/IMG-20250428-WA0135.jpg",
    "https://i.postimg.cc/8Cxfx8yb/IMG-20250428-WA0136.jpg",
    "https://i.postimg.cc/bJbSh6Wf/IMG-20250428-WA0137.jpg",
    "https://i.postimg.cc/4yQKKYX8/IMG-20250428-WA0138.jpg",
    "https://i.postimg.cc/Y26LDsQ1/IMG-20250428-WA0139.jpg",
    "https://i.postimg.cc/NfQ93kxZ/IMG-20250428-WA0140.jpg",
    "https://i.postimg.cc/65z2t4jq/IMG-20250428-WA0141.jpg",
    "https://i.postimg.cc/SxsXsQ3r/IMG-20250428-WA0142.jpg",
    "https://i.postimg.cc/g2Tx6FPP/IMG-20250428-WA0143.jpg",
    "https://i.postimg.cc/fbSJc2wS/IMG-20250428-WA0144.jpg",
    "https://i.postimg.cc/76ghc5Jx/IMG-20250428-WA0145.jpg",
    "https://i.postimg.cc/zBm30CBt/IMG-20250428-WA0146.jpg",
    "https://i.postimg.cc/tJpJH9FF/IMG-20250428-WA0147.jpg",
    "https://i.postimg.cc/7YPhsYHk/IMG-20250428-WA0148.jpg",
    "https://i.postimg.cc/8kmsmrV4/IMG-20250428-WA0149.jpg",
    "https://i.postimg.cc/MH5T6gYN/IMG-20250428-WA0150.jpg",
    "https://i.postimg.cc/rFhmvXst/IMG-20250428-WA0151.jpg",
    "https://i.postimg.cc/MpNGp7y6/IMG-20250428-WA0152.jpg",
    "https://i.postimg.cc/rwKmTnRZ/IMG-20250428-WA0153.jpg",
    "https://i.postimg.cc/ydzYF7Q2/IMG-20250428-WA0154.jpg",
    "https://i.postimg.cc/3wGx4kBg/IMG-20250428-WA0155.jpg",
    "https://i.postimg.cc/sX9fmbbx/IMG-20250428-WA0156.jpg",
    "https://i.postimg.cc/j2xxFZrX/IMG-20250428-WA0157.jpg",
    "https://i.postimg.cc/ryjFrXSY/IMG-20250428-WA0158.jpg",
    "https://i.postimg.cc/x86fDMfS/IMG-20250428-WA0159.jpg",
    "https://i.postimg.cc/tCgRdSkR/IMG-20250428-WA0160.jpg",
    "https://i.postimg.cc/RVbSg7p7/IMG-20250428-WA0161.jpg",
    "https://i.postimg.cc/zGbJ6y49/IMG-20250428-WA0162.jpg",
    "https://i.postimg.cc/Dw92T2Tm/IMG-20250428-WA0163.jpg",
    "https://i.postimg.cc/N0RQGWsD/IMG-20250428-WA0164.jpg",
    "https://i.postimg.cc/wvHg103p/IMG-20250428-WA0165.jpg",
    "https://i.postimg.cc/4yxG5yz2/IMG-20250428-WA0166.jpg",
    "https://i.postimg.cc/vBzMff66/IMG-20250428-WA0167.jpg",
    "https://i.postimg.cc/FFTNKb4M/IMG-20250428-WA0168.jpg",
    "https://i.postimg.cc/x8p2FQ5f/IMG-20250428-WA0169.jpg",
    "https://i.postimg.cc/J4tmHy7G/IMG-20250428-WA0170.jpg",
    "https://i.postimg.cc/g0bP7NVZ/IMG-20250428-WA0171.jpg",
    "https://i.postimg.cc/y8ZHnwZK/IMG-20250428-WA0172.jpg",
    "https://i.postimg.cc/NfVt6gLb/IMG-20250428-WA0173.jpg",
    "https://i.postimg.cc/pdQtMzC1/IMG-20250428-WA0174.jpg",
    "https://i.postimg.cc/W32cNzfp/IMG-20250428-WA0175.jpg",
    "https://i.postimg.cc/j5Z0LTGH/IMG-20250428-WA0176.jpg",
    "https://i.postimg.cc/T118bS6Z/IMG-20250428-WA0177.jpg",
    "https://i.postimg.cc/QCy2JbNV/IMG-20250428-WA0178.jpg",
    "https://i.postimg.cc/28Ppq2XK/IMG-20250428-WA0179.jpg",
    "https://i.postimg.cc/nVSfxHKZ/IMG-20250428-WA0180.jpg",
    "https://i.postimg.cc/HsJDsf3M/IMG-20250428-WA0181.jpg",
    "https://i.postimg.cc/GmYWvGWh/IMG-20250428-WA0182.jpg",
    "https://i.postimg.cc/q7T9wgrc/IMG-20250428-WA0183.jpg",
    "https://i.postimg.cc/PqQ0Rhfg/IMG-20250428-WA0184.jpg",
    "https://i.postimg.cc/nzVN85CC/IMG-20250428-WA0185.jpg",
    "https://i.postimg.cc/4d8qX59w/IMG-20250428-WA0186.jpg",
    "https://i.postimg.cc/mktqkH34/IMG-20250428-WA0187.jpg",
    "https://i.postimg.cc/d3pfyVny/IMG-20250428-WA0188.jpg",
    "https://i.postimg.cc/44SqMWZx/IMG-20250428-WA0189.jpg",
    "https://i.postimg.cc/fR4FWkV4/IMG-20250428-WA0190.jpg",
    "https://i.postimg.cc/fTSphYTj/IMG-20250428-WA0191.jpg",
    "https://i.postimg.cc/mgQnPR9P/IMG-20250428-WA0192.jpg",
    "https://i.postimg.cc/VNmVMT9D/IMG-20250428-WA0193.jpg",
    "https://i.postimg.cc/0QNXXwBS/IMG-20250428-WA0194.jpg",
    "https://i.postimg.cc/wB2bkV0H/IMG-20250428-WA0195.jpg",
    "https://i.postimg.cc/sX06kgkN/IMG-20250428-WA0196.jpg",
    "https://i.postimg.cc/WzFWTPjb/IMG-20250428-WA0197.jpg",
    "https://i.postimg.cc/FFYN7dH1/IMG-20250428-WA0198.jpg",
    "https://i.postimg.cc/gjCM0Bky/IMG-20250428-WA0199.jpg",
    "https://i.postimg.cc/rFWTNBWk/IMG-20250428-WA0200.jpg",
    "https://i.postimg.cc/Pf0hZXCy/IMG-20250428-WA0201.jpg",
    "https://i.postimg.cc/YCHHndfm/IMG-20250428-WA0202.jpg",
    "https://i.postimg.cc/YCzwJQbD/IMG-20250428-WA0203.jpg",
    "https://i.postimg.cc/hG4qghYD/IMG-20250428-WA0204.jpg",
    "https://i.postimg.cc/pd0MdRND/IMG-20250428-WA0205.jpg",
    "https://i.postimg.cc/hvdkMmXr/IMG-20250428-WA0206.jpg",
    "https://i.postimg.cc/RCJxvkgH/IMG-20250428-WA0207.jpg",
    "https://i.postimg.cc/Y9Zc1RC0/IMG-20250428-WA0208.jpg",
    "https://i.postimg.cc/QtHG9wsv/IMG-20250428-WA0209.jpg",
    "https://i.postimg.cc/Gh0wtXfS/IMG-20250428-WA0210.jpg",
    "https://i.postimg.cc/tCh0xhQR/IMG-20250428-WA0211.jpg",
    "https://i.postimg.cc/XY3Rcp4f/IMG-20250428-WA0212.jpg",
    "https://i.postimg.cc/T39Zkf3Z/IMG-20250428-WA0213.jpg",
    "https://i.postimg.cc/Ls8Gwwqh/IMG-20250428-WA0214.jpg",
    "https://i.postimg.cc/gJf5w0g6/IMG-20250428-WA0215.jpg",
    "https://i.postimg.cc/7Ltjk979/IMG-20250428-WA0216.jpg",
    "https://i.postimg.cc/3RyVJGFT/IMG-20250428-WA0217.jpg",
    "https://i.postimg.cc/rsxH5LHZ/IMG-20250428-WA0218.jpg",
    "https://i.postimg.cc/150Ttswf/IMG-20250428-WA0219.jpg",
    "https://i.postimg.cc/05wFTpNG/IMG-20250428-WA0220.jpg",
    "https://i.postimg.cc/ncfgpCsy/IMG-20250428-WA0221.jpg"
];

    const setCookie = (name, value, days = 30) => {
        const d = new Date();
        d.setTime(d.getTime() + days * 86400000);
        document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
    };

    const getCookie = name => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    };

    let genderOverride = getCookie("genderOverride") || null;
    let localityOverride = getCookie("locality") || "404";
    let currentNames = [];

    const getGender = name => {
        if (genderOverride) return genderOverride;
        const male = ["राजू", "देवराव", "संदीप", "दत्ता", "सागर", "पांडुरंग", "सोमनाथ", "प्रभाकर", "रामचंद्र", "रमेश", "सुभाष", "दत्तात्रय", "राहुल", "विजय"];
        const female = ["सोनाली", "शिल्पा", "वैशाली", "सावित्री", "लता", "सरिता", "राजश्री", "सुनिता", "मंजुषा", "गायत्री", "अनिता", "शुभांगी", "कविता"];
        for (const f of female) if (name.includes(f)) return "Female";
        for (const m of male) if (name.includes(m)) return "Male";
        return "Female";
    };

    const getNextName = () => {
        const index = parseInt(localStorage.getItem("nameIndex") || 0);
        if (index >= currentNames.length) {
            alert("🚫 All names used. Please update your list.");
            return " ";
        }
        const name = currentNames[index];
        localStorage.setItem("nameIndex", index + 1);
        return name;
    };

    const setNextImage = selector => {
        return new Promise(resolve => {
            const input = document.querySelector(selector);
            if (!input) return resolve();
            let index = parseInt(localStorage.getItem("imgIndex") || 0);
            if (index >= imageLinks.length) index = 0;
            const url = imageLinks[index];
            localStorage.setItem("imgIndex", index + 1);
            fetch(url).then(r => r.blob()).then(blob => {
                const file = new File([blob], `img_${Date.now()}.jpg`, { type: "image/jpeg" });
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                input.dispatchEvent(new Event("change"));
                resolve();
            });
        });
    };

    const fillForm = async () => {
        const name = getNextName();
        document.querySelector('option[value="Independent_House_Bungalow"]').selected = true;
        document.getElementById('ddlname').value = name;
        document.getElementById('txtMobile').value = 9e8 + Math.floor(Math.random() * 1e8);
        document.getElementById(getGender(name))?.click();
        document.getElementById('BuildingName_SocietyName_ChawalName').value = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('Locality').value = localityOverride;
        document.getElementById('Adults').value = 1 + Math.floor(Math.random() * 5);
        document.getElementById('Childs').value = Math.floor(Math.random() * 4);

        // Handle Segregation Dropdown (ddlIsSeggregation)
        const segregationDropdown = document.getElementById('ddlIsSeggregation');
        if (segregationDropdown) {
            const regularlySegregateOption = Array.from(segregationDropdown.options).find(option => option.value === "Regularly Segregate");
            if (regularlySegregateOption) {
                regularlySegregateOption.selected = true; // Select "Regularly Segregate"

                // Handle Disposal Dropdown (ddlDiv)
                const disposalDropdown = document.getElementById('ddlDiv');
                if (disposalDropdown) {
                    const handoverOption = Array.from(disposalDropdown.options).find(option => option.value === "Handover to Municipal Corporation");
                    if (handoverOption) {
                        handoverOption.selected = true; // Select "Handover to Municipal Corporation"
                    } else {
                        console.warn("❌ 'Handover to Municipal Corporation' option not found in Disposal dropdown.");
                    }
                } else {
                    console.warn("❌ Disposal dropdown (ddlDiv) not found.");
                }
            } else {
                console.warn("❌ 'Regularly Segregate' option not found in Segregation dropdown.");
            }
        } else {
            console.warn("❌ Segregation dropdown (ddlIsSeggregation) not found.");
        }

        // Handle Route Selection (ddlPoint)
        const routeDropdown = document.getElementById('ddlPoint');
        if (routeDropdown) {
            const noneOption = Array.from(routeDropdown.options).filter(option => option.text === "None")[1]; // Select the second "None" option
            if (noneOption) {
                noneOption.selected = true; // Select the second "None" option
            } else {
                console.warn("❌ Second 'None' option not found in Route dropdown.");
            }
        } else {
            console.warn("❌ Route dropdown (ddlPoint) not found.");
        }

        await setNextImage('input[type="file"]');

        const allFieldsValid = [
            'ddlname', 'txtMobile', 'BuildingName_SocietyName_ChawalName', 'Locality', 'Adults', 'Childs', 'Pincode', 'ddlPoint', 'ddlIsSeggregation'
        ].every(id => document.getElementById(id) && document.getElementById(id).value);

        if (allFieldsValid) {
            const saveBtn = document.getElementById('submitButton');
            if (saveBtn) setTimeout(() => saveBtn.click(), 1000);
        } else {
            console.warn("❌ Some fields are missing or not filled properly.");
        }
    };

    const handleMainPage = () => {
        let uid = parseInt(getCookie("lastUID") || localStorage.getItem("uid") || 6528781);
        uid++;
        localStorage.setItem("uid", uid);
        setCookie("lastUID", uid);
        document.getElementById("btnManually").click();
        setTimeout(() => {
            document.getElementById("txtUID").value = uid;
            document.getElementById("btnGotoUID").click();
            setTimeout(() => location.href = `https://sma.sefapps.in/Citizen/Citizen/Add?UID=${uid}`, 500);
        }, 500);
    };

    const handlePostSubmitPage = () => {
        if (/Citizen\/Citizen\?UID=\d+$/.test(location.href)) {
            const btn = document.querySelector('a[href="/Citizen/Citizen/ScanQRCode"]');
            if (btn) setTimeout(() => btn.click(), 1000);
        }
    };

    const handleNewEntryPage = () => {
        const newEntryButton = document.querySelector('a[href="/Citizen/Citizen/ScanQRCode"]');
        if (newEntryButton) {
            console.log("ℹ️ New Entry button found. Clicking it...");
            setTimeout(() => newEntryButton.click(), 1000); // Click the button after 1 second
        } else {
            console.warn("❌ New Entry button not found on the page.");
        }
    };

    const showGenderOverlay = () => {
        const overlay = document.createElement("div");
        overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000c;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;";
        overlay.innerHTML = `
            <div style="position:absolute;top:10px;right:20px;cursor:pointer;font-size:18px;" id="closeOverlay">✖</div>
            <h2 style="margin-bottom:20px;">Select Gender</h2>
            <div>
                <button id="selectMale" style="padding:10px 20px;margin-right:15px;">Male</button>
                <button id="selectFemale" style="padding:10px 20px;">Female</button>
            </div>
            <button id="saveGender" style="margin-top:20px;padding:10px 25px;">Save</button>
        `;
        document.body.appendChild(overlay);
        document.getElementById("closeOverlay").onclick = () => overlay.remove();
        document.getElementById("selectMale").onclick = () => genderOverride = "Male";
        document.getElementById("selectFemale").onclick = () => genderOverride = "Female";
        document.getElementById("saveGender").onclick = () => {
            setCookie("genderOverride", genderOverride);
            alert("✅ Gender override saved: " + genderOverride);
            overlay.remove();
        };
    };

    const changePincode = () => {
        const currentPincode = getCookie("pincode") || "404404"; // Default pincode
        const newPincode = prompt("Enter new pincode:", currentPincode);

        if (newPincode && /^[0-9]{6}$/.test(newPincode)) {
            setCookie("pincode", newPincode); // Save to cookie
            alert("✅ Pincode saved successfully: " + newPincode);
        } else {
            alert("❌ Invalid pincode. Please enter a 6-digit number.");
        }
    };

    const addSidebarButtons = () => {
        const interval = setInterval(() => {
            const nav = document.querySelector("#sidebar nav .nav");
            if (nav) {
                clearInterval(interval);
                nav.insertAdjacentHTML("beforeend", `
                    <li class="nav-item mt-2">
                        <a href="javascript:void(0);" id="resetNameIndexBtn" class="nav-link">
                            <i class="mdi mdi-refresh menu-icon"></i>
                            <span class="menu-title">Reset Name Index</span>
                        </a>
                    </li>
                    <li class="nav-item mt-2">
                        <a href="javascript:void(0);" id="selectGenderBtn" class="nav-link">
                            <i class="mdi mdi-gender-male-female menu-icon"></i>
                            <span class="menu-title">Select Gender</span>
                        </a>
                    </li>
                    <li class="nav-item mt-2">
                        <a href="javascript:void(0);" id="resetUIDBtn" class="nav-link">
                            <i class="mdi mdi-counter menu-icon"></i>
                            <span class="menu-title">Reset UID Number</span>
                        </a>
                    </li>
                    <li class="nav-item mt-2">
                        <a href="javascript:void(0);" id="changeLocalityBtn" class="nav-link">
                            <i class="mdi mdi-map-marker menu-icon"></i>
                            <span class="menu-title">Change Locality</span>
                        </a>
                    </li>
                    <li class="nav-item mt-2">
                        <a href="javascript:void(0);" id="changePincodeBtn" class="nav-link">
                            <i class="mdi mdi-numeric menu-icon"></i>
                            <span class="menu-title">Change Pincode</span>
                        </a>
                    </li>
                `);
                document.getElementById("resetNameIndexBtn").onclick = () => {
                    localStorage.setItem("nameIndex", 0);
                    alert("✅ Name index reset.");
                };
                document.getElementById("selectGenderBtn").onclick = showGenderOverlay;
                document.getElementById("changeLocalityBtn").onclick = () => {
                    const newLoc = prompt("Enter new locality name:", localityOverride);
                    if (newLoc) {
                        localityOverride = newLoc;
                        setCookie("locality", newLoc);
                        alert("✅ Locality changed to " + newLoc);
                    }
                };
                document.getElementById("resetUIDBtn").onclick = () => {
                    const input = prompt("Enter starting UID number:", "6528000");
                    if (input) {
                        setCookie("lastUID", input);
                        localStorage.setItem("uid", input);
                        alert("✅ UID reset to " + input);
                    }
                };
                document.getElementById("changePincodeBtn").onclick = changePincode;
            }
        }, 300);
    };

    // Pre-fill pincode on page load
    const prefillPincode = () => {
        const savedPincode = getCookie("pincode");
        const pincodeInput = document.getElementById("Pincode");
        if (savedPincode && pincodeInput) {
            pincodeInput.value = savedPincode; // Pre-fill the field with the saved pincode
            console.log("ℹ️ Pincode pre-filled: " + savedPincode);
        }
    };

    // Call prefillPincode and handleNewEntryPage on script initialization
    fetch(nameSourceURL, { cache: "no-store" })
        .then(res => res.text())
        .then(txt => {
            currentNames = txt.split("\n").map(n => n.trim()).filter(Boolean);
            addSidebarButtons();
            prefillPincode(); // Ensure pincode is pre-filled
            const url = location.href;
            if (url.includes("ScanQRCode")) handleMainPage();
            else if (url.includes("Add?UID=")) fillForm();
            else if (/Citizen\/Citizen\?UID=\d+$/.test(url)) handlePostSubmitPage();
            else if (url.includes("Citizen/Citizen/Index?UID=")) handleNewEntryPage(); // Handle New Entry page
        });
})();