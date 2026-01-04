// ==UserScript==
// @name         BGG Trade Manager
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modifies the collection view on Board Game Geek to conveniently project shipping costs. Important note: for this script to run you must filter your collection for game with the "For Trade" flag, include the columns "private information" and "title" and then follow the permalink to that view.
// @author       Kempeth
// @match        https://www.boardgamegeek.com/collection/user/*?*title*ownership*trade=1*
// @icon         https://cf.geekdo-static.com/icons/favicon2.ico
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424031/BGG%20Trade%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/424031/BGG%20Trade%20Manager.meta.js
// ==/UserScript==

const KEY_UNIT_CURRENCY = "unit_currency";
const KEY_UNIT_WEIGHT = "unit_weight";
const KEY_UNIT_SIZE = "unit_size";
var units = {
    currency: GM_getValue(KEY_UNIT_CURRENCY, "USD"),
    weight: GM_getValue(KEY_UNIT_WEIGHT, "kg"),
    size: GM_getValue(KEY_UNIT_SIZE, "mm")
};
var packagings = JSON.parse(GM_getValue("packagings", "[]"));
//console.log("loaded packagings: ", packagings);
var shippings = JSON.parse(GM_getValue("shippings", "[]"));
//console.log("loaded shippings: ", shippings);
var username = "";



/**
Wires up an input so it automatically updates the script variable and GreaseMonkey storage
*/
function bindInputToStorage(fieldid, keyid, valueHolder, valueIndex)
{
    var input = document.getElementById(fieldid);
    input.value = valueHolder[valueIndex];
    input.onchange = () => {
        //console.log("script value = " + valueHolder[valueIndex]);
        //console.log("input value = " + input.value);
        GM_setValue(keyid, input.value)
        valueHolder[valueIndex] = input.value;
        //console.log("script value = " + valueHolder[valueIndex]);
    };
}

/**
Wires up an input so it automatically updates the script list variable and GreaseMonkey storage.
Applies data transformations on read and write if specified.
*/
function bindInputToListStorage(fieldid, item, key, onchange, fromstorage = (x) => x, tostorage = (x) => x)
{
    var input = document.getElementById(fieldid);
    input.value = fromstorage(item[key]);
    input.onchange = () => {
        //console.log("script value = " + item[key]);
        //console.log("input value = " + input.value);
        item[key] = tostorage(input.value);
        //console.log("script value = " + item[key]);
        onchange();
    };
}



/**
Converts an array into a comma separated list.
*/
function array2csv(arr)
{
    return arr.join(', ');
}
/**
Converts a comma separated list into an array.
*/
function csv2array(txt)
{
    return JSON.parse('[' + txt + ']');
}
/**
Evaluates whether a packaging is eligible for shipping at a given rate.
*/
function eligible(package, shipping)
{
    return (shipping.maxsum == 0 || shipping.maxsum >= (package.outer.reduce((sum, dim) => dim + sum)))
    && shipping.maxdim[0] >= package.outer[0] && shipping.maxdim[1] >= package.outer[1] && shipping.maxdim[2] >= package.outer[2];
}



function savePackagings()
{
    // only save those that are not null
    var storing = packagings.filter(p => p != null);
    GM_setValue("packagings", JSON.stringify(storing));
}

function makePackagingDeleteHandler(row, id)
{
    return () => {
        row.parentNode.removeChild(row);
        packagings[id] = null;
        savePackagings();
    };
}

