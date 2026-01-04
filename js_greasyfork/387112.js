// ==UserScript==
// @name         almost selector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  get element atts
// @author       longslee
// @match        http://portal.crmtest.sc.ctc.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387112/almost%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/387112/almost%20selector.meta.js
// ==/UserScript==
GM_addStyle ( `
    .class_lu {
        background-color: rgba(130, 180, 230, 0.5);
        box-sizing: border-box;
        outline: solid 1px #0F4D9A;
        cursor: default;
    }
` );

+function() {
    var stone_bl = 0;
    var border_on = false;
    function addBorder(e){
        if(border_on){
            e.target.classList.add('class_lu');
        }
    }
    function removeBorder(e){
        e.target.classList.remove('class_lu');
    }
    function clickBorder(e){
        if(e.target.children.length == 0){
            console.log('no children');
            console.log(e.target.innerText);
        }else{
            console.log('has children');
        }
        var lastTagName = localStorage.getItem('tagName');
        var lastAttrStr = localStorage.getItem('attrs');
        var lastAttr = lastAttrStr == 'null' ? '':JSON.parse(lastAttrStr)
        var tagName = e.target.tagName;
        var attributes = e.target.attributes;
        // start to compare
        var atts = {};
        for(var i=0;i<attributes.length;i++){
            atts[attributes[i].name] = attributes[i].nodeValue;
        }
        console.log(atts);
        var eql = true;
        if(tagName != lastTagName){
            eql = false;
        }

        if(lastAttr != null){
            for(var j in atts){
                if(atts[i] != lastAttr[j]){ // compare with last atts
                    eql = false;
                    break;
                }
            }
        }

        if(eql){
            console.log('equals');
        }else{
            console.log('not equals');
        }
        localStorage.setItem('tagName',tagName);
        var j_str = JSON.stringify(atts);
        localStorage.setItem('attrs',j_str);
        if(border_on){
            e.stopPropagation();
            e.preventDefault();
            //console.log(e);
            return false;
            //window.event.returnValue = false;
            //e.cancelable = true;
            //e.preventDefault();
        }
    }
    window.addEventListener('mousedown',clickBorder);
    window.addEventListener('mouseover',addBorder);
    window.addEventListener('mouseout',removeBorder);
    window.addEventListener('keydown',function(e){
        //console.log(e.which);
        stone_bl += e.which;
        //console.log(stone_bl);
        // if(e.which != 38){  // not start with up, zero it
        // stone_bl = 0;
        // }
        if(stone_bl == (38+38+40+40+37+39+37+39+66+65+66+65)){  // yes it is
            border_on = true;
            stone_bl = 0;
        }
        if(e.which == 27){ //esc
            border_on = false;
            stone_bl = 0;
        }
        // 38 40 37 39 66 65
    })
}();