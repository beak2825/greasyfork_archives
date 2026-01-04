// ==UserScript==
// @name        Fast Bonus (in Wikihousehold)
// @namespace   The Household Love
// @description to register , to fix it or to access
// @include     https://*.facebook.com/*
// @include     https://village-facebook.crazypanda.ru/*
// @match       *://www.facebook.com/dialog/*
// @match       *://apps.facebook.com/*
// @match       *://playhousehold.com/*
// @grant       GM_addStyle
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380865/Fast%20Bonus%20%28in%20Wikihousehold%29.user.js
// @updateURL https://update.greasyfork.org/scripts/380865/Fast%20Bonus%20%28in%20Wikihousehold%29.meta.js
// ==/UserScript==


var head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.innerHTML = '#tabMenu li{padding: 3px 3px;}._3n1j ._3n1k {max-height: 100px;overflow: hidden;}._3eqz ._44af{align-self: center;padding-left: 18px;display: none;}._3eqz ._44ae{display:list-item;flex-direction:row;}.unclickableMask{height: 73% !important;background: url(https://app.fastbonus.net/bower_components/images/output1.png) !important;} .generic_dialog_modal,.generic_dialog_fixed_overflow{background-color:transparent !important;},._6m3{background-color:#5ffb0cc7;}.fsSubmitButton{padding: 0px 20px 0px !important;font-size: 18px !important;background-color: #4CAF50;text-shadow: 1px 1px #000;color: #ffffff;border-radius: 100px;-moz-border-radius: 100px;-webkit-border-radius: 100px;border: 1px solid #4CAF50;cursor: pointer;box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;}.fsSubmitButton_2{padding:5px 5px 5px !important;margin: 30px 0px 0px 10px;font-size: 25px !important;background-color: #4267b2;text-shadow: 1px 1px #041a46;color: #ffffff;border-radius: 100px;-moz-border-radius: 100px;-webkit-border-radius: 100px;border: 1px solid #04308a;cursor: pointer;box-shadow: 0px 6px 20px 5.5px rgba(0, 0, 0, 0.48) inset, 0 1px 1px rgba(0, 0, 0, .05);-moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-webkit-box-shadow: 0px 6px 20px 5.5px rgba(0, 0, 0, 0.48) inset;}.a{color: #E7484F}.b{color: #F68B1D}.c{color: #FCED00}.d{color: #009E4F}.e{color: #00AAC3}.f{color:  #732982}.container{margin-top: 150px;}.text-center{text-align: center;}.rainbow{background-color: #4caf50;border-radius: 4px;  color: #fff;cursor: pointer;padding: 3px 16px;}.rainbow-1:hover{background-image:linear-gradient(90deg, #00C0FF 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);animation:slidebg 2s linear infinite;}.rainbow-2:hover{background-image:linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, red);animation:slidebg 2s linear infinite;}.rainbow-3:hover{background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, red);animation:slidebg 2s linear infinite;}.rainbow-4:hover{background-image:linear-gradient(to right,#E7484F,#F68B1D, #FCED00,#009E4F,#00AAC3,#732982);animation:slidebg 2s linear infinite;}.rainbow-5:hover{background-image:linear-gradient(to right, #E7484F,#E7484F 16.65%,#F68B1D 16.65%,#F68B1D 33.3%,#FCED00 33.3%,#FCED00 49.95%,#009E4F 49.95%,#009E4F 66.6%,#00AAC3 66.6%,#00AAC3 83.25%,#732982 83.25%,#732982 100%,#E7484F 100%);animation:slidebg 2s linear infinite;}@keyframes slidebg {to {background-position:20vw;}}.follow{margin-top: 40px;}.follow a{color: black;padding: 8px 16px;text-decoration: none;}}';
head.appendChild(style);

window.setInterval(clearanchors, 200);
var host2 = window.location.href;

