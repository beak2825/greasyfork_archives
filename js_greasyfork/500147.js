// ==UserScript==
// @name         Quore PM Quick Open
// @description  Enter in a list of room PMs to open up automatically in Quore.
// @namespace    https://app.quore.com/
// @match        https://app.quore.com/pm/pmsuboverview.php?qpm=556373&p=33421
// @license      MIT
// @version      2024-07-03
// @downloadURL https://update.greasyfork.org/scripts/500147/Quore%20PM%20Quick%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/500147/Quore%20PM%20Quick%20Open.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    let isEnabled = false;

    const $sibling = $('body > div.container > div.boxDashboard > div.dashleft');
    const $rooms = $('#pmguestroom_this_month div.pm_closed div.room-name a');

    const $app = $('<div class="dashright">Quore PM completor</div>');

    const $buttonEnable = $('<button>Enable</button>');

    const $hiddenWrapper = $('<div></div>');
    const $instruction = $(`<p>Enter in a list of rooms to mark as complete, separated by spaces.  The PMs for each of these rooms will be opened in a new tab, started, and closed.  You'll have to close out each tab on your own.</p>`);

    const $formList = $('<div></div>');
    const $input = $('<input type="text">');
    const $buttonRun = $('<button>Open and complete</button>');

    $buttonEnable.css({
        'display': 'block',
        'margin': '1em'
    });

    $hiddenWrapper.css({
        'visibility': 'hidden'
    });

    $instruction.css({
        'font-size': '12px',
        'margin': '1em'
    });

    $buttonRun.css({
        'margin-left': '1em'
    });

    $buttonEnable.on('click', () => {
        isEnabled = !isEnabled;
        $buttonEnable.text(isEnabled? 'Disable' : 'Enable');
        $hiddenWrapper.css({
            'visibility': isEnabled? 'visible' : 'hidden'
        });
    });


    //Build up key value pairs for room name to links to the room PM.
    const roomLinks = new Map();
    $rooms.each((index, $elem) => {
        const key = $($elem).children().first().text().replace(':','').replace(' ', '').toLowerCase();
        const link = $($elem).attr('href');
        roomLinks.set(key, link);
        console.log(key, link);
    });

    $buttonRun.on('click', () => {
        console.log('running');
        let modifiedText = $input.val();
        let vals = modifiedText.split(' ');
        console.log(vals);
        vals.map((val) => {
            if (roomLinks.has(val)) {
                modifiedText.replace(val, '');
            }
        });
    });

    $formList.append($input, $buttonRun);
    $hiddenWrapper.append($instruction, $formList);
    $app.append($buttonEnable, $hiddenWrapper);

    $sibling.after($app);
})($);