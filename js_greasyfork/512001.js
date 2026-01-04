// ==UserScript==
// @name         微博聊天图片防撤回
// @description  简单的图片暂存功能，监听最新的聊天并保存图片在网页上，点击按钮查看💌
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       moon
// @license      MIT
// @match        https://api.weibo.com/chat
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABdUExURUxpcemNSemNSemNSemNSemNSemNSemNSemNSemNSdktOumNSemNSemNSemNSemNSemNSdktOtktOtktOtktOtktOtktOtktOtktOtktOtktOtktOtktOumNSdktOsZoAhUAAAAddFJOUwAgkIAQ4MBAYPBA0KAwcLBQ0BBgIHDggDCw8JDAT2c6pQAAAiFJREFUWMPNl9lywyAMRcMOMQa7SdMV//9nNk4nqRcJhOvOVI9+OJbE5UocDn8VrBNRp3so7YWRGzBWJSAa3lZyfMLCVbF4ykVjye1JhVB2j4S+UR0FpBMhNCuDEilcKIIcjZSi3KO0W6cKUghUUHL5nktHJqW8EGz6fyTmr7dW82DGK8+MEb7ZSALYNiIkU20uMoDu4tq9jKrZYnlSACS/zYSBvnfb/HztM05uI611FjfOmNb9XgMIqSk01phgDTTR2gqBm/j4rfJdqU+K2lHHWf7ssJTM+ozFvMSG1iVV9FbmKAfXEjxDUC6KQTyDZ7KWNaAZyRLabUiOqAj3BB8lLZoSWJvA56LEUuoqty2BqZLDShJodQzZpdCba8ytH53HrXUu77K9RqyrvNaV5ptFQGRy/X78CQKpQday6zEM0+jfXl5XpAjXNmuSXoDGuHycM9tOB/Mh0DVecCcTiHBh0NA/Yfu3Rk4BAS1ICgIZEmjokS3V1YKGZ+QeV4MuTzuBpin5X4F6sEdNPWh41CbB4+/IoCP0b14nSBwUYB9R1aAWfgJpEoiBq4dbWCcBNPm5QEa7IJ3az9YwWazD0mpRzvt64Zsu6HE5XlDQ2/wREbW36EAeW0e5IsWXdMyBzhWgkAH1NU9ydqD5UWlDuKlrY2UzudsMqC+OYL5wBAT0eSql9ChOyxxoTOpUqm4Upb6ra8jE5bXiuTNk47QXiE76AnacIlJf1W5ZAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/512001/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9%E5%9B%BE%E7%89%87%E9%98%B2%E6%92%A4%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/512001/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9%E5%9B%BE%E7%89%87%E9%98%B2%E6%92%A4%E5%9B%9E.meta.js
// ==/UserScript==


(function (window) {
  'use strict';

  const imageDiv = `<div id="image-div" style="width:50px;height:20px;background-color:white;transition: all 0.3s ease-in-out;position:absolute;z-index:99999;max-height:800px;left:200px;overflow:hidden;border:1px solid balck;border-radius:6px;border:1px solid #1677ff;">
  <div id="see-btn" style="width:100%;height:20px;text-align:center;cursor:pointer;box-sizing:border-box;background-color:#1677ff;color:#fff;margin-bottom:20px;position:sticky;top:0;left:0;z-index:99999;">查看</div>
  </div>`;

  const toggleExpand = () => {
    var div = document.getElementById('image-div');
    var isNotExpanded = div.style.width === '50px';
    div.style.width = isNotExpanded ? '400px' : '50px';
    div.style.overflow = isNotExpanded ? 'auto' : 'hidden';
    div.style.height = isNotExpanded ? 'auto' : '20px';
  }

  setInterval(function () {
    if (!document.querySelector('#image-div')) {
      document.querySelector('.message').insertAdjacentHTML('afterend', imageDiv);
      console.log('第一次插入, 绑定事件');
      document.querySelector('#see-btn').addEventListener('click', toggleExpand)
    }
    // 最后一条消息
    let originalElement = document.querySelector('.message ul li:last-child');
    if (originalElement) {
      // 如果有大图
      if (originalElement.querySelector('.large_img_container') && !originalElement.classList.contains('generated')) {
        let clonedElement = originalElement.cloneNode(true);
        // 移除所有属性
        let attributeNames = clonedElement.getAttributeNames();
        for (const attrName of attributeNames) {
          clonedElement.removeAttribute(attrName);
        }
        // 移除v标
        let eleA = clonedElement.querySelector('.m-icon')
        eleA ? eleA.remove() : null
        // 调整头衔
        let eleB = clonedElement.querySelector('.icon-area')
        eleB ? eleB.setAttribute('style', 'color: #f2f;margin-left:10px;') : null
        // 调整粉丝牌大小
        let eleC = clonedElement.querySelector('.tf')
        eleC ? eleC.setAttribute('style', 'height: 20px;margin-left:20px;') : null
        // 调整头像大小
        clonedElement.querySelector('.avator').setAttribute('style', 'width: 30px;')
        // 调整名字
        clonedElement.querySelector('.name').setAttribute('style', 'line-height: 30px;color: #A3A7AE;margin-left:20px;')

        let imgURL = clonedElement.querySelector('.large_img_container img').src;
        imgURL = imgURL.replace('https:', '');
        imgURL = imgURL.replace('msget_thumbnail', 'msget');
        clonedElement.querySelector('.large_img_container img').src = imgURL;
        document.querySelector('#image-div').appendChild(clonedElement);
        originalElement.classList.add('generated');
      }
    }
  }, 1000);

})(window);