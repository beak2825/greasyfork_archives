//
// ==UserScript==
// @name          Q Stat
// @include       http://www.conquerclub.com/player.php?mode=find
// @include       https://www.conquerclub.com/player.php?mode=find
// @version       1409222238
// @namespace	  Qyool
// @description   Qyool
// @downloadURL https://update.greasyfork.org/scripts/5220/Q%20Stat.user.js
// @updateURL https://update.greasyfork.org/scripts/5220/Q%20Stat.meta.js
// ==/UserScript==
var version = '1409222238';

/************************** CORE *********************/
function getElementsByClassName(oElm, strTagName, strClassName, exact)
 {
  var arrElements = (strTagName == "*" && document.all)? document.all : oElm.getElementsByTagName(strTagName);
  var arrReturnElements = new Array();
  strClassName = strClassName.replace(/\-/g, "\\-");
  //var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s)");
  var oElement;
  for(var i=0; i<arrElements.length; i++)
   {
    oElement = arrElements[i];
    if (exact)
     {
      if(oElement.className == strClassName) arrReturnElements.push(oElement);
     }else{
      if(oElement.className.has(strClassName)) arrReturnElements.push(oElement);
     }
   }
  return (arrReturnElements);
 }
function nextSib(node)
{
 var tempNode=node.nextSibling;
 while(tempNode.nodeType!=1) tempNode=tempNode.nextSibling;
 return tempNode;
}
function getXDomainRequest() {
 var xdr = null;
 if (window.XDomainRequest) {
     xdr = new XDomainRequest();
 } else if (window.XMLHttpRequest) {
     xdr = new XMLHttpRequest();
 } else {
     alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
 }
 return xdr;
}


/*
SortTable
version 2
7th April 2007
Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

Instructions:
Download this file
Add <script src="sorttable.js"></script> to your HTML
Add class="sortable" to any table you'd like to make sortable
Click on the headers to sort

Thanks to many, many people for contributions and suggestions.
Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
This basically means: do what you want with it.
*/


var stIsIE = /*@cc_on!@*/false;

sorttable = {

makeSortable: function(table) {
  // Safari doesn't support table.tHead, sigh
  if (table.tHead == null) table.tHead = table.getElementsByTagName('thead')[0];
  if (table.tHead.rows.length != 1) return; // can't cope with two header rows
  
  // work through each column and calculate its type
  headrow = table.tHead.rows[0].cells;
  for (var i=0; i<headrow.length; i++) {
    // manually override the type with a sorttable_type attribute
    if (!headrow[i].className.match(/\bsorttable_nosort\b/)) { // skip this col
     mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
     if (mtch) { override = mtch[1]; }
     //alert(i+' '+mtch);
     if (mtch && typeof sorttable["sort_"+override] == 'function') {
       headrow[i].sorttable_sortfunction = sorttable["sort_"+override];
     } else {
       headrow[i].sorttable_sortfunction = sorttable.guessType(table,i);
     }
     // make it clickable to sort
     headrow[i].sorttable_columnindex = i;
     headrow[i].sorttable_tbody = table.tBodies[0];
     dean_addEvent(headrow[i],"click", function(e) {

        if (this.className.search(/\bsorttable_sorted\b/) != -1) {
          // if we're already sorted by this column, just reverse the table, which is quicker 
          sorttable.reverse(this.sorttable_tbody);
          this.className = this.className.replace('sorttable_sorted',
                                                  'sorttable_sorted_reverse');
          this.removeChild(document.getElementById('sorttable_sortfwdind'));
          sortrevind = document.createElement('span');
          sortrevind.id = "sorttable_sortrevind";
          sortrevind.innerHTML = stIsIE ? '&nbsp<font face="webdings">5</font>' : '&nbsp;&#x25B4;';
          this.appendChild(sortrevind);
          return;
        }
        if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
          // if we're already sorted by this column in reverse, just re-reverse the table, which is quicker
          sorttable.reverse(this.sorttable_tbody);
          this.className = this.className.replace('sorttable_sorted_reverse',
                                                  'sorttable_sorted');
          this.removeChild(document.getElementById('sorttable_sortrevind'));
          sortfwdind = document.createElement('span');
          sortfwdind.id = "sorttable_sortfwdind";
          sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
          this.appendChild(sortfwdind);
          return;
        }
        
        // remove sorttable_sorted classes
        theadrow = this.parentNode;
        forEach(theadrow.childNodes, function(cell) {
          if (cell.nodeType == 1) { // an element
            cell.className = cell.className.replace('sorttable_sorted_reverse','');
            cell.className = cell.className.replace('sorttable_sorted','');
          }
        });
        sortfwdind = document.getElementById('sorttable_sortfwdind');
        if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
        sortrevind = document.getElementById('sorttable_sortrevind');
        if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }
        
        this.className += ' sorttable_sorted';
        sortfwdind = document.createElement('span');
        sortfwdind.id = "sorttable_sortfwdind";
        sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
        this.appendChild(sortfwdind);

       // build an array to sort. This is a Schwartzian transform thing,
       // i.e., we "decorate" each row with the actual sort key,
       // sort based on the sort keys, and then put the rows back in order
       // which is a lot faster because you only do getInnerText once per row
       row_array = [];
       col = this.sorttable_columnindex;
       rows = this.sorttable_tbody.rows;
       for (var j=0; j<rows.length; j++) {
         row_array[row_array.length] = [sorttable.getInnerText(rows[j].cells[col]), rows[j]];
       }
       row_array.sort(this.sorttable_sortfunction);
       
       tb = this.sorttable_tbody;
       for (var j=0; j<row_array.length; j++) {
         tb.appendChild(row_array[j][1]);
       }
       
       delete row_array;
     });
   }
  }
},

