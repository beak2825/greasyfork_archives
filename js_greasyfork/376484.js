// ==UserScript==
// @name         TeamerScript™
// @description  just hurt people
// @version      0.1
// @author       gay
// @match        *://diep.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/376484/TeamerScript%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/376484/TeamerScript%E2%84%A2.meta.js
// ==/UserScript==

'use strict';

//var _a = 0;
//console.log(GM_getValue('module1'));
//unsafeWindow.count = function() {
//    for(let i = 0; i < 10000; i++) {
//        if(!GM_getValue('module' + i, 0)) {
//            console.log(_a);
//            return;
//        }
//        _a++;
//    }
//}

var char = [];
var pivot = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
var firstRun = GM_getValue('firstrun', 1);
var moduleStorageSize = 16;
var addModule = window.module;
unsafeWindow.backup = function(num) {
    if(num || !num) {
        GM_setValue('backup', num);
    } else {
        console.warn("Invalid input. Please try again.");
    }
}

//
// KEY BINDINGS SECTION

var binds = {
    static: {},
    dynamic: {}
};

//
// RECOVER SECTION

function getBinds() {
    if(!firstRun) {
        for(let i of GM_listValues()) {
            binds[GM_getValue(i)] = 1;
        }
    } else {
        for(let i of functions.static) {
            for(let j of i.keys) {
                binds.static[j] = 1;
                GM_setValue('key' + j, 1);
            }
        }
        for(let i of functions.dynamic) {
            for(let j of i.keys.static) {
                binds.static[j] = 1;
                GM_setValue('key' + j, 1);
            }
            for(let j of i.keys.dynamic) {
                binds.dynamic[j] = 1;
                GM_setValue('key' + j, 1);
            }
        }
    }
}

function getModules() {
    for(let i = 0; i < moduleStorageSize; i++) {
        if(GM_getValue('module' + i, 0)) {
            let obj = JSON.parse(GM_getValue('module' + i));
            addModule(obj.name, obj.module);
            console.log("A module has been restored." + obj.module);
        } else {
            return;
        }
    }
}

//
// FUNCTION ARRAY SECTION

var functions = {
    static: [
        {
            keys: [98, 100, 102, 104],
            function: triplet
        }
    ],
    dynamic: [
        {
            on: 0,
            variables: {
                angle: 0,
                speed: 0.05,
                x: 0,
                y: 0
            },
            keys: {
                static: [81],
                dynamic: [103, 105]
            },
            function: spin2team,
            requireKey: { key: 0 }
        }, {
            on: 0,
            keys: {
                static: [101],
                dynamic: []
            },
            function: antidisspawn
        }
    ]
};

//
// MODULE SECTION

var moduleName = ['keymoduleStatic', 'keymoduleDynamic'];
var copyModuleName = moduleName;

function getModuleNumber() {
    for(let i = 0; i < moduleStorageSize; i++) {
        if(GM_getValue('module' + i, 1)) {
            return i;
        } else if(i == moduleStorageSize - 1 && GM_getValue('module' + i, 0)) {
            return false;
        }
    }
}

unsafeWindow.module = function(name, module) {
    for(let i = 0; i < moduleName.length; i++) {
        if(name != moduleName[i]) {
            var string = '';
            for(let j = 0; j < moduleName.length; j++) {
                string += moduleName[j] + (j < moduleName.length - 1 ? ", " : ".");
            }
            console.warn('The module name is invalid. Available modules: ' + string);
            return;
        }
        if(module.function == undefined) {
            console.warn("The module function is missing. You can't execute your module without it. Please add it and try again. Type window.help()' to get some help.");
            return;
        }
        if(typeof module.function != 'function') {
            console.warn("The module has no function. All modules need to have a function. Type 'window.help()' to get some help.");
                    return;
        }
        try {
            module.function();
        } catch(err) {
            console.warn('The function is invalid. Here is the output:\n' + err);
            return;
        }
        module.on != undefined ? functions.dynamic.push(module) : functions.static.push(module);
        console.log('Module has been added successfully.');
        let obj = {
            name: name,
            module: module
        };
        if(GM_getValue('backup')) {
            let num;
            if(!getModuleNumber()) {
                console.warn("You can backup maximum 16 modules. Get help about how to delete modules by typing 'deleteModule()' and try again.");
                return;
            }
            num = getModuleNumber();
            GM_setValue('module' + num, JSON.stringify(obj));
            console.log("\nModule's backup version has been created successfully."
                    +"\nIf you want to delete it, type 'deleteModule()' for some help. If you don't want to create backup files, type 'window.backup(false)'."
                    +"\nNote: you won't be able to recover your lost modules in case of cleaning browser's cookies.");
        }
        return;
    }
}

