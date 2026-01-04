// ==UserScript==
// @name         Neopets auction-tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/auctions.phtml?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/37904/Neopets%20auction-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/37904/Neopets%20auction-tool.meta.js
// ==/UserScript==
mode=GM_getValue("mode")
if(mode===undefined){
GM_setValue("mode",0)
mode=0
}
console.log(mode)
function chrome_notification_c(mystring) {
	window.focus();
	var notificationDetails = {
		text: mystring,
		title: '自动标价',
		timeout: 0,
		onclick: function() {
			window.focus();
		},
	};
	GM_notification(notificationDetails);
}
var premode=0
window.onkeydown = function(event){
  	switch(event.keyCode){
  		case 118: //up
  			if(mode===0){
            GM_setValue("mode",1)
                premode=1
                chrome_notification_c("进入随机模式")
            }

            if(mode===1){
            GM_setValue("mode",2)
                premode=2
                chrome_notification_c("进入+5000模式")

            }
                 if(mode===2){
            GM_setValue("mode",0)
                     premode=0
                chrome_notification_c("进入+50模式")

            }
            mode=premode
  			break;
  	}
  }
















var form_html=$('form[action="auctions.phtml?type=placebid"]')["0"].outerHTML
var current_value=$('input[name="amount"]').val()
$('form[action="auctions.phtml?type=placebid"]')["0"].remove()


var now_value
form_html+='<a href="javascript:0" class="bid" value="103" ><b>+103</b></a>\t · \t'
form_html+='<a href="javascript:0" class="bid" value="1003" ><b>+1003</b></a>\t · \t'
form_html+='<a href="javascript:0" class="bid" value="5000" ><b>+5000</b></a>\t · \t'
form_html+='<a href="javascript:0" class="bid" value="8000" ><b>+8000</b></a>\t · \t'
form_html+='<a href="javascript:0" class="bid" value="10000" ><b>+10000</b></a>\t · \t'






$('img[height="80"][width="80"]').parent().append(form_html)


$('.bid').click(function(){
 now_value=parseInt(current_value)+parseInt(this.getAttribute('value'))
    $('input[name="amount"]').val(now_value)
})
$('input[name="amount"]').val(parseInt(current_value)+50)
if(mode==1){
$('input[name="amount"]').val(parseInt(current_value)+50+Math.floor(Math.random()*4950))
}
if(mode==2){
$('input[name="amount"]').val(parseInt(current_value)+5+4995)
}



