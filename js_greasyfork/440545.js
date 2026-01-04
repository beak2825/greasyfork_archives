'use strict';
(function() {
 function render() {
   value = document["createElement"]("input");
   value["type"] = "button";
   value["style"]["backgroundColor"] = "#FF0000";
   value["style"]["color"] = "#AAAAAA";
   value["style"]["position"] = "absolute";
   value["style"]["top"] = "30px";
   value["style"]["right"] = "100px";
   value["style"]["width"] = "30px";
   value["style"]["height"] = "30px";
   value["style"]["outline"] = "none";
   value["innerHTML"] = "TroughWall Hack";
   document["getElementsByTagName"]("body")[0]["appendChild"](value);
   var el = document["createElement"]("p");
   el["style"]["position"] = "absolute";
   el["style"]["top"] = "20px";
   el["style"]["right"] = "150px";
   el["innerHTML"] = "Teleport Hack (\u0442\u0435\u043b\u0435\u043f\u043e\u0440\u0442)";
   document["getElementsByTagName"]("body")[0]["appendChild"](el);
   args = document["createElement"]("input");
   args["type"] = "button";
   args["style"]["backgroundColor"] = "#FF0000";
   args["style"]["color"] = "#AAAAAA";
   args["style"]["position"] = "absolute";
   args["style"]["top"] = "80px";
   args["style"]["right"] = "100px";
   args["style"]["width"] = "30px";
   args["style"]["height"] = "30px";
   args["style"]["outline"] = "none";
   args["innerHTML"] = "noFog Hack";
   document["getElementsByTagName"]("body")[0]["appendChild"](args);
   var node = document["createElement"]("p");
   node["style"]["position"] = "absolute";
   node["style"]["top"] = "70px";
   node["style"]["right"] = "150px";
   node["innerHTML"] = "noFog Hack (\u043d\u043e\u0447\u043d\u043e\u0435 \u0432\u0438\u0434\u0435\u043d\u0438\u0435)";
   document["getElementsByTagName"]("body")[0]["appendChild"](node);
   config = document["createElement"]("input");
   config["type"] = "range";
   config["min"] = 0;
   config["max"] = 1;
   config["step"] = 0.01;
   config["value"] = 0.5;
   config["style"]["position"] = "absolute";
   config["style"]["top"] = "130px";
   config["style"]["right"] = "100px";
   document["getElementsByTagName"]("body")[0]["appendChild"](config);
   var img = document["createElement"]("p");
   img["style"]["position"] = "absolute";
   img["style"]["top"] = "115px";
   img["style"]["right"] = 100 + 150 + "px";
   img["innerHTML"] = "CloudOpacity (\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u043e\u0431\u043b\u0430\u043a\u043e\u0432)";
   document["getElementsByTagName"]("body")[0]["appendChild"](img);
   data = document["createElement"]("input");
   data["type"] = "range";
   data["min"] = 0;
   data["max"] = 1;
   data["step"] = 0.01;
   data["value"] = 0.5;
   data["style"]["position"] = "absolute";
   data["style"]["top"] = "180px";
   data["style"]["right"] = "100px";
   data["style"]["height"] = 50;
   document["getElementsByTagName"]("body")[0]["appendChild"](data);
   var PL$67 = document["createElement"]("p");
   PL$67["style"]["position"] = "absolute";
   PL$67["style"]["top"] = "165px";
   PL$67["style"]["right"] = 100 + 150 + "px";
   PL$67["innerHTML"] = "SwampOpacity (\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u0431\u043e\u043b\u043e\u0442\u0430)";
   document["getElementsByTagName"]("body")[0]["appendChild"](PL$67);
   result = document["createElement"]("input");
   result["type"] = "range";
   result["min"] = 0;
   result["max"] = 1;
   result["step"] = 0.01;
   result["value"] = 0.5;
   result["style"]["position"] = "absolute";
   result["style"]["top"] = "230px";
   result["style"]["right"] = "100px";
   result["style"]["height"] = 50;
   document["getElementsByTagName"]("body")[0]["appendChild"](result);
   var elem = document["createElement"]("p");
   elem["style"]["position"] = "absolute";
   elem["style"]["top"] = "215px";
   elem["style"]["right"] = 100 + 150 + "px";
   elem["innerHTML"] = "LavaOpacity (\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u043b\u0430\u0432\u044b)";
   document["getElementsByTagName"]("body")[0]["appendChild"](elem);
   val = document["createElement"]("input");
   val["type"] = "range";
   val["min"] = 0.01;
   val["max"] = 1;
   val["step"] = 0.01;
   val["value"] = 1;
   val["style"]["position"] = "absolute";
   val["style"]["top"] = "280px";
   val["style"]["right"] = "100px";
   document["getElementsByTagName"]("body")[0]["appendChild"](val);
   var body = document["createElement"]("p");
   body["style"]["position"] = "absolute";
   body["style"]["top"] = "265px";
   body["style"]["right"] = 100 + 200 + "px";
   body["innerHTML"] = "Zoom (\u043f\u043e\u043b\u0435 \u0437\u0440\u0435\u043d\u0438\u044f)";
   document["getElementsByTagName"]("body")[0]["appendChild"](body);
   options = document["createElement"]("input");
   options["type"] = "button";
   options["style"]["backgroundColor"] = "#FF0000";
   options["style"]["color"] = "#AAAAAA";
   options["style"]["position"] = "absolute";
   options["style"]["top"] = "330px";
   options["style"]["right"] = "100px";
   options["style"]["width"] = "30px";
   options["style"]["height"] = "30px";
   options["style"]["outline"] = "none";
   options["innerHTML"] = "respawn Hack";
   document["getElementsByTagName"]("body")[0]["appendChild"](options);
   var o = document["createElement"]("p");
   o["style"]["position"] = "absolute";
   o["style"]["top"] = "315px";
   o["style"]["right"] = "150px";
   o["innerHTML"] = "instant respawn (\u043c\u0433\u043d\u043e\u0432\u0435\u043d\u043d\u043e\u0435 \u0432\u043e\u0437\u0440\u043e\u0436\u0434\u0435\u043d\u0438\u0435)";
   document["getElementsByTagName"]("body")[0]["appendChild"](o);
   element = document["createElement"]("input");
   element["type"] = "button";
   element["style"]["backgroundColor"] = "#FF0000";
   element["style"]["color"] = "#AAAAAA";
   element["style"]["position"] = "absolute";
   element["style"]["top"] = "380px";
   element["style"]["right"] = "100px";
   element["style"]["width"] = "30px";
   element["style"]["height"] = "30px";
   element["style"]["outline"] = "none";
   element["innerHTML"] = "random emote";
   document["getElementsByTagName"]("body")[0]["appendChild"](element);
   var element = document["createElement"]("p");
   element["style"]["position"] = "absolute";
   element["style"]["top"] = "365px";
   element["style"]["right"] = "150px";
   element["innerHTML"] = "random emote(\u0441\u043f\u0430\u043c \u0441\u043c\u0430\u0439\u043b\u0438\u043a\u0430\u043c\u0438)";
   document["getElementsByTagName"]("body")[0]["appendChild"](element);
   var params = document["createElement"]("p");
   params["style"]["position"] = "absolute";
   params["style"]["top"] = "430px";
   params["style"]["right"] = "50px";
   params["color"] = "#FF0000";
   params["innerHTML"] = "Update 2.0. Contact: https://vk.com/hacker1513(developer)";
   document["getElementsByTagName"]("body")[0]["appendChild"](params);
   var styles = document["createElement"]("pre");
   styles["style"]["position"] = "absolute";
   styles["style"]["top"] = "480px";
   styles["style"]["right"] = "0px";
   styles["color"] = "#FF0000";
   styles["innerHTML"] = "LOG: \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u0440\u0435\u0433\u0443\u043b\u0438\u0440\u043e\u0432\u043a\u0438 \u043f\u043e\u043b\u0437\u0443\u043d\u043a\u0430 \u043c\u043e\u0436\u043d\u043e \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u0441\u0440\u0435\u0434\u044b,\n                       \u0447\u0442\u043e \u0434\u0430\u0435\u0442 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u0432\u0438\u0434\u0435\u0442\u044c \u043f\u043e\u0434 \u0432\u043e\u0434\u043e\u0439, \u0432 \u0431\u043e\u043b\u043e\u0442\u0435 \u0438 \u0432 \u043b\u0430\u0432\u0435, \u0438 \u043d\u0430\u0439\u0442\u0438 \u043f\u0442\u0438\u0446\u0443.\n                       \u0422\u0435\u043b\u0435\u043f\u043e\u0440\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0441 \u0434\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0439 \u0437\u0430\u0434\u0435\u0440\u0436\u043a\u043e\u0439.\n                       \u0423\u0434\u0430\u043b\u0435\u043d\u0430 \u0440\u0435\u043a\u043b\u0430\u043c\u0430 \u0438 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d \u0441\u043a\u0440\u043e\u043b\u043b\u0435\u0440 \u0437\u0443\u043c\u0430.\n                       ";
   document["getElementsByTagName"]("body")[0]["appendChild"](styles);
   active = true;
 }
 function reconnectToWebsocket() {
   render();
   setInterval(onTouchStart, 10);
 }
 function onTouchStart() {
   args["onclick"] = function() {
     json = recurse(json);
     if (json == true) {
       args["style"]["backgroundColor"] = "#7FFF00";
     } else {
       if (json == false) {
         args["style"]["backgroundColor"] = "#FF0000";
       }
     }
   };
   value["onclick"] = function() {
     newObj = recurse(newObj);
     if (newObj == true) {
       value["style"]["backgroundColor"] = "#7FFF00";
     } else {
       if (newObj == false) {
         value["style"]["backgroundColor"] = "#FF0000";
       }
     }
   };
   attributes["onclick"] = function() {
     out = recurse(out);
     if (out == true) {
       attributes["style"]["backgroundColor"] = "#7FFF00";
     } else {
       if (out == false) {
         attributes["style"]["backgroundColor"] = "#FF0000";
       }
     }
   };
   options["onclick"] = function() {
     id = recurse(id);
     if (id == true) {
       options["style"]["backgroundColor"] = "#7FFF00";
     } else {
       if (id == false) {
         options["style"]["backgroundColor"] = "#FF0000";
       }
     }
   };
   if (gameServer["connected"] && !activating && active) {
     start();
     activating = true;
   }
   if (out) {
     setSlideNumber();
   }
   isAnySwipeMenuOpen();
   build();
 }
 function recurse(source) {
   if (source == true) {
     return false;
   } else {
     if (source == false) {
       return true;
     }
   }
 }
 function setSlideNumber() {
   gameServer["emit"](socketMsgType["EMOTE"], {
     emoteId : Math["floor"](Math["random"]() * 15)
   });
 }
 function isAnySwipeMenuOpen() {
   if (json == true) {
     visionType = 1;
   } else {
     visionType = 0;
   }
 }
 function build() {
   if (newObj == true) {
     gameServer["emit"]("game:stucked");
   }
 }
 function start() {
   function init(options) {
     if (options["inHide"] == false) {
       options["moveSpeed"]["x"] += 300 * game["deltaTime"] * options["flySide"];
       if (options["moveSpeed"]["x"] > 500) {
         options["moveSpeed"]["x"] -= abs(350 * game["deltaTime"] * options["flySide"]);
       } else {
         if (options["moveSpeed"]["x"] < -500) {
           options["moveSpeed"]["x"] += abs(350 * game["deltaTime"] * options["flySide"]);
         }
       }
       if (options["moveSpeed"]["y"] > 500 && options["name"] != "chicken") {
         options["moveSpeed"]["y"] = 500;
       }
     }
     if (options["flySide"] == 0) {
       var x = abs(options["moveSpeed"]["x"]) * 0.7 * game["deltaTime"];
       if (options["moveSpeed"]["x"] < 0) {
         options["moveSpeed"]["x"] += x;
       } else {
         options["moveSpeed"]["x"] -= x;
       }
     }
     if (options["inHide"]) {
       if (game["time"] - options["inHideTime"] > 500) {
         options["visible"] = true;
       }
       options["moveSpeed"]["x"] = 0;
       options["moveSpeed"]["y"] = 0;
     }
     if (!options["inHide"]) {
       options["visible"] = true;
     }
     if (options["invisibleTime"] > game["time"]) {
       var root = checkFoodChain(game["me"], options);
       if (root["check"] == 1 || root["check"] == -1) {
         options["opacity"] = 0;
       } else {
         options["opacity"] = 0.2;
       }
     } else {
       options["opacity"] = 1;
     }
     if (options["inHide"] == true) {
       if (typeof options["interpolateTo"]["x"] != "undefined" || typeof options["interpolateTo"]["y"] != "undefined") {
         game["interpolatePosition"](options);
       }
       return false;
     }
   }
   function create(props) {
     document["body"]["appendChild"](document["createElement"]("script"))["innerHTML"] = props["toString"]()["replace"](/([\s\S]*?return;){2}([\s\S]*)}/, "$2");
   }
   alert("GameServer injected");
   Engine["prototype"]["drawObject"] = function(params, saParity) {
     this["zoom"] = val["value"];
     if (typeof saParity == "undefined") {
       saParity = false;
     }
     if (params["animation"] != undefined && typeof params["animations"][params["animation"]] != "undefined") {
       this["updateFrames"](params);
       var name = params["animations"][params["animation"]]["sprites"][params["animationFrame"] % params["animations"][params["animation"]]["sprites"]["length"]];
       if (params["skin"] != undefined && this["objectsDef"][params["name"]]["skinsLoaded"][params["skin"]] == true) {
         name = name + "_" + params["skin"];
       }
       var data = this["sprites"][name];
       if (data && data["loaded"]) {
         if (data["name"] == "cloud1" || data["name"] == "cloud2" || data["name"] == "cloud3" || data["name"] == "cloud4" || data["name"] == "cloud5" || data["name"] == "cloud6") {
           params["opacity"] = config["value"];
         }
         if (data["name"] == "swamp" || data["name"] == "Swamp") {
           params["opacity"] = data["value"];
         }
         if (data["name"] == "lava" || data["name"] == "Lava") {
           params["opacity"] = result["value"];
         }
         var value = 1;
         if (params["opacity"] != undefined) {
           value = params["opacity"];
         }
         if (data["flip"] && data["flipped"] != true) {
           var res = this["flipSprite"](data);
           if (res["flipped"]) {
             data = res;
             this["sprites"][name] = data;
             this["canvasToImageArr"]["push"](name);
           } else {
             return;
           }
         }
         var my = params == this["me"];
         if (params["outline"] != null) {
           var parent = params["outline"];
           var index = params["outlineWeight"];
           res = true;
           if (typeof this["sprites"][name + "_outline_" + parent] == "undefined") {
             res = this["createOutlineImage"](data, index, parent, true);
             if (res != null) {
               this["sprites"][name + "_outline_" + parent] = res;
               this["canvasToImageArr"]["push"](name + "_outline_" + parent);
             }
           }
           if (res != null) {
             this["drawSprite"](this["sprites"][name + "_outline_" + parent], params["position"]["x"] - index, params["position"]["y"] - index, params["height"] + index * 2, params["width"] + index * 2, {
               opacity : value,
               staticCanvas : saParity,
               ignoreOffset : my
             });
           }
         } else {
           this["drawSprite"](data, params["position"]["x"], params["position"]["y"], params["height"], params["width"], {
             opacity : value,
             staticCanvas : saParity,
             ignoreOffset : my
           });
         }
         if (params["fillColor"] != null) {
           parent = params["fillColor"];
           value = params["fillColorOpacity"];
           index = 0;
           res = true;
           if (typeof this["sprites"][name + "_fillColor_" + parent] == "undefined") {
             res = this["createOutlineImage"](data, 0, parent);
             if (res != null) {
               this["sprites"][name + "_fillColor_" + parent] = res;
               this["canvasToImageArr"]["push"](name + "_fillColor_" + parent);
             }
           }
           if (res != null) {
             this["drawSprite"](this["sprites"][name + "_fillColor_" + parent], params["position"]["x"] - index, params["position"]["y"] - index, params["height"] + index * 2, params["width"] + index * 2, {
               opacity : value,
               staticCanvas : saParity,
               ignoreOffset : my
             });
           }
         }
         if (params["lastState"] != undefined && params["lastState"] != params["animation"]) {
           params["lastState"] = params["animation"];
           params["animationFrame"] = 0;
         }
         if (saParity) {
           params["inStaticCanvas"] = true;
           params["lastDrawnCameraPosition"] = {
             x : this["camera"]["position"]["x"],
             y : this["camera"]["position"]["y"]
           };
           this["staticCanvasObjects"]["push"](params);
           var PL$13 = this["hashMap"]["retrieve"](params);
           var PL$17 = 0;
           for (; PL$17 < PL$13["length"]; PL$17++) {
             var B1064 = PL$13[PL$17];
             if (B1064["inStaticCanvas"] === true && (B1064["zIndex"] > params["zIndex"] || params["hasTransparency"] === true) && this["doesOverlap"](params, B1064)) {
               B1064["inStaticCanvas"] = false;
               var result_index__1066 = this["staticCanvasObjects"]["indexOf"](B1064);
               if (result_index__1066 !== -1) {
                 this["staticCanvasObjects"]["splice"](result_index__1066, 1);
               }
             }
           }
         }
       }
     }
     if (this["drawInterpolatePositions"] && params["moveable"]) {
       this["drawInterpolatePosition"](params);
     }
   };
   Engine["prototype"]["drawObjects"] = function() {
     if (!this["hashMap"]["ready"]) {
       return;
     }
     if (this["camera"]["holdOn"] != undefined && this["camera"]["holdOn"] != "FREE") {
       this["camera"]["position"]["x"] = this["camera"]["holdOn"]["getAllPositions"]()["center"]["x"];
       this["camera"]["position"]["y"] = this["camera"]["holdOn"]["getAllPositions"]()["center"]["y"];
     }
     var x = (this["camera"]["position"]["x"] - this["staticCanvasRenderPosition"]["x"]) * this["scaleX"] * this["zoom"] + this["staticCanvasRenderOffset"]["restX"];
     var m = (this["camera"]["position"]["y"] - this["staticCanvasRenderPosition"]["y"]) * this["scaleY"] * this["zoom"] + this["staticCanvasRenderOffset"]["restY"];
     if (abs(x) >= this["staticCanvasOffset"] / 2 || abs(m) >= this["staticCanvasOffset"] / 2) {
       var value = x % 1;
       var m60 = m % 1;
       this["staticContext"]["save"]();
       this["staticContext"]["imageSmoothingEnabled"] = false;
       this["staticContext"]["drawImage"](this["staticCanvas"], -x, m);
       this["staticContext"]["restore"]();
       this["staticContext"]["save"]();
       this["staticContext"]["fillStyle"] = "rgba(0,0,0,1)";
       if (x <= 0) {
         this["staticContext"]["fillRect"](0, 0, ceil(-x), this["staticCanvas"]["height"]);
       } else {
         this["staticContext"]["fillRect"](this["staticCanvas"]["width"] - ceil(x), 0, ceil(x), this["staticCanvas"]["height"]);
       }
       if (m >= 0) {
         this["staticContext"]["fillRect"](0, 0, this["staticCanvas"]["width"], ceil(m));
       } else {
         this["staticContext"]["fillRect"](0, this["staticCanvas"]["height"] - ceil(-m), this["staticCanvas"]["width"], ceil(-m));
       }
       this["staticContext"]["restore"]();
       if (value < 0) {
         if (value < -0.5) {
           value = value + 1;
         }
       } else {
         if (value > 0.5) {
           value = value - 1;
         }
       }
       if (m60 < 0) {
         if (m60 < -0.5) {
           m60 = m60 + 1;
         }
       } else {
         if (m60 > 0.5) {
           m60 = m60 - 1;
         }
       }
       this["staticCanvasRenderOffset"]["restX"] = value;
       this["staticCanvasRenderOffset"]["restY"] = m60;
       this["staticCanvasRenderOffset"]["x"] = this["staticCanvasRenderOffset"]["restX"];
       this["staticCanvasRenderOffset"]["y"] = this["staticCanvasRenderOffset"]["restY"];
       this["staticCanvasRenderPosition"]["x"] += this["camera"]["position"]["x"] - this["staticCanvasRenderPosition"]["x"];
       this["staticCanvasRenderPosition"]["y"] += this["camera"]["position"]["y"] - this["staticCanvasRenderPosition"]["y"];
     } else {
       this["staticCanvasRenderOffset"]["x"] = x;
       this["staticCanvasRenderOffset"]["y"] = m;
     }
     var i = this["staticCanvasObjects"]["length"] - 1;
     for (; i >= 0; i--) {
       var data = this["staticCanvasObjects"][i];
       if (this["goesOutScreen"](data) && (abs(data["lastDrawnCameraPosition"]["x"] - this["camera"]["position"]["x"]) >= this["staticCanvasOffset"] / 2 / this["scaleX"] / this["zoom"] || abs(data["lastDrawnCameraPosition"]["y"] - this["camera"]["position"]["y"]) >= this["staticCanvasOffset"] / 2 / this["scaleY"] / this["zoom"])) {
         data["inStaticCanvas"] = false;
         this["staticCanvasObjects"]["splice"](i, 1);
       }
     }
     this["beforeDrawAllObjects"]();
     var o = sortBy2Properties(this["hashMap"]["retrieveVisibleByClient"](this), "zIndex", "id");
     i = 0;
     for (; i < o["length"]; i++) {
       data = o[i];
       if (data["visible"] && this["isVisible"](this["camera"], data, this["originalWidth"] / 2, this["originalHeight"] / 2)) {
         this["context"]["save"]();
         var artistTrack = false;
         if (data["staticCanvas"] === true) {
           if (data["inStaticCanvas"] === true) {
             continue;
           }
           artistTrack = true;
         }
         this["beforeDrawObject"](data, artistTrack);
         this["drawObject"](data, artistTrack);
         this["afterDrawObject"](data, artistTrack);
         this["context"]["restore"]();
       }
     }
     this["afterDrawAllObjects"]();
     if (this["drawColliders"]) {
       i = 0;
       for (; i < o["length"]; i++) {
         data = o[i];
         if (data["visible"] && this["isVisible"](this["camera"], data, this["originalWidth"] / 2, this["originalHeight"] / 2) && data["isCollider"]) {
           this["drawCollider"](data);
         }
       }
     }
     this["context"]["save"]();
     this["context"]["imageSmoothingEnabled"] = false;
     this["context"]["drawImage"](this["staticCanvas"], this["staticCanvasOffset"] + this["staticCanvasRenderOffset"]["x"], this["staticCanvasOffset"] - this["staticCanvasRenderOffset"]["y"], this["staticCanvas"]["width"] - this["staticCanvasOffset"] * 2, this["staticCanvas"]["height"] - this["staticCanvasOffset"] * 2, 0, 0, this["canvas"]["width"], this["canvas"]["height"]);
     this["context"]["drawImage"](this["dynamicCanvas"], 0, 0);
     this["context"]["restore"]();
     var B160 = Date["now"]();
     for (; this["fpsTimes"]["length"] > 0 && this["fpsTimes"][0] <= B160 - 1000;) {
       this["fpsTimes"]["shift"]();
     }
     this["fpsTimes"]["push"](B160);
     this["fps"] = this["fpsTimes"]["length"];
     if (this["time"] - this["lastConvertToImageTime"] > 750 - this["canvasToImageArr"]["length"] * 2) {
       this["convertSpriteCanvasToImage"]();
       this["lastConvertToImageTime"] = this["time"];
     }
   };
   Engine["prototype"]["deleteObject"] = function(data, wholeentry) {
     if (this["client"] && typeof data == "undefined") {
       return;
     }
     if (typeof wholeentry == "undefined") {
       this["onDeleteObject"](data);
     } else {
       this["onDeleteObject"](data, wholeentry);
     }
     var index = this["needUpdateObjectsArr"]["indexOf"](data);
     if (index !== -1) {
       this["needUpdateObjectsArr"]["splice"](index, 1);
     }
     index = this["gameObjects"]["indexOf"](data);
     if (index !== -1) {
       this["gameObjects"]["splice"](index, 1);
     }
     var i = 0;
     for (; i < data["inCells"]["length"]; i++) {
       var PL$83 = this["hashMap"]["map"][data["inCells"][i]];
       var PL$40 = 0;
       for (; PL$40 < PL$83["length"]; PL$40++) {
         index = PL$83["indexOf"](data);
         if (index !== -1) {
           PL$83["splice"](index, 1);
         }
       }
     }
     delete this["fastArrayGameObjects"][data["id"]];
     data["deleted"] = true;
   };
   gameServer["on"]("game:dead", function start(doItNow) {
     if (id) {
       lastDrawnExperience = 0;
       gameServer["emit"]("game:join", {
         nick : name,
         saveKey : saveKey,
         version : version,
         adblockDisabled : adblockDisabled,
         userData : user,
         startBonus : startBonus
       });
       imDead = false;
       $("#vdo_ai_div")["remove"]();
       $(".endGame")["css"]("display", "none");
       $(".btnPlayAgain")["css"]("display", "none");
       $(".btnPlayAgain")["css"]("opacity", "0");
       $(".btnPlayAgainBonus")["css"]("display", "none");
       $(".btnPlayAgainBonus")["css"]("opacity", "0");
     }
   });
   create(Engine["prototype"]["drawObject"]);
   create(init);
   create(Engine["prototype"]["drawObjects"]);
   create(Engine["prototype"]["deleteObject"]);
 }
 var GS = gameServer;
 var json = false;
 var newObj = false;
 var id = false;
 var out = false;
 var value;
 var args;
 var attributes;
 var options;
 var config;
 var data;
 var result;
 var val;
 var activating = false;
 var active = false;
 setTimeout(reconnectToWebsocket, 5000);
 alert("Hack loaded");
})();