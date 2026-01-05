// ==UserScript==
// @name        Torn Helper
// @namespace   Jebster.Torn
// @author      Jeggy
// @description Adds extra information to different pages all around Torn.
// @include     *.torn.com/profiles.php?XID=*
// @version     0.3.2
// @require     http://code.jquery.com/jquery-2.2.4.min.js
// @require     http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @resource    jquery-ui http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/black-tie/jquery-ui.min.css
// @resource    jquery-base http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/25921/Torn%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25921/Torn%20Helper.meta.js
// ==/UserScript==
// debugger;

GM_addStyle(GM_getResourceText('jquery-base'));
GM_addStyle(GM_getResourceText('jquery-ui'));

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var data = {};

(function() {
    'use strict';

    $( 'head' ).append( '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">' );

    var site = window.location.pathname;

    loadData();
    saveOwnData();

    loadAttackLog();

    if(site.indexOf('profiles.php') > 0) profileView();

})();

function loadAttackLog(){
    var selections = '';
    var now = new Date().getTime();

    if('attackLogLoad' in data){
        if(data.attackLogLoad < now - (12*60*60*1000)) // More than 12 hours ago
            selections = 'attacksfull';
        else if(data.attackLogLoad < now - (2*60*1000)) // More than 2 minutes ago
            selection = 'attacks';
    }else // First time
        selections = 'attacksfull';

    var url = 'https://api.torn.com/user/'+data.me.id+'?selections='+selections+'&key='+data.apikey;
    if(selections !== ''){
        data.attackLogLoad = now;

        apiCall(url, function(d) {
            if(d.error) getApiKey();
            else{
                for(var p in d.attacks){
                    if (d.attacks.hasOwnProperty(p)) {
                        var attack = d.attacks[p];
                        var defender_id = attack.defender_id;
                        if(!(defender_id in data)) data[defender_id] = {};

                        if(attack.attacker_id == data.me.id){
                            // My attack
                            if(!('attacks' in data[defender_id])) data[defender_id].attacks = {};
                            data[defender_id].attacks[p] = attack;
                        }else if('attacker_id' in attack && attack.attacker_id in data){
                            // I'm being attacked
                            if(!('defends' in data[attack.attacker_id])) data[attack.attacker_id].defends = {};
                            data[attack.attacker_id].defends[p] = attack;
                        }
                    }
                }

                save();
            }
        });
    }
}

function profileView(){
    var userid = getParameterByName('XID');
    var userData = data[userid];
    var content = '';
    content += profileViewSelectionPopUp();
    content += '<div id="compareStats">';
    content += 'Loading...';
    content += '<br />';
    content += '</div>';

    var acrdHtml = accordion('Torn Helper', content);

    var afterWait = function () {
        $(acrdHtml).insertAfter($('.profile-wrapper + .m-top10')[0]);
        var compareFunc = function(){
            $('#compareStats').replaceWith(compareTemplate(userid, data.me.userid));
        };
        apiUserStats(userid, compareFunc);
        apiUserStats(data.me.userid, compareFunc);
    };
    var wait = function () {
        var loaded = $('.profile-wrapper + .medals-wrapper + .m-top10').length > 0;

        if (loaded) afterWait();
        else setTimeout(wait, 5);
    };

    wait();
}

