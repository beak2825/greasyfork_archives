// ==UserScript==
// @name         FixBBCollabWBStudent
// @namespace    JJB TamperMonkey Scripts
// @version      1.0.0
// @description  Fix Broken BBCollab whiteboard to work a lot better.
// @author       Jeffrey Black
// @match        https://au.bbcollab.com/collab/ui/session/*
// @connect      self
// @connect      cloudfront.net
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434489/FixBBCollabWBStudent.user.js
// @updateURL https://update.greasyfork.org/scripts/434489/FixBBCollabWBStudent.meta.js
// ==/UserScript==

/* global PSPDFKit instance unsafeWindow*/
/*jshint esversion: 6 */

'use strict';

unsafeWindow.ptrPos={};
unsafeWindow.PtrActive=false;

//Base64 encoded pointer PNG file. Needs to be 20 px by 20 px.
let ptrImg='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAnFBMVEUAAAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/Ozv/rq7///9UwloDAAAAMXRSTlMAAgMECQwPEhkbICIlJygyNzo/QkhLU1ZZXWNtcHR3e4KGjpKWnqestrvBxsza4fH71DMWoQAAAAFiS0dEMzfVfF4AAADoSURBVCjPdVLZdoUwCGRL7/9/rpVAB5JYH1r0RGHCOjAdUWbKnEfl/RkCyYwIj7ZYn8MGS3tEqN8P8DFTBUIZOeF5beAzXoCU59UAzMPEdqiF3wDYIGp6AK/TU+mrMgzEUq0wQOuZRsJa97X7kEkKhylkfQ2V7FB4W1dDsoZ4ZWWJ0oULeAQTeESQ6U+x/BWil2JoNgKFCOIXUP8wpc02B09aY4+low8cq6+uCppPoKQUVV2lazZgD/f7G7NKX63tWZXdPWu6d8XQPHxM2O/Fx9VRXsD1cA5K5FDri9r3Mqyq9jLwf+vzA0d1y1be7MRDAAAAAElFTkSuQmCC';
//SVG for icon on toolbar.
let ptrsvg='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: rgba(0,0,0,0);"><defs><radialGradient id="radgrad"><stop offset="0%" stop-color="white" stop-opacity="1" /><stop offset="10%" stop-color="white" stop-opacity="1" /><stop offset="20%" stop-color="red" stop-opacity="1" /><stop offset="100%" stop-color="red" stop-opacity="0"/></radialGradient></defs><circle cx="12" cy="12" r="10" stroke="none" fill="url(#radgrad)" /></svg>';
let ColPicksvg='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: rgba(0,0,0,0);" focusable="false"><path d="M 12,12 L 7,3.33974596215561 A 10 10 0 0 1 17 3.33974596215561 Z" fill="red" /><path d="M 12,12 L 17,3.33974596215561 A 10 10 0 0 1 22 12 Z" fill="yellow" /><path d="M 12,12 L 22,12 A 10 10 0 0 1 17 20.6602540378444 Z" fill="green" /><path d="M 12,12 L 17,20.6602540378444 A 10 10 0 0 1 7 20.6602540378444 Z" fill="aqua" /><path d="M 12,12 L 7,20.6602540378444 A 10 10 0 0 1 2 12 Z" fill="blue" /><path d="M 12,12 L 2,12 A 10 10 0 0 1 7 3.33974596215562 Z" fill="magenta" /></svg>';

//extra Toolbar buttons.
let toolbarItems=[
	//Colour picker.
	{id:"CustColourPicker",type:"custom",title:"Show colour picker",icon:ColPicksvg,onPress: SetColourShow},
	//Toggle Pointer
	{id:"LASERPointer",type:"custom",title:"Pointer",icon:ptrsvg,onPress: ptrTog}
];

var ColPickCont,ColPickBord,ColPick,ColVal,ColPrev,ColPoint,Catcher;
var ColPickContId = 'ColourPickerCont';
var ColPickRad = 50;
var ColPickWidth = ColPickRad*2;
var ColPickPad = 10;
var ColPickMar = 10;
var Colour = {};
//Which color and preset to change, and which property of that preset. Defaults when showing colour picker.
var cid, ColPickP, ColPickPP;
var ColDragOff = {};
var ColCurrentDragging;

