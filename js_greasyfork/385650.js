// ==UserScript==
// @name         Skin Storage Script
// @namespace    http://tampermonkey.net/
// @version      0.54
// @description  a script to easily store as many skins as you want
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385650/Skin%20Storage%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385650/Skin%20Storage%20Script.meta.js
// ==/UserScript==

/**************************
    Skin Storage Script
**************************/
(function() {

    window.addEventListener('load', function(){

localStorage.customSkins = localStorage.customSkins || "";
localStorage.activeSkins = localStorage.activeSkins || "";
localStorage.randomizeKey = localStorage.randomizeKey || 'F4'

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


document.getElementsByName("bSkin").forEach((radioButton, i)=>{
	i>2&&(radioButton.type = "checkbox")
})

var randomizeOption = document.createElement("tr");
randomizeOption.innerHTML = '<td>Randomize skin:</td><td><input maxlength="1" id="input421" type="text" size="7" value="'+localStorage.randomizeKey+'"></td><td id="kc421">0</td>'
tab_controls.children[2].appendChild(randomizeOption);


var randomizeListener = `"input421\"==e.target.id?(e.preventDefault(),input421.value=e.key,kc421.innerHTML=e.keyCode,localStorage.randomizeKey=e.key):e.key==localStorage.randomizeKey&&Game['deployRandomSkin']();\n`

if(window.onkeyup == null) {
	window.onkeyup = function(e){}
}

var keyupFunc = window.onkeyup.toString()

if(!keyupFunc.endsWith(randomizeListener)){
	keyupParams = getParams(keyupFunc)
	keyupFunc = trim(keyupFunc) + randomizeListener
	window.onkeyup = new Function(...keyupParams, keyupFunc)
}






var plusButton=document.createElement("div");
plusButton.style = "width:20px;height:20px;background-color:green;text-align:center;font-weight:1000";
plusButton.innerHTML = "+";
plusButton.id = "plusButton";


var modalStyles=document.createElement("style");
modalStyles.innerHTML='#skinModal {display: none;position: fixed;z-index: 100;padding-top: 200px;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.4)} #modalContent {color:black;background-color: white;margin: auto;padding: 20px;border: 1px solid #888;width: 60%} .xbutton {width:20px;height:20px;background-size:cover;margin-bottom:4px;margin-left:20px;filter: invert(100%)}';
document.body.appendChild(modalStyles);

var modal=document.createElement("div");
modal.id = "skinModal";
modal.innerHTML = '<div id="modalContent"><p>Please enter the new skin url. For animated skins, use this format: url1;size1 url2;size2 ...</p><input id="modalInput" style="border:2px solid black;z-index: 1000" type="text" value="https://i.imgur.com/u4SJJgE.png"><br><br><button id="modalClose" style="float:left down">Cancel</button><button id="modalConfirm" style="float:left down">OK</button></div></div>'
app.appendChild(modal);


var skinModalText = "";

modalConfirm.onclick = J=>{
	addSkin(1)
}

modalClose.onclick = N=>{
	addSkin(0)
}

function addSkin(flag) {
	skinModal.style.display = "none";
	skinModalText = modalInput.value
	if(skinModalText == ""){flag = 0}
	modalInput.value = "";

	if(!flag){
		return;
	}

    var skinNumber = localStorage.customSkins.split(",").length-1;
    localStorage.customSkins += ","+skinModalText;
    refreshSkins()

}

plusButton.onclick = X=>{
    skinModal.style.display = "block";
}

document.getElementsByName("blockSkin")[0].appendChild(plusButton);


function refreshSkins() {
	stopPreviewAnimation();
	var oldContainer = document.getElementById("allSkinContainer");
	oldContainer.parentNode.removeChild(oldContainer);
	addSkins();
	startPreviewAnimation();
}


function addSkins() {
	var skins = localStorage.customSkins.split(",")
	var allSkinContainer = document.createElement("div")
	allSkinContainer.id = "allSkinContainer"

	skins.map((skin,i)=>{
		if(i>0) {
		var src = skin.split(";")[0];
		allSkinContainer.innerHTML += `<div><input id="bskin`+i+`" type="checkbox" name="bSkin"><label for="bskin`+i+`"><img src="`+src+`" height="20"></label><img src="https://jstris.jezevec10.com/res/svg/dark/rubbish.svg" name="xbutton" class="xbutton" ></div>`
		var xbutton = document.getElementById("xbutton")
		}
	})

	document.getElementsByName("blockSkin")[0].insertBefore(allSkinContainer,plusButton)
	document.getElementsByName("xbutton").forEach((button, i)=>{
		button.addEventListener("click", W=>{var temp=localStorage.customSkins.split(',');temp.splice(i+1, 1);localStorage.customSkins=temp;refreshSkins()});
	})

}



function testCors(url) {
	/*
	var skinImg = new Image();
	skinImg.onload = function(){
	    loadSkin(this.src,this.height)
	};
	*/
    var myRequest = new XMLHttpRequest();
    myRequest.open('GET', url, true);
    myRequest.onreadystatechange = () => {
        if (myRequest.readyState !== 4) {
        	return
            //skinImg.src = url
        }
        if (myRequest.status != 200) {
            var myImage = document.createElement('img');
            //myImage.onerror=x=>{skinImg.src = "https://s.jezevec10.com/res/b1.png";}
            myImage.onload=a=>{loadSkin("https://s.jezevec10.com/res/b1.png",32)/*loadSkin("https://cors-anywhere.herokuapp.com/" + myImage.src, myImage.height);*/}
            myImage.src = url;
        } else {
        	var myImage = document.createElement('img');
        	myImage.onload=a=>{loadSkin(myImage.src, myImage.height);}
        	myImage.src = url
        }
    };
    myRequest.send();
}



function loadSkinNoSize(src) {
	var spliced = src.split(";")
    console.log(src)
	if(spliced.length>1){
		Game['animatedSkin'] = src.split(" ").map(x=>x.split(";"))
	}

	if(spliced[0].endsWith(".mp4") || spliced[0].endsWith(".webm") || spliced[0].endsWith(".gif")){
		loadVideoSkin(spliced[0])
	} else {
		testCors(spliced[0])
	}

}



Game['deployRandomSkin'] = function() {
	if (typeof Game['stopAnim'] == 'function') {
  		Game['stopAnim']();
  		Game['animatedSkin'] = []
	}

	var candidates = localStorage.activeSkins.split(",").slice(1);
	var choice = candidates[Math.floor(Math.random()*candidates.length)];
console.log(choice)
var numberOfDefaultSkins = document.getElementsByName("bSkin").length - localStorage.customSkins.split(",").length
	if(choice > numberOfDefaultSkins-1) {
		frames = localStorage.customSkins.split(",")[choice-numberOfDefaultSkins].split(" ")

		if(frames.length>1){
    		Game['animatedSkin'] = frames.map(x=>x.split(";"))
    		Game['animationRunning']&&Game['startAnim']();
    	}
	}

    loadSkinNoSize(document.getElementsByName("bSkin")[choice].nextSibling.children[0].src)
}


settingsSave.onmouseup = Y=>{

	try{
		stopPreviewAnimation();

		localStorage.activeSkins = ""
    	document.getElementsByName("bSkin").forEach((e,i)=>{
    	    if(i>2 && e.checked){
    	    	localStorage.activeSkins += ","+i;
   	    	}
   		})
   		Game['deployRandomSkin']()
	} catch(e) {
		console.log("_")
	}

}








var randomizeStart = Game['prototype']['readyGo'].toString()
randomizeStart = trim(randomizeStart) + ";setTimeout(x=>{Game['deployRandomSkin']()}, "+0+");"
Game['prototype']['readyGo'] = new Function(randomizeStart);





settings.onmouseup = Z=>{
	startPreviewAnimation();

	setTimeout(U=>{
		for(var checkbox of document.getElementsByName("bSkin")) {
			checkbox.checked = false;
		}
		var skins = localStorage.activeSkins.split(",");
		if(skins.length > 0) {
			for (var i = 1; i < skins.length; i++) {
				document.getElementsByName("bSkin")[skins[i]].checked = true
			}
		} else {
			document.getElementsByName("bSkin")[3].checked = true
		}

	}, 100)
}


var previewIntervals = []
var previewsAnimated = false;

function startPreviewAnimation() {
	var skins = localStorage.customSkins.split(",")

	skins.map((skin,j)=>{
		var frames = skin.split(" ").map(x=>x.split(";"))
		if(frames.length > 1) {

			var animLength = frames.length*localStorage.animSpeed
			frames.map((x,i)=>{
				setTimeout(()=>{previewIntervals.push(setInterval(()=>{
					document.getElementById("bskin"+j).nextSibling.children[0].src = frames[i][0]
				}, animLength))}, i*(animLength/frames.length))
			})
		}
	})
	previewsAnimated = true
}

function stopPreviewAnimation() {
	for (var i=0; i < previewIntervals.length; i++) {
        clearInterval(previewIntervals[i]);
    }
}

addSkins();
Game['deployRandomSkin']();

    });
})();