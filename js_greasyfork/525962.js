// ==UserScript==
// @name         NOORIE
// @run-at       document-start
// @namespace    CheatNite (EXCLUSIVE)
// @icon         https://cdn.discordapp.com/icons/1134569036043276439/2664d328e7ccce265d3a473e05adc96c.webp
// @version      3.76
// @description  CraftNite cheat client. Credits 99% towelgreen and Jhon Pérgon for external API-request. U can't bann with this cheat.
// @author       KeineAhnung4u
// @match        https://craftnite.io/*
// @run-at       document-start
// @license      GPL-3.0
// @grant        GM_addStyle
// @icon         file:///C:/Users/21sai/Downloads/pngegg%20(8).png
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525962/NOORIE.user.js
// @updateURL https://update.greasyfork.org/scripts/525962/NOORIE.meta.js
// ==/UserScript==

 
window.onbeforeunload = function() {
    return "Are you sure you want to leave this page?";
};


const observer = new MutationObserver(() => {
  // Your code to run after page load
});
observer.observe(document.body, { childList: true, subtree: true });

 
const yoClasses = ['RPCMatchRemainingTime', 'RPCa822erScore', 'CMDChunkBuffered', 'a201', 'a202', 'a199', 'a200', 'a169', 'a130', 'a119', 'a129', 'a128', 'a186', 'a222ingSoon', 'a124', 'a125', 'a126', 'RPCEndMatch', 'a188', 'a236', 'a189', 'a190', 'a191', 'a192', 'a193', 'a175', 'a194', 'a234', 'a171', 'a121', 'a172', 'a173', 'a174', 'a195', 'a180', 'a225', 'a226', 'a227', 'a228', 'a117', 'a118', 'a222']
const blocks = {"random": "random", "air":0,"stone":256,"stone_granite":257,"stone_granite_smooth":258,"stone_diorite":259,"stone_diorite_smooth":260,"stone_andesite":261,"stone_andesite_smooth":262,"grass":512,"dirt":770,"coarse_dirt":769,"cobblestone":1024,"planks_oak":1280,"planks_spruce":1281,"planks_birch":1282,"planks_jungle":1283,"planks_acacia":1284,"planks_big_oak":1285,"sapling_oak":1536,"sapling_spruce":1537,"sapling_birch":1538,"sapling_jungle":1539,"sapling_acacia":1540,"sapling_roofed_oak":1541,"bedrock":1792,"flowing_water":2048,"water":2304,"flowing_lava":2560,"lava":2816,"sand":3072,"red_sand":3073,"gravel":3328,"gold_ore":3584,"iron_ore":3840,"coal_ore":4096,"log_oak":4352,"log_spruce":4353,"log_birch":4354,"log_jungle":4355,"leaves_oak":4608,"leaves_spruce":4609,"leaves_birch":4610,"leaves_jungle":4611,"sponge":4864,"sponge_wet":4865,"glass":5120,"lapis_ore":5376,"lapis_block":5632,"dispenser":5888,"sandstone_normal":6144,"sandstone_carved":6145,"sandstone_smooth":6146,"noteblock":6400,"bed":6656,"golden_rail":6912,"detector_rail":7168,"sticky_piston":7424,"web":7680,"double_plant_grass":7936,"fern":7938,"deadbush":8192,"piston":8448,"piston_head":8704,"wool_colored_white":8960,"wool_colored_orange":8961,"wool_colored_magenta":8962,"wool_colored_light_blue":8963,"wool_colored_yellow":8964,"wool_colored_lime":8965,"wool_colored_pink":8966,"wool_colored_gray":8967,"wool_colored_silver":8968,"wool_colored_cyan":8969,"wool_colored_purple":8970,"wool_colored_blue":8971,"wool_colored_brown":8972,"wool_colored_green":8973,"wool_colored_red":8974,"wool_colored_black":8975,"piston_extension":9216,"yellow_flower":9472,"flower_rose":9728,"flower_blue_orchid":9729,"flower_allium":9730,"flower_houstonia":9731,"flower_tulip_red":9732,"flower_tulip_orange":9733,"flower_tulip_white":9734,"flower_tulip_pink":9735,"flower_oxeye_daisy":9736,"brown_mushroom":9984,"red_mushroom":10240,"gold_block":10496,"iron_block":10752,"double_stone_slab":11008,"brick":11012,"stonebrick":11013,"nether_brick":11014,"quartz_block":39681,"stone_slab":11278,"quartz_block_chiseled":11023,"sandstone_top":11273,"quartz_block_top":11279,"brick_block":11520,"tnt":11777,"bookshelf":12032,"mossy_cobblestone":12288,"obsidian":12544,"torch":12804,"fire":13056,"mob_spawner":13312,"oak_stairs":13568,"chest":13824,"redstone_wire":14080,"diamond_ore":14336,"diamond_block":14592,"crafting_table":14848,"wheat":15104,"farmland":15360,"furnace":15616,"lit_furnace":15872,"standing_sign":16128,"wooden_door":16384,"ladder":16640,"rail":16896,"stone_stairs":17152,"wall_sign":17408,"lever":17664,"stone_pressure_plate":17920,"iron_door":18176,"wooden_pressure_plate":18432,"redstone_ore":18688,"lit_redstone_ore":18944,"unlit_redstone_torch":19204,"redstone_torch":19460,"stone_button":19712,"snow_layer":19968,"ice":20224,"snow":20480,"cactus":20736,"clay":20992,"reeds":21248,"jukebox":21505,"fence":21760,"pumpkin":22016,"netherrack":22272,"soul_sand":22528,"glowstone":22784,"portal":23040,"lit_pumpkin":23296,"cake":23552,"unpowered_repeater":23808,"powered_repeater":24064,"glass_white":24320,"glass_orange":24321,"glass_magenta":24322,"glass_light_blue":24323,"glass_yellow":24324,"glass_lime":24325,"glass_pink":24326,"glass_gray":24327,"stained_glass":24328,"glass_cyan":24329,"glass_purple":24330,"glass_blue":24331,"glass_brown":24332,"glass_green":24333,"glass_red":24334,"glass_black":24335,"trapdoor":24576,"monster_egg":24837,"stonebrick_mossy":25089,"stonebrick_cracked":25090,"stonebrick_carved":25091,"brown_mushroom_block":25344,"red_mushroom_block":25600,"iron_bars":25856,"glass_pane":26112,"melon_block":26368,"pumpkin_stem":26624,"melon_stem":26880,"vine":27136,"fence_gate":27392,"brick_stairs":27648,"stone_brick_stairs":27904,"mycelium":28160,"waterlily":28416,"nether_brick_fence":28928,"nether_brick_stairs":29184,"nether_wart":29440,"enchanting_table":29696,"brewing_stand":29952,"cauldron":30208,"end_portal":30464,"end_portal_frame":30720,"end_stone":30976,"dragon_egg":31232,"redstone_lamp":31488,"lit_redstone_lamp":31744,"double_wooden_slab":32000,"wooden_slab":32256,"cocoa":32512,"sandstone_stairs":32768,"emerald_ore":33024,"ender_chest":33280,"tripwire_hook":33536,"tripwire":33792,"emerald_block":34048,"spruce_stairs":34304,"birch_stairs":34560,"jungle_stairs":34816,"command_block":35072,"beacon":35328,"cobblestone_wall":35584,"cobblestone_mossy":35585,"flower_pot":35840,"carrots":36096,"potatoes":36352,"wooden_button":36608,"skull":36864,"anvil":37120,"trapped_chest":37376,"light_weighted_pressure_plate":37632,"heavy_weighted_pressure_plate":37888,"unpowered_comparator":38144,"powered_comparator":38400,"daylight_detector":38656,"redstone_block":38912,"quartz_ore":39168,"hopper":39424,"quartz_block_lines":39682,"quartz_stairs":39936,"activator_rail":40192,"dropper":40448,"hardened_clay_stained_white":40704,"hardened_clay_stained_orange":40705,"hardened_clay_stained_magenta":40706,"hardened_clay_stained_light_blue":40707,"hardened_clay_stained_yellow":40708,"hardened_clay_stained_lime":40709,"hardened_clay_stained_pink":40710,"hardened_clay_stained_gray":40711,"hardened_clay_stained_silver":40712,"hardened_clay_stained_cyan":40713,"hardened_clay_stained_purple":40714,"hardened_clay_stained_blue":40715,"hardened_clay_stained_brown":40716,"hardened_clay_stained_green":40717,"hardened_clay_stained_red":40718,"hardened_clay_stained_black":40719,"stained_glass_pane":40960,"leaves_acacia":41216,"leaves_big_oak":41217,"log2":41473,"acacia_stairs":41728,"dark_oak_stairs":41984,"slime":42240,"barrier":42496,"iron_trapdoor":42752,"prismarine_rough":43008,"prismarine_bricks":43009,"prismarine_dark":43010,"sea_lantern":43264,"hay_block":43520,"carpet":43791,"hardened_clay":44032,"coal_block":44288,"packed_ice":44544,"double_plant":44800,"double_plant_syringa_top":44801,"double_plant_paeonia_top":44805,"standing_banner":45056,"wall_banner":45312,"daylight_detector_inverted":45568,"red_sandstone_normal":45824,"red_sandstone_carved":45825,"red_sandstone_smooth":45826,"red_sandstone_stairs":46080,"double_stone_slab2":46336,"stone_slab2":46592,"spruce_fence_gate":46848,"birch_fence_gate":47104,"jungle_fence_gate":47360,"dark_oak_fence_gate":47616,"acacia_fence_gate":47872,"spruce_fence":48128,"birch_fence":48384,"jungle_fence":48640,"dark_oak_fence":48896,"acacia_fence":49152,"spruce_door":49408,"birch_door":49664,"jungle_door":49920,"acacia_door":50176,"dark_oak_door":50432,"end_rod":50688,"chorus_plant":50944,"chorus_flower":51200,"purpur_block":51456,"purpur_pillar":51712,"purpur_stairs":51968,"purpur_double_slab":52224,"purpur_slab":52480,"end_bricks":52736,"beetroots":52992,"grass_path":53248,"end_gateway":53504,"repeating_command_block":53760,"chain_command_block":54016,"frosted_ice":54272,"magma":54528,"nether_wart_block":54784,"red_nether_brick":55040,"bone_block":55296,"item-snowball-blue":55781,"item-tnt-yellow":55782,"item-woodplank-grey":55783,"item-stoneball-grey":55784,"item-stairs-grey":55785,"item-pistol-grey":55786,"item-pickaxe-grey":55787,"item-uri-yellow":55788,"item-uri-purple":55789,"item-uri-blue":55790,"item-uri-green":55791,"item-uri-grey":55792,"item-ak47-yellow":55793,"item-ak47-purple":55794,"item-ak47-blue":55795,"item-ak47-green":55796,"item-ak47-grey":55797,"item-shotgun-yellow":55798,"item-shotgun-purple":55799,"item-shotgun-blue":55800,"item-shotgun-green":55801,"item-shotgun-grey":55802,"item-sniper-yellow":55803,"item-sniper-purple":55804,"item-sniper-blue":55805,"item-sniper-green":55806,"item-sniper-grey":55807,"observer":55808,"white_shulker_box":56064,"orange_shulker_box":56320,"magenta_shulker_box":56576,"light_blue_shulker_box":56832,"yellow_shulker_box":57088,"lime_shulker_box":57344,"pink_shulker_box":57600,"gray_shulker_box":57856,"light_gray_shulker_box":58112,"cyan_shulker_box":58368,"purple_shulker_box":58624,"blue_shulker_box":58880,"brown_shulker_box":59136,"green_shulker_box":59392,"red_shulker_box":59648,"black_shulker_box":59904,"white_glazed_terracotta":60160,"orange_glazed_terracotta":60416,"magenta_glazed_terracotta":60672,"light_blue_glazed_terracotta":60928,"yellow_glazed_terracotta":61184,"lime_glazed_terracotta":61440,"pink_glazed_terracotta":61696,"gray_glazed_terracotta":61952,"light_gray_glazed_terracotta":62208,"cyan_glazed_terracotta":62464,"purple_glazed_terracotta":62720,"blue_glazed_terracotta":62976,"brown_glazed_terracotta":63232,"green_glazed_terracotta":63488,"red_glazed_terracotta":63744,"black_glazed_terracotta":64000,"concrete_white":64256,"concrete_orange":64257,"concrete_magenta":64258,"concrete_light_blue":64259,"concrete_yellow":64260,"concrete_lime":64261,"concrete_pink":64262,"concrete_gray":64263,"concrete_silver":64264,"concrete_cyan":64265,"concrete_purple":64266,"concrete_blue":64267,"concrete_brown":64268,"concrete_green":64269,"concrete_red":64270,"concrete_black":64271,"concrete_powder_white":64512,"concrete_powder_orange":64513,"concrete_powder_magenta":64514,"concrete_powder_light_blue":64515,"concrete_powder_yellow":64516,"concrete_powder_lime":64517,"concrete_powder_pink":64518,"concrete_powder_gray":64519,"concrete_powder_silver":64520,"concrete_powder_cyan":64521,"concrete_powder_blue":64522,"concrete_powder_brown":64523,"concrete_powder_green":64524,"concrete_powder_red":64525,"concrete_powder_black":64527,"structure_block":65280}
const blockStrings = Object.keys(blocks).slice(1);
let blockCommands = ['item', '/set', '/box', '/replace', '/sphere', '/hsphere'];
let commands = ['truecoords', 'ignore', 'unignore', 'unstuck', 'drain', 'item', 'invsize', 'tp', 'time', 'bg', '/p1', '/p2', '/pos1', '/pos2', '/stop', '/positions', '/set', '/box', '/replace', '/sphere', '/hsphere', '/copy', '/paste', '/clearclipboard', '/load', '/save', '/build', '/builds', '/new'];
 
