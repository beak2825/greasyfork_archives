// ==UserScript==
// @name         Pixelplanet+
// @namespace    http://tampermonkey.net/
// @version      4.2
// @author       Pixel, join dsc.gg/turkmenlippf
// @description  Customize the PixelPlanet interface with extended personalization options and revert to default.
// @match        *://*.pixuniverse.fun/*
// @match        *://*.pixmap.fun/*
// @match        https://pixgalaxy.fun/*
// @match        *://*.pixworld.net/*
// @match        *://*.pixelworldgame.xyz/*
// @match        *://*.pxgame.xyz/*
// @match        *://*.fuckyouarkeros.fun/*
// @match        *://*.pixelplanet.fun/*
// @match        *://*.pixverse.fun/*
// @match        *://*.pixelroyal.fun/*
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://files.catbox.moe/qb2prb.png
// @downloadURL https://update.greasyfork.org/scripts/516964/Pixelplanet%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/516964/Pixelplanet%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans&display=swap');
    `);

    // Varsayılan stiller
    const defaultCSS = `
        body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            background: #c4c4c4;
        }
        .menu > div { background-color: transparent !important; }
    `;

    // Kullanıcı ayarları
    const settings = {
        buttonColor: '#4CAF50',
        buttonHoverColor: '#ff91a6',
        fontColor: '#000000',
        fontSize: '16',
        fontFamily: 'Arial',
        menuColor: '#ffffff',
        backgroundOpacity: '1',
        backgroundImage: '',
        cursorURL: ''
    };

    // Sayfa yüklendiğinde ayarları uygula
    applyStoredStyles();

    // Buton ekle
    addCustomizationButton();

    // Ayarları yükle ve uygula
    function applyStoredStyles() {
        const storedSettings = loadSettings();
        applyCustomStyles(storedSettings);
    }

    // Ayarları localStorage'dan yükle
    function loadSettings() {
        Object.keys(settings).forEach(key => {
            settings[key] = getStoredValue(key, settings[key]);
        });
        return settings;
    }

    // LocalStorage'dan bir değeri al
    function getStoredValue(key, defaultValue) {
        return localStorage.getItem(key) || defaultValue;
    }

    // LocalStorage'a bir değeri kaydet
    function setStoredValue(key, value) {
        localStorage.setItem(key, value);
    }

    // Stilleri uygula
    function applyCustomStyles({ buttonColor, buttonHoverColor, fontColor, fontSize, fontFamily, menuColor, backgroundOpacity, backgroundImage, cursorURL }) {
        GM_addStyle(`
            body {
                background-color: rgba(255, 255, 255, ${backgroundOpacity});
                background-image: url(${backgroundImage});
                font-size: ${fontSize}px;
                font-family: ${fontFamily};
                color: ${fontColor};
            }
            .actionbuttons, .actionbuttons button,
            .coorbox, .onlinebox, .cooldownbox, #palettebox {
                background-color: ${buttonColor} !important;
                color: white !important;
            }
            .actionbuttons:hover, .actionbuttons button:hover,
            .coorbox:hover, .onlinebox:hover, .cooldownbox:hover, #palettebox:hover {
                background-color: ${buttonHoverColor} !important;
            }
            .customMenu, .modal.USERAREA.show, .modal.HELP.show, .modal.SETTINGS.show {
                background-color: ${menuColor} !important;
                color: ${fontColor};
                border-radius: 10px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            }
            .window.CHAT.show {
                background-image: url(${backgroundImage}) !important;
                background-size: cover;
                background-position: center;
            }
            * {
                cursor: url('${cursorURL}') 16 16, auto !important;
            }
        `);
    }

    // Buton ekle
    function addCustomizationButton() {
        const customizationButton = document.createElement('div');
        customizationButton.id = 'customizationButton';
        customizationButton.className = 'actionbuttons';
        customizationButton.setAttribute('role', 'button');
        customizationButton.innerHTML = `
            <i class="fa fa-plus-square" aria-hidden="true" style="vertical-align: middle; font-size: 19px; color: #FFFFFF;"></i>
        `;
        customizationButton.style.position = 'fixed';
        customizationButton.style.left = '16px';
        customizationButton.style.top = '37%';
        customizationButton.style.zIndex = '9999';
        customizationButton.style.transform = 'translateY(-50%)';

        document.body.appendChild(customizationButton);
        customizationButton.addEventListener('click', showCustomizationPanel);
    }

    // Ayar panelini göster
    function showCustomizationPanel() {
        const panelHTML = `
        <div class="modal SETTINGS show customMenu" style="
            z-index: 9999;
            width: 50%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            border: 1px solid #ccc;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            font-family: 'Pixelify Sans', sans-serif;
        ">
            <h2 style="text-align: center; font-size: 1.4em; margin-bottom: 1em;">Settings</h2>
            <div class="modal-topbtn close" role="button" title="Close" tabindex="-1" style="
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.2em;
                cursor: pointer;
            ">✕</div>
            <div class="content" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="setitem">
                    <label>Button Color:</label>
                    <input type="color" id="buttonColorPicker" value="${settings.buttonColor}" />
                </div>
                <div class="setitem">
                    <label>Button Hover Color:</label>
                    <input type="color" id="buttonHoverColorPicker" value="${settings.buttonHoverColor}" />
                </div>
                <div class="setitem">
                    <label>Font Color:</label>
                    <input type="color" id="fontColorPicker" value="${settings.fontColor}" />
                </div>
                <div class="setitem">
                    <label>Font Size:</label>
                    <input type="number" id="fontSizePicker" min="10" max="30" value="${settings.fontSize}" style="width: 80px;" /> px
                </div>
                <div class="setitem">
                    <label>Font Family:</label>
                    <select id="fontFamilyPicker" style="padding: 5px; border-radius: 5px;">
                        <option value="Arial" ${settings.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                        <option value="Verdana" ${settings.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana</option>
                        <option value="Helvetica" ${settings.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                        <option value="Tahoma" ${settings.fontFamily === 'Tahoma' ? 'selected' : ''}>Tahoma</option>
                        <option value="Pixelify Sans" ${settings.fontFamily === 'Pixelify Sans' ? 'selected' : ''}>Pixelify Sans</option>
                    </select>
                </div>
                <div class="setitem">
                    <label>Menu Color:</label>
                    <input type="color" id="menuColorPicker" value="${settings.menuColor}" />
                </div>
                <div class="setitem">
                    <label>Background Opacity:</label>
                    <input type="range" id="backgroundOpacity" min="0.1" max="1" step="0.1" value="${settings.backgroundOpacity}" />
                </div>
                <div class="setitem">
                    <label>Chat Background Image URL:</label>
                    <input type="text" id="backgroundImage" value="${settings.backgroundImage}" style="width: 100%;" placeholder="Enter URL here" />
                </div>
                <div class="setitem">
                    <label>Custom Cursor URL:</label>
                    <input type="text" id="cursorURL" value="${settings.cursorURL}" style="width: 100%;" placeholder="Enter cursor URL here" />
                </div>
                <button id="saveButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Save</button>
                <button id="resetButton" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Reset to Default</button>
                <button id="exportButton" style="background-color: #2196F3; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Export Settings</button>
                <button id="importButton" style="background-color: #FF9800; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Import Settings</button>

            </div>
        </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = panelHTML;
        document.body.appendChild(modalContainer);

        // Kapatma butonuna tıklandığında paneli kapat
        document.querySelector('.modal-topbtn.close').addEventListener('click', () => {
            modalContainer.remove();
        });

        // Ayarları kaydet
        document.getElementById('saveButton').addEventListener('click', () => {
            settings.buttonColor = document.getElementById('buttonColorPicker').value;
            settings.buttonHoverColor = document.getElementById('buttonHoverColorPicker').value;
            settings.fontColor = document.getElementById('fontColorPicker').value;
            settings.fontSize = document.getElementById('fontSizePicker').value;
            settings.fontFamily = document.getElementById('fontFamilyPicker').value;
            settings.menuColor = document.getElementById('menuColorPicker').value;
            settings.backgroundOpacity = document.getElementById('backgroundOpacity').value;
            settings.backgroundImage = document.getElementById('backgroundImage').value;
            settings.cursorURL = document.getElementById('cursorURL').value;

            saveSettings();
            applyStoredStyles();
            modalContainer.remove();
        });

        // Varsayılan ayarlara sıfırlama
        document.getElementById('resetButton').addEventListener('click', () => {
            resetToDefaultStyles();
            modalContainer.remove();
        });

        // Ayarları dışa aktar
        document.getElementById('exportButton').addEventListener('click', () => {
            const jsonSettings = JSON.stringify(settings);
            const blob = new Blob([jsonSettings], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'settings.json';
            link.click();
        });

        // Ayarları içe aktar
        document.getElementById('importButton').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.click();

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file && file.name.endsWith('.json')) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        try {
                            const importedSettings = JSON.parse(reader.result);
                            Object.keys(importedSettings).forEach(key => {
                                settings[key] = importedSettings[key];
                            });
                            saveSettings();
                            applyStoredStyles();
                        } catch (e) {
                            alert('Failed to import settings.');
                        }
                    };
                    reader.readAsText(file);
                } else {
                    alert('Invalid file format.');
                }
            });
        });

    }

    // Ayarları kaydet
    function saveSettings() {
        Object.keys(settings).forEach(key => {
            setStoredValue(key, settings[key]);
        });
    }

    // Varsayılan ayarlara dön
    function resetToDefaultStyles() {
        settings.buttonColor = rgba(226, 226, 226, 0.80);
        settings.buttonHoverColor = '#ff91a6';
        settings.fontColor = '#000000';
        settings.fontSize = '16';
        settings.fontFamily = 'Arial';
        settings.menuColor = '#ffffff';
        settings.backgroundOpacity = '1';
        settings.backgroundImage = '';
        settings.cursorURL = '';
        saveSettings();
        applyStoredStyles();
    }


})();

