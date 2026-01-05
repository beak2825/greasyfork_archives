// ==UserScript==
// @name        Howrse | Actions v2.7
// @namespace   NL howrse
// @include     http*://nl.howrse.com/elevage/chevaux/cheval?id=*
// @version     2.7
// @grant       none
// @description Howrse helper script inclusief verzorg / blup / test en debug
// @downloadURL https://update.greasyfork.org/scripts/21027/Howrse%20%7C%20Actions%20v27.user.js
// @updateURL https://update.greasyfork.org/scripts/21027/Howrse%20%7C%20Actions%20v27.meta.js
// ==/UserScript==

account = document.getElementsByClassName("header-account-avatar")[0].getElementsByTagName("img")[0].getAttribute("alt");
if ( account == "fleur79" ) { howrseInterface="classic"; } else { howrseInterface="slider"; }
console.log (account);
console.log (howrseInterface);

function randomBetween(min, max) {
    if (min < 0) {
        return Math.floor(min + Math.random() * (Math.abs(min)+max));
    }else {
        return Math.floor(min + Math.random() * max);
    }
}

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

function getCareActions() {
  // console.log(canVipSupprimerPenaliteSante);
//   window.alert (sessionStorage.getItem("verzorg-modus"))
//   window.alert (localStorage.getItem("verzorg-modus"))   
  if (canVipSupprimerPenaliteSante == false) { vipMember = 0; } else { vipMember = 1}
  console.log("VIP member: " + vipMember);
      careTime = document.getElementById("hour-body-content").getElementsByClassName("hour")[0].innerHTML      
      
      // console.log ( document.getElementById("origins-body-content").getElementsByClassName("horsename")[1].getAttribute("href").match("\d=(.*)")[1] )
      // console.log (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML);
      // if (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML <= 10) { window.alert("Ik stop");}
  if ( chevalAge >= 6 ) { if (document.getElementById("cheval-inscription") === undefined || document.getElementById("cheval-inscription") === null) { needsManege = 0 } else { needsManege = 1 }}
  
  if (document.getElementById("boutonPanser") === undefined || document.getElementById("boutonPanser") === null) { window.alert ("Borstelen bestaat niet!");}
  if (document.getElementById("boutonCarotte") === undefined || document.getElementById("boutonCarotte") === null) { window.alert ("Wortel bestaat niet!");}
  if ( chevalAge >= 6 && chevalAge <= 16 ) { if (document.getElementById("boutonJouer") === undefined || document.getElementById("boutonJouer") === null) { window.alert ("Speel bestaat niet!");} }
  if ( chevalAge > 6 && needsManege == 0) {
        if ( document.getElementById("center-tab-main").innerHTML.indexOf("bos") > 1 ) { manege = "bos" }
        if ( document.getElementById("center-tab-main").innerHTML.indexOf("berg") > 1 ) { manege = "berg" }
        if ( document.getElementById("center-tab-main").innerHTML.indexOf("strand") > 1 ) { manege = "strand" }        
  }     
  if ( chevalAge >= 18 ) { if (document.getElementById("boutonMash") === undefined || document.getElementById("boutonMash") === null) { window.alert ("Mengvoer bestaat niet!");} }
//      check rainbow on items
        // console.log (document.getElementById("boutonBalade-montagne-rainbow") )
       if ( chevalAge >= 18 && document.getElementById("boutonBalade-foret-rainbow") === null ) { foretRainbow = 0; console.log(foretRainbow); } else { foretRainbow = 1; console.log(foretRainbow); }  
       if ( chevalAge >= 18 && document.getElementById("boutonBalade-montagne-rainbow") === null ) { montagneRainbow = 0; console.log(montagneRainbow); } else { montagneRainbow = 1; console.log(montagneRainbow); }        
//     einde

  if (document.getElementById("boutonCaresser") === undefined || document.getElementById("boutonCaresser") === null) { window.alert ("Aai bestaat niet!");}
  if (document.getElementById("boutonBoire") === undefined || document.getElementById("boutonBoire") === null) { window.alert ("Drinken bestaat niet!");}
  if ( chevalAge < 6 ) { if (document.getElementById("boutonAllaiter") === undefined || document.getElementById("boutonAllaiter") === null) { console.log ("Voeden bestaat niet!");} }
  if ( chevalAge >= 6 ) { if (document.getElementById("boutonNourrir") === undefined || document.getElementById("boutonNourrir") === null) { window.alert ("Voederen bestaat niet!");} }
  if (document.getElementById("boutonCoucher") === undefined || document.getElementById("boutonCoucher") === null) { window.alert ("Naar bed sturen bestaat niet!");}
  if ( chevalAge >= 6 ) { if (document.getElementsByClassName("section-fourrage section-fourrage-target")[0] === undefined || document.getElementsByClassName("section-fourrage section-fourrage-target")[0] === null) { window.alert ("Veevoeder bestaat niet!");} }
  if ( chevalAge >= 18 ) { if (document.getElementsByClassName("section-avoine section-avoine-target")[0] === undefined || document.getElementsByClassName("section-avoine section-avoine-target")[0] === null) { window.alert ("Haver bestaat niet!");} }
  if ( chevalAge >= 36 ) { if ( document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0] === undefined || document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0] === null ) { needsUitrusting = 1 } else { needsUitrusting = 0; } }
  if ( document.getElementById("boutonPanser").getAttribute("class").indexOf("action-disabled") > 1 ) { needsBorstelen = 0 } else { needsBorstelen = 1 };
  if ( document.getElementById("boutonCarotte").getAttribute("class").indexOf("action-disabled") > 1 ) { needsWortel = 0 } else { needsWortel = 1 };
  if ( chevalAge >= 6 && chevalAge <= 16 ) { if ( document.getElementById("boutonJouer").getAttribute("class").indexOf("action-disabled") > 1 ) { needsSpeel = 0 } else { needsSpeel = 1 }; }
  if ( chevalAge >= 18 ) { if ( document.getElementById("boutonMash").getAttribute("class").indexOf("action-disabled") > 1 ) { needsMengvoer = 0 } else { needsMengvoer = 1 }; }    
  if ( document.getElementById("boutonCaresser").getAttribute("class").indexOf("action-disabled") > 1 ) { needsAai = 0 } else { needsAai = 1 };
  if ( document.getElementById("boutonBoire").getAttribute("class").indexOf("action-disabled") > 1 ) { needsDrinken = 0 } else { needsDrinken = 1 };
  if ( chevalAge < 6 ) { if ( document.getElementById("boutonAllaiter").getAttribute("class").indexOf("action-disabled") > 1 ) { needsVoeden = 0 } else { needsVoeden = 1 }; }
  if ( chevalAge >= 6 ) { if ( document.getElementById("boutonNourrir").getAttribute("class").indexOf("nourrir-entame") > 1 ) { needsVoederen = 0 } else { needsVoederen = 1 }; }
  if ( document.getElementById("boutonCoucher").getAttribute("class").indexOf("action-disabled") > 1 ) { needsNaarBedSturen = 0 } else { needsNaarBedSturen = 1 };
      
  // id boutonVeterinaire click

  if ( chevalAge >= 6 ) {
  VeevoederNeed = document.getElementsByClassName("section-fourrage section-fourrage-target")[0].innerHTML;
  VeevoederEat  = chevalJourFourrage;
  VeevoederFeed = VeevoederNeed - VeevoederEat;
  if ( VeevoederFeed < 0 ) { VeevoederFeed = 0; }
//  if ( document.getElementById("feeding").outerHTML.indexOf("is te mager") > 1 ) { if ( VeevoederEat = 20 ) { VeevoederFeed = 0 } else { VeevoederFeed = 20; } }
  if ( document.getElementById("feeding").outerHTML.indexOf("is te mager") > 1 ) { VeevoederFeed = 20; }         
  if ( document.getElementById("feeding").outerHTML.indexOf("is te dik") > 1 ) { VeevoederFeed = 0; }        
  }
      
  if ( chevalAge >= 18 ) {
  HaverNeed = document.getElementsByClassName("section-avoine section-avoine-target")[0].innerHTML;
  HaverEat  = chevalJourGranules;
  HaverFeed = HaverNeed - HaverEat;
  if ( HaverFeed < 0 ) { HaverFeed = 0; }        
  }

  gcdWindow.innerHTML = '<center>---[ <font color="red"><b>GetCareDetails</b></font> ]---</center>';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- ID: ' + chevalId;
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Leeftijd: ' + chevalAge;      
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Naam: ' + chevalNom;
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Geslacht: ' + chevalSexe; 

  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Bosritten: ' + b4 + '%';  
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Bergritten: ' + b5 + '%';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>';   
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Uithoudingsvermogen: ' + e1 + '%'; 
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Snelheid: ' + e2 + '%';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Dressuur: ' + e3 + '%';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Galop: ' + e4 + '%';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Draf: ' + e5 + '%';
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- Training Springen: ' + e6 + '%'; 
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>';

  if ( chevalAge >= 6 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsManege: ' + needsManege; }             
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsBorstelen: ' + needsBorstelen;        
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsWortel: ' + needsWortel;
  if ( chevalAge >= 6 && chevalAge <= 16 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsSpeel: ' + needsSpeel; }
  if ( chevalAge >= 18 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsMengvoer: ' + needsMengvoer; }  
    
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsAai: ' + needsAai;        
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsDrinken: ' + needsDrinken;
  if ( chevalAge >= 6 ) {
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- VeevoederNeed: ' + VeevoederNeed;
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- VeevoederEat: ' + VeevoederEat;   
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- VeevoederFeed: ' + VeevoederFeed; 
  }
  if ( chevalAge >= 18 ) {
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- HaverNeed: ' + HaverNeed;
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- HaverEat: ' + HaverEat;   
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- HaverFeed: ' + HaverFeed; 
  }        
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>';     
  if ( chevalAge < 6 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsVoeden: ' + needsVoeden; }
  if ( chevalAge >= 6 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsVoederen: ' + needsVoederen; }
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsNaarBedSturen: ' + needsNaarBedSturen;  
  if ( chevalAge >= 36 ) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- needsUitrusting: ' + needsUitrusting; }  
  if ( chevalAge > 6 && needsManege == 0) { gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>' + '- type manege: ' + manege; }              
  gcdWindow.innerHTML = gcdWindow.innerHTML + '<br>';

      if ( sessionStorage.getItem("verzorg-modus") == 1 ) {
	gcdWindow.innerHTML = gcdWindow.innerHTML + '<br><center>- Verzorg Modus -</center>'
        gcdWindow.innerHTML = gcdWindow.innerHTML + '<center>- ' + sessionStorage.getItem("paardenVerzorgd") + ' -</center>';
      if ( sessionStorage.getItem("paardenVerzorgd") >= randomBetween(1050,1100) ) {
            sessionStorage.setItem("verzorg-modus", 0);
            for (i = 0; i < document.getElementsByClassName("level-2 grid-table width-100 align-middle special").length; i++) { if (document.getElementsByClassName("level-2 grid-table width-100 align-middle special")[i].outerHTML.indexOf('Uitloggen') > 1) { document.getElementsByClassName("level-2 grid-table width-100 align-middle special")[i].click(); } }                                                                                      
      }
}      
      
} 
      

// doRegistreerManege()
function doRegistreerManege() {
      getCareActions();
      if ( needsManege == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doRegistreerManege()'; document.getElementById("cheval-inscription").getElementsByClassName("action action-style-2")[0].click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' is al geregistreerd op een manege.'; }
}
// end

// doBorstelen()
function doBorstelen() {
      getCareActions();
      if ( needsBorstelen == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doBorstelen()'; document.getElementById("boutonPanser").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' is al verzorgd vandaag.'; }
}
// end

// doWortel()
function doWortel() {
      getCareActions();
      if ( needsWortel == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doWortel()'; document.getElementById("boutonCarotte").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' heeft vandaag al een wortel gegeten.'; }
}
// end

// doMengvoer()
function doMengvoer() {
      getCareActions();
      if ( needsMengvoer == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doMengvoer()'; document.getElementById("boutonMash").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' heeft vandaag al mengvoer gegeten.'; }
}
// end

// doAai()
function doAai() {
      getCareActions();
      if ( needsAai == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doAai()'; document.getElementById("boutonCaresser").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' is al geaaid vandaag.'; }
}
// end

// doDrinken()
function doDrinken() {
      getCareActions();
      if ( needsDrinken == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doDrinken()'; document.getElementById("boutonBoire").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' heeft al te drinken gehad vandaag.'; }
}
// end

// doVoeden()
function doVoeden() {
      getCareActions();
      if ( needsVoeden == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doVoeden()'; document.getElementById("boutonAllaiter").click(); } else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' heeft al de fles gehad vandaag.'; }
}
// end


// doVoederen()
function doVoederen() {
      getCareActions();

if ( howrseInterface == "slider" ) {
//  if ( needsVoederen == 1 ) {
  if ( VeevoederFeed >= 1 ) {
    document.getElementById("boutonNourrir").click();
    document.getElementById("haySlider-sliderHidden").value = VeevoederFeed;
  if ( chevalAge >= 18 ) {    document.getElementById("oatsSlider-sliderHidden").value = HaverFeed;        }
    setTimeout(function(){ document.getElementById("feed-button").click(); }, 1000+randomBetween(50,450));       
  }   
}
      
if ( howrseInterface == "classic" ) {
//  if ( needsVoederen == 1 ) {
  if ( VeevoederFeed >= 1 ) {
    document.getElementById("boutonNourrir").click();
    document.getElementById("feedingHay").value = VeevoederFeed;
  if ( chevalAge >= 18 ) {    document.getElementById("feedingOats").value = HaverFeed;        }
    setTimeout(function(){ document.getElementById("feed-button").click(); }, 1000+randomBetween(50,450));       
  }   
}

}
//}
// end

// doNaarBedSturen()
function doNaarBedSturen() {
      getCareActions();
      if ( needsNaarBedSturen == 1 ) { logWindow.innerHTML = logWindow.innerHTML + '<br>' + '- doNaarBedSturen()'; document.getElementById("boutonCoucher").click(); 
      if ( sessionStorage.getItem("verzorg-modus") == 1 ) { 
	     if ( sessionStorage.getItem("paardenVerzorgd") == null ) { sessionStorage.setItem("paardenVerzorgd",1); }
	     x = Number(sessionStorage.getItem("paardenVerzorgd"));
           sessionStorage.setItem("paardenVerzorgd", x + 1);
      }
                                     }                                    
                                     else { logWindow.innerHTML = logWindow.innerHTML + '<br>' + chevalNom + ' is al naar bed gestuurd vandaag.'; }
}
// end

// doVerouderen()
function doVerouderen() {
      getCareActions();
      // als ma dan volgende demarken
      console.log (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML);
      if (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML == 0) { window.alert("Ik stop! VPs zijn op!");}      
      document.getElementById("boutonVieillir").click();
      setTimeout(function(){ document.getElementById("age").getElementsByClassName("button button-style-0")[0].click(); }, 1000+randomBetween(50,450));
}
// end

// doNavPrev()
function doNavPrev() {
      getCareActions();
      document.getElementById("nav-previous").click();
}
// end

// doNavPrev()
function doNavNext() {
      getCareActions();
      document.getElementById("nav-next").click();
}
// end

// doVerzorgen()
function doVerzorgen() {
      document.title = account + ": [ doVerzorgen ]"          
      // getCareActions();
      sessionStorage.setItem("verzorg-modus",1);
      sessionStorage.setItem("RegistreerManege", "willekeurig");
      setTimeout(function(){ doRegistreerManege(); }, randomBetween(50,450));
      setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450));
      if ( chevalAge < 6 ) { setTimeout(function(){ doVoeden(); }, 2000+randomBetween(50,450)); }
      if ( chevalAge >= 6 ) { setTimeout(function(){ doVoederen(); }, 2000+randomBetween(50,450)); }
      setTimeout(function(){ doNaarBedSturen(); }, 4000+randomBetween(50,450));
      setTimeout(function(){ doNavNext(); }, 5000+randomBetween(50,450));  
}
// end

// doReserve()
function doReserve() {
doTraining("uithoudingsvermogen");
}
// end

//     doPushCSO()
function doPushCSO() {
//     push-modus showspringen incl evt beginnerswedstrijden
      getCareActions();      
      sessionStorage.setItem("doPushCSO", 1);
      careTimeHour = careTime.match("(.*):")[1];
     if ( careTimeHour >= 8 && careTimeHour <= 19 && chevalEnergie >= 32 ) { setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450)); }
     if ( careTimeHour >= 20 || chevalEnergie <= 31) {
      sessionStorage.setItem("RegistreerManege", "willekeurig");         
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(50,450));         
           setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450)); 
           setTimeout(function(){ doVoederen(); }, 2000+randomBetween(50,450));  
           setTimeout(function(){ doNaarBedSturen(); }, 4000+randomBetween(50,450));           
           setTimeout(function(){ doNavNext(); }, 5500+randomBetween(50,450)); } 

      }      
//     einde

//     doPushCross()
function doPushCross() {
//     push-modus cross incl evt beginnerswedstrijden
      getCareActions();      
      sessionStorage.setItem("doPushCross", 1);
      careTimeHour = careTime.match("(.*):")[1];
     if ( careTimeHour >= 8 && careTimeHour <= 19 ) { setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-cross")[0].click(); }, 1000+randomBetween(50,450)); }
     if ( careTimeHour >= 20 ) { setTimeout(function(){ doNavNext(); }, 1000+randomBetween(50,450)); } 

      }      
//     einde



//      setTimeout(function(){       
//      if ( careTime != "20:00" || careTime != "20:30" || careTime != "Je pa" ) { document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }
//      }, 2000+randomBetween(50,450));
      
      //     check auto-inschrijving bij VIP-account, indien ingeschakeld -> uitschakelen!
      
//if ( vipMember == 1 ) {      
//      if ( document.getElementById("competition-head-title").getElementsByTagName("a")[0].getAttribute("data-tooltip").indexOf("uitschakelen") > 1) { compsAutoInschrijving = 1; }
//      if ( document.getElementById("competition-head-title").getElementsByTagName("a")[0].getAttribute("data-tooltip").indexOf("inschakelen") > 1) { compsAutoInschrijving = 0; }
//      if ( compsAutoInschrijving == 1 ) { document.getElementById("competition-head-title").getElementsByTagName("a")[0].click(); }     
//}
      // careTime = document.getElementById("history-0").getElementsByClassName("grid-cell last")[0].innerHTML.match("^.{0,5}")[0];
//      if ( needsBorstele ) { 
//            setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450));
//            setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 2000+randomBetween(50,450)); 


// end

// doRitjes("bos") / doRitjes("berg")
function doRitjes(x){
      // b4 = bos
      // b5 = berg
      
      setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450));
      
      if ( x == "bos") {
      if ( foretRainbow == 0) { setTimeout(function(){ document.getElementById("boutonBalade-foret").click(); }, 2000+randomBetween(50,450)); }
      if ( foretRainbow == 1) { setTimeout(function(){ document.getElementById("boutonBalade-foret-rainbow").click(); }, 2000+randomBetween(50,450)); }            
      // setTimeout(function(){ document.getElementById("boutonBalade-foret").click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){ 
      energie30min=document.getElementById("walk-foret-form").getElementsByTagName("script")[0].innerHTML.match('\-(.*?)\,')[1];      
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
            console.log (timetotrain)
      if ( timetotrain >= 10) { timetotrain = 10}
      if ( howrseInterface == "slider" ) { document.getElementById("walkforetSlider-sliderHidden").value=timetotrain*2; }
      if ( howrseInterface == "classic") { document.getElementById("walk-foret-form").getElementsByClassName("select")[0].value=timetotrain*2; }
      document.getElementById("walk-foret-submit").click();
      }, 3000+randomBetween(50,450));
      }      
      
      if ( x == "berg") {
      if ( montagneRainbow == 0) { setTimeout(function(){ document.getElementById("boutonBalade-montagne").click(); }, 2000+randomBetween(50,450)); }
      if ( montagneRainbow == 1) { setTimeout(function(){ document.getElementById("boutonBalade-montagne-rainbow").click(); }, 2000+randomBetween(50,450)); }                        
      // setTimeout(function(){ document.getElementById("boutonBalade-montagne").click(); }, 2000+randomBetween(50,450));            
      setTimeout(function(){ 
      energie30min=document.getElementById("walk-montagne-form").getElementsByTagName("script")[0].innerHTML.match('\-(.*?)\,')[1];      
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}            
      if ( howrseInterface == "slider" ) { document.getElementById("walkforetSlider-sliderHidden").value=timetotrain*2; }
      if ( howrseInterface == "classic") { document.getElementById("walk-montagne-form").getElementsByClassName("select")[0].value=timetotrain*2; }
      document.getElementById("walk-montagne-submit").click();
      }, 3000+randomBetween(50,450));
      }
      
      setTimeout(function(){ doAai(); }, 4000+randomBetween(50,450));  
      
      setTimeout(function(){ doWortel(); }, 5000+randomBetween(50,450));  
      
      setTimeout(function(){ doMengvoer(); }, 6000+randomBetween(50,450));  
                            
      setTimeout(function(){ doDrinken(); }, 7000+randomBetween(50,450)); 
      
      if ( x == "bos") {
      if ( foretRainbow == 0) { setTimeout(function(){ if ( b4 < 100 ) { document.getElementById("boutonBalade-foret").click(); } }, 8000+randomBetween(50,450)); }
      if ( foretRainbow == 1) { setTimeout(function(){ if ( b4 < 100 ) { document.getElementById("boutonBalade-foret-rainbow").click(); } }, 8000+randomBetween(50,450)); }                        
      // setTimeout(function(){ if ( b4 < 100 ) { document.getElementById("boutonBalade-foret").click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( b4 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}
      if ( howrseInterface == "slider" ) { document.getElementById("walkforetSlider-sliderHidden").value=timetotrain*2; }
      if ( howrseInterface == "classic") { document.getElementById("walk-foret-form").getElementsByClassName("select")[0].value=timetotrain*2; }
      document.getElementById("walk-foret-submit").click(); 
      } }, 9000+randomBetween(50,450));
      }
      
      if ( x == "berg") {
      if ( montagneRainbow == 0) { setTimeout(function(){ if ( b5 < 100 ) { document.getElementById("boutonBalade-montagne").click(); } }, 8000+randomBetween(50,450)); }
      if ( montagneRainbow == 1) { setTimeout(function(){ if ( b5 < 100 ) { document.getElementById("boutonBalade-montagne-foret").click(); } }, 8000+randomBetween(50,450)); }                                    
      // setTimeout(function(){ if ( b5 < 100 ) { document.getElementById("boutonBalade-montagne").click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( b5 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}            
      if ( howrseInterface == "slider" ) { document.getElementById("walkforetSlider-sliderHidden").value=timetotrain*2; }
      if ( howrseInterface == "classic") { document.getElementById("walk-montagne-form").getElementsByClassName("select")[0].value=timetotrain*2; }
      document.getElementById("walk-montagne-submit").click(); 
      } }, 9000+randomBetween(50,450));
      }       
                 
      setTimeout(function(){ doVoederen(); }, 10000+randomBetween(50,450));
      
      setTimeout(function(){ doNaarBedSturen(); }, 12000+randomBetween(50,450));
      
      setTimeout(function(){ doVerouderen(); }, 13000+randomBetween(50,450));      
}

