// ==UserScript==
// @name         binarium
// @namespace    binarium.com
// @version      0.4
// @description  binarium.com
// @author       Stephanzion
// @match        https://binarium.com/terminal
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381933/binarium.user.js
// @updateURL https://update.greasyfork.org/scripts/381933/binarium.meta.js
// ==/UserScript==

var link = document.createElement('link');
link.href = 'http://allfont.ru/allfont.css?fonts=courier-new';
link.rel = 'stylesheet';
link.type = 'text/css';
document.body.appendChild(link);

setTimeout(function() {

	console.log('STARTED!!!');
	var lastPos = 10;

function SetMessage(jsonStr)
{

if(!jsonStr.startsWith('{"timestamp"'))
{


var json = Newjson(jsonStr);

var id = json.body.channel;
var value = parseFloat(json.body.data.match(/\d+\.\d+/gm)[0]).toFixed(5);

var elem = document.getElementById(id);

if(elem == null)
{
var div = document.createElement('div');
div.id = id;
div.style = 'position: fixed;width: 160px;top: '+lastPos+'px;right: 400px;background-color: white;  font-family: "Courier New", arial;  z-index: 999999;color: black;text-align: left;font-size: 30px;';
lastPos+=50;
div.innerHTML = value;
document.body.appendChild(div);

}else{


elem.innerHTML = value;
}


}



}

function Newjson(){}


Newjson = JSON.parse;

JSON.parse = function(t){


SetMessage(t);
return Newjson(t);

}



} , 5000);


