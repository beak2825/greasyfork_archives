// ==UserScript==
// @name         立刻警戒
// @namespace    https://ez118.github.io/
// @version      0.3.3
// @description  点击按钮或Ctrl+Shift+C快速隐藏所有标签页内容，并用其他页面覆盖以伪装、自动暂停媒体。
// @author       ZZY_WISU
// @match        *://*/*
// @license      GPLv3
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjUgMTNIOHYtM2gyLjVWNy41aDNWMTBIMTZ2M2gtMi41djIuNWgtM3pNMTIgMiA0IDV2Ni4wOWMwIDUuMDUgMy40MSA5Ljc2IDggMTAuOTEgNC41OS0xLjE1IDgtNS44NiA4LTEwLjkxVjV6IiBmaWxsPSIjMWRiNDU5Ij48L3BhdGg+PC9zdmc+
// @run-at       document-end
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/503038/%E7%AB%8B%E5%88%BB%E8%AD%A6%E6%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/503038/%E7%AB%8B%E5%88%BB%E8%AD%A6%E6%88%92.meta.js
// ==/UserScript==

/* =====[ 用户自定义 ]===== */

const CompatibilityMode = false;

const DICT = [
    {
        "title":"腾讯网-QQ.COM",
        "url":"https://xw.qq.com/"
    },
    {
        "title":"凤凰网",
        "url":"https://www.ifeng.com/"
    },
    {
        "title":"w3school 在线教程",
        "url":"https://www.w3school.com.cn/"
    },
    {
        "title":"jQuery css() 方法 | 菜鸟教程",
        "url":"https://www.runoob.com/jquery/jquery-css.html"
    },
    {
        "title":"生命周期钩子 | Vue.js",
        "url":"https://cn.vuejs.org/guide/essentials/lifecycle.html"
    },
    {
        "title":"新浪网",
        "url":"https://www.sina.com.cn/"
    },
    {
        "title":"搜狐",
        "url":"https://www.sohu.com/"
    },
    {
        "title":"哔哩哔哩热门",
        "url":"https://www.bilibili.com/v/popular/all/"
    },
    {
        "title":"网易新闻",
        "url":"https://news.163.com/"
    },
    {
        "title":"精华区 - 博客园",
        "url":"https://www.cnblogs.com/pick/"
    },
    {
        "title":"蓝奏云-云存储",
        "url":"https://pc.woozooo.com/"
    },
    {
        "title":"少数派编辑部 的创作 - 少数派",
        "url":"https://sspai.com/u/ee0vj778/posts"
    },
    {
        "title":"36氪 让一部分人先看到未来",
        "url":"https://www.36kr.com/"
    },
];


/* =====[ 变量存储 ]===== */
const ICONS = {
    'safety': '<svg viewBox="0 0 24 24" width="20px" height="20px"><path d="M10.5 13H8v-3h2.5V7.5h3V10H16v3h-2.5v2.5h-3zM12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5z" fill="#FFF"></path></svg>'
};

var origTitle = "";


function randomInt(min, max) {
    /* 固定范围内的随机整数 */

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showToast(message, duration) {
    /* 内建Toast显示函数 */

    duration = duration || 3000;
    const toast = document.createElement('div');
    toast.id = 'userscript-instantToast';
    toast.textContent = message;

    document.body.appendChild(toast);
    toast.style.display = 'block';

    setTimeout(function () {
        toast.style.display = 'none';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 100);
    }, duration);
}

function showCover() {
    /* 显示伪装遮罩 */

    /* 若遮罩已存在，则不再创建 */
    if(document.getElementById("userscript-superMask")) { return; }

    /* 创建元素 */
    const superMask = document.createElement('iframe');
    superMask.className = 'userscript-superMask';
    superMask.id = 'userscript-superMask';
    superMask.style.display = 'none';
    document.body.appendChild(superMask);

    superMask.style.display = 'block';

    /* 随机选取伪装页面，设置iframe的src、页面标题 */
    const randIndex = randomInt(1, DICT.length) - 1;
    superMask.src = DICT[randIndex].url;
    document.title = DICT[randIndex].title;

    /* 快速暂停所有视频音频 */
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach(media => {
        if (!media.paused) {
            media.pause();
        }
    });

    /* 删去图标 */
    document.querySelector('link[rel="icon"]').setAttribute("href", "data:image/webp;base64,UklGRkgAAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSAkAAAABBxAREYiI/gcAVlA4IBgAAAAwAQCdASoIAAgAD8D+JaQAA3AA/ua1AAA=");
}


function initEle() {
    /* 基本元素初始化 */

    /* 创建元素 */
    const toggleMask = document.createElement('div');
    toggleMask.className = 'userscript-toggleMask';
    toggleMask.id = 'userscript-toggleMask';
    toggleMask.setAttribute('toggle-status', 'idle');
    toggleMask.innerHTML = ICONS.safety;
    document.body.appendChild(toggleMask);

    /* 加载时判断当前是否处于警戒状态 */
    if(GM_getValue('aid_broadcast').status == 'active') {
        toggleMask.setAttribute("toggle-status", "active");
        toggleMask.style.right = "calc(50vw - 30px)";
        origTitle = document.title;
        showCover();
    }

    /* 点击事件 */
    toggleMask.addEventListener('click', function(e) {
        if(toggleMask.getAttribute("toggle-status") == 'idle'){
            toggleMask.setAttribute("toggle-status", "active");
            toggleMask.style.right = "calc(50vw - 30px)";
            origTitle = document.title;
            showCover();
        } else {
            toggleMask.setAttribute("toggle-status", "idle");
            toggleMask.style.right = "10px";
            document.title = origTitle;
            const mask = document.getElementById("userscript-superMask");
            if (mask && mask.parentNode) {
                mask.parentNode.removeChild(mask);
            }
        }
    });

    /* 右键/长按事件 */
    toggleMask.addEventListener("contextmenu", function(e) {
        e.preventDefault();

        if(GM_getValue('aid_broadcast').status == 'idle'){
            toggleMask.setAttribute("toggle-status", "active");
            GM_setValue('aid_broadcast', {"status":"active","url":window.location.href, "type":"cover"});

            showToast("开始警戒", 300);
        } else {
            toggleMask.setAttribute("toggle-status", "idle");
            GM_setValue('aid_broadcast', {"status":"idle","url":window.location.href, "type":"cover"});

            showToast("警戒取消", 1000);
        }
    });
}