(function() {
    'use strict';

    // Buton oluşturma
    let uploadBtn = document.createElement("button");
    uploadBtn.innerHTML = '<img src="https://files.catbox.moe/potman.png" style="width: 16px; height: 16px;">'; // Ataş ikonu
    uploadBtn.style.padding = "5px";
    uploadBtn.style.fontSize = "12px";
    uploadBtn.style.color = "white";
    uploadBtn.style.border = "1px solid black"; // 1px kalınlığında siyah border eklendi
    uploadBtn.style.borderRadius = "3px"; // İsteğe bağlı: Köşeleri yuvarlak yapmak için
    uploadBtn.style.cursor = "pointer";
    uploadBtn.style.display = "flex";
    uploadBtn.style.alignItems = "center";
    uploadBtn.style.justifyContent = "center";
    uploadBtn.style.marginLeft = "5px"; // Sohbet giriş kutusundan biraz uzaklaştırmak için
    uploadBtn.style.backgroundColor = "transparent"; // Arka planı şeffaf yap

    // Dosya seçme input'u
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Butona tıklanınca dosya seç
    uploadBtn.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length === 0) return;

        let file = fileInput.files[0];
        let formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("userhash", "");
        formData.append("fileToUpload", file);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://catbox.moe/user/api.php",
            data: formData,
            onload: function(response) {
                if (response.status === 200) {
                    let link = response.responseText.trim();
                    GM_setClipboard(link);

                    // Sohbet kutusuna linki ekle
                    let chatInput = document.querySelector("input.chtipt");
                    if (chatInput) {
                        chatInput.value = link;
                    }
                } else {
                    console.error("Yükleme başarısız oldu!");
                }
            }
        });
    });

    // Sohbet kutusunu bul ve butonu içine ekle
    let chatInputContainer = document.querySelector("form.chatinput");
    if (chatInputContainer) {
        chatInputContainer.appendChild(uploadBtn);
    } else {
        console.error("Sohbet giriş kutusu bulunamadı!");
    }
})();
let notificationRadius=300;const NOTIFICATION_TIME=2000;let pixelList=[];let canvas;let notifCircles=[];const args=window.location.href.split(',');let globalScale=1;let viewX=parseInt(args[args.length-3]);let viewY=parseInt(args[args.length-2]);const PING_OP=0xB0;const REG_MCHUNKS_OP=0xA3;const PIXEL_UPDATE_OP=0xC1;const REG_CANVAS_OP=0xA0;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}function init(){setTimeout(radarMain);}function showInfo(info){if(info.text.length>0){closeModal();const wrapper=document.createElement('div');wrapper.innerHTML=`<div class="Alert show" id="my_modal"><h2>Останній закріп</h2><p>${info.text}</p><button type="button" id="my_button">OK</button></div>`;document.body.appendChild(wrapper);const button=document.querySelector('#my_button');button.addEventListener('click',closeModal);}}function closeModal(){const modal=document.querySelector('#my_modal');if(modal)modal.remove();}async function loadFile(src){const resp=await fetch(src);const blob=await resp.blob();return new File([blob],'result.png',{type:'image/png',});}async function loadInfo(src){const resp=await fetch(src);return await resp.json();}function worldToScreen(x,y){return[((x-viewX)*globalScale)+(canvas.width/2),((y-viewY)*globalScale)+(canvas.height/2),];}function render(){try{const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);if(globalScale>0){const curTime=Date.now();let index=pixelList.length;while(index>0){index--;let[setTime,x,y,i,j,color]=pixelList[index];const timePassed=curTime-setTime;if(timePassed>NOTIFICATION_TIME){pixelList.splice(index,1);continue;}const[sx,sy]=worldToScreen(x,y).map((z)=>z+globalScale/2);if(sx<0||sy<0||sx>canvas.width||sx>canvas.height){pixelList.splice(index,1);continue;}const notRadius=timePassed/NOTIFICATION_TIME*notificationRadius;const circleScale=notRadius/100;ctx.save();ctx.scale(circleScale,circleScale);ctx.drawImage(notifCircles[color],Math.round(sx/circleScale-100),Math.round(sy/circleScale-100),);ctx.restore();}}}catch(err){console.error(`Render error`,err,);}setTimeout(render,10);}function addPixel(x,y,i,j,color){for(let k=0;k<pixelList.length;k++){if(pixelList[k][3]===i&&pixelList[k][4]===j){pixelList[k][1]=x;pixelList[k][2]=y;pixelList[k][5]=color;return;}}pixelList.unshift([Date.now(),x,y,i,j,color]);}function getPixelFromChunkOffset(i,j,offset,canvasSize){const tileSize=256;const x=i*tileSize-canvasSize/2+offset%tileSize;const y=j*tileSize-canvasSize/2+Math.trunc(offset/tileSize);return[x,y];}function renderPixel(i,j,offset,color){const canvasSize=65536;const[x,y]=getPixelFromChunkOffset(i,j,offset,canvasSize);addPixel(x,y,i,j,color);}function renderPixels({i,j,pixels}){pixels.forEach((pxl)=>{const[offset,color]=pxl;renderPixel(i,j,offset,color);});}function clamp(n,min,max){return Math.max(min,Math.min(n,max));}function updateScale(viewscale){globalScale=viewscale;notificationRadius=clamp(viewscale*10,20,400);}function updateView(val){viewX=val[0];viewY=val[1];}function onWindowResize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}function dehydratePing(){return new Uint8Array([PING_OP]).buffer;}function dehydrateRegMChunks(chunks){const buffer=new ArrayBuffer(1+1+chunks.length*2);const view=new Uint16Array(buffer);view[0]=REG_MCHUNKS_OP;for(let cnt=0;cnt<chunks.length;cnt+=1){view[cnt+1]=chunks[cnt];}return buffer;}function hydratePixelUpdate(data){const i=data.getUint8(1);const j=data.getUint8(2);const pixels=[];let off=data.byteLength;while(off>3){const color=data.getUint8(off-=1);const offsetL=data.getUint16(off-=2);const offsetH=data.getUint8(off-=1)<<16;pixels.push([offsetH|offsetL,color]);}return{i,j,pixels,};}function onBinaryMessage(buffer){if(buffer.byteLength===0)return;const data=new DataView(buffer);const opcode=data.getUint8(0);if(opcode===PIXEL_UPDATE_OP||opcode===145){renderPixels(hydratePixelUpdate(data));}}function dehydrateRegCanvas(canvasId){const buffer=new ArrayBuffer(1+1);const view=new DataView(buffer);view.setInt8(0,REG_CANVAS_OP);view.setInt8(1,Number(canvasId));return buffer;}function onMessage({data:message}){try{if(typeof message!=='string'){onBinaryMessage(message);}}catch(err){console.error(`An error occurred while parsing websocket message ${message}`,err,);}}function socketConnect(i,url,allChunks){const ws=new WebSocket(url);ws.binaryType='arraybuffer';ws.onopen=()=>{console.log(`Socket ${i} opened`);ws.send(dehydrateRegCanvas(0));const chunkids=[];for(let j=17000*i;j<17000*(i+1)&&j<allChunks.length;j++){chunkids.push(allChunks[j]);}ws.send(dehydrateRegMChunks(chunkids));};ws.onmessage=onMessage;ws.onclose=()=>{console.log(`Socket ${i} closed`);setTimeout(()=>{socketConnect(i,url,allChunks)},1000);};ws.onerror=(err)=>{console.error('Socket encountered error, closing socket',err);};setInterval(()=>{if(ws.readyState!==WebSocket.CLOSED){ws.send(dehydratePing());}},23000)}async function radarMain(){canvas=document.createElement('canvas');canvas.style.position='fixed';canvas.style.top='0';canvas.style.left='0';canvas.style.zIndex='0';canvas.style.pointerEvents='none';onWindowResize();const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);document.body.appendChild(canvas);window.addEventListener('resize',onWindowResize);const colors=await loadColors();notifCircles=colors.map((color)=>{const circle=document.createElement('canvas');circle.width=200;circle.height=200;const ctx=circle.getContext('2d');ctx.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},0.5)`;ctx.beginPath();ctx.arc(100,100,100,0,2*Math.PI);ctx.closePath();ctx.fill();return circle;});pixelPlanetEvents.on('setscale',updateScale);pixelPlanetEvents.on('setviewcoordinates',updateView);setTimeout(render,10);const url=`${window.location.protocol==='https:'?'wss:':'ws:'}//${window.location.host}/ws`;const allChunks=[];for(let i=0;i<=255;i++){for(let j=0;j<=255;j++){allChunks.push((i<<8)|j);}}for(let i=0;i<4;i++){setTimeout(()=>{socketConnect(i,url,allChunks)});}}async function loadColors(){const resp=await fetch('/api/me');const data=await resp.json();for(const[key,canvas]of Object.entries(data['canvases'])){if(canvas['ident']===window.location.hash.substring(1,2)){return canvas['colors'];}}return[[255,0,0],[0,255,0],[0,0,255],];}
(function(){'use strict';function f(c){GM_xmlhttpRequest({method:"GET",url:"https://pixelplanet.fun/void",onload:function(r){let d=r.responseText.trim(),m=d.match(/Next void at (.+)/);if(m){let u=new Date(m[1]+" UTC"),n=new Date(),diff=Math.max(0,Math.floor((u-n)/60000));c(`Next void at: ${u.toLocaleString()} (${diff} min left)`)}}})}function s(m){let i=document.querySelector('input[type="text"]');if(i){i.value=m;let e=new Event('input',{bubbles:true});i.dispatchEvent(e);let k=new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true});i.dispatchEvent(k)}}function c(){let i=document.querySelector('input[type="text"]');if(i){let m=i.value.trim().toLowerCase();if(m==="void"){i.value="";f(s);return true}}return false}document.addEventListener("keydown",function(e){if(e.key==="Enter"&&c()){e.preventDefault()}});document.addEventListener("click",function(e){let b=document.querySelector('#sendbtn');if(e.target===b&&c()){e.preventDefault()}})})();

