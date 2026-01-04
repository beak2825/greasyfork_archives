// ==UserScript==
// @name        Youtube Timestamps
// @name:fr     Horodatage youtube
// @namespace   YTime
// @include     *youtube.com* 
// @version     1.1.0
// @author      lapincroyable
// @description Allows to create, store, access, export and import video timestamps.
// @description:fr  Permet de créer, stocker, accéder, exporter et importer des horodatages (timestamps) vidéos .
// @run-at document-idle 
// @grant GM_getValue 
// @grant GM_setValue 
// @downloadURL https://update.greasyfork.org/scripts/425838/Youtube%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/425838/Youtube%20Timestamps.meta.js
// ==/UserScript==
// -----------------------
var YTimeList = [];
var YTimeValue = GM_getValue("YTIMELIST");
if (YTimeValue != undefined){	YTimeList = JSON.parse(YTimeValue); }
var IDVid ;
var Player ;
var btnStyle = {
  borderRadius : "16px",
  border : "2px solid black",
  margin : "5px",
  padding : "0px",
  heigth : "20px",
  width : "20px"
};
var RemAllStyle = {
  backgroundColor : "lightsalmon"
};
var AddStyle = {
  backgroundColor : "lightgreen"
};
var RemStyle = {
  backgroundColor : "black",
  color : "white",
  "margin-left" : "-26px"
};
var TSStyle = {
  "padding" : "0px 30px 0px 10px",
  backgroundColor :"#ffffff80",
  width : "auto"
}
var OptStyle = {
  backgroundColor :"#76b5c5",
  float : "left"
}
// -----------------------
function ConvSec(timestamp){
  let split = timestamp.split(":");
  let result = 0;
  if(split.length > 2){
    result = parseInt(split[0])*3600 + parseInt(split[1])*60 + parseInt(split[2]);
  } else {
    result = parseInt(split[0])*60 + parseInt(split[1]);
  }
  return result;
}
function GetTimeStamp(){
  let ptime = Math.floor(Player.currentTime);
  let timestamp = "";
  let hr = false;
  if (Math.floor(ptime/3600) > 0) {
    timestamp+=Math.floor(ptime/3600)+":";
    ptime = ptime%3600;
    hr = true;
  }
  if ((Math.floor(ptime/60) < 10) & hr){
    timestamp+="0";
  }
  timestamp+=Math.floor(ptime/60)+":";
  ptime = ptime%60;
  if (Math.floor(ptime%60) < 10){
    timestamp+="0";
  }
  timestamp+=ptime%60;
  return(timestamp);
}
function ToggleOptn(){
  let div = document.getElementById("optionsbar");
  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}
