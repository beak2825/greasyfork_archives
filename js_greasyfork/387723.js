// ==UserScript==
// @name         cursors.io hack 
// @namespace    VNXS
// @version      1.4.1
// @description  cursorsio hack - vnx and new hack in description
// @author       VNXS
// @match        http://cursors.io/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387723/cursorsio%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/387723/cursorsio%20hack.meta.js
// ==/UserScript==
 
var cps=100,
    spamClicking = !1;
function init(view, value, attr) {
    function Class() {
        attr.x = view.getUint16(value, true);
        value += 2;
        attr.y = view.getUint16(value, true);
        value += 2;
        attr.width = view.getUint16(value, true);
        value += 2;
        attr.height = view.getUint16(value, true);
        value += 2;
    }
 
    function done() {
        var color = view.getUint32(value, true).toString(16);
        for (; 6 > color.length;) {
            color = "0" + color;
        }
        value += 4;
        attr.color = "#" + color;
    }
    var name = view.getUint8(value);
    value += 1;
    attr.type = name;
    switch (name) {
        case 255:
            break;
        case 0:
            attr.x = view.getUint16(value, true);
            value += 2;
            attr.y = view.getUint16(value, true);
            value += 2;
            attr.size = view.getUint8(value);
            value += 1;
            attr.isCentered = !!view.getUint8(value);
            value += 1;
            name = read(view, value);
            attr.text = name[0];
            value = name[1];
            break;
        case 1:
            Class();
            var py = !attr.color;
            done();
            break;
            name = attr.x | 0;
            var y = attr.y | 0;
            var version = attr.width | 0;
            var h = attr.height | 0;
            if (py) {
                py = y;
                for (; py < y + h; ++py) {
                    var info = name;
                    for (; info < name + version; ++info) {
                        ++tmp[info + 400 * py];
                    }
                }
            }
            break;
        case 2:
            Class();
            attr.isBad = !!view.getUint8(value);
            value += 1;
            break;
        case 3:
            Class();
            attr.count = view.getUint16(value, true);
            value += 2;
            done();
            break;
        case 4:
            Class();
            attr.count = view.getUint16(value, true);
            value += 2;
            done();
            break;
        default:
            throw Error("Unknown object type " + name);;
    }
    return value;
}
 
function read(view, offset) {
    var optsData = "";
    var lo = 0;
    var chunk = 0;
    for (; 0 != (chunk = view.getUint8(offset)); ++offset) {
        lo <<= 8;
        lo |= chunk;
        if (!(chunk & 128)) {
            optsData += String.fromCharCode(lo);
            lo = 0;
        }
    }
    if (0 != lo) {
        optsData += String.fromCharCode(lo);
    }
    return [optsData, offset + 1];
}
 
function proc(data) {
    var view = new DataView(data.buffer),
        v, index, parts, x;
    if (view.getUint8(0) == 1) {
        var push = function(view, element) {
            return element + 2 + 4 * view.getUint16(element, true)
        };
        index = view.getUint16(1, true);
        index = push(view, 3 + 8 * index);
        v = view.getUint16(index, true);
        index += 2;
        parts = 0;
        for (; parts < v; parts++) {
            x = view.getUint32(index, true);
            item = 0;
            a: for (; item < items.length; item++) {
                if (items[item].id == x) {
                    items.splice(item, 1);
                    break a;
                }
            }
            index += 4;
        }
        v = view.getUint16(index, true);
        index += 2;
        parts = 0;
        for (; parts < v; parts++) {
            a: {
                item = view.getUint32(index, true);x = 0;
                for (; x < items.length; x++) {
                    if (items[x].id == item) {
                        item = items[x];
                        break a;
                    }
                }
                item = {
                    id: item
                };items.push(item);
            }
            index += 4;index = init(view, index, item);
        }
        return;
    }
    items = [];
    head = [view.getUint16(1, true), view.getUint16(3, true)];
    v = view.getUint16(5, true);
    index = 7;
    parts = 0;
    for (; parts < v; parts++) {
        item = {};
        item.id = view.getUint32(index, true);
        index += 4;
        index = init(view, index, item);
        if (item.x > 0) item.x--, item.width++;
        if (item.y > 0) item.y--, item.height++;
        if (item.x + item.width < 400) item.width++;
        if (item.y + item.height < 300) item.height++;
        items.push(item);
    }
}
 
