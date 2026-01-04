// ==UserScript==
// @name         Dailies + QOL
// @version      20250713
// @description  Auto Dailies
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535229/Dailies%20%2B%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/535229/Dailies%20%2B%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(`body`).append(`<style>
    .fakebutton {
    display: inline-block;
    background: #fece00;
    border-radius: 10px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    padding: 5px 10px;
    }
    .fakebutton:hover {
  animation: boobs 2s infinite;
    }
@keyframes boobs {
  from, to { transform: scale(1, 1); }
  25% { transform: scale(0.9, 1.1); }
  50% { transform: scale(1.1, 0.9); }
  75% { transform: scale(0.95, 1.05); }
}
.relu_loader {
  border: .5em solid #f3f3f3;
  border-radius: 50%;
  border-top: .5em solid #3498db;
  width: 3em;
  height: 3em;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
    </style>`)
    $(`.dailies.aio-section a[href="/lab/"]`).attr("href","https://www.grundos.cafe/lab2/")
    $('#aio-always-list [style="order:15"] a').attr("href","https://www.grundos.cafe/island/tradingpost/browse/")
    $('#aio-always-list [style="order:17"] a').attr("href","https://www.grundos.cafe/adopt/")
    $('#aio-quests-list [style="order:21"] a').attr("href","https://www.grundos.cafe/faerieland/employ/jobs/?page=1")
    $('#aio-timelies-list [style="order:4"] a').attr("href","https://www.grundos.cafe/games/kadoatery/?sort=True")
    $('#aio-always-list [style="order:21"] a').attr("href","https://www.grundos.cafe/rainbowpool/neopetcolours/")
    $('#aio-dailies-list [style="order:25"] a').attr("href","https://www.grundos.cafe/games/stockmarket/stocks/?bargain=True")
    $(`#aio-always-list`).append(`
    <a href="/plushies/?pet_name=Habi" style="background:#0c3" class="quicklink material-symbols-outlined">cruelty_free</a>
    <a href="/market/?page=1&sort=1" style="background:red" class="quicklink material-symbols-outlined">shopping_cart</a>
    <a href="https://www.grundos.cafe/safetydeposit/?page=3&category=18&min_rarity=0&max_rarity=999&sort=count&descending=1" style="background:blue" class="quicklink material-symbols-outlined">lock</a>
    <a href="https://www.grundos.cafe/dome/1p/select/" style="background:purple" class="quicklink material-symbols-outlined">swords</a>`)
    $(`#aio-games-list`).append(`
    <a href="https://www.grundos.cafe/games/neggsweeper/" style="background:blue" class="quicklink material-symbols-outlined">explosion</a`)



    var inventory_amount = $('.aio-inv-item').length;
    $('.aio-quantity-circle').each(function(index){
        var quantity = Number($(this).text()) - 1;
        inventory_amount += quantity

        if (index == $('.aio-quantity-circle').length - 1){
            $('.aio-items.aio-section').append(125 -62- inventory_amount)
        }
    })

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    var random1000_2000 = getRandomInt(1000, 2000);

    function dailyClick(url, button) {
        if (window.location.href.indexOf(url) > -1 && $(button).length == 1) {
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            $(button).css(`opacity`,0)
            setTimeout(function () {
                $(button).click()
            }, random1000_2000);
        }
    }
    function go_to_next_page(old_url, new_url) {
        if (window.location.href.indexOf(old_url) > -1) {
            setTimeout(function () {
                window.location.href = new_url;
            }, getRandomInt(0, 2000));
        }
    }


    if ( $('.bd_challenger_image').length == 0 ) {
        if (window.location.href == "https://www.grundos.cafe/halloween/" ||
            window.location.href =="https://www.grundos.cafe/water/index_ruins/" ){
            setTimeout(function () {
                $('img#top-header-image').click();
            }, getRandomInt(500, 1000));
        }

    }


    if (window.location.href.includes("/faerieland/employ/")){


        $(`.center:first`).append(`<br><a href="https://www.grundos.cafe/faerieland/employ/jobs/?page=1">Page 1</a> |
<a href="https://www.grundos.cafe/faerieland/employ/jobs/?page=2">Page 2</a> |
<a href="https://www.grundos.cafe/faerieland/employ/jobs/?page=3">Page 3</a> |
<a href="https://www.grundos.cafe/faerieland/employ/jobs/?page=4">Page 4</a> |
<a href="https://www.grundos.cafe/faerieland/employ/jobs/?page=5">Page 5</a>`)
    }

    if (window.location.href.includes("https://www.grundos.cafe/space/warehouse/shop/")){
        $(`span:contains(Cost: )`).each(function(){
            var cost = $(this).text().replace(",","");
            cost = Number(cost.substring(
                cost.indexOf(": ") + 2,
                cost.lastIndexOf(" WC")
            ));
            $(this).append(`<div style="color:purple">${Math.ceil(cost/150*250)}k NP</div>`)
        })
    }

    if (window.location.href.includes(`/games/stockmarket/buy/`)) {
        $('td.stock-table-submit').append(`<br>
        <div class="fakebutton" id="a250">250</div>
        <div class="fakebutton" id="a334">334</div>
        <div class="fakebutton" id="a333">333</div>
        <div class="fakebutton" id="a200">200</div>
        <div class="fakebutton" id="a500">500</div>`);

        $('td.stock-table-submit .fakebutton').click(function(){
            $(`input.half-width.form-control`).val( Number($(this).text()))
            setTimeout(function () {
                $('[value="Buy Shares"]').click();
            }, 100);
        })
    }

    if ( window.location.href.includes("https://www.grundos.cafe/safetydeposit/?page=1&query=") && window.location.href.includes("&exact=1") ) {
        $('.sdb-remove-one-text').hide()
        setTimeout(function () {
            $('.sdb-remove-one-text').click()
        }, 1000);
    }
    if ( window.location.href.includes("https://www.grundos.cafe/games/scarab21/") ) {

        setTimeout(function () {
            window.location.href = "https://www.grundos.cafe/games/scarab21/"
        }, getRandomInt(300000, 400000));
    }

    /*if ( window.location.href.includes("https://www.grundos.cafe/games/kadoatery/")){
        $(`.kad_name`).each(function(){
            console.log($(this).text())
            if ( $(this).text() == "Mew") {
                $(this).parent().css("border","10px solid blue");
                $(this).parent().find(`[alt="Shop Wizard Search"]`).click();
            }
        })
    }*/

    if ( window.location.href.includes("https://www.grundos.cafe/bank/")){
        var onhand = Number($(`#on-hand-np`).text().replaceAll(",",""));
        $(`.bg-footer:first`).parent().append(`<div class="fakebutton" id="leave200k">leave 200k</div>
    <div class="fakebutton" id="leave100k">leave 100k</div>
    <div class="fakebutton" id="leave50k">leave 50k</div>`);

        $(`#leave200k`).click(function(){
            $(`input#depositamount`).val(onhand - 200000);
            $(`[value="Deposit"]`).click();
        })
        $(`#leave100k`).click(function(){
            $(`input#depositamount`).val(onhand - 100000);
            $(`[value="Deposit"]`).click();
        })
        $(`#leave50k`).click(function(){
            $(`input#depositamount`).val(onhand - 50000);
            $(`[value="Deposit"]`).click();
        })
    }
    dailyClick("/medieval/symolhole/", `[value="Enter!"]`);


    dailyClick("/jelly/jelly/", `[value="Grab Some Jelly"]`);
    go_to_next_page("/jelly/take_jelly/", "https://www.grundos.cafe/prehistoric/plateau/omelette/")
    dailyClick("/prehistoric/plateau/omelette/", `[value="Grab Some Omelette"]`);
    go_to_next_page("/prehistoric/plateau/omelette/approach/", "https://www.grundos.cafe/desert/fruitmachine/")
    dailyClick("/desert/fruitmachine/", `[value="Spin The Wheel!!!"]`);
    go_to_next_page("/desert/fruitmachine2/", "https://www.grundos.cafe/faerieland/tdmbgpop/")
    dailyClick("/faerieland/tdmbgpop/", `[value="Talk to the Plushie"]`);
    go_to_next_page("/faerieland/tdmbgpop/visit/", "https://www.grundos.cafe/medieval/grumpyoldking/");


    dailyClick("/medieval/brightvale/wheel/", `[value="Spin the Wheel!"]`);
    dailyClick("/medieval/brightvale/wheel/", `[value="Collect your Prize"]`);

    if (window.location.href.indexOf(`/medieval/grumpyoldking/`) > -1) {
        $(`[value="Say Random Stuff!"]`).click()
        $('#question1').val('What');
        $('#question2').val('do');
        $('#question3').val('you do if');
        $('#question4').val('*Leave blank*');
        $('#question5').val('fierce');
        $('#question6').val('Grundos');
        $('#question7').val('*Leave blank*');
        $('#question8').val('has eaten too much');
        $('#question9').val('*Leave blank*');
        $('#question10').val('tin of olives');
        $('#wisdom6').val('nugget');

        setTimeout(function () {
            $(`[value="Tell the King Your Joke!"]`).click()
            $(`[value="Try Again?"]`).click()
        }, getRandomInt(0, 2000));

        if ( $(`body:contains(You should try again tomorrow.)`).length > 0 ) {
            setTimeout(function () {
                window.location.href = "https://www.grundos.cafe/medieval/wiseking/";
            }, getRandomInt(0, 2000));
        }

    }
    if (window.location.href.indexOf(`https://www.grundos.cafe/inventory/`) > -1) {
        setTimeout(function () {
            //  window.location.href = "https://www.grundos.cafe/inventory/"
        }, getRandomInt(0, 2000));
    }
    if (window.location.href.indexOf(`/medieval/wiseking/`) > -1) {
        setTimeout(function () {
            $(`[value="Impress the King!"]`).click()
        }, getRandomInt(0, 2000));

        if ( $(`h4:contains(King Hagan Says:)`).length > 0 ) {
            setTimeout(function () {
                window.location.href = "https://www.grundos.cafe/giveaways/";
            }, getRandomInt(0, 2000));
        }

    }

    if (window.location.href.indexOf(`/medieval/guessmarrow/`) > -1) {
        $(`input.form-control.third-width.match-button-size`).val(getRandomInt(300, 700));
        setTimeout(function () {
            $(`[value="Guess!"]`).click()
        }, getRandomInt(0, 2000));
    }


    dailyClick("/bank/", `[value*="Collect Interest ("]`);

    if ( $(`.smol-image[src="https://grundoscafe.b-cdn.net/misc/healingspring.png"]`).length > 0 && window.location.href.indexOf(`/faerieland/springs/`) < 1) {
        //  window.open(`https://www.grundos.cafe/faerieland/springs/`, '_blank');
    }

    dailyClick("/island/tombola/", `[value="Play Tombola!"]`);
    dailyClick("/medieval/pickyourown/index/", `[value="Click to Play!"]`);

    dailyClick("/faerieland/springs/", `[value="Heal My Pets"]`);
    if (window.location.href.includes("/faerieland/springs/")){
        $(`[value="Heal My Pets"]`).css("opacity",0);
    }

    if (window.location.href.indexOf(`/water/fishing/`) > -1) {
        var fishing_pet = $(`p:contains('s fishing skill is )`).text();
        fishing_pet = fishing_pet.substring(0,    fishing_pet.lastIndexOf("'s"));

        if (  $(`[value="Reel in Your Line"]`).length > 0 && $(`[title="${fishing_pet} is ready to fish!"]`).length == 1) {
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            setTimeout(function () {
                $(`[value="Reel in Your Line"]`).click()
            }, random1000_2000);
        } else if ( $(`img[title*=" is ready to fish!"]`).length > 0 && $(`[value="Cast Your Line Again"]`).length > 0 ) {
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            setTimeout(function () {
                $(`img[title*=" is ready to fish!"]:first`).click()
            }, random1000_2000);
        }
    }

    if (window.location.href.indexOf(`/medieval/potatocounter/`) > -1) {
        var potatoAmount;
        if ($(`[alt="Snowball Potato"]`).length > 0) {
            potatoAmount = $(`.center [alt="Snowball Potato"]`).length;
        }
        else if ($(`[alt="Carrot"]`).length > 0) {
            potatoAmount = $(`[alt="Carrot"]`).length;
        }

        else {
            potatoAmount = $(`.center [alt="Potato"]`).length;
        }
        $(`input.form-control.flex-grow.match-button-size`).val(potatoAmount);

        var wait_time;
        if (potatoAmount >= 30){
            wait_time = getRandomInt(25000, 29000);
            setTimeout(function () {
                $(`button.form-control.third-width`).click();
            }, wait_time);
            $(`.nomargin:first`).after(`
            <div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">
            ${wait_time}ms
            </div>`)
            $(`#countdown_bar`).animate({width: "0"},wait_time)
        } else {
            wait_time = getRandomInt(potatoAmount * 800, potatoAmount * 900);
            setTimeout(function () {
                $(`button.form-control.third-width`).click();
            }, wait_time);
            $(`.nomargin:first`).append(`
            <div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">
            ${wait_time}ms
            </div>`)
            $(`#countdown_bar`).animate({width: "0"},wait_time)
        }

        setTimeout(function () {
            if ($(`[value="Play Again!"]`).length>0){
                $(`[value="Play Again!"]`).click()
            }
        }, getRandomInt(1000,2000));
    }

    if ($(`img.smol-image[src="https://grundoscafe.b-cdn.net/items/bvg_stain_coltzan.gif"]`).length > 0 &&
        window.location.href.indexOf(`/desert/shrine/`) == -1) {
        //  window.location.href = "https://www.grundos.cafe/desert/shrine/";
    }
    dailyClick("/desert/shrine/", `[value="Approach the Shrine"]`);

    ////////////////////

    if (window.location.href.includes(`/market/browseshop/`)){
        $(`[onclick*="return confirm('Are you sure you wish to buy"]`).each(function(){
            $(this).attr("onclick","")
        })
        $(`[onclick*="return confirm('Are you sure you wish to move"]`).each(function(){
            $(this).attr("onclick","")
        })
    }

    if (window.location.href.indexOf(`/market/browseshop/?owner=`) > 0 && window.location.href.indexOf(`&item_id=`) > 0 ) {

        if ( window.location.href.indexOf(`&page=1`) == -1 ) {
            $(`#searchedItem input.med-image.border-1.margin-auto`).hide()
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">1000ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},1000)
            setTimeout(function () {
                $(`#searchedItem input.med-image.border-1.margin-auto`).click()
            }, 1000);
        }
    }

    if (window.location.href.includes('https://www.grundos.cafe/market/browseshop/?owner=caate&item_id=12757&page=1') ) {

        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            $(`#searchedItem input.med-image.border-1.margin-auto`).click()
        }, random1000_2000);
    }

    if (window.location.href.indexOf(`/games/cliffhanger/`) > 0 ) {

        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            if ($(`[value="Play Cliffhanger"]`).length>0 && Number($(`p:contains(You have earned ) strong`).text().replace(",","")) < 10000){
                $(`[value="Play Cliffhanger"]`).click()
            }            else if ($(`[value="I Know!!! Let Me Solve The Puzzle!"]`).length>0){
                $(`[value="I Know!!! Let Me Solve The Puzzle!"]`).click()
            }
        }, random1000_2000);
    }



    ////////////////////

    var est_cost;
    if (window.location.href.indexOf(`/halloween/esophagor/`) > 0 ) {
        $(`.flex-column.big-gap`).append(`do not spend more than 10,250`)
        $(`.itemList`).hover(function(){
            est_cost = Number($(`#total_estimated_cost`).text().replace(",",""));
            if (est_cost > 10250) {
                $(`.itemList`).css("opacity",.5)
                $(`#auto_buy`).hide()
            }
        })
    }
    if (window.location.href.indexOf(`/halloween/witchtower/`) > 0 ) {
        $(`.flex-column.big-gap`).append(` do not spend more than 10,250`)
        $(`.itemList`).hover(function(){
            est_cost = Number($(`#total_estimated_cost`).text().replace(",",""));
            if (est_cost > 10250) {
                $(`.itemList`).css("opacity",.5)
                $(`#auto_buy`).hide()
            }
        })
    }

    if (window.location.href.indexOf(`/winter/snowfaerie/`) > 0 ) {
        $(`.flex-column.big-gap`).append(` do not spend more than 18,500`)
        $(`.itemList`).hover(function(){
            est_cost = Number($(`#total_estimated_cost`).text().replace(",",""));
            if (est_cost > 18500) {
                $(`.itemList`).css("opacity",.5)
                $(`#auto_buy`).hide()
            }
        })
    }
    if (window.location.href.indexOf(`/island/kitchen/`) > 0 ) {
        $(`.flex-column.big-gap`).append(`If you are looking to make a profit just through neopoints, only, do not spend more than 5,000 NP per quest. If you factor in the profit you can make through selling the codestones at 7,000 NP each, do not spend more than 15,075 NP per quest.`)

        $(`.itemList`).hover(function(){
            est_cost = Number($(`#total_estimated_cost`).text().replace(",",""));
            if (est_cost > 15075) {
                $(`.itemList`).css("opacity",.5)
                $(`#auto_buy`).hide()
            }
        })
    }

    if (window.location.href.includes(`/?type=courses`) ){
        $('select.form-control[name="pet"]').val('Arick')
    }

    dailyClick("/market/till/", `[value="Withdraw"]`);

    if (window.location.href.includes(`/games/stockmarket/stocks/?bargain=True`) ){
        $(`.stock-cell:nth-child(6)`).each(function(){
            var price = Number($(this).text())
            if (price <15 ) {
                $(this).parent().hide()
            }
        })

        $(`.stock-table a`).each(function(){
            var stockname = $(this).text().trim();
            $(this).after(stockname)
        })
    }

    dailyClick("/pirates/buriedtreasure/", `[value="Click to Play"]`);
    dailyClick("/pirates/buriedtreasure/play/", `[name="treasure_map"]`);
    dailyClick("/winter/snowager/", `[value="Approach the Snowager"]`);

    function wheel(url, title, button_text){

        if (window.location.href.includes(url) ){
            if ($(`div#aio-timelies-list [title="${title}"]`).length == 1 && $(`[value="${button_text}"]`).length == 1){
                $(`[value="${button_text}"]`).hide();
                $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:url(https://grundoscafe.b-cdn.net/misc/themes/blue/top.png) top;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                setTimeout(function () {
                    $(`[value="${button_text}"]`).click();
                }, random1000_2000);
            } else if ($(`#aio-timelies-list a[href*="/wheel/"]`).length > 0){
                console.log(`click next wheel`)
                $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:url(https://grundoscafe.b-cdn.net/misc/themes/blue/top.png) top;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                setTimeout(function () {
                    window.location.href = $(`#aio-timelies-list a[href*="/wheel/"]:first`).attr("href");
                }, random1000_2000);
            } else{
                console.log(` wheel`)
            }
        }
    }

    wheel(`/faerieland/wheel/`,"Wheel of Excitement","Spin the Wheel!!!")
    wheel(`/halloween/wheel/`,"Wheel of Misfortune","Spin the Wheel?")
    wheel(`/prehistoric/wheel/`,"Wheel of Mediocrity","Spin, Spin, Spin the Wheel!!")

    dailyClick("/pirates/academy/?type=status", `[value="Complete Course!"]`);
    dailyClick("/pirates/academy/complete/", `[value="Go Back to Courses"]`);

    dailyClick("/island/kitchen/", `[value="Sure, I will help!"]`);
    dailyClick("/winter/snowfaerie/", `[value="I will help you!"]`);
    if ($(`strong.red:contains(NO)`).length == 0){
        dailyClick("/island/kitchen/complete/", `[value="Approach the Chef Again"]`);
        dailyClick("/winter/snowfaerie/complete/", `[value="Approach Taelia again..."]`);
        dailyClick("/halloween/witchtower/complete/", `[value="Approach the witch again..."]`);
    }
    dailyClick("/halloween/witchtower/", `[value="Erm... OK then"]`);
    dailyClick("/halloween/esophagor/", `[value="Sure, I Will Find You Food"]`);

    if (window.location.href.includes("/halloween/esophagor/complete/")){
        if ($(`[value="Go to the Brain Tree!"]`).length == 1){
            $(`[value="Go to the Brain Tree!"]`).hide();
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            setTimeout(function () {
                $(`[value="Go to the Brain Tree!"]`).click();
            }, random1000_2000);
        } else  if ($(`strong.red:contains(NO)`).length == 0){
            $(`[value="Approach the Esophagor again..."]`).hide();
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            setTimeout(function () {
                $(`[value="Approach the Esophagor again..."]`).click();
            }, random1000_2000);
        }
    }


    dailyClick("/medieval/earthfaerie/", `[value="I Accept!"]`);
    dailyClick("/faerieland/darkfaerie/", `[value="I Accept!"]`);
    if (window.location.href.includes(`/medieval/earthfaerie/`) ){
        $(`[action="/medieval/earthfaerie/accept/"]`).attr("onsubmit","")
    }
    if (window.location.href.includes(`/faerieland/darkfaerie/`) ){
        $(`[action="/faerieland/darkfaerie/accept/"]`).attr("onsubmit","");
        if ($(`[value="Yes I have it!!!"]`).length == 1){
            if ( $(`[src="https://grundoscafe.b-cdn.net/searchicons/coloured/sdb_check_green.png"]`).length == 1){
            }
            else if ( $(`[src="https://grundoscafe.b-cdn.net/searchicons/coloured/inventory_green.png"]`).length == 1){
                $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                setTimeout(function () {
                    $(`[value="Yes I have it!!!"]`).click()
                }, random1000_2000);
            } else {
                $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                setTimeout(function () {
                    window.location.href = $(`a[alt="Shop Wizard Search"]`).attr("href");
                }, random1000_2000);
            }
        }
    }

    if ( $(`body:contains(Ok well that has like totally ruined my spell now!)`).length == 1 ||
        $(`body:contains(I am getting very impatient!!!)`).length == 1 ||
        $(`body:contains(Tooo ssllooooww)`).length == 1 ||
        $(`body:contains(Out of time :()`).length == 1||
        $(`body:contains(Pass the eye, sister!)`).length == 1 ||
        $(`body:contains(YYOOU HAAAVVEEE FFAAIILLLEEDD!!)`).length == 1 ||
        $(`body:contains(An Idiot Sandwich!)`).length == 1  ||
        $(`body:contains(I shall get angry soon!!)`).length == 1  ||
        $(`body:contains(This is an OUTRAGE!)`).length == 1  ||
        $(`body:contains(It's all over :()`).length == 1 ||
        $(`body:contains(Hmmm, maybe I can put YOU in my cauldron...)`).length == 1||
        $(`body:contains(Oh well, that will be another negative Holler review...)`).length == 1 ||
        $(`body:contains(TOOO LLLAAATTTEEE)`).length == 1||
        $(`body:contains(I'm gonna get fired for this!!!)`).length == 1||
        $(`body:contains(Hurry up or I will turn you into a toad!)`).length == 1 ||
        $(`body:contains(Youuu aaree tooo laattee)`).length == 1 ||
        $(`body:contains(Stiiilll huunnggrryyy...)`).length == 1 ||
        $(`body:contains(Never mind, life goes on.)`).length == 1 ||
        $(`body:contains(The spell wore off ages ago, these items are useless to me now!)`).length == 1 ||
        $(`body:contains(NOOOOOOO!)`).length == 1 ||
        $(`body:contains(Are you always this slow?)`).length == 1 ||
        $(`body:contains(Never mind, life goes on.)`).length == 1 ||
        $(`body:contains(Grrr, there goes another spell.)`).length == 1 ||
        $(`body:contains(I hope I keep my job after this…)`).length == 1  ||
        $(`body:contains(Bah, the Air Faerie never has this much trouble finding ingredients!)`).length == 1  ||
        $(`body:contains(You were too late, sorry... try again later I guess..)`).length == 1  ||
        $(`body:contains(Thanks, but never mind :()`).length == 1 ){
        window.location.href = window.location.href;
    }


    if (window.location.href.includes("/island/tradingpost/browse/") && $('#id_query').val().length == 0 ){
        $(`#id_type`).val(999)
    }


    if (window.location.href.includes("https://www.grundos.cafe/games/lottery/") ){
        if ($(`span.flex.big-gap`).length < 20){
            $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
            $(`#countdown_bar`).animate({width: "0"},random1000_2000)
            setTimeout(function () {
                $(`#${$(`span.flex.big-gap`).length+1}[name="ticket"]`).click();
                $(`[value="Buy a Lottery Ticket!"]`).click();
            }, random1000_2000);
        }
    }

    dailyClick("https://www.grundos.cafe/island/training/?type=status#Arick", `[value="Complete Course!"]`);
    dailyClick("/island/training/complete/", `[value="Go Back to Courses"]`);


    if (window.location.href.includes("/help/profile/")){
        $(`.flex-column.small-gap.center-items:contains(Here you can enter a few lines)`).append(`<div id="habi_ul" class="fakebutton">habi ul</div>`)
        $(`#habi_ul`).click(function(){
            $(`[name="userlookup_html"]`).val(`<div class="bg1">
    <div class="bg"></div>
</div>
<div id="bg3"><a href="#" style="width: 980px; height: 600px;display:block"><img src="https://i.gyazo.com/698940d49655ba670d77d35e639dcedd.gif" style="position: relative; left: 376px; top: 116px; height: 48px; transform: scaleX(-1);"><img src="https://i.gyazo.com/dcd6748c2ea95a5404f8ff53a7f0158a.gif" style="position: relative; left: 674px; top: 193px; height: 91px;"><img src="https://i.gyazo.com/bc0598f7e254f0fe5c0b904cc6b8c56d.gif" style="position: relative; left: 374px; top: 267px; height: 69px;">

            </a></div>
<div id="custom">

    <a href="#userLookupInfo"><img src="https://files.catbox.moe/v92alo.png">Info</a>
    <a href="#userLookupPets"><img src="https://files.catbox.moe/h7kl37.png">Pets</a>
    <a href="#userLookupSiteTrophies"><img src="https://files.catbox.moe/z2lg1a.png">Site Trophies</a>
    <a href="#userLookupGameTrophies"><img src="https://files.catbox.moe/85hjur.png">Game Trophies</a>
    <a href="#about"><img src="https://files.catbox.moe/xa3r10.png">About</a>

</div>
<div id="resource">
    <div id="aboutme">Hi! My name is Arden. I'm in my late twenties trying to re-live the nostalgia of my childhood. My
        current goals are getting all my dreamies! On GC, I like to build webpages and design characters for all my
        pets.
    </div>
</div>
<a id="close" href="#bg3">✖</a>
<div id="about">
        <p>As you can tell from my userlookup, I sorely miss the Habitarium and one day wish that it comes back!
        </p>
        <p>I do layout code commissions  on occasion, which you can find in <a href="/~Fya/">/~Fya</a>.</p>
    <p>Arick is my Music pet. Fya is my BD pet. Kint is my Book pet. Habi is my Plushie pet.</p>
    <p><b>Dream pets:</b> Chocolate Yurble (pink frosted), Faerie Lenny, Silver Alt Kougra, Starry Alt Kougra, Plushie (Vintage) Kougra, Darigan Draik, Maraquan Cybunny, Royalboy Cybunny, Botanical Chia, Nugget Chia</p>
</div>`);
            $(`[name="userlookup_css"]`).val(`@font-face {
    font-family: heff;
    src: url(https://files.catbox.moe/67mzik.woff)
    }
#userLookupShield {
    background-image: url(https://files.catbox.moe/l9ryw5.png);
    background-repeat: no-repeat;
    background-position: center top;
    min-height: 109px;
    text-align: center
    }
#userLookupShield img {
    content: url(https://files.catbox.moe/rkd9ex.png);
    animation: swing 2.5s ease infinite;
    margin-top: 20px
    }
@keyframes swing {
    0% {
        transform: rotate(25deg);
        transform-origin: 50% 0
        } 50% {
        transform: rotate(11deg);
        transform-origin: 50% 0
        } 100% {
        transform: rotate(25deg);
        transform-origin: 50% 0
        }
    }
.ul--stampsimg {
    opacity: 0
    }
.ul__collection.ul__stamps {
    background-image: url(https://files.catbox.moe/ecmy77.png);
    background-repeat: no-repeat;
    background-size: 50px
    }
.bg1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background: #ccc
    }
.bg {
    width: 980px;
    height: 600px;
    background: url(https://files.catbox.moe/srra04.png);
    box-shadow: 0 0 19px rgba(0, 0, 0, 0.5)
    }
#bg3 {
    width: 980px;
    height: 600px;
    background: url(https://i.gyazo.com/a13c63493fcfe0eabfc2065ba63ab9e0.png);
    display: none
    }
#bg3:target {
    display: block;
    position: fixed;
    z-index: 6;
    top: calc(50vh - 300px);
    left: calc(50vw - 490px);
    text-align: left
    }
#about {
    text-align: left
    }
#about, #userLookupInfo, #userLookupPets, #userLookupSiteTrophies, #userLookupGameTrophies {
    background: #d9efa5;
    border: 7px solid rgba(86, 102, 16, 0.9);
    border-radius: 20px;
    color: #566610;
    padding: 20px;
    top: calc(50vh - 198px);
    left: calc(50vw - 300px);
    position: absolute;
    width: 520px;
    height: 280px;
    overflow: auto;
    z-index: 1
    }
#custom {
    position: absolute;
    top: calc(50vh - 170px);
    left: calc(50vw - 377px);
    width: 70px;
    background: rgba(86, 102, 16, 0.9);
    border-radius: 15px 0 0 15px;
    color: #566610;
    z-index: 3;
    border-right: 0;
    text-align: center;
    padding: 7px 0 7px 7px
    }
#custom a {
    width: 70px;
    background: #d9efa5;
    border-radius: 10px 0 0 10px;
    color: #360;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    line-height: 13px
    }
#resource {
    position: absolute;
    top: calc(50vh - 173px);
    left: calc(50vw + 272px);
    background: rgba(86, 102, 16, 0.9);
    border-radius: 0 15px 15px 0;
    color: #566610;
    z-index: 3;
    border-left: 0;
    text-align: center;
    padding: 7px 7px 7px 0;
    width: 150px;
    height: 270px
    }
::-webkit-scrollbar {
    width: 5px
    }
::-webkit-scrollbar-thumb {
    background: #360;
    border-radius: 5px
    }
#close {
    display: block;
    position: absolute;
    top: calc(50vh - 210px);
    left: calc(50vw + 250px);
    border: 3px solid rgba(86, 102, 16, 0.9);
    color: #566610;
    z-index: 5;
    color: #566610;
    background: #d9efa5;
    border-radius: 50%;
    width: 27px;
    height: 27px;
    text-align: center;
    line-height: 27px;
    transition: 0.1s
    }
#close:hover {
    top: calc(50vh - 208px)
    }
#aboutme {
    background: #d9efa5;
    border-radius: 0 15px 15px 0;
    color: #360;
    height: 250px;
    padding: 10px;
    font: 13px/15px Roboto;
    text-align: left;
    overflow: auto;
    border-right: 5px solid #d9efa5
    }
#userLookupInfo {
    z-index: 2
    }
#about:target, #userLookupInfo:target, #userLookupPets:target, #userLookupSiteTrophies:target, #userLookupGameTrophies:target {
    z-index: 3
    }
#userLookupText div {
    height: 22px
    }
.ul--header, #sb_top, #sb_side, #page_banner, #page_footer, #sb_bottom, .ul--petsheader.ul--sectionheader:first-child, .ul--sectionheader::before, .ul--sectionheader::after {
    display: none
    }
body {
    font-family: Roboto
    }
#userLookupLinks {
    position: absolute;
    top: calc(50vh + 180px);
    left: calc(50vw + 111px);
    display: flex;
    width: 317px;
    font: bold 10px Roboto;
    text-transform: uppercase;
    justify-content: space-between;
    z-index: 6
    }
#userLookupLinks img, input.small-image.ul--linkimg.ul--neofriendimg {
    width: 49px;
    opacity: 0
    }
.ul__link {
    color: black;
    transition: 0.1s;
    text-align: center;
    background-image: url(https://files.catbox.moe/eym9bd.png);
    background-position: 1px 0;
    background-repeat: no-repeat;
    height: 50px;
    display: inline-block;
    width: 47px
    }
.ul__link.ul__trades:hover {
    background-position: 1px 4px
    }
.ul__link.ul__auctions {
    background-position: -46px 0
    }
.ul__link.ul__auctions:hover {
    background-position: -46px 4px
    }
.ul__link.ul__wishlist {
    background-position: -90px 0
    }
.ul__link.ul__wishlist:hover {
    background-position: -90px 4px
    }
.ul__link.ul__scores {
    background-position: -156px 0
    }
.ul__link.ul__scores:hover {
    background-position: -156px 4px
    }
.ul__link.ul__neomail {
    background-position: -203px 0
    }
.ul__link.ul__neomail:hover {
    background-position: -203p 4px
    }
.ul__link.ul__neofriend {
    background-position: -249px 0
    }
.ul__link.ul__neofriend:hover {
    background-position: -249px 4px
    }
.ul__link:hover {
    color: white
    }
.ul--sectionheader {
    font: 30px "heff";
    text-shadow: 2px 0 #360, -2px 0 #360, 0 2px #360, 0 -2px #360, 1px 1px #360, -1px -1px #360, 1px -1px #360, -1px 1px #360;
    color: #fefefe;
    margin-top: -10px
    }
#custom img {
    height: 35px;
    display: block;
    margin: auto
    }
a {
    text-decoration: none;
    color: #360
    }`);

        })
    }


    if (window.location.href.includes(`https://www.grundos.cafe/market/edit/`)){
        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            //        $(`[value*="Upgrade : "]`).click()
        }, random1000_2000);
    }




    if (window.location.href.indexOf(`medieval/turmaculus/`) > 0 ) {

        $(`select#wakeup>option:eq(${getRandomInt(1,11)})`).prop('selected', true);
        setTimeout(function () {
            $(`[value="Wake Up!"]`).click()

            if ( $(`[value="Try Again?"]`).length > 0 ) {
                $(`[value="Try Again?"]`).click()
            }
        }, getRandomInt(2000,3000));


    }


    var bets_url = GM_getValue('bets_urlKey', []);
    var next_bet_url = GM_getValue('next_bet_urlKey', "");
    if (window.location.href.includes(`https://www.grundos.cafe/games/foodclub/collect/`)){

        $(`[src="https://grundoscafe.b-cdn.net/games/php_games/foodclub/collect.png"]`).after(`<br><textarea id="discord_bets"></textarea><br><div id="start_betting" class="fakebutton">start_betting</div>`)
        $(`#start_betting`).click(function(){
            var bets_raw = $(`#discord_bets`).val();

            var bets_split = bets_raw.split("\n");
            var bets_url = [];

            for (var i = 0; i < 10; i++) {
                var url =  bets_split[i].substring(bets_split[i].indexOf(" - ") + 3);
                bets_url.push(url)

                if (i == 9){

                    GM_setValue('bets_urlKey', bets_url);
                    $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                    $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                    setTimeout(function () {
                        window.location.href = bets_url[0]
                    }, random1000_2000);
                }
            }
        })
    }
    if (bets_url.includes(window.location.href)){
        var bet_number = bets_url.indexOf(window.location.href)
        var next_bet = bets_url[bet_number+1];
        console.log(next_bet)
        GM_setValue('next_bet_urlKey', next_bet);
        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            $(`[value="Place this bet!"]`).click()
        }, random1000_2000);
    }
    if (window.location.href.includes("https://www.grundos.cafe/games/foodclub/current_bets/") && $(`[name="fc_bet_info"]`).length < 10){
        console.log(next_bet_url)
        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:violet;width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            window.location.href = next_bet_url;
        }, random1000_2000);
    }

    var arick_stats = GM_getValue('arick_statsKey', "");
    var train_this = GM_getValue('train_thisKey', "");
    if (window.location.href.includes("/island/training/?type=status#Arick")){
        $(`p:contains( this course, )`).hide()

        var stats = $(`.flex-column:eq(0)`).html()
        GM_setValue('arick_statsKey', stats)

        var lvl = Number($(`.flex-column:eq(1) strong:eq(0)`).html())
        var str = Number($(`.flex-column:eq(1) strong:eq(1)`).html())
        var def = Number($(`.flex-column:eq(1) strong:eq(2)`).html())

        var hp = $(`.flex-column:eq(1) strong:eq(4)`).html()
        hp = Number(hp.substring(    hp.indexOf(" / ") + 3));

        if (str/lvl < 2) {
            train_this = "Strength"
            GM_setValue('train_thisKey', train_this)
        } else if (def/lvl < 2) {
            train_this = "Defence"
            GM_setValue('train_thisKey', train_this)
        } else if (hp/lvl < 3) {
            train_this = "Endurance"
            GM_setValue('train_thisKey', train_this)
        }
    }
    if (window.location.href.includes("/island/training/?type=courses")){
        $(`[src="https://grundoscafe.b-cdn.net/island/judo5.gif"]`).after(arick_stats)
        $(`select>option:contains(${train_this})`).attr('selected', true);
    }


    var bargain_stocks = GM_getValue('bargain_stocksKey', []);
    var split_amount = GM_getValue('split_amountKey', "");
    if (window.location.href.includes("https://www.grundos.cafe/games/stockmarket/stocks/?bargain=True") ){
        bargain_stocks = [];
        $(`.stock-table .stock-cell:nth-child(6):contains(15)`).each(function (index) {
            var acronym = $(this).prev().prev().prev().prev().find(`a`).text().trim();
            bargain_stocks.push(acronym)

            if (index + 1 == $(`.stock-table .stock-cell:nth-child(6):contains(15)`).length) {
                GM_setValue('bargain_stocksKey', bargain_stocks);
                split_amount = Math.floor(1000 / bargain_stocks.length);
                GM_setValue('split_amountKey', split_amount);
                $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
                $(`#countdown_bar`).animate({width: "0"},random1000_2000)
                setTimeout(function () {
                    window.location.href = "https://www.grundos.cafe/games/stockmarket/buy/";
                }, random1000_2000);
            }
        })
    }
    if (window.location.href.includes("https://www.grundos.cafe/games/stockmarket/buy/") ){
        $(`[name="ticker"]`).val(bargain_stocks[0])
        console.log(bargain_stocks)

        if (bargain_stocks.length > 1){
            $(`[name="qty"]`).val(split_amount)
        }
        bargain_stocks.shift(); // theRemovedElement == 1
        console.log(bargain_stocks)
        GM_setValue('bargain_stocksKey', bargain_stocks);
        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)

        setTimeout(function () {
            $(`[value="Buy Shares"]`).click()
        }, random1000_2000);
    }
    if (window.location.href.includes("/games/stockmarket/portfolio/") && bargain_stocks.length > 0 ){
        console.log(bargain_stocks)
        $(`#page_content`).prepend(`<div id="countdown_bar" style="color:white;background:linear-gradient(to right, #f5af19, #f12711);width:100%;margin:auto;text-align:center">${random1000_2000}ms</div>`)
        $(`#countdown_bar`).animate({width: "0"},random1000_2000)
        setTimeout(function () {
            window.location.href = "https://www.grundos.cafe/games/stockmarket/buy/"
        }, random1000_2000);
    }



})();