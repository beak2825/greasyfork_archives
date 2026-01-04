// ==UserScript==
// @name        原生作者
// @namespace   Violentmonkey Scripts
// @match       https://ilabel.weixin.qq.com/mission/7857/label*
// @grant       none
// @version     1.0
// @author      shihaoliu
// @description 2024/3/25 19:16:30
// @downloadURL https://update.greasyfork.org/scripts/490974/%E5%8E%9F%E7%94%9F%E4%BD%9C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/490974/%E5%8E%9F%E7%94%9F%E4%BD%9C%E8%80%85.meta.js
// ==/UserScript==
// ==UserScript==
// @name        New script qq.com
// @namespace   Violentmonkey Scripts
// @match       https://ilabel.weixin.qq.com/mission/7857/label*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/3/25 16:50:01
// ==/UserScript==
(function () {
  "use strict";

  var style = document.createElement("style");
  style.textContent = `
        .no-select{
          width: 70px;
          height: 30px;
          border-radius: 5px;
          background-color: transparent;
          position: fixed;
          left: 12%;
          top: 10%;
          cursor: pointer;
          z-index: 99999999;
          transform: translate(0, -50 %);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-size: 13px;
          font-weight: bold;
          box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
        }
        .paste{
          width: 70px;
          height: 30px;
          border-radius: 5px;
          background-color: transparent;
          position: fixed;
          right: 9%;
          top: 18%;
          cursor: pointer;
          z-index: 99999999;
          transform: translate(0, -50 %);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-size: 13px;
          font-weight: bold;
          box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
        }
    `;

  document.head.appendChild(style);

  var Name = document.getElementsByClassName('el-descriptions-item__content');

  // 复制按钮
  var YQ_cube = document.createElement("div");
  // 粘贴按钮
  var Paste = document.createElement("div");

  YQ_cube.className = "no-select";
  Paste.className = "paste";

  YQ_cube.textContent = "复制";
  Paste.textContent = "粘贴";

  document.body.appendChild(YQ_cube);
  document.body.appendChild(Paste);

  YQ_cube.addEventListener("click", function () {
    navigator.clipboard.writeText(Name[0].innerText);
    // console.log(navigator.clipboard.writeText(Name[0].innerText));
  });

  Paste.addEventListener("click", function () {

    navigator.clipboard.readText().then((text) => {
      // 将获取到的文本内容粘贴到指定位置
      const NameInput = document.getElementsByClassName('el-input__inner');
      // console.log(text)
      const Arr = text.split(',');
      for(let i = 0; i < Arr.length; i++){

        var evt = new InputEvent('input', {
            inputType: 'insertText',
            /*data: st,
            dataTransfer: null,
            isComposing: false*/
        });
        NameInput[i].value = Arr[i];
        // 模拟输入事件
        NameInput[i].dispatchEvent(evt);
      }
    });
  });

})();
