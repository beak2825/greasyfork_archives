// ==UserScript==
// @name         War Timer
// @namespace    zero.wartime.torn
// @version      0.2
// @description  War Timer updated
// @author       -zero [2669774]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463008/War%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/463008/War%20Timer.meta.js
// ==/UserScript==

var api = '';
var time = 10;




// DO NOT CHANGE ANYTHING BELOW THIS
var faction_id;
var fac_url;
var url = window.location.href;
var tem = url.split('&ID=')[1];
var timers = {}
var members = [];

function addremove(id){


    if (members.includes(id)){
        members.pop(id);
        console.log(members);
        return;
    }
    members.push(id);
    console.log(members);
}


function attack(id){
    console.log('Attacking '+ id);
    var attack_url = 'https://www.torn.com/loader.php?sid=attack&user2ID='+id;
    window.open(attack_url);
    delete timers[id];
    console.log('Removed from members '+ id);
}

function anal(data){
    console.log(timers.length);
    console.log(members);
    for (var mem_id in data.members){
       // console.log(mem_id);
        if (members.includes(mem_id)){
            console.log('Found '+mem_id);
            if (data.members[mem_id].status.state == 'Hospital'){
                console.log('Found hosped '+mem_id);
                var time_left = data.members[mem_id].status.until;
                var curTime = parseInt(Date.now()/1000);
                var dif = time_left - curTime - time;
                if (Object.keys(timers).includes(mem_id)){
                    console.log('Removed '+ mem_id);
                    clearTimeout(timers[mem_id]);
                }
                console.log('Added '+ mem_id);
                timers[mem_id] = setTimeout(attack, dif*1000, mem_id);

                console.log('Updated '+mem_id);
            }
            else{
                if (Object.keys(timers).includes(mem_id)){
                    clearTimeout(timers[mem_id]);
                }
            }
        }
    }


}
function test(v){
    console.log(v);
}

function insert(){
    if ($('.table-cell.member:not(:first-child)').length > 0){
        $('.table-cell.member:not(:first-child)').each(function(){
            var el = $(this);
            var id = $("[id$='-user']", el).attr('id').split('_')[0];
            var check = `<input type="checkbox" id="`+id+`-zero">`;
            el.append(check);
            $('#'+id+'-zero').on('click', function(){
                addremove(id);
            });
        });

        var st = `<button id='zero-start'>Start</button>`;
        $('.content-title > h4').append(st);
        $('#zero-start').on('click', start);
    }
    else{
        setTimeout(insert, 3000);
    }
}

function monitor(){
    fac_url = 'https://api.torn.com/faction/'+faction_id+'?selections=&key='+api;
    fetch(fac_url)
        .then((response) => response.json())
        .then((data) => anal( data));
}

function start(){
    console.log('Started..');
    monitor();
    setInterval(monitor, 30000);
    
}

(function() {
    var tid = '';
    for (var i in tem){

       // console.log(tem[i]);
        if ('1234567890'.includes(tem[i])){
            tid = tid+''+ tem[i];
            //console.log(tid);
        }
        else{
            break;
        }
    }
    faction_id = tid;
    alert('Tracking faction: '+faction_id);
    insert();
})();
