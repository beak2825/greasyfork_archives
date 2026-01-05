// ==UserScript==
// @name         SSC Tagger
// @namespace    http://skyscrapercity.com/
// @version      0.1.2
// @description  Manage your tags on SSC
// @author       bad455
// @match        https://www.skyscrapercity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17473/SSC%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/17473/SSC%20Tagger.meta.js
// ==/UserScript==

'use strict';

if(window.top != window.self) {
    return;
}

const STORAGE_KEY = 'scctagger';

function htmlEntities(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

function Tagger() {
    this.load();
    this.harvest();
    this.draw();
    
    this.addEvents();
}

Tagger.prototype.addTag = function(tag) {
    this.load();
    
    if(this.tags.indexOf(tag) >= 0) return;
    
    this.tags.push(tag);
    this.tags.sort();
    
    this.save();
    this.drawLists();
}

Tagger.prototype.removeTag = function(tag) {
    if(this.tags.indexOf(tag) < 0) return;
    
    var index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
    
    this.save();
    this.drawLists();
}

Tagger.prototype.load = function() {
    this.tags = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

Tagger.prototype.save = function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tags));
}

Tagger.prototype.harvest = function() {
    var tags = document.querySelectorAll('#tag_list_cell [href^="tags.php?tag="]');
    var tmp = [];
    
    var n = tags.length;
    for(var i=0; i<n; i++) {
        var tag = tags[i].innerHTML;
        tmp.push(tag);
    }
    
    tmp.sort();
    
    this.harvested = tmp;
}

Tagger.prototype.draw = function() {
    this.addStyle();
    
    var root = this.root = document.createElement('div');
    root.id = 'tagger';
    document.body.appendChild(root);
    
    var myList = document.createElement('div');
    myList.classList.add('tagger-container');
    root.appendChild(myList);
    
    var button = document.createElement('a');
    button.classList.add('tagger-btn');
    button.innerHTML = '#';
    myList.appendChild(button);
    
    var list = this.myList = document.createElement('ul');
    list.classList.add('tagger-list', 'tagger-my');
    myList.appendChild(list);
    
    if(this.harvested.length) {
        var harvestedTags = document.createElement('div');
        harvestedTags.classList.add('tagger-container', 'tagger-adder');
        root.appendChild(harvestedTags);

        var harvestedButton = document.createElement('a');
        harvestedButton.classList.add('tagger-btn');
        harvestedButton.innerHTML = '+';
        harvestedTags.appendChild(harvestedButton);

        var harvestedList = this.harvestedList = document.createElement('ul');
        harvestedList.classList.add('tagger-list');
        harvestedTags.appendChild(harvestedList);
    }
    
    this.drawLists();
}

Tagger.prototype.drawLists = function() {
    this.myList.innerHTML = '';
    
    var n = this.tags.length;
    for(var i=0; i<n; i++) {
        var tag = (this.tags[i] + '').toString();
        this.myList.innerHTML += '<li><a href="tags.php?tag='+htmlEntities(tag).replace(/%20/g, '+')+'" class="tagger-link">'+tag+'</a><a class="tagger-remove" data-tag="'+tag+'">&times;</a></li>';
    }
    
    if(this.harvested.length) {
        this.harvestedList.innerHTML = '';
        
        var n = this.harvested.length;
        for(var i=0; i<n; i++) {
            var tag = (this.harvested[i] + '').toString();
            
            if(this.tags.indexOf(tag) < 0) {
                this.harvestedList.innerHTML += '<li><a class="tagger-add">'+tag+'</a></li>';
            }
        }
    }
}

Tagger.prototype.addStyle = function() {
    var css = 'body { position: relative; }';
    css += '#tagger { font-size: 12px; position: fixed; right: 5px; top: 5px; z-index: 999999; }';
    css += '#tagger a { cursor: pointer; display: block; text-decoration: none; white-space: nowrap; }';
    css += '#tagger .tagger-container { float: right; position: relative; }';
    css += '#tagger .tagger-adder { float: left; }';
    css += '#tagger .tagger-btn { background: #5482ab; color: white; display: block; padding: 0.25em 1em; }';
    css += '#tagger .tagger-adder .tagger-btn { background: #7ab800; }';
    css += '#tagger .tagger-list { background: #fff; border: 1px solid #ddd; display: none; list-style: none; margin: 0; max-height: calc(100vh - 40px); overflow-y: auto; padding: 0; position: absolute; right: 0; top: 100%; }';
    css += '#tagger .tagger-container:hover .tagger-list { display: block; }';
    css += '#tagger .tagger-list > li:nth-child(n+2) { border-top: 1px solid #ddd; }';
    css += '#tagger .tagger-my > li { padding-right: 2em; position: relative; }';
    css += '#tagger .tagger-list a { padding: 0.25em 1em; }';
    css += '#tagger a.tagger-remove { background: #ce1126; bottom: 0; color: #fff; padding: 0.25em; position: absolute; right: 0; top: 0; }';
    
    var style = document.createElement('style');
    
    style.type = 'text/css';
    if(style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    
    document.head.appendChild(style);
}

Tagger.prototype.addEvents = function() {
    var that = this;
    this.root.addEventListener('click', function(e) {
        if(e.target) {
            if(e.target.matches('a.tagger-add')) {
                that.addTag(e.target.innerHTML);
            }
            
            if(e.target.matches('a.tagger-remove')) {
                that.removeTag(e.target.getAttribute('data-tag'));
            }
        }
    });
    
    window.addEventListener('focus', function() {
        that.load();
        that.drawLists();
    });
}


new Tagger();
