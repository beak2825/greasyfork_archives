// ==UserScript==
// @name        Wanikani Review Timer
// @namespace   wkreviewtimer
// @description Egg timer overhaul. Tracks how long you've been doing your review for. See the original here: https://greasyfork.org/en/scripts/16316-wanikani-egg-timer
// @include     http://www.wanikani.com/*
// @include     https://www.wanikani.com/*
// @version     1.03
// original author...
// @author      Horus Scope
// edited by...
// @author      iLaysChipz
// @grant	    none
// @license     GPL version 3 or later: http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/403793/Wanikani%20Review%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/403793/Wanikani%20Review%20Timer.meta.js
// ==/UserScript==

let timeSpan, wkof_installed; // referenced in go( )

// ===========================================================================================================================================
// Calculates time between now and start of review, then saves the time into data.

function update() {
    let duration = Math.floor((Date.now() - new Date(window.localStorage.eggtimer_start))/1000);

    // Fifteen minute timeout. Resets timer if review page closed and revisited after 15 minutes
    if (duration - window.localStorage.eggtimer_lastactive > 60 * 15)
    {
        window.localStorage.eggtimer_start = new Date();
        update();
        return;
    }

    window.localStorage.eggtimer_lastactive = duration
    let seconds = duration % 60;
    let minutes = (duration - seconds) / 60 % 60;
    let hours = ((duration - seconds) / 60 - minutes) / 60 % 24;
    let days = (((duration - seconds) / 60 - minutes) / 60 - hours) / 24

    window.localStorage.eggtimer_data = ""
	  + (days? days+"d " : "")
      + (hours? hours+"h " : "")
	  + (minutes? minutes+"m " : "")
	  + (seconds? seconds+"s" : "");
}

// ===========================================================================================================================================
// Generates text element.

function generate() {
	let display = document.createElement('div');
	display.className = 'timerSessionDisplay';
    display.style.cssText = "background-color: transparent; color: #666666"
	timeSpan = document.createElement('span');
	timeSpan.className = 'timerSessionSpan';
	timeSpan.textContent = "Your last session lasted " + window.localStorage.eggtimer_data;
	display.appendChild(timeSpan);
	return display;
}

// ===========================================================================================================================================
// Shows/hides the timer.

function show_hide_timer()
{
    let pinned = window.localStorage.eggtimer_pinned;
    if( pinned === null || typeof pinned === "undefined" )
        pinned = false;
    else pinned = (pinned == "true" ? false : true);
    window.localStorage.eggtimer_pinned = pinned;
    timeSpan.style.cssText = pinned ? "display: block;" : "display: none;";
    timeSpan.style.cssText += " color: rgb(200,200,200); font-family: HonyaJi-Re; text-align:center; margin-top: 20px";
}

// ===========================================================================================================================================
// If hotkey (t) is pressed, activate above function

function timer_hotkey(event)
{
	if (document.activeElement == document.getElementsByTagName("body")[0]) {
		let key = event.which || event.keyCode;
		if (key == 84 || key == 116) show_hide_timer();
	}
}

// ===========================================================================================================================================
// Initiates Wanikani Open Framework and related features

function init()
{
    var script_name = 'Review Timer';
    if (window.wkof) {
        wkof_installed = true;
        wkof.include('Menu,Settings');
        wkof.ready('Menu,Settings')
            .then(load)
            .then(menu_init)
            .then(button_init)
    }
    else
    {
        wkof_installed = false;
        button_init();
    }
}

// ===========================================================================================================================================
// Loads UI settings

function load()
{
    let default_settings =
    {
        position: 1,
        button_type: 'default',
        classic_color: '#003377',
    };
    return wkof.Settings.load('review_timer',default_settings);
}

// ===========================================================================================================================================
//

function menu_init()
{
    let menu =
    {
        name: 'review_timer_settings',
        submenu: 'Settings',
        title: 'Review Timer',
        on_click: menu_open
    };

    console.log('SCRIPT-WK_Review_Timer> setting: position = ' + wkof.settings.review_timer.position);
    console.log('SCRIPT-WK_Review_Timer> setting: button_type = ' + wkof.settings.review_timer.button_type);
    console.log('SCRIPT-WK_Review_Timer> setting: classic_color = ' + wkof.settings.review_timer.classic_color);

    wkof.Menu.insert_script_link(menu);
}

// ===========================================================================================================================================
//

