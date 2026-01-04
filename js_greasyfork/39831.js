// ==UserScript==
// @name        Anime-MCP-Reports
// @author      Dravorle
// @description Verbessert die Anzeige und Abarbeitung der Meldungen
// @include     https://proxer.me*
// @version		1.2 Einbau einer Suchfunktion zum filtern der Einträge nach Anime-Titel und Meldername
// @grant       none
// @namespace   AnimeModScripts
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/39831/Anime-MCP-Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/39831/Anime-MCP-Reports.meta.js
// ==/UserScript==

var css = "#ReportsWrapper{display:flex;align-items:center;justify-content:center;flex-wrap:wrap}.SearchWrapper{width:100%;text-align:center}.SearchWrapper > *{margin:2px}.Entry{background-color:#777;text-align:center;border:1px solid #000;margin:5px;padding:1px;cursor:pointer}.Entry > img{height:260px;width:200px;margin-top:5px}.Entry > span.urgent{color:#8A0E0E;font-weight:700}.Entry > span.urgent::before{content:'--URGENT-- '}#ReportControl{display:none;width:85%;height:80%;overflow-y:auto;padding:5px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);border:1px solid #000;border-radius:5px;background-color:#4E4E4E;z-index:10}#ReportDimmer{display:none;position:fixed;width:100%;height:100%;top:0;left:0;background-color:rgba(0,0,0,.5);z-index:9}#ReportControl #TitleArea{width:calc(100% - 20px);border:1px solid #000;border-radius:3px;margin-left:5px;padding:5px;background-color:#777;text-align:center}#ReportControl #Episodes{display:flex;align-items:center;justify-content:center;flex-wrap:wrap}#Episodes div.episode{padding:5px;margin-top:10px;background-color:#5E5E5E;width:calc(100% - 20px);border-radius:6px}#Episodes div.hosterWrapper{margin-left:25px;margin-right:25px;height:0;overflow:hidden}div.episode span{cursor:pointer}div.episode.active div.hosterWrapper{height:auto!important}div.episode.inactive span::after{content:' \\25BC'}div.episode.active span::after{content:' \\25B2'}#Episodes div.hoster{margin-top:5px}#Episodes div.hoster > *{margin-left:10px;vertical-align:middle}#Episodes div.hoster > img{width:32px;height:32px}#Episodes div.report{margin-top:5px;display:table;width:calc(100% - 25px);border:1px solid #000;background-color:#777}#Episodes div.report > *{padding:5px;display:table-cell;border:1px solid #FFF}#Episodes div.userinfo{width:250px;vertical-align:top}#Episodes div.userMessage{margin-left:25px;width:calc(100% - 250px - 54px)}";
var data;
var cForFun;

start();
$(window).on("ajaxSuccess", function() {
	start();
});

function start() {
	if( $("#CustomMCPReports").length > 0 || $(".inner").text().indexOf("Keine weiteren Einträge.") > -1 || window.location.href.indexOf( "mcp?section=anime&s=reports" ) === -1) {
		return;
	}
	data = {};
	cForFun = 0;
	$(".inner").html('<div id="loading" class="customBubble" style="display:inline;"></div>');
	$("<input type='hidden' id='CustomMCPReports' />").appendTo(".inner");
	
	LoadReports();
}