let espGeometry, lineMaterial, red, espMaterial, textCanvas;
 
function addGlobal(name, value) {
    var script = document.createElement('script');
    script.textContent = `window.${name} = ${value};`;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}
 
function start() {
        addGlobal('cheatnite', '{}');
 
        cheatnite.auto = true;
        cheatnite.coords = {x:0, y:0, z:0};
        cheatnite.worldedit = {
            clipboard: [null, null, {}],
            builds: {}
        };
        cheatnite.ignored = [];
        cheatnite.customBlockId = 256;
        cheatnite.server = {};
 
        cheatnite.fly = false;
        cheatnite.chatspam = null;
        cheatnite.chatspam_count = 0;
        cheatnite.bulletspam = null;
        cheatnite.tntspam = null;
        cheatnite.bedrock = false;
        cheatnite.drain = false;
        cheatnite.esp = true;
        cheatnite.noclip = false;
        cheatnite.invisible = false;
        cheatnite.darkMode = true;
 
        cheatnite.shiftKeyPressed = false;
 
        document.getElementById("leftwrap").innerHTML = "";
 
        //cheat display code inspired by https://greasyfork.org/en/scripts/474923-craftnite-io-hacked-client-fly-triggerbot-esp-rapidfire-speedhacks-and-more
        cheatnite.cheatDisp = document.createElement("h1");
        cheatnite.cheatDisp.style.position = "fixed";
        cheatnite.cheatDisp.style.fontSize = "156.25%";
        cheatnite.cheatDisp.style.right = 0;
        cheatnite.cheatDisp.style.marginRight = "10px";
        cheatnite.cheatDisp.style.backgroundColor = "rgba(0, 0, 0, 0)";
        cheatnite.cheatDisp.style.textAlign = "right";
        cheatnite.cheatDisp.style.fontFamily = "'Lucida Console', Monaco, monospace";
        cheatnite.cheatDisp.style.fontWeight = "bold";
        document.body.appendChild(cheatnite.cheatDisp);
 
        cheatnite.activatedCheats = ['ESP'];
        cheatnite.updateCheatDisp = true;
 
}
window.addEventListener('load', start);
 
GM_addStyle(`
    input#customServer {
        height: 63px;
        width: 100%;
        text-align: center;
        font-size: 22px;
        font-family: Madera;
        color: #000 !important;
        border: 0px solid #000000;
        background: #ffffff;
        border-radius: 2px;
    }
`);
 
function addInputAbovePlayButton() {
    const playBtn = document.getElementById('playbtn');
 
    const customServer = document.createElement('input');
    customServer.id = 'customServer';
    customServer.type = 'text';
    customServer.placeholder = 'Random server';
    customServer.value = localStorage.getItem('lastServer') ? localStorage.getItem('lastServer') : '';
 
    playBtn.parentNode.insertBefore(customServer, playBtn);
 
    const lineBreak = document.createElement('br');
    customServer.parentNode.insertBefore(lineBreak, customServer);
}
 
window.addEventListener('load', addInputAbovePlayButton);
 
var a914 = "[Usind a Exclusive script by noorie]";
function customStartBtn () {
    let nameValue = document.getElementById ('name').value;
    addGlobal('playerName', nameValue ? JSON.stringify(nameValue) : JSON.stringify('unnamed'))
 
    setCookie ("name", playerName, 365);
    setCookie ("skin", playerSkin, 365);
 
    var inputValue = (document.getElementById('customServer').value || '').trim();
    var localStorageValue = localStorage.getItem('lastServer');
    if (inputValue === 'Random server 4u' || !inputValue) {
        requestServerName();
    } else if (localStorageValue && inputValue === 'Last server') {
        localStorage.setItem('lastServer', localStorageValue);
        G.gameServerAddress = localStorageValue;
        playGame();
    } else {
        localStorage.setItem('lastServer', inputValue);
        G.gameServerAddress = inputValue;
        playGame();
    }
}
 
var originalSend = window.XMLHttpRequest.prototype.send;
var originalOpen = window.XMLHttpRequest.prototype.open;
 
window.XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalOpen.apply(this, arguments);
};
 
window.XMLHttpRequest.prototype.send = function() {
    if (this._url && this._url.startsWith('https://craftnite.io/gs/requestServer.php')){
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                var inputValue = (document.getElementById('customServer')?.value || '').trim();
                var localStorageValue = localStorage.getItem('lastServer');
                if (inputValue === 'Random server' || !inputValue) {
                    localStorage.setItem('lastServer', this.responseText);
                    return this.responseText
                }
            }
        }, false);
    }
 
    if (this._url.startsWith('https://craftnite.io') || this._url === 'a.zip') {
        return originalSend.apply(this, arguments);c
    }
};
 
let selectedIndex = -1;
 
let suggestions = [];
 
function chatCmdSuggestions(event) {
  let keyCode = event.keyCode;
 
  if (keyCode !== 40 && keyCode !== 38 && keyCode !== 13) {
    let filter = GAME.chatInput.value.toLowerCase();
 
    suggestions = [];
 
    if (filter.includes('/')) {
      let command = blockCommands.find(command => filter.startsWith('/' + command.toLowerCase() + ' '));
      if (command) {
        filter = filter.slice(command.length + 1).trim();
        Object.keys(blocks).forEach(item => {
          if (item.toLowerCase().includes(filter)) {
            suggestions.push('/' + command + ' ' + item);
          }
        });
      } else {
        commands.forEach(command => {
          if (command.toLowerCase().startsWith(filter.slice(1))) {
            suggestions.push('/' + command);
          }
        });
      }
    }
  }
 
  if (keyCode === 40 || keyCode === 38 || keyCode === 13) {
    if (selectedIndex >= 0) {
      if (keyCode === 13) {
        GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
        selectedIndex = -1;
        GAME.chatInput.focus();
        return;
      }
    }
 
    if (keyCode === 40) {
      selectedIndex++;
      if (selectedIndex >= suggestions.length) {
        selectedIndex = 0;
      }
    } else if (keyCode === 38) {
      selectedIndex--;
      if (selectedIndex < 0) {
        selectedIndex = suggestions.length - 1;
      }
    }
 
    GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
  }
}
 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
 
async function a637(positions, blockIds, errorCallback=null) {
    const indices = Array.from({length: positions.length}, (_, n) => n);
    shuffle(indices);
 
    var index, chunkCoords, chunk, innerPos, pkt;
 
    for (var r = 0; r < indices.length; r++) {
        if (!cheatnite.worldedit.inprogress) {
            if (errorCallback)
                errorCallback();
            return;
        }
 
        index = indices[r];
        chunkCoords = GAME.a865.getChunkFromPos(positions[index]);
        innerPos = coordsToInsidePos(positions[index], chunkCoords);
 
        pkt = new a234();
        pkt.i = chunkCoords[0];
        pkt.e = chunkCoords[1];
        pkt.o = chunkCoords[2];
        pkt.v = innerPos;
        pkt.u = blockIds[index];
        G.socket.send(pkt.a614());
 
        if (r % 100 === 99) {
            await sleep(cheatnite.server.r*200);
        }
    }
}
 
async function rawa637(iArr, eArr, oArr, vArr, uArr, errorCallback=null) {
    const indices = Array.from({length: iArr.length}, (_, n) => n);
    shuffle(indices);
 
    var index, pkt;
 
    for (var r = 0; r < indices.length; r++) {
        if (!cheatnite.worldedit.inprogress) {
            if (errorCallback)
                errorCallback();
            return;
        }
 
        index = indices[r];
 
        pkt = new a234();
        pkt.i = iArr[index];
        pkt.e = eArr[index];
        pkt.o = oArr[index];
        pkt.v = vArr[index];
        pkt.u = uArr[index];
        G.socket.send(pkt.a614());
 
        if (r % 100 === 99) {
            await sleep(cheatnite.server.r*200);
        }
    }
}
 
function tp(pos, updateVisual = true) {
    let me = GAME.a865.player;
 
    var pkt = new a175();
    pkt.time = parseFloat(("" + Date.now() / 1e3).slice(4));
    pkt.x = pos.x;
    pkt.y = pos.y;
    pkt.z = pos.z;
    pkt.a751 = me.a751;
 
    if (updateVisual) {
        me.controls.moveCameraTo(pos);
        me.position.copy(pos);
    }
 
    if (me.camera != null) {
        me.camera.rotation.order = "YXZ";
        pkt.a748 = me.camera.rotation.y;
        pkt.a749 = me.camera.rotation.x;
    }
    G.socket.send(pkt.a614())
}
 
function getColor(index, total) {
  let hue = 360 * (index / (total * 2));
  let saturation = 100;
  let lightness = 75;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
 
function randomIP() {
  const octets = [];
  for (let i = 0; i < 4; i++) {
    const octet = Math.floor(Math.random() * 256);
    octets.push(octet);
  }
  return octets.join('.');
}
 
function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}
 
