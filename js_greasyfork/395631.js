// ==UserScript==
// @name         Hacker Wars
// @description  HW Monitor
// @version      1.0.0
// @author       CHuRReRO
// @license		 MIT
// @match        https://hackerwars.io/*
// @match        http://hackerwars.io/*
// @run-at document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_deleteValue
// @namespace https://greasyfork.org/users/433978
// @downloadURL https://update.greasyfork.org/scripts/395631/Hacker%20Wars.user.js
// @updateURL https://update.greasyfork.org/scripts/395631/Hacker%20Wars.meta.js
// ==/UserScript==


/*
    Auto hide-me
*/

function hideMe() {
    var logArea = $('form.log').find('.logarea'), val = logArea.val(), myIp = GM_getValue("myIp");
    if (typeof(val) != "undefined" && val.length > 0) {
        var logLines = val.split('\n'), newLines = [], foundIP = false;
        $.each(logLines, function(i, el) {
            if (el.indexOf(myIp) != -1) {
                foundIP = true;
            } else {
                if (el.trim().length > 0) newLines.push(el);
            }
        });
        if (foundIP) {
            logArea.val(newLines.join('\n'));
            $('form.log').submit();
        }
    }
}

/*
	Update my IP
*/

setTimeout(function(){
    var myIp = $('.header-ip-show').text();
    var storedIp = GM_getValue("myIp");
    if (storedIp != myIp) {
        GM_setValue("myIp", myIp);
    }
}, 500);

if (window.location.href.indexOf("internet") != -1) {
    if (!GM_getValue("myIp")) {
        setTimeout(hideMe, 500);
    } else {
        hideMe();
    }
}

/*
    IP database
*/

function loadIpLogs(dbName) {
    if (!GM_getValue(dbName) ) {
        GM_setValue(dbName, "{}");
    }
    var text = GM_getValue(dbName), db = JSON.parse(text);
    var getBtns = function (i) {
        var savedLink = '<a href="#" id="saveip" name="' + i + '">[save]</a>';
        var ignoreLink = '<a href="#" id="ignoreip" name="' + i + '">[ignore]</a>';
        if (dbName == "savedDb") savedLink = "";
        if (dbName == "ignoreDb") ignoreLink = "";
        return '<a href="#" id="deleteip" name="' + i + '">[delete]</a> ' + savedLink + ' ' + ignoreLink + ' <a href="' + window.origin + '/internet?ip=' + i +'&action=hack&method=bf" id="bruteip" name="' + i + '">[brute]</a>'
		+ ' <a href="' + window.origin + '/internet?ip=' + i +'&action=hack&method=xp" id="exploitip" name="' + i + '">[exploit]</a>' + ' <a href="' + window.origin + '/internet?ip=' + i +'&action=hack&method=xp" id="porscanip" name="' + i + '">[portscan]</a>';
    };
    for (var i in db) {
		if (db.hasOwnProperty(i)) {
			$('#logdblist').append('<div id="' + i + '"><a href="' + window.origin + '/internet?ip=' + i + '" id="loadlocal" name="' + i + '">' + i + '</a>&nbsp;&nbsp;&nbsp;' +
			getBtns(i) + '</br></div>');
		}
    }
    GM_addStyle('#logdblist a#loadlocal {float: left;}');
    GM_addStyle('#logdblist a#deleteip, #logdblist a#bruteip, #logdblist a#exploitip, #logdblist a#porscanip, #logdblist a#saveip {float: right;}');
    if (dbName != "ignoreDb") {
        GM_addStyle('#logdblist a#ignoreip {float: right;}');
    }
    var removeFromAll = function (name) {
        var local = JSON.parse(GM_getValue("localDb")),
        internet = JSON.parse(GM_getValue("internetDb")),
        ignore = JSON.parse(GM_getValue("ignoreDb")),
        saved = JSON.parse(GM_getValue("savedDb"));
        delete internet[name];
        delete local[name];
        delete ignore[name];
        delete saved[name];
        GM_setValue("localDb", JSON.stringify(local));
        GM_setValue("internetDb", JSON.stringify(internet));
        GM_setValue("ignoreDb", JSON.stringify(ignore));
        GM_setValue("savedDb", JSON.stringify(saved));
    };
    $('a[id=deleteip]').click(function () {
        var name = $(this).attr('name');
        removeFromAll(name);
        $('div[id="'+ name +'"]').remove();
    });
    if (dbName != "ignoreDb") {
        $('a[id=ignoreip]').click(function () {
            var name = $(this).attr('name');
            removeFromAll(name);
            $('div[id="'+ name +'"]').remove();
            var dbig = JSON.parse(GM_getValue("ignoreDb"));
            if (!dbig[name]) dbig[name] = true;
            GM_setValue("ignoreDb", JSON.stringify(dbig));
        });
    }
    if (dbName != "savedDb") {
        $('a[id=saveip]').click(function () {
            var name = $(this).attr('name'), saved = {}, saveText = GM_getValue("savedDb");
            if (!saveText) saveText = "{}";
            saved = JSON.parse(saveText);
            removeFromAll(name);
            $('div[id="'+ name +'"]').remove();
            if (!saved[name]) saved[name] = true;
            GM_setValue("savedDb", JSON.stringify(saved));
        });
    }
}

