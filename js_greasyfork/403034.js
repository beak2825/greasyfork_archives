// ==UserScript==
// @name         Typeracer: Adjusted speed calculator
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  Adds more values to data.typeracer races details (points/unlagged and adjusted speeds)
// @author       poem
// @match        https://data.typeracer.com/pit/result*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/403034/Typeracer%3A%20Adjusted%20speed%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/403034/Typeracer%3A%20Adjusted%20speed%20calculator.meta.js
// ==/UserScript==

/*Changelog:
=================================================================================================================
1.1.0 (04-08-20):   Initial release
1.2.1 (04-12-20):   Added unlagged and adjusted speed values
                    Forced 2 decimals for speed/3 for adjusted/none for points
                    Changed name "to Typeracer: More Race Details"
1.2.4 (04-12-20):   Fixed replay button & margins
                    Reverse lag is now highlighted (eg. https://data.typeracer.com/pit/result?id=%7Ctr:poem%7C69527)
1.2.5 (04-13-20):   Fixed reverse lag detection
1.2.6 (04-13-20):   Fixed non-play universes
                    Moved error messages to console
1.2.7 (04-20-20):   Added Ping value
=================================================================================================================*/

var race_log = '';
function consecutiveLogNumbersAfter(k)
{
    let ofTheJedi='';
    while(k<race_log.length&&/^\d+$/.test(race_log[k]))
    {
        ofTheJedi+=race_log[k++]
    }
    return ofTheJedi;
}

// Wait for page loading to access replay
window.addEventListener('load', function() {
    setTimeout(function(){

    //Cleaner detail
    document.querySelector('.raceDetails > tbody > tr:nth-child(2) > td').innerText = "Race";

    //find and grab log
    let script=document.getElementsByTagName('script');
    for(let m=0; m<script.length;m++)
    {
        if(script[m].innerText.includes("var typingLog"))
            race_log = script[m].innerText.split(',')[3].split('\|')[0];
    }

	// Unlagged speed
	document.getElementsByClassName('ImageButton')[4].click();
	var unlagged_speed = parseFloat(document.getElementsByClassName('statusIndicator')[1].title.split(' WPM')[0]);
	document.getElementsByClassName('ImageButton')[1].click();

	// Adjusted speed
	var quote_length = $('.fullTextStr')[0].innerText.split('').length;
	var t_total = quote_length/unlagged_speed; // in seconds/12
    var start_time_ms;
    if(race_log[0]=='\\')
    {
        if(race_log[1]=='b')
            start_time_ms=consecutiveLogNumbersAfter(3);
        else
            start_time_ms=consecutiveLogNumbersAfter(6);
    }
    else
        start_time_ms=consecutiveLogNumbersAfter(1);
    var t_start=parseInt(start_time_ms)/12000; // s/12
    var adjusted_speed = ((quote_length-1)/(t_total-t_start)).toFixed(3);

	var points = 0;
	var lagged_speed = 0;

	// Race context
	var [race_universe,univ_index] = ["play",4];
	if($('.raceDetails > tbody > tr:nth-child(4) > td:nth-child(1)')[0].innerText=="Universe")
    {
		race_universe = $('.raceDetails > tbody > tr:nth-child(4) > td:nth-child(2)')[0].innerText;
        univ_index++;
    }
	var player_name = /.*\((.*)\)$/.exec($('.raceDetails > tbody > tr:nth-child(1) > td:nth-child(2)')[0].innerText)[1];
	var race_number = $('.raceDetails > tbody > tr:nth-child(2) > td:nth-child(2)')[0].innerText;
	var date_str = $('.raceDetails > tbody > tr:nth-child(3) > td:nth-child(2)')[0].innerText;

	// Race timespan
	var date_obj = new Date(date_str);
	var race_unix_num = parseInt((date_obj.getTime()/1000).toFixed(0));
	var unix_start = (race_unix_num-1).toString();
	var unix_end = (race_unix_num+1).toString();

	// Fetch race data from timespan API (exact lagged speed, points)
	var race_data_url = 'https://data.typeracer.com/games?playerId=tr:'+player_name+'&universe='+race_universe+'&startDate='+unix_start+'&endDate='+unix_end;
	fetch(race_data_url)
		.then(response => {
		if (response.status !== 200)
			return;
		response.json().then(data => {
			for(var i=0;i<data.length;i++)
			{
				if(data[i].gn==race_number) // In case timespan contained multiple races
				{
					// Display values
                    var registered_speed = parseFloat(data[i].wpm);

                    var t_total_lagged = quote_length/registered_speed; // s/12
                    var ping = Math.round((t_total_lagged-t_total)*12000); // ms

                    var reverse_lag_style = '';
                    if(unlagged_speed < registered_speed)
                        reverse_lag_style=' color:red; font-weight: 1000;';
                    registered_speed = registered_speed.toFixed(2);
                    unlagged_speed = unlagged_speed.toFixed(2);
                    var points = Math.round(data[i].pts);
                    var ghost_button_html = $('.raceDetails > tbody > tr:nth-child('+univ_index+') > td:nth-child(2) > a')[0].outerHTML.split('<a').join('<a style="position: absolute;left: 100px;"');
					$('.raceDetails > tbody').append($('<tr><td>Points</td><td>'+points+'</td></tr>'));
					$('.raceDetails > tbody > tr:nth-child('+univ_index+')')[0].outerHTML = '<br><tr><td>Registered</td><td style="position: relative;'+reverse_lag_style+'"><span>'+registered_speed+' WPM</span>'+ghost_button_html+'</td></tr><tr><td>Unlagged</td><td>'+unlagged_speed+' WPM (ping: '+ping+'ms)</td></tr><tr><td>Adjusted</td><td>'+adjusted_speed+' WPM (start: '+start_time_ms+'ms)</td></tr><br>';
				}
			}
			});
		})
		.catch(err => {
			console.log("[D.TR-P] error: "+err);
		});
    },100);
}, false);