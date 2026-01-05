// ==UserScript==
// @name        HRPG+
// @namespace   HRPG
// @description Heroes RPG+: Less effort, more info
// @include     http://heroesrpg.com/game.php*
// @include     http://www.heroesrpg.com/game.php*
// @version     1.1.6.28
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12880/HRPG%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/12880/HRPG%2B.meta.js
// ==/UserScript==
//todo: customise names from github - get people to come up with themes, maybe save boost stuff to prevent server overload, sound on death option, minimal interface overlay, get greasemonkey android to work, add chests to battle menu, chat log custom timeout for session, multiple word names, put points under finance?, minimal mode
window.get = function(name) { return window.localStorage.getItem(name); }
window.set = function(name, value) { return window.localStorage.setItem(name, value); }

window.checkboxHtml = function(name) { return `<input type="checkbox" id="${name}" ${get(name)=='true'?'checked="checked"':''}></input>`; }
window.chatCheckboxHtml = function(name) { return `<input type="checkbox" id="${name}" ${get(name)=='true'?'checked="checked"':''}></input>`; }
window.setCheckboxChange = function(names) { names.forEach(function(name,i){$(`#${name}`).change(function() {set(name,$(`#${name}`).is(':checked').toString());});});}
window.setChatChange = function(names) { names.forEach(function(name,i){$(`#${name}`).change(function() {set(name,$(`#${name}`).is(':checked').toString()); messageTypesVisible[i]=$(`#${name}`).is(':checked'); chatVisibilityChanged();});});}
window.set_global_change = function(names) {
  names.forEach(function(origname,i) {
    var name = 'show_' + origname;
    $(`#${name}`).change(function() {
      set(name,$(`#${name}`).is(':checked').toString());
      global_names.forEach(function(g_name,j){
          global_types_visible[j]=$(`#${name}`).is(':checked');
      });
      global_visibility_changed();
    });
  });
}

$('#chat1').prepend(`<table id="script_options_table"><tbody><tr><td id="hrpg_options_title" align="center"><b>HRPG+ options [<a href="javascript:toggleHrpgOptions()">${get('optionsVisibility')=='true'?'-':'+'}</a>]</b></td></tr><tr><td id="script_options_td"><table id="script_options"/></td></tr></tbody></table>`);
$('#script_options').html(`<tr><td>Volume: <input id="volume" type="number" min="0" max="100" value="100"></input></td></tr>
<tr><td>${checkboxHtml('removeChatLines')} Remove chat lines ${checkboxHtml('replaceAn')} Replace a(n) with a or an ${checkboxHtml('minimalMode')} Minimal UI</td></tr>
<tr><td><table><tbody>
<tr><td>Nugget's Alerts: </td>
<td>${checkboxHtml('riftAlerts')} Rift™ </td>
<td>${checkboxHtml('riftTabTitle')} Title </td>
<td>${checkboxHtml('pingAlerts')} Ping™ </td>
<td>${checkboxHtml('pingTabTitle')} Title </td>
<td>${checkboxHtml('clanAttentionAlerts')} Clan Attention™ </td>
<td>${checkboxHtml('clanAttentionTabTitle')} Title </td></tr>
<tr><td>Show: </td>
<td>${chatCheckboxHtml('showMain')} Main </td>
<td>${chatCheckboxHtml('showClan')} Clan </td>
<td>${chatCheckboxHtml('showTrade')} Trade </td>
<td>${chatCheckboxHtml('showGlobal')} Globals </td>
<td>${chatCheckboxHtml('showClanGlobal')} Clan Globals </td></tr>
<tr><td>Show globals: </td>
<td>${chatCheckboxHtml('show_lotto')} Lotto </td>
<td>${chatCheckboxHtml('show_open_chest')} Chest </td>
<td>${chatCheckboxHtml('show_pick_chest')} Pick </td>
<td>${chatCheckboxHtml('show_find_rare_item')} Rare items </td>
<td>${chatCheckboxHtml('show_big_drop')} Big drops </td>
<td>${chatCheckboxHtml('show_five_of_a_kind')} 5 of a kind </td></tr>
<tr><td></td>
<td>${chatCheckboxHtml('show_dh_added')} DH added </td>
<td>${chatCheckboxHtml('show_kill_achievement')} Kills </td>
<td>${chatCheckboxHtml('show_level_achievement')} Levels </td>
<td>${chatCheckboxHtml('show_quest_achievement')} Quests </td>
<td>${chatCheckboxHtml('show_boss_kill_achievement')} Boss Kills </td></tr>
<tr><td></td>
<td>${chatCheckboxHtml('show_rift_open_warning')} Rift opening </td>
<td>${chatCheckboxHtml('show_rift_open')} Rift open </td>
<td>${chatCheckboxHtml('show_rift_time_left')} Rift closing </td>
<td>${chatCheckboxHtml('show_rift_close')} Rift closed </td>
<td>${chatCheckboxHtml('show_rift_boss_kill')} Boss killed </td></tr>
<tr><td colspan="6"></td></tr>
</tbody></table></td></tr>`);
window.checkboxes = ['removeChatLines','riftAlerts','riftTabTitle','pingAlerts','pingTabTitle','clanAttentionAlerts','clanAttentionTabTitle', 'replaceAn'];
window.chatCheckboxes = ['showMain','showClan','showTrade','showGlobal','showClanGlobal'];
window.global_words_multiple = [['landed', 'total']];
window.global_names_multiple = ['boss_kill_achievement'];
window.global_words = ['found', 'gained', 'won', 'opened', 'picked', 'killed', 'reached', 'rolled', 'recieve', 'completed', 'landed', 'close', 'closed', 'open', 'opened!'];
window.global_names = ['find_rare_item', 'big_drop', 'lotto', 'open_chest', 'pick_chest', 'kill_achievement', 'level_achievement', 'five_of_a_kind', 'dh_added', 'quest_achievement', 'rift_boss_kill', 'rift_time_left', 'rift_close', 'rift_open_warning', 'rift_open'];//purchase
window.global_types_visible = global_names.map(function(data){return get(`show_${data}`)=='true';});//todo: its 1d now

setCheckboxChange(checkboxes);
setChatChange(chatCheckboxes);
set_global_change(global_names);

if($('#minimalMode').is(':checked')) { toggleMinimalMode(); }
$('#minimalMode').change(function(){ toggleMinimalMode(); set('minimalMode',$('#minimalMode').is(':checked'));});

