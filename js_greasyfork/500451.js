// ==UserScript==
// @name         视频3倍速加速按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为网站提供3倍速加速按钮
// @author       Example Author
// @match       https://www.bilibili.com/*
// @match       https://v.youku.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500451/%E8%A7%86%E9%A2%913%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/500451/%E8%A7%86%E9%A2%913%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn2 = document.createElement('button');
    var state = 1;
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    let initialPageX = 0;
    let initialPageY = 0;
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'draggableButtonContainer';

    const styles = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: '999999',
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #ccc',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      opacity: 0.4
    };


    Object.assign(buttonContainer.style, styles);

    // 让这个按钮组件可以拖动。
    buttonContainer.onmousemove = function(event) {
        buttonContainer.style.opacity = "0.8"

        if (!isDragging) return;
        const newX = initialX + event.pageX - initialPageX;
        const newY = initialY + event.pageY - initialPageY;
        buttonContainer.style.left = newX + 'px';
        buttonContainer.style.top = newY + 'px';
    };

    buttonContainer.onmouseup = function() {

        isDragging = false;
        buttonContainer.style.opacity = "0.8"
    };

    buttonContainer.onmouseleave = function() {

        isDragging = false;
      buttonContainer.style.opacity = "0.4"
    };

    buttonContainer.onmousedown = function(event) {


      isDragging = true;
      initialX = this.offsetLeft;
      initialY = this.offsetTop;
      initialPageX = event.clientX;
      initialPageY = event.clientY;
    };




    // 为什么这里按键事件，能被监听器检测到，但是却不能响应。
    function sendKey1(keyCode,lable) {
        const downEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            keyCode: keyCode,
            key: lable,
        });

        const upEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            keyCode: keyCode,
            key: lable,
        });

        document.dispatchEvent(downEvent);
        setTimeout(document.dispatchEvent(upEvent), 500);

    }

    function sendKey2(state1) {
      console.log(state1)
       // 按下并且不松手，实现加速效果、。
      if(state1=="1"){
        const downEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            keyCode: 39,
            key: "加速中",
        });
        document.dispatchEvent(downEvent);
        btn2.textContent="恢复";
        state = 0;
        return;



      }
      // 抬起按钮，恢复正常速度。。
      else{
        const upEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            keyCode: 39,
            key: "恢复正常速度",
        });
        document.dispatchEvent(upEvent);
        btn2.textContent="快进";
        state = 1;
        return;
      }

    }


    const directionKeys = [

        { label: '前进', keyCode: 39 },
        { label: '后退', keyCode: 37 },
    ];
    // 创建按钮 绑定函数
    directionKeys.forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = key.label;
        btn.onclick = () => sendKey1(key.keyCode,key.label);
        buttonContainer.appendChild(btn);
    });

    document.body.appendChild(buttonContainer);

    btn2.textContent = "快进";
    btn2.onclick = () => sendKey2(state);
    // 在盒子中添加按钮。
    buttonContainer.appendChild(btn2);

    // 监听按键按下和抬起事件

    const onKeydownUp = (e, isDown) => {
      console.log(`key: ${e.key} ${isDown ? 'down' : 'up'}`);
      if(e.key==39||!isDown){
        btn2.textContent="快进";
        state = 1;
      }
    };

    const testUpAndDown = () => {
      document.addEventListener('keydown', (e) => onKeydownUp(e, true));
      document.addEventListener('keyup', (e) => onKeydownUp(e, false));
    };

    testUpAndDown();

})();