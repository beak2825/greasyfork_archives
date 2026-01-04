// ==UserScript==
// @name         定时自动关闭网页(Close the page regularly)
// @namespace    https://github.com/yingchen6
// @version      1.8.19.17
// @description  Drag and drop the pop-up window, set the slider for minutes + seconds, the small ball in the upper left corner shows the remaining time, and the theme can be switched.
// @author       yingchen6
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546294/%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5%28Close%20the%20page%20regularly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546294/%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5%28Close%20the%20page%20regularly%29.meta.js
// ==/UserScript==

(function(){
    'use strict';

    let timerId=null;
    let remainingSeconds=0;
    let totalSeconds=0;
    let ball=null;
    let canvas=null;
    let paused=false;
    let theme='green';
    let settingPanel=null;

    const THEMES={
        green:{bg:'rgba(150,180,160,0.6)',progress:'#5B7A63',panel:'rgba(150,180,160,0.5)',label:'#ffffff',btnBg:'#8DA897',btnText:'#fff'},
        bluegray:{bg:'rgba(120,140,160,0.6)',progress:'#3E586C',panel:'rgba(120,140,160,0.5)',label:'#ffffff',btnBg:'#708090',btnText:'#fff'},
        yellow:{bg:'rgba(200,180,120,0.6)',progress:'#A1864D',panel:'rgba(200,180,120,0.5)',label:'#ffffff',btnBg:'#BFA76F',btnText:'#fff'},
        purple:{bg:'rgba(160,140,180,0.6)',progress:'#7A637A',panel:'rgba(160,140,180,0.5)',label:'#ffffff',btnBg:'#8F7090',btnText:'#fff'},
        blackgray:{bg:'rgba(50,50,50,0.7)',progress:'#222',panel:'rgba(60,60,60,0.8)',label:'#ffffff',btnBg:'#444',btnText:'#fff'},
        pink:{bg:'rgba(255,182,193,0.6)',progress:'#FF69B4',panel:'rgba(255,182,193,0.5)',label:'#fff',btnBg:'#FF99CC',btnText:'#fff'}
    };

    function formatTime(seconds){
        const m=Math.floor(seconds/60);
        const s=seconds%60;
        return `${m}:${s.toString().padStart(2,'0')}`;
    }

    function createBall(seconds){
        totalSeconds=remainingSeconds=seconds;
        paused=false;

        if(ball) ball.remove();

        ball=document.createElement("div");
        ball.id="timer-ball";
        Object.assign(ball.style,{
            position:"fixed",top:"20px",left:"20px",width:"120px",height:"120px",
            borderRadius:"50%",zIndex:"999999",cursor:"grab",display:"flex",
            justifyContent:"center",alignItems:"center",userSelect:"none",
            background:THEMES[theme].bg,boxShadow:"0 8px 25px rgba(0,0,0,0.5)"
        });
        document.body.appendChild(ball);

        canvas=document.createElement("canvas");
        canvas.width=120;canvas.height=120;
        canvas.style.position="absolute";canvas.style.top="0";canvas.style.left="0";
        ball.appendChild(canvas);

        const label=document.createElement("div");
        label.id="timer-label";
        Object.assign(label.style,{position:"absolute",color:THEMES[theme].label,fontWeight:"bold",fontSize:"20px"});
        ball.appendChild(label);

        const pauseBtn=document.createElement("div");
        pauseBtn.id="pause-btn";
        Object.assign(pauseBtn.style,{
            position:"absolute",bottom:"10px",fontSize:"16px",color:THEMES[theme].btnText,
            background:THEMES[theme].btnBg,borderRadius:"10px",padding:"6px 12px",cursor:"pointer"
        });
        pauseBtn.textContent="暂停";
        ball.appendChild(pauseBtn);

        pauseBtn.addEventListener("click",e=>{
            e.stopPropagation();
            paused=!paused;
            pauseBtn.textContent=paused?"继续":"暂停";
        });


        let isDown=false,isDragging=false,startX=0,startY=0,downTime=0;
        ball.addEventListener("mousedown",e=>{
            if(e.target===pauseBtn) return;
            isDown=true;isDragging=false;
            startX=e.clientX-ball.offsetLeft;startY=e.clientY-ball.offsetTop;
            downTime=Date.now();
            ball.style.cursor="grabbing";
        });

        document.addEventListener("mousemove",e=>{
            if(!isDown) return;
            const dx=e.clientX-startX-ball.offsetLeft;
            const dy=e.clientY-startY-ball.offsetTop;
            if(Math.sqrt(dx*dx+dy*dy)>5)isDragging=true;
            if(isDragging){
                ball.style.left=(e.clientX-startX)+"px";
                ball.style.top=(e.clientY-startY)+"px";
            }
        });

        document.addEventListener("mouseup",e=>{
            if(!isDown) return;
            isDown=false;
            ball.style.cursor="grab";
            const elapsed=Date.now()-downTime;
            if(!isDragging && elapsed<400){
                showTimeSetting();
            }
        });

        startCountdown(seconds);
    }

    function startCountdown(seconds){
        totalSeconds=remainingSeconds=seconds;
        paused=false;
        if(timerId) clearInterval(timerId);

        timerId=setInterval(()=>{
            if(!paused){
                remainingSeconds--;
                if(remainingSeconds<=0){clearInterval(timerId);window.location.href="about:blank";return;}
                const label=document.getElementById("timer-label");
                if(label) label.textContent=formatTime(remainingSeconds);

                const ctx=canvas.getContext("2d");
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.beginPath();
                ctx.arc(canvas.width/2,canvas.height/2,50,0,2*Math.PI);
                ctx.strokeStyle="rgba(255,255,255,0.2)";
                ctx.lineWidth=10;ctx.stroke();

                const fraction=remainingSeconds/totalSeconds;
                ctx.beginPath();
                ctx.arc(canvas.width/2,canvas.height/2,50,-Math.PI/2,-Math.PI/2+2*Math.PI*fraction);
                ctx.strokeStyle=THEMES[theme].progress;
                ctx.lineWidth=10;ctx.lineCap="round";ctx.stroke();
            }
        },1000);
    }

    function showTimeSetting(){
        if(settingPanel){ settingPanel.remove(); settingPanel=null; }

        const wrapper=document.createElement("div");
        settingPanel=wrapper;
        Object.assign(wrapper.style,{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            gap:"10px",
            padding:"15px",
            borderRadius:"12px",
            background:THEMES[theme].panel,
            position:"fixed",
            top:`${window.innerHeight/2 - 150}px`,
            left:`${window.innerWidth/2 - 150}px`,
            transform:"translate(0,0)",
            zIndex:"1000000",
            cursor:"grab",
            minWidth:"450px"
        });

        wrapper.innerHTML=`
            <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-size:35px;font-weight:bold;color:${THEMES[theme].label}">设 置 倒 计 时           </div>
                <select id="themeSelect" style="border-radius:6px;padding:6px 10px;background:${THEMES[theme].btnBg};color:${THEMES[theme].btnText};border:none;cursor:pointer;">
                    <option value="green">莫兰迪绿</option>
                    <option value="bluegray">蓝灰</option>
                    <option value="yellow">莫兰迪黄</option>
                    <option value="purple">莫兰迪紫</option>
                    <option value="blackgray">黑灰</option>
                    <option value="pink">莫兰迪粉</option>
                </select>
            </div>

            <div style="display:flex;align-items:center;gap:8px;width:100%;">
                <button id="minMinus" style="border:none;border-radius:50%;width:32px;height:32px;line-height:32px;background:${THEMES[theme].btnBg};color:${THEMES[theme].btnText};cursor:pointer;font-weight:bold;font-size:30px;">-</button>
                <input id="timeMin" type="range" min="0" max="360" step="1" value="${Math.floor(remainingSeconds/60)}" style="flex:1;">
                <button id="minPlus" style="border:none;border-radius:50%;width:32px;height:32px;line-height:32px;background:${THEMES[theme].btnBg};color:${THEMES[theme].btnText};cursor:pointer;font-weight:bold;font-size:30px;">+</button>
                <span id="minLabel" style="min-width:70px;text-align:center;font-weight:bold;font-size:30px;color:${THEMES[theme].label};">${Math.floor(remainingSeconds/60)} 分</span>
            </div>

            <div style="display:flex;align-items:center;gap:8px;width:100%;">
                <button id="secMinus" style="border:none;border-radius:50%;width:32px;height:32px;line-height:32px;background:${THEMES[theme].btnBg};color:${THEMES[theme].btnText};cursor:pointer;font-weight:bold;font-size:30px;">-</button>
                <input id="timeSec" type="range" min="0" max="59" step="1" value="${remainingSeconds%60}" style="flex:1;">
                <button id="secPlus" style="border:none;border-radius:50%;width:32px;height:32px;line-height:32px;background:${THEMES[theme].btnBg};color:${THEMES[theme].btnText};cursor:pointer;font-weight:bold;font-size:30px;">+</button>
                <span id="secLabel" style="min-width:70px;text-align:center;font-weight:bold;font-size:30px;color:${THEMES[theme].label};">${remainingSeconds%60} 秒</span>
            </div>

            <div style="display:flex;gap:15px;margin-top:25px;width:100%;">
                <button id="confirmBtn" style="font-size:25px;font-weight:bold;">确认</button>
                <button id="cancelBtn" style="font-size:25px;font-weight:bold;">取消</button>
            </div>
        `;
        document.body.appendChild(wrapper);

        const minInput=wrapper.querySelector("#timeMin");
        const secInput=wrapper.querySelector("#timeSec");
        const minLabel=wrapper.querySelector("#minLabel");
        const secLabel=wrapper.querySelector("#secLabel");

        minInput.addEventListener("input",()=>{minLabel.textContent=minInput.value+" 分";});
        secInput.addEventListener("input",()=>{secLabel.textContent=secInput.value+" 秒";});

  
        wrapper.querySelector("#minMinus").addEventListener("click",()=>{ 
            if(minInput.value>0) minInput.value--; 
            minLabel.textContent=minInput.value+" 分";
        });
        wrapper.querySelector("#minPlus").addEventListener("click",()=>{ 
            if(minInput.value<180) minInput.value++; 
            minLabel.textContent=minInput.value+" 分";
        });
        wrapper.querySelector("#secMinus").addEventListener("click",()=>{ 
            if(secInput.value>0) secInput.value--; 
            secLabel.textContent=secInput.value+" 秒";
        });
        wrapper.querySelector("#secPlus").addEventListener("click",()=>{ 
            if(secInput.value<59) secInput.value++; 
            secLabel.textContent=secInput.value+" 秒";
        });

        function styleBtn(btn){
            Object.assign(btn.style,{
                padding:"8px 14px",border:"none",borderRadius:"8px",
                fontSize:"25px",fontWeight:"bold",
                background:THEMES[theme].btnBg,color:THEMES[theme].btnText,
                cursor:"pointer",flex:"1"
            });
        }
        styleBtn(wrapper.querySelector("#confirmBtn"));
        styleBtn(wrapper.querySelector("#cancelBtn"));

        let isDown=false,startX=0,startY=0;
        wrapper.addEventListener("mousedown",e=>{
            if(["confirmBtn","cancelBtn","themeSelect","timeMin","timeSec"].includes(e.target.id) || e.target.tagName==="INPUT") return;
            isDown=true;
            startX=e.clientX-wrapper.offsetLeft;
            startY=e.clientY-wrapper.offsetTop;
            wrapper.style.cursor="grabbing";
        });
        document.addEventListener("mousemove",e=>{
            if(!isDown) return;
            wrapper.style.left=(e.clientX-startX)+"px";
            wrapper.style.top=(e.clientY-startY)+"px";
            wrapper.style.transform="translate(0,0)";
        });
        document.addEventListener("mouseup",()=>{isDown=false; wrapper.style.cursor="grab";});

        const themeSelect=wrapper.querySelector("#themeSelect");
        themeSelect.value=theme;
        themeSelect.addEventListener("change",()=>{ theme=themeSelect.value; });

        wrapper.querySelector("#confirmBtn").addEventListener("click",()=>{ 
            const min=parseInt(minInput.value);
            const sec=parseInt(secInput.value);
            remainingSeconds=totalSeconds=min*60+sec;
            wrapper.remove(); settingPanel=null;
            createBall(totalSeconds);
        });

        wrapper.querySelector("#cancelBtn").addEventListener("click",()=>{wrapper.remove(); settingPanel=null;});
    }

    function registerMenu(){
        if(typeof GM_registerMenuCommand==="undefined") return;
        GM_registerMenuCommand("设置自动关闭时长", showTimeSetting);
    }
    setTimeout(registerMenu, 500);

})();
