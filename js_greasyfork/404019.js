// ==UserScript==
// @name         Gota Extension
// @namespace    http://www.locked.epizy.com/
// @version      2.0-BETA
// @description  Made In Azerbaijan
// @author       Huseyn LOCKED
// @match        *.gota.io/web/*
// @grant        GM_addStyle
// @contributor  LOCKED
// @icon         https://pngimage.net/wp-content/uploads/2018/06/lm-png-4.png
// @download     http://locked.epizy.com/Script By LOCKMEDIA.user.js
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404019/Gota%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/404019/Gota%20Extension.meta.js
// ==/UserScript==


 /*USAGE= the first time you enter the gota website some resources will be downloaded which could take some seconds, after if you press the "skin" button, random skins from the game will be loaded
 you can then press the + button to save the skin in your favourite skins, you can see those pressing the "saved skins" button. Here you can manually add skins trough the text box, you can add a skin
 at a time, like "keri2" or also more than one skin using a comma between skins, remember to not put random spaces because those will be part of the skin too, to delete a single skin, press the X button.
-The "Search skins" button will open a new page that will let you find skins more easily and import them to the extension.
-The "Delete all saved skins" button does exactly what you would think, it deletes ALL the saved skins.
+The "Open skin site" button will open a new page that will let you find skins more easily and import them to the extension.
+The "Delete all saved skins" button does exactly what you would think, it deletes ALL the saved skins, you cannot recover them.
 The "Copy all saved skins" button copies all the skins that you have saved so that you can store them in a text file or somewhere safe in case you need to delete all stored files in the browser.
+
+REMEMBER THAT IF YOU DELETE YOUR BROWSER MEMORY ALL YOUR SAVED SKINS WILL DISAPPEAR
 */


function addStyleSheet(style) {
    var getHead = document.getElementsByTagName("HEAD")[0];
    var cssNode = window.document.createElement('style');
    var elementStyle = getHead.appendChild(cssNode);
    elementStyle.innerHTML = style;
    return elementStyle;
}


 

//Custom Font, Logo and Minimap
addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Ubuntu);');
GM_addStyle('#minimap-canvas {background-image: url("https://i.imgur.com/suUx0MD.png");}');
GM_addStyle('*{font-family: Ubuntu;}');
GM_addStyle('.coordinates {font-family: Ubuntu;}');
GM_addStyle('.lh,fz,#leaderboard-panel,#minimap-canvas {font-size: 24px;color:blue;}');



var link= "https://gamedata.gota.io/skins/";
var png=".png";
var linkFin="";
var skinFin="";
var skinlist="";
var arrayList;
var randomSkin;
var bufferFirstElement;
var flagSavedSkins=true;
var justonce=true;
var justonceOnRefresh=true;

    //template of the gota button
var gotaButtonTemplate = document.createElement('button');
    gotaButtonTemplate.className = 'gota-btn bottom-btn';
    gotaButtonTemplate.style.color = 'white';
   gotaButtonTemplate.style.backgroundColor = 'rgba(23,22,23,.9)';


    //button that opens the menu
 var skinButton = gotaButtonTemplate.cloneNode();
   skinButton.className += ' specy-skins';
    skinButton.style.position = 'absolute';
    skinButton.style.padding = '0px';
    skinButton.style.top = '0%';
    skinButton.style.right = '0%';
    skinButton.style.width = '20%';
    skinButton.style.height = '32px';
    skinButton.style.fontSize = '16px';
    skinButton.innerText = 'Skins';
    skinButton.style.float = 'right';
    skinButton.addEventListener('click', function() {

        mainDiv.style.display = "block";
        backgroundDiv.style.display = "block";
        deleteAllButton.style.display='block';
        copyAllSkins.style.display='block';

        savedButtonPressed();
        });




     //adding the skinButton to the gota menu and resizing the nickname textbox
    document.getElementsByClassName("main-input")[0].style.position = "relative";
    document.getElementsByClassName("gota-input")[0].style.width = "78%";
    document.getElementsByClassName('main-input')[0].appendChild(skinButton);
     //div that contains all the  buttons and table
