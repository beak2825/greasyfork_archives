// ==UserScript==
// @name        SteamGifts Steam Ratings
// @namespace   SG Ratings
// @include     *://www.steamgifts.com/
// @include     *://www.steamgifts.com/giveaways/search?*
// @include     *://www.steamgifts.com/giveaway/*
// @include     *://www.steamgifts.com/group/*
// @include     *://www.steamgifts.com/account/settings/giveaways/filters*
// @version     1.7.19
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @grant       GM.addStyle
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_listValues
// @grant       GM.listValues
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @connect     store.steampowered.com
// @connect     query.yahooapis.com
// @run-at      document-end
// @description:en Show Steam ratings on SteamGifts.
// @description Show Steam ratings on SteamGifts.
// @downloadURL https://update.greasyfork.org/scripts/12628/SteamGifts%20Steam%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/12628/SteamGifts%20Steam%20Ratings.meta.js
// ==/UserScript==

// GM4+ compatiblity code adapted from https://github.com/StigNygaard/GMCommonAPI.js STARTS HERE //
let info = (GM_info ? GM_info : GM.info);
if (info.scriptHandler === 'Greasemonkey' && parseInt(info.version,10)>=4){
    console.log("Using compatibility mode for GM4+");
    var GM4 = true;
} else {
    var GM4 = false;
}

function GM__registerMenuCommand(caption, commandFunc, options) {
    if (!GM4){
        GM_registerMenuCommand(caption, commandFunc, options);
    } else {
        if (typeof options === 'string') {
            options = {'accessKey': options};
        } else if (typeof options === 'undefined') {
            options = {};
        }
        if (!options['disabled']) {
            let prefix = '';
            if (options['type'] === 'radio') {
                prefix = options['checked'] ? '\u26AB ' : '\u26AA ';
            } else if (options['type'] === 'checkbox') {
                prefix = options['checked'] ? '\u2B1B ' : '\u2B1C ';
            }
        }
        let oMenu = document.createElement('menu');
        if (oMenu.type !== 'undefined') {
            if (!document.body) {
                return;
            }
            let topMenu = null;
            if (document.body.getAttribute('contextmenu')) {
                topMenu = document.querySelector('menu#' + document.body.getAttribute('contextmenu'));
            }
            if (!topMenu) {
                topMenu = document.createElement('menu');
                topMenu.setAttribute('type', 'context');
                topMenu.setAttribute('id', 'gm-registered-menu');
                document.body.appendChild(topMenu);
                document.body.setAttribute('contextmenu', topMenu.getAttribute('id'));
            }
            let menuItem = document.createElement('menuitem');
            menuItem.setAttribute('type', options['type'] ? options['type'] : 'command');
            menuItem.setAttribute('label', caption);
            if (options['id']) menuItem.setAttribute('id', options['id']);
            if (options['name']) menuItem.setAttribute('name', options['name']);
            if (options['checked']) menuItem.setAttribute('checked', 'checked');
            if (options['disabled']) menuItem.setAttribute('disabled', 'disabled');
            if (options['icon']) menuItem.setAttribute('icon', options['icon']);
            if (options['topLevel']) {
                topMenu.appendChild(menuItem);
            } else {
                let scriptMenu = topMenu.querySelector('menu[label="SteamGifts Steam Ratings"]');
                if (!scriptMenu) {
                    scriptMenu = document.createElement('menu');
                    scriptMenu.setAttribute('label', "SteamGifts Steam Ratings");
                    topMenu.appendChild(scriptMenu);
                }
                scriptMenu.appendChild(menuItem);
            }
            menuItem.addEventListener('click', commandFunc, false);
        }
    }
}

function GM__setValue(name, value) {
    if (!GM4){
        GM_setValue(name, value);
    } else {
        localStorage.setItem("SGSR" + '_' + name, value);
    }
}

function GM__getValue(name, defvalue) {
    if (!GM4){
        return GM_getValue(name, defvalue);
    } else {
        if (("SGSR"+'_'+name) in localStorage) {
            return localStorage.getItem("SGSR"+'_'+name);
        } else {
            return defvalue;
        }
    }
}

function GM__deleteValue(name) {
    if (!GM4){
        GM_deleteValue(name);
    } else {
        localStorage.removeItem("SGSR" + '_' + name);
    }
}

function GM__listValues() {
    if (!GM4){
        return GM_listValues();
    } else {
        let values = [];
        let prefix = "SGSR";
        let prelen = 4;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substr(0, prelen) === prefix) {
                values.push(localStorage.key(i).substr(prelen+1));
            }
        }
        return values;
    }
}

function GM__addStyle(style) {
    if (!GM4){
        return GM_addStyle(style);
    } else {
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let styleElem = document.createElement('style');
            styleElem.setAttribute('type', 'text/css');
            styleElem.textContent = style;
            head.appendChild(styleElem);
            return styleElem;
        }
    }
}

function GM__xmlhttpRequest(details) {
    if (!GM4){
        return GM_xmlhttpRequest(details);
    } else {
        return GM.xmlHttpRequest(details);
    }
}
// GM4+ compatiblity code adapted from https://github.com/StigNygaard/GMCommonAPI.js ENDS HERE //

defaults = {
  expiretime:3*24*60*60,
  expiretimeenabled:true,
  GAratings:true,
  GAfeatures:2,
  GAtags:2,
  GASratings:true,
  GASfeatures:true,
  GAStags:true,
  GASmeta:false,
  timer:false,
  iconsid:2,
  cardsicon: false,
  hidereviews:0,
  hidereviewsonsg:0,
  hidemissingreviews: false,
  betaTitle:true,
  usesteamdb:false,
  forceobserver: false,
  delayscan:0.3*1000,
  dbversion:10
};

function savedata(a,b){
  GM__setValue(a, JSON.stringify(b));
}

function loaddata(a,b){
  var val = GM__getValue(a,null);
  return (val !== null ? JSON.parse(val) : (b !== undefined ? b : false));
}

function setdefault(restoredefault){
  $.each(defaults, function( name, value ) {
    if (restoredefault===true){ GM__deleteValue(name); }
    if (name!=="dbversion"){
      window[name] = loaddata(name,value);
    } else {
      window[name] = value;
    }
  });
}
setdefault();

if(timer){ console.time('SG Ratings Internal'); console.time('SG Ratings'); }
var run = 0;

function log(text) {
    if(window.console && console.log) {
        console.log("SG Ratings: " + text);
    }
}

function clearstorage(a){
  var toscan = [];
  e = GM__listValues();
  for (var i=0; i<e.length; i++){ if(!isNaN(e[i])){ GM__deleteValue(e[i]); } }
  log((typeof(a)!=='undefined'?a+' ':'') + "Cleaning database.");
}

function toggleconfig(name,e){
  e = e||!GM__getValue(name,defaults[name]);
  GM__setValue(name,e);
  alert(name + ': ' + e);
}

function betaTitleIn(el,features,tags,rdate){
  var tab = document.createElement("table");
  tab.style.position = "absolute";
  tab.style.display = "inline";
  tab.style.padding = "0 8px";
  tab.style.marginLeft = "4px"
  tab.style.border = "1px solid #d2d6e0";
  tab.style.backgroundImage = "linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.98) 100%)";
  tab.style.zIndex = "1000";
  tab.style.lineHeight = "20px";
  if (el.offsetWidth < el.scrollWidth){ tab.style.left = el.getBoundingClientRect().left+105+4 + "px"; }
  if (!!features){
      var features = features.split('\n');
      var features2 = [];
      for (var bb=0; bb<features.length; bb++){
          var featuresid = features[bb].split('::')[0];
          var img = (featuresid!=='0'&& !isNaN(featuresid) && featuresid <= featuresicons.length ? '<img class="category ' + featuresicons[featuresid].replace(/_/g,'-').toLowerCase() + '"></img> ':'');
          features2.push(img + features[bb].split('::')[1]);
      }
      var features = features2.join("<br>");
  }
  tab.innerHTML = (!!rdate ? '<span>Release: ' + rdate + '</span>' : '') + (!!features ? '<td style="padding-right: 8px;">' + features + '</td><td style="padding-left: 8px;border-left: 1px solid;">' : "<td>") + tags.replace(/\b.+:/g,'').split('\n').join("<br>") + "</td>";
  el.appendChild(tab);
}

