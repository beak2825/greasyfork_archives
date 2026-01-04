// ==UserScript==
// @name           Auto pass turn for Epicmafia's dice wars
// @namespace      https://greasyfork.org/en/users/159342-cleresd
// @description    Auto pass turn for Epicmafia's dice wars epicmaifa.com
// @version        1.02
// @match          https://epicmafia.com/game*
// @grant          GM_addStyle
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/398893/Auto%20pass%20turn%20for%20Epicmafia%27s%20dice%20wars.user.js
// @updateURL https://update.greasyfork.org/scripts/398893/Auto%20pass%20turn%20for%20Epicmafia%27s%20dice%20wars.meta.js
// ==/UserScript==

GM_addStyle(`
/* auto refresh button */

._oracle_icon {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHfK4NRGMc/22iyieLChbQ0uxoxtbhRtoSS1kwZbrZ3v9Q2b+/7SsutcqsocePXBX8Bt8q1UkRKyp1r4ga9nndTk+w5Pef5nO85z9M5zwF7LK8U9Lo+KBQNLToW8szG5zzOJxx04qILX0LR1ZFIZJKa9n6LzYrXPVat2uf+NVcqrStgaxAeVlTNEB4XnlwxVIu3hNuUXCIlfCLs1+SCwjeWnqzws8XZCn9arMWiYbC3CHuyvzj5i5WcVhCWl+Mt5JeVn/tYL3GnizPTErvEO9CJMkYIDxOMEiZIP0MyB+khQK+sqJHfV86fYklyFZlVSmgskiWHgV/UZamelpgRPS0jT8nq/9++6pmBQKW6OwT1j6b52g3OTfjaMM2PA9P8OgTHA5wXq/lL+zD4JvpGVfPuQfManF5UteQ2nK1D+72a0BJlySFuz2Tg5Ria4tB6BY3zlZ797HN0B7FV+apL2NkFn5xvXvgGa+9n6Oaaag8AAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFCSURBVDiNY2QgAnw6e/4/Mp/P2JARmzqsgvgMwmcgTsPa086gGJKdzkzQQCZiDGJgYGCYOvMvLnvhgIUYgwJleKCs76QZhmkAAjzbyskg5f0dzkYHKN6EuQqbQdjAjaYbKL7ACDN8BuFzFYZhlbNMsMauBucXBqmYrwwMgv8Y+Pb9ZZCK+cqw/skXDHUoYYbsbJjibO2jDJ8YGBgYGGwYGBgYGD6xHWVg2MzAwMBgjWEg3CUwg5AVZFfgTtNTOxDBBfMREy6DCIGjZzdjiGFNtNhsRwZRoZuwiqOEWaAMD4brPj+8D2enl1zGMAA50uAMbCkfBuIiHzDwGrshXObYy2Bt7IthIBMhgxgYGFAMYmBgYFi2vxiFD9OPN8wYGKAx+uY2VnH02GbC5yp8SQObGpwuQ1aEHqtRjr0YMdqeduY/AAVIe2d8BtH4AAAAAElFTkSuQmCC);
    height: 19px;
    width: 19px;
    display: inline-block;
    position: relative;
    top: 1px;
}

#_oAutoPassTurnWrap {
    display: inline-block;
    border: 1px solid #cd88d3;
    padding: 0 2px 2px 2px;
    margin-left: 2px;
    float: right;
}

#_oAutoPassTurnWrap::after {
  content:'';
  border: solid #cd88d3;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  margin-bottom: 4px;
  margin-right: 5px;
}

#_oAutoPassTurnWrap ._oracle_icon {
    top: 3px;
    left: -4px;
}`);

if ($("#board") && ('#end-turn')) {
    insertAutoPassTurnForDicewars();
}

function insertAutoPassTurnForDicewars() {
    let autoPassTrun = false;

    $("#board").after(`<div id="_oAutoPassTurnWrap" class="tt" data-title="Auto-refresh">
			<input type="checkbox" id="_oAutoPassTurnBox"/>
			<label for="_oAutoPassTurnBox"><i class="_oracle_icon"></i></label>
		</div>`);

    $("#_oAutoPassTurnBox").change(e => {
        autoPassTrun = e.target.checked;
    });

    setTimeout(function run() {
        if (autoPassTrun) {
            $('#end-turn').click();
        }
        setTimeout(run, 2200);
    }, 10);

    $(document).focus(() => {
        if (autoPassTrun) {
            $('#end-turn').click();
        }
    });
}