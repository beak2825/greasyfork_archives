// ==UserScript==
// @name        e-hentai Extended use Thumbnail style and Highlight Tag
// @name:ja        e-hentai Extended use Thumbnail style and Highlight Tag
// @name:zh-TW         e-hentai Extended use Thumbnail style and Highlight Tag
// @name:zh-CN        e-hentai Extended use Thumbnail style and Highlight Tag
// @namespace   e-hentai_Extended_simulate_Thumbnail
// @supportURL  https://github.com/zhuzemin
// @description:zh-CN e-hentai Extended use Thumbnail style and Highlight Tag in search page
// @description:zh-TW  e-hentai Extended use Thumbnail style and Highlight Tag in search page
// @description:ja e-hentai Extended use Thumbnail style and Highlight Tag in search page
// @description e-hentai Extended use Thumbnail style and Highlight Tag in search page
// @include     https://exhentai.org/*
// @include     https://e-hentai.org/*
// @version     1.31
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/395517/e-hentai%20Extended%20use%20Thumbnail%20style%20and%20Highlight%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/395517/e-hentai%20Extended%20use%20Thumbnail%20style%20and%20Highlight%20Tag.meta.js
// ==/UserScript==
var config = {
  'debug': false
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


CreateStyle=function(){
  debug("Start: CreateStyle");
  var style=document.createElement("style");
  style.setAttribute("type","text/css");
  style.innerHTML=`
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
  debug("Processing: CreateStyle");
  var head=document.querySelector("head");
  head.insertBefore(style,null);
  debug("End: CreateStyle");
}
function SetExtended(){
    var hostname=getLocation(window.location.href).hostname;
    var select=document.querySelector("select");
    var options=select.querySelectorAll("option");
    for(var option of options){
        var value=option.getAttribute("value");
        var selected=option.getAttribute("selected");
        if(value=="e"){
            if(selected=="selected"){
                break;
            }
            else{
                window.location.href="https://"+hostname+"/?inline_set=dm_"+value;
            }
        }
    }

}


function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}


var TagsLast=[];
var TablesLast=0;
var init = function () {
    SetExtended();
  var LastDivNum=0;
  CreateStyle();
    var div=document.querySelector("div.ido");
    div.style="max-width:1370px";
    setInterval(function(){
        var tables=document.querySelectorAll("table.itg.glte");
  if(LastDivNum<tables.length){
      var table=tables[LastDivNum];
      var tbody=table.querySelector("tbody");
      tbody.className="itg gld";
      tbody.style="width:1323px";
  for (var i = 0; i < tbody.childNodes.length; i++) {
        var tr=tbody.childNodes[i];
        tr.className="gl1t";
        tr.style="min-width:250px !important;width:263px !important;";
        var detail = tr.querySelector("div.gl3e");
        detail.className="gl3t";
        var star=detail.querySelector("div.ir");
        star.style.margin="auto";
        var thumb=tr.querySelector("td.gl1e");
        thumb.firstChild.style="height:340px;";
        thumb.insertBefore(detail,null);
  }
    LastDivNum=tables.length;
  }
        HighlightTag();
    }, 2000);

}

function HighlightTag(){
    var tags;
    try {
        tags = GM_getValue("tags").trim().replace(/;$/,"").split(";");
    } catch (e) {
        debug("Not set tags.");
    }
    if (tags == undefined||tags.length ==0) {
        tags = [];
    }
    var tables=document.querySelectorAll("table.itg.glte");
    if(tables.length>TablesLast||JSON.stringify(tags)!=JSON.stringify(TagsLast)){
        TablesLast=tables.length;
        TagsLast=tags;
        debug("TagsLast: "+TagsLast);
        var n;
        if(tables.length>TablesLast){
            n=TablesLast;
        }
        else{
            n= 0;
        }
    for(var table of tables){
        var tbody=table.querySelector("tbody");
        for (var i = n; i < tbody.childNodes.length; i++) {
            var tr = tbody.childNodes[i];
            var div = tr.querySelector("div.gl4e.glname");
            table = div.childNodes[1].querySelector("table");
            if (table != null) {
                var TagListCurrent = table.querySelectorAll("div");
                for (var TagCurrent of TagListCurrent) {
                    for (var tag of tags) {
                        if (tag.length > 1) {
                            if (TagCurrent.innerText == tag.trim()) {
                                debug("Highlight: " + tag);
                                TagCurrent.className += " glowbox";
                                break;
                            }
                            else if(tag==tags[tags.length-1]){
                                TagCurrent.className = TagCurrent.className.replace(" glowbox","");
                            }
                        }
                        else{
                            TagCurrent.className = TagCurrent.className.replace(" glowbox","");

                        }
                    }

                }

            }

    }
    }
    }

}
window.addEventListener('DOMContentLoaded', init);
