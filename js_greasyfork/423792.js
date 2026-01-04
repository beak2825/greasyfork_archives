// ==UserScript==
// @name         Atlantis GameData hyperlinks
// @namespace    http://atlantis-pbem.com/data
// @version      0.010
// @description  Add hyperlinks to GameData
// @author       Anton
// @match        http://atlantis-pbem.com/data
// @match        http://atlantis-pbem.com/times*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423792/Atlantis%20GameData%20hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/423792/Atlantis%20GameData%20hyperlinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptName = "Atlantis GameData hyperlinks:";

    let GMAddStyle = (typeof GM_addStyle == 'function') ? GM_addStyle : function (aCss) {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };

GMAddStyle(`
.gameDataMenu {
  position: fixed;
  right: 0;
  top: 100px;
  width: 350px;
  border-top: 1px solid #CCC;
  border-left: 1px solid #CCC;
  border-bottom: 1px solid #CCC;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 8px;
  background: rgba(255,255,255,0.75);
}
.gameDataMenu > a {
  display: block;
}
.gameDataLink, pre > a.mainlink {
  position: relative;
  top: -80px;
}
#skills-ph, #items-ph, #objects-ph, #infopanel {
  padding-left: 8px;
  font-size: 70%;
}
#filtr {
  margin-left: 8px;
  padding: 1px;
  border: 1px solid #CCC;
}
.gameDataHidden {
  display: none;
}
`);

    let shipTable =
