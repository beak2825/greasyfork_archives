// ==UserScript==
// @name         6路记时器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  6路监播专用
// @author       元本
// @match        https://webcast.bytedance.net/security/queue/monitor_review
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448625/6%E8%B7%AF%E8%AE%B0%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448625/6%E8%B7%AF%E8%AE%B0%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==

//(function() {
   // 'use strict';

   // setInterval(function(semi-button-content){alert("Hello")},3000);
    // Your code here...
//})();


(function () {
   'use strict';
    var tmp = 0;
    var sec1 = 25;// 防止出现 BUG
    var sec = 180;// 用户倒计时秒数
    var sec2 = 25;// 防止出现 BUG
    var sec3 = 25;// 防止出现 BUG
    var sec4 = 25;// 防止出现 BUG
    var sec5 = 25;// 防止出现 BUG
    var sec6 = 25;// 防止出现 BUG
    var stime = 25;// 防止出现 BUG 直接跳出 while 循环（没有执行）
    var time;// 计时器
     var time2;// 计时器
    var time3;// 计时器
    var time4;// 计时器
    var time5;// 计时器
    var time6;// 计时器
    function Go (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec1 - 1);// 日志
        sec1 = sec1 - 1;
    };
        function Go2 (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec2 - 1);// 日志
        sec2 = sec2 - 1;
    }
        function Go3 (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec3 - 1);// 日志
        sec3 = sec3 - 1;
    }
        function Go4 (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec4 - 1);// 日志
        sec4 = sec4 - 1;
    }
        function Go5 (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec5 - 1);// 日志
        sec5 = sec5 - 1;
    }
        function Go6 (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec6 - 1);// 日志
        sec6 = sec6 - 1;
    }

    // 生成按钮

    let Container = document.createElement('div');
    Container.id = "djs";
    Container.style.position="fixed"
    Container.style.left="200px"
    Container.style.top="20px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<input type="button" id="djs" value="倒计时1" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec1 = sec;
            time = setInterval (function (){Go ();if (sec1 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 1 时间到！！！');
                clearInterval (time);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec1 <= 0){
                console.log (' 倒计时结束 ');
                alert ('  时间到！！！');
                clearInterval (time);
                return;
            }
        return;
	};
    document.body.appendChild(Container);

     let Container2 = document.createElement('div');
    Container2.id = "djs";
    Container2.style.position="fixed"
    Container2.style.left="475px"
    Container2.style.top="20px"
    Container2.style['z-index']="999999"
    Container2.innerHTML =`<input type="button" id="djs" value="倒计时2" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container2.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec2 = sec;
            time2 = setInterval (function (){Go2 ();if (sec2 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 2 时间到！！！');
                clearInterval (time2);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec2 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time2);
                return;
            }
        return;
	};
    document.body.appendChild(Container2);

       let Container3 = document.createElement('div');
    Container3.id = "djs";
    Container3.style.position="fixed"
    Container3.style.left="750px"
    Container3.style.top="20px"
    Container3.style['z-index']="999999"
    Container3.innerHTML =`<input type="button" id="djs" value="倒计时3" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container3.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec3 = sec;
            time3 = setInterval (function (){Go3 ();if (sec3 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 3 时间到！！！');
                clearInterval (time3);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec3 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time3);
                return;
            }
        return;
	};
    document.body.appendChild(Container3);

       let Container4 = document.createElement('div');
    Container4.id = "djs";
    Container4.style.position="fixed"
    Container4.style.left="1025px"
    Container4.style.top="20px"
    Container4.style['z-index']="999999"
    Container4.innerHTML =`<input type="button" id="djs" value="倒计时4" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container4.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec4 = sec;
            time4 = setInterval (function (){Go4 ();if (sec4 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 4 时间到！！！');
                clearInterval (time4);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec4 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time4);
                return;
            }
        return;
	};
    document.body.appendChild(Container4);

       let Container5 = document.createElement('div');
    Container5.id = "djs";
    Container5.style.position="fixed"
    Container5.style.left="1300px"
    Container5.style.top="20px"
    Container5.style['z-index']="999999"
    Container5.innerHTML =`<input type="button" id="djs" value="倒计时5" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container5.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec5 = sec;
            time5 = setInterval (function (){Go5 ();if (sec5 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 5 时间到！！！');
                clearInterval (time5);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec5 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time5);
                return;
            }
        return;
	};
    document.body.appendChild(Container5);

       let Container6 = document.createElement('div');
    Container6.id = "djs";
    Container6.style.position="fixed"
    Container6.style.left="1575px"
    Container6.style.top="20px"
    Container6.style['z-index']="999999"
    Container6.innerHTML =`<input type="button" id="djs" value="倒计时6" class="btn self-btn bg" style="position:absolute; left:30px; top:20px">`
//<button id="djs" style="position:absolute; left:30px; top:20px"> 浮动按钮</button>
   Container6.onclick = function (){
		  console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec6 = sec;
            time6 = setInterval (function (){Go6 ();if (sec6 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 6 时间到！！！');
                clearInterval (time6);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec6 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time6);
                return;
            }
        return;
	};
    document.body.appendChild(Container6);
})();
