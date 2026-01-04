// ==UserScript==
// @name         划词二维码
// @namespace    https://mings.work/
// @version      0.4
// @description  选中文字或链接，按键盘 Q 一键显示二维码!
// @author       Ming
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/408412/%E5%88%92%E8%AF%8D%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/408412/%E5%88%92%E8%AF%8D%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let selection;
  let position;
  document.onselectionchange = function () {
    selection = document.getSelection();


    if (!selection || selection && selection.toString().length < 1) {
      tryClearCanvas()
    }
  };


  function insertButton() {
    var qrCanvas = document.createElement("canvas");
    qrCanvas.id = Date.now();
    qrCanvas.className = "qr-canvas"
    qrCanvas.style = `position: fixed; left: ${position.x ? position.x : "0"}px; top: ${position.y ? position.y - window.screen.availTop : "0"}px; z-index: 99999;`

    var range = selection.getRangeAt(0);
    const newRange = document.createRange();

    try {
      newRange.setStart(selection.focusNode, range.endOffset);
      newRange.insertNode(qrCanvas);
    } catch (error) {
      selection.baseNode.parentElement.appendChild(qrCanvas)
    }


    var qrcodeText = selection.toString()
    if (selection.baseNode.parentElement.href) qrcodeText = selection.baseNode.parentElement.href

    QRCode.toCanvas(
      qrCanvas,
      qrcodeText,
      function (error) {
        if (error) console.error(error);
        console.log("success!");
      }
    );
  }

  function tryClearCanvas() {
    if (document.getElementsByClassName("qr-canvas")) {
      const qrCanvasList = document.getElementsByClassName("qr-canvas")

      for (let element of qrCanvasList) {
        element.remove();
      }
    }
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "q") {
        if (selection && (selection.toString().length > 0 || selection.baseNode.parentElement.href)) {
          insertButton()
        }
      }
    },
    false
  );

  document.addEventListener('mouseup', e => {
    position = {
      x: e.clientX,
      y: e.clientY
    };
  });
})();
