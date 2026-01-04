// ==UserScript==
// @name         Forbidden Neopets - Haggle
// @version      2024-04-30
// @description  Skip haggle confirmation, auto offer
// @author       451
// @match        *://*.neopets.com/haggle.phtml*
// @match        *://*.neopets.com/objects.phtml?*obj_type=*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1288122
// @downloadURL https://update.greasyfork.org/scripts/493864/Forbidden%20Neopets%20-%20Haggle.user.js
// @updateURL https://update.greasyfork.org/scripts/493864/Forbidden%20Neopets%20-%20Haggle.meta.js
// ==/UserScript==

// skip haggle confirmation
if(location.pathname.includes('objects.phtml')) {
    const targetScript = document.querySelector('form[name=refreshform]+script');
    if(targetScript) {
        const modifiedScript = targetScript.innerHTML.replace(/function confirm\(\) \{(.*?)\}/s, '$1')
        targetScript.remove();
        document.body.appendChild(Object.assign(document.createElement("script"), { innerHTML: modifiedScript }));
    }
}

// auto offer
else if(location.pathname.includes('haggle.phtml')) {
    function setOffer(value) {
        $('.haggleForm input[name=current_offer]').val(value);
    }

    function restockHaggle(price) {
        const length = price.length;
        let L = 0; if(length > 5) { L++; }
        let [a,b,c] = [ price[L], price[1+L], price[2+L]];
        const first = price.slice(0, L);
        let repeat, second = a+b;
        // 32 1   ab + b...
        if( (a>b) && (b>c) ) { repeat = b; }
        // 13 2   ab + b...
        else if( (b>c) && (c>a) ) { repeat = b; }
        // 23 1   ab + a...
        else if( (b>a) && (a>c) ) { repeat = a; }
        // 12 3   a + repeat (b+1)a
        else if( (c>b) && (b>a) ) { [a,b] = (parseInt(a+b)+1).toString().split(''); second = a; repeat = b+a; }
        // 31 2 / 13 2   a + repeat b+1
        else { [a,b] = (parseInt(a+b)+1).toString().split(''); second = a; repeat = b; }
        return ( first + second + repeat.repeat(length) ).slice(0, length);
    }

    // set default offer to restocking haggle price
    const asking = $('#shopkeeper_makes_deal').text().replaceAll(',','').match(/\d+(?= Neopoints)/)?.[0];
    if(asking) { setOffer(restockHaggle(asking)); }

    // autocomplete off
    $('input[name="current_offer"]').attr('autocomplete', 'off');

    // set offer by % of asking price
    const percentages = [25, 50, 75, 33, 66, 99, 100];
    $('#shopkeeper_makes_deal').append('<p style="font-family: monospace; font-weight: normal; letter-spacing: 1px; color: #888;">%:' +
                                       percentages.map(i => `<a href="##" class="offerpercent">${i}</a>` ).join(' ') + '</p>');
    $('.offerpercent').click((e) => {
        setOffer(parseInt(asking * e.target.text / 100));
    })
}
