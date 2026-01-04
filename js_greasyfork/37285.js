// ==UserScript==
// @name         Neo shop auto-offer-price
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/haggle.phtml*
// @match        http://www.neopets.com/objects.phtml?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/37285/Neo%20shop%20auto-offer-price.user.js
// @updateURL https://update.greasyfork.org/scripts/37285/Neo%20shop%20auto-offer-price.meta.js
// ==/UserScript==

mode=GM_getValue("mode")
if(mode===undefined){
GM_setValue("mode",0)
mode=0
}


window.onkeydown = function(event){
  	switch(event.keyCode){
  		case 118: //up
  			if(mode===0){
            GM_setValue("mode",1)
mode=1
                chrome_notification_c("进入还价模式")
            }else{
            GM_setValue("mode",0)
mode=0
                chrome_notification_c("进入精确模式")

            }
  			break;
  	}
  }

var stampshop=false
imgs=$("img")
for(var i=0;i<imgs.length;i++){
if($("img:eq("+i+")").attr("src")==="http://images.neopets.com/shopkeepers/w58.gif"){
stampshop=true

}

}


var pricestr=$("#shopkeeper_makes_deal")[0].innerText


var num= pricestr.replace(/[^0-9]/ig,"");
if(parseInt(num)>=5000 && stampshop===true){
mode=0
}




if(mode===1){
num=Math.floor(parseInt(num)*0.93)
    ge=num - ((Math.floor(num/10))*10)
shi=(num - ((Math.floor(num/100))*100) - ge)/10

num=num-ge+shi
}






$("input[name='current_offer']").val(num)

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
console.log(pricestr)