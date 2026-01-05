// ==UserScript==
// @name        ҜƛÐѦℒCrew Version 2.7!
// @version      2.7
// @namespace    https://fb.me/XnonGermx1337
// @description  ҜƛÐѦℒCrew Extension 
// @author       XnonGermx
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17642/%D2%9C%C6%9B%C3%90%D1%A6%E2%84%92Crew%20Version%2027%21.user.js
// @updateURL https://update.greasyfork.org/scripts/17642/%D2%9C%C6%9B%C3%90%D1%A6%E2%84%92Crew%20Version%2027%21.meta.js
// ==/UserScript==


function loadScript(t, e) {
    var o = document.getElementsByTagName("head")[0],
        a = document.createElement("script");
    a.type = "text/javascript", a.src = t, a.onload = e, o.appendChild(a)
    // Edits
    document.getElementsByClassName("header")[0].innerHTML = '<div class="header99" style="color: rgb(255, 255, 255);"><a href="https://https://www.youtube.com/channel/UCkbRqV645MCZz8iEfRHrUTg" target="_blank"><u>ҜƛÐѦℒ</a></u></div>';
    document.getElementsByClassName("agario-panel agario-side-panel agarioProfilePanel level forums")[0].innerHTML = '<div id="profile-main"><h4>༺✘ῆℴᘐℯrო✘༻</h4><div id="profile-pic" class="form-group clearfix"></div><div id="preview-img-area"><img id="preview-img" src="https://scontent-sit4-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/12647310_233052250365325_5344596451616256791_n.jpg?oh=74c56feed5decf1e22a7a9ee6a43ca5c&oe=5766522A" style="display: inline;"></div></div></div>';
    document.getElementsByTagName("center")[0].innerHTML = '<div align="middle" id="Radio" class="" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">';

}

function receiveMessage(t) {
    if ("http://agar.io" == t.origin && t.data.action) {
        var e = unsafeWindow.Action;
        t.data.action == e.COPY && GM_setClipboard(t.data.data), t.data.action == e.IMAGE && downloadResource(t.data.data, unsafeWindow.handleResource)
    }
}

function downloadResource(t, e) {
    GM_xmlhttpRequest({
        method: "GET",
        url: t,
        responseType: "blob",
        onload: function (o) {
            200 === o.status ? e(t, window.URL.createObjectURL(o.response)) : console.log("res.status=" + o.status)
        },
        onerror: function (t) {
            console.log("GM_xmlhttpRequest error! "), e(null)
        }
    })
}
var sideContainer = '.side-container.left-side'; //container to append skin changer menu
var leftContainer = '.level'; //used to find left container
var loadCheckInterval = 100; //interval to check if container has loaded
var isPlaying = '#overlays'; //to check if player is playing
var customSkin = 'input#skin_url.form-control'; //agarplus skin url field
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
        $(sideContainer).has(leftContainer).append('<div class="agario-panel agario-side-panel agarioProfilePanel level"><input id="albumField" type="text" placeholder="Imgur skins album ID" class="form-control" style="margin-bottom: 5px"></input><input id="intervalField" type="text" placeholder="Interval (ms)" class="form-control" style="margin-bottom: 5px"><button id="skinChangerButton" class="btn btn-primary">Start</button></div>');
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
var VERSION = "2.0.0",
    $, URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js",
    URL_BOOTSTRAP = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
    URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js",
    URL_FACEBOOK = "http://connect.facebook.net/en_US/sdk.js",
    URL_MAIN_OUT = "http://xnongermx.xyz/agario/kadalcrew.js",
    URL_CSS_FILE = "http://xnongermx.xyz/agario/kadalcrew.css";
window.stop(), document.documentElement.innerHTML = null, "agar.io" == location.host && "/" == location.pathname && (location.href = "http://agar.io/KadalCrew" + location.hash), loadScript(URL_JQUERY, function () {
    $ = unsafeWindow.jQuery, $("head")
        .append('<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic" rel="stylesheet" type="text/css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/animate.css">'), $("head")
        .append('<link rel="stylesheet" href="http://agar.io/css/bootstrap.min.css">'), $("head")
        .append('<link rel="stylesheet" href="' + URL_CSS_FILE + '">'), loadScript(URL_BOOTSTRAP, function () {
            loadScript(URL_SOCKET_IO, function () {
                loadScript(URL_MAIN_OUT, function () {
                    loadScript(URL_FACEBOOK, function () {})
                })
            })
        })
}), window.addEventListener("message", receiveMessage, !1);