// ==UserScript==
// @name        ExVisited
// @namespace   Smoer
// @description Shows when a gallery was last visited and allows the hiding of individual galleries
// @include     http://exhentai.org/*
// @include     https://exhentai.org/*
// @include     http://g.e-hentai.org/*
// @include     https://g.e-hentai.org/*
// @version     2.1
// @grant       GM_setValue
// @grant       GM_getValue
// @require		http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22270/ExVisited.user.js
// @updateURL https://update.greasyfork.org/scripts/22270/ExVisited.meta.js
// ==/UserScript==

if(typeof(Storage) == "undefined"){
	alert("[ExVisited] Your browser does not support storage.");
}

var url = document.URL;
var sto = localStorage.getItem("exvisit3") ? localStorage.getItem("exvisit3") : '{"data":{}}';
var vis = JSON.parse(sto);
var spl = url.split("/");
var d1 = spl[3]
var d2 = spl[4];
var d3 = spl[5];
var css = GM_getValue("css") ? GM_getValue("css") : "background:#222 !important";

var hidden_raw = localStorage.getItem("exvisit3_h") ? localStorage.getItem("exvisit3_h") : '{"data":{}}';
var hidden_tab = JSON.parse(hidden_raw);

vis["data"] = !vis["data"] ? Array() : vis["data"];
hidden_tab["data"] = !hidden_tab["data"] ? Array() : hidden_tab["data"];

// Helper stuff
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); };
}

Number.prototype.pad0 = function(length) {
	var result = this.toString();
	while(result.length<length) result = "0"+result;
	return result;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var old_storage = localStorage.getItem("exvisit");
if(old_storage){
	console.log("Found old storage");
	var osj = JSON.parse(old_storage);
	console.log(osj);
	for(i=0;i<Object.size(osj["data"]);i++){
		vis["data"][ osj["data"][i] ] = Date.now();
	}
	console.log("Merged entries ("+Object.size(osj["data"])+")");
	localStorage.setItem("exvisit3",JSON.stringify(vis));
	localStorage.removeItem("exvisit"); // ;_;7
}

function ExStore(){
	var c = d2+"."+d3;
	vis["data"][c] = Date.now();
	localStorage.setItem("exvisit3",JSON.stringify(vis));
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

var img_hide = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==";

console.log( Object.keys(hidden_tab["data"]).sort() );

function ExHide(){

	var list = $(".it5");
	var thumb = $(".id1");
	var ids = [];
	
	// regular list
	if(list.length>0){
		$("table.itg tbody tr:first-child()").append("<th>Last viewed</th>");
		$("div.it5").css("max-width","570px");
		for(i=0;i<list.length;i++){

			(function(tmp){
				var d = $(list[tmp]).find("a").attr("href").split("/");
				var galleryId  = d[4]+"."+d[5];

				if(hidden_tab["data"][ galleryId ] != undefined){
					console.log("Found hidden gallery: " + galleryId );
					$(list[tmp]).parent().parent().parent().slideUp(500).remove();
				}else{

					console.log("Found gallery: " +  galleryId );

					$("<img src='" + img_hide + "' style='cursor:pointer !important; vertical-align:-4px; margin-right:1px; float:left' title='Hide gallery'>" ).prependTo( $(list[tmp]).find("a").first().parent().parent().parent() ).on( 'click', function(){
						ExHideGallery( galleryId );
						$(list[tmp]).parent().parent().parent().slideUp(500).remove();
					});

					if(vis["data"][ galleryId ] != undefined){
						var d = new Date(vis["data"][ galleryId ]);
						$(list[tmp]).parent().parent().parent().addClass('gv');
						$(list[tmp]).parent().parent().parent().append("<td style='font-size:9px; text-align:left; width:80px'>"+timeDifference(Date.now(), vis["data"][ galleryId ]) + "<br>" + d.getHours().pad0(2) + ":" + d.getMinutes().pad0(2) + " " + d.getDate() + "/" + (d.getMonth()+1) + "</td>");
					}else{
						$(list[tmp]).parent().parent().parent().append("<td style='font-size:9px; text-align:left; width:80px'>Never</td>");
					}

				}
			})(i);

		}
	}

	// thumbnails
	if(thumb.length>0){
		for(i=0;i<thumb.length;i++){
			var d = $(thumb[i]).find("a").attr("href").split("/");
			var c = d[4]+"."+d[5];
			
			$(thumb[i]).css('padding-bottom','25px');
			
			if(vis["data"][c] != undefined){
				var d = new Date(vis["data"][c]);
				$(thumb[i]).addClass('gv');
				$(thumb[i]).append("<br><div style='font-size:11px; margin-top:-5px; text-align:center'>"+timeDifference(Date.now(), vis["data"][c]) + " (" + d.getHours().pad0(2) + ":" + d.getMinutes().pad0(2) + " " + d.getDate() + "/" + (d.getMonth()+1) + ")</div>")
			}
			
		}
	}
}

function ExHideGallery(id){

	// clean slate
	var hidden_raw = localStorage.getItem("exvisit3_h") ? localStorage.getItem("exvisit3_h") : '{"data":{}}';
	var hidden_tab = JSON.parse(hidden_raw);

	hidden_tab["data"][ id ] = 1;
	console.log("Hidden gallery: " + id );
	localStorage.setItem("exvisit3_h",JSON.stringify(hidden_tab));
}

$(function(){
	$("head").append("<style>.gv { "+css+" }</style>");
	if(d1 == "g"){ ExStore(); }
	if(d1.substr(0,1) == "?" || d1.substr(0,1) == "#" || d1.substr(0,1) == "f" || d1.substr(0,1) == "t" || !d1){ 
		var len = Object.size(vis["data"]);
		$("#toppane").append('<div style="text-align:center">'+len+' visited galleries, ' + Object.size(hidden_tab["data"]) + ' hidden. <a href="javascript:;" id="ExImport">Import</a> / <a href="javascript:;" id="ExExport">Export</a> / <a href="javascript:;" id="ExCss">CSS</a></div>');
		
		$("#ExExport").click(function(){
			var e = "";
			for(d in vis["data"]){
				e += d + ":"+vis["data"][d]+";";
			}
			$("body").html('<div style="width:400px;height:400px;overflow:auto;padding:10px;margin:10px">'+e+'</div>');
		});
		
		$("#ExImport").click(function(){
			var c = prompt("Input data here:");
			if(c){
				var d = JSON.parse('{"data":{}}');
				var sp = c.split(";");
				for(k in sp){
					var s = sp[k].split(":");
					d["data"][s[0]] = parseInt(s[1]);
				}
				
				alert("Imported "+Object.size(d["data"])+" entries.");
				localStorage.setItem("exvisit3", JSON.stringify(d))
				location.reload();
				
			}
		});
		
		$("#ExCss").click(function(){
			var c = prompt("Input CSS here:", css);
			if(c){
				GM_setValue("css",c);
				location.reload();
			}
		});

		ExHide();
	}
});