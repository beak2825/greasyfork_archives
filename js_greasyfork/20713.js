/////////////////////GIVE CREDIT IF YOU'RE GOING TO MODIFY THIS./////////////////////

$(document).ready(function() {

$('h1').replaceWith('<div id="preview"><div id="img"></div></div>');
$('#leaderboard-hud h4').html('Leaderboard');
$('title').html('Danilo Ogar');
$('.leaderboard-panel').html('<style>.leaderboard-panel{ overflow-x: hidden; overflow-y: scroll; width: 252px;height: 597px;}#skinz{display: inline-block;-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);cursor:pointer;width:99px;height:99px;maRgin:5px;border-radius:100000000px;}</style> <table class="scroll"><tr><td><div id="skinz" style="opacity: 1;" class="1"></div> <div id="skinz" style="opacity: 1;" class="2"></div> <div id="skinz" style="opacity: 1;" class="3"></div> <div id="skinz" style="opacity: 1;" class="4"></div> <div id="skinz" style="opacity: 1;" class="5"></div> <div id="skinz" style="opacity: 1;" class="16"></div> <div id="skinz" style="opacity: 1;" class="17"></div> <div id="skinz" style="opacity: 1;" class="18"></div> <div id="skinz" style="opacity: 1;" class="19"></div> <div id="skinz" style="opacity: 1;" class="20"</div></td><td></div> <div id="skinz" style="opacity: 1;" class="6"></div> <div id="skinz" style="opacity: 1;" class="7"></div> <div id="skinz" style="opacity: 1;" class="8"></div> <div id="skinz" style="opacity: 1;" class="9"></div> <div id="skinz" style="opacity: 1;" class="10"</div></div> <div id="skinz" style="opacity: 1;" class="11"></div> <div id="skinz" style="opacity: 1;" class="12"></div> <div id="skinz" style="opacity: 1;" class="13"></div> <div id="skinz" style="opacity: 1;" class="14"></div> <div id="skinz" style="opacity: 1;" class="15"</div></tr></table>');
$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");

for (var i = 1; i < 11; i++) {
    if (localStorage.getItem('profile'+i) === null){
    localStorage.setItem('profile'+i, null);
    }
}


    $('.1,.2,.3,.4,.5,.6,.7,.8,.9,.10,.11,.12,.13,.14,.15,.16,.17,.18,.19').on('click',function() {
	var dd = $(this).attr('class');
	var skinzz = JSON.parse(localStorage["profile"+dd]);
			localStorage.setItem('activeprofile', dd);
	$('#clantag').val(skinzz[0]);
	$('#nick').val(skinzz[1]);
	$('#skin').val(skinzz[2]);
	$('#mainPanel #img').css("opacity","0");
	$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
	$('#mainPanel #img').css("opacity","1");
	
    
    var p = localStorage.getItem('activeprofile');
	var profile1 = new Array();
	profile1[0] = $('#clantag').val();
	profile1[1] = $('#nick').val();
	profile1[2] = $('#skin').val();
	localStorage["profile"+p] = JSON.stringify(profile1);

    });


window.setProfile = function(x) {
    var f = localStorage.getItem('activeprofile');
    if(x === 0) f--;
    if(x === 1) f++;
    if(f < 1) f = 20;
    if(f > 20) f = 1;
	localStorage.setItem('activeprofile', f);
	
	
	var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);
	$('#mainPanel #img').css("opacity","0");
	$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
	$('#mainPanel #img').css("opacity","1");
};
	
	

$('#Tag, #skin, #Nombre').on("input", function(){
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
    var p = localStorage.getItem('activeprofile');
	var profile1 = new Array();
	profile1[0] = $('#Tag').val();
	profile1[1] = $('#Nombre').val();
	profile1[2] = $('#skin').val();
	localStorage["profile"+p] = JSON.stringify(profile1);
	    for (var i = 1; i < 11; i++) {
    	var skinz = JSON.parse(localStorage["profile"+i]);
    	
        if (skinz !== null) {
    	$('.'+i).css("background","url('"+skinz[2]+"')");	
        }

        
    }
});

$('.agario-panel-freecoins, .agario-shop-panel').insertBefore('#tags-container');
$('#tags-container').remove();
$('.vertical-line').remove();
$('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');
$('head').append('<style>.shop-power{float:right;}.agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel{width:100%;}#img, #skinz{background-size: cover !important;}#helloContainer{margin-top: -15px;}#mainPanel #img, #skinz{	-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,2); box-shadow: 0px 0px 10px 1px rgba(0,0,0,2);}#minimap-hud{border: 1px solid rgba(0, 0, 0, 2);}.hideskin{backgRound-coloR:#D539D5 !important;border-coloR:#D539D5 !important;cursor: pointer;}.showskin{cursor: pointer;background-color: #BC2CAE !important;border-color: #BC2CAE !important;}.btn-info{    color: #fff !important; background-color: #A10B8D !important; border-color: #E612C6 !important;}#helloContainer{opacity: 0.90;}                                                                         #leaderboard-hud h4{font-size:27px;}#mainPanel h1{margin: 5px 0 5PX 0;}.hud, .hud-b{text-align: left !important;}#leaderboard-info{margin-top: 5px;}#main-menu{border-bottom:none !important; }.ogario-yt-panel, #ogario-ad, #version{display:none !important;}.btn-group-justified>.btn, .btn-group-justified>.btn-group{background: rgb(16, 16, 16);color: #adadad;border-color: #1e1d21;}.input-group-addon{background-color: rgba(255, 255, 255, 0.15);border: rgba(206, 0, 224, 0.72);}#mainPanel #img{transition: opacity .15s;margin: 0 60px;border-radius: 1000px;width:200px;height:200px;}.menu-tabs li.active{background-color: rgba(0, 0, 0, 2);border-radius: 0px;}.menu-tabs .active{color: #DA87BB !important;}a:focus, a:hover{text-decoration: none;}.menu-tabs{padding: 6px 22px 6px 25px !important;border-radius: 0px;    background-color: rgba(206, 0, 224, 0.72);}.agario-panel, .btn, .form-control, .input-group-addon, .input-group-sm>.input-group-addon{border-radius: 0px;}                            .showskin, .btn-warning, .btn-success{background-color: #AE2D92 !important; border-color: #C20E9B !important;}.btn-danger, .hideskin{backgRound-coloR: #68044F !important;border-coloR: #68044F !important;} .btn-info.active, .btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{background-color: #A6008B !important;border-color: #C134A0 !important;} .btn-danger.active, .btn-danger.focus, .btn-danger:active, .btn-danger:focus, .btn-danger:hover, .open>.dropdown-toggle.btn-danger, .hideskin:hover{    background-color: #5C0457 !important;border-color: #5C0457 !important;} .btn-shop, .btn-shop:active, .btn-shop:disabled{background-color: #A6327E !important;border-color: #A6327E !important;} .btn-warning.active, .btn-warning.focus, .btn-warning:active, .btn-warning:focus, .btn-warning:hover, .open>.dropdown-toggle.btn-warning, .showskin:hover, .btn-success:hover{background-color: #D2139F !important;border-color: #D2139F !important;}.agario-panel{background-color: #1C1E2D;}.agario-panel input, .agario-panel select{background-color: rgba(255, 255, 255, 0.13);}</style>');
$('.party-panel, .agario-party, .agario-party-0, .agario-party-1, .agario-party-2, .agario-party-3, .agario-party-4, .agario-party-5, .agario-party-6, .agario-panel-gifting, .agario-profile-panel').remove();
$('.hud, .hud-b').css('border-radius','0px');
$('h2').remove();
$('#fps-hud').css("bottom", "10px");
$('#fps-hud').css("top", "auto");
$('#autoHideCellsInfo').parent().html('<input type="checkbox" onchange="setSettings(\'autoHideCellsInfo\', $(this).is(\':checked\'));" id="autoHideCellsInfo">Auto hide cells info');
$('.theme-box').remove();
$('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>');

   
    var f = localStorage.getItem('activeprofile');
    var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);
	$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
	
	$('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="    background: #FF0000; width: 500px; height: 300px; bottom: 35px; right: 35px; position: fixed; border-radius: 15px; box-shadow: 0px 0px 25px 0px #FF0000; padding: 70px; font-weight: 600; color: white; transition: all .3s; ">¿Que esperas para suscribirte?<br>Hazlo ya :)<br><br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCPoh_9ce3sjbZR5jfaXVYkg" data-layout="full" data-count="default"></div></div>');
    $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');

    for (var i = 1; i < 11; i++) {
    	var skinz = JSON.parse(localStorage["profile"+i]);
    	
        if (skinz !== null) {
    	$('.'+i).css("background","url('"+skinz[2]+"')");
        }

        
    }


});