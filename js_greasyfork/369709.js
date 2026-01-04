// ==UserScript==
// @name        Dongeon Clicker AutoClic
// @namespace   KEyes
// @description AutoClic pour Dongeon Clicker
// @include     https://leandrobarone.github.io/dungeonclicker/
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369709/Dongeon%20Clicker%20AutoClic.user.js
// @updateURL https://update.greasyfork.org/scripts/369709/Dongeon%20Clicker%20AutoClic.meta.js
// ==/UserScript==

document.ready = new function(){
  opt();
  setInterval(adventure, 500);
  setInterval(buyBuild, 1000);
  setInterval(buyArtf, 1000)
}


//buy building, fill the max building in the max var
var max = 25;

function buyBuild(){
  var i;
  for(i=0;i<document.getElementById('building-list').children.length; i++)
    {
      if((document.getElementById('building-list').children[i].attributes.class.nodeValue == "element building opaque available") || (document.getElementById('building-list').children[i].attributes.class.nodeValue == "element building opaque unavailable")){
        if(parseInt(document.getElementById('building-list').children[i].children[4].innerHTML) < max ){
          document.getElementById('building-list').children[i].click();}}
      else{break;}
    }
}

//buy artefact
function buyArtf(){
  var j;
  for(j=0;j<document.getElementById('artifact-list').children.length; j++)
    {
      if((document.getElementById('artifact-list').children[j].attributes.class.nodeValue == "element artifact not-bought available opaque") || (document.getElementById('artifact-list').children[j].attributes.class.nodeValue == "element artifact opaque bought")){
        document.getElementById('artifact-list').children[j].click();}
      else{break;}
    }
}

//options
function opt(){
  dC.options.ShowAdventureLight = false;
  dC.options.RotateAdventureLight = false;
  dC.options.ShowTransitions = false;
  dC.options.Particles = false;
  dC.options.AdditionalParticles = false;
  dC.options.SFX = false;
  updateOptions(); 
}

