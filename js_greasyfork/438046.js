// ==UserScript==
// @name        THE SKRIBBLE SHAPES/LINE TOOL (10+ FEATURES)
// @namespace   https://greasyfork.org/users/861129
// @match       *://skribbl.io/*
// @grant       none
// @version     0.9.1
// @license	MIT
// @copyright   2022, smartboyprofesor (https://greasyfork.org/users/861129)
// @author      smartboyprofesor
// @description 45° SNAP, RECTANGLE, BEZIER, CIRCLE, RHOMBUS, GRID, MORE
// @downloadURL https://update.greasyfork.org/scripts/438046/THE%20SKRIBBLE%20SHAPESLINE%20TOOL%20%2810%2B%20FEATURES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438046/THE%20SKRIBBLE%20SHAPESLINE%20TOOL%20%2810%2B%20FEATURES%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const canvas = document.querySelector('#canvasGame');
const lineCanvas = document.createElement('canvas');
const linectx = lineCanvas.getContext('2d');

lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);

lineCanvas.setAttribute('style', `
	position: absolute;
	cursor: crosshair;
	width: 100%;
	user-select: none;
	z-index: 2;
	filter: opacity(0.1);
	display: none;`
                       );

lineCanvas.clear = () => {
    linectx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
};

let icon=document.getElementsByClassName("logoSmall");for(let i=0;i<icon.length;i++)icon[i].remove()
let screengame = document.getElementById("screenGame")
let toolbar2 = document.createElement("div")
screengame.appendChild(toolbar2)
toolbar2.style="height:48px;border-radius:2px;display:flex;margin-top:65px;justify-content:center;background-image:linear-gradient(to bottom, #ffffff 0%,#f3f3f3 50%,#ededed 51%,#ffffff 100%)"

function createtbdiv(){
    let div = document.createElement("div")
    toolbar2.appendChild(div)
    div.style="height:75%;width:1px;background:rgba(51,51,51,.5);margin:0px 5px;top:25%;transform:translateY(25%)"
}

let labelstyle = "margin-left:5px;margin-right:5px;text-align:center"
let inputstyle = "border-radius:5px;text-align:center;color:#bd2057;width:150px"
let buttonstyle = "cursor:pointer;border-radius:5px;margin-top:5px;margin-bottom:5px;background-image:linear-gradient(to bottom, #bfd255 0%,#8eb92a 50%,#72aa00 51%,#9ecb2d 100%);color:white;font-weight:bolder;margin-left:5px;margin-right:5px"
let presetstyle = "cursor:pointer;border-radius:5px;background-image:linear-gradient(to bottom, #d2cc55 0%,#b6b92a 50%,#aaa800 51%,#c3cb2d 100%);color:white;font-weight:bolder"
let horigridlabel = document.createElement("label")
horigridlabel.innerHTML="Horizontal Lines"
toolbar2.appendChild(horigridlabel)
horigridlabel.style=labelstyle
let vertgridlabel = document.createElement("label")
vertgridlabel.innerHTML="Vertical Lines"
toolbar2.appendChild(vertgridlabel)
vertgridlabel.style=labelstyle
let horigrid = document.createElement('input')
horigrid.style=inputstyle
horigridlabel.appendChild(document.createElement('br'))
horigridlabel.appendChild(horigrid)
horigrid.placeholder="Horizontal Gridlines"
let vertgrid = document.createElement('input')
vertgrid.style=inputstyle
vertgridlabel.appendChild(document.createElement('br'))
vertgridlabel.appendChild(vertgrid)
vertgrid.placeholder="Vertical Gridlines"
horigrid.value="0"
vertgrid.value="0"
let gridenable = document.createElement("button")
toolbar2.appendChild(gridenable)
gridenable.innerHTML="Enable Grid"
gridenable.style=buttonstyle
createtbdiv()
let altdistlabel = document.createElement("label")
toolbar2.appendChild(altdistlabel)
altdistlabel.innerHTML="Alt Factor"
altdistlabel.style=labelstyle
let altdist = document.createElement('input')
altdist.style=inputstyle
altdistlabel.appendChild(document.createElement('br'))
altdistlabel.appendChild(altdist)
altdist.placeholder="Alt Magnitude Factor"
altdist.value="0%"
let polysideslabel = document.createElement("label")
toolbar2.appendChild(polysideslabel)
polysideslabel.innerHTML="Poly Points"
polysideslabel.style=labelstyle
let polysides = document.createElement('input')
polysides.style=inputstyle
polysideslabel.appendChild(document.createElement('br'))
polysideslabel.appendChild(polysides)
polysides.placeholder="Poly Points"
polysides.value="3"
let squsecenable = document.createElement("button")
toolbar2.appendChild(squsecenable)
squsecenable.innerHTML="Enable 1:1"
squsecenable.style=buttonstyle
createtbdiv()
let presetslabel = document.createElement('label')
toolbar2.appendChild(presetslabel)
presetslabel.innerHTML="Star Presets"
presetslabel.style=labelstyle
presetslabel.appendChild(document.createElement('br'))
let threestarpreset = document.createElement("button")
presetslabel.appendChild(threestarpreset)
threestarpreset.innerHTML="3"
threestarpreset.style=presetstyle
let fourstarpreset = document.createElement("button")
presetslabel.appendChild(fourstarpreset)
fourstarpreset.innerHTML="4"
fourstarpreset.style=presetstyle
let fivestarpreset = document.createElement("button")
presetslabel.appendChild(fivestarpreset)
fivestarpreset.innerHTML="5"
fivestarpreset.style=presetstyle
let sixstarpreset = document.createElement("button")
presetslabel.appendChild(sixstarpreset)
sixstarpreset.innerHTML="6"
sixstarpreset.style=presetstyle
let fasterbezier = document.createElement("button")
toolbar2.appendChild(fasterbezier)
fasterbezier.innerHTML="Faster Bezier"
fasterbezier.style=buttonstyle