function getBuildName(filename) {
  if (filename === '') {
    filename = '';
  }
 
  filename = filename.replaceAll(' ', '_');
 
  while (Object.keys(cheatnite.worldedit.builds).includes(filename)) {
    if (/\d+$/.test(filename)) {
      filename = filename.replace(/(\d+)$/, (match) => parseInt(match) + 1);
    } else {
      filename = filename + '1';
    }
  }
 
  return filename;
}
 
 
function shoot(gun) {
    var e = new THREE.Vector3;
 
    var a = 8;
    var b = 9;
 
    switch (gun) {
    case "pistol":
        a = 8;
        b = 9;
        break;
    case "shotgun":
        a = 12;
        b = 13;
        var spread = 0.06; //spread goes from 0.03 - 0.06
        for (var i = 0; i < 8; i++) {
            e.x = G.randFloat(-spread, spread, 2);
            e.y = G.randFloat(-spread, spread, 2);
            e.z = G.randFloat(-spread, spread, 2);
            GAME.a865.player.a609(a, b, {
                headshotMsg: ["boom ", "headshot"],
                headshotColor: ["rgba(255,0,0,{opacity})", "rgba(255,255,255,{opacity})"]
            }, false, false, e)
        }
        return;
    case "sniper":
        a = 16;
        b = 17;
        e.x *= 100;
        e.y = G.randFloat(20 * -GAME.a865.player.a92.y, 20 * GAME.a865.player.a92.y, 2);
        e.z *= 100;
        break;
    case "ak47":
        a = 14;
        b = 15;
        e.x *= 100;
        e.y = G.randFloat(-GAME.a865.player.a92.y / 2, GAME.a865.player.a92.y / 2, 2);
        e.z *= 100;
        break;
    }
    GAME.a865.player.a609(a, b, {
        headshotMsg: ["boom ", "headshot"],
        headshotColor: ["rgba(255,0,0,{opacity})", "rgba(255,255,255,{opacity})"]
    }, false, false, e)
}
 
function throwItem(item) {
    var e = new THREE.Vector3;
    var spread = 0.2
    e.x = G.randFloat(-spread, spread, 2);
    e.y = G.randFloat(-spread, spread, 2);
    e.z = G.randFloat(-spread, spread, 2);
 
    switch(item) {
    case "stone":
        GAME.a865.player.a609(2, 2, {
            me: true
        });
        break;
    case "wood":
        GAME.a865.player.a609(3, 3, {
            me: true
        });
        break;
    case "tnt":
        GAME.a865.player.a609(4, 4, {
            me: true
        }, false, false, e);
        break;
    case "stairs":
        GAME.a865.player.a609(6, 6, {
            me: true
        })
    }
}
 
function onDeath(dv) {
    let c = new a191();
    c.a615(dv);
    GAME.a865.player.a539();
    GAME.addKillfeed(G.othera822ers[c.a163].name, "killed", GAME.a865.player.name);
    GAME.myKillerId = c.a163;
    G.othera822ers[c.a163] && G.othera822ers[c.a163].a472.add(GAME.camera);
    GAME.drawLeaderboard();
    $(document).off("mousedown.pointerLock");
    GAME.respawnIn = 0;
    $(document).on("mousedown.respawn", (function(t) {
        if(!$(t.target).is("#bottomright")) {
            GAME.a865.player.respawn();
            GAME.a865.player.controls.lock();
            $(document).off("mousedown.respawn");
        }
    }))
    GAME.uiManager.inventory.close();
    GAME.deadPopup = true;
 
    cheatnite.customBlockId = 256;
 
    if (cheatnite.tntspam) {
        cheatnite.tntspam = null;
        clearInterval(cheatnite.tntspam);
        modifyCheatDisp("tntspam");
    }
 
    if (cheatnite.bulletspam) {
        clearInterval(cheatnite.bulletspam);
        cheatnite.bulletspam = null;
        modifyCheatDisp("bulletspam");
    }
 
    cheatnite.updateCheatDisp = true;
}
 
function parseOutgoingChat(dv) {
    let msg = "";
 
    for (let i = 1; i < dv.byteLength; i += 2) {
        const charCode = dv.getUint16(i, true);
        msg += String.fromCharCode(charCode);
    }
 
    return msg;
}
 
function drawLeaderboard() {
    GAME.leaderboard = [];
    for (var t = [], e = 0; e < 120; e++)
        if (G.othera822ers[e]) {
            var i = G.othera822ers[e];
            t.push([i.a649, i.id, i.name])
        }
    t.sort((function(t, e) {
        return t[0] - e[0]
    }
    ));
    for (var o = -1, n = 0, s = !1, r = !1, a = !1, h = (e = 0,
    0), l = t.length - 1; l >= 0; l--)
        a = t[l][1] == GAME.a865.player.id,
        t[l][0] != o && (o = t[l][0],
        n++),
        r = !1,
        e < 10 ? (a && (s = !0),
        r = !0) : s ? 10 == e && (r = !0) : a && (r = !0),
        r && (GAME.leaderboard[h] = {
            me: a,
            rank: n,
            name: `(${t[l][1]}) ${t[l][2]}`,
            a649: t[l][0],
            id: t[l][1]
        },
        h++),
        e++
}
 
function addCustomChat(name, msg) {
    if ("" != (msg = msg.trim())) {
        GAME.chat.push({
            name: name,
            msg: msg
        });
        if (GAME.chat.length > 5)
            GAME.chat = GAME.chat.slice(GAME.chat.length - 5, GAME.chat.length);
        GAME.newChatMessage = true;
    }
}
 
function addChat(t, e) {
    if ("" != (e = e.trim())) {
        if (cheatnite.ignored.includes(G.othera822ers[t].id)) {
            return;
        }
        if (e === a914) {
            return;
        }
        var i = "server";
        255 != t && (i = G.othera822ers[t].name);
        if (i > 20) {
            i = i.substring(0, 17) + '...';
        }
        var name = `(${G.othera822ers[t].id}) ` + i;
        GAME.chat.push({
            name: name,
            msg: e
        });
        if (GAME.chat.length > 5)
            GAME.chat = GAME.chat.slice(GAME.chat.length - 5, GAME.chat.length);
        GAME.newChatMessage = true;
    }
}
 
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
 
function checkInt(num) {
    return !isNaN(parseInt(num));
}
 
function checkNumsInArr(arr, len) {
    var nums = [];
    for (let i in arr) {
        if (!isNaN(Number(arr[i]))) {
            nums.push(Number(arr[i]));
        }
    }
    if (nums.length === len) {
        return nums;
    }
    return false;
}
 
function convertCoords(coords, type) {
    if (!coords) {
        return false;
    }
    var convertedCoords = new THREE.Vector3();
 
    if(type === "adjusted") {
        convertedCoords.x = coords.x / 5 - 740;
        convertedCoords.y = coords.y / 5 - 53;
        convertedCoords.z = coords.z / 5 - 550;
    } else if(type === "true") {
        convertedCoords.x = (coords.x + 740) * 5;
        convertedCoords.y = (coords.y + 53) * 5;
        convertedCoords.z = (coords.z + 550) * 5;
    } else {
        throw new Error('convertCoords type must be "true" or "adjusted".');
    }
 
    return convertedCoords;
}
 
function showKillFeed() {
  GAME.killfeedCanvas.cvs.clear();
 
  const num = (GAME.killfeed.length < 5) ? 0 : (GAME.killfeed.length - 5);
 
  for (let i = 0, index = num; index < GAME.killfeed.length; index++) {
    const entry = GAME.killfeed[index];
 
    if (entry) {
      const killer = (entry.killer.length < 10) ? entry.killer : (entry.killer.substring(0, 10) + "..");
      const victim = (entry.victim.length < 10) ? entry.victim : (entry.victim.substring(0, 10) + "..");
      const killFeedText = `${killer} ${entry.action} ${victim}`;
 
      GAME.killfeedCanvas.text(
        [10, 4 + 24 * i],
        [0, 0],
        killFeedText,
        "rgba(255, 255, 255, .9)",
        20,
        "top",
        "left",
        G.a816
      );
 
      i++;
    }
  }
 
  GAME.killfeedCanvas.cvs.flip();
  GAME.killfeedCanvas.cvs.show();
}
 
function modifyCheatDisp(text) {
    const index = cheatnite.activatedCheats.indexOf(text);
    if (index !== -1) {
      cheatnite.activatedCheats.splice(index, 1);
    } else {
      cheatnite.activatedCheats.push(text);
    }
    cheatnite.updateCheatDisp = true;
}
 
function customPosToV(t, buildP) {
    for (var e = -1, i = 0; i < 32; i++)
        if (t.x >= buildP.x + 5*i && t.x <= buildP.x + 5*(i + 1)) {
            e = i;
            break
        }
    var o = -1;
    for (i = 0; i < 32; i++)
        if (t.y >= buildP.y + 5*i && t.y <= buildP.y + 5*(i + 1)) {
            o = i;
            break
        }
    var n = -1;
    for (i = 0; i < 32; i++)
        if (t.z >= buildP.z + 5*i && t.z <= buildP.z + 5*(i + 1)) {
            n = i;
            break
        }
    return -1 != e && -1 != o && -1 != n && G.a650.prototype.a720(e, o, n)
}
 
function posTochunk(pos, buildP = null) {
    const chunkCoords = GAME.a865.getChunkFromPos(pos);
    const [i, e, o] = chunkCoords;
 
    let insidePos;
    if (buildP) {
        insidePos = customPosToV(pos, GAME.a865.a643s[i][e][o].buildP.clone());
    } else {
        insidePos = GAME.a865.a643s[i][e][o]?.posToV(pos);
    }
 
    return [chunkCoords, insidePos];
}
 
function getBlockIdAtPos(pos, buildP = null) {
    const chunkCoords = GAME.a865.getChunkFromPos(pos);
    const [i, e, o] = chunkCoords;
 
    if (i>160 || e>160 || o>160)
        return null;
 
    const chunk = GAME.a865.a643s?.[i]?.[e]?.[o];
 
    if (!chunk) {
        return 0;
    }
 
    try {
        let insidePos;
        if (buildP) {
            insidePos = customPosToV(pos, chunk.buildP.clone());
        } else {
            insidePos = chunk.posToV(pos);
        }
 
        const blockId = chunk.volume[insidePos];
 
        return blockId;
    } catch {
        return null;
    }
}
 
function getLookAtBlockId() {
    let blockId = null;
 
    var position = GAME.a865.player.position;
    position.y += 2.5;
    var rotation = GAME.a865.player.direction;
 
    const lookDirection = new THREE.Vector3();
    lookDirection.setFromSphericalCoords(rotation.x, rotation.y, rotation.z);
 
    const maxDistance = 1000;
    const stepSize = 0.1;
    const lookPosition = new THREE.Vector3();
 
    for (let distance = 0; distance <= maxDistance; distance += stepSize) {
        lookPosition.copy(position).addScaledVector(rotation, distance);
        blockId = getBlockIdAtPos(lookPosition);
 
        if (blockId) {
            break;
        }
    }
 
    return blockId;
}
 
function wasThrown() {
  try {
    throw new Error();
  } catch (e) {
    const stackLines = e.stack.split('\n');
    const callerLine = stackLines[3];
    const functionName = callerLine.match(/\ba853\b/);
    return !!functionName;
  }
}
 
