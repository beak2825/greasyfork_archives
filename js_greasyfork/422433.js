// ==UserScript==
// @name        Qwant Plus
// @name:fr     Qwant Plus
// @namespace   Violentmonkey Scripts
// @match       https://www.qwant.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Add more Qwicks and features to Qwant & more things
// @description:fr Ajoute plus de choses et de Qwicks sur Qwant
// @downloadURL https://update.greasyfork.org/scripts/422433/Qwant%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/422433/Qwant%20Plus.meta.js
// ==/UserScript==

console.log("Qwant Plus is successfully loaded")

var currenturl = location.href

//Qwicks+ list
var qwickpluses = {
  "wikimini":{"url":"https://fr.wikimini.org/w/index.php?search=[qpq]"},
  "ipfss":{"url":"https://ipfs-search.com/#/search?search=[qpq]"},
  "ipns":{"url":"https://ipfs.2read.net/ipns/[qpq]"},
  "ipfs":{"url":"https://gateway.ipfs.io/ipfs/[qpq]?download=false"},
  "vikidia":{"url":"https://fr.vikidia.org/w/index.php?search=[qpq]"},
  "namemc":{"url":"https://fr.namemc.com/search?q=[qpq]"}
  
}

//Qwicks+ execution
function qwpe(){
    if (new URL(location.href).searchParams.get('q')) {
      //alert(new URL(location.href).searchParams.get('q'))
      for (i in qwickpluses){
        console.log(qwickpluses[i]["url"])
        console.log(i)
      if (new URL(location.href).searchParams.get('q').match("!" + i + " " + "(.*)") != null && i in qwickpluses) {
        console.log(new URL(location.href).searchParams.get('q'))
        console.log(encodeURIComponent(new URL(location.href).searchParams.get('q').match("!" + i + " " + "(.*)")[1]))
        location.href = qwickpluses[i]["url"].replace("[qpq]",encodeURIComponent(new URL(location.href).searchParams.get('q').match("!" + i + " " + "(.*)")[1]))
      }
      else if (new URL(location.href).searchParams.get('q') == "!" + i && i in qwickpluses) {
        location.href = qwickpluses[i]["url"].replace("[qpq]","")
      }
      }
      if (new URL(location.href).searchParams.get('q').match("r\/" + "(.*)") != null) {
        location.href = "https://reddit.com/r/" + new URL(location.href).searchParams.get('q').match("r\/" + "(.*)")[1]
      }
  }
}

qwpe()

setInterval(function(){ 
  //console.log(location.href)
  if (location.href != currenturl){
    currenturl = location.href
    qwpe()
  }
}, 5);
