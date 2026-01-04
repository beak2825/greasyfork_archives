// ==UserScript==
// @name         专利通知书下载器
// @namespace    http://patenthomes.com
// @version      1.0
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKQ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDItMjdUMTM6MTc6MzcrMDg6MDAiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAyLTI3VDEzOjEzOjEwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAyLTI3VDEzOjE3OjM3KzA4OjAwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZWZmM2QyNWEtZjk0MC04MjQxLTgyZjktM2EwMmE5OWQ4NzJiIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBmYTkwYTFmLTYxNGQtMGM0ZC1iYjI1LWE2MjdiYzZkYjVjMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJDQjhEMkZDMEI0M0E5QjUwMjM3MzM4MDE5QzQxNEQ5MiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6SW1hZ2VXaWR0aD0iNTEyIiB0aWZmOkltYWdlTGVuZ3RoPSI1MTIiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMiIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpTYW1wbGVzUGVyUGl4ZWw9IjMiIHRpZmY6WFJlc29sdXRpb249IjcyLzEiIHRpZmY6WVJlc29sdXRpb249IjcyLzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6RXhpZlZlcnNpb249IjAyMzEiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI1MTIiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI1MTIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMmE4NzMzYy1kMjk3LTE2NDctOWRiMC03MjcwNjQ3ZTI1YTciIHN0RXZ0OndoZW49IjIwMjQtMDItMjdUMTM6MTU6MTQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjRjNDQzYTUtNzUxMy0yMjRiLWJlY2YtMzE1ZmY3OTRkZmRkIiBzdEV2dDp3aGVuPSIyMDI0LTAyLTI3VDEzOjE1OjE0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjQuNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBmYTkwYTFmLTYxNGQtMGM0ZC1iYjI1LWE2MjdiYzZkYjVjMyIgc3RFdnQ6d2hlbj0iMjAyNC0wMi0yN1QxMzoxNzozNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMmE4NzMzYy1kMjk3LTE2NDctOWRiMC03MjcwNjQ3ZTI1YTciIHN0UmVmOmRvY3VtZW50SUQ9IkNCOEQyRkMwQjQzQTlCNTAyMzczMzgwMTlDNDE0RDkyIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9IkNCOEQyRkMwQjQzQTlCNTAyMzczMzgwMTlDNDE0RDkyIi8+IDx0aWZmOkJpdHNQZXJTYW1wbGU+IDxyZGY6U2VxPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvdGlmZjpCaXRzUGVyU2FtcGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgWJ0cwAAAS2SURBVDiNjZVpbFVFFMf/M3fue+8uj/a92xZaai1USqVKAKNEFpF+UARCkFUJQsImiRiFIEQlBBojJEoggoQlIGiICjTEVLYgAWQLBDAitdAIpfR1o7ylfftdZvzQ0ipbOF9mJpPzyzn/c+YMiVWOw9OZsCUARLYhyMO39LFugnQ5CEGEI+kF9Xp+gFsy8HQgwSkE0Y2gpsW5zQAQQXQjeODYm7+cKtN9YfBHeJGHUxM2041Qc1uGJluSQ520W+/Z3BzN6DvuoFu264+M0akdD/mJ5DwpIsGpmtt0LZA/fN7OJd8uUvMaCUA86ZawL+VIls2slJsw62GZHgRRwqk3evz8q7dasuuae4FAYjYSap/sVoXZJYW1fn/YjPiobApOngRyHAmWbPjDAOa/fQCAlXbDkwqEfZYjjRjyB5jpyoyofWt1I+RYsrgfWjdIcEohvEYILvNKVSmA4twGpGVQDtn6q6a/LUhxSTUGXj17ceiy8lXn/hyk+EOUiA531rFwR2KypRjBaKyH14hIIACiCRVUUMpBRFvQD8BNUbnnvelL1yVtKRbXh5UdF0nFsmQQ0QlisqXkNn2/f+qn2xZOfP1EtN0LoDHiQ4cWgqhqEsDqbz5sDvls4OXnr5cv+cppyjNNF6G8MyIhiJLdWlNbNPvLzwBs3j8ZACMiJ6MdDhMgADwuE0Ag5AMwpezEupXlWVoseqeAuMxujQgg0p6szHD/gnoAr5TUFD8T4CC5GW2IazKz0KspbDMAmie1a9XqfdvnFngS0bpnqcvsqhwFACISQb/fuLd5+dpJr509s3/S2Jcuc4FEXIOaUAb8fbRi2oadcymwfMH22R+t5zeL2ht6g3JhMyEIiOiumqA8eruwrPRaxaaFsjvZGPQDaGM2Xqj65PM1W/ZNfXdKBQGYI6EhPxr2a952b3GNXnRTdaf5f8UmRAiCRFuG6k7BkZhsAwAns2fuqaseUHly5Pm97zjAP3UFsJg3u/lS1cBDFdNyfeEZI393azEzqbKuJiKcqD3vwggju7WHJwVg4qJNg4pqD++epRB+51YfAIqWgCBUTZpqcu3WBWmgoSWn/OP11u1CCgCCUAG98Pa5q4PmLd7w044Fv10ZDKC4383DP09VTAl1fXRfBMC9uznICvKQMWL08UPfzQFwsboUVJCO1ASg5rQGWnpNWPp1MKbtODgWQL4ROrxxkcJFpL4gs7jmxf43AFSeGX7y6Fsjhp0mXEokFABzxlfCoY7NWIdApEf01x9nBGMaIAAya0LlinnbDb09ces5psVTzT1LS6onjzpdcWrk6PlbRw29YNnyuctD3p90YNr4SrMxjzCb3u8l3hT1dui+fNYPu7fN75cXiAXyhWwTIsy0x7nn37lm2cw3jjGKUxeGXroyePH0vVu+WOG06+m0mxDROdjcSjIc9+46MiZpySs/2GgFjWTYJynJzrlDBDddXiOIzMiNqtJ4OCszr6Fvv+tOY+94TJdcJgTpBHFL9ma0IbsVnFpNuemUh8gPTi9hM48WZz3awBxYshnJMFMKYfb/Xj+VrVhckxIqAC4IYY/4Kgiz0ylPKuXpPAJdlG5Qh+S8cyfwOCOP+okAAP8C0UYibgjuGLEAAAAASUVORK5CYII=
// @description  用来下载专利局中国及多国专利审查信息查询系统的通知书
// @author       北溟之鲲
// @match        *://cpquery.cponline.cnipa.gov.cn/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.1/jspdf.umd.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488352/%E4%B8%93%E5%88%A9%E9%80%9A%E7%9F%A5%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/488352/%E4%B8%93%E5%88%A9%E9%80%9A%E7%9F%A5%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';


    //恢复PDF格式通知书工具栏的下载按钮及其他按钮，且插入一个提取文件名的按钮，用来提取申请号和通知书名称并组合在一起作为文件名

    //恢复PDF格式通知书工具栏的下载按钮及其他按钮
    // Define the CSS selector for the elements you want to modify
    const targetSelector = '#toolbarViewerRight,#download,#presentationMode,#viewFind,#print,#viewBookmark,#secondaryToolbarToggle,#openFile'; // Replace with your actual selector
    // Get all matching elements
    const elements = document.querySelectorAll(targetSelector);
    // Loop through each element and change its display property
    elements.forEach(element => {
        element.style.display = 'block';
    });

    //在通知书为PDF格式时，插入一个按钮，用来查看通知书的收件人信息
    //标记提取按钮未插入
