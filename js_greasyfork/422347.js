  
// ==UserScript==
// @name         Pixelplace Bot
// @namespace    pixelbot
// @version      9.1
// @description  Bot
// @author       furkan#8821
// @match        https://pixelplanet.fun/*
// @match        https://pixelplanet.fun/*
// @homepage     https://github.com/Furkan2514/FurkanBot
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/422347/Pixelplace%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/422347/Pixelplace%20Bot.meta.js
// ==/UserScript==
//jshint esversion: 6, evil: true

var size = 0,
    trnsprntPxls = 0;

cooldown = 90000;
countdown = pixel_count = timestampp = got_fingerprint = bot_active = p1 = p2 = fpcount = 0;
list = [];
captchaT = "";
htmlFragmentBot = '<div style="position: absolute; left: 4em; top: 1em;"><div id="boto" style="background-color: rgba(0, 0, 0, 0.85); color: rgb(250, 250, 250); text-align: center; vertical-align: text-bottom; width:300px; min-height: 45px; height: auto; border-radius: 21px; padding: 0px;"><div id="bot" style="cursor: pointer;">Bot Loading....</div><a id="pxlslft">- / - (-)</a><div id="botconf"><div id="srv_message" style="font-size: 14px;"></div> <input id="coord" placeholder="x, y" style="width: 100px;"/> <br><div onclick="document.getElementById(' + "'fileInput'" + ').click();"><img src="https://i.imgur.com/6XghszY.png" id="upfile1" style="cursor:pointer;width: 30px;"><h6 style="margin: 0;cursor: pointer;">Yükle</h6></div><input type="file" id="fileInput" accept="image/*" style="display: none;" /> <a style="display:block;font-size:10px;line-height: 15px;">Koordinatları yakalamak için Z tuşuna basın<br/> Bir pikseli atlamak için X tuşuna basın </a><span id="last_pixel" style="font-size: 14px;">(x: -, y: -, kord: -) </span><span id="seccounter">0 s</span></div></div></div><audio id="complete-alert" src="http://soundbible.com/grab.php?id=2154&type=mp3" autostart="false"></audio><audio id="captcha-alert" src="http://soundbible.com/grab.php?id=2156&type=mp3" autostart="false"></audio>';
window.eval('oldFetch = window.fetch;window.fetch = function(a){if(arguments[0]=="/api/me"){FP = JSON.parse(arguments[1]["body"])["fingerprint"];window.fetch = oldFetch;}return oldFetch.apply(this, arguments);}');

window.addEventListener('load', function () {
    template_list = null;
    loadGUI();
    setStatus("Fingerprint Bekleniyor ...");
    setStatusColor("rgba(100, 100, 0, 0.75)");
    checkForFingerprint();
}, false);

function checkForFingerprint() {
    if (typeof window.eval('FP') !== 'undefined') {
        FP = window.eval('FP');
        got_fingerprint = 1;
        botStatus();
        setPixel();
    } else
        setTimeout(checkForFingerprint, 300);
}

function loadGUI() {
    var div = document.createElement('div');
    div.setAttribute('class', 'post block bc2');
    div.innerHTML = htmlFragmentBot;
    document.body.appendChild(div);
    botStatus();
    document.getElementById('bot').onclick = function (e) {
        bot_active = 1 - bot_active;
        GM_setValue('bot_active', bot_active);
        botStatus();
        p1 = 0;
        if (bot_active == 1)
            if (Date.now() >= timestampp + cooldown)
                setPixel();
    };
    bot_active = GM_getValue('bot_active', 0);
}

function botStatus() {
    if (bot_active == 0) {
        setStatus("Bot Etkin Değil");
        setStatusColor("rgba(0, 0, 0, 0.75)");
    }
}

function updatePixelCount() {
    setStatus("Bot Aktif");
    setStatusColor("rgba(0, 100, 0, 0.75)");
}

function setStatus(message) {
    document.getElementById("bot").innerHTML = message;
}

function setStatusColor(color) {
    document.getElementById("boto").style.backgroundColor = color;
}

