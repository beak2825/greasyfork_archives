// ==UserScript==
// @name         virtualmanager.com - Show potential from training
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.4
// @description  Shows potential from training data
// @author       VeryDoc
// @match        https://www.virtualmanager.com/players/*/training*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualmanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474673/virtualmanagercom%20-%20Show%20potential%20from%20training.user.js
// @updateURL https://update.greasyfork.org/scripts/474673/virtualmanagercom%20-%20Show%20potential%20from%20training.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var shouldAutoClose = false;
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('auto');

    if (myParam == "true") {
        shouldAutoClose = true;
    }

    var average = document.getElementsByClassName('average')[0];
    average = average.getElementsByTagName("strong")[0].innerText;
    average = average.replace('+', '').replace(' xp', '');
    var bars = document.getElementsByClassName('bar');
    var bar_headers = bars[bars.length - 1].children[1].children[0];
    var trainingSize = bar_headers.children[0].innerText.split('-')[1].replace('\n', '').trim();
    var isTrainerUsed = bar_headers.children[1].innerText.replace('\n', '').replace('\n', '').trim();

    if (isTrainerUsed === 'En træner blev anvendt.') {
        isTrainerUsed = true;
    }
    else {
        isTrainerUsed = false;
    }

    var placement = document.getElementsByClassName('trainings')[0];

    var potential = getPotential(trainingSize, isTrainerUsed, average);

    if (shouldAutoClose && potential == 'Dårligt potentiale<br />⭐') {
        window.close();
    }

    let p = document.createElement("p");
    p.innerHTML = '<br />';
    p.innerHTML += 'Potentiale: ' + potential + '<br />';

    placement.append(p);
})();

function getPotential(trainingSize, isTrainerUsed, average) {
    var averageInt = parseInt(average);
    if (trainingSize === 'Græsplæne') {
        if (isTrainerUsed === false) {
            if (averageInt <= 21) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 21 && averageInt <= 51) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 51 && averageInt <= 66) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 66 && averageInt <= 81) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 81 && averageInt <= 96) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 96) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 36) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 36 && averageInt <= 66) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 66 && averageInt <= 81) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 81 && averageInt <= 96) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 96 && averageInt <= 111) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 111) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Lille baneanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 30) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 30 && averageInt <= 60) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 60 && averageInt <= 75) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 75 && averageInt <= 90) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 90 && averageInt <= 105) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 105) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 45) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 45 && averageInt <= 75) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 75 && averageInt <= 90) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 90 && averageInt <= 105) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 105 && averageInt <= 120) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 120) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Baneanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 39) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 39 && averageInt <= 69) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 69 && averageInt <= 84) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 84 && averageInt <= 99) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 99 && averageInt <= 114) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 114) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (average <= 54) {
                return 'Dårligt potentiale<br />⭐'
            } else if (average > 54 && averageInt <= 84) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 84 && averageInt <= 99) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 99 && averageInt <= 114) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 114 && averageInt <= 129) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 129) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Stort baneanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 48) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 48 && averageInt <= 78) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 78 && averageInt <= 93) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 93 && averageInt <= 108) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 108 && averageInt <= 123) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 123) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 63) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 63 && averageInt <= 93) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 93 && averageInt <= 108) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 108 && averageInt <= 123) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 123 && averageInt <= 138) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 138) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Udvidet baneanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 57) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 57 && averageInt <= 87) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 87 && averageInt <= 102) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 102 && averageInt <= 117) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 117 && averageInt <= 132) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 132) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 72) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 72 && averageInt <= 102) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 102 && averageInt <= 117) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 117 && averageInt <= 132) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 132 && averageInt <= 147) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 147) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Avanceret baneanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 66) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 66 && averageInt <= 96) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 96 && averageInt <= 111) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 111 && averageInt <= 126) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 126 && averageInt <= 141) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 141) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 81) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 81 && averageInt <= 111) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 111 && averageInt <= 126) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 126 && averageInt <= 141) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 141 && averageInt <= 156) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 156) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Standard træningsanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 75) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 75 && averageInt <= 105) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 105 && averageInt <= 120) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 120 && averageInt <= 135) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 135 && averageInt <= 150) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 150) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 90) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 90 && averageInt <= 120) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 120 && averageInt <= 135) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 135 && averageInt <= 150) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 150 && averageInt <= 165) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 165) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Stort træningsanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 84) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 84 && averageInt <= 114) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 114 && averageInt <= 129) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 129 && averageInt <= 144) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 144 && averageInt <= 159) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 159) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 99) {
                return 'Dårligt potentiale<br />⭐'
            } else if ( averageInt > 99 && averageInt <= 129) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 129 && averageInt <= 144) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 144 && averageInt <= 159) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 159 && averageInt <= 174) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 174) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Udvidet træningsanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 93) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 93 && averageInt <= 123) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 123 && averageInt <= 138) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 138 && averageInt <= 153) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 153 && averageInt <= 168) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 168) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 108) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 108 && averageInt <= 138) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 138 && averageInt <= 153) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 153 && averageInt <= 168) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 168 && averageInt <= 183) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 183) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Professionelt træningsanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 102) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 102 && averageInt <= 132) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 132 && averageInt <= 147) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 147 && averageInt <= 162) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 162 && averageInt <= 177) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 177) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 117) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 117 && averageInt <= 147) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 147 && averageInt <= 162) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 162 && averageInt <= 177) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 177 && averageInt <= 192) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 192) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
    if (trainingSize === 'Verdensklasse træningsanlæg') {
        if (isTrainerUsed === false) {
            if (averageInt <= 111) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 111 && averageInt <= 141) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 141 && averageInt <= 156) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 156 && averageInt <= 171) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 171 && averageInt <= 186) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 186) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        } else {
            if (averageInt <= 126) {
                return 'Dårligt potentiale<br />⭐'
            } else if (averageInt > 126 && averageInt <= 156) {
                return 'Udemærket potentiale<br />⭐⭐'
            } else if (averageInt > 156 && averageInt <= 171) {
                return 'Fornuftigt potentiale<br />⭐⭐⭐';
            } else if (averageInt > 171 && averageInt <= 186) {
                return 'Lovende potentiale<br />⭐⭐⭐⭐';
            } else if (averageInt > 186 && averageInt <= 201) {
                return 'Formidabelt potentiale<br />⭐⭐⭐⭐⭐';
            }
            else if (averageInt > 201) {
                return 'Enormt potentiale<br />⭐⭐⭐⭐⭐⭐'
            }
        }
    }
}