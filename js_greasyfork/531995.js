// ==UserScript==
// @name           ICEbot v6
// @name:tr        made by frio
// @name:az        hello
// @description    Bot Panel for gartic.io
// @description:tr Bot Panel for gartic.io (in Turkish)
// @description:az Bot Panel for gartic.io (in Azerbaijani)
// @version        4.0
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
// @downloadURL https://update.greasyfork.org/scripts/531995/ICEbot%20v6.user.js
// @updateURL https://update.greasyfork.org/scripts/531995/ICEbot%20v6.meta.js
// ==/UserScript==



    let rand = x => Math.floor(Math.random() * 1000000),
    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
    GM_sendMessage = (label, ...data) => GM_setValue(label, data);
GM_onMessage('answerinput', (atılacak, _) => {

                    document.querySelector('#answer').value= atılacak
    })
GM_onMessage('changedraw', (atılacak, _) => {

                    document.querySelector('#answer').value= atılacak
    })
function f(ICE){return document.querySelector(ICE)}
function fa(ICE){return document.querySelectorAll(ICE)}
function num(ICE){return Math.ceil(Math.random()*ICE+1)}
function rc(ICE){let e=f('input[name="chat"]');let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function rs(ICE){let e=f(".search input");let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function rnext(kelime) {
  const hd = kelime.split('');
  const hu = hd.length;
  const yh = [];
  const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069']
  let charCount = 0;

  for (let i = 0; i < hu; i++) {
    yh.push(hd[i]);
    charCount++;

    if (charCount < 18 && i < hu - 1) {
      const invisibleChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
      yh.push(invisibleChar);
      charCount++;
    }

    if (charCount >= 18) {
      break;
    }
  }

  return yh.join('');
}
let cmd="",wss=[],tojoin=0,usersinroom=[],customkickitems=[],messagejoinitems=[],tfr,tg,intervalbroadcast,intervalmsg,intervalanswer,intervalantiafk,rainbowdraw,rainbowdrawmode=false,botsidvalue=[],wordsInterval,botID,botlongID,theme,am,avatar=localStorage.getItem("avatar"),botnick=localStorage.getItem("botnick"),nick=localStorage.getItem("nick")
        if(window.location.href.indexOf("aHR0cHM6Ly9nYXJ0aWMuaW8")!=-1){
    let room,kicknewstat=false,kickjoinstat=false,autoreport=false,autoskip=false,antiafk=false,antikick=false,antikickDelay=1,autokick=false,autoguess,autofarm=false,waitforkick=0

const addItem = (arr, ...arguments) => { for (let i = 0; i < arguments.length; i++) { arr[arr.length] = arguments[i]; } return arr; };

function arrayFilter(array) {
  return array.filter((value, index, arr) => arr.indexOf(value) === index);
}

    GM_setValue("botekle",rand())

    GM_addValueChangeListener("resetcount", function(I,C,E,b) {
        GM_setValue("botekle",rand())
    })
    setTimeout(()=>{waitforkick=0},1000)
    GM_onMessage("reconnect", (_,__)=>{
const storedArray = JSON.parse(localStorage.getItem('ws-reconnect-data')) || [];
storedArray.forEach(obj => {
  let rws= new WebSocket("wss://"+obj.server+".gartic.io/socket.io/?c="+obj.code+"&EIO=3&transport=websocket");
 rws.onopen=()=>{rws.send('42[7,"'+obj.room+'",'+obj.timestamp+']');
    GM_onMessage("cmd", (cmd,x)=> { switch(cmd) {
    case "broadcast":
      rws.send('42[11,'+obj.timestamp+',"'+x+'"]')
      rws.send('42[13,'+obj.timestamp+',"'+x+'"]')
      break;
    case "msg":
      rws.send('42[11,'+obj.timestamp+',"'+x+'"]')
      break;
    case "answer":
      rws.send('42[13,'+obj.timestamp+',"'+x+'"]')
      break;
    case "report":
      rws.send('42[35,'+obj.timestamp+']')
      break;
    case "jump":
      rws.send('42[25,'+obj.timestamp+']')
      break;
    case "accept1":
      rws.send('42[34,'+obj.timestamp+']')
      break;
    case "accept2":
      rws.send('42[34,'+obj.timestamp+',1]')
      break;
    case "tips":
      rws.send('42[30,'+obj.timestamp+',1]')
      break;
    case "exit":
      rws.send('42[24,'+obj.timestamp+']')
      break;
    case "kick":
                              if(!botsidvalue.includes(x.split("..")[0])){
      rws.send('42[45,'+obj.timestamp+',["'+x.split("..")[0]+'",true]]')}
      break;

                                                     }})
                                                       }})})
    GM_onMessage("join", (room,nick,avatar,botnick,kickonjoin,msgjoinvalue,_) => {
        fetch("/logout").then(()=>{
            fetch("https://"+window.location.href.split("/")[2]+"/server?check=1&v3=1&room="+room+"&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8#").then(x=>x.text()).then(x=>{
            let ws=new WebSocket("wss://"+window.location.href.split("/")[2]+"/__cpw.php?u="+btoa("wss://"+x.split("https://")[1].split(".")[0]+".gartic.io/socket.io/?c="+x.split("?c=")[1]+"&EIO=3&transport=websocket")+"&o=aHR0cHM6Ly9nYXJ0aWMuaW8="); ws.onopen=()=>{
                let inter=setInterval(()=>{
                GM_setValue("ready",rand())
                    if(tojoin==1){
                        tojoin=0
if (botnick === '0') {
  ws.send('42[3,{"v":20000,"nick":"'+rnext(nick)+'","avatar":'+avatar+',"platform":0,"sala":"'+room.substring(2)+'"}]')
} else if (botnick === '1') {
  ws.send('42[3,{"v":20000,"nick":"'+nick+Math.ceil(Math.random()*10000+1)+'","avatar":'+avatar+',"platform":0,"sala":"'+room.substring(2)+'"}]')
}
                        clearInterval(inter)
                    }
                },50)
                }

            ws.onclose=()=>{
                wss.length=0
                ws.close();
            }
            ws.onmessage=(msg)=>{

                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    usersinroom.push(user)
                    if(kicknewstat){typeof(user.id)=="string"?ws.send('42[45,'+ws.id+',["'+user.id+'",true]]'):ws.send('42[45,'+ws.id+',['+user.id+',true]]');}
                }
                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    ws.theme=objlist[4].tema
                    ws.room=objlist[4].codigo
                    ws.id=objlist[2];
                    objlist[5].forEach(item=>{usersinroom.push(item)});
                    let targetid=objlist[5][0].id
                    botID = objlist[2];

const storedArray = JSON.parse(localStorage.getItem('ws-reconnect-data')) || [];
const newData = { code: x.split("?c=")[1], room: objlist[3], server: x.split("https://")[1].split(".")[0], timestamp: objlist[2] };
storedArray.push(newData);
localStorage.setItem('ws-reconnect-data', JSON.stringify(storedArray));
                    botlongID = objlist[1]
                    theme = objlist[4].tema
                    setTimeout(()=>{
                    f(".roomtheme").innerHTML= theme},10)
                    setTimeout(()=>{
                    GM_sendMessage("botsidvalue",botlongID,rand())},777)
                    setTimeout(()=>{
                    GM_sendMessage("updatelist",botID,rand())},777)

                    setTimeout(()=>{
                        antikickDelay=0;},2000)
                    if(msgjoinvalue){msgjoinvalue.forEach(item=>{
   ws.send('42[11,'+ws.id+',"'+item.msg+'"]')})
                               }
                    kickjoinstat?typeof(targetid)=="string"?ws.send('42[45,'+ws.id+',["'+targetid+'",true]]'):ws.send('42[45,'+ws.id+',['+targetid+',true]]'):0
                    ws.send('42[46,'+objlist[2]+']')



       GM_onMessage('answerinput', (atılacak, _) => {
       f('#answer').value= atılacak
    })

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

    GM_addValueChangeListener("broadcast", function(I,C,E,b) {
   ws.send('42[11,'+objlist[2]+',"'+E.split("►")[0]+'"]')
   ws.send('42[13,'+objlist[2]+',"'+E.split("►")[0]+'"]')
});
    GM_addValueChangeListener("msg", function(I,C,E,b) {
   ws.send('42[11,'+objlist[2]+',"'+E.split("►")[0]+'"]')
})
    GM_addValueChangeListener("answer", function(I,C,E,b) {
   ws.send('42[13,'+objlist[2]+',"'+E.split("►")[0]+'"]')
})
    GM_addValueChangeListener("report", function(I,C,E,b) {
    ws.send('42[35,'+objlist[2]+']')
});
    GM_addValueChangeListener("jump", function(I,C,E,b) {
    ws.send('42[25,'+objlist[2]+']')
});
    GM_onMessage("draw", (_,__)=> {

function calcPixel(x, y, larguraImagem, alturaImagem) {
    const re = (y * larguraImagem + x) * 4;
    return {
        re: re,
        x: x,
        y: y
    };
}

function pixelsend(inicioX, inicioY, larguraG, alturaG) {
    const larguraImagem = 767;
    const alturaImagem = 448;
    let re = 0;

    function enviarProximoPixel() {
        const x = inicioX + re % larguraG;
        const y = inicioY + Math.floor(re / larguraG);

        if (y < inicioY + alturaG) {
            const pixel = calcPixel(x, y, larguraImagem, alturaImagem);
            const hex = 'xFFFFFF';
            ws.send('42[10,' + ws.id + ',[2,' + pixel.x + ',' + pixel.y + ']]');
            re++;
            setTimeout(enviarProximoPixel, 250);
        }
    }

    enviarProximoPixel();
}

function pixels() {
    const larguraImagem = 767;
    const alturaImagem = 448;
    const larguraG = 10;
    const alturaG = 10;
    const intervaloEnvio = 50;

    let y = 0;
    let gVAL= setInterval(function() {
        pixelsend(0, y, larguraG, alturaG);
        y += alturaG;

        if (y >= alturaImagem) {
            clearInterval(gVAL);
        }
    }, intervaloEnvio);
}

async function pixelEx() {
    const items = await navigator.clipboard.read();
    const item = items[items.length - 1];
    if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
        const blob = await item.getType("image/png" || "image/jpeg");
        const imageBitmap = await createImageBitmap(blob);
    } else {
        console.log("d");
    }
}

pixelEx();

});
    GM_addValueChangeListener("acceptdraw1", function(I,C,E,b) {
    ws.send('42[34,'+objlist[2]+']')
});
    GM_addValueChangeListener("acceptdraw2", function(I,C,E,b) {
    ws.send('42[34,'+objlist[2]+',1]')
});

    GM_addValueChangeListener("tips", function(I,C,E,b) {
    ws.send('42[30,'+objlist[2]+',1]')
});

    GM_addValueChangeListener("exit", function(I,C,E,b) {
    ws.send('42[24,'+objlist[2]+']')
    wss.lenghth=0
    usersinroom.length=0
});

    GM_addValueChangeListener("kick", function(I,C,E,b) {
                              if(!botsidvalue.includes(E.split("..")[0])){
                ws.send('42[45,'+objlist[2]+',["'+E.split("..")[0]+'",true]]')}
                              })


                    JSON.stringify(wss).indexOf(objlist[2])==-1?wss.push({"ws":ws,"id":objlist[2],"lengthID":objlist[1]}):0
                    let interval=setInterval(()=>{
                        ws.readyState==1?ws.send('2'):clearInterval(interval)
                    },20000);
                }
                if(antiafk===true){
        intervalantiafk=setInterval(()=>{
            ws.send('42[42,'+ws.id+']')
        },20000)
} else if(antiafk===false){
    clearInterval(intervalantiafk)
    intervalantiafk=null
}
                if(msg.data.indexOf('42["47"]')!=-1 && autoguess==1){

            let inter=parseInt(localStorage.getItem("autoguess"))
function wordsArray(arr) {
  let index = 0;
  if (wordsInterval) {
    clearInterval(wordsInterval);
  }
  wordsInterval = setInterval(() => {
      if (index < arr.length) {
        ws.send('42[13,'+ws.id+',"'+arr[index]+'"]')
        index++;
      } else {
        clearInterval(wordsInterval);


    }
  }, inter);
}

const FoodsPt = [ "Arroz", "Feijão", "Macarrão", "Batata", "Coxa de frango", "Carne de boi", "Peixe", "Ovo", "Queijo", "Presunto", "Alface", "Tomate", "Cenoura", "Beterraba", "Brócolis", "Couve-flor", "Abóbora", "Abobrinha", "Cebola", "Pimentão", "Pepino", "Morango", "Banana", "Maçã", "Laranja", "Mamão", "Melancia", "Melão", "Uva", "Manga", "Kiwi", "Abacaxi", "Pêra", "Limão", "Pêssego", "Ameixa", "Damasco", "Amêndoa", "Nozes", "Castanha", "Amendoim", "Pipoca", "Sorvete", "Iogurte", "Leite", "Manteiga", "Azeite", "Vinagre", "Açúcar", "Sal", "Pimenta", "Orégano", "Salsinha", "Cebolinha", "Erva-doce", "Manjericão", "Alecrim", "Pão", "Bolacha", "Bolo", "Torta", "Brigadeiro", "Pudim", "Gelatina", "Mousse", "Brownie", "Biscoito", "Sushi", "Sashimi", "Tempurá", "Yakisoba", "Ramen", "Udon", "Soba", "Niguiri", "Temaki", "Gyoza", "Harumaki", "Shimeji", "Shiitake", "Champignon", "Aspargo", "Alcachofra", "Acelga", "Agrião", "Alga", "Lentilha", "Grão-de-bico", "Amaranto", "Quinoa", "Chia", "Linhaça", "Aveia", "Trigo", "Centeio", "Milho", "Soja", "Cará", "Inhame", "Nabo", "Rabanete", "Alcachofra", "Ostra", "Mexilhão", "Salmão", "Atum", "Bacalhau", "Linguado", "Robalo", "Sardinha", "Truta", "Tilápia", "Tambaqui", "Pirarucu", "Dourado", "Agulha", "Bagre", "Pintado", "Carpa", "Tambacu", "Javali", "Coelho", "Codorna", "Pato", "Marreco", "Peru", "Ganso", "Faisão", "Avestruz", "Vison", "Jacaré", "Tartaruga", "Cervo", "Veado", "Pomba", "Pombo", "Camarão", "Lagosta", "Siri", "Caranguejo", "Polvo", "Lula", "Mexilhão", "Ostra" ];
const FoodsTr= [ "tulumba", "findık ekmesi", "kavurma", "hamburger", "fıstık", "fanta", "kola", "çekirdek", "yumurta", "but", "midye", "ekler", "cips", "kayısı", "lahmacun", "dürüm", "kavun", "karbur", "Supangle", "kokoreç", "olips", "tost", "kadayıf", "Avokado", "Pizza", "dondurma", "çiğ köfte", "pakek", "kazandibi", "süt", "bazlama", "şeftali", "nektari", "Falım", "Çikolata", "Bonfile", "şwker", "pide", "ekmek", "ayran", "meyve suyu", "puding", "vişne", "elma", "fındık", "fındık ezmesi", "kek", "et", "lolipop", "kanat", "limonata", "patates kızartaması", "traliçe", "baklava", "bonfile" ]
const MinecraftPt = [ "peixe", "madeira", "arvore", "alex", "porco", "arco", "gato", "machado", "enderman", "baú", "vara de pescar", "poção", "abóbora", "balde de lava", "ovelha", "grama", "balde de leite", "ouro", "areia", "porco zumbi", "cavalo", "pão", "galinha", "ferro", "enxada", "maçã dourada", "bolo", "slime", "bola de neve", "warden", "espada de ferro", "graveto", "cascalho", "steve", "ender dragon", "melancia", "aldeão", "poção arremesável", "wither", "pérola do End", "cenoura", "enxada de diamante", "pólvora", "diamante", "pena", "semente de trigo", "carvão", "redstone", "TNT", "sela", "lágrima de Ghast", "esqueleto", "aranha", "lula", "zombie pigman", "blaze", "endermite", "lobo", "vaca", "coelho", "morcego", "flor", "maçã", "axolote" ]
const ObjectsPt = [ "mouse pad", "machado", "panela de pressão", "piano", "agulha", "chocalho", "chinelo", "poncheira", "cotoveleira", "dado", "armadura", "estilingue", "caldeirão", "cachepô", "berimbau", "carrinho de rolimã", "ferrolho", "cetro", "sanfona", "conga", "guarda-sol", "escova de dente", "varal", "borrifador", "chaleira", "mimeógrafo", "rodo", "serpentina", "caixa de ferramentas", "pires", "rastelo", "chave de grifo", "betoneira", "estatueta do oscar", "fones de ouvido", "bandana", "monóculo", "navalha", "enxada", "serra elétrica", "gangorra", "broca", "ganzá", "sombrero", "telha", "charango", "biombo", "órgão", "miçanga", "saxofone", "bola de gude", "lustre", "pochete", "monitor", "retroprojetor", "marionete", "patinete", "chip" ]
const FootballPt = [ "juventude", "ituano", "sertãozinho", "tigres", "newcastle", "metalist", "uberaba", "ajax", "olympiacos", "manchester united", "barcelona", "campo grande", "brasil de pelotas", "argentinos juniors", "benfica", "bayern de munique", "cuiabá", "getafe", "napoli", "paranavaí", "racing", "athletico paranaense", "confiança", "união são joão", "brasiliense", "monte azul", "everton", "joinville", "gaúcho", "corinthians", "lanús", "swansea city", "ypiranga", "entrerriense", "athletic bilbao", "fiorentina", "mirassol", "anapolina", "remo", "csa", "boa esporte", "penedense", "chivas", "camaçari", "icasa", "bom sucesso", "once caldas", "stuttgart", "vélez sarsfield", "friburguense", "levante", "málaga", "ituiutaba", "sampaio corrêa", "estudiantes", "cascavel", "mogi mirim", "siena", "aston villa", "independiente", "universidad de chile", "tottenham", "real sociedad", "real zaragoza", "bangu", "ldu", "murici", "manchester city", "macaé", "paulista", "vitória", "ponte preta", "vera cruz", "lille", "linense", "democrata", "inter de milão", "operário", "stoke city", "americano", "vila aurora", "central", "peñarol", "bordeaux", "wolfsburg", "noroeste", "juventus", "chapecoense", "morelia", "panathinaikos", "basel", "atalanta", "volta redonda", "chelsea", "santo andré" ]
const FlagsPt = [ "barbados", "camarões", "congo", "samoa", "croácia", "ilhas marshall", "maldivas", "gâmbia", "canadá", "uruguai", "san marino", "jordânia", "reino unido", "lituânia", "áustria", "islândia", "irã", "hungria", "bolívia", "trinidad e tobago", "afeganistão", "cuba", "guiné-bissau", "comores", "mongólia", "cingapura", "bélgica", "zâmbia", "romênia", "chade", "malauí", "paquistão", "etiópia", "timor-leste", "camboja", "síria", "ilhas salomão", "cazaquistão", "quênia", "omã", "argélia", "tanzânia", "méxico", "nepal", "brasil", "chile", "jamaica", "vanuatu", "lesoto", "luxemburgo", "guiné", "santa lúcia", "chipre", "fiji", "dominica", "laos", "eritreia", "belarus", "costa rica", "argentina", "zimbábue", "malta", "bulgária", "papua nova guiné", "holanda", "eslovênia", "mônaco", "turquia", "brunei", "emirados árabes unidos", "tunísia", "mali", "guiné-equatorial", "noruega", "barein", "colômbia", "nauru", "coreia do sul", "coreia do norte", "marrocos", "montenegro", "suíça", "burundi", "egito", "paraguai", "costa do marfim" ]
const GeneralPt = [ "sal grosso", "abafador", "diarista", "barrigudo", "alicate", "elmo", "vatapá", "milho", "pipoca doce", "paraquedas", "assistir", "cavalete", "enxaguar", "lacrimejar", "cereal", "vinho branco", "baleiro", "delineador", "fortalecer", "rosário", "beterraba", "alisar", "amigo", "passeata", "bugio-preto", "bifurcar", "fofocar", "cortador de grama", "doce de leite", "quartel", "abduzir", "corvina", "prender", "macadâmia", "biombo", "batom", "cuco", "comparar", "sorvete napolitano", "bombardear", "skate", "desfilar", "estrela-do-mar", "temperar", "bloquear", "teatro", "granizo", "aerofólio", "churrasco", "coxa de frango", "guirlanda", "bolo", "fatiar", "espada", "trompete", "petit gateau", "afastado", "artéria", "invejoso", "roer", "marceneiro", "internet", "protetor bucal", "acinturado", "estacionamento", "joelho", "linha", "adiantado", "juiz", "digerir", "comediante", "rabanete", "abarrotado", "quieto", "disquete", "salpicão", "cabecear", "lacrar", "furgão", "ourives", "guiar", "ratoeira", "mina", "polaina", "grande", "suco de goiaba", "figo", "bocal", "piranha", "óculos", "ciclismo", "carvão", "costeleta", "rebanho", "doméstica", "colorido", "intestino", "tanque", "átomo", "banheiro", "ferreiro", "alagar", "decorador", "esterilizador", "coroa", "faquir", "encadernador", "aveia", "jabuticaba", "maquiador", "doce de abóbora", "orar", "piorar", "portão", "relicário", "quinoa", "rasurar", "pé de pato", "bambu", "ornitorrinco", "barbante", "gaúcho", "aspargo" ]
const LogosPt = [ "mastercard", "instagram", "lg", "nike", "apple", "deezer", "santander", "abril", "mercedes-benz", "bmw", "hello kitty", "chevrolet", "domino's", "waze", "mercado livre", "microsoft", "reddit", "rolex", "peugeot", "volkswagen", "hering", "bic", "mitsubishi", "pringles", "natura", "carrefour", "hsbc", "adidas", "chanel", "lacoste", "kibon", "firefox", "audi", "android", "shell", "kfc", "bradesco", "pepsi", "banco do brasil", "toyota", "dove", "linux", "whatsapp", "adobe", "mcdonald's", "playstation", "globo", "starbucks", "atari", "spotify", "ferrari", "uol", "toblerone", "puma", "the rolling stones", "motorola", "tesla", "burger king", "google chrome", "dreamworks", "redbull", "twitter" ]
const AnimesPt = [ "king", "kankuro", "izuku midoriya", "sarada uchiha", "squirtle", "diane", "minato", "kakegurui", "noragami", "another", "kakuzu", "dabi", "sailor moon", "zenitsu agatsuma", "mikasa ackerman", "rasengan", "luffy", "asta", "darling in the franxx", "yakusoku no neverland", "norman", "gon freecss", "boruto", "zetsu", "tobirama senju", "barba branca", "death parade", "madara", "goku", "goten", "all might", "tsuyu asui", "bulma", "beyblade", "estarossa", "naruto shippuden", "yu-gi-oh", "konan", "samurai x", "tate no yuusha", "mirai nikki", "death note", "trunks", "pikachu", "made in abyss", "shanks", "cavaleiros do zodíaco", "kushina uzumaki", "natsu dragneel", "silver chariot", "elfen lied", "code geass", "shokugeki no souma", "jojo", "sonic", "armin arlert", "choji akimichi", "jiraya", "sorahiko torino", "zero two", "tony tony chopper", "neon genesis evangelion", "danganronpa", "assassination classroom", "dororo", "fumikage tokoyami", "aerosmith", "fate", "gold experience", "karin uzumaki", "rukia kuchiki", "mob psycho 100", "eri", "charizard", "broly", "hinata", "gohan", "nanatsu no taizai", "tomura shigaraki", "durarara", "kabuto yakushi", "ajin", "vinsmoke sanji", "yato", "narancia ghirga", "koe no katachi", "charlotte", "highschool of the dead", "kirito", "emma", "akira", "bakugan", "freeza" ]
const FoodsEn = [ "rice", "soda", "lemongrass", "dosa", "caramel", "mustard", "nugget", "yogurt", "samosa", "pretzel", "sprite", "salad", "crab", "rosemary", "chocolate", "pomegranate", "baguette", "melon", "dorayaki", "marshmallow", "sweet potato", "brownies", "cinnamon", "oats", "jelly", "coca cola", "mint", "lemon", "pineapple", "lemonade", "tuna", "sugar", "pizza", "mushroom", "tofu", "hazelnut", "fish cake", "waffle", "almond", "peanut butter", "cheese", "guava", "grilled fish", "burrito", "maple syrup", "sour cream", "popcorn", "spaghetti", "smoothie", "cocktail", "lettuce", "cake", "cotton candy", "blueberry", "coconut milk", "meat ball", "vanilla", "sashimi", "plum", "cereal", "shrimp", "curry", "capsicum", "pancake", "crepe", "cauliflower", "mashed potato", "green tea", "fruit cake", "flan", "steak", "biscuit", "peas", "pepper", "pumpkin", "broccoli", "papaya", "star fruit", "noodles", "skittles", "jack fruit", "grape", "watermelon", "croissant", "orange", "salt", "macaroons", "peach", "avocado", "chicken leg", "raisins", "fanta", "cherry", "kebab", "juice", "octopus", "gravy", "tomato", "pani puri", "apple", "garlic", "beer", "ketchup", "cucumber" ]
if(theme==="Foods (pt)"){
    wordsArray(FoodsPt)
}
if(theme==="Foods (tr)"){
    wordsArray(FoodsTr)
}
if(theme==="Minecraft (pt)"){
    wordsArray(MinecraftPt)
}
if(theme==="Objects (pt)"){
    wordsArray(ObjectsPt)
}
if(theme==="Flags (pt)"){
    wordsArray(FlagsPt)
}
if(theme==="General (pt)"){
    wordsArray(GeneralPt)
}
if(theme==="Football (pt)"){
    wordsArray(FootballPt)
}
if(theme==="Logos (pt)"){
    wordsArray(LogosPt)
}
if(theme==="Animes (pt)"){
    wordsArray(AnimesPt)
}
if(theme==="Foods (en)"){
    wordsArray(FoodsEn)
}

                }
                                  if(msg.data.indexOf('42["16"')!=-1 && autoskip===true){
    setTimeout(()=>{
      ws.send('42[25,'+ws.id+']');},1000)

                                  }
                if(msg.data.indexOf('42["47"]')!=-1 && autoreport===true){

      ws.send('42[35,'+ws.id+']')

                }
                if(msg.data.indexOf('42["34"')!=-1){
                    let objlist=JSON.parse('["34"'+msg.data.split('42["34"')[1])
                    var cdd=objlist[1]

                GM_sendMessage('answerinput', cdd, rand());
                    if(autofarm===true){
                                     setTimeout(()=>{
                GM_setValue("answer",cdd+"►"+num(5000))},200)
                    }

                }

                if(msg.data.indexOf('42["26"')!=-1 && autoguess==1){
                    let objlist=JSON.parse('["26"'+msg.data.split('42["26"')[1])
                  let correct = objlist[1]
                GM_setValue("answer",correct+"►"+num(5000))

}

                                 if(msg.data.indexOf('42["16"')!=-1 && autofarm===true){
                    ws.send('42[34,'+ws.id+']')
                                 }

                if(msg.data.indexOf('42["45"')!=-1 && (msg.data.indexOf('"'+botlongID+'",1')!=-1 || msg.data.indexOf(''+botlongID+',1')!=-1) && antikickDelay===0 && antikick===true){

      ws.send('42[24,'+ws.id+']')
                    antikickDelay=1
                    window.postMessage('rejoin','*')
                }
                if(msg.data.indexOf('42["45"')!=-1 && (msg.data.indexOf('"'+botlongID+'",1')!=-1 || msg.data.indexOf(''+botlongID+',1')!=-1) && autokick === true) {
  let msgautokick = msg.data.split(',');
  let autokickid = msgautokick[1].replace(/"/g, '');

                    GM_setValue("kick",autokickid+".."+num(10000))
                }
            }
        })
    });
GM_addValueChangeListener("join",function(I,C,E,b){tojoin=1});
GM_addValueChangeListener("kicknewset",function(I,C,E,b){kicknewstat=E});
GM_addValueChangeListener("kickjoinset",function(I,C,E,b){kickjoinstat=E});
GM_addValueChangeListener("autoreport",function(I,C,E,b){autoreport=E});
GM_addValueChangeListener("autoskip",function(I,C,E,b){autoskip=E});
GM_addValueChangeListener("antikick",function(I,C,E,b){antikick=E});
GM_addValueChangeListener("autokick",function(I,C,E,b){autokick=E});
GM_addValueChangeListener("antiafk",function(I,C,E,b){antiafk=E});
GM_addValueChangeListener("autoguess",function(I,C,E,b){autoguess=E});
GM_addValueChangeListener("autofarm",function(I,C,E,b){autofarm=E});
    window.addEventListener("beforeunload",()=>{
        GM_setValue("botçıkar",window.location.href.split("/")[2]+"--"+rand())
    })})
}

    if(window.location.href.indexOf("gartic.io")!=-1){let red=["#cc0010","#a3000c","#820009","#680007","#530005","#FFFFFF"],orange=["#cc5b00","#a34800","#FFA500","#682d00","#532400","#FFFFFF"],yellow=["#ccbf00","#a39800","#FFFF00","#686000","#534c00","#000000"],green=["#66cc00","#51a300","#408200","#336800","#285300","#FFFFFF"],blue=["#2100cc","#1a00a3","#140082","#100068","#0c0053","#FFFFFF"],indigo=["#3c0068","#300053","#260042","#1e0034","#180029","#FFFFFF"],violet=["#6500cc","#5000a3","#400082","#330068","#280053","#FFFFFF"],pink=["#eb8898","#a33058","#FFC0CB","#681e38","#53182c","#FFFFFF"],crimson=["#b01030","#8c0c26","#70091e","#590718","#470513","#FFFFFF"],brown=["#793000","#602600","#4c1e00","#3c1800","#301300","#FFFFFF"],gray=["#787878","#606060","#4c4c4c","#3c3c3c","#303030","#FFFFFF"],white=["#cccccc","#a3a3a3","#FFFFFF","#686868","#535353","#000000"],black=["#191919","#141414","#101010","#0c0c0c","#090909","#80FF00"],magenta=["#cc00cc","#a300a3","#820082","#680068","#530053","#FFFFFF"];function colorChanger($){let e=[];switch($){case"red":e=red;break;case"orange":e=orange;break;case"yellow":e=yellow;break;case"green":e=green;break;case"blue":e=blue;break;case"indigo":e=indigo;break;case"violet":e=violet;break;case"pink":e=pink;break;case"crimson":e=crimson;break;case"brown":e=brown;break;case"gray":e=gray;break;case"white":e=white;break;case"black":e=black;break;case"magenta":e=magenta}let c=document.querySelectorAll(".icebot button"),o=document.querySelectorAll(".icebot"),r=document.querySelector(".option"),l=document.querySelectorAll(".option button"),a=document.querySelectorAll(".userlist"),t=document.querySelectorAll('.userlist input[type="submit"]'),F=document.querySelectorAll('.icebot input[type="range"]'),n=document.querySelectorAll(".icebot h2"),s=document.querySelectorAll('.icebot input[type="submit"]');n.forEach($=>{$.style.color=e[5]}),r.style.backgroundColor=e[2],F.forEach($=>{$.style.accentColor=e[0]}),o.forEach($=>{$.style.backgroundColor=e[2]}),c.forEach($=>{$.style.backgroundColor=e[0],$.style.color=e[5]}),l.forEach($=>{$.style.backgroundColor=e[0],$.style.color=e[5]}),s.forEach($=>{$.style.backgroundColor=e[0],$.style.color=e[5]}),a.forEach($=>{$.style.backgroundColor=e[2],$.style.color=e[5]}),t.forEach($=>{$.style.backgroundColor=e[0],$.style.color=e[5]});let b=document.querySelectorAll(".option button");document.querySelectorAll(".option button svg").forEach($=>{$.style.stroke=e[5]}),b.forEach($=>{$.addEventListener("mouseover",function(){this.style.background=e[4]}),$.addEventListener("mouseout",function(){this.style.background=e[0]})})}function setmenu(menu){const elements=['#icebot1','#icebot2','#icebot3','#icebot4',"#icebot5","#icebot6",'#avatarlist'];elements.forEach(element=>{if(element===`#${menu}`){f(element).style.display='block';}else{f(element).style.display='none';}})};
const addItem = (arr, ...arguments) => { for (let i = 0; i < arguments.length; i++) { arr[arr.length] = arguments[i]; } return arr; };
function xmv() { const userAgent = navigator.userAgent.toLowerCase(); const dM = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']; for (let d of dM) {if (userAgent.includes(d)) { function x(){ let ice = document.querySelectorAll(".icebot");let optionBtn= document.querySelectorAll(".option button");let option= document.querySelectorAll(".option");ice.forEach(icebot=>{icebot.style.width="220px";icebot.style.left="110px"});option.forEach(option=>{option.style.left="180px";option.style.top="600px";option.style.width="320px";option.style.height="auto";});optionBtn.forEach(option=>{option.style.width="13%"});setTimeout(()=>{document.querySelector("#avatarlist").style.width="360px";document.querySelector("#avatarlist").style.left="187px"},200) };x();}}};setTimeout(()=>{xmv();},200)
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
        f("#icebot4").innerHTML+=`<h2 class="customkick" id="customkick.`+user.user+`">`+user.user+`</h2>
    <input type="submit" class="customkickremove" id="customkickuser.`+user.user+`" onclick="window.postMessage('customkickremove.`+user.user+`','*')" value="remove">`
        addItem(customkickitems, user.user)
            },3000)
        })
}
           let msgjoin = localStorage.getItem("messagejoin");
