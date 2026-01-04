// ==UserScript==
// @name         Reading Plus Ultimate GUI v3
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  RP auto-answer, fast timer, draggable GUI, rainbow text, and persistent color customizer!
// @author       Random
// @match        *://student.readingplus.com/seereader/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544816/Reading%20Plus%20Ultimate%20GUI%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/544816/Reading%20Plus%20Ultimate%20GUI%20v3.meta.js
// ==/UserScript==

function set(){try{window.firstName="Hello",window.lastName="World",window.schoolName="https://discord.gg/spp6aEF",window.grade="2005",window.avatar="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/198142ac-f410-423a-bf0b-34c9cb5d9609/dbtif5j-60306864-d6b7-44b6-a9ff-65e8adcfb911.png/v1/fill/w_512,h_512,q_80,strp/discord_metro_icon_by_destuert_dbtif5j-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD01MTIiLCJwYXRoIjoiXC9mXC8xOTgxNDJhYy1mNDEwLTQyM2EtYmYwYi0zNGM5Y2I1ZDk2MDlcL2RidGlmNWotNjAzMDY4NjQtZDZiNy00NGI2LWE5ZmYtNjVlOGFkY2ZiOTExLnBuZyIsIndpZHRoIjoiPD01MTIifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.r0rJ0qqNc9Wo-X9k4MxNxL4lqnJpmRAw9AJGvdI0a7s",document.body.querySelector("#header-student-profile-class").innerHTML=schoolName,document.body.querySelector("#header-student-profile-user-text").innerHTML=firstName+" "+lastName}catch(e){}}async function contex(){switch(location.pathname.split("/").pop()){case"startRA":if(init(await fetch("https://student.readingplus.com/seereader/api/ra/getWord.json").then(e=>e.json())),window.debug_mode=!1,!window.debug){let e=[];e.push('DEBUG MODE : <input type="checkbox"></input>'),e.push('<button onclick="location.reload()">Reload</button>'),window.debug=document.createElement("div"),debug.innerHTML=e.join("<br>"),debug.className="debug",document.body.append(debug),debug.querySelectorAll("input")[0].addEventListener("input",function(){window.debug_mode=this.checked})}}}function star(e){return console.log(e),e.flashCount&&window.debug_mode?null:e}function init(e){if(!e)return e;if(e.section&&e.section.data&&(window.story=e.section.data,story.stories&&story.stories.forEach(function(e,t){if(e.locked)return;stories.push(e);let n=story.stories.map(e=>e.storyId);stories_lowest=n.indexOf(Math.min(...n))}),story.rate&&(e.section.data.rate=window.rate||500),story.choiceList&&(e.section.data.cluesAvailable=!0,e.section.data.inReread=!0,e.section.data.rereadsAvailable=5,posible_answer(story.storyId,story.questionId,JSON.parse(JSON.stringify(story.choiceList)).map(e=>e.status.status.includes("inco")?{text:"//"}:e).map(e=>e.text)))),e.user&&(e.user.firstName=firstName,e.user.lastName=lastName,e.user.schoolName=schoolName,e.user.grade=grade,e.user.avatar="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/198142ac-f410-423a-bf0b-34c9cb5d9609/dbtif5j-60306864-d6b7-44b6-a9ff-65e8adcfb911.png/v1/fill/w_512,h_512,q_80,strp/discord_metro_icon_by_destuert_dbtif5j-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD01MTIiLCJwYXRoIjoiXC9mXC8xOTgxNDJhYy1mNDEwLTQyM2EtYmYwYi0zNGM5Y2I1ZDk2MDlcL2RidGlmNWotNjAzMDY4NjQtZDZiNy00NGI2LWE5ZmYtNjVlOGFkY2ZiOTExLnBuZyIsIndpZHRoIjoiPD01MTIifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.r0rJ0qqNc9Wo-X9k4MxNxL4lqnJpmRAw9AJGvdI0a7s"),e.word){words[e.word]||log.warn(`No synonyms found for the word "${e.word}"`);let t=words[e.word]||[],n=t.n||[],o=t.v||[],i=e.flashList.map(e=>e.word).filter(e=>n.includes(e)).join(", ");console.log(i),log.plain({word:e.word,Synonyms:i||[...n,...o].join(", ")});let s=[...e.hint1List,...e.hint2List].map(e=>e.pre+" "+e.word.bold().fontcolor("lightgreen")+" "+e.post).join(",<br>");log.plain(s)}return e.status&&(e.status.message="Hello world"),e}let hide_btn=document.body.appendChild(document.createElement`button`);hide_btn.innerHTML="X",hide_btn.style="position: fixed;\n    top: 0;\n    right: 0;\n    background: #00000085;\n    padding: 5px;\n    border-radius: 4px;\n    border: solid 1px black;\n    box-shadow: 0 0 5px black;\n    font-family: monospace;\n    color: red;\n    margin: 10px;\n    font-weight: 900;\n    text-shadow: 0 0 1px red;",hide_btn.addEventListener("click",e=>log.display()),set(),window.words=!1;let getWords=async function(){if(window.words)return;var e=Date.now();window.words=await fetch("https://master.tus.io/files/6161edd4614c06b4231c4bb8f61cb697+iiikzgwzne35FqNm9UTPRu_0e1d4wYEJWEUOfOzHCNjEq9Vfeox35oOuhQksc3bnR0BMSOpZWYTB8tTKZ8yaTak_8A4.ehnJdQnpK10lkoxtfbOWwkhs1L8CX6BzTjqo").then(e=>e.json());let t=(Date.now()-e)/1e3;console.log(t),contex()};getWords(),window.rate=parseInt(localStorage.rate)||500,window.modules=new Map,modules.set("cls",function(e){log.properties.innerHTML=""}),modules.set("display",function(e){log.properties.style.display=e}),modules.set("log",function(e){log.plain(e)}),modules.set("rate",function(e){window.rate=parseInt(e)||500,localStorage.rate=rate}),modules.set("contex",function(e){contex()}),modules.set("lowest",function(e){try{document.querySelectorAll("div[data-v-4b4243a9].story")[stories_lowest].click()}catch(e){log.error(r.toString())}}),modules.set("eval",function(value){try{log.plain(eval(contex.get("eval")))}catch(e){log.error(e.toString())}});class Log{constructor(){this.parent=document.createElement("div"),this.properties=document.createElement("div"),this.input=document.createElement("input"),this.enter=document.createElement("button")}init(){document.body.append(log.parent),document.body.style.margin="0",this.enter.innerHTML="Enter",this.style(this.enter,{background:"#00000085",color:"white",margin:"7px",padding:"5px","border-radius":"4px",border:"solid 1px black","box-shadow":"0 0 5px black"}),this.style(this.parent,{background:"rgb(36, 36, 36)","max-height":"48%",height:"fit-content",width:"76%",top:"150px",display:"block","text-align":"left","z-index":"9999","overflow-y":"auto",position:"fixed",left:"50%","font-size":"10px",padding:"3px","border-radius":"6px",transform:"translate(-50%, -50%)",border:"solid 1px black","box-shadow":"0 0 20px"}),this.style(this.input,{background:"#0000003d",width:"87%",border:"none",outline:"none",color:"white",height:"21px",fontFamily:"monospace"}),log.parent.append(this.properties,this.input,this.enter),this.input.addEventListener("keydown",e=>{13===e.keyCode&&(console.log(this),this.exec())}),this.enter.addEventListener("click",e=>this.exec())}exec(){let e=this.input.value;this.input.value="";let t=this.argument(e),n=[];t[2].forEach(e=>{n.push(...e,this._span(", "))}),this.append(...n),this.onmessage(e,t),this.input.value=""}style(e,t={}){Object.keys(t).forEach(n=>{e.style[n]=t[n]})}scroll(){this.parent.scrollTop=this.parent.scrollHeight}parse(e){return"object"==typeof e?Object.keys(e).map(t=>t+" => "+e[t]).join(",<br>"):JSON.stringify(e)}display(){let e=log.parent.style.display;log.parent.style.display="block"==e?"none":"block"}argument(e){var t=new Map,n=[];let o=/([\_A-Za-z]+).*=.*"(.*)"/;e.split(/,/gm).map(e=>o.exec(e)).forEach(e=>t.set(e[1],e[2]));return t.forEach((e,t)=>{let o=this._span(t,"skyblue"),i=this._span(" = ","gold"),s=this._span(`"${e}"`,"#ea8752");n.push([o,i,s])}),[t,e,n]}onmessage(e,t){let n=t[0];modules.forEach(function(e,t){n.has(t)&&e(n.get(t))})}_span(e,t="white"){let n=document.createElement("span");return n.innerHTML=e,n.style.color=t,n.style.position="reletive",n.style.width="-webkit-fill-available",n}span(e="Hello World.",t="white",n="transparent",o="none"){let i=document.createElement("div");return i.innerHTML="string"!=typeof e?this.parse(e):e,i.style.background=n,i.style.color=t,i.style.position="reletive",i.style.width="-webkit-fill-available",i.style.borderBottom="solid 1px"+o,i.style.padding="4px",i}append(...e){let t=document.createElement("div");t.style.position="reletive",t.style.width="-webkit-fill-available",t.style.fontFamily="monospace",t.append(...e),this.properties.append(t),this.scroll()}warn(e){let t=this.span(e,"#e0e0e0cc","#ffd70063","#ffd7007a");this.append(t)}error(e){let t=this.span(e,"#e0e0e0cc","#9405054a","#ff00005c");this.append(t)}plain(e){let t=this.span(e,"#e0e0e0cc","transparent","#e0e0e0cc");this.append(t)}}window.log=new Log,log.init();let posible_answer=async function(t,n,o){function i(e){e=e.map(e=>e.map(e=>e.replace(/\./gm,""))),a.forEach(function(t,n){e.forEach(function(e){let o=e.join(" ");o=o.replace(/\./gm,""),h[n]||(h[n]=0),t.includes(o)&&(h[n]+=1)})})}if(!window.storyData){let e=await fetch(`https://content.readingplus.com/rp-content/ssr/${t}.json`);window.storyData=await e.json(),log.plain("About the story".bold().fontcolor("gold")+" => "+storyData.aboutTheStory)}let r=storyData.questionList.filter(e=>e.id===n)[0],a=o,l=[],d=[];var u=!1;for(e of r.excerptList)for(s of e.sectionList)for(p of s.paragraphList)for(c of p.sentenceList)if(1==c.clue)if(8==r.type)l.push(c.words.join(" "));else for(w of c.words)l.push(w);else for(w of c.words)d.push(w);if(8==r.type&&log.plain(l),0===l.length){if(log.warn("There is no clues for this question"),0===d.length)return u=!0,log.warn("There is no experts for this question");l=d}let h=[];const f=(e,t=2)=>e.length>t?[e.slice(0,t),...f(e.slice(t),t)]:[e];i(f(l)),0===h.filter(e=>e).length&&(u=!0,i(f(l,1)));let b=h.indexOf(Math.max(...h)),m=document.querySelectorAll("ul[data-v-4c0b7157] li > div")[b];u?u&&(log.error("Possible answer => "+a[b]),m.style.background="#ffdf0045"):(log.plain("Possible answer => "+a[b]),setTimeout(function(){m.click()},1e3)),log.plain(h.map((e,t)=>`${"ABCDEF"[t]} => ${e}%`).join(",<br>"))};window.stringify=JSON.stringify,JSON.stringify=function(e){return stringify(star(e))},window.stories=[],window.stories_lowest=null,window.parse=JSON.parse,window.JSON.parse=function(e){var t;try{t=init(parse(e)),console.log(t)}catch(t){return console.log(t),e}return t},document.head.appendChild(document.createElement`style`).innerHTML="::-webkit-scrollbar {\n  width: 7px;\n  height: 7px;\n}\n::-webkit-scrollbar-button {\n  width: 0px;\n  height: 0px;\n}\n::-webkit-scrollbar-thumb {\n  background: #333333;\n  border: 0px none #ffffff;\n  border-radius: 0px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: #1c1c1c;\n}\n::-webkit-scrollbar-thumb:active {\n  background: #1f1f1f;\n}\n::-webkit-scrollbar-track {\n  background: #121212;\n  border: 0px none #ffffff;\n  border-radius: 0px;\n}\n::-webkit-scrollbar-track:hover {\n  background: #0d0d0d;\n}\n::-webkit-scrollbar-track:active {\n  background: #050505;\n}\n::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.debug{\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #000000a1;\n  padding: 10px;\n  font-size: 15px;\n  color: white;\n  margin: 10px;\n  font-family: monospace;\n  text-align: left;\n  z-index: 1000;\n  border-radius: 10px;\n}";let send=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(e){var t;try{t=JSON.parse(e)}catch(e){}return t&&t.screenList&&(t.screenList.forEach(function(e,n){t.screenList[n]&&(t.screenList[n].secondsTaken=50,t.screenList[n].pauseSeconds=0)}),e=JSON.stringify(t)),send.apply(this,[e])};

