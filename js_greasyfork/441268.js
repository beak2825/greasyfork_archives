// ==UserScript==
// @name     ER MapEdit
// @description Allows deletion of items from Fextralife's Elden Ring map
// @version  1.1
// @namespace   jerryterry.tumblr.com
// @license MIT
// @include https://eldenring.wiki.fextralife.com/file/Elden-Ring/map*
// @match https://eldenring.wiki.fextralife.com/file/Elden-Ring/map*
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/441268/ER%20MapEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/441268/ER%20MapEdit.meta.js
// ==/UserScript==

//Version 1.1:
//Added shortcut to delete by pressing "d" key.
//Fixed possible duplicate entries in save data.
//Unlocked fullscreen for non-VIP members.

function exec(fn) {
    var script = document.createElement('script');
  	script.id = "mainScript";
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
}

function popupListen(){

  window.selectedNode = "";
	window.goneNodes = [];
  
  var fsControl = L.control.fullscreen({position: 'bottomright'});
  map.addControl(fsControl);
  
  map.on('popupopen', function(e) {
    let nodeStr = e.popup["_content"];
    let nodeID = nodeStr.substring(
      nodeStr.indexOf('<div data="') + 11, 
      nodeStr.indexOf('">')
  	);
    selectedNode = nodeID
  });
  
  map.on('popupclose', function(e) {
    selectedNode = ""
  });
  
  delNode = function(id){
    if (!id) return;
    let cat = items.find(x => x.id === parseInt(id))["category"];
    let node = vmarkers[cat].find(x => x["options"]["alt"].split("-")[0] === id);
    node.closePopup();
    node.setOpacity(0);
    if (!goneNodes.includes(id)) goneNodes.push(id);
  }

  read_cookie = function(key){
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
	}
  
  saveList = function(){
    
    cookieString = "savedata=" + goneNodes.toString() + "; expires=Thu, 14 Jan 2100 12:00:00 UTC; path=/";
    console.log(cookieString);
    document.cookie = cookieString;
    console.log("Data saved");
  }
  
  loadList = function(){
    goneNodes = read_cookie("savedata").split(",");
    for (var i in goneNodes){
      try {delNode(goneNodes[i]);} catch{};
    }
  }
        
  document.addEventListener('keydown', function (event) {
  	if (event.key === 'd') {
    	delNode(selectedNode);
    }
  });

}

exec(popupListen);

var buttons = document.getElementsByClassName("leaflet-control-zoom leaflet-bar leaflet-control")[0];
buttons.insertAdjacentHTML( 'beforeend', '<a class="leaflet-control-delete-node" href="#" onclick="delNode(selectedNode)" title="Delete node" role="button" aria-label="Delete selected">del</a>');
buttons.insertAdjacentHTML( 'beforeend', '<a class="leaflet-control-save-data" href="#" onclick="saveList()" title="Delete node" role="button" aria-label="Save data">save</a>');
buttons.insertAdjacentHTML( 'beforeend', '<a class="leaflet-control-load-data" href="#" onclick="loadList()" title="Delete node" role="button" aria-label="Load data">load</a>');

console.log("ER MapEdit v1.0 loaded");