// ==UserScript==
// @name        WoTForum - HideUserPosts
// @author      SCSItel
// @description Скрывает на форумах WoT, WoWS и WoWP сообщения всех пользователей, кроме разработчиков. Есть несколько дополнительных опций, чисто похулиганить.
// @namespace   http://forum.worldoftanks.ru/*
// @include     http://forum.worldoftanks.ru/index.php?/topic/*
// @include     http://forum.worldofwarships.ru/index.php?/topic/*
// @include     http://forum.worldofwarplanes.ru/index.php?/topic/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20318/WoTForum%20-%20HideUserPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/20318/WoTForum%20-%20HideUserPosts.meta.js
// ==/UserScript==

//0 - выключает параметр, 1 - включает
//Отображение стрелки "минусомёта"
var IsShowRepDown = 0;
//Замена дежурного "уважаемый игрок" от Рейтара на что-нибудь из списков ниже
var IsReytarSpecial = 0;
//Для замены в начале предложения. Разделитель - точка с пробелом (пример - 'Sample1. Sample2')
var CatchPhraseUpStr = '';
//Для замены в середине предложения. Разделитель - точка с пробелом (пример - 'Sample1. Sample2')
var CatchPhraseStr = '';
//Чтобы отключить изменение/добавление картинок, достаточно оставить ссылки пустыми
//Ссылка на аватарку для разработчиков
var AvaLink = '';
//Сслыка на картинку в конец постов разработчиков
var NekoLink = '';

var CatchPhraseUp = CatchPhraseUpStr.split('. ');
var CatchPhrase = CatchPhraseStr.split('. ');

var ContentBlock = document.getElementById("ips_Posts");
var Post = ContentBlock.getElementsByClassName("post_wrap");
while (Post.length > 0){
  tmp = Post[0].parentElement;
  ContentBlock.removeChild(tmp);
}

var Post = document.getElementsByClassName("post_wrap__wg");
if (AvaLink !== '') {
  for (var i = 0; i < Post.length; i++) {
    Ava = Post[i].getElementsByClassName("ipsUserPhoto")[0];
    Ava.src = AvaLink;
  }
}
for (var i = 0; i < Post.length; i++) {
  var PostBody = Post[i].getElementsByClassName("post entry-content ")[0];
  if (IsReytarSpecial == 1) {
    if ((i < CatchPhrase.length) && (CatchPhraseUp.length > 0)) {
      var j1 = i;
    }  else {
      var j1 = Math.max(i, CatchPhraseUp.length) % Math.min(i, CatchPhraseUp.length);
    }
    if ((i < CatchPhrase.length) && (CatchPhrase.length > 0)) {
      var j2 = i;
    }  else {
      var j2 = Math.max(i, CatchPhrase.length) % Math.min(i, CatchPhrase.length);
    }
    
    PostBody.innerHTML = PostBody.innerHTML.replace(new RegExp("Уважаемый игрок", 'g'), CatchPhraseUp[j1]);
    PostBody.innerHTML = PostBody.innerHTML.replace(new RegExp("уважаемый игрок", 'g'), CatchPhrase[j2]);
  }
  
  if (NekoLink !== '') {
    var PostText = Post[i].getElementsByClassName("post entry-content ")[0];  
    var ImgNeko = document.createElement("IMG");
    ImgNeko.src = NekoLink;
    PostText.appendChild(ImgNeko);
  }
}

if (IsShowRepDown == 1) {
  var Minus = document.getElementsByClassName("rep_down");
  for (var i = 0; i < Minus.length; i++) {
    var Img = Minus[i].getElementsByTagName("img")[0];
    Img.onclick = function() {
      alert("А никто не обещал, что они будут работать! :-р"); 
    } 
    var liEl = Minus[i].parentElement;
    if (liEl.hasAttribute("style")){
      liEl.removeAttribute("style") ;
    }  
  }

  var Plus = document.getElementsByClassName("rep_up");
  for (var i = 0; i < Plus.length; i++) {
    var liEl = Plus[i].parentElement;
    var RepList = liEl.parentElement;
    var ne = RepList.removeChild(liEl);
    RepList.appendChild(ne);
  }
}