function betaTitleOut(el){
  el.removeChild(el.lastChild);
}

$.each([
        ["List current settings", function(){
            var set = [];
            $.each(defaults, function( name, value ) {
                if (name==='dbversion'){
                    set.push('\nDatabase version: ' + GM__getValue(name,value));
                } else {
                    set.push(name + ' = ' + GM__getValue(name,value) + ((GM__getValue(name,value)!=defaults[name])?" [default is " + defaults[name] + "]":""));
                }
            });
            set.push('Database entries: '+GM__listValues().length);
            alert(set.join('\n'));
        }],
        ["GA page: Show ratings",function(){ toggleconfig('GAratings'); }],
        ["GA page: Choose method to show features",function(){
            var temp = prompt("Default: " + defaults['GAfeatures'] + "\n\n0 = Disabled\n1 = Show on mouseover\n2 = Show on page", GM__getValue('GAfeatures',GAfeatures));
            if (!!temp.match(/0|1|2/)){ toggleconfig('GAfeatures',temp); } else { alert("invalid option"); }
        }],
        ["GA page: Choose method to show tags",function(){
            var temp = prompt("Default: " + defaults['GAtags'] + "\n\n0 = Disabled\n1 = Show on mouseover [default]\n2 = Show on page", GM__getValue('GAtags',GAtags));
            if (!!temp.match(/0|1|2/)){ toggleconfig('GAtags',temp); } else { alert("invalid option"); }
        }],
        ["GAS page: Show ratings",function(){ toggleconfig('GASratings'); }],
        ["GAS page: Show features",function(){ toggleconfig('GASfeatures'); }],
        ["GAS page: Show tags", function(){ toggleconfig('GAStags'); }],
        ["GAS page: Alternative mode to show features and tags [BETA]", function(){ toggleconfig('betaTitle'); }],
        ["GAS page: Show metascore", function(){ toggleconfig('GASmeta'); }],
        ["GAS page: Use SteamDB formula for ratings", function(){ toggleconfig('usesteamdb'); }],
        ["GAS page: Show Card/Achievements icons", function(){ toggleconfig('cardsicon'); }],
        ["Choose icons",function(){
            var temp = prompt("Default: " + defaults['iconsid'] + "\n\n-1 = auto\n0 = Thumbs up/down (unicode)\n1 = Alternative unicode icons\n2 = Thumbs up/down (images)", GM__getValue('iconsid',iconsid));
            if (!!temp.match(/-1|0|1|2/)){ toggleconfig('iconsid',temp); } else { alert("invalid option"); }
        }],
        ["Choose which games to hide (on browser)", function() {
    		let temp = prompt("Default: " + defaults['hidereviews'] + "\n\n0 = None\n1 = Very negative\n2 = Negative and Very negative\n3 = Mixed and below", GM__getValue('hidereviews', hidereviews));
    		if (!!temp.match(/0|1|2|3/)){ toggleconfig('hidereviews', temp); } else { alert("invalid option"); }
    	}],
        ["Choose which games to hide (on SG)", function() {
    		let temp = prompt("Unlike the previous option (\"Choose which games to hide (on browser)\") that will only hide games in the browser, this will add the game to your SG hidden games list (same as clicking on the eye icon on the giveaway).\nThe main benefit of this is that games that were hidden using this method will remain hidden if you use a browser that don't have the script installed.\nThe downside is that games that were hidden will not be unhiden automatically (unlike the previous option) if you change your mind later and reduce this option value.\nPS: This will only work if set to less than or equal to the previous option.\n\nDefault: " + defaults['hidereviewsonsg'] + "\n\n0 = None\n1 = Very negative\n2 = Negative and Very negative\n3 = Mixed and below", GM__getValue('hidereviewsonsg', hidereviewsonsg));
    		if (!!temp.match(/0|1|2|3/)) { toggleconfig('hidereviewsonsg', temp); } else { alert("invalid option"); }
    	}],
		["Hide on browser games that are missing reviews", function() {
			toggleconfig('hidemissingreviews');
		}],
        ["Set time between queries to Steam Store", function(){
            var temp = prompt("Time in milliseconds\n\nDefault: " + defaults['delayscan'] + "\nMinimum: 100 (0,1s)\nMaximum: 15000 (15s)\n\nAnything lower than 100 = off", GM__getValue('delayscan',delayscan));
            if (isNaN(temp)){ alert('Not a number'); return false; } else if (temp!==null){ GM__setValue('delayscan',Math.min(temp,15000)); }
        }],
        ["Force endless scroll observer to run", function() {
          toggleconfig('forceobserver');
        }],
        ["Clear storage", function(){ clearstorage(); alert('Storage cleaned'); }],
        ["Restore default settings", function(){ setdefault(true); alert('Settings restored to defaults'); }]
    ], function(a,b){ GM__registerMenuCommand(b[0],b[1]); }
);

if(loaddata('dbversion') !== false){ clearstorage("Old version."); restoredefault(); }

