// ==UserScript==
// @name         （New Format）BaiduNetDisk Fake Quick Save （新型格式）百度网盘秒传(偽)链接提取 转存
// @name         BaiduPan for generating links and saving files. 百度网盘转存(偽)
// @name:zh      BaiduPan for generating links and saving files. 百度网盘转存(偽)
// @name:zh-TW	 BaiduPan for generating links and saving files. 百度網盤轉存(偽)
// @name:en      BaiduNetDisk for generating links and saving files.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BaiduPan for generating links and saving files. 百度網盤轉存(偽)
// @description:zh-tw 百度網盤轉存(偽)
// @description:en BaiduPan for generating links and saving files.
// @author       kamisato
// @match        *://pan.baidu.com/*
// @grant        GM_xmlhttpRequest
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483464/BaiduPan%20for%20generating%20links%20and%20saving%20files%20%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%BD%89%E5%AD%98%28%E5%81%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483464/BaiduPan%20for%20generating%20links%20and%20saving%20files%20%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%BD%89%E5%AD%98%28%E5%81%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var uk;
  window.addEventListener('load', function() {
      function extractUk() {
    const scripts = document.getElementsByTagName('script');
    const ukRegex = /"uk":"(\d+)"/;
    for (let script of scripts) {
        if (script.textContent.includes('window.locals')) {
            const matches = ukRegex.exec(script.textContent);
            if (matches && matches.length > 1) {
                return matches[1];
            }
        }
    }
    return null;
}

uk = extractUk();
if (uk) {
    console.log('Extracted UK:', uk);
} else {
    console.log('UK not found');
}
        const toolbar = document.querySelector('.wp-s-agile-tool-bar__header');
        if (toolbar) {
            const generateLinkButton = createButton('Generate Link', 'generate-link');
            generateLinkButton.addEventListener('click', generateLink);

            const saveButton = createButton('Save By Link', 'save');
            saveButton.addEventListener('click', showSaveDialog);

            toolbar.appendChild(generateLinkButton);
            toolbar.appendChild(saveButton);
        }
    });

    function createButton(text, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `btn ${className}`;
        return button;
    }

    function generateLink() {
        const links = [];
        let fidLists = [];
        let fidListAdded = false;
          fidLists = getSelectedFidList();
            if (fidLists.length === 0) {
                return;
            }
        showLoadingDialog();

        function makeRequest(index) {
            if (index >= 3) {
                const jsonStr = JSON.stringify({ links, fidLists });
                const jsonStr1 = JSON.stringify({ links, fidLists: fidLists });
                const base64Encoded = btoa(jsonStr1);
                updateDialogWithResponse(base64Encoded);
                return;
            }

            const pwd = generateRandomPassword();
            fidLists = getSelectedFidList();
            const data = `period=0&pwd=${pwd}&eflag_disable=true&channel_list=[]&schannel=4&fid_list=[${fidLists}]`;
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&app_id=250528&web=1`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: data,
                    onload: function(response) {
                        const respJson = JSON.parse(response.responseText);
                        const surl = extractSurl(respJson.link);
                        const link = `${surl}&pwd=${pwd}&shareid=${respJson.shareid}&realNameVerify=${uk}`;
                        links.push(link);
                        //fidLists.push(fidList.join(','));
                        makeRequest(index + 1);
                    },
                    onerror: function(error) {
                        console.error('Request failed', error);
                        makeRequest(index + 1);
                    }
                });

        }
        makeRequest(0);
    }
function extractSurl(fullLink) {
    const parts = fullLink.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.substring(1);
}

function generateRandomPassword() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

    function getSelectedFidList() {
        const selectedRows = document.querySelectorAll('.wp-s-table-skin-hoc__tr.wp-s-pan-table__body-row.mouse-choose-item.selected');
        return Array.from(selectedRows, row => row.getAttribute('data-id'));
    }


function showLoadingDialog() {
    const modal = document.createElement('div');
    modal.className = 'modal loading-modal';
    modal.innerHTML = `
        <div class="modal-dialog loading-dialog">
            <div class="modal-content">
                <div class="modal-body" style="text-align: center;">
                    <p style="font-size: 20px;">Generating...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

    function updateDialogWithResponse(responseText) {
        const modalBody = document.querySelector('.modal .modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <textarea id="generatedResponse" class="form-control response-textarea" readonly>${responseText}</textarea>
                <div class="modal-footer">
                    <button class="btn btn-success" id="copyButton">Copy</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            `;

            document.getElementById('copyButton').addEventListener('click', copyToClipboard);
        } else {
            console.error('Modal body not found');
        }
    }

    function copyToClipboard() {
        const responseField = document.getElementById('generatedResponse');
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(responseField.value)
                .then(() => {
                    document.getElementById('copyButton').textContent = 'Copied';
                })
                .catch(err => {
                    console.error('error: ', err);
                });
        } else {
            responseField.select();
            document.execCommand('copy');
            document.getElementById('copyButton').textContent = 'Copied';
        }
    }

    function updateDialogWithLink(link) {
        const modalBody = document.querySelector('.modal .modal-body');
        modalBody.innerHTML = `
            <div class="link-display">
                <label for="generatedLink">Generated Link:</label>
                <input type="text" id="generatedLink" value="${link}" class="form-control" readonly>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" onclick="navigator.clipboard.writeText('${link}')">Copy</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        `;
    }



function tryTransfer(links, fidList, pathInput, attempt, triedIndices = []) {
    
    if (attempt === 0) showTransferringDialog();

    if (attempt >= links.length) {
        console.error('Failed...');
        document.querySelector('.transferring-modal').remove();
        showTransferResultDialog(false); 
        return;
    }

    let remainingIndices = links.map((_, index) => index).filter(index => !triedIndices.includes(index));
    let randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    triedIndices.push(randomIndex);
    const randomLink = links[randomIndex];
    const { surl, pwd, shareid, realNameVerify } = parseLink(randomLink);
    const verifyUrl = `https://pan.baidu.com/share/verify?surl=${surl}&channel=chunlei&web=1&app_id=250528`;
    const verifyOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://pan.baidu.com'
        },
        body: `pwd=${pwd}`
    };
    fetch(verifyUrl, verifyOptions)
        .then(response => response.json())
        .then(data => {
            if (data && data.randsk) {
                transferFile(shareid, data.randsk, realNameVerify, fidList, pathInput, () => {
                    tryTransfer(links, fidList, pathInput, attempt + 1, triedIndices);
                });
            } else {
                tryTransfer(links, fidList, pathInput, attempt + 1, triedIndices);
            }
        })
        .catch(error => {
            tryTransfer(links, fidList, pathInput, attempt + 1, triedIndices);
        });
}

function showTransferringDialog() {
    const modal = document.createElement('div');
    modal.className = 'modal transferring-modal';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body" style="text-align: center;">
                    <p style="font-size: 20px;">Saving...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}



function showTransferResultDialog(success) {
    const message = success ? "Success" : "Fail";
    const modal = document.createElement('div');
    modal.className = 'modal transfer-result-modal';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body" style="text-align: center;">
                    <p style="font-size: 20px;">${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function transferFile(shareid, sekey, realNameVerify, fidList, path, errorCallback) {
    const transferUrl = `https://pan.baidu.com/share/transfer?shareid=${shareid}&from=${realNameVerify}&sekey=${sekey}&ondup=newcopy&async=1&channel=chunlei&web=1&app_id=250528`;
    const transferOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://pan.baidu.com'
        },
        body: `fsidlist=[${fidList}]&path=${path}`
    };
console.log(transferUrl);
    fetch(transferUrl, transferOptions)
        .then(response => response.json())
        .then(respJson => {
            if (respJson.errno === 0) {
                document.querySelector('.transferring-modal').remove();
                showTransferResultDialog(true);
            } else {
                errorCallback();
            }
        })
        .catch(error => {
            errorCallback();
        });
}

    function showSaveDialog() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <input type="text" id="linkInput" class="form-control" placeholder="link">
                    <input type="text" id="pathInput" class="form-control" placeholder="/???,default root path.">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="saveButton">Save it!</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('saveButton').addEventListener('click', function() {
            const linkInput = document.getElementById('linkInput').value;
            const pathInput = document.getElementById('pathInput').value;
            let encodedPath = encodeURIComponent(pathInput);
        if (encodedPath === '') {
            encodedPath = '%2f';
        }


    try {
        const linksArray = atob(linkInput);
        const parsedData = JSON.parse(linksArray);
        const links = parsedData.links;
        const fidList = parsedData.fidLists;
        tryTransfer(links, fidList, encodedPath, 0);
    } catch (error) {
        console.error(error);
    }
    });
}

