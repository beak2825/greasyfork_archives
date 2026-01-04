// ==UserScript==
// @name        BTSLR COIN/NITRO Timer  - bitsler.com
// @namespace   Violentmonkey Scripts
// @match       https://www.bitsler.com/*
// @grant       none
// @version     1.08
// @author      Saaho2019
// @description 3/20/2020, 12:03:44 AM
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398258/BTSLR%20COINNITRO%20Timer%20%20-%20bitslercom.user.js
// @updateURL https://update.greasyfork.org/scripts/398258/BTSLR%20COINNITRO%20Timer%20%20-%20bitslercom.meta.js
// ==/UserScript==
$(document).ready(function() {
    if(isLogin()){
      $('.bal-wrapper').append('<button class="btn btn-success btn-deposit" id="btslrCounter">BTSLR</button>');
      $('.bal-wrapper').append('<a href="/en/vip-program/nitro" onclick="window.routerLink(event)" role="button" class="nitroClaim"></a>');
      $('.bal-wrapper').append('<a href="/en/bitsler-coins/claim" onclick="window.routerLink(event)" role="button" class="btslrClaim"></a>');
      if(checkVipLevel()){ 
      $('.bal-wrapper').append('<button class="btn btn-success btn-deposit" id="nitroCounter">Nitro</button>'); 
      $('.bal-container').append('<div id="nitroTimer" style="display:none"><span class="minutes" id="nitroMinutes"></span> minutes <span class="seconds"id="nitroSeconds"></span> seconds </div>');
      }
      $('.bal-container').append('<div id="btslrTimer"><span class="minutes" id="btslrMinutes"></span> minutes <span class="seconds"id="btslrSeconds"></span> seconds </div>')
      $("#btslrTimer,#nitroTimer").css({'background-color':'#FFFF00','color':'#FF0000','font-family':'Arial','font-size':'12pt','margin-left':'12px'})
      $("#btslrSeconds,#nitroSeconds").css({'color':'#333','margin':'0 3px 0 15px','font-size':'15px'})
      $("#btslrMinutes,#nitroMinutes").css({'color':'#333','margin':'0 3px 0 15px','font-size':'15px'})
      $('<audio id="chatAudio"><source src="https://notificationsounds.com/notification-sounds/slow-spring-board-longer-tail-571/download/mp3" type="audio/wav"></audio>').appendTo('.bal-wrapper');
  
      
       
         if(window.localStorage.getItem("timebtslr")===null){
            $("#btslrCounter").show();
            $("#btslrTimer").hide();
          }else 
            if(window.localStorage.getItem("timenitro")===null ){
            if(checkVipLevel()){
              $("#nitroCounter").show();
              $("#nitroTimer").hide();
            }
          }else{

            customFun.setTimer("btslr");
            customFun.setTimer("nitro");    

            $("#btslrCounter").hide();
            if(checkVipLevel()){ $("#nitroCounter").hide();}
            $("#btslrTimer").show();
            $("#nitroTimer").show();
          }
  
      $("#btslrCounter").click(function() {
          $("#btslrCounter").hide();
          $("#btslrTimer").show();

          customFun.setTimer("btslr"); 
      });
      $("#nitroCounter").click(function() {
        $("#nitroCounter").hide();  
        $("#nitroTimer").show();
        
        customFun.setTimer("nitro");    
      });
    }
});
    
    customFun = {
        setTimer: function(name) {
                var end =new Date (window.localStorage.getItem('time'+name)).getTime() || resetStartTime(name);
                _second = 1000;
                _minute = _second * 60;
                _hour = _minute * 60;
                _day = _hour * 24;

              var interval = setInterval(function() {
                now = new Date().getTime();
                distance = end - now;
                days = Math.floor(distance / _day);
                hours = Math.floor((distance % _day) / _hour);
                minutes = Math.floor((distance % _hour) / _minute);
                seconds = Math.floor((distance % _minute) / _second);
                if (minutes < 0) {
                  clearInterval(interval);
                    $("#"+name+"Timer").hide();
                    $("#"+name+"Counter").show();
                    window.localStorage.removeItem('time'+name);
                    var timerId = setInterval(function() {
                    console.log(name);
                    $('#chatAudio')[0].play();
                    name == 'nitro'? $('.nitroClaim').get(0).click() :$('.btslrClaim').get(0).click();

                        clearTimeout(timerId);
                    }, 1000);
    
                } else {
                    $("#"+name+"Minutes").text(minutes);
                    $("#"+name+"Seconds").text(seconds);
                    timer2 = minutes + ':' + seconds;
                }
            },1000);
             
        }
    }
    
    function checkVipLevel(){
      const nonNitro = ["platinum","diamond black","diamond","diamond_master","diamond_legend"];
      var vipLevel = document.getElementsByClassName("na-user")[0].getElementsByTagName("div")[0].classList[1];
      console.log(vipLevel);
      return nonNitro.includes(vipLevel);
    
    }
    function isLogin(){
      var loggedIn = document.getElementsByClassName("cs-button")[0].getElementsByTagName("span")[0].textContent.length;
      if (loggedIn > 1){
            console.log("***************Logged in**********************");
      return true;
      }
    }
    function resetStartTime(name) {
      name =="btslr"? k = 600000: k= 3600000;
      end = new Date(new Date().getTime()+ k);
      window.localStorage.setItem('time'+name,end);
      end = new Date (window.localStorage.getItem('time'+name)).getTime();
      return end;
  }
    