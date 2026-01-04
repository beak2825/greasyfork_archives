// ==UserScript==
// @name          Tools for Apache server-status
// @author        Frank Koenen, www.feweb.net
// @namespace     sizzle_apache_server_status_fhk
// @description   Present a toolbar to aid in server-status monitoring, add 'tablesort' and other features.
// @version       1.0.1
// @run-at        document-start
// @include       http*://yourserver/server-status?v=nameofyourserver
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright     2019, Frank Koenen, all rights reserved.  www.feweb.net
// @downloadURL https://update.greasyfork.org/scripts/393831/Tools%20for%20Apache%20server-status.user.js
// @updateURL https://update.greasyfork.org/scripts/393831/Tools%20for%20Apache%20server-status.meta.js
// ==/UserScript==

/*

  Usage:

         http://127.0.0.1/server-status?v=localhost
*/

jQuery(document).ready(function() {
  if (window.top != window.self) return;
  sizzle_apache_server_status_fhk_gethtmlmaincontent();
  jQuery('#sizzle_apache_server_status_fhk_toolbar_openbutton').bind('click',function() { sizzle_apache_server_status_fhk_toolbar_showhide(); });
  jQuery('#sizzle_apache_server_status_fhk_toolbar_closebutton').bind('click',function() { sizzle_apache_server_status_fhk_toolbar_showhide(); });
  jQuery('#sizzle_apache_server_status_fhk_toolbar div.clickit').bind('click',function() { sizzle_apache_server_status_fhk_toolbar_item_click(this); });
  try { console.debug('wikipedia.user.js loaded'); } catch(e) {};
});

function sizzle_apache_server_status_fhk_gethtmlmaincontent() {
  jQuery('BODY').prepend('\
  <div style="font-size:12px;color:black;cursor:pointer;display:block;height:20px;width:20px;position:absolute;top:57px;left:381px;z-index:1001;-moz-user-select:none;-khtml-user-select:none;user-select:none" title="show Wikipedia Toolbar" id="sizzle_apache_server_status_fhk_toolbar_openbutton">&#10148;</div>\
  <div id="sizzle_apache_server_status_fhk_toolbar" style="display:none;font-size:12px;font-weight:normal;background-color:white;border:1px solid black;padding:10px;margin:5px;width:400px;min-height:100px;-moz-user-select:none;-khtml-user-select:none;user-select:none;position:absolute;top:57px;left:381px;z-index:1000">\
    <div style="font-size:9px;color:red;float:right;cursor:pointer" id="sizzle_apache_server_status_fhk_toolbar_closebutton" title="Close the toolbox window">&#10060;</div>\
    <div class="simpleclick clickit" data-task="11" style="display:inline-block;white-space:nowrap">[filter]</div>&nbsp;\
	  <div class="simpleclick" onclick="window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.clearit()" style="display:inline-block;white-space:nowrap" title="clear the input field">[clear]</div>&nbsp;\
	  <div class="simpleclick" onclick="window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.restoreit()" style="display:inline-block;white-space:nowrap" title="clear the input field">[restore]</div><br>&nbsp;\
	  <div class="simpleclick" onclick="document.location.href=document.location.href.replace(/server-status/,\'phpinfo.php\')" style="display:inline-block;white-space:nowrap" title="clear the input field">phpinfo.php</div><br>&nbsp;\
    <textarea id="sizzle_apache_server_status_fhk_textarea" onblur="window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.stow(this)"></textarea><textarea id="sizzle_apache_server_status_fhk_textarea2" style="display:none"></textarea>\
  </div>\
  <br>\
  ');
}

function sizzle_apache_server_status_fhk_toolbar_showhide() {
  var d = document.getElementById('sizzle_apache_server_status_fhk_toolbar'); if ( ! d ) return;
  if ( jQuery(d).is(':hidden') ) {
    jQuery(d).show(); 
    jQuery('#sizzle_apache_server_status_fhk_toolbar_openbutton').hide(); 
  } else {
    jQuery(d).hide();
    jQuery('#sizzle_apache_server_status_fhk_toolbar_openbutton').show(); 
  }

  var v = localStorage.getItem('sizzle_apache_server_status_fhk_text');
  if ( v != '' ) {
    var ta2 = document.getElementById('sizzle_apache_server_status_fhk_textarea2');
    ta2.value = v;
    document.getElementById('sizzle_apache_server_status_fhk_textarea').value = ta2.value;
  }
}