unsafeWindow.SetColourShow = function(){
	//SetColourShowInternal();
}

function SetColourShow(){
	if(!((ColPickCont = document.getElementById(ColPickContId)) && ColPick && ColVal && ColPrev)){
		createColourPicker();
	}
	if(ColPickCont.style.display === "none"){
		let instance=unsafeWindow.instance;
		ColPickCont.style.display = "block";
		cid=4;
		ColPickP="ink";
		ColPickPP="strokeColor";
		setColourPickerColourTool();
	} else {
		ColPickCont.style.display = "none";
	}
}

function setColourPickerColourTool(){
	let instance=unsafeWindow.instance;
	let ap=instance.currentAnnotationPreset;
	let app=null;
	if(ap && (ap=instance.annotationPresets[ap])){
		if(ap.strokeColor){
			app="strokeColor";
		} else if(ap.color){
			app="color"
		} else {
			for(let p in ap){
				if(p.toLowerCase().includes("color")){
					app=p;
					break;
				}
			}
		}
		if(app){
			ColPickP = instance.currentAnnotationPreset;
			ColPickPP = app;
			getColourId(ap[ColPickPP]);
		}
	}
	setColourPickerColour();
}

function setColourPickerColourPreset(e){
	let instance=unsafeWindow.instance;
	let ap=e.currentPreset;
	let np=e.newPresetProperties;
	let app=null;
	if(ap && (ap=instance.annotationPresets[ap]) && np){
		if(np.strokeColor){
			app="strokeColor";
		} else if(np.color){
			app="color"
		} else {
			for(let p in np){
				if(p.toLowerCase().includes("color")){
					app=p;
					break;
				}
			}
		}
		if(app){
			ColPickP = e.currentPreset;
			ColPickPP = app;
			getColourId(np[ColPickPP]);
		}
	}
	setColourPickerColour();
}

function getColourId(colour){
	cid=4;
	if(colour){
		let h=colour.toHex();
		for(let cols=PSPDFKit.Options.COLOR_PRESETS, i=0, ii=cols.length-1; i<ii; i++){
			if(cols[i].color && (cols[i].color.toHex() === h)){
				cid=i;
				return;
			}
		}
		PSPDFKit.Options.COLOR_PRESETS[cid].color=colour;
	}
}

function setColourPickerColour(){
	if(!ColPickCont){
		return;
	}
	let instance=unsafeWindow.instance;
	let tl=instance.currentAnnotationPreset;
	if(tl && (tl=instance.annotationPresets[tl])){

	}
	let r=PSPDFKit.Options.COLOR_PRESETS[cid].color.r;
	let g=PSPDFKit.Options.COLOR_PRESETS[cid].color.g;
	let b=PSPDFKit.Options.COLOR_PRESETS[cid].color.b;
	r=r/255;
	g=g/255;
	b=b/255;
	let v=Math.max(r,g,b);
	let c=v-Math.min(r,g,b);
	let s=(v>0 ? c/v : 0);
	let h=0;
	if(c){
		h=60;
		if(v === r){
			h *= ((g-b)/c);
		} else if (v === g){
			h *= (2 + (b-r)/c);
		} else {
			h *= (4 + (r-g)/c);
		}
	}
	if(h>360){
		h -= 360;
	}
	if(h<0){
		h += 360;
	}
	Colour.h = h;
	Colour.s = s;
	Colour.v = v;
	ColVal.value=Math.floor(v*100)/100;
	updateSlider();
	updateFilter();
	updateColPointer();
	updateColour(true);
}

