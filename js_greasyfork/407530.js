// ==UserScript==
// @name         Dispose Tool
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  adds buttons for all credit and trash locations within the dispose tool for ease of clearing those locations
// @author       cpatters
// @match        https://aftlite-na.amazon.com/damage/dispose_item*
// @match        https://aftlite-portal.amazon.com/dispose-item*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407530/Dispose%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/407530/Dispose%20Tool.meta.js
// ==/UserScript==

var x= document.querySelector('input[type="text"]');
var z= document.createElement("button");
var y= document.createElement("button");
var w= document.createElement("button");
var a= document.createElement("button");
var b= document.createElement("button");
var c= document.createElement("button");
var d= document.createElement("button");
var p= document.createElement("button");
var ambd= document.createElement("button");
var chilld= document.createElement("button");
var frozd= document.createElement("button");
var ambe= document.createElement("button");
var chille= document.createElement("button");
var froze= document.createElement("button");
var ambo= document.createElement("button");
var chillo= document.createElement("button");
var frozo= document.createElement("button");
var ambc= document.createElement("button");
var chillc= document.createElement("button");
var frozc= document.createElement("button");


var body= document.getElementsByTagName("body")[0];
var h= document.getElementsByTagName("h2")[0];
var td= document.getElementsByTagName("td")[0];
h.appendChild(p);
td.appendChild(z);
td.appendChild(y);
td.appendChild(w);
body.appendChild(a);
body.appendChild(b);
body.appendChild(c);
body.appendChild(d);
body.appendChild(ambd);
body.appendChild(chilld);
body.appendChild(frozd);
body.appendChild(ambe);
body.appendChild(chille);
body.appendChild(froze);
body.appendChild(ambo);
body.appendChild(chillo);
body.appendChild(frozo);
body.appendChild(ambc);
body.appendChild(chillc);
body.appendChild(frozc);

z.innerHTML= "Destroy";
y.innerHTML= "Donate";
w.innerHTML= "Liquidate";
a.innerHTML= "EXP-REMOVAL-DONATE";
b.innerHTML= "EXP-REMOVAL-DESTROY";
c.innerHTML= "Trash-Dispose";
d.innerHTML= "trash-recall";
p.innerHTML= "Dispose Items";
ambd.innerHTML= "Credit-DMG-Ambient";
chilld.innerHTML= "Credit-DMG-Chilled";
frozd.innerHTML= "Credit-DMG-Frozen";
ambe.innerHTML= "Credit-EXP-Ambient";
chille.innerHTML= "Credit-EXP-Chilled";
froze.innerHTML= "Credit-EXP-Frozen";
ambo.innerHTML= "Credit-OVER-Ambient";
chillo.innerHTML= "Credit-OVER-Chilled";
frozo.innerHTML= "Credit-OVER-Frozen";
ambc.innerHTML= "Credit-CAP-Ambient";
chillc.innerHTML= "Credit-CAP-Chilled";
frozc.innerHTML= "Credit-CAP-Frozen";


p.style.backgroundColor = "yellow";
z.style.backgroundColor = "lightblue";
y.style.backgroundColor = "lightblue";
w.style.backgroundColor = "lightblue";
a.style.backgroundColor = "coral";
b.style.backgroundColor = "coral";
c.style.backgroundColor = "coral";
d.style.backgroundColor = "coral";
ambd.style.backgroundColor= '#42f55a';
chilld.style.backgroundColor= '#42f55a';
frozd.style.backgroundColor= '#42f55a';
ambe.style.backgroundColor= '#f55442';
chille.style.backgroundColor= '#f55442';
froze.style.backgroundColor= '#f55442';
ambo.style.backgroundColor= '#f542e0';
chillo.style.backgroundColor= '#f542e0';
frozo.style.backgroundColor= '#f542e0';
ambc.style.backgroundColor= '#f5b042';
chillc.style.backgroundColor= '#f5b042';
frozc.style.backgroundColor= '#f5b042';

z.addEventListener("click", function() {
    x.value= "d";
    x.form.submit();
});


a.addEventListener("click", function() {
                    x.value= "EXP-REMOVAL-DONATE";
                    x.form.submit();
});


y.addEventListener("click", function() {
    x.value= "G";
    x.form.submit();
});


w.addEventListener("click", function() {
                    x.value= "L";
                    x.form.submit();
});

b.addEventListener("click", function() {
    x.value= "EXP-REMOVAL-DESTROY";
    x.form.submit();
});


c.addEventListener("click", function() {
                    x.value= "trash";
                    x.form.submit();
});

d.addEventListener("click", function() {
    x.value= "trash-recall";
    x.form.submit();
});

p.addEventListener("click", function() {
    window.open("https://aftlite-na.amazon.com/damage/dispose_item", "_self");
});

c.addEventListener("click", function(){
    x.value= "trash-dispose";
    x.form.submit();
});

ambd.addEventListener("click", function(){
    x.value= ambd.innerHTML;
    x.form.submit();
});

chilld.addEventListener("click", function(){
    x.value= chilld.innerHTML;
    x.form.submit();
});

frozd.addEventListener("click", function(){
    x.value= frozd.innerHTML;
    x.form.submit();
});

ambe.addEventListener("click", function(){
    x.value= ambe.innerHTML;
    x.form.submit();
});

chille.addEventListener("click", function(){
    x.value= chille.innerHTML;
    x.form.submit();
});

froze.addEventListener("click", function(){
    x.value= froze.innerHTML;
    x.form.submit();
});

ambo.addEventListener("click", function(){
    x.value= ambo.innerHTML;
    x.form.submit();
});

chillo.addEventListener("click", function(){
    x.value= chillo.innerHTML;
    x.form.submit();
});

frozo.addEventListener("click", function(){
    x.value= frozo.innerHTML;
    x.form.submit();
});

ambc.addEventListener("click", function(){
    x.value= ambc.innerHTML;
    x.form.submit();
});

chillc.addEventListener("click", function(){
    x.value= chillc.innerHTML;
    x.form.submit();
});

frozc.addEventListener("click", function(){
    x.value= frozc.innerHTML;
    x.form.submit();
});
