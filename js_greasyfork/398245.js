// ==UserScript==
// @name         HumbleBundle Exporter
// @match        https://www.humblebundle.com/home/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version      0.5
// @description  An easy way to export the games and the keys owned on HumbleBundle (Json format)
// @namespace https://greasyfork.org/users/462544
// @downloadURL https://update.greasyfork.org/scripts/398245/HumbleBundle%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/398245/HumbleBundle%20Exporter.meta.js
// ==/UserScript==

/*
 * Global vars
 */
const $$ = $.noConflict(true);
var keys_exported = null;

/*
 * Funcs
 */
function copy_to_clipboard(element) {
    let temp = $$("<textarea>");
    $$("body").append(temp);
    temp.val($$(element).text()).select();
    document.execCommand("copy");
    temp.remove();
}

function json_sort_by_key(array, key) {
    return array.sort((a, b) => {
        var x = a[key].toLowerCase(); 
        var y = b[key].toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function create_game_entry(name, platform, redeemed, key) {
    return {"name": name, "platform": platform, "redeemed": redeemed, "key": key};
}

function export_keys() {
    if($$('.js-key-manager-holder .js-jump-to-page:first').text() != "1"){
        $$('.js-key-manager-holder .js-jump-to-page:nth-child(2)').click();
    }

    var games = [];
    var loop = $$('.js-key-manager-holder .js-jump-to-page:nth-last-child(2)').html()*1;

    for (i = 0; i < loop; i++){
        $$('tbody tr').each(function(){
            let name = $$(this).children('td.game-name').children('h4').attr('title');
            let platform = $$(this).children('td.platform').children('i').attr('title');

            let keyfield = $$(this).find("div.keyfield")[0];
            if (keyfield == null) {
                return;
            }

            let redeemed = $$(keyfield).attr('class').includes("redeemed");
            let key = "";
            if (redeemed) {
                key = $$(keyfield).attr("title")
            }

            game_data = create_game_entry(name, platform, redeemed, key);
            games.push(game_data)
        });

        // click next page button
        $$('.js-key-manager-holder .js-jump-to-page:last').click();
    }

    json_sort_by_key(games, "name");
    return games;
}

/*
 * UI
 */
function init_ui()
{
    let window_html = `
    <style>
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 80px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }

        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 10px;
            border: 1px solid #888;
            width: 60%;
        }

        .controls-container {
            position: absolute;
            right: 20%;
        }

        .status-container {
            position: absolute;
            left: 20%;
        }

        .copy-btn, .status-text {
            color: #aaaaaa;
            font-size: 22px;
            font-weight: bold;
        } 

        .close {
            color: #aaaaaa;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            padding-left: 5px;
        }

        .close:hover,
        .close:focus,
        .copy-btn:hover,
        .copy-btn:focus,
        .game-link:hover,
        .game-link:focus,
        .redeemed-link:hover,
        .redeemed-link:focus
         {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        .json-data {
            border: 1px solid #888;
            margin-top: 40px;
            margin-left: 1px;
            margin-right: 1px;
            overflow: auto; /* Enable scroll if needed */
            height: 70vh;
            background-color: #DDD;
        }
    </style>
    <div id="KeysWindow" class="modal">
        <div class="modal-content">
            <div class="status-container">
                <span class="status-text">
                    <span class="game-count"></span>
                    <a class="game-link" target="#">games</a> found,                 
                    <span class="redeemed-count"></span>
                    <a class="redeemed-link" target="#">redeemed.</a>     
                </span>
            </div>
            <div class="controls-container">
                <span class="copy-btn">[Copy]</span>
                <span class="close">[&times;]</span>
            </div>
            <pre class="json-data"></p> 
        </div>
    </div>`;
    $$('body').append(window_html);  

    let button_html = $$('<button class="export-btn" style="margin-right: -20px">Export</button>');
    button_html.insertBefore('.js-key-search');
  
    /*
    * Events
    */
    $$('.close').click(() => {
        $$('#KeysWindow').css("display", "none");
    });

    $$(".copy-btn").click(() => {
        copy_to_clipboard($$('.json-data'));
    });

    $$('.game-link').click(() => {        
        $$('.json-data').text(JSON.stringify(keys_exported, null, 2));
    });

    $$('.redeemed-link').click(() => {
        let redeemed_games = keys_exported.filter(e => e.redeemed == true);
        $$('.json-data').text(JSON.stringify(redeemed_games, null, 2));
    });

    $$('.export-btn').click(() => {
        keys_exported = export_keys();

        $$('.json-data').text(JSON.stringify(keys_exported, null, 2));
        $$('.game-count').text(keys_exported.length);

        let redeemed_count = keys_exported.filter(e => e.redeemed == true).length;
        $$('.redeemed-count').text(redeemed_count);

        $$('#KeysWindow').css("display", "block"); 
    }); 
}

function try_delayed_init() {
    window.setTimeout(() => {        
        let already_init = $$('body').find('#KeysWindow')[0] ? true : false;
        if (location.href.includes("home/keys") && !already_init) {
            init_ui(); 
        }
    }, 150);
}

/*
 * Main
 */
(() => {
    $(window).load(() => { 
        if (location.href.includes("home/keys")) {
            init_ui(); 
        } else {
            $("body").find(".tabbar-tab").each(function() {
                $(this).click(try_delayed_init);
            });
        }
        console.log("-- Script loaded");
    });
})();