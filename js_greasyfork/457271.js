// ==UserScript==
// @name         Enhanced data explorer text pad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds shift + enter, tab, shift + tab, ctrl+k/c, ctrl+k/u support to cosmos data explorer textarea.
// @author       You
// @match        https://cosmos.azure.com/explorer.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azure.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457271/Enhanced%20data%20explorer%20text%20pad.user.js
// @updateURL https://update.greasyfork.org/scripts/457271/Enhanced%20data%20explorer%20text%20pad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class LineCollection {
        constructor(multilineString) {
            let segments = multilineString.split(newLine);
            let lines = [];
            let startIndex = 0;
            let endIndex = 0;
            for(let i=0; i<segments.length; i++) {
                let segment = segments[i];
                endIndex = startIndex + segment.length;
                lines.push(new Line(segment, startIndex, endIndex, this)); //NOTE: new line character \n is not included in line..-=

                startIndex = endIndex + newLine.length;
            }
            this.lines = lines;
        }
        getLineByIndex(index){
            return this.lines.find(function(line){ return line.startIndex <= index && line.endIndex >= index; });
        }
        toString(addLineNumbers) {
            return this.lines.map(function(line, i){
                return addLineNumbers ?
                    `${i.toString().padStart(2, " ")}: ${line.value} [${line.startIndex.toString().padStart(3," ")}-${line.endIndex.toString().padEnd(3," ")}]` :
                    line.value;
            }).join(newLine);
        }
    }
    class Line {
        constructor(lineText, startIndex, endIndex, collection) {
            this.value = lineText;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.collection = collection;
        }
        isContainedBy(spanStart, spanEnd) {
            return this.startIndex >= spanStart && this.endIndex <= spanEnd;
        }
        isInterceptedBy(spanStart, spanEnd) {
            return (spanStart > this.startIndex && spanStart <= this.endIndex) ||
                (spanEnd >= this.startIndex && spanEnd < this.endIndex);
        }
        charsBeforeIndexMatchRegex(index, regex) {
            if(index < this.startIndex) throw new Error("Index must be >= startIndex.");
            if(index > this.endIndex) throw new Error("Index must be <= endIndex.");
            let piece = this.value.substring(0, index - this.startIndex);
            return piece.length ? piece.match(regex) : true;
        }
        insert(index, value) {
            if(index < this.startIndex) throw new Error("Index must be >= startIndex.");
            if(index > this.endIndex) throw new Error("Index must be <= endIndex.");
            if(this.collection) {
                let lineFound = false;
                for(let i=0; i< this.collection.lines.length; i++){
                    let line = this.collection.lines[i];
                    if(lineFound) {
                        line.startIndex += value.length;
                        line.endIndex += value.length;
                    }
                    else if(line == this) {
                        lineFound = true;
                        let piece1 = line.value.substring(0, index - line.startIndex);
                        let piece2 = line.value.substring(index - line.startIndex);
                        line.value = `${piece1}${value}${piece2}`;
                        line.endIndex += value.length;
                    }
                }
            }
            else throw new Error("Line is not part of a LineCollection. This can result in unexpected behavior.");
        }
        extract(index, length) {
            if(index < this.startIndex) throw new Error("Index must be >= startIndex.");
            if(index > this.endIndex) throw new Error("Index must be <= endIndex.");
            if(index + length > this.endIndex) throw new Error("Index + length must be <= endIndex.");
            if(this.collection) {
                let lineFound = false;
                for(let i=0; i< this.collection.lines.length; i++){
                    let line = this.collection.lines[i];
                    if(lineFound) {
                        line.startIndex -= length;
                        line.endIndex -= length;
                    }
                    else if(line == this) {
                        lineFound = true;
                        let piece1 = line.value.substring(0, index - this.startIndex);
                        let piece2 = line.value.substring((index - this.startIndex) + length);
                        line.value = `${piece1}${piece2}`;
                        line.endIndex -= length;
                    }
                }
            }
            else throw new Error("Line is not part of a LineCollection. This can result in unexpected behavior.");
        }
        substr(index, length) {
            if(index < this.startIndex) throw new Error("Index must be >= startIndex.");
            if(index > this.endIndex) throw new Error("Index must be <= endIndex.");
            if(index + length > this.endIndex) throw new Error("Index + length must be <= endIndex.");
            return this.value.substr(index - this.startIndex, length);
        }
    }

    let comment = "//";
    let newLine = "\n";
    let tab = "    ";
    let textarea = null;
    let previousKeyDownEvent = null;
    (function registerKeyDownHandler (){
        try{
            textarea = document.querySelector("textarea#input:not(.registered-keyDownHandler)");
        }catch(ex){}
        if(textarea) {
            console.log("found textarea..");
            textarea.classList.add("registered-keyDownHandler");
            textarea.addEventListener("keydown", keyDownHandler);
        }
        else setTimeout(registerKeyDownHandler, 50);
    })();

    function keyDownHandler(e){
        //printEvent(previousKeyDownEvent, e);
        let haultEvent = false;
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;
        let value = e.target.value;
        if(
            e.key == "Control" || //Ctrl
            e.keyCode == 75 && e.ctrlKey //Ctrl+K
        ) {
            haultEvent = true;
        }
        else if(e.keyCode == 8 && start == end) { //backspace and no selected text
            let lineStartIndex = indexOfLineStart(value, start);
            if(lineStartIndex > 0 && lineStartIndex < start){ //line starts with spaces
                haultEvent = true;
                let spaceCountToRemove = (start - lineStartIndex) % tab.length;
                if(spaceCountToRemove == 0) spaceCountToRemove = tab.length;
                let text = value.substring(0, start - spaceCountToRemove) + value.substring(end, value.length);
                setReactBoundElementValue(e.target, text);
                e.target.selectionStart = start + tab.length;
                e.target.selectionEnd = start + tab.length;
            }
        }
        else if(e.keyCode == 13 && e.shiftKey) { //Shft+Enter
            haultEvent = true;
            let text = value.substring(0, start) + newLine + value.substring(end, value.length);
            setReactBoundElementValue(e.target, text);
            e.target.selectionStart = start + newLine.length;
            e.target.selectionEnd = start + newLine.length;
        }
        else if(e.keyCode == 9 && !e.shiftKey) { // [Tab]
            haultEvent = true;
            if(start == end){
                let collection = new LineCollection(value);
                let line = collection.getLineByIndex(start);
                line.insert(start, tab)
                let text = collection.toString();
                setReactBoundElementValue(textarea, text);
                    textarea.selectionStart = start + tab.length;
                    textarea.selectionEnd = end + tab.length;
            }
            else tryAddLinePrefix(e.target, tab);
        }
        else if(e.keyCode == 9 && e.shiftKey) { // [Shft] + [Tab]
            haultEvent = true;
            if(start == end){
                let collection = new LineCollection(value);
                let line = collection.getLineByIndex(start);
                if(line.substr(start - tab.length, tab.length) == tab) { //chars preceding cursor index are tab
                    line.extract(start - tab.length, tab.length);
                    let text = collection.toString();
                    setReactBoundElementValue(textarea, text);
                    textarea.selectionStart = start - tab.length;
                    textarea.selectionEnd = end - tab.length;
                }
            }
            else tryRemoveLinePrefix(e.target, tab);
        }
        else if( //Ctrl+K -> Ctrl+C
            e.keyCode == 67 && e.ctrlKey && //Ctrl+C
            previousKeyDownEvent.keyCode == 75 && previousKeyDownEvent.ctrlKey //Ctrl+K
        ) {
            haultEvent = true;
            tryAddLinePrefix(e.target, comment);
        }
        else if( //Ctrl+K -> Ctrl+U
            e.keyCode == 85 && e.ctrlKey && //Ctrl+U
            previousKeyDownEvent.keyCode == 75 && previousKeyDownEvent.ctrlKey //Ctrl+K
        ) {
            haultEvent = true;
            tryRemoveLinePrefix(e.target, comment);
        }
        if(haultEvent){
            printEvent(previousKeyDownEvent, e);
            e.preventDefault();
            e.stopPropagation();
        }
        previousKeyDownEvent = e;
    }

    function tryAddLinePrefix(textarea, prefix){
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let value = textarea.value;
        let firstSelectedLine = true;
        let collection = new LineCollection(value);
        for(let i = 0; i<collection.lines.length; i++) {
            let line = collection.lines[i];
            let intercepted = line.isInterceptedBy(start, end);
            if(intercepted || line.isContainedBy(start, end)) {
                line.insert(line.startIndex, prefix);
                if(start == end || (intercepted && firstSelectedLine)) start += prefix.length;
                end += prefix.length;
                firstSelectedLine = false;
            }
        }
        let text = collection.toString();
        setReactBoundElementValue(textarea, text);
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
    }

    function tryRemoveLinePrefix(textarea, prefix){
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let value = textarea.value;
        let firstSelectedLine = true;
        let collection = new LineCollection(value);
        for(let i = 0; i<collection.lines.length; i++) {
            let line = collection.lines[i];
            let intercepted = line.isInterceptedBy(start, end);
            if(intercepted || line.isContainedBy(start, end)) {
                if(line.value.indexOf(prefix) == 0) { //starts with prefix characters e.g. //, <spaces>, etc
                    line.extract(line.startIndex, prefix.length);
                    if(start == end || (intercepted && firstSelectedLine)) start -= prefix.length;
                    end -= prefix.length;
                }
                firstSelectedLine = false;
            }
        }
        let text = collection.toString();
        setReactBoundElementValue(textarea, text);
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
    }

    //index of the begining of the line with the cursor (assuming only whitespace characters exist prior to the cursor), else -1
    function indexOfLineStart(line, selectionStartIndex){
        let preSelectionText = line.substring(0, selectionStartIndex);
        let lineStartIndex = preSelectionText.lastIndexOf(newLine);
        if(lineStartIndex < 0) lineStartIndex = 0;
        let lineStartText = preSelectionText.substring(lineStartIndex, preSelectionText.length);
        return lineStartText.match(/^ *$/g) ? lineStartIndex : -1
    }

    function setReactBoundElementValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function printEvent(/*params*/ events) {
        let sb = [];
        for(let i = 0; i < arguments.length; i++) {
            let e = arguments[i];
            if(e) {
                let ctrl = e.ctrlKey ? "Ctrl+" : "";
                let alt = e.altKey ? "Alt+" : "";
                let shift = e.shiftKey ? "Shft+": "";
                let char = e.key ?? e.keyCode;
                if(char == "Control") char = "..";
                sb.push(`${e.type}: ${ctrl}${alt}${shift}${char}`);
            }
            else sb.push(`event #${i} is null`);
        }
        console.log(sb.join(", "));
    }
})();