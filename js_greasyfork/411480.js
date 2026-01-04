// ==UserScript==
// @name         Беер.рф - чат
// @namespace    https://беер.рф/
// @version      0.15
// @description  Чат
// @match        http*://xn--90aia8b.xn--p1ai/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411480/%D0%91%D0%B5%D0%B5%D1%80%D1%80%D1%84%20-%20%D1%87%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/411480/%D0%91%D0%B5%D0%B5%D1%80%D1%80%D1%84%20-%20%D1%87%D0%B0%D1%82.meta.js
// ==/UserScript==

var str = '<style>'
                + 'div#TopChat { position:fixed; margin:0; padding:0; top:10px; left: 5px;'
                             + ' max-width:450px; min-width:200px; width: 14%; height: 15%;'
                             + ' border: 1px'
                + ' }'
        + '</style>'
        + '<div id="TopChat"><div>',

run = function() {
// Раположение чата на странице
    $( 'div#TopChat table.chatik tbody tr td.gTableTop' ).prepend( '<div id="MoveChat" style=" position:absolute; width:55%; height: 50px; cursor:pointer" title="Переместить">&nbsp;</div>' );
    $( 'div#MoveChat' ).click(function(){
        $('div#TopChat').draggable();
    }).mouseup( function(){
        $('div#TopChat').offset(function(i,val){
            localStorage.setItem('ChatTop',  val.top+'px');
            localStorage.setItem('ChatLeft', val.left+'px');
        });
    });
    if( localStorage.getItem('ChatTop') != null ) {
        $( 'div#TopChat' ).css({
            top:  localStorage.getItem('ChatTop'),
            left: localStorage.getItem('ChatLeft')
        });
    }
// Показ скрытие чата
    $('div#TopChat #chat_open').click(function(){
        if( $( 'div#TopChat #chat_open' ).text() == '+' ) {
            $('div#TopChat #chatbody').css('display', 'block');
            $( 'div#TopChat #chat_open' ).text( '-' );
            localStorage.setItem('ChatOpen',  'block');
        } else {
            $('div#TopChat #chatbody').css('display', 'none');
            $( 'div#TopChat #chat_open' ).text( '+' );
            localStorage.setItem('ChatOpen',  'none');
        }
    });
    if( localStorage.getItem('ChatOpen') != null ) {
        if( localStorage.getItem('ChatOpen') == 'none' ) {
            $('div#TopChat #chatbody').css('display', 'none');
            $( 'div#TopChat #chat_open' ).text( '+' );
        } else if( localStorage.getItem('ChatOpen') == 'block' ) {
            $('div#TopChat #chatbody').css('display', 'block');
            $( 'div#TopChat #chat_open' ).text( '-' );
        }
    }
// Количество введеных символов
    $('div#TopChat form#MCaddFrm td:contains("Допустимое количество символов")').remove();
    $('div#TopChat #MCaddFrm table tbody tr:nth-child(1) > td:nth-child(1)').attr('width', '33%');
    $('div#TopChat #MCaddFrm table tbody tr:nth-child(1) > td:nth-child(2)').attr('width', '33%');
    $('div#TopChat form#MCaddFrm td:contains(Сообщение:)').after('<td id="ChatLengthText" style="width:34%; text-align:center; color:DarkGreen">0 / 500</td>');
    $('div#TopChat #mchatMsgF').attr('maxlength', 500);
    $('div#TopChat #mchatMsgF').keyup(function(){
        var number = $('div#TopChat #mchatMsgF').val().length;
        $('div#TopChat #ChatLengthText').text(number+' / 500');
        if( number > 450 )
            $('div#TopChat #ChatLengthText').css('color', 'DarkRed');
        else if( number > 400 )
            $('div#TopChat #ChatLengthText').css('color', 'Red');
        else
            $('div#TopChat #ChatLengthText').css('color', 'DarkGreen');
    });
//----------------------------------------------------------
//    $( "#div#TopChat" ).resizable();
};

if(window.top == window)
{
    $('head').append( '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>' );
    $('body').append( str );
    $("table.chatik").remove().clone().appendTo('#TopChat');
    $( '<script/>', { text: '(' + run.toString() + ')()' } ).appendTo('head');
}