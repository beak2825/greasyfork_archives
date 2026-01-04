// ==UserScript==
// @name         roster
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  calendar
// @author       You
// @match        https://web.powerapps.com/webplayer/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xhook/1.4.9/xhook.min.js

// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.js

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390893/roster.user.js
// @updateURL https://update.greasyfork.org/scripts/390893/roster.meta.js
// ==/UserScript==
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.css">');





(function() {
    'use strict';

    var xname;
    var rtitle = 'MYROSTER';
    var x = [];
    var c = [];
    var res;

    xhook.after(function(request, response) {



        if (response.finalUrl.match(/https:\/\/api.powerapps.com\/api\/invoke/)) {
            c.push(
                JSON.parse(response.data)
            );
        }








        if (response.finalUrl.match(/https:\/\/australia-001.azure-apim.net\/invoke/)) {
            if (response.data instanceof ArrayBuffer) {

                x = new TextDecoder("utf-8").decode(response.data);
                x = JSON.parse(x);
                x = x.value;


                //append roster
                $('#shell-header-container').append('<div class="xros"><h1 class="shell-brand-title">'+rtitle+'</h1></div>');
                $('#d365shell-header-container').append('<div class="xros"><h1 class="d365shell-brand-title">'+rtitle+'</h1></div>');


                $('.xros').click(loadcal);

            }
        }






    });



    function loadcal() {

        var L = 50,
            T = 50,
            W = 1300,
            H = 1200,
            bgColor = 'lightblue',
            visible = 1,
            zIndex = 2


        var ST = 'position:absolute' +
            '; left:' + L + 'px' +
            '; top:' + T + 'px' +
            '; width:' + W + 'px' +
            '; height:' + H + 'px' +
            '; clip:rect(0,' + W + ',' + H + ',0)' +
            '; visibility:' +
            (null == visible || 1 == visible ? 'visible' : 'hidden') +
            (null == zIndex ? '' : '; z-index:' + zIndex) +
            (null == bgColor ? '' : '; background-color:' + bgColor);



        var newNode = document.createElement('div');
        newNode.setAttribute('id', 'calendars');
        newNode.setAttribute('style', ST);
        document.body.appendChild(newNode);

        var calendarEl = document.getElementById('calendars');

        $('#calendars').fullCalendar({
            firstDay: 1,
            minTime: '06:00:00',
        	timeZone: 'local',

            header: {
                left: 'prev,next today',
                right: 'month,agendaWeek,agendaDay'
            }

        });





        for (var j = 0; j < c.length ; j++) {
            if(c[j].hasOwnProperty('connections')){
                xname = c[j].connections[0].properties.createdBy.displayName;
                break;
            }
        }

        var z = [];
        var loc = '';
        for (var i = 0; i < x.length ; i++) {

            if (
                x[i].Technician.DisplayName == xname &&
                x[i].Roster_x0020_Start &&
                x[i].Roster_x0020_Finish
            ) {


                loc = x[i].Location && x[i].Location.Value ? x[i].Location.Value : '';


                $('#calendars').fullCalendar(
                    'renderEvent',

                    {

                        id: x[i].ID,
                        title: moment( x[i].Roster_x0020_Start).format('HH:mm') +"-"+ moment( x[i].Roster_x0020_Finish).format('HH:mm')


                        //+" @ "+ x[i].Location.Value,
                        +" @ "+ loc,


                        start:moment( x[i].Roster_x0020_Start).format('YYYY-MM-DDTHH:mm'),
                        end:  moment( x[i].Roster_x0020_Finish).format('YYYY-MM-DDTHH:mm'),

                    }, true);



            }

        }




    }




    // Your code here...
})();