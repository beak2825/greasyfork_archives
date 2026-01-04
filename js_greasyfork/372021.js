// ==UserScript==
// @name        DPlay Download Script (update 2018-09)
// @author      Daniele Giudice
// @namespace   http://danielegiudice.altervista.org
// @description This script allows you download videos on DPlay
// @include     http://*.dplay.com/*
// @include     https://*.dplay.com/*
// @version     5.2.6
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @connect     it.dplay.com
// @connect     dplayit.akamaized.net
// @connect     dplaysouth-vod.akamaized.net
// @connect     dplay-south-prod.disco-api.com
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/372021/DPlay%20Download%20Script%20%28update%202018-09%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372021/DPlay%20Download%20Script%20%28update%202018-09%29.meta.js
// ==/UserScript==

/*
    Script originale: https://greasyfork.org/it/scripts/11108-dplay-download-script/
    Aggiornato al nuovo layout DPlay da Pizzacoder (https://greasyfork.org/en/users/211168-pizza-coder)
*/
/*
	Thanks to Andrea Lazzarotto RSI Script
	Source: https://greasyfork.org/it/scripts/2131-rsi-direct-link/code
*/

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest){
	GM_xmlhttpRequest = GM.xmlHttpRequest;
}

var preset = function()
{
	$('.b-description-external-wrapper').prepend('<p id="save_box"><a>Salva</a></p>');
	$('.b-description-external-wrapper').prepend('<div id="download_box"></div>');

	$('#save_box').css({
		'width': '50%',
		'margin': '0 auto',
		'padding': '0.5em',
		'border': '1px solid #ccc',
		'background-color': '#FFFFFF',
		'box-sizing': 'border-box',
		'text-align': 'center',
	});

	$('#save_box a').css({
		'font-weight': 'bold',
		'font-size': '20px',
		'color': '#FF0000',
		'cursor': 'pointer',
	});

	$('#download_box').css({
		'position': 'fixed',
		'top': '30%',
		'left': '20%',
		'right': '20%',
		'background-color': '#FFFFFF',
		'color': '#000000',
		'padding': '20px 20px 20px 20px',
		'border': '2px solid #ccc',
		'box-shadow': '0px 20px 150px 0px rgba(0, 0, 0, .95)',
		'box-sizing': 'border-box',
		'font-size': '20px',
		'z-index': '9999',
	});

	$('#download_box').hide();
};

