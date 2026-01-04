// ==UserScript==
// @name         Name Scraper Demo
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Runescape name scraper
// @author       Daemonheim
// @include       *https://apps.runescape.com/runemetrics/app/search*
// @update       https://greasyfork.org/scripts/411767-name-scraper-demo/code/Name%20Scraper%20Demo.user.js
// @download     https://greasyfork.org/scripts/411767-name-scraper-demo/code/Name%20Scraper%20Demo.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411767/Name%20Scraper%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/411767/Name%20Scraper%20Demo.meta.js
// ==/UserScript==


var itemsProcessed = 0;
// set up the mutation observer
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  var canvas = document.querySelector("body > div.content.medium-12 > ui-view > div");
  if (canvas) {
    handleCanvas(canvas);
    me.disconnect(); // stop observing
    return;
  }
});

// start observing
observer.observe(document, {
  childList: true,
  subtree: true
});




// callback executed when canvas was found
function handleCanvas(canvas) {


 var frame=document.createElement("iframe");
frame.id="frame1";
frame.style.cssText="position: relative;left:260px;top: -338px;height: 1000px;width: 1100px;;frameborder:0;overflow:hidden;-webkit-transform:scale(0.5);-moz-transform-scale(0.5);"
frame.src="https://secure.runescape.com/m=weblogin/loginform.ws?mod=www&ssl=1&reauth=1&dest=account_settings"
document.querySelector("body > div.content.medium-12 > ui-view > div").appendChild(frame)

setTimeout(function(){
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > label").innerText="Debug status";
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").placeholder="Progress and errors will be displayed here"
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").style.cssText="max-width:1000px;width:514px"
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").readOnly = true;
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > button").style.display="none";
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > div").parentNode.removeChild(document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > div"));
document.querySelector("body > div > ui-view > div > div.row.title > div > h2").innerText="DAEMONHEIM's NAME SCRAPER"
document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input").style.visibility="hidden"
document.querySelector("body > header > div.app-header > main-menu").style.display="none"
var arraygenerator = document.createElement('iframe');
document.body.appendChild(arraygenerator);
arraygenerator.style.cssText="overflow:hidden;position:relative;top: -1222px;left:0px;width:259px;height:556px"
arraygenerator.src="https://commentpicker.com/random-name-generator.php"
arraygenerator.id="argen"
arraygenerator.sandbox = 'allow-scripts';








},2000);






