function addPackagesRow(id)
{
    var packaging = {
        name: "New Packaging",
        weight: 0,
        cost: 0,
        inner: [990, 590, 590],
        outer: [1000, 600, 600],
    };
    if (packagings.length > id) packaging = packagings[id]; // fetch existing packaging
    else packagings.push(packaging); // store new packaging

    var row = document.createElement('tr');
    row.innerHTML = "<td><input type=\"text\" id=\"trade_pack_name" + id + "\" /></td>" +
        "<td><input type=\"number\" style=\"text-align: right\" step=\"0.001\" id=\"trade_pack_weight" + id + "\" /></td>"+
        "<td><input type=\"number\" style=\"text-align: right\" step=\"0.01\" id=\"trade_pack_cost" + id + "\" /></td>"+
        "<td><input type=\"text\" style=\"text-align: center\" id=\"trade_pack_inner" + id + "\" /></td>"+
        "<td><input type=\"text\" style=\"text-align: center\" id=\"trade_pack_outer" + id + "\" /></td>"+
        "<td><img src=\"https://cf.geekdo-static.com/images/icons/silkicons/delete.png\" title=\"Delete this packaging\" id=\"trade_pack_delete" + id + "\" style=\"bottom:2px; position:relative;\" /></td>";
    document.getElementById('trade_packaging').appendChild(row);

    bindInputToListStorage("trade_pack_name" + id, packaging, 'name', savePackagings);
    bindInputToListStorage("trade_pack_weight" + id, packaging, 'weight', savePackagings, x => parseFloat(x).toFixed(3), txt => parseFloat(txt));
    bindInputToListStorage("trade_pack_cost" + id, packaging, 'cost', savePackagings, x => parseFloat(x).toFixed(2), txt => parseFloat(txt));
    bindInputToListStorage("trade_pack_inner" + id, packaging, 'inner', savePackagings, array2csv, csv2array);
    bindInputToListStorage("trade_pack_outer" + id, packaging, 'outer', savePackagings, array2csv, csv2array);
    var btn = document.getElementById("trade_pack_delete" + id);
    btn.onclick = makePackagingDeleteHandler(row, id);
}



function saveShippings()
{
    // only save those that are not null
    var storing = shippings.filter(p => p != null);
    storing.forEach(s => { s.tiers = s.tiers.filter(t => t != null); });
    //console.log("saving shippings: ", storing);
    GM_setValue("shippings", JSON.stringify(storing));
}

function makeShippingDeleteHandler(row, id)
{
    return () => {
        row.parentNode.removeChild(row);
        shippings[id] = null;
        saveShippings();
    };
}

function makeShippingTierAddHandler(shipping, id)
{
    return () => {
        addShippingTierRow(shipping, id, shipping.tiers.length);
        saveShippings();
    };
}

function makeShippingTierDeleteHandler(id, tid)
{
    return () => {
        var weight = document.getElementById("trade_ship" + id + "_tier_weight" + tid);
        weight.parentNode.removeChild(weight);
        var cost = document.getElementById("trade_ship" + id + "_tier_cost" + tid);
        cost.parentNode.removeChild(cost);
        var del = document.getElementById("trade_ship" + id + "_tier_del" + tid);
        del.parentNode.removeChild(del);

        shippings[id].tiers[tid] = null;
        saveShippings();
    };
}

function addShippingTierRow(shipping, id, tid)
{
    //console.log(shipping, id, tid);
    var shippingtier = {
        maxweight: 0,
        cost: 0,
    };
    if (shipping.tiers.length > tid) shippingtier = shipping.tiers[tid]; // fetch existing tier
    else shipping.tiers.push(shippingtier); // store new tier

    var weights = document.getElementById("trade_shiptier_weights" + id);
    var weight = document.createElement('input');
    weight.type = "number";
    weight.step = "0.001";
    weight.id = "trade_ship" + id + "_tier_weight" + tid;
    weight.style.textAlign = "right";
    weight.style.display = "block";
    weight.style.width = "100%";
    weight.style.marginTop = "3px";
    weight.value = shippingtier.maxweight;
    weights.appendChild(weight);

    var costs = document.getElementById("trade_shiptier_costs" + id);
    var cost = document.createElement('input');
    cost.type = "number";
    cost.step = "0.01";
    cost.id = "trade_ship" + id + "_tier_cost" + tid;
    cost.style.textAlign = "right";
    cost.style.display = "block";
    cost.style.width = "100%";
    cost.style.marginTop = "3px";
    cost.value = shippingtier.cost;
    costs.appendChild(cost);

    var dels = document.getElementById("trade_shiptier_deletes" + id);
    var del = document.createElement('img');
    del.id = "trade_ship" + id + "_tier_del" + tid;
    del.src = "https://cf.geekdo-static.com/images/icons/silkicons/money_delete.png";
    del.title = "Delete this shipping tier";
    del.style.display = "block";
    del.style.margin = "5px 0 6px 0";
    del.onclick = makeShippingTierDeleteHandler(id, tid);
    dels.appendChild(del);

    bindInputToListStorage("trade_ship" + id + "_tier_weight" + tid, shippingtier, 'maxweight', saveShippings, x => parseFloat(x).toFixed(3), txt => parseFloat(txt));
    bindInputToListStorage("trade_ship" + id + "_tier_cost" + tid, shippingtier, 'cost', saveShippings, x => parseFloat(x).toFixed(2), txt => parseFloat(txt));
}