function DisplayReports() {
	console.log(data);
	$("<style>"+css+"</style>").appendTo("head");
	
	$("<div class='SearchWrapper'></div>").appendTo(".inner");
	$("<input type='text' id='ReportSearchAnime' placeholder='Anime' />").appendTo(".SearchWrapper");
	$("<input type='text' id='ReportSearchUser' placeholder='User' />").appendTo(".SearchWrapper");
	//$("<input type='text' id='ReportSearchIrgendwas' placeholder='Uh, irgendwas?' />").appendTo(".inner");
	
	$("<div id='ReportsWrapper'></div>").appendTo(".inner");
	$("a:contains('Meldungen')").text("Meldungen ["+cForFun+"]");
	
	/*
	$("#ReportSearch").autocomplete({
		source: $.map( Object.keys(data), function(_k) {
			return { label: data[_k].Title, value: _k };
		}),
		select: function(event,ui) {
			console.log(ui);
			
			if( ui.item !== undefined ) {
				
			}
            $(".Entry[data-id!='']");
        }
	});
	*/
	var search = { anime: null, user: null };
	$("#ReportSearchAnime").on("keyup", function() {
		search.anime = ($(this).val() === "")?null:$(this).val();
		ApplySearch(search);
	});
	
	$("#ReportSearchUser").on("keyup", function() {
		search.user = ($(this).val() === "")?null:$(this).val();
		ApplySearch(search);
	});
	
	//Alle Anime durchgehen
	var sort = Object.keys(data).sort( function(a,b) {
		return data[b].ReportCount - data[a].ReportCount;
		//return ( (data[b].Kineh === true)?(20000000):(data[b].ReportCount) ) - ( (data[a].Kineh === true)?(20000000):(data[a].ReportCount) );
	} );
	
	for( var i = 0; i < sort.length; i++ ) {
		_a = sort[i];
		$("<div class='Entry' data-title='"+data[_a].Title+"' data-id='"+_a+"'><span "+( (data[_a].ReportCount >= 5)?("class='urgent'"):("") )+"'>"+data[_a].ReportCount+" "+( (data[_a].ReportCount > 1)?("Meldungen"):("Meldung") )+"</span><br /><img title='"+data[_a].Title + " (" + data[_a].Type +")' src='//cdn.proxer.me/cover/"+_a+".jpg' /></div>").appendTo("#ReportsWrapper");
	}
	
	$("#ReportsWrapper > div.Entry").on("click", function() {
		OpenReport( $(this).attr("data-id") );
	});
	
	//Div zum bearbeiten der Meldungen einbauen, vorerst unsichtbar!
	$("<div id='ReportControl' data-current=''> <div id='TitleArea'></div> <div id='Episodes'></div> <div id='TestArea'></div> </div>").appendTo(".inner");
	$("<div id='ReportDimmer'></div>").appendTo(".inner");
	$("#ReportDimmer").on("click", function() {
		$("#ReportControl").fadeOut();
		$("#ReportDimmer").fadeOut();
	});
	
	$("#loading").remove();
}

function ApplySearch(s) {
	//Wenn etwas von beiden nicht NULL ist, dann ausblenden starten
	$(".Entry.hiddenItem").removeClass("hiddenItem");
	
	$(".Entry").filter( function() {
		var thisId = $(this).attr("data-id");
		
		var matchAnime, matchUser = false;
		
		matchAnime = (s.anime !== null)?( data[thisId].Title.search( new RegExp(s.anime, "i") ) > -1 ):true;
		matchUser = (s.user !== null)?( getUsers(thisId).some( f => f.search( new RegExp(s.user, "i") ) > -1 ) ):true;
		
		return !matchAnime || !matchUser;
	}).addClass("hiddenItem").fadeOut();
	
	$(".Entry:not(.hiddenItem)").filter(":hidden").fadeIn();
}

function getUsers(id) {
	var users = [];
	
	for(var _ep in data[id].episodes) {
		for(var _h in data[id].episodes[_ep].streams) {
			for(var i = 0; i < data[id].episodes[_ep].streams[_h].reports.length; i++) {
				users.push( data[id].episodes[_ep].streams[_h].reports[i].User.Name );
			}
		}
	}
	
	return users;
}

