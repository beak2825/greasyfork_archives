// ==UserScript==
// @name         小码王Plus
// @version      1.4.2
// @description  使你的小码王更易于使用
// @author       红石镐&Copilot
// @match        https://world.xiaomawang.com/*
// @icon         https://world.xiaomawang.com/favicon.ico
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @namespace https://greasyfork.org/users/1254226
// @downloadURL https://update.greasyfork.org/scripts/492355/%E5%B0%8F%E7%A0%81%E7%8E%8BPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/492355/%E5%B0%8F%E7%A0%81%E7%8E%8BPlus.meta.js
// ==/UserScript==
//1.4.2版本为油叉特供版，也是在油叉发布的最后一个小码王Plus版本，不属于正式版。
//请到Github查看正式版
(function () {
    'use strict';
// 初始化设置
const settings = {
    autoReceive: GM_getValue('autoReceive', true), // 自动领取奖励
    autoSignIn: GM_getValue('autoSignIn', true), // 自动签到
    autoLoadComments: GM_getValue('autoLoadComments', true), // 自动展开评论
    autoExpandReplies: GM_getValue('autoExpandReplies', false), // 自动展开子回复
    autoClickMore: GM_getValue('autoClickMore', true), // 自动点击个人主页中查看更多按钮
    messageDoNotDisturb: GM_getValue('messageDoNotDisturb', false), // 消息免打扰
    removeDynamicRedDot: GM_getValue('removeDynamicRedDot', false), // 动态免打扰
    removeAvatarFrame: GM_getValue('removeAvatarFrame', false), // 移除头像框
    removeMagicReview: GM_getValue('removeMagicReview', false), // 移除右下角魔力测评
    taskCenterDoNotDisturb: GM_getValue('taskCenterDoNotDisturb', false) // 任务中心免打扰
};
 
// 注册设置菜单命令
GM_registerMenuCommand('设置', openSettingsDialog);

// 重置上次显示弹窗的时间（测试用）
//GM_setValue('lastAlertDate', '');

const today = new Date().toISOString().split('T')[0]; // 获取当前日期
const lastAlertDate = GM_getValue('lastAlertDate', '');

if (today !== lastAlertDate) {
    // 显示警告弹窗
    showWarningAlert();
    GM_setValue('lastAlertDate', today); // 更新存储的日期为当前日期
}

function showWarningAlert() {
    const cancelButton = Swal.fire({
        title: '警告',
        icon: 'error', // 使用 SweetAlert2 自带的错误图标
        html: `<div style="text-align: left;">
            检测到你正在使用从GreasyFork安装的小码王Plus。<br><br>
            <strong>请注意：</strong>由于某些原因，<strong>GreasyFork中的小码王Plus将不再受到维护</strong>，
            请前往<a href="https://github.com/RSPqfgn/XMWplus/" target="_blank">Github</a>下载受支持的版本。<br>
            你仍然可以正常使用该版本的小码王Plus，但这个弹窗每天都会弹出，直到您安装了来自Github的最新版本。<br>
            如果你无法正常访问Github，可尝试<a href="https://kkgithub.com/RSPqfgn/XMWplus" target="_blank">Github镜像站</a>。<br><br>
            <strong>注意：</strong>GreasyFork版本与Github版本互不兼容，请卸载GreasyFork版本后再安装Github版本
        </div>`,
        showCancelButton: true,
        confirmButtonText: '<a href="https://github.com/RSPqfgn/XMWplus/" target="_blank" style="color: white;">前往Github</a>',
        cancelButtonText: '取消',
        customClass: {
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button'
        },
        didOpen: () => {
            // 移除倒计时功能
        }
    });
}
function openSettingsDialog() {
    Swal.fire({
        title: '设置',
        html:  `
<style>
/* 样式定义 */
.button-container {
    display: flex; /* 使用 Flexbox */
    justify-content: flex-start; /* 紧挨着的排列 */
    margin-bottom: 20px; /* 按钮底部的间距 */
}
 
.section {
    margin-right: 10px; /* 右侧间距，留一点距离 */
    font-weight: bold; /* 加粗分类标题 */
    cursor: pointer; /* 鼠标手势 */
    padding: 10px;
    background-color: #f0f0f0; /* 背景色 */
    border-radius: 4px;
}
 
.section.active { /* 高亮样式 */
    background-color: #007bff; /* 高亮背景色 */
    color: white; /* 高亮字体颜色 */
}
 
.custom-confirm-button {
    background-color: #007bff !important; /* 确认按钮颜色 */
    color: white !important; /* 确认按钮字体颜色 */
    border-radius: 8px; /* 按钮圆角 */
}
 
.custom-confirm-button:hover {
    background-color: #0056b3 !important; /* 悬停时的颜色 */
}
 
.custom-cancel-button {
    background-color: #ccc; /* 取消按钮颜色 */
    color: white; /* 字体颜色 */
    border-radius: 8px; /* 按钮圆角 */
}
 
.custom-cancel-button:hover {
    background-color: #bbb; /* 悬停时的颜色 */
}
 
.hidden {
    display: none; /* 隐藏 */
}
 
/* 其他勾选框样式 */
.custom-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* 增加标签间距 */
}
 
.custom-checkbox input[type="checkbox"] {
    appearance: none; /* 关闭默认样式 */
    width: 24px; /* 自定义勾选框大小 */
    height: 24px; /* 自定义勾选框大小 */
    border: 2px solid #007bff; /* 勾选框边框 */
    border-radius: 4px; /* 勾选框圆角 */
    outline: none; /* 关闭默认高亮 */
    cursor: pointer; /* 鼠标手势 */
    position: relative; /* 设为相对定位 */
    margin-right: 10px; /* 标签和勾选框间隔 */
    transition: background-color 0.3s, border-color 0.3s; /* 动效 */
}
 
.custom-checkbox input[type="checkbox"]:checked {
    background-color: #007bff; /* 勾选框背景颜色 */
    border-color: #007bff; /* 选中后的边框颜色 */
}
 
.custom-checkbox input[type="checkbox"]:checked::before {
    content: '✔'; /* 勾选后显示的符号 */
    position: absolute;
    left: 50%; /* 符号水平居中 */
    top: 50%; /* 符号垂直居中 */
    transform: translate(-50%, -50%); /* 调整符号位置 */
    color: white; /* 符号颜色 */
    font-size: 18px; /* 符号大小 */
}
</style>
 
<div class="button-container">
    <div id="taskSection" class="section active">自动任务</div> <!-- 默认高亮 -->
    <div id="customSection" class="section">界面定制</div>
</div>
 
<div id="taskSettings">
    <label class="custom-checkbox">
        <input type="checkbox" name="autoReceive" ${settings.autoReceive ? 'checked' : ''}> 自动领取奖励
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="autoSignIn" ${settings.autoSignIn ? 'checked' : ''}> 自动签到
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="autoLoadComments" ${settings.autoLoadComments ? 'checked' : ''}> 自动展开评论
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="autoExpandReplies" ${settings.autoExpandReplies ? 'checked' : ''}> 自动展开子回复
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="autoClickMore" ${settings.autoClickMore ? 'checked' : ''}> 自动点击查看更多
    </label><br/>
</div>
 
<div id="customSettings" class="hidden">
    <label class="custom-checkbox">
        <input type="checkbox" name="messageDoNotDisturb" ${settings.messageDoNotDisturb ? 'checked' : ''}> 消息免打扰
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="removeDynamicRedDot" ${settings.removeDynamicRedDot ? 'checked' : ''}> 动态免打扰
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="taskCenterDoNotDisturb" ${settings.taskCenterDoNotDisturb ? 'checked' : ''}> 任务中心免打扰
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="removeAvatarFrame" ${settings.removeAvatarFrame ? 'checked' : ''}> 移除头像框
    </label><br/>
    <label class="custom-checkbox">
        <input type="checkbox" name="removeMagicReview" ${settings.removeMagicReview ? 'checked' : ''}> 移除右下角魔力测评
    </label><br/>
</div>
`,
        showCancelButton: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        customClass: {
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button'
        },
        // 修改后的 didOpen 回调：
 
didOpen: () => {
 
    // 自动任务按钮点击事件
 
    document.getElementById('taskSection').addEventListener('click', () => {
 
        if (!document.getElementById('taskSettings').classList.contains('hidden')) return;
 
        document.getElementById('taskSettings').classList.remove('hidden');
 
        document.getElementById('customSettings').classList.add('hidden');
 
        // 高亮逻辑（删除对 advancedSection 的引用）
 
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
 
        document.getElementById('taskSection').classList.add('active');
 
    });
 
    // 界面定制按钮点击事件
 
    document.getElementById('customSection').addEventListener('click', () => {
 
        if (!document.getElementById('customSettings').classList.contains('hidden')) return;
 
        document.getElementById('customSettings').classList.remove('hidden');
 
        document.getElementById('taskSettings').classList.add('hidden');
 
        // 高亮逻辑（删除对 advancedSection 的引用）
 
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
 
        document.getElementById('customSection').classList.add('active');
 
    });
 
},
 
    preConfirm: () => {
        settings.autoReceive = document.querySelector('input[name="autoReceive"]').checked; // 获取领取奖励状态
        settings.autoSignIn = document.querySelector('input[name="autoSignIn"]').checked; // 获取签到状态
        settings.autoLoadComments = document.querySelector('input[name="autoLoadComments"]').checked; // 获取展开评论状态
        settings.autoExpandReplies = document.querySelector('input[name="autoExpandReplies"]').checked; // 获取展开子回复状态
        settings.autoClickMore = document.querySelector('input[name="autoClickMore"]').checked; // 获取查看更多按钮状态
        settings.messageDoNotDisturb = document.querySelector('input[name="messageDoNotDisturb"]').checked; // 获取免打扰状态
        settings.removeDynamicRedDot = document.querySelector('input[name="removeDynamicRedDot"]').checked; // 获取动态免打扰状态
        settings.removeAvatarFrame = document.querySelector('input[name="removeAvatarFrame"]').checked; // 获取移除头像框状态
        settings.removeMagicReview = document.querySelector('input[name="removeMagicReview"]').checked; // 获取移除魔力测评状态
        settings.taskCenterDoNotDisturb = document.querySelector('input[name="taskCenterDoNotDisturb"]').checked; // 获取任务中心免打扰状态
 
        GM_setValue('autoReceive', settings.autoReceive); // 保存领取奖励状态
        GM_setValue('autoSignIn', settings.autoSignIn); // 保存签到状态
        GM_setValue('autoLoadComments', settings.autoLoadComments); // 保存展开评论状态
        GM_setValue('autoExpandReplies', settings.autoExpandReplies); // 保存展开子回复状态
        GM_setValue('autoClickMore', settings.autoClickMore); // 保存查看更多按钮状态
        GM_setValue('messageDoNotDisturb', settings.messageDoNotDisturb); // 保存免打扰状态
        GM_setValue('removeDynamicRedDot', settings.removeDynamicRedDot); // 保存动态免打扰状态
        GM_setValue('removeAvatarFrame', settings.removeAvatarFrame); // 保存移除头像框状态
        GM_setValue('removeMagicReview', settings.removeMagicReview); // 保存移除魔力测评状态
        GM_setValue('taskCenterDoNotDisturb', settings.taskCenterDoNotDisturb); // 保存任务中心免打扰状态
 
        return Swal.fire({
            title: '设置已保存',
            text: '更改的设置需刷新后生效，是否刷新？',
            showCancelButton: true,
            confirmButtonText: '刷新',
            cancelButtonText: '取消',
            customClass: {
                confirmButton: 'custom-confirm-button', 
                cancelButton: 'custom-cancel-button' 
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }
});}
 
// 当页面加载完成后开始执行功能并移除遮罩层
window.onload = function() {
    // 自动领取奖励的代码...
    if (settings.autoReceive) {
        function clickReceive() {
            var receiveButton = document.querySelector("div.taskAction__3nOcF.taskReceiveReward__16CiZ");
            if (receiveButton && receiveButton.textContent === "领取") {
                receiveButton.click();
            }
        }
        // 持续检查领取奖励元素是否存在
        setInterval(function() {
            clickReceive(); // 如果找到元素则执行领取
        }, 1000);
    }
 
    // 自动签到的代码...
    if (settings.autoSignIn) {
        setTimeout(function() {
            if (window.location.href.includes('/w/index')) {
                var signInButton = document.evaluate("//div [@class='goTaskCenter__h4wru' and text()='签到']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (signInButton) {
                    function clickSignInButton() {
                        if (document.body.textContent.includes("已领取")) {
                            clearInterval(signInInterval);
                        } else {
                            signInButton.click();
                        }
                    }
                    var signInInterval = setInterval(clickSignInButton, 1000);
                }
            }
        }, 4000); // 等待网页加载4秒后执行
    }
 
    // 自动展开评论的代码...
    if (settings.autoLoadComments) {
        setInterval(function() {
            var moreCommentsButton = document.querySelector('span.iconfont.icon-shequ-xiala.more-comment-icon__2Bxj9');
            if (moreCommentsButton) {
                moreCommentsButton.click();
            }
        }, 1000);
    }
 
    // 自动展开子回复的代码...
    if (settings.autoExpandReplies) {
        setInterval(function() {
            var replyMoreButton = document.evaluate("//span[contains(@class, 'reply-more-button-text__iB2jQ')]", document, null, XPathResult.ANY_TYPE, null);
            var button = replyMoreButton.iterateNext();
            while (button) {
                button.click();
                button = replyMoreButton.iterateNext();
            }
        }, 1000);
    }
 
    // 自动点击个人主页中查看更多按钮
    if (settings.autoClickMore) {
        setInterval(function() {
            // 检查是否存在 "查看更多" 按钮
            var seeMoreButton = document.querySelector('.seeMore__1QtpQ');
            if (seeMoreButton && seeMoreButton.textContent.trim() === "查看更多") {
                seeMoreButton.click(); // 点击按钮
            }
        }, 1000);
    }
 
    // 消息免打扰功能
    if (settings.messageDoNotDisturb) {
        setInterval(function() {
            var messageCountElement = document.querySelector('.message-count__2M-on');
            if (messageCountElement) {
                messageCountElement.remove(); // 删除消息计数元素
            }
        }, 1000);
    }
 
    // 动态免打扰功能
    if (settings.removeDynamicRedDot) {
        setInterval(function() {
            var dynamicRedDotElement = document.querySelector('.dynamic-red-dot__3FSaW');
            if (dynamicRedDotElement) {
                dynamicRedDotElement.remove(); // 删除动态红点元素
            }
        }, 1000);
    }
 
    // 任务中心免打扰功能
if (settings.taskCenterDoNotDisturb) {
    setInterval(function() {
        // Xpath定位元素
        const taskCenterBadge = document.evaluate('//*[@id="header"]/div/div/div[1]/div/div/div/ul/li[4]/a/span/sup', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const otherBadge = document.evaluate('//*[@id="__next"]/div[2]/div[2]/div[2]/div[3]/div[1]/div[2]/span/sup', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // 移除元素
        if (taskCenterBadge) {
            taskCenterBadge.remove(); // 删除任务中心元素
        }
        if (otherBadge) {
            otherBadge.remove(); // 删除任务中心元素
        }
    }, 500);
}
 
    // 移除头像框功能
    if (settings.removeAvatarFrame) {
        setInterval(function() {
            // 移除 headDecoration__3FOFH 元素
            var avatarFrameElement = document.querySelector('.headDecoration__3FOFH');
            if (avatarFrameElement) {
                avatarFrameElement.remove(); // 删除头像框元素
            }
            // 移除 decorationImg__76Jm7 元素
            var decorationImgElement = document.querySelector('.decorationImg__76Jm7');
            if (decorationImgElement) {
                decorationImgElement.remove(); // 删除头像框元素
            }
        }, 100);
    }
 
    // 移除魔力测评功能
    if (settings.removeMagicReview) {
        setInterval(function() {
            //移除 outer__3SbsJ 元素
            var outerElement = document.querySelector('.outer__3SbsJ');
            if (outerElement) {
                outerElement.remove(); // 删除魔力测评元素
            }
        }, 1000);
    }
};
 
})();