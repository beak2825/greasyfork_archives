// ==UserScript==
// @name           获取Akatsuki玩家的第一名成绩
// @name:en        AkatsukiFirstScoresUserpage
// @namespace      http://tampermonkey.net/
// @version        1.1.1
// @description    给Akatsuki网页添加用户界面第一名的显示
// @description:en Add first scores for Akatsuki Userpage
// @author         TROU2004
// @match          https://akatsuki.pw/*u/*
// @connect        akatsuki.pw
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/397211/%E8%8E%B7%E5%8F%96Akatsuki%E7%8E%A9%E5%AE%B6%E7%9A%84%E7%AC%AC%E4%B8%80%E5%90%8D%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/397211/%E8%8E%B7%E5%8F%96Akatsuki%E7%8E%A9%E5%AE%B6%E7%9A%84%E7%AC%AC%E4%B8%80%E5%90%8D%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

const API_SCORES_FIRST = "https://akatsuki.pw/api/v1/users/scores/first"
const SAYOBOT_DOWNLOAD = "https://osu.sayobot.cn/osu.php?s="
const AKATSUKI_REPLAY_DOWNLOAD = "https://akatsuki.pw/web/replays/"

var scores
var firstScoresTable
var eventTimes = 0
var currentPage = 1
var fsNumberPage = 0
var fsNumber = 0

window.addEventListener("load", function() {
    eventTimes++
    if (eventTimes == 2) {
        return
    }
    this.setTimeout(function() {pullScores(1, true);}, 3000);
    this.setTimeout(function() {beginGetFSNum();}, 3000);
}, false)

function pullScores(page, apply) {
    //根据位置生成Request时所需的参数
    var args = "?mode=0&l=20&rx=1&id=" + getUserID() + "&p=" + page
    //开始Request
    GM_xmlhttpRequest({
        method: "GET",
        url: API_SCORES_FIRST + args, 
        timeout: 5000,
        onload: function(response) {
            scores = JSON.parse(response.responseText).scores
            if (apply) {
                pushScoresToTable()
            }
        }
    });
}

function pushScoresToTable() {
    if (scores == null) {
        return
    }
    if (firstScoresTable == null) {
        createTable()
    }
    var tBody = firstScoresTable.getElementsByTagName("tbody")[0]
    for (let score of scores) {
        var currentTr = document.createElement("tr")
        var tdScore = document.createElement("td")
        var tdPP = document.createElement("td")
        fillTable(score, tdScore, tdPP) //将Score填充到两个td里面
        currentTr.appendChild(tdScore)
        currentTr.appendChild(tdPP)
        currentTr.className = "score-row"
        tBody.appendChild(currentTr)
    }
}

