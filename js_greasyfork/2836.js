// ==UserScript==
// @name       Instructions Hider Jason Daly
// @version    0.1
// @description  Toggles instructions for Jason Daly hits
// @match      https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/2836/Instructions%20Hider%20Jason%20Daly.user.js
// @updateURL https://update.greasyfork.org/scripts/2836/Instructions%20Hider%20Jason%20Daly.meta.js
// ==/UserScript==

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
        };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
        };
    this.GM_deleteValue = function(key) {
        return localStorage.removeItem(key);
    };
}

if (document.getElementsByClassName("panel panel-primary")[0]){
    container = document.createElement("div");
    link = document.createElement("a");
    link.innerHTML = " Click to hide instructions";
    link.style.color="white";
    link.addEventListener("click", function(){
        toggle();
    }, false);
    link.setAttribute("id","displayText");
    document.getElementsByClassName("panel-heading")[0].appendChild(link);
    
    div = document.getElementsByClassName("panel-body")[0];
    div.setAttribute("id","instructions");
    
    if (GM_getValue("IsVisible")){
        document.getElementsByClassName("panel-body")[0].style.display='none';
    }
}

function toggle() {
	var ele = document.getElementById("instructions");
	var text = document.getElementById("displayText");
	if(ele.style.display != "none") {
    	ele.style.display = "none";
		text.innerHTML = " Click to show instructions";
        GM_setValue("IsVisible",1);
  	}
	else {
        GM_deleteValue("IsVisible");
		ele.style.display = "block";
		text.innerHTML = " Click to hide instructions";
	}
} 
    