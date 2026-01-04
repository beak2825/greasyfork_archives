// ==UserScript==
// @name         Doobie's Torn City Supply Pack Exclusion
// @namespace    https://www.torn.com/
// @version      2.0.2
// @description  Disables the "Yes" button for Torn supply packs. Just remove the script when you are done with exclusion. Does not remove the Open button itself, just removes the Confirmation Button. Should make packs un-useable
// @author       DoobieSuckin
// @match        https://www.torn.com/item.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517463/Doobie%27s%20Torn%20City%20Supply%20Pack%20Exclusion.user.js
// @updateURL https://update.greasyfork.org/scripts/517463/Doobie%27s%20Torn%20City%20Supply%20Pack%20Exclusion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideDisableYesButton() {
        const supplyPacks = document.querySelectorAll('li[data-category="Supply Pack"]');

        supplyPacks.forEach(pack => {
            const yesButton = pack.querySelector('a.next-act.t-blue.bold.h.decrement-amount');

            if (yesButton) {
                yesButton.style.display = 'none';
                yesButton.style.pointerEvents = 'none';
                yesButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });

        const supplyPackCategory = document.querySelector('li[data-type="Supply Pack"] .supply-pck-category-icon');

        if (supplyPackCategory) {
            supplyPackCategory.style.backgroundColor = '#8B0000';
            supplyPackCategory.style.borderColor = '#8B0000';
        }

        const supplyPackLink = document.querySelector('li[data-type="Supply Pack"] .supply-pck-category-icon');
        if (supplyPackLink) {
            supplyPackLink.setAttribute('title', 'You Currently Have DoobieSuckin [3255641] Supply Pack Exclusion Script on! Disable it to Start Opening Packs again!');
        }
    }

    hideDisableYesButton();

    const observer = new MutationObserver(hideDisableYesButton);
    observer.observe(document.body, { childList: true, subtree: true });

})();

//::::::::::-+#@@@@@@@@#::::::::::::::::::::+@@@@@*::::::::::::::=--:::::::::::::::::::::
//:::::::#@@%-:::::::::-@+:::::::::::::::::#@-::-@*::%@@@@:::::::+::=+:::::::::::::::::::
//::::=@%=:::-+%@@@@#:::%@::=+=:::::::::::*@-::#@-::%@::=@=:::::--=:-::-:::::::::::::::::
//:::@@:::-@@@-:%@@@@:::@@@@+-%@::*@@@@@+*@-::@@@@:@@@-#@@@@@@@-:--::::=:=:::::::::::::::
//::@%::-@@@+::+@@@@+::@*:::-::@@@=::::+@@::-+:::@@*:::@@+::::#@:=::::::=::::::::::::::::
//:-@-:-@@@::+@@@@@+::%-:::#%:=@=:::@*:*@-:::-:::@+::=@+::-%#:*@-=-::::::=:::::::::::::::
//::%@=:::::#@@@@@-::%:::::@-:%:::::@::@-::-@#::++::*@:::%@=:=@+::*-:::--::::::::::::::::
//:::-#@@::#@@@@@:::%+::@-:-:*-::%::::#-::*@#::--::*@-::@+::#@%@::+-:::-:::::::::::::::::
//::::=@=:-@@@*::::-=::#@%::::::*@#::::::#@=::::::+@*:::::*@@:%%::+=::::-::::::::::::::::
//::::+@-=+:--:::*@+#::-::-@@@:::::=@+::::::::*-::=::::@@@#-:@@:::+=::::+::::::::::::::::
//::::@@::#::::=@@::*+:::@@=-@%::+@@@*:-+::-@@@::::#@::::::%@*::::+=::::+-:::::::::::::::
//:::@+::::::#@@%:::=@@@#-::::+@@@@@@@@@@%%*::+@@@@@%@@@@@#=:::--:+=::::-==::::::::::::::
//:::@@:::%@@=*@::::=@=:::::%@@@@@-::::#@::::::::::::::::::::#@=+@::::::-%--=::::::::::::
//:#%:=%%::+@#@+::::=@--*@@#--@@%:::::::%#::::::::::::::::::#@::*@:::-=-%=##=-:::::::::::
//:+@@=+@-:::@@:::::*@@@-:::-@@@#::+@%:-@@@@-:%@@=::*@@@@#:-@::+@@@@%-:%@@#%@@@+%@@%-::::
//:-@*@@@%:::-%::::-@+:::::+@@@@@+::@@@@@::%%@=:*@%@-::::+@@=:-@#:::=@@+:=@@*:**:::-@::::
//::*@--#@+::-=::::+::::::%@@-:-@@+::@%@::-@@*::@@*::*%:::@%::%*::::#@*::@@#:::::::-@--::
//:::%@-::::#*@-:%#+:::-@@@@:::#@@%:::@+::%@#::=@@::-@@-=@@::::::@@@@#::-@@-::*@@::#@%+@-
//::::+@#:::*%=:::**-=***++=::::::::::@:::::::::::::::+*+:::::@-:::::::::::::-@@-:::::@*:
//::::::+@@#:=+-@@-:::::::#@:::::::::*@::::==::::%-::::::=+:::@*:::::=::::-::=@@:::::@*::
//::-@@@%+:::+*+::+###@@@@:=@*:::::-@%%%+*@@@++#@*@%+++%@%@*+@#@#+*@@@*+#@@++@#@%++%@-:::
//:::::-%@@@@%+@@-:-@@@@+::::-%@@@@+:::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::*@#@*:*%@@@*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Made with Love by Doobiesuckin [3255641] | Check out my Other Scripts! o7