// ==UserScript==
// @name          Zamiel's KoL Scripts - Monster Level Dropdown
// @description   v0.3 - Changes the ML device link on the charpane into a dropdown menu.
// @namespace     http://www.realultimatepower.com/
// @include       *kingdomofloathing.com/charpane.php*
// @include       *127.0.0.1:*charpane.php*
// @version 0.0.1.20140812160330
// @downloadURL https://update.greasyfork.org/scripts/4139/Zamiel%27s%20KoL%20Scripts%20-%20Monster%20Level%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/4139/Zamiel%27s%20KoL%20Scripts%20-%20Monster%20Level%20Dropdown.meta.js
// ==/UserScript==

/*

Script notes:

- This script changes the detuned radio, MCD, or Annoy-o-Tron link on the charpane into a dropdown menu for easy access.
- The dropdown menu will still be there even if your device is off.
- You must turn your respective device on at least once for the script to "capture" it and detect which moon sign you are under.

Known Bugs:

- None; please PM me if you find any!

Shoutouts:

- This script is a modified version of Philip's MCD script (he has since retired from KoL). Thanks Phillip!
- The password hash snatching was ripped off from clump's QuickUse script. Thanks clump!
- The moon sign detection, Annoy-o-Tron parts, and basically everything that makes the functions work with all 3 devices was completely written by Clump. He's a total badass.

Version History:

- v0.3 - 17 Mar 09 - Clump fixed the MCD not going to 11. The Mafia bug is also fixed.
- v0.2 - 16 Mar 09 - Clump helped me out; there is now moon sign detection and it works with all 3 devices.
- v0.1 - 13 Mar 09 - This is the first version of my first script. It only works with the detuned radio.

*/

var DetunedRadio, AnnoyoTron, MCD, select, loadingImg;
findWhich();

function getPwdHash() {
    var page = document.documentElement.innerHTML;
    var find = 'pwdhash = ';
    if (page.indexOf(find) >= 0) {
        var i = page.indexOf(find);
        var j = find.length;
        var ps = page.substr(i+j+2);
        var foundit = page.substr(i+j+1,ps.indexOf('"')+1);
        return foundit;
    } 
    return "";
}

function getPlayerNameFromCharpane() {
    var username = document.getElementsByTagName("b");
    if (!username || username.length < 1) return false;
    username = username[0];
    if (!username) return false;
    username = username.firstChild;
    if (!username) return false;
    // in full mode the link is <a><b>Name</b></a>
    // in compact mode it's <b><a>Name</a></b>
    // so have to handle this, and also can use it to tell
    // whether it's in compact mode or not.
    var fullmode = true;
    while (username && username.nodeType == 1)
    {
        username = username.firstChild;
        fullmode = false;
    }
    if (!username) return false;
    username = username.nodeValue;
    if (!username) return false;
    username = username.toLowerCase();
    return username;
}