function createColourPicker(){
	//Extra element to catch all the window move events. Added first to make sure it is below.
	Catcher = document.createElement('div');
	Catcher.style.cssText = 'position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: transparent; display: none;';
	document.body.appendChild(Catcher);

	//Main container.
	ColPickCont = document.createElement('div');
	ColPickCont.id = ColPickContId;
	ColPickCont.style.cssText = 'position: fixed; top: 200px; left: 20px; background: white; padding: '+ColPickPad+'px; border-radius: ' + (1 + ColPickMar + ColPickPad + ColPickRad) + 'px; display: none; cursor: move; z-index: 2000;';
	ColPickCont.addEventListener("mousedown", ColPalDragStart);
	ColPickCont.addEventListener("touchstart", ColPalTouchStart);

	//Border that is also used for previewing colour
	ColPickBord = document.createElement('div');
	ColPickBord.style.cssText = 'border: 1px solid; border-radius:' + (1 + ColPickRad + ColPickPad) + 'px;';
	ColPickCont.appendChild(ColPickBord);

	//Colour Picker
	ColPick = document.createElement('div');
	ColPick.style.cssText = 'width: '+ColPickWidth+'px; height: '+ColPickWidth+'px; border-radius: 50%; margin: '+ColPickMar+'px; background: radial-gradient(closest-side, white, transparent), conic-gradient(from 90deg, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0)); position: relative; cursor: pointer;';
	ColPick.addEventListener("click",ColPickClk);
	ColPickBord.appendChild(ColPick);

	//V slider
	ColVal = document.createElement('input');
	ColVal.type="range";
	ColVal.min=0;
	ColVal.max=1;
	ColVal.step=0.01;
	ColVal.style.cssText = 'appearance: none; width: '+ColPickWidth+'px; margin: '+ColPickMar+'px auto; display: block; border: 1px solid white; cursor: pointer;';
	ColVal.addEventListener("input",ColValUpd);
	ColVal.addEventListener("mousedown", StopProp);
	ColVal.addEventListener("touchstart", StopProp);
	ColPickBord.appendChild(ColVal);

	//Preview.
	ColPrev = document.createElement('div');
	ColPrev.style.cssText = 'width: 50px; height: 50px; margin: '+ColPickMar+'px auto; border-radius: 50%;';
	ColPickBord.appendChild(ColPrev);

	//Pointer inside colour picker.
	ColPoint = document.createElement('div');
	ColPoint.style.cssText = 'width: 8px; height: 8px; border-radius: 5px; border: 1px solid grey; position: absolute; transform: translate(-50%,-50%); cursor: pointer;';
	ColPick.addEventListener("mousedown",ColPointDragStart);
	ColPick.addEventListener("touchstart",ColPointTouchStart);
	ColPoint.addEventListener("mousedown",ColPointDragStart);
	ColPoint.addEventListener("touchstart",ColPointTouchStart);
	ColPickBord.appendChild(ColPoint);

	//Add to document.
	document.body.appendChild(ColPickCont);
}

function StopProp(e){
	e.stopPropagation();
}

function updateSlider(){
	let h=Colour.h;
	let l=(1-Colour.s/2)*100;
	ColVal.style.background = 'linear-gradient(to right, black, hsl('+h+', 100%, '+l+'%))';
}

function updateFilter(){
	ColPick.style.filter = "brightness("+Colour.v+")";
}

function updateColPointer(){
	let h=Colour.h*Math.PI/180;
	let x=ColPickMar + ColPickPad + ColPickRad*(1+Colour.s*Math.cos(h));
	let y=ColPickMar + ColPickPad + ColPickRad*(1+Colour.s*Math.sin(h));
	ColPoint.style.left = x + 'px';
	ColPoint.style.top = y + 'px';
}

function updateColour(justprev){
	let instance = unsafeWindow.instance;
	let h=Colour.h;
	let s=Colour.s;
	let v=Colour.v;
	let c = v*s;
	let m = v-c;
	let x=c*(1-Math.abs((h/60)%2-1));
	let [r,g,b]=[0,0,0];
	switch(Math.floor(h/60)){
		case 0:
			r=c;
			g=x;
			break;
		case 1:
			r=x;
			g=c;
			break;
		case 2:
			g=c;
			b=x;
			break;
		case 3:
			g=x;
			b=c;
			break;
		case 4:
			b=c;
			r=x;
			break;
		case 5:
			b=x;
			r=c;
			break;
	}
	r=Math.round((r+m)*255);
	g=Math.round((g+m)*255);
	b=Math.round((b+m)*255);
	let coltxt="rgb("+[r,g,b].join(',')+")";
	ColPrev.style.background = coltxt;
	ColPoint.style.background = coltxt;
	ColPickBord.style.borderColor = coltxt;
	if(!justprev){
		PSPDFKit.Options.COLOR_PRESETS[cid].color = new PSPDFKit.Color({r:r,g:g,b:b});
		if(ColPickP && ColPickPP){
			instance.annotationPresets[ColPickP][ColPickPP] = new PSPDFKit.Color({r:r,g:g,b:b});
		}
	}
}