function ExportTS(){
  let indexvid = YTimeList.findIndex(i => i[0]===IDVid);
  if(indexvid != -1){
    let TSString = YTimeList[indexvid].toString();
    let FileName = "Timestamps - " + document.title+".txt";
    let TSFile = new File([TSString], FileName, {type:TSString.type});
    let FileLink = document.createElement("a");
    let FileURL = URL.createObjectURL(TSFile);
    FileLink.href = FileURL;
    FileLink.download = FileName;
    document.body.appendChild(FileLink);
    FileLink.click();
    setTimeout(function() {
      document.body.removeChild(FileLink);
      window.URL.revokeObjectURL(FileURL);  
    }, 0); 
  }
}
function AskFile(){
  let FileInput = document.getElementById('fileinput');
  FileInput.click();  
}
function ImportTS(){
  let TSFile = document.getElementById('fileinput').files[0];
  let reader = new FileReader();
  reader.readAsText(TSFile);
  reader.onload = function() {
    let array = reader.result.split(',');
    if (array[0] == IDVid){
      array.shift();
      array.sort();
      array.forEach(element => AddTS(element));
    }
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}
function LoadTimes(){
  CleanBar();
  let indexvid = YTimeList.findIndex(i => i[0]===IDVid);
  if(indexvid != -1){
    YTimeList[indexvid].shift();
    YTimeList[indexvid].sort();
    for (let indexstamp in YTimeList[indexvid]){
      AddTSButton(YTimeList[indexvid][indexstamp]);  
    }
    YTimeList[indexvid].unshift(IDVid);
  }
}
function AddTS(value){
  let timestamp;
  console.log("value:"+value);
  if (value === null){
    timestamp = GetTimeStamp();
  } else {
    timestamp = value;
  }
  let indexvid = YTimeList.findIndex(i => i[0]===IDVid);
  if(indexvid == -1){
    YTimeList.push([IDVid,timestamp]);
    GM_setValue("YTIMELIST",JSON.stringify(YTimeList))
    AddTSButton(timestamp);
  }else{
    let indexstamp = YTimeList[indexvid].findIndex(i => i===timestamp);
      if(indexstamp == -1){
        YTimeList[indexvid].push(timestamp);
        GM_setValue("YTIMELIST",JSON.stringify(YTimeList))
        AddTSButton(timestamp);
      }
  }
}
function AddTSButton(timestamp){
  let TSBar = document.getElementById("tsbar");
  let Sec = ConvSec(timestamp);   
  let TSButton= document.createElement("button");
  Object.assign(TSButton , {innerHTML : timestamp , id : "TSButton" , onclick : function(){
    document.getElementsByClassName("html5-main-video")[0].currentTime = Sec;
    document.getElementsByClassName("html5-main-video")[0].play();
  }});
  Object.assign(TSButton.style,btnStyle,TSStyle);
  let RemTSButton = document.createElement("button");
  Object.assign (RemTSButton, {innerHTML : "x" , id : "TSButton", onclick : function(){RemTS(timestamp)}});
  Object.assign(RemTSButton.style,btnStyle,RemStyle);
  TSBar.appendChild(TSButton);
  TSBar.appendChild(RemTSButton);
}
function RemTS(timestamp){
  let indexvid = YTimeList.findIndex(i => i[0]===IDVid);
  let indexstamp = YTimeList[indexvid].findIndex(i => i===timestamp);
  YTimeList[indexvid].splice(indexstamp,1);
  if (YTimeList[indexvid].length == 1){
    YTimeList.splice(indexvid,1);
  }
  GM_setValue("YTIMELIST",JSON.stringify(YTimeList));
  LoadTimes();
}
function RemAllTS(){
  let indexvid = YTimeList.findIndex(i => i[0]===IDVid);
  if(indexvid != -1){
    YTimeList.splice(indexvid,1);
    GM_setValue("YTIMELIST",JSON.stringify(YTimeList));
    CleanBar();
  }
}
function CleanBar(){
  let TSBar = document.getElementById("tsbar");
	let TSButtonList = TSBar.querySelectorAll("#TSButton");
	for (let TSButton of TSButtonList) {
		TSBar.removeChild(TSButton);
	}
}
function check(changes, observer) {
    if(Player.baseURI.match("watch")){
      if(IDVid != (Player.baseURI.split("v=")[1].split("&")[0])){
        IDVid = Player.baseURI.split("v=")[1].split("&")[0];
        LoadTimes();
      }
    } 
}
function loadonwatch(changes, observer) {
  if(document.baseURI.match("watch") && document.getElementById("info-contents") && document.getElementsByClassName("html5-main-video")){
    observer.disconnect();
    Player = document.getElementsByClassName("html5-main-video")[0];
    IDVid = Player.baseURI.split("v=")[1].split("&")[0];
    let ZoneInfo = document.getElementById("info-contents");
    let OptionsButton = document.createElement("button");
    Object.assign (OptionsButton, {innerHTML : "&#10033;" , onclick : ToggleOptn});
    Object.assign(OptionsButton.style,btnStyle,OptStyle);
    let OptionsBar = document.createElement("div");
    //OptionsBar.setAttribute();
    Object.assign(OptionsBar, {"id":"optionsbar"})
    Object.assign(OptionsBar.style,{display : "none"});
    let ExportButton = document.createElement("button");
    Object.assign(ExportButton, {innerHTML : "&mapstoup;", onclick : ExportTS});
    Object.assign(ExportButton.style,btnStyle,OptStyle);
    let ImportButton = document.createElement("button");
    Object.assign(ImportButton,{innerHTML : "&DownArrowBar;", onclick : AskFile});
    Object.assign(ImportButton.style,btnStyle,OptStyle);
    let FileInput = document.createElement("input");
    Object.assign(FileInput,{id : "fileinput", type :"file", accept :".txt", hidden : "true", oninput : ImportTS});
    let TSBar = document.createElement("div");
    Object.assign(TSBar, {"id":"tsbar"});
    let RemAllButton = document.createElement("button");
    Object.assign(RemAllButton, {innerHTML : "-" , onclick : RemAllTS});
    Object.assign(RemAllButton.style,btnStyle,RemAllStyle);
    let AddButton = document.createElement("button");
    Object.assign (AddButton, {innerHTML : "+" , onclick : function(){AddTS(null)}});
    Object.assign(AddButton.style,btnStyle,AddStyle);
    ZoneInfo.parentNode.insertBefore(OptionsButton,ZoneInfo);
    ZoneInfo.parentNode.insertBefore(OptionsBar,ZoneInfo);
    OptionsBar.appendChild(ExportButton);
    OptionsBar.appendChild(ImportButton);
    OptionsBar.appendChild(FileInput);
    ZoneInfo.parentNode.insertBefore(TSBar,ZoneInfo);
    TSBar.appendChild(RemAllButton);
    TSBar.appendChild(AddButton);
    LoadTimes();
    (new MutationObserver(check)).observe(Player, {attributes: true, subtree: true});
  }
}
(new MutationObserver(loadonwatch)).observe(document, {attributes: true, subtree: true});