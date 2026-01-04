// ==UserScript==
// @name           Virtonomica: Апгрейд оборудования new
// @namespace      virtonomica
// @description    Помощник по апгрейду оборудования
// @version        2.02
// @include        *virtonomic*.*/*/window/unit/equipment/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34399/Virtonomica%3A%20%D0%90%D0%BF%D0%B3%D1%80%D0%B5%D0%B9%D0%B4%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/34399/Virtonomica%3A%20%D0%90%D0%BF%D0%B3%D1%80%D0%B5%D0%B9%D0%B4%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20new.meta.js
// ==/UserScript==

var run = function(){
    var realm = location.pathname.match(/^\/(\w+)\//)[1];
    var unit = location.pathname.match(/\d+$/)[0];
    var total; // всего установлено оборудования
    var cQ;    // текущее качество
    var rQ;    // требуемое качество
    var min = 1000000000;
    var minname;
    var minneed;
    var offer_id;
    var mincell;
    var notfarm=1;
    var notsu=1;
    var notoffice=1;

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    // проверка
    $( 'img[src="/img/unit_types/animalfarm.gif"]' ).each(function(){ // это животноводческая ферма
        notfarm = 0; // таки да
    });

    $( 'img[src="/img/unit_types/restaurant.gif"]' ).each(function(){ // это ресторан
        notsu = 0; // таки да
    });

    $( 'img[src="/img/unit_types/medicine.gif"]' ).each(function(){ // это МЦ
        notsu = 0; // таки да
    });
    $( 'img[src="/img/unit_types/service_light.gif"]' ).each(function(){ // это СУ
        notsu = 0; // таки да
    });
    $( 'img[src="/img/unit_types/fuel.gif"]' ).each( function(){ // это заправка
        notsu = 0; // таки да
    });
    $( 'img[src="/img/unit_types/repair.gif"]' ).each( function(){ // это автосервис
        notsu = 0; // таки да
    });
    $( 'img[src="/img/unit_types/office.gif"]' ).each( function(){ // это СУ
        notoffice = 0; // таки да
    });

    //	if ( !notfarm ) return; // возврат для исключения животноводческих ферм

    var firsttext=$('div.header h3').text();

    var newbut = document.createElement('div');
    newbut.innerHTML = "Апгрейд до кача: ";
    newbut.setAttribute('class','header_up');
    var newinput = document.createElement('input');
    newinput.setAttribute('type','text');
    newinput.setAttribute('value','');
    newinput.setAttribute('style','width:34px');
    newinput.setAttribute('id','header_inp');
    var newbut2 = document.createElement('button');
    newbut2.innerHTML = "Расчитать";
    newbut2.setAttribute('id','header_but');
    var newbut3 = document.createElement('button');
    newbut3.innerHTML = "Выполнить";
    newbut3.setAttribute('id','done_but');
    var newinp = $( 'div.content');
    newinp.prepend(newbut);
    newinp = $( 'div.header_up');
    newinp.append(newinput);
    newinp.append(newbut2);
    newinp.append(newbut3);

    $('#header_but').css('cursor', 'pointer').click(function(){
        var tQ= parseFloat($( '#header_inp' ).prop('value'));
        if (isNaN(tQ)) tQ = 0;
        print_text ('');
        if (tQ <= cQ ){
            print_text (' --> <font color="red"> Запрашиваемое качество ниже текущего</font>');
            return;
        }
        print_text (' --> <font color="red"> Вариантов нет</font>');
        get_var (tQ);
    });

    $('#done_but').css('cursor', 'pointer').click(function(){
        if (minneed === undefined) return;
        if (!confirm('Закупить '+NumFormat(minneed)+'шт на сумму '+NumFormat(min)+'$ у '+minname+'?')) return;
        $.ajax({
            type: 'POST',
            async: false,
            url: location.origin+'/'+realm+'/ajax/unit/supply/equipment',
            data: {
                'amount': minneed,
                'operation': 'terminate',
                'unit': unit
            },
            success: function () {
                $.ajax({
                    type: 'POST',
                    async: false,
                    url: location.origin+'/'+realm+'/ajax/unit/supply/equipment',
                    data: {
                        'amount': minneed,
                        'offer': offer_id,
                        'operation': 'buy',
                        'supplier': offer_id,
                        'unit': unit
                    },
                    success: function () {
                        //location.reload();
                        window.close();
                    }});
            }});
    });

    $( 'div.recommended_quality' ).each( function( ){
        var spans = $( 'span', this );
        cQ = parseFloat( $( '#top_right_quality',this ).text() );					// текущее качество
        rQ = parseFloat( $( spans[1] ).text() ) + 0.01;					// требуемое качество
        total = parseInt( $( '#quantity_corner',this ).text().replace(/[^\d\.]/g,'') ); 	// всего установлено оборудования
        //		if ( !notsu||!notfarm||!notoffice ) total = parseInt( $( spans[2] ).text().replace(/[^\d\.]/g,'') );
    });
    if ( !notsu||!notfarm ) rQ=cQ; // корректировка начальных данных для жив. ферм и СУ
    console.log(notsu+","+notfarm+","+notoffice);
    console.log(rQ);
    console.log('cQ='+cQ);
    console.log(total);
    get_var (rQ);

    //------------------------------------------------------------------------------------------------------------------------------------

    function get_var (qQ){
        if (qQ <= cQ ){
            print_text (' --> <font color="red"> Вариантов нет или апгрейд не требуется</font>');
            return;
        }
        get_nul (); // очищаем изменения при повторном расчете

        min=10000000000;
        $( '#mainTable tr[class]' ).each(function(){
            if ($( this ).attr( 'id' )[0] != 'r') return;

            var cells = $( 'td', this );
            var offer = parseInt( $(cells[2]).text().trim().replace(/[^\d\.]/g,'') );
            var price = parseFloat( $( cells[6] ).text().replace(/[^\d\.]/g,'') );
            var qual = parseFloat( $( cells[7] ).text() );
            if ( isNaN(price) || isNaN(qual) ) return;
            if ( qual < qQ ) return;
            var need = Math.ceil( total * ( qQ - cQ )/( qual - cQ ) );

            if ( offer < need ) return;

            var cost = Math.round( need * price );

            if ( cost < min ){
                min = cost;
                minname = $( cells[0] ).text();
                mincell = cells[0];
                minneed = need;
                offer_id = $( cells[0] ).parent().find('.pseudolink').attr('id');
            }
            cells[0].innerHTML = cells[0].innerHTML + '<div class=upgrade style="color: grey"><nobr>' +
                NumFormat( need ) + ' (' +  NumFormat( cost ) + '$)</nobr></div>';
        });
        //	if ( min < 10000000000 ){
        mincell.innerHTML = '<img src="/img/supplier_add.gif"> '  + mincell.innerHTML;
        print_text (' --> <font color="green">' + minname + ' --> ' + NumFormat( minneed ) + 'шт (' +  NumFormat( min ) + '$)</font>');
        //	}
    }

    //------------------------------------------------------------------------------------------------------------------------------------
    function get_nul (){
        $( 'div.upgrade').each(function (){
            $( this).detach(); // удаляем данные предыдущего расчета
        });
        $( 'td.text_to_left > img').each(function (){
            $( this).detach(); // удаляем машинку из предыдущего расчета
        });
    }

    function print_text (ttext){
        $( 'div.header h3').each(function(){
            this.innerHTML = firsttext + ttext;
        });
    }

    function NumFormat( N ){
        var res = '';
        N = N.toString();
        for (var i=0, j=N.length; i<j; i++)
        {
            if (i%3 === 0 && i !== 0)
                res = ' ' + res;
            res = N.substr(j-1-i, 1) + res;
        }
        return res;
    }
};

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
