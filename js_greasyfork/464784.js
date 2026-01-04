// ==UserScript==
// @name         sl0rk
// @namespace    zero.slork.jail
// @version      1.8
// @description  jailer final.
// @author       -zero [2669774]
// @match        https://www.torn.com/jailview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464784/sl0rk.user.js
// @updateURL https://update.greasyfork.org/scripts/464784/sl0rk.meta.js
// ==/UserScript==

var multiplier = 21.375;
var hiddenWords = [];

var bailVal = parseInt(localStorage.getItem('bailFilter'));
var filterWords = localStorage.getItem('filterWords');
function reload(){
    console.log(window.location.href);
    window.location.href = '#start=100';

}

function hideDes(){
    $('.users-list > li').each(function() {
        var el = $(this);
        //console.log(el);
        var words = $('#filterWords').attr('value').split(',');
        console.log(words);
        if (words.length > 0 && words[0] != ""){
            var desc = $('.reason',el).text();

            words.forEach(function(word){
                if (desc.toLowerCase().includes(word.toLowerCase())){
                    el.hide();
                }
            });
        }



    });
}

function quickBust(){

    var bailbox = `<input type="text" id="bailAmount" name="lname" value='${bailVal}'>`;
    var filterword = `<input type="text" id="filterWords" name="fwords" placeholder="Hide these Words" value = '${filterWords}'>`;




    if ($('.bust').length>0 && $('.zVal').length == 0){
        var locate = window.location.href;

        var locat = window.location.href.split('#');



        var nelink = 'start=';
        console.log(locat);

        if (locat.length == 1){
            nelink += '0';
        }
        else if (locat[1] == ''){

            nelink += '0'
        }
        else{
            nelink = locat[1]+'.0';
        }
        console.log(nelink);

        if (locate.includes('.0')){

            nelink = nelink.replaceAll('.0','');
        }
        $('.gallery-wrapper').wrap(`<a href="#${nelink}"></a>`);
        $('.users-list-title').wrap(`<a href="#${nelink}"></a>`);



        if ($('#bailAmount').length == 0){
            $('.content-title').append(bailbox);
            $('.content-title').append(filterword);
        }
        document.getElementById('filterWords').onkeyup = function(e){
            if (!e) e = window.event;
            var keyCode = e.code || e.key;
            localStorage.setItem('filterWords', $('#filterWords').val());
            filterWords = localStorage.getItem('filterWords');
            hideDes();
        }


        document.getElementById('bailAmount').onkeyup = function(e){
            if (!e) e = window.event;
            var keyCode = e.code || e.key;

            console.log($('#bailAmount').val());
            var tval = parseInt($('#bailAmount').val());
            localStorage.setItem('bailFilter', $('#bailAmount').val());
            bailVal = parseInt(localStorage.getItem('bailFilter'));
            hide();


        }


        $('.bust').each(function(){
            $(this).attr('href',$(this).attr('href')+1);
        });
        bailamount();




        $('.bye').each(function(){
            $(this).attr('href',$(this).attr('href').replace('step=buy','step=breakout'));
        });
    }
    else{
        setTimeout(quickBust,300);
    }

}

function hide(){
    $('.users-list > li').each(function() {
        var el = $(this);
        //console.log(el);
        var am = parseInt(el.attr('bail-value'));
        // console.log(am + ' '+ bailVal);
        if (am > bailVal){
            el.hide();
        }
        else{
            el.show();
        }
    });

}



function bailamount(){



    $('.users-list > li').each(function() {
        var el = $(this);
        var time = $('.time', el).text().split('\n')[5].trim().split(' ');
        var minutes = 0;
        var hours;
        if (time.length == 2){
            hours =parseInt(time[0].slice(0,-1))*60;
            var minu = parseInt(time[1].slice(0,-1));
            minutes = hours + minu;
        }
        else{
            minutes = parseInt(time[0].slice(0,-1));
        }
        var lvl = parseInt($('.level', el).text().split('\n')[5].trim());
        var bail = Math.round(multiplier * minutes * lvl);

        var value = `<span style='color:red; float:right;' class='zVal'>( ${bail.toLocaleString()} )</span>`;
        $('.reason', el).append(value);

        el.attr('bail-value', bail);

    });

    sort();

    if (bailVal){
        hide();
    }
}

function sort(a,b){
    var mylist = $('.users-list');
    var listitems = mylist.children('li').get();

    listitems.sort(function(a, b) {

        if (parseInt($(a).attr('bail-value')) < parseInt($(b).attr('bail-value'))){
            return -1;
        }
        else{
            return 1;
        }
    })
    $.each(listitems, function(idx, itm) { mylist.append(itm); });



}



quickBust();
setInterval(hideDes,300);

$(window).on('hashchange', function(e){
    console.log('change');
    setTimeout(quickBust,300);
    setInterval(hideDes,300);

});