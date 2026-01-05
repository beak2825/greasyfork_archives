// ==UserScript==
// @name           Slavehack Tools
// @description    ip/bank account remover, filter IPs for easier copying
// @include        http://www.slavehack.com/index2.php*
// @version        1.2
// @grant          none
// @namespace https://greasyfork.org/users/93760
// @downloadURL https://update.greasyfork.org/scripts/26421/Slavehack%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/26421/Slavehack%20Tools.meta.js
// ==/UserScript==
// 
//How to use
//
//
// 1. Add ips and bank accounts like this ["123.123.123.123","123665"] and change the mask if you so wish E.G your username.
// 		adding bank account numbers allows the script to remove account numbers after collecting money.
// 		
// 2. After doing any action the script will go back to the logs to remove your IP.

var myip = ["1.1.1.1","123456","6543211","142536"];
//what to change the above to.
var mask = "";

if (document.getElementById("editlog")){ // If log file on page
  for(x = 0; x < myip.length; x++){
    if (document.getElementById("editlog").innerHTML.match(myip[x])){ //Filtered list found in logs
        var logFile = document.getElementById("editlog");
        var events = logFile.innerHTML.split("\n");
        var replacement = "";
        for (i = 0; i < events.length; i++){
            events[i] = events[i].replace(myip[x], mask);
            replacement = replacement + events[i] + "\n";
        }
        logFile.innerHTML = replacement;
        document.getElementById("editlog").parentNode.submit()
    }  
  }
  
  //This removes all text and leaves IPs
  var listButton = document.createElement("input");
  listButton.setAttribute("type","button")
  listButton.setAttribute("class","form")
  listButton.setAttribute("value","List Address")
  listButton.setAttribute("id","listButton")
  document.getElementById("editlog").parentNode.appendChild(listButton, document.getElementById("editlog"));
  document.getElementById("listButton").addEventListener("click", list, true);
  
  //Empties log
  var listButton = document.createElement("input");
  listButton.setAttribute("type","button")
  listButton.setAttribute("class","form")
  listButton.setAttribute("value","Clear Log")
  listButton.setAttribute("id","clearButton")
  document.getElementById("editlog").parentNode.appendChild(listButton, document.getElementById("editlog"));
  document.getElementById("clearButton").addEventListener("click", clear, true);
}

//after action is complete redirect to logs to clear IP
if (/aktie=/.test(window.location.href)){
  var divs = document.getElementsByClassName('internet');
	for (var i = 0; i < divs.length; i++) {
    	if(divs[i].innerHTML.match("finished !")){
          window.location.href = "http://www.slavehack.com/index2.php?page=internet";
        }
	}
}
//edit logs after collecting
if (/collect=/.test(window.location.href)){
  	var divs = document.getElementsByTagName("td");
	for (var i = 0; i < divs.length; i++) {
    	if(divs[i].innerHTML.match("You earned")){
          window.location.href = "http://www.slavehack.com/index2.php?page=logs";
        }
	}
}

function list(){
    var events = document.getElementById("editlog").innerHTML.split("\n");
    var replacement = "";
    for (i = 0; i < events.length; i++){
        ipaddr = events[i].match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)
        if (ipaddr){
            replacement = replacement + ipaddr + "\n";
        }
        document.getElementById("editlog").innerHTML = replacement;
    }
}

function clear(){
  document.getElementById("editlog").innerHTML = "";
  document.getElementById("editlog").parentNode.submit()
}