function countItemInInv(target) {
    let count = 0;
    for (const item of GAME.a865.player.items) {
        if (item !== -1 && item.a474Id === target && item.total) {
            count += item.total;
        }
    }
    return count;
}
 
function getFormattedDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
 
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}
 
function saveScene() {
    var renderer = GAME.renderer;
    var camera = GAME.a865.player.camera;
    renderer.render(GAME.scene, camera);
    var link = document.createElement('a');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = 'craftnite-io-'+getFormattedDateString()+'.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
 
function hidePlayerBoxes() {
    const players = [];
 
    for (const p of G.othera822ers)
        if (p && p.id !== GAME.a865.player.id)
            players.push(p);
 
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.a472.box) {
            player.a472.box.visible = false;
        }
    }
}
 
function showPlayerBoxes() {
    const players = [];
 
    for (const p of G.othera822ers)
        if (p && p.id !== GAME.a865.player.id)
            players.push(p);
 
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.a472.box) {
            player.a472.box.visible = true;
        }
    }
}
 
function flipObjectUpsideDown(points) {
  let flippedPoints = [];
 
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }
 
  const yRange = maxY - minY;
 
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let newY = minY + (yRange - (point.y - minY));
    flippedPoints.push(new THREE.Vector3(point.x, newY, point.z));
  }
 
  return flippedPoints;
}
 
const cbReplacer = (key, value) => {
  if (value && value.isVector3) {
    return [value.x, value.y, value.z];
  } else if (value instanceof Uint16Array) {
    return Array.from(value);
  }
  return value;
};
 
const cbReviver = (key, value) => {
  if (Array.isArray(value)) {
    if (value.length === 3 && value.every(i => typeof i === 'number')) {
      return new THREE.Vector3(value[0], value[1], value[2]);
    }
  }
  return value;
};
 
function readChunksFromLocal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(event.target.result, cbReviver);
          if (jsonData.length !== 3) {
            throw new Error('Incorrect length for chunks loaded from file. Expected 3, got '+jsonData.length.toString()+'.');
          }
          if (!jsonData[0].isVector3 || !jsonData[1].isVector3) {
            throw new Error('First 2 items were expected to be arrays of length 3.');
          }
          if (Object.keys(jsonData[2]).some(key => typeof key !== 'string')) {
            throw new Error('Expected all keys in 3rd item to be strings.');
          }
          resolve(jsonData);
        } catch (error) {
          reject(`Error parsing JSON file: ${error.message}`);
        }
      }
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
}
 
function readBuildFromLocal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = new Uint8Array(event.target.result);
      const blks = await readBuildFile(file.name, buffer, blockStrings);
      resolve(blks);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
}
 
async function readBuildFromURL(url) {
  const response = await fetch(url);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const blks = await readBuildFile(url, buffer, blockStrings);
  return blks;
}
 
function chunkToCoords(chunkCoords, insidePos) {
    const [chunkX, chunkY, chunkZ] = chunkCoords;
 
    const x = insidePos % 32;
    const y = Math.floor(insidePos / 32) % 32;
    const z = Math.floor(insidePos / (32 * 32));
 
    const worldX = chunkX * 32 + x;
    const worldY = chunkY * 32 + y;
    const worldZ = chunkZ * 32 + z;
 
    return new THREE.Vector3(5*worldX, 5*worldY, 5*worldZ);
}
 
function coordsToInsidePos(worldCoords, chunkCoords) {
    const [chunkX, chunkY, chunkZ] = chunkCoords;
 
    const x = Math.floor(worldCoords.x/5) - chunkX * 32;
    const y = Math.floor(worldCoords.y/5) - chunkY * 32;
    const z = Math.floor(worldCoords.z/5) - chunkZ * 32;
 
    const insidePos = x + y * 32 + z * 32 * 32;
 
    return insidePos;
}
 
let WorldEdit = {};
 
WorldEdit.pos1 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        cheatnite.worldedit.pos1 = me.position.clone();
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(cheatnite.worldedit.pos1, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
            return;
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        cheatnite.worldedit.pos1 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(cheatnite.worldedit.pos1, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}
 
WorldEdit.pos2 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        cheatnite.worldedit.pos2 = me.position.clone();
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(cheatnite.worldedit.pos2, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        cheatnite.worldedit.pos2 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(cheatnite.worldedit.pos2, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}
 
WorldEdit.generatePointsNotOf = async function*(pointA, pointB, chunkSize, blockId) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));
 
    let tempPos;
    let points = [];
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                if (getBlockIdAtPos(tempPos) !== blockId) {
                    points.push(new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5));
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.generateBoxPoints = async function*(pointA, pointB, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));
 
    let tempPos;
    let points = [];
 
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                if (x === start.x || x === end.x || y === start.y || y === end.y || z === start.z || z === end.z) {
                    tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                    points.push(tempPos);
 
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.generatePointsOf = async function*(pointA, pointB, blockId, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));
 
    let tempPos;
    let points = [];
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                if (getBlockIdAtPos(tempPos) == blockId) {
                    points.push(new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5));
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.generateSpherePoints = async function*(centerPoint, radius, chunkSize, blockId) {
    let points = [];
    let radiusSquared = radius * radius;
    let minX = Math.floor((centerPoint.x - radius) / 5);
    let maxX = Math.floor((centerPoint.x + radius) / 5);
    let minY = Math.floor((centerPoint.y - radius) / 5);
    let maxY = Math.floor((centerPoint.y + radius) / 5);
    let minZ = Math.floor((centerPoint.z - radius) / 5);
    let maxZ = Math.floor((centerPoint.z + radius) / 5);
 
    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let distanceSquared = tempPos.distanceToSquared(centerPoint);
 
                if (distanceSquared <= radiusSquared && getBlockIdAtPos(tempPos) !== blockId) {
                    points.push(tempPos);
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
 
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.generateHollowSpherePoints = async function*(centerPoint, radius, chunkSize, blockId) {
    let points = [];
    let radiusSquared = radius * radius;
    let innerRadiusSquared = (radius - 1) * (radius - 1);
    let minX = Math.floor((centerPoint.x - radius) / 5);
    let maxX = Math.floor((centerPoint.x + radius) / 5);
    let minY = Math.floor((centerPoint.y - radius) / 5);
    let maxY = Math.floor((centerPoint.y + radius) / 5);
    let minZ = Math.floor((centerPoint.z - radius) / 5);
    let maxZ = Math.floor((centerPoint.z + radius) / 5);
 
    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let distanceSquared = tempPos.distanceToSquared(centerPoint);
 
                if (distanceSquared <= radiusSquared && getBlockIdAtPos(tempPos) !== blockId) {
                    let isOnSurface = false;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dz = -1; dz <= 1; dz++) {
                                let neighborPos = new THREE.Vector3(tempPos.x + dx * 5, tempPos.y + dy * 5, tempPos.z + dz * 5);
                                let neighborDistanceSquared = neighborPos.distanceToSquared(centerPoint);
                                if (neighborDistanceSquared >= innerRadiusSquared) {
                                    isOnSurface = true;
                                    break;
                                }
                            }
                            if (isOnSurface) break;
                        }
                        if (isOnSurface) break;
                    }
 
                    if (isOnSurface) {
                        points.push(tempPos);
                        if (points.length >= chunkSize) {
                            yield points;
                            points = [];
                        }
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
 
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.copyChunks = async function(pointA, pointB) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));
 
    let tempPos, tempBlock;
    let i, e, o;
    let chunk, volume;
    let key;
    let volumes = {};
 
    let minX = Math.min(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let minZ = Math.min(start.z, end.z);
    let maxX = Math.max(start.x, end.x);
    let maxY = Math.max(start.y, end.y);
    let maxZ = Math.max(start.z, end.z);
 
    for (let x = minX; x <= maxX; x++) {
        if (x % 32 !== 0 && x !== minX && x !== maxX) continue;
        for (let y = minY; y <= maxY; y++) {
            if (y % 32 !== 0 && y !== minY && y !== maxY) continue;
            for (let z = minZ; z <= maxZ; z++) {
                if (z % 32 !== 0 && z !== minZ && z !== maxZ) continue;
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                [i, e, o] = GAME.a865.getChunkFromPos(tempPos);
                if (i>160 || e>160 || o>160)
                    continue;
 
                chunk = GAME.a865.a643s[i][e][o];
                volume = chunk?.volume;
 
                key = [i, e, o].join(',');
                if (volume) {
                    volumes[key] = [chunk.buildP.clone(), volume];
                } else {
                    volumes[key] = [new THREE.Vector3(i*32*5, e*32*5, o*32*5), new Uint8Array(32768)]
                }
            }
        }
        await sleep(1);
    }
    return [
        new THREE.Vector3(minX, minY, minZ),
        new THREE.Vector3(maxX, maxY, maxZ),
        volumes,
    ];
};
 
WorldEdit.generatePointsFromClipboard = async function*(chunkSize = 100, newStart = null) {
    let [start, end, cbVolumes] = cheatnite.worldedit.clipboard;
    const diff = newStart ? new THREE.Vector3(Math.floor(newStart.x/5), Math.floor(newStart.y/5), Math.floor(newStart.z/5)).sub(start) : new THREE.Vector3(0,0,0);
 
    let count = 0;
 
    let chunkXList = [];
    let chunkYList = [];
    let chunkZList = [];
    let insidePositionsList = [];
    let blockIdsList = [];
 
    for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
            for (let z = start.z; z <= end.z; z++) {
                const oldPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                const chunkCoords = GAME.a865.getChunkFromPos(oldPos);
                const chunkData = cbVolumes[chunkCoords.join(',')];
                if (!chunkData)
                    continue;
 
                const insidePos = customPosToV(oldPos, chunkData[0]);
                const blockId = chunkData[1][insidePos];
 
                const [newChunkCoords, newInsidePos] = posTochunk(oldPos.clone().add(diff.clone().multiplyScalar(5)));
                const [newCx, newCy, newCz] = newChunkCoords;
                const currentBlock = GAME.a865.a643s[newCx][newCy][newCz]?.volume?.[newInsidePos];
                if (blockId === currentBlock)
                    continue;
 
                chunkXList.push(newCx);
                chunkYList.push(newCy);
                chunkZList.push(newCz);
                insidePositionsList.push(newInsidePos);
                blockIdsList.push(blockId);
                count++;
 
                if (count >= chunkSize) {
                    yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
                    chunkXList = [];
                    chunkYList = [];
                    chunkZList = [];
                    insidePositionsList = [];
                    blockIdsList = [];
                    count = 0;
                }
            }
        }
        await sleep(10);
    }
 
    if (count) {
        yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
    }
};
 
WorldEdit.generatePointsFromBuild = async function*(buildName, start, chunkSize) {
    let tempPos;
    let shiftedPoints = [];
    let buildBlockIds = [];
    const buildBlocks = cheatnite.worldedit.builds[buildName];
    for (let i = 0; i < buildBlocks.length; i++) {
        tempPos = new THREE.Vector3(
            buildBlocks[i].pos[0] * 5 + start.x,
            buildBlocks[i].pos[1] * 5 + start.y,
            buildBlocks[i].pos[2] * 5 + start.z
        )
        const blockId = blocks[buildBlocks[i].name];
        if (getBlockIdAtPos(tempPos) !== blockId) {
            shiftedPoints.push(tempPos.clone())
            buildBlockIds.push(blockId);
 
            if (shiftedPoints.length >= chunkSize) {
                yield [shiftedPoints, buildBlockIds];
                shiftedPoints = [];
                buildBlockIds = [];
            }
        }
    }
    if (shiftedPoints.length) {
        yield [shiftedPoints, buildBlockIds];
    }
}
 
