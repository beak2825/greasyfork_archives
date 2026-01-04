// ==UserScript==
// @name         HideViewedMarket
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      0.8
// @description  Скрываем уже просмотренные товары на маркете!
// @author       llimonix
// @match        https://lzt.market/*
// @icon         https://i.imgur.com/SX9RWhl.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472845/HideViewedMarket.user.js
// @updateURL https://update.greasyfork.org/scripts/472845/HideViewedMarket.meta.js
// ==/UserScript==

(function() {
    function handleClick(itemId, event) {
        let myListItem = GM_getValue('myListItem', []);
        if ($.inArray(itemId, myListItem) === -1) {
            itemId = itemId.replace('marketItem--','');
            myListItem.push(itemId);
            GM_setValue('myListItem', myListItem);
        }
    }

    function mainMarket() {

        function check() {
            console.log('check');
            let myListItem = GM_getValue('myListItem', []);
            let marketItemCSS = '';
            $.each(myListItem, function(index, element) {
                // Первый вид скрытия
                marketItemCSS += `#marketItem--${element}, `;
            });
            marketItemCSS = marketItemCSS.slice(0, -2);
            $('head').append(`<style>${marketItemCSS} { display: none; }</style>`);
        }

        function handleCheckboxClick() {
            if ($("#ctrl_v_by_me").is(":checked")) {
                GM_setValue('vbemy', 'checked');
            } else {
                GM_setValue('vbemy', 'notchecked');
            }
            location.reload();
        }

        let myListItemButton = GM_getValue('myListItem', []).length;
        $('.MarketSearchBarButtons').append(`<span class="button HideViewedMarketReset mn-15-0-0">Сбросить просмотренные товары (${myListItemButton})</span>`);

        $(".HideViewedMarketReset").click(function() {
            GM_deleteValue('myListItem');
            location.reload();
        });

        function checboxAdd() {
            let checboxNotElement = $('#ctrl_v_by_me');
            if (checboxNotElement.length === 0) {
                let checkboxsearchBarForm = $('#CategoryWrapper .searchBarForm--Filter .checkboxRow:first');
                if (checkboxsearchBarForm.length > 0) {
                    $('#CategoryWrapper .searchBarForm--Filter:first .checkboxRow:last').after(`<div class="checkboxRow"><input type="checkbox" name="v_by_me" value="1" id="ctrl_v_by_me"><label for="ctrl_v_by_me"> Не просматривался ранее мною</label></div>`);
                } else {
                    $('.HiddenFilters.searchBarForm--Filter').css({
                        'visibility': 'visible',
                        'margin-bottom': '75px'
                    });
                    $('#CategoryWrapper .HiddenFilters:first').append(`<div class="checkboxRow"><input type="checkbox" name="v_by_me" value="1" id="ctrl_v_by_me"><label for="ctrl_v_by_me"> Не просматривался ранее мною</label></div>`);
                }
            }
            if (GM_getValue('vbemy') === 'checked') {
                $("#ctrl_v_by_me").prop("checked", true);
            }
            let HideViewedMarketReset = $('.HideViewedMarketReset')
            if (HideViewedMarketReset.length === 0) {
                let myListItemButton = GM_getValue('myListItem', []).length;
                $('.MarketSearchBarButtons').append(`<span class="button HideViewedMarketReset mn-15-0-0">Сбросить просмотренные товары (${myListItemButton})</span>`);
            }
            $('.marketIndexItem').each(function() {
                let itemId = $(this).attr('id');
                let hasClickHandler = $(this).data('hasClickHandler');
                let isMiddleButtonClick = false;

                if (!hasClickHandler) {
                    $(this).on('click auxclick', function(event) {
                        if (event.button !== 1 || !isMiddleButtonClick) {
                            handleClick(itemId, event);
                        }
                    });

                    $(this).on('mousedown', function(event) {
                        if (event.button === 1) {
                            event.preventDefault();
                            isMiddleButtonClick = true;
                        }
                    });

                    $(this).on('mouseup', function(event) {
                        if (event.button === 1) {
                            isMiddleButtonClick = false;
                        }
                    });

                    $(this).data('hasClickHandler', true);
                }
            });

            requestAnimationFrame(checboxAdd);
        }
        checboxAdd();
        $("#ctrl_v_by_me").on("change", handleCheckboxClick);

        if (GM_getValue('vbemy') === 'checked') {
            $("#ctrl_v_by_me").prop("checked", true);
            check();
        }
        $("#SubmitSearchButton").click(function() {
            let myListItemButtonLocation = GM_getValue('myListItem', []).length;
            $('.HideViewedMarketReset').html(`Сбросить просмотренные товары (${myListItemButtonLocation})`);
            check();
        });

    }

    if ($('.MarketSearchBarButtons').length > 0) {
        mainMarket();
    }
})();
