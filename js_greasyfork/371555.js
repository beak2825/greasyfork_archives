// ==UserScript==
// @name         TagPro Komacro
// @description  Macro's // edit in-game // map-specific // no-script compatible // key combinations
// @author       Ko
// @version      5.1
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @icon         https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/MacroKey.png
// @website      https://redd.it/9a7u4w
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      koalabeast.com
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/371555/TagPro%20Komacro.user.js
// @updateURL https://update.greasyfork.org/scripts/371555/TagPro%20Komacro.meta.js
// ==/UserScript==

/* TODO

Disable input when composing a message

*/

(function(){



    var chars={8:"⌫",9:"↹",13:"↩",16:"⇧",17:"✲",18:"⎇",19:"❚❚",20:"⇪",27:"⎋",32:"␣",33:"⇞",34:"⇟",35:"⇲",36:"⇱",37:"◀",38:"▲",39:"▶",40:"▼",45:"⎀",46:"⌦",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:navigator.platform.toLowerCase().includes("mac")?"⌘":"⊞",93:"≣",96:"0️⃣",97:"1️⃣",98:"2️⃣",99:"3️⃣",100:"4️⃣",101:"5️⃣",102:"6️⃣",103:"7️⃣",104:"8️⃣",105:"9️⃣",106:"✖️",107:"➕",109:"➖",110:"▣",111:"➗",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"⇭",145:"⇳",182:"💻",183:"🖩",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};






    // =====STYLE SECTION=====



    // Create our own stylesheet to define the styles in:

    var style = document.createElement('style');
    document.head.appendChild(style);
    style.id = 'komacro-style';

    var styleSheet = style.sheet;

    // The 'type' button next to a macro
    styleSheet.insertRule(` .komacro-type { width: 100%; padding: 0; height: 37px; font-weight: bolder; color: black; }`);

    styleSheet.insertRule(` .komacro-type:active, .komacro-type:focus, .komacro-type:hover { background: darkseagreen; color: black; animation: unset; }`);

    // Put text on the type button
    styleSheet.insertRule(` .komacro-type[data-type=all]::after   { content: "all";   }`);
    styleSheet.insertRule(` .komacro-type[data-type=team]::after  { content: "team";  }`);
    styleSheet.insertRule(` .komacro-type[data-type=group]::after { content: "group"; }`);
    styleSheet.insertRule(` .komacro-type[data-type=mod]::after   { content: "mod";   }`);

    styleSheet.insertRule(` @keyframes teamcolors { from {background: #FFB5BD;} to {background: #CFCFFF;} }`);

    styleSheet.insertRule(` .komacro-type[data-type=all]   { background: white;  }`);
    styleSheet.insertRule(` .komacro-type[data-type=team]  { background: linear-gradient(135deg, #FF7F7F, #7F7FFF); }`);
    styleSheet.insertRule(` .komacro-type[data-type=group] { background: #E7E700; }`);
    styleSheet.insertRule(` .komacro-type[data-type=mod]   { background: #00B900; }`);

    styleSheet.insertRule(` .komacro-combo::placeholder { font-size: small; font-style: italic; }`);

    styleSheet.insertRule(` .komacro-del:hover, .komacro-del:active, .komacro-del:focus { background: darkred; }`);

    styleSheet.insertRule(` #Komacro_wrapper [draggable=true] { cursor: grab; transition: padding .3s, background .3s, border .3s, box-shadow .3s; }`);

    styleSheet.insertRule(` .komacro-dragging { cursor: grabbing !important; background: #CDDC39; border-radius: 3px; border: 1px solid #827717; box-shadow: 0 3px #827717; padding: 10px 0; }`);





    // =====SOME FUNCTIONS=====



    // Get all existing maps through the TagPro JSON api

    var maps = new Promise(function(resolve,reject){

        // Imediately resolve if we have cached the maps
        if (GM_getValue('maps')) resolve(GM_getValue('maps'));

        // .. But still always fetch the new maps, for the next time
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://" + location.hostname + "/maps.json",
            onload: function(response) {
                var maps = JSON.parse(response.responseText);
                resolve(maps);
                GM_setValue('maps',maps);
            },
            onerror: reject
        });
    });

    // Update the maps in the selection boxes
    // f.e. after changing the "distinguish mirrored" option

    function update_maps() {
        maps.then(function(maps){

            [...settings.macrolist.getElementsByTagName("select")].forEach( function(select) {
                select.innerHTML = '<option value="null">all maps</option>' });

            for (var category of [maps.rotation, maps.retired]) {
                for (var mapobj of category) {

                    if (!show_mirrored && mapobj.key.endsWith("_Mirrored")) continue;

                    let option = document.createElement("option");
                    option.innerText = mapobj.name;
                    option.value = mapobj.key;

                    [...settings.macrolist.getElementsByTagName("select")].forEach(function(select){
                        select.add(option.cloneNode(true));
                        select.value = select.parentElement.parentElement.macro.map || null;
                    });
                }
            }
        });
    }


    // Save all macros in Tamper/Grease monkey

    function save_macros(){GM_setValue("macros",macros);}


    // Convert a macro to a few characters that we can display

    function visual_macro(macro) {
        var combo = [];

        if (macro.ctrlKey) combo.push(chars[17]);
        if (macro.shiftKey) combo.push(chars[16]);
        if (macro.altKey) combo.push(chars[18]);
        if (macro.metaKey) combo.push(chars[91]);
        combo.push(chars[macro.keyCode]);

        return combo.join(" ");
    }


    // Capture macro's that are typed into the box

    function capture_macro(keyevent){

        keyevent.preventDefault();

        var macro = keyevent.target.parentElement.parentElement.macro;

        macro.keyCode = keyevent.keyCode;
        macro.shiftKey = keyevent.shiftKey && keyevent.keyCode != 16;
        macro.ctrlKey = keyevent.ctrlKey && keyevent.keyCode != 17;
        macro.altKey = keyevent.altKey && keyevent.keyCode != 18;
        macro.metaKey = keyevent.metaKey && keyevent.keyCode != 91;
        macro.location = keyevent.location;

        save_macros();

        keyevent.target.value = visual_macro(macro);
    }



    var dragging = null;

    function ondragstart() {
        dragging = this;
        this.classList.add('komacro-dragging');
    }

    function ondragend() {
        dragging = this;
        this.classList.remove('komacro-dragging');
    }

    function ondragover() {
        if (this.parentNode !== dragging.parentNode) return;

        if (this == dragging) return;

        const old_pos = [...dragging.parentNode.children].indexOf(dragging);
        const new_pos = [...this.parentNode.children].indexOf(this);

        if (new_pos < old_pos) this.parentNode.insertBefore(dragging, this);
        else this.parentNode.insertBefore(dragging, this.nextSibling);

        let old_i = macros.indexOf(dragging.macro);
        let new_i = macros.indexOf(this.macro);
        return macros.splice(new_i, 0, macros.splice(old_i,1)[0]);
    }

    // Create a new macro entry in the config panel.
    // Either based on an existing macro, or a new line

    function create_macro(macro){

        // If it's a new macro
        if (!macro) {
            macro = {
                type: 'team',
                map: current_map,
            };
            if (!show_mirrored && current_map)
                macro.map = current_map.replace('_Mirrored','');
            macros.unshift(macro);
            save_macros();
        }

        var entry = document.createElement('div');
        entry.className = "form-group";

        // Dragging
        entry.draggable = true;
        entry.ondragstart = ondragstart;
        entry.ondragend = ondragend;
        entry.ondragover = ondragover;

        entry.macro = macro;

        entry.innerHTML = `
            <div class="col-xs-1"><button class="btn btn-default komacro-type"></div>
            <div class="col-xs-2"><select class="form-control"><option value="null">all maps</option></select></div>
            <div class="col-xs-2"><input type="text" readonly placeholder="type a macro..." autocomplete="off" class="form-control komacro-combo"></div>
            <div class="col-xs-6"><input type="text" autocomplete="off" class="form-control"></div>
            <div class="col-xs-1"><input type="button" value="X" class="btn btn-default komacro-del" style="width:100%;"></div>`;

        var [type,map,combo,message,remove] = [...entry.children].map(a=>a.firstElementChild);

        type.dataset.type = macro.type || 'all';
        map.value = macro.map || null;
        combo.value = visual_macro(macro);
        message.value = macro.message || '';

        type.onclick = function(){
            var types = ["all","team","group","mod","all"];
            this.dataset.type = types[types.indexOf(this.dataset.type) + 1];
            this.parentElement.parentElement.macro.type = this.dataset.type;
            save_macros();
            this.blur();
        }

        map.onchange = function(){
            this.parentElement.parentElement.macro.map = this.value;
            save_macros();
        }

        combo.onkeydown = capture_macro;

        combo.onfocus = function(){
            this.value = '';
            // Disable movement while composing a macro
            if (!tpul.noscript) tagpro.disableControls = true;
        }

        combo.onblur = function(){
            this.value = visual_macro(this.parentElement.parentElement.macro);
            if (!tpul.noscript) tagpro.disableControls = false;
        }

        message.onchange = function(){
            this.parentElement.parentElement.macro.message = this.value;
            save_macros();
        }

        // Disable movement while composing a message
        message.onfocus = function(){ if (!tpul.noscript) tagpro.disableControls = true; }
        message.onblur = function(){ if (!tpul.noscript) tagpro.disableControls = false; }

        remove.onclick = function(){
            entry.remove();
            macros.splice(macros.indexOf(this.parentElement.parentElement.macro),1);
            save_macros();
        }

        return entry;

    }





    // =====SETTINGS SECTION=====



    // I use tpul for this userscripts' options.
    // see: https://github.com/wilcooo/TagPro-UserscriptLibrary


    var settings = tpul.settings.addSettings({
        id: 'Komacro',
        title: "Configure Komacro",
        tooltipText: "Komacro",
        icon: "https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/MacroKey.png",

        buttons: ['close','reset'],

        fields: {
            show_mirrored: {
                type: 'checkbox',
                default: false,
                section: ['',"You can drag your Komacro's to reorder them."],
                label: "Distinguish mirrored maps",
            },
            neomacro: {
                type: 'checkbox',
                default: false,
                label: 'Enable <a href="https://redd.it/32qqgr">numpad magic</a>',
                title: 'Based on Neomacro'
            }
        },

        events: {
            open: function() {

                // Add all saved macros to this config panel when it opens...

                var panel = document.getElementById("Komacro_wrapper");

                var macrolist = this.macrolist = document.createElement("div");
                panel.appendChild(this.macrolist);

                for (var macro of macros) macrolist.appendChild(create_macro(macro));
                update_maps();

                var new_btn = document.createElement("button");
                new_btn.className = "btn btn-primary";
                new_btn.style = "right: 30px; position: absolute;";
                new_btn.innerText = "New Komacro";
                document.getElementById('Komacro_show_mirrored_var').appendChild(new_btn);

                new_btn.onclick = function(){
                    macrolist.insertBefore(create_macro(), macrolist.firstChild);
                    update_maps();
                }

                // Since we are not saving this GM_config, we need to save it ourselfs
                // every time an input has changed
                document.getElementById("Komacro_field_show_mirrored").onchange = function(){
                    settings.save();
                    show_mirrored = settings.get('show_mirrored');
                    update_maps();
                }

                document.getElementById("Komacro_field_neomacro").onchange = function(){
                    settings.save();
                }
            },

            close: function(){
                // By default, 'options canceled' is notified. We overwrite this notification directly after.
                setTimeout(tpul.notify,0,'Your Komacro\'s are saved!','success');
            },

            reset: function(){
                if (confirm("This will delete ALL your Komacro's!")) {
                    macros = []; save_macros();
                    this.macrolist.innerHTML = "";
                    setTimeout(tpul.notify,0,'All your Komacro\'s are deleted','warning');
                } else {
                    setTimeout(tpul.notify,0,'Nothing happened :)','warning');
                }
            },
        }
    });

    var show_mirrored = settings.get('show_mirrored');





    // =====LOGIC SECTION=====



    var macros = GM_getValue('macros', [

        // The default komacros:

        {keyCode: 71, message: "gg"},
        {keyCode: 71, shiftKey: true, message: "GG"},
        {keyCode: 72, type: "team", message: "Handing off!"},
        {keyCode: 72, type: "team", shiftKey: true, message: "On regrab"},
        {keyCode: 72, shiftKey: true, ctrlKey: true, altKey: true, map: "teamwork", message: "This map is awesome!"},
        {keyCode: 72, shiftKey: true, ctrlKey: true, altKey: true, map: "bomber", message: "Oh no.. not this map..."},
        {keyCode: 66, type: "group", message: "Back to group"},
        {keyCode: 82, type: "team", message: "We need someone on regrab!"},
        {keyCode: 77, type: "mod", message: "Please stop doing that."},

    ]);

    // All possible options:
    // keyCode, location, altKey, ctrlKey, shiftKey, metaKey, map, type, message




    var current_map = null;

    // When in a game:
    if (tpul.playerLocation == 'game') {


        // Find out what map is being played

        if (!tpul.noscript && !tagpro.map) {
            // Method 1: using the TagPro API
            // Preferable since it's the quickest

            tagpro.ready(function() {
                tagpro.socket.on('map', function(map) {
                    maps.then(function(maps){
                        var mapobj = maps.rotation.find(m=> m.author == map.info.author && m.name == map.info.name);
                        if (mapobj) current_map = mapobj.key;
                    });
                });
            });

        } else {
            // Method 2: in case of no-script
            // or if the 'map' event has been received before we could intercept it.

            var mapInfo = document.getElementById('mapInfo');

            (function getMapFromDom(i){

                // This will be tried 2 times per second for max. 10 seconds
                if (i > 20) throw 'Komacro couldn\'t find out what map is being played';

                var map = mapInfo.innerText.match(/Map: (.*) by (.*)/);

                if (!map) setTimeout(getMapFromDom, 500, ++i);

                maps.then(function(maps){
                    var mapobj = maps.rotation.find(m=> m.author == map[2] && m.name == map[1]);
                    if (mapobj) current_map = mapobj.key;
                });

            })(0);
        }


        // Listening/handling macros:



        var ignore_ctrlKey = false,
            ignore_shiftKey = false,
            ignore_altKey = false,
            ignore_metaKey = false;

        function handleMacro(keyevent) {

            // If we're recording a macro: return;
            if (keyevent.target.classList.contains('komacro-combo')) return;

            // While the controls are disabled: return;
            // (This is usually when typing a chat message or changing your name)
            if (!tpul.noscript && tagpro.disableControls) return;

            // When no-script is enabled, we can detect the chat box and name-change box like this:
            if (["chat", "name"].includes( keyevent.target.id )) return;

            var global_macro = null;

            // Find a matching macro

            for (var macro of macros) {

                if (macro.keyCode == keyevent.keyCode &&
                    (!macro.location || macro.location == keyevent.location) &&
                    !!macro.ctrlKey == !!keyevent.ctrlKey &&
                    !!macro.shiftKey == !!keyevent.shiftKey &&
                    !!macro.altKey == !!keyevent.altKey &&
                    !!macro.metaKey == !!keyevent.metaKey) {

                    // Send a macro of which the map matches:

                    if (macro.map && (macro.map == current_map ||
                        !show_mirrored && macro.map.replace('_Mirrored','') == current_map.replace('_Mirrored','') )) {
                        keyevent.preventDefault();
                        tpul.chat.emit(macro.message, macro.type);
                        return;
                    }

                    // Save the global macro, but don't send it yet.
                    // because we could find another map-specific macro.

                    if (!macro.map || macro.map == "null") global_macro = macro;
                }
            }

            // No map-specific macro has been found.
            // We can send the global macro (if we found one)

            if (global_macro) {
                keyevent.preventDefault();
                tpul.chat.emit(global_macro.message, global_macro.type);
                return;
            }
        }






        // Wait for any (non-modifier) key to be pressed

        document.addEventListener('keydown', function(keydown) {

            // Pressing down a modifier key is ignored,
            // as they could be used to modify another key.
            // Instead we look at their keyup event later.
            if (['Control','Shift','Alt','Meta'].includes(keydown.key)) return;

            // Remember what modifier keys are used during this event,
            // so that we know to ignore their next keyup.
            ignore_ctrlKey = keydown.ctrlKey;
            ignore_shiftKey = keydown.shiftKey;
            ignore_altKey = keydown.altKey;
            ignore_metaKey = keydown.metaKey;

            handleMacro(keydown);

        });


        // Wait for any modifier to be released:

        document.addEventListener('keyup', function(keyup) {

            // This time; ignore non-modifier keys
            if ( ! ['Control','Shift','Alt','Meta'].includes(keyup.key)) return;

            // Ignore modifiers that have been used to modify other keys
            if (ignore_ctrlKey  && keyup.key == 'Control' ||
                ignore_shiftKey && keyup.key == 'Shift' ||
                ignore_altKey   && keyup.key == 'Alt' ||
                ignore_metaKey  && keyup.key == 'Meta') return;

            // Remember what modifier keys are used during this event,
            // so that we know to ignore their next keyup.
            ignore_ctrlKey  |= keyup.ctrlKey;
            ignore_shiftKey |= keyup.shiftKey;
            ignore_altKey   |= keyup.altKey;
            ignore_metaKey  |= keyup.metaKey;

            handleMacro(keyup);
        });

        // (Neomacro) Numpad Magic

        (function neomacro(){

            var directions = { 1: 'bottom left', 2: 'bottom', 3: 'bottom rigth', 4: 'left', 5: 'middle', 6: 'right', 7: 'top left', 8: 'top', 9: 'top right' }

            var combo = [],
                timeout

            document.addEventListener('keydown', function(keydown) {

                if (!settings.get('neomacro')) return
                if (event.location != 3) return // the numpad
                if (event.key == '.') return reset()

                clearTimeout(timeout)
                timeout = setTimeout(reset, 2e3)

                combo.push(event.key)
                parse()
            })

            function parse () {
                switch (combo[0]) {
                    case '/':
                        if (combo[1] == '/') return send('kfc')
                        if (combo[1] <= 4) return send('past ' + combo[1])
                        if (1 in combo) return reset()
                        break
                    case '-':
                        if (combo[1] == '-') return send('base clear')
                        if (combo[1] <= 4) return send(combo[1] + ' enemies in base')
                        if (1 in combo) return reset()
                        break
                    case '*':
                        if (combo[1] == '*') return send('pups soon')
                        if (combo[1] in directions) return send(directions[combo[1]] + ' pup soon')
                        if (1 in combo) return reset()
                        break
                    case '+':
                        if (combo[1] in directions) {
                            var time = combo.slice(2).join('')
                            if (isNaN(time) || time < 0 || time > 60) return reset()
                            if (time.length == 2) return send(directions[combo[1]] + ' pup :' + time)
                            break
                        }
                        if (1 in combo) return reset()
                        break
                    default:
                        if (combo[0] in directions) return send(directions[combo[0]])
                        return reset()
                }
            }

            function reset () {
                combo.length = 0
                clearTimeout(timeout)
                tpul.notify("Try your macro again")
            }

            function send (message) {
                combo.length = 0
                clearTimeout(timeout)
                tpul.chat.emit(message, 'team')
            }
        })()

        // End of Numpad Magic
    }
})();