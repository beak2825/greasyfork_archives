// ==UserScript==
// @name        Twitter video links
// @namespace   twitter
// @description Показывает прямые ссылки на видео в твиттере. Direct twitter video links showing in the bottom of the player.
// @include     https://twitter.com/i/videos/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25329/Twitter%20video%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/25329/Twitter%20video%20links.meta.js
// ==/UserScript==
$(document).on("dataPlayerReadyEvent", function(){
	Number.prototype.dd = function(){ return (this<10)? '0'+this : this.toString(); }
	var vmap_url = ($pt=$("#playerContainer")).length == 1? ( $pt.data("config").vmap_url || '' ) : '',
		a_attrs = 'target="_blank" style="text-decoration: underline; color: #37f;"',
		$vspan = $('<span>').css({ 'position': "fixed", 'bottom': "0px", 'right': "0px", 
				'background-color': "#fff", 'padding': "0px 5px 2px", 'margin': "2px", }),
		st = $pt.data("config").source_type, ct = $pt.data("config").content_type, fl = Math.floor,
		sd = (dr=$pt.data("config").duration)?
				' ('+[(h=fl((d=fl(dr/1000))/3600)), (m=fl((d-h*3600)/60)).dd(), (d-h*3600-m*60).dd()].join(':')+')'
				: '';
	if(vmap_url !== '' || $.inArray(st, ['consumer', 'snap-reel', 'gif']) > -1 ){
		if( $.inArray(ct, ['video/mp4', 'application/x-mpegURL'] ) > -1 
				&& typeof (vu = $pt.data("config").video_url) !== 'undefined' ){
			$vspan.append('<a '+a_attrs+' href="'+vu+'" title="'+ct+sd+'">Main video</a>&nbsp;');
		}
		if( vmap_url !== '' ){
			var dlm = ($vspan.text() == '')? '' : '|&nbsp;';
			$vspan.append(dlm+'<a '+a_attrs+' href="'+vmap_url+'">vmap.xml</a>&nbsp;')
				.append('<span id="progress">&#9200;</span>');
			$.get( vmap_url, function( vdata ) {
				$("#progress").remove();
				var mv_url = ($mf=$(vdata).find("MediaFile")).length == 1? $mf.text().replace(/[\s\n\r\t]/gm, '') : '';
				if( mv_url !== '' ){
					ct = $mf.attr("type");
					$vspan.append('|&nbsp;<a '+a_attrs+' href="'+mv_url+'" title="'+ct+sd+'">Main video</a>&nbsp;');
				}
				var yt_url = ($wn=$(vdata).find("tw\\:cta_watch_now, cta_watch_now")).length == 1? $wn.attr("url") : '';
				if( yt_url !== '' ){
					$vspan.append('|&nbsp;<a '+a_attrs+' href="'+yt_url+'">YouTube</a>&nbsp;');
				}
				$(vdata).find("tw\\:videoVariant, videoVariant").each(function(vidx, vidvar){
					if( (ct=$(vidvar).attr("content_type")) == 'video/mp4' ){
						var vcap = (mtch = $(vidvar).attr("url").match(/vid\/(\d+x\d+)\//)).length > 1 ? 
								mtch[1] : $(vidvar).attr("bit_rate")+'&nbsp;bps';
						$vspan.append('|&nbsp;<a '+a_attrs+' href="'+$(vidvar).attr("url")+'" title="'+ct+'">'+vcap+'</a>&nbsp;');
					}
				});
			});
		}
		if($vspan.text() == ''){
			$vspan.append('<a '+a_attrs+' href="'+document.location.href+'">Can`t parse this frame</a>');
		}
		$(".error-msg-container").css('opacity', "0");
		$(document.body).append($vspan);
	}
});
