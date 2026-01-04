// ==UserScript==
// @name         115原石会员转存助手-突破500限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  115原石会员批量转存助手，可批量转存>500个文件
// @author       @ejmkod
// @match        *://115.com/s/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501813/115%E5%8E%9F%E7%9F%B3%E4%BC%9A%E5%91%98%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B-%E7%AA%81%E7%A0%B4500%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501813/115%E5%8E%9F%E7%9F%B3%E4%BC%9A%E5%91%98%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B-%E7%AA%81%E7%A0%B4500%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
    #batchTransferButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }
    #batchTransferButton:hover {
        background-color: #0056b3;
    }
    #startIndexInputLabel, #cidInputLabel, #batchSizeInputLabel,
    #startIndexInput, #cidInput, #batchSizeInput {
        position: fixed;
        z-index: 1000;
    }
    #cidInputLabel {
        bottom: 140px;
        right: 200px;
    }
    #cidInput {
        bottom: 140px;
        right: 20px;
    }
    #batchSizeInputLabel {
        bottom: 100px;
        right: 200px;
    }
    #batchSizeInput {
        bottom: 100px;
        right: 20px;
    }
    #startIndexInputLabel {
        bottom: 60px;
        right: 200px;
    }
    #startIndexInput {
        bottom: 60px;
        right: 20px;
    }
    #progressOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        display: none;
        flex-direction: column;
    }
    #progressBar {
        width: 80%;
        height: 20px;
        background: #555;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        position: relative;
    }
    #progressFill {
        height: 100%;
        width: 0;
        background: #4caf50;
        transition: width 0.2s;
    }
    #progressText {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        color: white;
        font-weight: bold;
    }
    #toast {
        visibility: hidden;
        min-width: 250px;
        margin-left: -125px;
        background-color: #333;
        color: white;
        text-align: center;
        border-radius: 2px;
        padding: 16px;
        position: fixed;
        z-index: 1001;
        left: 50%;
        bottom: 30px;
        font-size: 17px;
    }
    #toast.show {
        visibility: visible;
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
    @-webkit-keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }
    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }
    @-webkit-keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
    #errorLabel {
        position: fixed;
        bottom: 170px;
        right: 20px;
        color: red;
        z-index: 1000;
        display: none;
    }
`);


const cidInputLabel = document.createElement('label');
cidInputLabel.id = 'cidInputLabel';
cidInputLabel.for = 'cidInput';
cidInputLabel.innerText = 'CID: ';

const startIndexInputLabel = document.createElement('label');
startIndexInputLabel.id = 'startIndexInputLabel';
startIndexInputLabel.for = 'startIndexInput';
startIndexInputLabel.innerText = 'Start Index: ';

const batchSizeInputLabel = document.createElement('label');
batchSizeInputLabel.id = 'batchSizeInputLabel';
batchSizeInputLabel.for = 'batchSizeInput';
batchSizeInputLabel.innerText = 'Batch Size: ';

const cidInput = document.createElement('input');
cidInput.id = 'cidInput';
cidInput.type = 'text';
cidInput.placeholder = 'Enter CID';


const startIndexInput = document.createElement('input');
startIndexInput.id = 'startIndexInput';
startIndexInput.type = 'number';
startIndexInput.placeholder = 'Enter start index';
startIndexInput.value = '0';

const batchSizeInput = document.createElement('input');
batchSizeInput.id = 'batchSizeInput';
batchSizeInput.type = 'number';
batchSizeInput.placeholder = 'Enter batch size';
batchSizeInput.value = '20';


const button = document.createElement('button');
button.id = 'batchTransferButton';
button.innerText = '批量转存';


const progressOverlay = document.createElement('div');
progressOverlay.id = 'progressOverlay';
progressOverlay.innerHTML = `
    <div id="progressBar">
        <div id="progressFill"></div>
        <div id="progressText">转存中请稍后，当前进度 0%</div>
    </div>
`;

const label = document.createElement('label');
label.id = 'errorLabel';


const toast = document.createElement('div');
toast.id = 'toast';


document.body.appendChild(cidInputLabel);
document.body.appendChild(cidInput);
document.body.appendChild(batchSizeInputLabel);
document.body.appendChild(batchSizeInput);
document.body.appendChild(startIndexInputLabel);
document.body.appendChild(startIndexInput);


document.body.appendChild(button);
document.body.appendChild(progressOverlay);
document.body.appendChild(label);
document.body.appendChild(toast);


function showToastAndLabel(message, index) {
    showToast(message);
    label.innerText = message;
    label.style.display = 'block';
}


function showToast(message) {
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}


async function sendPostRequest(fileid, currentIndex) {
    const formData = new FormData();
    formData.append("cid", cidInput.value);
    formData.append("user_id", document.querySelector('span[rel="user_id"]').textContent);
    formData.append("share_code", new URL(location).pathname.replace('/s/', ''));
    formData.append("receive_code", document.querySelector('em[rel="receive_code"]').textContent);
    formData.append("file_id", fileid);
    console.log('formData', JSON.stringify(Object.fromEntries(formData.entries())));

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://webapi.115.com/share/receive",
            data: formData,
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    console.log('Parsed JSON Response:', JSON.stringify(jsonResponse));
                    if (jsonResponse.state === false) {
                        showToastAndLabel(`转存错误：${jsonResponse.error}，当前index ${currentIndex}`, currentIndex);
                        reject('Stop request due to error 4100013');
                    } else {
                        resolve();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    reject(error);
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
                reject(error);
            }
        });
    });
}


async function processACidAttributes() {
    // 检查 CID 输入是否为空
    if (!cidInput.value.trim()) {
        showToast('先输入CID');
        return;
    }
    // Click the button with id="js_load_all"
    document.getElementById('js_load_all').click();
    progressOverlay.style.display = 'flex';
    document.getElementById('progressText').innerText = `转存中请稍后...`;

    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    const liTags = document.querySelectorAll('#js-list li');
    const aCidList = [];

    liTags.forEach(a => {
        if (a.hasAttribute('fid') && a.getAttribute('fid')) {
            aCidList.push(a.getAttribute('fid'));
        }else if(a.hasAttribute('cid')){
            aCidList.push(a.getAttribute('cid'));
        }
    });

    let currentIndex = parseInt(startIndexInput.value, 10);
    const batchSize = parseInt(batchSizeInput.value, 10);



    for (let i = currentIndex; i < aCidList.length; i += batchSize) {
        const fileid = aCidList.slice(i, i + batchSize).join(',');
        try {
            await sendPostRequest(fileid, i);
        } catch (error) {
            console.error(error);
            break;
        }
        currentIndex = i + batchSize;
        const progress = Math.min(100, (currentIndex / aCidList.length) * 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').innerText = `转存中请稍后，当前进度 ${progress.toFixed(2)}%`;
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 4000) + 3000)); // Sleep 3-7 seconds
    }

    progressOverlay.style.display = 'none';
}

button.addEventListener('click', processACidAttributes);

})();