(async function(){"use strict";let fLang=localStorage.getItem("translateFrom")||"auto",tLang=localStorage.getItem("translateTo")||"en",langs={"auto":"Auto","af":"Afrikaans","sq":"Albanian","ar":"Arabic","az":"Azerbaijani","eu":"Basque","be":"Belarusian","bg":"Bulgarian","ca":"Catalan","zh":"Chinese","hr":"Croatian","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","et":"Estonian","fi":"Finnish","fr":"French","cy":"Welsh","gl":"Galician","ka":"Georgian","de":"German","el":"Greek","ht":"Haitian Creole","he":"Hebrew","hu":"Hungarian","is":"Icelandic","id":"Indonesian","ga":"Irish","it":"Italian","ja":"Japanese","ko":"Korean","ku":"Kurdish","lv":"Latvian","lt":"Lithuanian","mk":"Macedonian","ms":"Malay","mt":"Maltese","no":"Norwegian","fa":"Persian","pl":"Polish","pt":"Portuguese","ro":"Romanian","ru":"Russian","sr":"Serbian","sk":"Slovak","sl":"Slovenian","es":"Spanish","sw":"Swahili","sv":"Swedish","tl":"Tagalog","th":"Thai","tr":"Turkish","uk":"Ukrainian","ur":"Urdu","vi":"Vietnamese"};function translateText(text,callback){fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fLang}&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`).then(r=>r.json()).then(d=>callback(d[0].map(i=>i[0]).join(""))).catch(e=>console.error("Translation Error:",e))}function createLangModal(){let m=document.createElement("div");m.id="translateModal";m.style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:15px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.5);display:none;z-index:1000;",m.innerHTML="<h3 style='margin:0 0 10px 0;'>Select Language</h3>";let fSel=document.createElement("select");fSel.innerHTML=Object.keys(langs).map(l=>`<option value="${l}" ${l===fLang?"selected":""}>${langs[l]}</option>`).join(""),m.appendChild(fSel);let tSel=document.createElement("select");tSel.innerHTML=Object.keys(langs).map(l=>`<option value="${l}" ${l===tLang?"selected":""}>${langs[l]}</option>`).join(""),m.appendChild(tSel);let btn=document.createElement("button");btn.innerText="Save",btn.style="margin-left:10px;padding:5px;",btn.onclick=()=>{fLang=fSel.value,tLang=tSel.value,localStorage.setItem("translateFrom",fLang),localStorage.setItem("translateTo",tLang),m.style.display="none"},m.appendChild(btn),document.body.appendChild(m)}function addLangButton(){let chatDiv=document.querySelector("form");if(!chatDiv)return;let btn=document.querySelector("#translateBtn");if(btn)return;btn=document.createElement("button"),btn.id="translateBtn",btn.innerHTML='<img src="https://files.catbox.moe/9jp6tg.png" style="width:16px;height:16px;">',btn.style="padding:5px;font-size:12px;color:white;border:1px solid black;border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-left:5px;background-color:transparent;",btn.onclick=e=>{e.preventDefault(),document.getElementById("translateModal").style.display="block"},chatDiv.appendChild(btn)}function handleTranslation(e){let iBox=document.querySelector("input[type='text']");if(!iBox)return;let msg=iBox.value.trim();msg.startsWith("t!")&&msg.substring(2).trim().length>0?(e.preventDefault(),translateText(msg.substring(2).trim(),t=>{iBox.value=t})):iBox.setAttribute("data-sent","true")}document.addEventListener("keydown",e=>{"Enter"===e.key&&!e.repeat&&(handleTranslation(e),setTimeout(()=>{let iBox=document.querySelector("input[type='text']");iBox&&"true"===iBox.getAttribute("data-sent")&&(iBox.removeAttribute("data-sent"),document.querySelector("button[type='submit']").click())},100))}),setInterval(()=>{let sendBtn=document.querySelector("button[type='submit']");sendBtn&&!sendBtn.hasAttribute("data-listening")&&(sendBtn.setAttribute("data-listening","true"),sendBtn.addEventListener("click",e=>handleTranslation(e)))},1e3),setInterval(addLangButton,2e3),createLangModal()})();