function addShippingRow(id)
{
    var shipping = {
        name: "New Shipping",
        destinations: "",
        maxdim: [ 1000, 600, 600 ],
        maxsum: 900,
        tiers: [
            {
                maxweight: 0,
                cost: 0,
            },
        ],
    };
    if (shippings.length > id) shipping = shippings[id]; // fetch existing shipping
    else shippings.push(shipping); // store new shipping

    var row = document.createElement('tr');
    row.innerHTML =
        "<td valign=\"top\"><input type=\"text\"   style=\"width:100%\" id=\"trade_ship_name" + id + "\" /></td>"+
        "<td valign=\"top\"><input type=\"text\"   style=\"width:100%\" id=\"trade_ship_dest" + id + "\" /></td>"+
        "<td valign=\"top\"><input type=\"text\"   style=\"width:100%; text-align: center\" id=\"trade_ship_maxdim" + id + "\" /></td>"+
        "<td valign=\"top\"><input type=\"number\" style=\"width:100%; text-align: right\" id=\"trade_ship_maxsum" + id + "\" /></td>"+
        "<td valign=\"top\" id=\"trade_shiptier_weights" + id + "\"></td>"+
        "<td valign=\"top\" id=\"trade_shiptier_costs" + id + "\"></td>"+
        "<td valign=\"top\" id=\"trade_shiptier_deletes" + id + "\" width=\"1\"></td>"+
        "<td valign=\"top\" width=\"1\">"+
        "<img id=\"trade_ship_tier_add" + id + "\" style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/money_add.png\" title=\"Add new shipping tier\" border=\"0\"> "+
        "<img id=\"trade_ship_delete" + id + "\" style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/delete.png\" title=\"Delete this shipping\" border=\"0\">"+
        "</td>";
    document.getElementById('trade_shipping').appendChild(row);

    bindInputToListStorage("trade_ship_name" + id, shipping, 'name', saveShippings);
    bindInputToListStorage("trade_ship_dest" + id, shipping, 'destinations', saveShippings);
    bindInputToListStorage("trade_ship_maxdim" + id, shipping, 'maxdim', saveShippings, array2csv, csv2array);
    bindInputToListStorage("trade_ship_maxsum" + id, shipping, 'maxsum', saveShippings, x => parseFloat(x), txt => parseFloat(txt));

    var btn = document.getElementById("trade_ship_delete" + id);
    btn.onclick = makeShippingDeleteHandler(row, id);

    for (var tid = 0; tid < shipping.tiers.length; tid++)
    {
        addShippingTierRow(shipping, id, tid);
    }

    var addtier = document.getElementById("trade_ship_tier_add" + id);
    addtier.onclick = makeShippingTierAddHandler(shipping, id);
}