var avoidGreenArea = false
function dos(head) { // Pathfinder
    var gridX = 400,
        gridY = 300;
    var grid = [];
    visit = [];
    for (var i = 0; i < gridY; i++) {
        grid[i] = [];
        visit[i] = [];
        for (var j = 0; j < gridX; j++) grid[i][j] = 0, visit[i][j] = 0;
    }
    items.forEach(function(d) {
        if ((d.type == 1) || (d.type == 2 && (d.isBad || avoidGreenArea)))
            for (var j = 0; j < d.height; j++) {
                if (d.y+j<=299) for (var i = 0; i < d.width; i++) {
                    if (d.x+i<=399) grid[d.y + j][d.x + i] = 3
                }
            }
    });
    var bfs = [head],
        bfs2 = [];
    while (bfs.length) {
        bfs.forEach(function(dat) {
            var x = dat[0],
                y = dat[1];
            if (grid[y][x] == 3) return;
            grid[y][x] = 3;
            for (var X = x + 1; X < gridX && !(grid[y][X] & 1); X++) {
                grid[y][X] |= 1;
                if (!visit[y][X]) {
                    visit[y][X] = [x, y], bfs2.push([X, y]);
                }
            }
            for (var X = x - 1; X >= 0 && !(grid[y][X] & 1); X--) {
                grid[y][X] |= 1;
                if (!visit[y][X]) {
                    visit[y][X] = [x, y], bfs2.push([X, y]);
                }
            }
            for (var Y = y + 1; Y < gridY && !(grid[Y][x] & 2); Y++) {
                grid[Y][x] |= 2;
                if (!visit[Y][x]) {
                    visit[Y][x] = [x, y], bfs2.push([x, Y]);
                }
            }
            for (var Y = y - 1; Y >= 0 && !(grid[Y][x] & 2); Y--) {
                grid[Y][x] |= 2;
                if (!visit[Y][x]) {
                    visit[Y][x] = [x, y], bfs2.push([x, Y]);
                }
            }
        });
        bfs = bfs2;
        bfs2 = [];
    }
}
var tmp = WebSocket.prototype.send;
WebSocket.prototype.send = function(x) {
    WebSocket.prototype.send = tmp;
    tmp = this;
    this.send = function() {};
    var t2 = this.onmessage;
    this.onmessage = function(x) {
        var msg = new Uint8Array(x.data);
        if (msg[0] == 1 || msg[0] == 4) {
            proc(msg);
        }
        return t2.call(this, x)
    }
}
var ff = navigator.userAgent.indexOf("Chrome") == -1;
var num_1 = prompt('1/2 WebSocket Location (where to connect. only change if you know what you\'re doing)', 'ws://104.248.73.48:2828'),
    num_2 = 0,
    num_3 = 1 * prompt('2/2 WebSocket Total (how many bots. only change if you know what you\'re doing.', 2);
console.log(num_1);
var pool = [],
    cursors = [];
