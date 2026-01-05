// ==UserScript==
// @name            BombManual.com improvements
// @version         1.08
// @description     Improvements for the BombManual
// @author          Hexterity
// @match           http://www.bombmanual.com/manual/1/html/index.html
// @grant           none
// @namespace https://greasyfork.org/users/18430
// @downloadURL https://update.greasyfork.org/scripts/13225/BombManualcom%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/13225/BombManualcom%20improvements.meta.js
// ==/UserScript==

$(document).ready(function () {
    
    $.fn.changeElementType = function(newType) {
        var newElements = [];

        $(this).each(function() {
            var attrs = {};

            $.each(this.attributes, function(idx, attr) {
                attrs[attr.nodeName] = attr.nodeValue;
            });

            var newElement = $("<" + newType + "/>", attrs).append($(this).contents());

            $(this).replaceWith(newElement);

            newElements.push(newElement);
        });

        return $(newElements);
    };
    
    $('body').append('<style>.highlight {background: green} .greyed {background: grey !important} .bold {font-weight: bold} .navigation_item, .sort, .click {cursor: pointer} .center {text-align: center}</style>');
   
    $('<div id="navigation" style="position:fixed;top:16px;left:16px;width: 256px;background:white;border:solid 2px #000;padding:2px"></div>').appendTo('body');
    
    $('.page-header-section-title').each(function () {       
        $('#navigation').append('<a class="navigation_item">' + $(this).html() + '</a><br />');
    });
    
    $('.navigation_item').click(function() {
        navigation_item = $(this).html();
        $('.page-header-section-title').each(function () {
            if (navigation_item == $(this).html()) {                
                $('html, body').animate({
                    scrollTop: $(this).offset().top
                });
            }
        });
    });
  
    $('.keypad-symbol-image').addClass('click').click(function() {
        src = $(this).attr('src');
        if ($(this).parent().hasClass('highlight')) highlight = false;
        else highlight = true;
        $('.keypad-symbol-image').each(function() {
            if (src == $(this).attr('src')) {
                if (highlight) $(this).parent().addClass('highlight');
                else $(this).parent().removeClass('highlight');
            }
        });
        column_highlighted = false;
        for (i = 1; i < 7; i++) {
            count = 0;
            $('body').find('.column_' + i).each(function () {
                if ($(this).hasClass('highlight')) count++;
                if (count == 4) {
                    for (j = 1; j < 7; j++) {
                        if (i != j) $('.column_' + j).addClass('greyed');
                    }
                    column_highlighted = true;
                }
            });
        }
        console.log('column_highlighted', column_highlighted);
        if ( ! column_highlighted) {
            for (i = 1; i < 7; i++) {
                if ($('.column_' + i).hasClass('greyed')) $('.column_' + i).removeClass('greyed');
            }
        }
    });
    
    keypad_column_count = 1;    
    $('body').find('.keypad-table-column').each(function() {
        $(this).addClass('column_' + keypad_column_count);
        keypad_column_count++;
        if (keypad_column_count == 7) keypad_column_count = 1;
    });
    
    $('body').append('<button id="reset_keypad">Reset</button>');
    keypad_table_position = $('.keypad-table').position();
    $('#reset_keypad').offset({top: keypad_table_position.top, left: keypad_table_position.left});
    $('#reset_keypad').click(function() {
       for (i = 1; i < 7; i++) {
           $('.column_' + i).removeClass('greyed').removeClass('highlight');
       }
    });
    
    $('.whos-on-first-step2-table th').each(function () {
        $(this).addClass('bold').changeElementType('td');
    });
    
    $('.whos-on-first-step2-table').css({background: 'white'});
    
    $('.whos-on-first-step2-table tbody').prepend('<tr class="sort"><th>Sort</th><td>Sort</td></tr>');
    
    $('.sort th, .sort td').click(function(){
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc){rows = rows.reverse()}
        for (var i = 0; i < rows.length; i++){table.append(rows[i])}
    })
    
    $('.repeaters-table:eq(1)').after('<div id="simon_says_help" style="margin-top: 8px"><button id="reset_simon_says_help">Reset</button><br /><div id="simon_says_help_list"></div></div>');
    
    $('.repeaters-table td').addClass('click').click(function() {
        console.log($(this).html());
        $('#simon_says_help_list').append($(this).html() + ' ');
    });
    
    $('#reset_simon_says_help').click(function() {
        $('#simon_says_help_list').html('');
    });
    
    $('.red-table td').css({background: '#ffeeee'});
    $('.blue-table td').css({background: '#eeeeff'});
    $('.black-table td').css({background: '#eeeee'});
    
    $('.red-table tr, .blue-table tr, .black-table tr').click(function() {
        $(this).find('td').toggleClass('greyed');
    });
    
    $('.red-table td, .blue-table td, .black-table td').addClass('click');
    
    $('.red-table').prev().before('<button id="reset_sequences">Reset</button>');
    
    $('#reset_sequences').click(function () {
        $('.red-table td, .blue-table td, .black-table td').removeClass('greyed');
    });
    
    $('.password-table').after('<div class="center"><input type="text" id="password_help" /></div>');
    
    $('#password_help').keyup(function() {
        $('.password-table td').removeClass('greyed');
        columns = $(this).val().split(' ');
        $('.password-table td').each(function(key) {
            for (column_key = 0; column_key < columns.length; column_key++) {
                if (columns[column_key].indexOf($(this).html()[column_key]) == -1) $(this).addClass('greyed');
            }
        });
    });
    
    $('.password-table td').addClass('greyed');
    
});

var complicated_red = 0;
var complicated_blue = 0;
var complicated_star = 0;
var complicated_led = 0;

if (document.readyState != 'complete') $(window).load(window_load);
else window_load();
    
function window_load() {
    
    $('svg', $('#vennlegend')[0].contentDocument).find('text').each(function() {
        $(this).attr('text-decoration', 'line-through');
        $(this).click(function() {
            
            if ($(this).attr('text-decoration')) {
                status = 1;
                $(this).removeAttr('text-decoration');
            }
            else {
                status = 0;
                $(this).attr('text-decoration', 'line-through');
            }
            
            button_text = $(this).find('tspan:first').html();
           
            if (button_text == 'Wire has red') complicated_red = status;
            if (button_text == 'Wire has blue') complicated_blue = status;
            if (button_text.indexOf('symbol') > 0) complicated_star = status;
            if (button_text == 'LED is on') complicated_led = status;
            
            array_key = complicated_red.toString() + complicated_blue.toString() + complicated_star.toString() + complicated_led.toString();
            
            complicated_array = {
                '0000': 'C',
                '1000': 'S',
                '0100': 'S',
                '1100': 'S',
                '0010': 'C',
                '1010': 'C',
                '0110': 'D',
                '1110': 'P',
                '0001': 'D',
                '1001': 'B',
                '0101': 'P',
                '1101': 'S',
                '0011': 'B',
                '1011': 'B',
                '0111': 'P',
                '1111': 'D'
            }
            
            $('#venntable td').removeClass('highlight');
            
            $('#venntable td').each(function() {
                if ($(this).html() == complicated_array[array_key]) $(this).addClass('highlight');
            });
            
        });
         
    });
    $('#venntable td:eq(0)').addClass('highlight');
        
}

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).html() }