let origin = {
    preview: {},
    real: {}
};

const pos = {
    preview: {},
    real: {}
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

let canvasHidden = true;
let drawingLine = false;
let doog = "";
var bezipoints = []
var beziselec = false
var bezselec = -1
var recbezselec = -1
var gridenabled = false
var gridhori = 0
var gridvert = 0
var sidespoly = 6
var square = false
var forcesquare = false
var fasterbeziergo = false
document.addEventListener('keydown', (e) => {
    if (!isDrawing()) return;
    if (e.code === 'ShiftLeft' && canvasHidden) {
        lineCanvas.style.display = '';
        disableScroll();
        canvasHidden = false;
        lineCanvas.style.cursor="crosshair"
    } else if (!canvasHidden){
        if (doog===""){
            lineCanvas.style.cursor="crosshair"
            if (e.code==="KeyZ")doog="snap"
            if (e.code==="KeyX")doog="rect"
            if (e.code==="KeyC")doog="circ"
            if (e.code==="KeyV")doog="bezi"
            if (e.code==="KeyA")doog="rhom"
            if (e.code==="KeyS")doog="poly"
        }else{
            if (e.code==="Space")square=true
        }
    }
    document.dispatchEvent(createMouseEvent('pointermove', pos.real));
});

function unfocusvert(vert,ty){
    document.activeElement.blur()
    vert.style.color="#bd2057"
    if(ty===2){
        if (vert.value.replace(/\D/g,'')===""){
            vert.value="5"
            sidespoly=Number(vert.value)*2
        }else{
            vert.value=clamp(Number(vert.value.replace(/\D/g,'')),3,18).toString()
            sidespoly=clamp(Number(vert.value.replace(/\D/g,'')),3,18)*2
        }
    }else{
        if (vert.value.replace(/\D/g,'')===""){
            vert.value="0"
            if(ty===0){gridhori=Number(vert.value)}else if(ty===1){gridvert=Number(vert.value)}
        }else{
            vert.value=clamp(Number(vert.value.replace(/\D/g,'')),0,25).toString()
            if(ty===0){gridhori=clamp(Number(vert.value.replace(/\D/g,'')),0,25)}else if(ty===1){gridvert=clamp(Number(vert.value.replace(/\D/g,'')),0,25)}
        }
    }
}
function unfocusperc(vert){
    document.activeElement.blur()
    vert.style.color="#bd2057"
    if (vert.value.replace(/\D/g,'')===""){
        vert.value="0%"
    }else{
        vert.value=clamp(Number(vert.value.replace(/\D/g,'')),0,100).toString()+'%'
    }
}

horigrid.addEventListener("keydown", ({key}) => {
    if (key === "Enter") {
        unfocusvert(horigrid,0)
    }
})
horigrid.addEventListener("focusout", () => {
    unfocusvert(horigrid,0)
})
horigrid.addEventListener("click",()=>{
    horigrid.style.color="black"
})

vertgrid.addEventListener("keydown", ({key}) => {
    if (key === "Enter") {
        unfocusvert(vertgrid,1)
    }
})
vertgrid.addEventListener("focusout", () => {
    unfocusvert(vertgrid,1)
})
vertgrid.addEventListener("click",()=>{
    vertgrid.style.color="black"
})

polysides.addEventListener("keydown", ({key}) => {
    if (key === "Enter") {
        unfocusvert(polysides,2)
    }
})
polysides.addEventListener("focusout", () => {
    unfocusvert(polysides,2)
})
polysides.addEventListener("click",()=>{
    polysides.style.color="black"
})

altdist.addEventListener("keydown", ({key}) => {
    if (key === "Enter") {
        unfocusperc(altdist)
    }
})
altdist.addEventListener("focusout", () => {
    unfocusperc(altdist)
})
altdist.addEventListener("click",()=>{
    altdist.style.color="black"
    altdist.value=altdist.value.replace('%','')
})

gridenable.addEventListener("click",()=>{
    if(gridenabled===false){
        gridenabled=true
        gridenable.innerHTML="Disable Grid"
        gridenable.style['background-image']="linear-gradient(to bottom, #f85032 0%,#f16f5c 50%,#f6290c 51%,#f02f17 71%,#e73827 100%)"
    }else{gridenabled=false;gridenable.innerHTML="Enable Grid";gridenable.style['background-image']="linear-gradient(to bottom, #bfd255 0%,#8eb92a 50%,#72aa00 51%,#9ecb2d 100%)"}
})
squsecenable.addEventListener("click",()=>{
    if(forcesquare===false){
        forcesquare=true
        squsecenable.innerHTML="Disable 1:1"
        squsecenable.style['background-image']="linear-gradient(to bottom, #f85032 0%,#f16f5c 50%,#f6290c 51%,#f02f17 71%,#e73827 100%)"
    }else{forcesquare=false;squsecenable.innerHTML="Enable 1:1";squsecenable.style['background-image']="linear-gradient(to bottom, #bfd255 0%,#8eb92a 50%,#72aa00 51%,#9ecb2d 100%)"}
})
threestarpreset.onclick=function(){
    polysides.value="3"
    sidespoly=6
    altdist.value="75%"
}
fourstarpreset.onclick=function(){
    polysides.value="4"
    sidespoly=8
    altdist.value="75%"
}
fivestarpreset.onclick=function(){
    polysides.value="5"
    sidespoly=10
    altdist.value="50%"
}
sixstarpreset.onclick=function(){
    polysides.value="6"
    sidespoly=12
    altdist.value="75%"
}
fasterbezier.addEventListener("click",()=>{
    if(fasterbeziergo===false){
        fasterbeziergo=true
        fasterbezier.innerHTML="Slower Bezier"
        fasterbezier.style['background-image']="linear-gradient(to bottom, #f85032 0%,#f16f5c 50%,#f6290c 51%,#f02f17 71%,#e73827 100%)"
    }else{fasterbeziergo=false;fasterbezier.innerHTML="Faster Bezier";fasterbezier.style['background-image']="linear-gradient(to bottom, #bfd255 0%,#8eb92a 50%,#72aa00 51%,#9ecb2d 100%)"}
})

document.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' && !canvasHidden) {
        if(doog==="bezi"){
            let bezangle = 0
            let prevangle = 0
            for(let i=0;i<20;i++){
                const canvasRect = canvas.getBoundingClientRect();
                const canvasScale = canvas.width / canvasRect.width;
                let x0=bezipoints[0][0].x/canvasScale+canvasRect.left
                let x1=bezipoints[1][0].x/canvasScale+canvasRect.left
                let x2=bezipoints[2][0].x/canvasScale+canvasRect.left
                let x3=bezipoints[3][0].x/canvasScale+canvasRect.left
                let y0=bezipoints[0][0].y/canvasScale+canvasRect.top
                let y1=bezipoints[1][0].y/canvasScale+canvasRect.top
                let y2=bezipoints[2][0].y/canvasScale+canvasRect.top
                let y3=bezipoints[3][0].y/canvasScale+canvasRect.top
                let t1=i/20
                let t2=(i+1)/20
                let leng=Math.sqrt(Math.pow(((1-t2)*((1-t2)*((1-t2)*x0+t2*x1)+t2*((1-t2)*x1+t2*x2))+t2*((1-t2)*((1-t2)*x1+t2*x2)+t2*((1-t2)*x2+t2*x3)))-((1-t1)*((1-t1)*((1-t1)*x0+t1*x1)+t1*((1-t1)*x1+t1*x2))+t1*((1-t1)*((1-t1)*x1+t1*x2)+t1*((1-t1)*x2+t1*x3))),2)+Math.pow(((1-t2)*((1-t2)*((1-t2)*y0+t2*y1)+t2*((1-t2)*y1+t2*y2))+t2*((1-t2)*((1-t2)*y1+t2*y2)+t2*((1-t2)*y2+t2*y3)))-((1-t1)*((1-t1)*((1-t1)*y0+t1*y1)+t1*((1-t1)*y1+t1*y2))+t1*((1-t1)*((1-t1)*y1+t1*y2)+t1*((1-t1)*y2+t1*y3))),2))
                let ang=(180*Math.acos((((1-t1)*((1-t1)*((1-t1)*x0+t1*x1)+t1*((1-t1)*x1+t1*x2))+t1*((1-t1)*((1-t1)*x1+t1*x2)+t1*((1-t1)*x2+t1*x3)))-((1-t2)*((1-t2)*((1-t2)*x0+t2*x1)+t2*((1-t2)*x1+t2*x2))+t2*((1-t2)*((1-t2)*x1+t2*x2)+t2*((1-t2)*x2+t2*x3))))/leng))/Math.PI
                if(i>0){
                    bezangle=bezangle+Math.abs(prevangle-ang)
                }
                prevangle=ang
            }
            bezangle=360/bezangle
            let lins=(Math.round(clamp(20/bezangle,1,20)))*clamp(Math.pow(2.15*Math.E,-.077*Math.round(clamp(20/bezangle,1,20))),1,2)
            if(fasterbeziergo===false)lins=20
            for(let i=0;i<lins;i++){
                const canvasRect = canvas.getBoundingClientRect();
                const canvasScale = canvas.width / canvasRect.width;
                let x0=bezipoints[0][0].x/canvasScale+canvasRect.left
                let x1=bezipoints[1][0].x/canvasScale+canvasRect.left
                let x2=bezipoints[2][0].x/canvasScale+canvasRect.left
                let x3=bezipoints[3][0].x/canvasScale+canvasRect.left
                let y0=bezipoints[0][0].y/canvasScale+canvasRect.top
                let y1=bezipoints[1][0].y/canvasScale+canvasRect.top
                let y2=bezipoints[2][0].y/canvasScale+canvasRect.top
                let y3=bezipoints[3][0].y/canvasScale+canvasRect.top
                let t1=i/lins
                let t2=(i+1)/lins
                canvas.dispatchEvent(createMouseEvent('mousedown', {x:(1-t1)*((1-t1)*((1-t1)*x0+t1*x1)+t1*((1-t1)*x1+t1*x2))+t1*((1-t1)*((1-t1)*x1+t1*x2)+t1*((1-t1)*x2+t1*x3)),y:(1-t1)*((1-t1)*((1-t1)*y0+t1*y1)+t1*((1-t1)*y1+t1*y2))+t1*((1-t1)*((1-t1)*y1+t1*y2)+t1*((1-t1)*y2+t1*y3))}, true));
                canvas.dispatchEvent(createMouseEvent('mousemove', {x:(1-t2)*((1-t2)*((1-t2)*x0+t2*x1)+t2*((1-t2)*x1+t2*x2))+t2*((1-t2)*((1-t2)*x1+t2*x2)+t2*((1-t2)*x2+t2*x3)),y:(1-t2)*((1-t2)*((1-t2)*y0+t2*y1)+t2*((1-t2)*y1+t2*y2))+t2*((1-t2)*((1-t2)*y1+t2*y2)+t2*((1-t2)*y2+t2*y3))}, true));
                canvas.dispatchEvent(createMouseEvent('mouseup', {x:(1-t2)*((1-t2)*((1-t2)*x0+t2*x1)+t2*((1-t2)*x1+t2*x2))+t2*((1-t2)*((1-t2)*x1+t2*x2)+t2*((1-t2)*x2+t2*x3)),y:(1-t2)*((1-t2)*((1-t2)*y0+t2*y1)+t2*((1-t2)*y1+t2*y2))+t2*((1-t2)*((1-t2)*y1+t2*y2)+t2*((1-t2)*y2+t2*y3))}, true));
            }
            lineCanvas.style.cursor="crosshair"
        }
        hideLineCanvas();
        document.removeEventListener('pointermove', savePos);
        document.removeEventListener('pointerup', mouseUpDraw);
    } else if (e.code === 'KeyZ' && doog === "snap" || e.code === 'KeyX' && doog === "rect" || e.code === 'KeyC' && doog === "circ" || e.code === 'KeyA' && doog === "rhom" || e.code === 'KeyS' && doog === "poly") {
        doog = "";
        document.dispatchEvent(createMouseEvent('pointermove', pos.real));
    } else if (e.code==="Space"){
        square=false
    }
});

