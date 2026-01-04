// ==UserScript==
// @name         Тупая фигня, которая делает чтоб когда на ъуъя нажимали, он жмякался!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Потребляйте кальций
// @author       Rawlique
// @match        *://orbitar.space/*
// @icon         https://orbitar.space/favicon.ico
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447602/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D1%87%D1%82%D0%BE%D0%B1%20%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%8A%D1%83%D1%8A%D1%8F%20%D0%BD%D0%B0%D0%B6%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%2C%20%D0%BE%D0%BD%20%D0%B6%D0%BC%D1%8F%D0%BA%D0%B0%D0%BB%D1%81%D1%8F%21.user.js
// @updateURL https://update.greasyfork.org/scripts/447602/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D1%87%D1%82%D0%BE%D0%B1%20%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%8A%D1%83%D1%8A%D1%8F%20%D0%BD%D0%B0%D0%B6%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%2C%20%D0%BE%D0%BD%20%D0%B6%D0%BC%D1%8F%D0%BA%D0%B0%D0%BB%D1%81%D1%8F%21.meta.js
// ==/UserScript==

(function() {
    const squeezeSound = new Audio('data:audio/mpeg;base64,//sQxAAAA7BPCBQRgADDke/3GiAC/4FyAjRP0QnAABPREoAAFwQ5Q5wx/hj6gQGgg6IBYKBSKhUKRSKBAIAAANlGgTPNGN0dc3QxcU3s7uT5K1k+dqmM3/Yix8IO9Aqbo+nyCqlaiiD/+xLEAgAFCCF9OGEAAKgEcTcMIACCAAAAAOXyuwxyDEm7kyBOCb8K9L3e4IN+lwLflAGkEza/wGctpKktFotAoBAABAAAA+e/J+dwJaNbyQPPLFAWotFfff+bd+FWAT+X/1Nq2fUSoLX/+xDEAoAFOMN0GLEAAJsbr0MKIAAETc5S8xvMavNnbO/5z/X5CMc9sjerP3/pUreEACAYfB9/EXBClcJO4IInKVXTsv3////2+X8hGIRM2n0I6EFoQytKUpSgP4GLP8FakjakcEkkEv/7EsQDgAV8L5W4MQAQq40u1w4gAAjDQCAAAA73PF2IYtC0zJiQIcPIAhoH8PHyaeOMNuZ4Q0E/6z63b7AAHXGwQjcaDoHUJuS5FR+LZd+p2XRzfEQJpqlIz8OFASOHlZ7h9/BW//yiQv/7EMQCAATU33QYgoAAsBlu1w4gAG2Sg/U7ohtjn/nO6Yl/y0Uv5GtqUsv8jSEYuWoj/IRvzKAo7M/AAH8U1mA7Qg5j+S5i/u5FXyYzsio/b0SdU/zu5zsciK/6vsfDhDvLcQUDzrOC//sSxAIABTjNeTihAACiGazDFHAAOIAAAAD80pTBGyuxhWwM9S/sUrfq4WhW+IJ0WYv/z0moZf/8yif1O8JQvKOUjYl48a36Do1I/5UWmo6/8qKhKB8avt/oNh4dYe//2FQDlf5eTIWA//sQxAKABUjfZhgRAACkHatDBHAACKcQxkNziGOZDG8m6W2+QWggDeUpVL/IzgAiVDGQwb+ocX+pQEePQ/o/39j/56f5h55P/weDQgTff791PLg8B5//iQA8H4lg8GhD//8S1eSbaAD/+xLEAgAFKM1kuCEAAKeQqhcWIAABo1j+QnnJ6NVuqo39ima1S/K7XCmMBKX/Xl6BgL/9FKAgP8qFZJ/NAADNczzNhQr/sA9Bv0OYU6xVl9QySf4oDk1r/RGDi8bxIEJD9SvPKgAAWpj/+xDEAgBEmCU7PJCAAIsMKSaSIAZACUebuPzI58dWyac0k1QncPGyJKtyqzrUnkuaa/VcxqRWvw/0Kfy3b9btWgfJV7pb/sZas5bnV7KOkeow4fNCRGzBWgABBAAEMYPFw6gdtOW6ef/7EsQHgAYARTC5kYAArJWpgwpQAETF2zK8Z/7VXQUjJOFDIsdktSqw0mjll5XHIvG6ApSe6DRyAj/XORO+37/81f4RQCh5TiY8h3IQgfOZyC89nF2ZyfDiDA7wxxCd0g/VBBzXBrdc4f/7EMQDgAU8n0YYcoAAkwsot5BQBUouRxVmp/rKWik+pUMIiQTOW/3jDIUYJuK/iwvWDUi326wEEmJZoNtoAAAwzsszHyptvfgUVYvf90lSrMwixyZ+0q33342lMmAAUDITLkUSiWGo//sSxAWAxAgdKiSYYOB1hJgUkxhUCJEQ8KhoqdsKln1A1iKIn+r2fq/6zUhYQh4uAAsYHUiSElHmHoWas1ioqxEVFWf//1itTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    const live = function(eventType, elementQuerySelector, cb) {
        document.addEventListener(eventType, function(event) {
            const qs = document.querySelectorAll(elementQuerySelector);
            if (qs) {
                let el = event.target, index = -1;
                while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                    el = el.parentElement;
                }
                if (index > -1) {
                    cb.call(el, event);
                }
            }
        });
    }

    live('click', '[class^=App_monster__]', (e) => squeezeSound.play());
})();