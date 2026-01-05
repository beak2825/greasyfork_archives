// ==UserScript==
// @name LWM_ProgressBars
// @name:ru Прогресс персонажа
// @description	Insert level & skill progress bars to home page & player info page.
// @description:ru Добавляет шкалу отображающую процент получения следующего уровня
// @namespace saturn_hwm
// @author saturn573
// @homepage https://greasyfork.org/scripts/2892-lwm-progressbars
// @include https://178.248.235.15/home.php
// @include https://*.lordswm.com/home.php
// @include https://*.heroeswm.ru/home.php
// @include https://178.248.235.15/pl_info.php?id=*
// @include https://*.lordswm.com/pl_info.php?id=*
// @include	https://*.heroeswm.ru/pl_info.php?id=*
// @version 0.33
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/2892/LWM_ProgressBars.user.js
// @updateURL https://update.greasyfork.org/scripts/2892/LWM_ProgressBars.meta.js
// ==/UserScript==

var Scales = [
[0, 1500, 4500, 15E3, 32E3, 9E4, 19E4, 4E5, 86E4, 165E4, 3E6, 5E6, 85E5, 145E5, 25E6, 43E6, 7E7, 108E6, 16E7, 23E7, 325E6, 5E8, 8E8],
 [20, 50, 90, 160, 280, 500, 900, 1600, 2900, 5300, 9600, 17300, 35E3, 7E4],
 [16, 60, 180, 400, 700, 1200, 2E3, 3E3, 4300, 6E3, 8E3, 10500, 13100],
 [90, 180, 360, 720, 1500, 3E3, 5E3, 8E3, 12E3, 17E3, 23E3, 3E4, 38E3, 47E3, 57E3, 7E4, 9E4],
 [10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 800, 1E3, 1300, 2E3, 3E3, 6E3, 1E4, 17E3, 25E3],
 [50, 120, 240, 400, 600, 840, 1200, 2E3, 3E3, 4300, 6E3, 8E3, 10800, 14E3, 17600, 21600, 26E3, 30800, 36600, 43600, 52E3, 65E3],
 [100, 240, 480, 800, 1200, 1680, 2400, 4E3, 6E3, 8600, 12E3, 16E3, 21600],
 [50, 120, 300, 600, 1E3, 1500, 2200, 3E3, 4E3, 5500, 7800, 11E3, 14500, 18200, 22200],
 [150, 350, 750, 1400, 2200, 3200, 4300, 5600, 7E3, 8500, 1E4, 11700, 14500],
 [60, 200, 450, 850, 1500, 2700, 4500, 7200],
 [1600, 3600, 8100],
 [80, 180, 300, 440, 600, 780, 990, 1230, 1500, 2200, 3200, 4500, 7E3, 11E3],
 [30, 80, 165, 310, 555, 970, 1680, 2885, 5770],
 [104, 588, 2200, 7E3, 1E4],
 [8, 29, 71, 155, 295, 505, 799, 1191, 1695, 6E3, 12E3]];

var Styles = '.pb{ display:inline-block; position: relative; width:135px; background:white; border:2px solid; border-radius: 7px/3px; cursor: pointer; }\
	.pb .scale { display: inline; position: absolute; top: 0px; left: 0px; height: 100%; border-radius: 2px/1px; background:#af9f39; background: linear-gradient(to top, #af9f39, #fffbca); }\
	.pb:hover .pb-side-text { display: inline; }\
	.pb:hover .pb-front-text { display: none; }\
	.pb-text { position: relative; width: 100%; height: 100%; color: darkgreen; text-align: center;  font-weight: bold; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }\
	.pb-side-text { display:none; }\
	.pb-front-text { display: inline; }\
	.left { font-size: smaller; }\
	.levelpb { display: inline-flex; margin-left: 10px; width: 180px; } \
	.skill-table { width: 100%; margin-bottom: 10px; }\
	.skill-table caption { text-align: left; }\
	.skill-table caption span { float: right; font-size: small; margin-right: 10; }\
    .key-column { text-align: left; width: 100%; font-variant: small-caps; }\
	.skill-value { font-size: 15px; }\
	.skill-value-complete { color: #af9f39; font-size: 20px; font-weight: bold; font-family: "Comic Sans MS", cursive, sans-serif;  }\
	.skill-value-none { font-weight: normal; }\
	.skill-value-low { color: blue; }\
 	.progress-column { text-align: center; width: 135px; }\
	.expander { margin-left: 5px; border-radius: 8px; height: 16px; width: 16px; font-size: 8px; font-weight:bold; background: gold; background: linear-gradient(to top, #af9f39, #fffbca); border: #af9f39; border-style: outset; border-width: 1px; position: relative; top: -3px; }';