guessType: function(table, column) {
  // guess the type of a column based on its first non-blank row
  sortfn = sorttable.sort_alpha;
  for (var i=0; i<table.tBodies[0].rows.length; i++) {
    text = sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);
    if (text != '')
     {
      if (text.match(/^-?[?$?]?[\d,.]+%?$/)) return sorttable.sort_numeric;
     }
  }
  return sortfn;
},

getInnerText: function(node) {
  // gets the text we want to use for sorting for a cell.
  // strips leading and trailing whitespace.
  // this is *not* a generic getInnerText function; it's special to sorttable.
  // for example, you can override the cell text with a customkey attribute.
  // it also gets .value for <input> fields.
  
  hasInputs = (typeof node.getElementsByTagName == 'function') &&
               node.getElementsByTagName('input').length;
  
  if (node.getAttribute("sorttable_customkey") != null) {
    return node.getAttribute("sorttable_customkey");
  }
  else if (typeof node.textContent != 'undefined' && !hasInputs) {
    return node.textContent.replace(/^\s+|\s+$/g, '');
  }
  else if (typeof node.innerText != 'undefined' && !hasInputs) {
    return node.innerText.replace(/^\s+|\s+$/g, '');
  }
  else if (typeof node.text != 'undefined' && !hasInputs) {
    return node.text.replace(/^\s+|\s+$/g, '');
  }
  else {
    switch (node.nodeType) {
      case 3:
        if (node.nodeName.toLowerCase() == 'input') {
          return node.value.replace(/^\s+|\s+$/g, '');
        }
      case 4:
        return node.nodeValue.replace(/^\s+|\s+$/g, '');
        break;
      case 1:
      case 11:
        var innerText = '';
        for (var i = 0; i < node.childNodes.length; i++) {
          innerText += sorttable.getInnerText(node.childNodes[i]);
        }
        return innerText.replace(/^\s+|\s+$/g, '');
        break;
      default:
        return '';
    }
  }
},

reverse: function(tbody) {
  // reverse the rows in a tbody
  newrows = [];
  for (var i=0; i<tbody.rows.length; i++) {
    newrows[newrows.length] = tbody.rows[i];
  }
  for (var i=newrows.length-1; i>=0; i--) {
     tbody.appendChild(newrows[i]);
  }
  delete newrows;
},

/* sort functions
   each sort function takes two parameters, a and b
   you are comparing a[0] and b[0] */
sort_numeric: function(a,b) {
  aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
  if (isNaN(aa)) aa = 0;
  bb = parseFloat(b[0].replace(/[^0-9.-]/g,'')); 
  if (isNaN(bb)) bb = 0;
  return aa-bb;
},
sort_alpha: function(a,b) {
  if (a[0].toUpperCase()==b[0].toUpperCase()) return 0;
  if (a[0].toUpperCase()<b[0].toUpperCase()) return -1;
  return 1;
},


};

/* ******************************************************************
 Supporting functions: bundled here to avoid depending on a library
//written by Dean Edwards, 2005
//with input from Tino Zijdel, Matthias Miller, Diego Perini

//http://dean.edwards.name/weblog/2005/10/add-event/
 ****************************************************************** */


function dean_addEvent(element, type, handler) {
if (element.addEventListener) {
element.addEventListener(type, handler, false);
} else {
// assign each event handler a unique ID
if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
// create a hash table of event types for the element
if (!element.events) element.events = {};
// create a hash table of event handlers for each element/event pair
var handlers = element.events[type];
if (!handlers) {
 handlers = element.events[type] = {};
 // store the existing event handler (if there is one)
 if (element["on" + type]) {
  handlers[0] = element["on" + type];
 }
}
// store the event handler in the hash table
handlers[handler.$$guid] = handler;
// assign a global event handler to do all the work
element["on" + type] = handleEvent;
}
};
//a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
if (element.removeEventListener) {
element.removeEventListener(type, handler, false);
} else {
// delete the event handler from the hash table
if (element.events && element.events[type]) {
 delete element.events[type][handler.$$guid];
}
}
};

function handleEvent(event) {
var returnValue = true;
// grab the event object (IE uses a global event object)
event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
// get a reference to the hash table of event handlers
var handlers = this.events[event.type];
// execute each event handler
for (var i in handlers) {
this.$$handleEvent = handlers[i];
if (this.$$handleEvent(event) === false) {
 returnValue = false;
}
}
return returnValue;
};

function fixEvent(event) {
// add W3C standard event methods
event.preventDefault = fixEvent.preventDefault;
event.stopPropagation = fixEvent.stopPropagation;
return event;
};
fixEvent.preventDefault = function() {this.returnValue = false;};
fixEvent.stopPropagation = function() {this.cancelBubble = true;};

