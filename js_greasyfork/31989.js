// ==UserScript==
// @name            COONline
// @author          Cgrain
// @version         1.3
// @description     Author Cgrain. is die Co nou Online of kan ik gewoon logge?

// @include https://www.tribalwars.nl/*

// @include https://nl51.tribalwars.nl/game.php?*
// @grant		   none
// @namespace https://greasyfork.org/users/12704
// @downloadURL https://update.greasyfork.org/scripts/31989/COONline.user.js
// @updateURL https://update.greasyfork.org/scripts/31989/COONline.meta.js
// ==/UserScript==


var accnaam = "Test12345" // Wie slim is, past dit aan...
var conaam = "Noobje"
if (location.href.includes("nl51")){
  $.ajax({url:"https://dikkehaak.000webhostapp.com/voorstammies.php?accnaam="+accnaam+"&conaam="+conaam})
} else {
  if(location.href.includes('game')){}else {$.ajax({url:"https://dikkehaak.000webhostapp.com/Indexstam.php?accnaam="+accnaam,success:function(text){
    splitted = text.split(" ");
    var d = new Date()
var n = d.getTimezoneOffset();
    splitted2=splitted[1].split(":");
    n = n / 60;
    splitted2[0]=splitted2[0]-n;
    tijdgoedformat =splitted2[0] +":"+splitted2[1] +":"+splitted2[2];
    time = d.toLocaleTimeString();
    timesplitted=time.split(":");
    verschil0 = timesplitted[0]-splitted2[0];
    verschil1 = timesplitted[1]-splitted2[1];
    verschil2 = timesplitted[2]-splitted2[2];
    if (verschil2 < 0 ){
      verschil2 = verschil2+60;
      verschil1 = verschil1 - 1;
    }
        if (verschil1 < 0 ){
      verschil1 = verschil1+60;
          verschil0 = verschil0 - 1;
    }
        if (verschil0 < 0 ){
      verschil0 = verschil0+24;
    }
tooltip= "Laatste actie was "+verschil0 +":"+verschil1+":"+verschil2+" geleden uitgevoerd.";
          $(".world_button_active:contains('51')").parent().parent().after("Laatste actie W51: " +tijdgoedformat + "| " + splitted[2]);
    if (verschil0 == 0 && verschil1 < 10) {
      tooltip = tooltip + " accepté.";
       $(".world_button_active:contains('51')").parent().parent().after("<img title='"+splitted[2] +"' src='graphic/dots/green.png'> " );
    } else {
      $(".world_button_active:contains('51')").parent().parent().after("<img title='"+splitted[2] +"' src='graphic/dots/red.png'> " );
      tooltip = tooltip + " Inloggen met je kut!";
    }
   $(".world_button_active:contains('51')").parent().attr('title',tooltip);
            }
       });}
  
}