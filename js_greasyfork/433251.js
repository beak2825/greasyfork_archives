// ==UserScript==
// @name         【挂机助手】石家庄铁道大学继续教育学习平台
// @namespace    http://neko.net/
// @version      3.11
// @description  石铁大继续教育平台自动观看视频、PPT
// @author       kakasearch
// @match        http://jxjy.stdu.edu.cn/student/BootStrap_*
// @match        http://220.194.70.38/student/BootStrap_*
// @match        https://jxjy.stdu.edu.cn/student/BootStrap_*
// @match        https://220.194.70.38/student/BootStrap_*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB3aWR0aD0iODAwcHQiIGhlaWdodD0iODAwcHQiIHZpZXdCb3g9IjAgMCA4MDAgODAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8ZyBpZD0iI2ZmN2YwMmZmIj4NCjxwYXRoIGZpbGw9IiNmZjdmMDIiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUzNi42OCAxNTYuMDYgQyA1MzYuODQgMTQ2Ljk3IDU0Mi4yNyAxMzguMTIgNTUwLjkyIDEzNC44NiBDIDU1Mi44NSAxNDMuODYgNTU0LjcyIDE1Mi44NyA1NTYuNjAgMTYxLjg3IEMgNTU3LjA2IDE2NS4yOSA1NTkuNTcgMTY3LjgxIDU2MS4zNiAxNzAuNTkgQyA1NzMuNjcgMTY5LjYzIDU4Ni41NCAxNzEuMzUgNTk3LjM0IDE3Ny42NSBDIDYwOC41MyAxODQuMDUgNjE2Ljk0IDE5NC44MSA2MjEuMjIgMjA2LjkwIEMgNjI2LjEyIDIxNy4wOCA2MzcuMjAgMjIzLjUyIDYzOS41NiAyMzUuMDUgQyA2MzcuNjIgMjQ3LjIzIDYzNS40OCAyNTkuOTggNjI4LjUyIDI3MC40NSBDIDYyMi40NCAyNzkuNjMgNjEyLjA3IDI4NC45NyA2MDEuNTMgMjg3LjIxIEMgNTkwLjgxIDI4OS4zOCA1NzkuMzIgMjg5LjkwIDU2OS43MiAyOTUuNjkgQyA1NjUuODYgMjk3Ljk3IDU2Mi4wOCAzMDIuMjYgNTYzLjQ2IDMwNy4wOCBDIDU3MS44NiAzNDMuNDcgNTc0LjU5IDM4MS42NiA1NjcuMjkgNDE4LjQ3IEMgNTYyLjI2IDQ0My4zNSA1NTIuODUgNDY3Ljc4IDUzNy4yMCA0ODcuOTYgQyA1MzMuMzcgNDkzLjE2IDUyOC4wNSA0OTcuMTYgNTI0LjgyIDUwMi44MiBDIDUxOS42MyA1MTEuNTEgNTE4LjE0IDUyMi4wMyA1MTkuNTIgNTMxLjk2IEMgNTIwLjAwIDU0OC4zMCA1MjUuNzcgNTYzLjgyIDUzMC45OSA1NzkuMTIgQyA1MzkuOTUgNjA0LjA5IDU1MC41NSA2MjguNDMgNTYxLjU2IDY1Mi41NiBDIDU2NS45MyA2NTMuNzUgNTcwLjg1IDY1My42MCA1NzQuNjcgNjU2LjMyIEMgNTc5LjA3IDY1OS4xOSA1ODMuNjcgNjYyLjc0IDU4NS4yMyA2NjguMDAgQyA1ODYuNzAgNjcyLjk3IDU4My43OSA2NzcuOTQgNTgwLjIxIDY4MS4yMCBDIDU3Ny40OSA2ODQuMDAgNTczLjU2IDY4NC44MyA1NzAuMDAgNjg2LjAyIEMgNTYwLjY5IDY4OC44MCA1NTAuMjQgNjg5Ljk1IDU0MS4xMSA2ODUuOTIgQyA1MzMuOTIgNjgyLjgzIDUyOC41OSA2NzYuNDAgNTI1Ljk1IDY2OS4xMyBDIDUxNC4zMiA2NjcuOTIgNTAzLjcwIDY2MS4zMyA0OTYuODUgNjUxLjk1IEMgNDg1Ljc5IDYzNy4xMiA0ODEuMjUgNjE4LjcyIDQ3Ny41NyA2MDAuOTAgQyA0NzUuMjkgNTkwLjU0IDQ3NC42NSA1NzkuMzggNDY4LjgxIDU3MC4xOSBDIDQ2Ni4xMCA1NjUuNzcgNDYxLjc0IDU2Mi4yNiA0NTYuNTEgNTYxLjQ2IEMgNDU1Ljk0IDU3Ny42MSA0NDkuNzAgNTkyLjk1IDQ0Mi4wMiA2MDYuOTUgQyA0MzcuMjYgNjE1Ljg2IDQzMC4zOCA2MjMuODcgNDI4LjA4IDYzMy45MyBDIDQyNi45NSA2MzguMzQgNDI3LjU2IDY0My43NSA0MzEuNDMgNjQ2LjY2IEMgNDM1Ljg3IDY1MC4xNiA0NDEuODAgNjQ5LjcxIDQ0Ny4xMSA2NTAuMjcgQyA0NTYuNDYgNjUxLjE0IDQ2NS44NyA2NTEuNjUgNDc1LjIwIDY1Mi43NiBDIDQ4Mi44NSA2NTQuOTMgNDkxLjI1IDY1OC4yNiA0OTUuMzggNjY1LjUzIEMgNDk4Ljg0IDY3MS45MyA0OTUuOTUgNjc5LjUzIDQ5MS44MSA2ODQuODUgQyA0NjUuMTggNjg1LjAyIDQzOC41NSA2ODUuODkgNDExLjk2IDY4Ny40MCBDIDM5NS45NiA2ODguMjggMzc5LjkzIDY4OS43NSAzNjMuOTAgNjg4Ljc2IEMgMzU0LjM5IDY4OC4xMyAzNDQuNjMgNjg2LjU4IDMzNi4yNSA2ODEuODEgQyAzMzAuNTggNjc4LjY2IDMyNS45MCA2NzQuMTIgMzIxLjMzIDY2OS41OSBDIDMxNC42OCA2NjMuMDUgMzA1LjA0IDY2MC43MyAyOTUuOTYgNjYwLjU3IEMgMjgyLjE0IDY2MC4zNyAyNjguNDcgNjYzLjk3IDI1NS45MSA2NjkuNTcgQyAyNDQuMzggNjc1LjIwIDIzMi4yMCA2NzkuMzUgMjE5Ljk4IDY4My4xOSBDIDE5NS4yNiA2OTAuNzMgMTY5Ljg1IDY5Ni41OCAxNDQuMDEgNjk4LjMzIEMgMTI4Ljg4IDY5OS4xNSAxMTMuMjAgNjk4Ljg2IDk4Ljg3IDY5My40MCBDIDg4LjkwIDY4OS42NCA3OS44MSA2ODIuMDEgNzYuNTkgNjcxLjU4IEMgNzQuMjAgNjYzLjg3IDc2LjcyIDY1NS41NiA4MS4xOSA2NDkuMTMgQyA4Ny43MCA2MzkuNzIgOTYuOTMgNjMyLjYyIDEwNi4zOSA2MjYuMzcgQyAxMjIuMjggNjE1Ljk1IDEzOS45MCA2MDguNjQgMTU3LjQxIDYwMS40MyBDIDE2NS40MSA1OTguMzEgMTczLjQzIDU5NS4wNSAxODEuODUgNTkzLjIzIEMgMTg0LjE5IDU5Mi42MiAxODYuNjMgNTkyLjYyIDE4OC45OCA1OTMuMjQgQyAxODkuMDEgNTk2Ljg4IDE4Ni42MSA1OTkuNzkgMTg0LjM5IDYwMi40MiBDIDE3OS41NiA2MDcuOTMgMTczLjk0IDYxMi42OCAxNjguMzEgNjE3LjM0IEMgMTY2LjI3IDYxOC45OCAxNjQuMjcgNjIwLjczIDE2MS44OCA2MjEuODQgQyAxNTEuMTEgNjI2LjgwIDE0MC40MiA2MzIuMDEgMTMwLjQ1IDYzOC40NiBDIDEyNi41NCA2NDEuMTAgMTIyLjUxIDY0My43OSAxMTkuNTkgNjQ3LjU2IEMgMTE4LjM5IDY0OS4xMyAxMTcuMjggNjUxLjUwIDExOC42OSA2NTMuMzEgQyAxMjAuODQgNjU2LjIxIDEyNC43MSA2NTYuOTMgMTI4LjA4IDY1Ny4zMCBDIDEzNS4xNSA2NTcuODMgMTQyLjIzIDY1Ni44MyAxNDkuMTkgNjU1LjY4IEMgMTY3LjM3IDY1Mi40MyAxODUuMTYgNjQ3LjM3IDIwMi45NyA2NDIuNTYgQyAyMTUuODQgNjM5LjA3IDIyNy4zOCA2MzAuMTMgMjMyLjc3IDYxNy43OCBDIDIzNC4zOCA2MTQuMTggMjM1LjYxIDYxMC40MSAyMzYuMzUgNjA2LjU0IEMgMjM4Ljk3IDU4NS4wOSAyNDMuMjUgNTYzLjg1IDI0OC4zOSA1NDIuODYgQyAyNTcuODMgNTA1LjA0IDI3MS4zMCA0NjcuOTQgMjkxLjI3IDQzNC4zNCBDIDMwNy43NiA0MDYuNTMgMzI5LjAyIDM4MS4zMyAzNTQuOTQgMzYxLjg3IEMgMzY5LjU0IDM1MC43OCAzODUuNjQgMzQxLjg2IDQwMi4xNSAzMzMuOTQgQyA0MDcuNDUgMzMxLjE1IDQxMy4zNiAzMjguOTggNDE3LjQ3IDMyNC40NCBDIDQyOC40MSAzMTIuODggNDQzLjc1IDMwNi4zNiA0NTMuNzggMjkzLjgxIEMgNDU4LjI3IDI4OC4zNiA0NjEuNTkgMjgxLjk1IDQ2My4zOSAyNzUuMTIgQyA0NjcuMTQgMjU5LjcyIDQ3NC4xOCAyNDUuNDAgNDgxLjQ0IDIzMS40MSBDIDQ4OC4yMiAyMTguNDQgNDk1Ljg1IDIwNS45MiA1MDMuNTAgMTkzLjQ2IEMgNTA0LjQ2IDE4MS40OCA1MDYuNTcgMTY5LjIzIDUxMi43MSAxNTguNzAgQyA1MTYuMjkgMTUyLjMyIDUyMS4xMiAxNDYuNTkgNTI3LjE1IDE0Mi40MSBDIDUzMC4zMyAxNDYuOTUgNTMzLjU1IDE1MS40NyA1MzYuNjggMTU2LjA2IFoiIC8+DQo8L2c+DQo8ZyBpZD0iIzJjMmMyY2ZmIj4NCjxwYXRoIGZpbGw9IiMyYzJjMmMiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDEyMi40NiAzNTQuNDUgQyAxMjUuMDUgMzUyLjQ1IDEyNy40MiAzNDkuNDUgMTMwLjk5IDM0OS40NiBDIDEzNS4yNyAzNDkuNDMgMTQwLjgzIDM0OC4zNyAxNDMuNzMgMzUyLjQxIEMgMTQ2LjI2IDM1NS4zNiAxNDUuNDggMzYwLjEwIDE0Mi40MyAzNjIuMzggQyAxMDYuNTUgMzkyLjM3IDcwLjU5IDQyMi4yNyAzNC42OCA0NTIuMjIgQyA3MC40OCA0ODIuMTAgMTA2LjM0IDUxMS45MiAxNDIuMTQgNTQxLjgwIEMgMTQ0LjYwIDU0My42NiAxNDYuMDQgNTQ2Ljk4IDE0NC44OCA1NDkuOTkgQyAxNDMuMjMgNTU0LjI0IDEzOC4yMiA1NTYuNDQgMTMzLjg3IDU1NS43NyBDIDEyOS45MCA1NTUuMjkgMTI3LjEzIDU1Mi4xNCAxMjQuMTcgNTQ5Ljc4IEMgODYuNTMgNTE4LjQzIDQ4LjkyIDQ4Ny4wMiAxMS4yNSA0NTUuNzAgQyA5LjIzIDQ1My4wMSA5LjE5IDQ0OC4yMyAxMi4yOCA0NDYuMjcgQyA0OS4wMyA0MTUuNjkgODUuNzMgMzg1LjA1IDEyMi40NiAzNTQuNDUgWiIgLz4NCjxwYXRoIGZpbGw9IiMyYzJjMmMiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDY1Ni40MSAzNTQuMzMgQyA2NTkuMDggMzQ5LjE0IDY2Ni41MCAzNDcuNTggNjcxLjI2IDM1MC43NyBDIDY3My44MSAzNTIuNDggNjc2LjA0IDM1NC42MyA2NzguNDMgMzU2LjU2IEMgNzE1LjU1IDM4Ny40NiA3NTIuNjIgNDE4LjQ0IDc4OS43NiA0NDkuMzAgQyA3OTEuOTEgNDUyLjAwIDc5MS44NSA0NTYuNzMgNzg4Ljc0IDQ1OC43MiBDIDc1MC42OSA0OTAuMzYgNzEyLjcyIDUyMi4xMCA2NzQuNjggNTUzLjc1IEMgNjcxLjQzIDU1Ni40OSA2NjYuODIgNTU1LjUyIDY2Mi45MiA1NTUuNTQgQyA2NTguNjUgNTU1LjU1IDY1NC45NyA1NTEuMTggNjU1Ljg2IDU0Ni45NyBDIDY1Ni4xNiA1NDQuOTQgNjU3LjYzIDU0My40MSA2NTkuMTEgNTQyLjEzIEMgNjk0Ljg1IDUxMi4zNSA3MzAuNTggNDgyLjU2IDc2Ni4zMiA0NTIuNzggQyA3MzAuNTEgNDIyLjkwIDY5NC42NSAzOTMuMDggNjU4Ljg1IDM2My4xOSBDIDY1Ni4xNiAzNjEuMjEgNjU0LjgwIDM1Ny40MSA2NTYuNDEgMzU0LjMzIFoiIC8+DQo8L2c+DQo8L3N2Zz4NCg==
// @require      https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/433251/%E3%80%90%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B%E3%80%91%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433251/%E3%80%90%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B%E3%80%91%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    function inject_panel(){
        let top = 145
        let left = 18
        /*if(GM_getValue('panel')){
        top = GM_getValue('panel')[0]
        left = GM_getValue('panel')[1]
    }*/
        let css =`<style type="text/css">
    .panel{
     -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    --antd-wave-shadow-color: #00c758;
    font-feature-settings: "tnum";
    font: 12px/1.5 "Arial", "Hiragino Sans GB", "SimSun", "serif";
    font-size: 15px;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    outline: none;
    z-index: 99;
    position: absolute;
    font-family: 'Microsoft Yahei';
    width: max-content;
    top: ${top}px;
    left: ${left}px;
    }
    .panel_head{
    user-select: none;
    text-align: center;
    height: 35px;
    padding: 4px 10px;
    font-weight: bold;
    font-size: 1.5em;
    line-height: 30px;
    color: black;
    background-color: rgba(255,127,2,0.8);
    cursor: move;
    }
    .panel_con{
    padding: 10px;
    background-color: rgba(248,248,248,0.8);
    height: max-content;
    }
    .panel_list{
        padding: 0 10px;
    }
    .panel_list > li{
    list-style: none;
    color: #333;
    clear: none;
    font-weight: bold;
    margin-top: 5px;
    }
    </style>
    `
    let div = `<div class = "panel">
    <div class="panel_head">挂机助手</div>
        <div class ="panel_con">
            <ul class ="panel_list">
                <li><img src="https://greasyfork.s3.us-east-2.amazonaws.com/g54gqrpva1e8aabe87octe4ifzvr"></li>
                 <li>需要代做网课请扫描上方二维码</li>
            </ul>
        </div>
    </div>
    `
    $("head").append(css);
        $("body").append(div);
        $.fn.extend({
            dragBox: function(drag, wrap) {
                let that = this;
                var initX,
                    initY,
                    dragable = false,
                    wrapLeft = $(wrap).offset().left;
                var wrapTop = $(wrap).offset().top;
                drag.addEventListener('dblclick', function(e) {
                    /* if (/收起/.test(this.innerText)) {
                    this.innerText = '双击显示';
                    $('.panel_con').hide();
                } else {
                    this.innerText = '双击收起';
                    $('.panel_con').show();
                }
                */
                }, false);
                drag.addEventListener("mousedown", function(e) {
                    dragable = true;
                    initX = e.clientX;
                    initY = e.clientY;
                    wrapLeft = $(wrap).offset().left;
                    wrapTop = $(wrap).offset().top;
                }, false);

                document.addEventListener("mousemove", function(e) {
                    if (dragable === true) {
                        var nowX = e.clientX,
                            nowY = e.clientY,
                            disX = nowX - initX,
                            disY = nowY - initY;
                        $(wrap).offset({ left: wrapLeft + disX, top: wrapTop + disY });
                    }
                });

                drag.addEventListener("mouseup", function(e) {
                    dragable = false;
                    wrapLeft = $(wrap).offset().left;
                    wrapTop = $(wrap).offset().top;
                    that.top = wrapTop - $(window).scrollTop();
                    that.left = wrapLeft;
                    GM_setValue('panel',[that.top,that.left])

                }, false);

            },})
        $('.panel').dragBox($('.panel_head')[0],$('.panel')[0]);
    }
    var shua_type = /BootStrap_Video/.test(window.location.href)?"video":"ppt"

    unsafeWindow.confirm = function(message){
        if(/上次位置继续观看/.test(message)){
            new ElegantAlertBox("自动从上次位置播放");
            return 1
        }else{
            new ElegantAlertBox(message);
        }
    }
    function shua_video(){
        $('video')[0].addEventListener('pause',function(){
            if (GM_getValue('do')) {
                $('video')[0].play()
                setTimeout(function(){
                    new ElegantAlertBox('已自动恢复 >__<')},2000)
            }
        })
        $('video')[0].addEventListener('ended',function(){
            new ElegantAlertBox('这个视频已经刷完了哦>__<')
            setTimeout(function() {
                if ( GM_getValue('do')) {
                    new ElegantAlertBox('播放下一个>__<')
                    document.querySelector('#nextChapter').click()
                }
            },1000)
        })
        $("video")[0].muted = true
        new ElegantAlertBox('2s后开始刷课，如未播放视频，请手动点击播放')
        setTimeout(function() {$("video")[0].play()},2000)


    }
    function diffTime(startDate,endDate) {
        var diff=endDate - startDate;//.getTime();//时间差的毫秒数
        //计算出相差天数
        var days=Math.floor(diff/(24*3600*1000));
        //计算出小时数
        var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
        //计算相差秒数
        var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);
        return minutes+"分"+seconds+"秒"
    }
    function ppt_next(){
        new ElegantAlertBox('这个ppt已经刷完了哦>__<')
        if ( GM_getValue('do')) {
            let ppt_list = document.querySelectorAll(".menu_body > span > a:nth-child(2)")
            for (var i = 0; i < ppt_list.length-1; i++) {
                if(ppt_list[i].href == window.location.href){
                    for (var j = i; j < ppt_list.length-1; j++) {
                        if(ppt_list[j+1].href.length){
                            window.location.href = ppt_list[j+1].href
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    function shua_ppt(){
        //setInterval(function(){ new ElegantAlertBox('ppt挂机脚本运行失败，请自行观看或联系我')},5000)
        // return
        let total_time = parseInt(document.querySelector("#Lbl_spsc").innerText)
        let had_time = $("#lbl_zsc")[0]? parseInt($("#lbl_zsc")[0].innerText): 0
        let need_time = (total_time - had_time)*60 +10
        //nedd_time+10s后下一个
        //1分钟跟新一次
        //开始
        let jilu_btn = document.querySelector("#btn_jldqsj0")
        if(jilu_btn){
            //start
            jilu_btn.click() //记录学习时间 -> 结束时间
            new ElegantAlertBox('开始刷ppt>__<')
            setTimeout(function(){
                jilu_btn.click()
                ppt_next()
            },need_time*1000)
            // listen,以免中断
            jilu_btn.addEventListener('click',function(){
                if (GM_getValue('do')) {
                    if (jilu_btn.value == "结束计时") {
                        setTimeout(function(){
                            new ElegantAlertBox('已自动恢复 >__<')
                            if (jilu_btn.value != "结束计时") {
                                jilu_btn.click()
                            }
                        },2000)
                    }
                }
            })
        }else{
            //不需要刷，直接下一个
            ppt_next()
        }

    }
    //控制什么时候刷
    let promise = null
    //GM_setValue('do',0)
    /* $('#shua_all_video')[0].addEventListener('click',function(){
        if (this.innerText == "取消刷课"){
            GM_setValue('do',0);
            new ElegantAlertBox("已取消刷课>__<")
            this.innerText = "开始刷课"
            promise = clearInterval(promise)
        }else{
            this.innerText = "取消刷课"
            GM_setValue('do',1)
            if (shua_type == "video") {
                promise = setInterval(function(){ new ElegantAlertBox('正在观看视频 >__<')},5000)
                shua_video()
            }else{
                shua_ppt()
            }
            new ElegantAlertBox("开始刷课>__<")
        }
    })*/
    if(! /Video|PPT/.test(window.location.href)){
        if(/BootStrap_index|CourseIndex/.test(window.location.href)){
        inject_panel()
        }
    }else{
        var tmp = setInterval(function(){
            if ($("video") || $("#btn_jldqsj0")) {
                clearInterval(tmp)

                new ElegantAlertBox('准备开始看视频/PPT')
                inject_panel()
                if (shua_type == "video") {
                    shua_video()
                }else{
                    shua_ppt()
                }
            }
        },1000)
        }

})();
