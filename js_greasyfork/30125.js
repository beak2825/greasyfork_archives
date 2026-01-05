// ==UserScript==
// @name         starve.io MODs
// @namespace    starveio_叶海晨星
// @version      1.05
// @description  为 starve.io 添加一些功能
// @author       叶海晨星
// @match        *://starve.io/
// @icon         http://starve.io/img/favicon.png

// @downloadURL https://update.greasyfork.org/scripts/30125/starveio%20MODs.user.js
// @updateURL https://update.greasyfork.org/scripts/30125/starveio%20MODs.meta.js
// ==/UserScript==

function initVal() { //初始化全局变量
    console.log("===初始化变量===");
    outText = create_text(1, "存活人数: ", 25, "#FFF", void 0, void 0, "#000", 5, 220);
    gameTime = create_text(1, "白天: 0秒", 25, "#FFF", void 0, void 0, "#000", 5, 220);
    HUD_life = create_text(1, " 生命: 100%", 25, "#69A148");
    HUD_food = create_text(1, "饱食: 100% ", 25, "#AF352A");
    HUD_cool = create_text(1, "温度: 100%", 25, "#669BB1");

    fFind = false; //是否显示浆果引导线
    bFind = false; //是否显示篝火引导线
    mFind = false; //是否显示篝火引导线
    tDraw = false; //是否显示攻击范围
    mDraw = false; //是否显示怪物视野
    dayTime = 2400;
    modVer = "1.05";

    MyArc = [];
    //搞范围
    MyArc[yolo24818.PICK] = CTI(create_arc(80));
    //剑范围
    MyArc[yolo24818.SWORD] = CTI(create_arc(100));
    //矛范围
    MyArc[yolo24818.SPEAR] = CTI(create_arc(145));
    //锤范围
    MyArc[yolo24818.HAMMER] = CTI(create_arc(90));
    //狼视野范围
    MyArc[yolo24818.HURT_WOLF] = CTI(create_arc(260, 0, Math.PI * 2));
    //蜘蛛视野范围
    MyArc[yolo24818.HURT_SPIDER] = CTI(create_arc(260, 0, Math.PI * 2));
    //狐狸视野范围
    MyArc[yolo24818.HURT_FOX] = CTI(create_arc(260, 0, Math.PI * 2));
    //熊视野范围
    MyArc[yolo24818.HURT_BEAR] = CTI(create_arc(260, 0, Math.PI * 2));
    //龙视野范围
    MyArc[yolo24818.HURT_DRAGON] = CTI(create_arc(260, 0, Math.PI * 2));
    //兔子视野范围
    MyArc[yolo24818.HURT_RABBIT] = CTI(create_arc(180, 0, Math.PI * 2));
}

function Eng2Chs() { //中文化
    console.log("===中文化MOD===");
    yolo24802.survive = function () {
        user.alert.text = 0 === user.day ? "你已生存 1 天" : "你已生存 " + (user.day + 1) + " 天";
        user.alert.label = null;
        user.alert.timeout.o = !1;
        user.alert.timeout.v = user.alert.timeout.max;
        user.day++;
    };

    yolo24802.yolo24778 = function () {
        user.alert.text = "资源已空";
    };

    yolo24802.yolo24786 = function () {
        user.alert.text = "背包已满 (右键可删除物品)";
    };

    yolo24802.dont_harvest = function (c) {
        user.alert.text = "这不是正确的工具";
    };
}

