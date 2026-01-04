// ==UserScript==
// @name         Amazon 获取数据
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Amazon
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js
// @downloadURL https://update.greasyfork.org/scripts/518282/Amazon%20%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/518282/Amazon%20%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
/* global ExcelJS */
GM_registerMenuCommand('打开Amazon Data Fetcher', () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '5%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, 0)';
    container.style.width = '95vw';
    container.style.height = '88vh';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.backgroundColor = 'rgba(250, 250, 250, 0.8)';
    container.style.border = '1px solid #ddd';
    container.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '10000';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '15px';

    // 右侧容器 (包含关闭按钮、输入框、执行按钮、输出框和复选框)
    const rightContainer = document.createElement('div');
    rightContainer.style.display = 'flex';
    rightContainer.style.flexDirection = 'column';
    rightContainer.style.width = '320px';
    rightContainer.style.padding = '20px';
    rightContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    rightContainer.style.borderLeft = '1px solid #ddd';

    // 关闭按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginBottom = '15px';

    const closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '8px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#e74c3c';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    closeButton.style.transition = 'background-color 0.3s, transform 0.3s';

    closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = '#c0392b';
        closeButton.style.transform = 'scale(1.05)';
    });

    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = '#e74c3c';
        closeButton.style.transform = 'scale(1)';
    });

    buttonContainer.appendChild(closeButton);
    rightContainer.appendChild(buttonContainer);

    // 输入和输出容器
    const inputOutputContainer = document.createElement('div');
    inputOutputContainer.style.display = 'flex';
    inputOutputContainer.style.flexDirection = 'column';
    inputOutputContainer.style.gap = '15px';
    inputOutputContainer.style.flex = '1';

    // 输入框
    const textarea1 = document.createElement('textarea');
    textarea1.style.height = '150px';
    textarea1.style.padding = '15px';
    textarea1.style.border = '1px solid #ccc';
    textarea1.style.borderRadius = '8px';
    textarea1.style.fontSize = '14px';
    textarea1.placeholder = '输入数据1，每行一个ASIN';
    textarea1.style.resize = 'none';
    textarea1.style.outline = 'none';
    textarea1.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';

    // 输出框
    const textarea2 = document.createElement('textarea');
    textarea2.style.height = '150px';
    textarea2.style.padding = '15px';
    textarea2.style.border = '1px solid #ccc';
    textarea2.style.borderRadius = '8px';
    textarea2.style.fontSize = '14px';
    textarea2.placeholder = '输出数据';
    textarea2.style.resize = 'none';
    textarea2.style.outline = 'none';
    textarea2.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';

    inputOutputContainer.appendChild(textarea1);
    inputOutputContainer.appendChild(textarea2);
    var pdqd = true
    // 复选框容器
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '10px';
    checkboxContainer.style.display = 'grid';
    checkboxContainer.style.gridTemplateColumns = '1fr 1fr'; // 分为两列
    checkboxContainer.style.gap = '10px';

    // 复选框配置
    const createCheckbox = (id, labelText, checked = true) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        // 上下居中对齐

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.id = id;
        checkbox.addEventListener('change', () => {
            pdqd = false
        });
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerText = labelText;
        label.style.marginLeft = '8px';
        label.style.color = '#333';

        container.appendChild(checkbox);
        container.appendChild(label);

        return container;
    };
    checkboxContainer.appendChild(createCheckbox('asinCheckbox', '导出 ASIN'));
    checkboxContainer.appendChild(createCheckbox('hiresCheckbox', '导出 主图链接'));
    checkboxContainer.appendChild(createCheckbox('titleCheckbox', '导出 标题'));
    checkboxContainer.appendChild(createCheckbox('starCheckbox', '导出 星级'));
    checkboxContainer.appendChild(createCheckbox('reviewCheckbox', '导出 评论数'));
    checkboxContainer.appendChild(createCheckbox('cDateCheckbox', '导出 创建日期'));
    checkboxContainer.appendChild(createCheckbox('rankingsCheckbox', '导出 排行榜'));
    checkboxContainer.appendChild(createCheckbox('exportImageCheckbox', '导出 图片'));
    inputOutputContainer.appendChild(checkboxContainer);

    // 执行按钮
    const executeButton = document.createElement('button');
    executeButton.innerText = '执行';
    executeButton.style.padding = '10px 20px';
    executeButton.style.marginTop = '10px';
    executeButton.style.borderRadius = '8px';
    executeButton.style.border = 'none';
    executeButton.style.backgroundColor = '#27ae60';
    executeButton.style.color = '#fff';
    executeButton.style.cursor = 'pointer';
    executeButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    executeButton.style.transition = 'background-color 0.3s, transform 0.3s';

    executeButton.addEventListener('mouseover', () => {
        executeButton.style.backgroundColor = '#2ecc71';
        executeButton.style.transform = 'scale(1.05)';
    });

    executeButton.addEventListener('mouseleave', () => {
        executeButton.style.backgroundColor = '#27ae60';
        executeButton.style.transform = 'scale(1)';
    });

    inputOutputContainer.appendChild(executeButton);

    // 导出按钮
    const exportButton = document.createElement('button');
    exportButton.innerText = '导出 Excel';
    exportButton.style.padding = '10px 20px';
    exportButton.style.marginTop = '2px';
    exportButton.style.borderRadius = '8px';
    exportButton.style.border = 'none';
    exportButton.style.backgroundColor = '#3498db';
    exportButton.style.color = '#fff';
    exportButton.style.cursor = 'pointer';
    exportButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    exportButton.style.transition = 'background-color 0.3s, transform 0.3s';

    exportButton.addEventListener('mouseover', () => {
        exportButton.style.backgroundColor = '#2980b9';
        exportButton.style.transform = 'scale(1.05)';
    });

    exportButton.addEventListener('mouseleave', () => {
        exportButton.style.backgroundColor = '#3498db';
        exportButton.style.transform = 'scale(1)';
    });

    inputOutputContainer.appendChild(exportButton);
    rightContainer.appendChild(inputOutputContainer);

    // 加载中指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerText = '加载中...';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // 透明度加大
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.padding = '25px';
    loadingIndicator.style.borderRadius = '15px';
    loadingIndicator.style.fontSize = '20px';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.zIndex = '10001';
    loadingIndicator.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(loadingIndicator);

    // 网格预览容器 (左侧)
    const previewContainer = document.createElement('div');
    previewContainer.style.flex = '1';
    previewContainer.style.display = 'grid';
    previewContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    previewContainer.style.gridGap = '20px';
    previewContainer.style.overflowY = 'auto';
    previewContainer.style.padding = '20px';
    previewContainer.style.backgroundColor = 'rgba(245, 245, 245, 0.)'; // 增加透明度
    previewContainer.style.borderRadius = '0 0 20px 20px';


    container.appendChild(previewContainer);
    container.appendChild(rightContainer);
    document.body.appendChild(container);

    let resultData = [];

    // 执行按钮点击事件
    executeButton.addEventListener('click', async () => {
        pdqd = true
        textarea1.value = textarea1.value.toUpperCase()
        const inputLines = textarea1.value.split('\n').map(line => line.trim()).filter(line => line);
        previewContainer.innerHTML = '';
        textarea2.value = '';
        resultData = []; // 清空之前的数据

        // 显示加载中指示器
        loadingIndicator.style.display = 'block';

        const fetchPromises = inputLines.map(asin =>
                                             fetch(`https://www.amazon.com/dp/${asin}?th=1`)
                                             .then(response => response.text())
                                             .then(html => ({ asin, html }))
                                             .catch(error => {
            console.error('Error:', error);
            return { asin, html: null };
        })
                                            );

        const htmlResults = await Promise.all(fetchPromises);

        // 隐藏加载中指示器
        loadingIndicator.style.display = 'none';

        // 生成标题行
        let headers = [];
        if (document.getElementById('asinCheckbox').checked) headers.push('主体ASIN');
        if (document.getElementById('asinCheckbox').checked) headers.push('当前ASIN');
        if (document.getElementById('hiresCheckbox').checked) headers.push('主图链接');
        if (document.getElementById('titleCheckbox').checked) headers.push('标题');
        if (document.getElementById('starCheckbox').checked) headers.push('星级');
        if (document.getElementById('reviewCheckbox').checked) headers.push('评论数');
        if (document.getElementById('cDateCheckbox').checked) headers.push('创建日期');
        if (document.getElementById('rankingsCheckbox').checked) headers.push('一级类目');
        if (document.getElementById('rankingsCheckbox').checked) headers.push('二级类目');
        resultData.push(headers); // 将标题行添加到结果数据中

        htmlResults.forEach(result => {
            const { asin, html } = result;
            if (html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const mainAsinValue = doc.querySelector('link[rel="canonical"]').href.match(/\/dp\/([A-Z0-9]{10})/)[1]

                const landingImageElement = doc.querySelector('.imgTagWrapper img');
                const dataOldHiresValue = landingImageElement ? landingImageElement.getAttribute("data-old-hires") : '无法找到data-old-hires值';
                const productTitle = doc.querySelector('span#productTitle') ? doc.querySelector('span#productTitle').innerText.trim() : '无标题';

                let outputLine = [];
                if (document.getElementById('asinCheckbox').checked) outputLine.push(mainAsinValue);
                if (document.getElementById('asinCheckbox').checked) outputLine.push(asin);
                if (document.getElementById('hiresCheckbox').checked) outputLine.push(dataOldHiresValue.replace(/\._[^.]+/, ""));
                if (document.getElementById('titleCheckbox').checked) outputLine.push(productTitle);

                // 创建网格项
                const gridItem = document.createElement('div');
                gridItem.style.display = 'flex';
                gridItem.style.flexDirection = 'column';
                gridItem.style.alignItems = 'center';
                gridItem.style.border = '1px solid #ccc';
                gridItem.style.borderRadius = '15px';
                gridItem.style.padding = '15px';
                gridItem.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                gridItem.style.backgroundColor = '#ffffff';
                gridItem.style.maxHeight = '400px';

                // ASIN 显示在图片下方
                const asinLink = document.createElement('a');
                asinLink.innerText = asin;
                asinLink.target = '_blank';
                asinLink.style.cursor = 'pointer';
                asinLink.style.color = '#0073e6';
                asinLink.style.textDecoration = 'underline';
                asinLink.href = `https://www.amazon.com/dp/${asin}`;
                asinLink.style.marginBottom = '10px';
                asinLink.style.fontSize = '16px';
                asinLink.style.fontWeight = 'bold';

                gridItem.appendChild(asinLink);

                const alinkaisn = document.createElement('a');
                alinkaisn.href = `https://www.amazon.com/dp/${asin}`; // 替换为目标链接
                alinkaisn.target = '_blank';
                // 图片
                const img = document.createElement('img');
                img.src = dataOldHiresValue;
                img.style.height = '180px';
                img.style.width = '100%';
                img.style.objectFit = 'contain';
                img.style.borderRadius = '8px';
                img.style.transition = 'transform 0.3s ease';

                img.addEventListener('mouseover', () => {
                    img.style.transform = 'scale(1.05)';
                });

                img.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
                alinkaisn.appendChild(img);
                gridItem.appendChild(alinkaisn);

                // 商品标题显示在 ASIN 下方
                const titleElement = document.createElement('div');
                titleElement.innerText = productTitle;
                titleElement.style.marginTop = '8px';
                titleElement.style.fontSize = '14px';
                titleElement.style.color = '#333';
                titleElement.style.textAlign = 'center';
                titleElement.style.display = '-webkit-box';
                titleElement.style.webkitLineClamp = '3';
                titleElement.style.webkitBoxOrient = 'vertical';
                titleElement.style.height = '3.6em';
                titleElement.style.lineHeight = '1.2em';
                titleElement.style.overflow = 'hidden';
                titleElement.style.textOverflow = 'ellipsis';

                gridItem.appendChild(titleElement);

                let averageCustomerReviews = doc.querySelector('[id^="averageCustomerReviews"]')
;

                // 创建一个包含 5 个星星的容器元素
                const starContainer = document.createElement('div');
                starContainer.style.display = 'flex';
                starContainer.style.alignItems = 'center';

                // 如果评分元素存在，则读取评分值和评分数量
                let rating, reviewCountText;
                if (averageCustomerReviews) {
                    // 获取评分并转换为数字
                    let ratingText = averageCustomerReviews?.querySelector('.a-size-small.a-color-base').textContent.trim();
                    rating = parseFloat(ratingText);

                    // 获取评分数量文本
                    reviewCountText = averageCustomerReviews?.querySelector('#acrCustomerReviewText').textContent.trim();
                } else {
                    // 如果不存在，设为默认值：评分为 0，评分数量为 '0 ratings'
                    rating = 0;
                    reviewCountText = '0 ratings';
                }
                if (document.getElementById('starCheckbox').checked) outputLine.push(rating);
                if (document.getElementById('reviewCheckbox').checked) outputLine.push(+reviewCountText.replace(/ratings|,/g, "").trim());
                // 循环创建 5 个星星
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.style.fontSize = '11px'; // 设置星星大小
                    star.style.color = 'lightgray'; // 设置默认颜色为灰色
                    star.innerHTML = '★'; // 使用 Unicode 星星符号

                    // 根据评分将星星点亮
                    if (i <= Math.floor(rating)) {
                        star.style.color = 'rgba(222, 121, 33, 1)'; // 完整星星填充金色
                    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                        // 处理部分星星情况，例如 4.5，部分星星需要部分填充
                        star.style.background = `linear-gradient(90deg, rgba(222, 121, 33, 1) ${rating % 1 * 100}%, lightgray ${rating % 1 * 100}%)`;
                        star.style.webkitBackgroundClip = 'text';
                        star.style.color = 'transparent';
                    }

                    // 添加星星到容器
                    starContainer.appendChild(star);
                }
                // 创建显示评分数量的文本元素
                const reviewCountElement = document.createElement('span');
                reviewCountElement.style.fontSize = '10px';

                reviewCountElement.textContent = rating +"星," + reviewCountText.replace("ratings", "评论 ");


                // 将评分数量文本添加到星星容器的右侧
                starContainer.appendChild(reviewCountElement);
                // 添加星星容器到 gridItem
                gridItem.appendChild(starContainer);

                // 排行榜到 gridItem
                let cDateVelue = ""
                const detailsContainer = doc.querySelector("#detailBulletsWrapper_feature_div");
                if (detailsContainer) {
                    // 创建日期
                    const dateFirstAvailableElement = Array.from(detailsContainer.querySelectorAll("li span"))
                    .find(item => item.textContent.includes("Date First Available")).querySelector("span:not(.a-text-bold)");
                    if (dateFirstAvailableElement) {
                        cDateVelue = dateFirstAvailableElement.textContent.trim()
                        const ddate = new Date(cDateVelue);
                        const formattedDateString = `${ddate.getFullYear()}-${ddate.getMonth() + 1}-${ddate.getDate()}`;
                        if (document.getElementById('cDateCheckbox').checked) outputLine.push(formattedDateString);
                    }
                    // 排行榜
                    const bestSellersRankElement = Array.from(detailsContainer.querySelectorAll("li"))
                    .find(item => item.textContent.includes("Best Sellers Rank"));
                    if (bestSellersRankElement) {
                        const rankingItems = bestSellersRankElement.querySelectorAll("a");
                        const rankingText = bestSellersRankElement.textContent.trim().match(/#[^#]*/g);
                        if (rankingItems.length > 0) {
                            rankingItems.forEach((rankingItem, index) => {

                                const linkElement = document.createElement('a');
                                linkElement.href = rankingItem;
                                linkElement.target = '_blank';
                                linkElement.textContent = rankingText[index].replace(/\(.*?\)/g, '').trim();
                                if (document.getElementById('rankingsCheckbox').checked) outputLine.push(rankingText[index].replace(/\(.*?\)/g, '').trim());
                                linkElement.style.display = 'block';
                                linkElement.style.fontSize = '12px';
                                linkElement.style.color = '#0066c0';
                                linkElement.style.textAlign = 'center';

                                gridItem.appendChild(linkElement);

                            });
                        }
                    }
                }
                const prodDetails = doc.querySelector("#prodDetails");
                if (prodDetails) {
                    const rows = prodDetails.querySelectorAll("tr");
                    // 将 rows 转换为数组
                    const rowsArray = Array.from(rows); // 或者使用 [...rows]

                    // 按首字母排序
                    rowsArray.sort((a, b) => {
                        const textA = a.querySelector("th")?.innerText.trim().toUpperCase() || "";
                        const textB = b.querySelector("th")?.innerText.trim().toUpperCase() || "";
                        return textA.localeCompare(textB);
                    });

                    // 按首字母排序后的 rowsArray 处理逻辑
                    rowsArray.forEach((row) => {
                        let th = row.querySelector("th");
                        // 创建日期
                        if (th && th.innerText.includes("Date First Available")) {
                            let td = row.querySelector("td");
                            if (td) {
                                cDateVelue = td.textContent.trim()
                                const ddate = new Date(cDateVelue);
                                const formattedDateString = `${ddate.getFullYear()}年${ddate.getMonth() + 1}月${ddate.getDate()}日`;
                                if (document.getElementById('cDateCheckbox').checked){outputLine.push(formattedDateString)}
                            }
                        }
                        // 排行榜
                        if (th && th.innerText.includes("Best Sellers Rank")) {
                            let td = row.querySelector("td span");
                            if (td) {
                                const spans = td.querySelectorAll("span");
                                spans.forEach((span) => {
                                    // 获取每个 <span> 中的文本部分
                                    let rankingText = span.textContent.trim();
                                    const link = span.querySelector('a');
                                    if (link) {
                                        const href = link.href;
                                        const combinedText = rankingText;
                                        const linkElement = document.createElement('a');
                                        linkElement.href = href;
                                        linkElement.target = '_blank';
                                        linkElement.textContent = combinedText.replace(/\(.*?\)/g, '').trim();
                                        if (document.getElementById('rankingsCheckbox').checked) {
                                            outputLine.push(combinedText.replace(/\(.*?\)/g, '').trim());
                                        }
                                        linkElement.style.display = 'block';
                                        linkElement.style.fontSize = '12px';
                                        linkElement.style.color = '#0066c0';
                                        linkElement.style.textAlign = 'center';
                                        gridItem.appendChild(linkElement);
                                    }
                                });
                            }
                        }
                    });

                }
                previewContainer.appendChild(gridItem);

                const ddate = new Date(cDateVelue);
                const formattedDateString = `${ddate.getFullYear()}年${ddate.getMonth() + 1}月${ddate.getDate()}日`;

                const newTextElement = document.createElement('span');
                newTextElement.textContent = formattedDateString;
                newTextElement.style.color = "red";
                reviewCountElement.appendChild(newTextElement);

                resultData.push(outputLine);
                textarea2.value += outputLine.join('\t') + '\n';

            } else {
                const gridItem = document.createElement('div');
                gridItem.innerText = `${asin}: 获取数据失败`;
                gridItem.style.textAlign = 'center';
                gridItem.style.padding = '20px';
                gridItem.style.border = '1px solid #ccc';
                gridItem.style.borderRadius = '15px';
                gridItem.style.backgroundColor = '#f8d7da';
                gridItem.style.color = '#721c24';
                gridItem.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                previewContainer.appendChild(gridItem);
            }
        });
    });

    // 导出按钮点击事件

    exportButton.addEventListener('click', exportDataWithImage);

    async function exportDataWithImage() {
        loadingIndicator.style.display = 'block';
        try {
            if (resultData.length === 0) {
                alert("没有数据可以导出，请先执行数据抓取操作。");
                return;
            }
            // 给结果数据添加重复数列
            resultData[0].splice(4, 0, "重复数");
            let countDict = {};
            for (let i = 1; i < resultData.length; i++) {
                let currentValue = resultData[i][0];
                if (countDict[currentValue]) {
                    countDict[currentValue]++;
                } else {
                    countDict[currentValue] = 1;
                }
            }
            for (let i = 1; i < resultData.length; i++) {
                let currentValue = resultData[i][0];
                let count = countDict[currentValue];
                resultData[i].splice(4, 0, count);
            }

            // 创建一个新的工作簿
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Amazon Data');

            // 设置表头
            worksheet.columns = resultData[0].map((header, index) => {
                const widths = [];
                if (document.getElementById('asinCheckbox').checked) {
                    widths.push(12); // 主体ASIN
                    widths.push(12); // 当前ASIN
                }
                if (document.getElementById('hiresCheckbox').checked) widths.push(12.8); // 主图链接
                if (document.getElementById('titleCheckbox').checked) widths.push(60); // 标题
                if (document.getElementById('starCheckbox').checked) widths.push(8); // 星级
                if (document.getElementById('reviewCheckbox').checked) widths.push(8); // 评论数
                if (document.getElementById('cDateCheckbox').checked) widths.push(8); // 创建日期
                if (document.getElementById('rankingsCheckbox').checked) {
                    widths.push(15); // 一级类目
                    widths.push(30); // 二级类目
                } // 指定每一列的宽度
                return { header, key: `col${index}`, width: widths[index] || 20 };
            });


            // 填充数据并添加图片
            for (let i = 1; i < resultData.length; i++) {
                const row = resultData[i];
                const newRow = worksheet.addRow(row);
                worksheet.getRow(newRow.number).height = 80; // 设置行高为 100 像素
                // 如果有图片链接，则下载并插入图片
                if (document.getElementById('exportImageCheckbox').checked){
                    const imageUrlIndex = resultData[0].indexOf('主图链接');
                    if (imageUrlIndex !== -1) {
                        const imageUrl = row[imageUrlIndex];
                        if (imageUrl) {
                            const response = await fetch(imageUrl);
                            if (response.ok) {
                                const blob = await response.blob();
                                const reader = new FileReader();
                                reader.readAsArrayBuffer(blob);

                                await new Promise((resolve) => {
                                    reader.onloadend = async function () {
                                        const buffer = reader.result;

                                        // 创建一个 canvas 元素以调整图片的比例为 1:1
                                        const img = new Image();
                                        img.src = URL.createObjectURL(blob);
                                        img.onload = function() {
                                            const canvas = document.createElement('canvas');
                                            const size = Math.max(img.width, img.height);
                                            canvas.width = 200;
                                            canvas.height = 200;
                                            const ctx = canvas.getContext('2d');
                                            ctx.fillStyle = 'white'; // 设置空白区域为白色
                                            ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充整个 canvas 为白色
                                            if (img.width > img.height) {
                                                const scale = 200 / img.width;
                                                const scaledHeight = img.height * scale;
                                                ctx.drawImage(img, 0, (200 - scaledHeight) / 2, 200, scaledHeight);
                                            } else {
                                                const scale = 200 / img.height;
                                                const scaledWidth = img.width * scale;
                                                ctx.drawImage(img, (200 - scaledWidth) / 2, 0, scaledWidth, 200);
                                            }

                                            canvas.toBlob(async (croppedBlob) => {
                                                const croppedBuffer = await croppedBlob.arrayBuffer();

                                                // 将裁剪后的图片添加到工作簿中
                                                const imageId = workbook.addImage({
                                                    buffer: croppedBuffer,
                                                    extension: 'jpeg' // 假设图片是 jpg 格式
                                                });

                                                // 将图片插入到工作表中的指定位置，填充整个单元格
                                                worksheet.addImage(imageId, {
                                                    tl: { col: imageUrlIndex, row: newRow.number - 1 }, // 左上角的列和行，对应图片列的位置
                                                    br: { col: imageUrlIndex+1, row: newRow.number }, // 右下角的列和行，确保图片填充整个单元格
                                                    editAs: 'oneCell' // 确保图片与单元格绑定
                                                });
                                                resolve();
                                            }, 'image/jpeg');
                                        };
                                    };
                                });
                            }
                        }
                    }
                }
            }

            // 添加一些简单的样式
            worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                    cell.font = { name: 'Times New Roman', size: 10 };
                    cell.alignment = { vertical: 'middle', horizontal: 'left' };
                });
            });

            // 获取当前时间并格式化为 年-月-日-小时-分钟
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
            const filename = `导出数据_${formattedDate}.xlsx`;

            // 生成 Excel 文件
            const blobData = await workbook.xlsx.writeBuffer();

            // 创建 Blob 对象并下载
            const excelBlob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(excelBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating Excel with image: ", error);
        }
        loadingIndicator.style.display = 'none';
    }
    // 关闭按钮点击事件
    closeButton.addEventListener('click', () => {
        container.style.display = 'none';
    });
});
