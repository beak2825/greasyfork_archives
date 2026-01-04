// ==UserScript==
// @name         Github一键返回顶部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Github返回顶部
// @author       GM
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433920/Github%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/433920/Github%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
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
    a.onclick=function(){
        window.scrollTo({
           top: 0,
           behavior: 'smooth',
        });
      return false;
    }
    window.onscroll=function(){
      let t =document.documentElement.scrollTop||document.body.scrollTop; //变量t就是滚动条滚动时，到顶部的距离
      if(t>window.innerHeight){
          //滚动到完一页后显示回到顶部
          a.style.display='block';
      }else{
          a.style.display='none';
      }
    }
    // Your code here...
})();