// doTraining("uithoudingsvermogen") / doTraining("snelheid") / doTraining("dressuur") / doTraining("galop") / doTraining("draf") / doTraining("springen")
function doTraining(x){
      // e1 = uithoudingsvermogen
      // e2 = snelheid
      // e3 = dressuur
      // e4 = galop
      // e5 = draf
      // e6 = springen      

      setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450));      

      if ( x == "uithoudingsvermogen") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[0].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Endurance']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingEnduranceSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-endurance-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementEnduranceDuration").value=timetotrain*2; document.getElementById("entrainementEndurance").getElementsByClassName("button-text-0")[0].click(); }            

      }, 3000+randomBetween(50,450));          
      }

      if ( x == "snelheid") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[1].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Vitesse']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingVitesseSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-vitesse-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementVitesseDuration").value=timetotrain*2; document.getElementById("entrainementVitesse").getElementsByClassName("button-text-0")[0].click(); }                        
      }, 3000+randomBetween(50,450));          
      }

      if ( x == "dressuur") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[2].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Dressage']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingDressageSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-dressage-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementDressageDuration").value=timetotrain*2; document.getElementById("entrainementDressage").getElementsByClassName("button-text-0")[0].click(); }                        
      }, 3000+randomBetween(50,450));          
      }
      
      if ( x == "galop") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[3].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Galop']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingGalopSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-galop-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementGalopDuration").value=timetotrain*2; document.getElementById("entrainementGalop").getElementsByClassName("button-text-0")[0].click(); }                        
      }, 3000+randomBetween(50,450));          
      }
      
      if ( x == "draf") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[4].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Trot']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingTrotSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-trot-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementTrotDuration").value=timetotrain*2; document.getElementById("entrainementTrot").getElementsByClassName("button-text-0")[0].click(); }                        
      }, 3000+randomBetween(50,450));          
      }

      if ( x == "springen") {       
      setTimeout(function(){ document.getElementById("training-tab-main").getElementsByClassName("dashed")[5].getElementsByClassName("button button-style-14")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){
      energie30min=coefficientEnergie['Saut']/2;
      timetotrain=Math.floor(chevalEnergie / energie30min)/2;
      if ( timetotrain >= 10) { timetotrain = 10}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingSautSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-saut-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementSautDuration").value=timetotrain*2; document.getElementById("entrainementSaut").getElementsByClassName("button-text-0")[0].click(); }                        
      }, 3000+randomBetween(50,450));          
      }
      
      setTimeout(function(){ doAai(); }, 4000+randomBetween(50,450));  
      
      setTimeout(function(){ doWortel(); }, 5000+randomBetween(50,450));  
      
      setTimeout(function(){ doMengvoer(); }, 6000+randomBetween(50,450));  
                            
      setTimeout(function(){ doDrinken(); }, 7000+randomBetween(50,450)); 

      if ( x == "uithoudingsvermogen") { 
      setTimeout(function(){ if ( e1 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[0].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e1 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}                        
      if ( howrseInterface == "slider" ) { document.getElementById("trainingEnduranceSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-endurance-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementEnduranceDuration").value=timetotrain*2; document.getElementById("entrainementEndurance").getElementsByClassName("button-text-0")[0].click(); }            
      } }, 9000+randomBetween(50,450));
      }      
      
      if ( x == "snelheid") { 
      setTimeout(function(){ if ( e2 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[1].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e2 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}                
      if ( howrseInterface == "slider" ) { document.getElementById("trainingVitesseSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-vitesse-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementVitesseDuration").value=timetotrain*2; document.getElementById("entrainementVitesse").getElementsByClassName("button-text-0")[0].click(); }                        
      } }, 9000+randomBetween(50,450));
      }      

      if ( x == "dressuur") { 
      setTimeout(function(){ if ( e3 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[2].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e3 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}
      if ( howrseInterface == "slider" ) { document.getElementById("trainingDressageSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-dressage-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementDressageDuration").value=timetotrain*2; document.getElementById("entrainementDressage").getElementsByClassName("button-text-0")[0].click(); }                        
      } }, 9000+randomBetween(50,450));
      }      

      if ( x == "galop") { 
      setTimeout(function(){ if ( e4 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[3].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e4 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}                
      if ( howrseInterface == "slider" ) { document.getElementById("trainingGalopSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-galop-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementGalopDuration").value=timetotrain*2; document.getElementById("entrainementGalop").getElementsByClassName("button-text-0")[0].click(); }                        
      } }, 9000+randomBetween(50,450));
      }      

      if ( x == "draf") { 
      setTimeout(function(){ if ( e5 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[4].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e5 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}                
      if ( howrseInterface == "slider" ) { document.getElementById("trainingTrotSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-trot-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementTrotDuration").value=timetotrain*2; document.getElementById("entrainementTrot").getElementsByClassName("button-text-0")[0].click(); }                        
      } }, 9000+randomBetween(50,450));
      }      

      if ( x == "springen") { 
      setTimeout(function(){ if ( e6 < 100 ) {  document.getElementById("training-tab-main").getElementsByClassName("dashed")[5].getElementsByClassName("button button-style-14")[0].click(); } }, 8000+randomBetween(50,450));
      setTimeout(function(){ if ( e6 < 100 ) {                
      timetotrain=Math.floor((chevalEnergie - 15) / energie30min)/2;
      if ( timetotrain >= 2) { timetotrain = 1.5}                
      if ( howrseInterface == "slider" ) { document.getElementById("trainingSautSlider-sliderHidden").value=timetotrain*2; document.getElementById("training-saut-submit").click(); }
      if ( howrseInterface == "classic" ) { document.getElementById("entrainementSautDuration").value=timetotrain*2; document.getElementById("entrainementSaut").getElementsByClassName("button-text-0")[0].click(); }                        
      } }, 9000+randomBetween(50,450));
      }      

      setTimeout(function(){ doVoederen(); }, 10000+randomBetween(50,450));
      
      setTimeout(function(){ doNaarBedSturen(); }, 12000+randomBetween(50,450));
      
      setTimeout(function(){ doVerouderen(); }, 13000+randomBetween(50,450)); 
      
}
//     end

