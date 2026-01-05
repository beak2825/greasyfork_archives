// ==UserScript==
// @name           AtresMedia HTML5 player
// @name:es        Reproductor HTML5 para AtresPlayer
// @namespace      userscripts.org/swyter
// @author         Swyter
// @homepage       https://swyterzone.appspot.com
// @description    HTML5 player for AtresPlayer.com, avoiding the Flash Player plugin and sundry advertisements. Adds a download button.
// @description:es Reproductor HTML5 para AtresPlayer.com, evitando el uso del plugin Flash Player y anuncios varios. Añade un botón de descarga.
// @match          http://www.atresplayer.com/television/*
// @version        2016.04.16
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @icon           https://i.imgur.com/3DHI22d.png
// @run-at         document-start
// @compatible     firefox
// @license        GNU/GPL
// @downloadURL https://update.greasyfork.org/scripts/10201/AtresMedia%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/10201/AtresMedia%20HTML5%20player.meta.js
// ==/UserScript==

/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 */
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);


document.addEventListener('DOMContentLoaded', function()
{
  /* add a quality switcher to flip between high definition  and baseline mode,
     with slightly lower bitrate and size, mainly for mobile and such */
  
  function insertButton(bt_text, bt_option)
  {
    document.querySelector(".mod_producto_social > div > div > p").insertAdjacentHTML(
      'afterend', `<label style="padding-left: 28px" class="left btn_cp mar-r_5" title="Recarga la página para que surta efecto.">
                     <input ` + (!!localStorage[bt_option] && 'checked' || '') + `
                            type="checkbox"
                            style="position: absolute; left: 4px; top: 7px"
                            onchange="this.checked ? localStorage['` + bt_option + `'] = true : delete localStorage['` + bt_option + `']" >

                     ` + bt_text + `
                  </label>`
    );
  }

  insertButton('Subtítulos', 'useCC');
  insertButton('Ver en HD', 'useHD');

  /* here's the real meat. feast your eyes, oh mortal! */
  if (!(contentPk = document.querySelector("div[episode]").attributes['episode'].value))
    return;

  var  timestampPk = Math.round(new Date().getTime() / 1000) + 30000 + '';
  var      tokenPk = md5(contentPk + timestampPk, 'QWtMLXs414Yo+c#_+Q#K@NN)');
  var        useHD = (!localStorage['useHD'] && 'baseline/' || '');

  var videoDataURL = 'https://servicios.atresplayer.com/api/urlVideo/' + contentPk + '/android_tablet/' + useHD + contentPk + '|' + timestampPk + '|' + tokenPk + '.json';

  GM_xmlhttpRequest(
  {
    method: 'GET',
    url: videoDataURL,

    headers:
    {
      'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.3; GT-I9300 Build/JSS15J',
          'Accept': 'application/json'
    },

    onreadystatechange: function(e)
    {
      if (e.readyState !== XMLHttpRequest.DONE)
        return;

      this.responseJSON = JSON.parse(e.responseText);

      if ('result' in this.responseJSON === false || this.responseJSON.resultDes !== 'OK' || Object.keys(this.responseJSON.resultObject).length === 0)
      {
        console.warn('ATRESMEDIA PLAYER HTML5 THINGY: the listing did not come with any video at all!', this.responseJSON);
        return;
      }

      /* just for taking a look, please don't mind me! :-) */
      console.log(e, this.responseJSON, contentPk);

      /* hacky way of retrieving the subtitles url without doing any requests, i'm cheap like that */
      var code = document.querySelector("meta[name=deepLink]").content.split("?")[1].replace(/\w*=/g,'').split("&").slice(0, 3);
      var subs = "http://www.atresplayer.com/subtitles/80000608/" + code.join("/") + "/" + this.responseJSON.resultObject.es.match(/[\d\w-]{36}/g)[0] + ".srt"

      this.responseJSON.resultObject['sub'] = subs;
      
      /* add a download button per result video */
      for (var vid in this.responseJSON.resultObject)
      {
        dwnbutton = document.createElement("a");
        dwnbutton.setAttribute('style', 'padding-left: 35px; padding-right: 12px');
        dwnbutton.textContent = vid==='sub' ? 'Subt.' : 'Descargar [' + vid + ']';
        dwnbutton.className   = 'mar-l_10 fn_slide_link left btn_black icon_35 descarga';
        dwnbutton.href        = this.responseJSON.resultObject[vid];
        dwnbutton.download    = document.title.substring(37) + (vid==='sub' ? '.es.srt' : '.' + vid + '.mp4');

        /* replace it on the page */
        dwnbuttonHolderElement = document.querySelector('.mod_producto_social > div > div');
        dwnbuttonHolderElement.appendChild(dwnbutton);
      }
      
      /* build our own html5 player with our own stuff */
      vplayer = document.createElement("video");

      vplayer.src      = this.responseJSON.resultObject.es || this.responseJSON.resultObject.vo;
      vplayer.poster   = document.querySelector('#imagen_modulo_player > img').src;

      vplayer.controls = 'true';
      vplayer.volume   = '0.4';

      vplayer.height   = 549;
      vplayer.width    = 976;

      vplayer.style.marginBottom = '-2px';

      /* replace it on the page */
      videoHolderElement = document.querySelector('#imagen_modulo_player');
      videoHolderElement.parentElement.replaceChild(vplayer, videoHolderElement);
      
      xhr = new XMLHttpRequest();
      xhr.open('GET', subs);

      xhr.onloadend = function(e)
      {
        if (this.status !== 200)
        {
          console.log("No subtitles available here.");
          
          subs_button = document.querySelector("a[download*=srt]");
          subs_button.parentElement.removeChild(subs_button);
          return;
        }

        console.log(vplayer, e, this.status);

        track = document.createElement("track");

        track.label   = 'Castellano';
        track.default = !localStorage['useCC'] ? false : true;
        track.srclang = 'es';
        track.src     = URL.createObjectURL( /* append WEBVTT prefix -> replace timing commas by dots -> decode url entities -> encode in blob -> attach it to a CC track. pretty neat, huh? :) */
          new Blob([ ((t=document.createElement("textarea")).innerHTML = 'WEBVTT\n\n' + this.response.replace(/(\d\d:\d\d:\d\d),(\d\d\d --> \d\d\:\d\d\:\d\d),(\d\d\d)/g, "$1.$2.$3")) && t.textContent ], {type: 'text/vtt'})
        );

        vplayer.appendChild(track);
      };
      
      xhr.send();
    },

    onerror: function(e)
    {
      console.warn('ATRESMEDIA PLAYER HTML5 THINGY: Looks like the API endpoint has changed or we have a network problem!', e);
    }
  });
});

GM_addStyle(
  `#bannerTop, .mod_producto_social .right, .capa_cookies, .mod_roba, .neoxkidz, a[href="#fn_ayuda_lay"], img[alt="¿Por qué registrarse?"] { display: none !important; }`
);
