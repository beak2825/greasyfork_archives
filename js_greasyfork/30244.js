// ==UserScript==
// @name         SAMU Tools
// @namespace    http://atollgroup.eu/
// @version      1.15
// @description  Tools for SAMU debug and development
// @author       CA
// @match        *://*/samu*/*specialreport*
// @include      *://*/samu*/*index*
// @include      *://*/eam*/*index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30244/SAMU%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/30244/SAMU%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (top.reread) return;
    var frames = document.querySelectorAll("iframe");
    setInterval(addEvent,4000);
    enhanceOra();
    function enhanceOra(){
        var removeButton = document.createElement('button');
        removeButton.addEventListener('click',removeOra);
        removeButton.innerText = 'Remove';
        removeButton.style.position = 'fixed';
        removeButton.style.top = '50%';
        removeButton.style.left = '50%';
        removeButton.style.transform = 'translate(-50%, 40px)';
        removeButton.className ="btn btn-default";
        var setter = setInterval(function(){
            if (top.activity) {
                top.activity[0].appendChild(removeButton);
                console.log('Enhanced!');
                clearInterval(setter);
                setter = null;
            }
        },100);
    }
    function removeOra(){
        var warning = "Removed:"+ora+"!";
        while (ora > 0) {
            ora_csokkent();
        }
        console.log(warning);
        if (removeCounter) {
            removeCounter.innerText = warning;
        }
    }
    function addEvent(){
    	for (var i = 0; i < frames.length; i++) {
            var bod = frames[i].contentDocument.body;
            if (bod && !bod.onclick) bod.onclick = getBody;
        }
    }
    function selectText(node,copy) {
        var range;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(node);
            window.getSelection().empty();
            window.getSelection().addRange(range);
        }
        if (copy) {
            document.execCommand('copy');
            window.getSelection().empty();
        }
    }
    function getId(target){
        if (target.id) {
            if (!removeCounter) {
                console.log(target.id);
                return;
            }
            var currText = removeCounter.innerText;
            var regexp = new RegExp(/\w{8}-\w+-\w+-\w+-\w{12}/);
            var newValue = regexp.exec(target.id);
            removeCounter.innerText = newValue[0];
            selectText(removeCounter,true);
            setTimeout(function(){
                removeCounter.innerText = '';
            },2000);
        } else if (target.parentNode){
            getId(target.parentNode);
        }
    }
    function getBody(e){
        if (e.shiftKey) selectCheckboxes(e.currentTarget.ownerDocument.defaultView.name);
        if (e.ctrlKey && e.target.value) addXsltAndStoreValue(e.target);
        else if (e.ctrlKey) getId(e.target);
    }
    function addXsltAndStoreValue(tgt){
        var xslt = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\n'+
            '    <xsl:template match="/">\n'+
            '        <xsl:copy-of select="."/>\n'+
            '    </xsl:template>\n'+
            '</xsl:stylesheet>';
        //tgt.select();
        //document.execCommand("copy");
        if (tgt.value == xslt){
            tgt.value = localStorage.getItem('xslt');
        } else {
            localStorage.setItem('xslt',tgt.value);
            tgt.value = xslt;
        }
    }
    function selectCheckboxes(id){
        var r2 = document.getElementById(id);
        if (!r2) return;
        var doc = r2.contentWindow.document;
        if (!doc) return;
        if (doc.body.querySelectorAll) {
            var boxes = doc.body.querySelectorAll('[type*=checkbox]');
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].checked = true;
            }
        }else {
            for (var elem in doc.getElementsByTagName('input')){
                if(doc.getElementById(elem)) {
                    doc.getElementById(elem).checked = true;
                }
            }
        }
    }
    function addRemoveCounter(){
        var removeCounter = document.createElement("div");
        removeCounter.style.minWidth = "40px";
        removeCounter.style.height = "40px";
        removeCounter.style.pointerEvents = "none";
        removeCounter.style.position = "fixed";
        removeCounter.style.top = 0;
        removeCounter.style.color = "red";
        document.body.appendChild(removeCounter);
        return removeCounter;
    }
    var removeCounter = addRemoveCounter();
    function reread(){
        top.tolt('default', 'Admin', 'ConfigurationReRead', '', '', 0, false);
    }
    window.reread = reread;
    function sql(){
        top.tolt('default', 'Admin', 'SQLCompile', '', '', 2, false);
    }
    window.sql = reread;
})();