function tick() {
    if (countdown == 0) {
        document.getElementById("seccounter").innerHTML = "0 s";
        return;
    }
    document.getElementById("seccounter").innerHTML = countdown + " s";
    countdown -= 1;
    window.setTimeout(tick, 1000);
}

function waiting(cd) {
    countdown = Math.floor(cd / 1000);
    tick();
    window.setTimeout(setPixel, cd);
}

function retPixel() {
    fetchstat = window.eval('fetchstat');
    fetchval = window.eval('fetchval');
    if (fetchstat == 0) {
        window.setTimeout(retPixel, 1000);
    } else {
        if (fetchstat == 422) {
            cooldown = 10000;
            waiting(cooldown);
            timestampp = Date.now();
            setStatus("Captcha");
            setStatusColor("rgba(100, 10, 0, 0.75)");
            document.getElementById("captcha-alert").play();
            if (p2 == 0)
                new Notification('PixelBot CAPTCHA!', {
                    body: "Bir piksel koy ve CAPTCHA'yı çöz!"
                });
            captchaT = "(CAPTCHA)";
            console.log('CAPTCHA!!!');
            p2 = 1;
            return;
        } else if (fetchstat == 200) {
            list.splice(r, 3);
            p2 = 0;
            captchaT = "";
            pixel_count += 1;
            updatePixelCount();
        } else if (fetchstat == 400) {
            setStatus("Cooldown'u bekliyorum ...");
            setStatusColor("rgba(0, 100, 0, 0.75)");
        } else if (fetchstat >= 401) {
            console.log("[PixelBot] Setting Pixel didn't work, trying again in 10s.");
            cooldown = 15000;
            setStatus("Hata, 15 saniyede dene.");
            setStatusColor("rgba(100, 10, 0, 0.75)");
            waiting(cooldown);
            timestampp = Date.now();
            return;
        }
        if (Number.isFinite(fetchval.waitSeconds)) {
            cooldown = fetchval.waitSeconds * 1000;
            waiting(cooldown);
            timestampp = Date.now();
        }
    }
}

function setPixel() {
    if (bot_active == 0) return;
    setStatus("Piksel yerleştiriliyor ...");
    setStatusColor("rgba(100, 100, 0, 0.75)");
    if (list.length == 0 && size != 0) {
        bot_active = 1;
        GM_setValue('bot_active', bot_active);
        botStatus();
        setStatus('TAMAMLANDI!');
        p1 = 1;
        return;
    }
    if (coord[0] == null || coord[1] == null) {
        bot_active = 1;
        GM_setValue('bot_active', bot_active);
        botStatus();
        setStatus('Koordinat koy');
        return;
    }

    r = Math.floor(Math.random() * (list.length / 3 + 1)) * 3;
    x = list[r] + template_list.botTemplate.x * 1;
    y = list[r + 1] + template_list.botTemplate.y * 1;
    clr = list[r + 2];

    document.getElementById("last_pixel").innerHTML = "(x: " + x + ", y: " + y + ", cor: " + clr + ") ";
    window.eval('fetchstat = 0;');
    window.eval('fetch("api/pixel", {method: "POST",headers: {"Content-Type": "application/json"},body: JSON.stringify({ x: ' + x + ', y: ' + y + ', color: ' + clr + ', fingerprint: "' + FP + '", token : null' + ', a: ' + (x + y + 8) + ' })}).then(function(res){fetchstat = res.status;return res;}).then(function(res){return res.json();}).then(function(json){fetchval = json;});');
    window.setTimeout(retPixel, 1000);
}

document.onkeydown = function (e) {
    e = e || window.event;
    var coordDoc;
    document.querySelectorAll("*[style]").forEach(function (a) {
        if (a.style.cssText == "position: absolute; left: 1em; bottom: 1em;")
            coordDoc = a.firstChild.textContent.replace('(', '').replace(')', '');
    });
    if (e.keyCode == 90) { //Z - set XY
        document.getElementById('coord').value = coordDoc;
        GM_setValue('coord', coordDoc);
    }
    if (e.keyCode == 88) { //X - remove pixel
        console.log('clicou X em ' + coordDoc.split(', ')[0] + ', ' + coordDoc.split(', ')[1]);
        console.log(list.length / 3);
        for (var i = 0; i < list.length + 1; i += 3) {
            console.log(list[xi] + template_list.botTemplate.x * 1);
            xc = coordDoc.split(', ')[0] * 1;
            yc = coordDoc.split(', ')[1] * 1;
            xl = list[i] + template_list.botTemplate.x * 1;
            yl = list[i + 1] + template_list.botTemplate.y * 1;
            if (xl == xc && yl == yc) {
                clearInterval(interval);
                list.splice(xl, 3);
                return;
            }
        }
        console.log(list.length / 3);
    }
};

