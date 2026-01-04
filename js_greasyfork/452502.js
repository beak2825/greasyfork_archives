// ==UserScript==
// @name        Torrent Quick Search
// @namespace  https://github.com/TMD20/torrent-quick-search
// @supportURL https://github.com/TMD20/torrent-quick-search
// @version     2.20
// @description Toggle for Searching Torrents via Search aggegrator
// @icon        https://cdn2.iconfinder.com/data/icons/flat-icons-19/512/Eye.png
// @author      tmd
// @noframes
// @run-at document-end
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @grant GM.registerMenuCommand
// @grant GM.notification
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_notification
// @require  https://cdn.jsdelivr.net/npm/semaphore@1.1.0/lib/semaphore.min.js
// @require  https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require   https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/global.js
// @require  https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/config.js
// @require   https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/nodeManipulator.js
// @require   https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/indexers.js
// @require   https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/events.js
// @require    https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/mediaID.js
// @require    https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/parser.js
// @require    https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/search.js
// @require    https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/clients.js
// @require   https://cdn.jsdelivr.net/gh/tmd20/torrent-quick-search-source@a4eddf148fff8c71d5c9fdbed6d47829e48439b3/src/main.js
// @match https://animebytes.tv/requests.php?action=viewrequest&id=*
// @match https://animebytes.tv/series.php?id=*
// @match https://animebytes.tv/torrents.php?id=*
// @match https://blutopia.xyz/requests/*
// @match https://blutopia.xyz/torrents/*
// @match https://beyond-hd.me/requests/*
// @match https://beyond-hd.me/torrents/*
// @match https://beyond-hd.me/library/title/*
// @match https://imdb.com/title/*
// @match https://www.imdb.com/title/*
// @match https://www.themoviedb.org/movie/*
// @match https://www.themoviedb.org/tv/*
// @compatible   firefox
// @compatible   opera
// @compatible   chrome
// @compatible   safari
// @compatible   edge
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452502/Torrent%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/452502/Torrent%20Quick%20Search.meta.js
// ==/UserScript==

async function main() {
    if (GM.info.script.name == "Torrent Quick Search") {
      overideBuiltins();
      initMainConfig();
      initFilterConfig()
      createMainDOM();
      await setIMDBNode()
    }
  }
  
  main();
  