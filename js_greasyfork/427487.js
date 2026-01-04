// ==UserScript==
// @name         Music Menu Compatible With Any Script 2021
// @namespace    Music Menu Compatible With Any Script 2021
// @version      0.1
// @description  Press (CapsLock) To Open Music Menu 2021
// @author       GUST4V1NBRS M0Ds
// @match        *://*.*/*
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/v5nav1si68dbv3bybm4y382lya1d
// @grant        nonefunction GUST4V1NBRS MoDs() {
// @downloadURL https://update.greasyfork.org/scripts/427487/Music%20Menu%20Compatible%20With%20Any%20Script%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/427487/Music%20Menu%20Compatible%20With%20Any%20Script%202021.meta.js
// ==/UserScript==

function GUST4V1NBRS() {

}

GUST4V1NBRS.prototype = {

};

var musics=[{
  name: "Cheiro De Pneu Queimado",
  msc: "https://cdn.discordapp.com/attachments/802375306769072158/849096473354043406/mc-cidinho-e-doca-cheiro-de-pneu-queimado.mp3"
}, {
  name: "Olha O Barulhinho Da Cama",
  msc: "https://cdn.discordapp.com/attachments/802375306769072158/849096487492911144/OLHA_O_BARULINHO_DA_CAMA_RENK_-_MC_MN_MC_RD_-_DJ_K_50k.mp3"
}, {
  name: "Cada Hit Na Favela E Um Terremoto",
  msc: "https://cdn.discordapp.com/attachments/802375306769072158/849096487593050152/mega-trepa-trepa-das-sombras-dj-wizard-e-dj-leo-da-17-cada-hit-na-favela-e-um-terremoto.mp3"
}, {
  name: "Beat Aquarela",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849132865269530644/BEAT_AQUARELA_-_Numa_folha_qualquer_-_Vai_voando_FUNK_REMIX_by_Sr._Nescau__Senhor_Nestlon_160k.mp3"
}, {
  name: "Beat Do Carrossel",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849132914779095070/BEAT_DO_CARROSSEL_-_Eu_to_carente_mas_eu_to_legal_FUNK_REMIX_by_Sr._Nescau__DJ_Tsk_160k.mp3"
}, {
  name: "Beat Do Super Xandao",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849132939902976010/BEAT_DO_SUPER_XANDAO_-_O_Ultimo_Heroi_da_Terra_FUNK_REMIX_by_Sr._Nescau__Servive_160k.mp3"
}, {
  name: "Beat Dos Peaky Blinders",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849132967053099029/BEAT_DOS_PEAKY_BLINDERS_II_-_Frio_e_Calculista_FUNK_REMIX_by_Sr._Nescau_160k.mp3"
}, {
  name: "Beat Fl Rid",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133012641775647/BEAT_FL_RID_-_Rave_Embrazante_FUNK_REMIX_by_Sr._Nescau__DJ_Tsk_160k.mp3"
}, {
  name: "Beat Do Lepo Lepo",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133046388097044/BEAT_LEP0_LEP0_-_No_tnh_crr_No_tnh_tet_FUNK_REMIX_by_Sr._Nescau__Sr_MKG_160k.mp3"
}, {
  name: "Beat Machup Do Trap",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133089569767454/BEAT_MASHUP_DO_TRAP_-_So_as_brabas_FUNK_REMIX_by_Sr._Nescau_160k.mp3"
}, {
  name: "Beat Sad Do Tik Tok",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133199563948052/BEAT_SAD_DO_TIKTOK_-_FUNK_REMIX_by_Sr._Nescau_160k.mp3"
}, {
  name: "Beat Sad Ness",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133296586981416/BEAT_SADNESS_-_Life_will_be_good_and_beautiful_FUNK_REMIX_by_Canal_Sr._Nescau_160k.mp3"
}, {
  name: "Beat Volt Bbbe Volt Nenm",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133394713509888/BEAT_V0LT_BBE_V0LT_NENM_-_FUNK_REMIX_by_Sr._Nescau_160k.mp3"
}, {
  name: "Beat O Ceu Deve Estar Rindo Agora",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133622715875378/o_ceu_deve_estar_rindo_agora...__160k.mp3"
}, {
  name: "O Beat Mais Sad Do Canal ",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133739207557140/O_BEAT_MAIS_SAD_DO_CANAL_by_Sr._Nescau__Xablau_beat_sadstation_160k.mp3"
}, {
  name: "Ghostemane Mercury",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133852471066630/GHOSTEMANE_-_Mercury.mp3"
}, {
  name: "Ghostemane Nails",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133868090392576/GHOSTEMANE_-_NAILS_160k.mp3"
}, {
  name: "Ghostemane Venom",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133870061584464/GHOSTEMANE_-_VENOM_160k.mp3"
}, {
  name: "Ghostemane Flash",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133870992850944/GHOSTEMANE_-_FLESH_Official_Video__160k.mp3"
}, {
  name: "Ghostemane Nihil",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133880456118332/GHOSTEMANE_-_Nihil.mp3"
}, {
  name: "Ghostemane Squeeze",
  msc:  "https://cdn.discordapp.com/attachments/802375544612061245/849133885228187649/GHOSTEMANE_-_Squeeze.mp3"
}, {
  name: "Ic3peak E Ghostemane",
  msc: "https://cdn.discordapp.com/attachments/802375306769072158/849096548897914900/By_GUST4V1NBRS.mp3"
}]



let musicmenu = document.createElement('div')
musicmenu.innerHTML="<h1 style='color:#FF0000;margin:10px;font-weight;10000;'>LISTA DE MUSICAS By GUST4V1NBRS</h1><br>"


for(let i=0;i<musics.length;i++){
  musicmenu.innerHTML+=`
  <h3 style="text-shadow:1px 1px 2px black;margin-top:15px;margin-left:2.5%">`+musics[i].name+`</h3>
  <audio style="width: 90%; margin-left: 2.5%; margin-top:10px;" src="`+musics[i].msc+`" controls="" loop=""></audio><hr>
  `
}
                musicmenu.style=`
font-size: 20px;
user-select: none;
color: #FF0000;
display:none;
overflow:auto;
position:absolute;
top:50%;
left:50%;
margin-top:-300px;
margin-left:-350px;
z-index:1000000;
border:7px solid red;
width:800px;
height:600px;
border-radius:10px;
background-color:#000000;
`
document.body.prepend(musicmenu)
document.addEventListener("keydown", (e)=>{
  if(e.keyCode == 20){
      if(musicmenu.style.display=="block"){
        musicmenu.style.display="none"
      }else{
        musicmenu.style.display="block"
      }
  }
})