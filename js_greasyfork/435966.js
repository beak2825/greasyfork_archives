// ==UserScript==
// @name BITSLER ROLLHUNT BOUNTY SCRIPT
// @name:en BITSLER ROLLHUNT BOUNTY SCRIPT
// @version 14.882281-Release
// @description The best BITSLER SCRIPT
// @description:en 2
// @copyright 2019, ADMINBITSLERAHUESOS
// @author ADMINBITSLERAHUESOS
// @match https://www.bitsler.app/*/dice
// @match https://www.bitsler.com/*/dice
// @grant none
// @license MIT
// @namespace 1
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/435966/BITSLER%20ROLLHUNT%20BOUNTY%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/435966/BITSLER%20ROLLHUNT%20BOUNTY%20SCRIPT.meta.js
// ==/UserScript==



(function ()
{
    'use strict';
    window.addEventListener('load', function()
    {
            for (let i = 0; i < 10; i++)
            {
                var input = document.createElement("input");
                input.type = "text";
                input.id  = "roll"+i;
                input.size = 5;
                document.querySelector("#game-controls-box").appendChild(input);
            }
        var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id  = "work";
            document.querySelector("#game-controls-box").appendChild(checkbox);
        demo();
    }, false);
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
async function demo()
{
    while(true)
    {
        await sleep(1500);
            var rolls = [];
            for (let i = 0; i < 10; i++)
            {
                var roll = parseFloat(document.querySelector('#roll'+i).value);
                if(!isNaN(roll))
                {
                    rolls.push(roll);
                }
            }
            if(rolls.length>0)
            {
                var matches = document.querySelectorAll('div.di-bg > div > div.game-top > div.di-top-wrapper.clearfix > div > ul > li');
                matches.forEach(function(item, i, matches)
                {
                    var roll_id = parseFloat(item.getElementsByTagName('a')[0].href.replace(/\D/g,""));
                    var roll_number = parseFloat(item.getElementsByTagName('span')[0].innerText);
                    rolls.forEach(function(itm, j, rolls)
                    {
                        if(Math.abs(itm-roll_number)<=0.05)
                        {
                            if(document.querySelector('#work').checked)
                            {
                                if(Math.abs(itm-roll_number)==0)
                                {
                                                            for (let y = 0; y < 10; y++)
                                                            {
                                                                var roll = parseFloat(document.querySelector('#roll'+y).value);
                                                                if(!isNaN(roll))
                                                                {
                                                                    if(Math.abs(roll-roll_number)<=0.05)
                                                                    {
                                                                        document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('#msg-input').value='#'+roll_id+' '+roll_number;
                                                                        console.log('#'+roll_id+' '+roll_number);
                                                                    }
                                                                }
                                                            }
                                }
                            }
                            else
                            {
                                                                                            for (let y = 0; y < 10; y++)
                                                            {
                                                                var roll = parseFloat(document.querySelector('#roll'+y).value);
                                                                if(!isNaN(roll))
                                                                {
                                                                    if(Math.abs(roll-roll_number)<=0.05)
                                                                    {
                                                                        document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('#msg-input').value='#'+roll_id+' '+roll_number;
                                                                        console.log('#'+roll_id+' '+roll_number);
                                                                    }
                                                                }
                                                            }
                            }

                        }
                    });
                });
            }
    }
}
})();