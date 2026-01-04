// ==UserScript==
// @name     CuluXuHerc3's blockLaurel
// @version  2
// @grant    none
// @match https://bloglaurel.com/post/*
// @description suppress comments from useless users 
// @namespace          Script Namespace
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/393227/CuluXuHerc3%27s%20blockLaurel.user.js
// @updateURL https://update.greasyfork.org/scripts/393227/CuluXuHerc3%27s%20blockLaurel.meta.js
// ==/UserScript==




var frame = document.createElement('div');
document.body.appendChild(frame);
GM_config.init(
{
  'id': 'MyConfig', // The id used for this instance of GM_config
  'title': 'BlokLaurel Configurator', // Panel Title
  'fields': // Fields object
  {
    'NameList': // This is the id of the field
    {
      'label': 'les pseudos à virer, séparés par des virgules:', // Appears next to field
      'type': 'text', // Makes this setting a text field
      'default': '' // Default value if user doesn't change it
    }
  },
  'events': // Callback functions object
  {
    'save': function() { go(); },
    'reset': function() { go(); }
  },
  'frame': frame // Element used for the panel
});

var annoyingPeople = GM_config.get('NameList').split(",");


if (annoyingPeople.length == 1 && annoyingPeople == ''){
  GM_config.open();
}


//GM_config.open();

function go() {

//  var annoyingPeople = GM_config.get('NameList').split(",");

  
  //get all the H3 elements
  var h3 = document.getElementsByTagName("h3");
  for(var i = 0; i < h3.length; i++){  
    var h3text = h3[i].textContent;
    //check for the certain string
    for(var j = 0; j < annoyingPeople.length; j++){
      if(h3text.includes(annoyingPeople[j])) {
        //alert("Sucker detected !" + annoyingPeople[j]);
        h3[i].parentNode.remove();
      }
    }
  }
}
  
go();