function parseLink(link) {
    const [surl, pwdPart, shareidPart, realNamePart] = link.split('&');
    const pwd = pwdPart.split('=')[1];
    const shareid = shareidPart.split('=')[1];
    const realNameVerify = realNamePart.split('=')[1];
    return { surl, pwd, shareid, realNameVerify };
}

    const style = document.createElement('style');
    style.textContent = `
        .btn {
            background-color: #06a7ff;
            color: white;
            font-weight: 700;
            padding: 8px 24px;
            height: 32px;
            font-size: 14px;
            border-radius: 16px;
            border: none;
            margin-left: 10px;
            cursor: pointer;
        }
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
            z-index: 1000;
        }
        .modal-dialog {
            width: auto;
        }
        .modal-content {
            padding: 15px;
        }
        .modal-body {
            padding: 10px 0;
        }
        .modal-footer {
            text-align: center;
            padding: 10px 0;
        }
        .link-display {
            margin-bottom: 15px;
        }
        .link-display input {
            width: 100%;
            padding: 6px 12px;
            margin-top: 5px;
            font-size: 14px;
            line-height: 1.42857143;
            color: #555;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        }
        .link-display label {
            font-weight: 700;
        }
        .form-control {
            width: 100%;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.42857143;
            color: #555;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        }
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30vw;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
            z-index: 1000;
            overflow: auto;
        }
        .loading-dialog {
            width: 30%;
        }
        .response-textarea {
            height: 200px;
        }
        .modal-dialog {
            width: 100%;
        }
        .modal-content {
            width: 100%;
        }
        .modal-body {
            padding: 10px 0;
        }
        .modal-footer {
            text-align: center;
            padding: 10px 0;
        }
        .link-display {
            margin-bottom: 15px;
        }
        .link-display input, .form-control {
            width: 100%;
        }
        text-area {
            min-height: 400px;
            }
    `;
    document.head.appendChild(style);
})();