WorldEdit.set = async function(start, end, blockName) {
    cheatnite.worldedit.inprogress = "set";
    cheatnite.updateCheatDisp = true;
 
    addCustomChat('WorldEdit', `Setting ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to ${blockName} blocks...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generatePointsNotOf(start, end, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //set command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //set command.');
}
 
WorldEdit.box = async function(start, end, blockName) {
    cheatnite.worldedit.inprogress = "box";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Generating a box from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")} using ${blockName} blocks...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateBoxPoints(start, end, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //box command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //box command.');
}
 
WorldEdit.replace = async function(start, end, blockIdStart, blockNameEnd) {
    cheatnite.worldedit.inprogress = "replace";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Replacing ${BLOCK_CONFIG[blockIdStart].name} with ${blockNameEnd} in ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")}...`);
 
    let blockIdEnd = blocks[blockNameEnd];
 
    if (blockIdStart === blockIdEnd) {
        cheatnite.worldedit.inprogress = false;
        cheatnite.updateCheatDisp = true;
        addCustomChat('WorldEdit', 'Completed //replace command.');
        return;
    }
 
    let chunkSize = 30000;
    let generator = this.generatePointsOf(start, end, blockIdStart, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockIdEnd), ()=>{
            addCustomChat('WorldEdit', 'Stopped //replace command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //replace command.');
}
 
WorldEdit.sphere = async function(centerPoint, blockName, radius) {
    cheatnite.worldedit.inprogress = "sphere";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateSpherePoints(centerPoint, radius, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //sphere command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //sphere command.');
}
 
WorldEdit.hollowSphere = async function(centerPoint, blockName, radius) {
    cheatnite.worldedit.inprogress = "hollow sphere";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} hollow sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateHollowSpherePoints(centerPoint, radius, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //hsphere command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //hsphere command.');
}
 
WorldEdit.copy = async function(start, end) {
    addCustomChat('WorldEdit', `Saving volume ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to clipboard...`);
    cheatnite.worldedit.clipboard = await this.copyChunks(start, end);
    addCustomChat('WorldEdit', 'Saved volume to clipboard.');
}
 
WorldEdit.paste = async function(start) {
    cheatnite.worldedit.inprogress = "paste";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Pasting clipboard at ${convertCoords(start || cheatnite.worldedit.clipboard[0], "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generatePointsFromClipboard(chunkSize, start);
 
    for await (const [x, y, z, insidePos, blockIds] of generator) {
        await rawa637(x, y, z, insidePos, blockIds, ()=>{
            addCustomChat('WorldEdit', 'Stopped //paste command.');
        })
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Pasted volume.');
}
 
WorldEdit.build = async function(buildName, start) {
    cheatnite.worldedit.inprogress = "build";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Building ${buildName} at ${convertCoords(start, "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generatePointsFromBuild(buildName, start, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //build command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }
 
    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Finished building '+buildName+'.');
}
 
WorldEdit.error = function(msg) {
    addCustomChat('WorldEdit.Error', msg);
}
 
WorldEdit.createBlockArr = function(len, blockId) {
    if (typeof(blockId) === 'number') {
        return Array(len).fill(blockId);
    } else {
        const filteredKeys = Object.keys(BLOCK_CONFIG).filter(key => parseInt(key) !== 0);
        const arr = Array.from({ length: len }, () => {
          return parseInt(filteredKeys[Math.floor(Math.random() * filteredKeys.length)]);
        })
        return arr;
    }
}
 
setInterval(() => {
    if (typeof(GAME) !== 'undefined' && GAME?.a865?.player?.position && GAME?.loadingUI.hidden == true) {
        let me = GAME.a865.player;
        let bottomright = document.getElementById('bottomright');
        bottomright.style.display = 'block';
        if (!me.dead) {
            cheatnite.coords = convertCoords(me.position, "adjusted");
            bottomright.textContent = `(${cheatnite.coords.x.toFixed(1)}, ${cheatnite.coords.y.toFixed(1)}, ${cheatnite.coords.z.toFixed(1)})`;
            if (GAME?.oceanHeightTo) {
                cheatnite.drain = cheatnite.coords.y < 10;
                GAME.oceanHeightTo = cheatnite.drain ? -10000 : 317;
            }
 
            if (GAME.myKillerId && !G.othera822ers.some((p) => p?.ID === GAME.myKillerId))
                GAME.myKillerId = null;
        } else {
            var newPos = G.othera822ers?.[GAME.myKillerId]?.position || me.position;
            let coords = convertCoords(newPos, "adjusted");
            bottomright.textContent = `(${coords.x.toFixed(1)}, ${coords.y.toFixed(1)}, ${coords.z.toFixed(1)})`;
        }
 
        if (cheatnite.updateCheatDisp) {
            //cheat display code inspired by https://greasyfork.org/en/scripts/474923-craftnite-io-hacked-client-fly-triggerbot-esp-rapidfire-speedhacks-and-more
            var textArr = cheatnite.activatedCheats;
            textArr.sort((a, b) => a.length - b.length);
            textArr = textArr.slice(0);
            if (cheatnite.customBlockId !== 256)
                textArr.push(`Item: ${BLOCK_CONFIG[cheatnite.customBlockId]?.name || cheatnite.customBlockId}`);
            if (cheatnite.worldedit.inprogress)
                textArr.push(`WorldEdit: ${cheatnite.worldedit.inprogress}`);
            var coloredTextArr = textArr.map(function(text, index) {
              return '<span style="color: ' + getColor(index, textArr.length) + '">' + text.toUpperCase() + '</span>';
            });
            cheatnite.cheatDisp.innerHTML = coloredTextArr.join('<br>');
            cheatnite.updateCheatDisp = false;
 
            cheatnite.cheatDisp.style.top = (document.documentElement.clientHeight + bottomright.clientHeight*0.5 - (26*textArr.length)) + "px";
        }
    }
 
    var extra = document.getElementsByClassName('truepush_optin_notifications');
    if (extra.length)
        extra[0].remove();
}, 50);
(function() {
    'use strict';

    // URL for your schematic file (using the Limewire link)
    const schematicUrl = 'https://limewire.com/d/9d24d7a9-8f39-4be1-94a5-ac0c989514c6#HduGK4zAG1riyG_mxp0QgxI9bEbb5x1-k9TvV9yNWaY';

    // Function to load schematic
    function loadSchematic() {
        if (cheatnite.worldedit.inprogress) {
            WorldEdit.error('Another WorldEdit command is currently running. Please stop it first.');
            return;
        }

        addCustomChat('Schematic Loader', 'Attempting to load schematic from URL...');
        
        // Fetch the schematic file
        fetchSchematic(schematicUrl).then((schematicData) => {
            if (schematicData) {
                cheatnite.worldedit.builds['house'] = schematicData;
                addCustomChat('Schematic Loader', 'Schematic loaded successfully as "house".');
            } else {
                addCustomChat('Schematic Loader', 'Failed to load schematic.');
            }
        }).catch(error => {
            WorldEdit.error('Error fetching schematic: ' + error);
        });
    }

    // Fetch the schematic from the URL
    async function fetchSchematic(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch schematic.');
            return await response.blob();
        } catch (error) {
            console.error('Error fetching schematic:', error);
            return null;
        }
    }

    // Custom chat message function (matches WorldEdit pattern)
    function addCustomChat(source, message) {
        console.log(`[${source}] ${message}`);
        // You can adjust this to use CheatNite's actual chat system
    }

    // Listen for chat commands (detect the //house command)
    function listenForCommands() {
        cheatnite.chat.on('chat', function(msg) {
            if (msg === '//house') {
                loadSchematic();
            }
        });
    }

    // Initialize the command listener when the script is loaded
    listenForCommands();

})();



function initEsp() {
    espGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 10, 5).translate(0, -3, 0));
    lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
 
    red = `
        void main() {
            gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
        }
    `;
    espMaterial = new THREE.RawShaderMaterial({
        vertexShader: `
        attribute vec3 position;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            gl_Position.z = 1.0;
        }
        `,
        fragmentShader: red
    });
    textCanvas = new G.Canvas2d();
    textCanvas.alpha = 0;
    textCanvas.init();
}
 
function animate() {
    window.requestAnimationFrame(animate);
    const players = [];
 
    for (const p of G.othera822ers)
        if (p && p.id && p.id !== GAME.a865.player.id)
            players.push(p);
 
    textCanvas.clear();
    const drawnTextPositions = [];
    const minSpacing = 4;
    const textOffset = 24;
 
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.a472.box) {
            const box = new THREE.LineSegments(espGeometry, espMaterial);
            box.frustumCulled = false;
            player.a472.add(box);
            player.a472.box = box;
        }
 
        player.a472.box.visible = cheatnite.esp;
 
        if (player.a472.visible && cheatnite.esp) {
            const worldPos = new THREE.Vector3();
            player.a472.box.getWorldPosition(worldPos);
 
            let screenPos = G.worldPosToScreenCoords(worldPos, GAME.camera, window.innerWidth, window.innerHeight);
            if (screenPos.orientation !== 'center')
                continue;
 
            let playerName = `(${player.id}) ` + (player.name.length > 20 ? player.name.substring(0, 17) + '...' : player.name);
            let color = "#FFFFFF";
            if (player.ID === GAME.myKillerId) {
                playerName = '(killer) '+playerName;
                color = "#FF8080";
            }
            const textSize = 16;
 
            let yPos = screenPos.coords.y - 10;
            for (const drawnPos of drawnTextPositions) {
                if (Math.abs(drawnPos.x - screenPos.coords.x) < textSize && Math.abs(drawnPos.y - yPos) < textSize) {
                    yPos = drawnPos.y - textSize - minSpacing;
                }
            }
            drawnTextPositions.push({ x: screenPos.coords.x, y: yPos });
 
            textCanvas.text(
                [screenPos.coords.x, yPos],
                playerName,
                color,
                textSize,
                "middle",
                "center"
            );
        }
    }
    textCanvas.flip();
}
 
let checkInterval = setInterval(() => {
    if (typeof(G) !== 'undefined' && typeof(G.socket) !== 'undefined' && G.socket !== null && G.socket.binaryType == "arraybuffer") {
        clearInterval(checkInterval);
        G.socket.onmessage = new Proxy(G.socket.onmessage || function(){}, {
            apply: function (target, scope, args) {
                var i = new DataView(args[0].data);
                let opcode = i.getUint8(0);
 
                if (opcode === 19) {
                    onDeath(i);
                } else if (opcode === G.a823.RPCMatchRemainingTime) {
                    var c, ratio;
                    (c = new RPCMatchRemainingTime).a615(i);
                    if (!cheatnite.server.time) {
                        cheatnite.server.r = 3;
                        var e = new a201();
                        e.msg = a914;
                        G.socket.send(e.a614());
                    } else {
                        ratio = (Date.now() - cheatnite.server.time)/1000;
                        if (ratio >= 1)
                            cheatnite.server.r = ratio;
                    }
                    cheatnite.server.time = Date.now();;
                }
 
                let data = target.apply(scope, args);
                return data;
            }
        });
    }
}, 1000);
 
WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
        var dataView = new DataView(args[0]);
        let opcode = dataView.getUint8(0);
 
        if (opcode == 27) {
            let blockName, thickess, radius, pID, pkt, player;
            let adjustedCoords = `(${cheatnite.coords.x.toFixed(0)}, ${cheatnite.coords.y.toFixed(0)}, ${cheatnite.coords.z.toFixed(0)})`
            let msg = parseOutgoingChat(dataView);
            if (msg.startsWith('/')) {
                addCustomChat('$', msg)
                let splitMsg = msg.split(' ').filter(word => word !== '');
                let cmd = splitMsg[0].substr(1).toLowerCase();
                let args = splitMsg.slice(1);
                switch(cmd) {
                    case 'truecoords':
                        addCustomChat('<', `(${(me.position.x).toFixed(1)}, ${(me.position.y).toFixed(1)}, ${(me.position.z).toFixed(1)})`)
                        break;
                    case 'ignore':
                        pID = parseInt(args[0]);
                        if (!isNaN(pID)) {
                            if (!cheatnite.ignored.includes(pID)) {
                                cheatnite.ignored.push(pID);
                                addCustomChat('<', `Ignored player with ID ${pID}`);
                            } else {
                                addCustomChat('Error', `Player ID ${pID} is already ignored.`);
                            }
                        } else {
                            addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                        }
                        break;
                    case 'unignore':
                        pID = parseInt(args[0]);
                        if (!isNaN(pID)) {
                            if (cheatnite.ignored.includes(pID)) {
                                cheatnite.ignored = cheatnite.ignored.filter(item => item !== pID);
                                addCustomChat('<', `Unignored player with ID ${pID}`);
                            } else {
                                addCustomChat('Error', `Player ID ${pID} is not in ignored list.`);
                            }
                        } else {
                            addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                        }
                        break;
                    case 'unstuck':
                        G.a597.rebound.enabled = true;
                        addCustomChat('<', 'Unstuck.');
                        break
                    case 'drain':
                        cheatnite.drain = !cheatnite.drain;
                        GAME.oceanHeightTo = cheatnite.drain ? -10000 : 317;
                        addCustomChat('<', cheatnite.drain ? 'Ocean gone (for client).' : 'Ocean is back.');
                        break;
                    case 'item':
                        if (args.length === 0) {
                            cheatnite.customBlockId = getLookAtBlockId();
                        } else if (checkInt(args[0]) && Object.keys(BLOCK_CONFIG).includes(args[0])) {
                            cheatnite.customBlockId = parseInt(args[0]);
                        } else if (Object.keys(blocks).includes(args[0].toLowerCase())) {
                            cheatnite.customBlockId = blocks[args[0].toLowerCase()];
                        } else {
                            addCustomChat('Error', `Block ${args[0]} does not exist.`);
                            return;
                        }
 
                        if (!cheatnite.customBlockId) {
                            addCustomChat('<', 'Reset stone items.');
                            return;
                        }
 
                        var stoneNeeded = 1000 - countItemInInv("stone");
                        if (stoneNeeded > 0) {
                            GAME.a865.player.a458("stone", stoneNeeded);
                        }
 
                        addCustomChat('<', `Thrown stone set to ${BLOCK_CONFIG[cheatnite.customBlockId]?.name || cheatnite.customBlockId}.`);
                        break;
                    case 'invsize':
                        if (args.length === 0) {
                            GAME.a865.player.totalShorta843 = 4;
                            addCustomChat('<', 'Inventory size reset.')
                        } else if (checkInt(args[0]) && parseInt(args[0])>=0 && parseInt(args[0])<=35) {
                            GAME.a865.player.totalShorta843 = parseInt(args[0]);
                            addCustomChat('<', 'Inventory size set to '+args[0]+'.')
                        } else {
                            addCustomChat('Error', 'Invalid input. Expected an integer between 0 and 35, inclusive.')
                        }
                        break;
                    case 'tp':
                        pID = parseInt(args[0]);
                        if (!isNaN(pID)) {
                            player = G.othera822ers.find(p => p?.id === pID);
                            if (!player) {
                                addCustomChat('Error', `Player with ID ${pID} not found.`);
                                return
                            }
                            tp(player.position);
                            addCustomChat('>', `Teleported to ${player.id}.`)
                        } else {
                            addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                        }
                        break;
                    case 'time':
                        if (args.length < 2 || args[0].toLowerCase() !== 'set') {
                            addCustomChat('Error', 'Expected at 2 args: set and (day/night).')
                            return;
                        }
                        if (args[1].toLowerCase() === 'night') {
                            cheatnite.darkMode = true;
                            G.CONFIG.a133 = new THREE.Color("rgb(30, 30, 30)");
                        } else {
                            cheatnite.darkMode = false;
                            G.CONFIG.a133 = G.CONFIG.a134;
 
                        }
                        GAME.updatea668(false);
                        addCustomChat('<', `Time set to ${cheatnite.darkMode ? 'night' : 'day'}.`);
                        break;
                    case 'bg':
                        if (args.length) {
                            if (isURL(args[0])) {
                                addCustomChat('<', 'Loading background image from url...');
                                const textureLoader = new THREE.TextureLoader();
                                textureLoader.load(args[0], (texture) => {
                                  const sphereGeometry = new THREE.SphereBufferGeometry(16e3, 32, 15);
                                  const texturedMaterial = new THREE.MeshBasicMaterial({
                                    map: texture,
                                    side: THREE.BackSide,
                                  });
 
                                  const skybox = new THREE.Mesh(sphereGeometry, texturedMaterial);
                                  GAME.scene.add(skybox);
                                  addCustomChat('<', 'Background image set!');
                                });
                            }
                            return;
                        }
 
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = (event) => {
                            addCustomChat('<', 'Loading background image from file...');
                            const file = event.target.files[0];
                            const reader = new FileReader();
 
                            reader.onload = (event) => {
                                const textureLoader = new THREE.TextureLoader();
                                textureLoader.load(event.target.result, (texture) => {
                                    const sphereGeometry = new THREE.SphereBufferGeometry(16e3, 32, 15);
                                    const texturedMaterial = new THREE.MeshBasicMaterial({
                                        map: texture,
                                        side: THREE.BackSide,
                                    });
 
                                    const skybox = new THREE.Mesh(sphereGeometry, texturedMaterial);
                                    GAME.scene.add(skybox);
                                    addCustomChat('<', 'Background image set!');
                                });
                            };
 
                            reader.readAsDataURL(file);
                        };
                        input.click();
 
                        break;
 
                    case '/p1':
                        WorldEdit.pos1(args);
                        break;
                    case '/p2':
                        WorldEdit.pos2(args);
                        break;
                    case '/pos1':
                        WorldEdit.pos1(args);
                        break;
                    case '/pos2':
                        WorldEdit.pos2(args);
                        break;
                    case '/set':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected 1 argument, got 0.');
                            return;
                        }
 
                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }
 
                        WorldEdit.set(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName)
 
                        break;
                    case '/box':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected 1 argument, got 0.');
                            return;
                        }
 
                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }
 
                        WorldEdit.box(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName);
 
                        break;
                    case '/replace':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length == 0) {
                            WorldEdit.error('Expected at least 1 argument, got 0.');
                            return;
                        }
 
                        var blockIdStart = getLookAtBlockId();
                        if (!blockIdStart) {
                            blockIdStart = 0;
                        }
                        var blockNameEnd = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockNameEnd)) {
                            WorldEdit.error(`Block ${blockNameEnd} does not exist.`);
                            return;
                        }
 
                        WorldEdit.replace(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockIdStart, blockNameEnd);
 
                        break;
                    case '/sphere':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 && !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 or //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected at 2 arguments, got 0.');
                            return;
                        }
 
                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }
 
                        radius = parseInt(args[1]);
                        if (!radius) {
                            WorldEdit.error(`Invalid radius ${radius}`);
                            return;
                        }
 
                        WorldEdit.sphere((cheatnite.worldedit.pos1 || cheatnite.worldedit.pos2).clone(), blockName, radius);
 
                        break;
                    case '/hsphere':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 && !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 or //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected at 2 arguments, got 0.');
                            return;
                        }
 
                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }
 
                        radius = parseInt(args[1]);
                        if (!radius) {
                            WorldEdit.error(`Invalid radius ${radius}`);
                            return;
                        }
 
                        WorldEdit.hollowSphere((cheatnite.worldedit.pos1 || cheatnite.worldedit.pos2).clone(), blockName, radius);
 
                        break;
                    case '/copy':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
 
                        WorldEdit.copy(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone());
 
                        break;
                    case '/paste':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.clipboard[0]) {
                            WorldEdit.error('Nothing is copied to clipboard.');
                            return;
                        }
                        if (args.length && args[0].toLowerCase() === 'original') {
                            WorldEdit.paste(null);
                        } else {
                            WorldEdit.paste(GAME.a865.player.position.clone());
                        }
 
                        break;
                    case '/clearclipboard':
                        cheatnite.worldedit.clipboard = [null, null, {}];
                        addCustomChat('WorldEdit', 'Cleared clipboard.');
                        break;
                    case '/stop':
                        if (!cheatnite.worldedit.inprogress) {
                            WorldEdit.error("No WorldEdit commands are currently running.");
                            return;
                        }
                        cheatnite.worldedit.inprogress = false;
                        cheatnite.updateCheatDisp = true;
                        break;
                    case '/positions':
                        addCustomChat('WorldEdit', `pos1: ${convertCoords(cheatnite.worldedit.pos1, "adjusted") || 'not set'}; pos2: ${convertCoords(cheatnite.worldedit.pos2, "adjusted") || 'not set'}`);
                        break;
                    case '/load':
                        if (args.length) {
                            if (isURL(args[0])) {
                                const buildName = getBuildName(args[0].split('/').pop().split('#')[0].split('?')[0])
                                cheatnite.worldedit.builds[buildName] = readBuildFromURL(args[0]);
                            }
                            return;
                        }
 
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = async (event) => {
                          try {
                            const file = event.target.files[0];
                            const fnWithExt = file.name || '';
                            const fn = fnWithExt.split(".").slice(0, -1).join(".");
                            const buildName = getBuildName(fn || '');
                            let loadedBuild;
                            if (fnWithExt.endsWith('.json')) {
                                loadedBuild = await readChunksFromLocal(file);
                            } else if (fnWithExt.endsWith('.schem') || fnWithExt.endsWith('.schematic') || fnWithExt.endsWith('.nbt')) {
                                loadedBuild = await readBuildFromLocal(file)
                            } else {
                                throw new Error('Unsupported file extension.')
                            }
                            if (loadedBuild) {
                              cheatnite.worldedit.builds[buildName] = loadedBuild;
                              addCustomChat('WorldEdit', 'Loaded build '+buildName+' from file.');
                            }
                          } catch (errorString) {
                            WorldEdit.error(errorString.toString());
                          } finally {
                            input.remove();
                          }
                        };
                        input.click();
                        break;
                    case '/new':
                        //not implemented
                        break;
                    case '/build':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        var keys = Object.keys(cheatnite.worldedit.builds);
                        if (keys.length === 0) {
                            WorldEdit.error('You do not have any builds.')
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.build(Object.keys(cheatnite.worldedit.builds)[Object.keys(cheatnite.worldedit.builds).length - 1], GAME.a865.player.position.clone());
                            return;
                        }
                        if (!cheatnite.worldedit.builds[args[0]]) {
                            WorldEdit.error('Build '+args[0]+' not found. Your saved builds are: '+Object.keys(cheatnite.worldedit.builds).join(', '));
                            break;
                        }
                        WorldEdit.build(args[0], GAME.a865.player.position.clone());
                        break;
                    case '/builds':
                        addCustomChat('WorldEdit', 'Your builds are: '+Object.keys(cheatnite.worldedit.builds).join(', '));
                        break
                    case '/save':
                        //not implemented
                        break;
                    default:
                        if (cmd.startsWith('/')) {
                            WorldEdit.error(`Command /${cmd} not found.`);
                        } else {
                            addCustomChat('Error', `Command /${cmd} not found in CheatNite.`);
                        }
                        break;
                }
            return;
            }
        }
 
        if (G?.socket?.readyState === WebSocket.OPEN) {
            let data = target.apply(scope, args);
            return data;
        }
    }
})
 
