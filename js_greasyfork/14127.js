// ==UserScript==
// @name         CSGORage.com bot
// @version      1.3.2
// @description  works in Firefox once again, redesigned version, which reloads when absolutely necessary (watch the AJAX magic!), chooses from all free slots, WORKS FOR NICKNAME RAFFLES! (you will be asked if you wan't to only if you have the right nickname) and checks more often if a raffle is ending soon
// @author       mik13ST (ЖНИК)
// @match        http://csgorage.com/free-raffles/current
// @namespace    https://greasyfork.org/users/20071
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/14127/CSGORagecom%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/14127/CSGORagecom%20bot.meta.js
// ==/UserScript==
default_timeout=10*60*1000; //check each 10 minutes
raffleEnding_timeout=4*60*1000; //if any raffle is red (ending soon), then check after 4 minutes
//you can set your custom timings, but they will be reset when the script is updated ... the script will update itself only if there is a newer version on the link, where the script was downloaded from
$("html")[0].innerHTML+='<div id="scriptInfo" style="padding: 10px"></div>'; //add information div into the page
//$("#scriptInfo")[0].style.width=300;
//$("#scriptInfo")[0].style.height=300;
$("#scriptInfo")[0].style.backgroundColor="green";
$("#scriptInfo")[0].style.position="fixed";
$("#scriptInfo")[0].style.top=120;
$("#scriptInfo")[0].style.right=50;
$("#scriptInfo")[0].style.zIndex=10000;
$("#scriptInfo")[0].style.border="1px dashed silver";
$("#scriptInfo")[0].style.borderRadius="10px";
$("#scriptInfo")[0].innerHTML+='<p id="scriptMessage"></p>';
$("#scriptInfo")[0].innerHTML+='<button id="scriptLogButton" style="color: black;">toggle log visibility</button><br />';
$("#scriptInfo")[0].innerHTML+='<textarea id="scriptLog" style="display: none; margin-top: 5; width: 500; height: 300; color: black"></textarea>';

$("#scriptLogButton")[0].addEventListener("click", function() {
	if ($("#scriptLog")[0].style.display=='none') {
		$("#scriptLog")[0].style.display='';
	} else {
		$("#scriptLog")[0].style.display='none';
	}
});



function log(string) {
	$("#scriptLog")[0].innerHTML+=string;
}

function message(string) {
	$("#scriptMessage")[0].innerHTML=string;
	$("#scriptLog")[0].innerHTML+=string;
	$("#scriptLog")[0].scrollTop=$("#scriptLog")[0].scrollHeight;
}




function main() {	
	var date = new Date();
	log("-----\n"+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2)+"\n");
	log("new raffles checked\n");

	slots_free=[];
	slot=[];	

	$.ajax({
		url: '/free-raffles/current',
		success: function(data) {
			token=data.slice(data.indexOf("hide tok")+20,data.indexOf("hide tok")+19+41);
			rafflesHTML=$(".main.col-lg-10",data)[0].innerHTML;
			$(".main.col-lg-10")[0].innerHTML=rafflesHTML;
			$.each($(".btn.btn-warning.orange_gradient.shadow1"+nicknamePartOfSelector, rafflesHTML), function(index,item) {
				if ($(".ending",item.parentNode.parentNode).length>=1) {
					setTimeout(function(){main();}, raffleEnding_timeout);
					message("raffle is ending soon, will check again in "+(raffleEnding_timeout/1000/60)+" minutes\n");
				} else {
					setTimeout(function(){main();}, default_timeout);										
					message("will check again in "+(default_timeout/1000/60)+" minutes\n");
				}

				if (item.parentNode.innerHTML.indexOf("RIBBON")==-1){
					url=item.parentNode.href;
					rid=Math.abs(parseInt(url.slice(url.length-5,url.length)));
					$.ajax({
						url: '/emptyslots',	
						method: 'POST',
						dataType: 'json',
						data: {
							rid: rid
						},
						success: function(data) {						
							$.each(data, function(index, item) {
								slots_free.push(item);														
							});
							slot.push(slots_free[Math.floor(Math.random() * slots_free.length)]);						
							$.ajax({
								url: '/getslotfree',
								method: 'POST',
								data: {
									rid: rid,
									slots: slot,
									_token: token
								},
								success: function(data){
									log("entered raffle #"+rid+" at slot #"+slot+"\n");
									$.ajax({
										url: '/free-raffles/current',
										success: function(data) {
											$(".main.col-lg-10")[0].innerHTML=$(".main.col-lg-10",data)[0].innerHTML;
										}
									});									
								}
							});                        
						}					
					});
					return false;
				}
			});
		},
		error: function(data,textStatus) {
			var date = new Date();
			log("-----\n"+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2)+"\n");
			message("the server seems to be offline\n");			
			log("will check again in "+(default_timeout/1000/60)+" minutes\n");
			setTimeout(function(){main();}, default_timeout);
		}
	});	
}


if (!GM_getValue("welcomeDone", false)) {	
	alert("Hello! I am CSGORage.com bot and I am ready to work!\n\nI will post info in the box on right side.");
	GM_setValue("welcomeDone", true);
}

if ($("html")[0].innerHTML.indexOf("We will be back soon")==-1 && $("html")[0].innerHTML.indexOf("offline")==-1) {	
	if($(".login").length<1){
		if ($(".nickname")[0].innerHTML.toLowerCase().indexOf("csgorage.com")!=-1 && (GM_getValue("joinNicknameRaffles", false))) {
			GM_setValue("joinNicknameRaffles",confirm("But first I need some info:\n\nDo you wan't to be joined to nickname raffles as well?\n\"OK\" = yes, \"Cancel\"= no"));
		}

		joinNicknameRaffles=GM_getValue("joinNicknameRaffles", false);

		nicknamePartOfSelector=(joinNicknameRaffles)?"":":not('.nickname')"; //determines which raffles to search for (if include ":not('nickname')" on not)

		main();		
	} else {
		message("not logged in!\n");
	}
} else {
	message("site is down ... will reload in 5 minutes\n");
	setTimeout(function() {location.reload();}, 5*60*1000);
}