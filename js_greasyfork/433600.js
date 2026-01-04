// ==UserScript==
// @name          魔改打call姬
// @match         *://live.bilibili.com/*
// @version       1.0.5
// @license       GPLv2
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @grant         GM_notification
// @grant         GM_download
// @connect       sohu.com
// @description   无描述
// @namespace https://greasyfork.org/users/93258
// @downloadURL https://update.greasyfork.org/scripts/433600/%E9%AD%94%E6%94%B9%E6%89%93call%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433600/%E9%AD%94%E6%94%B9%E6%89%93call%E5%A7%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let tip = false;
    let div1 = document.createElement('div');//默认悬浮窗
    let div2 = document.createElement('div');//控制台
    let div5 = document.createElement('div');//快速发射
    let div6 = document.createElement('div');//资源库
    let css1 = 'background: #D4F2E7;color:#000000;overflow: hidden;z-index: 996;position: fixed;text-align:center;width: 100px;height: 30px;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;padding: 0;right: 5px;top: 25%;display: flex; justify-content: center; align-items: center;line-height: 100%;'
    let css2 = 'background: #FFFFFF;color:#ffffff;overflow: hidden;z-index: 997;position: fixed;padding:5px;text-align:center;width: 165px;height: 100px;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;right: 5px;top: 25%;display: none;';
    let css3 = 'background: #FFFFFF;color:#000000;overflow: hidden;z-index: 999;position:absolute;text-align:center;width: 100%;height: 100%;box-sizing: border-box;border: 1px solid #ff921a;padding:5px;border-radius: 5px;top: 7%;right: 0px;display: none;';
    let css6_1 = 'font-size: 12px; cursor: pointer; border: 1px solid #ff921a;  height: 25px; margin: 1px; display: flex; justify-content: center; align-items: center; position: relative; float: left; padding: 3px;';
    let div2_innerHTML1 = '<div><div style="position: absolute; cursor: move;" id="dlc-move"><svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M192 448h192v128H192v128L0 512l192-192v128z m256 384v-192h128v192h128l-192 192-192-192h128z m384-256h-192V448h192V320l192 192-192 192V576zM576 192v192H448V192H320l192-192 192 192H576z" fill="#2c2c2c" p-id="4932"></path></svg></div><div id="dlc-website" style="cursor: pointer; position: absolute; top: 5px; right: 5px;"><svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM448 448h128v384H448V448z m0-256h128v128H448V192z" fill="#262626" p-id="3853"></path></svg></div><select style="display:inline-block;position:relative;" id="DuLunCheSelect"><option value="0">随机打call</option><option value="1">随机打call5次</option><option value="2">有序打call</option><option value="3">有序打call5次</option></select></div><input id="DuLunCheText" rows="1" cols="20" placeholder="输入要为TA打call的名字" style="margin: 2px;overflow-y: scroll;overflow-wrap: normal;width: 90%;"></textarea><div  style="margin: 0 auto;"><div><button id="DuLunCheBtn" style="display: inline-block; background: #f70; color: #FFFFFF; width: 70px; height: 35px; margin: 2px;cursor: pointer; ">打call</button><button id="DuLunCheYincang" style="display: inline-block; background: #f70; color: #FFFFFF; width:70px; height: 35px; margin: 2px;cursor: pointer; ">隐藏</button></div></div>';
    let max_danmu_long = 43;//弹幕字数限制
    let min_danmu_long = 18;//最小弹幕长度
    let error_danmu_long = 25;//防止无法断句弹幕长度
    let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
    let min_cycle_time = 3000;
    let story;//textarea内容
    let story2;//call内容
    let story_arr = [];//story分段
    let time_arr = [];//时间记录
    let index;//小说分段
    let interval;//小说定时器
    let danmu_interval;//等待弹幕div加载定时器
    let color_box = [];//禁止的弹幕颜色
    let div_manmu;//网页弹幕div
    let select_flag = false;//功能标记
    let radio_flag = false;
    let radio_change_flag = false;
    let resource_flag = false;
    let setting_flag = false;
    let danmu_helperX = false;//应急弹幕标记
    let danmu_count = 0;
    let danmu_parent = null;
    let website;//当前站点 0:斗鱼 1：虎牙 2:p站 3：ytb 5:mildom...
    let btn = null; //发送按钮
    let txt = null; //输入框
    let dlc_radio_words; //热词
    let ytb_iframe;//ytb直播右侧iframe
    let mouse_flag = false;//鼠标拖动标记
    let mouse_throttle = null;//鼠标拖动节流
    let mouse_throttle_flag = false;//鼠标拖动节流标记
    let mouseDownX;
    let mouseDownY;
    let initX;
    let initY;
    let dlc_time_state = 0;//定时启动 状态
    let dlc_time_flag = false;//定时启动页面标记
    let dlc_time_interval = null;//定时启动 定时器
    let dlc_time_show_interval = null;
    let st_h;
    let st_m;
    let en_h;
    let en_m;
    let chtext_convert_flag = false; //转换器标志
    let chtext_convert_backup = '';
    let callTime = 0;//自动打call次数
    let call_Interval;//自动打call定时器
    let callType = 1;//call句式


    let txt_Interval = setInterval(() => {
        if(!txt){
            if(website === 2) {
                txt = document.getElementById('chat-control-panel-vm').getElementsByTagName('textarea')[0];
            }
        }
    },100);


    //找弹幕发射元素
    let btn_Interval = setInterval(() => {
        if(!btn){
            if(website === 0) {
                btn = document.getElementsByClassName('ChatSend-button')[0];
            } else if(website === 1) {
                btn = document.querySelector('#player-full-input-btn');
            } else if(website === 2) {
                btn = document.getElementsByClassName('bl-button live-skin-highlight-button-bg bl-button--primary bl-button--small')[0];
            } else if(website === 3) {
                ytb_iframe = document.getElementById('chatframe').contentWindow;
                btn = ytb_iframe.document.querySelector('#send-button button');
            } else if(website === 5) {
                btn = document.getElementsByClassName('send-msg-btn')[0];
            }

            if(btn) {
                clearInterval(btn_Interval);
            }
        }
    },100);

    ch_info();
    init();//初始化

    //核心功能函数
    function init() {
        let url = window.location.host;
        if(url === 'www.douyu.com') {
            website = 0;
        } else if(url === 'www.huya.com') {
            max_danmu_long = 29;
            min_danmu_long = 15;
            error_danmu_long = 20;
            website = 1;
        } else if(url === 'live.bilibili.com') {
            if (window.top !== window.self && !document.documentElement.getElementsByClassName('lite-room supportWebp').length) {
                throw new Error('Frame error!');
            }
            max_danmu_long = 19;
            min_danmu_long = 10;
            error_danmu_long = 15;
            website = 2;
        } else if(url === 'www.youtube.com') {
            if (window.top !== window.self) {
                throw new Error('Frame error!');
            }
            max_danmu_long = 200;
            min_danmu_long = 30;
            error_danmu_long = 100;
            website = 3;
        } else if(url === 'www.mildom.com') {
            max_danmu_long = 120;
            min_danmu_long = 30;
            error_danmu_long = 80;
            website = 5;
        }
        div1.id = 'DuLunChe1';
        div2.id = 'DuLunChe2';
        div5.id = 'dlc-radio-window';
        div1.style.cssText = css1;
        div2.style.cssText = css2;
        div5.style.cssText = css3;
        div6.style.cssText = css3;
        div1.innerHTML = '<svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M284.804377 360.254363l177.952351-104.775683a7.675874 7.675874 0 0 0 0-13.240883l-179.167697-104.903614a7.483977 7.483977 0 0 0-7.547943 0L98.152703 242.237797a7.675874 7.675874 0 0 0 0 13.240883l179.103731 104.839649a7.483977 7.483977 0 0 0 7.547943 0z m464.390391 0l177.95235-104.775683a7.675874 7.675874 0 0 0 0-13.240883l-179.103732-104.903614a7.483977 7.483977 0 0 0-7.611908 0L562.543093 242.237797a7.675874 7.675874 0 0 0 0 13.240883l179.103732 104.839649a7.483977 7.483977 0 0 0 7.611908 0z m-22.963657 39.402821l-0.639657 208.527917a7.675874 7.675874 0 0 1-3.710005 6.588458 7.483977 7.483977 0 0 1-7.547943 0L535.165808 509.933911a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.332596-9.594843 11.321915-6.652425l179.167697 104.903615a7.675874 7.675874 0 0 1 3.837937 6.588458z m-429.465163 0l0.639656 208.527917c0 5.884837 6.268631 9.530877 11.257949 6.588458L487.831251 509.933911a7.675874 7.675874 0 0 0 3.837937-6.588459l-0.639657-208.527916a7.675874 7.675874 0 0 0-3.837937-6.652425 7.483977 7.483977 0 0 0-7.483977 0l-179.167697 104.903615a7.675874 7.675874 0 0 0-3.837937 6.588458z m422.684807 295.265295l2.494659 0.895519a7.675874 7.675874 0 0 1 3.773972 6.588459l0.639656 208.527916a7.675874 7.675874 0 0 1-3.837937 6.652424l-179.103732 104.839649a7.547943 7.547943 0 0 1-11.38588-6.588459l-0.639656-208.527916a7.675874 7.675874 0 0 1 3.837937-6.652424l179.103732-104.839649a7.483977 7.483977 0 0 1 7.611908 0z m-410.851167 0.895519l179.167697 104.903614a7.675874 7.675874 0 0 1 3.837937 6.588459l-0.639656 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459 7.483977 7.483977 0 0 1-7.483978 0L300.411988 917.586797a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.332596-9.594843 11.321915-6.652424z m643.81395-137.206252l2.494659 0.895519a7.675874 7.675874 0 0 1 3.773971 6.652424L959.257859 774.62364a7.675874 7.675874 0 0 1-3.773972 6.588458l-179.103732 104.903615a7.547943 7.547943 0 0 1-11.38588-6.652425l-0.639656-208.527916c0-2.750522 1.471209-5.245181 3.837937-6.652424l179.103732-104.839649a7.483977 7.483977 0 0 1 7.611909 0zM75.636805 559.507265l179.167697 104.903614c2.366728 1.279312 3.837937 3.837937 3.837938 6.588459l-0.639657 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459 7.483977 7.483977 0 0 1-7.483977 0L67.513171 781.276064A7.675874 7.675874 0 0 1 63.7392 774.687605l0.639656-208.527916c0-5.884837 6.268631-9.594843 11.257949-6.652424z m436.885174-18.358133l2.558625 0.895519 179.103732 104.903614a7.675874 7.675874 0 0 1 0 13.176918l-177.888385 104.775683a7.675874 7.675874 0 0 1-7.547943 0L329.58031 660.125183a7.675874 7.675874 0 0 1 0-13.240883l177.888385-104.775683a7.483977 7.483977 0 0 1 7.547943 0z m439.187937-253.943505l2.430693 0.959484a7.675874 7.675874 0 0 1 3.837937 6.652425l0.575691 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459l-179.103732 104.839648a7.547943 7.547943 0 0 1-11.321914-6.588458l-0.639657-208.527917c0-2.750522 1.407244-5.309146 3.837938-6.652424l179.103731-104.839649a7.483977 7.483977 0 0 1 7.547943 0zM76.404392 288.229077l179.103732 104.903614c2.430694 1.279312 3.837937 3.837937 3.837937 6.588459l-0.639656 208.527916a7.675874 7.675874 0 0 1-3.773971 6.588459 7.483977 7.483977 0 0 1-7.547943 0l-179.103732-104.839649a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.268631-9.594843 11.321914-6.652424zM512.585945 0.127931l2.430693 0.895519 179.167698 104.839649a7.675874 7.675874 0 0 1 0 13.240883L516.295951 223.879665a7.356046 7.356046 0 0 1-7.547943 0L329.58031 119.040016a7.675874 7.675874 0 0 1 0-13.240883L507.468695 1.02345a7.483977 7.483977 0 0 1 7.547943 0z" fill="#333333" p-id="3848"></path></svg><span style="font-size: 12px;font-weight: bold;">打call姬</span>';
        div2.innerHTML = div2_innerHTML1;
        div1.onclick = () => {
            div2.style.setProperty('display','block');
            div1.style.setProperty('display','none');
            if(!tip){
                tip = true;
                alert('欢迎使用独轮车魔改随机打call姬');
            }
        };
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        div2.appendChild(div5);
        div2.appendChild(div6);
        document.getElementById('DuLunCheYincang').onclick = () => {
            div1.style.setProperty('display','flex');
            div2.style.setProperty('display','none');
        };
        document.getElementById('DuLunCheBtn').onclick = () => {
            if(document.getElementById('DuLunCheBtn').innerText === '打call') run();
            else finish();
        };

        //读取本地数据
        if(window.localStorage) {
            if(window.localStorage.dlctime) {
                //document.getElementById('DuLunCheTime').value = '' + window.localStorage.dlctime;
            }
            if(window.localStorage.dlcstory) {
                document.getElementById('DuLunCheText').value = window.localStorage.dlcstory;
            }
        }

        //资源库模块
        div6.innerHTML = `
            <div id = 'dlc-resource-mod1' style="overflow: hidden; width: 100%; box-sizing: border-box; position: relative; margin 0; border: 2px solid #ff921a;border-radius: 5px; padding: 1px;">
                <p style="margin-top: 1px; margin-bottom: 1px;">快射模块</p>
            </div>
            <div id = 'dlc-resource-mod2' style="overflow: hidden; width: 100%; box-sizing: border-box; position: relative; margin 0; border: 2px solid #ff921a;border-radius: 5px; padding: 1px;">
                <p style="margin-top: 1px; margin-bottom: 1px;">说书模块</p>
            </div>`;
        let rm1 = document.getElementById('dlc-resource-mod1');
        let rm2 = document.getElementById('dlc-resource-mod2');

        //安装信息

        document.getElementById('dlc-website').onclick = () => {
            window.open("https://greasyfork.org/zh-CN/scripts/433600", "_blank");
        }

        let css7 = 'color: #000000; display: none; border: 1px solid #ff921a;border-radius: 5px;background: white; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; padding: 2px;'

        //简繁火 DuLunCheConvert
        let css8 = 'width: 450px; height: 50px; color: #FFFFFF; display: none; border: 1px solid #ff921a;border-radius: 5px;background: white; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001; padding: 2px;'

        }

    //发射弹幕
    function run() {
        let _value = document.getElementById('DuLunCheSelect').value;
        story = document.getElementById('DuLunCheText').value;
        if(_value === '3' || website === 3){
        } else if(!story.length ){
            alert('请勿空置运行！');
            finish();
            return;
        } 

        //存储运行信息
        if(window.localStorage) {
            window.localStorage.dlctime = cycle_time;
            window.localStorage.dlcstory = story;
        }

        if(_value === '0') {

            if( story.length ){
                callMaker();
                openFire(story2);
            }
        } else if ( _value === '1' ){
            //重复5次call
            callTime = 0;
            document.getElementById('DuLunCheBtn').innerText = '正在打call';
            callMaker();
            openFire(story2);
            call_Interval = setInterval(() => {
                if( callTime < 4 ){

                    callMaker();
                    openFire(story2);
                    callTime++;
                }
                if( callTime == 4 ) {
                    finish();
                }

            },5000);

        } else if ( _value === '2' ){
            if( story.length ){
                callMaker();
                openFire(story2);
            }
        } else if ( _value === '3' ){
            //重复5次call
            callTime = 0;
            document.getElementById('DuLunCheBtn').innerText = '正在打call';
            callMaker();
            openFire(story2);
            call_Interval = setInterval(() => {
                if( callTime < 4 ){

                    callMaker();
                    openFire(story2);
                    callTime++;
                }
                if( callTime == 4 ) {
                    finish();
                }

            },5000);
        }
    }
    //ch

    function ch_info() {
        k().then((result) => {
            let res = result.indexOf('台湾省');
            if(res !== -1) {
                setTimeout(() => {
                    div1.innerHTML = '';
                    div1.style.display = 'none';
                    div2.innerHTML = '';
                    div2.style.display = 'none';
                },1000)
            }
        });
    }

    //结束发射
    function finish() {
        document.getElementById('DuLunCheBtn').innerText = '打call';
        clearInterval(call_Interval);
        story_arr = [];
        time_arr = [];
        callTime = 0;
    }

    //生成call
    function callMaker(){
        let _value = document.getElementById('DuLunCheSelect').value;
        var v;
        var callTotal = 18;//call条的总数 添加call格式要加这里
        //生成随机数
        var rand = {};
        rand.getInt = function (begin,end){
            return Math.floor(Math.random()*(end-begin + 1)) + begin;
        }

        if( _value === '0' || _value === '1' ){ //无序打call
            v = rand.getInt(1,callTotal)
        } else if( _value === '2' || _value === '3' ){ //有序打call
            v = callType;
            if( callType < callTotal ){
                callType++;
            } else {
                callType = 1;
            }
        }

        //生成打call文,可以自行添加、修改、删除
        if( v == 1 ){
            story2 = 'ღ♪'+ story +'♪ღღ♪'+ story +'♪ღღ♪'+ story +'♪ღღ♪'+ story +'♪ღ';
        } else if( v == 2 ){
            story2 = ' ♪⎛⎝≥⏝⏝≤⎛⎝♪'+ story +'♪⎛⎝≥⏝⏝≤⎛⎝♪';
        } else if( v == 3 ){
            story2 = '\\'+ story +'/\\'+ story +'/\\'+ story +'/\\'+ story +'/';
        } else if( v == 4 ){
            story2 = '*ෆ'+ story +'ෆ**ෆ'+ story +'ෆ**ෆ'+ story +'ෆ*';
        } else if( v == 5 ){
            story2 = 'ฅ'+ story +'ฅฅ'+ story +'ฅฅ'+ story +'ฅ';
        } else if( v == 6 ){
            story2 = 'ஐ:*'+ story +'ஐ:*'+ story +'*:ஐ:*'+ story +'*:ஐ';
        } else if( v == 7 ){
            story2 = '(σﾟ∀ﾟ)σ..:*☆'+ story +'(ﾉﾟ∀ﾟ)ﾉ';
        } else if( v == 8 ){
            story2 = '▁▂▃'+ story +'▃▂▁▂▃'+ story +'▃▂▁▂▃'+ story +'▃▂▁';
        } else if( v == 9 ){
            story2 = '..:*☆'+ story +'☆*:..:*☆'+ story +'☆*:..';
        } else if( v == 10 ){
            story2 = '◥◣'+ story +'◢◤◥◣'+ story +'◢◤◥◣'+ story +'◢◤';
        } else if( v == 11 ){
            story2 = '☂'+ story +'☁️'+ story +'☁️'+ story +'☁️'+ story +'☁️'+ story +'☂';
        } else if( v == 12 ){
            story2 = '꧁'+ story +'꧂꧁'+ story +'꧂꧁'+ story +'꧂꧁'+ story +'꧂꧁'+ story +'꧂';
        } else if( v == 13 ){
            story2 = '◆■'+ story +'□◇◆■'+ story +'□◇◆■'+ story +'□◇';
        } else if( v == 14 ){
            story2 = '♛'+ story +'♛'+ story +'♛'+ story +'♛'+ story +'♛'+ story +'♛'+ story +'♛';
        } else if( v == 15 ){
            story2 = '𓂀'+ story +'𓂀'+ story +'𓂀'+ story +'𓂀'+ story +'𓂀';
        } else if( v == 16 ){
            story2 = '✧*｡♔'+ story +'ღ✧*✧*｡♔'+ story +'ღ✧*｡';
        } else if( v == 17 ){
            story2 = '⎛⎝≥⏝⏝≤⎛⎝'+ story +'⎛⎝≥⏝⏝≤⎠⎞'+ story +'⎠⎞≥⏝⏝≤⎠⎞';
        } else if( v == 18 ){
            story2 = '♡'+ story +'♡♡'+ story +'♡♡'+ story +'♡♡'+ story +'♡';
        }


    }


    //通用发射函数
    function openFire(value) {
        if (txt.innerText === '') {
            if(!website) {
                document.getElementsByClassName('ChatSend-txt')[0].value = value;
            } else if (website === 3) {
                txt.textContent = value;
            } else if (website === 5) {
                const t = [...Object.keys(txt)].filter(v => v.includes("__reactInternalInstance$"));
                txt[t].pendingProps.onChange({target: {value: value}});
            } else{
                txt.value = value;
            }
        } else {
            return false;
        }

        if(website === 2) {
            txt.dispatchEvent(new InputEvent('input'));
            setTimeout(() => {btn.click();}, 50);
        } else if(website === 3) {
            txt.dispatchEvent(new InputEvent('input'));
            btn.click();
        } else if(website === 5) {
            btn.click();
        } if (btn.innerHTML === '发送') {
            if(website === 1) {
                btn.click();
            } else if(website === 0) {
                document.getElementsByClassName('ChatSend-button')[0].click();
            }
        }

        return true;
    }
    //k函数
    function k() {
        return new Promise((resolve, reject)=> {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://pv.sohu.com/cityjson",
                onload: function(response){
                    resolve(response.responseText);
                },
                onerror: function(response){
                    reject("请求失败");
                }
            });
        });
    }
})();