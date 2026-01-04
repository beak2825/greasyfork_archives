// ==UserScript==
// @name         DF Ammo Boxer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculate ammo box price for you
// @author       IYNH
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426492/DF%20Ammo%20Boxer.user.js
// @updateURL https://update.greasyfork.org/scripts/426492/DF%20Ammo%20Boxer.meta.js
// ==/UserScript==

(function() {

    var finalValue = 9999;
    var cbPerBoxValue = GM_getValue('cbPerBoxValue');
    if(typeof cbPerBoxValue !== "boolean") {
        cbPerBoxValue = false;
    }

    var pricePerBox = GM_getValue('pricePerBox');
    if(!pricePerBox) {
        pricePerBox = {};
    }
    var pricePerBullet = GM_getValue('pricePerBullet');
    if(!pricePerBullet) {
        pricePerBullet = {};
    }

    'use strict';

    // CSS stuff
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    GM_addStyle(`.ammo-boxer-input {
                 width: 63px;
                 color: #ffff00
               }`);
    GM_addStyle(`.ammo-boxer-label, .ammo-boxer-label-2 {
                 color: black
                }`);

    // Main UI
    $("body").append ( `
    <div id="ammoBoxerDraggable" style="position: absolute; top: 300px; right: 0px; width: 220px;">
      <input type="checkbox" id="cbPerBox" value="cbPerBox">
      <label for="cbPerBox">Use Cost per Standard Box</label><br/>
      <input type="checkbox" id="cbAutoFill" value="cbAutoFill" checked>
      <label for="cbAutoFill">Auto Fill Price</label>
      <div id="ammoBoxerTabs">
         <ul>
           <li><a href="#tabs-1Handgun">Handgun</a></li>
           <li><a href="#tabs-2Rifle">Rifle</a></li>
           <li><a href="#tabs-3Shotgun">Shotgun</a></li>
           <li><a href="#tabs-4Explosive">Explosive</a></li>
           <li><a href="#tabs-5Gas">Fuel</a></li>
         </ul>
         <div id="tabs-1Handgun" style="padding: 1px">
           <table>
             <tr>
               <td class="ammo-boxer-label" style="width: 50px;">.32</td>
               <td><input id="input32ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">9mm</td>
               <td><input id="input35ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.357</td>
               <td><input id="input357ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.38</td>
               <td><input id="input38ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.40</td>
               <td><input id="input40ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.45</td>
               <td><input id="input45ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.50</td>
               <td><input id="input50ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">.55</td>
               <td><input id="input55ammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
           </table>
         </div>
         <div id="tabs-2Rifle" style="padding: 1px">
           <table>
             <tr>
               <td class="ammo-boxer-label" style="width: 50px;">5.5mm</td>
               <td><input id="input55rifleammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">7.5mm</td>
               <td><input id="input75rifleammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">9mm</td>
               <td><input id="input9rifleammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">12.7mm</td>
               <td><input id="input127rifleammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">14mm</td>
               <td><input id="input14rifleammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
           </table>
         </div>
         <div id="tabs-3Shotgun" style="padding: 1px">
           <table>
             <tr>
               <td class="ammo-boxer-label" style="width: 50px;">20 G</td>
               <td><input id="input20gaugeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">16 G</td>
               <td><input id="input16gaugeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">12 G</td>
               <td><input id="input12gaugeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">10 G</td>
               <td><input id="input10gaugeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
           </table>
         </div>
         <div id="tabs-4Explosive" style="padding: 1px">
           <table>
             <tr>
               <td class="ammo-boxer-label" style="width: 50px;">Light</td>
               <td><input id="inputgrenadeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
             <tr>
               <td class="ammo-boxer-label">Heavy</td>
               <td><input id="inputheavygrenadeammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
           </table>
         </div>
         <div id="tabs-5Gas" style="padding: 1px">
           <table>
             <tr>
               <td class="ammo-boxer-label" style="width: 50px;">Gasoline</td>
               <td><input id="inputfuelammo" class="ammo-boxer-input" type="number" min="0" max="999999999" />
               <td class="ammo-boxer-label-2">per bullet</td>
             </tr>
           </table>
         </div>
      </div>
    </div>
    <script type="javascript">

    </script>`);

    $("#ammoBoxerDraggable").draggable();
    $("#ammoBoxerTabs").tabs();
    $("#cbPerBox").attr("checked", cbPerBoxValue);
    loadAmmo(cbPerBoxValue);

    // Load ammo type
    function loadAmmo(perBox) {
        let priceSource;
        if(perBox) {
            //load value per box
            priceSource = pricePerBox;
            $("#tabs-1Handgun td.ammo-boxer-label-2").html("per 1600");
            $("#tabs-2Rifle td.ammo-boxer-label-2").html("per 1200");
            $("#tabs-3Shotgun td.ammo-boxer-label-2").html("per 800");
            $("#tabs-4Explosive td.ammo-boxer-label-2").html("per 400");
            $("#tabs-5Gas td.ammo-boxer-label-2").html("per 4546");
        } else {
            //load value per bullet
            priceSource = pricePerBullet;
            $("td.ammo-boxer-label-2").html("per bullet");
        }
        $("input.ammo-boxer-input").each(function() {
            var inputValue = priceSource[$(this).attr("id")];
            inputValue = inputValue ? inputValue : "";
            $(this).val(inputValue);
        });
    }

    // Change input type with cbPerBox
    $("#cbPerBox").change(function() {
        cbPerBoxValue = $("#cbPerBox").prop("checked");
        GM_setValue("cbPerBoxValue", cbPerBoxValue);
        loadAmmo(cbPerBoxValue);
    });

    // Save ammo value
    $("input.ammo-boxer-input").keyup(function(e) {
        var inputId = e.target.id;
        var inputValue = e.target.value;
        if(inputValue && !isNaN(inputValue)) {
            if(cbPerBoxValue) {
                //Save value per box
                pricePerBox[inputId] = inputValue;
                GM_setValue("pricePerBox", pricePerBox);
            } else {
                //Save value per bullet
                pricePerBullet[inputId] = inputValue;
                GM_setValue("pricePerBullet", pricePerBullet);
            }
        }
    });

    // Display recommended price on infobox display
    var infoBox2 = $("#infoBox");
    function calculateRecommendedPrice(itemSource) {
        var boxType = itemSource.getAttribute("data-type");
        var boxQuantity = itemSource.getAttribute("data-quantity");
        if(cbPerBoxValue) {
            //Save value per box
            let maxQuantity;
            switch (boxType) {
                case "32ammo":
                case "35ammo":
                case "357ammo":
                case "38ammo":
                case "40ammo":
                case "45ammo":
                case "50ammo":
                case "55ammo":
                    maxQuantity = 1600;
                    break;
                case "55rifleammo":
                case "75rifleammo":
                case "9rifleammo":
                case "127rifleammo":
                case "14rifleammo":
                    maxQuantity = 1200;
                    break;
                case "20gaugeammo":
                case "16gaugeammo":
                case "12gaugeammo":
                case "10gaugeammo":
                    maxQuantity = 800;
                    break;
                case "grenadeammo":
                case "heavygrenadeammo":
                    maxQuantity = 400;
                    break;
                case "fuelammo":
                    maxQuantity = 4546;
                    break;
                default:
                    maxQuantity = 1000;
                    break;
            }
            var boxValue = pricePerBox["input".concat(boxType)];
            boxValue = boxValue ? boxValue : 0;
            return Math.round(boxValue / maxQuantity * boxQuantity);
        } else {
            //Save value per bullet
            var bulletValue = pricePerBullet["input".concat(boxType)];
            return Math.round(bulletValue * boxQuantity);
        }
    }

    function displayRecommendedPrice() {
        if(infoBox2.css('visibility') === 'visible' && $("#infoBox div.ammoBoxerTooltip").length == 0 && curInfoItem && curInfoItem.getAttribute("data-itemtype") === "ammo") {
            finalValue = calculateRecommendedPrice(curInfoItem);
            infoBox2.append(`<div class="itemData ammoBoxerTooltip" style="color: yellow;">Calculated Price: $` + finalValue + `</div>`);
        }
    }

    $("#inventoryholder").on("mousemove", function(){
        displayRecommendedPrice();
    });

    // Auto insert price
    var promptObserver = new MutationObserver(function(mutationList) {
       mutationList.forEach(function(mutation) {
           if( $("#cbAutoFill").prop("checked") && mutation.oldValue == "display: none;" && document.querySelector('input.moneyField') != null && curInfoItem && curInfoItem.getAttribute("data-itemtype") === "ammo") {
               $("input.moneyField").val(finalValue);
               $("input.moneyField").trigger("input");
           }
       });
    });

    var target = document.querySelector('#prompt');
    promptObserver.observe(target, {
        attributeFilter: ["style"],
        attributeOldValue: true
    });
})();