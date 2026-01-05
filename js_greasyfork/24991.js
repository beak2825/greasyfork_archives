// ==UserScript==
// @name            Functions
// @description     this is my biblothek for functions that I often use in my Userscripts
// ==/UserScript==
function copy(id) {
    var copy = document.getElementById(id);
    copy.contenteditable = true;
    copy.select();
    document.execCommand('copy');
}

function dom() {
    return new Element('html', 'style|width:100%;height:100%', '','|')
}

function popup(title ,text, param)
{
	var popup = window.open('about:blank', title, param || 'width=1000px;height=500px');
	popup.document.write(text);
	popup.focus();
};

function popupUrl(title, url, param){
	var popup = window.open(url, title, param)
};

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
};

function setCookie(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

function postToUrl(url, param, method){
    var method = method || 'POST',
        param = param.split(';');
        p = [],
        form = new Element('form', 'action|' + url + '|method|' + method, '', '|');
    for (var i = 0; i < param.length; i++) {
        p.push(param[i].split('=')[0]);
        p.push(param[i].split('=')[1]);
    }
    param = p;
    p = 1;
    delete p;
    for (var i = 0; i < param.length; i++) {
        form.appendChild(new Element('input', 'type|hidden|name|' + param[i] + '|value|' + param[i + 1], '', '|'));
        i++
    }
    document.body.appendChild(form);
    form.submit()
}

function postUrlToUrl(url, param, method){
    var method = method || 'POST',
        param = param.split(';');
        p = [],
        form = new Element('form', 'action|' + url + '|method|' + method, '', '|');
    for (var i = 0; i < param.length; i++) {
        p.push(param[i].split('|')[0]);
        p.push(param[i].split('|')[1]);
    }
    param = p;
    p = 1;
    delete p;
    for (var i = 0; i < param.length; i++) {
        form.appendChild(new Element('input', 'type|hidden|name|' + param[i] + '|value|' + param[i + 1], '', '|'));
        i++
    }
    document.body.appendChild(form);
    form.submit()
}

function postToPopup(url, param, method, popupParam){
    var method = method || 'POST',
        param = param.split(';');
        p = [],
        form = new Element('form', 'action|' + url + '|method|' + method, '', '|');
    for (var i = 0; i < param.length; i++) {
        p.push(param[i].split('=')[0]);
        p.push(param[i].split('=')[1]);
    }
    param = p;
    p = 1;
    delete p;
    for (var i = 0; i < param.length; i++) {
        form.appendChild(new Element('input', 'type|hidden|name|' + param[i] + '|value|' + param[i + 1], '', '|'));
        i++
    }
    var popup = window.open('about:blank', '', 'width=890,height=500,left=100');
    popup.document.body.appendChild(form);
    popup.document.forms[0].submit()
    popup.focus()
}

function Element(tag, attr, html, splitAt){
    var elem,
        attributes = (splitAt != undefined || splitAt != null || splitAt != '') ? (attr != undefined && attr != '') ? attr.split(splitAt) : '' : (attr != undefined && attr != '') ? attr.split(';') : '' ;
    if(tag == undefined || tag == ''){
        tag = 'div';
    }
    elem = document.createElement(tag)
    if(attributes != '' && attr != '' && attr != undefined){
        for(i = 0; i < attributes.length;){
            elem.setAttribute(attributes[i], attributes[i + 1]);
            i += 2
        }
    }
    elem.innerHTML = html;
    return elem
}

function select(objId) {
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(objId));
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(objId));
		window.getSelection().addRange(range);
	}
}

function scrollToPos(pos, speed) {
    var int = setInterval(function(){
        if(scrollY == pos){
            clearInterval(int)
        }else{
            if(Math.floor(scrollY) > Math.floor(pos)){
                scrollTo(scrollX, scrollY-1);
            }else{
                scrollTo(scrollX, scrollY+1);
            }
        }
    }, speed)
}

function login(lname, pwd){
    postToUrl('', 'lname=' + lname + ';pwd=' + pwd, ';POST')
}

function register(rname, pwd, data){
    postToUrl('', 'rname=' + rname + ';pwd=' + pwd + ';data=' + data)
}

function turnOut(elem, dir){
    var d = 1,
        dir = dir || 'X',
        int = setInterval(function(){rotate(elem)}, 1);
    function rotate(e){
        if(d >= 91){
            clearInterval(int)
        }else{
            e.style.transform = 'rotate' + dir + '(' + d + 'deg)'
            d++
        }
    }
    setTimeout(function(){
        elem.style.position = 'absolute'
    }, 800)
}

function turnIn(elem){
    elem.style.position = 'initial'
    if (elem.style.transform.charAt(6) == 'X') {
        elem.style.transform = 'rotateX(-90deg)'
    }else if (elem.style.transform.charAt(6) == 'Y') {
        elem.style.transform = 'rotateY(-90deg)';
    }
    var d = 1,
        int = setInterval(function(){rotate(elem)}, 1);
    function rotate(e){
        if(e.style.transform.charAt(6) == 'X'){
            if(d >= 361){
            clearInterval(int)
            }else{
                e.style.transform = 'rotateX(' + d + 'deg)'
                d++
            }
        }else if(e.style.transform.charAt(6) == 'Y'){
            if(d >= 361){
                clearInterval(int)
            }else{
                e.style.transform = 'rotateY(' + d + 'deg)'
            d++
            }
        }
    }
}

function help(id, help){
    $('#' + id).css('text-decoration: underline dotted')
    document.getElementById(id).addEventListener('mouseover', function(){
        document.getElementById(id).title = help
    })
    document.getElementById(id).addEventListener('mouseout', function(){
        document.getElementById(id).title = '';
    })
}

/*
Catch keypress
==============

window.addEventListener('keydown', function(event){
    if(event.keyCode == 'keyCode'){
        event.cancelBubble = true;
        event.returnValue = false;
    }
    return event.returnValue
})

OR

window.addEventListener('keydown', function(event){
    if (event.keyCode == 'keyCode'){
        //do something
    }
    event.preventDefault()
})
*/