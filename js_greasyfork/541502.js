// ==UserScript==
// @name         riddle saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  保存验证码图片功能
// @author       ayasechan
// @match        https://hentaiverse.org/*
// @match        http://alt.hentaiverse.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541502/riddle%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/541502/riddle%20saver.meta.js
// ==/UserScript==

(function () {


    // 获取已勾选的答案
    function getSelectedAnswers() {
        const checkboxes = document.querySelectorAll('input[name="riddleanswer[]"]:checked');
        const answers = [];
        checkboxes.forEach(checkbox => {
            answers.push(checkbox.value);
        });
        return answers.join('_');
    }

    // 处理跨域图片
    function downloadCrossOriginImage(imgSrc, filename) {
        fetch(imgSrc)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;

                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('下载图片失败:', error);

            });
    }

    // 主要功能
    function initRiddleSaver() {
        // 查找原始提交按钮
        const originalSubmitBtn = document.querySelector('#riddlesubmit');
        if (!originalSubmitBtn) {
            console.log('未找到原始提交按钮');
            return;
        }

        // 隐藏原始提交按钮
        originalSubmitBtn.style.display = 'none';

        // 查找验证码图片
        const riddleImg = document.querySelector('#riddleimage img');
        if (!riddleImg) {
            console.log('未找到验证码图片');
            return;
        }

        // 创建新的按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '10px';

        // 创建保存并提交按钮
        const saveAndSubmitBtn = document.createElement('input');
        saveAndSubmitBtn.type = 'button';
        saveAndSubmitBtn.value = '保存图片并提交';
        saveAndSubmitBtn.style.padding = '8px 16px';
        saveAndSubmitBtn.style.fontSize = '14px';
        saveAndSubmitBtn.style.backgroundColor = '#4CAF50';
        saveAndSubmitBtn.style.color = 'white';
        saveAndSubmitBtn.style.border = 'none';
        saveAndSubmitBtn.style.borderRadius = '4px';
        saveAndSubmitBtn.style.cursor = 'pointer';
        saveAndSubmitBtn.style.marginRight = '10px';


        // 保存图片的通用函数
        function saveImage(submitAfter = false) {
            const selectedAnswers = getSelectedAnswers();
            if (!selectedAnswers) {
                alert('请先选择答案！');
                return;
            }

            const filename = `riddle_${selectedAnswers}_${Date.now()}.jpg`;
            downloadCrossOriginImage(riddleImg.src, filename);



            // 如果需要提交，延迟一下再提交
            if (submitAfter) {
                setTimeout(() => {
                    originalSubmitBtn.click();
                }, 500);
            }
        }

        // 绑定点击事件
        saveAndSubmitBtn.addEventListener('click', () => saveImage(true));


        // 添加按钮到容器
        buttonContainer.appendChild(saveAndSubmitBtn);


        // 将按钮容器插入到原始按钮的位置
        originalSubmitBtn.parentNode.insertBefore(buttonContainer, originalSubmitBtn);

        console.log('验证码保存器已初始化');
    }

    // 等待页面元素加载完成后初始化
    initRiddleSaver();

})();