function ModsLoader() { //游戏MOD加载器
    console.log("===大地图Mod===");
    yolo24895 = function () { //修改游戏大地图显示
        if (user.bigmap) {
            /*yolo24865.globalAlpha = 0.5;
			yolo24865.fillStyle = "#000";
			yolo24865.fillRect(0, 0, canw, canh);*/
            yolo24865.globalAlpha = 0.8;
            var cc = sprite[yolo24818.BIGMAP][0],
                /*g = canw2 - cc.width / 2,
				f = canh2 - cc.height / 2;*/
                g = canw - cc.width + 10,
                f = canh - cc.height + 30;
            yolo24865.drawImage(cc, g, f);
            //yolo24865.globalAlpha = 1; - 1 < game.minimap.marker.x && (yolo24865.fillStyle = "#660000", circle(yolo24881, g + 3 * game.minimap.marker.x * scale, f + 3 * game.minimap.marker.y * scale, 14 * scale), yolo24865.fill());
            yolo24865.globalAlpha = 1; -
            1 < game.minimap.marker.x && (yolo24865.fillStyle = "#660000", circle(yolo24865, g + 3 * game.minimap.marker.x * scale, f + 3 * game.minimap.marker.y * scale, 14 * scale), yolo24865.fill());
            /*for (var c = game.minimap.yolo24847,
                    d = 0; d < c.length; d++) {
                var e = c[d];
                yolo24865.fillStyle = "#ff0000";
                //circle(yolo24881, g + (0.0077 * e.x + 9) * scale * 3, f + (0.0125 * e.y + 12) * scale * 3, 6 * scale);
                circle(yolo24881, g + (0.0077 * e.x + 9) * scale * 3, f + (0.0125 * e.y + 12) * scale * 3, 3 * scale);
                yolo24865.fill();
            }*/
            draw_MyCode();
            if (c = yolo24881.yolo24845[user.uid]) {
                yolo24865.fillStyle = 0 ? "#fff" : "#1e8a9d";
                // circle(yolo24881, g + (0.0077 * c.x + 9) * scale * 3, f + (0.0125 * c.y + 12) * scale * 3, 12 * scale);
                circle(yolo24865, g + (0.0077 * c.x + 9) * scale * 3, f + (0.0125 * c.y + 12) * scale * 3, 6 * scale);
                yolo24865.fill();
            }
        }
    };

    console.log("===小地图Mod===");
    yolo24919 = function () { //修改游戏小地图显示
        if (!user.bigmap) {
            var c = 1470 > canw && 9 < user.inv.max ? {
                x: game.minimap.translate.x,
                y: game.minimap.translate.y - 80 * scale
            } : game.minimap.translate;
            yolo24865.globalAlpha = 0.8;
            yolo24865.drawImage(sprite[yolo24818.MINIMAP][0], c.x, c.y);
            yolo24865.globalAlpha = 1; -
            1 < game.minimap.marker.x && (yolo24865.fillStyle = "#660000", circle(yolo24865, c.x + game.minimap.marker.x * scale, c.y + game.minimap.marker.y * scale, 5 * scale), yolo24865.fill());
            /*for (var g = game.minimap.yolo24847,
                    f = 0; f < g.length; f++) {
                var d = g[f];
                yolo24865.fillStyle = "#ff0000";
                circle(yolo24865, c.x + (0.0077 * d.x + 9) * scale, c.y + (0.0125 * d.y + 12) * scale, 2 * scale);
                yolo24865.fill();
            }*/
            draw_MyCode();
            if (g = yolo24881.yolo24845[user.uid]) {
                yolo24865.fillStyle = 0 ? "#fff" : "#1e8a9d";
                circle(yolo24865, c.x + (0.0077 * g.x + 9) * scale, c.y + (0.0125 * g.y + 12) * scale, 4 * scale);
                yolo24865.fill();
            }
        }
    };
    //=====================更新游戏人数===========================
    yolo24802.yolo24791 = function (c) {
        var f = c[1],
            d = yolo24881.yolo24847;
        d[f].nickname = c[2];
        d[f].score = 0;
        d[f].ldb_label = null;
        d[f].label = null;
        d[f].label_winter = null;
        d[f].alive = !0;
        outText = create_text(1, "存活人数: " + alive_players() + " 人", 25, "#FFF", void 0, void 0, "#000", 5, 220);
    };

    yolo24802.kill_player = function (c) {
        yolo24881.mode == yolo24881.MODE_HUNGER_GAMES && "spectator" !== yolo24881.yolo24847[c].nickname && (user.alert.text ? user.alert.list.push(yolo24881.yolo24847[c].nickname + " 已死亡") : user.alert.text = yolo24881.yolo24847[c].nickname + " 已死亡");
        yolo24881.yolo24847[c].alive = !1;
        outText = create_text(1, "存活人数: " + alive_players() + " 人", 25, "#FFF", void 0, void 0, "#000", 5, 220);
    };

    console.log("===额外信息Mod===");
    yolo24749 = function () { //hack游戏显示函数,显示额外游戏数据
        if (user) {
            yolo24865.drawImage(outText, user.yolo24934.translate.x + 30, user.yolo24934.translate.y);
            gameTime = create_text(1, (yolo24881.time ? "夜晚: " : "白天: ") + Math.floor(dayTime / 10) + " 秒", 25, "#FFF", void 0, void 0, "#000", 5, 220);

            yolo24865.drawImage(gameTime, user.yolo24934.translate.x + 30, user.yolo24934.translate.y + 40);

            HUD_life = create_text(1, " 生命: " + Math.floor(user.gauges.life.x * 100) + "% ", 25, "#69A148");
            HUD_food = create_text(1, "饱食: " + Math.floor(user.gauges.hunger.x * 100) + "% ", 25, "#AF352A");
            HUD_cool = create_text(1, "温度: " + Math.floor(user.gauges.cold.x * 100) + "%", 25, "#669BB1");

            yolo24865.save();
            yolo24865.translate(user.cam.x + yolo24881.yolo24845[user.uid].x, user.cam.y + yolo24881.yolo24845[user.uid].y);

            yolo24865.globalAlpha = 0.5;
            yolo24865.fillStyle = "#000";
            yolo24865.fillRect(-HUD_life.width - HUD_food.width / 2 - 4, -HUD_food.height - 85 * scale - 4, HUD_life.width + HUD_food.width + HUD_cool.width + 12, HUD_food.height + 8);
            yolo24865.globalAlpha = 1;

            if (0.5 > user.gauges.l) yolo24865.globalAlpha = user.gauges.warn_life.v;
            yolo24865.drawImage(HUD_life, -HUD_life.width - HUD_food.width / 2, -HUD_food.height - 85 * scale);
            yolo24865.globalAlpha = 1;

            if (0.3 > user.gauges.h) yolo24865.globalAlpha = user.gauges.warn_hunger.v;
            yolo24865.drawImage(HUD_food, -HUD_food.width / 2, -HUD_food.height - 85 * scale);
            yolo24865.globalAlpha = 1;

            if (0.3 > user.gauges.c) yolo24865.globalAlpha = user.gauges.warn_cold.v;
            yolo24865.drawImage(HUD_cool, HUD_food.width / 2, -HUD_cool.height - 85 * scale);
            yolo24865.globalAlpha = 1;
            yolo24865.restore();
        }
    };
}