if (!isNaN(parseInt(num_3))) {
    alert('Result: Valid WebSocket total. Connecting bots...');
} else alert('Result: Invalid WebSocket total.');
if (!isNaN(parseInt(num_3))) {
    for (var i = 0; i < num_3; i++) {
        pool.push(new WebSocket(`${num_1}`)); // websocket
    }
    pool[num_3-1].onopen = function(x){alert('Result: All bots have been successfully connected.')};
}
var position = [];
canvas.onclick = function(e) {
    var xy = [(e.layerX - (ff ? canvas.offsetLeft : 0)) / 2 | 0, (e.layerY - (ff ? canvas.offsetTop : 0)) / 2 | 0];
    position = [(e.layerX - (ff ? canvas.offsetLeft : 0)) / 2 | 0, (e.layerY - (ff ? canvas.offsetTop : 0)) / 2 | 0];
    var mov = [];
    if (e.altKey) {
        if (cursors.length < 1) return;
        for (ii=0;ii<cursors.length;ii++) {
            pool.push(cursors.shift());
        }
       return;
    }
    if (window["items"] && !(xy[0] == head[0] && xy[1] == head[1]) && !e.ctrlKey) {
        dos(head);
        var xy2 = xy.slice(0);
        while (visit[xy2[1]][xy2[0]]) {
            mov.push(xy2);
            xy2 = visit[xy2[1]][xy2[0]]
        }
        mov = mov.reverse();
    } else mov.push(xy);
    if (mov.length == 0) {
        return;
    }
    if (!e.shiftKey) {
        head = xy;
        pool.forEach(function(x) {
            move(x, mov)
        });
        move(tmp, mov);
        var buf = new ArrayBuffer(9),
            q = new DataView(buf);
        q.setUint8(0, 2, 1);
        q.setUint16(1, xy[0], 1);
        q.setUint16(3, xy[1], 1);
        q.setInt32(5, -1, 1);
        return;
    }
    var buf = new ArrayBuffer(9),
        q = new DataView(buf);
    q.setUint8(0, 2, 1);
    q.setUint16(1, xy[0], 1);
    q.setUint16(3, xy[1], 1);
    q.setInt32(5, -1, 1);
    cursors.push(pool.pop());
    cursors[cursors.length - 1].click = buf;
    move(cursors[cursors.length - 1], mov);
}
 
var fontSize = 2;
var letterOffset = 0;
var alphabet = new Array(200);
var mainCursorWriting = true;
var botWriting = true;
var fontType = 'basic';
alphabet[58]=[[0,0,0,1],[2,0,2,1]],alphabet[40]=[[0,2,1,0],[2,2,1,0]],alphabet[41]=[[0,0,1,2],[2,0,1,2]],alphabet[63]=[[1,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,1],[1,1,2,1]],alphabet[97]=[[2,0,0,0],[0,0,0,2],[0,2,2,2],[1,0,1,2]],alphabet[98]=[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0],[1,0,1,2]],alphabet[99]=[[2,2,2,0],[2,0,0,0],[0,0,0,2]],alphabet[100]=[[2,0,0,0],[0,0,0,1],[0,1,1,2],[1,2,2,1],[2,1,2,0]],alphabet[101]=[[2,2,2,0],[2,0,0,0],[0,0,0,2],[1,0,1,2]],alphabet[102]=[[2,0,0,0],[0,0,0,2],[1,0,1,2]],alphabet[103]=[[1,1,1,2],[1,2,2,2],[2,2,2,0],[2,0,0,0],[0,0,0,2]],alphabet[104]=[[0,0,2,0],[0,2,2,2],[1,0,1,2]],alphabet[105]=[[0,0,0,2],[0,1,2,1],[2,0,2,2]],alphabet[106]=[[0,0,0,2],[0,1,2,1],[2,0,2,1]],alphabet[107]=[[0,0,2,0],[1,0,0,2],[1,0,2,2]],alphabet[108]=[[0,0,2,0],[2,0,2,2]],alphabet[109]=[[0,0,2,0],[0,0,2,1],[2,1,0,2],[0,2,2,2]],alphabet[110]=[[0,0,2,0],[0,0,2,2],[0,2,2,2]],alphabet[111]=[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0]],alphabet[112]=[[2,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,0]],alphabet[113]=[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0],[1,1,2,2]],alphabet[114]=[[2,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,0],[1,1,2,2]],alphabet[115]=[[0,0,0,2],[1,0,1,2],[2,0,2,2],[0,0,1,0],[1,2,2,2]],alphabet[116]=[[0,0,0,2],[0,1,2,1]],alphabet[117]=[[0,0,2,0],[0,2,2,2],[2,0,2,2]],alphabet[118]=[[0,0,2,1],[0,2,2,1]],alphabet[119]=[[0,0,2,0],[0,2,2,2],[2,0,1,1],[2,2,1,1]],alphabet[120]=[[0,0,2,2],[2,0,0,2]],alphabet[121]=[[0,0,1,1],[0,2,1,1],[1,1,2,1]],alphabet[122]=[[0,0,0,2],[0,2,2,0],[2,0,2,2]],alphabet[48]=[[0,0,2,0],[2,0,2,2],[2,2,0,2],[0,2,0,0]],alphabet[49]=[[0,0,0,1],[0,1,2,1],[2,0,2,2]],alphabet[50]=[[0,0,0,2],[0,2,1,2],[1,2,1,0],[1,0,2,0],[2,0,2,2]],alphabet[51]=[[0,0,0,2],[0,2,2,2],[2,2,2,0],[1,0,1,2]],alphabet[52]=[[0,0,1,0],[1,0,1,2],[0,2,2,2]],alphabet[53]=[[0,2,0,0],[0,0,1,0],[1,0,1,2],[1,2,2,2],[2,2,2,0]],alphabet[54]=[[0,2,0,0],[0,0,2,0],[2,0,2,2],[2,2,1,2],[1,2,1,0]],alphabet[55]=[[0,0,0,2],[0,2,2,2],[1,1,1,2]],alphabet[56]=[[0,0,2,0],[2,0,2,2],[2,2,0,2],[0,2,0,0],[1,0,1,2]],alphabet[57]=[[2,0,2,2],[2,2,0,2],[0,2,0,0],[0,0,1,0],[1,0,1,2]];
var message = '';
var moveMethod = 1;
function hkd(z) {
    console.log(z);
    switch(z.keyCode) {
        case 8:
        if (message.length <= 0) return;
            z.preventDefault();
            message = message.substring(0, message.length - 1);
            break;
    }
 
    // numpad keys
    switch (z.code) {
        case 'Numpad0':
            spamClicking=!spamClicking
            break;
        case 'Numpad1':
            moveMethod=1;
            break;
        case 'Numpad2':
            moveMethod=2;
            break;
        case 'Numpad3':
            moveMethod=3;
            break;
    }
 
}
 
