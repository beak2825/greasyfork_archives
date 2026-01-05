// ==UserScript==
// @name         frisch's Utilities
// @namespace    http://null.frisch-live.de/
// @version      0.35
// @description  Combines several userscripts. Includes Shift-Copy, Image Transformation, Html Element Deletion, Mousegrab for Link selection
// @author       frisch
// @grant        GM_openInTab
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/24917/frisch%27s%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/24917/frisch%27s%20Utilities.meta.js
// ==/UserScript==
console.log("Initializing frisch Utilities...");

var jq = document.fExt.jq;
var ctxUtil = document.fExt.ctxMenu.addCtxSub("Utilities");

// #################### Shift-Copy - Start
var cpyText = '';

function clickOverride(e){
	var retVal = true;
	if(e.shiftKey){
		e.preventDefault();
		var src =  document.fExt.getSelection() || document.fExt.getSource(e.target);
		switch(e.which){
			case 1:
				document.fExt.clipboard("Copy", src);
				retVal = false;
				break;
			case 2:
				cpyText += src + '\n';
				retVal = false;
				break;
			case 3:
				break;
			default:
				break;
		}
	}

	return retVal;
}

jq(document).on("auxclick", clickOverride);
jq(document).on("click", clickOverride);

jq(document).keyup(function(e) {
	if (e.which === 16){ // Shift
		if(cpyText.length > 0)
			document.fExt.clipboard("Copy", cpyText);

		cpyText = '';
	}
});
// #################### Shift-Copy - End

// #################### Html Elements Deleter - Start

var ctxDelHtml = document.fExt.ctxMenu.addCtxItem("Delete Element", ctxUtil);
ctxDelHtml.Action = function(event, sender, actor) {
	if(delHtmlTarget !== undefined) {
		jq(delHtmlTarget).remove();
		delHtmlTarget = undefined;
	}
};
var delHtmlTarget;


// #################### Html Elements Deleter - End

// #################### GENERAL CTX HANDLING - Start
jq("#fExtContextMenu").on("fExtContextMenuOpening", function(event, actor){
	delHtmlTarget = actor;
});
// #################### GENERAL CTX HANDLING - End

// #################### Image Rotation - Start

var subTransf = document.fExt.ctxMenu.addCtxSub("Transformation", ctxUtil);

document.fExt.ctxMenu.addCtxItem("Rotate left", subTransf).Action = function(event, sender, actor){
	document.fExt.rotate(actor, -90);
};

document.fExt.ctxMenu.addCtxItem("Rotate right", subTransf).Action = function(event, sender, actor){
	document.fExt.rotate(actor, 90);
};

document.fExt.ctxMenu.addCtxItem("Zoom in", subTransf).Action = function(event, sender, actor){
	document.fExt.zoomIn(actor, 20);
};

document.fExt.ctxMenu.addCtxItem("Zoom out", subTransf).Action = function(event, sender, actor){
	document.fExt.zoomOut(actor, 20);
};

// #################### Image Rotation - End

// #################### Cloud Converter - Start
var allowedExtensions = ["webm", "gif"];
var cApiKey = 'pUrKocUqgi32gMrbsDNgqhfTu6leQzBhpI5PhqgzWkdOoysidU892f0M9AvjJUBW5gVpgWWhTQdybz54ygK3cQ'; // Enter your API-Key here, get it at https://cloudconvert.com/

if(cApiKey.length > 0) {
	var jq = document.fExt.jq;
	var ccContainer = jq("<div id='ccContainer' style='display:none;' ><a href='#' id='ccLink' style=''>Convert</a></div>");
	document.fExt.createStyle("#ccContainer { width: 60px; height: 18px; border: 2px solid black; font-weight: bold; text-align: center; padding: 2px 4px; position: absolute; background-color: #fff; }");

	ccContainer.appendTo("body");

	var ctxItemConv = document.fExt.ctxMenu.addCtxItem('Convert to MP4', ctxUtil);
	ctxItemConv.Action = function(event, sender){
		document.fExt.message("Starting conversion...");
		var src = jq("#ccLink").attr("href");
		var ext = grabExtension(src);

		jq.ajax({
			url: "https://api.cloudconvert.com/process",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", cApiKey);
			},
			type: 'POST',
			dataType: 'json',
			data: {
				"apikey": cApiKey,
				"inputformat" : ext,
				"outputformat": "mp4"
			},
			success: function (data) {
				var convertLnk = "https:" + data.url;
				startConversion(src, convertLnk);
				console.log("Process URL = " + convertLnk);
			},
			error: function(data){
				document.fExt.message("Error converting file: " + data.responseText);
			}
		});
		return false;
	};

	jq("#fExtContextMenu").on("fExtContextMenuOpening", function(event, actor){
		var src = document.fExt.getSource(actor.get(0));
		var ext = grabExtension(src);

		ctxItemConv.Toggle(jq.inArray(ext, allowedExtensions) >= 0);
		jq("#ccLink").attr("href",src);
	});
}
else {
	console.log("No CloudConverter APIKey found.");
}

function startConversion(srcLnk, convLnk){
	document.fExt.message("Processing item...");

	jq.ajax({
		url: convLnk,
		type: 'POST',
		dataType: 'json',
		data: {
			"wait": true,
			"input": "download",
			"file": srcLnk,
			"outputformat": "mp4"
		},
		success: function(data){
			var url = "https:" + data.output.url;
			GM_openInTab(url, true);
			document.fExt.message();
		},
		error: function(data){
			document.fExt.message("Error converting " + srcLnk + ": " + data.responseText);
		}
	});
}

function grabExtension(src){
	var start, end;

	start = src.lastIndexOf(".") + 1;
	if(src.lastIndexOf("?") >= 0)
		end = src.lastIndexOf("?");
	else
		end = src.length;

	return src.substring(start, end);
}

