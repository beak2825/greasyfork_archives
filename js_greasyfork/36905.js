// ==UserScript==
// @name         KissAnime RapidVideo Custom Player
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  No ads, faster, download options, no viruses, html5
// @author       You
// @match        http://kissanime.ru/Anime/*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdn.rawgit.com/Eltion/KissAnime-RapidVideo/112df41f394b4ca5924d9d4e11b77cf6cf7bda93/player1.js

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/36905/KissAnime%20RapidVideo%20Custom%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/36905/KissAnime%20RapidVideo%20Custom%20Player.meta.js
// ==/UserScript==


var current = 0;
var UrlQ;
var bestQ = "";


(function() {
    var iframe = $("#divContentVideo").find("iframe").attr("src");
    if(iframe.includes("rapidvideo")){
        $("#divContentVideo").html("");

        $('head').append('<link rel="stylesheet" href="//releases.flowplayer.org/7.2.1/skin/skin.css">');

        $('#divContentVideo').html('<div id="player"></div>');
        $("#divQuality").html("<select  id='quality'></select>");
        $("#divQuality").css({"display":"inline-block"});

        $("#quality").on("change",function(){
            var val = $(this).val();
            change(val);
        });

        rapidvideoGetQualities(iframe);

        flowplayer(function (api, root) {
            var fsbutton = root.querySelector(".fp-fullscreen");
            api.on("ready", function () {
                root.querySelector(".fp-controls").appendChild(fsbutton);
            });
        });
    }

})();


  function rapidvideoGetQualities(url){
    var k = "";
      var re = new RegExp(url+"&q=\\d*p","g");
    GM_xmlhttpRequest({
        method: "GET",
        url: ""+url,
        synchronous: true,
        onload: function(response) {
            var e = response.responseText.match(re);
            if (e === undefined || e === null) {

            }else{
                UrlQ = e;
                rapidvideo(e[0]);
            }
        }
    });


}

function rapidvideo(url){
    if(current >= UrlQ.length ){
        setPlayer(bestQ);
        $("#quality").find("option").last().attr("selected",'');
    }else{
    GM_xmlhttpRequest({
        method: "GET",
        url: ""+url,
        synchronous: true,
        onload: function(response) {
            var e = response.responseText.split('<source src="')[1].split('"')[0];
            if (e === undefined || e === null) {
                console.log(response.responseText);
            }else{
                var label = response.responseText.match(/title="\d*p"/g)[0].split('"')[1];
                bestQ = e;
                $("#quality").append("<option value='"+e+"'>"+label+"</option>");
               current++;
                rapidvideo(UrlQ[current]);
            }
        }
    });
    }
}

function change(val){
    flowplayer(0).load(val);
    $("#Download").attr("href",val);
}

function setPlayer(val){
     flowplayer("#player", {
                    clip: {
                        sources: [
                            { type: "video/mp4",
                             src:  val }
                        ]
                    }
                });
               $("#Download").attr("href",val);
}