var mainDiv = document.createElement('div');
    mainDiv.className = 'mainDiv';
    mainDiv.style.width='55%';
    mainDiv.style.height='80%';
    mainDiv.style.position='absolute';
    mainDiv.style.left='22%';
    mainDiv.style.top='8%';
    mainDiv.style.background='black';
    mainDiv.style.margin = 'auto';
    mainDiv.style.zIndex = '100';
    mainDiv.style.display = 'none';
    mainDiv.style.border ='2px #3E3E3E solid';
   mainDiv.style.borderRadius ='10px';
   mainDiv.style.padding ='10px';
   mainDiv.style.paddingBottom='0px';
   document.body.appendChild(mainDiv);


    //button to close the div, you can also press anywhere on the screen
var closeButton = gotaButtonTemplate.cloneNode();
    closeButton.style.width='20%';
    closeButton.style.float='left';
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', function() {
        mainDiv.style.display = "none";
        backgroundDiv.style.display = "none";
        deleteAllButton.style.display='none';
        copyAllSkins.style.display='none';

    });
    document.getElementsByClassName('mainDiv')[0].appendChild(closeButton);
      var deleteAllButton= gotaButtonTemplate.cloneNode();
    deleteAllButton.className += 'RemoveSkinsButton';
    deleteAllButton.setAttribute("id", "RemoveSkinsButton");
    deleteAllButton.style.position = 'absolute';
    deleteAllButton.style.padding = '0px';
   deleteAllButton.style.bottom = '0%';
   deleteAllButton.style.right = '0%';
   deleteAllButton.style.width = '20%';
    deleteAllButton.style.fontSize = '20px';
    deleteAllButton.innerText = 'Delete all saved skins';
    deleteAllButton.style.float = 'right';
   deleteAllButton.style.color='red';
    deleteAllButton.style.fontFamily='Arial';
    deleteAllButton.style.margin='10px';
    deleteAllButton.style.padding='5px';
    deleteAllButton.style.zIndex='100';
    deleteAllButton.style.display='none';
    deleteAllButton.addEventListener('click', function() {
       if (confirm("Delete ALL the skins? this action can't be undone.")) {
          localStorage.removeItem("skin");
           alert("All saved skins deleted.");
           skinAlert.style.backgroundColor = "rgba(21,193,12,.7)";
            savedButtonPressed();
           }
    });
    document.body.appendChild(deleteAllButton);

       var copyAllSkins= gotaButtonTemplate.cloneNode();
    copyAllSkins.className += 'RemoveSkinsButton';
    copyAllSkins.setAttribute("id", "RemoveSkinsButton");
    copyAllSkins.style.position = 'absolute';
    copyAllSkins.style.padding = '0px';
    copyAllSkins.style.bottom = '0%';
    copyAllSkins.style.right = '0%';
    copyAllSkins.style.width = '20%';
    copyAllSkins.style.fontSize = '20px';
    copyAllSkins.innerText = 'Copy all saved skins';
    copyAllSkins.style.fontFamily='Arial';
    copyAllSkins.style.left = '0%';
    copyAllSkins.style.margin='10px';
    copyAllSkins.style.padding='5px';
    copyAllSkins.style.zIndex='100';
    copyAllSkins.style.display='none';
    copyAllSkins.addEventListener('click', function() {
            var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = localStorage.getItem("skin");
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
            skinAlert.innerHTML = 'All skins copied!';
$('#skinAlertBox').show().delay(1500).hide(1);

    });
    document.body.appendChild(copyAllSkins);


  //Textbox for the skin to add
var inputSkin =document.createElement('textarea');
    inputSkin.style.width='35%';
    inputSkin.setAttribute("id", "inputSkin");
    inputSkin.className = 'skinTextArea';
    inputSkin.style.border='2px black solid';
    inputSkin.style.borderRadius='10px';
    inputSkin.style.decoration='none';
    inputSkin.style.marginLeft='12%';
    inputSkin.style.textAlign='left';
    inputSkin.style.fontWeight='bold';
    mainDiv.appendChild(inputSkin);
    inputSkin.placeholder = 'Insert skin name to add, use "," to add more than one skin at the time.';