function ColPickClk(e){
	ProcColFromPoint(e);
	e.stopPropagation();
	e.preventDefault();
}

function ProcColFromPoint(e){
	let r=ColPick.getBoundingClientRect();
	let x=e.clientX - r.x - (r.width/2);
	let y=e.clientY - r.y - (r.width/2);
	Colour.h=Math.atan2(y,x)*180/Math.PI;
	if(Colour.h<0){
		Colour.h += 360;
	}
	Colour.s=Math.min(1,Math.hypot(x,y)*2/r.width);
	updateColPointer();
	updateSlider();
	updateColour();
}

function ColPointDragStart(e){
	if(ColCurrentDragging){
		return;
	}
	ColCurrentDragging = true;
	e.stopPropagation();
	e.preventDefault();
	Catcher.style.display = 'block';
	window.addEventListener("mousemove", ColPointDrag);
	window.addEventListener("mouseup", ColPointDragStop);
	window.addEventListener("touchend", ColPointDragStop);
}

function ColPointTouchStart(e){
	if(ColCurrentDragging){
		return;
	}
	ColCurrentDragging = true;
	e.stopPropagation();
	e.preventDefault();
	window.addEventListener("touchmove", ColPointTouch);
	window.addEventListener("mouseup", ColPointDragStop);
	window.addEventListener("touchend", ColPointDragStop);
	Catcher.style.display = 'block';
}

function ColPointDrag(e){
	ProcColFromPoint(e)
	e.stopPropagation();
	e.preventDefault();
}

function ColPointTouch(e){
	if(e.touches[0]){
		ProcColFromPoint(e.touches[0]);
		e.stopPropagation();
	}
}

function ColPointDragStop(e){
	ColCurrentDragging = false;
	Catcher.style.display = 'none';
	e.stopPropagation();
	e.preventDefault();
	window.removeEventListener("mousemove", ColPointDrag);
	window.removeEventListener("touchmove", ColPointTouch);
	window.removeEventListener("mouseup", ColPointDragStop);
	window.removeEventListener("touchend", ColPointDragStop);
}

function ColValUpd(e){
	Colour.v = ColVal.value;
	updateFilter();
	updateColour();
}

function ColPalDragStart(e){
	if(ColCurrentDragging){
		return;
	}
	ColCurrentDragging = true;
	e.stopPropagation();
	e.preventDefault();
	let r = ColPickCont.getBoundingClientRect();
	ColDragOff.x = e.clientX-r.x;
	ColDragOff.y = e.clientY-r.y;
	Catcher.style.display = 'block';
	window.addEventListener("mousemove", ColPalDrag);
	window.addEventListener("mouseup", ColPalDragStop);
	window.addEventListener("touchend", ColPalDragStop);
}

function ColPalTouchStart(e){
	if(e.touches[0]){
		if(ColCurrentDragging){
			return;
		}
		ColCurrentDragging = true;
		e.stopPropagation();
		e.preventDefault();
		let r = ColPickCont.getBoundingClientRect();
		ColDragOff.x = e.touches[0].clientX-r.x;
		ColDragOff.y = e.touches[0].clientY-r.y;
		Catcher.style.display = 'block';
		window.addEventListener("touchmove", ColPalTouch);
		window.addEventListener("mouseup", ColPalDragStop);
		window.addEventListener("touchend", ColPalDragStop);
	}
}

function ColPalDrag(e){
	ColPalPos(e);
	e.stopPropagation();
	e.preventDefault();
}

function ColPalTouch(e){
	if(e.touches[0]){
		ColPalPos(e.touches[0]);
		e.stopPropagation();
	}
}
function ColPalPos(e){
	let r = ColPickCont.getBoundingClientRect();
	let x = e.clientX - ColDragOff.x;
	let y = e.clientY - ColDragOff.y;
	x = Math.max(10 - r.width, Math.min(x, window.innerWidth - 10));
	y = Math.max(10 - r.height, Math.min(y, window.innerHeight - 10));
	ColPickCont.style.left = x + 'px';
	ColPickCont.style.top = y + 'px';
}

