// ==UserScript==
// @name         Starve.io Lag Cleaner, Skins | By Nisyy
// @namespace    Starve.io
// @version      2.5
// @description  Starve.io Lag Cleaner , Skins | By Nisyy
// @author       Nisyyy
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://starve.io
// @downloadURL https://update.greasyfork.org/scripts/377158/Starveio%20Lag%20Cleaner%2C%20Skins%20%7C%20By%20Nisyy.user.js
// @updateURL https://update.greasyfork.org/scripts/377158/Starveio%20Lag%20Cleaner%2C%20Skins%20%7C%20By%20Nisyy.meta.js
// ==/UserScript==
/*ads remove*/
$(window).bind("load", function() {
    $('#trevda,[src*="apis.google"],[src*="ad"],[src*="googletagservices"],iframe,#preroll,#divFullscreenLoading,#preroll').remove();
});
/*map*/
var state ="";
var height = $('#game_canvas').attr('height');
var width = $('#game_canvas').attr('width');
var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var int = setInterval(function(){
    var data = ctx.getImageData(width/2.3, height-30, 1, 1).data;
    var data2 = ctx.getImageData(width/2.3, height-120, 1, 1).data;
    if(data[0]=='175'&&data[1]=='53'&&state!=="1"){
        $('.map').remove();
        $('body').append('<div class="map" style="position:absolute!important;z-index: 99999;bottom: 54px; right: 4px;opacity: .4;width:191px;height:188px;background-image: url(http://i.imgur.com/1ebtFiG.png);background-size: cover;">');
        state = "1";
    }   else if (data2[0]=='175'&&data2[1]=='53'&&state!=="2") {
        $('.map').remove();
        $('body').append('<div class="map" style="position:absolute!important;z-index: 99999;bottom: 124px; right: 4px;opacity: .4;width:191px;height:188px;background-image: url(http://i.imgur.com/1ebtFiG.png);background-size: cover;">');
        state = "2";
    }   else if (data[0]!='175'&&data2[0]!='175'&&state!=="0") {
        $('.map').remove();
        state = "0";
    }
    $('.map').click(function(e) {
        if (e.shiftKey) {
            $( this ).remove();
            clearInterval(int);
        }
    });
},500);

setInterval(function(){
    if (document.getElementById("bbback")!==null) {
        document.getElementById("bbback").setAttribute("id","back");
        document.getElementById("back").style="box-shadow: 0px; 5px; #593109; color: #FFFFFF; font-family: 'Baloo Paaji'; margin-bottom: 17px; margin-top: 5px; margin-right: 15px; margin-left: 15px; padding-right: 35px; padding-left: 35px; font-size: 20px; text-align: center; border-radius: 8px; background-color: #854b10; cursor: pointer; display: inline-block;";
    }
    if (document.getElementById("tttwitter")!==null) {
        document.getElementById("tttwitter").setAttribute("id","twitter");
        document.getElementById("twitter").style="border-radius: 7px; background-color: rgb(27, 149, 224); cursor: pointer;";
    }
    if (document.getElementById("fffacebook")!==null) {
        document.getElementById("fffacebook").setAttribute("id","facebook");
        document.getElementById("facebook").style="border-radius: 7px; background-color: rgb(66, 103, 178); cursor: pointer;";
    }
    if (document.getElementById('back')!==null){
        document.getElementById('back').onclick = function(){
            document.getElementById("choose_skin").style.display="inline-block";
        };
    }
    function disp(){
        if(document.getElementById('loading').style.display=="none"===false){
            window.setTimeout(disp, 10);
        }else{
            if($('#share_skins').length>0){
                document.getElementById('share_skins').remove();
                document.getElementById("choose_skin").style.display="inline-block";
            }
        }
    }
    disp();
},100);
return (setInterval);