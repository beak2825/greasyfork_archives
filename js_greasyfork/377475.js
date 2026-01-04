// ==UserScript==
// @name         basketball-ppm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.flashscore.com.au/basketball/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377475/basketball-ppm.user.js
// @updateURL https://update.greasyfork.org/scripts/377475/basketball-ppm.meta.js
// ==/UserScript==

//(function() {
//    'use strict';
    
    
    //var updatepointsinterval = setInterval(function(){ updatepoints(); }, 2000);
    //var updatepointsinterval = setInterval( updatepoints, 2000);
    setInterval(function() { updatepoints(); },2000);
    
    var p,id,quarter,time,hid,aid,home,away,
        totaltime,totalpoints,ppm,fullgametime,esttotalpoints;
    
  
    $('.icons').css('cursor','pointer !important');
    
    $('.icons').click(function(){
        updatepoints();
    });

    
    function updatepoints(){
        
        console.log('u'); 

        $('.cell_ia.icons').each(function(e,i) {

            //remove blinker
            $('.blink').remove();
            
            //get parent and id
            p = $(this);
            id = $(p).parent().attr('id');


            //get time and quarter
            time = $(p).parent().children('.timer').text();//playing


            //depending on quarter, get time
            if( time.indexOf('1st') === 0 ||
               time.indexOf('2nd') === 0 ||
               time.indexOf('3rd') === 0 ||
               time.indexOf('4th') === 0
              ){

                //extract quarter
                quarter = $(p).parent().children('.timer').text().split(' ')[0];//playing
                quarter = parseInt(quarter);


                //extract time
                time = time.split(' ')[1];
                if(time && time.length > 0){
                    time = time.split(' ')[1];
                }
                time = parseInt(time);

            }else if( time.indexOf('Half') === 0 ){
                quarter = 3;
                time = 1;
            }else if( time.indexOf('Finished') === 0 ){
                quarter = 4;
                time = 12;

                clearInterval(updatepointsinterval);
            }

            //get ids, home and away
            id = id.split('_');
            hid = 'g_'+ id[1] +'_'+ id[2];
            aid = 'x_'+ id[1] +'_'+ id[2];

            //get current points
            home = $('#'+hid).children('.score-home').text();//playing
            away = $('#'+aid).children('.score-away').text();//playing

            home = parseInt(home);
            away = parseInt(away);


            //calculate points per minute and
            //estimated total over and under
            totaltime = (12 * (quarter-1)) + time;
            totalpoints = home + away;
            ppm = totalpoints / totaltime;
            fullgametime = 12 * 4;
            esttotalpoints = fullgametime * ppm;

            if( home && away ){

                $(p).children('.icons')[0].innerHTML = esttotalpoints.toFixed(0);
                //$(p).children('.icons')[1].innerHTML = ppm.toFixed(2);

            }

        });
    }

//})();