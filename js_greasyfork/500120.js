// ==UserScript==
// @name         recID copy button + replace typograph for Tilda
// @namespace    https://bocmanbarada.ru/codes
// @version      0.3
// @description  Дополнение добавляет кнопку с recID в каждый блок и скрывает #nbsp и #shy в текстах.
// @author       bocmanbarada
// @match        https://tilda.ru/page/?pageid=*
// @match        https://tilda.cc/page/?pageid=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB9klEQVR4nO2WvUtjURDFgwvqKi4I4kcnGGXR2CuiNhamdMFKZMHSxk5cEazdYtdCK7HxAyysLCSNFoKY/AniWqkgIlv4heIuv2XwZJGQ5N33btTGAyEvkzNzD3MPMy8We0cEAHXACLAMpIEL4Br4C5wBGeDrSxz8EfgOPOKGFaC8lALWVfgBSAETQB/QCFQBH4BTcW70bbyqUhzeoBbfAh1FeJc6uAc41/MmUOYrIKliuwE884OhCfgM/NbvGV8BUyr0M4C3Ld4s0AwMqHN2bQkft1+q8H0xtwPfiphy68XdDtRYu+0w4CTHkGkft/erpaHdDsTFOX4TtwOf9P+Vi4DBUrtdXTPcugiYFHnew+3tPgLWRB4L4Dm7PewVZETuCuAVc/tBDrdN8SMXAUcixwPJhd3+Kydu+8Kw51LkXOSGCALythoYVXzDpci9yBURBOQ1G/BD8em3ErCrePLVrwBIAHfAH6eawKGKtEYQkHX7qcZ3SnPBsOpaJKOE7ggChvPMBFtoc7bgXIusuQyiArnjyrU9saRVXhe2yKTLKC6Q6+5232WUD6Hc7riOEyHyOp+5vT6ygBwfmIN3tHh6gRagWp+4YtPiZN2+EvMFT69kcyFeyZ67vdJbQBZALfAFWAT2bclo491oaVlsARgy7v/Ed8Tc8Q+1xtm9KkaO1QAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500120/recID%20copy%20button%20%2B%20replace%20typograph%20for%20Tilda.user.js
// @updateURL https://update.greasyfork.org/scripts/500120/recID%20copy%20button%20%2B%20replace%20typograph%20for%20Tilda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        // добавляем кнопку с recID в любой блок
        $('#allrecords').on('mouseenter', '.record', function() {
            if ($(this).find('.recid-btn').length === 0) {
                console.log('recID нет');
                let recID = $(this).attr('recordid');
                let leftBtnWrapper = $(this).find('.tp-record-edit-icons-left__wrapper');
                $(leftBtnWrapper).append(`<button type="button" class="tp-record-edit__btn tp-record-edit__btn_white recid-btn"><span class="tp-record-edit__btn__title">#rec${recID}</span></button>`);

                const button = this.querySelector('.recid-btn');
                $(button).css({'border-radius': '4px', 'min-width': '100px', 'transition': '.2s ease'});

                button.addEventListener('click', function() {
                    const buttonTxt = this.innerText;
                    navigator.clipboard.writeText(buttonTxt).then(() => {
                        // После успешной записи текста в буфер обмена меняем текст кнопки
                        $(this).find('span').css('margin', '0 auto').text('Готово!');
                        $(this).css({'background-color': '#38f306', 'border-color': '#70db53'});
                        setTimeout(function() {
                            $(button).find('span').text(buttonTxt);
                            $(button).css({'background-color': '', 'border-color': ''});
                        }, 2000);
                    });
                });
            }
        });

        // апгрейд типографа
        if (window.location.pathname === '/page/') {
            const document_records = document.querySelector('#allrecords');
            const replaceTypograph = (el) => {
                const html = $(el).html();
                const replaced = html.replace(/#nbsp;/g, '⦁').replace(/#shy;/g, '╍');
                if (html !== replaced) {
                    $(el).html(replaced);
                }
            };

            $('.tn-atom, .t-title, .t-uptitle, .t-text, .t-descr').each(function (i, el) {
                replaceTypograph(el);
            });

            const recordsFieldsObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if ($(mutation.removedNodes[0]).hasClass('editinplacefield')) {
                            $(mutation.target)
                                .parent()
                                .find('.tn-atom, .t-title, .t-uptitle, .t-text, .t-descr')
                                .each(function (i, el) {
                                replaceTypograph(el);
                            });
                        }
                    }
                }
            });
            recordsFieldsObserver.observe(document_records, {
                childList: true,
                subtree: true,
            });
        }
    });

})();