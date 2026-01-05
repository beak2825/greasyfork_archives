// ==UserScript==
// @name           iks:virtonomica Квалификация
// @namespace      virtonomica
// @version        0.17
// @description    Показывает сколько осталось дней до роста квалификации
// @include        http*://*virtonomic*.*/*/main/user/privat/persondata/knowledge*
// @include        http*://*virtonomica*.*/*/main/company/view/*/dashboard*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/23537/iks%3Avirtonomica%20%D0%9A%D0%B2%D0%B0%D0%BB%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/23537/iks%3Avirtonomica%20%D0%9A%D0%B2%D0%B0%D0%BB%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F.meta.js
// ==/UserScript==

var strCss = '.skillIks_exit { background: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'><path fill=\'none\' stroke=\'rgb(142,143,143)\' stroke-width=\'2\' d=\'M0,0 L10,10 M0,10 L10,0\' /></svg>") no-repeat;'
            +' position: absolute; top:-5px; right:0; margin:0; padding:0; width:10px; height:10px; border: 4px solid gray; border-radius:50%; font-size:18px; color:darkred; cursor:pointer}'
        +' .skillIks_but { width:90%;  margin-top:10px; color:white; border:1px solid #708090; border-radius: 10px; background: #708090;'
            +' background: linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -webkit-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -moz-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -ms-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -o-linear-gradient(top, #e1e1e1, #708090, #e1e1e1) }'
            +' input[type="color"]{height:18px}'
            +' input[type="color"], select{width:94%}'
            +' input[type="button"], input[type="color"], select{cursor:pointer}',
str = '<div id="skillSettings" style="z-index:999; position:fixed; margin:0 auto; padding:0; display:none; background: #EEE none repeat;'
     +' border: 2px solid #b4b4b4; box-shadow: 0 0 0 2px #708090, 0 0 0 4px #b4b4b4; border-radius:11px;"><div style="position:relative; margin:0; padding:0">'
     +'<h1 style="width:100%; text-align:center">Настройки</h1><table class="qual" style="margin:5px">'

     +'<tr class="qual_item"><td colspan=2>'
       +'<div class="name">Управление</div>'
       +'<div class="graph" style="width:350px">'
          +'<div class="fill1" style="width:53%"></div>'
          +'<div class="fill2" style="width:55%"></div>'
          +'<div class="text">55.44 %<span>рост: 2.40 %</span></div>'
       +'</div>'
     +'</td></tr>'

     +'<tr><td style="width:50%">Цветовая гамма:</td><td style="width:50%">'
         +'<select name="wColor">'
             +'<option value=1>Изменить</option>'
             +'<option value=0>Не изменять</option>'
         +'</select>'
     +'</td></tr>'
     +'<tr><td style="width:50%">Текст квалификации:</td><td style="width:50px">'
         +'<input type="color" name="name" value="#3388ff">'
     +'</td></tr>'
     +'<tr><td style="width:50%">Цвет текста:</td><td style="width:50px">'
         +'<input type="color" name="text" value="#ffffff">'
     +'</td></tr>'
     +'<tr name="topic"><td style="width:46%">Цвет фона:</td><td style="width:50%">'
         +'<input type="color" name="graph" value="#696969">'
     +'</td></tr>'
     +'<tr><td style="width:50%">Цвет квалификации:</td><td style="width:50%">'
         +'<input type="color" name="fill1" value="#3388FF">'
     +'</td></tr>'
     +'<tr name="user"><td style="width:50%">Цвет за пересчет:</td><td style="width:50%">'
         +'<input type="color" name="fill2" value="#7fb4ff">'
     +'</td></tr>'
     +'<tr><td style="width:50%">Подсказки в блоках:</td><td style="width:50%">'
         +'<select name="signature">'
             +'<option value=0>Не скрывать</option>'
             +'<option value=1>Только первая</option>'
             +'<option value=2>Все скрыть</option>'
         +'</select>'
     +'</td></tr>'
     +'<tr name="user"><td style="width:50%">Цвет подсказки в блоках:</td><td style="width:50%">'
         +'<input type="color" name="header2" value="#a0a0a0">'
     +'</td></tr>'
     +'<tr><td align="center" style="width:50%"><input type="button" value="По умолчанию" class="skillIks_but" name="skillDefault_but"></td>'
     +'<td align="center" style="width:50%"><input type="button" value="Сохранить" class="skillIks_but" name="skillIks_but"></td></tr>'
     +'</table>'
     +'<div id="skillExitBloc" title="Закрыть" class="skillIks_exit"></div>'
     +'</div></div>',

