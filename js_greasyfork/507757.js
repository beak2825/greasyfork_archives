
 // ==UserScript==
// @name          Fast Left and Rejoin
// @description   Fast Left and Auto Rejoin
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x

// @downloadURL https://update.greasyfork.org/scripts/507757/Fast%20Left%20and%20Rejoin.user.js
// @updateURL https://update.greasyfork.org/scripts/507757/Fast%20Left%20and%20Rejoin.meta.js
    // ==/UserScript==

    (function() {
      let originalSend = WebSocket.prototype.send;
      let setTrue = false;

      window.wsObj = {};

      WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
          window.wsObj = this;
          window.eventAdd();
        }
      };
        window.eventAdd = () => {

    if (!setTrue) {

      setTrue = 1;

      window.wsObj.addEventListener("message", (msg) => {
        let data = JSON.parse(msg.data.slice(2));
        if (data[0] == 5) {
          window.wsObj.lengthID = data[1];
          window.wsObj.id = data[2];
        }
      });
    }
  };

        let ready=0,oldurl;
    let panelx = document.createElement("div");
    panelx.setAttribute("class","roomspanel");
    panelx.setAttribute("style","width:0%;height:auto;max-height:0px;overflow-y:scroll;padding:10px;position:fixed;background-color:white;color:grey;font-weight:bold;right:10px;top:50%;transform:translate(0,-50%);border-radius:10px;border:2px solid grey;text-align:center;z-index:99999;");
    let icerik = "<h2>Odalar</h2><hr><br><input type='text' style='padding:10px;' placeholder='Oda Ara..' oninput='window.refreshrooms(this.value)' class='mousetrap' /><br><br><div class='odaliste'></div>";
    function _(x){return document.querySelector(x);};
    function _a(x){return document.querySelectorAll(x);};
    window.refresh=(x=window.location.href)=>{window.onbeforeunload=null;oldurl=x;_("#exit").click();_(".ic-yes").click();setTimeout(window.location.href=oldurl,500);};

    setTimeout(()=>{
        if(document.title.indexOf("#")!=-1){
            let l = setInterval(()=>{
                _(".ic-playHome").click();
                clearInterval(l);
            },100);
        }
    },300);

    window.refreshrooms=(x="")=>{
        let roomdatas;
        fetch("https://gartic.io/req/list?search="+x+"&language[]=8").then(x=>x.json()).then(x=>{
            roomdatas=x;
            _(".odaliste").innerHTML="";
            for(let i of roomdatas){
                _(".odaliste").innerHTML+="<button style='width:70%;text-align:center;background-color:dodgerblue;color:white;border:2px solid cyan;border-radius:10px;padding:10px;' onclick='window.refresh(\"https://gartic.io/"+i.code+"\")'><b>"+i.code.slice(-3)+" - "+i.quant+"/"+i.max+"</b></button><a href='https://gartic.io/"+i.code+"/viewer' target='_blank'>Viewer</a><br>";
            }
        });
    }

    document.body.addEventListener("keyup",(event)=>{
        window.event.keyCode==27?window.refresh():0;
    })

    let a = setInterval(()=>{
        if(_(".game")){
            if(ready==0){
                setTimeout(()=>{
                    _(".logo").remove();
                    if(!_(".roomspanel")){
                        document.body.appendChild(panel);
                        _(".roomspanel").innerHTML=icerik;
                        window.refreshrooms();
                    }
                    for(let i of _a(".alert")){
                        i.setAttribute("class","msg");
                    }
                    _(".user.you").innerHTML+='<span style="padding:10px;background:black;color:gold;font-weight:bold;">VIP</span>';
                    ready=1;
                },300);
            }
            _(".contentPopup")?_(".btYellowBig.ic-yes").click():0;
            _("g")?_("g").remove():0;
            if(ready==1){
                for(let i of _a(".scrollElements")[2].querySelectorAll(".msg.alert")){
                    i.innerText.split(", ")[1].split(" ")[0] == _(".user.you").innerText.split("\n")[0]?window.refresh():0;
                }
            }
        }
    },50);


    GM_addStyle(`
      #panel {
        position: fixed;
        top: 60px;
        left: 5px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 999999;
      }
      #panel img {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
    `);

    let panel = document.createElement('div');
    panel.id = 'panel';
    let img = document.createElement('img');

    img.src = 'https://static-00.iconduck.com/assets.00/exit-icon-1821x2048-izrubw8d.png';
    img.onclick = function() {
    window.wsObj.send(`42[24,${window.wsObj.id}]`);
    location.reload();
    };

    panel.appendChild(img);


    document.body.appendChild(panel);
    })();