function hideLineCanvas() {
    lineCanvas.style.display = 'none';
    canvasHidden = true;
    doog=""
    bezipoints = []
    enableScroll();
    resetLineCanvas();
}

lineCanvas.addEventListener('pointerdown', (e) => {
    if (!e.shiftKey) hideLineCanvas();
    if (bezselec===-1){
        if(doog==="bezi"){
            if (bezipoints.length<4){
                bezipoints[bezipoints.length]=[getPos(e),0];
                recbezselec=bezipoints.length
            }
        }
    }else if(recbezselec!=bezselec){
        beziselec=true
        lineCanvas.style.cursor="pointer"
    }
    origin = getPos(e);
    origin.real = getRealPos(e);
    drawingLine = true;
    document.addEventListener('pointermove', savePos);
    document.addEventListener('pointerup', mouseUpDraw);
});

function savePos(e) {
    e.preventDefault();
    pos.preview = getPos(e);
    pos.real = getRealPos(e);
    if (!beziselec&&doog==="bezi"){
        let aga = [-1,9]
        for (let i=0;i<bezipoints.length;i++){
            bezipoints[i][1]=0
            if(Math.sqrt(Math.pow(pos.preview.x-bezipoints[i][0].x,2)+Math.pow(pos.preview.y-bezipoints[i][0].y,2))<=8){if(Math.sqrt(Math.pow(pos.preview.x-bezipoints[i][0].x,2)+Math.pow(pos.preview.y-bezipoints[i][0].y,2))<aga[1]){aga=[i,Math.sqrt(Math.pow(pos.preview.x-bezipoints[i][0].x,2)+Math.pow(pos.preview.y-bezipoints[i][0].y,2))]}}
        }
        bezselec=aga[0]
        if (aga[0]>-1){bezipoints[aga[0]][1]=1;lineCanvas.style.cursor="pointer"}else lineCanvas.style.cursor="crosshair"
    }else if(doog==="bezi")bezipoints[bezselec][0]=pos.preview
    if ((canvasHidden && doog!="bezi") || (!drawingLine && doog!="bezi")) return;
    if(doog!='bezi')lineCanvas.clear()
    drawPreviewLine(pos.preview);
}

