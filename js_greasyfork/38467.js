// ==UserScript==
// @name         CellBots.ML-Client
// @namespace    Patched Service!
// @version      3.2
// @description  www.CellBots.ML
// @author       (Owner FreetzYT)
// @match        http://germs.io/*
// @match        http://agar.bio/*
// @match        http://cellcraft.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38467/CellBotsML-Client.user.js
// @updateURL https://update.greasyfork.org/scripts/38467/CellBotsML-Client.meta.js
// ==/UserScript==
// Bots Working on // Agar.Bio , Play.agario0.com , galx.io , cellcraft.io //
(function() {
    "use strict";
    window["bot"] = {
        x: 0,
        y: 0,
        ip: null,
        byteLength: 0
    };
    WebSocket["prototype"]["Asend"] = WebSocket["prototype"]["send"];
    WebSocket["prototype"]["send"] = function(a) {
        this.Asend(a);
        var b = new DataView(a);
        if (b["byteLength"] === 21) {
            if (b["getInt8"](0, true) === 16) {
                bot["x"] = b["getFloat64"](1, true);
                bot["y"] = b["getFloat64"](9, true);
                bot["byteLength"] = b["byteLength"]
            }
        };
        if (b["byteLength"] === 13) {
            if (b["getUint8"](0, true) === 16) {
                bot["x"] = b["getInt32"](1, true);
                bot["y"] = b["getInt32"](5, true);
                bot["byteLength"] = b["byteLength"]
            }
        };
        if (b["byteLength"] === 5 || b["byteLength"] < 4) {
            if (b["getUint8"](0, true) === 16) {
                bot["x"] = b["getInt16"](1, true);
                bot["y"] = b["getInt16"](3, true);
                bot["byteLength"] = b["byteLength"]
            }
        };
        if (this["url"] !== null) {
            bot["ip"] = this["url"];
            console["log"](bot["ip"])
        }
    };
    var c = io["connect"]("ws://cellbots.ddns.net:8082"); 
    document["addEventListener"]("keydown", function(a) {
        var b = a["keyCode"] || a["which"];
        switch (b) {
            case 69:
                c["emit"]("split");
                break;
            case 82:
                c["emit"]("eject");
                break;
            case 67:
                c["emit"]("spam");
                break
        }
    });
    setInterval(function() {
        c["emit"]("movement", {
            x: bot["x"],
            y: bot["y"],
            byteLength: bot["byteLength"]
        })
    }, 100);
    window["start"] = function() {
        c["emit"]("start", {
            ip: bot["ip"] !== null ? bot["ip"] : 0,
            origin: location["origin"]
        })
    };
    setTimeout(function() {
        $("#canvas")["after"]("<div id='divContainer' style='display: table; position: relative;top: 50px;left: 10px;font-family:Arial;color: rgb(255, 255, 255);     box-shadow: 10px 10px 5px  rgba(0, 0, 0, 0.6) ;          z-index: 9999;border-radius: 0px;min-width: 200px;background-color: rgba(0, 0, 0, 0.6); border-radius: 3px; border: 2px solid blue; '><div style='display:table-cell;padding: 0px 3px 0px 5px;'><div id='gbots-header' style='font-size: 14px;margin: 5px 0px 3px 0px; left: 50px;  text-align: center;'>CellBots.ML--Client<span style='font-size: 20px; '><span style='font-size: 20px;'><span class='hide' id='position'>  </div> <div id='gbots-dl' style='display: block; padding: 10px 0px; border-top: 1px solid rgba(255, 255, 255, 0.85098); width: auto; margin-left: auto; margin-right: 10px; text-align: left; font-size: 20px;'><i class='' style='font-size: 14px;margin-right: 2px;color:#bbb;'></i> <span id='' style='color:#bbb;'></span></div><a id='gbots-link-btn' class='' href='http://cellbots.ml/' id='position' target='_blank' style='display: block; color: rgb(255, 255, 0); background-color: rgb(92, 184, 92); border-color: rgb(0, 0, 0); border-radius: 4px; font-size: 13px; padding: 2px; text-align: center; margin: -12px 0px 6px; font-weight: bold; text-shadow: rgb(0, 0, 0) 0px 0px 2px;'>Bots : [ <span style='color: white;' id='minionCount'>Waiting...<span style='color:#ff8a8a;'></span></span> ]</a><div id='gbots-header' style='font-size: 13px;margin: 8px 0px 8px 0px;'> <span style='font-size: 15px;'><span style='font-size: 10px; text-decoration: underline;text-shadow: 2px 2px #ff0000;'></span><div style='font-size: 13px'>Start Bots : <button id='start-bots' style='color: green;'>Start</button> </span><div><br></span></span><div style='font-size: 13px'>Bot Controls : <span id=''><span style='color:#ff8a8a;'></span></span><br></span>Split [<span><span style='color:#ff8a8a;'> E </span>] </span><br></span>Eject [<span><span style='color:#ff8a8a;'> R </span>] </span><br></span>ChatSpam [<span><span style='color:#ff8a8a;'> C </span>]</span><br><span id=''><span style='color:orange;'></span> <span style='color: orange; opacity: 0.6;' class='from-control' id='position'>-----------------------------------------------</span><div></span><div id='gbots-header' style='font-size: 13px;margin: 8px 0px 8px 0px;'> <span style='font-size: 15px;'><span style='font-size: 10px; text-decoration: underline;text-shadow: 2px 2px #ff0000;'></span><div style='font-size: 13px'><div style='font-size: 16px'><marquee>www.CellBots.ML</marquee></div><span style='color:#ff8a8a;'></span><br><span style='color: orange; opacity: 0.6;' class='from-control' id='position'>--------------------------------------------</span><br></span><span><span style='color: gold; '>Working on : </span></span><a style='color: white' href='http://cellcraft.io/'><span>CellCraft.io</span></a><span><span style='color: gold; '></span>,</span><br><a style='color: white' href='http://Agor.Bio/'><span>Agar.Bio</span></a><span><span style='color: gold; '></span><br></span><a style='color: white' href=''><span></span></a><span><span style='color: gold; '></span><a style='color: white' href=''><span></span></a></span><span><span style='color: gold; '></span><a style='color: white;' href=''><span></span></a></span><span><span style='color: gold; '></span><br></span><span><a style='color: white;' href=''><span></span></a><span style='color: gold;  '></span>");
        document["getElementById"]("start-bots")["onclick"] = function() {
            start()
        }
    }, 2000);
    c["on"]("botCount", function(a) {
        $("#minionCount")["html"](a)
    })
})()