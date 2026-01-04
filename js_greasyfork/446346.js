// ==UserScript==
// @name         Automatic Click Copy.ai
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatic click the Copy.ai button 
// @author       ensky
// @supportURL   https://ensky.tech/automatic-click-copy-ai/
// @match        *://app.copy.ai/*
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446346/Automatic%20Click%20Copyai.user.js
// @updateURL https://update.greasyfork.org/scripts/446346/Automatic%20Click%20Copyai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***********************config code********************************/

    //define how many second you want to click the "Create Copy" button
    var autmatic_click_delay=5;

    /**********************config stop**********************************/

    const google_next_serp_wait=ms=>new Promise(resolve=>setTimeout(resolve, ms));
    var if_click_generate=true;
    var if_click_make_more=true;

    async function automatic_create_more()
    {
        while(if_click_generate)
        {
            console.log("while loop start");

            var make_more=$('[data-testid="make-more"]').text();

            if(make_more=='')
            {
                console.log("make more is null");
            }

            if(make_more=="Make More")
            {
                console.log("make more button:"+make_more);
                console.log("Data Is Coming, Stop Automatic Click");
                if_click_generate=false;
            }

            if(if_click_generate==true)
            {
                var create_copy=$('[data-testid="create-copy"]').text();
                console.log("value is:"+create_copy);
                $('[data-testid="create-copy"]').click();
            }

            //delay 5 seconds
            await google_next_serp_wait(autmatic_click_delay*1000);
        }

        console.log("exit while loop");
    }

    async function automatic_make_more()
    {
        var make_more_counter=0;
        while(if_click_make_more)
        {
            console.log("make more loop start");
            console.log("if_click_make_more value:"+if_click_make_more);

            if(if_click_make_more==true)
            {
                var make_more=$('[data-testid="make-more"]').text();
                $('[data-testid="make-more"]').click();
                console.log("Make More Counter:"+make_more_counter);
            }

            //delay 5 seconds
            await google_next_serp_wait(autmatic_click_delay*1000);
        }

        console.log("exit make more loop");
    }

    //for the first time of "Create More"
    automatic_create_more();

    //show the click button
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="0px"
    Container.style.top="0px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<button id="copy_ai_start_button" style="position:absolute; background-color: #7ED321; font-size:15px; width:110px; height:40px; left:140px; top:0px">
  Create More
</button>

<button id="copy_ai_start_make_more" style="position:absolute; background-color: #ff9921; font-size:13px; width:110px; height:40px; left:140px; top:50px">
  Make More Start
</button>

<button id="copy_ai_stop_make_more" style="position:absolute; background-color: #ff9921; font-size:13px; width:110px; height:40px; left:140px; top:100px">
  Make More Stop
</button>
`
    document.body.appendChild(Container);

    //bind the button on the HTML
    copy_ai_start_button.onclick = function (){
        console.log("Automatic Click Start");
        if_click_generate=true;
        automatic_create_more();
    };

    //bind the button on the HTML
    copy_ai_start_make_more.onclick = function (){
        console.log("Make More Start");
        if_click_make_more=true;
        automatic_make_more();
    };

    //bind the button on the HTML
    copy_ai_stop_make_more.onclick = function (){
        console.log("Make More Stop");
        if_click_make_more=false;
    };

})();