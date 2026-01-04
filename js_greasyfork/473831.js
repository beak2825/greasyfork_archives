// ==UserScript==
// @name         [Neopets] BD Autoplayer AJAX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cheese
// @author       You
// @match        https://www.neopets.com/dome/fight.phtml
// @match        https://www.neopets.com/dome/arena.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM.getValue
// @grant        GM.setValue
// @require      http://code.jquery.com/jquery-latest.min.js
// @run-at       document-start
// @license      only me
// @downloadURL https://update.greasyfork.org/scripts/473831/%5BNeopets%5D%20BD%20Autoplayer%20AJAX.user.js
// @updateURL https://update.greasyfork.org/scripts/473831/%5BNeopets%5D%20BD%20Autoplayer%20AJAX.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';
    const SF_URL = '/dome/ajax/startFight.php'; const ARE_URL = '/dome/ajax/arena.php';
    const PETNAME = 'gel_gelert_alot'; const OPPO = '210'; const DIFFC = '3';
    const EQ1 = ['Scroll of Knowledge'];
    const EQ2 = ['Scroll of Ultranova'];
    const ABI = ['21','2'];
    let B_ID = GM.getValue('np_bdabid', true).then( (np_bdabid) => { B_ID = np_bdabid; });
    var bd2w; var bd3w;

    if (window.location.href.includes('/fight.phtml')) {
        let bd2Worker = new Blob([bd2w = setTimeout(() => {
            startFight(true); }, Math.floor(2500 + Math.random() * 500))])};

    if (window.location.href.includes('/arena.phtml')) {
        let bd3Worker = new Blob([bd3w = setTimeout(() => {chkEq();}, 1500 + 500 * Math.random())])};

    let startFight = (sf = false) => {
        let data = {'pet':PETNAME,'npcId':OPPO,'toughness':DIFFC};
        if (sf == true) data.type = '2';
        parent.$.post(SF_URL, data, function (response) {
            //var jsonString = JSON.stringify(response); //var resp = JSON.parse(response);
            let resp = response; console.log(resp);
            if (resp.success == true) { B_ID = GM.setValue("np_bdabid", resp.battle.id); window.location = '/dome/arena.phtml'; } else { alert("Something done goofed with starting a fight."); GM.setValue("np_bdabid", "");}
        });
        console.log(`SF: ${B_ID}`);
    }

    //ensure no OOA for multi-turn (use last preset)
    let xydEqa = (turn, v) => { if (turn + 1 > v.length) { return v[v.length] } else { return v[turn]; } }

    // Check equips and ability.
    let chkEq = (turn = 0) => {
        $('#start').click();
        let eqa = {}; console.log(`chkeq ${B_ID}`);
        let data = {'battleid':B_ID,'step':'0','intro':'1','status':'1'}
        parent.$.post(ARE_URL, data, function (response) {
            let abr = response.p1.abils;
            abr = Object.keys(abr).includes(ABI[turn]) ? abr[ABI[turn]].hasCooldown == true ? false : abr : false; console.log(abr);
            let eqr = document.createRange().createContextualFragment(response.p1.items);
            let eqk = eqr.querySelectorAll('img');
            eqk.forEach((d) => { eqa[d.title] = d.id; });
            let chkAll = [eqa, abr];
            doFight(chkAll, turn);
        });
    }

    // theoretical edge case fallback status check function (probably pointless)
    let doUpd = () => {
        let data = {'battleid':B_ID,'step':'0','intro':'0','status':'1'}
        parent.$.post(ARE_URL, data, function (response) {
            if ('prize_messages' in response.battle && response.battle.prize_messages.includes('* You have reached the item limit for today!') == false) { setTimeout( () => { startFight(); }, 2000 + 800 * Math.random()); } else { console.log('cheese'); }
        }); }

    //build request and send.
    let doFight = (cka, turn = 0) => {
        let eq = cka[0]; let ts = new Date().getTime();
        let eq1 = xydEqa(turn,EQ1); let eq2 = xydEqa(turn,EQ2); let ab = xydEqa(turn,ABI);
        let fab = typeof(cka[1]) === 'object' ? ab : "";
        //console.log(eq1, eq2, ab); console.log(`doF ${eq} ${B_ID}`);
        let data = {'p1s':"",'eq1':eq[eq1],'eq2':eq[eq2],'p1a':fab,'chat':"",'action':"attack",'ts':ts,'battleid':B_ID,'step':"0",'intro':"0",'status':"1"};
        console.log(data); // better test this lol
        setTimeout( () => {
            parent.$.post(ARE_URL, data, function (response){
                let resp = response;
                if (response.p1.fight_step > turn && response.battle.winner == '0') {
                    //multi-turn here?
                    setTimeout( () => {chkEq(turn+1);}, 2500 * Math.random());
                } else if (response.battle.winner == '1') {
                    if ('prize_messages' in response.battle && response.battle.prize_messages.includes('* You have reached the item limit for today! You can continue to fight, but no more items can be earned.')) {
                        alert('donezo');
                    } else {
                        setTimeout( () => { doUpd() }, 1500 + 800 * Math.random() );
                    }
                } else if ( response.battle.winner == '2') { alert('you lost');
                } else { alert ('donezo or uncaught problem (lol)'); }
            });
        }, 6400 + ((400 * Math.random()) + (250 * Math.random())));
    }
})();