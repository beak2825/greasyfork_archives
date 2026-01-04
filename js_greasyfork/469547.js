// ==UserScript==
// @name        Territory War Estimator
// @namespace   mafia.terrwar
// @author      Mafia[610357]
// @description Estimate Territory war duration
// @match       https://www.torn.com/factions.php*
// @version     1.2.1
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/ismobilejs/0.4.1/isMobile.js
// @require     https://greasyfork.org/scripts/469546/code/functions.js
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/469547/Territory%20War%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/469547/Territory%20War%20Estimator.meta.js
// ==/UserScript==

'use strict';
var etamaintime = [];
var btn = 0;
console.log(isMobile,isMobile.phone);
if(isMobile.phone) {
    GM_addStyle(' .t-eta.text{ text-align: center; }');
}
else {
    GM_addStyle('.t-eta.text{ width: 400px; text-align: left; margin-left: 275px; }');
}

GM_addStyle('.t-eta span{ color: #19a0bb; } #safePoints { width: 6px; background: none; text-align: right; font-weight: 700; color: #33af8d;} .etamain > span { font-size: 11px; color: #ea66c7; } .etamain { padding-top: 3px; } .fail { background-image: url(http://www.pngall.com/wp-content/uploads/2016/06/Fail-Stamp-PNG-Clipart.png); background-size: contain;background-repeat: no-repeat; background-position: right;}}');

$(document).ready(function(){
    $("head").append("<style id='etawallcss'></style>");
})