if(get('optionsVisibility')!='true') { $('#script_options').hide(); }

$('#volume').change(function () {set('volume',$('#volume').val());});

$('body').append(`<script>Array.prototype.before = function (o){return this[this.indexOf(o)-1];}
Array.prototype.after = function (o){return this[this.indexOf(o)+1];}
String.prototype.replaceAt = function(n, t) {return this.slice(0, n) + t + this.slice(n + 1);}
String.prototype.trim = function() {return this.replace(/^\\s*(.*)\\s*$/,'$1');}
String.prototype.underscorify = function(){ return this.toLowerCase().replace(' ','_'); }
String.prototype.linkify = function() {
  return ` +'` ${this} `' +`.replace(/(?!.*\\.\\..*|.*\\/\\..*|.*x\\d\\.\\d.*)\\s+([^\\s<>\\(\\)]+\\.[^\\s<>\\(\\)]+)\\s+/gi, function(match, p1, string) {
    return ' <a href="'+ (/[a-z]+:\\/\\//.test(p1) ? p1 : 'http://' + p1) + '" target="_blank">' + p1.replace(/^https?:\\/\\//, '') + '</a> ';
  });
}
String.prototype.removeLast = function(i) { return this.slice(0,this.length-i); }
String.prototype.makeHtml = function() {
  g_urls = [];
  g_titles = [];
  g_html_blocks = [];
  return _UnescapeSpecialChars(_RunSpanGamut(_RunBlockGamut(_StripLinkDefinitions(_HashHTMLBlocks(
    _Detab(this.replace(/~/g,"~T").replace(/\\$/g,"~D").replace(/\\r\\n/g,"\\n").replace(/\\r/g,"\\n")).replace(/^[ \\t]+$/mg,"")
  ))))).replace(/~D/g,"$$").replace(/~T/g,"~");
}</script>`);

$('head').append(`<style type="text/css">.overlay {
  opacity:    1; 
  width:      100%;
  height:     100%; 
  z-index:    10;
  top:        0; 
  left:       0; 
  position:   fixed; 
}</style>`);

$('#script_options_table').prepend('<table id="timers"><tbody><tr><td>Double: </td><td id="double_left"></td><td>Haste: </td><td id="haste_left"></td><td>Next scheduled rift: </td><td id="time_to_rift"></td></tr></tbody></table>');

window.double_end = 0;
window.haste_end = 0;

window.secondsToString = function(seconds) {
  return (('0' + Math.floor(seconds/3600)).slice(-2) + ':' + ('0' + Math.floor(seconds/60)%60).slice(-2) + ':' + ('0' + seconds%60).slice(-2));
}

setInterval(function() {
  var dt = new Date();
  var now = ((dt.getUTCSeconds() + (60 * (dt.getUTCMinutes() + (60 * dt.getUTCHours()))))-14400)%86400;
  var double_left = double_end - now;
  var haste_left = haste_end - now;
  $('#double_left').html(double_left>0?secondsToString(double_left):'00:00:00');
  $('#haste_left').html(haste_left>0?secondsToString(haste_left):'00:00:00');
  $('#time_to_rift').html(secondsToString(14400-(now%14400)));
}, 1000);

window.center_classes = '#center, #content, #level-notification, #gathering-exp';

window.toggleMinimalMode = function() {
  toggleMainStats();
  toggleHeader();
  toggleHolderRight();
}

window.toggleMainStats = function() {
  if($('#main-stats').is(':visible')) { $('#main-stats').hide(); $(center_classes).width('+=200'); $('#content table').width(743); }
  else { $('#main-stats').show(); $(center_classes).width('-=200'); $('#content table').width(543); }
}//let users minimise specific things?

window.toggleHeader = function() {
  $('#header').toggle();
}

window.chat_classes = '#left, #chat_input, #chatgame_input, #chat1, #chat10, #chat50, #chat100, #chat1 table, #chat10 table, #chat50 table, #chat100 table, #chat1 table tr td, #chat10 table tr td, #chat50 table tr td';
//'script_options_td'

window.toggleHolderRight = function() {
  if($('#holder-right').is(':visible')) { $('#holder-right').hide(); $(`${chat_classes}, ${center_classes}`).not('#script_options_td td, #timers td').width('+=200'); $('#channels button').width(233); $('#content table').width($('#main-stats').is(':visible')?743:943); $('#script_options_td').width(954); }
  else { $('#holder-right').show(); $(`${chat_classes}, ${center_classes}`).not('#script_options_td td, #timers td').width('-=200'); $('#channels button').width(183); $('#content table').width($('#main-stats').is(':visible')?543:743); $('#script_options_td').width(754); }
}

