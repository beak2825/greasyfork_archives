// ==UserScript==
// @name        Ordens de Defesa - MoD ePortuguês
// @namespace   Ministério de Defesa de ePortugal
// @include     /^.*\.erepublik\.com/..$/
// @version     6.1
// @description	Plugin feito pelo Ministério da Defesa ePortuguês, para divulgar todas as batalhas importantes em que ePortugal está a lutar.
// @downloadURL https://update.greasyfork.org/scripts/12252/Ordens%20de%20Defesa%20-%20MoD%20ePortugu%C3%AAs.user.js
// @updateURL https://update.greasyfork.org/scripts/12252/Ordens%20de%20Defesa%20-%20MoD%20ePortugu%C3%AAs.meta.js
// ==/UserScript==
// Feito por: Ptwonder, jotapelx e Nuno Correia
// Gráficos: Marta Li
// Revisão: Thydan, GossypPT e MadDealer
// Revisão2: Thydan e Andre3567
// Ultimo update: 07/09/2015
function GM_wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
        window.setTimeout(GM_wait, 100);
    }
    else {
        $ = unsafeWindow.jQuery;

        // Code here
        if(document.getElementById('homepage_feed') == null) {
            return;
        }

        GM_xmlhttpRequest({
            url: 'https://docs.google.com/spreadsheets/d/1mjAoOjBgsQd1OuTB8YRVWtzAvUfwgDFYKDqkP2OCUCo/pub?gid=0&single=true&range=a1&output=tsv',
            method: 'GET',
            //			headers: {
            //				'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            //				'Accept': 'application/json',
            //			},
            onload: function(response) {
                $(document).ready(function() {
                    var orders = '<div id="mon_orders" style="text-align: center" />';			
                    $('#battle_listing').prepend(orders);
                    var battles = $.parseJSON(response.responseText);
                    var imageHeader = "http://i243.photobucket.com/albums/ff106/swtlittlethydan/G5TSHE6.png";

                    $('#mon_orders').append('<img class="mon_orders_block" src="'+ imageHeader + '" style="float: none; margin-top:0px; margin-bottom:-3px"/>');

                    if(GM_getValue('ordens')=='activas'){
                        $('#mon_orders').append('<div id="mon_orders_content"/>');
                    }
                    else{
                        $('#mon_orders').append('<div id="mon_orders_content" style="display: none"/>');
                    }

                    for(var i in battles) {
                        var battle = battles[i];
                        var url = battle['url'];
                        var image;
                        var regiao;
                        var cor;

                        if (i==10){
                            image = battle['image'];
                            image = 'http://i243.photobucket.com/albums/ff106/swtlittlethydan/G0bO0.png';
                            $('#mon_orders_content').append('<font face="Cambria"><a target="_blank" href="' + url + '" style="margin: auto; display: block; font-size:36px;"><img src="'+ image + '" style="margin-top:0;"/></a></font><br/>');
                        } else if(i<5){
                            image = battle['image'];
                            regiao = battle['regiao'];
                            cor = battle['prioridade'];
                            if(image==''){
                                $('#mon_orders_content').append('<font face="Arial Narrow"><a target="_blank" href="' + url + '" style="padding-top: 12px; padding-bottom: 58px ; margin-top: 0px; margin-bottom: 0px; margin-left: auto; margin-right: auto ; color: white ;background-color:'+cor+'; text-align: center;display: block; font-size:17pt;">'+regiao+'</a></font>');
                            }
                            else{
                                $('#mon_orders_content').append('<font face="Arial Narrow"><a target="_blank" href="' + url + '" style="padding-top: 12px; padding-bottom: 58px ; margin-top: 0px; margin-bottom: 0px; margin-left: auto; margin-right: auto ; color: white ;background: url('+image+'); text-align: center;display: block; font-size:17pt;">'+regiao+'</a></font>');
                            }

                        } else {
                            image = battle['image'];
                            regiao = battle['regiao'];
                            cortemp = battle['prioridade'];
                            cor = battle['prioridade'];

                            if(image==''){
                                $('#mon_orders_content').append('<font face="Arial Narrow"><a target="_blank" href="' + url + '" style="padding-top: 17px; padding-bottom: 24px ; margin: auto; color: white ;background-color:' +cor+ '; text-align: center;display: block; font-size:14pt;">'+regiao+'</a></font>');
                            }
                            else{
                                $('#mon_orders_content').append('<font face="Arial Narrow"><a target="_blank" href="' + url + '" style="padding-top: 17px; padding-bottom: 24px ; margin: auto; color: white ;background: url('+image+'); text-align: center;display: block; font-size:14pt;">'+regiao+'</a></font>');
                            }
                        }
                    }

                    var imagehided = 'http://i243.photobucket.com/albums/ff106/swtlittlethydan/qiCLU.jpg';

                    if(GM_getValue('ordens')=='activas'){
                        $('#mon_orders').append('<img id="mon_orders_hided" class="mon_orders_block" src="'+ imagehided + '" style="display:none; margin-top: -1px;margin-left: 1px;"/><br/>');
                    }
                    else{
                        $('#mon_orders').append('<img id="mon_orders_hided" class="mon_orders_block" src="'+ imagehided + '" style="margin-top: -1px;margin-left: 1px;"/><br/>');
                    }                    

                    $(".mon_orders_block").click(
                        function(){
                            if(GM_getValue('ordens')=='activas')
                                GM_setValue('ordens','inactivas');
                            else
                                GM_setValue('ordens','activas');

                            $('#mon_orders_content').slideToggle('slow', function() {
                                $('#mon_orders_hided').slideToggle('slow');
                            });
                        }
                    );

                });
            },
            onerror: function() {
                alert('Não está a funcionar');
            }
        });
    }
}
GM_wait();