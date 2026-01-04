// ==UserScript==
// @name         手机配置清单生成器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  一键获取中关村在线指定手机参数配置清单（查看完整参数页），自媒体写数码文章专用神器。
// @author       techwb.cn
// @match        https://detail.zol.com.cn/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460467/%E6%89%8B%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460467/%E6%89%8B%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var className1 = 'detailed-parameters'; // 【详细参数】CSS类名
  var className2 = 'cell.cell-4'; //【同系列产品】存储版本CSS类名
  var className3 = 'cell.cell-2'; //【同系列产品】手机价格CSS类名
  var className4 = 'product-model__name'; //右侧栏对应商品卡获得手机名称CSS类

// 定义需要搜索和输出的文本内容,一一对应
    var textToSearch = ['产品型号','国内发布时间','上市日期','机身材质','长度','宽度','厚度','重量','CPU型号','CPU频率','GPU型号','RAM存储类型','ROM存储类型','操作系统','散热','振动马达','扬声器','屏幕尺寸','屏幕类型','屏幕比例','屏占比','分辨率','屏幕材质','屏幕刷新率','HDR技术','摄像头总数','像素','光圈','广角','传感器型号','传感器尺寸','对焦方式','变焦倍数','NFC','电池容量','有线充电','无线充电','无线反向充电','游戏功能'];
    var textToOutput = ['手机名','国内发布时间','上市日期','机身材质','机身长度','机身宽度','机身厚度','机身重量','处理器','CPU主频','GPU图形处理器型号','运行内存类型','机身存储类型','预装的操作系统','散热','振动马达','扬声器','屏幕尺寸','屏幕类型','屏幕比例','屏占比','屏幕分辨率','屏幕材质','屏幕刷新率','屏幕是否支持HDR技术','摄像头总数','摄像头像素','光圈','广角','传感器型号','传感器尺寸','对焦方式','摄像头变焦倍数','是否支持NFC','电池容量','有线充电','无线充电','无线反向充电','游戏功能','目前电商价格'];
// 查询所有包含“detailed-parameters”类名的div元素
  var divElements = document.querySelectorAll('.' + className1);

  // 存储查询结果的变量
  var cells = [];
  var text = '';
  var phoneName = '';
  var hasProductName = false;
  var phonePrice = '';

  // 查询所有包含存储版本和手机价格CSS类名的元素，并存储它们的文本
  var cellElements = document.querySelectorAll('.' + className2);
  var cell2Elements = document.querySelectorAll('.' + className3);
  var cell2Texts = [];
  for (var l = 0; l < cell2Elements.length; l++) {
    cell2Texts.push(cell2Elements[l].textContent.trim());
  }

// 处理价格信息
phonePrice = '【目前电商价格】\n';
for (var k = 0; k < cellElements.length; k++) {
  var cellText = cellElements[k].textContent.trim();
  var matched = cellText.match(/[()（）][^()（）]*[()（）]/);
  if (matched) {
    phonePrice += matched[0].replace('/', '+').replace('（', '').replace('）', '').replace('\(', '').replace('\)', '')+'版，从首发价 元降到现价'+cell2Texts[k].replace('¥', '') + '元' + '\n';
  }
}
  phonePrice += '\n';

  // 处理文本内容
  function getTextContent(element) {
    var textContent = '';
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.nodeType == Node.TEXT_NODE) { // 如果节点是文本节点
        textContent += node.textContent;
      } else if (node.nodeType == Node.ELEMENT_NODE) { // 如果节点是元素节点
        if (node.nodeName == 'BR') {
          textContent += '\n'; // 如果是 <br> 标签，则换行
        } else {
          textContent += getTextContent(node); // 递归处理子节点
        }
      }
    }
    return textContent;
  }


// 遍历所有包含“detailed-parameters”类名的div元素
divElements.forEach(function(divElement) {

// 查询每个div元素中的表格元素
var tableElements = divElement.querySelectorAll('table');
    tableElements.forEach(function(tableElement) {
      var rows = tableElement.rows;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var leftCell = row.cells[0];
    if (leftCell) {

      // 搜索文本内容并提取对应的值
      for (var j = 0; j < textToSearch.length; j++) {
        if (leftCell.textContent.trim() == textToSearch[j]) {
          var rightCell = row.cells[1];
          if (rightCell) {
            var rightCellText = getTextContent(rightCell).trim();
            rightCellText = rightCellText.replace(' g','g').replace(/Hz.*/g, 'Hz').replace('  查看外观图', '').replace('纠错', '').replace('>，', '').replace('>', '；').replace(/更多.*/g, '').replace('￥', '').replace(/GB.*/g, 'GB');
            if (textToOutput[j] == '手机名') {
              if (rightCellText) {
                phoneName = rightCellText;
                hasProductName = true;
              }
            } else if (textToOutput[j] == '目前电商价格') {
              // 已在上面处理
            } else if (textToOutput[j] == '摄像头像素') {
              if (rightCellText) {
                rightCellText = textToOutput[j].replace('摄像头像素','【摄像头像素】\n') + rightCellText;
              }
              text += rightCellText + '\n';
            } else {
              text += '【'+textToOutput[j] + '】 ' + rightCellText + '\n';
              }
            }
          }
        }
      }
    }
  });
});

            // 如果产品型号不存在
            if (!hasProductName) {
            // 查询所有包含“product-model__name”类名的元素
            var productNameElements = document.querySelectorAll('.' + className4);
            // 获取第一个元素的文本值
            if (productNameElements.length > 0) {
            phoneName = productNameElements[0].textContent.trim();
            hasProductName = true;
            }
          }

// 移除手机名称中括号内的存储版本内容，以及将“参数”两个字替换为空值
phoneName = phoneName.replace(/\s*[\（][^\）]*[)\）]/g, '').replace('参数', '');

// 构建完整的文本
var fullText = "根据给出的配置信息写一篇关于（" + phoneName.replace('配置', '') + "）的数码文章（字数限制在800字以内，无需写小标题），请尽量围绕价格降价方面来写，突出性价比，其配置参数如下：\n" + text + phonePrice;

// 创建下载按钮
var downloadButton = document.createElement('button');
downloadButton.style.position = 'fixed';
downloadButton.style.top = '50%';
downloadButton.style.right = '20px';
downloadButton.style.background = 'red';
downloadButton.style.color = 'white';
downloadButton.style.border = 'none';
downloadButton.style.borderRadius = '5px';
downloadButton.style.padding = '10px';
downloadButton.style.fontSize = '16px';
downloadButton.style.zIndex = '9999';
downloadButton.innerText = '生成配置清单';

// 点击下载按钮时生成并下载文本文件
downloadButton.onclick = function() {
var blob = new Blob([fullText], { type: 'text/plain' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = phoneName + '详细配置清单.txt';
a.click();
setTimeout(function() { URL.revokeObjectURL(url); }, 0);
};

// 将下载按钮添加到文档中
document.body.appendChild(downloadButton);
})();