function menu_open()
{
    let menu =
    {
        script_id: 'review_timer',
        title: 'WK Review Timer Options',
        content:
        {
            position:
            {
                type: 'number',
                label: 'Button Position',
                hover_tip: 'Where to place the button in relation to the other buttons.',
                default: 1,
                min: 1,
            },

            button_type:
            {
                type: 'dropdown',
                label: 'Button Appearance',
                hover_tip: 'Choosing Classic puts the button on the bottom where it used to be.',
                default: 'default',
                full_width: false,
                content:
                {
                    default: 'Default Button',
                    classic: 'Classic Button',
                    none: 'Hide Button',
                }
            },

            classic_color:
            {
                type: 'color',
                label: 'Classic Button\'s Color',
                hover_tip: 'If classic button is enabled, choose button color.',
                default: '#1DC469',
                full_width: false,
            },
        }
    }
    new wkof.Settings(menu).open();
}

// ===========================================================================================================================================
// Add button to list of buttons

function button_init()
{
    if(!/session/i.exec(window.location.pathname)) return;
    if (wkof_installed)
    {
        switch(wkof.settings.review_timer.button_type)
        {
            case 'default': break;
            case 'classic': classic_init(); return;
            case 'none': default: return;
        }
    }


    let button = document.createElement('li');
    button.id = 'option-timer';
    button.append(document.createElement('span'))
    button.firstElementChild.title="Pin Timer"
    button.firstElementChild.append(document.createElement('i'))
    button.firstElementChild.firstElementChild.className='icon-pushpin'
    let target = $('#additional-content ul')[0];
    place_button(button, target);

    let width = Math.floor(995 / $('#additional-content ul')[0].childElementCount) / 10.0;
    $('#additional-content ul').css('text-align','center')
    $('#additional-content ul li').css('width', width+'%')
    $('#option-timer').click(show_hide_timer);

}

// ===========================================================================================================================================
// Add classic button to list of button on bottom.
function classic_init()
{
    let button = document.createElement('div');
    button.className = "option-timer";
    button.style.cssText =  "background-color: " + wkof.settings.review_timer.classic_color + "; ";
    button.style.cssText += "color: white; ";
    button.style.cssText += "cursor: pointer; ";
    button.style.cssText += "display: inline-block; ";
    button.style.cssText += "font-size: 0.8125em; ";
    button.style.cssText += "padding: 10px; ";
    button.style.cssText += "vertical-align: bottom; ";
    button.textContent = "Show/Hide Timer";
    button.onclick = show_hide_timer;
    let target = $('footer')[0];
    place_button(button, target);
}

function place_button(button, target)
{
    let placed = false;
    target = target.firstElementChild;
    for (let i=1; i<wkof.settings.review_timer.position; i++)
    {
        if (target.nextElementSibling == null)
        {
            placed = true;
            target.after(button);
        }
        target = target.nextSibling
    }
    if (!placed) target.before(button);
}

// ===========================================================================================================================================
// start counting. [or, dont]

function main()
{
    init();

    // If block executes if at reviews. Goes to else if on review summary page
	if(/session/i.exec(window.location.pathname)) { // review/session [ reviewing now ]

        // Reset timer if first time or queued to reset
        if (window.localStorage.eggtimer_start == null || window.localStorage.eggtimer_reset == "true")
        {
            window.localStorage.eggtimer_start = new Date();
            window.localStorage.eggtimer_reset = false;
        }

        // Generate and append timer text below list of buttons
		$('#additional-content').append( generate() );

        // Insert button and assing hotkey (t)
        window.addEventListener("keypress", timer_hotkey);

        // Style options including visbility of timer
        timeSpan.style.cssText = window.localStorage.eggtimer_pinned == "false" ? "display: none" : "display: block";
        timeSpan.style.cssText += " color: rgb(200,200,200); font-family: 'Sans'; text-align:center; margin-top: 20px";

        // Update timer and text once every second
		setInterval(function() {update(); timeSpan.textContent = "Time Elapsed: " + window.localStorage.eggtimer_data;}, 1000);
	}
    else if (/review/i.exec(window.location.pathname)) // Executes if on summary page.
    {
        window.localStorage.eggtimer_reset = true;               // Queue timer to be reset
        $('#last-session-date').parent().prepend( generate() );  // Add text element to top of session info.
	}
}

// ===========================================================================================================================================
// Start main function on page load.

window.onload = main();


