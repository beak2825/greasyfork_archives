// ==UserScript==
// @name         Macro GOLD, BOMB, SPLITS & AUTO SETTINGS FOR AGARIO
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Macro gold, bomb, splits and much more for bomb.agar.bio & agarz.com
// @author       #EMBER (htps://fb.com/embermaxx)
// @match        http://bomb.agar.bio/
// @match        http://agarz.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387927/Macro%20GOLD%2C%20BOMB%2C%20SPLITS%20%20AUTO%20SETTINGS%20FOR%20AGARIO.user.js
// @updateURL https://update.greasyfork.org/scripts/387927/Macro%20GOLD%2C%20BOMB%2C%20SPLITS%20%20AUTO%20SETTINGS%20FOR%20AGARIO.meta.js
// ==/UserScript==

//***NOTE*** CHANGE LINE 126 ('#Legend'); WRITE YOUR OWN NICK instead of '#Legend' (*Don't remove quotes)!!!

(function(){
    'use strict';
    $("body").dblclick(function(){
        if($("#doubleclick_d").is(":checked"))
            keyPress(68);
    });
    $("head").append("<style>.emberstyle a, #nick, #ip_newserver{border-radius:5px;} #fb_id:hover{text-decoration:none;}</style>");
    newIns();
    var interval_gold, interval_bomb, key = false, key2 = false, att=20, X=0, Y=0, k=0, fg=false;
    function keyPress(code)
    {
        $("body").trigger($.Event("keydown", { keyCode: code}));
        $("body").trigger($.Event("keyup", { keyCode: code}));
    }
    function autoSpawn()
    {
        setInterval(function(){
            if($("#overlays").is(':visible') && $("#autorespawnok").is(":checked"))
                $('.btn-play-guest')[0].click();
        },1000)
    }
    function fastGrow()
    {
        $("body").trigger($.Event("keydown", { keyCode: 65}));
        $("body").trigger($.Event("keyup", { keyCode: 65}));
    }
    function autoSplit()
    {
        $("body").trigger($.Event("keydown", { keyCode: 32}));
        $("body").trigger($.Event("keyup", { keyCode: 32}));
    }
    function newIns()
    {
        var instr = document.getElementById("instructions");
        instr.style.lineHeight = "1.15";
        instr.style.fontSize = "14px";
        instr.style.marginTop = "-30px";
        instr.style.color = "white";
        instr.innerHTML +='<center><span> Press <b>Ctrl+Shift+Z</b> for auto settings / <b>ACTIVATION</b></span><br>'+
            '<span> Mouse <b>Double click</b> to eject bomb</span><br>'+
            '<span> Press <b>Q</b> for slow macro gold</span><br>' +
            '<span> Press <b>F</b> to freeze movement</span><br>'+
            '<span> Press <b>S</b> for fast macro gold</span><br>' +
            '<span> Press <b>R</b> for macro bombs</span><br>' +
            '<span> Press <b>4</b> to split 4x times</span><br>'+
            '<span> Press <b>3</b> to split 3x times</span><br>'+
            '<span> Press <b>2</b> to split 2x times</span></center>'
    }
    $(document).on('keydown',function(e){
        // Doublesplit -> key2
        if (e.keyCode == 50)
        {
            autoSplit();
            setTimeout(autoSplit, att);
        }
        // Triplesplit -> key3
        else if (e.keyCode == 51)
        {
            autoSplit();
            setTimeout(autoSplit, att);
            setTimeout(autoSplit, att*2);
        }
        // Tricksplit -> key4
        else if(e.keyCode == 52)
        {
            autoSplit();
            setTimeout(autoSplit, att);
            setTimeout(autoSplit, att*2);
            setTimeout(autoSplit, att*3);
        }
        //Freeze -> F
        else if (e.keyCode == 70)
        {
            X = window.innerWidth/2;
            Y = window.innerHeight/2;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        }
        // Play -> P
        else if(e.keyCode == 80 && !$("#nick, #ip_newserver, #chat_textbox").is(":focus"))
        {
            $('.btn-play-guest')[0].click();
            $("#overlays").css("display","none");
        }
        //Macro Gold [Slow] -> Q
        if(e.keyCode == 81)
        {
            if(key)return;
            key = true;
            interval_gold = setInterval(function() {
                keyPress(65);
            }, 10);
        }
        //Macro Bomb -> R
        else if(e.keyCode == 82)
        {
            if(key2)return;
            key2 = true;
            interval_bomb = setInterval(function() {
                keyPress(68)
            }, 100);
        }
        //Macro Gold [Fast] -> S
        else if (e.keyCode == 83)
        {
            if(fg)return;
            fg = true;
            for(var t=0;t<160;t++){
                setTimeout(fastGrow, t/2);
            }
        }
        //=============================== Auto Settings =====================================
        else if(e.keyCode == 90 && e.shiftKey && e.ctrlKey){
            $('#nick').val('#Legend'); //Your nick here
			$('#close_chatfull').click(function(){$(this).fadeOut("fast");});
            autoSpawn(true); // Auto Spawn Function
            setDarkTheme(true); //Dark theme: true
            setSmooth(true); //Smooth render: true
            setSkins(false); //Skins: false
            $('#screenshot, #account_button, .controls, #klan, #level, #stats, .tosBox').remove();
            $("#gamemode").replaceWith(
                '<div align="center" class="emberstyle"><a onclick="reconnect()" class="btn btn-info reconnnect">Reconnect</a>&nbsp;<a onclick="doubleplay()"'+
                ' class="btn btn-success">Force Play</a>&nbsp;<a onclick="agarmen()" class="btn btn-default">Agarmen</a>&nbsp;'+
                '<div style="margin-top:4px;"><input type="text" style="width: 73%;float: left; text-align:center; "'+
                ' class="form-control" placeholder="Server IP:Port" id="ip_newserver" value="37.187.76.129:2401"/>&nbsp;<a onclick="connect2newserver();"'+
                ' class="btn btn-danger btn-md" style="float:right;">Connect</a></div></div>');
            $(".adsbygoogle").replaceWith('<div id="agarmenlogo"><center><h3 id="hello_agarmen">Script By</h3> <a href="https://fb.com/agarmencom" id="fb_id" target="_blank"><img style="border-radius:15px;" width="250px" src="https://i.ibb.co/MndMtfg/37672620-439419809873842-1832906069848883200-n.jpg"/></a></center><br></div>');
            $("#chat_textbox").after('<a style="position:fixed;bottom:7px;left:24%; border-radius:5px;" onclick="$("#emojidiv").toggle();" class="btn btn-default" data-toggle="modal" data-target="#bilgilerModal">Emoji</a>');
            $("#bilgilerModal").html('<div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header">Emoji<button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><h3>'+
                                     '<button></button>&nbsp;<button></button>&nbsp;<button></button>&nbsp;<button></button>&nbsp;<button></button>&nbsp;</h3></div></div></div>');
            $('.btn-play-guest').text('PLAY [P]');
            $('.btn-spectate').text('Spectate');
            $('.row div.col-sm-6').eq(5).html('<label><input type="checkbox" id="doubleclick_d"><span>Bomb on double click</span></label>');
            $('.row div.col-sm-6').eq(6).html('<label><input type="checkbox" onchange="setChatHide($(this).is(\':checked\'));"><span>Hide chatbox</span></label>');
            $('.row div.col-sm-6').eq(6).after('<div class="col-sm-6"><label><input type="checkbox" onclick="alertAutoRespawn();" id="autorespawnok"><span>Auto Respawn</span></label></div>');
            $('.row div.col-sm-6').eq(7).after('<div class="col-sm-6"><label><input type="checkbox" checked="checked" id="chatlimitalarm"><span>Chat Limit Alarm</span></label></div>');
            $('.row div.col-sm-6').eq(8).after('<div class="col-sm-6"><label><input type="checkbox" onchange="setAmenLogo($(this).is(\':checked\'));" checked="checked" id="showamenlogo"><span>Show Agarmen Logo</span></label></div>');
            $('.row').last().after('<br>');

            $("#chat_textbox").attr("maxlength","70");
            $("#loginModal div.modal-content").replaceWith('<div class="modal-header">'+
                                                           '<button type="button" id="close_chatfull" class="close" data-dismiss="modal">&times;</button><h1 style="text-align:center;color:#FF0000;" class="modal-title">Hmmm..<br> Chat is full!</h1></div>');

        }
        //==============EO Auto Settings=================
    })
    // ==============Append Functions==============
    $("body").append("<script>function setAmenLogo(perm){$('#agarmenlogo').toggle();}function alertAutoRespawn(){if(!confirm('***NOTE / CONFIRM*** AUTO RESPAWN MODE IS GOING TO BE ENABLE! During game process: PRESS [C] to DISABLE!')){$('#autorespawnok').attr('checked',false)};}function connect2newserver(){setServer(document.getElementById('ip_newserver').value);}function doubleplay(){$('.btn-play-guest')[0].click(); setTimeout(function(){$('.btn-play-guest')[0].click(); },1000)} function agarmen(){window.open('https://fb.com/agarmencom', '_blank');} function reconnect(){setServer('37.187.76.129:2402');$('.reconnnect').text('Connecting...');setTimeout(function(){setServer('37.187.76.129:2401');$('.reconnnect').text('Reconnect')},500)}</script>");
    // ============================================

    $(document).on('keyup',function(e){
        //Stops <Q>
        if(e.keyCode == 81)
        {
            key = false;
            clearInterval(interval_gold);
            return;
        }
        //Stops <R>
        else if (e.keyCode == 82)
        {
            key2 = false;
            clearInterval(interval_bomb);
            return;
        }
        //Stops <S>
        else if (e.keyCode == 83)
        {
            fg = false;
            return;
        }
        //Stops "Auto Respawn"
        else if(e.keyCode == 67)
        {
            $("#autorespawnok").attr('checked', false);
        }
        if($("#chat_textbox").is(":focus") && $("#chat_textbox").val().length > 69) // Chat textbox limit
        {
            if($("#chatlimitalarm").is(":checked")){
                $("#loginModal").modal('show');
                setTimeout(function(){
                    $("#loginModal").modal('hide');
                },1E3)
            }
        }
    })
    //Script by #EMBER (https://fb.com/embermaxx)
})();