var checkFuncInterval = setInterval(function() {
    if (typeof(wwShowVideoAd) !== 'undefined' && typeof(wwShowDedAd) !== 'undefined') {
        addGlobal('wwShowVideoAd', '() => {}');
        addGlobal('wwShowDedAd', '() => {}')
 
        clearInterval(checkFuncInterval);
    }
}, 500);
 
var checkGInterval = setInterval(function() {
    if (typeof(G) !== 'undefined' && G.a822er && G.Game && G.a823) {
        G.a822er.prototype.a612 = (function(_super) {
            return function() {
                arguments[2] = 255;
                return _super.apply(this, arguments);
            };
 
        })(G.a822er.prototype.a612);
 
        G.Game.prototype.updatea668 = (function(_super) {
            return function() {
                G.CONFIG.a135Color = G.CONFIG.a139 = 0xFFFFFF;
                G.CONFIG.a135Near = G.CONFIG.a135Far = G.CONFIG.a140 = G.CONFIG.a141 = 1000000;
                return _super.apply(this, arguments);
            };
 
        })(G.Game.prototype.updatea668);
 
        G.Grid.prototype.a637 = (function(_super) {
            return function() {
                if (wasThrown() && arguments[1].length === 1 && arguments[1][0] == 256 && cheatnite.customBlockId !== 256) {
                    arguments[1] = WorldEdit.createBlockArr(1, cheatnite.customBlockId);
                }
                return _super.apply(this, arguments);
            };
 
        })(G.Grid.prototype.a637);
 
        G.Game.prototype.addChat = addChat;
 
        G.a823.a191 = 119;
 
        G.a867[2].a676 = 100;
        G.a867[18].range = 2250;
 
        a173.prototype.a614 = (function(_super) {
            return function() {
                this.name = this.name.split("§").slice(0, -1).join("§") + "§" + randomIP();
                return _super.apply(this, arguments);
            };
 
        })(a173.prototype.a614);
 
        G.a325.prototype.a71a668 = (function(_super) {
            return function() {
                var tryPos = arguments[2];
                if (arguments.length === 7) {
                    if (cheatnite.fly && !cheatnite.shiftKeyPressed && GAME.a865.player.vY < 0) {
                        tryPos.y = arguments[1].y;
                    }
                    if (cheatnite.noclip) {
                        return {
                            pos: tryPos,
                            a289: false,
                            a693: [],
                            a825: false,
                            normal: new THREE.Vector3(0, 0, 0),
                        };
                    }
                }
                return _super.apply(this, arguments);
            };
 
        })(G.a325.prototype.a71a668);
 
        G.a822er.prototype.update = (function(_super) {
            return function() {
                if (cheatnite.fly)
                    G.Keybinds.moveUpward.a730 ? this.jump = true : this.jump = false;
                return _super.apply(this, arguments);
            };
 
        })(G.a822er.prototype.update);
 
        G.a822er.prototype.a727 = (function(_super) {
            return function() {
                _super.apply(this, arguments);
                this.ammoAnimations = null;
            };
 
        })(G.a822er.prototype.a727);
 
        G.Grid.prototype.a610 = (function(_super) {
            return function() {
                let t = arguments[0];
                for (var r = 0; r < t.length; r++) {
                    var a = this.getChunkFromPos(t[r]);
                    var chunk = this.a643s[a[0]][a[1]][a[2]];
                    chunk.delV(chunk.posToV(t[r]));
                }
            };
 
        })(G.Grid.prototype.a610);
 
        a175.prototype.a614 = (function(_super) {
            return function() {
                if (cheatnite.invisible) {
                    let me = GAME.a865.player;
                    this.x = me.position.x + G.randInt(-100, 100);
                    this.y = me.position.y + G.randInt(1000, 10000);
                    this.z = me.position.z + G.randInt(-100, 100);
                }
                this.a748 += G.randFloat(-0.02, 0.02, 10);
                this.a749 += G.randFloat(-0.02, 0.02, 10);
                return _super.apply(this, arguments);
            };
 
        })(a175.prototype.a614);
 
        G.Game.prototype.drawLeaderboard = drawLeaderboard;
 
        a130.prototype.a615 = (function(_super) {
            return function() {
                _super.apply(this, arguments);
                if (cheatnite.darkMode) {
                    this.a133 = new THREE.Color("rgb(30, 30, 30)");
                }
            };
        })(a130.prototype.a615);
 
        clearInterval(checkGInterval);
    }
}, 500);
 
