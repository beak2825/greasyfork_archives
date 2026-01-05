// ==UserScript==
// @name        Synesthesia
// @author      Squigglez
// @namespace   RandomTagHere
// @description Colors text characters to try and develop association between letter and colors.
// @include     *
// @version     2.0
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/23830/Synesthesia.user.js
// @updateURL https://update.greasyfork.org/scripts/23830/Synesthesia.meta.js
// ==/UserScript==
/*
There's no license so I believe it defaults to GNU.
If you change or redistribute this it'd be nice to get some credit though.
Not that I'll know one way or the other.
*/

/*
Sets timeout for recursive calls to stop the browser from locking up.
Keep in mind too long will take the a long time for the page to finish coloring.
Too short and the browser may still become unresponsive.
Set to 0 to disable delay.
*/
var timeOut = 100;

/*
Creates colored background behind all colored texts.
Set to true to help with pages that have difficult backgrounds.
Change color if default doesn't help.
*/
var backGround = false;
var backGroundColor = 'White';

grabText();

function getColor(character){
  /*
  Look up for which color matches given letter.
  Change colors if desired.
  By default the 10 digits use the same colors as the first 10 letters.
  */
  var testChar = character.toLowerCase();
  var numFlag = parseFloat(character) == character;
  var colors = {
    'a': 'Indigo',
    'b': 'Cyan',
    'c': 'DarkGoldenRod',
    'd': 'Crimson',
    'e': 'DarkMagenta',
    'f': 'Aquamarine',
    'g': 'DarkOrchid',
    'h': 'DeepPink',
    'i': 'OrangeRed',
    'j': 'Gray',
    'k': 'Navy',
    'l': 'Lime',
    'm': 'Khaki',
    'n': 'Gold',
    'o': 'Sienna',
    'p': 'Yellow',
    'q': 'DarkRed',
    'r': 'LimeGreen',
    's': 'DarkGreen',
    't': 'BurlyWood',
    'u': 'MediumSpringGreen',
    'v': 'DarkOrange',
    'w': 'Blue',
    'x': 'Salmon',
    'y': 'HotPink',
    'z': 'CadetBlue'
  }
  var numColors = {
    '1':colors['a'],
    '2':colors['b'],
    '3':colors['c'],
    '4':colors['d'],
    '5':colors['e'],
    '6':colors['f'],
    '7':colors['g'],
    '8':colors['h'],
    '9':colors['i'],
    '0':colors['j']
  }
  if(numFlag){
    return numColors[character];
  }
  else{
    return colors[testChar] || null; //Returns null if the character was a symbol.
  }
}

function whiteList(tagName){
  /*
  Whilelist of which tags should be explored further for possible text to color.
  Any tags not here will be ignored.
  Add/Remove tags if needed. All tags except #text need to be uppercase.
  Removing #text will stop the script from functioning.
  */
  var whiteList = [
    '#text',
    'A',
    'P',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'LI',
    'UL',
    'OL',
    'DL',
    'DIV',
    'STRONG',
    'MAIN',
    'B',
    'I',
    'S',
    'U',
    'EM',
    'SMALL',
    'MARK',
    'ABBR',
    'DFN',
    'Q',
    'BDO',
    'BDI',
    'EMBED',
    'AREA',
    'BUTTON',
    'LABEL',
    'OPTION',
    'CODE',
    'SUP',
    'SUB',
    'CITE',
    'SPAN',
    'HGROUP',
    'ADDRESS',
    'INS',
    'SECTION',
    'ARTICLE',
    'HEADER',
    'FOOTER',
    'ASIDE',
    'FIGURE',
    'TABLE',
    'MENU',
    'INPUT',
    'TBODY',
    'TR',
    'TD'
  ]
  return whiteList.indexOf(tagName) != -1;
}

function mkSpan(character){
  //Colors letters using span tags.
  var color = getColor(character);
  if(color == null){
    return character;
  }
  else{ 
     return '<span style="color:' + color + '">' + character + '</span>';
  } 
}

function colorize(string){
  //Parses strings to have them colored.
  var i = 0;
  var flag = false;
  var length = string.length;
  var final = '';
  var letter;
  var temp;
  for(i;i<length;i++){
    temp = string[i];
    letter = mkSpan(temp);
    if(letter != temp && !flag) flag = true;
    final += letter;
  }
  if(!flag) return string;
  var coloredText = document.createElement('coloredtext');
  if(backGround){
    coloredText.setAttribute('style','background-color:' + backGroundColor);
  }
  coloredText.innerHTML = final;
  return coloredText;
}

function nodeWalk(node){
  //Main function, uses recursion to get to leaf nodes, sends text to be colored.
  var children = [].slice.call(node.childNodes);
  var length = children.length;
  if(!length) return;
  var i = 0;
  var child;
  var type;
  var name;
  var coloredText;
  var text;
  for(i;i<length;i++){
    child = children[i];
    name = child.nodeName;
    type = child.nodeType;
    if(!whiteList(name)) continue;
    if(type == 3){
      text = child.textContent;
      coloredText = colorize(text);
      if(text == coloredText) continue;
      node.replaceChild(coloredText,child);
      continue;
    }  
    if(type == 1){
      if(timeOut > 0){
        window.setTimeout(nodeWalk,timeOut,child);
      }
      else{
        nodeWalk(child);
      }
    }
  }
}

function grabText(){
  //Grabs body and sends it as the start point for nodeWalk.
  var body = document.body;
  nodeWalk(body);
}