function setupIpDbPage(dbtype, dbname, dbKey) {
    /*jshint multistr: true */
    $('.widget-content').html('\
        <div class="span12">\
            <div class="widget-box text-left" style="margin-left: auto;margin-right: auto; width: 500px;">\
                <div class="widget-title"><span class="icon"><span class="he16-collect_info"></span></span>\
                    <h5>Select ' + dbname + ' IP</h5>\
					<button type="button" class="btn btn-danger" id="wipedb" key="'+dbKey+'" style="position:absolute;right:10px;top:5px;">Wipe</button>\
                </div>\
                <div class="widget-content ' + dbtype + 'ipdb"><div id="logdblist"></div></div>\
            </div>\
        </div>' );
        GM_addStyle('#logdblist { max-height: 400px; overflow: auto; padding: 5px; }');

	$('#wipedb').click(function() {
		var key = $(this).attr('key');
		$('#logdblist').text("");
		GM_deleteValue(key);
	});

}

function ipDBPage(){
    document.title = 'IP Database';
    $('.nav.nav-tabs:first').html('<li class="link active" id="tabweb"><a href="#" id="weblog"><span class="icon-tab he16-internet_log"></span>Victim</a></li>');
    $('.nav.nav-tabs:first').append('<li class="link" id="tablocal"><a href="#" id="locallog"><span class="icon-tab he16-internet_log"></span>Local</a></li>');
    $('.nav.nav-tabs:first').append('<li class="link" id="tabsaved"><a href="#" id="savedlog"><span class="icon-tab he16-internet_log"></span>Saved</a></li>');
    $('.nav.nav-tabs:first').append('<li class="link" id="tabignore"><a href="#" id="ignorelog"><span class="icon-tab he16-internet_log"></span>Ignored</a></li>');
    $('.label.label-info').remove();
    $('#link0').attr('href','log?ipdb'); $('#link0').html('IPDB');
    $('#content-header h1').html('IP Database');
    setupIpDbPage('internet', 'Internet', 'internetDb');
    loadIpLogs("internetDb");
}

if (window.location.href.search('ipdb') > 0) {
    $('#sidebar ul li.active').attr('class','');
    $('#sidebar ul').append('<li class="active"><a href="log?ipdb"><i class="fa fa-inverse fa-list-ul"></i> <span>IP Database</span></a></li>');
    ipDBPage();
} else {
    $('#sidebar ul').append('<li><a href="log?ipdb"><i class="fa fa-inverse fa-list-ul"></i> <span>IP Database</span></a></li>');
}
GM_addStyle('.fa-list-ul {content: "\f0ca";}');

$('#tablocal').click(function() {
    $('#tablocal').attr('class','link active');
    $('#tabweb').attr('class','link');
    $('#tabignore').attr('class','link');
    $('#tabsaved').attr('class', 'link');
    setupIpDbPage('local', 'Local', 'localDb');
    loadIpLogs("localDb");
});

$('#tabweb').click(function() {
    $('#tabweb').attr('class','link active');
    $('#tablocal').attr('class','link');
    $('#tabignore').attr('class','link');
    $('#tabsaved').attr('class', 'link');
    setupIpDbPage('web', 'Internet', 'internetDb');
    loadIpLogs("internetDb");
});

