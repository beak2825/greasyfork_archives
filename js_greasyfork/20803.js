$(document).ready(function() {


$('#leaderboard-hud h4').html('Leaderboard');
$('title').html('Agar - Lb');
$('.leaderboard-panel').html('<style>.leaderboard-panel{width: 155px;height: 335px;}#skinz{display: inline-block;-webkit-box-shadow: 0px 0px 10px 1px #12d10b; -moz-box-shadow: 0px 0px 10px 1px #12d10b; box-shadow: 0px 0px 10px 1px #12d10b;cursor:pointer;width:50px;height:50px;maRgin:5px;border-radius:100000000px;}</style> <div id="skinz" style="opacity: 1;" class="1"></div> <div id="skinz" style="opacity: 1;" class="2"></div> <div id="skinz" style="opacity: 1;" class="3"></div> <div id="skinz" style="opacity: 1;" class="4"></div> <div id="skinz" style="opacity: 1;" class="5"></div> <div id="skinz" style="opacity: 1;" class="6"></div> <div id="skinz" style="opacity: 1;" class="7"></div> <div id="skinz" style="opacity: 1;" class="8"></div> <div id="skinz" style="opacity: 1;" class="9"></div> <div id="skinz" style="opacity: 1;" class="10"</div>');

for (var i = 1; i < 11; i++) {
    if (localStorage.getItem('profile'+i) === null){
    localStorage.setItem('profile'+i, null);
    }
}


    $('.1,.2,.3,.4,.5,.6,.7,.8,.9,.10').on('click',function() {
	var dd = $(this).attr('class');
	var skinzz = JSON.parse(localStorage["profile"+dd]);
			localStorage.setItem('activeprofile', dd);
	$('#clantag').val(skinzz[0]);
	$('#nick').val(skinzz[1]);
	$('#skin').val(skinzz[2]);

	
    
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
    if(f < 1) f = 10;
    if(f > 10) f = 1;
	localStorage.setItem('activeprofile', f);
	
	
	var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);

};
	
	

$('#clantag, #skin, #nick').on("input", function(){
    var p = localStorage.getItem('activeprofile');
	var profile1 = new Array();
	profile1[0] = $('#clantag').val();
	profile1[1] = $('#nick').val();
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
$('.vertical-line').remove();
$('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://imgur.com/3KGFFcj.png">');
$('head').append('<style>.shop-power{float:right;}.agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel{width:100%;}#img, #skinz{background-size: cover !important;}#helloContainer{margin-top: -15px;}#minimap-hud{border: 1px solid rgba(0, 0, 0, 0.15);}.hideskin{backgRound-coloR:#d43f3a !important;border-coloR:#d43f3a !important;cursor: pointer;}.showskin{cursor: pointer;background-color: #024703 !important;border-color: #439a00 !important;}.btn-info{    color: #fff !important; background-color: #1789ec !important; border-color: #0189ff !important;}#helloContainer{opacity: 0.98;}                                                                         #leaderboard-hud h4{font-size:27px;}#mainPanel h1{margin: 5px 0 5PX 0;}.hud, .hud-b{text-align: left !important;}#leaderboard-info{margin-top: 5px;}#main-menu{border-bottom:none !important; }.ogario-yt-panel, #ogario-ad, #version{display:none !important;}.btn-group-justified>.btn, .btn-group-justified>.btn-group{background: rgb(16, 16, 16);color: #adadad;border-color: #1e1d21;}.input-group-addon{background-color: rgba(255, 255, 255, 0.15);border: rgba(255, 255, 255, 0.15);}.menu-tabs li.active{background-color: rgba(0, 0, 0, 0.65);border-radius: 2px;}.menu-tabs .active{color: #87c0d8 !important;}a:focus, a:hover{text-decoration: none;}.menu-tabs{padding: 6px 22px 6px 25px !important;background-color: rgba(255, 255, 255, 0.13);border-top: 7px solid #11cc0a;}.agario-panel, .btn, .form-control, .input-group-addon, .input-group-sm>.input-group-addon{border-radius: 2px;}                            .showskin, .btn-warning, .btn-success{background-color: #024718 !important; border-color: #024718 !important;}.btn-danger, .hideskin{backgRound-coloR: #12d10b!important;border-coloR: #024718 !important;} .btn-info.active, .btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{background-color: #2da162 !important;border-color: #2da162 !important;} .btn-danger.active, .btn-danger.focus, .btn-danger:active, .btn-danger:focus, .btn-danger:hover, .open>.dropdown-toggle.btn-danger, .hideskin:hover{    background-color: #024718 !important;border-color: #12d10b !important;} .btn-shop, .btn-shop:active, .btn-shop:disabled{background-color: #32a5a7 !important;border-color: #009bf9 !important;} .btn-warning.active, .btn-warning.focus, .btn-warning:active, .btn-warning:focus, .btn-warning:hover, .open>.dropdown-toggle.btn-warning, .showskin:hover, .btn-success:hover{background-color: #11cc0a !important;border-color: #11cc0a !important;}.agario-panel{background-color: rgba(33, 45, 37, 0.86);}.agario-panel input, .agario-panel select{background-color: rgba(33, 45, 37, 0.86);width: 76%;border: 1px solid #e0ffdf;}</style>');
$('.party-panel, .agario-party, .agario-party-0, .agario-party-1, .agario-party-2, .agario-party-3, .agario-party-4, .agario-party-5, .agario-party-6, .agario-panel-gifting, .agario-profile-panel').remove();
$('.hud, .hud-b').css('border-radius','0px');
$('h2').remove();
$('#fps-hud').css("bottom", "10px");
$('#fps-hud').css("top", "auto");
$('#autoHideCellsInfo').parent().html('<input type="checkbox" onchange="setSettings(\'autoHideCellsInfo\', $(this).is(\':checked\'));" id="autoHideCellsInfo">Auto hide cells info');

$('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>')

   
    var f = localStorage.getItem('activeprofile');
    var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);	
	$('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="  background: rgba(18, 209, 11, 0.51); width: 400px; height: 200px; bottom: 10px; right: 0px; position: fixed; border-radius: 7px; box-shadow: 0px 0px 25px 0px; padding: 13px; font-weight: 900; color: white; transition: all .10s; ">Ra Clan Teamspeak / Ra.teamspeak.me  | Anjoy  :) <br><br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UC1an0DAaNmcue7IaSfFeflQ" data-layout="full" data-count="default"></div></div>');
    $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://imgur.com/3KGFFcj.png">');

    for (var i = 1; i < 11; i++) {
    	var skinz = JSON.parse(localStorage["profile"+i]);
    	
        if (skinz !== null) {
    	$('.'+i).css("background","url('"+skinz[2]+"')");
        }

        
    }


});