function hkp(e) {
    if ((e.keyCode >= 39 && e.keyCode <= 41) ||
         e.keyCode == 44 || e.keyCode == 46 ||
        (e.keyCode >= 48 && e.keyCode <= 59 && e.location == 0) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 97 && e.keyCode <= 122) ||
         e.keyCode == 32 || e.keyCode == 63) {
        message = message.concat(String.fromCharCode(e.keyCode));
        return;
    }
    switch(e.keyCode) {
        case 13:
            drawWord(message.toLowerCase(), head[0], head[1]);
            message = "";
            e.preventDefault();
            break;    
        default:
            return;
    }
}
 
var j=0;
function drawLetter(a, x, y) {
    var letter = alphabet[a];
 
    if (letter == null)
        return;
 
    var g = new ArrayBuffer(9),
        e = new DataView(g);
 
    for (var i = 0; i < letter.length; i++) {
        e.setUint8(0, 3);
        e.setUint16(1, x+alphabet[a][i][1]*fontSize, !0);
        e.setUint16(3, y+alphabet[a][i][0]*fontSize, !0);
        e.setUint16(5, x+alphabet[a][i][3]*fontSize, !0);
        e.setUint16(7, y+alphabet[a][i][2]*fontSize, !0);
        if (mainCursorWriting) {
            if (j==0) WebSocket.prototype.send.call(tmp, g);
            else if (botWriting) WebSocket.prototype.send.call(pool[j-1], g);
            else WebSocket.prototype.send.call(tmp, g);
        } else if (botWriting) {
            if (j!=0) WebSocket.prototype.send.call(pool[j-1], g);
            else if (mainCursorWriting) WebSocket.prototype.send.call(tmp, g);
            else WebSocket.prototype.send.call(pool[j-1], g);
        }
        j++;
        if (j>=(botWriting?pool.length:0)+(mainCursorWriting?1:0)) j=0;
    }
}
 
var timeout = 70,
    wordIndex = 0;
function drawWord(s, x, y) {
    setTimeout(function () {
        drawLetter(s.charCodeAt(0), x, y);
        wordIndex++;
        if (s.length > 0)
            drawWord(s.substring(1, s.length), x+fontSize*3, y);
        else {
            wordIndex = 0;
            letterOffset = 0;
        }
    }, timeout);
}
 
