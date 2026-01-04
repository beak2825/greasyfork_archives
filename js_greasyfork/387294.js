// ==UserScript==
// @name         SPARQLedit
// @namespace    https://greasyfork.org/users/21515
// @description  Edit Wikidata-SPARQL results directly and use QuickStatements to save the changes
// @author       CennoxX
// @contact      cesar.bernard@gmx.de
// @version      0.1.7
// @match        https://query.wikidata.org/*
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387294/SPARQLedit.user.js
// @updateURL https://update.greasyfork.org/scripts/387294/SPARQLedit.meta.js
// ==/UserScript==
/*variables*/
var userLang = navigator.language.split('-')[0];
var oldResponse = "";
var qid = "";
var prop = "";
var type = "";
var textField = "";
var content = "";
var target;
var jsonObj;
var checkForChanges;
var parElem;
/*patterns*/
var labelPattern = /rdfs:label/i;
var descriptionPattern = /schema:description/i;
var langPattern = /filter *\(+ *lang *\(+ *\?/i;
var langSplitStartPattern = /\)+ *= *["']/i;
var langSplitEndPattern = /["'] *\)/i;
var propertyPattern = /wdt:P/i;
var sparePattern = /[?. ]/g;
var optionalPattern = /optional *{ */gi;
var qPattern = /Q\d*/;

var mainLoop = setInterval(function(){
    var response = document.getElementById("response-summary").innerText;
    if (response && oldResponse != response){
        oldResponse = response;
        console.clear();
        if (!document.getElementById("qs-run")){
            addQSButton();
        }
        processTable();
    }
}, 500);
function addQSButton(){
    var navbar = document.getElementsByClassName("navbar navbar-default result")[0].getElementsByClassName("nav navbar-nav navbar-right")[0];
    var liNode = document.createElement("li");
    liNode.innerHTML = '<a id="qs-run" class="btn" data-toggle="modal" title="Run QuickStatements"><span class="fa fa-rocket"></span><span> QuickStatements</span></a>';
    navbar.appendChild(liNode);
    liNode.addEventListener("click", function() {startQuickStatements();});
}
function processTable(){
    var lines = [...document.querySelectorAll("tr[data-index]")];
    lines.forEach(i => [...i.querySelectorAll("td")].filter(i => i.innerHTML.includes("<span")).forEach(i => {
        i.title=i.firstElementChild.title;
        i.innerHTML=i.firstElementChild.innerHTML;
        i.setAttribute("contentEditable",true);
    }));


    //parseData, get Type, if Label/Description: contentEditable, if P click
    var table = document.getElementsByClassName("fixed-table-body")[0];
    var elems = table.getElementsByTagName("tbody")[0].getElementsByTagName("td");
    [...elems].forEach(function(item){
        var headers = table.getElementsByTagName("th");
        var qidItem = parseData(headers[item.cellIndex].innerText);
        if (type == "P" && headers[item.cellIndex].innerText!=qidItem){
            item.addEventListener("click", addSearchContext);
        }
        else if (type=="L" || type =="D"){
            item.setAttribute("contentEditable",true);
        }
    });
    //check for date columns etc.
}
function closeSearchContext(){
    var oldElem = document.getElementById("searchResults");
    if (oldElem){
        parElem = oldElem.parentElement;
        parElem.removeChild(oldElem);
        parElem.addEventListener("click", addSearchContext);
    }
}
function addSearchContext(){
    closeSearchContext();
    var tempValue = this.innerText.trim();//could remember if it stays the same and don't add
    this.innerHTML = '<span id="searchResults" class="select2-container select2-container--default select2-container--open" style="position: relative; top: -18px; left: -9px; width: 100%"><span class="select2-dropdown"><span class="select2-search--dropdown"><input class="select2-search__field" value="'+tempValue+'"/></span><span><ul class="select2-results__options"></ul></span></span></span>';
    this.removeEventListener("click", addSearchContext);
    this.querySelector('input').addEventListener("keyup", loadContent);
    this.querySelector('input').focus();
    var keyupEvent = new Event('keyup');
    if (tempValue!=""){
        this.querySelector('input').dispatchEvent(keyupEvent)
    }
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            closeSearchContext();
            parElem.innerHTML=tempValue;
        }
    };
}
function loadContent(){
    clearTimeout(checkForChanges);
    var _this = this;
    var search = _this.value;
    checkForChanges = setTimeout(function() {
        GM.xmlHttpRequest({
            method: 'GET',
            url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&limit=5&continue=0&language='+userLang+'&uselang='+userLang+'&type=item&search=' + search,
            onload: function(response) {
                if (response.responseText.length > 0) {
                    jsonObj = JSON.parse(response.responseText);
                    _this.parentElement.nextElementSibling.firstElementChild.innerHTML = "";
                    jsonObj.search.forEach(i => {
                        var liNode = document.createElement("li");
                        liNode.className = "select2-results__option";
                        liNode.innerHTML = "<span><b>"+i.label+" ("+i.id+")</b></span><br><small>"+i.description+"</small>";
                        liNode.addEventListener("click", function() {
                            var tdNode = _this.parentElement.parentElement.parentElement.parentElement;
                            tdNode.innerHTML = i.id;
                            tdNode.dataset.changed="true";
                        });
                        liNode.style.cursor = 'pointer';
                        _this.parentElement.nextElementSibling.firstElementChild.appendChild(liNode);
                    });
                }
            },
            onerror: function(response) {
                console.log('Error in fetching contents: ' + response.responseText);
            }
        });
    }, 500);
}
function startQuickStatements(){
    var quickStatements = "";
    var table = document.getElementsByClassName("fixed-table-body")[0];
    var elems = table.getElementsByTagName("tbody")[0].getElementsByTagName("td");
    [...elems].filter(i => i.contentEditable=="true" || i.dataset.changed == "true").forEach(function(item){
        if (item.title.slice(2,item.title.lastIndexOf("@"))!=item.innerText){
            content = item.innerText;
            var headers = table.getElementsByTagName("th");
            var qidItem = parseData(headers[item.cellIndex].innerText);
            Array.from(headers).forEach(
                function(item2){
                    if (item2.getAttribute("data-field")==qidItem){
                        qid = item.parentElement.children[item2.cellIndex].innerText.split(":")[1];
                    }
                }
            );
            if (quickStatements.length!=0){
                quickStatements += "%0A"
            }
            if (!qPattern.test(content)){
                content = "%22"+content+"%22";
            }
            quickStatements += qid+"%09"+type+prop+"%09"+content;
        }
    });
    window.open("https://tools.wmflabs.org/quickstatements/index_old.html#v1="+quickStatements);
}
function loadSourceCode(){
    var source = document.getElementsByClassName("CodeMirror-line");
    var sourceCode = [];
    Array.from(source).forEach(function(item){sourceCode.push(item.innerText);});
    return sourceCode;
}
function parseData(variable){
    var source = loadSourceCode();
    source.forEach(function(item){
        item = item.replace(optionalPattern,"");
        if (item.includes(variable)){
            if(labelPattern.test(item)){
                type = "L";
                target = item.split(labelPattern);
            }
            else if(descriptionPattern.test(item)){
                type = "D";
                target = item.split(descriptionPattern);
            }
            else if(propertyPattern.test(item)){
                type = "P";
                target = item.split(propertyPattern);
                prop = target[1].split(sparePattern)[0];
                qid = target[0].replace(sparePattern,"");
            }
        }
        if(langPattern.test(item)){
            target = item.split(langPattern);
            if (variable == target[1].split(langSplitStartPattern)[0]){
                prop = target[1].split(langSplitStartPattern)[1].split(langSplitEndPattern)[0];
            }
        }
        if (type!=""){
            if (target[0].replace(sparePattern,"")==variable){
                qid = variable;
                textField = target[1].replace(sparePattern,"");
            } else if (target[1].replace(sparePattern,"")==variable){
                qid = target[0].replace(sparePattern,"");
                textField = variable;
            }
        }
    });
    return qid;
}