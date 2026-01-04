// ==UserScript==
// @name         Project
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Col
// @author       You
// @match        *://gleam.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436679/Project.user.js
// @updateURL https://update.greasyfork.org/scripts/436679/Project.meta.js
// ==/UserScript==

//settings
const defaultDelay = 1000;




let elements = document.querySelectorAll("div.entry-method")
async function Main() {

let BSC = document.querySelector("#BSC").innerText;
let Telegram = document.querySelector("#Telegram").innerText;
let Twitter = document.querySelector("#Twitter").innerText;


for(let i=0;i<elements.length;i++){
    await sleep(defaultDelay);
    let count = 0;
    console.log("Prohod "+i)
let inner = document.querySelectorAll("div.entry-method")[i].innerHTML
let TwitterDone = inner.match(/clearfix actioned mandatory done/gm)
let CustomDone = inner.match(/clearfix actioned done/gm)

let text = document.querySelectorAll("div.entry-method")[i].innerText
let TwitterFollowText = text.match(/Follow @\w+ on Twitter/gm)
let TwitterRetweetText = text.match(/Retweet @\w+ on Twitter/gm)
let TelegramText = text.match(/Telegram/gm)
let telegramText = text.match(/telegram/gm) 
let Telegram1Text = text.match(/Announcement/gm)
let TweetText = text.match(/Tweet on Twitter/gm)
let YoutubeText = text.match(/YouTube/gm)
let PolygonText = text.match(/Polygon/gm)
let ReferFriends = text.match(/Refer Friends For Extra Entries/gm)
let DiscordText = text.match(/Discord/gm)
let TRC1Text = text.match(/TRC20/gm)
let Binance = text.match(/Binance/gm)
let Celo = text.match(/Celo Wallet/gm)
let BSC1Text = text.match(/Binance smart chain/gm)
let BSC2Text = text.match(/Bsc/gm)
let BSC3Text = text.match(/BSC/gm)
let BSC4Text = text.match(/BEP-20/gm)
let BSC5Text = text.match (/BEP20/gm)
let BSC6Text = text.match (/ERC-20/gm)
let BSC7Text = text.match (/ERC20/gm)
let BSC8Text = text.match(/Bep-20/gm)
let BSC9Text = text.match(/BEP/gm)
let MetaMask = text.match (/MetaMask/gm)
let Metamask = text.match (/Metamask/gm)
let metamask = text.match (/metamask/gm)
let MediumText = text.match (/Medium/gm)
let Medium1Text = text.match (/medium/gm)
let Refer1Friends = text.match(/Refer friends to this Airdrop to increase your chance of winning/gm)
let Entry = text.match (/Entry Confirmed/gm)
let Skip = text.match(/Join HIMO World on Facebook/gm)

if((TwitterDone == null)&&(CustomDone == null)){
     if (TwitterFollowText !== null) {
         let url = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("xl twitter-button")[0].href;
         GM.openInTab(url);
         await sleep(10000)
         document.querySelectorAll("div.entry-method > a")[i].click();
         await Captcha(i);
         count = 1;
     }
     if (TwitterRetweetText !== null) {
         let url = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("xl twitter-button")[0].href;
         GM.openInTab(url);
         await sleep(10000)
         document.querySelectorAll("div.entry-method > a")[i].click()
         await Captcha(i);
         count = 1;
     }
     if ((TelegramText !== null)||(telegramText !== null)||(Telegram1Text !== null)) {
         document.querySelectorAll("div.entry-method > a")[i].click()
         try{
         let element = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-info btn-large btn-embossed")[0];
         dispatchMouseEvent(element, 'mouseover', true, true);
         dispatchMouseEvent(element, 'mousedown', true, true);
         dispatchMouseEvent(element, 'mouseup', true, true);
         dispatchMouseEvent(element, 'input', true, true);
         } catch{}

         try{
         let element = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-large visit-bg ng-binding")[0];
         dispatchMouseEvent(element, 'mouseover', true, true);
         dispatchMouseEvent(element, 'mousedown', true, true);
         dispatchMouseEvent(element, 'mouseup', true, true);
         dispatchMouseEvent(element, 'input', true, true);
         } catch{}

         await sleep(1000);

         try{
          let reg = document.querySelectorAll("div.entry-method ")[i].innerHTML
          let top = reg.match(/em+\d+/gm);
          let code = "#" + top[0] +"Details"
          let input = document.querySelector(code);
          input.value = Telegram;
          input.dispatchEvent(new Event('input', { bubbles: true }));
         } catch{}
         await sleep(1000);

         let value = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].innerText;
         let Button = value.match(/Continue/gm)
         while(Button == null){
             await sleep(1000);
             console.log(value);
             value = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].innerText;
             Button = value.match(/Continue/gm)
         }
         await sleep(3000)
         document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].click();
         await Captcha(i);
         count = 1;
     }

        if ((PolygonText !== null) ||(BSC1Text !== null)||(BSC2Text !== null)||(BSC3Text !== null)||(BSC4Text !== null)||(BSC5Text !== null)||(BSC6Text !== null)||(BSC7Text !== null)||(MetaMask !== null)||(Metamask!== null)||(metamask !== null)||(TRC1Text !== null)||(Binance !== null)||(Celo !== null)||(BSC8Text !== null)||(BSC9Text !== null)){
          document.querySelectorAll("div.entry-method > a")[i].click()
          await sleep(1000);
         try{
          let reg = document.querySelectorAll("div.entry-method ")[i].innerHTML;
          let top = reg.match(/em+\d+/gm);
          let code = "#" + top[0] +"Details";
          let input = document.querySelector(code);
          input.value = BSC;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          }catch{};
          await Captcha(i);
          await sleep(2500);
          document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].click();
          await Captcha(i);
          count = 1;
    }

         if ((ReferFriends !== null)||(Refer1Friends!==null)) {
             count=1;
    }

          if (DiscordText !== null) {
              document.querySelectorAll("div.entry-method > a")[i].click()
              let url = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-info btn-large btn-embossed ng-binding")[0].href;
              GM.openInTab(url);
              await sleep(15000)
              document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].click();
              await Captcha(i);
              count=1;
    }
         if (Entry !== null) {
              document.querySelectorAll("div.entry-method > a")[i].click()
              await Captcha(i);
              count=1;
    }
         if (Skip !== null) {
              count=1;
    }
         if (count==0){
         console.log("Eto drugoe!")
             document.querySelectorAll("div.entry-method > a")[i].click()
             try{
         let element = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-info btn-large btn-embossed")[0];
         dispatchMouseEvent(element, 'mouseover', true, true);
         dispatchMouseEvent(element, 'mousedown', true, true);
         dispatchMouseEvent(element, 'mouseup', true, true);
         dispatchMouseEvent(element, 'input', true, true);
         } catch{}

         try{
         let element = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-info btn-large btn-embossed")[0];
         element.dispatchEvent(machineEvent)
         } catch{}

         await sleep(1000);
         try{
         let value = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].innerText;
         let Button = value.match(/Continue/gm)
         while(Button == null){
             await sleep(1000);
             console.log(value);
             value = document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].innerText;
             Button = value.match(/Continue/gm)
         }
         }catch{}

         await sleep(1000);
             try{
         document.querySelectorAll("div.entry-method")[i].getElementsByClassName("btn btn-primary")[0].click();
             } catch{}
         await Captcha(i);

        }





}
}
}