function OpenReport(AnimeId) {
	console.log("Show Report for Anime " + AnimeId);
	if( $("#ReportControl").attr("data-current") !== AnimeId ) {
		$("#ReportControl").attr("data-current", AnimeId);
		
		$("#TitleArea").children().remove();
		$("#Episodes").children().remove();
		$("#TestArea").children().remove();
		
		$("<a href='//proxer.me/info/"+AnimeId+"/list' target='_new'>"+data[AnimeId].Title+"</a> <span>("+data[AnimeId].Type+")</span>").appendTo("#TitleArea");
		
		for( var _e in data[AnimeId].episodes ) {
			$("<div class='episode active' data-ep='"+_e+"'><span>Episode "+_e+"</span></div>").appendTo("#Episodes");
			$("<div class='hosterWrapper' data-ep='"+_e+"'></div>").appendTo("div.episode[data-ep='"+_e+"']");
			for( var _h in data[AnimeId].episodes[_e].streams ) {
				$("<div class='hoster' data-hoster='"+_h+"' data-streamid='"+data[AnimeId].episodes[_e].streams[_h].StreamId+"'> <img src='/images/hoster/"+_h.replace( /2|_de|_en/g , "")+".png' /> ("+data[AnimeId].episodes[_e].streams[_h].Lang+") <a href='javascript:;' title='Funktioniert'>[Stream funktioniert]</a> <a href='javascript:;' title='Defekt'>[Stream defekt!]</a> <a href='javascript:;' title='Test'>[Testen]</a> </div>").appendTo("div.hosterWrapper[data-ep='"+_e+"']");
				for (var _r = 0; _r < data[AnimeId].episodes[_e].streams[_h].reports.length; _r++) {
					var thisReport = data[AnimeId].episodes[_e].streams[_h].reports[_r];
					$("<div class='report'> <div data-uid='"+thisReport.User.UID+"' data-un='"+thisReport.User.Name+"' class='userinfo'> <a href='javascript:;' title='User'>"+thisReport.User.Name+"</a> ("+thisReport.Time+") <br /> <br /> <a href='javascript:;' title='Blacklist'>Blacklist</a> </div> <div class='userMessage'> "+thisReport.Message+" </div> </div>").appendTo("div.hosterWrapper[data-ep='"+_e+"'] div.hoster[data-hoster='"+_h+"']");
				}
			}
		}
		
		$("div.episode > span").on("click", function() {
			if( $(this).parent().hasClass("active") ) {
				$(this).parent().switchClass("active", "inactive");
			} else {
				$(this).parent().switchClass("inactive", "active");
			}
		});
		
		//Nur 1x clickbar!
		$("a[title='Funktioniert']").one("click", function() {
			//An Schnittstelle senden, dass Stream funktioniert!			
			KeepStream( $(this).parent().attr("data-streamid") );
			
			removeReport(this);
		});
		
		//Nur 1x clickbar!
		$("a[title='Defekt']").one("click", function() {
			//An Schnittstelle senden, dass Stream nicht funktioniert!			
			RemoveStream( $(this).parent().attr("data-streamid") );
			
			removeReport(this);
		});
		
		$("a[title='Test']").on("click", function() {
			//Test-Funktion starten!
			console.log("Stream testen");
			
			var ajaxLink = "https://proxer.me/uploadstream?format=json&action=test&mid="+ $(this).parent().attr("data-streamid") +"&"+$('#proxerToken').val()+"=1";
			$.getJSON(ajaxLink, function(data) {
			  if (data.links.length > 0) {
				for (var i = 0; i < data.links.length; i++) {
				  var win = window.open(data.links[i], '_blank');
				}
			  }
			});
		});
		
		$("a[title='User']").on("click", function() {
			//Userprofil öffnen
			console.log("User öffnen");
			
			window.open( "https://proxer.me/user/"+ $(this).parent().attr("data-uid"), "_blank" );
		});
		
		$("a[title='Blacklist']").on("click", function() {
			//Blacklist einblenden
			console.log("Blacklist öffnen");
			
			window.open( "https://proxer.me/mcp?section=anime&s=blacklist&id="+ $(this).parent().attr("data-uid") +"&f={%22section%22:%22anime%22,%22type%22:%22auto%22}", "_blank" );
		});
	}
	$("#ReportControl").fadeIn();
	$("#ReportDimmer").fadeIn();
}

function KeepStream(StreamId) {
	console.log("Remove Report");
	fetch("https://proxer.me/mcp?section=anime&s=reports&action=deleteReport&mid="+StreamId);
}

function RemoveStream(StreamId) {
	console.log("Remove Stream");
	fetch("https://proxer.me/mcp?section=anime&s=reports&action=deleteMedium&mid="+StreamId);
}

function fetch(url) {
	$.get(url, function() {});
}

