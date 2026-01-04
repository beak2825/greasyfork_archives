// ==UserScript==
// @name         帅连点二代
// @namespace    http://tampermonkey.net/
// @license      No License
// @version      0.2
// @description  独创
// @author       shuai
// @match        *://fxg.jinritemai.com/ffa/live_control/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467483/%E5%B8%85%E8%BF%9E%E7%82%B9%E4%BA%8C%E4%BB%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/467483/%E5%B8%85%E8%BF%9E%E7%82%B9%E4%BA%8C%E4%BB%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var time = '';
    var a = 1;
    var t = 0;
    var oldI = 1;
    var bodys = document.querySelector('body');
    
 
    //清除按钮
    var dyBtn2 = document.createElement("input");
    dyBtn2.id = "btn2";
    dyBtn2.style = "font-size:18px;position: fixed;top: 35vh;right: 50px;z-index:9999;";
    dyBtn2.type = 'button';
    dyBtn2.value = "停止"
    dyBtn2.className = 'dyBtn2';
 

    //停止
    dyBtn2.onclick = ()=>{
        console.log('停止了')
        clearInterval(time)
    }
 
    bodys.appendChild(dyBtn2);






setTimeout(()=>{
    main()

    //滚动之后自动添加
   document.querySelector('#live-control-goods-list-container>div').onscroll = debounce(()=>{
       main()

     },600)


},5000)

    //主方法

function main(){

//链接大div
    var domarr = document.querySelectorAll('.index__goodsItem___38cLa');

    domarr.forEach(function(item){
        var autoBtn = document.createElement("input");
        autoBtn.type = 'button';
        autoBtn.style = "font-size:14px;position: absolute;top: 60px;right: 152px;";
        autoBtn.value = "自动讲解"
        autoBtn.className = 'autoBtn';

      item.lastChild.lastChild.appendChild(autoBtn);

        setTimeout(()=>{
            autoBtn.onclick = function(){

                auoClick(this.previousSibling)

        }
        },600)
    }
    )


}

    //自动点击方法
    function auoClick(dom){
        clearInterval(time);
        var douc = () => {
            if (dom.className.split(" ").indexOf("active") == -1) {
                setTimeout(() => {
                    dom.click();
                });
            } else {
                dom.click();
                t = 0;
                setTimeout(function() {
                    dom.click();
                }, 1200);
            }
        };
        douc();
        time = setInterval(() => {
            console.log('开始了')
            t++;
            if (t >= 15) {
                    douc();
                }
        }, 1000);

    }




    function debounce(callback,delaytime){
			// 定义计时器
			let timer=null
			return function(){
				//如果定时器不是null 则需要重新计时
				if (timer!=null) {
					clearTimeout(timer)

				}
				//如果定时器还是空 ,则开始倒计时
				timer=setTimeout(()=>{
					callback&&callback()
				}, delaytime)

			}
		}


 
})();