// ==UserScript==
// @name         GuresTürkiye - İsim Etiketi (v14.6 Final - Proxy)
// @namespace    http://tampermonkey.net/
// @version      14.6.0
// @description  GuresTurkiye.net gelişmiş isim etiketi sistemi. Proxy entegrasyonu ile erişim engeli aşılmıştır.
// @author       Elricsilverhand
// @match        *://*.guresturkiye.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      mindsugi.tr
// @connect      cdn.discordapp.com
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541346/GuresT%C3%BCrkiye%20-%20%C4%B0sim%20Etiketi%20%28v146%20Final%20-%20Proxy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541346/GuresT%C3%BCrkiye%20-%20%C4%B0sim%20Etiketi%20%28v146%20Final%20-%20Proxy%29.meta.js
// ==/UserScript==
(function(){'use strict';
const _0x1=['Y3JpbXNvbg==','YmVycnk=','c2t5','dGVhbA==','Zm9yZXN0','YnViYmxlX2d1bQ==','dmlvbGV0','Y29iYWx0','Y2xvdmVy','bGVtb24=','d2hpdGU=','aHR0cHM6Ly9jZG4uZGlzY29yZGFwcC5jb20vYXNzZXRzLw==','Y29udGVudC8=','Y29sbGVjdGlibGVzL25hbWVwbGF0ZXMv','Z3JhZGllbnRUb25lXw==','c2VsZWN0ZWRUaGVtZV8=','Z3QtZHluYW1pYy1uYW1lcGxhdGUtc3R5bGU=','Z3QtbWVudS1zZXR0aW5ncy1idG4=','Z3QtdGhlbWUtbW9kYWwtb3ZlcmxheQ==','LnAtbmF2Z3JvdXAucC1hY2NvdW50','LnAtbmF2Z3JvdXAtbGluay0tc2VhcmNo','Z3QtaGVhZGVyLWJ0bg==','aHR0cHM6Ly9taW5kc3VnaS50ci9wcm94eS5waHA/dXJsPQ=='];
const _S=(_i)=>atob(_0x1[_i]);
const _D={c:{d:"#900007",l:"#E7040F"},b:{d:"#893A99",l:"#B11FCF"},s:{d:"#0080B7",l:"#56CCFF"},t:{d:"#086460",l:"#7DEED7"},f:{d:"#2D5401",l:"#6AA624"},bg:{d:"#DC3E97",l:"#F957B3"},v:{d:"#730BC8",l:"#972FED"},co:{d:"#0131C2",l:"#4278FF"},cl:{d:"#047B20",l:"#63CD5A"},l:{d:"#F6CD12",l:"#FED400"},w:{d:"#FFFFFF",l:"#FFFFFF"}};
const _P={crimson:_D.c,berry:_D.b,sky:_D.s,teal:_D.t,forest:_D.f,bubble_gum:_D.bg,violet:_D.v,cobalt:_D.co,clover:_D.cl,lemon:_D.l,white:_D.w};
const _U={id:null,th:'bonsai_bahcesi',gr:'dark'};
const _B=async(_u)=>{return new Promise((res,rej)=>{GM_xmlhttpRequest({method:"GET",url:_u,responseType:"blob",onload:(r)=>{res(URL.createObjectURL(r.response))},onerror:()=>{res(null)}})})};
const _T={
yuji_itadori:{n:'Yuji Itadori',v:'5050c625036c997b5426c21ea78e585653a8f21e2c70ffd0bcfab485e530f2b3',t:1,c:'#FFFFFF',p:'crimson'},
satoru_gojo:{n:'Satoru Gojo',v:'97d86485f812ba7758f0fde9320a9c27d62a8b1692c3dfa87eb66d8fb8f4ef6d',t:1,c:'#FFFFFF',p:'cobalt'},
ryomen_sukuna:{n:'Ryomen Sukuna',v:'5a6a04d9ed8b5a31c80d91e6bb628d47417920cfb7567ff20764ec5eed6a3166',t:1,c:'#FFFFFF',p:'crimson'},
bonsai_bahcesi:{n:'Bonsai Bahçesi',v:'nameplates_v3/bonsai/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
under_the_sea:{n:'Under the Sea',v:'nameplates_v3/under_the_sea/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
aurora:{n:'Aurora',v:'nameplates_v3/aurora/asset.webm',t:2,c:'#FFFFFF',p:'teal'},
sun_and_moon:{n:'Sun and Moon',v:'nameplates_v3/sun_and_moon/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
oasis:{n:'Oasis',v:'nameplates_v3/oasis/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
touch_grass:{n:'Touch Grass',v:'nameplates_v3/touch_grass/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
spirit_moon:{n:'Spirit Moon',v:'nameplates_v2/spirit_moon/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
pixie_dust:{n:'Pixie Dust',v:'nameplates_v2/pixie_dust/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
glitch:{n:'Glitch',v:'nameplates_v2/glitch/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
starfall_tides:{n:'Starfall Tides',v:'nameplates_v2/starfall_tides/asset.webm',t:2,c:'#FFFFFF',p:'teal'},
cozy_cat:{n:'Cozy Cat',v:'nameplates_v2/cozy_cat/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
sword_of_legend:{n:'Sword of Legend',v:'nameplates_v2/sword_of_legend/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
cherry_blossoms:{n:'Cherry Blossoms',v:'nameplates/cherry_blossoms/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
cat_beans:{n:'Cat Beans',v:'nameplates/cat_beans/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
spirit_of_spring:{n:'Spirit of Spring',v:'nameplates/spirit_of_spring/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
twilight:{n:'Twilight',v:'nameplates/twilight/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
koi_pond:{n:'Koi Pond',v:'nameplates/koi_pond/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
vengeance:{n:'Vengeance',v:'nameplates/vengeance/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
cityscape:{n:'Cityscape',v:'nameplates/cityscape/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
angels:{n:'Angels',v:'nameplates/angels/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
red_dragon:{n:'Red Dragon',v:'chance/red_dragon/asset.webm',t:2,c:'#FFFFFF',p:'crimson'},
d20_roll:{n:'D20 Roll',v:'chance/d20_roll/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
owlbear_cub:{n:'Owlbear Cub',v:'chance/owlbear_cub/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
white_mana:{n:'White Mana',v:'spell/white_mana/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
blue_mana:{n:'Blue Mana',v:'spell/blue_mana/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
black_mana:{n:'Black Mana',v:'spell/black_mana/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
red_mana:{n:'Red Mana',v:'spell/red_mana/asset.webm',t:2,c:'#FFFFFF',p:'crimson'},
green_mana:{n:'Green Mana',v:'spell/green_mana/asset.webm',t:2,c:'#FFFFFF',p:'clover'},
cherry_blossom:{n:'Cherry Blossom',v:'nameplatetest/cherry_blossom/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
heart_bloom:{n:'Heart Bloom',v:'nameplatetest/heart_bloom/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
kawaii_gaming:{n:'Kawaii Gaming',v:'nameplatetest/kawaii_gaming/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
kitsune:{n:'Kitsune',v:'nameplatetest/kitsune/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
tv_woman:{n:'TV Woman',v:'paper/tv_woman/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
secret_agent:{n:'Secret Agent',v:'paper/secret_agent/asset.webm',t:2,c:'#FFFFFF',p:'forest'},
skibidi_toilet:{n:'Skibidi Toilet',v:'paper/skibidi_toilet/asset.webm',t:2,c:'#FFFFFF',p:'lemon'},
spirit_blossom_petals:{n:'Spirit Blossom Petals',v:'petal/spirit_blossom_petals/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
yunaras_aion_erna:{n:'Yunara\'s Aion Er\'na',v:'petal/yunaras_aion_erna/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
spirit_blossom_springs:{n:'Spirit Blossom Springs',v:'petal/spirit_blossom_springs/asset.webm',t:2,c:'#FFFFFF',p:'teal'},
pile_of_bones_trick:{n:'Pile of Bones (Trick)',v:'trick_or_treat/pile_of_bones_trick/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
pile_of_bones_treat:{n:'Pile of Bones (Treat)',v:'trick_or_treat/pile_of_bones_treat/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
ms_spider_trick:{n:'Ms Spider (Trick)',v:'trick_or_treat/ms_spider_trick/asset.webm',t:2,c:'#FFFFFF',p:'teal'},
ms_spider_treat:{n:'Ms Spider (Treat)',v:'trick_or_treat/ms_spider_treat/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
im_watching_yooooou_trick:{n:'I’m Watching YoOoOou... (Trick)',v:'trick_or_treat/im_watching_yooooou_trick/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
im_watching_yooooou_treat:{n:'I’m Watching YoOoOou... (Treat)',v:'trick_or_treat/im_watching_yooooou_treat/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
autumn_breeze:{n:'Autumn Breeze',v:'woodland_friends/autumn_breeze/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
petal_bloom:{n:'Petal Bloom',v:'woodland_friends/petal_bloom/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
hoppy_bois_perch:{n:'Hoppy Boi’s Perch',v:'woodland_friends/hoppy_bois_perch/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
encore_orange:{n:'Encore! (Orange)',v:'its_showtime/encore_orange/asset.webm',t:2,c:'#FFFFFF',p:'lemon'},
encore_teal:{n:'Encore! (Teal)',v:'its_showtime/encore_teal/asset.webm',t:2,c:'#FFFFFF',p:'teal'},
berry_bunny:{n:'Berry Bunny',v:'nameplate_bonanza/berry_bunny/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
the_same_duck:{n:'The Same Duck',v:'nameplate_bonanza/the_same_duck/asset.webm',t:2,c:'#FFFFFF',p:'forest'},
starfall_tides_nightshade:{n:'Starfall Tides (Nightshade)',v:'nameplate_bonanza/starfall_tides_nightshade/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
starfall_tides_rose:{n:'Starfall Tides (Rose)',v:'nameplate_bonanza/starfall_tides_rose/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
starfall_tides_void:{n:'Starfall Tides (Void)',v:'nameplate_bonanza/starfall_tides_void/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
starlight_whales:{n:'Starlight Whales',v:'nameplate_bonanza/starlight_whales/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
bloomling:{n:'Bloomling',v:'nameplate_bonanza/bloomling/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
sproutling:{n:'Sproutling',v:'nameplate_bonanza/sproutling/asset.webm',t:2,c:'#FFFFFF',p:'clover'},
twilight_fuchsia:{n:'Twilight (Fuchsia)',v:'nameplate_bonanza/twilight_fuchsia/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
twilight_dusk:{n:'Twilight (Dusk)',v:'nameplate_bonanza/twilight_dusk/asset.webm',t:2,c:'#FFFFFF',p:'white'},
cosmic_storm:{n:'Cosmic Storm',v:'nameplate_bonanza/cosmic_storm/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
planet_rings:{n:'Planet Rings',v:'nameplate_bonanza/planet_rings/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
fairies:{n:'Fairies',v:'nameplate_bonanza/fairies/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
firefly_meadow:{n:'Firefly Meadow',v:'nameplate_bonanza/firefly_meadow/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
magic_hearts_orange:{n:'Magic Hearts (Orange)',v:'nameplate_bonanza/magic_hearts_orange/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
magic_hearts_blue:{n:'Magic Hearts (Blue)',v:'nameplate_bonanza/magic_hearts_blue/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
claptrap:{n:'Claptrap',v:'box/claptrap/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
ripper_awakens:{n:'Ripper Awakens',v:'box/ripper_awakens/asset.webm',t:2,c:'#FFFFFF',p:'sky'},
shattered_veil:{n:'Shattered Veil',v:'box/shattered_veil/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
vault:{n:'Vault',v:'box/vault/asset.webm',t:2,c:'#FFFFFF',p:'crimson'},
moonlit_charm:{n:'Moonlit Charm',v:'lunar_eclipse/moonlit_charm/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
luna_moth:{n:'Luna Moth',v:'lunar_eclipse/luna_moth/asset.webm',t:2,c:'#FFFFFF',p:'bubble_gum'},
moon_essence:{n:'Moon Essence',v:'lunar_eclipse/moon_essence/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
gomah:{n:'Gomah',v:'rock/gomah/asset.webm',t:2,c:'#FFFFFF',p:'crimson'},
mini_vegeta:{n:'Mini Vegeta',v:'rock/mini_vegeta/asset.webm',t:2,c:'#FFFFFF',p:'cobalt'},
mini_goku:{n:'Mini Goku',v:'rock/mini_goku/asset.webm',t:2,c:'#FFFFFF',p:'berry'},
dragon_ball:{n:'Dragon Ball',v:'rock/dragon_ball/asset.webm',t:2,c:'#FFFFFF',p:'crimson'},
jet_stream:{n:'Jet Stream',v:'special_events_2/nitro_rocketfuel_nameplate/asset.webm',t:2,c:'#FFFFFF',p:'violet'},
arctic_winter_frost:{n:'Arctic Winter Frost',v:'ae4f35f87ba36a1af1e9669e33d3a74990364efc8173f84c2719626c6d7e06a9',t:1,c:'#FFFFFF',p:'cobalt'},
aurora_winter_fox:{n:'Aurora Winter Fox',v:'a336f03417aacee8027b85852672dee3f214eec768d674eaa509838b059e498e',t:1,c:'#FFFFFF',p:'cobalt'},
magic_mists:{n:'Magic Mists',v:'5719f0e26a109ef3ce3b3ecf2ccf5003f1057d2f5cbbdbc457ba25343c09d749',t:1,c:'#FFFFFF',p:'cobalt'},
infinite_swirl:{n:'Infinite Swirl',v:'8e29a81937dcaeb5e0b195f9b62d406998cfe31e30c07f39b7c49b112231335b',t:1,c:'#FFFFFF',p:'violet'},
aries:{n:'Aries',v:'772f9c100edba0b64fedb135aba6dab1b293b7b0d29cfb1641e802654bbb467a',t:1,c:'#FFFFFF',p:'crimson'},
taurus:{n:'Taurus',v:'2d35bb2329a5f96d06734360d2bb9f11e0c0bce4b64eab4435dc708dae692f1e',t:1,c:'#FFFFFF',p:'forest'},
gemini:{n:'Gemini',v:'51e48c16c15a196de9dc78af924bc25974a2f5d3e7b39e2849e8cb2ce86a855d',t:1,c:'#FFFFFF',p:'berry'},
cancer:{n:'Cancer',v:'95a3d2ebe6d8daa8ef478d2a579b1f4bbaa58516b0a7b09a4290d503d1d72c9b',t:1,c:'#FFFFFF',p:'cobalt'},
leo:{n:'Leo',v:'d3cae6e48de4e76dafaad5329bcc5577ebe6c8db7a5717ed562a07d3f1905a2d',t:1,c:'#FFFFFF',p:'lemon'},
virgo:{n:'Virgo',v:'b53b0d34254c58caf8c6856ceb71113e7aeba6478e183ad9af173eeeff73f532',t:1,c:'#FFFFFF',p:'lemon'},
libra:{n:'Libra',v:'4e817afdd742bd6eda35fa131a8866842d427ce2d52a0bc31fbc3aae19f97527',t:1,c:'#FFFFFF',p:'cobalt'},
scorpio:{n:'Scorpio',v:'d33ffe77a7f47d1d532e8b521de831e0cc60edbcae6642d4d3d7acf704f7f3ca',t:1,c:'#FFFFFF',p:'violet'},
sagittarius:{n:'Sagittarius',v:'9b6169878c3052116626fa63d79bc1bd99bbad43bb02c3654fbcfb51a155e5ca',t:1,c:'#FFFFFF',p:'bubble_gum'},
capricorn:{n:'Capricorn',v:'31ca8ce7e98f5a274cc9e99d90264969c9e6e534132172243e4b07274613b7af',t:1,c:'#FFFFFF',p:'teal'},
aquarius:{n:'Aquarius',v:'2219d4c5bf61bc6153b55c56b4e0416ed4d394c182470b4c565578831f4aa16a',t:1,c:'#FFFFFF',p:'violet'},
pisces:{n:'Pisces',v:'abe16cf21bb0b2075182aa591ba4fad9c1e8e31d8853f4e75202ebb0e9ffa583',t:1,c:'#FFFFFF',p:'sky'},
woodsprite:{n:'Woodsprite',v:'f8b53feb90a2869ea1c07b1f92ea6d9a7b470deb275a65111f3a58b234ee9d71',t:1,c:'#FFFFFF',p:'violet'},
pandoran_seas_squid:{n:'Pandoran Seas (Squid)',v:'f866b116654315e0a22e1dfb251f17d78e7e68b9520c09e0192bee4c233f5196',t:1,c:'#FFFFFF',p:'sky'},
pandoran_seas_ilu:{n:'Pandoran Seas (Ilu)',v:'7a24e8911b65c4a4b9c591a3d5605018b11ed159473f66021ea604bdb1ef17a8',t:1,c:'#FFFFFF',p:'sky'},
cosmic_twilight_flow_amethyst:{n:'Cosmic Twilight (Amethyst)',v:'b6a5e0d3fdd67d3e4ab66b927d34dd6580585ea83e8d9443ab3049c83cd239d6',t:1,c:'#FFFFFF',p:'violet'},
cosmic_twilight_flow_beryl:{n:'Cosmic Twilight (Beryl)',v:'83838ad9afc9cc5752afffebe48a1f5242c8499e950bd59ca46f6418e98413c4',t:1,c:'#FFFFFF',p:'sky'},
light_wall_red:{n:'Light Wall (Red)',v:'072aa4184b5e683232e0575c91d38a261daac6e095c398db9767b4452e5f3e68',t:1,c:'#FFFFFF',p:'crimson'},
light_wall_blue:{n:'Light Wall (Blue)',v:'1aa35f24b17107d1c8bf600acef699302de0ccc80ec7db6f85ed98dde36cf51a',t:1,c:'#FFFFFF',p:'cobalt'},
the_grid_fireworks:{n:'The Grid Fireworks',v:'7f2072ecda18fefd893bc1ff86b92ce8787fe92ccaab671898d2c75aa55cb0fa',t:1,c:'#FFFFFF',p:'sky'},
encom_grid:{n:'Encom Grid',v:'28b0160ea59fa634890e057c74eef15f72aaf118a0fbcfd4fd146e1315731795',t:1,c:'#FFFFFF',p:'sky'},
camo_master:{n:'Camo Master',v:'06343ef776b710cf13bcb5ed9fc2d6b177415e5df4aeef0659b17fa39b55d2fc',t:1,c:'#FFFFFF',p:'violet'},
squad_wipe:{n:'Squad Wipe',v:'4d2e225645e7456cb70f6cc2d428ecc0d551cb723aff474ce24a36972bd00114',t:1,c:'#FFFFFF',p:'teal'},
bye_bye:{n:'Bye-Bye',v:'0690b4eae2b81b9cea835beab78b2081d816364a59bbebde76329425b9904577',t:1,c:'#FFFFFF',p:'violet'},
2035:{n:'2035',v:'cf0f27b19f0609f7c342e5852ec198b5d4232adae31b5dff1d89d556220186cb',t:1,c:'#FFFFFF',p:'cobalt'},
fluttering_static:{n:'Fluttering Static',v:'9c4b9ccfb8629473202b9d9670de75d1f6f16edf7168f22f4c45f831322df10c',t:1,c:'#FFFFFF',p:'crimson'}
};
const _G=(_tObj)=>{const _pb=_S(22);const _db=_S(11);const _cb=_S(12);const _ab=_S(13);if(_tObj.t===1){return _pb+_db+_cb+_tObj.v}else{return _pb+_db+_ab+_tObj.v}};
function _GetUID(){const _e=document.querySelector('.p-navgroup-link--user .avatar[data-user-id]');return _e?_e.dataset.userId:null;}
async function _Load(){_U.id=_GetUID();if(!_U.id)return false;_U.gr=await GM_getValue(_S(14)+_U.id,'dark');let _s=await GM_getValue(_S(15)+_U.id,'bonsai_bahcesi');if(!_T[_s])_s=Object.keys(_T)[0];_U.th=_s;return true;}
async function _Save(){if(!_U.id)return;const _t=document.querySelector('.gt-theme-card.selected')?.dataset.themeKey||_U.th;_U.th=_t;await GM_setValue(_S(15)+_U.id,_t);const _g=document.querySelector('input[name="gt-gradient-tone"]:checked').value;_U.gr=_g;await GM_setValue(_S(14)+_U.id,_g);_Clean();await _Inject();_Process(document.body);alert('Ayarlar kaydedildi ve uygulandı!');const _m=document.getElementById(_S(18));if(_m)_m.style.display='none';}
function _Clean(){const _s=document.getElementById(_S(16));if(_s)_s.remove();document.querySelectorAll('a.username[data-gt-styled="true"]').forEach(_l=>{const _c=_l.querySelector('.gt-nameplate-container');if(_c){const _v=_c.querySelector('video');if(_v&&_v.src.startsWith('blob:'))URL.revokeObjectURL(_v.src);_c.remove();}Array.from(_l.children).forEach(_ch=>_ch.style.display='');delete _l.dataset.gtStyled;});}
function _Inject(){if(!_U.id)return;document.getElementById(_S(16))?.remove();const _t=_T[_U.th]||Object.values(_T)[0],_p=_P[_t.p],_gc=_U.gr==='light'?_p.l:_p.d;const _css=`
:root{--gt-gradient-color:${_gc};--gt-text-color:${_t.c}}
a.username[data-user-id="${_U.id}"]{position:relative;display:inline-flex;align-items:center;justify-content:center;height:36px;width:100%;min-width:140px;padding:0 18px;vertical-align:middle;overflow:hidden;border-radius:10px;text-decoration:none!important;box-shadow:0 2px 5px rgba(0,0,0,0.2);margin:2px 0;font-size:0}
.message-user-info a.username[data-user-id="${_U.id}"]{display:flex;width:100%;max-width:220px;height:44px;margin-bottom:8px}
.gt-nameplate-container{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}
.gt-gradient-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(90deg,rgba(0,0,0,0) -20%,var(--gt-gradient-color) 150%);z-index:1}
.gt-nameplate-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2}
.gt-nameplate-text{position:relative;color:var(--gt-text-color)!important;font-weight:bold;text-shadow:1px 1px 4px rgba(0,0,0,0.8);z-index:3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 10px;font-size:15px;line-height:1;visibility:visible!important}
.message-user-info .gt-nameplate-text{font-size:16px}
a.username[data-user-id="${_U.id}"][data-gt-styled="true"]>*:not(.gt-nameplate-container){display:none!important}`;GM_addStyle(_css,{id:_S(16)});}
async function _Process(_n){if(_n.nodeType!==Node.ELEMENT_NODE||!_U.id)return;const _sel=`a.username[data-user-id="${_U.id}"]:not([data-gt-styled])`;if(_n.matches?.(_sel))_Apply(_n);_n.querySelectorAll(_sel).forEach(_Apply);}
async function _Apply(_l){if(_l.dataset.gtStyled==='true')return;const _tx=_l.textContent.trim();if(!_tx)return;const _th=_T[_U.th];const _url=_G(_th);const _bUrl=await _B(_url);if(!_bUrl)return;const _c=document.createElement('div');_c.className='gt-nameplate-container';_c.innerHTML=`<div class="gt-gradient-overlay"></div><video class="gt-nameplate-video" src="${_bUrl}" autoplay loop muted playsinline disablepictureinpicture></video><span class="gt-nameplate-text">${_tx}</span>`;Array.from(_l.children).forEach(_ch=>{if(_ch!==_c)_ch.style.display='none';});_l.appendChild(_c);_l.dataset.gtStyled='true';}
function _UI(){if(document.getElementById(_S(18)))return;GM_addStyle(`#gt-theme-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:10000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}#gt-theme-modal{background:linear-gradient(135deg,#2c2f33 0%,#1e2124 100%);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.6);width:90%;max-width:800px;color:#ffffff;display:flex;flex-direction:column;max-height:90vh;overflow:hidden;animation:slideIn 0.3s ease-out}@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}#gt-modal-header{padding:20px 40px;border-bottom:1px solid #40444b;display:flex;justify-content:space-between;align-items:center;background-color:#1e2124}#gt-modal-close-btn{background:none;border:none;color:#b9bbbe;font-size:1.9em;cursor:pointer;padding:5px;border-radius:50%;transition:color 0.2s ease,transform 0.2s ease}#gt-modal-close-btn:hover{color:#ff5555;transform:rotate(90deg)}#gt-modal-content{padding:30px 45px;overflow-y:auto;flex-grow:1;background-color:#2c2f33}#gt-modal-content h3{color:#b9bbbe;margin-top:25px;margin-bottom:20px;font-size:1.4em;border-bottom:3px solid #7289da;padding-bottom:8px;font-weight:600;text-transform:uppercase}#gt-theme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));justify-content:center;gap:20px;margin-bottom:30px}.gt-theme-card{background:#36393f;border-radius:12px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.3s ease;display:flex;flex-direction:column;box-shadow:0 6px 20px rgba(0,0,0,0.3)}.gt-theme-card:hover{border-color:#7289da;transform:translateY(-6px);box-shadow:0 8px 25px rgba(114,137,218,0.4)}.gt-theme-card.selected{border-color:#7289da;box-shadow:0 0 0 4px rgba(114,137,218,0.5)}.gt-theme-preview{width:100%;height:40px;position:relative;overflow:hidden;background-color:#202225}.gt-theme-video-preview{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2}.gt-theme-preview-overlay{position:absolute;width:100%;height:100%;top:0;left:0;z-index:1;background-image:linear-gradient(90deg,rgba(0,0,0,0) -30%,var(--gt-preview-gradient-color) 200%)}.gt-theme-name{padding:12px;font-size:1em;color:#ffffff;text-align:center;background-color:#2f3136;border-top:2px solid #40444b;font-weight:600;text-transform:capitalize}.gt-setting-item{margin-bottom:25px}#gt-modal-footer{padding:20px 40px;border-top:1px solid #40444b;display:flex;justify-content:space-between;align-items:center;background-color:#1e2124}#gt-save-settings-btn{background:linear-gradient(90deg,#7289da 0%,#5865f2 100%);color:#ffffff;border:none;padding:12px 30px;border-radius:10px;cursor:pointer;font-size:1.2em;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;transition:transform 0.2s ease,box-shadow 0.2s ease}#gt-save-settings-btn:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(88,101,242,0.5)}.gt-tone-option{display:flex;gap:20px;margin-top:10px}.gt-tone-option input[type="radio"]{display:none}.gt-tone-option label{cursor:pointer;padding:10px 15px;background-color:#36393f;border-radius:8px;transition:all 0.3s ease}.gt-tone-option label:hover{background-color:#40444b;color:#ffffff}.gt-tone-option input[type="radio"]:checked + label{background-color:#7289da;color:#ffffff;box-shadow:0 0 0 2px rgba(114,137,218,0.5)}`);const _c=document.createElement('div');_c.id=_S(18);_c.style.display='none';
const _h=Object.entries(_T).map(([k,d])=>{const p=_P[d.p],gc=_U.gr==='light'?p.l:p.d;return `<div class="gt-theme-card" data-theme-key="${k}" data-palette-key="${d.p}"><div class="gt-theme-preview"><div class="gt-theme-preview-overlay" style="--gt-preview-gradient-color: ${gc};"></div><video muted loop playsinline disablepictureinpicture class="gt-theme-video-preview" data-src="${_G(d)}"></video></div><div class="gt-theme-name">${d.n}</div></div>`;}).join('');
const _to=`<div class="gt-tone-option"><input type="radio" name="gt-gradient-tone" value="dark" id="dark-tone" ${_U.gr==='dark'?'checked':''}><label for="dark-tone">Koyu Ton</label><input type="radio" name="gt-gradient-tone" value="light" id="light-tone" ${_U.gr==='light'?'checked':''}><label for="light-tone">Açık Ton</label></div>`;
_c.innerHTML=`<div id="gt-theme-modal"><div id="gt-modal-header"><h2>İsim Etiketi Ayarları</h2><button id="gt-modal-close-btn">×</button></div><div id="gt-modal-content"><h3>Tema Seçimi</h3><div id="gt-theme-grid">${_h}</div><h3>Genel Ayarlar</h3><div class="gt-setting-item"><label>Kullanıcı ID: ${_U.id||'Giriş Yapılmamış'}</label></div><div class="gt-setting-item"><label>Gradient Tonu:</label>${_to}</div></div><div id="gt-modal-footer"><small id="gt-copyright">Copyright © Elricsilverhand</small><button id="gt-save-settings-btn">Kaydet ve Uygula</button></div></div>`;document.body.appendChild(_c);_c.querySelector('#gt-modal-close-btn').addEventListener('click',()=>{_c.style.display='none'});_c.querySelector('#gt-save-settings-btn').addEventListener('click',_Save);_c.querySelectorAll('.gt-theme-card').forEach(C=>{C.addEventListener('click',e=>{_c.querySelector('.gt-theme-card.selected')?.classList.remove('selected');e.currentTarget.classList.add('selected');});const v=C.querySelector('video');if(v){C.addEventListener('mouseenter',async()=>{if(!v.src){v.src=await _B(v.dataset.src)}v.play().catch(e=>{})});C.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0;});}});_c.querySelectorAll('input[name="gt-gradient-tone"]').forEach(r=>{r.addEventListener('change',e=>{const nt=e.target.value;_c.querySelectorAll('.gt-theme-card').forEach(C=>{const pk=C.dataset.paletteKey,pl=_P[pk];if(pl){const ng=nt==='light'?pl.l:pl.d;C.querySelector('.gt-theme-preview-overlay').style.setProperty('--gt-preview-gradient-color',ng);}});});});
const _obs=new IntersectionObserver((entries,obs)=>{entries.forEach(async entry=>{if(entry.isIntersecting){const v=entry.target.querySelector('video');if(v&&!v.src){v.src=await _B(v.dataset.src);}obs.unobserve(entry.target);}});},{root:_c.querySelector('#gt-modal-content'),threshold:0.1});_c.querySelectorAll('.gt-theme-card').forEach(c=>_obs.observe(c));}
function _Open(){const _m=document.getElementById(_S(18));if(!_m)return;_m.querySelector('.gt-theme-card.selected')?.classList.remove('selected');const _c=_m.querySelector(`.gt-theme-card[data-theme-key="${_U.th}"]`);if(_c)_c.classList.add('selected');const _tr=_m.querySelector(`input[name="gt-gradient-tone"][value="${_U.gr}"]`);if(_tr)_tr.checked=true;_m.style.display='flex';}
function _HeaderBtn(){const _ng=document.querySelector(_S(19));if(!_ng||document.getElementById(_S(21)))return;const _search=_ng.querySelector(_S(20));const _a=document.createElement('a');_a.className='p-navgroup-link p-navgroup-link--iconic';_a.id=_S(21);_a.style.cursor='pointer';_a.title='İsim Etiketi Ayarları';_a.setAttribute('aria-label','İsim Etiketi Ayarları');_a.innerHTML='<i aria-hidden="true">🎨</i>';_a.addEventListener('click',e=>{e.preventDefault();_Open();});if(_search){_ng.insertBefore(_a,_search);}else{_ng.appendChild(_a);}}
async function _Main(){if(!(await _Load()))return;_UI();_Inject();_Process(document.body);_HeaderBtn();const _o=new MutationObserver(_m=>{for(const _r of _m){for(const _n of _r.addedNodes){if(_n.nodeType===Node.ELEMENT_NODE){_Process(_n);if(!document.getElementById(_S(21)))_HeaderBtn();}}}});_o.observe(document.body,{childList:true,subtree:true});GM_registerMenuCommand('İsim Etiketi Ayarları',_Open);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_Main);}else{_Main();}})();