//     function doCompetition("dressuur")
function doCompetition(x) {
      sessionStorage.setItem("doCompetition", 1);
      getCareActions();
      if ( trotComplet == true ) { sessionStorage.setItem("doCompetition", 0); } else {
      careTime = document.getElementById("history-0").getElementsByClassName("grid-cell last")[0].innerHTML.match("^.{0,5}")[0];
      if ( careTime == "08:00" ) {
           setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450)); 
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 2000+randomBetween(50,450));            
      }
      if ( careTime == "10:30" ) {
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));            
      }
      if ( careTime == "12:30" ) {
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));            
      }
      if ( careTime == "14:30" ) {
           setTimeout(function(){ doAai(); }, 1000+randomBetween(50,450));  
           setTimeout(function(){ doWortel(); }, 2000+randomBetween(50,450));  
           setTimeout(function(){ doMengvoer(); }, 3000+randomBetween(50,450));  
           setTimeout(function(){ doDrinken(); }, 4000+randomBetween(50,450));            
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 5000+randomBetween(50,450));            
      }
      if ( careTime == "18:00" ) {
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));
      }
      if ( careTime == "20:00" ) {      
           sessionStorage.setItem("doCompetition", 0);            
           setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
           setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));
           setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));            
      }            
      }
}
      
//     einde