function addOutputUI()
{
    var parent = document.getElementById('columnfilter').parentNode;

    var run = document.createElement('a');
    run.href = "javascript://";
    //run.innerHTML = "<img alt=\"Trade Display\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/arrow_switch.png\" border=\"0\" align=\"absmiddle\"> Trade Display";
    run.innerText = "Trade Output »"
    run.title = "Format your items for trade geeklists";
    run.setAttribute("onclick", "Toggle( 'trademanager_output' );");
    parent.getElementsByTagName('span')[0].appendChild(run);
    parent.getElementsByTagName('span')[0].appendChild(document.createTextNode("\u00A0\u00A0\u00A0"));



    var config = document.createElement('div');
    config.id = "trademanager_output";
    config.style.display = "none";
    config.className = "collection_filters";
    config.innerHTML = "<div class=\"collectionfilter_commandbar\">"+
        "<a href=\"javascript://\" onclick=\"$('trademanager_config').style.display='none';\"><img style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/cross.png\" alt=\"Close Trade Manager Output\" border=\"0\"></a> "+
        "Kempeth's Trade Manager Output"+
        "</div>"+
        "<style type=\"text/css\">"+
        ".markup { display: inline-block; max-width: 0; max-height: 0; overflow:hidden }"+
        "</style>"+
        "<div class=\"collectionfilter_body\">"+

        "<table id=\"tradeoutput_type\" class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td colspan=\"2\"><b>Geeklist</b></td></tr>"+
        "<tr><td>Geeklist Type</td><td width=\"100%\"><select id=\"trade_geeklisttype\"><option>Math Trade</option><option>Auction</option></select></td></tr>"+
        "<tr><td>Geeklist ID</td><td width=\"100%\"><input id=\"trade_geeklistid\" type=\"number\" title=\"The id of the geeklist you're going to post this to. Optional\"></td></tr>"+
        "</tbody></table>"+

        "<table id=\"tradeoutput_shipping\" class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td colspan=\"2\"><b>Shipping</b></td></tr>"+
        "<tr><td>No Shipping?</td><td width=\"100%\"><input id=\"trade_isnoshipping\" type=\"checkbox\" title=\"Check this if all items are handed over in person instead of being shipped.\"></td></tr>"+
        "<tr><td>Your Share</td><td><input id=\"trade_yourshare\" type=\"number\" title=\"This is the amount of shipping you cover. For auctions this is typically zero. But for Math Trades this is usually the equivalent of the cheapest shipping for the eligible trade area.\"></td></tr>"+
        "<tr><td>Handover</td><td><textarea id=\"trade_handover\" title=\"This is where you can specify when and where you're available to hand over the games in no shipping exchanges.\"></textarea></td></tr>"+
        "</tbody></table>"+

        "<table id=\"tradeoutput_auction\" class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td colspan=\"2\"><b>Auction</b></td></tr>"+
        "<tr><td>Custom End Date</td><td width=\"100%\"><input id=\"trade_auctionenddate\" type=\"date\" title=\"Some auctions have a predetermined end date. Others leave it up to you. To skip this, set it to a date in the past.\"></td></tr>"+
        "<tr><td>Custom End Time</td><td><input id=\"trade_auctionendtime\" type=\"text\" title=\"Most people prefer to say 'random time' because it prevents sniping and leaves them flexible to end the auction when they have time.\"></td></tr>"+
        "<tr><td>Payment Types</td><td><input id=\"trade_paymenttypes\" type=\"text\" size=\"100\" title=\"Which kind of payment types you accept.\"></td></tr>"+
        "</tbody></table>"+

        "</div>" +
        "<div id=\"tradeoutput\"></div>";
    parent.appendChild(config);

    // Wire unit settings
    bindInputToStorage('trade_currency', KEY_UNIT_CURRENCY, units, 'currency');
    bindInputToStorage('trade_weight', KEY_UNIT_WEIGHT, units, 'weight');
    bindInputToStorage('trade_size', KEY_UNIT_SIZE, units, 'size');

    // Wire packaging settings
    var addpackaging = document.getElementById('trade_addpackaging');
    addpackaging.onclick = () => {
        addPackagesRow(packagings.length);
    };
    for (var id = 0; id < packagings.length; id++)
    {
        addPackagesRow(id);
    }

    // Wire packaging settings
    var addshipping = document.getElementById('trade_addshipping');
    addshipping.onclick = () => {
        addShippingRow(shippings.length);
    };
    for (id = 0; id < shippings.length; id++)
    {
        addShippingRow(id);
    }
}

