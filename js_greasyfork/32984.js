// ==UserScript==
// @name       Usuwanie mirko
// @namespace  http://www.wykop.pl/*
// @version    1.0
// @description usuwa wpisy UWAGA
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/32984/Usuwanie%20mirko.user.js
// @updateURL https://update.greasyfork.org/scripts/32984/Usuwanie%20mirko.meta.js
// ==/UserScript==
var HASHAJAX = [];
(function(){

    var ELEM = document.getElementById("nav");
    var DIVBUT = document.createElement('div');
    var BUTDEL = document.createElement('input');
    DIVBUT.setAttribute("style", "position:fixed;top:15px;left:40px;z-index: 101;");
    BUTDEL.setAttribute("id", "UsunTO");
    BUTDEL.setAttribute("onclick", "LOOP()");
    BUTDEL.setAttribute("value", "Usuń");
    BUTDEL.setAttribute("type", "button");
    BUTDEL.setAttribute("style", "width:45px;");
    DIVBUT.appendChild(BUTDEL);
    ELEM.appendChild(DIVBUT);
})();

(function(){
    var BLOCK = document.getElementById('itemsStream');
    var COMMENT = BLOCK.getElementsByClassName('ownComment');
    for(let i = 0;i<COMMENT.length;i++){
        var NAME;
        try{
            NAME = COMMENT[i].getElementsByClassName('affect hide confirm ajax')[0].getAttribute('data-ajaxurl');
        }catch(err){
            if(NAME===undefined)
                continue;
        }
        HASHAJAX[i] = NAME;
    }
var zix = 0;
window.LOOP = function LOOP(){
var ALLTIME = setTimeout(function (){
	DELALL(zix);
    console.log(zix);
	if( zix < HASHAJAX.length ){
        zix++;
        LOOP();
    }
	else{clearInterval(ALLTIME);}
	}, 100);
};
function DELALL(zix){
    var a = document.createElement("a");
    a.href = HASHAJAX[zix];
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                true, false, false, false, 0, null);
    a.dispatchEvent(evt);
}
})();

