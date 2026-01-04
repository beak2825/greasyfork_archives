// ==UserScript==
// @name         网页返回顶部
// @namespace    
// @version      0.1
// @match        *://*/*
// @description  返回顶部
// @author       unamerrr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492661/%E7%BD%91%E9%A1%B5%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/492661/%E7%BD%91%E9%A1%B5%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {

'use strict';

    var base64Url='url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABYNJREFUeF7tncmuW0UQhv+W7yMgJJQ1m2TBgnkmzPOc7HgE1NWyxA6xYMXiysd5CpQwQxjCPENgA9KNxAuEBQ/AymrkKFfA1Y1d7T62T3X9Xledc/7//7rO4CmAL9cOBNfqKR4EwDkEBIAAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AA+HNARF4B8AKAqwH8BuDlruu+8ucE/P1EjIh8CeCeQ8I+7hECV6cAEfkawF0LVro7CNwAICLfALhTMeZdQeACABH5FsAdivD3S9xA0DwAIvIdgNsLwncFQdMAiMgPAG5dIXw3EDQLQIzxxxDCLRXhu4CgSQBE5CcANyvC3wNwTFHX7DVBcwCIyM8AblKEujcajU7OZrPTniFoCgAR+QXADdrwd3d3L4zH46OeIWgGABH5FcD1JeHv13qGoAkAVln5B0HxCoF5AETkPIAbV1n5hMD4m0ExxvMhhF7C93o6MDsBSq/25xd8iilxqcTT6cAkACX3+fNbvZLwvU0CcwAUPOG7dJ+/SvieIDAFQMGz/erwvUBgBoCU0vc559sU5/HewvcAgQkACt7S7T381iEYPABDCL9lCAYNQMEneda28lt/WDRYAAo+w7ex8FucBIMEQPHp3f0sNh5+axAMDgARmX9B4+5tXO0r9vm/khaeGA4KgAVf2jiYzdZWfmvXBIMBwGL4LZwOBgFAjPGLEMJxxQgezMpvZRJsHQAR+RzAvZbDtzwJtgpASumznPN9LYRvFYKtASAinwK4v6XwLUKwFQBE5ByAB1oM3xoEGwcgxnguhNB0+JYg2CgAIvIJgAdbXvnW7g42BoCIfAzgIU/hW5gEGwEgxvhRCOFhj+EPHYK1AyAiHwJ4xHP4Q4ZgrQCklM7mnB9l+P86MLQ3kNYGQIzxbAiB4R9C/5AgWAsAIvIBgMe48q/swFAg6B2AlNL7OefHGf5yB4YAQa8AiMh7AJ5YLh2DfVdPcey9lmwbgt4AEJF3ATypcIfhHzBpmxD0AoCIvAPgKYavcOAKJduCoBoAEXkbwNMK6Vz5S0zaBgRVADB8BfaFJZuGYGUAYoxvhRCeUejjyleY9N+STUKwEgAi8iaAZxW6GL7CpMNKNgVBMQAppTdyzs8pdDF8hUmLSjYBQREAInIGwPMKXQxfYZKmZN0QqAFIKZ3OOZ9QHDTDV5hUUlICwWg0OlbyqygqAETkNQAvKQ6a4StMWqWkAIK9+S+nTSaTvzX7WQrAeDy+ajab/aXYGMNXmFRTooUg53zddDr9XbOvpQCIyPwPluZ/tLToxfA1bvdQo4Gg5DSgAeAaABcXHDvD7yHYkk0sgiCEcGYymZzUbm8pAPMNLfjiJsPXOt1z3WUIugPfr7jYdd2Rkl2pALgMwSkAL+5vPOf8+s7OzqslV5wlB8ZanQMxxhMhhKM55wvT6XR+m170UgMw32pK6UjO+VoAf3Rd92fRnlg8SAeKABikAh5UlQMEoMo++80EwH6GVQoIQJV99psJgP0MqxQQgCr77DcTAPsZVikgAFX22W8mAPYzrFJAAKrss99MAOxnWKWAAFTZZ7+ZANjPsEoBAaiyz34zAbCfYZUCAlBln/1mAmA/wyoFBKDKPvvNBMB+hlUKCECVffabCYD9DKsUEIAq++w3EwD7GVYpIABV9tlvJgD2M6xSQACq7LPfTADsZ1ilgABU2We/mQDYz7BKAQGoss9+MwGwn2GVAgJQZZ/9ZgJgP8MqBf8Aq+r9n3aJFIMAAAAASUVORK5CYII=)';



// 创建按钮元素
var toTopBtn = document.createElement('button');
// 设置按钮的文本内容和类名
toTopBtn.innerHTML = "";
toTopBtn.className = "goup"; // 使用第二段代码中的类名
toTopBtn.onclick = function (e) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  return false;
};
// 获取body元素
var body = document.querySelector('body');

// 创建style元素并添加CSS样式
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `

.goup {
  cursor: pointer;
  top: 75vh;
  position: fixed;
  right: 1vw;
  font-family: 'Open Sans', sans-serif;
  padding: 0;
  font-size: inherit;
  box-sizing: border-box; /* 确保padding和border不会增加宽度 */
  background-color: #fff; /* 设置按钮背景颜色 */
  width: 45px; /* 原来的宽度的50% */
  height: 45px; /* 原来的宽度的50% */
  line-height: 45px; /* 与按钮高度一致，保持垂直居中 */
  margin: 0;
  text-align: center;
  border:0.5px;
  border-radius: 50%; /* 圆形按钮 */
  background-image: url('data:image/png;base64,...'); /* 背景图Base64编码 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50% auto; /* 背景图缩小为原来的50%，且保持宽高比 */
  transition: background-size 0.35s; /* 背景图大小变化的过渡效果 */
}
.goup:hover {
  background-size: 70% auto; /* 鼠标悬停时放大背景图 */
}
`;

// 将背景图的Base64编码替换为具体的图片地址
  style.innerHTML = style.innerHTML.replace('url(\'data:image/png;base64,...\')', base64Url);
body.appendChild(style); // 添加style元素到body
body.appendChild(toTopBtn); // 添加按钮元素到body

// 检查页面滚动位置并显示/隐藏按钮的逻辑
let now = document.documentElement.scrollTop || document.body.scrollTop;
if (now > window.innerHeight) {
  toTopBtn.style.display = 'block';
}

// 监听滚动事件，根据滚动位置显示或隐藏按钮
window.onscroll = function () {
  let t = document.documentElement.scrollTop || document.body.scrollTop;
  if (t > window.innerHeight) {
    toTopBtn.style.display = 'block';
  } else {
    toTopBtn.style.display = 'none';
  }
};

    // Your code here...
})();