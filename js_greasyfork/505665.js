// ==UserScript==
// @name         profil fotoğrafı
// @namespace
// @version      1.0
// @description profil fotoğrafı açıyor
// @author       kangwoo
// @match         https://gartic.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1359504
// @downloadURL https://update.greasyfork.org/scripts/505665/profil%20foto%C4%9Fraf%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/505665/profil%20foto%C4%9Fraf%C4%B1.meta.js
// ==/UserScript==
setInterval(function(){if(document.querySelector('.content.profile')){if(document.querySelector('#profilbutonu')===null){let profilbutonu=document.createElement('button');profilbutonu.innerHTML=`<button id="profilbutonu" class="profil-button btn"></button>`;profilbutonu.style.backgroundImage="url('https://i.gifer.com/Ea3.gif')";profilbutonu.style.backgroundSize="cover";profilbutonu.style.color="white";profilbutonu.style.border="2px solid black";profilbutonu.style.padding="10px";profilbutonu.style.fontWeight="bold";profilbutonu.addEventListener('click',function(){let avurl;const kangwoo=document.querySelector('.contentPopup .avatar');if(kangwoo){const oh=kangwoo.querySelector('.av, .avt');if(oh){const cha=oh.className;const match=cha.match(/av avt(\d+)/);if(match){const nmb=match[1];avurl=`https://gartic.io/static/images/avatar/svg/${nmb}.svg`}}else{const bckgi=kangwoo.style.backgroundImage;if(bckgi&&bckgi!=='none'){avurl=bckgi.slice(5,-2)}}}
window.open(avurl,'_blank')});document.querySelector('div[class="buttons"]').appendChild(profilbutonu)}}})