/*
//Dean's forEach: http://dean.edwards.name/base/forEach.js
forEach, version 1.0
Copyright 2006, Dean Edwards
License: http://www.opensource.org/licenses/mit-license.php
*/

//array-like enumeration
if (!Array.forEach) { // mozilla already supports this
Array.forEach = function(array, block, context) {
for (var i = 0; i < array.length; i++) {
 block.call(context, array[i], i, array);
}
};
}

//generic enumeration
Function.prototype.forEach = function(object, block, context) {
for (var key in object) {
if (typeof this.prototype[key] == "undefined") {
 block.call(context, object[key], key, object);
}
}
};

//character enumeration
String.forEach = function(string, block, context) {
Array.forEach(string.split(""), function(chr, index) {
block.call(context, chr, index, string);
});
};

//globally resolve forEach enumeration
var forEach = function(object, block, context) {
if (object) {
var resolve = Object; // default
if (object instanceof Function) {
 // functions have a "length" property
 resolve = Function;
} else if (object.forEach instanceof Function) {
 // the object implements a custom forEach method so use that
 object.forEach(block, context);
 return;
} else if (typeof object == "string") {
 // the object is a string
 resolve = String;
} else if (typeof object.length == "number") {
 // the object is array-like
 resolve = Array;
}
resolve.forEach(object, block, context);
}
};



/************************ /CORE *********************/



/************************ CLAN *********************/
var clans = new Array;
 clans.push(new Array(193086,'1RFF:GG - 1st Regiment of Foot Guards: Grenadier Guards'));
 clans.push(new Array(193216,'ACE - Agents of the Chaotic Empire'));
 clans.push(new Array(193026,'AFOS - A Fistful of Sixes'));
 clans.push(new Array(150310,'AoD - Angels of Death'));
 clans.push(new Array(193188,'AoK - Army of Kings'));
 clans.push(new Array(193209,'ATL - Atlantis'));
 clans.push(new Array(192992,'BotFM - The Brethren of the Fat Mermaid'));
 clans.push(new Array(193021,'DEVB - The Devils Brigade'));
 clans.push(new Array(193035,'DYN - DYNASTY'));
 clans.push(new Array(193193,'FALLEN - The Fallen'));
 clans.push(new Array(193056,'FOED - The Fraternal Order of Exceptional Drinkers'));
 clans.push(new Array(150122,'GEN1 - Generation One: The Clan'));
 clans.push(new Array(193226,'GoN - Gladiators of Noxious'));
 clans.push(new Array(193012,'GRIM - Grim Reapers'));
 clans.push(new Array(193166,'HH - The Headless Horsemen'));
 clans.push(new Array(192900,'IA - The Immortal Assassins'));
 clans.push(new Array(10628, 'ID - The Imperial Dragoons'));
 clans.push(new Array(193136,'IF - Igni Ferroque'));
 clans.push(new Array(192978,'KORT - Knights of the Round Table'));
 clans.push(new Array(193185,'KNT - Knights Templar'));
 clans.push(new Array(192857,'LEGION - ++The Legion++'));
 clans.push(new Array(193169,'LHDD - Les Hussards du Dragon')); 
 clans.push(new Array(152892,'LoW - Legends of War'));
 clans.push(new Array(193138,'MD - Manifest Destiny'));
 clans.push(new Array(193040,'MM - Memento Mori'));
 clans.push(new Array(150129,'MYTH - Mythology'));
 clans.push(new Array(192881,'NEM - Nemesis'));
 clans.push(new Array(193108,'OSA - One Step Ahead'));
 clans.push(new Array(193104,'PACK - THE PACK'));
 clans.push(new Array(193239,'PHX - Phoenix'));
 clans.push(new Array(193112,'PIG - The Pig Renters'));
 clans.push(new Array(193095,'RA - Risk Attackers'));
 clans.push(new Array(193170,'RET - Retribution'));
 clans.push(new Array(193217,'RGX - Royal Galaxy'));
 clans.push(new Array(193093,'TFFS - The Fantastic Four-Skins'));
 clans.push(new Array(152199,'THOTA - The Horsemen of the Apocalypse'));
 clans.push(new Array(192912,'TLW - The Last Warriors'));
 clans.push(new Array(193094,'TNC - The New Crusade'));
 clans.push(new Array(193015,'TOFU - The Odd Fellows Union'));
 clans.push(new Array(189665,'TSM - The Spanking Monkeys'));
 clans.push(new Array(155956,'VDLL - De Veroveraars der Lage Landen')); 
/************************ /CLAN *********************/

var quiOk = new Array(98583,103514,117969,127609,219736,228444,244631,245161,261456,313158,314321,392815,482239,568830);