// Only supports one accordion on the page at the moment.
function accordion(title, block){
    var css = '<style>'+
        'button.Jaccordion {'+
        'cursor: pointer;'+
        'padding: 18px;'+
        'width: 100%;'+
        'text-align: left;'+
        'transition: 0.4s;'+
        '}'+
        'div.Jpanel {'+
        'position:relative;'+
        'max-height: 0;'+
        'overflow: hidden;'+
        'transition: 0.8s ease-in-out;'+
        'opacity: 0;'+
        '}'+
        'div.Jshow {'+
        'opacity: 1;'+
        'max-height: 1000px;'+
        'width: auto;'+
        '}'+
        'div.JAccordionIconShow {'+
        'opacity: 1;'+
        'max-height: 30px;'+
        'width: auto;'+
        '}'+
        '.JProfileViewAccordion{'+
        'width: 0;'+
        'float: right;'+
        'max-height: 0;'+
        'overflow: hidden;'+
        'opacity: 0;'+
        'padding-right: 7px;'+
        '}'+
        '.JAccordionIcon{'+
        'padding: 6px 5px 6px 25px;'+
        'cursor: pointer;'+
        '}'+
        '</style>';

    var script = '<script>$(".JAccordionIcon").click(function() {'+
        '$(".Jpanel").toggleClass("Jshow");'+
        '$(".JProfileViewAccordion").toggleClass("JshJAccordionIconShowow");'+
        '$(".JProfileViewAccordion").toggleClass("JAccordionIconShow");'+
        '});</script>';

    var show = data.profileview.show;

    var html = '<div class="Jaccordion profile-wrapper medals-wrapper m-top10">'+
        '<div class="menu-header">'+title+
        '<div class="JProfileViewAccordion '+(show ? '' : 'JAccordionIconShow')+'"><i class="fa fa-plus-square JAccordionIcon" aria-hidden="true" /></div>'+
        '<div class="JProfileViewAccordion '+(show ? 'JAccordionIconShow' : '')+'"><i class="fa fa-minus-square JAccordionIcon" aria-hidden="true" /></div>'+
        '</div>'+
        '<div class="Jpanel '+(show ? 'Jshow' : '')+'">'+
        block+
        '</div>'+
        '</div>';

    $(document).on('click','.JAccordionIcon', function(){
        data.profileview.show = !data.profileview.show;
        save();
    });

    return css+script+html;
}

function profileViewSelectionPopUp(){
    var possibilities = possibleStats();
    var settings = allSettings();

    var popupHtml = '<div>';
    var categories = {};
    for(var p in possibilities){
        var o = possibilities[p];
        var checked = inArray(p, data.profileview.display) ? 'checked' : '';

        if(o.category){
            if(!categories[o.category]) categories[o.category] = {display: o.category, html: ''};
        }else{
            if(!categories.others) categories.others = {display: 'Others', html: ''};
        }

        var cat = o.category ? o.category : 'others';

        var html = '<div style="';
        // TODO: Extract this css into a css rule
        html += 'border-radius: 2px; border: 1px solid gray; background-color: lightgray; margin: 3px;';
        html += 'padding: 3px 10px 3px 5px; display: inline-block; cursor: pointer;';
        html += '">';
        html += '<input type="checkbox" name="view'+p+'" id="view'+p+'" '+checked+'>';
        html += '<label id="JC'+p+'" for="view'+p+'">'+o.display+'</label>';
        html += '</div>';
        categories[cat].html += html;
    }

    popupHtml += '<fieldset style="border:1px solid black; padding: 10px; margin: 10px 0;">';
    popupHtml += '<legend><b>Settings</b></legend>';
    for(var setting in settings){
        if(!settings.hasOwnProperty(setting)) continue;
        popupHtml += '<label for="setting'+setting+'">'+settings[setting].display+'</label>: ';
        switch(settings[setting].type){
            case 'checkbox':
                popupHtml += '<input type="'+settings[setting].type+'" name="setting'+setting+'" id="setting'+setting+'" '+(data.settings && data.settings.versusMine ? 'checked' : '')+'>';
                break;
            default:
                // TODO: Implement text!!!!
        }
        popupHtml += '<br>';
    }
    popupHtml += '</fieldset>';

    for(var category in categories){
        if (categories.hasOwnProperty(category)) {
            popupHtml += '<fieldset style="border:1px solid black; padding: 10px; margin: 10px 0;">';
            popupHtml += '<legend onclick=\'document.getElementById("JC'+category+'").style.display = document.getElementById("JC'+category+'").style.display == "none" ? "block" : "none";\'';
            popupHtml += '><b>'+categories[category].display+'</b></legend>';
            popupHtml += categories[category].html;
            popupHtml += '</fieldset>';
        }
    }

    popupHtml += '</div>';
    var popup = popupWindow(
        {
            element: '#editProfileView',
            title: 'Edit Profile view',
            width: 640
        },
        popupHtml,
        [
            {
                'display': 'Close',
                'close': true
            },
            {
                'display': 'Save',
                'callback': function(){
                    var selected = [];
                    for(var p in possibleStats()){
                        var checked = $("#view"+p).is(':checked');
                        if(checked) selected.push(p);
                    }
                    var settings = {};
                    var all = allSettings();
                    for(var setting in all){
                        switch(all[setting].type){
                            case 'checkbox':
                                settings[setting] = $('#setting'+setting).is(':checked');
                                break;
                            default:
                                settings[setting] = $('#setting'+setting).val();
                        }
                    }

                    data.profileview.display = selected;
                    data.settings = settings;
                    save();
                    location.reload();
                }
            }
        ]
    );

    var button = '<div style="float:right;right:0;position:absolute;">' +
        '<button id="editProfileView" style="';
    button += 'background-color: #282828;';
    button += 'border: none;';
    button += 'border-radius: 5px;';
    button += 'color: white;';
    button += 'padding: 5px 5px 5px 7px;';
    button += 'text-align: center;';
    button += 'text-decoration: none;';
    button += 'display: inline-block;';
    button += 'font-size: 16px;';
    button += 'margin: 4px 2px;';
    button += 'cursor: pointer;';
    button += '"><i class="fa fa-pencil-square-o" aria-hidden="true" /></button></div>';

    return button+popup;
}

