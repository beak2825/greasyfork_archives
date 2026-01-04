// ==UserScript==
// @name         OvertimeProofSaver
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  自动化导出OA加班记录，内部OA系统专用
// @author       AN
// @match        http://58.20.202.41:8099/spa/workflow/static/index.html*
// @match        http://58.20.202.41:8099/spa/workflow/static4form/index.html?_rdm=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=202.41
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/485138/OvertimeProofSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/485138/OvertimeProofSaver.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let totalSum = 0;
    let failedCount = 0;
    //如果是在http://58.20.202.41:8099/spa/workflow/static4form/index.html?_rdm=*页面则执行
    if (window.location.href.indexOf('http://58.20.202.41:8099/spa/workflow/static4form/index.html?_rdm=') > -1) {
        // 等待网页加载完毕
        window.onload = function () {
            // 定时检测元素是否存在
            var checkExist = setInterval(function () {
                var xpath = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[17]/td[3]/div/div/div/div/div[2]/table/tbody';
                var tbody = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                //html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[17]/td[3]/div/div/div/div/div[2]/table/tbody/tr[4]/td[10]/div/span/span
                var timeXpath = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[17]/td[3]/div/div/div/div/div[2]/table/tbody/tr[4]/td[11]/div/span/span';
                var text = document.evaluate(timeXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                ///html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[11]/td[4]/div/div/div/div/a

                var nameXpath = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[11]/td[4]/div/div/div/div/a';
                var name = document.evaluate(nameXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                var txXpath ='/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[17]/td[3]/div/div/div/div/div[2]/table/tbody/tr[4]/td[12]/div/span/span[1]';
                var tx = document.evaluate(txXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;



                if (tbody && tbody.children.length > 3 && text.innerText && name.innerText) {
                    const trElements = tbody.children;
                    let index = 0;
                    for (let tr of trElements) {
                        index++;
                        if (index < 4) continue;
                        const tdList = tr.querySelectorAll('td');
                        tdList.forEach((td, colIndex) => {
                            console.log(`列 ${colIndex + 1}:`, td.textContent.trim());
                        });
                        let inputElement = tr.querySelector('td:nth-child(11) div span input');
                        if (inputElement) {
                            let value = parseFloat(inputElement.value);
                            if (!isNaN(value)) {
                                totalSum += value;
                            }
                        }
                    }
                    if(tx.innerText!='调休'){
                        //关闭页面
                        window.close();
                    }
                    console.log('总和:', totalSum);
                    // window.print();

                    clearInterval(checkExist); // 停止检测
                    takeFullScreenshot();
                } else {
                    failedCount++;
                }

                //如果大于5次失败，刷新页面
                if (failedCount > 5) {
                    location.reload();
                }

            }, 5000); // 每隔5000毫秒检查一次


        };
    }

    // 如果是在http://
    if (window.location.href.indexOf('http://58.20.202.41:8099/spa/workflow/static4form/index.html?_rdm=')) {
        // 设置观察者来监视DOM变化
        var observer = new MutationObserver(function (mutations, me) {
            var buttonTargetXPath = '/html/body/div[1]/div/div/div[1]/div[1]/div[1]/div[2]';
            var buttonTarget = document.evaluate(buttonTargetXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (buttonTarget) {
                var button = document.createElement('button');
                button.textContent = '保存加班图片';
                button.style.marginLeft = '10px';

                button.onclick = function () {
                    var targetXPath = '/html/body/div[1]/div/div/div[1]/div[1]/div[2]/div/div[3]/div[2]/div[2]/div/div[1]/div/div/div/div/div/div/div/span/div[2]/table/tbody';
                    var targetElement = document.evaluate(targetXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (targetElement) {
                        var rows = targetElement.children;
                        for (var i = 0; i < rows.length; i++) {
                            (function (index) {
                                setTimeout(function () {
                                    var linkXPath = './/td[3]/span/a';
                                    var linkElement = document.evaluate(linkXPath, rows[index], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                                    if (linkElement) {
                                        var onClickAttribute = linkElement.getAttribute('onclick');
                                        if (onClickAttribute) {
                                            //var confirmOpen = confirm("是否打开此链接: " + linkElement.textContent.trim() + "?");
                                            // if (confirmOpen) {
                                            eval(onClickAttribute);
                                            //  }
                                        }
                                    }
                                }, 9000 * index); // 延时递增，每次增加20秒
                            })(i);
                        }
                    }
                };

                buttonTarget.appendChild(button);
                // 停止观察
                me.disconnect();
                return;
            }
        });

        // 配置观察者选项:
        var observerConfig = {
            childList: true,
            subtree: true
        };

        // 选择需要观察变动的节点
        var targetNode = document.body;

        // 使用配置文件对目标节点进行观察
        observer.observe(targetNode, observerConfig);
    }


    function takeFullScreenshot() {
        var xpath = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div';
        var date = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[12]/td[7]/div/span/span';
        var data2 = '/html/body/div[1]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div/table/tbody/tr[9]/td[4]/div/div/span';
        var scrollableElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (scrollableElement) {
            var originalHeight = scrollableElement.style.height; // 保存原始高度

            scrollableElement.style.height = scrollableElement.scrollHeight + 'px'; // 调整高度以展示所有内容
            html2canvas(scrollableElement).then(canvas => {
                // 将Canvas转换为图像
                var imgData = canvas.toDataURL('image/png');

                // 创建下载链接
                var downloadLink = document.createElement('a');
                downloadLink.href = imgData;
                setTimeout(function () {
                    var dateElement = document.evaluate(date, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var data2Element = document.evaluate(data2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    //按-分割字符串
                    var arr = data2Element.textContent.split('-');
                    //分割后的字符串拼接，只保留最后的3个
                    var data2Text = arr[arr.length - 3] + '-' + arr[arr.length - 2] + '-' + arr[arr.length - 1];

                    //如果data2Text和dateElement的textContent不一样
                    if (data2Text != dateElement.textContent) {
                        downloadLink.download = dateElement.textContent +'[' + data2Text + ']'+'(' + totalSum + 'H).png'
                    } else {
                        downloadLink.download = dateElement.textContent + '(' + totalSum + 'H).png';
                    }

                    // 模拟点击下载
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    scrollableElement.style.height = originalHeight; // 恢复原始高度
                    setTimeout(function () {
                       window.close(); // 关闭当前窗口
                    }, 4000); // 10000毫秒 = 10秒
                }, 2000); // 10000毫秒 = 10秒
            });
        } else {
            console.error('无法找到指定的元素');
        }
    }
})();