// ==UserScript==
// @name        Howrse | Manege: inschrijving stalling v1.1
// @namespace   NL howrse
// @description automatische inschrijving stalling bos/berg/eigen
// @include     http*://nl.howrse.com/elevage/chevaux/centreInscription*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21026/Howrse%20%7C%20Manege%3A%20inschrijving%20stalling%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/21026/Howrse%20%7C%20Manege%3A%20inschrijving%20stalling%20v11.meta.js
// ==/UserScript==

function randomBetween(min, max) {
    if (min < 0) {
        return Math.floor(min + Math.random() * (Math.abs(min)+max));
    }else {
        return Math.floor(min + Math.random() * max);
    }
}

console.log ("RegistreerManege=" + sessionStorage.getItem("RegistreerManege")) 

// bypass alert messages
unsafeWindow.alert = function() {
    console.log.apply(console, arguments);
    console.log ("Bevestigd!")
    return true;
};

// bypass alert messages
unsafeWindow.confirm = function() {
    console.log.apply(console, arguments);
    console.log ("Bevestigd!")
    return true;
};

// bypass alert messages
Window.alert = function() {
    console.log.apply(console, arguments);
    console.log ("Bevestigd!")
    return true;
};

// bypass alert messages
Window.confirm = function() {
    console.log.apply(console, arguments);
    console.log ("Bevestigd!")
    return true;
};




if (sessionStorage.getItem("RegistreerManege") == "willekeurig") 
{ 
  
setTimeout(function(){ customCheckboxClick('fourrage'); }, 1750+randomBetween(50,450));  
setTimeout(function(){ customCheckboxClick('avoine'); }, 2000+randomBetween(50,450));    
setTimeout(function(){ document.getElementsByClassName("button button-style-0")[0].click(); }, 2500+randomBetween(50,450));   
  
  
setTimeout(function(){ 
  for (i = 0; i < document.getElementsByClassName("grid-cell spacer-small-top spacer-small-bottom").length; i++) {
   if (document.getElementsByClassName("grid-cell spacer-small-top spacer-small-bottom")[i].innerHTML.indexOf('60 dagen') > 1) { document.getElementsByClassName("grid-cell spacer-small-top spacer-small-bottom")[i].getElementsByTagName("a")[0].click(); }
   }
}, 4000+randomBetween(50,450));

setTimeout(function(){
   document.getElementsByClassName("highlight")[0].getElementsByTagName("strong")[(document.getElementsByClassName("highlight")[0].getElementsByTagName("strong").length)-1].click();
//(document.getElementsByClassName("highlight")[0].getElementsByTagName("strong").length)-1
  
  // verander onclick event zonder waarschuwingsvraag te krijgen: AjaxJSON($.extend(DoCentreInscriptionAjax, {'params': 'id=9071806&centre=86354&duree=30&elevage='}))
  
//    console.log ( document.getElementsByClassName("highlight")[0].getElementsByTagName("strong")[0].innerHTML; );
 // onclickEvent=document.getElementById("table-0").getElementsByClassName("align-right button button-style-8")[3].getAttribute("onclick").match("AjaxJSON(.*)'")[0]+'}))';
 // document.getElementById("table-0").getElementsByClassName("align-right button button-style-8")[3].setAttribute("onclick", onclickEvent);
 // document.getElementById("table-0").getElementsByClassName("align-right button button-style-8")[3].click();
 
  
}, 6500+randomBetween(50,450));
}

if (sessionStorage.getItem("RegistreerManege") == "bos") 
{ 
  // zoek naar eerste knopje gratis en klik er op voor te registreren
  setTimeout(function(){ customCheckboxClick('douche'); }, 2500);  
  setTimeout(function(){ customCheckboxClick('foret'); }, 3500);    
  setTimeout(function(){ document.getElementsByClassName("button button-style-0")[0].click() }, 4500);      
  setTimeout(function(){ document.getElementsByClassName("highlight")[0].getElementsByTagName("strong")[0].click(); }, 6500);
}

if (sessionStorage.getItem("RegistreerManege") == "berg") 
{ 
  // zoek naar eerste knopje gratis en klik er op voor te registreren
  setTimeout(function(){ customCheckboxClick('douche'); }, 2500);  
  setTimeout(function(){ customCheckboxClick('montagne'); }, 3500);    
  setTimeout(function(){ document.getElementsByClassName("button button-style-0")[0].click() }, 4500);      
  setTimeout(function(){ document.getElementsByClassName("highlight")[0].getElementsByTagName("strong")[0].click(); }, 6500);
}




if (sessionStorage.getItem("RegistreerManege") == "eigen") { 
  // klik op gereserveerde stallen
  setTimeout(function(){ document.getElementById("tab-box-reserve").getElementsByClassName("tab-action")[0].onclick()  }, 2500);

  // zoek naar eerste knopje gratis en klik er op voor te registreren
  setTimeout(function(){  
   for (i=0; i < document.getElementsByClassName("button button-style-8").length ; i++ ) { 
       if (document.getElementsByClassName("button button-style-8")[i].innerHTML.indexOf("Gratis") >= 1 ) { 
           document.getElementsByClassName("button button-style-8")[i].click(); 
       }
   }      
  }, 4500);
}

setTimeout(function(){ location.href=location.href; }, 12000+randomBetween(50,450)); 



