// ==UserScript==
// @name        J-CAT HTML5
// @description Use the site without having to install Adobe Flash Player.
// @namespace   swyter
// @match       *://www.j-cat.org/*/page/check/*
// @match       *://www.j-cat.org/*/page/test_check
// @match       *://www.j-cat.org/*/page/test_start
// @version     5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/29188/J-CAT%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/29188/J-CAT%20HTML5.meta.js
// ==/UserScript==

Object.defineProperty(window, 'flashVersion',
{
    value: 9,
    writable: false
});

Object.defineProperty(window, 'swfobject',
{
    value:
    {
        embedSWF: function(swf, target, width, height, min_flash_version, alt_swf, flashvars, params, attributes)
        {
            console.log(arguments);
            
            /* this is a check page */
            if (target === 'soundChk_swf')
            {
                /* add an audio player to hear the sample questions */
                player = document.createElement('audio');
                player.src = 'http://www.j-cat.org/lib/soundChecker/soundtest.mp3';
                player.controls = true;

                /* add a fieldset container to wrap everything */
                field = document.createElement('fieldset');
                field.textContent = 'Click the play button to hear an audio sample.';

                if (!(target = document.getElementById(target)))
                    chkEnv.soundNG();

                target.replaceWith(field);

                /* add the audio player to the fieldset */
                field.appendChild(player);

                /* add a confirmation button, too */
                button = document.createElement('button');
                button.textContent = 'Could you hear? Click here.';
                button.addEventListener('click', function()
                {
                   /* call back the page when clicking and tell
                     it that we were successful */
                   chkEnv.soundOK(6999);
                });

                field.appendChild(button);
            }
            
            /* this is an actual test page */
            else if (target == 'testFlashArea')
            {
                this.BASE_URL           = flashvars["BASE_URL"];
                this.ITEMOUT_URL        = this.BASE_URL + "itemout/";
                this.PREVIEW_URL        = this.BASE_URL + "admin/";
                this.SAMPLE_URL         = this.BASE_URL + "sample/";
                this.SAMPLE_ITEMOUT_URL = this.BASE_URL + "sample/itemout/";
                this.PREVIEW            = flashvars["PREVIEW"];
                this.SAMPLE             = flashvars["SAMPLE"];
                this.lang               = flashvars["LANG"];
                
                console.log(target, this);
            }
            
            
        }
    },
    writable: false
});