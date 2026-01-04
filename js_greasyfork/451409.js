// ==UserScript==
// @name        Visvaris rotate image
// @namespace   Visvaris
// @match       https://visvaris.zzdats.lv/Card/EditUser/*
// @grant       none
// @version     0.11
// @author      Zigmars
// @description Allows to rotate uploaded image
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451409/Visvaris%20rotate%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/451409/Visvaris%20rotate%20image.meta.js
// ==/UserScript==

var pievienot_foto_objekts,imgtag;
setTimeout(pievienot_foto_poga, 100);
//aizvietojam pogu "Pievienot fotogrāfiju" ar savu, kas papildus izsauks rotēšanas pogas izveidi
function pievienot_foto_poga(){
    var dom_object = document.getElementById('userEditContent');
    dom_object = dom_object.children.item(0).children.item(2);
    dom_object = dom_object.getElementsByTagName('a')[0];
    dom_object = dom_object.parentNode;
    dom_object.children.item(0).style.display = "none";
    pievienot_foto_objekts = dom_object;
    var new_a = document.createElement('a');
    new_a.setAttribute('href', "#");
    new_a.innerHTML = "Pievienot fotogrāfiju";
    new_a.className = "link";
    new_a.onclick = pievienot_foto_poga_click;
    dom_object.appendChild(new_a);
    addGlobalStyle('.fa-rotate:before {content: "\\f01e";color: blue;}');
}
//simulējam klikšķi uz vecās pogas "Pievienot fotogrāfiju" un pēc 3 sekundēm uzsāksim rotēšanas pogas izveidi
function pievienot_foto_poga_click(){
    pievienot_foto_objekts.children.item(0).click();
    setTimeout(rotet_poga, 3000);
}
//izveidojam rotēšanas pogu ar identisku stilu jau esošajām 2 pogām
function rotet_poga(){
    var dom_object = document.getElementById('filesystPanel');
    dom_object=dom_object.getElementsByClassName('editButtonDiv')[0];
    dom_object = dom_object.getElementsByTagName('ul')[0];
    var new_li = document.createElement('li');
    dom_object.appendChild(new_li);
    var new_a = document.createElement('a');
    new_a.setAttribute('href', "");
    new_a.className = "link";
    new_a.title = "Rotēt";
    new_a.onclick = rotet_poga_click;
    new_li.appendChild(new_a);
    var new_i = document.createElement('i');
    new_i.className = "fa fa-rotate";
    new_a.appendChild(new_i);
}
//nolasām attēla datus un rotējam
function rotet_poga_click(){
    var dom_object = document.getElementById('uploadedPhotoEdit');
    imgtag = dom_object.getElementsByTagName('img')[1];
    var base64source = imgtag.src;
    rotet_attelu(base64source,90);
    return false;
}
//funkcija, kas pievieno "head" daļā stilu priekš jaunās pogas
function addGlobalStyle(css) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//rotējam attēlu ap tā viduspunktu un pēc tam simulējam "drag" notikumu, lai attēls tiktu pārzīmēts
function rotet_attelu(srcBase64, degrees) {
  var image = new Image();
  image.onload = function (){
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(degrees * Math.PI / 180);
      ctx.drawImage(image, image.width / -2, image.height / -2);
      imgtag.onload = function (){
          var dom_object=imgtag.parentNode.children.item(2);
          mouse_down_event=new Event('mousedown');
          mouse_down_event.clientX = 0;
          mouse_down_event.clientY = 0;
          dom_object.dispatchEvent(mouse_down_event);
          mouse_move_event=new Event('mousemove');
          mouse_move_event.clientX = 0;
          mouse_move_event.clientY = 0;
          document.dispatchEvent(mouse_move_event);
          mouse_up_event=new Event('mouseup');
          mouse_up_event.clientX = 0;
          mouse_up_event.clientY = 0;
          document.dispatchEvent(mouse_up_event);
      };
      imgtag.src = canvas.toDataURL();
  };
  image.src = srcBase64;
}