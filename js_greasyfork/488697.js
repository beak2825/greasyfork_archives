// ==UserScript==
// @name         从 Excel 解析邮件内容
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动把多语言结果填入网页
// @author       Zilin Cai
// @match        https://mo-global-gm.kingsgroupgames.com/Mail/Mail*
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488697/%E4%BB%8E%20Excel%20%E8%A7%A3%E6%9E%90%E9%82%AE%E4%BB%B6%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/488697/%E4%BB%8E%20Excel%20%E8%A7%A3%E6%9E%90%E9%82%AE%E4%BB%B6%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==


(() => {
    function addInputButton(xPath) {
        const targetElement = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetElement) {
            const button = document.createElement('button');
            button.id = 'upload-excel-button';
            button.type = 'button';
            button.className = 'btn btn-success btn-sm btn-outline pull-right';
            button.textContent = '我不想手动复制了';
            targetElement.appendChild(button);
        }
        else {
            console.error('目标元素未找到，请检查路径是否正确。');
        }
    }
    function addInvisibleInputButton() {
        const fileInput = document.createElement('input');
        fileInput.id = 'invisible-file-input';
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
    }
    function getCountrySections() {
        return Array.from(document.querySelectorAll('.languageShow'));
    }
    function getInputElements(countrySectionElements) {
        const result = {};
        countrySectionElements.forEach((element) => {
            const keyElement = element.querySelector('h4');
            let keyName = null;
            if (keyElement && keyElement.textContent) {
                keyName = keyElement.textContent.trim();
            }
            const titleInputElement = element.querySelector('div:nth-of-type(2) > div > input');
            const bodyInputElement = element.querySelector('div:nth-of-type(3) > div > textarea');
            let titleInput = null;
            let bodyInput = null;
            if (titleInputElement instanceof HTMLInputElement) {
                titleInput = titleInputElement;
            }
            if (bodyInputElement instanceof HTMLTextAreaElement) {
                bodyInput = bodyInputElement;
            }
            if (keyName && titleInput && bodyInput) {
                result[keyName] = {
                    titleInput,
                    bodyInput,
                };
            }
        });
        return result;
    }
    function excelToJson(e) {
        return new Promise((resolve) => {
            if (!e.target) {
                console.error('文件读取失败');
                return;
            }
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
                console.error('工作表名称获取失败');
                return;
            }
            const worksheet = workbook.Sheets[firstSheetName];
            if (!worksheet) {
                console.error('工作表获取失败');
                return;
            }
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json);
            resolve(json);
        });
    }
    function excelJsonToMail(excelJson, wholeMailSection) {
        Object.keys(wholeMailSection).forEach((p) => {
            const elementDetail = wholeMailSection[p];
            if (elementDetail) {
                if (elementDetail.titleInput && elementDetail.bodyInput) {
                    elementDetail.titleInput.value = '';
                    elementDetail.bodyInput.value = '';
                }
                if (excelJson[0][p] !== undefined && excelJson[1][p] !== undefined) {
                    if (elementDetail.titleInput && elementDetail.bodyInput) {
                        elementDetail.titleInput.value = excelJson[0][p] ?? '';
                        elementDetail.bodyInput.value = excelJson[1][p] ?? '';
                    }
                }
                else {
                    console.log(`${p} 国家没有本地化信息`);
                }
            }
        });
    }
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    const modal = document.createElement('div');
    modal.style.padding = '20px';
    modal.style.background = '#fff';
    modal.style.borderRadius = '5px';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    const text = document.createElement('p');
    text.textContent = 'Disclaimer: 本脚本不代替人工检查过程，请确保在解析 Excel 后人工二次确认内容无误！同意请点击确认';
    modal.appendChild(text);
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';
    confirmButton.style.margin = '10px';
    confirmButton.onclick = function () {
        console.log('用户点击了确认');
        overlay.style.display = 'none';
    };
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.margin = '10px';
    cancelButton.onclick = function () {
        console.log('用户点击了取消');
        overlay.style.display = 'none';
    };
    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.style.display = 'none';
    addInputButton('/html/body/div[3]/div/div[3]/div[1]/div/div[1]/div/div/div[2]');
    addInvisibleInputButton();
    const countrySections = getCountrySections();
    const inputElements = getInputElements(countrySections);
    const uploadExcelButton = document.getElementById('upload-excel-button');
    const fileInput = document.getElementById('invisible-file-input');
    if (!uploadExcelButton) {
        console.error('上传按钮未找到');
        return;
    }
    uploadExcelButton.onclick = () => {
        overlay.style.display = 'flex';
        confirmButton.onclick = () => {
            fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        excelToJson(evt).then((json) => {
                            excelJsonToMail(json, inputElements);
                            overlay.style.display = 'none';
                            fileInput.value = '';
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }
                else {
                    console.error('文件读取失败');
                    fileInput.value = '';
                }
            };
        };
    };
})();