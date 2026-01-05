// ==UserScript==
// @name         Video Framing Sliders - for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Gives new tools for youtbe playback
// @author       RGSoftware
// @include     *.youtube.*/watch?v=*
// @grant        none
// @runat        document-body
// @locale       en-us
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26453/Video%20Framing%20Sliders%20-%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/26453/Video%20Framing%20Sliders%20-%20for%20YouTube.meta.js
// ==/UserScript==

/*
.:Notes:.
I didn't want to use Jquery, but then I did a little. But too lazy to rewrite the vanilla javascript in jquery
*/

tools = {

    createElement: function(parent, id, eletype, value, style, className, textClassName, onclickFunc){

        parent                  = document.getElementById(parent);
        var e                   = document.createElement(eletype);
        e.className             = className;
        e.onclick               = onclickFunc === null ? '' : onclickFunc;
        parent.appendChild(e);
        var label               = document.createElement('span');
        label.innerHTML         = value;
        label.className         = textClassName;

        e.setAttribute('style', style);
        e.appendChild(label);

        return e; // return handle
    },

    toggle: false,
    toggleTools : function(motherEle, toolsDiv){

        tools.toggle = !tools.toggle;
        /*
        var x = document.getElementById(e);
        var z = document.getElementById(toolsDiv);
        */
        var animSpeed = 500;
        var e = $("#"+toolsDiv);

        if (tools.toggle){

            e.animate({height: "150px"}, animSpeed);
            /*
             $("#"+motherEle).animate({minHeight: "300px"}, animSpeed);
             x.setAttribute("style", "min-height:300px");
             z.style.height = "150px";
            */
        }else{
            e.animate({height: "0px"}, animSpeed);
            /*
            $("#"+motherEle).animate({minHeight: "150px"}, animSpeed);
            z.style.height = "0px"
            x.setAttribute("style", "min-height:150px");
            */

        }
    },
    createElementAlt : function(elementType, data, type, className, style, id, parent){

        var e  = document.createElement(elementType);
        parent = document.getElementById(parent);

        switch (elementType.toUpperCase()){

            case "INPUT":

                e.setAttribute('type', type);
                e.value     = data;
                break;

            case "BUTTON":

                e.value     = data;
                break;

            case "SPAN":

                e.innerHTML = data;
                break;
        }

        e.id        = id;
        e.innerHTML = data;
        e.value     = data;
        e.className = className;
        e.setAttribute('style', style);
        parent.appendChild(e);

    },
};

/*Some constants, infos*/
var youtube = {
    btnStyle1 : 'yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay action-panel-trigger action-panel-trigger-share   yt-uix-tooltip',
    btnStyle2 : 'yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-trigger yt-uix-tooltip',
};


/* Main elements creation */

//div
tools.createElementAlt("div", '', '', '', 'height:0px; overflow:hidden;', 'myDiv', 'watch-header'); //watch8-secondary-actions //height:153px; width:843px;
var toolsDiv = document.getElementById('myDiv');

var toggleToolsBtn = tools.createElement("watch8-secondary-actions", "myBtn", "button", "Show Tools", "", youtube.btnStyle1, "t-uix-button-content", null);
toggleToolsBtn.onclick = function(){tools.toggleTools('watch-header','myDiv');};
/*
item 1 - label
tools.createElementAlt('span', 'Scale X', '', '', '', 'scaleXSliderLabel', 'myDiv');
item 1 - Scale X Slider
tools.createElementAlt('input', '1', 'range', '', '', 'scaleXSlider', 'myDiv');
item 2 - label
tools.createElementAlt('span', 'Scale Y', '', '', '', 'scaleYSliderLabel', 'myDiv');
item 2 - Scale Y Slider
tools.createElementAlt('input', '1', 'range', '', '', 'scaleYSlider', 'myDiv');
item 3 - lock Scale checkbox
tools.createElementAlt('input', '', 'checkbox', '', '', 'lockScaleCheckbox', 'myDiv');
item 3 - lock Scale checkbox label
tools.createElementAlt('label', 'Lock Scale X+Y', '', '', '', 'LabelForCheckbox', 'myDiv');
*/

function ElementWithLabel(elementType, text, type, className, style, id, parent){

    this.elementType  = elementType;
    this.text         = text;
    this.type         = type;
    this.className    = className;
    this.style        = style;
    this.elementId    = id;
    this.labelId      = id+'-container';
    this.parent       = parent;
    //create elements first!
    tools.createElementAlt('span', this.text, '', '', '', this.labelId, this.parent); //LABEL WRAP
    tools.createElementAlt(this.elementType, '', this.type, this.className, this.style, this.elementId, this.labelId); //CHECKBOX
    //now you can return the element 'handle'
    this.labelElement = document.getElementById(this.labelId);
    this.element      = document.getElementById(this.elementId);

}

