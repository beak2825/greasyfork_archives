// ==UserScript==
// @name           Spacom: Конструктор
// @version        1.00
// @namespace      Spacom
// @author         Agor71
// @description    Максимальный уровень деталей, доступных для внедрения, выше на 25 технологий
// @include        http*://spacom.ru/?act=design*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/24255/Spacom%3A%20%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/24255/Spacom%3A%20%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

var run = function() {
	var script2 = document.createElement('script');
    script2.innerHTML = `
function getSlotId(slot) {
    switch (slot) {
        case 0:
            var id = "#slot_main";
            break;
        case 1:
            var id = "#slot_lazer";
            break;
        case 2:
            var id = "#slot_rocket";
            break;
        case 3:
            var id = "#slot_cannon";
            break;
        case 4:
            var id = "#slot_lazer_defence";
            break;
        case 5:
            var id = "#slot_rocket_defence";
            break;
        case 6:
            var id = "#slot_cannon_defence";
            break;
        case 7:
            var id = "#slot_hp";
            break;
        case 8:
            var id = "#slot_engine";
            break;
    }
    return id;
}

function Component(template, level, position) {

    Component.prototype.draw = function (slot_type, position) {
        var self = this;
        self.slot_type = slot_type;
        self.position = position;
        if (slot_type == 0) {
            $("#main_info").html(tmpl("main_detail_info_template", self));
        } else {
            var id = getSlotId(this.slot_require);
            $(id).append(tmpl("detail_instance", self));
        }
    };
    Component.prototype.calc = function (template) {
        this.slots = template.slots;
        this.slot_require = template.slot_require;
        this.name = template.name;
        this.image = template.image;
        this.title = template.name;

        this.params["hh"] = Math.round(template.params["hh"] * (1 + 0.40 * this.level));
        this.params["money_price"] = Math.round(template.params["money_price"] * (1 + 0.25 * this.level));
        this.params["money_rent"] = Math.round(template.params["money_rent"] * (1 + 0.15 * this.level));
        this.params["speed_power"] = Math.round(template.params["speed_power"] * (1 + 0.4 * this.level));
        this.params["speed_max"] = Math.round(template.params["speed_max"] * (1 + 0.25 * this.level));
        this.params["distance"] = (template.params["distance"] * (1 + 0.02 * this.level)).toFixed(2);
        this.params["lazer_shots"] = Math.round(template.params["lazer_shots"] * (1 + 0.00 * this.level));
        this.params["cannon_targets"] = Math.round(template.params["cannon_targets"] * (1 + 0.00 * this.level));
        this.params["weight_require"] = Math.floor(template.params["weight_require"] * (1 + 0.25 * this.level));
        this.params["weight"] = Math.round(template.params["weight"] * (1 + 0.25 * this.level));

        this.params["hp"] = Math.round(template.params["hp"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["lazer_power"] = Math.round(template.params["lazer_power"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["lazer_defence"] = Math.round(template.params["lazer_defence"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["rocket_power"] = Math.round(template.params["rocket_power"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["rocket_accuracy"] = Math.round(template.params["rocket_accuracy"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["rocket_defence"] = Math.round(template.params["rocket_defence"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["cannon_power"] = Math.round(template.params["cannon_power"] * Math.pow(1 + 0.15 * this.level, 2));
        this.params["cannon_defence"] = Math.round(template.params["cannon_defence"] * Math.pow(1 + 0.15 * this.level, 2));



    };
    this.component_id = template.component_id;
    this.level = level;
    this.params = Object();
    this.calc(template);
    this.active = true;

}

function templateComponent(params) {

    this.component_id = params.component_id;
    this.name = params.name;
    this.max_level = parseInt(params.max_level);
    this.slot_require = parseInt(params.slot_require);
    this.image = params.image;
    this.params = params;
    if (params["slots"]) {
        this.slots = params["slots"].split(" ");
        for (i in this.slots)
            this.slots[i] = parseInt(this.slots[i]);
    }

    templateComponent.prototype.draw = function (slots_possible) {
        if (this.slot_require === 0) {
            this.title = "Несущий корпус. Слоты: <br/>";
            for (i in this.slots) {
                if (this.slots[i] > 0) {
                    var count = this.slots[i];
                    switch (i) {
                        case "1":
                            this.title = this.title + "Лазеры - " + count + "<br/>";
                            break;
                        case "2":
                            this.title = this.title + "Ракеты - " + count + "<br/>";
                            break;
                        case "3":
                            this.title = this.title + "Пушки - " + count + "<br/>";
                            break;
                        case "4":
                            this.title = this.title + "Зеркала - " + count + "<br/>";
                            break;
                        case "5":
                            this.title = this.title + "ПРО - " + count + "<br/>";
                            break;
                        case "6":
                            this.title = this.title + "Броня - " + count + "<br/>";
                            break;
                        case "7":
                            this.title = this.title + "Прочность - " + count + "<br/>";
                            break;
                        case "8":
                            this.title = this.title + "Двигатели - " + count + "<br/>";
                            break;

                    }
                }
            }
            $("#slot0").append(tmpl("main_template", this));

        } else if (slots_possible[this.slot_require] >= 1) {
            this.title = "Устанавливается в слот для ";
            switch (this.slot_require) {
                case 1:
                    this.title = this.title + "лазеров <br/>";
                    var tab_slot = "slot123";
                    break;
                case 2:
                    this.title = this.title + "ракет <br/>";
                    var tab_slot = "slot123";
                    break;
                case 3:
                    this.title = this.title + "пушек <br/>";
                    var tab_slot = "slot123";
                    break;
                case 4:
                    this.title = this.title + "зеркал <br/>";
                    var tab_slot = "slot4567";
                    break;
                case 5:
                    this.title = this.title + "ПРО <br/>";
                    var tab_slot = "slot4567";
                    break;
                case 6:
                    this.title = this.title + "брони <br/>";
                    var tab_slot = "slot4567";
                    break;
                case 7:
                    this.title = this.title + "прочности <br/>";
                    var tab_slot = "slot4567";
                    break;
                case 8:
                    this.title = this.title + "двигателей <br/>";
                    var tab_slot = "slot8";
                    break;

            }
            if (this.params["lazer_power"] > 0)
                this.title = this.title + "Мощь " + this.params["lazer_power"] + ", количество выстрелов 1 <br/>";
            if (this.params["rocket_power"] > 0)
                this.title = this.title + "Мощь " + this.params["rocket_power"] + ", точность " + this.params["rocket_accuracy"] + " <br/>";
            if (this.params["cannon_power"] > 0)
                this.title = this.title + "Мощь " + this.params["cannon_power"] + ", количество целей 1 <br/>";

            if (this.params["lazer_defence"] > 0)
                this.title = this.title + "Защита от лазерных выстрелов " + this.params["lazer_defence"] + "<br/>";
            if (this.params["rocket_defence"] > 0)
                this.title = this.title + "Уклонение от ракет " + this.params["rocket_defence"] + "<br/>";
            if (this.params["cannon_defence"] > 0)
                this.title = this.title + "Защита от пушек " + this.params["cannon_defence"] + "<br/>";
            if (this.params["hp"] > 0)
                this.title = this.title + "Прочность " + this.params["hp"] + "<br/>";

            $("#" + tab_slot).append(tmpl("detail_template", this));
        }
    };
}

function detailPosition(slot, position) {
    this.slot = slot;
    this.position = position;
}

function selectTab(id) {
    design.active_slot = false;
    $("#details_list").tabs("option", "active", id);
}

function slotInfo(slot_type) {
    var slot_type = parseInt(slot_type);
    var empty_info = new Object();
    switch (slot_type) {
        case 0:
            empty_info.slot_name = "корпус";
            empty_info.tab_id = 0;
            break;
        case 1:
            empty_info.slot_name = "лазер";
            empty_info.tab_id = 1;
            break;
        case 2:
            empty_info.slot_name = "ракета";
            empty_info.tab_id = 1;
            break;
        case 3:
            empty_info.slot_name = "пушка";
            empty_info.tab_id = 1;
            break;
        case 4:
            empty_info.slot_name = "лазерная защита";
            empty_info.tab_id = 2;
            break;
        case 5:
            empty_info.slot_name = "ракетная защита";
            empty_info.tab_id = 2;
            break;
        case 6:
            empty_info.slot_name = "защита от пушек";
            empty_info.tab_id = 2;
            break;
        case 7:
            empty_info.slot_name = "прочность";
            empty_info.tab_id = 2;
            break;
        case 8:
            empty_info.slot_name = "двигатель";
            empty_info.tab_id = 3;
            break;
    }
    return empty_info;

}

function Design(params) {
    this.design_id = params.design.design_id;
    this.name = params.design.name;
    this.components = Array();
    this.components_in_slot = Array();
    this.template_components = Array();
    this.bonus = params.info;
    this.slots = Array();
    this.slots_possible = Array();
    this.active_slot = false;

    Design.prototype.lookForPosition = function (slot_type) {
        if (this.slots[slot_type] > 0)
            for (i = 0; i < this.slots[slot_type]; i++) {
                if (typeof this.components_in_slot[slot_type][i] === "undefined")
                    return i;
            }
        return false;
    };
    Design.prototype.hideDetail = function () {

        $("#detail_info").html("");
        this.active_slot = false;
        this.draw();
    };

    Design.prototype.showDetail = function (slot_type, position) {
        var component = this.components_in_slot[slot_type][position];
        component.slot_type = slot_type;
        component.position = position;
        this.active_slot = new detailPosition(slot_type, position);
        this.draw();
        $("#detail_info").html(tmpl("detail_info_template", component));
        $("i.fa").qtip({
            style: {
                classes: "qtip-dark tips"
            }
        });
    };

    Design.prototype.draw = function () {
        $("#details_list div").html("");
        $("#design_main").children().html("");
        $("#design_info").html(tmpl("design_info_template", this));
        $("i.fa").qtip({
            style: {
                classes: "qtip-dark tips"
            }
        });
        for (i in this.template_components) {
            this.template_components[i].draw(this.slots_possible);
        }
        var current_slot = 0;
        for (slot_type in this.slots)
            for (position = 0; position < this.slots[slot_type]; position++) {
                if (typeof this.components_in_slot[slot_type][position] === "undefined") {
                    var empty_info = slotInfo(slot_type);
                    var id = getSlotId(parseInt(slot_type));
                    $(id).append(tmpl("empty_instance", empty_info));
                } else {
                    if ((this.active_slot) && (this.active_slot.slot == slot_type) && (this.active_slot.position == position))
                        this.components_in_slot[slot_type][position].active = true;
                    else
                        this.components_in_slot[slot_type][position].active = false;
                    this.components_in_slot[slot_type][position].draw(slot_type, position);
                }

            }

        $(".help_detail").qtip({
            position: {
                at: "top left",
                my: "bottom left",
            },
            style: {
                classes: "qtip-dark tips"
            }
        });
        $("#details_list div:empty").html("Нет доступных деталей выбранного типа: слоты заполнены, или нужные детали не исследованы");

    };
    Design.prototype.lowLevel = function (slot_type, position) {
        if (this.components_in_slot[slot_type][position].level > 1) {
            this.components_in_slot[slot_type][position].level = this.components_in_slot[slot_type][position].level - 1;
            this.calc();
            this.draw();
            if (slot_type != 0)
                this.showDetail(slot_type, position);

        } else {
            this.removeComponent(slot_type, position);
        }
    };
    Design.prototype.maxLevel = function (slot_type, position) {

        var component_id = this.components_in_slot[slot_type][position].component_id;
        this.components_in_slot[slot_type][position].level = this.template_components[component_id].max_level + 25;
        this.calc();
        this.draw();
        if (slot_type != 0)
            this.showDetail(slot_type, position);

    };

    Design.prototype.upLevel = function (slot_type, position) {

        var component_id = this.components_in_slot[slot_type][position].component_id;
        if (this.components_in_slot[slot_type][position].level + 1 <= this.template_components[component_id].max_level + 25) {
            this.components_in_slot[slot_type][position].level = this.components_in_slot[slot_type][position].level + 1;
            this.calc();
            this.draw();
        }
        if (slot_type != 0)
            this.showDetail(slot_type, position);

    };

    Design.prototype.removeComponent = function (slot_type, position) {
        var template = this.template_components[this.components_in_slot[slot_type][position].component_id];
        if (template.slot_require === 0) {
            this.components_in_slot = Array();
            $("#main_info").html("");
        } else {
            delete this.components_in_slot[slot_type][position];
            this.slot_active = false;
        }
        this.calc();
        this.draw();
        this.hideDetail();
        slot_info = slotInfo(slot_type);
        selectTab(slot_info.tab_id);
    };
    Design.prototype.addComponent = function (component_id, level, fast) {
        var template = this.template_components[component_id];
        var slot_require = template.slot_require;
        if (slot_require === 0) {
            this.components = Array();
            this.slots = template.slots.slice();
            this.slots_possible = template.slots.slice();
            this.components_in_slot = Array();
            for (j in this.slots) {
                this.components_in_slot[j] = new Array(this.slots[j]);
            }

            this.params = template.params;

            if (($("#design_name").val() == "") || ($("#design_name").val() == "Новый дизайн")) {
                this.name = template.name;
                $("#design_name").val(template.name);
            }
        }
        var component = new Component(template, parseInt(level));
        var position = this.lookForPosition(slot_require);
        if (position !== false) {
            this.components_in_slot[slot_require][position] = component;
            this.active_slot = new detailPosition(slot_require, position);
            if ((slot_require != 0) & ( typeof fast == "undefined"))
                this.showDetail(slot_require, position);
        }
    };

    Design.prototype.addTemplateComponent = function (param) {
        this.template_components[param.component_id] = new templateComponent(param);
    };
    Design.prototype.save = function () {
        this.calc();
        var name = $("#design_name").val();
        var components = Array();
        for (slot_type in this.components_in_slot) {
            for (position in this.components_in_slot[slot_type]) {
                var element = Object();
                element.component_id = this.components_in_slot[slot_type][position].component_id;
                element.level = this.components_in_slot[slot_type][position].level;
                components.push(element);
            }
        }

        data = JSON.stringify(components);
        if (this.params["weight"] >= this.params["weight_require"]) {
            $.post(APIUrl() + "&act=design&task=design_save&design_id=" + this.design_id + "&name=" + encodeURIComponent(name) + "&format=json", {
                data: data
            }, function (json) {
                showSmallMessage("Запрос на сохранение выполнен");
            });
        } else {
            showSmallMessage("Превышен лимит веса. Доступно " + this.params["weight"] + ", использовано " + this.params["weight_require"]);
        }

    };
    Design.prototype.calc = function () {

        function componentOrder(a, b) {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            if (a.slot_require < b.slot_require) {
                return -1;
            }
            if (a.slot_require > b.slot_require) {
                return 1;
            }
            if (a.i < b.i) {
                return -1;
            }
            if (a.i > b.i) {
                return 1;
            }

            return 0;

        }


        this.components.sort(componentOrder);
        this.params = Object();
        this.params["hh"] = 0;
        this.params["money_price"] = 0;
        this.params["money_rent"] = 0;
        this.params["speed_power"] = 0;
        this.params["speed_max"] = 0;
        this.params["distance"] = 0;
        this.params["hp"] = 0;
        this.params["lazer_power"] = 0;
        this.params["lazer_shots"] = 0;
        this.params["lazer_defence"] = 0;
        this.params["rocket_power"] = 0;
        this.params["rocket_accuracy"] = 0;
        this.params["rocket_defence"] = 0;
        this.params["cannon_power"] = 0;
        this.params["cannon_targets"] = 0;
        this.params["cannon_defence"] = 0;
        this.params["weight_require"] = 0;
        this.params["weight"] = 0;
        this.slots = Array();
        this.slots_possible = Array();
        for (ii in this.components_in_slot) {
            for (jj in this.components_in_slot[ii]) {

                this.components_in_slot[ii][jj].calc(this.template_components[this.components_in_slot[ii][jj].component_id]);
                var component = this.components_in_slot[ii][jj];
                if (component.slot_require === 0) {
                    this.slots = component.slots.slice();
                    this.slots_possible = component.slots.slice();
                    this.params = component.params;


                } else {
                    this.slots_possible[component.slot_require] = parseInt(this.slots_possible[component.slot_require]) - 1;

                    for (i in component.params) {
                        switch (i) {
                            case "distance":
                                this.params[i] = parseInt(this.params[i] * 100) / 100 + parseInt(component.params[i] * 100) / 100;
                                break;

                            case "lazer_shots":
                            case "hh":
                            case "money_price":
                            case "money_rent":
                            case "speed_power":
                            case "speed_max":
                            case "hp":
                            case "lazer_power":
                            case "lazer_defence":
                            case "rocket_power":
                            case "rocket_accuracy":
                            case "rocket_defence":
                            case "cannon_power":
                            case "cannon_targets":
                            case "cannon_defence":
                            case "weight_require":
                            case "weight":
                                this.params[i] = parseInt(this.params[i]) + parseInt(component.params[i]);
                                break;
                        }
                    }
                }
                ;
            }
        }
        if (this.params["speed_power"] > 0) {
            this.params["distance"] = this.params["distance"] * (1 + this.bonus.s_engine * 0.2);
            this.params["speed"] = Math.min(this.params["speed_power"] * (1 + this.bonus.s_engine * 0.4) / this.params["weight_require"], this.params["distance"]);
            this.params["speed"] = this.params["speed"].toFixed(2);
            this.params["distance"] = this.params["distance"].toFixed(2);
        } else
            this.params["speed"] = "0.00";

        this.params["lazer_power"] = Math.ceil(this.params["lazer_power"] * (1 + this.bonus["s_lazer_power"] * 1));
        this.params["lazer_shots"] = Math.ceil(this.params["lazer_shots"] * (1 + this.bonus["s_lazer_power"] * 0.25));
        this.params["rocket_power"] = Math.ceil(this.params["rocket_power"] * (1 + this.bonus["s_rocket_power"] * 1));
        this.params["cannon_power"] = Math.ceil(this.params["cannon_power"] * (1 + this.bonus["s_cannon_power"] * 1));
        this.params["rocket_accuracy"] = Math.ceil(this.params["rocket_accuracy"] * (1 + this.bonus["s_rocket_power"] * 1));
        this.params["lazer_defence"] = Math.ceil(this.params["lazer_defence"] * (1 + this.bonus["s_defender"] * 1));
        this.params["rocket_defence"] = Math.ceil(this.params["rocket_defence"] * (1 + this.bonus["s_defender"] * 1));
        this.params["cannon_defence"] = Math.ceil(this.params["cannon_defence"] * (1 + this.bonus["s_defender"] * 1));
        this.params["hp"] = Math.ceil(this.params["hp"] * (1 + this.bonus["s_hits"] * 1));

        this.params["lazer_power"] = Math.ceil(this.params["lazer_power"] * (1 + this.bonus["s_power"] * 0.75));
        this.params["lazer_shots"] = Math.ceil(this.params["lazer_shots"] * (1 + this.bonus["s_power"] * 0.25));
        this.params["rocket_power"] = Math.ceil(this.params["rocket_power"] * (1 + this.bonus["s_power"] * 0.75));
        this.params["cannon_power"] = Math.ceil(this.params["cannon_power"] * (1 + this.bonus["s_power"] * 0.75));
        this.params["rocket_accuracy"] = Math.ceil(this.params["rocket_accuracy"] * (1 + this.bonus["s_power"] * 0.75));
        this.params["lazer_defence"] = Math.ceil(this.params["lazer_defence"] * (1 + this.bonus["s_defence"] * 0.75));
        this.params["rocket_defence"] = Math.ceil(this.params["rocket_defence"] * (1 + this.bonus["s_defence"] * 0.75));
        this.params["cannon_defence"] = Math.ceil(this.params["cannon_defence"] * (1 + this.bonus["s_defence"] * 0.75));
        this.params["hp"] = Math.ceil(this.params["hp"] * (1 + this.bonus["s_defence"] * 0.75));


        if (this.params["lazer_shots"] > 0)
            this.params["lazer_power"] = Math.ceil(parseInt(this.params["lazer_power"]) / parseInt(this.params["lazer_shots"]));
        else
            this.params["lazer_power"] = 0;

        if (this.params["hp"] > 0)
            this.params["lazer_defence"] = Math.ceil(100 * parseInt(this.params["lazer_defence"]) / (parseInt(this.params["lazer_defence"]) + parseInt(this.params["hp"]) ));
        else
            this.params["lazer_defence"] = 0;

        return this;
    };
    if (params["component_template"])
        for (i in params["component_template"]) {
            var current = params["component_template"][i];
            this.addTemplateComponent(current);

        }

    if (params["design"]["component_instance"])
        for (i in params["design"]["component_instance"]) {
            var current = params["design"]["component_instance"][i];

            this.addComponent(current.component_id, current.level, true);
        }
    this.calc();
    this.hideDetail();

}
`;
    document.body.appendChild(script2);
    //document.body.innerHTML = document.body.innerHTML.replace(/design.upLevel/g,"design.upLevel1");
    //document.body.innerHTML = document.body.innerHTML.replace(/design.maxLevel/g,"design.maxLevel1");
};	
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);