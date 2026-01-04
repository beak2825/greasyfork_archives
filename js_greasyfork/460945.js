// ==UserScript==
// @name         Twitter Auto Retweet
// @version      0.1
// @description  Automation system for automatic retweet and like on Twitter
// @namespace    github.com/Qwyua
// @author       Qwyua
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460945/Twitter%20Auto%20Retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/460945/Twitter%20Auto%20Retweet.meta.js
// ==/UserScript==

let targetNode = document.body;
const f = x => document.querySelectorAll(x),q = x => document.querySelector(x),panel = document.createElement("div");
function randmesaj(){const mesaj=["test1","test2","test3","test4"];let f=Math.floor(Math.random()*mesaj.length);return mesaj[f]}
function checkboxcheck(){let selectpanel = document.querySelector('div[class="panel"]');let pinputs = selectpanel.querySelectorAll('input[type="checkbox"]');for (var i = 0; i < pinputs.length; i++){let checked = GM_getValue("checkbox_" + i, false);pinputs[i].checked = checked;(function(i){pinputs[i].addEventListener("input",function(event){GM_setValue("checkbox_" + i,pinputs[i].checked)})})(i)}};
function checkCheckbox(index){let selectpanel = document.querySelector('div[class="panel"]');let pinputs = selectpanel.querySelectorAll('input[type="checkbox"]');let checked = pinputs[index].checked;if(checked){return "true"}else{return "false"}}
function setinput(){let x = document.querySelector('div[style="max-height: 720px;"] span span');var event = new Event('input',{bubbles:true,cancelable:true});x.dispatchEvent(event);x.dispatchEvent(event);x.click();x.focus();}
function input_gizlegöster(){let labels = document.querySelectorAll('.panel label'),pd = document.querySelector("body > div.panel > fieldset:nth-child(4)");let display = checkCheckbox(3) == "true" ? "block" : "none";checkCheckbox(3) == "true"?pd.style.display="block":pd.style.display="none";for(let i = 4; i <= 8; i++){labels[i].style.display = display}}
setInterval(function(){let antibot_bt = document.querySelector('div[role="button"] span span');if(antibot_bt&&antibot_bt.innerText=="Retry"){antibot_bt.click();antibot_bt.scrollIntoView(true)}},500);
setTimeout(function(){checkboxcheck();document.querySelector(".panel textarea").value=GM_getValue("textarea");document.querySelectorAll('.panel label')[3].addEventListener("input",function(){input_gizlegöster()});document.querySelector(".panel textarea").addEventListener("input",function(){GM_setValue("textarea",document.querySelector(".panel textarea").value)})},500);
let start=setInterval(function(){if(q('.panel')){setTimeout(function(){if(checkCheckbox(0)=="true"){window.location.href=window.location.href}},60000);clearInterval(start);document.querySelector(".panel button").addEventListener("click",function(){retweetAll()})}else{document.body.appendChild(panel);checkboxcheck();input_gizlegöster()}},200);
let observer = new MutationObserver(function(mutations){mutations.forEach(function(mutation){let newNodes = mutation.addedNodes;if(newNodes!==null){let nodes=Array.from(newNodes);nodes.forEach(function(node){if(node.matches&&node.matches('div[data-testid="cellInnerDiv"]')&&checkCheckbox(9)=="true"){retweetAll()}})}})});
observer.observe(targetNode,{childList:true,subtree:true});
panel.className = "panel";
panel.style=`color:white;font-family:;position:fixed;z-index:9999;right:0px;top:0px;background:#151D3B;padding:5px;border-radius:3px;font-family:arial;box-shadow:3px 3px black;display:block;`
panel.innerHTML=`<center><h3 style="text-shadow:3px 3px black;padding-bottom:10px;">&nbsp;Twitter auto retweet</h3></center><fieldset style="flex-direction:column;display:flex;"><legend> Ayarlar </legend><label>oto yenile(60s)<input type="checkbox"></label><label>(yakında)<input type="checkbox"></label><label>(yakında)<input type="checkbox"></label></fieldset><fieldset style="flex-direction:column;display:flex"><legend> Quote Tweet </legend><label>Quote Tweet(yazılı)<input type="checkbox"></label><label>aynı etiket ile etiketleme<input type="checkbox"></label><label>aynı mesajı yaz<input type="checkbox"></label><label>oto gönderme<input type="checkbox"></label><label>(yakında)<input type="checkbox"></label><label>(yakında)<input type="checkbox"></label></fieldset><fieldset style="flex-direction:column;display:flex;"><legend> Retweet mesajı </legend><textarea rows = "5" cols = "20" name = "description"></textarea></fieldset><center><label style="fontsize:10px;color:black;cursor:pointer;font-weight:bold;">otomatik calıştır<input type="checkbox"></label><br><button class="twbt">Calistir</button></center>`;
GM_addStyle(`.twbt{padding:10px 15px;font-size:15px;text-align:center;cursor:pointer;outline:none;font-weight:bold;color:#fff;background-color:#00acee;box-shadow:0 2px;border-radius:30px;border: 1px solid #00acee}.twbt:active{background-color:#00acbb;transform:translateY(2px)}`);

