// ==UserScript==
// @name         Bazaar 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test
// @author       You
// @match        https://www.torn.com/zero
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446166/Bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/446166/Bazaar.meta.js
// ==/UserScript==

// USER API KEY
const api = '';

// Target list
var target_list = ['2669774'];

// Targets
var target_dictionary = {};

// Differece Percentage
const perc = 0;

// Checking interval in Seconds
const time = 6;

const sound = new Audio('https://cdn.discordapp.com/attachments/896787212966953053/983906150162514000/56895DING.mp3');


async function add_style(){
    $('#skip-to-content').html('ZERO');

    let img_ad =  'https://media.discordapp.net/attachments/921067367008698418/982110867590119486/unknown.png';
    let new_icon = `<img src=${img_ad} alt="-zero" width="100%">`;
    $('#mainContainer > div.content-wrapper.logged-out.left.spring > div.main-wrap.error-404').html(new_icon);
    document.title = "Zero";

}

async function check(){
    for (var index in target_list){
        let target = target_list[index];

        let url = `https://api.torn.com/user/${target}?selections=bazaar&key=${api}`;
        let new_data = await fetch(url).then(data =>
                                                 {return data.json().then(dat =>
                                                                   {return dat.bazaar;
                                                                   });
                                                 });


        let sum = 0;
        for (let i=0; i < new_data.length; i++){
            sum += new_data[i].quantity * new_data[i].market_price;
        }
        console.log(new_data);
        console.log(`${target}: ${sum} and ${target_dictionary[target]}`);

        if (target in target_dictionary){


            if (sum < (1-perc/100) * target_dictionary[target]){
                sound.play();
                console.log(`${target} bazaar value dropped!!`);
                alert(`${target} bazaar value dropped!!`)
                target_dictionary[target] = sum;
            }
            else if (sum > target_dictionary[target]){
                target_dictionary[target] = sum;
                console.log(`${target} bazaar value updated!!`);
            }
        }
        else {
            target_dictionary[target] = sum;
        }


    }
    setTimeout(console.log(), 2000);
}



// initialise();
add_style();
setInterval(check, time*1000);


