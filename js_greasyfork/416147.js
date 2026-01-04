// ==UserScript==
// @name         FaucetVille.io (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.7
// @description  Auto Roll
// @author       Jadson Tavares
// @match        *://faucetville.io/memberDashboard*
// @match        *://faucetville.io/viewAds*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416147/FaucetVilleio%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416147/FaucetVilleio%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    ///////////////////////////////////////////////

    function ntb(msg){
        $.ajax({
            url:'https://api.telegram.org/bot'+telegram_bot_token+'/sendMessage',
            method:'POST',
            data:{chat_id:chat_id,text:msg},
            success:function(){
                console.log(msg);
            }
        });
    }

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function openWin(hash, duration) {
        var left = (screen.width/2);
        var top = (screen.height/2);
        var popWidth = 800;
        var popHeight = 600;
        var popTop = top - popHeight/2;
        var popLeft = left - popWidth/2;
        if(win && !win.closed){ //checks to see if window is open
            win.focus();
        } else {
            win = window.open('https://faucetville.io/adRedirect?hash='+hash, 'Example_window', 'height=' + popHeight + ',width=' + popWidth + ',resizeable=0, top=' + popTop + ', left=' + popLeft);
            if(typeof win == 'undefined' || win == null) {
                alert('Error! Seems that window is not opening at your device. Please reload this page.');
                return;
            }

            timer = duration;
            activeWindow = true;
            countDown(hash);
            win.focus();
            setTimeout(function(){
                win.close();
            },1000);
        }
    }

    function getSearchParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
        return k?p[k]:p;
    }

    function faucetVille(){
        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                if($('.theme-btn.roll-button').is(':visible')){
                    $('.theme-btn.roll-button').click();
                }
            }
            if($('.result').text().indexOf('0') > -1){
                var success = $('.result').text();
                $('.sidenav__item.sidenav__item2.text-center').load(location.href+" .sidenav__item.sidenav__item2.text-center>*","");
                setTimeout(function(){
                    var b = $('.sidenav__item.sidenav__item2.text-center').text();
                    var balance = b.substr(b.indexOf('0'), 10);

                    window.location.href = "/viewAds?balance="+balance+"&success="+success;
                    
                },1000);
            }
        },random(5000,10000));

        setTimeout(function(){
            if($('.theme-btn.roll-button').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },30000);

        setInterval(function(){
            window.history.go(0);
        },930000);
    }

    function faucetVilleSemCaptcha(){
        setInterval(function(){
            if($('.theme-btn.roll-button').is(':visible')){
                $('.theme-btn.roll-button').click();
            }
            if($('.result').text().indexOf('0') > -1){
                var success = $('.result').text();
                $('.sidenav__item.sidenav__item2.text-center').load(location.href+" .sidenav__item.sidenav__item2.text-center>*","");
                setTimeout(function(){
                    var b = $('.sidenav__item.sidenav__item2.text-center').text();
                    var balance = b.substr(b.indexOf('0'), 10);

                    window.location.href = "/viewAds?balance="+balance+"&success="+success;

                },1000);
            }
        },random(5000,10000));

        setTimeout(function(){
            if($('.theme-btn.roll-button').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },30000);

        setInterval(function(){
            window.history.go(0);
        },930000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://faucetville.io/memberDashboard", "FaucetVille","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,1860000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'faucetville-io';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FAUCETVILLE.IO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("faucetville.io/memberDashboard") > -1) {
        //faucetVille();
        faucetVilleSemCaptcha();
    }

    if (window.location.href.indexOf("faucetville.io/viewAds") > -1) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.innerHTML = `function openWin(hash, duration) {
                           var left = (screen.width/2);
                           var top = (screen.height/2);
                           var popWidth = 800;
                           var popHeight = 600;
                           var popTop = top - popHeight/2;
                           var popLeft = left - popWidth/2;
                           if(win && !win.closed){ //checks to see if window is open
                               win.focus();
                           } else {
                               win = window.open('https://faucetville.io/adRedirect?hash='+hash, 'Example_window', 'height=' + popHeight + ',width=' + popWidth + ',resizeable=0, top=' + popTop + ', left=' + popLeft);
                               if(typeof win == 'undefined' || win == null) {
                                    alert('Error! Seems that window is not opening at your device. Please reload this page.');
                                    return;
                               }

                               timer = duration;
                               activeWindow = true;
                               countDown(hash);
                               win.focus();
                               setTimeout(function(){
                                   win.close();
                               },1000);
                           }
                       }`;
        $("head").append(s);

        setTimeout(function(){
            var adsSize = $('body > section.form-shared > div > div > div > div').find('[onclick]').size();
            $('body > section.form-shared > div > div > div > div').find('[onclick]').each(function(i) {
                var ads = $(this);
                var adsId = ads.attr('id').substr(3);
                ads.attr('onclick', "if (!window.__cfRLUnblockHandlers) return false; openWin('"+adsId+"',10); ");
                setTimeout(ads.trigger.bind(ads, "click"), i * 15000);
            });
            setInterval(function(){
                if(!$('body > section.form-shared > div > div > div > div').find('[onclick]').is(':visible')) {
                    var b = $('.sidenav__item.sidenav__item2.text-center').text();
                    var balance = b.substr(b.indexOf('0'), 10);
                    var message = "FaucetVille.io\n- Sucesso: " + decodeURIComponent(getSearchParams('success')) + " BTC\n- Sua Balança: "+balance+" BTC\n- Saque mínimo: 0.00020000 BTC";
                    ntb(message);
                    setTimeout(function(){
                        window.close();
                        window.location.href = "/memberDashboard";
                    },3000);
                }
            },5000);
            setTimeout(function(){
                if($('body > section.form-shared > div > div > div > div').find('[onclick]').is(':visible')){
                    window.history.go(0);
                }
            },120000);
        },5000);
    }

    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('faucetville-io').classList.add("faucet-active");
    }
})();