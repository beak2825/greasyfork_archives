// ==UserScript==
// @name         抖音来客
// @namespace    https://life.douyin.com/p/goods-list?groupid=1807616719466624&industry=common
// @version      0.1
// @description  给商品ID添加编辑链接
// @author       xyh
// @match        https://life.douyin.com/p/goods-list?groupid=1807616719466624&industry=common
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508859/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/508859/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

function checkElementLoaded() {
    const targetElement = document.querySelector('.product-name__id-T2o_cT');
    if (targetElement) {
       // alert('特定 class 的元素加载完成！');

document.querySelector("body > div:nth-child(22) > div > div > div > div > div > div:nth-child(3) > div > div").dispatchEvent(new MouseEvent('click', { bubbles: true }));
    


    } else {
        setTimeout(checkElementLoaded, 100);
    }
}

function checkElementLoaded2() {
    const t = document.querySelectorAll('.product-name__id-T2o_cT').length;;
    if (t>10) {
       //alert('特定 class 的元素加载完成！');
// 获取所有具有指定类名的元素
const elements = document.querySelectorAll('.product-name__id-T2o_cT');
// 遍历每个元素
elements.forEach(element => {
  // 获取原始商品 ID
  if (element) {
  const text = element.textContent;
  const numberRegex = /商品ID：(\d+)/;
  const match = text.match(numberRegex);
  if (match && match[1]) {
    console.log(match[1]);
      // 创建一个新的锚点元素
  const anchor = document.createElement('a');
  anchor.href = `https://life.douyin.com/p/comprehensive/goods/create?enter_method=goods_list&filter_status=9&first_category_id=17000000&goods_list_grey_tag=mig&groupid=1807616719466624&industry=common&pageFrom=COME_FROM_FORM_TYPE&product_id=${match[1]}&product_sub_type=2201&product_type=22&second_category_id=17003000&third_category_id=17003001`;
  anchor.target = '_blank';
  anchor.textContent = element.textContent;
  // 设置样式
  anchor.style.color = 'gray';
  const originalFontSize = window.getComputedStyle(element).fontSize;
  const fontSizeNumber = parseFloat(originalFontSize);
  anchor.style.fontSize = `${fontSizeNumber - 1}px`;
  anchor.style.textDecoration = 'none'; // 去掉下划线

  // 替换原始元素为锚点元素
  element.parentNode.replaceChild(anchor, element);
	  } else {
    console.log('没有找到数字内容。');
  }
} else {
  console.log('没有找到对应元素。');
}

});

    } else {
        setTimeout(checkElementLoaded2, 100);
    }
}

checkElementLoaded();
checkElementLoaded2();

})();
