// ==UserScript==
// @name        HTML5 thingie for Spotify Web Player
// @description Play music on the browser without having to install Flash Player. Yes, I know why SWF bridges exist.
// @author      Swyter
// @namespace   https://greasyfork.org/users/4813-swyter
// @match       https://play.spotify.com/*
// @version     2016.01.30
// /* turns out we now need to run on frames too to make our flashless context menu copying mechanism work */ @noframes
// @icon        https://i.imgur.com/LHkCkka.png
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/14035/HTML5%20thingie%20for%20Spotify%20Web%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/14035/HTML5%20thingie%20for%20Spotify%20Web%20Player.meta.js
// ==/UserScript==

  /* it's random, trust me, I'm Sony! :) */
  Object.defineProperty(window.Math, 'random',
  {
    configurable: false,
    writable: false,
    value: function(a) { return 0.1337; }
  });

  /* ZeroClipboard.js HTML5 shim, no ridiculous SWF overlay required, sneaky! */
  Object.defineProperty(window, 'ZeroClipboard',
  {
    configurable: false,
    writable: false,
    value: function(e)
    {
      console.log("ZC constructor", arguments);

      e.addEventListener('click', function (x)
      {
        x.preventDefault();

        /* add a dummy input to our page, fill it with our text, select it,
           copy it, remove our dummy item; voila, typical js kludge! */
        input = document.createElement('input');
        input.value = this.dataset.clipboardText;

        document.body.appendChild(input);

        input.select(); document.execCommand('copy');

        document.body.removeChild(input);

        console.log("ZC -> click", this, this.dataset.clipboardText, input, input.value);
      });

      return {
        on: function(e, f)
        {
          console.log("ZC -> on", arguments, this, this.elem);
          this.elem.addEventListener(e, f);
        },

        elem: e
      };
    }
  });

  ZeroClipboard.config = function(){ console.log("ZC -> config", arguments) };


  /* SWFobject.js faker, sneaky! */
  Object.defineProperty(window, 'swfobject',
  {
    configurable: false,
    writable: false,
    value:
    {
      getFlashPlayerVersion: function(){ console.log("-<-< getFlashPlayerVersion =>", arguments); return { major: 11, minor: 2, release: 202 }; },
      hasFlashPlayerVersion: function(){ console.log("-<-< hasFlashPlayerVersion =>", arguments); return true; },
      embedSWF:              function(swf, parent_id, unk_a, unk_b, req_flash_ver, unk_c, properties)
      {
        console.log("-<-< embedSWF =>", arguments, arguments[9].toString(), this, properties);

        /* create our audio player in substitution of the swf abobination */
        var dummy = document.createElement("audio");

        dummy.id             = properties.id;
        dummy["instanceid"]  = properties.instanceId;

        dummy.loop           = false;
        dummy.preload        = 'auto';
        dummy.autoplay       = false;
        dummy.volume         = 1.0;

        dummy.sp_run         = function(proof) { console.log("-<-< sp_run =>", arguments); return unsafeWindow.proof; };
        dummy.sp_hasSound    = function()      { return true };
        dummy.sp_load        = function(player_id, raw_uri, options)
        {
          /* for some reason we have to massage the url format to remove the 'mp3:' protocol
             prefix from the uri, and the '/cfx/st' from the server string */
          // uri :                                          "mp3:/mp3/6b381db769d31beb544ba67eb7cbc3ce4fc8ab4c.mp3?Expires=1450045402&Signature=dgvyYa~K2P-v6ArrdVBmRxAF44JTJhpk6PJqQXzHbMOmtcHw~eY~E1C0GgviL~O63-EhejMzCB~dLjlgaug-TQej8mCjvroY8crd776GRsBx0AJz4pnp3ZH03T3PnUecBHRwMrg28pjAbi1xWmuybyNvwWpitB9Q~hiCKxMzUhnXRjqpWJKZVrLDY7~iXB2GlptZNz8RZoapexeEkNA2kgjnYXk4JTe4CNTdRSmn~Uf9YHvxJdA4ttlRfDt353eSxCDTXKQdA7GkEBTKJfDvN6NgXyw8~Tm8tBHk9VYYn7jZMLYckwqi3OJAonof2SZZlHZoepgympEYxK8BdkvZMg__&Key-Pair-Id=APKAJXKSII4ED2EOGZZA"
          // options.server: "http://dsu0uct5x2puz.cloudfront.net/cfx/st"

          var uri = options.server.match(/(.+\/\/[^\/]+?)\//)[1] + raw_uri.split(":")[1];

          console.log("sp_load =>", uri, arguments, this);
          this.src = uri;

          if (options.startFrom !== 0)
            this.currentTime = Math.floor(0.001 * options.startFrom);

          if (options.autoplay)
            this.play();

          console.log(this.paused)

          unsafeWindow.Spotify.Instances.get(this.instanceid).audioManager.getPlayerById(player_id).trigger('LOAD', {}, {id: player_id});
        };

        /* dummy functions after __noSuchMethod__ was deprecated in Firefox 44 */
        dummy.sp_initializePlayerById = function(player_id)      { console.log("=> sp_initializePlayerById",  arguments); };
        dummy.sp_stop                 = function(player_id)      { console.log("=> sp_stop",                  arguments); };

        /* actual reimplementations of functions that embody the internal SWF interface */
        dummy.sp_setVolume   = function(player_id, vol) { console.log("=> volume", arguments); if (player_id == "main:A" && vol !== 0) this.volume = vol };
        dummy.sp_getVolume   = function(player_id, vol) { console.log("=> golume", arguments); if (player_id == "main:A" && vol !== 0) return parseFloat(this.volume); else return 0 };
        dummy.sp_seek        = function(player_id, pos) { console.log("=> seek",   arguments); this.currentTime = Math.floor(0.001 * pos) };
        dummy.sp_pause       = function(player_id)      { console.log("=> pause",  arguments); this.pause() };
        dummy.sp_resume      = function(player_id)      { console.log("=> pause",  arguments); this.play() };

        dummy.sp_playerState = function(player_id)
        {
          return {
            volume: this.volume,
            position: Math.floor(1000 * this.currentTime),
            duration: Math.floor(1000 * this.duration),
            isPlaying: !this.paused,
            isStopped: false,
            isPaused: this.paused
          };
        };

        dummy.sp_addPlayer   = function(player_index, player_id, player_protocol)
        {
          if (player_id != "main:A")
            return;

          var sp_html5_event_listeners =
          {
                   canplay: 'LOAD',
                   playing: 'PLAYING',
                     pause: 'PAUSED',
                     ended: 'TRACK_ENDED',
            durationchange: 'DURATION',
                  progress: 'PROGRESS',
                     error: 'PLAYBACK_FAILED'
          };

          function sp_html5_generic_callback(e)
          {
            console.log("sp html5 audio «" + e.type + "» event", e, sp_html5_event_listeners[e.type]);

            var ret;

            switch(sp_html5_event_listeners[e.type])
            {
              case 'DURATION':
                ret = {duration: Math.floor(1000 * this.duration)};
                break;

              case 'PROGRESS':
                ret = {position: Math.floor(1000 * this.currentTime)};
                break;

              default:
                ret = {};
            }

            unsafeWindow.Spotify.Instances.get(this.instanceid).audioManager.getPlayerById(player_id).trigger(sp_html5_event_listeners[e.type], ret, {id: player_id});
          }

          for (var i_event in sp_html5_event_listeners)
            this.addEventListener(i_event, sp_html5_generic_callback);

          return true;
        };

        dummy.__noSuchMethod__  = function(name, params) { console.log('==>>== > invalid function call', name, params); };

        /* necessary for the spotify framework to find it in the right place */
        window.document[properties.id] = dummy;

        /* insert our dummy audio player in the requested element */
        document.getElementById(parent_id).appendChild(dummy);

        /* tell the spotify framework that the swf embed is ready */
        arguments[9].apply(this, [{success: true}]);

        // act as the swf bridge and tell it that the Flash-backend is ready
        // JSInterface.notify(ApplicationEvents.READY,null,1);
        //Spotify.Instances.get(properties.instanceId).audioManager.getInterface()._triggerDeferred('FLASH_AVAILABLE', null);
        Spotify.Instances.get(properties.instanceId).audioManager.getInterface()._triggerDeferred('READY', null);

        console.log("AUDIOMANAGER-INTERFACE", properties.id, window.document[properties.id], Spotify.Instances.get(properties.instanceId).audioManager.getInterface(),
                    Spotify.Instances.get(properties.instanceId).audioManager.getInterface().hasSound());
      }
    }
  });


function when_external_loaded()
{
// ---


 function get_pong(ping)
 {
   // http://crossorigin.me/http://ping-pong.spotify.nodestuff.net/64-104-120-204-164-75-214-221-224-109-28-127-73-236-239-150-88-238-177-90

   console.log("ping-pong", ping);

   var xhr = new XMLHttpRequest();
   xhr.open("GET", "https://crossorigin.me/http://ping-pong.spotify.nodestuff.net/" + ping.replace(/ /g,"-"), true);
   xhr.responseType = "json";

   xhr.onloadend = function()
   {
     if (xhr.readyState != xhr.DONE)
       return;

     console.log("pong", xhr);
     window.proof = xhr.response.pong.replace(/-/g," ");

     if (!sp_ws)
       return;

     sp_ws.send(`{"id":` + (window.proof_id || 2) + `,"name":"sp/pong_flash2","args":["` + window.proof + `"]}`);
     //sp_ws.send(`{"id":2,"name":"sp/work_done","args":["undefined"]}`);

   }

   xhr.send();
 }

/* wait until the page is ready for the code snippet to run */
document.addEventListener('DOMContentLoaded', function()
{
  console.log("!!! DOMContentLoaded");

  WebSocket.prototype.sond = WebSocket.prototype.send;
  WebSocket.prototype.send = function(msg)
  {
    window.sp_ws = this;

    if (this.onmessage && this.sucks !== true)
    {
      callback = this.onmessage;

      console.log("orig prev callback:", callback);

      this.onmessage = function(message)
      {
        var json_msg = JSON.parse(message.data);

        if (json_msg && json_msg.message && json_msg.message[0] == 'ping_flash2' && json_msg.message[1])
        {
          console.log("getting preventive pong", json_msg);
          get_pong(json_msg.message[1]);
        }

        //if (json_msg.id === window.last_track_msg)
          console.info("<- ws recv: ", window.last_track_msg, message.data);

        //if (json_msg && json_msg.result && json_msg.result.uri)
          //open(json_msg.result.uri);

        callback(message);
      }

      this.sucks = true;
    }

    var json_msg = JSON.parse(msg);

    // block the flash pong reply until we have the correct reply for the challenge
    if (typeof window.proof !== "string" && json_msg && (json_msg.name == 'sp/pong_flash2')) // || json_msg.name == 'sp/work_done'))
    {
      console.info("-> blocking sent message until we have challenge: ",  json_msg.id, msg);

      window.proof_id = json_msg.id;

      return;
    }

    // get the http link instead or rtmp, thankies!
    if (json_msg && json_msg.name == 'sp/track_uri')
    {
      arguments[0] = msg.replace(',"rtmp"', '');
      window.last_track_msg = json_msg.id;
      console.info("-> ws send: ",  json_msg.id, msg);
    }
    //dec_msg = json_msg.name === 'sp/hm_b64' ? atob(json_msg.args[0]) : null;

    console.info("-> ws send: ", msg); //json_msg, dec_msg);

    //if (json_msg.name !== 'sp/log')
     return WebSocket.prototype.sond.apply(this, arguments);
  }

});

// ---
}

if (window != window.parent)
  throw "This should only execute in the main context frame...";

/* inject this cleaning function right in the page to avoid silly sandbox-related greasemonkey limitations */
window.document.head.appendChild(
  inject_fn = document.createElement("script")
);

inject_fn.innerHTML = '(' + when_external_loaded.toString() + ')()';

