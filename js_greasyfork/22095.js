// ==UserScript==
// @name         Agar.io Feed Macro + Split Hotkeys + Rip Ads
// @namespace    Double Split, Triple Split, 16 Split Hotkeys And Quicker Feeding
// @version      8.5
// @description  Y - Double Split -|- U - Triple Split -|- T - 16 Split -|- E - Feed
// @author       Silf
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22095/Agario%20Feed%20Macro%20%2B%20Split%20Hotkeys%20%2B%20Rip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/22095/Agario%20Feed%20Macro%20%2B%20Split%20Hotkeys%20%2B%20Rip%20Ads.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> for macro feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>Y</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_y'> Press <b>U</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_t'> Press <b>T</b> to 16 Split</span></span></center>";
load();
function load() {
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 89) { // Change 89[Y] To Whichever Keycode You Want To Change The Double Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 85) { // Change 85[U] To Whichever Keycode You Want To Change The Triple Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 8;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 84) {  // Change 84[T] To Whichever Keycode You Want To Change The 16 Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // Change 69[E] To Whichever Keycode You Want To Change The Quick Feeding Macro
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // 87 - W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

$('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross, .us-elections').hide().css({ 'visibility': 'hidden' });
$('#region').val('').css({ 'display': 'block' });
$('#adsBottom').remove();
$('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross, .us-elections, .agario-promo-container').on('show', function() {
	setTimeout(function() { $('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross, .us-elections, .agario-promo-container').hide(); }, 50);
});