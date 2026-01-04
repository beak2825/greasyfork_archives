// ==UserScript==
// @name         b站评论自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动化实现，效率低但是绝对安全，放心使用
// @author       口吃者
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522286/b%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/522286/b%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
var targetAmountGlobal = 100;
var lastArrayLen;
(function () {
    'use strict';
    window.addEventListener('load', addPanel);

})();
/* 父级评论点赞，点赞时移动到评论元素中心点 */
async function clickCommentsAuto(targetAmount) {
    /* 获取所有父级评论元素数组
        全部执行完时再次获取，以此往复
    */
    var alreadyClicked = 0;
    while (alreadyClicked < targetAmount) {
        alreadyClicked = await clickComments(alreadyClicked);
        if (alreadyClicked < targetAmount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后再尝试
        }
    }
}
async function clickComments(alreadyClicked) {
    // 使用链式调用和可选链操作符来简化元素查找过程
    const feedElement = document.querySelector('#commentapp > bili-comments')?.shadowRoot?.querySelector('#feed');
    if (!feedElement) return alreadyClicked;

    // 直接遍历所有需要的元素，同时尽量减少对shadowRoot的访问次数
    var commentThreads = [...feedElement.querySelectorAll('bili-comment-thread-renderer')];
    if(lastArrayLen){
        const lengthNew = Math.max(0, commentThreads.length - lastArrayLen);
        commentThreads = [...commentThreads.slice(lengthNew)]
    }

    for (const shadowRootEle of commentThreads) {
        const likeButtonContainer = shadowRootEle.shadowRoot?.querySelector('bili-comment-renderer')?.shadowRoot?.querySelector('#footer > bili-comment-action-buttons-renderer');
        if (!likeButtonContainer) continue;

        const likeButton = likeButtonContainer.shadowRoot?.querySelector('#like button');
        if (!likeButton) continue;
        // 平滑滚动到点赞按钮位置
        await scrollToElement(likeButton);
        // 只有当点赞图标为未点赞状态时才进行操作
        if (likeButton.querySelector('bili-icon')?.getAttribute('icon') === 'BDC/hand_thumbsup_line/1') {
            // 模拟点击点赞按钮
            likeButton.click();
            alreadyClicked += 1;
        }
    }
    lastArrayLen = commentThreads.length;
    return alreadyClicked;
}

// 辅助函数：平滑滚动到元素中心点
function scrollToElement(element) {
    return new Promise((resolve) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 等待滚动动画完成
        setTimeout(resolve, 500); // 假设滚动动画持续时间不超过500ms
    });
}
function addPanel() {
    function genButton(text, foo, id, fooParams = {}) {
        let b = document.createElement('button');
        b.textContent = text;
        b.style.verticalAlign = 'inherit';
        // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
        b.addEventListener('click', () => {
            foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
        });
        if (id) { b.id = id };
        return b;
    }

    function changeRangeDynamics() {
        const value = parseInt(this.value, 10);
        const roundedValue = Math.ceil(value / 10) * 10;

        targetAmountGlobal = roundedValue;
        // 只能通过 DOM 方法改变
        document.querySelector('#swal-range > output').textContent = roundedValue;
    }

    async function openPanelFunc() {
        let isLoadEnd = false;
        targetAmountGlobal = 100;
        var swalRangeValue = 100;
        setTimeout(() => {
            isLoadEnd = true;
        }, 13000);
        const { value: formValues } = await Swal.fire({
            title: "最大点赞数",
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            //class="swal2-range" swalalert框架可能会对其有特殊处理，导致其内标签的id声明失效
            html: `
              <div class="swal2-range" id="swal-range" style="display: flex;">
                <input type="range" min="0" max="500" step="10" value="100">
                <output>${swalRangeValue}</output>
              </div>
            `,
            focusConfirm: false,
            didOpen: () => {
                const swalRange = document.querySelector('#swal-range input');
                swalRange.addEventListener('input', changeRangeDynamics);
            },
            willClose: () => {
                // 在关闭前清除事件监听器以防止内存泄漏
                const swalRange = document.querySelector('#swal-range input');
                swalRange.removeEventListener('input', changeRangeDynamics);
            },
            preConfirm: () => {
                return [
                    targetAmountGlobal
                ];
            }
        });
        if (formValues) {
            targetAmountGlobal = formValues[0];
            clickCommentsAuto(targetAmountGlobal);
        }
    }

    let myButton = genButton('CMlike', openPanelFunc, 'CMlike');
    document.body.appendChild(myButton);

    var css_text = `
        #CMlike {
            position: fixed;
            top: 70%;
            left: -20px;/* 初始状态下左半部分隐藏 */
            transform: translateY(-50%);
            z-index: 1000; /* 确保按钮在最前面 */
            padding: 10px 24px;
            border-radius: 5px;
            cursor: pointer;
            border: 0;
            background-color: white;
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 9px;
            transition: all 0.5s ease;
        }
        #CMlike:hover {
            left: 0%; /* 鼠标悬停时完整显示 */
            letter-spacing: 3px;
            background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
            box-shadow: rgba(211, 67, 235, 0.7) 0px 7px 29px 0px; /* 更柔和的紫色阴影，带透明度 */
        }
        
        #CMlike:active {
            letter-spacing: 3px;
            background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
            box-shadow: rgba(211, 67, 235, 0.5) 0px 0px 0px 0px; /* 活动状态下的阴影，保持一致性 */
            transition: 100ms;
        }
    `
    GMaddStyle(css_text);
}

function GMaddStyle(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}