window.Array.prototype.before = function (o){return this[this.indexOf(o)-1];}
window.Array.prototype.after = function (o){return this[this.indexOf(o)+1];}
window.String.prototype.replaceAt = function(n, t) {return this.slice(0, n) + t + this.slice(n + 1);}
window.String.prototype.trim = function() {return this.replace(/^\s*(.*)\s*$/,'$1');}
window.String.prototype.underscorify = function(){ return this.toLowerCase().replace(' ','_'); }
window.String.prototype.linkify = function() {
  return ` ${this} `.replace(/(?!.*\.\..*|.*\/\..*|.*x\d\.\d.*)\s+([^\s<>\(\)]+\.[^\s<>\(\)]+)\s+/gi, function(match, p1, string) {
    return ' <a href="'+ (/[a-z]+:\/\//.test(p1) ? p1 : 'http://' + p1) + '" target="_blank">' + p1.replace(/^https?:\/\//, '') + '</a> ';
  });
}
window.String.prototype.removeLast = function(i) { return this.slice(0,this.length-i); }

$('#bright_select').append(`
<option value="100">Boosts</option>
<option value="101">Stats</option>
<option value="102">Skills</option>
<option value="103">Referrals</option>`);
$('#chat_input').before(`<select id="chat_channel">
<option value="1">Main</option>
<option value="2">Clan</option>
<option value="3">Trade</option></select>`);
$('#chat_input').width(707-$('#chat_channel').width()-4);
$('#chat_channel').change(function(){$('#chat_input').width(707-$('#chat_channel').width()-4)});//take minimal into account

$('#tright').before('<table id="tright_minimized"><tbody><tr><th colspan="2"><span>Skills [<a href="javascript:toggleSkillVisibility()">+</a>]</span></th></tr></tbody></table>');
$('#tright table tr th span').html('Skills [<a href="javascript:toggleSkillVisibility()">-</a>]');
$('#bright').before('<table id="bright_minimized"><tbody><tr><th colspan="2"><span>Equipment [<a href="javascript:toggleEquipVisibility()">+</a>]</span></th></tr></tbody></table>');
$('#bright table tr th span').html('Equipment [<a href="javascript:toggleEquipVisibility()">-</a>]');
if(get('tileVisibility') != 'true') { $($('tr','#compass')[6]).hide(); }
if(get('navVisibility') != 'true') { $($('tr','#compass')[1]).hide(); }
if(get('skillVisibility') != 'true') { $('#tright').hide(); $('#tright_minimized').show(); } else { $('#tright_minimized').hide(); }
if(get('equipVisibility') != 'true') { $('#bright').hide(); $('#bright_minimized').show(); } else { $('#bright_minimized').hide(); }
$($('tr','#compass')[5]).html(`<th colspan="2"><span>Tile [<a href="javascript:toggleTileVisibility()">${get('tileVisibility') == 'true' ? '-' : '+'}</a>]</span></th>`);
$($('tr','#compass')[0]).html(`<th colspan="2"><span>Navigation [<a href="javascript:toggleNavVisibility()">${get('navVisibility') == 'true' ? '-' : '+'}</a>]</span></th>`);

//todo:more
window.playAudio = function(name){
	audio = new Audio(`http://cdn.rawgit.com/somebody1234/misc-files/master/${name}.mp3`);
	audio.volume = parseFloat($('#volume').val())/100;
	audio.play();
}

window.tabTitleChanged = false;
window.autosLeft = 0;
$(window).on('focus', function() { tabTitleChanged = false; if(autosLeft > 0) { displayAutosRemaining(autosLeft); } else {resetTitle();} });
window.displayAutosRemaining = function(autos) { if(!tabTitleChanged) { autosLeft = autos; if(autos > 0) { document.title = 'Heroes RPG ('+autos+' Autos)'; } else { document.title = 'Heroes RPG (END OF AUTO)'; } } }

window.id = 1;
window.boost = 0;
window.name = '';
window.yourName = $('#s_cname')[0].textContent;

window.rarityNum = new Object();
window.rarityNum.common = 1;
window.rarityNum.uncommon = 2;
window.rarityNum.rare = 3;
window.rarityNum.epic = 4;
window.rarityNum.legendary = 5;

window.command = new Object();
window.command[''] = 'Posts <message> to main chat.'
window.command.M = 'Posts <message> to main chat.'
window.command.c = 'Posts <message> to clan chat.'
window.command.t = 'Posts <message> to trade chat.'
window.command.m = 'Posts <message> to <name>.'
window.command.double = 'Shows length of double and haste remaining.'
window.command.haste = 'Shows length of double and haste remaining.'
window.command.commands = 'Shows a list of commands.'
window.command.command = 'Shows information about <commandname>.'
window.command.profile = 'Shows profile of <name>.'
window.command.who = 'Shows basic information of <name>.'
window.command.misc = 'Shows battles and quests of <name>.'
window.command.crafting = 'Shows crafting levels of <name>.'
window.command.gathering = 'Shows gathering levels of <name>.'
window.command.stats = 'Shows your stats.'
window.command.skills = 'Shows your skills.'
window.command.ref = 'Shows your referral link and your referrals.'

window.hideableMessageTypes = ['main, .emote','clan','trade','global','clanglobal'];
window.messageTypesVisible = [get('showMain'),get('showClan'),get('showTrade'),get('showGlobal'),get('showClanGlobal')];

window.chatVisibilityChanged = function(){
  var filter = '';
  hideableMessageTypes.forEach(function(name, i){ if(!messageTypesVisible[i]) { filter += `.${hideableMessageTypes[i]}, `; } });
  $('#chat_table1 tr').show().filter(filter.removeLast(2)).hide();
  global_visibility_changed();
}

window.global_visibility_changed = function(){
  if($('#showGlobal').is(':checked')) {
    var filter = '';
    global_names.forEach(function(names, i){ if($.isArray(names)){names.forEach(function(name, j){ if(!global_types_visible[i][j]){filter += `.${global_names[i][j]}, `;}; })} });
    $('#chat_table1 tr.global').show().filter(filter.removeLast(2)).hide();
  }
}

//Start Showdown

window.g_list_level = 0;
  
String.prototype.makeHtml = function() {
  g_urls = [];
  g_titles = [];
  g_html_blocks = [];
  return _UnescapeSpecialChars(_RunSpanGamut(_RunBlockGamut(_StripLinkDefinitions(_HashHTMLBlocks(
    _Detab(this.replace(/~/g,"~T").replace(/\$/g,"~D").replace(/\r\n/g,"\n").replace(/\r/g,"\n")).replace(/^[ \t]+$/mg,"")
  ))))).replace(/~D/g,"$$").replace(/~T/g,"~");
}

window._StripLinkDefinitions = function(text) {
  return text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,
    function (wholeMatch,m1,m2,m3,m4) {
      m1 = m1.toLowerCase();
      g_urls[m1] = _EncodeAmpsAndAngles(m2);
      if (m3) { return m3+m4; } else if (m4) { g_titles[m1] = m4.replace(/"/g,"&quot;"); }
      return "";
    });
}

window.block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";
window.block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";

window._HashHTMLBlocks = function(text) {
  return text.replace(/\n/g,"\n\n")
             .replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement)
             .replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement)
             .replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement)
             .replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement)
             .replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement)
             .replace(/\n\n/g,"\n");
}

window.hashElement = function(wholeMatch,m1) {
  return "~K" + (g_html_blocks.push(
    m1.replace(/\n\n/g,"\n")
      .replace(/^\n/,"")
      .replace(/\n+$/g,"")
  )-1).toString() + "K";
}

window._RunBlockGamut = function(text) {
	var key = hashBlock("<hr />");
  return _FormParagraphs(_HashHTMLBlocks(_DoBlockQuotes(_DoCodeBlocks(_DoLists(
		_DoHeaders(text).replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key).replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key).replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key)
	)))));
}

