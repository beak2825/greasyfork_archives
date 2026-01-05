// ==UserScript==
///////////////// In case it fails to update in TamperMonkey, visit  https://github.com/svArtist/Google-Images-Direct-Links/raw/master/googleImagesDirectLinks.user.js  directly ////////
// @name		Google Images direct links
// @version		1.5
// @description Add direct links to the picture and the page link to the Google Image Search results.
// @namespace	Google
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		/^https?:\/\/(www\.)*google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at		document-body
// @grant		GM_xmlhttpRequest
// @connect		*
// @downloadURL https://update.greasyfork.org/scripts/27409/Google%20Images%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/27409/Google%20Images%20direct%20links.meta.js
// ==/UserScript==

var updateInterval = 1000;
var maxtries = 10;

var idle = true;

function updatePage()
{
	if($("#directLinkStyles").length<=0){
		$("head").append("\
		<style id='directLinkStyles'>\
		.linkToTarget{\
			box-shadow: 3px 5px 10px rgba(0,0,0,0.5); \
			cursor: default;\
			position: absolute; \
			right:0; top:0; \
			opacity: 0; \
			background-color: rgba(255,255,255,0.5);\
			transition: background-color 0.5s, opacity 0.5s \
		}\
		.failed .linkToTarget span{\
			color: rgba(230,100,100, 0.7)!important; \
		}\
		a:hover .linkToTarget{\
			opacity: 0.6; \
		}\
		.linksdone:hover .linkToTarget, .linkToTarget:hover{\
			opacity: 1; \
			background-color: rgba(255,255,255,1);\
		}\
		.linksdone:hover .linkToTarget{\
			cursor: pointer;\
		}\
		.linkToTargetLink, .linkToTarget>span{\
			color: rgba(200,200,200, 0.7)!important; \
			padding: 3px 10px; \
			font-size: 28pt; \
			display: block; \
			font-weight: bold; \
			text-decoration: none;\
			transition: color 0.5s, font-size 0.5s, padding 0.5s; \
		}\
		.linkToTargetLink:hover{\
			color: rgba(155,177,233, 1)!important; \
			padding:8px 20px; \
			font-size: 36pt; \
		} \
		</style>");
	}

	$(".rg_di.rg_bx a.rg_l:not(.linksdone)").each(function(){
//		console.log(this);
		var tp = this;
		var tppar = $(tp).parent();
		var imin = tp.href.indexOf("imgurl=");
		if(imin<0)
		{
            $(tp).attr("resTries", $(tp).attr("resTries")?$(tp).attr("resTries")*1+1:1);
            if($(tp).attr("resTries")*1>=maxtries){
                console.log("This Link won't come up with a good fragment: " + $(tp).find("img")[0].src);
				$(tp).addClass("linksdone");
				$(tp).addClass("failed");
				$(tp).find(".linkToTarget span").html("x");
                return true;
            }
			if(!$(tp).hasClass("linkswait")){
				$(tp).addClass("linkswait");
				$(tp).append("<div class='linkToTarget temp'><span>...</span></div>");
			}
//			console.log("Not ready");
			return true;
		}
		var linkconts = tp.href.substr(imin+7);
		var piclink = linkconts.substr(0,linkconts.indexOf("&"));
		var reflink = linkconts.substr(linkconts.indexOf("imgrefurl=")+10);
		reflink = decodeURIComponent(reflink.substr(0, reflink.indexOf("&")));
		piclink = decodeURIComponent(piclink);
		$(tp).find(".linkToTarget.temp").remove();
		$(tp).append("<div class='linkToTarget'><a class='linkToTargetLink' href='" + piclink + "'>+</a></div>");
        $(tp).removeClass("linkswait");
		$(tp).addClass("linksdone");
		
		var urilink = $(tppar).find(".rg_ilmbg")[0];
		$(urilink).html("<a style='display: block; color: #fff; text-decoration: none;' href='" + reflink + "'>" + urilink.innerHTML + "</a>");
		
		$(tp).find(".linkToTargetLink").add(urilink).click(function(e){
			e.stopImmediatePropagation();
		});
	});
}

setInterval(updatePage, updateInterval);

updatePage();