//     function doCompetitionRapide("dressuur")
function doCompetitionRapide(x) {
      getCareActions();
      setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450));      

      if ( x == "dressuur") {       
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 3000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 4000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 5000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 6000+randomBetween(50,450));            
      }

      if ( x == "showspringen") {       
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 2000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 3000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 4000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 5000+randomBetween(50,450));
      setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 6000+randomBetween(50,450));            
      }
           
      setTimeout(function(){ doAai(); }, 7000+randomBetween(50,450));  
      
      setTimeout(function(){ doWortel(); }, 8000+randomBetween(50,450));  
      
      setTimeout(function(){ doMengvoer(); }, 9000+randomBetween(50,450));  
                            
      setTimeout(function(){ doDrinken(); }, 10000+randomBetween(50,450));       
      setTimeout(function(){ doVoederen(); }, 11000+randomBetween(50,450));
      
      setTimeout(function(){ doNaarBedSturen(); }, 13000+randomBetween(50,450));
      
      setTimeout(function(){ doVerouderen(); }, 14000+randomBetween(50,450));    
}
//     einde

//     function doSpecialisationClassique()
function doSpecialisationClassique() {
      getCareActions();
      if ( needsUitrusting == 1 ) { 
           setTimeout(function(){ document.getElementById("specialisationClassique").getElementsByClassName(" button button-style-0")[0].click(); }, 1000+randomBetween(50,450)); 
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("img ")[0].click(); }, 2000+randomBetween(50,450));
           setTimeout(function(){ document.getElementById("modele-tapis-classique-1x").click(); }, 3000+randomBetween(50,450));
           setTimeout(function(){ document.getElementById("modele-selle-classique-1x").click(); }, 4000+randomBetween(50,450));
           setTimeout(function(){ document.getElementById("modele-bride-classique-1x").click(); }, 5000+randomBetween(50,450));
           setTimeout(function(){ document.getElementById("choisir-equipement-popup").getElementsByClassName("spacer-top button button-style-0")[0].click(); }, 6000+randomBetween(50,450));
           // setTimeout(function(){ location.href="/elevage/chevaux/cheval?id=" + chevalId }, 25000+randomBetween(50,450));
           // verouderen voor wedstrijden te kunnen doen
           //setTimeout(function(){ doBorstelen(); }, 8000+randomBetween(50,450));
           //setTimeout(function(){ doVoederen(); }, 9000+randomBetween(50,450));
           //setTimeout(function(){ doNaarBedSturen(); }, 11000+randomBetween(50,450));
           //setTimeout(function(){ doVerouderen(); }, 12000+randomBetween(50,450));    
            

      }
}
//     einde


