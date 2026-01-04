// ==UserScript==
// @name         Mini_Toast
// @version      1.0.6
// @description  轻提示，友好提示
// @author       Zosah
// ==/UserScript==

class ToastHandler {
    // 单例模式
    constructor() {
        if (ToastHandler.instance) {
            ToastHandler.instance = this;
        }
        this.create();
        return ToastHandler.instance;
    }

    create() {
        let style = document.createElement('style');
        style.innerHTML = `
        @keyframes show {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        
        @keyframes hide {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
        
        .toast_box {
            position: fixed;
            bottom: 50%;
            left: 50%;
            z-index: 9999;
            transform: translate(-50%, -50%);
            display: none;
        }
        
        .toast_box p {
            box-sizing: border-box;
            padding: 10px 20px;
            width: max-content;
            background: #707070;
            color: #fff;
            font-size: 16px;
            text-align: center;
            border-radius: 6px;
            opacity: 0.8;
        }
        
        .toliet {
            margin: 0 auto;
        }`;

        // 将样式添加到 head 元素中
        document.head.appendChild(style);

        // 创建提示框
        let toastBox = document.createElement('div');
        toastBox.className = 'toast_box';
        toastBox.style.display = 'none';

        let toastText = document.createElement('p');
        toastText.id = 'toast';
        toastBox.appendChild(toastText);

        // 将提示框添加到 body 元素中
        document.body.appendChild(toastBox);
    }
    
    showToast(text, time) {
        let toast = document.getElementById('toast');
        let toastBox = document.getElementsByClassName('toast_box')[0];
        toast.innerHTML = text;
        toastBox.style.animation = 'show 0.5s';
        toastBox.style.display = 'inline-block';
        setTimeout(function () {
            toastBox.style.animation = 'hide 1s';
            setTimeout(function () {
                toastBox.style.display = 'none';
            }, 800);
        }, time);
    }
}