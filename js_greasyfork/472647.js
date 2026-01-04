// ==UserScript==
// @name            Исправление формы поиска оператора связи по номеру (БДПН / MNP)
// @namespace       github.com/a2kolbasov
// @version         1.0.1
// @description     Позволяет вводить номер телефона в любом формате (хоть с 8, хоть с +7, хоть со скобками, пробелами и дефисами)
// @author          Aleksandr Kolbasov
// @license         MIT
// @icon            data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTIyLjg4IDEyMi4yNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIyLjg4IDEyMi4yNiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0VDODAxMTt9IC5zdDF7ZmlsbDojMzkzOTM5O308L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02Ni4zOCw0Ny4wNWMwLjE2LTAuMiwwLjMzLTAuMzksMC41MS0wLjU5TDk1Ljk2LDE3LjlsLTcuNDYtMC4zOWMtMy4xOS0wLjE2LTUuNjUtMi44OC01LjQ5LTYuMDcgYzAuMTYtMy4xOSwyLjg4LTUuNjUsNi4wNy01LjQ5TDEwOS44NCw3YzIuODQsMC4xNCw1LjExLDIuMzIsNS40NSw1LjA1bDAsMGwyLjc3LDIxLjk0YzAuNCwzLjE4LTEuODMsNi4wOC01LjAyLDYuNDkgYy0zLjE4LDAuNC02LjA4LTEuODMtNi40OS01LjAybC0xLjItOS41MmwtMjkuNSwzMC41OEw2Ni4zOCw0Ny4wNUw2Ni4zOCw0Ny4wNXoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzMuODQsNTAuMjZjNC4xMyw3LjQ1LDguODksMTQuNiwxNS4wOCwyMS4xMmM2LjE5LDYuNTcsMTMuOSwxMi41NCwyMy44OSwxNy42MiBjMC43MywwLjM3LDEuNDQsMC4zNywyLjA2LDAuMTFjMC45Ni0wLjM3LDEuOTEtMS4xNCwyLjg4LTIuMWMwLjczLTAuNzMsMS42Ni0xLjkyLDIuNjItMy4yYzMuODMtNS4wNSw4LjU5LTExLjMyLDE1LjMtOC4xOSBjMC4xNSwwLjA3LDAuMjYsMC4xNSwwLjQxLDAuMjJsMjIuMzYsMTIuODdjMC4wNywwLjA0LDAuMTUsMC4xMSwwLjIyLDAuMTVjMi45NSwyLjAyLDQuMTcsNS4xNSw0LjIxLDguNyBjMCwzLjYxLTEuMzMsNy42Ny0zLjI4LDExLjFjLTIuNTgsNC41My02LjM4LDcuNTItMTAuNzYsOS41MWMtNC4xNywxLjkxLTguODEsMi45NS0xMy4yNywzLjYxYy03LDEuMDMtMTMuNTYsMC4zNy0yMC4yOC0xLjcgYy02LjU3LTIuMDItMTMuMTctNS4zOS0yMC4zOS05Ljg0bC0wLjUyLTAuMzRjLTMuMzEtMi4wNi02LjktNC4yOC0xMC40LTYuOUMzMS4xMSw5My4zMSwxOC4wMyw3OS4zLDkuNTEsNjMuODkgQzIuMzYsNTAuOTQtMS41NSwzNi45NywwLjU4LDIzLjY2YzEuMTgtNy4zLDQuMzItMTMuOTQsOS43Ny0xOC4zMmM0Ljc1LTMuODMsMTEuMTctNS45MywxOS40Ny01LjJjMC45NiwwLjA3LDEuODEsMC42MywyLjI1LDEuNDQgbDE0LjM1LDI0LjI2YzIuMSwyLjczLDIuMzYsNS40MiwxLjIyLDguMTJjLTAuOTYsMi4yMS0yLjg4LDQuMjQtNS41LDYuMTZjLTAuNzcsMC42Ni0xLjcsMS4zMy0yLjY2LDIuMDIgYy0zLjIsMi4zMi02Ljg2LDUuMDEtNS42MSw4LjE5TDMzLjg0LDUwLjI2TDMzLjg0LDUwLjI2TDMzLjg0LDUwLjI2eiIvPjwvZz48L3N2Zz4=
// @match           https://www.niir.ru/bdpn/bdpn-proverka-nomera/
// @match           https://zniis.ru/check/
// @match           https://zniis.ru/bdpn/check/
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/472647/%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D1%8B%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B8%20%D0%BF%D0%BE%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D1%83%20%28%D0%91%D0%94%D0%9F%D0%9D%20%20MNP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472647/%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D1%8B%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B8%20%D0%BF%D0%BE%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D1%83%20%28%D0%91%D0%94%D0%9F%D0%9D%20%20MNP%29.meta.js
// ==/UserScript==

/*
 * Copyright © 2023 Aleksandr Kolbasov
 * Licensed under the MIT license (https://opensource.org/license/mit/)
 */

(() => {
    'use strict';

    const form = document.querySelector('form[method="post"]');
    const input = form.querySelector('input[name="num"]');

    input.removeAttribute('pattern');

    form.addEventListener('submit', event => {
        let phone = input.value.replace(/\D/gm, '');
        input.value = phone.substring(phone.length - 10);
    });
})();
