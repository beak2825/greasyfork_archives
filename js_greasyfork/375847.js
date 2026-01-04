// ==UserScript==
// @name         Lingsoft Taimeri helper
// @namespace    sami@kankaristo.fi
// @version      1.1.0
// @description  Auto-fill the non-changing form parts in Lingsoft's Taimeri
// @author       sami@kankaristo.fi
// @match        https://taimeri.lingsoft.fi/Projekti/Kirjaus.aspx*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/375847/Lingsoft%20Taimeri%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375847/Lingsoft%20Taimeri%20helper.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Lingsoft Taimeri helper";


// Set info here
/**/
// Ellibs
var tilausnumero = "PO1304 / P0029";
var asiakas = "Ellibs Oy";
var projekti = "IT Ellibs";
var vaihe = "3. Kehitys";
/*/
// E-kirjasto
var tilausnumero = "PO1259 / P0188";
var asiakas = "Ellibs Oy";
var projekti = "230307 E-library with SimplyE";
var vaihe = "3. Development";
// */

///
/// Select an option from a dropdown.
///
function SelectOption(selectElement, index, optionName) {
    if (selectElement == null) {
        return;
    }
    
    if (index != null) {
        selectElement.value = selectElement.options[index].value;
        selectElement.options[index].selected = true;
        if (selectElement.onchange != null) {
            selectElement.onchange();
        }
        
        return;
    }
    
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text == optionName) {
            selectElement.value = selectElement.options[i].value;
            selectElement.options[i].selected = true;
            if (selectElement.onchange != null) {
                selectElement.onchange();
            }
            
            return;
        }
    }
}


///
/// Fill the form.
///
function FillForm() {
    var asiakasInput = document.getElementById("ctl00_content_ctNewAsiakas");
    Util.Log("asiakasInput: ", asiakasInput);
    SelectOption(asiakasInput, null, asiakas);
    
    var tilausnumeroInput = document.getElementById("ctl00_content_ctTilausnumero");
    Util.Log("tilausnumeroInput: ", tilausnumeroInput);
    tilausnumeroInput.value = tilausnumero;
    
    setTimeout(
        function () {
            var projektiInput = document.getElementById("ctl00_content_ctNewProjekti");
            Util.Log("projektiInput: ", projektiInput);
            SelectOption(projektiInput, null, projekti);
            
            setTimeout(
                function () {
                    var vaiheInput = document.getElementById("ctl00_content_ctNewVaihe");
                    Util.Log("vaiheInput: ", vaiheInput);
                    SelectOption(vaiheInput, null, vaihe);
                },
                1000
            );
        },
        1000
    );
}


(
    function () {
        "use strict";
        
        setTimeout(FillForm, 200);
    }
)();
