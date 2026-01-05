$(document).ready(function() {
    $('h1').replaceWith('<div id="preview"><img id="img"></img></div>');
    $('#leaderboard-hud h4').html('Go Team ');
    $('title').html('OGARio - GT')
    $('#mainPanel img').src = $('#skin').val();
    $('#skin').keyup(function() {
        $('#mainPanel #img').src = $('#skin').val();
    });
    window.setProfile = function(x) {
        var f = localStorage.getItem('activeprofile');
        if (x === 0) f--;
        if (x === 1) f++;
        if (f < 1) f = 10;
        if (f > 10) f = 1;
        localStorage.setItem('activeprofile', f);
        var data = JSON.parse(localStorage["profile" + f]);
        $('#clantag').val(data[0]);
        $('#nick').val(data[1]);
        $('#skin').val(data[2]);
        $('#mainPanel #img').css("opacity", "0");
        document.querySelector("#mainPanel").querySelector("div").querySelector("div").lastElementChild.querySelector("img").src = document.getElementById("skin").value;
        $('#mainPanel #img').css("opacity", "1");
    };
    $('#clantag, #skin, #nick').on("input", function() {
        var p = localStorage.getItem('activeprofile');
        var profile1 = new Array();
        profile1[0] = $('#clantag').val();
        profile1[1] = $('#nick').val();
        profile1[2] = $('#skin').val();
        localStorage["profile" + p] = JSON.stringify(profile1);
    });
    $('head').append('<style>#top5{font-size: 14px;}#helloContainer{margin-top: -30px;}#mainPanel #img{    -webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);}#minimap-hud{border: 1px solid rgba(0, 0, 0, 0.15);}.hideskin{backgRound-coloR:#d43f3a !important;border-coloR:#d43f3a !important;cursor: pointer;}.showskin{cursor: pointer;background-color: #449d44 !important;border-color: #449d44 !important;}.btn-info{    color: #fff !important; background-color: #428bca !important; border-color: #357ebd !important;}#helloContainer{opacity: 0.96;}                                                                         #leaderboard-hud h4{font-size:27px;}#mainPanel h1{margin: 5px 0 5PX 0;}.hud, .hud-b{text-align: left !important;}#leaderboard-info{margin-top: 5px;}#main-menu{border-radius: 8px ;border-bottom:none !important; }#ogario-ad, #version{display:none !important;}.btn-group-justified>.btn, .btn-group-justified>.btn-group{background: rgb(16, 16, 16);color: #adadad;border-color: #1e1d21;}.input-group-addon{background-color: rgba(255, 255, 255, 0.15);border: rgba(255, 255, 255, 0.15);}#mainPanel #img{transition: opacity .15s;margin: 0 60px;border-radius: 1000px;width:200px;height:200px;}.menu-tabs li.active{background-color: #B71C1C;border-radius: 8px;}a:focus, a:hover{text-decoration: none;}.menu-tabs{padding: 6px 22px 6px 25px !important;border-radius: 8px;    background-color: rgba(255, 255, 255, 0.13); }.agario-panel, .btn, .form-control, .input-group-addon, .input-group-sm>.input-group-addon{border-radius: 4px;}                            .showskin, .btn-warning, .btn-success{background-color: #35a7a5 !important; border-color: #35a7a5 !important;}.btn-danger, .hideskin{backgRound-coloR: #d43a66 !important;border-coloR: #d43a66 !important;} .btn-info.active, .btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{background-color: #2d6ca1 !important;border-color: #2d6ca1 !important;} .btn-danger.active, .btn-danger.focus, .btn-danger:active, .btn-danger:focus, .btn-danger:hover, .open>.dropdown-toggle.btn-danger, .hideskin:hover{    background-color: #af2f53 !important;border-color: #af2f53 !important;} .btn-shop, .btn-shop:active, .btn-shop:disabled{background-color: #32a5a7 !important;border-color: #2f9d9f !important;} .btn-warning.active, .btn-warning.focus, .btn-warning:active, .btn-warning:focus, .btn-warning:hover, .open>.dropdown-toggle.btn-warning, .showskin:hover, .btn-success:hover{background-color: #29878a !important;border-color: #29878a !important;}.agario-panel{background-color: #1a1b25;}.agario-panel input, .agario-panel select{background-color: rgba(255, 255, 255, 0.15);}</style>');
    $('head').append('<style>#Radio{padding-top: 5px;background: #151415;}#mainPanel img{opacity: 1;}</style>');
    $('.agario-panel-gifting').remove();
    $('.hud, .hud-b').css('border-radius', '8px');
    $('h5,#top5').appendTo('#leaderboard-hud')
    $('h2').remove();
    $("h5").text("My Team ");
    $("h5").css({ 'font-size': "25px"});
    $("h5").css({  'text-align': "center" });
    $("#ogario-party")
        .appendTo(".agario-profile-panel");
    $('#fps-hud').css("bottom", "10px");
    $('#fps-hud').css("top", "auto"); 
    $('#minimap-hud').css( 'bottom', "30px");
    $('.party-panel').remove('')
     $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');
    $("#mainPanel").after('<a target="_blank" style="text-align: center" href="https://twitter.com/GoFran1026"><h1>Twitter Go Team </h1></a>')
    $(".agario-profile-panel").after('<script src="https://apis.google.com/js/platform.js"></script> <div class="agario-panel agario-side-panel vungo-yt-panel" style="margin: 10px 2px; float: right;"><div class="g-ytsubscribe" data-channelid="UCPDEmCf3J1AYdEB7ebCUiXQ" data-layout="full" data-theme="dark" data-count="default"></div></div>')
    $('.vungo-yt-panel').append('<br><br><button type="button" id="hideshowmore" class="hideshowmore " value="hide/show"style=" background-color: #4CAF50;border: none;color:white;padding: 8px 60px;text-align: center;text-decoration: none;display: inline-block;font-size: 13px;border-radius: 4px;border: 0px solid #F51F1F;">Show More </button>')
    $(".vungo-yt-panel").after('<div class="agario-panel agario-side-panel more style="margin: 10px 2px; float: right;"></div>')
    $('.more,.progress-bar-text,.progress-bar-star,.agario-exp-bar').hide('')
    $('.agario-shop-panel,.agario-panel-freecoins').appendTo(".agario-panel.agario-side-panel.more")
    $('.ogario-yt-panel').remove('')
     $('.agario-profile-picture,.agario-profile-name-container').remove('')
});
 $(document).ready(function() {
    $('#hideshowmore').on('click', function(event) {
        $('.more,.progress-bar-text,.progress-bar-star,.agario-exp-bar').toggle('show');
    });
    $('#hideshowmore').click(function() {
    var $this = $(this);
    $this.toggleClass('#hideshowmore');
    if ($this.hasClass('#hideshowmore')) {
        $this.text('Hide');
    } else {
        $this.text('Show More');
    }
    });
    $('<div onclick="setProfile(1);" id="arrowR" style="    background: url(\'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TriangleArrow-Right.svg/461px-TriangleArrow-Right.svg.png\') no-repeat; background-size: contain; width: 17px; height: 12px; float: right; margin-top: -30%; margin-right: 20px; cursor: pointer;"></div><div onclick="setProfile(0);" id="arrowL" style="float: left; margin-top: -30%; margin-left: 26px; background: url(\'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/TriangleArrow-Left.svg/461px-TriangleArrow-Left.svg.png\') no-repeat; background-size: contain; width: 17px; height: 12px; cursor: pointer;"></div>').insertAfter('#mainPanel img');
    $('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>')
    var f = localStorage.getItem('activeprofile');
    var data = JSON.parse(localStorage["profile" + f]);
    $('#clantag').val(data[0]);
    $('#nick').val(data[1]);
    $('#skin').val(data[2]);
    document.querySelector("#mainPanel").querySelector("div").querySelector("div").lastElementChild.querySelector("img").src = document.getElementById("skin").value;
    $('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="    background: #9c2556; width: 500px; height: 300px; bottom: 35px; right: 35px; position: fixed; border-radius: 15px; box-shadow: 0px 0px 25px 0px #9c2556; padding: 70px; font-weight: 600; color: white; transition: all .10s ">Cualquier pregunta respecto al mod, hasla saber por Twitter<br>Disfrutarla :)<br><br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCPDEmCf3J1AYdEB7ebCUiXQ" data-layout="full" data-count="default"></div></div>');
});
  var chatovodOnLoad = chatovodOnLoad || [];
    chatovodOnLoad.push(function() {
        chatovod.addChatButton({host: "VunGO.chatovod.com", align: "bottomRight",
            width: 600, height: 380, defaultLanguage: "en"});
    });
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript'; po.charset = "UTF-8"; po.async = true;
        po.src = (document.location.protocol=='https:'?'https:':'http:') + '//a70215964876b3d703af93b4d0e6a3053cf515af.googledrive.com/host/0B07Gb_SdJ0FccnNWa3ZoX2lMNTA/ChatoVod.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();