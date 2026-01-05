// ==UserScript==
// @author seriych
// @creator seriych
// @config Tracks_Destroyer
// @name WoWsForumStats
// @version 2016.03.09.6
// @description Shows users statistics at worldofwarships.ru forum
// @include http://forum.worldofwarships.ru/index.php?/forum/*
// @include http://forum.worldofwarships.ru/index.php?/topic/*
// @include http://forum.worldofwarships.ru/index.php?/user/*
// @match http://forum.worldofwarships.ru/index.php?/forum/*
// @match http://forum.worldofwarships.ru/index.php?/topic/*
// @match http://forum.worldofwarships.ru/index.php?/user/*
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/18207
// @downloadURL https://update.greasyfork.org/scripts/13146/WoWsForumStats.user.js
// @updateURL https://update.greasyfork.org/scripts/13146/WoWsForumStats.meta.js
// ==/UserScript==

// Цвета статистики
var statcolors = {
    undef:        "#000000",   // неопределенно   undefined
    very_bad:     "#FE0E00",   // очень плохо     very bad
    bad:          "#FE7903",   // плохо           bad
    normal:       "#BBAA00",   // средне          normal
    good:         "#00AA00",   // хорошо          good
    very_good:    "#00AACC",   // очень хорошо    very good
    unique:       "#D042F3"    // уникально       unique
}

var api_key = '';
var domen = '';
var cluster = '';
if ( ~String(window.location).indexOf("forum.worldofwarships.ru") ) {
    api_key = "656cc5c406ca53a554026277f4b42fdd";
    domen = "ru";
    cluster = "ru";
} 

// скрипт запроса в API
/* Requires _opera-xdr-engine.js to handle script-based requests in Opera*/
var xdr = {
    reqId: 0,
        req: {},
        prepareUrl: function (url) {
            return url;
        },
        xget: function (url, onDone) {
            url = this.prepareUrl(url);
            if (window.opera && window.opera.defineMagicVariable) {
                this.scriptTransport(url, onDone);
            } else if (/Chrome/.test(navigator.userAgent) && chrome && chrome.extension) {
                this.xhrTransport(url, onDone);
            } else if (GM_xmlhttpRequest) {
                this.GMTransport(url, onDone);
            } else {
                var currentReqId = this.reqId++;
                this.req[currentReqId].handleJSONP = onDone;

                this.JSONPTransport(url, "xdr.req[" + currentReqId
                    + "].handleJSONP");
            }
        },
        scriptTransport: function (url, onDone) {
            var t = document.createElement("script");
            t.src = url;
            t._callback = onDone;
            document.body.appendChild(t);
        },
        xhrTransport: function (url, onDone) {
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        onDone(req.responseText);
                    }
                }
            };
            req.send();
        },
        GMTransport: function (url, onDone) {
            setTimeout(function () {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (x) {
                        var o = x.responseText;
                        if (onDone) {
                            onDone(o);
                        }
                    }
                });
            }, 0);

        },
        JSONPTransport: function (url, callbackName) {
            if (callbackName && typeof callbackName === "string") {
                url += "&callback=" + callbackName;
            }
            var t = document.createElement("script");
            t.src = url;
            document.body.appendChild(t);
        }
    };

// Запрос онлайна