function addConfigUI() {
    var parent = document.getElementById('columnfilter').parentNode;

    var toggle = document.createElement('a');
    toggle.href="javascript://";
    toggle.innerText = "Trade Config »";
    toggle.title = "Configue Kempeth's Trade Manager";
    toggle.setAttribute("onclick", "Toggle( 'trademanager_config' );");
    parent.getElementsByTagName('span')[0].appendChild(toggle);
    parent.getElementsByTagName('span')[0].appendChild(document.createTextNode("\u00A0\u00A0\u00A0"));

    var config = document.createElement('div');
    config.id = "trademanager_config";
    config.style.display = "none";
    config.className = "collection_filters";
    config.innerHTML = "<div class=\"collectionfilter_commandbar\">"+
        "<a href=\"javascript://\" onclick=\"$('trademanager_config').style.display='none';\"><img style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/cross.png\" alt=\"Close Trade Manager Configuration\" border=\"0\"></a> "+
        "Kempeth's Trade Manager"+
        "</div>"+
        "<style type=\"text/css\">"+
        ".markup { display: inline-block; max-width: 0; max-height: 0; overflow:hidden }"+
        "</style>"+
        "<div class=\"collectionfilter_body\">"+

        "<table id=\"trade_packaging\" class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td colspan=\"6\"><b>Packaging</b>"+
        " <a href=\"javascript://\" id=\"trade_addpackaging\"><img style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/add.png\" title=\"Add new packaging\" border=\"0\"></a>"+
        "</td></tr>"+
        "<tr><td>Name</td><td>Weight</td><td>Cost</td><td>Internal Size</td><td>External Size</td><td>Commands</td></tr>"+
        "</tbody></table>"+

        "<table id=\"trade_shipping\" class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td colspan=\"6\">"+
        "<b>Shipping</b>"+
        " <img id=\"trade_addshipping\" style=\"bottom:2px; position:relative;\" src=\"https://cf.geekdo-static.com/images/icons/silkicons/add.png\" title=\"Add new shipping\" border=\"0\">"+
        "</td></tr>"+
        "<tr>"+
        "<td width=\"200\">Name</td><td>Destinations</td>"+
        "<td width=\"100\" title=\"the maximum size a package may have for this shipping rate.\">Max. Dimensions</td>"+
        "<td width=\"100\" title=\"if there is a restriction on the sum of all package dimensions. 0 means no restriction.\">Max. Sum</td>"+
        "<td width=\"100\">Max. Weight</td><td width=\"100\">Cost</td><td colspan=\"2\">Commands</td></tr>"+
        "</tbody></table>"+

        "<table class=\"collfilter_table\" style=\"margin-top:5px;\" width=\"100%\"><tbody>"+
        "<tr><td><b>Units</b></td></tr>"+
        "<tr>"+
        "<td width=\"100\"><b><label class=\"fwn\" for=\"trade_currency\">Currency</label></b></td>"+
        "<td><input type=\"text\" id=\"trade_currency\" /></td>"+
        "</tr>"+
        "<tr>"+
        "<td width=\"100\"><b><label class=\"fwn\" for=\"trade_weight\">Weight</label></b></td>"+
        "<td><input type=\"text\" id=\"trade_weight\" /></td>"+
        "</tr>"+
        "<tr>"+
        "<td width=\"100\"><b><label class=\"fwn\" for=\"trade_size\">Size</label></b></td>"+
        "<td><input type=\"text\" id=\"trade_size\" /></td>"+
        "</tr>"+
        "</tbody></table>"+

        "<p>Item parameters need to be included in the private information comment in the following format:<br/><code>${<br/>"+
        "\"value\": <i>a value for the item</i>,<br/>"+
        "\"dimensions\": [<i>a comma separated list of dimensions, ordered from longest to shortest</i>],<br/>"+
        "\"weight\": <i>the physical weight of the game</i>,<br/>"+
        "$}</code><br/>"+
        "For example <code>${ \"value\": 25, \"dimensions\": [274,190,67], \"weight\":0.59 }$</code> means you value this game at EUR 25, that it is 274x190x67mm in size and weighs 0.59kg (assuming you configured the tool with EUR, mm and kg under <b>Units</b>).</p>"+

        "</div>";
    parent.appendChild(config);

    // Wire unit settings
    bindInputToStorage('trade_currency', KEY_UNIT_CURRENCY, units, 'currency');
    bindInputToStorage('trade_weight', KEY_UNIT_WEIGHT, units, 'weight');
    bindInputToStorage('trade_size', KEY_UNIT_SIZE, units, 'size');

    // Wire packaging settings
    var addpackaging = document.getElementById('trade_addpackaging');
    addpackaging.onclick = () => {
        addPackagesRow(packagings.length);
    };
    for (var id = 0; id < packagings.length; id++)
    {
        addPackagesRow(id);
    }

    // Wire packaging settings
    var addshipping = document.getElementById('trade_addshipping');
    addshipping.onclick = () => {
        addShippingRow(shippings.length);
    };
    for (id = 0; id < shippings.length; id++)
    {
        addShippingRow(id);
    }
}

