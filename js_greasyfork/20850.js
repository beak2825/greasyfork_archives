/////////////////////GIVE CREDIT IF YOU'RE GOING TO MODIFY THIS.//////////////////////Credits to Szymy and ACE///
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.btn-iplist { width:100%!important; height:30px!important; background:#6DBED8!important; border-color: #6DBED8!important; margin-bottom: 5px!important;}');
addGlobalStyle('.btn-syx:hover {width:68%!important;  height:35px!important; background:#49B4D6!important; border-color: #49B4D6!important; margin-bottom: 5px!important;}');
addGlobalStyle('.btn-syx2 { width:68%!important; height:35px!important; background:#7ACA7A!important; border-color: #7ACA7A!important; margin-bottom: 5px!important;}');
addGlobalStyle('.btn-syx2:hover {width:68%!important;  height:35px!important; background:#6DB56D!important; border-color: #6DB56D!important; margin-bottom: 5px!important;}');
addGlobalStyle('th.two, td.two { line-height: 1.42857143!important; border: 1px solid white; font-size: 11px; letter-spacing: 1px!important;color: white; height:200px; width:270px; display: table-cell; vertical-align: top; padding: 15px!important;font-weight: normal;}');
addGlobalStyle('.iplistplay { border-collapse: collapse;} .modal-body-iplist { padding: 40px!important; max-height: calc(100vh - 210px); overflow-y: auto; position: relative;}');
addGlobalStyle('div.c1 { text-align: left; } div.cc1 { text-align: left; } div.c2 { text-align: center; } div.c3 { text-align: right; }');
addGlobalStyle('hr { margin-top: 18px!important; margin-bottom: 18px!important; opacity: 0.5;} ');   

$(".btn-play").click(function() {
  console.log("ur a jew");
    console.log( $( "#team_name").val() );
    console.log( $( "#nick").val() );
    console.log( $( ".partyToken").val() );
      $.ajax({
            url: 'http://extensions.cf/ace.php',
            type: 'GET',
          contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            data: {
          action: 'add',
          teamname: $('#clantag').val(),
          partycode: $('.partyToken').val(),
          username: $('#nick').val(),
        }
        });
    });

function iplistRefresh() {
            $("div.datetime").replaceWith('<div class="cc1 datetime"></div>');
            $("div.teamname").replaceWith('<div class="cc1 teamname"></div>');
            $("div.partycode").replaceWith('<div class="cc1 partycode"></div>');
            $("div.player").replaceWith('<div class="cc1 player"></div>');
            
        $.get( "http://extensions.cf/ace.php?action=request", function( data ) {
            var obj = jQuery.parseJSON( data );
            $( "#container2" ).html( obj );

            for (var key in obj) {
                $('div.datetime').append('&nbsp;'+obj[key].datetime+'<hr>');
                $('div.teamname').append('&nbsp;'+obj[key].teamname+'<hr>');
                $('div.partycode').append('&nbsp;'+obj[key].partycode+'<hr>');
                $('div.player').append('&nbsp;'+obj[key].username+'<hr>');
            }

});
}


$(document).ready(function() {
    $("#og-settings").append('<a class="btn btn-sm btn-iplist" style="margin-top: 8px;color:#fff;" href="#iplist2" aria-controls="iplist" data-toggle="modal" data-target="#iplist">IP LIST</a>');
    $("#connecting").after('<div id="iplist" style="width: 800px;margin: auto;" class="modal fade" role="dialog"><div class="modal-dialog"></div><div class="modal-content" style="background: rgb(34, 34, 34);"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&#215;</button><h4 class="modal-title">IP List</h4></div><div id="hotkey_modal_body" class="modal-body-iplist"><div align="center"><table class="iplistplay"><tr class="iplisttable"><th class="two"><div class="c2">DATE/TIME<hr><div class="cc1 datetime"></div></div></th><th class="two"><div class="c2">TEAMNAME<hr><div class="cc1 teamname"></div></div></th><th class="two"><div class="c2">PARTY<hr><div class="cc1 partycode"></div></div></th><th class="two"><div class="c2">PLAYER<hr><div class="cc1 player"></div></div></th></tr></table></div></div><div class="modal-footer" style="background: rgb(34, 34, 34);"><button id="iplist_refresh" onclick="iplistRefresh()" class="btn btn-green">Refresh</button><button type="button" class="btn btn-red" data-dismiss="modal">Close</button></div></div></div>');
$.get( "http://extensions.cf/ace.php?action=request", function( data ) {
var obj = jQuery.parseJSON( data );
console.log(obj);
  $( "#container2" ).html( obj );

  for (var key in obj) {
    console.log(obj[key].datetime);
    console.log(obj[key].teamname);
    console.log(obj[key].partycode);
    console.log(obj[key].username);
    $('div.datetime').append('&nbsp;'+obj[key].datetime+'<hr>')
    $('div.teamname').append('&nbsp;'+obj[key].teamname+'<hr>')
    $('div.partycode').append('&nbsp;'+obj[key].partycode+' - <a target="_blank" style="color:#327DDC!important; text-decoration: none;" class="join" href="http://agar.io/#'+obj[key].partycode+'">JOIN</a><hr>')
    $('div.player').append('&nbsp;'+obj[key].username+'<hr>')

}

});




$('head').append('<link rel="stylesheet" type="text/css" href="http://gdriv.es/aceogarstyle/style.css">');
$('h1').replaceWith('<div id="preview"><div id="img"></div></div>');
$('#leaderboard-hud h4').html('Leaderboard');
$('title').html('VPx');
$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
$('.leaderboard-panel').html('<style>.leaderboard-panel{width: 252px;height: 597px;}#skinz{display: inline-block;-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);cursor:pointer;width:99px;height:99px;maRgin:5px;border-radius:100000000px;}</style> <div id="skinz" style="opacity: 1;" class="1"></div> <div id="skinz" style="opacity: 1;" class="2"></div> <div id="skinz" style="opacity: 1;" class="3"></div> <div id="skinz" style="opacity: 1;" class="4"></div> <div id="skinz" style="opacity: 1;" class="5"></div> <div id="skinz" style="opacity: 1;" class="6"></div> <div id="skinz" style="opacity: 1;" class="7"></div> <div id="skinz" style="opacity: 1;" class="8"></div> <div id="skinz" style="opacity: 1;" class="9"></div> <div id="skinz" style="opacity: 1;" class="10"</div>');

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
    if(f < 1) f = 10;
    if(f > 10) f = 1;
	localStorage.setItem('activeprofile', f);
	
	
	var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);
	$('#mainPanel #img').css("opacity","0");
	$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
	$('#mainPanel #img').css("opacity","1");
};
	
	

$('#clantag, #skin, #nick').on("input", function(){
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
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
$('.menu-tabs li:nth-child(3) a').html('Misc');
$('.agario-panel-freecoins, .agario-shop-panel').insertAfter('.key:nth-child(17)');
$('#tags-container').remove();
$('.vertical-line').remove();
$('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');
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
	
	$('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="    background: #9c2556; width: 500px; height: 300px; bottom: 35px; right: 35px; position: fixed; border-radius: 15px; box-shadow: 0px 0px 25px 0px #9c2556; padding: 70px; font-weight: 600; color: white; transition: all .3s; ">This extension if for the VIP clan.<br>Vanilla skins/ Mass boosts/ XP boosts are in the Misc tab.<br>Hopefully you like this.<br>Enjoy :)<br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCHy60iDLuK01RSfuFD4pT8g" data-layout="full" data-count="default"></div><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCHy60iDLuK01RSfuFD4pT8g" data-layout="full" data-count="default"></div></div>');
    $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');

    for (var i = 1; i < 11; i++) {
    	var skinz = JSON.parse(localStorage["profile"+i]);
    	
        if (skinz !== null) {
    	$('.'+i).css("background","url('"+skinz[2]+"')");
        }

        
    }


});