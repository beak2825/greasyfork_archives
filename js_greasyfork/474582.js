// ==UserScript==
// @name         闲管家自动填写表单(自用)
// @namespace    Take
// @version      1.30
// @description  自动填写设置的默认值，帮助更快的上传商品。
// @match        https://*.goofish.pro/*
// @match        https://*.kongfz.com/*
// @homepage     https://www.aiapply.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474582/%E9%97%B2%E7%AE%A1%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474582/%E9%97%B2%E7%AE%A1%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    console.log('脚本开始执行');
    const oneTouch = document.createElement('button');
    const configIcon = document.createElement('button');
    oneTouch.style.display = "none";
    configIcon.style.display = "none";

    var type = 0 // 0 闲管家 1 孔夫子
    // 判断当前页面的域名是否为指定的域名
    function isDomainAllowed(domain) {
        var currentDomain = window.location.hostname;
        return currentDomain.includes(domain);
    }

    // 在示例中判断当前页面是否为 example.com 域名
    if (isDomainAllowed('kongfz.com')) {
        console.log('孔夫子脚本加载成功！');
        type = 1
    }

    // 显示隐藏闲管家按钮
    var currentURL = window.location.href;
    window.history.pushState = new Proxy(window.history.pushState, {
        apply: function(target, thisArg, args) {
            var url = args[2];
            console.log("URL变化:", url);
            if(url.includes('add')){
                oneTouch.style.display = "block";
                configIcon.style.display = "block";
            }else{
                oneTouch.style.display = "none";
                configIcon.style.display = "none";
            }
            return target.apply(thisArg, args);
        }
    });

    // 孔夫子脚本
    if(type==1){
        // 计算平均价格
        window.addEventListener('load', function() {
            var xpath = '//ul[@class="itemList"]//div[@class="list-con-moneys"]/div/span';
            var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var priceNum = 0
            var priceList = []
            for (var i = 0; i < result.snapshotLength; i++) {
                var element = result.snapshotItem(i);
                priceNum = priceNum + parseFloat(element.textContent);
                priceList.push(parseFloat(element.textContent))
            }
            priceShow(priceList,priceNum)
        });

        // 查找图片大于3的突出显示
        window.addEventListener('load', function() {
            var xpath = '//div[@id="listBox"]//span[@class="img-num"]';
            var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (var i = 0; i < result.snapshotLength; i++) {
                var element = result.snapshotItem(i);
                var imgNum = parseInt(element.textContent);

                if (imgNum > 3) {
                    element.style.background = "#15ff08";
                    element.style.fontSize = "23px";
                    element.style.width = "93%";
                }
            }
        });

        // 计算平均价格
        var open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method, url, async) {
            var xhr = this;

            // 监听 load 事件
            xhr.addEventListener('readystatechange', function() {
                if (url.includes('product_result/?key=')&&!url.includes('ajaxdata=2')&&!url.includes('ajaxdata=3')) {
                    var booksList = JSON.parse(xhr.responseText).data.itemList;
                    var priceNum = 0
                    var priceList = []
                    for (var i = 0; i < booksList.length; i++) {
                        priceList.push(parseFloat(booksList[i].price))
                        priceNum = priceNum + parseFloat(booksList[i].price)
                    }
                    priceShow(priceList,priceNum)

                    var xpath = '//div[@id="listBox"]//span[@class="img-num"]';
                    var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);



                }
            });

            // 调用原始的 open 方法
            open.apply(xhr, arguments);
        };

        function priceShow(priceList,priceNum){
            if(!priceList||priceList.length==0){
                return false
            }
            // 使用 sort 方法进行升序排序
            priceList.sort(function(a, b) {
                return a - b;
            });
            var middleIdx = Math.floor(priceList.length / 2)
            var median = 0
            if (priceList.length % 2 === 0) {
                // 数组长度为偶数
                median = (priceList[middleIdx - 1] + priceList[middleIdx]) / 2;
            } else {
                // 数组长度为奇数
                median = priceList[middleIdx];
            }
            // 创建卡片容器
            var cardContainer = document.createElement('div');
            cardContainer.id = 'card-container';
            document.body.appendChild(cardContainer);

            // 创建卡片内容
            var cardContent = document.createElement('div');
            cardContent.id = 'card-content';
            cardContent.innerHTML = '<p>当前页面价格：</p><p>平均价格：' + (priceNum/priceList.length).toFixed(2) + '</p><p>最低价格：￥'+priceList[0]+'</p><p>中位数：￥'+median+'</p><p>注：以上不含运费</p>';
            cardContainer.appendChild(cardContent);

            // 设置卡片样式
            cardContainer.style.position = 'fixed';
            cardContainer.style.top = '50%';
            cardContainer.style.right = '20px';
            cardContainer.style.transform = 'translateY(-50%)';
            cardContainer.style.width = '200px';
            cardContainer.style.height = '150px';
            cardContainer.style.backgroundColor = '#f1f1f1';
            cardContainer.style.padding = '10px';
            cardContainer.style.borderRadius = '5px';
            cardContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        }

        var imageArray = [];
        var figureInfoBox = document.getElementById('figure-info-box');
        if(figureInfoBox){
            var imageElements = figureInfoBox.getElementsByTagName('img');

            for (var i = 0; i < imageElements.length; i++) {
                var imageUrl = imageElements[i].getAttribute('data-imgurl');
                imageArray.push(imageUrl.replace('_b', ''));
            }
        }

        if(imageArray.length>0){
            name = '下载图片（' + imageArray.length + '张）'
        }else{
            name = '未找到图片'
            //showEleToast('该页面未找到图片，无法进行下载');
        }
        // 创建一键赋值按钮
        const donwimg = document.createElement('button');
        donwimg.textContent = name;
        donwimg.style.position = 'fixed';
        donwimg.style.bottom = '50px';
        donwimg.style.right = '35px';
        donwimg.style.zIndex = '9999';
        donwimg.style.padding = '5px 20px';
        donwimg.style.fontSize = '16px';
        donwimg.style.backgroundColor = '#ffe60f';
        donwimg.style.border = 'none';
        donwimg.style.borderRadius = '50px';
        donwimg.style.cursor = 'pointer';
        donwimg.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        donwimg.addEventListener('click', downloadImagesAsZip);
        document.body.appendChild(donwimg);


        // 创建下载链接并点击触发下载
        function downloadFile(content, filename) {
            var blob = new Blob([content], { type: 'application/zip' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // 下载图片并生成压缩包
        function downloadImagesAsZip() {
            var images = imageArray;
            if (images.length === 0) {
                showEleToast('该页面未找到图片，无法进行下载');
                return;
            }
            showEleToast('正在下载图片...');
            var zip = new JSZip();
            var folder = zip.folder(document.title);

            var fetchPromises = [];

            showEleToast('正在合并为压缩包...');

            function addImageToZip(imageUrl, filename) {
                return fetch(imageUrl)
                    .then(function (response) {
                    return response.blob();
                })
                    .then(function (blob) {
                    folder.file(filename, blob);
                    showEleToast('下载成功');
                })
                    .catch(function (error) {
                    console.error('下载图片失败', error);
                    showEleToast("下载图片失败")
                });
            }

            for (var i = 0; i < images.length; i++) {
                var imageUrl = images[i];
                var filename = 'image' + (i + 1) + '.jpg';
                fetchPromises.push(addImageToZip(imageUrl, filename));
            }

            Promise.all(fetchPromises)
                .then(function () {
                return zip.generateAsync({ type: 'blob' });
            })
                .then(function (content) {
                downloadFile(content, document.title + '.zip');
            })
                .catch(function (error) {
                console.error('生成压缩包失败', error);
                showEleToast("生成压缩包失败")
            });
        }

    }

    // 闲管家
    if(type==0){
        // 从本地存储中获取配置
        let defaultCategory = GM_getValue('defaultCategory', '');
        let defaultStore = GM_getValue('defaultStore', '');
        let defaultTitle = GM_getValue('defaultTitle', '');
        let defaultDescription = GM_getValue('defaultDescription', '');
        let defaultCategories = []
        let defaultStores = []
        let inventoryNum = GM_getValue('inventoryNum', '1');
        let blacklist = GM_getValue('blacklist', '');
        let ok = 0

        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.nodeName === 'TITLE') {
                    //console.log('页面标题变为:', mutation.target.textContent);
                    // 初始化
                    ok = 0
                    setTimeout(function() {
                        if(mutation.target.textContent == '新建商品'&&defaultCategory!=''){
                            fillForm() // 自动执行赋值
                        }
                    },3000)
                }
            }
        });

        observer.observe(document.querySelector('title'), { childList: true, subtree: true });

        // 获取页面的分类、店铺数据
        function getCategories(){
            defaultCategories = []
            defaultStores = []


            // 获取包含所有分类
            const elementDiv = document.querySelectorAll('div.release-history');
            console.log(elementDiv)
            if(elementDiv){
                // 获取所有的<span>元素
                //const spanElements = element.querySelectorAll('span.color-blue');
                // 遍历每个<span>元素，获取文本内容并添加到数组中
                elementDiv.forEach(div => {
                    const text = div.textContent.trim();
                    if(text!='上传方式' && text!='仓储管理'){
                        defaultCategories.push(text.replace("、", ""));
                    }
                });
                console.log(defaultCategories)
            }else{
                defaultCategories = ["请先添加商品后，才能读取到历史类别"]
            }


            var parentElement = document.querySelector('.auth-list'); // 使用class选择器选取父元素
            var liElements = parentElement.querySelectorAll('li');
            liElements.forEach(function(li) {
                var text = li.textContent.trim(); // 提取文本内容并去除首尾空格
                if(text!='创建闲鱼店铺'){
                    defaultStores.push(text);
                }

            });
            console.log(defaultStores)
            updateConfigPopupOptions()
        }

        // 创建一键赋值按钮
        oneTouch.textContent = '一键赋值';
        oneTouch.style.position = 'fixed';
        oneTouch.style.bottom = '180px';
        oneTouch.style.right = '50px';
        oneTouch.style.zIndex = '9999';
        oneTouch.style.padding = '10px 20px';
        oneTouch.style.fontSize = '16px';
        oneTouch.style.backgroundColor = '#ffe60f';
        oneTouch.style.border = 'none';
        oneTouch.style.borderRadius = '50px';
        oneTouch.style.cursor = 'pointer';
        oneTouch.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        oneTouch.addEventListener('click', fillForm);
        document.body.appendChild(oneTouch);

        // 创建配置按钮
        configIcon.textContent = '设置';
        configIcon.style.position = 'fixed';
        configIcon.style.bottom = '130px';
        configIcon.style.right = '50px';
        configIcon.style.zIndex = '9999';
        configIcon.style.padding = '10px 35px';
        configIcon.style.fontSize = '16px';
        configIcon.style.border = 'none';
        configIcon.style.borderRadius = '50px';
        configIcon.style.cursor = 'pointer';
        configIcon.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        configIcon.addEventListener('click', openConfigPopup);
        document.body.appendChild(configIcon);

        // 创建配置弹窗的 HTML 代码
        const configPopupHTML = `
    <div id="configPopup" style="
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        width: 550px;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    ">
    <h3 style="margin:10px 0;margin-top: 0;">脚本设置</h3>
    <div class='config' style="
        height: 500px;
	overflow-y: scroll;
    ">

        <div style="margin-bottom: 15px; line-height: 20px;">Tip：已默认开启自动一键赋值，下拉可配置黑名单。</div>
        <form style="height: 100%;">
            <label style=" display: block;">
                <span style="font-weight: bold;">选中类别：</span>
                <select id="categoryInput" style="width: 100%;" style='margin-top: 10px;'>
                    ${renderOptions(defaultCategories, defaultCategory)}
                </select>
            </label>
            <label style="margin: 10px 0; display: block;">
                <span style="font-weight: bold;">选中店铺：</span>
                <select id="storeInput" style="width: 100%;"placeholder="请选择默认店铺">
                    ${renderOptions(defaultStores, defaultStore)}
                </select>
            </label>
            <label style="margin: 10px 0; display: block;">
                <span style="font-weight: bold;">标题前缀：</span>
                <input id="titleInput" type="text" style="width: 100%;"placeholder="请输入标题开头" style='margin-top: 10px;'>
            </label>
            <label style="margin: 10px 0; display: block;">
                <span style="font-weight: bold;display: block;">商品描述：</span>
                <textarea id="descriptionInput" rows="8" cols="50"placeholder="请输入默认描述" style='margin-top: 10px;' maxlength="-1"></textarea>
            </label>
            <label style="margin: 10px 0; display: block;">
                <span style="font-weight: bold;">设置库存：</span>
                <input id="inventoryInput" type="text" style="width: 100%;"placeholder="设置库存，默认：1" style='margin-top: 10px;'>
            </label>
             <label style="margin: 10px 0; display: block;">
                <span style="font-weight: bold;display: block;">黑名单：</span>
                <textarea id="blacklistInput" maxlength="-1" rows="8" cols="50"placeholder="禁书过滤（一行一个，可以是书名、作者名称）设置后，包含该关键词的书将会提醒您" style='margin-top: 10px;'></textarea>
            </label>
            </div>
            <div style="text-align: right;margin-top: 30px;">
            <div  id="cancelConfigButton" style="padding: 10px 50px;
    display: inline-block;
    border-radius: 50px;
    border: 1px solid #ffe60f;
    margin-right: 10px;">取消</div>
                <div id="saveConfigButton" style="padding: 10px 50px;
    display: inline-block;
    background-color: #ffe60f;

    border-radius: 50px;">保存</div>

            </div>
        </form>
    </div>`;

        // 辅助函数：根据数组渲染下拉选择器选项
        function renderOptions(options, selectedValue) {
            return options
                .map(option => `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`)
                .join('');
        }

        // 更新配置弹窗中的选项
        function updateConfigPopupOptions() {
            const categoryInput = document.getElementById('categoryInput');
            const storeInput = document.getElementById('storeInput');
            const updatedCategoryOptions = renderOptions(defaultCategories, defaultCategory);
            const updatedStoreOptions = renderOptions(defaultStores, defaultStore);
            categoryInput.innerHTML = updatedCategoryOptions;
            storeInput.innerHTML = updatedStoreOptions;
        }

        // 插入配置弹窗到页面中
        document.body.insertAdjacentHTML('beforeend', configPopupHTML);

        // 获取配置弹窗元素
        const configPopup = document.getElementById('configPopup');

        // 创建配置按钮点击事件处理函数
        function openConfigPopup() {
            getCategories()

            configPopup.style.display = 'block';
            // 创建一键赋值按钮点击事件处理函数

            const titleInput = document.getElementById('titleInput');
            const descriptionInput = document.getElementById('descriptionInput');
            const inventoryInput = document.getElementById('inventoryInput');
            const blacklistInput = document.getElementById('blacklistInput');

            // 填充表单字段

            titleInput.value = defaultTitle;
            descriptionInput.value = defaultDescription;
            inventoryInput.value = inventoryNum;
            blacklistInput.value = blacklist;
        }

        // 创建保存配置按钮点击事件处理函数
        function saveConfig() {
            const categoryInput = document.getElementById('categoryInput');
            const storeInput = document.getElementById('storeInput');
            const titleInput = document.getElementById('titleInput');
            const descriptionInput = document.getElementById('descriptionInput');
            const inventoryInput = document.getElementById('inventoryInput');
            const blacklistInput = document.getElementById('blacklistInput');

            // 将配置保存到本地存储
            defaultCategory = categoryInput.value
            defaultStore = storeInput.value
            defaultTitle = titleInput.value
            defaultDescription = descriptionInput.value
            inventoryNum = inventoryInput.value
            blacklist = blacklistInput.value
            GM_setValue('defaultCategory', categoryInput.value);
            GM_setValue('defaultStore', storeInput.value);
            GM_setValue('defaultTitle', titleInput.value);
            GM_setValue('defaultDescription', descriptionInput.value);
            GM_setValue('inventoryNum', inventoryInput.value);
            GM_setValue('blacklist', blacklistInput.value);

            // 提示保存成功，并关闭配置弹窗
            showEleToast("保存成功")
            closeConfigPopup();
        }

        // 创建取消配置按钮点击事件处理函数
        function closeConfigPopup() {

            configPopup.style.display = 'none';
        }


        // 监听保存配置按钮点击事件
        const saveConfigButton = document.getElementById('saveConfigButton');
        saveConfigButton.addEventListener('click', saveConfig);

        // 监听取消配置按钮点击事件
        const cancelConfigButton = document.getElementById('cancelConfigButton');
        cancelConfigButton.addEventListener('click', closeConfigPopup);

        // 黑名单查询
        function BlacklistDetection(title,author){
            if(blacklist==''){
                return false
            }
            // 黑名单数组
            var blacklist2 = blacklist.split('\n');
            // 过滤空格 空行
            blacklist2 = blacklist2.filter(function(item) {
                return item.trim() !== "";
            });

            // 循环遍历黑名单数组
            for (var i = 0; i < blacklist2.length; i++) {
                // 检测标题是否包含黑名单中的字符串
                if (title.includes(blacklist2[i]) || author.includes(blacklist2[i])) {
                    console.log("触发黑名单:",blacklist2[i]);
                    showEleToast("触发黑名单:" + blacklist2[i],6000)
                    return true
                    break; // 匹配到黑名单中的数据，停止循环
                }
            }

            return false
        }

        // 更新商品标题
        function updateProductTitle(isbnInput,titleInput,publisherInput,authorInput) {
            var isbn = isbnInput.value || '';
            var title = titleInput.value || '';
            var publisher = publisherInput.value || '';
            var author = authorInput.value || '';
//publisher
            var productTitle = defaultTitle + ' ' + title + ' ' + author.replace(/[^\u4E00-\u9FA5]/g, '').replace(/\s/g, '').replace('著', '').replace('主编', '') + isbn;

            // 填写商品标题
            var newtitle = document.querySelector('input[placeholder="请输入商品标题，最多允许输入30个汉字"]');
            if (newtitle) {
                console.log('找到商品标题输入框',productTitle);
                newtitle.value = productTitle;
                triggerInputEvent(newtitle);
            } else {
                console.log('未找到商品标题输入框');
                 showEleToast('未找到商品标题输入框')
            }

            // 禁书检测
            if(BlacklistDetection(title,author)){
                showWarningPopup()
            }

        }

        // 填写商品标题和商品描述
        function fillForm() {

            getCategories()
            var genreElements = document.querySelectorAll('div.release-history');
            console.log(genreElements)
            for (var i = 0; i < genreElements.length; i++) {
                var genreElement = genreElements[i];
                var genreTitle = genreElement.textContent.trim();
                if (genreTitle.includes(defaultCategory)) {

                    if(ok==0){
                        genreElement.click();
                        console.log('成功点击"' + defaultCategory + '"');
                    }else{
                        console.log('已选择分类，跳过点击')
                    }


                    // 延迟执行
                    setTimeout(function() {

                        if(ok==0){
                            // 选择店铺
                            var storeElements = document.querySelectorAll('.auth-list li:not(.sku-add-btn)');

                            for (var ii = 0; i < storeElements.length; ii++) {
                                var storeElement = storeElements[ii];
                                var storeTitle = storeElement.querySelector('.auth-left p').textContent.trim();

                                if (storeTitle == defaultStore) {

                                    storeElement.click();
                                    console.log('成功点击"' + defaultStore + '"');
                                    ok=1
                                    break;
                                }
                            }
                        }else{
                            console.log('已选择店铺，跳过点击')
                        }


                        // 延迟执行
                        setTimeout(function() {

                            // 监听输入框的值变化并更新商品标题
                            var isbnInput = document.querySelector('input[placeholder="请输入ISBN编码"]');
                            var titleInput = document.querySelector('input[placeholder="请输入书名"]');
                            var publisherInput = document.querySelector('input[placeholder="请输入出版社"]');
                            var authorInput = document.querySelector('input[placeholder="请输入作者"]');
                            const button = document.querySelector('.el-button.w-90.mgl-8.color-black.el-button--primary');

                            button.addEventListener('click', function() {
                                console.log('查询按钮被点击了');
                                setTimeout(function() {
                                    isbnInput.value = isbnInput.value;
                                    triggerInputEvent(isbnInput);
                                    updateProductTitle(isbnInput,titleInput,publisherInput,authorInput)
                                }, 300);
                            });
                            updateProductTitle(isbnInput,titleInput,publisherInput,authorInput)
                            if (isbnInput && titleInput && publisherInput && authorInput) {
                                
                                titleInput.addEventListener('input', function() {
                                    updateProductTitle(isbnInput,titleInput,publisherInput,authorInput);
                                });
                                publisherInput.addEventListener('input', function() {
                                    updateProductTitle(isbnInput,titleInput,publisherInput,authorInput);
                                });
                                authorInput.addEventListener('input', function() {
                                    updateProductTitle(isbnInput,titleInput,publisherInput,authorInput);
                                });
                            }

                            // 填写商品描述
                            var descriptionTextarea = document.querySelector('textarea[placeholder="请输入商品描述"]');
                            if (descriptionTextarea) {
                                console.log('找到商品描述输入框');
                                descriptionTextarea.value = defaultDescription;
                                triggerInputEvent(descriptionTextarea);
                            } else {
                                console.log('未找到商品描述输入框');
                                showEleToast('未找到商品描述输入框')
                            }

                            var stockLabel = document.querySelector('label[for="stock"]');
                            if (stockLabel) {
                                var stockInput = stockLabel.nextElementSibling.querySelector('input');
                                if (stockInput) {
                                    stockInput.value = inventoryNum;
                                    stockInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    console.log('设置库存成功');
                                } else {
                                    console.log('未找到库存输入框2');
                                    showEleToast('未找到库存输入框2');
                                }
                            } else {
                                console.log('未找到库存输入框');
                                showEleToast('未找到库存输入框');
                            }

                            // 获取立即发布按钮的元素
                            const publishButton = document.querySelectorAll('label.el-radio');
                            if (publishButton[5]) {
                                // 模拟点击立即发布按钮
                                console.log('选中立即发布',publishButton);
                                publishButton[5].click();

                            } else {
                                console.log('未找到立即发布按钮');
                                showEleToast('未找到立即发布按钮')
                            }

                            showEleToast('一键赋值成功')
                        }, 100); // 延迟1秒执行填写操作

                    }, 100); // 延迟1秒执行填写操作



                    return;
                }
            }


        }



        GM_addStyle(`
    .modal {
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
      position: relative;
      background-color: #fff;
      border-radius: 6px;
      padding: 30px;
      margin: 20% auto;
      max-width: 400px;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }

    .modal-title {
      margin-top: 0;
    }

    .modal-message {
      margin: 20px 0;
    }

    .modal-button {
      background-color: red;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
  `);

        // 定义函数显示警告弹窗提示
        function showWarningPopup() {

            // 创建弹窗元素
            var modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3 class="modal-title">禁书提示</h3>
        <p class="modal-message">该书疑是禁书，请自行核验是否还要继续上架！！！</p>
        <button class="modal-button">我已了解</button>
      </div>
    `;


            // 找到页面的 body 元素
            var body = document.querySelector('body');

            // 将弹窗添加到 body 元素中
            body.appendChild(modal);

            // 查找所有的模态框元素
            var modals = document.querySelectorAll('.modal');

            // 遍历每个模态框元素
            modals.forEach(function(modal) {
                // 找到当前模态框中的关闭按钮和"我已了解"按钮
                var closeButton = modal.querySelector('.close');
                var acknowledgeButton = modal.querySelector('.modal-button');

                // 绑定关闭按钮和"我已了解"按钮的点击事件
                closeButton.addEventListener('click', closeModal);
                acknowledgeButton.addEventListener('click', closeModal);
            });

            // 关闭弹窗
            function closeModal() {
                // 找到当前点击按钮所在的模态框
                var modal = this.closest('.modal');
                if (modal) {
                    // 从父元素中移除模态框
                    modal.parentNode.removeChild(modal);
                }
            }

        }

        // 触发输入事件，以便网页响应
        function triggerInputEvent(element) {
            var inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(inputEvent);
        }
    }

    // 以下为公共
    GM_addStyle(`
    .ele-toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      top: 30%;
      z-index: 9999;
      padding: 10px 20px;
      background-color: rgb(0 0 0 / 85%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
      border-radius: 4px;
      font-size: 15px;
      color: #fff;
    }
    #configPopup textarea,#configPopup select,#configPopup input{
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      padding: 10px;
    margin: 10px 0;
    }
    .config::-webkit-scrollbar { width: 0 !important }
  `);

    // 定义函数显示提示
    function showEleToast(message, duration = 3000) {
        console.log(message)
        var toast = document.createElement('div');
        toast.className = 'ele-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
})();
