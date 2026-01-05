// ==UserScript==
// @name            OndeTemBanrisul
// @namespace       http://stackoverflow.com/users/982924/rasg
// @author          RASG
// @description     Mostra em um mapa no site do Banrisul onde ficam as agencias bancarias
// @require         http://code.jquery.com/jquery.min.js
// @require         https://maps.google.com/maps/api/js?sensor=false&region=BR&callback=initialize
// @require         https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=5802
// @include         http*://*banrisul.com.br/bob/link/bobw00hn_onde_tem_banrisul.aspx?secao_id=111*
// @version         2012.11.13
// @downloadURL https://update.greasyfork.org/scripts/2207/OndeTemBanrisul.user.js
// @updateURL https://update.greasyfork.org/scripts/2207/OndeTemBanrisul.meta.js
// ==/UserScript==

/*
    ----------------------------------------------------------------------------
    METODO DE CARREGAMENTO DO JQUERY (metodo_JQ):
    
    1 = usar o @require do greasemonkey
    2 = carregar o script de jquery.com e inserir na pagina
    
    Tente usar primeiro o metodo padrao (1) que e mais rapido
    Caso o script nao funcione, altere para (2)
    Se ainda assim nao funcionar, informe na pagina do script em userscripts.org
    ----------------------------------------------------------------------------
*/

if (window.$ == undefined) { metodo_JQ(1) }
else { $ = window.$ }

var ArrCoord = [];
var ArrAdrress = [];

$(window).load(function(){

    var DIVmapa = document.createElement('div');
        DIVmapa.id = 'DIVmapa';
        DIVmapa.style.border = '2px coral solid';
        DIVmapa.style.cursor = 'pointer';
        DIVmapa.style.display = '';
        DIVmapa.style.height = '80%';
        DIVmapa.style.margin = '1';
        DIVmapa.style.overflow = 'hidden';
        DIVmapa.style.position = 'fixed';
        DIVmapa.style.padding = '1';
        DIVmapa.style.right = '1%';
        DIVmapa.style.top = '1%';
        DIVmapa.style.width = '35%';
        DIVmapa.style.zIndex = '998';

    var DIVinterna = document.createElement('div');
        DIVinterna.id = 'DIVinterna';
        DIVinterna.style.height = '100%';
        DIVinterna.style.width = '100%';
        DIVinterna.style.zIndex = '999';

    var DIVendereco = document.createElement('div');
        DIVendereco.id = 'DIVendereco';
        DIVendereco.style.border = '1px pink solid';
        DIVendereco.style.zIndex = '997';

    $(DIVmapa).append(DIVendereco)
    $(DIVmapa).append(DIVinterna)
    $(DIVmapa).appendTo('body')

    $('#ctl00_ctl00_ExtraConteudo03_ExtraConteudo03_listaAg tr[class!=linhaHeader]').each(function(index) {
        var ag = $.trim( $(this).children().filter('.colunaNome.itemEsquerda').text() );
        var cod = $.trim( $(this).children().filter('.colunaCodInternet.item.posicao').text() );
        var cidade = ' ' + $.trim( $('#ctl00_ctl00_Conteudo_MainContent_lblCidadeSelecionada').text() );
        var rua = $(this).children().filter('.colunaEndereco.item').text().replace(/(.*?\d*[^\D])/gi, '$1');
        var endereco = $.trim( rua.replace(/\s{2,}/g, ' ') ) + cidade;
        var fone = $.trim( $(this).children().filter('.colunaFone.item').text() );

        ArrAdrress.push(endereco)
        //console.log('adicionado ao ArrAdrress : ' + endereco)
    })
    
    metodo_Gmaps(2);

});

initialize = setTimeout(function () {

    google = unsafeWindow.google;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();

    var DetectedPosition = function(position) {
        var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        addMarker(userLatLng, 'Detected location')
    }

    var PortoAlegre = new google.maps.LatLng(-30.034176,-51.229212);
    
    var myOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: PortoAlegre
    }
    
    map = new google.maps.Map(document.getElementById("DIVinterna"), myOptions);
    navigator.geolocation.getCurrentPosition(DetectedPosition);

    for (var i = 0; i < ArrAdrress.length; i++) {
        window.setTimeout( trap(geocodificar, [i, ArrAdrress, ArrCoord]), [i]*1000 )
    }
    
    /*
    for (i = 0; i < ArrCoord.length; i++) {
        var LatiLongi = new google.maps.LatLng(ArrCoord[i][1], ArrCoord[i][2])
        var PlaceName = ArrCoord[i][0]
        addMarker(LatiLongi, PlaceName)
    }
    */
    
    for (var x = 0; x < ArrCoord.length; x++) {
        console.log( 'ArrCoord : ' + ArrCoord[x] )
    }    

}, 1000);

function geocodificar(i, ArrAdrress, ArrCoord) {
    geocoder.geocode({ 'address': ArrAdrress[i]}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            addMarker(results[0].geometry.location, 'ponto '+[i])
            ArrCoord.push(results[0].geometry.location)
        }
        else {
            console.log("ERRO no Geocode :  " + status);
        }
    })
    //console.log( 'address no geocoder : ' + ArrAdrress[i] )
}

trap = function (fn, args) {
    return function() {
        return fn.apply(this, args);
    };
};

function addMarker(coord, plcname) {
    var marker = new google.maps.Marker({
        draggable: false,
        map: map,
        position: coord,
        title: plcname
    });
    
    var infowindow = new google.maps.InfoWindow({
        content: '<div class="infodiv">'+plcname+'</div>'
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        //infowindow.setContent(ArrCoord[i][0]);
        infowindow.open(map, marker);
    });
}

function metodo_JQ(metodo){
    JQ    = "http://code.jquery.com/jquery.js";
    JQmin = "http://code.jquery.com/jquery.min.js";

    if (metodo == 2) {
        var script = document.createElement('script');
            script.src = JQmin;
        var head = document.getElementsByTagName("head")[0];
            (head || document.body).appendChild(script);
    };
};

function metodo_Gmaps(metodo){
    API_js_callback = "https://maps.google.com.br/maps/api/js?sensor=false&region=BR&callback=initialize";

    if (metodo == 2) {
        var script = document.createElement('script');
            script.src = API_js_callback;
        var head = document.getElementsByTagName("head")[0];
            (head || document.body).appendChild(script);
    };
};
