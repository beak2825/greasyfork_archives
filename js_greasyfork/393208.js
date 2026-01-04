// ==UserScript==
// @name         YouTube - Are you still there?
// @version      1.4
// @description  Skips and removes ads on YouTube automatically - WIP
// @author       Salad
// @match        https://www.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/411414
// @downloadURL https://update.greasyfork.org/scripts/393208/YouTube%20-%20Are%20you%20still%20there.user.js
// @updateURL https://update.greasyfork.org/scripts/393208/YouTube%20-%20Are%20you%20still%20there.meta.js
// ==/UserScript==
/*
                                                       O8888c8O
                                                    .88888888.888
                                                   c8888888888.888.
                                                  O888888888888c888c
                                                 O8888888888888c8888c
                                      .         c888888888888888.8888.
                                     OO.        :..8888888888888c88888
                                    .88888.    :::::..88888888888coO88O        .
                                    88888888c .::::::::.888888Oc8.888O.      cooo
                                   c8888888888 ::::::::: 8888.888c88888:  .oooooo:
                                   888888888888::::::::::.O8c8888c888888 ooooooooo
                                   8888888888888.:::::::::.:888888c88888ccoooooooo:
                                  c8888888888888.:::::::::.8888888c888888.ooooooooo
                                  8888888888888c::::::::::o8888888 888888 ooooooooo
                                  8888888888888.::::::::: 88888888c888888cooooooooo:
                                  888888888888c::::::::::o88888888c888888o:oooooooo:
                                 c888888888888     :::::.888888888OO888888:ooooooooo
                                 c888888888888 .... ::::.8888888888c888888    .ooooo
                                 c888888888888 .... :::: 8888888c .. O8888 .... oooo
                                 O88888888888O..    .:::c88888 ccccccc:.88 .... oooo
                                 .co888888888c. .    :::c8888.cccccccccc 8 .    cooo:
                                 :oooo:888888c.  .   :::o888cccccc:::::::c:::::::ccc::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                 c88888888888c..... ::::o8888.cccccccccc:8 .    oooo.
                                 c888888888888 .... :::: 88888 ccccccc::88 .... oooo
                                 c888888888888 .     ::: 8888888O:  oO8888 .    oooo
                                 c888888888888  .    :::.8888888888c88888O  .   .ooo C
                                  888888888888c.    :::::o88888888cc88888c .    oooo
                                  888888888888O ... :::::.88888888co88888  .... ooo:
                                  c888888888888    ::::::.88888888c888888 c:::coooo:
                                 ..888888888888o::::::::::c8888888c88888O:ooooooooo .
                                   8888888888888::::::::::.O888888 88888:oooooooooo
                                   c8888888888888 :::::::::.888888 88888 ooooooooo.
                                    88888888888888 ::::::::: 88888 8888ccooooooooo
                                    c88888888888888 ::::::::: O888c8888 ooooooooo.
                                     888888888888O.::::::::: ::..8o8c .oooooooooc
                                     .8888888888..::::::::. ::::::: :..ooooooooo
                                      c88888888  :::::::: .::::::::.:   ooooooo
                                      .C88888O    :::.::    ::::::.:     . cO888Cc.
                                      o.C888c  C88888.:       ::::          c888888888C
                                      ooc.C  .8888888c           .         .    C88888888
                                      ooo    c8888888c                            C8888888.
                                      ooo    c88888888                             c888888C.
                                      ooo    c88cc..                                 c  ooo
                                      ooo       :ooo                                    :ooo
                                     :ooo        ooo                                     ooo:
                                     :ooo        ooo:                                     ooo
                                     :ooo        ooo:                                     :ooo
                                     :oo:        cooo                                      coo:
                                     :oo.        :ooo                                       ooo
                                     :oo         :ooo                                       .oo:
                                     :o:          ooo                                        ooo
                                     :o           ooo                                         oo:
                                     ::           ooo                                         :oo
                                     :            :oo                                          oo:
                                                  :oo                                           oo
                                                   oo                                            o
                                                   oo                                            .:
                                                   o:                                             :
                                                   :
                                                   :
*/

setInterval(function() {
    'use strict';
    if ($('#main')) {
        $("#button").click()
    }
}, 5000);