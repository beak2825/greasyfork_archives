// ==UserScript==
// @name         WaniKani Mini Item Marker
// @namespace    wk_mtm
// @version      0.2
// @description  Another Item Marker for WaniKani
// @author       polv
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36463/WaniKani%20Mini%20Item%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/36463/WaniKani%20Mini%20Item%20Marker.meta.js
// ==/UserScript==

var word = {id: ''};
var marker_array = $.jStorage.get('wk_marker_array', []);
var marked_text = ['Usage', 'Reading'];
var marked_color = ['#CCCCCC', 'green'];
var num_click = 0;
var url = document.URL;

(function() {
    'use strict';
    $('head').append(`<style>
.marked {
	border: solid 5px;
	padding: 4px;
	margin: 4px 4px 0px 4px;
}
.marked-text {
    position : absolute;
    top : -1em;
    right : 0em;
    font-size : 0.2em;
}
.marked-parent {
    position: relative;
    width: 0;
    height: 0;
}
pre{
    -moz-tab-size: 15;
    -o-tab-size:   15;
    tab-size:      15;
}
</style>`);

    if(url.indexOf('review') != -1){
        $('#character span').click(function(){
            word = $.jStorage.get("currentItem");

            if(num_click >= marked_text.length){
                num_click = -1;
                $(this).removeClass('marked');
                $('.marked-parent').remove();
                for(var i=0; i<marked_text.length; i++) {
                    var index_splice = getMarkerIndex(marked_text[i], word);
                    if(index_splice !== -1)
                        marker_array.splice(index_splice,1);
                }
                $.jStorage.set('wk_marker_array', marker_array);
            } else {
                $(this).addClass('marked');
                $(this).css('border-color', marked_color[num_click]);
            }

            if($(this).hasClass('marked')) {
                $('.marked-parent').remove();
                $('.marked').after('<span class="marked-parent"><span class="marked-text">' + marked_text[num_click] + '</span></span>');
                for(var i=0; i<marked_text.length; i++) {
                    var index_splice = getMarkerIndex(marked_text[i], word);
                    if(index_splice !== -1)
                        marker_array.splice(index_splice,1);
                }
                marker_array.push([marked_text[num_click], word]);
                $.jStorage.set('wk_marker_array', marker_array);
            }
            num_click++;
        });

        $.jStorage.listenKeyChange('currentItem', function(key) {
            if(markedWord($('#character span:first').text())){
                $('.marked-parent').remove();
                num_click = marked_text.indexOf(markedWord($('#character span:first').text()));
                $('#character span').css('border-color', marked_color[num_click]);
                $('#character span').addClass('marked');
                $('.marked').after('<span class="marked-parent"><span class="marked-text">' + marked_text[num_click] + '</span></span>');
            }
            else {
                num_click = 0;
                $('.marked-parent').remove();
                $('#character span').removeClass('marked');
            }
        });
    } else {
        $('.progression').after('<section class="item-marker"/>');
        for(var i=0; i<marked_text.length; i++){
            $('.item-marker').append('<h2 class="' + marked_text[i] + '"></h2><pre class="' + marked_text[i] + '"></pre>');
            $('.item-marker h2.' + marked_text[i]).append(marked_text[i]);
        }

        marker_array.sort(function(a,b){
            return a[1].level-b[1].level;
        });
        
        for(i=0; i<marker_array.length; i++){
            $('.item-marker pre.' + marker_array[i][0]).append(formatCurrentItem(marker_array[i][1]));
        }

        $('.item-marker-remove').click(function(){
            word.id = $(this).parent('div').attr('class');
            for(var i=0; i<marked_text.length; i++) {
                var index_splice = getMarkerIndex(marked_text[i], word);
                if(index_splice !== -1)
                    marker_array.splice(index_splice,1);
            }
            $.jStorage.set('wk_marker_array', marker_array);
            $(this).parent('div').remove();
            debugger;
        });
    }
})();

function markedWord(word){
    for(var i=0; i<marker_array.length; i++){
        var check;
        if(marker_array[i][1].voc)
            check = marker_array[i][1].voc;
        else if(marker_array[i][1].kan)
            check = marker_array[i][1].kan;
        else
            check = marker_array[i][1].rad;

        if(check === word)
            return marker_array[i][0];
    }
    return false;
}

function getMarkerIndex(text, word){
    for(var i=0; i<marker_array.length; i++){
        if(marker_array[i][0]===text && marker_array[i][1].id==word.id)
            return i;
    }
    return -1;
}

function formatCurrentItem(currentItem){
    var output = '<div class="'+currentItem.id+'">';

    if(currentItem.voc)
        output += 'Vocabulary\t' + currentItem.voc;
    else if(currentItem.kan)
        output += 'Kanji\t' + currentItem.kan;
    else if(currentItem.rad)
        output += 'Radical\t' + currentItem.rad;

    if(currentItem.voc)
        output += '\t' + currentItem.kana.join(',');
    else if(currentItem.kan)
        output += '\t[On]' + currentItem.on.join(',') + '[Kun]' + currentItem.kun.join(',');
    else if(currentItem.rad)
        output += '\t';

    output += '\t' + currentItem.en.join(',');

    output += '\tLevel ' + currentItem.level;

    output += '\t<a class="item-marker-remove">Remove</a>';

    output += '\n</div>';

    return output;
}