function findWhich() {
	// check for ascension
    var pn = getPlayerNameFromCharpane();
    if (document.evaluate("//img[contains(@src,'http://images.kingdomofloathing.com/otherimages/inf_small.gif')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
        GM_setValue(pn+'_mcd','none');
    }

	// check for existing
	if (!checkAllDevices('none',pn+'_mcd')) {
		var mcd = GM_getValue(pn+'_mcd','none');
		//GM_log("stored mcd for " +pn+" is "+mcd);
		checkAllDevices(mcd,pn+'_mcd');
	}
}

function checkAllDevices(mcd,keyv) {
	DetunedRadio=findMLDevice(mcd,"'whichitem=2682'","radio","inv_use.php?pwd=" + getPwdHash() + "&whichitem=2682","Detuned Radio",changeDetunedRadio);
	if (!DetunedRadio) {
		MCD=findMLDevice(mcd,"'canadia.php?place=machine'","MCD","canadia.php?place=machine","Mind Control",changeMCD);
		if (!MCD) {
			AnnoyoTron=findMLDevice(mcd,"'gnomes.php?place=machine'","AnnoyoTron","gnomes.php?place=machine","Annoy-o-Tron 5k",changeAnnoyoTron);
			if (AnnoyoTron) {
				GM_setValue(keyv,'AnnoyoTron');
				return true;
			}
		} else {
			GM_setValue(keyv,'MCD');
			return true;
		}
	} else {
		GM_setValue(keyv,'radio');
		return true;
	}
	return false;
}

function findMLDevice(mcdtype,urlsearch,type,addurl,addtext,addhandler)
{
    var mcd = document.evaluate("//a[contains(@href,"+urlsearch+")]/following-sibling::b", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if (!mcd)
    {
        // try looking compact-mode-style
        mcd = document.evaluate("//a[contains(@href,"+urlsearch+")]/../..//b", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    
    // appears to be off
    if (!mcd)
    {
        if (mcdtype==type) {
            mcd=addCharpaneBox(addurl,addtext);
            replaceCharpaneLink(mcd,addhandler,((type=='MCD') ? 11 : 10));
        } 
    }
    else {
        replaceCharpaneLink(mcd,addhandler,((type=='MCD') ? 11 : 10));
    }
    return mcd;
}


function addCharpaneBox(href,text)
{
    var mcd;
    // compact mode: add it directly under the "Adv:" row
    var adv = document.evaluate("//td[contains(.,'Adv:')]/ancestor::tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (adv)
    {
        // we're in compact mode
        // put it below "Ronin" if it's there
        var row = document.evaluate("//td[contains(.,'Ronin:') or contains(.,'Hardcore')]/ancestor::tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!row)
            row = adv;
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.style.textAlign = "right";
        var link = document.createElement('a');
        link.href = href;
        link.target = "mainpane";
        link.appendChild(document.createTextNode("DR"));
        td.appendChild(link);
        td.appendChild(document.createTextNode(":"));
        tr.appendChild(td);
        td = document.createElement('td');
        td.style.textAlign = "left";
        mcd = document.createElement('b');
        mcd.appendChild(document.createTextNode('0'));
        td.appendChild(mcd);
        tr.appendChild(td);
        row.parentNode.insertBefore(tr, row.nextSibling);
    }
    else
    {
        // we're in full mode
        // add it directly under the table that has the adventures counter
        adv = document.evaluate("//img[contains(@src,'hourglass.gif')]/ancestor::table", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!adv)
            return;
        ronin = document.evaluate("//font[contains(.,'Ronin:') or contains(.,'Hardcore')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var font = document.createElement('font');
        font.size = 2;
        var link = document.createElement('a');
        link.href = href;
        link.target = "mainpane";
        link.appendChild(document.createTextNode(text));
        font.appendChild(link);
        font.appendChild(document.createTextNode(": "));
        mcd = document.createElement('b');
        mcd.appendChild(document.createTextNode('0'));
        font.appendChild(mcd);
        if (ronin)
        {
            ronin.parentNode.insertBefore(font, ronin.nextSibling);
            ronin.parentNode.insertBefore(document.createElement('br'), ronin.nextSibling);
            ronin.parentNode.insertBefore(document.createElement('br'), ronin.nextSibling);
        }
        else
        {
            adv.parentNode.insertBefore(document.createElement('br'), adv.nextSibling);
            adv.parentNode.insertBefore(font, adv.nextSibling);
            adv.parentNode.insertBefore(document.createElement('br'), adv.nextSibling);
        }
    }
    return mcd
}

function replaceCharpaneLink(mcd,handler,max)
{
    var sel = parseInt(mcd.firstChild.nodeValue);
    var form = document.createElement('form');
    select = document.createElement('select');
    for (var i = 0; i <= max; i++)
    {
        var option = document.createElement('option');
        option.value = i;
        if (i == sel)
            option.selected = true;
        option.appendChild(document.createTextNode(i));
        select.appendChild(option);
    }
    select.setAttribute('style','font-size:10px;vertical-align:middle;');
    select.addEventListener("change", handler, false);
    form.appendChild(select);
    form.style.display = "inline";
    loadingImg = document.createElement('img');
    loadingImg.src = "data:image/gif;base64,R0lGODlhEgASAJECAMDAwNvb2%2F%2F%2F%2FwAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFCgACACwAAAAAEgASAAACMpSPqQmw39o7IYjo6qpacpt8iKhoITiiG0qWnNGepjCv7u3WMfxqO0%2FrqVa1CdCIRBQAACH5BAUKAAIALAcAAQAIAAYAAAIOVCKZd2osAFhISmcnngUAIfkEBQoAAgAsCwADAAYACAAAAg5UInmnm4ZeAuBROq%2BtBQAh%2BQQFCgACACwLAAcABgAIAAACD5QTJojH2gQAak5jKdaiAAAh%2BQQFCgACACwHAAsACAAGAAACDpQdcZgKIFp4Lzq6RF0FACH5BAUKAAIALAMACwAIAAYAAAIOFCCZd2osQlhISmcnngUAIfkEBQoAAgAsAQAHAAYACAAAAg4UIHmnm4ZeCuFROq%2BtBQAh%2BQQFCgACACwBAAMABgAIAAACD5QBJojH2kQIak5jKdaiAAA7";
    loadingImg.setAttribute('style','display:none; vertical-align:middle;');
    mcd.parentNode.replaceChild(loadingImg, mcd);
    loadingImg.parentNode.insertBefore(form, loadingImg);
}

function changeDetunedRadio(e)
{
    loadingImg.style.display = "inline";
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://" + location.host + "/inv_use.php",
        headers: {"Content-type": "application/x-www-form-urlencoded"},
        data: "pwd=" + getPwdHash() + "&whichitem=2682&tuneradio=" + select.value,
        onload: function(){ location.reload(); }
    });
}

function changeMCD(e)
{
	loadingImg.style.display = "inline";
	GM_xmlhttpRequest({
		method: "POST",
		url: "http://" + location.host + "/canadia.php",
		headers: {"Content-type": "application/x-www-form-urlencoded"},
		data: "action=changedial&whichlevel=" + select.value,
		onload: function(){ location.reload(); }
	});
}

function changeAnnoyoTron(e)
{
    loadingImg.style.display = "inline";
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://" + location.host + "/gnomes.php",
        headers: {"Content-type": "application/x-www-form-urlencoded"},
        data: "&action=changedial&whichlevel=" + select.value,
        onload: function(){ location.reload(); }
    });
}
