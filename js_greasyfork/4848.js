// ==UserScript==
// @name       novaposhta barcode
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://novaposhta.ua/uk/tracking/?cargo_number=*
// @match      http://novaposhta.ua/ru/tracking/?cargo_number=*
// @match      https://novaposhta.ua/uk/tracking/?cargo_number=*
// @match      https://novaposhta.ua/ru/tracking/?cargo_number=*

// @match      http://novaposhta.ua/tracking/?cargo_number=*
// @match      https://novaposhta.ua/tracking/?cargo_number=*
// @match      http://services.ukrposhta.ua/bardcodesingle/DownloadInfo.aspx?id=*
// @match      http://post-tracker.ru/my/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4848/novaposhta%20barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/4848/novaposhta%20barcode.meta.js
// ==/UserScript==


function get_code(str) {
	//var code="http://www.barcodes4.me/barcode/c39/"+str+".jpg";
    var code = "http://www.barcodes4.me/barcode/qr/qr.png?value="+str+"&size=3&ecclevel=0";
	return code;
}
var id = 'nothing';
var url =  document.URL;

if(url.indexOf("ukrposhta")!=-1) {
	console.log("detect ukrposhta");
	var div = document.getElementById('sraka');
    id=document.URL.match(/id=(.*?)$/)[1];
	code = get_code(id);
	var p = document.createElement('p');
	p.innerHTML = "<strong>Штрихкод:</strong><br/><img src=\""+code+"\">";
	div.appendChild(p);
}
else if(url.indexOf("post-tracker")!=-1) {
                console.log("detect post-tracker");
        		var tracks=document.getElementsByClassName('trackcode');


    for(track in tracks){
    t=tracks[track].innerHTML;
    if(t!=undefined)
    {
        code = get_code(t);
                var p = document.createElement('p');
		        p.innerHTML = "<img src=\""+code+"\" >";
		        tracks[track].appendChild(p);
    }
    }

        }
else if (url.indexOf("novaposhta")!=-1) {
        console.log("detect novaposhta");
        id=document.URL.match(/cargo_number=(\d+)/)[1];
    	code = get_code(id);
        var div=document.getElementsByClassName('highlight')[0];
		var p = document.createElement('p');
		p.innerHTML = "<strong>Штрихкод:</strong><img src=\""+code+"\">";
		div.appendChild(p);
}