/**
* Example usage:
* popupWindow(
* { 'element': '#myDialogButton', 'title': 'Hello World' },
* '<h3>Something</h3><input type="text" id="myfield" />',
* [{'display': 'Save',
* 'close': false, // default: true
* callback: function(){var something = $("#myfield").val();}
* }]);
*/
function popupWindow(e, content, buttons){
    var script = '<script>$("'+e.element+'").click(function(){$("#dialog-message").dialog({'+
        'modal: true,'+
        'draggable: true,'+
        'create: function(){$(this).css("maxHeight", $(window).height()-240);},'+
        'resizable: true,'+
        'position: [\'center\'],'+
        'show: \'blind\','+
        'hide: \'blind\','+
        'width: '+(e.width ? e.width : 400)+','+
        'buttons: [';
    var test = '';
    for(var i = 0; i < buttons.length; i++){
        script += '{';
        script += 'text: \''+buttons[i].display+'\',';
        script += 'id: \'dialogButton'+i+'\'';
        script += '},';

        // this only supports up to 10 buttons.
        $(document).on('click','#dialogButton'+i, function(){
            var pressed = this.id.substr(this.id.length -1);
            if(buttons[pressed].callback)
                buttons[pressed].callback();

            if(buttons[pressed].close)
                $("a.ui-dialog-titlebar-close")[0].click();
        });
    }
    script = script.slice(0, -1);

    script += ']}';
    script += ');});'+test;

    script += '</script>';

    var html = '<div id="dialog-message" title="'+e.title+'" style="display: none; max-height: 80%;">';
    html += content;
    html += '</div>';
    return script+html;
}

function inArray(c, a){
    // Somehow $.inArray is not working? ?
    for(var i = 0; i < a.length; i++){
        if(c == a[i]) return true;
    }
    return false;
}

function getUserValue(userid, property){
    var user = data[userid];
    if(user){
        if($.isArray(property)){
            for(var i = 0; i < property.length; i++){
                user = user[property[i]];
            }
            return user;
        }else{
            var userData = user[property];
            if(userData){
                return userData;
            }
        }
    }
    return -1;
}

function setUserValue(userid, property, value){
    if(data[userid] === undefined) data[userid] = {};
    data[userid][property] = value;
}

function save(){
    localStorage.setItem('jebster.torn', JSON.stringify(data));
}

function saveOwnData(){
    if(!('me' in data) || !('id' in data.me) || data.me.id < 1){
        var url = 'https://api.torn.com/user/'+data.me.id+'?selections=basic&key='+data.apikey;
        apiCall(url, function(d) {
            id = d.player_id;
            data.me = {'id': id};
            save();
        });
    }
}

function loadData(){
    data = localStorage.getItem('jebster.torn');
    if(data === undefined || data === null){
        // Default settings
        data = {
            profileview:{
                show: true,
                display: ['xantaken','logins','refills','useractivity']
            }
        };
    }else{
        data = JSON.parse(data);
    }

    if(data.apikey === undefined || data.apikey === ''){
        getApiKey();
    }
}