var qui = 0;
if(document.getElementById('wall').parentNode.href.match(/(\d+)/)) qui = parseInt(RegExp.$1);
var protocol = location.protocol;
var Q = '';
var jarbre = new Array;
var marbre = new Array;
var team = new Array;
var teamNb = 0;
var carbre = new Array;
var cstat = new Array;
var cgames = new Array;
var np = new Array;
var ty = new Array;
var it = new Array;
var po = new Array;
var bc = new Array;
var ft = new Array;
var wf = new Array;
var tw = new Array;
var rl = new Array;
var sg = new Array;
var pt = new Array;
var mp = new Array;
var to = new Array;
var option_url = '';
var maps = new Array;
var globPage = 0;
var globPageTotal = 0;
var color = new Array('FF0000','F0B060','F0F060','A0FF60','44CCAA','44CCAA');
var newVersion = 0;
var tempo = 0;
var tempo_delai = 1001;

function clean()
 {
  jarbre = new Array;
  marbre = new Array;
  team = new Array;
  teamNb = 0;
  carbre = new Array;
  cstat = new Array;
  cgames = new Array;
  np = new Array;
  ty = new Array;
  it = new Array;
  po = new Array;
  bc = new Array;
  ft = new Array;
  wf = new Array;
  tw = new Array;
  rl = new Array;
  sg = new Array;
  pt = new Array;
  mp = new Array;
  to = new Array;
  option_url = '';
  maps = new Array;
  globPage = 0;
  globPageTotal = 0;
  tempo = 0;
 }

function CreateTd(id,ih,cn)
 {
  var td = document.createElement('td');
   if (id !== undefined && id != '') td.setAttribute('id',id);
   if (ih !== undefined && ih != '') td.innerHTML = ih;
   if (cn !== undefined && cn != '') td.className = cn;
  return td;
 }

function CreateTable()
 {
  var table = document.createElement('table');
  table.className = 'sortable';
   table.style.width = '500px';
   table.setAttribute('cellpadding',1);
   table.setAttribute('cellspacing',1);
  document.getElementById('Qzone').appendChild(table);
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var tr = document.createElement('tr');
   tr.style.cursor = 'pointer';
   tr.style.fontWeight = 'bold';
   tr.style.textAlign = 'center';
  thead.appendChild(tr);
  tr.appendChild(CreateTd('','Name','sorttable_alpha'));
  tr.appendChild(CreateTd('','Games','sorttable_numeric'));
  tr.appendChild(CreateTd('','Victories','sorttable_numeric'));
  tr.appendChild(CreateTd('','%','sorttable_numeric'));
  var tbody = document.createElement('tbody');
   tbody.style.textAlign = 'center';
  table.appendChild(tbody);
  
  return (tbody);
 }

function CreateSpace()
 {
  var span = document.createElement('span');
  span.appendChild(document.createTextNode('   '));
  return (span);
 }
 
 
function xmlRequest (callback,url,data1,data2)
 {
  var xhr = getXDomainRequest();
  
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) callback(xhr.responseText,data1,data2);
  };
   
  xhr.open("GET",protocol+'//'+url,true);
  xhr.send(null);
 }


function getMap(vs)
 {
  var url = 'www.conquerclub.com/api.php?mode=maplist ';
  xmlRequest(getMapParse,url,vs);
 }

function getMapParse(xml,vs)
 {
  var parser = new DOMParser();
  var dom = parser.parseFromString(xml,"application/xml");
  temp = dom.getElementsByTagName('title');
  for (var i=0; i<temp.length; i++) maps.push(temp[i].firstChild.nodeValue);
  
  if (Q == 'vsclan') getMapParseVS(vs);
  if (Q == 'vsclan1') getMapParseVS(vs);
  if (Q == 'agentmap') getMapParseAM();
 }

function getMapParseAM()
 {
  //affiche la table
  var tbody = CreateTable();
  for (var i=0; i<maps.length; i++)
   {
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    td = document.createElement('td');
     td.innerHTML = maps[i];
    tr.appendChild(td);
    tr.appendChild(CreateTd(maps[i]+'_j'));
    tr.appendChild(CreateTd(maps[i]+'_v'));
    tr.appendChild(CreateTd(maps[i]+'_p'));
    
    marbre[maps[i]] = new Array;
    marbre[maps[i]]['total'] = 0;
    marbre[maps[i]]['won'] = 0;
    marbre[maps[i]]['pourc'] = 0;
   }
  sorttable.makeSortable(tbody.parentNode);
  
  if (document.getElementById('onlyteam').checked)
   {
    for (var i=1; i<=4; i++)
     {
      if (document.getElementById('player'+i).value != '') teamNb ++;
     }
   }    
  for (var i=1; i<=4; i++)
   {
    if (document.getElementById('player'+i).value != '') jGetId(document.getElementById('player'+i).value);
   }
 }

