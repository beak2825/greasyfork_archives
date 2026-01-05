// ==UserScript==
// @name        auto-ding
// @namespace   test
// @description auto ding tokopedia
// @include     https://www.tokopedia.com/bore-up/*
// @version     1
// @author       panji http://ruangpanji.wordpress.com
// @downloadURL https://update.greasyfork.org/scripts/16560/auto-ding.user.js
// @updateURL https://update.greasyfork.org/scripts/16560/auto-ding.meta.js
// ==/UserScript==
$( document ).ready(function() {
    //check initialisation session storage
    if(typeof sessionStorage.cding=='undefined' || typeof sessionStorage.cding_save=='undefined'){
        sessionStorage.cding='0';
        sessionStorage.cding_save='0';
    }
    if(typeof sessionStorage.crefresh=='undefined')
        sessionStorage.crefresh='0';
 
    //interface
    $html ='<table id="s-show"><tr><td>countdown ding</td><td id="s-minute"></td</tr><tr><td>countdown refresh</td><td id="s-refresh"></td</tr></table>';
    $html =$html+'counter auto ding: <input id="c-ding" type="text" style="width:30px" value="'+sessionStorage.cding_save+'"></input> minute<br>';
    $html =$html+'counter auto refresh: <input id="c-refresh" type="text" style="width:30px" value="'+sessionStorage.crefresh+'"></input> minute<br>';
    $html =$html+'<input id="s-submit" type="button" value="submit"><input id="s-cancel" type="button" value="cancel">';
    $('.span5.product-image-holder').prepend($html);
 
    //check countdown running
    if(sessionStorage.start=='true' && typeof sessionStorage.start !=='undefined'){
        $('#c-refresh').attr('disabled','disabled');
        $('#c-ding').attr('disabled','disabled');
        $('#s-minute').html(sessionStorage.cding);
        $('#s-refresh').html($('#c-refresh').val());
        $('#s-show').show();
        start_ding();
 
    }else{
        $('#c-ding').removeAttr('disabled');
        $('#c-refresh').removeAttr('disabled');
        $('#s-show').hide();
    }
 
    //even if click submit
    $('#s-submit').click(function(){
        $('#c-ding').attr('disabled','disabled');
        $('#c-refresh').attr('disabled','disabled');
        sessionStorage.cding=$('#c-ding').val();
        sessionStorage.cding_save=sessionStorage.cding;
        sessionStorage.crefresh=$('#c-refresh').val();
        sessionStorage.start='true';
        $('#s-minute').html($('#c-ding').val());
        $('#s-refresh').html($('#c-refresh').val());
        $('#s-show').show();
 
        start_ding();
    });
 
    //even if click cancel
    $('#s-cancel').click(function(){
        $('#c-ding').removeAttr('disabled');
        $('#c-refresh').removeAttr('disabled');
        $('#s-show').hide();
        sessionStorage.start='false';
    });
 
    function start_ding(){
        var refresh = sessionStorage.crefresh;
        if(sessionStorage.cding != 0 && sessionStorage.crefresh != 0)
            var counter=setInterval(timer, 60*1000); //1000 will  run it every 1 minute
 
        function timer(){
            if(sessionStorage.start=='true'){
                sessionStorage.cding=sessionStorage.cding-1;
                refresh=refresh-1;
 
                $('#s-minute').html(sessionStorage.cding);
                $('#s-refresh').html(refresh);
                if (sessionStorage.cding <= 0){
                    clearInterval(counter);
                    //counter ended, do something here
                    $("#dink-it").click();
                    //location.reload();
                    return;
                }else if (refresh <=0)
                    location.reload();
                //Do code for showing the number of seconds here
                console.log(sessionStorage.cding+" minute");
            }else{
                clearInterval(counter);
            }
 
        }
    }
 
});