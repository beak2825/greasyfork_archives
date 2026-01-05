// ==UserScript==
// @name         Xkcd Forums Tables
// @version      1.0.1
// @description  Adds bbcode tables to the xkcd forums
// @author       faubiguy
// @match        http://forums.xkcd.com/*
// @match        http://fora.xkcd.com/*
// @match        http://forums2.xkcd.com/*
// @match        http://echochamber.me/*
// @namespace    FaubiScripts
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12955/Xkcd%20Forums%20Tables.user.js
// @updateURL https://update.greasyfork.org/scripts/12955/Xkcd%20Forums%20Tables.meta.js
// ==/UserScript==

tableVersion = '1'

debug_on = false;

function debug(str){
    if (debug_on){
        console.log(str);
    }
}

//parseCSV attribution: https://stackoverflow.com/a/14991797/3893398
function parseCSV(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    var row, col, c;
    for (row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

function arrayToCSV(arr) {
    var lines = [];
    for (var i = 0; i < arr.length; i++){
        row = arr[i];
        line = [];
        for (var j = 0; j < row.length; j++){
            cell = row[j];
            if (cell.indexOf(',') != -1 || cell.indexOf('\n') != -1 || cell.indexOf('"') != -1){ //comma or newline or quote in cell
                cell = '"' + cell.replace('"', '""') + '"';
            }
            line[j] = cell;
        }
        lines[i] = line.join(',');
    }
    return lines.join('\n');
}

//attribution: http://stackoverflow.com/a/13419367/3893398
function parseQueryString(qstr)
{
  var query = {};
  var a = qstr.split('&');
  for (var i = 0; i < a.length; i++)
  {
    var b = a[i].split('=');
	var value = decodeURIComponent(b[1])
	if (value == 'true') {
		value = true
	} else if (value == 'false') {
		value = false
	}
    query[decodeURIComponent(b[0])] = value;
  }

  return query;
}

//attribution: http://stackoverflow.com/a/15096979/3893398
function objectToQueryString(obj) {
   var str = [];
   for(var p in obj){
       if (obj.hasOwnProperty(p)) {
           str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
       }
   }
   return str.join("&");
}

var defaultOptions = {'header': true};
var defaultKeys = Object.keys(defaultOptions);

function tableToOutputBBCode(table) {
    debug('toOutput: ' + JSON.stringify(table));
    var rows = table.array.length;
    var cols = table.array.reduce(function(b,c){return Math.max(b, c.length);}, 0);
    var widths = [];
    for (var col = 0; col < cols; col++){
        var width = 0;
        for (var row = 0; row < rows; row++){
            width = Math.max(width, (table.array[row][col] || '').length);
        }
        widths[col] = width;
    }
    var lines = [];
    for (var row = 0; row < rows; row++){
        var line = [];
        for (var col = 0; col < cols; col++){
            var value = table.array[row][col] || '';
            line[col] = value + ' '.repeat(widths[col]-value.length);
        }
        lines[row] = line.join('  ');
    }
    if (getOption(table.options,'header')){
        lines = lines.slice(0,1).concat([''],lines.slice(1));
    }
    table.options.widths = widths;
    var result = '[url=http://faubi/' + (table.csv ? 'csvtable' : 'table') + '.v' + tableVersion + '/?' + objectToQueryString(table.options) + '][s][/s][/url][code]' +  lines.join('\n').replace(/\[\/code]/g,'[\\code]') + '[/code]';
    debug(result);
    return result;
}

function getOption(options, option){
    var result = options[option];
    if (result === undefined){
        result = defaultOptions[option];
    }
    return result;
}

function tableToInputBBCode(table){
    debug('toInput: ' + JSON.stringify(table));
    var bbcode =  '[' + (table.csv ? 'csvtable' : 'table') + (Object.getOwnPropertyNames(table.options).length > 0 ? '=' + JSON.stringify(table.options) : '') + ']';
    if (table.csv) {
        bbcode += arrayToCSV(table.array);
    } else {
        for (var i = 0; i < table.array.length; i++){
            var row = table.array[i];
            bbcode += '[tr]';
            for (var j = 0; j < row.length; j++){
                bbcode += '[td]' + row[j].replace(/\[\/tr]/g, '[\\tr]').replace(/\[\/td]/g, '[\\td]') + '[/td]';
            }
            bbcode += '[/tr]';
        }
    }
    bbcode += '[/' + (table.csv ? 'csvtable' : 'table') + ']';
    return bbcode;
}

inputBBCodeRegex = /\[(table|csvtable)(?:=(.*?))?]([\s\S]*?)\[\/\1]/g; //groups: type, options, contents
outputBBCodeRegex = /\[url=http:\/\/faubi\/(table|csvtable)(?:.v([\0-9]+))?\/(.*?)]\[s]\[\/s]\[\/url]\[code]([\s\S]*?)\[\/code]/g; //groups: type, version, options, contents
hrefRegex = /http:\/\/faubi\/(table|csvtable)(?:.v([\0-9]+))?\/(.*)/; //groups: type, version, options
tableRowRegex = /\s*\[tr]([\s\S]*?)\[\/tr]\s*/g; //groups: cells
tableCellRegex = /\s*\[td]([\s\S]*?)\[\/td]\s*/g; //groups: cells
codeRegex = /\[code].*?\[\/code]/g; //groups: cells

function outputBBCodeToTable(match){
	debug('outputBBCodeToTable: ' + [match[1], match[2], match[3], match[4]].join(', '))
    return toTable(match[1], getOptionsByVersion(match[3], match[2]), match[4], 'output');
}

function inputBBCodeToTable(match){
	debug('inputBBCodeToTable: ' + [match[1], match[2], match[3]].join(', '))
    return toTable(match[1], getOptionsFromJSON(match[2]), match[3], 'input');
}

function toTable(type, options, contents, mode){
    debug('toTable: '+JSON.stringify({'type':type,'options':options,'contents':contents,'mode':mode}));
    var table = {};
    table.csv = type == 'csvtable';
	table.options = options
    if (mode=='input' && table.csv){
        if (contents[0] === '\n') {
            contents = contents.substr(1);
        }
        table.array = parseCSV(contents);
    } else if (mode=='input'){
        table.array = [];
        var rowMatch = tableRowRegex.exec(contents);
        while(rowMatch) {
            row = [];
            var cellMatch = tableCellRegex.exec(rowMatch[1]);
            while(cellMatch){
                row.push(cellMatch[1]);
                cellMatch = tableCellRegex.exec(rowMatch[1]);
            }
            table.array.push(row);
            rowMatch = tableRowRegex.exec(contents);
        }
    } else { //mode=='output'
        table.array = textTableToArray(contents, table.options);
    }
    delete table.options.widths;
    return table;
}

function textTableToArray(text, options) {
    if (!options){
        return [['Broken Table!']];
    }
    lines = text.split('\n');
    array = [];
    for (var row = 0; row < lines.length; row++){
        if (row == 1 && getOption(options,'header')){
            continue;
        }
        var rowArray = [];
        var startpos = 0;
        for (var col = 0; col < options.widths.length; col++){
            rowArray[col] = lines[row].substr(startpos, options.widths[col]).trim();
            startpos += options.widths[col] + 2;
        }
        if (rowArray.length === 0){
            rowArray.push('');
        }
        array.push(rowArray);
    }
    return array;
}

function getOptionsFromJSON(jsonString) {
	try {
		var options = JSON.parse(unescape(jsonString));
		if (typeof(options) == 'object') {
			return options;
		} else {
			return {};
		}
	} catch (e) {
		return {};
	}
}

function getOptionsByVersion(optionString, version) {
	if (typeof(version) == 'string') {
		version = parseInt(version)
	}
	debug('getOptionsByVersion: ' + optionString + ', ' + version)
    switch (version) {
		case 0:
			return getOptionsFromJSON(optionString);
			break;
		case 1:
			var options = parseQueryString(optionString.substr(1));
			if (options.widths) {
				options.widths = options.widths.split(',').map(function(n){return parseInt(n,10)})
			}
			return options
			break;
		default:
			return {};
	}
}
	

function replaceTable(string, regex, func, nmfunc){
    func = func || function(x){return x}
    nmfunc = nmfunc || function(x){return x}
    var sections = [];
    var lastEnd = 0;
    var tableMatch = regex.exec(string);
    while (tableMatch){
        sections.push(nmfunc(string.substring(lastEnd, tableMatch.index)));
        sections.push(func(tableMatch));
        lastEnd = tableMatch.index + tableMatch[0].length;
        tableMatch = regex.exec(string);
    }
    return sections.join('') + nmfunc(string.substring(lastEnd));
}

if (window.location.pathname.indexOf('posting.php') != -1){ //On posting page
    var messagebox = document.getElementById('message');
    messagebox.value = replaceTable(messagebox.value, outputBBCodeRegex, function(x){return tableToInputBBCode(outputBBCodeToTable(x));});
    document.getElementById('postform').addEventListener('submit', function(){messagebox.value = replaceTable(messagebox.value, codeRegex, null, function(noncode){return replaceTable(noncode, inputBBCodeRegex, function(x){return tableToOutputBBCode(inputBBCodeToTable(x));});});});
}

links = document.getElementsByTagName('a');
linksList = [];
for (var i = 0; i < links.length; i++){
    if(links[i].href.startsWith('http://faubi/')){
        linksList.push(links[i]);
    }
}
debug('# Links: ' + linksList.length);
for (var i = 0; i < linksList.length; i++){
    var link = linksList[i];
    debug('Handling link: ' + link.href);
    var codebox = link.nextSibling;
    if (!(codebox && codebox.tagName == 'DL')){
        continue;
    }
    var text = codebox.children[1].firstChild.innerHTML.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
    var hrefMatch = hrefRegex.exec(link.href);
    if (!hrefMatch){
        continue;
    }
    var version = hrefMatch[2] ? parseInt(hrefMatch[2]) : 0;
    var options = getOptionsByVersion(hrefMatch[3], version)
    var table = toTable(hrefMatch[1], options, text, 'output');
    var htmlTable = document.createElement('table');
    htmlTable.classList.add('faubi-table');
    for (var rowNum = 0; rowNum < table.array.length; rowNum++){
        var row = table.array[rowNum];
        var tr = document.createElement('tr');
        for (var j = 0; j < row.length; j++){
            var td = document.createElement(rowNum === 0 && getOption(table.options, 'header') ? 'th' : 'td');
            var cellText = row[j];
            if (cellText === ''){
                cellText = '\u00A0';
            }
            td.textContent = cellText;
            tr.appendChild(td);
        }
        htmlTable.appendChild(tr);
    }
    link.parentNode.insertBefore(htmlTable, link);
    codebox.style.display = 'none';
    link.style.display = 'none';
}
var style = document.createElement('style');
style.textContent = '.faubi-table{border: 1px solid gray; border-collapse: collapse} .faubi-table td, .faubi-table th{border: 1px solid gray; padding-left: 2px; padding-right: 2px; height: 100%;}';
document.head.appendChild(style);