var fill_box = function(hls, hls_master)
{
    var html_box = '';

    if( hls_master.indexOf(',RESOLUTION=') == -1 )
    {
        html_box += '<p class="highlighted" style="text-align: center;">Download non disponibile!</p>';
        html_box += '<p class="dl_info">Per informazioni sul problema <a href="http://danielegiudice.altervista.org/scaricare-i-video-di-dplay-it/" target="_blank">andare qui</a>.</p>';
        html_box += '<p id="close_box"><a>Chiudi</a></p>';
        $('#download_box').append(html_box);
    }
    else
    {
        var renditions = [];

        hls_master.split(',RESOLUTION=').forEach(function(item, index){
            if(index>0 && (item.indexOf('#EXT-X-STREAM-INF:') > -1 || item.indexOf(',FRAME-RATE=') > -1)) renditions.push(item.split(',')[0]);
        });

        var ep_number = $('.dates').eq(0).text().replace('S.', 'S').replace('E.', 'E').split('-');
        var ep_title = location.pathname.substring(1, location.pathname.length-1).replace(/\-/g, '_').split('/');

        var title = $('h1').eq(0).html().split('<br>')[0] + ' - ';
        title += (ep_number.length>=2 ? ep_number[ep_number.length-2] : ep_number[0]) + ' - ';
        title += ep_title[ep_title.length-1];

        title = title.replace(/(\r\n|\n|\r)/gm, '').replace(/(^\s+|\s+$)/g, '').replace(/  +/g, ' ').replace(/ /g, "_").replace(/\"/g, '_').replace(/\'/g, '_').replace(/[.*+?^${}:()|[\]\\]/g, '');
        title += '_(<span id="quality_id""></span>)';

        html_box += '<div class="flex_row" style="padding-bottom: 20px;"><span>Qualit&agrave; video: <select id="renditions_select"></select></span></div>';
        html_box += '<div class="text_dl">Per scaricare il video, usare <span class="highlighted">ffmpeg</span> con la seguente riga di comando:</div>';
        html_box += '<p class="highlighted">ffmpeg -i "' + hls + '" -v warning -stats -c copy -map 0:<span id="video_id"></span> -map 0:<span id="audio_id""></span> "' + title + '.mp4"</p>';
        html_box += '<p class="flex_row dl_info"><a href="http://danielegiudice.altervista.org/scaricare-i-video-di-dplay-it/" target="_blank">Informazioni script</a>';
        html_box += '<a href="http://danielegiudice.altervista.org/guida-al-download-dei-flussi-di-rete/" target="_blank">Guida al download</a></p><p id="close_box"><a>Chiudi</a></p>';

        $('#download_box').append(html_box);

        for( var i=0 ; i<renditions.length ; i++ )
            $('#renditions_select').append('<option value="' + i + '">' + renditions[i] + '</option>');

        $('#renditions_select option:last-child').attr('selected','selected');
        $('#video_id').html((renditions.length-1)*2);
        $('#audio_id').html(((renditions.length-1)*2)+1);
        $('#quality_id').html(renditions[renditions.length-1]);

        $('.flex_row').css({
            'display': '-webkit-flex',
            'display': 'flex',
            '-webkit-flex-direction': 'row',
            'flex-direction': 'row',
            '-webkit-flex-wrap': 'nowrap',
            'flex-wrap': 'nowrap',
            '-webkit-align-items': 'center',
            'align-items': 'center',
            '-webkit-justify-content': 'space-around',
            'justify-content': 'space-around',
        });

        $('#renditions_select').css({
            'width': 'auto',
            'font-size': '16px',
        });

        $('#renditions_select').change(function(){
            $('#video_id').html($('#renditions_select option:selected').val()*2);
            $('#audio_id').html(($('#renditions_select option:selected').val()*2)+1);
            $('#quality_id').html(renditions[$('#renditions_select option:selected').val()]);
        });
    }

    $('.text_dl').css({
        'font-size': '16px',
        'padding-bottom': '10px',
    });

    $('.highlighted').css({
        'white-space': 'normal',
        'word-break': 'break-word',
        'margin': '.60em 0',
        'padding': '.60em',
        'border-radius': '15px',
        'font-weight': 'bold',
        'font-size': '18px',
        'background-color': '#A1DBB2',
        'color': '#9759BA',
    });

    $('.dl_info a').css({
        'font-size': '20px',
        'font-weight': 'bold',
        'color': '#74bfc1',
        'text-decoration': 'underline',
    });

	$('#close_box').css({
		'text-align': 'center',
	});

	$('#close_box a').css({
		'color': '#FF0000',
		'font-weight': 'bold',
		'font-size': '22px',
		'cursor': 'pointer',
        'text-decoration': 'underline',
	});

	$('#close_box a').click(function(){
		$('#download_box').hide();
	});
};

$(document).ready(function()
{
    if( !$('.dplayer').length ){
        return;
	}

    preset();

    $('#save_box a').click(function()
    {
        if( !$.trim($('#download_box').html()) )
        {
            var hls = 'https://' + unsafeWindow.location.hostname + unsafeWindow.config.playback_json_url;

			GM_xmlhttpRequest({
                method: 'GET',
                url: hls,
                onload: function(response_playback)
                {
					var response_s = JSON.parse(response_playback.response);
					var playback_json = JSON.parse(response_s);

					var url = playback_json.data.attributes.streaming.hls.url;

					GM_xmlhttpRequest({
						method: 'GET',
						url: url,
						onload: function(response)
						{
							var response_s = response.response;
							fill_box(url, response_s);
							$('#download_box').show();
						}
					});
                }
            });
        }
        else
            $('#download_box').show();
    });
});