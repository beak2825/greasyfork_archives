// ==UserScript==
//
// @name         Zeach Cobbler modified for poker with agar-mini-map
// @namespace    https://github.com/RealDebugMonkey/ZeachCobbler
// @contributer  See full list at https://github.com/RealDebugMonkey/ZeachCobbler#contributors-and-used-code
// @version      0.2.4
// @description  Agario powerups
// @author       DebugMonkey, dimotsai, Eddy0402
// @license      MIT for agar-mini-map, none for ZeachCobbler
// @match        http://agar.io/
// @match        https://agar.io/
// @require      https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.min.js
// @require      http://cdn.jsdelivr.net/msgpack/1.05/msgpack.js
// @require      https://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12512/Zeach%20Cobbler%20modified%20for%20poker%20with%20agar-mini-map.user.js
// @updateURL https://update.greasyfork.org/scripts/12512/Zeach%20Cobbler%20modified%20for%20poker%20with%20agar-mini-map.meta.js
// ==/UserScript==
//

// Don't run on frames or iframes, so don't runs multiple times
if (window.top != window.self) {
    return;
}

/* Kill all timer that I don't want */
var dummyTimer = setInterval(function(){},99999);
for (var i = 0 ; i < dummyTimer ; i++) {
    console.log('clear timer #' + i);
    clearTimeout(i); 
}

/* Kill graphic tasks */
var dummyRequest = unsafeWindow.requestAnimationFrame(function(){ /* dummy */ });
for (var i = 0 ; i < dummyRequest; i++) {
    console.log('clear animation request #' + i);
    cancelAnimationFrame(i); 
}

/* Kill original websocket connection */
unsafeWindow.oldconnect = unsafeWindow.connect;
setTimeout(function(){
    try {
        unsafeWindow.oldconnect("Killing_original_websocket","");
    }catch(err){}
} ,1000);

function myConfirmation() {
    return '確定關閉遊戲？';
}
unsafeWindow.onbeforeunload = myConfirmation;

/* agar-mini-map */

(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments);};a.unsubscribe=function(){b.off.apply(b,arguments);};a.publish=function(){b.trigger.apply(b,arguments);};})(jQuery);

window.msgpack = this.msgpack;

(function() {
    var _WebSocket = window._WebSocket = window.WebSocket;
    var $ = window.jQuery;
    var msgpack = window.msgpack;
    var options = {
        enableMultiCells: true,
        enablePosition: true,
        enableCross: false,
        showMemberOnly: true,
        showPlayerNameInsteadOfId: true,
    };

    /* Configuration for porting */
    var Config_poker = {
        fieldName : {
            region : "#o-region",
            gamemode : "#o-gamemode",
            room : '#roomIdOrIp'
        },
        injectOnMessage : false,
    };

    var Config_DaChong = {
        fieldName : {
            region : "#region",
            gamemode : "#gamemode",
            room : '#srv-ip'
        },
        injectOnMessage : true,
    };

    var currentConfig = Config_poker;

    var fieldName = currentConfig.fieldName;
    var injectOnMessage = currentConfig.injectOnMessage;
    var defaultServer = "ws://eddyagario.zone.be:8080";

    // game states
    var agarServerAddress = null;
    var map_server = null;
    var player_name = [];
    var players = [];
    var id_players = [];
    var cells = [];
    var current_cell_ids = [];
    var start_x = -7000,
        start_y = -7000,
        end_x = 7000,
        end_y = 7000,
        length_x = 14000,
        length_y = 14000;
    var minimapHeight = 300;
    var minimapWidth = 300;
    var render_timer = null;
    var update_server_list_timer = null;
    var mini_map_tokens = [];
    var mapEvent = [];

    /* Map Event Object */
    function Event(data){
        this.x = data.x;
        this.y = data.y;
        this.type = data.type;
        this.origin = data.origin;
        this.time = Date.now();
    }

    Event.TYPE_NORMAL    = 0;
    Event.TYPE_FEED      = 1;
    Event.TYPE_FAKESPACE = 2;
    Event.TYPE_RUN       = 3;

    Event.prototype = {
        toSendObject: function(){
            return {
                x: this.x,
                y: this.y,
                type: this.type,
                message: this.message
            };
        },
        isTimeout : function(){
            return Date.now() - this.time > 500;
        },
        render: function(ctx, xyTransform, maxsize){
            var elapsedTime = Date.now() - this.time;
            if(elapsedTime > 500){
                /* TODO: delete */
                return;
            }

            var position = xyTransform(this.x, this.y);
            var size = maxsize * elapsedTime / 500;
            var color;

            switch(this.type){
                case Event.TYPE_NORMAL:    color = "#55FF55"; break;
                case Event.TYPE_FEED:      color = "#CCCCFF"; break;
                case Event.TYPE_FAKESPACE: color = "#FFFFFF"; break;
                case Event.TYPE_RUN:       color = "#FF0000"; break;
            }

            ctx.save();
            ctx.strokeStyle = color;
            ctx.globalAlpha = Math.min(2 * (500 - elapsedTime) / 500, 1);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = size * 0.05;
            ctx.beginPath();
            ctx.arc(position.x,
                    position.y,
                    size,
                    0,
                    2 * Math.PI,
                    false);
            ctx.closePath();
            ctx.stroke();
        },
    };

    function miniMapSendRawData(data) {
        if (map_server !== null && map_server.readyState === window._WebSocket.OPEN) {
            var array = new Uint8Array(data);
            map_server.send(array.buffer);
        }
    }

    function getAgarServerInfo(){
        return {
            address : agarServerAddress,
            region: $(fieldName.region).val(),
            gamemode: $(fieldName.gamemode).val() === '' ? ':ffa' : $(fieldName.gamemode).val(),
            party: $(fieldName.room).val(),
        };
    }

    function miniMapConnectToServer(address, onOpen, onClose) {
        if(map_server !== null)return;
        var ws = null;
        try {
            ws = new window._WebSocket(address);
        } catch (ex) {
            onClose();
            console.error(ex);
            return false;
        }
        ws.binaryType = "arraybuffer";

        ws.onopen = onOpen;

        ws.onmessage = function(event) {
            var buffer = new Uint8Array(event.data);
            var packet = msgpack.unpack(buffer);
            switch(packet.type) {
                case 128: /* Update map */
                    for (var i=0; i < packet.data.addition.length; ++i) {
                        var cell = packet.data.addition[i];
                        if (! miniMapIsRegisteredToken(cell.id))
                        {
                            miniMapRegisterToken(
                                cell.id,
                                miniMapCreateToken(cell.id, cell.color)
                            );
                        }

                        var size_n = cell.size/length_x;
                        miniMapUpdateToken(cell.id, (cell.x - start_x)/length_x, (cell.y - start_y)/length_y, size_n);
                    }

                    for (i = 0; i < packet.data.deletion.length; ++i) {
                        var id = packet.data.deletion[i];
                        miniMapUnregisterToken(id);
                    }
                    break;
                case 129: /* Update player */
                    players = packet.data;
                    for (var p in players) {
                        var player = players[p];
                        var ids = player.ids;
                        for (i in ids) {
                            id_players[ids[i]] = player.no;
                        }
                    }
                    window.mini_map_party.trigger('update-list');
                    break;
                case 131: /* Update server list */
                    $('#server-list').empty();
                    packet.data.forEach(function(server){
                        var uid = server.uid;
                        var info = server.info;
                        var playerCount = server.playerCount;
                        var item = $('<a>')
                            .text(info.address + ' ' + info.gamemode + ' : ' + playerCount)
                            .click({ token: info.party, uid: uid },function(e){
                                e.preventDefault();
                                var target = $(e.currentTarget);
                                if(e.data.token !== ''){
                                    unsafeWindow.joinParty(e.data.token);
                                    $(fieldName.room).val(e.data.token);
                                    setTimeout(function(){
                                        miniMapSendRawData(msgpack.pack({
                                            type: 51,
                                            data: e.data.uid
                                        }));
                                    }, 1000);
                                }
                            });
                        var item2 = $('<li>');
                        item.appendTo(item2);
                        item2.appendTo($('#server-list'));
                    });
                    break;
                case 33: /* Add event */
                    mapEvent.push(new Event(packet.data));
            }
        };

        ws.onerror = function() {
            onClose();
            console.error('failed to connect to map server');
        };

        ws.onclose = onClose;

        map_server = ws;
    }

    function miniMapRender() {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');

        // Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle =  '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw coordinate
        var yAxis = ['A', 'B', 'C', 'D', 'E'];
        var xSize = canvas.width;
        var ySize = canvas.height;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = (0.6 * xSize / 5) + 'px Arial';
        ctx.fillStyle = ctx.strokeStyle = '#AAAAAA';
        for (var j = 0; j < 5; ++j) {
            for (var i = 0; i < 5; ++i) {
                ctx.strokeRect((xSize / 5 * i), (ySize / 5 * j), (xSize / 5), (ySize / 5));
                ctx.fillText(yAxis[j] + (i + 1), (xSize / 5 * i) + (xSize / 5 / 2), (ySize / 5 * j) + (ySize / 5 / 2));
            }
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0; // restore alpha

        var rendered_player = [];

        for (var id in mini_map_tokens) {
            var token = mini_map_tokens[id];
            var x = token.x * canvas.width;
            var y = token.y * canvas.height;
            var size = token.size * canvas.width;

            if (!options.showMemberOnly || id_players[id] !== undefined  || current_cell_ids.indexOf(token.id) !== -1) {
                if(options.showMemberOnly && size < 7){ /* add an translucent, bigger cell to make it clear*/
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.arc(
                        x,
                        y,
                        7,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.closePath();
                    ctx.fillStyle = token.color;
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
                ctx.beginPath();
                ctx.arc(
                    x,
                    y,
                    size,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.closePath();
                ctx.fillStyle = token.color;
                ctx.fill();
            }

            if (options.enableCross && -1 != current_cell_ids.indexOf(token.id)){
                miniMapDrawCross(token.x, token.y, token.color);
            }

            if (id_players[id] !== undefined) {
                // Draw you party member's crosshair
                if (options.enableCross) {
                    miniMapDrawCross(token.x, token.y, token.color);
                }

                if(rendered_player.indexOf(id_players[id]) == -1){
                    if(options.showPlayerNameInsteadOfId){
                        /* draw name only once */
                        ctx.font = '14px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'white';
                        ctx.fillText(String.fromCharCode.apply(null, players[id_players[id]].name), x, y + ((size < 10) ? 10 : size * 1.3));
                        rendered_player.push(id_players[id]);
                    }else{
                        ctx.font = size * 2 + 'px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'white';
                        ctx.fillText(id_players[id] + 1, x, y);
                    }
                }
            }
        }

        for(var e = 0;e < mapEvent.length; ++e){
            if(mapEvent[e]){
                mapEvent[e].render(ctx,
                                function(x,y){
                                    var nx = (x - start_x) / length_x * minimapWidth;
                                    var ny = (y - start_y) / length_y * minimapHeight;
                                    return {x:nx, y:ny};
                                } ,
                                60/* size */);
                if(mapEvent[e].isTimeout()){
                    mapEvent.splice(e, 1);
                }
            }
        }
    }

    function miniMapDrawCross(x, y, color) {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y * canvas.height);
        ctx.lineTo(canvas.width, y * canvas.height);
        ctx.moveTo(x * canvas.width, 0);
        ctx.lineTo(x * canvas.width, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = color || '#FFFFFF';
        ctx.stroke();
    }

    function miniMapCreateToken(id, color) {
        var mini_map_token = {
            id: id,
            color: color,
            x: 0,
            y: 0,
            size: 0
        };
        return mini_map_token;
    }

    function miniMapRegisterToken(id, token) {
        if (mini_map_tokens[id] === undefined) {
            // window.mini_map.append(token);
            mini_map_tokens[id] = token;
        }
    }

    function miniMapUnregisterToken(id) {
        if (mini_map_tokens[id] !== undefined) {
            // mini_map_tokens[id].detach();
            delete mini_map_tokens[id];
        }
    }

    function miniMapIsRegisteredToken(id) {
        return mini_map_tokens[id] !== undefined;
    }

    function miniMapUpdateToken(id, x, y, size) {
        if (mini_map_tokens[id] !== undefined) {

            mini_map_tokens[id].x = x;
            mini_map_tokens[id].y = y;
            mini_map_tokens[id].size = size;

            return true;
        } else {
            return false;
        }
    }

    function miniMapUpdatePos(x, y) {
        window.mini_map_pos.text('x: ' + x.toFixed(0) + ', y: ' + y.toFixed(0));
    }

    function miniMapReset() {
        cells = [];
        mini_map_tokens = [];
    }

    function miniMapInit() {
        mini_map_tokens = [];

        cells = [];
        current_cell_ids = [];
        start_x = -7000;
        start_y = -7000;
        end_x = 7000;
        end_y = 7000;
        length_x = 14000;
        length_y = 14000;

        /* Right Panel */
        if ($('#sidebar-wrapper').length === 0) {
            $('body').append(
                '<style>' +
                '.nav .open > a,  ' +
                '.nav .open > a:hover,  ' +
                '.nav .open > a:focus {background-color: transparent;} ' +
                ' ' +
                '/*-------------------------------*/ ' +
                '/*           Wrappers            */ ' +
                '/*-------------------------------*/ ' +
                ' ' +
                '#sidebar-wrapper { ' +
                '    position: absolute; ' +
                '    z-index: 1000; ' +
                '    margin-right: -310px; ' +
                '    left: auto; ' +
                '    height: 100%; ' +
                '    overflow-y: auto; ' +
                '    overflow-x: hidden; ' +
                '    background: rgba(26,26,26,0.8); ' +
                '    -webkit-transition: all 0.5s ease; ' +
                '    -moz-transition: all 0.5s ease; ' +
                '    -o-transition: all 0.5s ease; ' +
                '    transition: all 0.5s ease; ' +
                '    width: 310px; ' +
                '} ' +
                '#sidebar-wrapper.toggled {' +
                '    margin-right: 0px; ' +
                '}' +
                '/*-------------------------------*/ ' +
                '/*     Sidebar nav styles        */ ' +
                '/*-------------------------------*/ ' +
                ' ' +
                '.sidebar-nav { ' +
                '    position: absolute; ' +
                '    top: 0; ' +
                '    width: 310px; ' +
                '    margin: 0; ' +
                '    padding: 0; ' +
                '    list-style: none; ' +
                '} ' +
                ' ' +
                '.sidebar-nav li { ' +
                '    position: relative;  ' +
                '    line-height: 20px; ' +
                '    display: inline-block; ' +
                '    width: 100%; ' +
                '    background: rgba(40, 40, 40, 0.8);' +
                '} ' +
                ' ' +
                '.sidebar-nav li:before { ' +
                '    content: \'\'; ' +
                '    position: absolute; ' +
                '    top: 0; ' +
                '    left: 0; ' +
                '    z-index: -1; ' +
                '    height: 100%; ' +
                '    width: 5px; ' +
                '    background-color: #1c1c1c; ' +
                '    -webkit-transition: width .2s ease-in; ' +
                '      -moz-transition:  width .2s ease-in; ' +
                '       -ms-transition:  width .2s ease-in; ' +
                '            transition: width .2s ease-in; ' +
                ' ' +
                '} ' +
                '.sidebar-nav li:nth-child(1):before { ' +
                '    background-color: #ec122a;    ' +
                '} ' +
                '.sidebar-nav li:nth-child(2):before { ' +
                '    background-color: #ec1b5a;    ' +
                '} ' +
                '.sidebar-nav li:nth-child(3):before { ' +
                '    background-color: #79aefe;    ' +
                '} ' +
                '.sidebar-nav li:nth-child(4):before { ' +
                '    background-color: #314190;    ' +
                '} ' +
                '.sidebar-nav li:nth-child(5):before { ' +
                '    background-color: #314120;    ' +
                '} ' +
                '.sidebar-nav li:hover:before, ' +
                '.sidebar-nav li.open:hover:before { ' +
                '    width: 100%; ' +
                '    -webkit-transition: width .2s ease-in; ' +
                '      -moz-transition:  width .2s ease-in; ' +
                '       -ms-transition:  width .2s ease-in; ' +
                '            transition: width .2s ease-in; ' +
                ' ' +
                '} ' +
                ' ' +
                '.sidebar-nav li a { ' +
                '    display: block; ' +
                '    color: #ddd; ' +
                '    text-decoration: none; ' +
                '    padding: 10px 15px 10px 30px;     ' +
                '} ' +
                ' ' +
                '.sidebar-nav li a:hover, ' +
                '.sidebar-nav li a:active, ' +
                '.sidebar-nav li a:focus, ' +
                '.sidebar-nav li.open a:hover, ' +
                '.sidebar-nav li.open a:active, ' +
                '.sidebar-nav li.open a:focus{ ' +
                '    color: #fff; ' +
                '    text-decoration: none; ' +
                '    background-color: transparent; ' +
                '} ' +
                ' ' +
                '.sidebar-nav > .sidebar-brand { ' +
                '    height: 65px; ' +
                '    font-size: 20px; ' +
                '    line-height: 44px; ' +
                '    background-color: #3c3c3c; ' +
                '} ' +
                '.dropdown-label{ ' +
                '    display: block;' +
                '    color: #ffffff; ' +
                '    padding: 10px 15px 10px 30px;' +
                '} ' +
                '.dropdown-label:visited, ' +
                '.dropdown-label:hover, ' +
                '.dropdown-label:active{ ' +
                '    color: #cecece; ' +
                '    text-decoration: none;' +
                '} ' +
                '.dropdown-label:after{ ' +
                '    content: \' ▶\';' +
                '    text-align: right; ' +
                '    float:right;' +
                '} ' +
                '.dropdown-label:hover:after{' +
                '     content:\'▼\';' +
                '    text-align: right; ' +
                '    float:right;' +
                '}' +
                '.dropdown ul{' +
                '    float: left;' +
                '    opacity: 0;'+
                '    width: 100%; ' +
                '    padding: 0px;' +
                '    top : 0px;'+
                '    visibility: hidden;'+
                '    -webkit-transition: all .2s ease; ' +
                '       -moz-transition: all .2s ease; ' +
                '        -ms-transition: all .2s ease; ' +
                '         -o-transition: all .2s ease; ' +
                '            transition: all .2s ease; ' +
                '    z-index: 1;' +
                '    position: absolute;' +
                '    border: #555555 1px;' +
                '    border-style: solid;' +
                '}' +
                '.dropdown ul li{' +
                '    float: none;' +
                '    width: 100%;' +
                '}' +
                '.dropdown li:before{' +
                '     width: 0px;'+
                '}' +
                '.dropdown:hover ul:not(.nohover){' +
                '     opacity: 1;'+
                '     background: #3c3c3c;'+
                '     top : 65px;'+
                '     visibility: visible;'+
                '}' +
                '</style>' +
                '<nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">' +
                '    <ul class="nav sidebar-nav">' +
                '        <div class="sidebar-brand dropdown">' +
                '            <a id="tabtitle" class="dropdown-label" href="#">' +
                '               Menu' +
                '            </a>' +
                '            <ul id="dropdowncontent">' +
                '                <li><a data-toggle="tab" href="#tab-chat">Chat</a></li>' +
                '                <li><a data-toggle="tab" href="#tab-serverselect">Server Select</a></li>' +
                '                <li><a data-toggle="tab" href="#tab-settings">settings</a></li>' +
                '            </ul>' +
                '        </div>' +
                '        <div class="tab-content">' +
                '            <div id="tab-chat" class="tab-pane fade in active">' +
                '                <li>' +
                '                    <a href="#">' +
                '                       Player' +
                '                    </a>' +
                '                </li>' +
                '                <div id="playerlist"><!-- place holder --></div>' +
                '                <li>' +
                '                    <a href="#">' +
                '                       Chat' +
                '                    </a>' +
                '                </li>' +
                '                <div id="chat"><p>Not yet implemented :P</p></div>' +
                '            </div>' +
                '            <div id="tab-serverselect" class="tab-pane fade">' +
                '                <li>' +
                '                    <a href="#">' +
                '                       Server Select' +
                '                    </a>' +
                '                </li>' +
                '                <div id="server-list"><!-- place holder --></div>' +
                '            </div>' +
                '            <div id="tab-settings" class="tab-pane fade">' +
                '                <li>' +
                '                    <a href="#">' +
                '                       Minimap Server connection' +
                '                    </a>' +
                '                </li>' +
                '                <div id="minimap-server-connection"><!-- place holder --></div>' +
                '                <li>' +
                '                    <a href="#">' +
                '                       Minimap Settings' +
                '                    </a>' +
                '                </li>' +
                '                <div id="minimap-setting"><!-- place holder --></div>' +
                '            </div>' +
                '        </div>' +
                '    </ul>' +
                '</nav>'
            );
        }
//      '<li>' +
//      '    <iframe src="https://discordapp.com/widget?id=103557585675763712&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>' +
//      '</li>' +
        $('#dropdowncontent').click(function(e){
            $(this).addClass('nohover');
        });
        $('#tabtitle').hover(function(e){
            e.stopPropagation();
            $('#dropdowncontent').removeClass('nohover');
        });

        // Minimap
        if ($('#mini-map-wrapper').length === 0) {
            var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
                position: 'fixed',
                bottom: 5,
                right: 5,
                width: minimapWidth,
                height: minimapHeight,
                background: 'rgba(128, 128, 128, 0.58)',
                "z-index": '1001'
            });

            var mini_map = $('<canvas>').attr({
                id: 'mini-map',
                width: minimapWidth,
                height: minimapHeight,
            }).css({
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: 'cell',
            }).on("mousedown",function(e){
                if(e.button === 0){
                    var posX = e.pageX - $(this).offset().left,
                        posY = e.pageY - $(this).offset().top;
                    var mapPosX = posX / minimapWidth * length_x + start_x;
                    var mapPosY = posY / minimapHeight * length_y + start_y;
                    var event = new Event({
                        x : mapPosX,
                        y : mapPosY,
                        type : Event.TYPE_NORMAL,
                        origin : -1,
                    });
                    miniMapSendRawData(msgpack.pack({
                        type : 33,
                        data: event.toSendObject()
                    }));
                }else if(e.button === 2){
                    unsafeWindow.Minimap.ToggleSidebar();
                }
            }).on('contextmenu',function(e){
                return false;
            });

            wrapper.append(mini_map).appendTo(document.body);

            window.mini_map = mini_map[0];
        }

        // minimap renderer
        if (render_timer === null)
            render_timer = setInterval(miniMapRender, 1000 / 30);

        // update server list every 10 seconds
        if (update_server_list_timer === null)
            update_server_list_timer = setInterval(function(){
                miniMapSendRawData(msgpack.pack({type: 50}));
            }, 1000 * 10);

        // minimap location
        if ($('#mini-map-pos').length === 0) {
            window.mini_map_pos = $('<div>').attr('id', 'mini-map-pos').css({
                bottom: 10,
                right: 10,
                color: 'white',
                fontSize: 15,
                fontWeight: 800,
                position: 'fixed'
            }).appendTo(document.body);
        }

        // minimap options
        if ($('#mini-map-options').length === 0) {
            window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
                color: '#EEEEEE',
                fontWeight: 400,
                padding: '10px 15px 10px 30px'
            }).appendTo($('#minimap-setting'));

            for (var name in options) {

                var label = $('<label>').css({
                    display: 'block'
                });

                var checkbox = $('<input>').attr({
                    type: 'checkbox'
                }).prop({
                    checked: options[name]
                });

                label.append(checkbox);
                label.append(' ' + camel2cap(name));

                checkbox.click( function(options, name) { 
                    return function(evt) {
                        options[name] = evt.target.checked;
                        console.log(name, evt.target.checked);
                    };
                }(options, name));

                label.appendTo(window.mini_map_options);
            }

            var form = $('<div>')
            .addClass('form-inline')
            .css({
                opacity: 0.7,
                marginTop: 2
            })
            .appendTo(window.mini_map_options);

            var form_group = $('<div>')
            .addClass('form-group')
            .css({
                padding: '10px 15px 10px 30px',
                'margin-bottom': '0px'
            })
            .appendTo($('#minimap-server-connection'));

            var addressInput = $('<input>')
            .attr('placeholder', defaultServer)
            .attr('type', 'text')
            .css({
                'background-color':'#3c3c3c',
                color: '#FFF',
                border: 'none',
                'margin-bottom': '3px'
            })
            .addClass('form-control')
            .val(defaultServer)
            .appendTo(form_group);

            var connect = function (evt) {
                var address = addressInput.val();

                connectBtn.popover('destroy');
                connectBtn.text('Disconnect');
                miniMapConnectToServer(address, function onOpen() {
                    miniMapSendRawData(msgpack.pack({
                        type: 100,
                        data: getAgarServerInfo(),
                    }));
                    miniMapSendRawData(msgpack.pack({
                        type: 0,
                        data: player_name
                    }));
                    for (var i in current_cell_ids) {
                        miniMapSendRawData(msgpack.pack({
                            type: 32,
                            data: current_cell_ids[i]
                        }));
                    }
                    miniMapSendRawData(msgpack.pack({type: 50}));
                    console.log(address + ' connected');
                }, function onClose() {
                    map_server = null;
                    players = [];
                    id_players = [];
                    disconnect();
                    console.log('map server disconnected');
                });

                connectBtn.off('click');
                connectBtn.on('click', disconnect);

                miniMapReset();

                connectBtn.blur();
            };

            var disconnect = function() {
                connectBtn.text('Connect');
                connectBtn.off('click');
                connectBtn.on('click', connect);
                connectBtn.blur();
                if (map_server)
                    map_server.close();

                miniMapReset();
            };

            var connectBtn = $('<button>')
            .attr('id', 'mini-map-connect-btn')
            .text('Connect')
            .click(connect)
            .addClass('btn btn-block btn-primary')
            .appendTo(form_group);

            connectBtn.trigger('click');
        }

        // minimap party
        if ($('#mini-map-party').length === 0) {
            var mini_map_party = window.mini_map_party = $('<div>')
            .css({
                color: '#FFF',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
                padding: 10
            })
            .attr('id', 'mini-map-party')
            .appendTo($('#playerlist'));

            var mini_map_party_list = $('<ol>')
            .attr('id', 'mini-map-party-list')
            .css({
                listStyle: 'none',
                padding: 0,
                margin: 0
            })
            .appendTo(mini_map_party);

            mini_map_party.on('update-list', function(e) {
                mini_map_party_list.empty();

                for (var p in players) {
                    var player = players[p];
                    var name = String.fromCharCode.apply(null, player.name);
                    name = (name === '' ? 'anonymous' : name);
                    $('<p>')
                    .text(player.no + 1 + '. ' + name)
                    .css({
                        margin: 0
                    })
                    .appendTo(mini_map_party_list);
                }
            });
        }
    }

    // cell constructor
    function Cell(id, x, y, size, color, name) {
        cells[id] = this;
        this.id = id;
        this.ox = this.x = x;
        this.oy = this.y = y;
        this.oSize = this.size = size;
        this.color = color;
        this.points = [];
        this.pointsAcc = [];
        this.setName(name);
    }

    Cell.prototype = {
        id: 0,
        points: null,
        pointsAcc: null,
        name: null,
        nameCache: null,
        sizeCache: null,
        x: 0,
        y: 0,
        size: 0,
        ox: 0,
        oy: 0,
        oSize: 0,
        nx: 0,
        ny: 0,
        nSize: 0,
        updateTime: 0,
        updateCode: 0,
        drawTime: 0,
        destroyed: false,
        isVirus: false,
        isAgitated: false,
        wasSimpleDrawing: true,

        destroy: function() {
            delete cells[this.id];
            id = current_cell_ids.indexOf(this.id);
            if(-1 != id){
                current_cell_ids.splice(id, 1);
            }
            this.destroyed = true;
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                miniMapUnregisterToken(this.id);
            }
        },
        setName: function(name) {
            this.name = name;
        },
        updatePos: function() {
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                if (options.enableMultiCells || -1 != current_cell_ids.indexOf(this.id)) {
                    if (! miniMapIsRegisteredToken(this.id))
                    {
                        miniMapRegisterToken(
                            this.id,
                            miniMapCreateToken(this.id, this.color)
                        );
                    }

                    var size_n = this.nSize/length_x;
                    miniMapUpdateToken(this.id, (this.nx - start_x)/length_x, (this.ny - start_y)/length_y, size_n);
                }
            }

            if (options.enablePosition && -1 != current_cell_ids.indexOf(this.id)) {
                window.mini_map_pos.show();
                miniMapUpdatePos(this.nx, this.ny);
            } else {
                window.mini_map_pos.hide();
            }

        }
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function camel2cap(str) {
        return str.replace(/([A-Z])/g, function(s){return ' ' + s.toLowerCase();}).capitalize();
    }

    // create a linked property from slave object
    // whenever master[prop] update, slave[prop] update
    function refer(master, slave, prop) {
        Object.defineProperty(master, prop, {
            get: function(){
                return slave[prop];
            },
            set: function(val) {
                slave[prop] = val;
            },
            enumerable: true,
            configurable: true
        });
    }

    // extract a websocket packet which contains the information of cells
    function extractCellPacket(data, offset) {
        ////
        var dataToSend = {
            destroyQueue : [],
            nodes : [],
            nonVisibleNodes : []
        };
        ////

        var I = +new Date();
        var qa = false;
        var b = Math.random(), c = offset;
        var size = data.getUint16(c, true);
        c = c + 2;

        // Nodes to be destroyed (killed)
        for (var e = 0; e < size; ++e) {
            var p = cells[data.getUint32(c, true)],
                f = cells[data.getUint32(c + 4, true)];
            c = c + 8;
            if(p && f){
                f.destroy();
                f.ox = f.x;
                f.oy = f.y;
                f.oSize = f.size;
                f.nx = p.x;
                f.ny = p.y;
                f.nSize = f.size;
                f.updateTime = I;
                dataToSend.destroyQueue.push(f.id);
            }
        }

        // Nodes to be updated
        for (e = 0; ; ) {
            var id = data.getUint32(c, true); /* playerID */
            c += 4;
            if (0 === id) {
                break;
            }
            ++e;
            var p = data.getInt32(c, true); /* x */
            c = c + 4;

            var f = data.getInt32(c, true); /* y */
            c = c + 4;

            g = data.getInt16(c, true); /* radius */
            c = c + 2;
            for (var h = data.getUint8(c++), m = data.getUint8(c++), q = data.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length; )
                h = "0" + h; /* color */

            var h = "#" + h, /* color */
                k = data.getUint8(c++), /* some flags */
                m = !!(k & 1), /* isVirus */
                q = !!(k & 16);/* isAgitated */

            if(k & 2) c += 4;
            if(k & 4) c += 8;
            if(k & 8) c += 16;

            for (var n, k = ""; ; ) {
                n = data.getUint16(c, true);
                c += 2;
                if (0 == n)
                    break;
                k += String.fromCharCode(n); /* name */
            }

            n = k;
            k = null;

            var updated = false;
            // if id in cells then modify it, otherwise create a new cell
            if(cells.hasOwnProperty(id)){
                k = cells[id];
                k.updatePos();
                k.ox = k.x;
                k.oy = k.y;
                k.oSize = k.size;
                k.color = h;
                updated = true;
            }else{
                k = new Cell(id, p, f, g, h, n);
                k.pX = p;
                k.pY = f;
            }

            k.isVirus = m;
            k.isAgitated = q;
            k.nx = p;
            k.ny = f;
            k.updateCode = b;
            k.updateTime = I;
            k.nSize = g;
            if(n) k.setName(n);

            // ignore food creation
            if (updated) {
                dataToSend.nodes.push({
                    id: k.id,
                    x: k.nx,
                    y: k.ny,
                    size: k.nSize,
                    color: k.color
                });
            }
        }

        // Destroy queue + nonvisible nodes
        b = data.getUint32(c, true);
        c += 4;
        for (e = 0; e < b; e++) {
            var d = data.getUint32(c, true);
            c += 4;
            var k = cells[d];
            if(null != k) k.destroy();
            dataToSend.nonVisibleNodes.push(d);
        }

        var packet = {
            type: 16,
            data: dataToSend
        };

        miniMapSendRawData(msgpack.pack(packet));
    }

    // extract the type of packet and dispatch it to a corresponding extractor
    function extractPacket(event) {
        var c = 0;
        var data = new DataView(event.data);
        if(240 == data.getUint8(c)) c += 5;
        var opcode = data.getUint8(c);
        c++;
        switch (opcode) {
            case 16: // cells data
                extractCellPacket(data, c);
                break;
            case 20: // cleanup ids
                current_cell_ids = [];
                break;
            case 32: // cell id belongs me
                var id = data.getUint32(c, true);

                if (current_cell_ids.indexOf(id) === -1)
                    current_cell_ids.push(id);

                miniMapSendRawData(msgpack.pack({
                    type: 32,
                    data: id
                }));
                break;
            case 64: // get borders
                start_x = data.getFloat64(c, !0);
                c += 8;
                start_y = data.getFloat64(c, !0);
                c += 8;
                end_x = data.getFloat64(c, !0);
                c += 8;
                end_y = data.getFloat64(c, !0);
                c += 8;
                center_x = (start_x + end_x) / 2;
                center_y = (start_y + end_y) / 2;
                length_x = Math.abs(start_x - end_x);
                length_y = Math.abs(start_y - end_y);
        }
    }

    function extractSendPacket(data) {
        var view = new DataView(data);
        switch (view.getUint8(0, true)) {
            case 0:
                player_name = [];
                for (var i=1; i < data.byteLength; i+=2) {
                    player_name.push(view.getUint16(i, true));
                }

                miniMapSendRawData(msgpack.pack({
                    type: 0,
                    data: player_name
                }));
                break;
        }
    }

    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function(url, protocols) {
        console.log('Listen');

        if (protocols === undefined) {
            protocols = [];
        }

        var ws = new _WebSocket(url, protocols);

        refer(this, ws, 'binaryType');
        refer(this, ws, 'bufferedAmount');
        refer(this, ws, 'extensions');
        refer(this, ws, 'protocol');
        refer(this, ws, 'readyState');
        refer(this, ws, 'url');

        this.send = function(data){
            extractSendPacket(data);
            return ws.send.call(ws, data);
        };

        this.close = function(){
            return ws.close.call(ws);
        };

        this.onopen = function(event){};
        this.onclose = function(event){};
        this.onerror = function(event){};
        this.onmessage = function(event){};

        ws.onopen = function(event) {
            var ret;
            if (this.onopen)
                ret = this.onopen.call(ws, event);
            miniMapInit();
            agarServerAddress = this.url;
            miniMapSendRawData(msgpack.pack({
                type: 100,
                data: getAgarServerInfo(),
            }));
            miniMapSendRawData(msgpack.pack({type: 50}));
            return ret;
        }.bind(this);

        ws.onmessage = function(event) {
            var ret;
            if (this.onmessage)
                ret = this.onmessage.call(ws, event);
            if(injectOnMessage){
                extractPacket(event);
            }
            return ret;
        }.bind(this);

        ws.onclose = function(event) {
            if (this.onclose)
                return this.onclose.call(ws, event);
        }.bind(this);

        ws.onerror = function(event) {
            if (this.onerror)
                return this.onerror.call(ws, event);
        }.bind(this);
    };

    window.WebSocket.prototype = _WebSocket;

    $(window.document).ready(function() {
        miniMapInit();
    });

    unsafeWindow.Minimap = {
        /* official server message */
        Clear : function(){
            current_cell_ids = [];
        },
        UpdateData : function(data){
            var packet = {
                type: 16,
                data: data
            };
            miniMapSendRawData(msgpack.pack(packet));
        },
        OwnCell : function(id){
            if (current_cell_ids.indexOf(id) === -1)
                current_cell_ids.push(id);

            miniMapSendRawData(msgpack.pack({
                type: 32,
                data: id
            }));
        },
        SetGameAreaSize : function(mapLeft, mapTop, mapRight, mapBottom){
            start_x = mapLeft;
            start_y = mapTop;
            end_x = mapRight;
            end_y = mapBottom;
            center_x = (start_x + end_x) / 2;
            center_y = (start_y + end_y) / 2;
            length_x = Math.abs(start_x - end_x);
            length_y = Math.abs(start_y - end_y);
        },

        /* Map operation */
        MiniMapUnregisterTokenLocal : function(id){
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                miniMapUnregisterToken(id);
            }
        },
        MiniMapUpdateToken : function (id, color, x, y, size) {
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                if (!miniMapIsRegisteredToken(id)) {
                    miniMapRegisterToken(
                        id,
                        miniMapCreateToken(id, color)
                    );
                }
                miniMapUpdateToken(id,
                                   (x - start_x)/length_x,
                                   (y - start_y)/length_y,
                                   size / length_x);
            }
        },
        MiniMapUpdatePos : function(x, y) {
            miniMapUpdatePos(x, y);
        },

        /* API */
        ToggleSidebar : function(){
            $('#sidebar-wrapper').toggleClass('toggled');
        },

        /* Data Object */
        MapEvent : mapEvent,
    };

})();

