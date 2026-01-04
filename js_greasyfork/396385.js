// ==UserScript==
// @name         Youtube Continue Video Button Clicker
// @namespace    none
// @version      1.1.6
// @description  Clicks on the "Yes" button in dialog "Video is paused. Continue wachting?"
// @author       Memisoglu, Oguzhan
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        http://youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396385/Youtube%20Continue%20Video%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/396385/Youtube%20Continue%20Video%20Button%20Clicker.meta.js
// ==/UserScript==

// Check the video status every 5 seconds
//
var G_SECONDS = 5;

var g_check_timer = null;

function Is_Video_Playing()
{
    var ans = true;
    var movie_player = document.getElementById("movie_player");
    if ((movie_player !== undefined) && movie_player)
    {
        var movie_class_list = movie_player.classList;
        var i = 0;
        for (i = 0; i < movie_class_list.length; i++)
        {
            if (movie_class_list[i].startsWith("pause"))
            {
                console.log("Video Paused");
                ans = false;
                break;
            }
        }
    }
    return ans;
}

function Check_Video_Playing(i, elements, elements_length){

    if (Is_Video_Playing())
    {
        console.log("Clicked on the right button. Video resuming!");
        g_check_timer = setInterval(run_main, 1000 * G_SECONDS);
    }
    else
    {
        console.log("Clicked on wrong button, video is still paused. " +
                    "Continue clicking other elements...");
        Click_the_Button(i, elements, elements_length);
    }

}

function Click_the_Button(i, elements, elements_length)
{
    // for (; i < elements_length; i++)
    // {
        // if (elements[i].id == 'confirm-button')
        // {
            elements[i].parentNode.querySelector('#confirm-button').click();
            setTimeout(function(){
                            Check_Video_Playing(i, elements, elements_length);
                        }, 250);
            clearInterval(g_check_timer);
            g_check_timer = null;
            // break;
        // }
    // }
}

function Look_for_Button()
{
    console.log("Looking for a confirm button..");
    var class_name = 'style-scope yt-confirm-dialog-renderer buttons';
    var elements = document.getElementsByClassName(class_name);
    if (elements.length > 0)
    {
        var i = 0;
        var elements_length = elements.length;
        Click_the_Button(i, elements, elements_length);
    }
    else
    {
        // If there is no button, either defined class names are outdated
        // or video is not paused by inactivity. Check for updates on the code.
        console.log("No confirm button detected. Either defined class names are outdated",
                    "or video is not paused by inactivity.");
    }
}

function run_main()
{
    console.log("Checking if the video is running");
    if (!Is_Video_Playing())
    {
        console.log("Video is not running. Looking for the button");
        Look_for_Button();
    }
    // else
    // {
        // console.log("Video is running");
    // }
}

(function() {
    'use strict';
    console.log("Youtube Continue Video Button Clicker Running.\n" +
                "Checking every %s second", G_SECONDS);
    g_check_timer = setInterval(run_main, 1000 * G_SECONDS);
})();