// ==UserScript==
// @name           ICEbot v3
// @name:tr        made by frio
// @name:az        hello
// @description    Bot Panel for gartic.io
// @description:tr Bot Panel for gartic.io (in Turkish)
// @description:az Bot Panel for gartic.io (in Azerbaijani)
// @version        3.0
// @author         frio
// @license        MIT
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://cdn.discordapp.com/attachments/1124451069204910161/1177654466523189360/MOSHED-2023-11-24-13-55-23.jpg?ex=65734b30&is=6560d630&hm=1b42ff32759ea222cc3b1eac33cb7852209358d47e44c560b10efe0f8f230752&
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/1220697
// @downloadURL https://update.greasyfork.org/scripts/486253/ICEbot%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/486253/ICEbot%20v3.meta.js
// ==/UserScript==
let kickonjoin=false,kickallwhenjoin=false,theme=0
function value(mathPI){ return Math.floor(Math.pi()*360)}
function num(codex){return Math.ceil(Math.random()*codex+1)}
let usersinroom=[]
function atrb(getatrb){ return document.getAttribute(getatrb)}
function fa(hv){return document.querySelectorAll(hv)}

if(window.location.href.indexOf("gartic.io") > -1 || window.location.href.indexOf("aHR0cHM6Ly9nYXJ0aWMuaW8") > -1){
    let readyc=0,botc=0,otoeven=0,roomusers=[],botID,botlongID,windowurl,goback,intervalbroadcast,intervalmsg,intervalanswer,antikick=1,botsidvalue=[],customkickitems=[],antiafk,autoguess=0,wordsInterval

const addItem = (arr, ...arguments) => { for (let i = 0; i < arguments.length; i++) { arr[arr.length] = arguments[i]; } return arr; };

function arrayFilter(array) {
  return array.filter((value, index, arr) => arr.indexOf(value) === index);
}
    let customkick = localStorage.getItem("customkick");
if (!customkick) {
  localStorage.setItem("customkick", "[]");
}

if (customkick) {
    let list=JSON.parse(localStorage.getItem("customkick"))

        list.forEach(user=>{
            setTimeout(()=>{
        f("#icebot3").innerHTML+=`<h2 class="customkick" id="customkick.`+user.user+`">`+user.user+`</h2>
    <input type="submit" class="customkickremove" id="customkickuser.`+user.user+`" onclick="window.postMessage('customkickremove.`+user.user+`','*')" value="remove">`
        addItem(customkickitems, user.user)
            },3000)
        })
}
    let WebSocket=window.WebSocket
    window.ginterval=0
    window.selectlevel=-1
    let originalSend = WebSocket.prototype.send,setTrue=false;
    window.wsObj={}

    console.log("running")
    WebSocket.prototype.send=function(data){
        originalSend.apply(this, arguments)
        if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}
    };

    function updatespeckicks(){
        f(".userkickmenu").innerHTML=""
        roomusers.forEach(user=>{

            user.nick.split("‏").join("")!="Flames"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
        })
    }

