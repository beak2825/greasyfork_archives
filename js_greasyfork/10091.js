// ==UserScript==
// @name 	SwagTv script
// @namespace 	swagtv
// @description	this script will automatically fetch and go to the next video after the meter goes up. 
// @version 0.32
// @include	http://video.swagbucks.com/*
// @include http://www.swagbucks.com/?cmd=cp-get-captcha-image*
// @require https://greasyfork.org/scripts/1706-gocr-library/code/GOCR%20Library.js?version=4235
// @downloadURL https://update.greasyfork.org/scripts/10091/SwagTv%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/10091/SwagTv%20script.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------



    var iLoops = 0;
    window.setInterval(reloadTimer,1000);
    var doc = document.getElementById("feed-ajax-div");
    var notes = false;
    var _class = document.getElementsByClassName("thumb-container");
    
    var k = getK();
            
    var video = document.getElementById("video-title");
    video.parentNode.removeChild(video);
    var comment = document.getElementById("commentsCont");
    comment.parentNode.removeChild(comment);
    
    
    
    var randomNum = 0;
    var strPercentStart = null;
    var link = null;
    var div = null;


function getK(){
	for (var i = 0; i < _class.length; i++) {
        if (_class[i].className == "thumb-container active") {
                var k = i;
                break;			
        }
            
    }
    return k;
}

function reloadTimer(){
	iLoops++;
	if (iLoops%5==0)
        console.log(iLoops);
	if (iLoops == 5) 
	{
        console.log("k: "+k);
		strPercentStart = document.getElementById("meterNumber").innerHTML;
		div = document.getElementById("meterDuplicateVideo");
		
		if (div.style.display == 'none') 
		{
			randomNum = Math.floor(Math.random()*15 + 50);
		}
		else 
		{
			randomNum = 8;
		}
		if (k == null)
		{
            console.log("In K=3");
			
            if (!document.getElementsByClassName("feed-ajax-next")[0])
            {
          		notes = true;
            }
            else
            {
                document.getElementsByClassName("feed-ajax-next")[0].click();
			k = -1;
            }
		}
		
	}
	
	if (iLoops == randomNum)
	{
		if (document.getElementById("sbvd_capText"))
		{
		    alert('Captcha');
                    pic = document.getElementById("sbvdcapimg");
		}
		else 
		{
                    if (notes)
                        alert("Pick a new category");
                    else
                    {
			link = document.getElementsByClassName("thumb-link")[k+1].href;
			window.location.href = link;
                    }
		}
	}
			
		
}

if (window.opener != null && window.location.href.indexOf("mumbojumbo") > -1) {
    console.log("in");
    window.opener.postMessage("Child Frame Loaded", "*");
    var pic = document.getElementsByTagName("img")[0];
    console.log(pic);
    ocrString = ""
    if (pic){     
        setTimeout(function(){
            var image = getBase64Image(pic);
            console.log(image);
            var imageData = image[0];
            var ocrString = GOCR(imageData);
            console.log(ocrString.toUpperCase());
        },500);
    }
    window.opener.postMessage({magicword: "mumbojumbo", string: ocrString}, "*");
    window.opener=window;
	window.close();
    top.window.close();
}

window.addEventListener("message", function(e) {
         if (e.data.magicword === "mumbojumbo") {
             console.log("Message Received");
             console.log(e.data);
             var ocrString = e.data.string.toUpperCase();
             console.log("string");
             console.log(ocrString);
             console.log("string");
             if (childWindow)
             	childWindow.close();
             if (ocrString.indexOf('_') === -1){
                 if (document.getElementById("sbvd_capText")){
                 	 document.getElementById("sbvd_capText").value = ocrString;
                 	 document.getElementsByClassName("btnClaim")[0].click();
                     setTimeout(function() {
                         if (!document.getElementById("sbvd_capText")){                     
                             k=getK();
                             if (k == null)
                                 k=-1;
                             link = document.getElementsByClassName("thumb-link")[k+1].href;
                             //alert("NEXT");
                             window.location.href = link;
                        }
                        else{
                            //alert("Opened 1");
                            var pic = document.getElementById("sbvdcapimg");
                            childWindow = window.open(pic.src+"&magicword=mumbojumbo");
                        }
                     }, 1000);
                 }
                                
             }
             else{
                //alert("Opened 2");
                var pic = document.getElementById("sbvdcapimg");
    			childWindow = window.open(pic.src+"&magicword=mumbojumbo");
             }
         }
          else{
              console.log("Also message received");
              console.log(e.data);
          }
      }, false);