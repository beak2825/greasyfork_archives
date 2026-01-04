// ==UserScript==
// @name         openloot点击
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license GPL
// @description  openloot
// @author       从前跟你一样
// @grant        unsafeWindow
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      vagrantup.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect       *
// @connect      127.0.0.1
// @connect      novelai.net
// @match        *://*/*
// @description  Save user settings
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/524403/openloot%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/524403/openloot%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.hasRun) return;
    window.hasRun = true;
    let ws = null;
    let lastUrl = unsafeWindow.location.href;
    const style = document.createElement('style');
    style.textContent = `
      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .slider {
        background-color: #2196F3;
      }
      input:checked + .slider:before {
        transform: translateX(26px);
      }
          .test-button {
    padding: 10px 20px;
    font-size: 14px;
    color: #fff;
    background: linear-gradient(45deg, #2196F3, #1976D2);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }

  .test-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .test-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
    `;

  let jb=GM_getValue("脚本","true")
  console.log("脚本为:"+jb);
  const panel = document.createElement('div');
  panel.innerHTML=`<label class="switch">
    <input type="checkbox" id="scriptToggle" ${jb=="true" ? 'checked' : ''}>
    <span class="slider"></span>
    </label>
    <label for="scriptToggle" style="display: inline-block; margin-left: 10px;">启用脚本</label>
    <br><br>
      <button id="testButton" style="padding: 8px 16px; margin-top: 10px; cursor: pointer;" class="test-button">测试</button>
    `

    let ts=document.getElementById('scriptToggle');
    if(!ts){
    document.head.appendChild(style);
    document.body.insertBefore(panel, document.body.firstChild);

  }


    let sc=document.getElementById('scriptToggle');
    if(!sc.className.includes('switch dis')){
      sc.className="test-button dis"
      sc.addEventListener('change', function() {
      if(this.checked) {
        console.log('脚本已启用');
        alert('脚本已启用');
        GM_setValue("脚本", "true");
        // 启用脚本的代码
      } else {
        console.log('脚本已禁用');
        alert('脚本已禁用');
       GM_setValue("脚本", "false");
        // 禁用脚本的代码
      }
    });
  }
    let bt=document.getElementById('testButton')

    if(!bt.className.includes('dis')){
      bt.className="test-button dis"
      bt.addEventListener('click', () => {
        console.log('测试按钮被点击了！');
        ws.send("测试")
        // 在这里添加您的测试代码
      });
    }



    // 页面加载完成后立即尝试点击
    // window.addEventListener('load', clickTargetButton);

    // 可选：每隔一段时间检查并点击按钮（如果一次加载未成功）
    const checkInterval = setInterval(() => {
                // 使用精确的类名选择器查找按钮

        let scl=GM_getValue("脚本")
        console.log(scl);

        const button = document.querySelector('button[type="button"].chakra-button.css-vx5jmh');
        console.log(button);
        const button2 = document.querySelector('button[type="button"].chakra-button.css-1czw7ux');
         console.log(button2);
        const button3 = document.querySelector('.css-o7tirk');
        console.log("sd"+button3);


        if (button3&&scl=="true") {
            console.log('成功点击目标按钮');
            button3.click();
            //button3.dispatchEvent(event);
             }
        if (button2&&scl=="true") {
            console.log('成功点击目标按钮');
            button2.click();

          //  button2.dispatchEvent(event);
             }
        if (button&&scl=="true") {
            console.log('成功点击目标按钮');
            button.click();
          //  button.dispatchEvent(event);
          }
            // button.click();
            // button2.click();
            // const event = new MouseEvent('click', {
            //         view: window,
            //         bubbles: true,
            //         cancelable: true
            //     });
            // button2.dispatchEvent(event);

            // button.dispatchEvent(event);

    }, 300); // 每2秒检查一次

})();
