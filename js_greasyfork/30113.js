// ==UserScript==
// @name         리니지M 미니게임 도우미
// @namespace    http://bygoda.tistory.com/
// @version      0.11
// @description  리니지M 미니게임을 편리하게 사용할 수 있도록 제작한 스크립트
// @author       bygoda
// @include      https://minigame.plaync.com/*
// @match        https://minigame.plaync.com/lineagem/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30113/%EB%A6%AC%EB%8B%88%EC%A7%80M%20%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/30113/%EB%A6%AC%EB%8B%88%EC%A7%80M%20%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getShaHash(resp) {
        var collection = new jsSHA('SHA-256', 'TEXT', {
            "numRounds": resp.length
        });
        collection.update(resp);
        return collection.getHash('HEX');
    }

    function clearBackgroundColor(){
        $('.layer.inventory .cont .itemList .listContainer .slot').css('backgroundColor', '#000000');
        $('.layer.inventory .cont .itemList .listContainer .slot .grade').css({
            border: '1px solid white',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
        });
    }

    function setBackgroundColor(slotIdx, grade){
        var color = '#000000';
        switch(grade){
            case 1: color = 'gold'; break;
            case 2: color = 'silver'; break;
            case 3: color = 'black'; break;
        }
        $('.layer.inventory .cont .itemList .listContainer .slot:visible').eq(slotIdx).css('backgroundColor', color);
    }

    function setEquipName(slotIdx, itemObj){
        var type = itemObj.item.type;
        var arrType = ['', '투구', '티셔츠', '무기', '망토', '갑옷', '방패', '부츠', '장갑'];
        var $targetSlot = $('.layer.inventory .cont .itemList .listContainer .slot:visible').eq(slotIdx);
        var grade = $('.grade', $targetSlot).text();

        var html = [];
        html.push(grade);
        html.push(arrType[type]);
        html.push('(<span style="color: orange; font-size: 9pt;">'+itemObj.score+'</span>)');
        $('.grade', $targetSlot).html(html.join(' '));
    }

    $(document).ajaxSuccess(function(evt, xhr, opts, data) {
        var isInvenList = opts.url == "https://minigame.plaync.com/lineagem/enchant/inventoryList";
        var isEnchant = opts.url == "https://minigame.plaync.com/lineagem/enchant/go";

        if(isInvenList){
            var _gaid = data.gaid;
            clearBackgroundColor();
            var itemIdxFactor = data.filter === 0 ? 2 : 0;
            $.each(data.list, function(itemIdx, itemObj){
                setBackgroundColor(itemIdxFactor + itemIdx, itemObj.item.grade);
                setEquipName(itemIdxFactor + itemIdx, itemObj);
                if(itemObj.item.grade == 3 && itemObj.item.name != '티셔츠' && itemObj.slot < 1){
                    $.ajax('https://minigame.plaync.com/lineagem/enchant/go', {
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            seq: itemObj.seq,
                            auth_token: getShaHash(_gaid + ';' + itemObj.seq)
                        }
                    });
                }
            });
        }

        if(isEnchant){
            var safeEnchant = data.log.inventory.safeEnchant === true;
            if(data.log.enchantResult == 1 && data.log.inventory.item.grade == 3 && data.log.inventory.item.name != '티셔츠'){
                safeEnchant = true;
            }
            if(safeEnchant){
                opts.async = false;
                $.ajax(opts);
            }
        }
    });
})();