function autoCheat() { //游戏数据修改
    if (user && world) {
        console.log("===数值设定Mod===");
        //自动吃食物
        user.auto_feed.enabled = true;
        //特殊模式
        user.spectator = true;
        //速度修改
        yolo24881.SPEED = 210;
        //yolo24881.SPEED_WINTER=210;
        yolo24881.SPEED_WEAPON = 210;
        //yolo24881.SPEED_WINTER_WEAPON=210;
        yolo24881.SPEED_ATTACK = 210;
    }
}


//============================自定义的函数===============================
function alive_players() { //统计存活人数
    var i = 0;
    if (yolo24881.yolo24847) {
        for (var p in yolo24881.yolo24847) {
            if (yolo24881.yolo24847[p].alive === true) i++;
        }
    }
    return i;
}

function create_arc(r, sAngle, lLenght, lColor, lWidth) { //绘制圆弧
    var v = document.createElement("canvas"),
        t = v.getContext("2d");
    r = r ? r : 80;
    sAngle = sAngle ? sAngle : Math.PI / 8 * 13;
    lLenght = lLenght ? lLenght : Math.PI / 4 * 3;
    lColor = lColor ? lColor : "#ff0000";
    lWidth = lWidth ? lWidth : 4;

    v.width = (r + lLenght) * 2;
    v.height = (r + lLenght) * 2;

    t.strokeStyle = lColor;
    t.lineWidth = lWidth;
    t.beginPath();
    t.arc((r + lLenght), (r + lLenght), r, sAngle, sAngle + lLenght);
    t.stroke();
    return v;
}

