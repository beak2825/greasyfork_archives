// ==UserScript==
// @name	TF2R - Search participants
// @namespace	auhtwoo
// @description	Lets you search participants in raffles
// @include http://tf2r.com/k*
// @grant	none
// @version 1.1.4
// @downloadURL https://update.greasyfork.org/scripts/11354/TF2R%20-%20Search%20participants.user.js
// @updateURL https://update.greasyfork.org/scripts/11354/TF2R%20-%20Search%20participants.meta.js
// ==/UserScript==       

$(window).load(function(){
var rafflid = document.URL.slice(document.URL.indexOf(".com/k")+6,document.URL.length-5);

function dosrch (){
	var count = 0;
	var srf = $("#entrsrchfrm").serializeArray();
	var uid = srf[0].value;
	var mode = srf[1].value;
	var avs = srf[2].value;
	var avt = (avs=="on"?((srf[3].value==0) ? 16 : (srf[3].value==1?48:96)):0);


	$("#results").hide();
	$("#results").text("");
	$("#srb").text("Loading...");
	$.ajax({
			type: "post",
			url: "http://tf2r.com/job.php",
			dataType: "json",
			data: {
				"checkraffle": "true",
				"rid": rafflid,
				"lastentrys": 0,
				"lastchat": lastchat
			},
			success: function(data){
				if(data.status == "fail")
					alert(data.message);
				else if(data.status == "ok")
				{
					if(data.message.newentry.length >= 1)
					{
						for(id in data.message.newentry)
						{
							var ent = data.message.newentry[id];

							if (mode == 0 && uid != ""){
								if (ent.link.indexOf(uid) != -1){
									count++;
									$("#results").append("<a href="+ent.link+">"+ent.name+"</a> was #"+id);
								}
							}
							else if (mode == 1){
								if (uid == "" || (ent.name.toLowerCase().indexOf(uid.toLowerCase()) != -1)){
									count++;
									if(avs=="on")
										$("#results").append("<a href="+ent.link+"><img width='"+avt+"' src='"+ent.avatar+"'></img>"+ent.name+"</a></br>");
									else
										$("#results").append("<a href="+ent.link+">"+ent.name+"</a></br>");
								}	
							}
						}
						if (mode==0 && count==0)
							$("#results").text("That user didn't enter this raffle.");
						if (mode == 0 && count>0){
							$("#results").prepend("User ");
							$("#results").append(" to enter this raffle (including users who left it).");
						}
						if (mode==1 && count==0)
							$("#results").text("No hits.");
						if (mode == 1 && count>0)
							$("#results").prepend("Found "+count+" users:<br>");
						$("#results").show();
						$("#srb").text("New search");
					}
				}
			}
		});
}

document.getElementsByClassName("participants")[0].insertAdjacentHTML("beforeBegin", ' <div><form id="entrsrchfrm">Search participants: <input name="usrch" value="" type="text"><label><input name="search" value="0" type="radio">ID64</label><label><input name="search" value="1" type="radio" checked="">Name</label> <button type="button" id="srb">Search</button> <label>With avatars?<input type="checkbox" name="avatars" checked=""></input></label> <label><input name="avtype" value="0" type="radio" checked="">small</label><label><input name="avtype" value="1" type="radio">medium</label><label><input name="avtype" value="2" type="radio">large</label><div id="results"></div></form></div><br>');
document.getElementById("srb").addEventListener("click", dosrch);

	$('#entrsrchfrm').submit(function(){dosrch();return false;})
	
});