var asked = false;
function getApiKey(){
    if(asked) return; asked = true;


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
    block += '<div class="menu-header">Torn Helper</div>';
    block += '<div class="profile-container"><div class="profile-container-description">';
    block += 'In order to use this script you need to enter your Torn Api Key, which you can '+
        'get on your <a href="http://www.torn.com/preferences.php">preferences page</a> and under the \'API Key\' tab.<br />';
    block += input;
    block += button;
    block += '</div></div></div>';

    $(block).insertAfter('.content-title');

    $('#JApiKeyBtn').click(function(){
        var key = $("#JApiKeyInput").val();
        if(!('me' in data)) data.me = {};
        data.apikey = key;
        save();
        location.reload();
    });

}

function apiUserStats(userid, cb){
    var lastRequest = getUserValue(userid, 'lastRequest');
    var now = new Date();
    if(lastRequest === 0 || lastRequest < now.getTime() - (2*60*60*1000)){ // Every 2hours
        var selections = 'personalstats,basic,crimes';
        var url = 'https://api.torn.com/user/'+userid+'?selections='+selections+'&key='+data.apikey;
        apiCall(url, function(data) {
            if(data.error) getApiKey();
            else{
                setUserValue(userid, 'stats', data.personalstats);
                setUserValue(userid, 'lastRequest', now.getTime());
                setUserValue(userid, 'username', data.name);
                setUserValue(userid, 'gender', data.gender);
                setUserValue(userid, 'crimes', data.criminalrecord);
                save();
                cb(data);
            }
        });
    }else{
        cb(data[userid].stats);
    }
}

function compareTemplate(user1Id, user2Id){
    var versusMe = data.settings && data.settings.versusMine;

    var css = '<style>'+
        '.tornHelper{' +
        'min-width:200px;' +
        '}' +
        '</style>';

    var html = css+'<div class="profile-container basic-info"><ul class="basic-list">';
    html += '<li>';
    html += '<div class="user-information-section left"><span class="bold"></span></div>';
    html += '<div class="'+(versusMe ? 'user-information-section left' : '')+' tornHelper"><span class="bold">'+getUserValue(user1Id, 'username')+'</span></div>';
    html += versusMe ? '<div class="tornHelper"><span class="bold">'+getUserValue(user2Id, 'username')+' (You)</span></div>' : '';
    html += '</li>';

    var stats = possibleStats();
    for(var i = 0; i < data.profileview.display.length; i++){
        var display = stats[data.profileview.display[i]];
        if(stats[data.profileview.display[i]]){
            var user1Value = 0, user2Value = 0;
            if(display.apiname){
                user1Value = getUserValue(user1Id, display.apiname);
                user2Value = getUserValue(user2Id, display.apiname);
            }else if(display.total){
                for(var j = 0; j < display.total.length; j++){
                    user1Value += getUserValue(user1Id, display.total[j]);
                    user2Value += getUserValue(user2Id, display.total[j]);
                }
            }else if(display.custom){
                user1Value = display.custom(user1Id);
                user2Value = display.custom(user2Id);
            }
            user1Value = user1Value ? user1Value : 0;
            user2Value = user2Value ? user2Value : 0;

            if(display.format){
                user1Value = display.format(user1Value);
                user2Value = display.format(user2Value);
            }else{
                user1Value = formatNumber(user1Value);
                user2Value = formatNumber(user2Value);
            }

            html += '<li>';
            html += '<div class="user-information-section left"><span class="bold">';
            html += display.display;
            if(display.tooltip){
                html += ' <i class="fa fa-question-circle" aria-hidden="true" title="'+display.tooltip+'" style="cursor: pointer;" />';
            }
            html += '</span></div>';
            html += '<div class="'+(versusMe ? 'user-information-section left' : '')+' tornHelper">';
            html += user1Value +'</div>';
            html += versusMe ? '<div class="tornHelper">'+user2Value+'</div>' : '';
            html += '</li>';
        }
    }
    html += '</ul><hr />';

    var f = function(type, id){
        var attacks = {hosp: {display: 'Hosped', times: 0, other: 0}, mug: {display: 'Mugged', times: 0},
                       left: {display: 'Left', times: 0}, lost: {display: 'Lost', times: 0}};
        if(type in data[id]){
            for(var p in data[id][type]){
                var attack = data[id][type][p];
                switch(attack.result){
                    case 'Mug':
                        attacks.mug.times++;
                        break;
                    case 'Hospitalize':
                        attacks.hosp.times++;
                        break;
                    case 'Leave':
                        attacks.left.times++;
                        break;
                    case 'Lose':
                        attacks.lost.times++;
                        break;
                }
            }
        }
        return attacks;
    };
    var attacks = f('attacks', user1Id);
    var defends = f('defends', user1Id);

    var ahtml = '<ul class="basic-list">';
    var lis = '';
    var anyAttacks = false;
    for(var type in attacks){
        if(attacks[type].times > 0 || (defends[type].times > 0 && versusMe)){
            lis += '<li>';
            lis += '<div class="user-information-section left width112"><span class="bold">'+attacks[type].display+'</span></div>';
            lis += versusMe ? '<div class="user-information-section left tornHelper">'+defends[type].times+'</div>' : '';
            lis += '<div class="tornHelper">'+attacks[type].times+'</div>';
            lis += '</li>';
            anyAttacks = true;
        }
    }
    if(anyAttacks){
        var g = getUserValue(user1Id, 'gender');
        var gender = g == 'Male' ? 'him' : g == 'Female' ? 'her' : 'them';
        ahtml += '<li>';
        ahtml += '<div class="user-information-section left"><span class="bold">Attacks</span></div>';
        ahtml += versusMe ? '<div class="user-information-section left tornHelper"><span class="bold">Towards you</span></div>' : '';
        ahtml += '<div class="tornHelper"><span class="bold">'+(versusMe ? 'Towards '+gender : 'You made') +'</span></div>';
        ahtml += '</li>';
    }
    ahtml += lis;
    ahtml += '</ul></div>';

    html += !anyAttacks ? 'You haven\'t attacked '+getUserValue(user1Id, 'username')+' before.' : '';
    html += ahtml;
    return html;
}