function removeReport( target ) {
	var animeId = $("#ReportControl").attr("data-current");
	var ep = $(target).parent().parent().attr("data-ep");
	var hoster = $(target).parent().attr("data-hoster");
	
	cForFun -= data[animeId].episodes[ep].streams[hoster].reports.length;
	
	if( $(".hosterWrapper[data-ep='"+ep+"']").children().length > 1 ) {
		//Mehr als Stream in Episode vorhanden, die derzeitige ist also nicht die letzte, nur die jetzige löschen!
		$(target).parent().fadeOut("normal", function() { $(this).remove(); });
		delete data[animeId].episodes[ep].streams[hoster];
	} else {
		//Nur noch dieser Hoster vorhanden! Komplette Episode entfernen!
		$(".episode[data-ep='"+ep+"']").fadeOut("normal", function() { $(this).remove(); });
		delete data[animeId].episodes[ep];
	}
	
	if( Object.keys(data[animeId].episodes).length === 0) {
		//Keine Episoden mehr vorhanden! Eintrag komplett entfernen, Bearbeitungspanel schließen und Eintrag aus Übersicht löschen
		$("div.Entry[data-id='"+animeId+"']").fadeOut("normal", function() { $(this).remove(); });
		delete data[animeId];
		
		$("#ReportControl").attr("data-current", "");
		$("#ReportDimmer").trigger("click");
	}
	$("a:contains('Meldungen')").text("Meldungen ["+cForFun+"]");
}

function LoadReports(_p = 1) {
	console.log("Loading Page: "+_p);
	var url = "https://proxer.me/mcp?section=anime&s=reports&p="+_p;
	console.log(url);
	
	$.get(url, function(resp) {
		var rows = $(resp).find("table.details > tbody > tr");
		for( var i = 1; i < rows.length; i++ ) {
			var regexUser = /\/([\d]+)\"\>(.*?)\<.+?>([0-9\.]+)/g;
			var matchesUser = regexUser.exec( $(rows[i]).find("td").eq(0).html() );
			
			var regexEpisode = /\/([\d]+)\#.*?\>(.*?)\<.*?\(([a-zA-Z]*)\).*?\>([a-zA-Z]*)\<.*?\>(.*)/g;
			var matchesEpisode = regexEpisode.exec( $(rows[i]).find("td").eq(1).html() );
			
			var regexComment = /(.*?)\<hr\>(.*)/g;
			var matchesComment = regexComment.exec( $(rows[i]).find("td").eq(3).html() );
			
			var AnimeId = matchesEpisode[1];
			var Episode = $(rows[i]).find("td").eq(2).text();
			var streamId = $(rows[i]).find("a.test").attr("id").substr(6);
			
			//OBJEKT-STRUKTUR AUFBAUEN
			if( data[AnimeId] === undefined ) {
				// Zu diesem Anime wurde noch nichts gemeldet, Anime erstellen!				
				data[AnimeId] = {
					Title: matchesEpisode[2],
					Type: matchesEpisode[3],
					ReportCount: 0,
					episodes: {}
				};
			}
			
			if( data[AnimeId].episodes[Episode] === undefined ) {
				// Noch keine Meldung zu dieser Episode, Eintrag erstellen!
				data[AnimeId].episodes[Episode] = {
					streams: {}
				};
			}
			
			if( data[AnimeId].episodes[Episode].streams[matchesEpisode[5]] === undefined ) {
				// Noch keine Meldung zu diesem Hoster, Hoster erstellen!
				data[AnimeId].episodes[Episode].streams[matchesEpisode[5]] = {
					StreamId: streamId,
					Lang: matchesEpisode[4],
					reports: []
				};
			}
			
			var report = {
				User: {
					UID: matchesUser[1],
					Name: matchesUser[2],
					UserAgent: matchesComment[2]
				},
				Time: matchesUser[3],
				Message: matchesComment[1]
			};
			
			/* KINEH >> Vielleicht später Reports von bestimmten Personen priorisieren?
			if(report.User.Name == "kineh") {
				//OH SHIT, IT'S KINEH!
				console.log("Kineh found");
				data[AnimeId].Kineh = true;
			}
			//KINEH */
			
			data[AnimeId].episodes[Episode].streams[matchesEpisode[5]].reports.push ( report );
			data[AnimeId].ReportCount++;
			cForFun++;
		}
		
		if( $(resp).find("a.menu:contains('>')").length > 0 /* && _p < 2 */ ) {
			console.log("Found Page: " + (_p + 1) );
			LoadReports( _p + 1 );
		} else {
			DisplayReports();
		}
	});
}
