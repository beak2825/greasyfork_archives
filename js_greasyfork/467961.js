// ==UserScript==
// @name            Youtube Buzzer
// @name:de         Youtube Buzzer
// @namespace       http://1fckeller.de/
// @version         0.3
// @description     add buzzer including autopause to youtube video sites (for quizzes)
// @description:de  Youtube-Videos (Quiz) per Gamepad Buzzer unterbrechen
// @author          DGZeule
// @license         GNU GPLv3
// @match           https://www.youtube.com/watch?v=*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require         https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/467961/Youtube%20Buzzer.user.js
// @updateURL https://update.greasyfork.org/scripts/467961/Youtube%20Buzzer.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    var buzzerSettings={
        timer: 6000,
        animate: true,
        farben: ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff7f00","#ff007f","#7fff00","#7f00ff","#00ff7f","#007fff"],
        teamNames: [],
        haveEvents: 'ongamepadconnected' in window,
        controllers: {},
        teams: [],
        ytbResetTimeout:0
    }
    $("body").append(`<style>
  #buzzer{
    position: fixed;
    font-weight: bold;
    margin: 0;
    width: 100%;
    height: 100%;
    font-size: 100px;
    padding-top: 300px;
    text-align: center;
    top: 0;
    left: 0;
    z-index: 9000;
    opacity: .8;
    display:none;
    background-repeat: no-repeat;
  }
  div#settingsBtn {
    position: fixed;
    top: 0;
    left: 195px;
    z-index: 3000;
    font-size:25px;
    color: #888;
    cursor:pointer;
  }
  #buzzerSettings{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background-color: #fff;
    opacity: .9;
    z-index: 3000;
    padding: 10px;
    font-size: 25px;
  }
  #buzzerSettings input,#buzzerSettings button{
    font-size: 25px;
  }
  .buzzerTeamName{
    display:block;
  }
  #closeSettings {
    float: right;
    font-size: 25px;
    border: 2px outset #999;
    border-radius:5px;
    padding:10px;
    line-height:20px;
    cursor:pointer;
  }</style>
<div id="settingsBtn">
  <svg fill="#888888" version="1.1" id="buzzerCogs" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="924 796 200 200" enable-background="new 924 796 200 200" xml:space="preserve">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <g>
        <path d="M1049.078,903.431h-3.447c-3.104,0-5.875-1.963-6.904-4.891c-0.626-1.793-1.354-3.536-2.176-5.227 c-1.361-2.806-0.799-6.167,1.404-8.369l2.381-2.382c4.029-4.028,4.029-10.556,0.002-14.583l-1.717-1.717 c-4.025-4.024-10.557-4.028-14.58,0l-2.436,2.433c-2.193,2.196-5.538,2.769-8.336,1.425c-1.696-0.811-3.442-1.532-5.236-2.155 c-2.948-1.017-4.928-3.795-4.928-6.91v-3.37c0-5.693-4.618-10.31-10.309-10.31h-2.43c-5.695,0-10.312,4.616-10.312,10.31v3.444 c0,3.107-1.962,5.877-4.892,6.906c-1.792,0.627-3.534,1.354-5.224,2.176c-2.803,1.361-6.166,0.796-8.371-1.406l-2.377-2.382 c-4.03-4.028-10.558-4.028-14.584,0l-1.719,1.717c-4.026,4.028-4.028,10.555,0,14.583l2.434,2.432 c2.193,2.197,2.765,5.54,1.421,8.341c-0.812,1.691-1.532,3.44-2.15,5.234c-1.021,2.945-3.798,4.926-6.915,4.926h-3.367 c-5.695,0-10.312,4.617-10.312,10.313v2.429c0,5.693,4.617,10.31,10.312,10.31h3.441c3.106,0,5.876,1.963,6.903,4.893 c0.63,1.791,1.358,3.537,2.18,5.227c1.361,2.804,0.795,6.164-1.408,8.367l-2.379,2.383c-4.029,4.027-4.027,10.555,0,14.582 l1.718,1.718c4.025,4.023,10.553,4.026,14.58-0.003l2.431-2.432c2.195-2.194,5.54-2.768,8.341-1.424 c1.694,0.813,3.441,1.533,5.236,2.155c2.946,1.018,4.927,3.795,4.927,6.913v3.364c-0.004,5.699,4.614,10.313,10.311,10.313h2.427 c5.696,0,10.314-4.614,10.311-10.309v-3.445c0-3.104,1.962-5.875,4.892-6.905c1.792-0.628,3.537-1.354,5.229-2.175 c2.801-1.362,6.165-0.798,8.368,1.404l2.379,2.38c4.027,4.029,10.555,4.025,14.583,0.002l1.717-1.718 c4.027-4.026,4.03-10.557,0-14.581l-2.432-2.433c-2.197-2.193-2.768-5.54-1.426-8.337c0.814-1.696,1.533-3.445,2.154-5.24 c1.021-2.947,3.795-4.926,6.914-4.926h3.367c5.695,0.002,10.31-4.616,10.31-10.312v-2.429 C1059.385,908.049,1054.771,903.427,1049.078,903.431z M991.694,940.147c-13.852,0-25.081-11.227-25.081-25.078 c0-13.853,11.229-25.08,25.081-25.08c13.85,0,25.079,11.228,25.079,25.08C1016.772,928.921,1005.544,940.147,991.694,940.147z"></path> <path d="M1117.307,845.487h-1.727c-2.557,0-4.847-1.583-5.752-3.974c-0.229-0.609-0.479-1.212-0.746-1.804 c-1.053-2.329-0.554-5.07,1.256-6.876l1.219-1.221c2.613-2.611,2.613-6.853,0-9.466l-0.473-0.473c-2.613-2.612-6.852-2.612-9.465,0 l-1.219,1.221c-1.809,1.809-4.547,2.308-6.877,1.258c-0.593-0.268-1.192-0.516-1.805-0.747c-2.389-0.903-3.975-3.196-3.975-5.748 v-1.729c0-3.697-2.996-6.692-6.689-6.692h-0.668c-3.698,0-6.696,2.995-6.696,6.692v1.724c0,2.557-1.581,4.85-3.972,5.753 c-0.609,0.231-1.215,0.479-1.805,0.747c-2.328,1.05-5.069,0.551-6.876-1.256l-1.22-1.221c-2.611-2.614-6.854-2.613-9.467,0.001 l-0.472,0.472c-2.613,2.613-2.613,6.853,0,9.465l1.219,1.22c1.806,1.806,2.31,4.547,1.257,6.876 c-0.268,0.592-0.517,1.194-0.748,1.804c-0.903,2.391-3.193,3.977-5.748,3.977h-1.727c-3.695-0.002-6.691,2.997-6.691,6.69v0.669 c0,3.696,2.996,6.693,6.691,6.693h1.722c2.557-0.001,4.85,1.582,5.753,3.973c0.231,0.611,0.48,1.215,0.747,1.809 c1.052,2.326,0.552,5.065-1.255,6.871l-1.219,1.224c-2.613,2.609-2.613,6.851,0,9.463l0.475,0.473c2.611,2.614,6.852,2.614,9.463,0 l1.217-1.219c1.807-1.806,4.549-2.308,6.877-1.255c0.592,0.269,1.197,0.517,1.809,0.748c2.389,0.901,3.974,3.193,3.974,5.747v1.724 c-0.004,3.694,2.995,6.692,6.692,6.692h0.669c3.693,0,6.692-2.994,6.692-6.692v-1.721c0-2.556,1.582-4.849,3.971-5.752 c0.612-0.23,1.216-0.479,1.809-0.746c2.326-1.053,5.068-0.551,6.873,1.251l1.223,1.222c2.609,2.615,6.85,2.615,9.465,0l0.473-0.475 c2.611-2.611,2.611-6.851,0-9.464l-1.221-1.22c-1.805-1.806-2.307-4.547-1.256-6.875c0.268-0.59,0.518-1.194,0.749-1.805 c0.901-2.391,3.191-3.976,5.747-3.976h1.725c3.694,0.004,6.691-2.995,6.695-6.69v-0.669 C1123.996,848.483,1121,845.487,1117.307,845.487z M1080.717,867.24c-8.131,0-14.723-6.592-14.723-14.724 s6.592-14.724,14.723-14.724c8.133,0,14.725,6.592,14.725,14.724S1088.85,867.24,1080.717,867.24z"></path>
      </g>
    </g>
  </svg>
</div>
<div id="buzzerSettings">
  <div id='closeSettings'>&times;</div>
  Timer: <input type="number" name="timer" size="2"> s<br>
  Animate timeout? <input type="checkbox" name="animate"><br>
</div>
<div id="buzzer">
</div>`);

    if(window.localStorage){
        try{
            var tmp=JSON.parse(localStorage.getItem("teamNames"));
            for(var i=0;i<tmp.length;i++)buzzerSettings.teamNames[i]=tmp[i];
            tmp=JSON.parse(localStorage.getItem("buzzerAnimate"));
            buzzerSettings.animate=tmp;
            tmp=JSON.parse(localStorage.getItem("buzzerTimer"));
            buzzerSettings.timer=tmp;
        }catch(e){};
    }

    $("#buzzerSettings").hide();
    function reset(){
        if(buzzerSettings.ytbResetTimeout)clearTimeout(buzzerSettings.ytbResetTimeout);
        buzzerSettings.ytbResetTimeout=0;
        buzzerSettings.buzzed=false;
        $("#buzzer").text("").hide().css({backgroundSize: "100%", backgroundColor:"#fff"});
        $("#buzzerSettings").hide();
        $("ytd-app").css({"--app-drawer-content-container-background-color":"#fff","background-color":"#fff" });
        $(".html5-main-video")[0].play();
    }

    $(document).keyup(function(e){
        if(e.keyCode==27){ /*Esc*/
            reset();
            $("#settingsBtn").show();
        }
    });

    function connecthandler(e){
        addgamepad(e.gamepad);
    }

    function addgamepad(gamepad) {
        buzzerSettings.controllers[gamepad.index] = gamepad;
        requestAnimationFrame(updateStatus);
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
        var d = document.getElementById("controller" + gamepad.index);
        document.body.removeChild(d);
        delete buzzerSettings.controllers[gamepad.index];
    }

    function updateStatus() {
        if (!buzzerSettings.haveEvents) {
            scangamepads();
        }
        var i = 0,t=0,j,k,team;
        buzzerSettings.teams=[];
        if(!buzzerSettings.buzzed){
            for (j in buzzerSettings.controllers) {
                var controller = buzzerSettings.controllers[j];
                if(controller.id.match("Xbox")){
                    buzzerSettings.teams[t]=[getTeam(t), buzzerSettings.farben[t], j, 0];
                    t++;
                }else if(controller.id.match("Buzz")){
                    for(k=0;k<4;k++,t++){
                        buzzerSettings.teams[t]=[getTeam(t), buzzerSettings.farben[t], j, k*5];
                    }
                }
                for(i = 0; i < controller.buttons.length; i++){
                    var val = controller.buttons[i].value;
                    if(val != 1)continue;
                    for(team=0,k=0;k<buzzerSettings.teams.length;k++){
                        if(buzzerSettings.teams[k][2]==j && buzzerSettings.teams[k][3]==i){
                            team=buzzerSettings.teams[k];
                            break;
                        }
                    }
                    if(!team)continue;
                    buzzerSettings.buzzed=1;
                    var c=team[1];
                    if(buzzerSettings.animate){
                        $("#buzzer").css(
                            {backgroundColor: c+"88",backgroundImage: "linear-gradient(0, "+c+", "+c+")", backgroundSize:"100%"}
                        ).animate({backgroundSize:"0%"}, buzzerSettings.timer);
                    }else{
                        $("#buzzer").css({backgroundColor: c});
                    }
                    $("#buzzer").text(team[0]).show();
                    $("ytd-app").css({"--app-drawer-content-container-background-color":c,"background-color":c });
                    $(".html5-main-video")[0].pause();
                    buzzerSettings.ytbResetTimeout=setTimeout(reset, buzzerSettings.timer);
                }
            }
        }
        requestAnimationFrame(updateStatus);
    }

    function scangamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads():[]);
        for(var i = 0; i < gamepads.length; i++){
            if(gamepads[i]) {
                if(gamepads[i].index in buzzerSettings.controllers){
                    buzzerSettings.controllers[gamepads[i].index] = gamepads[i];
                }else{
                    addgamepad(gamepads[i]);
                }
            }
        }
    }
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    if(!buzzerSettings.haveEvents){
        setInterval(scangamepads, 500);
    }

    function getTeam(t){
        var tmp=$_GET("team"+t);
        return tmp?tmp:(buzzerSettings.teamNames[t]?buzzerSettings.teamNames[t]:("Team"+(t+1)));
    }

    function $_GET(p){
        var result = null;
        (location.hash||location.search).substr(1).split("&").forEach(function(item){
            var tmp = item.split("=");
            if(tmp.shift() === p)result=decodeURIComponent(tmp.join("="));
        });
        return result;
    }
    function saveSettings(){
        var h="#";
        for(var i=0;i<buzzerSettings.teamNames.length;i++){
            h+=(i?"&":'')+"team"+i+"="+buzzerSettings.teamNames[i];
        }
        location.hash=h;
        if(window.localStorage){
            localStorage.setItem("buzzerTeamNames", JSON.stringify(buzzerSettings.teamNames));
            localStorage.setItem("buzzerTimer", JSON.stringify(buzzerSettings.timer));
            localStorage.setItem("buzzerAnimate", JSON.stringify(buzzerSettings.animate));
        }
        reset();
        $("#settingsBtn").show();
    }

    $("#buzzerSettings input[name=animate]").change(function(e){
        buzzerSettings.animate=$(this).is(":checked");
        if(e.keyCode==13)saveSettings();
    }).prop("checked", buzzerSettings.animate);
    $("#buzzerSettings input[name=timer]").keyup(function(e){
        buzzerSettings.timer=parseFloat($(this).val())*1000;
        if(e.keyCode==13)saveSettings();
    }).val(buzzerSettings.timer/1000);

    $("#settingsBtn").click(function(){
        $("#buzzerSettings").show().find(".buzzerTeamName,button").remove();
        $("#settingsBtn, #buzzer").hide();
        $(buzzerSettings.teams).each(function(k,v){
            $("#buzzerSettings").append($("<input>").addClass('buzzerTeamName').data("team", k).val(v[0]).css("backgroundColor", v[1]).keyup(function(e){
                var t=$(this).data("team");
                buzzerSettings.teamNames[t]=$(this).val();
                if(e.keyCode==13)saveSettings();
            }));
        });
        $("#buzzerSettings").append(
            $("<button>").text("save").click(saveSettings)
        );
    });


    $("#closeSettings").click(function(){
        $("#buzzerSettings").hide();
        $("#settingsBtn, #buzzer").show();
    });
})(jQuery);
