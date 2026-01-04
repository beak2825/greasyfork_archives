// ==UserScript==
// @name         RivalRegions auto script
// @namespace    http://tampermonkey.net/
// @version      2.11
// @description  try to take over the world!
// @author       TrapKingAstolDicc
// @match        https://rivalregions.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rivalregions.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481138/RivalRegions%20auto%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/481138/RivalRegions%20auto%20script.meta.js
// ==/UserScript==

// v2.0: Add auto training.
// v2.1: Slove issue: Won't training when at war from now
//       Add option for auto buying drink
// v2.2: Add suppoort for english ui
// v2.3: Slove issue: Auto training failed ramdomly
// v2.4: Optimize process for choosing factory, Now process will chooseing best option according location and enableDiggingRubbish
// v2.5: fixing ramdomly crash
// v2.6: fixing problem with using drone in training
// v2.7: fixing login problem after ui updating
// v2.8: adding R marketing
// v2.9: fixing bug caused by work page ui update
// v2.10: fixing some unstable functions
// v2.11: fixing bug after ui update

(async function() {
    'use strict';
    // ----------------------OPTIONS--------------------//

    //Log in Option
    var logInOption = 2;        // 1 for facebook login, 2 for email, other input will cause an error which will stop the script. For now only support these options, can't deal with google auth

    /****-------NOTICE : Email and your password only store in your PC, we won't get any info from this script------****/
    var logInEmail = 'example@mail.com';                  //Email that you add in your acc, input should be with quote ''
    var logInPassword = 'pa$$word';                            //Password that ramdomly create by game if you successfully add email with you acc, can be fondin your email, input should be with quote ''

    //Perks Option
    var enablePerks = true;     //only true and false are acceptable, any other input will be consider as true
    var perksConsume = 2;       //1 for cash, 2 for gold
    var upgradePerks = 2;       //1 for str, 2 for edu, 3 for end

    //Work Options
    var enableWork = true;     //only true and false are acceptable, any other input will be consider as true
    var enableBuyDrink = true;  //only true and false are acceptable, any other input will be consider as true
    var drinkLimit = 30000;    //number of drink will not less than this number
    var drinkBuyAmount = 10000 //buy this amount of drinks if not meet the limit
    var enableDiggingRubbish = true; //With this option true, script will work at wether gold or R factory according location

    //Fill gold Option   WARNING: This function only support Traditional Chinese(繁體中文). If you're using other language, please turn this function off
    var enableFillGold = false; //only true and false are acceptable, any other input will be consider as true

    //Other Options
    var enableMA =true;       //only true and false are acceptable, any other input will be consider as true
    var enableTraining = true; //only true and false are acceptable, any other input will be consider as true
    var cycleTime = 600;       //waiting time in each cycle (in seconds)


    // ----------------------OPTIONS--------------------//




    // ------------------DONT'T TOUCH ANYTHING BELOW UNLESS YOU KNOW WHAT YOU'RE DOING------------------//

    var delay = 2000;
    var curPage = checkPage();
    var step = window.localStorage.getItem('step');
    var err = window.localStorage.getItem('errCount');
    //Experimental function
    var lowestRPrice = 65000
    await sleep(5000);
    if(curPage==0){
        console.log('Trying to login...');
        await sleep(2000);
        err = await doLogin(logInOption, logInEmail, logInPassword);
        if(err == -1){
            alert('Log in faild, Please check your \'logInOption\' and comment in script.');
            throw new Error('Log in faild');
        }
    }else if(curPage==4){
        alert('Log in faild, script will be terminate\nPlease check your input\nEmail :'+logInEmail+'\nPassword: '+ logInPassword);
        throw new Error('Log in faild');
    }else{
        try{
            switch(step){
                case 'perk':{
                    if(enablePerks){
                        console.log('Step perks processing...');
                        await doPerks(perksConsume, upgradePerks);
                    }else{
                        console.log('Skipping step perks...');
                    }
                    console.log('Setting location at ' + document.querySelectorAll('[class="dot hov2 pointer"]')[0].innerHTML);
                    window.localStorage.setItem('location', document.querySelectorAll('[class="dot hov2 pointer"]')[0].innerHTML);
                    console.log('perk finish, relocating to next step in few seconds...');
                    await sleep(delay);
                    window.localStorage.setItem('step','training');
                    //location.href='https://rivalregions.com/#slide/academy';
                    location.reload();
                    break;
                }
                case 'training':{
                    if(enableTraining){
                        console.log('Step training processing...');
                        await doTraining();
                    }
                    console.log('training finish, relocating to next step in few seconds...');
                    await sleep(delay);
                    window.localStorage.setItem('step','MA');
                    location.href='https://rivalregions.com/#slide/academy';
                    location.reload();
                    break;

                }
                case 'MA':{
                    if(enableMA){
                        console.log('Step MA processing...');
                        await doMA();
                    }else{
                        console.log('Skipping step MA...');
                    }
                    console.log('MA finish, relocating to next step in few seconds...');
                    await sleep(delay);
                    window.localStorage.setItem('step','drinks');
                    location.href='https://rivalregions.com/#storage';
                    location.reload();
                    break;
                }
                case 'drinks':{
                    if(enableBuyDrink){
                        await doDrinks(drinkLimit);
                    }
                    console.log('drinks finish, relocating to next step in few seconds...')
                    await sleep(delay);
                    window.localStorage.setItem('step','work');
                    location.href='https://rivalregions.com/#work';
                    location.reload();
                    break;
                }
                case 'work':{
                    if(enableWork){
                        await doWork(drinkLimit);
                    }
                    console.log('work finish, relocating to parliament page...');
                    await sleep(delay);
                    window.localStorage.setItem('step','fillGold');
                    location.href='https://rivalregions.com/#parliament';
                    location.reload();
                    break;
                }
                case 'fillGold':{
                    if(enableFillGold){
                        await doFillGold();
                    }
                    console.log('fill finish, waiting for refresh...');
                    window.localStorage.setItem('step','perk');
                    console.log('timer set '+cycleTime+' seconds\n ' + new Date());
                    if(err==null) err = 0;
                    console.log('Error count :'+ err + '\nContact me if this number get higher.');
                    var intervalID = setInterval(function() {
                        location.href='https://rivalregions.com/#overview'
                        location.reload();
                    }, cycleTime*1000);
                    break;
                }
                default:{
                    console.log('initializing script');
                    window.localStorage.setItem('step','perk');
                    location.href='https://rivalregions.com/#overview';
                    location.reload();
                    break;
                }
            }
        }catch (e){
            console.log('unknown error, most happenning when catching catching null item');
            var c = window.localStorage.getItem('errCount');
            if(c == null){
                window.localStorage.setItem('errCount','1');
            }else{
                c = parseInt(c)+1;
                window.localStorage.setItem('errCount',c);
            }
            window.localStorage.setItem('lastErr',new Date());
            location.reload();
        }
    }
    function checkPage(){
        var page = location.href;
        var temp = document.getElementsByClassName('sa_link');
        if(temp.length>0){
            return 0;
        }else if(page=='https://rivalregions.com/#overview' || page=='https://rivalregions.com/'){
            return 1;
        }else if(page=='https://rivalregions.com/#work'){
            return 2;
        }else if(page=='https://rivalregions.com/#parliament'){
            return 3;
        }else if(page=='https://rivalregions.com/rival/pass'){
            return 4;
        }else{
            return -1
        }
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


    async function doPerks(cons, perk){
        await sleep(1500);
        if(checkPage()!=1){
            console.log('Not in perk page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#overview'
            location.reload();
        }
        var ifUpgrading = document.getElementById('perk_counter');
        if(ifUpgrading == null){
            var target = document.querySelector('[perk="'+perk+'"]');
            if(target != null){
                target.click();
                await sleep(1000);
                target = document.querySelector('[perk="'+perk+'"][url="'+cons+'"]');
                target.click();
                console.log('Upgrade successful');
                await sleep(2000);
            }
        }else{
            console.log('Exist upgrading perks, skipping this step');
            await sleep(2000);
        }
    }

    async function doTraining(){
        await sleep(1500);
        if(checkPage()!=1){
            console.log('Not in perk page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#overview'
            location.reload();
        }
        var tar = document.getElementsByClassName('war_index_war_countdown')[0].innerText;
        if(tar==''){
            console.log('Free Training avaliable, Processing...');
            tar = document.getElementsByClassName('index_training')[0];
            tar.click();
            await sleep(5000);
            tar = document.querySelector('[url="2"][hpcut="6"][damage="10"][class="dot pointer imp yellow war_w_unit_div"]');
            if(tar!=null){
                tar.click();
            }
            await sleep(500);
            tar = document.getElementsByClassName('war_w_auto_wd')[0];
            if(tar!=null){
                tar.click();
                console.log('done');
                await(4000);
            }

        }else{
            console.log('Free training unavaliable or already training, skipping...');
        }
    }

    async function doDrinks(limit){
        await sleep(1500);
        if(location.href!='https://rivalregions.com/#storage'){
            console.log('Not in storage page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#storage'
            location.reload();
        }
        await sleep(2000);
        var target = document.querySelector('[url="17"][urlbar="17"]').innerHTML;
        var R = parseInt(document.querySelector('[url="26"][urlbar="26"]').innerHTML.replaceAll('.',''));
        if(target==null){
            window.localStorage.setItem('step','drinks');
            location.href='https://rivalregions.com/#storage';
            location.reload();
        }
        if(parseInt(target)*1000<limit){
            console.log('Drinks less then limit, buying drinks...');
            await sleep(1000);
            target = document.querySelector('[url="17"]');
            target.click();
            await sleep(1000);
            document.getElementsByClassName('storage_produce_ammount')[0].value = drinkBuyAmount;
            await sleep(1000);
            document.getElementsByClassName('storage_produce_button')[0].click();
            await sleep(1000);
        }else{
            console.log('Drinks more then limit, skip buying');
            await sleep(3000);
        }
        if(R>155){
            console.log('Selling R...');
            await sleep(3000);
            target = document.querySelector('[url="26"]');
            target.click();
            await sleep(3000);
            var RPrice = parseInt(document.querySelectorAll('[class="dot"]')[1].innerHTML.replaceAll('.',''));
            target = document.querySelector('[url="26"][class="storage_sell dot"]');
            if(target!=null){
                target.click();
                await sleep(3000);
                if(RPrice > lowestRPrice){
                    document.getElementsByClassName('storage_sell_price')[0].value = RPrice-1
                }else{
                    document.getElementsByClassName('storage_sell_price')[0].value = lowestRPrice
                }
                console.log('Setting R price at ' + document.getElementsByClassName('storage_sell_price')[0].value);
                document.getElementsByClassName('storage_sell_button')[0].classList.remove('no_pointer');
                document.getElementsByClassName('storage_sell_button')[0].classList.add('button_green');
                console.log('Removing tags...');
                await sleep(3000)
                document.getElementsByClassName('storage_sell_button')[0].click();
                await sleep(3000)
            }
        }
    }

    //
    //known bug: target will be set at highest factory instead of the highest "gold" factory when work button is unavaliable
    //

    async function doWork(){
        await sleep(1500);
        if(checkPage()!=2){
            console.log('Not in work page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#work'
            location.reload();
        }else{
            var target = document.getElementsByClassName('work_auto_countdown');
            if(target.length>0){
                var time = parseInt(target[0].innerHTML);
                if(time<5){
                    console.log('Time less than 5 hours, refreshing...');
                    await sleep(2000);
                    target[0].click();
                    await sleep(3000);
                    target = document.getElementsByClassName('work_w_autom')[0];
                    target.click();
                }else{
                    console.log('Time more than 5 hours, skipping...');
                    await sleep(2000);
                }
            }else{
                target = document.getElementsByClassName('work_w_autom');
                if(target.length<1){
                    console.log('Auto work not availiable skipping...');
                    await sleep(2000);
                }else if(document.getElementsByClassName('work_factory_button').length<1){
                    var loc = window.localStorage.getItem('location');
                    console.log('Work not avaliable, pick the highest gold factory automatically');

                    await sleep(1000);
                    var temp = document.getElementsByClassName('factories_search')[0];
//                    console.log(temp);
                    temp.click();
                    await sleep(5000);
                    if(enableDiggingRubbish && (loc == 'Mars' || loc == '火星')){
                        console.log('location :' + loc);
                        document.querySelectorAll('[class="dot pointer hov2 list_name"]')[8].click();
                        console.log('picking R factory');
                        await sleep(3000);
                    }else{
                        console.log('location: ' + loc);
                        target=document.querySelectorAll('[class="dot pointer hov2 list_name"]')[0];
                        if(target!=null){
                            target.click();
                        }
                        console.log('picking gold factory');
                        await sleep(3000);
                    }
                    document.getElementsByClassName('button_green')[0].click();
                    await sleep(2000);
                    //target[0].click();
                }else{
                    console.log('Auto work avaliable, starting...');
                    await sleep(2000);
                    target[0].click();
                }
            }
        }
    }

    async function doMA(){
        await sleep(1500);
        if(location.href!='https://rivalregions.com/#slide/academy'){
            console.log('Not in MA page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#slide/academy'
            location.reload();
        }
        var target = document.getElementsByClassName('button_academy');
        await sleep(2000)
        if(target.length>0){
            target[0].click();
        }else{
            console.log('Academy not avaliable');
            await sleep(2000);
        }
    }


    async function doFillGold(){
        await sleep(1500);
        if(checkPage()!=3){
            console.log('Not in parliament page, relocating in 3 seconds');
            await sleep(3000);
            location.href='https://rivalregions.com/#parliament'
            location.reload();
            return;
        }
        var target = document.getElementsByClassName('button_blue');
        if(target.length>0){
            target[0].click();
            await sleep(3000);
            var trigger = false;
            target = document.getElementsByClassName('dd-option');
            console.log('Trying to find \'Resources exploration\'...');
            await sleep(10000);
            for(let i = 0; i<20; i++){
                if(target[i].innerText == '   勘探資源: 國家' || target[i].innerText == '   Resources exploration: state'){
                    target[i].click();
                    trigger = true;
                    console.log('Found \'Resources exploration\'');
                    await sleep(2000);
                    break;
                }
            }
            if(trigger){
                await sleep(1000);
                target = document.getElementById('offer_do');
                target.click();
                await sleep(6000);
                var a = document.getElementsByClassName('parliament_sh1');
                if(a.length>0){
                    console.log('found unvote law, checking...');
                    for(let i = 0; i < a.length; i++){
                        console.log(a[i].innerText+i);
                        if(a[i].innerText.includes('勘探資源: 國家') || a[i].innerText.includes('Resources exploration: state')){
                            console.log('found unvote exploration law, voting...');
                            a[i].click();
                            await sleep(3000);
                            a = document.querySelector('[url=pro]');
                            if(a!=null){
                                a.click();
                                console.log('done');
                            }
                            break;
                        }
                    }
                }
            }else{
                console.log('Can\'t find \'Resources exploration\', try using legal language like Traditional Chinese(繁體中文) or English');
                await sleep(5000);
            }
        }else{
            console.log('Parliament not avaliable');
            await sleep(3000);
            var b = document.getElementsByClassName('parliament_sh1');
            if(b.length>0){
                console.log('found unvote law, checking...');
                for(let i = 0; i < b.length; i++){
                    console.log(b[i].innerText+i);
                    if(b[i].innerText.includes('勘探資源: 國家') || b[i].innerText.includes('Resources exploration: state')){
                        console.log('found unvote exploration law, voting...');
                        b[i].click();
                        await sleep(3000);
                        b = document.querySelector('[url=pro]');
                        if(b!=null){
                            b.click();
                            console.log('done');
                        }
                        //console.log('123465');
                        break;
                    }
                }
            }
        }
    }

    async function doLogin(option, mail, pw){
        if(option==1){
            var target = document.getElementsByClassName('sa_link');
            target[0].click();
        }else if(option==2){
            var temp = document.getElementsByName('mail')[0];
            temp.value = mail;
            temp = document.getElementsByName('p')[0];
            temp.value = pw;
            temp = document.getElementsByName('s')[0];
            temp.click();
        }else{
            return -1;
        }
    }


})();