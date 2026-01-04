// ==UserScript==
// @name                ScheduledAutoClicker(thc282)
// @name:zh-TW          定時自動點擊(thc282)
// @version             1.0
// @description         Scheduled Auto Clicker for Browsers!!
// @description:zh-tw   網頁用排程定時自動點搫
// @author              thc282
// @include             http:*
// @include             https:*
// @grant               none
// @license             MIT
// @namespace https://greasyfork.org/users/777397
// @downloadURL https://update.greasyfork.org/scripts/456053/ScheduledAutoClicker%28thc282%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456053/ScheduledAutoClicker%28thc282%29.meta.js
// ==/UserScript==
if(window.timer != undefined)clearInterval(timer);
var x,y,setPos=false;

function setAutoTimeClick(){
    var PosX,PosY,set=false,isValid = false;
    
    while(!isValid){
        target = prompt("Please input the scheled time(format hh:mm:ss)[add 0 with single digit e.g 09:01:24]:");
        isValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])?$/.test(target);
        if(!isValid && target || target=='')alert("Invalid format");
        else isValid = true;
    }
    
    //do action when time is set
    if(isValid && target){
        //set position
        alert("Please move the cursor where you need to click, then press Alt + B to save position");
        document.addEventListener("keydown",function(e){
            if (e.keyCode==66&&e.altKey){
                if(!set){
                    set=true;
                    PosX = x;
                    PosY = y;
                    console.log(set);
                    console.log(target);
                    click(PosX,PosY);
                }
            }
        })
    }
}
    
function click(PosX,PosY){
    alert(`Position saved\nTime is set at： ${target}`);
    el = document.elementFromPoint(PosX - window.pageXOffset, PosY - window.pageYOffset);
    //start timer when Position is set
    timer = setInterval(()=>{
        const today = new Date();
        //action to do below
        //get current time format hh:mm:ss
        let Ttime = today.toTimeString().slice(0,8);
        if(Ttime == target){
            //when time match, do action
            el.click();
            //stop timer
            clearInterval(timer);
            console.log("timer stop")
        }
    },1000);
    //reset setter
    setPos = false;
}

//on listen mouse position
document.addEventListener("mousemove",function(e){
    x = e.pageX;
    y = e.pageY;
});

//on listen Alt+B press
document.addEventListener("keyup",function(e){
   if (e.keyCode==66&&e.altKey){
       if(!setPos){
           setPos = true;
           console.log('Alt+B pressed');
           //document.removeEventListener('keyup',document);
           setAutoTimeClick();
       }
   }
});