function getMapParseVS(vs)
 {
  //affiche la table
  var table,thead,tbody,tr,td;
  
  table = document.createElement('table');
   table.className = 'sortable';
   table.style.width = '800px';
   table.setAttribute('cellpadding',1);
   table.setAttribute('cellspacing',1);
  document.getElementById('Qzone').appendChild(table);
  thead = document.createElement('thead');
   thead.style.textAlign = 'center';
  table.appendChild(thead);
  tbody = document.createElement('tbody');
   tbody.style.textAlign = 'center';
  table.appendChild(tbody);
  tr = document.createElement('tr');
   tr.style.cursor = 'pointer';
   tr.style.fontWeight = 'bold';
  thead.appendChild(tr);
  td = document.createElement('td');
   td.innerHTML = 'Map';
   td.style.textAlign = 'left';
   td.className = 'sorttable_alpha';
  tr.appendChild(td);
  tr.appendChild(CreateTd('','Games','sorttable_numeric'));
  tr.appendChild(CreateTd('','Victories','sorttable_numeric'));
  tr.appendChild(CreateTd('','%','sorttable_numeric'));
  tr.appendChild(CreateTd('','&lt;&gt;','sorttable_numeric'));
  tr.appendChild(CreateTd('','Games','sorttable_numeric'));
  tr.appendChild(CreateTd('','Victories','sorttable_numeric'));
  tr.appendChild(CreateTd('','%','sorttable_numeric'));
  td = document.createElement('td');
   td.innerHTML = 'Map';
   td.style.textAlign = 'right';
   td.className = 'sorttable_alpha';
  tr.appendChild(td);
  
  for (var i=0; i<maps.length; i++)
   {
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    td = document.createElement('td');
     td.style.textAlign = 'left';
     td.innerHTML = maps[i];
    tr.appendChild(td);
    tr.appendChild(CreateTd(maps[i]+'_aocj'));
    tr.appendChild(CreateTd(maps[i]+'_aocv'));
    tr.appendChild(CreateTd(maps[i]+'_aocp'));
    tr.appendChild(CreateTd(maps[i]+'_d'));
    tr.appendChild(CreateTd(maps[i]+'_vsj'));
    tr.appendChild(CreateTd(maps[i]+'_vsv'));
    tr.appendChild(CreateTd(maps[i]+'_vsp'));
    td = document.createElement('td');
     td.style.textAlign = 'right';
     td.innerHTML = maps[i];
    tr.appendChild(td);
   }
  
  sorttable.makeSortable(table);
  
  cGetMembersXml(193216,1);
  cGetMembersXml(vs,1);
 }

function jStat(jid)
 {
  if (Q == 'mapagent') document.getElementById('nom'+jid).innerHTML = jarbre[jid]['nom']; 
  jGetGamesXml(jid,1);
 }

function jGetId(jun)
 {
  var url = 'www.conquerclub.com/api.php?mode=player&un='+encodeURI(jun);
  setTimeout(function(){xmlRequest(jGetIdParse,url);},tempo += tempo_delai);
 }

function jGetIdParse(xml)
 {
  var parser = new DOMParser();
  var dom = parser.parseFromString(xml,"application/xml");
  var jid = parseInt(dom.getElementsByTagName('userid')[0].firstChild.nodeValue);
  if (document.getElementById('onlyteam').checked) 
   {
    team.push(jid);
    if (team.length == teamNb)
     {
      for (var i=1; i<team.length+1; i++) option_url += '&p'+i+'='+team[i-1];
      otGetGamesXml(1);
     }
   }else{
    jGetGamesXml(jid,1);
   }
 }

function jGetGamesXml (jid,page,cid)
 {
  var url = 'www.conquerclub.com/api.php?mode=gamelist&gs=F&page='+page+'&p1='+jid+option_url;
  setTimeout(function(){xmlRequest(jGetGamesParse,url,jid,cid);},tempo += tempo_delai);
 }
  
function jGetGamesParse (xml,jid,cid)
 {
  var parser = new DOMParser();
  var dom = parser.parseFromString(xml,"application/xml");
  var pages = dom.getElementsByTagName('page')[0].firstChild.nodeValue;
  if(pages.match(/^(\d+) of (\d+)$/))
   {
    page = parseInt(RegExp.$1);
    numPages = Math.max(1,parseInt(RegExp.$2));
   }
  
  globPage ++;
  if (page == 1) globPageTotal += numPages;
  if (page == 1 && numPages > 1 && !document.getElementById('debug').checked)
   {
    for(var pg=2; pg<=numPages; pg++) jGetGamesXml(jid,pg,cid);
   }
  
  //récup stat
  var i,j,gameNo,players,mapName;
  var games = dom.getElementsByTagName('game');
  for (i=0; i<games.length; i++)
   {
    players = games[i].getElementsByTagName('player');
    for (j=0; j<players.length; j++)
     {
      if (jid == parseInt(players[j].firstChild.nodeValue))
       {
        if (Q == 'mapagent')
         {
          jarbre[jid]['total'] ++;
          if (players[j].getAttribute('state') == 'Won') jarbre[jid]['won'] ++;
         }
        if (Q == 'agentmap')
         {
          mapName = games[i].getElementsByTagName('map');
          mapName = mapName[0].firstChild.nodeValue;
          marbre[mapName]['total'] ++;
          if (players[j].getAttribute('state') == 'Won') marbre[mapName]['won'] ++;
         }
        if (Q == 'vsclan')
         {
          gameNo = games[i].getElementsByTagName('game_number');
          gameNo = gameNo[0].firstChild.nodeValue;
         
          if (cgames[gameNo]===undefined) //le game est vu pour la première fois -> a mémoriser si jamais on le revoit une deuxième fois avec un autre membre
           {
            cgames[gameNo] = 1;
           }else if(cgames[gameNo] == 1)  //le game est vu pour la 2ème fois -> team game, donc à stater
           {
            cgames[gameNo] ++;
            mapName = games[i].getElementsByTagName('map');
            mapName = mapName[0].firstChild.nodeValue;
            cstat[cid][mapName]['total'] ++;
            if (players[j].getAttribute('state') == 'Won') cstat[cid][mapName]['won'] ++;
           }
         }
        if (Q == 'vsclan1')
         {
          mapName = games[i].getElementsByTagName('map');
          mapName = mapName[0].firstChild.nodeValue;
          cstat[cid][mapName]['total'] ++;
          if (players[j].getAttribute('state') == 'Won') cstat[cid][mapName]['won'] ++;
         }        
       }
     }
   }
  
  if (Q == 'mapagent') jGetGamesMapAgent(jid);
  if (Q == 'agentmap') jGetGamesAgentMap(jid);
  if (Q == 'vsclan') jGetGamesVsclan(cid);
  if (Q == 'vsclan1') jGetGamesVsclan(cid);
  suivi();
 }

