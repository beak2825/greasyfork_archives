// ==UserScript==
// @name         吾爱破解图片便捷上传
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  吾爱破解发帖图片便捷上传
// @author       badyun
// @match        *://www.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409927/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%9B%BE%E7%89%87%E4%BE%BF%E6%8D%B7%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/409927/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%9B%BE%E7%89%87%E4%BE%BF%E6%8D%B7%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let wuaiIsIn = false;
        function wuai_upload(e) {
            const formData = new FormData();
            formData.append('file', e);
            fetch('https://api.wx-app.vip/img/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .catch(error => {
                    console.log(error)
                    alert('上传失败，请检查网络环境')
                })
                .then(data => {
                    console.log(data)
                    if (data.status != 20000) {
                        alert(data.errMsg)
                    } else {
                        console.log('图片上传成功')
                        console.log('图片地址为：' + data.result.url)
                        doCopy(data.result.url)
                        console.log('图片地址复制成功')

                        let tip = document.createElement('div')
                        tip.innerHTML = `<div id="ntcwin" class="ntcwin" initialized="true" style="position: fixed; z-index: 501; left: 649px; top: 521px;"><table cellspacing="0" cellpadding="0" class="popupcredit"><tbody><tr><td class="pc_l">&nbsp;</td><td class="pc_c"><div class="pc_inner"><span>图片地址已复制到剪贴板</span></div></td><td class="pc_r">&nbsp;</td></tr></tbody></table></div>`
                        document.body.appendChild(tip)
                        setTimeout(() => {
                            tip.remove()
                        }, 1500)
                    }
                });
        };

        function doUpload(e) {
            const wuaiUploadBtn = document.createElement('input')
            wuaiUploadBtn.setAttribute('type', 'file')
            wuaiUploadBtn.setAttribute('accept', 'image/*')
            wuaiUploadBtn.click()
            wuaiUploadBtn.onchange = () => {
                wuai_upload(wuaiUploadBtn.files[0])
            }
        }

        function doCopy(e) {
            let text = document.createElement('textarea')
            text.style.position = 'fixed';
            text.style.left = '-100vw';
            text.style.top = '-100vh';
            text.style.opacity = 0
            text.value = e
            document.body.appendChild(text)
            text.select();
            document.execCommand("Copy");
            text.remove()
        }

        let ele = document.createElement('span')
        ele.innerHTML = `<a id="wuaiUpload"  style="background: #f8f8f8 url(https://vip.d0.badyun.com/img/550e88bc2b2f63b4125ba34447a1f67fd85fb6aac9c4898a9d0557575ed5ad8b.png) no-repeat 0 0;" href="" class="replyfast" title="上传图片"><b>上传图片</b></a>`
        document.getElementById('jz52top').prepend(ele)

        document.addEventListener('paste', evt => {
            let clipdata = evt.clipboardData || window.clipboardData;
            let e;
            for (let i = 0, len = clipdata.items.length; i < len; i++) {
                const item = clipdata.items[i];
                if (item.kind === "file") {
                    e = item.getAsFile();
                    break;
                }
            }
            if (e && wuaiIsIn) {
                wuai_upload(e)
            }

        });

        let wuaiUpload = document.getElementById('wuaiUpload')

        wuaiUpload.onclick = (event) => {
            event.preventDefault()
            doUpload()
        }

        wuaiUpload.onmouseover = () => {
            wuaiIsIn = true
        }

        wuaiUpload.onmouseout = () => {
            wuaiIsIn = false
        }





})();