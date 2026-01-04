// ==UserScript==
// @name AntiSpam ForumWar
// @description Regler les conneries des stagiaires
// @author Singles
// @match  http://forumwar.herokuapp.com/room/*
// @run-at document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.6.4
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/27093
// @downloadURL https://update.greasyfork.org/scripts/31494/AntiSpam%20ForumWar.user.js
// @updateURL https://update.greasyfork.org/scripts/31494/AntiSpam%20ForumWar.meta.js
// ==/UserScript==



$(document).on('DOMNodeInserted', function(e) {
    if ( $(e.target).hasClass('m10') ) {
         
var message = $(e.target).text().substr($(e.target).text().indexOf(": ") + 1);
    
       
      if(message.toLowerCase().indexOf("@"+$('.pseudo').text().toLowerCase()) >= 0)
         {
         $(e.target).css( "color", "green" );
         }
    }
});






var jBlocked=new Array(0);
var counter=0;

$("#players li").css('width:90%');
$("#players li").append('<img class="mute" style="width:12px " src="http://image.noelshack.com/fichiers/2017/28/7/1500165872-if-volume-sound-speaker-mute-2203527.png" />');


$(".mute").click(function(){
    var flag=false;
      var joueur=$(this).parent().text();
 
        
          var ind=jQuery.inArray(joueur, jBlocked);
    console.log(jBlocked);
          if(ind!== -1)
          {
              
              jBlocked.splice(ind,1);
                          alert(joueur + " a été débloqué");
                     $(".m10 b:contains('" + joueur + "')").parent().show();

          }
          else
          {
               

                
              flag=true;
          }
      
    if(flag)
    {
  jBlocked.push(joueur);
   
    counter++;
            alert(joueur + " a été bloqué");

         }
});
(function loop() {
  setTimeout(function () {
      for( i=0; i<jBlocked.length;i++)
      {
          $(".m10 b:contains('" + jBlocked[i] + "')").parent().hide();

      }    console.log(jBlocked);


 
    loop();
  }, 800);
}());