document.onkeydown = hkd;
document.onkeypress = hkp;
 
var pathfinderDelay = 0;
function move(x, mov, type = moveMethod, i = 0) {
    if (x.readyState != 1) return;
    if (i == 0 && x) x.rdy = 0;
    var buf = new ArrayBuffer(type==3?13:9),
        q = new DataView(buf);
    q.setUint8(0, type, 1);
    if (type!==3 && i<mov.length) {
        q.setUint16(1, mov[i][0], 1);
        q.setUint16(3, mov[i][1], 1);
        q.setInt32(5, -1, 1);
    }
    WebSocket.prototype.send.call(x, buf);
    if (pathfinderDelay === 0) {
        if (type!==3)for (i=0; i<mov.length;) {
            if (x.readyState != 1) break;
            if (i == 0 && x) x.rdy = 0;
            q.setUint16(1, mov[i][0], 1);
            q.setUint16(3, mov[i][1], 1);
            WebSocket.prototype.send.call(x, buf);
            i++;
        }
        q.setUint8(0, 2, 1),
        q.setUint16(1, mov[mov.length-1][0], 1);
        q.setUint16(3, mov[mov.length-1][1], 1),
        q.setInt32(5, -1, 1);
        WebSocket.prototype.send.call(x, buf);
        if (x) x.rdy = 1;
    } else {
        setTimeout(function(){
            move(x, mov, type, i+1);
        }, pathfinderDelay)
    }
    x.rdy = 1;
}
 
function returnAllBots() {
    for (var i=0; i<cursors.length;) {
        pool.push(cursors.shift());
    }
}
 
var disconnected = 0,
    connected = 0,
    disconnecting = 0,
    connecting = 0;
 
function lop2() {
    setInterval(function() {
        disconnecting = 0, connecting = 0;
        for (var i=0;i<pool.length;) {
            if (pool[i].readyState == 1) {
                connecting++;
            } else if (pool[i].readyState == 2 || pool[i].readyState == 3) {
                disconnecting++;
            }; i++;
        }; for (var i=0; i<cursors.length;) {
            if (cursors[i].readyState == 1) {
                connecting++;
            } else if (cursors[i].readyState == 2 || cursors[i].readyState == 3) {
                disconnecting++;
            }; i++;
        }
    connected = connecting,
    disconnected = disconnecting;
    }, 200);
}; lop2();
var lop = setInterval(function() {
    cursors.forEach(function(x) { // when you deploy a minion.
        if (x) { // prevents error spam
            if (x.rdy) { // if the bot has connected
                x.send(x.click);
            }
        }
    });
}, 1000 / cps);
 
setInterval(function() { // spam clicking/moving :D (new wall hack i guess) // doesn't work so far sry
    pool.forEach(function(x) {
        if (x && x.rdy && !!spamClicking) {
            move(x, [head[0],head[1]], 2);
        }
    })
}, 1000 / cps);
 