//

//     function doBlupRapide()
function doBlupRapide() {
      document.title = account + ": [ doBlupRapide ]"      
      sessionStorage.setItem("doBlupRapide", 1);
      Bosritten = b4;
      Bergritten = b5;
       getCareActions();
       // console.log ("aantal VPs: " + document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML);
       // if (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML <= 10) { window.alert("Ik stop! VP's bijna op!"); }

//     verouderen tot 6 maanden
      if (chevalAge < 6)
      {
            //divstatus.innerHTML = '<center>... Verouderen tot 6 maanden ... </center>';            
            setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
            setTimeout(function(){ doVoeden(); }, 1000+randomBetween(50,450));
            setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
            setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                       
      }
//     einde
//     bij 6 maanden registreer manege
      if (chevalAge == 6 && needsManege == 1) {      

      if ( vipMember == 0 && account != "fleur79") {
           console.log ("ben geen VIP");
           sessionStorage.setItem("RegistreerManege", "berg");
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(400,600));        
      }

      if ( vipMember == 0 && account == "fleur79") {
           console.log ("ben geen VIP");
           sessionStorage.setItem("RegistreerManege", "eigen");
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(400,600));        
      }
            
      if ( vipMember == 1 ) {
           sessionStorage.setItem("RegistreerManege", "eigen");
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(400,600));        
      }          
      }
//     einde
//    vanaf 6 maanden verouderen tot 18 maanden
      if (chevalAge >= 6 && chevalAge < 18 && needsManege == 0) {
            setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
            setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
            setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
            setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                       
      }            
//     einde
//    vanaf 18 maanden tot bergritten compleet
      if (chevalAge >= 18 && chevalAge < 36 && b5 < 100) {
           doRitjes("berg");
      }            
//     einde
//    vanaf 18 maanden tot galop compleet
      if (chevalAge >= 18 && chevalAge < 36 && b5 == 100 && e4 < 100) {
           doTraining("galop");
      }
//     einde
      
//    3jaar:
      if ( chevalAge >= 36 && chevalAge <= 42 && b5 == 100 && needsUitrusting == 1 ) { doSpecialisationClassique();
                                                                                     setTimeout(function(){ location.href="/elevage/chevaux/cheval?id=" + chevalId }, 15000+randomBetween(50,450));} 
      
      if ( chevalAge >= 36 && chevalAge <= 42 && b5 == 100 && needsUitrusting == 0 ) {
           if ( account != "fleur79" ) {
           if ( careTime == "08:00" ) {
                setTimeout(function(){ doBorstelen(); }, 9000+randomBetween(50,450)); 
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 10000+randomBetween(50,450));            
           }
           if ( careTime == "10:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450));                     
           }
           if ( careTime == "12:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450));           
           }
           if ( careTime == "14:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450));                         
           }
           if ( careTime == "16:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450));  
           }
           if ( careTime == "18:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 1000+randomBetween(50,450));  
           }      
           if ( careTime == "20:30" ) {
                setTimeout(function(){ doAai(); }, 1000+randomBetween(50,450));                
                setTimeout(function(){ doVoederen(); }, 2000+randomBetween(50,450));
                setTimeout(function(){ doNaarBedSturen(); }, 4000+randomBetween(50,450));
                setTimeout(function(){ doVerouderen(); }, 5000+randomBetween(50,450));            
           }           
      }
      
           if ( account == "fleur79" ){
           setTimeout(function(){ doBorstelen(); }, 500+randomBetween(50,450)); 
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 2000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 3000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 4000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 5000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 6000+randomBetween(50,450));                                   
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-saut")[0].click(); }, 7000+randomBetween(50,450)); 
           setTimeout(function(){ doAai(); }, 8000+randomBetween(50,450));                
           setTimeout(function(){ doVoederen(); }, 9000+randomBetween(50,450));
           setTimeout(function(){ doNaarBedSturen(); }, 11000+randomBetween(50,450));
           setTimeout(function(){ doVerouderen(); }, 12000+randomBetween(50,450));        
                 
                 
           }
            }
//     einde
      
      
//    vanaf 44 maanden tot galop compleet
      if ( chevalAge >= 44 && b5 == 100 && e4 < 100 ) {
           doTraining("galop");
      }
//    vanaf 44 maanden tot draf compleet
      if ( chevalAge >= 44 && b5 == 100 && e4 == 100 && e5 < 100 ) {
           doTraining("draf");
      }     
//    vanaf 44 maanden tot draf compleet
      if ( chevalAge >= 44 && b5 == 100 && e4 == 100 && e5 == 100 && trotComplet == false ) {
           if ( account != "fleur79" ) {
           if ( careTime == "08:00" ) {
                setTimeout(function(){ doBorstelen(); }, 1000+randomBetween(50,450)); 
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 2000+randomBetween(50,450));            
           }
           if ( careTime == "10:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));                     
           }
           if ( careTime == "12:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));           
           }
           if ( careTime == "14:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));                         
           }
           if ( careTime == "16:30" ) {
                setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 1000+randomBetween(50,450));  
           }
           if ( careTime == "18:30" ) {
                setTimeout(function(){ doAai(); }, 1000+randomBetween(50,450));
                setTimeout(function(){ doWortel(); }, 2000+randomBetween(50,450)); 
                setTimeout(function(){ doMengvoer(); }, 3000+randomBetween(50,450)); 
                setTimeout(function(){ doDrinken(); }, 4000+randomBetween(50,450));                  
                setTimeout(function(){ doVoederen(); }, 5000+randomBetween(50,450));
                setTimeout(function(){ doNaarBedSturen(); }, 7000+randomBetween(50,450));
                setTimeout(function(){ doVerouderen(); }, 8000+randomBetween(50,450));            
           }
           }
            if ( account == "fleur79" ) {
           setTimeout(function(){ doBorstelen(); }, 500+randomBetween(50,450)); 
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 2000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 3000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 4000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 5000+randomBetween(50,450));                  
           setTimeout(function(){ document.getElementById("competition-body-content").getElementsByClassName("action action-style-4 competition-dressage")[0].click(); }, 6000+randomBetween(50,450));                                   
           setTimeout(function(){ doAai(); }, 8000+randomBetween(50,450));                
           setTimeout(function(){ doVoederen(); }, 9000+randomBetween(50,450));
           setTimeout(function(){ doNaarBedSturen(); }, 11000+randomBetween(50,450));
           setTimeout(function(){ doVerouderen(); }, 12000+randomBetween(50,450));        
                 
            }
      }

//    vanaf 36 maanden als galop, draf en dressuur compleet zijn, Specialiteit & Uitrusting gekozen en Dressuur Wedstrijden klaar zijn. Training Dressuur
      if (chevalAge >= 36 && b5 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && e3 < 100) {
           doTraining("dressuur");
      }            
//     einde           

//    vanaf 36 maanden als alles klaar! Manege gewisseld en alleen bosritjes nog hoeven
     
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "berg" && b4 < 100 && account != "fleur79") {
            doRitjes("bos");
      }
      
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "berg" && b4 < 100 && account == "fleur79") {
         unsafeWindow.confirm = function() {
         console.log.apply(console, arguments);
         console.log ("Bevestigd!")
         return true;
           };
         setTimeout(function(){ document.getElementById("center-tab-main").getElementsByClassName("button-text-3")[0].click(); }, 1000+randomBetween(400,600));            
         sessionStorage.setItem("RegistreerManege", "bos");
         setTimeout(function(){ doRegistreerManege(); }, 3000+randomBetween(400,600));            
      }
      
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "bos" && b4 < 100 && account == "fleur79") {
            doRitjes("bos");
      }      
      

