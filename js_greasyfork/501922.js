// ==UserScript==
// @name            DungeonsOfTheWell profile page header bugfix
// @name:ru         Исправление заголовка страницы профиля игры "Подземелья колодца"
// @namespace       http://tampermonkey.net/
// @version         2024-07-27 0.3
// @description     Prevents page header on DungeonsOfTheWell profile page from getting on top of app_content element, no matter the screen size and zoom
// @description:ru  Предотвращает перекрытие заголовка страницы профиля игры "Подземелья колодца" содержимым элемента app_content, независимо от размера экрана и масштабирования
// @author          You
// @match           https://vip3.activeusers.ru/app.php*
// @icon            none
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/501922/%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20%D0%B8%D0%B3%D1%80%D1%8B%20%22%D0%9F%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%B5%D0%BB%D1%8C%D1%8F%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D1%86%D0%B0%22.user.js
// @updateURL https://update.greasyfork.org/scripts/501922/%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20%D0%B8%D0%B3%D1%80%D1%8B%20%22%D0%9F%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%B5%D0%BB%D1%8C%D1%8F%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D1%86%D0%B0%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove 'navbar-fixed-top' class from the target element
    function removeNavbarFixedTop() {
        var header = document.querySelector("body > div.page-header.-i.navbar.navbar-fixed-top");
        if (header) {
            header.classList.remove('navbar-fixed-top');
        }
    }

    // Observer to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeNavbarFixedTop();
            }
        });
    });

    // Configuration of the observer - Watch for child nodes being added or removed
    var config = { childList: true, subtree: true };

    // Start observing the target node for mutations
    observer.observe(document.body, config);

    // Call the function initially in case the element is already present
    removeNavbarFixedTop();
})();