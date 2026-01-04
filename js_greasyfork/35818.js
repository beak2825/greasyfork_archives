// ==UserScript==
// @name grades4gdst
// @description javascripts for input grades in gdst
// @match			http://61.142.33.204/js_main.aspx*
// @include			http://61.142.33.204/js_main.aspx*
// @match			http://172.16.1.8/js_main.aspx*
// @include			http://172.16.1.8/js_main.aspx*
// @grant none
// @version 1.3
// @namespace gdst
// @downloadURL https://update.greasyfork.org/scripts/35818/grades4gdst.user.js
// @updateURL https://update.greasyfork.org/scripts/35818/grades4gdst.meta.js
// ==/UserScript==

function addJS_Node (win, funcToRun) {
  	var W									= win || window;
    var D                                   = W.document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);    	
}

function fast_input () {    
  if(document.getElementById("user_input")) return;
  
  var htmls = '<textarea spellcheck="false" id="user_input" style="height: 200px;"></textarea><br />';
  htmls = htmls + '<input id="fast_input_ps" value="平时成绩" type="button" onclick="get_input(0);" />';
  htmls = htmls + '<input id="fast_input_qm" value="期末成绩" type="button" onclick="get_input(1);" />';  
  var f = document.createElement('div');
  f.innerHTML = htmls;
  document.body.appendChild(f);
  
  
  window.$ = function (id) {
    if (!id) return null;
    if (id[0] == '#') return document.getElementsByClassName(id.substr(1));
    if (id[0] == '.') return document.getElementsByTagName(id.substr(1));
    else return document.getElementById(id);
	};
  
  window.get_input = function (p) {
    var a = $('user_input');  
    var tails = [
      'ps',
      'qm'
    ];
    if (!a) return;
    if (p < 0 || p > 1) return;
    a = a.value.split('\n');
    var k = 0;
    var aa = new Object();
    for (k = 0; k < a.length; k++) {    
      a[k] = a[k].replace(/[\t ]+/i, "\t");
      values=a[k].split('\t');
      if (values.length == 2) {
        aa[values[0]]=values[1];
      }
    }
    var sno="";
    var i = 2;  
    var j = 0;
    var input = $('DataGrid1__ctl' + i + '_' + tails[p]);
    while (input) {
      sno = input.parentNode.parentNode.childNodes[2].innerText;
      if (aa[sno]) {
        input.value = aa[sno];
        j = j + 1;
      }    
      i = i + 1;    
      input = $('DataGrid1__ctl' + i + '_' + tails[p]);
    }
    alert(j);
	};
  
};
  

top.setInterval(function(){  
	var contentframe = top.frames[0];  
  if(contentframe) {
    switch (contentframe.location.pathname)
    {
      case "/js_cjmm.aspx":
      case "/xf_js_cjlr.aspx":             
          addJS_Node(contentframe, fast_input);			
        
        break;
      default:;
    }
  }
},
3000);