//     einde
//    vanaf 36 maanden als blupper klaar is. begin dekking of pak dekking
      if (chevalAge >= 36 && b4 == 100 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true ) {
            // window.alert ("ik ben klaar")
           sessionStorage.setItem("doBlupRapide", 0);
           sessionStorage.setItem("merrieGedekt", 0)
           sessionStorage.setItem("doDekEnVerwerk", 0);           
//     als hengst dan dekking naar hoogste merrie           
            if (chevalSexe == "masculin") {
                  setTimeout(function(){ document.getElementById("reproduction-tab-0").getElementsByClassName("tab-action tab-action-select action action-style-4 saillir")[0].click(); }, 1000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("formMalePublicTypeMoi").click(); }, 3000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("boutonMaleReproduction").click(); }, 5000+randomBetween(50,450));
                  sessionStorage.setItem("gewenstVeulen", "feminin");                
                  sessionStorage.setItem("doDekEnVerwerk", 1);
                  sessionStorage.setItem("merrieGedekt", 1);
                  setTimeout(function(){ location.href = document.getElementById("history-0").getElementsByClassName("horsename")[0].getAttribute("href"); }, 7000+randomBetween(50,450));  
            }
//     einde
//     als merrie dan dekking van vaderdier            
            if (chevalSexe == "feminin") {
                  console.log ("ben een merrie");
                  sessionStorage.setItem("gewenstVeulen", "masculin");                                  
                  sessionStorage.setItem("doDekking", 1);
//                  window.alert( document.getElementById("origins-body-content").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1])
                    location.href="/elevage/chevaux/cheval?id=" + document.getElementById("origins-body-content").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1]
            }            
//     einde            
      }            
//     einde
}
//     einde doBlupRapide

//     function doBlupRapide2()
function doBlupRapide2() {
      sessionStorage.setItem("doBlupRapide2", 1);
      Bosritten = b4;
      Bergritten = b5;
       getCareActions();
       // console.log ("aantal VPs: " + document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML);
       // if (document.getElementById("boutonVieillir").getElementsByClassName("numbering")[0].innerHTML <= 10) { window.alert("Ik stop! VP's bijna op!"); }

//     verouderen tot 6 maanden
      if (chevalAge < 6)
      {
            //divstatus.innerHTML = '<center>... Verouderen tot 6 maanden ... </center>';            
            setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
            setTimeout(function(){ doVoeden(); }, 1000+randomBetween(50,450));
            setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
            setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                       
      }
//     einde
//     bij 6 maanden registreer manege
      if (chevalAge == 6 && needsManege == 1) {      
      if ( vipMember == 0 ) {
           console.log ("ben geen VIP");
           sessionStorage.setItem("RegistreerManege", "berg");
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(400,600));        
      }
      if ( vipMember == 1 ) {
           sessionStorage.setItem("RegistreerManege", "eigen");
           setTimeout(function(){ doRegistreerManege(); }, randomBetween(400,600));        
      }          
      }
//     einde
//    vanaf 6 maanden verouderen tot 18 maanden
      if (chevalAge >= 6 && chevalAge < 18 && needsManege == 0) {
            setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
            setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
            setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
            setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                       
      }            
//     einde
//    vanaf 18 maanden tot bergritten compleet
      if (chevalAge >= 18 && b5 < 100) {
           doRitjes("berg");
      }            
//     einde
//    vanaf 18 maanden tot galop compleet
      if (chevalAge >= 18 && b5 == 100 && e4 < 100) {
           doTraining("galop");
      }            
//     einde      
//    vanaf 18 maanden tot draf compleet
      if (chevalAge >= 18 && b5 == 100 && e4 == 100 && e5 < 100) {
           doTraining("draf");
      }            
//     einde
//    vanaf 36 maanden als galop en draf compleet zijn. Kies Specialiteit & Uitrusting
      if (chevalAge >= 36 && b5 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 1) {
            doSpecialisationClassique();
      }            
//     einde
//    vanaf 36 maanden als galop en draf compleet zijn, Specialiteit & Uitrusting gekozen zijn. Dressuur Wedstrijden.
      if (chevalAge >= 36 && b5 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == false) {
      if ( vipMember == 0 ) {
           console.log ("ben geen VIP (wedstrijden)");
           if ( sessionStorage.getItem("doCompetition") != 1 ) { doCompetition("dressuur"); }
      }
      if ( vipMember == 1 ) {
           doCompetitionRapide("dressuur");
      }            
      }            
//     einde
//    vanaf 36 maanden als galop, draf en dressuur compleet zijn, Specialiteit & Uitrusting gekozen en Dressuur Wedstrijden klaar zijn. Training Dressuur
      if (chevalAge >= 36 && b5 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && e3 < 100) {
           doTraining("dressuur");
      }            
//     einde
//    vanaf 36 maanden als alles klaar! Wissel manege als deze in de bergen is
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "berg" ) {
      if ( vipMember == 1 ) {            
      for (i = 0; i < document.getElementsByClassName("button button-style-3").length; i++) {
            if ( document.getElementsByClassName("button button-style-3")[i].innerHTML.indexOf("Annuleer verblijf") > 1 ) { 
                  onclickEvent=document.getElementsByClassName("button button-style-3")[i].parentElement.getElementsByTagName("script")[0].innerHTML.match("new(.*).send")[0]+"();"
                  document.getElementsByClassName("button button-style-3")[i].setAttribute("ondblclick", onclickEvent);
                  document.getElementsByClassName("button button-style-3")[i].ondblclick();
                  }
                  }
            setTimeout(function(){ sessionStorage.setItem("RegistreerManege", "bos"); }, 2500+randomBetween(50,450));
            setTimeout(function(){ doRegistreerManege(); }, 3000+randomBetween(50,450));                                  
      }            
      }            
//     einde
//    vanaf 36 maanden als alles klaar! Manege gewisseld en alleen bosritjes nog hoeven
      if ( vipMember == 0 ) {      
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "berg" && b4 < 100) {
            doRitjes("bos");
      }
      }      
      if ( vipMember == 1 ) {      
      if (chevalAge >= 36 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true && manege == "bos" && b4 < 100) {
            doRitjes("bos");
      }
      }
//     einde
//    vanaf 36 maanden als blupper klaar is. begin dekking of pak dekking
      if (chevalAge >= 36 && b4 == 100 && b5 == 100 && e3 == 100 && e4 == 100 && e5 == 100 && needsUitrusting == 0 && trotComplet == true ) {
           sessionStorage.setItem("doBlupRapide", 0);
           sessionStorage.setItem("merrieGedekt", 0)
           sessionStorage.setItem("doDekEnVerwerk", 0);           
//     als hengst dan dekking naar hoogste merrie           
            if (chevalSexe == "masculin") {
                  setTimeout(function(){ document.getElementById("reproduction-tab-0").getElementsByClassName("tab-action tab-action-select action action-style-4 saillir")[0].click(); }, 1000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("formMalePublicTypeMoi").click(); }, 3000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("boutonMaleReproduction").click(); }, 5000+randomBetween(50,450));
                  sessionStorage.setItem("gewenstVeulen", "feminin");                
                  sessionStorage.setItem("doDekEnVerwerk", 1);
                  sessionStorage.setItem("merrieGedekt", 1);
                  setTimeout(function(){ location.href = document.getElementById("history-0").getElementsByClassName("horsename")[0].getAttribute("href"); }, 7000+randomBetween(50,450));  
            }
//     einde
//     als merrie dan dekking van vaderdier            
            if (chevalSexe == "feminin") {
                  console.log ("ben een merrie");
                  sessionStorage.setItem("gewenstVeulen", "masculin");                                  
                  sessionStorage.setItem("doDekking", 1);
//                  window.alert( document.getElementById("origins-body-content").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1])
                    location.href="/elevage/chevaux/cheval?id=" + document.getElementById("origins-body-content").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1]
            }            
//     einde            
      }            
//     einde
}
//     einde doBlupRapide2