function jGetGamesMapAgent(jid)
 {
  if (jarbre[jid]['total'] > 0) jarbre[jid]['pourc'] = Math.round(jarbre[jid]['won']/jarbre[jid]['total']*10000) / 100;
  document.getElementById('j'+jid).innerHTML = jarbre[jid]['total'];
  document.getElementById('v'+jid).innerHTML = jarbre[jid]['won'];
  document.getElementById('p'+jid).innerHTML = jarbre[jid]['pourc']+'%';
 }

function jGetGamesAgentMap(jid)
 {
  for (var i=0; i<maps.length; i++)
   {
    if (marbre[maps[i]]['total'] > 0) marbre[maps[i]]['pourc'] = Math.round(marbre[maps[i]]['won']/marbre[maps[i]]['total']*10000) / 100;
    document.getElementById(maps[i]+'_j').innerHTML = marbre[maps[i]]['total'];
    document.getElementById(maps[i]+'_v').innerHTML = marbre[maps[i]]['won'];
    document.getElementById(maps[i]+'_p').innerHTML = marbre[maps[i]]['pourc']+'%';
   }
 }

function jGetGamesVsclan(cid)
 {
  var suffix = 'vs';
  var colorid,aocp,vsp,delta;
  if (cid == 193216) suffix = 'aoc';
  for (var i=0; i<maps.length; i++)
   {
    if (cstat[cid][maps[i]]['total'] > 0) cstat[cid][maps[i]]['pourc'] = Math.round(cstat[cid][maps[i]]['won']/cstat[cid][maps[i]]['total']*10000) / 100;
    document.getElementById(maps[i]+'_'+suffix+'j').innerHTML = cstat[cid][maps[i]]['total'];
    document.getElementById(maps[i]+'_'+suffix+'v').innerHTML = cstat[cid][maps[i]]['won'];
    document.getElementById(maps[i]+'_'+suffix+'p').innerHTML = cstat[cid][maps[i]]['pourc']+'%';
    
    colorid = Math.floor(cstat[cid][maps[i]]['pourc']/20);
    document.getElementById(maps[i]+'_'+suffix+'j').style.background = '#'+color[colorid];
    document.getElementById(maps[i]+'_'+suffix+'v').style.background = '#'+color[colorid];
    document.getElementById(maps[i]+'_'+suffix+'p').style.background = '#'+color[colorid];

    aocp = parseFloat(document.getElementById(maps[i]+'_aocp').innerHTML);
    vsp = parseFloat(document.getElementById(maps[i]+'_vsp').innerHTML);
    delta = Math.floor(aocp - vsp);
    document.getElementById(maps[i]+'_d').innerHTML = delta+'%';
    document.getElementById(maps[i]+'_d').style.background = '#'+color[Math.floor((delta+100)/40)];
   }
 }

function cGetMembersXml(cid,page)
 {
  if (page == 1)
   {
    carbre[cid] = new Array;
    cstat[cid] = new Array;
    cgames[cid] = new Array;
    for (var i=0; i<maps.length; i++)
     {
      cstat[cid][maps[i]] = new Array;
      cstat[cid][maps[i]]['total'] = 0;
      cstat[cid][maps[i]]['won'] = 0;
      cstat[cid][maps[i]]['pourc'] = 0;
     }
   }
 
  var url = 'www.conquerclub.com/forum/memberlist.php?g='+cid+'&mode=group';
  if(page > 1) url += "&start=" + (50 * (page - 1));
  xmlRequest(cGetMembersParse,url,cid);
 }

