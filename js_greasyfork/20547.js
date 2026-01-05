// ==UserScript==
// @name           eBay Kalkulator dana
// @description    Prikazuje koliko je dana prošlo od kupnje i dodatne datume u vezi kontaktiranja prodavaca i otvaranja "case"-a.
// @namespace      tteskac
// @author         Tomislav Teskač
// @version    	   0.2.2
// @include        http://my.ebay.co.uk/*    
// @include        http://my.ebay.com/*    
// @include        http://www.ebay.com/myb/*    
// @downloadURL https://update.greasyfork.org/scripts/20547/eBay%20Kalkulator%20dana.user.js
// @updateURL https://update.greasyfork.org/scripts/20547/eBay%20Kalkulator%20dana.meta.js
// ==/UserScript==

function getElementsByClassName(classname_, node, tagName)  {
    var tagName=(typeof(tagName) === 'undefined')?"*":tagName;
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var classes = classname_.split(','); 
    
    for(cid in classes) {
    var classname = classes[cid];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName(tagName);
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    }
        
    return a;
}
function leadingZero(str) {
	if((""+str).length<2) return "0"+str;
	return (""+str);
}
function formatDate(day, month, year) {
	return leadingZero(day)+"."+leadingZero(month)+"."+year;
		
}

function run() {
    
    var spans = getElementsByClassName("row-date", null, "div");
    
    for(var i = 0; i < spans.length; i++) {
        
       var span = spans[i]; 
        
        //alert(span.innerHTML);
        var razlika = Date.now() - Date.parse(span.innerHTML);
        razlika = Math.floor(razlika / (1000 * 60 * 60 * 24));
        //
        var dateFrom = new Date(Date.parse(span.innerHTML));
        var dateContactSeller = new Date(Date.parse(span.innerHTML));
          var dateCriticalDispute = new Date(Date.parse(span.innerHTML));

          dateContactSeller.setDate(dateContactSeller.getDate()+35); 
          dateCriticalDispute.setDate(dateCriticalDispute.getDate()+45);

        
           var strDiffDays = "<b style='font-size:15px;'>"+razlika+"</b>";
           
           if(razlika>29){
               strDiffDays = "<b style='color:red;font-size:15px;'>"+razlika+"</b>";   
           }
        
           
          var str = "<span class='g-vxsB'>Datum kupnje:</span> <span class='g-vxs'>"+formatDate(dateFrom.getDate(), (dateFrom.getMonth()+1) , dateFrom.getFullYear())+".</span>"; 
          str+= "<br><span class='g-vxsB'>Od kupnje je prošlo:</span> <span class='g-vxs'>"+strDiffDays+" dan(a)</span>";
          str+= "<br><span class='g-vxsB'>Kontaktiraj selera:</span> <span class='g-vxs'>"+formatDate(dateContactSeller.getDate(),(dateContactSeller.getMonth()+1),dateContactSeller.getFullYear())+".</span>";
          str+= "<br><span class='g-vxsB' style='color: red;'>Zadnji dan za <i>Case</i>:</span> <span class='g-vxs'><b>"+formatDate(dateCriticalDispute.getDate(),(dateCriticalDispute.getMonth()+1),dateCriticalDispute.getFullYear())+"</b>.</span>";
          str+= "<br><span><br></span>";
        
          span.innerHTML = str;
       
    }
}

setTimeout(run(), 1000);