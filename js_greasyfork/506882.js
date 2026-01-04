// ==UserScript==
// @name         玉豆分享自动解析
// @namespace    https://github.com/AWangDog/yudou_decode/
// @license      GPLv3
// @version      1.0
// @description  暴力破解玉豆分享密码
// @author       AWang_Dog
// @match        https://www.yudou66.com/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yudou66.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506882/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/506882/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
var canDeCrypt = 0;
(async function() {
    'use strict';
    const totalNumbers = 9999;
    const parts = 9;
    const numbersPerPart = Math.ceil(totalNumbers / parts);

    let promises = [];
    for (let i = 0; i < parts; i++) {
        let start = i * numbersPerPart;
        let end = Math.min(start + numbersPerPart - 1, totalNumbers);
        promises.push(processBatch(start, end));
    }

    let results = await Promise.all(promises);
    for (let result of results) {
        if (result !== null) {
            console.log('找到结果:', result);
            return;
        }
    }
    console.log('未找到结果');
})();
function multiDecrypt_(pwd) {
    encryption.forEach( (item, i) => {
        try {
            canDeCrypt = Decrypt_(item, pwd)
        } catch (e) {
            if (canDeCrypt == 0) {
                canDeCrypt = 0
            }
        }
    }
                      )
    if (canDeCrypt == 0) {
        console.log("密碼錯誤")
        return 0
    } else {
        //ok
        document.getElementById("result").innerHTML = canDeCrypt;
        return 1
    }
}
function Decrypt_(item, pwd) {
    return decodeURIComponent(CryptoJS.AES.decrypt(item, pwd).toString(CryptoJS.enc.Utf8))
}
function processBatch(start, end) {
    return new Promise((resolve, reject) => {
        for (let i = start; i <= end; i++) {
            let formattedNumber = i.toString().padStart(4, '0');
            var back = multiDecrypt_(formattedNumber);
            if (back == 1) {
                resolve(i);
                return;
            }
        }
        resolve(null);
    });
}
