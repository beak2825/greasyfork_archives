// ==UserScript==

// @name 冲浪指南

// @namespace http://tampermonkey.net/

// @version 0.51 /* 最后一次更新 */

// @description 一点组织能力都没有，画不出的，洗洗睡吧

// @author winnie_pooh pooh

// @match https://hot-potato.reddit.com/embed*

// @match https://www.reddit.com/r/place/

// @icon https://preview.redd.it/otxdcc06a3r81.png?width=960&format=png&auto=webp&s=f49467e7afb6ce245b11df6d71b3f0dbdf423b0e

// @grant none

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/442549/%E5%86%B2%E6%B5%AA%E6%8C%87%E5%8D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/442549/%E5%86%B2%E6%B5%AA%E6%8C%87%E5%8D%97.meta.js
// ==/UserScript==

/* 浪人什么组织能力都没有，mod 直接装死，画了两天连个 discord or tg group 都没有还在用 live chat 沟通，好不容易画个维尼结果写几个支文上去像你吗小学生，连擦都擦不掉，不觉得丢人？？？脚本脚本不行，外交外交没有，还要去舔织女，难怪被a畜干烂，洗洗睡吧。*/

if (window.top !== window.self) {

window.addEventListener('load', () => {

document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(

(function () {

const i = document.createElement("img");

i.src = "https://preview.redd.it/l0ts3d6ifcr81.png?width=6000&format=png&auto=webp&s=5662327294d2560c59c67729508d98f6668c5554";

i.style ="position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";

console.log(i);

return i;

})())

}, false);

}