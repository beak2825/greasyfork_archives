// ==UserScript==
// @name           Macro Combat Compacter
// @namespace      kol.interface.unfinished
// @description    Compacts the divisions shown when using fight macros in KoL, displaying only the last.
// @include        http://*kingdomofloathing.com/fight.php*
// @include        http://127.0.0.1:*/fight.php*
// @version        1.21
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/4213/Macro%20Combat%20Compacter.user.js
// @updateURL https://update.greasyfork.org/scripts/4213/Macro%20Combat%20Compacter.meta.js
// ==/UserScript==

//Version 1.21
// - add @grant
//Version 1.2
// - added round counter and attack/defense notice compaction
//Version 1.1
// - also now shows effect gains/losses
//Version 1.0

function compact() {
    var hrs = document.evaluate( '//hr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    var stuff = [];
    var ids = 1;
	extractAdjustments(hrs.snapshotLength);
    // gather contents
    for (var i=hrs.snapshotLength-1;i>=0;i--) {
        var hr2 = hrs.snapshotItem(i);
        var itemids = "";
        stuff[i] = document.createElement('div');
        stuff[i].setAttribute('class','compactDiv');
        while (hr2.previousSibling && hr2.previousSibling.tagName!='HR' && hr2.previousSibling.tagName!='BR') {
            var n = hr2.previousSibling;
            n.parentNode.removeChild(n);
            if (stuff[i].firstChild)
                stuff[i].insertBefore(n,stuff[i].firstChild);
            else
                stuff[i].appendChild(n);
        }
        stuff[i].setAttribute('style','display:none'); 
        hr2.parentNode.insertBefore(stuff[i],hr2);
        hr2.addEventListener('click',expandDivH,true);
        hr2.setAttribute('title','click to display round '+(i+1));
        var r = findAcquires(stuff[i]);
        if (r.length>0) {
            for (var j=0;j<r.length;j++) {
                itemids = itemids + " " + ids;
                r[j].setAttribute('id','compactAcquire_'+ids);
                ids++;
                stuff[i].parentNode.insertBefore(r[j],stuff[i]);
            }
            stuff[i].setAttribute('compactAcquire',itemids);
        }
    }
}

// delete any duplicated item/meat acquisitions
function removeAcquires(alist) {
    var aa = alist.split(' ');
    for (var i=0;i<aa.length;i++) {
        if (aa[i]) {
            var r = document.getElementById('compactAcquire_'+aa[i]);
            if (r) {
                r.parentNode.removeChild(r);
            }
        }
    }
    
}

// expand a single div and delete any item/meat acquisitions
function expandDiv(d) {
    var s = d.getAttribute("style");
    if (s.match(/display\s*:\s*none\s*;?/i)) {
        d.setAttribute("style",s.replace(/display\s*:\s*none\s*;?/i,''));
        var itemlist = d.getAttribute('compactAcquire');
        if (itemlist) {
            removeAcquires(itemlist);
        }
    }
}

// handler for introduced divs
function expandDivH() {
    var d = this.previousSibling;
    if (d && d.tagName=='DIV') {
        expandDiv(d);
    }
    this.removeEventListener('click',expandDivH,true);
}

// expand all divs handler
function expandAllDivs(e) {
    var ds = document.getElementsByClassName('compactDiv');
    if (ds) {
        for (var i=0;i<ds.length;i++) {
            expandDiv(ds[i]);
        }
    }
}

// change the jump to bottom button to an expand all rounds button
function addExpandAll() {
    var b = document.getElementById('jumptobot');
    b.addEventListener('click',expandAllDivs,false);
    b.setAttribute('title','click to expand all rounds');
    b.innerHTML = '(expand rounds)';
}

// return clones of all item/meat acquisitions from the supplied root element
function findAcquires(doc) {
    var r = [];
    var msg = ['.//td[text()="You acquire an item: "]',
               './/td[text()="You acquire an effect: "]',
               './/td[text()="You lose an effect: "]'];

    for (var m=0;m<msg.length;m++) {
        var ps = document.evaluate(msg[m],doc,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
        if (ps.snapshotLength>0) {
            for (var i=0;i<ps.snapshotLength;i++) {
                var p = ps.snapshotItem(i).parentNode;
                while (p && p.tagName!='CENTER')
                    p = p.parentNode;
                if (p) {
                    r[r.length] = p.cloneNode(true);
                }
            }
        }
    }
    ps = document.evaluate('.//td[contains(text(),"Meat.")]',doc,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    if (ps.snapshotLength>0) {
        for (var i=0;i<ps.snapshotLength;i++) {
            var p = ps.snapshotItem(i);
            if (p.innerHTML && p.innerHTML.match(/You gain [0-9]+ Meat./)) {
                p = p.parentNode;
                while (p && p.tagName!='CENTER')
                    p = p.parentNode;
                if (p) {
                    r[r.length] = p.cloneNode(true);
                }
            }
        }
    }
    return r;
}

function accumulateTitle(n,text) {
	if (n.nodeType==3) n = n.parentNode;
    var t = n.getAttribute('title');
    if (t) {
        n.setAttribute('title',t+'  '+text);
    } else
        n.setAttribute('title',text);
}

function hideAtkDef(p) {
	p.parentNode.removeChild(p);
}

function extractAdjustments(extrar) {
    var atk=Number(GM_getValue('atk',0)),def=Number(GM_getValue('def',0));
    var delta=0,deltd=0;
    var r=Number(GM_getValue('round',0))+extrar;
    var psa = document.evaluate('.//td[contains(text(),"Monster attack power reduced by ")]',document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var ia=0;ia<psa.snapshotLength;ia++) {
        var p = psa.snapshotItem(ia);
        var delt = Number(p.innerHTML.replace(/[^0-9]+/g,''));
        delta += delt;
        p = p.parentNode;
        while (p && p.tagName!='CENTER')
            p = p.parentNode;
        if (p) {
            if (p.previousSibling) 
                accumulateTitle(p.previousSibling,'Monster attack power reduced by '+delt+'.');
			hideAtkDef(p);
        }
    }
    psa = document.evaluate('.//td[contains(text(),"Monster defense reduced by ")]',document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var ia=0;ia<psa.snapshotLength;ia++) {
        var p = psa.snapshotItem(ia);
        var delt = Number(p.innerHTML.replace(/[^0-9]+/g,''));
        deltd += delt;
        p = p.parentNode;
		while (p && p.tagName!='CENTER')
			p = p.parentNode;
		if (p) {
            if (p.previousSibling) {
                accumulateTitle(p.previousSibling,'Monster defense reduced by '+delt+'.');
			}
			hideAtkDef(p);
		}
    }
    r++;
    GM_setValue('round',r);
    atk += delta;
    def += deltd;
    if (atk!=0 || def!=0 || r>1) {
        var d = document.getElementById('compactatkdef');
        var ps;
        if (!d) {
            ps = document.evaluate('.//td/b[text()="Combat!"]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
            if (ps.singleNodeValue) {
                d = document.createElement('div');
                d.setAttribute('style','display:inline;float:left;font-size:small;');
                d.setAttribute('id','compactatkdef');
                ps.singleNodeValue.parentNode.insertBefore(d,ps.singleNodeValue);
            } else
                return;
        }
        GM_setValue('atk',atk);
        GM_setValue('def',def);
        if (delta!=0 || deltd!=0) {
            d.setAttribute('title','Round '+r+':  monster attack reduced by '+delta+' and defense by '+deltd+'.');
        } else {
            d.setAttribute('title','Round '+r+'.');
        }
        var c = (r>1) ? '\u00A0('+r+') ' : '\u00A0';
		if (atk>0) c = c + 'A: -'+atk+' ';
		if (def>0) c = c + 'D: -'+def;
        if (d.firstChild)
            d.replaceChild(document.createTextNode(c),d.firstChild);
        else 
            d.appendChild(document.createTextNode(c));
    }
}

if (window.location.search && window.location.search.indexOf('ireallymeanit')>=0) {
    GM_setValue('atk',0);
    GM_setValue('def',0);
    GM_setValue('round',0);
} else if (document.evaluate('.//p[text()="It gets the jump on you."]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue) {
    GM_setValue('atk',0);
    GM_setValue('def',0);
    GM_setValue('round',0);
}

if (document.getElementById('jumptobot')) {
    compact();
    addExpandAll();
} else {
	extractAdjustments(0);
}
