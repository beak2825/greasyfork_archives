// ==UserScript==
// @name           WFMultiFleetCommander
// @namespace      sk.seko
// @description    Control group of fleets from Logistic panel.
// @include        http://*.war-facts.com/logistics.php
// @version        3.0
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/378341/WFMultiFleetCommander.user.js
// @updateURL https://update.greasyfork.org/scripts/378341/WFMultiFleetCommander.meta.js
// ==/UserScript==

// Version history:
// 1.0	initial version
// 1.1  remove system id as a target - not supported by wf anymore; fixed fleet id parsing
// 1.2  added trade station / outpost as a target (to refuel)
// 1.3  added fleet (and global or local coordinates) as a target (to assault, support, reinforce etc)
// 1.4  added system / planet name as fleet specification (matches all fleets at the system/planet); some small fixes
// 1.5  fixed typo for fleet global
// 1.6  fixed for new UI
// 2.0  fixed abort; fixed planet target; fixed fleet name parsing; fixed minor typos; fixed refuel
// 3.0  (Cohenman) - Added fleet option management 


/* 
Target:

g#1,2,3 or 1,2,3 = global x,y,z
p#12345 or 12345 = planet #
c#12345          = colony #
l#1,2,3          = local x,y,z
w#1,2,3          = wormhole, local x,y,z
r#12345          = refuel at trade station #
fl#1,2,3#123     = fleet 123, local x,y,z
fg#1,2,3#123     = fleet 123, global x,y,z


Fleets:

1234             = fleet ID
123-234          = range of fleets
s#Naidar         = all fleets at all systems which name contains 'Naidar'
p#^Beta-A4-      = all fleets at all planets which name starts with 'Beta-A4-'
attack           = fleets (with names) containing substring 'attack' (case sensitive)
^Attack-[0-9]+   = fleets starting with 'Attack-' and followed by a number
23,24,30-45,TT-  = combination of all above, delimited by comma
*/