var darkTheme = true;
document.body.style.cssText = "transition:1s;background-color:#000000;"
canvas.style.backgroundColor = "#ffffff";
noCursorLock.style.display = 'none';
noCursorLock.checked = true;
noDrawings.style.display = 'none';
noCursorLock.parentElement.style.display = 'none';
noDrawings.parentElement.style.display = 'none';
var elementdisplay = document.createElement("CANVAS");
document.body.appendChild(elementdisplay);
var moreScripts = document.getElementsByTagName('a')[0];
moreScripts.href = '';
moreScripts.style.display = 'none';
var advertisement = document.getElementsByTagName('div')[4];
advertisement.style.display = 'none';
var outline = document.getElementsByTagName('div')[1];
outline.style.border = '5px solid #000000';
outline.style.borderStyle = 'collapse';
outline.style.margin = '20px auto 0px';
var outline2 = document.getElementsByTagName('div')[3];
outline2.style.fontSize = '0px';
outline2.style.transition = '1s';
var display = document.getElementsByTagName('canvas')[1];
display.style.cssText = "background-color:#ffffff;width:800px;margin-left:calc(50% - 405px);margin-right:calc(50% - 405px);margin-top:0px;height:192px;border:5px solid #000000;border-style:collapse;";
var dpl = display.getContext('2d');
display.width = 800,
display.height = 192;
dpl.font = '12px NovaSquare';
dpl.lineWidth = 2.5;
display.onmousemove = function(e) { // for like buttons and stuff
    var xy = [(e.layerX - (ff ? canvas.offsetLeft : 0)) | 0, (e.layerY - (ff ? canvas.offsetTop : 0)) | 0];
    if ((xy[0] >= 249 && xy[0] <= 266) && (xy[1] >= 65 && xy[1] <= 80)) { // decrease pathfinder delay
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 302 && xy[0] <= 318) && (xy[1] >= 65 && xy[1] <= 80)) { // increase pathfinder delay
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 10 && xy[0] <= 133) && (xy[1] >= 122 && xy[1] <= 136)) { // return all bots
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 450 && xy[0] <= 468) && (xy[1] >= 95 && xy[1] <= 107)) { // decrease text delay
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 514 && xy[0] <= 532) && (xy[1] >= 95 && xy[1] <= 107)) { // increase text delay
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 609 && xy[0] <= 701) && (xy[1] >= 82 && xy[1] <= 97)) { // toggle dark theme
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 279 && xy[0] <= 326) && (xy[1] >= 82 && xy[1] <= 97)) { // toggle pathfinder mode
        display.style.cursor = 'pointer';
    } else if ((xy[0] >= 280 && xy[0] <= 316) && (xy[1] >= 97 && xy[1] <= 107)) { // toggle avoid exits
        display.style.cursor = 'pointer';
    } else display.style.cursor = 'auto';
}
 
