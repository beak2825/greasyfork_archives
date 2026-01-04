// ==UserScript==
// @name         ScratchExt
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Scratch Extension Creator.
// @author       topsno
// @match        https://www.scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35396/ScratchExt.user.js
// @updateURL https://update.greasyfork.org/scripts/35396/ScratchExt.meta.js
// ==/UserScript==

(function() {
    var scratchExt = function () {
        var _this = this;

        _this.createCat = function (name) {
            if (!_this.cats[name]) {
                _this.cats[name] = {
                    name: name,
                    blocks: []
                };
            }
        };
        _this.createBlock = function (opt) {
            if (!opt.type || !opt.name) {
                return console.error("Failed scratchExt: Creating block, required arguments in object 'type' and 'name'");
            }

            console.log(opt.callback);

            if (_this.cats[opt.cat]) {
                _this.cats[opt.cat].blocks.push({
                    type: opt.type,
                    name: opt.name,
                    presets: opt.presets,
                    cat: _this.cats[opt.cat].name,
                    callback: opt.callback || function () { return true; }
                });
            } else if (!opt.cat) {
                _this.createCat("general");

                _this.cats.general.blocks.push({
                    type: opt.type,
                    name: opt.name,
                    presets: opt.presets,
                    cat: _this.cats.general.name,
                    callback: (typeof opt.callback == "function" ? opt.callback : function () { return true; })  || function () { return true; }
                });
            } else if (true) {
                return console.error("Failed scratchExt: Creating block, Category does not exist");
            }
        };

        _this.cats = {};

        _this.load = function () {
            var ll = 0;
            while (ll < Object.keys(_this.cats).length) { 
                if (Object.keys(_this.cats)[ll]) (function () {
                    var i = Object.keys(_this.cats)[ll];

                    var funcs = {};

                    funcs._getStatus = function () {
                        return {
                            status: 2,
                            msg: 'Ready'
                        };
                    };
                    funcs._shutdown = function () {};
                    var bl = {
                        blocks: [

                        ]
                    };

                    for (l = 0; l < _this.cats[i].blocks.length; l++) {
                        bl.blocks.push([
                            _this.cats[i].blocks[l].type,
                            _this.cats[i].blocks[l].name,
                            `_blocks ${_this.cats[i].blocks[l].name}`
                        ]);
                        var thi = _this.cats[i].blocks[l].callback.toString();

                        funcs[`_blocks ${_this.cats[i].blocks[l].name}`] = _this.cats[i].blocks[l].callback;
                    }


                    ScratchExtensions.register(_this.cats[i].name, bl, funcs);
                })();
                ll++;
            }
        };
    };
    /* Documentation.
    
    To create a new extension, use the scratchExt constructor function.
    
    To create a new category for an extension, use the .createCat() addition to a scratchExt constructor variable.
    
    To creata a new block for a category, use the .createBlock() addition to a scratchExt consutrctor variable. It needs an object argument with the following keys:
    
    name: <name of block>
    type: <type of block, e.g 'w', 'r', 'b'>
    callback: <function to call when block is called, can be return function for boolean and reporter blocks>
    */
})();