// ==UserScript==
// @name         panel-suna
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Amigo57
// @include      *://suna.e-sim.org/*
// @match        *://suna.e-sim.org/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/40350/panel-suna.user.js
// @updateURL https://update.greasyfork.org/scripts/40350/panel-suna.meta.js
// ==/UserScript==

(function() {

     function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


 addGlobalStyle(`#proli a { margin-left:20px;font-size: 18px;font-style: oblique;color: white; }`);

  addGlobalStyle(`#proli img {
    width:  30px;
    height:  30px;
    position:  absolute;
    top: 3px;
    left: 5px;
 }`);

document.body.innerHTML += `<audio id="audio" preload="auto" src="http://csscase.ucoz.net/mot_kapkan.mp3" loop="true" autobuffer>
Unsupported in Firefox
</audio>`;



     var img = document.createElement("button");
     img.id = "salary";
     img.className = "icon-scales";
     img.style = `width: 23px;    padding: 0px;    height: 32px;    color: white;    background: green;    border: 1px;    border-radius: 3px;`;
     var src = document.getElementById("share-wrapper");
     src.appendChild(img);

    // Your code here...
    document.getElementById("salary").onclick = function () {
        this.disabled = true;
        var main=document.createElement('div');
        main.id="iq";
        main.style = `
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.61);;
        position: fixed;
        top: 0;
        left:0;
        z-index: 9998;`;
//        main.setAttribute(`onclick`, `this.remove() ;document.getElementById("content").remove();document.getElementById("salary").disabled=false`);
        document.body.appendChild(main);

        var content=document.createElement('div');
        content.id="content";
        content.style = `top: 50%;left: 50%;width: 1000px;z-index: 9999;height: 700px;position: fixed;margin-top: -350px;margin-left: -500px;background-image: url('https://wallpapercave.com/wp/lVcZVvt.jpg');border: 1px solid;`;
        content.innerHTML = `
	<div id="left" style="float: left;width: 20%;height: 100%;overflow-y: auto;border-right: 1px solid white;background-color: #3341923d;">
         <button id="proli" style="font-weight: normal;
    text-align: left;
    width: 100%;
    height: 40px;
    background-color: rgba(10, 34, 171, 0.6);
    border-right: none;
    border-left: none;
    border-image: initial;
    border-bottom: 1px solid wheat;
    border-top: 1px solid wheat;
    color: white;"></button>
	</div>
  <div id="main" style="text-align:center;float: left;width: 79.9%;height: 100%;/* background-image: url('https://wallpapercave.com/wp/lVcZVvt.jpg'); */">
        <center>
           <div><img src="https://image.ibb.co/mtR7SH/499304_normal.png" style="margin-top:  40px;background-color: #ffffff59;border: 2px solid grey;border-radius: 50%;padding: 10px;"></div>
           <div style="font-size: 20px;color: white;font-style: oblique;margin-top: 5px !important;background: #000000a3;padding: 5px;border-radius:  9px;width: 250px;border: 1px solid;">Thank you for choosing us</div>
        </center>

</div>
<button id="aud" style="background: #334192a1;position:  absolute;top: 0px;right: 50px;font-size: 18px;width: 50px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;padding-left: 18px;border-radius: 0 0  0 100%;height: 45px;"><i class="icon-uniF00F"></i></button>
<button onclick="document.getElementById('iq').remove() ;document.getElementById('content').remove();document.getElementById('salary').disabled=false" style="background: #f44336b3;position:  absolute;top: 0px;right: 0px;font-size: 18px;width: 50px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;border-radius: 0 0  0 0;height: 45px;">X</button>`;
        document.body.appendChild(content);

        document.getElementById("proli").innerHTML= document.getElementById("userAvatar").innerHTML;
        document.getElementById("proli").onclick = function() {
          document.getElementById("main").innerHTML = `
        <center>
           <div><img src="https://image.ibb.co/mtR7SH/499304_normal.png" style="margin-top:  40px;background-color: #ffffff59;border: 2px solid grey;border-radius: 50%;padding: 10px;"></div>
           <div style="font-size: 20px;color: white;font-style: oblique;margin-top: 5px !important;background: #000000a3;padding: 5px;border-radius:  9px;width: 250px;border: 1px solid;">Thank you for choosing us</div>
        </center>
           `;
        };

        //types iron; pistol-gun ; grain ; food ; diamond ; gift and others

          document.getElementById("aud").onclick = function() {


                   var myAudio = document.getElementById('audio');
                   if (myAudio.duration > 0 && !myAudio.paused) {
                        //Its playing...do your job
                        myAudio.pause();
                   } else {
                        myAudio.play();
                   }
          };

        addcategory('stock','stock');
        stock('stock','dagger','https://suna.e-sim.org/storage.html?storageType=PRODUCT&y','Stocks in My account');
        stock('stock','dagger','https://suna.e-sim.org/militaryUnitStorage.html?y','Stocks in Military unit');
        stock('stock','dagger','https://suna.e-sim.org/stockCompanyProducts.html?id=3663&y','Stock company storage');

        addcategory('own','own companies');
        addcomp("own","iron",27367,'PATRIOT - #1 IRON ?');
        addcomp("own","iron",27807,'PATRIOT - #2 IRON ?');

    };

function addcategory(cat_id,title){
    var d=document.createElement('div');
    d.style =`width:100%;font-size: 20px;color: white;font-style: oblique;margin:0px;margin-top: 10px;`;
    d.id= cat_id ;
    d.innerHTML= `<span style="padding-left:5px">` + title + `</span>` ;
    document.getElementById('left').appendChild(d);
}



function addcomp(cat_id,type,id,name){
    var but = document.createElement("button");
    but.style="font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: #3341923d;border-right: none;border-left: none;border-image: initial;border-bottom: 1px solid wheat;border-top: 1px solid wheat;color: white;";
    but.innerHTML= `<i class="icon-`+ type + `"></i> ` +  name;
    but.className = type + " s";
    but.onclick = function() {
       var ele = document.getElementsByClassName('s');
       for (var i = 0; i < ele.length; i++ ) {
       ele[i].style= "font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: #3341923d;border-right: none;border-left: none;border-image: initial;border-bottom: 1px solid wheat;border-top: 1px solid wheat;color: white;";
}
        this.style="font-weight: bold;text-align: left;width: 100%;height: 30px;background-color: rgba(220, 201, 45, 0.7);border: none;border-bottom:  1px solid wheat;border-top: 1px solid wheat;";
        document.getElementById("main").innerHTML =
        `
<table style="width:100%;height: 100%;">
          <tbody>
            <tr style="height: 55%;">
              <td>
                <iframe width="100%" height="100%" src="https://suna.e-sim.org/companyWorkResults.html?id=` + id + `&y" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
              </td>
            </tr style="height: 45%;">
             <tr>
              <td>
               	<iframe width="100%" height="100%" src="https://suna.e-sim.org/company.html?id=` + id +`&y" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
              </td>
</tr>
</tbody>
</table>
`

        ;




    };
    document.getElementById(cat_id).appendChild(but);

}


function stock(cat_id,type,url,name){
    var but = document.createElement("button");
    but.style="font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: #3341923d;border-right: none;border-left: none;border-image: initial;border-bottom: 1px solid wheat;border-top: 1px solid wheat;color: white;";
    but.innerHTML= `<i class="icon-`+ type + `"></i> ` +  name;
    but.className = type + " s";
    but.onclick = function() {
       var ele = document.getElementsByClassName('s');
       for (var i = 0; i < ele.length; i++ ) {
       ele[i].style= "font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: #3341923d;border-right: none;border-left: none;border-image: initial;border-bottom: 1px solid wheat;border-top: 1px solid wheat;color: white;";
}
        this.style="font-weight: bold;text-align: left;width: 100%;height: 30px;background-color: rgba(220, 201, 45, 0.7);border: none;border-bottom:  1px solid wheat;border-top: 1px solid wheat;";
        document.getElementById("main").innerHTML =
        `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;">
               `+ name + `<hr><iframe width="100%" height="100%" src="` + url + `" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
         </div></center>   `

        ;




    };
    document.getElementById(cat_id).appendChild(but);

}


})();