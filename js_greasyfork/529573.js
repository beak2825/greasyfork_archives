// ==UserScript==
// @name          Auto Left and Join with kick (beta version)
// @description   Auto Left and Join with kick (Anti Kick)
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
// @downloadURL https://update.greasyfork.org/scripts/529573/Auto%20Left%20and%20Join%20with%20kick%20%28beta%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529573/Auto%20Left%20and%20Join%20with%20kick%20%28beta%20version%29.meta.js
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
            console.log(data);
            if (data[0] == 5) {
              window.wsObj.lengthID = data[1];
              window.wsObj.id = data[2];
              window.wsObj.roomCode = data[3];
            }
            if (data[0] == 5) {
              window.wsObj.linkroom = data[10];
              let users = data[5];
              let numberuser = users.length;
              var numberenkick = ~~(users.length / 3);
              console.log(numberenkick);
              console.log(data[5]);
            }
            if (data[0] == 45) {
              window.wsObj.long = data[2];
              window.wsObj.longCount = 0;
              if (window.wsObj.long === window.wsObj.lengthID && isImageClicked) {
                  window.wsObj.send(`42[24,${window.wsObj.id}]`);
                  location.reload();
              }
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
        background-color: #000;
        border: 2px solid #ff0000;
        border-radius:15px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 999999;
      }
      #panel img {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
      }
    `);

    let panel = document.createElement('div');
    panel.id = 'panel';
    let img = document.createElement('img');
    let imageIndex = 0;
    let images = ['https://parspng.com/wp-content/uploads/2022/07/tickpng.parspng.com-2-300x300.png', 'https://dl.shut.ir/public/file/2023/10/17/%D8%B9%DA%A9%D8%B3-%D8%B6%D8%B1%D8%A8%D8%AF%D8%B1-%D9%82%D8%B1%D9%85%D8%B2-%D8%AF%D8%B1-%D8%AF%D8%A7%DB%8C%D8%B1%D9%87.png'];
    img.src = images[imageIndex];
    img.onclick = function() {
      imageIndex = (imageIndex + 1) % images.length;
      this.src = images[imageIndex];
    };
        let isImageClicked = true;

    img.onclick = function() {
      imageIndex = (imageIndex + 1) % images.length;
      this.src = images[imageIndex];
      isImageClicked = !isImageClicked;
    };
    let text = document.createElement('p');
    text.textContent = 'Auto Left and Join';
    text.style.marginBottom = '5px';
    let text3 = document.createElement('p');
    text3.textContent = 'Beta version';
    text3.style.fontSize = '12px';
    panel.appendChild(img);
    panel.appendChild(text);
    panel.appendChild(text3);

    document.body.appendChild(panel);
    })();

