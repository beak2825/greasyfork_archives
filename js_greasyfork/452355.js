// ==UserScript==
// @name        chicken mod
// @namespace   -
// @version     0.6
// @description :ratio: :points: :duck: :chicken:
// @author      me mega noob + another person
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/452355/chicken%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/452355/chicken%20mod.meta.js
// ==/UserScript==

var Cv = h;
window[Cv(0)] = Cv(1);
function h(a, W) {
  var M = H();
  return h = function (C, g) {
    C = C - 0;
    var r = M[C];
    return r;
  }, h(a, W);
}
function H() {
  var LG = ["chV", "V0.6", "#pingDisplay", "css", "top", "20px", "font-size", "15px", "display", "block", "body", "append", "createElement", "div", "prepend", "style", "position", "absolute", "textAlign", "left", "none", "width", "300px", "height", "145px", "backgroundColor", "rgb(0, 0, 0, 0.3)", "color", "white", "borderTopLeftRadius", "25px", "overflowY", "scroll", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius", "innerHTML", '\n<style>\n.indent {\nmargin-left: 10px;\n}\n::-webkit-scrollbar {\n-webkit-appearance: none;\nwidth: 10px;\n}\n::-webkit-scrollbar-thumb {\nborder-radius: 5px;\nbackground-color: rgba(0,0,0,.5);\n-webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);\n}\n</style>\n<h3 style="font-size: 20px;" class = "indent">Chicken V1</h3>\n<label for="autogrind" class="indent">AutoGrind: </label>\n<input type="checkbox" id="autogrind"><br>\n<label for="syncteam" class="indent">Team Sync: </label>\n<input type="checkbox" id="syncteam"><br>\n<label for="darkmode" class="indent">Dark Mode: </label>\n<input type="checkbox" id="darkmode" checked><br>\n<label for="visuals" class="indent">Visuals: </label>\n<input type="checkbox" id="visuals" checked><br>\n<label for="instachat" class="indent">Insta Chat: </label>\n<input type="text" id="instachat" maxlength="30" value = "pancake power">\n<input type="checkbox" id="doinstachat"checked><br><br>\n<div class="indent">\n<label for="upgradeType">AutoUpgrade: </label>\n<select id="upgradeType">\n<option value = "0" selected>DH</option>\n<option value = "1">PH</option>\n</select>\n<input type="checkbox" id="autoupgrade" checked><br>\n<label for="sixbuilding">6th Slot: </label>\n<select id="sixbuilding">\n<option value = "tele" selected>TP</option>\n<option value = "turret">Turret</option>\n<option value = "block">Blocker</option>\n<option value = "plat">Platform</option>\n</select>\n</div><br>\n<div class="indent">\n<label for="chatType">Song: </label>\n<select id="chatType">\n<option value = "0" selected>Taking Over - LOL</option>\n<option value = "1">Don\'t Stand of Close - Initial D</option>\n<option value = "2">Play with Fire - Sam Tinnesz (WIP)</option>\n<option value = "3">The Top - Initial D (WIP)</option>\n<option value = "4">Warriors - Imagine Dragons</option>\n</select>\n<br>\nPress "C" to start/stop song.\n</div>\n<p></p>\n', "getElementById", "setupCard", '<br>\n<input type = "password" id="password" placeholder = "Password" style="text-Align: center; font-size: 26px; margin-bottom: 16px;padding:6px;border: none;box-sizing:border-box;color: #4A4A4A;background-color: #e5e3e3; width: 100%;border-radius: 4px"></input>\n', "onbeforeunload", "exports", "call", "defineProperty", "undefined", "toStringTag", "Module", "__esModule", "object", "create", "default", "string", "bind", "prototype", "hasOwnProperty", "global", "hasBuffer", "isBuffer", "hasArrayBuffer", "isArray", "isArrayBuffer", "isView", "ArrayBuffer", "buffer", "alloc", "concat", "forEach", "length", "copy", "from", "write", "slice", "Array", "Buffer", "Uint8Array", "[object ", "toString", "createCodec", "install", "filter", "reduce", "options", "init", "apply", "uint8array", "bufferish", "preset", "ExtBuffer", "encode", "getWriteType", 'Unsupported type "', '": ', "setExtPackers", "name", "Object", "extPackers", "extEncoderList", "unshift", "constructor", "type", "read", "pow", "abs", "floor", "log", "LN2", "[object Array]", "TYPED_ARRAY_SUPPORT", "set", "subarray", "offset", "toNumber", "toJSON", "toArray", "toBuffer", "toArrayBuffer", "number", "byteLength", "Uint64BE", "Int64BE", "Uint64LE", "Int64LE", "nodeName", "readUint8", "decode", "getReadToken", "Invalid type: ", "setExtUnpackers", "extUnpackers", "EncodeBuffer", "codec", "FlexEncoder", "mixin", "Invalid typed array length", "__proto__", "If encoding is specified then the first argument must be a string", '"value" argument must not be a number', "'offset' is out of bounds", "'length' is out of bounds", "utf8", "isEncoding", '"encoding" must be a valid string encoding', "data", "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.", '"size" argument must be a number', '"size" argument must not be negative', "Attempt to allocate Buffer larger than maximum size: 0x", " bytes", "function", "ascii", "latin1", "binary", "utf-8", "ucs2", "ucs-2", "utf16le", "utf-16le", "hex", "base64", "toLowerCase", "indexOf", "lastIndexOf", "val must be string, number or Buffer", "readUInt16BE", "Invalid hex string", "substr", "push", "charCodeAt", "fromByteArray", "min", "fromCharCode", "SlowBuffer", "INSPECT_MAX_BYTES", "foo", "kMaxLength", "poolSize", "_augment", "species", "fill", "allocUnsafe", "allocUnsafeSlow", "_isBuffer", "compare", "Arguments must be Buffers", '"list" argument must be an Array of Buffers', "swap16", "Buffer size must be a multiple of 16-bits", "swap32", "Buffer size must be a multiple of 32-bits", "swap64", "Buffer size must be a multiple of 64-bits", "Unknown encoding: ", "equals", "Argument must be a Buffer", "inspect", "match", "join", " ... ", "<Buffer ", "out of range index", "includes", "Buffer.write(string, encoding, offset[, length]) is no longer supported", "Attempt to write outside buffer bounds", "_arr", "offset is not uint", "Trying to access beyond buffer length", '"buffer" argument must be a Buffer instance', '"value" argument is out of bounds', "Index out of range", "readUIntLE", "readUIntBE", "readUInt8", "readUInt16LE", "readUInt32LE", "readUInt32BE", "readIntLE", "readIntBE", "readInt8", "readInt16LE", "readInt16BE", "readInt32LE", "readInt32BE", "readFloatLE", "readFloatBE", "readDoubleLE", "readDoubleBE", "writeUIntLE", "writeUIntBE", "writeUInt8", "writeUInt16LE", "writeUInt16BE", "writeUInt32LE", "writeUInt32BE", "writeIntLE", "writeIntBE", "writeInt8", "writeInt16LE", "writeInt16BE", "writeInt32LE", "writeInt32BE", "writeFloatLE", "writeFloatBE", "writeDoubleLE", "writeDoubleBE", "targetStart out of bounds", "sourceStart out of bounds", "sourceEnd out of bounds", "encoding must be a string", "Out of range index", "Invalid code point", "toByteArray", "trim", "replace", "return this", "uint8", "reserve", "FlexDecoder", "BUFFER_SHORTAGE", "method not implemented: write()", "method not implemented: fetch()", "buffers", "flush", "pull", "fetch", "shift", "message", "start", "max", "maxBufferSize", "minBufferSize", "DecodeBuffer", "getReadFormat", "binarraybuffer", "int64", "usemap", "getExtUnpacker", "Invalid ext type: ", "listeners", "originalListener", "keys", "maxScreenWidth", "maxScreenHeight", "serverUpdateRate", "maxPlayers", "argv", "--largeserver", "maxPlayersHard", "collisionDepth", "minimapRate", "colGrid", "clientSendRate", "healthBarWidth", "healthBarPad", "reloadBarWidth", "iconPadding", "iconPad", "deathFadeout", "crownIconScale", "crownPad", "chatCountdown", "chatCooldown", "inSandbox", "mm_exp", "env", "VULTR_SCHEME", "maxAge", "gatherAngle", "gatherWiggle", "hitReturnRatio", "hitAngle", "playerScale", "playerSpeed", "playerDecel", "nameY", "skinColors", "#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "animalCount", "aiTurnRandom", "cowNames", "Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky", "shieldAngle", "weaponVariants", "fetchVariant", "weaponXP", "weaponIndex", "resourceTypes", "wood", "food", "stone", "points", "areaCount", "treesPerArea", "bushesPerArea", "totalRocks", "goldOres", "riverWidth", "riverPadding", "waterCurrent", "waveSpeed", "waveMax", "treeScales", "bushScales", "rockScales", "snowBiomeTop", "snowSpeed", "maxNameLength", "mapScale", "mapPingScale", "mapPingTime", "bin", "stringToBytes", "bytesToString", "loadedScript", "127.0.0.1", "hostname", "startsWith", "192.168.", "obj", "TextManager", "moomoo.io", "debugLog", "grecaptcha", "execute", "6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", "homepage", "then", "wss", "://", ":8008/?gameIndex=", "&token=", "connect", "onclick", "checkTrusted", "now", "hookTouchEvents", "https://krunker.io", "value", "party key", "location", "href", "/?server=", "classList", "contains", "showing", "remove", "innerText", "Settings", "add", "Close", "onload", "isLoaded", "src", "crosshair", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png", ".././img/icons/", ".png", "moo_name", "native_resolution", "true", "show_ping", "hidden", "moo_moosic", "cordova", "downloadButtonContainer", "mobileDownloadButtonContainer", "removeAllChildren", "weapons", "list", "generateElement", "actionBarItem", "display:none", "canvas", "getContext", "translate", "imageSmoothingEnabled", "webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "rotate", "iPad", "drawImage", "fillStyle", "rgba(0, 0, 70, 0.1)", "globalCompositeOperation", "source-atop", "fillRect", "backgroundImage", "url(", "toDataURL", ".././img/weapons/", "onmouseover", "globalAlpha", "ontouchstart", "preventDefault", "enter name", "currentTarget", "checked", "onchange", "target", "false", "error", "Vultr error:", "Error:\n", "disconnected", "setItem", "getItem", "lerpAngle", "roundRect", "beginPath", "moveTo", "arcTo", "closePath", "consent", "checkTerms", "#consentShake", "effect", "shake", "moofoll", "ad-container", "mainMenu", "enterGame", "promoImg", "partyButton", "joinPartyButton", "settingsButton", "getElementsByTagName", "span", "allianceButton", "storeButton", "chatButton", "gameCanvas", "serverBrowser", "nativeResolution", "showPing", "playMusic", "pingDisplay", "shutdownDisplay", "menuCardHolder", "guideCard", "loadingText", "gameUI", "actionBar", "scoreDisplay", "foodDisplay", "woodDisplay", "stoneDisplay", "killCounter", "leaderboardData", "nameInput", "itemInfoHolder", "ageText", "ageBarBody", "upgradeHolder", "upgradeCounter", "allianceMenu", "allianceHolder", "allianceManager", "mapDisplay", "diedText", "skinColorHolder", "storeMenu", "storeHolder", "noticationDisplay", "hats", "accessories", "#525252", "#3d3f42", "teams", "featuredYoutube", "me mega noob", "https://www.youtube.com/channel/UCVGAbDHHAi0DnG52HoX5ooA", "<a target='_blank' class='ytLink' href='", "link", "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> ", "</a>", "close", "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>", "onblur", "onfocus", "alive", "Captcha failed to load", "reload", "captchaCallback", "oncontextmenu", "servers", "games", "playerCount", "regionInfo", "<option disabled>", " - ", " players</option>", "index", "server", "region", "gameIndex", "stripRegion", "<option value='", "selected", "</option>", "<option disabled></option>", "<option disabled>All Servers - ", "sandbox.moomoo.io", "Back to MooMoo", "//moomoo.io/", "Try the sandbox", "//sandbox.moomoo.io/", "altServer", "<a href='", "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>", "onreadystatechange", "readyState", "status", "vultr", "parse", "responseText", "processServers", "Failed to load server data with status code:", "open", "GET", "/serverData", "send", "addEventListener", "change", "split", "switchServer", "pre-content-container", "cpmstarAPI", "game", "setTarget", "Failed to load video ad API", "RewardedVideoView", "rewardedvideo", "ad_closed", "Video ad closed", "loaded", "Video ad loaded", "show", "load_failed", "Video ad load failed", "load", "visible", "itemInfoName", "capitalizeFirst", "itemInfoDesc", "desc", "itemInfoReq", "secondary", "primary", "req", "<span class='itemInfoReqVal'> x", "</span>", "group", "limit", "itemInfoLmt", "itemCounts", "showPreAd", "notificationText", "notifButton", "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>", "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>", "team", "isOwner", "sid", "splice", "allianceItem", "color:", "#fff", "rgba(255,255,255,0.6)", "joinAlBtn", "Kick", "Join", "No Tribes Yet", "allianceButtonM", "width: 360px", "Delete Tribe", "Leave Tribe", "input", "text", "allianceInput", "unique name", "width: 140px;", "Create", "active", "scale", "update", "arc", "stroke", "tailIndex", "tails", "skinIndex", "skins", "dontSell", "storeDisplay", "storeItem", "img", "hatPreview", "../img/", "accessories/access_", "hats/hat_", "topSprite", "margin-top: 5px", "Unequip", "Equip", "Buy", "itemPrice", "price", "keydown", "keyCode", "200px", "25%", '\n    <style>\n    .indent {\n    margin-left: 10px;\n    }\n    ::-webkit-scrollbar {\n    -webkit-appearance: none;\n    width: 10px;\n    }\n    ::-webkit-scrollbar-thumb {\n    border-radius: 5px;\n    background-color: rgba(0,0,0,.5);\n    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);\n    }\n    </style>\n    <div id="manageUser" class="indent">\n    </div>\n    ', "d3NzOi8vY3ljbGljLQ==", "ZGVzY3JpcHRpdmUtY2FiYmFnZQ==", "LmdsaXRjaC5tZS93ZWJzb2NrZXQ=", "Not Connected to the Script Server", "#ff0000", "Enter Game", "#7ee559", "arrayBuffer", "msgpack", "lol", "manageUser", "\n            Name: ", "\n            ", "canmove", "\n                <button onclick=\"send(['freeze movement', [", ']])">FreezeMove</button>\n                ', "\n                <button onclick=\"send(['unfreeze movement', [", ']])">UnFreezeMove</button>\n                ', "canheal", "\n                <button onclick=\"send(['no heal', [", ']])">NoHeal</button>\n                ', "\n                <button onclick=\"send(['yes heal', [", ']])">YesHeal</button>\n                ', "cantTar", "\n                <button onclick=\"send(['no target', [", ']])">NoTarget</button>\n                ', "\n                <button onclick=\"send(['yes target', [", ']])">YesTarget</button>\n                ', "\n            <button onclick=\"send(['kick', [", ", '", "']])\">Kick</button>\n            ", "\n            <hr>\n            ", "power", "owner", "premium user", "<h1 style='font-size: 24px;'>Script Manager</h1>", "13c", "items", "inline-block", "devicePixelRatio", "<div class='skinColorItem activeSkin' style='background-color:", "' onclick='selectSkinColor(", ")'></div>", "<div class='skinColorItem' style='background-color:", "chatBox", "chatHolder", "chat message", "focus", "cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "fag", "bastard", "chatMessage", "innerWidth", "innerHeight", "setTransform", "touch", "stopPropagation", "changedTouches", "identifier", "buildIndex", "mousedown", "button", "autogrind", "auto bull spam", "atan2", "currentY", "startY", "currentX", "startX", "lockDir", "fixTo", "resize", "setUsingTouch", "touchmove", "pageX", "pageY", "touchstart", "scrollWidth", "touchend", "touchcancel", "touchleave", "mousemove", "clientX", "clientY", "mouseup", "rmd", "We at the top again, now what?", "Heavy lay the crown, but", "Count us", "Higher than the mountain", "And we be up here", "for the long run", "Strap in for a long one", "We got everybody on one", "Now you're coming at the king", "so you better not miss", "And we only get stronger", "With everthing I carry", "up on my back", "you should paint it up", "with a target", "Why would you dare me to", "do it again?", "Come get your spoiler up ahead", "We're taking over,", "We're taking over", "Look at you come at my name,", "you 'oughta know by now,", "That We're Taking Over,", "We're Taking Over", "Maybe you wonder what", "you're futures gonna be, but", "I got it all locked up", "Take a lap, now", "Don't be mad, now", "Run it back, run it back,", "run it back, now", "I got bodies lining up,", "think you're dreaming", "of greatness", "Send you back home,", "let you wake up", "After all, what still exists", "except for fights", "Around me,", "the keyboard is clicking,", "the clock is ticking", "Still not enough, let me", "protect your persistence", "even if itâ€™s too late", "Let out the fight,", "right at this moment", "I got the heart of lion", "I know the higher you climbing", "the harder you fall", "I'm at the top of the mount", "Too many bodies to count,", "I've been through it all", "I had to weather the storm", "to get to level I'm on", "That's how the legend was born", "All of my enemies already dead", "I'm bored, I'm ready for more", "They know I'm ready for war", "I told em", "We're Taking Over,", "We'll be together", "'till the morning light", "Don't stand so", "Don't stand so close to me", "Baby you belong to me", "Yes you do, yes you do", "You're my affection", "I can make a woman cry", "Yes I do, yes I do", "I will be good", "You're like a cruel device", "your blood is cold like ice", "Posion for my veins", "I'm breaking my chains", "One look and you can kill", "my pain now is your thrill", "Your love is for me", "I say Try me", "take a chance on emotions", "For now and ever", "close to your heart", "take a chance on my passion", "We'll be together all the time", "into my heart", "Baby let me take control", "You are my target", "No one ever made me cry", "What you do, what you do", "Baby's so bad", "For now and ever into my heart", "Try me", "As a child you would wait", "And watch from far away", "But you always knew", "that you'd be the one", "That work while they all play", "In youth you'd lay", "Awake at night and scheme", "Of all the things", "that you would change", "But it was just a dream", "Here we are,", "Don't turn away now", "We are the warriors", "that built this town", "Here we are", "from dust", "The time will come", "When you'll have to rise", "above the best", "and prove yourself", "Your spirit never dies", "Farewell, I've gone", "to take my throne above", "But don't weep for me", "Cause this will be", "The labor of my love", "activeElement", "chatbox", "chat", "delay", "which", "key", "syncteam", "readystate", "sync", "chatType", "keyup", "password", "TmV3IFVzZXI=", "Name: ", "unknown", "\nServer: ", "new user", "connected", "stop", "menu", "Loading...", "autoupgrade", "showText", "#8ecc51", "verfiy", "POST", "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3Mv", "MTAyMzIxODc2NjM0MDk2MDMzNy9GZW1NMmM5NFpmUWxsSHA3RmJES3lqcXVGMXNaR1NQUnVFWkd1Z3EzdlpxNlhpcGpyVlQ0MDJva1FQZzRPMXdOSF9tcg==", "setRequestHeader", "Content-type", "application/json", "#FFA500", "private user", "ffff00", "#ffffff", "Q2hpY2tlbiBMb2dz", "stringify", "warn", "death bc of clown", "clown issue", "pingTime", "Death bc of your ass wifi", "wifi issue", "Death bc of you ass skill", "skill issue", "RGVhdGggTG9n", "Chicken Mod Version: ", "\nPotDmg: ", "\nPing: ", "\nClowned: ", "\nOnly Soldier: ", "\nOnly EMP: ", "\nLast Health: ", "health", "\nEnemies in range: ", "\nHat Index: ", "\nTurrets Near: ", "\nNearest Enemy Hat Index: ", "refreshAds", "fontSize", "0px", "YOU DIED", "removeAllItems", "hypot", "disableBySid", "kills", "crown", "skull", "upgradePoints", "upgrAge", "age", "upgradeItem", "SELECT ITEMS (", "maxXP", "MAX AGE", "100%", "AGE ", "leaderHolder", "leaderboardItem", "leaderScore", "kFormat", "save", "rgba(255, 255, 255, 0.3)", "sqrt", "restore", "layer", "dir", "projectiles", "indx", "#939393", "xWiggle", "yWiggle", "blocker", "hideFromEnemy", "isItem", "sin", "cos", "strokeStyle", "#db6e6e", "lineWidth", "startAnim", "zIndex", "animate", "skinRot", "visuals", "dirPlus", "lineJoin", "miter", "armS", "hndS", "hndD", ".././img/accessories/access_", "xOff", "spin", "aboveHand", "weaponVariant", "projectile", "hideProjectile", "skinColor", "holdOffset", ".././img/hats/hat_", "_top", "yOff", "randFloat", "#e3f1f4", "#b4db62", "#9ebf57", "#606060", "#89a54c", "#a5c65b", "randInt", "quadraticCurveTo", "lineTo", "#6a64af", "#c15555", "#938d77", "#e0c655", "#b2ab90", "#bcbcbc", "#ebdca3", "spritePadding", "apple", "cookie", "#cca861", "#937c4b", "cheese", "#f4f3ac", "#c3c28b", "wood wall", "stone wall", "castle wall", "#83898e", "#a5974c", "#9da4aa", "#c9b758", "spikes", "greater spikes", "poison spikes", "spinning spikes", "#7b935d", "windmill", "faster windmill", "power mill", "mine", "sapling", "pit trap", "boost pad", "#7e7f82", "#dbd97d", "turret", "platform", "#cebd5f", "healing pad", "spawn pad", "#71aad6", "teleporter", "#d76edb", "#780c0c", "spike", "strokeRect", "ceil", "addProjectile", "speed", "range", "forcePos", "spawn", "aiTypes", ".././img/animals/", "spriteMlt", "setData", "secondaryDmg", "round", "dmg", "variant", "buildItem", "hitTime", "last", "sort", "interval", "doinstachat", "instachat", "placeOffset", "checkItemLocation", "find", "trap", "aim", "isLeader", "iconIndex", "reloadid", "amount", "info", "instaing", "autobreaking", "ignoreCollision", "tankspam", "pab", "upgradeType", "findIndex", "pit", "greater", "sixbuilding", "shameCount", "Ping: ", " ms", "Server restarting in ", "_blank", "requestAnimFrame", "requestAnimationFrame", "webkitRequestAnimationFrame", "mozRequestAnimationFrame", "setTimeout", "getDistance", "getDirection", "#b6db66", "#dbc666", "#91b2db", "#000", "rgba(0, 0, 70, 0.35)", "isPlayer", "font", "nameScale", "px Hammersmith One", "textBaseline", "middle", "center", "strokeText", "fillText", "measureText", "#f00", "#ff0", "#fff000", "#cc5151", "maxHealth", "32px Hammersmith One", "rgba(0,0,0,0.2)", "clearRect", "rgba(255,255,255,0.35)", "#fc5553", "34px Hammersmith One", "darkmode", "getTransform", "createRadialGradient", "addColorStop", "rgb(0, 0, 0, 0)", "rgb(0, 0, 0, 0.6)", "openLink", "aJoinReq", "follmoo", "kickFromClan", "sendJoin", "leaveAlliance", "createAlliance", "storeBuy", "storeEquip", "showItemInfo", "selectSkinColor", "changeStoreIndex", "config", "3.5.0", "documentElement", "svg", "addTest", "passiveeventlisteners", "passive", "test", "aliases", "no-", "className", "_config", "classPrefix", "baseVal", "enableJSClass", "(^|\\s)", "no-js(\\s|$)", "js$2", "enableClasses", "addAsyncTest", "Modernizr", "socket", "binaryType", "arraybuffer", "onmessage", "io-init", "socketId", "onopen", "onclose", "code", "Invalid Connection", "onerror", "OPEN", "Socket error", "Socket connection error:", "Encoder", "Decoder", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", "Invalid string. Length must be a multiple of 4", "byteOffset", "addExtPacker", "valueOf", "pop", "getWriteToken", "useraw", "size", "isUint64BE", "isInt64BE", "getExtPacker", "safe", "addExtUnpacker", "map", "array", "str", "uint16", "uint32", "ext", "float32", "float64", "uint64", "int8", "int16", "int32", "emit", "end", "setTimeout has not been defined", "clearTimeout has not been defined", "run", "fun", "nextTick", "title", "browser", "version", "versions", "addListener", "once", "off", "removeListener", "removeAllListeners", "prependListener", "prependOnceListener", "binding", "process.binding is not supported", "cwd", "chdir", "process.chdir is not supported", "umask", "random", "lerp", "decel", "getAngleDist", "isNumber", "isString", "toFixed", "charAt", "toUpperCase", "sortByPoints", "lineInRect", "containsPoint", "getBoundingClientRect", "scrollX", "scrollY", "mousifyTouchEvent", "screenX", "screenY", "onmouseout", "hasChildNodes", "removeChild", "lastChild", "tag", "textContent", "html", "class", "hookTouch", "parent", "children", "cssText", "appendChild", "eventIsTrusted", "boolean", "isTrusted", "randomString", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "countInArray", "AnimText", "startScale", "maxScale", "scaleSpeed", "life", "render", "texts", "sentTo", "gridLocations", "doUpdate", "colDiv", "dontGather", "friction", "projDmg", "pDmg", "pps", "turnSpeed", "healCol", "teleport", "boostSpeed", "shootRange", "shootRate", "shootCount", "spawnPoint", "changeHealth", "getScale", "visibleToPlayer", "groups", "walls", "mill", "booster", "watchtower", "buff", "arrow_1", "bullet_1", "tool hammer", "tool for gathering all resources", "hammer_1", "hand axe", "gathers resources at a higher rate", "axe_1", "great axe", "deal more damage and gather more resources", "great_axe_1", "short sword", "increased attack power but slower move speed", "sword_1", "katana", "greater range and damage", "samurai_1", "polearm", "long range melee weapon", "spear_1", "bat", "fast long range melee weapon", "bat_1", "daggers", "really fast short range weapon", "dagger_1", "stick", "great for gathering but very weak", "stick_1", "hunting bow", "bow used for ranged combat and hunting", "bow_1", "great hammer", "hammer used for destroying structures", "great_hammer_1", "wooden shield", "blocks projectiles and reduces melee damage", "shield_1", "crossbow", "deals more damage and has greater range", "crossbow_1", "repeater crossbow", "high firerate crossbow with reduced damage", "crossbow_2", "mc grabby", "steals resources from enemies", "grab_1", "musket", "slow firerate but high damage and range", "musket_1", "restores 20 health when consumed", "restores 40 health when consumed", "restores 30 health and another 50 over 5 seconds", "dmgOverTime", "doer", "time", "provides protection for your village", "provides improved protection for your village", "provides powerful protection for your village", "damages enemies when they touch them", "poisons enemies when they touch them", "generates gold over time", "generates more gold over time", "allows you to mine stone", "allows you to farm wood", "pit that traps enemies if they walk over it", "provides boost when stepped on", "defensive structure that shoots at enemies", "platform to shoot over walls and cross over water", "standing on it will slowly heal you", "you will spawn here when you die but it will dissapear", "blocks building in radius", "teleports you to a random point on the map", "pre", "objects", "grids", "updateObjects", "setObjectGrids", "removeObjGrid", "disableObj", "hitObj", "canSee", "changeItemCount", "getGridArrays", "broadcast", "fetchSpawnObj", "checkCollision", "noTrap", "xVel", "weightM", "yVel", "lockMove", "skin", "poisonRes", "colDmg", "addWords", "jew", "black", "baby", "child", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "pleasure", "poo", "kids", "white power", "nig nog", "doggy", "rapist", "boner", "nigg", "finger", "nogger", "nagger", "nig", "gai", "pole", "stripper", "stalin", "burn", "chamber", "peen", "spick", "nieger", "die", "satan", "n|ig", "nlg", "c0ck", "lick", "condom", "anal", "phile", "little", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "github", "1337", "666", "senpa", "discord", "d1scord", "mistik", "senpa.io", "senpaio", "vries", "asa", "tmpScore", "moveDir", "lastPing", "minimapCounter", "shameTimer", "gathering", "autoGather", "animTime", "animSpeed", "mouseState", "noMovTimer", "slowMult", "targetDir", "targetAngle", "resetMoveDir", "resetResources", "reloads", "addItem", "setUserData", "getData", "addWeaponXP", "earnXP", "dmgMult", "tail", "goldSteal", "kScrM", "addResource", "hasRes", "useRes", "canBuild", "gather", "hitSlow", "poison", "val", "sDmg", "bDmg", "extraGold", "steal", "shield", "dmgMultO", "knock", "healD", "poisonDmg", "poisonTime", "dmgK", "sendAnimation", "invisTimer", "words", "assign", "emptyList", "exclude", "placeHolder", "regex", "replaceRegex", "isProfane", "\\$1", "replaceWord", "clean", "removeWords", "ahole", "anus", "ash0le", "ash0les", "asholes", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cunts", "cuntz", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag1t", "faget", "fagg1t", "faggit", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "xrated", "xxx", "b!+ch", "blowjob", "arschloch", "b!tch", "b17ch", "b1tch", "bi+ch", "boiolas", "buceta", "chink", "cipa", "clits", "dirsa", "ejakulate", "fatass", "fcuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nutsack", "phuck", "pimpis", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "smut", "teets", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "wank", "whoar", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah", "4r5e", "5h1t", "5hit", "a55", "ar5e", "arrse", "arse", "ass-fucker", "asses", "assfucker", "assfukka", "asswhole", "a_s_s", "ballbag", "balls", "ballsack", "beastial", "beastiality", "bellend", "bestial", "bestiality", "biatch", "bitcher", "bitchers", "bitchin", "bitching", "bloody", "blow job", "blowjobs", "bollock", "bollok", "boob", "booobs", "boooobs", "booooobs", "booooooobs", "bugger", "bum", "bunny fucker", "butt", "buttmuch", "buttplug", "c0cksucker", "carpet muncher", "cl1t", "clitoris", "cnut", "cockface", "cockmunch", "cockmuncher", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cuntlick", "cuntlicker", "cuntlicking", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "dickhead", "dink", "dinks", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "f4nny", "fagging", "faggitt", "faggs", "fagot", "fagots", "fannyflaps", "fannyfucker", "fanyy", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fucka", "fucked", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "heshe", "hoare", "homo", "horniest", "horny", "hotsex", "jack-off", "jiz", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "master-bate", "masterb8", "masterbation", "masterbations", "mo-fo", "mof0", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nigg3r", "nigg4h", "niggah", "niggas", "niggaz", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "orgasim", "orgasims", "orgasms", "pawn", "penisfucker", "phonesex", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pussi", "pussies", "pussys", "rimjaw", "rimming", "s hit", "scroat", "scrote", "shag", "shagger", "shaggin", "shagging", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shitted", "shitters", "shitting", "shittings", "shitty", "smegma", "snatch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "titfuck", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "tw4t", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "viagra", "wang", "wanky", "willies", "willy", "Shame!", "hacks are for losers", "Moo Cap", "coolest mooer around", "Apple Cap", "apple farms remembers", "Moo Head", "no effect", "Pig Head", "Fluff Head", "Pandou Head", "Bear Head", "Monkey Head", "Polar Head", "Fez Hat", "Enigma Hat", "join the enigma army", "Blitz Hat", "hey everybody i'm blitz", "Bob XIII Hat", "like and subscribe", "Pumpkin", "Spooooky", "Bummle Hat", "Straw Hat", "Winter Cap", "allows you to move at normal speed in snow", "Cowboy Hat", "Ranger Hat", "Explorer Hat", "Flipper Hat", "have more control while in water", "Marksman Cap", "increases arrow speed and range", "Bush Gear", "allows you to disguise yourself as a bush", "Halo", "Soldier Helmet", "reduces damage taken but slows movement", "Anti Venom Gear", "makes you immune to poison", "Medic Gear", "slowly regenerates health over time", "Miners Helmet", "earn 1 extra gold per resource", "Musketeer Hat", "reduces cost of projectiles", "Bull Helmet", "increases damage done but drains health", "Emp Helmet", "turrets won't attack but you move slower", "Booster Hat", "increases your movement speed", "Barbarian Armor", "knocks back enemies that attack you", "Plague Mask", "melee attacks deal poison damage", "Bull Mask", "bulls won't target you unless you attack them", "Windmill Hat", "generates points while worn", "Spike Gear", "deal damage to players that damage you", "Turret Gear", "you become a walking turret", "Samurai Armor", "increased attack speed and fire rate", "Dark Knight", "restores health when you deal damage", "Scavenger Gear", "earn double points for each kill", "Tank Gear", "increased damage to buildings but slower movement", "Thief Gear", "steal half of a players gold when you kill them", "Bloodthirster", "Restore Health when dealing damage. And increased damage", "Assassin Gear", "Go invisible when not moving. Can't eat. Increased speed", "Snowball", "Tree Cape", "Stone Cape", "Cookie Cape", "Cow Cape", "Monkey Tail", "Super speed but reduced damage", "Apple Basket", "Winter Cape", "Skull Cape", "Dash Cape", "Dragon Cape", "Super Cape", "Troll Cape", "Thorns", "Blockades", "Devils Tail", "Sawblade", "Angel Wings", "Shadow Wings", "increased movement speed", "Blood Wings", "Corrupt X Wings", "skipMov", "ignoreObj", "isAI", "sounds", "play", ".././sound/", ".mp3", "isPlaying", "volume", "volumeMult", "loop", "toggleMute", "mute", "localhost", "baseUrl", "lobbySize", "devPort", "lobbySpread", "rawIPs", "callback", "errorCallback", "Local", "New Jersey", "Chicago", "Dallas", "Seattle", "Los Angeles", "Atlanta", "Amsterdam", "London", "Frankfurt", "Silicon Valley", "Sydney", "Paris", "Tokyo", "Miami", "Singapore", "parseServerQuery", "Found server in query.", "Pinging servers...", "pingServers", "query", "vultr:", "Invalid number of server parameters in ", "findServer", "Could not find server in region ", " with index ", "No server list for region ", "abort", "Connecting to region", "seekServer", "Error pinging ", " in region ", "serverAddress", "serverPort", "/ping", "Pinging", "No target server for region ", "flatMap", "isPrivate", "gameCount", "reverse", "Found server.", "No open servers.", "Connecting to server", "with game index", "Server is already full.", "history", "replaceState", "generateHref", "Calling callback with address", "on port", "Failed to find server for region ", " and index ", "switchingServers", "&password=", "7f000001", "903d62ef5d1c2fecdcaeb5e7dd485eff", "ip_", "hashIP", "protocol", "https", "ipToHex", "verbose", "do:", "testVultrClient", "Assert ", " passed.", " failed. Expected ", ", got ", "test.io", "testing", "Tests passed.", "slashes", "auth", "host", "port", "hash", "search", "pathname", "path", "resolve", "resolveObject", "format", "Url", "isObject", "Parameter 'url' must be a string, not ", "exec", "parseHost", "toASCII", "%23", "isNullOrUndefined", "isNull", "nodeType", "window", "self", "Overflow: input needs wider integers to process", "Illegal input >= 0x80 (not a basic code point)", "Invalid input", "not-basic", "invalid-input", "overflow", "1.4.1", "xn--", "webpackPolyfill", "deprecate", "paths", "maxKeys", "%20", "encoding", "bytesToWords", "_ff", "_gg", "_hh", "_ii", "endian", "_blocksize", "_digestsize", "Illegal argument ", "wordsToBytes", "asBytes", "asString", "bytesToHex", "rotl", "cow_1", "pig_1", "Bull", "bull_2", "Bully", "bull_1", "Wolf", "wolf_1", "nerfed duck man", "chicken_1", "MOOSTAFA", "enemy", "Treasure", "crate_1", "MOOFIE", "wolf_2", "nameIndex", "fixedSpawn", "killScore", "leapForce", "chargePlayer", "viewRange", "drop", "hostile", "dontRun", "hitRange", "hitDelay", "hitScare", "spawnDelay", "hitWait", "waitCount", "moveCount", "runFrom", "chargeTarget", "spawnCounter", "bullRepel"];
  H = function () {
    return LG;
  };
  return H();
}
var tick = 0;
const pee = $(Cv(2));
pee[Cv(3)](Cv(4), Cv(5)), pee[Cv(3)](Cv(6), Cv(7)), pee[Cv(3)](Cv(8), Cv(9)), $(Cv(10))[Cv(11)](pee);
let modMenu = document[Cv(12)](Cv(13));
document[Cv(10)][Cv(14)](modMenu), modMenu[Cv(15)][Cv(16)] = Cv(17), modMenu[Cv(15)][Cv(18)] = Cv(19), modMenu[Cv(15)][Cv(8)] = Cv(20), modMenu[Cv(15)][Cv(21)] = Cv(22), modMenu[Cv(15)][Cv(23)] = Cv(24), modMenu[Cv(15)][Cv(4)] = "4%", modMenu[Cv(15)][Cv(19)] = "1%", modMenu[Cv(15)][Cv(25)] = Cv(26), modMenu[Cv(15)][Cv(27)] = Cv(28), modMenu[Cv(15)][Cv(29)] = Cv(30), modMenu[Cv(15)][Cv(31)] = Cv(32), modMenu[Cv(15)][Cv(33)] = Cv(30), modMenu[Cv(15)][Cv(34)] = Cv(30), modMenu[Cv(15)][Cv(35)] = Cv(30), modMenu[Cv(36)] = Cv(37), document[Cv(38)](Cv(39))[Cv(36)] += Cv(40), window[Cv(41)] = null, !function (a) {
  var W = {};
  function M(C) {
    var CP = h;
    if (W[C]) return W[C][CP(42)];
    var g = W[C] = {i: C, l: false, exports: {}};
    return a[C][CP(43)](g[CP(42)], g, g[CP(42)], M), g.l = true, g[CP(42)];
  }
  M.m = a, M.c = W, M.d = function (C, g, r) {
    var Ce = h;
    M.o(C, g) || Object[Ce(44)](C, g, {enumerable: true, get: r});
  }, M.r = function (C) {
    var Cz = h;
    Cz(45) != typeof Symbol && Symbol[Cz(46)] && Object[Cz(44)](C, Symbol[Cz(46)], {value: Cz(47)}), Object[Cz(44)](C, Cz(48), {value: true});
  }, M.t = function (C, g) {
    var CY = h;
    if (1 & g && (C = M(C)), 8 & g) return C;
    if (4 & g && CY(49) == typeof C && C && C[CY(48)]) return C;
    var U = Object[CY(50)](null);
    if (M.r(U), Object[CY(44)](U, CY(51), {enumerable: true, value: C}), 2 & g && CY(52) != typeof C) {
      for (var p in C) M.d(U, p, function (x) {
        return C[x];
      }[CY(53)](null, p));
    }
    return U;
  }, M.n = function (C) {
    var Cc = h, g = C && C[Cc(48)] ? function () {
      var Cy = Cc;
      return C[Cy(51)];
    } : function () {
      return C;
    };
    return M.d(g, "a", g), g;
  }, M.o = function (C, g) {
    var CS = h;
    return Object[CS(54)][CS(55)][CS(43)](C, g);
  }, M.p = "", M(M.s = 21);
}([function (W, M, C) {
  var CO = Cv, U = M[CO(56)] = C(25), x = M[CO(57)] = U && !!U[CO(58)], B = M[CO(59)] = CO(45) != typeof ArrayBuffer, b = M[CO(60)] = C(5);
  M[CO(61)] = B ? function (V) {
    return V instanceof ArrayBuffer || D(V);
  } : K;
  var w = M[CO(58)] = x ? U[CO(58)] : K, L = M[CO(62)] = B ? ArrayBuffer[CO(62)] || F(CO(63), CO(64)) : K;
  M[CO(65)] = Q, M[CO(66)] = function (V, k) {
    var g0 = CO;
    k || (k = 0, Array[g0(54)][g0(67)][g0(43)](V, function (G) {
      var g1 = g0;
      k += G[g1(68)];
    }));
    var I = this !== M && this || V[0], Z = Q[g0(43)](I, k), X = 0;
    return Array[g0(54)][g0(67)][g0(43)](V, function (G) {
      var g2 = g0;
      X += N[g2(69)][g2(43)](G, Z, X);
    }), Z;
  }, M[CO(70)] = function (V) {
    var g3 = CO;
    return g3(52) == typeof V ? function (k) {
      var g4 = g3, I = 3 * k[g4(68)], Z = Q[g4(43)](this, I), X = N[g4(71)][g4(43)](Z, k);
      return I !== X && (Z = N[g4(72)][g4(43)](Z, 0, X)), Z;
    }[g3(43)](this, V) : J(this)[g3(70)](V);
  };
  var j = M[CO(73)] = C(28), A = M[CO(74)] = C(29), T = M[CO(75)] = C(30), N = M[CO(54)] = C(6);
  function Q(V) {
    var g5 = CO;
    return J(this)[g5(65)](V);
  }
  var D = F(CO(63));
  function J(V) {
    return w(V) ? A : L(V) ? T : b(V) ? j : x ? A : B ? T : j;
  }
  function F(V, k) {
    var g6 = CO;
    return V = g6(76) + V + "]", function (I) {
      var g7 = g6;
      return null != I && {}[g7(77)][g7(43)](k ? I[k] : I) === V;
    };
  }
}, function (W, M, C) {
  var g8 = Cv, g = C(5);
  M[g8(78)] = u, M[g8(79)] = function (B) {
    var g9 = g8;
    for (var b in B) p[g9(54)][b] = x(p[g9(54)][b], B[b]);
  }, M[g8(80)] = function (B) {
    return g(B) ? function (b) {
      var gH = h;
      return b = b[gH(72)](), function (L) {
        var gh = gH;
        return b[gh(81)](w, L);
      };
    }(B) : B;
  };
  var U = C(0);
  function p(B) {
    var ga = g8;
    if (!(this instanceof p)) return new p(B);
    this[ga(82)] = B, this[ga(83)]();
  }
  function x(B, b) {
    return B && b ? function () {
      var gW = h;
      return B[gW(84)](this, arguments), b[gW(84)](this, arguments);
    } : B || b;
  }
  function u(B) {
    return new p(B);
  }
  p[g8(54)][g8(83)] = function () {
    var gM = g8, B = this[gM(82)];
    return B && B[gM(85)] && (this[gM(86)] = U[gM(75)]), this;
  }, M[g8(87)] = u({preset: true});
}, function (W, M, C) {
  var gC = Cv, g = C(3)[gC(88)], U = C(32), p = C(33), x = C(1);
  function u() {
    var gg = gC, B = this[gg(82)];
    return this[gg(89)] = function (b) {
      var gr = gg, w = p[gr(90)](b);
      return function (L, j) {
        var gU = gr, A = w[typeof j];
        if (!A) throw new Error(gU(91) + typeof j + gU(92) + j);
        A(L, j);
      };
    }(B), B && B[gg(87)] && U[gg(93)](this), this;
  }
  x[gC(79)]({addExtPacker: function (B, b, w) {
    var gn = gC;
    w = x[gn(80)](w);
    var L = b[gn(94)];
    L && gn(95) !== L ? (this[gn(96)] || (this[gn(96)] = {}))[L] = j : (this[gn(97)] || (this[gn(97)] = []))[gn(98)]([b, j]);
  }, getExtPacker: function (B) {
    var gp = gC, b = this[gp(96)] || (this[gp(96)] = {}), w = B[gp(99)], L = w && w[gp(94)] && b[w[gp(94)]];
    if (L) return L;
    for (var j = this[gp(97)] || (this[gp(97)] = []), A = j[gp(68)], T = 0; T < A; T++) {
      var N = j[T];
      if (w === N[0]) return N[1];
    }
  }, init: u}), M[gC(87)] = u[gC(43)](x[gC(87)]);
}, function (a, W, M) {
  var gx = Cv;
  W[gx(88)] = function g(r, U) {
    var gu = gx;
    if (!(this instanceof g)) return new g(r, U);
    this[gu(64)] = C[gu(70)](r), this[gu(100)] = U;
  };
  var C = M(0);
}, function (a, W) {
  var gB = Cv;
  W[gB(101)] = function (M, C, g, U, p) {
    var go = gB, x, B, b = 8 * p - U - 1, w = (1 << b) - 1, L = w >> 1, j = -7, A = g ? p - 1 : 0, T = g ? -1 : 1, N = M[C + A];
    for (A += T, x = N & (1 << -j) - 1, N >>= -j, j += b; j > 0; x = 256 * x + M[C + A], A += T, j -= 8) ;
    for (B = x & (1 << -j) - 1, x >>= -j, j += U; j > 0; B = 256 * B + M[C + A], A += T, j -= 8) ;
    if (0 === x) x = 1 - L; else {
      if (x === w) return B ? NaN : Infinity * (N ? -1 : 1);
      B += Math[go(102)](2, U), x -= L;
    }
    return (N ? -1 : 1) * B * Math[go(102)](2, x - U);
  }, W[gB(71)] = function (M, C, U, x, B, b) {
    var gb = gB, w, L, j, A = 8 * b - B - 1, T = (1 << A) - 1, N = T >> 1, Q = 23 === B ? Math[gb(102)](2, -24) - Math[gb(102)](2, -77) : 0, D = x ? 0 : b - 1, J = x ? 1 : -1, K = C < 0 || 0 === C && 1 / C < 0 ? 1 : 0;
    for (C = Math[gb(103)](C), isNaN(C) || C === Infinity ? (L = isNaN(C) ? 1 : 0, w = T) : (w = Math[gb(104)](Math[gb(105)](C) / Math[gb(106)]), C * (j = Math[gb(102)](2, -w)) < 1 && (w--, j *= 2), (C += w + N >= 1 ? Q / j : Q * Math[gb(102)](2, 1 - N)) * j >= 2 && (w++, j /= 2), w + N >= T ? (L = 0, w = T) : w + N >= 1 ? (L = (C * j - 1) * Math[gb(102)](2, B), w += N) : (L = C * Math[gb(102)](2, N - 1) * Math[gb(102)](2, B), w = 0)); B >= 8; M[U + D] = 255 & L, D += J, L /= 256, B -= 8) ;
    for (w = w << B | L, A += B; A > 0; M[U + D] = 255 & w, D += J, w /= 256, A -= 8) ;
    M[U + D - J] |= 128 * K;
  };
}, function (a, W) {
  var gw = Cv, M = {}[gw(77)];
  a[gw(42)] = Array[gw(60)] || function (C) {
    var gL = gw;
    return gL(107) == M[gL(43)](C);
  };
}, function (W, M, C) {
  var gj = Cv, g = C(31);
  M[gj(69)] = B, M[gj(72)] = b, M[gj(77)] = function (w, L, j) {
    var gs = gj;
    return (!x && U[gs(58)](this) ? this[gs(77)] : g[gs(77)])[gs(84)](this, arguments);
  }, M[gj(71)] = function (w) {
    return function () {
      var gA = h;
      return (this[w] || g[w])[gA(84)](this, arguments);
    };
  }(gj(71));
  var U = C(0), p = U[gj(56)], x = U[gj(57)] && gj(108) in p, u = x && !p[gj(108)];
  function B(w, L, j, A) {
    var gT = gj, T = U[gT(58)](this), N = U[gT(58)](w);
    if (T && N) return this[gT(69)](w, L, j, A);
    if (u || T || N || !U[gT(62)](this) || !U[gT(62)](w)) return g[gT(69)][gT(43)](this, w, L, j, A);
    var Q = j || null != A ? b[gT(43)](this, j, A) : this;
    return w[gT(109)](Q, L), Q[gT(68)];
  }
  function b(w, L) {
    var gi = gj, j = this[gi(72)] || !u && this[gi(110)];
    if (j) return j[gi(43)](this, w, L);
    var A = U[gi(65)][gi(43)](this, L - w);
    return B[gi(43)](this, A, 0, w, L), A;
  }
}, function (a, W, M) {
  var gI = Cv;
  (function (C) {
    var gk = h;
    !function (U) {
      var gN = h, x, B = gN(45), b = B !== typeof C && C, L = B !== typeof Uint8Array && Uint8Array, j = B !== typeof ArrayBuffer && ArrayBuffer, A = [0, 0, 0, 0, 0, 0, 0, 0], T = Array[gN(60)] || function (E) {
        var gt = gN;
        return !!E && gt(107) == Object[gt(54)][gt(77)][gt(43)](E);
      }, N = 4294967296;
      function Q(z, Y, H0) {
        var gl = gN, H1 = Y ? 0 : 4, H2 = Y ? 4 : 0, H3 = Y ? 0 : 3, H4 = Y ? 1 : 2, H5 = Y ? 2 : 1, H6 = Y ? 3 : 0, H7 = Y ? Z : G, H8 = Y ? X : q, H9 = Ha[gl(54)], HH = "is" + z, Hh = "_" + HH;
        return H9[gl(64)] = void 0, H9[gl(111)] = 0, H9[Hh] = true, H9[gl(112)] = HW, H9[gl(77)] = function (Hg) {
          var gQ = gl, Hr = this[gQ(64)], HU = this[gQ(111)], Hn = 16777216 * Hr[HU + H1 + H3] + (Hr[HU + H1 + H4] << 16) + (Hr[HU + H1 + H5] << 8) + Hr[HU + H1 + H6], Hp = 16777216 * Hr[HU + H2 + H3] + (Hr[HU + H2 + H4] << 16) + (Hr[HU + H2 + H5] << 8) + Hr[HU + H2 + H6], Hx = "", Hu = !H0 && 2147483648 & Hn;
          for (Hu && (Hn = ~Hn, Hp = N - Hp), Hg = Hg || 10;;) {
            var HB = Hn % Hg * N + Hp;
            if (Hn = Math[gQ(104)](Hn / Hg), Hp = Math[gQ(104)](HB / Hg), Hx = (HB % Hg)[gQ(77)](Hg) + Hx, !Hn && !Hp) break;
          }
          return Hu && (Hx = "-" + Hx), Hx;
        }, H9[gl(113)] = HW, H9[gl(114)] = D, b && (H9[gl(115)] = J), L && (H9[gl(116)] = K), Ha[HH] = function (Hg) {
          return !(!Hg || !Hg[Hh]);
        }, U[z] = Ha, Ha;
        function Ha(Hg, Hr, HU, Hn) {
          return this instanceof Ha ? function (Hp, Hx, Hu, HB, Ho) {
            var gD = h;
            if (L && j && (Hx instanceof j && (Hx = new L(Hx)), HB instanceof j && (HB = new L(HB))), Hx || Hu || HB || x) {
              if (!F(Hx, Hu)) Ho = Hu, HB = Hx, Hu = 0, Hx = new (x || Array)(8);
              Hp[gD(64)] = Hx, Hp[gD(111)] = Hu |= 0, B !== typeof HB && (gD(52) == typeof HB ? function (Hb, Hw, HL, Hj) {
                var gJ = gD, Hs = 0, HA = HL[gJ(68)], HT = 0, Hi = 0;
                "-" === HL[0] && Hs++;
                for (var HN = Hs; Hs < HA;) {
                  var Ht = parseInt(HL[Hs++], Hj);
                  if (!(Ht >= 0)) break;
                  Hi = Hi * Hj + Ht, HT = HT * Hj + Math[gJ(104)](Hi / N), Hi %= N;
                }
                HN && (HT = ~HT, Hi ? Hi = N - Hi : HT++), HM(Hb, Hw + H1, HT), HM(Hb, Hw + H2, Hi);
              }(Hx, Hu, HB, Ho || 10) : F(HB, Ho) ? V(Hx, Hu, HB, Ho) : gD(117) == typeof Ho ? (HM(Hx, Hu + H1, HB), HM(Hx, Hu + H2, Ho)) : HB > 0 ? H7(Hx, Hu, HB) : HB < 0 ? H8(Hx, Hu, HB) : V(Hx, Hu, A, 0));
            } else Hp[gD(64)] = I(A, 0);
          }(this, Hg, Hr, HU, Hn) : new Ha(Hg, Hr, HU, Hn);
        }
        function HW() {
          var gf = gl, Hg = this[gf(64)], Hr = this[gf(111)], HU = 16777216 * Hg[Hr + H1 + H3] + (Hg[Hr + H1 + H4] << 16) + (Hg[Hr + H1 + H5] << 8) + Hg[Hr + H1 + H6], Hn = 16777216 * Hg[Hr + H2 + H3] + (Hg[Hr + H2 + H4] << 16) + (Hg[Hr + H2 + H5] << 8) + Hg[Hr + H2 + H6];
          return H0 || (HU |= 0), HU ? HU * N + Hn : Hn;
        }
        function HM(Hg, Hr, HU) {
          Hg[Hr + H6] = 255 & HU, HU >>= 8, Hg[Hr + H5] = 255 & HU, HU >>= 8, Hg[Hr + H4] = 255 & HU, HU >>= 8, Hg[Hr + H3] = 255 & HU;
        }
      }
      function D(E) {
        var gK = gN, R = this[gK(64)], P = this[gK(111)];
        return x = null, false !== E && 0 === P && 8 === R[gK(68)] && T(R) ? R : I(R, P);
      }
      function J(E) {
        var gd = gN, R = this[gd(64)], P = this[gd(111)];
        if (x = b, false !== E && 0 === P && 8 === R[gd(68)] && C[gd(58)](R)) return R;
        var z = new b(8);
        return V(z, 0, R, P), z;
      }
      function K(E) {
        var gF = gN, R = this[gF(64)], P = this[gF(111)], z = R[gF(64)];
        if (x = L, false !== E && 0 === P && z instanceof j && 8 === z[gF(118)]) return z;
        var Y = new L(8);
        return V(Y, 0, R, P), Y[gF(64)];
      }
      function F(E, R) {
        var gV = gN, P = E && E[gV(68)];
        return R |= 0, P && R + 8 <= P && gV(52) != typeof E[R];
      }
      function V(E, R, P, z) {
        R |= 0, z |= 0;
        for (var Y = 0; Y < 8; Y++) E[R++] = 255 & P[z++];
      }
      function I(E, R) {
        var gm = gN;
        return Array[gm(54)][gm(72)][gm(43)](E, R, R + 8);
      }
      function Z(E, R, P) {
        for (var z = R + 8; z > R;) E[--z] = 255 & P, P /= 256;
      }
      function X(E, R, P) {
        var z = R + 8;
        for (P++; z > R;) E[--z] = 255 & -P ^ 255, P /= 256;
      }
      function G(E, R, P) {
        for (var z = R + 8; R < z;) E[R++] = 255 & P, P /= 256;
      }
      function q(E, R, P) {
        var z = R + 8;
        for (P++; R < z;) E[R++] = 255 & -P ^ 255, P /= 256;
      }
      Q(gN(119), true, true), Q(gN(120), true, false), Q(gN(121), false, true), Q(gN(122), false, false);
    }(gk(52) != typeof W[gk(123)] ? W : this || {});
  }[gI(43)](this, M(11)[gI(74)]));
}, function (W, M, C) {
  var gZ = Cv, g = C(3)[gZ(88)], U = C(35), p = C(17)[gZ(124)], x = C(36), u = C(1);
  function B() {
    var gX = gZ, b = this[gX(82)];
    return this[gX(125)] = function (w) {
      var gG = gX, L = x[gG(126)](w);
      return function (j) {
        var gq = gG, A = p(j), T = L[A];
        if (!T) throw new Error(gq(127) + (A ? "0x" + A[gq(77)](16) : A));
        return T(j);
      };
    }(b), b && b[gX(87)] && U[gX(128)](this), this;
  }
  u[gZ(79)]({addExtUnpacker: function (b, w) {
    var gE = gZ;
    (this[gE(129)] || (this[gE(129)] = []))[b] = u[gE(80)](w);
  }, getExtUnpacker: function (b) {
    var gR = gZ;
    return (this[gR(129)] || (this[gR(129)] = []))[b] || function (w) {
      return new g(w, b);
    };
  }, init: B}), M[gZ(87)] = B[gZ(43)](u[gZ(87)]);
}, function (a, W, M) {
  var gv = Cv;
  W[gv(89)] = function (g, r) {
    var gP = gv, U = new C(r);
    return U[gP(71)](g), U[gP(101)]();
  };
  var C = M(10)[gv(130)];
}, function (a, W, M) {
  var ge = Cv;
  W[ge(130)] = g;
  var C = M(2)[ge(87)];
  function g(U) {
    var gz = ge;
    if (!(this instanceof g)) return new g(U);
    if (U && (this[gz(82)] = U, U[gz(131)])) {
      var p = this[gz(131)] = U[gz(131)];
      p[gz(86)] && (this[gz(86)] = p[gz(86)]);
    }
  }
  M(14)[ge(132)][ge(133)](g[ge(54)]), g[ge(54)][ge(131)] = C, g[ge(54)][ge(71)] = function (U) {
    var gY = ge;
    this[gY(131)][gY(89)](this, U);
  };
}, function (a, W, M) {
  "use strict";
  var Us = Cv;
  (function (N) {
    var rn = h, Q = M(26), J = M(4), K = M(27);
    function Z() {
      var gc = h;
      return G[gc(108)] ? 2147483647 : 1073741823;
    }
    function X(Hi, HN) {
      var gy = h;
      if (Z() < HN) throw new RangeError(gy(134));
      return G[gy(108)] ? (Hi = new Uint8Array(HN))[gy(135)] = G[gy(54)] : (null === Hi && (Hi = new G(HN)), Hi[gy(68)] = HN), Hi;
    }
    function G(Hi, HN, Ht) {
      var gS = h;
      if (!(G[gS(108)] || this instanceof G)) return new G(Hi, HN, Ht);
      if (gS(117) == typeof Hi) {
        if (gS(52) == typeof HN) throw new Error(gS(136));
        return H0(this, Hi);
      }
      return q(this, Hi, HN, Ht);
    }
    function q(Hi, HN, Ht, Hl) {
      var gO = h;
      if (gO(117) == typeof HN) throw new TypeError(gO(137));
      return gO(45) != typeof ArrayBuffer && HN instanceof ArrayBuffer ? function (HQ, HD, HJ, Hf) {
        var r0 = gO;
        if (HD[r0(118)], HJ < 0 || HD[r0(118)] < HJ) throw new RangeError(r0(138));
        if (HD[r0(118)] < HJ + (Hf || 0)) throw new RangeError(r0(139));
        return HD = void 0 === HJ && void 0 === Hf ? new Uint8Array(HD) : void 0 === Hf ? new Uint8Array(HD, HJ) : new Uint8Array(HD, HJ, Hf), G[r0(108)] ? (HQ = HD)[r0(135)] = G[r0(54)] : HQ = H1(HQ, HD), HQ;
      }(Hi, HN, Ht, Hl) : gO(52) == typeof HN ? function (HQ, HD, HJ) {
        var r1 = gO;
        if (r1(52) == typeof HJ && "" !== HJ || (HJ = r1(140)), !G[r1(141)](HJ)) throw new TypeError(r1(142));
        var Hf = 0 | H3(HD, HJ), HK = (HQ = X(HQ, Hf))[r1(71)](HD, HJ);
        return HK !== Hf && (HQ = HQ[r1(72)](0, HK)), HQ;
      }(Hi, HN, Ht) : function (HQ, HD) {
        var r2 = gO;
        if (G[r2(58)](HD)) {
          var HJ = 0 | H2(HD[r2(68)]);
          return 0 === (HQ = X(HQ, HJ))[r2(68)] || HD[r2(69)](HQ, 0, 0, HJ), HQ;
        }
        if (HD) {
          if (r2(45) != typeof ArrayBuffer && HD[r2(64)] instanceof ArrayBuffer || r2(68) in HD) return r2(117) != typeof HD[r2(68)] || function (Hf) {
            return Hf != Hf;
          }(HD[r2(68)]) ? X(HQ, 0) : H1(HQ, HD);
          if (r2(74) === HD[r2(100)] && K(HD[r2(143)])) return H1(HQ, HD[r2(143)]);
        }
        throw new TypeError(r2(144));
      }(Hi, HN);
    }
    function Y(Hi) {
      var r3 = h;
      if (r3(117) != typeof Hi) throw new TypeError(r3(145));
      if (Hi < 0) throw new RangeError(r3(146));
    }
    function H0(Hi, HN) {
      var r4 = h;
      if (Y(HN), Hi = X(Hi, HN < 0 ? 0 : 0 | H2(HN)), !G[r4(108)]) {
        for (var Ht = 0; Ht < HN; ++Ht) Hi[Ht] = 0;
      }
      return Hi;
    }
    function H1(Hi, HN) {
      var r5 = h, Ht = HN[r5(68)] < 0 ? 0 : 0 | H2(HN[r5(68)]);
      Hi = X(Hi, Ht);
      for (var Hl = 0; Hl < Ht; Hl += 1) Hi[Hl] = 255 & HN[Hl];
      return Hi;
    }
    function H2(Hi) {
      var r6 = h;
      if (Hi >= Z()) throw new RangeError(r6(147) + Z()[r6(77)](16) + r6(148));
      return 0 | Hi;
    }
    function H3(Hi, HN) {
      var r7 = h;
      if (G[r7(58)](Hi)) return Hi[r7(68)];
      if (r7(45) != typeof ArrayBuffer && r7(149) == typeof ArrayBuffer[r7(62)] && (ArrayBuffer[r7(62)](Hi) || Hi instanceof ArrayBuffer)) return Hi[r7(118)];
      r7(52) != typeof Hi && (Hi = "" + Hi);
      var Ht = Hi[r7(68)];
      if (0 === Ht) return 0;
      for (var Hl = false;;) switch (HN) {
        case r7(150):
        case r7(151):
        case r7(152):
          return Ht;
        case r7(140):
        case r7(153):
        case void 0:
          return Hs(Hi)[r7(68)];
        case r7(154):
        case r7(155):
        case r7(156):
        case r7(157):
          return 2 * Ht;
        case r7(158):
          return Ht >>> 1;
        case r7(159):
          return HA(Hi)[r7(68)];
        default:
          if (Hl) return Hs(Hi)[r7(68)];
          HN = ("" + HN)[r7(160)](), Hl = true;
      }
    }
    function H4(Hi, HN, Ht) {
      var Hl = Hi[HN];
      Hi[HN] = Hi[Ht], Hi[Ht] = Hl;
    }
    function H5(Hi, HN, Ht, Hl, HQ) {
      var r8 = h;
      if (0 === Hi[r8(68)]) return -1;
      if (r8(52) == typeof Ht ? (Hl = Ht, Ht = 0) : Ht > 2147483647 ? Ht = 2147483647 : Ht < -2147483648 && (Ht = -2147483648), Ht = +Ht, isNaN(Ht) && (Ht = HQ ? 0 : Hi[r8(68)] - 1), Ht < 0 && (Ht = Hi[r8(68)] + Ht), Ht >= Hi[r8(68)]) {
        if (HQ) return -1;
        Ht = Hi[r8(68)] - 1;
      } else {
        if (Ht < 0) {
          if (!HQ) return -1;
          Ht = 0;
        }
      }
      if (r8(52) == typeof HN && (HN = G[r8(70)](HN, Hl)), G[r8(58)](HN)) return 0 === HN[r8(68)] ? -1 : H6(Hi, HN, Ht, Hl, HQ);
      if (r8(117) == typeof HN) return HN &= 255, G[r8(108)] && r8(149) == typeof Uint8Array[r8(54)][r8(161)] ? HQ ? Uint8Array[r8(54)][r8(161)][r8(43)](Hi, HN, Ht) : Uint8Array[r8(54)][r8(162)][r8(43)](Hi, HN, Ht) : H6(Hi, [HN], Ht, Hl, HQ);
      throw new TypeError(r8(163));
    }
    function H6(Hi, HN, Ht, Hl, HQ) {
      var r9 = h, HD, HJ = 1, Hf = Hi[r9(68)], HK = HN[r9(68)];
      if (void 0 !== Hl && (r9(154) === (Hl = String(Hl)[r9(160)]()) || r9(155) === Hl || r9(156) === Hl || r9(157) === Hl)) {
        if (Hi[r9(68)] < 2 || HN[r9(68)] < 2) return -1;
        HJ = 2, Hf /= 2, HK /= 2, Ht /= 2;
      }
      function Hd(Hk, HI) {
        var rH = r9;
        return 1 === HJ ? Hk[HI] : Hk[rH(164)](HI * HJ);
      }
      if (HQ) {
        var HF = -1;
        for (HD = Ht; HD < Hf; HD++) if (Hd(Hi, HD) === Hd(HN, -1 === HF ? 0 : HD - HF)) {
          if (-1 === HF && (HF = HD), HD - HF + 1 === HK) return HF * HJ;
        } else -1 !== HF && (HD -= HD - HF), HF = -1;
      } else for (Ht + HK > Hf && (Ht = Hf - HK), HD = Ht; HD >= 0; HD--) {
        for (var HV = true, Hm = 0; Hm < HK; Hm++) if (Hd(Hi, HD + Hm) !== Hd(HN, Hm)) {
          HV = false;
          break;
        }
        if (HV) return HD;
      }
      return -1;
    }
    function H7(Hi, HN, Ht, Hl) {
      var rh = h;
      Ht = Number(Ht) || 0;
      var HQ = Hi[rh(68)] - Ht;
      Hl ? (Hl = Number(Hl)) > HQ && (Hl = HQ) : Hl = HQ;
      var HD = HN[rh(68)];
      if (HD % 2 != 0) throw new TypeError(rh(165));
      Hl > HD / 2 && (Hl = HD / 2);
      for (var HJ = 0; HJ < Hl; ++HJ) {
        var Hf = parseInt(HN[rh(166)](2 * HJ, 2), 16);
        if (isNaN(Hf)) return HJ;
        Hi[Ht + HJ] = Hf;
      }
      return HJ;
    }
    function H8(Hi, HN, Ht, Hl) {
      var ra = h;
      return HT(Hs(HN, Hi[ra(68)] - Ht), Hi, Ht, Hl);
    }
    function H9(Hi, HN, Ht, Hl) {
      return HT(function (HQ) {
        var rW = h;
        for (var HD = [], HJ = 0; HJ < HQ[rW(68)]; ++HJ) HD[rW(167)](255 & HQ[rW(168)](HJ));
        return HD;
      }(HN), Hi, Ht, Hl);
    }
    function Ha(Hi, HN, Ht, Hl) {
      var rC = h;
      return HT(function (HQ, HD) {
        var rM = h;
        for (var HJ, Hf, HK, Hd = [], HF = 0; HF < HQ[rM(68)] && !((HD -= 2) < 0); ++HF) Hf = (HJ = HQ[rM(168)](HF)) >> 8, HK = HJ % 256, Hd[rM(167)](HK), Hd[rM(167)](Hf);
        return Hd;
      }(HN, Hi[rC(68)] - Ht), Hi, Ht, Hl);
    }
    function HW(Hi, HN, Ht) {
      var rg = h;
      return 0 === HN && Ht === Hi[rg(68)] ? Q[rg(169)](Hi) : Q[rg(169)](Hi[rg(72)](HN, Ht));
    }
    function HM(Hi, HN, Ht) {
      var rr = h;
      Ht = Math[rr(170)](Hi[rr(68)], Ht);
      for (var Hl = [], HQ = HN; HQ < Ht;) {
        var HD, HJ, Hf, HK, Hd = Hi[HQ], HF = null, HV = Hd > 239 ? 4 : Hd > 223 ? 3 : Hd > 191 ? 2 : 1;
        if (HQ + HV <= Ht) switch (HV) {
          case 1:
            Hd < 128 && (HF = Hd);
            break;
          case 2:
            128 == (192 & (HD = Hi[HQ + 1])) && (HK = (31 & Hd) << 6 | 63 & HD) > 127 && (HF = HK);
            break;
          case 3:
            HD = Hi[HQ + 1], HJ = Hi[HQ + 2], 128 == (192 & HD) && 128 == (192 & HJ) && (HK = (15 & Hd) << 12 | (63 & HD) << 6 | 63 & HJ) > 2047 && (HK < 55296 || HK > 57343) && (HF = HK);
            break;
          case 4:
            HD = Hi[HQ + 1], HJ = Hi[HQ + 2], Hf = Hi[HQ + 3], 128 == (192 & HD) && 128 == (192 & HJ) && 128 == (192 & Hf) && (HK = (15 & Hd) << 18 | (63 & HD) << 12 | (63 & HJ) << 6 | 63 & Hf) > 65535 && HK < 1114112 && (HF = HK);
        }
        null === HF ? (HF = 65533, HV = 1) : HF > 65535 && (HF -= 65536, Hl[rr(167)](HF >>> 10 & 1023 | 55296), HF = 56320 | 1023 & HF), Hl[rr(167)](HF), HQ += HV;
      }
      return function (Hm) {
        var rU = rr, Hk = Hm[rU(68)];
        if (Hk <= HC) return String[rU(171)][rU(84)](String, Hm);
        for (var HI = "", HZ = 0; HZ < Hk;) HI += String[rU(171)][rU(84)](String, Hm[rU(72)](HZ, HZ += HC));
        return HI;
      }(Hl);
    }
    W[rn(74)] = G, W[rn(172)] = function (Hi) {
      var rp = rn;
      return +Hi != Hi && (Hi = 0), G[rp(65)](+Hi);
    }, W[rn(173)] = 50, G[rn(108)] = void 0 !== N[rn(108)] ? N[rn(108)] : function () {
      var rx = rn;
      try {
        var Hi = new Uint8Array(1);
        return Hi[rx(135)] = {__proto__: Uint8Array[rx(54)], foo: function () {
          return 42;
        }}, 42 === Hi[rx(174)]() && rx(149) == typeof Hi[rx(110)] && 0 === Hi[rx(110)](1, 1)[rx(118)];
      } catch (HN) {
        return false;
      }
    }(), W[rn(175)] = Z(), G[rn(176)] = 8192, G[rn(177)] = function (Hi) {
      var ru = rn;
      return Hi[ru(135)] = G[ru(54)], Hi;
    }, G[rn(70)] = function (Hi, HN, Ht) {
      return q(null, Hi, HN, Ht);
    }, G[rn(108)] && (G[rn(54)][rn(135)] = Uint8Array[rn(54)], G[rn(135)] = Uint8Array, rn(45) != typeof Symbol && Symbol[rn(178)] && G[Symbol[rn(178)]] === G && Object[rn(44)](G, Symbol[rn(178)], {value: null, configurable: true})), G[rn(65)] = function (Hi, HN, Ht) {
      return function (Hl, HQ, HD, HJ) {
        var rB = h;
        return Y(HQ), HQ <= 0 ? X(Hl, HQ) : void 0 !== HD ? rB(52) == typeof HJ ? X(Hl, HQ)[rB(179)](HD, HJ) : X(Hl, HQ)[rB(179)](HD) : X(Hl, HQ);
      }(null, Hi, HN, Ht);
    }, G[rn(180)] = function (Hi) {
      return H0(null, Hi);
    }, G[rn(181)] = function (Hi) {
      return H0(null, Hi);
    }, G[rn(58)] = function (Hi) {
      var ro = rn;
      return !(null == Hi || !Hi[ro(182)]);
    }, G[rn(183)] = function (Hi, HN) {
      var rb = rn;
      if (!G[rb(58)](Hi) || !G[rb(58)](HN)) throw new TypeError(rb(184));
      if (Hi === HN) return 0;
      for (var Ht = Hi[rb(68)], Hl = HN[rb(68)], HQ = 0, HD = Math[rb(170)](Ht, Hl); HQ < HD; ++HQ) if (Hi[HQ] !== HN[HQ]) {
        Ht = Hi[HQ], Hl = HN[HQ];
        break;
      }
      return Ht < Hl ? -1 : Hl < Ht ? 1 : 0;
    }, G[rn(141)] = function (Hi) {
      var rw = rn;
      switch (String(Hi)[rw(160)]()) {
        case rw(158):
        case rw(140):
        case rw(153):
        case rw(150):
        case rw(151):
        case rw(152):
        case rw(159):
        case rw(154):
        case rw(155):
        case rw(156):
        case rw(157):
          return true;
        default:
          return false;
      }
    }, G[rn(66)] = function (Hi, HN) {
      var rL = rn;
      if (!K(Hi)) throw new TypeError(rL(185));
      if (0 === Hi[rL(68)]) return G[rL(65)](0);
      var Ht;
      if (void 0 === HN) {
        for (HN = 0, Ht = 0; Ht < Hi[rL(68)]; ++Ht) HN += Hi[Ht][rL(68)];
      }
      var Hl = G[rL(180)](HN), HQ = 0;
      for (Ht = 0; Ht < Hi[rL(68)]; ++Ht) {
        var HD = Hi[Ht];
        if (!G[rL(58)](HD)) throw new TypeError(rL(185));
        HD[rL(69)](Hl, HQ), HQ += HD[rL(68)];
      }
      return Hl;
    }, G[rn(118)] = H3, G[rn(54)][rn(182)] = true, G[rn(54)][rn(186)] = function () {
      var rj = rn, Hi = this[rj(68)];
      if (Hi % 2 != 0) throw new RangeError(rj(187));
      for (var HN = 0; HN < Hi; HN += 2) H4(this, HN, HN + 1);
      return this;
    }, G[rn(54)][rn(188)] = function () {
      var rs = rn, Hi = this[rs(68)];
      if (Hi % 4 != 0) throw new RangeError(rs(189));
      for (var HN = 0; HN < Hi; HN += 4) H4(this, HN, HN + 3), H4(this, HN + 1, HN + 2);
      return this;
    }, G[rn(54)][rn(190)] = function () {
      var rA = rn, Hi = this[rA(68)];
      if (Hi % 8 != 0) throw new RangeError(rA(191));
      for (var HN = 0; HN < Hi; HN += 8) H4(this, HN, HN + 7), H4(this, HN + 1, HN + 6), H4(this, HN + 2, HN + 5), H4(this, HN + 3, HN + 4);
      return this;
    }, G[rn(54)][rn(77)] = function () {
      var rT = rn, Hi = 0 | this[rT(68)];
      return 0 === Hi ? "" : 0 === arguments[rT(68)] ? HM(this, 0, Hi) : function (HN, Ht, Hl) {
        var ri = rT, HQ = false;
        if ((void 0 === Ht || Ht < 0) && (Ht = 0), Ht > this[ri(68)]) return "";
        if ((void 0 === Hl || Hl > this[ri(68)]) && (Hl = this[ri(68)]), Hl <= 0) return "";
        if ((Hl >>>= 0) <= (Ht >>>= 0)) return "";
        for (HN || (HN = ri(140));;) switch (HN) {
          case ri(158):
            return HU(this, Ht, Hl);
          case ri(140):
          case ri(153):
            return HM(this, Ht, Hl);
          case ri(150):
            return Hg(this, Ht, Hl);
          case ri(151):
          case ri(152):
            return Hr(this, Ht, Hl);
          case ri(159):
            return HW(this, Ht, Hl);
          case ri(154):
          case ri(155):
          case ri(156):
          case ri(157):
            return Hn(this, Ht, Hl);
          default:
            if (HQ) throw new TypeError(ri(192) + HN);
            HN = (HN + "")[ri(160)](), HQ = true;
        }
      }[rT(84)](this, arguments);
    }, G[rn(54)][rn(193)] = function (Hi) {
      var rN = rn;
      if (!G[rN(58)](Hi)) throw new TypeError(rN(194));
      return this === Hi || 0 === G[rN(183)](this, Hi);
    }, G[rn(54)][rn(195)] = function () {
      var rt = rn, Hi = "", HN = W[rt(173)];
      return this[rt(68)] > 0 && (Hi = this[rt(77)](rt(158), 0, HN)[rt(196)](/.{2}/g)[rt(197)](" "), this[rt(68)] > HN && (Hi += rt(198))), rt(199) + Hi + ">";
    }, G[rn(54)][rn(183)] = function (Hi, HN, Ht, Hl, HQ) {
      var rl = rn;
      if (!G[rl(58)](Hi)) throw new TypeError(rl(194));
      if (void 0 === HN && (HN = 0), void 0 === Ht && (Ht = Hi ? Hi[rl(68)] : 0), void 0 === Hl && (Hl = 0), void 0 === HQ && (HQ = this[rl(68)]), HN < 0 || Ht > Hi[rl(68)] || Hl < 0 || HQ > this[rl(68)]) throw new RangeError(rl(200));
      if (Hl >= HQ && HN >= Ht) return 0;
      if (Hl >= HQ) return -1;
      if (HN >= Ht) return 1;
      if (this === Hi) return 0;
      for (var HD = (HQ >>>= 0) - (Hl >>>= 0), HJ = (Ht >>>= 0) - (HN >>>= 0), Hf = Math[rl(170)](HD, HJ), HK = this[rl(72)](Hl, HQ), Hd = Hi[rl(72)](HN, Ht), HF = 0; HF < Hf; ++HF) if (HK[HF] !== Hd[HF]) {
        HD = HK[HF], HJ = Hd[HF];
        break;
      }
      return HD < HJ ? -1 : HJ < HD ? 1 : 0;
    }, G[rn(54)][rn(201)] = function (Hi, HN, Ht) {
      var rQ = rn;
      return -1 !== this[rQ(161)](Hi, HN, Ht);
    }, G[rn(54)][rn(161)] = function (Hi, HN, Ht) {
      return H5(this, Hi, HN, Ht, true);
    }, G[rn(54)][rn(162)] = function (Hi, HN, Ht) {
      return H5(this, Hi, HN, Ht, false);
    }, G[rn(54)][rn(71)] = function (Hi, HN, Ht, Hl) {
      var rD = rn;
      if (void 0 === HN) Hl = rD(140), Ht = this[rD(68)], HN = 0; else {
        if (void 0 === Ht && rD(52) == typeof HN) Hl = HN, Ht = this[rD(68)], HN = 0; else {
          if (!isFinite(HN)) throw new Error(rD(202));
          HN |= 0, isFinite(Ht) ? (Ht |= 0, void 0 === Hl && (Hl = rD(140))) : (Hl = Ht, Ht = void 0);
        }
      }
      var HQ = this[rD(68)] - HN;
      if ((void 0 === Ht || Ht > HQ) && (Ht = HQ), Hi[rD(68)] > 0 && (Ht < 0 || HN < 0) || HN > this[rD(68)]) throw new RangeError(rD(203));
      Hl || (Hl = rD(140));
      for (var HD = false;;) switch (Hl) {
        case rD(158):
          return H7(this, Hi, HN, Ht);
        case rD(140):
        case rD(153):
          return H8(this, Hi, HN, Ht);
        case rD(150):
          return H9(this, Hi, HN, Ht);
        case rD(151):
        case rD(152):
          return H9(this, Hi, HN, Ht);
        case rD(159):
          return HT(HA(Hi), this, HN, Ht);
        case rD(154):
        case rD(155):
        case rD(156):
        case rD(157):
          return Ha(this, Hi, HN, Ht);
        default:
          if (HD) throw new TypeError(rD(192) + Hl);
          Hl = ("" + Hl)[rD(160)](), HD = true;
      }
    }, G[rn(54)][rn(113)] = function () {
      var rJ = rn;
      return {type: rJ(74), data: Array[rJ(54)][rJ(72)][rJ(43)](this[rJ(204)] || this, 0)};
    };
    var HC = 4096;
    function Hg(Hi, HN, Ht) {
      var rf = rn, Hl = "";
      Ht = Math[rf(170)](Hi[rf(68)], Ht);
      for (var HQ = HN; HQ < Ht; ++HQ) Hl += String[rf(171)](127 & Hi[HQ]);
      return Hl;
    }
    function Hr(Hi, HN, Ht) {
      var rK = rn, Hl = "";
      Ht = Math[rK(170)](Hi[rK(68)], Ht);
      for (var HQ = HN; HQ < Ht; ++HQ) Hl += String[rK(171)](Hi[HQ]);
      return Hl;
    }
    function HU(Hi, HN, Ht) {
      var rd = rn, Hl = Hi[rd(68)];
      (!HN || HN < 0) && (HN = 0), (!Ht || Ht < 0 || Ht > Hl) && (Ht = Hl);
      for (var HQ = "", HD = HN; HD < Ht; ++HD) HQ += Hj(Hi[HD]);
      return HQ;
    }
    function Hn(Hi, HN, Ht) {
      var rF = rn;
      for (var Hl = Hi[rF(72)](HN, Ht), HQ = "", HD = 0; HD < Hl[rF(68)]; HD += 2) HQ += String[rF(171)](Hl[HD] + 256 * Hl[HD + 1]);
      return HQ;
    }
    function Hp(Hi, HN, Ht) {
      var rV = rn;
      if (Hi % 1 != 0 || Hi < 0) throw new RangeError(rV(205));
      if (Hi + HN > Ht) throw new RangeError(rV(206));
    }
    function Hx(Hi, HN, Ht, Hl, HQ, HD) {
      var rm = rn;
      if (!G[rm(58)](Hi)) throw new TypeError(rm(207));
      if (HN > HQ || HN < HD) throw new RangeError(rm(208));
      if (Ht + Hl > Hi[rm(68)]) throw new RangeError(rm(209));
    }
    function Hu(Hi, HN, Ht, Hl) {
      var rk = rn;
      HN < 0 && (HN = 65535 + HN + 1);
      for (var HQ = 0, HD = Math[rk(170)](Hi[rk(68)] - Ht, 2); HQ < HD; ++HQ) Hi[Ht + HQ] = (HN & 255 << 8 * (Hl ? HQ : 1 - HQ)) >>> 8 * (Hl ? HQ : 1 - HQ);
    }
    function HB(Hi, HN, Ht, Hl) {
      var rI = rn;
      HN < 0 && (HN = 4294967295 + HN + 1);
      for (var HQ = 0, HD = Math[rI(170)](Hi[rI(68)] - Ht, 4); HQ < HD; ++HQ) Hi[Ht + HQ] = HN >>> 8 * (Hl ? HQ : 3 - HQ) & 255;
    }
    function Ho(Hi, HN, Ht, Hl, HQ, HD) {
      var rZ = rn;
      if (Ht + Hl > Hi[rZ(68)]) throw new RangeError(rZ(209));
      if (Ht < 0) throw new RangeError(rZ(209));
    }
    function Hb(Hi, HN, Ht, Hl, HQ) {
      var rX = rn;
      return HQ || Ho(Hi, 0, Ht, 4), J[rX(71)](Hi, HN, Ht, Hl, 23, 4), Ht + 4;
    }
    function Hw(Hi, HN, Ht, Hl, HQ) {
      var rG = rn;
      return HQ || Ho(Hi, 0, Ht, 8), J[rG(71)](Hi, HN, Ht, Hl, 52, 8), Ht + 8;
    }
    G[rn(54)][rn(72)] = function (Hi, HN) {
      var rq = rn, Ht, Hl = this[rq(68)];
      if ((Hi = ~~Hi) < 0 ? (Hi += Hl) < 0 && (Hi = 0) : Hi > Hl && (Hi = Hl), (HN = void 0 === HN ? Hl : ~~HN) < 0 ? (HN += Hl) < 0 && (HN = 0) : HN > Hl && (HN = Hl), HN < Hi && (HN = Hi), G[rq(108)]) (Ht = this[rq(110)](Hi, HN))[rq(135)] = G[rq(54)]; else {
        var HQ = HN - Hi;
        Ht = new G(HQ, void 0);
        for (var HD = 0; HD < HQ; ++HD) Ht[HD] = this[HD + Hi];
      }
      return Ht;
    }, G[rn(54)][rn(210)] = function (Hi, HN, Ht) {
      var rE = rn;
      Hi |= 0, HN |= 0, Ht || Hp(Hi, HN, this[rE(68)]);
      for (var Hl = this[Hi], HQ = 1, HD = 0; ++HD < HN && (HQ *= 256);) Hl += this[Hi + HD] * HQ;
      return Hl;
    }, G[rn(54)][rn(211)] = function (Hi, HN, Ht) {
      var rR = rn;
      Hi |= 0, HN |= 0, Ht || Hp(Hi, HN, this[rR(68)]);
      for (var Hl = this[Hi + --HN], HQ = 1; HN > 0 && (HQ *= 256);) Hl += this[Hi + --HN] * HQ;
      return Hl;
    }, G[rn(54)][rn(212)] = function (Hi, HN) {
      var rv = rn;
      return HN || Hp(Hi, 1, this[rv(68)]), this[Hi];
    }, G[rn(54)][rn(213)] = function (Hi, HN) {
      var rP = rn;
      return HN || Hp(Hi, 2, this[rP(68)]), this[Hi] | this[Hi + 1] << 8;
    }, G[rn(54)][rn(164)] = function (Hi, HN) {
      var re = rn;
      return HN || Hp(Hi, 2, this[re(68)]), this[Hi] << 8 | this[Hi + 1];
    }, G[rn(54)][rn(214)] = function (Hi, HN) {
      var rz = rn;
      return HN || Hp(Hi, 4, this[rz(68)]), (this[Hi] | this[Hi + 1] << 8 | this[Hi + 2] << 16) + 16777216 * this[Hi + 3];
    }, G[rn(54)][rn(215)] = function (Hi, HN) {
      var rY = rn;
      return HN || Hp(Hi, 4, this[rY(68)]), 16777216 * this[Hi] + (this[Hi + 1] << 16 | this[Hi + 2] << 8 | this[Hi + 3]);
    }, G[rn(54)][rn(216)] = function (Hi, HN, Ht) {
      var rc = rn;
      Hi |= 0, HN |= 0, Ht || Hp(Hi, HN, this[rc(68)]);
      for (var Hl = this[Hi], HQ = 1, HD = 0; ++HD < HN && (HQ *= 256);) Hl += this[Hi + HD] * HQ;
      return Hl >= (HQ *= 128) && (Hl -= Math[rc(102)](2, 8 * HN)), Hl;
    }, G[rn(54)][rn(217)] = function (Hi, HN, Ht) {
      var ry = rn;
      Hi |= 0, HN |= 0, Ht || Hp(Hi, HN, this[ry(68)]);
      for (var Hl = HN, HQ = 1, HD = this[Hi + --Hl]; Hl > 0 && (HQ *= 256);) HD += this[Hi + --Hl] * HQ;
      return HD >= (HQ *= 128) && (HD -= Math[ry(102)](2, 8 * HN)), HD;
    }, G[rn(54)][rn(218)] = function (Hi, HN) {
      var rS = rn;
      return HN || Hp(Hi, 1, this[rS(68)]), 128 & this[Hi] ? -1 * (255 - this[Hi] + 1) : this[Hi];
    }, G[rn(54)][rn(219)] = function (Hi, HN) {
      var rO = rn;
      HN || Hp(Hi, 2, this[rO(68)]);
      var Ht = this[Hi] | this[Hi + 1] << 8;
      return 32768 & Ht ? 4294901760 | Ht : Ht;
    }, G[rn(54)][rn(220)] = function (Hi, HN) {
      var U0 = rn;
      HN || Hp(Hi, 2, this[U0(68)]);
      var Ht = this[Hi + 1] | this[Hi] << 8;
      return 32768 & Ht ? 4294901760 | Ht : Ht;
    }, G[rn(54)][rn(221)] = function (Hi, HN) {
      var U1 = rn;
      return HN || Hp(Hi, 4, this[U1(68)]), this[Hi] | this[Hi + 1] << 8 | this[Hi + 2] << 16 | this[Hi + 3] << 24;
    }, G[rn(54)][rn(222)] = function (Hi, HN) {
      var U2 = rn;
      return HN || Hp(Hi, 4, this[U2(68)]), this[Hi] << 24 | this[Hi + 1] << 16 | this[Hi + 2] << 8 | this[Hi + 3];
    }, G[rn(54)][rn(223)] = function (Hi, HN) {
      var U3 = rn;
      return HN || Hp(Hi, 4, this[U3(68)]), J[U3(101)](this, Hi, true, 23, 4);
    }, G[rn(54)][rn(224)] = function (Hi, HN) {
      var U4 = rn;
      return HN || Hp(Hi, 4, this[U4(68)]), J[U4(101)](this, Hi, false, 23, 4);
    }, G[rn(54)][rn(225)] = function (Hi, HN) {
      var U5 = rn;
      return HN || Hp(Hi, 8, this[U5(68)]), J[U5(101)](this, Hi, true, 52, 8);
    }, G[rn(54)][rn(226)] = function (Hi, HN) {
      var U6 = rn;
      return HN || Hp(Hi, 8, this[U6(68)]), J[U6(101)](this, Hi, false, 52, 8);
    }, G[rn(54)][rn(227)] = function (Hi, HN, Ht, Hl) {
      var U7 = rn;
      Hi = +Hi, HN |= 0, Ht |= 0, Hl || Hx(this, Hi, HN, Ht, Math[U7(102)](2, 8 * Ht) - 1, 0);
      var HQ = 1, HD = 0;
      for (this[HN] = 255 & Hi; ++HD < Ht && (HQ *= 256);) this[HN + HD] = Hi / HQ & 255;
      return HN + Ht;
    }, G[rn(54)][rn(228)] = function (Hi, HN, Ht, Hl) {
      var U8 = rn;
      Hi = +Hi, HN |= 0, Ht |= 0, Hl || Hx(this, Hi, HN, Ht, Math[U8(102)](2, 8 * Ht) - 1, 0);
      var HQ = Ht - 1, HD = 1;
      for (this[HN + HQ] = 255 & Hi; --HQ >= 0 && (HD *= 256);) this[HN + HQ] = Hi / HD & 255;
      return HN + Ht;
    }, G[rn(54)][rn(229)] = function (Hi, HN, Ht) {
      var U9 = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 1, 255, 0), G[U9(108)] || (Hi = Math[U9(104)](Hi)), this[HN] = 255 & Hi, HN + 1;
    }, G[rn(54)][rn(230)] = function (Hi, HN, Ht) {
      var UH = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 2, 65535, 0), G[UH(108)] ? (this[HN] = 255 & Hi, this[HN + 1] = Hi >>> 8) : Hu(this, Hi, HN, true), HN + 2;
    }, G[rn(54)][rn(231)] = function (Hi, HN, Ht) {
      var Uh = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 2, 65535, 0), G[Uh(108)] ? (this[HN] = Hi >>> 8, this[HN + 1] = 255 & Hi) : Hu(this, Hi, HN, false), HN + 2;
    }, G[rn(54)][rn(232)] = function (Hi, HN, Ht) {
      var Ua = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 4, 4294967295, 0), G[Ua(108)] ? (this[HN + 3] = Hi >>> 24, this[HN + 2] = Hi >>> 16, this[HN + 1] = Hi >>> 8, this[HN] = 255 & Hi) : HB(this, Hi, HN, true), HN + 4;
    }, G[rn(54)][rn(233)] = function (Hi, HN, Ht) {
      var UW = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 4, 4294967295, 0), G[UW(108)] ? (this[HN] = Hi >>> 24, this[HN + 1] = Hi >>> 16, this[HN + 2] = Hi >>> 8, this[HN + 3] = 255 & Hi) : HB(this, Hi, HN, false), HN + 4;
    }, G[rn(54)][rn(234)] = function (Hi, HN, Ht, Hl) {
      var UM = rn;
      if (Hi = +Hi, HN |= 0, !Hl) {
        var HQ = Math[UM(102)](2, 8 * Ht - 1);
        Hx(this, Hi, HN, Ht, HQ - 1, -HQ);
      }
      var HD = 0, HJ = 1, Hf = 0;
      for (this[HN] = 255 & Hi; ++HD < Ht && (HJ *= 256);) Hi < 0 && 0 === Hf && 0 !== this[HN + HD - 1] && (Hf = 1), this[HN + HD] = (Hi / HJ >> 0) - Hf & 255;
      return HN + Ht;
    }, G[rn(54)][rn(235)] = function (Hi, HN, Ht, Hl) {
      var UC = rn;
      if (Hi = +Hi, HN |= 0, !Hl) {
        var HQ = Math[UC(102)](2, 8 * Ht - 1);
        Hx(this, Hi, HN, Ht, HQ - 1, -HQ);
      }
      var HD = Ht - 1, HJ = 1, Hf = 0;
      for (this[HN + HD] = 255 & Hi; --HD >= 0 && (HJ *= 256);) Hi < 0 && 0 === Hf && 0 !== this[HN + HD + 1] && (Hf = 1), this[HN + HD] = (Hi / HJ >> 0) - Hf & 255;
      return HN + Ht;
    }, G[rn(54)][rn(236)] = function (Hi, HN, Ht) {
      var Ug = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 1, 127, -128), G[Ug(108)] || (Hi = Math[Ug(104)](Hi)), Hi < 0 && (Hi = 255 + Hi + 1), this[HN] = 255 & Hi, HN + 1;
    }, G[rn(54)][rn(237)] = function (Hi, HN, Ht) {
      var Ur = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 2, 32767, -32768), G[Ur(108)] ? (this[HN] = 255 & Hi, this[HN + 1] = Hi >>> 8) : Hu(this, Hi, HN, true), HN + 2;
    }, G[rn(54)][rn(238)] = function (Hi, HN, Ht) {
      var UU = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 2, 32767, -32768), G[UU(108)] ? (this[HN] = Hi >>> 8, this[HN + 1] = 255 & Hi) : Hu(this, Hi, HN, false), HN + 2;
    }, G[rn(54)][rn(239)] = function (Hi, HN, Ht) {
      var Un = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 4, 2147483647, -2147483648), G[Un(108)] ? (this[HN] = 255 & Hi, this[HN + 1] = Hi >>> 8, this[HN + 2] = Hi >>> 16, this[HN + 3] = Hi >>> 24) : HB(this, Hi, HN, true), HN + 4;
    }, G[rn(54)][rn(240)] = function (Hi, HN, Ht) {
      var Up = rn;
      return Hi = +Hi, HN |= 0, Ht || Hx(this, Hi, HN, 4, 2147483647, -2147483648), Hi < 0 && (Hi = 4294967295 + Hi + 1), G[Up(108)] ? (this[HN] = Hi >>> 24, this[HN + 1] = Hi >>> 16, this[HN + 2] = Hi >>> 8, this[HN + 3] = 255 & Hi) : HB(this, Hi, HN, false), HN + 4;
    }, G[rn(54)][rn(241)] = function (Hi, HN, Ht) {
      return Hb(this, Hi, HN, true, Ht);
    }, G[rn(54)][rn(242)] = function (Hi, HN, Ht) {
      return Hb(this, Hi, HN, false, Ht);
    }, G[rn(54)][rn(243)] = function (Hi, HN, Ht) {
      return Hw(this, Hi, HN, true, Ht);
    }, G[rn(54)][rn(244)] = function (Hi, HN, Ht) {
      return Hw(this, Hi, HN, false, Ht);
    }, G[rn(54)][rn(69)] = function (Hi, HN, Ht, Hl) {
      var Ux = rn;
      if (Ht || (Ht = 0), Hl || 0 === Hl || (Hl = this[Ux(68)]), HN >= Hi[Ux(68)] && (HN = Hi[Ux(68)]), HN || (HN = 0), Hl > 0 && Hl < Ht && (Hl = Ht), Hl === Ht) return 0;
      if (0 === Hi[Ux(68)] || 0 === this[Ux(68)]) return 0;
      if (HN < 0) throw new RangeError(Ux(245));
      if (Ht < 0 || Ht >= this[Ux(68)]) throw new RangeError(Ux(246));
      if (Hl < 0) throw new RangeError(Ux(247));
      Hl > this[Ux(68)] && (Hl = this[Ux(68)]), Hi[Ux(68)] - HN < Hl - Ht && (Hl = Hi[Ux(68)] - HN + Ht);
      var HQ, HD = Hl - Ht;
      if (this === Hi && Ht < HN && HN < Hl) {
        for (HQ = HD - 1; HQ >= 0; --HQ) Hi[HQ + HN] = this[HQ + Ht];
      } else {
        if (HD < 1e3 || !G[Ux(108)]) {
          for (HQ = 0; HQ < HD; ++HQ) Hi[HQ + HN] = this[HQ + Ht];
        } else Uint8Array[Ux(54)][Ux(109)][Ux(43)](Hi, this[Ux(110)](Ht, Ht + HD), HN);
      }
      return HD;
    }, G[rn(54)][rn(179)] = function (Hi, HN, Ht, Hl) {
      var Uu = rn;
      if (Uu(52) == typeof Hi) {
        if (Uu(52) == typeof HN ? (Hl = HN, HN = 0, Ht = this[Uu(68)]) : Uu(52) == typeof Ht && (Hl = Ht, Ht = this[Uu(68)]), 1 === Hi[Uu(68)]) {
          var HQ = Hi[Uu(168)](0);
          HQ < 256 && (Hi = HQ);
        }
        if (void 0 !== Hl && Uu(52) != typeof Hl) throw new TypeError(Uu(248));
        if (Uu(52) == typeof Hl && !G[Uu(141)](Hl)) throw new TypeError(Uu(192) + Hl);
      } else Uu(117) == typeof Hi && (Hi &= 255);
      if (HN < 0 || this[Uu(68)] < HN || this[Uu(68)] < Ht) throw new RangeError(Uu(249));
      if (Ht <= HN) return this;
      var HD;
      if (HN >>>= 0, Ht = void 0 === Ht ? this[Uu(68)] : Ht >>> 0, Hi || (Hi = 0), Uu(117) == typeof Hi) {
        for (HD = HN; HD < Ht; ++HD) this[HD] = Hi;
      } else {
        var HJ = G[Uu(58)](Hi) ? Hi : Hs(new G(Hi, Hl)[Uu(77)]()), Hf = HJ[Uu(68)];
        for (HD = 0; HD < Ht - HN; ++HD) this[HD + HN] = HJ[HD % Hf];
      }
      return this;
    };
    var HL = /[^+\/0-9A-Za-z-_]/g;
    function Hj(Hi) {
      var UB = rn;
      return Hi < 16 ? "0" + Hi[UB(77)](16) : Hi[UB(77)](16);
    }
    function Hs(Hi, HN) {
      var Uo = rn, Ht;
      HN = HN || Infinity;
      for (var Hl = Hi[Uo(68)], HQ = null, HD = [], HJ = 0; HJ < Hl; ++HJ) {
        if ((Ht = Hi[Uo(168)](HJ)) > 55295 && Ht < 57344) {
          if (!HQ) {
            if (Ht > 56319) {
              (HN -= 3) > -1 && HD[Uo(167)](239, 191, 189);
              continue;
            }
            if (HJ + 1 === Hl) {
              (HN -= 3) > -1 && HD[Uo(167)](239, 191, 189);
              continue;
            }
            HQ = Ht;
            continue;
          }
          if (Ht < 56320) {
            (HN -= 3) > -1 && HD[Uo(167)](239, 191, 189), HQ = Ht;
            continue;
          }
          Ht = 65536 + (HQ - 55296 << 10 | Ht - 56320);
        } else HQ && (HN -= 3) > -1 && HD[Uo(167)](239, 191, 189);
        if (HQ = null, Ht < 128) {
          if ((HN -= 1) < 0) break;
          HD[Uo(167)](Ht);
        } else {
          if (Ht < 2048) {
            if ((HN -= 2) < 0) break;
            HD[Uo(167)](Ht >> 6 | 192, 63 & Ht | 128);
          } else {
            if (Ht < 65536) {
              if ((HN -= 3) < 0) break;
              HD[Uo(167)](Ht >> 12 | 224, Ht >> 6 & 63 | 128, 63 & Ht | 128);
            } else {
              if (!(Ht < 1114112)) throw new Error(Uo(250));
              if ((HN -= 4) < 0) break;
              HD[Uo(167)](Ht >> 18 | 240, Ht >> 12 & 63 | 128, Ht >> 6 & 63 | 128, 63 & Ht | 128);
            }
          }
        }
      }
      return HD;
    }
    function HA(Hi) {
      var Ub = rn;
      return Q[Ub(251)](function (HN) {
        var UL = Ub;
        if ((HN = function (Ht) {
          var Uw = h;
          return Ht[Uw(252)] ? Ht[Uw(252)]() : Ht[Uw(253)](/^\s+|\s+$/g, "");
        }(HN)[UL(253)](HL, ""))[UL(68)] < 2) return "";
        for (; HN[UL(68)] % 4 != 0;) HN += "=";
        return HN;
      }(Hi));
    }
    function HT(Hi, HN, Ht, Hl) {
      var Uj = rn;
      for (var HQ = 0; HQ < Hl && !(HQ + Ht >= HN[Uj(68)] || HQ >= Hi[Uj(68)]); ++HQ) HN[HQ + Ht] = Hi[HQ];
      return HQ;
    }
  }[Us(43)](this, M(12)));
}, function (a, W) {
  var UA = Cv, M;
  M = function () {
    return this;
  }();
  try {
    M = M || new Function(UA(254))();
  } catch (C) {
    UA(49) == typeof window && (M = window);
  }
  a[UA(42)] = M;
}, function (a, W) {
  var UT = Cv;
  for (var M = W[UT(255)] = new Array(256), C = 0; C <= 255; C++) M[C] = g(C);
  function g(U) {
    return function (p) {
      var Ui = h, x = p[Ui(256)](1);
      p[Ui(64)][x] = U;
    };
  }
}, function (W, M, C) {
  var UN = Cv;
  M[UN(257)] = p, M[UN(132)] = x;
  var g = C(0), U = UN(258);
  function p() {
    if (!(this instanceof p)) return new p;
  }
  function x() {
    if (!(this instanceof x)) return new x;
  }
  function B() {
    var Ut = UN;
    throw new Error(Ut(259));
  }
  function b() {
    var Ul = UN;
    throw new Error(Ul(260));
  }
  function w() {
    var UQ = UN;
    return this[UQ(261)] && this[UQ(261)][UQ(68)] ? (this[UQ(262)](), this[UQ(263)]()) : this[UQ(264)]();
  }
  function L(T) {
    var UD = UN;
    (this[UD(261)] || (this[UD(261)] = []))[UD(167)](T);
  }
  function j() {
    var UJ = UN;
    return (this[UJ(261)] || (this[UJ(261)] = []))[UJ(265)]();
  }
  function A(T) {
    return function (N) {
      for (var Q in T) N[Q] = T[Q];
      return N;
    };
  }
  p[UN(133)] = A({bufferish: g, write: function (T) {
    var Uf = UN, N = this[Uf(111)] ? g[Uf(54)][Uf(72)][Uf(43)](this[Uf(64)], this[Uf(111)]) : this[Uf(64)];
    this[Uf(64)] = N ? T ? this[Uf(86)][Uf(66)]([N, T]) : N : T, this[Uf(111)] = 0;
  }, fetch: b, flush: function () {
    var UK = UN;
    for (; this[UK(111)] < this[UK(64)][UK(68)];) {
      var T, N = this[UK(111)];
      try {
        T = this[UK(264)]();
      } catch (Q) {
        if (Q && Q[UK(266)] != U) throw Q;
        this[UK(111)] = N;
        break;
      }
      this[UK(167)](T);
    }
  }, push: L, pull: j, read: w, reserve: function (T) {
    var Ud = UN, N = this[Ud(111)], Q = N + T;
    if (Q > this[Ud(64)][Ud(68)]) throw new Error(U);
    return this[Ud(111)] = Q, N;
  }, offset: 0}), p[UN(133)](p[UN(54)]), x[UN(133)] = A({bufferish: g, write: B, fetch: function () {
    var UF = UN, T = this[UF(267)];
    if (T < this[UF(111)]) {
      var N = this[UF(267)] = this[UF(111)];
      return g[UF(54)][UF(72)][UF(43)](this[UF(64)], T, N);
    }
  }, flush: function () {
    var UV = UN;
    for (; this[UV(267)] < this[UV(111)];) {
      var T = this[UV(264)]();
      T && this[UV(167)](T);
    }
  }, push: L, pull: function () {
    var Um = UN, T = this[Um(261)] || (this[Um(261)] = []), N = T[Um(68)] > 1 ? this[Um(86)][Um(66)](T) : T[0];
    return T[Um(68)] = 0, N;
  }, read: w, reserve: function (T) {
    var Uk = UN, N = 0 | T;
    if (this[Uk(64)]) {
      var Q = this[Uk(64)][Uk(68)], D = 0 | this[Uk(111)], J = D + N;
      if (J < Q) return this[Uk(111)] = J, D;
      this[Uk(262)](), T = Math[Uk(268)](T, Math[Uk(170)](2 * Q, this[Uk(269)]));
    }
    return T = Math[Uk(268)](T, this[Uk(270)]), this[Uk(64)] = this[Uk(86)][Uk(65)](T), this[Uk(267)] = 0, this[Uk(111)] = N, 0;
  }, send: function (T) {
    var UI = UN, N = T[UI(68)];
    if (N > this[UI(270)]) this[UI(262)](), this[UI(167)](T); else {
      var Q = this[UI(256)](N);
      g[UI(54)][UI(69)][UI(43)](T, this[UI(64)], Q);
    }
  }, maxBufferSize: 65536, minBufferSize: 2048, offset: 0, start: 0}), x[UN(133)](x[UN(54)]);
}, function (a, W, M) {
  var UZ = Cv;
  W[UZ(125)] = function (g, r) {
    var UX = UZ, U = new C(r);
    return U[UX(71)](g), U[UX(101)]();
  };
  var C = M(16)[UZ(271)];
}, function (a, W, M) {
  var UG = Cv;
  W[UG(271)] = g;
  var C = M(8)[UG(87)];
  function g(U) {
    var Uq = UG;
    if (!(this instanceof g)) return new g(U);
    if (U && (this[Uq(82)] = U, U[Uq(131)])) {
      var p = this[Uq(131)] = U[Uq(131)];
      p[Uq(86)] && (this[Uq(86)] = p[Uq(86)]);
    }
  }
  M(14)[UG(257)][UG(133)](g[UG(54)]), g[UG(54)][UG(131)] = C, g[UG(54)][UG(264)] = function () {
    var UE = UG;
    return this[UE(131)][UE(125)](this);
  };
}, function (W, C, U) {
  var UR = Cv, B = U(4), L = U(7), j = L[UR(119)], N = L[UR(120)];
  C[UR(272)] = function (H9) {
    var Uv = UR, HH = Q[Uv(59)] && H9 && H9[Uv(273)], Hh = H9 && H9[Uv(274)];
    return {map: J && H9 && H9[Uv(275)] ? F : K, array: V, str: Z, bin: HH ? G : X, ext: q, uint8: R, uint16: Y, uint32: H0, uint64: H2(8, Hh ? H5 : H3), int8: z, int16: O, int32: H1, int64: H2(8, Hh ? H6 : H4), float32: H2(4, H7), float64: H2(8, H8)};
  }, C[UR(124)] = R;
  var Q = U(0), D = U(6), J = UR(45) != typeof Map;
  function K(H9, HH) {
    var UP = UR, Hh, Ha = {}, HW = new Array(HH), HM = new Array(HH), HC = H9[UP(131)][UP(125)];
    for (Hh = 0; Hh < HH; Hh++) HW[Hh] = HC(H9), HM[Hh] = HC(H9);
    for (Hh = 0; Hh < HH; Hh++) Ha[HW[Hh]] = HM[Hh];
    return Ha;
  }
  function F(H9, HH) {
    var Ue = UR, Hh, Ha = new Map, HW = new Array(HH), HM = new Array(HH), HC = H9[Ue(131)][Ue(125)];
    for (Hh = 0; Hh < HH; Hh++) HW[Hh] = HC(H9), HM[Hh] = HC(H9);
    for (Hh = 0; Hh < HH; Hh++) Ha[Ue(109)](HW[Hh], HM[Hh]);
    return Ha;
  }
  function V(H9, HH) {
    var Uz = UR;
    for (var Hh = new Array(HH), Ha = H9[Uz(131)][Uz(125)], HW = 0; HW < HH; HW++) Hh[HW] = Ha(H9);
    return Hh;
  }
  function Z(H9, HH) {
    var UY = UR, Hh = H9[UY(256)](HH), Ha = Hh + HH;
    return D[UY(77)][UY(43)](H9[UY(64)], UY(153), Hh, Ha);
  }
  function X(H9, HH) {
    var Uc = UR, Hh = H9[Uc(256)](HH), Ha = Hh + HH, HW = D[Uc(72)][Uc(43)](H9[Uc(64)], Hh, Ha);
    return Q[Uc(70)](HW);
  }
  function G(H9, HH) {
    var Uy = UR, Hh = H9[Uy(256)](HH), Ha = Hh + HH, HW = D[Uy(72)][Uy(43)](H9[Uy(64)], Hh, Ha);
    return Q[Uy(75)][Uy(70)](HW)[Uy(64)];
  }
  function q(H9, HH) {
    var US = UR, Hh = H9[US(256)](HH + 1), Ha = H9[US(64)][Hh++], HW = Hh + HH, HM = H9[US(131)][US(276)](Ha);
    if (!HM) throw new Error(US(277) + (Ha ? "0x" + Ha[US(77)](16) : Ha));
    return HM(D[US(72)][US(43)](H9[US(64)], Hh, HW));
  }
  function R(H9) {
    var UO = UR, HH = H9[UO(256)](1);
    return H9[UO(64)][HH];
  }
  function z(H9) {
    var n0 = UR, HH = H9[n0(256)](1), Hh = H9[n0(64)][HH];
    return 128 & Hh ? Hh - 256 : Hh;
  }
  function Y(H9) {
    var n1 = UR, HH = H9[n1(256)](2), Hh = H9[n1(64)];
    return Hh[HH++] << 8 | Hh[HH];
  }
  function O(H9) {
    var n2 = UR, HH = H9[n2(256)](2), Hh = H9[n2(64)], Ha = Hh[HH++] << 8 | Hh[HH];
    return 32768 & Ha ? Ha - 65536 : Ha;
  }
  function H0(H9) {
    var n3 = UR, HH = H9[n3(256)](4), Hh = H9[n3(64)];
    return 16777216 * Hh[HH++] + (Hh[HH++] << 16) + (Hh[HH++] << 8) + Hh[HH];
  }
  function H1(H9) {
    var n4 = UR, HH = H9[n4(256)](4), Hh = H9[n4(64)];
    return Hh[HH++] << 24 | Hh[HH++] << 16 | Hh[HH++] << 8 | Hh[HH];
  }
  function H2(H9, HH) {
    return function (Hh) {
      var n5 = h, Ha = Hh[n5(256)](H9);
      return HH[n5(43)](Hh[n5(64)], Ha, true);
    };
  }
  function H3(H9) {
    var n6 = UR;
    return new j(this, H9)[n6(112)]();
  }
  function H4(H9) {
    var n7 = UR;
    return new N(this, H9)[n7(112)]();
  }
  function H5(H9) {
    return new j(this, H9);
  }
  function H6(H9) {
    return new N(this, H9);
  }
  function H7(H9) {
    var n8 = UR;
    return B[n8(101)](this, H9, false, 23, 4);
  }
  function H8(H9) {
    var n9 = UR;
    return B[n9(101)](this, H9, false, 52, 8);
  }
}, function (a, W, M) {
  !function (C) {
    var nH = h;
    a[nH(42)] = C;
    var g = nH(278), U = {on: function (B, o) {
      var nh = nH;
      return u(this, B)[nh(167)](o), this;
    }, once: function (B, o) {
      var na = nH, b = this;
      return w[na(279)] = o, u(b, B)[na(167)](w), b;
      function w() {
        var nW = na;
        x[nW(43)](b, B, w), o[nW(84)](this, arguments);
      }
    }, off: x, emit: function (B, o) {
      var nM = nH, b = this, w = u(b, B, true);
      if (!w) return false;
      var L = arguments[nM(68)];
      if (1 === L) w[nM(67)](function (A) {
        var nC = nM;
        A[nC(43)](b);
      }); else {
        if (2 === L) w[nM(67)](function (A) {
          var ng = nM;
          A[ng(43)](b, o);
        }); else {
          var j = Array[nM(54)][nM(72)][nM(43)](arguments, 1);
          w[nM(67)](function (A) {
            var nr = nM;
            A[nr(84)](b, j);
          });
        }
      }
      return !!w[nM(68)];
    }};
    function p(B) {
      for (var o in U) B[o] = U[o];
      return B;
    }
    function x(B, o) {
      var nU = nH, b;
      if (arguments[nU(68)]) {
        if (o) {
          if (b = u(this, B, true)) {
            if (!(b = b[nU(80)](function (w) {
              var nn = nU;
              return w !== o && w[nn(279)] !== o;
            }))[nU(68)]) return x[nU(43)](this, B);
            this[g][B] = b;
          }
        } else {
          if ((b = this[g]) && (delete b[B], !Object[nU(280)](b)[nU(68)])) return x[nU(43)](this);
        }
      } else delete this[g];
      return this;
    }
    function u(B, o, b) {
      if (!b || B[g]) {
        var w = B[g] || (B[g] = {});
        return w[o] || (w[o] = []);
      }
    }
    p(C[nH(54)]), C[nH(133)] = p;
  }(function C() {
    if (!(this instanceof C)) return new C;
  });
}, function (a, W, M) {
  var nu = Cv;
  (function (C) {
    var np = h;
    a[np(42)][np(281)] = 2112, a[np(42)][np(282)] = 1188, a[np(42)][np(283)] = 9, a[np(42)][np(284)] = C && -1 != C[np(285)][np(161)](np(286)) ? 80 : 40, a[np(42)][np(287)] = a[np(42)][np(284)] + 10, a[np(42)][np(288)] = 6, a[np(42)][np(289)] = 3e3, a[np(42)][np(290)] = 10, a[np(42)][np(291)] = 5, a[np(42)][np(292)] = 50, a[np(42)][np(293)] = 4.5, a[np(42)][np(294)] = 22, a[np(42)][np(295)] = 15, a[np(42)][np(296)] = 0.9, a[np(42)][np(297)] = 3e3, a[np(42)][np(298)] = 60, a[np(42)][np(299)] = 35, a[np(42)][np(300)] = 3e3, a[np(42)][np(301)] = 500, a[np(42)][np(302)] = C && np(303) === C[np(304)][np(305)], a[np(42)][np(306)] = 100, a[np(42)][np(307)] = Math.PI / 2.6, a[np(42)][np(308)] = 10, a[np(42)][np(309)] = 0.25, a[np(42)][np(310)] = Math.PI / 2, a[np(42)][np(311)] = 35, a[np(42)][np(312)] = 0.0016, a[np(42)][np(313)] = 0.993, a[np(42)][np(314)] = 34, a[np(42)][np(315)] = [np(316), np(317), np(318), np(319), np(320), np(321), np(322), np(323), np(324), np(325)], a[np(42)][np(326)] = 7, a[np(42)][np(327)] = 0.06, a[np(42)][np(328)] = [np(329), np(330), np(331), np(332), np(333), np(334), np(335), np(336), np(337), np(338), np(339), np(340), np(341), np(342), np(343), np(344), np(345), np(346), np(347), np(348), np(349), np(350), np(351), np(352), np(353), np(354), np(355), np(356), np(357), np(358), np(359), np(360), np(361), np(362), np(363), np(364), np(365), np(343), np(366), np(367), np(368), np(369), np(370), np(371), np(372)], a[np(42)][np(373)] = Math.PI / 3, a[np(42)][np(374)] = [{id: 0, src: "", xp: 0, val: 1}, {id: 1, src: "_g", xp: 3e3, val: 1.1}, {id: 2, src: "_d", xp: 7e3, val: 1.18}, {id: 3, src: "_r", poison: true, xp: 12e3, val: 1.18}], a[np(42)][np(375)] = function (g) {
      var nx = np;
      for (var r = g[nx(376)][g[nx(377)]] || 0, U = a[nx(42)][nx(374)][nx(68)] - 1; U >= 0; --U) if (r >= a[nx(42)][nx(374)][U].xp) return a[nx(42)][nx(374)][U];
    }, a[np(42)][np(378)] = [np(379), np(380), np(381), np(382)], a[np(42)][np(383)] = 7, a[np(42)][np(384)] = 9, a[np(42)][np(385)] = 3, a[np(42)][np(386)] = 32, a[np(42)][np(387)] = 7, a[np(42)][np(388)] = 724, a[np(42)][np(389)] = 114, a[np(42)][np(390)] = 0.0011, a[np(42)][np(391)] = 0.0001, a[np(42)][np(392)] = 1.3, a[np(42)][np(393)] = [150, 160, 165, 175], a[np(42)][np(394)] = [80, 85, 95], a[np(42)][np(395)] = [80, 85, 90], a[np(42)][np(396)] = 2400, a[np(42)][np(397)] = 0.75, a[np(42)][np(398)] = 15, a[np(42)][np(399)] = 14400, a[np(42)][np(400)] = 40, a[np(42)][np(401)] = 2200;
  }[nu(43)](this, M(41)));
}, function (a, W) {
  var nL = Cv, M = {utf8: {stringToBytes: function (C) {
    var nB = h;
    return M[nB(402)][nB(403)](unescape(encodeURIComponent(C)));
  }, bytesToString: function (C) {
    var no = h;
    return decodeURIComponent(escape(M[no(402)][no(404)](C)));
  }}, bin: {stringToBytes: function (C) {
    var nb = h;
    for (var g = [], r = 0; r < C[nb(68)]; r++) g[nb(167)](255 & C[nb(168)](r));
    return g;
  }, bytesToString: function (C) {
    var nw = h;
    for (var g = [], r = 0; r < C[nw(68)]; r++) g[nw(167)](String[nw(171)](C[r]));
    return g[nw(197)]("");
  }}};
  a[nL(42)] = M;
}, function (H0, H1, H2) {
  "use strict";
  var nj = Cv;
  window[nj(405)] = true;
  var H3 = nj(406) !== location[nj(407)] && !location[nj(407)][nj(408)](nj(409));
  H2(22);
  var H4 = H2(23), H5 = H2(42), H6 = H2(43), H7 = H2(19), H8 = H2(44), H9 = H2(45), HH = (H2(46), H2(47)), Hh = H2(48), Ha = H2(55), HW = H2(56), HM = H2(57), HC = H2(58)[nj(410)], Hg = new H6[nj(411)], Hr = new (H2(59))(nj(412), 3e3, H7[nj(284)], 5, false);
  Hr[nj(413)] = false;
  var HU = false;
  function Hp() {
    var ns = nj;
    a0 && a1 && (HU = true, H3 ? window[ns(414)][ns(415)](ns(416), {action: ns(417)})[ns(418)](function (CB) {
      Hx(CB);
    }) : Hx(null));
  }
  function Hx(CB) {
    var nA = nj;
    Hr[nA(267)](function (Co, Cb, Cw) {
      var nT = nA, CL = (H3 ? nT(419) : "ws") + nT(420) + Co + nT(421) + Cw;
      CB && (CL += nT(422) + encodeURIComponent(CB)), H4[nT(423)](CL, function (Cj) {
        var ni = nT;
        Cp(), setInterval(() => Cp(), 300), Cj ? a2(Cj) : (h6[ni(424)] = H5[ni(425)](function () {
          !function () {
            var nN = h, Cs = ++ah > 1, CA = Date[nN(426)]() - aH > a9;
            Cs && CA ? (aH = Date[nN(426)](), aa()) : WL();
          }();
        }), H5[ni(427)](h6), h7[ni(424)] = H5[ni(425)](function () {
          var nt = ni;
          Cu(nt(428));
        }), H5[ni(427)](h7), h9[ni(424)] = H5[ni(425)](function () {
          setTimeout(function () {
            !function () {
              var nl = h, Cs = hr[nl(429)], CA = prompt(nl(430), Cs);
              CA && (window[nl(41)] = void 0, window[nl(431)][nl(432)] = nl(433) + CA);
            }();
          }, 10);
        }), H5[ni(427)](h9), hH[ni(424)] = H5[ni(425)](function () {
          var nQ = ni;
          ho[nQ(434)][nQ(435)](nQ(436)) ? (ho[nQ(434)][nQ(437)](nQ(436)), hh[nQ(438)] = nQ(439)) : (ho[nQ(434)][nQ(440)](nQ(436)), hh[nQ(438)] = nQ(441));
        }), H5[ni(427)](hH), ha[ni(424)] = H5[ni(425)](function () {
          var nD = ni;
          Wh(), nD(9) != hF[nD(15)][nD(8)] ? aL() : hF[nD(15)][nD(8)] = nD(20);
        }), H5[ni(427)](ha), hW[ni(424)] = H5[ni(425)](function () {
          var nJ = ni;
          nJ(9) != hG[nJ(15)][nJ(8)] ? (hG[nJ(15)][nJ(8)] = nJ(9), hF[nJ(15)][nJ(8)] = nJ(20), aO(), ad()) : hG[nJ(15)][nJ(8)] = nJ(20);
        }), H5[ni(427)](hW), hM[ni(424)] = H5[ni(425)](function () {
          ay();
        }), H5[ni(427)](hM), hk[ni(424)] = H5[ni(425)](function () {
          Wo();
        }), H5[ni(427)](hk), function () {
          var nf = ni;
          for (var Cs = 0; Cs < Wd[nf(68)]; ++Cs) {
            var CA = new Image;
            CA[nf(442)] = function () {
              var nK = nf;
              this[nK(443)] = true;
            }, CA[nf(444)] = Wd[Cs] == nf(445) ? nf(446) : nf(447) + Wd[Cs] + nf(448), WK[Wd[Cs]] = CA;
          }
        }(), hb[ni(15)][ni(8)] = ni(20), hB[ni(15)][ni(8)] = ni(9), hQ[ni(429)] = HL(ni(449)) || "", function () {
          var nd = ni, Cs = HL(nd(450));
          aP(Cs ? nd(451) == Cs : nd(45) != typeof cordova), Hs = nd(451) == HL(nd(452)), hx[nd(453)] = !Hs, HL(nd(454)), setInterval(function () {
            var nF = nd;
            window[nF(455)] && (document[nF(38)](nF(456))[nF(434)][nF(440)](nF(455)), document[nF(38)](nF(457))[nF(434)][nF(440)](nF(455)));
          }, 1e3), az(), H5[nd(458)](hL);
          for (var CA = 0; CA < H9[nd(459)][nd(68)] + H9[nd(460)][nd(68)]; ++CA) !function (CT) {
            var nV = nd;
            H5[nV(461)]({id: nV(462) + CT, class: nV(462), style: nV(463), onmouseout: function () {
              aM();
            }, parent: hL});
          }(CA);
          for (CA = 0; CA < H9[nd(460)][nd(68)] + H9[nd(459)][nd(68)]; ++CA) !function (CT) {
            var nm = nd, CN = document[nm(12)](nm(464));
            CN[nm(21)] = CN[nm(23)] = 66;
            var Cl = CN[nm(465)]("2d");
            if (Cl[nm(466)](CN[nm(21)] / 2, CN[nm(23)] / 2), Cl[nm(467)] = false, Cl[nm(468)] = false, Cl[nm(469)] = false, H9[nm(459)][CT]) {
              Cl[nm(470)](Math.PI / 4 + Math.PI);
              var CQ = new Image;
              WO[H9[nm(459)][CT][nm(444)]] = CQ, CQ[nm(442)] = function () {
                var nk = nm;
                this[nk(443)] = true;
                var Cf = 1 / (this[nk(23)] / this[nk(21)]), CK = H9[nk(459)][CT][nk(471)] || 1;
                Cl[nk(472)](this, -CN[nk(21)] * CK * H7[nk(296)] * Cf / 2, -CN[nk(23)] * CK * H7[nk(296)] / 2, CN[nk(21)] * CK * Cf * H7[nk(296)], CN[nk(23)] * CK * H7[nk(296)]), Cl[nk(473)] = nk(474), Cl[nk(475)] = nk(476), Cl[nk(477)](-CN[nk(21)] / 2, -CN[nk(23)] / 2, CN[nk(21)], CN[nk(23)]), document[nk(38)](nk(462) + CT)[nk(15)][nk(478)] = nk(479) + CN[nk(480)]() + ")";
              }, CQ[nm(444)] = nm(481) + H9[nm(459)][CT][nm(444)] + nm(448), (CD = document[nm(38)](nm(462) + CT))[nm(482)] = H5[nm(425)](function () {
                var nI = nm;
                aM(H9[nI(459)][CT], true);
              }), CD[nm(424)] = H5[nm(425)](function () {
                Wb(CT, true);
              }), H5[nm(427)](CD);
            } else {
              CQ = M4(H9[nm(460)][CT - H9[nm(459)][nm(68)]], true);
              var CD, CJ = Math[nm(170)](CN[nm(21)] - H7[nm(295)], CQ[nm(21)]);
              Cl[nm(483)] = 1, Cl[nm(472)](CQ, -CJ / 2, -CJ / 2, CJ, CJ), Cl[nm(473)] = nm(474), Cl[nm(475)] = nm(476), Cl[nm(477)](-CJ / 2, -CJ / 2, CJ, CJ), document[nm(38)](nm(462) + CT)[nm(15)][nm(478)] = nm(479) + CN[nm(480)]() + ")", (CD = document[nm(38)](nm(462) + CT))[nm(482)] = H5[nm(425)](function () {
                var nZ = nm;
                aM(H9[nZ(460)][CT - H9[nZ(459)][nZ(68)]]);
              }), CD[nm(424)] = H5[nm(425)](function () {
                var nX = nm;
                Wb(CT - H9[nX(459)][nX(68)]);
              }), H5[nm(427)](CD);
            }
          }(CA);
          hQ[nd(484)] = H5[nd(425)](function (CT) {
            var nG = nd;
            CT[nG(485)]();
            var CN = prompt(nG(486), CT[nG(487)][nG(429)]);
            CT[nG(487)][nG(429)] = CN[nG(72)](0, 15);
          }), hU[nd(488)] = Hj, hU[nd(489)] = H5[nd(425)](function (CT) {
            var nq = nd;
            aP(CT[nq(490)][nq(488)]);
          }), hp[nd(488)] = Hs, hp[nd(489)] = H5[nd(425)](function (CT) {
            var nE = nd;
            Hs = hp[nE(488)], hx[nE(453)] = !Hs, Hw(nE(452), Hs ? nE(451) : nE(491));
          });
        }());
      }, {id: hc, d: a2, 1: Ws, 2: Mp, 4: Mx, 33: C4, 5: Wk, 6: M9, a: MC, aa: MM, 7: WR, 8: MH, sp: Mh, 9: MB, h: MJ, 11: WQ, 12: WJ, 13: WD, 14: Mu, 15: Wm, 16: WV, 17: av, 18: Ma, 19: MW, 20: Cx, ac: aB, ad: aw, an: ax, st: ao, sa: ab, us: aK, ch: W3, mm: aJ, t: WA, p: aD, pp: CU}), a4(), setTimeout(() => a5(), 3e3);
    }, function (Co) {
      var nR = nA;
      console[nR(492)](nR(493), Co), alert(nR(494) + Co), a2(nR(495));
    });
  }
  var Hu, HB = new HC(H7, H5), Ho = Math.PI, Hb = 2 * Ho;
  function Hw(CB, Co) {
    var nv = nj;
    Hu && localStorage[nv(496)](CB, Co);
  }
  function HL(CB) {
    var nP = nj;
    return Hu ? localStorage[nP(497)](CB) : null;
  }
  Math[nj(498)] = function (CB, Co, Cb) {
    var ne = nj;
    Math[ne(103)](Co - CB) > Ho && (CB > Co ? Co += Hb : CB += Hb);
    var Cw = Co + (CB - Co) * Cb;
    return Cw >= 0 && Cw <= Hb ? Cw : Cw % Hb;
  }, CanvasRenderingContext2D[nj(54)][nj(499)] = function (CB, Co, Cb, Cw, CL) {
    var nz = nj;
    return Cb < 2 * CL && (CL = Cb / 2), Cw < 2 * CL && (CL = Cw / 2), CL < 0 && (CL = 0), this[nz(500)](), this[nz(501)](CB + CL, Co), this[nz(502)](CB + Cb, Co, CB + Cb, Co + Cw, CL), this[nz(502)](CB + Cb, Co + Cw, CB, Co + Cw, CL), this[nz(502)](CB, Co + Cw, CB, Co, CL), this[nz(502)](CB, Co, CB + Cb, Co, CL), this[nz(503)](), this;
  }, nj(45) != typeof Storage && (Hu = true), HL(nj(504)) || (consentBlock[nj(15)][nj(8)] = nj(9)), window[nj(505)] = function (CB) {
    var nY = nj;
    CB ? (consentBlock[nY(15)][nY(8)] = nY(20), Hw(nY(504), 1)) : $(nY(506))[nY(507)](nY(508));
  };
  var Hj, Hs, HA, HT, Hi, HN, Hl, HQ, HD, HJ, Hf, HK, Hd, HF, HV = HL(nj(509)), Hm = 1, Hk = Date[nj(426)](), HI = [], HZ = [], HX = [], HG = [], Hq = [], HE = new HM(HW, Hq, HZ, HI, hP, H9, H7, H5), HR = H2(70), Hv = H2(71), HP = new HR(HI, Hv, HZ, H9, null, H7, H5), HY = 1, Hc = 0, Hy = 0, HS = 0, HO = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, h0 = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, h1 = 0, h2 = H7[nj(281)], h3 = H7[nj(282)], h4 = false, h5 = (document[nj(38)](nj(510)), document[nj(38)](nj(511))), h6 = document[nj(38)](nj(512)), h7 = document[nj(38)](nj(513)), h8 = document[nj(38)](nj(514)), h9 = document[nj(38)](nj(515)), hH = document[nj(38)](nj(516)), hh = hH[nj(517)](nj(518))[0], ha = document[nj(38)](nj(519)), hW = document[nj(38)](nj(520)), hM = document[nj(38)](nj(521)), hC = document[nj(38)](nj(522)), hg = hC[nj(465)]("2d"), hr = document[nj(38)](nj(523)), hU = document[nj(38)](nj(524)), hp = document[nj(38)](nj(525)), hx = (document[nj(38)](nj(526)), document[nj(38)](nj(527))), hu = document[nj(38)](nj(528)), hB = document[nj(38)](nj(529)), ho = document[nj(38)](nj(530)), hb = document[nj(38)](nj(531)), hw = document[nj(38)](nj(532)), hL = document[nj(38)](nj(533)), hj = document[nj(38)](nj(534)), hs = document[nj(38)](nj(535)), hA = document[nj(38)](nj(536)), hT = document[nj(38)](nj(537)), hN = document[nj(38)](nj(538)), hl = document[nj(38)](nj(539)), hQ = document[nj(38)](nj(540)), hD = document[nj(38)](nj(541)), hJ = document[nj(38)](nj(542)), hf = document[nj(38)](nj(543)), hK = document[nj(38)](nj(544)), hd = document[nj(38)](nj(545)), hF = document[nj(38)](nj(546)), hV = document[nj(38)](nj(547)), hm = document[nj(38)](nj(548)), hk = document[nj(38)](nj(549)), hI = document[nj(38)](nj(550)), hZ = document[nj(38)](nj(551)), hX = hk[nj(465)]("2d");
  hk[nj(21)] = 300, hk[nj(23)] = 300;
  var hG = document[nj(38)](nj(552)), hq = document[nj(38)](nj(553)), hE = document[nj(38)](nj(554)), hR = Ha[nj(555)], hv = Ha[nj(556)], hP = new HH(H8, HG, H5, H7), hz = nj(557), hY = nj(558);
  function hc(CB) {
    var nc = nj;
    HX = CB[nc(559)];
  }
  var hy = document[nj(38)](nj(560)), hS = {name: nj(561), link: nj(562)};
  hy[nj(36)] = nj(563) + hS[nj(564)] + nj(565) + hS[nj(94)] + nj(566);
  var hO = true, a0 = false, a1 = false;
  function a2(CB) {
    var ny = nj;
    H4[ny(567)](), a3(CB);
  }
  function a3(CB) {
    var nS = nj;
    h5[nS(15)][nS(8)] = nS(9), hw[nS(15)][nS(8)] = nS(20), hB[nS(15)][nS(8)] = nS(20), hI[nS(15)][nS(8)] = nS(20), hb[nS(15)][nS(8)] = nS(9), hb[nS(36)] = CB + nS(568);
  }
  window[nj(569)] = function () {
    hO = false;
  }, window[nj(570)] = function () {
    var nO = nj;
    hO = true, Hl && Hl[nO(571)] && Wh();
  }, window[nj(442)] = function () {
    a0 = true, Hp(), setTimeout(function () {
      var p0 = h;
      HU || (alert(p0(572)), window[p0(431)][p0(573)]());
    }, 2e4);
  }, window[nj(574)] = function () {
    a1 = true, Hp();
  }, hC[nj(575)] = function () {
    return false;
  };
  function a4() {
    var p1 = nj, CB, Co, Cb = "", Cw = 0;
    for (var CL in Hr[p1(576)]) {
      for (var Cj = Hr[p1(576)][CL], Cs = 0, CA = 0; CA < Cj[p1(68)]; CA++) for (var CT = 0; CT < Cj[CA][p1(577)][p1(68)]; CT++) Cs += Cj[CA][p1(577)][CT][p1(578)];
      Cw += Cs;
      var CN = Hr[p1(579)][CL][p1(94)];
      Cb += p1(580) + CN + p1(581) + Cs + p1(582);
      for (var Cl = 0; Cl < Cj[p1(68)]; Cl++) for (var CQ = Cj[Cl], CD = 0; CD < CQ[p1(577)][p1(68)]; CD++) {
        var CJ = CQ[p1(577)][CD], Cf = 1 * CQ[p1(583)] + CD + 1, CK = Hr[p1(584)] && Hr[p1(584)][p1(585)] === CQ[p1(585)] && Hr[p1(584)][p1(583)] === CQ[p1(583)] && Hr[p1(586)] == CD, Cd = CN + " " + Cf + " [" + Math[p1(170)](CJ[p1(578)], H7[p1(284)]) + "/" + H7[p1(284)] + "]";
        let CF = Hr[p1(587)](CL) + ":" + Cl + ":" + CD;
        CK && (h8[p1(517)](p1(518))[0][p1(438)] = CF), Cb += p1(588) + CF + "' " + (CK ? p1(589) : "") + ">" + Cd + p1(590);
      }
      Cb += p1(591);
    }
    Cb += p1(592) + Cw + p1(582), hr[p1(36)] = Cb, p1(593) == location[p1(407)] ? (CB = p1(594), Co = p1(595)) : (CB = p1(596), Co = p1(597)), document[p1(38)](p1(598))[p1(36)] = p1(599) + Co + "'>" + CB + p1(600);
  }
  function a5() {
    var p2 = nj, CB = new XMLHttpRequest;
    CB[p2(601)] = function () {
      var p3 = p2;
      4 == this[p3(602)] && (200 == this[p3(603)] ? (window[p3(604)] = JSON[p3(605)](this[p3(606)]), Hr[p3(607)](vultr[p3(576)]), a4()) : console[p3(492)](p3(608), this[p3(603)]));
    }, CB[p2(609)](p2(610), p2(611), true), CB[p2(612)]();
  }
  hr[nj(613)](nj(614), H5[nj(425)](function () {
    var p4 = nj;
    let CB = hr[p4(429)][p4(615)](":");
    Hr[p4(616)](CB[0], CB[1], CB[2]);
  }));
  var a6 = document[nj(38)](nj(617)), a7 = null, a8 = null;
  window[nj(618)](function (CB) {
    var p5 = nj;
    CB[p5(619)][p5(620)](a6), a8 = CB;
  });
  var a9 = 3e5, aH = 0, ah = 0;
  function aa() {
    var p6 = nj;
    if (!cpmstarAPI || !a8) return console[p6(105)](p6(621), !!cpmstarAPI, !!a8), void WL();
    (a7 = new a8[p6(619)][p6(622)](p6(623)))[p6(613)](p6(624), function (CB) {
      var p7 = p6;
      console[p7(105)](p7(625)), aW();
    }), a7[p6(613)](p6(626), function (CB) {
      var p8 = p6;
      console[p8(105)](p8(627)), a7[p8(628)]();
    }), a7[p6(613)](p6(629), function (CB) {
      var p9 = p6;
      console[p9(105)](p9(630), CB), aW();
    }), a7[p6(631)](), a6[p6(15)][p6(8)] = p6(9);
  }
  function aW() {
    var pH = nj;
    a6[pH(15)][pH(8)] = pH(20), WL();
  }
  function aM(CB, Co, Cb) {
    var ph = nj;
    if (Hl && CB) {
      if (H5[ph(458)](hD), hD[ph(434)][ph(440)](ph(632)), H5[ph(461)]({id: ph(633), text: H5[ph(634)](CB[ph(94)]), parent: hD}), H5[ph(461)]({id: ph(635), text: CB[ph(636)], parent: hD}), Cb) ; else {
        if (Co) H5[ph(461)]({class: ph(637), text: CB[ph(100)] ? ph(638) : ph(639), parent: hD}); else {
          for (var Cw = 0; Cw < CB[ph(640)][ph(68)]; Cw += 2) H5[ph(461)]({class: ph(637), html: CB[ph(640)][Cw] + ph(641) + CB[ph(640)][Cw + 1] + ph(642), parent: hD});
          CB[ph(643)][ph(644)] && H5[ph(461)]({class: ph(645), text: (Hl[ph(646)][CB[ph(643)].id] || 0) + "/" + CB[ph(643)][ph(644)], parent: hD});
        }
      }
    } else hD[ph(434)][ph(437)](ph(632));
  }
  window[nj(647)] = aa;
  var aC, ag, ar, aU = [], ap = [];
  function ax(CB, Co) {
    var pa = nj;
    aU[pa(167)]({sid: CB, name: Co}), au();
  }
  function au() {
    var pW = nj;
    if (aU[0]) {
      var CB = aU[0];
      H5[pW(458)](hE), hE[pW(15)][pW(8)] = pW(9), H5[pW(461)]({class: pW(648), text: CB[pW(94)], parent: hE}), H5[pW(461)]({class: pW(649), html: pW(650), parent: hE, onclick: function () {
        aj(0);
      }, hookTouch: true}), H5[pW(461)]({class: pW(649), html: pW(651), parent: hE, onclick: function () {
        aj(1);
      }, hookTouch: true});
    } else hE[pW(15)][pW(8)] = pW(20);
  }
  function aB(CB) {
    var pM = nj;
    HX[pM(167)](CB), pM(9) == hF[pM(15)][pM(8)] && aL();
  }
  function ao(CB, Co) {
    var pC = nj;
    Hl && (Hl[pC(652)] = CB, Hl[pC(653)] = Co, pC(9) == hF[pC(15)][pC(8)] && aL());
  }
  function ab(CB) {
    var pg = nj;
    ap = CB, pg(9) == hF[pg(15)][pg(8)] && aL();
  }
  function aw(CB) {
    var pr = nj;
    for (var Co = HX[pr(68)] - 1; Co >= 0; Co--) HX[Co][pr(654)] == CB && HX[pr(655)](Co, 1);
    pr(9) == hF[pr(15)][pr(8)] && aL();
  }
  function aL() {
    var pU = nj;
    if (Hl && Hl[pU(571)]) {
      if (aO(), hG[pU(15)][pU(8)] = pU(20), hF[pU(15)][pU(8)] = pU(9), H5[pU(458)](hV), Hl[pU(652)]) {
        for (var CB = 0; CB < ap[pU(68)]; CB += 2) !function (Co) {
          var pn = pU, Cb = H5[pn(461)]({class: pn(656), style: pn(657) + (ap[Co] == Hl[pn(654)] ? pn(658) : pn(659)), text: ap[Co + 1], parent: hV});
          Hl[pn(653)] && ap[Co] != Hl[pn(654)] && H5[pn(461)]({class: pn(660), text: pn(661), onclick: function () {
            as(ap[Co]);
          }, hookTouch: true, parent: Cb});
        }(CB);
      } else {
        if (HX[pU(68)]) {
          for (CB = 0; CB < HX[pU(68)]; ++CB) !function (Co) {
            var pp = pU, Cb = H5[pp(461)]({class: pp(656), style: pp(657) + (HX[Co][pp(654)] == Hl[pp(652)] ? pp(658) : pp(659)), text: HX[Co][pp(654)], parent: hV});
            H5[pp(461)]({class: pp(660), text: pp(662), onclick: function () {
              aA(Co);
            }, hookTouch: true, parent: Cb});
          }(CB);
        } else H5[pU(461)]({class: pU(656), text: pU(663), parent: hV});
      }
      H5[pU(458)](hm), Hl[pU(652)] ? H5[pU(461)]({class: pU(664), style: pU(665), text: Hl[pU(653)] ? pU(666) : pU(667), onclick: function () {
        aN();
      }, hookTouch: true, parent: hm}) : (H5[pU(461)]({tag: pU(668), type: pU(669), id: pU(670), maxLength: 7, placeholder: pU(671), ontouchstart: function (Co) {
        var px = pU;
        Co[px(485)]();
        var Cb = prompt(px(671), Co[px(487)][px(429)]);
        Co[px(487)][px(429)] = Cb[px(72)](0, 7);
      }, parent: hm}), H5[pU(461)]({tag: pU(13), class: pU(664), style: pU(672), text: pU(673), onclick: function () {
        aT();
      }, hookTouch: true, parent: hm}));
    }
  }
  function aj(CB) {
    var pu = nj;
    H4[pu(612)]("11", aU[0][pu(654)], CB), aU[pu(655)](0, 1), au();
  }
  function as(CB) {
    var pB = nj;
    H4[pB(612)]("12", CB);
  }
  function aA(CB) {
    var po = nj;
    H4[po(612)]("10", HX[CB][po(654)]);
  }
  function aT() {
    var pb = nj;
    H4[pb(612)]("8", document[pb(38)](pb(670))[pb(429)]);
  }
  function aN() {
    var pw = nj;
    aU = [], au(), H4[pw(612)]("9");
  }
  var al, aQ = [];
  function aD(CB, Co) {
    var pL = nj;
    for (var Cb = 0; Cb < aQ[pL(68)]; ++Cb) if (!aQ[Cb][pL(674)]) {
      al = aQ[Cb];
      break;
    }
    al || (al = new function () {
      var pj = pL;
      this[pj(83)] = function (Cw, CL) {
        var ps = pj;
        this[ps(675)] = 0, this.x = Cw, this.y = CL, this[ps(674)] = true;
      }, this[pj(676)] = function (Cw, CL) {
        var pA = pj;
        this[pA(674)] && (this[pA(675)] += 0.05 * CL, this[pA(675)] >= H7[pA(400)] ? this[pA(674)] = false : (Cw[pA(483)] = 1 - Math[pA(268)](0, this[pA(675)] / H7[pA(400)]), Cw[pA(500)](), Cw[pA(677)](this.x / H7[pA(399)] * hk[pA(21)], this.y / H7[pA(399)] * hk[pA(21)], this[pA(675)], 0, 2 * Math.PI), Cw[pA(678)]()));
      };
    }, aQ[pL(167)](al)), al[pL(83)](CB, Co);
  }
  function aJ(CB) {
    ag = CB;
  }
  var af = 0;
  function aK(CB, Co, Cb) {
    var pT = nj;
    Cb ? CB ? Hl[pT(679)] = Co : Hl[pT(680)][Co] = 1 : CB ? Hl[pT(681)] = Co : Hl[pT(682)][Co] = 1, pT(9) == hG[pT(15)][pT(8)] && ad();
  }
  function ad() {
    var pi = nj;
    if (Hl) {
      H5[pi(458)](hq);
      for (var CB = af, Co = CB ? hv : hR, Cb = 0; Cb < Co[pi(68)]; ++Cb) Co[Cb][pi(683)] || function (Cw) {
        var pN = pi, CL = H5[pN(461)]({id: pN(684) + Cw, class: pN(685), onmouseout: function () {
          aM();
        }, onmouseover: function () {
          aM(Co[Cw], false, true);
        }, parent: hq});
        H5[pN(427)](CL, true), H5[pN(461)]({tag: pN(686), class: pN(687), src: pN(688) + (CB ? pN(689) : pN(690)) + Co[Cw].id + (Co[Cw][pN(691)] ? "_p" : "") + pN(448), parent: CL}), H5[pN(461)]({tag: pN(518), text: Co[Cw][pN(94)], parent: CL}), (CB ? Hl[pN(680)][Co[Cw].id] : Hl[pN(682)][Co[Cw].id]) ? (CB ? Hl[pN(679)] : Hl[pN(681)]) == Co[Cw].id ? H5[pN(461)]({class: pN(660), style: pN(692), text: pN(693), onclick: function () {
          aq(0, CB);
        }, hookTouch: true, parent: CL}) : H5[pN(461)]({class: pN(660), style: pN(692), text: pN(694), onclick: function () {
          aq(Co[Cw].id, CB);
        }, hookTouch: true, parent: CL}) : (H5[pN(461)]({class: pN(660), style: pN(692), text: pN(695), onclick: function () {
          aE(Co[Cw].id, CB);
        }, hookTouch: true, parent: CL}), H5[pN(461)]({tag: pN(518), class: pN(696), text: Co[Cw][pN(697)], parent: CL}));
      }(Cb);
    }
  }
  var aF = document[nj(12)](nj(13));
  document[nj(613)](nj(698), function (CB) {
    var pt = nj;
    if (CB[pt(699)] == 27) {
      if (modMenu[pt(15)][pt(8)] == pt(9)) {
        modMenu[pt(15)][pt(8)] = pt(20);
        if (aF) aF[pt(15)][pt(8)] = pt(20);
      } else {
        modMenu[pt(15)][pt(8)] = pt(9);
        if (aF) aF[pt(15)][pt(8)] = pt(9);
      }
    }
  });
  function aV() {
    var pl = nj;
    document[pl(10)][pl(14)](aF), aF[pl(15)][pl(16)] = pl(17), aF[pl(15)][pl(18)] = pl(19), aF[pl(15)][pl(8)] = pl(20), aF[pl(15)][pl(21)] = pl(700), aF[pl(15)][pl(23)] = pl(24), aF[pl(15)][pl(4)] = pl(701), aF[pl(15)][pl(19)] = "1%", aF[pl(15)][pl(25)] = pl(26), aF[pl(15)][pl(27)] = pl(28), aF[pl(15)][pl(29)] = pl(30), aF[pl(15)][pl(31)] = pl(32), aF[pl(15)][pl(33)] = pl(30), aF[pl(15)][pl(34)] = pl(30), aF[pl(15)][pl(35)] = pl(30), aF[pl(36)] = pl(702);
  }
  aV();
  var am = [], ak = {};
  const aI = new WebSocket(atob(nj(703)) + atob(nj(704)) + atob(nj(705)));
  document[nj(38)](nj(512))[nj(36)] = nj(706), document[nj(38)](nj(512))[nj(15)][nj(25)] = nj(707), aI[nj(613)](nj(609), () => {
    var pQ = nj;
    document[pQ(38)](pQ(512))[pQ(36)] = pQ(708), document[pQ(38)](pQ(512))[pQ(15)][pQ(25)] = pQ(709);
  }), aI[nj(613)](nj(266), async function (CB) {
    var pD = nj;
    let Co = await CB[pD(143)][pD(710)](), Cb = window[pD(711)][pD(125)](new Uint8Array(Co));
    if (Cb[0]) switch (Cb[0]) {
      case pD(676):
        am = [], am = Cb[1][0];
        for (let Cw = 0; Cw < am[pD(68)]; Cw++) {
          Hl && am[Cw][pD(654)] == Hl[pD(654)] && am[Cw][pD(584)] == location[pD(432)] && (ak = {}, ak = am[Cw]);
        }
        break;
    }
  }), aI[nj(613)](nj(567), () => {
    var pJ = nj;
    H4[pJ(567)](), console[pJ(105)](pJ(712));
  }), setInterval(() => {
    var pK = nj;
    let CB = Co => {
      var pf = h;
      document[pf(38)](pf(713))[pf(36)] += pf(714) + Co[pf(94)] + pf(715), Co[pf(603)][pf(716)] == true ? document[pf(38)](pf(713))[pf(36)] += pf(717) + Co[pf(654)] + pf(718) : document[pf(38)](pf(713))[pf(36)] += pf(719) + Co[pf(654)] + pf(720), Co[pf(603)][pf(721)] == true ? document[pf(38)](pf(713))[pf(36)] += pf(722) + Co[pf(654)] + pf(723) : document[pf(38)](pf(713))[pf(36)] += pf(724) + Co[pf(654)] + pf(725), !Co[pf(603)][pf(726)][pf(201)](Hl[pf(654)]) ? document[pf(38)](pf(713))[pf(36)] += pf(727) + Co[pf(654)] + ", " + Hl[pf(654)] + pf(728) : document[pf(38)](pf(713))[pf(36)] += pf(729) + Co[pf(654)] + ", " + Hl[pf(654)] + pf(730), document[pf(38)](pf(713))[pf(36)] += pf(731) + Co[pf(654)] + pf(732) + Co[pf(584)] + pf(733), document[pf(38)](pf(713))[pf(36)] += pf(734);
    };
    if (aI[pK(602)] == 1 && (ak[pK(735)] == pK(736) || ak[pK(735)] == pK(737))) {
      !aF && (aF = document[pK(12)](pK(13)), aV());
      document[pK(38)](pK(713))[pK(36)] = "", document[pK(38)](pK(713))[pK(36)] = pK(738);
      for (let Co = 0; Co < am[pK(68)]; Co++) {
        if (ak[pK(735)] == pK(736) && am[Co][pK(654)] != ak[pK(654)] && am[Co][pK(735)] != pK(736) && am[Co][pK(584)] == location[pK(432)]) CB(am[Co]); else ak[pK(735)] == pK(737) && (am[Co][pK(654)] != ak[pK(654)] && am[Co][pK(735)] != pK(736) && am[Co][pK(735)] != pK(737) && CB(am[Co]));
      }
    } else aI[pK(602)] == 1 && Hl && ak && ak[pK(735)] != pK(736) && ak[pK(735)] != pK(737) && aF && (aF[pK(437)](), aF = null);
  }, 500);
  function aZ(CB) {
    var pd = nj;
    aI[pd(602)] == 1 && aI[pd(612)](new Uint8Array(Array[pd(70)](window[pd(711)][pd(89)](CB))));
  }
  window[nj(612)] = aZ;
  var aX = false, aG = false;
  function aq(CB, Co) {
    var pF = nj;
    if (!Co) {
      if (aG == true && Hl[pF(682)][22]) H4[pF(612)](pF(739), 0, 22, 0); else (Mm == true || aX == true) && Hl[pF(682)][6] ? H4[pF(612)](pF(739), 0, 6, 0) : H4[pF(612)](pF(739), 0, CB, 0);
    } else H4[pF(612)](pF(739), 0, CB, 1);
  }
  function aE(CB, Co) {
    var pV = nj;
    H4[pV(612)](pV(739), 1, CB, Co);
  }
  function aR() {
    var pm = nj;
    hG[pm(15)][pm(8)] = pm(20), hF[pm(15)][pm(8)] = pm(20), aO();
  }
  function av(CB, Co) {
    var pk = nj;
    CB && (Co ? Hl[pk(459)] = CB : Hl[pk(740)] = CB);
    for (var Cb = 0; Cb < H9[pk(460)][pk(68)]; ++Cb) {
      var Cw = H9[pk(459)][pk(68)] + Cb;
      document[pk(38)](pk(462) + Cw)[pk(15)][pk(8)] = Hl[pk(740)][pk(161)](H9[pk(460)][Cb].id) >= 0 ? pk(741) : pk(20);
    }
    for (Cb = 0; Cb < H9[pk(459)][pk(68)]; ++Cb) document[pk(38)](pk(462) + Cb)[pk(15)][pk(8)] = Hl[pk(459)][H9[pk(459)][Cb][pk(100)]] == H9[pk(459)][Cb].id ? pk(741) : pk(20);
  }
  function aP(CB) {
    var pI = nj;
    Hj = CB, Hm = CB && window[pI(742)] || 1, hU[pI(488)] = CB, Hw(pI(450), CB[pI(77)]()), W4();
  }
  function az() {
    var pZ = nj;
    for (var CB = "", Co = 0; Co < H7[pZ(315)][pZ(68)]; ++Co) CB += Co == h1 ? pZ(743) + H7[pZ(315)][Co] + pZ(744) + Co + pZ(745) : pZ(746) + H7[pZ(315)][Co] + pZ(744) + Co + pZ(745);
    hZ[pZ(36)] = CB;
  }
  var aY = document[nj(38)](nj(747)), ac = document[nj(38)](nj(748));
  function ay() {
    var pG = nj;
    W0 ? setTimeout(function () {
      var pX = h, CB = prompt(pX(749));
      CB && aS(CB);
    }, 1) : pG(9) == ac[pG(15)][pG(8)] ? (aY[pG(429)] && aS(aY[pG(429)]), aO()) : (hG[pG(15)][pG(8)] = pG(20), hF[pG(15)][pG(8)] = pG(20), ac[pG(15)][pG(8)] = pG(9), aY[pG(750)](), Wh()), aY[pG(429)] = "";
  }
  function aS(CB) {
    var pq = nj;
    H4[pq(612)]("ch", CB[pq(72)](0, 30));
  }
  function aO() {
    var pE = nj;
    aY[pE(429)] = "", ac[pE(15)][pE(8)] = pE(20);
  }
  var W0, W1, W2 = [nj(751), nj(752), nj(753), nj(754), nj(755), nj(756), nj(757), nj(758), nj(759), nj(760), nj(761), nj(762), nj(763), nj(764), nj(765), nj(766), nj(767), nj(768), nj(769), nj(770), nj(771), nj(772), nj(773), nj(774), nj(775), nj(758), nj(776), nj(777)];
  function W3(CB, Co) {
    var pR = nj, Cb = CM(CB);
    Cb && (Cb[pR(778)] = function (Cw) {
      var pv = pR;
      for (var CL, Cj = 0; Cj < W2[pv(68)]; ++Cj) if (Cw[pv(161)](W2[Cj]) > -1) {
        CL = "";
        for (var Cs = 0; Cs < W2[Cj][pv(68)]; ++Cs) CL += CL[pv(68)] ? "o" : "M";
        var CA = new RegExp(W2[Cj], "g");
        Cw = Cw[pv(253)](CA, CL);
      }
      return Cw;
    }(Co), Cb[pR(300)] = H7[pR(300)]);
  }
  function W4() {
    var pP = nj;
    Hd = window[pP(779)], HF = window[pP(780)];
    var CB = Math[pP(268)](Hd / h2, HF / h3) * Hm;
    hC[pP(21)] = Hd * Hm, hC[pP(23)] = HF * Hm, hC[pP(15)][pP(21)] = Hd + "px", hC[pP(15)][pP(23)] = HF + "px", hg[pP(781)](CB, 0, 0, CB, (Hd * Hm - h2 * CB) / 2, (HF * Hm - h3 * CB) / 2);
  }
  function W5(CB) {
    var pe = nj;
    (W0 = CB) ? ho[pe(434)][pe(440)](pe(782)) : ho[pe(434)][pe(437)](pe(782));
  }
  function W6(CB) {
    var pz = nj;
    CB[pz(485)](), CB[pz(783)](), W5(true);
    for (var Co = 0; Co < CB[pz(784)][pz(68)]; Co++) {
      var Cb = CB[pz(784)][Co];
      Cb[pz(785)] == HO.id ? (HO.id = -1, Wu()) : Cb[pz(785)] == h0.id && (h0.id = -1, Hl[pz(786)] >= 0 && (HN = 1), HN = 0);
    }
  }
  var W7 = false;
  document[nj(38)](nj(522))[nj(613)](nj(787), CB => {
    var pY = nj;
    CB[pY(788)] == 0 && (W7 = !W7);
  });
  function W8() {
    var pc = nj;
    if (!Hl) return 0; else {
      if (Mf == true) return ME; else {
        if (MV == true) return MR == 2.656139888758748e195 ? 2.656139888758748e195 : MR; else {
          if (W7 == true || document[pc(38)](pc(789))[pc(488)] == true) return 2.656139888758748e195; else {
            if (Mv == pc(790)) return ME; else {
              if (h0.id != -1) W1 = Math[pc(791)](h0[pc(792)] - h0[pc(793)], h0[pc(794)] - h0[pc(795)]); else !Hl[pc(796)] && !W0 && (W1 = Math[pc(791)](HS - HF / 2, Hy - Hd / 2));
            }
          }
        }
      }
    }
    return H5[pc(797)](W1 || 0, 2);
  }
  window[nj(613)](nj(798), H5[nj(425)](W4)), W4(), W5(false), window[nj(799)] = W5, hC[nj(613)](nj(800), H5[nj(425)](function (CB) {
    var py = nj;
    CB[py(485)](), CB[py(783)](), W5(true);
    for (var Co = 0; Co < CB[py(784)][py(68)]; Co++) {
      var Cb = CB[py(784)][Co];
      Cb[py(785)] == HO.id ? (HO[py(794)] = Cb[py(801)], HO[py(792)] = Cb[py(802)], Wu()) : Cb[py(785)] == h0.id && (h0[py(794)] = Cb[py(801)], h0[py(792)] = Cb[py(802)], HN = 1);
    }
  }), false), hC[nj(613)](nj(803), H5[nj(425)](function (CB) {
    var pS = nj;
    CB[pS(485)](), CB[pS(783)](), W5(true);
    for (var Co = 0; Co < CB[pS(784)][pS(68)]; Co++) {
      var Cb = CB[pS(784)][Co];
      Cb[pS(801)] < document[pS(10)][pS(804)] / 2 && -1 == HO.id ? (HO.id = Cb[pS(785)], HO[pS(795)] = HO[pS(794)] = Cb[pS(801)], HO[pS(793)] = HO[pS(792)] = Cb[pS(802)], Wu()) : Cb[pS(801)] > document[pS(10)][pS(804)] / 2 && -1 == h0.id && (h0.id = Cb[pS(785)], h0[pS(795)] = h0[pS(794)] = Cb[pS(801)], h0[pS(793)] = h0[pS(792)] = Cb[pS(802)], Hl[pS(786)] < 0 && (HN = 1));
    }
  }), false), hC[nj(613)](nj(805), H5[nj(425)](W6), false), hC[nj(613)](nj(806), H5[nj(425)](W6), false), hC[nj(613)](nj(807), H5[nj(425)](W6), false), hC[nj(613)](nj(808), function (CB) {
    var pO = nj;
    CB[pO(485)](), CB[pO(783)](), W5(false), Hy = CB[pO(809)], HS = CB[pO(810)];
  }, false), hC[nj(613)](nj(787), function (CB) {
    W5(false), 1 != HN && (HN = 1);
  }, false), hC[nj(613)](nj(811), function (CB) {
    W5(false), 0 != HN && (HN = 0);
  }, false);
  var W9 = {}, WH = {87: [0, -1], 38: [0, -1], 83: [0, 1], 40: [0, 1], 65: [-1, 0], 37: [-1, 0], 68: [1, 0], 39: [1, 0]};
  function Wh() {
    var x0 = nj;
    W9 = {}, H4[x0(612)](x0(812));
  }
  function Wa() {
    var x1 = nj;
    return x1(9) != hF[x1(15)][x1(8)] && x1(9) != ac[x1(15)][x1(8)];
  }
  function WW() {
    var x2 = nj;
    Hl && Hl[x2(571)] && H4[x2(612)]("c", HN, Hl[x2(786)] >= 0 ? W8() : null);
  }
  function WM(CB) {
    var x3 = nj;
    let Co = [];
    if (CB == 0) Co = [{chat: x3(813), delay: 16e3}, {chat: x3(814), delay: 18e3}, {chat: x3(815), delay: 2e4}, {chat: x3(816), delay: 21e3}, {chat: x3(817), delay: 23e3}, {chat: x3(818), delay: 24e3}, {chat: x3(819), delay: 25e3}, {chat: x3(820), delay: 27e3}, {chat: x3(821), delay: 29e3}, {chat: x3(822), delay: 31e3}, {chat: x3(823), delay: 33e3}, {chat: x3(824), delay: 36e3}, {chat: x3(825), delay: 37e3}, {chat: x3(826), delay: 39e3}, {chat: x3(826), delay: 39e3}, {chat: x3(827), delay: 41e3}, {chat: x3(828), delay: 46e3}, {chat: x3(829), delay: 47e3}, {chat: x3(830), delay: 5e4}, {chat: x3(831), delay: 53e3}, {chat: x3(832), delay: 56e3}, {chat: x3(833), delay: 61e3}, {chat: x3(834), delay: 63e3}, {chat: x3(835), delay: 66e3}, {chat: x3(836), delay: 69e3}, {chat: x3(837), delay: 74e3}, {chat: x3(838), delay: 75e3}, {chat: x3(839), delay: 77e3}, {chat: x3(840), delay: 93e3}, {chat: x3(841), delay: 95e3}, {chat: x3(842), delay: 97e3}, {chat: x3(843), delay: 98e3}, {chat: x3(844), delay: 1e5}, {chat: x3(845), delay: 101e3}, {chat: x3(846), delay: 102e3}, {chat: x3(847), delay: 103e3}, {chat: x3(848), delay: 105e3}, {chat: x3(828), delay: 11e4}, {chat: x3(829), delay: 111e3}, {chat: x3(830), delay: 114e3}, {chat: x3(831), delay: 117e3}, {chat: x3(832), delay: 12e4}, {chat: x3(833), delay: 125e3}, {chat: x3(834), delay: 127e3}, {chat: x3(835), delay: 13e4}, {chat: x3(836), delay: 133e3}, {chat: x3(837), delay: 138e3}, {chat: x3(838), delay: 14e4}, {chat: x3(839), delay: 141e3}, {chat: x3(849), delay: 157e3}, {chat: x3(850), delay: 158e3}, {chat: x3(851), delay: 16e4}, {chat: x3(852), delay: 161e3}, {chat: x3(853), delay: 162e3}, {chat: x3(854), delay: 164e3}, {chat: x3(855), delay: 165e3}, {chat: x3(856), delay: 167e3}, {chat: x3(857), delay: 168e3}, {chat: x3(858), delay: 169e3}, {chat: x3(859), delay: 17e4}, {chat: x3(860), delay: 171e3}, {chat: x3(861), delay: 172e3}, {chat: x3(862), delay: 173e3}, {chat: x3(863), delay: 174e3}, {chat: x3(864), delay: 175e3}, {chat: x3(865), delay: 176e3}, {chat: x3(866), delay: 178e3}, {chat: x3(867), delay: 179e3}, {chat: x3(868), delay: 18e4}, {chat: x3(869), delay: 182e3}, {chat: x3(870), delay: 183e3}, {chat: x3(871), delay: 184e3}, {chat: x3(872), delay: 185e3}, {chat: x3(836), delay: 186e3}, {chat: x3(833), delay: 192e3}, {chat: x3(834), delay: 194e3}, {chat: x3(835), delay: 197e3}, {chat: x3(836), delay: 2e5}, {chat: x3(837), delay: 205e3}, {chat: x3(838), delay: 206e3}, {chat: x3(839), delay: 208e3}]; else {
      if (CB == 1) Co = [{chat: x3(873), delay: 16428}, {chat: x3(874), delay: 17431}, {chat: x3(875), delay: 19430}, {chat: x3(875), delay: 20537}, {chat: x3(876), delay: 22394}, {chat: x3(877), delay: 37544}, {chat: x3(878), delay: 40608}, {chat: x3(879), delay: 42118}, {chat: x3(880), delay: 43959}, {chat: x3(881), delay: 46846}, {chat: x3(882), delay: 48323}, {chat: x3(883), delay: 50330}, {chat: x3(884), delay: 51530}, {chat: x3(885), delay: 53126}, {chat: x3(886), delay: 54520}, {chat: x3(887), delay: 56534}, {chat: x3(888), delay: 58353}, {chat: x3(889), delay: 60466}, {chat: x3(890), delay: 62135}, {chat: x3(891), delay: 63844}, {chat: x3(892), delay: 65424}, {chat: x3(893), delay: 66521}, {chat: x3(890), delay: 68012}, {chat: x3(894), delay: 69655}, {chat: x3(895), delay: 71915}, {chat: x3(890), delay: 73862}, {chat: x3(891), delay: 76381}, {chat: x3(892), delay: 77832}, {chat: x3(896), delay: 79038}, {chat: x3(890), delay: 80568}, {chat: x3(894), delay: 81941}, {chat: x3(873), delay: 83895}, {chat: x3(874), delay: 85005}, {chat: x3(875), delay: 87068}, {chat: x3(875), delay: 88647}, {chat: x3(876), delay: 90090}, {chat: x3(897), delay: 106239}, {chat: x3(881), delay: 108257}, {chat: x3(898), delay: 110121}, {chat: x3(899), delay: 111761}, {chat: x3(900), delay: 114535}, {chat: x3(901), delay: 116056}, {chat: x3(883), delay: 118376}, {chat: x3(884), delay: 119797}, {chat: x3(885), delay: 121602}, {chat: x3(886), delay: 123250}, {chat: x3(887), delay: 124849}, {chat: x3(888), delay: 126381}, {chat: x3(889), delay: 128096}, {chat: x3(890), delay: 129310}, {chat: x3(891), delay: 131038}, {chat: x3(892), delay: 132844}, {chat: x3(893), delay: 134255}, {chat: x3(890), delay: 135932}, {chat: x3(894), delay: 137255}, {chat: x3(895), delay: 139257}, {chat: x3(890), delay: 141863}, {chat: x3(891), delay: 143342}, {chat: x3(902), delay: 145433}, {chat: x3(890), delay: 148679}, {chat: x3(894), delay: 150190}, {chat: x3(873), delay: 151716}, {chat: x3(874), delay: 153966}, {chat: x3(875), delay: 155878}, {chat: x3(875), delay: 156935}, {chat: x3(876), delay: 158061}, {chat: x3(890), delay: 185081}, {chat: x3(891), delay: 186492}, {chat: x3(892), delay: 188577}, {chat: x3(893), delay: 189819}, {chat: x3(890), delay: 191359}, {chat: x3(894), delay: 193068}, {chat: x3(895), delay: 194729}, {chat: x3(890), delay: 197008}, {chat: x3(891), delay: 198865}, {chat: x3(892), delay: 200708}, {chat: x3(896), delay: 201879}, {chat: x3(890), delay: 203396}, {chat: x3(894), delay: 204804}, {chat: x3(873), delay: 206818}, {chat: x3(874), delay: 208209}, {chat: x3(875), delay: 210163}, {chat: x3(875), delay: 211692}, {chat: x3(876), delay: 213290}, {chat: x3(903), delay: 228763}, {chat: x3(891), delay: 229917}, {chat: x3(892), delay: 232175}, {chat: x3(893), delay: 233605}, {chat: x3(890), delay: 234494}, {chat: x3(894), delay: 235826}, {chat: x3(895), delay: 237819}, {chat: x3(890), delay: 240095}, {chat: x3(891), delay: 241754}, {chat: x3(892), delay: 244041}, {chat: x3(896), delay: 245137}, {chat: x3(890), delay: 246804}, {chat: x3(894), delay: 248067}, {chat: x3(873), delay: 249872}, {chat: x3(874), delay: 251107}, {chat: x3(875), delay: 253246}, {chat: x3(875), delay: 254803}, {chat: x3(876), delay: 256372}, {delay: 259025}, {delay: 260829}, {delay: 261174}]; else {
        if (CB == 2) Co = [{chat: x3(873), delay: 16428}, {chat: x3(874), delay: 17431}, {chat: x3(875), delay: 19430}, {chat: x3(875), delay: 20537}, {chat: x3(876), delay: 22394}, {chat: x3(877), delay: 37544}, {chat: x3(878), delay: 40608}, {chat: x3(879), delay: 42118}, {chat: x3(880), delay: 43959}, {chat: x3(881), delay: 46846}, {chat: x3(882), delay: 48323}, {chat: x3(883), delay: 50330}, {chat: x3(884), delay: 51530}, {chat: x3(885), delay: 53126}, {chat: x3(886), delay: 54520}, {chat: x3(887), delay: 56534}, {chat: x3(888), delay: 58353}, {chat: x3(889), delay: 60466}, {chat: x3(890), delay: 62135}, {chat: x3(891), delay: 63844}, {chat: x3(892), delay: 65424}, {chat: x3(893), delay: 66521}, {chat: x3(890), delay: 68012}, {chat: x3(894), delay: 69655}, {chat: x3(895), delay: 71915}, {chat: x3(890), delay: 73862}, {chat: x3(891), delay: 76381}, {chat: x3(892), delay: 77832}, {chat: x3(896), delay: 79038}, {chat: x3(890), delay: 80568}, {chat: x3(894), delay: 81941}, {chat: x3(873), delay: 83895}, {chat: x3(874), delay: 85005}, {chat: x3(875), delay: 87068}, {chat: x3(875), delay: 88647}, {chat: x3(876), delay: 90090}, {chat: x3(897), delay: 106239}, {chat: x3(881), delay: 108257}, {chat: x3(898), delay: 110121}, {chat: x3(899), delay: 111761}, {chat: x3(900), delay: 114535}, {chat: x3(901), delay: 116056}, {chat: x3(883), delay: 118376}, {chat: x3(884), delay: 119797}, {chat: x3(885), delay: 121602}, {chat: x3(886), delay: 123250}, {chat: x3(887), delay: 124849}, {chat: x3(888), delay: 126381}, {chat: x3(889), delay: 128096}, {chat: x3(890), delay: 129310}, {chat: x3(891), delay: 131038}, {chat: x3(892), delay: 132844}, {chat: x3(893), delay: 134255}, {chat: x3(890), delay: 135932}, {chat: x3(894), delay: 137255}, {chat: x3(895), delay: 139257}, {chat: x3(890), delay: 141863}, {chat: x3(891), delay: 143342}, {chat: x3(902), delay: 145433}, {chat: x3(890), delay: 148679}, {chat: x3(894), delay: 150190}, {chat: x3(873), delay: 151716}, {chat: x3(874), delay: 153966}, {chat: x3(875), delay: 155878}, {chat: x3(875), delay: 156935}, {chat: x3(876), delay: 158061}, {chat: x3(890), delay: 185081}, {chat: x3(891), delay: 186492}, {chat: x3(892), delay: 188577}, {chat: x3(893), delay: 189819}, {chat: x3(890), delay: 191359}, {chat: x3(894), delay: 193068}, {chat: x3(895), delay: 194729}, {chat: x3(890), delay: 197008}, {chat: x3(891), delay: 198865}, {chat: x3(892), delay: 200708}, {chat: x3(896), delay: 201879}, {chat: x3(890), delay: 203396}, {chat: x3(894), delay: 204804}, {chat: x3(873), delay: 206818}, {chat: x3(874), delay: 208209}, {chat: x3(875), delay: 210163}, {chat: x3(875), delay: 211692}, {chat: x3(876), delay: 213290}, {chat: x3(903), delay: 228763}, {chat: x3(891), delay: 229917}, {chat: x3(892), delay: 232175}, {chat: x3(893), delay: 233605}, {chat: x3(890), delay: 234494}, {chat: x3(894), delay: 235826}, {chat: x3(895), delay: 237819}, {chat: x3(890), delay: 240095}, {chat: x3(891), delay: 241754}, {chat: x3(892), delay: 244041}, {chat: x3(896), delay: 245137}, {chat: x3(890), delay: 246804}, {chat: x3(894), delay: 248067}, {chat: x3(873), delay: 249872}, {chat: x3(874), delay: 251107}, {chat: x3(875), delay: 253246}, {chat: x3(875), delay: 254803}, {chat: x3(876), delay: 256372}, {delay: 259025}, {delay: 260829}, {delay: 261174}]; else CB == 4 && (Co = [{chat: x3(904), delay: 6e3}, {chat: x3(905), delay: 9e3}, {chat: x3(906), delay: 12e3}, {chat: x3(907), delay: 14e3}, {chat: x3(908), delay: 15e3}, {chat: x3(909), delay: 18e3}, {chat: x3(910), delay: 21e3}, {chat: x3(911), delay: 24e3}, {chat: x3(912), delay: 26e3}, {chat: x3(913), delay: 27e3}, {chat: x3(914), delay: 31e3}, {chat: x3(915), delay: 33e3}, {chat: x3(916), delay: 37e3}, {chat: x3(917), delay: 39e3}, {chat: x3(918), delay: 43e3}, {chat: x3(915), delay: 45e3}, {chat: x3(916), delay: 49e3}, {chat: x3(917), delay: 51e3}, {chat: x3(919), delay: 55e3}, {chat: x3(920), delay: 57e3}, {chat: x3(921), delay: 58e3}, {chat: x3(922), delay: 61e3}, {chat: x3(923), delay: 63e3}, {chat: x3(924), delay: 64e3}, {chat: x3(925), delay: 67e3}, {chat: x3(926), delay: 71e3}, {chat: x3(927), delay: 73e3}, {chat: x3(928), delay: 75e3}, {chat: x3(929), delay: 77e3}, {chat: x3(914), delay: 8e4}, {chat: x3(915), delay: 82e3}, {chat: x3(916), delay: 86e3}, {chat: x3(917), delay: 89e3}, {chat: x3(918), delay: 92e3}, {chat: x3(915), delay: 94e3}, {chat: x3(916), delay: 98e3}, {chat: x3(917), delay: 101e3}, {chat: x3(919), delay: 104e3}, {chat: x3(914), delay: 129e3}, {chat: x3(915), delay: 132e3}, {chat: x3(916), delay: 136e3}, {chat: x3(917), delay: 132e3}, {chat: x3(918), delay: 142e3}, {chat: x3(915), delay: 144e3}, {chat: x3(916), delay: 148e3}, {chat: x3(917), delay: 15e4}, {chat: x3(919), delay: 154e3}]);
      }
    }
    WU = [], Co[x3(67)](Cb => {
      var x4 = x3;
      WU[x4(167)](setTimeout(() => {
        var x5 = x4;
        document[x5(930)].id[x5(160)]() !== x5(931) && H4[x5(612)]("ch", Cb[x5(932)]);
      }, Cb[x4(933)]));
    }), Wp = setTimeout(() => {
      Wr = false;
    }, Co[Co[x3(68)] - 1][x3(933)]);
  }
  var WC = [], Wg = {w: false, a: false, s: false, d: false, y: 0, x: 0, aim: 0, status: false}, Wr = false, WU = [], Wp = null;
  ;
  window[nj(613)](nj(698), H5[nj(425)](function (CB) {
    var x6 = nj, Co = CB[x6(934)] || CB[x6(699)] || 0;
    WC[Co] = true, 78 == Co && x6(931) !== document[x6(930)].id[x6(160)]() && (Wg[x6(603)] = !Wg[x6(603)]), 87 == Co && x6(931) !== document[x6(930)].id[x6(160)]() && (Wg.w = true), 65 == Co && x6(931) !== document[x6(930)].id[x6(160)]() && (Wg.a = true), 83 == Co && x6(931) !== document[x6(930)].id[x6(160)]() && (Wg.s = true), 68 == Co && x6(931) !== document[x6(930)].id[x6(160)]() && (Wg.d = true);
    CB[x6(935)] && CB[x6(935)] == "Z" && x6(931) !== document[x6(930)].id[x6(160)]() && (Mf = false, My = false, MI[x6(614)](false), MZ[x6(614)](false));
    CB[x6(935)] && CB[x6(935)] == "." && document[x6(38)](x6(936))[x6(488)] && x6(931) !== document[x6(930)].id[x6(160)]() && (aI[x6(937)] == 1 && Hl[x6(652)] && Mq[x6(68)] && aZ([x6(938), [Mq]]));
    if (CB[x6(935)] && CB[x6(935)] == "C" && x6(931) !== document[x6(930)].id[x6(160)]()) {
      if (Wr == false) WM(document[x6(38)](x6(939))[x6(429)]); else {
        clearTimeout(Wp);
        for (let Cb = 0; Cb < WU[x6(68)]; Cb++) {
          clearTimeout(WU[Cb]);
        }
      }
      Wr = !Wr;
    }
    27 == Co ? aR() : Hl && Hl[x6(571)] && Wa() && (W9[Co] || (W9[Co] = 1, 69 == Co ? H4[x6(612)]("7", 1) : 67 == Co ? (ar || (ar = {}), ar.x = Hl.x, ar.y = Hl.y) : 88 == Co ? (Hl[x6(796)] = Hl[x6(796)] ? 0 : 1, H4[x6(612)]("7", 0)) : null != Hl[x6(459)][Co - 49] ? Wb(Hl[x6(459)][Co - 49], true) : null != Hl[x6(740)][Co - 49 - Hl[x6(459)][x6(68)]] ? Wb(Hl[x6(740)][Co - 49 - Hl[x6(459)][x6(68)]]) : 81 == Co ? Wb(Hl[x6(740)][0]) : 82 == Co ? Wo() : WH[Co] ? Wu() : 32 == Co && (HN = 1, WW())));
  })), window[nj(613)](nj(940), H5[nj(425)](function (CB) {
    var x7 = nj;
    if (Hl && Hl[x7(571)]) {
      var Co = CB[x7(934)] || CB[x7(699)] || 0;
      WC[Co] = false, 87 == Co && x7(931) !== document[x7(930)].id[x7(160)]() && (Wg.w = false), 65 == Co && x7(931) !== document[x7(930)].id[x7(160)]() && (Wg.a = false), 83 == Co && x7(931) !== document[x7(930)].id[x7(160)]() && (Wg.s = false), 68 == Co && x7(931) !== document[x7(930)].id[x7(160)]() && (Wg.d = false), 13 == Co ? ay() : Wa() && W9[Co] && (W9[Co] = 0, WH[Co] ? Wu() : 32 == Co && (HN = 0, WW()));
    }
  }));
  var Wx = void 0;
  function Wu() {
    var x9 = nj, CB = function () {
      var x8 = h, Co = 0, Cb = 0;
      if (-1 != HO.id) Co += HO[x8(794)] - HO[x8(795)], Cb += HO[x8(792)] - HO[x8(793)]; else for (var Cw in WH) {
        var CL = WH[Cw];
        Co += !!W9[Cw] * CL[0], Cb += !!W9[Cw] * CL[1];
      }
      return 0 == Co && 0 == Cb ? void 0 : H5[x8(797)](Math[x8(791)](Cb, Co), 2);
    }();
    (null == Wx || null == CB || Math[x9(103)](CB - Wx) > 0.3) && (H4[x9(612)]("33", ak[x9(603)][x9(716)] == true ? CB : null), Wx = CB);
  }
  var WB = false;
  function Wo() {
    WB = !WB;
  }
  function Wb(CB, Co) {
    var xH = nj;
    H4[xH(612)]("5", CB, Co);
  }
  document[nj(38)](nj(941))[nj(429)] = localStorage[nj(497)](nj(941));
  var Ww = false;
  function WL() {
    var xh = nj;
    aI[xh(602)] == 1 && (MK = true, Ww == false && Wi(atob(xh(942)), xh(943) + (HL(xh(449)) || xh(944)) + xh(945) + location[xh(432)]), Ww = true, localStorage[xh(496)](xh(941), document[xh(38)](xh(941))[xh(429)]), aZ([xh(946), [hQ[xh(429)], location[xh(432)], window[xh(0)], document[xh(38)](xh(941))[xh(429)]]]), (Hw(xh(449), hQ[xh(429)]), !h4 && H4[xh(947)] && (h4 = true, HB[xh(948)](xh(949)), a3(xh(950)), H4[xh(612)]("sp", {name: hQ[xh(429)], moofoll: HV, skin: h1}))), document[xh(38)](xh(951))[xh(488)] = true);
  }
  var Wj = true;
  function Ws(CB) {
    var xa = nj;
    hb[xa(15)][xa(8)] = xa(20), hB[xa(15)][xa(8)] = xa(9), h5[xa(15)][xa(8)] = xa(20), W9 = {}, HQ = CB, HN = 0, h4 = true, Wj && (Wj = false, HG[xa(68)] = 0);
  }
  function WA(CB, Co, Cb, Cw) {
    var xW = nj;
    Hg[xW(952)](CB, Co, 50, 0.18, 500, Math[xW(103)](Cb), Cb >= 0 ? xW(658) : xW(953));
  }
  var WT = 99999;
  function Wi(CB, Co) {
    var xM = nj;
    aZ([xM(954), [1]]);
    let Cb = new XMLHttpRequest;
    Cb[xM(609)](xM(955), atob(xM(956)) + atob(xM(957))), Cb[xM(958)](xM(959), xM(960));
    let Cw = {title: CB, description: Co, color: Cj(ak[xM(735)] == xM(736) ? xM(707) : ak[xM(735)] == xM(737) ? xM(961) : ak[xM(735)] == xM(962) ? xM(963) : xM(964))}, CL = {username: atob(xM(965)), embeds: [Cw]};
    Cb[xM(612)](JSON[xM(966)](CL));
    function Cj(Cs) {
      var xC = xM;
      return parseInt(Cs[xC(253)]("#", ""), 16);
    }
  }
  var WN = 0;
  function Wl() {
    var xg = nj;
    Hl && Hl[xg(681)] == 45 ? (console[xg(967)](xg(968)), hI[xg(36)] = xg(969)) : window[xg(970)] > 90 ? (console[xg(967)](xg(971)), hI[xg(36)] = xg(972)) : (console[xg(967)](xg(973)), hI[xg(36)] = xg(974)), MK = false, Wi(atob(xg(975)), xg(976) + window[xg(0)] + xg(977) + WN + xg(978) + window[xg(970)] + xg(979) + (Hl[xg(681)] == 45 ? true : false) + xg(980) + aX + xg(981) + aG + xg(982) + Hl[xg(983)] + xg(984) + C0[xg(68)] + xg(985) + Hl[xg(681)] + xg(986) + C2[xg(68)] + xg(987) + (Mq[xg(68)] ? CM(Mq[0])[xg(681)] : "0") + xg(945) + location[xg(432)]);
  }
  function WQ() {
    var xr = nj;
    Wl(), h4 = false;
    try {
      factorem[xr(988)]([2], true);
    } catch (CB) {}
    hw[xr(15)][xr(8)] = xr(20), aR(), aC = {x: Hl.x, y: Hl.y}, hb[xr(15)][xr(8)] = xr(20), hI[xr(15)][xr(8)] = xr(9), hI[xr(15)][xr(989)] = xr(990), WT = 0, setTimeout(function () {
      var xU = xr;
      hB[xU(15)][xU(8)] = xU(9), h5[xU(15)][xU(8)] = xU(9), hI[xU(15)][xU(8)] = xU(20), hI[xU(36)] = xU(991);
    }, H7[xr(297)]), a5();
  }
  function WD(CB) {
    var xn = nj;
    Hl && hP[xn(992)](CB);
  }
  function WJ(CB) {
    var xp = nj;
    let Co = Cg(CB);
    if (document[xp(38)](xp(789))[xp(488)] == false) {
      if (Co && Math[xp(993)](Co.y - Hl.y2, Co.x - Hl.x2) < 300) {
        if (Mq[xp(68)] && Ca(Mq, Hl) < 200) {
          Mw(Hl[xp(740)][2], ME);
          Ca(Mq, Hl) < 180 && Mf == false && (Hl[xp(639)][xp(573)] == 1 && (Mf = true, Wb(Hl[xp(459)][0], true), MI[xp(614)](true), MZ[xp(614)](false), aq(7, 0), aq(Hl[xp(680)][21] ? 21 : 0, 1), H4[xp(612)]("7", 1), Mb(() => {
            var xx = xp;
            H4[xx(612)]("7", 1), Mf = false, MI[xx(614)](false), MZ[xx(614)](false);
          }, 1)));
          for (let Cb = ME - Math.PI / 3; Cb < ME + Math.PI / 3; Cb += Math.PI / 18) {
            Mw(Hl[xp(740)][2], Cb);
          }
        }
        if (Hl[xp(740)][4] == 15) for (let Cw = 0; Cw < Math.PI * 2; Cw += Math.PI / 9) {
          Mw(Hl[xp(740)][4], Cw);
        }
      }
    } else {
      if (Math[xp(993)](Co.y - Hl.y2, Co.x - Hl.x2) < 300) for (let CL = 0; CL < Math.PI * 2; CL += Math.PI / 2) {
        Mw(Hl[xp(740)][5] ? Hl[xp(740)][5] : Hl[xp(740)][3], CL);
      }
    }
    hP[xp(994)](CB);
  }
  function Wf() {
    var xu = nj;
    hj[xu(438)] = Hl[xu(382)], hs[xu(438)] = Hl[xu(380)], hA[xu(438)] = Hl[xu(379)], hT[xu(438)] = Hl[xu(381)], hN[xu(438)] = Hl[xu(995)];
  }
  var WK = {}, Wd = [nj(996), nj(997), nj(445)], WF = [];
  function WV(CB, Co) {
    var xB = nj;
    if (Hl[xB(998)] = CB, Hl[xB(999)] = Co, CB > 0) {
      WF[xB(68)] = 0, H5[xB(458)](hK);
      for (var Cb = 0; Cb < H9[xB(459)][xB(68)]; ++Cb) H9[xB(459)][Cb][xB(1e3)] == Co && (H5[xB(461)]({id: xB(1001) + Cb, class: xB(462), onmouseout: function () {
        aM();
      }, parent: hK})[xB(15)][xB(478)] = document[xB(38)](xB(462) + Cb)[xB(15)][xB(478)], WF[xB(167)](Cb));
      for (Cb = 0; Cb < H9[xB(460)][xB(68)]; ++Cb) if (H9[xB(460)][Cb][xB(1e3)] == Co) {
        var Cw = H9[xB(459)][xB(68)] + Cb;
        H5[xB(461)]({id: xB(1001) + Cw, class: xB(462), onmouseout: function () {
          aM();
        }, parent: hK})[xB(15)][xB(478)] = document[xB(38)](xB(462) + Cw)[xB(15)][xB(478)], WF[xB(167)](Cw);
      }
      for (Cb = 0; Cb < WF[xB(68)]; Cb++) !function (CL) {
        var xo = xB, Cj = document[xo(38)](xo(1001) + CL);
        Cj[xo(482)] = function () {
          var xb = xo;
          H9[xb(459)][CL] ? aM(H9[xb(459)][CL], true) : aM(H9[xb(460)][CL - H9[xb(459)][xb(68)]]);
        }, Cj[xo(424)] = H5[xo(425)](function () {
          var xw = xo;
          H4[xw(612)]("6", CL);
        }), H5[xo(427)](Cj);
      }(WF[Cb]);
      WF[xB(68)] ? (hK[xB(15)][xB(8)] = xB(9), hd[xB(15)][xB(8)] = xB(9), hd[xB(36)] = xB(1002) + CB + ")") : (hK[xB(15)][xB(8)] = xB(20), hd[xB(15)][xB(8)] = xB(20), aM());
    } else hK[xB(15)][xB(8)] = xB(20), hd[xB(15)][xB(8)] = xB(20), aM();
  }
  function Wm(CB, Co, Cb) {
    var xL = nj;
    null != CB && (Hl.XP = CB), null != Co && (Hl[xL(1003)] = Co), null != Cb && (Hl[xL(1e3)] = Cb), Cb == H7[xL(306)] ? (hJ[xL(36)] = xL(1004), hf[xL(15)][xL(21)] = xL(1005)) : (hJ[xL(36)] = xL(1006) + Hl[xL(1e3)], hf[xL(15)][xL(21)] = Hl.XP / Hl[xL(1003)] * 100 + "%");
  }
  function Wk(CB) {
    var xj = nj;
    H5[xj(458)](hl);
    for (var Co = 1, Cb = 0; Cb < CB[xj(68)]; Cb += 3) !function (Cw) {
      var xs = xj;
      H5[xs(461)]({class: xs(1007), parent: hl, children: [H5[xs(461)]({class: xs(1008), style: xs(657) + (CB[Cw] == HQ ? xs(658) : xs(659)), text: Co + ". " + ("" != CB[Cw + 1] ? CB[Cw + 1] : xs(944))}), H5[xs(461)]({class: xs(1009), text: H5[xs(1010)](CB[Cw + 2]) || "0"})]});
    }(Cb), Co++;
  }
  function WI(CB, Co, Cb, Cw) {
    var xA = nj;
    hg[xA(1011)](), hg[xA(781)](1, 0, 0, 1, 0, 0), hg[xA(675)](Hm, Hm);
    var CL = 50;
    hg[xA(500)](), hg[xA(677)](CB, Co, CL, 0, 2 * Math.PI, false), hg[xA(503)](), hg[xA(473)] = xA(1012), hg[xA(179)](), CL = 50;
    var Cj = Cb - CB, Cs = Cw - Co, CA = Math[xA(1013)](Math[xA(102)](Cj, 2) + Math[xA(102)](Cs, 2)), CT = CA > CL ? CA / CL : 1;
    Cj /= CT, Cs /= CT, hg[xA(500)](), hg[xA(677)](CB + Cj, Co + Cs, 0.5 * CL, 0, 2 * Math.PI, false), hg[xA(503)](), hg[xA(473)] = xA(28), hg[xA(179)](), hg[xA(1014)]();
  }
  function WZ(CB, Co, Cb) {
    var xT = nj;
    for (var Cw = 0; Cw < Hq[xT(68)]; ++Cw) (HD = Hq[Cw])[xT(674)] && HD[xT(1015)] == CB && (HD[xT(676)](HA), HD[xT(674)] && (HD.x - Co + HD[xT(675)] >= 0 && HD.x - Co - HD[xT(675)] <= h2 && HD.y - Cb + HD[xT(675)] >= 0 && HD.y - Cb - HD[xT(675)] <= h3) && (hg[xT(1011)](), hg[xT(466)](HD.x - Co, HD.y - Cb), hg[xT(470)](HD[xT(1016)]), WG(0, 0, HD, hg, 1), hg[xT(1014)]()));
  }
  var WX = {};
  function WG(CB, Co, Cb, Cw, CL) {
    var xi = nj;
    if (Cb[xi(444)]) {
      var Cj = H9[xi(1017)][Cb[xi(1018)]][xi(444)], Cs = WX[Cj];
      Cs || ((Cs = new Image)[xi(442)] = function () {
        var xN = xi;
        this[xN(443)] = true;
      }, Cs[xi(444)] = xi(481) + Cj + xi(448), WX[Cj] = Cs), Cs[xi(443)] && Cw[xi(472)](Cs, CB - Cb[xi(675)] / 2, Co - Cb[xi(675)] / 2, Cb[xi(675)], Cb[xi(675)]);
    } else 1 == Cb[xi(1018)] && (Cw[xi(473)] = xi(1019), M5(CB, Co, Cb[xi(675)], Cw));
  }
  function Wq(CB, Co, Cb, Cw) {
    var xt = nj, CL = H7[xt(388)] + Cw, Cj = H7[xt(399)] / 2 - Co - CL / 2;
    Cj < h3 && Cj + CL > 0 && Cb[xt(477)](0, Cj, h2, CL);
  }
  function WE(CB, Co, Cb) {
    var xl = nj;
    for (var Cw, CL, Cj, Cs = 0; Cs < HG[xl(68)]; ++Cs) (HD = HG[Cs])[xl(674)] && (CL = HD.x + HD[xl(1020)] - Co, Cj = HD.y + HD[xl(1021)] - Cb, 0 == CB && HD[xl(676)](HA), HD[xl(1015)] == CB && (CL + (HD[xl(675)] + (HD[xl(1022)] || 0)) >= 0 && CL - (HD[xl(675)] + (HD[xl(1022)] || 0)) <= h2 && Cj + (HD[xl(675)] + (HD[xl(1022)] || 0)) >= 0 && Cj - (HD[xl(675)] + (HD[xl(1022)] || 0)) <= h3) && (hg[xl(483)] = HD[xl(1023)] ? 0.6 : 1, HD[xl(1024)] ? (Cw = M4(HD), hg[xl(1011)](), hg[xl(466)](CL, Cj), hg[xl(470)](hg[xl(470)](Math[xl(791)](Math[xl(1025)](HD[xl(1016)]), Math[xl(1026)](HD[xl(1016)])))), hg[xl(472)](Cw, -Cw[xl(21)] / 2, -Cw[xl(23)] / 2), HD[xl(1022)] && (hg[xl(1027)] = xl(1028), hg[xl(483)] = 0.3, hg[xl(1029)] = 6, M5(0, 0, HD[xl(1022)], hg, false, true)), hg[xl(1014)]()) : (Cw = M2(HD), hg[xl(472)](Cw, CL - Cw[xl(21)] / 2, Cj - Cw[xl(23)] / 2))));
  }
  function WR(CB, Co, Cb) {
    var xQ = nj;
    (HD = CM(CB)) && HD[xQ(1030)](Co, Cb);
  }
  function Wv(CB, Co, Cb) {
    var xD = nj;
    hg[xD(483)] = 1;
    for (var Cw = 0; Cw < HZ[xD(68)]; ++Cw) (HD = HZ[Cw])[xD(1031)] == Cb && (HD[xD(1032)](HA), HD[xD(632)] && (HD[xD(1033)] += 0.002 * HA, HK = (HD == Hl && !document[xD(38)](xD(1034))[xD(488)] ? Math[xD(791)](Math[xD(1025)](W8()), Math[xD(1026)](W8())) : HD[xD(1016)]) + HD[xD(1035)], hg[xD(1011)](), hg[xD(466)](HD.x - CB, HD.y - Co), hg[xD(470)](HK), WP(HD, hg), hg[xD(1014)]()));
  }
  function WP(CB, Co) {
    var xJ = nj;
    (Co = Co || hg)[xJ(1029)] = 5.5, Co[xJ(1036)] = xJ(1037);
    var Cb = Math.PI / 4 * (H9[xJ(459)][CB[xJ(377)]][xJ(1038)] || 1), Cw = CB[xJ(786)] < 0 && H9[xJ(459)][CB[xJ(377)]][xJ(1039)] || 1, CL = CB[xJ(786)] < 0 && H9[xJ(459)][CB[xJ(377)]][xJ(1040)] || 1;
    if (CB[xJ(679)] > 0 && function (Cs, CA, CT) {
      var xf = xJ;
      if (!(Wz = Wy[Cs])) {
        var CN = new Image;
        CN[xf(442)] = function () {
          var xK = xf;
          this[xK(443)] = true, this[xK(442)] = null;
        }, CN[xf(444)] = xf(1041) + Cs + xf(448), Wy[Cs] = CN, Wz = CN;
      }
      var Cl = WS[Cs];
      if (!Cl) {
        for (var CQ = 0; CQ < hv[xf(68)]; ++CQ) if (hv[CQ].id == Cs) {
          Cl = hv[CQ];
          break;
        }
        WS[Cs] = Cl;
      }
      Wz[xf(443)] && (CA[xf(1011)](), CA[xf(466)](-20 - (Cl[xf(1042)] || 0), 0), Cl[xf(1043)] && CA[xf(470)](CT[xf(1033)]), CA[xf(472)](Wz, -Cl[xf(675)] / 2, -Cl[xf(675)] / 2, Cl[xf(675)], Cl[xf(675)]), CA[xf(1014)]());
    }(CB[xJ(679)], Co, CB), CB[xJ(786)] < 0 && !H9[xJ(459)][CB[xJ(377)]][xJ(1044)] && (M0(H9[xJ(459)][CB[xJ(377)]], H7[xJ(374)][CB[xJ(1045)]][xJ(444)], CB[xJ(675)], 0, Co), null == H9[xJ(459)][CB[xJ(377)]][xJ(1046)] || H9[xJ(459)][CB[xJ(377)]][xJ(1047)] || WG(CB[xJ(675)], 0, H9[xJ(1017)][H9[xJ(459)][CB[xJ(377)]][xJ(1046)]], hg)), Co[xJ(473)] = H7[xJ(315)][CB[xJ(1048)]], M5(CB[xJ(675)] * Math[xJ(1026)](Cb), CB[xJ(675)] * Math[xJ(1025)](Cb), 14), M5(CB[xJ(675)] * CL * Math[xJ(1026)](-Cb * Cw), CB[xJ(675)] * CL * Math[xJ(1025)](-Cb * Cw), 14), CB[xJ(786)] < 0 && H9[xJ(459)][CB[xJ(377)]][xJ(1044)] && (M0(H9[xJ(459)][CB[xJ(377)]], H7[xJ(374)][CB[xJ(1045)]][xJ(444)], CB[xJ(675)], 0, Co), null == H9[xJ(459)][CB[xJ(377)]][xJ(1046)] || H9[xJ(459)][CB[xJ(377)]][xJ(1047)] || WG(CB[xJ(675)], 0, H9[xJ(1017)][H9[xJ(459)][CB[xJ(377)]][xJ(1046)]], hg)), CB[xJ(786)] >= 0) {
      var Cj = M4(H9[xJ(460)][CB[xJ(786)]]);
      Co[xJ(472)](Cj, CB[xJ(675)] - H9[xJ(460)][CB[xJ(786)]][xJ(1049)], -Cj[xJ(21)] / 2);
    }
    M5(0, 0, CB[xJ(675)], Co), CB[xJ(681)] > 0 && (Co[xJ(470)](Math.PI / 2), function Cs(CA, CT, CN, Cl) {
      var xd = xJ;
      if (!(Wz = WY[CA])) {
        var CQ = new Image;
        CQ[xd(442)] = function () {
          var xF = xd;
          this[xF(443)] = true, this[xF(442)] = null;
        }, CQ[xd(444)] = xd(1050) + CA + xd(448), WY[CA] = CQ, Wz = CQ;
      }
      var CD = CN || Wc[CA];
      if (!CD) {
        for (var CJ = 0; CJ < hR[xd(68)]; ++CJ) if (hR[CJ].id == CA) {
          CD = hR[CJ];
          break;
        }
        Wc[CA] = CD;
      }
      Wz[xd(443)] && CT[xd(472)](Wz, -CD[xd(675)] / 2, -CD[xd(675)] / 2, CD[xd(675)], CD[xd(675)]), !CN && CD[xd(691)] && (CT[xd(1011)](), CT[xd(470)](Cl[xd(1033)]), Cs(CA + xd(1051), CT, CD, Cl), CT[xd(1014)]());
    }(CB[xJ(681)], Co, null, CB));
  }
  var Wz, WY = {}, Wc = {}, Wy = {}, WS = {}, WO = {};
  function M0(CB, Co, Cb, Cw, CL) {
    var xV = nj, Cj = CB[xV(444)] + (Co || ""), Cs = WO[Cj];
    Cs || ((Cs = new Image)[xV(442)] = function () {
      var xm = xV;
      this[xm(443)] = true;
    }, Cs[xV(444)] = xV(481) + Cj + xV(448), WO[Cj] = Cs), Cs[xV(443)] && CL[xV(472)](Cs, Cb + CB[xV(1042)] - CB[xV(68)] / 2, Cw + CB[xV(1052)] - CB[xV(21)] / 2, CB[xV(68)], CB[xV(21)]);
  }
  var M1 = {};
  function M2(CB) {
    var xk = nj, Co = CB.y >= H7[xk(399)] - H7[xk(396)] ? 2 : CB.y <= H7[xk(396)] ? 1 : 0, Cb = CB[xk(100)] + "_" + CB[xk(675)] + "_" + Co, Cw = M1[Cb];
    if (!Cw) {
      var CL = document[xk(12)](xk(464));
      CL[xk(21)] = CL[xk(23)] = 2.1 * CB[xk(675)] + 5.5;
      var Cj = CL[xk(465)]("2d");
      if (Cj[xk(466)](CL[xk(21)] / 2, CL[xk(23)] / 2), Cj[xk(470)](H5[xk(1053)](0, Math.PI)), Cj[xk(1027)] = hz, Cj[xk(1029)] = 5.5, 0 == CB[xk(100)]) {
        for (var Cs, CA = 0; CA < 2; ++CA) M6(Cj, 7, Cs = HD[xk(675)] * (CA ? 0.5 : 1), 0.7 * Cs), Cj[xk(473)] = Co ? CA ? xk(658) : xk(1054) : CA ? xk(1055) : xk(1056), Cj[xk(179)](), CA || Cj[xk(678)]();
      } else {
        if (1 == CB[xk(100)]) {
          if (2 == Co) Cj[xk(473)] = xk(1057), M6(Cj, 6, 0.3 * CB[xk(675)], 0.71 * CB[xk(675)]), Cj[xk(179)](), Cj[xk(678)](), Cj[xk(473)] = xk(1058), M5(0, 0, 0.55 * CB[xk(675)], Cj), Cj[xk(473)] = xk(1059), M5(0, 0, 0.3 * CB[xk(675)], Cj, true); else {
            var CT;
            !function (Cl, CQ, CD, CJ) {
              var xI = xk, Cf, CK = Math.PI / 2 * 3, Cd = Math.PI / 6;
              Cl[xI(500)](), Cl[xI(501)](0, -CJ);
              for (var CF = 0; CF < 6; CF++) Cf = H5[xI(1060)](CD + 0.9, 1.2 * CD), Cl[xI(1061)](Math[xI(1026)](CK + Cd) * Cf, Math[xI(1025)](CK + Cd) * Cf, Math[xI(1026)](CK + 2 * Cd) * CJ, Math[xI(1025)](CK + 2 * Cd) * CJ), CK += 2 * Cd;
              Cl[xI(1062)](0, -CJ), Cl[xI(503)]();
            }(Cj, 0, HD[xk(675)], 0.7 * HD[xk(675)]), Cj[xk(473)] = Co ? xk(1054) : xk(1058), Cj[xk(179)](), Cj[xk(678)](), Cj[xk(473)] = Co ? xk(1063) : xk(1064);
            var CN = Hb / 4;
            for (CA = 0; CA < 4; ++CA) M5((CT = H5[xk(1060)](HD[xk(675)] / 3.5, HD[xk(675)] / 2.3)) * Math[xk(1026)](CN * CA), CT * Math[xk(1025)](CN * CA), H5[xk(1060)](10, 12), Cj);
          }
        } else 2 != CB[xk(100)] && 3 != CB[xk(100)] || (Cj[xk(473)] = 2 == CB[xk(100)] ? 2 == Co ? xk(1065) : xk(1019) : xk(1066), M6(Cj, 3, CB[xk(675)], CB[xk(675)]), Cj[xk(179)](), Cj[xk(678)](), Cj[xk(473)] = 2 == CB[xk(100)] ? 2 == Co ? xk(1067) : xk(1068) : xk(1069), M6(Cj, 3, 0.55 * CB[xk(675)], 0.65 * CB[xk(675)]), Cj[xk(179)]());
      }
      Cw = CL, M1[Cb] = Cw;
    }
    return Cw;
  }
  var M3 = [];
  function M4(CB, Co) {
    var xZ = nj, Cb = M3[CB.id + (Hl && CB[xZ(736)] && CB[xZ(736)][xZ(654)] == Hl[xZ(654)] ? 0 : Hl && Hl[xZ(652)] && CB[xZ(736)] && Md(CB[xZ(736)][xZ(654)]) ? 25 : 50)];
    if (!Cb || Co) {
      var Cw = document[xZ(12)](xZ(464));
      Cw[xZ(21)] = Cw[xZ(23)] = 2.5 * CB[xZ(675)] + 5.5 + (H9[xZ(460)][CB.id][xZ(1070)] || 0);
      var CL = Cw[xZ(465)]("2d");
      if (CL[xZ(466)](Cw[xZ(21)] / 2, Cw[xZ(23)] / 2), CL[xZ(470)](Co ? 0 : Math.PI / 2), CL[xZ(1027)] = hz, CL[xZ(1029)] = 5.5 * (Co ? Cw[xZ(21)] / 81 : 1), xZ(1071) == CB[xZ(94)]) {
        CL[xZ(473)] = xZ(1064), M5(0, 0, CB[xZ(675)], CL), CL[xZ(473)] = xZ(1058);
        var Cj = -Math.PI / 2;
        !function (CK, Cd, CF, CV, Cm) {
          var xX = xZ, Ck = CK + 25 * Math[xX(1026)](CV), CI = Cd + 25 * Math[xX(1025)](CV);
          Cm[xX(501)](CK, Cd), Cm[xX(500)](), Cm[xX(1061)]((CK + Ck) / 2 + 10 * Math[xX(1026)](CV + Math.PI / 2), (Cd + CI) / 2 + 10 * Math[xX(1025)](CV + Math.PI / 2), Ck, CI), Cm[xX(1061)]((CK + Ck) / 2 - 10 * Math[xX(1026)](CV + Math.PI / 2), (Cd + CI) / 2 - 10 * Math[xX(1025)](CV + Math.PI / 2), CK, Cd), Cm[xX(503)](), Cm[xX(179)](), Cm[xX(678)]();
        }(CB[xZ(675)] * Math[xZ(1026)](Cj), CB[xZ(675)] * Math[xZ(1025)](Cj), 0, Cj + Math.PI / 2, CL);
      } else {
        if (xZ(1072) == CB[xZ(94)]) {
          CL[xZ(473)] = xZ(1073), M5(0, 0, CB[xZ(675)], CL), CL[xZ(473)] = xZ(1074);
          for (var Cs = Hb / (CT = 4), CA = 0; CA < CT; ++CA) M5((CN = H5[xZ(1060)](CB[xZ(675)] / 2.5, CB[xZ(675)] / 1.7)) * Math[xZ(1026)](Cs * CA), CN * Math[xZ(1025)](Cs * CA), H5[xZ(1060)](4, 5), CL, true);
        } else {
          if (xZ(1075) == CB[xZ(94)]) {
            var CT, CN;
            for (CL[xZ(473)] = xZ(1076), M5(0, 0, CB[xZ(675)], CL), CL[xZ(473)] = xZ(1077), Cs = Hb / (CT = 4), CA = 0; CA < CT; ++CA) M5((CN = H5[xZ(1060)](CB[xZ(675)] / 2.5, CB[xZ(675)] / 1.7)) * Math[xZ(1026)](Cs * CA), CN * Math[xZ(1025)](Cs * CA), H5[xZ(1060)](4, 5), CL, true);
          } else {
            if (xZ(1078) == CB[xZ(94)] || xZ(1079) == CB[xZ(94)] || xZ(1080) == CB[xZ(94)]) {
              CL[xZ(473)] = xZ(1080) == CB[xZ(94)] ? xZ(1081) : xZ(1078) == CB[xZ(94)] ? xZ(1082) : xZ(1019);
              var Cl = xZ(1080) == CB[xZ(94)] ? 4 : 3;
              M6(CL, Cl, 1.1 * CB[xZ(675)], 1.1 * CB[xZ(675)]), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1080) == CB[xZ(94)] ? xZ(1083) : xZ(1078) == CB[xZ(94)] ? xZ(1084) : xZ(1068), M6(CL, Cl, 0.65 * CB[xZ(675)], 0.65 * CB[xZ(675)]), CL[xZ(179)]();
            } else {
              if (xZ(1085) == CB[xZ(94)] || xZ(1086) == CB[xZ(94)] || xZ(1087) == CB[xZ(94)] || xZ(1088) == CB[xZ(94)]) {
                CL[xZ(473)] = xZ(1087) == CB[xZ(94)] ? xZ(1089) : xZ(1019);
                var CQ = 0.6 * CB[xZ(675)];
                M6(CL, xZ(1085) == CB[xZ(94)] ? 5 : 6, CB[xZ(675)], CQ), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1082), M5(0, 0, CQ, CL), CL[xZ(473)] = xZ(1084), M5(0, 0, CQ / 2, CL, true);
              } else {
                if (xZ(1090) == CB[xZ(94)] || xZ(1091) == CB[xZ(94)] || xZ(1092) == CB[xZ(94)]) CL[xZ(473)] = xZ(1082), M5(0, 0, CB[xZ(675)], CL), CL[xZ(473)] = xZ(1084), M8(0, 0, 1.5 * CB[xZ(675)], 29, 4, CL), CL[xZ(473)] = xZ(1082), M5(0, 0, 0.5 * CB[xZ(675)], CL); else {
                  if (xZ(1093) == CB[xZ(94)]) CL[xZ(473)] = xZ(1019), M6(CL, 3, CB[xZ(675)], CB[xZ(675)]), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1068), M6(CL, 3, 0.55 * CB[xZ(675)], 0.65 * CB[xZ(675)]), CL[xZ(179)](); else {
                    if (xZ(1094) == CB[xZ(94)]) {
                      for (CA = 0; CA < 2; ++CA) M6(CL, 7, CQ = CB[xZ(675)] * (CA ? 0.5 : 1), 0.7 * CQ), CL[xZ(473)] = CA ? xZ(1055) : xZ(1056), CL[xZ(179)](), CA || CL[xZ(678)]();
                    } else {
                      if (xZ(1095) == CB[xZ(94)]) CL[xZ(473)] = xZ(1082), M6(CL, 3, 1.1 * CB[xZ(675)], 1.1 * CB[xZ(675)]), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = hz, M6(CL, 3, 0.65 * CB[xZ(675)], 0.65 * CB[xZ(675)]), CL[xZ(179)](); else {
                        if (xZ(1096) == CB[xZ(94)]) CL[xZ(473)] = xZ(1097), M7(0, 0, 2 * CB[xZ(675)], 2 * CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1098), function (CK, Cd) {
                          var xG = xZ;
                          Cd = Cd || hg;
                          var CF = CK * (Math[xG(1013)](3) / 2);
                          Cd[xG(500)](), Cd[xG(501)](0, -CF / 2), Cd[xG(1062)](-CK / 2, CF / 2), Cd[xG(1062)](CK / 2, CF / 2), Cd[xG(1062)](0, -CF / 2), Cd[xG(179)](), Cd[xG(503)]();
                        }(1 * CB[xZ(675)], CL); else {
                          if (xZ(1099) == CB[xZ(94)]) CL[xZ(473)] = xZ(1082), M5(0, 0, CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1019), M7(0, -25, 0.9 * CB[xZ(675)], 50, CL), M5(0, 0, 0.6 * CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](); else {
                            if (xZ(1100) == CB[xZ(94)]) {
                              CL[xZ(473)] = xZ(1101);
                              var CD = 2 * CB[xZ(675)], CJ = CD / 4, Cf = -CB[xZ(675)] / 2;
                              for (CA = 0; CA < 4; ++CA) M7(Cf - CJ / 2, 0, CJ, 2 * CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), Cf += CD / 4;
                            } else xZ(1102) == CB[xZ(94)] ? (CL[xZ(473)] = xZ(1097), M7(0, 0, 2 * CB[xZ(675)], 2 * CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1028), M8(0, 0, 0.65 * CB[xZ(675)], 20, 4, CL, true)) : xZ(1103) == CB[xZ(94)] ? (CL[xZ(473)] = xZ(1097), M7(0, 0, 2 * CB[xZ(675)], 2 * CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(473)] = xZ(1104), M5(0, 0, 0.6 * CB[xZ(675)], CL)) : xZ(1022) == CB[xZ(94)] ? (CL[xZ(473)] = xZ(1097), M5(0, 0, CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(470)](Math.PI / 4), CL[xZ(473)] = xZ(1028), M8(0, 0, 0.65 * CB[xZ(675)], 20, 4, CL, true)) : xZ(1105) == CB[xZ(94)] && (CL[xZ(473)] = xZ(1097), M5(0, 0, CB[xZ(675)], CL), CL[xZ(179)](), CL[xZ(678)](), CL[xZ(470)](Math.PI / 4), CL[xZ(473)] = xZ(1106), M5(0, 0, 0.5 * CB[xZ(675)], CL, true));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      Co || (CL[xZ(473)] = Hl && CB[xZ(736)] && CB[xZ(736)][xZ(654)] == Hl[xZ(654)] ? "" : CB[xZ(736)] && Hl && Hl[xZ(652)] && Md(CB[xZ(736)][xZ(654)]) ? "" : xZ(1107)), (CB[xZ(94)][xZ(201)](xZ(1108)) && CL[xZ(179)]() || CB[xZ(94)][xZ(201)](xZ(1095))) && CL[xZ(179)](), (Cb = Cw, Co || (M3[CB.id + (Hl && CB[xZ(736)] && CB[xZ(736)][xZ(654)] == Hl[xZ(654)] ? 0 : Hl && Hl[xZ(652)] && CB[xZ(736)] && Md(CB[xZ(736)][xZ(654)]) ? 25 : 50)] = Cb));
    }
    return Cb;
  }
  function M5(CB, Co, Cb, Cw, CL, Cj) {
    var xq = nj;
    (Cw = Cw || hg)[xq(500)](), Cw[xq(677)](CB, Co, Cb, 0, 2 * Math.PI), Cj || Cw[xq(179)](), CL || Cw[xq(678)]();
  }
  function M6(CB, Co, Cb, Cw, CL) {
    var xE = nj, Cj, Cs, CA = Math.PI / 2 * 3, CT = Math.PI / Co;
    CB[xE(500)](), CB[xE(501)](0, -Cb);
    if (CL) CB[xE(470)](Math.PI / 2);
    for (var CN = 0; CN < Co; CN++) Cj = Math[xE(1026)](CA) * Cb, Cs = Math[xE(1025)](CA) * Cb, CB[xE(1062)](Cj, Cs), CA += CT, Cj = Math[xE(1026)](CA) * Cw, Cs = Math[xE(1025)](CA) * Cw, CB[xE(1062)](Cj, Cs), CA += CT;
    CB[xE(1062)](0, -Cb), CB[xE(503)]();
  }
  function M7(CB, Co, Cb, Cw, CL, Cj) {
    var xR = nj;
    CL[xR(477)](CB - Cb / 2, Co - Cw / 2, Cb, Cw), Cj || CL[xR(1109)](CB - Cb / 2, Co - Cw / 2, Cb, Cw);
  }
  function M8(CB, Co, Cb, Cw, CL, Cj, Cs) {
    var xv = nj;
    Cj[xv(1011)](), Cj[xv(466)](CB, Co), CL = Math[xv(1110)](CL / 2);
    for (var CA = 0; CA < CL; CA++) M7(0, 0, 2 * Cb, Cw, Cj, Cs), Cj[xv(470)](Math.PI / CL);
    Cj[xv(1014)]();
  }
  function M9(CB) {
    var xP = nj;
    for (var Co = 0; Co < CB[xP(68)];) hP[xP(440)](CB[Co], CB[Co + 1], CB[Co + 2], CB[Co + 3], CB[Co + 4], CB[Co + 5], H9[xP(460)][CB[Co + 6]], true, CB[Co + 7] >= 0 ? {sid: CB[Co + 7]} : null), Co += 8;
  }
  function MH(CB, Co) {
    var xe = nj;
    (HD = Cg(Co)) && (HD[xe(1020)] += H7[xe(308)] * Math[xe(1026)](CB), HD[xe(1021)] += H7[xe(308)] * Math[xe(1025)](CB));
  }
  function Mh(CB, Co) {
    var xz = nj;
    (HD = Cg(CB)) && (HD[xz(1016)] = Co, HD[xz(1020)] += H7[xz(308)] * Math[xz(1026)](Co + Math.PI), HD[xz(1021)] += H7[xz(308)] * Math[xz(1025)](Co + Math.PI));
  }
  function Ma(CB, Co, Cb, Cw, CL, Cj, Cs, CA) {
    var xY = nj;
    hO && (HE[xY(1111)](CB, Co, Cb, Cw, CL, Cj, null, null, Cs)[xY(654)] = CA, function (CT, CN, Cl, CQ, CD) {
      var xc = xY;
      let CJ = Infinity, Cf = Hl, CK = true;
      for (let Cd = 0; Cd < HZ[xc(68)]; Cd++) {
        (HD = HZ[Cd]) && HD[xc(632)] && HD[xc(638)].id && H9[xc(459)][HD[xc(638)].id][xc(1046)] !== undefined && H9[xc(1017)][H9[xc(459)][HD[xc(638)].id][xc(1046)]][xc(1112)] == CD && CJ > (HD.x2 * 1.5 - HD.x1 / 2 - CT + Math[xc(1026)](Cl) * 80) ** 2 + (HD.y2 * 1.5 - HD.y1 / 2 - CN + Math[xc(1025)](Cl) * 80) ** 2 && (Cf = HD, CJ = (HD.x2 * 1.5 - HD.x1 / 2 - CT + Math[xc(1026)](Cl) * 80) ** 2 + (HD.y2 * 1.5 - HD.y1 / 2 - CN + Math[xc(1025)](Cl) * 80) ** 2);
      }
      if (Math[xc(1013)](CJ) > 60) {
        if (CD == 1.5) {
          for (let CF = 0; CF < HZ[xc(68)]; CF++) {
            (HD = HZ[CF]) && HD[xc(632)] && CJ > (HD.x2 * 1.5 - HD.x1 / 2 - CT + Math[xc(1026)](Cl) * 10) ** 2 + (HD.y2 * 1.5 - HD.y1 / 2 - CN + Math[xc(1025)](Cl) * 10) ** 2 && (Cf = HD, CJ = (HD.x2 * 1.5 - HD.x1 / 2 - CT + Math[xc(1026)](Cl) * 10) ** 2 + (HD.y2 * 1.5 - HD.y1 / 2 - CN + Math[xc(1025)](Cl) * 10) ** 2);
          }
          Math[xc(1013)](CJ) < 60 && (Cf[xc(1099)] = 0, CK = false);
        } else Cf[xc(638)][xc(573)] = 0;
      } else Cf[xc(638)][xc(573)] = -111 / H9[xc(459)][15][xc(1112)];
    }(CB, Co, Cb, Cw, CL));
  }
  function MW(CB, Co) {
    var xy = nj;
    for (var Cb = 0; Cb < Hq[xy(68)]; ++Cb) Hq[Cb][xy(654)] == CB && (Hq[Cb][xy(1113)] = Co);
  }
  function MM(CB) {
    var xS = nj;
    (HD = CC(CB)) && HD[xS(1030)]();
  }
  function MC(CB) {
    var xO = nj;
    for (var Co = 0; Co < HI[xO(68)]; ++Co) HI[Co][xO(1114)] = !HI[Co][xO(632)], HI[Co][xO(632)] = false;
    if (CB) {
      var Cb = Date[xO(426)]();
      for (Co = 0; Co < CB[xO(68)];) (HD = CC(CB[Co])) ? (HD[xO(583)] = CB[Co + 1], HD.t1 = void 0 === HD.t2 ? Cb : HD.t2, HD.t2 = Cb, HD.x1 = HD.x, HD.y1 = HD.y, HD.x2 = CB[Co + 2], HD.y2 = CB[Co + 3], HD.d1 = void 0 === HD.d2 ? CB[Co + 4] : HD.d2, HD.d2 = CB[Co + 4], HD[xO(983)] = CB[Co + 5], HD.dt = 0, HD[xO(632)] = true) : ((HD = HP[xO(1115)](CB[Co + 2], CB[Co + 3], CB[Co + 4], CB[Co + 1])).x2 = HD.x, HD.y2 = HD.y, HD.d2 = HD[xO(1016)], HD[xO(983)] = CB[Co + 5], HP[xO(1116)][CB[Co + 1]][xO(94)] || (HD[xO(94)] = H7[xO(328)][CB[Co + 6]]), HD[xO(1114)] = true, HD[xO(654)] = CB[Co], HD[xO(632)] = true), Co += 7;
    }
  }
  var Mg = {};
  function Mr(CB, Co) {
    var u0 = nj, Cb = CB[u0(583)], Cw = Mg[Cb];
    if (!Cw) {
      var CL = new Image;
      CL[u0(442)] = function () {
        var u1 = u0;
        this[u1(443)] = true, this[u1(442)] = null;
      }, CL[u0(444)] = u0(1117) + CB[u0(444)] + u0(448), Cw = CL, Mg[Cb] = Cw;
    }
    if (Cw[u0(443)]) {
      var Cj = 1.2 * CB[u0(675)] * (CB[u0(1118)] || 1);
      Co[u0(472)](Cw, -Cj, -Cj, 2 * Cj, 2 * Cj);
    }
  }
  function Mp(CB, Co) {
    var u3 = nj, Cb = function (Cw) {
      var u2 = h;
      for (var CL = 0; CL < HZ[u2(68)]; ++CL) if (HZ[CL].id == Cw) return HZ[CL];
      return null;
    }(CB[0]);
    Cb || (Cb = new Hh(CB[0], CB[1], H7, H5, HE, hP, HZ, HI, H9, hR, hv), HZ[u3(167)](Cb)), Cb[u3(1115)](Co ? HV : null), Cb[u3(632)] = false, Cb.x2 = void 0, Cb.y2 = void 0, Cb[u3(1119)](CB), Co && (HJ = (Hl = Cb).x, Hf = Hl.y, av(), Wf(), Wm(), WV(0), hw[u3(15)][u3(8)] = u3(9));
  }
  function Mx(CB) {
    var u4 = nj;
    for (var Co = 0; Co < HZ[u4(68)]; Co++) if (HZ[Co].id == CB) {
      HZ[u4(655)](Co, 1);
      break;
    }
  }
  function Mu(CB, Co) {
    var u5 = nj;
    Hl && (Hl[u5(646)][CB] = Co);
  }
  function MB(CB, Co, Cb) {
    Hl && (Hl[CB] = Co, Cb && Wf());
  }
  var Mo = [];
  function Mb(CB, Co) {
    var u6 = nj;
    typeof CB == u6(149) && (typeof Mo[tick + Co] == u6(49) ? Mo[tick + Co][u6(167)](CB) : Mo[tick + Co] = [CB]);
  }
  function Mw(CB, Co = W8()) {
    var u7 = nj;
    Wb(CB), H4[u7(612)]("c", 1, Co), H4[u7(612)]("c", 0, Co), Wb(Hl[u7(377)], true);
  }
  function ML() {
    var u8 = nj;
    for (let CB = 0; CB < 5; CB++) {
      Mw(Hl[u8(740)][0]);
    }
  }
  function Mj() {
    aX = true, aq(6), Mb(() => {
      aX = false, ML();
    }, 2);
  }
  function Ms() {
    aG = true, aq(22), Mb(() => {
      aG = false, ML();
    }, 2);
  }
  function MA(CB) {
    if (CB == 15) return 50; else {
      if (CB == 9) return 25; else {
        if (CB == 12) return 35; else return CB == 13 ? 30 : 0;
      }
    }
  }
  window[nj(1120)] = MA;
  function MT(CB) {
    if (CB == 1) return 1.1; else return CB == 2 || CB == 3 ? 1.18 : 1;
  }
  function MN(CB) {
    var u9 = nj;
    return CB == 75 ? Hl[u9(681)] == 6 ? 57 : CB : Hl[u9(681)] == 6 ? Math[u9(1121)](CB * 0.75) : CB;
  }
  function Ml(CB) {
    var uH = nj;
    if (!C0[uH(68)]) return uH(944);
    for (let Co = 0; Co < C0[uH(68)]; Co++) {
      let Cb = CM(C0[Co][0]);
      if (CB == MN(H9[uH(459)][Cb[uH(639)].id][uH(1122)] * MT(Cb[uH(639)][uH(1123)]) * 1.5)) return [Cb[uH(654)], Cb[uH(639)].id]; else {
        if (CB == MN(H9[uH(459)][Cb[uH(639)].id][uH(1122)] * MT(Cb[uH(639)][uH(1123)]))) return [Cb[uH(654)], Cb[uH(639)].id];
      }
      if (Cb[uH(638)].id == 10) {
        if (CB == MN(H9[uH(459)][Cb[uH(638)].id][uH(1122)] * MT(Cb[uH(638)][uH(1123)]) * 1.5)) return [Cb[uH(654)], Cb[uH(638)].id]; else {
          if (CB == MN(H9[uH(459)][Cb[uH(638)].id][uH(1122)] * MT(Cb[uH(638)][uH(1123)])) + MN(25)) return [Cb[uH(654)], Cb[uH(638)].id]; else {
            if (CB == MN(H9[uH(459)][Cb[uH(638)].id][uH(1122)] * MT(Cb[uH(638)][uH(1123)]))) return [Cb[uH(654)], Cb[uH(638)].id];
          }
        }
      } else {
        if (CB == MN(MA(Cb[uH(638)].id)) + MN(25)) return [Cb[uH(654)], Cb[uH(638)].id]; else {
          if (CB == MN(MA(Cb[uH(638)].id))) return [Cb[uH(654)], Cb[uH(638)].id];
        }
      }
    }
    return uH(944);
  }
  function MQ(CB) {
    var uh = nj;
    let Co = 0, Cb = false;
    for (let Cw = 0; Cw < C0[uh(68)]; Cw++) {
      let CL = CM(C0[Cw][0]);
      if (C0[Cw][0] == CB[0]) CB[1] < 9 ? CL[uh(638)][uh(573)] == 1 && (Co += CL[uh(638)][uh(1122)] + (CL[uh(639)][uh(1123)] == 3 ? 5 : 0), CL[uh(1099)] == 1 && (Co += 25)) : CL[uh(639)][uh(573)] == 1 && (Co += Math[uh(1121)](CL[uh(639)][uh(1122)] * MT(CL[uh(639)].id) * 1.5) + (CL[uh(639)][uh(1123)] == 3 ? 5 : 0), CL[uh(1099)] == 1 && (Co += 25)), Hl[uh(639)][uh(1123)] == 0 && Hl[uh(639)][uh(573)] + Math[uh(1121)](111 / H9[uh(459)][Hl[uh(459)][0]]) >= 1 && CL[uh(679)] == 21 && (Co += Math[uh(1121)](Hl[uh(639)][uh(1122)] * 1.5 * 0.25)), Hl[uh(639)][uh(1123)] == 0 && Hl[uh(639)][uh(573)] + Math[uh(1121)](111 / H9[uh(459)][Hl[uh(459)][0]]) >= 1 && CL[uh(681)] == 11 && (Co += Math[uh(1121)](Hl[uh(639)][uh(1122)] * 1.5 * 0.45)); else {
        let Cj = 0, Cs = 0;
        CL[uh(639)][uh(573)] == 1 && (Cj += Math[uh(1121)](CL[uh(639)][uh(1122)] * MT(CL[uh(639)].id) * 1.5) + (CL[uh(639)][uh(1123)] == 3 ? 5 : 0), CL[uh(1099)] == 1 && (Cj += 25)), CL[uh(638)][uh(573)] == 1 && (Cs += CL[uh(638)][uh(1122)] + (CL[uh(639)][uh(1123)] == 3 ? 5 : 0), CL[uh(1099)] == 1 && (Cs += 25)), Co += Cj >= Cs ? Cj : Cs;
      }
    }
    return WN = Math[uh(1121)](Co), [Math[uh(1121)](Co), Cb];
  }
  function MD(CB, Co) {
    var ua = nj;
    let Cb = Co - CB[ua(983)];
    if (Cb >= 0) CB[ua(1124)](); else {
      CB[ua(1125)] = tick, Cb = Math[ua(103)](Cb);
      if (CB == Hl) {
        if (ak[ua(603)][ua(721)] == false) return;
        if (C0[ua(68)]) {
          let Cw = Hl[ua(983)] - Cb, CL = Ml(Cb);
          if ((Cb == 60 || Cb == 68) && My == true && Hl[ua(639)][ua(573)] == 1 && Mf == false) {
            let Cs = MQ(CL == ua(944) ? [88] : CL);
            Cw - Cs[0] <= 0 ? ML() : Mb(() => {
              ML();
            }, 2);
            My = false, Mf = true, aq(7), aq(Hl[ua(680)][21] ? 21 : 0, 1), Wb(Hl[ua(459)][0], true), MI[ua(614)](true), MZ[ua(614)](false), H4[ua(612)]("7", 1), Mb(() => {
              var uW = ua;
              H4[uW(612)]("7", 1), Mf = false, MI[uW(614)](false), MZ[uW(614)](false);
            }, 1);
            return;
          }
          let Cj = MQ(CL == ua(944) ? [88] : CL);
          if (Cw - Cj[0] <= 0) {
            if (Cw - Cj[0] + (Cj[1] ? 25 : 0) > 0 && (Mm == false && aX == false) && Hl[ua(682)][22]) Ms(); else Cw - Math[ua(1121)](Cj[0] * 0.75) > 0 && Hl[ua(682)][6] ? Mj() : ML();
          } else Mb(() => {
            ML();
          }, 2);
        } else Mb(() => {
          ML();
        }, 2);
      }
    }
  }
  function MJ(CB, Co) {
    var uM = nj;
    (HD = CM(CB)) && (MD(HD, Co), HD[uM(983)] = Co);
  }
  var Mf = false, MK = false;
  setInterval(() => {
    var uC = nj;
    Mf == true && (H4[uC(612)]("2", ME), H4[uC(612)]("2", ME)), Hl && MK == true && uC(931) !== document[uC(930)].id[uC(160)]() && (WC[86] && Mw(Hl[uC(740)][2]), WC[70] && Mw(Hl[uC(740)][4]), WC[72] && Mw(Hl[uC(740)][5]), WC[81] && ak[uC(603)][uC(721)] && Mw(Hl[uC(740)][0]));
  }, 0);
  function Md(CB) {
    var ug = nj;
    for (let Co = 0; Co < ap[ug(68)]; Co += 2) {
      if (ap[Co] == CB) return true;
    }
    return false;
  }
  var MF = {last: false}, MV = false, Mm = false;
  function Mk() {
    var ur = nj;
    MF[ur(1126)] = MV;
    let CB = HG[ur(1127)]((Co, Cb) => Math[ur(993)](Co.y - Hl.y2, Co.x - Hl.x2) - Math[ur(993)](Cb.y - Hl.y2, Cb.x - Hl.x2))[0];
    CB && CB[ur(94)] == ur(1095) && Math[ur(993)](CB.y - Hl.y2, CB.x - Hl.x2) < 70 && CB[ur(736)][ur(654)] != Hl[ur(654)] && !Md(CB[ur(736)][ur(654)]) && CB[ur(674)] ? MV = true : (MV = false, MF[ur(1126)] == true && (aq(6), aX = true, Mb(() => {
      aX = false;
    }, 1)));
  }
  const MI = {status: false, interval: null, change: function (CB) {
    var uU = nj;
    CB == true ? (clearInterval(this[uU(1128)]), this[uU(603)] = true, this[uU(1128)] = setInterval(() => {
      var un = uU;
      Wb(Hl[un(459)][0], true);
    }, 0)) : (this[uU(603)] = false, clearInterval(this[uU(1128)]));
  }}, MZ = {status: false, interval: null, change: function (CB) {
    var up = nj;
    CB == true ? (clearInterval(this[up(1128)]), this[up(603)] = true, this[up(1128)] = setInterval(() => {
      var ux = up;
      Wb(Hl[ux(459)][1], true);
    }, 0)) : (this[up(603)] = false, clearInterval(this[up(1128)]));
  }};
  function MX(CB) {
    var uu = nj;
    WB = false;
    if (document[uu(38)](uu(1129))[uu(488)]) aS(document[uu(38)](uu(1130))[uu(429)]);
    if (CB == 2) Mf = true, aq(53), aq(Hl[uu(680)][21] ? 21 : 0, 1), Wb(Hl[uu(459)][1], true), MZ[uu(614)](true), MI[uu(614)](false), H4[uu(612)]("7", 1), Mb(() => {
      var uB = uu;
      Wb(Hl[uB(459)][0], true), MI[uB(614)](true), MZ[uB(614)](false), aq(7), aq(0, 1), aq(21, 1), Mb(() => {
        var uo = uB;
        Mf = false, H4[uo(612)]("7", 1), MI[uo(614)](false), MZ[uo(614)](false);
      }, 1);
    }, 1); else CB == 1 ? (Mf = true, aq(6), aq(0, 1), aq(21, 1), Wb(Hl[uu(459)][0], true), MI[uu(614)](true), MZ[uu(614)](false), H4[uu(612)]("7", 1), Mb(() => {
      var ub = uu;
      Wb(Hl[ub(459)][1], true), MZ[ub(614)](true), MI[ub(614)](false), aq(53), aq(21, 1), Mb(() => {
        var uw = ub;
        Mf = false, H4[uw(612)]("7", 1), MI[uw(614)](false), MZ[uw(614)](false);
      }, 1);
    }, 1)) : (Mf = true, aq(7), aq(0, 1), aq(21, 1), Wb(Hl[uu(459)][0], true), MI[uu(614)](true), MZ[uu(614)](false), H4[uu(612)]("7", 1), Mb(() => {
      var uL = uu;
      Wb(Hl[uL(459)][1], true), MZ[uL(614)](true), MI[uL(614)](false), aq(53), aq(21, 1), Mb(() => {
        var uj = uL;
        Mf = false, H4[uj(612)]("7", 1), MI[uj(614)](false), MZ[uj(614)](false);
      }, 1);
    }, 1));
  }
  var MG = [], Mq = [], ME = 0, MR = 0, Mv = nj(20);
  var Mz = [[11, false], [15, true], [6, true], [7, true], [22, true], [40, true], [53, true], [31, true], [12, true], [11, true], [26, true], [21, false], [18, false]], MY = setInterval(() => {
    var us = nj;
    if (Mz[0][1] == true) hR[us(80)](CB => CB.id == Mz[0][0])[us(67)](CB => {
      var uA = us;
      Hl && Hl[uA(382)] >= CB[uA(697)] && (aE(CB.id, 0), Mz[uA(265)]());
    }); else Mz[0][1] == false && hv[us(80)](CB => CB.id == Mz[0][0])[us(67)](CB => {
      var uT = us;
      Hl && Hl[uT(382)] >= CB[uT(697)] && (aE(CB.id, 1), Mz[uT(265)]());
    });
    Mz[us(68)] == 0 && clearInterval(MY);
  }, 500);
  function Mc(CB, Co) {
    var ui = nj;
    let Cb = H9[ui(460)][CB], Cw = 35 + Cb[ui(675)] + (Cb[ui(1131)] || 0);
    hP[ui(1132)](Hl.x2 + Math[ui(1026)](Co) * Cw, Hl.y2 + Math[ui(1025)](Co) * Cw, Cb[ui(675)], 0.6, H2.id, false) && Mw(CB, Co);
  }
  document[nj(38)](nj(789))[nj(613)](nj(614), function () {
    var uN = nj;
    if (document[uN(38)](uN(789))[uN(488)] == true) for (let CB = 0; CB < 4; CB++) {
      Mw(Hl[uN(740)][5] ? Hl[uN(740)][5] : Hl[uN(740)][3], 90 * CB / 180 * Math.PI);
    }
  });
  var My = false, MS = 0, MO = 0, C0 = [], C1 = {amount: [], info: []}, C2 = [];
  function C3() {
    var ut = nj;
    if (!Mq[ut(68)] || Wg[ut(603)]) return;
    let CB = HG[ut(1133)](Co => Co[ut(1134)] && (Co[ut(736)][ut(654)] == Hl[ut(654)] || Md(Co[ut(736)][ut(654)])) && Math[ut(993)](Co.y - Mq[2], Co.x - Mq[1]) < 70);
    if (CB) {
      if (Ca(Mq, Hl) < 250) for (let Co = 0; Co < Math.PI * 2; Co += Math.PI / 12) {
        Mc(Hl[ut(740)][2], Co + ME), Mc(Hl[ut(740)][2], Co - ME);
      }
    } else Mc(Hl[ut(740)][4], ME);
    if (Ca(Mq, Hl) < 400) {
      for (let Cb = ME - Math.PI / 3; Cb < ME + Math.PI / 3; Cb += Math.PI / 18) {
        Mc(Hl[ut(740)][2], Cb);
      }
      for (let Cw = 0; Cw < Math.PI * 2; Cw += Math.PI / 12) {
        Mc(Hl[ut(740)][4], Cw);
      }
    } else for (let CL = 0; CL < Math.PI * 2; CL += Math.PI / 12) {
      Mc(Hl[ut(740)][4], CL);
    }
    H4[ut(612)]("2", W8());
  }
  function C4(CB) {
    var ul = nj;
    tick++, MG = [], Mq = [], ME = 0;
    Wg[ul(603)] && (Wg.w || !Wg.a || Wg.s || Wg.d ? !Wg.w && Wg.a && Wg.s && !Wg.d ? Wg[ul(1135)] = -0.77 : Wg.w || Wg.a || !Wg.s || Wg.d ? !Wg.w && !Wg.a && Wg.s && Wg.d ? Wg[ul(1135)] = -2.34 : Wg.w || Wg.a || Wg.s || !Wg.d ? Wg.w && !Wg.a && !Wg.s && Wg.d ? Wg[ul(1135)] = 2.35 : !Wg.w || Wg.a || Wg.s || Wg.d ? Wg.w && Wg.a && !Wg.s && !Wg.d && (Wg[ul(1135)] = 0.77) : Wg[ul(1135)] = 1.57 : Wg[ul(1135)] = 3.14 : Wg[ul(1135)] = -1.57 : Wg[ul(1135)] = 0);
    Math[ul(1013)](Math[ul(102)](Wg.y - Hl.y, 2) + Math[ul(102)](Wg.x - Hl.x, 2)) > 100 && (Wg[ul(603)] && (Mw(Hl[ul(740)][3], Wg[ul(1135)] + 0 * Math.PI), Mw(Hl[ul(740)][3], Wg[ul(1135)] - 0.38333333333333336 * Math.PI), Mw(Hl[ul(740)][3], Wg[ul(1135)] + 0.38333333333333336 * Math.PI), H4[ul(612)]("2", W8())), Wg.x = Hl.x, Wg.y = Hl.y);
    for (var Co = Date[ul(426)](), Cb = 0; Cb < HZ[ul(68)]; ++Cb) HZ[Cb][ul(1114)] = !HZ[Cb][ul(632)], HZ[Cb][ul(632)] = false;
    for (Cb = 0; Cb < CB[ul(68)];) (HD = CM(CB[Cb])) && (HD.t1 = void 0 === HD.t2 ? Co : HD.t2, HD.t2 = Co, HD.x1 = HD.x, HD.y1 = HD.y, HD.x2 = CB[Cb + 1], HD.y2 = CB[Cb + 2], HD.d1 = void 0 === HD.d2 ? CB[Cb + 3] : HD.d2, HD.d2 = CB[Cb + 3], HD.dt = 0, HD[ul(786)] = CB[Cb + 4], HD[ul(377)] = CB[Cb + 5], HD[ul(1045)] = CB[Cb + 6], HD[ul(652)] = CB[Cb + 7], HD[ul(1136)] = CB[Cb + 8], HD[ul(681)] = CB[Cb + 9], HD[ul(679)] = CB[Cb + 10], HD[ul(1137)] = CB[Cb + 11], HD[ul(1031)] = CB[Cb + 12], HD[ul(632)] = true, HD[ul(676)](), !(HD == Hl || HD[ul(652)] && HD[ul(652)] == Hl[ul(652)]) && (ak && ak[ul(603)] && !ak[ul(603)][ul(726)][ul(201)](HD[ul(654)])) && MG[ul(167)](CB[ul(72)](Cb, Cb + 13))), Cb += 13;
    MG[ul(68)] && (MG = MG[ul(1127)]((Cw, CL) => Ca(Cw, Hl) - Ca(CL, Hl)), Mq = MG[0]), Mq[ul(68)] ? ME = Math[ul(791)](Mq[2] - Hl.y2, Mq[1] - Hl.x2) : ME = Hl[ul(1016)];
    if (Hl[ul(459)][0] && Hl[ul(639)].id != Hl[ul(459)][0]) Hl[ul(639)].id = Hl[ul(639)][ul(1138)] = Hl[ul(459)][0]; else Hl[ul(459)][1] && Hl[ul(638)].id != Hl[ul(459)][1] && (Hl[ul(638)].id = Hl[ul(638)][ul(1138)] = Hl[ul(459)][1]);
    C0 = [];
    for (let Cw = 0; Cw < MG[ul(68)]; Cw++) {
      let CL = CM(MG[Cw][0]);
      Ca(MG[Cw], Hl) / 1.56 <= H9[ul(459)][CL[ul(639)].id][ul(1113)] + 30 && C0[ul(167)](MG[Cw]);
    }
    if (MG[ul(68)]) {
      let Cj = [];
      for (let Cs = 0; Cs < MG[ul(68)]; Cs++) {
        let CA = CM(MG[Cs][0]);
        (CA[ul(639)].id == 5 || CA[ul(639)].id == 4) && CA[ul(639)][ul(1123)] >= 2 && CA[ul(639)][ul(573)] == 1 && (CW(CA, Hl) >= 180 && CW(CA, Hl) < 230 && Cj[ul(167)](true));
      }
      Cj[ul(68)] ? Mm = true : Mm = false;
    }
    if (Hl[ul(682)][11] && Hl[ul(680)][21]) {
      MS = MO, MO = Ca(Mq, Hl), C1[ul(1139)] = [];
      let CT = [];
      for (let CN = 0; CN < C1[ul(1140)][ul(68)]; CN++) {
        let Cl = CM(C1[ul(1140)][CN][0]);
        if (Cl && Cl[ul(639)][ul(573)] == 1) for (let CQ = 0; CQ < MG[ul(68)]; CQ++) {
          C1[ul(1140)][CN][0] == MG[CQ][0] && CT[ul(167)](C1[ul(1140)][CN]);
        }
      }
      C1[ul(1139)] = CT, C1[ul(1140)] = [];
      for (let CD = 0; CD < MG[ul(68)]; CD++) {
        let CJ = CM(MG[CD][0]), Cf = Ca(MG[CD], Hl);
        H9[ul(459)][CJ[ul(639)].id][ul(1113)] + 80 - Cf >= 0 && (CJ[ul(639)][ul(573)] + 111 / H9[ul(459)][CJ[ul(639)].id][ul(1112)] >= 1 && Math[ul(1121)]((CJ[ul(639)][ul(573)] + 111 / H9[ul(459)][CJ[ul(639)].id][ul(1112)]) * 100) / 100 <= 1.2 && C1[ul(1140)][ul(167)](MG[CD]));
      }
    }
    C2 = HG[ul(80)](CK => CK[ul(94)] == ul(1099) && Math[ul(993)](CK.y - Hl.y2, CK.x - Hl.x2) < 700 && CK[ul(674)] && CK[ul(736)][ul(654)] != Hl[ul(654)] && !Md(CK[ul(736)][ul(654)])), (Hl[ul(652)] && ap[ul(68)] && 1 == C6 && (C6 = false), !Hl[ul(652)] && ap[ul(68)] && 0 == C6 && (ap = [], C6 = true));
    Mq[ul(68)] && Mf == false && Hl[ul(740)][4] == 15 && C3();
    Mo[tick] && Mo[tick][ul(67)](CK => CK());
    if (Mq[ul(68)] && WB == true && Hl[ul(639)][ul(573)] == 1 && Hl[ul(638)][ul(573)] == 1 && Hl[ul(1099)] == 1 && Hl[ul(459)][1]) {
      if (Ca(Mq, Hl) / 1.56 < H9[ul(459)][Hl[ul(459)][0]][ul(1113)] && Hl[ul(459)][1] != 10) {
        if (Mq[9] == 11 && Hl[ul(639)][ul(1123)] == 0) MX(2); else Mq[9] != 6 && Mq[9] != 22 ? MX(1) : MX(0);
      } else Ca(Mq, Hl) < 134 && Mq[9] != 6 && Mq[9] != 22 && Hl[ul(459)][1] == 10 && MX(2);
    }
    Mk();
    if (Mf == true) Mv = ul(1141); else {
      if (MV == true) {
        Mv = ul(1142);
        let CK = HG[ul(1133)](Cm => Cm[ul(1134)] && Cm[ul(654)] != Hl[ul(654)] && !Md(Cm[ul(654)]) && Math[ul(993)](Cm.y - Hl.y, Cm.x - Hl.x) < 70 && Cm[ul(674)]), Cd = Hl[ul(459)][1] == 10 ? 10 : Hl[ul(459)][0], CF = HG[ul(80)](Cm => Cm[ul(1122)] && Cm[ul(654)] != Hl[ul(654)] && !Md(Cm[ul(654)]) && Math[ul(993)](Cm.y - Hl.y, Cm.x - Hl.x) < 130 && Cm[ul(674)]), CV = HG[ul(80)](Cm => !Cm[ul(1143)] && Math[ul(993)](Cm.y - Hl.y, Cm.x - Hl.x) / 1.56 < H9[ul(459)][Cd][ul(1113)] && Cm[ul(674)]);
        CF[ul(68)] > 0 || CV[ul(68)] > 0 ? MR = 2.656139888758748e195 : MR = Math[ul(791)](CK.y - Hl.y2, CK.x - Hl.x2), (Cd == 10 ? Hl[ul(638)][ul(573)] == 1 : Hl[ul(639)][ul(573)] == 1) ? (aq(40), aq(Hl[ul(680)][21] ? 21 : 0, 1), Wb(Cd, true), H4[ul(612)]("c", 1, MR), H4[ul(612)]("c", 0, MR)) : (Wb(Cd, true), Ch(CF[ul(68)], CV[ul(68)])), H4[ul(612)]("2", MR);
      } else {
        if (W7 == true || document[ul(38)](ul(789))[ul(488)] == true) {
          if (document[ul(38)](ul(789))[ul(488)] == false) {
            Mv = ul(1144);
            let Cm = Hl[ul(459)][1] == 10 ? Hl[ul(459)][1] : Hl[ul(459)][0];
            (Cm == Hl[ul(459)][1] ? Hl[ul(638)][ul(573)] == 1 : Hl[ul(639)][ul(573)] == 1) ? (Wb(Cm, true), H4[ul(612)]("c", 1, 2.656139888758748e195), H4[ul(612)]("c", 0, 2.656139888758748e195), aq(40)) : (Ch(), Wb(Cm, true));
          } else Mv = ul(789), (Hl[ul(377)] > 9 ? Hl[ul(638)][ul(573)] == 1 : Hl[ul(639)][ul(573)] == 1) ? (Wb(Hl[ul(377)], true), H4[ul(612)]("c", 1, 2.656139888758748e195), H4[ul(612)]("c", 0, 2.656139888758748e195), aq(40)) : (aq(6), Wb(Hl[ul(377)], true));
          H4[ul(612)]("2", 2.656139888758748e195);
        } else {
          if ((MS > 180 && MO < 180 || C1[ul(1139)][ul(68)] == 1) && Mq[ul(68)] && CM(Mq[0])[ul(639)][ul(1123)] == 0) Mv = ul(1145), My = true, aq(11), aq(21, 1); else {
            if (WB == false && Mq[ul(68)] && Ca(Mq, Hl) / 1.56 < H9[ul(459)][Hl[ul(459)][0]][ul(1113)] && Hl[ul(638)][ul(573)] == 1) {
              Mv = ul(790);
              if (Hl[ul(639)][ul(573)] == 1) {
                Wb(Hl[ul(459)][0], true);
                if (Hl[ul(377)] != Hl[ul(459)][0]) Wb(Hl[ul(459)][0], true); else Ca(Mq, Hl) < 150 && Mw(Hl[ul(740)][2], ME);
                aq(7), aq(Hl[ul(680)][18] ? 18 : 0, 1), H4[ul(612)]("c", 1, ME), H4[ul(612)]("c", 0, ME);
              } else Wb(Hl[ul(459)][0], true), Ch();
            } else Mv = ul(20), C9(), C8();
          }
        }
      }
    }
    aZ([ul(676), [Hl.x, Hl.y, Hl[ul(654)], true]]), C7();
  }
  var C5 = false, C6 = true;
  function C7() {
    var uQ = nj;
    document[uQ(38)](uQ(951))[uQ(488)] && (document[uQ(38)](uQ(1146))[uQ(429)] == 0 ? (H4[uQ(612)]("6", 7), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1072))) + 16), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1148))) + 16), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1149))) + 16), H4[uQ(612)]("6", 10), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](document[uQ(38)](uQ(1150))[uQ(429)])) + 16), Hl[uQ(740)][5] == H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](document[uQ(38)](uQ(1150))[uQ(429)])) && (document[uQ(38)](uQ(951))[uQ(488)] = false)) : (H4[uQ(612)]("6", 5), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1072))) + 16), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1148))) + 16), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](uQ(1149))) + 16), H4[uQ(612)]("6", 10), H4[uQ(612)]("6", H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](document[uQ(38)](uQ(1150))[uQ(429)])) + 16), Hl[uQ(740)][5] == H9[uQ(460)][uQ(1147)](CB => CB[uQ(94)][uQ(201)](document[uQ(38)](uQ(1150))[uQ(429)])) && (document[uQ(38)](uQ(951))[uQ(488)] = false)));
  }
  function C8() {
    var uD = nj;
    if (CH() && Hl[uD(682)][7]) aq(7), aq(11, 1); else {
      if (C2[uD(68)] && Hl[uD(682)][22]) aq(22), aq(11, 1); else {
        if (Hl.y2 < 2400 && Hl[uD(682)][15]) aq(15), aq(11, 1); else {
          if (Mq[uD(68)] && Ca(Mq, Hl) < 200 && Hl[uD(682)][6]) aq(6), aq(11, 1); else {
            if (Hl.y2 > 6850 && Hl.y2 < 7550 && Hl[uD(682)][31]) aq(31), aq(11, 1); else Hl[uD(682)][12] ? (aq(12), aq(11, 1)) : (aq(6), aq(11, 1));
          }
        }
      }
    }
  }
  function C9() {
    var uJ = nj;
    if (Hl[uJ(639)][uJ(573)] != 1) C5 = true, Wb(Hl[uJ(459)][0], 1); else {
      if (Hl[uJ(638)][uJ(573)] != 1) C5 = true, Wb(Hl[uJ(459)][1], 1); else C5 && (C5 = false, Hl[uJ(459)][1] == 10 && (Hl[uJ(459)][0] == 4 || Hl[uJ(459)][0] == 5) ? Wb(Hl[uJ(459)][1], 1) : Wb(Hl[uJ(459)][0], 1));
    }
  }
  function CH() {
    var uf = nj;
    let CB = CM(Mq[0]);
    if (Hl[uf(681)] == 45) return false;
    if (CB && Mq[uf(68)] && Hl[uf(1151)] > 0 && Ca(Mq, Hl) / 1.56 > H9[uf(459)][CB[uf(639)].id][uf(1113)]) return true; else {
      if (!CB && !Mq[uf(68)] && Hl[uf(1151)] > 0) return true;
    }
    return false;
  }
  function Ch(CB, Co) {
    var uK = nj;
    if (C2[uK(68)] && Hl[uK(682)][22]) aq(22), aq(11, 1); else {
      if (CH() && Hl[uK(682)][7]) aq(7), aq(11, 1); else {
        if (CB > 0 && Co > 0 && Hl[uK(682)][26]) aq(26), aq(11, 1); else {
          if (Mq[uK(68)] && C1[uK(1139)][uK(68)] && Hl[uK(682)][11] && Hl[uK(680)][21] && Mq[uK(68)] && CM(Mq[0])[uK(639)][uK(1123)] == 0) My = true, aq(11), aq(21, 1); else {
            if (Hl.y >= 6850 && Hl.y <= 7550 && Hl[uK(682)][31] && Hl[uK(680)][11]) aq(31), aq(11, 1); else {
              if (Mq[uK(68)] && Ca(Mq, Hl) < 300 && Hl[uK(682)][6]) aq(6), aq(11, 1); else Hl.y <= 2400 && Hl[uK(682)][15] ? (aq(15), aq(11, 1)) : (aq(12), aq(11, 1));
            }
          }
        }
      }
    }
  }
  function Ca(CB, Co) {
    var ud = nj;
    return Math[ud(1013)](Math[ud(102)](Co.y2 - CB[2], 2) + Math[ud(102)](Co.x2 - CB[1], 2));
  }
  function CW(CB, Co) {
    var uF = nj;
    return Math[uF(1013)](Math[uF(102)](Co.y2 - CB.y2, 2) + Math[uF(102)](Co.x2 - CB.x2, 2));
  }
  function CM(CB) {
    var uV = nj;
    for (var Co = 0; Co < HZ[uV(68)]; ++Co) if (HZ[Co][uV(654)] == CB) return HZ[Co];
    return null;
  }
  function CC(CB) {
    var um = nj;
    for (var Co = 0; Co < HI[um(68)]; ++Co) if (HI[Co][um(654)] == CB) return HI[Co];
    return null;
  }
  function Cg(CB) {
    var uk = nj;
    for (var Co = 0; Co < HG[uk(68)]; ++Co) if (HG[Co][uk(654)] == CB) return HG[Co];
    return null;
  }
  var Cr = -1;
  function CU() {
    var uI = nj, CB = Date[uI(426)]() - Cr;
    window[uI(970)] = CB, hx[uI(438)] = uI(1152) + CB + uI(1153);
  }
  function Cp() {
    var uZ = nj;
    Cr = Date[uZ(426)](), H4[uZ(612)]("pp");
  }
  function Cx(CB) {
    var uX = nj;
    if (!(CB < 0)) {
      var Co = Math[uX(104)](CB / 60), Cb = CB % 60;
      Cb = ("0" + Cb)[uX(72)](-2), hu[uX(438)] = uX(1154) + Co + ":" + Cb, hu[uX(453)] = false;
    }
  }
  function Cu(CB) {
    var uG = nj;
    window[uG(609)](CB, uG(1155));
  }
  window[nj(1156)] = window[nj(1157)] || window[nj(1158)] || window[nj(1159)] || function (CB) {
    var uq = nj;
    window[uq(1160)](CB, 16.666666666666668);
  }, function () {
    var uE = nj, CB = H7[uE(399)] / 2;
    hP[uE(440)](0, CB, CB + 200, 0, H7[uE(393)][3], 0), hP[uE(440)](1, CB, CB - 480, 0, H7[uE(393)][3], 0), hP[uE(440)](2, CB + 300, CB + 450, 0, H7[uE(393)][3], 0), hP[uE(440)](3, CB - 950, CB - 130, 0, H7[uE(393)][2], 0), hP[uE(440)](4, CB - 750, CB - 400, 0, H7[uE(393)][3], 0), hP[uE(440)](5, CB - 700, CB + 400, 0, H7[uE(393)][2], 0), hP[uE(440)](6, CB + 800, CB - 200, 0, H7[uE(393)][3], 0), hP[uE(440)](7, CB - 260, CB + 340, 0, H7[uE(394)][3], 1), hP[uE(440)](8, CB + 760, CB + 310, 0, H7[uE(394)][3], 1), hP[uE(440)](9, CB - 800, CB + 100, 0, H7[uE(394)][3], 1), hP[uE(440)](10, CB - 800, CB + 300, 0, H9[uE(460)][4][uE(675)], H9[uE(460)][4].id, H9[uE(460)][10]), hP[uE(440)](11, CB + 650, CB - 390, 0, H9[uE(460)][4][uE(675)], H9[uE(460)][4].id, H9[uE(460)][10]), hP[uE(440)](12, CB - 400, CB - 450, 0, H7[uE(395)][2], 2);
  }(), function CB() {
    var uR = nj;
    HT = Date[uR(426)](), HA = HT - Hk, Hk = HT, function () {
      var uv = uR;
      if (Hl && (!Hi || HT - Hi >= 1e3 / H7[uv(291)]) && (Hi = HT, H4[uv(612)]("2", W8())), WT < 120 && (WT += 0.1 * HA, hI[uv(15)][uv(989)] = Math[uv(170)](Math[uv(1121)](WT), 120) + "px"), Hl) {
        var Co = H5[uv(1161)](HJ, Hf, Hl.x, Hl.y), Cb = H5[uv(1162)](Hl.x, Hl.y, HJ, Hf), Cw = Math[uv(170)](0.01 * Co * HA, Co);
        Co > 0.05 ? (HJ += Cw * Math[uv(1026)](Cb), Hf += Cw * Math[uv(1025)](Cb)) : (HJ = Hl.x, Hf = Hl.y);
      } else HJ = H7[uv(399)] / 2, Hf = H7[uv(399)] / 2;
      for (var CL = HT - 1e3 / H7[uv(283)], Cj = 0; Cj < HZ[uv(68)] + HI[uv(68)]; ++Cj) if ((HD = HZ[Cj] || HI[Cj - HZ[uv(68)]]) && HD[uv(632)]) {
        if (HD[uv(1114)]) HD.x = HD.x2, HD.y = HD.y2, HD[uv(1016)] = HD.d2; else {
          var Cs = HD.t2 - HD.t1, CA = (CL - HD.t1) / Cs;
          HD.dt += HA;
          var CT = Math[uv(170)](1.7, HD.dt / 170), CN = HD.x2 - HD.x1;
          HD.x = HD.x1 + CN * CT, CN = HD.y2 - HD.y1, HD.y = HD.y1 + CN * CT, HD[uv(1016)] = Math[uv(498)](HD.d2, HD.d1, Math[uv(170)](1.2, CA));
        }
      }
      var Cl = HJ - h2 / 2, CQ = Hf - h3 / 2;
      H7[uv(396)] - CQ <= 0 && H7[uv(399)] - H7[uv(396)] - CQ >= h3 ? (hg[uv(473)] = uv(1163), hg[uv(477)](0, 0, h2, h3)) : H7[uv(399)] - H7[uv(396)] - CQ <= 0 ? (hg[uv(473)] = uv(1164), hg[uv(477)](0, 0, h2, h3)) : H7[uv(396)] - CQ >= h3 ? (hg[uv(473)] = uv(658), hg[uv(477)](0, 0, h2, h3)) : H7[uv(396)] - CQ >= 0 ? (hg[uv(473)] = uv(658), hg[uv(477)](0, 0, h2, H7[uv(396)] - CQ), hg[uv(473)] = uv(1163), hg[uv(477)](0, H7[uv(396)] - CQ, h2, h3 - (H7[uv(396)] - CQ))) : (hg[uv(473)] = uv(1163), hg[uv(477)](0, 0, h2, H7[uv(399)] - H7[uv(396)] - CQ), hg[uv(473)] = uv(1164), hg[uv(477)](0, H7[uv(399)] - H7[uv(396)] - CQ, h2, h3 - (H7[uv(399)] - H7[uv(396)] - CQ))), Wj || ((HY += Hc * H7[uv(391)] * HA) >= H7[uv(392)] ? (HY = H7[uv(392)], Hc = -1) : HY <= 1 && (HY = Hc = 1), hg[uv(483)] = 1, hg[uv(473)] = uv(1164), Wq(Cl, CQ, hg, H7[uv(389)]), hg[uv(473)] = uv(1165), Wq(Cl, CQ, hg, 250 * (HY - 1))), hg[uv(1029)] = 4, hg[uv(1027)] = uv(1166), hg[uv(483)] = document[uv(38)](uv(1034))[uv(488)] ? 0 : 0.06, hg[uv(500)]();
      for (var CD = -HJ; CD < h2; CD += h3 / 18) CD > 0 && (hg[uv(501)](CD, 0), hg[uv(1062)](CD, h3));
      for (var CJ = -Hf; CJ < h3; CJ += h3 / 18) CD > 0 && (hg[uv(501)](0, CJ), hg[uv(1062)](h2, CJ));
      for (hg[uv(678)](), hg[uv(483)] = 1, hg[uv(1027)] = hz, WE(-1, Cl, CQ), hg[uv(483)] = 1, hg[uv(1029)] = 5.5, WZ(0, Cl, CQ), Wv(Cl, CQ, 0), hg[uv(483)] = 1, Cj = 0; Cj < HI[uv(68)]; ++Cj) (HD = HI[Cj])[uv(674)] && HD[uv(632)] && (HD[uv(1032)](HA), hg[uv(1011)](), hg[uv(466)](HD.x - Cl, HD.y - CQ), hg[uv(470)](HD[uv(1016)] + HD[uv(1035)] - Math.PI / 2), Mr(HD, hg), hg[uv(1014)]());
      if (WE(0, Cl, CQ), WZ(1, Cl, CQ), WE(1, Cl, CQ), Wv(Cl, CQ, 1), WE(2, Cl, CQ), WE(3, Cl, CQ), hg[uv(473)] = uv(1166), hg[uv(483)] = 0.09, Cl <= 0 && hg[uv(477)](0, 0, -Cl, h3), H7[uv(399)] - Cl <= h2) {
        var Cf = Math[uv(268)](0, -CQ);
        hg[uv(477)](H7[uv(399)] - Cl, Cf, h2 - (H7[uv(399)] - Cl), h3 - Cf);
      }
      if (CQ <= 0 && hg[uv(477)](-Cl, 0, h2 + Cl, -CQ), H7[uv(399)] - CQ <= h3) {
        var CK = Math[uv(268)](0, -Cl), Cd = 0;
        H7[uv(399)] - Cl <= h2 && (Cd = h2 - (H7[uv(399)] - Cl)), hg[uv(477)](CK, H7[uv(399)] - CQ, h2 - CK - Cd, h3 - (H7[uv(399)] - CQ));
      }
      for (hg[uv(483)] = 1, hg[uv(473)] = uv(1167), hg[uv(477)](0, 0, h2, h3), hg[uv(1027)] = hY, Cj = 0; Cj < HZ[uv(68)] + HI[uv(68)]; ++Cj) if ((HD = HZ[Cj] || HI[Cj - HZ[uv(68)]])[uv(632)] && (10 != HD[uv(681)] || HD == Hl || HD[uv(652)] && HD[uv(652)] == Hl[uv(652)])) {
        var CF = (HD[uv(652)] ? "[" + HD[uv(652)] + "] " : "") + (HD[uv(1168)] && document[uv(38)](uv(1034))[uv(488)] ? "[" + HD[uv(639)].id + (HD[uv(638)].id ? "/" + HD[uv(638)].id : "") + "] " : "") + (HD[uv(94)] || "");
        if ("" != CF) {
          if (hg[uv(1169)] = (HD[uv(1170)] || 30) + uv(1171), hg[uv(473)] = uv(658), hg[uv(1172)] = uv(1173), hg[uv(18)] = uv(1174), hg[uv(1029)] = HD[uv(1170)] ? 11 : 8, hg[uv(1036)] = uv(1121), hg[uv(1175)](CF, HD.x - Cl, HD.y - CQ - HD[uv(675)] - H7[uv(314)]), hg[uv(1176)](CF, HD.x - Cl, HD.y - CQ - HD[uv(675)] - H7[uv(314)]), HD[uv(1136)] && WK[uv(996)][uv(443)]) {
            var CV = H7[uv(298)];
            CK = HD.x - Cl - CV / 2 - hg[uv(1177)](CF)[uv(21)] / 2 - H7[uv(299)], hg[uv(472)](WK[uv(996)], CK, HD.y - CQ - HD[uv(675)] - H7[uv(314)] - CV / 2 - 5, CV, CV);
          }
          1 == HD[uv(1137)] && WK[uv(997)][uv(443)] && (CV = H7[uv(298)], CK = HD.x - Cl - CV / 2 + hg[uv(1177)](CF)[uv(21)] / 2 + H7[uv(299)], hg[uv(472)](WK[uv(997)], CK, HD.y - CQ - HD[uv(675)] - H7[uv(314)] - CV / 2 - 5, CV, CV)), WK[uv(445)][uv(443)] && WB && Mq[uv(68)] && HD[uv(654)] == Mq[0] && HD[uv(1168)] && (CV = 2 * H7[uv(311)] - 10, hg[uv(472)](WK[uv(445)], HD.x - Cl - CV / 2, HD.y - CQ - CV / 2, CV, CV));
        }
        if (aI[uv(602)] == 1 && HD && HD[uv(1168)]) for (let CI = 0; CI < am[uv(68)]; CI++) {
          if (HD[uv(654)] == am[CI][uv(654)] && am[CI][uv(584)] == location[uv(432)]) {
            let CZ = am[CI][uv(735)];
            hg[uv(1169)] = (HD[uv(1170)] || 30) + uv(1171), hg[uv(473)] = am[CI][uv(735)] == uv(736) ? uv(1178) : am[CI][uv(735)] == uv(737) ? uv(961) : am[CI][uv(735)] == uv(962) ? uv(1179) : uv(658), hg[uv(1172)] = uv(1173), hg[uv(18)] = uv(1174), hg[uv(1029)] = HD[uv(1170)] ? 11 : 8, hg[uv(1036)] = uv(1121), hg[uv(1175)](CZ, HD.x - Cl, HD.y - CQ - HD[uv(675)] - 40 - H7[uv(314)]), hg[uv(1176)](CZ, HD.x - Cl, HD.y - CQ - HD[uv(675)] - 40 - H7[uv(314)]);
          }
        }
        if (HD[uv(1168)] && document[uv(38)](uv(1034))[uv(488)]) {
          let CX = Hl.x + Math[uv(1026)](Math[uv(791)](HD.y - Hl.y, HD.x - Hl.x)) * 100, CG = Hl.y + Math[uv(1025)](Math[uv(791)](HD.y - Hl.y, HD.x - Hl.x)) * 100;
          if (HD != Hl && ((HD[uv(652)] != Hl[uv(652)] || !HD[uv(652)]) && !ak[uv(603)][uv(726)][uv(201)](HD[uv(654)]))) hg[uv(1011)](), hg[uv(466)](CX - Cl, CG - CQ), hg[uv(470)](Math[uv(791)](HD.y - Hl.y, HD.x - Hl.x)), hg[uv(473)] = uv(1166), M6(hg, 1.5, 20, 20, 1), hg[uv(179)](), hg[uv(1014)](); else HD != Hl && HD[uv(652)] && HD[uv(652)] == Hl[uv(652)] && (hg[uv(1011)](), hg[uv(466)](CX - Cl, CG - CQ), hg[uv(470)](Math[uv(791)](HD.y - Hl.y, HD.x - Hl.x)), hg[uv(473)] = uv(658), M6(hg, 1.5, 20, 20, 1), hg[uv(179)](), hg[uv(1014)]());
        }
        HD[uv(1168)] && document[uv(38)](uv(1034))[uv(488)] && (hg[uv(1169)] = (HD[uv(1170)] || 30) + uv(1171), hg[uv(473)] = uv(707), hg[uv(1172)] = uv(1173), hg[uv(18)] = uv(1174), hg[uv(1029)] = HD[uv(1170)] ? 11 : 8, hg[uv(1036)] = uv(1121), hg[uv(1175)](HD[uv(1151)], HD.x - Cl + hg[uv(1177)](CF)[uv(21)] / 2 + H7[uv(299)], HD.y - CQ - HD[uv(675)] - H7[uv(314)]), hg[uv(1176)](HD[uv(1151)], HD.x - Cl + hg[uv(1177)](CF)[uv(21)] / 2 + H7[uv(299)], HD.y - CQ - HD[uv(675)] - H7[uv(314)])), HD[uv(1168)] && document[uv(38)](uv(1034))[uv(488)] && (H7[uv(294)], hg[uv(473)] = hY, hg[uv(499)](HD.x - Cl - 50 - H7[uv(293)], HD.y - CQ + HD[uv(675)] + H7[uv(314)] - 13, 47 + 2 * H7[uv(293)], 17, 10), hg[uv(179)](), hg[uv(473)] = uv(1180), hg[uv(499)](HD.x - Cl - 50, HD.y - CQ + HD[uv(675)] + H7[uv(314)] - 13 + H7[uv(293)], 47 * HD[uv(639)][uv(573)], 16 - 2 * H7[uv(293)], 10), hg[uv(179)](), H7[uv(294)], hg[uv(473)] = hY, hg[uv(499)](HD.x - Cl + 2 - H7[uv(293)], HD.y - CQ + HD[uv(675)] + H7[uv(314)] - 13, 47 + 2 * H7[uv(293)], 17, 10), hg[uv(179)](), hg[uv(473)] = uv(1180), hg[uv(499)](HD.x - Cl + 2, HD.y - CQ + HD[uv(675)] + H7[uv(314)] - 13 + H7[uv(293)], 47 * HD[uv(638)][uv(573)], 16 - 2 * H7[uv(293)], 10), hg[uv(179)]()), HD[uv(983)] > 0 && (H7[uv(292)], hg[uv(473)] = hY, hg[uv(499)](HD.x - Cl - H7[uv(292)] - H7[uv(293)], HD.y - CQ + HD[uv(675)] + H7[uv(314)], 2 * H7[uv(292)] + 2 * H7[uv(293)], 17, 8), hg[uv(179)](), hg[uv(473)] = HD == Hl || HD[uv(652)] && HD[uv(652)] == Hl[uv(652)] ? uv(953) : uv(1181), hg[uv(499)](HD.x - Cl - H7[uv(292)], HD.y - CQ + HD[uv(675)] + H7[uv(314)] + H7[uv(293)], 2 * H7[uv(292)] * (HD[uv(983)] / HD[uv(1182)]), 17 - 2 * H7[uv(293)], 7), hg[uv(179)]());
      }
      for (Hg[uv(676)](HA, hg, Cl, CQ), Cj = 0; Cj < HZ[uv(68)]; ++Cj) if ((HD = HZ[Cj])[uv(632)] && HD[uv(300)] > 0) {
        HD[uv(300)] -= HA, HD[uv(300)] <= 0 && (HD[uv(300)] = 0), hg[uv(1169)] = uv(1183);
        var Cm = hg[uv(1177)](HD[uv(778)]);
        hg[uv(1172)] = uv(1173), hg[uv(18)] = uv(1174), CK = HD.x - Cl, Cf = HD.y - HD[uv(675)] - CQ - 90;
        var Ck = Cm[uv(21)] + 17;
        hg[uv(473)] = uv(1184), hg[uv(499)](CK - Ck / 2, Cf - 23.5, Ck, 47, 6), hg[uv(179)](), hg[uv(473)] = uv(658), hg[uv(1176)](HD[uv(778)], CK, Cf);
      }
      !function (Cq) {
        var uP = uv;
        if (Hl && Hl[uP(571)]) {
          hX[uP(1185)](0, 0, hk[uP(21)], hk[uP(23)]), hX[uP(1027)] = uP(658), hX[uP(1029)] = 4;
          for (var CE = 0; CE < aQ[uP(68)]; ++CE) (al = aQ[CE])[uP(676)](hX, Cq);
          if (hX[uP(483)] = 1, hX[uP(473)] = uP(658), M5(Hl.x / H7[uP(399)] * hk[uP(21)], Hl.y / H7[uP(399)] * hk[uP(23)], 7, hX, true), hX[uP(473)] = uP(1186), Hl[uP(652)] && ag) {
            for (CE = 0; CE < ag[uP(68)];) M5(ag[CE] / H7[uP(399)] * hk[uP(21)], ag[CE + 1] / H7[uP(399)] * hk[uP(23)], 7, hX, true), CE += 2;
          }
          aC && (hX[uP(473)] = uP(1187), hX[uP(1169)] = uP(1188), hX[uP(1172)] = uP(1173), hX[uP(18)] = uP(1174), hX[uP(1176)]("x", aC.x / H7[uP(399)] * hk[uP(21)], aC.y / H7[uP(399)] * hk[uP(23)])), ar && (hX[uP(473)] = uP(658), hX[uP(1169)] = uP(1188), hX[uP(1172)] = uP(1173), hX[uP(18)] = uP(1174), hX[uP(1176)]("x", ar.x / H7[uP(399)] * hk[uP(21)], ar.y / H7[uP(399)] * hk[uP(23)]));
          for (let CR = 0; CR < am[uP(68)]; CR++) {
            Hl && am[CR][uP(654)] != Hl[uP(654)] && am[CR][uP(584)] == location[uP(432)] && (hX[uP(483)] = 1, hX[uP(473)] = am[CR][uP(735)] == uP(736) || am[CR][uP(735)] == uP(737) ? uP(1178) : uP(1179), M5(am[CR].x / H7[uP(399)] * hk[uP(21)], am[CR].y / H7[uP(399)] * hk[uP(23)], 7, hX, true));
          }
        }
      }(HA), -1 !== HO.id && WI(HO[uv(795)], HO[uv(793)], HO[uv(794)], HO[uv(792)]), -1 !== h0.id && WI(h0[uv(795)], h0[uv(793)], h0[uv(794)], h0[uv(792)]);
    }();
    if (document[uR(38)](uR(1189))[uR(488)]) {
      let Co = hg[uR(1190)](), Cb = hg[uR(1191)](h2 / 2, h3 / 2, 100, h2 / 2, h3 / 2, 1e3);
      Cb[uR(1192)](0, uR(1193)), Cb[uR(1192)](0.4, uR(26)), Cb[uR(1192)](1, uR(1194)), hg[uR(473)] = Cb, hg[uR(477)](0, 0, h2, h3), hg[uR(781)](Co);
    }
    requestAnimFrame(CB);
  }(), window[nj(1195)] = Cu, window[nj(1196)] = aj, window[nj(1197)] = function () {
    var ue = nj;
    HV || (HV = true, Hw(ue(509), 1));
  }, window[nj(1198)] = as, window[nj(1199)] = aA, window[nj(1200)] = aN, window[nj(1201)] = aT, window[nj(1202)] = aE, window[nj(1203)] = aq, window[nj(1204)] = aM, window[nj(1205)] = function (Co) {
    h1 = Co, az();
  }, window[nj(1206)] = function (Co) {
    af != Co && (af = Co, ad());
  }, window[nj(1207)] = H7;
}, function (a, W) {
  !function (M, C, g) {
    var uz = h;
    var p = [], x = [], u = {_version: uz(1208), _config: {classPrefix: "", enableClasses: true, enableJSClass: true, usePrefixes: true}, _q: [], on: function (j, A) {
      var T = this;
      setTimeout(function () {
        A(T[j]);
      }, 0);
    }, addTest: function (j, A, T) {
      var uY = uz;
      x[uY(167)]({name: j, fn: A, options: T});
    }, addAsyncTest: function (j) {
      var uc = uz;
      x[uc(167)]({name: null, fn: j});
    }}, B = function () {};
    B[uz(54)] = u, B = new B;
    var b = C[uz(1209)], w = uz(1210) === b[uz(123)][uz(160)]();
    B[uz(1211)](uz(1212), function () {
      var uy = uz, j = false;
      try {
        var A = Object[uy(44)]({}, uy(1213), {get: function () {
          j = true;
        }});
        M[uy(613)](uy(1214), null, A);
      } catch (T) {}
      return j;
    }), function () {
      var uS = uz, j, A, T, N, Q, D;
      for (var J in x) if (x[uS(55)](J)) {
        if (j = [], (A = x[J])[uS(94)] && (j[uS(167)](A[uS(94)][uS(160)]()), A[uS(82)] && A[uS(82)][uS(1215)] && A[uS(82)][uS(1215)][uS(68)])) {
          for (T = 0; T < A[uS(82)][uS(1215)][uS(68)]; T++) j[uS(167)](A[uS(82)][uS(1215)][T][uS(160)]());
        }
        for (N = typeof A.fn === uS(149) ? A.fn() : A.fn, Q = 0; Q < j[uS(68)]; Q++) 1 === (D = j[Q][uS(615)]("."))[uS(68)] ? B[D[0]] = N : (!B[D[0]] || B[D[0]] instanceof Boolean || (B[D[0]] = new Boolean(B[D[0]])), B[D[0]][D[1]] = N), p[uS(167)]((N ? "" : uS(1216)) + D[uS(197)]("-"));
      }
    }(), function (j) {
      var uO = uz, A = b[uO(1217)], T = B[uO(1218)][uO(1219)] || "";
      if (w && (A = A[uO(1220)]), B[uO(1218)][uO(1221)]) {
        var N = new RegExp(uO(1222) + T + uO(1223));
        A = A[uO(253)](N, "$1" + T + uO(1224));
      }
      B[uO(1218)][uO(1225)] && (A += " " + T + j[uO(197)](" " + T), w ? b[uO(1217)][uO(1220)] = A : b[uO(1217)] = A);
    }(p), delete u[uz(1211)], delete u[uz(1226)];
    for (var L = 0; L < B._q[uz(68)]; L++) B._q[L]();
    M[uz(1227)] = B;
  }(window, document);
}, function (a, W, M) {
  var B0 = Cv, C = M(24);
  M(19), a[B0(42)] = {socket: null, connected: false, socketId: -1, connect: function (g, U, p) {
    var B1 = B0;
    if (!this[B1(1228)]) {
      var x = this;
      try {
        var u = false, B = g;
        this[B1(1228)] = new WebSocket(B), this[B1(1228)][B1(1229)] = B1(1230), this[B1(1228)][B1(1231)] = function (o) {
          var B2 = B1, b = new Uint8Array(o[B2(143)]), w = C[B2(125)](b), L = w[0];
          b = w[1], B2(1232) == L ? x[B2(1233)] = b[0] : p[L][B2(84)](void 0, b);
        }, this[B1(1228)][B1(1234)] = function () {
          var B3 = B1;
          x[B3(947)] = true, U();
        }, this[B1(1228)][B1(1235)] = function (o) {
          var B4 = B1;
          x[B4(947)] = false, 4001 == o[B4(1236)] ? U(B4(1237)) : u || U(B4(495));
        }, this[B1(1228)][B1(1238)] = function (o) {
          var B5 = B1;
          this[B5(1228)] && this[B5(1228)][B5(602)] != WebSocket[B5(1239)] && (u = true, console[B5(492)](B5(1240), arguments), U(B5(1240)));
        };
      } catch (o) {
        console[B1(967)](B1(1241), o), U(o);
      }
    }
  }, send: function (g) {
    var B6 = B0, r = Array[B6(54)][B6(72)][B6(43)](arguments, 1), U = C[B6(89)]([g, r]);
    this[B6(1228)][B6(612)](U);
  }, socketReady: function () {
    var B7 = B0;
    return this[B7(1228)] && this[B7(947)];
  }, close: function () {
    var B8 = B0;
    this[B8(1228)] && this[B8(1228)][B8(567)]();
  }};
}, function (a, W, M) {
  var B9 = Cv;
  W[B9(89)] = M(9)[B9(89)], W[B9(125)] = M(15)[B9(125)], W[B9(1242)] = M(37)[B9(1242)], W[B9(1243)] = M(38)[B9(1243)], W[B9(78)] = M(39)[B9(78)], W[B9(131)] = M(40)[B9(131)];
}, function (a, W, M) {
  var Ba = Cv;
  (function (C) {
    var Bh = h;
    function g(r) {
      var BH = h;
      return r && r[BH(58)] && r;
    }
    a[Bh(42)] = g(void 0 !== C && C) || g(this[Bh(74)]) || g(Bh(45) != typeof window && window[Bh(74)]) || this[Bh(74)];
  }[Ba(43)](this, M(11)[Ba(74)]));
}, function (W, M, C) {
  "use strict";
  var BW = Cv;
  M[BW(118)] = function (A) {
    var T = w(A), N = T[0], Q = T[1];
    return 3 * (N + Q) / 4 - Q;
  }, M[BW(251)] = function (A) {
    var BM = BW, T, N, Q = w(A), D = Q[0], J = Q[1], f = new p(function (F, V, m) {
      return 3 * (V + m) / 4 - m;
    }(0, D, J)), K = 0, d = J > 0 ? D - 4 : D;
    for (N = 0; N < d; N += 4) T = U[A[BM(168)](N)] << 18 | U[A[BM(168)](N + 1)] << 12 | U[A[BM(168)](N + 2)] << 6 | U[A[BM(168)](N + 3)], f[K++] = T >> 16 & 255, f[K++] = T >> 8 & 255, f[K++] = 255 & T;
    return 2 === J && (T = U[A[BM(168)](N)] << 2 | U[A[BM(168)](N + 1)] >> 4, f[K++] = 255 & T), 1 === J && (T = U[A[BM(168)](N)] << 10 | U[A[BM(168)](N + 1)] << 4 | U[A[BM(168)](N + 2)] >> 2, f[K++] = T >> 8 & 255, f[K++] = 255 & T), f;
  }, M[BW(169)] = function (A) {
    var BC = BW;
    for (var T, N = A[BC(68)], Q = N % 3, D = [], J = 0, f = N - Q; J < f; J += 16383) D[BC(167)](j(A, J, J + 16383 > f ? f : J + 16383));
    return 1 === Q ? (T = A[N - 1], D[BC(167)](g[T >> 2] + g[T << 4 & 63] + "==")) : 2 === Q && (T = (A[N - 2] << 8) + A[N - 1], D[BC(167)](g[T >> 10] + g[T >> 4 & 63] + g[T << 2 & 63] + "=")), D[BC(197)]("");
  };
  for (var g = [], U = [], p = BW(45) != typeof Uint8Array ? Uint8Array : Array, x = BW(1244), B = 0, b = x[BW(68)]; B < b; ++B) g[B] = x[B], U[x[BW(168)](B)] = B;
  function w(A) {
    var Bg = BW, T = A[Bg(68)];
    if (T % 4 > 0) throw new Error(Bg(1245));
    var N = A[Bg(161)]("=");
    return -1 === N && (N = T), [N, N === T ? 0 : 4 - N % 4];
  }
  function j(A, T, N) {
    var Br = BW;
    for (var Q, D = [], J = T; J < N; J += 3) Q = (A[J] << 16 & 16711680) + (A[J + 1] << 8 & 65280) + (255 & A[J + 2]), D[Br(167)](g[Q >> 18 & 63] + g[Q >> 12 & 63] + g[Q >> 6 & 63] + g[63 & Q]);
    return D[Br(197)]("");
  }
  U["-"[BW(168)](0)] = 62, U["_"[BW(168)](0)] = 63;
}, function (a, W) {
  var BU = Cv, M = {}[BU(77)];
  a[BU(42)] = Array[BU(60)] || function (C) {
    var Bn = BU;
    return Bn(107) == M[Bn(43)](C);
  };
}, function (a, W, M) {
  var Bp = Cv, C = M(0);
  function g(U) {
    return new Array(U);
  }
  (W = a[Bp(42)] = g(0))[Bp(65)] = g, W[Bp(66)] = C[Bp(66)], W[Bp(70)] = function (U) {
    var Bx = Bp;
    if (!C[Bx(58)](U) && C[Bx(62)](U)) U = C[Bx(75)][Bx(70)](U); else {
      if (C[Bx(61)](U)) U = new Uint8Array(U); else {
        if (Bx(52) == typeof U) return C[Bx(70)][Bx(43)](W, U);
        if (Bx(117) == typeof U) throw new TypeError(Bx(137));
      }
    }
    return Array[Bx(54)][Bx(72)][Bx(43)](U);
  };
}, function (a, W, M) {
  var Bu = Cv, C = M(0), g = C[Bu(56)];
  function U(p) {
    return new g(p);
  }
  (W = a[Bu(42)] = C[Bu(57)] ? U(0) : [])[Bu(65)] = C[Bu(57)] && g[Bu(65)] || U, W[Bu(66)] = C[Bu(66)], W[Bu(70)] = function (p) {
    var BB = Bu;
    if (!C[BB(58)](p) && C[BB(62)](p)) p = C[BB(75)][BB(70)](p); else {
      if (C[BB(61)](p)) p = new Uint8Array(p); else {
        if (BB(52) == typeof p) return C[BB(70)][BB(43)](W, p);
        if (BB(117) == typeof p) throw new TypeError(BB(137));
      }
    }
    return g[BB(70)] && 1 !== g[BB(70)][BB(68)] ? g[BB(70)](p) : new g(p);
  };
}, function (a, W, M) {
  var Bo = Cv, C = M(0);
  function g(U) {
    return new Uint8Array(U);
  }
  (W = a[Bo(42)] = C[Bo(59)] ? g(0) : [])[Bo(65)] = g, W[Bo(66)] = C[Bo(66)], W[Bo(70)] = function (U) {
    var Bb = Bo;
    if (C[Bb(62)](U)) {
      var p = U[Bb(1246)], x = U[Bb(118)];
      (U = U[Bb(64)])[Bb(118)] !== x && (U[Bb(72)] ? U = U[Bb(72)](p, p + x) : (U = new Uint8Array(U))[Bb(118)] !== x && (U = Array[Bb(54)][Bb(72)][Bb(43)](U, p, p + x)));
    } else {
      if (Bb(52) == typeof U) return C[Bb(70)][Bb(43)](W, U);
      if (Bb(117) == typeof U) throw new TypeError(Bb(137));
    }
    return new Uint8Array(U);
  };
}, function (a, W) {
  var Bw = Cv;
  W[Bw(69)] = function (M, C, g, U) {
    var BL = Bw, p;
    g || (g = 0), U || 0 === U || (U = this[BL(68)]), C || (C = 0);
    var x = U - g;
    if (M === this && g < C && C < U) {
      for (p = x - 1; p >= 0; p--) M[p + C] = this[p + g];
    } else {
      for (p = 0; p < x; p++) M[p + C] = this[p + g];
    }
    return x;
  }, W[Bw(77)] = function (M, C, g) {
    var Bj = Bw, U = 0 | C;
    g || (g = this[Bj(68)]);
    for (var p = "", x = 0; U < g;) (x = this[U++]) < 128 ? p += String[Bj(171)](x) : (192 == (224 & x) ? x = (31 & x) << 6 | 63 & this[U++] : 224 == (240 & x) ? x = (15 & x) << 12 | (63 & this[U++]) << 6 | 63 & this[U++] : 240 == (248 & x) && (x = (7 & x) << 18 | (63 & this[U++]) << 12 | (63 & this[U++]) << 6 | 63 & this[U++]), x >= 65536 ? (x -= 65536, p += String[Bj(171)](55296 + (x >>> 10), 56320 + (1023 & x))) : p += String[Bj(171)](x));
    return p;
  }, W[Bw(71)] = function (M, C) {
    var Bs = Bw;
    for (var g = C || (C |= 0), U = M[Bs(68)], p = 0, x = 0; x < U;) (p = M[Bs(168)](x++)) < 128 ? this[g++] = p : p < 2048 ? (this[g++] = 192 | p >>> 6, this[g++] = 128 | 63 & p) : p < 55296 || p > 57343 ? (this[g++] = 224 | p >>> 12, this[g++] = 128 | p >>> 6 & 63, this[g++] = 128 | 63 & p) : (p = 65536 + (p - 55296 << 10 | M[Bs(168)](x++) - 56320), this[g++] = 240 | p >>> 18, this[g++] = 128 | p >>> 12 & 63, this[g++] = 128 | p >>> 6 & 63, this[g++] = 128 | 63 & p);
    return g - C;
  };
}, function (W, M, C) {
  var BA = Cv;
  M[BA(93)] = function (A) {
    var BT = BA;
    A[BT(1247)](14, Error, [j, b]), A[BT(1247)](1, EvalError, [j, b]), A[BT(1247)](2, RangeError, [j, b]), A[BT(1247)](3, ReferenceError, [j, b]), A[BT(1247)](4, SyntaxError, [j, b]), A[BT(1247)](5, TypeError, [j, b]), A[BT(1247)](6, URIError, [j, b]), A[BT(1247)](10, RegExp, [L, b]), A[BT(1247)](11, Boolean, [w, b]), A[BT(1247)](12, String, [w, b]), A[BT(1247)](13, Date, [Number, b]), A[BT(1247)](15, Number, [w, b]), BT(45) != typeof Uint8Array && (A[BT(1247)](17, Int8Array, x), A[BT(1247)](18, Uint8Array, x), A[BT(1247)](19, Int16Array, x), A[BT(1247)](20, Uint16Array, x), A[BT(1247)](21, Int32Array, x), A[BT(1247)](22, Uint32Array, x), A[BT(1247)](23, Float32Array, x), BT(45) != typeof Float64Array && A[BT(1247)](24, Float64Array, x), BT(45) != typeof Uint8ClampedArray && A[BT(1247)](25, Uint8ClampedArray, x), A[BT(1247)](26, ArrayBuffer, x), A[BT(1247)](29, DataView, x)), U[BT(57)] && A[BT(1247)](27, p, U[BT(70)]);
  };
  var g, U = C(0), p = U[BA(56)], x = U[BA(75)][BA(70)], B = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};
  function b(A) {
    var Bi = BA;
    return g || (g = C(9)[Bi(89)]), g(A);
  }
  function w(A) {
    var BN = BA;
    return A[BN(1248)]();
  }
  function L(A) {
    var Bt = BA;
    (A = RegExp[Bt(54)][Bt(77)][Bt(43)](A)[Bt(615)]("/"))[Bt(265)]();
    var T = [A[Bt(1249)]()];
    return T[Bt(98)](A[Bt(197)]("/")), T;
  }
  function j(A) {
    var T = {};
    for (var N in B) T[N] = A[N];
    return T;
  }
}, function (W, M, C) {
  var Bl = Cv, g = C(5), U = C(7), x = U[Bl(119)], B = U[Bl(120)], b = C(0), w = C(6), L = C(34), j = C(13)[Bl(255)], A = C(3)[Bl(88)], T = Bl(45) != typeof Uint8Array, N = Bl(45) != typeof Map, Q = [];
  Q[1] = 212, Q[2] = 213, Q[4] = 214, Q[8] = 215, Q[16] = 216, M[Bl(90)] = function (D) {
    var BQ = Bl, J = L[BQ(1250)](D), K = D && D[BQ(1251)], F = T && D && D[BQ(273)], V = F ? b[BQ(61)] : b[BQ(58)], I = F ? function (R, P) {
      q(R, new Uint8Array(P));
    } : q, Z = N && D && D[BQ(275)] ? function (R, P) {
      var BD = BQ;
      if (!(P instanceof Map)) return E(R, P);
      var z = P[BD(1252)];
      J[z < 16 ? 128 + z : z <= 65535 ? 222 : 223](R, z);
      var Y = R[BD(131)][BD(89)];
      P[BD(67)](function (S, O, H0) {
        Y(R, O), Y(R, S);
      });
    } : E;
    return {boolean: function (R, P) {
      J[P ? 195 : 194](R, P);
    }, function: G, number: function (R, P) {
      var z = 0 | P;
      P === z ? J[-32 <= z && z <= 127 ? 255 & z : 0 <= z ? z <= 255 ? 204 : z <= 65535 ? 205 : 206 : -128 <= z ? 208 : -32768 <= z ? 209 : 210](R, z) : J[203](R, P);
    }, object: K ? function (R, P) {
      if (V(P)) return function (z, Y) {
        var BJ = h, S = Y[BJ(68)];
        J[S < 32 ? 160 + S : S <= 65535 ? 218 : 219](z, S), z[BJ(612)](Y);
      }(R, P);
      X(R, P);
    } : X, string: function (R) {
      return function (P, z) {
        var Bf = h, Y = z[Bf(68)], S = 5 + 3 * Y;
        P[Bf(111)] = P[Bf(256)](S);
        var O = P[Bf(64)], H0 = R(Y), H1 = P[Bf(111)] + H0;
        Y = w[Bf(71)][Bf(43)](O, z, H1);
        var H2 = R(Y);
        if (H0 !== H2) {
          var H3 = H1 + H2 - H0, H4 = H1 + Y;
          w[Bf(69)][Bf(43)](O, O, H3, H1, H4);
        }
        J[1 === H2 ? 160 + Y : H2 <= 3 ? 215 + H2 : 219](P, Y), P[Bf(111)] += Y;
      };
    }(K ? function (R) {
      return R < 32 ? 1 : R <= 65535 ? 3 : 5;
    } : function (R) {
      return R < 32 ? 1 : R <= 255 ? 2 : R <= 65535 ? 3 : 5;
    }), symbol: G, undefined: G};
    function X(R, P) {
      var Bd = BQ;
      if (null === P) return G(R, P);
      if (V(P)) return I(R, P);
      if (g(P)) return function (Y, S) {
        var BK = h, O = S[BK(68)];
        J[O < 16 ? 144 + O : O <= 65535 ? 220 : 221](Y, O);
        for (var H0 = Y[BK(131)][BK(89)], H1 = 0; H1 < O; H1++) H0(Y, S[H1]);
      }(R, P);
      if (x[Bd(1253)](P)) return function (Y, S) {
        var BF = Bd;
        J[207](Y, S[BF(114)]());
      }(R, P);
      if (B[Bd(1254)](P)) return function (Y, S) {
        var BV = Bd;
        J[211](Y, S[BV(114)]());
      }(R, P);
      var z = R[Bd(131)][Bd(1255)](P);
      if (z && (P = z(P)), P instanceof A) return function (Y, S) {
        var Bm = Bd, O = S[Bm(64)], H0 = O[Bm(68)], H1 = Q[H0] || (H0 < 255 ? 199 : H0 <= 65535 ? 200 : 201);
        J[H1](Y, H0), j[S[Bm(100)]](Y), Y[Bm(612)](O);
      }(R, P);
      Z(R, P);
    }
    function G(R, P) {
      J[192](R, P);
    }
    function q(R, P) {
      var Bk = BQ, z = P[Bk(68)];
      J[z < 255 ? 196 : z <= 65535 ? 197 : 198](R, z), R[Bk(612)](P);
    }
    function E(R, P) {
      var BI = BQ, z = Object[BI(280)](P), Y = z[BI(68)];
      J[Y < 16 ? 128 + Y : Y <= 65535 ? 222 : 223](R, Y);
      var S = R[BI(131)][BI(89)];
      z[BI(67)](function (O) {
        S(R, O), S(R, P[O]);
      });
    }
  };
}, function (W, M, C) {
  var BZ = Cv, U = C(4), x = C(7), B = x[BZ(119)], b = x[BZ(120)], L = C(13)[BZ(255)], j = C(0), A = j[BZ(56)], T = j[BZ(57)] && BZ(108) in A && !A[BZ(108)], N = j[BZ(57)] && A[BZ(54)] || {};
  function Q() {
    var BX = BZ, G = L[BX(72)]();
    return G[196] = D(196), G[197] = J(197), G[198] = K(198), G[199] = D(199), G[200] = J(200), G[201] = K(201), G[202] = F(202, 4, N[BX(242)] || Z, true), G[203] = F(203, 8, N[BX(244)] || X, true), G[204] = D(204), G[205] = J(205), G[206] = K(206), G[207] = F(207, 8, V), G[208] = D(208), G[209] = J(209), G[210] = K(210), G[211] = F(211, 8, I), G[217] = D(217), G[218] = J(218), G[219] = K(219), G[220] = J(220), G[221] = K(221), G[222] = J(222), G[223] = K(223), G;
  }
  function D(G) {
    return function (q, E) {
      var BG = h, R = q[BG(256)](2), P = q[BG(64)];
      P[R++] = G, P[R] = E;
    };
  }
  function J(G) {
    return function (q, E) {
      var Bq = h, R = q[Bq(256)](3), P = q[Bq(64)];
      P[R++] = G, P[R++] = E >>> 8, P[R] = E;
    };
  }
  function K(G) {
    return function (q, E) {
      var BE = h, R = q[BE(256)](5), P = q[BE(64)];
      P[R++] = G, P[R++] = E >>> 24, P[R++] = E >>> 16, P[R++] = E >>> 8, P[R] = E;
    };
  }
  function F(G, q, E, R) {
    return function (P, z) {
      var BR = h, Y = P[BR(256)](q + 1);
      P[BR(64)][Y++] = G, E[BR(43)](P[BR(64)], z, Y, R);
    };
  }
  function V(G, q) {
    new B(this, q, G);
  }
  function I(G, q) {
    new b(this, q, G);
  }
  function Z(G, q) {
    var Bv = BZ;
    U[Bv(71)](this, G, q, false, 23, 4);
  }
  function X(G, q) {
    var BP = BZ;
    U[BP(71)](this, G, q, false, 52, 8);
  }
  M[BZ(1250)] = function (G) {
    var Be = BZ;
    return G && G[Be(85)] ? function () {
      var q = Q();
      return q[202] = F(202, 4, Z), q[203] = F(203, 8, X), q;
    }() : T || j[Be(57)] && G && G[Be(1256)] ? function () {
      var Bz = Be, q = L[Bz(72)]();
      return q[196] = F(196, 1, A[Bz(54)][Bz(229)]), q[197] = F(197, 2, A[Bz(54)][Bz(231)]), q[198] = F(198, 4, A[Bz(54)][Bz(233)]), q[199] = F(199, 1, A[Bz(54)][Bz(229)]), q[200] = F(200, 2, A[Bz(54)][Bz(231)]), q[201] = F(201, 4, A[Bz(54)][Bz(233)]), q[202] = F(202, 4, A[Bz(54)][Bz(242)]), q[203] = F(203, 8, A[Bz(54)][Bz(244)]), q[204] = F(204, 1, A[Bz(54)][Bz(229)]), q[205] = F(205, 2, A[Bz(54)][Bz(231)]), q[206] = F(206, 4, A[Bz(54)][Bz(233)]), q[207] = F(207, 8, V), q[208] = F(208, 1, A[Bz(54)][Bz(236)]), q[209] = F(209, 2, A[Bz(54)][Bz(238)]), q[210] = F(210, 4, A[Bz(54)][Bz(240)]), q[211] = F(211, 8, I), q[217] = F(217, 1, A[Bz(54)][Bz(229)]), q[218] = F(218, 2, A[Bz(54)][Bz(231)]), q[219] = F(219, 4, A[Bz(54)][Bz(233)]), q[220] = F(220, 2, A[Bz(54)][Bz(231)]), q[221] = F(221, 4, A[Bz(54)][Bz(233)]), q[222] = F(222, 2, A[Bz(54)][Bz(231)]), q[223] = F(223, 4, A[Bz(54)][Bz(233)]), q;
    }() : Q();
  };
}, function (W, M, C) {
  var BY = Cv;
  M[BY(128)] = function (A) {
    var Bc = BY;
    A[Bc(1257)](14, [B, w(Error)]), A[Bc(1257)](1, [B, w(EvalError)]), A[Bc(1257)](2, [B, w(RangeError)]), A[Bc(1257)](3, [B, w(ReferenceError)]), A[Bc(1257)](4, [B, w(SyntaxError)]), A[Bc(1257)](5, [B, w(TypeError)]), A[Bc(1257)](6, [B, w(URIError)]), A[Bc(1257)](10, [B, b]), A[Bc(1257)](11, [B, L(Boolean)]), A[Bc(1257)](12, [B, L(String)]), A[Bc(1257)](13, [B, L(Date)]), A[Bc(1257)](15, [B, L(Number)]), Bc(45) != typeof Uint8Array && (A[Bc(1257)](17, L(Int8Array)), A[Bc(1257)](18, L(Uint8Array)), A[Bc(1257)](19, [j, L(Int16Array)]), A[Bc(1257)](20, [j, L(Uint16Array)]), A[Bc(1257)](21, [j, L(Int32Array)]), A[Bc(1257)](22, [j, L(Uint32Array)]), A[Bc(1257)](23, [j, L(Float32Array)]), Bc(45) != typeof Float64Array && A[Bc(1257)](24, [j, L(Float64Array)]), Bc(45) != typeof Uint8ClampedArray && A[Bc(1257)](25, L(Uint8ClampedArray)), A[Bc(1257)](26, j), A[Bc(1257)](29, [j, L(DataView)])), U[Bc(57)] && A[Bc(1257)](27, L(p));
  };
  var g, U = C(0), p = U[BY(56)], x = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};
  function B(A) {
    var By = BY;
    return g || (g = C(15)[By(125)]), g(A);
  }
  function b(A) {
    var BS = BY;
    return RegExp[BS(84)](null, A);
  }
  function w(A) {
    return function (T) {
      var N = new A;
      for (var Q in x) N[Q] = T[Q];
      return N;
    };
  }
  function L(A) {
    return function (T) {
      return new A(T);
    };
  }
  function j(A) {
    var BO = BY;
    return new Uint8Array(A)[BO(64)];
  }
}, function (W, M, C) {
  var o1 = Cv, g = C(17);
  function U(B) {
    var o0 = h, b, w = new Array(256);
    for (b = 0; b <= 127; b++) w[b] = p(b);
    for (b = 128; b <= 143; b++) w[b] = u(b - 128, B[o0(1258)]);
    for (b = 144; b <= 159; b++) w[b] = u(b - 144, B[o0(1259)]);
    for (b = 160; b <= 191; b++) w[b] = u(b - 160, B[o0(1260)]);
    for (w[192] = p(null), w[193] = null, w[194] = p(false), w[195] = p(true), w[196] = x(B[o0(255)], B[o0(402)]), w[197] = x(B[o0(1261)], B[o0(402)]), w[198] = x(B[o0(1262)], B[o0(402)]), w[199] = x(B[o0(255)], B[o0(1263)]), w[200] = x(B[o0(1261)], B[o0(1263)]), w[201] = x(B[o0(1262)], B[o0(1263)]), w[202] = B[o0(1264)], w[203] = B[o0(1265)], w[204] = B[o0(255)], w[205] = B[o0(1261)], w[206] = B[o0(1262)], w[207] = B[o0(1266)], w[208] = B[o0(1267)], w[209] = B[o0(1268)], w[210] = B[o0(1269)], w[211] = B[o0(274)], w[212] = u(1, B[o0(1263)]), w[213] = u(2, B[o0(1263)]), w[214] = u(4, B[o0(1263)]), w[215] = u(8, B[o0(1263)]), w[216] = u(16, B[o0(1263)]), w[217] = x(B[o0(255)], B[o0(1260)]), w[218] = x(B[o0(1261)], B[o0(1260)]), w[219] = x(B[o0(1262)], B[o0(1260)]), w[220] = x(B[o0(1261)], B[o0(1259)]), w[221] = x(B[o0(1262)], B[o0(1259)]), w[222] = x(B[o0(1261)], B[o0(1258)]), w[223] = x(B[o0(1262)], B[o0(1258)]), b = 224; b <= 255; b++) w[b] = p(b - 256);
    return w;
  }
  function p(B) {
    return function () {
      return B;
    };
  }
  function x(B, b) {
    return function (w) {
      var L = B(w);
      return b(w, L);
    };
  }
  function u(B, b) {
    return function (w) {
      return b(w, B);
    };
  }
  M[o1(126)] = function (B) {
    var o2 = o1, b = g[o2(272)](B);
    return B && B[o2(1251)] ? function (w) {
      var o3 = o2, L, j = U(w)[o3(72)]();
      for (j[217] = j[196], j[218] = j[197], j[219] = j[198], L = 160; L <= 191; L++) j[L] = u(L - 160, w[o3(402)]);
      return j;
    }(b) : U(b);
  };
}, function (a, W, M) {
  var o4 = Cv;
  W[o4(1242)] = U;
  var C = M(18), g = M(10)[o4(130)];
  function U(p) {
    var o5 = o4;
    if (!(this instanceof U)) return new U(p);
    g[o5(43)](this, p);
  }
  U[o4(54)] = new g, C[o4(133)](U[o4(54)]), U[o4(54)][o4(89)] = function (p) {
    var o6 = o4;
    this[o6(71)](p), this[o6(1270)](o6(143), this[o6(101)]());
  }, U[o4(54)][o4(1271)] = function (p) {
    var o7 = o4;
    arguments[o7(68)] && this[o7(89)](p), this[o7(262)](), this[o7(1270)](o7(1271));
  };
}, function (a, W, M) {
  var o8 = Cv;
  W[o8(1243)] = U;
  var C = M(18), g = M(16)[o8(271)];
  function U(p) {
    var o9 = o8;
    if (!(this instanceof U)) return new U(p);
    g[o9(43)](this, p);
  }
  U[o8(54)] = new g, C[o8(133)](U[o8(54)]), U[o8(54)][o8(125)] = function (p) {
    var oH = o8;
    arguments[oH(68)] && this[oH(71)](p), this[oH(262)]();
  }, U[o8(54)][o8(167)] = function (p) {
    var oh = o8;
    this[oh(1270)](oh(143), p);
  }, U[o8(54)][o8(1271)] = function (p) {
    var oa = o8;
    this[oa(125)](p), this[oa(1270)](oa(1271));
  };
}, function (a, W, M) {
  var oW = Cv;
  M(8), M(2), W[oW(78)] = M(1)[oW(78)];
}, function (a, W, M) {
  var oM = Cv;
  M(8), M(2), W[oM(131)] = {preset: M(1)[oM(87)]};
}, function (W, M) {
  var oC = Cv, C, U, x = W[oC(42)] = {};
  function B() {
    var og = oC;
    throw new Error(og(1272));
  }
  function b() {
    var or = oC;
    throw new Error(or(1273));
  }
  function w(K) {
    var oU = oC;
    if (C === setTimeout) return setTimeout(K, 0);
    if ((C === B || !C) && setTimeout) return C = setTimeout, setTimeout(K, 0);
    try {
      return C(K, 0);
    } catch (F) {
      try {
        return C[oU(43)](null, K, 0);
      } catch (V) {
        return C[oU(43)](this, K, 0);
      }
    }
  }
  !function () {
    var on = oC;
    try {
      C = on(149) == typeof setTimeout ? setTimeout : B;
    } catch (K) {
      C = B;
    }
    try {
      U = on(149) == typeof clearTimeout ? clearTimeout : b;
    } catch (F) {
      U = b;
    }
  }();
  var L, j = [], A = false, T = -1;
  function N() {
    var op = oC;
    A && L && (A = false, L[op(68)] ? j = L[op(66)](j) : T = -1, j[op(68)] && Q());
  }
  function Q() {
    var ox = oC;
    if (!A) {
      var K = w(N);
      A = true;
      for (var F = j[ox(68)]; F;) {
        for (L = j, j = []; ++T < F;) L && L[T][ox(1274)]();
        T = -1, F = j[ox(68)];
      }
      L = null, A = false, function (V) {
        var ou = ox;
        if (U === clearTimeout) return clearTimeout(V);
        if ((U === b || !U) && clearTimeout) return U = clearTimeout, clearTimeout(V);
        try {
          U(V);
        } catch (m) {
          try {
            return U[ou(43)](null, V);
          } catch (k) {
            return U[ou(43)](this, V);
          }
        }
      }(K);
    }
  }
  function D(K, F) {
    var oB = oC;
    this[oB(1275)] = K, this[oB(1259)] = F;
  }
  function J() {}
  x[oC(1276)] = function (K) {
    var oo = oC, F = new Array(arguments[oo(68)] - 1);
    if (arguments[oo(68)] > 1) {
      for (var V = 1; V < arguments[oo(68)]; V++) F[V - 1] = arguments[V];
    }
    j[oo(167)](new D(K, F)), 1 !== j[oo(68)] || A || w(Q);
  }, D[oC(54)][oC(1274)] = function () {
    var ob = oC;
    this[ob(1275)][ob(84)](null, this[ob(1259)]);
  }, x[oC(1277)] = oC(1278), x[oC(1278)] = true, x[oC(304)] = {}, x[oC(285)] = [], x[oC(1279)] = "", x[oC(1280)] = {}, x.on = J, x[oC(1281)] = J, x[oC(1282)] = J, x[oC(1283)] = J, x[oC(1284)] = J, x[oC(1285)] = J, x[oC(1270)] = J, x[oC(1286)] = J, x[oC(1287)] = J, x[oC(278)] = function (K) {
    return [];
  }, x[oC(1288)] = function (K) {
    var ow = oC;
    throw new Error(ow(1289));
  }, x[oC(1290)] = function () {
    return "/";
  }, x[oC(1291)] = function (K) {
    var oL = oC;
    throw new Error(oL(1292));
  }, x[oC(1293)] = function () {
    return 0;
  };
}, function (a, W) {
  var oj = Cv, M = Math[oj(103)], C = (Math[oj(1026)], Math[oj(1025)], Math[oj(102)], Math[oj(1013)]), g = (M = Math[oj(103)], Math[oj(791)]), U = Math.PI;
  a[oj(42)][oj(1060)] = function (p, x) {
    var os = oj;
    return Math[os(104)](Math[os(1294)]() * (x - p + 1)) + p;
  }, a[oj(42)][oj(1053)] = function (p, x) {
    var oA = oj;
    return Math[oA(1294)]() * (x - p + 1) + p;
  }, a[oj(42)][oj(1295)] = function (p, x, u) {
    return p + (x - p) * u;
  }, a[oj(42)][oj(1296)] = function (p, x) {
    var oT = oj;
    return p > 0 ? p = Math[oT(268)](0, p - x) : p < 0 && (p = Math[oT(170)](0, p + x)), p;
  }, a[oj(42)][oj(1161)] = function (p, x, u, B) {
    return C((u -= p) * u + (B -= x) * B);
  }, a[oj(42)][oj(1162)] = function (p, x, u, B) {
    return g(x - B, p - u);
  }, a[oj(42)][oj(1297)] = function (p, x) {
    var u = M(x - p) % (2 * U);
    return u > U ? 2 * U - u : u;
  }, a[oj(42)][oj(1298)] = function (p) {
    var oi = oj;
    return oi(117) == typeof p && !isNaN(p) && isFinite(p);
  }, a[oj(42)][oj(1299)] = function (p) {
    var oN = oj;
    return p && oN(52) == typeof p;
  }, a[oj(42)][oj(1010)] = function (p) {
    var ot = oj;
    return p > 999 ? (p / 1e3)[ot(1300)](1) + "k" : p;
  }, a[oj(42)][oj(634)] = function (p) {
    var ol = oj;
    return p[ol(1301)](0)[ol(1302)]() + p[ol(72)](1);
  }, a[oj(42)][oj(797)] = function (p, x) {
    var oQ = oj;
    return parseFloat(p[oQ(1300)](x));
  }, a[oj(42)][oj(1303)] = function (p, x) {
    var oD = oj;
    return parseFloat(x[oD(382)]) - parseFloat(p[oD(382)]);
  }, a[oj(42)][oj(1304)] = function (x, B, b, w, L, j, A, T) {
    var oJ = oj, N = L, Q = A;
    if (L > A && (N = A, Q = L), Q > b && (Q = b), N < x && (N = x), N > Q) return false;
    var D = j, J = T, K = A - L;
    if (Math[oJ(103)](K) > 1e-7) {
      var F = (T - j) / K, V = j - F * L;
      D = F * N + V, J = F * Q + V;
    }
    if (D > J) {
      var m = J;
      J = D, D = m;
    }
    return J > w && (J = w), D < B && (D = B), !(D > J);
  }, a[oj(42)][oj(1305)] = function (p, x, u) {
    var of = oj, B = p[of(1306)](), b = B[of(19)] + window[of(1307)], w = B[of(4)] + window[of(1308)], L = B[of(21)], j = B[of(23)];
    return x > b && x < b + L && u > w && u < w + j;
  }, a[oj(42)][oj(1309)] = function (p) {
    var oK = oj, x = p[oK(784)][0];
    p[oK(1310)] = x[oK(1310)], p[oK(1311)] = x[oK(1311)], p[oK(809)] = x[oK(809)], p[oK(810)] = x[oK(810)], p[oK(801)] = x[oK(801)], p[oK(802)] = x[oK(802)];
  }, a[oj(42)][oj(427)] = function (p, x) {
    var oF = oj, u = !x, B = false;
    function o(b) {
      var od = h;
      a[od(42)][od(1309)](b), window[od(799)](true), u && (b[od(485)](), b[od(783)]()), B && (p[od(424)] && p[od(424)](b), p[od(1312)] && p[od(1312)](b), B = false);
    }
    p[oF(613)](oF(803), a[oF(42)][oF(425)](function (b) {
      var oV = oF;
      a[oV(42)][oV(1309)](b), window[oV(799)](true), u && (b[oV(485)](), b[oV(783)]()), p[oV(482)] && p[oV(482)](b), B = true;
    }), false), p[oF(613)](oF(800), a[oF(42)][oF(425)](function (b) {
      var om = oF;
      a[om(42)][om(1309)](b), window[om(799)](true), u && (b[om(485)](), b[om(783)]()), a[om(42)][om(1305)](p, b[om(801)], b[om(802)]) ? B || (p[om(482)] && p[om(482)](b), B = true) : B && (p[om(1312)] && p[om(1312)](b), B = false);
    }), false), p[oF(613)](oF(805), a[oF(42)][oF(425)](o), false), p[oF(613)](oF(806), a[oF(42)][oF(425)](o), false), p[oF(613)](oF(807), a[oF(42)][oF(425)](o), false);
  }, a[oj(42)][oj(458)] = function (p) {
    var ok = oj;
    for (; p[ok(1313)]();) p[ok(1314)](p[ok(1315)]);
  }, a[oj(42)][oj(461)] = function (p) {
    var oI = oj, x = document[oI(12)](p[oI(1316)] || oI(13));
    function u(b, w) {
      p[b] && (x[w] = p[b]);
    }
    for (var B in u(oI(669), oI(1317)), u(oI(1318), oI(36)), u(oI(1319), oI(1217)), p) {
      switch (B) {
        case oI(1316):
        case oI(669):
        case oI(1318):
        case oI(1319):
        case oI(15):
        case oI(1320):
        case oI(1321):
        case oI(1322):
          continue;
      }
      x[B] = p[B];
    }
    if (x[oI(424)] && (x[oI(424)] = a[oI(42)][oI(425)](x[oI(424)])), x[oI(482)] && (x[oI(482)] = a[oI(42)][oI(425)](x[oI(482)])), x[oI(1312)] && (x[oI(1312)] = a[oI(42)][oI(425)](x[oI(1312)])), p[oI(15)] && (x[oI(15)][oI(1323)] = p[oI(15)]), p[oI(1320)] && a[oI(42)][oI(427)](x), p[oI(1321)] && p[oI(1321)][oI(1324)](x), p[oI(1322)]) {
      for (var o = 0; o < p[oI(1322)][oI(68)]; o++) x[oI(1324)](p[oI(1322)][o]);
    }
    return x;
  }, a[oj(42)][oj(1325)] = function (p) {
    var oZ = oj;
    return !p || oZ(1326) != typeof p[oZ(1327)] || p[oZ(1327)];
  }, a[oj(42)][oj(425)] = function (p) {
    return function (x) {
      var oX = h;
      x && x instanceof Event && a[oX(42)][oX(1325)](x) && p(x);
    };
  }, a[oj(42)][oj(1328)] = function (p) {
    var oG = oj;
    for (var x = "", u = oG(1329), B = 0; B < p; B++) x += u[oG(1301)](Math[oG(104)](Math[oG(1294)]() * u[oG(68)]));
    return x;
  }, a[oj(42)][oj(1330)] = function (p, x) {
    var oq = oj;
    for (var u = 0, B = 0; B < p[oq(68)]; B++) p[B] === x && u++;
    return u;
  };
}, function (a, W) {
  var oE = Cv;
  a[oE(42)][oE(1331)] = function () {
    var oR = oE;
    this[oR(83)] = function (M, C, g, U, p, x, u) {
      var ov = oR;
      this.x = M, this.y = C, this[ov(27)] = u, this[ov(675)] = g, this[ov(1332)] = this[ov(675)], this[ov(1333)] = 1.5 * g, this[ov(1334)] = 0.7, this[ov(1112)] = U, this[ov(1335)] = p, this[ov(669)] = x;
    }, this[oR(676)] = function (M) {
      var oP = oR;
      this[oP(1335)] && (this[oP(1335)] -= M, this.y -= this[oP(1112)] * M, this[oP(675)] += this[oP(1334)] * M, this[oP(675)] >= this[oP(1333)] ? (this[oP(675)] = this[oP(1333)], this[oP(1334)] *= -1) : this[oP(675)] <= this[oP(1332)] && (this[oP(675)] = this[oP(1332)], this[oP(1334)] = 0), this[oP(1335)] <= 0 && (this[oP(1335)] = 0));
    }, this[oR(1336)] = function (M, C, g) {
      var oe = oR;
      document[oe(38)](oe(1034))[oe(488)] ? (M[oe(473)] = this[oe(27)], M[oe(1027)] = "rt", M[oe(1169)] = this[oe(675)] + oe(1171), M[oe(1027)] = "rt", M[oe(1175)](this[oe(669)], this.x - C, this.y - g), M[oe(1027)] = "rt", M[oe(1176)](this[oe(669)], this.x - C, this.y - g), M[oe(1027)] = "rt") : (M[oe(473)] = this[oe(27)], M[oe(1169)] = this[oe(675)] + oe(1171), M[oe(1176)](this[oe(669)], this.x - C, this.y - g));
    };
  }, a[oE(42)][oE(411)] = function () {
    var oz = oE;
    this[oz(1337)] = [], this[oz(676)] = function (M, C, g, U) {
      var oY = oz;
      C[oY(1172)] = oY(1173), C[oY(18)] = oY(1174);
      for (var p = 0; p < this[oY(1337)][oY(68)]; ++p) this[oY(1337)][p][oY(1335)] && (this[oY(1337)][p][oY(676)](M), this[oY(1337)][p][oY(1336)](C, g, U));
    }, this[oz(952)] = function (M, C, g, U, p, x, u) {
      var oc = oz;
      for (var B, b = 0; b < this[oc(1337)][oc(68)]; ++b) if (!this[oc(1337)][b][oc(1335)]) {
        B = this[oc(1337)][b];
        break;
      }
      B || (B = new a[oc(42)][oc(1331)], this[oc(1337)][oc(167)](B)), B[oc(83)](M, C, g, U, p, x, u);
    };
  };
}, function (a, W) {
  var oy = Cv;
  a[oy(42)] = function (M) {
    var oS = oy;
    this[oS(654)] = M, this[oS(83)] = function (C, g, U, p, x, u, B) {
      var oO = oS;
      u = u || {}, this[oO(1338)] = {}, this[oO(1339)] = [], this[oO(674)] = true, this[oO(1340)] = u[oO(1340)], this.x = C, this.y = g, this[oO(1016)] = U, this[oO(1020)] = 0, this[oO(1021)] = 0, this[oO(675)] = p, this[oO(100)] = x, this.id = u.id, this[oO(736)] = B, this[oO(94)] = u[oO(94)], this[oO(1024)] = null != this.id, this[oO(643)] = u[oO(643)], this[oO(983)] = u[oO(983)], this[oO(1015)] = 2, null != this[oO(643)] ? this[oO(1015)] = this[oO(643)][oO(1015)] : 0 == this[oO(100)] ? this[oO(1015)] = 3 : 2 == this[oO(100)] ? this[oO(1015)] = 0 : 4 == this[oO(100)] && (this[oO(1015)] = -1), this[oO(1341)] = u[oO(1341)] || 1, this[oO(1022)] = u[oO(1022)], this[oO(1143)] = u[oO(1143)], this[oO(1342)] = u[oO(1342)], this[oO(1023)] = u[oO(1023)], this[oO(1343)] = u[oO(1343)], this[oO(1344)] = u[oO(1344)], this[oO(1122)] = u[oO(1122)], this[oO(1345)] = u[oO(1345)], this[oO(1346)] = u[oO(1346)], this[oO(1031)] = u[oO(1031)] || 0, this[oO(1347)] = u[oO(1347)], this[oO(640)] = u[oO(640)], this[oO(1134)] = u[oO(1134)], this[oO(1348)] = u[oO(1348)], this[oO(1349)] = u[oO(1349)], this[oO(1350)] = u[oO(1350)], this[oO(1046)] = u[oO(1046)], this[oO(1351)] = u[oO(1351)], this[oO(1352)] = u[oO(1352)], this[oO(1353)] = this[oO(1352)], this[oO(1354)] = u[oO(1354)];
    }, this[oS(1355)] = function (C, g) {
      var b0 = oS;
      return this[b0(983)] += C, this[b0(983)] <= 0;
    }, this[oS(1356)] = function (C, g) {
      var b1 = oS;
      return C = C || 1, this[b1(675)] * (this[b1(1024)] || 2 == this[b1(100)] || 3 == this[b1(100)] || 4 == this[b1(100)] ? 1 : 0.6 * C) * (g ? 1 : this[b1(1341)]);
    }, this[oS(1357)] = function (C) {
      var b2 = oS;
      return !this[b2(1023)] || this[b2(736)] && (this[b2(736)] == C || this[b2(736)][b2(652)] && C[b2(652)] == this[b2(736)][b2(652)]);
    }, this[oS(676)] = function (C) {
      var b3 = oS;
      this[b3(674)] && (this[b3(1020)] && (this[b3(1020)] *= Math[b3(102)](0.99, C)), this[b3(1021)] && (this[b3(1021)] *= Math[b3(102)](0.99, C)), this[b3(1347)] && (this[b3(1016)] += this[b3(1347)] * C));
    };
  };
}, function (a, W) {
  var b4 = Cv;
  a[b4(42)][b4(1358)] = [{id: 0, name: b4(380), layer: 0}, {id: 1, name: b4(1359), place: true, limit: 30, layer: 0}, {id: 2, name: b4(1085), place: true, limit: 15, layer: 0}, {id: 3, name: b4(1360), place: true, limit: 7, layer: 1}, {id: 4, name: b4(1093), place: true, limit: 1, layer: 0}, {id: 5, name: b4(1134), place: true, limit: 6, layer: -1}, {id: 6, name: b4(1361), place: true, limit: 12, layer: -1}, {id: 7, name: b4(1099), place: true, limit: 2, layer: 1}, {id: 8, name: b4(1362), place: true, limit: 12, layer: 1}, {id: 9, name: b4(1363), place: true, limit: 4, layer: -1}, {id: 10, name: b4(1115), place: true, limit: 1, layer: -1}, {id: 11, name: b4(1094), place: true, limit: 2, layer: 0}, {id: 12, name: b4(1022), place: true, limit: 3, layer: -1}, {id: 13, name: b4(1105), place: true, limit: 2, layer: -1}], W[b4(1017)] = [{indx: 0, layer: 0, src: b4(1364), dmg: 25, speed: 1.6, scale: 103, range: 1e3}, {indx: 1, layer: 1, dmg: 25, scale: 20}, {indx: 0, layer: 0, src: b4(1364), dmg: 35, speed: 2.5, scale: 103, range: 1200}, {indx: 0, layer: 0, src: b4(1364), dmg: 30, speed: 2, scale: 103, range: 1200}, {indx: 1, layer: 1, dmg: 16, scale: 20}, {indx: 0, layer: 0, src: b4(1365), dmg: 50, speed: 3.6, scale: 160, range: 1400}], W[b4(459)] = window[b4(459)] = [{id: 0, type: 0, name: b4(1366), desc: b4(1367), src: b4(1368), length: 140, width: 140, xOff: -3, yOff: 18, dmg: 25, range: 65, gather: 1, speed: 300}, {id: 1, type: 0, age: 2, name: b4(1369), desc: b4(1370), src: b4(1371), length: 140, width: 140, xOff: 3, yOff: 24, dmg: 30, spdMult: 1, range: 70, gather: 2, speed: 400}, {id: 2, type: 0, age: 8, pre: 1, name: b4(1372), desc: b4(1373), src: b4(1374), length: 140, width: 140, xOff: -8, yOff: 25, dmg: 35, spdMult: 1, range: 75, gather: 4, speed: 400}, {id: 3, type: 0, age: 2, name: b4(1375), desc: b4(1376), src: b4(1377), iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 46, dmg: 35, spdMult: 0.85, range: 110, gather: 1, speed: 300}, {id: 4, type: 0, age: 8, pre: 3, name: b4(1378), desc: b4(1379), src: b4(1380), iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 59, dmg: 40, spdMult: 0.8, range: 118, gather: 1, speed: 300}, {id: 5, type: 0, age: 2, name: b4(1381), desc: b4(1382), src: b4(1383), iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 53, dmg: 45, knock: 0.2, spdMult: 0.82, range: 142, gather: 1, speed: 700}, {id: 6, type: 0, age: 2, name: b4(1384), desc: b4(1385), src: b4(1386), iPad: 1.3, length: 110, width: 180, xOff: -8, yOff: 53, dmg: 20, knock: 0.7, range: 110, gather: 1, speed: 300}, {id: 7, type: 0, age: 2, name: b4(1387), desc: b4(1388), src: b4(1389), iPad: 0.8, length: 110, width: 110, xOff: 18, yOff: 0, dmg: 20, knock: 0.1, range: 65, gather: 1, hitSlow: 0.1, spdMult: 1.13, speed: 100}, {id: 8, type: 0, age: 2, name: b4(1390), desc: b4(1391), src: b4(1392), length: 140, width: 140, xOff: 3, yOff: 24, dmg: 1, spdMult: 1, range: 70, gather: 7, speed: 400}, {id: 9, type: 1, age: 6, name: b4(1393), desc: b4(1394), src: b4(1395), req: [b4(379), 4], length: 120, width: 120, xOff: -6, yOff: 0, projectile: 0, spdMult: 0.75, speed: 600}, {id: 10, type: 1, age: 6, name: b4(1396), desc: b4(1397), src: b4(1398), length: 140, width: 140, xOff: -9, yOff: 25, dmg: 10, spdMult: 0.88, range: 75, sDmg: 7.5, gather: 1, speed: 400}, {id: 11, type: 1, age: 6, name: b4(1399), desc: b4(1400), src: b4(1401), length: 120, width: 120, shield: 0.2, xOff: 6, yOff: 0, spdMult: 0.7}, {id: 12, type: 1, age: 8, pre: 9, name: b4(1402), desc: b4(1403), src: b4(1404), req: [b4(379), 5], aboveHand: true, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 2, spdMult: 0.7, speed: 700}, {id: 13, type: 1, age: 9, pre: 12, name: b4(1405), desc: b4(1406), src: b4(1407), req: [b4(379), 10], aboveHand: true, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 3, spdMult: 0.7, speed: 230}, {id: 14, type: 1, age: 6, name: b4(1408), desc: b4(1409), src: b4(1410), length: 130, width: 210, xOff: -8, yOff: 53, dmg: 0, steal: 250, knock: 0.2, spdMult: 1.05, range: 125, gather: 0, speed: 700}, {id: 15, type: 1, age: 9, pre: 12, name: b4(1411), desc: b4(1412), src: b4(1413), req: [b4(381), 10], aboveHand: true, rec: 0.35, armS: 0.6, hndS: 0.3, hndD: 1.6, length: 205, width: 205, xOff: 25, yOff: 0, projectile: 5, hideProjectile: true, spdMult: 0.6, speed: 1500}], a[b4(42)][b4(460)] = [{group: a[b4(42)][b4(1358)][0], name: b4(1071), desc: b4(1414), req: [b4(380), 10], consume: function (C) {
    var b5 = b4;
    return C[b5(1355)](20, C);
  }, scale: 22, holdOffset: 15}, {age: 3, group: a[b4(42)][b4(1358)][0], name: b4(1072), desc: b4(1415), req: [b4(380), 15], consume: function (C) {
    var b6 = b4;
    return C[b6(1355)](40, C);
  }, scale: 27, holdOffset: 15}, {age: 7, group: a[b4(42)][b4(1358)][0], name: b4(1075), desc: b4(1416), req: [b4(380), 25], consume: function (C) {
    var b7 = b4;
    return !!(C[b7(1355)](30, C) || C[b7(983)] < 100) && (C[b7(1417)][b7(1122)] = -10, C[b7(1417)][b7(1418)] = C, C[b7(1417)][b7(1419)] = 5, true);
  }, scale: 27, holdOffset: 15}, {group: a[b4(42)][b4(1358)][1], name: b4(1078), desc: b4(1420), req: [b4(379), 10], projDmg: true, health: 380, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 3, group: a[b4(42)][b4(1358)][1], name: b4(1079), desc: b4(1421), req: [b4(381), 25], health: 900, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 7, pre: 1, group: a[b4(42)][b4(1358)][1], name: b4(1080), desc: b4(1422), req: [b4(381), 35], health: 1500, scale: 52, holdOffset: 20, placeOffset: -5}, {group: a[b4(42)][b4(1358)][2], name: b4(1085), desc: b4(1423), req: [b4(379), 20, b4(381), 5], health: 400, dmg: 20, scale: 49, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 5, group: a[b4(42)][b4(1358)][2], name: b4(1086), desc: b4(1423), req: [b4(379), 30, b4(381), 10], health: 500, dmg: 35, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 1, group: a[b4(42)][b4(1358)][2], name: b4(1087), desc: b4(1424), req: [b4(379), 35, b4(381), 15], health: 600, dmg: 30, pDmg: 5, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 2, group: a[b4(42)][b4(1358)][2], name: b4(1088), desc: b4(1423), req: [b4(379), 30, b4(381), 20], health: 500, dmg: 45, turnSpeed: 0.003, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {group: a[b4(42)][b4(1358)][3], name: b4(1090), desc: b4(1425), req: [b4(379), 50, b4(381), 10], health: 400, pps: 1, spritePadding: 25, iconLineMult: 12, scale: 45, holdOffset: 20, placeOffset: 5}, {age: 5, pre: 1, group: a[b4(42)][b4(1358)][3], name: b4(1091), desc: b4(1426), req: [b4(379), 60, b4(381), 20], health: 500, pps: 1.5, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 8, pre: 1, group: a[b4(42)][b4(1358)][3], name: b4(1092), desc: b4(1426), req: [b4(379), 100, b4(381), 50], health: 800, pps: 2, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 5, group: a[b4(42)][b4(1358)][4], type: 2, name: b4(1093), desc: b4(1427), req: [b4(379), 20, b4(381), 100], iconLineMult: 12, scale: 65, holdOffset: 20, placeOffset: 0}, {age: 5, group: a[b4(42)][b4(1358)][11], type: 0, name: b4(1094), desc: b4(1428), req: [b4(379), 150], iconLineMult: 12, colDiv: 0.5, scale: 110, holdOffset: 50, placeOffset: -15}, {age: 4, group: a[b4(42)][b4(1358)][5], name: b4(1095), desc: b4(1429), req: [b4(379), 30, b4(381), 30], trap: true, ignoreCollision: true, hideFromEnemy: true, health: 500, colDiv: 0.2, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 4, group: a[b4(42)][b4(1358)][6], name: b4(1096), desc: b4(1430), req: [b4(381), 20, b4(379), 5], ignoreCollision: true, boostSpeed: 1.5, health: 150, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: a[b4(42)][b4(1358)][7], doUpdate: true, name: b4(1099), desc: b4(1431), req: [b4(379), 200, b4(381), 150], health: 800, projectile: 1, shootRange: 700, shootRate: 2200, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: a[b4(42)][b4(1358)][8], name: b4(1100), desc: b4(1432), req: [b4(379), 20], ignoreCollision: true, zIndex: 1, health: 300, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: a[b4(42)][b4(1358)][9], name: b4(1102), desc: b4(1433), req: [b4(379), 30, b4(380), 10], ignoreCollision: true, healCol: 15, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 9, group: a[b4(42)][b4(1358)][10], name: b4(1103), desc: b4(1434), req: [b4(379), 100, b4(381), 100], health: 400, ignoreCollision: true, spawnPoint: true, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: a[b4(42)][b4(1358)][12], name: b4(1022), desc: b4(1435), req: [b4(379), 30, b4(381), 25], ignoreCollision: true, blocker: 300, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: a[b4(42)][b4(1358)][13], name: b4(1105), desc: b4(1436), req: [b4(379), 60, b4(381), 60], ignoreCollision: true, teleport: true, health: 200, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}];
  for (var M = 0; M < a[b4(42)][b4(460)][b4(68)]; ++M) a[b4(42)][b4(460)][M].id = M, a[b4(42)][b4(460)][M][b4(1437)] && (a[b4(42)][b4(460)][M][b4(1437)] = M - a[b4(42)][b4(460)][M][b4(1437)]);
}, function (a, W) {
  var b8 = Cv;
  a[b8(42)] = {};
}, function (W, M) {
  var b9 = Cv, C = Math[b9(104)], g = Math[b9(103)], U = Math[b9(1026)], p = Math[b9(1025)], x = (Math[b9(102)], Math[b9(1013)]);
  W[b9(42)] = function (B, b, w, L, j, A) {
    var bH = b9, T, N;
    this[bH(1438)] = b, this[bH(1439)] = {}, this[bH(1440)] = [];
    var Q = L[bH(399)] / L[bH(290)];
    this[bH(1441)] = function (F) {
      var bh = bH;
      for (var V = Math[bh(170)](L[bh(399)], Math[bh(268)](0, F.x)), k = Math[bh(170)](L[bh(399)], Math[bh(268)](0, F.y)), I = 0; I < L[bh(290)]; ++I) {
        T = I * Q;
        for (var Z = 0; Z < L[bh(290)]; ++Z) N = Z * Q, V + F[bh(675)] >= T && V - F[bh(675)] <= T + Q && k + F[bh(675)] >= N && k - F[bh(675)] <= N + Q && (this[bh(1439)][I + "_" + Z] || (this[bh(1439)][I + "_" + Z] = []), this[bh(1439)][I + "_" + Z][bh(167)](F), F[bh(1339)][bh(167)](I + "_" + Z));
      }
    }, this[bH(1442)] = function (F) {
      var ba = bH;
      for (var V, k = 0; k < F[ba(1339)][ba(68)]; ++k) (V = this[ba(1439)][F[ba(1339)][k]][ba(161)](F)) >= 0 && this[ba(1439)][F[ba(1339)][k]][ba(655)](V, 1);
    }, this[bH(1443)] = function (F) {
      var bW = bH;
      if (F[bW(674)] = false, A) {
        F[bW(736)] && F[bW(1346)] && (F[bW(736)][bW(1346)] -= F[bW(1346)]), this[bW(1442)](F);
        var V = this[bW(1440)][bW(161)](F);
        V >= 0 && this[bW(1440)][bW(655)](V, 1);
      }
    }, this[bH(1444)] = function (F, V) {
      var bM = bH;
      for (var k = 0; k < j[bM(68)]; ++k) j[k][bM(674)] && (F[bM(1338)][j[k].id] && (F[bM(674)] ? j[k][bM(1445)](F) && A[bM(612)](j[k].id, "8", w[bM(797)](V, 1), F[bM(654)]) : A[bM(612)](j[k].id, "12", F[bM(654)])), F[bM(674)] || F[bM(736)] != j[k] || j[k][bM(1446)](F[bM(643)].id, -1));
    };
    var D, J, K = [];
    this[bH(1447)] = function (F, V, k) {
      var bC = bH;
      T = C(F / Q), N = C(V / Q), K[bC(68)] = 0;
      try {
        this[bC(1439)][T + "_" + N] && K[bC(167)](this[bC(1439)][T + "_" + N]), F + k >= (T + 1) * Q && ((D = this[bC(1439)][T + 1 + "_" + N]) && K[bC(167)](D), N && V - k <= N * Q ? (D = this[bC(1439)][T + 1 + "_" + (N - 1)]) && K[bC(167)](D) : V + k >= (N + 1) * Q && (D = this[bC(1439)][T + 1 + "_" + (N + 1)]) && K[bC(167)](D)), T && F - k <= T * Q && ((D = this[bC(1439)][T - 1 + "_" + N]) && K[bC(167)](D), N && V - k <= N * Q ? (D = this[bC(1439)][T - 1 + "_" + (N - 1)]) && K[bC(167)](D) : V + k >= (N + 1) * Q && (D = this[bC(1439)][T - 1 + "_" + (N + 1)]) && K[bC(167)](D)), V + k >= (N + 1) * Q && (D = this[bC(1439)][T + "_" + (N + 1)]) && K[bC(167)](D), N && V - k <= N * Q && (D = this[bC(1439)][T + "_" + (N - 1)]) && K[bC(167)](D);
      } catch (I) {}
      return K;
    }, this[bH(440)] = function (F, V, k, I, Z, X, G, q, E) {
      var bg = bH;
      J = null;
      for (var R = 0; R < b[bg(68)]; ++R) if (b[R][bg(654)] == F) {
        J = b[R];
        break;
      }
      if (!J) {
        for (R = 0; R < b[bg(68)]; ++R) if (!b[R][bg(674)]) {
          J = b[R];
          break;
        }
      }
      J || (J = new B(F), b[bg(167)](J)), q && (J[bg(654)] = F), J[bg(83)](V, k, I, Z, X, G, E), A && (this[bg(1441)](J), J[bg(1340)] && this[bg(1440)][bg(167)](J));
    }, this[bH(994)] = function (F) {
      var br = bH;
      for (var V = 0; V < b[br(68)]; ++V) if (b[V][br(654)] == F) {
        this[br(1443)](b[V]);
        break;
      }
    }, this[bH(992)] = function (F, V) {
      var bU = bH;
      for (var k = 0; k < b[bU(68)]; ++k) b[k][bU(674)] && b[k][bU(736)] && b[k][bU(736)][bU(654)] == F && this[bU(1443)](b[k]);
      V && V[bU(1448)]("13", F);
    }, this[bH(1449)] = function (F) {
      var bn = bH;
      for (var V = null, k = 0; k < b[bn(68)]; ++k) if ((J = b[k])[bn(674)] && J[bn(736)] && J[bn(736)][bn(654)] == F && J[bn(1354)]) {
        V = [J.x, J.y], this[bn(1443)](J), A[bn(1448)]("12", J[bn(654)]), J[bn(736)] && J[bn(736)][bn(1446)](J[bn(643)].id, -1);
        break;
      }
      return V;
    }, this[bH(1132)] = function (F, V, k, I, Z, X, G) {
      var bp = bH;
      for (var q = 0; q < b[bp(68)]; ++q) {
        var E = b[q][bp(1022)] ? b[q][bp(1022)] : b[q][bp(1356)](I, b[q][bp(1024)]);
        if (b[q][bp(674)] && w[bp(1161)](F, V, b[q].x, b[q].y) < k + E) return false;
      }
      return !(!X && 18 != Z && V >= L[bp(399)] / 2 - L[bp(388)] / 2 && V <= L[bp(399)] / 2 + L[bp(388)] / 2);
    }, this[bH(1111)] = function (F, V, k, I, Z) {
      var bx = bH;
      for (var X, G = items[bx(1017)][Z], q = 0; q < projectiles[bx(68)]; ++q) if (!projectiles[q][bx(674)]) {
        X = projectiles[q];
        break;
      }
      X || (X = new Projectile(j, w), projectiles[bx(167)](X)), X[bx(83)](Z, F, V, k, G[bx(1112)], I, G[bx(675)]);
    }, this[bH(1450)] = function (F, V, k) {
      var bu = bH;
      k = k || 1;
      var I = F.x - V.x, Z = F.y - V.y, X = F[bu(675)] + V[bu(675)];
      if (g(I) <= X || g(Z) <= X) {
        X = F[bu(675)] + (V[bu(1356)] ? V[bu(1356)]() : V[bu(675)]);
        var G = x(I * I + Z * Z) - X;
        if (G <= 0) {
          if (V[bu(1143)]) !V[bu(1134)] || F[bu(1451)] || V[bu(736)] == F || V[bu(736)] && V[bu(736)][bu(652)] && V[bu(736)][bu(652)] == F[bu(652)] ? V[bu(1350)] ? (F[bu(1452)] += k * V[bu(1350)] * (V[bu(1453)] || 1) * U(V[bu(1016)]), F[bu(1454)] += k * V[bu(1350)] * (V[bu(1453)] || 1) * p(V[bu(1016)])) : V[bu(1348)] ? F[bu(1348)] = V[bu(1348)] : V[bu(1349)] && (F.x = w[bu(1060)](0, L[bu(399)]), F.y = w[bu(1060)](0, L[bu(399)])) : (F[bu(1455)] = true, V[bu(1023)] = false); else {
            var q = w[bu(1162)](F.x, F.y, V.x, V.y);
            if (w[bu(1161)](F.x, F.y, V.x, V.y), V[bu(1168)] ? (G = -1 * G / 2, F.x += G * U(q), F.y += G * p(q), V.x -= G * U(q), V.y -= G * p(q)) : (F.x = V.x + X * U(q), F.y = V.y + X * p(q), F[bu(1452)] *= 0.75, F[bu(1454)] *= 0.75), V[bu(1122)] && V[bu(736)] != F && (!V[bu(736)] || !V[bu(736)][bu(652)] || V[bu(736)][bu(652)] != F[bu(652)])) {
              F[bu(1355)](-V[bu(1122)], V[bu(736)], V);
              var E = 1.5 * (V[bu(1453)] || 1);
              F[bu(1452)] += E * U(q), F[bu(1454)] += E * p(q), !V[bu(1345)] || F[bu(1456)] && F[bu(1456)][bu(1457)] || (F[bu(1417)][bu(1122)] = V[bu(1345)], F[bu(1417)][bu(1419)] = 5, F[bu(1417)][bu(1418)] = V[bu(736)]), F[bu(1458)] && V[bu(983)] && (V[bu(1355)](-F[bu(1458)]) && this[bu(1443)](V), this[bu(1444)](V, w[bu(1162)](F.x, F.y, V.x, V.y)));
            }
          }
          return V[bu(1031)] > F[bu(1031)] && (F[bu(1031)] = V[bu(1031)]), true;
        }
      }
      return false;
    };
  };
}, function (W, M, C) {
  var bB = Cv, g = new (C(49));
  g[bB(1459)](bB(1460), bB(1461), bB(1462), bB(1463), bB(28), bB(1464), bB(1465), bB(1466), bB(1467), bB(1468), bB(1469), bB(1470), bB(1471), bB(764), bB(1472), bB(782), bB(1473), bB(1474), bB(762), bB(1475), bB(757), bB(1476), bB(1477), bB(1478), bB(1479), bB(756), bB(1480), bB(1481), bB(1482), bB(1483), bB(1484), bB(776), bB(1485), bB(1486), bB(1487), bB(766), bB(759), bB(768), bB(1469), bB(1468), bB(1488), bB(1489), bB(1490), bB(761), bB(1491), bB(758), bB(1492), bB(1493), bB(1494), bB(1495), bB(1496), bB(1497), bB(751), bB(1498), bB(776), bB(1499), bB(1500), bB(1501), bB(754), bB(1502), bB(1503), bB(1474), bB(1504), bB(1505), bB(1506), bB(1507), bB(1508), bB(1509), bB(1510), bB(1511), bB(1512), bB(1513), bB(752), bB(755), bB(1514), bB(1515), bB(1516), bB(1495), bB(1517), bB(1518), bB(1519), bB(1520), bB(1509), bB(1521), bB(1506), bB(654), bB(1522), bB(1523), bB(1524));
  var U = Math[bB(103)], p = Math[bB(1026)], x = Math[bB(1025)], u = Math[bB(102)], B = Math[bB(1013)];
  W[bB(42)] = function (L, j, A, T, N, Q, D, J, K, F, V, I, Z, X) {
    var bo = bB;
    this.id = L, this[bo(654)] = j, this[bo(1525)] = 0, this[bo(652)] = null, this[bo(681)] = 0, this[bo(679)] = 0, this[bo(1125)] = 0, this[bo(680)] = {};
    for (var G = 0; G < V[bo(68)]; ++G) V[G][bo(697)] <= 0 && (this[bo(680)][V[G].id] = 1);
    for (this[bo(682)] = {}, G = 0; G < F[bo(68)]; ++G) F[G][bo(697)] <= 0 && (this[bo(682)][F[G].id] = 1);
    this[bo(382)] = 0, this.dt = 0, this[bo(453)] = false, this[bo(646)] = {}, this[bo(1168)] = true, this[bo(1346)] = 0, this[bo(1526)] = void 0, this[bo(1033)] = 0, this[bo(1527)] = 0, this[bo(1137)] = 0, this[bo(1048)] = 0, this[bo(1115)] = function (P) {
      var bb = bo;
      this[bb(674)] = true, this[bb(571)] = true, this[bb(1455)] = false, this[bb(796)] = false, this[bb(1528)] = 0, this[bb(300)] = 0, this[bb(1151)] = 0, this[bb(1529)] = 0, this[bb(1338)] = {}, this[bb(1530)] = 0, this[bb(1531)] = 0, this[bb(1532)] = 0, this[bb(1533)] = 0, this[bb(1534)] = 0, this[bb(786)] = -1, this[bb(377)] = 0, this[bb(1417)] = {}, this[bb(1535)] = 0, this[bb(1003)] = 300, this.XP = 0, this[bb(1e3)] = 1, this[bb(995)] = 0, this[bb(999)] = 2, this[bb(998)] = 0, this.x = 0, this.y = 0, this[bb(1031)] = 0, this[bb(1452)] = 0, this[bb(1454)] = 0, this[bb(1536)] = 1, this[bb(1016)] = 0, this[bb(1035)] = 0, this[bb(1537)] = 0, this[bb(1538)] = 0, this[bb(1182)] = 100, this[bb(983)] = this[bb(1182)], this[bb(675)] = A[bb(311)], this[bb(1112)] = A[bb(312)], this[bb(1539)](), this[bb(1540)](P), this[bb(740)] = [0, 3, 6, 10], this[bb(459)] = [0], this[bb(1353)] = 0, this[bb(376)] = [], this[bb(1541)] = {}, this[bb(639)] = {reload: 1, id: 0, variant: 0, reloadid: 0, dmg: 25}, this[bb(638)] = {reload: 1, id: undefined, variant: undefined, reloadid: undefined, dmg: 0}, this[bb(1099)] = 1;
    }, this[bo(1539)] = function () {
      var bw = bo;
      this[bw(1526)] = void 0;
    }, this[bo(1540)] = function (P) {
      var bL = bo;
      for (var z = 0; z < A[bL(378)][bL(68)]; ++z) this[A[bL(378)][z]] = P ? 100 : 0;
    }, this[bo(1542)] = function (P) {
      var bj = bo, z = K[bj(460)][P];
      if (z) {
        for (var Y = 0; Y < this[bj(740)][bj(68)]; ++Y) if (K[bj(460)][this[bj(740)][Y]][bj(643)] == z[bj(643)]) return this[bj(786)] == this[bj(740)][Y] && (this[bj(786)] = P), this[bj(740)][Y] = P, true;
        return this[bj(740)][bj(167)](P), true;
      }
      return false;
    }, this[bo(1543)] = function (P) {
      var bs = bo;
      if (P) {
        this[bs(94)] = bs(944);
        var z = P[bs(94)] + "", Y = false, O = (z = (z = (z = (z = z[bs(72)](0, A[bs(398)]))[bs(253)](/[^\w:\(\)\/? -]+/gim, " "))[bs(253)](/[^\x00-\x7F]/g, " "))[bs(252)]())[bs(160)]()[bs(253)](/\s/g, "")[bs(253)](/1/g, "i")[bs(253)](/0/g, "o")[bs(253)](/5/g, "s");
        for (var H0 of g[bs(460)]) if (-1 != O[bs(161)](H0)) {
          Y = true;
          break;
        }
        z[bs(68)] > 0 && !Y && (this[bs(94)] = z), this[bs(1048)] = 0, A[bs(315)][P[bs(1456)]] && (this[bs(1048)] = P[bs(1456)]);
      }
    }, this[bo(1544)] = function () {
      var bA = bo;
      return [this.id, this[bA(654)], this[bA(94)], T[bA(797)](this.x, 2), T[bA(797)](this.y, 2), T[bA(797)](this[bA(1016)], 3), this[bA(983)], this[bA(1182)], this[bA(675)], this[bA(1048)]];
    }, this[bo(1119)] = function (P) {
      var bT = bo;
      this.id = P[0], this[bT(654)] = P[1], this[bT(94)] = P[2], this.x = P[3], this.y = P[4], this[bT(1016)] = P[5], this[bT(983)] = P[6], this[bT(1182)] = P[7], this[bT(675)] = P[8], this[bT(1048)] = P[9];
    };
    var q = 0;
    this[bo(676)] = function (P) {
      var bi = bo;
      this[bi(571)] && (this[bi(377)] < 9 ? this[bi(639)].id != this[bi(377)] && (this[bi(639)].id = this[bi(377)], this[bi(639)][bi(1123)] = this[bi(1045)], this[bi(639)][bi(1122)] = window[bi(459)][this[bi(377)]][bi(1122)], !this[bi(638)].id && (this[bi(638)].id = 15, this[bi(638)][bi(1123)] = 0, this[bi(638)][bi(1122)] = 50)) : this[bi(638)].id != this[bi(377)] && (this[bi(638)].id = this[bi(377)], this[bi(638)][bi(1123)] = this[bi(1045)], this[bi(638)][bi(1122)] = window[bi(459)][this[bi(377)]][bi(1122)] || secondaryDmg(this[bi(377)]), !this[bi(639)].id && (this[bi(639)].id = 5, this[bi(639)][bi(1123)] = 3, this[bi(639)][bi(1122)] = 45)), this[bi(786)] == -1 && (this[bi(377)] < 9 ? this[bi(639)][bi(1138)] == this[bi(377)] ? this[bi(639)][bi(573)] = Math[bi(170)](this[bi(639)][bi(573)] + 111 / window[bi(459)][this[bi(377)]][bi(1112)], 1) : (this[bi(639)][bi(1138)] = this[bi(377)], this[bi(638)].id = 15, this[bi(638)][bi(1122)] = 50, this[bi(638)][bi(1123)] = 0) : this[bi(638)][bi(1138)] == this[bi(377)] ? (this[bi(638)][bi(1123)] = this[bi(1045)], this[bi(638)][bi(573)] = Math[bi(170)](this[bi(638)][bi(573)] + 111 / window[bi(459)][this[bi(377)]][bi(1112)], 1)) : this[bi(638)][bi(1138)] = this[bi(377)]), this[bi(1099)] = Math[bi(170)](this[bi(1099)] + 0.0444444444, 1));
    }, this[bo(1545)] = function (P) {
      var bN = bo;
      this[bN(376)][this[bN(377)]] || (this[bN(376)][this[bN(377)]] = 0), this[bN(376)][this[bN(377)]] += P;
    }, this[bo(1546)] = function (P) {
      var bt = bo;
      this[bt(1e3)] < A[bt(306)] && (this.XP += P, this.XP >= this[bt(1003)] ? (this[bt(1e3)] < A[bt(306)] ? (this[bt(1e3)]++, this.XP = 0, this[bt(1003)] *= 1.2) : this.XP = this[bt(1003)], this[bt(998)]++, I[bt(612)](this.id, "16", this[bt(998)], this[bt(999)]), I[bt(612)](this.id, "15", this.XP, T[bt(797)](this[bt(1003)], 1), this[bt(1e3)])) : I[bt(612)](this.id, "15", this.XP));
    }, this[bo(1355)] = function (P, z) {
      var bl = bo;
      if (P > 0 && this[bl(983)] >= this[bl(1182)]) return false;
      P < 0 && this[bl(1456)] && (P *= this[bl(1456)][bl(1547)] || 1), P < 0 && this[bl(1548)] && (P *= this[bl(1548)][bl(1547)] || 1), P < 0 && (this[bl(1125)] = Date[bl(426)]()), this[bl(983)] += P, this[bl(983)] > this[bl(1182)] && (P -= this[bl(983)] - this[bl(1182)], this[bl(983)] = this[bl(1182)]), this[bl(983)] <= 0 && this[bl(1508)](z);
      for (var Y = 0; Y < D[bl(68)]; ++Y) this[bl(1338)][D[Y].id] && I[bl(612)](D[Y].id, "h", this[bl(654)], Math[bl(1121)](this[bl(983)]));
      return !z || !z[bl(1445)](this) || z == this && P < 0 || I[bl(612)](z.id, "t", Math[bl(1121)](this.x), Math[bl(1121)](this.y), Math[bl(1121)](-P), 1), true;
    }, this[bo(1508)] = function (P) {
      var bQ = bo;
      P && P[bQ(571)] && (P[bQ(995)]++, P[bQ(1456)] && P[bQ(1456)][bQ(1549)] ? Z(P, Math[bQ(1121)](this[bQ(382)] / 2)) : Z(P, Math[bQ(1121)](100 * this[bQ(1e3)] * (P[bQ(1456)] && P[bQ(1456)][bQ(1550)] ? P[bQ(1456)][bQ(1550)] : 1))), I[bQ(612)](P.id, "9", bQ(995), P[bQ(995)], 1)), this[bQ(571)] = false, I[bQ(612)](this.id, "11"), X();
    }, this[bo(1551)] = function (P, z, Y) {
      var bD = bo;
      !Y && z > 0 && this[bD(1545)](z), 3 == P ? Z(this, z, true) : (this[A[bD(378)][P]] += z, I[bD(612)](this.id, "9", A[bD(378)][P], this[A[bD(378)][P]], 1));
    }, this[bo(1446)] = function (P, z) {
      var bJ = bo;
      this[bJ(646)][P] = this[bJ(646)][P] || 0, this[bJ(646)][P] += z, I[bJ(612)](this.id, "14", P, this[bJ(646)][P]);
    }, this[bo(1124)] = function (P) {
      var bf = bo;
      if (this[bf(1125)]) {
        let z = tick - this[bf(1125)];
        this[bf(1125)] = 0, z < 2 ? (this[bf(1151)]++, this[bf(1151)] >= 8 && (this[bf(1151)] = 0)) : this[bf(1151)] = Math[bf(268)](0, this[bf(1151)] - 2);
      }
    }, this[bo(1552)] = function (P, z) {
      var bK = bo;
      for (var Y = 0; Y < P[bK(640)][bK(68)];) {
        if (this[P[bK(640)][Y]] < Math[bK(1121)](P[bK(640)][Y + 1] * (z || 1))) return false;
        Y += 2;
      }
      return true;
    }, this[bo(1553)] = function (P, z) {
      var bd = bo;
      if (!A[bd(302)]) {
        for (var Y = 0; Y < P[bd(640)][bd(68)];) this[bd(1551)](A[bd(378)][bd(161)](P[bd(640)][Y]), -Math[bd(1121)](P[bd(640)][Y + 1] * (z || 1))), Y += 2;
      }
    }, this[bo(1554)] = function (P) {
      var bF = bo;
      return !!A[bF(302)] || !(P[bF(643)][bF(644)] && this[bF(646)][P[bF(643)].id] >= P[bF(643)][bF(644)]) && this[bF(1552)](P);
    }, this[bo(1555)] = function () {
      var bV = bo;
      this[bV(1535)] = 0, this[bV(1536)] -= K[bV(459)][this[bV(377)]][bV(1556)] || 0.3, this[bV(1536)] < 0 && (this[bV(1536)] = 0);
      for (var P, z, Y, O = A[bV(375)](this), H0 = O[bV(1557)], H1 = O[bV(1558)], H2 = {}, H3 = Q[bV(1447)](this.x, this.y, K[bV(459)][this[bV(377)]][bV(1113)]), H4 = 0; H4 < H3[bV(68)]; ++H4) for (var H5 = 0; H5 < H3[H4][bV(68)]; ++H5) if ((z = H3[H4][H5])[bV(674)] && !z[bV(1342)] && !H2[z[bV(654)]] && z[bV(1357)](this) && T[bV(1161)](this.x, this.y, z.x, z.y) - z[bV(675)] <= K[bV(459)][this[bV(377)]][bV(1113)] && (P = T[bV(1162)](z.x, z.y, this.x, this.y), T[bV(1297)](P, this[bV(1016)]) <= A[bV(307)])) {
        if (H2[z[bV(654)]] = 1, z[bV(983)]) {
          if (z[bV(1355)](-K[bV(459)][this[bV(377)]][bV(1122)] * H1 * (K[bV(459)][this[bV(377)]][bV(1559)] || 1) * (this[bV(1456)] && this[bV(1456)][bV(1560)] ? this[bV(1456)][bV(1560)] : 1), this)) {
            for (var H6 = 0; H6 < z[bV(640)][bV(68)];) this[bV(1551)](A[bV(378)][bV(161)](z[bV(640)][H6]), z[bV(640)][H6 + 1]), H6 += 2;
            Q[bV(1443)](z);
          }
        } else {
          this[bV(1546)](4 * K[bV(459)][this[bV(377)]][bV(1555)]);
          var H7 = K[bV(459)][this[bV(377)]][bV(1555)] + (3 == z[bV(100)] ? 4 : 0);
          this[bV(1456)] && this[bV(1456)][bV(1561)] && this[bV(1551)](3, 1), this[bV(1551)](z[bV(100)], H7);
        }
        Y = true, Q[bV(1444)](z, P);
      }
      for (H5 = 0; H5 < D[bV(68)] + J[bV(68)]; ++H5) if ((z = D[H5] || J[H5 - D[bV(68)]]) != this && z[bV(571)] && (!z[bV(652)] || z[bV(652)] != this[bV(652)]) && T[bV(1161)](this.x, this.y, z.x, z.y) - 1.8 * z[bV(675)] <= K[bV(459)][this[bV(377)]][bV(1113)] && (P = T[bV(1162)](z.x, z.y, this.x, this.y), T[bV(1297)](P, this[bV(1016)]) <= A[bV(307)])) {
        var H8 = K[bV(459)][this[bV(377)]][bV(1562)];
        H8 && z[bV(1551)] && (H8 = Math[bV(170)](z[bV(382)] || 0, H8), this[bV(1551)](3, H8), z[bV(1551)](3, -H8));
        var H9 = H1;
        null != z[bV(377)] && K[bV(459)][z[bV(377)]][bV(1563)] && T[bV(1297)](P + Math.PI, z[bV(1016)]) <= A[bV(373)] && (H9 = K[bV(459)][z[bV(377)]][bV(1563)]);
        var HH = K[bV(459)][this[bV(377)]][bV(1122)] * (this[bV(1456)] && this[bV(1456)][bV(1564)] ? this[bV(1456)][bV(1564)] : 1) * (this[bV(1548)] && this[bV(1548)][bV(1564)] ? this[bV(1548)][bV(1564)] : 1), Hh = 0.3 * (z[bV(1453)] || 1) + (K[bV(459)][this[bV(377)]][bV(1565)] || 0);
        z[bV(1452)] += Hh * p(P), z[bV(1454)] += Hh * x(P), this[bV(1456)] && this[bV(1456)][bV(1566)] && this[bV(1355)](HH * H9 * this[bV(1456)][bV(1566)], this), this[bV(1548)] && this[bV(1548)][bV(1566)] && this[bV(1355)](HH * H9 * this[bV(1548)][bV(1566)], this), z[bV(1456)] && z[bV(1456)][bV(1122)] && 1 == H9 && this[bV(1355)](-HH * z[bV(1456)][bV(1122)], z), z[bV(1548)] && z[bV(1548)][bV(1122)] && 1 == H9 && this[bV(1355)](-HH * z[bV(1548)][bV(1122)], z), !(z[bV(1417)] && this[bV(1456)] && this[bV(1456)][bV(1567)]) || z[bV(1456)] && z[bV(1456)][bV(1457)] || (z[bV(1417)][bV(1122)] = this[bV(1456)][bV(1567)], z[bV(1417)][bV(1419)] = this[bV(1456)][bV(1568)] || 1, z[bV(1417)][bV(1418)] = this), !z[bV(1417)] || !H0 || z[bV(1456)] && z[bV(1456)][bV(1457)] || (z[bV(1417)][bV(1122)] = 5, z[bV(1417)][bV(1419)] = 5, z[bV(1417)][bV(1418)] = this), z[bV(1456)] && z[bV(1456)][bV(1569)] && (this[bV(1452)] -= z[bV(1456)][bV(1569)] * p(P), this[bV(1454)] -= z[bV(1456)][bV(1569)] * x(P)), z[bV(1355)](-HH * H9, this, this);
      }
      this[bV(1570)](Y ? 1 : 0);
    }, this[bo(1570)] = function (P) {
      var bm = bo;
      for (var z = 0; z < D[bm(68)]; ++z) this[bm(1338)][D[z].id] && this[bm(1445)](D[z]) && I[bm(612)](D[z].id, "7", this[bm(654)], P ? 1 : 0, this[bm(377)]);
    };
    var E = 0, R = 0;
    this[bo(1032)] = function (P) {
      var bk = bo;
      this[bk(1532)] > 0 && (this[bk(1532)] -= P, this[bk(1532)] <= 0 ? (this[bk(1532)] = 0, this[bk(1035)] = 0, E = 0, R = 0) : 0 == R ? (E += P / (this[bk(1533)] * A[bk(309)]), this[bk(1035)] = T[bk(1295)](0, this[bk(1538)], Math[bk(170)](1, E)), E >= 1 && (E = 1, R = 1)) : (E -= P / (this[bk(1533)] * (1 - A[bk(309)])), this[bk(1035)] = T[bk(1295)](0, this[bk(1538)], Math[bk(268)](0, E))));
    }, this[bo(1030)] = function (P, z) {
      var bI = bo;
      this[bI(1532)] = this[bI(1533)] = K[bI(459)][z][bI(1112)], this[bI(1538)] = P ? -A[bI(310)] : -Math.PI, E = 0, R = 0, setTimeout(() => {
        var bZ = bI;
        z > 9 ? this[bZ(638)][bZ(573)] = 0 : this[bZ(639)][bZ(573)] = 0;
      });
    }, this[bo(1445)] = function (P) {
      var bX = bo;
      if (!P) return false;
      if (P[bX(1456)] && P[bX(1456)][bX(1571)] && P[bX(1535)] >= P[bX(1456)][bX(1571)]) return false;
      var z = U(P.x - this.x) - P[bX(675)], Y = U(P.y - this.y) - P[bX(675)];
      return z <= A[bX(281)] / 2 * 1.3 && Y <= A[bX(282)] / 2 * 1.3;
    };
  };
}, function (a, W, M) {
  var bG = Cv;
  const C = M(50)[bG(1572)], g = M(51)[bG(1259)];
  a[bG(42)] = class {
    constructor(U = {}) {
      var bq = bG;
      Object[bq(1573)](this, {list: U[bq(1574)] && [] || Array[bq(54)][bq(66)][bq(84)](C, [g, U[bq(460)] || []]), exclude: U[bq(1575)] || [], placeHolder: U[bq(1576)] || "*", regex: U[bq(1577)] || /[^a-zA-Z0-9|\$|\@]|\^/g, replaceRegex: U[bq(1578)] || /\w/g});
    }
    [bG(1579)](U) {
      var bE = bG;
      return this[bE(460)][bE(80)](p => {
        var bR = bE;
        const x = new RegExp("\\b" + p[bR(253)](/(\W)/g, bR(1580)) + "\\b", "gi");
        return !this[bR(1575)][bR(201)](p[bR(160)]()) && x[bR(1214)](U);
      })[bE(68)] > 0 || false;
    }
    [bG(1581)](U) {
      var bv = bG;
      return U[bv(253)](this[bv(1577)], "")[bv(253)](this[bv(1578)], this[bv(1576)]);
    }
    [bG(1582)](U) {
      var bP = bG;
      return U[bP(615)](/\b/)[bP(1258)](p => this[bP(1579)](p) ? this[bP(1581)](p) : p)[bP(197)]("");
    }
    [bG(1459)]() {
      var be = bG;
      let U = Array[be(70)](arguments);
      this[be(460)][be(167)](...U), U[be(1258)](p => p[be(160)]())[be(67)](p => {
        var bz = be;
        this[bz(1575)][bz(201)](p) && this[bz(1575)][bz(655)](this[bz(1575)][bz(161)](p), 1);
      });
    }
    [bG(1583)]() {
      var bY = bG;
      this[bY(1575)][bY(167)](...Array[bY(70)](arguments)[bY(1258)](U => U[bY(160)]()));
    }
  };
}, function (a) {
  var bc = Cv;
  a[bc(42)] = {words: [bc(1584), bc(1585), bc(1586), bc(1587), bc(1588), bc(1507), bc(1589), bc(1590), bc(1591), bc(1592), bc(1593), bc(1594), bc(1595), bc(1596), bc(1597), bc(1598), bc(777), bc(1599), bc(1600), bc(1601), bc(1602), bc(1603), bc(775), bc(1604), bc(1605), bc(1606), bc(1607), bc(1608), bc(1498), bc(1609), bc(1610), bc(1611), bc(1612), bc(1613), bc(1614), bc(1615), bc(1616), bc(761), bc(1617), bc(1618), bc(1619), bc(1620), bc(1621), bc(1622), bc(763), bc(751), bc(1623), bc(1624), bc(758), bc(1625), bc(1626), bc(1627), bc(1628), bc(1629), bc(1630), bc(1631), bc(1632), bc(1633), bc(1634), bc(1635), bc(1636), bc(1637), bc(776), bc(1638), bc(1639), bc(1640), bc(1641), bc(755), bc(1642), bc(1643), bc(1644), bc(1645), bc(1646), bc(1647), bc(1648), bc(1649), bc(753), bc(1650), bc(1651), bc(1652), bc(1653), bc(1654), bc(1655), bc(1656), bc(1657), bc(1658), bc(1659), bc(1660), bc(1661), bc(1662), bc(1663), bc(1664), bc(1665), bc(1666), bc(1667), bc(1668), bc(1669), bc(1670), bc(1671), bc(1672), bc(1673), bc(1674), bc(1675), bc(1676), bc(1677), bc(1678), bc(1679), bc(1680), bc(770), bc(1681), bc(1682), bc(1683), bc(1684), bc(1685), bc(1686), bc(1687), bc(1688), bc(1689), bc(1690), bc(1691), bc(1692), bc(1693), bc(1694), bc(1695), bc(1696), bc(1697), bc(1698), bc(1699), bc(1700), bc(1701), bc(1702), bc(1703), bc(1704), bc(1705), bc(1706), bc(1707), bc(1708), bc(1709), bc(1710), bc(1711), bc(1712), bc(1713), bc(1714), bc(1715), bc(1716), bc(1717), bc(1718), bc(1719), bc(1720), bc(1721), bc(1722), bc(1723), bc(1724), bc(1725), bc(1726), bc(1727), bc(1728), bc(1729), bc(1730), bc(1731), bc(1732), bc(1733), bc(1734), bc(1735), bc(1736), bc(1737), bc(1738), bc(766), bc(1739), bc(1740), bc(1741), bc(1742), bc(1743), bc(1744), bc(1745), bc(1746), bc(1747), bc(1748), bc(1749), bc(1750), bc(1751), bc(1752), bc(1753), bc(1754), bc(1755), bc(768), bc(1756), bc(1757), bc(1758), bc(1759), bc(1760), bc(1761), bc(1762), bc(1763), bc(1764), bc(1765), bc(1766), bc(1767), bc(1768), bc(1769), bc(1770), bc(1771), bc(764), bc(1772), bc(1773), bc(1774), bc(1775), bc(1776), bc(1777), bc(1778), bc(754), bc(1779), bc(1780), bc(1781), bc(1782), bc(1783), bc(1784), bc(1785), bc(1786), bc(1787), bc(1788), bc(1789), bc(1790), bc(1791), bc(1792), bc(1793), bc(1794), bc(1795), bc(1796), bc(1797), bc(1798), bc(1799), bc(1800), bc(1801), bc(1802), bc(1803), bc(1804), bc(759), bc(1805), bc(1806), bc(1807), bc(1808), bc(1809), bc(1810), bc(1811), bc(752), bc(1812), bc(1813), bc(1814), bc(775), bc(1815), bc(767), bc(1816), bc(753), bc(754), bc(1507), bc(1593), bc(1817), bc(1818), bc(1819), bc(777), bc(1820), bc(1821), bc(1822), bc(1498), bc(1612), bc(1823), bc(1824), bc(1825), bc(761), bc(763), bc(751), bc(1627), bc(1826), bc(1827), bc(1828), bc(1829), bc(1655), bc(1830), bc(1831), bc(1832), bc(1833), bc(1834), bc(1835), bc(1836), bc(1837), bc(1838), bc(1839), bc(1840), bc(1841), bc(1842), bc(1843), bc(1469), bc(757), bc(756), bc(1844), bc(1845), bc(1846), bc(1754), bc(768), bc(1847), bc(1848), bc(1849), bc(1850), bc(1851), bc(1795), bc(1852), bc(1853), bc(765), bc(1854), bc(1855), bc(1856), bc(1857), bc(1858), bc(1859), bc(1860), bc(1674), bc(1861), bc(1862), bc(752), bc(1863), bc(1864), bc(1865), bc(1866), bc(1867), bc(1868), bc(1869), bc(1870), bc(1871), bc(1872), bc(1873), bc(1874), bc(1875), bc(1876), bc(1877), bc(1878), bc(1879), bc(1880), bc(1881), bc(1882), bc(1883), bc(1884), bc(1885), bc(1886), bc(1887), bc(1888), bc(1889), bc(1890), bc(1891), bc(1892), bc(1893), bc(1894), bc(1895), bc(1896), bc(1897), bc(1898), bc(1899), bc(1900), bc(1901), bc(1902), bc(1903), bc(1904), bc(1905), bc(1906), bc(1907), bc(1908), bc(1909), bc(1910), bc(1911), bc(1912), bc(1913), bc(1914), bc(1915), bc(1916), bc(1917), bc(1918), bc(1919), bc(1920), bc(770), bc(1921), bc(1922), bc(1923), bc(1924), bc(1925), bc(1926), bc(1927), bc(1928), bc(1929), bc(1930), bc(1931), bc(1932), bc(1933), bc(1934), bc(1935), bc(1936), bc(1937), bc(1938), bc(1939), bc(1940), bc(1941), bc(1942), bc(1943), bc(1944), bc(1945), bc(1946), bc(1947), bc(1948), bc(1949), bc(1950), bc(1951), bc(1952), bc(1953), bc(1954), bc(1955), bc(1464), bc(1956), bc(1957), bc(1958), bc(1959), bc(1960), bc(1961), bc(1962), bc(1963), bc(1964), bc(1965), bc(1966), bc(1967), bc(1968), bc(1969), bc(1970), bc(1971), bc(1972), bc(1973), bc(1974), bc(1975), bc(1976), bc(1977), bc(1978), bc(1979), bc(1980), bc(1981), bc(1982), bc(1983), bc(1984), bc(1985), bc(1986), bc(1987), bc(1988), bc(1989), bc(1990), bc(1991), bc(1992), bc(1993)]};
}, function (a, W, M) {
  var by = Cv;
  a[by(42)] = {object: M(52), array: M(53), regex: M(54)};
}, function (a, W) {
  var bS = Cv;
  a[bS(42)] = {"4r5e": 1, "5h1t": 1, "5hit": 1, a55: 1, anal: 1, anus: 1, ar5e: 1, arrse: 1, arse: 1, ass: 1, "ass-fucker": 1, asses: 1, assfucker: 1, assfukka: 1, asshole: 1, assholes: 1, asswhole: 1, a_s_s: 1, "b!tch": 1, b00bs: 1, b17ch: 1, b1tch: 1, ballbag: 1, balls: 1, ballsack: 1, bastard: 1, beastial: 1, beastiality: 1, bellend: 1, bestial: 1, bestiality: 1, "bi+ch": 1, biatch: 1, bitch: 1, bitcher: 1, bitchers: 1, bitches: 1, bitchin: 1, bitching: 1, bloody: 1, "blow job": 1, blowjob: 1, blowjobs: 1, boiolas: 1, bollock: 1, bollok: 1, boner: 1, boob: 1, boobs: 1, booobs: 1, boooobs: 1, booooobs: 1, booooooobs: 1, breasts: 1, buceta: 1, bugger: 1, bum: 1, "bunny fucker": 1, butt: 1, butthole: 1, buttmuch: 1, buttplug: 1, c0ck: 1, c0cksucker: 1, "carpet muncher": 1, cawk: 1, chink: 1, cipa: 1, cl1t: 1, clit: 1, clitoris: 1, clits: 1, cnut: 1, cock: 1, "cock-sucker": 1, cockface: 1, cockhead: 1, cockmunch: 1, cockmuncher: 1, cocks: 1, cocksuck: 1, cocksucked: 1, cocksucker: 1, cocksucking: 1, cocksucks: 1, cocksuka: 1, cocksukka: 1, cok: 1, cokmuncher: 1, coksucka: 1, coon: 1, cox: 1, crap: 1, cum: 1, cummer: 1, cumming: 1, cums: 1, cumshot: 1, cunilingus: 1, cunillingus: 1, cunnilingus: 1, cunt: 1, cuntlick: 1, cuntlicker: 1, cuntlicking: 1, cunts: 1, cyalis: 1, cyberfuc: 1, cyberfuck: 1, cyberfucked: 1, cyberfucker: 1, cyberfuckers: 1, cyberfucking: 1, d1ck: 1, damn: 1, dick: 1, dickhead: 1, dildo: 1, dildos: 1, dink: 1, dinks: 1, dirsa: 1, dlck: 1, "dog-fucker": 1, doggin: 1, dogging: 1, donkeyribber: 1, doosh: 1, duche: 1, dyke: 1, ejaculate: 1, ejaculated: 1, ejaculates: 1, ejaculating: 1, ejaculatings: 1, ejaculation: 1, ejakulate: 1, "f u c k": 1, "f u c k e r": 1, f4nny: 1, fag: 1, fagging: 1, faggitt: 1, faggot: 1, faggs: 1, fagot: 1, fagots: 1, fags: 1, fanny: 1, fannyflaps: 1, fannyfucker: 1, fanyy: 1, fatass: 1, fcuk: 1, fcuker: 1, fcuking: 1, feck: 1, fecker: 1, felching: 1, fellate: 1, fellatio: 1, fingerfuck: 1, fingerfucked: 1, fingerfucker: 1, fingerfuckers: 1, fingerfucking: 1, fingerfucks: 1, fistfuck: 1, fistfucked: 1, fistfucker: 1, fistfuckers: 1, fistfucking: 1, fistfuckings: 1, fistfucks: 1, flange: 1, fook: 1, fooker: 1, fuck: 1, fucka: 1, fucked: 1, fucker: 1, fuckers: 1, fuckhead: 1, fuckheads: 1, fuckin: 1, fucking: 1, fuckings: 1, fuckingshitmotherfucker: 1, fuckme: 1, fucks: 1, fuckwhit: 1, fuckwit: 1, "fudge packer": 1, fudgepacker: 1, fuk: 1, fuker: 1, fukker: 1, fukkin: 1, fuks: 1, fukwhit: 1, fukwit: 1, fux: 1, fux0r: 1, f_u_c_k: 1, gangbang: 1, gangbanged: 1, gangbangs: 1, gaylord: 1, gaysex: 1, goatse: 1, God: 1, "god-dam": 1, "god-damned": 1, goddamn: 1, goddamned: 1, hardcoresex: 1, hell: 1, heshe: 1, hoar: 1, hoare: 1, hoer: 1, homo: 1, hore: 1, horniest: 1, horny: 1, hotsex: 1, "jack-off": 1, jackoff: 1, jap: 1, "jerk-off": 1, jism: 1, jiz: 1, jizm: 1, jizz: 1, kawk: 1, knob: 1, knobead: 1, knobed: 1, knobend: 1, knobhead: 1, knobjocky: 1, knobjokey: 1, kock: 1, kondum: 1, kondums: 1, kum: 1, kummer: 1, kumming: 1, kums: 1, kunilingus: 1, "l3i+ch": 1, l3itch: 1, labia: 1, lust: 1, lusting: 1, m0f0: 1, m0fo: 1, m45terbate: 1, ma5terb8: 1, ma5terbate: 1, masochist: 1, "master-bate": 1, masterb8: 1, "masterbat*": 1, masterbat3: 1, masterbate: 1, masterbation: 1, masterbations: 1, masturbate: 1, "mo-fo": 1, mof0: 1, mofo: 1, mothafuck: 1, mothafucka: 1, mothafuckas: 1, mothafuckaz: 1, mothafucked: 1, mothafucker: 1, mothafuckers: 1, mothafuckin: 1, mothafucking: 1, mothafuckings: 1, mothafucks: 1, "mother fucker": 1, motherfuck: 1, motherfucked: 1, motherfucker: 1, motherfuckers: 1, motherfuckin: 1, motherfucking: 1, motherfuckings: 1, motherfuckka: 1, motherfucks: 1, muff: 1, mutha: 1, muthafecker: 1, muthafuckker: 1, muther: 1, mutherfucker: 1, n1gga: 1, n1gger: 1, nazi: 1, nigg3r: 1, nigg4h: 1, nigga: 1, niggah: 1, niggas: 1, niggaz: 1, nigger: 1, niggers: 1, nob: 1, "nob jokey": 1, nobhead: 1, nobjocky: 1, nobjokey: 1, numbnuts: 1, nutsack: 1, orgasim: 1, orgasims: 1, orgasm: 1, orgasms: 1, p0rn: 1, pawn: 1, pecker: 1, penis: 1, penisfucker: 1, phonesex: 1, phuck: 1, phuk: 1, phuked: 1, phuking: 1, phukked: 1, phukking: 1, phuks: 1, phuq: 1, pigfucker: 1, pimpis: 1, piss: 1, pissed: 1, pisser: 1, pissers: 1, pisses: 1, pissflaps: 1, pissin: 1, pissing: 1, pissoff: 1, poop: 1, porn: 1, porno: 1, pornography: 1, pornos: 1, prick: 1, pricks: 1, pron: 1, pube: 1, pusse: 1, pussi: 1, pussies: 1, pussy: 1, pussys: 1, rectum: 1, retard: 1, rimjaw: 1, rimming: 1, "s hit": 1, "s.o.b.": 1, sadist: 1, schlong: 1, screwing: 1, scroat: 1, scrote: 1, scrotum: 1, semen: 1, sex: 1, "sh!+": 1, "sh!t": 1, sh1t: 1, shag: 1, shagger: 1, shaggin: 1, shagging: 1, shemale: 1, "shi+": 1, shit: 1, shitdick: 1, shite: 1, shited: 1, shitey: 1, shitfuck: 1, shitfull: 1, shithead: 1, shiting: 1, shitings: 1, shits: 1, shitted: 1, shitter: 1, shitters: 1, shitting: 1, shittings: 1, shitty: 1, skank: 1, slut: 1, sluts: 1, smegma: 1, smut: 1, snatch: 1, "son-of-a-bitch": 1, spac: 1, spunk: 1, s_h_i_t: 1, t1tt1e5: 1, t1tties: 1, teets: 1, teez: 1, testical: 1, testicle: 1, tit: 1, titfuck: 1, tits: 1, titt: 1, tittie5: 1, tittiefucker: 1, titties: 1, tittyfuck: 1, tittywank: 1, titwank: 1, tosser: 1, turd: 1, tw4t: 1, twat: 1, twathead: 1, twatty: 1, twunt: 1, twunter: 1, v14gra: 1, v1gra: 1, vagina: 1, viagra: 1, vulva: 1, w00se: 1, wang: 1, wank: 1, wanker: 1, wanky: 1, whoar: 1, whore: 1, willies: 1, willy: 1, xrated: 1, xxx: 1};
}, function (a, W) {
  var bO = Cv;
  a[bO(42)] = [bO(1994), bO(1995), bO(1996), bO(1997), bO(1501), bO(1585), bO(1998), bO(1999), bO(2e3), bO(1507), bO(2001), bO(2002), bO(2003), bO(2004), bO(1593), bO(1594), bO(2005), bO(2006), bO(1817), bO(1855), bO(1818), bO(1819), bO(2007), bO(2008), bO(2009), bO(777), bO(2010), bO(2011), bO(2012), bO(2013), bO(2014), bO(1820), bO(2015), bO(775), bO(2016), bO(2017), bO(1604), bO(2018), bO(2019), bO(2020), bO(2021), bO(1815), bO(2022), bO(1821), bO(2023), bO(2024), bO(1479), bO(2025), bO(1854), bO(2026), bO(2027), bO(2028), bO(2029), bO(1876), bO(1822), bO(2030), bO(2031), bO(2032), bO(2033), bO(1607), bO(2034), bO(2035), bO(1498), bO(2036), bO(2037), bO(1612), bO(1823), bO(1824), bO(2038), bO(767), bO(2039), bO(1825), bO(2040), bO(761), bO(1621), bO(2041), bO(1617), bO(2042), bO(2043), bO(1619), bO(2044), bO(2045), bO(2046), bO(2047), bO(2048), bO(2049), bO(2050), bO(2051), bO(2052), bO(2053), bO(2054), bO(2055), bO(1622), bO(763), bO(2056), bO(2057), bO(2058), bO(2059), bO(2060), bO(2061), bO(2062), bO(751), bO(2063), bO(2064), bO(2065), bO(1623), bO(2066), bO(2067), bO(2068), bO(2069), bO(2070), bO(2071), bO(2072), bO(2073), bO(774), bO(758), bO(2074), bO(1627), bO(1628), bO(2075), bO(2076), bO(1826), bO(2077), bO(2078), bO(2079), bO(2080), bO(2081), bO(2082), bO(2083), bO(1634), bO(2084), bO(2085), bO(2086), bO(2087), bO(2088), bO(2089), bO(1827), bO(1636), bO(1637), bO(2090), bO(776), bO(2091), bO(2092), bO(755), bO(2093), bO(2094), bO(2095), bO(1644), bO(1898), bO(2096), bO(2097), bO(2098), bO(1828), bO(1829), bO(2099), bO(2100), bO(2101), bO(2102), bO(2103), bO(2104), bO(2105), bO(2106), bO(2107), bO(2108), bO(2109), bO(2110), bO(2111), bO(2112), bO(2113), bO(2114), bO(2115), bO(2116), bO(2117), bO(2118), bO(2119), bO(2120), bO(2121), bO(753), bO(2122), bO(2123), bO(1650), bO(2124), bO(2125), bO(2126), bO(1651), bO(1652), bO(2127), bO(2128), bO(2129), bO(1653), bO(2130), bO(2131), bO(2132), bO(2133), bO(1655), bO(1658), bO(2134), bO(2135), bO(2136), bO(2137), bO(2138), bO(2139), bO(1830), bO(2140), bO(2141), bO(2142), bO(2143), bO(2144), bO(2145), bO(2146), bO(2147), bO(2148), bO(2149), bO(2150), bO(2151), bO(2152), bO(1914), bO(2153), bO(1671), bO(2154), bO(1831), bO(2155), bO(1832), bO(2156), bO(2157), bO(2158), bO(2159), bO(1674), bO(1675), bO(1677), bO(1833), bO(2160), bO(1680), bO(770), bO(1834), bO(1681), bO(2161), bO(2162), bO(2163), bO(2164), bO(2165), bO(2166), bO(2167), bO(2168), bO(2169), bO(2170), bO(2171), bO(2172), bO(2173), bO(2174), bO(1836), bO(1835), bO(2175), bO(2176), bO(2177), bO(2178), bO(2179), bO(2180), bO(2181), bO(2182), bO(1690), bO(2183), bO(2184), bO(1839), bO(1840), bO(1696), bO(2185), bO(2186), bO(1838), bO(2187), bO(2188), bO(1843), bO(2189), bO(2190), bO(2191), bO(2192), bO(2193), bO(2194), bO(2195), bO(2196), bO(2197), bO(2198), bO(2199), bO(2200), bO(2201), bO(2202), bO(1841), bO(2203), bO(2204), bO(2205), bO(2206), bO(2207), bO(2208), bO(2209), bO(2210), bO(2211), bO(2212), bO(2213), bO(2214), bO(2215), bO(2216), bO(1469), bO(2217), bO(2218), bO(757), bO(2219), bO(2220), bO(2221), bO(756), bO(2222), bO(2223), bO(2224), bO(2225), bO(2226), bO(2227), bO(2228), bO(1844), bO(2229), bO(2230), bO(1721), bO(2231), bO(1956), bO(2232), bO(1732), bO(766), bO(2233), bO(2234), bO(1845), bO(2235), bO(2236), bO(2237), bO(2238), bO(2239), bO(2240), bO(2241), bO(2242), bO(1846), bO(2243), bO(2244), bO(2245), bO(2246), bO(2247), bO(2248), bO(2249), bO(2250), bO(2251), bO(1955), bO(1464), bO(2252), bO(2253), bO(2254), bO(2255), bO(2256), bO(2257), bO(2258), bO(1754), bO(2259), bO(2260), bO(768), bO(2261), bO(1765), bO(1766), bO(2262), bO(2263), bO(2264), bO(1842), bO(1767), bO(1769), bO(1770), bO(2265), bO(2266), bO(1847), bO(1771), bO(764), bO(1851), bO(1848), bO(1774), bO(2267), bO(2268), bO(2269), bO(2270), bO(1849), bO(1850), bO(754), bO(2271), bO(2272), bO(2273), bO(2274), bO(2275), bO(2276), bO(2277), bO(2278), bO(2279), bO(1779), bO(2280), bO(1780), bO(2281), bO(2282), bO(2283), bO(2284), bO(1789), bO(1795), bO(1796), bO(2285), bO(1852), bO(2286), bO(1799), bO(2287), bO(2288), bO(2289), bO(2290), bO(2291), bO(1853), bO(1856), bO(1857), bO(1858), bO(1800), bO(2292), bO(765), bO(1859), bO(2293), bO(2294), bO(2295), bO(2296), bO(2297), bO(2298), bO(2299), bO(1801), bO(2300), bO(1986), bO(2301), bO(2302), bO(2303), bO(2304), bO(2305), bO(2306), bO(759), bO(2307), bO(1808), bO(1860), bO(2308), bO(1861), bO(773), bO(2309), bO(1862), bO(752), bO(2310), bO(2311), bO(1812), bO(1813)];
}, function (a, W) {
  var w0 = Cv;
  a[w0(42)] = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
}, function (a, W) {
  var w1 = Cv;
  a[w1(42)][w1(555)] = [{id: 45, name: w1(2312), dontSell: true, price: 0, scale: 120, desc: w1(2313)}, {id: 51, name: w1(2314), price: 0, scale: 120, desc: w1(2315)}, {id: 50, name: w1(2316), price: 0, scale: 120, desc: w1(2317)}, {id: 28, name: w1(2318), price: 0, scale: 120, desc: w1(2319)}, {id: 29, name: w1(2320), price: 0, scale: 120, desc: w1(2319)}, {id: 30, name: w1(2321), price: 0, scale: 120, desc: w1(2319)}, {id: 36, name: w1(2322), price: 0, scale: 120, desc: w1(2319)}, {id: 37, name: w1(2323), price: 0, scale: 120, desc: w1(2319)}, {id: 38, name: w1(2324), price: 0, scale: 120, desc: w1(2319)}, {id: 44, name: w1(2325), price: 0, scale: 120, desc: w1(2319)}, {id: 35, name: w1(2326), price: 0, scale: 120, desc: w1(2319)}, {id: 42, name: w1(2327), price: 0, scale: 120, desc: w1(2328)}, {id: 43, name: w1(2329), price: 0, scale: 120, desc: w1(2330)}, {id: 49, name: w1(2331), price: 0, scale: 120, desc: w1(2332)}, {id: 57, name: w1(2333), price: 50, scale: 120, desc: w1(2334)}, {id: 8, name: w1(2335), price: 100, scale: 120, desc: w1(2319)}, {id: 2, name: w1(2336), price: 500, scale: 120, desc: w1(2319)}, {id: 15, name: w1(2337), price: 600, scale: 120, desc: w1(2338), coldM: 1}, {id: 5, name: w1(2339), price: 1e3, scale: 120, desc: w1(2319)}, {id: 4, name: w1(2340), price: 2e3, scale: 120, desc: w1(2319)}, {id: 18, name: w1(2341), price: 2e3, scale: 120, desc: w1(2319)}, {id: 31, name: w1(2342), price: 2500, scale: 120, desc: w1(2343), watrImm: true}, {id: 1, name: w1(2344), price: 3e3, scale: 120, desc: w1(2345), aMlt: 1.3}, {id: 10, name: w1(2346), price: 3e3, scale: 160, desc: w1(2347)}, {id: 48, name: w1(2348), price: 3e3, scale: 120, desc: w1(2319)}, {id: 6, name: w1(2349), price: 4e3, scale: 120, desc: w1(2350), spdMult: 0.94, dmgMult: 0.75}, {id: 23, name: w1(2351), price: 4e3, scale: 120, desc: w1(2352), poisonRes: 1}, {id: 13, name: w1(2353), price: 5e3, scale: 110, desc: w1(2354), healthRegen: 3}, {id: 9, name: w1(2355), price: 5e3, scale: 120, desc: w1(2356), extraGold: 1}, {id: 32, name: w1(2357), price: 5e3, scale: 120, desc: w1(2358), projCost: 0.5}, {id: 7, name: w1(2359), price: 6e3, scale: 120, desc: w1(2360), healthRegen: -5, dmgMultO: 1.5, spdMult: 0.96}, {id: 22, name: w1(2361), price: 6e3, scale: 120, desc: w1(2362), antiTurret: 1, spdMult: 0.7}, {id: 12, name: w1(2363), price: 6e3, scale: 120, desc: w1(2364), spdMult: 1.16}, {id: 26, name: w1(2365), price: 8e3, scale: 120, desc: w1(2366), dmgK: 0.6}, {id: 21, name: w1(2367), price: 1e4, scale: 120, desc: w1(2368), poisonDmg: 5, poisonTime: 6}, {id: 46, name: w1(2369), price: 1e4, scale: 120, desc: w1(2370), bullRepel: 1}, {id: 14, name: w1(2371), topSprite: true, price: 1e4, scale: 120, desc: w1(2372), pps: 1.5}, {id: 11, name: w1(2373), topSprite: true, price: 1e4, scale: 120, desc: w1(2374), dmg: 0.45}, {id: 53, name: w1(2375), topSprite: true, price: 1e4, scale: 120, desc: w1(2376), turret: {proj: 1, range: 700, rate: 2500}, spdMult: 0.7}, {id: 20, name: w1(2377), price: 12e3, scale: 120, desc: w1(2378), atkSpd: 0.78}, {id: 58, name: w1(2379), price: 12e3, scale: 120, desc: w1(2380), healD: 0.4}, {id: 27, name: w1(2381), price: 15e3, scale: 120, desc: w1(2382), kScrM: 2}, {id: 40, name: w1(2383), price: 15e3, scale: 120, desc: w1(2384), spdMult: 0.3, bDmg: 3.3}, {id: 52, name: w1(2385), price: 15e3, scale: 120, desc: w1(2386), goldSteal: 0.5}, {id: 55, name: w1(2387), price: 2e4, scale: 120, desc: w1(2388), healD: 0.25, dmgMultO: 1.2}, {id: 56, name: w1(2389), price: 2e4, scale: 120, desc: w1(2390), noEat: true, spdMult: 1.1, invisTimer: 1e3}], a[w1(42)][w1(556)] = [{id: 12, name: w1(2391), price: 1e3, scale: 105, xOff: 18, desc: w1(2319)}, {id: 9, name: w1(2392), price: 1e3, scale: 90, desc: w1(2319)}, {id: 10, name: w1(2393), price: 1e3, scale: 90, desc: w1(2319)}, {id: 3, name: w1(2394), price: 1500, scale: 90, desc: w1(2319)}, {id: 8, name: w1(2395), price: 2e3, scale: 90, desc: w1(2319)}, {id: 11, name: w1(2396), price: 2e3, scale: 97, xOff: 25, desc: w1(2397), spdMult: 1.35, dmgMultO: 0.2}, {id: 17, name: w1(2398), price: 3e3, scale: 80, xOff: 12, desc: w1(2354), healthRegen: 1}, {id: 6, name: w1(2399), price: 3e3, scale: 90, desc: w1(2319)}, {id: 4, name: w1(2400), price: 4e3, scale: 90, desc: w1(2319)}, {id: 5, name: w1(2401), price: 5e3, scale: 90, desc: w1(2319)}, {id: 2, name: w1(2402), price: 6e3, scale: 90, desc: w1(2319)}, {id: 1, name: w1(2403), price: 8e3, scale: 90, desc: w1(2319)}, {id: 7, name: w1(2404), price: 8e3, scale: 90, desc: w1(2319)}, {id: 14, name: w1(2405), price: 1e4, scale: 115, xOff: 20, desc: w1(2319)}, {id: 15, name: w1(2406), price: 1e4, scale: 95, xOff: 15, desc: w1(2319)}, {id: 20, name: w1(2407), price: 1e4, scale: 95, xOff: 20, desc: w1(2319)}, {id: 16, name: w1(2408), price: 12e3, scale: 90, spin: true, xOff: 0, desc: w1(2374), dmg: 0.15}, {id: 13, name: w1(2409), price: 15e3, scale: 138, xOff: 22, desc: w1(2354), healthRegen: 3}, {id: 19, name: w1(2410), price: 15e3, scale: 138, xOff: 22, desc: w1(2411), spdMult: 1.1}, {id: 18, name: w1(2412), price: 2e4, scale: 178, xOff: 26, desc: w1(2380), healD: 0.2}, {id: 21, name: w1(2413), price: 2e4, scale: 178, xOff: 26, desc: w1(2374), dmg: 0.25}];
}, function (a, W) {
  var w2 = Cv;
  a[w2(42)] = function (M, C, g, U, p, x, u) {
    var w3 = w2;
    this[w3(83)] = function (w, L, j, A, T, N, Q, D, J) {
      var w4 = w3;
      this[w4(674)] = true, this[w4(1018)] = w, this.x = L, this.y = j, this[w4(1016)] = A, this[w4(2414)] = true, this[w4(1112)] = T, this[w4(1122)] = N, this[w4(675)] = D, this[w4(1113)] = Q, this[w4(736)] = J, u && (this[w4(1338)] = {});
    };
    var B, b = [];
    this[w3(676)] = function (w) {
      var w5 = w3;
      if (this[w5(674)]) {
        var L, j = this[w5(1112)] * w;
        if (this[w5(2414)] ? this[w5(2414)] = false : (this.x += j * Math[w5(1026)](this[w5(1016)]), this.y += j * Math[w5(1025)](this[w5(1016)]), this[w5(1113)] -= j, this[w5(1113)] <= 0 && (this.x += this[w5(1113)] * Math[w5(1026)](this[w5(1016)]), this.y += this[w5(1113)] * Math[w5(1025)](this[w5(1016)]), j = 1, this[w5(1113)] = 0, this[w5(674)] = false)), u) {
          for (var A = 0; A < M[w5(68)]; ++A) !this[w5(1338)][M[A].id] && M[A][w5(1445)](this) && (this[w5(1338)][M[A].id] = 1, u[w5(612)](M[A].id, "18", x[w5(797)](this.x, 1), x[w5(797)](this.y, 1), x[w5(797)](this[w5(1016)], 2), x[w5(797)](this[w5(1113)], 1), this[w5(1112)], this[w5(1018)], this[w5(1015)], this[w5(654)]));
          for (b[w5(68)] = 0, A = 0; A < M[w5(68)] + C[w5(68)]; ++A) !(B = M[A] || C[A - M[w5(68)]])[w5(571)] || B == this[w5(736)] || this[w5(736)][w5(652)] && B[w5(652)] == this[w5(736)][w5(652)] || x[w5(1304)](B.x - B[w5(675)], B.y - B[w5(675)], B.x + B[w5(675)], B.y + B[w5(675)], this.x, this.y, this.x + j * Math[w5(1026)](this[w5(1016)]), this.y + j * Math[w5(1025)](this[w5(1016)])) && b[w5(167)](B);
          for (var T = g[w5(1447)](this.x, this.y, this[w5(675)]), N = 0; N < T[w5(68)]; ++N) for (var Q = 0; Q < T[N][w5(68)]; ++Q) L = (B = T[N][Q])[w5(1356)](), B[w5(674)] && this[w5(2415)] != B[w5(654)] && this[w5(1015)] <= B[w5(1015)] && b[w5(161)](B) < 0 && !B[w5(1143)] && x[w5(1304)](B.x - L, B.y - L, B.x + L, B.y + L, this.x, this.y, this.x + j * Math[w5(1026)](this[w5(1016)]), this.y + j * Math[w5(1025)](this[w5(1016)])) && b[w5(167)](B);
          if (b[w5(68)] > 0) {
            var D = null, J = null, K = null;
            for (A = 0; A < b[w5(68)]; ++A) K = x[w5(1161)](this.x, this.y, b[A].x, b[A].y), (null == J || K < J) && (J = K, D = b[A]);
            if (D[w5(1168)] || D[w5(2416)]) {
              var F = 0.3 * (D[w5(1453)] || 1);
              D[w5(1452)] += F * Math[w5(1026)](this[w5(1016)]), D[w5(1454)] += F * Math[w5(1025)](this[w5(1016)]), null != D[w5(377)] && U[w5(459)][D[w5(377)]][w5(1563)] && x[w5(1297)](this[w5(1016)] + Math.PI, D[w5(1016)]) <= p[w5(373)] || D[w5(1355)](-this[w5(1122)], this[w5(736)], this[w5(736)]);
            } else {
              for (D[w5(1344)] && D[w5(983)] && D[w5(1355)](-this[w5(1122)]) && g[w5(1443)](D), A = 0; A < M[w5(68)]; ++A) M[A][w5(674)] && (D[w5(1338)][M[A].id] && (D[w5(674)] ? M[A][w5(1445)](D) && u[w5(612)](M[A].id, "8", x[w5(797)](this[w5(1016)], 2), D[w5(654)]) : u[w5(612)](M[A].id, "12", D[w5(654)])), D[w5(674)] || D[w5(736)] != M[A] || M[A][w5(1446)](D[w5(643)].id, -1));
            }
            for (this[w5(674)] = false, A = 0; A < M[w5(68)]; ++A) this[w5(1338)][M[A].id] && u[w5(612)](M[A].id, "19", this[w5(654)], x[w5(797)](J, 1));
          }
        }
      }
    };
  };
}, function (a, W) {
  var w6 = Cv;
  a[w6(42)] = function (M, C, g, U, p, x, u, B, b) {
    var w7 = w6;
    this[w7(1111)] = function (L, j, A, T, N, Q, D, J, K) {
      var w8 = w7;
      for (var F, V = x[w8(1017)][Q], I = 0; I < C[w8(68)]; ++I) if (!C[I][w8(674)]) {
        F = C[I];
        break;
      }
      return F || ((F = new M(g, U, p, x, u, B, b))[w8(654)] = C[w8(68)], C[w8(167)](F)), F[w8(83)](Q, L, j, A, N, V[w8(1122)], T, V[w8(675)], D), F[w8(2415)] = J, F[w8(1015)] = K || V[w8(1015)], F[w8(444)] = V[w8(444)], F;
    };
  };
}, function (a, W) {
  var w9 = Cv;
  a[w9(42)][w9(410)] = function (M, C) {
    var wH = w9, g;
    this[wH(2417)] = [], this[wH(674)] = true, this[wH(2418)] = function (U, p, x) {
      var wh = wH;
      p && this[wh(674)] && ((g = this[wh(2417)][U]) || (g = new Howl({src: wh(2419) + U + wh(2420)}), this[wh(2417)][U] = g), x && g[wh(2421)] || (g[wh(2421)] = true, g[wh(2418)](), g[wh(2422)]((p || 1) * M[wh(2423)]), g[wh(2424)](x)));
    }, this[wH(2425)] = function (r, U) {
      var wa = wH;
      (g = this[wa(2417)][r]) && g[wa(2426)](U);
    }, this[wH(948)] = function (r) {
      var wW = wH;
      (g = this[wW(2417)][r]) && (g[wW(948)](), g[wW(2421)] = false);
    };
  };
}, function (W, M, C) {
  var wC = Cv, g = C(60), U = C(67);
  function p(u, B, o, b, w) {
    var wM = h;
    wM(2427) == location[wM(407)] && (window[wM(431)][wM(407)] = wM(406)), this[wM(413)] = false, this[wM(2428)] = u, this[wM(2429)] = o, this[wM(2430)] = B, this[wM(2431)] = b, this[wM(2432)] = !!w, this[wM(584)] = void 0, this[wM(586)] = void 0, this[wM(2433)] = void 0, this[wM(2434)] = void 0, this[wM(607)](vultr[wM(576)]);
  }
  p[wC(54)][wC(579)] = {0: {name: wC(2435), latitude: 0, longitude: 0}, "vultr:1": {name: wC(2436), latitude: 40.1393329, longitude: -75.8521818}, "vultr:2": {name: wC(2437), latitude: 41.8339037, longitude: -87.872238}, "vultr:3": {name: wC(2438), latitude: 32.8208751, longitude: -96.8714229}, "vultr:4": {name: wC(2439), latitude: 47.6149942, longitude: -122.4759879}, "vultr:5": {name: wC(2440), latitude: 34.0207504, longitude: -118.691914}, "vultr:6": {name: wC(2441), latitude: 33.7676334, longitude: -84.5610332}, "vultr:7": {name: wC(2442), latitude: 52.3745287, longitude: 4.7581878}, "vultr:8": {name: wC(2443), latitude: 51.5283063, longitude: -0.382486}, "vultr:9": {name: wC(2444), latitude: 50.1211273, longitude: 8.496137}, "vultr:12": {name: wC(2445), latitude: 37.4024714, longitude: -122.3219752}, "vultr:19": {name: wC(2446), latitude: -33.8479715, longitude: 150.651084}, "vultr:24": {name: wC(2447), latitude: 48.8588376, longitude: 2.2773454}, "vultr:25": {name: wC(2448), latitude: 35.6732615, longitude: 139.569959}, "vultr:39": {name: wC(2449), latitude: 25.7823071, longitude: -80.3012156}, "vultr:40": {name: wC(2450), latitude: 1.3147268, longitude: 103.7065876}}, p[wC(54)][wC(267)] = function (u, B) {
    var wg = wC;
    this[wg(2433)] = u, this[wg(2434)] = B;
    var o = this[wg(2451)]();
    o ? (this[wg(105)](wg(2452)), this[wg(941)] = o[3], this[wg(423)](o[0], o[1], o[2])) : (this[wg(105)](wg(2453)), this[wg(2454)]());
  }, p[wC(54)][wC(2451)] = function () {
    var wr = wC, u = g[wr(605)](location[wr(432)], true), B = u[wr(2455)][wr(584)];
    if (wr(52) == typeof B) {
      var o = B[wr(615)](":");
      if (3 == o[wr(68)]) {
        var b = o[0], w = parseInt(o[1]), L = parseInt(o[2]);
        return "0" == b || b[wr(408)](wr(2456)) || (b = wr(2456) + b), [b, w, L, u[wr(2455)][wr(941)]];
      }
      this[wr(2434)](wr(2457) + B);
    }
  }, p[wC(54)][wC(2458)] = function (u, B) {
    var wU = wC, o = this[wU(576)][u];
    if (Array[wU(60)](o)) {
      for (var b = 0; b < o[wU(68)]; b++) {
        var w = o[b];
        if (w[wU(583)] == B) return w;
      }
      console[wU(967)](wU(2459) + u + wU(2460) + B + ".");
    } else this[wU(2434)](wU(2461) + u);
  }, p[wC(54)][wC(2454)] = function () {
    var wn = wC, u = this, B = [];
    for (var o in this[wn(576)]) if (this[wn(576)][wn(55)](o)) {
      var b = this[wn(576)][o], w = b[Math[wn(104)](Math[wn(1294)]() * b[wn(68)])];
      null != w ? function (L, j) {
        var wp = wn, A = new XMLHttpRequest;
        A[wp(601)] = function (N) {
          var wx = wp, l = N[wx(490)];
          if (4 == l[wx(602)]) {
            if (200 == l[wx(603)]) {
              for (var Q = 0; Q < B[wx(68)]; Q++) B[Q][wx(2462)]();
              u[wx(105)](wx(2463), j[wx(585)]);
              var D = u[wx(2464)](j[wx(585)]);
              u[wx(423)](D[0], D[1], D[2]);
            } else console[wx(967)](wx(2465) + j.ip + wx(2466) + o);
          }
        };
        var T = "//" + u[wp(2467)](j.ip, true) + ":" + u[wp(2468)](j) + wp(2469);
        A[wp(609)](wp(610), T, true), A[wp(612)](null), u[wp(105)](wp(2470), T), B[wp(167)](A);
      }(0, w) : console[wn(105)](wn(2471) + o);
    }
  }, p[wC(54)][wC(2464)] = function (B, b, w) {
    var wu = wC;
    null == w && (w = wu(1294)), null == b && (b = false);
    const L = [wu(1294)];
    var j = this[wu(2429)], A = this[wu(2431)], T = this[wu(576)][B][wu(2472)](function (K) {
      var wB = wu, d = 0;
      return K[wB(577)][wB(1258)](function (F) {
        var wo = wB, V = d++;
        return {region: K[wo(585)], index: K[wo(583)] * K[wo(577)][wo(68)] + V, gameIndex: V, gameCount: K[wo(577)][wo(68)], playerCount: F[wo(578)], isPrivate: F[wo(2473)]};
      });
    })[wu(80)](function (K) {
      var wb = wu;
      return !K[wb(2473)];
    })[wu(80)](function (K) {
      var ww = wu;
      return !b || 0 == K[ww(578)] && K[ww(586)] >= K[ww(2474)] / 2;
    })[wu(80)](function (K) {
      var wL = wu;
      return wL(1294) == w || L[K[wL(583)] % L[wL(68)]][wL(935)] == w;
    })[wu(1127)](function (K, d) {
      var wj = wu;
      return d[wj(578)] - K[wj(578)];
    })[wu(80)](function (K) {
      var ws = wu;
      return K[ws(578)] < j;
    });
    if (b && T[wu(2475)](), 0 != T[wu(68)]) {
      var N = Math[wu(170)](A, T[wu(68)]), Q = Math[wu(104)](Math[wu(1294)]() * N), D = T[Q = Math[wu(170)](Q, T[wu(68)] - 1)], J = D[wu(585)], f = (Q = Math[wu(104)](D[wu(583)] / D[wu(2474)]), D[wu(583)] % D[wu(2474)]);
      return this[wu(105)](wu(2476)), [J, Q, f];
    }
    this[wu(2434)](wu(2477));
  }, p[wC(54)][wC(423)] = function (u, B, o) {
    var wA = wC;
    if (!this[wA(947)]) {
      var b = this[wA(2458)](u, B);
      null != b ? (this[wA(105)](wA(2478), b, wA(2479), o), b[wA(577)][o][wA(578)] >= this[wA(2429)] ? this[wA(2434)](wA(2480)) : (window[wA(2481)][wA(2482)](document[wA(1277)], document[wA(1277)], this[wA(2483)](u, B, o, this[wA(941)])), this[wA(584)] = b, this[wA(586)] = o, this[wA(105)](wA(2484), this[wA(2467)](b.ip), wA(2485), this[wA(2468)](b), wA(2479), o), this[wA(2433)](this[wA(2467)](b.ip), this[wA(2468)](b), o))) : this[wA(2434)](wA(2486) + u + wA(2487) + B);
    }
  }, p[wC(54)][wC(616)] = function (u, B, o, b) {
    var wT = wC;
    this[wT(2488)] = true, window[wT(431)][wT(432)] = this[wT(2483)](u, B, o, b);
  }, p[wC(54)][wC(2483)] = function (u, B, o, b) {
    var wi = wC, w = wi(433) + (u = this[wi(587)](u)) + ":" + B + ":" + o;
    return b && (w += wi(2489) + encodeURIComponent(b)), w;
  }, p[wC(54)][wC(2467)] = function (u, B) {
    var wN = wC;
    return wN(406) == u || wN(2490) == u || wN(2491) == u ? window[wN(431)][wN(407)] : this[wN(2432)] ? B ? wN(2492) + this[wN(2493)](u) + "." + this[wN(2428)] : u : wN(2492) + u + "." + this[wN(2428)];
  }, p[wC(54)][wC(2468)] = function (u) {
    var wt = wC;
    return 0 == u[wt(585)] ? this[wt(2430)] : location[wt(2494)][wt(408)](wt(2495)) ? 443 : 80;
  }, p[wC(54)][wC(607)] = function (u) {
    var wl = wC;
    for (var B = {}, o = 0; o < u[wl(68)]; o++) {
      var b = u[o], w = B[b[wl(585)]];
      null == w && (w = [], B[b[wl(585)]] = w), w[wl(167)](b);
    }
    for (var L in B) B[L] = B[L][wl(1127)](function (j, A) {
      var wQ = wl;
      return j[wQ(583)] - A[wQ(583)];
    });
    this[wl(576)] = B;
  }, p[wC(54)][wC(2496)] = function (u) {
    var wD = wC;
    return u[wD(615)](".")[wD(1258)](B => ("00" + parseInt(B)[wD(77)](16))[wD(166)](-2))[wD(197)]("")[wD(160)]();
  }, p[wC(54)][wC(2493)] = function (u) {
    var wJ = wC;
    return U(this[wJ(2496)](u));
  }, p[wC(54)][wC(105)] = function () {
    var wf = wC;
    return this[wf(413)] ? console[wf(105)][wf(84)](void 0, arguments) : console[wf(2497)] ? console[wf(2497)][wf(84)](void 0, arguments) : void 0;
  }, p[wC(54)][wC(587)] = function (u) {
    var wK = wC;
    return u[wK(408)](wK(2456)) ? u = u[wK(72)](6) : u[wK(408)](wK(2498)) && (u = u[wK(72)](3)), u;
  }, window[wC(2499)] = function () {
    var wF = wC, u = 1;
    function B(b, w) {
      var wd = h;
      (b = "" + b) == (w = "" + w) ? console[wd(105)](wd(2500) + u + wd(2501)) : console[wd(967)](wd(2500) + u + wd(2502) + w + wd(2503) + b + "."), u++;
    }
    var o = new p(wF(2504), -1, 5, 1, false);
    o[wF(2434)] = function (b) {}, o[wF(607)](function (b) {
      var wV = wF, w = [];
      for (var L in b) for (var j = b[L], A = 0; A < j[wV(68)]; A++) w[wV(167)]({ip: L + ":" + A, scheme: wV(2505), region: L, index: A, games: j[A][wV(1258)](T => ({playerCount: T, isPrivate: false}))});
      return w;
    }({1: [[0, 0, 0, 0], [0, 0, 0, 0]], 2: [[5, 1, 0, 0], [0, 0, 0, 0]], 3: [[5, 0, 1, 5], [0, 0, 0, 0]], 4: [[5, 1, 1, 5], [1, 0, 0, 0]], 5: [[5, 1, 1, 5], [1, 0, 4, 0]], 6: [[5, 5, 5, 5], [2, 3, 1, 4]], 7: [[5, 5, 5, 5], [5, 5, 5, 5]]})), B(o[wF(2464)](1, false), [1, 0, 0]), B(o[wF(2464)](1, true), [1, 1, 3]), B(o[wF(2464)](2, false), [2, 0, 1]), B(o[wF(2464)](2, true), [2, 1, 3]), B(o[wF(2464)](3, false), [3, 0, 2]), B(o[wF(2464)](3, true), [3, 1, 3]), B(o[wF(2464)](4, false), [4, 0, 1]), B(o[wF(2464)](4, true), [4, 1, 3]), B(o[wF(2464)](5, false), [5, 1, 2]), B(o[wF(2464)](5, true), [5, 1, 3]), B(o[wF(2464)](6, false), [6, 1, 3]), B(o[wF(2464)](6, true), void 0), B(o[wF(2464)](7, false), void 0), B(o[wF(2464)](7, true), void 0), console[wF(105)](wF(2506));
  };
  var x = function (u, B) {
    var wm = wC;
    return u[wm(66)](B);
  };
  Array[wC(54)][wC(2472)] = function (u) {
    return function (B, o) {
      var wk = h;
      return o[wk(1258)](B)[wk(81)](x, []);
    }(u, this);
  }, W[wC(42)] = p;
}, function (W, M, C) {
  "use strict";
  var wZ = Cv;
  var U = C(61), x = C(63);
  function B() {
    var wI = h;
    this[wI(2494)] = null, this[wI(2507)] = null, this[wI(2508)] = null, this[wI(2509)] = null, this[wI(2510)] = null, this[wI(407)] = null, this[wI(2511)] = null, this[wI(2512)] = null, this[wI(2455)] = null, this[wI(2513)] = null, this[wI(2514)] = null, this[wI(432)] = null;
  }
  M[wZ(605)] = I, M[wZ(2515)] = function (Z, X) {
    var wX = wZ;
    return I(Z, false, true)[wX(2515)](X);
  }, M[wZ(2516)] = function (Z, X) {
    var wG = wZ;
    return Z ? I(Z, false, true)[wG(2516)](X) : X;
  }, M[wZ(2517)] = function (Z) {
    var wq = wZ;
    return x[wq(1299)](Z) && (Z = I(Z)), Z instanceof B ? Z[wq(2517)]() : B[wq(54)][wq(2517)][wq(43)](Z);
  }, M[wZ(2518)] = B;
  var b = /^([a-z0-9.+-]+:)/i, w = /:[0-9]*$/, L = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, j = ["{", "}", "|", "\\", "^", "`"][wZ(66)](["<", ">", '"', "`", " ", "\r", "\n", "	"]), A = ["'"][wZ(66)](j), T = ["%", "/", "?", ";", "#"][wZ(66)](A), N = ["/", "?", "#"], Q = /^[+a-z0-9A-Z_-]{0,63}$/, D = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, J = {javascript: true, "javascript:": true}, K = {javascript: true, "javascript:": true}, F = {http: true, https: true, ftp: true, gopher: true, file: true, "http:": true, "https:": true, "ftp:": true, "gopher:": true, "file:": true}, V = C(64);
  function I(Z, X, G) {
    var wE = wZ;
    if (Z && x[wE(2519)](Z) && Z instanceof B) return Z;
    var q = new B;
    return q[wE(605)](Z, X, G), q;
  }
  B[wZ(54)][wZ(605)] = function (Z, X, G) {
    var wR = wZ;
    if (!x[wR(1299)](Z)) throw new TypeError(wR(2520) + typeof Z);
    var H0 = Z[wR(161)]("?"), H1 = -1 !== H0 && H0 < Z[wR(161)]("#") ? "?" : "#", H2 = Z[wR(615)](H1);
    H2[0] = H2[0][wR(253)](/\\/g, "/");
    var H3 = Z = H2[wR(197)](H1);
    if (H3 = H3[wR(252)](), !G && 1 === Z[wR(615)]("#")[wR(68)]) {
      var H4 = L[wR(2521)](H3);
      if (H4) return this[wR(2514)] = H3, this[wR(432)] = H3, this[wR(2513)] = H4[1], H4[2] ? (this[wR(2512)] = H4[2], this[wR(2455)] = X ? V[wR(605)](this[wR(2512)][wR(166)](1)) : this[wR(2512)][wR(166)](1)) : X && (this[wR(2512)] = "", this[wR(2455)] = {}), this;
    }
    var H5 = b[wR(2521)](H3);
    if (H5) {
      var H6 = (H5 = H5[0])[wR(160)]();
      this[wR(2494)] = H6, H3 = H3[wR(166)](H5[wR(68)]);
    }
    if (G || H5 || H3[wR(196)](/^\/\/[^@\/]+@[^@\/]+/)) {
      var H7 = "//" === H3[wR(166)](0, 2);
      !H7 || H5 && K[H5] || (H3 = H3[wR(166)](2), this[wR(2507)] = true);
    }
    if (!K[H5] && (H7 || H5 && !F[H5])) {
      for (var H8, H9, HH = -1, Hh = 0; Hh < N[wR(68)]; Hh++) -1 !== (Ha = H3[wR(161)](N[Hh])) && (-1 === HH || Ha < HH) && (HH = Ha);
      for (-1 !== (H9 = -1 === HH ? H3[wR(162)]("@") : H3[wR(162)]("@", HH)) && (H8 = H3[wR(72)](0, H9), H3 = H3[wR(72)](H9 + 1), this[wR(2508)] = decodeURIComponent(H8)), HH = -1, Hh = 0; Hh < T[wR(68)]; Hh++) {
        var Ha;
        -1 !== (Ha = H3[wR(161)](T[Hh])) && (-1 === HH || Ha < HH) && (HH = Ha);
      }
      -1 === HH && (HH = H3[wR(68)]), this[wR(2509)] = H3[wR(72)](0, HH), H3 = H3[wR(72)](HH), this[wR(2522)](), this[wR(407)] = this[wR(407)] || "";
      var HW = "[" === this[wR(407)][0] && "]" === this[wR(407)][this[wR(407)][wR(68)] - 1];
      if (!HW) for (var HM = this[wR(407)][wR(615)](/\./), HC = (Hh = 0, HM[wR(68)]); Hh < HC; Hh++) {
        var Hg = HM[Hh];
        if (Hg && !Hg[wR(196)](Q)) {
          for (var Hr = "", HU = 0, Hn = Hg[wR(68)]; HU < Hn; HU++) Hg[wR(168)](HU) > 127 ? Hr += "x" : Hr += Hg[HU];
          if (!Hr[wR(196)](Q)) {
            var Hp = HM[wR(72)](0, Hh), Hx = HM[wR(72)](Hh + 1), Hu = Hg[wR(196)](D);
            Hu && (Hp[wR(167)](Hu[1]), Hx[wR(98)](Hu[2])), Hx[wR(68)] && (H3 = "/" + Hx[wR(197)](".") + H3), this[wR(407)] = Hp[wR(197)](".");
            break;
          }
        }
      }
      this[wR(407)][wR(68)] > 255 ? this[wR(407)] = "" : this[wR(407)] = this[wR(407)][wR(160)](), HW || (this[wR(407)] = U[wR(2523)](this[wR(407)]));
      var HB = this[wR(2510)] ? ":" + this[wR(2510)] : "", Ho = this[wR(407)] || "";
      this[wR(2509)] = Ho + HB, this[wR(432)] += this[wR(2509)], HW && (this[wR(407)] = this[wR(407)][wR(166)](1, this[wR(407)][wR(68)] - 2), "/" !== H3[0] && (H3 = "/" + H3));
    }
    if (!J[H6]) for (Hh = 0, HC = A[wR(68)]; Hh < HC; Hh++) {
      var Hb = A[Hh];
      if (-1 !== H3[wR(161)](Hb)) {
        var Hw = encodeURIComponent(Hb);
        Hw === Hb && (Hw = escape(Hb)), H3 = H3[wR(615)](Hb)[wR(197)](Hw);
      }
    }
    var HL = H3[wR(161)]("#");
    -1 !== HL && (this[wR(2511)] = H3[wR(166)](HL), H3 = H3[wR(72)](0, HL));
    var Hj = H3[wR(161)]("?");
    if (-1 !== Hj ? (this[wR(2512)] = H3[wR(166)](Hj), this[wR(2455)] = H3[wR(166)](Hj + 1), X && (this[wR(2455)] = V[wR(605)](this[wR(2455)])), H3 = H3[wR(72)](0, Hj)) : X && (this[wR(2512)] = "", this[wR(2455)] = {}), H3 && (this[wR(2513)] = H3), F[H6] && this[wR(407)] && !this[wR(2513)] && (this[wR(2513)] = "/"), this[wR(2513)] || this[wR(2512)]) {
      HB = this[wR(2513)] || "";
      var Hs = this[wR(2512)] || "";
      this[wR(2514)] = HB + Hs;
    }
    return this[wR(432)] = this[wR(2517)](), this;
  }, B[wZ(54)][wZ(2517)] = function () {
    var wv = wZ, Z = this[wv(2508)] || "";
    Z && (Z = (Z = encodeURIComponent(Z))[wv(253)](/%3A/i, ":"), Z += "@");
    var X = this[wv(2494)] || "", G = this[wv(2513)] || "", q = this[wv(2511)] || "", E = false, R = "";
    this[wv(2509)] ? E = Z + this[wv(2509)] : this[wv(407)] && (E = Z + (-1 === this[wv(407)][wv(161)](":") ? this[wv(407)] : "[" + this[wv(407)] + "]"), this[wv(2510)] && (E += ":" + this[wv(2510)])), this[wv(2455)] && x[wv(2519)](this[wv(2455)]) && Object[wv(280)](this[wv(2455)])[wv(68)] && (R = V[wv(966)](this[wv(2455)]));
    var P = this[wv(2512)] || R && "?" + R || "";
    return X && ":" !== X[wv(166)](-1) && (X += ":"), this[wv(2507)] || (!X || F[X]) && false !== E ? (E = "//" + (E || ""), G && "/" !== G[wv(1301)](0) && (G = "/" + G)) : E || (E = ""), q && "#" !== q[wv(1301)](0) && (q = "#" + q), P && "?" !== P[wv(1301)](0) && (P = "?" + P), X + E + (G = G[wv(253)](/[?#]/g, function (z) {
      return encodeURIComponent(z);
    })) + (P = P[wv(253)]("#", wv(2524))) + q;
  }, B[wZ(54)][wZ(2515)] = function (Z) {
    var wP = wZ;
    return this[wP(2516)](I(Z, false, true))[wP(2517)]();
  }, B[wZ(54)][wZ(2516)] = function (Z) {
    var we = wZ;
    if (x[we(1299)](Z)) {
      var X = new B;
      X[we(605)](Z, false, true), Z = X;
    }
    for (var G = new B, q = Object[we(280)](this), R = 0; R < q[we(68)]; R++) {
      var z = q[R];
      G[z] = this[z];
    }
    if (G[we(2511)] = Z[we(2511)], "" === Z[we(432)]) return G[we(432)] = G[we(2517)](), G;
    if (Z[we(2507)] && !Z[we(2494)]) {
      for (var Y = Object[we(280)](Z), O = 0; O < Y[we(68)]; O++) {
        var H0 = Y[O];
        we(2494) !== H0 && (G[H0] = Z[H0]);
      }
      return F[G[we(2494)]] && G[we(407)] && !G[we(2513)] && (G[we(2514)] = G[we(2513)] = "/"), G[we(432)] = G[we(2517)](), G;
    }
    if (Z[we(2494)] && Z[we(2494)] !== G[we(2494)]) {
      if (!F[Z[we(2494)]]) {
        for (var H1 = Object[we(280)](Z), H2 = 0; H2 < H1[we(68)]; H2++) {
          var H3 = H1[H2];
          G[H3] = Z[H3];
        }
        return G[we(432)] = G[we(2517)](), G;
      }
      if (G[we(2494)] = Z[we(2494)], Z[we(2509)] || K[Z[we(2494)]]) G[we(2513)] = Z[we(2513)]; else {
        for (var H4 = (Z[we(2513)] || "")[we(615)]("/"); H4[we(68)] && !(Z[we(2509)] = H4[we(265)]());) ;
        Z[we(2509)] || (Z[we(2509)] = ""), Z[we(407)] || (Z[we(407)] = ""), "" !== H4[0] && H4[we(98)](""), H4[we(68)] < 2 && H4[we(98)](""), G[we(2513)] = H4[we(197)]("/");
      }
      if (G[we(2512)] = Z[we(2512)], G[we(2455)] = Z[we(2455)], G[we(2509)] = Z[we(2509)] || "", G[we(2508)] = Z[we(2508)], G[we(407)] = Z[we(407)] || Z[we(2509)], G[we(2510)] = Z[we(2510)], G[we(2513)] || G[we(2512)]) {
        var H5 = G[we(2513)] || "", H6 = G[we(2512)] || "";
        G[we(2514)] = H5 + H6;
      }
      return G[we(2507)] = G[we(2507)] || Z[we(2507)], G[we(432)] = G[we(2517)](), G;
    }
    var H7 = G[we(2513)] && "/" === G[we(2513)][we(1301)](0), H8 = Z[we(2509)] || Z[we(2513)] && "/" === Z[we(2513)][we(1301)](0), H9 = H8 || H7 || G[we(2509)] && Z[we(2513)], HH = H9, Hh = G[we(2513)] && G[we(2513)][we(615)]("/") || [], Ha = (H4 = Z[we(2513)] && Z[we(2513)][we(615)]("/") || [], G[we(2494)] && !F[G[we(2494)]]);
    if (Ha && (G[we(407)] = "", G[we(2510)] = null, G[we(2509)] && ("" === Hh[0] ? Hh[0] = G[we(2509)] : Hh[we(98)](G[we(2509)])), G[we(2509)] = "", Z[we(2494)] && (Z[we(407)] = null, Z[we(2510)] = null, Z[we(2509)] && ("" === H4[0] ? H4[0] = Z[we(2509)] : H4[we(98)](Z[we(2509)])), Z[we(2509)] = null), H9 = H9 && ("" === H4[0] || "" === Hh[0])), H8) G[we(2509)] = Z[we(2509)] || "" === Z[we(2509)] ? Z[we(2509)] : G[we(2509)], G[we(407)] = Z[we(407)] || "" === Z[we(407)] ? Z[we(407)] : G[we(407)], G[we(2512)] = Z[we(2512)], G[we(2455)] = Z[we(2455)], Hh = H4; else {
      if (H4[we(68)]) Hh || (Hh = []), Hh[we(1249)](), Hh = Hh[we(66)](H4), G[we(2512)] = Z[we(2512)], G[we(2455)] = Z[we(2455)]; else {
        if (!x[we(2525)](Z[we(2512)])) return Ha && (G[we(407)] = G[we(2509)] = Hh[we(265)](), (Hr = !!(G[we(2509)] && G[we(2509)][we(161)]("@") > 0) && G[we(2509)][we(615)]("@")) && (G[we(2508)] = Hr[we(265)](), G[we(2509)] = G[we(407)] = Hr[we(265)]())), G[we(2512)] = Z[we(2512)], G[we(2455)] = Z[we(2455)], x[we(2526)](G[we(2513)]) && x[we(2526)](G[we(2512)]) || (G[we(2514)] = (G[we(2513)] ? G[we(2513)] : "") + (G[we(2512)] ? G[we(2512)] : "")), G[we(432)] = G[we(2517)](), G;
      }
    }
    if (!Hh[we(68)]) return G[we(2513)] = null, G[we(2512)] ? G[we(2514)] = "/" + G[we(2512)] : G[we(2514)] = null, G[we(432)] = G[we(2517)](), G;
    for (var HW = Hh[we(72)](-1)[0], HM = (G[we(2509)] || Z[we(2509)] || Hh[we(68)] > 1) && ("." === HW || ".." === HW) || "" === HW, HC = 0, Hg = Hh[we(68)]; Hg >= 0; Hg--) "." === (HW = Hh[Hg]) ? Hh[we(655)](Hg, 1) : ".." === HW ? (Hh[we(655)](Hg, 1), HC++) : HC && (Hh[we(655)](Hg, 1), HC--);
    if (!H9 && !HH) {
      for (; HC--; HC) Hh[we(98)]("..");
    }
    !H9 || "" === Hh[0] || Hh[0] && "/" === Hh[0][we(1301)](0) || Hh[we(98)](""), HM && "/" !== Hh[we(197)]("/")[we(166)](-1) && Hh[we(167)]("");
    var Hr, HU = "" === Hh[0] || Hh[0] && "/" === Hh[0][we(1301)](0);
    return Ha && (G[we(407)] = G[we(2509)] = HU ? "" : Hh[we(68)] ? Hh[we(265)]() : "", (Hr = !!(G[we(2509)] && G[we(2509)][we(161)]("@") > 0) && G[we(2509)][we(615)]("@")) && (G[we(2508)] = Hr[we(265)](), G[we(2509)] = G[we(407)] = Hr[we(265)]())), (H9 = H9 || G[we(2509)] && Hh[we(68)]) && !HU && Hh[we(98)](""), Hh[we(68)] ? G[we(2513)] = Hh[we(197)]("/") : (G[we(2513)] = null, G[we(2514)] = null), x[we(2526)](G[we(2513)]) && x[we(2526)](G[we(2512)]) || (G[we(2514)] = (G[we(2513)] ? G[we(2513)] : "") + (G[we(2512)] ? G[we(2512)] : "")), G[we(2508)] = Z[we(2508)] || G[we(2508)], G[we(2507)] = G[we(2507)] || Z[we(2507)], G[we(432)] = G[we(2517)](), G;
  }, B[wZ(54)][wZ(2522)] = function () {
    var wz = wZ, Z = this[wz(2509)], X = w[wz(2521)](Z);
    X && (":" !== (X = X[0]) && (this[wz(2510)] = X[wz(166)](1)), Z = Z[wz(166)](0, Z[wz(68)] - X[wz(68)])), Z && (this[wz(407)] = Z);
  };
}, function (a, W, M) {
  var L4 = Cv;
  (function (C, g) {
    var U;
    !function (B) {
      var wY = h;
      W && W[wY(2527)], C && C[wY(2527)];
      var L = wY(49) == typeof g && g;
      L[wY(56)] !== L && L[wY(2528)] !== L && L[wY(2529)];
      var j, A = 2147483647, N = 36, Q = /^xn--/, D = /[^\x20-\x7E]/, J = /[\x2E\u3002\uFF0E\uFF61]/g, K = {overflow: wY(2530), "not-basic": wY(2531), "invalid-input": wY(2532)}, F = Math[wY(104)], V = String[wY(171)];
      function Z(H0) {
        throw new RangeError(K[H0]);
      }
      function X(H0, H1) {
        var wc = wY;
        for (var H2 = H0[wc(68)], H3 = []; H2--;) H3[H2] = H1(H0[H2]);
        return H3;
      }
      function G(H0, H1) {
        var wy = wY, H2 = H0[wy(615)]("@"), H3 = "";
        return H2[wy(68)] > 1 && (H3 = H2[0] + "@", H0 = H2[1]), H3 + X((H0 = H0[wy(253)](J, "."))[wy(615)]("."), H1)[wy(197)](".");
      }
      function q(H0) {
        var wS = wY;
        for (var H1, H2, H3 = [], H4 = 0, H5 = H0[wS(68)]; H4 < H5;) (H1 = H0[wS(168)](H4++)) >= 55296 && H1 <= 56319 && H4 < H5 ? 56320 == (64512 & (H2 = H0[wS(168)](H4++))) ? H3[wS(167)](((1023 & H1) << 10) + (1023 & H2) + 65536) : (H3[wS(167)](H1), H4--) : H3[wS(167)](H1);
        return H3;
      }
      function E(H0) {
        var wO = wY;
        return X(H0, function (H1) {
          var H2 = "";
          return H1 > 65535 && (H2 += V((H1 -= 65536) >>> 10 & 1023 | 55296), H1 = 56320 | 1023 & H1), H2 + V(H1);
        })[wO(197)]("");
      }
      function R(H0) {
        return H0 - 48 < 10 ? H0 - 22 : H0 - 65 < 26 ? H0 - 65 : H0 - 97 < 26 ? H0 - 97 : N;
      }
      function z(H0, H1, H2) {
        var H3 = 0;
        for (H0 = H2 ? F(H0 / 700) : H0 >> 1, H0 += F(H0 / H1); H0 > 455; H3 += N) H0 = F(H0 / 35);
        return F(H3 + 36 * H0 / (H0 + 38));
      }
      function Y(H0) {
        var L0 = wY, H1, H2, H3, H4, H5, H6, H7, H8, H9, HH, Hh = [], Ha = H0[L0(68)], HW = 0, HM = 128, HC = 72;
        for ((H2 = H0[L0(162)]("-")) < 0 && (H2 = 0), H3 = 0; H3 < H2; ++H3) H0[L0(168)](H3) >= 128 && Z(L0(2533)), Hh[L0(167)](H0[L0(168)](H3));
        for (H4 = H2 > 0 ? H2 + 1 : 0; H4 < Ha;) {
          for (H5 = HW, H6 = 1, H7 = N; H4 >= Ha && Z(L0(2534)), ((H8 = R(H0[L0(168)](H4++))) >= N || H8 > F((A - HW) / H6)) && Z(L0(2535)), HW += H8 * H6, !(H8 < (H9 = H7 <= HC ? 1 : H7 >= HC + 26 ? 26 : H7 - HC)); H7 += N) H6 > F(A / (HH = N - H9)) && Z(L0(2535)), H6 *= HH;
          HC = z(HW - H5, H1 = Hh[L0(68)] + 1, 0 == H5), F(HW / H1) > A - HM && Z(L0(2535)), HM += F(HW / H1), HW %= H1, Hh[L0(655)](HW++, 0, HM);
        }
        return E(Hh);
      }
      function O(H0) {
        var L1 = wY, H1, H2, H3, H4, H5, H6, H7, H8, H9, HH, Hh, Ha, HW, HM, HC, Hg = [];
        for (Ha = (H0 = q(H0))[L1(68)], H1 = 128, H2 = 0, H5 = 72, H6 = 0; H6 < Ha; ++H6) (Hh = H0[H6]) < 128 && Hg[L1(167)](V(Hh));
        for (H3 = H4 = Hg[L1(68)], H4 && Hg[L1(167)]("-"); H3 < Ha;) {
          for (H7 = A, H6 = 0; H6 < Ha; ++H6) (Hh = H0[H6]) >= H1 && Hh < H7 && (H7 = Hh);
          for (H7 - H1 > F((A - H2) / (HW = H3 + 1)) && Z(L1(2535)), H2 += (H7 - H1) * HW, H1 = H7, H6 = 0; H6 < Ha; ++H6) if ((Hh = H0[H6]) < H1 && ++H2 > A && Z(L1(2535)), Hh == H1) {
            for (H8 = H2, H9 = N; !(H8 < (HH = H9 <= H5 ? 1 : H9 >= H5 + 26 ? 26 : H9 - H5)); H9 += N) HC = H8 - HH, HM = N - HH, Hg[L1(167)](V(HH + HC % HM + 22 + 75 * (HH + HC % HM < 26) - 0)), H8 = F(HC / HM);
            Hg[L1(167)](V(H8 + 22 + 75 * (H8 < 26) - 0)), H5 = z(H2, HW, H3 == H4), H2 = 0, ++H3;
          }
          ++H2, ++H1;
        }
        return Hg[L1(197)]("");
      }
      j = {version: wY(2536), ucs2: {decode: q, encode: E}, decode: Y, encode: O, toASCII: function (H0) {
        return G(H0, function (H1) {
          var L2 = h;
          return D[L2(1214)](H1) ? L2(2537) + O(H1) : H1;
        });
      }, toUnicode: function (H0) {
        return G(H0, function (H1) {
          var L3 = h;
          return Q[L3(1214)](H1) ? Y(H1[L3(72)](4)[L3(160)]()) : H1;
        });
      }}, void 0 === (U = function () {
        return j;
      }[wY(43)](W, M, W, C)) || (C[wY(42)] = U);
    }();
  }[L4(43)](this, M(62)(a), M(12)));
}, function (a, W) {
  var L5 = Cv;
  a[L5(42)] = function (M) {
    var L6 = L5;
    return M[L6(2538)] || (M[L6(2539)] = function () {}, M[L6(2540)] = [], M[L6(1322)] || (M[L6(1322)] = []), Object[L6(44)](M, L6(626), {enumerable: true, get: function () {
      return M.l;
    }}), Object[L6(44)](M, "id", {enumerable: true, get: function () {
      return M.i;
    }}), M[L6(2538)] = 1), M;
  };
}, function (a, W, M) {
  "use strict";
  var L7 = Cv;
  a[L7(42)] = {isString: function (C) {
    var L8 = L7;
    return L8(52) == typeof C;
  }, isObject: function (C) {
    var L9 = L7;
    return L9(49) == typeof C && null !== C;
  }, isNull: function (C) {
    return null === C;
  }, isNullOrUndefined: function (C) {
    return null == C;
  }};
}, function (a, W, M) {
  "use strict";
  var LH = Cv;
  W[LH(125)] = W[LH(605)] = M(65), W[LH(89)] = W[LH(966)] = M(66);
}, function (a, W, M) {
  "use strict";
  var La = Cv;
  function C(U, p) {
    var Lh = h;
    return Object[Lh(54)][Lh(55)][Lh(43)](U, p);
  }
  a[La(42)] = function (U, x, B, b) {
    var LW = La;
    x = x || "&", B = B || "=";
    var w = {};
    if (LW(52) != typeof U || 0 === U[LW(68)]) return w;
    var L = /\+/g;
    U = U[LW(615)](x);
    var j = 1e3;
    b && LW(117) == typeof b[LW(2541)] && (j = b[LW(2541)]);
    var A = U[LW(68)];
    j > 0 && A > j && (A = j);
    for (var T = 0; T < A; ++T) {
      var N, Q, D, J, K = U[T][LW(253)](L, LW(2542)), F = K[LW(161)](B);
      F >= 0 ? (N = K[LW(166)](0, F), Q = K[LW(166)](F + 1)) : (N = K, Q = ""), D = decodeURIComponent(N), J = decodeURIComponent(Q), C(w, D) ? g(w[D]) ? w[D][LW(167)](J) : w[D] = [w[D], J] : w[D] = J;
    }
    return w;
  };
  var g = Array[La(60)] || function (U) {
    var LM = La;
    return LM(107) === Object[LM(54)][LM(77)][LM(43)](U);
  };
}, function (W, M, C) {
  "use strict";
  var Lg = Cv;
  var g = function (u) {
    var LC = h;
    switch (typeof u) {
      case LC(52):
        return u;
      case LC(1326):
        return u ? LC(451) : LC(491);
      case LC(117):
        return isFinite(u) ? u : "";
      default:
        return "";
    }
  };
  W[Lg(42)] = function (u, B, b, w) {
    var Lr = Lg;
    return B = B || "&", b = b || "=", null === u && (u = void 0), Lr(49) == typeof u ? p(x(u), function (L) {
      var LU = Lr, j = encodeURIComponent(g(L)) + b;
      return U(u[L]) ? p(u[L], function (A) {
        return j + encodeURIComponent(g(A));
      })[LU(197)](B) : j + encodeURIComponent(g(u[L]));
    })[Lr(197)](B) : w ? encodeURIComponent(g(w)) + b + encodeURIComponent(g(u)) : "";
  };
  var U = Array[Lg(60)] || function (u) {
    var Ln = Lg;
    return Ln(107) === Object[Ln(54)][Ln(77)][Ln(43)](u);
  };
  function p(u, B) {
    var Lp = Lg;
    if (u[Lp(1258)]) return u[Lp(1258)](B);
    for (var o = [], b = 0; b < u[Lp(68)]; b++) o[Lp(167)](B(u[b], b));
    return o;
  }
  var x = Object[Lg(280)] || function (u) {
    var Lx = Lg, B = [];
    for (var o in u) Object[Lx(54)][Lx(55)][Lx(43)](u, o) && B[Lx(167)](o);
    return B;
  };
}, function (a, W, M) {
  !function () {
    var Lu = h, C = M(68), g = M(20)[Lu(140)], U = M(69), p = M(20)[Lu(402)], x = function (B, L) {
      var LB = Lu;
      B[LB(99)] == String ? B = L && LB(152) === L[LB(2543)] ? p[LB(403)](B) : g[LB(403)](B) : U(B) ? B = Array[LB(54)][LB(72)][LB(43)](B, 0) : Array[LB(60)](B) || (B = B[LB(77)]());
      for (var j = C[LB(2544)](B), A = 8 * B[LB(68)], T = 1732584193, N = -271733879, Q = -1732584194, D = 271733878, J = 0; J < j[LB(68)]; J++) j[J] = 16711935 & (j[J] << 8 | j[J] >>> 24) | 4278255360 & (j[J] << 24 | j[J] >>> 8);
      j[A >>> 5] |= 128 << A % 32, j[14 + (A + 64 >>> 9 << 4)] = A;
      var K = x[LB(2545)], F = x[LB(2546)], V = x[LB(2547)], I = x[LB(2548)];
      for (J = 0; J < j[LB(68)]; J += 16) {
        var Z = T, X = N, G = Q, q = D;
        N = I(N = I(N = I(N = I(N = V(N = V(N = V(N = V(N = F(N = F(N = F(N = F(N = K(N = K(N = K(N = K(N, Q = K(Q, D = K(D, T = K(T, N, Q, D, j[J + 0], 7, -680876936), N, Q, j[J + 1], 12, -389564586), T, N, j[J + 2], 17, 606105819), D, T, j[J + 3], 22, -1044525330), Q = K(Q, D = K(D, T = K(T, N, Q, D, j[J + 4], 7, -176418897), N, Q, j[J + 5], 12, 1200080426), T, N, j[J + 6], 17, -1473231341), D, T, j[J + 7], 22, -45705983), Q = K(Q, D = K(D, T = K(T, N, Q, D, j[J + 8], 7, 1770035416), N, Q, j[J + 9], 12, -1958414417), T, N, j[J + 10], 17, -42063), D, T, j[J + 11], 22, -1990404162), Q = K(Q, D = K(D, T = K(T, N, Q, D, j[J + 12], 7, 1804603682), N, Q, j[J + 13], 12, -40341101), T, N, j[J + 14], 17, -1502002290), D, T, j[J + 15], 22, 1236535329), Q = F(Q, D = F(D, T = F(T, N, Q, D, j[J + 1], 5, -165796510), N, Q, j[J + 6], 9, -1069501632), T, N, j[J + 11], 14, 643717713), D, T, j[J + 0], 20, -373897302), Q = F(Q, D = F(D, T = F(T, N, Q, D, j[J + 5], 5, -701558691), N, Q, j[J + 10], 9, 38016083), T, N, j[J + 15], 14, -660478335), D, T, j[J + 4], 20, -405537848), Q = F(Q, D = F(D, T = F(T, N, Q, D, j[J + 9], 5, 568446438), N, Q, j[J + 14], 9, -1019803690), T, N, j[J + 3], 14, -187363961), D, T, j[J + 8], 20, 1163531501), Q = F(Q, D = F(D, T = F(T, N, Q, D, j[J + 13], 5, -1444681467), N, Q, j[J + 2], 9, -51403784), T, N, j[J + 7], 14, 1735328473), D, T, j[J + 12], 20, -1926607734), Q = V(Q, D = V(D, T = V(T, N, Q, D, j[J + 5], 4, -378558), N, Q, j[J + 8], 11, -2022574463), T, N, j[J + 11], 16, 1839030562), D, T, j[J + 14], 23, -35309556), Q = V(Q, D = V(D, T = V(T, N, Q, D, j[J + 1], 4, -1530992060), N, Q, j[J + 4], 11, 1272893353), T, N, j[J + 7], 16, -155497632), D, T, j[J + 10], 23, -1094730640), Q = V(Q, D = V(D, T = V(T, N, Q, D, j[J + 13], 4, 681279174), N, Q, j[J + 0], 11, -358537222), T, N, j[J + 3], 16, -722521979), D, T, j[J + 6], 23, 76029189), Q = V(Q, D = V(D, T = V(T, N, Q, D, j[J + 9], 4, -640364487), N, Q, j[J + 12], 11, -421815835), T, N, j[J + 15], 16, 530742520), D, T, j[J + 2], 23, -995338651), Q = I(Q, D = I(D, T = I(T, N, Q, D, j[J + 0], 6, -198630844), N, Q, j[J + 7], 10, 1126891415), T, N, j[J + 14], 15, -1416354905), D, T, j[J + 5], 21, -57434055), Q = I(Q, D = I(D, T = I(T, N, Q, D, j[J + 12], 6, 1700485571), N, Q, j[J + 3], 10, -1894986606), T, N, j[J + 10], 15, -1051523), D, T, j[J + 1], 21, -2054922799), Q = I(Q, D = I(D, T = I(T, N, Q, D, j[J + 8], 6, 1873313359), N, Q, j[J + 15], 10, -30611744), T, N, j[J + 6], 15, -1560198380), D, T, j[J + 13], 21, 1309151649), Q = I(Q, D = I(D, T = I(T, N, Q, D, j[J + 4], 6, -145523070), N, Q, j[J + 11], 10, -1120210379), T, N, j[J + 2], 15, 718787259), D, T, j[J + 9], 21, -343485551), T = T + Z >>> 0, N = N + X >>> 0, Q = Q + G >>> 0, D = D + q >>> 0;
      }
      return C[LB(2549)]([T, N, Q, D]);
    };
    x[Lu(2545)] = function (u, B, b, w, L, j, A) {
      var T = u + (B & b | ~B & w) + (L >>> 0) + A;
      return (T << j | T >>> 32 - j) + B;
    }, x[Lu(2546)] = function (u, B, b, w, L, j, A) {
      var T = u + (B & w | b & ~w) + (L >>> 0) + A;
      return (T << j | T >>> 32 - j) + B;
    }, x[Lu(2547)] = function (u, B, b, w, L, j, A) {
      var T = u + (B ^ b ^ w) + (L >>> 0) + A;
      return (T << j | T >>> 32 - j) + B;
    }, x[Lu(2548)] = function (u, B, b, w, L, j, A) {
      var T = u + (b ^ (B | ~w)) + (L >>> 0) + A;
      return (T << j | T >>> 32 - j) + B;
    }, x[Lu(2550)] = 16, x[Lu(2551)] = 16, a[Lu(42)] = function (u, B) {
      var Lo = Lu;
      if (null == u) throw new Error(Lo(2552) + u);
      var o = C[Lo(2553)](x(u, B));
      return B && B[Lo(2554)] ? o : B && B[Lo(2555)] ? p[Lo(404)](o) : C[Lo(2556)](o);
    };
  }();
}, function (a, W) {
  !function () {
    var Lb = h, M = Lb(1244), C = {rotl: function (g, r) {
      return g << r | g >>> 32 - r;
    }, rotr: function (g, r) {
      return g << 32 - r | g >>> r;
    }, endian: function (g) {
      var Lw = Lb;
      if (g[Lw(99)] == Number) return 16711935 & C[Lw(2557)](g, 8) | 4278255360 & C[Lw(2557)](g, 24);
      for (var r = 0; r < g[Lw(68)]; r++) g[r] = C[Lw(2549)](g[r]);
      return g;
    }, randomBytes: function (g) {
      var LL = Lb;
      for (var r = []; g > 0; g--) r[LL(167)](Math[LL(104)](256 * Math[LL(1294)]()));
      return r;
    }, bytesToWords: function (g) {
      var Lj = Lb;
      for (var r = [], U = 0, p = 0; U < g[Lj(68)]; U++, p += 8) r[p >>> 5] |= g[U] << 24 - p % 32;
      return r;
    }, wordsToBytes: function (g) {
      var Ls = Lb;
      for (var r = [], U = 0; U < 32 * g[Ls(68)]; U += 8) r[Ls(167)](g[U >>> 5] >>> 24 - U % 32 & 255);
      return r;
    }, bytesToHex: function (g) {
      var LA = Lb;
      for (var r = [], U = 0; U < g[LA(68)]; U++) r[LA(167)]((g[U] >>> 4)[LA(77)](16)), r[LA(167)]((15 & g[U])[LA(77)](16));
      return r[LA(197)]("");
    }, hexToBytes: function (g) {
      var LT = Lb;
      for (var r = [], U = 0; U < g[LT(68)]; U += 2) r[LT(167)](parseInt(g[LT(166)](U, 2), 16));
      return r;
    }, bytesToBase64: function (g) {
      var Li = Lb;
      for (var U = [], p = 0; p < g[Li(68)]; p += 3) for (var x = g[p] << 16 | g[p + 1] << 8 | g[p + 2], u = 0; u < 4; u++) 8 * p + 6 * u <= 8 * g[Li(68)] ? U[Li(167)](M[Li(1301)](x >>> 6 * (3 - u) & 63)) : U[Li(167)]("=");
      return U[Li(197)]("");
    }, base64ToBytes: function (g) {
      var LN = Lb;
      g = g[LN(253)](/[^A-Z0-9+\/]/gi, "");
      for (var U = [], p = 0, x = 0; p < g[LN(68)]; x = ++p % 4) 0 != x && U[LN(167)]((M[LN(161)](g[LN(1301)](p - 1)) & Math[LN(102)](2, -2 * x + 8) - 1) << 2 * x | M[LN(161)](g[LN(1301)](p)) >>> 6 - 2 * x);
      return U;
    }};
    a[Lb(42)] = C;
  }();
}, function (a, W) {
  var Ll = Cv;
  function M(C) {
    var Lt = h;
    return !!C[Lt(99)] && Lt(149) == typeof C[Lt(99)][Lt(58)] && C[Lt(99)][Lt(58)](C);
  }
  a[Ll(42)] = function (C) {
    var LD = Ll;
    return null != C && (M(C) || function (g) {
      var LQ = h;
      return LQ(149) == typeof g[LQ(223)] && LQ(149) == typeof g[LQ(72)] && M(g[LQ(72)](0, 0));
    }(C) || !!C[LD(182)]);
  };
}, function (a, W) {
  var LJ = Cv;
  a[LJ(42)] = function (M, C, g, U, p, x, u, B, b) {
    var Lf = LJ;
    this[Lf(1116)] = [{id: 0, src: Lf(2558), killScore: 150, health: 500, weightM: 0.8, speed: 0.00095, turnSpeed: 0.001, scale: 72, drop: [Lf(380), 50]}, {id: 1, src: Lf(2559), killScore: 200, health: 800, weightM: 0.6, speed: 0.00085, turnSpeed: 0.001, scale: 72, drop: [Lf(380), 80]}, {id: 2, name: Lf(2560), src: Lf(2561), hostile: true, dmg: 20, killScore: 1e3, health: 1800, weightM: 0.5, speed: 0.00094, turnSpeed: 0.00074, scale: 78, viewRange: 800, chargePlayer: true, drop: [Lf(380), 100]}, {id: 3, name: Lf(2562), src: Lf(2563), hostile: true, dmg: 20, killScore: 2e3, health: 2800, weightM: 0.45, speed: 0.001, turnSpeed: 0.0008, scale: 90, viewRange: 900, chargePlayer: true, drop: [Lf(380), 400]}, {id: 4, name: Lf(2564), src: Lf(2565), hostile: true, dmg: 8, killScore: 500, health: 300, weightM: 0.45, speed: 0.001, turnSpeed: 0.002, scale: 84, viewRange: 800, chargePlayer: true, drop: [Lf(380), 200]}, {id: 5, name: Lf(2566), src: Lf(2567), dmg: 8, killScore: 2e3, noTrap: true, health: 300, weightM: 0.2, speed: 0.0018, turnSpeed: 0.006, scale: 70, drop: [Lf(380), 100]}, {id: 6, name: Lf(2568), nameScale: 50, src: Lf(2569), hostile: true, dontRun: true, fixedSpawn: true, spawnDelay: 6e4, noTrap: true, colDmg: 100, dmg: 40, killScore: 8e3, health: 18e3, weightM: 0.4, speed: 0.0007, turnSpeed: 0.01, scale: 80, spriteMlt: 1.8, leapForce: 0.9, viewRange: 1e3, hitRange: 210, hitDelay: 1e3, chargePlayer: true, drop: [Lf(380), 100]}, {id: 7, name: Lf(2570), hostile: true, nameScale: 35, src: Lf(2571), fixedSpawn: true, spawnDelay: 12e4, colDmg: 200, killScore: 5e3, health: 2e4, weightM: 0.1, speed: 0, turnSpeed: 0, scale: 70, spriteMlt: 1}, {id: 8, name: Lf(2572), src: Lf(2573), hostile: true, fixedSpawn: true, dontRun: true, hitScare: 4, spawnDelay: 3e4, noTrap: true, nameScale: 35, dmg: 10, colDmg: 100, killScore: 3e3, health: 7e3, weightM: 0.45, speed: 0.0015, turnSpeed: 0.002, scale: 90, viewRange: 800, chargePlayer: true, drop: [Lf(380), 1e3]}], this[Lf(1115)] = function (w, L, j, A) {
      var LK = Lf;
      for (var T, N = 0; N < M[LK(68)]; ++N) if (!M[N][LK(674)]) {
        T = M[N];
        break;
      }
      return T || (T = new C(M[LK(68)], p, g, U, u, x, B, b), M[LK(167)](T)), T[LK(83)](w, L, j, A, this[LK(1116)][A]), T;
    };
  };
}, function (a, W) {
  var Ld = Cv, M = 2 * Math.PI;
  a[Ld(42)] = function (C, g, U, p, x, B, b, w) {
    var LF = Ld;
    this[LF(654)] = C, this[LF(2416)] = true, this[LF(2574)] = x[LF(1060)](0, B[LF(328)][LF(68)] - 1), this[LF(83)] = function (T, N, Q, D, J) {
      var LV = LF;
      this.x = T, this.y = N, this[LV(795)] = J[LV(2575)] ? T : null, this[LV(793)] = J[LV(2575)] ? N : null, this[LV(1452)] = 0, this[LV(1454)] = 0, this[LV(1031)] = 0, this[LV(1016)] = Q, this[LV(1035)] = 0, this[LV(583)] = D, this[LV(444)] = J[LV(444)], J[LV(94)] && (this[LV(94)] = J[LV(94)]), this[LV(1453)] = J[LV(1453)], this[LV(1112)] = J[LV(1112)], this[LV(2576)] = J[LV(2576)], this[LV(1347)] = J[LV(1347)], this[LV(675)] = J[LV(675)], this[LV(1182)] = J[LV(983)], this[LV(2577)] = J[LV(2577)], this[LV(983)] = this[LV(1182)], this[LV(2578)] = J[LV(2578)], this[LV(2579)] = J[LV(2579)], this[LV(2580)] = J[LV(2580)], this[LV(1122)] = J[LV(1122)], this[LV(2581)] = J[LV(2581)], this[LV(2582)] = J[LV(2582)], this[LV(2583)] = J[LV(2583)], this[LV(2584)] = J[LV(2584)], this[LV(2585)] = J[LV(2585)], this[LV(1118)] = J[LV(1118)], this[LV(1170)] = J[LV(1170)], this[LV(1458)] = J[LV(1458)], this[LV(1451)] = J[LV(1451)], this[LV(2586)] = J[LV(2586)], this[LV(2587)] = 0, this[LV(2588)] = 1e3, this[LV(2589)] = 0, this[LV(1537)] = 0, this[LV(674)] = true, this[LV(571)] = true, this[LV(2590)] = null, this[LV(2591)] = null, this[LV(1417)] = {};
    };
    var L = 0;
    this[LF(676)] = function (N) {
      var Lm = LF;
      if (this[Lm(674)]) {
        if (this[Lm(2592)]) return this[Lm(2592)] -= N, void (this[Lm(2592)] <= 0 && (this[Lm(2592)] = 0, this.x = this[Lm(795)] || x[Lm(1060)](0, B[Lm(399)]), this.y = this[Lm(793)] || x[Lm(1060)](0, B[Lm(399)])));
        (L -= N) <= 0 && (this[Lm(1417)][Lm(1122)] && (this[Lm(1355)](-this[Lm(1417)][Lm(1122)], this[Lm(1417)][Lm(1418)]), this[Lm(1417)][Lm(1419)] -= 1, this[Lm(1417)][Lm(1419)] <= 0 && (this[Lm(1417)][Lm(1122)] = 0)), L = 1e3);
        var Q = false, D = 1;
        if (!this[Lm(1031)] && !this[Lm(1455)] && this.y >= B[Lm(399)] / 2 - B[Lm(388)] / 2 && this.y <= B[Lm(399)] / 2 + B[Lm(388)] / 2 && (D = 0.33, this[Lm(1452)] += B[Lm(390)] * N), this[Lm(1455)]) this[Lm(1452)] = 0, this[Lm(1454)] = 0; else {
          if (this[Lm(2588)] > 0) {
            if (this[Lm(2588)] -= N, this[Lm(2588)] <= 0) {
              if (this[Lm(2578)]) {
                for (var J, K, F, V = 0; V < U[Lm(68)]; ++V) !U[V][Lm(571)] || U[V][Lm(1456)] && U[V][Lm(1456)][Lm(2593)] || (F = x[Lm(1161)](this.x, this.y, U[V].x, U[V].y)) <= this[Lm(2579)] && (!J || F < K) && (K = F, J = U[V]);
                J ? (this[Lm(2591)] = J, this[Lm(2589)] = x[Lm(1060)](8e3, 12e3)) : (this[Lm(2589)] = x[Lm(1060)](1e3, 2e3), this[Lm(1537)] = x[Lm(1053)](-Math.PI, Math.PI));
              } else this[Lm(2589)] = x[Lm(1060)](4e3, 1e4), this[Lm(1537)] = x[Lm(1053)](-Math.PI, Math.PI);
            }
          } else {
            if (this[Lm(2589)] > 0) {
              var Z = this[Lm(1112)] * D;
              if (this[Lm(2590)] && this[Lm(2590)][Lm(674)] && (!this[Lm(2590)][Lm(1168)] || this[Lm(2590)][Lm(571)]) ? (this[Lm(1537)] = x[Lm(1162)](this.x, this.y, this[Lm(2590)].x, this[Lm(2590)].y), Z *= 1.42) : this[Lm(2591)] && this[Lm(2591)][Lm(571)] && (this[Lm(1537)] = x[Lm(1162)](this[Lm(2591)].x, this[Lm(2591)].y, this.x, this.y), Z *= 1.75, Q = true), this[Lm(2587)] && (Z *= 0.3), this[Lm(1016)] != this[Lm(1537)]) {
                this[Lm(1016)] %= M;
                var X = (this[Lm(1016)] - this[Lm(1537)] + M) % M, G = Math[Lm(170)](Math[Lm(103)](X - M), X, this[Lm(1347)] * N), q = X - Math.PI >= 0 ? 1 : -1;
                this[Lm(1016)] += q * G + M;
              }
              this[Lm(1016)] %= M, this[Lm(1452)] += Z * N * Math[Lm(1026)](this[Lm(1016)]), this[Lm(1454)] += Z * N * Math[Lm(1025)](this[Lm(1016)]), this[Lm(2589)] -= N, this[Lm(2589)] <= 0 && (this[Lm(2590)] = null, this[Lm(2591)] = null, this[Lm(2588)] = this[Lm(2581)] ? 1500 : x[Lm(1060)](1500, 6e3));
            }
          }
        }
        this[Lm(1031)] = 0, this[Lm(1455)] = false;
        var R = x[Lm(1161)](0, 0, this[Lm(1452)] * N, this[Lm(1454)] * N), z = Math[Lm(170)](4, Math[Lm(268)](1, Math[Lm(1121)](R / 40))), Y = 1 / z;
        for (V = 0; V < z; ++V) {
          this[Lm(1452)] && (this.x += this[Lm(1452)] * N * Y), this[Lm(1454)] && (this.y += this[Lm(1454)] * N * Y), H5 = g[Lm(1447)](this.x, this.y, this[Lm(675)]);
          for (var O = 0; O < H5[Lm(68)]; ++O) for (var H0 = 0; H0 < H5[O][Lm(68)]; ++H0) H5[O][H0][Lm(674)] && g[Lm(1450)](this, H5[O][H0], Y);
        }
        var H1, H2, H3, H4 = false;
        if (this[Lm(2587)] > 0 && (this[Lm(2587)] -= N, this[Lm(2587)] <= 0)) {
          H4 = true, this[Lm(2587)] = 0, this[Lm(2577)] && !x[Lm(1060)](0, 2) && (this[Lm(1452)] += this[Lm(2577)] * Math[Lm(1026)](this[Lm(1016)]), this[Lm(1454)] += this[Lm(2577)] * Math[Lm(1025)](this[Lm(1016)]));
          for (var H5 = g[Lm(1447)](this.x, this.y, this[Lm(2583)]), H6 = 0; H6 < H5[Lm(68)]; ++H6) for (O = 0; O < H5[H6][Lm(68)]; ++O) (H1 = H5[H6][O])[Lm(983)] && (H2 = x[Lm(1161)](this.x, this.y, H1.x, H1.y)) < H1[Lm(675)] + this[Lm(2583)] && (H1[Lm(1355)](5 * -this[Lm(1122)]) && g[Lm(1443)](H1), g[Lm(1444)](H1, x[Lm(1162)](this.x, this.y, H1.x, H1.y)));
          for (O = 0; O < U[Lm(68)]; ++O) U[O][Lm(1445)](this) && w[Lm(612)](U[O].id, "aa", this[Lm(654)]);
        }
        if (Q || H4) {
          for (V = 0; V < U[Lm(68)]; ++V) (H1 = U[V]) && H1[Lm(571)] && (H2 = x[Lm(1161)](this.x, this.y, H1.x, H1.y), this[Lm(2583)] ? !this[Lm(2587)] && H2 <= this[Lm(2583)] + H1[Lm(675)] && (H4 ? (H3 = x[Lm(1162)](H1.x, H1.y, this.x, this.y), H1[Lm(1355)](-this[Lm(1122)]), H1[Lm(1452)] += 0.6 * Math[Lm(1026)](H3), H1[Lm(1454)] += 0.6 * Math[Lm(1025)](H3), this[Lm(2590)] = null, this[Lm(2591)] = null, this[Lm(2588)] = 3e3, this[Lm(2587)] = x[Lm(1060)](0, 2) ? 0 : 600) : this[Lm(2587)] = this[Lm(2584)]) : H2 <= this[Lm(675)] + H1[Lm(675)] && (H3 = x[Lm(1162)](H1.x, H1.y, this.x, this.y), H1[Lm(1355)](-this[Lm(1122)]), H1[Lm(1452)] += 0.55 * Math[Lm(1026)](H3), H1[Lm(1454)] += 0.55 * Math[Lm(1025)](H3)));
        }
        this[Lm(1452)] && (this[Lm(1452)] *= Math[Lm(102)](B[Lm(313)], N)), this[Lm(1454)] && (this[Lm(1454)] *= Math[Lm(102)](B[Lm(313)], N));
        var H7 = this[Lm(675)];
        this.x - H7 < 0 ? (this.x = H7, this[Lm(1452)] = 0) : this.x + H7 > B[Lm(399)] && (this.x = B[Lm(399)] - H7, this[Lm(1452)] = 0), this.y - H7 < 0 ? (this.y = H7, this[Lm(1454)] = 0) : this.y + H7 > B[Lm(399)] && (this.y = B[Lm(399)] - H7, this[Lm(1454)] = 0);
      }
    }, this[LF(1445)] = function (T) {
      var Lk = LF;
      if (!T) return false;
      if (T[Lk(1456)] && T[Lk(1456)][Lk(1571)] && T[Lk(1535)] >= T[Lk(1456)][Lk(1571)]) return false;
      var N = Math[Lk(103)](T.x - this.x) - T[Lk(675)], Q = Math[Lk(103)](T.y - this.y) - T[Lk(675)];
      return N <= B[Lk(281)] / 2 * 1.3 && Q <= B[Lk(282)] / 2 * 1.3;
    };
    var j = 0, A = 0;
    this[LF(1032)] = function (T) {
      var LI = LF;
      this[LI(1532)] > 0 && (this[LI(1532)] -= T, this[LI(1532)] <= 0 ? (this[LI(1532)] = 0, this[LI(1035)] = 0, j = 0, A = 0) : 0 == A ? (j += T / (this[LI(1533)] * B[LI(309)]), this[LI(1035)] = x[LI(1295)](0, this[LI(1538)], Math[LI(170)](1, j)), j >= 1 && (j = 1, A = 1)) : (j -= T / (this[LI(1533)] * (1 - B[LI(309)])), this[LI(1035)] = x[LI(1295)](0, this[LI(1538)], Math[LI(268)](0, j))));
    }, this[LF(1030)] = function () {
      var LZ = LF;
      this[LZ(1532)] = this[LZ(1533)] = 600, this[LZ(1538)] = 0.8 * Math.PI, j = 0, A = 0;
    }, this[LF(1355)] = function (T, N, Q) {
      var LX = LF;
      if (this[LX(674)] && (this[LX(983)] += T, Q && (this[LX(2585)] && !x[LX(1060)](0, this[LX(2585)]) ? (this[LX(2590)] = Q, this[LX(2588)] = 0, this[LX(2589)] = 2e3) : this[LX(2581)] && this[LX(2578)] && Q[LX(1168)] ? (this[LX(2591)] = Q, this[LX(2588)] = 0, this[LX(2589)] = 8e3) : this[LX(2582)] || (this[LX(2590)] = Q, this[LX(2588)] = 0, this[LX(2589)] = 2e3)), T < 0 && this[LX(2583)] && x[LX(1060)](0, 1) && (this[LX(2587)] = 500), N && N[LX(1445)](this) && T < 0 && w[LX(612)](N.id, "t", Math[LX(1121)](this.x), Math[LX(1121)](this.y), Math[LX(1121)](-T), 1), this[LX(983)] <= 0 && (this[LX(2586)] ? (this[LX(2592)] = this[LX(2586)], this.x = -1000000, this.y = -1000000) : (this.x = this[LX(795)] || x[LX(1060)](0, B[LX(399)]), this.y = this[LX(793)] || x[LX(1060)](0, B[LX(399)])), this[LX(983)] = this[LX(1182)], this[LX(2590)] = null, N && (b(N, this[LX(2576)]), this[LX(2580)])))) {
        for (var D = 0; D < this[LX(2580)][LX(68)];) N[LX(1551)](B[LX(378)][LX(161)](this[LX(2580)][D]), this[LX(2580)][D + 1]), D += 2;
      }
    };
  };
}]);
