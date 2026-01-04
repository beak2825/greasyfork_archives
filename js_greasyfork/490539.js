// ==UserScript==
// @name         复制客户收件信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://47.115.125.92:8087/main*
// @match        https://admin.smartrogi.com/main*
// @match        http://admin.smart777v.com/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=125.92
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490539/%E5%A4%8D%E5%88%B6%E5%AE%A2%E6%88%B7%E6%94%B6%E4%BB%B6%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490539/%E5%A4%8D%E5%88%B6%E5%AE%A2%E6%88%B7%E6%94%B6%E4%BB%B6%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        try {
            let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
            // 当检测到表格的ID是fromBody（即仓库管理）时，不执行脚本
            if (table.getAttribute("id") === 'fromBody') return;

            let r3c3 = table.children[2].children[2];
            if (r3c3.style.cursor !== 'pointer') {
                r3c3.style.cursor = "pointer";
                r3c3.setAttribute('onclick', "openModal('userInfoModal')")
                return r3c3.addEventListener('click', () => {
                    let result = getuserInfo()[0].join('\t');
                    copyText(result).then(
                        // 自宅信息的窗口动画时间是200毫秒，因此完成后的弹窗要随之延后201毫秒
                        () => setTimeout(
                            () => alert(`已复制 ${getuserInfo()[1]}住所信息

电话：${getuserInfo()[0][0].match(/\d/g).join('')}
名字：${getuserInfo()[0][2]}
邮编：${getuserInfo()[0][1].match(/\d/g).join('')}
地址：${getuserInfo()[0][4]}`)
                            , 201)
                    );
                })
            }
        }
        catch {
        }
    }, 1000)
    // Your code here...
})();

function getuserInfo() {
    let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
    let orderNo = table.children[2].children[1].textContent;
    let userInfoModal = document.querySelector("iframe").contentWindow.document.querySelector("#userInfoModal");
    let clientPhone = `="${userInfoModal.querySelector('input[name="clientPhone"]').getAttribute('value')}"`;
    let clientName = userInfoModal.querySelector('input[name="clientName"]').getAttribute('value');
    let clientZipCode = `="${userInfoModal.querySelector('input[name="clientZipCode"]').getAttribute('value')}"`;
    let clientAddress = userInfoModal.querySelector('textarea[name="clientAddress"]').textContent;
    return [[clientPhone, clientZipCode, clientName, '', clientAddress], orderNo];
}
async function copyText(text = '') {
    try {
        try {
            await navigator.clipboard.writeText(text);
            return await Promise.resolve();
        } catch (err) {
            // console.error('复制失败：', err);
            return await Promise.reject(err);
        }
    } catch (e) {
        // console.log('navigator.clipboard', e)
        let input = document.createElement('input')
        input.style.position = 'fixed'
        input.style.top = '-10000px'
        input.style.zIndex = '-999'
        document.body.appendChild(input)
        console.log('input', input)
        input.value = text
        input.focus()
        input.select()
        try {
            let result = document.execCommand('copy')
            document.body.removeChild(input)
            if (!result || result === 'unsuccessful') {
                return Promise.reject('复制失败')
            } else {
                return Promise.resolve()
            }
        } catch (e) {
            document.body.removeChild(input)
            return Promise.reject(
                '当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作'
            )
        }
    }
}
