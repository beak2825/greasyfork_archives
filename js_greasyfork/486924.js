// ==UserScript==
// @namespace    лолзтим суета
// @name     Удаление гудов из масс. загрузки
// @version  2.1
// @grant    none
// @match    https://lzt.market/mass-upload/*
// @match    https://lolz.market/mass-upload/*
// @license MIT
// @description russian
// @downloadURL https://update.greasyfork.org/scripts/486924/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%83%D0%B4%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D0%BC%D0%B0%D1%81%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/486924/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%83%D0%B4%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D0%BC%D0%B0%D1%81%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    setTimeout(function() {
        let buttonPlace = document.querySelector('.button.smallButton.fl_r');
        if (buttonPlace) {
            let button = document.querySelector('.button.smallButton.fl_r button');
            if (!button) {
                button = document.createElement('button');
                button.style.width = '200px';
                button.style.height = '26px';
                button.style.backgroundColor = 'rgb(54, 54, 54)';
                button.style.color = 'white';
                button.style.borderRadius = '5px';
                button.style.boxShadow = 'none';
                button.textContent = 'Очистка гудов';
                buttonPlace.before(button);

                button.addEventListener('mousedown', function() {
                    button.style.backgroundColor = 'rgb(45, 45, 45)';
                });

                button.addEventListener('mouseup', function() {
                    button.style.backgroundColor = 'rgb(54, 54, 54)';
                });

                button.addEventListener('click', function() {
                    let accounts = document.querySelectorAll('.account.checked');
                    accounts.forEach(function(account) {
                        let status = account.querySelector('.AccountStatus');
                        if (status && status.children.length === 1 && status.children[0].tagName === 'A' && status.textContent.trim() === status.children[0].textContent) {
                            account.remove();
                        }
                    });
                });
            }
        }
    }, 1000); // Задержка в 1000 миллисекунд (1 секунда)
}, false);