function possibleStats(){
    return {
        attackswon:{apiname:['stats','attackswon'], display: 'Attacks won', category: 'Attacking'},
        attackslost:{apiname:['stats','attackslost'], display: 'Attacks lost', category: 'Attacking'},
        attacksdraw:{apiname:['stats','attacksdraw'], display: 'Attacks Draw', category: 'Attacking'},
        attacksassisted:{apiname:['stats','attacksassisted'], display: 'Attacks assisted', category: 'Attacking'},
        totalattacks:{total:[['stats','attackswon'],['stats','attackslost'],['stats','attacksdraw'],['stats','attacksassisted'],['stats','yourunaway']], display: 'Total attacks', category: 'Attacking', format:formatNumber},
        defendswon:{apiname:['stats','defendswon'], display: 'Defends won', category: 'Attacking'},
        defendslost:{apiname:['stats','defendslost'], display: 'Defends lost', category: 'Attacking'},
        defendsstalemated:{apiname:['stats','defendsstalemated'], display: 'Defends stalemated', category: 'Attacking'},
        yourunaway:{apiname:['stats','yourunaway'], display: 'Run Aways', category: 'Attacking'},
        theyrunaway:{apiname:['stats','theyrunaway'], display: 'Other Ran Away', category: 'Attacking'},
        bestkillstreak:{apiname:['stats','bestkillstreak'], display: 'Best Kill Streak', category: 'Attacking'},
        attackcriticalhits:{apiname:['stats','attackcriticalhits'], display: 'Attack Critical Hits', category: 'Attacking'},
        attackhits:{apiname:['stats','attackhits'], display: 'Attack Hits', category: 'Attacking'},
        attackmisses:{apiname:['stats','attackmisses'], display: 'Attack Misses', category: 'Attacking'},
        roundsfired:{apiname:['stats','roundsfired'], display: 'Rounds Fired', category: 'Attacking'},
        attacksstealthed:{apiname:['stats','attacksstealthed'], display: 'Attacks Stealthed', category: 'Attacking'},
        moneymugged:{apiname:['stats','moneymugged'], display: 'Money Mugged', category: 'Attacking', format: formatMoney},
        largestmug:{apiname:['stats','largestmug'], display: 'Largest Mug', category: 'Attacking', format: formatMoney},
        highestbeaten:{apiname:['stats','highestbeaten'], display: 'Highest Level Beaten', category: 'Attacking'},
        respectforfaction:{apiname:['stats','respectforfaction'], display: 'Respect For Faction', category: 'Attacking'},

        itemsbought:{apiname:['stats','itemsbought'], display: 'Items Bought', category: 'Trading'},
        auctionswon:{apiname:['stats','auctionswon'], display: 'Auctions Won', category: 'Trading'},
        auctionsells:{apiname:['stats','auctionsells'], display: 'Auction Sells', category: 'Trading'},
        itemssent:{apiname:['stats','itemssent'], display: 'Items Sent', category: 'Trading'},
        trades:{apiname:['stats','trades'], display: 'Trades', category: 'Trading'},
        weaponsbought:{apiname:['stats','weaponsbought'], display: 'Weapons Bought', category: 'Trading'},
        pointssold:{apiname:['stats','pointssold'], display: 'Points Sold', category: 'Trading'},
        pointsbought:{apiname:['stats','pointsbought'], display: 'Points Bought', category: 'Trading'},
        bazaarcustomers:{apiname:['stats','bazaarcustomers'], display: 'Bazaar Customers', category: 'Trading'},
        bazaarsales:{apiname:['stats','bazaarsales'], display: 'Bazaar Sales', category: 'Trading'},
        bazaarprofit:{apiname:['stats','bazaarprofit'], display: 'Bazaar Profit', category: 'Trading', format: formatMoney},
        jailed:{apiname:['stats','jailed'], display: 'Jailed', category: 'Jail'},
        peoplebusted:{apiname:['stats','peoplebusted'], display: 'People Busted', category: 'Jail'},
        failedbusts:{apiname:['stats','failedbusts'], display: 'Failed Busts', category: 'Jail'},
        peoplebought:{apiname:['stats','peoplebought'], display: 'People Bought out of Jail', category: 'Jail'},
        peopleboughtspent:{apiname:['stats','peopleboughtspent'], display: 'Money Spent on buying people out of jail', category: 'Jail', format: formatMoney}, // TODO: Some shorter display text
        hospital:{apiname:['stats','hospital'], display: 'Hospital', category: 'Hospital'}, // TODO:
        medicalitemsused:{apiname:['stats','medicalitemsused'], display: 'Medical Items Used', category: 'Hospital'},
        bloodwithdrawn:{apiname:['stats','bloodwithdrawn'], display: 'Blood Withdrawn', category: 'Hospital'},
        revives:{apiname:['stats','revives'], display: 'Revives', category: 'Hospital'},
        revivesreceived:{apiname:['stats','revivesreceived'], display: 'Revives Received', category: 'Hospital'},
        medstolen:{apiname:['stats','medstolen'], display: 'Medical Items Stolen', category: 'Hospital'},
        heahits:{apiname:['stats','heahits'], display: 'Heavy artillery', category: 'Finishing Hits'},
        machits:{apiname:['stats','machits'], display: 'Machine guns', category: 'Finishing Hits'},
        rifhits:{apiname:['stats','rifhits'], display: 'Rifles', category: 'Finishing Hits'},
        smghits:{apiname:['stats','smghits'], display: 'Sub machine guns', category: 'Finishing Hits'},
        shohits:{apiname:['stats','shohits'], display: 'Shotguns', category: 'Finishing Hits'},
        pishits:{apiname:['stats','pishits'], display: 'Pistols', category: 'Finishing Hits'},
        grehits:{apiname:['stats','grehits'], display: 'Temporary weapons', category: 'Finishing Hits'},
        piehits:{apiname:['stats','piehits'], display: 'Piercing weapons', category: 'Finishing Hits'},
        slahits:{apiname:['stats','slahits'], display: 'Slashing weapons', category: 'Finishing Hits'},
        axehits:{apiname:['stats','axehits'], display: 'Clubbed weapons', category: 'Finishing Hits'},
        chahits:{apiname:['stats','chahits'], display: 'Mechanical weapons', category: 'Finishing Hits'},
        mailssent:{apiname:['stats','mailssent'], display: 'Mail Sent', category: 'Communication'},
        friendmailssent:{apiname:['stats','friendmailssent'], display: 'Friend Mail Sent', category: 'Communication'},
        factionmailssent:{apiname:['stats','factionmailssent'], display: 'Faction Mail Sent', category: 'Communication'},
        companymailssent:{apiname:['stats','companymailssent'], display: 'Company Mail Sent', category: 'Communication'},
        spousemailssent:{apiname:['stats','spousemailssent'], display: 'Spouse Mail Sent', category: 'Communication'},
        classifiedadsplaced:{apiname:['stats','classifiedadsplaced'], display: 'Classified Newspaper Ads Placed', category: 'Communication'},
        personalsplaced:{apiname:['stats','personalsplaced'], display: 'Personal Placed', category: 'Communication'},
        bountiesplaced:{apiname:['stats','bountiesplaced'], display: 'Bounties Placed', category: 'Bounties'},
        totalbountyspent:{apiname:['stats','totalbountyspent'], display: 'Total Bounty Money Spent', category: 'Bounties', format: formatMoney},
        bountiescollected:{apiname:['stats','bountiescollected'], display: 'Bounties Collected', category: 'Bounties'},
        totalbountyreward:{apiname:['stats','totalbountyreward'], display: 'Total Bounty Money Gained', category: 'Bounties', format: formatMoney},
        bountiesreceived:{apiname:['stats','bountiesreceived'], display: 'Bounties Received', category: 'Bounties'},
        cityfinds:{apiname:['stats','cityfinds'], display: 'City Finds', category: 'Items'},
        itemsdumped:{apiname:['stats','itemsdumped'], display: 'Items Dumped', category: 'Items'},
        dumpsearches:{apiname:['stats','dumpsearches'], display: 'Dump Searches', category: 'Items'},
        dumpfinds:{apiname:['stats','dumpfinds'], display: 'Dump Finds', category: 'Items'},
        traveltimes:{apiname:['stats','traveltimes'], display: 'Travel Times', category: 'Travel'},
        itemsboughtabroad:{apiname:['stats','itemsboughtabroad'], display: 'Items Bought Abroad', category: 'Travel'},
        argtravel:{apiname:['stats','argtravel'], display: 'Argentina Traveled', category: 'Travel'},
        mextravel:{apiname:['stats','mextravel'], display: 'Mexico Traveled', category: 'Travel'},
        dubtravel:{apiname:['stats','dubtravel'], display: 'Dubai Traveled', category: 'Travel'},
        hawtravel:{apiname:['stats','hawtravel'], display: 'Hawaii Traveled', category: 'Travel'},
        japtravel:{apiname:['stats','japtravel'], display: 'Japan Traveled', category: 'Travel'},
        lontravel:{apiname:['stats','lontravel'], display: 'London Traveled', category: 'Travel'},
        soutravel:{apiname:['stats','soutravel'], display: 'South Africa Traveled', category: 'Travel'},
        switravel:{apiname:['stats','switravel'], display: 'Switzerland Traveled', category: 'Travel'},
        chitravel:{apiname:['stats','chitravel'], display: 'China Traveled', category: 'Travel'},
        cantravel:{apiname:['stats','cantravel'], display: 'Canada Traveled', category: 'Travel'},
        caytravel:{apiname:['stats','caytravel'], display: 'Cayman Islands Traveled', category: 'Travel'},
        drugsused:{apiname:['stats','drugsused'], display: 'Drug Used', category: 'Drugs'},
        overdosed:{apiname:['stats','overdosed'], display: 'Drug Overses', category: 'Drugs'},
        cantaken:{apiname:['stats','cantaken'], display: 'Canabis Taken', category: 'Drugs'},
        exttaken:{apiname:['stats','exttaken'], display: 'Ecstasy Taken', category: 'Drugs'},
        kettaken:{apiname:['stats','kettaken'], display: 'Ketamine Taken', category: 'Drugs'},
        lsdtaken:{apiname:['stats','lsdtaken'], display: 'LSD Taken', category: 'Drugs'},
        opitaken:{apiname:['stats','opitaken'], display: 'Opium Taken', category: 'Drugs'},
        shrtaken:{apiname:['stats','shrtaken'], display: 'Shrooms Taken', category: 'Drugs'},
        spetaken:{apiname:['stats','spetaken'], display: 'Speed Taken', category: 'Drugs'},
        pcptaken:{apiname:['stats','pcptaken'], display: 'PCP Taken', category: 'Drugs'},
        xantaken:{apiname:['stats','xantaken'], display: 'Xanax Taken', category: 'Drugs'},
        victaken:{apiname:['stats','victaken'], display: 'Vicodin Taken', category: 'Drugs'},
        networth:{apiname:['stats','networth'], display: 'Networth', format: formatMoney},
        logins:{apiname:['stats','logins'], display: 'Logins'},
        useractivity:{apiname:['stats','useractivity'], display: 'Time Played', format: formatSeconds},
        meritsbought:{apiname:['stats','meritsbought'], display: 'Merits Bought'},
        refills:{apiname:['stats','refills'], display: 'Refills'},
        trainsreceived:{apiname:['stats','trainsreceived'], display: 'Trains Received'},
        spydone:{apiname:['stats','spydone'], display: 'Spies Done'},
        statenhancersused:{apiname:['stats','statenhancersused'], display: 'Stat Enhancers Used'},
        virusescoded:{apiname:['stats','virusescoded'], display: 'Viruses Coded'},
        daysbeendonator:{apiname:['stats','daysbeendonator'], display: 'Days Been Donator'},
        missionscompleted:{apiname:['stats','missionscompleted'], display: 'Missions Completed', category: 'Missions'},
        contractscompleted:{apiname:['stats','contractscompleted'], display: 'Contracts Completed', category: 'Missions'},
        dukecontractscompleted:{apiname:['stats','dukecontractscompleted'], display: 'Duke Contracts Completed', category: 'Missions'},
        missioncreditsearned:{apiname:['stats','missioncreditsearned'], display: 'Mission Credits Earned', category: 'Missions'},
        sellingillegalproducts:{apiname:['crimes','selling_illegal_products'], display: 'Illegal Products Sold', category: 'Crimes'},
        theft:{apiname:['crimes','theft'], display: 'Theft', category: 'Crimes'},
        auto_theft:{apiname:['crimes','auto_theft'], display: 'Auto Theft', category: 'Crimes'},
        drug_deals:{apiname:['crimes','drug_deals'], display: 'Drug Deals', category: 'Crimes'},
        computer_crimes:{apiname:['crimes','computer_crimes'], display: 'Computer Crimes', category: 'Crimes'},
        murder:{apiname:['crimes','murder'], display: 'Murder', category: 'Crimes'},
        fraud_crimes:{apiname:['crimes','fraud_crimes'], display: 'Fraud Crimes', category: 'Crimes'},
        other:{apiname:['crimes','other'], display: 'Other Crimes', category: 'Crimes'},
        total:{apiname:['crimes','total'], display: 'Total Crimes', category: 'Crimes'},
        awards:{display: 'Awards', custom: function(id){return getAwards(id);}, tooltip: 'Your award count only updates when you visit your own profile.'},
        point:{display:'Point', custom: function(id){
            var x = getUserValue(id, ['stats', 'attackswon'])+getUserValue(id,['stats','attackslost']);
            x += getUserValue(id,['stats','attacksdraw'])+getUserValue(id,['stats','yourunaway']);
            var y = getUserValue(id, ['stats','xantaken']);
            return (y*250) - (x*25);
        }, category: 'Requests'},
    };
}