function clearanchors(){
var anchors = document.getElementsByTagName('a');
var foto = document.getElementsByClassName('_52c6');
var logo_village = document.getElementsByClassName('_59tj _2iau');



for (var ifoto = 0; ifoto < foto.length; ifoto++) {
for (var ilogo_village = 0; ilogo_village < logo_village.length; ilogo_village++) {

foto[ifoto].style = 'display: none';


var acchiappafoto = foto[ifoto].getAttribute('class');
var acchiappalogo_village = logo_village[ilogo_village].getAttribute('class');

for(var i=0;i<anchors.length;i++){
var poisoned_url = anchors[i].getAttribute('href');
if(acchiappalogo_village == "_59tj _2iau" && poisoned_url && poisoned_url.match(/(http|https):\/\/(l|www).facebook.com\/l\.php\?u\=https%3A%2F%2Fvillage-facebook.crazypanda.ru\%2Fsocial\%2Fopengraph\%2Fobject(.*)/g)){
poisoned_url = poisoned_url.replace(/(http|https):\/\/(l|www).facebook.com\/l\.php\?u\=/g, '');
anchors[i].setAttribute('target', '_self');
anchors[i].setAttribute('href', decodeURIComponent(poisoned_url));

// anchors[i].setAttribute('style', 'pointer-events: none');
foto[ifoto].setAttribute('id', 'foto');


var f_vip = document.createElement("form");
f_vip.setAttribute('class',"mbs _6m6 _2cnj _5s6c");
f_vip.setAttribute('method',"post");
f_vip.setAttribute('action',"https://wikihousehold.fastbonus.net/bonus.php");
f_vip.setAttribute('target',"_blank");

var i_vip = document.createElement("input"); //input element, text
i_vip.setAttribute('type',"hidden");
i_vip.setAttribute('name',"bonus");
i_vip.setAttribute('value',decodeURIComponent(poisoned_url));

var s_vip = document.createElement("input"); //input element, Submit button
s_vip.setAttribute('class',"rainbow rainbow-1");
s_vip.setAttribute('type',"submit");
s_vip.setAttribute('value',"Click here to use Fast Bonus");

f_vip.appendChild(i_vip);
f_vip.appendChild(s_vip);

anchors[i].appendChild(f_vip);

var toglierefoto = function toglierefoto() {
var foto = document.getElementsByClassName('_6ks');
for (var i = 0; i < foto.length; i++) {
    foto[i].style = 'display: none';

    }
  };

var togliere_open = function togliere_open() {
 var open = document.getElementsByClassName('_6m7 _3bt9');
 for (var i = 0; i < open.length; i++) {
open[i].style = 'display: none';
     }
  };

var togliere_logo = function togliere_logo() {
var logo = document.getElementsByClassName('_59tj _2iau');
  //   var logo = document.getElementsByClassName('_26f8');

for (var i = 0; i < logo.length; i++) {
logo[i].style = 'display: none';
      }
   };

// toglierefoto();
togliere_open();
togliere_logo();

setInterval(togliere_logo, 1000);
break;

        }
}
}

     }
}

var head2 = document.getElementsByTagName('head')[0];
var style2 = document.createElement('style');
style2.innerHTML = '#tabMenu li{padding: 3px 3px;}.fsSubmitButton{padding: 0px 20px 0px !important;font-size: 18px !important;background-color: #4CAF50;text-shadow: 1px 1px #000;color: #ffffff;border-radius: 100px;-moz-border-radius: 100px;-webkit-border-radius: 100px;border: 1px solid #4CAF50;cursor: pointer;box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;}.fsSubmitButton_2{padding:5px 5px 5px !important;margin: 30px 0px 0px 10px;font-size: 25px !important;background-color: #4267b2;text-shadow: 1px 1px #041a46;color: #ffffff;border-radius: 100px;-moz-border-radius: 100px;-webkit-border-radius: 100px;border: 1px solid #04308a;cursor: pointer;box-shadow: 0px 6px 20px 5.5px rgba(0, 0, 0, 0.48) inset, 0 1px 1px rgba(0, 0, 0, .05);-moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;-webkit-box-shadow: 0px 6px 20px 5.5px rgba(0, 0, 0, 0.48) inset;}.a{color: #E7484F}.b{color: #F68B1D}.c{color: #FCED00}.d{color: #009E4F}.e{color: #00AAC3}.f{color:  #732982}.container{margin-top: 150px;}.text-center{text-align: center;}.rainbow{background-color: #4caf50;border-radius: 4px;  color: #fff;cursor: pointer;padding: 3px 16px;}.rainbow-1:hover{background-image:linear-gradient(90deg, #00C0FF 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);animation:slidebg 2s linear infinite;}.rainbow-2:hover{background-image:linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, red);animation:slidebg 2s linear infinite;}.rainbow-3:hover{background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, red);animation:slidebg 2s linear infinite;}.rainbow-4:hover{background-image:linear-gradient(to right,#E7484F,#F68B1D, #FCED00,#009E4F,#00AAC3,#732982);animation:slidebg 2s linear infinite;}.rainbow-5:hover{background-image:linear-gradient(to right, #E7484F,#E7484F 16.65%,#F68B1D 16.65%,#F68B1D 33.3%,#FCED00 33.3%,#FCED00 49.95%,#009E4F 49.95%,#009E4F 66.6%,#00AAC3 66.6%,#00AAC3 83.25%,#732982 83.25%,#732982 100%,#E7484F 100%);animation:slidebg 2s linear infinite;}@keyframes slidebg {to {background-position:20vw;}}.follow{margin-top: 40px;}.follow a{color: black;padding: 8px 16px;text-decoration: none;}}';
head.appendChild(style2);


