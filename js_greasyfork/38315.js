// ==UserScript==
// @name        Elite OC Tool
// @namespace   MercM3.Elite.Features
// @author      MercM3
// @description OC Tool
// @include     *https://www.torn.com/travelagency.php*
// @include     *https://www.torn.com/preferences.php#tab=api*
// @version     1.0.4
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.plugin.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.countdown.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38315/Elite%20OC%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/38315/Elite%20OC%20Tool.meta.js
// ==/UserScript==


var data, apiKey;

(function() {

    //deleteApiKey();
    var $Div = $('<div></div>');
    var $titleDiv = $('<div>', {'class': 'title-black top-round', 'aria-level': '5', 'text': 'Elite Features'}).css('margin-top', '10px');
    var $bottomDiv = $('<div class="bottom-round gym-box cont-gray p10"></div>');
    var $OCInfo = ''  ;
    var $DivInline = '';
    $Div.append($titleDiv);

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

                    $OCInfo = 'You need API Permission from the faction!';
                    $DivInline = $('<div class="inline-block" style="width:9000px">' + $OCInfo +'</div>');
                    $bottomDiv.append($DivInline);
                    $Div.append($bottomDiv);
                    SetEliteContainer($Div);
                }else{


                    for (var id in data.crimes) {
                        if (data.crimes.hasOwnProperty(id)) {
                            var crime = data.crimes[id];
                            var pa = JSON.parse('['+crime.participants+']');
                            for(var i = 0; i < pa.length; i++){
                                if(!crime.initiated && pa[i] === userId){
                                    if(crime.time_left < 691201){
                                        if(crime.time_left === 0){
                                            $OCInfo = 'Faction OC: ' + crime.crime_name + ' is ready. &nbsp &nbsp &nbsp &nbsp';
                                        }
                                        else
                                        {
                                            $OCInfo = 'Faction OC: ' + crime.crime_name + ' ready in: '+formatSeconds(crime.time_left) +' &nbsp &nbsp &nbsp &nbsp'  ;
                                        }
                                        $DivInline = $('<div class="inline-block" style="width:9000px">' + $OCInfo + '</div>');
                                        $DivInline.append($('<a target="_blank" href="factions.php?step=your#/tab=crimes">Check Elite OC</a>'));
                                        $bottomDiv.append($DivInline);
                                        $Div.append($bottomDiv);
                                        SetEliteContainer($Div);
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
    data = JSON.parse(localStorage.getItem('elite.torn'));

    if(data !== null && data.apikey){
        apiKey = data.apikey;
    }else{
        getApiKey();
    }
}

function saveApiKey(key){
    if(data === null) data = {};
    data.apikey = key;
    localStorage.setItem('elite.torn', JSON.stringify(data));
}
function deleteApiKey(){
    localStorage.removeItem("elite.torn");
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
    //block += '<div class="menu-header" style="border-radius: 8px 8px 0 0; padding: 5px 8px;">Elite OC Tool</div>';
    block += '<div class="profile-container" style="padding: 5px;">';
    block += '<div class="profile-container">';
    block += 'In order to use this script you need to enter your Torn Api Key, which you can '+
        'get on your <a href="http://www.torn.com/preferences.php">preferences page</a> and under the \'API Key\' tab.<br />';
    block += input;
    block += button;
    block += '</div></div>';


    var $Div = $('<div></div>');
    var $titleDiv = $('<div>', {'class': 'title-black top-round', 'aria-level': '5', 'text': 'Elite Features'}).css('margin-top', '10px');
    var $bottomDiv = $('<div class="bottom-round gym-box cont-gray p10"></div>');
    $Div.append($titleDiv);
    var $OCInfo  = 'Your OC info will appear here if you save your API key and you have faction API access &nbsp &nbsp &nbsp &nbsp';
    var $DivInline = $('<div class="inline-block" style="width:9000px">' + $OCInfo +'</div>');
    $bottomDiv.append($DivInline);
    $Div.append($bottomDiv);
    SetEliteContainer($Div);
    SetEliteContainer(block);

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
    var days = Math.floor(s/(60*60*24))%24;
    var seconds = s%60;

    return '{0}d {1}h {2}m {3}s'.format(days, hours, minutes, seconds);
}

function SetEliteContainer(eliteobject)
{
  $('#tab4-2').append(eliteobject);

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