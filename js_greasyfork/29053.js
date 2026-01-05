// ==UserScript==
// @name         Faction OC Rescuer
// @namespace    Jebster.Torn
// @version      0.0.2
// @description  Alerts when your OC is about to start when you visit the traveling page.
// @author       Jeggy [1526723]
// @include      *.torn.com/travelagency.php*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/29053/Faction%20OC%20Rescuer.user.js
// @updateURL https://update.greasyfork.org/scripts/29053/Faction%20OC%20Rescuer.meta.js
// ==/UserScript==


var data, apiKey;

(function() {
    loadApiKey();
    if(!apiKey) return;
    var userIdURL = 'https://api.torn.com/user/?selections=basic,bars&key='+apiKey;
    var ocsURL = 'https://api.torn.com/faction/?selections=crimes&key='+apiKey;

    apiCall(userIdURL, function(data){
        if(data === undefined || data.error){
            getApiKey();
        }else{
            var userId = data.player_id;
            var server_time = data.server_time;
            apiCall(ocsURL, function(data){
                if(data === undefined || data.error){
                    alert('You need API Permission from the faction!');
                }else{
                    for (var id in data.crimes) {
                        if (data.crimes.hasOwnProperty(id)) {
                            var crime = data.crimes[id];
                            var pa = JSON.parse('['+crime.participants+']');
                            for(var i = 0; i < pa.length; i++){
                                if(!crime.initiated && pa[i] === userId){
                                    if(crime.time_left < 21600){
                                        if(crime.time_left === 0){
                                            alert('The faction organised crime that you are in is ready.');
                                        }else{
                                            alert('The faction organised crime that you are in is ready in: '+formatSeconds(crime.time_left));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });
})();

function loadApiKey(){
    data = JSON.parse(localStorage.getItem('jebster.torn'));

    if(data !== null && data.apikey){
        apiKey = data.apikey;
    }else{
        getApiKey();
    }
}

function saveApiKey(key){
    if(data === null) data = {};
    data.apikey = key;
    localStorage.setItem('jebster.torn', JSON.stringify(data));
}

var asked = false;
function getApiKey(){
    console.log(asked);
    if(asked) return; asked = true;
    $( 'head' ).append( '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">' );

    var button = '<button id="JApiKeyBtn" style="';
    button += 'background-color: #282828;';
    button += 'border: none;';
    button += 'border-radius: 0 8px 8px 0;';
    button += 'color: white;';
    button += 'padding: 5px 5px 5px 6px;';
    button += 'text-align: center;';
    button += 'text-decoration: none;';
    button += 'display: inline-block;';
    button += 'font-size: 16px;';
    button += 'margin: 4px 0px;';
    button += 'cursor: pointer;';
    button += '"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>';

    var input = '<input type="text" id="JApiKeyInput" style="';
    input += 'border-radius: 8px 0 0 8px;';
    input += 'margin: 4px 0px;';
    input += 'padding: 5px;';
    input += 'font-size: 16px;';
    input += '" placeholder="ApiKey"></input>';

    var block = '<div class="profile-wrapper medals-wrapper m-top10">';
    block += '<div class="menu-header" style="border-radius: 8px 8px 0 0; padding: 5px 8px;">Faction OC Rescuer</div>';
    block += '<div class="profile-container" style="padding: 5px;">';
    block += 'In order to use this script you need to enter your Torn Api Key, which you can '+
        'get on your <a href="http://www.torn.com/preferences.php">preferences page</a> and under the \'API Key\' tab.<br />';
    block += input;
    block += button;
    block += '</div></div>';

    $(block).insertAfter($('.content-title, .m-bottom10')[0]);

    $('#JApiKeyBtn').click(function(){
        var key = $("#JApiKeyInput").val();
        saveApiKey(key);
        location.reload();
    });
}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function formatSeconds(s){
    var minutes = Math.floor(s/60)%60;
    var hours = Math.floor(s/(60*60))%24;
    var seconds = s%60;

    return '{0}h {1}m {2}s'.format(hours, minutes, seconds);
}

function apiCall(url, cb){
    console.log('Faction OC Rescuer: making request \''+url+'\'');
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            cb(data);
        }
    });
}