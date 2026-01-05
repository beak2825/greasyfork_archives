// ==UserScript==
// @name FullWall
// @namespace InGame
// @author Odul
// @date 22/11/2013
// @version 1.606
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Change la carte des batiments dans DC. D
//1.5 correction d un petit bug d affichage. Possibilite de changer l image de fond et d associer une musique a un lieu
//1.52 changement du lien vers le fichier sur drive (j'ai fait bugué le précédent..). Lorsque l'on rentre dans un batiment et qu'un son est associé mais que vous avez le son coupé l'icone du speaker rouge devient orange pour vous le signaler
//1.6 Désormais le script charge au départ la liste des décos pour accélérer le chargement aux entrées sorties des batiments et réduire le nombre de requêtes vers google drive (qui a deux fois temporairement suspendu mon compte à cause de ça). Pour les playslistes audio, ça démarre désormais plus à la première musique mais fonction de l'heure pour tenter de faire une vague synchro.
// 1.606 Dernière maj par Nasty 8/5/22
// @downloadURL https://update.greasyfork.org/scripts/1555/FullWall.user.js
// @updateURL https://update.greasyfork.org/scripts/1555/FullWall.meta.js
// ==/UserScript==

var maps = new Array();
var backgrounds = new Array();
var youtubeSounds = new Array();
var youtubeNbrInList = new Array();
var mp3Sounds = new Array();

function loadArrays(url,callbackNumber)
{
    $.ajax({
        type: 'GET',
        url: "https://docs.google.com/uc?export=download&id="+url,
        async: false,
        jsonpCallback: 'jsonCallback'+callbackNumber,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            for (var i=0 ; i < json.batiment.length ; i++)
            {
                var id = json.batiment[i][0];
                    if(json.batiment[i].length > 1  && json.batiment[i][1] != '')
                        maps[id]=json.batiment[i][1];
                    if(json.batiment[i].length > 2 && json.batiment[i][2] != '')
                        backgrounds[id]=json.batiment[i][2];
                    if(json.batiment[i].length > 3 && json.batiment[i][3] != '')
                    {
                        youtubeSounds[id]=json.batiment[i][3];
                        youtubeNbrInList[id]=1;
                    }
                    if(json.batiment[i].length > 4 && json.batiment[i][4] != '')
                        youtubeNbrInList[id]=json.batiment[i][4];
                    if(json.batiment[i].length > 5 && json.batiment[i][5] != '')
                        mp3Sounds[id]=json.batiment[i][5];
            }
                         
            loadMap();

            if(json.liens)
              for (var i=0 ; i < json.liens.length ; i++)
                loadArrays(json.liens[i],callbackNumber+"_"+(i+1));
        },
        error: function(e) {
           console.log(e.message);
        }
    });
}


function loadMap()
{
    var url = $('#carte_fond').css("background-image");
    var id = url.substring(url.lastIndexOf("_")+1, url.lastIndexOf("\."));        
  
    if(maps[id])
      $('#carte_fond').css('background-image', 'url(http://bit.ly/'+maps[id]+')');
    $('#whereAmI').text(id);

   
   if(backgrounds[id])
      $('#divFullWallBackground').css("display","block").css('background-image', 'url(http://bit.ly/'+backgrounds[id]+')');

   if(youtubeSounds[id])
   {
     if(youtubeNbrInList[id] && youtubeNbrInList[id]>1)
     {
       var milliseconds = ((new Date).getTime())%(90000*youtubeNbrInList[id]);
       var index = Math.floor(milliseconds/90000);
       $('iframe').attr("src","https://www.youtube.com/embed/"+youtubeSounds[id]+"&autoplay=1&loop=1&index="+index);
     }
     else
        $('iframe').attr("src","https://www.youtube.com/embed/"+youtubeSounds[id]+"&autoplay=1&loop=1");

     if(document.getElementById('fullsound').volume == 0)
       document.getElementById('endAudioFullSound').style.backgroundImage = 'url(http://nsa33.casimages.com/img/2014/04/23/140423082104156303.png)';                           
   } 
  else if (mp3Sounds[id])
  {
                         $("#fullsound").attr("src","http://bit.ly/"+mp3Sounds[id]);
                       var audio = document.getElementById('fullsound');
                       audio.load();
                       audio.play(); 
                       if(document.getElementById('fullsound').volume == 0)
                          document.getElementById('endAudioFullSound').style.backgroundImage = 'url(http://nsa33.casimages.com/img/2014/04/23/140423082104156303.png)';
  }
  else if (document.getElementById('fullsound').volume == 0)
      document.getElementById('endAudioFullSound').style.backgroundImage = 'url(http://s3.noelshack.com/old/up/mute-5980e7fa83.png)';
}


