// ==UserScript==
// @name         时钟脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浏览器一键计时和查看时间，还可以查看星期
// @author       Skity666


// @include         http://*
// @include         https://*
// @match        http://*
// @match        https://*
// @grant        none
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404415/%E6%97%B6%E9%92%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/404415/%E6%97%B6%E9%92%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//更新了界面会出现多个时钟的问题,新增了可拖拽功能，优化了按钮
//解放美元标志
jQuery.noConflict();
(function($) {
    '时钟脚本';
    //dom加载完毕执行
    if(self==top){
        $(document).ready(function() {
            //添加样式
            addGlobalStyle(`
           .timebox {
				position: fixed;
				top: 100px;
				right: 100px;
				width: 200px;
				height: 150px;
				margin: 0;
				text-align: center;
				background-color: rgba(246, 246, 246, .5);
				border-radius: 10px;
                z-index:9999999;
			}

			.countTime {
				font-size: 20px;
			}

			#day,
			#time,
			#we {
				width: 100%;
				height: 30px;
				font-size: 25px;
				color: darkorchid;
				line-height: 30px;
			}
			#clear,#end,#start{
				width:50px;
				border-radius: 10px;
				border: 0;
				height:22px;
				background-color: aquamarine;
				outline:none;
			}
    `);
            //添加盒子
            var box = $("<div class='timebox'><div class='day' id='day'></div><div class='time' id='time'></div><div class='we' id='we'></div><div class='countTimebox'><div class='countTime' id='countTime'></div><button id='start'>开始</button>	<button id='end'>结束</button>	<button id='clear'>清空</button></div></div>");
            $("body").append(box);
            var date = new Date();

            var year = date.getFullYear();
            var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            var day2 = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var day1 = year + '-' + month + '-' +day2 ;

            var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            var minu = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            var time1 = hour + ':' + minu + ':' + sec;
            $("#day").text(day1);
            $("#time").text(time1);
            var w=date.getDay()
            var ww=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六")
            // alert(ww[w])
            $("#we").text(ww[w]);
            var flag=0;//闰年标志
            var d=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
            window.setInterval(add, 1000);

            function add() {
                sec++;
                if (sec >= 60) {
                    sec = 0;
                    minu++;
                }
                if (minu >= 60) {
                    minu = 0;
                    hour++;
                }
                if (hour >= 24) {
                    hour = 0;
                    day2++;
                    w++;
                    if(w>6){w=0;}
                }

                //闰年
                if(year%400==0||(year%4==0&&year%100!=0))
                    flag=1;
                //月份增加
                if(month==2){
                    if(flag==1){
                        if(day2>d[month]+1){
                            month++;
                            day2=1;
                        }
                    }else{
                        if(day2>d[month]){
                            month++;
                            day2=1;
                        }
                    }
                }else{
                    if(day2>d[month]){
                        month++;
                        day2=1;
                    }
                }
                if(month>12){
                    month=1;
                    year++;
                }
                // alert(minu);
                sec = parseInt(sec);
                minu = parseInt(minu);
                hour = parseInt(hour);
                day2 = parseInt(day2);
                month = parseInt(month);
                year = parseInt(year);
                sec = sec < 10 ? '0' + sec : sec;
                minu = minu < 10 ? '0' + minu : minu;
                hour = hour < 10 ? '0' + hour : hour;
                time1 = hour + ':' + minu + ':' + sec;
                day2 = day2 < 10 ? '0' + day2 : day2;
                month = month < 10 ? '0' + month : month;
                year = year < 10 ? '0' + year : year;
                day1 = year + '-' + month + '-' + day2;
                $("#day").text(day1);
                $("#time").text(time1);
                $("#we").text(ww[w]);
            }



            //计时器
            var countTime="00:00:00";
            var 时=0;
            var 分=0;
            var 秒=0;
            var setCount=null;
            $("#end").attr("disabled","false")
            $("#countTime").text(countTime);
            $("#start").click(function(){
                // alert("hello")
                setCount=setInterval(count,1000)
                $(this).attr("disabled","false")
                $("#end").removeAttr("disabled")
            });
            $("#end").click(function(){
                clearInterval(setCount)
                $(this).attr("disabled","false")
                $("#start").removeAttr("disabled")
            });
            $("#clear").click(function(){
                $("#countTime").text("00:00:00");
                时=0;分=0;秒=0;
            });
            function count(){
                秒++;
                if (秒 >= 60) {
                    秒 = 0;
                    分++;
                }
                if (分 >= 60) {
                    分 = 0;
                    时++;
                }
                秒 = parseInt(秒);
                分 = parseInt(分);
                时 = parseInt(时);
                秒 = 秒 < 10 ? '0' + 秒 : 秒;
                分 = 分 < 10 ? '0' + 分 : 分;
                时 = 时 < 10 ? '0' + 时 : 时;
                countTime = 时 + ':' + 分 + ':' + 秒;
                $("#countTime").text(countTime);
            }
            //拖拽时钟
            $(".timebox").mousedown(function() {
                //获取浏览器宽度
                var w = window.innerWidth
                var x = event.pageX
                var y = event.pageY

                //获取坐标，右边界和上边界
                var offX = parseInt(window.getComputedStyle(this)["right"]);
                var offY = parseInt(window.getComputedStyle(this)["top"]);
                //计算出鼠标坐标相对于右上方坐标的间距
                var offLX = w - x - offX;
                var offLY = y - offY;
                document.onmousemove = function() {
                    $(".timebox").css("right", w - event.pageX - offLX + "px")

                    $(".timebox").css("top", event.pageY - offLY + "px")

                }
                $(".timebox").mouseup(function() {
                    document.onmousemove=null;

                })


            })


        });
    }
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Your code here...
})(jQuery);