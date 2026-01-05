// ==UserScript==
// @name        NK_Xuanke
// @namespace   nku
// @include     http://222.30.32.10/*
// @version     1
// @grant       none
// @run-at      document-start
// @description 南开大学选课系统
// @downloadURL https://update.greasyfork.org/scripts/13545/NK_Xuanke.user.js
// @updateURL https://update.greasyfork.org/scripts/13545/NK_Xuanke.meta.js
// ==/UserScript==
window.onload = function () {
	if(this !== window.top)return;
    var sel = document.getElementsByTagName("input");
    for(var j = 0;j < sel.length; j++){
        sel[j].id = sel[j].name;
    }
    var aa = window.top.document.getElementsByName('leftFrame') [0];
    var side = function(w){
      var aa = w.contentDocument;
	  if (!aa)return;
      var t = 110;
            for (var i = 0; i < 21; i++) {
                var tmp = aa.getElementById('MFX' + i);
                if (tmp) {
                    tmp.style['visibility'] = 'visible';
                    tmp.style['top'] = t + 'px';
                    t = t + 12;
            }
        }
    };
    if(aa){ //patch for the side bar
        side(aa);            
        aa.onload = side(this);
    }
    var cc = window.top.document.getElementsByName('mainFrame') [0];
    if(cc){
        cc.onload = function () {
            dd  = this.contentDocument.getElementsByTagName("input");
            this.contentWindow.localtion = this.contentWindow.location;
            for(var i = 0; i<dd.length; i++){
                dd[i].name?eval("var " + dd[i].name + " = dd["+i+"]"):eval("");
                dd[i].id = dd[i].name;
            }
        }
    }
    else{}
}
