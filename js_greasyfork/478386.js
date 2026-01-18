// ==UserScript==
// @name         模拟打印
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  模拟打印，可以在mac电脑上查看打印预览
// @author       Juliet
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478386/%E6%A8%A1%E6%8B%9F%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478386/%E6%A8%A1%E6%8B%9F%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window._vue) {
    addMockLODOPButton();
  } else {
    Object.defineProperty(window, '_vue', {
      get: function () {
        return window.$$vue;
      },
      set: function (value) {
        addMockLODOPButton();
        window.$$vue = value;
      },
    });
  }

  function loadStyle(styleContent) {
    var style = document.createElement('style');
    style.innerHTML = styleContent;
    style.type = 'text/css';
    document.head.append(style);
  }

  function addMockLODOPButton() {
    var button = document.createElement('button');
    button.classList.add('dev_tools_button');

    button.innerHTML = '<span style="font-size: 16px;">🖨️</span> 模拟打印机';

    loadStyle(`
          .dev_tools_button {
              width: 140px;
              height: 44px;
              border-radius: 12px;
              border: none;
              font-weight: 500;
              font-size: 14px;
              cursor: move;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              position: fixed;
              bottom: 30px;
              right: 30px;
              color: #ffffff;
              z-index: 10000000;
              background: #1a1a2e;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15),
                          0 1px 3px rgba(0, 0, 0, 0.1);
              transition: box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              user-select: none;
              -webkit-user-select: none;
          }
          .dev_tools_button:hover {
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2),
                          0 2px 5px rgba(0, 0, 0, 0.12);
              background: #252540;
          }
          .dev_tools_button.dragging {
              opacity: 0.9;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
              cursor: grabbing;
          }
      `);

    // 拖拽功能
    var isDragging = false;
    var hasMoved = false;
    var startX, startY, startLeft, startTop;

    button.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return; // 只响应左键
      isDragging = true;
      hasMoved = false;
      button.classList.add('dragging');

      startX = e.clientX;
      startY = e.clientY;
      startLeft = button.offsetLeft;
      startTop = button.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    }, { passive: false });

    function onMouseMove(e) {
      if (!isDragging) return;

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      // 移动超过5px才认为是拖拽
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
      }

      if (hasMoved) {
        var newLeft = startLeft + dx;
        var newTop = startTop + dy;

        // 边界限制
        var maxLeft = window.innerWidth - button.offsetWidth - 20;
        var maxTop = window.innerHeight - button.offsetHeight - 20;
        newLeft = Math.max(20, Math.min(newLeft, maxLeft));
        newTop = Math.max(20, Math.min(newTop, maxTop));

        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';
        button.style.right = 'auto';
        button.style.bottom = 'auto';
      }
    }

    function onMouseUp() {
      isDragging = false;
      button.classList.remove('dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    button.onclick = function (e) {
      // 只有没有发生拖拽移动才触发点击
      if (hasMoved) return;
      button.parentNode.removeChild(button);
      if (window.PrintManger) {
        window.PrintManger.feature.isEnablePrintV2 = true;

        window.PrintManger.abcClientManager.printerList = [
          {
            name: 'TSC MH240',
            deviceName: 'TSC MH240',
            deviceIndex: 0,
            driveName: 'default',
            color: true,
            pageList: [
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'USER',
                paper: {
                  width: '104.1mm',
                  height: '152.4mm',
                  heightLevels: null,
                  key: 'USER',
                  name: 'USER',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '2 x 4',
                paper: {
                  width: '53.3mm',
                  height: '101.6mm',
                  heightLevels: null,
                  key: '2 x 4',
                  name: '2 x 4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '4 x 4',
                paper: {
                  width: '104.1mm',
                  height: '101.6mm',
                  heightLevels: null,
                  key: '4 x 4',
                  name: '4 x 4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '4 x 6',
                paper: {
                  width: '104.1mm',
                  height: '152.4mm',
                  heightLevels: null,
                  key: '4 x 6',
                  name: '4 x 6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'E邮宝长',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: 'E邮宝长',
                  name: 'E邮宝长',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'E邮宝短',
                paper: {
                  width: '102.5mm',
                  height: '100mm',
                  heightLevels: null,
                  key: 'E邮宝短',
                  name: 'E邮宝短',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '百世汇通',
                paper: {
                  width: '102.5mm',
                  height: '170mm',
                  heightLevels: null,
                  key: '百世汇通',
                  name: '百世汇通',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '百世扩展',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '百世扩展',
                  name: '百世扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '菜鸟中通',
                paper: {
                  width: '102.5mm',
                  height: '190mm',
                  heightLevels: null,
                  key: '菜鸟中通',
                  name: '菜鸟中通',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '国通快递',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '国通快递',
                  name: '国通快递',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '京东面单',
                paper: {
                  width: '102.5mm',
                  height: '113mm',
                  heightLevels: null,
                  key: '京东面单',
                  name: '京东面单',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通标准大',
                paper: {
                  width: '102.5mm',
                  height: '201mm',
                  heightLevels: null,
                  key: '申通标准大',
                  name: '申通标准大',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通标准小',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '申通标准小',
                  name: '申通标准小',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通扩展',
                paper: {
                  width: '102.5mm',
                  height: '201mm',
                  heightLevels: null,
                  key: '申通扩展',
                  name: '申通扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '顺丰',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '顺丰',
                  name: '顺丰',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '天天/全峰/快捷',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '天天/全峰/快捷',
                  name: '天天/全峰/快捷',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '优速/宅急送',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '优速/宅急送',
                  name: '优速/宅急送',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '优速标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '优速标准',
                  name: '优速标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '邮政物流',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '邮政物流',
                  name: '邮政物流',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '邮政小包',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '邮政小包',
                  name: '邮政小包',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '圆通标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '圆通标准',
                  name: '圆通标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '圆通扩展',
                paper: {
                  width: '102.5mm',
                  height: '219mm',
                  heightLevels: null,
                  key: '圆通扩展',
                  name: '圆通扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '韵达标准',
                paper: {
                  width: '102.5mm',
                  height: '203mm',
                  heightLevels: null,
                  key: '韵达标准',
                  name: '韵达标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '韵达小包',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '韵达小包',
                  name: '韵达小包',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '宅急送',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '宅急送',
                  name: '宅急送',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '中通标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '中通标准',
                  name: '中通标准',
                  orientations: [0, 1],
                },
              },
            ],
            offset: {
              offsetX: 1.3,
              offsetY: 0,
            },
          },
          {
            name: 'EPSON L360 Series',
            deviceName: 'EPSON L360 Series',
            deviceIndex: 4,
            driveName: 'default',
            color: true,
            pageList: [
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A4 210 x 297 毫米',
                paper: {
                  width: '210mm',
                  height: '297mm',
                  heightLevels: null,
                  key: 'A4 210 x 297 毫米',
                  name: 'A4 210 x 297 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '102 x 152 毫米 (4 x 6 英寸)',
                paper: {
                  width: '101.6mm',
                  height: '152.4mm',
                  heightLevels: null,
                  key: '102 x 152 毫米 (4 x 6 英寸)',
                  name: '102 x 152 毫米 (4 x 6 英寸)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '127 x 178 毫米 (5 x 7 英寸)',
                paper: {
                  width: '127mm',
                  height: '178mm',
                  heightLevels: null,
                  key: '127 x 178 毫米 (5 x 7 英寸)',
                  name: '127 x 178 毫米 (5 x 7 英寸)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A6 105 x 148 毫米',
                paper: {
                  width: '105mm',
                  height: '148mm',
                  heightLevels: null,
                  key: 'A6 105 x 148 毫米',
                  name: 'A6 105 x 148 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A5 148 x 210 毫米',
                paper: {
                  width: '148mm',
                  height: '210mm',
                  heightLevels: null,
                  key: 'A5 148 x 210 毫米',
                  name: 'A5 148 x 210 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'B5 182 x 257 毫米',
                paper: {
                  width: '182mm',
                  height: '257mm',
                  heightLevels: null,
                  key: 'B5 182 x 257 毫米',
                  name: 'B5 182 x 257 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '89 x 127 毫米 (3.5 x 5 英寸)',
                paper: {
                  width: '89mm',
                  height: '127mm',
                  heightLevels: null,
                  key: '89 x 127 毫米 (3.5 x 5 英寸)',
                  name: '89 x 127 毫米 (3.5 x 5 英寸)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '127 x 203 毫米 (5 x 8 英寸)',
                paper: {
                  width: '127mm',
                  height: '203.2mm',
                  heightLevels: null,
                  key: '127 x 203 毫米 (5 x 8 英寸)',
                  name: '127 x 203 毫米 (5 x 8 英寸)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '203 x 254 毫米 (8 x 10 英寸)',
                paper: {
                  width: '203.2mm',
                  height: '254mm',
                  heightLevels: null,
                  key: '203 x 254 毫米 (8 x 10 英寸)',
                  name: '203 x 254 毫米 (8 x 10 英寸)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '16:9 宽尺寸 (102 x 181 毫米)',
                paper: {
                  width: '101.6mm',
                  height: '180.6mm',
                  heightLevels: null,
                  key: '16:9 宽尺寸 (102 x 181 毫米)',
                  name: '16:9 宽尺寸 (102 x 181 毫米)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '100 x 148 毫米',
                paper: {
                  width: '100mm',
                  height: '148mm',
                  heightLevels: null,
                  key: '100 x 148 毫米',
                  name: '100 x 148 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '信封 #10 4 1/8 x 9 1/2 英寸',
                paper: {
                  width: '104.8mm',
                  height: '241.3mm',
                  heightLevels: null,
                  key: '信封 #10 4 1/8 x 9 1/2 英寸',
                  name: '信封 #10 4 1/8 x 9 1/2 英寸',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '信封 DL  110 x 220 毫米',
                paper: {
                  width: '110mm',
                  height: '220mm',
                  heightLevels: null,
                  key: '信封 DL  110 x 220 毫米',
                  name: '信封 DL  110 x 220 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '信封 C6  114 x 162 毫米',
                paper: {
                  width: '114mm',
                  height: '162mm',
                  heightLevels: null,
                  key: '信封 C6  114 x 162 毫米',
                  name: '信封 C6  114 x 162 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '信纸 8 1/2 x 11 英寸',
                paper: {
                  width: '215.9mm',
                  height: '279.4mm',
                  heightLevels: null,
                  key: '信纸 8 1/2 x 11 英寸',
                  name: '信纸 8 1/2 x 11 英寸',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Legal 8 1/2 x 14 英寸',
                paper: {
                  width: '215.9mm',
                  height: '355.6mm',
                  heightLevels: null,
                  key: 'Legal 8 1/2 x 14 英寸',
                  name: 'Legal 8 1/2 x 14 英寸',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A3 297 x 420 毫米',
                paper: {
                  width: '297mm',
                  height: '420mm',
                  heightLevels: null,
                  key: 'A3 297 x 420 毫米',
                  name: 'A3 297 x 420 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A3+ 329 x 483 毫米',
                paper: {
                  width: '329mm',
                  height: '483mm',
                  heightLevels: null,
                  key: 'A3+ 329 x 483 毫米',
                  name: 'A3+ 329 x 483 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A2 420 x 594 毫米',
                paper: {
                  width: '420mm',
                  height: '594mm',
                  heightLevels: null,
                  key: 'A2 420 x 594 毫米',
                  name: 'A2 420 x 594 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'B4 257 x 364 毫米',
                paper: {
                  width: '257mm',
                  height: '364mm',
                  heightLevels: null,
                  key: 'B4 257 x 364 毫米',
                  name: 'B4 257 x 364 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'B3 364 x 515 毫米',
                paper: {
                  width: '364mm',
                  height: '515mm',
                  heightLevels: null,
                  key: 'B3 364 x 515 毫米',
                  name: 'B3 364 x 515 毫米',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '用户自定义',
                paper: {
                  width: '210mm',
                  height: '297mm',
                  heightLevels: null,
                  key: '用户自定义',
                  name: '用户自定义',
                  orientations: [0, 1],
                },
              },
            ],
            offset: {
              offsetX: 3,
              offsetY: 3,
            },
          },
          {
            name: 'Doro PDF Writer',
            deviceName: 'Doro PDF Writer',
            deviceIndex: 5,
            driveName: 'default',
            color: true,
            pageList: [
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Tabloid',
                paper: {
                  width: '279.4mm',
                  height: '431.8mm',
                  heightLevels: null,
                  key: 'Tabloid',
                  name: 'Tabloid',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Ledger',
                paper: {
                  width: '431.8mm',
                  height: '279.4mm',
                  heightLevels: null,
                  key: 'Ledger',
                  name: 'Ledger',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A3',
                paper: {
                  width: '297mm',
                  height: '420mm',
                  heightLevels: null,
                  key: 'A3',
                  name: 'A3',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A4',
                paper: {
                  width: '210mm',
                  height: '297mm',
                  heightLevels: null,
                  key: 'A4',
                  name: 'A4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A5',
                paper: {
                  width: '148mm',
                  height: '210mm',
                  heightLevels: null,
                  key: 'A5',
                  name: 'A5',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A2',
                paper: {
                  width: '420mm',
                  height: '594mm',
                  heightLevels: null,
                  key: 'A2',
                  name: 'A2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A6',
                paper: {
                  width: '105mm',
                  height: '148mm',
                  heightLevels: null,
                  key: 'A6',
                  name: 'A6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Legal',
                paper: {
                  width: '215.9mm',
                  height: '355.6mm',
                  heightLevels: null,
                  key: 'Legal',
                  name: 'Legal',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Letter',
                paper: {
                  width: '215.9mm',
                  height: '279.4mm',
                  heightLevels: null,
                  key: 'Letter',
                  name: 'Letter',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'LetterSmall',
                paper: {
                  width: '215.9mm',
                  height: '279.4mm',
                  heightLevels: null,
                  key: 'LetterSmall',
                  name: 'LetterSmall',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A0',
                paper: {
                  width: '841mm',
                  height: '1188.8mm',
                  heightLevels: null,
                  key: 'A0',
                  name: 'A0',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A1',
                paper: {
                  width: '594mm',
                  height: '841mm',
                  heightLevels: null,
                  key: 'A1',
                  name: 'A1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ExtraLarge',
                paper: {
                  width: '22930.5mm',
                  height: '22930.5mm',
                  heightLevels: null,
                  key: 'ExtraLarge',
                  name: 'ExtraLarge',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A4 Small',
                paper: {
                  width: '209.9mm',
                  height: '297mm',
                  heightLevels: null,
                  key: 'A4 Small',
                  name: 'A4 Small',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A7',
                paper: {
                  width: '74mm',
                  height: '104.7mm',
                  heightLevels: null,
                  key: 'A7',
                  name: 'A7',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A8',
                paper: {
                  width: '52.2mm',
                  height: '74mm',
                  heightLevels: null,
                  key: 'A8',
                  name: 'A8',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A9',
                paper: {
                  width: '37mm',
                  height: '52.2mm',
                  heightLevels: null,
                  key: 'A9',
                  name: 'A9',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'A10',
                paper: {
                  width: '25.7mm',
                  height: '37mm',
                  heightLevels: null,
                  key: 'A10',
                  name: 'A10',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B0',
                paper: {
                  width: '1000.1mm',
                  height: '1413.9mm',
                  heightLevels: null,
                  key: 'ISO B0',
                  name: 'ISO B0',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B1',
                paper: {
                  width: '706.9mm',
                  height: '1000.1mm',
                  heightLevels: null,
                  key: 'ISO B1',
                  name: 'ISO B1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B2',
                paper: {
                  width: '499.8mm',
                  height: '706.9mm',
                  heightLevels: null,
                  key: 'ISO B2',
                  name: 'ISO B2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B3',
                paper: {
                  width: '353.1mm',
                  height: '499.8mm',
                  heightLevels: null,
                  key: 'ISO B3',
                  name: 'ISO B3',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B4',
                paper: {
                  width: '250.1mm',
                  height: '353.1mm',
                  heightLevels: null,
                  key: 'ISO B4',
                  name: 'ISO B4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B5',
                paper: {
                  width: '176mm',
                  height: '250.1mm',
                  heightLevels: null,
                  key: 'ISO B5',
                  name: 'ISO B5',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ISO B6',
                paper: {
                  width: '124.8mm',
                  height: '176mm',
                  heightLevels: null,
                  key: 'ISO B6',
                  name: 'ISO B6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B0',
                paper: {
                  width: '1030.1mm',
                  height: '1455.9mm',
                  heightLevels: null,
                  key: 'JIS B0',
                  name: 'JIS B0',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B1',
                paper: {
                  width: '728.1mm',
                  height: '1030.1mm',
                  heightLevels: null,
                  key: 'JIS B1',
                  name: 'JIS B1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B2',
                paper: {
                  width: '515mm',
                  height: '728.1mm',
                  heightLevels: null,
                  key: 'JIS B2',
                  name: 'JIS B2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B3',
                paper: {
                  width: '364mm',
                  height: '515mm',
                  heightLevels: null,
                  key: 'JIS B3',
                  name: 'JIS B3',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B4',
                paper: {
                  width: '257.1mm',
                  height: '364mm',
                  heightLevels: null,
                  key: 'JIS B4',
                  name: 'JIS B4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B5',
                paper: {
                  width: '182mm',
                  height: '257.1mm',
                  heightLevels: null,
                  key: 'JIS B5',
                  name: 'JIS B5',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'JIS B6',
                paper: {
                  width: '128mm',
                  height: '182mm',
                  heightLevels: null,
                  key: 'JIS B6',
                  name: 'JIS B6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C0',
                paper: {
                  width: '916.8mm',
                  height: '1297.1mm',
                  heightLevels: null,
                  key: 'C0',
                  name: 'C0',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C1',
                paper: {
                  width: '648mm',
                  height: '916.8mm',
                  heightLevels: null,
                  key: 'C1',
                  name: 'C1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C2',
                paper: {
                  width: '457.9mm',
                  height: '648mm',
                  heightLevels: null,
                  key: 'C2',
                  name: 'C2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C3',
                paper: {
                  width: '323.8mm',
                  height: '457.9mm',
                  heightLevels: null,
                  key: 'C3',
                  name: 'C3',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C4',
                paper: {
                  width: '228.9mm',
                  height: '323.8mm',
                  heightLevels: null,
                  key: 'C4',
                  name: 'C4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C5',
                paper: {
                  width: '161.9mm',
                  height: '228.9mm',
                  heightLevels: null,
                  key: 'C5',
                  name: 'C5',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'C6',
                paper: {
                  width: '113.9mm',
                  height: '161.9mm',
                  heightLevels: null,
                  key: 'C6',
                  name: 'C6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH E',
                paper: {
                  width: '914.4mm',
                  height: '1219.2mm',
                  heightLevels: null,
                  key: 'ARCH E',
                  name: 'ARCH E',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH D',
                paper: {
                  width: '609.6mm',
                  height: '914.4mm',
                  heightLevels: null,
                  key: 'ARCH D',
                  name: 'ARCH D',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH C',
                paper: {
                  width: '457.2mm',
                  height: '609.6mm',
                  heightLevels: null,
                  key: 'ARCH C',
                  name: 'ARCH C',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH B',
                paper: {
                  width: '304.8mm',
                  height: '457.2mm',
                  heightLevels: null,
                  key: 'ARCH B',
                  name: 'ARCH B',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH A',
                paper: {
                  width: '228.6mm',
                  height: '304.8mm',
                  heightLevels: null,
                  key: 'ARCH A',
                  name: 'ARCH A',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'FLSA',
                paper: {
                  width: '215.9mm',
                  height: '330.2mm',
                  heightLevels: null,
                  key: 'FLSA',
                  name: 'FLSA',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'FLSE',
                paper: {
                  width: '215.9mm',
                  height: '330.2mm',
                  heightLevels: null,
                  key: 'FLSE',
                  name: 'FLSE',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'HalfLetter',
                paper: {
                  width: '139.7mm',
                  height: '215.9mm',
                  heightLevels: null,
                  key: 'HalfLetter',
                  name: 'HalfLetter',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'PA4',
                paper: {
                  width: '209.9mm',
                  height: '279.4mm',
                  heightLevels: null,
                  key: 'PA4',
                  name: 'PA4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Oversize A2',
                paper: {
                  width: '480.1mm',
                  height: '625.1mm',
                  heightLevels: null,
                  key: 'Oversize A2',
                  name: 'Oversize A2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Oversize A1',
                paper: {
                  width: '625.1mm',
                  height: '899.9mm',
                  heightLevels: null,
                  key: 'Oversize A1',
                  name: 'Oversize A1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'Oversize A0',
                paper: {
                  width: '899.9mm',
                  height: '1244.9mm',
                  heightLevels: null,
                  key: 'Oversize A0',
                  name: 'Oversize A0',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '92x92',
                paper: {
                  width: '2336.8mm',
                  height: '2336.8mm',
                  heightLevels: null,
                  key: '92x92',
                  name: '92x92',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ANSI C',
                paper: {
                  width: '431.8mm',
                  height: '558.8mm',
                  heightLevels: null,
                  key: 'ANSI C',
                  name: 'ANSI C',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ANSI D',
                paper: {
                  width: '558.8mm',
                  height: '863.6mm',
                  heightLevels: null,
                  key: 'ANSI D',
                  name: 'ANSI D',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ANSI E',
                paper: {
                  width: '863.6mm',
                  height: '1117.6mm',
                  heightLevels: null,
                  key: 'ANSI E',
                  name: 'ANSI E',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ANSI F',
                paper: {
                  width: '711.2mm',
                  height: '1016mm',
                  heightLevels: null,
                  key: 'ANSI F',
                  name: 'ANSI F',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH E1',
                paper: {
                  width: '762mm',
                  height: '1066.8mm',
                  heightLevels: null,
                  key: 'ARCH E1',
                  name: 'ARCH E1',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH E2',
                paper: {
                  width: '660.4mm',
                  height: '965.2mm',
                  heightLevels: null,
                  key: 'ARCH E2',
                  name: 'ARCH E2',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'ARCH E3',
                paper: {
                  width: '685.8mm',
                  height: '990.6mm',
                  heightLevels: null,
                  key: 'ARCH E3',
                  name: 'ARCH E3',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '40mm×60mm_(宽40mm x 高 60mm)',
                paper: {
                  width: '40mm',
                  height: '60mm',
                  heightLevels: null,
                  key: '40mm×60mm_(宽40mm x 高 60mm)',
                  name: '40mm×60mm_(宽40mm x 高 60mm)',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'PostScript 自定义页面大小',
                paper: {
                  width: '210mm',
                  height: '297mm',
                  heightLevels: null,
                  key: 'PostScript 自定义页面大小',
                  name: 'PostScript 自定义页面大小',
                  orientations: [0, 1],
                },
              },
            ],
            offset: {
              offsetX: 0,
              offsetY: 0,
            },
          },
          {
            name: 'Deli 740C Printer',
            deviceName: 'Deli 740C Printer',
            deviceIndex: 6,
            driveName: 'default',
            color: true,
            pageList: [
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'USER',
                paper: {
                  width: '40mm',
                  height: '60mm',
                  heightLevels: null,
                  key: 'USER',
                  name: 'USER',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '2 x 4',
                paper: {
                  width: '53.3mm',
                  height: '101.6mm',
                  heightLevels: null,
                  key: '2 x 4',
                  name: '2 x 4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '4 x 4',
                paper: {
                  width: '104.1mm',
                  height: '101.6mm',
                  heightLevels: null,
                  key: '4 x 4',
                  name: '4 x 4',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '4 x 6',
                paper: {
                  width: '104.1mm',
                  height: '152.4mm',
                  heightLevels: null,
                  key: '4 x 6',
                  name: '4 x 6',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'E邮宝长',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: 'E邮宝长',
                  name: 'E邮宝长',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: 'E邮宝短',
                paper: {
                  width: '102.5mm',
                  height: '100mm',
                  heightLevels: null,
                  key: 'E邮宝短',
                  name: 'E邮宝短',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '百世汇通',
                paper: {
                  width: '102.5mm',
                  height: '170mm',
                  heightLevels: null,
                  key: '百世汇通',
                  name: '百世汇通',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '百世扩展',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '百世扩展',
                  name: '百世扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '菜鸟中通',
                paper: {
                  width: '102.5mm',
                  height: '190mm',
                  heightLevels: null,
                  key: '菜鸟中通',
                  name: '菜鸟中通',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '国通快递',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '国通快递',
                  name: '国通快递',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '京东面单',
                paper: {
                  width: '102.5mm',
                  height: '113mm',
                  heightLevels: null,
                  key: '京东面单',
                  name: '京东面单',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通标准大',
                paper: {
                  width: '102.5mm',
                  height: '201mm',
                  heightLevels: null,
                  key: '申通标准大',
                  name: '申通标准大',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通标准小',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '申通标准小',
                  name: '申通标准小',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '申通扩展',
                paper: {
                  width: '102.5mm',
                  height: '201mm',
                  heightLevels: null,
                  key: '申通扩展',
                  name: '申通扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '顺丰',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '顺丰',
                  name: '顺丰',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '天天/全峰/快捷',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '天天/全峰/快捷',
                  name: '天天/全峰/快捷',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '优速/宅急送',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '优速/宅急送',
                  name: '优速/宅急送',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '优速标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '优速标准',
                  name: '优速标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '邮政物流',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '邮政物流',
                  name: '邮政物流',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '邮政小包',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '邮政小包',
                  name: '邮政小包',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '圆通标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '圆通标准',
                  name: '圆通标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '圆通扩展',
                paper: {
                  width: '102.5mm',
                  height: '219mm',
                  heightLevels: null,
                  key: '圆通扩展',
                  name: '圆通扩展',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '韵达标准',
                paper: {
                  width: '102.5mm',
                  height: '203mm',
                  heightLevels: null,
                  key: '韵达标准',
                  name: '韵达标准',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '韵达小包',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '韵达小包',
                  name: '韵达小包',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '宅急送',
                paper: {
                  width: '102.5mm',
                  height: '150mm',
                  heightLevels: null,
                  key: '宅急送',
                  name: '宅急送',
                  orientations: [0, 1],
                },
              },
              {
                defaultHeightLevel: null,
                defaultOrientation: 1,
                isRecommend: false,
                isElectronPage: true,
                name: '中通标准',
                paper: {
                  width: '102.5mm',
                  height: '180mm',
                  heightLevels: null,
                  key: '中通标准',
                  name: '中通标准',
                  orientations: [0, 1],
                },
              },
            ],
            offset: {
              offsetX: 1.3,
              offsetY: 0,
            },
          },
        ];
        window.PrintManger.abcClientManager.feature = {
          isABCClientPrintServerOnline: true,
          isBridgePrintEnable: true,
        };

        window.PrintManger.lodopClientManager.feature = {
          isLodopReady: true,
        };
        window.PrintManger.lodopClientManager.printerList = [
          {
            deviceIndex: 0,
            deviceName: 'TSC MH240',
            driveName: 'TSC MH240',
            pageList: [
              {
                name: 'USER',
              },
              {
                name: '2 x 4',
              },
              {
                name: '4 x 4',
              },
              {
                name: '4 x 6',
              },
              {
                name: 'E邮宝长',
              },
              {
                name: 'E邮宝短',
              },
              {
                name: '百世汇通',
              },
              {
                name: '百世扩展',
              },
              {
                name: '菜鸟中通',
              },
              {
                name: '国通快递',
              },
              {
                name: '京东面单',
              },
              {
                name: '申通标准大',
              },
              {
                name: '申通标准小',
              },
              {
                name: '申通扩展',
              },
              {
                name: '顺丰',
              },
              {
                name: '天天/全峰/快捷',
              },
              {
                name: '优速/宅急送',
              },
              {
                name: '优速标准',
              },
              {
                name: '邮政物流',
              },
              {
                name: '邮政小包',
              },
              {
                name: '圆通标准',
              },
              {
                name: '圆通扩展',
              },
              {
                name: '韵达标准',
              },
              {
                name: '韵达小包',
              },
              {
                name: '宅急送',
              },
              {
                name: '中通标准',
              },
            ],
            name: 'TSC MH240',
          },
          {
            deviceIndex: 4,
            deviceName: 'EPSON L360 Series',
            driveName: 'EPSON L360 Series',
            pageList: [
              {
                name: 'A4 210 x 297 毫米',
              },
              {
                name: '102 x 152 毫米 (4 x 6 英寸)',
              },
              {
                name: '127 x 178 毫米 (5 x 7 英寸)',
              },
              {
                name: 'A6 105 x 148 毫米',
              },
              {
                name: 'A5 148 x 210 毫米',
              },
              {
                name: 'B5 182 x 257 毫米',
              },
              {
                name: '89 x 127 毫米 (3.5 x 5 英寸)',
              },
              {
                name: '127 x 203 毫米 (5 x 8 英寸)',
              },
              {
                name: '203 x 254 毫米 (8 x 10 英寸)',
              },
              {
                name: '16:9 宽尺寸 (102 x 181 毫米)',
              },
              {
                name: '100 x 148 毫米',
              },
              {
                name: '信封 #10 4 1/8 x 9 1/2 英寸',
              },
              {
                name: '信封 DL  110 x 220 毫米',
              },
              {
                name: '信封 C6  114 x 162 毫米',
              },
              {
                name: '信纸 8 1/2 x 11 英寸',
              },
              {
                name: 'Legal 8 1/2 x 14 英寸',
              },
              {
                name: 'A3 297 x 420 毫米',
              },
              {
                name: 'A3+ 329 x 483 毫米',
              },
              {
                name: 'A2 420 x 594 毫米',
              },
              {
                name: 'B4 257 x 364 毫米',
              },
              {
                name: 'B3 364 x 515 毫米',
              },
              {
                name: '用户自定义',
              },
            ],
            name: 'EPSON L360 Series',
          },
          {
            deviceIndex: 5,
            deviceName: 'Doro PDF Writer',
            driveName: 'Doro PDF Writer',
            pageList: [
              {
                name: 'Tabloid',
              },
              {
                name: 'Ledger',
              },
              {
                name: 'A3',
              },
              {
                name: 'A4',
              },
              {
                name: 'A5',
              },
              {
                name: 'A2',
              },
              {
                name: 'A6',
              },
              {
                name: 'Legal',
              },
              {
                name: 'Letter',
              },
              {
                name: 'LetterSmall',
              },
              {
                name: 'A0',
              },
              {
                name: 'A1',
              },
              {
                name: 'ExtraLarge',
              },
              {
                name: 'A4 Small',
              },
              {
                name: 'A7',
              },
              {
                name: 'A8',
              },
              {
                name: 'A9',
              },
              {
                name: 'A10',
              },
              {
                name: 'ISO B0',
              },
              {
                name: 'ISO B1',
              },
              {
                name: 'ISO B2',
              },
              {
                name: 'ISO B3',
              },
              {
                name: 'ISO B4',
              },
              {
                name: 'ISO B5',
              },
              {
                name: 'ISO B6',
              },
              {
                name: 'JIS B0',
              },
              {
                name: 'JIS B1',
              },
              {
                name: 'JIS B2',
              },
              {
                name: 'JIS B3',
              },
              {
                name: 'JIS B4',
              },
              {
                name: 'JIS B5',
              },
              {
                name: 'JIS B6',
              },
              {
                name: 'C0',
              },
              {
                name: 'C1',
              },
              {
                name: 'C2',
              },
              {
                name: 'C3',
              },
              {
                name: 'C4',
              },
              {
                name: 'C5',
              },
              {
                name: 'C6',
              },
              {
                name: 'ARCH E',
              },
              {
                name: 'ARCH D',
              },
              {
                name: 'ARCH C',
              },
              {
                name: 'ARCH B',
              },
              {
                name: 'ARCH A',
              },
              {
                name: 'FLSA',
              },
              {
                name: 'FLSE',
              },
              {
                name: 'HalfLetter',
              },
              {
                name: 'PA4',
              },
              {
                name: 'Oversize A2',
              },
              {
                name: 'Oversize A1',
              },
              {
                name: 'Oversize A0',
              },
              {
                name: '92x92',
              },
              {
                name: 'ANSI C',
              },
              {
                name: 'ANSI D',
              },
              {
                name: 'ANSI E',
              },
              {
                name: 'ANSI F',
              },
              {
                name: 'ARCH E1',
              },
              {
                name: 'ARCH E2',
              },
              {
                name: 'ARCH E3',
              },
              {
                name: '40mm×60mm_(宽40mm x 高 60mm)',
              },
              {
                name: 'PostScript 自定义页面大小',
              },
            ],
            name: 'Doro PDF Writer',
          },
          {
            deviceIndex: 6,
            deviceName: 'Deli 740C Printer',
            driveName: 'Deli 740C Printer',
            pageList: [
              {
                name: 'USER',
              },
              {
                name: '2 x 4',
              },
              {
                name: '4 x 4',
              },
              {
                name: '4 x 6',
              },
              {
                name: 'E邮宝长',
              },
              {
                name: 'E邮宝短',
              },
              {
                name: '百世汇通',
              },
              {
                name: '百世扩展',
              },
              {
                name: '菜鸟中通',
              },
              {
                name: '国通快递',
              },
              {
                name: '京东面单',
              },
              {
                name: '申通标准大',
              },
              {
                name: '申通标准小',
              },
              {
                name: '申通扩展',
              },
              {
                name: '顺丰',
              },
              {
                name: '天天/全峰/快捷',
              },
              {
                name: '优速/宅急送',
              },
              {
                name: '优速标准',
              },
              {
                name: '邮政物流',
              },
              {
                name: '邮政小包',
              },
              {
                name: '圆通标准',
              },
              {
                name: '圆通扩展',
              },
              {
                name: '韵达标准',
              },
              {
                name: '韵达小包',
              },
              {
                name: '宅急送',
              },
              {
                name: '中通标准',
              },
            ],
            name: 'Deli 740C Printer',
          },
        ];
      } else {
        window.LODOP = {
          GET_PRINTER_NAME: function () {},
          Printers: {
            default: '0',
            list: [
              {
                name: 'Deli DL-761D',
                DriverName: 'Deli DL-761D',
                PortName: 'FILE:',
                Orientation: '1',
                PaperSize: '256',
                PaperLength: '1290',
                PaperWidth: '825',
                Copies: '1',
                DefaultSource: '256',
                PrintQuality: '203',
                Color: '1',
                Duplex: '1',
                FormName: '',
                Comment: '',
                DriverVersion: '1794',
                DCOrientation: '90',
                MaxExtentWidth: '840',
                MaxExtentLength: '3000',
                MinExtentWidth: '254',
                MinExtentlength: '50',
                pagelist: [
                  {
                    name: 'USER',
                  },
                  {
                    name: '2 x 4',
                  },
                ],
                subdevlist: [],
              },
            ],
          },
        };
      }
    };
    document.body.appendChild(button);
  }
})();