//    let viewbuttonInserted = false;
    //设定查看按钮相关的函数
//    function checkIframe() {

        // 判断网页中是否存在iframe标签
//        const iframes = document.querySelectorAll('#q-app > div > div > div.q-page-container > main > div > div.content > div.row.boxRow > div.table > div > div.tableList > div:nth-child(2) > div > div > div > div > iframe');

        //如果存在iframe标签且未插入提取按钮，则插入提取按钮
//        if (iframes.length > 0 && !viewbuttonInserted) {

            // 创建下载按钮
//            const viewButton = document.createElement('button');
            // 给按钮一个唯一的ID以便于识别和删除
//            viewButton.id = 'myviewButton';
            // 按钮属性
//            viewButton.textContent = '查看收件人信息';
//            viewButton.style.position = 'fixed';
//            viewButton.style.top = '80px';
//            viewButton.style.right = '20px';
            //viewButton.style.transform = 'translateY(-50%)';
//            viewButton.style.zIndex = '10000';
            //viewButton.style.backgroundColor = '#4CAF50';
            //viewButton.style.border = 'none';
            //viewButton.style.borderRadius = '5px';
            //viewButton.style.color = 'white';
            //viewButton.style.fontSize = '16px';
            //viewButton.style.padding = '2px 2px';
