// ==UserScript==
// @name           Pardus QI Augmenter
// @namespace      qi-augmenter
// @author         Apparition
// @version        1.3.6
// @description    Large number of add-ons
//
//
// @include        http*://*.pardus.at/main.php*
// @include        http*://*.pardus.at/overview_stats.php
// @include        http*://*.pardus.at/ship2ship_transfer.php*
// @include        http*://*.pardus.at/sendmsg.php*
// @include        http*://*.pardus.at/news.php*
// @include        http*://*.pardus.at/options.php*
// @include        http*://*.pardus.at/alliances.php*
// @include        http*://*.pardus.at/alliance.php*
// @include        http*://*.pardus.at/building.php*
// @include        http*://*.pardus.at/statistics.php*
// @include        http*://*.pardus.at/msgframe.php*
// @include        http*://*.pardus.at/ship2opponent_combat.php*
// @include        http*://*.pardus.at/ambush.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/11016/Pardus%20QI%20Augmenter.user.js
// @updateURL https://update.greasyfork.org/scripts/11016/Pardus%20QI%20Augmenter.meta.js
// ==/UserScript==/////////

// This is a slight update by Math to version 1.3.2 of Apparition's lovely script.
// I (Math) am only responsible for fixing the display of building condition on the building screen.

(function () {

var timeStart = new Date().getMilliseconds();

var console = (typeof unsafeWindow.console === 'object')
  ? unsafeWindow.console
  : { log : function (a){} };

console.log('Pardus QI Augmenter loaded');

var UNIVERSE = location.host.split('.')[0] || 'orion';

var options = {
    useFriendFoeHighlighter : GM_getValue(UNIVERSE+'_useFriendFoeHighlighter',true),
    useNewsLinks            : GM_getValue(UNIVERSE+'_useNewsLinks',true),
    useS2SQuickFill         : GM_getValue(UNIVERSE+'_useS2SQuickFill',true),
    useMessageLink          : GM_getValue(UNIVERSE+'_useMessageLink',true),
    useTradeLink            : GM_getValue(UNIVERSE+'_useTradeLink',true),
    useBountyLink           : GM_getValue(UNIVERSE+'_useBountyLink',true),
    useTelerobLink          : GM_getValue(UNIVERSE+'_useTelerobLink',true),
    useTelerobLinkAlways    : GM_getValue(UNIVERSE+'_useTelerobLinkAlways',false),
    useMapLink              : GM_getValue(UNIVERSE+'_useMapLink',true),
    useNpcHP                : GM_getValue(UNIVERSE+'_useNpcHP',true),
    useNavKbBind            : GM_getValue(UNIVERSE+'_useNavKbBind',true),
    useHighlightTile        : GM_getValue(UNIVERSE+'_useHighlightTile', true),
    useNavGrid              : GM_getValue(UNIVERSE+'_useNavGrid',true),
    useUserLinks            : GM_getValue(UNIVERSE+'_useUserLinks',true),
    useClock                : GM_getValue(UNIVERSE+'_useClock',true),
    useInstantMO            : GM_getValue(UNIVERSE+'_useInstantMO', true),
    useOtherShipStats       : GM_getValue(UNIVERSE+'_useOtherShipStats', true),
    usePriorityTrade        : GM_getValue(UNIVERSE+'_usePriorityTrade', true),
    foeColor                : GM_getValue(UNIVERSE+'_foeColor','#480000'), // red
    friendColor             : GM_getValue(UNIVERSE+'_friendColor','#004800'),
    priorityTrade           : GM_getValue(UNIVERSE+'_priorityTrader', '').match(/(?=\S)[^,]+?(?=\s*(,|$))/g),
    transferS2Svalues       : {
        giveandgo : GM_getValue(UNIVERSE+'_transferGiveAndGo', 20),
        large     : GM_getValue(UNIVERSE+'_transferLarge', 30),
        small     : GM_getValue(UNIVERSE+'_transferSmall', 10),
        giveandgodrug : GM_getValue(UNIVERSE+'_transferGiveAndGoDrug', 10),
        largedrug     : GM_getValue(UNIVERSE+'_transferLargeDrug', 5),
        smalldrug     : GM_getValue(UNIVERSE+'_transferSmallDrug', 3)
    },
    keycode                 : {
        navscreen :  113,   // the F2 key
        giveandgodrug: 113, // the F3 key
        giveandgo : 115    // the F4 key
    }

};



/**
 * Friend Foe Highlighter.  highlights people based on a user provided QL
 *
 *
 */


if (options.useFriendFoeHighlighter)
{
    GM_addStyle([
        '.qi-foe { background-color: ' , options.foeColor, '}',
        '.qi-friend { background-color: ' , options.friendColor, '}'
    ].join(''));
}

var friendfoes = {
    p_friends : GM_getValue(UNIVERSE+'_ql_p_friend','').split(','),
    p_foes    : GM_getValue(UNIVERSE+'_ql_p_foe','').split(','),
    a_friends : GM_getValue(UNIVERSE+'_ql_a_friend','').split(','),
    a_foes    : GM_getValue(UNIVERSE+'_ql_a_foe','').split(','),
    f_friends : GM_getValue(UNIVERSE+'_ql_f_friend','').split(','),
    f_foes    : GM_getValue(UNIVERSE+'_ql_f_foe','').split(',')
};

GM_addStyle([
    '.qi-priorityList-building { position:fixed; top: 250px; right: 10px; }',
    '.qi-priorityList {width: 182px; text-align: left; padding: 0; margin:0 18px; margin-top: -1.5em; margin-bottom: 1em; background-color: #000}',
    '.qi-priorityList li {  list-style: none; clear: both; border-bottom: 1px solid #00001C; background-color: #333}',
    '.qi-piroirityList li:last-child { border-bottom: none; }',
    '.qi-priorityList li a { display:block; padding: 0.5em; color: #CCC; font-weight:bold; font-size: 13px;}',
    '.qi-priorityList li a:hover { background-color: #2C99EB; color: #000 }',
    '.qi-priorityList li.priority-heading { padding: 0.5em; text-align: center;font-size: 14px;background-color:#800000; color: #CCC }',
].join(''));

/**
 * The nav screen
 */
if (location.pathname.indexOf('main.php') >= 0)
{
    bindNavKb();

    if (options.useNavGrid)
    {
        GM_addStyle([
            '.qi-navgrid { border-collapse: collapse; }',
            '.qi-navgrid td { border: 1px dotted #333 }',
            '.qi-navgrid td.qi-mytile { border: 1px solid #0f0; }'
        ].join(''));
        var navtable = document.getElementById('navarea');
        navtable.className += 'qi-navgrid';
        if (options.useHighlightTile)
        {
            var middleH = Math.floor(unsafeWindow.navSizeHor / 2);
			var middleV = Math.floor(unsafeWindow.navSizeVer / 2);
            navtable.rows[middleV].cells[middleH].className += ' qi-mytile';
        }
    }

    // scan_details page should not be modified
    if (location.search.indexOf('scan_details') === -1)
    {
        var pilots = document.querySelectorAll('#otherships_content > table');
        var dest = document.createDocumentFragment(),
            priorityList = document.createDocumentFragment(),
            shipStatInfo = {
                'friend' : 0,
                'foe' : 0,
                'ships' : 0
            };

        for (var i = 0, len = pilots.length; i < len; i++)
        {
            var pilotInfo = getPilotInfo(pilots[i]);
            if (pilotInfo.pilotId !== null)
            {

                if (options.usePriorityTrade && options.priorityTrade &&
                    options.priorityTrade.indexOf(pilotInfo.pilotName) !== -1)
                {
                    // this pilot is a priority to be traded with.
                    var li = document.createElement('LI');
                    li.innerHTML = [
                        '<a href="ship2ship_transfer.php?playerid=' ,
                         pilotInfo.pilotId ,
                         '">' , pilotInfo.pilotName, '</a>'
                    ].join('');
                    priorityList.appendChild(li);

                }
                // handle stat increments
                shipStatInfo.ships += 1;
                shipStatInfo.friend += (pilotInfo.friendFoe == 'friend') ? 1 : 0;
                shipStatInfo.foe += (pilotInfo.friendFoe == 'foe') ? 1 : 0;


                var newRow = document.createDocumentFragment(),
                    shipRow = pilots[i].cloneNode(true);
                shipRow.style.width = '100%';
                newRow.appendChild(shipRow);
                newRow.firstChild.className += ' qi-' + pilotInfo.friendFoe;

                var defaultAction = newRow.firstChild.rows[0].cells[0].setAttribute(
                    'onclick',
                    'location.href=\'/ship2ship_transfer.php?playerid='+pilotInfo.pilotId+'\''
                );
                newRow.firstChild.rows[0].cells[0].setAttribute('title', 'Trade');
                var pilotLink = newRow.firstChild.rows[0].cells[1].querySelector('a');

                var msgLink = '',
                    tradeLink = '',
                    telerobLink = '';
                if (options.useMessageLink)
                {
                    msgLink = '<a href="javascript:sendmsg(\''+pilotInfo.pilotName+'\')"' +
                        ' style="font-size: 11px;color:#aaa;"/>Msg</a>';
                }

                if (options.useTradeLink)
                {
                    tradeLink = [' <a href="ship2ship_transfer.php?playerid=' ,
                        pilotInfo.pilotId ,'" style="font-size:11px;color:#2C99EB;"' ,
                        '>[ Trade ]</a> '].join('');
                }

                if ((options.useTelerobLink
                    && options.useFriendFoeHighlighter
                    && pilotInfo.friendFoe == 'foe')
                    || options.useTelerobLinkAlways
                )
                {
                    telerobLink = '<a href="main.php?steal=' + pilotInfo.pilotId +
                            '&scan_details=' + pilotInfo.pilotId +
                            '&scan_type=player"  ' +
                            'style="font-size: 11px;color:#ff0;"/>Steal</a>';
                }
                if (options.useMessageLink
                    || options.useTradeLink
                    || options.useTelerobLink
                    || options.useTelerobLinkAlways)
                {
                    pilotLink.parentNode.setAttribute(
                        'style',
                        'vertical-align: top;'
                    );
                    // remove the br
                    if (pilotLink.nextSibling.nodeName === 'BR')
                    {
                        pilotLink.parentNode.removeChild(pilotLink.nextSibling);
                    }
                    var div = document.createElement('div');
                    div.style = 'margin: 0.5em 0;';
                    div.innerHTML = msgLink + tradeLink + telerobLink;
                    pilotLink.parentNode.insertBefore(
                        div,
                        pilotLink.nextSibling
                    );
                }
                if (options.useNewsLinks)
                {
                    pilotLink.insertAdjacentHTML(
                        'beforebegin',
                        getPilotNewsLink(pilotInfo.pilotName)
                    );
                }
                dest.appendChild(newRow);
            }
            else
            {
                dest.appendChild( pilots[i].cloneNode(true));
            }
        } // end loop of other ships
        // time to swap in our new and improved stuff!
        var otherShips = document.getElementById('otherships_content');
        while (otherShips.firstChild)
        {
            otherShips.removeChild(otherShips.firstChild);
        }

        if (options.useOtherShipStats)
        {
            var statsDiv = document.createElement('DIV');
            GM_addStyle([
                '.qi-shipStats { padding-bottom: 0.5em; border-bottom: 1px solid #000; }',
                '.qi-shipStats span {padding: 0.5em 0; font-size:11px; text-align:center;display:inline-block; width: 33%; }',
                '.qi-shipStats strong { color: #fff; }'
            ].join(''))
            statsDiv.className = 'qi-shipStats';
            statsDiv.innerHTML = [
                '<span>Pilots <strong>', shipStatInfo.ships, '</strong></span>',
                '<span class="',
                    (shipStatInfo.friend > 0) ? 'qi-friend' : '',
                '">Friends <strong>', shipStatInfo.friend , '</strong></span>',
                '<span class="',
                    (shipStatInfo.foe > 0) ? 'qi-foe' : '',
                '">Foes <strong>', shipStatInfo.foe , '</strong></span>'
            ].join('');
            otherShips.appendChild(statsDiv);
        }
        if (options.usePriorityTrade &&  options.priorityTrade && priorityList.childNodes.length)
        {
            var ul = document.createElement('UL');
            ul.className = 'qi-priorityList';
            var heading = document.createElement('li');
            heading.className = 'priority-heading';
            heading.innerHTML = 'QI Priority Trade';
            ul.appendChild(heading);
            ul.appendChild(priorityList);
            document.getElementById('tdTabsRight').insertBefore(
                ul,
                document.getElementById('otherships')
            )
        }
        otherShips.appendChild(dest);
    } // scan_details
    if (options.useMapLink)
    {
        var sectorNode     = document.getElementById('sector'),
            sector         = sectorNode.innerHTML,
            mapLinkBaseUrl = 'https://pardusmapper.com/',
            univ        = UNIVERSE.charAt(0).toUpperCase() + UNIVERSE.slice(1);

        sectorNode.innerHTML = '<a title="Open Pardus Mapper" '           +
            ' href="' + mapLinkBaseUrl + '/' + univ + '/' + sector + '" ' +
            ' target="_blank">'                                           +
            sector + '</a>';
    }

    if (options.useInstantMO)
    {
        //var commandsContent = document.getElementById('commands_content'),
        var commandDiv = document.getElementById('commands_content');
        var contents = commandDiv.innerHTML;
        commandDiv.innerHTML = [contents,
            '<br><br><a id="qi-instantMO" style="color:yellow;padding-bottom:5px;" target="main" href="/newbuilding.php?buildid=15">',
            'Instant MO</a>'  ].join('');
    }


    if (options.useClock && location.search.indexOf('use=51') >= 0)
    {

        document.getElementById('useform').addEventListener('submit', handleDrugUsage, true);
        // track drug usage!
    }
    return cleanUp();
}


if (location.pathname.indexOf('building.php') >= 0)
{
    bindNavKb();


    var tableheadings = document.querySelectorAll('th');
    var ownedTblElem,
        othershipsTblElem;
    for (var i = 0, len = tableheadings.length; i < len; i++)
    {
        if (tableheadings[i].textContent.indexOf('Owned by') !== -1)
        {
            ownedTblElem = tableheadings[i].parentNode.parentNode.parentNode;
        }

        if (tableheadings[i].textContent.indexOf('Other Ships') !== -1)
        {
            othershipsTblElem = tableheadings[i].parentNode.parentNode.parentNode;
        }
        // break out of loop
        if (ownedTblElem && othershipsTblElem) { break; }
    }


    var str = document.querySelectorAll('B');
    for (it = 0, len = str.length; it < len; it++)
    {
        if (str[it].textContent.indexOf('Your APs') !== -1)
        {
            var div = document.createElement('DIV');
            div.setAttribute('style',
                'width: 600px;font-weight:bold; padding: 0.5em;margin:1em 0; background-color: #800000;color: #ccc'
            );
            div.textContent = str[it].textContent;
            ownedTblElem.parentNode.insertBefore(
                div,
                ownedTblElem
            );
        }
    }



    if (options.useFriendFoeHighlighter || options.useTradeLink)
    {
        if (othershipsTblElem)
        {
            var cells = othershipsTblElem.querySelectorAll('td');

            var priorityList = document.createDocumentFragment();
            // console.log(' FOUND ' + cells.length + ' cells');
            for (var j=0, len=cells.length; j < len; j+=2)
            {
                var faction = cells[j].querySelector('img');
                var pilotRow = cells[j+1];
                var pilotFaction = 'n';
                if (faction)
                {
                    pilotFaction = getFaction(faction.getAttribute('src'));
                }
                // console.log(pilotFaction);
                // console.log(pilotRow);
                var pilotInfo = getPilotInfo(pilotRow, pilotFaction);
                // cells[j].className += 'qi-' + pilotInfo.friendFoe;
                pilotRow.className += 'qi-' + pilotInfo.friendFoe;
                if (options.usePriorityTrade
                    && options.priorityTrade
                    && options.priorityTrade.indexOf(pilotInfo.pilotName) !== -1)
                {
                    // this pilot is a priority to be traded with.
                    var li = document.createElement('LI');
                    li.innerHTML = [
                        '<a href="ship2ship_transfer.php?playerid=' ,
                         pilotInfo.pilotId ,
                         '">' , pilotInfo.pilotName, '</a>'
                    ].join('');
                    priorityList.appendChild(li);

                }
                // get the alliance link
                // console.log(pilotInfo);
                if (options.useTradeLink)
                {
                    var a = document.createElement('a');
                    a.setAttribute(
                        'href',
                        'ship2ship_transfer.php?playerid=' + pilotInfo.pilotId
                      );
                    a.setAttribute('style', 'display:block;font-size:11px;color:#2C99EB;');
                    a.innerHTML = '[ TRADE ]';
                    pilotRow.appendChild(a);
                }
                // console.log('Running through ship cells ' + j);
            }

            if (options.usePriorityTrade
                && options.priorityTrade
                && options.priorityTrade.length && priorityList.childNodes.length)
            {
                var ul = document.createElement('UL');

                ul.className = 'qi-priorityList qi-priorityList-building';
                var heading = document.createElement('li');
                heading.className = 'priority-heading';
                heading.innerHTML = 'QI Priority Trade';
                ul.appendChild(heading);
                ul.appendChild(priorityList);
                othershipsTblElem.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(
                    ul,
                    othershipsTblElem.parentNode.parentNode.parentNode.parentNode
                );
            }
        }
    }

    var tbl = document.querySelectorAll('TABLE');
    for (var it = 0, len = tbl.length; it < len; it++)
    {
        if (tbl[it].previousSibling && tbl[it].previousSibling.textContent.indexOf('Condition') > -1)
        {
            tbl[it].previousSibling.textContent = 'Condition: ' + width2condition(tbl[it].getAttribute('width'),tbl[it].getAttribute('style'));
            break;
        }
    }

    if (options.useClock)
    {
        var forms = document.querySelectorAll('input[type=submit]');
        for (var i = 0, len = forms.length; i < len; i++)
        {
            var useBtn = forms[i];
            if (useBtn.getAttribute('name') == 'useres')
            {

                var hidden = useBtn.previousSibling.previousSibling.previousSibling;

                if (hidden.value == 51)
                {
					console.log('hidden');
                    useBtn.addEventListener('click', function(e)
                    {
                        var haveAmt = parseInt(this.parentNode.previousSibling.textContent, 10);
                        var amount = this.previousSibling.previousSibling.value;
                        if (amount > haveAmt)
                        {
                            return true;
                        }
                        else
                        {
                            var curTime = new Date().getTime();
                            var drugJson = getDrugUsage(curTime);

                            drugJson.push({curTime : curTime, amount : amount, expire : (curTime + (60 * 60 * 1000 * amount)) });
                            drugJson = JSON.stringify(drugJson);

                            GM_setValue(UNIVERSE+'_drugHash', drugJson );
                        }
                        return true;
                    });
                }
            }
        }
    }


    return cleanUp();
}

if (location.pathname.indexOf('msgframe.php') >= 0)
{
    if (options.useUserLinks || options.useClock)
    {
        var table = document.body.getElementsByTagName('table')[0]

        if (options.useUserLinks)
        {
            var linkCell = table.rows[0].cells[0],
                links = document.evaluate(
                    ".//a[@href]",
                    table.rows[0].cells[0],
                    null,
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
            for(var i=2; i < links.snapshotLength; i++)
            {
                if (links.snapshotItem(i).nextSibling)
                {
                    linkCell.removeChild(links.snapshotItem(i).nextSibling);
                }
                linkCell.removeChild(links.snapshotItem(i));
            }

            var qiLinks   = document.createElement('span'),
                userLinks = {},
                tplLink   = ' <a href="%url%" target="_blank">%title%</a> ',
                str       = '';

            for (var i = 1; i < 6; i++)
            {
                var curUrl   = GM_getValue(UNIVERSE+'_userLinkUrl'+i,''),
                    curTitle = GM_getValue(UNIVERSE+'_userLinkTitle'+i,'');
                if (curUrl !== '' && curTitle !== '')
                {
                    userLinks[curTitle] = curUrl;
                }
            }

            for (var key in userLinks)
            {
                if (userLinks.hasOwnProperty(key))
                {
                    str += ' | ' + tplLink
                        .replace('%url%', userLinks[key])
                        .replace('%title%', key);
                }
            }
            qiLinks.innerHTML = '<a href="http://www.pardus.at/index.php?section=manual_intro010" target="_blank">Manual</a>' + str;
            linkCell.appendChild(qiLinks);
        }

        if (options.useClock)
        {
            var td    = table.rows[0].cells[1],
                addOn = ['<div style="position: absolute;z-index:-1; top: 0; width: 50%; text-align: center;font-size: 10px; padding: 0 1em; color: #999;">' ,
                        ' Time: <span id="tim"></span> | ' ,
                        ' GMT: <span id="gmt"></span> | ' ,
                        ' AP: <span id="ap"></span> | ' ,
                        ' B: <span id="bui"></span> | ' ,
                        ' P: <span id="pl"></span> | ' ,
                        ' SB: <span id="sb"></span> |' ,
                        ' Drug: <span id="drugusage"></span> ' ,
                    '</div>'].join(''),
                notice = td.getElementsByTagName('table');
            td.setAttribute('style', 'position: relative;');

            if (notice.length > 0)
            {
                var tbl = notice[0];
                tbl.setAttribute('title', 'Click to close');
                tbl.setAttribute(
                    'style',
                    tbl.getAttribute('style') + ' ;z-index:99;top: 0'
                );
                tbl.setAttribute('id', 'msgnotice');
                var closeBtn = tbl.rows[0].insertCell(2);
                closeBtn.innerHTML = '<span style="margin: 2px 4px;font-weight: bold; color: #D00000 ;">X</span>';
                tbl.setAttribute(
                    'onclick',
                    "document.getElementById('msgnotice').parentNode.removeChild(document.getElementById('msgnotice'))"
                );

                tbl.insertAdjacentHTML('beforebegin', addOn);
            }
            else
            {
                table.rows[0].cells[1].innerHTML = addOn;
            }

            var amt           = 0;
                var expire    = 0,
                    drugConsumeTime = 0;
                var curTime   = new Date().getTime();
                var drugUsage = getDrugUsage(curTime);

            for (var i = 0; i < drugUsage.length; i++)
            {
                amt += parseInt(drugUsage[i]['amount'], 10);
                if (drugUsage[i]['curTime'] > drugConsumeTime)
                {
                    drugConsumeTime = drugUsage[i]['curTime']
                }
            }
            expire = (drugConsumeTime + (60 * 60 * 1000 * amt));
            var timeStr = (expire != 0)
                ? '- ' + get_time_difference(curTime,expire).duration
                : '';

            document.getElementById('drugusage').innerHTML = ' ' + amt +'t ' + timeStr;
            StartClock24()


        }
    }


    return cleanUp();

}
if (location.pathname.indexOf('statistics.php') > -1 )
{
	var h1 = document.querySelector('H1');

    if (options.useFriendFoeHighlighter
		&& h1.textContent == 'Online Players'
		&& (
        location.search === '' || location.search.indexOf('online') > -1
    ))
    {
        var memberTable = document.getElementsByTagName('TABLE')[6],
            links       = document.evaluate(
            ".//td",
            memberTable,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        var onlineList    = [],
            foeList       = JSON.parse(GM_getValue(UNIVERSE+'_foe_roster', '[]')),
            friendList    = JSON.parse(GM_getValue(UNIVERSE+'_friend_roster', '[]')),
            neutralList   = JSON.parse(GM_getValue(UNIVERSE+'_neutral_roster', '[]')),
            manualList    = JSON.parse(GM_getValue(UNIVERSE+'_track_manual', '[]')),
            amountFoes    = 0,
            amountNeutral = 0,
            amountFriends = 0,
            amountManual  = 0;

        for (var i=0; i < links.snapshotLength; i++)
        {
            var pilotName = links.snapshotItem(i).textContent;
            onlineList.push(pilotName);

            if (pilotName == '') { continue; }

            if ( foeList.indexOf(pilotName) !== -1 )
            {
                links.snapshotItem(i).setAttribute('style', 'background-color: ' + options.foeColor);
                amountFoes += 1;
            }
            if ( neutralList.indexOf(pilotName) !== -1 )
            {
                links.snapshotItem(i).setAttribute('style', 'background-color: #666');
                amountNeutral += 1;
            }

            if (friendList.indexOf(pilotName) !== -1)
            {
                links.snapshotItem(i).setAttribute('style', 'background-color: ' + options.friendColor);
                amountFriends += 1;
            }

            if (manualList.indexOf(pilotName) !== -1)
            {
                links.snapshotItem(i).setAttribute('style', 'background-color: #333');
                amountManual += 1;
            }
        }
        var trackAlliance = JSON.parse(GM_getValue(UNIVERSE+'_track_alliance', '[]'));

        var onlinePilotList =  [
                '<div id="qi-augmenterOptions" '
                ,'style="width: 750px;background:url(http://static.pardus.at/images/bgd.gif)">'
                ,'<table id="qi-onlinelist-table" style="width: 100%;"><tr><th>'
                ,'    QI FriendFoe List Online : 0 foes, 0 neutral, 0 friends'
                ,'</th></tr><tr>'
                ,'<td style="padding: 1em;">Manually track pilots <input type="text" id="qi-onlinelist-pilot"/>'
                ,' <button id="qi-onlinelist-addpilot">Add</button>'
                ,' <button id="qi-onlinelist-rmpilot">Remove</button>'
                ,'</td></tr><tr>'
                ,'<td style="padding: 1em;">Nobody has been added, view an alliance page and click "track"</td>'
                ,'</tr></table>'
                ,'</div><br />'
                ,'<button id="qi-clear-onlinelist">Clear all online tracking list</button>'
            ].join('');

        var manualHTML = [];
        if (manualList.length > 0)
        {
            var onlinePilots = [];
            for (var j=0; j < manualList.length; j++)
            {
                if (onlineList.indexOf(manualList[j]) !== -1)
                {
                    onlinePilots.push(['<li style="padding: 2px; 0; display:inline-block; width: 120px">' ,
                        '<a href=\'javascript:void sendmsg("',manualList[j],'");\'>' ,
                        manualList[j] , '</a></li>'].join(''));
                }
            }
            if (onlinePilots.length > 0)
            {
                manualHTML.push([
                    '<h4 style="margin-top:0;padding: 3px 0;'
                    ,'   text-align:center;'
                    ,'   background-color: #333;'
                    ,'   color: #CCC;"'
                    ,'>Manually Tracked (', onlinePilots.length, ')', '</h4>'
                    ,'<ul style="margin:0;padding:0;list-style: none;">'
                    ,    onlinePilots.join('')
                    ,'</ul>'
                ].join(''));
            }
        }
        if (trackAlliance.length > 0)
        {
            /**
             * Structure of the GM get value object
              {
                    alliance   : allyName.textContent,
                    allianceId : allyId,
                    friendFoe  : isFriendFoe,
                    lastUpdate : new Date().getTime(),
                    pilotList  : allyPilots
                }
              */
            var foeHTML     = [],
                friendHTML  = [],
                neutralHTML = [],
                onlineHTML  = [],
                string      = '',
                color       = '';
            for (var i = 0; i < trackAlliance.length; i++)
            {
                //console.log(trackAlliance[i]);

                var curAlly = GM_getValue(UNIVERSE+'_roster_alliance-'+trackAlliance[i], '{}');
                //console.log(curAlly);
                if (curAlly == '{}' || curAlly === '') { continue; }
                curAlly = JSON.parse(curAlly);

                switch (curAlly.friendFoe)
                {
                    case 'friend' : color = options.friendColor; break;
                    case 'foe'    : color = options.foeColor; break;
                    case '--'     : color = '#666';break;
                }

                var onlinePilots = [];
                for (var j=0; j < curAlly.pilotList.length; j++)
                {
                    if (onlineList.indexOf(curAlly.pilotList[j]) !== -1)
                    {
                        onlinePilots.push(['<li style="padding: 2px; 0; display:inline-block; width: 120px">' ,
                            '<a href=\'javascript:void sendmsg("',curAlly.pilotList[j],'");\'>' ,
                            curAlly.pilotList[j] , '</a></li>'].join(''));
                    }
                }

                var durationUpdated = get_time_difference(curAlly.lastUpdate,new Date().getTime());
                if (onlinePilots.length === 0)
                {
                    continue;
                }
                string = [
                    '<h4 style="margin-top:0;padding: 3px 0;'
                    ,'   text-align:center;'
                    ,'   background-color: ' , color , ';'
                    ,'   color: #ccc;"'
                    ,'>' , curAlly.alliance , ' (', onlinePilots.length, ')', '</h4>'
                    ,'<ul style="margin:0;padding:0;list-style: none;">'
                    ,    onlinePilots.join('')
                    ,'</ul>'
                    ,'<div style="margin-bottom: 1.5em;font-size: 10px;">Last updated: '
                    ,    durationUpdated.duration
                    ,' ago | <a href="/alliance.php?id=',curAlly.allianceId,'">'
                    ,'Refresh</a></div>'
                ].join('');
                onlineHTML.push(string);
                switch (curAlly.friendFoe)
                {
                    case 'foe'    : foeHTML.push(string); break;
                    case 'friend' : friendHTML.push(string);break;
                    case '--'     : neutralHTML.push(string); break;
                }
            }

            // create some crap
            onlinePilotList = [
                '<div id="qi-augmenterOptions" '
                ,'style="width: 900px;background:url(http://static.pardus.at/images/bgd.gif)">'
                ,'<table id="qi-onlinelist-table"><tr><th colspan="3">'
                ,'    QI FriendFoe List Online : ',amountFoes ,
                ,'     foes, ', amountNeutral, ' neutral,  '
                ,amountFriends , ' friends, ', amountManual, ' manual'
                ,'</th></tr><tr>'
                ,'<td colspan="3" style="padding: 1em;">Manually track pilots <input type="text" id="qi-onlinelist-pilot"/>',
                ,' <button style="margin: 0 0.5em;" id="qi-onlinelist-addpilot">Add</button>'
                ,' <button id="qi-onlinelist-rmpilot">Remove</button>'
                ,'</td></tr><tr>'
                ,'<td>', manualHTML.join(''), '</td></tr><tr>'
                ,'<td>', foeHTML.join(''), neutralHTML.join(''), friendHTML.join(''),'</td>'
                ,'</tr></table>'
                ,'</div><br />'
                ,'<button id="qi-clear-onlinelist">Clear all online tracking list</button>'
            ].join('')
        }

        var onlinePilotListNode = document.createElement('div');
        onlinePilotListNode.innerHTML = onlinePilotList;
        var pilotListAnchorPoint = document.getElementsByTagName('h1')[0];
        if (!pilotListAnchorPoint)
        {
            alert('pilot list anchor point not exist');
        }
        else
        {
            var child = pilotListAnchorPoint.nextSibling;
            if (child) {
                pilotListAnchorPoint.parentNode.insertBefore(onlinePilotListNode, child);
            }
            else {
                pilotListAnchorPoint.parentNode.appendChild(onlinePilotListNode);
            }
        }

        if (!document.getElementById('qi-onlinelist-table'))
        {
            alert('Cannot find qi online list in dom');
        }

        // end debug method
        // document.getElementsByTagName('h1')[0].insertAdjacentHTML('afterend',onlinePilotList);

        document.getElementById('qi-onlinelist-addpilot').addEventListener('click', function(e)
        {
            var newPilot = document.getElementById('qi-onlinelist-pilot').value.trim();
            var manualTrack = JSON.parse(GM_getValue(UNIVERSE+'_track_manual', '[]'));
            manualTrack.push(newPilot);
            GM_setValue(UNIVERSE+'_track_manual', JSON.stringify(manualTrack));
            location.reload();

        });
        document.getElementById('qi-onlinelist-rmpilot').addEventListener('click', function(e)
        {
            var newPilot = document.getElementById('qi-onlinelist-pilot').value.trim();
            var manualTrack = JSON.parse(GM_getValue(UNIVERSE+'_track_manual', '[]'));
            var idx = manualTrack.indexOf(newPilot);
            manualTrack.splice(idx, 1);
            GM_setValue(UNIVERSE+'_track_manual', JSON.stringify(manualTrack));
            location.reload();
        });
        document.getElementById('qi-clear-onlinelist').addEventListener('click', function(e)
        {
            console.log('qi clear online list');
            var trackAlliance = JSON.parse(GM_getValue(UNIVERSE+'_track_alliance', '[]'));
            for (var i = 0; i < trackAlliance.length; i++)
            {
                console.log('wiping out ' + trackAlliance[i]);
                GM_setValue(UNIVERSE+'_roster_alliance-'+trackAlliance[i], '');
            }
            console.log('wiping out foe and friend roster');
            GM_setValue(UNIVERSE+'_friend_roster', '[]');
            GM_setValue(UNIVERSE+'_foe_roster', '[]');
            GM_setValue(UNIVERSE+'_neutral_roster', '[]' );
            GM_setValue(UNIVERSE+'_track_manual', '[]');
            GM_setValue(UNIVERSE+'_track_alliance', '[]');
            console.log('done!');
            location.reload(true);
        }, false);
    }
    return cleanUp();
}


if (   location.pathname.indexOf('news.php') >= 0 )
{
    if (options.useNewsLinks)
    {
        // faster than getElementsByTagName since it scans the whole document
        //  using xpath saves 5-8 milliseconds
        var links = document.evaluate(
                "//a[@href]",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
        for(var i=0; i < links.snapshotLength; i++)
        {
            thislink = links.snapshotItem(i);
            if (thislink.href.indexOf('sendmsg') >= 0)
            {
                var value = thislink.innerHTML;
                if (value.indexOf('<') >=0)
                {
                    value = thislink.firstChild.innerHTML;
                }
                thislink.insertAdjacentHTML(
                    'beforebegin',
                    getPilotNewsLink(value)
                );
            }
        }
    }

    return cleanUp();
}
if( (location.pathname.indexOf('alliances.php') >= 0) )
{
    if (options.useFriendFoeHighlighter)
    {
        var links = document.evaluate(
                "//a[@href]",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
        for(var i=0; i < links.snapshotLength; i++)
        {
            thislink = links.snapshotItem(i);
            if (thislink.href.indexOf('alliance.php') >= 0)
            {
                var allianceid = '',
                    p          = thislink.href.indexOf("?id=")+4,
                    q          = thislink.href.length;
                allianceid = thislink.href.substr(p,q-p);
                var faction = getFaction(thislink.parentNode.parentNode.innerHTML);
                var result = checkFriendFoe('none',allianceid,faction);
                thislink.parentNode.className += 'qi-' + result;
            }
        }
    }

    return cleanUp();
}


if (location.pathname.indexOf('alliance.php') !== -1)
{
    if (options.useFriendFoeHighlighter)
    {
        var allyName    = document.getElementsByTagName('font')[0],
            allyId      = location.search.split('?id=')[1],
            isFriendFoe = checkFriendFoe('none',allyId,'');
        // is this alliance a foe?
        allyName.className += 'qi-' + isFriendFoe;
        // add tracking button
        allyName.insertAdjacentHTML(
                    'afterend',
                    '<br/><br/><button id="qi-ally-tracker">Track this alliance in the online list</button><br/><br/>'
                );
        // get Tracker info
        var trackAlliance = JSON.parse(GM_getValue(UNIVERSE+'_track_alliance', '[]')),
            isTracked     = (trackAlliance.indexOf(allyName.textContent) !== -1),
            trackButton   = document.getElementById('qi-ally-tracker');
        if (isTracked)
        {
            trackButton.textContent ='Stop tracking this alliance';
        }
        // create bind to track this alliance
        trackButton.addEventListener('click', function ()
        {
            if (isTracked)
            {
                trackAlliance.splice(trackAlliance.indexOf(allyName.textContent), 1);
                trackButton.textContent ='Track this alliance in the online list';
            }
            else
            {
                trackAlliance.push(allyName.textContent);
                trackButton.textContent ='Stop tracking this alliance';
            }
            GM_setValue(UNIVERSE+'_track_alliance', JSON.stringify(trackAlliance));
            location.reload(true);
        });
        var tipBox = document.getElementById('tipBox');
        var nextSibling = tipBox.nextSibling;
        while(nextSibling && nextSibling.nodeType != 1) {
            nextSibling = nextSibling.nextSibling
        }

        var memberTable = nextSibling.getElementsByTagName('table')[nextSibling.getElementsByTagName('table').length - 1];

        var links = document.evaluate(
            ".//a",
            memberTable,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        var foePilots    = JSON.parse(GM_getValue(UNIVERSE+'_foe_roster', '[]'));
        var friendPilots = JSON.parse(GM_getValue(UNIVERSE+'_friend_roster', '[]'));
        var neutralPilots = JSON.parse(GM_getValue(UNIVERSE+'_neutral_roster', '[]'));
        var allyPilots = [];

        for(var i=0; i < links.snapshotLength; i++)
        {
            var pilotLink = links.snapshotItem(i);
            // console.log(pilotLink);
            if (pilotLink.getAttribute('href').indexOf('sendmsg') === -1)
            {
                continue;
            }
            var pilotName = pilotLink.textContent;
            // console.log(pilotName);

            // clean this pilot from our lists
            var wasFoe = foePilots.indexOf(pilotName);
            if (wasFoe !== -1)
            {
                foePilots.splice(wasFoe, 1);
            }
            var wasFriend = friendPilots.indexOf(pilotName);
            if (wasFriend !== -1)
            {
                friendPilots.splice(wasFriend, 1);
            }
            var wasNeutral = neutralPilots.indexOf(pilotName);
            if (wasNeutral !== -1)
            {
                neutralPilots.splice(wasNeutral, 1);
            }

            // now process the the pilot name and add to the appropriate list
            if (isTracked)
            {
                if (isFriendFoe === '--' && neutralPilots.indexOf(pilotName) === -1)
                {
                    neutralPilots.push(pilotName);
                }
                if (isFriendFoe === 'foe')
                {
                    foePilots.push(pilotName);
                }
                if (isFriendFoe === 'friend' && friendPilots.indexOf(pilotName) === -1)
                {
                    friendPilots.push(pilotName)
                }

                allyPilots.push(pilotName);
            }
        }
        var saveValue = {
            alliance   : allyName.textContent,
            allianceId : allyId,
            friendFoe  : isFriendFoe,
            lastUpdate : new Date().getTime(),
            pilotList  : allyPilots
        };


        saveValue = JSON.stringify(saveValue);
        GM_setValue(UNIVERSE+'_roster_alliance-' + allyName.textContent, saveValue);

        GM_setValue(UNIVERSE+'_neutral_roster', JSON.stringify(neutralPilots) );
        GM_setValue(UNIVERSE+'_friend_roster', JSON.stringify(friendPilots) );
        GM_setValue(UNIVERSE+'_foe_roster', JSON.stringify(foePilots) );

    }
    return cleanUp();

}


if (location.pathname.indexOf('sendmsg.php') !== -1)
{
    if (options.useNewsLinks)
    {
        // put alliance news links
        var img      = document
                            .getElementById('sendform')
                            .getElementsByTagName('img')[0],
            alliance = img.getAttribute('alt').split(' - ')[1];
        img.insertAdjacentHTML("afterend",
            ['<div style="display: table-cell; vertical-align: middle;">'
            , '<span style="vertical-align: middle;">' , alliance , '</span> | '
            , getAllyNewsLink(alliance) , '</div>'].join('')
        );
        // put pilot news link
        document.getElementById('recipient2')
            .parentNode
            .getElementsByTagName('a')[0]
            .insertAdjacentHTML(
                'afterend',
                getPilotNewsLink(document.getElementById('recipient2').value)
            );
    }
    return cleanUp();
}

if (location.pathname.indexOf('overview_stats.php') !== -1)
{
    function qiParseRankProgress(row)
    {
        if (row.cells[1].firstChild.nodeName !== 'TABLE') { return; }

        row = row.cells[1].firstChild.rows[0];

        if (row.cells.length > 2)
        {
            row.parentNode.parentNode.setAttribute('width', '180');
            var value   = row.cells[1]
                            .getElementsByTagName('table')[0]
                            .rows[0]
                            .cells[0]
                            .title
                            .replace(/ /g,''),
                newcell = row.insertCell(3);
            newcell.setAttribute('width', '50');
            newcell.setAttribute('align', 'right');
            newcell.textContent = ' (' + value + ')';
        }
    }

    var forms = document.getElementsByTagName('form')[0];

    if (forms.name == 'statsform')
    {
        qiParseRankProgress(forms.firstChild.rows[3]);
        qiParseRankProgress(forms.firstChild.rows[6]);
    }
    return cleanUp();
}

if (location.pathname.indexOf('ship2ship_transfer.php') !== -1)
{
    // bind F2 to nav key
    bindNavKb();

    if (options.useS2SQuickFill)
    {

        function qiTransferS2S (event)
        {
            var cell      = this.parentNode,
                freespace = parseInt(cell.getAttribute('data-target-free-space')),
                carrying  = parseInt(cell
                                        .previousSibling
                                        .previousSibling
                                        .firstChild
                                        .innerHTML
                            ),
                value     = this.value,
                autoSubmit = false;

            var fields = this.parentNode.parentNode.parentNode.querySelectorAll('input[type=text]');
            var queuedValues = 0;
            for (var i = 0, len = fields.length; i < len; i++)
            {
                queuedValues += parseInt(fields[i].value || 0);
            }
            freespace -= queuedValues;
            if (freespace < 0) { freespace = 0; }

            if (value.indexOf('GiveAndGo') !== -1)
            {
                // console.log(value);
                var gngRegEx = /GiveAndGo \((\d+)\)/;
                amount = value.match(gngRegEx);
                autoSubmit = true;
                value = parseInt(amount[1], 10);
            }

//             value = (value === 'All') ? 99999 : value;
            value = (value > carrying) ? carrying : value;
            value = (value > freespace) ? freespace : value;

            // assign text values to fields
            var curVal = parseInt(this.parentNode.previousSibling.firstChild.value || 0, 10),
                newVal = curVal + parseInt(value, 10);
            if (newVal > carrying) { newVal = carrying; }



            this.parentNode.previousSibling.firstChild.value = newVal;

            if (autoSubmit)
            {
                document.getElementsByTagName('form')[0].submit();
            }
        }
        var forms           = document.getElementsByTagName('form')[0],
            targetFreeSpace = parseInt(forms
                                        .nextSibling
                                        .nextSibling
                                        .innerHTML
                                        .replace('t',''),
                            10);

        if (targetFreeSpace == 0)
        {
            var h1 = document.createElement('h1');
            h1.setAttribute(
                'style',
                'background: red; color: black; size: 2em; padding: 0.5em 2em;'
            );
            h1.innerHTML = 'No Free Space';
            forms.appendChild(h1);
        }

        var table  = forms.getElementsByTagName('table')[0]
                        .rows[1]
                        .cells[0]
                        .getElementsByTagName('table')[0],
            th     = document.createElement('th'),
            botRow = undefined,
            botIterator = 0,
            drugIterator = 0;

        th.appendChild(document.createTextNode('QI QuickFill'));
        table.rows[0].appendChild(th);

        for (var i=1; i < table.rows.length; i++)
        {
            if (!table.rows[i].cells[2])
            {
                break;
            }
            var newcell      = table.rows[i].insertCell(4),
                quickbuttons = undefined,
                j            = 0;
            newcell.setAttribute(
                'style',
                'white-space: nowrap; padding-left: 0.5em;'
            );
            var amtSmall = options.transferS2Svalues.small,
                amtLarge = options.transferS2Svalues.large,
                amtGnG = options.transferS2Svalues.giveandgo;
            if (table.rows[i].cells[1].innerHTML === 'Robots')
            {
                botRow      = table.rows[i];
                botIterator = i;
            }
            if (table.rows[i].cells[1].innerHTML === 'Drugs')
            {
                drugIterator = i;
                amtSmall = options.transferS2Svalues.smalldrug,
                amtLarge = options.transferS2Svalues.largedrug,
                amtGnG = options.transferS2Svalues.giveandgodrug;
            }

            newcell.setAttribute('data-target-free-space', targetFreeSpace);
            newcell.innerHTML = ['<input type="button" id="transfer-small-', i,'"',
                ' value ="' ,amtSmall , '"'         ,
                ' title="' , amtSmall , '"'          ,
                ' style="color:#00FF00;">'                                  ,
                '<input type="button" id="transfer-large-' , i , '" '       ,
                ' value ="' , amtLarge , '"'         ,
                ' title="' , amtLarge , '"'          ,
                ' style="color:#00FF00;">'                                  ,
                '<input type="button" id="transfer-giveandgo-' , i , '" '     ,
                ' value ="GiveAndGo (',amtGnG,')" title="Give and go!" '                 ,
                ' style="margin-left: 1em;color:#FF0000;">'].join('');

            quickbuttons = table.rows[i].cells[4].getElementsByTagName('input');
            for (j=0; j < quickbuttons.length; j++)
            {
                quickbuttons[j].addEventListener('click', qiTransferS2S, false);
            }

            // click to clear
            if (table.rows[i].cells.length == 5)
            {
                // console.log(table.rows[i].cells.length)
                table.rows[i].cells[3].firstChild.addEventListener('click',
                    function ()
                    {
                        this.value = '';
                    }, false);

            }
        }
        document.addEventListener('keyup', function (e)
        {
            // console.log('keyup executing');
            if (e.keyCode == options.keycode.giveandgo && options.useS2SQuickFill)
            {
                // console.log('doing give and go on ' + botIterator);
                if (botRow === undefined || botIterator === 0) { return; }
                document.getElementById('transfer-giveandgo-' + botIterator).click();
            }
        }, false);

    }

    return cleanUp();
}
if (location.pathname.indexOf('ambush.php') >= 0)
{
    if (options.useFriendFoeHighlighter)
    {
        var qlTable = document.getElementById('readlist');
        var div = document.createElement('div');
        div.innerHTML = '<br /><br /><input type="button" value="Apply QI Augmenter Saved QL" id="apply-saved-ql"/>';
        qlTable.rows[0].cells[0].appendChild(div);
        document.getElementById('apply-saved-ql').addEventListener('click', function ()
        {
            var textarea = getFirstChild(qlTable.rows[0].cells[0]);
            textarea.value = GM_getValue(UNIVERSE+'_ql');
        });
    }


}
if (location.pathname.indexOf('ship2opponent_combat.php') >= 0)
{
    if (options.useNpcHP)
    {
        var tableList   = document.getElementsByTagName('table'),
            td          = undefined,
            font        = undefined,
            optionsHTML = '';

        td = tableList[0].rows[1].cells[1]
                .getElementsByTagName('table')[1].rows[0].cells[1]
                .getElementsByTagName('table')[0];
        for (var i = 0; i < 3; i++)
        {
            if (td.rows[i])
            {
                font = td.rows[i].cells[0].firstChild;
                table = font.nextSibling;

                var hull = parseInt(table.getAttribute('width'), 10) * 2;
                font.innerHTML = font.innerHTML + ': ' +
                                    ((hull >= 600) ? '600+' : hull);
            }
        }
    }
    return cleanUp();
}



if (location.pathname.indexOf('options.php') >= 0)
{

    function qiSaveSettings ()
    {
        // console.log('asdf');
        var QL       = document.getElementById('qi-ql').value.replace(/(\r\n|\n|\r)/gm,""),
            qltokens = QL.split(';'),
            priorityTrade = document.getElementById('qi-priorityTrader').value.replace(/(\r\n|\n|\r)/gm,"");

        GM_setValue(UNIVERSE+'_priorityTrader', priorityTrade);
        if (qltokens.length > 19 && QL !== undefined)
        {
            GM_setValue(UNIVERSE+'_ql', QL);
            GM_setValue(UNIVERSE+'_ql_p_friend',qltokens[20]),
            GM_setValue(UNIVERSE+'_ql_p_foe',qltokens[14]),
            GM_setValue(UNIVERSE+'_ql_a_friend',qltokens[19]),
            GM_setValue(UNIVERSE+'_ql_a_foe',qltokens[13]),
            GM_setValue(UNIVERSE+'_ql_f_friend',qltokens[16]),
            GM_setValue(UNIVERSE+'_ql_f_foe',qltokens[5]);
        }
        else
        {
            GM_setValue(UNIVERSE+'_ql', '');
            GM_setValue(UNIVERSE+'_ql_p_friend',''),
            GM_setValue(UNIVERSE+'_ql_p_foe',''),
            GM_setValue(UNIVERSE+'_ql_a_friend',''),
            GM_setValue(UNIVERSE+'_ql_a_foe',''),
            GM_setValue(UNIVERSE+'_ql_f_friend',''),
            GM_setValue(UNIVERSE+'_ql_f_foe','');
        }
        var qiBools    = document.getElementById('qi-augmenterOptions'),
            inputs     = qiBools.getElementsByTagName('input'),
            savebutton = undefined,
            i          = 0;
        for (i = 0; i < inputs.length; i++)
        {
            if (inputs[i].getAttribute('id') === 'qi-saveSettings')
            {
                savebutton = inputs[i];
                continue;
            }
            var curElement = inputs[i];


            var optName = curElement.getAttribute('id').replace('qi-', '');

            var optValue;

            if (curElement.hasAttribute('checked'))
            {
                optValue = curElement.checked;
            }
            else
            {
                optValue = curElement.value;
            }
            GM_setValue(UNIVERSE+'_'+optName, optValue);
        }
        savebutton.value = 'Settings Saved!';
    }

    // draw option box
    var tableList   = document.getElementsByTagName('table'),
        td          = undefined,
        header      = undefined,
        optionsHTML = '';

    for (var i = 0; i < tableList.length; i++)
    {
        if (tableList[i].getAttribute('class') === 'messagestyle')
        {
            td = tableList[i].rows[0].cells[0];
            break;
        }
    }
    if (td === undefined)
    {
        console.log('broken');
        return;
    }
    header = getFirstChild(td);

    optionsHTML = ['<div id="qi-augmenterOptions" '                             ,
        '   style="background:url(http://static.pardus.at/images/bgd.gif)">'   ,
        '<h3 style="text-align: center;'                                       ,
        '           padding: 3px 0;'                                           ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>Pardus QI Augmenter</h3>'                                            ,

        '<table align="center" width="100%"><tbody><tr>'                       ,
        '  <td width="350" valign="top">'                                      ,
        '<h4 style="padding: 3px 0;'                                           ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>Information</h4>'                                                    ,
        '<p>This script augments many parts of the game.  It is designed to '  ,
        ' be used in conjunction with a fighter script, specifically the QI'   ,
        ' firefox extension. <strong>DO NOT GIVE THIS TO ANYONE</strong></p>'  ,

        '<h4 style="padding: 3px 0;'                                           ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>Options</h4>'                                                        ,

        '<div id="qi-useBooleans">'                                            ,
        '  <input type="checkbox" checked="checked" '                          ,
        '         id="qi-useFriendFoeHighlighter"/>'                           ,
        '    Use Friend Foe Highlighter<br/>'                                  ,
        '  <input type="checkbox" checked="checked" id="qi-useNewsLinks"/>'    ,
        '    Use News Links<br/>'                                              ,
        '  <input type="checkbox" checked="checked" id="qi-useS2SQuickFill"/>' ,
        '    Use Quick Fill<br/>'                                              ,
        '  <input type="checkbox" checked="checked" id="qi-usePriorityTrade"/>',
        '    Use Priority Trade<br/>'                                          ,

        '  <input type="checkbox" checked="checked" id="qi-useOtherShipStats"/>',
        '    Use Ship Count on Nav<br/>'                                      ,
        '  <input type="checkbox" checked="checked" id="qi-useMessageLink"/>'  ,
        '    Use Quick Message Link<br/>'                                      ,
        '  <input type="checkbox" checked="checked" id="qi-useTradeLink"/>'    ,
        '    Use trade link<br/>'                                              ,
        '  <input type="checkbox" checked="checked" id="qi-useTelerobLink"/>'  ,
        '    Use telerob link (requires friend/foe highlighter)<br/>'          ,
        '  <input type="checkbox" checked="" id="qi-useTelerobLinkAlways"/>'  ,
        '    ALWAYS allow telerob (overrides the checkbox above<br/>',
        '  <input type="checkbox" checked="checked" id="qi-useMapLink"/>'      ,
        '    Use map link<br/>'                                                ,
        '  <input type="checkbox" checked="checked" id="qi-useNavKbBind"/>'    ,
        '    Bind the F2 key to Nav<br/>'                                      ,
        '  <input type="checkbox" checked="checked" id="qi-useNavGrid"/>'      ,
        '    Use the navigation grid<br/>'                                     ,
        '  <input type="checkbox" checked="checked" id="qi-useHighlightTile"/>',
        '    Highlight my tile (req. Nav grid)<br/>'                           ,
        '  <input type="checkbox" checked="checked" id="qi-useNpcHP"/>'        ,
        '    Show NPC hit points<br/>'                                         ,
        '  <input type="checkbox" checked="checked" id="qi-useUserLinks"/>'    ,
        '    Use User Message Frame Links<br/>'                                ,
        '  <input type="checkbox" checked="checked" id="qi-useClock"/>'        ,
        '    Use Pardus Clock (incl. Drug Tracker)<br/>'                       ,
        '  <input type="checkbox" checked="checked" id="qi-useInstantMO"/>'    ,
        '    Use Instant MO build link<br/>'                                   ,
        '</div>'                                                               ,
        '<div style="padding-top:1em">',

        '<h4 style="padding: 3px 0; margin-bottom: 0;'                         ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '> Priority Trader (Comma separated list)</h4>',
        '  <textarea id="qi-priorityTrader"  style="background-color:#00001C;' ,
        '                            color:#D0D1D9;'                           ,
        '                            font-size:11px;'                          ,
        '                            width: 330px;'                            ,
        '                            height: 40px;"'                           ,
        '>',GM_getValue(UNIVERSE+'_priorityTrader'),'</textarea>',
        '</div>',
        '</td><td width="40"></td><td width="350" valign="top">'               ,

        '<h4 style="padding: 3px 0;'                                           ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>Friend Foe Highlighter</h4>'                                         ,
        '<p>Friends and foes are determined by a Quick List.  Paste one'       ,
        ' in and click save.</p>'                                              ,
        '<textarea id="qi-ql" style="background-color:#00001C;'                ,
        '                            color:#D0D1D9;'                           ,
        '                            font-size:11px;'                          ,
        '                            width: 330px;'                            ,
        '                            height: 40px;"'                           ,
        '>' , GM_getValue(UNIVERSE +'_ql', ';;;;;;;;;;;;;;;;;;;;;;')           ,
        '</textarea>'                                                          ,
        '<br/><br/>'                                                           ,
        '<input type="text" size="8" id="qi-foeColor" value="#480000"/>'       ,
        '  Colour for Foes<br/>'                                               ,
        '<input type="text" size="8" id="qi-friendColor" value="#004800"/>'    ,
        ' Color for Friends<br/>'                                              ,
        '<br/>'                                                                ,

        '<h4 style="padding: 3px 0;'                                           ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>Quick Fill</h4>'                                                     ,

        '<input type="text" size="3" id="qi-transferGiveAndGo" value="20"/> '  ,
        '  Give and Go Amount<br/>'                                            ,
        '<input type="text" size="3" id="qi-transferLarge" value="30"/> '      ,
        ' Transfer Large amount<br/>'                                          ,
        '<input type="text" size="3" id="qi-transferSmall" value="10"/> '      ,
        ' Transfer, small amount<br/><br/>'                                    ,
        '<input type="text" size="3" id="qi-transferGiveAndGoDrug" value="10"/> '  ,
        '  Drug Give and Go Amount<br/>'                                      ,
        '<input type="text" size="3" id="qi-transferLargeDrug" value="5"/> '      ,
        ' Drug Transfer Large amount<br/>'                                          ,
        '<input type="text" size="3" id="qi-transferSmallDrug" value="3"/> '      ,
        ' Drug Transfer, small amount<br/>'                                         ,

        '<h4 style="padding: 3px 0; margin-bottom: 0;'                         ,
        '           text-align:center;'                                        ,
        '           background-color: #800000;'                                ,
        '           color: #ccc;"'                                             ,
        '>User Msg Frame Links</h4>'                                           ,
        '<table width="100%"><tr><th width="20%">Title</th><th>URL</th></tr>'  ,
        '<tr>' ,
        '<td><input type="text" size="5" id="qi-userLinkTitle1" value=""/></td>',
        '<td><input type="text" style="width: 97%" id="qi-userLinkUrl1"/></td>' ,
        '</tr>' ,
        '<tr>' ,
        '<td><input type="text" size="5" id="qi-userLinkTitle2" value=""/></td>',
        '<td><input type="text" style="width: 97%" id="qi-userLinkUrl2"/></td>' ,
        '</tr>' ,
        '<tr>' ,
        '<td><input type="text" size="5" id="qi-userLinkTitle3" value=""/></td>',
        '<td><input type="text" style="width: 97%" id="qi-userLinkUrl3"/></td>' ,
        '</tr>' ,
        '<tr>' ,
        '<td><input type="text" size="5" id="qi-userLinkTitle4" value=""/></td>' ,
        '<td><input type="text" style="width: 97%" id="qi-userLinkUrl4" /></td>' ,
        '</tr>' ,
        '<tr>' ,
        '<td><input type="text" size="5" id="qi-userLinkTitle5" value=""/></td>' ,
        '<td><input type="text" style="width: 97%" id="qi-userLinkUrl5" /></td>' ,
        '</tr>' ,
        '</table>' ,


        '</td></tr>'                                                           ,
        '<tr><td colspan="3" style="padding: 1em 0;text-align: center;">'      ,
        '  <input type="button" id="qi-saveSettings" '                         ,
        '         style="background-color: #800000; color: #ccc;"'             ,
        '         value="Save QI Augmenter Settings"/>'                        ,
        '</td></tr>'                                                           ,
        '</tbody></table></div><br/><br/><hr />'].join('');

    header.insertAdjacentHTML('afterend',optionsHTML);

    // reflect what's stored in the GM script values
    var qiBools    = document.getElementById('qi-augmenterOptions'),
        inputs     = qiBools.getElementsByTagName('input'),
        saveButton = undefined,
        i          = 0;
    for (i = 0; i < inputs.length; i++)
    {
        if (inputs[i].getAttribute('id') === 'qi-saveSettings')
        {
            continue;
        }
        var curElement = inputs[i],
            optName = curElement.getAttribute('id').replace('qi-', ''),
            optValue;

        if (curElement.hasAttribute('checked'))
        {
            inputs[i].checked = GM_getValue(UNIVERSE+'_' + optName, true);

        }
        else
        {
            if (GM_getValue(UNIVERSE+'_' + optName))
            {
                inputs[i].value = GM_getValue(UNIVERSE+'_' + optName);
            }
        }
    }
    // bind QL apply button
    document.getElementById('qi-saveSettings').addEventListener(
        'click',
        qiSaveSettings,
        false
    );
    return cleanUp();
}
function getFirstChild(n)
{
    var x = null;
    if (n.hasChildNodes())
    {
        x=n.firstChild;
        while (x.nodeType!=1)
        {
            x=x.nextSibling;
        }
    }
    return x;
}
function bindNavKb()
{
    if (options.useNavKbBind)
    {
        document.addEventListener('keyup', function (e)
        {
            if (e.keyCode == options.keycode.navscreen)
            {
                location.replace('main.php');
            }
        }, false);
    }
}
function cleanUp()
{

    var timeEnd = new Date().getMilliseconds();
    console.log('Execution time: ' + (timeEnd - timeStart) + ' milliseconds');
    return true;
}

/**
 * Tests if a pilot is a friend
 * @return enum (foe, friend, --)
 */
function checkFriendFoe(pilotid,allianceid,faction,element)
{
  var retval = '--';
    for (var x = 0; x < friendfoes.p_foes.length; x++)
    {
        if (pilotid == friendfoes.p_foes[x])
        {
            retval =  'foe';
        }
    }
    if (allianceid != '' && allianceid !== undefined)
    {
        //Mark alliance as foe
        for (var x = 0; x < friendfoes.a_foes.length; x++)
        {
            if (allianceid == friendfoes.a_foes[x])
            {
                retval =  'foe';
            }
        }
    }

    if (faction !== '' && faction !== undefined)
    {
        if (friendfoes.f_foes[0].indexOf(faction) >=0)
        {
            retval =  'foe';
        }
    }

    // Check friends now

    for (var x = 0; x < friendfoes.p_friends.length; x++)
    {
        if (pilotid == friendfoes.p_friends[x])
        {
            retval =  'friend';
        }
    }
    //Alliances
    if (allianceid != '' && allianceid !== undefined)
    {
        for (var x = 0; x < friendfoes.a_friends.length; x++)
        {
            if (allianceid == friendfoes.a_friends[x])
            {
                retval =  'friend';
            }
        }
    }
    //Factions
    if (faction !== '' && faction !== undefined)
    {
        if (friendfoes.f_friends[0].indexOf(faction) >=0 )
        {
            retval =  'friend';
        }
    }
    return retval;
}

function getFaction(s)
{
    var result = 'n';
    if(s.indexOf('sign_fed') >=0)      { result = 'f'; }
    else if(s.indexOf('sign_emp') >=0) { result = 'e'; }
    else if(s.indexOf('sign_uni') >=0) { result = 'u'; }
    return result;
}
function getAllyNewsLink(aName)
{
    return ' <a href="/news.php?s=' + encodeURIComponent(aName) +
        '&searchtype=alliance&search=Search">' +
        '<img style="vertical-align: middle;" ' +
        'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZlJREFUKJGVkc2LEmEAxp/3ncneGW01DVPUVNSx1Kyog0J0KZaFELpEl90usX/Asofd8Bxd69ox6BbUKRYP2wcRpdTusGuhaPlRZjEqM7WOjR/bKU8h9Ts+H5fnAf4TbpZpPX/yrOBxmAafFfWPRv6a9PuZNB/NBvyem5/K1ZH6Q7/LGH/aGOPWtMDOxX2+tOf6HC8sjifDaCqZIt32d7x4sIHM+hIqr2TslktdArdbDF9JZEPHfCuSNyxYDh4CIRTyVgEhScJPTQPhCYqFbXxsNlQukDn1yMESNwQmHig+fYZGrQbBznDkqBO/jAFGGOJb+yv2bHSnXe9d5fW2epnFr4E7bkH9/kM4ExE0Bi4Y719D39PAkX2YBBMGIpW1TTlPqciXeuXnIGYKWyAIapPAh9KYBFOoFWtQvvSAw2zYkpt3AIBORGG1pzw2Gk9uQ6cddItvMNQ6sAS8MDoaRhaiVyutZSX37u10VjEWc5kjZpf2QVXtSds9Xp1cGot0RM3cy77SX+vm5PzMM60LZy7aL8RP/PP9s/gNytuUHyDSpEAAAAAASUVORK5CYII="/></a> ';
}

function getPilotNewsLink(pName)
{
    return ' <a href="/news.php?s=' + encodeURIComponent(pName) + '&searchtype=pilot&search=Search">'
        + '<img style="vertical-align: middle;" '
        + 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAm0lEQVR42mJkOPafAQsIA+JbQHwBJgAQQEwM2IEREC8BYiGYAEAAsQBxDBBzAPE/qNhXINYEYm0gXgA1/QdAADECrf4AZPAz4AYgxUkAAcTCQBgkAPEHgABiYiAOMAMEEDEKFwNxAUAAgawuwOKZCCD2AeKtQJwOkgMIIBaoY9GBLhCrAHE8EH8HCQAEEC7PnAfilUD8FiYAEGAAzvoZZGXaaC4AAAAASUVORK5CYII="/></a> ';
}
//by Spoilerhead 2006
//licenced by GPL v2 (and only v2!)


// End SPH's clock code
function showFilled(Value) {
    return (Value > 9) ? "" + Value : "0" + Value;
}
function StartClock24() {
    // [{"curTime":1346527601657,"amount":"3","expire":1346538401657}]
// console.log('d1 = ' , new Date(1346527601657).toUTCString());
// console.log('d2 = ' , new Date(1346538401657).toUTCString());
    var dst = 1;
    MTime= new Date();
    MTime.setUTCDate(31);
    MTime.setUTCMonth(3);

    wday=MTime.getDay();

    TheTime = new Date;
    var gmtHours = TheTime.getTimezoneOffset()/60;
    day= TheTime.getUTCDate();
    month=TheTime.getUTCMonth();
    lh=TheTime.getHours();
    dst=0;
    if(lh+gmtHours >= 24) wday+=1;
    if(lh+gmtHours < 0) wday-=1;
    wday=(wday+7)%7;

    dst=2;

    document.getElementById("tim").innerHTML = showFilled( (TheTime.getHours()) % 24) + ":" + showFilled(TheTime.getMinutes()) + ":" + showFilled(TheTime.getSeconds());
    document.getElementById("gmt").innerHTML = showFilled( (TheTime.getHours()+gmtHours) % 24) + ":" + showFilled(TheTime.getMinutes()) + ":" + showFilled(TheTime.getSeconds());
    document.getElementById("ap").innerHTML = showFilled( (0)) + ":" + showFilled(5-TheTime.getMinutes() % 6) + ":" + showFilled(59-TheTime.getSeconds());

    x = TheTime.getMinutes();
    x = x - 25;
    if (x < 0)
    {
        x = x + 60;
        TheTime.setHours(TheTime.getHours()-1);
    }
    TheTime.setMinutes(x);

    TheTime.setHours((TheTime.getHours()+gmtHours-(-dst)+3));
    document.getElementById("bui").innerHTML = showFilled( 5-(TheTime.getHours()%6)) + ":" + showFilled(59-TheTime.getMinutes() ) + ":" + showFilled(59-TheTime.getSeconds());
    document.getElementById("pl").innerHTML = showFilled( 2-((TheTime.getHours()-1+3)%3)) + ":" + showFilled(59-TheTime.getMinutes() ) + ":" + showFilled(59-TheTime.getSeconds());
    document.getElementById("sb").innerHTML = showFilled( 2-((TheTime.getHours()-2+3)%3)) + ":" + showFilled(59-TheTime.getMinutes() ) + ":" + showFilled(59-TheTime.getSeconds());



    setTimeout(StartClock24,1000)
}



function get_time_difference(earlierDate, laterDate)
{
    var oDiff = new Object();

    //  Calculate Differences
    //  -------------------------------------------------------------------  //
//     var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
    var nTotalDiff = laterDate - earlierDate;

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);
    //  -------------------------------------------------------------------  //

    //  Format Duration
    //  -------------------------------------------------------------------  //
    //  Format Hours
    var hourtext = '00';
    if (oDiff.hours > 0){ hourtext = String(oDiff.hours);}
    if (hourtext.length == 1){hourtext = '0' + hourtext};

    //  Format Minutes
    var mintext = '00';
    if (oDiff.minutes > 0){ mintext = String(oDiff.minutes);}
    if (mintext.length == 1) { mintext = '0' + mintext };

    //  Format Seconds
    var sectext = '00';
    if (oDiff.seconds > 0) { sectext = String(oDiff.seconds); }
    if (sectext.length == 1) { sectext = '0' + sectext };

    //  Set Duration
    var sDuration = hourtext + ':' + mintext + ':' + sectext;
    oDiff.duration = sDuration;
    //  -------------------------------------------------------------------  //

    return oDiff;
}
function handleDrugUsage()
{
    var amount = parseInt(this.elements['amount'].value, 10);
    console.log(amount);

    if (parseInt(this.elements['resid'].value, 10) !== 51)
    {
        console.log('this form is not submitting drugs');
        return true;
    }
    if (isNaN(amount))
    {
        console.log('enter a number of drugs ...');
        return false;
    }

    var curTime = new Date().getTime();
    var drugJson = getDrugUsage(curTime);

    drugJson.push({curTime : curTime, amount : amount, expire : (curTime + (60 * 60 * 1000 * amount)) });
    drugJson = JSON.stringify(drugJson);

    GM_setValue(UNIVERSE+'_drugHash', drugJson );

    return true;
}


function getDrugUsage(curTime)
{
    var drugJson = GM_getValue(UNIVERSE+'_drugHash','[]');
    drugJson = (drugJson === '') ? [] : JSON.parse(drugJson);
    if (!drugJson)
    {
        console.log('drug value is corrupt, resetting');
        GM_setValue(UNIVERSE+'_drugHash','[]');
        return [];
    }
    var newDrugHash = [],
        amt = 0,
        drugConsumeTime = 0;

    for (var i = 0; i < drugJson.length; i++)
    {
        amt += parseInt(drugJson[i]['amount'], 10);
        if (drugJson[i]['curTime'] > drugConsumeTime)
        {
            drugConsumeTime = drugJson[i]['curTime'];
        }
    }
    expiretime = (drugConsumeTime + (60 * 60 * 1000 * amt))

    for (var i = 0; i < drugJson.length; i++)
    {
        if (curTime < expiretime && drugJson[i]['expire'] >= (parseInt(curTime,10) + 5 ))
        {
            newDrugHash.push(drugJson[i]);
        }
    }
    GM_setValue(UNIVERSE+'_drugHash', JSON.stringify(newDrugHash) );

    return newDrugHash;
}

	function width2condition(width,style)
{
	var condition = "ERROR";

	if (width > 99)
	{
		if (style == "background-color:green;height:1px;")
		{
			condition = "75+";
		} else {
			condition = "67-74";
		}
	} else {
		condition = width / 1.5;
	}
	return condition;
}

function getPilotInfo(curship, faction)
{
    var pilot = {
        faction: faction || 'n',  // set default to neutral
        ally: '',
        allyId: '',
        pilotName: '',
        pilotId: null,
        friendFoe: '',
    }



    var imgs = curship.querySelectorAll('img')
    var factionRegEx = /sign_(fed|uni|emp)_/;
    for (var j = 0, imglen = imgs.length; j < imglen; j++)
    {
        var faction = imgs[j].getAttribute('src').match(factionRegEx);
        if (faction !== null)
        {
            pilot.faction = faction[1].charAt(0);
            break;
        }
    }
// console.log('looping through pilot info');
    // loop through links to get pilot info
//  /^javascript:scanId\((\d+), "player"\)|^main\.php\?scan_details=(\d+)&scan_type=player/;
    var links = curship.querySelectorAll('a');
    var pilotRegEx = /detail_type=player&detail_id=(\d+)|scan_details=(\d+)&scan_type=player|scanId\((\d+), "player"\)/;
    var allyRegEx = /alliance\.php\?id=(\d+)/;

    for (var l = 0, linklen = links.length; l < linklen; l++)
    {
        var ally = links[l].getAttribute('href').match(allyRegEx);
        if (ally !== null)
        {
            pilot.ally = links[l].textContent;
            pilot.allyId = ally[1];
        }

        var pilotInfo = links[l].getAttribute('href').match(pilotRegEx);
        if (pilotInfo)
        {
            pilot.pilotId = parseInt(pilotInfo[3] || pilotInfo[2] || pilotInfo [1], 10);
            pilot.pilotName = links[l].textContent;
        }
    }

    pilot.friendFoe = checkFriendFoe(
                        pilot.pilotId,
                        pilot.allyId,
                        pilot.faction
    ); //checkFriendFoe(pilot);
    return pilot;
}


return true;
})();