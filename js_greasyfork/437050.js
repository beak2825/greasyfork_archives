// ==UserScript==
// @name          EldoradoDarkMode
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  Dark mode for eldorado.gg!
// @author       Daemonheim
// @include       *https://www.eldorado.gg*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437050/EldoradoDarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/437050/EldoradoDarkMode.meta.js
// ==/UserScript==
var $ = window.jQuery;
var jQuery = window.jQuery;
// Select the node that will be observed for mutations
var itemsProcessed = 0;
// set up the mutation observer
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  var canvas = document.getElementsByClassName("offer-seller-card offer-seller-card-mobile ng-star-inserted");
  var canvas1 = document.getElementsByClassName("other-sellers-section ng-tns-c127-14 ng-trigger ng-trigger-fadeIn ng-star-inserted")[0];
  var canvas2 =document.getElementsByClassName("container ng-star-inserted")[0];
  var canvas3 = document.getElementsByClassName("order-item-details ng-star-inserted")[0]
  var wallet = document.querySelectorAll('[aria-label="IBAN"]')[0];
  var quickchatpresent = document.getElementById("quickchat")
if(canvas3)
{
if(!quickchatpresent)
{
QuickChatLoad()
}
}


 if (canvas) {
    DarkMode(canvas);
  //  me.disconnect();
    return;
  }
    else if (canvas1)
  {
    DarkMode(canvas);
  //  me.disconnect();
    return;
  }
    else if(canvas2)
    {
      DarkMode(canvas);
//   me.disconnect();
    return;
    }


});


observer.observe(document, {
  childList: true,
  subtree: true
});




function DarkMode(canvas)
{


    var sellercards=document.querySelectorAll("div")

sellercards.forEach(element =>
{
  element.style.background="#090c17";
});
 //change all fonts
 try
 {
 var all = document.getElementsByTagName("*");
for (var i=0, max=all.length; i < max; i++)
{
 all[i].style.color = "#737015";
//change body color
var bodyclass=document.getElementsByClassName("ng-tns-c157-10");
bodyclass.forEach(element =>
{
  element.style.background="#14192b";
});

document.getElementsByTagName('footer')[0].style.background="#090c17";

var buttontext=document.getElementsByClassName("button-text");

buttontext.forEach(element =>
{
  element.style.color="#282828";
});
}

    var allborders=document.querySelectorAll("div")

allborders.forEach(element =>
{
  element.style.borderColor ="#14192b";
});

    var allbuttons=document.getElementsByTagName('button');
allbuttons.forEach(element =>
{
  element.style.background="#ffb600";
});

    var allinputs=document.getElementsByClassName("input");
allinputs.forEach(element =>
{
  element.style.background="#14192b";
});

document.getElementsByClassName("light-theme loaded")[0].style="--emerald:#00E4C9;--yellow-1:#FFB600;--yellow-2:#FEA900;--yellow-3:#FF8D00;--white:#FFFFFF;--cherry:#E81B16;--marine:#1E69FF;--pink-gradient:linear-gradient(180deg, #EB568C 0%, #ED5E76 100%);--background-body:#FAFAFA;--background-base:#FFFFFF;--background-base1:#DEDEDF;--color-background-alt1:#EFEFF1;--color-background-alt2:#DEDEDF;--color-text1: #ffb600;--color-text2:#ffb600;--color-text3:#5A5A66;--color-text4:#898A93;--color-text5:#18171D;--color-text6:#18171D;--color-border:#EFEFF1;--shadow-alt-1:0px 2px 4px rgba(9, 9, 11, 0.05), 0px 12px 8px rgba(9, 9, 11, 0.02);--shadow-alt-2:0px 2px 4px rgba(9, 9, 11, 0.1), 0px 12px 32px rgba(9, 9, 11, 0.05);--shadow-alt-3:0px 2px 4px rgba(47, 47, 55, 0.15), 0px 24px 60px rgba(47, 47, 55, 0.1), 0px 12px 24px rgba(47, 47, 55, 0.05);--color-homepage-titles:#09090B;--color-homepage-card-text:#18171D;--color-homepage-info-details-background:#0D0D0D;--shadow-menu-left:-2px 0px 4px rgba(9, 9, 11, 0.12), -24px 0px 24px rgba(9, 9, 11, 0.07), -12px 0px 24px rgba(9, 9, 11, 0.07);--shadow-menu-right:2px 0px 4px rgba(9, 9, 11, 0.12), 24px 0px 24px rgba(9, 9, 11, 0.07), 12px 0px 24px rgba(9, 9, 11, 0.07);--legacy-blue-gradient:linear-gradient(88.09deg, #2B8CED 0%, #58A6F4 100%);color: rgb(115, 112, 21);"
 }catch{}

console.log("DarkMode loaded");
}


