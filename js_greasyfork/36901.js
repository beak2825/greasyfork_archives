// ==UserScript==
// @name Blockhead
// @namespace blockhead
// @description Blocks headers and other sticky elements from wasting precious vertical screen estate by pinning them down.
// @match *://*/*
// @version 24
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM.getResourceText
// @grant GM.registerMenuCommand
// @grant GM_registerMenuCommand
// @grant GM.unregisterMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM.setClipboard
// @grant GM_setClipboard
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @xhr-include *
// @author elypter
// @require https://greasyfork.org/scripts/36900-super-gm-setvalue-and-gm-getvalue-lib/code/Super_GM_setValue_and_GM_getValue%20lib.user.js
// @resource black_keywords https://github.com/elypter/filter_processor/raw/master/rules/generic_rule_keywords.txt
// @downloadURL https://update.greasyfork.org/scripts/36901/Blockhead.user.js
// @updateURL https://update.greasyfork.org/scripts/36901/Blockhead.meta.js
// ==/UserScript==



/*
Do you also get annoyed by all those pointless sticky headers with pointless logos, hamburger menus and no particular functionality that can wait for you to scroll up? are you getting flashbacks from your grandmas internet explorer with 10 toolbars installed? do you find it absurd that screens are getting bigger and bigger but there is less and less content to see?
Then get ready to claim back some of that space with this userscript that blocks headers and other sticky elements from wasting precious vertical screen estate by pinning them down to the background of the website. everything is staying acessible but it wont creep up on you like a creeping shower curtain anymore when scrolling.
It checks the computed style of each element. if the position attribute is "fixed" then it checks if its tagname, id or class names contain any keywords provided by the list below. https://raw.githubusercontent.com/elypter/BlockHead/master/black_keywords.js
this list is being created with this tool https://github.com/elypter/rule_keyword_generator by parsing the rules of https://raw.githubusercontent.com/yourduskquibbles/webannoyances/master/ultralist.txt for class names and ids.
There is also a whitelist for certain keywords and tag names to reduce flase positives and processing time.

on an 10 year old laptop it can take up 100-200ms or more in extreme cases so the performance aspect is not completely neglegtible but also not a deal breaker.

there is also the option to save automatically generated rules to disk by switching on the save_generated_rules variable in the memory tab of tampermonkey or violentmoneky and later putting "blockhead-rules" into the url of any website like https://example.com/?q=blockhead-rules the rules will be displayed on the site on a simple div layer so you can copy them where you like. for example into an adbloker or you could help out yourduskquibbles with his webannoyances ultralist https://github.com/yourduskquibbles/webannoyances/issues
statistics of the keyword usage can be retrieved in the same way by using "blockhead-statistics" they have to be turned on first as well.

https://github.com/elypter/BlockHead/ 
License: GPL3
*/

//this style will be added to all elements that this script detects as sticky annoyances.
var stylefix = 'position:relative !important';

var count_element_walker=0; //debug:counts how often a page check is triggered
var count_style_walking=0; //debug:counts how often checking stylesheets is triggered

//contained in black_keywords.txt
var black_keywords=GM_getResourceText("black_keywords").toString().split("\n"); //list generated with rule_keyword_generator from webannoyances ultralist

//id and classes that  any of these keycontainwords will not be modified
var white_names = ["side","preload","load","guide","article","html5","story","main","left","right","content","account__section","container--wide","container__main","panel",
                   "body","gutter","embed","watch","background","middleContainer","drag-and-drop"];
//var white_names = ["example-whitelist-entry"];

//tags that will not be cheked
var ignore_tags = ["a","A","script","SCRIPT","body","BODY","li","LI","ul","UL","br","BR","h5","H5","b","B","strong","STRONG","svg","SVG","path","PATH","h2","H2",
                   "code","CODE","tr","TR","td","TD","h3","H3","h1","H1","h4","H4"];//,"noscript","NOSCRIPT"

var toggle_rule_saving_handle;

var toggle_statistics_saving_handle;

var stop_scrolling_triggers = true; 

//debug switch. if on it prints out information in the java script console.
var debug=GM_SuperValue.get ("debug")==true?GM_SuperValue.get ("debug"):0; //1=yes 2=no 3=intense change value in memory tab
GM_SuperValue.set ("debug",debug);

//search for floating elements that get added after page load.
var mutation_check=GM_SuperValue.get ("mutation_check")==true?GM_SuperValue.get ("mutation_check"):1; //1=yes 2=no change value in memory tab
GM_SuperValue.set ("mutation_check",mutation_check);

