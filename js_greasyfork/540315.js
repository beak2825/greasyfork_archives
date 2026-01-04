// ==UserScript==
// @name         华医网自动播放 v2.4.2
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  自动播放华医网视频，自动跳转下一课；增加跳转重试、#025 错误跳过、时长判定结束与防休眠机制。更新时间：2025.06.23
// @author       改编整合
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_list.aspx?*
// @match        https://cme28.91huayi.com/pages/exam_result.aspx?cwid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540315/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20v242.user.js
// @updateURL https://update.greasyfork.org/scripts/540315/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20v242.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------------- 常量 ---------------- */
    const wechatQrUrl = "https://i.ibb.co/cMKqNXP/052fbb6ad546926e3807abb6a6f005c.jpg";
    const alipayQrUrl = "https://i.ibb.co/TD8Gv87x/9ed47216b1521cca5002653690f6890.jpg";

    /* ---------------- UI ---------------- */
    function createStatusPanel() {
        const panel = document.createElement('div');
        panel.id = 'huayi-status';
        panel.style.cssText = `position:fixed;left:10px;bottom:10px;z-index:9999;background:#F7F7F8;color:#000;padding:10px 12px;border-radius:12px;font-size:14px;max-width:270px;box-shadow:0 0 6px rgba(0,0,0,.1);`;
        panel.innerHTML = `
            <div style="font-weight:bold;font-size:15px;margin-bottom:6px;">华医网自动播放</div>
            <div id="h-status"  style="margin-bottom:4px;">视频状态: 启动中</div>
            <div id="h-action"  style="margin-bottom:4px;">脚本状态: -</div>
            <div id="h-title"   style="margin-bottom:4px;">当前视频: -</div>
            <div style="font-size:13px;line-height:1.4;margin-top:6px;">
              <strong>注意：</strong><br>1. 无倍速、多开、拖动进度条；<br>2. 考试需扫码，无法自动。
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:10px;">
                <div style="text-align:center;">
                  <img src="${wechatQrUrl}" alt="微信二维码" style="width:100px;border-radius:8px;border:1px solid #ccc;"/>
                  <div style="font-size:12px;margin-top:2px;">微信</div>
                </div>
                <div style="text-align:center;">
                  <img src="${alipayQrUrl}" alt="支付宝二维码" style="width:100px;border-radius:8px;border:1px solid #ccc;"/>
                  <div style="font-size:12px;margin-top:2px;">支付宝</div>
                </div>
            </div>
            <div style="font-size:12px;color:#444;text-align:center;margin-top:6px;">制作不易，如果喜欢，请我喝杯咖啡 ☕</div>
            <div style="font-size:11px;color:#888;text-align:center;margin-top:6px;">版本信息：v2.4.2，2025-06-23</div>`;
        document.body.appendChild(panel);
    }

    function updateStatus(state, action, title) {
        const set = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
        set('h-status', `视频状态: ${state}`);
        set('h-action', `脚本状态: ${action}`);
        set('h-title',  `当前视频: ${title}`);
    }

    /* ---------------- 弹窗秒杀 ---------------- */
    function autoSkipPopup() {
        setInterval(() => {
            try {
                document.querySelector('.pv-ask-skip')?.click();
                document.querySelector('.signBtn')?.click();
                document.querySelector("button[onclick='closeProcessbarTip()']")?.click();
                document.querySelector('button.btn_sign')?.click();
                document.querySelector('#floatTips')?.style.display !== 'none' && window.closeFloatTips?.();
            } catch {}
        }, 2000);
    }

    /* ---------------- 防浏览器休眠 ---------------- */
    function preventSleep() {
        // 模拟鼠标活动
        setInterval(()=>{
            window.dispatchEvent(new MouseEvent('mousemove', {bubbles:true,clientX:0,clientY:0}));
        }, 120000);
        // 循环播放 1 秒静音音频
        const audio=document.createElement('audio');
        audio.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";
        audio.loop=true; audio.volume=0; audio.play().catch(()=>{});
        document.body.appendChild(audio);
    }

    /* ---------------- 播放控制 ---------------- */
    let autoPlayTimer=null;
    function autoPlayVideo(){
        const video=document.querySelector('video');
        if(!video) return;
        video.volume=0;video.muted=true;
        autoPlayTimer=setInterval(()=>{
            if(video.paused && !video.ended) video.play().catch(()=>{});
            // 时长判定兜底
            if(video.duration && !video.ended && (video.duration-video.currentTime)<0.3){
                clearInterval(autoPlayTimer);
                updateStatus('播放完成','时长判定跳转',document.title);
                setTimeout(autoJumpToLearningVideo,3000);
            }
        },1000);
        video.addEventListener('ended',()=>{
            clearInterval(autoPlayTimer);
            updateStatus('播放完成','跳转中',document.title);
            setTimeout(autoJumpToLearningVideo,3000);
        });
        video.addEventListener('play',()=>updateStatus('播放中','监控中',document.title));
        // 检测 #025
        setInterval(()=>{
            const err=document.querySelector('.vjs-error-display');
            if(err && err.textContent.includes('#025')){
                updateStatus('错误#025','跳过到下一条',document.title);
                autoJumpToLearningVideo();
            }
        },3000);
    }

    /* ---------------- 跳转逻辑 ---------------- */
    function autoJumpToLearningVideo(retry=0){
        const items=[...document.querySelectorAll('li.lis-inside-content')];
        let target=null,status='',index=-1;
        for(let i=0;i<items.length;i++){ if(items[i].innerText.includes('未学习')){target=items[i];status='未学习';index=i;break;} }
        if(!target){ for(let i=0;i<items.length;i++){ if(items[i].innerText.includes('学习中')){target=items[i];status='学习中';index=i;break;} } }
        if(!target){updateStatus('待命','课程已完成',document.title);return;}
        const prev=document.title;
        target.scrollIntoView({behavior:'smooth',block:'center'});
        setTimeout(()=>{
            target.click();
            target.querySelector('a,h2')?.click();
            updateStatus('跳转中',`点击第 ${index+1} 个【${status}】`,document.title);
            setTimeout(()=>{
                if(document.title===prev){
                    if(retry<3){updateStatus('跳转重试',`第 ${retry+1} 次`,document.title);autoJumpToLearningVideo(retry+1);} else {updateStatus('跳转失败','重试3次仍失败',document.title);} }
            },1500);
        },500);
    }

    /* ---------------- 立即学习按钮 ---------------- */
    const clickFirstImmediateLearn=()=>document.querySelectorAll('input.state_lis_btn').forEach(btn=>btn.value.replace(/\s/g,'')==='立即学习' && btn.click());

    /* ---------------- INIT ---------------- */
    function init(){
        const url=location.href;
        if(url.includes('course_ware/course_ware_polyv.aspx')){
            setTimeout(()=>{
                if(!document.querySelector('video')) return;
                createStatusPanel();
                autoSkipPopup();
                preventSleep();
                autoPlayVideo();
                updateStatus('播放中','初始化完成',document.title);
            },2000);
        }
        if(url.includes('course_ware/course_list.aspx')) setTimeout(()=>autoJumpToLearningVideo(),3000);
        if(url.includes('/exam_result.aspx')) setTimeout(clickFirstImmediateLearn,2000);
    }

    init();
})();