//            viewButton.style.cursor = 'pointer';
//            document.body.appendChild(viewButton);

            // 标记已插入按钮
//            viewbuttonInserted = true;

            // 设置按钮动作
//            viewButton.addEventListener('click', async () => {
                // 遍历所有iframe元素
//                for (var i = 0; i < iframes.length; i++) {
                    // 获取iframe子页面的内容
//                    var iframeContent = iframes[i].contentDocument;
                    // 获取收件人相关的信息
//                    var value1 = iframeContent.querySelector('#viewer > div:nth-child(1) > div.textLayer > span:nth-child(20)').textContent;
//                    var value2 = iframeContent.querySelector('#viewer > div:nth-child(1) > div.textLayer > span:nth-child(21)').textContent;
//                    var value3 = iframeContent.querySelector('#viewer > div:nth-child(1) > div.textLayer > span:nth-child(24)').textContent;
//                    var value4 = iframeContent.querySelector('#viewer > div:nth-child(1) > div.textLayer > span:nth-child(26)').textContent;
//                    var value5 = iframeContent.querySelector('#viewer > div:nth-child(1) > div.textLayer > span:nth-child(28)').textContent;

                    // 创建弹出窗口并输出过滤后的值
//                    var popupWindow = window.open('', 'popupWindow', 'width=800,height=500');
//                    popupWindow.document.write('收件人信息: ' + '</p>');
//                    popupWindow.document.write(value1 + '</p>');
//                    popupWindow.document.write(value2 + '</p>');
//                    popupWindow.document.write(value3 + '</p>');
//                    popupWindow.document.write(value4 + '</p>');
//                    popupWindow.document.write(value5 + '</p>');
//                }
//             });

//         } else if (iframes.length == 0 && viewbuttonInserted) {
            // 如果选择器不存在且按钮已插入，删除按钮
//            const viewbuttonToRemove = document.getElementById('myviewButton');
//            if (viewbuttonToRemove) {
//                viewbuttonToRemove.remove();
//            }
//            viewbuttonInserted = false;
//        }
        // 无论是否插入或删除按钮，都在1秒后再次检查
//        setTimeout(checkIframe, 1000);
//    }

    // 首次调用函数