display.onmousedown = function(e) { // for like buttons and stuff
    var xy = [(e.layerX - (ff ? canvas.offsetLeft : 0)) | 0, (e.layerY - (ff ? canvas.offsetTop : 0)) | 0];
    if ((xy[0] >= 249 && xy[0] <= 266) && (xy[1] >= 65 && xy[1] <= 80)) { // decrease pathfinder delay
        display.style.cursor = 'pointer';
        pathfinderDelay -= 5;
        if (pathfinderDelay < 0) pathfinderDelay = 0;
    } else if ((xy[0] >= 302 && xy[0] <= 318) && (xy[1] >= 65 && xy[1] <= 80)) { // increase pathfinder delay
        display.style.cursor = 'pointer';
        pathfinderDelay += 5;
        if (pathfinderDelay > 250) pathfinderDelay = 250;
    } else if ((xy[0] >= 10 && xy[0] <= 133) && (xy[1] >= 122 && xy[1] <= 136)) { // return all bots
        display.style.cursor = 'pointer';
        returnAllBots();
    } else if ((xy[0] >= 450 && xy[0] <= 468) && (xy[1] >= 95 && xy[1] <= 107)) { // decrease text delay
        display.style.cursor = 'pointer';
        timeout -= 10;
        if (timeout < 25) timeout = 25;
    } else if ((xy[0] >= 514 && xy[0] <= 532) && (xy[1] >= 95 && xy[1] <= 107)) { // increase text delay
        display.style.cursor = 'pointer';
        timeout += 10;
        if (timeout > 750) timeout = 750;
    } else if ((xy[0] >= 609 && xy[0] <= 701) && (xy[1] >= 82 && xy[1] <= 93)) { // toggle dark theme
        display.style.cursor = 'pointer';
        darkTheme=!darkTheme;
        if (darkTheme == false) {
            document.body.style.backgroundColor = '#ffffff';
        }
        else if (darkTheme == true) {
            document.body.style.backgroundColor = '#000000';
        }
    } else if ((xy[0] >= 279 && xy[0] <= 326) && (xy[1] >= 82 && xy[1] <= 93)) { // toggle pathfinder mode
        display.style.cursor = 'pointer';
        moveMethod==2?moveMethod=1:moveMethod=2;
    } else if ((xy[0] >= 280 && xy[0] <= 316) && (xy[1] >= 95 && xy[1] <= 107)) { // toggle avoid exits
        display.style.cursor = 'pointer';
        avoidGreenArea=!avoidGreenArea
    } else display.style.cursor = 'auto';
}
function updateDisplay() {
    dpl.save();
    dpl.clearRect(0,0,800,192);
 
    // message display
    dpl.lineWidth = 2.5;
    dpl.font = '18px NovaSquare';
    dpl.fillStyle = '#ffffff';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Message: '+message,10,28);
    dpl.strokeRect(5,38,790,2.5);
    dpl.globalAlpha = 1;
    dpl.fillText('Message: '+message,10,28);
    dpl.fillRect(5,38,790,2.5);
 
    // title display
    dpl.font = '16px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Bots',10,58);
    dpl.strokeText('Pathfinder',210,58);
    dpl.strokeText('Text',410,58);
    dpl.strokeText('Miscellanious',610,58);
    dpl.globalAlpha = 1;
    dpl.fillText('Bots',10,58);
    dpl.fillText('Pathfinder',210,58);
    dpl.fillText('Text',410,58);
    dpl.fillText('Miscellanious',610,58);
 
    // bots display
    dpl.font = '12px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Ready: '+pool.length,10,78);
    dpl.strokeText('Deployed: '+cursors.length,10,92);
    dpl.strokeText('Disconnected: '+disconnected,10,106);
    dpl.strokeText('Connected: '+connected,10,120);
    dpl.strokeText('[Return All Deployed]',10,134);
    dpl.globalAlpha = 1;
    dpl.fillText('Ready: '+pool.length,10,78);
    dpl.fillText('Deployed: '+cursors.length,10,92);
    dpl.fillText('Disconnected: '+disconnected,10,106);
    dpl.fillText('Connected: '+connected,10,120);
    dpl.fillText('[Return All Deployed]',10,134);
 
    // pathfinder display
    dpl.font = '12px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Delay: [<] '+pathfinderDelay+'ms [>]',210,78);
    dpl.strokeText('Movement: '+(moveMethod==1?'[Normal]':moveMethod==2?'[Clicks]':'[?????]'),210,92);
    dpl.strokeText('Avoid exits: ['+avoidGreenArea+']',210,106);
    dpl.globalAlpha = 1;
    dpl.fillText('Delay: [<] '+pathfinderDelay+'ms [>]',210,78);
    dpl.fillText('Movement: '+(moveMethod==1?'[Normal]':moveMethod==2?'[Clicks]':'[?????]'),210,92);
    dpl.fillText('Avoid exits: ['+avoidGreenArea+']',210,106);
 
    // text display
    dpl.font = '12px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Font: '+fontType,410,78);
    dpl.strokeText('Size: '+fontSize,410,92);
    dpl.strokeText('Delay: [<] '+timeout+'ms [>]',410,106);
    dpl.globalAlpha = 1;
    dpl.fillText('Font: '+fontType,410,78);
    dpl.fillText('Size: '+fontSize,410,92);
    dpl.fillText('Delay: [<] '+timeout+'ms [>]',410,106);
 
    // misc display
    dpl.font = '12px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Spam Clicking Rate: '+cps+'cps',610,78);
    dpl.strokeText('[Change Theme]',610,92);
    dpl.globalAlpha = 1;
    dpl.fillText('Spam Clicking Rate: '+cps+'cps',610,78);
    dpl.fillText('[Change Theme]',610,92);
 
    // credit display
    dpl.font = '12px NovaSquare';
    dpl.globalAlpha = 0.5;
    dpl.strokeText('Created by vnx#6389',790 - dpl.measureText('Created by vnx#6389').width,168);
    dpl.strokeText('Special thanks to cledis',790 - dpl.measureText('Special thanks to cledis').width,182);
    dpl.globalAlpha = 1;
    dpl.fillText('Created by vnx#6389',790 - dpl.measureText('Created by vnx#6389').width,168);
    dpl.fillText('Special thanks to cledis',790 - dpl.measureText('Special thanks to cledis').width,182);
 
    dpl.restore();
    requestAnimationFrame(updateDisplay);
}
 
requestAnimationFrame(updateDisplay);





 