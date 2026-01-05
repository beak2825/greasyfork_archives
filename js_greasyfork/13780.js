// ==UserScript==
// @name        Spotify Web Player over HTML5
// @namespace   https://greasyfork.org/users/4813-swyter
// @description Use play.spotify.com without having to install Flash Player.
// @match       https://play.spotify.com/*
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/13780/Spotify%20Web%20Player%20over%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/13780/Spotify%20Web%20Player%20over%20HTML5.meta.js
// ==/UserScript==


function when_external_loaded()
{
  console.log("Started KissAnime Anti-Adblock Blocker, waiting for the DOM to load...");

  /* SWFobject.js faker, sneaky! */
  Object.defineProperty(navigator, 'plugins',
  {
    configurable: false, enumerable: true, get: function()
    {
      return {"Shockwave Flash": {"description": "Shocking Poop 11.2 r202"} };
    }
  });

  Object.defineProperty(navigator, 'mimeTypes',
  {
    configurable: false, enumerable: true, get: function()
    {
      return {"application/x-shockwave-flash": {"enabledPlugin": true} };
    }
  });

  console.log("tests plug", navigator.plugins,
              typeof navigator.plugins !== 'undefined',
              typeof navigator.plugins["Shockwave Flash"] === 'object',
              navigator.plugins["Shockwave Flash"].description); // Shockwave Flash 11.2 r202
  
  console.log("tests mime", navigator.mimeTypes,
              typeof navigator.mimeTypes !== 'undefined',
              !! navigator.mimeTypes["application/x-shockwave-flash"],
              !! navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin);


  document.addEventListener('DOMContentLoaded', function()
  {
    //swfobject.embedSWF = {};

  console.log("Started WebSockets shim");

  WebSocket.prototype.sond = WebSocket.prototype.send;
  WebSocket.prototype.send = function(msg)
  {
    if (this.onmessage && this.sucks !== true)
    {
      callback = this.onmessage;
      
      console.log("orig prev callback:", callback);

      this.onmessage = function(message)
      {
        console.info("<- ws recv: ", message.data);
        callback(message);
      }
      
      this.sucks = true;
    }
    
    //json_msg = JSON.parse(msg);
    
    
    //if (json_msg && json_msg.name == 'sp/track_uri')
      //arguments[0] = msg.replace(',"rtmp"', ',""');
    
    //dec_msg = json_msg.name === 'sp/hm_b64' ? atob(json_msg.args[0]) : null;
    
    console.info("-> ws send: ", msg); //json_msg, dec_msg);
    
    //if (json_msg.name !== 'sp/log')
     return WebSocket.prototype.sond.apply(this, arguments);
  }
  
    hh = swfobject.embedSWF;
    window.swfobject.embedSWF = function()
    {
      console.log('embedSWF =>', arguments, hh.apply(this, arguments));
    };
    
    console.log('swfobject hasFlashPlayerVersion test',
      swfobject.hasFlashPlayerVersion('11.0.0')
    );

    var d = {SWFContainerId:'bridge', SWFFlashId: 'SPFBIn_1515_player', instanceId:'1515', SWFUrl: 'https://play.spotify.edgekey.net/client/19b6d34/flash/player.swf', logging: true};
    var c = function(a){ console.log('callback', arguments[0]) };
    
    console.log('swfobject embedSWF test',
      swfobject.embedSWF(d.SWFUrl, d.SWFContainerId, '1', '1', '11.0.0', '',
      {
        playerType: d.playerType || '',
        valid: 0,
        id: d.SWFFlashId || '',
        length: 0,
        instanceId: d.instanceId,
        logging: d.logging
      },
      {
       quality: 'high',
       allowscriptaccess: 'always',
       wmode: 'window',
       bgcolor: '#2c2c2d'
      },
      {
       id: d.SWFFlashId,
       name: d.SWFFlashId,
       align: 'middle'
      }, c)
    );
    
    //--
    
  }); 
                            
}

/* inject this cleaning function right in the page to avoid silly sandbox-related greasemonkey limitations */
window.document.head.appendChild(
  inject_fn = document.createElement("script")
);

inject_fn.innerHTML = '(' + when_external_loaded.toString() + ')()';


// --