function deleteModule() {
    console.log("Nothing there yet.");
}

//
// LOADING SECTION

var doc = setInterval(websiteReady, 100);

function websiteReady() {
    //if(document.readyState == 'complete') {
        clearInterval(doc);
        if(firstRun) {
            firstrun();
        }
        load();
        loop();
    //}
}

function load() {
    console.log("This is TeamerScript™. Available funcions:\n"
                +"\n1. Auto spin bot (turn if on and off with 'q'. Control it's speed and direction with num_7 and num_9 keys),\n"
                +"\n2. Setting triplet's barrel straight bot (up, down, right, left, num_8, num_2, num_6 and num_4 respectively).\n"
                +"\nIf you want to edit key bindings of original functions (and your own after you add them), type (under construction).\n"
                +"\nYou are responsible for modules you add to this script. If you are not experienced, please don't add random functions.\n"
                +"Not valid modules can cause a huge performance problems or other errors. Please try to exclude any loops in your functions or setting intervals.\n"
                +"\nDo you want to create new modules, but don't know how? Type 'window.help()' in the console to get a quick quide. Note: minimal knowledge about JavaScript is required."
                +"\nIf you have any more questions or ideas for new functions, please contact the author.\nNone of his friends is a co-founder of this script.");
}

function firstrun() {
    console.log("Welcome, user! TeamerScript™ noticed it's the first run of this script. Please take your time and read stuff below.\n"
                +"Have already seen this message? It's probable that you've cleaned your browser's history while not excluding cookies. There is no way to recover your functions and key bindings. Sorry.");
    firstRun = 0;
    getBinds();
    getModules();
    GM_setValue('firstrun', 0);
}

unsafeWindow.help = function() {
    console.log("Sorry, but there is nothing here yet.");
}

//
// DOCUMENT EVENT HANDLING SECTION

document.addEventListener('keydown', function(e) {
    let key = e.keyCode || e.which;
    char[key] = 1;
    for(let i of functions.static) {
        Static(i, key);
    }
    for(let i of functions.dynamic) {
        Dynamic(i, key);
    }
});

document.addEventListener('keyup', function(e) {
    let key = e.keyCode || e.which;
    char[key] = 0;
});

//
// ORIGINAL FUNCTIONS SECTION

function spin2team(vars) {
    if(document.getElementById('a').style.display == 'none') {
        vars.variables.x = pivot.x + Math.cos(vars.variables.angle) * 1000;
        vars.variables.y = pivot.y + Math.sin(vars.variables.angle) * 1000;
        vars.variables.angle += vars.variables.speed;
        input.mouse(vars.variables.x, vars.variables.y);
    }
    switch(vars.requireKey.key) {
        case 103:
            vars.variables.speed -= 0.002;
            vars.requireKey.key = 0;
            break;
        case 105:
            vars.variables.speed += 0.002;
            vars.requireKey.key = 0;
            break;
    }
}

function triplet(vars, key) {
    switch(key) {
        case 98:
            input.mouse(window.innerWidth / 2, window.innerHeight);
            break;
        case 100:
            input.mouse(0, window.innerHeight / 2);
            break;
        case 102:
            input.mouse(window.innerWidth, window.innerHeight / 2);
            break;
        case 104:
            input.mouse(window.innerWidth / 2, 0);
            break;
    }
}

function antidisspawn(vars) {

}

//
// EXECUTE A FUNCTION SECTION

function checkKeys(vars, key) {
    for(let i = 0; i < vars.length; i++) {
        if(vars[i] == key) {
            return true;
        } else if(i == vars.length - 1) {
            return false;
        }
    }
}

function requestKey(vars, key) {
    if(vars.requireKey != undefined) {
        vars.requireKey.key = key;
    }
}

function Static(vars, key) {
    if(checkKeys(vars.keys, key)) {
        vars.function(vars, key);
        requestKey(vars, key);
    }
}

function Dynamic(vars, key) {
    if(checkKeys(vars.keys.static, key)) {
        requestKey(vars, key);
        vars.on = !vars.on;
    } else if(checkKeys(vars.keys.dynamic, key)) {
        if(vars.on) {
            requestKey(vars, key);
            vars.function(vars);
        }
    }
}

function execute(vars) {
    if(vars.on != undefined) {
        if(vars.on) {
            return true;
        } else {
            return false;
        }
    }
}

function loop() {
    pivot = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    for(let i of functions.dynamic) {
        if(execute(i)) {
            i.function(i);
        }
    }

    requestAnimationFrame(loop);
}

//