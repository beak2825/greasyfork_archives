// ==UserScript==
// @name 点击置顶(长按置底)
// @version	1.3
// @description	在所有页面生成一个顺滑回到顶部的按钮，修改自https://greasyfork.org/zh-CN/scripts/435303-%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8
// @author	@leo
// @run-at document-end
// @email	ygnh136@qq.com
// @match	*://*/*
// @license	MIT
// @namespace	https://greasyfork.org/zh-CN/users/954189
// @downloadURL https://update.greasyfork.org/scripts/462920/%E7%82%B9%E5%87%BB%E7%BD%AE%E9%A1%B6%28%E9%95%BF%E6%8C%89%E7%BD%AE%E5%BA%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462920/%E7%82%B9%E5%87%BB%E7%BD%AE%E9%A1%B6%28%E9%95%BF%E6%8C%89%E7%BD%AE%E5%BA%95%29.meta.js
// ==/UserScript==


(function CreateGoToTopButton() {

var style = document.createElement('style');
style.innerHTML = `
.GO_TO_TOP_button {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 1px 2px rgb(0 0 0 / 23%);
    position: fixed;
    left: 50%;
    transform: translate(-50%,0);
    bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999999;
    background-color: white;
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
}
.GO_TO_TOP_button svg {
  width: 24px;
  height: 24px;
  margin: 0;
}
`;
document.head.appendChild(style);

const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
}
const goToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
}

	const button = document.createElement('div')
	button.className = 'GO_TO_TOP_button'
	button.innerHTML =
		'<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M825.568 555.328l-287.392-289.28C531.808 259.648 523.488 256.576 515.2 256.64 514.08 256.544 513.12 256 512 256c-4.672 0-9.024 1.088-13.024 2.88-4.032 1.536-7.872 3.872-11.136 7.136l-259.328 258.88c-12.512 12.48-12.544 32.736-0.032 45.248 6.24 6.272 14.432 9.408 22.656 9.408 8.192 0 16.352-3.136 22.624-9.344L480 364.288 480 928c0 17.696 14.336 32 32 32s32-14.304 32-32L544 362.72l236.192 237.728c6.24 6.272 14.496 9.44 22.688 9.44s16.32-3.104 22.56-9.312C838.016 588.128 838.048 567.84 825.568 555.328z" ></path><path d="M864 192 160 192C142.336 192 128 177.664 128 160s14.336-32 32-32l704 0c17.696 0 32 14.336 32 32S881.696 192 864 192z"></path></svg>'

let pressTimer;
let isLongPress = false;
button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    pressTimer = setTimeout(() => {
        isLongPress = true;
        goToBottom(); 
        button.style.transform = 'translate(-50%, 0) scale(0.9)';
    }, 500);
});

button.addEventListener("touchend", (event) => {
    event.preventDefault();
    clearTimeout(pressTimer);
    if (!isLongPress) {
        goToTop();
        button.style.transform = 'translate(-50%, 0) scale(1.1)';
        setTimeout(() => {
        button.style.transform = 'translate(-50%, 0) scale(1)';
        }, 200);
    }
    else {
      button.style.transform = 'translate(-50%, 0) scale(1)';
    }
    isLongPress = false;
});

button.style.display = 'none';
document.body.appendChild(button);

let timer;
window.addEventListener("scroll", function () {
      if (window.pageYOffset > 50) {
        button.style.opacity = "0.8";
        button.style.display = 'flex';
      }
      else if (window.pageYOffset === 0) {
        button.style.opacity = "0";
        setTimeout(function(){
        button.style.display = 'none';
        }, 200);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.style.opacity = "0";
        setTimeout(function(){
        button.style.display = 'none';
        }, 200);
      }, 1800);
});

document.addEventListener('scroll', onScroll);

})();