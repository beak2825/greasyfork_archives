// ==UserScript==
// @name         微步下班倒计时
// @namespace    http://tampermonkey.net/
// @version      2023年8月17日09点25分
// @description  下班
// @author       wwsuixin
// @match        https://x.threatbook.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threatbook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472980/%E5%BE%AE%E6%AD%A5%E4%B8%8B%E7%8F%AD%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/472980/%E5%BE%AE%E6%AD%A5%E4%B8%8B%E7%8F%AD%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function () {

    window.onload = setTimeout(click_item, 500);
    function click_item() {
        // var xpath = '//*[@id="app"]/div[1]/div[1]/div[2]/div[6]/div[2]/div[1]';
        var xpath = '//*[@id="app"]/div[1]/div[1]/div[2]/div[6]/div[2]/div[1]/ul[7]'
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var 自定义div = document.createElement('div');

        ///////////////自定义参数区域-开始//////////////////////////////////////////////////////////////////////////////////

        let 下班时间 = new Date();
        // 夜班同事设置下班时间为第二天9点，并取消注释
        // 下班时间.setDate(下班时间.getDate() + 1);
        // 下班时间.setHours(9, 0, 0, 0);

        //白班同事设置下班时间，作者晚上10点下班，夜班同事注释此句
        下班时间.setHours(22, 0, 0, 0);

        //设置上班时间，当前设置为当天8点30分
        let 上班时间 = new Date();
        上班时间.setHours(8, 30, 0, 0);


        //日薪设置请修改此参数
        let 当日工资 = 10000

        ///////////////自定义参数区域-结束//////////////////////////////////////////////////////////////////////////////////



        let 摸鱼开始时间 = new Date();

        let 结束时间 = new Date();
        结束时间.setFullYear(2023, 7, 23);
        结束时间.setHours(21, 0, 0, 0);




        if (element) {
            自定义div.innerHTML = '<div id="自定义divid"    style="transition: all .4s linear; border-radius:25px; padding: 5px;  transform: translateX(0);    background: linear-gradient(136deg, #ff4d3d, #ff5e3d .01%, #db1212);background-repeat: no-repeat; background-attachment: fixed;    color: #fff;    font-size: 14px;    font-weight: 700;    word-wrap: break-word;    line-height: 24px;  text-align: center;">    <div style=" display: flex; justify-content: center;"> <span style="font-size: 20px;">🎇 结束倒计时</span> </div>    <div style=" display: flex; justify-content: center;">        <div style=" display: flex; font-size: 10px; flex-direction: column; width: 25%; justify-content: center;">            <h1 id="活动结束天数id" style=" margin-bottom: 0;margin: 0 auto;">0</h1> <small                style=" margin: 0 auto;">Days</small>        </div>        <div            style=" display: flex; font-size: 10px; flex-direction: column; margin: 0 10px;width: 25%; justify-content: center;">            <h1 id="活动结束小时id" style=" margin-bottom: 0;margin: 0 auto;">00</h1> <small                style=" margin: 0 auto;">Hours</small>        </div>        <div x            style=" display: flex; font-size: 10px; flex-direction: column; margin: 0 10px;width: 25%; justify-content: center;">            <h1 id="活动结束分钟id" style=" margin-bottom: 0;margin: 0 auto;">00</h1> <small                style=" margin: 0 auto;">Mins</small>        </div>        <div            style="display: flex; font-size: 10px; flex-direction: column; margin: 0 10px;width: 25%; justify-content: center;">            <h1 id="活动结束秒id" style=" margin-bottom: 0;margin: 0 auto;">00</h1> <small                style=" margin: 0 auto;">Sec</small>        </div>    </div>    <div style=" display: flex; justify-content: center;"> <span style="font-size: 20px;">😂 今日数据</span> </div>    <div id="已经工作divid">🕢已搬砖：__<span id="已经工作小时id">00</span>__时__<span id="已经工作分钟id">00</span>__分__<span            id="已经工作秒id">00</span>__秒</div>    <div id="距离下班divid">🕙离躺平：__<span id="距离下班小时id">00</span>__时__<span id="距离下班分钟id">00</span>__分__<span            id="距离下班秒id">00</span>__秒</div>    <div id="进度条" style="display: flex;">        <div id="进度条divid"            style="margin-top: 2px;display:inline;float:left;width: 100%;height: 10px;border: 1px solid #565656; background: white; position: relative;">            <div id="实时进度条divid"                style="position: absolute;    line-height: initial; z-index: 2; height: 10px; width: 100%;  clip: rect(0px, 0, 10px, 0px);background: linear-gradient(90deg, rgb(187 255 168), rgb(81, 214, 14), rgb(15, 108, 18));text-align: center;font-size: 5px;    color: black;">            </div>            <div id="进度条数值divid"                style="position: absolute;line-height: initial;z-index: 2;height: 10px;width: 100%;text-align: center;font-size: 5px;color: black;margin-top: -2px;">                0% </div>        </div>    </div>    <div id="今日收入divid">💰今收入（越南盾）：<span id="今日已收入id">0</span>/<span id="今日总收入id">0</span></div>    <div id="摸鱼计时divid">🐟已摸鱼：__<span id="摸鱼计时小时id">00</span>__时__<span id="摸鱼计时分钟id">00</span>__分__<span            id="摸鱼计时秒id">00</span>__秒<br><span id="摸鱼提醒id"></span></div></div>';
            element.insertAdjacentElement('afterend', 自定义div);


            let 进度条数值divid = document.getElementById("进度条数值divid");
            let 进度条divid = document.getElementById("进度条divid");
            let 实时进度条divid = document.getElementById("实时进度条divid");
            let 已经工作divid = document.getElementById("已经工作divid");
            let 距离下班divid = document.getElementById("距离下班divid");
            let 已经工作小时id = document.getElementById("已经工作小时id");
            let 已经工作分钟id = document.getElementById("已经工作分钟id");
            let 已经工作秒id = document.getElementById("已经工作秒id");
            let 距离下班小时id = document.getElementById("距离下班小时id");
            let 距离下班分钟id = document.getElementById("距离下班分钟id");
            let 距离下班秒id = document.getElementById("距离下班秒id");
            let 今日收入divid = document.getElementById("今日收入divid");
            let 今日已收入id = document.getElementById("今日已收入id");
            let 今日总收入id = document.getElementById("今日总收入id");
            let 活动结束divid = document.getElementById("活动结束divid");
            let 活动结束天数id = document.getElementById("活动结束天数id");
            let 活动结束小时id = document.getElementById("活动结束小时id");
            let 活动结束分钟id = document.getElementById("活动结束分钟id");
            let 活动结束秒id = document.getElementById("活动结束秒id");
            let 摸鱼计时divid = document.getElementById("摸鱼计时divid");
            // let 摸鱼计时天数id = document.getElementById("摸鱼计时天数id");
            let 摸鱼计时小时id = document.getElementById("摸鱼计时小时id");
            let 摸鱼计时分钟id = document.getElementById("摸鱼计时分钟id");
            let 摸鱼计时秒id = document.getElementById("摸鱼计时秒id");
            let 摸鱼提醒id = document.getElementById("摸鱼提醒id");
            今日总收入id.textContent = 当日工资;

            setInterval(function () {

                let 当前时间 = new Date();

                let 摸鱼时间间隔 = 当前时间 - 摸鱼开始时间;
                // let 摸鱼计时天数 = Math.floor(摸鱼时间间隔 / (1000 * 60 * 60 * 24));
                let 摸鱼计时小时 = Math.floor((摸鱼时间间隔 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let 摸鱼计时分钟 = Math.floor((摸鱼时间间隔 % (1000 * 60 * 60)) / (1000 * 60));
                let 摸鱼计时秒 = Math.floor((摸鱼时间间隔 % (1000 * 60)) / 1000);
                // 摸鱼计时天数id.textContent = 摸鱼计时天数;
                摸鱼计时小时id.textContent = 摸鱼计时小时.toString().padStart(2, '0');
                摸鱼计时分钟id.textContent = 摸鱼计时分钟.toString().padStart(2, '0');
                摸鱼计时秒id.textContent = 摸鱼计时秒.toString().padStart(2, '0');

                if (摸鱼计时分钟 > 5) {
                    摸鱼提醒id.textContent = "摸鱼超过5分钟了，该去看看态势感知平台啦！";
                } else {
                    摸鱼提醒id.textContent = "";
                }

                let 距离上班时间间隔 = 当前时间 - 上班时间;
                let days = Math.floor(距离上班时间间隔 / (1000 * 60 * 60 * 24));
                let hours = Math.floor((距离上班时间间隔 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((距离上班时间间隔 % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((距离上班时间间隔 % (1000 * 60)) / 1000);
                已经工作小时id.textContent = hours.toString().padStart(2, '0');
                已经工作分钟id.textContent = minutes.toString().padStart(2, '0');
                已经工作秒id.textContent = seconds.toString().padStart(2, '0');

                let 距离下班时间间隔 = 下班时间 - 当前时间;
                if (距离下班时间间隔 < 0) {
                    距离下班divid.textContent = "🕙 警告：工作时间已经结束！";
                } else {
                    let days = Math.floor(距离下班时间间隔 / (1000 * 60 * 60 * 24));
                    let hours = Math.floor((距离下班时间间隔 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = Math.floor((距离下班时间间隔 % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = Math.floor((距离下班时间间隔 % (1000 * 60)) / 1000);
                    let 距离下班小时 = days * 24 + hours
                    距离下班小时id.textContent = 距离下班小时.toString().padStart(2, '0');;
                    距离下班分钟id.textContent = minutes.toString().padStart(2, '0');;
                    距离下班秒id.textContent = seconds.toString().padStart(2, '0');;
                }

                let 已收入 = 0
                if (距离下班时间间隔 < 0) {
                    已收入 = 当日工资
                    今日收入divid.textContent = "💰 今日收入：" + 当日工资 + "/" + 当日工资 + "(加班也没钱)";
                } else {
                    const 需工作时间 = 下班时间 - 上班时间;
                    const 需工作秒数 = 需工作时间 / 1000;
                    const 每秒收入 = 当日工资 / 需工作秒数;
                    const 上班总秒数 = 距离上班时间间隔 / 1000
                    已收入 = (上班总秒数 * 每秒收入).toFixed(4)
                    今日已收入id.textContent = 已收入;
                }
                const 当前进度 = ((已收入 / 当日工资) * 100).toFixed(2)
                进度条更新(进度条divid, 实时进度条divid, 进度条数值divid, 当前进度)



                let 距离结束时间间隔 = 结束时间 - 当前时间;
                if (距离结束时间间隔 < 0) {
                    活动结束divid.textContent = "🎆 恭喜你，坚持到了最后！";
                } else {
                    let days = Math.floor(距离结束时间间隔 / (1000 * 60 * 60 * 24));
                    let hours = Math.floor((距离结束时间间隔 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = Math.floor((距离结束时间间隔 % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = Math.floor((距离结束时间间隔 % (1000 * 60)) / 1000);
                    活动结束天数id.textContent = days.toString().padStart(2, '0');
                    活动结束小时id.textContent = hours.toString().padStart(2, '0');
                    活动结束分钟id.textContent = minutes.toString().padStart(2, '0');
                    活动结束秒id.textContent = seconds.toString().padStart(2, '0');
                }


            }, 1000);
        } else {
            setTimeout(click_item, 300) //300 毫秒
        }
    }

    function 进度条更新(进度条divid, 实时进度条divid, 进度条数值divid, 当前进度) {
        // 获取总进度条的宽度
        var allWidth = parseInt(getStyle(进度条divid, 'width'));
        // 设定内层两个div的文字内容一样
        进度条数值divid.innerHTML = 当前进度 + '%';
        // 修改clip的的宽度值
        实时进度条divid.style.clip = 'rect(0px, ' + 当前进度 / 100 * allWidth + 'px, 10px, 0px)';

        // 获取当前元素的属性值
        function getStyle(obj, attr) {
            // 兼容IE
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                // 第二个参数为false是通用的写法，目的是为了兼容老版本
                return getComputedStyle(obj, false)[attr];
            }
        }
    }
})();