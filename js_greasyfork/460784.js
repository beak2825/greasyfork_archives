// ==UserScript==
// @name         在速买通订单页面生成WhatsApp按钮快速联系客户
// @homepage     https://greasyfork.org/zh-CN/scripts/460784-%E5%9C%A8%E9%80%9F%E4%B9%B0%E9%80%9A%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90whatsapp%E6%8C%89%E9%92%AE%E5%BF%AB%E9%80%9F%E8%81%94%E7%B3%BB%E5%AE%A2%E6%88%B7
// @version      0.3
// @description  在订单页面根据手机号码生成一按钮快速个whatsapp的按钮，点击它就可以和买家直接交谈。如果买家没有注册过whatsapp那么就联系不上。
// @author       zla5
// @match        https://csp.aliexpress.com/*
// @match        https://gsp.aliexpress.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/460784/%E5%9C%A8%E9%80%9F%E4%B9%B0%E9%80%9A%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90WhatsApp%E6%8C%89%E9%92%AE%E5%BF%AB%E9%80%9F%E8%81%94%E7%B3%BB%E5%AE%A2%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460784/%E5%9C%A8%E9%80%9F%E4%B9%B0%E9%80%9A%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90WhatsApp%E6%8C%89%E9%92%AE%E5%BF%AB%E9%80%9F%E8%81%94%E7%B3%BB%E5%AE%A2%E6%88%B7.meta.js
// ==/UserScript==

(function() {
  // 定义一个函数来检查元素是否存在
  function checkForPhoneNumber() {
    const phoneNumberElement = document.querySelector('[id^="DadaMicroLoaderMicroLoader_"] > div > div > div > div > div.dada-main-page > div.ui-item.label-hoc.parent-Order.Detail.clazzName-undefined.CommonContainer.CommonContainer.container.hoc-label-top.isContainer.empty-label > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(4) > div > div > span');
    if (phoneNumberElement) {
      // 从电话号码元素中提取电话号码，并删除所有空格、括号和破折号
      const phoneNumber = phoneNumberElement.textContent.trim().replace(/[^\d]/g, '');

      console.log('提取的电话号码:', phoneNumber); // 输出提取的电话号码

      // 创建 WhatsApp 按钮元素
      const whatsappButton = document.createElement('a');

      // 设置 WhatsApp 按钮的属性
      whatsappButton.href = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
      whatsappButton.target = '_blank';
      whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';

      // 查找创建 WhatsApp 按钮的位置
      const buttonParent = document.querySelector('.order-detail-delivery-address.reload-none.flex-layout.flex-layout_direction_column');
      if (buttonParent) {
        // 将 WhatsApp 按钮添加到指定位置
        buttonParent.appendChild(whatsappButton);

        console.log('WhatsApp 按钮添加成功'); // 输出按钮添加成功的消息

        // 添加 WhatsApp 按钮的样式
whatsappButton.style.textDecoration = "none";
whatsappButton.style.lineHeight = "30px";
whatsappButton.style.display = "inline-block";
whatsappButton.style.textAlign = "center";
whatsappButton.style.borderRadius = "6px";
whatsappButton.style.backgroundColor = "rgb(70, 188, 21)";
whatsappButton.style.borderColor = "rgb(70, 188, 21)";
whatsappButton.style.color = "rgb(246, 248, 250)";
whatsappButton.style.marginTop = '10px';
      whatsappButton.innerText = '通过WhatsApp联系客户';


        clearInterval(intervalId); // 找到元素后清除定时器
      } else {
        console.log('WhatsApp 按钮添加失败：找不到父元素'); // 输出按钮添加失败的消息
      }
    } else {
      console.log('未找到电话号码元素'); // 输出未找到电话号码的消息
    }
  }

  // 每隔 1 秒钟检查一次元素是否存在
  const intervalId = setInterval(checkForPhoneNumber, 1000);
})();