setInterval(function () {
    coord = document.getElementById('coord').value.split(', ');
    coord[0] = coord[0] * 1;
    coord[1] = coord[1] * 1;
    q = size - list.length / 3 - trnsprntPxls + ' / ' + (isNaN(size) ? '0' : size - trnsprntPxls) + ' (' + (isNaN(size) ? '0' : list.length / 3) + ')';
    g = document.getElementById('pxlslft');
    g.textContent = q;
    document.title = q + ' ' + captchaT + ' ' + document.getElementById("seccounter").innerHTML;
    if (list.length == 0 && size != 0) {
        bot_active = 0;
        GM_setValue('bot_active', bot_active);
        setStatus('TAMAMLANDI!');
        if (p1 == 0) {
            document.getElementById("complete-alert").play();
            new Notification('PixelBot TAMAMLANDI!', {
                body: "Bot pikselleri koymayı bitirdi"
            });
        }
        p1 = 1;
        setStatusColor("rgba(0, 0, 0, 0.75)");
        document.title = 'COMPLETO';
    }
    if (bot_active == 0)
        document.title = q + ' PARADO';
}, 10);


//--------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------MINIMAPA--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------


cssStyle = '#minimapbg{position: absolute; right: 1em; bottom: 1em;}#posyt{background-color: rgba(0, 0, 0, 0.75); color: rgb(250, 250, 250); text-align: center; line-height: 42px; vertical-align: middle; width: auto; height: auto; border-radius: 21px; padding: 6px;}#minimap-text{display: none;}#minimap-box{position: relative; width:420px; height:300px;}#minimap, #minimap-board, #minimap-cursor{width: 100%; height: 100%; position:absolute; top:0; left:0;}#minimap{z-index:1;}#minimap-board{z-index:2;}#minimap-cursor{z-index:3;}#minimap-config{line-height:20px;}.map-clickable{cursor: pointer;}.map-zoom{font-weight:bold;}#colors{margin-left: 0.333em !important;}#app > div:nth-child(1) > div:nth-child(9){position: absolute; bottom: 6em; left: 0.3333em;}#app > div:nth-child(1) > div:nth-child(9) > div:nth-child(2){bottom: initial !important; left: initial !important; position: initial !important; display: inline-block !important;}#app > div:nth-child(1) > div:nth-child(9) > div:nth-child(1){bottom: initial !important; left: initial !important; position: initial !important; display: inline-block !important;}';
htmlFragment = '<div id="minimapbg"> <div class="posy" id="posyt"> <div id="minimap-text"></div><div id="minimap-box"> <canvas id="minimap"></canvas> <canvas id="minimap-board"></canvas> <canvas id="minimap-cursor"></canvas> </div><div id="minimap-config"> <span class="map-clickable" id="hide-map">Gizle</span> | <span class="map-clickable" id="follow-mouse">Fareyi takip et</span> | <span class="map-clickable" id="toggle-grid">Izgara </span> | Yakınlaştırma: <span class="map-clickable map-zoom" id="zoom-plus">+</span> | <span class="map-clickable map-zoom" id="zoom-minus">-</span> </div></div></div>';
window.addEventListener('load', function () {
    document.getElementById('coord').value = GM_getValue('coord', '');
    re = /(.*)@(.*),(.*)/g;
    rec = /\((.*), (.*)\)/g;
    gameWindow = document.getElementById("gameWindow");
    coorDOM = template_list = needed_templates = cachebreaker = null;
    findCoor();
    x_window = y_window = x = y = counter = zoom_state = 0;
    zoomlevel = 9;
    toggle_show = toggle_follow = toggle_grid = true;
    zoom_time = 100;
    addGlobalStyle(cssStyle);
    var div = document.createElement('div');
    div.setAttribute('class', 'post block bc2');
    div.innerHTML = htmlFragment;
    document.body.appendChild(div);
    minimap = document.getElementById("minimap");
    minimap_board = document.getElementById("minimap-board");
    minimap_cursor = document.getElementById("minimap-cursor");
    minimap.width = minimap.offsetWidth;
    minimap_board.width = minimap_board.offsetWidth;
    minimap_cursor.width = minimap_cursor.offsetWidth;
    minimap.height = minimap.offsetHeight;
    minimap_board.height = minimap_board.offsetHeight;
    minimap_cursor.height = minimap_cursor.offsetHeight;
    ctx_minimap = minimap.getContext("2d");
    ctx_minimap_board = minimap_board.getContext("2d");
    ctx_minimap_cursor = minimap_cursor.getContext("2d");
    ctx_minimap.mozImageSmoothingEnabled = ctx_minimap.webkitImageSmoothingEnabled = ctx_minimap.msImageSmoothingEnabled = ctx_minimap.imageSmoothingEnabled = ctx_minimap_board.mozImageSmoothingEnabled = ctx_minimap_board.webkitImageSmoothingEnabled = ctx_minimap_board.msImageSmoothingEnabled = ctx_minimap_board.imageSmoothingEnabled = false;
    drawBoard();
    drawCursor();
    document.getElementById("hide-map").onclick = function () {
        toggle_show = false;
        document.getElementById("minimap-box").style.display = "none";
        document.getElementById("minimap-config").style.display = "none";
        document.getElementById("minimap-text").style.display = "block";
        document.getElementById("minimap-text").innerHTML = "Minimap Göster";
        document.getElementById("minimap-text").style.cursor = "pointer";
    };
    document.getElementById("minimap-text").onclick = function () {
        toggle_show = true;
        document.getElementById("minimap-box").style.display = "block";
        document.getElementById("minimap-config").style.display = "block";
        document.getElementById("minimap-text").style.display = "none";
        document.getElementById("minimap-text").style.cursor = "default";
        loadTemplates();
    };
    document.getElementById("zoom-plus").addEventListener('mousedown', function (e) {
        e.preventDefault();
        zoom_state = +1;
        zoom();
    }, false);
    document.getElementById("zoom-minus").addEventListener('mousedown', function (e) {
        e.preventDefault();
        zoom_state = -1;
        zoom();
    }, false);
    document.getElementById("zoom-plus").addEventListener('mouseup', function (e) {
        zoom_state = 0;
    }, false);
    document.getElementById("zoom-minus").addEventListener('mouseup', function (e) {
        zoom_state = 0;
    }, false);
    document.getElementById("follow-mouse").onclick = function () {
        toggle_follow = !toggle_follow;
        if (toggle_follow) {
            this.innerHTML = "Fareyi takip et";
            loadTemplates();
            x_window = x;
            y_window = y;
            drawCursor();
        } else {
            this.innerHTML = "Pencereyi Takip Et";
            getCenter();
        }
    };
    document.getElementById("toggle-grid").onclick = function () {
        toggle_grid = !toggle_grid;
        drawBoard();
    };
    gameWindow.addEventListener('mouseup', function () {
        if (!toggle_show)
            return;
        if (!toggle_follow)
            setTimeout(getCenter, 100);
    }, false);
    gameWindow.addEventListener('mousemove', function () {
        if (!toggle_show)
            return;
        x_new = coorDOM.innerHTML.replace(rec, '$1');
        y_new = coorDOM.innerHTML.replace(rec, '$2');
        if (x != x_new || y != y_new) {
            x = x_new;
            y = y_new;
            if (toggle_follow) {
                x_window = x;
                y_window = y;
            } else
                drawCursor();
            loadTemplates();
        }
    }, false);
    document.getElementById("minimap-box").style.display = "none";
    document.getElementById("minimap-text").style.display = "block";
    document.getElementById("minimap-text").innerHTML = "Burada Şablon Yok";
}, false);

