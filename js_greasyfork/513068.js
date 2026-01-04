// ==UserScript==
// @name        中文维基百科页面自动跳转到英文维基百科页面
// @namespace   https://greasyfork.org/users/1382781
// @match       https://*.wikipedia.org/*
// @grant       none
// @license     GPLv3
// @version     1.3
// @author      -
// @description 2024/10/18 16:07:20
// @downloadURL https://update.greasyfork.org/scripts/513068/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E8%8B%B1%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/513068/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E8%8B%B1%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

// 显示提示信息的函数
function showWarningMessage(message) {
    const warningMessage = document.createElement('div');
    warningMessage.textContent = message;
    warningMessage.style.position = 'fixed';
    warningMessage.style.top = '10px';
    warningMessage.style.left = '10px';
    warningMessage.style.padding = '10px';
    warningMessage.style.backgroundColor = 'red';
    warningMessage.style.color = 'white';
    warningMessage.style.zIndex = '1000';
    document.body.appendChild(warningMessage);
    setTimeout(()=>{warningMessage.classList.add('exit-animation')})
}


// 跳转到英文页面的函数
function jumpToEnglishPage() {
    document.getElementById('p-lang-btn-checkbox').click();

    setTimeout(() => {
      // 获取所有语言链接
      const langLinks = document.getElementsByClassName('autonym');

      // 如果没有找到语言链接，提示用户
      if (langLinks.length === 0) {
          showWarningMessage('无法找到该页面的英语版本');
      } else {
          let foundEnglish = false; // 标志变量，表示是否找到英语页面

          // 遍历所有语言链接
          for (let i = 0; i < langLinks.length; i++) {
               const langLink = langLinks[i];
              // 检查是否为英语链接
              if (langLink.lang === 'en') {
                   // 跳转到英语页面
                   window.location.href = langLink.href;
                   foundEnglish = true; // 找到英语页面，标志设置为true
                   break; // 找到后退出循环
               }
          }
          // 如果没有找到英语页面，提示用户
           if (!foundEnglish) {
               showWarningMessage('未找到该页面的英语版本');
               // 如果没有找到英文页面，3秒后自动隐藏提示
               setTimeout(() => {
                   warningMessage.style.display = 'none';
               }, 3000);
           }
      }
   }, 1000); // 1秒延

}

const style = document.createElement('style');
style.innerHTML = `

    /* 退出动画：向左移动并淡出 */
    @keyframes slide-out-left {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(-100%); opacity: 0; }
    }

    .exit-animation {
        animation: slide-out-left 2s forwards; /* 1秒内完成移动和淡出 */
    }
`;
document.head.appendChild(style);

window.addEventListener('load', function () {

    if (!window.location.hostname.startsWith('en')) {
        // 创建弹窗，显示提示信息和按钮
        const warningMessage = document.createElement('div');
        warningMessage.textContent = '将在3秒后跳转到英文页面';
        warningMessage.style.position = 'fixed';
        warningMessage.style.top = '10px';
        warningMessage.style.left = '10px';
        warningMessage.style.padding = '10px';
        warningMessage.style.backgroundColor = 'red';
        warningMessage.style.color = 'white';
        warningMessage.style.zIndex = '1000';
        warningMessage.style.display = 'flex';
        warningMessage.style.flexDirection = 'column';
        warningMessage.style.alignItems = 'flex-start';

        // 立即跳转按钮
        const immediateButton = document.createElement('button');
        immediateButton.textContent = '立即跳转';
        immediateButton.style.marginTop = '10px';
        immediateButton.style.backgroundColor = 'blue';
        immediateButton.style.color = 'white';
        immediateButton.style.border = 'none';
        immediateButton.style.padding = '5px';
        immediateButton.style.cursor = 'pointer';
        warningMessage.appendChild(immediateButton);

        // 手动跳转按钮（改为不跳转页面）
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '不跳转';
        cancelButton.style.marginTop = '5px';
        cancelButton.style.backgroundColor = 'green';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.padding = '5px';
        cancelButton.style.cursor = 'pointer';
        warningMessage.appendChild(cancelButton);

        document.body.appendChild(warningMessage);

        let lv_timeoutf =  setTimeout(() => {
            jumpToEnglishPage();
        }, 3000);

        // 立即跳转按钮点击事件
        immediateButton.addEventListener('click', function () {
            warningMessage.style.display = 'none'
            jumpToEnglishPage();
            clearTimeout(lv_timeoutf)
        });
        cancelButton.addEventListener('click', function () {
            clearTimeout(lv_timeoutf)
            warningMessage.classList.add('exit-animation')
        });



    }

});