function sizzle_apache_server_status_fhk_toolbar_item_click(o) {
  var n = o.getAttribute('data-task')*1;
  switch(n) {
    case 11: sizzle_apache_server_status_fhk_toolbar_filter(); break;
    case 12: window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.clearit(); break;
    case 13: window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.restoreit(); break;
    default: alert('no matching task for ' + n); break;
  }
}

function sizzle_apache_server_status_fhk_toolbar_filter() {
  var ta1 = document.getElementById('sizzle_apache_server_status_fhk_textarea');
  var v = ta1.value.replace(/^ */,'').replace(/ *$/,'');
  var myhl = new hilighttool('apachetable'); // id of the element to parse/search
  myhl.apply(v);
  //myhl.remove();
}

// see ~/Dropbox/javascript/hilighttool.js
function hilighttool(id,tag){var targetNode=document.getElementById(id)||document.body;var hiliteTag=tag||'MARK';var skipTags=new RegExp('^(?:'+hiliteTag+'|SCRIPT|FORM|SPAN)$');var colors=['#ff6','#a0ffff','#9f9','#f99','#f6f'];var wordColor=[];var colorIdx=0;var matchRegExp='';var openLeft=false;var openRight=false;var endRegExp=new RegExp('^[^\\w]+|[^\\w]+$','g');var breakRegExp=new RegExp('[^0-9A-Za-z_.\-]+','g');this.setEndRegExp=function(regex){endRegExp=regex;return endRegExp;};this.setBreakRegExp=function(regex){breakRegExp=regex;return breakRegExp;};this.setMatchType=function(type){switch(type){case'left':this.openLeft=false;this.openRight=true;break;case'right':this.openLeft=true;this.openRight=false;break;case'open':this.openLeft=this.openRight=true;break;default:this.openLeft=this.openRight=false;}};this.setRegex=function(input){input=input.replace(endRegExp,'');input=input.replace(breakRegExp,'|');input=input.replace(/^\||\|$/g,'');if(input){var re='('+input+')';if(!this.openLeft){re='\\b'+re;}if(!this.openRight){re=re+'\\b';}matchRegExp=new RegExp(re,'i');return matchRegExp;}return false;};this.getRegex=function(){var retval=matchRegExp.toString();retval=retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g,'');retval=retval.replace(/\|/g,' ');return retval;};this.hiliteWords=function(node){if(node===undefined||!node)return;if(!matchRegExp)return;if(skipTags.test(node.nodeName))return;if(node.hasChildNodes()){for(var i=0;i<node.childNodes.length;i++)this.hiliteWords(node.childNodes[i]);}if(node.nodeType==3){if((nv=node.nodeValue)&&(regs=matchRegExp.exec(nv))){if(!wordColor[regs[0].toLowerCase()]){wordColor[regs[0].toLowerCase()]=colors[colorIdx++%colors.length];}var match=document.createElement(hiliteTag);match.appendChild(document.createTextNode(regs[0]));match.style.backgroundColor=wordColor[regs[0].toLowerCase()];match.style.color='#000';var after=node.splitText(regs.index);after.nodeValue=after.nodeValue.substring(regs[0].length);node.parentNode.insertBefore(match,after);}};};this.remove=function(){var arr=document.getElementsByTagName(hiliteTag);while(arr.length&&(el=arr[0])){var parent=el.parentNode;parent.replaceChild(el.firstChild,el);parent.normalize();}};this.apply=function(input){this.remove();if(input===undefined||!(input=input.replace(/(^\s+|\s+$)/g,''))){return;}if(this.setRegex(input)){this.hiliteWords(targetNode);}return matchRegExp;};}

