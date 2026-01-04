// ==UserScript==
// @name         Drawaria ideas and art generator (Drawing Tools Only)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced artistic generative effects including ENHANCED Pixel Art Characters for Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536407/Drawaria%20ideas%20and%20art%20generator%20%28Drawing%20Tools%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536407/Drawaria%20ideas%20and%20art%20generator%20%28Drawing%20Tools%20Only%29.meta.js
// ==/UserScript==

(() => {
    'use_strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    let drawing_active = false;
    let previewCanvas = document.createElement('canvas');
    let originalCanvas = null;
    var sprite_data_pixel_art;
    let cw = 0;
    let ch = 0;
    let executionLine = [];
    let global_frame_count = 0;


    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getRandomColor(saturation = 100, lightness = 50) {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    function sendDrawCmd(socket, start, end, color, thickness, isEraser = false, algo = 0) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("Bot socket not open.");
            return false;
        }
        const p1x = Math.max(0,Math.min(1,start[0])), p1y=Math.max(0,Math.min(1,start[1]));
        const p2x = Math.max(0,Math.min(1,end[0])), p2y=Math.max(0,Math.min(1,end[1]));
        const gT = isEraser ? thickness : 0-thickness;
        socket.send(`42["drawcmd",0,[${p1x},${p1y},${p2x},${p2y},${isEraser},${gT},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        return true;
    }

    async function drawPixel(socket, x, y, size, color, draw_delay) {
        const endX = x + size * 0.0001;
        const endY = y + size * 0.0001;
        // Thickness should be proportional to the "pixel size" on the normalized canvas
        // A good approximation for thickness is pixelSize * average_canvas_dimension * a_scaling_factor
        // The scaling factor might need adjustment. Let's try 0.8 to 1.0 of the pixel's dimension.
        const effectiveThickness = size * Math.min(cw, ch) * 0.9; // Make pixel "filled"

        if (!sendDrawCmd(socket, [x, y], [endX, endY], color, effectiveThickness )) {
            drawing_active = false;
            return false;
        }
        if (draw_delay > 0) await delay(draw_delay);
        return true;
    }

    // --- Simple Pixel Font for Text Drawing ---
    const pixelFont = {
        'A': ["0110", "1001", "1111", "1001", "1001"],
        'B': ["1110", "1001", "1110", "1001", "1110"],
        'C': ["0110", "1000", "1000", "1000", "0110"],
        'D': ["1110", "1001", "1001", "1001", "1110"],
        'E': ["1111", "1000", "1110", "1000", "1111"],
        'G': ["0110", "1000", "1011", "1001", "0111"],
        'H': ["1001", "1001", "1111", "1001", "1001"],
        'I': ["111", "010", "010", "010", "111"],
        'K': ["1001", "1010", "1100", "1010", "1001"],
        'L': ["1000", "1000", "1000", "1000", "1111"],
        'M': ["10001", "11011", "10101", "10001", "10001"],
        'N': ["1001", "1101", "1011", "1001", "1001"],
        'O': ["0110", "1001", "1001", "1001", "0110"],
        'P': ["1110", "1001", "1110", "1000", "1000"],
        'R': ["1110", "1001", "1110", "1010", "1001"],
        'S': ["0111", "1000", "0110", "0001", "1110"],
        'U': ["1001", "1001", "1001", "1001", "0110"],
        'V': ["10001", "10001", "01010", "01010", "00100"],
        ' ': ["000", "000", "000", "000", "000"] // Space
        // Add more characters as needed
    };
    const charHeight = 5; // All font characters are 5 pixels tall

    async function drawPixelText(socket, text, startX, startY, charPixelSize, color, textPixelDelay, letterSpacingFactor = 0.8) {
        let currentX = startX;
        text = text.toUpperCase();

        for (const char of text) {
            if (!drawing_active) return;
            const charData = pixelFont[char];
            if (charData) {
                let charWidth = 0;
                for (let y = 0; y < charHeight; y++) {
                    if (!drawing_active) return;
                    const row = charData[y];
                    charWidth = Math.max(charWidth, row.length);
                    for (let x = 0; x < row.length; x++) {
                        if (!drawing_active) return;
                        if (row[x] === '1') {
                            if (!await drawPixel(socket, currentX + x * charPixelSize, startY + y * charPixelSize, charPixelSize, color, textPixelDelay)) return;
                        }
                    }
                }
                currentX += (charWidth + letterSpacingFactor) * charPixelSize; // Move to next char position
            } else { // If char not in font, just add space
                currentX += (3 + letterSpacingFactor) * charPixelSize; // Default space for unknown char
            }
        }
    }


    function loadImage(url) {
        originalCanvas = document.getElementById('canvas');
        if (!originalCanvas) { console.error("Original canvas not found!"); alert("Error: Game canvas not found."); return; }
        var img = new Image();
        img.onload = () => {
            previewCanvas.width = originalCanvas.width; previewCanvas.height = originalCanvas.height;
            cw = previewCanvas.width; ch = previewCanvas.height;
            var ctx = previewCanvas.getContext('2d');
            let sW=img.width,sH=img.height,sF=1; if(img.width>cw||img.height>ch)sF=Math.min(cw/img.width,ch/img.height);
            sW=img.width*sF;sH=img.height*sF; const oX=(cw-sW)/2;const oY=(ch-sH)/2;
            ctx.clearRect(0,0,cw,ch);ctx.drawImage(img,oX,oY,sW,sH);
            try{sprite_data_pixel_art=ctx.getImageData(0,0,cw,ch).data;console.log('Image loaded.');alert('Image loaded!');}
            catch(e){console.error("Error image data:",e);alert("Error processing image.");sprite_data_pixel_art=null;}
        };
        img.onerror=()=>{console.error("Failed image load:",url);alert("Failed image load.");};
        img.crossOrigin='anonymous';img.src=url;
    }

    function generateImageDrawingCommands(pixelStep,brushThickness,offsetPercent,forceBW=false){
        if(!sprite_data_pixel_art){alert('No image data.');return[];} executionLine=[];
        const step=Math.max(1,parseInt(pixelStep,10)),thick=parseInt(brushThickness,10);
        const oX=parseInt(offsetPercent.x,10)/100*cw,oY=parseInt(offsetPercent.y,10)/100*ch;
        for(let y=0;y<ch;y+=step){let lS=null,lC=null;for(let x=0;x<cw;x+=step){
            if(y>=ch||x>=cw)continue;let idx=(y*cw+x)*4;if(idx+3>=sprite_data_pixel_art.length)continue;
            let r=sprite_data_pixel_art[idx],g=sprite_data_pixel_art[idx+1],b=sprite_data_pixel_art[idx+2],a=sprite_data_pixel_art[idx+3];
            let curCol=`rgb(${r},${g},${b})`;if(forceBW){const gs=(r+g+b)/3;curCol=gs<128?'rgb(0,0,0)':'rgb(255,255,255)';}
            const curP=[(x+oX)/cw,(y+oY)/ch];
            if(a>128){if(!lS){lS=[...curP];lC=curCol;}else if(curCol!==lC){const eP=[((x-step)+oX)/cw,(y+oY)/ch];if(Math.hypot(eP[0]-lS[0],eP[1]-lS[1])*cw>0.5)executionLine.push({pos1:lS,pos2:eP,color:lC,thickness:thick});lS=[...curP];lC=curCol;}if(x+step>=cw&&lS){if(Math.hypot(curP[0]-lS[0],curP[1]-lS[1])*cw>0.5)executionLine.push({pos1:lS,pos2:curP,color:lC,thickness:thick});lS=null;}}else{if(lS){const eP=[((x-step)+oX)/cw,(y+oY)/ch];if(Math.hypot(eP[0]-lS[0],eP[1]-lS[1])*cw>0.5)executionLine.push({pos1:lS,pos2:eP,color:lC,thickness:thick});lS=null;}}}
            if(lS){const eXV=cw-(cw%step||step);const eP=[(eXV>=step?(eXV-step+oX)/cw:(oX/cw)),(y+oY)/ch];if(Math.hypot(eP[0]-lS[0],eP[1]-lS[1])*cw>0.5)executionLine.push({pos1:lS,pos2:eP,color:lC,thickness:thick});lS=null;}}
        console.log(`Image commands: ${executionLine.length}.`);return executionLine;
    }

    async function executeDrawingCommands(commands,socket){if(!socket||socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");drawing_active=false;return;}drawing_active=true;console.log(`Drawing ${commands.length} lines.`);const dD=parseInt(EL('#engine_draw_delay').value,10)||10;for(let i=0;i<commands.length;i++){if(!drawing_active){console.log("Drawing stopped.");break;}let l=commands[i];if(!sendDrawCmd(socket,l.pos1,l.pos2,l.color,l.thickness)){console.warn("Socket closed.");break;}if(dD>0)await delay(dD);}drawing_active=false;console.log('Finished drawing.');}
    async function botClearCanvas(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}sendDrawCmd(window.___BOT.conn.socket,[0.01,0.5],[0.99,0.5],"#FFFFFF",2000,false);console.log("Whiteout attempted.");}

    // --- Existing "Good" Effects ---
    async function directionalHueBlast(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const s=window.___BOT.conn.socket;console.log("Starting Directional Hue Blast...");const d=[{s:[0.5,0],e:[0.5,1]},{s:[0.5,1],e:[0.5,0]},{s:[0,0.5],e:[1,0.5]},{s:[1,0.5],e:[0,0.5]}];for(let i=0;i<100&&drawing_active;i++){for(let D of d){if(!drawing_active)break;let t=i/100,x=D.s[0]+(D.e[0]-D.s[0])*t,y=D.s[1]+(D.e[1]-D.s[1])*t;if(!sendDrawCmd(s,[x,y],[x+0.001,y+0.001],`hsl(${i*3.6},100%,50%)`,10+i*0.5))break;}if(!drawing_active)break;await delay(40);}drawing_active=false;console.log("Directional Hue Blast finished.");}
    async function colorFestival(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const S=window.___BOT.conn.socket;console.log("Starting Color Festival...");const nS=120,fD=60,sD=10;for(let i=0;i<nS&&drawing_active;i++){let x=Math.random()*0.8+0.1,y=Math.random()*0.8+0.1,bS=Math.random()*0.08+0.03,c=getRandomColor(90,55),t=Math.floor(Math.random()*10)+4,type=Math.floor(Math.random()*4),ok=true;if(type===0){for(let j=0;j<bS*100&&ok&&drawing_active;j+=t/2){let lY=y-bS/2+(j/100);if(lY>y+bS/2)break;ok=sendDrawCmd(S,[x-bS/2,lY],[x+bS/2,lY],c,t);if(sD>0)await delay(sD);}}else if(type===1){const s=bS;ok=sendDrawCmd(S,[x,y-s/2],[x+s/2,y+s/2],c,t);if(ok&&drawing_active&&sD>0)await delay(sD);if(!ok||!drawing_active)break;ok=sendDrawCmd(S,[x+s/2,y+s/2],[x-s/2,y+s/2],c,t);if(ok&&drawing_active&&sD>0)await delay(sD);if(!ok||!drawing_active)break;ok=sendDrawCmd(S,[x-s/2,y+s/2],[x,y-s/2],c,t);}else if(type===2){const s=bS*0.7;for(let k=0;k<8&&ok&&drawing_active;k++){const a=(k/8)*2*Math.PI;ok=sendDrawCmd(S,[x,y],[x+s*Math.cos(a),y+s*Math.sin(a)],c,t);if(sD>0)await delay(sD);}}else{let lX=x,lY=y;for(let k=0;k<=20&&ok&&drawing_active;k++){const a=(k/20)*2*2*Math.PI,r=(k/20)*bS,cX=x+r*Math.cos(a),cY=y+r*Math.sin(a);if(k>0)ok=sendDrawCmd(S,[lX,lY],[cX,cY],c,t);lX=cX;lY=cY;if(sD>0)await delay(sD);}}if(!ok||!drawing_active)break;if(fD>0)await delay(fD);}drawing_active=false;console.log("Color Festival finished.");}
    async function lightSpeedFireworks(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const S=window.___BOT.conn.socket;console.log("Starting Light Speed Fireworks...");const nF=8,fD=600;for(let i=0;i<nF&&drawing_active;i++){let sX=Math.random()*0.6+0.2,sY=0.95,pX=sX+(Math.random()-0.5)*0.3,pY=Math.random()*0.4+0.05,lC=getRandomColor(100,70),lT=6,pC=40+Math.floor(Math.random()*40),pT=4+Math.floor(Math.random()*4),lS=25,lSD=4,ePD=8,ok=true;for(let s=0;s<lS&&ok&&drawing_active;s++){let pr=s/lS,nP=(s+1)/lS,cX=sX+(pX-sX)*pr,cY=sY+(pY-sY)*pr,nX=sX+(pX-sX)*nP,nY=sY+(pY-sY)*nP;ok=sendDrawCmd(S,[cX,cY],[nX,nY],lC,lT);if(lSD>0)await delay(lSD);}if(!ok||!drawing_active)break;const eH=Math.random()*360;for(let j=0;j<pC&&ok&&drawing_active;j++){const a=Math.random()*2*Math.PI,d=Math.random()*0.20+0.05,eX=pX+d*Math.cos(a),eY=pY+d*Math.sin(a);const pH=(eH+(Math.random()-0.5)*60+360)%360;ok=sendDrawCmd(S,[pX,pY],[eX,eY],`hsl(${pH},100%,60%)`,pT);if(ePD>0)await delay(ePD);}if(!ok||!drawing_active)break;if(fD>0)await delay(fD);}drawing_active=false;console.log("Light Speed Fireworks finished.");}
    async function fractalBloomMandala(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const s=window.___BOT.conn.socket;console.log("Starting Fractal Bloom Mandala...");const cX=0.5,cY=0.5,mD=4,iB=6+Math.floor(Math.random()*3),iL=0.15,lR=0.65,aS=Math.PI/(3+Math.random()*2),del=20,bH=Math.random()*360;async function dB(x1,y1,A,L,D,cH,bT){if(!drawing_active||D>mD||L<0.005)return;const x2=x1+L*Math.cos(A),y2=y1+L*Math.sin(A),t=Math.max(1,bT*Math.pow(lR,D-1)*2),c=`hsl(${(cH+D*20)%360},${80-D*10}%,${60-D*8}%)`;if(!sendDrawCmd(s,[x1,y1],[x2,y2],c,t)){drawing_active=false;return;}if(del>0)await delay(del);if(!drawing_active)return;await dB(x2,y2,A-aS,L*lR,D+1,cH,bT);if(!drawing_active)return;await dB(x2,y2,A+aS,L*lR,D+1,cH,bT);if(D<mD-1&&Math.random()<0.4){if(!drawing_active)return;await dB(x2,y2,A,L*lR*0.8,D+1,cH,bT);}}for(let i=0;i<iB&&drawing_active;i++){const A=(i/iB)*2*Math.PI+((global_frame_count/150)*Math.PI*0.2);await dB(cX,cY,A,iL,1,(bH+i*(360/iB))%360,10);if(del>0)await delay(del*3);}global_frame_count++;drawing_active=false;console.log("Fractal Bloom Mandala finished.");}
    async function pulsatingStainedGlass(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const socket=window.___BOT.conn.socket;console.log("Starting Pulsating Stained Glass...");const gX=5+Math.floor(Math.random()*4),gY=4+Math.floor(Math.random()*3),cW=1/gX,cH=1/gY,aS=150,gD=50,lT=3,lC="rgb(40,40,40)";let C=[];for(let r=0;r<gY;r++){for(let c=0;c<gX;c++){const cT=Math.random();let p=[];const x=c*cW,y=r*cH,w=cW,h=cH;if(cT<0.33){p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];}else if(cT<0.66){if(Math.random()<0.5){p=[[x,y],[x+w,y],[x+w,y+h],[x,y],[x,y+h],[x+w,y+h]];}else{p=[[x,y],[x+w,y],[x,y+h],[x+w,y],[x+w,y+h],[x,y+h]];}}else{const cx=x+w/2,cy=y+h/2;p=[[x,y],[x+w,y],[cx,cy],[x+w,y],[x+w,y+h],[cx,cy],[x+w,y+h],[x,y+h],[cx,cy],[x,y+h],[x,y],[cx,cy]];}C.push({bP:p,h:Math.random()*360,lP:Math.random()*Math.PI*2,lS:0.05+Math.random()*0.1});}}for(const cell of C){if(!drawing_active)break;for(let i=0;i<cell.bP.length;i+=3){if(!drawing_active||i+2>=cell.bP.length)break;const p1=cell.bP[i],p2=cell.bP[i+1],p3=cell.bP[i+2];if(!sendDrawCmd(socket,p1,p2,lC,lT)){drawing_active=false;break;}if(!sendDrawCmd(socket,p2,p3,lC,lT)){drawing_active=false;break;}if(!sendDrawCmd(socket,p3,p1,lC,lT)){drawing_active=false;break;}await delay(5);}}for(let f=0;f<aS&&drawing_active;f++){for(const cell of C){if(!drawing_active)break;const cL=40+20*Math.sin(cell.lP+f*cell.lS);const col=`hsl(${cell.h},80%,${cL}%)`;for(let i=0;i<cell.bP.length;i+=3){if(!drawing_active||i+2>=cell.bP.length)break;const p1=cell.bP[i],p2=cell.bP[i+1],p3=cell.bP[i+2];const m12=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2],m23=[(p2[0]+p3[0])/2,(p2[1]+p3[1])/2];if(!sendDrawCmd(socket,m12,p3,col,lT*3+2)){drawing_active=false;break;}if(!sendDrawCmd(socket,m23,p1,col,lT*3+2)){drawing_active=false;break;}}}if(!drawing_active)break;await delay(gD);}drawing_active=false;console.log("Pulsating Stained Glass finished.");}
    async function celestialBallet(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const s=window.___BOT.conn.socket;console.log("Starting Celestial Ballet...");const nD=8+Math.floor(Math.random()*5),st=150,th=3,bD=25,D=[];for(let i=0;i<nD;i++){D.push({x:0.5,y:0.5,vx:(Math.random()-0.5)*0.02,vy:(Math.random()-0.5)*0.02,oC_X:0.5+(Math.random()-0.5)*0.4,oC_Y:0.5+(Math.random()-0.5)*0.4,oS:(Math.random()*0.05+0.02)*(Math.random()<0.5?1:-1),h:Math.random()*360,lX:0.5,lY:0.5});}for(let S=0;S<st&&drawing_active;S++){for(const d of D){if(!drawing_active)break;d.lX=d.x;d.lY=d.y;const aTO=Math.atan2(d.y-d.oC_Y,d.x-d.oC_X);d.vx+=Math.cos(aTO+Math.PI/2)*d.oS*0.1;d.vy+=Math.sin(aTO+Math.PI/2)*d.oS*0.1;d.vx+=(0.5-d.x)*0.0005;d.vy+=(0.5-d.y)*0.0005;d.vx*=0.97;d.vy*=0.97;d.x+=d.vx;d.y+=d.vy;if(d.x<0.01||d.x>0.99)d.vx*=-0.8;if(d.y<0.01||d.y>0.99)d.vy*=-0.8;d.x=Math.max(0.01,Math.min(0.99,d.x));d.y=Math.max(0.01,Math.min(0.99,d.y));d.h=(d.h+0.5)%360;const c=`hsl(${d.h},100%,70%)`;if(!sendDrawCmd(s,[d.lX,d.lY],[d.x,d.y],c,th)){drawing_active=false;break;}}if(bD>0)await delay(bD);}drawing_active=false;console.log("Celestial Ballet finished.");}
    async function recursiveStarPolygonNova(){if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket||window.___BOT.conn.socket.readyState!==WebSocket.OPEN){alert("Bot not connected.");return;}drawing_active=true;const s=window.___BOT.conn.socket;console.log("Starting Recursive Star Polygon Nova...");const cX=0.5,cY=0.5,iR=0.25,mD=3+Math.floor(Math.random()*1),nP=5+Math.floor(Math.random()*2)*2,sF=2+Math.floor(Math.random()*1),rSF=0.4,sD=15,bH=Math.random()*360;let gRot=global_frame_count*0.01;async function dS(cx,cy,r,P,sk,D,cH,cT,pA){if(!drawing_active||D>mD||r<0.005)return;const sC=[];for(let i=0;i<P;i++){const a=(i/P)*2*Math.PI+pA+gRot;sC.push({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});};const col=`hsl(${(cH+D*30)%360},95%,${65-D*10}%)`,th=Math.max(1,cT);for(let i=0;i<P&&drawing_active;i++){const p1=sC[i],p2=sC[(i+sk)%P];if(!sendDrawCmd(s,[p1.x,p1.y],[p2.x,p2.y],col,th)){drawing_active=false;return;}if(sD>0)await delay(sD);}for(let i=0;i<P&&drawing_active;i++){const nA=(i/P)*2*Math.PI+pA+Math.PI/P;await dS(sC[i].x,sC[i].y,r*rSF,P,sk,D+1,cH,th*0.7,nA);}}await dS(cX,cY,iR,nP,sF,1,bH,6,0);global_frame_count++;drawing_active=false;console.log("Recursive Star Polygon Nova finished.");}

    // --- ENHANCED PIXEL ART CHARACTERS EFFECT (Replaces Geometric L-System from previous version) ---
    async function pixelArtCharacters() {
        if (!window.___BOT || !window.___BOT.conn || !window.___BOT.conn.socket || window.___BOT.conn.socket.readyState !== WebSocket.OPEN) { alert("Bot not connected."); return; }
        drawing_active = true; const socket = window.___BOT.conn.socket; console.log("Starting Enhanced Pixel Art Characters...");

        // Define quadrant boundaries (normalized 0-1)
        const Q_TOP_LEFT    = { xMin: 0.0, yMin: 0.0, xMax: 0.5, yMax: 0.5 };
        const Q_TOP_RIGHT   = { xMin: 0.5, yMin: 0.0, xMax: 1.0, yMax: 0.5 };
        const Q_BOTTOM_LEFT = { xMin: 0.0, yMin: 0.5, xMax: 0.5, yMax: 1.0 };
        const Q_BOTTOM_RIGHT= { xMin: 0.5, yMin: 0.5, xMax: 1.0, yMax: 1.0 };

        // Sprites based on your image (approximate)
        // R=Red, N=Brown(Mario's hair/shoes), Y=Yellow, S=Skin, B=Blue, K=Black, G=Green(Link), L=LightGreen(Link), P=PikachuYellow, O=Orange/PikaCheek, W=White, C=SonicBlue, T=SonicSkin, E=Red(SonicShoes)
        // _=Transparent
        const marioSprite = { // Top-Left
            name: "MARIO", nameColor: "#FF0000",
            width: 12,
            data: [ // ~12x14 based on your image
                "____RRRRR___", // Hat
                "___RRRRRRR__",
                "___NNNYNY___", // Hair, Ear, Sideburn
                "__NSSYSYYN__", // Face, Eye
                "__NSSYSYYYNN",
                "__NYYYYYYYYN",
                "____BBBB____", // Overalls
                "__RBBBRBBR__",
                "_RBBRRRBBRR_",
                "RBBBBBRBBBB_",
                "BBBBBBRBBBBB",
                "BBBB__BBBB__",
                "NNN____NNN__", // Shoes
                "_NN____NN___"
            ],
            colors: { R: "#E60000", N: "#7A3D03", Y: "#FBD000", S: "#FFCC99", B: "#0040FF" },
            quadrant: Q_TOP_LEFT, textOffsetY: -0.08 // Offset name above sprite
        };

        const pikachuSprite = { // Top-Right
            name: "PIKACHU", nameColor: "#FFA500",
            width: 13,
            data: [ // ~13x11 based on your image
                "____PPPPP____",
                "___PKKKPKK___", // Ears
                "__PKKPKPKKK__",
                "_PKKPKKPKPKK_",
                "_PKKPOKPKPOKK", // Cheeks (O)
                "PPKPKKKPKPKPP",
                "PPKPK_KPKPKPP",
                "_PKPKKKPKPKP_",
                "__PKKKKKPKP__",
                "___PPPPPPP___",
                "____PP_PP____"  // Feet
            ],
            colors: { P: "#FFDE38", K: "#000000", O: "#FF4444", W: "#FFFFFF" }, // Red cheeks
            quadrant: Q_TOP_RIGHT, textOffsetY: -0.08
        };

        const linkSprite = { // Bottom-Left
            name: "LINK", nameColor: "#008000",
            width: 11,
            data: [ // ~11x12 based on your image
                "____GGG____", // Hat
                "___GGGGG___",
                "__LGGGGGL__",
                "_LGSYYSGLS_", // Face, Hair
                "_GSSSSSGSG_",
                "__GSSSG GG_",
                "___GGGGG___", // Tunic
                "___GNGNG___",
                "___GNGNG___",
                "__NNYNYNN__", // Belt, details
                "_BN___NB_",   // Boots
                "B_______B"
            ],
            colors: { G: "#00A000", L: "#90EE90", S: "#FFDBAC", Y: "#FFFF99", N: "#704830", B: "#503020" },
            quadrant: Q_BOTTOM_LEFT, textOffsetY: 0.13 // Offset name below sprite
        };

        const sonicSprite = { // Bottom-Right
            name: "SONIC", nameColor: "#0000FF",
            width: 13,
            data: [ // ~13x11 based on your image
                "___CCCCCCC___", // Spines
                "__CCCWCCCWC__",
                "_CCWCCCWCWCC_",
                "_CTWCWCWTWCC_", // Eyes, Muzzle
                "CTTTWCWTTTWCW",
                "CTTT K TTTWCW", // Nose (K)
                "CCTTTTTTWCC_",
                "_CCTTTTTCC__",
                "__EWWWEWWWE__", // Shoes
                "__E_W_W_W_E__",
                "___E___E____"
            ],
            colors: { C: "#0070FF", T: "#C0D8F0", W: "#FFFFFF", E: "#D00000", K: "#000000" },
            quadrant: Q_BOTTOM_RIGHT, textOffsetY: 0.13
        };

        const characters = [marioSprite, pikachuSprite, linkSprite, sonicSprite];
        const pixelDrawDelay = 3;
        const textPixelDelay = 2;
        const textCharPixelSize = 0.008; // Smaller pixels for text

        // Draw dividing lines and VS
        const lineThickness = 8;
        const vsTextSize = 0.02;
        const vsColor = "#000000";
        if (!sendDrawCmd(socket, [0, 0.5], [1, 0.5], marioSprite.colors.R, lineThickness)) return; // Horizontal Red
        if (!sendDrawCmd(socket, [0.5, 0], [0.5, 1], pikachuSprite.colors.O, lineThickness)) return; // Vertical Orange (Pikachu's main color)
        // Correcting other lines as per image
        if (!sendDrawCmd(socket, [0.5, 0.5], [0.5, 1.0], sonicSprite.colors.C, lineThickness)) return; // Bottom half of vertical Blue
        if (!sendDrawCmd(socket, [0.0, 0.5], [0.5, 0.5], linkSprite.colors.G, lineThickness)) return; // Left half of horizontal Green

        await delay(100);
        await drawPixelText(socket, "VS", 0.5 - (vsTextSize * 2.5 * 2)/2 , 0.5 - (vsTextSize * charHeight)/2, vsTextSize, vsColor, textPixelDelay);
        await delay(100);


        for (const char of characters) {
            if (!drawing_active) break;
            const charHeightPx = char.data.length; const charWidthPx = char.width;
            const quadW = char.quadrant.xMax - char.quadrant.xMin; const quadH = char.quadrant.yMax - char.quadrant.yMin;

            // Try to make sprites larger within their quadrant
            const scaleFactor = 0.65; // How much of the quadrant the sprite should occupy
            const pixelSizeX = (quadW * scaleFactor) / charWidthPx;
            const pixelSizeY = (quadH * scaleFactor) / charHeightPx;
            const finalPixelSize = Math.min(pixelSizeX, pixelSizeY);

            const totalSpriteW = charWidthPx * finalPixelSize; const totalSpriteH = charHeightPx * finalPixelSize;
            const startX = char.quadrant.xMin + (quadW - totalSpriteW) / 2;
            const startY = char.quadrant.yMin + (quadH - totalSpriteH) / 2;

            // Draw character name
            const nameLenEst = char.name.length * (pixelFont['M'] ? pixelFont['M'][0].length : 3) * textCharPixelSize;
            const textStartX = char.quadrant.xMin + (quadW - nameLenEst)/2; // Centered in quadrant
            let textStartY;
            if (char.textOffsetY < 0) { // Above sprite
                 textStartY = startY + char.textOffsetY - (charHeight * textCharPixelSize);
            } else { // Below sprite
                 textStartY = startY + totalSpriteH + char.textOffsetY;
            }
            textStartY = Math.max(char.quadrant.yMin + 0.01, Math.min(char.quadrant.yMax - 0.01 - (charHeight * textCharPixelSize), textStartY)); // Clamp text Y

            await drawPixelText(socket, char.name, textStartX, textStartY, textCharPixelSize, char.nameColor, textPixelDelay);
            await delay(50);


            for (let y = 0; y < charHeightPx; y++) {
                if (!drawing_active) break;
                for (let x = 0; x < charWidthPx; x++) {
                    if (!drawing_active) break;
                    const colorChar = char.data[y][x];
                    if (colorChar !== "_" && char.colors[colorChar]) {
                        const dX = startX + x * finalPixelSize; const dY = startY + y * finalPixelSize;
                        if (!await drawPixel(socket, dX, dY, finalPixelSize, char.colors[colorChar], pixelDrawDelay)) { drawing_active = false; break; }
                    }
                }
            }
            if (!drawing_active) break;
            await delay(200);
        }
        drawing_active = false; console.log("Enhanced Pixel Art Characters finished.");
    }


    // --- UI ---
    function addBoxIcons(){if(document.querySelector('link[href*="boxicons"]'))return;let b=document.createElement('link');b.href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';b.rel='stylesheet';document.head.appendChild(b);}
    function createStylesheet(){if(document.getElementById('drawaria-enhancer-style'))return;let s=document.createElement('style');s.id='drawaria-enhancer-style';s.innerHTML=`
        #enhancer-menu{position:fixed;top:70px;left:10px;width:340px;background-color:#333A44;color:#E0E0E0;border:1px solid #555E69;border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,0.3);z-index:10001;font-family:'Arial',sans-serif;font-size:14px;display:none}
        #enhancer-menu-header{padding:10px;background-color:#4A525E;color:#FFF;cursor:move;border-top-left-radius:7px;border-top-right-radius:7px;display:flex;justify-content:space-between;align-items:center}
        #enhancer-menu-header h3{margin:0;font-size:16px;font-weight:bold}#enhancer-menu-close{background:none;border:none;color:#FFF;font-size:20px;cursor:pointer}
        #enhancer-menu-body{padding:10px;max-height:80vh;overflow-y:auto}
        .enhancer-section{margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #4A525E}.enhancer-section:last-child{border-bottom:none}
        .enhancer-section h4{margin-top:0;margin-bottom:8px;color:#A0D2EB;font-size:15px}
        .enhancer-row{display:flex;margin-bottom:8px;align-items:center}
        .enhancer-row>label{flex-basis:100px;margin-right:5px;font-weight:normal;min-width:80px}
        .enhancer-row>input[type="text"],.enhancer-row>input[type="number"],.enhancer-row>input[type="file"],.enhancer-row>select{flex-grow:1;padding:6px;background-color:#2A3038;border:1px solid #555E69;color:#E0E0E0;border-radius:4px;box-sizing:border-box}
        .enhancer-row>input[type="number"]{text-align:center;-moz-appearance:textfield}
        .enhancer-row>input[type="number"]::-webkit-inner-spin-button,.enhancer-row>input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        .enhancer-button-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
        .enhancer-button{padding:8px 10px;background-color:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;text-align:center;font-size:13px;transition:background-color .2s}.enhancer-button:hover{background-color:#45a049}
        .enhancer-button.special{background-color:#2196F3}.enhancer-button.special:hover{background-color:#0b7dda}
        #enhancer-toggle-button{margin-left:5px}
        details{margin-bottom:8px;border:1px solid #4A525E;border-radius:4px;padding:5px}summary{cursor:pointer;font-weight:bold;color:#E0E0E0;margin-left:5px}
        details>div{margin-top:8px;padding-top:8px;border-top:1px solid #4A525E}
        .enhancer-clear-button{padding:8px 10px;background-color:#ff9800;color:white;border:none;border-radius:4px;cursor:pointer;text-align:center;font-size:13px;transition:background-color .2s;width:100%;margin-top:8px}.enhancer-clear-button:hover{background-color:#f57c00}`;
    document.head.appendChild(s);}
    function makeDraggable(m,h){let oX,oY,d=false;h.onmousedown=e=>{if(e.target.closest('button,input,select,a'))return;d=true;oX=e.clientX-m.getBoundingClientRect().left;oY=e.clientY-m.getBoundingClientRect().top;m.style.userSelect='none';m.style.cursor='grabbing'};document.onmousemove=e=>{if(!d)return;m.style.left=`${e.clientX-oX}px`;m.style.top=`${e.clientY-oY}px`};document.onmouseup=()=>{if(d){d=false;m.style.userSelect='';h.style.cursor='move'}};h.style.cursor='move'}
    function buildMenu(){addBoxIcons();createStylesheet();const M=document.createElement('div');M.id='enhancer-menu';const H=document.createElement('div');H.id='enhancer-menu-header';H.innerHTML=`<h3>Drawaria Ideas & Art Generator</h3><button id="enhancer-menu-close" title="Close Menu"><i class='bx bx-x'></i></button>`;M.appendChild(H);const B=document.createElement('div');B.id='enhancer-menu-body';B.innerHTML=`
        <div class="enhancer-section"><h4><i class='bx bxs-image-add'></i> Image Drawing</h4>
            <div class="enhancer-row"><label for="img-file-input">Load Image:</label><input type="file" id="img-file-input" accept="image/*"/></div>
            <div class="enhancer-row"><label for="img-url-input">Or Image URL:</label><input type="text" id="img-url-input" placeholder="Enter image URL"/></div>
            <details><summary>Drawing Settings</summary>
                <div class="enhancer-row"><label for="engine_imagesize">Pixel Step:</label><input type="number" id="engine_imagesize" min="1" max="50" value="5"></div>
                <div class="enhancer-row"><label for="engine_brushsize">Brush Size:</label><input type="number" id="engine_brushsize" min="1" max="100" value="3"></div>
                <div class="enhancer-row"><label for="engine_offset_x">Offset X (%):</label><input type="number" id="engine_offset_x" min="-100" max="100" value="0"></div>
                <div class="enhancer-row"><label for="engine_offset_y">Offset Y (%):</label><input type="number" id="engine_offset_y" min="-100" max="100" value="0"></div>
                <div class="enhancer-row"><label for="engine_draw_delay">Draw Delay:</label><input type="number" id="engine_draw_delay" min="0" max="1000" value="10"></div>
            </details>
            <div class="enhancer-button-grid" style="margin-top:10px;"><button id="img-draw-start" class="enhancer-button"><i class='bx bx-play'></i> Draw Image</button><button id="img-draw-stop" class="enhancer-button danger"><i class='bx bx-stop'></i> Stop</button></div>
        </div>
        <div class="enhancer-section"><h4><i class='bx bxs-magic-wand'></i> Generative Art Effects</h4>
            <div class="enhancer-button-grid">
                <button id="effect-pixel-art-chars" class="enhancer-button special" title="Draws classic game characters in pixel art with names and VS."><i class='bx bxs-joystick'></i> Pixel Art VS</button>
                <button id="effect-pulsating-stained-glass" class="enhancer-button special" title="Geometric colored panels pulse with light."><i class='bx bxs-vector'></i> Pulsating Stained Glass</button>
                <button id="effect-celestial-ballet" class="enhancer-button special" title="Particles dance in orbital patterns."><i class='bx bxs-planet'></i> Celestial Ballet</button>
                <button id="effect-recursive-star-nova" class="enhancer-button special" title="Stars recursively generate smaller stars."><i class='bx bxs-star'></i> Recursive Star Nova</button>
                <button id="effect-fractal-mandala" class="enhancer-button special" title="Intricate mandala grows fractally from center."><i class='bx bxs-cog'></i> Fractal Mandala</button>
                <button id="effect-directional-hue-blast" class="enhancer-button special"><i class='bx bxs-direction-right'></i> Hue Blast</button>
                <button id="effect-color-festival" class="enhancer-button special"><i class='bx bxs-party'></i> Color Festival</button>
                <button id="effect-fireworks" class="enhancer-button special"><i class='bx bxs-hot'></i> Fireworks</button>
            </div>
            <button id="bot-clear-canvas" class="enhancer-clear-button"><i class='bx bxs-eraser'></i> Bot Clear (Whiteout)</button>
        </div>`;
    M.appendChild(B);document.body.appendChild(M);makeDraggable(M,H);
    EL('#enhancer-menu-close').onclick=()=>M.style.display='none';
    EL('#img-file-input').onchange=function(){if(!this.files||!this.files[0])return;const FR=new FileReader();FR.onload=e=>loadImage(e.target.result);FR.readAsDataURL(this.files[0]);EL('#img-url-input').value='';};
    EL('#img-url-input').onchange=function(){if(this.value.trim()!=="")loadImage(this.value.trim());EL('#img-file-input').value='';};
    EL('#img-draw-start').onclick=()=>{const pS=EL('#engine_imagesize').value,bS=EL('#engine_brushsize').value,oX=EL('#engine_offset_x').value,oY=EL('#engine_offset_y').value;const cmds=generateImageDrawingCommands(pS,bS,{x:oX,y:oY});if(cmds.length>0&&window.___BOT&&window.___BOT.conn&&window.___BOT.conn.socket)executeDrawingCommands(cmds,window.___BOT.conn.socket);else if(!window.___BOT||!window.___BOT.conn||!window.___BOT.conn.socket)alert("Bot not connected.");else alert("No drawing commands from image.");};
    EL('#img-draw-stop').onclick=()=>drawing_active=false;
    EL('#bot-clear-canvas').onclick=botClearCanvas;
    EL('#effect-directional-hue-blast').onclick=directionalHueBlast;EL('#effect-color-festival').onclick=colorFestival;EL('#effect-fireworks').onclick=lightSpeedFireworks;EL('#effect-fractal-mandala').onclick=fractalBloomMandala;EL('#effect-pulsating-stained-glass').onclick=pulsatingStainedGlass;EL('#effect-celestial-ballet').onclick=celestialBallet;
    EL('#effect-recursive-star-nova').onclick=recursiveStarPolygonNova;
    EL('#effect-pixel-art-chars').onclick=pixelArtCharacters;
    let cIT=EL('#chatbox_textinput');if(cIT&&!EL('#enhancer-toggle-button')){let bC=document.createElement('div');bC.className='input-group-append';let tB=document.createElement('button');tB.id='enhancer-toggle-button';tB.className='btn btn-outline-secondary';tB.innerHTML=`<i class='bx bx-palette'></i>`;tB.title="Toggle Art Gen Menu";tB.onclick=e=>{e.preventDefault();M.style.display=(M.style.display==='none'||M.style.display==='')?'block':'none';tB.classList.toggle('active',M.style.display==='block')};const cIP=cIT.parentElement;if(cIP){cIP.appendChild(bC);bC.appendChild(tB)}else{cIT.after(bC);bC.appendChild(tB)}}}
    function initializeWhenReady(){originalCanvas=document.getElementById('canvas');const cI=document.getElementById('chatbox_textinput');if(!originalCanvas||!cI){setTimeout(initializeWhenReady,500);return} if(originalCanvas){ cw = originalCanvas.width; ch = originalCanvas.height; console.log(`Canvas dimensions captured: ${cw}x${ch}`);} console.log("Drawaria Art Gen (Tools Only) V1.8 init...");window['___ENGINE']={loadImage,generateImageDrawingCommands,executeDrawingCommands,directionalHueBlast,colorFestival,lightSpeedFireworks,fractalBloomMandala,pulsatingStainedGlass,celestialBallet,recursiveStarPolygonNova,pixelArtCharacters,botClearCanvas};buildMenu();console.log("Drawaria Art Gen (Tools Only) V1.8 Loaded!")}
    if(document.readyState==="complete"||document.readyState==="interactive")initializeWhenReady();else window.addEventListener('load',initializeWhenReady);
})();