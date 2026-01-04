// ==UserScript==
// @name           Spacom Fast Map 2
// @version        1.08
// @namespace      Spacom
// @author         Agor71
// @description    Ускоряем карту
// @include        http*://spacom.ru/?act=game/map*
// @include        http*://spacom-dev.ru/?act=game/map*
// @grant          none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/407682/Spacom%20Fast%20Map%202.user.js
// @updateURL https://update.greasyfork.org/scripts/407682/Spacom%20Fast%20Map%202.meta.js
// ==/UserScript==

var run = function() {

    var script3 = document.createElement('script');
    script3.innerHTML = `// Returns object with values for background-position - http://snipplr.com/view/50791/

var box_size = 32;
var base_width = $(document).width() - 1;
var base_height = $(document).height() - 1;
var current_width = $(document).width() - 1;
var current_height = $(document).height() - 1;
var current_x = 0;

var current_y = 0;
var center_x = 0;
var center_y = 0;

var current_scale = 1;
var base_scale = 1;
var universe_size = 300;
var zoom_max = 3;
var zoom_min = 0.3;
var transX = 0, transY = 0, oldPageX = 0, oldPageY = 0;
var stars = new Array();
var sub_menu = false;

// настройки отображения карты
let settings_show_all_fleets = true,// показывать все флоты на карте независимо от масштаба карты. Значения true/false
    settings_hide_star_image = true,// скрывать картинку звезды и всегда отображать текст её названия. Значения true/false
    settings_hide_small_message_flight = true,// не подтверждать прыжок/отмену прыжка флота. Значения true/false
    settings_hide_small_message_explore = true,// не подтверждать успешное начало разведки зондов. Значения true/false
    settings_hide_fly_lines = true,// не отображать линии полётов. Значения true/false
    settings_hide_small_fleets = 600,// не отображет все флоты весом меньше, чем указано. 0 для отображения всех флотов
    settings_show_color_vice_fleets = true;// отображать иным цветом флоты заместителей


function distance(x, y, tx, ty) {
    var dx = x - tx;
    var dy = y - ty;
    var distance = Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5);
    distance = Math.ceil(distance * 100) / 100;
    return distance;
}

function fleetOrder(a, b) {
    //console.log(a, b);

    a.weight = parseInt(a.weight);
    b.weight = parseInt(b.weight);
    switch (a.owner) {
        case "other":
            switch (b.owner) {
                case "own":
                    return 1;
                    break;
                case "other":
                    if (a.weight > b.weight)
                        return -1;
                    else if (a.weight < b.weight)
                        return 1;
                    else
                        return 0;
                    break;
                default:
                    return -1;
            }
            break;
        case "pirate":
            switch (b.owner) {
                case "own":
                    return 1;
                    break;
                case "other":
                    return 1;
                    break;
                case "peace":
                    return 1;
                    break;

                case "pirate":
                    if (a.weight > b.weight)
                        return -1;
                    else if (a.weight < b.weight)
                        return 1;
                    else
                        return 0;
                    break;
                default:
                    return -1;
            }
            break;
        case "peace":
            switch (b.owner) {
                case "other":
                    return 1;
                    break;
                case "pirate":
                    return -1;
                    break;
                case "own":
                    return 1;
                    break;
                case "peace":
                    if (a.weight > b.weight)
                        return -1;
                    else if (a.weight < b.weight)
                        return 1;
                    else
                        return 0;
                    break;
                case "own":
                    return 1;
            }
            break;
        case "own":
            switch (b.owner) {
                case "other":
                    return -1;
                    break;
                case "pirate":
                    return -1;
                    break;
                case "peace":
                    return -1;
                    break;
                case "own":
                    //mnake ready for fly on first state
                    if (a.turn > b.turn)
                        return 1;
                    else if (a.turn < b.turn)
                        return -1;
                    else
                    if (a.allow_station > b.allow_station)
                        return 1;
                    else if (a.allow_station < b.allow_station)
                        return -1;
                    else
                        if (a.weight > b.weight)
                            return -1;
                        else if (a.weight < b.weight)
                            return 1;
                        else
                            return 0;
            }
            break;
    }
    return 0;

}
function showOwnStars() {
    //console.log(sub_menu);
    if (sub_menu == 'ownStars') {
        sub_menu = false;
        $("#items_list").html('');
    }
    else {
        sub_menu = 'ownStars';
        map.clearInfo(map.own_stars);
        var one = false;
        for (var star_id in map.own_stars) {
            if (!one)
                $("#items_list").append(tmpl("stars_title", map.own_stars));
            if (map.own_stars.filter(function(value) { return value !== undefined }).length !== 1)
            {
                one = true;
            }
            var star = map.own_stars[star_id];
            map.showBlockStar(star);
            if (map.own_stars.filter(function(value) { return value !== undefined }).length == 1) {
                $("#items_list").append(tmpl("planets_title", map.own_stars));
                for (var planet_id in star.planets) {
                    var planet = star.planets[planet_id];
                    if ((typeof planet.population != "undefined") && (parseInt(planet.population) > 0)) {
                        map.showBlockPlanet(planet, star.settle_id);
                    }
                }
            }
        }
        $("#items_list>>>[title],#items_list>>>>[title]").qtip({
            position: {
                my: 'bottom center', // at the bottom right of...
                at: 'top center', // Position my top left...
            },
            style: {
                classes: 'qtip-dark tips'
            }
        });
    }

}

function showOwnFleets() {
    if (sub_menu == 'ownFleets') {
        sub_menu = false;
        $("#items_list").html('');
    }
    else {
        sub_menu = 'ownFleets';
        map.clearInfo();

        var sorted_fleets = map.fleets.slice();
        sorted_fleets.sort(fleetOrder);
        if ((sorted_fleets) && (sorted_fleets.filter(function(value) { return value !== undefined && value.owner == 'own' && value.garrison == '0' }).length > 0)) {
            $("#items_list").append(tmpl("fleets_title", sorted_fleets));
            for (var i in sorted_fleets) {
                var fleet = sorted_fleets[i];

                if (fleet.owner == "own") {
                    //console.log(fleet);
                    if (fleet.garrison != 1)
                        map.showBlockFleet(fleet, fleet.owner);
                }
            }
            $("#items_list>>>[title],#items_list>>>>[title]").qtip({
                position: {
                    my: 'bottom center', // at the bottom right of...
                    at: 'top center', // Position my top left...
                },
                style: {
                    classes: 'qtip-dark tips'
                }
            });
        }
        else
        {
            $("#items_list").html('<div class="player_fleet_title">Нет собственных флотов</div>');
        }
    }


}

function showOtherFleets() {
    if (sub_menu == 'otherFleets') {
        sub_menu = false;
        $("#items_list").html('');
    }
    else {
        sub_menu = 'otherFleets';
        map.clearInfo();

        var sorted_fleets = map.fleets.slice();
        sorted_fleets.sort(fleetOrder);
        if ((sorted_fleets) && (sorted_fleets.filter(function(value) { return value !== undefined && value.owner !== 'own' && value.garrison == '0' }).length > 0)) {
            $("#items_list").append(tmpl("fleets_title", sorted_fleets));
            for (var i in sorted_fleets) {
                var fleet = sorted_fleets[i];

                if (fleet.owner !== "own") {
                    //console.log(fleet);
                    if (fleet.garrison != 1)
                        map.showBlockFleet(fleet, fleet.owner);
                }
            }
            $("#items_list>>>[title],#items_list>>>>[title]").qtip({
                position: {
                    my: 'bottom center', // at the bottom right of...
                    at: 'top center', // Position my top left...
                },
                style: {
                    classes: 'qtip-dark tips'
                }
            });
        }
        else
        {
            $("#items_list").html('<div class="player_fleet_title">Нет видимых чужих флотов</div>');
        }
    }

}

function clickFleet(fleet_id) {
    map.clickFleet(fleet_id);
}
function clickXY(x, y)
{
    setXYtoCenter(x, y);
    window.location.hash = x + ':' + y;
    map.hideInterface();
    return false;
}

function checkShipControls() {
    if ((map.selected_ships !== "undefined") && (map.selected_ships.length > 0))
        $("#toGarrison,#deleteShips,#createFleet").removeClass('deactivated');
    else
        $("#toGarrison,#deleteShips,#createFleet").addClass('deactivated');

}
function shipSelectClick(event, info) {
    event.preventDefault();
    if (event.ctrlKey == true) {
        var object = info.data('object');
        var objects = $("div[data-object=" + object + "]");
        $.each(objects, function (index) {
            shipSelect($(this));
        })
    }

    else if (event.altKey == true) {
        var object = info.data('ship');
        var objects = $("div[data-ship='" + object + "']");
        $.each(objects, function (index) {
            shipSelect($(this));
        })
    }

    else if (event.shiftKey == true) {
        var objects = $("div[class^=ship][id!=ships_info]");
        $.each(objects, function (index) {
            shipSelect($(this));
        })
    }

    else {
        shipSelect(info);


    }
    checkShipControls();
}
function shipSelect(info) {

    var id = info.data('id');
    var index = $.inArray(id, map.selected_ships);
    if (index == -1) {
        map.selected_ships.push(id);
        map.selected_weight = map.selected_weight + info.data('weight');
        map.last_ship_name = info.data('name');
    } else {
        map.selected_ships.splice(index, 1);
        map.selected_weight = map.selected_weight - info.data('weight');
    }
    info.toggleClass('selected');


}

function shipSelectAll(info) {
    var objects = $("div[class^=ship][id!=ships_info]");
    //console.log(objects);
    map.selected_ships = new Array();
    map.selected_weight = 0;
    $.each(objects, function (index) {
        //console.log(index);
        var id = $(objects[index]).data('id');
        //console.log(id);
        map.selected_ships.push(id);
        map.last_ship_name = $(objects[index]).data('name');
        map.selected_weight = map.selected_weight + info.data('weight');
        $(objects[index]).addClass('selected');
    })
    checkShipControls();
}

function createFleet(name) {
    if (map.selected_ships.length > 0) {
        var names = Array("Альфа", "Браво", "Чарли", "Дельта", "Эхо", "Фокстрот", "Гольф");
        var rim = Array("I", "II", "III", "IV", "V");
        if (name === undefined) {
            if (map.selected_ships.length == 1) {
                var name = map.last_ship_name;
            } else {
                /*
                 var random = Math.floor(Math.random() * 5);
                 var name = names[random];
                 */
                switch (true) {
                    case map.selected_weight >= 400000:
                        var name = names[6];
                        break;
                    default:
                        var i = Math.floor(Math.log(map.selected_weight) / Math.log(5) - 3);
                        //console.log(i);
                        i = Math.max(i, 0);
                        var name = names[i];
                        console.log(i);
                }
                var random = Math.floor(Math.random() * 4);
                var name = name + " " + rim[random];
            }

        }
        //var url = "&ships[]=" + map.selected_ships.join("&ships[]=");
        var data = map.selected_ships.join(",");
        $.post(APIUrl() + '&act=map&task=fleets&order=create_fleet&fleet_id=' + map.current_fleet + '&name=' + name + '&format=json', {
            ships: data
        }, function (json) {
            map.hideInterface();
            map.removeAllFleets();
            map.jsonToFleets(json);
            map.drawFleets();
            map.clickFleet(json["create_fleet"]["status"]);
        });
    } else {
        showSmallMessage("Для того чтобы создать флот, вам нужно сначала выделить хотя бы один свой корабль");
    }

}


function toGarrison() {
    if (map.selected_ships.length > 0) {
        //var url = "&ships[]=" + map.selected_ships.join("&ships[]=");
        var data = map.selected_ships.join(",");
        $.post(APIUrl() + '&act=map&task=fleets&order=to_garrison&fleet_id=' + map.current_fleet + '&format=json', {
            ships: data
        }, function (json) {
            map.hideInterface();
            map.removeAllFleets();
            map.jsonToFleets(json);
            map.drawFleets();
            map.clickFleet(json['to_garrison']['status']);
        });
    } else {
        showSmallMessage("Для того чтобы перенести корабли в гарнизон, вам нужно сначала выделить хотя бы один свой корабль");
    }

}

function deleteShips() {
    if (map.selected_ships.length > 0) {
        if (confirm("Вы действительно хотите удалить выбранные корабли?")) {
            //var url = "&ships[]=" + map.selected_ships.join("&ships[]=");
            var data = map.selected_ships.join(",");
            $.post(APIUrl() + '&act=map&task=fleets&fleet_id=' + map.current_fleet + '&order=delete_ships&format=json', {
                ships: data
            }, function (json) {
                map.hideInterface();
                map.removeAllFleets();
                map.jsonToFleets(json);
                map.drawFleets();
                map.clickMapStar(map.current_star);
            });
        }
    } else {
        showSmallMessage("Для того чтобы удалить корабли, вам нужно сначала выделить хотя бы один свой корабль");
    }

}

function sceneObject(canvasObject) {
    this.state = false;
    this.canvasObject = canvasObject;

    this.show = function () {
        if (this.state === false) {
            this.state = true;
            scene.add(this.canvasObject);
        }
        ;
    }
    this.hide = function () {
        if (this.state === true) {
            this.state = false;
            this.canvasObject.remove();
        }
        ;
    }
}

function Star(params) {
    this.id = params.id;
    this.x = params.x;
    this.y = params.y;
    this.classname = params.classname;
    this.anomaly = params.anomaly;
    this.name = params.name;
    this.visited = params.visited;
    // корабль посетил эту систему
    this.explored = params.explored;
    // корабль исследовал эту систему
    this.scanned = params.scanned;
    // эта система и ее флоты видны в обзорные системы
    this.type = this.classname[0];
    this.owner = '';
    this.player_owner_id = params.player_owner_id;
    this.fleets_here = 0;
    this.fleets_fly = 0;
    this.spectral_size = 0;
            switch (this.classname.substring(2)) {
            case 'V':
                this.spectral_size = - 4;
                break;
            case 'IV':
                this.spectral_size = 0;
                break;
            case 'III':
                this.spectral_size = 3;
                break;
            case 'II':
                this.spectral_size = 7;
                break;
            case 'I':
                this.spectral_size = 10;
                break;
        }


    if (params.player_owner_id == player_id)
        this.owner = 'self';
    else if (params.player_owner_id !== null) {
        //console.log(map.peace);
        if ($.inArray(parseInt(params.player_owner_id), map.peace) === -1)
            this.owner = 'neutral';
        else
            this.owner = 'peace';
    } else
        this.owner = '';
    this.planets = new Array();
    this.image_state = false;
    this.image_rendered = false;
    this.text_state = false;
    this.fly_state = false;
    this.defence_level = params.defence_level;
    this.invasion_progress = params.invasion_progress;
    var self = this;
    this.imageCanvas
    this.imageAnomalyCanvas
    this.circleCanvas
    this.textCanvas
    //console.log("Star " + this.id + " init");
    if (params['planets'] !== undefined)
        $.each(params['planets'], function (index) {
            self.planets[index] = params['planets'][index];
        })

    Star.prototype.drawOn = function (canvas, target) {
        var self = this;
        if (canvas === undefined)
            canvas = scene;
        if (target === undefined)
            target = 'all';
        if ((target == 'all') || (target == 'image')) {
            if (this.image_state == false) {
                this.image_state = true;

                switch (true) {
                    case (settings_hide_star_image):
                        break;
                    default:
                        this.image_rendered = false;
                        map.queueToRender++;
                        fabric.Image.fromURL('/image/star/' + this.type.toLowerCase() + '.png', function (img) {
                            var center = getCenterXY(self.x, self.y);
                            self.imageCanvas = img.set({
                                left: (center.x),
                                top: (center.y),
                                width: box_size + this.spectral_size,
                                height: box_size + this.spectral_size,
                                //width: box_size,
                                //height: box_size,
                                evented: true,
                                nature: "star",
                                id: self.id,
                                selection: false,
                                hasRotatingPoint: false,
                                hasBorders: false,
                                hasControls: false,
                                moveCursor: 'pointer',
                                hoverCursor: 'pointer',
                                originX: center,
                                originY: center,
                                perPixelTargetFind: true
                            });
                            scene.add(self.imageCanvas);
                            scene.bringToFront(self.imageCanvas);

                            map.queueToRender--;
                            this.image_rendered = true;
                            if (map.queueToRender === 0) {
                                scene.renderAll();
                            }
                            //console.log("Queue render "+map.queueToRender+" on "+this);

                        }.bind(this));
                }

                if (this.anomaly == '1')
                fabric.Image.fromURL('/image/ico/anomaly.png', function (img) {
                    var center = getCenterXY(self.x, self.y);
                    self.imageAnomalyCanvas = img.set({
                        left: (center.x - 12),
                        top: (center.y + 12),
                        width: 8,
                        height: 7,
                        evented: false,
                        selection: false,
                        hasRotatingPoint: false,
                        hasBorders: false,
                        hasControls: false,
                        originX: center,
                        originY: center,
                    });
                    scene.add(self.imageAnomalyCanvas);
                }.bind(this));
            }
        }
        ;
        if ((target == 'all') || (target == 'text')) {
            let size = 15,
                color = "#c1c9d0",
                decor = 'none';

            // switch (true) {
            //     case (this.visited == '0'):
            //         color = "#6b6d73";
            //         decor = 'underline';
            //         break;
            //     case (this.explored == '0'):
            //         color = "#6b6d73";
            //         break;
            //     case (this.owner == 'self'):
            //         color = "#66ccff";
            //         break;
            //     case (this.owner == 'peace'):
            //         color = "#AAFF00";
            //         break;
            //     case (this.owner == 'neutral'):
            //         color = "#ff4800";
            //         break;
            // }

            if (this.visited == '0') {
                color = "#6b6d73";
                decor = 'underline';
            }
            if (this.explored == '0') {
                color = "#6b6d73";
            }
            if (this.owner == 'self') {
                color = "#66ccff";
            }
            if (this.owner == 'peace') {
                color = "#AAFF00";
            }
            if (this.owner == 'neutral') {
                color = "#ff4800";
            }

            if (this.text_state == false) {
                this.text_state = true;
                this.textCanvas = new fabric.Text(this.name, {
                    left: this.x * box_size - 16 - this.name.length * 4,// - Math.round(this.spectral_size / 4),
                    top: this.y * box_size - 44 - Math.round(this.spectral_size / 2),
                    fill: color,
                    fontSize: size,
                    selection: false,
                    hasRotatingPoint: false,
                    hasBorders: false,
                    hasControls: false,
                    moveCursor: 'default', // сбросим курсоры, чтобы не отвлекали
                    hoverCursor: 'default',
                    fontFamily: "'Play'",
                    nature: "star",
                    id: self.id,
                    textDecoration: decor
                });
                scene.add(this.textCanvas);
            }
        }
        //scene.renderAll();

    }

    Star.prototype.drawOff = function (target) {
        if (target === undefined)
            target = 'all';
        if ((target == 'all') || (target == 'image')) {
            if ((this.image_state == true) & (this.image_rendered == true)) {
                this.image_state = false;
                this.image_rendered = false;
                if (this.imageCanvas)
                    this.imageCanvas.remove();

            }
        }
        ;
        if ((target == 'all') || (target == 'text')) {
            if (this.text_state == true) {
                this.text_state = false;
                if (this.textCanvas)
                    this.textCanvas.remove();
            }
        }

    }
    Star.prototype.setVisible = function (value, target) {
        if (canvas === undefined)
            canvas = scene;
        if (target === undefined)
            target = 'all';
        if ((target == 'all') || (target == 'image')) {
            this.imageCanvas.setVisible(value);
            //this.imageCanvas = undefined;
        }
        ;
        if ((target == 'all') || (target == 'text')) {
            this.textCanvas.setVisible(value);
            //this.textCanvas = undefined;
        }

    }
}

function Fleet(params, owner) {
    //console.log("New fleet "+params.fleet_id+"");
    //console.log(params);
    for (var param in params) {
        this['' + param] = params['' + param];
    }

    this.player_id = params.player_id;
    this.fleet_id = params.fleet_id;
    this.star_id = params.star_id;
    this.turn = params.turn;
    this.start_turn = params.start_turn;
    this.fleet_name = params.fleet_name;
    this.fleet_speed = params.fleet_speed;
    this.fleet_distance = params.fleet_distance;
    this.garrison = params.garrison;
    this.weight = params.weight;
    this.invasion = params.invasion;
    this.weight = params.weight;
    this.x = params.x;
    this.y = params.y;
    this.start_x = params.start_x;
    this.start_y = params.start_y;

    this.allow_fly = params.allow_fly;
    this.allow_cancel_fly = params.allow_cancel_fly;

    //	this.count = params.count;
    this.imageCanvas
    this.imageFlyCanvas
    this.textCanvas
    this.allow_fly = params.allow_fly;
    this.allow_settle = params.allow_settle;
    this.allow_explore = params.allow_explore;
    this.allow_invasion = params.allow_invasion;
    this.allow_station = params.allow_station;
    this.allow_transfer = params.allow_transfer;
    this.allow_bomb = params.allow_bomb;
    this.owner = owner;
    this.width = 28;
    this.height = 28;
    this.doNotShow = false;

    //this.image_url = '/image/ships/zond.png';

    this.image_state = false;
    this.image_rendered = false;
    this.text_state = false;
    this.view_radius = params.view_radius;

    switch (true) {
        case ( parseInt(this.weight) > 99999):
            this.width = 38;
            this.height = 38;
            break;
        case ( parseInt(this.weight) <= 800 ):
            this.width = 22;
            this.height = 22;
            break;

    }

    var center = getCenterXY(this.x, this.y);
    this.left_x = (center.x);
    this.top_y = (center.y);

    var center = getCenterXY(this.start_x, this.start_y);
    this.start_x = (center.x);
    this.start_y = (center.y);


    this.image_url = '/image/map/fleet/';
    this.image_color = "";
    var dx = 16;
    var dy = 0;

    function makeFlyLine(coords) {
        var line = new fabric.Line(coords, {
            fill: "rgba(0, 165, 255, 0.5)",
            stroke: "rgba(0, 165, 255, 0.5)",
            strokeWidth: 1,
            selectable: false,
            strokeDashArray: [4, 12],
        });
        return line;
    }

    switch (owner) {
        case "other":
            this.image_url = this.image_url + 'enemy';
            //this.image_url = this.image_url + 'none';
            //this.image_color = "#FF0000";
            //dx = 20;
            break;
        case "peace":
            this.image_url = this.image_url + 'neutral';
            //this.image_url = this.image_url + 'none';
            //this.image_color = "#C9FE52";
            //dx = 16;
            break;
        case "pirate":
            this.image_url = this.image_url + 'pirate';
            //this.image_url = this.image_url + 'none';
            //this.image_color = "#FF9300";
            //dx = 24;
            break;
        case "own":
            this.image_url = this.image_url + 'fleet';
            //this.image_url = this.image_url + 'none';
            //this.image_color = "#0099EF";
            //dx = 12;
            break;

    }

    if (settings_show_color_vice_fleets) {
        if ((owner == 'peace' && this.allow_cancel_fly == '1') || (owner == 'peace' && this.allow_fly == '1')) {
            this.image_url = this.image_url.replace('neutral','') + 'none';
        }
    }

    if (this.turn > "0") {
        //if (map.stars[this.star_id])
        dx = dx + map.stars[this.star_id].fleets_fly * 12;
        dy = map.stars[this.star_id].fleets_fly;
        this.image_url = this.image_url + '-fly.png';
        dx = -1 * dx;
        this.width = this.width - 4;
        this.height = this.height - 4;
        this.doNotShow = false;
        if (map.stars[this.star_id].fleets_fly >= 7)
            this.doNotShow = true;
        map.stars[this.star_id].fleets_fly = Math.min(map.stars[this.star_id].fleets_fly + 1, 7);
    } else {

        dx = dx + map.stars[this.star_id].fleets_here * 12;
        dy = map.stars[this.star_id].fleets_here;
        this.image_url = this.image_url + '.png';
        if (this.garrison == 1) {
            this.image_url = '/image/map/fleet/anchor.png';
            this.width = 16;
            dx = 12;
        }
        this.doNotShow = false;
        if (map.stars[this.star_id].fleets_here >= 7)
            this.doNotShow = true;
        map.stars[this.star_id].fleets_here = Math.min(map.stars[this.star_id].fleets_here + 1, 7);
    }
    this.left_x = this.left_x + dx;
    this.top_y = this.top_y + dy;


    /*
     if (owner == "other") {
     this.image_url = '/image/star/rocket_orange.png';
     this.left_x = this.left_x - 10;
     this.top_y = this.top_y + 10;
     }
     if (owner == "peace") {
     this.image_url = '/image/star/rocket_green.png';
     this.left_x = this.left_x - 8;
     this.top_y = this.top_y + 8;
     }
     if (owner == "pirate") {
     this.image_url = '/image/star/rocket_pirate.png';
     this.left_x = this.left_x - 24;
     this.top_y = this.top_y + 12;
     }
     */
    Fleet.prototype.addImage = function () {

    }
    Fleet.prototype.drawOn = function (canvas, target) {
        if (this.doNotShow == true)
            return;
        if (canvas === undefined)
            canvas = scene;
        if (target === undefined)
            target = 'all';
        if (((target == 'all') || (target == 'image')) && ((this.garrison == "1") || (+this.weight >= settings_hide_small_fleets) )) {
            if (this.image_state == false) {
                this.image_state = true;
                this.image_rendered = false;
                map.queueToRender++;
                switch(true) {
                    case (settings_hide_fly_lines):// скрываем линии полёта
                        break;
                    default:
                        if ((this.turn > 0) && (this.owner == "own")) {
                            map.queueToRender++;
                            this.imageFlyCanvas = makeFlyLine([this.left_x, this.top_y, this.start_x, this.start_y]);
                            //console.log('imageFlyCanvas 831');
                            scene.add(this.imageFlyCanvas);
                            scene.sendToBack(this.imageFlyCanvas);
                            map.queueToRender--;
                        }
                }
                fabric.Image.fromURL(this.image_url, function (img) {

                    this.imageCanvas = img.set({
                        left: this.left_x,
                        top: this.top_y,
                        width: this.width,
                        height: this.width,
                        evented: true,
                        nature: "fleet",
                        fleet_id: this.fleet_id,
                        star_id: this.star_id,
                        selection: false,
                        hasRotatingPoint: false,
                        hasBorders: false,
                        hasControls: false,
                        moveCursor: 'pointer', // сбросим курсоры, чтобы не отвлекали
                        hoverCursor: 'pointer',
                        originX: "center",
                        originY: "center",
                        perPixelTargetFind: true

                    });
                    /*
                    if (this.image_color != "")
                    {
                        var filter = new fabric.Image.filters.Blend({
                            color: this.image_color,
                            mode: 'multiply'
                        });
                        this.imageCanvas.filters.push(filter);
                        this.imageCanvas.applyFilters();
                    }*/
                    //console.log(this.imageCanvas);
                    scene.add(this.imageCanvas);
                    map.queueToRender--;
                    this.image_rendered = true;
                    if (map.queueToRender === 0) {
                        //console.log('renderAll 870');
                        scene.renderAll();
                    }
                    //console.log("Queue render "+map.queueToRender+" on "+this);

                }.bind(this));
            }
            ;
        }
        ;
    };
    Fleet.prototype.drawOff = function (target) {
        //console.log("Draw off "+this.fleet_id);
        if (target === undefined)
            target = 'all';
        if ((target == 'all') || (target == 'image')) {
            if ((this.image_state == true) & (this.image_rendered == true)) {
                this.image_state = false;
                this.image_rendered = false;
                this.imageCanvas.remove();
                if (this.imageFlyCanvas)
                    this.imageFlyCanvas.remove();

            }
            //this.imageCanvas = undefined;
        }
        ;
        if ((target == 'all') || (target == 'text')) {
            if (this.text_state == true) {
                this.text_state = false;
                this.textCanvas.remove();
                //this.textCanvas = undefined;
            }
        }

    }
    Fleet.prototype.clickFly = function () {
        if (this.allow_fly === "1") {
            map.hideInterface();
            map.drawOffFlyCircle();
            map.drawOnFlyCircle(this.x, this.y, this.fleet_distance, this.fleet_speed);
        }
        map.current_fleet = this.fleet_id;
        //if not visible - make center
        if (this.image_state != true)
            setXYtoCenter(this.x, this.y);
        for (i in map.stars) {
            var star = map.stars[i];
            if (distance(this.x, this.y, star.x, star.y) <= this.fleet_distance) {
                map.stars[i].fly_state = true;
            }
        }
    }
    Fleet.prototype.clickExplore = function () {
        if (this.allow_explore === "1") {
            map.hideInterface();
            $.getJSON(APIUrl() + '&act=map&task=fleets&order=explore&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {
                //console.log(json);
                //console.log(json["explore"]["status"]);
                if (json["explore"]["status"] == "1") {
                    switch(true) {
                        case (settings_hide_small_message_explore):// не показываем сообщение о проведении разведки
                            break;
                        default:
                            showSmallMessage("Разведка начата. Результат разведки будет доступен через 1 ход. Это стоило вам 25 кредитов");
                    }
                    map.removeAllFleets();
                    map.jsonToFleets(json);
                    map.drawFleets();
                    parseAnswer(json, '');
                } else {
                    showSmallMessage("Недостаточно денег для проведения разведки. Требуется 25 кредитов");
                }
            });
        }
    }
    Fleet.prototype.clickTransfer = function () {
            map.hideInterface();
            $.getJSON(APIUrl() + '&act=map&task=fleets&order=transfer_start&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {
                //console.log(json);
                //console.log(json["explore"]["status"]);
                if (json["transfer"]["status"] > 0) {
                    showSmallMessage("Предложение принять ваш флот на управление передано союзнику. Стоимость передачи " + json["transfer"]["status"] + " кредитов");
                    parseAnswer(json, '');
                } else {
                    showSmallMessage("Предложение на передачу не отправлено. Флот в пути или игрок не союзник?");
                }
            });

    }

    Fleet.prototype.clickConcentrate = function () {
        map.hideInterface();
        $.getJSON(APIUrl() + '&act=map&task=fleets&order=concentrate&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {
            //console.log(json["concentrate"]["status"]);
            map.removeAllFleets();
            map.jsonToFleets(json);
            map.drawFleets();
            map.clickFleet(json["concentrate"]["fleet_id"]);
        });
    }
    Fleet.prototype.clickSettle = function () {
        if (this.allow_settle === "1") {
            var url = APIUrl() + '&act=map&task=star_planets&star_id=' + this.star_id + '&format=json';
            $.getJSON(url, {}, function (json) {
                var $div = $(tmpl("settle_block", this));
                var planets = json.star.planets;
                for (i in planets) {
                    $div.append(tmpl("settle_block_planet", planets[i]));
                }
                $div.append("<br style='clear: both;'>");
                $div.modal({
                    close: true,
                    overlayClose: true,
                    closeClass: false,
                    closeHTML: false,
                    opacity: 80,
                    overlayId: "overlay_modal",
                    containerId: "container_modal",
                    dataId: "data_modal",
                });
            })
            for (i in planets) {
                var planet = planets[i];
                var text = tmpl("geo_info", planet);
                text += planet.comment;

                $('#settle_planet_' + planet.planet_id).qtip({
                    content: text,
                    position: {
                        my: 'top center', // at the bottom right of...
                        at: 'bottom center', // Position my top left...
                        target: $('#settle_planet_' + planet.planet_id) // my target
                    },
                    style: {
                        classes: 'qtip-dark'
                    }
                });
            }
            ;

        }

        planets = null;
    }
    Fleet.prototype.callSettle = function (planet_id) {
        map.hideInterface();
        $.getJSON(APIUrl() + '&act=map&task=fleets&order=settle&fleet_id=' + this.fleet_id + '&planet_id=' + planet_id + '&format=json', {}, function (json) {
            switch (json['settle']['status']) {
                case -10:
                    showSmallMessage('Не задан флот');
                    break;
                case -1:
                    showSmallMessage('Вы еще не умеете заселять планеты этого типа');
                    break;
                case -2:
                    showSmallMessage('Недостаточно кредитов');
                    break;
                case -3:
                    showSmallMessage('Звезда или планета уже заняты вами или другим игроком');
                    break;
                case -4:
                    showSmallMessage('Вы не можете заселить планету на новой звезде. Необходимо повысить технологию "Экспансия"');
                    break;
                case -6:
                    showSmallMessage('Эта система служит Колыбелью для будущих цивилизаций. Ваши ученые не позволяют вам колонизировать эту планету.<br/>Космос большой - выберите другую систему для заселения');
                    break;
                default:

                    showSmallMessage('Колонизатор отправился заселять планету. Во время следующего хода планета будет вам доступна. Это стоило вам ' + json['settle']['status'] + ' кредитов');
                    parseAnswer(json, "map");
                    break;

            }
            mouseDown = false;
            map.removeAllFleets();
            map.jsonToFleets(json);
            map.drawFleets();
        });
    }
    Fleet.prototype.clickRename = function () {
        var name = prompt('Введите имя флота', 'Флот');
        if ((name) && (name > '')) {
            this.callRename(name);
        }
    }
    Fleet.prototype.callRename = function (fleet_name) {

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=rename_fleet&fleet_id=' + this.fleet_id + '&name=' + encodeURIComponent(fleet_name) + '&format=json', {}, function (json) {
            parseAnswer(json, '');
            this.fleet_name = fleet_name;
            map.clickFleet(this.fleet_id);
        }.bind(this));
    }

    Fleet.prototype.flyTo = function (finish_id) {
        map.hideInterface();
        map.removeAllFleets();
        //map.fleets = new Array();
        //console.log("before");
        //console.log(map.fleets);
        //var fleet_id = this.fleet_id;
        //console.log(map.fleets[fleet_id]);
        //map.fleets[fleet_id].drawOff();

        //console.log(map.fleets);

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=fly_to&fleet_id=' + this.fleet_id + '&finish_id=' + finish_id + '&format=json', {}, function (json) {

            if (json['fly_to']['start_turn'] > 0)
                switch(true) {
                    case (settings_hide_small_message_flight):// не показываем уведомление при включённой настройке
                        map.jsonToFleets(json);
                        map.drawFleets();
                        break;
                    default:
                        showSmallMessage('Флот вылетел. Время в пути - ' + json['fly_to']['start_turn'] + ' ' + turnCase(json['fly_to']['start_turn']));
                }
            mouseDown = false;
            //map.jsonToFleets(json);
            //map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
    }
    Fleet.prototype.flyCancel = function () {
        map.hideInterface();
        map.removeAllFleets();
        //map.fleets = new Array();
        //console.log("before");
        //console.log(map.fleets);
        //var fleet_id = this.fleet_id;
        //console.log(map.fleets[fleet_id]);
        //map.fleets[fleet_id].drawOff();

        //console.log(map.fleets);

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=fly_cancel&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            if (json['fly_cancel']['result'] > 0)
                switch(true) {
                    case (settings_hide_small_message_flight):// не показываем уведомление при включённой настройке
                        map.jsonToFleets(json);
                        map.drawFleets();
                        break;
                    default:
                        showSmallMessage('Отмена прыжка');
                }
            mouseDown = false;
            //map.jsonToFleets(json);
            //map.hideInterface();
            //map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
        event.preventDefault();
    }
    Fleet.prototype.invasionStart = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=invasion_start&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            /*if (json['invasion_start']['result'] > 0)
             showSmallMessage('Отмена прыжка');
             */
            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
    }
    Fleet.prototype.invasionEnd = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=invasion_end&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            if (json['invasion']['status'] > 0)
                showSmallMessage('Захват системы остановлен');

            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
    }
    Fleet.prototype.stationStart = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=station_start&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            switch (json['station']['status'])
            {
                case 1:
                    showSmallMessage('Изучение аномалии активировано');
                    break;
                case -2:
                    showSmallMessage('Другой флот с большей силой уже изучает аномалию');
                    break;
            }
            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
        });
    }
    Fleet.prototype.stationEnd = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=station_end&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            if (json['station']['status'] > 0)
                showSmallMessage('Изучение аномалии остановлено');

            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
        });
    }

    Fleet.prototype.bombStart = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=bomb_start&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            if (json['bomb']['status'] > 0)
                showSmallMessage('Начато вторжение в систему');

            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
    }
    Fleet.prototype.bombEnd = function () {
        map.hideInterface();
        map.removeAllFleets();

        $.getJSON(APIUrl() + '&act=map&task=fleets&order=bomb_end&fleet_id=' + this.fleet_id + '&format=json', {}, function (json) {

            if (json['bomb']['status'] > 0)
                showSmallMessage('Вторжение в систему остановлена');

            mouseDown = false;
            map.jsonToFleets(json);
            map.drawFleets();
            //console.log(map.fleets);
            //console.log("after draw");
        });
    }
    //end of fleet class
}

function Map() {

    this.stars = new Array();
    this.own_stars = new Array();
    this.fleets = new Array();
    this.science = new Array();
    this.selected_ships = new Array();
    this.last_ship_name = '';
    this.selected_weight = 0;
    this.current_star = 0;
    this.queueToRender = 0;
    this.current_fleet = 0;
    this.settle_price = 0;
    this.settle_price_asteroid = 0;
    this.flyCircleCanvas
    this.flyCircleOneCanvas
    this.flyCircleViewCanvas
    this.peace = new Array();

    this.renewMap = function () {
        //console.log("%c !! Renew map !!", "color: red");

        var width = base_width;
        var height = base_height;

        //var result = new Object()
        var left = current_x - width / 4;
        var top = current_y - height / 4;
        var right = current_x + width / current_scale + width / 4;
        var bottom = current_y + height / current_scale + height / 4;
        var enabled = true;

        if (enabled == true) {
            for (i in map.stars) {
                var star = map.stars[i];
                if ((star.x * box_size < right) & (star.x * box_size > left) & (star.y * box_size < bottom) & (star.y * box_size > top)) {
                    star.drawOn(scene, "image");
                    switch (true) {
                        case (settings_hide_star_image):// если скрываем картинку звезды, то всегда отображаем текст звезды
                            star.drawOn("text");
                            break;
                        case (star.owner = "self"):
                            if (current_scale >= 0.3)
                                star.drawOn("text");
                            else
                                star.drawOff("text");
                            break;

                        case (star.owner = "neutral"):
                            if (current_scale >= 0.5)
                                star.drawOn("text");
                            else
                                star.drawOff("text");
                            break;

                        case (star.owner = "peace"):
                            if (current_scale >= 0.75)
                                star.drawOn("text");
                            else
                                star.drawOff("text");
                            break;

                        default:
                            if (current_scale >= 0.99)
                                star.drawOn("text");
                            else
                                star.drawOff("text");

                    }

                } else {
                    star.drawOff();
                }
            }
            for (i in map.fleets) {
                var fleet = map.fleets[i];
                if ((fleet.x * box_size < right) & (fleet.x * box_size > left) & (fleet.y * box_size < bottom) & (fleet.y * box_size > top)) {
                    switch (true) {
                        case (settings_show_all_fleets):// показываем все флоты, если выбрана такая настройка
                        case (current_scale >= 0.99):
                            fleet.drawOn();
                            break;
                        case (current_scale >= 0.5):
                            if (parseInt(fleet.weight) >= 800) {
                                fleet.drawOn();
                            }
                            else {
                                fleet.drawOff();
                            }
                            break;

                        case (current_scale >= 0.3):
                            if (parseInt(fleet.weight) >= 99999) {
                                fleet.drawOn();
                            }
                            else {
                                fleet.drawOff();
                            }
                            break;
                        default:
                            fleet.drawOff();

                    }

                } else {
                    fleet.drawOff();
                }
            }

            //scene.renderAll();
        }
        var rectangle = returnRectangleXY();
        $('#radar_rectangle').css("left", rectangle.left_top.x);
        $('#radar_rectangle').css("top", rectangle.left_top.y);
        $('#radar_rectangle').css("width", rectangle.right_bottom.x - rectangle.left_top.x);
        $('#radar_rectangle').css("height", rectangle.right_bottom.y - rectangle.left_top.y);
        //console.log(returnXYbyCenter(right, bottom));

    }

    this.drawOnViewCircle = function (x, y, view_radius) {
        var center = getCenterXY(x, y);

        this.flyCircleViewCanvas = new fabric.Circle({
            left: center.x,
            top: center.y,
            radius: view_radius * box_size,
            stroke: '#FFFB00',
            fill: 'transparent',
            strokeDashArray: [1, 30],
            strokeWidth: 1,
            originX: center,
            originY: center,
            selectable: false

        });
        scene.add(this.flyCircleViewCanvas);
        //this.flyCircleViewCanvas.sendToBack();
        //console.log('renderAll 1345');
        scene.renderAll();
    };

    this.drawOnFlyCircle = function (x, y, distance, distance_oneturn, owner) {
        var center = getCenterXY(x, y);
        var color = "#66ccff";
        //console.log('fly circle');
        if (typeof owner != 'undefined') {
            switch (owner) {
                case "own":
                    color = "#66ccff";
                    break;
                case "other":
                    color = "#ff4800";
                    break;
                case "pirate":
                    color = "#FF9800";
                    break;
                case "peace":
                    color = "#94FF00";
                    break;

            }
        }
        ;
        this.drawOffFlyCircle();
        this.flyCircleOneCanvas = new fabric.Circle({
            left: center.x,
            top: center.y,
            radius: distance_oneturn * box_size,
            stroke: color,
            fill: 'transparent',
            strokeDashArray: [3, 20],
            strokeWidth: 1,
            originX: center,
            originY: center,
            selectable: false

        });
        scene.add(this.flyCircleOneCanvas);
        this.flyCircleOneCanvas.sendToBack();

        this.flyCircleCanvas = new fabric.Circle({
            left: center.x,
            top: center.y,
            radius: distance * box_size,
            stroke: color,
            fill: 'transparent',
            strokeWidth: 1,
            originX: center,
            originY: center,
            selectable: false

        });
        scene.add(this.flyCircleCanvas);
        this.flyCircleCanvas.sendToBack();
        //console.log('renderAll 1402');
        scene.renderAll();
    };
    this.drawOffFlyCircle = function () {
        for (i in map.stars) {
            map.stars[i].fly_state = false;
        }
        if (this.flyCircleCanvas) {
            this.flyCircleCanvas.remove();
        }
        if (this.flyCircleOneCanvas) {
            this.flyCircleOneCanvas.remove();
        }

        if (this.flyCircleViewCanvas) {
            this.flyCircleViewCanvas.remove();
        }
        //console.log('renderAll 1416');
        scene.renderAll();
        //console.log('fly circle off');
    }
    var self = this;
    this.drawFlyCirle
    this.removeAllFleets = function () {
        //console.log("remove all fleets");
        for (i in map.fleets) {
            //console.log("i " + i);
            if (map.fleets[i].imageCanvas !== undefined)
                map.fleets[i].drawOff('image');
        }
        ;
        this.fleets = null;
        this.fleets = new Array();
        //scene.renderAll();

    }
    this.reCallFleets = function () {
        this.removeAllFleets();
        $.getJSON(APIUrl() + '&act=map&task=fleets&format=json', {}, function (json) {
            map.jsonToFleets(json);
            map.drawFleets();
        });

    };
    this.clickFleet = function (fleet_id, ignore_center) {
        this.current_fleet = fleet_id;
        this.selected_ships = new Array();
        this.selected_weight = 0;
        sub_menu = false;
        //this.last_ship_name = '';

        //$("#ships div.ships").html("Loading");
        this.drawOffFlyCircle();
        //console.log(map.fleets[fleet_id]);
        if (map.fleets[fleet_id].image_state != true)
            setFleetToCenter(fleet_id);
        $.getJSON(APIUrl() + '&act=map&task=fleet_ships&fleet_id=' + fleet_id + '&format=json', {}, function (json) {
            map.showFleetShips(json);
            //drawJsonToShips(json);
        });
    };
    this.jsonToFleets = function (json) {
        //console.log(json);
        for (i in map.stars) {
            if (map.stars[i].fleets_here)
                map.stars[i].fleets_here = 0;
            if (map.stars[i].fleets_fly)
                map.stars[i].fleets_fly = 0;
        }
        parseAnswer(json, "")
        var self = this;

        if (json["fleets"])
            $.each(json["fleets"], function (index) {
                var info = this;
                //console.log(info)
                if (this.player_id == player_id)
                    self.fleets[info.fleet_id] = new Fleet(info, "own");
                else if (this.player_id == "0")
                    self.fleets[info.fleet_id] = new Fleet(info, "pirate");
                else if ($.inArray(parseInt(this.player_id), map.peace) == -1) {
                    self.fleets[info.fleet_id] = new Fleet(info, "other");
                } else
                    self.fleets[info.fleet_id] = new Fleet(info, "peace");
            })
        //scene.renderAll();
    }
    this.drawFleets = function () {

        for (i in map.fleets) {
            //console.log(i);
            var info = map.fleets[i];

            if ((info.x < universe_size) && (info.y < universe_size)) {
                //console.log("drawOn "+info.fleet_id);
                this.fleets[info.fleet_id].drawOn(scene);
            }
            ;
        }
        ;
        map.renewMap();
    }
    this.jsonToStars = function (json) {
        parseAnswer(json, "")
        if (json["map_star"])
            $.each(json["map_star"], function (index) {
                var info = this;
                self.stars[info.id] = new Star(info);
            })
        //scene.renderAll();
    }
    this.drawStars = function () {
        /*
         for (i in map.stars) {
         //console.log(i);
         var info = map.stars[i];

         if ((info.x < universe_size) && (info.y < universe_size)) {
         this.stars[info.id].drawOn(scene);
         };
         }*/
        map.renewMap();
    }
    this.hideItems = function ()
    {
        $("#items_list").html("");
    }
    this.hideInterface = function () {
        $.modal.close();
        sub_menu = false;
        map.selected_ships = new Array();
        checkShipControls();
        $("#info").hide();
        $("#stars").hide();
        $("#fleets_list").hide();
        $("#other_fleets_list").hide();
        $("#fleets").hide();
        $("#ships").hide();
        $("#items_list").html("");
        //$("#navi").show();
        mouseDown = false;
        map.drawOffFlyCircle();

    };
    this.showPoint = function (json) {
        this.clearInfo(json);
        this.showBlockCoordinates(json["star"]);
        if ((json["fleets"])
            && (json["fleets"].filter(function(value) { return value !== undefined }).length > 0)) {
            $("#items_list").append(tmpl("fleets_title_big", json));
            $("#items_list").append(tmpl("fleets_title", json));
            for (var i in json["fleets"]) {
                this.showBlockFleet(json["fleets"][i], json["fleets"][i].owner);
            }
        }
        $("#items_list").append(tmpl("star_title_big", json));
        $("#items_list").append(tmpl("stars_title", json));
        this.showBlockStar(json["star"]);

//        console.log(json);

        if ((json["star"]["planets"])
            && (json["star"]["planets"].filter(function(value) { return value !== undefined }).length > 0)
            && (
            json["star"].player_owner_id == player_id
            //|| json["fleets"].length == 0
            ) ) {
            $("#items_list").append(tmpl("planets_title", json["star"]));
            for (var i in json["star"]["planets"]) {
                this.showBlockPlanet(json["star"]["planets"][i], json["star"].settle_id);
            }
        }
        $("#items_list>>>[title],#items_list>>>>[title]").qtip({
            position: {
                my: 'bottom left', // at the bottom right of...
                at: 'top center', // Position my top left...
            },
            style: {
                classes: 'qtip-dark tips'
            }
        });
    }
    this.showStarPlanets = function (json) {

        this.clearInfo(json);
        this.showBlockCoordinates(json["star"]);
        this.showBlockStar(json["star"]);

        if ((json["star"]["planets"]) && (json["star"]["planets"].length > 0)) {
            $("#items_list").append(tmpl("planets_title", json["star"]));
            for (var i in json["star"]["planets"]) {
                this.showBlockPlanet(json["star"]["planets"][i], json["star"].settle_id);
            }
        }
        $("#items_list>>>[title],#items_list>>>>[title]").qtip({
            position: {
                my: 'bottom left', // at the bottom right of...
                at: 'top center', // Position my top left...
            },
            style: {
                classes: 'qtip-dark tips'
            }
        });

    }
    this.showFleetShips = function (json) {
        //console.log("show ships");
        //console.log(json);
        this.clearInfo(json);
        this.showBlockCoordinates(json["star"]);

        if (json["fleets"]) {
            this.showBlockFleet(json["fleets"][0], json["fleets"][0].owner);
        }
        window.location.hash = self.stars[json["fleets"][0].star_id].x + ':' + self.stars[json["fleets"][0].star_id].y;
        if (json["fleets"][0].owner == "own")
            this.showBlockFleetActions(json["fleets"][0]);
        this.showBlockShips(json);

    }

    this.showBlockFleetActions = function (json) {
        $("#fleet_block_" + json['fleet_id']).after(tmpl("fleet_actions_block", json));
    }
    this.clearInfo = function () {
        $("#items_list").html("");
    }
    this.showBlockCoordinates = function (json) {
        $("#items_list").html(tmpl("coordinates_instance", json));
    }
    this.showBlockStar = function (json) {
        /*
         if (map.fleets[self.stars[id].garrison]) {
         self.stars[id].weight = map.fleets[self.stars[id].garrison].weight;

         }
         else
         {
         self.stars[id].weight = "";
         }
         */
        json.image = json.classname[0];

        $("#items_list").append(tmpl("star_instance", json));

    }
    this.showBlockFleet = function (json, owner) {
        //console.log(json);
        var image_ico_url = "";
        if (json["ico"] > "")
            var images = json["ico"].split(",");
        if (images)
            for (var i in images) {
                var obj = new Object();
                obj.ico = images[i];
                image_ico_url = image_ico_url + tmpl("fleet_ico", obj)
            }
        json.image_ico_url = image_ico_url;
        if (owner === "own") {
            $("#items_list").append(tmpl("fleet_instance", json));
        }
        else {
            $("#items_list").append(tmpl("fleet_instance", json));
        }
    }
    this.showBlockPlanet = function (json, settle_id) {
        //console.log(json.anomaly_mutation);
        json.settle_id = settle_id;
        $("#items_list").append(tmpl("planet_instance", json));
        /*
         $("#items_list").append(tmpl("planets_instance", this));
         var info_height = 47 + 24;
         if (self.stars[id].visited != '1') {
         info_height = info_height + 76;
         $("#items_list .planets_info").append("Ваши корабли еще не посещали эту звезду.<br/>Точное количество планет на орбите неизвестно.");
         } else {
         if ((self.stars[id].planets !== undefined) && (self.stars[id].planets.length > 0)) {
         //на этой звезде есть видимые нам планеты
         for (i in self.stars[id].planets) {
         //переберем их всех
         info_height = info_height + 112;
         var planet = self.stars[id].planets[i];
         if ((planet.player_name === undefined) || (planet.player_name === null)) {
         planet.player_name = '( не заселена) ';
         }

         switch (planet.size) {
         case "1":
         planet.image_class = "smallPlanet";
         planet.size_name = "малый";

         break;
         case "2":
         planet.image_class = "mediumPlanet";
         planet.size_name = "средний";
         break;
         case "3":
         planet.image_class = "bigPlanet";
         planet.size_name = "большой";
         break;
         }
         $("#items_list .planets_info").append(tmpl("planet_block", planet));
         //$("#info .topinfo .planet_ico").append(tmpl("planet_ico_block", planet));

         if (self.stars[id].explored == '1') {
         //на звезде была разведка, можно показать в подсказке гео данные
         var text = tmpl("geo_info", planet);
         text += planet.comment;

         $('#planet_' + planet.planet_id).qtip({
         content: text,
         position: {
         my: 'top left', // at the bottom right of...
         at: 'top right', // Position my top left...
         target: $('#planet_' + planet.planet_id) // my target
         },
         style: {
         classes: 'qtip-dark'
         }
         });
         } else {
         //разведки не было, показываем только комментарий
         $('#planet_' + planet.planet_id).qtip({
         content: '<span class="small">Геологическая разведка системы зондами не проводилась. Точные параметры планеты неизвестны, заселение без разведки невозможно</span> <br/><br/>' + planet.comment,
         position: {
         my: 'top left', // at the bottom right of...
         at: 'top right', // Position my top left...
         target: $('#planet_' + planet.planet_id) // my target
         },
         style: {
         classes: 'qtip-dark'
         }
         });
         }

         }
         } else {
         $("#items_list .planets_info").append("На орбите этой звезды нет ни одной планеты");
         }
         }
         ;*/
    }
    this.showBlockShips = function (json) {
//$("#ships div.ships").customScrollbar("remove");
        $("#items_list").append(tmpl("ships_instance", this));

        if (json["fleets"]["fleet"]["ships"]) {
            var fleet_id = json["fleets"]["fleet"]['fleet_id'];
            $("div.fleet").removeClass("selected");
            $("#fleet_block_" + fleet_id).addClass("selected");
            map.current_fleet = fleet_id;
            var check = map.fleets[fleet_id];
            //$("#ships div.actions").html(tmpl("fleet_actions", check));
            if (map.fleets[fleet_id].owner != "own") {
                map.drawOffFlyCircle();
                map.drawOnFlyCircle(map.fleets[fleet_id].x, map.fleets[fleet_id].y, map.fleets[fleet_id].fleet_distance, map.fleets[fleet_id].fleet_speed, map.fleets[fleet_id].owner);

            }
            $.each(json["fleets"]["fleet"]["ships"], function (index) {

                //fleet.owner = 'own';
                this.bonus = "<b>" + this.name + "</b><br/>";
                if (parseInt(this.hp_max) > parseInt(this.hp)) {
                    this.bonus = this.bonus + "Прочность: <i class='fa fa-heart hit_points'></i> " + parseInt(this.hp) + " из <i class='fa fa-heart hit_points'></i> " + this.hp_max + "<br />";
                } else {
                    this.bonus = this.bonus + "Прочность:  <i class='fa fa-heart hit_points'></i> " + this.hp_max + "<br />";
                }
                this.bonus = this.bonus + "Скорость и дальность: <i class='fa fa-location-arrow speed_distance'></i>  " + this.speed + " / " +  this.distance + "<br />";
                if ((this.lazer_defence > 0) || (this.rocket_defence > 0) || (this.cannon_defence > 0)) {
                    this.bonus = this.bonus + "Защита: ";
                    if (this.lazer_defence > 0) {
                        this.bonus = this.bonus + "<i class='fa fa-shield lazer_attack'></i> " + this.lazer_defence + "%<br />";
                    }
                    if (this.rocket_defence > 0) {
                        this.bonus = this.bonus + "<i class='fa fa-shield rocket_attack'></i> " + this.rocket_defence + "<br />";
                    }
                    if (this.cannon_defence > 0) {
                        this.bonus = this.bonus + "<i class='fa fa-shield cannon_attack'></i> " + this.cannon_defence + "<br />";
                    }
                }
                //this.bonus = this.bonus + "<br/>";
                if (this.lazer_power > 0) {
                    this.bonus = this.bonus + "Лазеры: <i class='fa fa-bolt lazer_attack'></i> " + this.lazer_power + "x" + this.lazer_shots + "<br />";
                }
                if (this.rocket_power > 0) {
                    this.bonus = this.bonus + "Ракета:  <i class='fa fa-bolt rocket_attack'></i> " + this.rocket_power + " <i class='fa fa-compress rocket_attack'></i> " + this.rocket_accuracy + "<br />";
                }
                if (this.cannon_power > 0) {
                    this.bonus = this.bonus + "Пушки:  <i class='fa fa-bolt cannon_attack'></i> " + this.cannon_power + " <i class='fa fa-bomb cannon_attack'></i> " +  + this.cannon_targets + "<br />";
                }
                this.bonus = this.bonus + "Вес:  " + this.weight + " <br/>";
                if (this.money_rent > 0)
                    this.bonus = this.bonus + "Поддержка:  " + this.money_rent + " <br/>";
                var ship = this;
                $("#ships_info").append(tmpl("ship_block", ship));

            })
            $('#ships_info .ship_help').qtip({

                position: {
                    my: 'bottom left', // at the bottom right of...
                    at: 'top left', // Position my top left...
                },
                style: {
                    classes: 'qtip-dark'
                }
            });
        } else {
            $("#ships_info").after("<div class='player_fleet_title'>В составе этого флота нет видимых вам кораблей</div>");
            $("#fleet_actions").remove();
            $("#ships_info").remove();
            //$("#ships div.actions").html(tmpl("fleet_actions", check));
        }
        ;

        //$("#ships").hide();
        //$("#ships").show();
        //$("#ships div.ships").makeScroll()
    }

    this.showMapStar = function (id, json) {

        //console.log(json);
        //console.log('-');
        //console.log(self.stars[id]);
        //map.jsonToFleets(json);

        if (map.fleets[self.stars[id].garrison]) {
            self.stars[id].weight = map.fleets[self.stars[id].garrison].weight;

        }
        else {
            self.stars[id].weight = "";
        }
        self.stars[id].image = self.stars[id].classname[0];

        $("#items_list").html(tmpl("coordinates_instance", self.stars[id]));

        $("#items_list").append(tmpl("star_instance", self.stars[id]));


        window.location.hash = self.stars[id].x + ':' + self.stars[id].y;

        drawFleetBlockAtStar(id, json);


        //$("#info").hide();
        //console.log("Show and make scroll");
        //$("#navi").hide();
        $("#stars").hide();
        $("#fleets_list").hide();
        $("#other_fleets_list").hide();
        $("#info").show();
        //$("#info").makeScroll(info_height);

    }
    this.clickMapStar = function (id, fleet_id) {
        this.current_star = id;
        window.location.hash = self.stars[id].x + ':' + self.stars[id].y;
        this.drawOffFlyCircle();
        var url = APIUrl() + '&act=map&task=point&star_id=' + id + '&format=json';
        $.getJSON(url, {}, function (json) {
            map.showPoint(json);
        })
    }
    this.clickMapStarPlanets = function (id, fleet_id) {
        sub_menu = false;
        this.current_star = id;
        if (map.stars[id].image_state != true)
        {
            setXYtoCenter(self.stars[id].x, self.stars[id].y);
        }
        window.location.hash = self.stars[id].x + ':' + self.stars[id].y;
        this.drawOffFlyCircle();
        var url = APIUrl() + '&act=map&task=star_planets&star_id=' + id + '&format=json';
        $.getJSON(url, {}, function (json) {
            map.showStarPlanets(json);
        })
    }

    function drawFleetBlockAtStar(star_id, json) {
        $("#fleets").html("");
        var fleets_show = false;
        if (json["fleets"])
            $.each(json["fleets"], function (index) {
                var info = this;
                //console.log(info)
                if (info.star_id == star_id) {
                    fleets_show = true;
                    var fleet = info;
                    if (fleet.owner == 'own') {
                        $("#items_list").append(tmpl("own_fleet_instance", fleet));

                    }
                    else {
                        $("#items_list").append(tmpl("other_fleet_instance", fleet));
                    }
                }
            })

        fleets_show = false;

        if (fleets_show) {
            $("#fleets").show();
            //$('#fleets').makeScroll();
            drawJsonToShips(json);
        } else {
            $("#fleets").hide();
            $("#ships").hide();
        }
        $('.ico_help').qtip({

            position: {
                at: 'top left', // at the bottom right of...
                my: 'bottom left', // Position my top left...
            },
            style: {
                classes: 'qtip-dark tips'
            }
        });
    }

    function drawJsonToShips(json) {

    }

    //форматируем высоту верхних слоев под нужные размеры с учетом экрана
    //$("#stars, #info, #fleets_list, #other_fleets_list").css("max-height", (base_height - $("#fleets").height() - 130) + "px");
    $.getJSON(APIUrl() + '&act=map&format=json', {}, function (json) {
        if (json['map_info']['peace'])
            $.each(json['map_info']['peace'], function (index) {
                map.peace.push(parseInt(this.player_id));
            })
        map.jsonToStars(json);
        map.jsonToFleets(json);
        map.settle_price = json['map_info']['settle_price'];

        map.settle_price_asteroid = json['map_info']['settle_price_asteroid'];
        $.each(json["map_info"]["science_info"], function (index) {
            map.science[this.type] = this.level;
        })

        map.drawStars();
        map.drawFleets();
        $.each(json["own_star"], function (index) {
            //console.log(this);
            //this.weight = map.fleets[this.garrison].weight;
            //json["own_star"][index].image = this.classname[0];
            //$('#stars').append(tmpl("star_instance", this));

            map.own_stars[this.id] = this;
        })
        //$("#stars").height($("#stars").height());
        //$("#stars").customScrollbar({});
        //$("#stars").hide();

        parseAnswer(json, "map");
        bindContainerEvents();
        bindContainerTouchEvents();
        //console.log("stars loaded");
        var xy = new Array();
        if (window.location.hash) {
            var hash = window.location.hash.substring(1).split("/");
            xy = hash[0].split(":");

        } else {
            xy[0] = json['own_star'][0].x;
            xy[1] = json['own_star'][0].y;
        }
        setXYtoCenter(xy[0], xy[1]);
        json = null;
        $("#map_container").show();

    })
}

var getCenterXY = function (x, y) {
    var result = new Object();
    result.x = Math.ceil((x - 1) * box_size + box_size / 2);
    result.y = Math.ceil((y - 1) * box_size + box_size / 2);
    return result;

}
var returnXYbyCenter = function (x, y) {
    var result = new Object();
    result.x = Math.round((x - box_size / 2) / box_size + 1);
    result.y = Math.round((y - box_size / 2) / box_size + 1);
    return result;
}
var returnRectangleXY = function () {
    var result = new Object();
    result.left_top = returnXYbyCenter(current_x, current_y);
    result.right_bottom = returnXYbyCenter(current_x + current_width, current_y + current_height);
    return result;
}
var setXYtoCenter = function (x, y) {
    var center = getCenterXY(x, y);
    current_scale = 1;
    current_x = center.x - base_width / 2;
    current_y = center.y - base_height / 2;
    current_width = base_width;
    current_height = base_height;
    var point = new fabric.Point(current_x, current_y);
    scene.setZoom(current_scale);
    scene.absolutePan(point);
    map.renewMap();
    var css_back_pos = $('#map_container').css('background-position');
    css_back_pos = css_back_pos.replace(/px/g, "");
    var back_pos = css_back_pos.split(' ');
    $('#map_container').css({
        'background-position': (parseInt(current_x) + 'px ' + parseInt(current_y) + 'px' )
    });
    return true;

}
var setFleetToCenter = function(fleet_id)
{
    if (map.fleets[fleet_id])
    {
        var x = map.stars[map.fleets[fleet_id].star_id].x;
        var y = map.stars[map.fleets[fleet_id].star_id].y;
        setXYtoCenter(x, y);
        return true;
    }
    else
    {
        return false;
    }

}
var in_queue = false;
var bindContainerTouchEvents = function () {

    var touchStartScale, touchStartDistance, touchX, touchY, centerTouchX, centerTouchY, lastTouchesLength, handleTouchEvent = function (e) {
        //console.log(e.type);
        var touches = e.originalEvent.touches, offset, currentScale, transXOld, transYOld;
        if (e.type == 'touchstart') {
            oldPageX = touches[0].pageX;
            oldPageY = touches[0].pageY;
            originX = oldPageX;
            originY = oldPageY;
        }
        if (e.type == 'touchend') {
            /*
             transX = (originX - touches[0].pageX);
             transY = (originY - touches[0].pageY);
             var Point = new fabric.Point(-transX, -transY);
             scene.relativePan(Point);
             var p = $('#map_container').offset();
             $('#map_container').offset({left: 0, top: 0});
             */
            transX = 0;
            transY = 0;
            map.renewMap();
            //return false;
        }


        if (touches.length == 1) {
            // Простое перемещение

            current_width = base_width / current_scale;
            current_height = base_height / current_scale;
            transX = (oldPageX - touches[0].pageX);
            transY = (oldPageY - touches[0].pageY);
            /*
             var css_back_pos = $('#map_container').css('background-position');
             css_back_pos = css_back_pos.replace(/px/g, "");
             var back_pos = css_back_pos.split(' ');
             $('#map_container').css({
             'background-position': (parseInt(back_pos[0]) - transX / 5) + 'px ' + (parseInt(back_pos[1]) - transY / 5 + 'px')
             });
             */
            current_x = current_x + transX / current_scale;
            current_y = current_y + transY / current_scale;
            var Point = new fabric.Point(-transX, -transY);
            scene.relativePan(Point);

            //var p = $('#map_container').offset();
            //$('#map_container').offset({left: p.left - transX, top: p.top - transY});

            var rectangle = returnRectangleXY();
            $('#radar_rectangle').css("left", rectangle.left_top.x);
            $('#radar_rectangle').css("top", rectangle.left_top.y);
            $('#radar_rectangle').css("width", rectangle.right_bottom.x - rectangle.left_top.x);
            $('#radar_rectangle').css("height", rectangle.right_bottom.y - rectangle.left_top.y);

            //console.log(transX);
            if (transX === 0 && transY === 0) {
                e.preventDefault();
            }
            oldPageX = touches[0].pageX;
            oldPageY = touches[0].pageY;

        }
        ;
    };

    $('#map_container').bind('touchstart', handleTouchEvent);
    $('#map_container').bind('touchmove', handleTouchEvent);
    $('#map_container').bind('touchend', handleTouchEvent);
};
var bindContainerEvents = function () {
    var mouseDown = false;

    /*
    setTimeout(function () {
        scene.renderAll()
    }, 1500);
    */

    $('#map_container').mousemove(function (e) {
        // Непосредственно перемещение
        if (mouseDown) {
            // Рассчитываем смещение с учётом масштаба
            if (in_queue == false) {
                in_queue = true;
                var r_a = requestAnimationFrame(function () {
                    in_queue = false;
                    current_width = base_width / current_scale;
                    current_height = base_height / current_scale;
                    transX = (oldPageX - e.pageX);
                    transY = (oldPageY - e.pageY);
                    var Point = new fabric.Point(-transX, -transY);
                    scene.relativePan(Point);
                    //map.renewMap();
                    //var p = $('#map_container').offset();
                    //$('#map_container').offset({left: p.left - transX, top: p.top - transY});

                    var css_back_pos = $('#map_container').css('background-position');
                    css_back_pos = css_back_pos.replace(/px/g, "");
                    var back_pos = css_back_pos.split(' ');
                    $('#map_container').css({
                        'background-position': (parseInt(back_pos[0]) - transX / 5) + 'px ' + (parseInt(back_pos[1]) - transY / 5 + 'px')
                    });
                    current_x = current_x + transX / current_scale;
                    current_y = current_y + transY / current_scale;

                    var rectangle = returnRectangleXY();
                    $('#radar_rectangle').css("left", rectangle.left_top.x);
                    $('#radar_rectangle').css("top", rectangle.left_top.y);
                    $('#radar_rectangle').css("width", rectangle.right_bottom.x - rectangle.left_top.x);
                    $('#radar_rectangle').css("height", rectangle.right_bottom.y - rectangle.left_top.y);

                    //сохраним положение
                    oldPageX = e.pageX;
                    oldPageY = e.pageY;
                });
                //console.log(r_a);
            }
            ;

            return false;
        }
    }).mousedown(function (e) {
        // Установим положение в начале перемещения по карте
        mouseDown = true;
        oldPageX = e.pageX;
        oldPageY = e.pageY;
        transX = 0;
        transY = 0;
        //console.log('mouse down ' + oldPageX + ' ' + oldPageY);
        //map.renewMap();
        return false;
    });

    $('body').mouseup(function () {
        mouseDown = false;
        //console.log("Mouse up");
        map.renewMap();
        event.preventDefault();
    });

    // Масштабирование колесом мыши
    $('#map_container').mousewheel(function (event, delta, deltaX, deltaY) {
        var offset = $('#canvas').offset(), // положение холста на странице
            centerX = event.pageX - offset.left, // координата x центра масштабирования
            centerY = event.pageY - offset.top, // координата y центра масштабирования
            zoomStep = Math.pow(1.06, deltaY);
        //console.log("wheel " + deltaY);
        // шаг масштабирования, удобный для пользователя.

        setScale(current_scale * zoomStep, centerX, centerY);
        var rectangle = returnRectangleXY();
        $('#radar_rectangle').css("left", rectangle.left_top.x);
        $('#radar_rectangle').css("top", rectangle.left_top.y);
        $('#radar_rectangle').css("width", rectangle.right_bottom.x - rectangle.left_top.x);
        $('#radar_rectangle').css("height", rectangle.right_bottom.y - rectangle.left_top.y);

        event.preventDefault();

    });
    $('#radar').click(function (event) {
        var w = $("#radar").width();
        var h = $("#radar").height();
        var offset = $('#radar').offset(), // положение холста на странице
            centerX = Math.ceil((event.pageX - offset.left)), // координата x центра масштабирования
            centerY = Math.ceil((event.pageY - offset.top));

        // координата y центра масштабирования
        setXYtoCenter(centerX, centerY);
        var rectangle = returnRectangleXY();
        $('#radar_rectangle').css("left", rectangle.left_top.x);
        $('#radar_rectangle').css("top", rectangle.left_top.y);
        $('#radar_rectangle').css("width", rectangle.right_bottom.x - rectangle.left_top.x);
        $('#radar_rectangle').css("height", rectangle.right_bottom.y - rectangle.left_top.y);

    })
    //клик по звезде и показ информации о ней
    scene.on('mouse:down', function (options) {
        //console.log('mouse down ' + options.target);
        if (options.target) {
            switch (options.target.nature) {
                case "star":
                    var id = options.target.id;
                    if (map.stars[id].fly_state === true)
                        map.fleets[map.current_fleet].flyTo(id);
                    else
                        map.clickMapStar(id);
                    break;
                case "fleet":
                    //console.log(options.target);
                    var id = options.target.star_id;
                    if (map.stars[id].fly_state === true)
                        map.fleets[map.current_fleet].flyTo(id);
                    else
                        map.clickFleet(options.target.fleet_id, true);
                    break;

            }

            mouseDown = false;
        } else {

            //console.log("scene click, all hide");
            map.hideInterface();

        }
    });
    scene.on('mouse:over', function (options) {
        //console.log('mouse down ' + options.target);
        if (options.target) {
            switch (options.target.nature) {
                case "star":
                    var id = options.target.id;
                    options.target.setScaleX(1.2);
                    options.target.setScaleY(1.2);
                    break;
                case "fleet":
                    //console.log(options.target);
                    var id = options.target.star_id;
                    options.target.setScaleX(1.2);
                    options.target.setScaleY(1.2);
                    break;

            }

        }
        //console.log('renderAll 2255');
        scene.renderAll();
    });
    scene.on('mouse:out', function (options) {
        //console.log('mouse down ' + options.target);
        if (options.target) {
            switch (options.target.nature) {
                case "star":
                    var id = options.target.id;

                    break;
                case "fleet":
                    //console.log(options.target);
                    var id = options.target.star_id;
                    break;

            }
            options.target.setScaleX(1);
            options.target.setScaleY(1);
        }
        //console.log('renderAll 2275');
        scene.renderAll();
    });



};

var setScale = function (scaleToSet, anchorX, anchorY) {
    var zoomMax = zoom_max, // максимально 5-ти кратное увеличение
        zoomMin = zoom_min, // минимальное увеличение - реальный размер картинки
        zoomStep;
    // необходимое изменение масштаба

    // Ограничим масштаб, если нужно
    if (scaleToSet > zoomMax * base_scale) {
        scaleToSet = zoomMax * base_scale;
    } else if (scaleToSet < zoomMin * base_scale) {
        scaleToSet = zoomMin * base_scale;
    }

    // Центр масштабирования - точка, которая должна остаться на месте.
    // Задаётся параметрами anchorX и anchorY.
    // По сути это должна быть позиция курсора в момент масштабирования.
    if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
        zoomStep = scaleToSet / current_scale;
        // Рассчитаем, на сколько нужно сместить все объекты,
        // чтобы центр масштабирования остался на месте.
        current_x = current_x + anchorX / current_scale - anchorX / scaleToSet;
        current_y = current_y + anchorY / current_scale - anchorY / scaleToSet;
        current_width = base_width / current_scale;
        current_height = base_height / current_scale;

        //window.location.hash = "#"+Math.round( (anchorX + current_x*current_scale) / box_size )+':'+Math.round(( anchorY + current_y*current_scale) / box_size);

    }
    /*
     switch (true) {
     case (scaleToSet < 0.99):
     if (current_scale >= 0.99)
     //hide. maybe use $.grep() ?
     for (i in map.stars) {
     //console.log("i " + i);
     if (map.stars[i].textCanvas !== undefined)
     map.stars[i].drawOff('text');
     }
     scene.renderAll();

     break;
     case (scaleToSet >= 0.99):
     if (current_scale < 0.99)
     //show
     for (i in map.stars) {
     //console.log("i " + i);
     if (map.stars[i].textCanvas !== undefined)
     map.stars[i].drawOn(scene, 'text');
     }
     scene.renderAll();

     break;

     }*/
    // Установим текущий масштаб
    current_scale = scaleToSet;

    // Применим трансформацию
    var point = new fabric.Point(anchorX, anchorY);
    scene.zoomToPoint(point, scaleToSet);
    map.renewMap();

};
var applyTransform = function () {

    if (current_x < 0)
        current_x = 0;
    if (current_y < 0)
        current_y = 0;
    if (current_x > box_size * universe_size - base_width * current_scale)
        current_x = box_size * universe_size - base_width * current_scale;
    if (current_y > box_size * universe_size - base_height * current_scale)
        current_y = box_size * universe_size - base_height * current_scale;

};

var scene;
var map = new Object();

$(document).ready(function () {

    console.log("booted");


    $('body, html').css('overflowY', 'scroll');
    $("body").width(document.body.scrollWidth);
    $('body, html').css('overflow', 'visible');

    window.addEventListener('orientationchange', function () {
        $("body").width(document.body.scrollWidth);
    }, true);

    function rescene() {
        scene.setDimensions({width: $(document).width(), height: $(document).height()});
    }

    document.addEventListener("fullscreenchange", function () {
        rescene();
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        rescene();
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        rescene();
    }, false);

    document.addEventListener("msfullscreenchange", function () {
        rescene();
    }, false);

    var xy = new Array();

    var canvas = $('#canvas');
    map = new Map();
    scene = new fabric.Canvas(canvas.get(0), {
        renderOnAddRemove: false,
        scale: 1,
        width: base_width,
        height: base_height,
        selection: false,
        hasRotatingPoint: false,
        hasBorders: false,
        hasControls: false,
        position: "absolute"


    });

    $(document).keyup(function (event) {
        if (event.keyCode == 27) {// Capture Esc key
            map.hideInterface();
        }
    });

    $('#radar_ico').click(function () {
        $('#radar').toggle();
        $('#plus_ico').toggle();
        $('#minus_ico').toggle();
        createCookie('radar', $('#radar').is(":visible"), 365);
    });
    $('#plus_ico').click(function () {
        var offset = $('#canvas'), // положение холста на странице
            centerX = offset.width()/2,
            centerY = offset.height()/2;
        setScale(current_scale * 1.2, centerX, centerY);
    });
    $('#minus_ico').click(function () {
        var offset = $('#canvas'), // положение холста на странице
            centerX = offset.width()/2,
            centerY = offset.height()/2;
        setScale(current_scale / 1.2, centerX, centerY);
    });
    var radar = readCookie('radar');
    if (radar == 'true')
    {
        $('#radar_ico').click();
    }

});

`;
    //setTimeout(function() {
        document.body.appendChild(script3);
    //}, 500);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);