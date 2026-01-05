// ==UserScript==
// @name        Expo Full Wall au Parc de Rousseville
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     1.02
// @grant       none
// @description script pour l'expo full wall
// @downloadURL https://update.greasyfork.org/scripts/4998/Expo%20Full%20Wall%20au%20Parc%20de%20Rousseville.user.js
// @updateURL https://update.greasyfork.org/scripts/4998/Expo%20Full%20Wall%20au%20Parc%20de%20Rousseville.meta.js
// ==/UserScript==

var arr = { "256468" : "http://nsa34.casimages.com/img/2014/09/07/140907105849864672.png", 
           "256466" : "http://nsa33.casimages.com/img/2014/09/07/140907105853949851.png", 
           "256464": "http://nsa34.casimages.com/img/2014/09/07/140907105858562738.png",
           "256462": "http://nsa34.casimages.com/img/2014/09/07/140907105903663301.png",
           "256460": "http://nsa33.casimages.com/img/2014/09/07/140907105906112736.png",
           "256432": "http://nsa33.casimages.com/img/2014/09/07/14090710591692556.png",
           "256429": "http://nsa34.casimages.com/img/2014/09/07/140907105918991492.jpg",
           "256433" : "http://nsa34.casimages.com/img/2014/09/07/140907105920895309.jpg",
           "256444": "http://nsa33.casimages.com/img/2014/09/07/140907105930555122.png",
           "256446": "http://nsa33.casimages.com/img/2014/09/08/140908120517883570.png",
           "256447": "http://nsa33.casimages.com/img/2014/09/08/140908120524150023.png",
           "256449": "http://nsa34.casimages.com/img/2014/09/08/140908120539745590.png",
           "256451": "http://zupimages.net/up/14/37/aca4.png",
           "256453": "http://nsa33.casimages.com/img/2014/09/08/140908120600342716.png",
           "256455": "http://nsa33.casimages.com/img/2014/09/08/140908120601433161.png",
           "256458": "http://nsa34.casimages.com/img/2014/09/08/140908120616610656.png",
           "256497": "http://nsa33.casimages.com/img/2014/09/08/14090812062279736.png",
           "256499": "http://nsa33.casimages.com/img/2014/09/08/14090812062867807.png",
           "256501": "http://nsa34.casimages.com/img/2014/09/08/140908120634873226.png",
           "256503": "http://nsa34.casimages.com/img/2014/09/09/140909040530306036.png",
           "256505": "http://nsa33.casimages.com/img/2014/09/09/140909040541789874.png",
           "256507": "http://nsa33.casimages.com/img/2014/09/09/140909040602159773.png",
           "256495": "http://nsa34.casimages.com/img/2014/09/09/140909040643455413.png",
           "256493": "http://nsa34.casimages.com/img/2014/09/09/140909040649480928.png",
           "256483": "http://nsa33.casimages.com/img/2014/09/09/140909040653645780.png",
           "256481": "http://nsa34.casimages.com/img/2014/09/09/140909040657432219.png",
           "256480": "http://nsa34.casimages.com/img/2014/09/09/140909040702521490.png",
           "256478": "http://nsa33.casimages.com/img/2014/09/09/140909040714709112.png",
           "256476": "http://nsa33.casimages.com/img/2014/09/09/140909040718389905.png",
           "256474": "http://nsa33.casimages.com/img/2014/09/09/140909040733503758.png",
           "256472": "http://nsa33.casimages.com/img/2014/09/09/140909040744195233.png",
           "256470": "http://zupimages.net/up/14/37/xjil.png", 
          
          
           "256467": "http://nsa33.casimages.com/img/2014/09/07/140907105338902642.png",
           "256465": "http://nsa34.casimages.com/img/2014/09/07/140907105355855431.png",
           "256463": "http://nsa34.casimages.com/img/2014/09/07/140907105415391939.png",
           "256461": "http://nsa34.casimages.com/img/2014/09/07/140907105422423176.png",
           "256459": "http://nsa34.casimages.com/img/2014/09/07/14090710542738283.png",
           "256431": "http://nsa33.casimages.com/img/2014/09/07/140907105440122564.png",
           "256430": "http://nsa33.casimages.com/img/2014/09/07/140907105448702467.png",
           "256445": "http://nsa33.casimages.com/img/2014/09/07/140907105456215403.png",
           "256448": "http://nsa33.casimages.com/img/2014/09/07/140907105514402558.png",
           "256450": "http://nsa34.casimages.com/img/2014/09/07/140907105533321401.png",
           "256452": "http://nsa33.casimages.com/img/2014/09/07/14090710554059496.png",
           "256454": "http://nsa33.casimages.com/img/2014/09/07/140907105548429319.png",
           "256456": "http://nsa33.casimages.com/img/2014/09/07/140907105600766697.png",
           "256457": "http://nsa33.casimages.com/img/2014/09/07/140907105620683261.png",
           "256496": "http://nsa34.casimages.com/img/2014/09/07/140907105625947235.png",
           "256498": "http://nsa34.casimages.com/img/2014/09/07/1409071056305419.png",
           "256500": "http://nsa34.casimages.com/img/2014/09/07/140907105633409767.png",
           "256502": "http://nsa34.casimages.com/img/2014/09/07/140907105640774558.png",
           "256504": "http://nsa34.casimages.com/img/2014/09/07/140907105650204814.png",
           "256506": "http://nsa33.casimages.com/img/2014/09/07/140907105657749030.png",
           "256494": "http://nsa33.casimages.com/img/2014/09/07/140907105705507873.png",
           "256482": "http://nsa34.casimages.com/img/2014/09/07/140907105706642330.jpg",
           "256479": "http://nsa33.casimages.com/img/2014/09/07/140907105711871786.png",
           "256477": "http://nsa33.casimages.com/img/2014/09/07/140907105737868944.png",
           "256475": "http://nsa34.casimages.com/img/2014/09/07/140907105803306145.png",
           "256473": "http://nsa34.casimages.com/img/2014/09/07/140907105807139987.png",
           "256471": "http://nsa33.casimages.com/img/2014/09/07/14090710581348458.png",
           
           "256434": "http://nsa33.casimages.com/img/2014/09/07/140907105817969830.png",
           "256435": "http://nsa33.casimages.com/img/2014/09/08/140908120841135436.png",
           "256437": "http://nsa33.casimages.com/img/2014/09/08/140908120844504704.png",
           "256438": "http://nsa34.casimages.com/img/2014/09/08/140908120847207331.png",
           "256439": "http://nsa34.casimages.com/img/2014/09/08/140908120849401453.png",
           "256440": "http://nsa33.casimages.com/img/2014/09/08/14090812090368073.png",
           "256441": "http://nsa34.casimages.com/img/2014/09/08/140908120908419626.png",
           "256442": "http://nsa34.casimages.com/img/2014/09/08/140908120921199591.png",
           "256443": "http://nsa33.casimages.com/img/2014/09/08/140908120933757601.png",
           
           "256492": "http://nsa33.casimages.com/img/2014/09/08/140908120945329251.png",
           "256491": "http://nsa34.casimages.com/img/2014/09/07/140907105820737144.jpg",
           "256490": "http://nsa34.casimages.com/img/2014/09/07/140907105834323653.jpg",
           "256488": "http://nsa34.casimages.com/img/2014/09/08/140908120505460682.png",
           "256489": "http://nsa34.casimages.com/img/2014/09/07/140907105838196223.jpg",
           "256487": "http://nsa34.casimages.com/img/2014/09/08/1409081209425872.png",
           "256486": "http://nsa34.casimages.com/img/2014/09/07/1409071058391095.jpg",
           "256485": "http://nsa33.casimages.com/img/2014/09/07/140907105844826653.jpg",
           "256484": "http://nsa34.casimages.com/img/2014/09/08/140908120927567320.png"
          };