var skinAlert=document.createElement('div')
    skinAlert.className='skinAlertBox';
    skinAlert.setAttribute("id", "skinAlertBox");
    skinAlert.style.background='rgba(21,193,12,.7)';
    skinAlert.style.position='absolute';
    skinAlert.style.width='15%';
    skinAlert.style.zIndex='102';
    skinAlert.style.fontSize='18px';
    skinAlert.style.fontWeight='bold';
    skinAlert.style.borderRadius='20px';
    skinAlert.style.textAlign='center';
    skinAlert.style.color='white';
    skinAlert.style.fontFamily='Arial';
    skinAlert.style.margin='10px';
    skinAlert.style.padding='5px';
    skinAlert.innerHTML = 'Skin Added';
    skinAlert.style.display='none';
    document.body.appendChild(skinAlert);
    mainDiv.style.display = "none";

    //button that adds the skin written in the textbox to the storage
var addSkinButton = gotaButtonTemplate.cloneNode();
    addSkinButton.style.width='20%';
    addSkinButton.style.float= 'right';
    addSkinButton.innerText = 'Add skins';
    addSkinButton.addEventListener('click', function() {
        addSkin();
    });
    mainDiv.appendChild(addSkinButton);

    //invisible div that blurres the background and when clicked it closes the menu
var backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'backgroundDiv';
    backgroundDiv.style.position = 'fixed';
    backgroundDiv.style.top = '0';
    backgroundDiv.style.right = '0';
    backgroundDiv.style.bottom = '0';
    backgroundDiv.style.left = '0';
    backgroundDiv.style.display = 'none';
    backgroundDiv.style.background = 'rgba(0,0,0,.5)';
    backgroundDiv.style.overflow = 'auto';
    backgroundDiv.style.overflowX='hidden';
    backgroundDiv.style.zIndex = '99';
    backgroundDiv.addEventListener('click', function() {
        backgroundDiv.style.display = "none";

        mainDiv.style.display = "none";
        deleteAllButton.style.display='none';
        copyAllSkins.style.display='none';
   });
    document.body.appendChild(backgroundDiv);

    //wrapper for the table
var wrapperTableSkinVar=document.createElement('div');
    wrapperTableSkinVar.setAttribute("id", "wrapperTableSkin");
    wrapperTableSkinVar.style.overflow='auto';
    wrapperTableSkinVar.style.overflowX='hidden';
    wrapperTableSkinVar.style.height='80%';
    wrapperTableSkinVar.style.margin='10px';
    wrapperTableSkinVar.style.marginBottom='20px';
    wrapperTableSkinVar.addEventListener('scroll', function() {
       if ((wrapperTableSkinVar.scrollTop + wrapperTableSkinVar.clientHeight >= wrapperTableSkinVar.scrollHeight-100)) {
       loaded();
       }
    });
    mainDiv.appendChild(wrapperTableSkinVar);

    //table that contains all the skins
var skinViewerTable=document.createElement('table');
    skinViewerTable.setAttribute("id", "skinTable");
    skinViewerTable.style.borderRadius ='10px';
    skinViewerTable.style.width ='100%';
    skinViewerTable.style.hight ='100%';
    skinViewerTable.style.overflow ='scroll';
    skinViewerTable.innerHTML = "<tr> </tr>";
    skinViewerTable.style.textAlign='center';
    wrapperTableSkinVar.appendChild(skinViewerTable);

    //button that loads random skins
    var randomskins = gotaButtonTemplate.cloneNode();
    randomskins.innerText = 'Random skins 🎲';
    randomskins.style.width='28%';
    randomskins.style.bottom='0px';
    randomskins.style.float='left';
    randomskins.addEventListener('click', function() {
       randomButtonPressed();
    });
    mainDiv.appendChild(randomskins);

    //button that loads the favourite skins
