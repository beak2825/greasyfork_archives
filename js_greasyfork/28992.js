// ==UserScript==
// @name         MooMoo.io modded UI
// @version      1.6.5
// @description  Removes unnecessary cards and ads, and makes changelog text bigger when updated, and other small UI improvements, hides UI after 10 seconds, reload button on disconnected removes server specification (Working as of July 13 2018)
// @author       someRandomGuy
// @match        *://*.moomoo.io/*
// @namespace https://greasyfork.org/users/117222
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMzQDW3oAAARdSURBVFhHvVdbbFRVFB0QDS3tJP5B6StECTODJJcaWpo2Y1/3zsu2WIYUaMKHCthAqLzCKLWx0bYQ4yPRL36U2KD4RyJ+KBUoAULCH01MBHkYAY0vSqGt0NmsdedMh5u504e9ZScr98w5++y19z77PMblhPj9/pza2toX6urq9hqG0Qt8BxzTdf0I+mJVVVUl1FHqzkogEGgB0UVgFKRxQzdEV2AbfWjrI3DkEtqvqWn/Tzo6OuYiknkEoiqC4W9JQAQChoTChjQ0GdLUDKw3pBFt9nEsqYc5x5Gt55XJqQkIF9bU1NTCwH4YOIzvceAX0yiMN641ZPPuoMQ+DMu7h8LS9UVEug9HpBPt2Ech2bonKGuidEBPOnIdGdkUjUafURT2AuL5IHwbygP4JlKciGI8ooZXdIl9HJKeL8NyoDeSEe2fhSXSgHmpZbmJoJYoqnSBQiMUr1C57KVWWbjye8nTTkih1i9F2jkp0E5LKfo5Ht0QkPZPQ3LwSDox+94BOZeEuop8AMvwoqKySklJydMYfAtRj6wGwSLtB3H7bohrqaQh1/u7UIcFF37ZkJ3vBS2ZYHtXdxCRg9gsTD0Ou0crKysXKTqrMOVQ+ABexhmd23fVlvhxZHv+lcXaj2aWgiFDtmC93/88bNZAayxoFqGKfBi2uxFgtqJLF0S+DV6OrjLJf7UlzAT38p+l1N9qVnzL6wHZ+GpgvPphcwjkzcyuokqX6upqLxTNlGZK+WRw+66PL4l5DqTWXBDcDkWVLtzX8PAnHcpMp53xqSLH+4fpRKn/DRTrWRRrv7k8cOJ+xrXH4HYgzolZy+7aGp4OspYNAnfGf3P3MBPIwleKMiWRSCQb5DxYzK31uCGnkOu9ncwC9/5SRZ0QpP85kN9g9Nmef2wNOAFuZzgwhixsAO2cBDsEa78GA/eoYDfRKbC2EGgcXJ/gCH5K0btc6NzKAa6T3USnUKSdSe6Io5btiM4YBxav7LOd6BSKtfNJB05aLiEeu0/SAeCMxQF4tI8DebPuwLmkA30WB3ACboETY7NdA4WpGvjaUgPYBUF0Ds7+LuijA7wNuy27AOQFwGWeAzmeP20nOwEGCAf+AxoUdUJ4BaPzG6Ynf4b3QCa4fb+ZjxdEfxVFX6ioUwLydRgco9ICz1+2RmYCFT3X/6CiTBcM9lPJ6WJ0+66Z9wBs366vr89VdOlSUVHxLLIwylpwL79ia2y64KOGWUVwD5H6dYoqs0CxERgyn2MzdIKPGr6sVOoPKIpJZQ6U2zBpiJnIw9ZZ4PnblmAi8C3J+bDzAPYOTfgOtJG5uLObmAl6z2zka6cmdYSPUx42LDi15qz6WHl5eeZ1n0hUTVygIYIR0TiLlMc27w7C/I1+FXEy5bdwwq5QpmYmcKIZRo/hew3fIRgfSxIp8N/SMEmBk9Dbj5MuS013RsrKyrJwYBWDgEXahoruBGkP2l0gfBPfjfiX7IUO/4KnXjuTisv1CLlw6nREjZu1AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/28992/MooMooio%20modded%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/28992/MooMooio%20modded%20UI.meta.js
// ==/UserScript==

console.log("MooMoo.io modded UI");