var _version_ = GM_info.script.version;

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js");

jQuery("#canvas").remove();
jQuery("#connecting").after('<canvas id="canvas-main" style="z-index=0;position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;"></canvas>');
jQuery("#connecting").after('<canvas id="canvas-background" style="z-index=-1;position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;"></canvas>');

(function(d, jQuery) {

    // Render variables
    var mainCtx;
    var backgroundCtx;
    var mainCanvasElement;
    var backgroundCanvasElement;
    var windowWidth;
    var windowHeight;

    // Game variable
    var zoomFactor = 10;
    var isGrazing = false;
    var isFastFire = false;
    var isFastSpace = false;
    var fastSplitCounter = 0;
    var serverIP = "";
    var showVisualCues = true;
    var toggleAdvCellInfo = false;
    var focusTarget = null;
    var lastMouseCoords = { x: 0, y: 0 };

    // Game State & Info
    var highScore = 0;
    var timeSpawned = null;
    var grazzerTargetResetRequest = false;
    var suspendMouseUpdates = false;
    var grazingTargetFixation = false;
    var selectedBlobID = null;

    var ghostBlobs = [];

    var virusNameCache = []; /* the text of times to shoot */

    /* Constants */

    /* Size ratio to eat / split-eat, there was a small difference to original 
     * ratio, to avoid round-off error
     */
    var Huge = 2.65,
        Large = 1.24,
        Small = 0.73,
        Tiny = 0.370;

    var cellBorderWidth = 0.13; /* relative to cell size */

    /* Colors */
    var Huge_Color = "#FF0000",
        Large_Color = "#F9F900",
        Same_Color = "#00FFFF",
        Small_Color  = "#59FF00",
        Tiny_Color = "#009100",
        myColor ="#6A6AFF",
        virusColor ="#454545";
        virusStrokeColor ="#757575";

    var DayModeColors = {
        backgroundColor : "#EDFCDF",
        gridLinesColor : "#000000",
        coordinateTextColor : "#DDECCF",
        highlightedVirusColor : "#00FF3C",
    };

    var NightModeColors = {
        backgroundColor : "#000000",
        gridLinesColor : "#AAAAAA",
        coordinateTextColor : "#333333",
        highlightedVirusColor : "#00FF3C",
    };

    var zhtw_dict = {
        leaderboard : "排行榜",
        unnamed_cell : "路人",
        score : "分數",
        highscore : "最高分數",
        splitcount : "分裂數量",
        alivetime : "存活時間",
    };

    // cobbler is the object that holds all user options. Options that should never be persisted can be defined here.
    // If an option setting should be remembered it can
    var cobbler = {
        set grazingMode(val)    {isGrazing = val;},
        get grazingMode()       {return isGrazing;},
        isAcid : false,
        minimapScaleCurrentValue : 1,
    };

    // utility function to simplify creation of options whose state should be persisted to disk
    function simpleSavedSettings(optionsObject){
        _.forEach(optionsObject, function(defaultValue, settingName){
            var backingVar = '_' + settingName;
            cobbler[backingVar] = GM_getValue(settingName, defaultValue);
            Object.defineProperty(cobbler, settingName, {
                get: function()     { return this[backingVar];},
                set: function(val)  { this[backingVar] = val; GM_setValue(settingName, val); }
            });
        });
    }
    // defines all options that should be persisted along with their default values.
    function makeCobbler(){
        var optionsAndDefaults = {
            "isLiteBrite"       : true,
            "sfxVol"            : 0.5,
            "bgmVol"            : 0.5,
            "showmass"          : true,
            "drawMovementLine"  : true,
            "drawCoordinate"    : true,
            "splitGuide"        : true,
            "hintColor"         : true,
            "debugLevel"        : 1,
            "imgurSkins"        : true,
            "daChongSkins"        : true,
            "amExtendedSkins"   : true,
            "amConnectSkins"    : true,
            "grazerMultiBlob2"  : false, // TODO: remove this feature due to update from official server
            "grazerHybridSwitch": false,
            "grazerHybridSwitchMass" : 300,
            "gridLines"         : false,
            "autoRespawn"       : false,
            "visualizeGrazing"  : true,
            "msDelayBetweenShots" : 100,
            "miniMapScale"      : false,
            "miniMapScaleValue" : 64,
            'rightClickFires'   : false,
            'showZcStats'       : false,
            'isNightMode'       : true,
            'simpleCellDraw'    : true,
            'rainbowPellet'     : false,
            'cellBorder'        : true,
            'latencyButNotLag'  : true,
        };
        simpleSavedSettings(optionsAndDefaults);
    }
    makeCobbler();

    window.cobbler = cobbler;

    // ======================   Property & Var Name Restoration  =======================================================
    var zeach = {
        get isShowSkins()   {return fb;},       // g_showSkins
        get gameMode()      {return O;},        // g_mode
        get fireFunction()  {return G;},        // SendCmd
        get scale()   {return windowScale;},        //
        // Classes
        // These never existed before but are useful
        get mapWidth()      {return  ~~(Math.abs(mapLeft) + mapRight);},
        get mapHeight()  {return  ~~(Math.abs(mapTop) + mapBottom);},
        get dict()       {return zhtw_dict;},
    };


    /* ======================   Utility code    ============================= */
    function getColors(){
        return cobbler.isNightMode ? NightModeColors : DayModeColors;
    }

    function getSelectedBlob(){
        if(!_.contains(myIDs, selectedBlobID) && isPlayerAlive()){
            selectedBlobID = myCells[0].id;
        }else if(!cellsByID[selectedBlobID]){
            selectedBlobID = allCells[0].id;
        }
        return cellsByID[selectedBlobID];
    }

    function isPlayerAlive(){
        return !!myCells.length;
    }

    function sendMouseUpdate(ws, mouseX2, mouseY2, blob) {

        lastMouseCoords = {x: mouseX2, y: mouseY2};

        var outputMouseCoords = lastMouseCoords;
        if(focusTarget != null && !isPlayerAlive()){
            outputMouseCoords = {x: focusTarget.x + Math.random(), y: focusTarget.y + Math.random()};
        }

        if (ws && ws.readyState == ws.OPEN) {
            var blobId = blob ? blob.id : 0;
            var z0 = new ArrayBuffer(13);
            var z1 = new DataView(z0);
            z1.setUint8(0, 16);
            z1.setInt32(1, outputMouseCoords.x, true);
            z1.setInt32(5, outputMouseCoords.y, true);
            z1.setUint32(9, blobId, true);
            ws.send(z0);
        }
    }

    function getMass(x){
        return x*x/100;
    }

    function lineDistance( point1, point2 ){
        var xs = point2.nx - point1.nx;
        var ys = point2.ny - point1.ny;

        return Math.sqrt( xs * xs + ys * ys );
    }

    function getVirusShotsNeededForSplit(cellSize){
        return ~~((149-cellSize)/7);
    }

    function calcTTR(element){

        var totalMass = _.sum(_.pluck(myCells, "nSize").map(getMass));
        var estimatedTime = ~~((((totalMass*0.02)*1000)+30000) / 1000) - ~~((Date.now() - element.splitTime) / 1000);
        return estimatedTime > 0 ? estimatedTime : "";
    }

    function getBlobShotsAvailable(blob) {
        return ~~(Math.max(0, (getMass(blob.nSize)-(35-18))/18));
    }

    function distanceFromCellZero(blob) {
        return isPlayerAlive() ? lineDistance(blob, getSelectedBlob()) :
        Math.sqrt((mapRight - mapLeft) * (mapRight - mapLeft) + (mapBottom - mapTop) * (mapBottom - mapTop));
    }

    function getViewport(interpolated) {
        var x =  _.sum(_.pluck(myCells, interpolated ? "x" : "nx")) / myCells.length;
        var y =  _.sum(_.pluck(myCells, interpolated ? "y" : "ny")) / myCells.length;
        var totalRadius =  _.sum(_.pluck(myCells, interpolated ? "size" : "nSize"));
        var zoomFactor = Math.pow(Math.min(64.0 / totalRadius, 1), 0.4);
        var deltaX = 1024 / zoomFactor;
        var deltaY = 600 / zoomFactor;
        return { x: x, y: y, dx: deltaX, dy: deltaY };
    }

    function getMouseCoordsAsPseudoBlob(){
        return {
            "x": gameMouseX,
            "y": gameMouseY,
            "nx": gameMouseX,
            "ny": gameMouseY,
        };
    }

    /* ======================   Grazing code    ============================= */

    function checkCollision(myBlob, targetBlob, potential){
        // Calculate distance to target
        var dtt = lineDistance(myBlob, targetBlob);
        // Slope and normal slope
        var sl = (targetBlob.ny-myBlob.ny)/(targetBlob.nx-myBlob.nx);
        var ns = -1/sl;
        // y-int of ptt
        var yint1 = myBlob.ny - myBlob.nx*sl;
        if(lineDistance(myBlob, potential) >= dtt){
            // get second y-int
            var yint2 = potential.ny - potential.nx * ns;
            var interx = (yint2-yint1)/(sl-ns);
            var intery = sl*interx + yint1;
            var pseudoblob = {};
            pseudoblob.nx = interx;
            pseudoblob.ny = intery;
            if (((targetBlob.nx < myBlob.nx && targetBlob.nx < interx && interx < myBlob.nx) ||
                 (targetBlob.nx > myBlob.nx && targetBlob.nx > interx && interx > myBlob.nx)) &&
                ((targetBlob.ny < myBlob.ny && targetBlob.ny < intery && intery < myBlob.ny) ||
                 (targetBlob.ny > myBlob.ny && targetBlob.ny > intery && intery > myBlob.ny))){
                if(lineDistance(potential, pseudoblob) < potential.size+100){
                    return true;
                }
            }
        }
        return false;
    }

    function isSafeTarget(myBlob, targetBlob, threats){
        var isSafe = true;
        // check target against each enemy to make sure no collision is possible
        threats.forEach(function (threat){
            if(isSafe) {
                if(threat.isVirus) {
                    //todo once we are big enough, our center might still be far enough
                    // away that it doesn't cross virus but we still pop
                    if(checkCollision(myBlob, targetBlob, threat) )  {
                        isSafe = false;
                    }
                }
                else {
                    if ( checkCollision(myBlob, targetBlob, threat) || lineDistance(threat, targetBlob) <= threat.size + 200) {
                        isSafe = false;
                    }
                }
            }
        });
        return isSafe;
    }

    // All blobs that aren't mine
    function getOtherBlobs(){
        return _.omit(cellsByID, myIDs);
    }

    // Gets any item which is a threat including bigger players and viruses
    function getThreats(blobArray, myMass) {
        // start by omitting all my IDs
        // then look for viruses smaller than us and blobs substantially bigger than us
        return _.filter(getOtherBlobs(), function(possibleThreat){
            var possibleThreatMass = getMass(possibleThreat.size);

            if(possibleThreat.isVirus) {
                // Viruses are only a threat if we are bigger than them
                return myMass >= possibleThreatMass;
            }
            // other blobs are only a threat if they cross the 'Large' threshhold
            return possibleThreatMass > myMass * Large;
        });
    }

    var throttledResetGrazingTargetId = null;

    function doGrazing() {
        var i;
        if(!isPlayerAlive()) {
            //isGrazing = false;
            return;
        }

        if(null === throttledResetGrazingTargetId){
            throttledResetGrazingTargetId = _.throttle(function (){
                grazzerTargetResetRequest = 'all';
                //console.log(~~(Date.now()/1000));
            }, 200);
        }


        if (grazzerTargetResetRequest == 'all') {
            grazzerTargetResetRequest = false;

            for(i = 0; i < myCells.length; i++) {
                myCells[i].grazingTargetID = false;
            }
        } else if (grazzerTargetResetRequest == 'current') {
            var pseudoBlob = getMouseCoordsAsPseudoBlob();

            pseudoBlob.size = getSelectedBlob().size;
            //pseudoBlob.scoreboard = scoreboard;
            var newTarget = findFoodToEat_old(pseudoBlob,allCells);
            if(-1 == newTarget){
                isGrazing = false;
                return;
            }
            getSelectedBlob().grazingTargetID = newTarget.id;
        }

        // with target fixation on, target remains until it's eaten by someone or
        // otherwise disappears. With it off target is constantly recalculated
        // at the expense of CPU
        if(!grazingTargetFixation) {
            throttledResetGrazingTargetId();
        }

        var target;


        var targets = findFoodToEat(!cobbler.grazerMultiBlob2);
        for(i = 0; i < myCells.length; i++) {
            var point = myCells[i];

            if (!cobbler.grazerMultiBlob2 && point.id != getSelectedBlob().id) {
                continue;
            }

            point.grazingMode = isGrazing;
            if(cobbler.grazerHybridSwitch) {
                var mass = getMass(point.nSize);
                // switch over to new grazer once we pass the threshhold
                if(1 === point.grazingMode && mass > cobbler.grazerHybridSwitchMass){
                    point.grazingMode = 2; // We gained enough much mass. Use new grazer.
                }else if(2 === point.grazingMode && mass < cobbler.grazerHybridSwitchMass ){
                    point.grazingMode = 1; // We lost too much mass. Use old grazer.
                }
            }
            switch(point.grazingMode) {
                case 1: {

                    if(!cellsByID.hasOwnProperty(point.grazingTargetID)) {
                        target = findFoodToEat_old(point, allCells);
                        if(-1 == target){
                            point.grazingMode = 2;
                            return;
                        }
                        point.grazingTargetID = target.id;
                    } else {
                        target = cellsByID[point.grazingTargetID];
                    }
                    if (!cobbler.grazerMultiBlob2) {
                        sendMouseUpdate(webSocket, target.x + Math.random(), target.y + Math.random());
                    } else {
                        sendMouseUpdate(webSocket, target.x + Math.random(), target.y + Math.random(), point);
                    }

                    break;
                }
                case 2: {
                    if (!cobbler.grazerMultiBlob2) {
                        target = _.max(targets, "allCells");
                        sendMouseUpdate(webSocket, target.x + Math.random(), target.y + Math.random());
                    } else {
                        target = targets[point.id];
                        sendMouseUpdate(webSocket, target.x + Math.random(), target.y + Math.random(), point);
                    }

                    break;
                }
            }
        }

    }

    function dasMouseSpeedFunction(id, cx, cy, radius, nx, ny) {
        this.cx = cx; this.cy = cy; this.radius = radius; this.nx = nx; this.ny = ny;
        this.value = function(x, y) {
            x -= this.cx; y -= this.cy;
            var lensq = x*x + y*y;
            var len = Math.sqrt(lensq);

            var val = x * this.nx + y * this.ny;
            if (len > this.radius) {
                return {
                    id : id,
                    v: val / len,
                    dx: y * (this.nx * y - this.ny * x) / (lensq * len),
                    dy: x * (this.ny * x - this.nx * y) / (lensq * len),
                };
            } else {
                return {id: id, v: val / this.radius, dx: this.nx, dy: this.ny};
            }
        };
    }

    function dasBorderFunction(l, t, r, b, w) {
        this.l = l; 
        this.t = t;
        this.r = r; 
        this.b = b; 
        this.w = w;
        this.value = function(x, y) {
            var v = 0, dx = 0, dy = 0;
            if (x < this.l) {
                v += this.l - x;
                dx = -this.w;
            } else if (x > this.r) {
                v += x - this.r;
                dx = this.w;
            }

            if (y < this.t) {
                v += this.t - y;
                dy = -this.w;
            } else if (y > this.b) {
                v += y - this.b;
                dy = this.w;
            }

            return {v: v * this.w, dx: dx, dy: dy};
        };
    }

    function dasSumFunction(sumfuncs) {
        this.sumfuncs = sumfuncs;
        this.value = function(x, y) {
            return sumfuncs.map(function(func) {
                return func.value(x, y);
            }).reduce(function (acc, val) {
                acc.v += val.v; acc.dx += val.dx; acc.dy += val.dy;
                return acc;
            });
        };
    }

    function gradient_ascend(func, step, iters, id, x, y) {
        var max_step = step;

        var last = func.value(x, y);

        while(iters > 0) {
            iters -= 1;

            x += last.dx * step;
            y += last.dy * step;
            var tmp = func.value(x, y);
            if (tmp.v < last.v) {
                step /= 2;
            } else {
                step = Math.min(2 * step, max_step);
            }
            //console.log([x, y, tmp[0], step]);

            last.v = tmp.v;
            last.dx = (last.dx + tmp.dx)/2.0;
            last.dy = (last.dy + tmp.dy)/2.0;
        }

        return {id: id, x: x, y: y, v: last.v};
    }

    function augmentBlobArray(blobArray) {

        blobArray = blobArray.slice();

        var curTimestamp = Date.now();

        // Outdated blob id set
        var ghostSet = [];

        blobArray.forEach(function (element) {
            ghostSet[element.id] = true;
            element.lastTimestamp = curTimestamp;
        });

        var viewport = getViewport(false);

        ghostBlobs = _.filter(ghostBlobs, function (element) {
            return !ghostSet[element.id] && // a fresher blob with the same id doesn't exist in blobArray already
                (curTimestamp - element.lastTimestamp < 10000) && // last seen no more than 10 seconds ago
                (
                (Math.abs(viewport.x - element.nx) > (viewport.dx + element.nSize) * 0.9) ||
                (Math.abs(viewport.y - element.ny) > (viewport.dy + element.nSize) * 0.9)
            ); // outside of firmly visible area, otherwise there's no need to remember it
        });

        ghostBlobs.forEach(function (element) {
            blobArray.push(element);
        });

        ghostBlobs = blobArray;

        return blobArray;
    }
    function findFoodToEat(useGradient) {
        blobArray = augmentBlobArray(allCells);

        myCells.forEach(function(cell) {
            cell.gr_is_mine = true;
        });

        var accs = myCells.map(function (cell) {


            var per_food = [], per_threat = [];
            var acc = {
                id : cell.id,
                fx: 0,
                fy: 0,
                x: cell.nx,
                y: cell.ny,
                size : cell.nSize,
                per_food: per_food,
                per_threat: per_threat,
                cumulatives: [ { x: 0, y: 0}, { x: 0, y: 0} ],
            };

            if (!useGradient && cell.grazingMode != 2) {
                return acc;
            }

            var totalMass = _.sum(_.pluck(myCells, "nSize").map(getMass));

            // Avoid walls too
            var wallArray = [];
            wallArray.push({id: -2, nx: cell.nx, ny: mapTop - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -3, nx: cell.nx, ny: mapBottom + 1, nSize: cell.nSize * 30});
            wallArray.push({id: -4, ny: cell.ny, nx: mapLeft - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -5, ny: cell.ny, nx: mapRight + 1, nSize: cell.nSize * 30});
            wallArray.forEach(function(el) {
                // Calculate repulsion vector
                var vec = { id: el.id, gr_type: true, x: cell.nx - el.nx, y: cell.ny - el.ny };
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                // Walls have pseudo-size to generate repulsion, but we can move farther.
                dist += cell.nSize / 2.0;

                dist = Math.max(dist, 0.01);

                // Walls. Hate them muchly.
                dist /= 10;

                // The more we're split and the more we're to lose, the more we should be afraid.
                dist /= cell.nSize * Math.sqrt(myCells.length);

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                per_threat.push(vec);

                // Sum forces from all threats
                acc.fx += vec.x;
                acc.fy += vec.y;
            });

            blobArray.forEach(function(el) {
                var vec = { id: el.id, x: cell.nx - el.nx, y: cell.ny - el.ny };

                if(el.gr_is_mine) {
                    return; //our cell, ignore
                } else if( !el.isVirus && (getMass(el.nSize) * 4 <= getMass(cell.nSize) * 3)) {
                    //if(!el.isVirus && (getMass(el.nSize) <= 9)) {
                    //vec.gr_type = null; //edible
                } else if (!el.isVirus && (getMass(el.nSize) * 3 < (getMass(cell.nSize) * 4))) {
                    return; //not edible ignorable
                    // TODO: shouldn't really be so clear-cut. Must generate minor repulsion/attraction depending on size.
                } else {
                    vec.gr_type = true; //threat
                }

                // Calculate repulsion vector
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                if(el.nSize > cell.nSize) {
                    if(el.isVirus) {
                        // Viruses are only a threat if they're smaller than us
                        return;
                    }

                    // Distance till consuming
                    dist -= el.nSize;
                    dist += cell.nSize /　3.0;
                    dist -= 11;

                    dist = Math.max(dist, 0.01);

                    // Prioritize targets by size
                    if(!vec.gr_type) {
                        //Non-threat
                        dist /= el.nSize;
                    } else {
                        var ratio = getMass(el.nSize) / getMass(cell.nSize);
                        // Cells that 1 to 8 times bigger are the most dangerous.
                        // Prioritize them by a truncated parabola up to 6 times.

                        // when we are fractured into small parts, we might underestimate
                        // how cells a lot bigger than us can be interested in us as a conglomerate of mass.
                        // So calculate threat index for our total mass too.
                        var ratio2 = getMass(el.nSize) / totalMass;
                        if(ratio2 < 4.5 && ratio > 4.5) {
                            ratio2 = 4.5;
                        }

                        ratio = Math.min(5, Math.max(0, - (ratio - 1) * (ratio - 8))) + 1;
                        ratio2 = Math.min(5, Math.max(0, - (ratio2 - 1) * (ratio2 - 8))) + 1;
                        ratio = Math.max(ratio, ratio2);

                        // The more we're split and the more we're to lose, the more we should be afraid.
                        dist /= ratio * cell.nSize * Math.sqrt(myCells.length);
                    }

                } else {
                    // Distance till consuming
                    dist += el.nSize * 1 / 3;
                    dist -= cell.nSize;
                    dist -= 11;

                    if(el.isVirus) {
                        if(myCells.length >= 16 ) {
                            // Can't split anymore so viruses are actually a good food!
                            delete vec.gr_type; //vec.gr_type = null;
                        } else {
                            // Hate them a bit less than same-sized blobs.
                            dist *= 2;
                        }
                    }

                    dist = Math.max(dist, 0.01);

                    // Prioritize targets by size
                    dist /= el.nSize;
                }

                if(!vec.gr_type) {
                    //Not a threat. Make it attractive.
                    dist = -dist;
                }

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                (vec.gr_type ? per_threat : per_food).push(vec);

                // Sum forces per target type
                var cumul = acc.cumulatives[!vec.gr_type ? 1 : 0];
                cumul.x += vec.x;
                cumul.y += vec.y;
            });

            // Sum forces from all sources
            acc.fx += _.sum(_.pluck(acc.cumulatives, "x"));
            acc.fy += _.sum(_.pluck(acc.cumulatives, "y"));

            // Save resulting info for visualization
            cell.grazeInfo = acc;
            return acc;
        });

        var result;
        if (useGradient) {
            var funcs = accs.map(function(acc) {
                return new dasMouseSpeedFunction(acc.id, acc.x, acc.y, 200, acc.fx, acc.fy);
            });

            // Pick gradient ascent step size for better convergence
            // so that coord jumps don't exceed ~50 units
            var step = _.sum(accs.map(function(acc) {
                return Math.sqrt(acc.fx * acc.fx + acc.fy * acc.fy);
            }));
            step = 50 / step;
            if(!isFinite(step)) {
                step = 50;
            }

            var viewport = getViewport(false);
            funcs.push(
                new dasBorderFunction(
                    viewport.x - viewport.dx,
                    viewport.y - viewport.dy,
                    viewport.x + viewport.dx,
                    viewport.y + viewport.dy,
                    -1000
                )
            );

            var func = new dasSumFunction(funcs);

            results = accs.map(function(acc) {
                return gradient_ascend(func, step, 100, acc.id, acc.x, acc.y);
            });
        } else {
            results = accs.map(function(acc) { 
                var norm = Math.sqrt(acc.fx * acc.fx + acc.fy * acc.fy);
                return {id: acc.id, x: acc.x + 200 * acc.fx / norm, y: acc.y + 200 * acc.fy / norm };
            });
        }


        var reply = {};
        for (var i = 0; i < results.length; i++) {
            reply[results[i].id] = {id : -5, x : results[i].x, y : results[i].y, v : results[i].v};
        }

        return reply;
    }


    function findFoodToEat_old(cell, blobArray){
        var edibles = [];
        var densityResults = [];
        var threats = getThreats(blobArray, getMass(cell.size));
        blobArray.forEach(function (element){
            var distance = lineDistance(cell, element);
            if (!element.isSafeTarget) {
                element.isSafeTarget = {};
            }
            element.isSafeTarget[cell.id] = null;
            if( getMass(element.size) <= (getMass(cell.size) * 0.4) && !element.isVirus){
                if(isSafeTarget(cell, element, threats)){
                    edibles.push({"distance":distance, "id":element.id});
                    element.isSafeTarget[cell.id] = true;
                } else {
                    element.isSafeTarget[cell.id] = false;
                }
            }
        });
        edibles = edibles.sort(function(x,y){return x.distance<y.distance?-1:1;});
        edibles.forEach(function (element){
            var density = calcFoodDensity(cell, cellsByID[element.id], blobArray)/(element.distance*2);
            densityResults.push({"density":density, "id":element.id});
        });
        if(0 === densityResults.length){
            //console.log("No target found");
            return avoidThreats(threats, cell);
        }
        var target = densityResults.sort(function(x,y){return x.density>y.density?-1:1;});
        //console.log("Choosing blob (" + target[0].id + ") with density of : "+ target[0].isVirusensity);
        return cellsByID[target[0].id];
    }

    function avoidThreats(threats, cell){
        // Avoid walls too
        threats.push({x: cell.x, y: mapTop - 1, size: 1});
        threats.push({x: cell.x, y: mapBottom + 1, size: 1});
        threats.push({y: cell.y, x: mapLeft - 1, size: 1});
        threats.push({y: cell.y, x: mapRight + 1, size: 1});

        var direction = threats.reduce(function(acc, el) {
            // Calculate repulsion vector
            var vec = { x: cell.x - el.x, y: cell.y - el.y };
            var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

            // Normalize it to unit length
            vec.x /= dist;
            vec.y /= dist;

            // Take enemy cell size into account
            dist -= el.size;

            // The farther they're from us the less repulsive they are
            vec.x /= dist;
            vec.y /= dist;

            // Sum forces from all threats
            acc.x += vec.x;
            acc.y += vec.y;

            return acc;
        }, {x: 0, y: 0});

        // Normalize force to unit direction vector
        var dir_norm = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x /= dir_norm;
        direction.y /= dir_norm;

        if(!isFinite(direction.x) || !isFinite(direction.y)) {
            return -1;
        }

        return { id: -5, x: cell.x + direction.x * cell.size * 5, y: cell.y + direction.y * cell.size * 5 };
    }

    function calcFoodDensity(cell, cell2, blobArray2){
        var MaxDistance2 = 250;
        var pelletCount = 0;
        blobArray2.forEach(function (element2){
            var distance2 = lineDistance(cell2, element2);

            var cond1 = getMass(element2.size) <= (getMass(cell.size) * 0.4);
            var cond2 = distance2 < MaxDistance2;
            var cond3 = !element2.isVirus;
            //console.log(cond1 + " " + distance2 + " " + cell2.isSafeTarget);
            if( cond1 && cond2 && cond3 && cell2.isSafeTarget[cell.id] ){
                pelletCount +=1;
            }
        });

        return pelletCount;
    }

    /* ======================     UI Stuff      ============================= */

    function drawRescaledItems(ctx) {
        if (showVisualCues && isPlayerAlive()) {
            drawGrazingLines_hy(ctx);
            drawGrazingLines(ctx);
            if(cobbler.drawMovementLine){
                drawMovementLine(ctx);
            }


            drawSplitGuide(ctx, getSelectedBlob());
        }
    }

    function getLeftBottomExtraInfo(F) {
        var extras = " ";
        if (showVisualCues) {
            highScore = Math.max(highScore, ~~(F / 100));
            extras += translate("highscore") + ":" + highScore.toString();
            if (isPlayerAlive()) {
                extras += " " + translate("alivetime") + " : " + (~~((Date.now() - timeSpawned) / 1000)).toString();
                extras += " " + translate("splitcount") + " : " + myCells.length;
            }
        }
        return extras;
    }

    function adjustCellColor(cell, ctx) {
        var color = cell.color;
        var strokeColor = cell.color;
        if(isColorsDisabled) {
            color = "#FFFFFF";
            strokeColor = "#AAAAAA";
        }else{
            if(!cobbler.rainbowPellet && getMass(cell.size) < 5){
                color = "#CCCCFF";
                strokeColor = "#CCCCFF";
            }else if(cell.isVirus) {
                color = virusColor;
                strokeColor = virusStrokeColor;
            }else if(cobbler.hintColor){
                color = getHintColor(cell, myCells);
                strokeColor = getHintColor(cell, myCells);
            }
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }

    function drawMapCoordinate(ctx){
        if(cobbler.drawCoordinate){
            var yAxis = ['A', 'B', 'C', 'D', 'E'];
            var xSize = mapRight - mapLeft;
            var ySize = mapBottom - mapTop;

            ctx.save();
            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.lineWidth = 10;
            ctx.textBaseline = 'middle';
            ctx.font = (.8 * xSize / 5) + 'px Arial';
            ctx.fillStyle = ctx.strokeStyle = getColors().coordinateTextColor;
            for (var j = 0; j < 5; ++j) {
                for (var i = 0; i < 5; ++i) {
                    ctx.strokeRect((mapLeft + xSize / 5 * i), (mapTop + ySize / 5 * j), (xSize / 5), (ySize / 5));
                    ctx.fillText(yAxis[j] + (i + 1), (mapLeft + xSize / 5 * i) + (xSize / 5 / 2), (mapTop + ySize / 5 * j) + (ySize / 5 / 2));
                }
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawMapBorders(ctx) {
        if (cobbler.isNightMode) {
            ctx.strokeStyle = '#CCCCCC';
        }
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 50;
        ctx.moveTo(mapLeft, mapTop);        // 0
        ctx.lineTo(mapRight, mapTop);       // >
        ctx.lineTo(mapRight, mapBottom);    // V
        ctx.lineTo(mapLeft, mapBottom);     // <
        ctx.lineTo(mapLeft, mapTop);        // ^
        ctx.stroke();
            ctx.restore();
    }

    function drawSplitGuide(ctx, cell) {
        if(toggleAdvCellInfo){
            if( !isPlayerAlive() || !cobbler.splitGuide){
                return;
            }
            var radius = 660;
            var centerX = cell.x;
            var centerY = cell.y;
            var hold = ctx.globalAlpha;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius+cell.size, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00FF00';
            ctx.stroke();
            ctx.globalAlpha = hold;
        }
    }

    function isTeamMode(){
        return (zeach.gameMode === ":teams");
    }

    function getHintColor(cell){
        if(getMass(cell.size)< 8){ /* dot don't need hint color */
            return;
        }
        var color = cell.color;
        /* When not playing or in team mode, disable hint color */
        if (myCells.length > 0 && !isTeamMode()) {
            var size_this = getMass(cell.size);
            var size_that = getMass(getSelectedBlob().size);
            if (~myCells.indexOf(cell)) {
                color = myColor;
            } else if (size_this > size_that * Huge) {
                color = Huge_Color;
            } else if (size_this > size_that * Large) {
                color = Large_Color;
            } else if (size_this > size_that * Small) {
                color = Same_Color;
            } else if (size_this > size_that * Tiny) {
                color = Small_Color;
            } else {
                color = Tiny_Color;
            }
        }
        return color;
    }

    function displayDebugText(ctx, agarTextFunction) {
        if(0 >= cobbler.debugLevel) {
            return;
        }

        var textSize = 15;
        var debugStrings = [];
        if(1 <= cobbler.debugLevel) {
            debugStrings.push("v " + _version_);
            debugStrings.push("Server: " + serverIP);
            debugStrings.push("Move: " + (suspendMouseUpdates ? "Stopped" : "normal"));
            debugStrings.push("FPS: " + fps, " Pending packet: " + pendingPacket.length);
            debugStrings.push("FocusTarget : " + ((focusTarget !== null) ? focusTarget.name : "none"));
        }
        if(2 <= cobbler.debugLevel) {
            debugStrings.push("G - grazing: " + (isGrazing ? (1 == isGrazing) ? "Old" : "New" : "Off"));
            debugStrings.push("P - grazing target fixation :" + (grazingTargetFixation ? "On" : "Off"));
            if(grazingTargetFixation){ 
                debugStrings.push("  (T) to retarget");
            }
            debugStrings.push("Z - zoom: " + zoomFactor.toString());
            if (isPlayerAlive()) {
                debugStrings.push("Location: " + Math.floor(getSelectedBlob().x) + ", " + Math.floor(getSelectedBlob().y));
            }
        }

        var offsetValue = 20;
        var text = new agarTextFunction(textSize, (cobbler.isNightMode ? '#F2FBFF' : '#111111'));

        for (var i = 0; i < debugStrings.length; i++) {
            text.setValue(debugStrings[i]); // setValue
            var textRender = text.render();
            ctx.drawImage(textRender, 20, offsetValue);
            offsetValue += textRender.height;
        }
    }

    function drawLine(ctx, point1, point2, color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
    }

    function drawGrazingLines(ctx) {
        if(!isGrazing || !cobbler.visualizeGrazing ||  !isPlayerAlive())
        {
            //console.log("returning early");
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;
        var oldGlobalAlpha = ctx.globalAlpha;

        myCells.forEach(function(playerBlob) {
            if(!playerBlob.grazeInfo || playerBlob.grazingMode != 2) {
                return;
            }
            var grazeInfo = playerBlob.grazeInfo;

            var nullVec = { x: 0, y: 0 };
            var cumulatives = grazeInfo.cumulatives;
            var maxSize = 0.001;

            // Render threat forces
            grazeInfo.per_threat.forEach(function (grazeVec){
                var element = cellsByID[grazeVec.id];

                if(!element) return; //Wall or dead or something

                //drawLine(ctx,element, playerBlob, "red" );
                //drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "red" );
                drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "red" );

                var grazeVecLen = Math.sqrt(grazeVec.x * grazeVec.x + grazeVec.y * grazeVec.y);

                ctx.globalAlpha = 0.5 / myCells.length;
                ctx.beginPath();
                ctx.arc(element.x, element.y, grazeVecLen / maxSize / 20, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FFFFFF';
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            if(myCells.length <= 1) {
                // If we're not fragmented, render fancy food forces
                grazeInfo.per_food.forEach(function (grazeVec){
                    var element = cellsByID[grazeVec.id];

                    if(!element) return; //Wall or dead or something

                    //drawLine(ctx,element, playerBlob, "white" );
                    drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "green" );
                    //drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "green" );
                });
            }

            // Prepare to render cumulatives
            maxSize *= grazeInfo.per_threat.length + grazeInfo.per_food.length;
            maxSize /= 10;

            ctx.lineWidth = 10;

            // Render summary force without special forces, like walls
            drawLine(ctx,playerBlob,
                     {
                         x: playerBlob.x + (cumulatives[0].x + cumulatives[1].x) / maxSize,
                         y: playerBlob.y + (cumulatives[0].y + cumulatives[1].y) / maxSize,
                     }, "gray"
                    );

            // Render foods and threats force cumulatives
            drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[1].x / maxSize, y: playerBlob.y + cumulatives[1].y / maxSize }, "green" );
            drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[0].x / maxSize, y: playerBlob.y + cumulatives[0].y / maxSize }, "red" );

            // Render summary force with special forces, like walls
            ctx.lineWidth = 5;
            drawLine(ctx,playerBlob, {x: playerBlob.x + (grazeInfo.fx) / maxSize, y: playerBlob.y + (grazeInfo.fy) / maxSize }, "orange" );
            ctx.lineWidth = 1;
            drawLine(ctx,playerBlob, {x: playerBlob.x + 300 * (grazeInfo.fx) / maxSize, y: playerBlob.y + 300 * (grazeInfo.fy) / maxSize }, "orange" );
        });

        var viewport = getViewport(true);

        // Render sent mouse coords as a small circle
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(lastMouseCoords.x, lastMouseCoords.y, 0.01 * viewport.dx, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = cobbler.isNightMode ? '#FFFFFF' : '#000000';
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Render viewport borders, useful for blob lookout and 10-sec-memoization debugging
        ctx.strokeStyle = cobbler.isNightMode ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.stroke();

        ctx.globalAlpha = oldGlobalAlpha;
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;
    }

    function drawMovementLine(ctx) {
        var trailScale = 5;
        myCells.forEach(function(playerBlob) {
            drawLine(ctx,
                     {x: playerBlob.x, y:playerBlob.y},
                     getMouseCoordsAsPseudoBlob(),
                     '#777777' );
        });
    }

    function drawGrazingLines_hy(ctx) {
        if(!isGrazing || !cobbler.visualizeGrazing ||  !isPlayerAlive()) {
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;

        ctx.lineWidth = 10;
        for(var i = 0; i < myCells.length; i++) {
            var point = myCells[i];
            if (point.grazingMode != 1) {
                continue;
            }

            if(_.has(cellsByID, point.grazingTargetID)){
                drawLine(ctx, cellsByID[point.grazingTargetID], point, "green");
            }
        }

        ctx.lineWidth = 2;
        for(i = 0; i < myCells.length; i++) {
            var point = myCells[i];
            if (point.grazingMode != 1) {
                continue;
            }
            allCells.forEach(function (element){
                if (!element.isSafeTarget) {
                } else if(element.isSafeTarget[point.id] === true) {
                    drawLine(ctx, element, point, "white" );
                } else if (element.isSafeTarget[point.id] === false) {
                    drawLine(ctx, element, point, "red" );
                } else {
                    //drawLine(ctx,element, getSelectedBlob(), "blue" );
                }
            });
        }
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;

    }

    /* ======================   Virus Popper    ============================= */

    function findNearestCell(cell, blobArray){
        var nearestCell = _.min(_.filter(blobArray, "isVirus", false), function(element) {
            return lineDistance(cell, element);
        });

        if( Infinity == nearestCell){
            return null;
        }
        return nearestCell;
    }

    function findNearestVirus(cell, blobArray){
        var nearestVirus = _.min(_.filter(blobArray, "isVirus", true), function(element) {
            return lineDistance(cell, element);
        });

        if( Infinity == nearestVirus){
            return null;
        }
        return nearestVirus;
    }

    function fireAtVirusNearestToBlob(blob, blobArray) {
        var msDelayBetweenShots = cobbler.msDelayBetweenShots;
        nearestVirus = findNearestVirus(blob, blobArray);

        if(null === nearestVirus){
            console.log("No Nearby Virus Found");
            return;
        }

        var shotsNeeded = getVirusShotsNeededForSplit(nearestVirus.size);
        var shotsAvailable = myCells.reduce(
            function(sum,blob){ return sum + getBlobShotsAvailable(blob); },
            0
        );
        shotsNeeded = Math.min(shotsNeeded, shotsAvailable);

        suspendMouseUpdates = true;
        sendMouseUpdate(webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
        window.setTimeout(function () { sendMouseUpdate(webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random()); }, 25);

        // schedules all shots needed spaced evenly apart by of 'msDelayBetweenShots'
        // TODO: shotsFired not increments only by 1 when multiple cell owned.
        var shotsFired = 0;
        for ( ; shotsFired < shotsNeeded; shotsFired++){
            window.setTimeout(function () {
                sendMouseUpdate(webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
                zeach.fireFunction(21);
            }, msDelayBetweenShots *(shotsFired+1));
        }
        window.setTimeout(function () { suspendMouseUpdates = false;}, msDelayBetweenShots *(shotsFired+1));
    }

    function fireAtVirusNearestToCursor(){
        fireAtVirusNearestToBlob(getMouseCoordsAsPseudoBlob(), allCells);
    }

    /* ======================       Skins       ============================= */

    /* AgarioMod.com skins have been moved to the very end of the file */
    var extendedSkins = {
        "billy mays" : "http://i.imgur.com/HavxFJu.jpg",
        "stannis": "http://i.imgur.com/JyZr0CI.jpg",
        "shrek is love" : "http://i.imgur.com/QDhkr4C.jpg",
        "shrek is life" : "http://i.imgur.com/QDhkr4C.jpg",
        "blueeyes" : "http://i.imgur.com/wxCfUws.jpg",
        "ygritte"  : "http://i.imgur.com/lDIFCT1.png",
        "lord kience" : "http://i.imgur.com/b2UXk15.png",
    };

    var skinsSpecial = {
        "white  light": "https://i.imgur.com/4y8szAE.png",
        "tubbymcfatfuck" : "http://tinyurl.com/TubbyMcFatFuck",
        "texas  doge" : "http://i.imgur.com/MVsLldL.jpg",
        "doge  helper" : "http://i.imgur.com/FzZebpk.jpg",
        "controless " : "https://i.imgur.com/uD5SW8X.jpg",
        "sqochit" : "http://i.imgur.com/AnowvFI.jpg",
        "drunken" : "http://i.imgur.com/JeKNRss.png",
    };

    // special skins are defined in this script by me and are never translucent
    function isSpecialSkin(targetName){
        return skinsSpecial.hasOwnProperty(targetName.toLowerCase());
    }
    // special skins are defined in this script by me and can be translucent
    function isExtendedSkin(targetName){
        return extendedSkins.hasOwnProperty(targetName.toLowerCase());
    }

    /* XXX _. not optimized? */
    function isAgarioModsSkin(targetName){
        if(!cobbler.amExtendedSkins){
            return false;
        }
        return _.includes(agariomodsSkins, targetName);
    }
    function isImgurSkin(targetName){
        if(!cobbler.imgurSkins){
            return false;
        }
        return _.startsWith(targetName, "i/");
    }
    function isAMConnectSkin(targetName){
        if(!cobbler.amConnectSkins){
            return false;
        }
        return _.startsWith(targetName, "*");
    }
    function isDaChongSkin(targetName){
        if(!cobbler.daChongSkins){
            return false;
        }
        var i = targetName.lastIndexOf(":");
        return i == targetName.length - 2;
    }

    function customSkins(cell, defaultSkins, showSkins, gameMode) {
        var retval = null;
        var userName = cell.name;
        var userNameLowerCase = userName.toLowerCase();
        if(":teams" ==  gameMode)
        {
            retval = null;
        }
        else if(!cell.isAgitated && showSkins ){
            if(-1 != defaultSkins.indexOf(userNameLowerCase) || isSpecialSkin(userNameLowerCase) || isImgurSkin(userNameLowerCase) ||
               /* isAgarioModsSkin(userNameLowerCase) || XXX: way too slow*/
               isAMConnectSkin(userNameLowerCase) || isExtendedSkin(userNameLowerCase) || 
               isDaChongSkin(userNameLowerCase)){
                if (!imgCache.hasOwnProperty(userNameLowerCase)){
                    if(isSpecialSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = skinsSpecial[userNameLowerCase];
                    }
                    else if(isExtendedSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = extendedSkins[userNameLowerCase];
                    }
                    /* XXX: way too slow
                    else if(isAgarioModsSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://skins.agariomods.com/i/" + userNameLowerCase + ".png";
                    }
                    */
                    else if(isAMConnectSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://connect.agariomods.com/img_" + userNameLowerCase.slice(1) + ".png";
                    }
                    else if(isImgurSkin(userNameLowerCase)){
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://i.imgur.com/"+ userName.slice(2) +".png";
                    }
                    else if(isDaChongSkin(userNameLowerCase)){
                        lastChar =userNameLowerCase[userNameLowerCase.lastIndexOf(":") + 1];
                        imgCode = lastChar.charCodeAt(0);
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://upload.happyfor.me/getimg.php?id=" + imgCode + "&_t=" + Math.random();
                    }
                    else{
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "skins/" + userNameLowerCase + ".png";
                    }

                }
                if(0 !== imgCache[userNameLowerCase].width && imgCache[userNameLowerCase].complete) {
                    retval = imgCache[userNameLowerCase];
                } else {
                    retval = null;
                }
            }
            else {
                retval = null;
            }
        }
        else {
            retval = null;
        }
        return retval;
    }


    /* ======================   Draw Functions   ============================ */

    function prepareNameCache(){
        for(var i = 0;i < 7;++i){
            virusNameCache[i] = new TextRenderObject( 160 - 8 * i , "#CCCCCC", true, "#000000" );
            virusNameCache[i].setValue( (i + 1).toString());
            virusNameCache[i].setConst();
        }
    }

    function drawCellName(isMyCell){
        // Give virus a name of the # of shots needed to split it.
        if (this.isVirus) {
            var virusSize = this.nSize;
            var shotsNeeded = getVirusShotsNeededForSplit(virusSize);
            this.nameCache = virusNameCache[shotsNeeded-1];
        }
        var itemToDraw = this.nameCache;

        if((showNickName || isMyCell) && itemToDraw) {
            var scale = Math.ceil(zeach.scale * 10) / 10;

            if(toggleAdvCellInfo){
                if (myCells.length > 0 && _.contains(myIDs, this.id)) {
                    /* Size index number */
                    var arr =  _.sortBy(myCells, "nSize").reverse();
                    var cellinfo = (arr.indexOf(this) + 1).toString();
                    this.nameCache.setValue( cellinfo );
                    this.nameCache.setSize(this.getNameSize() * 2.5);
                    itemToDraw.setColor("#CCCCCC");
                }
            }else{
                if (myCells.length > 0 && _.contains(myIDs, this.id)) {
                    this.nameCache.setValue(this.name);
                    itemToDraw.setSize(this.getNameSize());
                    itemToDraw.setColor("#FCFCFC");
                }
            }
            itemToDraw.setScale(scale);
            itemToDraw = itemToDraw.render();

            var xLength= ~~(itemToDraw.width / scale);
            var yLength= ~~(itemToDraw.height / scale);
            var xPos = ~~this.x - ~~(xLength/ 2);
            var yPos = ~~this.y - ~~(yLength / 2);

            if(toggleAdvCellInfo && myCells.length > 0 && _.contains(myIDs, this.id)){
                yPos -= ~~(yLength * 0.1);
            }

            mainCtx.drawImage(itemToDraw, xPos, yPos, xLength, yLength);

            if(this.isVirus) return this.y + yLength / 2.25;
            return this.y + yLength / 2;
        }
        return this.y;
    }

    function drawCellMass(yBasePos){
        if(cobbler.showmass) {
            if(null === this.massText) {
                this.massText = new TextRenderObject(this.getNameSize() * 1.2, "#FCFCFC", true, "#000000");
            }
            var itemToDraw = this.massText;
            var scale = Math.ceil(10 * zeach.scale) / 10;
            itemToDraw.setSize(this.isVirus ? this.getNameSize() * 1 : this.getNameSize() * 1.2);
            itemToDraw.setScale(scale);

            if( !this.isVirus && ~~getMass(this.size) > 9 ) {
                var massValue = toggleAdvCellInfo ?
                                calcPCT(this) :
                                (~~(getMass(this.size))).toString();
                // Append available shots to mass
                if(_.contains(myIDs, this.id)){
                    massValue += " [" + getBlobShotsAvailable(this).toString() + "]";
                }

                itemToDraw.setValue(massValue);

                var e = itemToDraw.render();
                var xLength = ~~(e.width / scale);
                var yLength = ~~(e.height / scale);

                mainCtx.drawImage(e, ~~this.x - ~~(xLength / 2), yBasePos, xLength, yLength);
            }
            if( this.isVirus ) {
                var massValue = (~~(getMass(this.size))).toString();
                var massValueToEat = ~~(massValue * 1.33);

                itemToDraw.setValue(massValue + ' / ' + massValueToEat);

                var e = itemToDraw.render();
                var xLength = ~~(e.width / scale);
                var yLength = ~~(e.height / scale);
                mainCtx.drawImage(e, ~~this.x - ~~(xLength / 2), yBasePos - ~~(yLength / 4), xLength, yLength);
            }
        }
    }

    /* =========================     Misc     =============================== */

    function switchCurrentBlob() {
        var myids_sorted = _.pluck(myCells, "id").sort(); // sort by id
        var indexloc = _.indexOf(myids_sorted, selectedBlobID);
        if(-1 === indexloc){
            selectedBlobID = myCells[0].id;
            console.log("Had to select new blob. Its id is " + selectedBlobID);
            return cellsByID[selectedBlobID];
        }
        indexloc += 1;
        if(indexloc >= myids_sorted.length){
            selectedBlobID = myCells[0].id;
            console.log("Reached array end. Moving to beginning with id " + selectedBlobID);
            return cellsByID[selectedBlobID];
        }
        selectedBlobID = myCells[indexloc].id;
        return cellsByID[selectedBlobID];
    }

    function onAfterUpdatePacket() {
        if (!isPlayerAlive()){
            timeSpawned = null;
        }
        if(null === timeSpawned && isPlayerAlive()) {
            timeSpawned = Date.now(); // it's been reported we miss some instances of player spawning
        }
    }

    function onBeforeNewPointPacket() {
        if (0 === _.size(myCells)){
            timeSpawned = Date.now();
        }
    }

    function onAfterNewPointPacket(cellID) {
        console.log('own blob packet received');

        //        var newCell = _.find(myCells,function(cell){ cell.id == cellID });
        //        if(myCells.length == 1){
        //            newCell.splitOrder = 1; // First index is 1
        //        }else{
        //            var splitOrigin = myCells.reduce(function(cell, minDistanceCell){
        //                if(newCell == cell) return minDistanceCell; /* itself cannot be origin*/
        //                var distance = lineDistance(cell, this);
        //                var minDistance = lineDistance(minDistanceCell, this);
        //                return distance < minDistance ? cell : minDistanceCell;
        //            }, myCells[0]);
        //            myCells.forEach(function(cell){
        //                if(cell.splitOrder > splitOrigin.splitOrder){
        //                    cell.splitOrder++;
        //                }
        //            });
        //            newCell.splitOrder = splitOrigin + 1;
        //        }
    }

    function calcPCT( cell ){
        var pct;
        var selected = getSelectedBlob();
        if(selected){
            if(selected.nSize <= cell.nSize){
                pct = ~~(100 * (cell.nSize * cell.nSize) / (selected.nSize * selected.nSize)) / 100;
                return pct.toString();
            }else{
                pct = ~~(100 * (selected.nSize * selected.nSize) / (cell.nSize * cell.nSize)) / 100;
                return "1/" + pct.toString();
            }
        }else{
            return (~~getMass(cell.nSize)).toString();
        }
    }

    /* ================ Exported APIs   ================ */
    d.setNick = function(a) {
        hideOverlay();
        I = a;
        sendNickNameAndSpawn();
        currentScore = 0;
        GM_setValue("nick", a);
        console.log("Storing '" + a + "' as nick");
    };
    d.hideOverlay = hideOverlay;
    d.setRegion = setRegion;
    d.setSkins = function(a) {
        fb = a;
    };
    d.setNames = function(a) {
        showNickName = a;
    };
    d.setColors = function(a) {
        isColorsDisabled = a;
    };
    d.spectate = function() {
        I = null;
        G(1);
    };
    d.setGameMode = function() {
        O = (jQuery("#o-gamemode").val());
    };
    d.fbAsyncInit = function() {
        function a$$0() {
            d.FB.login(function(a) {
                Ia(a);
            }, {
                scope : "public_profile, email"
            });
        }
        d.FB.init({
            appId : "677505792353827",
            cookie : true,
            xfbml : true,
            status : true,
            version : "v2.2"
        });
        d.FB.Event.subscribe("auth.statusChange", function(c) {
            if ("connected" == c.status) {
                Ia(c);
            } else {
                a$$0();
            }
        });
        d.facebookLogin = a$$0;
    };

    d.createParty = function() {
        ia(":party");
        J = function(a) {
            jQuery("#roomIdOrIp").val(a);
        };
        N();
    };

    d.joinParty = function(a) {
        jQuery.ajax(protocol + "//m.agar.io/getToken", {
            error : function() {
                console.log('error joining party');
            },
            success : function(c) {
                c = c.split("\n");
                ia(":party");
                connect("ws://" + c[0], a);
            },
            dataType : "text",
            method : "POST",
            cache : false,
            crossDomain : true,
            data : a
        });
    };

    d.joinRoom = function(roomIdOrIp) {
        if(roomIdOrIp.length == 5){
            joinParty(roomIdOrIp);
        }else if(roomIdOrIp.startsWith("ws://")){
            connect(roomIdOrIp, "");
        }else{
            connect("ws://" + roomIdOrIp , "");
        }
    };

    d.refreshRoom = function() {
        if (region) {
            /* O: current mode */
            if (":party" == O) {
                createParty();
            }else{
                /* other modes */
                // TODO: show at other space
                // jQuery("#connecting").show();
                Ua();
            }
        }
    };

    /* ================ Main Game Engine =============== */
    function mainEngine() {
        mainEngineStarts = true;

        findAndInitRegion();
        jQuery('#o-nick').val(GM_getValue("nick", ""));
        updateRegion(); /* related to region */
        setInterval(updateRegion, 18E4);

        if (d.localStorage.loginCache) {
            eb(d.localStorage.loginCache);
        }
        if (d.localStorage.fbPictureCache) {
            jQuery(".agario-profile-picture").attr("src", d.localStorage.fbPictureCache);
        }

        var onmousewheel = function (e) {
            e.preventDefault();
            if (e.wheelDelta > 0) {
                zoomFactor = zoomFactor <= 9.4 ? 9.4 : zoomFactor - 0.20;
            } else {
                zoomFactor = zoomFactor >= 30.0 ? 30.0 : zoomFactor + 0.20;
            }
        };
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", onmousewheel, false);
        } else {
            d.onmousewheel = onmousewheel;
        }

        d.onmousemove = function (a) {
            windowMouseX = a.clientX;
            windowMouseY = a.clientY;
        };

        d.onresize = onresize;

        mainCanvasElement.oncontextmenu = function(e) {
            return false;
        };
        mainCanvasElement.onmousedown = function(e) {
            if(e.button == 0){
                if( !isPlayerAlive()){
                    if(focusTarget === null){
                        var nearestCell = findNearestCell(getMouseCoordsAsPseudoBlob(), allCells);
                        focusTarget = nearestCell;
                    }else{
                        focusTarget = null;
                    }
                }
                if( isPlayerAlive() && cobbler.rightClickFires ){
                    fireAtVirusNearestToCursor();
                    return;
                }
            }else if(e.button == 2){
                d.Minimap.ToggleSidebar();
            }
        };

        mainCanvasElement.onmouseup = function() {
        };

        var ZCOverlay = document.getElementById("ZCOverlay");
        ZCOverlay.onmouseup = mainCanvasElement.onmouseup;
        ZCOverlay.onmousedown = mainCanvasElement.onmousedown;
        ZCOverlay.oncontextmenu = mainCanvasElement.oncontextmenu;

        d.onkeydown = function(e) {
            if(!pressed[e.keyCode]){
                pressed[e.keyCode] = true;

                /* No event when menu shows */
                if(jQuery("#helloContainer").is(':visible')){
                    return;
                }

                switch(e.keyCode){
                    case 32: /* space */
                        updateMouse();
                        G(17);
                        break;
                    case 87: /* w */
                        updateMouse();
                        G(21);
                        break;
                    case 27: /* esc */
                        showOverlay(true);
                        break;
                    case 9: /* Tab */
                        e.preventDefault();
                        switchCurrentBlob();
                        break;
                    case 16: /* Shift */
                        toggleAdvCellInfo = !toggleAdvCellInfo;
                        break;
                    case 65: /* A */
                        cobbler.isAcid = !cobbler.isAcid;
                        break;
                    case 67: /* C */
                        grazzerTargetResetRequest = "all";
                        showVisualCues = !showVisualCues;
                        break;
                    case 81: /* Q */
                        isFastFire = true;
                        break;
                    case 82: /* R */
                        isFastSpace = true;
                        break;
                    case 69: /* E */
                        fireAtVirusNearestToCursor();
                        break;
                    case 71: /* G */
                        if(cobbler.grazerHybridSwitch && isGrazing){
                            isGrazing = 0;
                            return;
                        }
                        grazzerTargetResetRequest = "all";
                        isGrazing = (2 == isGrazing) ? false : 2;
                        break;
                    case 72: /* H */
                        if(cobbler.grazerHybridSwitch && isGrazing){
                            isGrazing = 0;
                            return;
                        }
                        grazzerTargetResetRequest = "all";
                        isGrazing = (1 == isGrazing) ? false : 1;
                        break;
                    case 83: /* S */
                        suspendMouseUpdates = !suspendMouseUpdates;
                        break;
                    case 84: /* T */
                        fastSplitCounter = 2;
                        break;
                    case 80: /* P */
                        grazingTargetFixation = !grazingTargetFixation;
                        break;
                    case 84: /* T */
                        console.log("Retarget requested");
                        grazzerTargetResetRequest = "current";
                        break;
                    case 86: /* V */
                        /* Free spectate */
                        zeach.fireFunction(18);
                        break;

                    /* Select own cell by size */
                    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: /* 1~7 */
                        var id = e.keyCode - 49;
                        if(id >= _.size(myCells)) {return; }
                        var arr =  _.sortBy(myCells, "nSize").reverse();
                        selectedBlobID = arr[id].id;

                }
            }
        };

        d.onkeyup = function(e) {
            pressed[e.keyCode] = false;
            if(isPlayerAlive()){
                switch(e.keyCode){
                    case 81: /* Q */
                        isFastFire = false;
                        break;
                    case 82: /* R */
                        isFastSpace = false;
                        break;
                }
            }
        };

        d.onblur = function() {
            /* AFK message */
            zeach.fireFunction(19);
        };

        /* Graphic task */
        d.requestAnimationFrame(renderMainCanvasWrapper);

        /* ControlTask */
        /* This is required because requestAnimationFrame is not running
        * when tab is inactive*/
        setInterval(ControlTask, 1E4 / 60);

        Ra();
        setRegion(jQuery("#o-region").val());
        if (0 === za) {
            if (region) {
                N();
            }
        }
        isOverlayShowing = true;
        jQuery("#helloContainer").show();
    }
    function updateTree() {
        if (0.4 > windowScale) {
            quadTree = null;
        } else {
            var xMax = Number.POSITIVE_INFINITY;
            var yMax = Number.POSITIVE_INFINITY;
            var xMin = Number.NEGATIVE_INFINITY;
            var yMin = Number.NEGATIVE_INFINITY;
            var maxSize = 0;

            var p;
            for (p = 0;p < allCells.length;p++) {
                var cell = allCells[p];
                if (cell.shouldRender()) {
                    if (!cell.R) {
                        if (!(20 >= cell.size * windowScale)) {
                            maxSize = Math.max(cell.size, maxSize);
                            xMax = Math.min(cell.x, xMax);
                            yMax = Math.min(cell.y, yMax);
                            xMin = Math.max(cell.x, xMin);
                            yMin = Math.max(cell.y, yMin);
                        }
                    }
                }
            }
            quadTree = QuadTreeFactory({
                xMax : xMax - (maxSize + 100),
                yMax : yMax - (maxSize + 100),
                xMin : xMin + (maxSize + 100),
                yMin : yMin + (maxSize + 100),
            });
            for (p = 0;p < allCells.length;p++) {
                if (cell = allCells[p], cell.shouldRender() && !(20 >= cell.size * windowScale)) {
                    a = 0;
                    for (;a < cell.a.length;++a) {
                        c = cell.a[a].x;
                        b = cell.a[a].y;
                        if (!(c < viewCenterX - windowWidth / 2 / windowScale)) {
                            if (!(b < viewCenterY - windowHeight / 2 / windowScale)) {
                                if (!(c > viewCenterX + windowWidth / 2 / windowScale)) {
                                    if (!(b > viewCenterY + windowHeight / 2 / windowScale)) {
                                        quadTree.m(cell.a[a]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function updateRegion() {
        if (null === regionList) {
            regionList = {};
            jQuery("#o-region").children().each(function() {
                var a = jQuery(this);
                var c = a.val();
                if (c) {
                    regionList[c] = a.text();
                }
            });
        }
        jQuery.get("https://m.agar.io/info", function(a) {
            var c = {};
            var b;
            for (b in a.regions) {
                var e = b.split(":")[0];
                c[e] = c[e] || 0;
                c[e] += a.regions[b].numPlayers;
            }
            for (b in c) {
                jQuery('#o-region option[value="' + b + '"]').text(regionList[b] + " (" + c[b] + " players)");
            }
        }, "json");
    }
    function hideOverlay() {
        jQuery("#adsBottom").hide();
        jQuery("#helloContainer").hide();
        isOverlayShowing = false;
        Ra();
        if (d.googletag) {
            if (d.googletag.pubads && d.googletag.pubads().clear) {
                d.googletag.pubads().clear(d.aa);
            }
        }
    }
    function setRegion(newRegion) {
        if (newRegion) {
            if (newRegion != region) {
                if (jQuery("#o-newRegion").val() != newRegion) {
                    jQuery("#o-newRegion").val(newRegion);
                }
                region = d.localStorage.location = newRegion;
                jQuery(".btn-needs-server").prop("disabled", false);
                if (mainEngineStarts) {
                    N();
                }
            }
        }
    }
    function showOverlay(a) {
        if (!isOverlayShowing) {
            I = null;
            nb();
            if (a) {
                w = 1;
            }
            isOverlayShowing = true;
            jQuery("#helloContainer").fadeIn(a ? 200 : 3E3);
            OnShowOverlay(a);
        }
    }
    function ia(a) {
        O = a;
        jQuery("#o-gamemode").val(a);
    }
    function Ra() {
        if (jQuery("#o-region").val()) {
            d.localStorage.location = jQuery("#o-region").val();
        } else {
            if (d.localStorage.location) {
                jQuery("#o-region").val(d.localStorage.location);
            }
        }
        if (jQuery("#region").val()) {
            jQuery("#locationKnown").append(jQuery("#o-region"));
        } else {
            jQuery("#locationUnknown").append(jQuery("#o-region"));
        }
    }

    /* something about ads */
    var googleads;
    function nb() {
        if (googleads) {
            googleads = false;
            setTimeout(function() {
                googleads = true;
            }, 6E4 * Ta);
            if (d.googletag) {
                if (d.googletag.pubads && d.googletag.pubads().clear) {
                    d.googletag.pubads().refresh(d.aa);
                }
            }
        }
    }
    function translate(a) {
        return zeach.dict[a] || a;
    }
    function Ua() {
        var a = ++za;
        console.log("Find " + region + O);
        jQuery.ajax("https://m.agar.io/", {
            error : function() {
                setTimeout(Ua, 1E3);
            },
            success : function(c) {
                if (a == za) {
                    c = c.split("\n");
                    if (c[2]) {
                        alert(c[2]);
                    }
                    jQuery('#roomIdOrIp').val(c[1]);
                    connect("ws://" + c[0], c[1]);
                    serverIP = c[0];
                }
            },
            dataType : "text",
            method : "POST",
            cache : false,
            crossDomain : true,
            data : (region + O || "?") + "\n154669603"
        });
    }
    function N() {
        if (mainEngineStarts) {
            if (region) {
                // TODO: show at other space
                // jQuery("#connecting").show();
                Ua();
            }
        }
    }
    function connect(a$$0, c) {
        if (webSocket) {
            webSocket.onopen = null;
            webSocket.onmessage = null;
            webSocket.onclose = null;
            try {
                webSocket.close();
            } catch (b$$0) {
            }
            webSocket = null;
        }
        if (null !== J) {
            var e = J;
            J = function() {
                e(c);
            };
        }
        if ("https:" == protocol) {
            var l = a$$0.split(":");
            a$$0 = l[0] + "s://ip-" + l[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+l[2] + 2E3);
        }
        pendingPacket = [];
        myIDs = [];
        myCells = [];
        cellsByID = {};
        allCells = [];
        P = [];
        E = [];
        y = teamLeaderBoard = null;
        Q = 0;
        ka = false;
        console.log("Connecting to " + a$$0);
        webSocket = new WebSocket(a$$0);
        webSocket.binaryType = "arraybuffer";
        webSocket.onopen = function() {
            var a;
            console.log("socket open");
            a = L(5);
            a.setUint8(0, 254);
            a.setUint32(1, 5, true);
            M(a);
            a = L(5);
            a.setUint8(0, 255);
            a.setUint32(1, 154669603, true);
            M(a);
            a = L(1 + c.length);
            a.setUint8(0, 80);
            var b = 0;
            for (;b < c.length;++b) {
                a.setUint8(b + 1, c.charCodeAt(b));
            }
            M(a);
            Va();

            /* Spectate mode by default */
            setTimeout(function(){
                I = null;
                G(1);
            },1000);
        };
        webSocket.onmessage = onmessage;
        webSocket.onclose = qb;
        webSocket.onerror = function() {
            console.log("socket error");
        };
    }
    function L(a) {
        return new DataView(new ArrayBuffer(a));
    }
    function M(a) {
        webSocket.send(a.buffer);
    }
    function qb() {
        if (ka) {
            la = 500;
        }
        console.log("socket close");
        setTimeout(N, la);
        la *= 2;
    }
    function onmessage(a) {
        if(cobbler.latencyButNotLag){
            pendingPacket.push(new DataView(a.data.slice(0)));
        }else{
            while(pendingPacket.length > 0){
                extractPacket(pendingPacket[0]);
                pendingPacket.splice(0,1);
            }
            extractCellPacket(new DataView(a.data));
        }
    }
    /* Get message from server */
    function extractPacket(a) {
        function getString() {
            var c = "";
            for (;;) {
                var e = a.getUint16(b, true);
                b += 2;
                if (0 === e) {
                    break;
                }
                c += String.fromCharCode(e);
            }
            return c;
        }
        var b = 0;
        if (240 == a.getUint8(b)) {
            b += 5;
        }
        switch(a.getUint8(b++)) {
            case 16:
                WorldUpdate(a, b);
                onAfterUpdatePacket();
                break;
            case 17: /* View update */
                targetViewCenterX = a.getFloat32(b, true);
                b += 4;
                targetViewCenterY = a.getFloat32(b, true);
                b += 4;
                $ = a.getFloat32(b, true);
                b += 4;
                break;
            case 20: /* reset */
                unsafeWindow.Minimap.Clear();
                myCells = [];
                myIDs = [];
                break;
            case 21: /* Debug line */
                break;
            case 32: /* Owns blob */
                onBeforeNewPointPacket();
                var newCellID = a.getUint32(b, true);
                myIDs.push(newCellID);
                onAfterNewPointPacket(newCellID);
                unsafeWindow.Minimap.OwnCell(newCellID);
                b += 4;
                break;
            case 49: /* FFA Leaderboard */
                var e$$0 = a.getUint32(b, true);
                b = b + 4;
                E = [];
                var l = 0;
                for (;l < e$$0;++l) {
                    var p = a.getUint32(b, true);
                    b = b + 4;
                    E.push({
                        id : p,
                        name : getString()
                    });
                }
                Wa();
                break;
            case 50: /* Team Leaderboard */
                teamLeaderBoard = [];
                e$$0 = a.getUint32(b, true);
                b += 4;
                l = 0;
                for (;l < e$$0;++l) {
                    teamLeaderBoard.push(a.getFloat32(b, true));
                    b += 4;
                }
                Wa();
                break;
            case 64: /* Game area size */
                mapLeft = a.getFloat64(b, true); b += 8;
                mapTop = a.getFloat64(b, true); b += 8;
                mapRight = a.getFloat64(b, true); b += 8;
                mapBottom = a.getFloat64(b, true); b += 8;
                targetViewCenterX = (mapRight + mapLeft) / 2;
                targetViewCenterY = (mapBottom + mapTop) / 2;
                $ = 1;
                if (0 === myCells.length) {
                    viewCenterX = targetViewCenterX;
                    viewCenterY = targetViewCenterY;
                    windowScale = $;
                }
                if(a.byteLength > b){
                    a.getUint32(b, true);
                    b += 4;
                    console.log("Server version " + getString());
                }
                unsafeWindow.Minimap.SetGameAreaSize(mapLeft, mapTop, mapRight, mapBottom);
                break;
            case 81: /* Experience info */
                var h = a.getUint32(b, true);
                b = b + 4;
                var d = a.getUint32(b, true);
                b = b + 4;
                var f = a.getUint32(b, true);
                b = b + 4;
                setTimeout(function() {
                    R({
                        e : h,
                        f : d,
                        d : f
                    });
                }, 1200);
                break;
        }
    }
    /* Server -> client world update */
    function WorldUpdate(a, offset) {
        if (!ka) {
            ka = true;
            jQuery("#connecting").hide();
            sendNickNameAndSpawn(); /* send nickname */
            if (J) {
                J(); /* XXX: party token or something, need documentation */
                J = null;
            }
        }
        var b = Math.random();
        beingEaten = false;

        /* Minimap data */
        var miniMapData = {
            destroyQueue : [],
            nodes : [],
            nonVisibleNodes : []
        };

        var eatEventCount = a.getUint16(offset, true); offset += 2;
        /* eat event */
        for (var l = 0;l < eatEventCount;++l) {
            var eater = cellsByID[a.getUint32(offset, true)];
            var victim = cellsByID[a.getUint32(offset + 4, true)];
            offset += 8;

            if(victim && eater){
                OnCellEaten(eater,victim);
                // Remove from 10-sec-remembered cells list by id
                _.remove(ghostBlobs, {id: victim.id});

                victim.destroy();
                victim.ox = victim.x;
                victim.oy = victim.y;
                victim.oSize = victim.size;
                victim.nx = eater.x;
                victim.ny = eater.y;
                victim.nSize = victim.size;
                victim.Q = currentTime;

                /* Minimap data */
                miniMapData.destroyQueue.push(victim.id);
            }
        }

        /* new cells or cell update */
        for (;;) {
            var playerID = a.getUint32(offset, true); offset += 4;
            if (0 === playerID) {
                break;
            }
            var updated = false;

            var x = a.getInt32(offset, true); offset += 4;
            var y = a.getInt32(offset, true); offset += 4;
            var size = a.getInt16(offset, true); offset += 2;

            var color = ( a.getUint8(offset)   << 16 |
                          a.getUint8(offset+1) << 8  |
                          a.getUint8(offset+2) ).toString(16);
            offset += 3;
            while(6 > color.length){ color = "0" + color; }
            color = "#" + color;

            var flag = a.getUint8(offset++);
            var isVirus = !!(flag & 1);
            var s = !!(flag & 16);
            if (flag & 2) { offset += 4 + a.getUint32(offset, true);}

            var ch;
            var MoneyClip = "";
            if (flag & 4) {
                for (;;) {
                    ch = a.getUint8(offset++);
                    if (0 == ch)
                        break;
                    MoneyClip += String.fromCharCode(ch);
                }
            }
            for (var name = "";;) {
                var ch = a.getUint16(offset, true);
                offset += 2;
                if (0 == ch)
                    break;
                name += String.fromCharCode(ch);
            }

            if(MoneyClip !== ""){
                /* Do something special to blame them */
            }

            n = null;
            if (cellsByID.hasOwnProperty(playerID)) {
                n = cellsByID[playerID];
                n.updatePos();
                n.ox = n.x;
                n.oy = n.y;
                n.oSize = n.size;
                n.color = color;
                updated = true;

                d.Minimap.MiniMapUpdateToken(playerID, n.color, x, y, size);
            } else {
                n = new Cell(playerID, x, y, size, color, name);
                allCells.push(n);
                cellsByID[playerID] = n;
                n.sa = x;
                n.ta = y;
            }
            n.isVirus = isVirus;
            n.n = s;
            n.nx = x;
            n.ny = y;
            n.nSize = size;
            n.qa = b; /* XXX: seems junk code, not effect game */
            n.Q = currentTime;
            n.ba = flag;
            if (name) {
                n.setName(name);
            }

            if(n.nameCache !== null){
                n.nameCache.setSize(n.getNameSize());
            }

            if (-1 != myIDs.indexOf(playerID)) {
                if (-1 == myCells.indexOf(n)) {
                    document.getElementById("helloContainer").style.display = "none";
                    myCells.push(n);
                    if (1 == myCells.length) {
                        OnGameStart(myCells);
                        viewCenterX = n.x;
                        viewCenterY = n.y;
                        setIcon();
                    }
                }
            }

            /* Minimap data */
            if (updated) {
                miniMapData.nodes.push({
                    id: n.id,
                    x: n.nx,
                    y: n.ny,
                    size: n.nSize,
                    color: n.color
                });
            }
        }

        /* destroy event */
        var destroyCount = a.getUint32(offset, true); offset += 4;
        while(destroyCount--) {
            toDestroyID = a.getUint32(offset, true); offset += 4;
            var toDestroy = cellsByID[toDestroyID];
            if (null != toDestroy) {
                toDestroy.destroy();
                miniMapData.nonVisibleNodes.push(toDestroyID);
            }
        }

        /* detect all cell dead */
        if (0 === myCells.length && beingEaten) {
            showOverlay(false);
        }

        unsafeWindow.Minimap.UpdateData(miniMapData);
    }
    function updateMouse() {
        /* calculate mouse coordinate relative to map */
        gameMouseX = (windowMouseX - windowWidth / 2) / windowScale + viewCenterX;
        gameMouseY = (windowMouseY - windowHeight / 2) / windowScale + viewCenterY;

        if(suspendMouseUpdates || isGrazing){return;}
        if (isWebSocketConnected()) {
            sendMouseUpdate(webSocket, gameMouseX, gameMouseY);
        }
    }
    var move_no = 0;
    function updateMovement(){
        if(isGrazing){ doGrazing(); return; }
        if(isFastFire){
            zeach.fireFunction(21);
        }
        if(fastSplitCounter > 0){
            --fastSplitCounter;
            zeach.fireFunction(17);
        }else if(isFastSpace){
            zeach.fireFunction(17);
        }
        updateMouse();
    }
    function sendNickNameAndSpawn() {
        if (isWebSocketConnected() && null !== I) {
            var a = L(1 + 2 * I.length);
            a.setUint8(0, 0);
            var c = 0;
            for (;c < I.length;++c) {
                a.setUint16(1 + 2 * c, I.charCodeAt(c), true);
            }
            M(a);
        }
    }
    function isWebSocketConnected() {
        return null !== webSocket && webSocket.readyState == webSocket.OPEN;
    }
    function G(a) {
        if (isWebSocketConnected()) {
            var c = L(1);
            c.setUint8(0, a);
            M(c);
        }
    }
    function Va() {
        if (isWebSocketConnected() && null !== B) {
            var a = L(1 + B.length);
            a.setUint8(0, 81);
            var c = 0;
            for (;c < B.length;++c) {
                a.setUint8(c + 1, B.charCodeAt(c));
            }
            M(a);
        }
    }

    /* XXX: should not leak low level API */
    /* called when resize of change night mode */
    unsafeWindow.drawBackground = function(){
        backgroundCtx.clearRect(0, 0, windowWidth, windowHeight);
        backgroundCtx.fillStyle = getColors().backgroundColor;
        backgroundCtx.fillRect(0, 0, windowWidth, windowHeight);
    };

    function onresize() {
        windowWidth = d.innerWidth;
        windowHeight = d.innerHeight;
        mainCanvasElement.width = windowWidth;
        mainCanvasElement.height = windowHeight;
        backgroundCanvasElement.width = windowWidth;
        backgroundCanvasElement.height = windowHeight;

        drawBackground();

        var a = jQuery("#helloContainer");
        a.css("transform", "none");
        var c = a.height();
        var b = d.innerHeight;
        if (c > b / 1.1) {
            a.css("transform", "translate(-50%, -50%) scale(" + b / c / 1.1 + ")");
        } else {
            a.css("transform", "translate(-50%, -50%)");
        }
    }

    var pendingPacket = []; /* Try to reduce glitch when packets all comes in a short time */
    function ControlTask(){
        updateMovement();
        if(cobbler.latencyButNotLag){
            if(pendingPacket.length > 0){
                do{
                    var packetToProcess = pendingPacket[0];
                    pendingPacket.splice(0,1);
                    try{
                        extractPacket(packetToProcess);
                    }catch(err){
                        console.log('packet error:' + err.message);
                    }
                }while(pendingPacket.length > 30);
                /* TODO: make this number adjustable by user*/
            }
        }
    }

    function renderMainCanvas() {
        /* To assure the packet processing is not block by render task */
        ControlTask();

        updateMouse();

        currentTime = Date.now();

        /* Calculate area to show depends on player live or not */
        var windowScaleFactor = Math.max(windowHeight / 1080, windowWidth / 1920) * H;
        if (0 < myCells.length) {
            var sizeSum = 0;
            for (var c = 0;c < myCells.length;c++) {
                sizeSum += myCells[c].size;
            }
            var targetScale = Math.pow(Math.min(64 / sizeSum, 1), 0.4) * windowScaleFactor;
            windowScale = (9 * windowScale + targetScale) / zoomFactor;

            targetViewCenterX = 0;
            targetViewCenterY = 0;
            for (var i = 0;i < myCells.length;i++) {
                myCells[i].updatePos();
                targetViewCenterX += myCells[i].x / myCells.length;
                targetViewCenterY += myCells[i].y / myCells.length;
            }
            $ = windowScale;
            viewCenterX = (viewCenterX + targetViewCenterX) / 2;
            viewCenterY = (viewCenterY + targetViewCenterY) / 2;
        } else {
            viewCenterX = ( 29 * viewCenterX + targetViewCenterX) / 30;
            viewCenterY = ( 29 * viewCenterY + targetViewCenterY) / 30;
            windowScale = (9 * windowScale + $ * windowScaleFactor) / zoomFactor;
        }

        if(!cobbler.simpleCellDraw)updateTree();

        /* calculate mouse coordinate relative to map */
        gameMouseX = (windowMouseX - windowWidth / 2) / windowScale + viewCenterX;
        gameMouseY = (windowMouseY - windowHeight / 2) / windowScale + viewCenterY;

        /* Draw gridlines */
        mainCtx.clearRect(0, 0, windowWidth, windowHeight);
        if(cobbler.gridLines){
            mainCtx.save();
            mainCtx.strokeStyle = getColors().gridLinesColor;
            mainCtx.globalAlpha = 0.2 * windowScale;
            var a = windowWidth / windowScale;
            var c = windowHeight / windowScale;
            var b = (-viewCenterX + a / 2) % 100;
            for (;b < a;b += 100) {
                mainCtx.beginPath();
                mainCtx.moveTo(b * windowScale - 0.5, 0);
                mainCtx.lineTo(b * windowScale - 0.5, c * windowScale);
                mainCtx.stroke();
            }
            b = (-viewCenterY + c / 2) % 100;
            for (;b < c;b += 100) {
                mainCtx.beginPath();
                mainCtx.moveTo(0, b * windowScale - 0.5);
                mainCtx.lineTo(a * windowScale, b * windowScale - 0.5);
                mainCtx.stroke();
            }
            mainCtx.restore();
        }

        allCells.sort(function(a, c) {
            return a.size == c.size ? a.id - c.id : a.size - c.size;
        });
        mainCtx.save();
        mainCtx.translate(windowWidth / 2, windowHeight / 2);
        mainCtx.scale(windowScale, windowScale);
        mainCtx.translate(-viewCenterX, -viewCenterY);

        /* Items underneath of cells */
        drawMapCoordinate(mainCtx);
        drawMapBorders(mainCtx);

        for (var i = 0;i < P.length;i++) {
            P[i].render(mainCtx);
        }
        for (var i = 0;i < allCells.length;i++) {
            allCells[i].render(mainCtx);
        }

        /* Item overlapped cells */
        drawRescaledItems(mainCtx);
        mainCtx.restore();

        /* Team Leaderboard */
        if (y) {
            if (y.width) {
                mainCtx.drawImage(y, windowWidth - y.width - 10, 10);
            }
        }
        OnDraw(mainCtx);

        currentScore = Math.max(currentScore, getTotalMass());
        /* Information at bottom left */
        if (0 != currentScore) {
            if (null == leftBottomInfoCanvas) {
                leftBottomInfoCanvas = new TextRenderObject(24, "#FFFFFF");
            }
            var extras = " " + getLeftBottomExtraInfo(currentScore);
            leftBottomInfoCanvas.setValue(translate("score") + ~~(currentScore / 100) + extras);

            b = leftBottomInfoCanvas.render();
            mainCtx.globalAlpha = 0.2;
            mainCtx.fillStyle = "#000000";
            mainCtx.fillRect(10, windowHeight - 10 - 24 - 10, b.width + 10, 34);
            mainCtx.globalAlpha = 1;
            mainCtx.drawImage(b, 15, windowHeight - 10 - 24 - 5);
            if(myCells && myCells.length != 0){
                OnUpdateMass(getTotalMass());
            }
        }
        displayDebugText(mainCtx,TextRenderObject);
    }

    function xb() {
        if (Ma && Ga.width) {
            var a = windowWidth / 5;
            mainCtx.drawImage(Ga, 5, 5, a, a);
        }
    }
    function getTotalMass() {
        var a = 0;
        var c = 0;
        for (;c < myCells.length;c++) {
            a += myCells[c].nSize * myCells[c].nSize;
        }
        return a;
    }
    function Wa() {
        y = null;
        if (null != teamLeaderBoard || 0 != E.length) {
            if (null != teamLeaderBoard || showNickName) {
                y = document.createElement("canvas");
                var a = y.getContext("2d");
                var c = 60;
                c = null == teamLeaderBoard ? c + 24 * E.length : c + 180;
                var b = Math.min(200, 0.3 * windowWidth) / 200;
                y.width = 200 * b;
                y.height = c * b;
                a.scale(b, b);
                a.globalAlpha = 0.4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, c);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                b = null;
                b = translate("leaderboard");
                a.font = "30px Ubuntu";
                a.fillText(b, 100 - a.measureText(b).width / 2, 40);
                if (null == teamLeaderBoard) {
                    a.font = "20px Ubuntu";
                    c = 0;
                    for (;c < E.length;++c) {
                        b = E[c].name || translate("unnamed_cell");
                        if (!showNickName) {
                            b = translate("unnamed_cell");
                        }
                        if (-1 != myIDs.indexOf(E[c].id)) {
                            if (myCells[0].name) {
                                b = myCells[0].name;
                            }
                            a.fillStyle = "#FFAAAA";
                            /*new*//*mikey*//*remap*/OnLeaderboard(c+1);
                        } else {
                            a.fillStyle = "#FFFFFF";
                        }
                        b = c + 1 + ". " + b;
                        a.fillText(b, 100 - a.measureText(b).width / 2, 70 + 24 * c);
                    }
                } else {
                    c = b = 0;
                    for (;c < teamLeaderBoard.length;++c) {
                        var e = b + teamLeaderBoard[c] * Math.PI * 2;
                        a.fillStyle = yb[c + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, b, e, false);
                        a.fill();
                        b = e;
                    }
                }
            }
        }
    }

    /* XXX: Find out what is this */
    function Ha(a, c, b, e, l) {
        this.V = a;
        this.x = c;
        this.y = b;
        this.i = e;
        this.b = l;
    }
    Ha.prototype = {
        V : null,
        x : 0,
        y : 0,
        i : 0,
        b : 0
    };

    /* Cell object */
    function Cell(id, x, y, size, color, name) {
        this.id = id;
        this.ox = this.x = x;
        this.oy = this.y = y;
        this.oSize = this.size = size;
        this.color = color;
        this.a = [];
        this.W();
        this.setName(name);
        this.splitTime = Date.now();
    }
    Cell.prototype = {
        id : 0,
        a : null,
        name : null,
        nameCache : null,
        massText : null,
        x : 0,
        y : 0,
        size : 0,
        ox : 0,
        oy : 0,
        r : 0,
        nx : 0,
        ny : 0,
        nSize : 0,
        ba : 0,
        Q : 0,
        qa : 0,
        G : false,
        isVirus : false,
        n : false,
        R : true,
        Y : 0,
        destroy : function() {
            d.Minimap.MiniMapUnregisterTokenLocal(this.id);

            var a = 0;
            for (;a < allCells.length;a++) {
                if (allCells[a] == this) {
                    allCells.splice(a, 1);
                    break;
                }
            }
            delete cellsByID[this.id];
            a = myCells.indexOf(this);
            if (-1 != a) {
                myCells.splice(a, 1);
            }
            a = myIDs.indexOf(this.id);
            if (-1 != a) {
                beingEaten = true;
                myIDs.splice(a, 1);
            }
            this.G = true;
            if (0 < this.Y) {
                P.push(this);
            }

            /* focusTarget destroyed, choose a new one */
            if(this == focusTarget){
                console.log('find new focus target');
                for (var i = 0;i < allCells.length;i++) {
                    if(allCells[i].name && allCells[i].name == focusTarget.name){
                        focusTarget = allCells[i];
                        break;
                    }
                }
            }
        },
        getNameSize : function() { /* getNameSize */
            return Math.max(~~(0.3 * this.size), 24);
        },
        setName : function(a) {
            this.name = a;
            if (a) {
                if (null == this.nameCache) {
                    this.nameCache = new TextRenderObject(this.getNameSize(), "#FCFCFC", true, "#000000");
                } else {
                    this.nameCache.setSize(this.getNameSize());
                }
                this.nameCache.setValue(this.name);
            }
        },
        W : function() {
            var a = this.I();
            for (;this.a.length > a;) {
                var c = ~~(Math.random() * this.a.length);
                this.a.splice(c, 1);
            }
            if (0 == this.a.length) {
                if (0 < a) {
                    this.a.push(new Ha(this, this.x, this.y, this.size, Math.random() - 0.5));
                }
            }
            for (;this.a.length < a;) {
                c = ~~(Math.random() * this.a.length);
                c = this.a[c];
                this.a.push(new Ha(this, c.x, c.y, c.i, c.b));
            }
        },
        I : function() {
            var a = 10;
            if (20 > this.size) {
                a = 0;
            }
            if (this.isVirus) {
                a = 30;
            }
            var c = this.size;
            if (!this.isVirus) {
                c *= windowScale;
            }
            c *= C;
            if (this.ba & 32) {
                c *= 0.25;
            }
            return~~Math.max(c, a);
        },
        oa : function() {
            this.W();
            var a$$0 = this.a;
            var c = a$$0.length;
            var b = 0;
            for (;b < c;++b) {
                var e = a$$0[(b - 1 + c) % c].b;
                var l = a$$0[(b + 1) % c].b;
                a$$0[b].b += (Math.random() - 0.5) * (this.n ? 3 : 1);
                a$$0[b].b *= 0.7;
                if (10 < a$$0[b].b) {
                    a$$0[b].b = 10;
                }
                if (-10 > a$$0[b].b) {
                    a$$0[b].b = -10;
                }
                a$$0[b].b = (e + l + 8 * a$$0[b].b) / 10;
            }
            var p = this;
            var h = this.isVirus ? 0 : (this.id / 1E3 + currentTime / 1E4) % (2 * Math.PI);
            b = 0;
            for (;b < c;++b) {
                var d = a$$0[b].i;
                e = a$$0[(b - 1 + c) % c].i;
                l = a$$0[(b + 1) % c].i;
                if (15 < this.size && (null != quadTree && (20 < this.size * windowScale && 0 < this.id))) {
                    var f = false;
                    var g = a$$0[b].x;
                    var m = a$$0[b].y;
                    quadTree.forEachInRange(g - 5, m - 5, 10, 10, function(a) {
                        if (a.V != p) {
                            if (25 > (g - a.x) * (g - a.x) + (m - a.y) * (m - a.y)) {
                                f = true;
                            }
                        }
                    });
                    if (!f) {
                        if (a$$0[b].x < mapLeft || (a$$0[b].y < mapTop || (a$$0[b].x > mapRight || a$$0[b].y > mapBottom))) {
                            f = true;
                        }
                    }
                    if (f) {
                        if (0 < a$$0[b].b) {
                            a$$0[b].b = 0;
                        }
                        a$$0[b].b -= 1;
                    }
                }
                d += a$$0[b].b;
                if (0 > d) {
                    d = 0;
                }
                d = this.n ? (19 * d + this.size) / 20 : (12 * d + this.size) / 13;
                a$$0[b].i = (e + l + 8 * d) / 10;
                e = 2 * Math.PI / c;
                l = this.a[b].i;
                if (this.isVirus) {
                    if (0 == b % 2) {
                        l += 5;
                    }
                }
                a$$0[b].x = this.x + Math.cos(e * b + h) * l;
                a$$0[b].y = this.y + Math.sin(e * b + h) * l;
            }
        },
        updatePos : function() {
            if (0 >= this.id) {
                return 1;
            }
            var a;
            a = (currentTime - this.Q) / 120;
            a = 0 > a ? 0 : 1 < a ? 1 : a;
            if (this.G && 1 <= a) {
                var b = P.indexOf(this);
                if (-1 != b) {
                    P.splice(b, 1);
                }
            }
            this.x = a * (this.nx - this.ox) + this.ox;
            this.y = a * (this.ny - this.oy) + this.oy;
            this.size = a * (this.nSize - this.oSize) + this.oSize;
            return a;
        },
        shouldRender : function() {
            return 0 >= this.id ? true :
                this.x + this.size + 40 < viewCenterX - windowWidth / 2 / windowScale ||
                (this.y + this.size + 40 < viewCenterY - windowHeight / 2 / windowScale ||
                 (this.x - this.size - 40 > viewCenterX + windowWidth / 2 / windowScale ||
                  this.y - this.size - 40 > viewCenterY + windowHeight / 2 / windowScale)) ? false : true;
        },
        render : function(ctx) { /* draw cell */
            if (!this.shouldRender()) {
                return;
            }
            ++this.Y;
            var c = 0 < this.id && (!this.isVirus && (!this.n && 0.4 > windowScale));
            if (5 > this.I()) {
                c = true;
            }
            if (this.R && !c) {
                var b = 0;
                for (;b < this.a.length;b++) {
                    this.a[b].i = this.size;
                }
            }
            this.R = c;
            ctx.save();
            b = this.updatePos();
            if (this.G) {
                ctx.globalAlpha *= 1 - b;
            }
            ctx.lineWidth = this.isVirus ?
                10 : cobbler.cellBorder ?
                this.size * cellBorderWidth : 0;
            ctx.lineCap = "round";
            ctx.lineJoin = this.isVirus ? "miter" : "round";

            adjustCellColor(this, mainCtx);

            var e, b, d;

            if (!c && (!cobbler.simpleCellDraw || this.isVirus)) {
                this.oa();
                ctx.beginPath();
                e = this.I();
                ctx.moveTo(this.a[0].x, this.a[0].y);
                b = 1;
                for (;b <= e;++b) {
                    d = b % e;
                    ctx.lineTo(this.a[d].x, this.a[d].y);
                }
            } else {
                ctx.beginPath();
                ctx.arc(this.x,
                        this.y,
                        cobbler.cellBorder ? this.size - 0.5 * this.size * cellBorderWidth :
                            this.size,
                        0,
                        2 * Math.PI,
                        false);
            }
            ctx.closePath();
            ctx.stroke();

            e = this.name.toLowerCase();
            /* Get skin image if exists */
            var b = customSkins(this, defaultSkins, zeach.isShowSkins, zeach.gameMode);
            b = (d = b) ? true : false;

            if (!(null == d)) {
                if(cobbler.isLiteBrite){
                    ctx.save();
                    ctx.clip();
                    mainCtx.globalAlpha = (isSpecialSkin(this.name.toLowerCase()) || _.contains(myIDs, this.id)) ? 1 : 0.5;
                    ctx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                    ctx.restore();
                }else{
                    ctx.save();
                    ctx.clip();
                    mainCtx.globalAlpha = 1;
                    ctx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                    ctx.restore();
                }
            }else{
                /* no skin */
                if(cobbler.isLiteBrite){
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.fill();
                    ctx.restore();
                }else if(this.isVirus){
                    ctx.save();
                    ctx.globalAlpha = 0.85;
                    ctx.fill();
                    ctx.restore();
                }else{
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            b = -1 != myCells.indexOf(this);
            c = ~~this.y;
            if(0 != this.id) {
                var vertical_offset = drawCellName.call(this,b);
                drawCellMass.call(this,vertical_offset);
            }
            ctx.restore();
        }
    };

    /* Text object */
    function TextRenderObject(size, color, hasStroke, strokeColor) {
        if (size) this.size = size;
        if (color)this.color = color;
        this.hasStroke = !!hasStroke;
        if (strokeColor) this.strokeColor = strokeColor;
    }
    TextRenderObject.prototype = {
        textToDraw : "",
        color : "#000000",
        hasStroke : false,
        strokeColor : "#000000",
        size : 16,
        cachedCanvas : null,
        ctx : null,
        needRedraw : true,
        scale : 1,
        lineWidth : 1,
        isConst : false,
        /* temporary workaround, make virus textsize not be modified */
        setConst : function(){
            this.isConst = true;
        },
        setSize : function(size) {
            if (this.size != size && !this.isConst) {
                this.size = size;
                this.needRedraw = true;
            }
        },
        setScale : function(scale) {
            if (this.scale != scale) {
                this.scale = scale;
                this.needRedraw = true;
            }
        },
        setStrokeColor : function(color) {
            if (this.strokeColor != color) {
                this.strokeColor = color;
                this.needRedraw = true;
            }
        },
        setColor : function(color) {
            if (this.Color != color) {
                this.Color = color;
                this.needRedraw = true;
            }
        },
        setValue : function(text) {
            if (text != this.textToDraw) {
                this.textToDraw = text;
                this.needRedraw = true;
            }
        },
        setLineWidth : function(lineWidth) {
            if (this.lineWidth != lineWidth) {
                this.lineWidth = lineWidth;
                this.needRedraw = true;
            }
        },
        render : function() {
            if (null == this.cachedCanvas) {
                this.cachedCanvas = document.createElement("canvas");
                this.ctx = this.cachedCanvas.getContext("2d");
            }
            if (this.needRedraw) {
                this.needRedraw = false;

                var ctx = this.ctx;
                var size = this.size;
                var text = this.textToDraw;
                var scale = this.scale;

                ctx.font = "bolder " + size + "px Ubuntu";
                this.cachedCanvas.width = ctx.measureText(text).width * scale;
                this.cachedCanvas.height = size * 1.15 * scale; /* XXX */

                ctx.textBaseline = "top";
                ctx.font = "bolder " + size + "px Ubuntu";
                ctx.scale(scale, scale);
                ctx.globalAlpha = 1;
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.fillStyle = this.color;

                ctx.fillText(text, 0, 0);
                if (this.hasStroke) {
                    ctx.strokeText(text, 0, 0);
                }
            }
            return this.cachedCanvas;
        }
    };

    function R(a, c) {
        var b$$0 = "1" == jQuery("#helloContainer").attr("data-has-account-data");
        /*new*/var b$$0 = "1" == jQuery("#ZCOverlay").attr("data-has-account-data");

        jQuery("#helloContainer").attr("data-has-account-data", "1");
        if (null == c && d.localStorage.loginCache) {
            var e = JSON.parse(d.localStorage.loginCache);
            e.f = a.f;
            e.d = a.d;
            e.e = a.e;
            d.localStorage.loginCache = JSON.stringify(e);
        }
        if (b$$0) {
            var l = +jQuery(".agario-exp-bar .progress-bar-text").text().split("/")[0];
            b$$0 = +jQuery(".agario-exp-bar .progress-bar-text").text().split("/")[1].split(" ")[0];
            e = jQuery(".agario-profile-panel .progress-bar-star").text();
            if (e != a.e) {
                R({
                    f : b$$0,
                    d : b$$0,
                    e : e
                }, function() {
                    jQuery(".agario-profile-panel .progress-bar-star").text(a.e);
                    jQuery(".agario-exp-bar .progress-bar").css("width", "100%");
                    jQuery(".progress-bar-star").addClass("animated tada").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                        jQuery(".progress-bar-star").removeClass("animated tada");
                    });
                    setTimeout(function() {
                        jQuery(".agario-exp-bar .progress-bar-text").text(a.d + "/" + a.d + " XP");
                        R({
                            f : 0,
                            d : a.d,
                            e : a.e
                        }, function() {
                            R(a, c);
                        });
                    }, 1E3);
                });
            } else {
                var p = Date.now();
                var h = function() {
                    var b;
                    b = (Date.now() - p) / 1E3;
                    b = 0 > b ? 0 : 1 < b ? 1 : b;
                    b = b * b * (3 - 2 * b);
                    jQuery(".agario-exp-bar .progress-bar-text").text(~~(l + (a.f - l) * b) + "/" + a.d + " XP");
                    jQuery(".agario-exp-bar .progress-bar").css("width", (88 * (l + (a.f - l) * b) / a.d).toFixed(2) + "%");
                    if (1 > b) {
                        d.requestAnimationFrame(h);
                    } else {
                        if (c) {
                            c();
                        }
                    }
                };
                d.requestAnimationFrame(h);
            }
        } else {
            jQuery(".agario-profile-panel .progress-bar-star").text(a.e);
            jQuery(".agario-exp-bar .progress-bar-text").text(a.f + "/" + a.d + " XP");
            jQuery(".agario-exp-bar .progress-bar").css("width", (88 * a.f / a.d).toFixed(2) + "%");
            if (c) {
                c();
            }
        }
    }
    function eb(a) {
        if ("string" == typeof a) {
            a = JSON.parse(a);
        }
        if (Date.now() + 18E5 > a.ia) {
            jQuery("#helloContainer").attr("data-logged-in", "0");
        } else {
            d.localStorage.loginCache = JSON.stringify(a);
            B = a.fa;
            jQuery(".agario-profile-name").text(a.name);
            Va();
            R({
                f : a.f,
                d : a.d,
                e : a.e
            });
            jQuery("#helloContainer").attr("data-logged-in", "1");
        }
    }
    function zb(a) {
        a = a.split("\n");
        eb({
            name : a[0],
            ra : a[1],
            fa : a[2],
            ia : 1E3 * +a[3],
            e : +a[4],
            f : +a[5],
            d : +a[6]
        });
    }
    function Ia(a$$0) {
        if ("connected" == a$$0.status) {
            var c = a$$0.authResponse.accessToken;
            d.FB.api("/me/picture?width=180&height=180", function(a) {
                d.localStorage.fbPictureCache = a.data.url;
                jQuery(".agario-profile-picture").attr("src", a.data.url);
            });
            jQuery("#helloContainer").attr("data-logged-in", "1");
            if (null != B) {
                jQuery.ajax("https://m.agar.io/checkToken", {
                    error : function() {
                        B = null;
                        Ia(a$$0);
                    },
                    success : function(a) {
                        a = a.split("\n");
                        R({
                            e : +a[0],
                            f : +a[1],
                            d : +a[2]
                        });
                    },
                    dataType : "text",
                    method : "POST",
                    cache : false,
                    crossDomain : true,
                    data : B
                });
            } else {
                jQuery.ajax("https://m.agar.io/facebookLogin", {
                    error : function() {
                        B = null;
                        jQuery("#helloContainer").attr("data-logged-in", "0");
                    },
                    success : zb,
                    dataType : "text",
                    method : "POST",
                    cache : false,
                    crossDomain : true,
                    data : c
                });
            }
        }
    }

    function findAndInitRegion(){
        var regionMap = {
            AF : "JP-Tokyo", AX : "EU-London", AL : "EU-London", DZ : "EU-London", AS : "SG-Singapore", AD : "EU-London", AO : "EU-London", AI : "US-Atlanta", AG : "US-Atlanta", AR : "BR-Brazil", AM : "JP-Tokyo", AW : "US-Atlanta", AU : "SG-Singapore", AT : "EU-London", AZ : "JP-Tokyo", BS : "US-Atlanta", BH : "JP-Tokyo", BD : "JP-Tokyo", BB : "US-Atlanta", BY : "EU-London", BE : "EU-London", BZ : "US-Atlanta", BJ : "EU-London", BM : "US-Atlanta", BT : "JP-Tokyo", BO : "BR-Brazil", BQ : "US-Atlanta", BA : "EU-London", BW : "EU-London", BR : "BR-Brazil", IO : "JP-Tokyo", VG : "US-Atlanta", BN : "JP-Tokyo", BG : "EU-London", BF : "EU-London", BI : "EU-London", KH : "JP-Tokyo", CM : "EU-London", CA : "US-Atlanta", CV : "EU-London", KY : "US-Atlanta", CF : "EU-London", TD : "EU-London", CL : "BR-Brazil", CN : "CN-China", CX : "JP-Tokyo", CC : "JP-Tokyo", CO : "BR-Brazil", KM : "EU-London", CD : "EU-London", CG : "EU-London", CK : "SG-Singapore", CR : "US-Atlanta", CI : "EU-London", HR : "EU-London", CU : "US-Atlanta", CW : "US-Atlanta", CY : "JP-Tokyo", CZ : "EU-London", DK : "EU-London", DJ : "EU-London", DM : "US-Atlanta", DO : "US-Atlanta", EC : "BR-Brazil", EG : "EU-London", SV : "US-Atlanta", GQ : "EU-London", ER : "EU-London", EE : "EU-London", ET : "EU-London", FO : "EU-London", FK : "BR-Brazil", FJ : "SG-Singapore", FI : "EU-London", FR : "EU-London", GF : "BR-Brazil", PF : "SG-Singapore", GA : "EU-London", GM : "EU-London", GE : "JP-Tokyo", DE : "EU-London", GH : "EU-London", GI : "EU-London", GR : "EU-London", GL : "US-Atlanta", GD : "US-Atlanta", GP : "US-Atlanta", GU : "SG-Singapore", GT : "US-Atlanta", GG : "EU-London", GN : "EU-London", GW : "EU-London", GY : "BR-Brazil", HT : "US-Atlanta", VA : "EU-London", HN : "US-Atlanta", HK : "JP-Tokyo", HU : "EU-London", IS : "EU-London", IN : "JP-Tokyo", ID : "JP-Tokyo", IR : "JP-Tokyo", IQ : "JP-Tokyo", IE : "EU-London", IM : "EU-London", IL : "JP-Tokyo", IT : "EU-London", JM : "US-Atlanta", JP : "JP-Tokyo", JE : "EU-London", JO : "JP-Tokyo", KZ : "JP-Tokyo", KE : "EU-London", KI : "SG-Singapore", KP : "JP-Tokyo", KR : "JP-Tokyo", KW : "JP-Tokyo", KG : "JP-Tokyo", LA : "JP-Tokyo", LV : "EU-London", LB : "JP-Tokyo", LS : "EU-London", LR : "EU-London", LY : "EU-London", LI : "EU-London", LT : "EU-London", LU : "EU-London", MO : "JP-Tokyo", MK : "EU-London", MG : "EU-London", MW : "EU-London", MY : "JP-Tokyo", MV : "JP-Tokyo", ML : "EU-London", MT : "EU-London", MH : "SG-Singapore", MQ : "US-Atlanta", MR : "EU-London", MU : "EU-London", YT : "EU-London", MX : "US-Atlanta", FM : "SG-Singapore", MD : "EU-London", MC : "EU-London", MN : "JP-Tokyo", ME : "EU-London", MS : "US-Atlanta", MA : "EU-London", MZ : "EU-London", MM : "JP-Tokyo", NA : "EU-London", NR : "SG-Singapore", NP : "JP-Tokyo", NL : "EU-London", NC : "SG-Singapore", NZ : "SG-Singapore", NI : "US-Atlanta", NE : "EU-London", NG : "EU-London", NU : "SG-Singapore", NF : "SG-Singapore", MP : "SG-Singapore", NO : "EU-London", OM : "JP-Tokyo", PK : "JP-Tokyo", PW : "SG-Singapore", PS : "JP-Tokyo", PA : "US-Atlanta", PG : "SG-Singapore", PY : "BR-Brazil", PE : "BR-Brazil", PH : "JP-Tokyo", PN : "SG-Singapore", PL : "EU-London", PT : "EU-London", PR : "US-Atlanta", QA : "JP-Tokyo", RE : "EU-London", RO : "EU-London", RU : "RU-Russia", RW : "EU-London", BL : "US-Atlanta", SH : "EU-London", KN : "US-Atlanta", LC : "US-Atlanta", MF : "US-Atlanta", PM : "US-Atlanta", VC : "US-Atlanta", WS : "SG-Singapore", SM : "EU-London", ST : "EU-London", SA : "EU-London", SN : "EU-London", RS : "EU-London", SC : "EU-London", SL : "EU-London", SG : "JP-Tokyo", SX : "US-Atlanta", SK : "EU-London", SI : "EU-London", SB : "SG-Singapore", SO : "EU-London", ZA : "EU-London", SS : "EU-London", ES : "EU-London", LK : "JP-Tokyo", SD : "EU-London", SR : "BR-Brazil", SJ : "EU-London", SZ : "EU-London", SE : "EU-London", CH : "EU-London", SY : "EU-London", TW : "JP-Tokyo", TJ : "JP-Tokyo", TZ : "EU-London", TH : "JP-Tokyo", TL : "JP-Tokyo", TG : "EU-London", TK : "SG-Singapore", TO : "SG-Singapore", TT : "US-Atlanta", TN : "EU-London", TR : "TK-Turkey", TM : "JP-Tokyo", TC : "US-Atlanta", TV : "SG-Singapore", UG : "EU-London", UA : "EU-London", AE : "EU-London", GB : "EU-London", US : "US-Atlanta", UM : "SG-Singapore", VI : "US-Atlanta", UY : "BR-Brazil", UZ : "JP-Tokyo", VU : "SG-Singapore", VE : "BR-Brazil", VN : "JP-Tokyo", WF : "SG-Singapore", EH : "EU-London", YE : "JP-Tokyo", ZM : "EU-London", ZW : "EU-London"
        };
        jQuery.get(protocol + "//gc.agar.io", function(a) {
            var c = a.split(" ");
            a = c[0];
            c = c[1] || "";
            if (regionMap.hasOwnProperty(a)) {
                if ("string" == typeof regionMap[a]) {
                    setRegion(regionMap[a]);
                } else {
                    if (regionMap[a].hasOwnProperty(c)) {
                        setRegion(regionMap[a][c]);
                    }
                }
            }
        }, "text");
    }


    /* ============= Browser compatible things ========= */
    function browserIsNotCompatible(){
        var ib = document.createElement("canvas");
        return ("undefined" == typeof console ||
               ("undefined" == typeof DataView ||
               ("undefined" == typeof WebSocket ||
               (null == ib ||
               (null == ib.getContext || null == d.localStorage)))));
    }
    if (!Date.now) {
        Date.now = function() {
            return(new Date).getTime();
        };
    }

    /* Initialize some functions */

    var countFPS = (function () {
        var lastLoop = (new Date()).getTime();
        var count = 0;
        var fps = 0;

        return function () {
            var currentLoop = (new Date()).getTime();
            if (lastLoop + 1000 < currentLoop) {
                fps = count;
                count = 0;
                lastLoop = currentLoop;
            } else {
                count += 1;
            }
            return fps;
        };
    }());

    var renderMainCanvasWrapper = function() {
        var lastTime = Date.now();
        var targetRenderInterval = 1E3 / 60;
        return function() {
            d.requestAnimationFrame(renderMainCanvasWrapper);
            var now = Date.now();
            var timeSinceLastRender = now - lastTime;
            if (timeSinceLastRender > targetRenderInterval) {
                lastTime = now - timeSinceLastRender % targetRenderInterval;
                fps = countFPS();
                renderMainCanvas();
            }
        };
    }();

    var setIcon = function() { /* self modification function */
        /* draw cell for icon */
        var a = new Cell(0, 0, 0, 32, "#ED1C24", "");
        var iconCanvas = document.createElement("canvas");
        iconCanvas.width = 32;
        iconCanvas.height = 32;
        var ctx = iconCanvas.getContext("2d");
        return function() {
            if (0 < myCells.length) {
                a.color = myCells[0].color;
                a.setName(myCells[0].name);
            }
            ctx.clearRect(0, 0, 32, 32);
            ctx.save();
            ctx.translate(16, 16);
            ctx.scale(0.4, 0.4);
            a.render(ctx);
            ctx.restore();
            var d = document.getElementById("favicon");
            var f = d.cloneNode(true);
            try{
                f.setAttribute("href", iconCanvas.toDataURL("image/png"));
            }catch(err){
                console.log('setIcon failed! reason : ' + err.message);
            }
            d.parentNode.replaceChild(f, d);
        };
    }();

    /* Entry point */
    function Init(){
        if(!browserIsNotCompatible){
            alert("You browser does not support this game");
            return;
        }

        backgroundCanvasElement = document.getElementById("canvas-background");
        backgroundCtx = backgroundCanvasElement.getContext("2d");
        mainCanvasElement = document.getElementById("canvas-main");
        mainCtx = mainCanvasElement.getContext("2d");
        onresize();

        prepareNameCache();
    }

    var protocol = d.location.protocol;
    var quadTree = null;
    var webSocket = null;
    var viewCenterX = 0;
    var viewCenterY = 0;
    var myIDs = [];
    var myCells = [];
    var cellsByID = {};
    var allCells = [];
    var P = [];
    var E = [];
    var windowMouseX = 0;
    var windowMouseY = 0;
    var gameMouseX = -1;
    var gameMouseY = -1;
    var currentTime = 0;
    var db = 0;
    var I = null;
    var mapLeft = 0;
    var mapTop = 0;
    var mapRight = 1E4;
    var mapBottom = 1E4;
    var windowScale = 1;
    var region = null;
    var fb = true;
    var showNickName = true;
    var isColorsDisabled = false;
    var currentScore = 0;
    var targetViewCenterX = viewCenterX = ~~((mapLeft + mapRight) / 2);
    var targetViewCenterY = viewCenterY = ~~((mapTop + mapBottom) / 2);
    var $ = 1;
    var O = "";
    var teamLeaderBoard = null;
    var beingEaten = false;
    var mainEngineStarts = false;
    var ja = true;
    var Da = false;
    var Ba = 0;
    var Ca = 0;
    var ma = 0;
    var na = 0;
    var hb = 0;
    var yb = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
    var ka = false;
    var B = null;
    var H = 1;
    var w = 1;
    var isOverlayShowing = true;
    var za = 0;
    var Ma = "ontouchstart" in d && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var Ga = new Image;
    Ga.src = "img/split.png";
    var regionList = null;
    var J = null;
    var la = 500;
    var $a = -1;
    var ab = -1;
    var y = null;
    var C = 1;
    var leftBottomInfoCanvas = null;
    var imgCache = {};
    var fps = 0;
    var pressed = {};

    function QuadTreeFactory (area) {
        function QuadTree(a, c, b, d, e) {
            this.x = a;
            this.y = c;
            this.j = b;
            this.g = d;
            this.depth = e;
            this.items = [];
            this.subTree = [];
        }
        QuadTree.prototype = {
            x : 0,
            y : 0,
            j : 0,
            g : 0,
            depth : 0,
            items : null,
            subTree : null,
            H : function(a) {
                var i = 0;
                for (;i < this.items.length;++i) {
                    var b = this.items[i];
                    if (b.x >= a.x &&
                        b.y >= a.y &&
                        b.x < a.x + a.j &&
                        b.y < a.y + a.g) {
                        return true;
                    }
                }
                if (0 != this.subTree.length) {
                    var d = this;
                    return this.$(a, function(c) {
                        return d.subTree[c].H(a);
                    });
                }
                return false;
            },
            forEachInRange : function(a, c) {
                var i = 0;
                for (;i < this.items.length;++i) {
                    c(this.items[i]);
                }
                if (0 != this.subTree.length) {
                    var d = this;
                    this.callWithSlotId(a, function(b) {
                        d.subTree[b].forEachInRange(a, c);
                    });
                }
            },
            addItem : function(a) {
                if (0 != this.subTree.length) {
                    this.subTree[this.findSlot(a)].addItem(a);
                } else {
                    if (this.items.length >= 2 && this.depth < 4) {
                        this.addDepth();
                        this.subTree[this.findSlot(a)].addItem(a);
                    } else {
                        this.items.push(a);
                    }
                }
            },
            findSlot : function(a) {
                return a.x < this.x + this.j / 2 ?
                    a.y < this.y + this.g / 2 ?
                        0 : 2 :
                    a.y < this.y + this.g / 2 ?
                        1 : 3;
            },
            callWithSlotId : function(a, c) {
                return a.x < this.x + this.j / 2 &&
                            (a.y < this.y + this.g / 2 && c(0) ||
                             a.y >= this.y + this.g / 2 && c(2)) ||
                       a.x >= this.x + this.j / 2 &&
                            (a.y < this.y + this.g / 2 && c(1) ||
                             a.y >= this.y + this.g / 2 && c(3)) ? true : false;
            },
            addDepth : function() {
                var a = this.depth + 1;
                var b = this.j / 2;
                var d = this.g / 2;
                this.subTree.push(new QuadTree(this.x, this.y, b, d, a));
                this.subTree.push(new QuadTree(this.x + b, this.y, b, d, a));
                this.subTree.push(new QuadTree(this.x, this.y + d, b, d, a));
                this.subTree.push(new QuadTree(this.x + b, this.y + d, b, d, a));
                a = this.items;
                this.items = [];
                b = 0;
                for (;b < a.length;b++) {
                    this.addItem(a[b]);
                }
            },
            clear : function() {
                var a = 0;
                for (;a < this.subTree.length;a++) {
                    this.subTree[a].clear();
                }
                this.items.length = 0;
                this.subTree.length = 0;
            }
        };
        return{
            root : new QuadTree(
                                area.xMax,
                                area.yMax,
                                area.xMin - area.xMax,
                                area.yMin - area.yMax,
                                0),
            m : function(a) {
                this.root.addItem(a);
            },
            forEachInRange : function(a, c, b, e, f) {
                this.root.forEachInRange({ x:a, y:c, j:b, g:e }, f);
            },
            clear : function() {
                this.root.clear();
            }
        };
    }

    Init();
    /* Init */

    d.onload = mainEngine;
})(unsafeWindow, unsafeWindow.jQuery);

// ====================================== Stats Screen ===========================================================

var __STORAGE_PREFIX = "mikeyk730__";
var chart_update_interval = 10;
jQuery('body').append('<div id="chart-container" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>');
var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');

// make sure player sees ads at least once so Zeach doesn't go medieval on me.
var PlayerHasSeenOfficialAds =_.once(function (){
    jQuery("#ZCPlay").show();
    jQuery("#ZCClose").text("Close");
});

unsafeWindow.hideZCOverlay = function(){
    PlayerHasSeenOfficialAds();
    jQuery('#ZCOverlay').fadeOut();
};
unsafeWindow.showZCOverlay = function (){
    jQuery('#ZCOverlay').fadeIn();
    jQuery('#configTab').tab('show');
    OnShowOverlay(false);
};

/* Main Panel replace */
jQuery('#overlays > #helloContainer').appendTo(jQuery('body'));
jQuery('#overlays').remove();
jQuery('#helloContainer > .side-container').remove();
jQuery('#helloContainer > #stats').remove();
jQuery("#mainPanel form > div:nth-child(2)").replaceWith(
    '<div class="form-group clearfix">' +
    '    <input id="o-nick" class="form-control" placeholder="Nick" maxlength="15" autofocus="">' +
    '</div> ');
jQuery("#mainPanel form > div:nth-child(3)").replaceWith('<div></div>');
jQuery("#mainPanel form > div:nth-child(4)").replaceWith('<div></div>');
jQuery("#mainPanel form > div:nth-child(5)").replaceWith(
    '<div id="settings"></div>' + // dummy tag
    '<div class="form-group">' +
    '    <div class="input-group">' +
    '        <span class="input-group-btn">' +
    '            <button type="button" class="btn btn-default" onclick="refreshRoom();return true;"><i class="glyphicon glyphicon-refresh"></i></button>' +
    '        </span>' +
    '        <input type="text" class="form-control" id="roomIdOrIp" placeholder="房間代碼或伺服器位址">' +
    '        <span class="input-group-btn">' +
    '            <button type="button" class="btn btn-primary" onclick="joinRoom($(\'#roomIdOrIp\').val());return true;">加入</button>' +
    '        </span>' +
    '    </div>' +
    '</div>' +
    '<div class="checkbox" style="display:block">' +
    '    <div style="float: left; width: 200px;">' +
    '            <select id="o-region" class="form-control" onchange="setRegion($(\'#o-region\').val());return false;" required="" style="height:35px;">' +
    '                <option selected="" disabled="" value="" data-itr="region_select"> -- Select a Region -- </option>' +
    '                <option value="US-Atlanta" data-itr="region_north_america">North America (40784 players) (41855 players)</option>' +
    '                <option value="BR-Brazil" data-itr="region_south_america">South America (30614 players) (31714 players)</option>' +
    '                <option value="EU-London" data-itr="region_europe">Europe (92643 players) (92601 players)</option>' +
    '                <option value="RU-Russia" data-itr="region_russia">Russia (15674 players) (15634 players)</option>' +
    '                <option value="TK-Turkey" data-itr="region_turkey">Turkey (9769 players) (9712 players)</option>' +
    '                <option value="JP-Tokyo" data-itr="region_east_asia">East Asia (7938 players) (7757 players)</option>' +
    '                <option value="CN-China" data-itr="region_china">China (4222 players) (4140 players)</option>' +
    '                <option value="SG-Singapore" data-itr="region_oceania">Oceania (4340 players) (4327 players)</option>' +
    '            </select>' +
    '        <select id="o-gamemode" class="form-control" onchange="setGameMode();refreshRoom();return true" required="" style="margin-top:5px;height:35px;">' + // XXX: better style method
    '            <option selected="" value="" data-itr="gamemode_ffa">FFA</option>' +
    '            <option value=":teams" data-itr="gamemode_teams">Teams</option>' +
    '            <option value=":experimental" data-itr="gamemode_experimental">Experimental</option>' +
    '            <option value=":party" data-itr="party">Party</option>' +
    '        </select>' +
    '    </div>' +
    '    <div style="float: right; width: 120px;">' +
    '        <button onclick="spectate(); hideOverlay(); return false;" class="form-control btn btn-warning btn-spectate btn-needs-server" data-itr="spectate">Spectate</button>' +
    '        <button onclick="logout(); return false;" class="form-control btn btn-danger btn-logout" data-itr="logout">Logout</button>' +
    '    </div>' +
    '    <br clear="both">' +
    '</div>' +
    '<div class="form-group" id="agario-main-buttons">' +
    '    <button type="button" id="openZC" onclick="showZCOverlay();" class="btn btn-info btn-settings"><i class="glyphicon glyphicon-cog"></i></button>' +
    '    <button type="submit" onclick="setNick(document.getElementById(\'o-nick\').value); return false;" class="btn btn-play btn-primary btn-needs-server" data-itr="play">Play</button>' +
    '    <button type="submit" onclick="setNick(document.getElementById(\'o-nick\').value); return false;" class="btn btn-play-guest btn-success btn-needs-server" data-itr="play_as_guest">Play as guest</button>' +
    '    <button onclick="facebookLogin(); return false;" class="btn btn-login btn-primary" style="line-height: 24px;" data-original-title="" title="">' +
    '        <span class="social social-facebook" style="font-size:24px;margin-top:-6px;margin-left:-8px;vertical-align:middle;margin-right:5px;"></span>' +
    '        <span data-itr="login_and_play">Login and play</span>' +
    '    </button>' +
    '    <br clear="both">' +
    '</div>' +
    '<center>' +
    '<a href="privacy.txt" class="text-muted" data-itr="privacy_policy">Privacy Policy</a>' +
    ' | ' +
    '<a href="terms.txt" class="text-muted" data-itr="terms_of_service">Terms of Service</a>' +
    ' | ' +
    '<a href="changelog.txt" class="text-muted" data-itr="changelog">Changelog</a>'+
    '</center>'
);

/* Instructions not needed */
jQuery("#mainPanel > div:nth-child(2)").remove();

/* prevent origin script ruin my stuff */
jQuery("#mainPanel").attr("id","o-mainPanel");

/* We shouldn't remove ad's */
//jQuery(".side-container").remove();
//jQuery("#o-mainPanel > hr").remove();
//jQuery("#o-mainPanel > center").remove();

/* Custom setting panel */

jQuery('body').prepend(
    '<div id="ZCOverlay" class="bs-example-modal-lg" style="position:relative;z-index: 300;">'+
    '    <div class="modal-dialog modal-lg" style="margin: 0px; left: 50%; margin-right: -50%; margin-top: 30px; transform: translate(-50%, 0);">'+
    '        <div class="modal-content">'+
    '            <div class="modal-header">'+
    '                <button type="button" class="close" onclick="hideZCOverlay();")><span>×</span></button>'+
    '                <h4 class="modal-title">Agar.io plugin for poker v' +GM_info.script.version + '</h4>'+
    '            </div>'+
    '            <div id="ZCOverlayBody" class="modal-body" style="height:675px;">'+
    '            </div>'+
    '            <div class="modal-footer">'+
    '                <button type="button" id="ZCClose" class="btn btn-default" onclick="hideZCOverlay();">開始！</button>'+
    '                <button type="button" id="ZCPlay" class="btn btn-primary" onclick="hideZCOverlay();setNick(document.getElementById(\'o-nick\').value); return false;">開始遊戲</button>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>');

jQuery("#ZCPlay").hide();
jQuery('#ZCOverlayBody').append(
    '<div id="ZCStats" style="position:relative;width:100%; background-color: #FFFFFF; border-radius: 15px; padding: 5px 15px 5px 15px;">'+
    '    <ul class="nav nav-pills" role="tablist">' +
    '        <li role="presentation" class="active" > <a href="#page0" id="newsTab"   role="tab" data-toggle="tab">公告</a></li>' +
    '        <li role="presentation">                 <a href="#page1" id="statsTab"  role="tab" data-toggle="tab">統計</a></li>' +
    '        <li role="presentation">                 <a href="#page2" id="configTab" role="tab" data-toggle="tab">設置</a></li>' +
    '        <li role="presentation">                 <a href="#page3" id="helpTab"   role="tab" data-toggle="tab">幫助</a></li>' +
    '    </ul>'+
    '    <div id="bigbox" class="tab-content">' +
    '        <div id="page0" role="tabpanel" class="tab-pane active">' +
    '            <h3>歡迎使用台灣撲克 ♠♥♦♣插件</h3><p>' +
    '            <p>此插件為 Zeach Cobbler, agar-minimap 改編，</p>' +
    '            <p>若要使用大蟲插件 skin，請先使用大蟲插件加上插件房內的「大蟲相容小地圖」，<br />' +
    '            進入一次遊戲後按小地圖的 connect，點 F12 找主控台(console)即可看到包含 skin 代碼的玩家ID<span>例如「abc:醲」,「:醲」即為skin代碼</span></p>' +
    '            <div class="text-muted">目前還在早期測試階段，請回報錯誤或相關建議給 Eddy，謝謝！</div>' +
    '        </div>' +
    '        <div id="page1" role="tabpanel" class="tab-pane">' +
    '            <div class="row">' +
    '                <div id="statArea" class="col-sm-6" style="vertical-align:top;"></div>' +
    '                <div id="pieArea" class="col-sm-5" style="vertical-align: top; height:250px;"></div>' +
    '                <div id="padder" class="col-sm-1"></div>' +
    '            </div>' +
    '            <div class="row">' +
    '                <div id="gainArea" class="col-sm-6" style="vertical-align:top;"></div>' +
    '                <div id="lossArea" class="col-sm-6" style="vertical-align:top;"></div>' +
    '            </div>' +
    '            <div class="row">' +
    '                <div id="chartArea" class="col-sm-8" ></div>' +
    '                <div id="XPArea" class="col-sm-4"></div>' +
    '            </div>' +
    '        </div>' +
    '        <div id="page2" role="tabpanel" class="tab-pane">' +
    '            <div class="row">' +
    '                <div id="col1" class="col-sm-4 checkbox" style="padding-left: 5%; padding-right: 1%;"></div>' +
    '                <div id="col2" class="col-sm-4" style="padding-left: 2%; padding-right: 2%;"></div>' +
    '                <div id="col3" class="col-sm-4" style="padding-left: 2%; padding-right: 5%;"></div>' +
    '            </div>' +
    '        </div>'+
    '        <div id="page3" role="tabpanel" class="tab-pane">' +
    '            <div class="row">' +
    '            <div id="col1" class="col-sm-12" style="padding-left: 5%; padding-right: 1%;">' +
    '               <h3>遊戲按鍵</h3>' +
    '               <ul>' +
    '                   <li><B>W</B> - 射質量</li>' +
    '                   <li><B>Q</B> - 快速射質量</li>' +
    '                   <li><B>E</B> - 射擊滑鼠附近的刺球</li>' +
    '                   <li><B>SPACE</B> - 分裂</li>' +
    '                   <li><B>R</B> - 快速分裂</li>' +
    '                   <li><B>T</B> - 快速分裂兩次</li>' +
    '                   <li><B>S</B> - 鎖定在目前滑鼠位置</li>' +
    '                   <li><B>滾輪</B> - 縮放視角</li>' +
    '               </ul>' +
    '               <h3>功能開關</h3>' +
    '               <ul>' +
    '                   <li><B>TAB</B> - 切換主要球</li>' +
    '                   <li><B>C</B> - 輔助特效</li>' +
    '                   <li><B>G</B> - 新版導航</li>' +
    '                   <li><B>H</B> - 舊版導航</li>' +
    '                   <li><B>1...7</B> - 選擇第 n 大的球</li>' +
    '               </ul>' +
    '               <h3>觀戰模式</h3>' +
    '               <ul>' +
    '                   <li><B>v</B> - 觀戰模式自由移動</li>' +
    '                   <li><B>R + 滑鼠點擊</B> - 自由移動模式下追蹤指定球(目前球分裂會走失)</li>' +
    '               </ul>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>');
jQuery(".agario-profile-panel").appendTo("#XPArea");
jQuery("#statsTab").click(function(){OnShowOverlay(false);});
function LS_getValue(aKey, aDefault) {
    var val = localStorage.getItem(__STORAGE_PREFIX + aKey);
    if (null === val && 'undefined' != typeof aDefault) return aDefault;
    return val;
}

function LS_setValue(aKey, aVal) {
    localStorage.setItem(__STORAGE_PREFIX + aKey, aVal);
}

function GetRgba(hex_color, opacity)
{
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex_color);
    return "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+","+opacity+")";
}

function secondsToHms(d)
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var chart = null;
var chart_data = [];
var num_cells_data = [];
var chart_counter = 0;
var stat_canvas = null;

var stats = null;
var my_cells = null;
var my_color = "#ff8888";
var pie = null;
var stats_chart;

var display_chart = LS_getValue('display_chart', 'true') === 'true';
var display_stats = LS_getValue('display_stats', 'false') === 'true';

function AppendCheckbox(e, id, label, checked, on_change)
{
    e.append('<label><input type="checkbox" id="'+id+'">'+label+'</label><br>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}
function AppendCheckboxP(e, id, label, checked, on_change)
{
    e.append('<p><input type="checkbox" id="'+id+'">'+label+'</p>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}

function OnChangeDisplayChart(display)
{
    LS_setValue('display_chart', display ? 'true' : 'false');
    display_chart = display;
    display ? jQuery('#chart-container').show() : jQuery('#chart-container').hide();
}

function OnChangeDisplayStats(display)
{
    LS_setValue('display_stats', display ? 'true' : 'false');
    display_stats = display;
    RenderStats(false);
}

function ResetChart()
{
    chart = null;
    chart_data.length = 0;
    num_cells_data.length = 0;
    chart_counter = 0;
    jQuery('#chart-container').empty();
}

function UpdateChartData(mass)
{
    chart_counter++;
    if (chart_counter%chart_update_interval > 0)
        return false;

    num_cells_data.push({
        x: chart_counter,
        y: my_cells.length
    });

    chart_data.push({
        x: chart_counter,
        y: mass/100
    });
    return true;
}

function CreateChart(e, color, interactive)
{
    return new CanvasJS.Chart(e,{
        interactivityEnabled: false,
        title: null,
        axisX:{
            valueFormatString: " ",
            lineThickness: 0,
            tickLength: 0
        },
        axisY:{
            lineThickness: 0,
            tickLength: 0,
            gridThickness: 2,
            gridColor: "white",
            labelFontColor: "white"
        },
        backgroundColor: "rgba(0,0,0,0.2)",
        data: [{
            type: "area",
            color: color,
            dataPoints: chart_data
        }]
    });
}

function UpdateChart(mass, color)
{
    my_color = color;
    if (chart === null)
        chart = CreateChart("chart-container", color, false);
    if (UpdateChartData(mass) && display_chart)
        chart.render();

    jQuery('.canvasjs-chart-credit').hide();
}

function ResetStats()
{
    stats = {
        pellets: {num:0, mass:0},
        w: {num:0, mass:0},
        cells: {num:0, mass:0},
        viruses: {num:0, mass:0},

        birthday: Date.now(),
        time_of_death: null,
        high_score: 0,
        top_slot: Number.POSITIVE_INFINITY,

        gains: {},
        losses: {},
    };
}

function OnGainMass(me, other)
{
    var mass = other.size * other.size / 100;
    var mymass = me.size * me.size / 100;
    if (other.isVirus){
        stats.viruses.num++;
        stats.viruses.mass += mass; //TODO: shouldn't add if  game mode is teams
        sfx_event("virushit");
    }
    else if ( Math.floor(mass) <= 400 && !other.name){
        stats.pellets.num++;
        stats.pellets.mass += mass;
//        if(mymass < 300){
//            sfx_event("pellet");
//        }
    }
    // heuristic to determine if mass is 'w', not perfect
    else if (!other.name && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
        //console.log('w', mass, other.name, other);
        if (other.color != me.color){ //don't count own ejections, again not perfect
            stats.w.num++;
            stats.w.mass += mass;
        }
//        if(mymass / mass > 16){
//            sfx_event("eat");
//        }
    }
    else {
        //console.log('cell', mass, other.name, other);
        var key = other.name + ':' + other.color;
        stats.cells.num++;
        stats.cells.mass += mass;
        if (stats.gains[key] == undefined)
            stats.gains[key] = {num: 0, mass: 0};
        stats.gains[key].num++;
        stats.gains[key].mass += mass;
//        if(mymass / mass > 16){
//            sfx_event("eat");
//        }
    }
}

function OnLoseMass(me, other)
{
    var mass = me.size * me.size;
    var key = other.name + ':' + other.color;
    if (stats.losses[key] == undefined)
        stats.losses[key] = {num: 0, mass: 0};
    stats.losses[key].num++;
    stats.losses[key].mass += mass;
    sfx_event("eat");
}

function DrawPie(pellet, w, cells, viruses)
{
    var total = pellet + w + cells + viruses;
    pie = new CanvasJS.Chart("pieArea", {
        title: null,
        animationEnabled: false,
        legend:{
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 20,
            fontFamily: "Helvetica"
        },
        theme: "theme2",
        data: [{
            type: "pie",
            startAngle:-20,
            showInLegend: true,
            toolTipContent:"{legendText} {y}%",
            dataPoints: [
                {  y: 100*pellet/total, legendText:"pellets"},
                {  y: 100*cells/total, legendText:"cells"},
                {  y: 100*w/total, legendText:"w"},
                {  y: 100*viruses/total, legendText:"viruses"},
            ]
        }]
    });
    pie.render();
}

function GetTopN(n, p){
    var r = [];
    var a = Object.keys(stats[p]).sort(function(a, b) {return -(stats[p][a].mass - stats[p][b].mass)});
    for (var i = 0; i < n && i < a.length; ++i){
        var key = a[i];
        var mass = stats[p][key].mass;
        var name = key.slice(0,key.length-8);
        if (!name) name = "路人";
        var color = key.slice(key.length-7);
        r.push({name:name, color:color, mass:Math.floor(mass/100)});
    }
    return r;
}

function AppendTopN(n, p, list) {
    var a = GetTopN(n,p);
    for (var i = 0; i < a.length; ++i){
        var text = a[i].name + ' (' + (p == 'gains' ? '+' : '-') + a[i].mass + ' mass)';
        list.append('<li style="font-size: 16px; "><div style="width: 16px; height: 16px; border-radius: 50%; margin-right:5px; background-color: ' + a[i].color + '; display: inline-block;"></div>' + text + '</li>');
    }
    return a.length > 0;
}

function ShowZCStats(){
    if(cobbler.showZcStats){
        jQuery("#ZCOverlay").fadeIn();
        jQuery('#statsTab').tab('show');
    }

}

function DrawStats(game_over) {
    if (stats == null){
        jQuery('#statArea').html('<h2>尚未有任何紀錄！</h2>');
        return;
    }

    jQuery('#statArea').empty();
    jQuery('#pieArea').empty();
    jQuery('#gainArea').empty();
    jQuery('#lossArea').empty();
    jQuery('#chartArea').empty();

    if (game_over){
        stats.time_of_death = Date.now();
        sfx_play(1);
        StopBGM();
        ShowZCStats();
        if(window.cobbler.autoRespawn && window.cobbler.grazingMode){setTimeout(function(){jQuery(".btn-play-guest").click();},3000);}
    }
    var time = stats.time_of_death ? stats.time_of_death : Date.now();
    var seconds = (time - stats.birthday)/1000;

    var list = jQuery('<ul>');
    list.append('<li style="font-size: 16px; ">Game time: ' + secondsToHms(seconds) + '</li>');
    list.append('<li style="font-size: 16px; ">High score: ' + ~~(stats.high_score/100) + '</li>');
    if (stats.top_slot == Number.POSITIVE_INFINITY){
        list.append('<li style="font-size: 16px; ">You didn\'t make the leaderboard</li>');
    }
    else {
        list.append('<li style="font-size: 16px; ">Leaderboard max: ' + stats.top_slot + '</li>');
    }
    list.append('<li style="font-size: 16px; padding-top: 15px">' + stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.w.num + " masses eaten (" + ~~(stats.w.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ' mass)</li>');
    jQuery('#statArea').append('<h2>Game Summary</h2>');
    jQuery('#statArea').append(list);

    DrawPie(stats.pellets.mass, stats.w.mass, stats.cells.mass, stats.viruses.mass);

    jQuery('#gainArea').append('<h3>Top Gains</h3>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'gains', list))
        jQuery('#gainArea').append(list);
    else
        jQuery('#gainArea').append('<ul><li style="font-size: 16px; ">You have not eaten anybody</li></ul>');

    jQuery('#lossArea').append('<h3>Top Losses</h3>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'losses', list))
        jQuery('#lossArea').append(list);
    else
        jQuery('#lossArea').append('<ul><li style="font-size: 16px; ">Nobody has eaten you</li></ul>');

    if (stats.time_of_death !== null){
        jQuery('#chartArea').height(200);
        jQuery('#chartArea')[0].height=200;
        stat_chart = CreateChart('chartArea', my_color, true);
        var scale = Math.max.apply(Math,chart_data.map(function(o){return o.y;}))/16;
        var scaled_data = num_cells_data.map(function(a){return {x:a.x, y:a.y*scale};});
        stat_chart.options.data.push({type: "line", dataPoints: scaled_data, toolTipContent:" "});
        stat_chart.render();
    }
    else {
        jQuery('#chartArea').height(200);
        jQuery('#chartArea')[0].height=200;
    }
}

var styles = {
    heading: {font:"30px Ubuntu", spacing: 41, alpha: 1},
    subheading: {font:"25px Ubuntu", spacing: 31, alpha: 1},
    normal: {font:"17px Ubuntu", spacing: 21, alpha: 0.6}
};

var g_stat_spacing = 0;
var g_display_width = 310;
var g_layout_width = g_display_width;

function AppendText(text, context, style) {
    context.globalAlpha = styles[style].alpha;
    context.font = styles[style].font;
    g_stat_spacing += styles[style].spacing;

    var width = context.measureText(text).width;
    g_layout_width = Math.max(g_layout_width, width);
    context.fillText(text, g_layout_width/2 - width/2, g_stat_spacing);
}

function RenderStats(reset) {
    if (reset) g_layout_width = g_display_width;
    if (!display_stats || !stats) return;
    g_stat_spacing = 0;

    var gains = GetTopN(3, 'gains');
    var losses =  GetTopN(3, 'losses');
    var height = 30 + styles['heading'].spacing + styles['subheading'].spacing * 2 + styles['normal'].spacing * (4 + gains.length + losses.length);

    stat_canvas = document.createElement("canvas");
    var scale = Math.min(g_display_width, .3 * window.innerWidth) / g_layout_width;
    stat_canvas.width = g_layout_width * scale;
    stat_canvas.height = height * scale;
    var context = stat_canvas.getContext("2d");
    context.scale(scale, scale);

    context.globalAlpha = .4;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, g_layout_width, height);

    context.fillStyle = "#FFFFFF";
    AppendText("Stats", context, 'heading');

    var text = stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.w.num + " mass eaten (" + ~~(stats.w.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ")";
    AppendText(text, context,'normal');

    AppendText("Top Gains",context,'subheading');
    for (var j = 0; j < gains.length; ++j){
        text = (j+1) + ". " + gains[j].name + " (" + gains[j].mass + ")";
        context.fillStyle = gains[j].color;
        AppendText(text, context,'normal');
    }

    context.fillStyle = "#FFFFFF";
    AppendText("Top Losses",context,'subheading');
    for (var j = 0; j < losses.length; ++j){
        text = (j+1) + ". " + losses[j].name + " (" + losses[j].mass + ")";
        context.fillStyle = losses[j].color;
        AppendText(text, context,'normal');
    }
}

jQuery(unsafeWindow).resize(function() {
    RenderStats(false);
});

unsafeWindow.OnGameStart = function(cells) {
    my_cells = cells;
    ResetChart();
    ResetStats();
    RenderStats(true);
    StartBGM();
    sfx_play(0);
};

unsafeWindow.OnShowOverlay = function(game_in_progress) {
    DrawStats(!game_in_progress);
};

unsafeWindow.OnUpdateMass = function(mass) {
    stats.high_score = Math.max(stats.high_score, mass);
    UpdateChart(mass, GetRgba(my_cells[0].color,0.4));
};

unsafeWindow.OnCellEaten = function(predator, prey) {
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
        RenderStats(false);
    }
    if (my_cells.indexOf(prey) != -1){
        OnLoseMass(prey, predator);
        RenderStats(false);
    }
};

unsafeWindow.OnLeaderboard = function(position) {
    stats.top_slot = Math.min(stats.top_slot, position);
};
unsafeWindow.OnDraw = function(context) {
    display_stats && stat_canvas && context.drawImage(stat_canvas, 10, 10);
};

// ====================== Music & SFX System ==============================================================
//sfx play on event (only one of each sfx can play - for sfx that won't overlap with itself)
var ssfxlist = [
    'spawn',
    'gameover'
];
var ssfxs = [];
for (i=0;i<ssfxlist.length;i++) {
    var newsfx = new Audio("http://skins.agariomods.com/botb/sfx/" + ssfxlist[i] + ".mp3");
    newsfx.loop = false;
    ssfxs.push(newsfx);
}
function sfx_play(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = ssfxs[id];
    event.volume = document.getElementById("sfx").value;
    event.play();
}

//sfx insertion on event (multiple of same sfx can be played simultaneously)
var sfxlist = [
    'pellet',
    'split',
    'eat',
    'bounce',
    'merge',
    'virusfeed',
    'virusshoot',
    'virushit'
];

var sfxs = {};
for (i=0;i<sfxlist.length;i++) {
    var newsfx = new Audio("//skins.agariomods.com/botb/sfx/" + sfxlist[i] + ".mp3");
    newsfx.loop = false;
    newsfx.onended = function() {
        $(this).remove();
    };
    sfxs[sfxlist[i]] = newsfx;
}
function sfx_event(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = jQuery.clone(sfxs[id]);
    event.volume = document.getElementById("sfx").value;
    event.play();
}

var StartBGM = function () {
    if (document.getElementById("bgm").value==0) return;
    if (bgmusic.src == ""){
        bgmusic.src = _.sample(tracks, 1);
        bgmusic.load()
    }
    bgmusic.volume = document.getElementById("bgm").value;
    bgmusic.play();
};

var StopBGM = function () {
    bgmusic.pause();
    if (document.getElementById("bgm").value==0) return;
    bgmusic.src = _.sample(tracks, 1);
    bgmusic.load()
};

volBGM = function (vol) {
    console.log(vol.toString() + " - " + document.getElementById("bgm").value)
    bgmusic.volume = document.getElementById("bgm").value;
    window.cobbler.bgmVol = document.getElementById("bgm").value;
};

volSFX = function (vol) {
    window.cobbler.sfxVol = vol;
};

var tracks = ['http://incompetech.com/music/royalty-free/mp3-preview2/Frost%20Waltz.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Frozen%20Star.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Groove%20Grove.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Dreamy%20Flashback.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Impact%20Lento.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Wizardtorium.mp3'];
/*sfx*/
var nodeAudio = document.createElement("audio");
nodeAudio.id = 'audiotemplate';
nodeAudio.preload = "auto";
jQuery(".agario-panel").get(0).appendChild(nodeAudio);


var bgmusic = $('#audiotemplate').clone()[0];
bgmusic.src = tracks[Math.floor(Math.random() * tracks.length)];
bgmusic.load();
bgmusic.loop = false;
bgmusic.onended = function() {
    var track = tracks[Math.floor(Math.random() * tracks.length)];
    bgmusic.src = track;
    bgmusic.play();
};


var col1 = $("#col1");
col1.append("<h4>基本設置</h4>");
AppendCheckbox(col1, 'showZcStats-checkbox', ' 在死亡後顯示統計', window.cobbler.showZcStats, function(val){window.cobbler.showZcStats = val;});
col1.append("<h4>遊戲模式</h4>");
AppendCheckbox(col1, 'isnightmode-checkbox', ' 夜間模式', window.cobbler.isNightMode, function(val){window.cobbler.isNightMode = val;drawBackground()});
AppendCheckbox(col1, 'litebrite-checkbox', ' 啟用半透明', window.cobbler.isLiteBrite, function(val){window.cobbler.isLiteBrite = val;});
col1.append("<h4>視覺設置</h4>");
AppendCheckbox(col1, 'showmass-checkbox', ' 顯示所有玩家質量', window.cobbler.showmass, function(val){window.cobbler.showmass = val;});
AppendCheckbox(col1, 'movementline-checkbox', ' 顯示方向輔助線', window.cobbler.drawMovementLine, function(val){window.cobbler.drawMovementLine = val;});
AppendCheckbox(col1, 'cooridate-checkbox', ' 顯示背景座標', window.cobbler.drawCoordinate, function(val){window.cobbler.drawCoordinate = val;});
AppendCheckbox(col1, 'splitguide-checkbox', ' 顯示攻擊範圍', window.cobbler.splitGuide, function(val){window.cobbler.splitGuide = val;});
AppendCheckbox(col1, 'hintcolor-checkbox', ' 開啟增強色', window.cobbler.hintColor, function(val){window.cobbler.hintColor= val;});
AppendCheckbox(col1, 'gridlines-checkbox', ' 顯示網格', window.cobbler.gridLines, function(val){window.cobbler.gridLines = val;});
AppendCheckbox(col1, 'simplecelldraw-checkbox', ' 簡易細胞繪制(無碰撞特效)', window.cobbler.simpleCellDraw, function(val){window.cobbler.simpleCellDraw = val;});
col1.append("<h4>統計</h4>");
AppendCheckbox(col1, 'chart-checkbox', ' 在遊戲中顯示圖表', display_chart, OnChangeDisplayChart);
AppendCheckbox(col1, 'stats-checkbox', ' 在遊戲中顯示統計', display_stats, OnChangeDisplayStats);

    // TODO: move to another panel
    //'        <div id="options" style="margin: 6px; font-size: 12px;">' +
    //'            <label><input type="checkbox" onchange="setSkins(!$(this).is(\':checked\'));"><span data-itr="option_no_skins">No skins</span></label>' +
    //'            <label><input type="checkbox" onchange="setNames(!$(this).is(\':checked\'));"><span data-itr="option_no_names">No names</span></label>' +
    //'            <label><input type="checkbox" onchange="setColors($(this).is(\':checked\'));"><span data-itr="option_no_colors">No colors</span></label>' +
    //'            <label><input type="checkbox" onchange="setSkipStats($(this).is(\':checked\'));"><span data-itr="option_skip_stats">Skip stats</span></label>' +
    //'        </div>' +

var col2 = $("#col2");
col2.append('<h4>偵錯</h4><div class="btn-group-sm" role="group" data-toggle="buttons">' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugNone" autocomplete="off" value=0>None</label>' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugLow" autocomplete="off" value=1>Low</label>' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugHigh" autocomplete="off" value=2>High</label>' +
    '</div>');
$('input[name="DebugLevel"]:radio[value='+window.cobbler.debugLevel +']').parent().addClass("active");
$('input[name="DebugLevel"]').change( function() {window.cobbler.debugLevel = $(this).val();});

col2.append('<h4>刺球設置</h4><h5>射擊速度</h5><div id="mspershot-group" class="input-group input-group-sm"> <input type="text" id="mspershot-textbox" class="form-control" placeholder="1-2000 (Default: 100)"' +
    'value=' + cobbler.msDelayBetweenShots.toString() + '><span class="input-group-addon">ms</span></div><h6>145ms = 每秒W 7次 數值越小越快 可是越不穩定</h6>');
$('#mspershot-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval) && newval > 0 && newval <= 2000) {
        $("#mspershot-group").removeClass('has-error');
        cobbler.msDelayBetweenShots = newval;
    }
    else{
        $("#mspershot-group").addClass('has-error');
    }
});

col2.append('<h4>小地圖比例(暫無效果)</h4>' +
    '<div id="minimap-group" class="input-group input-group-sm"><span class="input-group-addon"><input id="minimap-checkbox" type="checkbox"></span>' +
    '<input id="minimap-textbox" type="text" placeholder="64 = 1/64 scale" class="form-control" value='+ cobbler.miniMapScaleValue +'></div>');
$('#minimap-checkbox').change(function(){
    if(!!this.checked){
        $('#minimap-textbox').removeAttr("disabled");
    } else {
        $('#minimap-textbox').attr({disabled:"disabled"})
    }
    cobbler.miniMapScale = !!this.checked;
});
if(cobbler.miniMapScale){$('#minimap-checkbox').prop('checked', true);}else{ $('#minimap-textbox').attr({disabled:"disabled"})}
$('#minimap-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval) && newval > 1 && newval < 999) {
        $("#minimap-group").removeClass('has-error');
        cobbler.miniMapScaleValue = newval;
    }
    else{
        $("#minimap-group").addClass('has-error');
    }
});

col2.append('<h4>自動導航</h4><div id="grazer-checks" class="checkbox" ></div>');
var grazerChecks = $("#grazer-checks");
AppendCheckbox(grazerChecks, 'autorespawn-checkbox', ' 自動復活', window.cobbler.autoRespawn, function(val){window.cobbler.autoRespawn = val;});
AppendCheckbox(grazerChecks, 'option5', ' 顯示判斷線', window.cobbler.visualizeGrazing, function(val){window.cobbler.visualizeGrazing = val;});

col2.append('<h5>混和導航</h5>' +
            '<div id="hybrid-group" class="input-group input-group-sm"><span class="input-group-addon"><input id="hybrid-checkbox" type="checkbox"></span>' +
            '<input id="hybrid-textbox" type="text" class="form-control" value='+ cobbler.grazerHybridSwitchMass +' placeholder="Default: 300"></div>' +
            '<h6>請先啟用舊的導航成長, 超過指定質量時改用新的</h6>');
$('#hybrid-checkbox').change(function(){
    if(!!this.checked){
        $('#hybrid-textbox').removeAttr("disabled");
    } else {
        $('#hybrid-textbox').attr({disabled:"disabled"});
    }
    cobbler.grazerHybridSwitch = !!this.checked;
});

if(cobbler.grazerHybridSwitch){ 
    $('#hybrid-checkbox').prop('checked', true);
}else{
    $('#hybrid-textbox').attr({disabled:"disabled"});
}

$('#hybrid-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval)) {
        $("#hybrid-group").removeClass('has-error');
        cobbler.grazerHybridSwitchMass = newval;
    }
    else{
        $("#hybrid-group").addClass('has-error');
    }
});

var col3 = $("#col3");
col3.append("<h4>音效/音樂</h4>");
col3.append('<p>音效<input id="sfx" type="range" value=' + window.cobbler.sfxVol + ' step=".1" min="0" max="1" oninput="volSFX(this.value);"></p>');
col3.append('<p>音樂<input type="range" id="bgm" value=' + window.cobbler.bgmVol + ' step=".1" min="0" max="1" oninput="volBGM(this.value);"></p>');
col3.append('<h4>皮膚來源</h4>');
AppendCheckboxP(col3, 'amConnect-checkbox', ' AgarioMods的使用者皮膚', window.cobbler.amConnectSkins, function(val){window.cobbler.amConnectSkins = val;});
AppendCheckboxP(col3, 'amExtended-checkbox', ' AgarioMods的擴充皮膚', window.cobbler.amExtendedSkins, function(val){window.cobbler.amExtendedSkins = val;});
AppendCheckboxP(col3, 'imgur-checkbox', ' imgur 皮膚', window.cobbler.imgurSkins, function(val){window.cobbler.imgurSkins = val;});
AppendCheckboxP(col3, 'dachong-checkbox', ' 大蟲插件皮膚', window.cobbler.daChongSkins, function(val){window.cobbler.daChongSkins = val;});

var agariomodsSkins = ("0chan;18-25;1up;360nati0n;8ball;UmguwJ0;aa9skillz;ace;adamzonetopmarks;advertisingmz;agariomods.com;al sahim;alaska;albania;alchestbreach;alexelcapo;algeria;am3nlc;amoodiesqueezie;amway921wot;amyleethirty3;anarchy;android;angrybirdsnest;angryjoeshow;animebromii;anonymous;antvenom;aperture;apple;arcadego;assassinscreed;atari;athenewins;authenticgames;avatar;aviatorgaming;awesome;awwmuffin;aypierre;baka;balenaproductions;bandaid;bane;baseball;bashurverse;basketball;bateson87;batman;battlefield;bdoubleo100;beats;bebopvox;belarus;belgium;bender;benderchat;bereghostgames;bert;bestcodcomedy;bielarus;bitcoin;bjacau1;bjacau2;black widow;blackiegonth;blitzwinger;blobfish;bluexephos;bluh;blunty3000;bobross;bobsaget;bodil30;bodil40;bohemianeagle;boo;boogie2988;borg;bowserbikejustdance;bp;breakfast;breizh;brksedu;buckballs;burgundy;butters;buzzbean11;bystaxx;byzantium;calfreezy;callofduty;captainsparklez;casaldenerd;catalonia;catalunya;catman;cavemanfilms;celopand;chaboyyhd;chaika;chaosxsilencer;chaoticmonki;charlie615119;charmander;chechenya;checkpointplus;cheese;chickfila;chimneyswift11;chocolate;chrisandthemike;chrisarchieprods;chrome;chucknorris;chuggaaconroy;cicciogamer89;cinnamontoastken;cirno;cj;ckaikd0021;clanlec;clashofclansstrats;cling on;cobanermani456;coca cola;codqg;coisadenerd;cokacola;colombia;colombiaa;commanderkrieger;communitygame;concrafter;consolesejogosbrasil;controless ;converse;cookie;coolifegame;coookie;cornella;cornellà;coruja;craftbattleduty;creeper;creepydoll;criken2;criousgamers;cristian4games;csfb;cuba;cubex55;cyberman65;cypriengaming;cyprus;czech;czechia;czechrepublic;d7297ut;d7oomy999;dagelijkshaadee;daithidenogla;darduinmymenlon;darksideofmoon;darksydephil;darkzerotv;dashiegames;day9tv;deadloxmc;deadpool;deal with it;deathly hallows;deathstar;debitorlp;deigamer;demon;derp;desu;dhole;diabl0x9;dickbutt;dilleron;dilleronplay;direwolf20;dissidiuswastaken;dnb;dnermc;doge;doggie;dolan;domo;domokun;donald;dong;donut;doraemon;dotacinema;douglby;dpjsc08;dreamcast;drift0r;drunken;dspgaming;dusdavidgames;dykgaming;ea;easports;easportsfootball;eatmydiction1;eavision;ebin;eeoneguy;egg;egoraptor;eguri89games;egypt;eksi;electrokitty;electronicartsde;elementanimation;elezwarface;eligorko;elrubiusomg;enzoknol;eowjdfudshrghk;epicface;ethoslab;exetrizegamer;expand;eye;facebook;fantabobgames;fast forward;fastforward;favijtv;fazeclan;fbi;fer0m0nas;fernanfloo;fgteev;fidel;fiji;finn;fir4sgamer;firefox;fishies;flash;florida;fnatic;fnaticc;foe;folagor03;forcesc2strategy;forocoches;frankieonpcin1080p;freeman;freemason;friesland;frigiel;frogout;fuckfacebook;fullhdvideos4me;funkyblackcat;gaben;gabenn;gagatunfeed;gamebombru;gamefails;gamegrumps;gamehelper;gameloft;gamenewsofficial;gameplayrj;gamerspawn;games;gameshqmedia;gamespot;gamestarde;gametrailers;gametube;gamexplain;garenavietnam;garfield;gassymexican;gaston;geilkind;generikb;germanletsfail;getinmybelly;getinthebox;ghostrobo;giancarloparimango11;gimper;gimperr;github;giygas;gizzy14gazza;gnomechild;gocalibergaming;godsoncoc;gogomantv;gokoutv;goldglovetv;gommehd;gona89;gonzo;gonzossm;grammar nazi;grayhat;grima;gronkh;grumpy;gtamissions;gtaseriesvideos;guccinoheya;guilhermegamer;guilhermeoss;gurren lagann;h2odelirious;haatfilms;hagrid;halflife;halflife3;halo;handicapped;hap;hassanalhajry;hatty;hawaii;hawkeye;hdluh;hdstarcraft;heartrockerchannel;hebrew;heisenburg;helix;helldogmadness;hikakingames;hikeplays;hipsterwhale;hispachan;hitler;homestuck;honeycomb;hosokawa;hue;huskymudkipz;huskystarcraft;hydro;iballisticsquid;iceland;ie;igameplay1337;ignentertainment;ihascupquake;illuminati;illuminatiii;ilvostrocarodexter;imaqtpie;imgur;immortalhdfilms;imperial japan;imperialists;imperialjapan;imvuinc;insanegaz;insidegaming;insidersnetwork;instagram;instalok;inthelittlewood;ipodmail;iron man;isaac;isamuxpompa;isis;isreal;itchyfeetleech;itsjerryandharry;itsonbtv;iulitm;ivysaur;izuniy;jackfrags;jacksepticeye;jahovaswitniss;jahrein;jaidefinichon;james bond;jamesnintendonerd;jamonymow;java;jellyyt;jeromeasf;jew;jewnose;jibanyan;jimmies;jjayjoker;joeygraceffagames;johnsju;jontronshow;josemicod5;joueurdugrenier;juegagerman;jumpinthepack;jupiter;kalmar union;kame;kappa;karamba728;kenny;keralis;kiloomobile;kingdomoffrance;kingjoffrey;kinnpatuhikaru;kirby;kitty;kjragaming;klingon;knekrogamer;knights templar;knightstemplar;knowyourmeme;kootra;kripparrian;ksiolajidebt;ksiolajidebthd;kuplinovplay;kurdistan;kwebbelkop;kyle;kyokushin4;kyrsp33dy;ladle;laggerfeed;lazuritnyignom;ldshadowlady;le snake;lenny;letsplay;letsplayshik;letstaddl;level5ch;levelcapgaming;lgbt;liberland;libertyy;liechtenstien;lifesimmer;linux;lisbug;littlelizardgaming;llessur;loadingreadyrun;loki;lolchampseries;lonniedos;love;lpmitkev;luigi;luke4316;m3rkmus1c;macedonia;machinimarealm;machinimarespawn;magdalenamariamonika;mahalovideogames;malena010102;malta;mario;mario11168;markipliergame;mars;maryland;masterball;mastercheif;mateiformiga;matroix;matthdgamer;matthewpatrick13;mattshea;maxmoefoegames;mcdonalds;meatboy;meatwad;meatwagon22;megamilk;messyourself;mickey;mike tyson;mike;miles923;minecraftblow;minecraftfinest;minecraftuniverse;miniladdd;miniminter;minnesotaburns;minnie;mkiceandfire;mlg;mm7games;mmohut;mmoxreview;mod3rnst3pny;moldova;morealia;mortalkombat;mr burns;mr.bean;mr.popo;mrchesterccj;mrdalekjd;mredxwx;mrlev12;mrlololoshka;mrvertez;mrwoofless;multirawen;munchingorange;n64;naga;namcobandaigameseu;nasa;natusvinceretv;nauru;nazi;nbgi;needforspeed;nepenthez;nextgentactics;nextgenwalkthroughs;ngtzombies;nick fury;nick;nickelodeon;niichts;nintendo;nintendocaprisun;nintendowiimovies;nipple;nislt;nobodyepic;node;noobfromua;northbrabant;northernlion;norunine;nosmoking;notch;nsa;obama;obey;officialclashofclans;officialnerdcubed;oficialmundocanibal;olafvids;omfgcata;onlyvgvids;opticnade;osu;ouch;outsidexbox;p3rvduxa;packattack04082;palau;paluten;pandaexpress;paulsoaresjr;pauseunpause;pazudoraya;pdkfilms;peanutbuttergamer;pedo;pedobear;peinto1008;peka;penguin;penguinz0;pepe;pepsi;perpetuumworld;pewdiepie;pi;pietsmittie;pig;piggy;pika;pimpnite;pinkfloyd;pinkstylist;pirate;piratebay;pizza;pizzaa;plagasrz;plantsvszombies;playclashofclans;playcomedyclub;playscopetrailers;playstation;playstation3gaminghd;pockysweets;poketlwewt;pooh;oop;popularmmos;potato;prestonplayz;protatomonster;prowrestlingshibatar;pt;pur3pamaj;quantum leap;question;rageface;rajmangaminghd;retard smile;rewind;rewinside;rezendeevil;reziplaygamesagain;rfm767;riffer333;robbaz;rockalone2k;rockbandprincess1;rockstar;rockstargames;rojov13;rolfharris;roomba;roosterteeth;roviomobile;rspproductionz;rss;rusgametactics;ryukyu;s.h.e.i.l.d;sah4rshow;samoa;sara12031986;sarazarlp;satan;saudi arabia;scream;screwattack;seal;seananners;serbia;serbiangamesbl;sethbling;sharingan;shell;shine;shofu;shrek;shufflelp;shurikworld;shuuya007;sinistar;siphano13;sir;skillgaming;skinspotlights;skkf;skull;skydoesminecraft;skylandersgame;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;smikesmike05;smoothmcgroove;smoove7182954;smoshgames;snafu;snapchat;snoop dogg;soccer;soliare;solomid;somalia;sp4zie;space ace;space;sparklesproduction;sparkofphoenix;spawn;speedyw03;speirstheamazinghd;spiderman;spongegar;spore;spqr;spy;squareenix;squirtle;ssohpkc;sssniperwolf;ssundee;stalinjr;stampylonghead;star wars rebel;starbucks;starchild;starrynight;staxxcraft;stitch;stupid;summit1g;sunface;superevgexa;superman;superskarmory;swiftor;swimmingbird941;syria;t3ddygames;tackle4826;taco;taltigolt;tasselfoot;tazercraft;tbnrfrags;tctngaming;teamfortress;teamgarrymoviethai;teammojang;terrorgamesbionic;tetraninja;tgn;the8bittheater;thealvaro845;theatlanticcraft;thebajancanadian;thebraindit;thecraftanos;thedanirep;thedeluxe4;thediamondminecart;theescapistmagazine;thefantasio974;thegaminglemon;thegrefg;thejoves;thejwittz;themasterov;themaxmurai;themediacows;themrsark;thepolishpenguinpl;theradbrad;therelaxingend;therpgminx;therunawayguys;thesims;theskylanderboy;thesw1tcher;thesyndicateproject;theuselessmouth;thewillyrex;thnxcya;thor;tintin;tmartn;tmartn2;tobygames;tomo0723sw;tonga;topbestappsforkids;totalhalibut;touchgameplay;transformer;transformers;trickshotting;triforce;trollarchoffice;trollface;trumpsc;tubbymcfatfuck;turkey;tv;tvddotty;tvongamenet;twitch;twitter;twosyncfifa;typicalgamer;uberdanger;uberhaxornova;ubisoft;uguu;ukip;ungespielt;uppercase;uruguay;utorrent;vanossgaming;vatican;venomextreme;venturiantale;videogamedunkey;videogames;vietnam;vikkstar123;vikkstar123hd;vintagebeef;virus;vladnext3;voat;voyager;vsauce3;w1ldc4t43;wakawaka;wales;walrus;wazowski;wewlad;white  light;whiteboy7thst;whoyourenemy;wiiriketopray;willyrex;windows;wingsofredemption;wit my woes;woodysgamertag;worldgamingshows;worldoftanks;worldofwarcraft;wowcrendor;wqlfy;wroetoshaw;wwf;wykop;xalexby11;xbox;xboxviewtv;xbulletgtx;xcalizorz;xcvii007r1;xjawz;xmandzio;xpertthief;xrpmx13;xsk;yamimash;yarikpawgames;ycm;yfrosta;yinyang;ylilauta;ylilautaa;yoba;yobaa;yobaaa;yogscast2;yogscastlalna;yogscastsips;yogscastsjin;yoteslaya;youalwayswin;yourheroes;yourmom;youtube;zackscottgames;zangado;zazinombies;zeecrazyatheist;zeon;zerkaahd;zerkaaplays;zexyzek;zimbabwe;zng;zoella;zoidberg;zombey;zoomingames").split(";");
var defaultSkins = ("poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook").split(";");
var textBlobs = ["8", "nasa"];
