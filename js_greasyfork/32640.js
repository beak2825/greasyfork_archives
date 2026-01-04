// ==UserScript==
// @name         Bigger forum text
// @version      1.2
// @description  Tool to let you raise or lower the size of forum's text
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com\/onlinezombiemmo\/index.php\?board=/
// @include      /fairview\.deadfrontier\.com\/onlinezombiemmo\/index.php\?topic=/
// @grant        none
// @namespace    https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/32640/Bigger%20forum%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/32640/Bigger%20forum%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var holder = document.createElement("div");
    
    var btnPlusQuotes = document.createElement("button");
    btnPlusQuotes.setAttribute("onclick", "plusQuotes()");
    btnPlusQuotes.textContent = "+";
    var btnMinusQuotes = document.createElement("button");
    btnMinusQuotes.setAttribute("onclick", "minusQuotes()");
    btnMinusQuotes.textContent = "-";
    var txtQuotes = document.createElement("input");
    txtQuotes.value = "Quotes";
    txtQuotes.setAttribute("disabled", true);
    
    var btnPlusMsgs = document.createElement("button");
    btnPlusMsgs.setAttribute("onclick", "plusMsgs()");
    btnPlusMsgs.textContent = "+";
    var btnMinusMsgs = document.createElement("button");
    btnMinusMsgs.setAttribute("onclick", "minusMsgs()");
    btnMinusMsgs.textContent = "-";
    var txtMsgs = document.createElement("input");
    txtMsgs.value = "Messages";
    txtMsgs.setAttribute("disabled", true);
    
    var btnPlusTitles = document.createElement("button");
    btnPlusTitles.setAttribute("onclick", "plusTitles()");
    btnPlusTitles.textContent = "+";
    var btnMinusTitles = document.createElement("button");
    btnMinusTitles.setAttribute("onclick", "minusTitles()");
    btnMinusTitles.textContent = "-";
    var txtTitles = document.createElement("input");
    txtTitles.value = "Titles";
    txtTitles.setAttribute("disabled", true);
    
    var script = document.createElement("script");
    
    function plusQuotes(){
        var quotes = document.getElementsByClassName("quote");
        setQuotes(getSize(quotes[0]) +1 + "px");
    }
    function minusQuotes(){
        var quotes = document.getElementsByClassName("quote");
        setQuotes(getSize(quotes[0]) -1 + "px");
    }
    
    function plusMsgs(){
        var msgs = document.getElementsByClassName("row11");
        setMsgs(getSize(msgs[0]) +1 + "px");
    }
    function minusMsgs(){
        var msgs = document.getElementsByClassName("row11");
        setMsgs(getSize(msgs[0]) -1 + "px");
    }
    
    function plusTitles(){
        var topicTitles = document.getElementsByClassName("topictitle");
        setTitles(getSize(topicTitles[0]) +1 + "px");
    }
    function minusTitles(){
        var topicTitles = document.getElementsByClassName("topictitle");
        setTitles(getSize(topicTitles[0]) -1 + "px");
    }
    
    function getSize(element){
        return getNumber(element.style.fontSize);
    }
    function getNumber(string){
        return parseInt(string.match(/\d+/)[0]);
    }
    
    function setTextSize(size, elements, storage){
        for(var i=0;i<elements.length;i++){
            if(elements[i].children.length > 0){
                setTextSizeOfChildren(size, elements[i].children, storage);
            }
            elements[i].style.fontSize = size;
        }
        localStorage.setItem(storage, size);
    }
    function setTextSizeOfChildren(size, children, storage){
        //Using queues for being iterative? Ain't nobody got time fo' dat
        for(var i=0; i<children.length; i++){
            if(children[i].style.fontSize != ""){
                var newSize = sizeMagic(size, children[i].style.fontSize, storage);
                children[i].style.fontSize = newSize;
            }
            else if(children[i].children.length > 0){
                setTextSizeOfChildren(size, children[i].children, storage);
            }
        }
    }
    function sizeMagic(normalSize, oldSize, storage){
        var parsedNormalSize = getNumber(normalSize);
        var parsedOldSize = getNumber(oldSize);
        var parsedOldSizePx = parsedOldSize;
        var parsedOldNormalSize;
        if(oldSize.indexOf("pt") > -1){
            parsedOldSizePx *= 1.33;
            parsedOldNormalSize = getNumber(original[storage]);
        }
        else{
            parsedOldNormalSize = localStorage.getItem(storage)? 
                getNumber(localStorage.getItem(storage)): getNumber(original[storage]);
        }
        var finalSize = parsedOldSizePx + (parsedNormalSize - parsedOldNormalSize);
        return finalSize + "px";
    }
    
    function setQuotes(size){
        var quotes = document.getElementsByClassName("quote");
        setTextSize(size, quotes, "sizeQuotes2");
    }
    
    function setMsgs(size){
        var msgs = document.getElementsByClassName("row11");
        setTextSize(size, msgs, "sizeMsgs2");
    }
    
    function setTitles(size){
        var topicTitles = document.getElementsByClassName("topictitle");
        setTextSize(size, topicTitles, "sizeTitles2");
    }
    
    
    var original = {};
    original.sizeTitles2 = "11px";
    original.sizeMsgs2 = "12px";
    original.sizeQuotes2 = "11px";
    localStorage.removeItem("sizeQuotes");
    localStorage.removeItem("sizeTitles");
    localStorage.removeItem("sizeMsgs");
    
    var sizeTitles = localStorage.getItem("sizeTitles2")? 
        localStorage.getItem("sizeTitles2"): "14px";
    var sizeMsgs = localStorage.getItem("sizeMsgs2")? 
        localStorage.getItem("sizeMsgs2"): "18px";
    var sizeQuotes = localStorage.getItem("sizeQuotes2")? 
        localStorage.getItem("sizeQuotes2"): "18px";
    setMsgs(sizeMsgs);
    setQuotes(sizeQuotes);
    setTitles(sizeTitles);
    
    script.text += plusQuotes.toString();
    script.text += minusQuotes.toString();
    script.text += plusTitles.toString();
    script.text += minusTitles.toString();
    script.text += plusMsgs.toString();
    script.text += minusMsgs.toString();
    script.text += setQuotes.toString();
    script.text += setTitles.toString();
    script.text += setMsgs.toString();
    script.text += getSize.toString();
    script.text += sizeMagic.toString();
    script.text += getNumber.toString();
    script.text += setTextSize.toString();
    script.text += setTextSizeOfChildren.toString();
    
    document.getElementsByTagName("body")[0].appendChild(script);
    var dst = document.getElementsByTagName("table")[10];
    
    holder.appendChild(btnMinusTitles);
    holder.appendChild(txtTitles);
    holder.appendChild(btnPlusTitles);
    
    holder.appendChild(btnMinusMsgs);
    holder.appendChild(txtMsgs);
    holder.appendChild(btnPlusMsgs);
    
    holder.appendChild(btnMinusQuotes);
    holder.appendChild(txtQuotes);
    holder.appendChild(btnPlusQuotes);
    
    dst.appendChild(holder);
})();