function ColPalDragStop(e){
	ColCurrentDragging = false;
	Catcher.style.display = 'none';
	e.stopPropagation();
	e.preventDefault();
	window.removeEventListener("mousemove", ColPalDrag);
	window.removeEventListener("touchmove", ColPalTouch);
	window.removeEventListener("mouseup", ColPalDragStop);
	window.removeEventListener("touchend", ColPalDragStop);
}

// Functions to handle pointer. Need to use unsafeWindow to expose from script to page.
function ptrTog(){
	if(unsafeWindow.PtrActive){
		ptrEnd();
	} else {
		let instance = unsafeWindow.instance;
		if(instance.viewState.toJS().readonly){
			return;
		}
		instance.contentWindow.addEventListener("mousemove", trackPtr);
		instance.setViewState(s=>s.set("interactionMode",null));
		createPointer();
	}
}

function createPointer(){
	let instance = unsafeWindow.instance;
	return fetch(ptrImg)
	.then(r=>r.blob())
	.then(b=>instance.createAttachment(b))
	.then(imageAttachmentId=>
		new PSPDFKit.Annotations.ImageAnnotation({
			pageIndex: instance.viewState.currentPageIndex,
			contentType: "image/png",
			imageAttachmentId,
			boundingBox: new PSPDFKit.Geometry.Rect({
				left: -10,
				top: -10,
				width: 20,
				height: 20
			}),
		})
	)
	.then(instance.create)
	.then(instance.ensureChangesSaved)
	.then(a=>{
		unsafeWindow.lpa=a[0]; 
		unsafeWindow.PtrActive=true;
		return a;
	});
}

function trackPtr(e){
	let instance = unsafeWindow.instance;
	if(instance.viewState.toJS().readonly){
		ptrEnd();
		return;
	}
	let lpa=unsafeWindow.lpa;
	if(!(unsafeWindow.PtrActive && lpa)){
		return;
	}
	let canv=instance.contentDocument.getElementsByClassName('PSPDFKit-Zoom')[0];
	if(!canv){
		canv=instance.contentDocument.getElementsByTagName('img')[0];
	}
	if(!canv){
		return;
	}
	let abs=Math.abs;
	let min=Math.min;
	let max=Math.max;
	let lx = unsafeWindow.ptrPos.lx || 0;
	let ly = unsafeWindow.ptrPos.ly || 0;
	let pi = instance.pageInfoForIndex(instance.viewState.currentPageIndex);
	let w = pi.width;
	let h = pi.height;
	let bb = canv.getBoundingClientRect();
	let sf=w/bb.width;
	let x=max(11,min(w-11,(e.clientX - bb.x)*sf))-10;
	let y=max(11,min(h-11,(e.clientY - bb.y)*sf))-10;
	let dx=x-ly;
	let dy=y-ly;
	if(abs(dx) + abs(dy) > 10){
		let na = lpa.set("boundingBox", new PSPDFKit.Geometry.Rect({left: x,top: y,width: 20,height: 20}))
		instance.update(na).then(instance.ensureChangesSaved).catch(function(){});
		unsafeWindow.ptrPos.lx=x;
		unsafeWindow.ptrPos.ly=y;
	}
}

function ptrEnd(e){
	document.getElementsByTagName('iframe')[0].contentWindow.removeEventListener("mousemove", trackPtr);
	deletePointer();
}

function deletePointer(){
	let instance = unsafeWindow.instance;
	let lpa=unsafeWindow.lpa;
	delete unsafeWindow.lpa;
	unsafeWindow.PtrActive=false;
	if(lpa && !instance.viewState.toJS().readonly){
		return instance.delete(lpa)
		.then(instance.ensureChangesSaved);
	}
}

//Stuff for changing page and keeping annotation mode.
var changingPage=false;
var updatingVS=false;
var LastIntMode = null;
var LastPreset = null;
var JustCreatedAnnotation = null;
var CreatorName = null;

function pageChangeHandler(){
	changingPage = true;
}

function AnnotationCreationHandler(a){
	if(a.get(0).creatorName === CreatorName){
		JustCreatedAnnotation = true;
	}
}

