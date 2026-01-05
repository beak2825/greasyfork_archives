// ==UserScript==
// @name         nCore - nagy ikonok
// @namespace    
// @version      0.8
// @description  nCore letöltési listában kirakja a borítóképet
// @author       vacsati
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @match        https://ncore.pro/torrents*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16260/nCore%20-%20nagy%20ikonok.user.js
// @updateURL https://update.greasyfork.org/scripts/16260/nCore%20-%20nagy%20ikonok.meta.js
// ==/UserScript==

//$('.box_nev2')
console.log('a');
var jelek={
    csillag:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
    fel:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M 12,2 4.5,20.29 5.21,21 h 13.58 l 0.71,-0.71 z"/></svg>',
    le:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M 12,21 4.5,2.71 5.21,2 h 13.58 l 0.71,0.71 z"/></svg>',
    pipa:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    iksz:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    csill:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 11H1v2h6v-2zm2.17-3.24L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41zM13 1h-2v6h2V1zm5.36 6.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM17 11v2h6v-2h-6zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zm-9.19.71l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12zM11 23h2v-6h-2v6z"/></svg>',
    homokora:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/></svg>',
    imdb:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 240 120"><path d="M20 99l20 0 0 -79 -20 0 0 79zm92 -79l0 79 -18 0 0 -53 -7 53 -13 0 -7 -52 0 52 -18 0 0 -79 26 0 6 37 4 -37 27 0zm29 13l0 52c3,0 4,0 5,-1 1,-2 1,-5 1,-10l0 -31c0,-3 0,-6 0,-7 -1,-1 -1,-1 -2,-2 -1,0 -2,-1 -4,-1zm-6 -13c10,0 17,0 21,1 3,1 6,3 7,5 2,2 3,4 4,7 0,2 1,7 1,15l0 27c0,8 -1,12 -1,15 -1,2 -2,4 -4,5 -2,2 -4,3 -6,3 -2,1 -6,1 -11,1l-26 0 0 -79 15 0zm65 33c0,-4 0,-6 0,-7 -1,-1 -2,-1 -3,-1 -1,0 -2,0 -2,1 -1,1 -1,3 -1,7l0 27c0,4 0,6 1,7 0,1 1,2 2,2 2,0 2,-1 3,-2 0,-1 0,-3 0,-7l0 -27zm-6 -33l0 19c2,-2 4,-4 6,-4 2,-1 4,-2 6,-2 3,0 5,1 7,1 2,1 4,2 5,4 1,1 1,3 2,4 0,2 0,5 0,10l0 29c0,5 0,8 -1,10 -1,3 -2,5 -4,6 -3,2 -6,3 -9,3 -2,0 -4,-1 -6,-2 -2,-1 -4,-2 -6,-4l-1 5 -18 0 0 -79 19 0z"/></svg>',
    szint:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 240 240" version="1.1" shape-rendering="geometricPrecision" fill-rule="evenodd" clip-rule="evenodd"><polygon id="sznt_6" class="szint" points="161,60 161,40 80,40 80,60"/><polygon id="sznt_5" class="szint" points="161,88 161,68 80,68 80,88"/><polygon id="sznt_4" class="szint" points="161,116 161,96 80,96 80,116"/><polygon id="sznt_3" class="szint" points="161,144 161,124 80,124 80,144"/><polygon id="sznt_2" class="szint" points="161,172 161,152 80,152 80,172"/><polygon id="sznt_1" class="szint" points="161,200 161,180 80,180 80,200"/><path d="M60 20l120 0 0 200 -120 0 0 -200zm10 10l100 0 0 180 -100 0 0 -180z"/></svg>',
}
var cimke_lista = "READ NFO DVDRip BDRiP BDRip BluRay PDTV TVRiP WEBRiP WeBRiP RETAiL DD2 D01 D02 D03 AAC2 x264 480p Hungarian HUN HULU".split(' ');
var keszito_lista = "HUN-Essence HuN-MaTeK 2xHUN-G HuN-TRiN Hun-Pirosas HuN-gyontato 1-SinTO x264-TOXI HUN-SinTO Hun-Anzel 2xHUN-SinTO x264-ARRO HuN-leftOut Hun-DenZ Hun-TheMilkyWay SirSzaal HUN-POGGERS x264-CiNENOVA HUN-ASANO HuN-Ape Hun-L77 HUN-GS HUN-Anzel HuN-Ba HuN-BAY HuN-BAYLEE HUN-G HuN-Gold Hun-DenZo HuN-Y2K HUN-GS8 HuN-TRiNiTY HUN-Iquana HUN-Y2K HUN-RolandS HuN-Essence HUN-nubira Hun-NRB Hun-MrDeta Hun-L77 HuN-BaKe HuN-BaKeR HUN-GS88 HuN-No Hun-No1 HUN-No1 HuN-No1 HUN-CRW HUN-Legacy x264-Gianni x264-CabCab Hun-eStone Hun-Pirosasz x264-ARROW x264-Robzo".split(' ');
var css_kieg="#main_all, .lista_all{width:auto;} .infocsik{left:calc(50% - 451px);} .infobar, .box_alcimek_all, .lista_fej, .lista_fej_t{display:none;}";
css_kieg+=".box_torrent_all{display:flex;flex-grow:1;justify-content:center;align-items:flex-start;flex-flow:wrap;background:none;margin-top:7px;}";
css_kieg+=".box_torrent{width:400px;height:268px;position:relative;border-radius:7px;overflow:hidden;margin:4px;border:2px solid black;background:rgba(255,255,255,0.1);transition:all 0.3s ease}";
css_kieg+=".box_torrent.uj{background:rgba(128,0,0,0.3);border:2px solid rgb(90,0,0);}";
css_kieg+=".box_torrent:hover{border:2px solid black;background:rgba(255,255,255,0.15);box-shadow:0 0 6px 2px rgba(255,255,255,0.2);}";
css_kieg+=".box_nev2>div>img{width:182px;max-width:182px}";
css_kieg+=".torrent_new, .torrent_gold, .torrent_hidden, .torrent_ok, .torrent_unchecked, .torrent_err {margin:0;height:24px;width:24px;float:none;display:inline-block;}";
css_kieg+=".torrent_konyvjelzo2, .torrent_ok, .torrent_unchecked, .torrent_new{background:none;margin:0;height:24px;width:24px;display:inline-block;}";
css_kieg+=".box_nev_mini, .siterank, .torrent_txt, .torrent_konyvjelzo, .torrent_konyvjelzo2{float:none;}";
css_kieg+=".torrent_txt{width: 208px;}";
css_kieg+=".box_nagy{width:400px;height:auto;float:none;padding:0;}";
css_kieg+=".box_nagy2{width:auto;height:auto;float:none;padding:0}";
css_kieg+=".box_nev2{height:auto;width:auto;position:relative;float:none;display: flex;}";
css_kieg+=".keptar{min-height:268px;background:rgba(255,255,255,0.1);}";
css_kieg+=".tabla_szoveg{padding-top:30px;width: 218px;}";
css_kieg+=".info{position:absolute;top:0;left:182px;right:0px;background:rgba(255,255,255,0.1);height:24px;display:inline-block;overflow:hidden;}";
css_kieg+=".box_alap_img{position:absolute;top:-8px;right:-6px;}";
css_kieg+=".torrent_lenyilo,.torrent_lenyilo2{width:400px;height:268px;position:absolute;top:0;left:0;border-radius:4px;overflow:hidden;margin:0;border:none;background:rgba(0,0,0,0.7);z-index: 100;}";
css_kieg+=".torrent_lenyilo_tartalom center{display:none;}";
css_kieg+=".alcim2{color:rgba(255,255,255,0.7);display:block;}";
css_kieg+=".ev{color:rgba(255,255,255,0.5);font-size:16px;font-weight:bold;}";
css_kieg+=".cimkek{margin-top:4px;max-width: 208px;overflow-wrap: break-word;}";
css_kieg+=".cimkek span{display: inline-block;border-radius:3px;margin:0 2px 2px 0;text-shadow:none; background:rgba(255,255,255,0.1);padding:1px 4px; font-size:8px;transition:all 0.3s ease}";
css_kieg+=".keszitok{margin-top:4px;max-width: 208px;overflow-wrap: break-word;}";
css_kieg+=".keszitok span{display:inline-block; border-radius:3px; margin:0 2px 2px 0; color:rgba(0,0,0,1); text-shadow:none; background:rgba(255,255,255,0.4); padding:1px 4px; font-size:8px; transition:all 0.3s ease; }";
css_kieg+=".feltolto_szin {color:rgba(255,255,255,0.3);}";
css_kieg+=".zar{position:absolute;top:0;right:0;background:white;color:black;padding:2px 4px;border-radius:0 4px;transition:all 0.3s ease;cursor: pointer;}";
css_kieg+=".zar:hover{background:black;color:white}";
css_kieg+=".imdb{height:24px;padding:0 2px;display:inline-block;vertical-align:middle;text-align:center;}";
css_kieg+=".imdb svg{height:12px;display:block;}";
css_kieg+=".imdb svg path{fill: rgba(255,255,255,0.5) !important;}";
css_kieg+="span.felesle{display:inline-block;vertical-align: middle;}";
css_kieg+="div.felesle{display:flex;flex-direction: column;}";
css_kieg+="div.felesle div{max-height:12px;}";
css_kieg+=".felesle svg{width:12px;height:12px;}";
css_kieg+=".info svg path,.info svg polygon{fill:white}";
css_kieg+=".szint{display:inline-block;}";
css_kieg+=".szint .szint{fill:rgba(255,255,255,0.3)}";
css_kieg+=".sznt_1 #sznt_1{fill:white}";
css_kieg+=".sznt_2 #sznt_1, .sznt_2 #sznt_2{fill:white}";
css_kieg+=".sznt_3 #sznt_1, .sznt_3 #sznt_2, .sznt_3 #sznt_3{fill:white}";
css_kieg+=".sznt_4 #sznt_1, .sznt_4 #sznt_2, .sznt_4 #sznt_3, .sznt_4 #sznt_4{fill:white}";
css_kieg+=".sznt_5 #sznt_1, .sznt_5 #sznt_2, .sznt_5 #sznt_3, .sznt_5 #sznt_4, .sznt_5 #sznt_5{fill:white}";
css_kieg+=".sznt_6 #sznt_1, .sznt_6 #sznt_2, .sznt_6 #sznt_3, .sznt_6 #sznt_4, .sznt_6 #sznt_5, .sznt_6 #sznt_6{fill:white}";
css_kieg+=".info svg{vertical-align:middle}";
$("head").append('<style type="text/css">'+css_kieg+'</style>');
$('img.infobar_ico').mouseover();
$('.box_nev2 div[id^="borito"]').addClass('keptar').css({'height':'auto','float':'left','position':'relative','left':'0px','top':'0px','padding':'0','background':'rgba(255,255,255,0.1)'});//képtartó