//     function doDekking()
function doDekking() {
      document.title = account + ": [ doDekking ]"      
      getCareActions();
      if (chevalSexe == "masculin" && chevalEnergie <= 35) {
                           setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
                           setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
                           setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
                           setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450)); 
      }
      if (chevalSexe == "masculin" && chevalEnergie > 35) {
                  setTimeout(function(){ document.getElementById("reproduction-tab-0").getElementsByClassName("tab-action tab-action-select action action-style-4 saillir")[0].click(); }, 1000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("formMalePublicTypeMoi").click(); }, 3000+randomBetween(50,450)); 
                  setTimeout(function(){ document.getElementById("boutonMaleReproduction").click(); }, 5000+randomBetween(50,450));
                  sessionStorage.setItem("doDekEnVerwerk", 1);
                  sessionStorage.setItem("doDekking", 0); // laatste            
                  sessionStorage.setItem("merrieGedekt", 1);
                  setTimeout(function(){ location.href = document.getElementById("history-0").getElementsByClassName("horsename")[0].getAttribute("href"); }, 25000+randomBetween(50,450));              
           }
}

//     einde

//     function doDekEnVerwerk()
function doDekEnVerwerk() {
      document.title = account + ": [ doDekEnVerwerk ]"            
           // window.alert (sessionStorage.getItem("merrieGedekt"))
       getCareActions();        
       if (chevalSexe == "feminin" && sessionStorage.getItem("merrieGedekt") == 1) { 
//      zolang dekknop niet beschikbaar             
             if (document.getElementById("reproduction-bottom").getElementsByClassName("disabled button button-style-0")[0] != undefined || document.getElementById("reproduction-bottom").getElementsByClassName("disabled button button-style-0")[0] != null ) {
             if (document.getElementById("reproduction-bottom").getElementsByClassName("disabled button button-style-0")[0].outerHTML.indexOf("disabled") > 1) {
                 setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
                 setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
                 setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
                 setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                       
             } } }
//     einde 
             
//     als dekknop beschikbaar pak dekking             
             if (document.getElementById("reproduction-bottom").getElementsByClassName("button button-style-0")[0] != undefined || document.getElementById("reproduction-bottom").getElementsByClassName("button button-style-0")[0] != null ) {
             if (document.getElementById("reproduction-bottom").getElementsByClassName("button button-style-0")[0].getAttribute("href").indexOf("jument") > 1) {
                 sessionStorage.setItem("merrieGedekt", 0);
                   sessionStorage.setItem("dekhengstId", document.getElementById("reproduction").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1])
                   console.log ( sessionStorage.getItem("dekhengstId") );
                 setTimeout(function(){ 
                        //                  if (document.getElementById("reproduction").getElementsByClassName("horsename")[0] != undefined || document.getElementById("reproduction").getElementsByClassName("horsename")[0] != null) 
                        //{ sessionstorage.setItem("dekhengstId", document.getElementById("reproduction").getElementsByClassName("horsename")[0].getAttribute("href").match("\d=(.*)")[1]) } else { console.log ("dekhengstId bestaat niet!?!?")}
      
                       document.getElementById("reproduction-bottom").getElementsByClassName("button-text-0")[0].click();  }, 10000+randomBetween(50,450));
             } } 
//     einde 
           
//     als echographie niet beschikbaar, verzorg en verouder
             if (document.getElementById("boutonEchographie") != undefined || document.getElementById("boutonEchographie") != null) {
             if (document.getElementById("boutonEchographie").getAttribute("class").indexOf("action-disabled") > 1 ) {
                 setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
                 setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));                   
                 setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
                 setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450));                            
             } }
//     einde 
                          
//     als echographie beschikbaar keuze voor echo? of verouder?

             if (document.getElementById("boutonEchographie") != undefined || document.getElementById("boutonEchographie") != null) {
             if (document.getElementById("boutonEchographie").getAttribute("class").indexOf("echographie") > 1 ) {
                 setTimeout(function(){ document.getElementById("boutonEchographie").click(); }, 1000+randomBetween(50,450));
                 setTimeout(function(){ console.log(document.getElementById("reproduction-tab-1").getElementsByClassName("col-1")[0].innerHTML); 
                                      if ( document.getElementById("reproduction-tab-1").getElementsByClassName("col-1")[0].innerHTML.indexOf("merrie") > 1) {console.log("veulen wordt merrie");
                                      sessionStorage.setItem("echoVeulen", "feminin"); 
                                      } else { console.log("veulen wordt hengst");
                                      sessionStorage.setItem("echoVeulen", "masculin"); } }, 2000+randomBetween(50,450));
                 setTimeout(function(){ doBorstelen(); }, 3000+randomBetween(50,450));
                 setTimeout(function(){ doVoederen(); }, 4000+randomBetween(50,450));                   
                 setTimeout(function(){ doNaarBedSturen(); }, 6000+randomBetween(50,450));      
                 setTimeout(function(){ doVerouderen(); }, 7000+randomBetween(50,450));                            
             } }
             
//     einde
//     als veulenen beschikbaar doe veulenen.
             setTimeout(function(){ 
             if (document.getElementById("boutonVeterinaire") != undefined || document.getElementById("boutonVeterinaire") != null) {
                    // altijd veulenen !!!
                   document.getElementById("boutonVeterinaire").click();
                   
    //               if ( sessionStorage.getItem("echoVeulen") == sessionStorage.getItem("gewenstVeulen") ) {
    //               document.getElementById("boutonVeterinaire").click(); } else { 
    //                       console.log("verlies veulen");
    //                       sessionStorage.setItem("doDekkingOpnieuw", 1);
    //                       setTimeout(function(){ doBorstelen(); }, randomBetween(50,450));
    //                       setTimeout(function(){ doVoederen(); }, 1000+randomBetween(50,450));
    //                       setTimeout(function(){ doNaarBedSturen(); }, 3000+randomBetween(50,450));      
    //                       setTimeout(function(){ doVerouderen(); }, 4000+randomBetween(50,450)); }
             }
                   }, 10000+randomBetween(50,450));
//     einde
//     als veulen geboren

// ==============
             if (location.href.indexOf("naissance") > 1) {
                   document.title = account + ": [ doVeulenen ]"      
                   if ( sessionStorage.getItem("echoVeulen") == sessionStorage.getItem("gewenstVeulen") ) {
                   sessionStorage.setItem("doDekEnVerwerk", 0);
                   sessionStorage.clear();
                   sessionStorage.setItem("doBlupRapide", 1);
                   setTimeout(function(){       showBox("profil-popup"); }, randomBetween(400,1000));
                   if (chevalSexe == 'masculin') { var Gender = "H " }
                   if (chevalSexe == 'feminin') { var Gender = "M " }      
                   var TotalGenetique = enduranceGenetique + vitesseGenetique + dressageGenetique + galopGenetique + trotGenetique + sautGenetique;
                   setTimeout(function(){ document.getElementById("horseNameName").value=Gender + Math.round(TotalGenetique*100) / 100;  }, randomBetween(1000,1500));
                   setTimeout(function(){ document.getElementById("horseNameAffixe").value=1149278;  }, randomBetween(1000,1500));            
                   setTimeout(function(){ document.getElementsByClassName("spacer-small-top button button-style-0")[0].click();  }, randomBetween(2000,2500));
//     geef bonus                        
//                   setTimeout(function(){ document.getElementById("bonuses-body-content").getElementsByClassName("cursor-pointer")[0].click(); }, 8000+randomBetween(50,450));     
//                   setTimeout(function(){ document.getElementById("bonus-popup-content").getElementsByClassName("button button-style-0")[0].click(); }, 10000+randomBetween(50,450));                         
//     einde geef bonus                         
                   setTimeout(function(){ doBlupRapide();  }, 25000+randomBetween(3000,4500));
                   }
                   else {
                         sessionStorage.setItem("doDekkingOpnieuw", 1);
                   setTimeout(function(){       showBox("profil-popup"); }, randomBetween(400,1000));
                   if (chevalSexe == 'masculin') { var Gender = "H " }
                   if (chevalSexe == 'feminin') { var Gender = "M " }      
                   var TotalGenetique = enduranceGenetique + vitesseGenetique + dressageGenetique + galopGenetique + trotGenetique + sautGenetique;
                   setTimeout(function(){ document.getElementById("horseNameName").value=Gender + Math.round(TotalGenetique*100) / 100;  }, randomBetween(1000,1500));
                   setTimeout(function(){ document.getElementById("horseNameAffixe").value=1149278;  }, randomBetween(1000,1500));            
                   setTimeout(function(){ document.getElementsByClassName("spacer-small-top button button-style-0")[0].click();  }, randomBetween(2000,2500));
                   //setTimeout(function(){ sessionStorage.setItem("doDekkingOpnieuw", 1); }, randomBetween(4500,5000));                        
                   setTimeout(function(){ location.href="/elevage/chevaux/cheval?id=" + chevalId }, 5000+randomBetween(3000,4500));            
                   }
      }             
