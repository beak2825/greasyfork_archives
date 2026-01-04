// ==UserScript==
// @name         【正方教务】学期教学质量自动评价
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  复习JavaScript时写的小玩意儿，可以自动完成正方教务学期教学质量。
// @author       LoveX2095
// @match        *://*
// @resource     bootstrap https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481857/%E3%80%90%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E3%80%91%E5%AD%A6%E6%9C%9F%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/481857/%E3%80%90%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E3%80%91%E5%AD%A6%E6%9C%9F%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 判断页面是否存在填写表单
    if (document.querySelector("body.combody form#Form1 .formbox") === null) {
        console.log("不在评价页面");
        return;
    }

    //加载外部CSS，资源已在上方resource中
    const newCSS = GM_getResourceText("bootstrap");
    GM_addStyle(newCSS);

    // 获取元素
    function getNodeElement(callback) {
        const time = setInterval(function () {
            const iframe_son = document.querySelector('.toolbox1');
            const iframe = iframe_son.parentNode.parentNode;

            if (iframe != null) {
                clearInterval(time);
                callback(iframe);
            }
        }, 2000)
    }

    // 获取选项元素并设置为优
    function setOptionValue(iframe) {
        const selects = iframe.querySelectorAll('table#DataGrid1 tbody tr td select');
        selects.forEach((selectElement) => {
            const options = selectElement.querySelectorAll('option');
            options.forEach((option) => {
                if (option.value === '优') {
                    if (option.selected === true) {
                        return;
                    }
                    option.selected = true;
                }
            });
        });
    }

    // 获取当前课程列表索引长度
    function getCurrentClassListIndexLength(iframe) {
        const classLists = iframe.querySelectorAll('.srhbox select.form-control option');
        let selectedIndex = 0;
        classLists.forEach((item, index) => {
            if (item.selected === true) {
                selectedIndex = index;
                return; // 如果找到选中项，则提前退出循环
            }
        })
        return selectedIndex;
    }

    // 设置评价
    function setEvaluate(iframe) {
        const textInput = iframe.querySelector('.formbox .search-btn textarea[name="pjxx"]');
        const teacherName = iframe.querySelector('.portallet table#DataGrid1 tbody tr.datelisthead td[valign="middle"]').innerHTML;
        textInput.innerHTML = `
        ${teacherName}老师很棒，课程中幽默风趣
        `
    }

    // 保存
    function save(iframe) {
        const btn = iframe.querySelector('.search-btn input[name="Button1"]');
        btn.click();
        return true;
    }

    // 初始化
    function initialize() {
        getNodeElement(function (iframe) {
            // 获取到课程列表
            console.log("运行")
            if (localStorage.getItem('pageRefreshed') === 'true') {
                localStorage.setItem('pageRefreshed', false);
                addMotal(iframe);
                const closeBtn = iframe.querySelector('.tip-motal .card');
                closeBtn.addEventListener('click', (e) => {
                    if (e.target.tagName === 'BUTTON') {
                        closeBtn.closest('.tip-motal').style.display = 'none';
                    }
                });
                console.log(closeBtn);
                console.log("脚本运行完成");
                return;
            }
            const iframe_selects = iframe.querySelectorAll('select[name="pjkc"] option');
            let index = getCurrentClassListIndexLength(iframe);
            const indexMax = iframe.querySelectorAll('select[name="pjkc"] option').length;
            // 设置选项为优
            setOptionValue(iframe);

            // 设置评价语
            setEvaluate(iframe)

            // 保存
            console.log(index);
            console.log(indexMax);
            if (index === indexMax - 1) {
                localStorage.setItem('pageRefreshed', true);
                save(iframe)
            } else {
                save(iframe)
            }
        });
    }

    initialize()

    // 添加模态框
    function addMotal(body) {
        const motalMark = document.createElement('div');
        motalMark.style.position = "absolute";
        motalMark.style.top = "0px";
        motalMark.style.display = "flex";
        motalMark.style.zIndex = "9999";
        motalMark.style.width = "100vw";
        motalMark.style.height = "100vh";
        motalMark.style.background = "rgba(0,0,0,0.5)";
        motalMark.style.justifyContent = "center";
        motalMark.style.alignItems = "center";
        motalMark.classList.add('tip-motal');
        motalMark.innerHTML = `
        <div
      class="container w-25 justify-content-center align-items-center"
    >
      <div class="card shadow-sm p-3">
        <div class="card-body">
          <h4 class="card-title">提示</h4>
          <p class="card-text text-secondary">自动评价已完成，请检查后提交！</p>
          <div class="btns d-flex justify-content-end px-4">
            <button class="btn btn-sm btn-primary">关闭</button>
          </div>
        </div>
      </div>
    </div>
        `
        body.appendChild(motalMark);
    }
})();