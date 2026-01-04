// ==UserScript==
// @name         VideoDownload
// @version      2.0
// @description  Video DownLoad to local(WenDao 视频下载)
// @license      MIT
// @author       Uansung
// @match        https://teaching.open-school.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABMFJREFUeF7tnV1oVEcYht9oNMb611VSZQ2ogUCUXqgxhRLBboUKCloEBS3RVgSFUqg3KrRKxQvbi5ZSSqX1og2ohKKI6EWw7EUQlRhNvdDgT380hmCQVYsa/1rlBHa7qT27s7vfnP1mePcu7Mw37/c+5ztzZs452Qrwo8qBClVqKAYEouwgIBACUeaAMjmsEAJR5oAyOawQAlHmgDI5rBACUeaAMjmsEAJR5oAyOawQAlHmgDI5IhWSSCTWK8urLHKSyeSPpQ4sBeQ8gLmlinG8f3cymZxXag4EUqqD//YnEDkvRSIRiIiNckEIRM5LkUgEImKjXBACkfNSJJJOILFYbFh2qVRq2N+1sxsxOV6HytFVIi7YCvJk8AFS/X/iZs+5YUPkyE8nkHg8jurq6qEkAhjZQN5+fzvqmxbb8tBK3Mun25Fs/SITOwCShjI4OIi+vr70d24BqW1oxLKPPrdimu2gx77Zit5LXUPDeAOkcWkLFixbZ9s7K/FPH/4ev55oIxAr7hYR9Oyxn9B1vJVAivDOShfngaRdCSa99KTu8inrv0DSFy1Bnuon9bBD1BcgOUpQ51UWgZR21oxs+50VYgaKQAx8yp5DnDtlZU94gfhgYg8+vlRIWH4AdM4hYVsnic178GrdfDx9eM/gmNTTZNTYibjz2zkkv9vm1zok/uZKzHpnox6nC1Dye/sP6Dt1iEAK8MxqUwKxam/hwQmkcM+s9iAQq/YWHtxpIGHp+jKpO7cOIZDCKzC7R2QrdVaIGajIgMTqmzBn7S4zVcpaXdy/A6krnflU6Vyp51I9d9O3GDetLl9iqr6/338N3Xs/NNGkE0iup06CbYjahasRVMuY2DQ8/uu2SaKRt6maMAWPUv1IXe1Eb0fbsO0ebx5yiNxVSwMSiCVjiw1LIMU6Z6kfgVgyttiw3gGZVDMd0xvmY2TlqGI9iaTf38+eorenC/cGMo+KDo3rHJAcd9TwxvINmLdkTSSGSg3S3X4QZ47sy4Rz7o5hmBHjJ0/Fe7v3S/kUaZwDO1teqpT/EaBzHRLmVEPzUixauyVSI6UG6zj4NS52HM0Xzi0gr7/1LppXGa148yUe+fenDu3FhV9+zjcugeRzSOp7p4GEvWHkS4V48waVT0C8eIOKQMxOoOL3Q8J2ewmEQMwcMGiVPak7t1JnhRgQztHEyikrPV72G1QLP/gM46fOKE1tmXrfH7iBjn2fZvayvHiDig85mB1N4hUSNiyBEIiZAwatsp9czNHcra0TVogBeUDmF3YSiUTmfy6G3S/wBYhz90PCLnt9AeLNOoRAynTKYoWYGR/WSvyyNwzIlNnNaFj9SWlqy9S7p203bl86mVkYerHbG2TTtKUVVRNrymRrccM+vjuAzq9aMp29mUOCjF55bSbqV3yMsTUzMKJyNPD8eXEu2e5VUYF/nj3Bw4HruHLkSzy49Ye7QGx7pTi+WwtDxUZKSSMQKSeF4hCIkJFSYQhEykmhOAQiZKRUGAKRclIojjogQnm5G0bNL+y4a6E+5SJ7WfrSclcRgShjRyAEoswBZXJYIQSizAFlclghBKLMAWVyWCEEoswBZXJYIQSizAFlclghBKLMAWVyWCEEoswBZXJeAJt4DKFMKBoBAAAAAElFTkSuQmCC
// @grant        none
// @run-at document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/453776/VideoDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/453776/VideoDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(document.getElementById('video-player_html5_api').src!=null){
            let downloadBtn = document.createElement('div');
            downloadBtn.id = "download_div";
            downloadBtn.style.position="fixed"
            downloadBtn.style.top="50%";
            downloadBtn.style['z-index']="99999"
            downloadBtn.innerHTML =`<div style="width: 30px; display:flex;flex-direction: column;">
				<button id="copyBtn" style="background-color:#c2e9fb;padding: 5px;">复制链接</button>
				<button id="downloadBtn" style=" background-color:#fccb90;padding: 5px;">下载</button>
			</div>`
            document.body.appendChild(downloadBtn);
        }
        var download = document.getElementById('downloadBtn');
        var copy = document.getElementById('copyBtn');
        if (download != null || copy != null){
            download.addEventListener('click',function(){
                if(document.getElementById('video-player_html5_api').src.slice(0,4) == 'blob'){
                    alert("下载失败！");
                }else{
                    let x = new XMLHttpRequest()
                    x.open('GET', document.getElementById('video-player_html5_api').src, true)
                    x.responseType = 'blob'
                    x.onload = (e) => {
                        let url = window.URL.createObjectURL(x.response)
                        let a = document.createElement('a')
                        a.href = url
                        a.download = document.querySelector('.ant-select-selection-selected-value').innerText+".mp4";
                        a.click()
                    }
                    x.send();
                    alert("已加入下载！\n请耐心等待，下载完成后文件会出现在下载列表");
                }
            });
            copy.addEventListener('click',function(){
                if(document.getElementById('video-player_html5_api').src.slice(0,4) != 'blob'){
                    navigator.clipboard.writeText(document.getElementById('video-player_html5_api').src);
                    alert("复制成功\n"+ document.getElementById('video-player_html5_api').src)
                }else{
                    alert("此链接不能复制！");
                }
            });
        }
    },5000)
})();