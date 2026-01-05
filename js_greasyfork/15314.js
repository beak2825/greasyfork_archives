// ==UserScript==
// @name         Wol HKG 2
// @namespace    Wol HKG
// @version      2.0.0
// @description  HKG Wol 2
// @author       dimotsai/EDIT BY MANIAC
// @license      Wol HKG 2
// @match        http://agar.io/*
// @require      http://cdn.jsdelivr.net/msgpack/1.05/msgpack.js
// @require      https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @require      https://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/15314/Wol%20HKG%202.user.js
// @updateURL https://update.greasyfork.org/scripts/15314/Wol%20HKG%202.meta.js
// ==/UserScript==

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

    var currentConfig = Config_DaChong;

    var fieldName = currentConfig.fieldName;
    var injectOnMessage = currentConfig.injectOnMessage;
    var defaultServer = "ws://eddy.zone.be:8000";

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
    var minimapHeight = 230;
    var minimapWidth = 230;
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
                    console.log('update-list');
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
                                    window.connectJ(e.data.token);
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
if(players[id_players[id]].name){
                        /* draw name only once */
                        ctx.font = '14px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'white';
                        ctx.fillText(String.fromCharCode.apply(null, players[id_players[id]].name), x, y + ((size < 10) ? 10 : size * 1.3));
                        rendered_player.push(id_players[id]);
}
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
            jQuery('body').append(
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
                '.dropdown:hover ul{' +
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
                '            <ul>' +
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
                    window.Minimap.ToggleSidebar();
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

            if(k & 2){
                c += 4 + data.getUint32(c, true);
            }
            if(k & 4){
                var ch, mcskin = "";
                for(;;){
                    ch = data.getUint8(c++);
                    if(0 == ch)
                        break;
                    mcskin += String.fromCharCode(ch);
                }
            }

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

    window.Minimap = {
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