`Ship       Capacity  Speed  Cost/skill    Crew  Mages  Defence
Longship   150       4      10/1          4      -     -
Raft       450       2      10/1          2      -     -
Cog        750       4      25/2          6      -     -
Galleon    2700      4      75/3          15     1     -
Galley     1200      4      50/3 IRWD     12     2     2 (120 men)
Corsair    1500      5      50/4          15     -     -
Balloon    100       4/fly  20/4 FLOA     3      1     -
Airship    800       4/fly  60+60/5 FLOA  10     2     -
Cloudship  1500      4/fly  75 IRWD+FLOA  15     5     3 (140 men)`.split("\n");

    let isData = window.location.pathname.toLowerCase().replace('/','') == "data";
    let isTimes = window.location.pathname.toLowerCase().replace('/','').indexOf("times") == 0;

    let body = document.querySelector('body');

    let controlPanel = document.createElement('div');
    controlPanel.className = 'gameDataMenu';
    body.append(controlPanel);

    let timesControllerInit = () => {
        controlPanel.innerHTML = `
<div><label for="filtr">Search: </label><input id="filtr" type="text"></div>
<a href="#top-agdhl">Top</a>
<a href="#quests">Quests</a>
<a href="#articles">Articles</a>
<a href="#rumors">Rumors</a>
<div id="infopanel"></div>
`;
        let container = document.querySelector('div.container.my-5');
        container.style.paddingRight = '350px';

        let paragraphs = container.querySelectorAll('h2');

        // Add links to paragraphs
        if (paragraphs.length == 4) {
            let addLinkToParapgraph = (pp, idx, linkName) => {
                pp[idx].outerHTML = '<a class="gameDataLink" name="' + linkName + '"></a>' + pp[idx].outerHTML
            };
            addLinkToParapgraph(paragraphs, 0, 'top-agdhl');
            addLinkToParapgraph(paragraphs, 1, 'quests');
            addLinkToParapgraph(paragraphs, 2, 'articles');
            addLinkToParapgraph(paragraphs, 3, 'rumors');
        } else {
            console.log(scriptName, "Paragraphs not found!");
        }

        // Fix events
        let events = container.querySelector('pre').parentNode;
        events.style.fontSize = '14px';

        let messages = container.querySelectorAll('.jumbotron');

        // fill info panel
        let infopanel = document.getElementById('infopanel');
        for (let i = 0; i < messages.length; i++) {
            let txt = messages[i].innerText.toLowerCase();
            if (txt.indexOf('players have visited') != -1 && txt.indexOf('of all inhabited regions') != -1) {
                let percentInfo = txt.split(' ').filter(e => e.indexOf('%') != -1);
                if (percentInfo.length > 0) percentInfo = percentInfo[0];
                infopanel.innerHTML += 'Map: ' + percentInfo + '<br/>';
            }
        }
        let allMessagesIncludingParagraph = container.querySelectorAll('div.jumbotron,h2');
        let questsCount = -2;
        for (let i = 0; i < allMessagesIncludingParagraph.length; i++) {
            if (questsCount < 0 && allMessagesIncludingParagraph[i].tagName == 'H2') questsCount++;
            else if (questsCount >= 0) {
                if (allMessagesIncludingParagraph[i].tagName == 'H2') break; else questsCount++;
            }
        }
        infopanel.innerHTML += 'Quests: ' + questsCount + '<br/>';

        let updateLists = (s) => {
            s = s.toLowerCase().trim();
            for (let i = 0; i < messages.length; i++) {
                let txt = messages[i].innerText.toLowerCase();
                messages[i].classList.toggle('gameDataHidden', txt.indexOf(s) == -1);
            }
            events.classList.toggle('gameDataHidden', s != '');
        };

        let inp = document.querySelector('#filtr');
        inp.onkeyup = (e) => {
            updateLists(String(inp.value).toUpperCase());
        };
    };

    let dataControllerInit = () => {
        let container = document.querySelector('pre');
        let data = container.innerHTML;
        let dataLines = data.split(/\r?\n/);

        let shipbuilding1Line = dataLines.findIndex(e => e.indexOf('shipbuilding [SHIP] 2') != -1);

        let skillReportLine = dataLines.indexOf("Skill reports:");
        let itemReportLine = dataLines.indexOf("Item reports:");
        let objectReportLine = dataLines.indexOf("Object reports:");

        controlPanel.innerHTML = `
<div><label for="filtr">Search: </label><input id="filtr" type="text"></div>
<a href="#skills">Skills</a>
<div id="skills-ph"></div>
<a href="#items">Items</a>
<div id="items-ph"></div>
<a href="#objects">Objects</a>
<div id="objects-ph"></div>
`;
        body.append(controlPanel);

        let skillsArray = [];
        let itemsArray = [];
        let objectsArray = [];
        let skillsDescription = {};
        let itemsDescription = {};
        let objectsDescription = {};
        let skillsDesc = {};
        let itemsDesc = {};
        let objectsDesc = {}; // inside: {name, desc}

        let addToArray = (arr, key, item) => {
            if (arr != '' && key != '') {
                if (!arr[key]) arr[key] = [];
                if (arr[key].indexOf(item) == -1) arr[key].push(item);
            }
        };

        let analyzePart = (s, run, prevSkill, prevItem, prevObject) => {
            let parts = s.match(/(.*)(\[(.{3,5})\])(.*)/);
            if (parts && parts.length > 0) {
                let skillAddon = (skillsArray.indexOf(parts[3] + '1') != -1) ? '1' : '';
                addToArray(skillsDescription, prevSkill, parts[3] + skillAddon);
                addToArray(itemsDescription, prevItem, parts[3]);
                addToArray(objectsDescription, prevObject, parts[3]);
                return analyzePart(parts[1], run, prevSkill, prevItem, prevObject) +
                    '<a href="#' + parts[3] + skillAddon + '">' + parts[2] + '</a>' + analyzePart(parts[4], run, prevSkill, prevItem, prevObject);
            }
            return s;
        };

        let clearName = (s) => {
            return s.replaceAll(' ', '_').replaceAll("'", '');
        };

        for (let run = 0; run < 2; run++) {
            let prevLine = '';
            let prevSkill = '';
            let prevItem = '';
            let prevObject = '';
            for (let i = 0; i < dataLines.length; i++) {
                let str = dataLines[i];
                // mining [MINI] 3: A unit with this skill may PRODUCE mithril [MITH] at
                let searchForName = str.match(/(\S.*)(\[(.{3,5})\].(\d)):(.*)/);
                if (searchForName && searchForName.length > 0 && prevLine.trim() == '') {
                    let firstPart = searchForName[1]; // mining
                    let linkText = searchForName[2]; // [MINI] 3
                    let name = searchForName[3]; // MINI
                    let level = parseInt(searchForName[4]); // 3
                    let lastPart = searchForName[5]; // A unit with this skill may PRODUCE mithril [MITH] at
                    let linkName = name + level;
                    prevSkill = name + '1';
                    prevItem = '';
                    prevObject = '';
                    if (skillsArray.indexOf(linkName) == -1) {
                        skillsArray.push(linkName);
                        lastPart = analyzePart(lastPart, run, prevSkill, prevItem, prevObject);
                        dataLines[i] = firstPart + '<a class="mainlink" name="' + linkName + '"></a>' + linkText + ':' + lastPart;
                    }
                } else {
                    // winged horse [WING], weight 50, walking capacity 20, riding capacity
                    searchForName = str.match(/(\S.*)(\[(.{3,5})\])[,\.](.*)/);
                    if (searchForName && searchForName.length > 0 && prevLine.trim() == '') {
                        let firstPart = searchForName[1]; // winged horse
                        let linkText = searchForName[2]; // [WING]
                        let name = searchForName[3]; // WING
                        let lastPart = searchForName[4]; // weight 50, walking capacity 20, riding capacity
                        let linkName = name;
                        prevSkill = '';
                        prevItem = name;
                        prevObject = '';
                        if (itemsArray.indexOf(linkName) == -1) {
                            itemsArray.push(linkName);
                            lastPart = analyzePart(lastPart, run, prevSkill, prevItem, prevObject);
                            dataLines[i] = firstPart + '<a class="mainlink" name="' + linkName + '"></a>' + linkText + ',' + lastPart;
                        }
                    } else {
                        // Magician's Tower: This is a building. Monsters can potentially lair in
                        searchForName = str.match(/^(.+):(.+)/);
                        if (searchForName && searchForName.length > 0 && prevLine.trim() == '' && run == 0) {
                            let name = searchForName[1]; // Magician's Tower
                            let lastPart = searchForName[2]; // This is a building. Monsters can potentially lair in
                            let linkName = clearName(name);
                            prevSkill = '';
                            prevItem = '';
                            prevObject = name;
                            if (objectsArray.indexOf(linkName) == -1) {
                                objectsArray.push(linkName);
                                lastPart = analyzePart(lastPart, run, prevSkill, prevItem, prevObject);
                                dataLines[i] = '<a class="mainlink" name="' + linkName + '"></a>' + name + ':' + lastPart;
                            }
                        } else {
                            if (run == 1) dataLines[i] = analyzePart(str, run, prevSkill, prevItem, prevObject);
                        }
                    }
                }
                if (str.trim() == '') {
                    prevSkill = '';
                    prevItem = '';
                } else if (prevSkill != '' && run == 0) {
                    if (!skillsDesc[prevSkill]) skillsDesc[prevSkill] = str.trim().toUpperCase();
                    else skillsDesc[prevSkill] += ' ' + str.trim().toUpperCase();
                } else if (prevItem != '' && run == 0) {
                    if (!itemsDesc[prevItem]) itemsDesc[prevItem] = str.trim().toUpperCase();
                    else itemsDesc[prevItem] += ' ' + str.trim().toUpperCase();
                } else if (prevObject != '' && run == 0) {
                    let obj_id = clearName(prevObject);
                    if (!objectsDesc[obj_id]) objectsDesc[obj_id] = {desc: str.trim().toUpperCase(), name: prevObject};
                    else objectsDesc[obj_id].desc += ' ' + str.trim().toUpperCase();
                }
                prevLine = str;
            }
        }

        dataLines[skillReportLine] = '<a name="skills" class="gameDataLink"></a>Skill reports:';
        dataLines[itemReportLine] = '<a name="items" class="gameDataLink"></a>Item reports:';
        dataLines[objectReportLine] = '<a name="objects" class="gameDataLink"></a>Object reports:';

        // add shipbuilding description of possible ships
        dataLines.splice(shipbuilding1Line, 0, "");
        for (let i = 0; i < shipTable.length; i++) {
            dataLines.splice(shipbuilding1Line, 0, shipTable[shipTable.length - i - 1]);
        }

        container.innerHTML = dataLines.join("\n");

        let skillHasObject = (skil, filterValue) => {
            let found = skillsDescription[skil] && !!(skillsDescription[skil].find(o => o.indexOf(filterValue) != -1));
            let foundInDesc = skillsDesc[skil] && skillsDesc[skil].indexOf(filterValue) != -1;
            return found || foundInDesc;
        };

        let objectHasSkill = (ob, filterValue) => {
            let found = itemsDescription[ob] && !!(itemsDescription[ob].find(o => o.indexOf(filterValue) != -1));
            let foundInDesc = itemsDesc[ob] && itemsDesc[ob].indexOf(filterValue) != -1;
            return found || foundInDesc;
        };

        let objectHasDescription = (ob, filterValue) => {
            let foundInDesc = objectsDesc[ob].desc && objectsDesc[ob].desc.indexOf(filterValue) != -1;
            return foundInDesc;
        };

        let skillsPH = document.querySelector('#skills-ph');
        let itemsPH = document.querySelector('#items-ph');
        let objectsPH = document.querySelector('#objects-ph');

        let updateLists = (filterValue) => {
            skillsPH.innerHTML = skillsArray
                .filter(e => e[e.length - 1] == 1)
                .filter(e => e.indexOf(filterValue) != -1 || skillHasObject(e, filterValue))
                .map(e => e.substr(0, e.length - 1))
                .map(e => '<a href="#' + e + '1">' + e + '</a>')
                .join(', ');

            itemsPH.innerHTML = itemsArray
                .filter(e => e.indexOf(filterValue) != -1 || objectHasSkill(e, filterValue))
                .map(e => '<a href="#' + e + '">' + e + '</a>')
                .join(', ');

            if (filterValue.trim() == '') objectsPH.innerHTML = '';
            else {
                objectsPH.innerHTML = objectsArray
                    .filter(e => objectHasDescription(e, filterValue))
                    .map(e => '<a href="#' + clearName(e) + '">' + objectsDesc[e].name + '</a>')
                    .join(', ');
            }
        }

        updateLists('');

        let inp = document.querySelector('#filtr');
        inp.onkeyup = (e) => {
            updateLists(String(inp.value).toUpperCase());
        };
    };

    if (isData) dataControllerInit();
    if (isTimes) timesControllerInit();

    console.log(scriptName, 'hello.');
})();