function retweetAll() {
  let cellInnerDivs = f('div[data-testid="cellInnerDiv"]');
  cellInnerDivs.forEach((cellInnerDiv, index) => {
    let likeButton = cellInnerDiv.querySelector("[role='button'][data-testid='like']");
    if (likeButton) {
     likeButton.click();
      setTimeout(() => {
        cellInnerDiv.querySelector("[role='button'][data-testid='retweet']").click();
                if(checkCheckbox(3)=="false"){
        document.querySelector("[role='menuitem'][data-testid='retweetConfirm']").click();
                }else{
          document.querySelector("[role='menuitem'][data-testid='retweetConfirm']").parentElement.querySelector("a").click();
 let sdew = setInterval(function(){
           let bw = document.querySelector('div[aria-haspopup="menu"] span span');
           if(bw.innerText=="Everyone")
           {
                     bw.innerText="cleared";clearInterval(sdew)
              setTimeout(function(){
    let etiket,etiketler,rtmesajı=document.querySelector(".panel textarea").value,mesajalanı=document.querySelector('div[style="max-height: 720px;"] span span');
                     if(checkCheckbox(3)=="true"&&checkCheckbox(4)=="true"){

                               if(checkCheckbox(5)=="false"){
                                          let leyt =document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div > div > div.css-1dbjc4n.r-iphfwy > div.css-1dbjc4n.r-kemksi.r-1pp923h.r-1moyyf3.r-oyd9sg > div:nth-child(1) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div.css-1dbjc4n.r-16y2uox.r-bnwqim.r-13qz1uu.r-1g40b8q > div > div > div > div.css-1dbjc4n.r-15zivkp.r-14gqq1x.r-184en5c > div > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1kqtdi0.r-1867qdf.r-rs99b7.r-7q8q6z.r-p1pxzi.r-14gqq1x.r-adacv.r-1ny4l3l.r-1udh08x > div > div.css-1dbjc4n.r-6gpygo.r-1fz3rvf > div");
 etiketler = leyt.innerText.match(/#\w+/g) || [];
 etiket = etiketler.join(" ");
                     }else{
        etiket = document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div > div > div.css-1dbjc4n.r-iphfwy > div.css-1dbjc4n.r-kemksi.r-1pp923h.r-1moyyf3.r-oyd9sg > div:nth-child(1) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div.css-1dbjc4n.r-16y2uox.r-bnwqim.r-13qz1uu.r-1g40b8q > div > div > div > div.css-1dbjc4n.r-15zivkp.r-14gqq1x.r-184en5c > div > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1kqtdi0.r-1867qdf.r-rs99b7.r-7q8q6z.r-p1pxzi.r-14gqq1x.r-adacv.r-1ny4l3l.r-1udh08x > div > div.css-1dbjc4n.r-6gpygo.r-1fz3rvf > div").innerText
                     }
if(checkCheckbox(3) == "true"){
for (var we = 0; we < 5; we++){
setTimeout(function(){
setinput();
mesajalanı.innerText=rtmesajı + " " + etiket + " ";
setinput();
},50 * we);
                }
                        setTimeout(function(){
            if(checkCheckbox(6) == "true"){
             let mm=document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div > div > div.css-1dbjc4n.r-iphfwy > div.css-1dbjc4n.r-kemksi.r-1pp923h.r-1moyyf3.r-oyd9sg > div:nth-child(1) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div:nth-child(3) > div > div > div:nth-child(2) > div.css-18t94o4.css-1dbjc4n.r-l5o3uw.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-19u6a5r.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr")
             mm.scrollIntoView(true);
             mm.click();
             }
            },1000);
                     }
                     }
           },500);

            }

                        },1000);
                }
        },600);
    }

  });
}