function VSChangeHandler(e){
	if(updatingVS){
		return;
	}
	let instance = unsafeWindow.instance;
	if(changingPage){
		updatingVS=true;
		if(LastPreset){
			instance.setCurrentAnnotationPreset(LastPreset);
		}
		if(LastIntMode){
			instance.setViewState(vs=>vs.set("interactionMode",LastIntMode));
		}
		if(unsafeWindow.PtrActive){
			deletePointer();
			createPointer();
		}
		updatingVS=false;
		changingPage=false;
	} else if(JustCreatedAnnotation && LastIntMode && ((LastIntMode === 'TEXT') || LastIntMode.includes('SHAPE'))){
		updatingVS=true;
		if(LastIntMode.includes('SHAPE_LINE')){
			window.setTimeout(fixViewState,0);
		} else {
			fixViewState();
		}
	} else {
		if(unsafeWindow.PtrActive){
			ptrEnd();
		}
		LastIntMode = instance.viewState.interactionMode;
		LastPreset = instance.currentAnnotationPreset;
		setColourPickerColourTool();
	}
	JustCreatedAnnotation=false;
}

function fixViewState(){
	instance.setSelectedAnnotation();
	if(LastPreset){
		instance.setCurrentAnnotationPreset(LastPreset);
	}
	instance.setViewState(vs=>vs.set("interactionMode",LastIntMode));
	updatingVS=false;
}

function setCreatorName(name){
	CreatorName = name;
	console.log("setting creator name to ", name);
}

//setup instance and unload handler.
var unloadhandlersetup = false;
unsafeWindow.PreInstanceInit = function(C){
	try{
		PSPDFKit.Options.INK_EPSILON_RANGE_OPTIMIZATION === 0 || (PSPDFKit.Options.INK_EPSILON_RANGE_OPTIMIZATION=0);
		PSPDFKit.Options.MIN_INK_ANNOTATION_SIZE === 1 || (PSPDFKit.Options.MIN_INK_ANNOTATION_SIZE=1);
	} catch(e){
	}
	PSPDFKit.defaultAnnotationPresets.ink.lineWidth=1;
	C.toolbarItems.splice(6,0,...toolbarItems);
	if(!unloadhandlersetup){
		let normalUnload = PSPDFKit.unload;
		PSPDFKit.unload = function(n){
			try{
				if(ColPickCont){
					ColPickCont.style.display = "none";
				}
				ptrEnd();
			}catch(e){}
			return normalUnload(n)
		}
		unloadhandlersetup = true;
	}
}

//setup instance
unsafeWindow.InstanceInit = function(i){
	unsafeWindow.instance=i;
	let instance=unsafeWindow.instance;
	instance.addEventListener("viewState.currentPageIndex.change", pageChangeHandler);
	instance.addEventListener("annotations.create", AnnotationCreationHandler);
	instance.addEventListener("viewState.change", VSChangeHandler);
	instance.addEventListener("annotationPresets.update",setColourPickerColourPreset);
	var normalSetCreatorName=instance.setAnnotationCreatorName;
	instance.setAnnotationCreatorName = function(name){
		setCreatorName(name);
		return normalSetCreatorName(name);
	}
	try{
		if(instance.viewState.toJS().readOnly){
			console.log('Readonly, removing editing functions');
			instance.setToolbarItems(tis=>tis.filter(ti=>(!ti.id) || toolbarItems.findIndex(i=>i.id==ti.id) === -1));
		}
	} catch(e){
		console.log("Error processing read only state");
	}
	return i;
}


//Hijack loading of scripts to modify main and their pspdfkit loader.
unsafeWindow.loadChunk2 = function(el){
	let src=el.src;
	let f = false;
	if(src.includes('/js/main.')){
		f=fixMain;
	}
	if(src.includes('/js/pspdfkit.')){
		f=fixPSPDF;
	}
	if(f){
		GM_xmlhttpRequest({
			method: "GET",
			url: src,
			onload: f
		})
	} else {
		document.body.appendChild(el);
	}
};

//Fix up the main.js so the scroll mode is set to disabled to prevent issues with mousewheel and drawing a line to the left or right.
function fixMain(resp){
	let el = document.createElement('script');
	let scr = resp.responseText;
	scr = scr.replace('"PER_SPREAD"', '"DISABLED"');
	el.innerHTML = scr;
	document.body.appendChild(el);
}

