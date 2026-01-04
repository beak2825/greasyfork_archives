// ==UserScript==
// @name             WAZ NRZ deobfuscator
// @name:de          WAZ NRZ gesamten Inhalt anzeigen
// @namespace        waz
// @description      bypass paywall on waz.de, nrz.de
// @description:de   umgeht die Bezahlschranke auf waz.de, nrz.de
// @include          https://www.waz.de/*
// @include          https://www.nrz.de/*
// @include          https://www.otz.de/*
// @include          https://www.wr.de/*
// @include          https://www.thueringer-allgemeine.de/*
// @include          https://www.tlz.de/*
// @version          2.5
// @downloadURL https://update.greasyfork.org/scripts/425863/WAZ%20NRZ%20deobfuscator.user.js
// @updateURL https://update.greasyfork.org/scripts/425863/WAZ%20NRZ%20deobfuscator.meta.js
// ==/UserScript==

// Pascal May/2021

console.log("WAZ deobfuscator");
console.log("================");


// bases on https://www.juniordevelopercentral.com/how-to-write-a-rot13-function-in-javascript/ even if this is actually rather similar to ROT1 than ROT13 with additional characters
const rot13 = str => {
    const input =  ' \r\nABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789:;, |~}\+±.`/àýÝ{=?0÷-‚²åÅêµ#‟”@×—[)*´\'(^\\'; // '->; convert apostrophe to semicolon , brace open '(' to apostroph
    const output = ' \r\nzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789:+|{}[*%-_.ßüÜz<>/ö,`!äÄé="„“?Ö–Z();&\']['; // and backslash to closing bracket]
  
  
  
    let encoded = '';
    for (let i=0; i < str.length; i++) {
      s = str[i];  
      const index = input.indexOf(s);
        if (index>=0)
        	encoded += output[index];
        else {
          encoded += '?['+s+']';
          console.log("not found:",s,s.charCodeAt(0));
        }
    }

    return encoded;
}


// start finding elements

var elements = document.getElementsByClassName("obfuscated");
var elements_len = elements.length;

console.log("FOUND:",elements_len);
var result = "";

for (var i = 0; i < elements_len ; i++){
  var el = elements[i];
  var txt = el.innerText;
  var dec = rot13(txt);
  console.log(i,txt,dec);
  if (dec && !dec.startsWith("<div") && !dec.includes("verpassen Sie mit unserer regionalen")){
    console.log("ADD:",dec,"___");
    result += '<p>'+dec+'</p>';
  }
}
console.log("END, result len=",result.length);
console.log(result);

//////////////////////////////////////////////////////////
// remove paywall and add decoded text

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// https://stackoverflow.com/a/18120786
document.getElementById("paywall-container").remove();
document.getElementById("plus-banner").remove();
document.getElementById("plus-banner--sticky").remove();
document.getElementsByClassName("inline-block--wide").remove();
"inline-block--wide"

if (result) {result += "<br/><p style='color:white;background-color: green;'><i>Bezahlschranke umgangen</i></p>" }

var deobfel =  document.createElement("div");
//deobfel.id=".....";
deobfel.innerHTML = result;
//document.body.appendChild(deobfel);

element=document.getElementsByClassName("article__header__intro");
element[0].parentNode.insertBefore(deobfel, element[0].nextSibling);
// https://stackoverflow.com/a/32135318
/////////////////////////////

