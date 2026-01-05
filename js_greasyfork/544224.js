// ==UserScript==
// @name         Lecteur Media
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Intègre TOUS les lecteurs (Insta, FB, Twitter, TikTok, etc...) et améliore les balises CODE
// @author       FaceDePet
// @match        https://www.jeuxvideo.com/forums/*
// @match        https://www.jeuxvideo.com/messages-prives/*
// @match        https://www.jeuxvideo.com/news/*
// @match        https://jvarchive.com/*
// @match        https://jvarchive.st/*
// @match        https://jvarchive.net/*
// @icon         https://cdn-icons-png.flaticon.com/512/4187/4187272.png
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @connect      bandcamp.com
// @connect      *.bandcamp.com
// @connect      deviantart.com
// @connect      *.deviantart.com
// @connect      discord.com
// @connect      distrokid.com
// @connect      facebook.com
// @connect      www.flickr.com
// @connect      gph.iss
// @connect      gyazo.com
// @connect      *.gyazo.com
// @connect      ibb.co
// @connect      maps.app.goo.gl
// @connect      postimg.cc
// @connect      reddit.com
// @connect      *.reddit.com
// @connect      soundcloud.com
// @connect      stackexchange.com
// @connect      *.stackexchange.com
// @connect      streamable.com
// @connect      *.streamable.com
// @connect      tenor.com
// @connect      tiktok.com
// @connect      *.tiktok.com
// @connect      vxtwitter.com
// @connect      *.vxtwitter.com
// @connect      twitter.com
// @connect      x.com
// @connect      api.vxtwitter.com
// @connect      video.twimg.com
// @connect      pbs.twimg.com
// @connect      jvc-preview-proxy.lecteurmedia.workers.dev
// @connect      vxinstagram.com
// @connect      ddinstagram.com
// @connect      wsrv.nl
// @connect      emkc.org
// @connect      trends.google.com
// @connect      ssl.gstatic.com
// @connect      *
// @run-at       document-start
// @license      MIT
// @require      https://update.greasyfork.org/scripts/554422/1727534/LecteurMedia%20API%20Library.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.8/purify.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource     HLJS_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @downloadURL https://update.greasyfork.org/scripts/544224/Lecteur%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/544224/Lecteur%20Media.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.LecteurMedia === 'undefined') {
        console.error('Erreur critique : La librairie Lecteur Media n\'a pas pu être chargée.');
        return;
    }

    // =====================================================================================
    // == Exemples d'utilisation de l'API LecteurMedia ==
    // =====================================================================================

    /*
    // EXEMPLE 1 : Version de base, sans @connect requis.
      const lecteurMediaInstance = new window.LecteurMedia({ providers: 'base' });
      lecteurMediaInstance.initStandalone(); // Lance le script en mode autonome
    */

    /*
    // EXEMPLE 2 : Activer uniquement des fournisseurs spécifiques.
      const lecteurMediaInstance = new window.LecteurMedia({
          providers: ['YouTube', 'Twitter', 'Streamable']
      });
      lecteurMediaInstance.initStandalone();
    */

    /*
    // EXEMPLE 3 : Désactiver la fonctionnalité "Collapse/Expand" par défaut.
      const lecteurMediaInstance = new window.LecteurMedia({ collapsible: false });
      lecteurMediaInstance.initStandalone();
    */

    /*
    // EXEMPLE 4 : Intégration dans un autre script (contrôle manuel avec processNode).
    // C'est le mode API pur : on n'utilise PAS initStandalone().
      const lecteurMediaInstance = new window.LecteurMedia();
      const nouvelElement = document.createElement('div');
      lecteurMediaInstance.processNode(nouvelElement);
    */

    /*
    // OUTIL UTILE : Obtenir la liste des @connect nécessaires pour votre configuration.
      const connects = window.LecteurMedia.getRequiredConnects({ providers: ['base', 'connect'] });
      console.log('Directives @connect requises :\n' + connects.join('\n'));
    */

    // =====================================================================================
    // == Configuration active pour la version publique de ce script ==
    // =====================================================================================

    // Tous les fournisseurs par défaut.
    const lecteurMediaInstance = new window.LecteurMedia();
    lecteurMediaInstance.initStandalone();

})();