$('#tabsaved').click(function() {
    $('#tabweb').attr('class','link ');
    $('#tablocal').attr('class','link');
    $('#tabignore').attr('class','link');
    $('#tabsaved').attr('class', 'link active');
    setupIpDbPage('save', 'Saved', 'savedDb');
    loadIpLogs("savedDb");
});

$('#tabignore').click(function() {
    $('#tabignore').attr('class','link active');
    $('#tablocal').attr('class','link');
    $('#tabweb').attr('class','link');
    $('#tabsaved').attr('class', 'link');
    setupIpDbPage('ignore', 'Ignored', 'ignoreDb');
    loadIpLogs("ignoreDb");
});

/*
    Alert handling
*/

function alertText() {
    var alertArray = $(".alert.alert-success").text().split("\n");
    var aText = alertArray.filter(function(val) {
    	return val.length > 1;
    });
    if (aText.length > 0) {
        return aText[0].trim();
    } else {
        return;
    }
}

function successAlert(text) {
    if (text) {
        switch (true) {
            case text === "Success! Software installed.":
                return true;
            case text === "Success! Software successfully hidden.":
                return true;
            case text === "Success! Software successfully uploaded.":
                return true;
            case text === "Success! Software successfully deleted.":
                return true;
            case text === "Success! Software successfully downloaded.":
                return true;
            case text === "Success! Software successfully seeked.":
                return true;
            case text.indexOf("virus removed") != -1:
                return true;
            case text.indexOf("viruses removed") != -1:
                return true;
        }
    }
    return false;
}

// Switch to logs on success alert (to trigger auto hideme)
if (window.location.href.indexOf("internet") != -1 && successAlert(alertText())) {
    window.location.replace(window.origin + "/internet?view=logs");
}

if (window.location.href.indexOf("software") != -1 && alertText() === "Success! Software successfully downloaded.") {
    window.location.replace(window.origin + "/internet?view=logs");
}

/*
    Clear log buttons
*/

if ($('#link2').text() == " Log de Dados" || $('#link0').text() == " Log de Dados" || $('#link2').text() == " Log de Dados") {
    $('form.log input.btn').before('<input class="btn btn-inverse" id="clearlog" type="button" value="Limpar" style="width: 80px;"><span>     </span>');
}
else if ($('#link2').text() == " Log File" || $('#link0').text() == " Log File" || $('#link2').text() == " Log File"){
	$('form.log input.btn').before('<input class="btn btn-inverse" id="clearlog" type="button" value="Clear" style="width: 80px;"><span>     </span>');
}

$('#clearlog').click(function(){
    if ($('form.log').length) {
        $('form.log').find('.logarea').val('');
        $('form.log').submit();
    } else {
        console.log('No log found');
    }
});

/*
    Hacked Database mods
*/

function toggleFavorite(ip, elem) {
    var favorites = JSON.parse(GM_getValue("favorites"));
    if (favorites[ip]) {
        delete favorites[ip];
        elem.removeClass("fa-star");
        elem.addClass("fa-star-o");
    } else {
        favorites[ip] = true;
        elem.removeClass("fa-star-o");
        elem.addClass("fa-star");
    }
    GM_setValue("favorites", JSON.stringify(favorites));
}

if (window.location.href.indexOf("/list") != -1 ) {
    GM_addStyle('.fa-star {content: "\f005";}');
    GM_addStyle('.fa-star-o {content: "\f006";}');
    GM_addStyle('i.favorite {color: #DAA520;}');
    var favText = GM_getValue("favorites"), favorites = {};
    if (!favText) {
        GM_setValue("favorites", "{}");
    }
    favorites = JSON.parse(GM_getValue("favorites"));
    $("ul.list.ip li").each(function(){
        var entry = $(this);
        var pass = $(this).find(".list-user span.small").get(1).firstChild.data;
        var url = $(this).find(".list-ip a").attr("href") + "&action=login&user=root&pass=" + pass;
        $(this).find(".list-ip").after(' <a href="' + url + '" style="float:left;margin: 5px 5px 0px 5px;font-size:14px">[login]</a>');
        console.log(url);
        var ip = entry.find(".list-ip #ip").text();
        if (favorites[ip]) {
            entry.find(".list-actions").append('<i class="favorite fa-2x fa fa-inverse fa-star"></i>');
        } else {
            entry.find(".list-actions").append('<i class="favorite fa-2x fa fa-inverse fa-star-o"></i>');
        }
        entry.find("i.favorite").click(function () {
            toggleFavorite(ip, $(this));
        });
    });
}

