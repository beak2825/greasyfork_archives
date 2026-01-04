// ==UserScript==
// @name		Orion Pardus Infocenter Auto-Share Script (Shadow Phoenix Logger)
// @namespace	https://www.wiremybike.com/rc/infocenter/
// @description	Enables to share combat/hack/payment logs and missions bullettin board with Pardus Infocenter
// @include http://orion.pardus.at/combat_details.php*
// @include http://orion.pardus.at/hack.php*
// @include http://orion.pardus.at/bulletin_board.php*
// @include http://orion.pardus.at/overview_payment_log.php*
// @match http://orion.pardus.at/combat_details.php*
// @match http://orion.pardus.at/hack.php*
// @match http://orion.pardus.at/bulletin_board.php*
// @match http://orion.pardus.at/overview_payment_log.php*
// @include https://orion.pardus.at/combat_details.php*
// @include https://orion.pardus.at/hack.php*
// @include https://orion.pardus.at/bulletin_board.php*
// @include https://orion.pardus.at/overview_payment_log.php*
// @match https://orion.pardus.at/combat_details.php*
// @match https://orion.pardus.at/hack.php*
// @match https://orion.pardus.at/bulletin_board.php*
// @match https://orion.pardus.at/overview_payment_log.php*
// @author	Pio -Orion- siur2@yahoo.com
// @author	Uncledan -Orion- / Larry Legend -Artemis- uncledan@uncledan.it
// @author	Taurvi -Artemis- / Sobkou -Orion- sobkou.pardus@gmail.com
// @author	Aeiri -Artemis- / Jetix -Orion- brad@bcable.net
// @author	Tightwad -Orion- / Spendthrift -Artemis- tilton+pardus@gmail.com
// @version	1.6.3.2
// @downloadURL https://update.greasyfork.org/scripts/422116/Orion%20Pardus%20Infocenter%20Auto-Share%20Script%20%28Shadow%20Phoenix%20Logger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422116/Orion%20Pardus%20Infocenter%20Auto-Share%20Script%20%28Shadow%20Phoenix%20Logger%29.meta.js
// ==/UserScript==

// ASCII art made with Doom font at http://patorjk.com/software/taag/

//  _____      _   _   _
// /  ___|    | | | | (_)
// \ `--.  ___| |_| |_ _ _ __   __ _ ___
//  `--. \/ _ \ __| __| | '_ \ / _` / __|
// /\__/ /  __/ |_| |_| | | | | (_| \__ \
// \____/ \___|\__|\__|_|_| |_|\__, |___/
//                              __/ |
//                             |___/

var enableCombatShare   = true;
var enableHackShare     = true;
var hideHackerLocation  = true; //if set to *true* the hacker location won't be shown
var enableMissionsShare = true;
var enablePaymentShare  = true;
var autoshare           = true; //is set to *true* logs will be uploaded automatically

var showDebug = false; //if set to *true* debug messages are shown

//  _____
// /  ___|
// \ `--.  ___ _ ____   _____ _ __ ___
//  `--. \/ _ \ '__\ \ / / _ \ '__/ __|
// /\__/ /  __/ |   \ V /  __/ |  \__ \
// \____/ \___|_|    \_/ \___|_|  |___/

var servers = [
    {
        name: "Shadow Phoenix Logger", //the name you want to be displayed in the combo box
        url: "https://www.wiremybike.com/rc/infocenter", //the exact url to your Infocenter, no trailing slashes
        accounts: { //the user names you wont to use; to disable a universe, just delete the line, but look twice at commas!!!
            //ATTENTION: if not using EASY script it is suggested to give to these account(s) permissions to send data only
            orion: {name: "Orion-Send", password: "986d76480b0b202c14f23ffd3b977f68"}
        }
    }
];

//  _____
// /  __ \
// | /  \/ ___  _ __ ___  _ __ ___   ___  _ __
// | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \| '_ \
// | \__/\ (_) | | | | | | | | | | | (_) | | | |
//  \____/\___/|_| |_| |_|_| |_| |_|\___/|_| |_|

function sltServer_onChange() {
    var btnShare1 = document.getElementById("btnShare1");
    btnShare1.disabled = false;
    btnShare1.className = "";
}

//  _____                 _           _
// /  __ \               | |         | |
// | /  \/ ___  _ __ ___ | |__   __ _| |_ ___
// | |    / _ \| '_ ` _ \| '_ \ / _` | __/ __|
// | \__/\ (_) | | | | | | |_) | (_| | |_\__ \
//  \____/\___/|_| |_| |_|_.__/ \__,_|\__|___/

