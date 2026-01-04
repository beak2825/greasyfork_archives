// ==UserScript==
// @name                正方教务教学评价填写（改，方便用户）
// @version             0.1
// @description         正方教务（默认唐职），自己学校可在代码@match 自行更改
// @author              原作者：JHPatchouli
// @author              改：鹏
// @match               *://*vpn.tsvtc.edu.cn/*
// @namespace https://greasyfork.org/users/768235
// @downloadURL https://update.greasyfork.org/scripts/520993/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%A1%AB%E5%86%99%EF%BC%88%E6%94%B9%EF%BC%8C%E6%96%B9%E4%BE%BF%E7%94%A8%E6%88%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520993/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%A1%AB%E5%86%99%EF%BC%88%E6%94%B9%EF%BC%8C%E6%96%B9%E4%BE%BF%E7%94%A8%E6%88%B7%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    const sleep = (delay) => new Promise((resolve) => SetTimeout(resolve, delay));

    let divObj = document.createElement('div');
    
    // 生成按钮HTML
    divObj.innerHTML = `
        <button id="btna" class="custom-btn">很满意</button>
        <button id="btnb" class="custom-btn">满意</button>
        <button id="btnc" class="custom-btn">一般</button>
        <button id="btnd" class="custom-btn">不满意</button>
        <button id="btne" class="custom-btn">很不满意</button>
        <button id="btnf" class="custom-btn special-btn">大部分很满意，1个满意</button>
        <button id="btnMemory" class="custom-btn">记忆评分</button>
        <button id="btnPaste" class="custom-btn">粘贴评分</button>
        <button id="btnScrollToBottom" class="custom-btn">↓定位到提交↓</button>
    `;

    // 给容器设置样式
    divObj.style = `
        position: fixed;
        z-index: 999;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        text-align: center;
        width: 100%;
    `;

    // 给页面添加按钮容器
    document.body.appendChild(divObj);

    // 自定义按钮样式
    const styles = `
        .custom-btn {
            width: 120px;
            height: 45px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .custom-btn:hover {
            background-color: #45a049;
            transform: translateY(-3px);
        }

        .custom-btn:active {
            background-color: #3e8e41;
            transform: translateY(1px);
        }

        .custom-btn:focus {
            outline: none;
        }

        .special-btn {
            background-color: #FF9800;
        }

        .special-btn:hover {
            background-color: #FB8C00;
        }

        .special-btn:active {
            background-color: #F57C00;
        }
    `;

    // 添加样式到页面头部
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // 按钮点击事件
    btna.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 0; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";
        }
        await sleep(4000);
    });

    btnb.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 1; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";
        }
        await sleep(4000);
    });

    btnc.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 2; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";
        }
        await sleep(4000);
    });

    btnd.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 3; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";
        }
        await sleep(4000);
    });

    btne.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 4; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";
        }
        await sleep(4000);
    });

    btnf.addEventListener('click', async function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        for (let i = 0; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";  // 选择"很满意"
        }
        for (let i = 1; i < docle; i += 5) {
            const elemen = doc[i];
            elemen.checked = "true";  // 选择第一个"满意"
            break;  // 只选择第一个满意
        }
        await sleep(4000);
    });

    btnMemory.addEventListener('click', function () {
        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        var selectedValues = [];
        
        // 获取当前选中的评分
        for (let i = 0; i < docle; i++) {
            selectedValues.push(doc[i].checked ? doc[i].value : null);
        }

        // 将选中的评分结果存储到 localStorage
        localStorage.setItem('savedRatings', JSON.stringify(selectedValues));
        alert("评分已记忆！");
    });

    btnPaste.addEventListener('click', function () {
        var savedRatings = localStorage.getItem('savedRatings');
        if (!savedRatings) {
            alert("没有记忆的评分！");
            return;
        }

        var doc = document.getElementsByClassName("radio-pjf");
        var docle = doc.length;
        var savedValues = JSON.parse(savedRatings);

        // 恢复之前保存的评分
        for (let i = 0; i < docle; i++) {
            if (savedValues[i] && doc[i].value === savedValues[i]) {
                doc[i].checked = true;
            }
        }

        alert("评分已粘贴！");
    });

    btnScrollToBottom.addEventListener('click', function () {
        // 直接滚动到页面最底部
        window.scrollTo(0, document.body.scrollHeight);
    });

    // 页面加载时自动选择最大条目数
    window.addEventListener('load', function () {
        // 查找 <select> 元素
        const selectElement = document.querySelector('.ui-pg-selbox');

        if (selectElement) {
            // 获取所有 <option> 元素
            const options = selectElement.querySelectorAll('option');
            let maxOption = options[0];

            // 遍历选项，找到最大值的 option
            options.forEach(option => {
                if (parseInt(option.value) > parseInt(maxOption.value)) {
                    maxOption = option;
                }
            });

            // 设置为最大值选项
            selectElement.value = maxOption.value;

            // 触发 change 事件来应用选择
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
        }
    });
})();