/*
    Log monitor (ip-scraper will grab any IP's)
*/

function refreshPage(){
    if (window.location.href.search('ipdb') > 1) return; //dont refresh ipdb
    if (GM_getValue(window.location.pathname + "monitorLog")) {
        location.reload();
    }
}

function Regs() {
	this.generating = /Server\s\[\d+\.\d+\.\d+\.\d+\].*(mined|mailed).*generating.*/;
	this.transfer = /.*(Funds|)were transferred (to|).*/;
	this.collected = /.*localhost collected.*/;
	this.login = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2} - localhost logged.*on account.*/;
	this.bought = /.*localhost bought license.*/;
	this.research = /.*localhost researched.*/;
}

var localRegs = new Regs();
var fullRegs = new Regs();
fullRegs.localhost = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s-\slocalhost.*/;

function checkLine(line, regObj) {
	for (var prop in regObj) {
		if (line.match(regObj[prop])) {
			return true;
		}
	}
	return false;
}

function scrapeLog() {
    var logArea = $('form.log').find('.logarea'), logText = logArea.val(), logsFound = false, logResult = [];
    var stored = [], storedText = GM_getValue(window.location.pathname + "storedLogs");
    if (!storedText) storedText = "";
    if (storedText.length > 0) stored = storedText.split("\n");
    if (logText !== "undefined" && logText.length > 0) {
        var split = logText.split("\n");
		for (i = 0; i < split.length; i++) {
            var line = split[i].trim();
            if (line.length === 0) continue;
            if (window.location.pathname === "/log") {
				if (checkLine(line, localRegs) === true) logsFound = true;
                else logResult.push(line);
            }
			console.log(stored.indexOf(line) + " " + line);
            if (stored.indexOf(line) === -1 && line.length > 0 && checkLine(line, fullRegs) === false) {
				console.log("Pushing line" + line);
                stored.push(line);
            }
        }
        if (stored.length > 0) GM_setValue(window.location.pathname + "storedLogs", stored.join("\n").trim());
    }
    if (logsFound) {
        logArea.val(logResult.join("\n"));
        $('form.log').submit();
    }
}

if ($('#cf-error-details h2[data-translate="what_happened"]').text().trim().length > 0) { //detect cloudflare error
    setTimeout(refreshPage, 3000);
}

if (GM_getValue(window.location.pathname + "monitorLog")) {
    console.log("started backup timeout");
    setTimeout(refreshPage, 30000);//backup page refresher
}