function allSettings(){
    return {
        versusMine: {display: 'Show my stats', type:'checkbox'}
    };
}

function apiCall(url, cb){
    console.log('Torn helper: making request \''+url+'\'');
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            cb(data);
        }
    });
}

function getAwards(id){
    var element = $(".profile-container.basic-info.bottom-round ul:nth-child(2) li:nth-child(8)");
    var content = element.first().contents().filter(function(){
        return this.nodeType == 3;
    });
    var value = parseInt(content.text().trim());

    if(!id){
        if(data.me.awards)
            return data.me.awards;
        return -1;
    }
    if(id == data.me.id){
        data.me.awards = value;
        save();
    }
    return value;
}

function removeFirstAndLastLine(text){
    var lines = text.split('\n');
    lines.splice(0,1);
    lines.splice(-1,1);
    var newtext = lines.join('\n');
}

function formatSeconds(s){
    var minutes = Math.floor(s/60)%60;
    var hours = Math.floor(s/(60*60))%24;
    var days = Math.floor(s/(60*60*24));
    var seconds = s%60;

    return '{0}d {1}h {2}m {3}s'.format(days, hours, minutes, seconds);
}

function formatNumber(n){
    return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function formatMoney(m){
    return '$'+formatNumber(m);
}

// Taken from: http://stackoverflow.com/a/15724300/1832471
function getCookieValue(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Taken from: http://stackoverflow.com/a/901144/1832471
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

