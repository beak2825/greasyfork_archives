// ==UserScript==
// @name        Grande Fratello direct links
// @namespace   http://andrealazzarotto.com
// @description Detect live streams of Grande Fratello
// @include     https://www.grandefratello.mediaset.it/diretta/*
// @include     http://www.grandefratello.mediaset.it/diretta/*
// @version     1.0.1
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     mediaset.it
// @connect     theplatform.eu
// @connect     akamaized.net
// @connect     mediaset.net
// @downloadURL https://update.greasyfork.org/scripts/395058/Grande%20Fratello%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/395058/Grande%20Fratello%20direct%20links.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

function boxStyle(selector, color, textcolor) {
	$(selector).css({
		'padding': '.5em',
		'margin': '1em 4em',
		'text-align': 'center',
		'background-color': color,
		'color': textcolor
	});
	$(selector + ' a').css('color', textcolor);
    $(selector + ' pre').css({
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
    });
    $(selector + ' *').css('font-size', '15px');
}

function writeLive(stream) {
    $('#stream-url').remove();
    console.log("LIVE");
	$('<div id="stream-url">').insertAfter($('#video-player'));
	$('#stream-url').append('<p>Flusso della diretta <strong>da aprire con VLC o <code>ffplay</code>:</strong></p>')
		.append('<pre><code><a href="' + stream + '">' + stream + '</a></code></pre>');
	boxStyle('#stream-url', 'rgba(255,255,255,0.5)', 'black');
}

function handleLive() {
    var code = $("li.selected a[href*=live]").attr("href").split("=")[1] || 0;
    if (!code) {
        return;
    }

    var baseURL = "https://static3.mediasetplay.mediaset.it/apigw/nownext/";
    fetch({
        method: 'GET',
        url: baseURL + code + '.json',
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(responseDetails) {
        var r = responseDetails.responseText;
        var data = $.parseJSON(r);
        console.log(data);
        var instruction = data.response.tuningInstruction;
        for (var i = 0; i < 5; i++) {
            var row = instruction['urn:theplatform:tv:location:any'][i];
            var public = row.publicUrls[0];
            var streaming = row.streamingUrl;
            if (row.format.indexOf('x-mpegURL') > 0) {
                return fetch({
                    method: 'GET',
                    url: public,
                    headers: {
                        'Accept': 'application/atom+xml,application/xml,text/xml'
                    }
                });
            }
        }
    }).then(function(responseDetails) {
        var src = responseDetails.finalUrl;
		writeLive(src);
    });
}

$(document).ready(function(){
    handleLive();
});