// #################### Cloud Converter - End

// #################### Image Info - Start
/*
document.fExt.ctxMenu.addCtxItem("View Image Info", ctxUtil).Action = function(event, sender, actor){
    $.getImageData({
        url: actor.get(0).src,
        success: function(image){
            // Do something with the now local version of the image
        },
        error: function(xhr, text_status){
            // Handle your error here
        }
    });
};
*/
// #################### Image Info - End
// #################### YouTubeInMP4 - Start
var ytimp4Url = "http://youtubeinmp4.com/youtube.php?video=";
document.fExt.ctxMenu.addCtxItem("Download on Youtubeinmp4.com", ctxUtil).Action = function(event, sender, actor){
	var src = window.location.href;
	if(src.indexOf("/watch") < 0)
		src = document.fExt.getSource(actor.get(0));

	var url = encodeURI(ytimp4Url + src);
	GM_openInTab(url);
};
// #################### YouTubeInMP4 - End

// #################### Mousegrab for Link - Start
var holdInfo = {
	id: 0,
	actor: undefined,

	display: undefined,
	height: 0,
	width: 0,
	offset: undefined,
	value: undefined,

	set: function(actor){
		this.id++;
		this.actor = actor;
		this.display = jq(actor).css("display");

		this.height = jq(actor).outerHeight();
		this.width = jq(actor).outerWidth();
		this.offset = jq(actor).offset();
		this.value = jq(actor).text();

		return this.id;
	},
	reset: function(){
		this.hide();
		this.id++;
		this.actor = undefined;
		this.display = undefined;
		this.height = undefined;
		this.width = undefined;
		this.offset = undefined;
		this.value = undefined;
	},
	show: function(){
		if(this.actor) {
			/*
			jq(this.actor).hide();
			*/
			selectorBox.show(0)
				.text(this.value)
				.offset(this.offset)
				.val(this.value)
				.width(this.width)
				.height(this.height)
				.focus();
		}
	},
	hide: function(){
		/*
		if(this.actor){
			if(this.display)
				jq(this.actor).css("display", this.display);
			else
				jq(this.actor).show();
		}
		*/
		if(selectorBox.is(":visible")) {
			selectorBox.hide();
			selectorBox.val('');
		}
	},
};
var msNeededToHold = 350; // Time needed to hold mousebutton in milliseconds
var selectorBox = jq("<input type='text' style='display: none;' id='fExtUtilSelectorBox' value=''></input>");
document.fExt.createStyle("#fExtUtilSelectorBox { font-size: 14px !important; background-color: white !important; color: black !important; z-index: " + document.fExt.TopZIndex() + " !important; padding: 6px !important; position: absolute; }");

selectorBox.focusout(function(){
	holdInfo.reset();
});

selectorBox.appendTo("body");

jq(document).on("mousedown", "a", function(e) {
	if(e.which === 1){
		holdInfo.reset();
		var holdID = holdInfo.set(e.target);
		jq(document).on("mousemove", cancelAtDrag);

		setTimeout(function(){
			if(e.target === holdInfo.actor && holdID === holdInfo.id) {
				holdInfo.show();
			}
		}, msNeededToHold);
	}

	return true;
});

function cancelAtDrag(e){
	if(e.which === 1){
		holdInfo.reset();
	}
	jq(document).off("mousemove", cancelAtDrag);
}

jq(document).on("mouseup", "a", function(e) {
	if(e.target === holdInfo.actor) {
		holdInfo.reset();
	}
	else return true;
});
// #################### Mousegrab for Link - End


// #################### Copy links from Domain - Start
var ctxSubCpyDom = document.fExt.ctxMenu.addCtxSub("Copy Domain Links", ctxUtil);
var objCpyDom = [];
var cpyLnks = [];

jq("a[href]").each(function(ind, itm) {
	var hnSplit = itm.hostname.split(".");

	var domainName;
	if(hnSplit.length === 3)
		domainName = hnSplit[1];
	else
		domainName = hnSplit[0];

	if(domainName) {
		var dictCpyDom;
		for (var i in objCpyDom) {
			var currCpyDom = objCpyDom[i];
			if (currCpyDom.Domain === domainName) {
				dictCpyDom = currCpyDom;
				break;
			}
		}

		if (dictCpyDom !== undefined) {
			if(jq.inArray(itm.href, dictCpyDom.Links) < 0)
				dictCpyDom.Links.push(itm.href);
		} else {
			dictCpyDom = {
				Domain: domainName,
				Links: [itm.href],
			};
			objCpyDom.push(dictCpyDom);
		}
	}
});

objCpyDom.sort(function(a, b) {
	return a.Domain.localeCompare(b.Domain);
});

for(var i = 0; i < objCpyDom.length; i++) {
	var objDomain = objCpyDom[i];
	var ctxCpyDom = document.fExt.ctxMenu.addCtxItem(objDomain.Domain + "(" + objDomain.Links.length + ")", ctxSubCpyDom);
	ctxCpyDom.ClickCloses = false;
	ctxCpyDom.Domain = objDomain;
	ctxCpyDom.Action = function() {
		cpyLnks = cpyLnks.concat(this.Domain.Links);
	};
}

jq("#fExtContextMenu").on("fExtContextMenuClosing", function(event, actor){
	if(cpyLnks.length > 0) {
		if(document.fExt.clipboard("Copy", cpyLnks.join('\n') + '\n'))
			document.fExt.popup("Copied " + cpyLnks.length + " links.");

		cpyLnks = [];
	}
});

jq("#fExtContextMenu").on("fExtContextMenuOpening", function(event, actor){
	cpyLnks = [];
});
// #################### Copy links from Domain - End