function QuickChatLoad()
{

var QuickChat=document.createElement("custom");
QuickChat.id="quickchat";
document.getElementsByClassName("second-column")[0].appendChild(QuickChat);
QuickChat.style.cssText="text-align: center;font-weight: 900;font-size: 17px;white-space: pre-wrap;font-family: Georgia, serif;color: rgb(115, 112, 21);position: fixed;top: 309px;left: 12px;border-radius: 1px;background: rgb(9, 12, 23);height: 559px;width: 304px;border-color: rgb(20, 25, 43);border-width: 1px;border-style: solid;"

var textArea = document.createElement("TEXTAREA");
QuickChat.appendChild(textArea);
textArea.setAttribute("type", "textarea");
textArea.id="chk"
textArea.style.cssText="color: rgb(115, 112, 21);background-color: rgb(20, 25, 43);white-space: pre-wrap;position: relative;top: 300px;left: -1px;width: 285px;height: 251px;border-style: none;resize: none;min-height: 5px;overflow: hidden;"
textArea.value="Skip member check"

var QuickText1 = document.createElement("button");
QuickText1.id="q1";
QuickText1.type="button"
QuickText1.innerText="Hey there!"
QuickChat.appendChild(QuickText1);
QuickText1.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-247px;left:-21px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"
function style1(){QuickText1.style.cssText="box-shadow:inset 0 0 10px #000000;font-family: Georgia, serif;color:#222222;position:relative;top:-247px;left:-21px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:#d9821f;border-width:thick;border-style:none"}
function style2(){QuickText1.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-247px;left:-21px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"}
QuickText1.addEventListener("mousedown", style1);
QuickText1.addEventListener("mouseup", style2);

var QuickText2 = document.createElement("button");
QuickText2.id="q2";
QuickText2.type="button"
QuickText2.innerText="Don't forget"
QuickChat.appendChild(QuickText2);
QuickText2.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-200px;left:-141px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"
function style3(){QuickText2.style.cssText="box-shadow:inset 0 0 10px #000000;font-family: Georgia, serif;color:#222222;position:relative;top:-200px;left:-141px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:#d9821f;border-width:thick;border-style:none"}
function style4(){QuickText2.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-200px;left:-141px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"}
QuickText2.addEventListener("mousedown", style3);
QuickText2.addEventListener("mouseup", style4);

var QuickText3 = document.createElement("button");
QuickText3.id="q3";
QuickText3.type="button"
QuickText3.innerText="Guide"
QuickChat.appendChild(QuickText3);
QuickText3.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-191px;left:-81px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"
function style5(){QuickText3.style.cssText="box-shadow:inset 0 0 10px #000000;font-family: Georgia, serif;color:#222222;position:relative;top:-191px;left:-81px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:#d9821f;border-width:thick;border-style:none"}
function style6(){QuickText3.style.cssText="font-family: Georgia, serif;color:#222222;position:relative;top:-191px;left:-81px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"}
QuickText3.addEventListener("mousedown", style5);
QuickText3.addEventListener("mouseup", style6);


QuickText1.onclick=function()
{
//change text here. \n represents a new line
textArea.value="Hey there! \nW29 Lumbridge lodestone";
textArea.select();
  document.execCommand('copy');
window.getSelection().removeAllRanges();
}

QuickText2.onclick=function()
{
textArea.value="Please don't forget to mark your order as received after the trade, thanks.\nIf you're not sure how to do that, let me know and I'll guide you through.";
textArea.select();
  document.execCommand('copy');
window.getSelection().removeAllRanges();
}

QuickText3.onclick=function()
{
textArea.value="To complete the order just follow this link to your order page if you're not already there:\n"+window.location.href+"\nAnd click the Order Received button. All done!";
textArea.select();
  document.execCommand('copy');
window.getSelection().removeAllRanges();
}
}