var isgaspage, isgapage, issearchpage, ishiddenpage;
if (window.location.pathname.match(/^\/giveaways/) || window.location.pathname === "/" || window.location.pathname.length === 0 || window.location.pathname.match(/^\/group\//)) {
	isgaspage = true;
} else {
	isgaspage = false;
}
if (isgaspage) {
	isgapage = false;
	issearchpage = !!document.URL.match(/type=(wishlist|recommended)|q=.+/);
} else {
	isgapage = !!window.location.pathname.match(/^\/giveaway\//);
	issearchpage = false;
}
ishiddenpage = !!document.URL.match(/\/account\/settings\/giveaways\/filters/);

var icons = [["\uD83D\uDC4D","\uD83D\uDC4D","\u25FC","\uD83D\uDC4E","\uD83D\uDC4E"],["\u25B2","\u25B2","\u25AC ","\u25BC","\u25BC"],['','','','','']];
var toscan = [];

if (iconsid !== 2 && (icons[iconsid] === undefined || icons[iconsid].length !== 5)){
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var text = "abcdefghijklmnopqrstuvwxyz0123456789";
  context.font = "72px monospace";
  var baselineSize = context.measureText(text).width;
  context.font = "72px 'Segoe UI Symbol', monospace";
  var newSize = context.measureText(text).width;
  delete canvas;
  if (newSize == baselineSize) {
    iconsid = 2;
    log('Font "Segoe UI Symbol" not found. Using image as fallback.');
  } else {
    iconsid = 0;
  }
}

{
  var styles = [];
  if (iconsid===2){
    styles.push(".rating{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAABNCAYAAAB9s+4QAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEXUlEQVRIie2Xf2iUdRzH35/vPXc772xrt3Ydm8y5yVCzXCr+WJJhhHNF2djUMEUYZGVKsvwjDWT4iyFB9gskIvKfYIcoW8xi4WQkFs1ao/yRguKP6Swnd9vdc7t7nufdP3ptt7vbMwhJ6A3fP57v8319Pz++z+fh80X88ZK5ZhH2mZOhE2DakeP/ibMb/Lin4T0bbhNIEDAzQlAm/c8332MUXZqPgAZAIaMshXD3C1yxtwLZF6Yo1j8DZ7o2TQwCFK6ermYrPYq3Q70EogCscTEZ8mP3h084tv852OoK60Gr3BWQAaMCgGSEaAFu86/kc2Rb1Xxzivf0P1kUEuoGgfPJEaj4iOVzZo3aSD+4uszMx2EqRAgX6X9uv61ouRTa8Mp5a0yn4zodzv7E0+tq7IGdO7X4irItzEGEhQs7Oe+gZgsM7Z3hi5e4viWevEPUu0e+y3hOedvPDcSri4PwOgeA0bELSVuWbVn61yHRdzSWumPhJZaOZmVIUfqt3SeQ99hL0rwxDABKVc08hTA+UQn40wIAYMZmITq4PrkHlQpQJBcimc9C4IfR9ywPHJ4ysZiMwWpcvbB+YpCIG+Hri9lNTUEf7hLyMsi+8UFzPtqOVTje8ZUcdet60Cp0Q3RrQdbYaA3BaZxLFpx+aOd07ddbTVrYqAXghkgYRBcERhLy+joAdXRUlQ51fhzwHu55FXHZCKpceKdvlg+2tYzxcowH9fUqUTVrifP8zfdBAUrnNMi7b/SOXDMmexIMWs638f3wtNw9EMuPvr5GtrSorBAAiDRZoWmR76xJ0oqYVYEgtHEhAHh01adDiYrcY5ZTYsi/M+r39h+vp/sn4ZcI2lxrQcMOWYuLGhTqbCJRJNAM3M/s/Q/dd+hBqqfOTrrntZunqn9MLLNtKZ4PJZZyDUS0jV9cotsWtLxSog8RJ4woqj67YtSATOv+mMlSBz53WejVI1rj4m/M2te66Uldk7bjqmzjew7BLhBhOo32ArH2dCzP+S0Jvdxm7roMtShlq1wFLAAAAnEhLpbnG5tmduzuampqsuSVr3nhPFEmMk76BT0kfijwWWENCg1OE0cMwJcVIioFqNQ0BVXjxR8CXMkKpEitWyo3HYLjJOK2IQBYBBzwAj9PCFoYxbVhwTEyc8dMwiARBRBOnlN9C119XhyJEWnbT6cD3Q5gn/thDDxQ9dTI2d5C89KUVcYa25b0CDSGlKf/jGzd33NjzNedVj37b3jKc3gSDoa8S4y3gPT1NEbrS7kqDwxhEkOTfMaWF5s5eVyIh+jJn8yOuze7YZSYvxTNiI8unWcK+RXA30eMswIOjrgSmiJmf2V1rG7n3fKXp5y8fjKBQGpSUiXKugaq3uJq6xZWB/i6B9QzXjxTxrQ6Ui2bi15XDoZsZemu1Moa9D6Si+PAiA7SjjZP5aJijf223QOAtRtwxu1DO7LfQC0ABi3EkjMtW1k0NZ+nM1nw5PGst4BvFi9n7d/reSPZetpaMQAAAABJRU5ErkJggg==); width:13px;height:13px;display:inline-block;border-width: 0px 4px 0px 0px;border-style:solid;border-color:transparent;vertical-align:text-bottom;background-repeat:no-repeat}\
    .rating1 { background-position: 0 0%; }\
    .rating2 { background-position: 0 25%; }\
    .rating3 { background-position: 0 50%; }\
    .rating4 { background-position: 0 75%; }\
    .rating5 { background-position: 0 100%; }");
  } else {
    styles.push('.rating{font-size:16px;}\
    .rating5::before{color:#0000ff;content:"' + icons[iconsid][0] + '"}\
    .rating4::before{color:#33b4ff;content:"' + icons[iconsid][1] + '"}\
    .rating3::before{color:#ffa300;content:"' + icons[iconsid][2] + '"}\
    .rating2::before{color:#ff6666;content:"' + icons[iconsid][3] + '"}\
    .rating1::before{color:#ff0000;content:"' + icons[iconsid][4] + '"}');
  }
  if (betaTitle || (isgapage && GAfeatures===2)){
    var featuresicons = ['', 'ico_multiPlayer', 'ico_singlePlayer', '', '', '', 'ico_mod_hl2', 'ico_mod_hl', 'ico_vac', 'ico_coop', '', '', '', 'ico_cc', 'ico_commentary', 'ico_stats', 'ico_sdk', 'ico_editor', 'ico_partial_controller', 'ico_sdk', 'ico_multiPlayer', 'ico_dlc', 'ico_achievements', 'ico_cloud', 'ico_coop', 'ico_leaderboards', '', 'ico_multiPlayer', 'ico_controller', 'ico_cards', 'ico_workshop', 'VRIcon', 'ico_turn_notifications', '', '', 'ico_cart', 'ico_multiPlayer', 'ico_multiPlayer', 'ico_coop', 'ico_coop', 'ico_collectibles', 'ico_remote_play', 'ico_remote_play', 'ico_remote_play', 'ico_remote_play', '', '', '', '', '', '', '', 'ico_vr_input_motion', '', '', '', '', '', '', '', '', '', 'ico_familysharing'];
    styles.push(".category{background-image: url(data:image/png;base64,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);width:21px;height:13px;display:inline-block;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.35);vertical-align:text-bottom;background-repeat:no-repeat; }\
    .vricon { background-position: 0 0%; }\
    .ico-achievements { background-position: 0 4.761905%; }\
    .ico-cards { background-position: 0 9.52381%; }\
    .ico-cart { background-position: 0 14.285714%; }\
    .ico-cc { background-position: 0 19.047619%; }\
    .ico-cloud { background-position: 0 23.809524%; }\
    .ico-commentary { background-position: 0 28.571429%; }\
    .ico-controller { background-position: 0 33.333333%; }\
    .ico-coop { background-position: 0 38.095238%; }\
    .ico-dlc { background-position: 0 42.857143%; }\
    .ico-editor { background-position: 0 47.619048%; }\
    .ico-leaderboards { background-position: 0 52.380952%; }\
    .ico-mod-hl { background-position: 0 57.142857%; }\
    .ico-mod-hl2 { background-position: 0 61.904762%; }\
    .ico-multiplayer { background-position: 0 66.666667%; }\
    .ico-partial-controller { background-position: 0 71.428571%; }\
    .ico-sdk { background-position: 0 76.190476%; }\
    .ico-singleplayer { background-position: 0 80.952381%; }\
    .ico-stats { background-position: 0 85.714286%; }\
    .ico-turn-notifications { background-position: 0 90.47619%; }\
    .ico-vac { background-position: 0 95.238095%; }\
    .ico-workshop { background-position: 0 100%; }\
    .ico-turn-notifications { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABmElEQVQ4T32TyytFURTG70Ehr0zkkUeUYmCIiKkoKQMTzEyRKSZMkcTgKjMDxNAfII8JBpRSypsJbqIbkRy/77Z3Hdt1dv1at72+/e111trXiyRZvu97bIvg8l2p53l/9qRxD0YwzGG/GvIDJtLdwhukgMy09wExzD+DF/4yxTCVZANUGZHNK54ao3ZiCRzCPjzCfbBq1zQDQRvkmmq+iEK6C+iFQUiDBxiFbbjEVLrEck0zA6bv/D6AmNFmEzegyR4mLsIsnIeZqtJWUF+fVYUVm16vm0vlq77OQBSuw0xlNgwFEsI8aGBFHDrCuI/fC5AHJzAA6nWc/Lf9AvfzC0nsQSXcQQ9Io08chxYYAbVCly7BMtyEDUqmu2CnL+M46IldwRZ0gHRaekpTMBl8Vm6lWQhWoNMccoMu1OC6QIOU6av0mB5bcbLH30hyDGqNKJ1YDKpag+qGCtAg1c966Md09V9TJRiIKtbQ1Pw6mINpqIEhs/9CXINmmMB0M9TUJs0F5UT1dAdKoczk9djPQH+EJ0zVjsT6Ab3FhA7+FZ2oAAAAAElFTkSuQmCC) !important; }\
    .ico-remote-play { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABVUlEQVQ4T52UP0sDMRyGGytq6dDdVfwzuTi4tPQziIiLq+BWRQTBRZBSaR2kkx9ABFdBEBRcBD+ADmqhW6du2lIrrefzQk6uZ649DDyE5t4++SWXnEk4mud5EwynYcz13I5907eNMV/hjAkPIJxn7ADUj2qvBIqI1f+2ASlCVXYKWTiH/hBrkmcb8AAFxJ6fDUuneHABb4T2R5VJERUyc7BO/jNKqtmX4YPQUwxpmcyClXaipFr+EqTgBZrBZYUnodJYUlW6CnnIwD1cIm65qo4r1R5Pg46LpFvQhpJLHFc6jmATcnAD16DjpRd39q/l60/MPkk3AzvwCDoyh7CHuBEUkz3h9yxEv30rXaHvgV7UkWRQgDuoSQDaJu3/GtzC7rBzqvC2raaqMFzBIrxbjul1SnTYn6GCsB5cgeuaal8TBHssT5dBVfvfAN0wbY/fuuT+3Lof2KuDDqHlsXAAAAAASUVORK5CYII=) !important; }\
    .ico-collectibles { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABfElEQVQ4T43TPyiEcRzHcQ/piHILroj8KcVkEOoigyyyHSUUBlE2KYtMFjfZTCd1BjYxYLK4y6VMUkQGIgvDFcLj/alf4nG/e+5Xr37Pn+/zue/9fs/j5GUZruuWcbsTjQjgDVdIOI7zYnvUsd0gsJ57/bjDORSiH2lGFXYJvs70fMZQAkMUj2MP7wgSkOR6B8fP+MAANrn+4A22hQ5TWIBD02Ehcxql+EIJmlBNaNw3lG6CFI0gxgNpzhXYihZs4RM9OEUEcerU/c/416lZyzAVxyjGBUYxiyWkCLmnTl1PYofzG7/QOgq6sI8AD9wSsMDxsrHCrKWowQxWVeMXqh0eQwz663qlFtFuup9nzscZJrDufb1sGzVE8SNOMIg5NEDv6DSS0BJVEKh1/jNsoeWm2wPmS7QhasK1QfoYerFB6FOuoX0moJJZL34RtAwJvEIfgP5JlFCtffZO2ZRaKrZNd95673mKC5FcNqqbwiloM/yGPoQ1Qo9+F34DgLx7Dh9A1WoAAAAASUVORK5CYII=) !important; }\
    .ico-vr-input-motion { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABL0lEQVQ4T5XTP0tCURiAcY9m0iAOokO7FDk6tLk6tNjWoJ8iaA5zaBJBCbcaBKdcHAQHywYdHPwEFqFL0NQgCuXpeeEml9u9eq7wA/We8/jeP6qAj5fWOsTyYyQxw1QppZ0JZdokuMfaItJY4gADdJxhP9FzAjn84BTPkMmrRN/twxlFmfKETU30kMcRhnhBm+jYV5RgjA0NXOARb8jiCRFUiMr13by2TkowyMorlBDGCnIdXyHXWKbs2oPyflf0jDX3SNg2fksMtwQnzuDWKFOmWNBCxrZRbkgFDwS/3IKeUYJRDt6hYG2U6eQmlYmNvGJ/3/87fesBv2TBDfbxgToaBD93BV0nJSqPSx+HkJtSls8E1yZBr2icA9dYoEZsbhrzPH05YD1K2u1/bfIDv5cQWg6Lqn/uAAAAAElFTkSuQmCC) !important; }\
    .ico-vr { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABmklEQVQ4T7WTSytFURiGz3Ypl1ySgUsMhMhlJJkpf0H+gM6ADBTHP5AJAwMDUgaKTM6IqYHB4ZShlAxcBpLckghhe15961g2Z6Ksevq+vS7vete31g5i/9CCbJphGGqsCPIhB9zckPwNnoIgeP5t/TdRhAqY1A3tUA0NUA6FkAsSfIUHuIBjOIM0Gxy6DaKi/QxMQZU5zLOJmidBRZfL7adj2IYhhLVB5kgxXEpgFgbNlcZT5vaaqBJcwS50QB9ojTaR62FEN6KicrcMveZKx02Cjntu/VvEYjiAOLTYXLmdRHQ6KtpKx5o3Uc6OYMGExonzsAd1oO8yE1UZliChy8vUlON3magWqH5qcjkCbTAGKk8pnJqoXodr6yRxRO98UdVpFZo9UbndgUrrV43rYR86QSWTgXdYgVFEH33REjrnYAB0Ac6thLVIlyVnQuvUp6ZcFziBoIS/bl8flKCHkDBXFUS9T7U0LEIj6HXUwAu497pJPoPo7Q9RE1bNag09fDlN6Q2yqXLVvgnu4QZO4NL/u7L+pubwT+ED2st6DulRclUAAAAASUVORK5CYII=) !important; }\
    .ico-familysharing { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAABiElEQVQ4T42TMShFURjHPQwUYZVBFrIhYrULUVIiAwODQinEey/PIGGhlAGlDETYZBaSLG8wCIOZiDfg+v31Xd2e+9x36tc593z/87/fOd85oYwUzXGcTEIh2meyhFgWcw6xL7/lIb9JFpUyPwyFsMziM1dHrJ7xADzBArG7ZI9UptMIwybepe9icQLDXMZb0GqxMPORdE1lKGO1feg00xzG29BssQjz7s9/vVNlWoZiBIq0fTiFfHiBBhgEbX8e09t0M81GWAFvcG8mHfQHsAgloKxvMP0INOXc8hCNQQ+swjqcQDk8QCPoB/2wCXMYv3qN/2wf03YTqygbMAoroHM8hj6IQS+8QzemO0GmquaUia7om0B3tRqubf6QvsrGUUzdov5M+WWqLMZBRRmCI8uykj4OOlf9aAl0VLOYTgRlOoNAoj3bqrJWtfWKlLFuQxTWoAVimE4GmdYiqIFzSIAufzHoSerpPkIbqPp1cInpxb+m3iBFK+Bb29YVc5uuUByjZ6/WO/4GCH99DnBs1CIAAAAASUVORK5CYII=) !important; }\
    .sidebar{max-width:336px; }\
    .steamdb{width:13px;height:13px;display:inline-block;border-width: 0px 4px 0px 0px;border-style:solid;border-color:transparent;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAACPUlEQVQokW2GPUwUQRhAP3svs3MzO7s7sz8zs5u9meXCzhH2qCTGQqM2FFirITEUWkGsJITSwprCTmMJCTQ2Bm0tJBDQQmiMP/wUWkCiF4jYQOdLXt4DAIC6rsXo6OjDpmle9/v9b03T/Gma5u/Y2NjPpmk+9Pv9F03TPKjrWgAAQLfbvV3X9fter3fS6/XOLnTOvRsZGXnsnLvjnLvnnJt3zr3qdrvXwVq7VFXVnjHmt7X2zFo7qKpqdWhoyHU6nWta67Qsy7osywljzFtr7RcQQpRKqX5RFDe01vfzPL8rpRzzPM9LkmQ8y7JnUsplKeWGlPJUa/0V4ji+KoRYjaLoOWNswvf98SAIHkVRtMw5/8U5P7swTdMfQohJqKpqwVr7MQzDBULIS0LIm3a7vUUIOSCEfD//pSiKnhhjtqqqmoeiKI7zPN9TStUAcKnValGEkG61Wh2EkEIIYQAApVSd5/leURTHkCTJihDiVAixzjmfopR2EELY9/3LCCFMCDGc8ykhxLoQ4jRJkhUoy/KW1nqHMbbr+/4RpXSfEPKJUrp+3n3f948YY7ta689lWd4EY8y2tXYnjuNhz/PGEULTnuctIISenncaY3wljuNha+2OMWYblFIHUspBlmVzaZpi+A9pmuIsy+aklAOl1AGEYTjJOd+IomgQBMEmY2yRMTZLKZ1mjM0yxhaDINiMomjAOd8Iw3ASAAAQQopSOkMIWcMYH2KMT9rt9hnG+ARjfEgIWaOUziCEFADAP5tvlu/HIunFAAAAAElFTkSuQmCC');background-size:100% 100%;background-repeat:no-repeat;vertical-align:middle;}");
  }
  if (GASmeta || isgapage){ styles.push(".meta{width:13px;height:13px;display:inline-block;border-width: 0px 4px 0px 0px;border-style:solid;border-color:transparent;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAACM0lEQVQokWWSSUgUAABFvzNZJo7lNi641KQmuaPOwIhMmZFegkCtBOkUVFKdQlOYAjEybFMrMYk0i5DSiCCCNpeoUDQp1zEPQVBYanapceJ1kErqnf/jX560DMa0eaHPcP1Vu9/4/Yumj72tPhNzfYZ2RpSrf+GEDD+HdO6MMwxLahoKykABNnwtWwiNS6C2MhTPoBrokPGPtDiks3tLLcjfjgIyCUzYypPnA8zOf6Pi5BW0MoNdRTF4Xqtx6WVEOeecoUtCaCZSNM66ZobeTnD3YTcAl9s6kU8W1UeDYUS5+vrccDMyNQ0FZrF6fTZHKmoZmZxm6+4y5BVD9YWrALR3PSHels3nbt3Wi3Y/l8xWtCqe5htd/OZh90t8I61oZSzlNY243Ytk7yzjQZP3O9275D9jDLFTvL+KN+NTxOcUcvDYaQCevhgkKM6B1iYRl1OIAmzcqV87o8ct3lMbHSUAzM4vYE7NR4qm9JATgOExF37r7CggBYXY6G41TWu+x3AreGMixfucuBc9DI+6iErLR14xFB+o4viZZlaEZ6EQK+bEdOaeGTvFmBx1lWFIyRSUHOb7DzfT7z+QkVeCTJtQYAqKsCKTnZPl4TCqPEmS560aSvZsQEomq2AfX+YWqKm/htYkIbMNmewUFcbinlLT3yI6ZPT0q/FUZQRmSwLhaTtQhAMFW4lKTKemIgJPv5oYkPf/OY1q23yP4dajllWTd877f+ppM7nmeo0djGn78t0vVQ8+T/mifr8AAAAASUVORK5CYII=');background-size:100% 100%;background-repeat:no-repeat;vertical-align:middle;}"); }
  if (isgaspage){ styles.push(".review > a{max-width:105px;text-overflow:ellipsis;overflow: hidden;display:inline-block;} .review{max-height:26px;} .review > *{vertical-align:middle;} .review > img{margin-left:4px;}"); }
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = styles.join('');
  document.getElementsByTagName('head')[0].appendChild(style);
}

function cleanrating(rating, mode = false){
  if (rating.indexOf('%') !== -1){
    rating = rating.match(/%?([0-9,]+)(\s{0,1}%)?/g);
    ratinginvord = (rating[0].indexOf('%')!==-1) ? false : true;
    if (!mode){
        rating = rating[ratinginvord?1:0] + ' (' + rating[ratinginvord?0:1] + ')';
    } else {
        rating = Array((rating[ratinginvord?1:0].replace('%','')/100), Number(rating[ratinginvord?0:1].replace(/,/g,'')));
    }
  }
  return rating;
}

function geticon(rating){
  if (rating.indexOf('%') === -1){ return ""; }
  e = rating.match(/[0-9,]+/g);
  if (e.length !== 2){ return "";
  } else {
    imagetest = e[0];
    imagetest2 = e[1].replace(/,/g,'');
    if (imagetest>84 && imagetest2>=100){ var image = 5;
    } else if (imagetest>69){ var image = 4;
    } else if (imagetest>39){ var image = 3;
    } else if (imagetest>24 || imagetest2<=100){ var image = 2;
    } else { var image = 1; }
  }
  return '<span class="rating rating' + image + '" ></span>';
}

function processpage(req, hlink, change, gaid, steamstore){
  steamstore = !!steamstore ? " [Steam Store]" : "";
  ratingtest = $('div.glance_ctn_responsive_left:first div[data-tooltip-html], #game_highlights #userReviews .user_reviews_summary_row[data-tooltip-html]', req);
  ratingtest2 = $('.game_area_comingsoon:first div:first h1:first', req);
  ratingtest3 = $('.noReviewsYetTitle:first', req);
  if (req.title.indexOf('Site Error') === -1 && (!!steamstore || (!!ratingtest.length || !!ratingtest2.length || !!ratingtest3.length))){
    code = hlink.match(/[0-9]{2,6}/)[0];
    rating2 = "";
    if (!!ratingtest.length){
      rating = ratingtest[ratingtest.length === 2 ? 1 : 0].getAttribute("data-tooltip-html");
      if (ratingtest.length === 2){ rating2 = ratingtest[0].getAttribute("data-tooltip-html"); }
    } else {
      rating = ratingtest2.text()||ratingtest3.text()||"No ratings available";
    }
    meta = $('#game_area_metascore div', req);
    meta = (meta.length === 5 ? [meta[0].textContent.replace(/\s/g,""), $('#game_area_metalink a:first', meta)[0].href.split('/pc/')[1]] : "");
    saved = loaddata(code,false);
    features = $('#category_block > .game_area_features_list_ctn > a.game_area_details_specs_ctn, #category_block > div.DRM_notice div:first, #category_block > div.DRM_notice:not(:has(*)), #category_block > div.DRM_notice:has(br)', req).map(function() { return ((this.href && this.href.indexOf("vrsupport")===-1)?this.href.match(/=([0-9]+)\&/)[1]:'0') + '::' + (this.innerHTML.indexOf("<br>") === -1 ? this.textContent : this.innerHTML.split("<br>")[0]).replace(/^\s{2,}/,'').replace(/\s{2,}/g,' '); }).get().join('\n');
	let test;
	if (features.indexOf('22::') === -1 && (test = req.querySelector('#category_block ~ #achievement_block .block_title'))){
		features += "\n22::" + test.innerText.trim();
	}
    genre = $('.blockbg:first a[href*="//store.steampowered.com/genre/"]', req);
    tags = (genre.length > 0 ? genre[0].href.match(/genre\/(.+)\//)[1] + ':[' + genre[0].innerText + ']\n' : '') + $('a.app_tag', req).slice(0,5).map(function() { return (this.href!==undefined?this.href.match(/\/tags\/([a-z\-]+)/)[1]:'0') + ':' + this.textContent.replace(/\s{2,}/g,''); }).get().join('\n');
    date = $('div.release_date > div.date', req);
    date = (date.length > 0 ? date[0].innerText : '');
    savedata(code,{version: dbversion, rate: rating, rate2: rating2, meta: meta, time: (rating.indexOf("%")!==-1 ? (Number(cleanrating(rating).match(/[0-9,]+/g)[1].replace(/,/g,''))>=1000 ? parseInt(Date.now()/1000)+parseInt(expiretime*Math.min((Number(cleanrating(rating).match(/[0-9,]+/g)[1].replace(/,/g,'')/1000)-1),1)) : parseInt(Date.now()/1000)) : parseInt(Date.now()/1000)-expiretime+86400), features: features, tags: tags, rdate: date});
    if (!saved){
      dup = "";
    } else {
      dup = " (dup)";
    }
    if (!!ratingtest.length){
      log("Loaded ratings for " + hlink + dup + steamstore);
    } else if (!!ratingtest2.length){
      log("No ratings available YET for " + hlink + dup + steamstore);
    } else {
      log("No ratings available for " + hlink + steamstore);
    }
    getrating(hlink, change, gaid);
  } else if(!steamstore){
    steamstorerequest(hlink, change, gaid);
  }
}

function steamstorerequest(hlink, change, gaid){
  GM__xmlhttpRequest({
    method:  'GET',
    url:     hlink,
    headers: { 'Cookie': 'birthtime=0; mature_content=1' },
    onload:  function(req) {
      var req = new DOMParser().parseFromString(req.response, 'text/html');
      processpage(req, hlink, change, gaid, true);
    },
  });
}

function getreviewlink(id,saved){
  var dlc = saved.features.indexOf('21:');
  if(dlc !== -1){
    return 'http://store.steampowered.com/app/' + id + '/#responsive_apppage_reviewblock_ctn';
  } else {
    return 'https://steamcommunity.com/app/' + id + '/reviews/?browsefilter=toprated';
  }
}

function steamdb(rating){
    var steamdbr = cleanrating(rating, true);
    return ((steamdbr[0] - ( steamdbr[0] - 0.5 ) * Math.pow( 2, -Math.log10( steamdbr[1] + 1 ) ))*100).toFixed(2);
}

function getrating(hlink, change, gaid, toscanarray, delayed){
  var delayed = delayed||false;
  var toscanarray = toscanarray||[];
  var code = hlink.match(/[0-9]{2,6}/)[0];
  var saved = loaddata(code,false);
  if (delayscan>=100 && !delayed && toscanarray.indexOf(code)>0 && (!saved || (expiretimeenabled && parseInt(Date.now()/1000)-expiretime >= saved.time))){
      setTimeout(function(){ getrating(hlink, change, gaid, toscanarray, true); }, delayscan*toscanarray.indexOf(code));
      return false;
  }
  if(!!saved){
    if (expiretimeenabled && parseInt(Date.now()/1000)-expiretime >= saved.time){
      log("Cache expired [ " + hlink + " ]");
      GM__deleteValue(code);
      getrating(hlink, change, gaid);
    } else if (saved.version !== dbversion){
      log("Different dbversion on cache [ " + hlink + " ]");
      GM__deleteValue(code);
      getrating(hlink, change, gaid);
    } else {
      rating = saved.rate;
      rating2 = saved.rate2;
      meta = saved.meta;
      if (isgapage){
        sidebarwide = $(document.getElementsByClassName('sidebar')[0]);
        if (GAratings){
            sidebarwide.append(
                '<h3 class="sidebar__heading">Steam Reviews</h3><ul class="sidebar__navigation"><li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" href=' + getreviewlink(code,saved) + ' rel="nofollow" target="_blank">' + geticon(cleanrating(rating)) + '<span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">' + rating + '</span></a></li>' +
                ( rating2 !== "" ? '<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" href=' + getreviewlink(code,saved) + ' rel="nofollow" target="_blank">' + geticon(cleanrating(rating2)) + '<span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">' + rating2 + '</span></a></li>' : '') +
                ( rating.indexOf('%') !== -1 ? '<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" href="https://steamdb.info/app/' + code + '/" rel="nofollow" target="_blank"><span class="steamdb"></span><div class="sidebar__navigation__item__name">SteamDB Formula</div><div class="sidebar__navigation__item__underline"></div><div class="sidebar__navigation__item__count">' + steamdb(rating) + '%</div></a></li>' : '') +
                ( meta !== "" ? '<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" href="http://www.metacritic.com/game/pc/' + meta[1] + '" rel="nofollow" target="_blank"><span class="meta"></span><div class="sidebar__navigation__item__name">metacritic</div><div class="sidebar__navigation__item__underline"></div><div class="sidebar__navigation__item__count">' + meta[0] + '/100</div></a></li>' : '') + '</ul>'
            );
        }
        if(!!saved.rdate){
            sidebarwide.append('<h3 class="sidebar__heading">Steam Release Date</h3><ul class="sidebar__navigation"></ul>');
            $('ul:last', sidebarwide).append('<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link"><div class="sidebar__navigation__item__name">'+ saved.rdate + '</div></a></li>');
        }
        if (!!GAfeatures && !!saved.features){
          if(GAfeatures === 2){
            sidebarwide.append('<h3 class="sidebar__heading">Steam Features</h3><ul class="sidebar__navigation"></ul>');
            var a = saved.features.split('\n');
            for (var i=0; i<a.length; i++){
              featuresid = a[i].split('::')[0];
              var img = (featuresid!=='0'&&!isNaN(featuresid)&&featuresid<=featuresicons.length?'<img class="category ' + featuresicons[featuresid].replace(/_/g,'-').toLowerCase() + '"></img> ':'');
              var link = (featuresid!=='0'&&!isNaN(featuresid)?' href="http://store.steampowered.com/search/?category2=' + featuresid + '&category1=' + featuresid +'&category3=' +  featuresid +'"':'');
              $('ul:last', sidebarwide).append('<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link"' + link + '><div class="sidebar__navigation__item__name">' + img + a[i].split('::')[1] + '</div></a></li>');
            }
          } else if(GAfeatures === 1){
            change.parentElement.title = saved.features.replace(/\b[0-9]+:/g,'');
          }
        }
        if(!!GAtags && !!saved.tags){
          if(GAtags === 2){
            sidebarwide.append('<h3 class="sidebar__heading">Steam Genre/Tags</h3><ul class="sidebar__navigation"></ul>');
            var a = saved.tags.split('\n');
            for (var i=0; i<a.length; i++){
              $('ul:last', sidebarwide).append('<li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" href="' + (a[i].indexOf('[')===-1?'http://store.steampowered.com/tags/' + a[i].split(':')[0] + '/' + a[i].split(':')[1]:'http://store.steampowered.com/genre/'+a[i].split(':')[0]) + '/" rel="nofollow" target="_blank"><div class="sidebar__navigation__item__name">'+ a[i].split(':')[1] + '</div></a></li>');
            }
          } else if (GAtags === 1){
            change.parentElement.title += (!!change.parentElement.title?'\n\n':'') + saved.tags.replace(/\b.+:/g,'');
          }
        }
        var title = change.parentElement.title;
        if(!!title){
          $(document.getElementsByClassName('sidebar__heading')).filter(':contains("Steam")').attr('title', title).next('ul').attr('title', title);
        }
      } else if (ishiddenpage){
		if (GASmeta && meta !== ""){
			change.getElementsByClassName('table__column--width-fill')[0].outerHTML += '<div><a href="http://www.metacritic.com/game/pc/' + meta[1] + '" rel="nofollow" target="_blank"><span class="meta"></span><span>' + meta[0] + '/100</div></a></div>';
		}
		rating = cleanrating(rating);
		if (usesteamdb && rating.indexOf('%') !== -1) {
			rating = Math.round(steamdb(rating)) + "%" + rating.split('%')[1];
		}
		const image = geticon(rating);
		if (GASratings) {
			if (rating.indexOf('%') !== -1) {
				change.getElementsByClassName('table__column--width-fill')[0].outerHTML += '<div class="review table__column--width-small text-center"><a href=' + getreviewlink(code, saved) + ' rel="nofollow" target="_blank">' + image + rating + '</a></div>';
			}
		}
		if (change.getElementsByClassName("review").length){
			if (cardsicon) {
				if (saved.features.indexOf('22::') !== -1) {
					change.getElementsByClassName("review")[0].appendChild($(document.createElement("img")).attr("src", 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABu0lEQVQokXXRv07cMBwHcA8MzAytkK6J7Ti5l4Cl0z0A4hF4g1PXtA/QqVKvkIuT859yiUJCEx9JjsK1YmBpeQEGpPZGYAzt4g7hQED5Sd/B0vcjWz8DcDsihCqWuFGpfVkp50HKL6RJd7ECj2fMUJAnRNfK0bVy9OGkzfT2PMlIeFdmPop5AKtIoJ8H+/YdOK4cPau7+utBi6rCPtsb41oGUALmoxvuw7eRtF5XeYuOSkd/m3b198OuPq7a20pl9dIYvZMhugacwjNOoWDMXK1y0jxGs7qrp8r5m+fYSCMsRAB/gHCI+oLC+Wj08sUkI+eL583qFhyVjq4L56JMzNVk1/otKeoD731nRVA4lwHaTGOc1IX9ZBFVYe+plGyOOZp7XmcFAAAA940NTuFpxJCXJ0Qv4CIqsz7GEp/y0Nh4sHJGYU+EUEUc/8liS6vM1pN9W+cJuYklLhiFvSf/dI9frX9m6CISWMcC/4pGeO3ZMgAAUBcuM69DGEV9GSItQviGeR1CKVx+FvmfjC3mI80p0iK4D/PR1n+B64Kl7Q/GyXBgNnRgXtEd8zLcMa/ottkMB+aJ64KlRfcfo1Uk5m/dfLwAAAAASUVORK5CYII=')[0]);
				}
				if (saved.features.indexOf('29::') !== -1) {
					change.getElementsByClassName("review")[0].appendChild($(document.createElement("img")).attr("src", 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAANCAYAAAB7AEQGAAAAvUlEQVQYlY2RoQqEUBRE54rFJgiCNsUkWAWrYDCYxK+yiJ9gNthN20z7Jy+t8NJjNuyyIIvuhmlnuHdmkGXZDYA6UxRFGwDsAHihHW/HFaS+oDRNadv2OSQinKaJruseIRFRlmURAIuioNaaXdd9TCKi4DiO6vueTdNwGAaS5LIsrKqK4zjS9/3XOc/zOM8zjTHUWtMYw3VdGQTB8ac8z9m2LZMkYV3XLMvyPN1fFZxBvxp/II7j7Wq7MAzvT16bl3xgIisEAAAAAElFTkSuQmCC')[0]);
				}
			}
			if (!!saved.features || !!saved.tags || !!saved.rdate) {
				if (betaTitle) {
					change.getElementsByClassName("review")[0].onmouseenter = function() {
						betaTitleIn(this, saved.features, saved.tags, saved.rdate)
					};
					change.getElementsByClassName("review")[0].onmouseleave = function() {
						betaTitleOut(this)
					};
				} else if (GASfeatures) {
					change.parentElement.title = [(!!saved.rdate ? "Release: " + saved.rdate : ''), saved.features.replace(/\b[0-9]+::/g, ''), (GAStags ? saved.tags.replace(/\b.+:/g, '') : '')].filter(String).join("\n\n");
				}
			}
		}
	  } else {
        if (gaid===0 && run === 0 && !!document.getElementById('ui-id-1')){ run++; getfeaturedga(); }
        if (GASmeta && meta !== "" && (!sgplusgrid || change.parentElement.parentElement.className.indexOf('pinned-giveaways__inner-wrap') !== -1)){
          change.getElementsByClassName('giveaway__columns')[0].children[0].outerHTML += '<div><a href="http://www.metacritic.com/game/pc/' + meta[1] + '" rel="nofollow" target="_blank"><span class="meta"></span><span>' + meta[0] + '/100</div></a></div>';
        }
        rating = cleanrating(rating);
        if(usesteamdb && rating.indexOf('%') !== -1){
            rating = Math.round(steamdb(rating)) + "%" + rating.split('%')[1];
        }
        image = geticon(rating);
        if (GASratings){
          if (!sgplusgrid || change.parentElement.parentElement.className.indexOf('pinned-giveaways__inner-wrap') !== -1){
            change.getElementsByClassName('giveaway__columns')[0].children[0].outerHTML += '<div class="review"><a href=' + getreviewlink(code,saved) + ' rel="nofollow" target="_blank">' + image + rating + '</a></div>';
          } else if (rating.indexOf('%') !== -1){
            if(change.className === "giveaway__row-inner-wrap"){
              change.getElementsByClassName('fa fa-clock-o')[0].outerHTML = image + rating.split(' ')[0] + ' ' + change.getElementsByClassName('fa fa-clock-o')[0].outerHTML;
            } else {
              change.parentElement.getElementsByClassName('fa fa-clock-o')[0].outerHTML = image + rating.split(' ')[0] + ' ' + change.parentElement.getElementsByClassName('fa fa-clock-o')[0].outerHTML;
            }
          }
        }

        if (cardsicon){
            if (saved.features.indexOf('22::') !== -1){ change.getElementsByClassName("review")[0].appendChild($(document.createElement("img")).attr("src", 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABu0lEQVQokXXRv07cMBwHcA8MzAytkK6J7Ti5l4Cl0z0A4hF4g1PXtA/QqVKvkIuT859yiUJCEx9JjsK1YmBpeQEGpPZGYAzt4g7hQED5Sd/B0vcjWz8DcDsihCqWuFGpfVkp50HKL6RJd7ECj2fMUJAnRNfK0bVy9OGkzfT2PMlIeFdmPop5AKtIoJ8H+/YdOK4cPau7+utBi6rCPtsb41oGUALmoxvuw7eRtF5XeYuOSkd/m3b198OuPq7a20pl9dIYvZMhugacwjNOoWDMXK1y0jxGs7qrp8r5m+fYSCMsRAB/gHCI+oLC+Wj08sUkI+eL583qFhyVjq4L56JMzNVk1/otKeoD731nRVA4lwHaTGOc1IX9ZBFVYe+plGyOOZp7XmcFAAAA940NTuFpxJCXJ0Qv4CIqsz7GEp/y0Nh4sHJGYU+EUEUc/8liS6vM1pN9W+cJuYklLhiFvSf/dI9frX9m6CISWMcC/4pGeO3ZMgAAUBcuM69DGEV9GSItQviGeR1CKVx+FvmfjC3mI80p0iK4D/PR1n+B64Kl7Q/GyXBgNnRgXtEd8zLcMa/ottkMB+aJ64KlRfcfo1Uk5m/dfLwAAAAASUVORK5CYII=')[0]); }
            if (saved.features.indexOf('29::') !== -1){ change.getElementsByClassName("review")[0].appendChild($(document.createElement("img")).attr("src", 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAANCAYAAAB7AEQGAAAAvUlEQVQYlY2RoQqEUBRE54rFJgiCNsUkWAWrYDCYxK+yiJ9gNthN20z7Jy+t8NJjNuyyIIvuhmlnuHdmkGXZDYA6UxRFGwDsAHihHW/HFaS+oDRNadv2OSQinKaJruseIRFRlmURAIuioNaaXdd9TCKi4DiO6vueTdNwGAaS5LIsrKqK4zjS9/3XOc/zOM8zjTHUWtMYw3VdGQTB8ac8z9m2LZMkYV3XLMvyPN1fFZxBvxp/II7j7Wq7MAzvT16bl3xgIisEAAAAAElFTkSuQmCC')[0]); }
        }

        if (!!saved.features || !!saved.tags || !!saved.rdate){
            if (betaTitle){
                change.getElementsByClassName("review")[0].onmouseenter = function(){ betaTitleIn(this,saved.features,saved.tags,saved.rdate) };
                change.getElementsByClassName("review")[0].onmouseleave = function(){ betaTitleOut(this) };
            } else if (GASfeatures){
                change.parentElement.title = [(!!saved.rdate ? "Release: " + saved.rdate : ''), saved.features.replace(/\b[0-9]+::/g,''), (GAStags ? saved.tags.replace(/\b.+:/g,''):'')].filter(String).join("\n\n");
            }
        }
        if((hidemissingreviews && image === "") || (hidereviews>0 && !issearchpage && change.className === "giveaway__row-inner-wrap" && image !== "" && image.match(/[0-9]/)[0] <= hidereviews)){
            if (hidereviewsonsg > 0 && image.match(/[0-9]/)[0] <= hidereviewsonsg) {
                let xsrf_el = document.querySelector("[name=xsrf_token]");
                if (xsrf_el !== null && xsrf_el.getAttribute("value") !== null){
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", '/ajax.php', true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function() {
                        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                            log("Hidden Game on SG [" + $('.giveaway__heading__name:first', change).text() + " ( " + $('.giveaway__heading__name:first', change)[0].href + " )]");
                        }
                    }
                    xhr.send("xsrf_token=" + xsrf_el.getAttribute("value") + "&game_id=" + change.parentElement.getAttribute("data-game-id") + "&do=hide_giveaways_by_game_id");
                }
            }
            change.parentElement.style.display = "none";
        }
      }
    }
  } else {
      steamstorerequest(hlink, change, gaid);
  }
}

function getfeaturedga(){
  if (GASratings || GASfeatures){
    var code = false;
    var test1 = document.getElementsByClassName('featured__inner-wrap')[0].getElementsByTagName('img');
    if (!!test1.length && test1[0].src.indexOf('/apps/') !== -1){
      var code = test1[0].src.match(/[0-9]{2,6}/)[0];
    } else {
      var test2 = $(document.getElementsByClassName('giveaway__heading__name')).filter('[href$="'+document.getElementsByClassName('featured__inner-wrap')[0].getElementsByTagName('a')[0].href.replace(/.*\/giveaway\/.{5}/,'')+'"]:first');
      if (!!test2.length){
        var test2b = $(test2[0].parentElement.getElementsByClassName('giveaway__icon')).filter('[href*="/app/"]:first');
        if (!!test2b.length){
            var code = test2b[0].href.match(/[0-9]{2,6}/)[0];
        }
      }
    }
    if (!!code){
      var saved = loaddata(code,false);
      if (!!saved){
        if (GASmeta){
          var meta = saved.meta;
          if(meta !== ""){
            document.getElementsByClassName('featured__column')[0].outerHTML += '<div class="featured__column text-left"><a href="http://www.metacritic.com/game/pc/' + meta[1] + '" rel="nofollow" target="_blank"><span class="meta"></span><span>' + meta[0] + '/100</div></a></div>';
          }
        }
        if (GASratings){
          var rating = cleanrating(saved.rate);
          var image = geticon(rating);
          document.getElementsByClassName('featured__column')[0].outerHTML += '<div class="featured__column text-left"><a href=' + getreviewlink(code,saved) + ' rel="nofollow" target="_blank">' + image + rating + '</a></div>';
        }
        if (GASfeatures && (saved.features || !!saved.tags)){
          document.getElementsByClassName('featured__inner-wrap')[0].title = saved.features.replace(/\b[0-9]+::/g,'') + (GAStags?(!!saved.features ? '\n\n':'')+saved.tags.replace(/\b.+:/g,''):'');
        }
      }
    }
  }
}

function scangas(element){
  a = $('a.giveaway__icon[href*="/app/"]', 'div.pinned-giveaways__inner-wrap').length;
  if (timer){ console.time('SG Ratings pageLoad'); }
  var list = GM__listValues();
  var total = [];
  if (delayscan>=100){
      for (var i=0; i<element.length; i++){
          var code = element[i].href.match(/[0-9]{2,6}/)[0];
          var scan = (list.indexOf(code) !== -1);
          var expired = (!loaddata(code,false)||(expiretimeenabled && !!loaddata(code,false) && parseInt(Date.now()/1000)-expiretime >= loaddata(code).time));
          if (expired && total.indexOf(code)===-1){ total.push(code); }
      }
  }
  for (var i=0; i<element.length; i++){
    var code = element[i].href.match(/[0-9]{2,6}/)[0];
    var scan = (list.indexOf(code) !== -1);
    var expired = (expiretimeenabled && !!loaddata(code,false) && parseInt(Date.now()/1000)-expiretime >= loaddata(code).time);
    if (scan && toscan.indexOf(code)===-1){
      if (expired){ toscan.push(code); }
      getrating(element[i].href, element[i].parentElement.parentElement.parentElement,i-a,total);
    } else if(toscan.indexOf(code)===-1 && !expired){
      toscan.push(code);
      getrating(element[i].href, element[i].parentElement.parentElement.parentElement,i-a,total);
    } else {
      (function myLoop (i,element,code) {
        setTimeout(function () {
          if (!!GM__getValue(code,false)){
            log('Avoided (Dup) for ' + element.href);
            getrating(element.href, element.parentElement.parentElement.parentElement,10,total);
            i=1;
          }
          if (--i) myLoop(i,element,code);
        }, 2000);
      })(60,element[i],code);
    }
  }
}

if (isgaspage && (GASratings || GASfeatures || GAStags)){
  setTimeout(function(){
    sgplus = !!$('a.nav__row.SGPP__settings:first').length;
    sgplusgrid = (sgplus ? !!$('div.SGPP__gridView:first').length : false);
    if (sgplusgrid){ log('SG++ using Grid view'); }
    sgplus = (sgplus ? (JSON.parse(localStorage.SGPP_Settings||false).EndlessScrollGiveaways||{enabled:false}).enabled : false);
    extendedsg = !!$(document.getElementsByClassName('page-loading')).filter('[src*="Extended_Steamgifts"]').length;
    esgst = document.querySelector('div[class*="esgst-es-page"]');
    scangas($(document.getElementsByClassName('giveaway__icon')).filter('a[href*="/app/"]'));
    if(sgplus || extendedsg){
      log((sgplus ? 'SG++' : extendedsg ? 'Extended SteamGifts' : 'ESGST') + ' using endless scroll');
      log('Starting observer (Endless scroll compatibility)');
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          var element = ( !sgplus ? $(mutation.addedNodes).filter('div:not([class])') : $(mutation.addedNodes).filter('div.table__heading'));
          if (element.length === 1){
            var element = $('a.giveaway__icon[href*="/app/"]', ( !sgplus ? element : element.parent().filter('div:not([class])')));
            if (element.length !== 0){ scangas(element); }
          }
        });
      });
      observer.observe(document.getElementsByClassName('widget-container')[0].children[1], { childList: true, subtree: sgplus });
    } else if (!!esgst){
      log('ESGST using endless scroll');
      log('Starting observer (Endless scroll compatibility)');
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          var elements = $(mutation.addedNodes);
          for (var i=0; i<elements.length; i++){
            var element = $('a.giveaway__icon[href*="/app/"]', elements[i]);
            if (element.length===1){
              scangas(element);
            }
          }
        });
      });
      observer.observe(esgst.parentNode, { childList: true, subtree: false });
    } else if (forceobserver){
	  log('Starting observer (Endless scroll compatibility)');
	  var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  scangas($('a.giveaway__icon[href*="/app/"]', mutation.addedNodes));
		});
	  });
	  observer.observe(document.getElementsByClassName('widget-container')[0].children[1], {
		childList: true,
		subtree: true
	  });
	}
  }, 20);
} else if (isgapage && (GAratings || (GAfeatures===1||GAfeatures===2) || (GAtags===1||GAtags===2))) {
  var link = document.getElementsByClassName('global__image-outer-wrap--game-large');
  if (link.length !== 0){
    if (link[0].href.indexOf('store.steampowered.com/app/') !== -1){
      getrating(link[0].href, link[0].parentElement);
    }
  }
} else if (ishiddenpage){
    scangas($('a.table__column__secondary-link[href*="/app/"]'));
}

setTimeout(function(){ if(timer){ console.timeEnd('SG Ratings'); } }, 0);
if (timer) console.timeEnd('SG Ratings Internal');