var zNode = document.createElement ('div');
zNode.innerHTML = '<span id="Main" type="button">Main</span>';
document.body.appendChild (zNode);

document.getElementById ("Main").addEventListener (
    "click", ClickAction, false
);

function ClickAction (zEvent) {
let BSC = document.querySelector("#BSC").innerText;
let Telegram = document.querySelector("#Telegram").innerText;
let Twitter = document.querySelector("#Twitter").innerText;
    console.log(BSC);
    console.log(Telegram);
    console.log(Twitter);
let elements = document.querySelectorAll("div.entry-method");
Main();
}








let machineEvent = new Event('click', {bubbles:true})



async function Captcha(i){
    if (i==0){
  console.log("Pausa...")
await sleep(7000);
let element = document.getElementsByClassName("challenge ng-scope")[0]
 console.log("waiting...")
while(element!=null){
    await sleep(1000)
    element = document.getElementsByClassName("challenge ng-scope")[0]
    console.log("waiting...")
    }
    }

}

  var dispatchMouseEvent = function(target, var_args) {
  var e = document.createEvent("MouseEvents");
  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
  target.dispatchEvent(e);
};


function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


GM_addStyle ( `
    #Main {
        color: white;
        position:               absolute;
        top:                    50px;
        left:                   20px;
        font-size:              10px;
        background:             #457298;
        border:                 3px outset black;
        margin:                 5px;
        padding:                5px 20px;
    }
        #Main {
        cursor:                 pointer;

` );

// document.querySelectorAll("div.entry-method")[11].getElementsByClassName("btn btn-primary")[0].click()