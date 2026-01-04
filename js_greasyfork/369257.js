// ==UserScript==
// @name        modwars.com
// @namespace   basti 10121012
// @include     *modwars.com*
// @version     2.9
// @description modwars planeten scanner
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/369257/modwarscom.user.js
// @updateURL https://update.greasyfork.org/scripts/369257/modwarscom.meta.js
// ==/UserScript==
var start=1;
var ende=10;
var interval=1000;//1000 gleich 1 sekunde .Wenn zu schnell streikt der nodwars.com server Bitte testen

//-------------------------------------------------------------------------------
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('#tisch{width:100%;height:auto;background:white;color:black}');
addGlobalStyle('tr{width:100%;}}');
addGlobalStyle('td{border:1px solid black;width:22%}');
addGlobalStyle('td:nth-child(1){border:1px solid black;width:30px}');
addGlobalStyle('#ad{background:white;width:100%}}');





(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.download = factory();
  }
}(this, function () {

	return function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function(a){return String(a);},
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
			myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
	  
		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload=[payload, mimeType];
			mimeType=payload[0];
			payload=payload[1];
		}


		if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
		  	if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
        		var ajax=new XMLHttpRequest();
        		ajax.open( "GET", url, true);
        		ajax.responseType = 'blob';
        		ajax.onload= function(e){ 
				  download(e.target.response, fileName, defaultMime);
				};
        		setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
			    return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)){
		
			if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
				payload=dataUrlToBlob(payload);
				mimeType=payload.type || defaultMime;
			}else{			
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload) ; // everyone else can save dataURLs un-processed
			}
			
		}else{//not data url, is it a string with special needs?
			if(/([\x80-\xff])/.test(payload)){			  
				var i=0, tempUiArr= new Uint8Array(payload.length), mx=tempUiArr.length;
				for(i;i<mx;++i) tempUiArr[i]= payload.charCodeAt(i);
			 	payload=new myBlob([tempUiArr], {type: mimeType});
			}		  
		}
		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], {type: mimeType}) ;


		function dataUrlToBlob(strUrl) {
			var parts= strUrl.split(/[:;,]/),
			type= parts[1],
			indexDecoder = strUrl.indexOf("charset")>0 ? 3: 2,
			decoder= parts[indexDecoder] == "base64" ? atob : decodeURIComponent,
			binData= decoder( parts.pop() ),
			mx= binData.length,
			i= 0,
			uiArr= new Uint8Array(mx);

			for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

			return new myBlob([uiArr], {type: type});
		 }

		function saver(url, winMode){

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
 				anchor.addEventListener('click', function(e) {
 					e.stopPropagation();
 					this.removeEventListener('click', arguments.callee);
 				});
				document.body.appendChild(anchor);
				setTimeout(function() {
					anchor.click();
					document.body.removeChild(anchor);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
				}, 66);
				return true;
			}

			// handle non-a[download] safari as best we can:
			if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
				if(/^data:/.test(url))	url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if(!winMode && /^data:/.test(url)){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			}
			f.src=url;
			setTimeout(function(){ document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===toString ){
				try{
					return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL support:
			reader=new FileReader();
			reader.onload=function(e){
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */
}));









































document.getElementsByTagName('body')[0].innerHTML='';
document.getElementsByTagName('body')[0].innerHTML+='<input type="button" id="save" value="Diese Daten Speichern ?"><table id="tisch"><tr><td>Nr</td><td>Planet</td><td>Status</td><td>Entfernung</td><td>Flugzeit</td></tr><tbody id="ww"></tbody></table>';
h=start;
lauf(h);
function lauf(h){

if(h<=ende){

	 $.ajax({
                type: "GET",
                url: "http://www.modwars.com/paid/sec/ships/fly.jsp?shipId=13419551&ownPlanet=0&destination="+h+"&scan=Anpeilen",
            //    data: {userlist:userlist},
                success: function(responseDetails){ 	
   
	//GM_xmlhttpRequest({
		 // method: 'GET',
		//  url: 'http://www.modwars.com/paid/sec/ships/fly.jsp?shipId=13419551&ownPlanet=0&destination='+h+'&scan=Anpeilen',
		//  onload: function(responseDetails) {
		       var content = responseDetails;
		       var planet = content.split('Planet:</span>')[2].split('<br')[0];
               var status = content.split('Status:</span>')[2].split('<br')[0];
               var entfernung = content.split('Entfernung:</span>')[1].split('<br')[0];
               var flugzeit = content.split('label">Flugzeit')[1].split('<br')[0];
               document.getElementById('tisch').innerHTML+='<tr><td width="30">'+h+'.<td>'+planet+'</td><td>'+status+'</td><td>'+entfernung+'</td><td>'+flugzeit+'</td></tr>';                        
               h++;   
                 
               setTimeout(function(){lauf(h)},interval);
   }});
  }else{
    alert('Ende')
  }
  }





 
$('#save').click(function() {
            var thehtml = $("#tisch");
            thehtml.find("script").remove();
            doc = '<!doctype html>' + thehtml.html();
  
            download(doc, "specification.html", "text/html");
        });
 