var expandCaption = '>';
var collapseCaption = '<';
var levelStringRU = '\u0411\u043E\u0435\u0432\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C';
var factionsGroupTitleRU = '\u0424\u0440\u0430\u043A\u0446\u0438\u044F';
var guildsGroupTitleRU = '\u0413\u0438\u043B\u044C\u0434\u0438\u044F';
var allRu = '\u043E\u0431\u0449.';
var hoursRu = 'часов';
var daysRu = 'дней';
var weeksRu = 'недель';
var pointsRu = 'очков за';
var pphRu  = 'очков в час';
var averageSpeedRu = 'Средняя скорость';
var tttnlRu = 'Время до следующего уровня';


var pl_id = /pl_id=(\d+)/.exec(document.cookie)[1];
if (~location.pathname.indexOf('pl_info.php')) {
	pl_id = /id=(\d+)/.exec(location.search)[1];
}

function getTrackingState(){
	let result = GM_getValue('pl_' + pl_id);
	if (result) {
		result = JSON.parse(result);
	}
	else {
		result = undefined;
	}
	return result;
}

function startTracking() {
	GM_setValue('pl_' + pl_id, JSON.stringify(currentState));
	alert((isEn() ? 'The tracking was started. Click again to cancel it.'
		: 'Отслеживание начато. Нажмите еще раз чтобы выключить его'));
	location.reload();
}

function stopTracking() {
	if (confirm((isEn()
			? 'The tracking will be stopped immediately as you press the OK button.'
			: 'Отслеживание будет выключено сразу после того как вы нажмете кнопку ОК'))) {
		GM_deleteValue("pl_" + pl_id);
		location.reload();
	}
}

var currentState = { time: new Date().getTime() };
var trackingState = getTrackingState();

function getTimeLabel(hours) {
	if (hours < 24) {
		return hours + ' ' + (isEn() ? 'hours' : hoursRu);
	}
	else {
		var days = parseInt(hours / 24);
		if (days < 7) {
			return days + ' ' + (isEn() ? 'days' : daysRu)
				+ ' ' + (hours % 24) + ' ' + (isEn() ? 'hours' : hoursRu);
		}
		else {
			return '~' + parseInt(days / 7) + ' ' + (isEn() ? 'weeks' : weeksRu);
		}
	}
}

function getTrackingInfoString(caption, left) {
	let delta = currentState[caption];
    if (trackingState[caption]) {
        delta -= trackingState[caption];
    }
	let elapsedHours = Math.floor((currentState.time - trackingState.time) / 36E5);
	let speed = delta / elapsedHours;
	return delta.toFixed(2)
	+ ' ' + (isEn() ? 'points in' : pointsRu) + ' '
	+ getTimeLabel(elapsedHours)
	+ ((elapsedHours > 0 && delta > 0)
		? ' \r\n'
			+ (isEn() ? 'Average speed' : averageSpeedRu)
			+ ': ' + speed.toFixed(2) + ' '
			+ (isEn() ? 'points per hour' : pphRu)
			+ '\r\n'
			+ (isEn() ? 'Time to the next level' : tttnlRu)
			+ ': ' + getTimeLabel(Math.floor(left / speed))
		: '');
}


function round(value, precision) {
    if (precision > 0) {
        var b = precision * 10;
        return Math.round(value * b) / b;
    }
    else {
        return Math.floor(value);
    }
}