var a, b;
setInterval(function () {
    if (!toggle_follow)
        getCenter();
    if (b == document.getElementById('coord').value)
        if (!document.getElementById('fileInput').files[0] || coord == '' || a == document.getElementById('fileInput').files[0]) return;

    list = [];
    botTemplate = new Image();
    document.getElementsByTagName('h6')[0].textContent = document.getElementById('fileInput').files[0].name;
    var fr = new FileReader();
    fr.readAsDataURL(document.getElementById('fileInput').files[0]);
    fr.onload = function (event) {
        botTemplate.src = event.target.result;
    };

    botTemplate.onload = function () {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        img = document.createElement('img');
        img.src = botTemplate.src;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        list = [];
        trnsprntPxls = 0;
        size = context.getImageData(0, 0, img.width, img.height).data.length / 4;

        var pixels = context.getImageData(0, 0, img.width, img.height).data;
        var w = img.width;
        for (var i = 0; i < size; i++) {
            var yloop = parseInt(i / w, 10);
            var xloop = i - yloop * w;
            var clr = ['255,255,255', '228,228,228', '136,136,136', '34,34,34', '255,167,209', '229,0,0', '229,149,0', '160,106,66', '229,217,0', '148,224,68', '2,190,1', '0,211,221', '0,131,199', '0,0,234', '207,110,228', '130,0,128', '0,0,0'].indexOf(pixels[i * 4] + ',' + pixels[i * 4 + 1] + ',' + pixels[i * 4 + 2]);
            if (clr == -1) {
                alert('Renk desteklenmiyor ' + xloop + ', ' + yloop + '. Desteklenmeyen tüm pikseller şeffaf olacak! http://pix.rd.net.br/conversor/ Bu Linkden düzeltmeye çalışın! ');
                return;
            } else if (clr == 16)
                trnsprntPxls++;
            else
                list.push(xloop, yloop, clr);
        }

        template_list = {
            'botTemplate': {
                'heigth': img.height,
                'width': img.width,
                'x': coord[0].toString(),
                'y': coord[1].toString()
            }
        };
    };
    drawTemplates();
    a = document.getElementById('fileInput').files[0];
    b = document.getElementById('coord').value;
}, 100);

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head)
        return;
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function toggleShow() {
    toggle_show = !toggle_show;
    if (toggle_show) {
        document.getElementById("minimap-box").style.display = "block";
        document.getElementById("minimap-config").style.display = "block";
        document.getElementById("minimap-text").style.display = "none";
        document.getElementById("minimapbg").onclick = function () {};
        loadTemplates();
    } else {
        document.getElementById("minimap-box").style.display = "none";
        document.getElementById("minimap-config").style.display = "none";
        document.getElementById("minimap-text").style.display = "block";
        document.getElementById("minimap-text").innerHTML = "Minimap Göster";
        document.getElementById("minimapbg").onclick = function () {
            toggleShow();
        };
    }
}

