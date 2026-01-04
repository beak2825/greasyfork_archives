function ShowUserHome(){
	document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked").style.removeProperty('display');
	document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)").remove();
}
