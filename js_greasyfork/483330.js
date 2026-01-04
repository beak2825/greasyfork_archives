// ==UserScript==
// @name         Cryptoroyale
// @namespace    https://cryptoroyale.one/*
// @version      0.1
// @description  Yes
// @author       Hashy
// @match        https://cryptoroyale.one/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/483330/Cryptoroyale.user.js
// @updateURL https://update.greasyfork.org/scripts/483330/Cryptoroyale.meta.js
// ==/UserScript==
(function() {
    let mods = {
        packs: {
            "Hide rules":{
                turnOn: function(){
                    mods.getLeftPanel(/Collision Rules/).hide();
                },
                turnOff: function(){
                    mods.getLeftPanel(/Collision Rules/).show();
                }
            },
            "HP & Boost Mod":{
                turnOn: function(){
                    socket.on("p", this.updateNicknames);
                },
                turnOff: function(){
                    socket.off("p", this.updateNicknames);
                },
                boost_values: [35, 47, 63, 84, 112, 150, 200, 267, 356, 475, 633, 844, 1126, 1501, 2002, 2669, 3559, 4746, 6328, 8437],
                updateNicknames: function(){
                    let ids = Object.keys(game_state.players);
                    for (let i of ids) {
                        let p = game_state.players[i];
                        let boosts = mods.packs["HP & Boost Mod"].boost_values.indexOf(Math.max.apply(Math, mods.packs["HP & Boost Mod"].boost_values.filter(function (x) { return x <= p.HP }))) + 1;
                        p.username = `${p.username} ${Math.round(p.HP)} [${boosts}]`;
                    }
                }
            },
            "Boost counter":{
                init: function(){
                    $("#game-parent").append(`<p id="boost-mod" style="position: absolute; color: white; top: 10px; left: 10px; border: 2px dashed white; padding: 10px;">Used boost: <span id="boost-counter">0</span><button type="button" class="btn btn-light" style="margin-left: 10px;" onclick="$('#boost-counter').text('0')">Reset counter</button></p>`);
                    $("#boost-mod").hide();
                },
                turnOn: function(){
                    $("#game-parent canvas").on("click", this.incrementCounter);
                    $("#boost-mod").show();
                },
                turnOff: function(){
                    $("#game-parent canvas").off("click", this.incrementCounter);
                    $("#boost-mod").hide();
                },
                incrementCounter: function(){
                    $("#boost-counter").text(parseInt($("#boost-counter").text())+1);
                }
            },
            "White boxes counter":{
                init: function(){
                    $("#game-parent").append(`<p id="white-mod" style="position: absolute; color: white; top: 10px; right: 10px;"><span id="white-counter">0</span> ⬜</p>`);
                    $("#white-mod").hide();
                },
                turnOn: function(){
                    socket.on("box", this.incrementCounter);
                    socket.on("game_started", this.resetCounter);
                    $("#white-mod").show();
                },
                turnOff: function(){
                    socket.off("box", this.incrementCounter);
                    socket.off("game_started", this.resetCounter);
                    $("#white-mod").hide();
                },
                incrementCounter: function(){
                    setTimeout(()=>{
                        let boxes = Object.keys(user_state.cloud.loot);
                        if(user_state.cloud.loot[boxes[boxes.length-1]][0]==""){
                            $("#white-counter").text(parseInt($("#white-counter").text())+1);
                        }
                    },50);
                },
                resetCounter: function(){
                    $("#white-counter").text("0");
                }
            },
            "Boxes calculator":{
                init: function(){
                    mods.packs["Boxes calculator"].boxPanelTitle = mods.getLeftPanel(/Last player alive wins/).find("h4.sub-title").first();
                    mods.packs["Boxes calculator"].boxesElement = mods.getLeftPanel(/Last player alive wins/).find("div.smooth-div div div div").first();
                },
                turnOn: function(){
                    this.calculateValue();
                    socket.on("box", this.calculateValue);
                    mods.packs["Boxes calculator"].boxesElement.on("click", "div.prevent-boost.cardList.list-complete-item", this.calculateValue);
                },
                turnOff: function(){
                    socket.off("box", this.calculateValue);
                    mods.packs["Boxes calculator"].boxesElement.off("click", "div.prevent-boost.cardList.list-complete-item", this.calculateValue);
                    mods.packs["Boxes calculator"].boxPanelTitle.text("Last player alive wins");
                },
                calculateValue: function(){
                    setTimeout(()=>{
                        let boxes = Object.values(user_state.cloud.loot);
                        let sum = 0;
                        for(let b of boxes) sum+=(b[1]/b[2])/100 * (b[0].length > 0 && b[0] != "T" ? 2 : 1);
                        mods.packs["Boxes calculator"].boxPanelTitle.text(`Boxes value: ${parseFloat(sum).toFixed(3)} ROY`);
                    },50);
                }
            },
            "Recording":{
                init: function(){
                    mods.packs["Recording"].canvas = document.querySelector("#game-parent canvas");
                },
                turnOn: function(){
                    const chunks = []; // here we will store our recorded media chunks (Blobs)
                    const stream = mods.packs["Recording"].canvas.captureStream(); // grab our canvas MediaStream
                    mods.packs["Recording"].rec = new MediaRecorder(stream); // init the recorder
                    // every time the recorder has new data, we will store it in our array
                    mods.packs["Recording"].rec.ondataavailable = e => chunks.push(e.data);
                    // only when the recorder stops, we construct a complete Blob from all the chunks
                    mods.packs["Recording"].rec.onstop = e => mods.packs["Recording"].exportVid(new Blob(chunks, {type: 'video/webm'}));
                    mods.packs["Recording"].rec.start();
                },
                turnOff: function(){
                    mods.packs["Recording"].rec.stop();
                },
                exportVid: function(blob){
                    const vid = document.createElement('video');
                    vid.src = URL.createObjectURL(blob);
                    vid.controls = true;
                    window.open(vid.src);
                }

            },
            "Royale Assembly":{
                turnOn: function(){
                    this.initialHeight = $("#left-col div.smooth-div").css("height");
                    $("#left-col div.smooth-div").css("height", "");
                    $("#left-col div.smooth-div > div > div > div").prepend("<div id='boxesCodeOutput' style='width: 100%; text-align: left;'>Output: Press the button first</div>");
                    $("#left-col div.smooth-div > div > div > div").prepend("<button id='executeBoxesBtn' style='margin: 5px;' class='btn btn-light'>Execute boxes</button>");
                    $("#executeBoxesBtn").on("click", this.executeCode);
                    this.observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutationRecord) {
                            $("#left-col div.smooth-div").css("height", "");
                        });    
                    });
                    let target = document.querySelector("#left-col div.smooth-div");
                    this.observer.observe(target, { attributes : true, attributeFilter : ['style'] });
                },
                turnOff: function(){
                    this.observer.disconnect();
                    $("#left-col div.smooth-div").css("height", this.initialHeight);
                    $("#executeBoxesBtn").off();
                    $("#executeBoxesBtn").remove();
                    $("#boxesCodeOutput").remove();
                },
                executeCode: function(){
                    let codeOutput = "Output: ";
                    let boxes = Object.values(user_state.cloud.loot);
                    let code = "";
                    let THIS = mods.packs["Royale Assembly"];
                    THIS.vars = {};
                    THIS.labels = {};
                    THIS.flags = {};
                    if(boxes.length>0){
                        for(let b of boxes){
                            if(b[0].startsWith(".")){
                                if(b[0]=="."){
                                    code+="_";
                                } else {
                                    code+=b[0][1];
                                }
                            } else if(['P','R','S'].includes(b[0])){
                                code+=['c','m','y'][['P','R','S'].indexOf(b[0])];
                            } else {
                                code+="?";
                            }
                        }
                        code = code.match(/.{1,4}/g);
                        for(let i=0; i<code.length; i++){
                            if(code[i].startsWith("c")){
                                if(i%2==0) i++;
                            } else if(code[i].startsWith("m")) {
                                THIS.labels[code[i][1]] = i;
                            }
                        }
                        for(let i=0; i<code.length; i++){
                            if(code[i].startsWith("c")){
                                if(i%2==0) i++;
                            } else if(code[i].startsWith("m")) {
                                continue;
                            } else if(code[i].startsWith("STV")) {
                                THIS.vars[code[i][3]] = THIS.calculateValue(code[i+1]);
                                i++;
                            } else if(code[i].startsWith("CLR")) {
                                THIS.vars[code[i][3]] = 0;
                            } else if(code[i].startsWith("INC")) {
                                THIS.vars[code[i][3]]++;
                            } else if(code[i].startsWith("ADD")) {
                                THIS.vars[code[i][3]] = (THIS.vars[code[i][3]] + THIS.calculateValue(code[i+1]))%256;
                                i++;
                            } else if(code[i].startsWith("DEC")) {
                                THIS.vars[code[i][3]]--;
                                if(THIS.vars[code[i][3]]<0) THIS.vars[code[i][3]]+=256;
                            } else if(code[i].startsWith("SUB")) {
                                THIS.vars[code[i][3]] -= THIS.calculateValue(code[i+1]);
                                if(THIS.vars[code[i][3]]<0) THIS.vars[code[i][3]]+=256;
                                i++;
                            } else if(code[i].startsWith("JMP")) {
                                i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("CMP")) {
                                let r = THIS.vars[code[i][3]] - THIS.calculateValue(code[i+1]);
                                THIS.flags['-'] = r<0;
                                THIS.flags['0'] = r==0;
                                THIS.flags['+'] = r>0;
                                i++;
                            } else if(code[i].startsWith("BLE")) {
                                if(THIS.flags['-'] || THIS.flags['0']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("BLT")) {
                                if(THIS.flags['-']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("BEQ")) {
                                if(THIS.flags['0']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("BNQ")) {
                                if(!THIS.flags['0']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("BGT")) {
                                if(THIS.flags['+']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("BGE")) {
                                if(THIS.flags['+'] || THIS.flags['0']) i = THIS.labels[code[i][3]];
                            } else if(code[i].startsWith("END")) {
                                break;
                            } else if(code[i].startsWith("LOG")) {
                                let z = String.fromCharCode(THIS.vars[code[i][3]]);
                                codeOutput+=THIS.vars[z];
                            } else if(code[i].startsWith("PRT")) {
                                let z = String.fromCharCode(THIS.vars[code[i][3]]);
                                codeOutput+=String.fromCharCode(THIS.vars[z]);
                            } else if(code[i]!="____"){
                                codeOutput+=` [Unknown operation at block ${i} = ${code[i]}] `;
                            }
                        }
                    } else {
                        codeOutput+="No boxes found";
                    }
                    $("#boxesCodeOutput").text(codeOutput);
                },
                calculateValue: function(val){
                    if(val.startsWith("RDV")){
                        return this.vars[val[3]];
                    } else if(/[_cmy]{4}/.test(val)){
                        let n = "";
                        for(let c of val) n+=['_','c','m','y'].indexOf(c);
                        return parseInt(n, 4);
                    } else {
                        return 0;
                    }
                },
                vars: {},
                labels: {},
                flags: {}
            }
        },
        settings: {},
        htmlPanel: `<li class="timeline fade-when-gaming" data-v-ff11dc46="" style="opacity: 1;"><h4 data-v-ff11dc46=""> Mods  <a data-v-ff11dc46=""><i class="prevent-boost fas fa-hammer fa-sm" data-v-ff11dc46=""></i></a></h4><p data-v-ff11dc46="">Click the hammer to expand.<br data-v-ff11dc46="">Made by ROY_TO_THE_MOON</p><div style="display: flex; flex-direction: column; align-items: flex-end; margin-top: 10px; margin-bottom: 40px;" class="prevent-boost" data-v-ff11dc46=""></div></li>`,
        htmlOption: function(name){
            return `<div style="margin-top: 5px;"><label style="color: white;"><input type="checkbox">${name}</label></div>`;
        },
        getLeftPanel: function(innerRegExp){
            return $("#left-col").find("li").filter(function () {return innerRegExp.test(this.innerHTML);});
        },
        init: function(){
            this.getLeftPanel(/Boxes provide health/).remove();
            this.getLeftPanel(/Collision Rules/).after(this.htmlPanel);
            this.hammerIcon = this.getLeftPanel(/Mods/).find("i.fa-hammer");
            this.descriptionElement = this.getLeftPanel(/Mods/).find("p");
            this.optionsElement = this.getLeftPanel(/Mods/).find("div");
            for(const p in this.packs){
                this.settings[p]=false;
                this.optionsElement.append(this.htmlOption(p));
            }
            this.optionsElement.hide();
            this.hammerIcon.on("click", function(){
                mods.descriptionElement.toggle();
                mods.optionsElement.toggle();
            });
            this.optionsElement.find("input[type='checkbox']").on("change", function(){
                let modName = $(this).parent().text();
                mods.settings[modName] = this.checked;
                if(this.checked) {
                    mods.packs[modName].turnOn();
                } else {
                    mods.packs[modName].turnOff();
                }
            });
            this.initAllMods();
        },
        initAllMods: function(){
            $("#game-parent").css("position","relative");
            for(const p in this.packs){
                if(this.packs[p].hasOwnProperty("init")){
                    this.packs[p].init();
                }
            }
        }
    };
    mods.init();
})();