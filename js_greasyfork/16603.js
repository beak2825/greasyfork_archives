// ==UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @name         Onur 
// @namespace    v2 Fix
// @version      2.10
// @description  Changes your skin in agarplus using imgur album.
// @author       master2500 |v2 fix Ezybro
// @match        http*://agar.io
// @include      http://*agar.io/agarplus.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16603/Onur.user.js
// @updateURL https://update.greasyfork.org/scripts/16603/Onur.meta.js
// ==/UserScript==

//variables
var sideContainer = '.side-container.left-side'; //container to append skin changer menu
var leftContainer = '.forums'; //used to find left container
var loadCheckInterval = 100; //interval to check if container has loaded
var isPlaying = '#overlays'; //to check if player is playing
var customSkin = '#skin_url'; //agarplus skin url field
var playButton = 'button[data-itr="play"]'; //agarplus play button
var skinChangerButton = '#skinChangerButton'; //button start/stop skin chanage
var albumField = '#albumField'; //imgur skin album field
var intervalField = '#intervalField'; //interval (ms)
var imgurClientID = 'Client-ID 3d3ef891ffc63d7' //imgur application authentication id
var current = 0; //current skin
var mainInterval; //skin changer interval

//check if page loaded
var ci = setInterval(function()
{
    if ($(sideContainer).has(leftContainer).length)
    {
        clearInterval(ci);
        //inject skin changer panel
        $(sideContainer).has(leftContainer).append('<div class="agario-panel agario-side-panel agarioProfilePanel level forums"><input id="albumField" type="text" placeholder="Imgur skins album ID" class="form-control"></input><input id="intervalField" type="text" placeholder="Interval (ms)" class="form-control"><button id="skinChangerButton" class="btn btn-primary">Start</button></div>');
        //fill fields from storage
        $(albumField).val(localStorage.getItem('album'));
        $(intervalField).val(localStorage.getItem('interval'));
        //add event listener to button
        $(skinChangerButton).on('click', this, function()
        {
            //if start start if stop stop
            if ($(skinChangerButton).text() == 'Start')
            {
                //get images using imgur api
                $.ajax(
                {
                    url: 'https://api.imgur.com/3/album/' + $(albumField).val() + '/images',
                    type: 'GET',
                    dataType: 'json',
                    beforeSend: function(xhr)
                    {
                        xhr.setRequestHeader('Authorization', imgurClientID);
                    },
                    success: function(data)
                    {
                        //set to stop
                        $(skinChangerButton).text('Stop');
                        $(skinChangerButton).attr('style', 'background-color : red');
                        //preload images into cache
                        for (var i = 0; i < data.data.length; i++)
                        {
                            var img = new Image();
                            img.src = data.data.link;
                        }
                        //save values to local storage for later use
                        localStorage.setItem('album', $(albumField).val());
                        localStorage.setItem('interval', $(intervalField).val());
                        //set main interval for changing skin
                        mainInterval = setInterval(function()
                        {
                            //loop trough the skins
                            $(customSkin).val(data.data[current].link);
                            if ($(isPlaying).css('display') == 'none')
                            {
                                $(playButton).trigger('onclick');
                            }
                            current++;
                            if (current == data.data.length)
                            {
                                current = 0;
                            }
                        }, parseInt($(intervalField).val()));
                    },
                    error: function()
                    {
                        //log if ajax request fails
                        console.log('Failed to fetch images from imgur.');
                    }
                });
            }
            else
            {
                //set to start
                clearInterval(mainInterval);
                $(skinChangerButton).text('Start');
                $(skinChangerButton).attr('style', '');
            }
        });
    }
}, loadCheckInterval);