function t(resp, url) {
    step = getParameterByName('step', url);
    $(".faction-progress-wrap").animate({'padding-top':'0px'}, 2000);

    $(".faction-names").css('cursor','pointer').click(function() {
        $("#etawallcss").html( $("#etawallcss").is(':empty') ? '.members-list .your { display: none !important; }' : '' )
    })

    if(step == 'getwarusers')
    {
        warID = getParameterByName('warID', url);
        setTimeout(() => {
            //    $(".faction-war-info").append('<div class="text t-eta1">Loading...</div>')
            $(".faction-war-info").animate({height: '170px'}, 2000);
        }, 500);
    }

    if(step == 'getwardata')
    {
        warID = getParameterByName('wardescid', url);

        info = resp.wars.filter( (x,i) => {
            if(x.type == 'territory') {
                typeof etamaintime[i] == 'number' ? clearInterval(etamaintime[i]) : '';

                x.diffScore = x.maxPoints - x.score;

                x.actualAssault = x.isMyAttack ? x.myFaction.membersQuantity - x.enemyFaction.membersQuantity : x.enemyFaction.membersQuantity - x.myFaction.membersQuantity;
                x.actualDuration = x.actualAssault > 0 ? moment.duration(Math.ceil(x.diffScore / x.actualAssault), 's') : "-";
                x.actualDurationText = x.actualDuration != '-' ? timeToText(x.actualDuration) : '-';

                x.defendDuration = x.actualAssault < 0 ? moment.duration(Math.ceil(x.score / -x.actualAssault), 's') : "-";
                x.defendDurationText = x.defendDuration != '-' ? timeToText(x.defendDuration) : '-';

                var fastestDefendDuration = moment.duration(Math.ceil(x.score / x.slots), 's');
                x.fastestDefendDurationText = timeToText(fastestDefendDuration);

                x.fastestDuration = moment.duration(Math.ceil(x.diffScore / x.slots), 's');
                x.fastestDurationText = timeToText(x.fastestDuration);

                x.actualFinishTimestamp = moment.utc().add(Math.ceil(x.diffScore / x.actualAssault), 's');
                x.actualFinish = x.actualDuration != '-' && (x.actualFinishTimestamp.valueOf() < x.endDate) ? x.actualFinishTimestamp.format('DD/MM/YYYY HH:mm:ss') : moment(x.endDate).format('DD/MM/YYYY  HH:mm:ss');

                safeZone = moment.duration(Math.ceil(x.maxPoints / x.slots), 's');
                safeZone = timeToText(safeZone);

                x.endDate < (moment.utc().valueOf() + x.fastestDuration.valueOf()) ? $(".f-war-list.war-new > li:eq("+i+") .status-wrap").addClass('fail') : '';

                if(!$(".f-war-list.war-new > li:eq("+i+") .etamain").length) {
                    $(".f-war-list.war-new > li:eq("+i+") .faction-progress-wrap").append("<div class='etamain'><span class='current' title='Full Assault in <strong>"+x.fastestDurationText+"</strong>'>"+x.actualDurationText+"</span></div>");
                }
                else {
                    $(".f-war-list.war-new > li:eq("+i+") .faction-progress-wrap .current").text(x.actualDurationText).attr("title", "Full Assault in <strong>"+x.fastestDurationText+"</strong>");
                }

                etamaintime[i] = setInterval(() => {
                    actualDurationText = resp.wars[i].actualDuration != '-' ? timeToText(resp.wars[i].actualDuration.subtract(1, 's')) : '-';
                    $(".f-war-list.war-new > li:eq("+i+") .faction-progress-wrap .current").text(actualDurationText).attr("title", "Full Assault in <strong>"+resp.wars[i].fastestDurationText+"</strong>");
                }, 1000);

            }


            return x.key == warID;
        })[0];

        if(warID != 'chain' && warID != -1)
        {
            typeof thetime == 'number' ? clearInterval(thetime) : '';
            if(!$(".t-eta").length)
            {
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">Full Assault ('+info.slots+'/'+info.slots+') duration by current points : <span class="fastestDuration">'+info.fastestDurationText+'</span></div>')
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">Actual assault duration (<span id="wallsitter">'+(info.isMyAttack ? (info.myFaction.membersQuantity+' VS '+info.enemyFaction.membersQuantity) : (info.enemyFaction.membersQuantity+' VS '+info.myFaction.membersQuantity))+'</span>): <span class="actualDuration">'+info.actualDurationText+'</span></div>')
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">Full Defend duration to reset points : <span class="fastestDefendDuration">'+info.fastestDefendDurationText+'</span></div>')
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">Actual Defend duration to reset points : <span class="defendDuration">'+info.defendDurationText+'</span></div>')
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">Actual time war finish at <span class="actualFinish">'+info.actualFinish+'</span> TCT</div>')
                $(".faction-war-info").append('<div class="text t-eta" style="display: none;">SAFE ZONE : Stand <input type="text" id="safePoints" title="Progress points" value="0" /> / '+commaSeparateNumber(info.maxPoints)+' by <span id="safeZone">'+safeZone+'</span> time left</div>')
                $("#safePoints").keyup(function(){
                    $(this).val($(this).val().replace(/,/g,''));
                    $(this).animate({width: (5 + $(this).val().length * 7)+'px'}, 200);
                    safeZone = moment.duration(Math.ceil((info.maxPoints - $(this).val()) / info.slots), 's');
                    safeZone = timeToText(safeZone);
                    $("#safeZone").text(safeZone);
                    $(this).val(commaSeparateNumber($(this).val()));
                });
                $(".t-eta").fadeIn();
            }
            else {
                $(".fastestDuration").text(info.fastestDurationText);
                $(".actualDuration").text(info.actualDurationText);
                $(".fastestDefendDuration").text(info.fastestDefendDurationText);
                $(".defendDuration").text(info.defendDurationText);
                $(".actualFinish").text(info.actualFinish);
                $("#wallsitter").text( (info.isMyAttack ? (info.myFaction.membersQuantity+' VS '+info.enemyFaction.membersQuantity) : (info.enemyFaction.membersQuantity+' VS '+info.myFaction.membersQuantity)) );
            }
            thetime = setInterval(() => {
                // !info.score ? '' : actualAssault >= 0 ? fastestDuration.subtract(1, 's') : fastestDefendDuration.subtract(1, 's');
                info.actualDurationText = info.actualDuration != '-' ? timeToText(info.actualDuration) : '-';
                info.defendDurationText = info.actualDuration == '-' ? info.score ? timeToText(info.defendDuration.subtract(1, 's')) : timeToText(info.defendDuration) : '-';
                info.actualFinish = info.actualDuration != '-' && (info.actualFinishTimestamp.valueOf() < info.endDate) ? info.actualFinishTimestamp.format('DD/MM/YYYY  HH:mm:ss') : moment(info.endDate).format('DD/MM/YYYY  HH:mm:ss');

                $(".actualDuration").text(info.actualDurationText);
                $(".defendDuration").text(info.defendDurationText);
                $(".actualFinish").text(info.actualFinish);
                $("#wallsitter").text( (info.isMyAttack ? (info.myFaction.membersQuantity+' VS '+info.enemyFaction.membersQuantity) : (info.enemyFaction.membersQuantity+' VS '+info.myFaction.membersQuantity)) );
            }, 1000);
        }
    }
}

function timeToText(time) {
    return time.days() + 'd ' + time.hours() + 'h ' + time.minutes() + "m " + time.seconds() + 's';
}


fetching('faction_wars.php', t);