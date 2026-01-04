
(function() {
    'use strict';
    // Replace the values with your hats, or leave them be.
    var _hats = {
        "96": 3,  // Numpad 0; Hat 0/Nothing
        "97": 7,   // Numpad 1; Hat 7/Bull
        "98": 6,   // Numpad 2; Hat 6/Soldier
        "99": 52,  // Numpad 3; Hat 52/Theif
        "100": 31, // Numpad 4; Hat 31/Fish
        "101": 53, // Numpad 5; Hat 53/turret
        "102": 11, // Numpad 6; Hat 1118/Spike
        "103": 22, // Numpad 7; Hat 22/Emp
        "104": 12, // Numpad 8; Hat 12/Speed
        "105": 40, // Numpad 9; Hat 40/Tank1 q 1
        "106": 15, // Numpad * ; hat 15/Winter Cap
        "111": 8, //  Numpad / ; hat 8/Bummle for police hat
        "109": 1, //Numpad - ; hat 1/Marksman for insta
        "110": 10, // Numpad . ;hat10/Bush
        "107": 55, // NUmpad + ;hat 55/Thirster

    };
    var hats = Object.keys(_hats);

    document.onkeydown = function (e) {
        // Does storeEquip exist?
        if (typeof storeEquip === "function") {
            // Yes, it does.
            var len = hats.length;
            var k = e.keyCode;
            if (_hats[k]) {
                storeBuy(_hats[k]);
                storeEquip(_hats[k]);
            }
        }
    }
})();