// ==UserScript==
// @name     WSG Taiga Issue Enhancer
// @description Makes the Taiga Issue Tracker way better
// @version  1.2
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match https://taiga.whitesmokegames.com/*
// @match https://tree.taiga.io/*
// @namespace https://greasyfork.org/users/177087
// @downloadURL https://update.greasyfork.org/scripts/40040/WSG%20Taiga%20Issue%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/40040/WSG%20Taiga%20Issue%20Enhancer.meta.js
// ==/UserScript==

var input=document.createElement("input");
input.type="button";
input.value="Taiga Issue Enhancer";
input.disabled = false;
input.onclick = Enhance;
input.setAttribute("style", "height:50px;font-size:20px;position: fixed;top:5px;left:350px;color:black;background: linear-gradient(#e66465, #9198e5);font-weight:bold;border-radius:3px;font-family:OpenSans-Light,Arial,Helvetica,sans-serif;");
document.body.appendChild(input); 


(function(){
document.addEventListener('keydown', function(e) {
  // pressed ALT + Z (90)
  if (e.keyCode == 90 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   Enhance();
  }
}, false);
})();

function Enhance()
{
	var y = document.getElementsByClassName("row table-main");
  //console.log(y);
	var i;
	for (i = 0; i < y.length; i++)
	{
    //Enhance Type Cells
    var type = "<div style=\"display:inline-block;padding:3px 7px 3px 7px;font-size:14px;font-family:'Lato', sans-serif;color:white;font-weight:bold;border-radius:3px;" + y[i].childNodes[1].firstElementChild.attributes.style.value + "\" title=\"" + y[i].childNodes[1].lastChild.title + "\">" + y[i].childNodes[1].lastChild.title + "</div>";
	  y[i].childNodes[1].innerHTML = type;
    
    //Enhance Severity Cells
    //var severity = "<div style=\"display:inline;padding:3px 7px 3px 7px;font-size:14px;font-family:'Lato', sans-serif;color:black;font-weight:bold;border-radius:3px;" + y[i].childNodes[3].firstElementChild.attributes.style.value + "\" title=\"" + y[i].childNodes[3].lastChild.title + "\">" + y[i].childNodes[3].lastChild.title + "</div>";
		//y[i].childNodes[3].innerHTML = severity;
    
    //Hide Severity Cells
    y[i].childNodes[3].outerHTML = "<div style=\"width:10px;\"></div>";
		
    //Enhance Priority Cells
    var priority = "<div style=\"display:inline;padding:3px 7px 3px 7px;font-size:14px;font-family:'Lato', sans-serif;color:white;font-weight:bold;border-radius:3px;" + y[i].childNodes[5].firstElementChild.attributes.style.value + "\" title=\"" + y[i].childNodes[5].lastChild.title + "\">" + y[i].childNodes[5].lastChild.title + "</div>";
	  y[i].childNodes[5].innerHTML = priority;
    
		//Enhance vote Cells
    
    if (y[i].childNodes[8].childNodes.length == 4)
    {
    	// ITEM IS NOT VOTED
      var vote = "<span>" + y[i].childNodes[8].childNodes[2].textContent + "</span>";
	  	y[i].childNodes[8].childNodes[2].innerHTML = vote;
      
      // SET COLOR FOR NUMBER OF VOTES
      var count = Number(y[i].childNodes[8].childNodes[2].textContent);
      if (count == 1)
	  		y[i].childNodes[8].childNodes[2].style = "color:orange;font-weight:bold;";
      else if (count > 1)
	  		y[i].childNodes[8].childNodes[2].style = "color:red;font-weight:bold;";
			else
	  		y[i].childNodes[8].childNodes[2].style = "color:green;font-weight:bold;";
    }
    else if (y[i].childNodes[10].childNodes.length == 4)
    {
      //ITEM IS VOTED
      var vote = "<span>" + y[i].childNodes[10].childNodes[2].textContent + "</span>";
	  	y[i].childNodes[10].childNodes[2].innerHTML = vote;

      // SET COLOR FOR NUMBER OF VOTES
      var count = Number(y[i].childNodes[10].childNodes[2].textContent);
      if (count == 1)
	  		y[i].childNodes[10].childNodes[2].style = "color:orange;font-weight:bold;";
      else if (count > 1)
	  		y[i].childNodes[10].childNodes[2].style = "color:red;font-weight:bold;";
			else
	  		y[i].childNodes[10].childNodes[2].style = "color:green;font-weight:bold;";
    }
    
    //Enhance Status Cells
	  y[i].childNodes[15].childNodes[0].style.fontWeight = "900";
	}
  
  //Hide Severity Column
  var table = document.getElementsByClassName("issues-table");
  table[0].childNodes[1].childNodes[3].outerHTML = "<div style=\"width: 10px;\"></div>";
}