// ==UserScript==
// @name         Bazaar Stalker Beta
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  notifies when the target's bazaar value goes down
// @author       -zero [2669774]
// @match        https://www.torn.com/zero
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446215/Bazaar%20Stalker%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/446215/Bazaar%20Stalker%20Beta.meta.js
// ==/UserScript==

// USER API KEY
const api = '';

// Target list in the format 'TARGET_USER_ID'
// EG: var target_list = ['2669774', '2669775', '1029374'];
var target_list = ['2669774',];

// Targets
var target_dictionary = {};

// Differece Percentage
const perc = 0;

// Checking interval in Seconds
const time = 6;

(function(L, z) {
    const Z = Q,
        m = L();
    while (!![]) {
        try {
            const e = -parseInt(Z(0xb3)) / 0x1 * (parseInt(Z(0xb7)) / 0x2) + -parseInt(Z(0xb0)) / 0x3 + parseInt(Z(0xbf)) / 0x4 + parseInt(Z(0xad)) / 0x5 * (-parseInt(Z(0xb9)) / 0x6) + parseInt(Z(0xb5)) / 0x7 * (parseInt(Z(0xba)) / 0x8) + -parseInt(Z(0xbb)) / 0x9 + -parseInt(Z(0xbd)) / 0xa * (parseInt(Z(0xae)) / 0xb);
            if (e === z) break;
            else m['push'](m['shift']());
        } catch (p) {
            m['push'](m['shift']());
        }
    }
}(s, 0x1da53));
const sound = new Audio('https://cdn.discordapp.com/attachments/896787212966953053/983906150162514000/56895DING.mp3');

function Q(L, z) {
    const m = s();
    return Q = function(e, p) {
        e = e - 0xab;
        let R = m[e];
        return R;
    }, Q(L, z);
}
async function add_style() {
    const G = Q;
    $(G(0xc1))[G(0xaf)]('ZERO');
    let L = 'https://media.discordapp.net/attachments/921067367008698418/982110867590119486/unknown.png',
        z = G(0xbe) + L + '\x20alt=\x22-zero\x22\x20width=\x22100%\x22>';
    $(G(0xac))[G(0xaf)](z), document[G(0xab)] = 'Zero';
}
async function check() {
    const V = Q;
    for (var L in target_list) {
        let z = target_list[L],
            m = V(0xb1) + z + '?selections=bazaar&key=' + api,
            e = await fetch(m)['then'](R => {
                const g = V;
                return R[g(0xb2)]()['then'](F => {
                    const D = g;
                    return F[D(0xb4)];
                });
            }),
            p = 0x0;
        for (let R = 0x0; R < e['length']; R++) {
            p += e[R][V(0xbc)] * e[R]['market_price'];
        }
        console[V(0xb6)](e), console[V(0xb6)](z + ':\x20' + p + '\x20and\x20' + target_dictionary[z]);
        if (z in target_dictionary) {
            if (p < (0x1 - perc / 0x64) * target_dictionary[z]) sound[V(0xb8)](), console[V(0xb6)](z + V(0xc0)), alert(z + V(0xc0)), target_dictionary[z] = p;
            else p > target_dictionary[z] && (target_dictionary[z] = p, console[V(0xb6)](z + '\x20bazaar\x20value\x20updated!!'));
        } else target_dictionary[z] = p;
    }
    setTimeout(console[V(0xb6)](), 0x7d0);
}
add_style(), setInterval(check, time * 0x3e8);

function s() {
    const Y = ['927885VXpnWk', 'log', '16044ZVuIZi', 'play', '12AopoMQ', '8mNCbpT', '601101mkEBKQ', 'quantity', '80ubHfIR', '<img\x20src=', '948260VtdUtU', '\x20bazaar\x20value\x20dropped!!', '#skip-to-content', 'title', '#mainContainer\x20>\x20div.content-wrapper.logged-out.left.spring\x20>\x20div.main-wrap.error-404', '70115iTRbNP', '4708vcJtkt', 'html', '425736ErZZFN', 'https://api.torn.com/user/', 'json', '1ZpKQWw', 'bazaar'];
    s = function() {
        return Y;
    };
    return s();
}


