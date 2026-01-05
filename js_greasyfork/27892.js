// ==UserScript==
// @name        DuckDuckGo to Google shortcut (and viceversa)
// @namespace   duckduckgo
// @version     1.1.1
// @description Search the same in Google with a shortcut and viceversa. Also in Youtube and Google Images
// @description Ctrl + Alt + G = Search the same terms in Google or DuckDuckGo
// @description Ctrl + Alt + I = Search in Google Images
// @description Ctrl + Alt + Y = Search in Youtube
// @include     https://duckduckgo.com/*
// @include     https://*.google.com*
// @include     /^https?://www\.youtube\.com/results\?search_query=*
// @include     https://www.google.tld/*

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27892/DuckDuckGo%20to%20Google%20shortcut%20%28and%20viceversa%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27892/DuckDuckGo%20to%20Google%20shortcut%20%28and%20viceversa%29.meta.js
// ==/UserScript==



(function() {
    document.addEventListener('keydown', function(e) {
        if (!e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
            switch(e.keyCode){
                case 71: //U
                    SearchTheSame();
                    break;
                case 73: //I
                    SearchTheSameInGoogleImages();
                    break;
                case 89: //Y
                    SearchTheSameInYouTube();
                    break;
                default:
                    break;
            }

        }
    },false);
    
    function SearchTheSame(){        
        var params = getJsonFromUrl(document.URL);
		var query = "";
		var currentHost = window.location.host;
		if(currentHost.indexOf('youtube')!==-1)
		   query = params.search_query;
		else
			query = params.q;
        if (query.length > 0){
            if(currentHost.indexOf('google')!==-1){
                //Search the same in duckduckgo
                newUrl = 'https://duckduckgo.com/?kp=-1&k1=-1&kao=-1&kak=-1&atb=v50-4&t=hf&ia=web&q=' + query;
            }
            else
                newUrl = 'https://encrypted.google.com/search?q=' + query;
            window.location = newUrl;
        }
    }
    
    
    function SearchTheSameInGoogleImages(){
        params = getJsonFromUrl(document.URL);
        if (params.q.length > 0){
            googleUrl = 'https://encrypted.google.com/search?safe=off&tbm=isch&q=' + params.q;
            window.location = googleUrl;
        }
    }

    function SearchTheSameInYouTube(){
        params = getJsonFromUrl(document.URL);
        if (params.q.length > 0){
            youtubeUrl = 'https://www.youtube.com/results?search_query=' + params.q;
            window.location = youtubeUrl;
        }
    }    
    
    
    //Thanks to:
    //http://stackoverflow.com/a/8486188/298641
    function getJsonFromUrl(hashBased) {
      var query;
      if(hashBased) {
        var pos = location.href.indexOf("?");
        if(pos==-1) return [];
        query = location.href.substr(pos+1);
      } else {
        query = location.search.substr(1);
      }
      var result = {};
      query.split("&").forEach(function(part) {
        if(!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq>-1 ? part.substr(0,eq) : part;
        var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
        var from = key.indexOf("[");
        if(from==-1) result[decodeURIComponent(key)] = val;
        else {
          var to = key.indexOf("]");
          var index = decodeURIComponent(key.substring(from+1,to));
          key = decodeURIComponent(key.substring(0,from));
          if(!result[key]) result[key] = [];
          if(!index) result[key].push(val);
          else result[key][index] = val;
        }
      });
      return result;
    }
    
    

   
    

})();
