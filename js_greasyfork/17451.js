// ==UserScript==
// @name        FADIVVVV - vvvvid.it Anti Flash
// @namespace   https://github.com/Robotex/
// @description Guardati i tuoi anime preferiti senza avere Adobe Flash Player!
// @author      Robotex
// @version     1.0.6
// @license     GPL version 3; http://www.gnu.org/copyleft/gpl.html
// @copyright   2016+, Robotex (https://github.com/Robotex/)
// @homepage    https://github.com/Robotex/FADIVVVV/
// @supportURL  https://github.com/Robotex/FADIVVVV/issues
// @match       http://www.vvvvid.it/*
// @match       https://www.vvvvid.it/*
// @grant       GM_xmlhttpRequest
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.5.20/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/17451/FADIVVVV%20-%20vvvvidit%20Anti%20Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/17451/FADIVVVV%20-%20vvvvidit%20Anti%20Flash.meta.js
// ==/UserScript==

window.addEventListener ("message", function (event) {
    if ( event.data !== "_applySrcEvent" )
        return; //-- Message is not for us.

    refreshVideo($("#vvvvid_player_media_html")[0]);
}, false);

function main () {
    jQuery(function($) {

        $p.newModel({

            modelId: 'VIDEOHLSJS',
            iLove: [
                {ext:'m3u8', type:'application/mpegURL', platform: 'browser', streamType: ['http','httpVideo'], fixed: true},
                {ext:'m3u8', type:'application/vnd.apple.mpegurl', platform: 'browser', streamType: ['http','httpVideo'], fixed: 'maybe'},
                {ext:'m3u8', type:'application/x-mpegURL', platform: 'browser', streamType: ['http','httpVideo'], fixed: true}
            ],
            
            _applySrcHook : $p.models['VVVVID_HTML5'].prototype._applySrc,
            _applySrc : function() {
                this._applySrcHook.apply(this, arguments);
                window.postMessage ("_applySrcEvent", "*");
            }

        }, 'VVVVID_HTML5');

    });
    
    vvvvid.browserDetect.supportHLS = function () {
      return true;
    };
    vvvvid.models.User.prototype.defaults.hls = vvvvid.browserDetect.supportHLS();
    vvvvid.models.login.prototype.defaults.hls = vvvvid.browserDetect.supportHLS();
}

function refreshVideo(mediaElement)
{
    if(Hls.isSupported()) {
        var fadivvvvHlsConfig = Hls.DefaultConfig;
        fadivvvvHlsConfig.loader.prototype.loadInternal = function () {
            this.stats.tfirst = null;
            this.stats.loaded = 0;
            this.timeoutHandle = window.setTimeout(this.loadtimeout.bind(this), this.timeout);
            var extraheaders = {};
            if (this.byteRange) {
                extraheaders["Range"] = "bytes=" + this.byteRange;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: this.url,
                headers: extraheaders,
                responseType: this.responseType,
                onload: this.loadend.bind(this),
                onprogress: this.loadprogress.bind(this)
            });
        };
        var loadendHook = fadivvvvHlsConfig.loader.prototype.loadend;
        fadivvvvHlsConfig.loader.prototype.loadend = function () {
            arguments[0].responseURL = arguments[0].finalUrl;
            var getResponseHeader = function (header) {
                return this.responseHeaders[header];
            };
            arguments[0].getResponseHeader = getResponseHeader.bind(arguments[0]);
            arguments[0].currentTarget = arguments[0];
            return loadendHook.apply(this, arguments);
        };
        var hls = new Hls(fadivvvvHlsConfig);
        hls.loadSource(mediaElement.src);
        hls.attachMedia(mediaElement);
    }
}

// The node to be monitored
var target = $( "#main-content" ).get(0);
// Create an observer instance
var observer = new MutationObserver(function( mutations ) {
  mutations.forEach(function( mutation ) {
    var newNodes = mutation.addedNodes; // DOM NodeList
    if( newNodes !== null ) { // If there are new nodes added
    	var $nodes = $( newNodes ); // jQuery set
    	$nodes.each(function() {
    		var $node = $( this );
    		if( $node.attr('id') ==  "vvvvid_player_media_html" ) {
    			if(Hls.isSupported()) {
                    refreshVideo($node[0]);
                }
                observer.disconnect();
    		}
    	});
    }
  });    
});

// Configuration of the observer:
var config = {
	childList: true, 
    subtree: true
};
 
// Pass in the target node, as well as the observer options
observer.observe(target, config);

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