function draw_MyCode() {
    draw_ToMOBs();
    draw_ToFRUIT();
    draw_ToFIRE();
    draw_ToolArc();
    draw_HurtMobs();
}


function draw_Arc_Update(c, i) {
    yolo24865.save();
    yolo24865.translate(user.cam.x + c.x, user.cam.y + c.y);
    yolo24865.rotate(c.angle);
    yolo24865.globalAlpha = 0.3;
    yolo24865.drawImage(i, -i.width / 2, -i.height / 2);
    yolo24865.globalAlpha = 1;
    yolo24865.restore();
}

function draw_Line_Update(p, i, w, c, a) {
    w = w ? w : 4;
    c = c ? c : "#ff0000";
    a = a ? a : 0.5;
    yolo24865.save();
    yolo24865.translate(user.cam.x, user.cam.y);
    yolo24865.globalAlpha = a;
    yolo24865.beginPath();
    yolo24865.strokeStyle = c;
    yolo24865.lineWidth = w;
    yolo24865.moveTo(p.x, p.y);
    yolo24865.lineTo(i.x, i.y);
    yolo24865.stroke();
    yolo24865.globalAlpha = 1;
    yolo24865.restore();
}

function distanceCAL(p, i) {
    var calX = p.x - i.x;
    var calY = p.y - i.y;
    return Math.floor(Math.pow((calX * calX + calY * calY), 0.5));
}

function draw_ToFRUIT() {
    var fss = [];
    var fs, f;
    var z;
    if (fFind && yolo24881) {
        yolo24881.units[yolo24763.FRUIT].length > 0 && fss.push([yolo24881.units[yolo24763.FRUIT], "#00ff00"]);
        yolo24881.units[yolo24763.SEED].length > 0 && fss.push([yolo24881.units[yolo24763.SEED], "#00cc00"]);
        if (fss.length > 0) {
            for (fs in fss) {
                for (f in fss[fs][0]) {
                    if (fss[fs][0][f].info > 0 && fss[fs][0][f].info !== 11) {
                        z = distanceCAL(yolo24881.yolo24845[user.uid], fss[fs][0][f]);
                        z = z > 900 ? 900 : z;
                        draw_Line_Update(yolo24881.yolo24845[user.uid], fss[fs][0][f], fss[fs][0][f].info * 2, fss[fs][1], 1 - z / 1000);
                    }
                }
            }
        }
    }
}

function draw_ToFIRE() {
    var fss = [];
    var fs, f;
    var z;
    if (bFind && yolo24881) {
        yolo24881.units[yolo24763.FIRE].length > 0 && fss.push([yolo24881.units[yolo24763.FIRE], 5, "#ff8800"]);
        yolo24881.units[yolo24763.BIG_FIRE].length > 0 && fss.push([yolo24881.units[yolo24763.BIG_FIRE], 10, "#ff8800"]);
        yolo24881.units[yolo24763.FURNACE].length > 0 && fss.push([yolo24881.units[yolo24763.BIG_FIRE], 10, "#ffdd00"]);
        if (fss.length > 0) {
            for (fs in fss) {
                for (f in fss[fs][0]) {
                    z = distanceCAL(yolo24881.yolo24845[user.uid], fss[fs][0][f]);
                    z = z > 900 ? 900 : z;
                    if (z > 200) draw_Line_Update(yolo24881.yolo24845[user.uid], fss[fs][0][f], fss[fs][1], fss[fs][2], 1 - z / 1000);
                }
            }
        }
    }
}