var savedskins = gotaButtonTemplate.cloneNode();
    savedskins.innerText = ' Saved skins 💾';
    savedskins.style.width='28%';
    savedskins.style.bottom='0px';
    savedskins.style.float='right';
    savedskins.addEventListener('click', function() {
        savedButtonPressed();
    });
    mainDiv.appendChild(savedskins);

    var openSite = gotaButtonTemplate.cloneNode();
    openSite.innerText = 'Search skins';
    openSite.style.width='25%';
    openSite.style.bottom='0px';
    openSite.style.marginLeft='11%';
    openSite.addEventListener('click', function() {
        window.open("http://speskin.epizy.com/", '_blank');
    });
    mainDiv.appendChild(openSite);



    //adds the class for the image and the name of the skin
var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.skinImage {  border-radius: 50%;  margin:auto;    width:150px;  height:150px;  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .skinName { text-align: center; position: relative; font-size:22px; font-family:Arial; font-weight:bold; background: rgba(74, 74, 74, 0.8); color: #fff; visibility: hidden;}.skinImage:hover .skinName { visibility: visible;}';
    document.getElementsByTagName('head')[0].appendChild(style);

    //gets the skin list
    window.onload = function(){
var result = null;
var refreshCounter=localStorage.getItem("timesRefreshed");
       if(localStorage.getItem("allSkinsList")==null || refreshCounter>20){//if the tag containing all the skins is empty then it will get the elements of the skinList and puts them in localstorage checks if the page has been refreshed for more than 20 times, if yes it updates
           alert("Getting screen resources...wait");
          var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://cors-anywhere.herokuapp.com/https://gamedata.gota.io/skinData.php", false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
        randomSkin = JSON.parse(JSON.parse(xmlhttp.responseText).names);
       localStorage.setItem("timesRefreshed",1);

     localStorage.setItem("allSkinsList",randomSkin);
        }else{//if they are present then it will just put the skins inside of the array and it increses the value of the refresh counter
            if(justonceOnRefresh){
                justonceOnRefresh=false;
                refreshCounter++;
                localStorage.setItem("timesRefreshed",refreshCounter);
                randomSkin=localStorage.getItem("allSkinsList").split(',');
            }
 }


    };
    function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

    //loads random skins
    function randomButtonPressed(){
     flagSavedSkins=false;
     skinViewerTable.innerHTML = '<tr> <tr>';//resets the table
     arrayList=randomSkin;
     wrapperTableSkinVar.scrollTo(0, 0);
     loaded();
}
    //loads the saved skins
    function savedButtonPressed(){
        justonce=true;
    flagSavedSkins=true;
    skinViewerTable.innerHTML = '<tr> <tr>';//resets the table
    if(localStorage.getItem("skin")==null){//once pressed the button, if there are skins saved then it will load those, if there aren't it will load random ones
    skinAlert.innerHTML = 'There are no skins saved! loading random skins';
$('#skinAlertBox').show().delay(2000).hide(1);
        arrayList=randomSkin;
       flagSavedSkins=false;
    }else{
        arrayList=localStorage.getItem("skin").split(",");
    }
    wrapperTableSkinVar.scrollTo(0, 0);
    loaded();

}
    //adds the skin in the textbox to the localStorage
    function addSkin(){
var oldValueStorage=localStorage.getItem("skin");
var newskinValue=inputSkin.value.toLowerCase();
    if(newskinValue==""){//checks if there are no skins inside of the input box
        alert("There are no skins in the input box!");
    }else{
        skinAlert.style.backgroundColor = "rgba(21,193,12,.7)";
    skinAlert.innerHTML = 'Skin added';
$('#skinAlertBox').show().delay(1500).hide(1);
            if(localStorage.getItem("skin")==null){//if the storage is empty then it adds the skins in the input box
        localStorage.setItem("skin",newskinValue);
    }else{//if it's not empty then it gets the elements of the local storage and appends the elements of the input box
        oldValueStorage=localStorage.getItem("skin").split(",");
        oldValueStorage.push(newskinValue);
        localStorage.setItem("skin",oldValueStorage);
    }
         }
    inputSkin.value ="";
        savedButtonPressed();

}
    //loads the skins inside of the table
    function loaded(){
   for(var i=0;i<5;i++){
var skinTable1 = document.getElementById("skinTable");
var row = skinTable1.insertRow(-1);
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
//once created the new rows, it puts inside of them each skin
    cell1.innerHTML = RandomSkin();
    cell2.innerHTML = RandomSkin();
    cell3.innerHTML = RandomSkin();
    cell4.innerHTML = RandomSkin();
    }
}
    //gets a random skin from the selected source so either the saved skins or the random skins
  function RandomSkin(){
var ArrLength=arrayList.length;
var result;
var RanNum=Math.floor(Math.random() * ArrLength);
var skinName=arrayList[RanNum];
if(justonce){//sets the first element of the array in this variable so that it can be checked after when it's deleted, this flag gets reset everytime either of the Random skin or Saved skin button are pressed
    bufferFirstElement=arrayList[0];
    justonce=false;
}
      if(!ArrLength==0){
    skinName =replaceAll(skinName," ", "%20");
var linkFinal=(link+skinName+".png");
var nameForSkinFin=('"'+skinName+'"');
    skinName = replaceAll(skinName,"%20", " ");

    if(flagSavedSkins){//checks if the skins to add are either the random ones or the saved ones
    result=('<div style="position:relative;float:left;"><input type=button value="X" style="font-size:18px; position:absolute; z-index:101; top:22px; font-weight:bold; color:red; border: solid 2px red; border-radius:20%;" onclick=removeSkin('+nameForSkinFin+')></div><div class=skinImage onclick=changeSkin('+nameForSkinFin+') style="background-size: contain; background-image:url('+linkFinal+');"><p class=skinName >'+skinName+"</p></div>");

    }else{
result=('<div style="position:relative;float:left;"><input type=button value="+" style="font-size:18px; position:absolute; z-index:101; top:22px; font-weight:bold; color:blue; border: solid 2px blue; border-radius:20%;" onclick=addSkin2('+nameForSkinFin+')></div><div class=skinImage onclick=changeSkin('+nameForSkinFin+') style="background-size: contain; background-image:url('+linkFinal+');"><p class=skinName >'+skinName+"</p></div>");

    }
          arrayList.splice(RanNum,1);
    }
      return result;
}

    //replaces the old skin with the current one
exportFunction(function(skinName) {
    mainDiv.style.display = "none";
    backgroundDiv.style.display = "none";
var oldNickname=document.getElementById("name-box").value;
var newSkinName;
	 skinName = replaceAll(skinName,"%20", " ");
     if(oldNickname==""){ //if the nickname is empty just add the skin
        newSkinName=skinName;
    }else if(oldNickname.includes("[")){
        if(oldNickname.includes("[]")){//if there is an empty [] then change the [] with [skin]
                newSkinName=oldNickname.replace("[]", "["+skinName+"]")
        }else{//if there is a skin between the [] replace all the elements inside of the [] with the new skin
                newSkinName=oldNickname.replace(/\[(.+?)\]/g, "["+skinName+"]")
        }
       }else{//if there is no skin in the nickname, just add the [skin]
                newSkinName=(oldNickname+"["+skinName+"]");
    }
    document.getElementById("name-box").value=newSkinName;
}, unsafeWindow, {defineAs: "changeSkin"});

    //adds the skin from the random skins to the favourite skins
    exportFunction(function(addedSkin) {
     skinAlert.style.backgroundColor = "rgba(21,193,12,.7)";
     skinAlert.innerHTML = 'Skin added';
     $('#skinAlertBox').show().delay(1500).hide(1);
	 addedSkin = replaceAll(addedSkin,"%20", " ");
var oldValueStorage=localStorage.getItem("skin");
            if(localStorage.getItem("skin")==null){//if the localStorage is empty, add the skins to the localStorage creating a new key
        localStorage.setItem("skin",addedSkin);
    }else{//if it's already present, get the list, append the element and load it back
        oldValueStorage=localStorage.getItem("skin").split(",");
        oldValueStorage.push(addedSkin);
       localStorage.setItem("skin",oldValueStorage);
    }
    inputSkin.value ="";
}, unsafeWindow, {defineAs: "addSkin2"});


    //removes the selected skin from the local storage
exportFunction(function(removedSkin) {
    skinAlert.style.backgroundColor = "rgba(232,0,0,.7)";
    skinAlert.innerHTML = 'Skin removed';
    $('#skinAlertBox').show().delay(1500).hide(1);
    if(!localStorage.getItem("skin").includes(",")){//if there is only one element, then delete the tag

      localStorage.removeItem("skin");
    }else{//if there is at least 2 elements check if it's the first element or not
     removedSkin = replaceAll(removedSkin,"%20", " ");
        if(removedSkin==bufferFirstElement){ //if it is the first element then delete the "skin,"
            oldValueStorage=localStorage.getItem("skin");
            oldValueStorage=oldValueStorage.replace(removedSkin+",","");
            localStorage.setItem("skin",oldValueStorage);
            justonce=true;
    }else{//if it's not the first then delete ",skin"
var oldValueStorage=localStorage.getItem("skin");
    oldValueStorage=oldValueStorage.replace(","+removedSkin,"");
    localStorage.setItem("skin",oldValueStorage);
    }
    }
savedButtonPressed();
}, unsafeWindow, {defineAs: "removeSkin"});



//script+
var v = "<span>[System] Welcome To Locked Extension</span>";
$("#chat-body-0 > tr:nth-child(1) > td > span")
    .replaceWith(v);






var minimap = document.getElementById('minimap-canvas');
minimap.style.background = "url('https://i.imgur.com/QF3128J.png')";
minimap.style.opacity = ".7";







//jquery edit
$(".main-bottom-links").css({
"display":"none",
});

$(".policyLinks,.divider").css({
"display":"none",
})

$("#inner-rb,.error-banner").remove();

$("#main-rb").css({
"background-color":"#00000000",
});

$(".main-rb-title").text('At least subscribe to my channel:)');
$(".main-rb-title").css({
    "color": "#21f358",
    "font-size": "large",
});

$("#chat-body-0 > tr:nth-child(1) > td > span").css({"color":"rgb(221, 221, 0)"});
$("#chat-tab-container").css({"border-color":"rgb(255, 255, 255)"});

$('#preroll').replaceWith(""); // Deletes Add

$(".ui-pane, .main-panel, .gota-btn, .server-table tbody, #name-box, #server-content,.main-bottom-stats").css({
    "border-color": "#ffffff00",
});

$("#main, #popup-profile").css({
"border-color":"rgba(255, 255, 255, 0)"
});

$('#server-tab-eu').text('Europe');

$('#server-tab-na').text('North America');

$('#server-tab-ap').text('Asia Pacific');



$("#main-themes > div.title-text").css({
    "color":"aqua"
});




//# edit
$( "#btn-trello" ).remove();
$('.error-banner').replaceWith("");
$('#inner-rb').replaceWith("");
$('#preroll').replaceWith(""); // Deletes Add
$('#emote-panel h3').css({
    "color":"#00ffff",

});


$('#score-mouse').css({
"color":"aqua",
})

$(".main-version").text('Extension Version:0.1');
$(".main-version").css({"font-size":"small"});


$(function(){
    $('#leaderboard-panel , #score-panel, #party-panel, #minimap-panel,  #main, #main-themes > div.title-text,#playerCells').css({"border":"none","color":"#00ffff"});
    $('.policyLinks').css({"display":"none"});
});

$('.sp-container.sp-flat,.sp-container').css({
    "border-inline-start-color":"black",
    "background":"black",
    "border-radius":"12%",
    "border-left-color":"black",
    "border-right-color":"black",
    "border-color":"black",
    "border-left":"solid 1px black",


});


$('.sp-dragger').css({
  "background":"white",
   "color":"aqua"

});
$('.sp-input').css({
   "color":"aqua"

});
$('.sp-picker-container').css({
 "border-left":" solid 1px #000",

})

$(function(){
    $('#chat-body-0 > tr:nth-child(1) > td > span').css({"border":"none","color":"#00ffff"});

});

//new edit :)


GM_addStyle('#main-account {margin: 10px 10px;}');
GM_addStyle('#main-social {background: none; border: none;}');
GM_addStyle('.main-bottom {margin-bottom: 12px;}');
GM_addStyle('.main-bottom-stats {border-radius: 5px}');
GM_addStyle('.main-input-btns {margin-top: 12px;}');
GM_addStyle('.gota-btn {border-radius: 15px;}');
GM_addStyle('.gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('#popup-party {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-login {border-radius: 5px; border-width: 2px;}');
GM_addStyle('.login-input {border-radius: 0px}');
GM_addStyle('#name-box {font-weight: bold}');
GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');
GM_addStyle('.server-row:hover {background: rgb(119, 119, 119);}');
GM_addStyle('.server-row {transition: all 0.3s}');
GM_addStyle('.server-container, .options-container {width: 90%;}');
GM_addStyle('.server-selected {background-color: rgba(0, 255, 255, 0.8) !important;}');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('#name-box {display: inline-flex;}');
GM_addStyle('#main-account {background-color: rgba(0, 0, 0, 0)}');
GM_addStyle('.main-bottom-stats {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#main-scrimmage {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-menu {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-custom-btn-container {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-mode-info {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('.scrimmage-mode-box {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#popup-profile {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#emote-panel {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#autocomplete-panel {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#popup-party {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#server-tab-eu, #server-tab-na, #server-tab-ap {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-eu, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-na, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-ap, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('.server-selected {background-color: rgba(255, 0, 0, 0.78) !important}');
GM_addStyle('#name-box {color: #00ffff !important;  background-color: rgba(255, 255, 255, 0) !important}');
GM_addStyle('.options-container {background-color: rgba(50, 50, 50, 0) !important}');
GM_addStyle('.popup-panel {color: {background-color: rgba(50, 50, 50, 0) !important}');
GM_addStyle('#leaderboard-panel,#extra-panel {background-color: rgba(23, 22, 23, 0) !important;}');
GM_addStyle('#minimap-panel {background-color: rgba(23, 22, 23, 0) !important;}');
GM_addStyle('#score-panel {background-color: rgba(23, 22, 23, 0) !important; }');
GM_addStyle('  #leaderboard-panel , #minimap-panel, #extra-panel {border-color: rgba(0, 0, 0, 0)}');
GM_addStyle('#main-scrimmage {color: aqua!important;}');
GM_addStyle('.main-version {color: red;blue!important}');
GM_addStyle('#emote-panel {background-color: rgba(0, 0, 0, 0.75) !important}');
GM_addStyle('.asset-skinner-center input {color: #03A9F4; border-radius: 30px;}');
GM_addStyle("#lockmedias:hover {background: #26b326 !important;}");
GM_addStyle("#lockmedias {background: rgba(0, 149, 255, 0.6); border-radius: 18px; color: white; cursor: pointer; padding: 12px; position: absolute; text-decoration: none; transform: translate(-114.5px, 18px); transition: 0.2s; }");
GM_addStyle('.gota-btn,#main-account {background-color : rgba(0, 0, 0, 0) !important;}');
GM_addStyle('img.img-channel:hover, img#account-avatar:hover { box-shadow: 0px 0px 2px 2px #ffffff; }');
GM_addStyle('img.img-channel {height:60px; border-radius: 50%; display: block; margin: 0 auto 5px; box-shadow: 0px 0px 8px 2px #ffffffa6; box-shadow: 0px 0px 2px 2px #ffffff4f;}');
GM_addStyle('.current-status,.main-bottom-links { display:none; }');
GM_addStyle('#score-panel {display: inline-flex; background-color:rgba(23, 22, 23, 0); border:rgba(23, 22, 23, 0); color:blue; }');

//GM_addStyle('#main-left, #main-content{background-image: url(\'http://i.imgur.com/wOHHZVj.jpg}');


GM_addStyle('#popup-profile{    background-color: rgb(0, 0, 0) !important;}');




GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');

GM_addStyle('#name-box {font-weight: bold}');

GM_addStyle('  span, td .gota-btn:hover, .server-row:hover  {font-size: 16px; font-weight: bold; color:#00BCD4;}');
GM_addStyle('  gota-btn,.server-row {transition: all 0.3s}');

GM_addStyle('.gota-btn:hover {filter: hue-rotate(105deg);color:red;}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');

GM_addStyle('#party-canvas{color:rgb(255, 235, 59);}');


GM_addStyle('.server-table,table,p.stext  {color: grey}');
GM_addStyle('.server-selected {background-color: red}');
GM_addStyle('.server-selected {color: white}');

GM_addStyle('.sp-preview, .sp-alpha, .sp-thumb-el , .sp-preview-inner {border-radius: 50%; }');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {border-radius: 20%; }');


GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid black; border-radius: 10px; padding: 4px; font-weight: bold; margin-top: 3px;}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 7px;}');
GM_addStyle('.xp-meter > span {background: linear-gradient(to right, blue, cyan, turquoise, violet);}');



//Custom Checkboxes
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #ff0000; color: white; border-radius: 5px; padding: 4px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #00f000; color: #014401; padding: 4px;  padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');

//Custom scrollbars
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('* body {cursor: crosshair;}');


//youtube script :)
$(function(){
$('#lockedChannel > div.yt-author').css({"font-size":"14px"});

  });


var maincontent = document['getElementById']('main-rb');
var radio = document['createElement']('div');
radio['innerHTML'] = '<center><div class="placeholder" style="color:red;"></h2><p></p></div></center><div id="lockedChannel" class="yt-channel"> <a href="https://www.youtube.com/channel/UCVWt8mu_iAkNJEQ51C-UuiA?sub_confirmation=1" target="_blank"><img class="img-channel" src="https://yt3.ggpht.com/-zkHXCCSEGrA/AAAAAAAAAAI/AAAAAAAAAAA/w5EkJaAvnEI/s108-c-k-no-mo-rj-c0xffffff/photo.jpg"></a> <div  <h4 class="yt-author"><i class="fab fa-youtube"></i>  Huseyn Locked</h4></div> <script src="https://apis.google.com/js/platform.js" gapi_processed="true"></script> <div id="___ytsubscribe_0" style="text-indent: 0px; margin: 0px; padding: 0px; background: transparent; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 111px; height: 24px;"><iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 111px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 24px;" tabindex="0" vspace="0" width="100%" id="I0_1527245717214" name="I0_1527245717214" src="https://www.youtube.com/subscribe_embed?usegapi=1&amp;channelid=UCVWt8mu_iAkNJEQ51C-UuiA&amp;layout=default&amp;count=default&amp;origin=http%3A%2F%2Fgota.io&amp;gsrc=3p&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.tr.rJYfHO89G-o.O%2Fm%3D__features__%2Fam%3DQQE%2Frt%3Dj%2Fd%3D1%2Frs%3DAGLTcCPUQFw8XE-kJVhEKAWQGbgsT2e6Ww#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1527245717214&amp;_gfid=I0_1527245717214&amp;parent=http%3A%2F%2Fgota.io&amp;pfname=&amp;rpctoken=16397178" data-gapiattached="true"></iframe></div> </div>';
radio['id'] = 'radio';
maincontent['appendChild'](radio);
document['getElementById']('radio')['style']['cssText'] = 'text-align:center;font-size:12px;color:white;';


GM_addStyle('.main-bottom-left{width: 46%; height: 190px;display: flex; flex-flow: column wrap;justify-content: space-between;}');


$(".main-input .gota-btn").css({
    "margin-bottom": "0",
});

$(".main-input-btns").css({
    "display": "flex",
    "justify-content": "space-between",
    "width": "100%",
    "margin-top": "6px",
});


$("#profile-close-btn").css({"color":"red"});




var newTitle = "LOCKED EXTENSION";

document.title = newTitle;
document.querySelector("div.boardTitle")
    .textContent = newTitle;

