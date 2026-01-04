// ==UserScript==
// @name         צטט כמו זבל
// @namespace    http://pa0neix.github.io/
// @version      1.0
// @description  ken
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33954/%D7%A6%D7%98%D7%98%20%D7%9B%D7%9E%D7%95%20%D7%96%D7%91%D7%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/33954/%D7%A6%D7%98%D7%98%20%D7%9B%D7%9E%D7%95%20%D7%96%D7%91%D7%9C.meta.js
// ==/UserScript==

var btn = document.createElement('button');
btn.id = 'qr_maniak';
btn.className = 'button';
btn.style.marginLeft = '3px';
btn.innerText = 'תהיה מניאק';
document.querySelector('#qr_submit').parentNode.insertBefore(btn, document.querySelector('#qr_submit'));
btn.addEventListener('click', function() {
	var x = [];
    var z = '';
    document.querySelectorAll('.postcontainer').forEach(function(e) {
        var y = e.id.replace(/\D/g,'');
        console.log(y);
        if(e.querySelector('.username').href.replace(/\D/g,'') != USER_ID_FXP && !x.includes(y)) {
            var user = e.querySelector('.username').innerText;
            z += `[QUOTE=${user};${y}][/QUOTE]`;
        }
    });
    console.log(z);
    var y = document.querySelector('#cke_contents_vB_Editor_QR_editor>iframe').contentDocument.body.innerHTML;
	document.querySelector('#cke_contents_vB_Editor_QR_editor>iframe').contentDocument.body.innerHTML = z+'<br><br>'+y;
	document.querySelector('#qr_submit').click();
});