//    checkIframe();


    // 监听是否点击了下载按钮
    document.addEventListener('click', function(e) {

        // 检查点击的元素是否为下载链接
        var target = e.target;
        //如果是下载链接，且下载链接为blob格式
        if (target.tagName === 'A' && target.href.startsWith('blob:')) {
            // 获取申请号
            const selector1 = window.parent.document.querySelector('#q-app > div > div > div.q-page-container > main > div > div.content > div.hm > strong').textContent.match(/[\w\d]+/g).join('');
            // 获取通知书名称
            const selector2 = window.parent.document.querySelector('#q-app > div > div > div.q-page-container > main > div > div.content > div.row.boxRow > div.table > div > div:nth-child(1) > p').textContent.replace(/-/g, '').replace(/\[.*?\]/g, '').replace(/首页/g, '').match(/[\u4e00-\u9fa5-zA-Z]+/g).join('');
            // 合申请号和通知书名称作为文件名称
            const newFileName = `${selector1}-${selector2}`;
            //用输入的文件名对下载的文件命名
            target.download = newFileName || '专利通知书';

        }
    });


    //下载图片格式通知书并合并成PDF

    // 标记是否已插入按钮
    let buttonInserted = false;

    function checkSelector() {

        // 判断是否存在图片格式通知书
        const selectorExists = document.querySelector('#q-app > div > div > div.q-page-container > main > div > div.content > div.row.boxRow > div.table > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > img');

        //如果存在图片格式通知书且未插入按钮，则插入下载按钮
        if (selectorExists && !buttonInserted) {
            // 创建下载按钮
            const downloadButton = document.createElement('button');
            // 给按钮一个唯一的ID以便于识别和删除
            downloadButton.id = 'myCustomButton';
            // 按钮属性
            downloadButton.textContent = '下载通知书';
            downloadButton.style.position = 'fixed';
            downloadButton.style.top = '80px';
            downloadButton.style.right = '20px';
            //downloadButton.style.transform = 'translateY(-50%)';
            downloadButton.style.zIndex = '10000';
            //downloadButton.style.backgroundColor = '#4CAF50';
            //downloadButton.style.border = 'none';
            //downloadButton.style.borderRadius = '5px';
            //downloadButton.style.color = 'white';
            //downloadButton.style.fontSize = '16px';
            //downloadButton.style.padding = '2px 2px';
            downloadButton.style.cursor = 'pointer';
            document.body.appendChild(downloadButton);
            // 标记已插入按钮
            buttonInserted = true;

            // 设置按钮动作
            downloadButton.addEventListener('click', async () => {
                // 找到所有通知书图片
                const pngImages = document.querySelectorAll('#q-app > div > div > div.q-page-container > main > div > div.content > div.row.boxRow > div.table > div > div:nth-child(2) > div:nth-child(2) > div > div > div > img');
                // 提取页面上的申请号和通知书名称
                const filename1 = document.querySelector('#q-app > div > div > div.q-page-container > main > div > div.content > div.hm > strong').textContent.match(/[\w\d]+/g).join('');
                const filename2 = document.querySelector('#q-app > div > div > div.q-page-container > main > div > div.content > div.row.boxRow > div.table > div > div:nth-child(1) > p').textContent.replace(/-/g, '').replace(/\[.*?\]/g, '').replace(/首页/g, '').match(/[\u4e00-\u9fa5-zA-Z]+/g).join('');
                // 执行合并为PDF的函数
                imagesToPDF(pngImages, filename1, filename2);

            });

        } else if (!selectorExists && buttonInserted) {
            // 如果选择器不存在且按钮已插入，删除按钮
            const buttonToRemove = document.getElementById('myCustomButton');
            if (buttonToRemove) {
                buttonToRemove.remove();
            }
            buttonInserted = false;
        }
        // 无论是否插入或删除按钮，都在1秒后再次检查
        setTimeout(checkSelector, 1000);
    }

    // 首次调用函数
    checkSelector();

    // 将所有加载的通知书图片合并为PDF
    async function imagesToPDF(srcList, filename1, filename2) {
       const pdf = new jspdf.jsPDF({ unit: 'px' });
       for (let i = 0; i < srcList.length; i++) {
         const imgSrc = srcList[i].src;
         try {
           const img = new Image();
           img.src =imgSrc;
           const pageWidth = pdf.internal.pageSize.getWidth();
           const pageHeight = pdf.internal.pageSize.getHeight();
           const imgAspectRatio = img.width / img.height;
           let imgWidth = pageWidth;
           let imgHeight = pageWidth / imgAspectRatio;
           pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
             if (i < srcList.length - 1) {
               pdf.addPage();
             }
        } catch (error) {
             console.error(`图片加载失败：${imgSrc}`, error);
        }
        }
      pdf.save(`${filename1}-${filename2}.pdf`);
    }


})();
