// ==UserScript==
// @name         改造库存界面
// @namespace    http://www.wukui.fun/
// @version      202509181304
// @description  在新版 管理所有库存 界面显示自定义的额外信息
// @author       吴奎
// @license      MIT license
// @match        https://sellercentral.amazon.com/myinventory/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504909/%E6%94%B9%E9%80%A0%E5%BA%93%E5%AD%98%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/504909/%E6%94%B9%E9%80%A0%E5%BA%93%E5%AD%98%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==
//脚本:
(function () {
    'use strict';
    //----------------------------------------------------脚本开始

    let iii = 0;
    /**寻找元素,5秒后超时 */
    function 等待元素(selector) {
        return new Promise((resolve, reject) => {
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else {
                    // 你可以设置超时来避免无限等待
                    // 这里设置了一个简单的超时逻辑
                    let tim_ms = 5000
                    setTimeout(reject, tim_ms, new Error(`${tim_ms} 毫秒内未找到元素`));
                    // 继续检查，直到找到元素或超时
                    setTimeout(checkElement, 500); // 每500毫秒检查一次
                }
            };
            // 立即开始检查
            checkElement();
        });
    }

    /**入口主函数 */
    async function main() {
        try {
            const targetElement = await 等待元素('.JanusTable-module__table--5FNCe > div:nth-child(2) > div');
            //console.log('找到元素1:', targetElement);
            //添加按钮
            创建导入导出按钮();
            //监听文件导入事件
            _监听文件导入事件();

            //console.log("监听滚动事件");
            滚动事件监听_创建(targetElement);
            //console.log("读取一次数据");
            _读取列表();//读取一次数据
            //console.log("main结束");

        } catch (error) {
            console.error('等待元素出错或超时:', error.message);
        }
    }
    /**监听滚动事件 */
    function 滚动事件监听_创建(Element) {//创建滚动事件

        window.addEventListener('scroll', function () {
            iii = iii + 1;
            //console.log('------窗口正在滚动', iii, '------滚动位置滚动位置:', window.scrollY); // 当前垂直滚动的位置
            调用防抖函数读取列表();

        });
    }
    /**读取商品列表的html */
    function _读取列表() {
        const targetNode = document.querySelector('.JanusTable-module__table--5FNCe > div:nth-child(2) > div').parentElement;

        if (targetNode) {
            //这个函数里面的注释别删,出问题后调试方便启用
            const nodes = targetNode.querySelectorAll('.ProductDetails-module__container--bVY-u');
            //console.log('nodes1:', nodes);
            nodes.forEach(node => {
                //console.log('node1:', node);
                let 当前产品 = new Product();
                当前产品.title = node.querySelector(".ProductDetails-module__titleContainer--wRcGp>a")?.textContent.trim();//获取商品标题
                当前产品.asin = node.querySelector(".JanusSplitBox-module__row--yjQ5L:nth-child(1) > div:nth-child(2) > span")?.textContent.trim();// 获取ASIN
                当前产品.sku = node.querySelector(".JanusSplitBox-module__row--yjQ5L:nth-child(2) > div:nth-child(2) > a")?.textContent.trim();// 获取SKU
                if (!当前产品.sku) {
                    当前产品.sku = node.querySelector(".JanusSplitBox-module__row--yjQ5L:nth-child(2) > div:nth-child(2) > span")?.textContent.trim();// 获取SKU
                }
                当前产品.fnsku = node.querySelector(".JanusSplitBox-module__row--yjQ5L:nth-child(3) > div:nth-child(2) > span")?.textContent.trim() || "";// 获取FNSKU
                当前产品.imageUrl = node.querySelector("img")?.src;// 获取图片URL
                /*
                console.log('title:', newP.title);
                console.log('asin:', newP.asin );
                console.log('sku:', newP.sku);
                console.log('fnsku:', newP.fnsku);
                console.log('imageUrl:', newP.imageUrl);
                */


                if (当前产品.sku.startsWith("amzn.gr.")) {
                    //console.log('已跳过二手商品', newP.sku);
                    淡化二手商品(node, '.ProductDetails-module__titleContainer--wRcGp > a');
                    淡化二手商品(node, '.JanusSplitBox-module__row--yjQ5L:nth-child(1) > div:nth-child(2) > span');
                    淡化二手商品(node, '.JanusSplitBox-module__row--yjQ5L:nth-child(2) > div:nth-child(2) > a');
                    淡化二手商品(node, '.JanusSplitBox-module__row--yjQ5L:nth-child(3) > div:nth-child(2) > span');
                } else {
                    /*
                    console.log(newP.title);
                    console.log(newP.asin);
                    console.log(newP.sku);
                    console.log(newP.fnsku);
                    console.log(newP.imageUrl);
                    */
                    GM_获取别名与备注(node, 当前产品.sku, 当前产品)
                }
            });
        }
    }

    /**淡化二手商品 */
    function 淡化二手商品(Node, cssTxt) {
        // 使用querySelector查找元素，确保选择器正确
        const element = Node.querySelector(cssTxt);
        // 检查元素是否存在
        if (element) {
            // 修改元素的颜色为淡灰色（这里使用#ccc作为示例）
            element.style.color = '#ccc'; // 或者使用 rgba(204, 204, 204, 1) 等其他颜色代码
            console.log('元素的颜色已更改为淡灰色');
        } else {
            console.log('未找到指定的元素');
        }

    }


    function 写别名与备注(node, sku, alias, note) {
        const nodes = node.querySelector(`.JanusSplitBox-module__container--99EXd`);
        //console.log("_写别名", nodes)
        if (nodes) {
            const nodes2 = nodes.querySelector(`.JanusSplitBox-module__row--yjQ5L.alias`);
            //console.log("找元素", nodes2)
            if (!nodes2) {
                创建元素_别名(nodes, sku, alias);
                创建元素_备注(nodes, sku, note)
            }
        }
    }

    function 创建元素_别名(node, sku, alias) {
        //console.log("_创建元素", alias);

        // 找到容器元素
        var container = node;
        // 创建新的行元素
        var newRow = document.createElement('div');
        newRow.className = 'JanusSplitBox-module__row--yjQ5L alias';

        // 创建第一个面板元素
        var panel1 = document.createElement('div');
        panel1.className = 'JanusSplitBox-module__panel--AbYDg';
        panel1.style = 'flex: 1 1 0%; justify-content: flex-start; align-items: normal; min-width: 70px;';

        // 创建第一个面板的文字元素
        var span1 = document.createElement('span');
        span1.className = 'JanusRichText-module__defaultText--pMlk1';
        span1.style = 'overflow-wrap: normal;';
        span1.textContent = '别名';
        span1.setAttribute('sku', sku); // 给span1添加一个名为"sku"的属性，并赋值为sku

        // 为 span1 添加点击事件
        span1.addEventListener('click', function (event) {
            事件_别名被点击(event, sku);
        });


        // 将文字元素添加到第一个面板
        panel1.appendChild(span1);

        // 创建第二个面板元素
        var panel2 = document.createElement('div');
        panel2.className = 'JanusSplitBox-module__panel--AbYDg';
        panel2.style = 'flex: 3 1 0%; justify-content: flex-start; align-items: normal;';

        // 创建第二个面板的文字元素
        var span2 = document.createElement('span');
        span2.className = 'JanusRichText-module__defaultText--pMlk1 --alias--';
        span2.style = 'overflow-wrap: anywhere;';
        span2.textContent = alias;
        span2.setAttribute('alias_sku', sku); // 给span2添加一个名为"alias_sku"的属性，并赋值为sku

        // 将文字元素添加到第二个面板
        panel2.appendChild(span2);

        // 将两个面板添加到新行元素
        newRow.appendChild(panel1);
        newRow.appendChild(panel2);

        // 将新行元素添加到容器
        container.appendChild(newRow);
        //console.log("将新行元素添加到容器");


    }

    function 创建元素_备注(node, sku, note) {
        //console.log("_创建元素", alias);

        // 找到容器元素
        var container = node;
        // 创建新的行元素
        var newRow = document.createElement('div');
        newRow.className = 'JanusSplitBox-module__row--yjQ5L note';

        // 创建第一个面板元素
        var panel1 = document.createElement('div');
        panel1.className = 'JanusSplitBox-module__panel--AbYDg';
        panel1.style = 'flex: 1 1 0%; justify-content: flex-start; align-items: normal; min-width: 70px;';

        // 创建第一个面板的文字元素
        var span1 = document.createElement('span');
        span1.className = 'JanusRichText-module__defaultText--pMlk1';
        span1.style = 'overflow-wrap: normal;';
        span1.textContent = '备注';
        span1.setAttribute('sku', sku); // 给span1添加一个名为"sku"的属性，并赋值为sku

        // 为 span1 添加点击事件
        span1.addEventListener('click', function (event) {
            事件_别名被点击(event, sku);
        });


        // 将文字元素添加到第一个面板
        panel1.appendChild(span1);

        // 创建第二个面板元素
        var panel2 = document.createElement('div');
        panel2.className = 'JanusSplitBox-module__panel--AbYDg';
        panel2.style = 'flex: 3 1 0%; justify-content: flex-start; align-items: normal;';

        // 创建第二个面板的文字元素
        var span2 = document.createElement('span');
        span2.className = 'JanusRichText-module__defaultText--pMlk1 --note--';
        span2.style = 'overflow-wrap: anywhere;';
        span2.textContent = note;
        span2.setAttribute('note_sku', sku); // 给span2添加一个名为"note_sku"的属性，并赋值为sku

        // 将文字元素添加到第二个面板
        panel2.appendChild(span2);

        // 将两个面板添加到新行元素
        newRow.appendChild(panel1);
        newRow.appendChild(panel2);

        // 将新行元素添加到容器
        container.appendChild(newRow);
        //console.log("将新行元素添加到容器");


    }


    // 外部定义的点击事件处理函数
    function 事件_别名被点击_备份(event, sku) {
        //console.log('span1 被点击了！', sku);
        // 这里可以访问 event 对象来获取事件相关的数据
        //console.log('被点击的元素（target）:', event.target);
        // 使用模板字符串来构造选择器  , 用于找到别名字符串
        let selector = `span[alias_sku="${sku}"]`;
        // 使用document.querySelector来选择第一个匹配的元素
        let element = document.querySelector(selector);
        弹出别名与备注修改输入框(element, sku);

    }

    // 修改外部定义的点击事件处理函数，使其适用于别名和备注
    function 事件_别名被点击(event, sku) {
        //console.log('span1 (ALIA/NOTE) 被点击了！', sku);
        // 这里可以访问 event 对象来获取事件相关的数据
        //console.log('被点击的元素（target）:', event.target);
        // 不再需要区分是哪个 span 被点击，直接弹出通用修改框
        弹出别名与备注修改输入框(null, sku); // element 参数在此新函数中未使用，可以传 null
    }

    /** 防抖函数本体*/
    function 防抖函数本体(func, wait = 10) {
        let timeout;

        return function executedFunction(...args) {
            const context = this;

            // 如果之前已经设置了定时器，则清除它
            if (timeout) {
                clearTimeout(timeout);
            }

            // 设置新的定时器
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    // 创建一个防抖版本的读取列表
    const 调用防抖函数读取列表 = 防抖函数本体(_读取列表, 250);
    //

    /**商品对象结构 */
    class Product {
        constructor(title, asin, sku, fnsku, imageUrl, alias) {
            this.title = title;
            this.asin = asin;
            this.sku = sku;
            this.fnsku = fnsku;
            this.imageUrl = imageUrl;
            this.alias = alias;
        }
    }


    ///------------------------------------------------------------------------------------------------------------------------



    /** 创建按钮 */
    function 创建导入导出按钮() {
        // 找到目标元素
        const searchButtonDiv = document.querySelector('.SearchBox-module__searchButton--5iHxx').parentElement;

        if (searchButtonDiv) {
            // 创建新div元素
            const newDiv = document.createElement('div');
            newDiv.style.display = 'flex';
            newDiv.style.gap = '10px';
            newDiv.style.marginTop = '10px';

            // 创建 "导出" 按钮
            const exportButton = document.createElement('button');
            exportButton.textContent = '导出 JSON';
            exportButton.style.padding = '10px 15px';
            exportButton.style.border = 'none';
            exportButton.style.borderRadius = '5px';
            exportButton.style.backgroundColor = '#4CAF50';
            exportButton.style.color = 'white';
            exportButton.style.cursor = 'pointer';
            exportButton.style.transition = 'background-color 0.3s';
            exportButton.onmouseover = function () {
                this.style.backgroundColor = '#45a049';
            };
            exportButton.onmouseout = function () {
                this.style.backgroundColor = '#4CAF50';
            };
            exportButton.onclick = function () {
                // 发送调用请求
                GM_获取全部sku的json列表();
            };

            // 创建 "导入" 的 input 元素，并隐藏它
            const importInput = document.createElement('input');
            importInput.type = "file";
            importInput.id = "fileInput";
            importInput.accept = ".json";
            importInput.style.display = 'none'; // 隐藏 input 元素

            // 创建 "导入 JSON" 按钮
            const importButton = document.createElement('button');
            importButton.textContent = '导入 JSON';
            importButton.style.padding = '10px 15px';
            importButton.style.border = 'none';
            importButton.style.borderRadius = '5px';
            importButton.style.backgroundColor = '#2196F3';
            importButton.style.color = 'white';
            importButton.style.cursor = 'pointer';
            importButton.style.transition = 'background-color 0.3s';
            importButton.onmouseover = function () {
                this.style.backgroundColor = '#1E88E5';
            };
            importButton.onmouseout = function () {
                this.style.backgroundColor = '#2196F3';
            };
            importButton.onclick = function () {
                // 当导入按钮被点击时，触发 input 元素的点击事件
                importInput.click();
            };

            // 将按钮和 input 添加到新div中
            newDiv.appendChild(exportButton);
            newDiv.appendChild(importInput); // 先添加 input，以便在 DOM 中存在
            newDiv.appendChild(importButton);

            // 在目标元素后面插入新div
            searchButtonDiv.parentNode.insertBefore(newDiv, searchButtonDiv.nextSibling);

            console.log("导入和导出按钮已成功添加");
        } else {
            console.log("未找到目标元素");
        }
    }







    /**监听文件导入事件 */
    function _监听文件导入事件() {
        document.getElementById('fileInput').addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const products = JSON.parse(e.target.result);
                        文件导入的后处理(products);
                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    /**文件导入后的处理 */
    function 文件导入的后处理(products) {

        console.log("导入后的文件:", products);
        products.forEach(product => {
            try {
                let newP = new Product();
                newP.title = product.title || "";//获取商品标题
                newP.asin = product.asin || "";// 获取ASIN
                newP.sku = product.sku;// 获取SKU
                newP.fnsku = product.fnsku || ""; // 获取FNSKU
                newP.imageUrl = product.imageUrl || ""; // 获取图片URL
                newP.alias = product.alias || ""; // 获取别名
                if (!newP.sku.startsWith("amzn.gr.")) {
                    GM_添加或更新SKU(newP);
                } else {
                    //console.log("sku是二手货,跳过本次添加",newP.sku);
                }
            } catch (err) {
                alert("处理json文件异常");
                console.error('处理json文件异常:', err);
            }
        });
        alert("商品列表已经全部导入")
    }

    /**商品列表导入成功的提示 */
    let 导入成功提示 = function () { alert("商品列表导入成功"); }//似乎没啥用


    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**添加或更新sku */
    function GM_添加或更新SKU(newP) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                title: newP.title || '',
                asin: newP.asin || '',
                sku: newP.sku,
                fnsku: newP.fnsku || '',
                imageUrl: newP.imageUrl || '',
                alias: newP.alias || '',
                notes: '' // 如果需要备注字段可以添加
            }),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            console.log("商品列表导入成功", result.数据);
                        } else {
                            console.log("导入失败:", result.数据);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                    }
                }
            },
            onerror: function (error) {
                console.error('Error sending request:', error);
            }
        });
    }

    /**修改别名 */
    function GM_发送别名(sku, alias) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/edit-alias',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                sku: sku,
                alias: alias
            }),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            let selector = `span[alias_sku="${sku}"]`;
                            let element = document.querySelector(selector);
                            if (element) {
                                element.textContent = result.数据;
                            }
                        } else {
                            alert("修改失败: " + result.数据);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        alert("修改失败!");
                    }
                } else {
                    alert("修改失败!");
                }
            },
            onerror: function (error) {
                alert("修改失败!");
                console.error('Error sending request:', error);
            }
        });
    }

    /** 修改别名和备注 */
    function GM_发送别名和备注(sku, alias, notes) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/edit-notes-alias', // 调用新接口
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                sku: sku,
                alias: alias,
                notes: notes
            }),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            // 更新成功，找到页面上的对应元素并修改文本
                            console.log(`SKU ${sku} 的别名和备注已更新`);

                            // 更新别名显示
                            let aliasSelector = `span[alias_sku="${sku}"]`;
                            let aliasElement = document.querySelector(aliasSelector);
                            if (aliasElement) {
                                aliasElement.textContent = result.数据.alias || '';
                            }

                            // 更新备注显示
                            let notesSelector = `span[note_sku="${sku}"]`;
                            let notesElement = document.querySelector(notesSelector);
                            if (notesElement) {
                                notesElement.textContent = result.数据.notes || '';
                            }

                        } else {
                            alert("修改失败: " + result.数据);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        alert("修改失败!");
                    }
                } else {
                    alert("修改失败!");
                }
            },
            onerror: function (error) {
                alert("修改失败!");
                console.error('Error sending request (edit-notes-alias):', error);
            }
        });
    }

    /**获取别名与备注 */
    function GM_获取别名与备注(nodes, sku, 当前产品) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/get-alias2',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                sku: 当前产品.sku,
                title: 当前产品.title,
                asin: 当前产品.asin,
                fnsku: 当前产品.fnsku,
                imageUrl: 当前产品.imageUrl
            }),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            写别名与备注(nodes, sku, result.数据.alias || '', result.数据.notes || '');
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                    }
                }
            },
            onerror: function (error) {
                console.error('Error sending request:', error);
            }
        });
    }

    /**获取全部列表json */
    function GM_获取全部sku的json列表() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/export',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({}),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            导出JSON文件('产品列表', JSON.parse(result.数据));
                        } else {
                            alert("获取商品列表失败: " + result.数据);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        alert("获取商品列表失败");
                    }
                } else {
                    alert("获取商品列表失败");
                }
            },
            onerror: function (error) {
                console.error('Error sending request:', error);
                alert("获取商品列表失败");
            }
        });
    }


    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**导出 JSON 文件*/
    function 导出JSON文件(filename, jsonData) {

        // 确保jsonData是一个对象或数组
        if (typeof jsonData !== 'object' || jsonData === null) {
            console.error('jsonData 不是一个对象或数组');
            return;
        }
        // 字符串化JSON数据
        const jsonString = JSON.stringify(jsonData, null, 2);
        // 打印到控制台以验证
        //console.log(jsonString);
        // 创建一个Blob并触发下载
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link); // 有时需要添加到DOM中
        link.click();
        document.body.removeChild(link); // 清理
        console.log("JSON文件已导出");
    }

    //---------粘贴到这里

    // 定义一个弹出输入框的函数，用于同时修改别名和备注 (美化版)
    const 弹出别名与备注修改输入框 = function (element, sku) {
        // 检查弹窗是否已经存在
        if (document.querySelector('.popup-container')) {
            return; // 如果存在，则直接返回
        }

        // 创建弹窗容器
        let popupContainer = document.createElement('div');
        popupContainer.className = 'popup-container';

        // --- 弹窗标题 ---
        let popupHeader = document.createElement('div');
        popupHeader.className = 'popup-header';
        popupHeader.textContent = `编辑 SKU: ${sku}`;
        popupContainer.appendChild(popupHeader);

        // --- 弹窗内容主体 ---
        let popupContent = document.createElement('div');
        popupContent.className = 'popup-content';

        // --- 别名输入部分 ---
        let aliasLabel = document.createElement('label');
        aliasLabel.textContent = '别名 (ALIA):';
        aliasLabel.className = 'popup-label';
        popupContent.appendChild(aliasLabel);

        let aliasInput = document.createElement('input');
        aliasInput.type = 'text';
        aliasInput.placeholder = '请输入别名...';
        aliasInput.className = 'popup-input alias-input';
        // 初始值将通过 AJAX 获取
        aliasInput.value = '加载中...';
        aliasInput.disabled = true; // 初始禁用，等待数据加载
        popupContent.appendChild(aliasInput);

        // --- 备注输入部分 ---
        let notesLabel = document.createElement('label');
        notesLabel.textContent = '备注 (NOTE):';
        notesLabel.className = 'popup-label';
        notesLabel.style.marginTop = '15px'; // 与上方元素的间距
        popupContent.appendChild(notesLabel);

        // 使用 textarea 替代 input，支持多行和换行
        let notesInput = document.createElement('textarea');
        notesInput.placeholder = '请输入备注（支持换行）...';
        notesInput.className = 'popup-textarea notes-input';
        notesInput.value = '加载中...';
        notesInput.disabled = true; // 初始禁用，等待数据加载
        notesInput.rows = 4; // 默认显示4行
        popupContent.appendChild(notesInput);

        popupContainer.appendChild(popupContent);

        // --- 按钮容器 ---
        let buttonContainer = document.createElement('div');
        buttonContainer.className = 'popup-buttons';

        // 确定按钮
        let confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确定';
        confirmBtn.className = 'popup-button popup-confirm';
        confirmBtn.disabled = true; // 初始禁用，等待数据加载

        // 取消/关闭按钮
        let closeBtn = document.createElement('button');
        closeBtn.textContent = '取消';
        closeBtn.className = 'popup-button popup-cancel';

        // 确定按钮事件
        confirmBtn.onclick = function () {
            const newAlias = aliasInput.value.trim();
            const newNotes = notesInput.value.trim();
            // 调用新的 GM 函数发送更新请求
            GM_发送别名和备注(sku, newAlias, newNotes);
            popupContainer.remove();
        };

        // 关闭按钮事件
        closeBtn.onclick = function () {
            popupContainer.remove();
        };

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(closeBtn);
        popupContainer.appendChild(buttonContainer);

        // 将弹窗添加到页面
        document.body.appendChild(popupContainer);

        // --- AJAX 请求获取当前数据 ---
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/shangpin/get-alias2', // 复用此接口获取数据
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                sku: sku
                // 其他字段可以不传，因为我们只是查询
            }),
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.状态 === 1) {
                            // 成功获取数据，填充输入框并启用
                            aliasInput.value = result.数据.alias || '';
                            notesInput.value = result.数据.notes || '';
                            aliasInput.disabled = false;
                            notesInput.disabled = false;
                            confirmBtn.disabled = false;
                        } else {
                            console.error('获取别名/备注失败:', result.数据);
                            aliasInput.value = '加载失败';
                            notesInput.value = '加载失败';
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        aliasInput.value = '加载失败';
                        notesInput.value = '加载失败';
                    }
                } else {
                    console.error('HTTP Error:', response.status);
                    aliasInput.value = '加载失败';
                    notesInput.value = '加载失败';
                }
            },
            onerror: function (error) {
                console.error('AJAX Error 获取别名/备注:', error);
                aliasInput.value = '加载失败';
                notesInput.value = '加载失败';
            }
        });
    };

    // 创建一个新的<style>标签  ,用于控制输入框的css (美化版)
    var style = document.createElement('style');

    // 设置样式内容 (已更新以适应新结构和美化，包含 textarea 样式)
    style.innerHTML = `
    .popup-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000; /* 提高 z-index 确保在最上层 */
        width: 90%;
        max-width: 400px;
        background-color: #ffffff;
        border-radius: 10px; /* 更圆润的角 */
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* 更柔和的阴影 */
        overflow: hidden; /* 隐藏子元素溢出 */
        font-family: Arial, sans-serif; /* 设置字体 */
    }

    .popup-header {
        padding: 15px 20px;
        background-color: #f8f9fa; /* 浅灰色背景 */
        border-bottom: 1px solid #e9ecef; /* 底部分隔线 */
        font-size: 16px;
        font-weight: bold;
        color: #495057; /* 深灰色文字 */
    }

    .popup-content {
        padding: 20px;
    }

    .popup-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600; /* 稍微粗一点的标签 */
        color: #495057;
    }

    .popup-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ced4da; /* 更现代的边框色 */
        border-radius: 6px; /* 稍微圆润的输入框 */
        font-size: 14px;
        box-sizing: border-box; /* 确保padding不增加宽度 */
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* 平滑过渡 */
    }

    .popup-input:focus {
        outline: 0;
        border-color: #80bdff; /* 聚焦时的边框色 */
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* 聚焦时的光晕 */
    }

    /* 输入框禁用状态样式 */
    .popup-input:disabled {
        background-color: #e9ecef;
        opacity: 1; /* 确保不透明度 */
        color: #6c757d;
    }

    /* 多行文本框样式 */
    .popup-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 14px;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
        resize: vertical; /* 允许用户垂直拖拽调整大小 */
        min-height: 60px; /* 最小高度，体现多行感 */
        line-height: 1.5; /* 更舒适的行高 */
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .popup-textarea:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .popup-textarea:disabled {
        background-color: #e9ecef;
        opacity: 1;
        color: #6c757d;
        resize: none; /* 禁用时不允许调整大小 */
    }

    .popup-buttons {
        display: flex;
        justify-content: flex-end; /* 按钮靠右对齐 */
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-top: 1px solid #e9ecef;
        gap: 10px; /* 按钮之间的间距 */
    }

    .popup-button {
        padding: 8px 16px;
        border: 1px solid transparent;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .popup-confirm {
        background-color: #007bff; /* Bootstrap 主色 */
        color: white;
    }

    .popup-confirm:hover {
        background-color: #0069d9; /* 悬停变深 */
    }

    .popup-confirm:disabled {
        background-color: #6c757d; /* 禁用时的灰色 */
        cursor: not-allowed;
    }

    .popup-cancel {
        background-color: #6c757d; /* 取消按钮灰色 */
        color: white;
    }

    .popup-cancel:hover {
        background-color: #5a6268; /* 悬停变深 */
    }
`;

    // 将<style>标签添加到文档的<head>部分
    document.head.appendChild(style);


    // 调用main函数
    main();
    

    //-------------------------------------------------脚本结束
    // Your code here...
})();