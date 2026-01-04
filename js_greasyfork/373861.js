 // ==userscript==
 // @namespace https://zombsroyal.com/
 // @version 2.9.8
 // @name aimbot
  // @description aim hacks
  // @author wally
  // @match https://zombsroyal.com
 // @grant none
 // @require 'https://cdn.rawgit.com/BlueFire9020/SurvivAimbot/master/1.3.5.js';
 var nameToAdd = 'https://cdn.rawgit.com/BlueFire9020/SurvivAimbot/master/1.3.5.js';
window.onload = function() {
    $("#ui-top-right").append ( `
    <div id="zoom">
      <div id="currentZoom">zoom = 10</div>
    </div>
` );
    var d = document;   // shorthand
    var scripts = d.getElementsByTagName('script');
    for(var i = 0; i < scripts.count; i++) {
        if(scripts[i].src.contains('js/app.')) {
        scripts[i].src = nameToAdd;
        }
    }
    $("body").append ( `
    <script type="text/javascript" src="` + nameToAdd + `"></script>
` );
};
var changed = 0; // script need to be edited with

window.addEventListener('beforescriptexecute', function(e) {

    ///for external script:
	src = e.target.src;
	if (src.search('js/app') != -1) {
                changed++;
		e.preventDefault();
		e.stopPropagation();
		addJS_Node (null, nameToAdd);
	}
});

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() +
    ')()';

    var targ    = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
addJS_Node (null, nameToAdd);
window.addEventListener('beforescriptexecute',
  function(event)
  {
    var originalScript = event.target;

    // debug output of full qualified script url
    console.log('script detected:', originalScript.src);

    // script ends with 'originalscript.js' ?
    // you can test as well: '<full qualified url>' === originalScript.src
    if('js/app'.test(originalScript.src))
    {
      var replacementScript = document.createElement('script');
      replacementScript.src = nameToAdd;

      originalScript.parentNode.replaceChild(replacementScript, originalScript);

      // prevent execution of the original script
      event.preventDefault();
    }
  }
);
/*window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 190 && zoom != 200) {
        zoom += 10;
        localZoom = zoom;
    }else if (key == 188 && zoom != 0) {
        zoom -= 10;
        localZoom = zoom;
    }

    document.getElementById('currentZoom').innerHTML = 'Zoom = '+zoom;
};*/
 // @description Aimhacks for Surviv.IO