// Regexes:
var globalRegex = /^\s*(?:g#)?\s*(\-*\d+)[,;\s]+(\-*\d+)[,;\s]+(\-*\d+)/
var planetRegex = /^\s*(?:p#)?\s*(\d+)/
var colonyRegex = /^\s*c#\s*(\d+)/
var localRegex = /^\s*l#\s*(\-*\d+)[,;\s]+(\-*\d+)[,;\s]+(\-*\d+)/
var whRegex = /^\s*w#\s*(\-*\d+)[,;\s]+(\-*\d+)[,;\s]+(\-*\d+)/
var refuelRegex = /^\s*r#\s*(\d+)/
var fleetLocalRegex = /^\s*fl#\s*(\-*\d+)[,;\s]+(\-*\d+)[,;\s]+(\-*\d+)#(\d+)/
var fleetGlobalRegex = /^\s*fg#\s*(\-*\d+)[,;\s]+(\-*\d+)[,;\s]+(\-*\d+)#(\d+)/
// other regexes:
var commaRegex = /\s*,\s*/
var rangeRegex = /\s*-\s*/
var trimRegex = /^\s+|\s+$/g


function myTrim(xxx) {
    return xxx ? xxx.replace(trimRegex, '') : xxx;
}

function myUnique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function loadXMLDoc(method, url){
	//alert('issuing >' + url + '<')
	GM_xmlhttpRequest({
		method : method,
		url : url,
		headers: {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/xml,text/xml,text/html',
			'Content-Type': 'application/x-www-form-urlencoded'
			},
		onload : function(rsp) {},
		onerror: function(rsp) {}
	});
}

function moveThemRaw(target, fleets, mtype) {
    //alert('moving ' + fleets + ' to ' + target + ' as mission ' + mtype)
    // this is base url
	var url = 'http://' + window.location.hostname + '/ajax/newUI_fleet.php?';
    // printable target (just to display it)
    ptarget = target
    if (t = target.match(globalRegex)) {
		// http://www.war-facts.com/ajax/newUI_fleet.php?launch=1&verbose=1&x=26&y=-768&z=-53&tpos=global&mtype=explore&fleet=635
        url += 'launch=1&mtype='+mtype;
        url += '&tpos=global&x='+t[1]+'&y='+t[2]+'&z='+t[3];
        ptarget = t[1]+','+t[2]+','+t[3]+' global';
    } else if (t = target.match(planetRegex)) {
		// http://www.war-facts.com/ajax/newUI_fleet.php?launch=1&verbose=1&tworld=243494&mtype=explore&fleet=488
        url += 'launch=1&mtype='+mtype;
        url += '&tworld='+t[1];
        ptarget = 'planet #' + t[1];
    } else if (t = target.match(colonyRegex)) {
        url += 'launch=1&mtype='+mtype;
        url += '&tcolony2='+t[1];
        ptarget = 'colony #' + t[1];
    } else if (t = target.match(localRegex)) {
		// http://www.war-facts.com/ajax/newUI_fleet.php?launch=1&verbose=1&x=1&y=2&z=3&tpos=local&mtype=explore&fleet=637
        url += 'launch=1&mtype='+mtype;
        url += '&tpos=local&x='+t[1]+'&y='+t[2]+'&z='+t[3];
        ptarget = t[1]+','+t[2]+','+t[3]+' local';
    } else if (t = target.match(whRegex)) {
		// http://www.war-facts.com/ajax/newUI_fleet.php?launch=1&verbose=1&x=-19&y=-97&z=24&tpos=local&tsystem=17738&mtype=jump&fleet=494
        mtype = 'jump';
        url += 'launch=1&mtype='+mtype;
        url += '&tpos=local&x='+t[1]+'&y='+t[2]+'&z='+t[3];
        ptarget = t[1]+','+t[2]+','+t[3]+' local/hyperjump';
    } else if (t = target.match(refuelRegex)) {
        url = 'http://' + window.location.hostname + '/outposttrade.php?outpost='+t[1]+'&refuel=1';
        mtype = 'refuel';
        ptarget = 'outpost #'+t[1];
    } else if (t = target.match(fleetLocalRegex)) {
        url += 'launch=1&mtype='+mtype;
        url += '&tpos=local&x='+t[1]+'&y='+t[2]+'&z='+t[3];
        url += '&tfleet='+t[4];
        url += 'mregistration=none&fratConfirm=0';
        ptarget = t[1]+','+t[2]+','+t[3]+' local/fleet #'+t[4];
    } else if (t = target.match(fleetGlobalRegex)) {
        url += 'launch=1&mtype='+mtype;
        url += '&tpos=global&x='+t[1]+'&y='+t[2]+'&z='+t[3];
        url += '&tfleet='+t[4];
        url += 'mregistration=none&fratConfirm=0';
        ptarget = t[1]+','+t[2]+','+t[3]+' global/fleet #'+t[4];
    } else {
        alert('Unknown target: ' + target)
        return
    }
    try {
        for (var k in fleets) {
            loadXMLDoc('GET', url + '&fleet=' + fleets[k]);
        }
        alert('Fleets launched: ' + fleets.join(', ') + ',\nMission: ' + mtype + ',\nTarget: ' + ptarget);
    } catch (ex) {
        alert('Exception ' + ex.name + ' - ' + ex.message);
    }
    return;
}

function setThemRaw(fleets, stance, empire, refuse, attack, answer, support) {

    // this is base url
    var url = 'http://' + window.location.hostname + '/ajax/newUI_fleet.php?';
    for (var fleet in fleets)
    {
       tmpurl = url + "fleet=" + fleets[fleet];
       var value = "&setOption=stance&value=" + stance;
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=empire_owned&value=" + empire;
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=refuse&value=" + refuse;
       loadXMLDoc('GET', tmpurl + value);        
        
       value = "&setOption=aenemy&value=" + attack[0];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=aneutral&value=" + attack[1];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=afaction&value=" + attack[2];
       loadXMLDoc('GET', tmpurl + value);           
       value = "&setOption=aempire&value=" + attack[3];
       loadXMLDoc('GET', tmpurl + value);

       value = "&setOption=dfriend&value=" + answer[0];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=dneutral&value=" + answer[1];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=dfaction&value=" + answer[2];
       loadXMLDoc('GET', tmpurl + value);           
       value = "&setOption=dfaction&value=" + answer[3];
       loadXMLDoc('GET', tmpurl + value);        

       value = "&setOption=sfriend&value=" + support[0];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=sneutral&value=" + support[1];
       loadXMLDoc('GET', tmpurl + value);
       value = "&setOption=sfaction&value=" + support[2];
       loadXMLDoc('GET', tmpurl + value);           
       value = "&setOption=sempire&value=" + support[3];
       loadXMLDoc('GET', tmpurl + value);        
    }
    return;
}

function abortThemRaw(fleets) {
    //GM_log('aborting ' + fleets)
	// http://www.war-facts.com/ajax/newUI_fleet.php?abort=1&fleet=488
    try {
        var baseurl = 'http://' + window.location.hostname + '/ajax/newUI_fleet.php?';
        for (var k in fleets) {
            loadXMLDoc('GET', baseurl + 'fleet=' + fleets[k] + '&abort=1');
        }
        alert('Missions aborted: ' + fleets.join(', '));
    } catch (ex) {
        alert('Exception ' + ex.name + ' - ' + ex.message);
    }
    return;
}

function parseFleets(fleets) {
    var ids = new Array();
    var farray = myTrim(fleets).split(commaRegex);
    for (var j = 0; j < farray.length; ++j) {
        f = myTrim(farray[j])
        // numeric fleet spec (single or range)
        if (/^[\s\d-]+$/.test(f)) {
            var range = f.split(rangeRegex);
            if (range.length >= 2) {
                for (var i = parseInt(range[0]); i <= parseInt(range[1]); ++i) {
                    ids.push(i);
                }
            } else {
                ids.push(myTrim(f));
            }
        // system specified
        } else if (/^s#.*$/.test(f)) {
            var elems = document.evaluate("//a/@href[contains(.,'/extras/view_system.php\?system=')]/..",
                    document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            if (elems) {
                fla = elems.iterateNext()
                while (fla)  {
                    grps = fla.href.match(/system=(\d+)\&fleet=(\d+)/)
                    if (grps) {
                        if (fla.textContent.match(f.substring(3))) {
                            var fleetid = parseInt(grps[2]);
                            ids.push(fleetid)
                        }
                    }
                    fla = elems.iterateNext()
                }
            }
        // planet specified
        } else if (/^p#.*$/.test(f)) {
            var elems = document.evaluate("//a/@href[contains(.,'/extras/view_planet.php\?planet=')]/..",
                    document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            if (elems) {
                fla = elems.iterateNext()
                while (fla)  {
                    grps = fla.href.match(/planet=(\d+)\&fleet=(\d+)/)
                    if (grps) {
                        if (fla.textContent.match(f.substring(3))) {
                            var fleetid = parseInt(grps[2]);
                            ids.push(fleetid)
                        }
                    }
                    fla = elems.iterateNext()
                }
            }
        // fallback - name specification is assumed
        } else {
            var elems = document.evaluate("//a/@href[contains(.,'fleet.php\?fleet=')]/..",
                    document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            if (elems) {
                fla = elems.iterateNext()
                while (fla)  {
                    if (fla.textContent.match(f)) {
                        var fleetid = parseInt(fla.href.match(/fleet=(\d+)/)[1]);
                        ids.push(fleetid)
                    }
                    fla = elems.iterateNext()
                }
            }
        }
    }
    return myUnique(ids).sort();
}

function moveThem() {
	xfleets = document.getElementById('mfcFleets').value;
    if (!xfleets) {
        alert('Missing input fleets!')
        return
    }
    xfleets = parseFleets(xfleets)
    if (!xfleets || xfleets.length <= 0) {
        alert('No matching fleets')
        return
    }
    mtype = document.getElementById('mtype').value;
    if (! mtype) {
        mtype = 'transfer'
    }
    if (mtype == 'abort') {
        abortThemRaw(xfleets);
    } else {
		target = document.getElementById('mfcTarget').value;
        if (!target) {
            alert('Missing input target')
            return
        }
        moveThemRaw(myTrim(target), xfleets, mtype);
    }
}

function checkBoxValue(value)
{
    if (document.getElementById(value).checked == true)
        return 1;
    return 0;
}

function setThem() {
  	xfleets = document.getElementById('mfcFleets').value;
    if (!xfleets) 
    {
        alert('Missing input fleets!');
        return;
    }
    
    xfleets = parseFleets(xfleets);
    if (!xfleets || xfleets.length <= 0) 
    {
        alert('No matching fleets');
        return;
    }
    
    var stance = document.getElementById('stance').value;
    var empire = document.getElementById('empire_owned').value;
    var refuse = document.getElementById('refuse').value;

    var attack = 
    [
        checkBoxValue('aenemy'),
        checkBoxValue('aneutral'),
        checkBoxValue('afaction'),
        checkBoxValue('aempire'),
    ];

    var answer = 
    [
        checkBoxValue('dfriend'),
        checkBoxValue('dneutral'),
        checkBoxValue('dfaction'),
        checkBoxValue('dempire'),
    ];

    var support = 
    [
        checkBoxValue('sfriend'),
        checkBoxValue('sneutral'),
        checkBoxValue('sfaction'),
        checkBoxValue('sempire'),
    ];    

    setThemRaw(xfleets, stance, empire, refuse, attack, answer, support);
    alert("Finish Updating " + xfleets.length + " Fleets");
}




function onHelpToggle() {
  var row1 = document.getElementById('helprow');
  if (row1) {
    row1.style.display = (row1.style.display == 'none') ? '' : 'none';
  }
}

/* User Interface */

function createUI_table() {
    var table = document.createElement('div');
    table.setAttribute('class', 'padding5 highlight box fullwidth');
    return table;
}

function createUI_row1() {
    var row1 = document.createElement('div');
    row1.setAttribute('class', 'padding5 highlight box fullwidth');
    row1.innerHTML = "\
    Fleets: <input class='darkinput' type='text' maxlength='150' size='35' id='mfcFleets' value='' />&nbsp;\
    Mission: <select class='darkselect' name='mtype' id='mtype'>\
        <option value=''>(default)</option>\
        <option value='abort'>Abort</option>\
        <option value='transfer'>Transfer</option>\
        <option value='explore'>Explore</option>\
        <option value='assault'>Assault</option>\
        <option value='conquer'>Conquer</option>\
        <option value='support'>Support</option>\
        <option value='reinforce'>Reinforce</option>\
        <option value='transport'>Transport</option>\
        <option value='colonize'>Colonize</option>\
        <option value='jump'>Hyperjump</option></select>&nbsp;\
    Target: <input class='darkinput' type='text' maxlength='150' size='25'  id='mfcTarget'  value=''/>&nbsp;";
	var inp1 = document.createElement('input');
	inp1.setAttribute('class', 'darkbutton');
	inp1.setAttribute('type', 'submit');
	inp1.setAttribute('value', 'Move!');
	inp1.addEventListener("click", moveThem, false);
	row1.appendChild(inp1);
	var inp1 = document.createElement('input');
	inp1.setAttribute('class', 'darkbutton');
	inp1.setAttribute('type', 'button');
	inp1.setAttribute('value', 'Help!');
	inp1.addEventListener("click", onHelpToggle, false);
	row1.appendChild(inp1);
    return row1;
}

function createUI_row2() {
    var row2 = document.createElement('div');
    row2.setAttribute('class', 'dark padding5');
    row2.setAttribute('id', 'helprow')
    row2.setAttribute('style','display:none');
    var column2 = document.createElement('td');
    column2.setAttribute('class', 'head')
    row2.innerHTML = "\
    <u><b>Fleets</b></u> (example usages):<ul>\
    <li><b>4321</b> for fleet id,</li>\
    <li><b>4321 - 4332</b> for range of fleet ids,</li>\
    <li><b>s#Naidar</b> for all fleets at all systems which name contains 'Naidar',</li>\
    <li><b>p#^Beta-A4-</b> for all fleets at all planets which name starts with 'Beta-A4-',</li>\
    <li><b>abcd</b> for fleet name or substring (<u>regular expressions supported!</u>),</li>\
    <li>or all above combined, separated by commas.</li></ul>\
    For example,<ul><li>2133, 2200-2231, ^probe-[0-9]+\</li></ul></br>selects fleets with\
    specified ids and/or fleet prefixed with string <i>probe-</i> followed by a number.<br/><br/>\
    <u><b>Target:</b></u> (exmaple usages): <ul>\
	<li><b>x,y,z</b> or <b>g#x,y,z</b> for global coordinates,</li> \
    <li><b>12345</b> or <b>p#12345</b> for planet id,</li> \
    <li><b>c#12345</b> for colony id,</li> \
    <li><b>l#1,2,3</b> for local coordinates,</li> \
    <li><b>w#1,2,3</b> for wormhole (local) coordinates,</li> \
    <li><b>r#12345</b> for outpost # (to refuel),</li> \
    <li><b>fl#1,2,3#123</b> for local coordinates and target fleet id,</li> \
    <li><b>fg#1,2,3#123</b> for global coordinates and target fleet id</li></ul><br/><br/> \
    <u><b>Mission:</b></u> Defaults to <i>transfer</i> except wormhole, which defaults to <i>jump</i>.<br/><br/>\
    <u><b>Move!:</b></u> Move fleets to specified target, or aborts current mission if <i>abort</i> mission is selected.";
    return row2
}

function createUI_row3() {
    var row1 = document.createElement('div');
    row1.setAttribute('class', 'padding5 highlight box fullwidth');
    row1.innerHTML = "\
    <div class='light padding5 width50 box left'>\
      <span>Stance:</span> <select id='stance' class='darkselect'>\
        <option value='kamikaze'>Kamikaze</option>\
        <option value='aggressive'>Aggressive</option>\
        <option value='offensive'>Offensive</option>\
        <option value='defensive' selected>Defensive</option>\
        <option value='flee'>Avoid Combat</option>\
      </select>\
    <br/>\
      <span>Fleet Control:</span> <select id='empire_owned' class='darkselect'>\
        <option value='0' selected>National</option>\
        <option value='1'>Confederate</option>\
      </select>\
    <br/>\
      <span>Reinforcements:</span> <select id='refuse'class='darkselect'>\
        <option value='0'>Accept</option>\
        <option value='1' selected>Refuse</option>\
      </select>\
    </div>\
    <div class='width50 left padding5'>\
	<div class='padding5 highlight bold'>Automatic Response:</div>\
		<div class='fullwidth padding5 light tbborder'>\
			<span>Attack at will:</span>\
			<span>Enemies</span><input  type='checkbox' class='radio ' id='aenemy' value='1'>\
			<span>Neutrals</span><input  type='checkbox' class='radio ' id='aneutral' value='1'>\
			<span>Non-Faction</span><input  type='checkbox' class='radio ' id='afaction' value='1'>\
			<span>Non-Empire</span><input  type='checkbox' class='radio ' id='aempire' value='1'>\
		</div>\
		<div class='fullwidth padding5 light tbborder'>\
			<span>Answer distress calls:</span>\
			<span>Friends</span><input  type='checkbox' class='radio' id='dfriend' value='1'>\
			<span>Neutrals</span><input  type='checkbox' class='radio' id='dneutral' value='1'>\
			<span>Faction</span><input  type='checkbox' class='radio' id='dfaction' value='1'>\
			<span>Empire</span><input  type='checkbox' class='radio' id='dempire' value='1'>\
		</div>\
		<div class='fullwidth padding5 light tbborder'>\
			<span>Answer support calls:</span>\
			<span>Friends</span><input  type='checkbox' class='radio' id='sfriend' value='1'>\
			<span>Neutrals</span><input  type='checkbox' class='radio' id='sneutral' value='1'>\
			<span>Faction</span><input  type='checkbox' class='radio' id='sfaction' value='1'>\
			<span>Empire</span><input  type='checkbox' class='radio' id='sempire' value='1'>\
		</div>\
    ";
    var inp1 = document.createElement('input');
   	inp1.setAttribute('class', 'darkbutton');
    inp1.setAttribute('type', 'submit');
    inp1.setAttribute('value', 'Change');
    inp1.addEventListener("click", setThem, false);
    row1.appendChild(inp1);
    
    return row1;
}

function createUI_header() {
    var header = document.createElement('div')
    header.setAttribute('class', 'dark padding5 box fullwidth bold centertext');
    header.innerHTML = 'Multiple Fleet Navigation'
    return header
}

function findUI_insertPoint() {
    return document.evaluate("//text()[contains(.,'Rally Point Manager')]/../..",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function Main()
{
    var table = createUI_table();
    table.appendChild(createUI_row1());
    table.appendChild(createUI_row2());
    table.appendChild(createUI_row3());
    var baseElement = findUI_insertPoint();
    insertAfter(document.createElement('br'), baseElement);
    insertAfter(table, baseElement);
    insertAfter(createUI_header(), baseElement);
}
        
Main();