//all elements of a site will be checked individually for their computed style and changed if there is a match
var walk_elements=GM_SuperValue.get ("walk_elements")==true?GM_SuperValue.get ("walk_elements"):1; //1=yes 2=no change value in memory tab
GM_SuperValue.set ("walk_elements",walk_elements);

//all stylesheets will be checked for classes and changed if there is a match
var walk_styles=GM_SuperValue.get ("walk_styles")==true?GM_SuperValue.get ("walk_styles"):0; //1=yes 2=no change value in memory tab
GM_SuperValue.set ("walk_styles",walk_styles);

//this will save the statistics of how often a keyword is being matched in a local variable that can be viewed in the memory tab
var save_keyword_statistics=GM_SuperValue.get ("save_keyword_statistics")==true?GM_SuperValue.get ("save_keyword_statistics"):0; //1=yes 2=no change of value in memory tab
GM_SuperValue.set ("save_keyword_statistics",save_keyword_statistics);

//this will save the rules generated based on the blocking in a local variable that can be viewed in the memory tab
var save_generated_rules=GM_SuperValue.get ("save_generated_rules")==true?GM_SuperValue.get ("save_generated_rules"):0; //1=yes 2=no change of value in memory tab
GM_SuperValue.set ("save_generated_rules",save_generated_rules);

function setup(){  
  
    if (save_generated_rules==2) toggle_rule_saving_handle=GM_registerMenuCommand("record generated rules", "toggle_rule_saving");
    if (save_generated_rules==1) toggle_rule_saving_handle=GM_registerMenuCommand("stop recording generated rules", "toggle_rule_saving");
    if (save_keyword_statistics==2) toggle_statistics_saving_handle=GM_registerMenuCommand("record statistics", "toggle_rule_saving");
    if (save_keyword_statistics==1) toggle_statistics_saving_handle=GM_registerMenuCommand("stop recording statistics", "toggle_statistics_saving");
  
    if (save_generated_rules==1) GM_registerMenuCommand("Copy generated rules to clipboard", "copy_saved_generated_rules");
    if (save_keyword_statistics==1) GM_registerMenuCommand("Copy generated rules to clipboard", "copy_saved_generated_statistics");
}

setup();

function toggle_rule_saving(){
  if (save_generated_rules==2) {
    save_generated_rules=1;
    GM_SuperValue.set ("save_generated_rules",1);
  }
  if (save_generated_rules==1){
    save_generated_rules=2;
    GM_SuperValue.set ("save_generated_rules",2);
  } 
  //GM_unregisterMenuCommand(toggle_rule_saving_handle);
  setup();
}

function toggle_statistics_saving(){
  if (save_generated_rules==2) {
    save_keyword_statistics=1;
    GM_SuperValue.set ("save_keyword_statistics",1);
  }
  if (save_generated_rules==1) {
    save_keyword_statistics=2;
    GM_SuperValue.set ("save_keyword_statistics",2);
  }
  //GM_unregisterMenuCommand(toggle_statistics_saving_handle);
  setup();
}

function counted_element_walker(elm,orig){
    count_element_walker++;

    //this disables all javascript that is being triggered when scrolling
    if(stop_scrolling_triggers) window.addEventListener("scroll", function (event) {
        event.stopPropagation();
    }, true);
    console.log("check number "+count_element_walker+" from: "+orig);
    element_walker_all(elm);
    if (debug==3) console.log(GM_SuperValue.get ("white_names_counter"));
    if (debug==3) console.log(GM_SuperValue.get ("black_keywords_counter"));
    if (debug==3) console.log(GM_SuperValue.get ("generated_rules"));
}

