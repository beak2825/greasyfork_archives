// ==UserScript==
// @name         Helemax
// @namespace    zero.elemax.torn
// @version      1.6
// @description  checks hosp time
// @author       -zero [2669774]
// @match        https://www.torn.com/factions.php?step=profile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464942/Helemax.user.js
// @updateURL https://update.greasyfork.org/scripts/464942/Helemax.meta.js
// ==/UserScript==

var api = ''; // API KEY



var faction_id;

function sort(a,b){
    console.log('sorting');
    var mylist = $('.members-list',$('.enemy-faction'));
    console.log(mylist);
    var listitems = mylist.children('li').get();

    listitems.sort(function(a, b) {
        var tima = $('.hosptime',a);
        console.log(tima, a);
        if (tima){
            tima = tima.attr('totalTime');
        }
        else{
            tima = 999999;
        }


        var timb = $('.hosptime',b);
        if (timb){
            timb = timb.attr('totalTime');
        }
        else{
            timb = 999999;
        }



        if (parseInt(tima) < parseInt(timb)){
            return -1;
        }
        else if (parseInt(tima) > parseInt(timb)){
            return 1;
        }
        else{
            return 0;
        }
    })
    $.each(listitems, function(idx, itm) { mylist.append(itm); });



}

function getFaction(){
    if ($('div[class^="nameWp"]').length > 0){
        $('div[class^="nameWp"] > a').each(async function(){
            if ($(this).attr('class').includes('opponent')){
                faction_id = $(this).attr('href').split('ID=')[1];
                // console.log(faction_id);
                await insert();
                await update();
                setInterval(update, 1000);

                setInterval(insert,60000);
                setInterval(sort,20000);



            }
        });

    }
    else{
        setTimeout(getFaction, 1000);
    }
}

async function insert(){
    if ($('.enemy', $('.enemy-faction')).length > 0){
        var data =await $.getJSON('https://api.torn.com/faction/'+faction_id+'?selections=&key='+api+'&comment=Helemax');
        var memberD = data.members;
        //  console.log(memberD);


        var fac = $('.enemy-faction');

        $('.enemy', fac).each(function(){
            if ($('.hospital', $(this))){
                var id = $('div[id$="-user"]', $(this)).attr('id').split('_')[0];
                // console.log(id);
                // console.log(memberD);


                var hospTime = memberD[id].status.until || 0;
                var ctime = getHosp(hospTime);
                var form;
                var totalTime = ctime[0]*60*60+ctime[1]*60+ctime[2];
                form = `<span class = 'hosptime' hrs ='${ctime[0]}' mnts ='${ctime[1]}' secs ='${ctime[2]}' totalTime = '${totalTime}'></span>`;

                $('.hospital',$(this)).html(form);

            }


        });
        sort();
    }
    else{
        setTimeout(insert,500);
    }



}

function update(){
    //  console.log('here');
    $('.hosptime').each(function(){
        var hrs = $(this).attr('hrs');
        var mnts = $(this).attr('mnts');
        var secs = $(this).attr('secs');

        secs = secs-1;
        if (secs <= 0){
            if (mnts !=0){
                mnts = mnts -1;
                secs = 59;
            }
            else{
                secs = 0;
            }
        }
        if (mnts <= 0){
            if (hrs != 0){
                mnts = 59;
                hrs = hrs - 1;
            }
        }

        $(this).attr('hrs', hrs);
        $(this).attr('mnts', mnts);
        $(this).attr('secs', secs);

        if (mnts > 10 || hrs > 0){
            $(this).css('color','orange');
        }
        else{
            $(this).css('color','red');
        }

        if (hrs < 10 && hrs != '00') {hrs = '0'+hrs}
        if (mnts < 10 && mnts != '00') {mnts = '0'+mnts}
        if (secs < 10 && secs != '00') {secs = '0'+secs}

        $(this).html(`${hrs}:${mnts}:${secs}`);
    });
}

function getHosp(t){
    var time = Math.round(Date.now()/1000);
    var diff = t - time;
    var x = []
    if (diff > 0){
        var hrs = Math.floor(diff / 3600);
        x.push(hrs);
        diff -= hrs*3600;
        var mnts = Math.floor(diff / 60);
        x.push(mnts);
        diff -= mnts*60;
        if (diff < 0){
            diff = 0;
        }
        x.push(diff);
    }


    return x;
}


(function() {
    'use strict';
    var url = window.location.href;
    if (url.includes('war/rank')){
        getFaction();
    }


    // Your code here...
})();

$(window).on('hashchange', function(e){
    var url = window.location.href;
    if (url.includes('war/rank')){
        setTimeout(getFaction,300);
    }



});