// ==UserScript==
// @name         bustimes.org - Fix Cardiff Bus Route Colours
// @match        *://bustimes.org/operators/cardiff-bus*
// @match        *://bustimes.org/search?q=cardiff+bus*
// @grant        none
// @description  Fixes Cardiff bus colours on bustimes.org by applying the colours from cardiffbus.com/services
// @version 0.0.1.20260114010923
// @namespace https://greasyfork.org/users/938630
// @downloadURL https://update.greasyfork.org/scripts/532581/bustimesorg%20-%20Fix%20Cardiff%20Bus%20Route%20Colours.user.js
// @updateURL https://update.greasyfork.org/scripts/532581/bustimesorg%20-%20Fix%20Cardiff%20Bus%20Route%20Colours.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // List of classes to remove from all elements
    const classesToRemove = [
        'colour-49',
        'colour-52',
        'colour-57',
        'colour-58',
        'colour-60',
        'colour-63',
        'colour-67',
        'colour-74'
    ];

    // Loop through each class and remove it from all matching elements
    classesToRemove.forEach(className => {
        document.querySelectorAll(`.${className}`).forEach(el => {
            el.classList.remove(className);  // Remove the class completely
            // Optional: Also clear inline styles if needed
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.borderColor = '';
        });
    });

    // Optionally, you can still apply your custom styles here for other conditions like "Baycar" etc.
})();



(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '1' || text === '1A' || text === '2' || text === '2A') {
            el.style.backgroundColor = '#ABBAB7';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '4') {
            el.style.backgroundColor = '#454448';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '6') {
            el.style.backgroundColor = '#04458E';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Baycar') {
            el.style.backgroundColor = '#04458E';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '7') {
            el.style.backgroundColor = '#BA80B0';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '8') {
            el.style.backgroundColor = '#F9AA53';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '9') {
            el.style.backgroundColor = '#71B5B3';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '11') {
            el.style.backgroundColor = '#EB2B91';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '13') {
            el.style.backgroundColor = '#FFB223';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '14') {
            el.style.backgroundColor = '#1A5C84';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '17' || text === '18') {
            el.style.backgroundColor = '#C10B1E';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '21' || text === '23') {
            el.style.backgroundColor = '#6AAA6C';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '24' || text === '25' || text === '25A') {
            el.style.backgroundColor = '#247039';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '27') {
            el.style.backgroundColor = '#ACD425';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '28') {
            el.style.backgroundColor = '#0B7567';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '29') {
            el.style.backgroundColor = '#1DCFB6';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '30') {
            el.style.backgroundColor = '#95A8C1';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '32') {
            el.style.backgroundColor = '#429D6C';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '35') {
            el.style.backgroundColor = '#7C6CAC';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '44' || text === '45') {
            el.style.backgroundColor = '#935193';
            el.style.color = 'white';
        }
    });
})();
(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '49' || text === '50') {
            el.style.backgroundColor = '#AB9FC9';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '52') {
            el.style.backgroundColor = '#9B1C7B';
            el.style.color = 'white';
        }
    });
})();
(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '54') {
            el.style.backgroundColor = '#F9B2DD';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '57' || text === '58') {
            el.style.backgroundColor = '#68AADC';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '61') {
            el.style.backgroundColor = '#EB2B91';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '62') {
            el.style.backgroundColor = '#A37C50';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '63') {
            el.style.backgroundColor = '#A37C50';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '64') {
            el.style.backgroundColor = '#A37C50';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '86') {
            el.style.backgroundColor = '#F2901D';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '91') {
            el.style.backgroundColor = '#008DAA';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '92' || text === '92B' || text === '93' || text === '94' || text === '93S') {
            el.style.backgroundColor = '#C57283';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '95') {
            el.style.backgroundColor = '#6F6F6F';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '96') {
            el.style.backgroundColor = '#5B8486';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '101') {
            el.style.backgroundColor = '#000E62';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '102') {
            el.style.backgroundColor = '#594BE7';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '136') {
            el.style.backgroundColor = '#A23E2C';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '305') {
            el.style.backgroundColor = '#ACD425';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '600' || text === '608' || text === '609' || text === '610' || text === '611') {
            el.style.backgroundColor = '#0060A5';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        const text = el.textContent.trim();
        if (text === '604' || text === '606') {
            el.style.backgroundColor = '#002742';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === '619') {
            el.style.backgroundColor = '#58B9FD';
            el.style.color = 'black';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === 'B1') {
            el.style.backgroundColor = '#43952C';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === 'B2') {
            el.style.backgroundColor = '#D5683E';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === 'H59') {
            el.style.backgroundColor = '#047EAC';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Park & Ride') {
            el.style.backgroundColor = '#047EAC';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Sky') {
            el.style.backgroundColor = '#0C98B5';
            el.style.color = 'white';
        }
    });
})();

(function() {
    'use strict';
    document.querySelectorAll('.name.is-short').forEach(el => {
        if (el.textContent.trim() === 'M1') {
            el.style.backgroundColor = '#6E184A';
            el.style.color = 'white';
        }
    });
})();