(function () {
    'use strict';

    const userInfo = {
        firstName: "Hello",
        lastName: "World",
        schoolName: "https://discord.gg/spp6aEF",
        grade: "2005",
    };

    const SAVED_COLOR_KEY = "rpGuiColor";

    function setUserInfo() {
        const schoolElem = document.querySelector("#header-student-profile-class");
        const userElem = document.querySelector("#header-student-profile-user-text");
        if (schoolElem) schoolElem.innerHTML = userInfo.schoolName;
        if (userElem) userElem.innerHTML = userInfo.firstName + " " + userInfo.lastName;
    }
    setTimeout(setUserInfo, 3000);

    // XMLHttpRequest override
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        try {
            if (body) {
                let json = JSON.parse(body);
                if (json?.screenList) {
                    json.screenList.forEach(s => {
                        s.secondsTaken = 1;
                        s.pauseSeconds = 0;
                    });
                    body = JSON.stringify(json);
                }
            }
        } catch {}
        return origSend.call(this, body);
    };

    const style = document.createElement('style');
    style.textContent = `
    @keyframes rainbowText {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
    .rainbow-text {
        background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet, red);
        background-size: 1400% 1400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbowText 10s ease infinite;
        font-weight: bold;
    }
    .gui-log {
        background-color: #110000;
        border: 2px solid red;
        color: red;
        font-family: Arial Black, sans-serif;
        font-size: 14px;
        line-height: 1.3;
        padding: 10px;
        margin-top: 15px;
        height: 150px;
        overflow-y: auto;
        white-space: pre-wrap;
        border-radius: 10px;
        box-shadow: 0 0 10px red;
    }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    Object.assign(gui.style, {
        position: 'fixed',
        top: '50px',
        right: '50px',
        width: '420px',
        backgroundColor: 'black',
        color: 'red',
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '20px',
        border: '5px solid red',
        borderRadius: '20px',
        boxShadow: '0 0 30px red',
        zIndex: '999999',
        resize: 'both',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
    });

    const titleBar = document.createElement('div');
    Object.assign(titleBar.style, {
        cursor: 'move',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        padding: '5px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    });
    const titleText = document.createElement('span');
    titleText.textContent = "📕 READING PLUS TOOLS";
    titleText.classList.add('rainbow-text');
    titleBar.appendChild(titleText);
    gui.appendChild(titleBar);

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '0 15px',
    });

    function logToGui(text) {
        const time = new Date().toLocaleTimeString();
        logBox.textContent += `[${time}] ${text}\n`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    function autoAnswerReading() {
        logToGui("Auto-answer Reading triggered...");
        const answers = document.querySelectorAll('.reading-answer');
        let clicked = false;
        answers.forEach(a => {
            if (a.dataset.correct?.toLowerCase() === "true") {
                a.click();
                logToGui("✔️ Clicked reading answer: " + a.textContent.trim());
                clicked = true;
            }
        });
        if (!clicked) logToGui("❌ No reading answer found.");
    }

    function autoAnswerVocab() {
        logToGui("Auto-answer Vocab triggered...");
        const answers = document.querySelectorAll('.vocab-question .answer-button');
        let clicked = false;
        answers.forEach(a => {
            if (a.dataset.correct?.toLowerCase() === "true") {
                a.click();
                logToGui("✔️ Clicked vocab answer.");
                clicked = true;
            }
        });
        if (!clicked) logToGui("❌ No vocab answer found.");
    }

    function autoAnswerVisualSkills() {
        logToGui("Auto-answer Visual Skills triggered...");
        const answers = document.querySelectorAll('.visual-skills-question .answer-button');
        let clicked = false;
        answers.forEach(a => {
            if (a.dataset.correct?.toLowerCase() === "true") {
                a.click();
                logToGui("✔️ Clicked visual skills answer.");
                clicked = true;
            }
        });
        if (!clicked) logToGui("❌ No visual skills answer found.");
    }

    const buttons = [
        { label: "📖 Auto Reading Answer", action: autoAnswerReading },
        { label: "🚀 Auto Vocab", action: autoAnswerVocab },
        { label: "🎯 Auto Visual Skills", action: autoAnswerVisualSkills },
    ];
    buttons.forEach(({ label, action }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            backgroundColor: 'black',
            color: 'red',
            border: '3px solid red',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 10px red',
            transition: '0.2s',
            userSelect: 'none',
        });
        btn.onmouseenter = () => btn.style.backgroundColor = '#330000';
        btn.onmouseleave = () => btn.style.backgroundColor = 'black';
        btn.onclick = () => {
            action();
            btn.style.backgroundColor = '#660000';
            setTimeout(() => { btn.style.backgroundColor = 'black'; }, 300);
        };
        btnContainer.appendChild(btn);
    });
    gui.appendChild(btnContainer);

    const logBox = document.createElement('pre');
    logBox.className = 'gui-log';
    logBox.textContent = "Logs will appear here...\n";
    gui.appendChild(logBox);

    const colorLabel = document.createElement('label');
    colorLabel.textContent = "🎨 Color: ";
    colorLabel.style.margin = "10px 15px";
    colorLabel.style.fontSize = "16px";
    colorLabel.style.display = "flex";
    colorLabel.style.alignItems = "center";
    colorLabel.style.gap = "10px";

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.width = "40px";
    colorPicker.value = localStorage.getItem(SAVED_COLOR_KEY) || "#ff0000";
    colorPicker.oninput = () => {
        const c = colorPicker.value;
        updateGuiColor(c);
        localStorage.setItem(SAVED_COLOR_KEY, c);
    };
    colorLabel.appendChild(colorPicker);
    gui.appendChild(colorLabel);

    function updateGuiColor(color) {
        gui.style.borderColor = color;
        gui.style.boxShadow = `0 0 30px ${color}`;
        document.querySelectorAll('.gui-log, button').forEach(el => {
            el.style.borderColor = color;
            el.style.boxShadow = `0 0 10px ${color}`;
            el.style.color = color;
        });
    }

    updateGuiColor(colorPicker.value);
    document.body.appendChild(gui);

    let dragging = false, offsetX = 0, offsetY = 0;
    titleBar.addEventListener('mousedown', e => {
        dragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });
    window.addEventListener('mouseup', () => {
        dragging = false;
        document.body.style.userSelect = 'auto';
    });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
        gui.style.right = 'auto';
        gui.style.bottom = 'auto';
    });

    window.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
            e.preventDefault();
            gui.style.display = gui.style.display === 'none' ? 'flex' : 'none';
        }
    });

    logToGui(`User: ${userInfo.firstName} ${userInfo.lastName}`);
    logToGui(`School: ${userInfo.schoolName}`);
    logToGui(`Grade: ${userInfo.grade}`);
})();
