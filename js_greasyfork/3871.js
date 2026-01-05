// ==UserScript==
// @name        Roll
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     0.131
// @grant       none
// @description faire des jets avec prise en comp des stats via des compétences
// @downloadURL https://update.greasyfork.org/scripts/3871/Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/3871/Roll.meta.js
// ==/UserScript==

var re = new RegExp("/roll [a-z]+");

var competenceFormule = new Object();

if (!String.prototype.contains) {
    String.prototype.contains = function(s, i) {
        return this.indexOf(s, i) != -1;
    }
}

$.ajax({
  type: 'GET',
  url: "https://docs.google.com/uc?export=download&id=0B4Igp0h82K3yUDc4NWdQNEZQY0k",
  async: false,
  jsonpCallback: 'jsonCallbackComps_0',
  contentType: "application/json",
  dataType: 'jsonp',
  success: function(json) {

    var tmpComp = json.comps.split("|");
    for(var j = 0; j < tmpComp.length; j++)
      competenceFormule[tmpComp[j].split(":")[0]] = tmpComp[j].split(":")[1];
    },
  error: function(e) {
   console.log(e.message);
  }
});
    
var getStats = function(stat){
   switch(stat){
     case "f" :
       return parseInt($('#statistiques .infos .stat_1_entier').text());
       break;
     case "a":
       return parseInt($('#statistiques .infos .stat_2_entier').text());
       break;
     case "r":
       return parseInt($('#statistiques .infos .stat_3_entier').text());
       break;
     case "p":
       return parseInt($('#statistiques .infos .stat_4_entier').text());
       break;
     case "fu":
       return parseInt($('#statistiques .infos .stat_5_entier').text());
       break;
     case "i":
       return parseInt($('#statistiques .infos .stat_6_entier').text());
       break;
     case "m":
       return parseInt($('#statistiques .infos .stat_7_entier').text());
       break;
     case "ing":
       return parseInt($('#statistiques .infos .stat_8_entier').text());
       break;
   }
} 

var computeValue = function(comp){
  if(competenceFormule[comp]!= undefined)
  {
      var compVal = 0;
      var tmpVal = competenceFormule[comp].split(",");
      for(var i = 0; i < tmpVal.length; i++)
      {
        var tmp = tmpVal[i].split(';');
        compVal += parseFloat(eval(tmp[0])) * getStats(tmp[1]);
      }
      compVal = parseInt(compVal/6);    
    
    return (100- compVal);
  }
  else return undefined;
}

var retrieveValue = function(facesde, comp, diff)
{
  var chatContent = $("#chatContent").text();
  chatContent = chatContent.trim().replace(/[^\S\n]{2,}/g, ' ');
            
   if(chatContent != "")
   {
     var lignes = chatContent.split("\n");
     for(var i = lignes.length-1; i >= 0; i--)
     {
       var ligne = lignes[i].trim();
       if(ligne != "" && ligne.charAt(0) != "[" && ligne.contains("lance 1 dé de " + facesde+" et fait"))
       {
         var result = parseInt(ligne.substring(ligne.indexOf("et fait")+7).trim()) + 100 -facesde;
         if(diff == undefined)
           $("#chatForm .text_chat").val("/me [couleur=jaune]fait "+ result +" à son jet de "+comp+"[/couleur]");
         else if (diff == "f" && result >= 25)
           $("#chatForm .text_chat").val("/me [couleur=vert]réussit[/couleur] [couleur=jaune]un jet facile de "+comp+" et fait "+ result+"[/couleur]");
         else if (diff == "f" && result < 25)
           $("#chatForm .text_chat").val("/me [couleur=rouge]rate[/couleur] [couleur=jaune]son jet facile de "+comp+" et fait "+ result+"[/couleur]");
         else if (diff == "m" && result >= 50)
           $("#chatForm .text_chat").val("/me [couleur=vert]réussit[/couleur] [couleur=jaune]un jet moyen de "+comp+" et fait "+ result+"[/couleur]");
         else if (diff == "m" && result < 50)
           $("#chatForm .text_chat").val("/me [couleur=rouge]rate[/couleur] [couleur=jaune]un jet moyen de "+comp+" et fait "+ result+"[/couleur]");
         else if (diff == "d" && result >= 75)
           $("#chatForm .text_chat").val("/me [couleur=vert]réussit[/couleur] [couleur=jaune]un jet difficile de "+comp+" et fait "+ result+"[/couleur]");
         else if (diff == "d" && result < 75)
           $("#chatForm .text_chat").val("/me [couleur=rouge]rate[/couleur] [couleur=jaune]un jet difficile de "+comp+" et fait "+ result+"[/couleur]");
         else if (parseInt(diff) != NaN && result >= parseInt(diff))
           $("#chatForm .text_chat").val("/me [couleur=vert]réussit[/couleur] [couleur=jaune]un jet de "+comp+" en faisant "+ result+" contre un seuil de "+parseInt(diff)+"[/couleur]");
         else if (parseInt(diff) != NaN && result < parseInt(diff))
           $("#chatForm .text_chat").val("/me [couleur=rouge]rate[/couleur] [couleur=jaune]un jet de "+comp+" en faisant "+ result+" contre un seuil de "+parseInt(diff)+"[/couleur]");
          
         console.log($("#chatForm .text_chat").val);
         nav.getChat().send();
         break;
       }
     }
   }
}

var jetDes = function(e) { 
		if (e.keyCode==13) {
      value = $("#chatForm .text_chat").val();
      if(value.match(re))
      {
        var comp = value.trim().split(" ")[1];
        var diff = value.trim().split(" ")[2];
        var facesde = computeValue(comp);
        if(facesde != undefined){
         value = '/roll 1d'+facesde;
        
         setTimeout(function(){ retrieveValue(facesde, comp, diff)},500);
        }
      }
   
      $("#chatForm .text_chat").val(value);
		}
}
  
document.addEventListener('keypress', jetDes, false);