function fillTable(score, tdScore, tdPP) {
    //填充tdPP
    var divPP = document.createElement("div")
    tdPP.appendChild(divPP)
    divPP.style.cssText = "display: inline-flex;justify-content: left;align-items: left;position: relative;bottom: auto;padding: 5px 20px 5px 0px;min-width: 100px;flex: none;font-size: 16px;font-weight: 700;"
    var spanPP = document.createElement("span")
    divPP.appendChild(spanPP)
    var spanPPText = document.createElement("span")
    spanPPText.style.color = "#bfbfbf"
    spanPPText.innerText = "pp"
    spanPPText.style.fontSize = "12px"
    spanPP.title = "Combo: " + score.max_combo + "/" + score.beatmap.max_combo
    spanPP.innerHTML = score.pp.toFixed(2) + spanPPText.outerHTML
    spanPP.style.color = "#f2f2f2"
    var atextDLMap = document.createElement("a")
    divPP.appendChild(atextDLMap)
    atextDLMap.className = "downloadstar"
    atextDLMap.innerHTML = "<i class=\"star icon\"></i>DLMap"
    atextDLMap.style.right = "-70px"
    atextDLMap.style.position = "absolute"
    atextDLMap.href = SAYOBOT_DOWNLOAD + score.beatmap.beatmapset_id
    $(document).keydown(function(event) {
        if (event.keyCode == 17 && atextDLMap.getAttribute("scoreMode") != "true") {
            atextDLMap.setAttribute("scoreMode", "true")
            atextDLMap.href = AKATSUKI_REPLAY_DOWNLOAD + score.id
            atextDLMap.innerHTML = "<i class=\"star icon\"></i>DLRep"
        }
    })
    $(document).keyup(function(event) {
        if (event.keyCode == 17) {
            atextDLMap.setAttribute("scoreMode", "false")
            atextDLMap.href = SAYOBOT_DOWNLOAD + score.beatmap.beatmapset_id
            atextDLMap.innerHTML = "<i class=\"star icon\"></i>DLMap"
        }
    })
    //填充tdScore
    var divScore = document.createElement("div")
    tdScore.appendChild(divScore)
    var imgScoreIcon = document.createElement("img") //Grade Icon
    divScore.appendChild(imgScoreIcon)
    imgScoreIcon.src = getRankIcon(score.rank)
    imgScoreIcon.style.cssText = "float: left;display: block;margin-right: 10px;flex: none;width: 20px; position: relative;top: 8px"
    var divScoreTitle = document.createElement("div") //Title time and difficult
    divScoreTitle.style.float = "left"
    divScore.appendChild(divScoreTitle)
    var atextText = document.createElement("a") //Title
    divScoreTitle.appendChild(atextText)
    atextText.href = "https://akatsuki.pw/b/" + score.beatmap.beatmap_id
    atextText.style.cssText = "color: #fff;font-size: 15px;display: block;align-self: flex-start;max-width: 100%;"
    var titles = getTitles(score.beatmap.song_name)
    atextText.innerText = 
    atextText.innerHTML = titles[0] + " "
    var atextB = atextText.cloneNode(true)
    atextB.style.fontWeight = "bolder"
    atextB.style.cssText = "color: #fff;font-size: 15px;max-width: 100%;font-weight: bolder;"
    atextB.innerText = getScoreMods(score.mods)
    atextText.appendChild(atextB)
    var spanDifficult = document.createElement("span") //Difficult
    divScoreTitle.appendChild(spanDifficult)
    spanDifficult.innerText = titles[1]
    spanDifficult.style.color = "#fedfe1"
    spanDifficult.style.marginTop = "2px"
    spanDifficult.style.position = "relative"
    spanDifficult.title = "Star: " + score.beatmap.difficulty.toFixed(2) + "\nAR: " + score.beatmap.ar + "\nOD: " + score.beatmap.od
    spanDifficult.addEventListener("click", function() {
        copyToClipboard(score.beatmap.beatmap_id)
        var that = this;
        shaking(that,'top')
        shaking(that,'left')
    }, false)
    var spanTime = document.createElement("span")
    divScoreTitle.appendChild(spanTime)
    spanTime.innerText = new Date(score.time).toLocaleString('chinese', { hour12: false });
    spanTime.title = score.time
    spanTime.style.marginTop = "2px"
    spanTime.style.color = "#BDC0BA"
    spanTime.style.position = "relative"
    spanTime.style.right = "-20px"
    spanTime.style.fontWeight = "bold"
    //Acc
    var spanAcc = document.createElement("span")
    var divAcc = document.createElement("div")
    divAcc.style.cssText = divPP.style.cssText
    divAcc.style.position = "absolute"
    divAcc.style.right = "200px"
    divAcc.appendChild(spanAcc)
    divScore.appendChild(divAcc)
    spanAcc.innerText = score.accuracy.toFixed(2) + "%"
    spanAcc.style.color = "#EFBF3A"
    spanAcc.style.fontSize = "16px"
    spanAcc.style.position = "absolute"
    spanAcc.style.top = "9px"
    spanAcc.title = "300: " + score.count_300 + "\n100: " + score.count_100 + "\n50: " + score.count_50 + "\nMiss: " + score.count_miss
}

function createTable() {
    //根据RecentScores复制一个新的FirstScore标签
    var rsUISegment = document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(2)")
    var fsUISegment = rsUISegment.cloneNode(true)
    var parentUISegment = rsUISegment.parentElement
    parentUISegment.appendChild(fsUISegment)
    //更改需要的东西
    fsUISegment.getElementsByClassName("ui header")[0].innerText = "First Places" //Recent scores -> First Places
    firstScoresTable = fsUISegment.getElementsByClassName("ui table score-table blue no bottom margin")[0] //获取创建好的Table
    firstScoresTable.removeAttribute("data-type") //删掉后端支持的data-type="recent"
    $(firstScoresTable.getElementsByTagName("tbody")[0]).empty() //清空tbody里面的表格
    document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(3) > table > thead > tr > th:nth-child(2)").style.width = "18%"
    //设置下面的按钮
    var button = document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(3) > table > tfoot > tr > th > div > a")
    if (scores.length < 20) {
        button.remove()
        return
    }
    button.addEventListener("click", function() {
        currentPage++
        if (scores == null || scores.length < 20) {
            button.remove()
            return
        }
        pullScores(currentPage, true)
    }) //使表格下方按钮使用正常
}

function getUserID() {
    return document.querySelector("#rx-menu > a.\\30 .item").href.substring(22)
}

function getTitles(song_name) {
    var titles = new Array(2)
    titles[0] = song_name.substring(0,song_name.indexOf("[") - 1)
    titles[1] = song_name.substring(titles[0].length + 2, song_name.length - 1) 
    return titles
}

function getRankIcon(grade) {
    var str = grade
    if (grade == "SH") {
        str = "SHD"
    }
    if (grade == "SSH") {
        str = "SSHD"
    }

    return "https://akatsuki.pw/static/ranking-icons/" + str + ".png"
}