(function() {
  function appendStyle(h) {
    var head = h || document.getElementsByTagName('head')[0], style = document.createElement('style');
    if (!head || self.location != top.location) return;
    style.type = 'text/css';
    style.textContent = '#sizzle_apache_server_status_fhk_toolbar .clickit:hover { background-color: silver; }';
    head.appendChild(style);

    addGlobalStyle('BODY,TD,TH,P {font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 11px;} TD {background:#FFFFFF; padding:2px;} PRE {font-family: monospace, Courier, Courier New; letter-spacing:2pt;}  TD.numeric {text-align:right;} TD.centered {text-align:center;} table.sortable a.sortheader {background-color:#eee; color:#666666;font-weight: bold;text-decoration: none; display: block;} table.sortable span.sortarrow {color: black;text-decoration: none;} a.bouton {float: right;color: #000000;font-size:12px;font-family:verdana;font-weight:bold;text-decoration: none;border:4px outset darkgray;background-color:lightgray;display: block;padding: 3px 5px;margin: 1px;}a.bouton:hover {background-color: gray;color:#000000;padding-left:4px;border:4px inset darkgray;}');
    addGlobalStyle('BODY { color: #292740; padding: 0px; margin: 0px; margin-left: 2px; }');
    addGlobalStyle('H1.serverstatush1 { font-size: 18px; padding: 0px; margin: 0px; margin-top: -13px; }');
    addGlobalStyle('TH { background-color: #78759d; color:white;}');
    addGlobalStyle('#apachetable TH.clickable{ cursor:pointer;border:1px solid silver; user-select: none; -moz-user-select: none; }');
    addGlobalStyle('#apachetable TH.clickable:hover { color:black; }');
    addGlobalStyle('#apachetable TD STRONG.underscore { border:1px solid silver; }');
    addGlobalStyle('#apachetable TD STRONG.openslot { }');
    addGlobalStyle('DT.serverload { color:#9d2c2c; font-weight: bold; }');
    addGlobalStyle('DT.workers { color:#9d2c2c; font-weight: bold; }');
		addGlobalStyle('.simpleclick{-moz-user-select: none;-khtml-user-select: none;user-select: none;cursor:pointer;color:black;display:inline-block}');
		addGlobalStyle('.simpleclick:hover{color:green; background-color: silver;}');
		addGlobalStyle('#sizzle_apache_server_status_fhk_toolbar textarea {height:103px;width:404px;}');

  }

  function nodeInserted(e) { if (e.relatedNode.tagName == 'HEAD') { document.removeEventListener('DOMNodeInserted', nodeInserted, true); appendStyle(e.relatedNode); } }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  function addGlobalJavascript(js) {
    var head, javascript;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    javascript = document.createElement('script');
    javascript.setAttribute('language', 'javascript');
    javascript.innerHTML = js;
    head.appendChild(javascript);
  }

  function addGlobalJavascriptFile(js) {
    var head, javascript;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    javascript = document.createElement('script');
    javascript.setAttribute('language', 'javascript');
    javascript.src = js;
    javascript.async = false;
    head.appendChild(javascript);
  }

  addGlobalJavascriptFile('https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js'); // adds to the DOM, not exactly the same a the header '@require'
  addGlobalJavascript("window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso={clearit:function(){var ta1=document.getElementById('sizzle_apache_server_status_fhk_textarea');var v=ta1.value.replace(/^ */,'').replace(/ *$/,'');if(v!=''){var ta2=document.getElementById('sizzle_apache_server_status_fhk_textarea2');ta2.value=v;}ta1.value='';},restoreit:function(){var ta2=document.getElementById('sizzle_apache_server_status_fhk_textarea2');if(ta2.value!='')document.getElementById('sizzle_apache_server_status_fhk_textarea').value=ta2.value;},stow:function(o){var v=o.value.replace(/^ */,'').replace(/ *$/,'');if(v=='')return;try{console.info('storing data into localStorage=sizzle_apache_server_status_fhk_text');}catch(e){};localStorage.setItem('sizzle_apache_server_status_fhk_text',v);if(1==2)GM.setValue('sizzle_apache_server_status_fhk_text',v);},onload:function(){var v=localStorage.getItem('sizzle_apache_server_status_fhk_text');if(1==2)var v=GM.getValue('sizzle_apache_server_status_fhk_text');if(v!=''){try{console.info('restoring sizzle_apache_server_status_fhk_textarea using localStorage=sizzle_apache_server_status_fhk_text');}catch(e){};document.getElementById('sizzle_apache_server_status_fhk_textarea').value=v;}},unload:function(){window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.stow(document.getElementById('sizzle_apache_server_status_fhk_textarea'));}};");

  (function($){$.extend({tablesorter:new function(){var parsers=[],widgets=[];this.defaults={cssHeader:'header',cssAsc:'headerSortUp',cssDesc:'headerSortDown',sortInitialOrder:'asc',sortMultiSortKey:'shiftKey',sortForce:null,sortAppend:null,textExtraction:'simple',parsers:{},widgets:[],widgetZebra:{css:['even','odd']},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:'us',decimal:'.',debug:false};function benchmark(s,d){log(s+','+(new Date().getTime()-d.getTime())+'ms');}this.benchmark=benchmark;function log(s){if(typeof console!='undefined'&&typeof console.debug!='undefined'){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug='';}var rows=table.tBodies[0].rows;if(table.tBodies[0].rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,cells[i]);}if(table.config.debug){parsersDebug+='column:'+i+' parser:'+p.id+'\n';}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,node){var l=parsers.length;for(var i=1;i<l;i++){if(parsers[i].is($.trim(getElementText(table.config,node)),table,node)){return parsers[i];}}return parsers[0];}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=table.tBodies[0].rows[i],cols=[];cache.row.push($(c));for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c.cells[j]),table,c.cells[j]));}cols.push(i);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark('Building cache for '+totalRows+' rows:',cacheTime);}return cache;};function getElementText(config,node){if(!node)return'';var t='';if(config.textExtraction=='simple'){if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){t=node.childNodes[0].innerHTML;}else{t=node.innerHTML;}}else{if(typeof(config.textExtraction)=='function'){t=config.textExtraction(node);}else{t=$(node).text();}}return t;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){rows.push(r[n[i][checkCell]]);if(!table.config.appender){var o=r[n[i][checkCell]];var l=o.length;for(var j=0;j<l;j++){tableBody[0].appendChild(o[j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark('Rebuilt table:',appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger('sortEnd');},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false,tableHeadersRows=[];for(var i=0;i<table.tHead.rows.length;i++){tableHeadersRows[i]=0;};$tableHeaders=$('thead th',table);$tableHeaders.each(function(index){this.count=0;this.column=index;this.order=formatSortingOrder(table.config.sortInitialOrder);if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(!this.sortDisabled){$(this).addClass(table.config.cssHeader);}table.config.headerList[index]=this;});if(table.config.debug){benchmark('Built headers:',time);log($tableHeaders);}return $tableHeaders;};function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!='Number'){i=(v.toLowerCase()=='desc')?1:0;}else{i=(v==(0||1))?v:0;}return i;}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$('tr:first td',table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp='var sortWrapper = function(a,b) {',l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(getCachedSortType(table.config.parsers,c)=='text')?((order==0)?'sortText':'sortTextDesc'):((order==0)?'sortNumeric':'sortNumericDesc');var e='e'+i;dynamicExp+='var '+e+' = '+s+'(a['+c+'],b['+c+']); ';dynamicExp+='if('+e+') { return '+e+'; } ';dynamicExp+='else { ';}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+='return a['+orgOrderCol+']-b['+orgOrderCol+'];';for(var i=0;i<l;i++){dynamicExp+='}; ';}dynamicExp+='return 0; ';dynamicExp+='}; ';eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark('Sorting on '+sortList.toString()+' and dir '+order+' time:',sortTime);}return cache;};function sortText(a,b){return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){$this.trigger('sortStart');var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){var $cell=$(this);var i=this.column;this.order=this.count++%2;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind('update',function(){this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);}).bind('sorton',function(e,list){$(this).trigger('sortStart');config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind('appendCache',function(){appendToTable(this,cache);}).bind('applyWidgetId',function(e,id){getWidgetById(id).format(this);}).bind('applyWidgets',function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger('sorton',[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){var DECIMAL='\\'+config.decimal;var exp='/(^[+]?0('+DECIMAL+'0+)?$)|(^([-+]?[1-9][0-9]*)$)|(^([-+]?((0?|[1-9][0-9]*)'+DECIMAL+'(0*[1-9][0-9]*)))$)|(^[-+]?[1-9]+[0-9]*'+DECIMAL+'0+$)/';return RegExp(exp).test($.trim(s));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML='';}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:'text',is:function(s){return true;},format:function(s){return $.trim(s.toLowerCase());},type:'text'});ts.addParser({id:'digit',is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:'numeric'});ts.addParser({id:'currency',is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[^0-9.]/g),''));},type:'numeric'});ts.addParser({id:'ipAddress',is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split('.'),r='',l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+='0'+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:'numeric'});ts.addParser({id:'url',is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:'text'});ts.addParser({id:'isoDate',is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!='')?new Date(s.replace(new RegExp(/-/g),'/')).getTime():'0');},type:'numeric'});ts.addParser({id:'percent',is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),''));},type:'numeric'});ts.addParser({id:'usLongDate',is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:'numeric'});ts.addParser({id:'shortDate',is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,'/');if(c.dateFormat=='us'){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,'$3/$1/$2');}else if(c.dateFormat=='uk'){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,'$3/$2/$1');}else if(c.dateFormat=='dd/mm/yy'||c.dateFormat=='dd-mm-yy'){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,'$1/$2/$3');}return $.tablesorter.formatFloat(new Date(s).getTime());},type:'numeric'});ts.addParser({id:'time',is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date('2000/01/01 '+s).getTime());},type:'numeric'});ts.addParser({id:'metadata',is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:'numeric'});ts.addWidget({id:'zebra',format:function(table){if(table.config.debug){var time=new Date();}$('tr:visible',table.tBodies[0]).filter(':even').removeClass(table.config.widgetZebra.css[1]).addClass(table.config.widgetZebra.css[0]).end().filter(':odd').removeClass(table.config.widgetZebra.css[0]).addClass(table.config.widgetZebra.css[1]);if(table.config.debug){$.tablesorter.benchmark('Applying Zebra widget',time);}}});})(jQuery);

  // prepare the table, add id="apachetable"
  var d = jQuery('TABLE:first').get(0); if ( d ) d.setAttribute('id','apachetable'); // add an id to the table

  // fix/prepare the "M" column with 'Xsortonme' attribute since it sometimes contains '<b>' elements.
  jQuery('#apachetable TR TD:nth-child(4)').each(function() {
    jQuery(this).attr('Xsortonme', this.innerText.replace(/\./,'ZZ').replace(/_/,'XX'));
    if ( this.innerText == '_' ) jQuery(this).html('<strong class="underscore" title="Waiting for Connection">_</strong>');
    if ( this.innerText == '.' ) jQuery(this).html('<strong class="openslot" title="Open slot with no current process">&bull;</strong>');
    if ( this.innerText == 'S' ) jQuery(this).html('<strong class="starting" title="Starting">S</strong>');
  });

  // reset the 'TH' elements into a '<thead></thead>' set.
  jQuery('#apachetable').addClass('tablesorter'); jQuery('#apachetable TH').addClass('clickable');
  var h = jQuery('#apachetable TR:first').detach(); var h = '<thead>' + jQuery(h).html() + '</thead>'; // make sure the 1st row (psuedo header) is in a '<thead></thead>'
  jQuery('#apachetable').prepend(h);

  // prepare the table for sorting.
  jQuery('#apachetable').tablesorter({
    textExtraction: function(node) { var t = jQuery(node).attr('Xsortonme'); if ( ! t ) return node.innerHTML; return t; },
    sortList: [ [4,1] ], // initial sort on 4th-indexed column (5th column), CPU
    debug: false
  });

  // parse the '?v=' from the URL.
  window.myparseurl_jso={parser:function(str){if(str=='')return'';var op={strictMode:false,key:['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],q:{name:'querykey',parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};var m=op.parser[op.strictMode?'strict':'loose'].exec(str),uri={},i=14;while(i--)uri[op.key[i]]=m[i]||'';uri[op.q.name]={};uri[op.key[12]].replace(op.q.parser,function($0,$1,$2){if($1)uri[op.q.name][$1]=$2;});return uri;}};
  var pp = window.myparseurl_jso.parser(document.location.href);

  // prepare the H1 element.
  var h = jQuery('H1:first').html().replace(/Apache Server Status for .*via /,'').replace(')','');
  jQuery('H1:first').addClass('serverstatush1').html('Server Status IP:' + h + ' ' + pp.querykey.v + ' (/fhk script version ' + GM_info.script.version + ')');

  jQuery('DT:contains(Server load)').addClass('serverload');
  jQuery('DT:contains(requests currently being processed)').addClass('workers');

  var body = document.getElementsByTagName('BODY')[0];
  jQuery(window).unload(function(){ window.sizzle_apache_server_status_fhk_toolbar_textarea_manager_jso.unload(); });

  // Early injection support
  if (document.body === null) document.addEventListener('DOMNodeInserted', nodeInserted, true); else appendStyle();
})();

