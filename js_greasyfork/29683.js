// ==UserScript==
// @name         teambition
// @namespace    http://tampermonkey.net/
// @description  优化teambition显示
// @author       shujidemajia
// @include       https://teambition.com*
// @include       https://www.teambition.com*
// @include       http://teambition.com*
// @include       http://www.teambition.com*
// @require  https://greasyfork.org/scripts/29579-coffeescript/code/coffeescript.js?version=193297
// @require  https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version       20170512.02
// @downloadURL https://update.greasyfork.org/scripts/29683/teambition.user.js
// @updateURL https://update.greasyfork.org/scripts/29683/teambition.meta.js
// ==/UserScript==

function evalCS(source) {
  // Compile source to Coffeescript (Array)
  var coffeescript = CoffeeScript.compile(source.toString()).split("\n");
  // Join and eval
  eval(coffeescript.join("\n"));
}

func = function() {
    if($('#__css__').length > 0){
        return;
    }

    var css = `
.object-modal-view.fixed, .modal .modal-dialog.post-creator {
	width: 75%;
    left: 15%;
    margin: 0;
}

.scrum-stage {
    height: 50%;
    width: 288px;
    float: left;
    margin-bottom: 5px;
}
    `;
	var node = document.createElement("style");
	node.type = "text/css";
    node.id = '__css__';
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
};


// Script Source
// -------------
evalCS(`
$ ->
    seconds = 0
    tid = setInterval ->
        $('.board-scrum-stages')[0].scrollLeft = 99999
        seconds += 1
        if seconds >10
            clearInterval tid
    , 1000
    setInterval(func, 2000);
`);