// Выполняем обработку, если мы на форуме
if ( (~String(window.location).indexOf('forum.worldofwarships.' + domen + '/index.php?/forum/')) || (~String(window.location).indexOf('forum.worldofwarships.' + domen + '/index.php?/topic/')) ) {
    var Btopic = true;
    // находим все сообщения на странице
    if ( ~String(window.location).indexOf('forum.worldofwarships.' + domen + '/index.php?/forum/') ) {
        Btopic = false;
        var Apostclass0 = document.getElementsByClassName("desc lighter blend_links");
        var Apostclass = [];
        for (var i=0; i<Apostclass0.length; i++ )
            if (Apostclass0[i].innerHTML.indexOf('index.php?/user/')>0)
                Apostclass.push(Apostclass0[i]);
    } else if ( ~String(window.location).indexOf('forum.worldofwarships.' + domen + '/index.php?/topic/') ) {
        var Apostclass0 = document.getElementsByClassName("post_wrap");
        var Apostclass1 = document.getElementsByClassName("post_wrap__wg");
        var Apostclass = [];
        for (var i=0; i<Apostclass0.length; i++ )
            Apostclass.push(Apostclass0[i]);
        for (var i=0; i<Apostclass1.length; i++ )
            Apostclass.push(Apostclass1[i]);
    }
    var Nposts = Apostclass.length;
	//alert(Nposts);
    if ( Nposts>0 ) {
        var base = {
            ids: [],
            nums: [],
            stats: []
        };
        // в каждом сообщении ищем автора и запоминаем его id и номер сообщения
        for (i=0; i<Nposts; i++) {
            if (Btopic)
                var id = Apostclass[i].getElementsByClassName("author")[0].innerHTML;
            else
                var id = Apostclass[i].innerHTML;
			//alert(id);
            if ( !~id.indexOf("href=") )
                id = '';
            else {
                id = id.slice(id.indexOf("href=") + 52 + String(domen).length);
                id = id.slice(0, id.indexOf("/"));
                id = /-([0-9]+)$/.exec(id)[1];
            }
            if ( id.length>0 ) {
                var index = base.ids.indexOf(id);
                if ( index>-1 )
                    base.nums[index].push(i);
                else {
                    base.ids.push(id);
                    base.nums.push([i]);
                }
            }
        }
        // формируем строку id для запроса в API
        var IDstring = base.ids.join(',');
		//alert(IDstring);
        // запрос информации о юзерах в API
        if ( IDstring.length>0 )
            xdr.xget("http://api.worldofwarships." + domen + "/wows/account/info/?application_id=" + api_key + "&fields=nickname,karma,statistics.pvp.battles,statistics.pvp.damage_dealt,statistics.pvp.draws,statistics.pvp.wins&account_id="+IDstring, outWGStatForum);
    }
}

// Получаем список топ кланов
function outWGtopclans(response) {
    var top_clans = eval('(' + response + ')');
    for (var i=0; i<clbase.ids.length; i++) {
		var egm = top_clans.data[clbase.ids[i]].elo_rating_gm.rank;
		var esh = top_clans.data[clbase.ids[i]].elo_rating_fb.rank;
		for (var j=0; j<clbase.nums[i].length; j++) {
			var Aitems = Ainfo[clbase.nums[i][j]].getElementsByClassName("desc lighter");
			var item = Aitems[Aitems.length-2];
			var segm = '';
			var sesh = '';
			if ( egm!=null && egm<=500 )
				segm = 'eGM: <b>' + "<a href='http://ru.wargaming.net/clans/leaderboards/#ratingssearch&offset=0&limit=100&order=-egm&timeframe=all&clan_id=" + clbase.ids[i] + "' target='_blank' title='wargaming'>" + 'top' + egm + '</a></b> ';
			if ( esh!=null && esh<=500 )
				sesh = 'eSH: <b>' + "<a href='http://ru.wargaming.net/clans/leaderboards/#ratingssearch&offset=0&limit=100&order=-esh&timeframe=all&clan_id=" + clbase.ids[i] + "' target='_blank' title='wargaming'>" + 'top' + esh + '</a></b>';
			item.innerHTML += '<br><span style="color: #000;">' + segm + sesh + '</span>';
		}
	}
}

