// ==UserScript==
// @name        AgarioUserFilter
// @author      TurboCheetah
// @include     http://agar.io/*
// @version     1.1
// @grant       none
// @namespace https://greasyfork.org/users/24429
// @description Lets you easily find teammates on crowded servers!
// @downloadURL https://update.greasyfork.org/scripts/16975/AgarioUserFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/16975/AgarioUserFilter.meta.js
// ==/UserScript==

window.launch = function() {
    var _htmlitem = document.createElement('div');
    _htmlitem.id='userfilter';
    document.body.appendChild(_htmlitem);
    var togglevisibility = false;
    var specialusers = ['Շŧ死', 'ȶς', '?火']; // use a comma seperated list ['item1', 'item2', 'item3']. if any name contains any of the items in this list, it will be highlighted yellow
    var enemies = ['ℕ₮CΔRTΣR', 'Dandy ✧', 'ƛ̲gar Queeη', 'Mr_Beard_Twitch', 'ℕℳ☯⦕ƤƘ⦖ƤŘØ✅ƤŁΔ¥', 'Walru$', 'ŦIÐES', 'ᔕ丅Σᗰ丅ᖇȎИ ']; // for red highlight
    var alphabet = {'a':'b', 'b':'c', 'c':'d', 'd':'e', 'e':'f', 'f':'g', 'g':'h', 'h':'i', 'i':'j', 'j':'k', 'k':'l', 'l':'m', 'm':'n', 'n':'o', 'o':'p', 'p':'q', 'q':'r', 'r':'s', 's':'t', 't':'u', 'u':'v', 'v':'w', 'w':'x', 'x':'y', 'y':'z', 'z':'a'};
    var filter = [];
    var exclusivefilter = [];
    filter.push(alphabet['e'] + alphabet['t'] + alphabet['b'] + alphabet['j']);
    filter.push(alphabet['r'] + alphabet['g'] + alphabet['h'] + alphabet['s']);
    filter.push(alphabet['r'] + alphabet['d'] + alphabet['w']);
    filter.push(alphabet['c'] + alphabet['z'] + alphabet['l'] + alphabet['m']);
    filter.push(alphabet['a'] + alphabet['n'] + alphabet['n'] + alphabet['a']);
    filter.push(alphabet['o'] + alphabet['d'] + alphabet['m'] + alphabet['h'] + alphabet['r']);
    filter.push(alphabet['o'] + alphabet['n'] + alphabet['n'] + alphabet['o']);
    filter.push(alphabet['r'] + alphabet['k'] + alphabet['t'] + alphabet['s']);
    filter.push(alphabet['c'] + alphabet['h'] + alphabet['b'] + alphabet['j']);
    filter.push(alphabet['a'] + alphabet['h'] + alphabet['s'] + alphabet['b'] + alphabet['g']);
    filter.push(alphabet['e'] + alphabet['z'] + alphabet['f']);
    filter.push(alphabet['f'] + alphabet['z'] + alphabet['x']);
    filter.push(alphabet['b'] + alphabet['n'] + alphabet['b'] + alphabet['j']);
    filter.push(alphabet['c'] + alphabet['t'] + alphabet['l'] + alphabet['a'] + alphabet['z'] + alphabet['r'] + alphabet['r']);
    filter.push(alphabet['m'] + alphabet['h'] + alphabet['f'] + alphabet['f']);
    filter.push(alphabet['s'] + alphabet['t'] + alphabet['q'] + alphabet['c']);
    filter.push(alphabet['s'] + alphabet['d'] + alphabet['r'] + alphabet['s'] + alphabet['h'] + alphabet['b'] + alphabet['k'] + alphabet['d']);
    filter.push(alphabet['b'] + alphabet['t'] + alphabet['m'] + alphabet['s']);
    filter.push(alphabet['e'] + alphabet['t'] + alphabet['p']);
    filter.push(alphabet['m'] + alphabet['h'] + alphabet['o'] + alphabet['o'] + alphabet['k'] + alphabet['d']);
    //filter.push('∩')
    exclusivefilter.push(['g', 'l', 'm', 'b', 'p']);
    exclusivefilter.push(alphabet['z'] + alphabet['r'] + alphabet['r']);
    exclusivefilter.push([]);
    exclusivefilter.push([]);
    exclusivefilter.push(alphabet['s'] + alphabet['h'] + alphabet['s']);
    exclusivefilter.push(['l']);
    exclusivefilter.push([]);
    exclusivefilter.push(alphabet['g'] + alphabet['d'] + alphabet['k'] + alphabet['k']);
    exclusivefilter.push(['o']);
    exclusivefilter.push([]);
    exclusivefilter.push(alphabet['a'] + alphabet['t'] + alphabet['s'] + alphabet['s']);
    exclusivefilter.push(['o']);

    var originalfill = CanvasRenderingContext2D.prototype.fill;

    var originaltextfill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(a, b, c){
        var result = censorpassed(a);
        drawtext('fill', result, arguments, this);
    };
    setInterval(function() {
        var lb = document.getElementById('lb_detail').children;
        for(var i = 0; i < lb.length; i++) {
            var txt = lb[i].innerHTML;
            var result = censorpassed(txt);
            if(result == 'special') {
                lb[i].style.color = '#00c4ff';
            }
            else if (result == 'enemy') {
                lb[i].style.color = 'red';
            }
            else if (result == 'false') {
                var s = '';
                var l = lb[i].innerHTML.length - lb[i].innerHTML.indexOf(' ') - 1;
                for(var k = 0; k<l; k++) {
                    s += '*';
                }
                lb[i].innerHTML = lb[i].innerHTML.substring(0, lb[i].innerHTML.indexOf(' ') + 1) + s;
            }
        }
        var cb = document.querySelectorAll('.sender, .msg, .toast_sender, .toast_chatmsg');
        for(var i = 0; i < cb.length; i++) {
            var txt = cb[i].innerHTML;
            var result = censorpassed(txt);
            if(result == 'special') {
                cb[i].style.color = '#00c4ff';
            }
            else if (result == 'enemy') {
                cb[i].style.color = 'red';
            }
            else if (result == 'false') {
                var l;
                var s = '';
                var s2 = '';
                if(cb[i].className.indexOf('sender') != -1 || cb[i].className.indexOf('toast_sender') != -1) {
                    l = cb[i].innerHTML.length - 2;
                    s2 = ' : ';
                }
                else {
                    l = cb[i].innerHTML.length;
                }
                for(var k = 0; k<l; k++) {
                    s += '*';
                }
                cb[i].innerHTML = s + s2;
            }
        }

    }, 16);
    var originaltextstroke = CanvasRenderingContext2D.prototype.strokeText;
    CanvasRenderingContext2D.prototype.strokeText = function(a, b, c){ 
        var result = censorpassed(a);
        drawtext('stroke', result, arguments, this);
    };
    function drawtext(strokeorfill, result, args, _this) {
        if(result == 'special') {
            special(strokeorfill, _this, args);
        }
        else if(result == 'enemy') {
            enemy(strokeorfill, _this, args);
        }
        else if (result == 'true') {
            passed(strokeorfill, _this, args);
        }
        else if (result == 'false') {
            censorfail(strokeorfill, _this, args);
        }
    }
    var censorpassed = function(txt) {
        if(txt && txt.toLowerCase) {
            for(var i = 0; i < filter.length; i++) {
                if(txt.toLowerCase().indexOf(filter[i]) != '-1') {
                    if(document.getElementById('opt_filter').checked) {
                        return 'false';
                    }
                }
            }
            for(var i = 0; i < exclusivefilter.length; i += 3) {
                var index = txt.toLowerCase().indexOf(exclusivefilter[i + 1]);
                if(index != -1) {
                    if (index == 0 || exclusivefilter[i].indexOf(txt.substring(index - 1, index)) == -1) {
                        if(txt.length < index + exclusivefilter[i + 1].length || exclusivefilter[i + 2].indexOf(txt.substring(index + exclusivefilter[i + 1].length, index + exclusivefilter[i + 1].length + 1)) == -1) {
                            if(document.getElementById('opt_filter').checked) {
                                return 'false';
                            }
                        }
                    }
                }
            }
            for(var i = 0; i < specialusers.length; i++) {
                if(txt.indexOf(specialusers[i]) != -1 || txt.toLowerCase().indexOf(specialusers[i]) != '-1') {
                    return 'special';
                }
            }
            for(var i = 0; i < enemies.length; i++) {
                if(txt.indexOf(enemies[i]) != -1 || txt.toLowerCase().indexOf(enemies[i]) != '-1') {
                    return 'enemy';
                }
            }
        }
        return 'true';
    };
    var special = function(fillorstroke, item, arguments_) {
        var args = Array.prototype.slice.call(arguments_);
        var old = item.font;
        item.strokeStyle = 'black';
        item.fillStyle = '#00c4ff';
        var size = item.font.substring(0, item.font.indexOf('p'));
        var text = args[0];
        if(fillorstroke == 'fill') {
            originaltextfill.apply(item, args);
        }
        else {
            originaltextstroke.apply(item, args);
        }
        item.font = old;
    };
    var enemy = function(fillorstroke, item, arguments_) {
        var args = Array.prototype.slice.call(arguments_);
        var old = item.font;
        item.strokeStyle = 'black';
        item.fillStyle = 'red';
        var size = item.font.substring(0, item.font.indexOf('p'));
        var text = args[0];
        if(fillorstroke == 'fill') {
            originaltextfill.apply(item, args);
        }
        else {
            originaltextstroke.apply(item, args);
        }
        item.font = old;
    };
    var passed = function(fillorstroke, item, arguments_) {
        var args = Array.prototype.slice.call(arguments_);
        if(fillorstroke == 'fill') {
            originaltextfill.apply(item, args);
        }
        else {
            originaltextstroke.apply(item, args);
        }
    };
    var censorfail = function(fillorstroke, item, arguments_) {
        var args = Array.prototype.slice.call(arguments_);
        var l = args[0].length;
        var s = '';
        if(!args[0].substring(0, 1).isNaN && !document.getElementById('lb_detail')) {
            if(args[0].substring(1, 3) == '. ') {
                s += args[0].substring(0, 3);
                l -= 3;
            }
            else if (args[0].substring(1, 4) == '0. ') {
                s += args[0].substring(0, 4);
                l -= 4;
            }
        }
        for(var i = 0; i<l; i++) {
            s += '*';
        }
        args[0] = s;

        if(fillorstroke == 'fill') {
            originaltextfill.apply(item, args);
        }
        else {
            originaltextstroke.apply(item, args);
        }
    };
};
setInterval(function() {
    if(!document.getElementById('userfilter')) { // filter names only on stream
        launch();
    }
    if(document.getElementById('opt_chatpopup') && !document.getElementById('opt_filter')) {
        var optfilt = document.createElement('DIV');
        optfilt.innerHTML = '<input id="opt_filter" type="checkbox" checked>Filter Names<br>';
        document.getElementById('options2').appendChild(optfilt);
    }
}, 100);