function keyword_walker(keyword_list){
    var white_names_counter=GM_SuperValue.get ("white_names_counter")||{};
    var black_keywords_counter=GM_SuperValue.get ("black_keywords_counter")||{};

    //todo: switch order of for loops to detect whitelists earlier
    var state=-1;
    if (debug==3) console.log("list: ("+keyword_list.length+") "+keyword_list);
    for (var i=0; i < keyword_list.length; i++){
        var subword_list=keyword_list[i].toString().split('-');
        if (debug==3) console.log("sublen of: "+subword_list+" from "+keyword_list[i]+" = "+subword_list.length);
        for (var j=0; j < subword_list.length; j++){
            var subsubword_list=subword_list[j].split('_');
            if (debug==3) console.log("subsublen of: "+subsubword_list+" from "+subword_list[j]+" = "+subsubword_list.length);
            for (var k=0; k < subsubword_list.length; k++){
                for (var l=0; l < white_names.length; l++){
                    if (debug==3) console.log("test white: l:"+white_names[l]+" in s:"+subsubword_list[k]+" of "+keyword_list);
                    if (subsubword_list[k].indexOf(white_names[l]) != -1){
                        if (debug==3) console.log("whitelisted: l:"+white_names[l]+" in s:"+subsubword_list[k]+" of "+keyword_list);
                        if(white_names_counter[white_names[l]]) white_names_counter[white_names[l]]++;
                        else white_names_counter[white_names[l]]=1;
                        if (save_keyword_statistics==1) GM_SuperValue.set ("white_names_counter", white_names_counter);
                        return 0;
                    }
                }
                for (var l=0; l < black_keywords.length; l++){
                    if (subsubword_list[k].indexOf(black_keywords[l]) != -1){
                        if (debug==3||debug==1) console.log("matched: l:"+black_keywords[l]+" in s:"+subsubword_list[k]+" of "+keyword_list);
                        if(black_keywords_counter[black_keywords[l]]) black_keywords_counter[black_keywords[l]]++;
                        else black_keywords_counter[black_keywords[l]]=1;
                        state = 1;
                    }
                }
            }
        }
    }

    if (save_keyword_statistics==1) GM_SuperValue.set ("black_keywords_counter", black_keywords_counter);
    return state;
}

var generated_rules=GM_SuperValue.get ("generated_rules",[])||[]; //contains all adblock/ublock rules that the script creates based on what it modifies
function element_walker_all(startElem) {
    //walk over element list as opposed to an element tree
    if (!(startElem instanceof Element)) return;

    // var generated_rules=GM_SuperValue.get ("generated_rules")||[]; //contains all adblock/ublock rules that the script creates based on what it modifies

    var elms = startElem.getElementsByTagName("*");
    for (var x = elms.length; x--;) {
        elm=elms[x];
    if (debug==3) console.log("checking: "+elm.tagName.toString());
    if(elm instanceof Element && ignore_tags.indexOf(elm.tagName.toString()) == -1 && getComputedStyle(elm)) {
        if (debug==3) console.log("testing: "+elm.tagName.toString()+" with position= "+getComputedStyle(elm).getPropertyValue("position").toLowerCase());
        if (/*(getComputedStyle(elm).getPropertyValue("position") == "absolute") ||*/
            (getComputedStyle(elm).getPropertyValue("position").toLowerCase() == "fixed")/* || */
            /*(getComputedStyle(elm).getPropertyValue("position") == "relative")*//* ||*/
            /*(getComputedStyle(elm).getPropertyValue("top") != "")*/) {

        var keyword_list =[];
        keyword_list=elm.className.toString().split(' ');
        if (typeof(elm.id)=="string"&&elm.id!="") keyword_list.push([elm.id]);
        if (typeof(elm.tagName)=="string"&&elm.tagName!="") keyword_list.push([elm.tagName]);

        var has_matched=-1;
        if (keyword_list!=[]&&keyword_list!=[""]){
            //compare against black and whitelist
            has_matched=keyword_walker(keyword_list);
        }
        var rule;
        var class_list=elm.className.toString().split(' '); //check for rule writing
        if (has_matched==1){
            if (debug==3||debug==1) console.log("pinning sticky: "+elm.id+","+elm.className+","+elm.tagName);

            if (elm.id){
                rule=window.location.hostname+"###"+elm.id+":style(position: "+stylefix+" !important;)";
                if(generated_rules.indexOf(rule)==-1){
                    if(!(generated_rules.indexOf(rule) > -1)) generated_rules.push(rule);
                    //console.log(rule);
                }
            }
            if(elm.className){
                for (var i=0; i < class_list.length; i++){
                    rule=window.location.hostname+"##."+class_list[i]+":style(position: "+stylefix+" !important;)";
                    if(generated_rules.indexOf(rule)==-1){
                        if(!(generated_rules.indexOf(rule) > -1)) generated_rules.push(rule);
                        //console.log(rule);
                    }
                }
            }
            elm.setAttribute('style', stylefix);
            elm.style.removeProperty('top');
            //return;
        }else if(has_matched==0){
            if (elm.id){
                rule=window.location.hostname+"#@##"+elm.id;
                if(generated_rules.indexOf(rule)==-1){
                    if(!(generated_rules.indexOf(rule) > -1)) generated_rules.push(rule);
                    //console.log(rule);
                }
            }
            if(elm.className){
                for (var j=0; j < class_list.length; j++){
                    rule=window.location.hostname+"#@#."+class_list[j];
                    if(generated_rules.indexOf(rule)==-1){
                        if(!(generated_rules.indexOf(rule) > -1)) generated_rules.push(rule);
                        //console.log(rule);
                    }
                }
            }
            if (debug==3||debug==1) console.log("whitelisted sticky: "+elm.id+","+elm.className+","+elm.tagName);
        }else{
            if (debug==3||debug==1) console.log("ignoring sticky: "+elm.id+","+elm.className+","+elm.tagName);
        }
        }
    }



    }
    if (save_generated_rules==1){
        GM_SuperValue.set ("generated_rules", generated_rules);
    }
}

