// ==UserScript==
// @name         为网站添加一键返回顶部
// @namespace    https://github.com/CHminggao
// @version      0.4
// @description  为需要的网站添加一键返回顶部
// @author       GM
// @require     https://greasyfork.org/scripts/2599/code/gm2_port_v103.js
// @match        *://*/*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434229/%E4%B8%BA%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/434229/%E4%B8%BA%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    let styles=`.gm-popupStyle{
            background-color: rgb(85,85,85);
            /* display:none; */
            color:#fff;
            text-align:center;
            line-height:24px;
            border-radius:20px;
            padding:8px 0;
            position:fixed;
            z-index:999;
            top:2%;
            left:50%;
            transform:translateX(-50%);
        }`
    GM_addStyle(styles);
    try {
          GM_registerMenuCommand('添加返回顶部', function () {
            addWebsite();
          });

          GM_registerMenuCommand('删除返回顶部', function () {
            removeWebSite();
          });} catch (e) {
            console.log();
        }
    let hasweb = GM_getValue(window.location.host)?GM_getValue(window.location.host):false;
    if(!hasweb){
     return;
    }
    let css=`
           .goup {
            cursor: pointer;
           	top: 75vh;
           	position: fixed;
           	right: 1vw;
           	font-family: 'Open Sans', sans-serif;
           	padding: 0;
           	font-size: inherit;
           	color: inherit;
           	box-sizing: inherit;
           	backface-visibility: hidden;
           	-webkit-font-smoothing: antialiased;
           	text-decoration: none;
           	transition: all 0.35s;
           	transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
           	display: inline-block;
           	background-color: #fff;
           	width: 90px;
           	height: 90px;
           	line-height: 90px;
           	margin: 0 10px;
           	text-align: center;
           	overflow: hidden;
           	border-radius: 28%;
           	box-shadow: 0 5px 15px -5px rgba(0,0,0,0.45);
           	opacity: 0.99;
           	background-position: center;
           	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABYNJREFUeF7tncmuW0UQhv+W7yMgJJQ1m2TBgnkmzPOc7HgE1NWyxA6xYMXiysd5CpQwQxjCPENgA9KNxAuEBQ/AymrkKFfA1Y1d7T62T3X9Xledc/7//7rO4CmAL9cOBNfqKR4EwDkEBIAAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AA+HNARF4B8AKAqwH8BuDlruu+8ucE/P1EjIh8CeCeQ8I+7hECV6cAEfkawF0LVro7CNwAICLfALhTMeZdQeACABH5FsAdivD3S9xA0DwAIvIdgNsLwncFQdMAiMgPAG5dIXw3EDQLQIzxxxDCLRXhu4CgSQBE5CcANyvC3wNwTFHX7DVBcwCIyM8AblKEujcajU7OZrPTniFoCgAR+QXADdrwd3d3L4zH46OeIWgGABH5FcD1JeHv13qGoAkAVln5B0HxCoF5AETkPIAbV1n5hMD4m0ExxvMhhF7C93o6MDsBSq/25xd8iilxqcTT6cAkACX3+fNbvZLwvU0CcwAUPOG7dJ+/SvieIDAFQMGz/erwvUBgBoCU0vc559sU5/HewvcAgQkACt7S7T381iEYPABDCL9lCAYNQMEneda28lt/WDRYAAo+w7ex8FucBIMEQPHp3f0sNh5+axAMDgARmX9B4+5tXO0r9vm/khaeGA4KgAVf2jiYzdZWfmvXBIMBwGL4LZwOBgFAjPGLEMJxxQgezMpvZRJsHQAR+RzAvZbDtzwJtgpASumznPN9LYRvFYKtASAinwK4v6XwLUKwFQBE5ByAB1oM3xoEGwcgxnguhNB0+JYg2CgAIvIJgAdbXvnW7g42BoCIfAzgIU/hW5gEGwEgxvhRCOFhj+EPHYK1AyAiHwJ4xHP4Q4ZgrQCklM7mnB9l+P86MLQ3kNYGQIzxbAiB4R9C/5AgWAsAIvIBgMe48q/swFAg6B2AlNL7OefHGf5yB4YAQa8AiMh7AJ5YLh2DfVdPcey9lmwbgt4AEJF3ATypcIfhHzBpmxD0AoCIvAPgKYavcOAKJduCoBoAEXkbwNMK6Vz5S0zaBgRVADB8BfaFJZuGYGUAYoxvhRCeUejjyleY9N+STUKwEgAi8iaAZxW6GL7CpMNKNgVBMQAppTdyzs8pdDF8hUmLSjYBQREAInIGwPMKXQxfYZKmZN0QqAFIKZ3OOZ9QHDTDV5hUUlICwWg0OlbyqygqAETkNQAvKQ6a4StMWqWkAIK9+S+nTSaTvzX7WQrAeDy+ajab/aXYGMNXmFRTooUg53zddDr9XbOvpQCIyPwPluZ/tLToxfA1bvdQo4Gg5DSgAeAaABcXHDvD7yHYkk0sgiCEcGYymZzUbm8pAPMNLfjiJsPXOt1z3WUIugPfr7jYdd2Rkl2pALgMwSkAL+5vPOf8+s7OzqslV5wlB8ZanQMxxhMhhKM55wvT6XR+m170UgMw32pK6UjO+VoAf3Rd92fRnlg8SAeKABikAh5UlQMEoMo++80EwH6GVQoIQJV99psJgP0MqxQQgCr77DcTAPsZVikgAFX22W8mAPYzrFJAAKrss99MAOxnWKWAAFTZZ7+ZANjPsEoBAaiyz34zAbCfYZUCAlBln/1mAmA/wyoFBKDKPvvNBMB+hlUKCECVffabCYD9DKsUEIAq++w3EwD7GVYpIABV9tlvJgD2M6xSQACq7LPfTADsZ1ilgABU2We/mQDYz7BKAQGoss9+MwGwn2GVAgJQZZ/9ZgJgP8MqBf8Aq+r9n3aJFIMAAAAASUVORK5CYII=');
           	background-repeat: no-repeat;
           	background-size: 50%;
           }
           .goup:hover{
           background-size: 80%;
           }
    `;
    document.getElementsByTagName('style')[0].textContent+=document.getElementsByTagName('style')[0].textContent+css; // 第一个style内容
    let body = document.querySelector('body');
    let a=document.createElement('i');
    a.className='goup';
    a.style.display='none'
    body.appendChild(a);
    let now =document.documentElement.scrollTop||document.body.scrollTop;
    if(now>window.innerHeight){
       a.style.display='block';
    }
    //a.onclick=function(){
    //    window.scrollTo({
    //       top: 0,
    //       behavior: 'smooth',
    //    });
    //  return false;
    //}
    //添加事件：鼠标按下
    a.addEventListener("mousedown", function (e) {
        //设置事件对象
        let event1 = e || window.event;
        //鼠标移动事件调用函数
        let yidong = function (e) {
            //设置时间对象
            let event = e || window.event;
            //当鼠标移动时  设置div的定位位置（这里是重点）
            //问1: 为什么yidong函数要写在事件内
            //问2：为什么要用event1.offsetX 而不是 event.offsetX
            a.style.left = event.clientX-event1.offsetX + `px`;
            a.style.top = event.clientY-event1.offsetY + `px`;
        }
        let that = this;
        let sto = setTimeout(function(){
            //鼠标按下时div自身添加边框
            that.style.border = `2px solid red`;
            //当按下时  对document设置鼠标移动事件
            document.addEventListener("mousemove", yidong);
        },3000)
        //鼠标抬起事件
        a.addEventListener("mouseup", function (e) {
            clearTimeout(sto);
            //删除鼠标移动事件
            document.removeEventListener("mousemove", yidong);
            //取消边框
            this.style.border = `none`;
            debugger;
            if(e.clientX==event1.clientX&&e.clientY==event1.clientY){
               window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
               });
            }
        })
    })
    window.onscroll=function(){
      let t =document.documentElement.scrollTop||document.body.scrollTop; //变量t就是滚动条滚动时，到顶部的距离
      if(t>window.innerHeight){
          //滚动到完一页后显示回到顶部
          a.style.display='block';
      }else{
          a.style.display='none';
      }
    }
})();

function addWebsite(){
    GM_setValue(window.location.host,true);
    let msg=document.createElement('span');
    msg.className='gm-popupStyle';
    msg.innerText='已添加回到顶部，刷新后生效';
    msg.style.width='260px';
    document.querySelector('body').appendChild(msg);
    setTimeout(function(){
        document.querySelector('body').removeChild(msg);
    },1500);
    return;

}
function removeWebSite(){
   GM_setValue(window.location.host,false);
    let msg=document.createElement('span');
    msg.className='gm-popupStyle';
    msg.style.width='260px';
    msg.innerText='已移除回到顶部，刷新后生效';
    document.querySelector('body').appendChild(msg);
    setTimeout(function(){
        document.querySelector('body').removeChild(msg);
    },1500);
    return;
}