window.addEventListener("message",(msg)=>{

    if(msg.data=="broadcastspam"){
        let broadcastspamMS=f(".broadcastspam").value
        f("#broadcastms").innerText='BROADCAST SPAM VALUE: ' + broadcastspamMS
        localStorage.setItem("broadcastspam",broadcastspamMS)
    }
    if(msg.data=="messagespam"){
        let messagespamMS=f(".messagespam").value
        f("#messagems").innerText='MESSAGE SPAM VALUE: ' + messagespamMS
        localStorage.setItem("messagespam",messagespamMS)
    }
    if(msg.data=="answerspam"){
        let answerspamMS=f(".answerspam").value
        f("#answerms").innerText='ANSWER SPAM VALUE: ' + answerspamMS
        localStorage.setItem("answerspam",answerspamMS)
    }
    if(msg.data=="hidemenu"){
        f("#icebot1").style.display="none"
        f("#icebot2").style.display="none"
        f("#icebot3").style.display="none"
        f("#icebot4").style.display="none"
        f(".menu1").value="◻"
        f(".menu2").value="◻"
        f(".menu3").value="◻"
        f(".menu4").value="◻"
    }
    if(msg.data=="menu1"){
        f("#icebot1").style.display="block"
        f("#icebot2").style.display="none"
        f("#icebot3").style.display="none"
        f("#icebot4").style.display="none"
        f(".menu1").value="◼"
        f(".menu2").value="◻"
        f(".menu3").value="◻"
        f(".menu4").value="◻"
    }
    if(msg.data=="menu2"){
        f("#icebot1").style.display="none"
        f("#icebot2").style.display="block"
        f("#icebot3").style.display="none"
        f("#icebot4").style.display="none"
        f(".menu1").value="◻"
        f(".menu2").value="◼"
        f(".menu3").value="◻"
        f(".menu4").value="◻"
    }
    if(msg.data=="menu3"){
        f("#icebot1").style.display="none"
        f("#icebot2").style.display="none"
        f("#icebot3").style.display="block"
        f("#icebot4").style.display="none"
        f(".menu1").value="◻"
        f(".menu2").value="◻"
        f(".menu3").value="◼"
        f(".menu4").value="◻"
    }
    if(msg.data=="menu4"){
        f("#icebot1").style.display="none"
        f("#icebot2").style.display="none"
        f("#icebot3").style.display="none"
        f("#icebot4").style.display="block"
        f(".menu1").value="◻"
        f(".menu2").value="◻"
        f(".menu3").value="◻"
        f(".menu4").value="◼"
    }

        if(msg.data=="customkickadd"){
 const value = f("#kicklistinput").value;
var customkicklist = localStorage.getItem("customkick");
if (!customkicklist.includes(value) && !customkickitems.includes(value)) {
  customkickitems.push(value);
  let customkickitem = JSON.parse(localStorage.getItem("customkick"));
  if (customkickitem.findIndex(item => item.user === value) === -1) {
    customkickitem.push({ "user": value });
    localStorage.setItem("customkick", JSON.stringify(customkickitem));
    f("#icebot3").innerHTML += `<h2 class="customkick" id="customkick.` + value + `">` + value + `</h2>
    <input type="submit" class="customkickremove" id="customkickuser.` + value + `" onclick="window.postMessage('customkickremove.` + value + `','*')" value="remove">`
  }
}
        }
            if(msg.data.indexOf("customkickremove.")!=-1){
 let usernick = event.data.split("customkickremove.")[1];
let storage = JSON.parse(localStorage.getItem("customkick"));

if (storage && Array.isArray(storage)) {
  for (let i = 0; i < storage.length; i++) {
    if (storage[i].user === usernick) {
      storage.splice(i, 1);
      break;
    }
  }

  localStorage.setItem("customkick", JSON.stringify(storage));
var value = usernick;
var index = customkickitems.indexOf(value);
if (index > -1) {
  customkickitems.splice(index, 1);
}
}
      let kickusertext= document.getElementById("customkick."+usernick)
      let kickuserremovebtn= document.getElementById("customkickuser."+usernick)
      kickusertext.remove()
      kickuserremovebtn.remove()

        }
        if(msg.data=="customkickremoveall"){
var elementsCustomKick = document.querySelectorAll('[id*="customkick."]');
var elementsCustomKickUser = document.querySelectorAll('[id*="customkickuser."]');
function deleteElement(element) {
  element.parentNode.removeChild(element);
}
elementsCustomKick.forEach(function(element) {
  deleteElement(element);
});
elementsCustomKickUser.forEach(function(element) {
  deleteElement(element);

})
      localStorage.setItem("customkick","[]")
      customkickitems=[]
        }
})
    window.eventAdd=()=>{
        if(!setTrue){
            setTrue=1
            window.wsObj.addEventListener("message",(msg)=>{
                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    objlist[5].forEach(item=>{roomusers.push(item)})
                    botID = objlist[2]
                    botlongID = objlist[1]
                    theme = objlist[4].tema
                    setTimeout(()=>{
                    f(".roomtheme").innerHTML= theme},10)
                    setTimeout(()=>{
                    GM_sendMessage("botsidvalue",botlongID,rand())},777)
                    setTimeout(()=>{
                    GM_sendMessage("updatelist",botID,rand())},777)



                    setTimeout(()=>{
                        antikick=0;},3000)
setTimeout(()=>{
    f('#antikick').setAttribute('checked', 'checked');
    f('#antiafk').setAttribute('checked', 'checked');},0)


GM_onMessage("botsidvalue", (datachangex, _) => {

 botsidvalue.push(datachangex)
});
GM_onMessage("updatelist", (datachangex, _) => {
      GM_sendMessage("updatebotidlist",botsidvalue,rand())
});
GM_onMessage("updatebotidlist", (datachangex, _) => {

  if (!botsidvalue.includes(datachangex)) {
    addItem(botsidvalue,...datachangex);
  }
            botsidvalue = arrayFilter(botsidvalue);
});

                    updatespeckicks()
GM_onMessage('answerinput', (atılacak, _) => {
       f('#answer').value= atılacak
    })
GM_onMessage('broadcast', (broadcast, _) => {
   window.wsObj.send('42[11,'+objlist[2]+',"'+broadcast+'"]')
   window.wsObj.send('42[13,'+objlist[2]+',"'+broadcast+'"]')
});
GM_onMessage('msg', (message, _) => {
   window.wsObj.send('42[11,'+objlist[2]+',"'+message+'"]')
})
GM_onMessage('answer', (answer, _) => {
   window.wsObj.send('42[13,'+objlist[2]+',"'+answer+'"]')
})
GM_onMessage('report', (_, __) => {
    window.wsObj.send('42[35,'+objlist[2]+']')
});
GM_onMessage('jump', (_, __) => {
    window.wsObj.send('42[25,'+objlist[2]+']')
});
GM_onMessage('acceptdraw1', (_, __) => {
    window.wsObj.send('42[34,'+objlist[2]+']')
});
GM_onMessage('acceptdraw2', (_, __) => {
    window.wsObj.send('42[34,'+objlist[2]+',1]')
});
GM_onMessage('tips', (_, __) => {
    window.wsObj.send('42[30,'+objlist[2]+',1]')
});
GM_onMessage('exit', (_, __) => {
    window.wsObj.send('42[24,'+objlist[2]+']')
});

    window.addEventListener("message",function(event){
        if(typeof(event.data)==="string"){
            if(event.data.indexOf("kickuser.")!=-1){
                let userid=event.data.split("kickuser.")[1]
                GM_sendMessage("kickuser",userid)

            }}

          if(event.data=="kickall"){
  var elements = document.getElementsByClassName("kickmenubtn");
var elementsvalue = [];

for (var i = 0; i < elements.length; i++) {
  elementsvalue.push(elements[i].getAttribute("onclick"));
}

elementsvalue.forEach(function(value, index) {
  setTimeout(function() {
    let userid = value.split("kickuser.")[1].split("','*")[0];

    GM_sendMessage("kickuser",userid)
  }, 550 * index);
})}

        if(event.data=="broadcast"){
            var broadcast = f("#broadcast").value
            GM_sendMessage('broadcast', broadcast, rand());
        }
        if(event.data=="chat"){
            var chat = f("#message").value
            GM_sendMessage('msg', chat, rand());
        }
        if(event.data=="answer"){
            var answer = f("#answer").value
            GM_sendMessage('answer', answer, rand());
        }
        if(event.data=="report"){
            GM_sendMessage('report', rand(), rand());
        }
        if(event.data=="jump"){
            GM_sendMessage('jump', rand(), rand());
        }
        if(event.data=="acceptdraw1"){
            GM_sendMessage('acceptdraw1', rand(), rand());
        }
        if(event.data=="acceptdraw2"){
            GM_sendMessage('acceptdraw2', rand(), rand());
        }
         if(event.data=="tips"){
            GM_sendMessage('tips', rand(), rand());
         }
        if(event.data=="exit"){
            GM_sendMessage('exit', rand(), rand());
        }
        if(event.data=="broadcastspamtoggle"){
            let broadcastspamMS=parseInt(localStorage.getItem("broadcastspam"))
            var broadcastspam = f("#broadcastspam").value
            intervalbroadcast=setInterval(()=>{
            GM_sendMessage('broadcast', broadcastspam, rand());
            },broadcastspamMS)
        f("#broadcaststart").style.display="none"
        f("#broadcaststop").style.display="block"
        }
        if(event.data=="chatspamtoggle"){
            let messagespamMS=parseInt(localStorage.getItem("messagespam"))
            var messagespam = f("#messagespam").value
            intervalmsg=setInterval(()=>{
            var chatspam = f("#messagespam").value
            GM_sendMessage('msg', chatspam, rand());
            },messagespamMS)
        f("#msgstart").style.display="none"
        f("#msgstop").style.display="block"
        }
        if(event.data=="answerspamtoggle"){
            let answerspamMS=parseInt(localStorage.getItem("answerspam"))
            var answerspam = f("#answerspam").value
            intervalanswer=setInterval(()=>{
            var answerspam = f("#answerspam").value
            GM_sendMessage('answer', answerspam, rand());
            },answerspamMS)
        f("#answerstart").style.display="none"
        f("#answerstop").style.display="block"
        }
        if(event.data=="stopbroadcast"){
        clearInterval(intervalbroadcast)
        f("#broadcaststart").style.display="block"
        f("#broadcaststop").style.display="none"
        }
        if(event.data=="stopmsg"){
        clearInterval(intervalmsg)
        f("#msgstart").style.display="block"
        f("#msgstop").style.display="none"
        }
        if(event.data=="stopanswer"){
        clearInterval(intervalanswer)
        f("#answerstart").style.display="block"
        f("#answerstop").style.display="none"
        }
        if (event.data == "autoguessenable") {
  f("#autoguessenable").style.display = "none";
  f("#autoguessdisable").style.display = "block"
      autoguess=1
  

}

if (event.data == "autoguessdisable") {
  f("#autoguessenable").style.display = "block"
  f("#autoguessdisable").style.display = "none";
    autoguess=0
    clearInterval(wordsInterval)
}


    })

                    GM_onMessage("kickuser",(useridvalue,_) =>{
                              if(!botsidvalue.includes(useridvalue)){
                window.wsObj.send('42[45,'+objlist[2]+',["'+useridvalue+'",true]]')}
                              })}
                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    roomusers.push(user)
                    updatespeckicks()
                    if(kickonjoin){typeof(user.id)=="string"?GM_sendMessage("kickuser",user.id):GM_sendMessage("kickuser",user.id);}

if (customkickitems.includes(user.nick)) {
  GM_sendMessage("kickuser",user.id)
}

                }
      if(msg.data.indexOf('42["34"')!=-1){
                    let objlist=JSON.parse('["34"'+msg.data.split('42["34"')[1])
                    var cdd=objlist[1]

                GM_sendMessage('answerinput', cdd, rand());

      }
document.addEventListener("DOMNodeRemoved",(e)=>{
    if(typeof e.target.getAttribute === 'function'){
        if(e.target.getAttribute("id")=="nprogress"&&goback==1){
            window.location.href=windowurl;goback=0
        }
    }
})
  if(msg.data.indexOf('42["45"')!=-1 && msg.data.indexOf('"'+botlongID+'",1')!=-1 && antikick===0){
      let antikick = f("#antikick")
if(antikick.checked){
      window.wsObj.send('42[24,'+botID+']')
      goback=1
      windowurl=window.location.href

}
  }

    if(msg.data.indexOf('42["47"]')!=-1){
let autoreport = f("#autoreport")
if(autoreport.checked){
      GM_sendMessage('report', rand(), rand());

}}
      if(msg.data.indexOf('42["47"]')!=-1 && autoguess==1){
let inter= 110
function wordsArray(arr) {
  let index = 0;
  if (wordsInterval) {
    clearInterval(wordsInterval);
  }
  wordsInterval = setInterval(() => {
      if (index < arr.length) {
        window.wsObj.send('42[13,'+botID+',"'+arr[index]+'"]')
        index++;
      } else {
        clearInterval(wordsInterval);


    }
  }, inter);
}

const FoodsPt = [ "Arroz", "Feijão", "Macarrão", "Batata", "Coxa de frango", "Carne de boi", "Peixe", "Ovo", "Queijo", "Presunto", "Alface", "Tomate", "Cenoura", "Beterraba", "Brócolis", "Couve-flor", "Abóbora", "Abobrinha", "Cebola", "Pimentão", "Pepino", "Morango", "Banana", "Maçã", "Laranja", "Mamão", "Melancia", "Melão", "Uva", "Manga", "Kiwi", "Abacaxi", "Pêra", "Limão", "Pêssego", "Berinjela", "Damasco", "Amêndoa", "Nozes", "Castanha", "Amendoim", "Pipoca", "Sorvete", "Iogurte", "Leite", "Manteiga", "Azeite", "Vinagre", "Açúcar", "Sal", "Pimenta", "Orégano", "Salsinha", "Cebolinha", "Erva-doce", "Manjericão", "Alecrim", "Pão", "Bolacha", "Bolo", "Torta", "Brigadeiro", "Pudim", "Gelatina", "picole", "Brownie", "Biscoito", "Sushi", "Sashimi", "Tempurá", "suco", "Ramen", "Udon", "salada", "Niguiri", "Temaki", "Gyoza", "Harumaki", "Shimeji", "Shiitake", "Champignon", "Aspargo", "Alcachofra", "Acelga", "Agrião", "Alga", "Lentilha", "Grão-de-bico", "Amaranto", "Quinoa", "Chia", "Linhaça", "Aveia", "Trigo", "Centeio", "Milho", "Soja", "Cará", "Inhame", "Nabo", "Rabanete", "ketchup", "Ostra", "Mexilhão", "Salmão", "Atum", "Bacalhau", "Linguado", "Robalo", "Sardinha", "Truta", "Tilápia", "Tambaqui", "Pirarucu", "Dourado", "Agulha", "Bagre", "Pintado", "Carpa", "Tambacu", "Javali", "Coelho", "Codorna", "Pato", "Marreco", "Peru", "Ganso", "Faisão", "Avestruz", "Vison", "Jacaré", "Tartaruga", "Cervo", "Veado", "Pomba", "Pombo", "Camarão", "Lagosta", "Siri", "Caranguejo", "Polvo", "Lula", "Mexilhão", "Ostra" ];
const FoodsTr= [ "tulumba", "findık ekmesi", "kavurma", "hamburger", "fıstık", "fanta", "kola", "çekirdek", "yumurta", "but", "midye", "ekler", "cips", "kayısı", "lahmacun", "dürüm", "kavun", "karbur", "Supangle", "kokoreç", "olips", "tost", "kadayıf", "Avokado", "Pizza", "dondurma", "çiğ köfte", "pakek", "kazandibi", "süt", "bazlama", "şeftali", "nektari", "Falım", "Çikolata", "Bonfile", "şwker", "pide", "ekmek", "ayran", "meyve suyu", "puding", "vişne", "elma", "fındık", "fındık ezmesi", "kek", "et", "lolipop", "kanat", "limonata", "patates kızartaması", "traliçe", "baklava", "bonfile" ]
if(theme==="Foods (pt)"){
    wordsArray(FoodsPt)}
      }
    if(msg.data.indexOf('42["16"')!=-1){
let autoreport = f("#autoskip")
if(autoreport.checked){
    setTimeout(()=>{
      GM_sendMessage('jump', rand(), rand());},3000)

}}



let antiafkcheckbox = f("#antiafk")
if(antiafkcheckbox.checked){
    antiafk=setInterval(()=>{

            f(".contentPopup")&&f(".btYellowBig.ic-yes")?f(".btYellowBig.ic-yes").click():0;},100)

} else{
    clearInterval(antiafk)

}



                if(msg.data.indexOf('42["24"')!=-1){
                    let user=msg.data.split(",")[1].split('"')[1]
                    for(let i=0;i<roomusers.length;i++){
                        typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0
                    }
                    updatespeckicks()
                }
            })
        }
    }

    let html=`
    <div class="userlist">
    <div class="userkickmenu"></div>
    <input type="submit" style="width:90px; background:red" onclick="window.postMessage('kickall','*')" value="KICK ALL">
        <input type="checkbox" class="kickonjoin">&nbsp;Kick on join<br>
        <input type="checkbox" class="kickallwhenjoin">&nbsp;Kick when join<hr>
    </div>
    <div class="option">
    <input type="submit" class="hidemenu" onclick="window.postMessage('hidemenu','*')" value="🟥">
    <input type="submit" class="menu1" onclick="window.postMessage('menu1','*')" value="◼">
    <input type="submit" class="menu2" onclick="window.postMessage('menu2','*')" value="◻">
    <input type="submit" class="menu3" onclick="window.postMessage('menu3','*')" value="◻">
    <input type="submit" class="menu4" onclick="window.postMessage('menu4','*')" value="◻">
    </div>
    <div id="icebot1" class="icebot">
    <h2 style="color:white;">ICEbot V3</h2>
    <div class="broadcastbox"><input type="text" id="broadcast" placeholder="Broadcast"><button class="broadcastbtn" onclick="window.postMessage('broadcast','*')" value="Broadcast"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="msgbox"><input type="text" id="message" placeholder="Message"><button class="msgbtn" onclick="window.postMessage('chat','*')" value="Message"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="answerbox"><input type="text" id="answer" placeholder="Answer"><button class="answerbtn" onclick="window.postMessage('answer','*')" value="Answer"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <input type="submit" class="exit" onclick="window.postMessage('exit','*')" value="EXIT">
    <input type="submit" class="kickall" onclick="window.postMessage('kickall','*')" value="KICK ALL">
    <input type="submit" class="report" onclick="window.postMessage('report','*')" value="REPORT">
    <input type="submit" class="jump" onclick="window.postMessage('jump','*')" value="JUMP">
    <input type="submit" class="acceptdraw1" onclick="window.postMessage('acceptdraw1','*')" value="DRAW 1">
    <input type="submit" class="acceptdraw2" onclick="window.postMessage('acceptdraw2','*')" value="DRAW 2">
    <input type="submit" class="tips" onclick="window.postMessage('tips','*')" value="TIPS"><br>
    <input type="checkbox" id="autoreport" class="autoskip"><span>  Auto report</span>
    <input type="checkbox" id="autoskip" class="autoskip"><span>  Auto skip</span><br>
    <input type="checkbox" id="antikick" class="antikick"><span>  Anti kick</span>
    <input type="checkbox" id="antiafk" class="antiafk"><span>  Anti afk</span></br>
    <h2 class="roomconsole"></h2><span><h2 class="roomtheme"></h2></span>
    </div>
    <div id="icebot2" class="icebot">
    <div class="broadcastbox"><input type="text" id="broadcastspam" placeholder="Broadcast (spam)"><button class="broadcastbtn" id="broadcaststart" onclick="window.postMessage('broadcastspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="broadcastbtn" id="broadcaststop" onclick="window.postMessage('stopbroadcast','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
    <div class="msgbox"><input type="text" id="messagespam" placeholder="Message (spam)"><button class="msgbtn" id="msgstart" onclick="window.postMessage('chatspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="msgbtn" id="msgstop" onclick="window.postMessage('stopmsg','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
    <div class="answerbox"><input type="text" id="answerspam" placeholder="Answer (spam)"><button class="answerbtn" id="answerstart" onclick="window.postMessage('answerspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="answerbtn" id="answerstop" onclick="window.postMessage('stopanswer','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
<h2 class="broadcastspamvalue" id="broadcastms"></h2>
<input class="broadcastspam" type="range" oninput="postMessage('broadcastspam')" min="1000" max="10000">
<h2 class="messagespamvalue" id="messagems"></h2>
<input class="messagespam" type="range" oninput="postMessage('messagespam')" min="1000" max="10000">
<h2 class="answerspamvalue" id="answerms"></h2>
<input class="answerspam" type="range" oninput="postMessage('answerspam')" min="1000" max="10000">
    </div>
    <div id="icebot3" class="icebot">
    <h2 class="customkick">Custom kick</h2>
    <div class="kicklistbox">
    <input type="text" id="kicklistinput" placeholder="Player name">
    <input type="submit" id="kicklistaddbtn" onclick="window.postMessage('customkickadd','*')" value="add">
</div>
    <input type="submit" id="kicklistremoveallbtn" onclick="window.postMessage('customkickremoveall','*')" value="remove all">
    </div>
    <div id="icebot4" class="icebot">
<div class="autoguessstyle">
    <h2 id="autoguesstext">Auto guess &nbsp;</h2>
    <input type="submit" id="autoguessenable" class="autoguess" onclick="window.postMessage('autoguessenable','*')" value="enable">
    <input type="submit" id="autoguessdisable" class="autoguess" onclick="window.postMessage('autoguessdisable','*')" value="disable"></div>
    `

    function setCSS(){
        var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        .userlist *{box-sizing:border-box;}


        .userlist {
            display:block;text-align:center;opacity:none;font-size:10pt;color:#FFD700;font-style:italic;
            position:fixed;left:50%;top:3px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .userlist input[type=text]{height:20px;border-radius:3px;font-size:9pt;background:brown;color:white;padding-left:3px;}
        .userlist input[type=submit]{height:25px;border-radius:3px;background:#FFD700;}
        .userlist input[type=checkbox]{margin-top:2px;}

        #background{
        z-index:999;width:0px;height:0px;position:fixed;left:0px;top:0px;
        }
        .option *{box-sizing:border-box;}

        .option {

            display:block;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:3px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .option input[type=submit],.icebotbtn button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .option input[type=checkbox]{margin-top:2px;}
        .option input[type=submit]:hover{background:#ccad00;transition:0.2s;}

        .icebot *{box-sizing:border-box;}

        #icebot1 {

            display:block;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:50px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block;height:auto !important;width:200px !important;
        }
        #icebot2 {

            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:50px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:200px !important;
        .broadcastspamvalue{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        .messagespamvalue{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        .answerspamvalue{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        .broadcastspam{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        .messagespam{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        .answerspam{margin-top:3px; text-align:left; color:#FFD700; font-size:16px;}
        #broadcaststop{display:none;}
        #msgstop{display:none;}
        #answerstop{display:none;}
        }
        #icebot3 {

            overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;
            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:50px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:200px !important;


        .kicklistbox{display:flex;align-items:center;justify-content:center;}
        .kicklistbox input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .kicklistbox input[type=submit],.kicklistbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .kicklistbox input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        #kicklistaddbtn{width:40%;}
        #kicklistremoveallbtn{width:40%;}
        .customkickremove{width:30%;}
        .customkick{margin-top:3px; text-align:center; color:#FFD700; font-size:17px;}
        }
        #icebot4 {

            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:50px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:200px !important;
        .autoguess{width:40%;}
        #autoguessenable{align-items:center;justify-content:center;}
        #autoguessdisable{display:none;align-items:center;justify-content:center;}

        .autoguessstyle{display:flex;align-items:center;justify-content:center;}
        }

        .icebot input[type=submit],.icebotbtn button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .icebot input[type=checkbox]{margin-top:2px;}
        .icebot input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        .icebot input[type=range]{accent-color:#FFD700;}
        .icebot input[type=range]:focus::-webkit-slider-runnable-track { background: #3071A9; }


        .broadcastbox{display:flex;align-items:center;justify-content:center;}
        .broadcastbox input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .broadcastbox input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .broadcastbox button:hover{background:#ccad00;transition:0.2s;}
        .msgbox{display:flex;align-items:center;justify-content:center;}
        .msgbox input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .msgbox input[type=submit],.msgbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .msgbox button:hover{background:#ccad00;transition:0.2s;}
        .answerbox{display:flex;align-items:center;justify-content:center;}
        .answerbox input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .answerbox input[type=submit],.answerbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .answerbox button:hover{background:#ccad00;transition:0.2s;}


        .broadcastbtn{width:20%;},.broadcastbtn input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        .msgbtn{width:20%;}
        .answerbtn{width:20%;}
        .report{width:40%;}
        .kickall{width:40%;}
        .jump{width:40%;}
        .exit{width:40%;}
        .acceptdraw1{width:40%;}
        .acceptdraw2{width:40%;}
        .tips{width:40%;}
        .autoreport input[type=checkbox]{margin-top:32px}
        .autoskip{margin-top:32px;}
        .antikick{margin-top:32px;}
        .antiafk{margin-top:32px;}

        .roomconsole{margin-top:3px; text-align:left; color:#FFD700; font-size:17px;}
        .roomtheme{margin-top:3px; text-align:left; color:#FFD700; font-size:17px;}


    `;
        GM_addStyle(css);


        GM_onMessage("kickjoinset", (datachange,_) => {
        kickonjoin=datachange
    });
         GM_onMessage("kickallwhenjoin", (datachange,_) => {
        kickallwhenjoin=datachange
    });
        f(".kickonjoin").addEventListener("change",()=>{
            GM_sendMessage("kickjoinset",f(".kickonjoin").checked)
        })
        f(".kickallwhenjoin").addEventListener("change",()=>{
            GM_sendMessage("kickwhenset",f(".kickallwhenjoin").checked)
        })

    }


    setInterval(()=>{
        if(f("#users")){
            fa(".kickmenubtn").forEach(ele=>{
                f(".scrollElements").innerText.indexOf(ele.value)==-1?ele.remove():0
            })
            f("g")?f("g").remove():0;
        }

        if(f("#background")&&!f(".userlist")&&!f(".option")&&!f(".icebot")){
            f("#background").innerHTML+=html
            setCSS()
        }
    },100)

}


let m_s, a_i, m_a, m_z, m_b;

const f = x => document.querySelector(x),
    sendMessage = (inputSelector, mesaj) => {
        a_i = document.querySelector(inputSelector);
        m_a = a_i.value;

        // Add a random invisible character from the list before the message
        const invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060", "\u180E", "\uFEFF"];
        const randomChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
        a_i.value = randomChar + mesaj + m_a;

        m_z = new Event("input", { bubbles: !0 });
        m_z.simulated = !0;
        m_b = new Event("submit", { bubbles: !0 });
        m_b.simulated = !0;
        m_s = a_i._valueTracker;
        m_s && m_s.setValue(m_a);
        a_i.dispatchEvent(m_z);
        a_i.form.dispatchEvent(m_b);
    },
    rand = x => Math.floor(Math.random() * 1000000),
    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
    GM_sendMessage = (label, ...data) => GM_setValue(label, data);




window.onload = function () {


    const roomConsole = f(".roomconsole")

    let currentGarticRoom;

    function getGarticRoom() {
        let garticRegex = /gartic\.io\/(.+)$/;
        let match = window.location.href.match(garticRegex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    function updateCurrentRoom() {
        let room = getGarticRoom();
        if (room !== currentGarticRoom) {
            currentGarticRoom = room
            roomConsole.innerHTML = `Current Room: ${currentGarticRoom || 'No room found'}`

        }
    }

    updateCurrentRoom();

    setInterval(updateCurrentRoom, 5000);
    }

window.addEventListener("load", function() {
    var playhome = document.querySelector("#screens > div > div.content.join > div.actions > button")
    setTimeout(()=>{
    playhome.click()},100)
    setTimeout(()=>{
    playhome.click()},200)
});
window.onbeforeunload = function() { window.wsObj.onclose = function () {};
           window.wsObj.close(); };