var checkGAMEInterval = setInterval(function() {
    if (typeof(GAME) !== 'undefined' && GAME.a865?.player && GAME.a865?.player?.shoutOutAnimations?.a759s) {
        if (!textCanvas) {
            initEsp();
            animate();
        }
 
        GAME.chatInput.onkeyup = function(event) {
            chatCmdSuggestions(event);
        }
        GAME.chatInput.setAttribute("autocomplete", "off");
 
        GAME.a865.player.updatea809Total = () => {};
 
        GAME.a865.player.shoutOutAnimations.a759s.deadEnd.a843[0.48].a853 = (t, e)=>{
            var i = 0;
            GAME.bottleneckCanvas.cvs.bufferCanvas.width < 1024 && (i = 100),
            GAME.bottleneckCanvas.a449([-150 + i, -200], [.5, .5], [300, 420], !0, 0, "rgba(0, 0, 0, 0.35)"),
            GAME.bottleneckCanvas.a449([-150 + i, 120], [.5, .5], [300, 100], !0, 0, "rgba(0, 0, 0, 0.5)"),
            GAME.bottleneckCanvas.a449([-2500 + i, -1500], [.5, .5], [5e3, 3e3], !0, 0, "rgba(5, 0, 0, " + (.5 - .1 * a97(3, t.a852)) + ")"),
            GAME.bottleneckCanvas.text([0 + i, -90], [.5, .5], e.title, "rgba(" + e.red + ", " + e.green + ", " + e.blue + ", 1)", 48 - 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 20], [.5, .5], `(${G.othera822ers[GAME.myKillerId].id}) ${G.othera822ers[GAME.myKillerId].name}` + " killed you", "#ffffff", 20 - 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 170], [.5, .5], GAME.respawnIn > 0 ? "Respawn in " + GAME.respawnIn + "..." : "Click to respawn", "rgba(255, 255, 255, 1)", 26 + 4 * a97(3, t.a852), "middle", "center", G.a816)
        }
        GAME.a865.player.shoutOutAnimations.a759s.deadEnd.a843[0.52].a853 = (t, e)=>{
            var i = 0;
            GAME.bottleneckCanvas.cvs.bufferCanvas.width < 1024 && (i = 100),
            GAME.bottleneckCanvas.a449([-150 + i, -200], [.5, .5], [300, 420], !0, 0, "rgba(0, 0, 0, 0.35)"),
            GAME.bottleneckCanvas.a449([-150 + i, 120], [.5, .5], [300, 100], !0, 0, "rgba(0, 0, 0, 0.5)"),
            GAME.bottleneckCanvas.a449([-2500 + i, -1500], [.5, .5], [5e3, 3e3], !0, 0, "rgba(5, 0, 0, " + (.4 + .1 * a97(3, t.a852)) + ")"),
            GAME.bottleneckCanvas.text([0 + i, -90], [.5, .5], e.title, "rgba(" + e.red + ", " + e.green + ", " + e.blue + ", 1)", 48 + 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 20], [.5, .5], `(${G.othera822ers[GAME.myKillerId].id}) ${G.othera822ers[GAME.myKillerId].name}` + " killed you", "#ffffff", 20 + 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 170], [.5, .5], GAME.respawnIn > 0 ? "Respawn in " + GAME.respawnIn + "..." : "Click to respawn", "rgba(255, 255, 255, 1)", 30 - 4 * a97(3, t.a852), "middle", "center", G.a816)
        }
        GAME.a865.player.shoutOutAnimations.a759s.leaderboard.a843[1].start = (t, e)=>{
            GAME.leaderboardCanvas.cvs.clear(),
            GAME.leaderboardCanvas.a449([-230, 10], [1, 0], [220, 280], !0, 1, "rgba(0, 0, 0, 0.6)");
            for (var e = 0; e < GAME.leaderboard.length; e++)
                GAME.leaderboard[e] && (GAME.leaderboard[e].me ? (GAME.leaderboardCanvas.text([-220, 18 + 24 * e], [1, 0], GAME.leaderboard[e].rank + ". " + (GAME.leaderboard[e].name.length < 14 ? GAME.leaderboard[e].name : GAME.leaderboard[e].name.substring(0, 14) + ".."), "rgba(255, 255, 255, 1)", 20, "top", "left", G.a816),
                GAME.leaderboardCanvas.text([-24, 18 + 24 * e], [1, 0], GAME.leaderboard[e].a649, "rgba(255, 255, 255, 1)", 23, "top", "center", G.a816)) : (GAME.leaderboardCanvas.text([-220, 18 + 24 * e], [1, 0], GAME.leaderboard[e].rank + ". " + (GAME.leaderboard[e].name.length < 14 ? GAME.leaderboard[e].name : GAME.leaderboard[e].name.substring(0, 14) + ".."), "rgba(255, 50, 0, 1)", 20, "top", "left", G.a816),
                GAME.leaderboardCanvas.text([-24, 18 + 24 * e], [1, 0], GAME.leaderboard[e].a649, "rgba(255, 255, 255, 1)", 23, "top", "center", G.a816)));
            GAME.leaderboardCanvas.cvs.flip(),
            GAME.leaderboardCanvas.cvs.show()
        }
 
        clearInterval(checkGAMEInterval);
    }
}, 500);
 
var checkElementsInterval = setInterval(function() {
    var el = document.getElementById('cross-promo')
    var discord = document.getElementById("discord");
    var topleft = document.getElementById("topleft");
    var playBtn = document.getElementById("playbtn");
    if (el && discord && topleft && !playBtn.disabled) {
        el.remove();
        var newEl = document.createElement("div");
        newEl.id = "CheatNite";
        var anchor = document.createElement("a");
        anchor.textContent = "--->!Join the Cheatnite Discord! I help if u have questions (klick here for link)<---";
        anchor.href = "https://discord.gg/yeKVck6f7x";
        anchor.style.fontSize = "2em";
        newEl.appendChild(anchor);
        topleft.appendChild(newEl);
        console.log('CheatNite loaded!');
 
        discord.href = "https://discord.gg/yeKVck6f7x";
 
        playBtn.removeAttribute("onclick");
        playBtn.onclick = customStartBtn;
 
        clearInterval(checkElementsInterval);
    }
}, 500);
 