if (!msgjoin) {
  localStorage.setItem("messagejoin", "[]");
}


if (msgjoin) {
    let list=JSON.parse(localStorage.getItem("messagejoin"))

        list.forEach(item=>{
            setTimeout(()=>{
    f("#icebot5").innerHTML += `<h2 class="msgjoinvalue" id="msgjoinvalue.` + item.msg + `">` + item.msg + `</h2>
    <input type="submit" class="msgjoinremove" id="msgjoin.` + item.msg + `" onclick="window.postMessage('messagejoinremove.` + item.msg + `','*')" value="remove">`
        addItem(customkickitems, item.msg)
            },3000)
        })
}
   let avataritem = localStorage.getItem("avatar");
if (!avataritem) {
  localStorage.setItem("avatar", 1);
  avatar=1
}
        if (avataritem=='null') {setTimeout(()=>{
f("#avatar").src = "https://garticphone.com/images/avatar/31.svg";},1000)
        }
     let botnickitem = localStorage.getItem("botnick");
if (!botnickitem) {
  localStorage.setItem("botnick", "0");
}
     let nickitem = localStorage.getItem("nick");
if (!nickitem) {
  localStorage.setItem("nick", "ICEbot");
}
     let theme = localStorage.getItem("theme");
if (theme) {setTimeout(()=>{colorChanger(theme)},300)
}
window.addEventListener("message",(msg)=>{
if(msg.data=="rainbowdraw"){if(f('#rainbowdraw').checked){
        rainbowdrawmode=true
              var colors = ["FF0013", "FF7829", "FFF73F", "00FF4D", "00D9A3", "85B200", "008D26", "0017F6", "052C6C", "26C9FF", "FFC926", "B0701C", "666666", "AAAAAA", "FFFFFF", "000000", "99004E", "FF008F", "8000FF", "FEAFA8", "A9230C"];
var index = 0;

rainbowdraw=setInterval(() => {
    var color = colors[index];
    window.wsObj.send('42[10,' + window.wsObj.id + ',[5,"x' + color + '"]]');
    index = (index + 1) % colors.length;
}, 300);
    }else{
        rainbowdrawmode=false
        clearInterval(rainbowdraw)

    }}
            if(msg.data.indexOf("color.")!=-1){
 let color = event.data.split("color.")[1];localStorage.setItem("theme",color)
                colorChanger(color)
            }
    if(msg.data=="mimicmode"){if(f("#mimicmode").checked){localStorage.setItem("mimic",'true')} else {localStorage.setItem("mimic",'false') }}

        if(msg.data=="autoguess"){
        let autoguessMS=f(".autoguessrange").value
        f("#autoguessms").innerText='AUTO GUESS VALUE: ' + autoguessMS
        localStorage.setItem("autoguess",autoguessMS)
        }
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
    if(msg.data=="nick"){
            localStorage.setItem("nick",f("#botnick").value)
    }
    if(msg.data=="botnick0"){
botnick=0
localStorage.setItem("botnick",0)
}
    if(msg.data=="botnick1"){
botnick=1
localStorage.setItem("botnick",1)
    }
    if(msg.data=="showavatarlist"){
        f("#icebot1").style.display="none"
        f("#avatarlist").style.display="block"
    }
    if(msg.data=="hideavatarlist"){
        f("#icebot1").style.display="block"
        f("#avatarlist").style.display="none"
    }

     if(msg.data=="avatar0"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/0.svg";
avatar=0
localStorage.setItem("avatar",0)
     }
     if(msg.data=="avatar1"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/1.svg";
avatar=1
localStorage.setItem("avatar",1)
     }
     if(msg.data=="avatar2"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/2.svg";
avatar=2
localStorage.setItem("avatar",2)
     }
     if(msg.data=="avatar3"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/3.svg";
avatar=3
localStorage.setItem("avatar",3)
     }
     if(msg.data=="avatar4"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/4.svg";
avatar=4
localStorage.setItem("avatar",4)
     }
     if(msg.data=="avatar5"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/5.svg";
avatar=5
localStorage.setItem("avatar",5)
     }
     if(msg.data=="avatar6"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/6.svg";
avatar=6
localStorage.setItem("avatar",6)
     }
     if(msg.data=="avatar7"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/7.svg";
avatar=7
localStorage.setItem("avatar",7)
     }
     if(msg.data=="avatar8"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/8.svg";
avatar=8
localStorage.setItem("avatar",8)
     }
     if(msg.data=="avatar9"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/9.svg";
avatar=9
localStorage.setItem("avatar",9)
     }
     if(msg.data=="avatar10"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/10.svg";
avatar=10
localStorage.setItem("avatar",10)
     }
     if(msg.data=="avatar11"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/11.svg";
avatar=11
localStorage.setItem("avatar",11)
     }
     if(msg.data=="avatar12"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/12.svg";
avatar=12
localStorage.setItem("avatar",12)
     }
     if(msg.data=="avatar13"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/13.svg";
avatar=13
localStorage.setItem("avatar",13)
     }
     if(msg.data=="avatar14"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/14.svg";
avatar=14
localStorage.setItem("avatar",14)
     }
     if(msg.data=="avatar15"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/15.svg";
avatar=15
localStorage.setItem("avatar",15)
     }
     if(msg.data=="avatar16"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/16.svg";
avatar=16
localStorage.setItem("avatar",16)
     }
     if(msg.data=="avatar17"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/17.svg";
avatar=17
localStorage.setItem("avatar",17)
     }
     if(msg.data=="avatar18"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/18.svg";
avatar=18
localStorage.setItem("avatar",18)
     }
     if(msg.data=="avatar19"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/19.svg";
avatar=19
localStorage.setItem("avatar",19)
     }
     if(msg.data=="avatar20"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/20.svg";
avatar=20
localStorage.setItem("avatar",20)
     }
     if(msg.data=="avatar21"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/21.svg";
avatar=21
localStorage.setItem("avatar",21)
     }
     if(msg.data=="avatar22"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/22.svg";
avatar=22
localStorage.setItem("avatar",22)
     }
     if(msg.data=="avatar23"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/23.svg";
avatar=23
localStorage.setItem("avatar",23)
     }
     if(msg.data=="avatar24"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/24.svg";
avatar=24
localStorage.setItem("avatar",24)
     }
     if(msg.data=="avatar25"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/25.svg";
avatar=25
localStorage.setItem("avatar",25)
     }
     if(msg.data=="avatar26"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/26.svg";
avatar=26
localStorage.setItem("avatar",26)
     }
     if(msg.data=="avatar27"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/27.svg";
avatar=27
localStorage.setItem("avatar",27)
     }
     if(msg.data=="avatar28"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/28.svg";
avatar=28
localStorage.setItem("avatar",28)
     }
     if(msg.data=="avatar29"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/29.svg";
avatar=29
localStorage.setItem("avatar",29)
     }
     if(msg.data=="avatar30"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/30.svg";
avatar=30
localStorage.setItem("avatar",30)
     }
     if(msg.data=="avatar31"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/31.svg";
avatar=31
localStorage.setItem("avatar",31)
     }
     if(msg.data=="avatar32"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/32.svg";
avatar=32
localStorage.setItem("avatar",32)
     }
     if(msg.data=="avatar33"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/33.svg";
avatar=33
localStorage.setItem("avatar",33)
     }
     if(msg.data=="avatar34"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/34.svg";
avatar=34
localStorage.setItem("avatar",34)
     }
     if(msg.data=="avatar35"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/35.svg";
avatar=35
localStorage.setItem("avatar",35)
     }
     if(msg.data=="avatar36"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/36.svg";
avatar=36
localStorage.setItem("avatar",36)
     }
     if(msg.data=="avatarnull"){
f("#avatar").src = "https://garticphone.com/images/avatar/31.svg";
avatar=null
localStorage.setItem("avatar",null)
     }
    if(msg.data=="hidemenu"){setmenu('none')}
    if(msg.data=="menu1"){setmenu('icebot1')}
    if(msg.data=="menu2"){setmenu('icebot2')}
    if(msg.data=="menu3"){setmenu('icebot3')}
    if(msg.data=="menu4"){setmenu('icebot4')}
    if(msg.data=="menu5"){setmenu('icebot5')}
    if(msg.data=="menu6"){setmenu('icebot6')}

        if(msg.data=="customkickadd"){
 const value = f("#kicklistinput").value;
var customkicklist = localStorage.getItem("customkick");
if (!customkicklist.includes(value) && !customkickitems.includes(value)) {
  customkickitems.push(value);
  let customkickitem = JSON.parse(localStorage.getItem("customkick"));
  if (customkickitem.findIndex(item => item.user === value) === -1) {
    customkickitem.push({ "user": value });
    localStorage.setItem("customkick", JSON.stringify(customkickitem));
    f("#icebot4").innerHTML += `<h2 class="customkick" id="customkick.` + value + `">` + value + `</h2>
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
var indexz = customkickitems.indexOf(value);
if (indexz > -1) {
  customkickitems.splice(indexz, 1);
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
    if(msg.data=="messagejoinadd"){
 const value = f("#msgjointext").value;
var messagelist = localStorage.getItem("messagejoin");
if (!messagelist.includes(value) && !messagejoinitems.includes(value)) {
  messagejoinitems.push(value);
  let custommsgitem = JSON.parse(localStorage.getItem("messagejoin"));
  if (custommsgitem.findIndex(item => item.msg === value) === -1) {
    custommsgitem.push({ "msg": value });
    localStorage.setItem("messagejoin", JSON.stringify(custommsgitem));
    f("#icebot5").innerHTML += `<h2 class="msgjoinvalue" id="msgjoinvalue.` + value + `">` + value + `</h2>
    <input type="submit" class="msgjoinremove" id="msgjoin.` + value + `" onclick="window.postMessage('messagejoinremove.` + value + `','*')" value="remove">`
  }
}
    }

        if(msg.data=="messagejoinremoveall"){
var elementsCustomMessage = document.querySelectorAll('[id*="msgjoinvalue."]');
var elementsCustomMessageJoin = document.querySelectorAll('[id*="msgjoin."]');
function deleteElement(element) {
  element.parentNode.removeChild(element);
}
elementsCustomMessage.forEach(function(element) {
  deleteElement(element);
});
elementsCustomMessageJoin.forEach(function(element) {
  deleteElement(element);

})
      localStorage.setItem("messagejoin","[]")
      messagejoinitems=[]
        }
       if(msg.data.indexOf("messagejoinremove.")!=-1){
 let message = event.data.split("messagejoinremove.")[1];
let storage = JSON.parse(localStorage.getItem("messagejoin"));

if (storage && Array.isArray(storage)) {
  for (let i = 0; i < storage.length; i++) {
    if (storage[i].msg === message) {
      storage.splice(i, 1);
      break;
    }
  }

  localStorage.setItem("messagejoin", JSON.stringify(storage));
let value = message;
let index = messagejoinitems.indexOf(value);
if (index > -1) {
  messagejoinitems.splice(index, 1);
}
}
      let msgjointext= document.getElementById("msgjoinvalue."+message)
      let msgjoinremovebtn= document.getElementById("msgjoin."+message)
      msgjointext.remove()
      msgjoinremovebtn.remove()

       }
})
    let readyc=0,botc=0,otoeven=0,roomusers=[]

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
        switch(localStorage.getItem("theme")){
            case 'white':case 'yellow':
        roomusers.forEach(user=>{
            user.nick.split("‏").join("")!="ICEbot"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" style="background-color:`+localStorage.getItem("theme")+`;color:black;" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
        }); break;
            case 'red':case 'orange': case 'green': case 'blue': case 'indigo': case 'violet': case 'pink': case 'crimson': case 'brown': case 'gray': case 'black': case 'magenta':roomusers.forEach(user=>{
            user.nick.split("‏").join("")!="ICEbot"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" style="background-color:`+localStorage.getItem("theme")+`;color:white;" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
        });
                break;
            default:
        roomusers.forEach(user=>{
            user.nick.split("‏").join("")!="ICEbot"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
        })
        }

    }

    window.eventAdd=()=>{
        if(!setTrue){
            setTrue=1
               window.wsObj.send = function(data) {
         if(data.indexOf('42[11')!=-1 && localStorage.getItem("mimic")==='true'){
                let objlist=JSON.parse('[11'+data.split('42[11')[1])
                let msg = objlist[2]
                GM_setValue("msg",msg+"►"+num(5000))
  }
                   if(data.indexOf('42[13')!=-1 && localStorage.getItem("mimic")==='true'){
                let objlist=JSON.parse('[13'+data.split('42[13')[1])
                let answer = objlist[2]
                GM_setValue("answer",answer+"►"+num(5000))
                   }
                   if(data.indexOf('42[35')!=-1 && localStorage.getItem("mimic")==='true'){
            GM_setValue('report', num(5000));

         }
                   if(data.indexOf('42[24')!=-1 && localStorage.getItem("mimic")==='true'){
            GM_setValue('exit', num(5000));
                   }
                   if(data.indexOf('42[34')!=-1 && rainbowdrawmode===true){
                  var colors = ["FF0013", "FF7829", "FFF73F", "00FF4D", "00D9A3", "85B200", "008D26", "0017F6", "052C6C", "26C9FF", "FFC926", "B0701C", "666666", "AAAAAA", "FFFFFF", "000000", "99004E", "FF008F", "8000FF", "FEAFA8", "A9230C"];
var index = 0;

rainbowdraw=setInterval(() => {
    var color = colors[index];
    window.wsObj.send('42[10,' + window.wsObj.id + ',[5,"x' + color + '"]]');
    index = (index + 1) % colors.length;
}, 300);
                   }
if(data.indexOf('42[25')!=-1){
    clearInterval(rainbowdraw)
    console.log("pulou")

}
  originalSend.apply(this, arguments);
               }

            window.wsObj.addEventListener("message",(msg)=>{

                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    objlist[5].forEach(item=>{roomusers.push(item)})
                    window.wsObj.longID=objlist[1]
                    window.wsObj.id=objlist[2]
                    updatespeckicks()
                }
                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    roomusers.push(user)
                    updatespeckicks()
if (customkickitems.includes(user.nick)) {
                    GM_setValue("kick",user.id+".."+num(10000))
}
                }
                if(msg.data.indexOf('42["24"')!=-1){
                    let user=msg.data.split(",")[1].split('"')[1]
                    for(let i=0;i<roomusers.length;i++){
                        typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0
                    }
                    updatespeckicks()
                }
                if(msg.data.indexOf('42["38"')!=-1){
                 clearInterval(rainbowdraw)
                 console.log("denunciado")
                }
                if(msg.data.indexOf('42["28"')!=-1){
                 clearInterval(rainbowdraw)
                 console.log("acertaram")
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
    <button class="hidemenu" onclick="window.postMessage('hidemenu','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></button>
    <button class="menu1" onclick="window.postMessage('menu1','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></button>
    <button class="menu2" onclick="window.postMessage('menu2','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/></svg></button>
    <button class="menu3" onclick="window.postMessage('menu3','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button>
    <button class="menu4" onclick="window.postMessage('menu4','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg></button>
    <button class="menu5" onclick="window.postMessage('menu5','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></button>
    <button class="menu6" onclick="window.postMessage('menu6','*')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>
    </div>

    <div id="avatarlist" class="icebot">
    <input type="submit" class="hideavatarlist" onclick="window.postMessage('hideavatarlist','*')" value="CLOSE">
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/0.svg" class="selectedavatar" onclick="window.postMessage('avatar0','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/1.svg" class="selectedavatar" onclick="window.postMessage('avatar1','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/2.svg" class="selectedavatar" onclick="window.postMessage('avatar2','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/3.svg" class="selectedavatar" onclick="window.postMessage('avatar3','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/4.svg" class="selectedavatar" onclick="window.postMessage('avatar4','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/5.svg" class="selectedavatar" onclick="window.postMessage('avatar5','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/6.svg" class="selectedavatar" onclick="window.postMessage('avatar6','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/7.svg" class="selectedavatar" onclick="window.postMessage('avatar7','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/8.svg" class="selectedavatar" onclick="window.postMessage('avatar8','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/9.svg" class="selectedavatar" onclick="window.postMessage('avatar9','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/10.svg" class="selectedavatar" onclick="window.postMessage('avatar10','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/11.svg" class="selectedavatar" onclick="window.postMessage('avatar11','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/12.svg" class="selectedavatar" onclick="window.postMessage('avatar12','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/13.svg" class="selectedavatar" onclick="window.postMessage('avatar13','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/14.svg" class="selectedavatar" onclick="window.postMessage('avatar14','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/15.svg" class="selectedavatar" onclick="window.postMessage('avatar15','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/16.svg" class="selectedavatar" onclick="window.postMessage('avatar16','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/17.svg" class="selectedavatar" onclick="window.postMessage('avatar17','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/18.svg" class="selectedavatar" onclick="window.postMessage('avatar18','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/19.svg" class="selectedavatar" onclick="window.postMessage('avatar19','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/20.svg" class="selectedavatar" onclick="window.postMessage('avatar20','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/21.svg" class="selectedavatar" onclick="window.postMessage('avatar21','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/22.svg" class="selectedavatar" onclick="window.postMessage('avatar22','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/23.svg" class="selectedavatar" onclick="window.postMessage('avatar23','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/24.svg" class="selectedavatar" onclick="window.postMessage('avatar24','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/25.svg" class="selectedavatar" onclick="window.postMessage('avatar25','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/26.svg" class="selectedavatar" onclick="window.postMessage('avatar26','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/27.svg" class="selectedavatar" onclick="window.postMessage('avatar27','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/28.svg" class="selectedavatar" onclick="window.postMessage('avatar28','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/29.svg" class="selectedavatar" onclick="window.postMessage('avatar29','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/30.svg" class="selectedavatar" onclick="window.postMessage('avatar30','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/31.svg" class="selectedavatar" onclick="window.postMessage('avatar31','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/32.svg" class="selectedavatar" onclick="window.postMessage('avatar32','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/33.svg" class="selectedavatar" onclick="window.postMessage('avatar33','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/34.svg" class="selectedavatar" onclick="window.postMessage('avatar34','*')"></button>
</div>
<div class="avatarbtn">
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/35.svg" class="selectedavatar" onclick="window.postMessage('avatar35','*')"></button>
<button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/36.svg" class="selectedavatar" onclick="window.postMessage('avatar36','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://garticphone.com/images/avatar/31.svg" class="selectedavatar" onclick="window.postMessage('avatarnull','*')"></button></div>
<br>
    </div>
    <div id="icebot1" class="icebot">
    <h2 style="color:white;">ICEbot V5</h2>
    <div class="roomlink"><input type="text" id="roomlink" placeholder="Room link"><input type="submit" id="join" onclick="window.postMessage('join','*')" value="JOIN"></div>
    <div class="botnick"><input type="text" id="botnick" oninput="window.postMessage('nick','*')" placeholder="Bot nick" value="`+localStorage.getItem("nick")+`"></div>
    <input type="submit" class="botnick0" onclick="window.postMessage('botnick0','*')" value="Bot nick 1">
    <input type="submit" class="botnick1" onclick="window.postMessage('botnick1','*')" value="Bot nick 2 (random)"><br>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/`+localStorage.getItem("avatar")+`.svg" id="avatar" class="selectedavatar">
    <input type="submit" class="chooseavatar" onclick="window.postMessage('showavatarlist','*')" value="CHOOSE AVATAR">
    </div>
    <div id="icebot2" class="icebot" style="display:none;"><div class="broadcastbox"><input type="text" id="broadcast" placeholder="Broadcast"><button class="broadcastbtn" onclick="window.postMessage('broadcast','*')" value="Broadcast"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="msgbox"><input type="text" id="message" placeholder="Message"><button class="msgbtn" onclick="window.postMessage('chat','*')" value="Message"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="answerbox"><input type="text" id="answer" placeholder="Answer"><button class="answerbtn" onclick="window.postMessage('answer','*')" value="Answer"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <input type="submit" class="exit" style="background:red;" onclick="window.postMessage('exit','*')" value="EXIT">
    <input type="submit" class="kickall" onclick="window.postMessage('kickall','*')" value="KICK ALL">
    <input type="submit" class="report" onclick="window.postMessage('report','*')" value="REPORT">
    <input type="submit" class="rejoin" onclick="window.postMessage('rejoin','*')" value="REJOIN">
    <input type="submit" class="jump" onclick="window.postMessage('jump','*')" value="JUMP">
    <input type="submit" class="reconnect" onclick="window.postMessage('reconnect','*')" value="RECONNECT">
    <input type="submit" class="acceptdraw1" onclick="window.postMessage('acceptdraw1','*')" value="DRAW 1">
    <input type="submit" class="acceptdraw2" onclick="window.postMessage('acceptdraw2','*')" value="DRAW 2">
    <input type="submit" class="tips" onclick="window.postMessage('tips','*')" value="TIPS"><br>
    <h2 class="roomconsole"></h2><span><h2 class="roomtheme"></h2></span></div>
    <div id="icebot3" class="icebot">
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
    <div id="icebot4" class="icebot">
    <h2 class="customkick">Custom kick</h2>
    <div class="kicklistbox">
    <input type="text" id="kicklistinput" placeholder="Player name">
    <input type="submit" id="kicklistaddbtn" onclick="window.postMessage('customkickadd','*')" value="add">
</div>
    <input type="submit" id="kicklistremoveallbtn" onclick="window.postMessage('customkickremoveall','*')" value="remove all">
    </div>
    <div id="icebot5" class="icebot"><h2>Message when bots join room</h2>
    <div class="msgboxjoin"><input type="text" id="msgjointext" placeholder="Message"><button class="answerbtn" onclick="window.postMessage('messagejoinadd','*')" value="add">add</button></div>
    <input type="submit" class="msgjoinremoveall" onclick="window.postMessage('messagejoinremoveall','*')" value="remove all"></div>
    <div id="icebot6" class="icebot" style="display:none;height:300px;"><h2>Options</h2>
<h2 id="swtext" style="top:40px;left:10px;position:absolute;">Auto report &nbsp;</h2><label class="switch" style="top:10px;left:150px"><input type="checkbox" id="autoreport"><span class="slider round"></span></label>
<h2 id="swtext" style="top:80px;left:10px;position:absolute;">Auto skip &nbsp;</h2><label class="switch" style="top:16px;left:150px"><input type="checkbox" id="autoskip"><span class="slider round"></span></label>
<h2 id="swtext" style="top:120px;left:10px;position:absolute;">Anti kick &nbsp;</h2><label class="switch" style="top:22px;left:150px"><input type="checkbox" id="antikick"><span class="slider round"></span></label>
<h2 id="swtext" style="top:160px;left:10px;position:absolute;">Anti afk &nbsp;</h2><label class="switch" style="top:28px;left:150px"><input type="checkbox" id="antiafk"><span class="slider round"></span></label>
<h2 id="swtext" style="top:200px;left:10px;position:absolute;">Auto kick &nbsp;</h2><label class="switch" style="top:34px;left:150px"><input type="checkbox" id="autokick"><span class="slider round"></span></label>
<h2 id="swtext" style="top:240px;left:10px;position:absolute;">Auto farm &nbsp;</h2><label class="switch" style="top:40px;left:150px"><input type="checkbox" id="autofarm"><span class="slider round"></span></label>
<h2 id="swtext" style="top:280px;left:10px;position:absolute;">Auto guess &nbsp;</h2><label class="switch" style="top:46px;left:150px"><input type="checkbox" id="autoguess" onchange="window.postMessage('autoguess','*')"><span class="slider round"></span></label><h2 class="autoguessvalue" id="autoguessms" style="top:320px;position:absolute;"></h2><input class="autoguessrange" style="top:360px;left:60px;position:absolute;" type="range" oninput="postMessage('autoguess')" min="130" max="10000">
<h2 id="swtext" style="top:390px;left:10px;position:absolute;">Mimic mode &nbsp;</h2><label class="switch" style="top:120px;left:150px"><input type="checkbox" id="mimicmode" onchange="window.postMessage('mimicmode','*')"><span class="slider round"></span></label>
<h2 id="swtext" style="top:430px;left:10px;position:absolute;">Rainbow draw &nbsp;</h2><label class="switch" style="top:126px;left:150px"><input type="checkbox" id="rainbowdraw" onchange="window.postMessage('rainbowdraw','*')"><span class="slider round"></span></label>
<h2 style="top:470px;left:50px;position:absolute;">GUI theme color</h2>
    <input type="submit" style="top:500px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.red','*')" value="RED">
    <input type="submit" style="top:500px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.orange','*')" value="ORANGE">
    <input type="submit" style="top:540px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.yellow','*')" value="YELLOW">
    <input type="submit" style="top:540px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.green','*')" value="GREEN">
    <input type="submit" style="top:580px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.blue','*')" value="BLUE">
    <input type="submit" style="top:580px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.indigo','*')" value="INDIGO">
    <input type="submit" style="top:620px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.violet','*')" value="VIOLET">
    <input type="submit" style="top:620px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.pink','*')" value="PINK">
    <input type="submit" style="top:660px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.crimson','*')" value="CRIMSON">
    <input type="submit" style="top:660px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.brown','*')" value="BROWN">
    <input type="submit" style="top:700px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.gray','*')" value="GRAY">
    <input type="submit" style="top:700px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.white','*')" value="WHITE">
    <input type="submit" style="top:740px;left:20px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.black','*')" value="BLACK">
    <input type="submit" style="top:740px;left:130px;position:absolute;" class="colorthemesbtn1" onclick="window.postMessage('color.magenta','*')" value="MAGENTA">
    <input type="submit" style="top:780px;left:50px;position:absolute;" class="colorthemesbtn2" onclick="javascript:location.reload();localStorage.removeItem('theme')" value="RESET THEME">
</div>
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
            position:fixed;left:14%;top:20px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto;width:40px;
        }

        .option input[type=submit],.option button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .option input[type=checkbox]{margin-top:2px;}
        .option input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        .option button:hover{background:#ccad00;transition:0.2s;}
        .option button:hover svg {stroke: #9e6e1c;}
        .option button{width:90%;}

        .icebot *{box-sizing:border-box;}
        #avatarlist {

            overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;
            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:50px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:400px;
        .avatarbtn{display:flex;align-items:center;justify-content:center;}
        .avatarbtn button,.avatarbtn button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:50px;font-size:11pt;margin-top:5px;}
        .avatarbtn button:hover{background:#ccad00;transition:0.2s;}

        }
        #icebot1,#icebot2,#icebot6 {

            overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;
            display:block;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:20px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block;height:auto;width:240px;;


        }
        #icebot3 {

            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:20px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:240px;;
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
        #icebot4 {

            overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;
            display:none;text-align:center;opacity:none;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:20px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:240px;;


        .kicklistbox{display:flex;align-items:center;justify-content:center;}
        .kicklistbox input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .kicklistbox input[type=submit],.kicklistbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .kicklistbox input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        #kicklistaddbtn{width:40%;}
        #kicklistremoveallbtn{width:40%;}
        .customkickremove{width:30%;}
        .customkick{margin-top:3px; text-align:center; color:#FFD700; font-size:17px;}
        }
        #icebot5 {

            display:none;text-align:center;opacity:none;overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;font-size:10pt;color:#FFD700;
            position:fixed;left:28%;top:20px;padding:5px 3px !important;margin:0px;background:#333333;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:240px;;
        .autoguess{width:40%;}
        #autoguessenable{align-items:center;justify-content:center;}
        #autoguessdisable{display:none;align-items:center;justify-content:center;}

        .autoguessstyle{display:flex;align-items:center;justify-content:center;}
        .mimicmode{width:40%;}
        #mimicmodeenabled{align-items:center;justify-content:center;}
        #mimicmodedisabled{display:none;align-items:center;justify-content:center;}
        .mimicmodestyle{display:flex;align-items:center;justify-content:center;}

        .rainbowdraw{width:30%;}
        #rainbowdrawenabled{align-items:center;justify-content:center;}
        #rainbowdrawdisabled{display:none;align-items:center;justify-content:center;}
        .rainbowdrawstyle{display:flex;align-items:center;justify-content:center;}
        .msgjoinremoveall{width:40%;}
        }


        .icebot input[type=submit],.icebotbtn button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .icebot input[type=checkbox]{margin-top:2px;}
        .icebot input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        .icebot input[type=range]{accent-color:#FFD700;}
        .icebot input[type=range]:focus::-webkit-slider-runnable-track { background: #3071A9; }


        #join{width:20%;}
        .roomlink{display:flex;align-items:center;justify-content:center;}
        .roomlink input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .roomlink input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .roomlink button:hover{background:#ccad00;transition:0.2s;}
        .botnick input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
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

        .msgboxjoin{display:flex;align-items:center;justify-content:center;}
        .msgboxjoin input[type=text]{margin-top:4px !important;width:75% !important;height:23px !important;}
        .msgboxjoin input[type=submit],.msgboxjoin button{cursor:pointer;border:none;background:#FFD700;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .msgboxjoin button:hover{background:#ccad00;transition:0.2s;}


        .botnick0{width:80%;}
        .botnick1{width:80%;}
        .chooseavatar{width:80%;}
        .broadcastbtn{width:20%;},.broadcastbtn input[type=submit]:hover{background:#ccad00;transition:0.2s;}
        .msgbtn{width:20%;}
        .answerbtn{width:20%;}
        .report{width:40%;}
        .kickall{width:40%;}
        .jump{width:40%;}

        .exit{width:40%;}
        .rejoin{width:40%;}
        .reconnect{width:40%;}
        .acceptdraw1{width:40%;}
        .acceptdraw2{width:40%;}
        .tips{width:40%;}
        .autoreport input[type=checkbox]{margin-top:32px}
        .autoskip{margin-top:32px;}
        .antikick{margin-top:32px;}
        .antiafk{margin-top:32px;}
        .autokick{margin-top:32px;}

        .roomconsole{margin-top:3px; text-align:left; color:#FFD700; font-size:17px;}
        .roomtheme{margin-top:3px; text-align:left; color:#FFD700; font-size:17px;}
.switch {
  position: relative;
  display: block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .1s;
  transition: .1s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .1s;
  transition: .1s;
}

input:checked + .slider {
  background-color: #FFD700;
}

input:focus + .slider {
  box-shadow: 0 0 1px #FFD700;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
        .colorthemesbtn1{width:40%;}
        .colorthemesbtn2{width:60%;}


    `;
        GM_addStyle(css);
        f(".kickallwhenjoin").addEventListener("click",()=>{
            GM_setValue("kicknewset",f(".kickallwhenjoin").checked)
        })
        f(".kickonjoin").addEventListener("click",()=>{
            GM_setValue("kickjoinset",f(".kickonjoin").checked)
        })
        f("#autoreport").addEventListener("click",()=>{
            GM_setValue("autoreport",f("#autoreport").checked);console.log(1)
        })
        f("#autoskip").addEventListener("click",()=>{
            GM_setValue("autoskip",f("#autoskip").checked)
        })
        f("#antikick").addEventListener("click",()=>{
            GM_setValue("antikick",f("#antikick").checked)
        })
        f("#autokick").addEventListener("click",()=>{
            GM_setValue("autokick",f("#autokick").checked)
        })
        f("#antiafk").addEventListener("click",()=>{
            GM_setValue("antiafk",f("#antiafk").checked)
        })
        f("#autofarm").addEventListener("click",()=>{
            GM_setValue("autofarm",f("#autofarm").checked)
        })
        f("#autoguess").addEventListener("click",()=>{
            GM_setValue("autoguess",f("#autoguess").checked)
        })
        GM_onMessage("rejoin", (_, __) => {
        window.postMessage('join','*')
        });
    }
    window.addEventListener("message",function(event){
        if(typeof(event.data)==="string"){
            if(event.data=="join"){
                f("#roomlink").value==""?f("#roomlink").value=window.location.href:0
                botc=0;GM_setValue("resetcount",rand())
                readyc=0
           let msgstorage = localStorage.getItem("messagejoin");
                if(msgstorage & "1" == "0"){let vm=JSON.parse(msgstorage); setTimeout(()=>{vm.forEach(item=>{
                GM_setValue("msg",item.msg+"►"+num(5000))
                })},4000)
                           }
            GM_sendMessage("join",f("#roomlink").value.split("/")[3],f("#botnick").value,avatar,localStorage.getItem("botnick"),f(".kickonjoin").checked,JSON.parse(localStorage.getItem("messagejoin")),rand())

            }
            if(event.data.indexOf("kickuser.")!=-1){
                let userid=event.data.split("kickuser.")[1]
                GM_setValue("kick",userid+".."+num(10000))
                GM_sendMessage("cmd",'kick',userid+".."+num(10000))
            }

        if(event.data=="broadcast"){
                GM_setValue("broadcast",f("#broadcast").value+"►"+num(5000))
            GM_sendMessage('cmd', 'broadcast',f("#broadcast").value,num(5000))
        }
        if(event.data=="chat"){
                GM_setValue("msg",f("#message").value+"►"+num(5000))
            GM_sendMessage('cmd', 'msg',f("#message").value,num(5000))
        }
        if(event.data=="answer"){
                GM_setValue("answer",f("#answer").value+"►"+num(5000))
            GM_sendMessage('cmd', 'answer',f("#answer").value,num(5000))
        }
        if(event.data=="report"){
            GM_setValue('report', num(5000));
            GM_sendMessage('cmd', 'report','x',num(5000))
        }
        if(event.data=="jump"){
            GM_setValue('jump', num(5000));
        }
        if(event.data=="reconnect"){if(!0==!!0){
            GM_sendMessage('reconnect', rand(),rand());}
        }
        if(event.data=="acceptdraw1"){
            GM_setValue('acceptdraw1', num(5000));
            GM_sendMessage('cmd', 'accept1','x',num(5000))
        }
        if(event.data=="acceptdraw2"){
            GM_setValue('acceptdraw2', num(5000));
            GM_sendMessage('cmd', 'accept2','x',num(5000))
        }
         if(event.data=="tips"){
            GM_setValue('tips', num(5000));
            GM_sendMessage('cmd', 'tips','x',num(5000))
         }
        if(event.data=="exit"){
            GM_setValue('exit', num(5000));
            GM_sendMessage('cmd', 'exit','x',num(5000))
        }

        if(event.data=="rejoin"){
            GM_setValue('exit', num(5000));

           let msgstorage = localStorage.getItem("messagejoin");
                if(msgstorage && "1"==="2"){let vm=JSON.parse(msgstorage); setTimeout(()=>{vm.forEach(item=>{
                GM_setValue("msg",item.msg+"►"+num(5000))
                })},4000)}
            GM_sendMessage("join",f("#roomlink").value.split("/")[3],f("#botnick").value,avatar,localStorage.getItem("botnick"),f(".kickonjoin").checked,JSON.parse(localStorage.getItem("messagejoin")),rand())
        }


                   if(event.data=="kickall"){
  var elements = document.getElementsByClassName("kickmenubtn");
var elementsvalue = [];

for (var i = 0; i < elements.length; i++) {
  elementsvalue.push(elements[i].getAttribute("onclick"));
}

elementsvalue.forEach(function(value, index) {
  setTimeout(function() {
    let userid = value.split("kickuser.")[1].split("','*")[0];

                    GM_setValue("kick",userid+".."+num(10000))
                    GM_sendMessage("cmd",'kick',userid+".."+num(10000))
  }, 550 * index);
})}
            if(event.data=="broadcastspamtoggle"){
            let broadcastspamMS=parseInt(localStorage.getItem("broadcastspam"))
            var broadcastspam = f("#broadcastspam").value
            intervalbroadcast=setInterval(()=>{
                GM_setValue("broadcast",broadcastspam+"►"+num(5000))
            },broadcastspamMS)
        f("#broadcaststart").style.display="none"
        f("#broadcaststop").style.display="block"
        }
        if(event.data=="chatspamtoggle"){
            let messagespamMS=parseInt(localStorage.getItem("messagespam"))
            var messagespam = f("#messagespam").value
            intervalmsg=setInterval(()=>{
            var chatspam = f("#messagespam").value
                GM_setValue("msg",chatspam+"►"+num(5000))
            },messagespamMS)
        f("#msgstart").style.display="none"
        f("#msgstop").style.display="block"
        }
        if(event.data=="answerspamtoggle"){
            let answerspamMS=parseInt(localStorage.getItem("answerspam"))
            var answerspam = f("#answerspam").value
            intervalanswer=setInterval(()=>{
            var answerspam = f("#answerspam").value
                GM_setValue("answer",answerspam+"►"+num(5000))
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
            if (event.data == "autoguess") {if(f("#autoguess").checked){GM_setValue("autoguess",1)}else{GM_setValue("autoguess",0);clearInterval(wordsInterval)}}
                   if (event.data == "autoguessenable") {
  f("#autoguessenable").style.display = "none";
  f("#autoguessdisable").style.display = "block"
    GM_setValue("autoguess",1)


}

if (event.data == "autoguessdisable") {
  f("#autoguessenable").style.display = "block"
  f("#autoguessdisable").style.display = "none";
    GM_setValue("autoguess",0)
    clearInterval(wordsInterval)
}

        }
    })

    localStorage.getItem("botc")?0:window.localStorage.setItem("botc",0)
    GM_setValue("resetcount",rand())
    //
    setInterval(()=>{
        if(f("#users")){
            fa(".kickmenubtn").forEach(ele=>{
                f(".scrollElements").innerText.indexOf(ele.value)==-1?ele.remove():0
            })
            f("g")?f("g").remove():0;
        }
        if(f("input[name=chat]")){
            f(".contentPopup")&&f(".btYellowBig.ic-yes")?f(".btYellowBig.ic-yes").click():0;

            if(f(".contentPopup .nick")&&f(".ic-votekick")&&otoeven==0){
                otoeven=1//
                f(".close").addEventListener("click",()=>{otoeven=0})
                f(".ic-ignore").addEventListener("click",()=>{otoeven=0})
                f(".ic-votekick").addEventListener("click",()=>{
                    otoeven=0
                    GM_setValue("kick",f(".contentPopup .nick").innerText+".."+num(10000))
                })
            }
        }
        f("input[name=chat]")?f("input[name=chat]").setAttribute("placeholder",+botc+" bot aktif"):0
        f(".taktifbot")?f(".taktifbot").innerText=botc:0

        if(f("#background")&&!f(".userlist")&&!f(".option")&&!f(".icebot")){
            f("#background").innerHTML+=html
            setCSS()
        }
    },100)
    GM_addValueChangeListener("botekle", function(I,C,E,b) {
        botc++
        f(".taktifbot")?f(".taktifbot").innerText=botc:0
    })

    GM_addValueChangeListener("ready", function(I,C,E,b) {
        readyc++
        readyc>=botc&&botc!=0?GM_setValue("join",rand()):0
    })

    GM_addValueChangeListener("botexit", function(I,C,E,b) {
        //botc--
    })
}