function mouseUpDraw(e) {
    if (doog!="bezi"){
        document.removeEventListener('pointermove', savePos);
        document.removeEventListener('pointerup', mouseUpDraw);
        drawLine(origin.real.x, origin.real.y, pos.real.x, pos.real.y);
        pos.preview = getPos(e);
        pos.real = getRealPos(e);
        resetLineCanvas();
    }else{
        beziselec=false
        lineCanvas.style.cursor="crosshair"
        recbezselec=-1
    }
}

function resetLineCanvas() {
    drawingLine = false;
    lineCanvas.clear();
}

function getPos(event) {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasScale = canvas.width / canvasRect.width;
    return {
        x: (event.clientX - canvasRect.left) * canvasScale,
        y: (event.clientY - canvasRect.top) * canvasScale
    };
}
function getRealPos(event) {
    return {
        x: event.clientX,
        y: event.clientY
    };
}

function drawPreviewLine(coords) {
    if (doog!=""&&doog!="snap"){
        if(square||forcesquare)coords={x:origin.x+Math.min(Math.abs(coords.x-origin.x),Math.abs(coords.y-origin.y))*((coords.x-origin.x)/Math.abs(coords.x-origin.x)),y:origin.y+Math.min(Math.abs(coords.x-origin.x),Math.abs(coords.y-origin.y))*((coords.y-origin.y)/Math.abs(coords.y-origin.y))}
    }
    linectx.beginPath();
    if (doog==="snap") {
        linectx.moveTo(origin.x, origin.y);
        let ab_x = coords.x-origin.x
        let ab_y = coords.y-origin.y
        let abc123 = Math.round((180*(Math.atan(ab_x/ab_y)+((((ab_y-Math.abs(ab_y))/ab_y)/2)*Math.PI)))/(45*Math.PI))*((Math.PI*45)/180)
        linectx.lineTo(Math.sin(abc123)*Math.sqrt(Math.pow(ab_x,2)+Math.pow(ab_y,2))+origin.x,Math.cos(abc123)*Math.sqrt(Math.pow(ab_x,2)+Math.pow(ab_y,2))+origin.y)
    } else if (doog==="rect") {
        linectx.moveTo(origin.x, origin.y);
        linectx.strokeRect(origin.x, origin.y, coords.x-origin.x, coords.y-origin.y);
    } else if (doog==="circ") {
        linectx.ellipse(origin.x+(coords.x-origin.x)/2, origin.y+(coords.y-origin.y)/2, Math.abs((coords.x-origin.x)/2), Math.abs((coords.y-origin.y)/2), 0, 0, 2*Math.PI);
    } else if (doog==="") {
        linectx.moveTo(origin.x, origin.y);
        linectx.lineTo(coords.x, coords.y);
    } else if (doog==="bezi"){
        resetLineCanvas()
        let i
        for (i=0;i<bezipoints.length;i++){
            linectx.beginPath()
            linectx.arc(bezipoints[i][0].x,bezipoints[i][0].y,8,0,2*Math.PI)
            linectx.fillStyle = 'rgba(255,'+(100*bezipoints[i][1]).toString()+','+(100*bezipoints[i][1]).toString()+',0.5)'
            linectx.fill()
            linectx.beginPath()
            linectx.arc(bezipoints[i][0].x,bezipoints[i][0].y,3,0,2*Math.PI)
            linectx.fillStyle = 'rgba(255,0,0,1)'
            linectx.fill()
            if(bezipoints.length==4){
                linectx.beginPath()
                linectx.moveTo(bezipoints[0][0].x,bezipoints[0][0].y)
                linectx.bezierCurveTo(bezipoints[1][0].x,bezipoints[1][0].y,bezipoints[2][0].x,bezipoints[2][0].y,bezipoints[3][0].x,bezipoints[3][0].y)
                linectx.stroke()
            }
        }
    } else if (doog==="rhom"){
        linectx.moveTo(origin.x,origin.y+(coords.y-origin.y)/2)
        linectx.lineTo(origin.x+(coords.x-origin.x)/2,origin.y)
        linectx.lineTo(coords.x,origin.y+(coords.y-origin.y)/2)
        linectx.lineTo(origin.x+(coords.x-origin.x)/2,coords.y)
        linectx.lineTo(origin.x,origin.y+(coords.y-origin.y)/2)
        linectx.stroke()
    } else if (doog==="poly"){
        let x1=origin.x
        let x2=coords.x
        let y1=origin.y
        let y2=coords.y
        let i = 0
        if((Number(altdist.value.replace(/\D/g,''))/100)===0){
            linectx.moveTo((x1+(x2-x1)/2)+Math.sin(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
            for (i = 0; i<(sidespoly/2); i++) {
                linectx.lineTo((x1+(x2-x1)/2)+Math.sin(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
                linectx.lineTo((x1+(x2-x1)/2)+Math.sin((((i+1))*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos((((i+1))*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
            }
        }else{
            linectx.moveTo((x1+(x2-x1)/2)+Math.sin(((i)*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos(((i)*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
            for (i = 0; i<sidespoly; i++) {
                linectx.lineTo((x1+(x2-x1)/2)+Math.sin(((i)*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos(((i)*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
                linectx.lineTo((x1+(x2-x1)/2)+Math.sin((((i+1))*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),(y1+(y2-y1)/2)-Math.cos((((i+1))*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)))
            }
        }
        linectx.stroke()
    }
    if (doog!="bezi"){linectx.lineWidth = 3;linectx.stroke()}
}

function drawLine(x1, y1, x2, y2) {
    if (doog!=""&&doog!="snap"){
        if(square||forcesquare){
            x2=x1+Math.min(Math.abs(x2-x1),Math.abs(y2-y1))*((x2-x1)/Math.abs(x2-x1))
            y2=y1+Math.min(Math.abs(x2-x1),Math.abs(y2-y1))*((y2-y1)/Math.abs(y2-y1))
        }
    }
    const coords = { x: x1, y: y1 };
    const newCoords = { x: x2, y: y2 };
    if (doog===""||doog==="snap"){
        if (doog==="snap") {
            let ab_x = x2-x1
            let ab_y = y2-y1
            let abc123 = Math.round((180*(Math.atan(ab_x/ab_y)+((((ab_y-Math.abs(ab_y))/ab_y)/2)*Math.PI)))/(45*Math.PI))*((Math.PI*45)/180)
            newCoords.x = x1+Math.sin(abc123)*Math.sqrt(Math.pow(ab_x,2)+Math.pow(ab_y,2))
            newCoords.y = y1+Math.cos(abc123)*Math.sqrt(Math.pow(ab_x,2)+Math.pow(ab_y,2))
        }
        canvas.dispatchEvent(createMouseEvent('mousedown', coords, true));
        canvas.dispatchEvent(createMouseEvent('mousemove', newCoords, true));
        canvas.dispatchEvent(createMouseEvent('mouseup', newCoords, true));
    }
    if (doog==="rect") {
        canvas.dispatchEvent(createMouseEvent('mousedown',coords,true));
        canvas.dispatchEvent(createMouseEvent('mousemove',{x:x2,y:y1},true));
        canvas.dispatchEvent(createMouseEvent('mousemove',{x:x2,y:y2},true));
        canvas.dispatchEvent(createMouseEvent('mousemove',{x:x1,y:y2},true));
        canvas.dispatchEvent(createMouseEvent('mousemove',coords,true));
        canvas.dispatchEvent(createMouseEvent('mouseup',coords,true));
        if(gridenabled===true){
            if(gridvert>0){for (let i=1;i<=gridvert;i++){
                canvas.dispatchEvent(createMouseEvent('mousedown',{x:x1,y:y1+((y2-y1)/(gridvert+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mousemove',{x:x2,y:y1+((y2-y1)/(gridvert+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mouseup',{x:x2,y:y1+((y2-y1)/(gridvert+1))*i},true));
            }}
            if(gridhori>0){for (let i=1;i<=gridhori;i++){
                canvas.dispatchEvent(createMouseEvent('mousedown',{x:x1+((x2-x1)/(gridhori+1))*i,y:y1},true));
                canvas.dispatchEvent(createMouseEvent('mousemove',{x:x1+((x2-x1)/(gridhori+1))*i,y:y2},true));
                canvas.dispatchEvent(createMouseEvent('mouseup',{x:x1+((x2-x1)/(gridhori+1))*i,y:y2},true));
            }}
        }
    }
    if (doog==="circ") {
        let i
        for (i = 0; i<36; i++) {
            canvas.dispatchEvent(createMouseEvent('mousedown', {x:(x1+(x2-x1)/2)+Math.sin(((i)*10*Math.PI)/180)*((x2-x1)/2),y:(y1+(y2-y1)/2)+Math.cos(((i)*10*Math.PI)/180)*((y2-y1)/2)}, true));
            canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*10*Math.PI)/180)*((x2-x1)/2),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*10*Math.PI)/180)*((y2-y1)/2)}, true));
            if(i===35){
                canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*10*Math.PI)/180)*((x2-x1)/2),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*10*Math.PI)/180)*((y2-y1)/2)}, true));
            }
        }
        if(gridenabled===true){
            if(gridhori>0){
                if(gridvert===0&&gridhori===1){
                    for (let ie=1;ie<=gridhori;ie++){
                        for (i = 0; i<36/(gridhori+2)*ie; i++){
                            canvas.dispatchEvent(createMouseEvent('mousedown', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+2)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+2)*ie)}, true));
                            canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+2)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+2)*ie)}, true));
                            if(gridhori<=8){
                                if(i===(36/(gridhori+2)*ie)-1){
                                    canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+2)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+2)*ie)}, true));
                                }
                            }else{
                                canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+2)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/(36/(gridhori+2)*ie))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+2)*ie)}, true));
                            }
                        }
                    }
                }else{
                    for (let ie=1;ie<=gridhori;ie++){
                        for (i = 0; i<clamp(36/(gridhori+1)*ie,7,36); i++){
                            canvas.dispatchEvent(createMouseEvent('mousedown', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+1)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+1)*ie)}, true));
                            canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+1)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+1)*ie)}, true));
                            if(gridhori<=8){
                                if(i===(clamp(36/(gridhori+1)*ie,7,36))-1){
                                    canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+1)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+1)*ie)}, true));
                                }
                            }else{
                                canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((x2-x1)/2)/(gridhori+1)*ie),y:(y1+(y2-y1)/2)+Math.cos(((i+1)*(360/clamp(36/(gridhori+1)*ie,7,36))*Math.PI)/180)*(((y2-y1)/2)/(gridhori+1)*ie)}, true));
                            }
                        }
                    }
                }
            }
            if(gridvert>0){
                for (let i = 0; i<gridvert; i++) {
                    canvas.dispatchEvent(createMouseEvent('mousedown', {x:x1+(x2-x1)/2,y:y1+(y2-y1)/2}, true));
                    canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/gridvert)*Math.PI)/180)*((x2-x1)/2),y:(y1+(y2-y1)/2)-Math.cos(((i)*(360/gridvert)*Math.PI)/180)*((y2-y1)/2)}, true));
                    canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/gridvert)*Math.PI)/180)*((x2-x1)/2),y:(y1+(y2-y1)/2)-Math.cos(((i)*(360/gridvert)*Math.PI)/180)*((y2-y1)/2)}, true));
                }
            }
        }
    }
    if (doog==="rhom") {
        canvas.dispatchEvent(createMouseEvent('mousedown', {x:x1,y:y1+(y2-y1)/2}, true));
        canvas.dispatchEvent(createMouseEvent('mousemove', {x:x1+(x2-x1)/2,y:y1}, true));
        canvas.dispatchEvent(createMouseEvent('mousemove', {x:x2,y:y1+(y2-y1)/2}, true));
        canvas.dispatchEvent(createMouseEvent('mousemove', {x:x1+(x2-x1)/2,y:y2}, true));
        canvas.dispatchEvent(createMouseEvent('mousemove', {x:x1,y:y1+(y2-y1)/2}, true));
        canvas.dispatchEvent(createMouseEvent('mouseup', {x:x1,y:y1+(y2-y1)/2}, true));
        if(gridenabled===true){
            if(gridvert>0){for (let i=1;i<=gridvert;i++){
                canvas.dispatchEvent(createMouseEvent('mousedown',{x:x1+(((x2-x1)/2)/(gridvert+1))*i,y:y1+((y2-y1)/2)-(((y2-y1)/2)/(gridvert+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mousemove',{x:x1+((x2-x1)/2)+(((x2-x1)/2)/(gridvert+1))*i,y:y2-(((y2-y1)/2)/(gridvert+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mouseup',{x:x1+((x2-x1)/2)+(((x2-x1)/2)/(gridvert+1))*i,y:y2-(((y2-y1)/2)/(gridvert+1))*i},true));
            }}
            if(gridhori>0){for (let i=1;i<=gridhori;i++){
                canvas.dispatchEvent(createMouseEvent('mousedown',{x:x1+((x2-x1)/2)+(((x2-x1)/2)/(gridhori+1))*i,y:y1+(((y2-y1)/2)/(gridhori+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mousemove',{x:x1+(((x2-x1)/2)/(gridhori+1))*i,y:y1+((y2-y1)/2)+(((y2-y1)/2)/(gridhori+1))*i},true));
                canvas.dispatchEvent(createMouseEvent('mouseup',{x:x1+(((x2-x1)/2)/(gridhori+1))*i,y:y1+((y2-y1)/2)+(((y2-y1)/2)/(gridhori+1))*i},true));
            }}
        }
    }
    if (doog==="poly") {
        if((Number(altdist.value.replace(/\D/g,''))/100)===0){
            for (let i = 0; i<(sidespoly/2); i++) {
                canvas.dispatchEvent(createMouseEvent('mousedown', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i)*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i+1)*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                if(i===sidespoly-1){
                    canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/(sidespoly/2))*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i+1)*(360/(sidespoly/2))*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                }
            }
        }else{
            for (let i = 0; i<sidespoly; i++) {
                canvas.dispatchEvent(createMouseEvent('mousedown', {x:(x1+(x2-x1)/2)+Math.sin(((i)*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i)*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*(i%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                canvas.dispatchEvent(createMouseEvent('mousemove', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i+1)*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                if(i===sidespoly-1){
                    canvas.dispatchEvent(createMouseEvent('mouseup', {x:(x1+(x2-x1)/2)+Math.sin(((i+1)*(360/sidespoly)*Math.PI)/180)*(((x2-x1)/2)-((x2-x1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100)),y:(y1+(y2-y1)/2)-Math.cos(((i+1)*(360/sidespoly)*Math.PI)/180)*(((y2-y1)/2)-((y2-y1)/2)*((i+1)%2)*(Number(altdist.value.replace(/\D/g,''))/100))}, true));
                }
            }
        }
    }
}

function createMouseEvent(name, coords, bubbles = false) {
    return new MouseEvent(name, {
        bubbles: bubbles,
        clientX: coords.x,
        clientY: coords.y,
        button: 0
    });
}

const keys = { 32: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function isDrawing() {
    return document.querySelector('.containerTools').offsetParent !== null;
}

let supportsPassive = false;
try {
    window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
            return true;
        }
    }));
}
catch(e) {
    console.log(e);
}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener('touchmove', preventDefault, wheelOpt);
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

window.addEventListener('blur', hideLineCanvas);