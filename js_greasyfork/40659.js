// ==UserScript==
// @name         AutoAccept
// @namespace    yup
// @version      0.1
// @description  super sekret
// @author       pyro
// @include      https://www.mturk.com/mturk/previewandaccept
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/40659/AutoAccept.user.js
// @updateURL https://update.greasyfork.org/scripts/40659/AutoAccept.meta.js
// ==/UserScript==

let accepted = []; // want this to empty every time we reload the page

(function() {
    'use strict';

    let interv;
    
    let opt = localStorage.getItem('sopt') ? JSON.parse(localStorage.getItem('sopt')) : {
        blocklist: ['Dave'],
        includelist: ['Michael Chevett'],
        floor: 2.00,
        pageSize: 20,
        refreshRate: 2,
        showHidden: false,
        autoAccept: false
    };
    let url; //= `https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=&minReward=${opt.floor}&qualifiedFor=on&x=0&y=0&pageSize=${opt.pageSize}`;

    $("<div id='hitcontainer' />").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 1000000,  // to be on the safe side
        background: "#dddddd"
    }).appendTo($("body").css("position", "relative"));
    $("<button id='scrapeButton' type='button'>Start</button><b> | </b>").appendTo($('#hitcontainer'));
    $("<span>Reload: </span><select id='reloadTime'><option value='1'>1</option><option value='1.5'>1.5</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select><b> | </b>").css({width: '40px'}).val(opt.refreshRate).appendTo($('#hitcontainer'));
    $("<span>Min Reward: </span><select id='minReward'><option value='.50'>.50</option><option value='1.00'>1.00</option><option value='2.00'>2.00</option><option value='3.00'>3.00</option><option value='4.00'>4.00</option></select><b> | </b>").css({width: '60px'}).val(opt.floor).appendTo($('#hitcontainer'));
    $("<span>Page Size: </span><select id='pageSize'><option value='10'>10</option><option value='20'>20</option><option value='50'>50</option><option value='100'>100</option></select><b> | </b>").css({width: '50px'}).val(opt.pageSize).appendTo($('#hitcontainer'));
    $("<span>Show Hidden: </span><input type='checkbox' id='showHidden'><b> | </b>").prop('checked', opt.showHidden).appendTo($('#hitcontainer'));
    $("<span>Auto-Accept: </span><input type='checkbox' id='autoAccept'><b> | </b>").prop('checked', opt.autoAccept).appendTo($('#hitcontainer'));
    $("<span>Push Notification: </span><input type='checkbox' id='pushbullet'><b> | </b>" +
    "<span>Last Scraped: </span><span id='lastScraped'></span>" +
    "<div><textarea id='blockedList' style='width: 100%; height: 100px'></textarea></div>" +
    "<button id='blockUpdate' type='button'>Update Blocked</button>" +
    "<div><textarea id='includeList' style='width: 100%; height: 100px'></textarea></div>" +
    "<button id='includeUpdate' type='button'>Update Included</button>" +  
    "<div><h4>Scraped</h4></div><hr><div id='hitbox' style='overflow-y:auto; height: 150px' />" +
    "<div><h4>Activity</h4></div><hr><div id='hitlog' style='overflow-y:auto; height: 500px' />" +
    "<audio id='audio_accepted'><source src='https://www.soundjay.com/button/button-21.mp3' type='audio/mpeg'></audio>").appendTo($('#hitcontainer'));


    document.title = "Hit Accept";
    $('#blockedList').val(opt.blocklist.join('||') || '');
    $('#includeList').val(opt.includelist.join('||') || '');
    
    $('#scrapeButton').click(function () {
      //  console.log($(this));
        if ($(this).html() === 'Start') {
            url = `https://www.mturk.com/mturk/findhits?match=true`;
            scrape(url, opt); //initial scrape before interval starts
            interv = setInterval( function() {
                scrape(url, opt);
                //console.log('reload ' + opt.refreshRate, url);
                //console.log(accepted);
            }, opt.refreshRate * 1000);
        }
        else { clearInterval(interv); }
        $(this).html($(this).html() === 'Start' ? 'Stop' : 'Start');

    });

    $(document).on('click', '.hidehit', function() {
        opt.blocklist.push(this.dataset.req);
        localStorage.setItem('sopt', JSON.stringify(opt));
        alert(`"${this.dataset.req}" added to block list.`);
        $('#blockedList').val(opt.blocklist.join('||'));
    });

    $(document).on('click', '#blockUpdate', function() {
       // console.log($('#blockedList').text().split('||'));
        opt.blocklist = [];
        opt.blocklist = $('#blockedList').val().split('||').slice(0);
        console.log(opt.blocklist);
        localStorage.setItem('sopt', JSON.stringify(opt));
        alert(`Block list updated`);
    });
    
    $(document).on('click', '#includeUpdate', function() {
        opt.includelist = [];
        opt.includelist = $('#includeList').val().split('||').slice(0);
        console.log(opt.includelist);
        localStorage.setItem('sopt', JSON.stringify(opt));
        alert(`Include list updated`);
    });

    $(document).on('change', '#minReward', function() {
        opt.floor = $(this).val();
        localStorage.setItem('sopt', JSON.stringify(opt));
    });

    $(document).on('change', '#reloadTime', function() {
        opt.refreshRate = $(this).val();
        localStorage.setItem('sopt', JSON.stringify(opt));
    });

    $(document).on('change', '#pageSize', function() {
        opt.pageSize = $(this).val();
        localStorage.setItem('sopt', JSON.stringify(opt));
    });

    $(document).on('change', '#showHidden', function() {
        opt.showHidden = $(this).prop('checked');
        localStorage.setItem('sopt', JSON.stringify(opt));
    });

    $(document).on('change', '#autoAccept', function() {
        opt.autoAccept = $(this).prop('checked');
        localStorage.setItem('sopt', JSON.stringify(opt));
    });
})();