function slider(labeltext, id, parent, min, max, step, startValue){

    this.id               = id;
    this.parent           = parent;
    this.labeltext        = labeltext;
    this.min              = min;
    this.max              = max;
    this.step             = step;
    this.startValue       = startValue;
    this.create           = createSlider(this.labeltext, this.id, this.parent, this.startValue);
    this.setDefaults      = setDefaults(this.id, this.min, this.max, this.step);
    this.element          = document.getElementById(this.id);
    this.getPercentLabel  = this.id + "Percent";
    this.percentage       = this.element.value + "%";
    this.updateLabel      = function(){sliderSeeked(this.getPercentLabel, this.id);};
    // this.resetValue       = function(){resetValue(this.id);};

    this.element.ondblclick = function(){
        resetValue(this.id, startValue);
    };
    // setDefaults(this.id, -5, 5, 0.01);
}


function createSlider(labeltext, id, parent, startVal){

    var cstyle = "position:relative; top:-6px; padding:5px;"; //middle align top:-11px;
    var contParent = id+"-container";
    tools.createElementAlt('div', '', '','', 'border: 1px solid black;', contParent, parent);                       //Container
    tools.createElementAlt('span', labeltext, '', '', cstyle, id+"label", contParent);                              //Label
    tools.createElementAlt('input', startVal, 'range', '', 'width:150px;', id, contParent);                         //Slider
    tools.createElementAlt('span', startVal+"%", '', '', cstyle, id+"Percent", contParent);                         //PercentLabel
}

function sliderSeeked(percentlbl, sliderEle){

    var slider = document.getElementById(sliderEle);
    var sVal = parseFloat(slider.value).toFixed(2);
    document.getElementById(percentlbl).innerHTML = + sVal + "%"; 
}

function resetValue(e, startVal){
    var slider = document.getElementById(e);
    slider.value = startVal;   
}

function setDefaults(e, min, max, step){
    var x  = document.getElementById(e);
    x.max  = max;
    x.min  = min;
    x.step = step;
}

//slider(labeltext, id, parent)
var sliderX = new slider("Scale X", "scaleXSlider", "myDiv", -5, 5, 0.01, 1);
sliderX.element.onmousemove = function(){
    var sVal = parseFloat(sliderX.element.value).toFixed(2);
    sliderX.updateLabel();
    video.scaleX(sVal);

    if (lockScaleCheckbox.element.checked === true){
        video.scaleY(sVal);
        sliderY.element.value = sVal; 
        sliderY.updateLabel();
    }
};

var sliderY = new slider("Scale Y", "scaleYSlider", "myDiv", -5, 5, 0.01, 1);
sliderY.element.onmousemove = function(){
    var sVal = parseFloat(sliderY.element.value).toFixed(2);
    sliderY.updateLabel();
    video.scaleY(sVal);

    if (lockScaleCheckbox.element.checked === true){
        video.scaleX(sVal);
        sliderX.element.value = sVal;
        sliderX.updateLabel();
    }
};

//function ElementWithLabel(elementType, text, type, className, style, id, parent){
var lockScaleCheckbox = new ElementWithLabel('input', 'Lock Scale', 'checkbox', '','', 'scaleLock-checkbox', 'myDiv');

//if (lockScaleCheckbox.element.checked === true){
//  video.scaleY(sVal); sliderY.element.value = sVal; sliderY.updateLabel(); //LOCKED TEST ONLY
//}

//tools.createCheckboxWithLabel('input', 'lock scale', 'checkbox', '', '', 'scaleLock-checkbox', 'myDiv');


var sliderTranslateX = new slider("Translate X", "translateXSlider", "myDiv", -1000, 1000, 1, 0);
sliderTranslateX.element.onmousemove = function(){
    var sVal = parseFloat(sliderTranslateX.element.value).toFixed(2);
    sliderTranslateX.updateLabel();
    video.translateX(sVal);
};

var sliderTranslateY = new slider("Translate Y", "translateYSlider", "myDiv", -1000, 1000, 1, 0);
sliderTranslateY.element.onmousemove = function(){
    var sVal = parseFloat(sliderTranslateY.element.value).toFixed(2);
    sliderTranslateY.updateLabel();
    video.translateY(sVal);
};


//matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY()):
var video = {
    g_scaleX: 1,
    g_scaleY: 1,
    g_skewX: 0,
    g_skewY: 0,
    g_translateX: 0,
    g_translateY: 0,

    matrix2d: function(){
        var vid = document.getElementsByClassName(video.className)[0];
        vid.setAttribute('style', 'transform:matrix(' + this.g_scaleX +
                         "," + this.g_skewY + 
                         "," + this.g_skewX + 
                         "," + this.g_scaleY + 
                         "," + this.g_translateX + 
                         "," + this.g_translateY + ')');
    },

    className: 'html5-video-container',

    scaleX : function(_scaleX){
        this.g_scaleX = _scaleX;
        video.matrix2d();
    },

    scaleY : function(_scaleY){
        this.g_scaleY = _scaleY;
        video.matrix2d();
    },

    translateX : function(_translateX){
        this.g_translateX = _translateX;
        video.matrix2d();
    },
    translateY : function(_translateY){
        this.g_translateY = _translateY;
        video.matrix2d();
    },
};


//var lfchkbx = document.getElementById('LabelForCheckbox');
//lfchkbx.setAttribute('for', 'lockScaleCheckbox');

//var scaleChkbx = document.getElementById('lockScaleCheckbox');
//scaleChkbx.checked = true;