function parseSourceCode(source) {
    var captions = [];
    var match;
    var cr = /((?:[a-z'\u0430-\u044F\u0451]+\s)?[a-z\u0430-\u044F\u0451]+):\s/gi;
    while ((match = cr.exec(source)) != null) {
        captions.push({ Index: cr.lastIndex, Value: match[0].toString() });
    }
    var getCaption = function (index) {
        for (var ii = captions.length - 1; ii >= 0; ii--) {
            if (captions[ii].Index < index) {
                return captions[ii].Value;
            }
        }
        return null;
    }

    var result = [];
    var sr = /(?:\s|>)(\d+)(<\/b>|<\/a>)?\s\((\d+(?:\.\d+)?)\)/g;
    while ((match = sr.exec(source)) != null) {
		let item = {
            Caption: getCaption(sr.lastIndex),
            Level: +match[1].toString(),
            Score: +match[3].toString(),
            Sign: match[2]
        };
		currentState[item.Caption] = item.Score;
        result.push(item);
    }
    return result;
}

function addStyles() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(Styles));
    document.head.appendChild(style);
}

function checkScale(scale) {
    if (scale && scale.length > 0) {
        if (scale.length > 1) {
            for (var ii = 1; ii < scale.length; ii++) {
                if (scale[ii] <= scale[ii - 1]) {
                    return false;
                }
            }
        }
        return true;
    }
}

function createProgressBar(points, left, percentage, title) {
    var percentageString = Math.floor(percentage) + '%';

    var border = document.createElement('div');
    border.className = 'pb';

    var scale = document.createElement('div');
    scale.className = 'scale';
    scale.style.width = percentageString;
    border.appendChild(scale);

    var textBox = document.createElement('div');
    textBox.className = 'pb-text';

    var frontText = document.createElement('span');
    frontText.className = 'pb-front-text';
    frontText.appendChild(document.createTextNode(percentageString));
    textBox.appendChild(frontText);

    var sideText = document.createElement('span');
    sideText.className = 'pb-side-text';
    sideText.appendChild(document.createTextNode(points));

    var l = document.createElement('span');
    l.className = 'left';
    l.appendChild(document.createTextNode('+' + left));
    sideText.appendChild(l);
    textBox.appendChild(sideText);

    border.appendChild(textBox);

	if (title) {
		if (trackingState) {
			border.title =  getTrackingInfoString(title, left);
			border.addEventListener('click', stopTracking);
		}
		else {
			border.title = isEn()
				? 'Click to start tracking'
				: 'Нажмите чтобы начать отслеживание';
			border.addEventListener('click', startTracking);
		}
	}
    return border;
}

function getScoreRange(score, scale) {
    if (!checkScale(scale)) {
        return;
    }

    var initialValue = 0;
    var finalValue = score;
    var level = 0;
    for (var ii = 0; ii < scale.length; ii++) {
        if (score >= scale[ii]) {
            initialValue = scale[ii];
        }
        else {
            finalValue = scale[ii];
            level = ii;
            break;
        }
    }
    return { Initial: initialValue, Final: finalValue, Level: level };
}

function getProgressPercentage(range, score) {
    if (range) {
        return (score - range.Initial) * 100 / (range.Final - range.Initial);
    }
    return 0;
}

function getScale(index) {
    return Scales[index];
}

function getCaption(value, exclude) {
    if (exclude) {
        var r = new RegExp(exclude, 'i');
        return value.Caption.replace(r, '');
    }
    return value.Caption;
}

function createRow(value, scaleIndex, excludeCaption) {
    var scale = getScale(scaleIndex);
    var range = getScoreRange(value.Score, scale);
    if (!range) {
        alert(JSON.stringify(value) + ' : ' + scaleIndex + ' - ' + excludeCaption);
    }

    var row = document.createElement('tr');
    var c1 = document.createElement('td');
    c1.className = 'key-column';
    if (scaleIndex == 1 && value.Sign) {
        c1.style = 'font-weight: bold; text-decoration:underline; ';
    }
    c1.appendChild(document.createTextNode(getCaption(value, excludeCaption)));
    var lb = document.createElement('b');
    lb.className = 'skill-value';
    lb.appendChild(document.createTextNode(value.Level));
    if (value.Score >= range.Final) {
        lb.className = 'skill-value-complete';
    }
    else if (!value.Score) {
        lb.className = 'skill-value-none';
    }
    c1.appendChild(lb);
    row.appendChild(c1);
    var c2 = document.createElement('td');
    c2.className = 'progress-column';
    if (value.Score == 0) {
        c2.appendChild(document.createTextNode('-'));
    }
    else if (value.Score >= range.Final) {
        c2.appendChild(document.createTextNode(value.Score));
    }
    else {
        var percentage = getProgressPercentage(range, value.Score);

        var points = value.Score;
        var left = round(range.Final - value.Score, 1);

        if (range.Level > value.Level) {
            percentage = 100;
            left = '0.1';
            var rl = document.createElement('small');
            rl.innerHTML = -(range.Level - value.Level);
            lb.className = 'skill-value-low';
            c1.appendChild(rl);
        }
        var pb = createProgressBar(points, left, percentage, value.Caption);
        c2.appendChild(pb);
    }
    row.appendChild(c2);
    return row;
}

function createExpanderButton() {
    var cb = document.createElement('input');
    cb.type = 'button';
    cb.value = expandCaption;
    cb.className = 'expander';
    cb.collapsed = true;
    cb.onclick = function (event) {
        var r = this.parentNode.parentNode;
        var display = this.collapsed ? '' : 'none';
        r.nextSibling.style.display = display;
        r.nextSibling.nextSibling.style.display = display;
        r.nextSibling.nextSibling.nextSibling.style.display = display;
        this.collapsed = !this.collapsed;
        this.value = this.collapsed ? expandCaption : collapseCaption;
    };
    return cb;
}

function insertExpander(table) {
    var row = table.lastChild;
    for (var ii = 0; ii < 3; ii++) {
        row.firstChild.style = 'padding-left: 15px;';
        row.style.display = 'none';
        row = row.previousSibling;
    }
    row.firstChild.appendChild(createExpanderButton());
}

function isEn() {
    return /^www\.lordswm\.com/.test(location.host);
}

function replaceSkills() {
    var home = document.getElementById('home_2');
    if (home) {
        var createSkillTable = function(caption) {
            var result = document.createElement('table');
            result.className = 'skill-table';
            var cpt = document.createElement('caption');
            cpt.appendChild(document.createTextNode(caption));
            result.appendChild(cpt);
            return result;
        }

        var mainNode = home.parentNode;
        var items = parseSourceCode(mainNode.innerHTML.toString());

        var range = document.createRange();
        range.selectNodeContents(mainNode);
        range.deleteContents();

        var t = createSkillTable(isEn() ? 'Factions' : factionsGroupTitleRU);
        var excludeCaption;
        var ii = 0;
        var gi = 0;
        var faction = true;
        var factionPoints = 0;
        do {
            if (faction && (~items[ii].Caption.indexOf(isEn() ? 'guild' : '\u0413\u0438\u043B\u044C\u0434\u0438\u044F'))) {
                faction = false;
                gi = ii;
                var sum = document.createElement('span');
                sum.appendChild(document.createTextNode(' \u03A3'));
                var sub = document.createElement('sub');
                sub.appendChild(document.createTextNode(isEn() ? 'all' : allRu));
                sum.appendChild(sub);
                sum.appendChild(document.createTextNode('= ' + round(factionPoints, 2)));
                t.firstChild.appendChild(sum);
                mainNode.appendChild(t);
                t = createSkillTable(isEn() ? 'Guilds' : guildsGroupTitleRU);
                excludeCaption = "('\\sguild)|(" + guildsGroupTitleRU + ')';
                mainNode.appendChild(t);
            }
            if (faction) {
                factionPoints += items[ii].Score;
            }
            t.appendChild(createRow(items[ii], (faction ? 1 : Math.min(Scales.length - 1, (ii - gi) + 2)), excludeCaption));
            ii++;
        }
        while (ii < items.length - 2);
        insertExpander(t);
        mainNode.appendChild(t);
    }
}

function getLevelPoints(points) {
    var r = /\(([\d\,]+)\)(?:\s\+(-?[\d\,]+))?/;
    var m = r.exec(points)
    if (m) {
        return { Points: m[1].replace(/,/g, ''), Left: (m[2] ? m[2].replace(/,/g, '') : 0) }
    }
}

function insertLevelUpProgressBar() {
    var bs = document.getElementsByTagName('b');
    var lbReg = new RegExp('(?:Combat\\slevel|' + levelStringRU + '):\\s(\\d+)');
    for (var ii = 0; ii < bs.length; ii++) {
        var b = bs[ii];
        var m = lbReg.exec(b.innerHTML);
        if (m) {
            var start = b.nextSibling;
            var end = start;
            do {
                end = end.nextSibling;
            }
            while (end && (!end.tagName || end.tagName.toLowerCase() != 'br'));
            var next = end.nextSibling;
            if (end) {
                var pointsText;
                var range = document.createRange();
                range.setStart(start, 0);
                range.setEnd(end, 0);
                pointsText = range.toString();
                var lvl = getLevelPoints(range.toString());
                if (lvl) {
                    var r = getScoreRange(lvl.Points, getScale(0));
                    if (r && r.Final > lvl.Points) {
                        var percentage = getProgressPercentage(r, lvl.Points);
                        if (r.Level > m[1]) {
                            b.appendChild(document.createTextNode('+'));
                            percentage = 100;
                        }
						currentState.level = lvl.Points;
                        var pb = createProgressBar(lvl.Points, lvl.Left, percentage, 'level');
                        pb.className += ' levelpb';
                        b.parentNode.insertBefore(pb, b.nextSibling);
                        range.deleteContents();
                    }
                }
                range.detach();
                break;
            }
        }
    }
}

addStyles(); insertLevelUpProgressBar(); replaceSkills();