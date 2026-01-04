// ==UserScript==
// @name        display_filename_on_image
// @name:ja        display_filename_on_image
// @name:zh-TW         display_filename_on_image
// @name:zh-CN        display_filename_on_image
// @namespace   display_filename_on_image
// @supportURL  https://github.com/zhuzemin
// @description:zh-CN with custom position, size, color
// @description:zh-TW  with custom position, size, color
// @description:ja with custom position, size, color
// @description with custom position, size, color
// @include     https://*
// @include     http://*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/397059/display_filename_on_image.user.js
// @updateURL https://update.greasyfork.org/scripts/397059/display_filename_on_image.meta.js
// ==/UserScript==
let textPosition={
    bottom_left:`
    
    bottom: 8px;
    left: 16px;
`,
    top_left:`
    
    top: 8px;
    left: 16px;
`,
    top_right:`
    
    top: 8px;
    right: 16px;
`,
    bottom_right:`
    
    bottom: 8px;
    right: 16px;
`,
    centered :`
        
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`
}
var config = {
    'debug': false,
    'targetImgSize':['260x146','260x289'],
    //'targetImgSize':['16x16','40x40','96x96'],
    'color':'black',
    'size':'100%',
    'position':textPosition.centered
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

  // setting User Preferences
  function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        //val = val.replace(pat1, sep).replace(pat2, '');
      }
      //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      //else location.reload();
    });
  }
  
  // prepare UserPrefs
  setUserPref(
  'tags',
  'chinese;',
  'Set Highlight Tags',
  `Set Highlight Tags, split with ";". Example: "mmf threesome; chinese"`,	  
  ','
  );


var init = function () {
    let imgList=document.querySelectorAll('img');
    for(var img of imgList){
        let imgSize=img.width+'x'+img.height;
        debug('imgSize: '+imgSize);
        if(config.targetImgSize.includes(imgSize)){
            if(img.src!=null){
                let filename=img.src.match(/([^/]*)$/)[1];
                debug('filename: '+filename);
                let div=document.createElement('div');
                div.style=`
  position: absolute;
  font-size:`+config.size+`;
  color:`+config.color+`;
  `+config.position;
                debug('div.style: '+div.style);
                div.innerText=filename;
                img.parentElement.style='position: relative!important;';
                img.parentElement.insertBefore(div,null);
            }

        }
    }
}

window.addEventListener('load', init);