function createItemOutput(row)
{
}

function fetchForTradeCollection()
{
    //https://boardgamegeek.com/xmlapi2/collection?username=Kempeth&trade=1&showprivate=1&version=1

    var request = new XMLHttpRequest();
    request.open("GET", "https://boardgamegeek.com/xmlapi2/collection?username=" + username + "&trade=1&showprivate=1&version=1", true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4)
        {
            //console.log(request.responseText);
            createListOutput(request.responseXML);
        }
    };
}

function xpathToArray(xpathResult)
{
    var res = [];
    if (xpathResult.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE || xpathResult.resultType == XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE)
    {
        for (var r = 0; r < xpathResult.snapshotLength; r++)
        {
            res.push(xpathResult.snapshotItem(r));
        }
    }
    return res;
}

function createListOutput(xml)
{
    //console.log(xml);
    var items = xml.documentElement.getElementsByTagName('item');
    //console.log(items);

    var xpathItems = xml.evaluate( "./item", xml.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    console.log(xpathItems);

    for (var i = 0; i < xpathItems.snapshotLength; i++)
    {
        var item = xpathItems.snapshotItem(i);
        if (item.getAttribute('objecttype') == 'thing')
        {
            //console.log(item.innerHTML);
            var bggid = item.getAttribute('objectid');
            var name = xml.evaluate( "./name", item, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.innerHTML;
            var version = xml.evaluate( "./version/item", item, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
            var thumbnail = xml.evaluate( "./thumbnail", item, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.innerHTML;
            var thumbnailid = thumbnail.match(/\/pic(\d+)?\./)[1];
            if (version != null)
            {
                var versionid = version?.getAttribute('id');
                var versionname = xml.evaluate( "./name", version, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue?.getAttribute('value');
                var languages = xpathToArray(xml.evaluate( "./link[@type='language']", version, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null )).map(l => l.getAttribute('value'));

                thumbnail = xml.evaluate( "./thumbnail", item, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.innerHTML;
                thumbnailid = thumbnail.match(/\/pic(\d+)?\./)[1];
            }
            //console.log(name, bggid, versionname, versionid, languages);
            console.log(name, bggid, thumbnail, thumbnailid);

            var row = document.createElement('table');
            row.style.padding = "0.5em";
            row.style.margin = "0.5em";
            row.style.border = "1px solid silver";
            row.style.width = "100%";
            var html = "<tbody><tr>";

            // Floating Image
            html += "<td valign=\"top\"><div style=\"width: 100px; height: 100px; text-align: center;\"><img style=\"max-width: 100%; max-height: 100%\" src=\"" + thumbnail + "\"></div></td>";
            html += "<td width=\"100%\">";

            // Item Title
            html += "<div style=\"font-size: 20pt; font-weight: bold\">" + name + "</div>";

            // Output condition
            if (true)
            {
                html += "<span style=\"font-size: 15pt\"><b>Condition:</b> " + "Unknown" + "</span>" +
                    "<img src=\"https://cf.geekdo-static.com/images/star_yellow.gif\">"+
                    "<img src=\"https://cf.geekdo-static.com/images/star_white.gif\">"+
                    "<img src=\"https://cf.geekdo-static.com/images/star_yellow.gif\">"+
                    "<img src=\"https://cf.geekdo-static.com/images/star_white.gif\">"+
                    "<img src=\"https://cf.geekdo-static.com/images/star_yellow.gif\">"
                if (true)
                {
                    html += "(" + "no comment" + ")";
                }
                html += "<br><br>";
            }

            // Output version
            if (version != null)
            {
                html += "<b>Version:</b> <a href=\"https://boardgamegeek.com/boardgameversion/" + versionid + "\">" + versionname + "</a><br>";
                html += "<b>Languages:</b> " + languages.join(', ') + "<br>";
                html += "<b>Language dependency:</b> " + "Unspecified" + "<br>";
                html += "<br>";
            }

            // additional information

            // images

            // auction parameters

            // shipping / handover

            html += "</td></tr></tbody>";
            row.innerHTML = html;
            document.getElementById('tradeoutput').append(row);
        }
    }
}

(function() {
    'use strict';

    addConfigUI();
    addOutputUI();
    // Your code here...
    //alert("initializing trade helper");

    var list = document.getElementById('collectionitems');
    var rows = list.getElementsByTagName('tr');
    for (var r = 0; r < rows.length; r++)
    {
        var row = rows[r];
        if (row.id)
        {
            var privateinfo = row.getElementsByClassName('collectiontable_ownership');

            //console.log(privateinfo);
            var html = privateinfo.length > 0 ? privateinfo[0].innerHTML : null;
            //console.log(html);
            var match = html != null ? html.match(/\$\{.+\}\$/) : null;
            //console.log(match);
            var data = {weight:0, packweight:0, dimensions:[0,0,0]};
            if (match)
            {
                data = match[0];
                data = data.substring(1, data.length - 1);
                //console.log(data);
                data = JSON.parse(data);
                //console.log(data);

                var objectname = row.getElementsByClassName('collection_objectname')[0].getElementsByTagName('a')[0].innerText;

                var possibleParcels = packagings
                    .filter(p => p.inner[0] > data.dimensions[0] && p.inner[1] > data.dimensions[1] && p.inner[2] > data.dimensions[2])
                    .sort((a, b) => a.outer[0] + a.outer[1] + a.outer[2] - b.outer[0] - b.outer[1] - b.outer[2]);

                if (possibleParcels.length > 0)
                {
                    var packaging = possibleParcels[0];

                    var totalweight = data.weight + packaging.weight;

                    var possibleShippings = shippings
                        .filter(shipping => eligible(packaging, shipping));

                    //display: inline-block; max-width: 0; max-height: 0; overflow:hidden
                    var adhtml = "";
                    adhtml += "<b>" + objectname + "</b><span class=\"markup\">this is hidden</span><br />";

                    adhtml += "<b>Parcel:</b> " + possibleParcels[0].name + " (" + parseFloat(possibleParcels[0].cost).toFixed(2) + " " + units.currency + ")<br />";

                    adhtml += "<b>Total weight:</b> " + Math.round(totalweight*1000)/1000 + units.weight + " ... " + Math.round(totalweight*1.25*1000)/1000 + units.weight + "<br/>";

                    possibleShippings.forEach(shipping => {
                        var orderedtiers = shipping.tiers.filter(t => t.maxweight > totalweight * 1.25).sort((a, b) => a.maxweight - b.maxweight);
                        if (orderedtiers.length > 0)
                        {
                            var lightesttier = orderedtiers[0];
                            adhtml += "<b>" + shipping.name + "</b> (" + shipping.destinations + ")<br/>" + lightesttier.cost.toFixed(2) + " " + units.currency + "<br/>";
                        }
                    });
                }
            }

            //console.log(adhtml);
            row.innerHTML += "<td>" + adhtml + "</td>";
        }
        else if (row.parentNode == list || row.parentNode.parentNode == list)
        {
            //row.parentNode.removeChild(row);
        }
    }
})();

var f_getUsername = function()
{
    var el_username = document.getElementsByClassName("mygeek-dropdown-username");
    //console.log(el_username);

    if (el_username.length < 1)
    {
        //console.log('.');
        window.setTimeout(f_getUsername, 100);
    }
    else
    {
        el_username = el_username.item(0);
        //console.log(el_username);
        //console.log(el_username.innerText);
        username = el_username.innerText;
        fetchForTradeCollection();
    }
}
f_getUsername();
