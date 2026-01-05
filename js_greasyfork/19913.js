// ==UserScript==
// @name         TextBroker
// @version      1.0
// @description  Recherche automatique
// @author       Thathanka Iyothanka
// @include		http*://intern.textbroker.fr/a/openorder-list-categories.php*
// @include		http*://intern.textbroker.fr/a/openorder-show.php*
// @grant        none
// @namespace
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/19913/TextBroker.user.js
// @updateURL https://update.greasyfork.org/scripts/19913/TextBroker.meta.js
// ==/UserScript==

(function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.head.appendChild(script);
}) (function () {
    if (location.href=="https://intern.textbroker.fr/a/openorder-show.php"){
        $('body').append($('<div id="search_info" style="position: fixed; bottom: 0px; right: 0px; visibility: visible; z-index: 1000;background-color:white;border:1px solid black;margin:5px;padding:3px;font-weight:bold;">Redirection automatique...</div>'));
        var audio_player=document.createElement('audio');
        audio_player.innerHTML='<source src="http://s1download-universal-soundbank.com/wav/9762.wav">';
        audio_player.play();
        setTimeout(function(){$('.will_write').click();},10000);
    } else {
        var delay;
        var search_info = $('<div id="search_info" style="position: fixed; bottom: 0px; right: 0px; visibility: visible; z-index: 1000;background-color:white;border:1px solid black;margin:5px;padding:3px;font-weight:bold;"><a href="javascript:void(0)">Démarrer la recherche automatique</a></div>');
        $('body').append(search_info);
        var timer;
        var loop;
        var ajax_hash = location.hash.substr(1);
        if (ajax_hash.indexOf('&=D%C3%A9marrer+la+recherche')!==-1){
            ajax_hash=ajax_hash.substring(0,ajax_hash.indexOf('&=D%C3%A9marrer+la+recherche'))+'&order_by=classification&sort_order=ASC';
        }
        function cnt_down(){
            var val;
            timer = setInterval(function(){
                val = parseInt($('#cnt_down').text());
                if (!isNaN(val)&&val!==0){
                    $('#cnt_down').html(val-1);
                }
            },1000);
        }
        function submit(table){
            clearInterval(timer);
            for (i=0;i<table.length;i++){
                Id=table[i].id;
                $.post("inc/headlines_common/show_headline.php", {id:Id},function(res){$('#search_info').html(res);});
                $('#search_info .will_write').trigger('click');
            }
            cnt_down();
            loop = setInterval(function(){
                search();
            },delay*1000);
        }
        function search(){
            if(ajax_hash !== ''){
                $.get('/a/order-search.ajax.php?' + ajax_hash,{},function(res){
                    var result = document.createElement('div');
                    result.innerHTML=res;
                    var text;
                    if(result.getElementsByClassName('td-a-2')[0]){text = result.getElementsByClassName('td-a-2')[0].innerText.trim();}else{text="";}
                    if (text=="Aucune donnée disponible."){$('#search_info').html('Aucune commande trouvée... <span id="cnt_down">'+delay+'</span>s');}else{$('#search_info').html('<div style="color:green;">Commande(s) trouvée(s)</div>');showLoading_1('output_order_search');$('#output_order_search').html(res);var table = result.getElementsByClassName('headline_prev');submit(table);clearInterval(loop);}
                });
            } else {
                values = getAllForms('search_form');
                var values_str = http_build_query(values, '', '&');
                location.hash = '#' + values_str;
                ajax_hash = values_str;
                if (ajax_hash.indexOf('&=D%C3%A9marrer+la+recherche')!==-1){
                    ajax_hash=ajax_hash.substring(0,ajax_hash.indexOf('&=D%C3%A9marrer+la+recherche'))+'&order_by=classification&sort_order=ASC';
                }
                search();
            }
        }
        function run(){
            var input = parseInt(prompt("Actualiser toutes les.... (secondes)"));
            if (isNaN(input)||(input<1)){
                run();
            }else{
                delay=input;
                search();
                cnt_down();
                loop = setInterval(function(){
                    search();
                },delay*1000);
            }
        }
        $('#search_info a').click(function(){run();});
    }
});