var host = window.location.href;
if(host === "https://village-facebook.crazypanda.ru/social/canvas/43/"){
document.getElementById('tabMenu').innerHTML = '<div id="tabMenu"><ul class="leftMenu"><li><button class="rainbow rainbow-1" onclick="setSpocklet()">Fast Bonus</button></li><li><button class="rainbow rainbow-5" onclick="opentab()">How does it work</button></li><li class="gameButton button active" name="game" href="#"><a href="#">Game</a></li><li class="externalSupportButton button" name="external_support" href="#"><a href="/social/external_support/">Help</a></li><li class="newsButton button" name="news" href="#"><a href="/social/news/">News</a></li></ul><div class="rightMenu"><ul><li class="gameGroupButton" id="demo"></li></ul></div></div>';
var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = function setSpocklet(){
var container = document.getElementsByName('flashvars');
var html = container.innerHTML;
var obj = document.getElementById('flash-app');
var value = '';
for(var param in obj.childNodes){
if (obj.childNodes[param].getAttribute('name') == 'flashvars'){
value = obj.childNodes[param].getAttribute('value');
document.getElementById("demo").innerHTML = "<li><form method='post' action='https://wikihousehold.fastbonus.net/register.php' target='_blank' class='rightMenu' id='demo'><input type='hidden' name='name' value=" + value + "><input class='rainbow rainbow-1' type='submit' value='Click here to register,to fix it or to access'></form></li><div class='rightMenu'><ul><li class='gameGroupButton'><p id='demo'></p></li></ul>";
}
}};
head.appendChild(script);

    var script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.innerHTML = function opentab(){
var link = document.createElement("a");
link.href = 'https://www.facebook.com/notes/the-household-love/fast-bonus-how-to-install-and-use-it/861652224167801/';
link.style = "visibility:hidden";
link.target = "_blank";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};
head.appendChild(script2);

}
else{
    // another
document.getElementById('tabMenu').innerHTML = '<div id="tabMenu"><ul class="leftMenu"><li><button class="rainbow rainbow-1" onclick="setSpocklet()">Fast Bonus</button></li><li><button class="rainbow rainbow-5" onclick="opentab()">How does it work</button></li><li class="gameButton button active" name="game" href="#"><a href="#">Game</a></li><li class="externalSupportButton button" name="external_support" href="#"><a href="/social/external_support/">Help</a></li><li class="newsButton button" name="news" href="#"><a href="/social/news/">News</a></li></ul><div class="rightMenu"><ul><li class="gameGroupButton" id="demo"></li></ul></div></div>';
var scripto = document.createElement('script');
scripto.type = 'text/javascript';
scripto.innerHTML = function setSpocklet(){
var container = document.getElementsByName('flashvars');
var html = container.innerHTML;
var obj = document.getElementById('flash-app');
var value = '';
for(var param in obj.childNodes){
if (obj.childNodes[param].getAttribute('name') == 'flashvars'){
value = obj.childNodes[param].getAttribute('value');
document.getElementById("demo").innerHTML = "<li><form method='post' action='https://wikihousehold.fastbonus.net/register.php' target='_blank' class='rightMenu' id='demo'><input type='hidden' name='name' value=" + value + "><input class='rainbow rainbow-1' type='submit' value='Click here to register,to fix it or to access'></form></li><div class='rightMenu'><ul><li class='gameGroupButton'><p id='demo'></p></li></ul>";
      break;
   }
}
 };
		head.appendChild(scripto);


 }