// ==UserScript==
// @name         MTGTop8 to List/JSON
// @namespace    https://xvicario.us/scripts
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://mtgtop8.com/compare
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/33643/MTGTop8%20to%20ListJSON.user.js
// @updateURL https://update.greasyfork.org/scripts/33643/MTGTop8%20to%20ListJSON.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const COOKIE_SNOW_LANDS = 'convertSnow';
    const controls =
          '<div class="W10" style="padding:7px">MTGTop8 to List/JSON</div>' +
          '<div class="W10">' +
              '<input type="checkbox" id="convertSnow">' +
              '<label for="convertSnow">Convert Snow Lands to Normal</label>' +
          '</div>' +
          '<div class="W10">' +
              '<a id="generateList" href="#">Generate List</a>' +
          '</div>';
    const $controls = $('<div class="c_box"></div>').html(controls);
    $controls.css('height', '66px').css('width', '250');
    const $table = $('div.page table').first();
    const $freeSpace = $table.find('tr td').first();
    $freeSpace.next().remove();
    $freeSpace.prop('align', 'center');
    $freeSpace.prop('colspan', '2');
    $freeSpace.append($controls);
    $(document).on('change', '#convertSnow', function() {
        Cookies.set(COOKIE_SNOW_LANDS, this.checked);
    });
    $('#convertSnow').prop('checked',
        Cookies.get(COOKIE_SNOW_LANDS) === 'true');
    $(document).on('click', '#generateList', function() {
        let nth = 0;
        let cards = [];
        const basicLands = ['Plains', 'Island', 'Swamp',
                            'Mountain', 'Forest', 'Wastes'];
        const snow = 'Snow-Covered';
        let log = '';
        $('tr').each(function() {
            if (nth > 8) {
                let $c2 = $(this).find('div.c2');
                if ($c2.text().length) {
                    let number = 0;
                    $(this).find('div.c').each(function() {
                        const newNumber = parseInt($(this).text());
                        if (newNumber > number) {
                            number = newNumber;
                        }
                    });
                    let basicName = $c2.text();
                    if (basicName.includes(snow)) {
                        basicName = basicName.substr(snow.length).trim();
                    }
                    if (number > 4 && !basicLands.includes(basicName)) {
                        number = 4;
                    }
                    let editedName = basicName;
                    if (Cookies.get(COOKIE_SNOW_LANDS) === 'false'
                        && basicLands.includes(basicName)
                        && $c2.text().includes(snow)) {
                        editedName = snow + ' ' + basicName;
                    }
                    const currentIndex = searchForCard(editedName, cards);
                    if (currentIndex > -1) {
                        // todo: Snow-Covered lands are duplicated because they
                        // aren't in the same row
                        cards[currentIndex][0] += number;
                        if (cards[currentIndex][0] > 4
                            && !basicLands.includes(basicName)) {
                            cards[currentIndex][0] = 4;
                        }
                    } else {
                        cards.push([number, editedName]);
                    }
                }
            }
            nth++;
        });
        for (let i = 0; i < cards.length; i++) {
            log += (cards[i][0] + 'x ' + cards[i][1]) + '<br>';
        }
        const myWindow = window.open('about:blank', '', '_blank');
        myWindow.document.write(log + '<br><br>' + JSON.stringify(cards));
    });

    /**
     * Search for a card name in the multidimensional array
     * @param {string} name what card you're looking for
     * @param {array} array array you are looking in
     * @return {number} the index of the card, or -1 if it is not found
     */
    function searchForCard(name, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][1] === name) {
                return i;
            }
        }
        return -1;
    }
})();