_FormParagraphs = function(text, doNotUnhash) {
  var grafs = text.replace(/^\n+/g,'').replace(/\n+$/g,'').split(/\n{2,}/g);
  var grafsOut = [];
  for (i = 0; i < grafs.length; i++) {
    var str = grafs[i];
    if (str.search(/~K(\d+)K/g) >= 0) { grafsOut.push(str); }
    else if (str.search(/\S/) >= 0) {
      str = _RunSpanGamut(str).replace(/^([ \t]*)/g,'');
      grafsOut.push(str);
    }
  }
  for (i=0; i<grafsOut.length; i++) {while(grafsOut[i].search(/~K(\d+)K/) >= 0) {grafsOut[i] = grafsOut[i].replace(/~K\d+K/,g_html_blocks[RegExp.$1].replace(/\$/g,"$$$$"));}}
  return grafsOut.join('/n/n');//\n\n?
}

window._RunSpanGamut = function(text) { return _DoItalicsAndBold(_EncodeAmpsAndAngles(_DoAutoLinks(_DoAnchors(_DoImages(_EncodeBackslashEscapes(_EscapeSpecialCharsWithinTagAttributes(_DoCodeSpans(text)))))))).replace(/  +\n/g," <br />\n"); }
window._EscapeSpecialCharsWithinTagAttributes = function(text) { return text.replace(/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi, function(wholeMatch) { return escapeCharacters(wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`"),"\\`*_"); }); }

window._DoAnchors = function(text) {
  return text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag)
             .replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag)
             .replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);
}

window.writeAnchorTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
  if (m7 == undefined) m7 = "";
  var whole_match = m1;
  var link_text   = m2;
  var link_id   = m3.toLowerCase();
  var url    = m4;
  var title  = m7;
  if (url == "") {
    if (link_id == "") { link_id = link_text.toLowerCase().replace(/ ?\n/g," "); }
    url = "#"+link_id;
    if (g_urls[link_id] != undefined) {
      url = g_urls[link_id];
      if (g_titles[link_id] != undefined) { title = g_titles[link_id]; }
    }
    else { if (whole_match.search(/\(\s*\)$/m)>-1) { url = ""; } else { return whole_match; } }
  }
  url = escapeCharacters(url,"*_");
  var result = "<a href=\"" + url + "\"";
  if (title != "") {
    title = title.replace(/"/g,"&quot;");
    title = escapeCharacters(title,"*_");
    result +=  " title=\"" + title + "\"";
  }
  result += ">" + link_text + "</a>";
  return result;
}

window._DoImages = function(text) { return text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag).replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag); }

window.writeImageTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
  var alt_text = m2;
  var link_id = m3.toLowerCase();
  var url = m4;
  var title= m7;
  if (!title) title = "";
  if (url == "") {
    if (link_id == "") { link_id = alt_text.toLowerCase().replace(/ ?\n/g," "); }
    url = "#"+link_id;
    if (g_urls[link_id] != undefined) {
      url = g_urls[link_id];
      if (g_titles[link_id] != undefined) { title = g_titles[link_id]; }
    }
    else { return m1; }
  }
  alt_text = alt_text.replace(/"/g,"&quot;");
  url = escapeCharacters(url,"*_");
  var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";
  title = title.replace(/"/g,"&quot;");
  title = escapeCharacters(title,"*_");
  result +=  " title=\"" + title + "\"";
  result += " />";
  return result;
}

window._DoHeaders = function(text) {
  return text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(wholeMatch,m1){return hashBlock("<h1>" + _RunSpanGamut(m1) + "</h1>");})
             .replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(matchFound,m1){return hashBlock("<h2>" + _RunSpanGamut(m1) + "</h2>");})
             .replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(wholeMatch,m1,m2) {
               var h_level = m1.length;
               return hashBlock("<h" + h_level + ">" + _RunSpanGamut(m2) + "</h" + h_level + ">");
             });
}

window._ProcessListItems;//what

window._DoLists = function(text) {
  text += "~0";
  var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
  if (g_list_level) {
    text = text.replace(whole_list,function(wholeMatch,m1,m2) {
      var list_type = (m2.search(/[*+-]/g)>-1) ? "ul" : "ol";
      return "<"+list_type+">" + _ProcessListItems(m1.replace(/\n{2,}/g,"\n\n\n")).replace(/\s+$/,"") + "</"+list_type+">\n";
    });
  } else {
    whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
    text = text.replace(whole_list,function(wholeMatch,m1,m2,m3) {
      var list_type = (m3.search(/[*+-]/g)>-1) ? "ul" : "ol";
      return m1 + "<"+list_type+">\n" + _ProcessListItems(m2.replace(/\n{2,}/g,"\n\n\n")) + "</"+list_type+">\n";
    });
  }
  return text.replace(/~0/,"");
}

window._ProcessListItems = function(list_str) {
  g_list_level++;
  list_str = (list_str.replace(/\n{2,}$/,"\n")+"~0").replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
    function(wholeMatch,m1,m2,m3,m4){
      if (m1 || (m4.search(/\n{2,}/)>-1)) { m4 = _RunBlockGamut(_Outdent(m4)); }
      else { m4 = _RunSpanGamut(_DoLists(_Outdent(m4)).replace(/\n$/,"")); }
      return  "<li>" + m4 + "</li>\n";
    }  );
  g_list_level--;
  return list_str.replace(/~0/g,"");
}

window._DoCodeBlocks = function(text) { return (text+"~0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function(wholeMatch,m1,m2) { return hashBlock("<pre><code>" + _Detab(_EncodeCode( _Outdent(m1))).replace(/^\n+/g,"").replace(/\n+$/g,"") + "\n</code></pre>") + m2;}).replace(/~0/,""); }
window.hashBlock = function(text) { return "~K" + (g_html_blocks.push(text.replace(/(^\n+|\n+$)/g,""))-1).toString() + "K"; }
window._DoCodeSpans = function(text) { return text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(wholeMatch,m1,m2,m3,m4) { return m1+"<code>"+_EncodeCode(m3.replace(/^([ \t]*)/g,"").replace(/[ \t]*$/g,""))+"</code>";}); }
window._EncodeCode = function(text) { return escapeCharacters(text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"\*_{}[]\\",false); }
window._DoItalicsAndBold = function(text) {   return text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>").replace(/(\w)_(\w)/g, "$1~E95E$2").replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>"); }