function checkPanneau() {
  if ($('#lieu_actuel') .text() .contains('326 Rue Hoblet'))
  {
    var databox = $('#zone_dataBox .dataBox');
    databox.each(function (index) {
      var id = $(this) .attr('id') .replace('"', '');
      if (id.contains('db_panneau_'))
      {
        id = id.replace('db_panneau_', '');
        if(arr[id])
        {
          if($(this).find('img').first().attr('src') != arr[id])
          {
            $(this).find('img').first().attr('src',arr[id]);
            $(this).css('max-width','80%').css('width','').css('min-width','300px').css('left','10%').css('margin-left','');
            $(this).find(".content").css('height','');
            $(this).find(".content div").first().css('overflow','auto').css('height','');
            $(this).find('img').first().css('max-width','100%').css('height','');
          }
          
          
        }
        
      }
    });
  }
}

var sol = ["http://image.noelshack.com/fichiers/2014/29/1405858454-expobase-1.png", "http://image.noelshack.com/fichiers/2014/29/1405858470-expobase2.png", "http://image.noelshack.com/fichiers/2014/29/1405858498-expobase3.png", "http://image.noelshack.com/fichiers/2014/29/1405858519-expobase4.png", "http://image.noelshack.com/fichiers/2014/29/1405858534-expobase5.png", "http://image.noelshack.com/fichiers/2014/29/1405876504-expobase-7.png", "http://image.noelshack.com/fichiers/2014/29/1405876520-expobase8.png", "http://image.noelshack.com/fichiers/2014/29/1405876540-expobase9.png", "http://image.noelshack.com/fichiers/2014/29/1405876552-expobase10.png", "http://image.noelshack.com/fichiers/2014/29/1405876572-expobase11.png", "http://image.noelshack.com/fichiers/2014/29/1405876613-expobase13.png", "http://image.noelshack.com/fichiers/2014/29/1405876628-expobase14.png", "http://image.noelshack.com/fichiers/2014/29/1405876644-expobase15.png", "http://image.noelshack.com/fichiers/2014/29/1405876658-expobase16.png", "http://image.noelshack.com/fichiers/2014/30/1405957399-expobase6.png", "http://image.noelshack.com/fichiers/2014/30/1405957424-expobase17.png", "http://image.noelshack.com/fichiers/2014/30/1405957444-expobase18.png", "http://image.noelshack.com/fichiers/2014/30/1405957463-expobase19.png", "http://image.noelshack.com/fichiers/2014/30/1405957478-expobase20.png", "http://image.noelshack.com/fichiers/2014/30/1405957503-expobase21.png", "http://image.noelshack.com/fichiers/2014/30/1405957518-expobase22.png"];
function checkSol() {
    if ($('#lieu_actuel') .text() .contains('326 Rue Hoblet'))
    {

  var d = new Date();
  var n = d.getTime();
  var i = Math.floor(n/60000)% (sol.length);  
  
  $('#carte_fond').css('background-image', 'url('+ sol[i] +')');
  }

}


(function () {
  
  var myVar = setInterval(function () {
    checkPanneau()
  }, 3000);
  
 var myVar2 = setInterval(function () {
    checkSol()
  }, 5000);
}) ();