function draw_ToMOBs() {
    var mss = [];
    var ms, m;
    var z;
    if (mFind && yolo24881) {
        yolo24881.units[yolo24763.WOLF].length > 0 && mss.push([yolo24881.units[yolo24763.WOLF], 5, "#ff0000"]);
        yolo24881.units[yolo24763.SPIDER].length > 0 && mss.push([yolo24881.units[yolo24763.SPIDER], 10, "#ff0000"]);
        yolo24881.units[yolo24763.FOX].length > 0 && mss.push([yolo24881.units[yolo24763.FOX], 5, "#000000"]);
        yolo24881.units[yolo24763.BEAR].length > 0 && mss.push([yolo24881.units[yolo24763.BEAR], 10, "#000000"]);
        yolo24881.units[yolo24763.DRAGON].length > 0 && mss.push([yolo24881.units[yolo24763.DRAGON], 10, "#7ecccb"]);
        yolo24881.units[yolo24763.RABBIT].length > 0 && mss.push([yolo24881.units[yolo24763.RABBIT], 5, "#ee97c0"]);
        if (mss.length > 0) {
            for (ms in mss) {
                for (m in mss[ms][0]) {
                    z = distanceCAL(yolo24881.yolo24845[user.uid], mss[ms][0][m]);
                    z = z > 900 ? 900 : z;
                    if(z>200)draw_Line_Update(yolo24881.yolo24845[user.uid], mss[ms][0][m], mss[ms][1], mss[ms][2], z / 1000);
                }
            }
        }
    }
}

function draw_ToolArc() {
    var wPlayers = yolo24881.units[yolo24763.PLAYERS];
    if (tDraw && yolo24881 && wPlayers.length > 0) {
        for (var wPlayer in wPlayers) {
            switch (wPlayers[wPlayer].right) {
                case yolo24818.PICK:
                case yolo24818.PICK_GOLD:
                case yolo24818.PICK_DIAMOND:
                case yolo24818.PICK_WOOD:
                case yolo24818.PICK_AMETHYST:
                    draw_Arc_Update(wPlayers[wPlayer], MyArc[yolo24818.PICK]);
                    break;
                case yolo24818.SWORD:
                case yolo24818.SWORD_GOLD:
                case yolo24818.SWORD_DIAMOND:
                case yolo24818.SWORD_AMETHYST:
                    draw_Arc_Update(wPlayers[wPlayer], MyArc[yolo24818.SWORD]);
                    break;
                case yolo24818.SPEAR:
                case yolo24818.GOLD_SPEAR:
                case yolo24818.DIAMOND_SPEAR:
                case yolo24818.AMETHYST_SPEAR:
                    draw_Arc_Update(wPlayers[wPlayer], MyArc[yolo24818.SPEAR]);
                    break;
                case yolo24818.HAMMER:
                case yolo24818.HAMMER_GOLD:
                case yolo24818.HAMMER_DIAMOND:
                case yolo24818.HAMMER_AMETHYST:
                    draw_Arc_Update(wPlayers[wPlayer], MyArc[yolo24818.HAMMER]);
                    break;

            }
        }
    }
}

function draw_HurtMobs() {
    var mss = [];
    var ms, m;
    var z;
    if (mDraw && yolo24881) {
        yolo24881.units[yolo24763.WOLF].length > 0 && mss.push([yolo24881.units[yolo24763.WOLF], MyArc[yolo24818.HURT_WOLF]]);
        yolo24881.units[yolo24763.SPIDER].length > 0 && mss.push([yolo24881.units[yolo24763.SPIDER], MyArc[yolo24818.HURT_SPIDER]]);
        yolo24881.units[yolo24763.FOX].length > 0 && mss.push([yolo24881.units[yolo24763.FOX], MyArc[yolo24818.HURT_FOX]]);
        yolo24881.units[yolo24763.BEAR].length > 0 && mss.push([yolo24881.units[yolo24763.BEAR], MyArc[yolo24818.HURT_BEAR]]);
        yolo24881.units[yolo24763.DRAGON].length > 0 && mss.push([yolo24881.units[yolo24763.DRAGON], MyArc[yolo24818.HURT_DRAGON]]);
        yolo24881.units[yolo24763.RABBIT].length > 0 && mss.push([yolo24881.units[yolo24763.RABBIT], MyArc[yolo24818.HURT_RABBIT]]);
        if (mss.length > 0) {
            for (ms in mss) {
                for (m in mss[ms][0]) {
                    draw_Arc_Update(mss[ms][0][m], mss[ms][1]);
                }
            }
        }
    }
}

