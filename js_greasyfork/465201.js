

    // ==UserScript==
    // @name         Zim
    // @namespace   zero.rw.torn
    // @version      0.5
    // @description  Generates RW Template
    // @author       -zero [2669774]
    // @match        https://www.torn.com/forums.php*
    // @match        https://www.torn.com/item.php*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465201/Zim.user.js
// @updateURL https://update.greasyfork.org/scripts/465201/Zim.meta.js
    // ==/UserScript==



    const api = '';

    var apData;


    // DO NOT CHANGE ANYTHING BELOW

    var result = ``;

    const but = `<button class='torn-btn' id='templateZero'>GENERATE</button>`;

    async function generate(){
        apData = JSON.parse(localStorage.getItem('apData') || '{}');
        $('#templateZero').addClass('disabled');
        $('#templateZero').prop('disabled',true);

        console.log('generating!');
        var bazpi = `https://api.torn.com/user/?selections=bazaar&key=${api}&comment=Zim`;
        var bazD = await $.getJSON(bazpi);
        var colors = {'Orange':'#f76707','Red':'#f03e3e','Yellow':'#f59f00'};
        console.log(Object.keys(apData));

        for (var itemNo in bazD.bazaar){
            var item = bazD.bazaar[itemNo];

            var itemId = String(item.UID);

            if (itemId){
                var name = item.name;
                var price = parseInt(item.price/100000);
                price = price.toLocaleString("en-US");

                var itemURL = `https://api.torn.com/torn/${itemId}?selections=itemdetails&key=${api}&comment=Zim Data`;
                var bonuses = [];
                console.log(apData + ' ' + itemId +' '+ Object.keys(apData).includes(String(itemId)));

                if (Object.keys(apData).includes(itemId)){
                    console.log('Found');
                    result += apData[itemId];
                    continue;
                }

                console.log('Checking ' + itemId);
                var itemD = await $.getJSON(itemURL);
                if (itemD.error){
                    console.log(itemD.error);
                    continue;
                }
                var type = itemD.itemdetails.type;
                var rarity =itemD.itemdetails.rarity || 'None';

                var color = colors[rarity] || '#ffffff';
                var dmg = itemD.itemdetails.damage || 'None';
                var acc = itemD.itemdetails.accuracy || 'None';
                var quality = itemD.itemdetails.quality || 'None';

                for (var bonus in itemD.itemdetails.bonuses){
                    var bonusN = itemD.itemdetails.bonuses[bonus].bonus;
                    var bonusV = itemD.itemdetails.bonuses[bonus].value;
                    bonuses.push(bonusV + '% '+bonusN);
                }
                var fbonus = bonuses.join(' / ');

                var tresult = `[color=${color}][size=14][b]${name} [/b][/size][/color](${type}) Q: [size=12]${quality}%[/size] [color=#4263eb][size=14][B]${fbonus} [/b][/size][/color][size=12]Dmg: ${dmg} Acc: ${acc}[/size][size=12] [/size][color=#74b816][size=14][b]£${price}[/b][/size][/color]
                `;

                result += tresult;
                apData[itemId] = tresult;

            }
        }

        localStorage.setItem('apData', JSON.stringify(apData));
        // console.log(result);

        navigator.clipboard
            .writeText(result)
            .then(() => {
            alert("successfully copied");
            $('#templateZero').removeClass('disabled');
            $('#templateZero').prop('disabled',false);
        })
            .catch(() => {
            alert("something went wrong");
        });




    }

    function insert(){
        if ($('#forums').length > 0){
            $('.content-title > h4').append(but);
            $('#templateZero').on('click', generate);

        }
        else{
            setTimeout(insert, 300);
        }
    }

    (function() {
        'use strict';
        insert();

        // Your code here...
    })();