// обработка информации из API о юзерах
function outWGStatForum(response) {
    var api_resp = eval('(' + response + ')');
    // обрабатываем стату
    for (var id in api_resp.data)
		if ( api_resp.data[id] != null ) {
			var battles = api_resp.data[id].statistics.pvp.battles;
			if (battles > 0) {
                var wins        = api_resp.data[id].statistics.pvp.wins;
				var draws       = api_resp.data[id].statistics.pvp.draws;
				var damage      = api_resp.data[id].statistics.pvp.damage_dealt;
				var points      = api_resp.data[id].statistics.pvp.wins + api_resp.data[id].statistics.pvp.draws/2;
				var nickname    = api_resp.data[id].nickname;
                var karma       = api_resp.data[id].karma;
				var winrate     = 100.0*wins/battles;
				var   drate     = 100.0*draws/battles;
				var admg     = damage/battles;
				var   prate     = 100.0*points/battles;
				if ( battles<9950 )
					var kb = ((0.0+battles)/1000).toFixed(1);
				else
					var kb = ((0.0+battles)/1000).toFixed(0);
				if ( kadmg<9950 )
					var kadmg = ((0.0+admg)/1000).toFixed(1);
				else
					var kadmg = ((0.0+admg)/1000).toFixed(0);
				// формируем строку статы
				if (domen == 'ru')
					stat_string = "<b><a href='http://vzhabin.ru/US_WoWsStatInfo/?realm_search=ru&nickname=" +  nickname +"' target='_blank' title='WoWsStatInfo'><font color='black'> " + '&#x1f44d;' + karma + '</font></a>&nbsp;&nbsp;&nbsp;' + "<a href='http://worldofwarships.ru/ru/community/accounts/" +  id + "-/" +"' target='_blank' title='Профиль'><font color='black'> " + '&#9876;' + '<font color="' + CalcBatColor(battles) + '">' + battles + '</font>&#9876;</a>&nbsp;&nbsp;&nbsp;' + "<a href='http://ru.wows-numbers.com/player/" + id + "," + nickname + "/" +"' target='_blank' title='wows-numbers.com'><font color='black'> " + '<font color="' + CalcAvDColor(admg) + '">'+ kadmg + 'k</a>&nbsp;' + "<a href='http://proships.ru/stat/user/" + nickname + "' target='_blank' title='z1ooo_stats'><font color='black'> " + '<font color="' + CalcWrColor(winrate) + '">' + winrate.toFixed(1) + '%</font></a></b>';
				// вставляем стату во все сообщения данного автора
				var ipost = base.ids.indexOf(id);
				//alert(nickname);
				if (ipost>-1)
					for (var i=0; i<base.nums[ipost].length; i++)
						if (Btopic)
							Apostclass[base.nums[ipost][i]].getElementsByClassName("basic_info")[0].innerHTML = '<p>' + stat_string + '</p>' + Apostclass[base.nums[ipost][i]].getElementsByClassName("basic_info")[0].innerHTML;
						else
							Apostclass[base.nums[ipost][i]].innerHTML = Apostclass[base.nums[ipost][i]].innerHTML.replace(new RegExp("(Автор|Написано|Posted by|Started by)", "g"), stat_string);
			}
    }
}

// Определение цвета по кол-ву боев
function CalcBatColor(battles) {
    if (battles < 243) return statcolors.undef;
    if (battles < 415) return statcolors.bad;
    if (battles < 686) return statcolors.normal;
    if (battles < 1396) return statcolors.good;
    if (battles < 2179) return statcolors.very_good;
                        return statcolors.unique;
}

// Определение цвета по урону
function CalcAvDColor(admg) {
    if (admg < 15000) return statcolors.very_bad;
    if (admg < 21300) return statcolors.bad;
    if (admg < 26600) return statcolors.normal;
    if (admg < 36500) return statcolors.good;
    if (admg < 46000) return statcolors.very_good;
                        return statcolors.unique;
}

// Определение цвета по рейтингу
function CalcWrColor(winrate) {
    if (winrate < 44.3) return statcolors.very_bad;
    if (winrate < 48.3) return statcolors.bad;
    if (winrate < 51.1) return statcolors.normal;
    if (winrate < 55.8) return statcolors.good;
    if (winrate < 59.95) return statcolors.very_good;
                        return statcolors.unique;
}

// Определение цвета по рейтингу
function CalcXVMColor(rate) {
    if (isNaN(+rate) && rate != 'XX') return statcolors.undef;
    if (rate < 16.5) return statcolors.very_bad;
    if (rate < 33.5) return statcolors.bad;
    if (rate < 52.5) return statcolors.normal;
    if (rate < 75.5) return statcolors.good;
    if (rate < 92.5) return statcolors.very_good;
                     return statcolors.unique;
}

// Перевод WGR в шкалу XVM
function CalcXwgr(rate) {
    if (rate > 11100)
        rate = (100).toFixed(0);
    else
        rate = Math.max(Math.min(rate*(rate*(rate*(rate*(rate*(-0.0000000000000000000012957*rate + 0.0000000000000000472583) - 0.00000000000069667) + 0.0000000053351) - 0.00002225) + 0.05637) - 44.443, 100), 0).toFixed(0);
    return FormatX(rate);
}

// Форматируем значение по шкале XVM в нужный формат
function FormatX(xrate) {
    xrate = String(+xrate);
    if (xrate == 100) return 'XX';
    if (isNaN(xrate)) return '';
    return xrate;
}