Carte.prototype.useReturnMoveSave  = Carte.prototype.useReturnMove;

Carte.prototype.useReturnMove = function (xml, reload, theMap) {
    if ($(xml).find('sortie').length) {
        $('#divFullWallBackground').css("display","none");
        $('#whereAmI').text("");
        $('iframe').attr("src","");
        var audio = document.getElementById('fullsound');
        audio.pause();        
    }
    this.useReturnMoveSave(xml,reload, theMap);
}

Carte.prototype.displayMapSave  = Carte.prototype.displayMap;

Carte.prototype.displayMap = function (a, b, c) {
    $.ajaxSetup({async: false});
    this.displayMapSave(a, b, c);
    loadMap();
    $.ajaxSetup({async: true});
}

$(document).ready(function() {
    var divFullWallBackground = document.createElement('div');
    divFullWallBackground.id= "divFullWallBackground";
    $('#ingame')[0].insertBefore(divFullWallBackground,$('#ingame')[0].firstChild);
    $('#divFullWallBackground').css("display","none").css("position","absolute").css("width","100%").css("height","100%").css("background","none no-repeat scroll center 0px transparent").css("z-index","21");
    
    
var audio = document.createElement('audio');
audio.id='fullsound';
document.body.appendChild(audio);
$("#fullsound").css("display","none");
    
var whereAmI = document.createElement('whereAmI');
whereAmI.id='whereAmI';
document.body.appendChild(whereAmI);
$("#whereAmI").css("display","none");
  
var End = document.createElement('li');
End.id='endAudioFullSound';
End.setAttribute("style", "height:30px;background-image:url('http://s3.noelshack.com/old/up/mute-5980e7fa83.png');background-repeat: no-repeat; z-index: 999999;");
End.setAttribute("onclick", "document.getElementById('fullsound').volume = (document.getElementById('fullsound').volume==1) ? 0 : 1; document.getElementById('endAudioFullSound').style.backgroundImage = (document.getElementById('fullsound').volume==1) ? 'url(http://s3.noelshack.com/old/up/unmute-bae5a6d548.png)' : 'url(http://s3.noelshack.com/old/up/mute-5980e7fa83.png)';document.getElementById('liiframe').style.display = (document.getElementById('fullsound').volume==1) ? 'block' : 'none';");

document.getElementById('fullsound').volume = 0;
    
$('#bandeau ul')[0].insertBefore(End,$('#bandeau ul')[0].firstChild);        
$('#endAudioFullSound').css('background-size','29px 20px').css("top","5px").addClass('link');
$("#endAudioFullSound").text("FW").css("color","#999");
   
var liiframe = document.createElement('li');
liiframe.id = "liiframe";
$('#bandeau ul')[0].insertBefore(liiframe,$('#bandeau ul')[0].firstChild);       
   
var diviframe1 = document.createElement('div');
diviframe1.id = "diviframe1";
diviframe1.setAttribute("style", "position:relative;width:267px;height:25px;overflow:hidden;");
$('#liiframe')[0].insertBefore(diviframe1,$('#liiframe')[0].firstChild);
   
var diviframe2 = document.createElement('div');
diviframe2.id = "diviframe2";
diviframe2.setAttribute("style", "position:absolute;top:-276px;left:-5px;");
$('#diviframe1')[0].insertBefore(diviframe2,$('#diviframe1')[0].firstChild);
   
var iframeyoutube = document.createElement('iframe');
iframeyoutube.id = "iframeyoutube";
$('#diviframe2')[0].insertBefore(iframeyoutube,$('#diviframe2')[0].firstChild);

$('#iframeyoutube').css("width","300px");
$('#iframeyoutube').css("height","300px");
$('#liiframe').css('display','none');    

$.ajaxSetup({async: false});
loadArrays("0B5SS13RZj6nZbTNHVFVUeGVVRXc",'0_1');

$.ajaxSetup({async: true});
})