window._DoBlockQuotes = function(text) {
  return text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(wholeMatch,m1) {
    return hashBlock("<blockquote>\n" + _RunBlockGamut(m1.replace(/^[ \t]*>[ \t]?/gm,"~0")
      .replace(/~0/g,"")
      .replace(/^[ \t]+$/gm,""))
      .replace(/(^|\n)/g,"$1  ")
      .replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(wholeMatch,m1) { return m1.replace(/^  /mg,"~0").replace(/~0/g,""); }) + "\n</blockquote>");
  });
}

window._EncodeAmpsAndAngles = function(text) { return text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;").replace(/<(?![a-z\/?\$!])/gi,"&lt;"); }
window._EncodeBackslashEscapes = function(text) { return text.replace(/\\(\\)/g,escapeCharacters_callback).replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback); }
window._DoAutoLinks = function(text) { return text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>").replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, function(wholeMatch,m1) { return _EncodeEmailAddress(_UnescapeSpecialChars(m1));});}

window._EncodeEmailAddress = function(addr) {
  function char2hex(ch) {
    var hexDigits = '0123456789ABCDEF';
    var dec = ch.charCodeAt(0);
    return(hexDigits.charAt(dec>>4) + hexDigits.charAt(dec&15));
  }
  encode = [
    function(ch){return "&#"+ch.charCodeAt(0)+";";},
    function(ch){return "&#x"+char2hex(ch)+";";},
    function(ch){return ch;}
  ];
  addr = ("mailto:" + addr).replace(/./g, function(ch) {
    if (ch == "@") { return encode[Math.floor(Math.random()*2)](ch); } else if (ch !=":") {
      var r = Math.random();
      return  (r > .9  ?  encode[2](ch):r > .45 ?  encode[1](ch):encode[0](ch));
    }
  });
  return ("<a href=\"" + addr + "\">" + addr + "</a>").replace(/">.+:/g,"\">");
}

window._UnescapeSpecialChars = function(text) { return text.replace(/~E(\d+)E/g, function(wholeMatch,m1) { return String.fromCharCode(parseInt(m1)); }); }
window._Outdent = function(text) { return text.replace(/^(\t|[ ]{1,4})/gm,"~0").replace(/~0/g,""); }

window._Detab = function(text) {
  return text.replace(/\t(?=\t)/g,"    ")
             .replace(/\t/g,"~A~B")
             .replace(/~B(.+?)~A/g, function(wholeMatch,m1,m2) {
               var numSpaces = 4 - m1.length % 4;
               for (var i=0; i<numSpaces; i++) m1+=" ";
               return m1; })
             .replace(/~A/g,"    ")
             .replace(/~B/g,"");
}

window.escapeCharacters = function(text, charsToEscape, afterBackslash) {
  var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";
  if (afterBackslash) { regexString = "\\\\" + regexString; }
  var regex = new RegExp(regexString,"g");
  return text.replace(regex,escapeCharacters_callback);
}

window.escapeCharacters_callback = function(wholeMatch,m1) { return "~E"+m1.charCodeAt(0)+"E"; }

//End Showdown

window.boosts = ['Battle Exp', 'Gold', 'Attribute', 'Battle SP', 'Gathering Exp', 'Gathering SP', 'Drop'];
window.gemTypes = ['Ruby', 'Emerald', 'Diamond', 'Sapphire', 'Amethyst'];
window.gemRarities = ['Fractured', 'Chipped', 'Dull', 'Clouded', 'Bright', 'Glowing', 'Radiant', 'Flawless', 'Perfect', 'Priceless'];
window.gemRarityBoosts = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];

window.addCreditBoost = function(id,name) {
  $.post('upgrade.php', {mod:'boosts'}, function(data){
    var current = parseFloat($('#' + name.underscorify()).text());
    var percentage = $('td',$('tr',data.v)[id+1])[1].textContent.split(' ')[0];
    current += parseFloat(percentage.removeLast(1));
    $('#' + name.underscorify()).text(current);
  }, 'json');
}


window.addClanBoost = function(id,name) {
  $.post('clan.php', {mod:'buildinglist', id:id+10}, function(data){
    var current = parseFloat($('#' + name.underscorify()).text());
    current += parseFloat($(data.v)[5].textContent.split(' ')[2]) * (id==7?3:10);
    $('#' + name.underscorify()).text(current);
  }, 'json');
}

