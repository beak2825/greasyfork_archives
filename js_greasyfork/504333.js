// ==UserScript==
// @name         夸克网盘批量工具集
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  批量重命名夸克网盘文件，获取文件列表
// @author       21zys
// @match        *://pan.quark.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504333/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/504333/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cookie = document.cookie;

    // Step 1: 找到指定的div元素并在其内部添加按钮
    function addexecuteButton() {
        const targetDiv = document.querySelector('div.SectionHeaderController--section-header-right--QIJ-wNk');
        if (targetDiv) {
            const executeButton = document.createElement('button');
            executeButton.type = 'button';
            executeButton.className = 'ant-btn btn-file btn-create-folder';
            executeButton.style.marginRight = '12px;'
            executeButton.innerText = '打开21对话框';
            executeButton.textContent = '21对话框';
            executeButton.addEventListener('click', showRenameDialog);
            targetDiv.insertBefore(executeButton, targetDiv.firstChild);
        }
    }

    // Step 3: 显示对话框，包含文本框和重命名按钮
    function showRenameDialog() {
        // 创建对话框容器
        const dialog = document.createElement('div');
        dialog.className = 'batch-options-dialog';
        dialog.style.width = '500px';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.border = '1px solid #ccc';
        dialog.style.padding = '20px';
        dialog.style.zIndex = '10000';

        // 创建单选按钮组
        const radioGroup = document.createElement('div');
        const options = [
            { id: 'remove-number-prefix', label: '删除数字字符前缀' },
            { id: 'regex-remove', label: '正则删除' },
            { id: 'add-number-prefix', label: '增加数字前缀' },
            { id: 'remove-specific', label: '删除指定字符' },
            { id: 'get-file-list', label: '获取文件列表' },
            { id: 'batch-delete-file', label: '批量删除文件' },
        ];

        options.forEach(option => {
            const radioWrapper = document.createElement('div');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'rename-option';
            radio.value = option.id;
            radio.id = option.id;
            radioWrapper.appendChild(radio);

            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            radioWrapper.appendChild(label);

            radioGroup.appendChild(radioWrapper);
        });
        dialog.appendChild(radioGroup);

        // 创建文本框
        const textarea = document.createElement('textarea');
		textarea.className = 'ayi-textarea';
        textarea.style.width = '100%';
        textarea.style.height = '300px';
        textarea.placeholder = '请输入参数';
        textarea.style.marginBottom = '10px';
        dialog.appendChild(textarea);

        // 创建执行按钮
        const executeButton = document.createElement('button');
        executeButton.textContent = '执行';
        executeButton.style.display = 'inline-block';
        executeButton.style.width = '45%';
        executeButton.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="rename-option"]:checked');
            if (selectedOption) {
				const cancelButton = document.querySelector('button.ayi-cancel-btn');
				cancelButton.disable = true;
                const actionType = selectedOption.value;
                const inputValue = textarea.value;
                if (actionType === 'remove-specific' && inputValue === '') {
                    alert('请输入需要删除的字符！！！')
                } else if (actionType === 'regex-remove' && inputValue === '') {
                    alert('请输入需要删除的正则表达式匹配内容！！！');
                } else if (actionType === 'add-number-prefix' && inputValue === '') {
                    alert('请输入分隔符！！！')
                } else if (actionType === 'get-file-list') {
					executeOption(actionType, inputValue);
				} else if (actionType === 'batch-delete-file') {
					executeOption(actionType, inputValue);
                    textarea.value = '';
					setLogToTextarea(textarea, "执行成功！！！");
				} else {
                    executeOption(actionType, inputValue.split('\n')[0]);
                    textarea.value = '';
                    setLogToTextarea(textarea, "执行成功！！！");
                }
				cancelButton.disable = false;
            } else {
                alert('请选择一个操作选项');
            }
        });
        dialog.appendChild(executeButton);

		// 创建取消按钮
		const cancelButton = document.createElement('button');
		cancelButton.className = 'ayi-cancel-btn';
		cancelButton.textContent = '关闭';
        cancelButton.style.display = 'inline-block';
        cancelButton.style.width = '45%';
		cancelButton.addEventListener('click', function() {
			document.body.removeChild(dialog);
        });
		dialog.appendChild(cancelButton);

        // 添加对话框到页面
        document.body.appendChild(dialog);
    }

    // 获取文件列表
    function fetchFileList(page) {
        // 获取当前父文件的 fid
        const url = window.location.href;
        const lastSegment = url.split('/').pop();
        let pdir_fid = lastSegment.split('-')[0];

        // 保存文件列表 fid, file_name
        let results = [];
        // 发送请求
        function fetchPage(page) {
            const xhr = new XMLHttpRequest();
            const url = `https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=${pdir_fid}&_page=${page}&_size=500&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,file_name:asc`;

            xhr.open('GET', url, false);

            // 设置 withCredentials 为 true，允许跨域请求发送 cookie
            xhr.withCredentials = true;

            // 设置cookie请求头
            // xhr.setRequestHeader('Cookie', cookie);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const data = response.data;

                    // 如果data或list为空，则停止请求
                    if (!data || !data.list || data.list.length === 0) {
                        return;
                    }

                    // 将每个对象的 fid, file_name 追加到 results 数组中
                    data.list.forEach(item => {
                        results.push({'fid': item.fid, 'file_name':item.file_name});
                    });

                    fetchPage(page + 1)
                }
            };

            xhr.send();
        }

        fetchPage(page);
        return results;
    }

    function setLogToTextarea(textarea, log) {
        if (textarea) {
            textarea.value = log;
        }
	}

    function deleteFile(textarea, fid, oldFileName, index, length) {
        const url = `https://drive-pc.quark.cn/1/clouddrive/file/delete?pr=ucpro&fr=pc&uc_param_str=`;
        // 请求体
        const requestBody = {
            actoin_type: 2,
            exclude_fids: [],
            filelist: [fid]
        };

        // 发送请求
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        // 设置 withCredentials 为 true，允许跨域请求发送 cookie
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        // 设置cookie请求头
        // xhr.setRequestHeader('Cookie', cookie);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // 请求完成
                if (xhr.status === 200) { // 请求成功
                    console.log(`${index}/${length}：${oldFileName} 文件删除成功！！！`);
                } else if (xhr.status === 400){ // 请求失败
                    console.log(`${index}/${length}：${oldFileName} 文件删除失败！！！原因：${xhr.responseText}`)
                }
            }
        };
        setLogToTextarea(textarea, `${index}/${length}`);
        xhr.send(JSON.stringify(requestBody));
    }

    function renameFile(textarea, fid, oldFileName, newFileName, index, length) {
        const url = `https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc&uc_param_str=`;
        // 请求体
        const requestBody = {
            fid: fid,
            file_name: newFileName
        };

        // 发送请求
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        // 设置 withCredentials 为 true，允许跨域请求发送 cookie
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        // 设置cookie请求头
        // xhr.setRequestHeader('Cookie', cookie);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // 请求完成
                if (xhr.status === 200) { // 请求成功
                    console.log(`${index}/${length}：文件 ${oldFileName} ——> ${newFileName} 成功！！！`);
                } else if (xhr.status === 400){ // 请求失败
                    let responseCode = JSON.parse(xhr.responseText).code;
                    console.log(responseCode);
                    if (responseCode === 23008) {
                        console.log(`${index}/${length}：${oldFileName} ——> ${newFileName} 重命名失败，已存在同名文件。正在执行删除操作...`)
                        deleteFile(textarea, fid, oldFileName, index, length);
                    } else {
                        console.log(`${index}/${length}：${oldFileName} ——> ${newFileName} 重命名失败，未知原因。${xhr.response.Text}`);
                    }
                }
            }
        };
        xhr.send(JSON.stringify(requestBody));
        setLogToTextarea(textarea, `${index}/${length}`);
    }

    function sleep(ms) {
        const start = Date.now();
        // 循环直到指定的毫秒数过去
        while (Date.now() - start < ms) {
            // 空循环持续到时间过去
        }
    }

    function formatNumber(number, length) {
        // 将数字转换为字符串
        const numberStr = number.toString();

        // 使用padStart来填充前导零
        return numberStr.padStart(length, '0');
    }

    function getNumberStringLength(number) {
        // 将数字转换为字符串
        const numberStr = number.toString();

        // 获取字符串的长度
        return numberStr.length;
    }

    // Step 4: 执行相应逻辑
    function executeOption(actionType, inputText) {
        const textarea = document.querySelector('textarea.ayi-textarea');
        function fetchAndRename() {
            let results = fetchFileList(1);
            let index = 0;
            let length = results.length;
            let lengthStringLength = getNumberStringLength(length);
            results.forEach(item => {
                index++;
                let fid = item['fid'];
                let file_name = item['file_name'];
                // 生成 3 到 5 秒之间的随机毫秒数
                const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

                if (actionType === 'remove-number-prefix') {
                    // 删除数字字符前缀
                    const prefixPattern = '[【\\[\\(（]?\\d+[】\\]\\)）\\-_\\.：:]+([\\u4e00-\\u9fa5a-zA-Z0-9（）、。《》“”，：；？！－%—\\(\\)\\-\\.,:;\\?\\!]*)';
                    if (inputText !== '') {
                        prefixPattern = inputText
                    }
                    const prefixReg = new RegExp(prefixPattern);
                    if (prefixReg.test(file_name)) {
                        renameFile(null, fid, file_name, file_name.replace(prefixReg, '$1'), index, length);
                        sleep(delay);
                    }
                } else if (actionType === 'regex-remove') {
                    const regex = new RegExp(inputText, 'g');
                    if (regex.test(file_name)) {
                        renameFile(null, fid, file_name, file_name.replace(regex, ''), index, length);
                        sleep(delay);
                    }
                } else if (actionType === 'add-number-prefix') {
                    renameFile(null, fid, file_name, `${formatNumber(index, lengthStringLength)}${inputText}${file_name}`, index, length);
                    sleep(delay);
                } else if (actionType === 'remove-specific' && file_name.search(inputText) !== -1) {
                    // 删除特定字符
                    renameFile(null, fid, file_name, file_name.split(inputText).join(''), index, length);
                    sleep(delay)
                }
            });
        }
		function getFileList() {
			let results = fetchFileList(1);
			if (results.length > 0) {
                setLogToTextarea(textarea, results.map(item => item.file_name).join('\n'));
			}
		}
		function batchDeleteFile() {
			const fidList = inputText.split('\n');
			let index = 0;
			const length = fidList.length;
			fidList.forEach(item => {
				index++;
				// 生成 1 到 2 秒之间的随机毫秒数
                const delay = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
				deleteFile(textarea, item, '', index, length);
			});
		}
		if (actionType === 'remove-number-prefix' || actionType === 'regex-remove' || actionType === 'add-number-prefix' || actionType === 'remove-specific') {
			fetchAndRename();
		} else if (actionType === 'get-file-list') {
			getFileList();
		} else if (actionType === 'batch-delete-file') {
			batchDeleteFile();
		}
    }

    // 初始化脚本
    addexecuteButton();

})();