async function fetchText(y,z,x) {

let response = await fetch("https://apps.runescape.com/runemetrics/profile/profile?user="+y+"&activities=20", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://apps.runescape.com/runemetrics/app/search",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
if (response.status === 200) {
//var src=document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input")
var src=document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input")
src.value++
    console.log(response.status); // 200
        let data = await response.text();
if(data.includes("NO_PROFILE")){
var source=document.querySelector("#resbox");
source.value=source.value+","+y
 var newVal1 = source.value.replace(/^\s*[\r\n]/gm, '')
source.value=newVal1
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Searching Runemetrics database..."+" "+src.value
//var array2=[];
//array2.push(source.value);
//array2.push(y+" - "+data);
//document.getElementById("resbox").value= array2.join("\n");
}
console.log(y)
if(Number(src.value)===Number(x)){setTimeout(function(){console.log("All Done");


//Runemetrics done
resultbox.value=resultbox.value.substring(1);
arraybox.value=resultbox.value
resultbox.value=""
community()



},700)}} else{fetchText(y)}};
var divbody=document.getElementsByClassName("small-12 columns")[0]
var scrhead=document.createElement("div");
document.querySelector("body > div.content.medium-12 > ui-view > div").appendChild(scrhead);
scrhead.style.cssText="text-align: center;font-weight: 900;font-size: 17px;;white-space:pre-wrap;font-family: Georgia, serif;color:rgb(225 187 52);position:absolute;top:132px;left:15px;border-radius:1px;background:rgb(0 0 1);height:55px;width:528px;border-color:rgb(16 29 35);border-width:thick;border-style:solid"

var skipmem = document.createElement("INPUT");
skipmem.setAttribute("type", "checkbox");
skipmem.style.cssText="left:502px;top:10px"
scrhead.appendChild(skipmem);
var tmp=new Date('2020-12-25');
var checktext = document.createElement("textarea");
document.querySelector("body > div > ui-view > div > div:nth-child(4)").appendChild(checktext);
checktext.setAttribute("type", "text");
checktext.id="chk"
checktext.style.cssText="color: rgb(225 187 52); background-color: #000001;white-space:pre-wrap;position:relative;top: 0px;left:340px;width:160px;height:25px;border-style:none;resize: none;min-height: 5px;overflow:hidden"
checktext.value="Skip member check"







var scrbody=document.createElement("div");
scrhead.appendChild(scrbody);
scrbody.style.cssText="text-align: center;font-weight: 900;font-size: 17px;;white-space:pre-wrap;font-family: Georgia, serif;color:rgb(225 187 52);position:absolute;top:44px;left:-5px;border-radius:1px;background:rgb(0 0 1);height:381px;width:528px;border-color:rgb(16 29 35);border-width:thick;border-style:solid"


var arraybox = document.createElement("textarea");
scrbody.appendChild(arraybox);
arraybox.setAttribute("type", "text");
arraybox.id="arbox"
arraybox.style.cssText="white-space:pre-wrap;position:relative;top: 0px;left:1px;width:150px;height:370px"

var resultbox = document.createElement("textarea");
scrbody.appendChild(resultbox);
resultbox.setAttribute("type", "text");
resultbox.id="resbox"
resultbox.style.cssText="color: green; background-color: white;white-space:pre-wrap;position:relative;top: -386px;left:159px;width:110px;height:370px"



var line = document.createElement("div");
scrbody.appendChild(line);
line.style.cssText="background-color:rgb(16 29 35);position:relative;top: -772px;left:150px;width:11px;height:373px"

var instructions = document.createElement("textarea");
instructions.setAttribute("type", "text");
instructions.id="ins"
instructions.style.cssText="font-weight: normal;color:rgb(225 187 52); background-color:#101d23;white-space:pre-wrap;position:relative;top: -1143px;left:270px;width:246px;height:366px;border-style:none;resize: none;min-height: 5px;overflow:hidden;font-size: 11px"
instructions.value="1.Log into any account(on the right)\n2.Generate names list.\n-if using another list names must be comma separated \",\"\n3. Paste in first text area and Start\n-first check : Runemetrics database\n-second check : removes the names that have an active membership but no runemetrics profile\n-third check is Runescape database\nFinal results are displayed in the white text area(name +server response)\nNOK - name not available\nOK - name available\nName and membership status checking requests both have a cooldown period.\nOnly a fixed number of requests can be made within a certain time period so the first 15-20 responses will be fast, then it slows down(1 name every 30sec-1min)\nIf membership checking is slow, skip this step using the check box "
scrbody.appendChild(instructions);
instructions.readOnly = true






var openbutton = document.createElement("button");
openbutton.id="openi";
openbutton.type="button"
openbutton.innerText="START"
scrhead.appendChild(openbutton);
openbutton.style.cssText="font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:3px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"
function style1(){openbutton.style.cssText="box-shadow:inset 0 0 10px #000000;font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:3px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:#d9821f;border-width:thick;border-style:none"}
function style2(){openbutton.style.cssText="font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:3px;border-radius:3px;background:rgb(225 187 52);height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"}
openbutton.addEventListener("mouseover", style1);
openbutton.addEventListener("mouseout", style2);


openbutton.onclick=function(){

var splitbox=document.getElementById("arbox").value
var array=splitbox.split(','); // split string on comma space
var length=array.length
var date = new Date();
var expd=new Date('2020-12-25');
if(date > expd && expd == tmp)
{

document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Demo version expired";}else{

array.forEach(function (item) {

//var str = document.URL;
//var str1 = str.substring(str.indexOf("c=") + 1);
//var str2 = str1.split('/')[0]
document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input").value=0;
fetchText(item,itemsProcessed,length)
})

}

};

var openbutton2 = document.createElement("button");
openbutton2.id="openi2";
openbutton2.type="button"
openbutton2.innerText="COPY"
//scrhead.appendChild(openbutton2);
openbutton2.style.cssText="font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:147px;border-radius:3px;background:#d9821f;height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"
function style3(){openbutton2.style.cssText="box-shadow:inset 0 0 10px #000000;font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:147px;border-radius:3px;background:#d9821f;height:38px;width:120px;border-color:#d9821f;border-width:thick;border-style:none"}
function style4(){openbutton2.style.cssText="font-family: Georgia, serif;color:#222222;position:absolute;top:3px;left:147px;border-radius:3px;background:#d9821f;height:38px;width:120px;border-color:rgb#d9821f;border-width:thick;border-style:none"}
openbutton2.addEventListener("mouseover", style3);
openbutton2.addEventListener("mouseout", style4);

openbutton2.onclick=function(){
var fruits = document.getElementById("resbox").value.replace(/(\r\n|\n|\r)/gm, ", ");
var an=fruits.replace(/['"]+/g, '')
var ar = an.split(', '); // split string on comma space
console.log( ar )

 function copy(txt){
var acb = document.createElement("input");
document.body.appendChild(acb);
acb.id="cb"
acb.setAttribute("type", "text");
  acb.value = txt;
  acb.style.display='block';
  acb.select();
  document.execCommand('copy');
 }
copy(ar)
}



//***********************Check Membership Status
async function fetchMember(n,p,q) {

let response = await fetch("https://secure.runescape.com/m=website-data/playerDetails.ws?membership=true&names=[%22"+n+"%22]&callback=angular.callbacks._0&_=1448901242774", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://apps.runescape.com/runemetrics/app/search",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
if (response.status === 200) {
var src=document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input")
src.value++
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Excluding names with active membership..."+" "+src.value
    console.log(response.status); // 200
        let data = await response.text();
if(data.includes("\"member\":false")){
var source2=document.querySelector("#resbox");
source2.value=source2.value+","+n
 var newVal = source2.value.replace(/^\s*[\r\n]/gm, '')
source2.value=newVal;
//var array2=[];
//array2.push(source.value);
//array2.push(n);
//document.getElementById("resbox").value= array2.join("\n");
console.log(n)}

if(Number(src.value)===Number(q)){setTimeout(function(){console.log("All Done");
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Sending to secure server..."
resultbox.value=resultbox.value.substring(1);
arraybox.value=resultbox.value
resultbox.value="";
secure();

},700)}} else{fetchMember(n)}};

function checkmem(){

var splitbox2=document.getElementById("arbox").value
var array2=splitbox2.split(','); // split string on comma space
var length2=array2.length
array2.forEach(function (item) {


document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input").value=0;
fetchMember(item,itemsProcessed,length2)
})
};


//*******************Secure Server


async function fetchSecure(a,b) {

let response = await fetch("https://secure.runescape.com/m=displaynames/c"+b+"/check_name?displayname="+a, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://secure.runescape.com/m=displaynames/c"+b+"/name",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})



   if (response.status === 200) {
    console.log(response.status); // 200
        let data = await response.text();
console.log(data);
if(data.includes("OK")){
//console.log(data+"-"+a)

var source3=document.querySelector("#resbox");
source3.value=source3.value+"\n"+a+" - "+data
 var newVal3 = source3.value.replace(/^\s*[\r\n]/gm, '')
source3.value=newVal3;

var snd = new Audio("https://www.myinstants.com/media/sounds/mario-coin-sound.mp3"); // buffers automatically when created
snd.play()}


else{document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Error - Token expired. Refresh and log in"}





} else{fetchSecure(a,b)}

};


function secure(){
if(window.parent.document.getElementById("frame1").contentWindow.document.getElementById("MyName")==null){
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Error - Not logged in"}else{
var splitbox3=document.getElementById("arbox").value
var array3=splitbox3.split(','); // split string on comma space
array3.forEach(function (item) {
var str = document.getElementById("frame1").contentWindow.location.href;
var str1 = str.substring(str.indexOf("c=") + 1);
var str2 = str1.split('/')[0]
fetchSecure(item,str2);

})}
};


//************Community Forums search*************
function comFor(g,h){
fetch("https://secure.runescape.com/m=forum/users.ws", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://secure.runescape.com/m=forum/users.ws",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "searchname="+g+"&jump=Go&lookup=find",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
}).then(response => response.text())
  .then(
function(data){
var src3=document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input")
src3.value++

if(data.includes(g+" is an invalid username")){
var source8=document.querySelector("#resbox");
source8.value=source8.value+","+g
 var newVal0 = source8.value.replace(/^\s*[\r\n]/gm, '')
source8.value=newVal0
document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Searching Community Forum..."+" "+src3.value
console.log(g+" OK")};
if(Number(src3.value)===Number(h)){setTimeout(function(){console.log("All Done");
resultbox.value=resultbox.value.substring(1);
arraybox.value=resultbox.value
resultbox.value=""
if(skipmem.checked == false){
checkmem()}else{document.querySelector("body > div > ui-view > div > div:nth-child(2) > div > search-form > div > form > input").value="Sending to secure server...";
secure()

}


},700)}

}

)














};

function community(){
var splitbox3=document.getElementById("arbox").value
var array3=splitbox3.split(','); // split string on comma space
var length2=array3.length;
array3.forEach(function (item) {
document.querySelector("body > header > div.row > div > ul.text-center.flexi-header__list.flexi-header__list--right > li.flexi-header__item.show-for-medium-up > search-form-small > div > form > input").value=0;
comFor(item,length2);

})

};





}//Canvas end**********************************