function clampZoom(zoom) {
    return Math.min(45, Math.max(1, zoom));
}

function zoom() {
    if (!zoom_state)
        return;
    zoomlevel = clampZoom(zoomlevel * Math.pow(1.1, zoom_state));
    drawBoard();
    drawCursor();
    loadTemplates();
    setTimeout(zoom, zoom_time);
}

function loadTemplates() {
    if (!toggle_show)
        return;
    var x_left = x_window * 1 - minimap.width / zoomlevel / 2;
    var x_right = x_window * 1 + minimap.width / zoomlevel / 2;
    var y_top = y_window * 1 - minimap.height / zoomlevel / 2;
    var y_bottom = y_window * 1 + minimap.height / zoomlevel / 2;
    var keys = [];
    for (var k in template_list)
        keys.push(k);
    needed_templates = [];
    for (var i = 0; i < keys.length; i = i + 1) {
        template = keys[i];
        var temp_x = template_list[template].x * 1;
        var temp_y = template_list[template].y * 1;
        var temp_xr = template_list[template].x * 1 + template_list[template].width * 1;
        var temp_yb = template_list[template].y * 1 + template_list[template].height * 1;
        if (temp_xr < x_left || temp_yb < y_top || temp_x >= x_right || temp_y >= y_bottom)
            continue;
        needed_templates.push(template);
    }
    if (needed_templates.length == 0) {
        if (zoom_state == false) {
            document.getElementById("minimap-box").style.display = "none";
            document.getElementById("minimap-text").style.display = "block";
            document.getElementById("minimap-text").innerHTML = "Şablon Bulunamadı!";
        }
    } else {
        document.getElementById("minimap-box").style.display = "block";
        document.getElementById("minimap-text").style.display = "none";
        counter = 0;
        for (i = 0; i < needed_templates.length; i = i + 1) {
            if (botTemplate == null)
                drawTemplates();
            else {
                counter++;
                if (counter == needed_templates.length)
                    drawTemplates();
            }
        }
    }
}

