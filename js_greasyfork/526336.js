// ==UserScript==
// @name         Barclay's Library
// @namespace    https://github.com/onlypuppy7/BarclaysShellShockers/
// @grant        none
// @version      1.1.4
// @author       onlypuppy7
// @description  Import whatever model URLs you need - library that does the heavy lifting
// @match        *://*/*
// ==/UserScript==

//this library is based off LibertyMutual by onlypuppy7

const BARCLAYS = {
    modelURLs: [],
    ss: null,
    H: {},
    log: function (...args) { //yeah, i got inspired. what about it?
        console.log(
            "%c%s",
            `color: white; font-weight: bold; background:rgb(0, 85, 128); padding: 2px 6px; border-radius: 5px; margin-right: 5px;`,
            `Barclay's`,
            ...args
        );
    },
    init: function () { //setup the script injection. separated out to enable users to put the injection code into their own scripts with different loading mechanisms.
        let originalReplace = String.prototype.replace;
    
        String.prototype.originalReplace = function() {
            return originalReplace.apply(this, arguments);
        };

        let method = "apc"; //options: "Function", "XHR"

        if (method === "XHR") {
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
            let shellshockjs
            XMLHttpRequest.prototype.open = function(...args) {
                const url = args[1];
                if (url && url.includes("js/shellshock.js")) {
                    shellshockjs = this;
                };
                originalXHROpen.apply(this, args);
            };
            Object.defineProperty(XMLHttpRequest.prototype, 'response', {
                get: function() {
                    if (this===shellshockjs) {
                        BARCLAYS.log("shellshock.js intercepted");
                        return BARCLAYS.applyBarclays(originalXHRGetResponse.get.call(this));
                    };
                    return originalXHRGetResponse.get.call(this);
                }
            });
        } else if (method === "Function") {
            const originalFunction = Function.prototype.constructor;
            Function.prototype.constructor = function(...args) {
                const jsCode = args[0];
                if (jsCode && jsCode.includes("(()=>{ ")) {
                    BARCLAYS.log("shellshock.js intercepted");
                    return BARCLAYS.applyBarclays(jsCode);
                };
                return originalFunction.apply(this, args);
            };
        } else if (method === "apc") {
            let _apc = HTMLElement.prototype.appendChild;

            HTMLElement.prototype.appendChild = function(node) {
                if (node.tagName === 'SCRIPT' && node.innerHTML && node.innerHTML.startsWith('(()=>{')) {
                    node.innerHTML = BARCLAYS.applyBarclays(node.innerHTML);
                };
                return _apc.call(this, node);
            };
        };
    },
    applyBarclays: function (js) {
        try {
            //VAR STUFF
            let F=[];
            let functionNames=[];
        
            //scrambled... geddit????
            const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
            const createAnonFunction=function(name,func){
                const funcName=getScrambled();
                window[funcName]=func;
                F[name]=window[funcName];
                functionNames[name]=funcName
            };
            
            const fetchTextContent = function(url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false); // make the request synchronous
                xhr.send();
                if (xhr.status === 200) {
                    return xhr.responseText;
                } else {
                    console.error("Error fetching text content. Status:", xhr.status);
                    return null;
                };
            };
        
            createAnonFunction("BARCLAYS", function(ss) {
                BARCLAYS.log("BARCLAYS ACTIVE!");
    
                BARCLAYS.ss = ss;
                // window.globalBarclays = ss;
    
                BARCLAYS.replaceModels();
            });
    
            let clientKeys;
            onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/barclays_latest.json"); //credit: me :D
    
            if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
                let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them. Join the SFNetwork Discord server to generate keys! https://discord.gg/HYJG3jXVJF', '');
                if (userInput !== null && userInput !== '') {
                    alert('Aight, let\'s try this. If it is invalid, it will just crash.');
                    clientKeys = JSON.parse(userInput);
                } else {
                    alert('You did not enter anything, this is gonna crash lmao.');
                };
            } else {
                clientKeys = JSON.parse(onlineClientKeys);
            };
    
            BARCLAYS.H = clientKeys.vars;
            BARCLAYS.log(BARCLAYS.H);
    
            let injectionString="";
            
            const modifyJS = function(find,replace) {
                let oldJS = js;
                js = js.originalReplace(find,replace);
                if (oldJS !== js) {
                    console.log("%c[BARCLAYS] Replacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
                } else {
                    console.log("%c[BARCLAYS] Replacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
                };
            };
    
            BARCLAYS.log('%c[BARCLAYS] ATTEMPTING TO START BARCLAYS', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
            const variableNameRegex = /^[a-zA-Z0-9_$,"]*$/; //prevent adding spooky code
            for (let name in BARCLAYS.H) {
                deobf = BARCLAYS.H[name];
                if (variableNameRegex.test(deobf)) {
                    injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
                } else {
                    alert("Message from the Barclays Devs: WARNING! The keys inputted contain non-variable characters! There is a possibility that this could run code unintended by the Barclays team, although possibly there is also a mistake. Do NOT proceed with using this, and report to the Barclays developers what is printed in the console.");
                    BARCLAYS.log("REPORT THIS IN THE DISCORD SERVER:", clientKeys);
                    const crashplease = "balls";
                    crashplease = "balls2";
                };
            };
            BARCLAYS.log("Barclay's injectionString:", injectionString);
    
            modifyJS(`"Object meshes loaded"),`, `"Object meshes loaded"),window["${functionNames.BARCLAYS}"]({${injectionString}}),`);
    
            // BARCLAYS.log(js);
            return js;
        } catch (error) {
            console.error("Error applying Barclay's:", error);
            return js;
        };
    },
    replaceModels: function (modelURLs = BARCLAYS.modelURLs, noLog = false) {
        //you can call this function later if you want to replace models again
        //if you need to reinstate the original models, you will need to pass in the original mesh URLs
        //eg: /models/full/egg.glb

        function replaceMesh(sourceMesh, targetMesh) {
            if (sourceMesh && targetMesh) {
                const vertexData = BARCLAYS.ss.VertexData.ExtractFromMesh(sourceMesh);
        
                vertexData.applyToMesh(targetMesh);
        
                if (!noLog) BARCLAYS.log("Mesh geometry replaced successfully!", sourceMesh.id);
            } else {
                console.error("One of the meshes was not found!");
            };
        };

        BARCLAYS.log("Preparing to replace models...", modelURLs);
        
        modelURLs.forEach(function(url) {
            BARCLAYS.log("Loading model from URL:", url);
            BARCLAYS.ss.SceneLoader.ImportMesh(
                "", // Empty string imports all meshes
                "", // Empty root URL uses the path provided
                url, // Path to GLB file
                undefined, // Scene to import into
                function (meshes, particleSystems, skeletons, animationGroups) {
                    BARCLAYS.log(
                        "meshes loaded:",
                        meshes
                            .filter(mesh => mesh.id !== "__root__")
                            .map(mesh => mesh.id)
                    );
                    console.log("particleSystems loaded:", particleSystems);
                    console.log("skeletons loaded:", skeletons);
                    console.log("animationGroups loaded:", animationGroups);

                    for (var m = 0; m < meshes.length; m++) {
                        var mesh2 = meshes[m];
                        if (mesh2.id !== "__root__") {
                            mesh2.setEnabled(false);
                            mesh2.isPickable = false;
    
                            mesh2.animations = animationGroups;
                
                            let meshInGlobalScene = BARCLAYS.ss.globalScene.getMeshByID(mesh2.id);
                
                            if (meshInGlobalScene) {
                                replaceMesh(mesh2, meshInGlobalScene);
    
                                mesh2.animations.forEach((anim, index) => {
                                    let animName = anim.name;
                                    let animInGlobalScene = meshInGlobalScene.getAnimationByName(animName);
                
                                    if (animInGlobalScene) {
                                        let tempTargeted = anim._targetedAnimations;
                
                                        tempTargeted.forEach((targeted, index) => {
                                            tempTargeted[index].target = targeted.target;
                                        });
                
                                        animInGlobalScene._targetedAnimations = tempTargeted;
                
                                        BARCLAYS.log(`Animation ${index + 1} (${animName}) replaced successfully!`);
                                    };
                                });
                            };

                            mesh2.dispose(false, true);
                        };
                    };

                    BARCLAYS.log("Meshes replaced successfully!");
                },
            );
        });
    },
    restoreModels: function () {
        BARCLAYS.log("Restoring models...");

        const models = BARCLAYS.H.meshesToLoad.split(",");

        //add /models/full/ to the start of each model
        const modelURLs = models.map(model => `/models/full/${model.replaceAll('"','')}.glb`);

        modelURLs.push("/models/map.glb"); //add the map back in, as it's not in full

        BARCLAYS.replaceModels(modelURLs, true);
    },
};

BARCLAYS.log("Barclay's Library loaded. Built by onlypuppy7 :>");