function element_walker(elm) {
    //walk over element list as opposed to an element tree
    var node;
    //console.log("checking: "+elm.tagName.toString());
    if(elm instanceof Element && ignore_tags.indexOf(elm.tagName.toString()) == -1 && getComputedStyle(elm)) {
        //console.log("testing: "+elm.tagName.toString()+" with position= "+getComputedStyle(elm).getPropertyValue("position").toLowerCase());
        if (/*(getComputedStyle(elm).getPropertyValue("position") == "absolute") ||*/
            (getComputedStyle(elm).getPropertyValue("position").toLowerCase() == "fixed")/* || */
            /*(getComputedStyle(elm).getPropertyValue("position") == "relative")*//* ||*/
            /*(getComputedStyle(elm).getPropertyValue("top") != "")*/) {

        var keyword_list =[];
        keyword_list=elm.className.toString().split(' ');
        if (typeof(elm.id)=="string"&&elm.id!="") keyword_list.push([elm.id]);

        var has_matched=-1;
        if (keyword_list!=[]&&keyword_list!=[""]){
            has_matched=keyword_walker(keyword_list);
        }
        var rule;
        var class_list=elm.className.toString().split(' '); //check for rule writing
        if (has_matched==1){
            if (debug==3) console.log("pinning sticky: "+elm.id+","+elm.className+","+elm.tagName);

            if (elm.id){
                rule=window.location.hostname+"###"+elm.id+":style("+stylefix;+")";//":style(position: "+"relative"+" !important;)";
                if(generated_rules.indexOf(rule)==-1){
                    generated_rules.push(rule);
                    if (debug==3||debug==1) console.log(rule);
                }
            }
            if(elm.className){
                for (var i=0; i < class_list.length; i++){
                    rule=window.location.hostname+"##."+class_list[i]+":style("+stylefix;+")"//":style(position: "+"relative" +" !important;)";
                    if(generated_rules.indexOf(rule)==-1){
                        generated_rules.push(rule);
                        if (debug==3||debug==1) console.log(rule);
                    }
                }
            }
            elm.setAttribute('style', stylefix);
            elm.style.removeProperty('top');
            //return;
        }else if(has_matched==0){
            if(elm.className){
                for (var j=0; j < class_list.length; j++){
                    rule="@@"+window.location.hostname+"##."+class_list[j];
                    if(generated_rules.indexOf(rule)==-1){
                        generated_rules.push(rule);
                        if (debug==3||debug==1) console.log(rule);
                    }
                }
            }
            //return;
        }else{
            if (debug==3) console.log("ignoring sticky: "+elm.id+","+elm.className+","+elm.tagName);
        }
        }
    }

    // Handle child elements
    for (node = elm.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 1) { // 1 == Element
            element_walker(node);
        }
    }


}

function style_walker() {
    //this alternative mode of searching and modifying sticky elements by searching stylesheets directly
    //although i thought stylesheet checking would be faster it tends be slower and cannot be performed on external stylesheets

    var state=0;
    count_style_walking++;
    if (debug==3) console.log("checking stylesheets for the "+count_style_walking+"th time");
    var styleSheets = window.document.styleSheets;

    for(var i = 0; i < styleSheets.length; i++){
        //console.log("checking stylesheet #"+i);//+" named "+styleSheets[i].sheet);

        //try to get a list of classes for each stylesheet.
        //this will throw an error if the stylesheet is hosted on an external server because of cross site protection
        //these stylesheets cannot be processed at them moment/or never
        var classes;
        if (document.styleSheets[i].cssRules){
            classes=document.styleSheets[i].cssRules;
        }else if (document.styleSheets[i].rules){
            classes=document.styleSheets[i].rules;
        }//}catch(e){}
        if (!classes) continue;

        for (var j = 0; j < classes.length; j++) {
            if (debug==3) console.log("checking class "+classes[x].selectorText);
            state=0;
            for (var k=0; k < black_keywords.length; k++){
                if (classes[j].selectorText) if (classes[j].selectorText.indexOf(black_keywords[k])!=-1){
                    if (debug==3) console.log("matched: l:"+black_keywords[k]+" in s:"+classes[j].selectorText+" of "+styleSheets[i].sheet);
                    if (classes[j].position=="absolute" ||classes[j].position=="fixed"){
                        state = 1;
                    }
                }
            }
            for (var k=0; k < white_names.length; k++){
                if (classes[j].selectorText) if (classes[j].selectorText.indexOf(white_names[k])!=-1){
                    if (debug==3) console.log("whitelisted: l:"+white_names[k]+" in s:"+classes[j].selectorText+" of "+styleSheets[i].sheet);
                    state=0;
                }
            }
            if (state==1){
                stylesheet.deleteRule("position");
            }
        }
    }
}