(function () {
    'use strict';

    /* 不作用于iframe中 */
    if(window.self !== window.top){ return; }

    /* 初始化 全局脚本广播信息（type可选：cover(遮罩), close(关闭窗口)） */
    if(!GM_getValue('aid_broadcast')){
        GM_setValue('aid_broadcast', {"status":"idle","url":"", "type":"cover"});
    }


    /* 向页面插入CSS */
    GM_addStyle(`
        body{ -webkit-appearance:none!important; }

        #userscript-instantToast{ display:none; position:fixed; bottom:40px; left:50%; transform:translateX(-50%); background-color:#333333; color:#FFF; padding:8px 20px; border-radius:5px; z-index:999999; box-shadow:0px 2px 5px #555; }

        .userscript-toggleMask{ position:fixed; bottom:10px; right:10px; z-index:999999; background-color:#3b82f6; height:24px; width:24px; border-radius:15px; opacity:0.7; box-shadow:0 0 5px #3b82f6; display:flex; align-items:center; justify-content:center; cursor:pointer; box-sizing:border-box!important; user-select:none; }
        .userscript-toggleMask:hover{ opacity:1; }
        .userscript-superMask{ position:fixed; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh; z-index:999998; background-color:#FFF; border:none; padding:none; box-sizing:border-box; }
    `);


    /* 初始化 */
    initEle();
    /* 如果在页面加载时未完成初始化 */
    setTimeout(() => {
        if(!document.getElementById("userscript-toggleMask")){
            initEle();
        }
    }, 1000);
    /* 页面局部刷新时确保元素不被删除 */
    window.addEventListener('urlchange', (info) => {
        if(!document.getElementById("userscript-toggleMask")){
            setTimeout(() => {
                initEle();
            }, 1000);
        }
    });

    /* 快捷键触发 */
    window.addEventListener('keydown', function (event) {
        // 检查是否按下 Ctrl + Shift + C 或 Ctrl + Shift + X
        if (event.ctrlKey && event.shiftKey) {
            const key = event.key.toLowerCase();

            if (key === 'c' || key === 'x') {
                event.preventDefault(); // 阻止默认行为（如复制）

                const toggleMask = document.getElementById("userscript-toggleMask");
                // 设置 toggle-status 属性
                toggleMask.setAttribute("toggle-status", "active");

                // 存储数据到 GM_setValue
                GM_setValue('aid_broadcast', {
                    status: "active",
                    url: window.location.href,
                    type: "cover"
                });
            }
        }
    });




    /* 全局开启广播监听 */
    if (typeof GM_addValueChangeListener === 'function' && CompatibilityMode == false) {
        GM_addValueChangeListener('aid_broadcast', function(name, old_value, new_value, remote) {
            if(!new_value.url || !new_value.type){ return; }

            const toggleMask = document.getElementById("userscript-toggleMask");
            if(new_value.status == "idle"){
                toggleMask.setAttribute("toggle-status", "idle");
                toggleMask.style.right = "10px";
                document.title = origTitle;
                const mask = document.getElementById("userscript-superMask");
                if (mask && mask.parentNode) {
                    mask.parentNode.removeChild(mask);
                }
            } else {
                toggleMask.setAttribute("toggle-status", "active");
                toggleMask.style.right = "calc(50vw - 30px)";
                origTitle = document.title;
                showCover();
            }
        });
    } else {
        console.log("[立即警戒] 提示：浏览器不支持或用户禁用了GM_addValueChangeListener，已启用替代方案。");

        function addValueChangeListener(key, callback) {
            let oldValue = GM_getValue(key);

            setInterval(function() {
                let newValue = GM_getValue(key);

                // 如果 oldValue 和 newValue 是对象或数组，进行深度比较
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    callback(key, oldValue, newValue, false);
                    oldValue = newValue;
                }
            }, 1500);
        }

        addValueChangeListener('aid_broadcast', function(name, old_value, new_value, remote) {
            if(!new_value.url || !new_value.type){ return; }

            const toggleMask = document.getElementById("userscript-toggleMask");
            if(new_value.status == "idle"){
                toggleMask.setAttribute("toggle-status", "idle");
                toggleMask.style.right = "10px";
                document.title = origTitle;
                const mask = document.getElementById("userscript-superMask");
                if (mask && mask.parentNode) {
                    mask.parentNode.removeChild(mask);
                }
            } else {
                toggleMask.setAttribute("toggle-status", "active");
                toggleMask.style.right = "calc(50vw - 30px)";
                origTitle = document.title;
                showCover();
            }

        });
    }

})();