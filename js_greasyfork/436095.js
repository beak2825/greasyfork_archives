// ==UserScript==
// @name         红心跳跃
// @namespace    http://hongbin.xyz/
// @version      0.2
// @description  鼠标点击特效
// @author       hongbin
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436095/%E7%BA%A2%E5%BF%83%E8%B7%B3%E8%B7%83.user.js
// @updateURL https://update.greasyfork.org/scripts/436095/%E7%BA%A2%E5%BF%83%E8%B7%B3%E8%B7%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
document.head.appendChild(style);
style.innerHTML = `
.heartWrap {
    position: absolute;
    z-index:999;
}

.heart {
    position: absolute;
    background-color: #faa;
    animation: heartMove 1s linear infinite;
    animation-iteration-count: 1;
    animation-delay: var(--delay, 0);
    animation-fill-mode: forwards;
    transform-origin: center;
    opacity: 0;
    /* transition: all 1s linear; */
}

.heart:before,
.heart:after {
    position: absolute;
    content: "";
    left: 6px;
    top: 0;
    width: 6px;
    height: 10px;
    background: inherit;
    border-radius: 15px 15px 0 0;
    transform-origin: 0 100%;
    transform: rotate(-45deg);
}

.heart:after {
    left: 0;
    transform-origin: 100% 100%;
    transform: rotate(45deg);
}

.late0 {
    --lateX: -0px;
    --delay: 0.2s;
}

.late1 {
    --lateX: -10px;
    --delay: 0.1s;
}

.late2 {
    --lateX: -20px;
}

.late3 {
    --lateX: 10px;
    --delay: 0.3s;
}

.late4 {
    --lateX: 20px;
    --delay: 0.4s;
}

@keyframes heartMove {
    0% {
        transform: scale(0.5);
        opacity: 0.1;
    }

    150% {
        transform: translate(var(--lateX, 0px), -30px);
    }

    50% {
        transform: scale(1) translate(var(--lateX, 0px), -100px);
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
`;

document.addEventListener('click', (e) => {
    const vNode = document.createElement('div');
    vNode.className = "heartWrap";
    Array.from(new Array(5), (_, index) => {
        const heart = document.createElement('div');
        heart.className = `heart late${index}`;
        heart.style.background = "#" + Math.random().toString(16).slice(-6);
        // heart.style.top = -index * 2 + 'px';
        vNode.appendChild(heart);
    });
    document.body.appendChild(vNode);
    vNode.style.top = e.pageY - 20 + "px";
    vNode.style.left = e.pageX - 10 + "px";
    setTimeout(() => {
        document.body.removeChild(vNode);
    }, 2000)
})

})();