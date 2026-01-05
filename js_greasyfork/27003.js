// ==UserScript==
// @name         Cda Speed Slider
// @version      0.1.2
// @namespace    http://lukaszmical.pl/
// @description  Cda.pl Speed Slider
// @author       Łukasz
// @include      https://www.cda.pl/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27003/Cda%20Speed%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/27003/Cda%20Speed%20Slider.meta.js
// ==/UserScript==

var cda = {};
cda.el ={};

cda.init = function () {
    var menu_item =  cda.$('.pb-menu');
    if(menu_item){
        cda.el.menu = menu_item.lastChild;
        cda.el.player = cda.$('video');
        cda.menu();
    }
    else {
        setTimeout(cda.init, 1000);
    }
};

cda.menu = function () {
    var li = cda.$.new('li',{attr:{"item" : "6"}, style:{"background":"#F9F9F9"}});

    var box = cda.$.new('div');

    var initSpeed = cda.initSpeed();

    box.appendChild(cda.check(cda.data('cda_r')));
    box.appendChild(cda.slider(initSpeed));
    box.appendChild(cda.label(initSpeed));

    li.appendChild(box);

    cda.el.menu.appendChild(li);
    cda.duration(initSpeed);
};




cda.initSpeed = function () {
    if(cda.data('cda_r') && cda.data('cda_s')){
        return cda.data('cda_s');
    }
    return 1;
};

cda.check = function (isCheck) {
    var check = cda.$.new('input', {
        'type': 'checkbox',
        title: 'Remember Speed',
        style:{
            height: '20px',
            margin: '8px',
            width: '20px'
        },
        onchange: cda.remember
    });
    if(isCheck){
        cda.$.attr(check, 'checked', 'checked');
    }
    return check;

};
cda.label = function () {
    cda.el.label =  cda.$.new('div', {
        style:{
            height: '35px',
            width: '30px',
            float: 'right',
            color: "#000",
            'text-align': 'center',
            'margin-left': '5px',
            'font-size': '16px',
            'line-height': '35px'
        }
    });
    return cda.el.label;
};

cda.slider = function (initSpeed) {
    return cda.$.new('input', {
        'type': 'range',
        'min': 0.5,
        'max': 4,
        'step': 0.1,
        'value': initSpeed,
        style:{
            'width': '100px'
        },
        onchange : cda.change,
        oninput: cda.move,
        onwheel:cda.onwheel
    });
};


cda.move = function (event) {
    cda.updateLabel(event.target.value);
};

cda.onwheel = function (event) {
    var val = parseFloat(event.target.value) + (event.wheelDelta > 0 ? 0.1 : -0.1);
    val = val < 0.5 ? 0.5 : (val > 4 ? 4 : val);
    if(event.target.value != val){
        event.target.value = val;
        cda.duration(val);
    }
    return false;
};

cda.remember = function (event) {
    cda.data('cda_r', event.target.checked ? 1 :0);
};

cda.change = function (event) {
    cda.duration(event.target.value);
};


cda.duration = function(value){
    cda.updateLabel(value);
    cda.data('cda_s', value);
    cda.el.player.playbackRate = value;
};

cda.updateLabel = function(value){
    cda.el.label.innerHTML = parseFloat(value).toFixed(1);
};



cda.$ = function (tselector, all) {
    all = all || false;
    var type = tselector.substring(0, 1);
    var selector = tselector.substring(1);
    var elements;
    if (type == "#")return document.getElementById(selector);
    else if (type == ".") elements = document.getElementsByClassName(selector);
    else elements = document.querySelectorAll(tselector);
    if (all) return elements;
    else return elements.length ? elements[0] : null;
};

cda.$.new = function (tag, option) {
    var element = document.createElement(tag);
    for (var param in option) {
        if(param == 'data' || param == 'style'|| param == 'attr'){
            for(var data in option[param]){
                cda.$[param](element, data, option[param][data]);
            }
        }
        else{
            element[param] = option[param];
        }
    }
    return element;
};


cda.$.data = function (elem, key, val) {
    key = key.replace(/-(\w)/gi, function(x){return x.charAt(1).toUpperCase()});
    if(typeof val !== 'undefined'){
        elem.dataset[key] = val;
    }
    return elem.dataset[key];
};

cda.$.style = function (elem, key, val, priority) {
    priority = priority || '';
    if(typeof val !== 'undefined'){
        elem.style.setProperty(key, val, priority);
    }
    return elem.style.getPropertyValue(key);
};

cda.$.attr = function (elem, key, val) {
    if(typeof val !== 'undefined'){
        elem.setAttribute(key, val);
    }
    return elem.getAttribute(key);
};


cda.data = function (key, val) {
    if(typeof val !== 'undefined'){
        localStorage.setItem(key, val);
    }
    return localStorage.getItem(key);
};


cda.addCss = function(styles){
    var css = '';
    for(var elem in styles){
        css += elem + "{";
        var props = styles[elem];
        for(var prop in props){
            css += prop + ":" + props[prop] + ";";
        }
        css += "}";
    }
    var sheet = document.createElement('style');
    sheet.innerHTML = css;
    document.body.appendChild(sheet);
};

cda.init();
