// ==UserScript==
// @name         Fix Youtube videos in Voxed.net
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  xdddd
// @author       Mav3ricK
// @match        http://www.voxed.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393706/Fix%20Youtube%20videos%20in%20Voxednet.user.js
// @updateURL https://update.greasyfork.org/scripts/393706/Fix%20Youtube%20videos%20in%20Voxednet.meta.js
// ==/UserScript==


    window.onload = function ()
    {

        function move()
        {

            if(document.querySelector('.commentAttach') !== null)
            {
                import('https://code.jquery.com/jquery-3.4.1.min.js');
                var xd = $('.commentAttach');
                xd.css('border','none');
                xd.css('padding','0');
                xd.css('max-width','100%');

                if(xd.children().first().prop('tagName') == 'IFRAME')
                {

                    xd.children().css('width','390');
                    xd.children().css('height','243.75');
                    xd.classList.remove("attach_video");

                }

            }

            setTimeout(move, 1000);
        }

        //v4 updated
        move();


    };