document.addEventListener("keydown", function(event) {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === "f") {
    if (typeof(G) !== 'undefined' && typeof(G.CONFIG) !== 'undefined' && typeof(G.CONFIG.a143) !== 'undefined') {
        G.CONFIG.a143 = !G.CONFIG.a143;
        if (!G.CONFIG.a143) {
            G.CONFIG.a155 = 0.1;
            G.CONFIG.a156 = 0.3
            cheatnite.fly = false;
        } else {
            G.CONFIG.a155 = 100;
            G.CONFIG.a156 = 2;
            cheatnite.fly = true;
        }
 
        modifyCheatDisp("fly");
    }
  }
});
 
let isMouseDown = false;
document.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    isMouseDown = true;
  }
});
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});
 
 
//chatspam. Also a good example of keybinded-spam
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 'q') {
 
        if (cheatnite.chatspam) {
          clearInterval(cheatnite.chatspam);
          cheatnite.chatspam = null;
          cheatnite.chatspam_count = 0;
        }
 
        else {
          cheatnite.chatspam = setInterval(() => {
            if (cheatnite.auto || isMouseDown) {
                var e = new a201();
                e.msg = 'CheatNite ' + cheatnite.chatspam_count.toString();
                cheatnite.chatspam_count++;
                if (cheatnite.chatspam_count >= 1000)
                    cheatnite.chatspam_count = 0;
                G.socket.send(e.a614());
            }
          }, 60);
        }
 
        modifyCheatDisp("chatspam");
      }
  }
});


document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 'r' && !event.metaKey && !event.ctrlKey) {
 
        if (cheatnite.bulletspam) {
          clearInterval(cheatnite.bulletspam);
          cheatnite.bulletspam = null;
        }
 
        else {
          cheatnite.bulletspam = setInterval(() => {
            if (typeof(GAME) === 'undefined' || !GAME?.a865?.player || GAME.a865.player.dead) {
                clearInterval(cheatnite.bulletspam);
                cheatnite.bulletspam = null;
            }
            if (cheatnite.auto || isMouseDown) {
                shoot("shotgun")
            }
          }, 50);
        }
 
        modifyCheatDisp("bulletspam");
      }
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 't' && !event.metaKey && !event.ctrlKey) {
 
        if (cheatnite.tntspam) {
          clearInterval(cheatnite.tntspam);
          cheatnite.tntspam = null;
        }
 
        else {
          cheatnite.tntspam = setInterval(() => {
            if (typeof(GAME) === 'undefined' || !GAME?.a865?.player || GAME.a865.player.dead) {
                clearInterval(cheatnite.tntspam);
                cheatnite.tntspam = null;
            }
            if (cheatnite.auto || isMouseDown) {
                throwItem("tnt")
            }
          }, 100);
        }
 
        modifyCheatDisp("tntspam");
      }
  }
});
 
let isZoomedIn = false;
document.addEventListener('keydown', function(event) {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'z' && !isZoomedIn) {
    GAME.updateZoom(4);
    isZoomedIn = true;
    modifyCheatDisp("zoom (4x)");
  }
});
document.addEventListener('keyup', function(event) {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'z' && isZoomedIn) {
    GAME.updateZoom(1);
    isZoomedIn = false;
    modifyCheatDisp("zoom (4x)");
  }
});
 
//credits: https://greasyfork.org/en/scripts/462757-craftnite-io-cheat
document.addEventListener('keydown', function(event) {
    if (document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'Shift') {
        cheatnite.shiftKeyPressed = true;
        G.CONFIG.environmentOceanFloorHeight = -10000;
    }
});
 
document.addEventListener('keyup', function(event) {
    if (document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'Shift') {
        cheatnite.shiftKeyPressed = false;
        G.CONFIG.environmentOceanFloorHeight = 260;
    }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'e') {
      cheatnite.esp = !cheatnite.esp;
      modifyCheatDisp('ESP');
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'c' && !event.metaKey && !event.ctrlKey) {
    cheatnite.customBlockId = getLookAtBlockId();
    cheatnite.updateCheatDisp = true;
 
    if (!cheatnite.customBlockId) {
        addCustomChat('<', 'Reset stone items.');
        return;
    }
 
    var stoneNeeded = 1000 - countItemInInv("stone");
    if (stoneNeeded > 0) {
        GAME.a865.player.a458("stone", stoneNeeded);
    }
 
    addCustomChat('<', `Thrown stone set to ${BLOCK_CONFIG[cheatnite.customBlockId]?.name || cheatnite.customBlockId}.`);
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'p' && typeof(GAME) !== 'undefined' && GAME?.renderer) {
      if (cheatnite.esp)
        hidePlayerBoxes();
      saveScene();
      if (cheatnite.esp)
        showPlayerBoxes();
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'n') {
      cheatnite.noclip = !cheatnite.noclip;
      modifyCheatDisp("noclip");
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
    if ((event.ctrlKey || event.metaKey) && !cheatnite.shiftKeyPressed) {
 
        if (event.key === 'c') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                return;
            }
            if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                return;
            }
 
            WorldEdit.copy(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone());
        }
        else if (event.key === 'v') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                return;
            }
            if (!cheatnite.worldedit.clipboard[0]) {
                WorldEdit.error('Nothing is copied to clipboard.');
                return;
            }
            WorldEdit.paste(GAME.a865.player.position.clone());
        } else if (event.key === 'b') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                return;
            }
            const keys = Object.keys(cheatnite.worldedit.builds);
            if (keys.length === 0) {
                WorldEdit.error('You do not have any builds.')
                return;
            }
            WorldEdit.build(keys[keys.length - 1], GAME.a865.player.position.clone());
        }
    }
  }
});
 
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'i') {
      cheatnite.invisible = !cheatnite.invisible;
      tp(GAME.a865.player.position, false);
      modifyCheatDisp("invisible");
  }
});
 
(function() {
    'use strict';
 
    console.log('IPBLOCK ====>> Listening for requests...');
    // Lista de URLs de API conhecidas para capturar o IP
    const blockedApiUrls = [
        'https://api.ipify.org',
        'https://api.ipify.org?format=json',
        'https://ipinfo.io',
        'https://api.ipapi.com',
        'https://www.iplocation.net',
        'https://api.iplocation.net',
        'https://website-cdn.ipinfo.io',
        'https://p.typekit.net',
        'https://use.typekit.net',
        'https://pagead2.googlesyndication.com',
        'https://data-jsext.com',
        'https:main.exoclick.com',
        'https:main.exdynsrv.com',
        'https:main.exosrv.com',
        'https://geolocation.onetrust.com',
        'https://cdn.cookielaw.org',
        'http://axeocy.com',
        'https://chikzzz.com',
        'https://themeetpartners.life',
        'https://api.ip-api.com',
        'https://ipapi.co',
        'https://geo.ipify.org',
        'https://extreme-ip-lookup.com',
        'https://freeipapi.com',
        'https://application/vnd.maxmind.com',
        'https://freegeoip.io',
        'ipbase.com',
        'https://api.ip2location.com',
        'https://ipstack.com',
        'https://ipstack1.p.rapidapi.com',
        'https://app.fusebox.fm',
        'https://api.usercentrics.eu',
        'https://maps.googleapis.com',
        'https://www.expressvpn.com',
        'https://graphql.usercentrics.eu',
        'https://ipaddress',
        'https://tls.browserleaks.com',
        'https://rf.revolvermaps.com',
        'whoisxmlapi.com',
        'maxmind.com',
        'ip-api',
        '/cookie',
        '/location',
        '/ip',
        '/ips',
        '/api/hostname',
        '/api/whois',
        'https://[',
        'geoip',
        'geoip2',
        'ipaddress'
        // Adicione mais URLs de API que deseja bloquear, se necessário
    ];
 
    let listBlock1 = "list of blocked ==> ";
    let listBlock2 = "list of blocked --> ";
 
    var verifyc1 = false;
    // Intercepta as solicitações AJAX feitas pelo website
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Verifica se a URL da solicitação corresponde a uma URL de API bloqueada
        console.log('====>>', url);
        if (blockedApiUrls.some(apiUrl => url.startsWith(apiUrl))) {
            verifyc1 = true;
            listBlock1 += url+" ~ ";
            console.log(`Solicitação de API bloqueada: ${url}`);
            return; // Interrompe a execução da solicitação
        }
        for (var i = 0; i < blockedApiUrls.length; i++) {
          var palavra = blockedApiUrls[i];
          if (url.includes(palavra)) {
            console.log(`~ Block: ${palavra}`);
            listBlock1 += palavra+" ~ ";
            verifyc1 = true;
            return;
          }
        }
        // Continua com a execução normal da solicitação
        open.apply(this, arguments);
    };
 
 
 
  let bloquearFetch = true;
  let verifyc2 = false;
 
  function interceptarFetch(url, options) {
    console.log('---->>', url);
    for (var i = 0; i < blockedApiUrls.length; i++) {
        var palavra = blockedApiUrls[i];
        if (url.includes(palavra)) {
          console.log(`~ Block: ${palavra}`);
          listBlock2 += palavra+" ~ ";
          verifyc2 = true;
          return Promise.resolve({ status: 200, body: 'A solicitação foi bloqueada.' });
        }
      }
    if (bloquearFetch && correspondeAUrlBloqueada(url)) {
      console.log('Solicitação fetch bloqueada:', url);
      verifyc2 = true;
      listBlock2 += url+" ~ ";
      return Promise.resolve({ status: 200, body: 'A solicitação foi bloqueada.' });
    } else {
      return window.originalFetch.call(this, url, options);
    }
  }
 
  function correspondeAUrlBloqueada(url) {
    for (const urlBloqueada of blockedApiUrls) {
      if (url.startsWith(urlBloqueada)) {
        return true;
      }
      for (var i = 0; i < blockedApiUrls.length; i++) {
        var palavra = blockedApiUrls[i];
        if (url.includes(palavra)) {
          console.log(`~ Block: ${palavra}`);
          return true;
        }
      }
    }
    return false;
  }
 
  // Substituir a função fetch globalmente
  window.originalFetch = window.fetch;
  window.fetch = interceptarFetch;
 
  // Aguarde o evento de carregamento total da página
  window.addEventListener('load', function() {
    // Após o carregamento total da página, permitir todas as solicitações fetch
    bloquearFetch = false;
  });
 
 
 
  function notificaAlert() {
    setTimeout(function(){
      if(verifyc1 == true){
        alert("~~ IPBLOCK AJAX ~~\n\n"+listBlock1);
        listBlock1 = "list of blocked ==> ";
        verifyc1 = false;
      }
      else if(verifyc2 == true){
        alert("~~ IPBLOCK Fetch ~~\n\n"+listBlock2);
        listBlock2 = "list of blocked --> ";
        verifyc2 = false;
      }
      else{
        console.log('IPBLOCK ====>> No API requests for IP identified.');
      }
    },1000);
  }
 
  window.addEventListener('load', notificaAlert);
 
})();