// ==UserScript==
// @name       Find the Invisible Cow
// @namespace   yahoo.com
// @description blah blah
// @include     http://findtheinvisiblecow.com/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40839/Find%20the%20Invisible%20Cow.user.js
// @updateURL https://update.greasyfork.org/scripts/40839/Find%20the%20Invisible%20Cow.meta.js
// ==/UserScript==
var div_credit=document.getElementById('footer').getElementsByTagName('DIV')[0];
var txt_info=document.createElement("span");
div_credit.insertBefore(txt_info,div_credit.firstChild);
var d=parseInt(find.settings.requiredDistance);
var one_div=document.createElement("DIV");
update_div(one_div);
var change_divs=document.getElementById('modal-congratulations').getElementsByTagName('DIV');

window.addEventListener('mousemove', function(e){
    var mouseX = e.x || e.clientX,
    mouseY = e.y || e.clientY,
    cowX = find.animal.pos.x,
    cowY = find.animal.pos.y,
    distance = parseInt(Math.sqrt(
	   Math.pow(mouseX - cowX, 2) +
	   Math.pow(mouseY - cowY, 2)));
    txt_info.innerHTML=""+(mouseX - cowX)+"|"+(mouseY - cowY)+"|"+distance;
});
window.addEventListener('dblclick', function(e){
    one_div.style.display	="";
    one_div.style.top	=find.animal.pos.y-d+"px";
    one_div.style.left	=find.animal.pos.x-d+"px";
    clearInterval(find.audio.interval);
    });
window.addEventListener('click', function(e){
	   one_div.style.display="none";
    });
document.getElementById('modal-congratulations').addEventListener('mouseover', function(e){
    change_divs[0].style.display="none";
    change_divs[1].style.display="none";
    change_divs[3].style.display="";
    });
function update_div(one_div){
    one_div.id="one_div";
    document.body.appendChild(one_div);
    one_div.style.display="none";
    one_div.style.border	="1px solid #FF0000";
    one_div.style.position	="fixed";
    one_div.style.height	=(2*d)+"px";
    one_div.style.width		=(2*d)+"px";
    one_div.style.zIndex	="500";
    
    one_div.style.background= "transparent";
    one_div.style.borderRadius= "50%";
}