function beginGetFSNum() {
    fsNumberPage++
    //根据位置生成Request时所需的参数
    var args = "?mode=0&l=50&rx=1&id=" + getUserID() + "&p=" + fsNumberPage
    //开始Request
    GM_xmlhttpRequest({
        method: "GET",
        url: API_SCORES_FIRST + args, 
        timeout: 5000,
        onload: function(response) {
            var fsScores = JSON.parse(response.responseText).scores
            if (fsScores == null) {
                callback_getCompleted() // 跳出递归
                return
            } else {
                fsNumber += fsScores.length
                beginGetFSNum() //继续递归
            }
        }
    });
}

function callback_getCompleted() {
    if (fsNumber == 0) {
        return
    }
    var title = document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(3) > h2")
    if (title == null) {
        return
    }
    title.innerText += " (Total: " + fsNumber + ")"
}

function copyToClipboard(str) {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', str);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    console.log(input)
    document.body.removeChild(input);
}

//Include
//Source code: https://segmentfault.com/a/1190000015993899
// 获取节点对象的样式属性值
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return window.getComputedStyle(obj,false)[attr];
    }
}

//Include
//Source code: https://segmentfault.com/a/1190000015993899
function shaking(obj,attr,callback){
    var pos = parseInt(getStyle(obj,attr));
    var arr = [];
    var num = 0;
    for(var i=5;i>0;i-=1){
        arr.push(i,-i);
    }
    arr.push(0);
    clearInterval(obj.shaking);
    obj.shaking = setInterval(function(){
        obj.style[attr] = pos + arr[num] + 'px';
        num ++;
        if(num === arr.length){
            clearInterval(obj.shaking);
            callback && callback();
        }
    },50);
}

//Include from Akatsuki-web
//Source code: https://github.com/osuAkatsuki/old-frontend/blob/master/js/user.js
function getScoreMods(m) {
	var r = '';
	var hasNightcore = false;
	if (m & NoFail) {
		r += 'NF, ';
	}
	if (m & Easy) {
		r += 'EZ, ';
	}
	if (m & NoVideo) {
		r += 'NV, ';
	}
	if (m & Hidden) {
		r += 'HD, ';
	}
	if (m & HardRock) {
		r += 'HR, ';
	}
	if (m & SuddenDeath) {
		r += 'SD, ';
	}
	if (m & Nightcore) {
		r += 'NC, ';
		hasNightcore = true;
	}
	if (!hasNightcore && (m & DoubleTime)) {
		r += 'DT, ';
	}
	if (m & Relax) {
		r += 'RX, ';
	}
	if (m & HalfTime) {
		r += 'HT, ';
	}
	if (m & Flashlight) {
		r += 'FL, ';
	}
	if (m & Autoplay) {
		r += 'AP, ';
	}
	if (m & SpunOut) {
		r += 'SO, ';
	}
	if (m & Relax2) {
		r += 'AP, ';
	}
	if (m & Perfect) {
		r += 'PF, ';
	}
	if (m & Key4) {
		r += '4K, ';
	}
	if (m & Key5) {
		r += '5K, ';
	}
	if (m & Key6) {
		r += '6K, ';
	}
	if (m & Key7) {
		r += '7K, ';
	}
	if (m & Key8) {
		r += '8K, ';
	}
	if (m & keyMod) {
		r += '';
	}
	if (m & FadeIn) {
		r += 'FD, ';
	}
	if (m & Random) {
		r += 'RD, ';
	}
	if (m & LastMod) {
		r += 'CN, ';
	}
	if (m & Key9) {
		r += '9K, ';
	}
	if (m & Key10) {
		r += '10K, ';
	}
	if (m & Key1) {
		r += '1K, ';
	}
	if (m & Key3) {
		r += '3K, ';
	}
	if (m & Key2) {
		r += '2K, ';
	}
	if (r.length > 0) {
		return "+ " + r.slice(0, -2);
	} else {
		return '';
	}
}

var None = 0;
var NoFail = 1;
var Easy = 2;
var NoVideo = 4;
var Hidden = 8;
var HardRock = 16;
var SuddenDeath = 32;
var DoubleTime = 64;
var Relax = 128;
var HalfTime = 256;
var Nightcore = 512;
var Flashlight = 1024;
var Autoplay = 2048;
var SpunOut = 4096;
var Relax2 = 8192;
var Perfect = 16384;
var Key4 = 32768;
var Key5 = 65536;
var Key6 = 131072;
var Key7 = 262144;
var Key8 = 524288;
var keyMod = 1015808;
var FadeIn = 1048576;
var Random = 2097152;
var LastMod = 4194304;
var Key9 = 16777216;
var Key10 = 33554432;
var Key1 = 67108864;
var Key3 = 134217728;
var Key2 = 268435456;