// =============
      
// =============
//     als veulen verloren
      console.log("dekhengstId: " + sessionStorage.getItem("dekhengstId"));
      
      
// =============
             }
//     einde             
             

//     einde      


var gcdWindow = document.createElement("div");        // Create a <button> element
var t = document.createTextNode("gcdWindow");       // Create a text node
gcdWindow.style.position="fixed"
gcdWindow.style.top="62px"
gcdWindow.style.left="25px"
gcdWindow.style.width="400px"
gcdWindow.style.height="600px"
gcdWindow.style.border = "solid";
gcdWindow.style.fontSize = "small"
// gcdWindow.onclick=function(){doTest()}
gcdWindow.appendChild(t);
gcdWindow.innerHTML = '<center>---[ <font color="red"><b>GetCareDetails</b></font> ]---</center>';
 // Append the text to <button>
document.body.appendChild(gcdWindow);                    // Append <button> to <body>

var divstatus = document.createElement("div");        // Create a <button> element
var t = document.createTextNode("testborder");       // Create a text node
divstatus.style.position="fixed"
divstatus.style.top="62px"
divstatus.style.left="450px"
divstatus.style.width="1000px"
divstatus.style.height="16px"
divstatus.style.border = "solid"
divstatus.style.fontSize = "small"
divstatus.appendChild(t);
divstatus.innerHTML = '<center>... status ...</center>';
 // Append the text to <button>
document.body.appendChild(divstatus);                    // Append <button> to <body>

var logWindow = document.createElement("div");        // Create a <button> element
var t = document.createTextNode("testborder");       // Create a text node
logWindow.style.position="fixed"
logWindow.style.top="670px"
logWindow.style.left="25px"
logWindow.style.width="400px"
logWindow.style.height="200px"
logWindow.style.border = "solid";
logWindow.style.fontSize = "small"
//logWindow.onclick=function(){doTest()}
logWindow.appendChild(t);
logWindow.innerHTML = '<center>---[ <font color="red"><b>Logboek</b></font> ]---</center>';
 // Append the text to <button>
document.body.appendChild(logWindow);                    // Append <button> to <body>



// create buttons
var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Voederen");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="250px"
btn.style.left="1500px"
btn.style.width="90px"
btn.onclick=function(){doVoederen()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Drinken");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="250px"
btn.style.left="1600px"
btn.style.width="90px"
btn.onclick=function(){doDrinken()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Aai");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="250px"
btn.style.left="1700px"
btn.style.width="90px"
btn.onclick=function(){doAai()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Borstelen");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="275px"
btn.style.left="1500px"
btn.style.width="90px"
btn.onclick=function(){doBorstelen()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Wortel");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="275px"
btn.style.left="1600px"
btn.style.width="90px"
btn.onclick=function(){doWortel()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Mengvoer");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="275px"
btn.style.left="1700px"
btn.style.width="90px"
btn.onclick=function(){doMengvoer()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Naar bed");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="300px"
btn.style.left="1500px"
btn.style.width="90px"
btn.onclick=function(){doNaarBedSturen()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>
  
var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Manege");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="300px"
btn.style.left="1600px"
btn.style.width="90px"
btn.onclick=function(){doRegistreerManege()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>  

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Verouderen");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="300px"
btn.style.left="1700px"
btn.style.width="90px"
btn.onclick=function(){doVerouderen()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Nav-Prev");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="325px"
btn.style.left="1500px"
btn.style.width="90px"
btn.onclick=function(){doNavPrev()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Nav-Next");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="325px"
btn.style.left="1700px"
btn.style.width="90px"
btn.onclick=function(){doNavNext()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

// begin

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doVerzorgen");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="375px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doVerzorgen()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doBlupRapide (AIO 1) ");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="400px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doBlupRapide();}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doPushCSO");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="425px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doPushCSO()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>
// end

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doPushCross");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="450px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doPushCross()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doRitjes(bos)");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="550px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doRitjes("bos");}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>


var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doRitjes(berg)");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="575px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doRitjes("berg");}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doRitjes(strand)");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-4"
btn.style.top="600px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){window.alert ("strandritjes functie niet klaar!")}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>

var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("doReserve");       // Create a text node
btn.style.position="fixed"
btn.className = "button button-style-2"
btn.style.top="650px"
btn.style.left="1500px"
btn.style.width="290px"
btn.onclick=function(){doReserve()}
btn.appendChild(t);
 // Append the text to <button>
document.body.appendChild(btn);                    // Append <button> to <body>
// end


//     einde
//



// end

// end

// begin


setTimeout(function(){ 
  console.log ("----------")
  getCareActions();
}, 1000+randomBetween(50,450));

if ( sessionStorage.getItem("verzorg-modus") == 1 ) {
      
//     dek mijn merrie met openbare dekking van 500 tijdens verzorgen
//     if ( document.getElementById("reproduction-tab-0") === undefined || document.getElementById("reproduction-tab-0") === null ) { needsDekMijnMerrie = 0; } else {
//
//         if ( document.getElementById("reproduction-tab-0").getElementsByClassName("action action-style-4 saillir")[0] === undefined || document.getElementById("reproduction-tab-0").getElementsByClassName("action action-style-4 saillir")[0] === null ) {
//      needsDekMijnMerrie = 0; } else {
//            
//      if ( document.getElementById("reproduction-tab-0").getElementsByClassName("action action-style-4 saillir")[0].outerHTML.indexOf("action-disabled") > 1) { needsDekMijnMerrie = 0; } else { document.getElementById("reproduction-tab-0").getElementsByClassName("action action-style-4 saillir")[0].click(); }                                                                        
 //          } }     
//     end
      
//     check veulenen tijdens verzorgen
setTimeout(function(){      
      if (document.getElementById("boutonVeterinaire") === undefined || document.getElementById("boutonVeterinaire") === null) { needsVeulenen = 0 } else {
            sessionStorage.setItem("TerugNaVeulenenMerrieId", chevalId); 
            document.getElementById("boutonVeterinaire").click(); }
}, 1000+randomBetween(50,450));      
//     end

//     check terug naar merrie na veulenen tijdens verzorgen
if ( sessionStorage.getItem("TerugNaVeulenenMerrieId") > 0 ) {
      // window.alert ("terug naar:" + sessionStorage.getItem("TerugNaVeulenenMerrieId"))
     x = sessionStorage.getItem("TerugNaVeulenenMerrieId");
      sessionStorage.setItem("TerugNaVeulenenMerrieId", 0)
      location.href="/elevage/chevaux/cheval?id=" + x;
}
//     end

//     verzorgen      
      doVerzorgen();
//     end      
}


if (sessionStorage.getItem("doCompetition") == 1) { doCompetition(); }
if (sessionStorage.getItem("doReserve") == 1) { doReserve(); }

if (sessionStorage.getItem("doBlupRapide") == 1) { doBlupRapide(); }
if (sessionStorage.getItem("doBlupRapide2") == 1) { doBlupRapide2(); }

if (sessionStorage.getItem("doDekEnVerwerk") == 1) { doDekEnVerwerk(); }
if (sessionStorage.getItem("doDekking") == 1) { doDekking(); }

if (sessionStorage.getItem("doPushCSO") == 1) { console.log ("push-modus geactiveerd!!");
                                               doPushCSO(); }
                                               
if (sessionStorage.getItem("doPushCross") == 1) { console.log ("push-modus geactiveerd!!");
                                               doPushCross(); }                                               

if (sessionStorage.getItem("doDekkingOpnieuw") == 1) { console.log ("begin opnieuw!")
console.log (sessionStorage.getItem("dekhengstId"))
      sessionStorage.setItem("doDekkingOpnieuw", 0);
      sessionStorage.setItem("doDekking", 1);

                   location.href="/elevage/chevaux/cheval?id=" + sessionStorage.getItem("dekhengstId") 
                                                      
                                                     
                                                     }



