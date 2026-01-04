// ==UserScript==
// @version        2017.09.25
// @name           WWEFreight 1.3
// @namespace     WWEFreight
// @author	      fengguan.ld~gmail。com
// @description    WWE Create/Update Freight Tracking
// @include        https://wexnet.wwex.com/pls/apex/f?p=*NO:*FREIGHTID*COMPANYID*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/33775/WWEFreight%2013.user.js
// @updateURL https://update.greasyfork.org/scripts/33775/WWEFreight%2013.meta.js
// ==/UserScript==
// 
$(window).load(function()
{
  var token="497EBCE9-ED23-4805-AB37-E957C422822C";
	var bolnum=$("#P271_BOLNBR").val();
  var pronum=$("#P271_PRONBR").val();
  var username=$.trim($("#app-user").text());
  if  (bolnum!=null && pronum !=null && username!=null){  
  var postlink="https://www.telamon.cn:442/WWE/Track_Trace/addRecord.aspx?bolnum="+bolnum+"&pronum="+pronum+"&user="+username+"&token="+token; 
   //alert(postlink);  
  $("#voidShipment").after('<a id="apostlink" target="_blank" href='+postlink+'>'+bolnum+'</a>');
  var iframehtml="<iframe height='350px' width='500px' src="+postlink+"><p>Your browser does not support iframes.</p></iframe>"
  $("#t20ContentRight").append(iframehtml);
  //window.open (postlink,'Count Track&Trace','height=300,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no, location=no,status=no');   
  }
  
 
});