$( document ).ready(function() {console.log( "ready!" );});

$('.box_torrent').each(function(){
    if($(this).find('.torrent_new').length !== 0)$(this).addClass('uj');
    var i,doboz="<br>",szalag="";$(this).find('infobar').remove();$(this).find('.users_box_sepa').remove();
    /*könyvjelző*/$(this).find('.torrent_konyvjelzo2').html(jelek.csillag);i=$(this).find('.torrent_konyvjelzo2');szalag+=i.prop('outerHTML'); $(this).find('.torrent_konyvjelzo2').remove();
    /*dátum*/i=$(this).find('.box_feltoltve2').html(); $(this).find('.box_feltoltve2').remove(); doboz+=i.replace("<br>", " ")+"<br>";
    /*méret*/i=$(this).find('.box_meret2').html(); $(this).find('.box_meret2').remove(); doboz+=i+"<br>";
    /*ikon*/i=$(this).find('.box_alap_img').prop('outerHTML'); $(this).find('.box_alap_img').remove();szalag+=i;
    /*arány*/i=$(this).find('.box_d2').html(); $(this).find('.box_d2').remove(); szalag+="<span class='szint sznt_"+i.length+"'>"+jelek.szint+"</span> ";
    /*feltöltők*/i=$(this).find('.box_s2').html(); $(this).find('.box_s2').remove(); szalag+="<span class='felesle'><div class='felesle'><div class='fel'>"+jelek.fel+i+"</div>";
    /*letöltők*/i=$(this).find('.box_l2').html(); $(this).find('.box_l2').remove(); szalag+="<div class='le'>"+jelek.le+i+"</div></div></span>";
    /*imdb*/if($(this).find('.infolink').length !== 0){$(this).find('.infolink b').remove();i=$(this).find('.infolink').html().replace("imdb: ", "");i=$(this).find('.infolink').html(i).prop('outerHTML'); $(this).find('.infolink').remove();szalag+="<span class='imdb'>"+jelek.imdb+i+"</span>";}
    /*ellenőrzött*/if($(this).find('.torrent_ok').length !== 0){i=$(this).find('.torrent_ok').html(jelek.pipa).prop('outerHTML'); $(this).find('.torrent_ok').remove();szalag+=i;}
    /*ellenőrzés alatt*/if($(this).find('.torrent_unchecked').length !== 0){i=$(this).find('.torrent_unchecked').html(jelek.homokora).prop('outerHTML'); $(this).find('.torrent_unchecked').remove();szalag+=i;}
    /*imdb*/if($(this).find('.infolink').length !== 0){$(this).find('.infolink b').remove();i=$(this).find('.infolink').html().replace("imdb: ", "");i=$(this).find('.infolink').html(i).prop('outerHTML'); $(this).find('.infolink').remove();szalag+="<span class='imdb'>"+jelek.imdb+i+"</span>";}
    /*új*/if($(this).find('.torrent_new').length !== 0){i=$(this).find('.torrent_new').html(jelek.csill).prop('outerHTML'); $(this).find('.torrent_new').remove();szalag+=i;}
    /*cím*/i=$(this).find(".torrent_txt>a>nobr").text(); var x=i.split('.'), ev=0, cim='', cimkek='', cimkek_be=false, keszitok='';
      for(var j=0;j<x.length;j++){
          var ugras = false;
          if(!isNaN(x[j])){ev=parseInt(x[j]);if(ev<1900)ev=0; else {ugras = cimkek_be = true;}}
          if(keszito_lista.includes(x[j])){ugras = cimkek_be = true; keszitok+='<span>'+x[j]+'</span>';}
          if(!ugras){
              if(cimke_lista.includes(x[j]))cimkek_be=true;
              if(cimkek_be){
                  cimkek+='<span>'+x[j]+'</span>';
              }else{
                  cim+=x[j]+' ';
              }
          }
        }
      $(this).find(".torrent_txt>a>nobr").after("<span>"+cim+"</span>");$(this).find(".torrent_txt>a>nobr").remove();
      if(keszitok!='')$(this).find(".torrent_txt>a").after("<div class='keszitok'>"+keszitok+"</div>");
      if(cimkek!='')$(this).find(".torrent_txt>a").after("<div class='cimkek'>"+cimkek+"</div>");
    /*alcím*/if($(this).find('.siterank>span').length !== 0){i=$(this).find('.siterank>span').html();$(this).find('.siterank>span').remove();$(this).find(".torrent_txt>a").after("<div class='alcim2'>"+i+"</div>");}
    /*év*/if(ev>0)$(this).find(".alcim2").after("<div class='ev'>"+ev+"</div>");
    /*anonymus*/i=$(this).find('.box_feltolto2').html();doboz+="<br>"+i; $(this).find('.box_feltolto2').remove();
    $(this).find('.tabla_szoveg').prepend("<div class='info'>"+szalag+"</div>");
    $(this).find('.torrent_txt').append(doboz);
    $(this).next().remove();
    $($(this).next()).detach().appendTo($(this));
    $(this).find('.torrent_lenyilo, .torrent_lenyilo2').bind("DOMSubtreeModified",function(){$(this).append('<div onclick="$(this).parent().hide()" class="zar">'+jelek.iksz+'</div>');});
});