function drawTemplates() {
    ctx_minimap.clearRect(0, 0, minimap.width, minimap.height);
    var x_left = x_window * 1 - minimap.width / zoomlevel / 2,
        y_top = y_window * 1 - minimap.height / zoomlevel / 2,
        i;
    for (i = 0; i < needed_templates.length; i = i + 1) {
        var template = needed_templates[i];
        var xoff = (template_list[template].x * 1 - x_left * 1) * zoomlevel;
        var yoff = (template_list[template].y * 1 - y_top * 1) * zoomlevel;
        var newwidth = zoomlevel * botTemplate.width;
        var newheight = zoomlevel * botTemplate.height;
        var img = botTemplate;
        ctx_minimap.drawImage(img, xoff, yoff, newwidth, newheight);
    }
}

function drawBoard() {
    ctx_minimap_board.clearRect(0, 0, minimap_board.width, minimap_board.height);
    if (zoomlevel <= 4.6 || !toggle_grid)
        return;
    ctx_minimap_board.beginPath();
    var bw = minimap_board.width + zoomlevel,
        bh = minimap_board.height + zoomlevel,
        xoff_m = (minimap.width / 2) % zoomlevel - zoomlevel,
        yoff_m = (minimap.height / 2) % zoomlevel - zoomlevel,
        z = zoomlevel;
    ctx_minimap_board.fillStyle = "rgba(0,0,0,0.75)";
    for (var x = 0; x <= bw; x = x + z)
        ctx_minimap_board.fillRect(x + xoff_m, yoff_m, 1, bh);
    for (var y = 0; y <= bh; y = y + z)
        ctx_minimap_board.fillRect(xoff_m, y + yoff_m, bw, 1);
}

function drawCursor() {
    var x_left = x_window * 1 - minimap.width / zoomlevel / 2,
        x_right = x_window * 1 + minimap.width / zoomlevel / 2,
        y_top = y_window * 1 - minimap.height / zoomlevel / 2,
        y_bottom = y_window * 1 + minimap.height / zoomlevel / 2;
    ctx_minimap_cursor.clearRect(0, 0, minimap_cursor.width, minimap_cursor.height);
    if (x < x_left || x > x_right || y < y_top || y > y_bottom)
        return;
    xoff_c = x - x_left;
    yoff_c = y - y_top;
    ctx_minimap_cursor.beginPath();
    ctx_minimap_cursor.lineWidth = Math.min(4, zoomlevel / 3);
    ctx_minimap_cursor.strokeStyle = "red";
    ctx_minimap_cursor.rect(zoomlevel * xoff_c, zoomlevel * yoff_c, zoomlevel, zoomlevel);
    ctx_minimap_cursor.stroke();
}

function getCenter() {
    var url = window.location.href;
    x_window = url.replace(re, '$2');
    y_window = url.replace(re, '$3');
    if (x_window == url || y_window == url)
        x_window = y_window = 0;
    loadTemplates();
}

function findCoor() {
    var elms = document.querySelectorAll("*[style]");
    Array.prototype.forEach.call(elms, function (elm) {
        var style = elm.style.cssText;
        if (style == "position: absolute; left: 1em; bottom: 1em;")
            coorDOM = elm.firstChild;
    });
}