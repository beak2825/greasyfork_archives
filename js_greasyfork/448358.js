// ==UserScript==
// @name         Colab Reconnect Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Colab reconnect panel
// @author       Fujun Sun
// @match        https://colab.research.google.com/drive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      AGPL license
// @downloadURL https://update.greasyfork.org/scripts/448358/Colab%20Reconnect%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/448358/Colab%20Reconnect%20Panel.meta.js
// ==/UserScript==

(function() {
    var addhtml='<style>#connect_panel{position:absolute;top:0;z-index:100000;right:400px;width:150px;background-color:#85f6fa}#connect_panel_button{position:absolute;height:25px;width:50%;border-bottom-left-radius:10px;border-bottom-right-radius:10px;border:1px solid #000;background-color:#000;color:#fff;outline:0}#connect_panel_button:hover{background-color:#fff;color:#000}#opt_panel{position:absolute;height:110px;z-index:100001;width:100%;border:1px solid #000;background-color:#fff;outline:0}#script_running_p,#time_running_p{font-size:12px;margin-left:5px}#script_running_status,#time_running_status{margin-left:5px}#run_button{height:25px;width:50%;margin-top:10px;border:1px solid #000;background-color:#fff;outline:0}#run_button:hover{background-color:#000;color:#fff}</style><div id="connect_panel"><div id="opt_panel" style="display:none"><p id="script_running_p">Status:<span id="script_running_status" style="color:#f06">⬤ Stop</span></p><p id="time_running_p">Time(s):<span id="time_running_status">0</span></p><center><button id="run_button">Run</button></center></div><button id="connect_panel_button" ><span id="show_mode">Show</span><span id="status_dot" style="color:rgb(255, 0, 102)"> ⬤</span></button></div>'
    var divObj = document.createElement("div");
       divObj.id = "connect_panel_colab";
      document.body.appendChild(divObj);
    divObj.innerHTML=addhtml

    document.getElementById("connect_panel_button").addEventListener("click",function(){
      var obj1=document.getElementById("opt_panel");
      obj1.style.display=obj1.style.display=="none"?"":"none";
      var btds1=document.getElementById("connect_panel_button");
      var btds2=document.getElementById("show_mode");
      var btds3=document.getElementById("status_dot");
      btds2.textContent=btds2.textContent=="Hide"?"Show":"Hide";
      btds1.style.top=btds1.style.top=="110px"?"0px":"110px";
      btds3.style.display=btds3.style.display=="none"?"":"none";
    })

  var task_connnect
  document.getElementById("run_button").addEventListener("click",function(){
      var obj1=document.getElementById("script_running_status");
      obj1.style.color=obj1.style.color=="rgb(255, 0, 102)"?"#00dd77":"rgb(255, 0, 102)";
      obj1.textContent=obj1.textContent=="⬤ Running..."?"⬤ Stop":"⬤ Running...";
      var obj3=document.getElementById("status_dot");
      obj3.style.color=obj3.style.color=="rgb(255, 0, 102)"?"#00dd77":"rgb(255, 0, 102)";

      var btds=document.getElementById("run_button");
      btds.textContent=btds.textContent=="Run"?"Stop":"Run";

      if(btds.textContent=="Stop"){
        document.getElementById("time_running_status").textContent=0;
        task_connnect=window.setInterval(function(){
           try {
             var obj2=document.getElementById("time_running_status");
             obj2.textContent=parseInt(obj2.textContent)+1;
             document.querySelector("colab-connect-button").shadowRoot.querySelector("#connect").click()
           } catch(e) {}
         },1000*60);
      }
      else{

        window.clearInterval(task_connnect);

      }
    })

    let view=document.getElementById('connect_panel');
view.onmousedown = function (ev) {
    var event = window.event || ev;
    var dx = event.clientX - view.offsetLeft;
    //var dy = event.clientY - view.offsetTop;
    //实时改变目标元素odiv的位置
    document.onmousemove = function (ev) {
        var event = window.event || ev;
        view.style.left = event.clientX - dx + 'px';
        //view.style.top = event.clientY - dy + 'px';
    }
    document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

})();