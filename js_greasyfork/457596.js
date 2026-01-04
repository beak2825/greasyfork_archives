// ==UserScript==
// @name         Bonk.io CLANS!!!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This adds CLANS!!!! in bonk.io, Featuring CLAN CHAT, and CLAN ROOMS IN TOP!
// @author       You
// @match        https://bonk.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457596/Bonkio%20CLANS%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/457596/Bonkio%20CLANS%21%21%21.meta.js
// ==/UserScript==

let lastRoom = '';
let solved = {};

let RoomList;
let PlrName = 'nobody.';

let currentClan = 'ust';
let clanRooms = {};

function clans(){
const Gdocument = document.getElementById('maingameframe').contentDocument
if (Gdocument){
PlrName = Gdocument.getElementById('pretty_top_name').textContent
if (!RoomList){
RoomList = Gdocument.getElementById('roomlisttable');
RoomList.addEventListener('DOMNodeInserted',function(e){
if(e.target.nodeName !== '#text' || [...e.target.parentNode.parentNode.children].indexOf(e.target.parentNode) !== 2 || e.target.parentNode.parentNode.classList.contains("MODDEDPOSHANDLED")) return;
    e.target.parentNode.parentNode.classList.add("MODDEDPOSHANDLED");
    if(RoomList.children[0].children.length === 0) return;
    if(clanRooms[e.target.parentNode.parentNode.children[0].textContent]){
    e.target.parentNode.parentNode.style.color = 'green';
    RoomList.children[0].insertBefore(e.target.parentNode.parentNode, RoomList.children[0].children[[...RoomList.children[0].children].findIndex(i => {return (!(clanRooms[i.parentNode.parentNode.children[0].textContent]))})]);
}});
}
let create = Gdocument.getElementById("roomlistcreatecreatebutton")
fetch('https://bonkclans.itsdawildshadow.repl.co/getClan/'+currentClan,{
 method: 'GET'
})
.then((response) =>{
    return response.json();
})
.then((response) => {
  clanRooms = {};
  for (let i of response){
  clanRooms[i] = true;
  }
})
  fetch('https://BonkClans.itsdawildshadow.repl.co/getChat',{
   method: 'GET'
  })
  .then(response => response.json())
  .then(response => {
   let txt = 'Clan: '+currentClan+'\n';
   for (let i of response){
    txt += i+"\n";
   }
   chatTXT.textContent = txt;
  });
if (!solved.create && create){
 const func = create.onclick;
 solved.create = true;
create.onclick = function(){
  let roomName = Gdocument.getElementById('roomlistcreatewindowgamename');
  if (roomName){
  console.log(roomName.value+" is the next RoomName!");
  lastRoom = roomName.value;
  fetch('https://bonkclans.itsdawildshadow.repl.co/addClan/'+lastRoom+'/'+currentClan,{
 method: 'GET'
})
  func();
  }
}
}
}
}

let chatDiv = document.createElement('div');
let chatTXT = document.createElement('div');
let chatInput = document.createElement('input');
chatTXT.style.width = '100%';
chatTXT.style.height = '100%';
chatTXT.style.whiteSpace = 'pre-wrap';
chatDiv.appendChild(chatTXT)
chatDiv.style.width = "150px";
chatDiv.style.height = "400px";
chatDiv.style.right = '1%';
chatDiv.style.top = '30%';
chatDiv.style.position = 'absolute';
chatDiv.style.borderRadius = '15px';
chatDiv.style.backgroundColor = 'white';
document.body.appendChild(chatDiv);
chatInput.style.width = "90%";
chatInput.style.left = '2.5%';
chatInput.style.height = "5%";
chatInput.style.bottom = '-10%';
chatInput.style.position = 'absolute';
chatInput.style.borderRadius = '15px';
chatInput.style.backgroundColor = 'white';
chatDiv.appendChild(chatInput);
document.addEventListener("keydown",function(e){
 if (e.keyCode == 13 && document.activeElement == chatInput){
     if (chatInput.value.startsWith("/clan ")){
         let clan = chatInput.value.split(" ")[1]
         if (clan){
          currentClan = clan;
         }
         chatInput.value = ''
     }else{
  let value = chatInput.value;
  value = value.replaceAll(' ','%20');
  value = value.replaceAll('/','%2F');
  value = value.replaceAll('\\','%2F');
  let name = PlrName;
  name = name.replaceAll(' ','%20');
  name = name.replaceAll('/','%2F');
  name = name.replaceAll('\\','%2F');
  fetch('https://BonkClans.itsdawildshadow.repl.co/sendChat/'+name+'/'+value,{
   method: 'GET'
  });
  chatInput.value = ''
 }
 }
})

setInterval(clans,500)