// ==UserScript==
// @name         WaniKani Review Session Kanji Get Vocab Info
// @namespace    wk_skvi
// @version      0.3
// @description  Put vocab info in Kanji review sessions
// @author       polv
// @match        https://www.wanikani.com/review/session
// @resource chargrid https://raw.githubusercontent.com/mwil/wanikani-userscripts/7caebf537b4d02084d85f1a19d26b50c185d8d05/styles/css/chargrid.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       GM_unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/36354/WaniKani%20Review%20Session%20Kanji%20Get%20Vocab%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/36354/WaniKani%20Review%20Session%20Kanji%20Get%20Vocab%20Info.meta.js
// ==/UserScript==

var item;
var new_grid = '<ul class="multi-character-grid multi-character-grid-extra-styling"></ul>';
var new_row = '<li id="vocabulary-add" class="character-item locked"><a onclick="window.wk_new_word = prompt(\'Add a new word:\'); return false;"><span class="character" lang="ja">+</span><ul></ul></a></li>';
var vocab_add_array = $.jStorage.get('wk_vocab_add_array', []);
var current_vocab_add_array = [];

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText(`chargrid`)
            .replace(/wk_namespace/g, GM_info.script.namespace));

    function updateInfo(){
        var item = $.jStorage.get('currentItem');
        if(item.kan !== undefined){
            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://www.wanikani.com/kanji/' + item.kan,
                onload: function(data) {
                     var result = $('<div />').append(data.responseText).find('section:eq(9)').html();
                     $('#item-info-col2').append('<section class="wk_skvi item-vocabulary"></section>');
                     $('.item-vocabulary').html(result);
                    if( $('.multi-character-grid').length === 0 )
                        $('.item-vocabulary').append(new_grid);
                    $('.item-vocabulary li').removeClass('locked');

                    for(var i=0; i<current_vocab_add_array.length; i++){
                        var val = current_vocab_add_array[i];
                        $('.multi-character-grid').append(new_row);
                        $('#vocabulary-add:first').attr('id','vocabulary-'+val);
                        $('#vocabulary-'+val).removeClass('locked');
                        $('#vocabulary-'+val+' span').html(val);
                    }
                    $('.multi-character-grid').append(new_row);
                }
            });
        }
    }

    var observer = new MutationObserver(function(mutations) {
        for(var i=0; i<mutations.length; ++i) {
            for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                if(mutations[i].addedNodes[j].id == "item-info-meaning-mnemonic") {
                    updateInfo();
                }
            }
        }
    });
    observer.observe($('#item-info-col2').get(0), { childList: true });

    Object.defineProperty(unsafeWindow, 'wk_new_word', {
        set: function(val){
            if(val.match(/[\u3400-\u9FBF]/)){
                console.log(val);
                $('.multi-character-grid').append(new_row);
                $('#vocabulary-add:first').attr('id','vocabulary-'+val);
                $('#vocabulary-'+val).removeClass('locked');
                $('#vocabulary-'+val+' span').html(val);

                current_vocab_add_array.push(val);
                var kanji = $.jStorage.get('currentItem').kan;
                for(var i=0; i<vocab_add_array.length; i++)
                    if(vocab_add_array[i][0] === kanji)
                        break;
                if(i<vocab_add_array.length)
                    vocab_add_array.splice(i, 1);
                vocab_add_array.push([kanji, current_vocab_add_array]);
                $.jStorage.set('wk_vocab_add_array', vocab_add_array);
            }
        }
    });

    $.jStorage.listenKeyChange('currentItem', function(key) {
        var kanji = $.jStorage.get('currentItem').kan;
        for(var i=0; i<vocab_add_array.length; i++)
            if(vocab_add_array[i][0] === kanji)
                break;
        if(i<vocab_add_array.length)
            current_vocab_add_array = vocab_add_array[i][1];
        else
            current_vocab_add_array = [];
    });
})();