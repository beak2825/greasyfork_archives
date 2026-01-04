// ==UserScript==
// @name         MH - Uncaught Mice Display
// @version      1.0.4
// @description  Shows uncaught mice at any location
// @author       MI
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/452546/MH%20-%20Uncaught%20Mice%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/452546/MH%20-%20Uncaught%20Mice%20Display.meta.js
// ==/UserScript==

$(document).ready(function(){
  if($(".campPage-trap-armedItemContainer")[0]){
     typeof $(".mi-uncaught-box")[0] == "object"? null : uncaughtBoxRender()
  }
})

//Renders the box
function uncaughtBoxRender(){
  var locationWrapper = $(".mousehuntHud-environmentIconWrapper")[0]

  //Box styles
  var uncaughtBtn = document.createElement("button");
  uncaughtBtn.className = "mi-uncaught-box";
  uncaughtBtn.style.position = "absolute";
  uncaughtBtn.style.width = "17px";
  uncaughtBtn.style.height = "17px";
  uncaughtBtn.style.borderRadius = "4px";
  uncaughtBtn.style.left = "1px";
  uncaughtBtn.style.bottom = "3px";
  uncaughtBtn.style.background = "#e5dac0";
  uncaughtBtn.style.borderColor = "#9f9171";
  uncaughtBtn.style.fontSize = "10px"
  uncaughtBtn.style.padding = "0px"
  uncaughtBtn.style.innerHTML = "?"

  //Button function --- 
  var currentLocation = user.environment_type;
  //Firstly calls for the location informations
  uncaughtBtn.onclick = function(){
    console.log("Requesting Information of Location Mice from Server");
    postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
    `sn=Hitgrab&hg_is_ajax=1&page_class=HunterProfile&page_arguments%5Btab%5D=mice&page_arguments%5Bsub_tab%5D=location&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`
    ). then(res =>{
      try{
        var response = JSON.parse(res.responseText);
        if (response){
          var miceListCategory = {}
          miceListCategory = response.page.tabs.mice.subtabs[1].mouse_list.categories;
          //Loops through the parsed data to find the matching locationx  
          for(var i=0; i< miceListCategory.length;i++){
            if(miceListCategory[i].type == currentLocation){
              console.log("Current location_type is " + miceListCategory[i].type);
              var miceTotal = miceListCategory[i].total
              var locationMiceList = miceListCategory[i].subgroups[0].mice

              //Mega lists which shows all the mice uncaught in that area
              var uncaughtMiceList = [];
              for (var i=0; i<miceTotal -1; i++){
                if(locationMiceList[i].num_catches == 0){
                  uncaughtMiceList.push(locationMiceList[i].name)
                }
              }

              //String it up
              var str = "Uncaught Mice: "
              for (var i=0; i< uncaughtMiceList.length; i++){
                str = str + "\n" + uncaughtMiceList[i]
              }
              
              //Different announcement if all mice caught
              //Changes colour if all caught
              if (uncaughtMiceList.length > 0){
                alert (str)
                uncaughtBtn.innerHTML = uncaughtMiceList.length;
              } else {
                uncaughtBtn.innerHTML = "0";
                uncaughtBtn.style.background = "green";
                uncaughtBtn.style.color = "white";
                uncaughtBtn.style.borderColor = "green";
                alert ("All mice in this location have been caught")
              }

              break;
            }
          }

        }
      } catch (error){
        console.log(error)
      }
    })
  },
  

  locationWrapper.insertAdjacentElement("afterend",uncaughtBtn)

}

function postReq(url, form) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        resolve(this);
      }
    };
    xhr.onerror = function () {
      reject(this);
    };
    xhr.send(form);
  });
}