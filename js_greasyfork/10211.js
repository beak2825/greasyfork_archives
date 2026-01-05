// ==UserScript==
// @name	TF2R - Show hidden comments
// @namespace	auhtwoo
// @description	Lets you see the hidden comments on raffles
// @include http://tf2r.com/k*
// @grant	none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/10211/TF2R%20-%20Show%20hidden%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/10211/TF2R%20-%20Show%20hidden%20comments.meta.js
// ==/UserScript==   


$(window).load(function(){
var rafflid = document.URL.slice(document.URL.indexOf(".com/k")+6,document.URL.length-5);
function getposts (){
	$("#morpb").text("Loading...");
	$.ajax({
			type: "post",
			url: "http://tf2r.com/job.php",
			dataType: "json",
			data: {
				"checkraffle": "true",
				"rid": rafflid,
				"lastentrys": entryc,
				"lastchat": 0
			},
			success: function(data){
				if(data.status == "fail")
					alert(data.message);
				else if(data.status == "ok")										
					if(data.message.chaten.length >= 1)
						var datamessages = data.message.chaten.slice(0,-50).reverse();
						for(id in datamessages){
							var ent = datamessages[id];
							$(".userfeed").append("<div class=\"userfeedpost\" style=\"display:none; background-color:#"+ent.color+";\"><div class=\"ufinf\"><div class=\"ufname\"><a href=\""+ent.url+"\" style=\"color:#"+ent.color+";\">"+ent.name+"</a></div><div class=\"ufavatar\"><a href=\""+ent.url+"\"><img src=\""+ent.avatar+"\"></a></div></div><div class=\"ufmes\">"+ent.message+"</div></div>");
						}
				$("#morpb").text("Done, please wait");
				$("#morpd").slideUp("1000",function(){$("#morpd").remove()});
			}
	});
}
if ($(".userfeedpost").length == 50){
	$(".userfeed").append('<div id="morpd" class="userfeedpost"><div class="ufinf"></div><div class="ufmes"><button id="morpb">Limit reached, click to load hidden comments</button><br></div></div>');
	document.getElementById("morpb").addEventListener("click", getposts);
}
});