var TimeSubSub = function () { //游戏时间计时器
    if (yolo24881 && yolo24881.transition) {
        dayTime = 2400;
    }
    if (dayTime) {
        dayTime--;
    }
};

function fnkeyup(event) { //快捷聊天
    if (!user.chat.open) {
        switch (event.keyCode) {
            case 97: //1
                yolo24802.yolo24801("別打");
                break;
            case 98: //2
                yolo24802.yolo24801("やめて");
                break;
            case 99: //3
                yolo24802.yolo24801("pls don't kill me");
                break;
            case 100: //4
                yolo24802.yolo24801("對不起");
                break;
            case 101: //5
                yolo24802.yolo24801("ごめん");
                break;
            case 102: //6
                yolo24802.yolo24801("sorry");
                break;
            case 103: //7
                yolo24802.yolo24801("嗨");
                break;
            case 104: //8
                yolo24802.yolo24801("ども");
                break;
            case 105: //9
                yolo24802.yolo24801("hi");
                break;
            case 111: // /
                yolo24802.yolo24801("距" + (yolo24881.time ? "日出" : "日落") + "还有" + Math.floor(dayTime / 10) + "秒!");
                break;
            case 106: // *
                yolo24802.yolo24801((yolo24881.time ? "日の出" : "日没") + "まであと" + Math.floor(dayTime / 10) + "秒");
                break;
            case 109: // -
                yolo24802.yolo24801("form the " + (yolo24881.time ? "sunrise" : "sunset") + " there are " + Math.floor(dayTime / 10) + " seconds!");
                break;
            case 46: //dlete
                tDraw = !tDraw;
                if (user) user.alert.text = user.alert.text ? user.alert.list.push("显示攻击范围:" + (tDraw ? "开启" : "关闭")) : user.alert.text = "显示攻击范围:" + (tDraw ? "开启" : "关闭");
                break;
            case 35: // end
                mDraw = !mDraw;
                if (user) user.alert.text = user.alert.text ? user.alert.list.push("显示怪物视野:" + (mDraw ? "开启" : "关闭")) : user.alert.text = "显示怪物视野:" + (mDraw ? "开启" : "关闭");
                break;
            case 45: // insert
                fFind = !fFind;
                if (user) user.alert.text = user.alert.text ? user.alert.list.push("浆果引导线:" + (fFind ? "开启" : "关闭")) : user.alert.text = "浆果引导线:" + (fFind ? "开启" : "关闭");
                break;
            case 36: // home
                bFind = !bFind;
                if (user) user.alert.text = user.alert.text ? user.alert.list.push("篝火引导线:" + (bFind ? "开启" : "关闭")) : user.alert.text = "篝火引导线:" + (bFind ? "开启" : "关闭");
                break;
            case 33: // pgup
                mFind = !mFind;
                if (user) user.alert.text = user.alert.text ? user.alert.list.push("怪物引导线:" + (mFind ? "开启" : "关闭")) : user.alert.text = "怪物引导线:" + (mFind ? "开启" : "关闭");
                break;
                /*default:
				    console.log(event.keyCode);
				    break;*/
        }
    }
}
//=====================================================================
console.log("===开始载入,等待加载完毕===");
window.addEventListener("load", function () {
    console.log("===开始加载MOD===");
    initVal();
    //Eng2Chs();
    ModsLoader();
    console.log("===快捷聊天Mod===");
    window.addEventListener("keyup", fnkeyup, !1);
    console.log("===启动游戏计时器===");
    var t1 = window.setInterval(TimeSubSub, 100);
    console.log("Mod Ver " + modVer + " 加载完毕,可以开始游戏!");
    if (user) user.alert.text = user.alert.text ? user.alert.list.push("Mod Ver " + modVer + " 加载完毕,可以开始游戏!") : user.alert.text = "Mod Ver " + modVer + " 加载完毕,可以开始游戏!";
}, false);