function saveCombat() {
    var server = servers[document.getElementById("sltServer").selectedIndex];
    var level = document.getElementById("sltLevel").value;

    function extractStr(source, begin, end) {
        var re = new RegExp(begin, "i");
        var i = source.search(re) + begin.length;
        var str = source.substring(i);
        re = new RegExp(end, "i");
        var j = str.search(re);
        return str.substring(0, j);
    }

    function trim(str) {
        var result = str.replace(/^\s+/, "");
        return result.replace(/\s+$/, "");
    }

    function prepareName(name) {
        var i = name.indexOf("(");
        return trim(i == -1 ? name : name.substr(0, i));
    }

    function append_input(form, name, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    var btnShare1 = document.getElementById("btnShare1");
    btnShare1.disabled = "true";
    btnShare1.className = "disabled";

    var cmbt = new Object();
    cmbt.level = level;

    var str = document.location.search;
    cmbt.pid = str.substring(str.indexOf("=") + 1);
    str = document.location.hostname;
    var universe = str.substring(0, str.indexOf("."));
    var account = server.accounts[universe];
    if (!account) {
        return;
    }
    var utctime = document.getElementById('report_date_utc').textContent;
    cmbt.universe = universe.charAt(0).toUpperCase() + universe.substring(1);

    var html = document.body.innerHTML;
    var elem = document.getElementById("report").previousSibling;
    while (elem && !elem.tagName) {
        elem = elem.previousSibling;
    }
    str = elem.innerHTML;
    var values = str.split(/<br>/i);
    cmbt.type = values[0];

    cmbt.additional = values[1];

    if(values.length > 5){
        //get 1
        cmbt.additional = values[1];
        for(var i = 1; i < values.length - 5; i++){
            cmbt.additional += "<br>" + values[i+1];
        }
        cmbt.additional += "</font><br>";
    }

    cmbt.when = new Date(utctime).getTime();
    str = values[values.length - 1];
    var delim = null;
    if (str.search(/font/i) != -1) {
        delim = /<font.+font>/i;
        cmbt.outcome = extractStr(str, ">", "<");
    } else {
        var delims = ["disengaged from battle with", "was defeated by", "defeated", "raided"];
        var outcomes = ["disengaged", "was defeated by", "defeated", "raided"];
        for (var i = 0; i < delims.length; i++) {
            if (str.indexOf(delims[i]) != -1) {
                delim = delims[i];
                cmbt.outcome = outcomes[i];
                break;
            }
        }
    }
    values = str.split(delim);
    cmbt.attacker = prepareName(values[0]);
    cmbt.defender = prepareName(values[1]);
    str = extractStr(html, "confrontation in ", "]");
    values = str.split(" [");
    cmbt.sector = values[0];
    cmbt.coords = values[1];
    cmbt.data = extractStr(html, "cr = \"", "\"");

    var form = document.getElementById("combatPost");
    if (form) {
        document.body.removeChild(form);
    }
    form = document.createElement("form");
    if (!showDebug) {
        form.style.display = "none";
    }
    form.action = server.url + "/combat_add.php";
    form.method = "post";
    form.target = "combatFrame";
    form.id = "combatPost";
    append_input(form, "acc", account.name);
    append_input(form, "pwd", account.password);
    append_input(form, "pid", cmbt.pid);
    append_input(form, "type", cmbt.type);
    append_input(form, "when", cmbt.when);
    append_input(form, "universe", cmbt.universe);
    append_input(form, "sector", cmbt.sector);
    append_input(form, "coords", cmbt.coords);
    append_input(form, "attacker", cmbt.attacker);
    append_input(form, "defender", cmbt.defender);
    append_input(form, "outcome", cmbt.outcome);
    append_input(form, "additional", cmbt.additional);
    append_input(form, "level", cmbt.level);
    append_input(form, "data", cmbt.data);
    document.body.appendChild(form);
    var frame = document.getElementById("combatFrame");
    if (!frame) {
        frame = document.createElement("iframe");
        frame.name = "combatFrame";
        frame.id = frame.name;
        if (!showDebug) {
            frame.style.display = "none";
        }
        document.body.appendChild(frame);
    }
    form.submit();
}

function addCombatShareBtn() {
    // text
    var div = document.createElement("div");
    var label = document.createElement("b");
    label.appendChild(document.createTextNode("Share combat log at: "));
    div.appendChild(label);

    // share location
    var select = document.createElement("select");
    select.id = "sltServer";
    for (var i = 0; i < servers.length; i++) {
        var option = document.createElement("option");
        option.text = servers[i].name;
        option.value = i;
        select.appendChild(option);
    }
    select.addEventListener("change", sltServer_onChange, false);
    div.appendChild(select);
    div.appendChild(document.createTextNode(" "));

    // security levels
    var select_level = document.createElement("select");
    select_level.id = "sltLevel";
    var levels = Array("Open", "Confidential", "Admin");
    for (var i in levels) {
        var option = document.createElement("option");
        if (levels[i] == "Confidential") {
            option.selected = "selected";
        }
        option.text = levels[i];
        option.value = levels[i];
        select_level.appendChild(option);
    }
    div.appendChild(select_level);
    div.appendChild(document.createTextNode(" "));

    // share button
    var btnShare1 = document.createElement("input");
    btnShare1.id = "btnShare1";
    btnShare1.type = "button";
    btnShare1.value = "Share";
    btnShare1.addEventListener("click", saveCombat, false);
    div.appendChild(btnShare1);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    var br = document.getElementsByTagName("br")[1];
    br.parentNode.insertBefore(div, br.nextSibling);

}

//  _   _            _
// | | | |          | |
// | |_| | __ _  ___| | _____
// |  _  |/ _` |/ __| |/ / __|
// | | | | (_| | (__|   <\__ \
// \_| |_/\__,_|\___|_|\_\___/

function saveHack() {
    var server = servers[document.getElementById("sltServer").selectedIndex];

    function prepareHack(hack, account) {
        function prepareSector(pos, sector) {
              if (!sector) {
                  pos.sector = "ERROR";
                  //alert (pos.sector);
                  return;
              }
                var i = sector.indexOf("[");
                var c = sector.indexOf("cloaked");
                //alert (sector);
                //alert(c);
                if (i != -1) {
                    pos.sector = sector.substr(0, i - 1);
                    pos.coords = sector.substr(i);
                } else if (c != -1) {
                   pos.sector = sector; //sector.substr(0, i - 1);
                   //pos.coords = "*cloaked*";
                }
            else {
                    pos.sector = sector;
            }
            }

        function getPosition(posCell) {
            var len = posCell.childNodes.length;
            var result = {sector: null, coords: null};
            result.cluster = posCell.childNodes[len - 1].textContent;
            // result.sector = posCell.childNodes[len - 2].textContent;
            for (var j = 0; j < posCell.childNodes.length; j++) {
                var spot = posCell.childNodes[j].textContent;
                //alert (j + "=" + spot);
                 }

            //alert(result.cluster);
            //alert(result.sector);
            if (len > 1) {
                switch (len) {
                    case 3:
                        prepareSector(result, posCell.childNodes[0].nodeValue);
                        break;
                    case 5:
                        prepareSector(result, posCell.childNodes[2].nodeValue + " " + posCell.childNodes[0].textContent);
                        //alert(posCell.childNodes[2].nodeValue + " " +  posCell.childNodes[0].textContent);
                        break;
                }
            }
            return result;
        }

        function prepareResources(resourceCell) {
            var result = [];
            var res = null;
            for (var i = 0; i < resourceCell.childNodes.length; i++) {
                var node = resourceCell.childNodes[i];
                var tag = node.tagName;
                if (tag) {
                    if (tag.toLowerCase() == "br") {
                        continue;
                    }
                    else
                    if (tag.toLowerCase() == "img") {
                        var name = node.src;
                        name = name.substr(name.lastIndexOf("/") + 1);
                        res = {img_name: name};
                    }
                }
                else {
                    var amount = node.nodeValue;
                    res.amount = amount.substring(amount.indexOf(" ") + 1, amount.length - 1);
                    result.push(res);
                }
            }
            return result;
        }

        // if the user has no buildings, the buildings table is not displayed...
        // we have to substitute this if it's not there so that data doesn't get
        // truncated; this operates for the table number provided as the index
        function fixBuildings(tables, index) {
            if (tables.length > index) {
                var buildingsTH = tables[index].getElementsByTagName("th")[0];
                // if not buildings table
                if (!buildingsTH || buildingsTH.innerHTML != "Buildings") {
                    var newTables = tables.slice(0, index);
                    newTables[index] = null;
                    for (var i = index; i < tables.length; i++) {
                        newTables[i+1] = tables[i];
                    }
                    tables = newTables;
                }
            }
            return tables;
        }

        var btnShare1 = document.getElementById("btnShare1");
        btnShare1.disabled = "true";
        btnShare1.className = "disabled";

        var str = document.location.hostname;
        var universe = str.substring(0, str.indexOf("."));
        if (!universe) {
            universe = "orion";
        }
        var acc = server.accounts[universe];
        if (!acc) {
            return false;
        }
        account.name = acc.name;
        account.password = acc.password;
        hack.universe = universe.charAt(0).toUpperCase() + universe.substring(1);

        var table = document.getElementsByTagName("table")[0];
        table = table.rows[1].cells[1].getElementsByTagName("table")[0];
        var cell = table.rows[0].cells[0];
        var tables = [];
        for (var i = 0; i < cell.childNodes.length; i++) {
            var child = cell.childNodes[i];
            var tag = child.tagName;
            if (tag && (tag.toLowerCase() == "table")) {
                tables.push(child);
            }
        }

        if (!hideHackerLocation) {
            hack.location = table.getElementsByTagName("a")[0].innerHTML;
        }

        var buildingTable = null;
        var contactTable = null;
        var foeTable = null;
        var friendTable = null;
        var resourceTable = null;
        var shipTable = null;
        var turnoverOffset = 0;

        // fix the buildings table
        switch (tables.length) {
            case 3:
            case 4:
            case 5:
                // tables[2] will be the buildings table
                tables = fixBuildings(tables, 2);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10: // many buildings possible
                // tables[3] will be the buildings table
                tables = fixBuildings(tables, 3);
                break;
        }

        // classify which type of hack it is
        switch (tables.length) {
            case 2:
                // either trade or brute
                var thText = tables[1].getElementsByTagName("th")[0].innerHTML;
                if(
                    thText.match(/^Last transactions at /) ||
                    thText.match(/'s last own transactions$/)
                ) {
                    hack.method = "trade";
                } else {
                    hack.method = "brute";
                }
                break;
            case 4:
                hack.method = "skilled";
                buildingTable = tables[2];
                //foeTable = tables[3];
                contactTable = tables[3];
                break;
            case 5:
                hack.method = "freak";
                buildingTable = tables[2];
                //foeTable = tables[3].getElementsByTagName("table")[0];
                //friendTable = tables[3].getElementsByTagName("table")[1];
                contactTable = tables[3];
                resourceTable = tables[4];
                turnoverOffset = 2;
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10: // many buildings possible
                hack.method = "guru";
                shipTable = tables[2];
                buildingTable = tables[3];
                //foeTable = tables[4].getElementsByTagName("table")[0];
                //friendTable = tables[4].getElementsByTagName("table")[1];
                contactTable = tables[4];
                resourceTable = tables[5];
                turnoverOffset = 2;
                break;
            default:
                return false;
        }

        // not all hacks are pilot related
        var doPilotSearch = true;

        // trade hack
        if (hack.method == "trade") {
            var tradeTable = tables[1];
            hack.date = new Date(utctime).getTime();

            var thText = tables[1].getElementsByTagName("th")[0].innerHTML;
            // pilot trade hack
            if (thText.match(/'s last own transactions$/)) {
                hack.pilot = thText.replace(/'s last own transactions$/, '');
            } else {
                // skip pilot search since it's not a pilot that was hacked
                doPilotSearch = false;

                // get location and position of hacked structure
                hack.location = thText.replace(/^Last transactions at /,'');
                var structure = tables[1].rows[2].cells[1].innerHTML;
                var pos = structure.replace(/^.*\(([^\)]+)\)$/, '$1');
                hack.position = {};
                hack.position.sector = pos.replace(/^(.*) [^ ]+$/, '$1');
                hack.position.coords = "[" + pos.replace(/^.* ([^ ]+)$/, '$1') + "]";
            }

            // each transaction is stored in the buildings fields
            hack.building_amount = tables[1].rows.length-2;
            hack.buildings = [];
            for (var i = 0; i < hack.building_amount; i++) {
                var transaction = {};
                var hackRow = tables[1].rows[i+2];
                transaction.date = new Date(utctime).getTime();
                transaction.position = hackRow.cells[1].innerHTML;
                var pilot = hackRow.cells[2].innerHTML;
                transaction.pilot = pilot.replace(/^.*>(.*)<.*$/, '$1');
                transaction.direction = hackRow.cells[3].innerHTML;
                transaction.commodity = hackRow.cells[4].innerHTML;
                transaction.amount = hackRow.cells[5].innerHTML;
                transaction.average = hackRow.cells[6].innerHTML;
                transaction.total = hackRow.cells[7].innerHTML;

                // convert the img fields to be forced to be links to Pardus;
                // this is for people who use local image packs
                transaction.commodity = transaction.commodity.replace(
                    /src=".*\/([^\/]+)/,
                    'src="http://static.pardus.at/img/stdhq/res/$1'
                );
                transaction.average = transaction.average.replace(
                    /src=".*\/credits.png/,
                    'src="http://static.pardus.at/img/stdhq/credits.png'
                );
                transaction.total = transaction.total.replace(
                    /src=".*\/credits.png/,
                    'src="http://static.pardus.at/img/stdhq/credits.png'
                );
                hack.buildings.push(transaction);
            }

            // any pilot hack
        } else {
            var pilotTable = tables[1];
            hack.date = new Date(pilotTable.rows[0].cells[0].innerHTML.replace(/-/g, "/") + " UTC").getTime();
            hack.pilot = pilotTable.rows[1].cells[0].textContent;
            hack.credits = pilotTable.rows[3].cells[0].innerHTML.replace(/,/g, "");
            hack.reputation = pilotTable.rows[3].cells[1].innerHTML.replace(/,/g, "");
            hack.building_amount = pilotTable.rows[3].cells[2].innerHTML;


            if (hack.method == "freak" || hack.method == "guru") {
                hack.turnover = pilotTable.rows[5].cells[0].innerHTML.replace(/,/g, "");
            }
//alert(hack.turnover);
            if (pilotTable.rows.length >= 6) {
                hack.experience = pilotTable.rows[5 + turnoverOffset].cells[0].innerHTML.replace(/,/g, "");
            }

            if (pilotTable.rows.length >= 8) {
                hack.position = getPosition(pilotTable.rows[7 + turnoverOffset].cells[0]);
            }
        }


        if (doPilotSearch) {
            var lookupCell = tables[0].rows[1].cells[0];
            var pilotSelect = lookupCell.getElementsByTagName("select")[0];
            if (pilotSelect) {
                for (var i = 0; i < pilotSelect.length; i++) {
                    var option = pilotSelect.item(i);
                    if (option.text == hack.pilot) {
                        hack.pilot_id = option.value;
                        break;
                    }
                }
            } else {
                var pilotInput = lookupCell.getElementsByTagName("input")[1];
                hack.pilot_id = pilotInput.value;
            }
        }

        if (shipTable != null) {
            hack.ship_status = {};
            for (var i = 1; i < shipTable.rows.length; i++) {
                var font = shipTable.rows[i].cells[0].getElementsByTagName("font")[0];
                var name = font.innerHTML;
                name = name.substr(0, name.indexOf(":")).toLowerCase();
                var status = {};
                status.color = font.color;
                status.amount = shipTable.rows[i].cells[1].getElementsByTagName("table")[0].width;
                hack.ship_status[name] = status;
            }
        }

        hack.building_positions = [];
        if (buildingTable != null) {
            for (var i = 1; i < buildingTable.rows.length; i++) {
                var pos = getPosition(buildingTable.rows[i].cells[1]);
                pos.amount = buildingTable.rows[i].cells[0].innerHTML;
                hack.building_positions.push(pos);
            }
        }


        hack.contacts = "";
        if (contactTable != null) {
            for (var i = 1; i < contactTable.rows.length; i++) {

                if(i != 1) {
                    hack.contacts += ";";
                }

                //contact
                hack.contacts += contactTable.rows[i].cells[0].getElementsByTagName("span")[0].innerHTML + ",";

                //type
                if(contactTable.rows[i].cells[1].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_pilot.png"){
                    hack.contacts += "1";
                }
                else if(contactTable.rows[i].cells[1].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_alliance.png"){
                    hack.contacts += "2";
                }
                else if(contactTable.rows[i].cells[1].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_faction.png"){
                    hack.contacts += "3";
                }

                //handles + . -
                for(var x = 2; x < 8; x++){

                    //skilled shows foes, so those first
                    if(contactTable.rows[i].cells[x].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_flag_red.png"){
                        hack.contacts += "0";
                    }//freak shows friends so those next
                    else if(contactTable.rows[i].cells[x].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_flag_green.png"){
                        hack.contacts += "1";
                    }//guru shows neutral settings so those last
                    else if(contactTable.rows[i].cells[x].getElementsByTagName("img")[0].src.replace(/.*\/([^\/]+)\//,'') == "ui_set.png"){
                        hack.contacts += "2";
                    }
                }
            }
        }


        if (resourceTable != null) {
            hack.buildings = [];
            var buildingTables = resourceTable.getElementsByTagName("table");
            for (var i = 0; i < buildingTables.length; i++) {
                var posStr = buildingTables[i].rows[0].cells[0].innerHTML;
                posStr = posStr.substr(new String("Building in ").length);
                var building = {};
                prepareSector(building, posStr);
                for (var j = 0; j < hack.building_positions.length; j++) {
                    if (building.sector == hack.building_positions[j].sector) {
                        building.cluster = hack.building_positions[j].cluster;
                        break;
                    }
                }
                building.commodities = prepareResources(buildingTables[i].rows[2].cells[0]);
                building.stock = prepareResources(buildingTables[i].rows[2].cells[1]);
                hack.buildings.push(building);
            }
        }

        return true;
    }

    function objectToXml(obj, nodeName, parentNode) {
        if (!parentNode) {
            parentNode = document.implementation.createDocument("", "", null);
        }
        var node = document.createElement(nodeName);
        parentNode.appendChild(node);
        if (obj instanceof Array) {
            var collection = node.ownerDocument.createAttribute("collection");
            collection.value = true;
            node.attributes.setNamedItem(collection);
            var name = nodeName.substr(0, nodeName.length - 1);
            for (var i = 0; i < obj.length; i++) {
                objectToXml(obj[i], name, node);
            }
        } else
        if (typeof(obj) == "object") {
            var i;
            for (i in obj) {
                objectToXml(obj[i], i, node);
            }
        } else {
            node.appendChild(node.ownerDocument.createTextNode(obj));
        }
        return parentNode;
    }

    function xmlToStr(doc) {
        return new XMLSerializer().serializeToString(doc);
    }

    function postHack(data, account) {
        var level = document.getElementById("sltLevel").value;

        function appendFormElement(form, elemName, type, name, value) {
            var elem = document.createElement(elemName);
            if (type) {
                elem.type = type;
            }
            elem.name = name;
            elem.value = value;
            form.appendChild(elem);
        }

        var frame = document.getElementById("hackFrame");
        if (!frame) {
            frame = document.createElement("iframe");
            frame.name = "hackFrame";
            frame.id = frame.name;
            if (!showDebug) {
                frame.style.display = "none";
            }
            document.body.appendChild(frame);
        }
        var form = document.getElementById("hackPost");
        if (form) {
            document.body.removeChild(form);
        }
        form = document.createElement("form");
        form.method = "post";
        form.action = server.url + "/hack_add.php";
        form.target = "hackFrame";
        form.id = "hackPost";
        if (!showDebug) {
            form.style.display = "none";
        }
        appendFormElement(form, "textarea", null, "data", data);
        appendFormElement(form, "input", "text", "acc", account.name);
        appendFormElement(form, "input", "text", "pwd", account.password);
        appendFormElement(form, "input", "text", "level", level);
        document.body.appendChild(form);
        form.submit();
    }
    var hack = {};
    var account = {};
    if (!prepareHack(hack, account)) {
        return;
    }
    var doc = objectToXml(hack, "hack");
    //alert(xmlToStr(doc));
    postHack(xmlToStr(doc), account);
}

function sltServer_onChange() {
    var btnShare1 = document.getElementById("btnShare1");
    btnShare1.disabled = false;
    btnShare1.className = "";
}

function addHackShareBtn() {
    var breakline = document.createElement("br");

    var label = document.createElement("b");
    label.appendChild(document.createTextNode("Share this hack at: "));

    var btnShare1 = document.createElement("input");
    btnShare1.id = "btnShare1";
    btnShare1.type = "button";
    btnShare1.value = "Share";
    btnShare1.addEventListener("click", saveHack, false);

    var select = document.createElement("select");
    select.id = "sltServer";
    for (var i = 0; i < servers.length; i++) {
        var option = document.createElement("option");
        option.text = servers[i].name;
        option.value = i;
        select.appendChild(option);
    }
    select.addEventListener("change", sltServer_onChange, false);

    // security levels
    var select_level = document.createElement("select");
    select_level.id = "sltLevel";
    var levels = Array("Open", "Confidential", "Admin");
    for (var i in levels) {
        var option = document.createElement("option");
        if (levels[i] == "Confidential") {
            option.selected = "selected";
        }
        option.text = levels[i];
        option.value = levels[i];
        select_level.appendChild(option);
    }

    var table = document.getElementsByTagName("table")[0];
    table = table.rows[1].cells[1].getElementsByTagName("table")[0];
    table = table.getElementsByTagName("table")[0];
    var row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.colSpan = 2;
    cell.align = "center";
    cell.appendChild(breakline);
    cell.appendChild(label);
    cell.appendChild(select);
    cell.appendChild(document.createTextNode(" "));
    cell.appendChild(select_level);
    cell.appendChild(document.createTextNode(" "));
    cell.appendChild(btnShare1);
}

// ___  ____         _
// |  \/  (_)       (_)
// | .  . |_ ___ ___ _  ___  _ __  ___
// | |\/| | / __/ __| |/ _ \| '_ \/ __|
// | |  | | \__ \__ \ | (_) | | | \__ \
// \_|  |_/_|___/___/_|\___/|_| |_|___/

function saveMissions() {
    var server = servers[document.getElementById("sltServer").selectedIndex];

    var btnShare1 = document.getElementById("btnShare1");
    btnShare1.disabled = "true";
    btnShare1.className = "disabled";

    function postMissions(account) {
        var str = document.location.hostname;
        var universe = str.substring(0, str.indexOf("."));
        if (!universe) {
            universe = "orion";
        }
        var acc = server.accounts[universe];
        if (!acc) {
            return false;
        }
        account.name = acc.name;
        account.password = acc.password;

        function extractWord(text, startsWith, endsWith, fromStart) {
            if (fromStart) {
                var i = text.toLowerCase().indexOf(startsWith.toLowerCase());
                var str = text.substr(i + startsWith.length, text.length);
                i = str.toLowerCase().indexOf(endsWith.toLowerCase());
                return str.substr(0, i);
            } else {
                var i = text.toLowerCase().indexOf(endsWith.toLowerCase());
                var str = text.substr(0, i);
                i = str.toLowerCase().lastIndexOf(startsWith.toLowerCase());
                return str.substr(i + startsWith.length, str.length);
            }
        }

        function trim(str) {
            var result = str.replace(/^\s+/, "");
            return result.replace(/\s+$/, "");
        }

        function appendFormElement(form, elemName, type, name, value) {
            var elem = document.createElement(elemName);
            if (type) {
                elem.type = type;
            }
            elem.name = name;
            elem.value = value;
            form.appendChild(elem);
        }

        function extractFirstText(node) {
            var NODE_TEXT = 3;
            while (node.nodeType != NODE_TEXT && node.childNodes.length > 0) {
                node = node.childNodes[0];
            }
            return node.nodeValue;
        }

        MISSION_TRANSPORT_PACKAGES = "Transport Packages";
        MISSION_ASSASSINATION = "Assassination";
        MISSION_TRANSPORT_EXPLOSIVES = "Transport Explosives";
        MISSION_VIP_ACTION_TRIP = "VIP Action Trip";
        MISSION_TRANSPORT_VIP = "Transport VIP";
        MISSION_CLEAN_WH = "Cleaning Wormhole Exit";

        // extract source
        var msgsTable = document.body.getElementsByTagName("table")[2];
        var p = msgsTable.getElementsByTagName("p")[0];
        var source = extractWord(p.innerHTML, "Return to ", "'s", true);

        // initialize variables
        var tables = msgsTable.getElementsByTagName("table");
        var missions = [];
        var when = new Date(utctime).getTime();

        // initialize xml objects
        var xml = document.implementation.createDocument("", "missions", null);
        var xmlMissions = xml.documentElement;
        var collection = xml.createAttribute("collection");
        collection.value = true;
        xmlMissions.attributes.setNamedItem(collection);

        // normal mode
        if (document.body.innerHTML.search("Switch to normal mode") == -1) {
            for (var i = 0; i < tables.length; i++) {
                var msgTable = tables[i];
                if (msgTable.getElementsByTagName("table").length == 0) {
                    continue;
                }

                var mission = {"source": source, "when": when};

                mission.universe = universe.charAt(0).toUpperCase() + universe.substring(1);

                var cell = msgTable.rows[0].cells[0];
                var img = cell.getElementsByTagName("img")[0];
                if (img) {
                    var factionType = extractWord(img.src, "sign_", "_16x16.png", false);
                    if (factionType == "eps" || factionType == "tss") {
                        cell = msgTable.rows[0].cells[1];
                    }
                    mission.faction = factionType;
                }
                mission.type = trim(cell.textContent);

                if (mission.type == MISSION_ASSASSINATION) {
                    var imgSrc = msgTable.rows[1].getElementsByTagName("img")[0].src;
                    mission.opponent = imgSrc.substring(imgSrc.lastIndexOf("/") + 1, imgSrc.lastIndexOf("."));
                }

                var cellCount = msgTable.rows[2].cells.length;
                if ((cellCount == 3) && (mission.type != MISSION_TRANSPORT_VIP)) {
                    mission.amount = extractFirstText(msgTable.rows[2].cells[0]);
                    if (mission.type == MISSION_VIP_ACTION_TRIP) {
                        mission.amount = mission.amount.split(" ")[1];
                    }
                }
                cell = msgTable.rows[2].cells[cellCount - 1];
                mission.pid = cell.getElementsByTagName("div")[0].id;
                mission.pid = mission.pid.substr(1, mission.pid.length);

                text = msgTable.rows[1].cells[2].innerHTML;

                if (!(mission.type == MISSION_ASSASSINATION && mission.amount)) {
                    if (mission.type == MISSION_CLEAN_WH)
                        mission.sector = extractWord(text, "stuck in <B>", "</B>");
                    else
                        mission.sector = extractWord(text, "<B>", "</B> at the coordinates");
                    mission.coords = extractWord(text, "coordinates [<B>", "</B>", true);
                    if (mission.type != MISSION_ASSASSINATION && mission.type != MISSION_CLEAN_WH)
                        mission.destination = extractWord(text, "<B>", "</B> in sector");
                }

                mission.reward = extractWord(text, "<B>", "</B> credits").replace(",", "");
                mission.deposit = extractWord(text, "completed: ", " credits", true).replace(",", "");
                mission.timelimit = extractWord(text, "<B>", "</B> minutes");

                missions.push(mission);

                // append mission to XML
                var xmlMission = xml.createElement("mission");
                var j;
                for (j in mission) {
                    var prop = xml.createElement(j);
                    prop.appendChild(xml.createTextNode(mission[j]));
                    xmlMission.appendChild(prop);
                }
                xmlMissions.appendChild(xmlMission);
            }

            // compact mode
        } else {
            var dataTable = document.getElementsByTagName("table")[6];
            for (var i = 1; i < dataTable.rows.length; i++) {
                var dataRow = dataTable.rows[i];
                var mission = {"source": source, "when": when};

                mission.universe = universe.charAt(0).toUpperCase() + universe.substring(1);

                var cell = dataRow.cells[0];
                var img = cell.getElementsByTagName("img")[0];
                if (img) {
                    var factionType = extractWord(img.src, "sign_", "_16x16.png", false);
                    mission.faction = factionType;
                }

                cell = dataRow.cells[1];
                mission.type = cell.getElementsByTagName("img")[0].alt;

                if (mission.type == MISSION_ASSASSINATION) {
                    var imgSrc = dataRow.cells[1].getElementsByTagName("img")[0].src;
                    mission.opponent = imgSrc.substring(imgSrc.lastIndexOf("/") + 1, imgSrc.lastIndexOf("."));
                }

                if (mission.type != MISSION_TRANSPORT_VIP) {
                    mission.amount = extractFirstText(dataRow.cells[2]);
                    if (mission.amount == "-")
                        mission.amount = undefined;
                }

                mission.pid = dataRow.cells[9].getElementsByTagName("div")[0].id;
                mission.pid = mission.pid.substr(1, mission.pid.length);

                if (!(mission.type == MISSION_ASSASSINATION && mission.amount)) {
                    mission.sector = dataRow.cells[5].innerHTML;
                    mission.coords = dataRow.cells[6].innerHTML;
                    if (mission.type != MISSION_ASSASSINATION && mission.type != MISSION_CLEAN_WH) {
                        mission.destination = dataRow.cells[5].innerHTML;
                        if (mission.destination == "-")
                            mission.destination = undefined;
                    }
                }

                mission.reward = extractFirstText(dataRow.cells[7]);
                mission.reward = mission.reward.replace(/[^0-9]/g, '');
                mission.deposit = extractFirstText(dataRow.cells[8]);
                mission.deposit = mission.deposit.replace(/[^0-9]/g, '');
                mission.timelimit = dataRow.cells[3].innerHTML;

                missions.push(mission);

                // append mission to XML
                var xmlMission = xml.createElement("mission");
                var j;
                for (j in mission) {
                    var prop = xml.createElement(j);
                    prop.appendChild(xml.createTextNode(mission[j]));
                    xmlMission.appendChild(prop);
                }
                xmlMissions.appendChild(xmlMission);
            }
        }

        var form = document.createElement("form");
        form.action = server.url + "/missions_add.php";
        form.method = "post";
        form.target = "missionsAdd";
        if (!showDebug)
            form.style.display = "none";
        var data = new XMLSerializer().serializeToString(xml);
        appendFormElement(form, "textarea", null, "missions", data);
        appendFormElement(form, "input", "text", "acc", account.name);
        appendFormElement(form, "input", "text", "pwd", account.password);
        document.body.appendChild(form);
        frame = document.createElement("iframe");
        frame.name = "missionsAdd";
        if (!showDebug)
            frame.style.display = "none";
        document.body.appendChild(frame);
        form.submit();

    }

    var account = {};
    postMissions(account);
}

function addMissionsShareBtn() {
    var breakline = document.createElement("br");

    var label = document.createElement("b");
    label.appendChild(document.createTextNode("Share missions at: "));

    var btnShare1 = document.createElement("input");
    btnShare1.id = "btnShare1";
    btnShare1.type = "button";
    btnShare1.value = "Share";
    btnShare1.addEventListener("click", saveMissions, false);

    var select = document.createElement("select");
    select.id = "sltServer";
    for (var i = 0; i < servers.length; i++) {
        var option = document.createElement("option");
        option.text = servers[i].name;
        option.value = i;
        select.appendChild(option);
    }
    select.addEventListener("change", sltServer_onChange, false);

    var table = document.getElementsByTagName("table")[0];
    table = table.rows[1].cells[1].getElementsByTagName("table")[0];
    table = table.getElementsByTagName("table")[0];
    var row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.colSpan = 2;
    cell.align = "center";
    cell.appendChild(breakline);
    cell.appendChild(label);
    cell.appendChild(select);
    cell.appendChild(document.createTextNode(" "));
    cell.appendChild(btnShare1);
}

// ______                                 _
// | ___ \                               | |
// | |_/ /__ _ _   _ _ __ ___   ___ _ __ | |_ ___
// |  __// _` | | | | '_ ` _ \ / _ \ '_ \| __/ __|
// | |  | (_| | |_| | | | | | |  __/ | | | |_\__ \
// \_|   \__,_|\__, |_| |_| |_|\___|_| |_|\__|___/
//              __/ |
//             |___/

function stripHTML(code) {
    ret = code.replace(/<[^>]+>/g, '');
    return ret;
}

function savePayments() {
    var server = servers[document.getElementById("sltServer").selectedIndex];
    var level = document.getElementById("sltLevel").value;

    // disable button
    var btnShare1 = document.getElementById("btnShare1");
    btnShare1.disabled = "true";
    btnShare1.className = "disabled";

    // append to invisible form
    function append_input(form, name, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    // account retrieval
    var str = document.location.search;
    str = document.location.hostname;
    var universe = str.substring(0, str.indexOf("."));
    var account = server.accounts[universe];
    if (!account)
        return;

    // loop through checkboxes and see which ones are checked; those that are,
    // send a log to the db
    var table = document.getElementsByTagName("table")[7];
    var rows = table.getElementsByTagName("tr");
    for(var i = 0; i < rows.length; i++) {
        var tds = rows[i].getElementsByTagName("td");
        if (tds.length > 0) {
            var chk = tds[0].getElementsByTagName("input")[0];
            if (chk.checked) {
                var when = stripHTML(tds[1].innerHTML);
                when = new Date(utctime).getTime();
                var type = stripHTML(tds[2].innerHTML);
                var loc = stripHTML(tds[3].innerHTML);
                var pilot = stripHTML(tds[4].innerHTML);
                var receiver = (tds[5].innerHTML == "received" ? 1 : 0);
                var credits = stripHTML(tds[6].innerHTML).replace(/[^0-9]/g, '');
                form = document.createElement("form");
                if (!showDebug)
                    form.style.display = "none";
                form.action = server.url + "/payment_add.php";
                form.method = "post";
                form.target = "paymentsAdd";
                append_input(form, "acc", account.name);
                append_input(form, "pwd", account.password);
                append_input(form, "when", when);
                append_input(form, "type", type);
                append_input(form, "location", loc);
                append_input(form, "pilot", pilot);
                append_input(form, "receiver", receiver);
                append_input(form, "credits", credits);
                append_input(form, "level", level);
                document.body.appendChild(form);
                frame = document.createElement("iframe");
                frame.name = "paymentsAdd";
                if (!showDebug)
                    frame.style.display = "none";
                document.body.appendChild(frame);
                form.submit();
            }
        }
    }
}

function addPaymentShareBtn() {
    // adds checkboxes to all of the
    var table = document.getElementsByTagName("table")[7];
    var rows = table.getElementsByTagName("tr");
    for(var i = 0; i < rows.length; i++) {
        var tds = rows[i].getElementsByTagName("td");
        if (tds.length > 0) {
            var chk = document.createElement("input");
            chk.type = "checkbox";
            chk.value = i;
            tds[0].appendChild(chk);
        }
    }

    // adds the area with the share button below the payments table
    var label = document.createElement("b");
    label.appendChild(document.createTextNode("Share checked payments at: "));

    var btnShare1 = document.createElement("input");
    btnShare1.id = "btnShare1";
    btnShare1.type = "button";
    btnShare1.value = "Share";
    btnShare1.addEventListener("click", savePayments, false);

    var select = document.createElement("select");
    select.id = "sltServer";
    for (var i = 0; i < servers.length; i++) {
        var option = document.createElement("option");
        option.text = servers[i].name;
        option.value = i;
        select.appendChild(option);
    }
    select.addEventListener("change", sltServer_onChange, false);

    // security levels
    var select_level = document.createElement("select");
    select_level.id = "sltLevel";
    var levels = Array("Open", "Confidential", "Admin");
    for (var i in levels) {
        var option = document.createElement("option");
        if (levels[i] == "Confidential") {
            option.selected = "selected";
        }
        option.text = levels[i];
        option.value = levels[i];
        select_level.appendChild(option);
    }

    table = document.getElementsByTagName("table")[6];
    var cell = table.getElementsByTagName("tr")[0].getElementsByTagName("td")[0];
    var breakline = document.createElement("br");
    cell.appendChild(breakline);
    var center = document.createElement("center");
    center.appendChild(label);
    center.appendChild(select);
    center.appendChild(document.createTextNode(" "));
    center.appendChild(select_level);
    center.appendChild(document.createTextNode(" "));
    center.appendChild(btnShare1);
    cell.appendChild(center);
}

// ___  ___      _
// |  \/  |     (_)
// | .  . | __ _ _ _ __
// | |\/| |/ _` | | '_ \
// | |  | | (_| | | | | |
// \_|  |_/\__,_|_|_| |_|

if(enableCombatShare && document.URL.indexOf('combat_details.php') >= 0) addCombatShareBtn();
if(enableHackShare && document.URL.indexOf('hack.php') >= 0) addHackShareBtn();
if(autoshare && document.URL.indexOf('hack.php') >= 0) saveHack();
if(enableMissionsShare && document.URL.indexOf('bulletin_board.php') >= 0) addMissionsShareBtn();
if(enablePaymentShare && document.URL.indexOf('overview_payment_log.php') >= 0) addPaymentShareBtn();
if(autoshare && document.URL.indexOf('combat_details.php')) saveCombat();