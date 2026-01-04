// ==UserScript==
// @name         表单辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://218.6.244.186:16000/warning/Page/MainFrame/default.aspx?ver=3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423380/%E8%A1%A8%E5%8D%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/423380/%E8%A1%A8%E5%8D%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

  (function () {
     'use strict';
     console.log('我的脚本加载了');
     let rtuFlag = false
     let monitorFlag = false 
     let elem;
     //    工具函数  
     function ce(type, style) {
         let elem = document.createElement(type);
         Object.assign(elem.style, style);
         return elem;
     }
     // 元素盒子
     function createDiv() {
         let div = ce("div", {
             width: '240px',
             height: "100px",
             color: "#000",
             margin: "0 0 10px 10px",
             fontSize: "12px",
             position: 'absolute',
             right: "7%",
             top: "3%",
             zIndex: "99999"
         });
         for (let i = 0; i < 2; i++) {
             let button = createButton(i)
             div.appendChild(button)
             if (i == 0) { // er  ->  1
                 button.addEventListener('click', function (event) {
                     remove(rtuFlag)
                     rtuFlag = false
                     if (monitorFlag) {
                         remove(monitorFlag)
                         monitorFlag = false
                     } else {
                         monitorFlag = true
                         let inputs = createInput()
                         inputs.placeholder = "数据监测"
                         listenInput(inputs)
                         div.appendChild(inputs)

                     }
                 })
             } else { //2
                 button.addEventListener('click', function (event) {
                     console.log("一下", rtuFlag)
                     remove(monitorFlag)
                     monitorFlag = false
                     if (rtuFlag) {
                         remove(rtuFlag)
                         rtuFlag = false
                     } else {
                         rtuFlag = true
                         let inputs = createInput()
                         inputs.placeholder = "RTU"
                         listenInput(inputs)
                         div.appendChild(inputs)

                     }
                 })
             }
         }
         return div
     }
     //  删除元素
     function remove(flag) {
         if (flag) {
             let element = document.getElementById("keys");
             if (element != null) {
                 element.removeEventListener("mousemove", listenInput);
                 element.parentNode.removeChild(element);
             }

         }
     }
     // input
     function createInput() {
         let inputs = ce("input", {
             width: '210px',
             height: "50px",
             color: "#000",
             fontSize: "12px",
             position: 'absolute',
             right: "5%",
             top: "25%",
             zIndex: "99999"
         });
         inputs.id = "keys";
         inputs.value = "";
         return inputs
     }
     // 按钮
     function createButton(index) {
         let btn = ce("button", {
             width: '80px',
             height: "20px",
             color: "#000",
             fontSize: "12px",
             position: 'absolute',
             right: index * 60 + "%",
             top: "3%",
             zIndex: "99999"
         });
         btn.id = index
         btn.placeholder = index == 0 ? "监测数据" : "RTU"
         btn.textContent = index == 0 ? "监测数据" : "RTU"
         return btn
     }

     /**
      * 监听输入
      * @param {element} element 元素
      */
     function listenInput(element) {
         if (element == null) return;
         element.addEventListener("input", function (e) {
              let val = e.target.value
             if (rtuFlag) { 
                 //  let snsArr=val.split(/[(\r\n)\r\n]+/);
                 let snsArr = val.replace(/\s+/g, ",").split(',')
                 workPublic( snsArr, "RTU")
             } else if (monitorFlag) {
                 let snsArr = val.replace(/(\s|°|′|″)+/g, ",").split(',')
                 workPublic( snsArr, "MONITOR")
             }

         });
     }
     // 工作的地方
     function workPublic( snsArr, type) {
         if (snsArr.length>0) {
             let inputText = []
             let filterArr = []
             var childIframeArr = document.getElementsByTagName('iframe')
             let childIframeArr2 = childIframeArr[2].contentWindow.document.getElementsByTagName('iframe')
             let childIframeArr3 = childIframeArr2[0].contentWindow.document.getElementsByTagName('iframe')
             let forms = childIframeArr3[0].contentWindow.document.forms
             for (let i = 0; i < forms[0].elements.length; i++) {
                 if (forms[0].elements[i].type === 'text') {
                     inputText.push(forms[0].elements[i])
                 }
             }
             if (type === 'RTU') {
                 for (let i = 0; i < inputText.length; i++) {
                     if (i >= 2 && i <= 5) {
                         filterArr.push(inputText[i])
                     }
                 }
             } else if (type === 'MONITOR') {
                 // i != 8  取消地理位置
                 for (let i = 0; i < inputText.length; i++) {
                     if (i >= 7 && i <= 18 && i != 9 && i != 10) {
                         filterArr.push(inputText[i])
                     }
                 }
             }
             for (let i = 0; i < filterArr.length; i++) {
                 filterArr[i].value = snsArr[i]
             }

         }
     }
     // document.body.appendChild(button);
     elem = createDiv()
     document.body.appendChild(elem);

 })();