// ==UserScript==
// @name        分享
// @namespace   Qihe
// @match       https://poshmark.com/closet/*
// @version     1.1
// @author      沈超煌
// @description 7/28/2020, 10:23:29 AM
// @downloadURL https://update.greasyfork.org/scripts/407826/%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/407826/%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

let wait = 1000

window.onload=function(){
  
  let start_share_btn = document.createElement("button")
  start_share_btn.innerHTML = "开始刷新"
  start_share_btn.style.margin= "0 30px"
  start_share_btn.style.width = "100px"
  start_share_btn.style.border = "1px solid #eee"
  start_share_btn.style.background = "#000"
  start_share_btn.style.color = "#fff"
  
  let input_group = document.getElementsByClassName("input-group")
  
  input_group[0].appendChild(start_share_btn)
  
  
  addEvent(start_share_btn,'click',function(){
     alert("即将开始刷新！")
      shareItems()
  })
  
  
  //shareItems()
  
};

function shareItems(){
  
      
    let items = document.getElementsByClassName("share");
    alert("刷新列表共 "+ items.length +"个list")
  
    for (let i of items) {
  
        setTimeout(function () { 
          //console.log(wait)
          shareItem(i) 
        }, wait); 
        wait += getPostingWait(3,7)
        
    }
}

function shareItem(item){

        let shareLink = 'share_poshmark';

        let items = document.getElementsByClassName("share");
    
        for (let i of items) {
          
              
          
              if (i.dataset.paAttrListing_id === item.dataset.paAttrListing_id) {

                 i.click();

                  setTimeout( function() { 

                      let shareToFollowers = document.querySelector("[data-pa-name='" + shareLink + "']");

                      shareToFollowers.click();

                  }, 3000);

                  i.style.backgroundColor = "red"
              } 

        }
        
}

function getPostingWait(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return ((Math.floor(Math.random() * (max - min + 1)) + min) * 1000);
}

function addEvent(el, type, fn) { 
　　if(el.addEventListener){
    el.addEventListener(type,fn,false)
    }else if(el.attachEvent()){
    el.attachEvent('on' + type,fn,false)
    }else{
    return false
  }
}

const getAllItemsInCloset = () => {
    return new Promise((resolve, reject) => {
        var newItems;
        let message;
        var maxId = 1;
        var url = window.location.href.split('?')[0] + "?availability=available&max_id=";
        var tilesCon = document.getElementById('tiles-con');
            tilesCon.setAttribute('scrollpagination','disabled');
  
        
        const intervalId = setInterval(() => {
            if (maxId) {
                $.get(url + maxId, function(data) { 
                    //console.log(data.html)
                    maxId = data.max_id;
                    newItems += data.html;
                    console.log("max_id. in get", maxId);
                    //console.log("newItems", newItems.length);
                    if (maxId) {
                        note = "Fetching closet page " + maxId;
                     
                    }
                });
            }
            else {
                //console.log("break");		
                tilesCon.innerHTML += newItems   
                //console.log("newItems:", newItems);         
                clearInterval(intervalId);
                let items = document.getElementsByClassName("share");
                //console.log("final items: ", items);
                note = "Retrieved all items from closet";
                addNotification(note);
                resolve(items);
            }
            
        }, 2000);
    })
}