function cGetMembersParse(xml,cid)
 {
  if(xml.match(/<li class="rightside pagination">(\d+) users &bull;/))
   {
    numUsers = parseInt(RegExp.$1);
   }else{
    alert('error : no clan found');
    return;
   }
  if(xml.match(/Page <strong>(\d+)<\/strong> of <strong>(\d+)<\/strong>/))
   {
    page = parseInt(RegExp.$1);
    numPages = parseInt(RegExp.$2);
   }else{
    alert('error : no clan found');
    return;
   }
  if(page == 1 && numPages > 1)
   {
    for(var pg=2; pg<=numPages; pg++) cGetMembersXml(cid,pg);
   }
  
  var pattern = /memberlist\.php\?mode\=viewprofile&amp;u\=(\d+)".*>(.*)<\/a>/g;
  links = xml.match(pattern);
  for (var i=0; i<links.length; i++)
   {
    links[i].match(pattern);
    jid = parseInt(RegExp.$1);
    carbre[cid].push(jid);

    jarbre[jid] = new Array;
    jarbre[jid]['total'] = 0;
    jarbre[jid]['won'] = 0;
    jarbre[jid]['pourc'] = 0;
    jarbre[jid]['nom'] = RegExp.$2;
   }
    
  if (carbre[cid].length == numUsers)
   {
    if (Q == 'mapagent') cGetMembersStat(cid);
    if (Q == 'vsclan') cGlobalStat(cid);
    if (Q == 'vsclan1') cGlobalStat(cid);
   }
 }

function cGlobalStat(cid)
 {
  for (var i=0; i<carbre[cid].length; i++) jGetGamesXml(carbre[cid][i],1,cid);
 }

function cGetMembersStat(cid)
 {
  var tr;
  var tbody = CreateTable();
 
  for (var i=0; i<carbre[cid].length; i++)
   {
    jid = carbre[cid][i];
    if (jid > 0)
     {
      tr = document.createElement('tr');
      tbody.appendChild(tr);
      tr.appendChild(CreateTd('nom'+jid));
      tr.appendChild(CreateTd('j'+jid));
      tr.appendChild(CreateTd('v'+jid));
      tr.appendChild(CreateTd('p'+jid));
      
      jStat(jid);
     }
   }
  
  sorttable.makeSortable(tbody.parentNode);
 } 

function otGetGamesXml (page)
 {
  var url = 'www.conquerclub.com/api.php?mode=gamelist&gs=F&page='+page+option_url;
  setTimeout(function(){xmlRequest(otGetGamesParse,url);},tempo += tempo_delai);
 }
 
function otGetGamesParse (xml)
 {
  var parser = new DOMParser();
  var dom = parser.parseFromString(xml,"application/xml");
  var pages = dom.getElementsByTagName('page')[0].firstChild.nodeValue;
  if(pages.match(/^(\d+) of (\d+)$/))
   {
    page = parseInt(RegExp.$1);
    numPages = Math.max(1,parseInt(RegExp.$2));
   }
  
  globPage ++;
  if (page == 1) globPageTotal += numPages;
  if (page == 1 && numPages > 1 && !document.getElementById('debug').checked)
   {
    for(var pg=2; pg<=numPages; pg++) otGetGamesXml(pg);
   }
  
  //récup stat
  var i,j,players,mapName,won,total;
  var games = dom.getElementsByTagName('game');
  for (i=0; i<games.length; i++)
   {
    total = 0;
    won = 0;
    players = games[i].getElementsByTagName('player');
    for (j=0; j<players.length; j++)
     {
      if (team.indexOf(parseInt(players[j].firstChild.nodeValue)) >= 0)
       {
        total ++;
        if (players[j].getAttribute('state') == 'Won') won ++;
       }
     }
    if (total > 1)
     {
      mapName = games[i].getElementsByTagName('map');
      mapName = mapName[0].firstChild.nodeValue;
      marbre[mapName]['total'] ++;
      if (won > 1) marbre[mapName]['won'] ++;
     }
   }
  
  otGetGamesAgentMap();
  suivi();
 }

function otGetGamesAgentMap()
 {
  for (var i=0; i<maps.length; i++)
   {
    if (marbre[maps[i]]['total'] > 0) marbre[maps[i]]['pourc'] = Math.round(marbre[maps[i]]['won']/marbre[maps[i]]['total']*10000) / 100;
    document.getElementById(maps[i]+'_j').innerHTML = marbre[maps[i]]['total'];
    document.getElementById(maps[i]+'_v').innerHTML = marbre[maps[i]]['won'];
    document.getElementById(maps[i]+'_p').innerHTML = marbre[maps[i]]['pourc']+'%';
   }
 }

function getOptionCheck(id,t,a,c)
 {
  for (var i=0; i<t.length; i++)
   {
    if (document.getElementById(id+t[i]).checked == true) a.push(document.getElementById(id+t[i]).value.toUpperCase());
   }
  if (Q == 'vsclan' && c == 'ty' && a.length == 0)
   {
    ty = new Array('D','T','Q');
    a = ty;
   }
  if (a.length > 0) option_url += '&'+c+'='+a.join(',');
 }

