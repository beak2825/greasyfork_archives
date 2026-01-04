// ==UserScript==
// @name         自留选课助手
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  过滤选课列表，只显示目标课程，实时高亮课程名额状态，支持一键识别验证码
// @author       Erix
// @license      MIT
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/supplement.jsp*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/electSupplement.do*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/cancelCourse.do*
// @icon         https://www.pku.edu.cn/pku_logo_red.png
// @grant        GM_xmlhttpRequest
// @connect      api.ttshitu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527423/%E8%87%AA%E7%95%99%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527423/%E8%87%AA%E7%95%99%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ******************** 以下 4 项内容需要填写 ********************

    // 1. 填写想抢的课程名与班号，在每页中只会显示 allowedCourses 中的课程，但如果这些课程
    //    分布在不同的页上，仍然需要手动换页来查看。同一个课程名对应的班号（无论一个还是多个）
    //    需要写在数组（方括号）中。
    /*const allowedCourses = {
        '现代奇幻冒险文学选读': [1],
        '学术英语阅读': [1],
        '中级微观经济学': [2],
    };*/
    let allowedCourses = JSON.parse(localStorage.getItem('allowedCourses')) || {
        '现代奇幻冒险文学选读': [1],
        '学术英语阅读': [1],
        '中级微观经济学': [2],
    };

    // 2. 是否禁止表格的行在光标位于其上时变成黄绿色（true/false）
    const banColorChange = true;

    // 3. 课程有名额、无名额时在“限数/已选”栏显示的背景颜色和文本颜色，默认依次为浅绿、深绿、浅红、深红
    const underLimitStyle = 'background-color: #abebc6; color: #145a32';
    const reachLimitStyle = 'background-color: #f5b7b1; color: #7b241c';

    // 4. 填写 TT 识图账号的用户名和密码（http://www.ttshitu.com/，请确保账户有余额）
    const recognizerConfig = {
        username: 'ErikLans',
        password: 'ttshitu3412',
    };

    // ******************** 以上 4 项内容需要填写 ********************

    const table = document.querySelector('table.datagrid');
    const rows = table.querySelectorAll('tr.datagrid-even,tr.datagrid-odd');
    let visibleRows = [];

    // Hide unnecessary courses
    rows.forEach(row => {
        const courseName = row.children[0].textContent.trim();
        const classNumber = parseInt(row.children[5].textContent.trim());

        // 创建“关注”按钮
        //const newTd = document.createElement('td');
        //newTd.className = 'datagrid';
        //newTd.setAttribute('align','center');

        // 设置 class 和 align 属性
        const firstTd = row.children[7];
        const spanElement = firstTd.querySelector('span');
        spanElement.textContent='';
        const followBtn = document.createElement('button');
        followBtn.style.fontSize = '12px';
        if (courseName in allowedCourses && allowedCourses[courseName].includes(classNumber)) {
            followBtn.textContent = '取关';
            followBtn.style.backgroundColor = '#FFE4B5';
        } else {
            followBtn.textContent = '关注';
        }
        followBtn.style.cursor = 'pointer';

        // 设置按钮的点击事件
        followBtn.onclick = () => {
            if (followBtn.textContent === '取关') {
                allowedCourses[courseName] = allowedCourses[courseName].filter(item => item !== classNumber); // 移除 classNumber
                followBtn.textContent = '关注'; // 更改按钮文本为“关注”
                followBtn.style.cssText = 'cursor: pointer; font-size: 12px;';
                if (allowedCourses[courseName].length === 0) {
                    delete allowedCourses[courseName];
                }
            }else{
                // 确保 allowedCourses 中有该课程
                if (!(courseName in allowedCourses)) {
                    allowedCourses[courseName] = []; // 如果课程不存在，则初始化为空数组
                }

                // 确保 classNumber 不重复
                if (!allowedCourses[courseName].includes(classNumber)) {
                    allowedCourses[courseName].push(classNumber); // 将 classNumber 添加到该课程中
                }
                followBtn.textContent = '取关';
                followBtn.style.backgroundColor = '#FFE4B5';
            }

            localStorage.setItem('allowedCourses', JSON.stringify(allowedCourses));
            updateVisibleRows();
            console.log(allowedCourses); // 打印当前的 allowedCourses
        };

        firstTd.insertBefore(followBtn, spanElement);
        //newTd.appendChild(followBtn);
        //row.appendChild(newTd);

        if (courseName in allowedCourses && allowedCourses[courseName].includes(classNumber)) {
            visibleRows.push(row);
        } /*else {
            row.style.display = 'none';
        }*/

    });

    function updateVisibleRows() {
        // 清空 visibleRows
        visibleRows = [];

        rows.forEach(row => {
            const courseName = row.children[0].textContent.trim();
            const classNumber = parseInt(row.children[5].textContent.trim());

            // 判断该课程是否在 allowedCourses 中
            if (courseName in allowedCourses && allowedCourses[courseName].includes(classNumber)) {
                visibleRows.push(row);
            } /*else {
                row.style.display = 'none';
            }*/
            row.children[9].style = ''; // 显示该行
        });
        //console.log(visibleRows);
        visibleRows.forEach(row => {
            const numCell = row.children[9]; // <td><span id='electedNum**'>* / *</span></td>
            const refreshCell = row.children[10].children[0];
            // <a><span>补选</span></a>, <a id='refreshLimit**'><span>刷新</span></a>

            // numCell.children[0].style.fontSize = '13px';
            if (refreshCell.textContent.trim() === '补选') {
                numCell.style.cssText = underLimitStyle;
            } else {
                numCell.style.cssText = reachLimitStyle;

                // function refreshLimit() in supplement.js:
                //    var aTag = $('#refreshLimit' + index + index); aTag.html( '<span>补选</span>'); ...
                //
                //    When the latest refresh request indicates that elected < limit, the innerHTML
                // of refreshCell changes, and results in a childList mutation. I don't want to observe
                // numCell, since every refresh request will reset the 'limit/elected' string no matter
                // it has changed or not, which would be too frequent to observe.
                const observer = new MutationObserver((mutationList, observer) => {
                    numCell.style.cssText = underLimitStyle;
                    observer.disconnect();
                    // The text won't be changed again, since clicking '补选' won't trigger refreshLimit()
                });
                observer.observe(refreshCell, { childList: true });
            }
        });
    }

    // 页面加载时，先更新显示
    updateVisibleRows();

    // Reset the color style for visible rows and optionally cancel color changes
    /*visibleRows.forEach((row, index) => {
        const newClass = index % 2 === 0 ? 'datagrid-even' : 'datagrid-odd';
        row.className = newClass;
        if (banColorChange) {
            row.onmouseover = null;
            row.onmouseout = null;
        }
        else {
            row.onmouseover = () => {
                row.className = 'datagrid-all';
            };
            row.onmouseout = () => {
                row.className = newClass;
            };
        }
    });*/

    // Set the color style for 'limit/elected' grids and change a grid from red to
    // green when its corresponding '刷新' becomes '补选'
    visibleRows.forEach(row => {
        const numCell = row.children[9]; // <td><span id='electedNum**'>* / *</span></td>
        const refreshCell = row.children[10].children[0];
        // <a><span>补选</span></a>, <a id='refreshLimit**'><span>刷新</span></a>

        // numCell.children[0].style.fontSize = '13px';
        if (refreshCell.textContent.trim() === '补选') {
            numCell.style.cssText = underLimitStyle;
        } else {
            numCell.style.cssText = reachLimitStyle;

            // function refreshLimit() in supplement.js:
            //    var aTag = $('#refreshLimit' + index + index); aTag.html( '<span>补选</span>'); ...
            //
            //    When the latest refresh request indicates that elected < limit, the innerHTML 
            // of refreshCell changes, and results in a childList mutation. I don't want to observe
            // numCell, since every refresh request will reset the 'limit/elected' string no matter
            // it has changed or not, which would be too frequent to observe.
            const observer = new MutationObserver((mutationList, observer) => {
                numCell.style.cssText = underLimitStyle;
                observer.disconnect();
                // The text won't be changed again, since clicking '补选' won't trigger refreshLimit()
            });
            observer.observe(refreshCell, { childList: true });
        }
    });

    // Get the base64 form of the captcha image (mostly by DeepSeek)
    function getBase64Data() {
        const image = document.querySelector('#imgname');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/jpeg').split(',')[1]; // 'data:image/jpeg;base64,***...'
    }

    // Write the validation code into the input box
    function setValidationCode(code) {
        const inputBox = document.querySelector('#validCode');
        inputBox.value = code.slice(0, 5);
    }

    // Send a cross-domain request to recognize the captcha image
    function recognizeImage() {
        const base64 = getBase64Data();
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.ttshitu.com/predict',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                username: recognizerConfig.username,
                password: recognizerConfig.password,
                typeid: '1003',
                image: base64
            }),
            onload: (res => {
                try {
                    const response = JSON.parse(res.response);
                    if (response.success) {
                        setValidationCode(response.data.result);
                    } else {
                        alert('识别验证码失败：' + response.message);
                    }
                } catch (e) {
                    alert('识图响应解析失败：' + e);
                }
            })
        });
    }

    // Create a button for recognization and insert it before the input box
    const btn = document.createElement('button');
    btn.textContent = '识别验证码';
    btn.style.cssText = 'margin-left: 5px; margin-right: 10px; padding: 2px 8px; cursor: pointer';
    btn.onclick = recognizeImage;

    const inputBox = document.querySelector('#validCode');
    inputBox.value = ''; // Clear the cached value
    inputBox.parentNode.insertBefore(btn, inputBox);

})();