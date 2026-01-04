// ==UserScript==
// @name            HotPot.ai Submit button move
// @namespace       Wizzergod
// @version         1.0.8
// @description     Add variation to scroll submit and downlaod all buttons, move at the page scroll.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488931/HotPotai%20Submit%20button%20move.user.js
// @updateURL https://update.greasyfork.org/scripts/488931/HotPotai%20Submit%20button%20move.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = {
        submitBox: {
            fixed: {
                position: 'fixed',
                top: 'unset',
                left: '0',
                padding: '5px',
                right: 'auto',
                backgroundColor: 'transparent',
                display: 'flex',
                justifyContent: 'flex-start'
            },
            static: {
                position: 'static',
                zIndex: '9999',
                backgroundColor: 'transparent',
                display: 'block'
            }
        },
        downloadAllBox: {
            fixed: {
                position: 'fixed',
                top: '130px',
                left: '0',
                padding: '5px',
                right: 'auto',
                backgroundColor: 'transparent',
                display: 'flex',
                justifyContent: 'flex-start'
            },
            static: {
                position: 'static',
                zIndex: '9999',
                backgroundColor: 'transparent',
                display: 'block'
            }
        },

    };

    // Добавляем стили CSS для скрытия элементов по id
    var customStyles = document.createElement('style');
    customStyles.innerHTML = 'div[id^="bsa-zone_"] { display: none; }';
    document.head.appendChild(customStyles);

    function moveElementAboveHeaderBox(element, headerBox) {
        if (element.length > 0 && headerBox.length > 0) {
            headerBox.before(element);
        }
    }

    function fixElementOnScroll(element, fixAt, styles) {
        if (element.length > 0) {
            $(window).on('scroll', function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > fixAt) {
                    element.css(styles.fixed);
                    $('.option.styleBox.imageInputBox .button.download , #submitButton').css({
                        width: '60px',
                        fontSize: '10px',
                border: '1px solid #e0e0e0',
                        height: '200px'
                    });
                } else {
                    element.css(styles.static);
                    $('.option.styleBox.imageInputBox .button.download , #submitButton').css({
                        width: '520px',
                        fontSize: '20px',
                border: '1px solid #e0e0e0',
                        height: '60px'
                    });
                }
            });
        }
    }

    var submitBox = $('.submitBox');
    var downloadAllBox = $('#downloadAllBox');
    var headerBox = $('.headerBox');

    $(document).ready(function() {
        moveElementAboveHeaderBox(submitBox, headerBox);
        fixElementOnScroll(submitBox, 100, styles.submitBox);
        moveElementAboveHeaderBox(downloadAllBox, headerBox);
        fixElementOnScroll(downloadAllBox, 200, styles.downloadAllBox);
        $('#downloadAllBox .option.styleBox.imageInputBox .button.download ').css(styles.downloadButton);
        $('#submitButton').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    });

})();
