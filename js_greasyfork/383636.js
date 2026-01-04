// ==UserScript==
// @name         质感字体&&页面平滑滚动
// @namespace    http://svnzk.github.io/
// @version      0.12
// @description  让每个页面的字体变得有质感 页面滚动更平滑 字体换为萍方字体并添加字体阴影
// @author       svnzk
// @match        *://*/*
// @run-at       document-start
// @resource smscl     https://cdn.bootcss.com/smoothscroll/1.4.9/SmoothScroll.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/383636/%E8%B4%A8%E6%84%9F%E5%AD%97%E4%BD%93%E9%A1%B5%E9%9D%A2%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/383636/%E8%B4%A8%E6%84%9F%E5%AD%97%E4%BD%93%E9%A1%B5%E9%9D%A2%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==
//2019-11-26 更新 v0.12 :  [新增] 增加了设置窗口 可以对平滑滚动和阴影半径进行设置 [重构] 使用API替代了部分逻辑; [修复] 部分论坛清除外来 style 的问题;
var smoothscroll,shadow_r,cssdom;
var ip_switch, ip_range, sp_samp, btn_cancel, btn_submit,ddiv;
function ShowSettingWin(){
    var wdcsstext = ".mdwindow{position:fixed;z-index:9999;right:50px;top:0;transform:translateY(-100px);transition:transform .2s;width:300px;height:100px;display:block;border-bottom-left-radius:3px;border-bottom-right-radius:3px;background-color:#FFF}.mdwindow_show{transform:translateY(0);transition:box-shadow .3s;box-shadow:0 0 15px #333}.mdwindow_show:hover{box-shadow:0 0 40px #333}.mdwindow>div{margin:3px}.mdwindow input,.mdwindow span{display:inline-block}.mdwindow input[type=checkbox]{-webkit-appearance:none;appearance:none;position:relative;width:30px;height:10px;left:10px;top:3px;background-color:#6666;border:solid 1px #66666666;border-radius:10px;transition:all .3s;outline:0;user-select:none;cursor:pointer}.mdwindow input[type=checkbox]::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background-color:#FFF;box-shadow:0 0 3px #666;top:-4px;left:-1px;transition:all .3s}.mdwindow input[type=checkbox]:checked{background-color:greenyellow;transition:all .3s}.mdwindow input[type=checkbox]:checked::before{left:15px}.mdwindow input[type=range]{-webkit-appearance:none;appearance:none;position:relative;top:-2px;width:150px;height:8px;border-radius:99px;border:0;box-shadow:0 0 2px #333;outline:0;user-select:none;cursor:default}.mdwindow input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:15px;height:15px;border-radius:50%;background-color:#1976d2;transition:all .3s;box-shadow:1px 1px 2px #6666}.mdwindow input[type=range]::-webkit-slider-thumb:hover{box-shadow:2px 2px 3px #6666}div.cancel_btn{display:inline-block;position:absolute;left:10px;bottom:4px;background-color:#e53935}div.submit_btn{display:inline-block;position:absolute;right:10px;bottom:4px;background-color:#81c784}.fab_btn *{user-select:none;outline:0;cursor:default}.fab_btn{transition:all .15s;border:0;border-radius:50%;width:1cm;height:1cm;line-height:1cm;box-shadow:0 0 8px #666;text-align:center;user-select:none;outline:0}.fab_btn:hover{box-shadow:0 0 16px #666;transform:scale(1.05)}.fab_btn:active{box-shadow:0 0 3px #666;transform:scale(0.95)}span.sampleshadow{position:relative;left:20px}";
    cssdom = GM_addStyle(wdcsstext);

    ddiv = document.createElement('div');
    ddiv.classList.add("mdwindow");
    ddiv.innerHTML = '<div><label for="mdswitch">平滑滚动</label><input type="checkbox" id="mdswitch"> <span style="margin-left:20px">刷新网页才能生效</span></div><div><span>0</span> <input type="range" min="0" max="1000"> <span>15</span><span class="sampleshadow">阴影半径</span></div><div><div class="cancel_btn fab_btn"><span><svg t="1574689706854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"            p-id="1053" width="1cm" height="1cm"><path              d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"              fill="#231815" p-id="1054"></path><path              d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM726.72 297.28a32 32 0 0 0-45.12 0l-169.6 169.6-169.28-169.6A32 32 0 0 0 297.6 342.4l169.28 169.6-169.6 169.28a32 32 0 1 0 45.12 45.12l169.6-169.28 169.28 169.28a32 32 0 0 0 45.12-45.12L557.12 512l169.28-169.28a32 32 0 0 0 0.32-45.44z"              fill="#231815" p-id="1055"></path></svg></span></div><div class="submit_btn fab_btn"><span><svg t="1574689650777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"            p-id="4887" width="1cm" height="1cm"><path              d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"              fill="#231815" p-id="4888"></path><path              d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z"              fill="#231815" p-id="4889"></path></svg></span></div></div>';
    ip_switch = ddiv.querySelector('input[type=checkbox]');
    ip_range = ddiv.querySelector('input[type=range]');
    sp_samp = ddiv.querySelector('.sampleshadow');
    btn_cancel = ddiv.querySelector('.cancel_btn');
    btn_submit = ddiv.querySelector('.submit_btn');

    ip_switch.checked = smoothscroll;
    ip_range.value = shadow_r / 15 * 1000;
    sp_samp.style.cssText = "text-shadow: #c3c3c3 1px 1px " + shadow_r + "px !important;"

    btn_cancel.onclick = CloseSettingWin;
    ip_range.oninput = (e)=>{sp_samp.style = 'text-shadow: #c3c3c3 1px 1px '+Math.round(e.target.value / 1000 * 15)+'px !important;'}
    btn_submit.onclick = () => {
      GM_setValue('smoothscroll', ip_switch.checked);
      GM_setValue('shadow_r',Math.round(ip_range.value / 1000 * 15));
      CloseSettingWin();
    }

    ddiv.classList.add("mdwindow_show");
    document.body.appendChild(ddiv);

}
function CloseSettingWin(){
    ddiv.classList.remove('mdwindow_show'); setTimeout(() => {
        document.body.removeChild(ddiv);
        document.head.removeChild(cssdom);
      }, 1000);
}
function ShowTip(){

}
(function() {
    shadow_r = GM_getValue('shadow_r',3);
    smoothscroll = GM_getValue('smoothscroll',true);
    var tshadow = 'text-shadow:1px 1px '
    + shadow_r
    +'px #c3c3c3 !important;';

    var zgcsstext = " *:not([class*='icon']):not(.fa):not(.fas):not(i) {font-family: 'PingFang SC','Heiti SC','myfont','Microsoft YaHei','Source Han Sans SC','Noto Sans CJK SC','HanHei SC', 'sans-serif' ,'icomoon','Icons' ,'brand-icons' ,'FontAwesome','Material Icons','Material Icons Extended','Glyphicons Halflings'  !important;} *{";
    zgcsstext = shadow_r == 0?zgcsstext: zgcsstext+tshadow;
        zgcsstext += "font-weight:bold !important;font-family: 'PingFang SC','Microsoft YaHei';}";

    var zgstyle = GM_addStyle(zgcsstext);
    GM_registerMenuCommand("质感字体 脚本设置 Setting", ShowSettingWin);
    var zgstyleid = '#'+zgstyle.id;
    window.onload=()=>{
        if(document.head.querySelectorAll(zgstyleid).length < 1){
            document.head.append(zgstyle);
           }
    }
    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.textContent = GM_getResourceText('smscl')
    if(smoothscroll == true) document.head.appendChild(scr);

})();

