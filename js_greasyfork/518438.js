// ==UserScript==
// @name        CubeRealm Copperville Coordinates
// @namespace   Violentmonkey Scripts
// @match       https://cuberealm.io/*
// @grant       none
// @version     1.0
// @license MIT
// @author      DaringRanger258456
// @description 11/20/2024, 4:35:50 PM Tells you your location relative to the town of copperville.
// @downloadURL https://update.greasyfork.org/scripts/518438/CubeRealm%20Copperville%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/518438/CubeRealm%20Copperville%20Coordinates.meta.js
// ==/UserScript==
// -4976.50 7999.50 is the copper block at the center of town

//setInterval(code, delay) miliseconds apparently if i dont use this then my browser will crash from the infinite loop going too fast. set time out does not work for this so ive heard and while true loop also needs to end eventually.
setInterval(() => {
//this single line of code i made while sleep deprived somehow basically does almost everything. It also rounds the values but I do not need to round them.
//document.getElementById('canvas').nextElementSibling.childNodes.item(4).data.replaceAll(' ','').replaceAll('.99','').replaceAll('.98','').replaceAll('.97','').replaceAll('.96','').replaceAll('.95','').replaceAll('.94','').replaceAll('.93','').replaceAll('.92','').replaceAll('.91','').replaceAll('.90','').replaceAll('.89','').replaceAll('.88','').replaceAll('.87','').replaceAll('.86','').replaceAll('.85','').replaceAll('.84','').replaceAll('.83','').replaceAll('.82','').replaceAll('.81','').replaceAll('.80','').replaceAll('.79','').replaceAll('.78','').replaceAll('.77','').replaceAll('.76','').replaceAll('.75','').replaceAll('.74','').replaceAll('.73','').replaceAll('.72','').replaceAll('.71','').replaceAll('.70','').replaceAll('.69','').replaceAll('.68','').replaceAll('.67','').replaceAll('.66','').replaceAll('.65','').replaceAll('.64','').replaceAll('.63','').replaceAll('.62','').replaceAll('.61','').replaceAll('.60','').replaceAll('.59','').replaceAll('.58','').replaceAll('.57','').replaceAll('.56','').replaceAll('.55','').replaceAll('.54','').replaceAll('.53','').replaceAll('.52','').replaceAll('.51','').replaceAll('.50','').replaceAll('.49','').replaceAll('.48','').replaceAll('.47','').replaceAll('.46','').replaceAll('.45','').replaceAll('.44','').replaceAll('.43','').replaceAll('.42','').replaceAll('.41','').replaceAll('.40','').replaceAll('.39','').replaceAll('.38','').replaceAll('.37','').replaceAll('.36','').replaceAll('.35','').replaceAll('.34','').replaceAll('.33','').replaceAll('.32','').replaceAll('.31','').replaceAll('.30','').replaceAll('.29','').replaceAll('.28','').replaceAll('.27','').replaceAll('.26','').replaceAll('.25','').replaceAll('.24','').replaceAll('.23','').replaceAll('.22','').replaceAll('.21','').replaceAll('.20','').replaceAll('.19','').replaceAll('.18','').replaceAll('.17','').replaceAll('.16','').replaceAll('.15','').replaceAll('.14','').replaceAll('.13','').replaceAll('.12','').replaceAll('.11','').replaceAll('.10','').replaceAll('.09','').replaceAll('.08','').replaceAll('.07','').replaceAll('.06','').replaceAll('.05','').replaceAll('.04','').replaceAll('.03','').replaceAll('.02','').replaceAll('.01','').replaceAll('.00','')
//piece of code i made to remove everything but the z coordinate and the next loop takes the length so the y and z can be trimmed until y is reached. ok it works a little differently now but it does the trick
var zrd = document.getElementById('canvas').nextElementSibling.childNodes.item(4).data.replaceAll(' ','')
while (zrd[0]!='z') {
    zrd=zrd.replace(zrd[0],'')
}
zrd=zrd.replace('z:','')
zrd // '-4729.89'
zrd=Number(zrd)-7999.50
var xrd = document.getElementById('canvas').nextElementSibling.childNodes.item(4).data.replaceAll(' ','')
while (xrd[xrd.length-1]!='y') {
    xrd=xrd.replace('y:','y').replace('y-','y').replace('y1','y').replace('y2','y').replace('y3','y').replace('y4','y').replace('y5','y').replace('y6','y').replace('y7','y').replace('y8','y').replace('y9','y').replace('y0','y').replace('y.','y').replace('yz','y')
}
xrd=xrd.replace('y','').replace('x:','')
xrd=Number(xrd)+4976.50
xrd // '-3895.30'

  // create a new element that will hold the text it will have the tag small
  var cvcordelm = document.createElement("small");

  // I need to take the info i got and take it and put into the text node

  var cvcoords = document.createTextNode("Copperville Position: x: "+xrd+" z: "+zrd); // place holders

  // add the text node to the newly created small
  cvcordelm.appendChild(cvcoords);

  // add the coordinate system to the DOM (document object model) I might not need this and will replace it in the code part with the insertbefore with document.getElementById('canvas').nextElementSibling its not showing up tried doing insertafter but alas not a thing ig
//  const currentSmall = document.getElementById("div1");

  document.body.insertBefore(cvcordelm, document.getElementById('canvas').nextElementSibling);

  document.getElementById('canvas').nextElementSibling.style="z-index: 1;width: 550px;position: absolute;top: 440px;left: 0px;padding: 10px;pointer-events: none;font-size: 20px;text-shadow: rgb(59, 59, 59) 2px 2px 0px;display: block;"
// put a delay here
setTimeout(() => {
document.getElementById('canvas').nextElementSibling.remove();
}, 1500);
}, 1800)
// Scrap yard
//go into properties of the namednodemap to see the target info try this getnameditem("#text")
//document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","div").nameditem()
//document.getElementById('canvas').nextSibling
//document.getElementById('canvas').nextElementSibling junk code that didnt work
//document.getElementById('canvas').nextElementSibling.childNodes.item(4) //should return your block position as the following string "            x: -0.78 y: 99.00 z: 0.83" or something
//gonna take this template i found online and adapt it "            x: 9142.06 y: -477.00 z: 6934.86" there seems to be alot of spaces next to this. I will use .trim to remove that nope not work
// document.getElementById('canvas').nextElementSibling.childNodes.item(4).data now we getting somwere length is variable
// i am going to attempt to make code that rounds the data this bit here creates evenly spaced integers from 1 to 99 not working
//var x1 = [];
//for (var i=1;i<=9;i++) {
//  x1.push(i);
//}
// creates an array of integers using a for loop -10000 , -9999 , -9998 , ... 10,000
//var x2 = [];
//for (var i=-10000;i<=10000;i++) {
//  x2.push(i);
//}