if ($('#link0').text() == " Log de Dados" || $('#link2').text() == " Log de Dados" || $('#link2').text() == " Log de Dados") {
    var monitor = GM_getValue(window.location.pathname + "monitorLog");
    if (monitor === "undefined") {
        GM_setValue(window.location.pathname + "monitorLog", false);
        monitor = false;
    }
    var addClick = function () {
        $('form.log #logmonitor').click(function () {
            monitor = true;
            GM_setValue(window.location.pathname + "monitorLog", true);
            $('input#logmonitor').attr("value", "Parar");
            setTimeout(refreshPage, 3000);
        });
    };
    if (monitor) {
        $('form.log input#clearlog').before('<input class="btn btn-inverse" id="logmonitor" type="button" value="Parar" style="width: 80px;"><span>     </span>');
        $('form.log #logmonitor').click(function () {
            GM_setValue(window.location.pathname + "monitorLog", false);
            $('input#logmonitor').attr("value", "Monitor");
            monitor = false;
            addClick();
            $("textarea.logarea").val(GM_getValue(window.location.pathname + "storedLogs"));
            GM_setValue(window.location.pathname + "storedLogs", "");
        });
        scrapeLog();
        setTimeout(refreshPage, 3000);
        setTimeout(refreshPage, 7000);//backup refresher for hangs
    } else {
        $('form.log #clearlog').before('<input class="btn btn-inverse" id="logmonitor" type="button" value="Monitorar" style="width: 80px;"><span>     </span>');
        addClick();
    }
}
else if ($('#link0').text() == " Log File" || $('#link2').text() == " Log File" || $('#link2').text() == " Log de File") {
    var monitor = GM_getValue(window.location.pathname + "monitorLog");
    if (monitor === "undefined") {
        GM_setValue(window.location.pathname + "monitorLog", false);
        monitor = false;
    }
    var addClick = function () {
        $('form.log #logmonitor').click(function () {
            monitor = true;
            GM_setValue(window.location.pathname + "monitorLog", true);
            $('input#logmonitor').attr("value", "Parar");
            setTimeout(refreshPage, 3000);
        });
    };
    if (monitor) {
        $('form.log input#clearlog').before('<input class="btn btn-inverse" id="logmonitor" type="button" value="Parar" style="width: 80px;"><span>     </span>');
        $('form.log #logmonitor').click(function () {
            GM_setValue(window.location.pathname + "monitorLog", false);
            $('input#logmonitor').attr("value", "Monitor");
            monitor = false;
            addClick();
            $("textarea.logarea").val(GM_getValue(window.location.pathname + "storedLogs"));
            GM_setValue(window.location.pathname + "storedLogs", "");
        });
        scrapeLog();
        setTimeout(refreshPage, 3000);
        setTimeout(refreshPage, 7000);//backup refresher for hangs
    } else {
        $('form.log #clearlog').before('<input class="btn btn-inverse" id="logmonitor" type="button" value="Monitor" style="width: 80px;"><span>     </span>');
        addClick();
    }
}

/*
    Auto ip-scraper
*/

function uniqueArray(arr) {
    var unique = [], map = [];
        for (var i in arr) {
            if (map[arr[i]]) {
                continue;
            } else {
                map[arr[i]] = true;
                unique[unique.length] = arr[i];
            }
        }
    return unique;
}

function scrapeIPs(text) {
    if (typeof(text) === "string") {
        var re = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
        var found = text.match(re);
        if (found && found.length > 0) {
            return uniqueArray(found);
        }
    }
    return;
}

function saveIPs(dbName, ipArray) {
    if (typeof(ipArray) == "object" && ipArray.length > 0) {
        var dbText = GM_getValue(dbName), myIp = GM_getValue("myIp"), igText = GM_getValue("ignoreDb"),
        saveText = GM_getValue('savedDb');
        var db = {};
        if (igText && igText.length > 0) igDb = JSON.parse(igText);
        if (saveText && saveText.length > 0) saveDb = JSON.parse(saveText);
        if (dbText && typeof(dbText) === 'string' && dbText.length > 0) {
            db = JSON.parse(dbText);
			for (i = 0; i < ipArray.length;i++) {
                if (ipArray[i] == myIp || igDb[ipArray[i]] || saveDb[ipArray[i]]) continue;
                if (!db[ipArray[i]] ) db[ipArray[i]] = true;
            }
        } else {
			for (x = 0; x < ipArray.length;x++) {
                if (ipArray[x] == myIp || igDb[ipArray[x]]) continue;
                db[ipArray[x]] = true;
            }
        }
        var json = JSON.stringify(db);
        GM_setValue(dbName, json);
    }
}

function cleanLocal(text) {
	var result = [];
	if (text !== "undefined" && text.length > 0) {
		var split = text.split("\n");
		for (i = 0; i < split.length; i++) {
			var line = split[i].trim();
            if (line.length === 0) continue;
			if (line.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s-\slocalhost.*/)) {
				continue;
			} else {
				result.push(line);
			}
		}
		text = result.join("\n");
	}
	return text;
}

if (window.location.href.indexOf("/log") != -1) {
    var log = $('form.log').find('.logarea');
    if (log && log.length > 0) {
        text = log.val();
        saveIPs("localDb", scrapeIPs(cleanLocal(text)));
    }
}

if (window.location.href.indexOf("internet?view=logs") != -1) {
    var log = $('form.log').find('.logarea');
    if (log && log.length > 0) {
        text = log.val();
        saveIPs("internetDb", scrapeIPs(text));
    }
}