function scrape(url, options) {

    let now = new Date();
    let curTime = `${now.getHours() < 10 ? '0' : ''}${now.getHours() % 12}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    $('#lastScraped').text(curTime);

    $.get(url, function (data) {
        let hits = [];
        $('span.requesterIdentity', $(data)).each( (k,v) =>  hits[k] = { requester: $(v).text().trim() } );
        $('a.capsulelink', $(data)).each( (k,v) => hits[k].title = $(v).text().trim() );
        $('span.reward', $(data)).each( (k,v) => hits[k].pay = Number($(v).text().trim().replace('$','')) );
        $('a:contains("View a HIT in this group")', $(data)).each( (k,v) =>  hits[k].url = ('https://www.mturk.com' + $(v).attr('href')).replace('preview','previewandaccept') );
        console.log(hits);
        $('#hitbox').empty();
        $('#hitbox').html(hits.forEach( h => {
            $('#hitbox').append(`<div ${options.blocklist.indexOf(h.requester) !== -1 && !options.showHidden || Number(options.floor) > h.pay  ? 'hidden' : options.blocklist.indexOf(h.requester) !== -1 && options.showHidden || Number(options.floor) > h.pay ? 'style="color: red"' : ''}><button type="button" class="hidehit" data-req="${h.requester}" ${options.blocklist.indexOf(h.requester) !== -1 || Number(options.floor) > h.pay ? 'hidden' : ''}>B</button> <b>${h.requester}</b> - ${h.title} - $${h.pay.toFixed(2)} - <a href="${h.url}" target="_blank"><b>Accept</b></a></div>`);

            if ((options.blocklist.indexOf(h.requester) === -1 && options.autoAccept && accepted.indexOf(h.requester) === -1 && Number(options.floor) < h.pay) || (options.includelist.indexOf(h.requester) !== -1 && options.autoAccept) || (options.includelist.indexOf(h.title) !== -1 && options.autoAccept)) {

               $.get(h.url, function (d) {

                   if ($('td:contains("Finished with this HIT?")', $(d)).length) {
                       console.log('got it');
                       accepted.push(h.requester);
                       new Audio('https://www.soundjay.com/button/button-21.mp3').play();
                       $('#hitlog').prepend(`<div><button type="button" class="hidehit" data-req="${h.requester}" }>B</button> <b>${h.requester}</b> - ${h.title} - $${h.pay.toFixed(2)} - <a href="${h.url}" target="_blank"><b>Accept</b></a> - <span style="color: green"><b>Accepted ${curTime}</b></span></div>`);
                       if ($('#pushbullet').prop('checked')) {
                           var push = {};

                           push['type'] = 'note';
                           push['title'] = 'Accepted Hit';
                           push['body'] = `${h.requester} - ${h.title} - ${h.pay.toFixed(2)} - ${h.url}`;

                           $.ajax({
                               type    : 'POST',
                               headers : {'Authorization': 'Bearer ' + 'o.OXn8yhIYOENgiU0GUsq6N00rkgmED29P'},
                               url     : 'https://api.pushbullet.com/v2/pushes',
                               data    : push
                           });
                       }
                   }
                   else if ($('span#alertboxHeader:contains("You have accepted the maximum number of HITs allowed.")', $(d)).length) {
                       console.log('queue full');
                       $('#hitlog').prepend(`<div><button type="button" class="hidehit" data-req="${h.requester}" }>B</button> <b>${h.requester}</b> - ${h.title} - $${h.pay.toFixed(2)} - <a href="${h.url}" target="_blank"><b>Accept</b></a> - <span style="color: blue"><b>Queue Full ${curTime}</b></span></div>`);
                   }
                   else if ($('td:contains("You have exceeded the maximum allowed page request rate for this website.")', $(d)).length) {
                       console.log('rate limit exceeded');
                       $('#hitlog').prepend(`<div><button type="button" class="hidehit" data-req="${h.requester}" }>B</button> <b>${h.requester}</b> - ${h.title} - $${h.pay.toFixed(2)} - <a href="${h.url}" target="_blank"><b>Accept</b></a> - <span style="color: orange"><b>Refresh Rate Exceeded ${curTime}</b></span></div>`);
                   }
                   else {
                       console.log('nope');
                       $('#hitlog').prepend(`<div><button type="button" class="hidehit" data-req="${h.requester}" }>B</button> <b>${h.requester}</b> - ${h.title} - $${h.pay.toFixed(2)} - <a href="${h.url}" target="_blank"><b>Accept</b></a> - <span style="color: red"><b>Missed ${curTime}</b></span></div>`);
                   }
               });
            }

        }));

    }).fail(function () {
        setTimeout(function() {
         //   scrape(url, options);
        }, 1000);
    });

}