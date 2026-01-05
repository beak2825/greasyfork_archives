// ==UserScript==
// @author			Als <Als@admin.ru.net>
// @name			trigger.fm hacks
// @description		Various extensions for trigger.fm
// @icon			http://trigger.fm/favicon.ico
// @include			http://*.trigger.fm/*
// @grant			none
// @version			9.2.2
// @run-at			document-end
// @namespace		https://greasyfork.org/users/15812
// @compatible		chrome, opera
// @license			WTFPL <http://www.wtfpl.net/txt/copying/>
// @require			https://greasyfork.org/scripts/4742-waituntilexists/code/waitUntilExists.js?version=15821
// @downloadURL https://update.greasyfork.org/scripts/12519/triggerfm%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/12519/triggerfm%20hacks.meta.js
// ==/UserScript==


var ctrlenter = false, scrobble = false, lfmmsg, scrobbler, lfmkey = "4366bdedfe39171be1b5581b52ddee90", lfmsecret = "5def31e9198fa02af04873239bcb38f5", lfmurl = "//ws.audioscrobbler.com/2.0/", oc_queue = {'busy': false, 'q': []};

customCodes[3][1] = '<a href="$1" target="_blank">$1</a>';


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


$(document).ready(function() {
	
/*	
	$(player.sound).on("error", function() {
		if (player.sound.networkState === 1) {
			player.play();
		}
	});
*/

	client.socket.on("channeldata", function(){
		universal_starter();
		if (client.user) {
			lastfm_scrobbling();
			users_tracks();
			ctrlenter_send();
			hotkeys_bind();
			karma_detail_view();
			time_travel();
		}
		current_time();
	});


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function loadUrl(url, reader, file, callback) {
		ID3.loadTags(url, function() {
			var alltags = ID3.getAllTags(url);
			if (alltags.artist && alltags.title) {
				callback(alltags);
			} else {
				var filename = file.name.substr(0, file.name.lastIndexOf('.')) || file.name;
				alltags = filename.split(/^(\d+\. )?(.*) - (.*)$/);
				callback({'artist': alltags[2], 'title': alltags[3]});
			}
		}, {
			tags: ["artist", "title"],
			dataReader: reader
		});
	}
	
	
	addJS_Node(loadUrl);
	
	
	function addJS_Node(c) {
		var b = document, a = b.createElement("script");
		a.type = "text/javascript";
		c && (a.textContent = c);
		(b.getElementsByTagName("head")[0] || b.body || b.documentElement).appendChild(a);
	}
	
	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function hotkeys_bind() {
		$('#messageinput').off("keydown.esc");
		$('#messageinput').on("keydown.esc", function(event) {
			27 === event.keyCode && $(this).val("");
		});

		$(document).off("keyup.nhk");
		$(document).on("keyup.nhk", function(event) {
			if (event.keyCode === 38  && event.ctrlKey)
			{
				var track = client.channel.current;
				if (track.vote < client.user.w) {
					client.addvote({'id': track.id, 'v': client.user.w});
					if (mutetrack) {
						player.mute(false);
					}
				} else {
					client.addvote({'id': track.id, 'v': 0});
				}
			}
			if (event.keyCode === 40  && event.ctrlKey)
			{
				var track = client.channel.current;
				if (track.vote > -client.user.w) {
					client.addvote({'id': track.id, 'v': -client.user.w});
					if (mutetrack) {
						player.mute(true);
					}
				} else {
					client.addvote({'id': track.id, 'v': 0});
					if (mutetrack) {
						player.mute(false);
					}
				}
			}
		});
	}


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function karma_detail_view() {
		$('#info .tabs .tab').off('click.k');
		$('#info .tabs .tab').on('click.k', function() {
			$(this).hasClass("profile") && karma_voters();
		});

		$('#chatmessages').off('click.k');
		$('#chatmessages').on('click.k', 'span.info', function() {
			karma_voters();
		});

		$('.users .scroller').off('click.k');
		$('.users .scroller').on('click.k', 'span.info', function() {
			karma_voters();
		});

		$('#content').off('click.k');
		$('#content').on('click.k', 'a[href^="javascript:getuser"]', function() {
			karma_voters();
		});
	}


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function current_time() {
		$('.current').off('mouseover.t');
		$('.current').on('mouseover.t', '.timer', function() {
			$(this).attr('title', secToTime(client.channel.ct)+' ('+parseInt(client.channel.ct*100/client.channel.current.tt)+'%) из '+secToTime(client.channel.current.tt));
		});
	}


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function karma_voters() {
		$('.content.profile .uid').waitUntilExists(function(){
			$(".content.profile .kr .numb").css('cursor', 'pointer');
			$('.content.profile .inner').prepend('<div class="kvotes" style="display: none; float: right; position: absolute; width: 100%; opacity: 0.99;"><table align="right" border="0" cellpadding="0" cellspacing="15"><tbody><tr><td style="font-size: small; color: #eba400; font-weight: bold;">Молодцы</td><td style="font-size: small; color: #000; font-weight: bold;">Подлецы</td></tr><tr><td valign="top"><ul class="plist"></ul></td><td valign="top"><ul class="nlist"></ul></td></tr></tbody></table></div>');
			if ($.Storage.get('style') == 'nigth') {
				$('.content.profile .inner .kvotes').css('background-color', '#383838');
			} else {
				$('.content.profile .inner .kvotes').css('background-color', '#f6f6f6');
			}
			$(".content.profile").off("click.karma");
			$(".content.profile").on("click.karma", ".kr .numb", function(){
				$('.content.profile .inner .kvotes').toggle(400);
			});
			var uid = $(this).text().split('#')[1];
			client.getUser({'id': parseInt(uid)}, function(data) {
				$('.content.profile .kvotes tr:eq(0) td:eq(0)').append(' ('+data.p.length.toString()+')');
				$('.content.profile .kvotes tr:eq(0) td:eq(1)').append(' ('+data.n.length.toString()+')');
				$(data.p).each(function(i,vote) {
					$('.content.profile .kvotes .plist').append('<li><a href="javascript:getuser('+vote.vid+');void(0);">'+vote.n+'</a></li>');
				});
				var $bigList = $('.plist'), group;
				while((group = $bigList.find('li:lt(30)').remove()).length){
					$('<ul style="float: left; font-size: 7pt; padding-left: 20px; list-style: initial;" />').append(group).appendTo('.content.profile .kvotes tr:eq(1) td:eq(0)');
				}
				$(data.n).each(function(i,vote) {
					$('.content.profile .kvotes .nlist').append('<li><a href="javascript:getuser('+vote.vid+');void(0);">'+vote.n+'</a></li>');
				});
				var $bigList = $('.nlist'), group;
				while((group = $bigList.find('li:lt(30)').remove()).length){
					$('<ul style="float: left; font-size: 7pt; padding-left: 20px; list-style: initial;" />').append(group).appendTo('.content.profile .kvotes tr:eq(1) td:eq(1)');
				}
				$('.content.profile .kvotes .plist').remove();
				$('.content.profile .kvotes .nlist').remove();
			});
		});
	}
	
	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//	


	function universal_starter() {
		$(client.channel.pls).each(function(i,track) {
			$('.trackid'+track.id).waitUntilExists(function(){
				track.a = $("<div/>").html(track.a).text().trim();
				track.t = $("<div/>").html(track.t).text().trim();
				makeEditable(track, $(this).find('.ratingdiv'));
				add_lastfm_search(track, $(this).find('.track_links'));
				add_history_search(track, $(this).find('.track_links'));
				add_pleercom_search(track, $(this).find('.track_links'));
				oldhat_class(track, $(this));
				fill_lastfm_tags(track, $(this));
				//redef_limits();
			},true);
		});
		
		var track = client.channel.current;
		track.a = $("<div/>").html(track.a).text().trim();
		track.t = $("<div/>").html(track.t).text().trim();
		var trackrating = $('.current .curnum');
		makeEditable(track, trackrating);
		var tlinks = $('.current .track_links');
		add_lastfm_search(track, tlinks);
		add_history_search(track, tlinks);
		add_pleercom_search(track, tlinks);
		var item = $('#playlist .current');
		oldhat_class(track, item);
		fill_lastfm_tags(track, item);
		//redef_limits();

		
		$(client).off('addtrack.us trackupdate.us newcurrent.us');
		$(client).on('addtrack.us trackupdate.us newcurrent.us', function(event, data) {
			if (data.chid == client.channel.chid) {
				var track = data.track?data.track:data.t;
				var trackrating = $(".current").attr("trackid")==track.id?$(".current .curnum"):$("#"+track.id+" .rating div");
				makeEditable(track, trackrating);
				var tlinks = $(".current").attr("trackid")==track.id?$(".current .track_links"):$("#"+track.id+" .track_links");
				add_lastfm_search(track, tlinks);
				add_history_search(track, tlinks);
				add_pleercom_search(track, tlinks);
				if (event.type != 'trackupdate') {
					if ($('.current').attr('trackid') == track.id) {
						var item = $('#playlist .current');
						item.removeClass('oldhatp oldhatn oldhatm oldhat');
						item.attr('title', '');
					} else {
						var item = $('.trackid'+track.id);
					}
					oldhat_class(track, item);
					var item = $(".current").attr("trackid") == track.id ? $("#playlist .current") : $("#" + track.id);
					fill_lastfm_tags(track, item);
				}
				//redef_limits();
			}
		});
		
		$('#content li.item').waitUntilExists(function(){
			var track = {a:$(this).find(".artist").text().trim(), t:$(this).find(".title").text().trim()};
			var tlinks = $(this).find(".track_links, .tags");
			add_lastfm_search(track, tlinks);
			add_history_search(track, tlinks);
			add_pleercom_search(track, tlinks);
		});
		
		$('.uploaditem').waitUntilExists(function(){
			//redef_limits();
			var that = $(this);
			var trackinfo = function() {
				if (that.find('.artist').val() && that.find('.title').val()) {
					track = {};
					track.a = that.find('.artist').val();
					track.t = that.find('.title').val();
					oldhat_class(track, that);
					clearInterval(changewait);
				}
			};
			var changewait = setInterval(trackinfo, 1000);
			
			$(this).find('span:last').after("<div title='Копировать описание трека и его теги в другие треки' class='button copy'><a href='javascript:void(0);'>Копировать</a></div>");
			$(this).on('click', '.copy', function() {
				var et = [];
				var tinfo = that.find('textarea').val();
				$('.uploaditem .trackinfo').each(function() {
					$(this).val(tinfo);
				});
				var ttags = that.find('.tag');
				$('.uploaditem .taginput').each(function(i,taginput) {
					if (that.find('.taginput').is(taginput)) {
						return true;
					}
					$(ttags).each(function(i,tag) {
						et.push([[taginput],[tag]]);
					});
				});
				var entertags = function() {
					if (et.length) {
						var item = et.shift();
						$(item[0]).val($(item[1]).text());
						$(item[0]).trigger(jQuery.Event('keyup', {keyCode: 13, which: 13}));
					} else {
						clearInterval(proceedet);
					}
				};
				var proceedet = setInterval(entertags, 200);
			});
		});

		
		$("<style type='text/css'>.oldhatm{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAACVBMVEX////rAADrAACnZX1dAAAAAnRSTlMAjwuUU4kAAAAnSURBVHjaZcihAQAACMAg3f9H24XIfEtERERERERERERERERERER0cVsBIj9ClOcAAAAASUVORK5CYII=) !important; background-repeat: no-repeat !important; background-position: right bottom !important;}.oldhatp{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAACVBMVEX////rpADrpADoqT3mAAAAAnRSTlMAjwuUU4kAAAAnSURBVHjaZcihAQAACMAg3f9H24XIfEtERERERERERERERERERER0cVsBIj9ClOcAAAAASUVORK5CYII=) !important; background-repeat: no-repeat !important; background-position: right bottom !important;}.oldhatn{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAjwuUU4kAAAAnSURBVHjaZcihAQAACMAg3f9H24XIfEtERERERERERERERERERER0cVsBIj9ClOcAAAAASUVORK5CYII=) !important; background-repeat: no-repeat !important; background-position: right bottom !important;}.oldhat{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAD1BMVEX///+hoaGioqKhoaGioqIiyoGQAAAAA3RSTlMAj487at7rAAAASElEQVR4AWXLUQrEQAgE0XGr7n/mBYlh7DR+Fc+Tq08wA6aAEEC8ACGELQSWAPEW6+snSm8Ecpd6gdIvOEboAM5hC5s/O0XsD7LPAc49K4IRAAAAAElFTkSuQmCC) !important; background-repeat: no-repeat !important; background-position: right bottom !important;}</style><link rel='stylesheet' href='https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.min.css'/>").appendTo("head");
	}

	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//
	
	
	function redef_limits() {
		var delim = $('<li class="delim" style="padding-top: 1px; background-color: rgb(255, 174, 0);" />')
		$("#playlist .list .delim") && $("#playlist .list .delim").remove();
		if (client.chat) {
			if (client.channel.pls.length < 9 || client.chat.u.length < 11) {
				$(".advice").text('Самое время нести, лимита нет!')
				$("#playlist .list .advice").after(delim);
				$("#console .userinfo #limits:eq(1)") && $("#console .userinfo #limits:eq(1)").remove();
				$("#console .userinfo #limits").after('<div id="limits">Сейчас нет лимитов!</div>');
			} else {
				$(".advice").text('Самое время нести!')
				$("#playlist .list .item:eq(8)").after(delim);
				$("#console .userinfo #limits:eq(1)") && $("#console .userinfo #limits:eq(1)").remove();
			}
		}
	}
	

//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//
	
	
	function makeEditable(track, el) {
		if (!client.user) {
			return false;
		}
		var onblur = function() {
			var r = parseInt(el.text());
			if (track.r != r) {
				if (+el.text() === r) {
					if (client.user.prch == client.channel.chid || client.user.opch == client.channel.chid) {
						client.addvote({'id': track.id, 'v': r});
					} else {
						if (r <= client.user.w && r >= -client.user.w) {
							client.addvote({'id': track.id, 'v': r});
						} else {
							var elcolor = el.css('color');
							el.css('color', '#ff0000');
							el.effect('pulsate', 1000,  function() {
								el.text(track.r);
								el.css('color', elcolor);
							});
						}
					}
				} else {
					var elcolor = el.css('color');
					el.css('color', '#ff0000');
					el.effect('pulsate', 1000,  function() {
						el.text(track.r);
						el.css('color', elcolor);
					});
				}
			}
		};
		el.attr('contentEditable', true);
		el.off();
		el.on('blur', onblur);
		el.on("click", function(event){
			event.stopPropagation();
			document.execCommand("selectAll",false,null);
		});
		el.on("keydown", function(event) {
			if (event.keyCode === 10 || event.keyCode === 13) {
				event.preventDefault(event);
				el.blur();
			}
		});
	}
	
	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function add_lastfm_search(track, tlinks) {
		var lfmspan = $('<span id="lfm"><a href="http://www.last.fm/ru/music/' + encodeURIComponent(track.a) + '" target="_blank">>last.fm</a></span>');
		tlinks.find("span#lfm") && tlinks.find("span#lfm").remove();
		lfmspan.insertBefore(tlinks.find('span:last'));

	}
	
	
	function add_history_search(track, tlinks) {
		var hsspan = $('<span id="hs"><a href="javascript:void(0);">>в истории</a></span>');
		tlinks.find("span#hs") && tlinks.find("span#hs").remove();
		hsspan.insertBefore(tlinks.find('span:last'));
		hsspan.on('click', function(event) {
			event.stopPropagation();
			$('.tabs .tab.history').click();
			$('#hpanel input.artist').val($("<div/>").html(track.a).text()); // hope that playlist is secure enough ;)
			$('#hpanel input.title').val($("<div/>").html(track.t).text());
			var enter = jQuery.Event('keyup');
			enter.which = 13;
			$('#hpanel input.title').trigger(enter);
		});

}


	function add_pleercom_search(track, tlinks) {
		var pleercomspan = $('<span id="pleercom"><a href="http://pleer.com/search?q=' + encodeURIComponent(track.a) + ' - ' + encodeURIComponent(track.t) + '" target="_blank">>pleer.com</a></span>');
		tlinks.find("span:eq(1)") && tlinks.find("span:eq(1)").remove();
		pleercomspan.insertAfter(tlinks.find('span:eq(0)'));

	}


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//

	
	function nowplaying(track) {
		var lfmses = $.Storage.get('lastfm_session');
		if (player.playing) {
			var sig=hex_md5('api_key'+lfmkey+'artist'+track.a+'duration'+track.tt+'methodtrack.updateNowPlayingsk'+lfmses+'track'+track.t+lfmsecret);
			var query = 'method=track.updateNowPlaying'+'&artist='+encodeURIComponent(track.a)+'&track='+encodeURIComponent(track.t)+'&duration='+track.tt+'&api_key='+lfmkey+'&sk='+lfmses+'&api_sig='+sig+'&format=json';
			$.post(lfmurl, query).fail(function(data){
				lfmmsg = 'Now playing error: '+data.responseJSON.message;
			});
		}
	}
	
	
	function scrobbling(track) {
		var lfmses = $.Storage.get('lastfm_session');
		var ts = moment().unix();
		var passed = 1;
		$('#playlist .current .timer').append('<div class="scrobblepoint" style="position: relative; width: 2px; background: #fff; height: 100%; top: -3px; left: 100%;" />');
		scrobbler = setInterval(function() {
			if (30 < track.tt) {
				if (240 < track.tt/2) {
					var sp = (240 + client.channel.ct - passed) / client.channel.current.tt * $("#playlist .current .timer").width();
				} else {
					sp = (track.tt / 2 + client.channel.ct - passed) / client.channel.current.tt * $("#playlist .current .timer").width();
				}
				$(".scrobblepoint").css("left", sp);
			}
			if (track.tt > 30 && (passed > (track.tt/2) || passed > 240) && player.playing) {
				var own = client.user.id === track.sid ? 1 : 0;
				var sig=hex_md5('api_key'+lfmkey+'artist'+track.a+'chosenByUser'+own+'duration'+track.tt+'methodtrack.scrobblesk'+lfmses+'timestamp'+ts+'track'+track.t+lfmsecret);
				var query = 'method=track.scrobble'+'&artist='+encodeURIComponent(track.a)+'&track='+encodeURIComponent(track.t)+'&duration='+track.tt+'&chosenByUser='+own+'&timestamp='+ts+'&api_key='+lfmkey+'&sk='+lfmses+'&api_sig='+sig+'&format=json';
				$.post(lfmurl, query).fail(function(data) {
					lfmmsg = 'Scrobble error: '+data.responseJSON.message;
					$('.scrobblepoint').css('background', '#FF7474');
				})
				.done(function() {
					$('.scrobblepoint').css('background', '#74FF99');
				});
				clearInterval(scrobbler);
			} else if (player.playing) {
				passed += 1;
			}
		}, 1000);
	}
	
	
	function lastfm_scrobbling() {
		var sc = $.Storage.get('scrobble');
		var lfmses = $.Storage.get('lastfm_session');
		var lfmtoken = window.location.search.substring(1).split('token=')[1];
		if (sc == 'true' && lfmses) {
			scrobble = true;
			lfmmsg = 'Скробблим от имени <a target="_blank" href="http://last.fm/ru/user/'+$.Storage.get('lastfm_user')+'">'+$.Storage.get('lastfm_user')+'</a>. В любой непонятной ситуации сними галочку и поставь её снова.';
		} else if (sc == 'true' && !lfmses && lfmtoken) {
			window.history.replaceState({}, null, "/");
			var sig=hex_md5('api_key'+lfmkey+'methodauth.getSessiontoken'+lfmtoken+lfmsecret);
			var query = lfmurl+'?method=auth.getSession&token='+lfmtoken+'&api_key='+lfmkey+'&api_sig='+sig+'&format=json';
			$.get(query, function(data) {
				$.Storage.set('lastfm_session', data.session.key);
				$.Storage.set('lastfm_user', data.session.name);
				lastfm_scrobbling();
			})
			.fail(function(data) {
				lfmmsg = data.responseJSON.message;
				scrobble = false;
				$.Storage.set('scrobble', 'false');
			});
		}
		else {
			scrobble = false;
			$.Storage.set('scrobble', 'false');
		}
		$('.content.profile').off('click', '.options');
		$('.content.profile').on('click', '.options', function() {
			$('<div class="option"><label><input type="checkbox" name="scrobble" id="scrobble">Скробблить на LastFM</label></div>').prependTo('#info .content.profile .list');
			$('#scrobble').attr('checked', scrobble);
			lfmmsg && $('<div style="color: #eba400; font-size: x-small;">' + lfmmsg + "</div>").appendTo($("#scrobble").parents("div.option"));

			$('#scrobble').on ('click', function() {
				sc = $(this).is(':checked');
				if (sc) {
					$.Storage.set('scrobble', 'true');
					window.location.replace("http://www.last.fm/api/auth/?api_key="+lfmkey+"&cb=http://"+window.location.hostname);
				} else {
					$('.scrobblepoint').remove();
					$.Storage.remove("lastfm_session");
					$.Storage.set('scrobble', 'false');
					scrobble = false;
					clearInterval(scrobbler);
					$(client).off('newcurrent.lastfm');
					$(".controlpanel").off("click.lastfm");
					if (lfmmsg) {
						$('#scrobble').parents('div.option').find('div').html('');
						lfmmsg = '';
					}
				}
			});
		});
		if (scrobble) {
			clearInterval(scrobbler);
			nowplaying(client.channel.current);
			scrobbling(client.channel.current);
			
			$(client).off('newcurrent.lastfm');
			$(client).on('newcurrent.lastfm', function(event, data) {
				if (data.chid == client.channel.chid) {
					var track = data.track;
					clearInterval(scrobbler);
					nowplaying(track);
					scrobbling(track);
				}
			});
		}

	}

	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//
	
	
	function users_tracks() {
		var utdict = {};
		$(client.channel.pls).each(function(i,track) {
			track.s in utdict || (utdict[track.s] = []);
			utdict[track.s].push(track.id);
		});
		mass_rate(utdict);
		$(client).off('newcurrent.mr removetrack.mr');
		$(client).on('newcurrent.mr removetrack.mr', function(event, data) {
			if (data.chid == client.channel.chid && data.track.s in utdict) {
				var index = utdict[data.track.s].indexOf(data.track.id);
				-1 != index && utdict[data.track.s].splice(index, 1);
				0 === utdict[data.track.s].length && delete utdict[data.track.s];
				mass_rate(utdict);
			}
		});
		$(client).off('addtrack.mr');
		$(client).on('addtrack.mr', function(event, data) {
			data.track.s in utdict || (utdict[data.track.s] = []);
			utdict[data.track.s].push(data.track.id);
			mass_rate(utdict);
		});
	}
	
	
	function mass_rate(utdict) {
		if ($('.mass select').length) {
			$('.mass select').html('<option selected="selected" disabled="disabled">Кого?</option>');
			$.each(utdict, function(user,tracks) {
				$('.mass select').append($('<option />').html(user));
			});
		} else {
			$('<div style="padding-left: 14px;" class="mass" title="Сначала выбрать кому, потом сколько" />').appendTo('#console');
			$('<p style="font-size: 8pt; margin-bottom: 2px;">Массовое изменение рейтинга</p>').appendTo('#console .mass');
			$('<span style="padding-right: 10px;"><select><option selected="selected" disabled="disabled">Кого?</option></select></span>').appendTo('#console .mass');
			$('<span><input style="width: 40px;" type="number" value="0" />').appendTo('#console .mass');
			$.each(utdict, function(user,tracks) {
				$('.mass select').append($('<option />').html(user));
			});
			$('.mass input').attr({'min': -client.user.w, 'max': client.user.w});
		}
		$(".mass select").off();
		$(".mass select").on("change", function(){
			var user = $('.mass select').val();
			var rating = $('.mass input').val();
			if (user) {
				$.each(utdict[user], function(i,track) {
					client.addvote({'id': track, 'v': parseInt(rating)});
				});
			mass_rate(utdict);
			}
		});
	}
	
	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//
	
	
	function ctrlenter_send() {
		var bindsend = function() {
			if (ctrlenter) {
				$('#messageinput').off('keyup');
				$('#messageinput').on("keydown", function(event) {
					10 !== event.keyCode && 13 !== event.keyCode || !event.ctrlKey ? 10 !== event.keyCode && 13 !== event.keyCode || event.ctrlKey || event.preventDefault(event) : submitMessage();
				});
			} else {
				$('#messageinput').off('keydown');
				$('#messageinput').on("keyup", function(event) {
					13 == event.keyCode && submitMessage();
				});
			}
		};
		if (!$(".chat #markups #chatctrlenter").length) {
			var ce = $.Storage.get('ctrlenter');
			$(".chat #markups label:last").after('<label title="Отправка сообщений нажатием Ctrl-Enter"><input type="checkbox" name="ctrlenter" id="chatctrlenter">Ctrl-Enter</label>');
			if (ce == 'true') {
				$(".chat #markups #chatctrlenter").attr('checked', 'checked');
				ctrlenter = true;
				bindsend();
			}
			$('.chat #markups').on('click', '#chatctrlenter', function() {
				ctrlenter = $(this).is(':checked');
				$.Storage.set('ctrlenter', ctrlenter.toString());
				bindsend();
			});
		}
	}
	
	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//

	
	function oldhat_class(track, item) {
		var get_oc = function()  {
			var query = {shift:0,artist:track.a.trim(),title:track.t.trim(),gold:false,top:false,votes:false};
			client.getHistory(query, function(data) {
				if (client.user) {
					tracks: for (var tr in data) {
						if (data[tr].sid == client.user.id) {
							item.addClass('oldhatm');
							break tracks;
						}
					}
					if (!item.hasClass('oldhatm')) {
						tracks: for (var tr in data) {
							for (var vr in data[tr].p) {
								if (data[tr].p[vr].vid == client.user.id) {
									item.addClass('oldhatp');
									break tracks;
								}
							}
						}
						if (!item.hasClass('oldhatp')) {
							tracks: for (var tr in data) {
								for (var vr in data[tr].n) {
									if (data[tr].n[vr].vid == client.user.id) {
										item.addClass('oldhatn');
										break tracks;
									}
								}
							}
						}
					}
				}

				item.hasClass("oldhatp") || item.hasClass("oldhatn") || item.hasClass("oldhatm") || item.addClass("oldhat");
				if (item.hasClass('my')) {
					item.removeClass('my');
					if ($.Storage.get('style') == 'nigth') {
						item.css('background-color', '#555');
					} else {
						item.css('background-color', '#f2f2f2');
					}

				}
				item.attr('title', data[0].s+': '+moment(data[0].tt).from()+' (всего '+data.length+')');
			});
			setTimeout(function() {
				oc_queue.busy = false;
				oldhat_class();
			}, 1000);
		};
		
		if (oc_queue.busy) {
			oc_queue.q.push([track, item]);
		} else if (oc_queue.q.length) {
			var temp = oc_queue.q.shift();
			track = temp[0], item = temp[1];
			oc_queue.busy = true;
			get_oc();
		} else if (track && item) {
			oc_queue.busy = true;
			get_oc();
		}
	}

	
//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function fill_lastfm_tags(track, item) {
		var lfmses = $.Storage.get('lastfm_session');
		var query = 'method=artist.getTopTags'+'&artist='+encodeURIComponent(track.a)+'&autocorrect=1'+'&api_key='+lfmkey+'&format=json';
		$.get(lfmurl, query, function(data) {
			if (data.toptags) {
				var tags = data.toptags.tag.slice(0,3), atags = $('<div />');
				if (tags.length) {
					$(tags).each(function(i,tag) {
						$('<div style="background-color: #9C8080;" class="tag" />').text(tag.name).appendTo(atags);
					});
					if (!item.find('.tags_list').length) {
						$('<div class="tags_list" />').prependTo(item.find('.tags'));
					}
					if (!item.find('.intag div').length) {
						$('<div style="background-color: #9C8080;" class="tag" />').text(tags[0].name).appendTo(item.find('.intag'));
					}
					if (track.tg.length < 2 && tags.length > 1) {
						$(item.find('.intag')).append('...');
					}
					atags.appendTo(item.find('.tags_list'));
				}
			}
		});
	}


//**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**////**//**//**//**//**//**//


	function time_travel() {
		if (!$('.history #hpanel #hd').length) {
			var dp_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEV0lEQVRYR72WbUhbVxjH/4IwfE1jYtM4HWu0abWDMt2Yk81B/bCBG8yYaKLdah0s4gaCDIQxCUMYWK0QbQRX7cQPiSYaFevbYMW50jm2ufppTMEPe2mSaozxPSpknHPxJvfmqi1Jcz7dPPd//s/vPOc85yYGvNHQ0OAPDjU3N8fwNeR3pHQh5sS4vr6e5mxra8NJAJHQCQLo9XoK0NXVdSJAJHQUYEEjZ8tuVnwMnU5HASwWCyqW+4R2AJHQXbE5YijAHyUy/8U3M2iir91FKC4ups/j4+MwSH4QBAhX99fP/+DVYRcD8Nv7Uv+F11+kib7ZeQ+FhYX0eXZ2Fl/GTwkChKtb+vU/vHZvlQH45V2xX3FFThO1xnzASfiFf0wQIFzd8oIDb0x7GICHV5P8L2WfE0z0vIJ//+lEwf1NBuDB2/H+NEXq88ol6Pt4eQVv/bTDAPyY/4Jfli6JKoDrXzfemfMxAPfzYjm3X7RIrv5+yAD09vb6c3Nzo5WX5pmfn0dVVVUAoEJXgd3d3ahAxMXFwWwxcwHI7be7EyWA+Dh6y3IqQAB2tncEKzA2NobWW630XdutNuTl5R1bKbPZjK5vu9j3Qvr4hPhQAK1Wh+3tbY6xxWLGzMwMFhcX2Tj5QF2+/AoODg5CIIhOr/+UExfSJyQkoL+fVwGtVoutrS12cmVlJRwOR0gSYpiTkyMIUFNTQ2Hz8/MxNzdH5wrpExMT0d/fz92C8vJybG0GAK59dI0CqNVqajQ4OMgaZmdn42CfWwFieKf7DlQqFTIyMmA0Go/VJyYlYmBgIBRgc2OTXXFTUxO0Oi0KCgpgMBgwMjISMLyUjf39fVa7uLSI2tpapKWlUWMCYzKZjtUnJSeFApSVlWPDu8EpueiMiHbGzZabmJgYZw0vKi9xAD77vBZLS0toaWlBUVEROjs70d3dfaw+WZQMq5VXgTJNGbxer+DpNrYbMTExwRoqlUrs+5gKWK1W9NztoaUnlVr3rKOvr4/Gjs5AsJ7ERCIRrDYrdws0Gg3WPcIA7R3tmJwMAFzIUsLn89EEN6pvwOkMPazBK5HL5bjb8x0bOiMWwWaz8QDUGng8HsEKdHR0YHJqkl1RVmYWC1D9STWcTqfgvKNgeno6RkdH4XK6aEgsFsM2yAMgp33NLQxw29SBqSnmnxFpq0xFJvb2mAqQIU87h9jYWM4BDu4a0paHh4dwPGZAUyRi2lWcm1BdqobbvUYFjxYeobHxqxNXRV5ev14FMo8/TKbbmJoOACvOE+A9ViaRpGBwiAdQqlLDveqmogUCYGg8FaCurg4lH6pCusfUacL09wGA8y8rsLcbBCCVYMgeAlCK1ZVVNin5YsnkslMhPGseeNdDD69EKgHpdzJcDhfnSytNlWLIPsTdAtJGK08CAKdmDkOQelYKu93OAyhR4YlrJQzbp596VpYK+zAPoKRE9fQOEVAO8wEi4PnMFkdtmPLMMyM44X80W2VRClph6gAAAABJRU5ErkJggg==';

			$.datepicker.regional.ru={closeText:"\u0417\u0430\u043a\u0440\u044b\u0442\u044c",prevText:"&#x3C;\u041f\u0440\u0435\u0434",nextText:"\u0421\u043b\u0435\u0434&#x3E;",currentText:"\u0421\u0435\u0433\u043e\u0434\u043d\u044f",monthNames:"\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c".split(" "),monthNamesShort:"\u042f\u043d\u0432 \u0424\u0435\u0432 \u041c\u0430\u0440 \u0410\u043f\u0440 \u041c\u0430\u0439 \u0418\u044e\u043d \u0418\u044e\u043b \u0410\u0432\u0433 \u0421\u0435\u043d \u041e\u043a\u0442 \u041d\u043e\u044f \u0414\u0435\u043a".split(" "),dayNames:"\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u043f\u044f\u0442\u043d\u0438\u0446\u0430 \u0441\u0443\u0431\u0431\u043e\u0442\u0430".split(" "),dayNamesShort:"\u0432\u0441\u043a \u043f\u043d\u0434 \u0432\u0442\u0440 \u0441\u0440\u0434 \u0447\u0442\u0432 \u043f\u0442\u043d \u0441\u0431\u0442".split(" "),dayNamesMin:"\u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "),weekHeader:"\u041d\u0435\u0434",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""};
			$.datepicker.setDefaults($.datepicker.regional.ru);

			$('.history #hpanel').append($('<input type="hidden" id="hd">'));
			$("#hd").datepicker({
				showOn: "button",
				buttonImage:dp_icon,
				buttonImageOnly: true,
				changeMonth: true,
				changeYear: true,
				maxDate: moment().toDate(),
				showButtonPanel: true,
				buttonText: "Вперёд, в прошлое!",
				onSelect: function(dt) {
					dt = moment(dt+'T00:00:00.000Z');
					var today = dt.isSame(new Date(), "day");
					today ? dt = '' : dt = dt.add(1, 'days').toISOString();
					showHistory(false, false, dt);
				}
			});


			$(".chat #markups").append('<a style="float: right;" href="javascript:void(0);" class="timetravel">Вперёд, в прошлое!</a><input type="hidden" id="timetravel"><div></div>');
			$("input#timetravel").datepicker({
				changeMonth: true,
				changeYear: true,
				showButtonPanel: true,
				maxDate: moment().toDate(),
				onSelect: function(dt) {
					dt = moment(dt+'T00:00:00.000Z').toISOString();
					var today = moment(dt).isSame(new Date(), "day"), args = {};
					today ? args = {} : args.shift = dt;
					client.getChat(args, function(d) {
						messages = [];
						$('#chatmessages').html('');
						chatlogupdate = true;
						client.chat.m = d.m;
						for (var m in d.m) {
							var data = d.m[m];
							addMessage(data);
						}
						chatlogupdate = false;
						$('#messageinput').autofocus();
						if ($('#chatmessages').height() < $('.log').height()) {
							scrolltop();
						}
					});
				}
			});

			$("a.timetravel").click(function() {
				$("input#timetravel").datepicker("show");
			});
		}
		
		if (client.channel.chid == 1) {
			$("#hd").datepicker("option", "minDate", moment('2012-12-20').toDate());
			$("input#timetravel").datepicker("option", "minDate", moment('2013-06-10').toDate());
		} else if (client.channel.chid == 5) {
			$("#hd").datepicker("option", "minDate", moment('2014-02-13').toDate());
			$("input#timetravel").datepicker("option", "minDate", moment('2015-04-04').toDate());
		} else if (client.channel.chid == 2) {
			$("#hd").datepicker("option", "minDate", moment('2013-06-10').toDate());
			$("input#timetravel").datepicker("option", "minDate", moment('2013-06-10').toDate());
		}
		$("#hd").next().css({'width': '25px', 'position': 'relative', 'top': '8px', 'left': '5px', 'cursor': 'pointer'});
		$("input#hd").val('');
		$("input#timetravel").val('');
	}
	
});