run = function(){
    $ = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window).$;

    if(window.location.pathname.indexOf('privat/persondata/knowledge') + 1) {
        $('h3.avaliable_point').prepend('<table id="tabSkill" style="width:100%"><tr><td style="width:50%"></td><td style="width:50%"></td></td></td>');
        $('#tabSkill td:first').append( $('div.info').css('width', '100%') );
        $('#tabSkill td:last').append( $('div.more').css({'float':'right', 'width':'100%'}) );
        $('#tabSkill div.more > .qual_button').remove();
    }

    var ob = null;
    if( window.localStorage.getItem('skillSettings') ) {
        ob = JSON.parse( window.localStorage.getItem('skillSettings') );
        if(window.location.pathname.indexOf('privat/persondata/knowledge') + 1) {
            if(ob.signature == 1) $('tr:contains("Квалификация + бонус"):not(:first)').css('display', 'none');
            else if(ob.signature == 2) $('tr:contains("Квалификация + бонус")').css('display', 'none');
            $('th.header2' ).css( 'color', ob.c.header2);
        }
        if(ob.c) {
            $('tr.qual_item div.name').css('color', ob.c.name);
            $('tr.qual_item div.text, tr.qual_item span.value > span').css('color', ob.c.text);
            $('tr.qual_item div.graph').css('background-color', ob.c.graph);
            $('tr.qual_item div.fill1, tr.qual_item span.value').css('background-color', ob.c.fill1);
            $('tr.qual_item div.fill2').css('background-color', ob.c.fill2);
        }
        $('tr.qual_item span.value').css('width', '75%');
    }

    $('tr.qual_item').each(function() {
        var n = parseFloat( $(this).find('div.text').html().replace(/<span.*?<\/span>/g,'').replace(/[^\d.]/g, '') ),
            n1 = parseFloat( $(this).find('div.text > span').html().replace(/[^\d.]/g, '') ),
            t = 'Всего: ' + n.toFixed(2) + ' %';
        if(n1) {
            var n2 =  Math.floor( (100-n)/n1 );
            t += '\n\nРост квалификации\n\nЗа пересчет: ' + n1.toFixed(2) + ' %\nОсталось дней: ' +  n2;
            $(this).find('div.text > span').html( $(this).find('div.text > span').html().replace('за пересчёт', 'рост') + ' / ' + (n2<1 ? 1 : n2) + ' д' );
        }
        $(this).find('td.graph_col').attr('title', t);
    });
//    $('tr.qual_item div.text').html('<b>' + $('tr.qual_item div.text').html() + '</b>'); // откройте если хотите жирным шрифтом

    if(window.location.pathname.indexOf('privat/persondata/knowledge') + 1) {
        $('.qual tr:first > th').append( '<img id="adjustDisplay" src="/img/icon/produce.gif" title="Настроить" style="cursor:pointer; float:right; width:16px; height:16px">' );

        $('#adjustDisplay').click(function() {
            if( ob ) {
                for (key in ob.c) $('#skillSettings input[name="' + key + '"]' ).val( ob.c[key] );
                $('#skillSettings select[name="signature"] > option:nth-child(' + (parseInt( ob.signature ? ob.signature : 0 )+1) + ')').attr('selected', 'selected');
            }
            $('#skillSettings').css('display','block');
        });
        $('div.skillIks_exit').click( function() {
            $('#skillSettings').css('display', 'none');
        });

        $('#skillSettings').css({'top': ($('body').height()/2-$('#skillSettings').height()/2-5) + 'px',
                                 'left': ($('body').width()/2-$('#skillSettings').width()/2-5) + 'px',
                                 'display':'none'});
        $('#skillSettings input[type="color"]').change(function(){
            $('#skillSettings div.' + $(this).attr('name') ).css( ($(this).attr('name') == 'text' || $(this).attr('name') == 'name' ? 'color' : 'background-color'), $(this).val());
        });
        $('#skillSettings select[name="wColor"]').change(function(){
            if( $(this).val() == 0 ) $('#skillSettings input[type="color"]').attr('disabled', 'disabled');
            else $('#skillSettings input[type="color"]').removeAttr('disabled');
        });
        // По умолчанию
        $('#skillSettings input[name="skillDefault_but"]').click( function() {
            $('#skillSettings input[name="header2"]').val('#A0A0A0');
            $('#skillSettings th.header2' ).css( 'color', '#A0A0A0');
            $('#skillSettings input[name="name"]').val('#3388FF');
            $('#skillSettings div.name' ).css( 'color', '#3388FF');
            $('#skillSettings input[name="text"]').val('#ffffff');
            $('#skillSettings div.text' ).css( 'color', '#ffffff');
            $('#skillSettings input[name="graph"]').val('#696969');
            $('#skillSettings div.graph' ).css( 'background-color', '#696969');
            $('#skillSettings input[name="fill1"]').val('#3388FF');
            $('#skillSettings div.fill1' ).css( 'background-color', '#3388FF');
            $('#skillSettings input[name="fill2"]').val('#7fb4ff');
            $('#skillSettings div.fill2' ).css( 'background-color', '#7fb4ff');
        });
        // Сохранить
        $('#skillSettings input[name="skillIks_but"]').click( function() {
            var cOb = null, sig = null;
            if( $('#skillSettings select[name="wColor"]').val() == 1 ) cOb = {'name': $('#skillSettings input[name="name"]').val(),
                                                                              'text': $('#skillSettings input[name="text"]').val(),
                                                                              'graph': $('#skillSettings input[name="graph"]').val(),
                                                                              'fill1': $('#skillSettings input[name="fill1"]').val(),
                                                                              'fill2': $('#skillSettings input[name="fill2"]').val(),
                                                                              'header2': $('#skillSettings input[name="header2"]').val() };
            if($('#skillSettings select[name="signature"]').val() != 0) sig = $('#skillSettings select[name="signature"]').val();
            if(cOb || sig) {
                window.localStorage.setItem('skillSettings',
                                            JSON.stringify( {'c': cOb,
                                                             'signature': sig
                                                            } ));
            } else window.localStorage.removeItem('skillSettings');
            $('#skillSettings').css('display', 'none');
            location.reload();
        });
    }
}

if(window.top == window) {
    if(window.location.pathname.indexOf('privat/persondata/knowledge') + 1) {
        $( '<style/>', {text: strCss } ).appendTo('head');
        $('body').append( str );
    }
    $('head').append( '<script type="text/javascript"> (' + run.toString() + ')(); </script>' );
}