// ==UserScript==
// @name        EXELANCE LLC - sahibinden.com
// @namespace   Violentmonkey Scripts
// @match       https://www.sahibinden.com/ilan/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @include     https://*.sahibinden.com/*
// // @include     https://sahibinden.com/*
// @description 15.02.2023 10:27:31
// @downloadURL https://update.greasyfork.org/scripts/463881/EXELANCE%20LLC%20-%20sahibindencom.user.js
// @updateURL https://update.greasyfork.org/scripts/463881/EXELANCE%20LLC%20-%20sahibindencom.meta.js
// ==/UserScript==
// Seçili telefon numarasının değerini alın
// Seçili telefon numarasının değerini alın
setTimeout(function() {
var phoneLinks = document.querySelectorAll(".pretty-phone-part, .message-user-phone");


phoneLinks.forEach(function(phoneLink) {
  // Telefon numarasının üzerine gelindiğinde linkin görünümünü ve davranışını değiştir
  phoneLink.addEventListener("mouseenter", function() {
    phoneLink.style.color = "white"; // metin rengini mavi yap
    phoneLink.style.cursor = "pointer"; // imleci el tipine çevir
  });
phoneLink.addEventListener('mouseover', function() {
    phoneLink.style.textShadow = '0 0 5px red';
});

phoneLink.addEventListener('mouseout', function() {
    phoneLink.style.textShadow = '';
});

  // Telefon numarasından imleci çektiğinizde linkin görünümünü ve davranışını geri al
  phoneLink.addEventListener("mouseleave", function() {
    phoneLink.style.color = ""; // metin rengini geri al
    phoneLink.style.textDecoration = ""; // altı çiziliyi geri al
    phoneLink.style.cursor = ""; // imleci geri al
  });

  // Seçili telefon numarasının değerini alın
  var phone = phoneLink.innerText;

  // Telefon numarasının sadece rakamlarını alın
  phone = phone.replace(/\D/g, '');

  // Numara 90 ile başlamıyorsa başına "90" ekle
if (phone.startsWith("0")) {
  phone = phone.slice(1);
}


// Telefon numarasına tıklandığında iletişim tercihi sorulur
phoneLink.addEventListener("click", function(e) {
e.preventDefault();
var dialog = document.createElement("div");
var dialogText = document.createElement("p");
var dialogBtnWhatsapp = document.createElement("button");
var dialogBtnPhone = document.createElement("button");
var dialogBtnCopy = document.createElement("button");
var dialogBtnCancel = document.createElement("button");

dialogText.innerText ="Whatsapp üzerinden mi yoksa telefon üzerinden mi iletişim kurmak istersiniz?";

dialogBtnWhatsapp.innerText ="Whatsapp";
dialogBtnPhone.innerText ="Telefon";
dialogBtnCopy.innerText ="Numarayı Kopyala";
dialogBtnCancel.innerHTML ="✕";

dialog.appendChild(dialogText);
dialog.appendChild(dialogBtnWhatsapp);
dialog.appendChild(dialogBtnPhone);
dialog.appendChild(dialogBtnCopy);
dialog.appendChild(dialogBtnCancel);

dialogBtnWhatsapp.classList.add("dialog-button");
dialogBtnPhone.classList.add("dialog-button");
dialogBtnCopy.classList.add("dialog-button");
dialogBtnCancel.classList.add("dialog-button");
dialogBtnCancel.classList.add("dialog-button-cancel");

dialogBtnWhatsapp.addEventListener("click", function() {
  window.open("whatsapp://send?phone=90" + phone.replace(/\D/g, ''), '_self');
  dialog.remove();
});

dialogBtnPhone.addEventListener("click", function() {
  window.location.href = "tel:0" + phone.replace(/\D/g, '');
  dialog.remove();
});

dialogBtnCopy.addEventListener("click", function() {
  var phoneStripped = phone.replace(/\D/g, '');
  var phoneWithoutCode = phoneStripped.replace(/^90/, '');
  navigator.clipboard.writeText(phoneWithoutCode);
  dialog.remove();
});

dialogBtnCancel.addEventListener("click", function() {
  dialog.remove();
});

dialog.style.position = "fixed";
dialog.style.top = "50%";
dialog.style.left = "50%";
dialog.style.transform = "translate(-50%, -50%)";
dialog.style.background = "#eef8f7";
dialog.style.padding = "20px";
dialog.style.zIndex = "9999";

dialogBtnWhatsapp.style.margin = "10px";
dialogBtnPhone.style.margin = "10px";
dialogBtnCopy.style.margin = "10px";
dialogBtnCancel.style.margin = "10px";

dialogBtnCopy.style.backgroundColor = "#212121";
dialogBtnCopy.style.color = "white";


document.body.appendChild(dialog);
});
});

}, 1000); // 1000ms yani 1 saniye gecikme
























