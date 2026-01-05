// ==UserScript==
// @name        LoadScript
// @namespace   brambles
// @version     1.2
// @grant       none
// ==/UserScript==
  var LoadScript = function LoadScript(urls, callback) {
    var _loadScript = arguments.callee;
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = 'true';
    script.className = 'loadscript';
    script.setAttribute('charset', 'utf-8');

    if (typeof urls === 'string') {
      var urls = [
        urls
      ];
    }
    if (!Array.isArray(urls)) {
      throw 'type error';
    }
    if (urls.length > 1) {
      script.onload = script.onerror = function () {
        script.onload = script.onerror = null;
        _loadScript(urls.slice(1), callback);
        
      };
    } 
    else {
      script.onload = script.onerror = function(){
          script.onload = script.onerror = null;
          callback();
      };
    }
    script.src = urls[0];
    head.insertBefore(script, head.firstChild);
  };