// ==UserScript==
// @name 智慧职教+ 课件下载
// @namespace https://greasyfork.org/zh-CN/scripts/521992
// @version 1.7
// @description 智慧职教教师版课件下载
// @author AC今夜有雨
// @license GPL License
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/521992/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%2B%20%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521992/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%2B%20%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
let css = `(function () {
    'use strict';
    // https://zjy2.icve.com.cn
    const origin = window.location.origin;
    const courseDesignServiceName = '/prod-api/spoc/courseDesign';
    const moocServiceName = '/prod-api/spoc/courseDesignMooc';
    const zykServiceName = '/prod-api/spoc/course/design';

    const zykType = 'zyk';
    const moocType = 'mooc';
    const source = {
        "zykType": zykType,
        "moocType": moocType
    };

    let auth = getCookie("Token");
    let hrefParam = getHrefParam();

    // ******************** 插件实现逻辑 *********************
    window.addEventListener('load', async function () {

        showFullScreenLoading(); // 页面加载时显示加载提示
        console.log('正在加载...')

        setTimeout(() => {
            let mainR = document.querySelector('.main .r');
            let changeFlag = 0;

            // 创建 MutationObserver 的回调函数
            const mutationCallback = async (mutationsList, observer) => {
                console.log('DOM has been modified.', mutationsList);
                if (mutationsList.length == 2) {
                    changeFlag = 1;
                    console.log('changeFlag', changeFlag)
                    hrefParam = getHrefParam();
                    jumpHandle(hrefParam);
                }
            };

            // 创建 MutationObserver 实例
            const observer = new MutationObserver(mutationCallback);

            // 配置观察选项
            const config = { childList: true };

            // 开始观察 targetNode
            observer.observe(mainR, config);

            if (!changeFlag) {
                console.log('changeFlag', changeFlag)
                jumpHandle(hrefParam);
            }
        }, 1000);

        console.log('加载完成')
        hideFullScreenLoading(); // 页面加载完成时隐藏加载提示
    });

    function getHrefParam() {

        let hrefParam = {};
        // 使用 URLSearchParams 获取查询参数
        const params = new URLSearchParams(window.location.search);
        hrefParam.courseId = params.get('courseId');
        hrefParam.courseInfoId = params.get('id');
        hrefParam.type = params.get('type');

        // 提取页面的特定部分作为 page 值
        hrefParam.page = window.location.pathname.split('/').pop(); // 获取路径的最后一部分

        // 输出页面信息和类型（如果 type 参数存在）
        console.log('page: ', hrefParam.page, hrefParam.type);

        return hrefParam;
    }

    function jumpHandle(hrefParam) {
        if (hrefParam.page === "spoc_courseDesign") {
            setTimeout(() => {
                spoc_courseDesign(hrefParam.courseId, hrefParam.courseInfoId);
            }, 1000);
        }

        if (hrefParam.page == 'spoc_importCourse') {
            setTimeout(() => {
                spoc_importCourse(hrefParam.type);
            }, 1000);
        }
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false; // 长度不同，直接返回 false

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false; // 对应位置上的元素不同，返回 false
        }

        return true; // 所有元素都相同，返回 true
    }

    // 生成课程设计下载按钮
    function genBtnBiv() {
        let file_down = document.createElement("div");
        file_down.style.color = '#456bea';
        file_down.style.marginRight = '20px';
        file_down.style.cursor = 'pointer';
        file_down.style.order = '-1';
        file_down.className = "file_down_btn";
        file_down.innerText = '下载';
        return file_down;
    }

    // 生成MOOC课程查看按钮
    function genLook() {
        let look = document.createElement("div");
        look.style.color = 'rgb(69, 107, 234)';
        look.style.margin = '0px 20px';
        look.style.cursor = 'pointer';
        look.style.marginLeft = 'auto';
        look.style.order = '1';
        look.className = "look_btn";
        look.innerText = '查看';
        return look;
    }

    // 生成MOOC课程下载按钮
    function genDown() {
        let down = document.createElement("div");
        down.style.color = 'rgb(69, 107, 234)';
        down.style.margin = '0px 20px';

        down.style.cursor = 'pointer';
        down.style.order = '2';
        down.className = "down_btn";
        down.innerText = '下载';
        return down;
    }

    // 获取当前页
    function getCurrentPage() {
        const currentPageElement = document.querySelector('.el-pagination .el-pager li.active');
        if (currentPageElement) {
            const currentPage = parseInt(currentPageElement.textContent, 10);
            console.log('当前页码:', currentPage);
            return currentPage;
        } else {
            console.log('未找到当前页码');
            return 0;
        }
    }


    // 辅助函数：从字符串中提取数字
    function extractNumberFromInput(inputString) {
        // 使用正则表达式匹配数字
        const match = inputString.match(/(\\d+)/);
        if (match) {
            // 提取匹配的第一个组，即数字部分
            const numberPart = match[1];
            // 将字符串转换为数字
            const numberValue = parseInt(numberPart, 10);
            // 检查转换后的值是否为 NaN
            if (!Number.isNaN(numberValue)) {
                return numberValue;
            }
        }
        return null;
    }

    function getPageSize() {
        // 查找 el-input__inner 元素
        const inputInnerElement = document.querySelector('.el-pagination .el-pagination__sizes .el-input__inner');

        // 如果找到了 el-input__inner 子元素
        if (inputInnerElement) {
            // 获取并输出当前输入框的值
            const inputValue = inputInnerElement.value;

            // 提取数字部分
            const pageSize = extractNumberFromInput(inputValue);

            if (pageSize !== null) {
                console.log('提取的数字值:', pageSize);
                return pageSize;
            } else {
                console.log('输入框中的值不是一个有效的数字');
                return 0;
            }
        }
        console.log('未找到 el-input__inner');
        return 0;
    }

    function getFormInputValue() {
        // 选择所有 .el-form-item__content 下的 input 元素
        const inputs = document.querySelectorAll('.el-form-item__content input');

        // 创建一个空数组来存储所有的输入值
        let inputValues = [];

        // 遍历 NodeList 并获取每个 input 的值
        inputs.forEach(function (input) {
            inputValues.push(input.value);
        });

        return inputValues;
    }

    // 保存文件
    function SaveFile(name, url) {
        // 创建一个可写的文件流
        const fileStream = streamSaver.createWriteStream(name);

        // 获取数据
        fetch(url)
            .then(response => {
                const body = response.body;
                // 如果支持 pipeTo 则直接管道到文件流
                if (body.pipeTo) {
                    return body.pipeTo(fileStream).then(() => console.log('done writing'));
                }

                // 否则手动读取并写入
                const writer = fileStream.getWriter();
                const reader = body.getReader();

                function pump() {
                    return reader.read().then(result => {
                        if (result.done) {
                            return writer.close();
                        }
                        return writer.write(result.value).then(pump);
                    });
                }

                pump().catch(err => {
                    console.error('Error saving the file:', err);
                });
            })
            .catch(err => {
                console.error('Failed to fetch the resource:', err);
            });
    }

    // 获取指定cookie值
    function getCookie(cookieName) {
        const strCookie = document.cookie
        const cookieList = strCookie.split(';')

        for (const element of cookieList) {
            const arr = element.split('=')
            if (cookieName === arr[0].trim()) {
                return arr[1]
            }
        }
        return ''
    }

    function isArrayEmpty(array) {
        return !array || array.length === 0;
    }

    function isMapEmpty(map) {
        return !map || map.size === 0;
    }

    function getFileExtension(fileUrl) {
        return !fileUrl ? '' : '.' + fileUrl.split('.').pop();
    }

    // ***********************************资源库课程接口*********************************
    function getZYKModuleListInf(url, courseOpenId, source) {
        // 定义要发送的数据
        const data = {
            "courseOpenId": courseOpenId,
            "source": source
        };

        // 将数据转换为 JSON 字符串
        let jsonData = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": "Bearer " + auth,
                    "Content-Type": "application/json"
                },
                data: jsonData, // 发送 JSON 数据
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        let id = responseData.map(item => item.id);
                        resolve(id);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    async function getZYKCourseList() {
        const inputValues = getFormInputValue();

        const projectName = inputValues[0];
        const title = inputValues[1];
        const courseLeader = inputValues[2];
        const projectType = inputValues[3] == '全部' ? '' : inputValues[3];

        let queryUrl = '/getCourseList?';
        const titleEncoded = encodeURIComponent(title);
        const projectNameEncoded = encodeURIComponent(projectName);
        const courseLeaderEncoded = encodeURIComponent(courseLeader);
        const projectTypeEncoded = encodeURIComponent(projectType);
        const pageNumEncoded = getCurrentPage();
        const pageSizeEncoded = getPageSize();
        // 创建查询字符串
        let queryParam = \`title=${titleEncoded}&projectName=${projectNameEncoded}&courseLeader=${courseLeaderEncoded}&projectType=${projectTypeEncoded}&pageNum=${pageNumEncoded}&pageSize=${pageSizeEncoded}\`;

        let fullQueryUrl = origin + zykServiceName + queryUrl + queryParam;

        try {
            return await getCourseListInf(fullQueryUrl);
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getZYKModuleList(courseOpenId, source = 1) {
        let url = origin + zykServiceName + '/getModuleList';
        try {
            let ids = await getZYKModuleListInf(url, courseOpenId, source);
            return ids;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getZYKTopicList(courseOpenId, moduleId, source = 1) {
        let url = origin + zykServiceName + '/getTopicList';
        try {
            // 定义要发送的数据
            const data = {
                courseOpenId: courseOpenId,
                moduleId: moduleId,
                source: source
            };
            let ids = await getImportCourseTopicListInf(url, data);
            return ids;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getZYKCellList(courseOpenId, topicId, source = 1) {
        let url = origin + zykServiceName + '/getCellList';
        try {
            // 定义要发送的数据
            const data = {
                courseOpenId: courseOpenId,
                topicId: topicId,
                source: source
            };
            let response = await getCellListInf(url, data);
            return response;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    // ***********************************MOOC学院课程接口**********************************
    function getCourseListInf(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    Authorization: "Bearer " + auth,
                },
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        let ids = responseData.rows.map(item => item.id);
                        resolve(ids);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    function getMoocModuleListInf(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": "Bearer " + auth,
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        let courseOpenIds = responseData.map(item => item.id);
                        resolve(courseOpenIds);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    function getImportCourseTopicListInf(url, data) {
        // 将数据转换为 JSON 字符串
        let jsonData = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": "Bearer " + auth,
                    "Content-Type": "application/json"
                },
                data: jsonData, // 发送 JSON 数据
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        let id = responseData.map(item => item.id);
                        resolve(id);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    function getCellListInf(url, data) {
        // 将数据转换为 JSON 字符串
        const jsonData = JSON.stringify(data);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": "Bearer " + auth,
                    "Content-Type": "application/json"
                },
                data: jsonData, // 发送 JSON 数据
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        resolve(responseData);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    async function getMoocCourseList() {
        const inputElementAll = document.querySelectorAll('.el-input__inner');
        // console.log('inputElementAll', inputElementAll)
        const courseName = inputElementAll[0].value;
        const teaName = inputElementAll[1].value;

        let courseDesignServiceName = '/prod-api/spoc/courseDesignMooc';
        let queryUrl = '/getCourseList?';
        let pageNum = getCurrentPage();
        let pageSize = getPageSize();
        let queryParam = 'courseName=' + courseName + '&teaName=' + teaName + '&pageNum=' + pageNum + '&pageSize=' + pageSize;
        let url = origin + courseDesignServiceName + queryUrl + queryParam;
        try {
            let ids = await getCourseListInf(url);
            return ids;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getMoocModuleList(id) {
        let url = origin + moocServiceName + '/getModuleList/' + id;
        try {
            let ids = await getMoocModuleListInf(url);
            return ids;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getMoocTopicList(courseOpenId, moduleId) {
        let url = origin + moocServiceName + '/getTopicList';
        try {
            // 定义要发送的数据
            const data = {
                courseOpenId: courseOpenId,
                moduleId: moduleId
            };
            let ids = await getImportCourseTopicListInf(url, data);
            return ids;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    async function getMoocCellList(courseOpenId, topicId) {
        let url = origin + moocServiceName + '/getCellList';
        try {
            // 定义要发送的数据
            const data = {
                courseOpenId: courseOpenId,
                topicId: topicId
            };
            let response = await getCellListInf(url, data);
            return response;
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    // 获取课程资源ID
    async function getImportCourseCourseList(type) {
        let ids;
        if (type === source.moocType) {
            ids = await getMoocCourseList();
        } else if (type === source.zykType) {
            ids = await getZYKCourseList();
        }
        return ids;
    }

    async function getImportCourseModuleList(type, id) {
        let ids;
        if (type === source.moocType) {
            ids = await getMoocModuleList(id);
        } else if (type === source.zykType) {
            ids = await getZYKModuleList(id);
        }
        return ids;
    }

    async function getImportCourseTopicList(type, courseOpenId, moduleId) {
        let ids;
        if (type === source.moocType) {
            ids = await getMoocTopicList(courseOpenId, moduleId);
        } else if (type === source.zykType) {
            ids = await getZYKTopicList(courseOpenId, moduleId);
        }
        return ids;
    }

    async function getImportCourseCellList(type, courseOpenId, topicId) {
        let response;
        if (type === source.moocType) {
            response = await getMoocCellList(courseOpenId, topicId);
        } else if (type === source.zykType) {
            response = await getZYKCellList(courseOpenId, topicId);
        }
        return response;
    }


    // ***********************************课程设计接口**********************************
    function getParentIds(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    Authorization: "Bearer " + auth,
                },
                onload: function (response) {
                    try {
                        let responseData = JSON.parse(response.responseText);
                        let parentIds = responseData.map(item => item.id);
                        resolve(parentIds);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    function getQueryInf(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    Authorization: "Bearer " + auth,
                },
                onload: function (response) {
                    try {
                        let data = JSON.parse(response.responseText);
                        if (data) {
                            resolve(data);
                        } else {
                            reject(new Error('Invalid response data'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('Request failed'));
                }
            });
        });
    }

    async function getList(courseId, courseInfoId) {
        let queryUrl = '/list?';
        let queryParam = 'courseId=' + courseId + '&courseInfoId=' + courseInfoId;
        let url = origin + courseDesignServiceName + queryUrl + queryParam;
        // designIds
        try {
            let designIds = await getParentIds(url);
            return designIds;
        } catch (error) {
            console.error('Error fetching design IDs:', error);
        }
    }


    async function getTopicList(courseId, courseInfoId, parentId, isPc) {
        let queryUrl = '/topicList?';
        let queryParam = 'courseId=' + courseId + '&courseInfoId=' + courseInfoId + '&parentId=' + parentId + '&isPc=' + isPc;
        let url = origin + courseDesignServiceName + queryUrl + queryParam;
        try {
            let topicIds = await getParentIds(url);
            return topicIds;
        } catch (error) {
            console.error('Error fetching design IDs:', error);
        }
    }

    // 获取文档信息
    async function getCellInfo(id, name) {
        let queryUrl = '/prod-api/spoc/courseDesignCell/getCellInfo';
        let url = origin + queryUrl + '?id=' + id;
        let fileInfo = [];
        try {
            let data = await getQueryInf(url);
            if (data && data.msg) {
                let msg = JSON.parse(data.msg);
                if (msg.fileName) {
                    fileInfo = [msg.fileName, msg.ossOriUrl];
                } else {
                    // msg无fileName信息
                    let fileName = name + getFileExtension(msg.url);
                    fileInfo = [fileName, msg.ossOriUrl];
                }
                console.log('File Info:', fileInfo);
            }
            return fileInfo;
        } catch (error) {
            console.error('Error getting cell info:', error);
        }
    }

    async function getCellList(courseId, courseInfoId, parentId, isPc=1) {
        let queryUrl = '/cellList?';
        let queryParam = 'courseId=' + courseId + '&courseInfoId=' + courseInfoId + '&parentId=' + parentId + '&isPc=' + isPc;
        let url = origin + courseDesignServiceName + queryUrl + queryParam;

        try {
            let data = await getQueryInf(url);
            let fileList = []; // 使用数组来存储键值对

            if (data) {
                // 使用Promise.all来等待所有异步操作完成
                let fileInfos = await Promise.all(data.map(async item => {
                    if (item.fileType === '文件夹') {
                        return null;
                    }
                    let fileInfo = await getCellInfo(item.id, item.name);
                    return fileInfo;
                }));
                const validFileInfos = fileInfos.filter(fileInfo => fileInfo !== null && fileInfo !== undefined);
                // 将有效文件信息添加到数组中
                validFileInfos.forEach(fileInfo => {
                    fileList.push({
                        fileName: fileInfo[0], // 假设fileInfo有key属性
                        ossOriUrl: fileInfo[1] // 假设fileInfo有value属性
                    });
                });

                return fileList;
            }
        } catch (error) {
            console.error('Error fetching cell list:', error);
            return null; // 返回null以便于后续处理
        }
    }

    function isVaildURL(fileUrl) {
        return fileUrl !== null && fileUrl.startsWith("https://file.icve.com.cn");
    }

    // ************************** spoc_importCourse 实现逻辑 *************************
    async function spoc_importCourse(type) {
        try {
            let ids = await getImportCourseCourseList(type);
            if (isArrayEmpty(ids)) return '';
            let tableElement = document.querySelector('.importCourseMain').childNodes[2];
            let operationButtons = tableElement.querySelectorAll('.el-table .el-table__body-wrapper tr td.small-padding .cell');
            // 用于存储所有添加的事件监听器
            let eventListeners = [];
            let changeFlag = 0;
            // 创建 MutationObserver 的回调函数
            const mutationCallback = async (mutationsList, observer) => {
                console.log('DOM has been modified.');
                if ((type == source.moocType && mutationsList.length == 1) || type == source.zykType && mutationsList.length == 2) {
                    const newIds = await getImportCourseCourseList(type);
                    if (!isArrayEmpty(newIds) || !arraysEqual(ids, newIds)) {
                        removeEventListeners();
                        ids = newIds;
                        tableElement = document.querySelector('.importCourseMain').childNodes[2];
                        operationButtons = tableElement.querySelectorAll('.el-table .el-table__body-wrapper tr td.small-padding .cell');
                        changeFlag = 1;
                        console.log('changeFlag', changeFlag)
                        forEachHanld(type, operationButtons, ids, eventListeners);
                    };
                }
            };

            // 创建 MutationObserver 实例
            const observer = new MutationObserver(mutationCallback);

            // 配置观察选项
            const config = { attributes: true };

            // 开始观察 targetNode
            observer.observe(tableElement, config);

            if (!changeFlag) {
                forEachHanld(type,operationButtons, ids, eventListeners);
            }

            // 示例：取消所有已添加的点击事件监听器
            function removeEventListeners() {
                eventListeners.forEach(item => {
                    if (item.node && item.listener) {
                        item.node.removeEventListener('click', item.listener);
                    }
                });
                // 清空 eventListeners 数组，防止重复移除
                eventListeners.splice(0, eventListeners.length);
            }

            // 清理：停止观察
            // observer.disconnect();

        } catch (error) {
            console.error('Error in spoc_importCourse:', error);
        }
    }

    function forEachHanld(type, operationButtons, ids, eventListeners) {
        operationButtons.forEach(async (button, index) => {
            // 添加事件监听器并保存引用
            let listener = async function (event) {
                event.stopPropagation(); // 阻止事件冒泡
                const courseId = ids[index];
                console.log('courseId:', courseId)
                let moduleIds = await getImportCourseModuleList(type, courseId);

                const nts = document.querySelectorAll('.daorukechengjiegoutu .case .nt');

                nts.forEach((nt, moduleIndex) => {
                    let firstLevel = nt.querySelector('.firstLevel');
                    firstLevel.addEventListener('click', async function (event) {
                        event.stopPropagation(); // 阻止事件冒泡
                        let moduleId = moduleIds[moduleIndex];
                        let topicIds = await getImportCourseTopicList(type, courseId, moduleId);

                        const n1s = nt.querySelectorAll('.n1');
                        n1s.forEach((n1, topicIndex) => {

                            let n = n1.querySelector('.n');
                            n.addEventListener('click', async function (event) {
                                event.stopPropagation(); // 阻止事件冒泡
                                let topicId = topicIds[topicIndex];
                                let responseData = await getImportCourseCellList(type, courseId, topicId);

                                const n2s = Array.from(n1.children).slice(1); // 忽略第一个子节点

                                n2s.forEach((n2, index4) => {
                                    const dataItem = responseData[index4];
                                    const n = n2.querySelector('.n');
                                    if (type == source.moocType && dataItem.childNodeList.length) {
                                        const childNodes1 = n.querySelectorAll('.n2');
                                        const childNodes2 = n2.querySelectorAll('.n2');
                                        const childNodes = childNodes1.length != 0 ? childNodes1 : childNodes2;
                                        childNodes.forEach((childNode, childIndex) => {
                                            const childData = dataItem.childNodeList[childIndex];
                                            let fileInfo = moocFileInfoConverter(childData);
                                            addLookAndDownloadButtons(childNode.querySelector('.n'), fileInfo);
                                        });
                                    } else if (type == source.moocType) {
                                            let fileInfo = moocFileInfoConverter(dataItem);
                                            addLookAndDownloadButtons(n, fileInfo);
                                        } else if (type == source.zykType) {
                                            let fileInfo = zykFileInfoConverter(dataItem);
                                            addLookAndDownloadButtons(n, fileInfo);
                                        }
                                })
                            })
                        })
                    })
                })
            }

            // 保存事件监听器
            button.addEventListener('click', listener);
            eventListeners.push({ node: button, listener: listener });
        });
    }

    // mooc文件转换器
    function moocFileInfoConverter(data) {
        let fileInfo = {};
        fileInfo.source = 'mooc';
        fileInfo.fileType = data.categoryName;
        if (isNonLookResourceIncluded(fileInfo.fileType)) {
            fileInfo.fileUrl = null;
        } else if (isVaildURL(data.resourceUrl)) {
            fileInfo.fileUrl = data.resourceUrl;
        } else {
            fileInfo.fileUrl = 'https://file.icve.com.cn/' + data.resourceUrl;
        }
        fileInfo.fileName = data.cellName + getFileExtension(fileInfo.fileUrl);
        fileInfo.cellContent = data.cellContent ? data.cellContent : '';
        return fileInfo;
    }

    // 资源库文件转换器
    function zykFileInfoConverter(data) {
        let fileInfo = {};
        fileInfo.source = 'zyk';
        fileInfo.fileType = data.fileType;
        fileInfo.fileUrl = data.fileUrl;
        fileInfo.fileName = data.title + getFileExtension(data.fileUrl);
        fileInfo.cellContent = data.cellContent ? data.cellContent : '';
        return fileInfo;
    }

    // 添加查看和下载按钮及点击事件
    function addLookAndDownloadButtons(n, fileInfo) {
        let look = n.querySelector('look_btn');
        let down = n.querySelector('down_btn');
        let otherCondition = fileInfo.source == 'mooc' ? true : isVaildURL(fileInfo.fileUrl);
        console.log(fileInfo.source, fileInfo.fileName, fileInfo.fileUrl)

        if (!look && !isNonLookResourceIncluded(fileInfo.fileType) && otherCondition) {
            look = genLook();
            n.append(look);
        }

        if (isCategoryIncluded(fileInfo.fileType) && otherCondition) {
            if (!down) {
                down = genDown();
                n.append(down);
            }
            look.addEventListener('click', async function (event) {
                window.open(fileInfo.fileUrl);
                event.stopPropagation(); // 阻止事件冒泡
            })
            down.addEventListener('click', async function (event) {
                event.stopPropagation(); // 阻止事件冒泡
                SaveFile(fileInfo.fileName, fileInfo.fileUrl);
            })
        }

        if (fileInfo.fileType === '图文') {
            look.addEventListener('click', (event) => {
                event.stopPropagation();
                openNewTabWithHtml(fileInfo.cellContent);
            });
        }
    }

    function isNonLookResourceIncluded(categoryName) {
        let category = ['作业', '在线测试', '主题讨论', '讨论', '在线作业', '章节', '附件作业', '子节点', '测验'];
        return category.includes(categoryName);
    }

    function isCategoryIncluded(categoryName) {
        let mooc_category = ['文档', '视频', '音频', '下载资料', 'office文档', 'ppt文档', 'ppt'];
        let zyk_office = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'rtf', 'txt', 'ppt', 'pptx', 'wps', 'wpt', 'dps'];
        let zyk_vedio = ['mp3', 'mp4'];
        let zyk_picture = ['jpg', 'jpeg', 'png', 'gif', 'tif', 'tiff', 'bmp', 'psd', 'ai', 'eps', 'cdr', 'xd', 'dwg', '3ds'];
        let zyk_zip = ['7z', 'rar', 'tar', 'zip'];

        let mergedArray = [].concat(mooc_category, zyk_office, zyk_vedio, zyk_picture, zyk_zip);

        return mergedArray.includes(categoryName);
    }

    function openNewTabWithHtml(htmlContent) {
        let newWindow = window.open('', '_blank'); // 打开一个新窗口
        newWindow.document.write(htmlContent); // 写入 HTML 内容
        newWindow.document.close(); // 关闭文档流
        return false;
    }


    // ************************** spoc_courseDesign 实现逻辑 *************************
    async function spoc_courseDesign(courseId, courseInfoId) {
        try {
            let designIds = await getList(courseId, courseInfoId);
            let listItems = document.getElementsByClassName("listItem");
            if (!listItems.length || isArrayEmpty(designIds)) return '';

            // 将designIds数组分配给对应的listItems
            Array.from(listItems).forEach((listItem, index2) => {
                listItem.dataset.designIndex = index2.toString(); // 存储索引
            });

            for (let listItem of listItems) {
                listItem.addEventListener('click', async function () {
                    let index2 = parseInt(this.dataset.designIndex, 10);
                    let topicIds = await getTopicList(courseId, courseInfoId, designIds[index2]);
                    let secondLevel = this.getElementsByClassName("items iChild");
                    if (!secondLevel.length || isArrayEmpty(topicIds)) return '';

                    let secondLevelArray = Array.from(secondLevel);
                    secondLevelArray.forEach((iChild, index) => {
                        iChild.addEventListener('click', async function () {
                            let threeLevel = this.parentElement.querySelector(".threeLevel");
                            let fileList = await getCellList(courseId, courseInfoId, topicIds[index]);
                            if (!threeLevel || isMapEmpty(fileList)) return '';
                    
                            addDownloadButtons(threeLevel, fileList);
                        });
                    });
                });
            }
        } catch (error) {
            console.error('Error in getList:', error);
        }
    }

    function addDownloadButtons(container, fileList) {
        const nodes = Array.from(container.children);

        for (let index2 = 0, groundFloorCount = 0, fileIndex = 0; index2 < nodes.length; index2++) {
            const node = nodes[index2];
            const folderClass = node.querySelector('.fwenjianjia');
            if (folderClass) {
                const btnContainers = folderClass.querySelectorAll('.btns');
                const groundFloor = folderClass.querySelector(".groundFloor");

                if (btnContainers.length === 1) {
                    const singleBtnContainer = btnContainers[0];
                    let file_down = singleBtnContainer.querySelector(".file_down_btn");

                    if (!file_down) {
                        file_down = genBtnBiv();
                        singleBtnContainer.appendChild(file_down);
                    }

                    // 添加点击事件监听器
                    file_down.addEventListener('click', () => {
                        const index = index2 + fileIndex - groundFloorCount;
                        SaveFile(fileList[index].fileName, fileList[index].ossOriUrl);
                    });
                } else if (groundFloor) {
                    const btnContainers = groundFloor.querySelectorAll(".btns");

                    [...btnContainers].forEach((btnContainer, index3) => {
                        let file_down = btnContainer.querySelector(".file_down_btn");

                        if (!file_down) {
                            file_down = genBtnBiv();
                            btnContainer.appendChild(file_down);
                        }

                        // 添加点击事件监听器
                        file_down.addEventListener('click', () => {
                            const index = index2 + index3 + groundFloorCount - 1;
                            SaveFile(fileList[index].fileName, fileList[index].ossOriUrl);
                        });
                    });

                    groundFloorCount += 1;
                    fileIndex += btnContainers.length;
                }
            }
        }
    }

    // 全屏加载提示函数
    function showFullScreenLoading() {
        let overlay = document.createElement('div');
        overlay.id = 'fullscreen-loading-overlay';
        overlay.innerHTML = \`
            <div class="el-loading-mask is-fullscreen" style="z-index: 2002;">
                <div class="el-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular">
                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                </div>
            </div>
        \`;

        document.body.appendChild(overlay);
    }

    function hideFullScreenLoading() {
        let overlay = document.getElementById('fullscreen-loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
})(); //(function(){})() 表示该函数立即执行`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
