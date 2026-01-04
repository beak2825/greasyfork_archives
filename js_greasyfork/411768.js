// ==UserScript==
// @name         Name Generator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @include        *https://commentpicker.com/random-name-generator.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411768/Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/411768/Name%20Generator.meta.js
// ==/UserScript==
document.querySelector("#main > div.page-section__holder > section:nth-child(1)").style.display="none";
document.querySelector("#main > div.page-section__holder").style.display="none";
document.querySelector("body > footer > div.footer-main").style.display="none";
document.querySelector("#main > div.page-section__holder").style.display="none";
document.querySelector("body > footer").style.display="none";
document.querySelector("body > header").style.display="none";
document.querySelector("#main > div.login-wrapper.block-wrapper").style.display="none";
document.querySelector("#main > div.search-wrapper.block-wrapper").style.cssText="background:rgb(10 31 42)";
document.querySelector("#main > div.results-wrapper.block-wrapper").style.cssText="background:rgb(10 31 42)";
document.querySelector("#main > div.info-wrapper.block-wrapper").style.cssText="background:rgb(10 31 42)";
document.querySelector("#main > div.info-wrapper.block-wrapper > div").style.display="none";
document.querySelector("#js-start-button").style.cssText="min-width:5px;width:239px"


setTimeout(function(){

if(document.getElementById("ez-accept-all") !="undefined"){document.getElementById("ez-accept-all").click()};

},300);







//var doubtb=document.createElement("input");
//doubtb.id="submit-doubt";
//doubtb.value="Copy";
//doubtb.type="button";
//doubtb.style.cssText="background:#01768b;border-radius:4px;position:absolute;top:1394px;left:293px;color:white;height:40px";
//document.getElementsByClassName("search-wrapper block-wrapper")[0].appendChild(doubtb);

document.getElementById("js-start-button").onclick=function(){
var fruits = document.getElementById("js-result").innerText.replace(/(\r\n|\n|\r)/gm, ", ");
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
};