function getOption()
 {
  getOptionCheck('num_players_',new Array(2,3,4,5,6,7,8),np,'np');
  if (Q == 'vsclan')  
   {
    getOptionCheck('game_type_',new Array('d','t','q'),ty,'ty');
   }else if (Q == 'vsclan1') 
   {
    ty = new Array('s','c');
   }else if (Q == 'agentmap' && document.getElementById('onlyteam').checked)
   {
    ty = new Array('d','t','q');
    option_url += '&ty='+ty.join(',');
   }else{
    getOptionCheck('game_type_',new Array('s','c','a','d','t','q'),ty,'ty');
   }
  getOptionCheck('initial_troops_',new Array('e','m'),it,'it');
  getOptionCheck('play_order_',new Array('s','f'),po,'po');
  getOptionCheck('bonus_cards_',new Array(1,2,3,4),bc,'bc');
  getOptionCheck('fortifications_',new Array('c','o','m'),ft,'ft');
  getOptionCheck('war_fog_',new Array('n','y'),wf,'wf');
  getOptionCheck('trench_warfare_',new Array('n','y'),tw,'tw');
  getOptionCheck('round_limit_',new Array(0,20,30,50,100),rl,'rl');
  getOptionCheck('speed_game_',new Array('n',5,4,3,2,1),sg,'sg');
  getOptionCheck('private_',new Array('n','y','t'),pt,'pt');
  //maps
  for (var i=0; i<document.getElementById('maps').options.length; i++)
   {
    if (document.getElementById('maps').options[i].selected == true)
     {
      temp = document.getElementById('maps').options[i].text.split(" (");
      mp.push(temp[0]);
     }
   }
  if (mp.length > 0) option_url += '&mp='+encodeURI(mp.join(','));
  //tournaments
  for (var i=0; i<document.getElementById('tournament').options.length; i++)
   {
    if (document.getElementById('tournament').options[i].text != '' && document.getElementById('tournament').options[i].selected) to.push(document.getElementById('tournament').options[i].text);
   }
  if (to.length > 0) option_url += '&to='+encodeURI(to.join(','));
 }

function versionGet()
 {
  GM_xmlhttpRequest({
   method: 'GET',
   url: 'http://cqc.faucon.org/js/qstat.user.js',
   onload: versionCheck
  });
 }

function versionCheck(xml)
 {
  newVersion = /version\s+(\d+)/.exec(xml.responseText)[1];
  if (newVersion > version) document.getElementById("Qversion").innerHTML = '<a href="http://cqc.faucon.org/js/qstat.user.js">New version available : v.'+newVersion+'</a>';
 }

function init(action)
 {
  document.getElementById('Qzone').innerHTML = '';
  clean();
  Q = action;
  getOption();
 }

function suivi(txt)
 {
  document.getElementById("Qsuivi").innerHTML = globPage+'/'+globPageTotal;
  if (globPage == globPageTotal && globPageTotal > 100) clean();
 }


if (quiOk.indexOf(qui) >= 0)
 {
  var zone = document.getElementById("middleColumn");
  //suivi
  div = document.createElement('div');
  zone.appendChild(div);
  div.setAttribute('id','Qsuivi');
  checkbox = document.createElement('input');
  zone.appendChild(checkbox);
  checkbox.setAttribute('type','checkbox');
  checkbox.setAttribute('id','debug');
  if (qui != 98583)
   {
    checkbox.style.display='none';
   }else{
    checkbox.checked=true;
   }
  zone.innerHTML += '<div id="Qversion">Last version installed : v.'+version+'</div><br />';
  
  //map -> agent
  btn = document.createElement('button');
  zone.appendChild(btn);
  btn.appendChild(document.createTextNode('map -> agent'));
  btn.addEventListener("click",function(){init('mapagent');cGetMembersXml(193216,1);},false);
  zone.appendChild(CreateSpace());
  
  //vs clan
  btn = document.createElement('button');
  zone.appendChild(btn);
  btn.appendChild(document.createTextNode('ACE vs clan ->'));
  btn.addEventListener("click",function(){init('vsclan');getMap(document.getElementById('vsclan').value);},false);
  btn = document.createElement('button');
  zone.appendChild(btn);
  btn.appendChild(document.createTextNode('ACE vs clan (1vs1) ->'));
  btn.addEventListener("click",function(){init('vsclan1');getMap(document.getElementById('vsclan').value);},false);
  select = document.createElement('select');
  zone.appendChild(select);
  select.setAttribute('id','vsclan');
  for(var i=0; i<clans.length; i++)
   {
    option = document.createElement('option');
     option.value = clans[i][0];
     option.text = clans[i][1];
    select.appendChild(option);
   }
  zone.appendChild(CreateSpace());
  
  //agent -> map
  btn = document.createElement('button');
  zone.appendChild(btn);
  btn.appendChild(document.createTextNode('agent -> map'));
  btn.addEventListener("click",function(){init('agentmap');getMap();},false);
  checkbox = document.createElement('input');
  zone.appendChild(checkbox);
  checkbox.setAttribute('type','checkbox');
  checkbox.setAttribute('id','onlyteam');
  span = document.createElement('span');
  zone.appendChild(span);
  span.appendChild(document.createTextNode('team only'));
  zone.appendChild(CreateSpace());

  //reset
  btn = document.createElement('button');
  zone.appendChild(btn);
  btn.appendChild(document.createTextNode('reset'));
  btn.addEventListener("click",function(){location.reload();},false);
  
  div = document.createElement('div');
   div.setAttribute('id','Qzone');
  zone.appendChild(div);
  
  //check version
  versionGet();
  
  //correctif spped game
  document.getElementById("speed_game_1").nextSibling.nextSibling.nextSibling.addEventListener("click",function(){document.getElementById("speed_game_1").checked=document.getElementById("speed_game_2").checked=document.getElementById("speed_game_3").checked=document.getElementById("speed_game_4").checked=document.getElementById("speed_game_5").checked=true;},false);
 }