// show saved rules when opening a location containing "bloackhead-rules"
if(window.location.toString().indexOf("blockhead-rules")!=-1){
    show_saved_generated_rules()
    copy_saved_generated_rules()

}
// show saved rules when opening a location containing "bloackhead-statistics"
if(window.location.toString().indexOf("blockhead-statistics")!=-1){
    show_saved_generated_statistics();
    copy_saved_generated_statistics();
}

function copy_saved_generated_rules(){
    var text
    var s_rules=GM_SuperValue.get ("generated_rules")||[];
    for(var i=0, len=generated_rules.length;i<len;i++){
        //text+=s+'\n';
        text+=generated_rules[i]+'\n';
        //text+=rules[i]+'<br/>\n';
    }
    GM_setClipboard(text, { type: 'text', mimetype: 'text/plain'});
}

function show_saved_generated_rules(){
    var iDiv = document.createElement('div');
    iDiv.id = 'blockhead-rules';
    iDiv.style.margin = '0 auto';
    iDiv.style.position= "absolute";
    iDiv.style.backgroundColor ="white";
    iDiv.style.zIndex=9001000;
    iDiv.style.opacity=1;
    document.getElementsByTagName('body')[0].appendChild(iDiv);

    rules=GM_SuperValue.get ("generated_rules");
    for(var i=0;i<rules.length;i++){
        iDiv.innerHTML+=rules[i]+'<br/>\n';
    }
    throw new Error('This is not an error. This is just to abort javascript');
}

function copy_saved_generated_statistics(){
    var text;
    text='#white_names_counter:\ņ';
    var rules=GM_SuperValue.get ("white_names_counter");
    for (var key in rules) {
        text+=key+": "+rules[key]+'\n';
    }
    text+='\n############\n';
    text+='#black_keyword_counter:\ņ';
    rules=GM_SuperValue.get ("black_keywords_counter");
    for (var key in rules) {
        text+=key+": "+rules[key]+'\n';
    }
    GM_setClipboard(text);
}
  
function show_saved_generated_statistics(){
    var text;
    text='#white_names_counter:<br/>\ņ';
    var rules=GM_SuperValue.get ("white_names_counter");
    for (var key in rules) {
        text+=key+": "+rules[key]+'<br/>\n';
    }
    text+='<hr>\n';
    text+='#black_keyword_counter:<br/>\ņ';
    rules=GM_SuperValue.get ("black_keywords_counter");
    for (var key in rules) {
        text+=key+": "+rules[key]+'<br/>\n';
    }
        var iDiv = document.createElement('div');
    iDiv.id = 'blockhead-statistics';
    iDiv.style.margin = '0 auto';
    iDiv.style.position= "absolute";
    iDiv.style.backgroundColor ="white";
    iDiv.style.zIndex=9001000;
    iDiv.style.opacity=1;
    document.getElementsByTagName('body')[0].appendChild(iDiv);


    iDiv.innerHTML=text;
    throw new Error('This is not an error. This is just to abort javascript');
}

// Kick it off starting with the `body` element
if(walk_styles==1) style_walker();
if(walk_elements==1) counted_element_walker(document.body,"onstart");

// check elements again if the page code changes
if(walk_elements==1) document.onload = counted_element_walker(document.body,"onload");

// check elements again if the page code changes
if(walk_elements==1) document.onchange = counted_element_walker(document.body,"onchange");

// check elements again if the user scrolls the page(doesnt really do anything)
if(walk_elements==1) document.onscroll = counted_element_walker(document.body,"onscroll");



//check if the dom is modified and checks the changed elements again
if(mutation_check==1 && walk_elements==1){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    // define a new observer
    var obs = new MutationObserver(function(mutations, observer) {
        // look through all mutations that just occured
        for(var i=0; i<mutations.length; ++i) {
            for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                //check this mutation
                counted_element_walker(mutations[i].addedNodes[j],"onmutation");
            }
        }
    });

    // have the observer observe for changes in children
    obs.observe(document.body, {
        attributes : true, //check for attribute changes
        childList: true, //use a list of occured changes
        subtree: false //also return all subelements of a change
    });
}
