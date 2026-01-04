// ==UserScript==
// @name       DCF - Shoe feature labelling
// @version    1.6
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @include     https://www.mturkcontent.com/dynamic/*
// @description For the DCF Shoes HITs
// @namespace https://greasyfork.org/users/11205
// @downloadURL https://update.greasyfork.org/scripts/30462/DCF%20-%20Shoe%20feature%20labelling.user.js
// @updateURL https://update.greasyfork.org/scripts/30462/DCF%20-%20Shoe%20feature%20labelling.meta.js
// ==/UserScript==

if ($('td:contains("Shoe feature labelling")').length){
    var image_scaling = 2.0;
    var default_zoom = true;
    var keyboard_active = true;
    var hide_lengthy_descriptions = false;
    var presets = [];
    presets.push(['Athletic', 1,3,1,1,1,1]);
    presets.push(['Not A Shoe', 3,4,4,4,4,6]);

    if (hide_lengthy_descriptions){
        $('option').each(function(){
            $(this).text($(this).text().split(':')[0]);
        });
    }
    var active_row = 0;
    $('td:contains("Common Ambiguities")').wrapInner('<div class="instructions"></div>');
    $(".instructions").before('<button id="toggle" type="button"><span>Show Instructions</span></button>').hide();
    $('#toggle').click(function() {
        $(".instructions").toggle();
        $('#toggle').text() == 'Show Instructions' ? str = 'Hide Instructions' : str = 'Show Instructions';
        $('#toggle span').html(str);
    });  

    $('table:eq(1)').after('<img id="shoeImage" src="' + $('td:contains("Link to shoe image")').next().find('a').attr('href') + '">');
    //$('td:contains("Shoe Orientation (only continue")').html($('td:contains("Shoe Orientation (only continue")').html().replace('Orientation ','Orientation<br>'));
    if (default_zoom){
        $('#shoeImage').load(function(){
            $('#shoeImage').width($('#shoeImage').width()*image_scaling);
            $('#shoeImage').toggleClass('zoomed');
        });
    }

    $('img').click(function(){
        if ($(this).hasClass('zoomed')){
            $(this).width($(this).width ()/image_scaling);
            $(this).toggleClass('zoomed');
        }
        else{
            $(this).width($(this).width ()*image_scaling);
            $(this).toggleClass('zoomed');
        }
    });


    $('table:eq(2) tr:gt(0)').append('<td class="filler"></td>');
    $('.filler').each(function(index){
        var fill_options = [];
        $(this).prev().find('option').each(function(){
            fill_options.push($(this).text().replace(/^\w\)/,'').split(':')[0]);
        });
        $(this).html('<span class="options_list' + index + '">' + fill_options.join('</span> <strong>|</strong> <span class="options_list' + index + '">') + '</span>');
    });
    $('[class^=options_list]').click(function(){
        $(this).parent().prev().find('select')[0].selectedIndex = $(this).parent().find('[class^=options_list]').index($(this));
        $('[class=' + $(this).attr('class') + ']').css('background-color','');
        $(this).css('background-color','lightgreen');
    });
    $('table:eq(2) tr:gt(0)').each(function(){
        $(this).find('span:last')[0].click();
    });
    $('table:eq(2) tr:eq(0) td:last').css('width','50px');

    if (keyboard_active){
        highlightRow(active_row);
        $('.filler').each(function(){
            $(this).find('span').each(function(index){
                $(this).text('(' + (index+1) + ') ' + $(this).text());
            });
        });
        document.addEventListener( "keydown", function(i) {
            var k = i.keyCode;
            if (k == 13 ){
                $('#submitButton').click();
            }
            else if (k > 48 && k < $('[class^=options_list' + active_row + ']').length + 49){
                $('[class^=options_list' + active_row + ']')[k-49].click();
                if (active_row < 5){
                    active_row++;
                    highlightRow(active_row);
                }
            }
            else if (k > 96 && k < $('[class^=options_list' + active_row + ']').length + 97){
                $('[class^=options_list' + active_row + ']')[k-97].click();
                if (active_row < 5){
                    active_row++;
                    highlightRow(active_row);
                }
            }
            else if (k == 38 || k == 109){
                if (active_row > 0){
                    active_row--;
                    highlightRow(active_row);
                }
            }
            else if (k == 40 || k==107){
                if (active_row < 5){
                    active_row++;
                    highlightRow(active_row);
                }
            }
            else if (k == 37){
                if ($('select')[active_row].selectedIndex > 0){
                    $('[class^=options_list' + active_row + ']')[$('select')[active_row].selectedIndex-1].click();
                }
            }
            else if (k == 39){
                if ($('select')[active_row].selectedIndex < $('[class^=options_list' + active_row + ']').length -1){
                    $('[class^=options_list' + active_row + ']')[$('select')[active_row].selectedIndex+1].click();
                }
            }
        } , false);
    }
    if (presets.length){
        var preset_labels = [];
        for (i=0;i<presets.length;i++){
            preset_labels.push(presets[i][0]);
        }

        $('table:eq(2)').before('<h4 style="margin-left:'+($('table:eq(2) td:eq(0)').width() + $('table:eq(2) td:eq(1)').width()+10)+'px;"><span class="presets_list">' + preset_labels.join('</span> | <span class="presets_list">') + '</span></h4>');

        $('[class^=presets_list]').click(function(){
            var index =  $('[class^=presets_list]').index($(this));
            for (i=0;i<6;i++){
                $('select')[i].selectedIndex = presets[index][i+1]-1;
                $('table:eq(2) tr:eq(' +(i+1)+ ') td:last span')[presets[index][i+1]-1].click();
            }
        });
    }
    $('#submitButton').css('margin-left',($('table:eq(2) td:eq(0)').width() + $('table:eq(2) td:eq(1)').width()+10) + 'px');
}

function highlightRow(row_number){
    $('.filler').css('border','');
    $('.filler').eq(row_number).css({'border-style':'solid','border-width':'4px','border-color':'black'});
}
