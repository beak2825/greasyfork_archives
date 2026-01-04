// ==UserScript==
// @name         SUStech HOTKEY
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  SUStech 热键
// @author       鈴宮華緋
// @match        http://101.200.154.206:8090/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=154.206
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444491/SUStech%20HOTKEY.user.js
// @updateURL https://update.greasyfork.org/scripts/444491/SUStech%20HOTKEY.meta.js
// ==/UserScript==

(function() {
    // ui
    let loaded = false;
    let first_frame_num = -1;
    let frame_index = -1;
    let first_index = -1;
    let last_index_num = -1;
    let frame_index_dist = {};
    let interval = null;
    let frame_selector = $('#frame-selector');
    let frame_num_box = $('<div><span></span></div>');
    frame_num_box.css({
        'box-sizing': 'border-box',
        position: 'absolute',
        top: '24px',
        left: 0,
        width: 'fit-content',
        padding: '2px 6px',
        'background-color': 'rgba(0, 0, 0, 0.9)',
    });
    $('body').append(frame_num_box);
    function showFrameNum(key) {
        let option_index = -1;
        if(!loaded) {
            frame_selector.find('option').each((index,element) => {
                if($(element).attr('value')) {
                    console.log(first_frame_num);
                    if(first_index == -1) {
                        first_index = index;
                    }
                    option_index = index - first_index + 1;
                    if(last_index_num < option_index) {
                        last_index_num = option_index;
                    }
                    $(element).text(option_index);
                    frame_index_dist[$(element).val()] = option_index;
                }
            });
            loaded = true;
        }
        let frame_value = frame_selector.val();
        frame_index = frame_index_dist[frame_value];
        if($('#batch-editor-tools-wrapper').css('display') == 'none') {
            frame_num_box.show();
            interval = null;
        } else {
            frame_num_box.hide();
            if(interval == null) {
                $('.box-info').each((index, element) => {
                    interval = setInterval(() => {
                        $('.box-info').each((index, element) => {
                            $(element).text(frame_index_dist[$(element).text().split(',')[0]]);
                        });
                    }, 100);
                });
            }
        }
        frame_num_box.find('span').text(frame_index);
    }
    frame_selector.change((event) => {
        showFrameNum();
    });

    // hot key
    document.onkeydown = function(e){
        console.log('keydown', e);
        let keyNum = window.event ? e.keyCode :e.which;
        let key = e.key;
        let code = e.code;
        showFrameNum(key);
        if(key == '3' || key == '4') {
        }
        if($('#batch-editor-tools-wrapper').css('display') == 'none') {
            console.log('stop batch-editor hot key.');
            return;
        }
        if(key == 'y'){
            // y：自动标注（自适应）
            $('#auto-annotate').click();
        }
        if(key == 'u'){
            // u：自动标注(不适应）
            $('#auto-annotate-translate-only').click();
        }
        if(key == 'i'){
            // i：批量标注-插值
            $('#interpolate').click();
        }
        if(key == 'o') {
            // o：批量标注-设为最终
            $('#finalize').click();
        }
        if(key == 'j') {
            let v_btn_wrappers = $('.v-buttons-wrapper');
            v_btn_wrappers.each(function(index, value){
                console.log(this);
                if($(this).css('display') == 'none') {
                    console.log('stop fit-size hot key.');
                    return true;
                }
                $(this).find('#v-fit-size').click();
                return false;
            });
        }
    }
})();