(function(){

addEventListener("click", function(e) { // changes the 'reload' button
	if (e.target.tagName == "A" && e.target.href == "javascript:window.location.href=window.location.href") {
		e.preventDefault();
		location.replace(location.origin);
	}
});

var sI = -1,
	hideAct = false;

function $(e){
	var a = document.querySelectorAll(e);
	if(a.length == 1){
		return a[0];
	} else if(a.length == 0){
		return null;
	} else {
		return a;
	}
	return a;
}

function getCookie(e){
	var c = document.cookie, g;
	c=c.split('; ');
	c.forEach(function(ob){
		var f=ob.split('=');
		if(f[0]==e){
			g=f[1];
			return;
		}
		return;
	}
			 );
	if(g!==undefined){
		return g;
	}else{
		return null;
	}
}

function resetInterval() {
    clearInterval(sI);

	if(hideAct){
		$("#mainMenu").classList.remove("hide");
		hideAct = false;
	}
	sI = setInterval(function(){
		hideActionMenu();
	}, 10e3);
}

function hideActionMenu() {
    hideAct = true;
    $("#mainMenu").classList.add("hide");
}

addEventListener("mousemove", function(){
	resetInterval();
});
addEventListener("keydown", function() {
    resetInterval();
});
document.body.addEventListener("focus", function() {
    resetInterval();
});
addEventListener("blur", function() {
    hideActionMenu();
});

Array.prototype.remove = function(){
	for(let i of this){
		i.remove();
	}
};

Element.prototype.remove = function(){
	this.parentElement.removeChild(this);
};

window.Worker = null;

addEventListener("load", function(){
	[$("#youtuberOf"), $("#adCard"), $("#followText"), $("#youtubeFollow"), $("#twitterFollow"), $(".menuCard[style='width:728px;display:inline-block;margin-top:10px;padding:10px;']")].remove();
	$("#promoImgHolder").innerHTML = "";
	{
		let a = [$("#serverBrowser"), $("#altServer")];
		for (var i = 0; i < a.length; i++) {
			$("#promoImgHolder").appendChild(a[i]);
		}
	}
	{
		let settings = $(".settingRadio"),
			parent = document.createElement("div");

		parent.classList.add("settings", "menuCard");
		parent.addEventListener("click", function(e) {
			if (e.target == this) { // prevent closing if user clicked settings
				this.classList.toggle("show");
			}
		});

		for (let i of settings) {
			parent.appendChild(i);
		}

		$("#menuCardHolder").children[0].appendChild(parent);
	}
	{
		let b = $("#skinColorHolder");
		$("#promoImgHolder").appendChild(b);
		$("#rightCardHolder").remove();
	}
	{
		let a = $("#linksContainer2").children[0];
		document.body.appendChild(a);
		$("#linksContainer2").innerHTML = "";
		$("#linksContainer2").appendChild(a);
		if(getCookie("tampermoneySaveChangelog")){
			document.cookie = 'tampermoneySaveChangelog =; expires=Thu, 01 Jan 1970 00:00:01 GMT;'; // remove old cookie
		}
		if(localStorage.tampermonkeyMoomooChangelogSave){
			if(localStorage.tampermonkeyMoomooChangelogSave == a.innerText){
				a.parentElement.style.opacity = .5;
			} else {
				a.style.fontSize = "5em";
				a.addEventListener("click", function(){
					localStorage.tampermonkeyMoomooChangelogSave = a.innerText;
					a.style.fontSize = "1em";
					a.parentElement.style.opacity = .5;
				});
			}
		} else {
			localStorage.tampermonkeyMoomooChangelogSave = a.innerText;
		}
	}
	{
		// custom css!
		let e = document.createElement("style");
		e.innerHTML = `
.skinColorItem {
    transition: 0.15s;
    opacity: 0.75;
    will-change: border-radius, opacity;
}

.activeSkin {
    opacity: 1;
}


#menuCardHolder div, #gameName {
    opacity: 0.6;
    transition: 0.15s;
}

#menuCardHolder div:hover, #gameName:hover {
    opacity: 0.99;
}

#mainMenu {
    transition: 0.15s;
}

#mainMenu.hide {
    cursor: none;
    opacity: 0;
}

.menuCard {
    margin-top: 8px !important;
}

.settings::before {
    content: "Settings";
    font-size: 24px;
}

.settings .settingRadio {
    margin: 0;
}

.settings {
    padding: 12px 18px;
    cursor: pointer;
}

.settings.show {
    padding: 18px 18px;
}

.settings > div {
    display: none;
}

.settings.show > div {
    display: block;
}
`;
		document.head.appendChild(e);
	}
});

}());