window.addGemBoost = function(id,name) {
  $.post('displayr.php', {mod:1}, function(data) {
    var array = $('a',data.html);
    for(var i = 0; i < array.length; i++){
      if(array[i].id!='') { continue; }
      if(array[i].href.match(/:(.*)\(/)[1] == 'viewItem'){
        $.post('misc.php', {mod:'viewitem', id:parseInt(array[i].href.match(/\((.*)\)/)[1])}, function(data) {
          var values = $.map($('td',data.v),function(data){return data.textContent;});
          var sockets = values.after('Sockets');
          for(var j = 0; j < sockets; j++) {
            var gem = values.after(`S${j+1}:`);
            var words = gem.split(' ');
            if(gemTypes.indexOf(words[1]) + 1 == id) {
              var current = parseFloat($('#' + name.underscorify()).text());
              current += parseFloat(gemRarityBoosts[gemRarities.indexOf(words[0])])/10;
              $('#' + name.underscorify()).text(current);
            }
          }
        }, 'json');
      }
      if(array[i].href.match(/:(.*)\(/)[1] == 'viewAccessory'){
        $.post('http://heroesrpg.com/misc.php', {mod:'viewaccessory', id:array[i].href.match(/\((.*)\)/)[1]}, function(data) {
          var array = $.map($('td',data.v),function(data){return data.textContent;});
          gem = array[array.length - 1].slice(5);
          if(gem != 'Unequip To Socket'){
            var words = gem.split(' ');
            if(gemTypes.indexOf(words[1]) + 1 == id){
              var bonus = array[array.length - 2];
              bonus = bonus.removeLast(1);
              var current = parseFloat($('#' + name.underscorify()).text());
              current += parseFloat(gemRarityBoosts[gemRarities.indexOf(words[0])])/10 * (1 + parseFloat(bonus)/100);
              $('#' + name.underscorify()).text(current);
            }
          }
        }, 'json');
      }
    }
  }, 'json');
}

window.refreshBoosts = function(){
  var option = $('#boost_select').val();
  var boostHtml = '';
  for(var id = 0; id < boosts.length - 1; id++){
    var name = boosts[id];
    $('#' + name.underscorify()).html('0');
    if(option == 2 || option == 1) addCreditBoost(parseInt(id)+1,name);
    if(option == 3 || option == 1) addClanBoost(parseInt(id)+1,name);
    if(option == 4 || option == 1) addGemBoost(parseInt(id)+1,name);
  }
  $('#' + boosts[boosts.length-1].underscorify()).html('0');
  if(option == 3 || option == 1) addClanBoost(boosts.length,boosts[boosts.length-1]);
}

window.toggleTileVisibility = function() {
  $($('tr','#compass')[6]).toggle();
  set('tileVisibility',$($('tr','#compass')[6]).is(':visible'));
  $($('tr','#compass')[5]).html(`<th colspan="2"><span>Tile [<a href="javascript:toggleTileVisibility()">${get('tileVisibility')=='true'?'-':'+'}</a>]</span></th>`);
}

window.toggleNavVisibility = function() {
  $($('tr','#compass')[1]).toggle();
  set('navVisibility',$($('tr','#compass')[1]).is(':visible'));
  $($('tr','#compass')[0]).html(`<th colspan="2"><span>Nav [<a href="javascript:toggleNavVisibility()">${get('navVisibility')=='true'?'-':'+'}</a>]</span></th>`);
}

window.toggleSkillVisibility = function() {
  $('#tright').toggle();
  set('skillVisibility',$('#tright').is(':visible'));
  if($('#tright').is(':visible')) { $('#tright_minimized').hide(); } else { $('#tright_minimized').show(); }
}

window.toggleEquipVisibility = function() {
  $('#bright').toggle();
  set('equipVisibility',$('#bright').is(':visible'));
  if($('#bright').is(':visible')) { $('#bright_minimized').hide(); } else { $('#bright_minimized').show(); }
}

window.toggleHrpgOptions = function() {
  $('#script_options').toggle();
  set('optionsVisibility',$('#script_options').is(':visible'));
  $('#hrpg_options_title').html(`<b>HRPG+ options [<a href="javascript:toggleHrpgOptions()">${get('optionsVisibility')=='true'?'-':'+'}</a>]</b>`);
}

window.rolls = ['No Win','One Pair','Two Pair','Three of a Kind','Straight','Full House','Four of a Kind','Five of a Kind']//TODO: kind?
window.rollSP = [2,10,12,15,30,30,75,300]
window.rollChance = [80,600,300,200,40,50,25,1]
window.totalRollChance = 1296;

window.chatLine = function(msg){
  $('#chat_table1').prepend('<tr id="ct1_tr'+(chatid1)+'"><td>'+msg+'</td></tr>');
  window.chatid1++;
}

window.send_msg = function(msg){
  $.post('chat.php', {mod:'send', msg:msg}, function(data) {
    if(!data.err) {
      if(data.addignore) {ignored.push(data.addignore);}
      if(data.remignore) {ignored.splice(ignored.indexOf(data.remignore, 1));}
      chatinactivity = 0;
      update_chat(0);
    } else { displayError(data.err); }
  }, 'json');
}

window.send_chat = function(){
  var msg = chatInputElem.val().trim();
  var command = '';
  if(msg.startsWith('/')) { command = msg.toLowerCase().slice(1); }
  if(['stats','skills','ref'].indexOf(command) != -1){ changeTab(command); }
  if(!msg.startsWith('/') && $('#chat_channel').val() != 1){
    if($('#chat_channel').val() == 2) { msg = '/c ' + msg; }
    else if($('#chat_channel').val() == 3) { msg = '/t ' + msg; }
  }
  if(command.startsWith(' ')){ msg = msg.slice(2); }
  if(command.startsWith('M ')){ msg = msg.slice(3); }
  if(command == 'commands'){
    chatLine('<font color="BBFFBB">/M &lt;message&gt;, / &lt;message&gt;, /c &lt;message&gt;, /g &lt;message&gt;, /t &lt;message&gt;, /m &lt;name&gt;: &lt;message&gt;, /double, /haste, /commands, /command &lt;commandname&gt;, /profile &lt;name&gt;, /who &lt;name&gt;, /misc &lt;name&gt;, /gathering &lt;name&gt;, /crafting &lt;name&gt;, /stats, /skills, /ref</font>');
    chatInputElem.val('');
    return;
  }
  if(command.startsWith('command ')){
    var commandName=msg.slice(9);
    console.log(commandName);
    console.log(command[commandName]);
    chatInputElem.val('');
    chatLine(`<font color="BBFFBB">/${commandName}: ${window.command[commandName].replace('<','&lt;').replace('>','&gt')}</font>`);
    return;
  }
  if(command.startsWith('profile ')){
    viewPlayer(msg.slice(9));
    chatInputElem.val('');
    return;
  }
  if(command.startsWith('who ')){
    $.post('misc.php', {mod:'viewplayer', id:msg.slice(5)}, function(data) {
      array = $.map($('td',data.v),function(n){return n.textContent;});
      name = array.after('Name:');
      online = false;
      line1 = `<font color="BBFFBB"><a href="javascript:m('${name}');">${name}</a> - ${$('a',data.v)[0]?$('a',data.v)[0].outerHTML:'[No Clan]'} - Level ${array.after('Level:')} - ${array.after('Nobility Rank:')} - `;
      line2 = ` - <a href="javascript:viewPlayer('${name}')">Profile</a></font>`;
      $.post('misc.php', {mod:'playersonlinelist'}, function(data) { 
        if($.map($('td',data.v),function(n){return n.textContent;}).indexOf(name) != -1) {
          chatLine(line1.concat('[ONLINE]').concat(line2));
        } else {
          chatLine(line1.concat('<font color="#FFBBBB">[OFFLINE]</font>').concat(line2));
        }
      }, 'json');
    }, 'json');
    chatInputElem.val('');
    return;
  }
  if(command.startsWith('misc ')){
    $.post('misc.php', {mod:'viewplayer', id:msg.slice(6)}, function(data) {
      array = $.map($('td',data.v),function(n){return n.textContent;});
      name = array.after('Name:');
      chatLine(`<font color="BBFFBB"><a href="javascript:m('${name}');">${name}</a> - Battles: ${array.after('Battles:')} - Battle Quests: ${array.after('Battle Quests:')} - TS Quests: ${array.after('TS Quests:')}</font>`);
    }, 'json');
    chatInputElem.val('');
    return;
  }
  if(command.startsWith('crafting ')){
    $.post('misc.php', {mod:'viewplayer', id:msg.slice(10)}, function(data) {
      array = $.map($('td',data.v),function(n){return n.textContent;});
      name = array.after('Name:');
      chatLine(`<font color="BBFFBB"><a href="javascript:m('${name}');">${name}</a> - Forging: ${array.after('Forging:')} - Leatherworking: ${array.after('Leatherworking:')} - Enchanting: ${array.after('Enchanting:')} - Lockpicking: ${array.after('Lockpicking:')} - Jewelcrafing: ${array.after('Jewelcrafting:')}</font>`);
    }, 'json');
    chatInputElem.val('');
    return;
  }
  if(command.toLowerCase().startsWith('gathering ')){
    $.post('misc.php', {mod:'viewplayer', id:msg.slice(11)}, function(data) {
      array = $.map($('td',data.v),function(n){return n.textContent;});
      name = array.after('Name:');
      chatLine(`<font color="BBFFBB"><a href="javascript:m('${name}');">${name}</a> - Hunting: ${array.after('Hunting:')} - Mining: ${array.after('Mining:')} - Woodcutting: ${array.after('Woodcutting:')} - Quarrying: ${array.after('Quarrying:')}</font>`);
    }, 'json');
    chatInputElem.val('');
    return;
  }
  if(command.startsWith('g ')){msg.replaceAt(2,'c');}
  $.post('chat.php', {mod:'send', msg:msg}, function(data) {
    if(!data.err) {
      if(data.addignore) {ignored.push(data.addignore);}
      if(data.remignore) {ignored.splice(ignored.indexOf(data.remignore, 1));}
      chatInputElem.val('');
      chatinactivity = 0;
      update_chat(0);
    } else { displayError(data.err); }
  }, 'json');
}

window.bRightSelect = function() {
  mod = $('#bright_select').val();
  if(mod == 100){
    $('#bright_content').html(`<table><tr><td align="center"><select id="boost_select" onchange="javascript:refreshBoosts();">
<option value="1">Total</option>
<option value="2">Credit</option>
<option value="3">Clan</option>
<option value="4">Equipment</option>
</select></td></tr></table><table id="boosts"></table>`);
    for(var i = 0; i < boosts.length; i++){
      $('#boosts').append(`<tr><td>${boosts[i]}:</td><td id="${boosts[i].underscorify()}"></td><td>%</td></tr>`);
    }
    refreshBoosts();
  }
  else if(mod == 101){ changeTab('stats'); send_msg('/stats'); }
  else if(mod == 102){ changeTab('skills'); send_msg('/skills'); }
  else if(mod == 103){ changeTab('ref'); send_msg('/ref'); }
  else { $.post('displayr.php', {mod:mod}, function(data) { $('#bright_content').html(data.html); }, 'json'); }
}

window.changeTab = function(name) {
  if(name == 'stats') { $('#bright_select').val(101); $('#bright_content').html(`<table id="info"></table>`); }
  else if(name == 'skills') { $('#bright_select').val(102); $('#bright_content').html(`<table id="info"></table>`); }
  else if(name == 'ref') { $('#bright_select').val(103); $('#bright_content').html(`<table id="info"></table>`); }
}

window.vowels = ['a','e','i','o','u']

window.replaceAn = function(string) {
  if($('#replaceAn').is(':checked') && string.indexOf('a(n)') != -1) { return string.replace('a(n)',vowels.indexOf(string[string.indexOf('a(n)')+5].toLowerCase) != -1 ? 'an' : 'a'); }
  return string;
}

window.possibleClanAttentionAlert = function(name, message, mode) {
  $.post('clan.php', {mod:'members'}, function(data){
    var html = data.v;
    var coLeader = false;
    var indexOfCl = html.indexOf(name)+name.length+4;
    if(html.slice(indexOfCl,indexOfCl+4) == '[CL]') {coLeader = true};
    if(html.slice(indexOfCl,indexOfCl+3) == '[L]') {coLeader = true};
    if(coLeader && mode == 'audio'){playAudio('alert');}
    if(coLeader && mode == 'title'){document.title=`${name}: ${message}`;}
  }, 'json');
}

window.update_chat = function(initiate) {
  stopActivityTimer();
  startActivityTimer();
  $.post('chatupdate2.php', {initiate:initiate}, function(data) {
    if(data.c) {
      data.c.forEach(function(item, i) {
        if($.inArray(data.c[i].uid, ignored) < 0) {
          var c = data.c[i];
          var chat_table = 1;
          var $class = '';
          var global_class = '';
          var msg = '';
          var text = c.message.replace(/<[^<>]*>/g,'');
          if(c.type == 1 || c.type == 20 || c.type == 30 || c.type == 55 || c.type == 1000) c.message = c.message.linkify().makeHtml();
          if(c.type == 1) { $class = 'main'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' '+genStatus(c.status)+'<a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>';
            if($('#pingAlerts').is(':checked') && c.message.contains(yourName)){playAudio('bell');}
            if($('#pingTabTitle').is(':checked') && c.message.contains(yourName)){ document.title = 'Your name has been mentioned.'; tabTitleChanged = true; }}
          else if(c.type == 0) { $class = 'chaterror'; msg = '<span class="time">['+c.time+']</span> <span style="color: #FF8888">'+c.message+'</span>'; }
          else if(c.type == 5) { $class = 'info'; msg = '<span class="time">['+c.time+']</span> <span style="color: #55AA55">'+c.message+'</span>';
            var words = c.message.split(' ');
            if(words[0]=='Double') {
              var time = c.time.split(':');
              var dh_start = parseInt(time[2]) + (60 * (parseInt(time[1]) + (60 * parseInt(time[0]))));
              double_end = dh_start + parseInt(words.before('Seconds')||0) + (60 * parseInt(words.before('Minutes')||0) + (60 * parseInt(words.before('Hours')||0)));
              words = words.slice(words.indexOf('Hours')+1);
              haste_end = dh_start + parseInt(words.before('Seconds')||0) + (60 * parseInt(words.before('Minutes')||0) + (60 * parseInt(words.before('Hours')||0)));
              return;
            }
            $('#info').html(`<tr><td>${c.message.slice(0,c.message.indexOf('Berserk')).replace(/: /g,':</td><td>').replace(/<br \/>/g,'</td></tr><tr><td>')}${ c.message.slice(c.message.indexOf('Berserk'))}</td></tr>`); return; }
          else if(c.type == 10) { $class = 'global'; msg = '<span class="time">['+c.time+']</span> <span style="color: #88FF88">Global: '+replaceAn(c.message)+'</span>';
            if($('#riftAlerts').is(':checked') && c.message == '<span style="color: #CC66CC">A Rift will open in 5 minutes!</span>') {playAudio('foghorn');}
            if($('#riftAlerts').is(':checked') && c.message == `<span style="color: #CC66CC">A Rift has opened! The Rift will close in 10 minutes!</span> [<a href="javascript:enterRift()">Enter Rift</a>]`) {playAudio('rumble');}
            if($('#riftTabTitle').is(':checked') && c.message == '<span style="color: #CC66CC">A Rift will open in 5 minutes!</span>') {document.title = 'A rift is opening.'; tabTitleChanged = true;}
            if($('#riftTabTitle').is(':checked') && c.message == `<span style="color: #CC66CC">A Rift has opened! The Rift will close in 10 minutes!</span> [<a href="javascript:enterRift()">Enter Rift</a>]`) {document.title = 'A Rift has opened.'; tabTitleChanged = true;}
            if($('#globalAlerts').is(':checked') && c.message.startsWith(yourName)) { playAudio('victory'); }
            if($('#globalTabTitle').is(':checked') && c.message.startsWith(yourName)) { document.title = 'You got a global.'; tabTitleChanged = true; }
            global_words_multiple.forEach(function(words, j){var k = -1; words.forEach(function(word, k){if(text.indexOf(word) != -1) { k++; }}); if(k == global_words_multiple[j].length){global_class = global_names_multiple[j]}});
            global_words.forEach(function(word, j){var k = text.indexOf(word); if(k != -1){ global_class = global_names[j]; }});
            if(!c.message.startsWith('<') && !c.message.startsWith('Everyone')) { var name = c.message.split(' ')[0]; c.message.replace(name, `<a href="javascript:viewPlayer('${name}')">${name}</a>`)} }
          else if(c.type == 1000) { $class = 'clan'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' <span style="color: #FFFF00">[Clan] <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>';
            if($('#clanAttentionAlerts').is(':checked') && c.message.startsWith('ATTENTION: ')){possibleClanAttentionAlert(c.cname, c.message,'audio');}
            if($('#clanAttentionTabTitle').is(':checked') && c.message.startsWith('ATTENTION: ')){possibleClanAttentionAlert(c.cname, c.message,'title');}}
          else if(c.type == 1001) { $class = 'clanglobal'; msg = '<span class="time">['+c.time+']</span> <span style="color: #FFFF00">Clan Global: '+c.message+'</span>'; }
          else if(c.type == 20) { $class = 'newbie'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' <span style="color: #9999FF">[Newbie] <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; }
          else if(c.type == 30) { $class = 'staff'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' <span style="color: #FF9933">[Staff] <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; }
          else if(c.type == 55) { $class = 'trade'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' <span style="color: #00BB00">[Trade] <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; }
          else if(c.type == 50) { $class = 'pmto'; msg = '<span class="time">['+c.time+']</span> <span style="color: #FF7171">Message Received: <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; }
          else if(c.type == 51) { $class = 'pmfrom'; msg = '<span class="time">['+c.time+']</span> <span style="color: #F59292">Message Sent: <a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; }
          else if(c.type == 2) { $class = 'emote'; msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' <i>* '+genStatus(c.status)+'<a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a> '+c.message+'</span></i>'; }
          else if(c.type == 99) { $class = 'log'; msg = '<span class="time">['+c.time+']</span> '+c.message; chat_table = 10; }
          else if(c.type == 101) { msg = '<span class="time">['+c.time+']</span> '+genrank(c.nrank, c.prank)+' '+genStatus(c.status)+'<a href="javascript:m(\''+c.cname+'\');">'+c.cname+'</a>: '+c.message+'</span>'; chat_table = 50; }
          if(chat_table == 10) {
            $('#chat_table10').prepend('<tr id=\"ct10_tr'+(chatid10)+'\"><td>'+msg+'</td></tr>');
            chatid10++;
            if(chatview != 10) { chatcount10++; $('#chatcount10').html(' ('+chatcount10+')'); }
            if(initiate == 0 && $('#removeChatLines').is(':checked')) { $('#ct10_tr'+(chatid10-chatsize)).remove(); }
          }
          else if(chat_table == 50) {
            $('#chat_table50').prepend('<tr id=\"ct50_tr'+(chatid50)+'\"><td>'+msg+'</td></tr>');
            chatid50++;
            if(initiate == 0 && $('#removeChatLines').is(':checked')) { $('#ct50_tr'+(chatid50-chatsize)).remove(); }
          }
          else {
            if($(window).is(':focus')) { tabTitleChanged = false; if(autosLeft > 0) { displayAutosRemaining(autosLeft); } else {resetTitle();} }
            chatLine(msg);
            $(`#ct1_tr${chatid1-1}`).addClass($class);
            if(global_class != '') { $(`#ct1_tr${chatid1-1}`).addClass(global_class); }
            if(global_class == 'dh_added') { send_msg('/double'); }
            if(chatview != 1) { chatcount1++; $('#chatcount1').html(' ('+chatcount1+')'); }
            hideableMessageTypes.forEach(function(type_name, j) { if(!messageTypesVisible[j] && type_name.contains($class)) { $(`#ct1_tr${chatid1-1}`).hide(); } } );
            global_names.forEach(function(type, j) {if(type == global_class && !global_types_visible[j]) { $(`#ct1_tr${chatid1-1}`).hide(); } } );
            if(initiate == 0 && $('#removeChatLines').is(':checked')) { $('#ct1_tr'+(chatid1-chatsize)).remove(); }
          }
        }
        if(data.fl) {window.location = 'http://www.heroesrpg.com';}
      });
    }
    stopActivityTimer();
    clearTimeout(chattimer);
    if(chatinactivity < 20) {
      chatinactivity++;
      chattimer = setTimeout(function() {update_chat(0);}, 5000);
    } else {
      chattimer = setTimeout(function() {update_chat(0);}, 9000);
    }
  }, 'json');
}

send_msg('/double');