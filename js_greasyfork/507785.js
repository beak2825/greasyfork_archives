// ==UserScript==
// @name         锤子简历
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  Adds buttons to save resume content as an image or PDF
// @author       xiaomustudent
// @match        https://www.100chui.com/resume/edit/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507785/%E9%94%A4%E5%AD%90%E7%AE%80%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/507785/%E9%94%A4%E5%AD%90%E7%AE%80%E5%8E%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个li元素
    const li = document.createElement('li');
    const li2 = document.createElement('li');


    // 创建PNG按钮
    const pngButton = document.createElement('button');
    pngButton.innerText = 'PNG';
    pngButton.style.backgroundColor = '#4CAF50'; // 绿色背景
    pngButton.style.color = 'white';
    pngButton.style.border = 'none';
    pngButton.style.borderRadius = '5px';
    pngButton.style.padding = '10px';
    pngButton.style.marginBottom  = '20px';
    pngButton.style.cursor = 'pointer';
    pngButton.style.width = '48px';

    // 创建PDF按钮
    const pdfButton = document.createElement('button');
    pdfButton.innerText = 'PDF';
    pdfButton.style.backgroundColor = '#4CAF50'; // 绿色背景
    pdfButton.style.color = 'white';
    pdfButton.style.border = 'none';
    pdfButton.style.borderRadius = '5px';
    pdfButton.style.padding = '10px';
    pdfButton.style.marginBottom  = '20px';
    pdfButton.style.cursor = 'pointer';
    pdfButton.style.width = '48px';

    // 将按钮添加到li中
    li.appendChild(pngButton);
    li2.appendChild(pdfButton);

    // 将li添加到class为right_opt_item的div中
    const rightOptItem = document.querySelector('.right_opt_item');
    if (rightOptItem) {
        rightOptItem.appendChild(li);
        rightOptItem.appendChild(li2);

    }

    // 获取姓名内容
    const nameDiv = document.querySelector('.name');
    const nameContent = nameDiv ? nameDiv.textContent.trim() : 'XX'; // 默认值为'XX'


    // PNG按钮点击事件
    pngButton.addEventListener('click', function() {
        html2canvas(document.querySelector('.resume_main'), {
            useCORS: true,
            scale: 2, // 提高清晰度
            width:830.8080808080808080,
            height:1175
        }).then(function(canvas) {
            const link = document.createElement('a');
            link.download = `${nameContent}的简历图片.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // PDF按钮点击事件
    pdfButton.addEventListener('click', function() {
        html2canvas(document.querySelector('.resume_content.clearfix'), {
            useCORS: true,
            scale: 2, // 提高清晰度
            width:830.8080808080808080,
            height:1175
        }).then(function(canvas) {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf; // 正确获取jsPDF构造函数
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4宽度
            const pageHeight = 297; // A4高度
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight-5;

            let position = 0;

            // 将图片添加到PDF中
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${nameContent}的简历PDF.pdf`);
        });
    });

    // 引入html2canvas和jsPDF库
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(html2canvasScript);

    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(jsPDFScript);
})();