//Modify the pspdf loader to include our custom toolbar functions, enhance drawing precision, and set the default line width to 1.
function fixPSPDF(resp){
	let el = document.createElement('script');
	let scr = resp.responseText;
	scr = scr.replace('PSPDFKit.load(C)',
		'window.PreInstanceInit(C),'
		+ 'PSPDFKit.load(C).then(window.InstanceInit)');
	el.innerHTML = scr;
	document.body.appendChild(el);
}

//Function to observe modification to page to modify script added as final part of body.
//Will modify the final stage of loadChunk to instead go through the above function to modify needed scripts rather than load them directly.
function mutob(mlist,observ){
	for(const mu of mlist){
		if((mu.type === 'childList') && (mu.target === document.body)){
			for(const el of mu.addedNodes){
				if((el.nodeName === 'SCRIPT') && el.innerHTML.includes('function loadChunk')){
					console.log("Modifying loading scripts.");
					el.innerHTML = el.innerHTML.replace('document.body.appendChild(element);', 'loadChunk2(element)');
					obs.disconnect();
					obsrunning=false;
				}
			}
		}
	}
}

function pgload(){
	if(obsrunning){
		console.log("Failed to catch loading scripts, falling back to alternate method");
		obs.disconnect();
		obsrunning=false;
		if(typeof PSPDFKit === 'object'){
			fallbackLoader();
		} else {
			window.setTimeout(ChkLoaded,10000);
			if(document.readyState==='complete'){
				chkLoadPSPDFKit();
			} else {
				window.addEventListener('load', chkLoadPSPDFKit);
			}
		}
	}
}

function ChkLoaded(){
	if(!PSPDFKitModuleLoaded){
		if(fcnt>=100){
			if(typeof PSPDFKit === undefined){
				window.alert("Error fixing whiteboard. Plese refresh the page to try again.");
			} else {
				PSPDFKitModuleLoaded=true;
				fallbackLoader();
			}
		} else {
			window.setTimeout(ChkLoaded,10000);
		}
	}
}

function chkLoadPSPDFKit(){
    if(PSPDFKitModuleLoaded){
        return;
    }
    if(typeof PSPDFKit === 'undefined'){
        if(fcnt<100){
            fcnt++;
            return window.setTimeout(chkLoadPSPDFKit,100);
        }
        return;
    }
    PSPDFKitModuleLoaded=true;
    fallbackLoader();
}

function fallbackLoader(){
	'use strict';
	console.log("Adding modified PSPDFKit.load function");
	try{
		PSPDFKit.Options.INK_EPSILON_RANGE_OPTIMIZATION === 0 || (PSPDFKit.Options.INK_EPSILON_RANGE_OPTIMIZATION=0);
		PSPDFKit.Options.MIN_INK_ANNOTATION_SIZE === 1 || (PSPDFKit.Options.MIN_INK_ANNOTATION_SIZE=1);
	} catch(e){
		window.alert("Error fixing whiteboard. Whiteboard already loaded.\nStart and stop to enable most features.\nOr refresh the page to try again.");
	}
	var normalLoad = PSPDFKit.load;
	var initialViewState = {
                        layoutMode: "SINGLE",
                        scrollMode: "DISABLED",
                        zoomMode: "FIT_TO_VIEWPORT",
                        viewportPadding: {
                            horizontal: 0,
                            vertical: 0
                        }
                    }
	PSPDFKit.load = function(C){
		C.initialViewState = new PSPDFKit.ViewState(initialViewState);
		unsafeWindow.PreInstanceInit(C);
		return normalLoad(C).then(unsafeWindow.InstanceInit);
	}
}

//Check if watching a recording
if(window.location.href.includes('/ui/session/playback')){
	console.log('Watching recording. Not setting up scripts');
} else {
	//Observe page changes.
	var obs=new MutationObserver(mutob);
	var obsrunning=true;
	var PSPDFKitModuleLoaded=false;
	var fcnt=0;
	obs.observe(document,{childList:true, subtree: true});
	if((document.readyState==='interactive') || (document.readyState==='complete')){
		pgload();
	} else {
		window.addEventListener('DOMContentLoaded', pgload);
	}
}