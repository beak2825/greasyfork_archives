// ==UserScript==
// @name         LinuxDo Customize
// @namespace    http://tampermonkey.net/
// @version      2025-05-05
// @description  Customize the LinuxDo experience!
// @author       Terrasse
// @match        https://linux.do/t/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addElement
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535032/LinuxDo%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/535032/LinuxDo%20Customize.meta.js
// ==/UserScript==

(() => {
    const config = {
        siteConfigs: [
            {
                name: "linuxdo",
                chunkObject: "webpackChunkdiscourse",
                webpackVersion: "5",
                matchSites: ["linux.do"],

                // patchAll: true,
                // injectSpacepack: true,
                // patchEntryChunk: true,
                // modules: [],

                patches: [
                    {
                        name: "patch-scrolling-post-stream",
                        find: 'this.appEvents.on("post-stream:refresh", this, "_debouncedScroll");'.replaceAll(' ', ''),
                        replace: {
                            // match: "const windowHeight = window.innerHeight;",
                            // replacement: "const windowHeight = window.innerHeight; console.log('Injected patch-scrolling-post-stream.');",
                            match: "window.innerHeight",
                            // replacement: '(window.innerHeight * Math.round(this.screenTrack._topicTime / 1000) + (0 + 0==+console.log("Injected patch-scrolling-post-stream.", this.screenTrack._topicTime)))',
                            replacement: "(window.innerHeight*2 + document.scrollingElement.scrollTop*3 + (0 + 0==+$('#status_tag').text(`${ ((window.innerHeight*2 + document.scrollingElement.scrollTop*3) / window.innerHeight).toFixed(2) }`) ))",
                        },
                    }
                ],
            },
        ],
    };

    /* // Example config
    const config = {
      spacepackEverywhere: {
        enabled: true, // Automatically detect webpack objects and inject them with spacepack (Default: true)
        ignoreSites: [], // Don't inject spacepack on matching sites (Default: [])
  
        // Don't inject spacepack on matching webpack objects (Default: [])
        ignoreChunkObjects: [
          "webpackChunkruffle_extension", // https://ruffle.rs/
        ],
      },
      siteConfigs: [
        {
          name: "twitter", // For debug logging (Required)
          chunkObject: "webpackChunk_twitter_responsive_web", // Name of webpack chunk object to intercept (Required)
          webpackVersion: "5", // Version of webpack used to compile. (Required)
  
          // String or Array of strings of sites to inject on. (Required)
          matchSites: ["twitter.com"],
  
          // Whether to isolate every module. with //# sourceURL=. Allows for viewing an individual module in devtools
          // without the whole rest of the chunk, but has a noticable performance impact (Default: false)
          patchAll: true,
          injectSpacepack: true, // Whether to inject spacepack (Default: true)
          patchEntryChunk: true, // Some webpack compatible clones populate webpackRequire.m in the runtime chunk. This patches those modules.
          patches: [
            {
              // Used for debugging purposes, logging if a patch fails (TODO) and a comment of which
              // patches affected a module
              name: "patchingDemo", 
              
              // String, regexp or an array of them to match a module we're patching. Best to keep this a single string if 
              // possible for performance reasons (Required.)
              find: "(window.__INITIAL_STATE__",
  
              // match and replace are literally passed to `String.prototype.replace(match, replacement)`
              replace: {
                match: /(const|var) .{1,3}=.\..\(window\.__INITIAL_STATE__/,
                replacement: (orig) => `console.log('Patches work!!!');${orig}`,
              },
            },
          ],
          modules: [
            {
              // ID of the module being injected. If this ID is identical to one of another module it will be replaced 
              // with this one. (Required)
              name: "modulesDemo", 
              
              // Set of strings, or regexes of modules that need to be loaded before injecting this one. can also be 
              // `{moduleId: <moduleId>}` if depending on other injected or named modules. (Default: null)
              needs: new Set(), 
              entry: true, // Whether to load immediately or wait to be required by another module (Default: false)
  
              // The actual webpack module! Treat this sort of like in node where you can require other modules and export
              // your own values. (Required). Hint: you can require("spacepack") if injectSpacepack isn't false.
              run: function (module, exports, webpackRequire) {
                // the actual webpack module.
                console.log("Module injection works!!!");
              },
            },
          ],
        },
      ],
    };
    */

    unsafeWindow.__webpackTools_config = config;

    const runtime = "(() => {\n  // src/matchModule.js\n  function matchModule(moduleStr, queryArg) {\n    const queryArray = queryArg instanceof Array ? queryArg : [queryArg];\n    return !queryArray.some((query) => {\n      if (query instanceof RegExp) {\n        return !query.test(moduleStr);\n      } else {\n        return !moduleStr.includes(query);\n      }\n    });\n  }\n\n  // src/spacepackLite.js\n  var namedRequireMap = {\n    p: \"publicPath\",\n    s: \"entryModuleId\",\n    c: \"moduleCache\",\n    m: \"moduleFactories\",\n    e: \"ensureChunk\",\n    f: \"ensureChunkHandlers\",\n    E: \"prefetchChunk\",\n    F: \"prefetchChunkHandlers\",\n    G: \"preloadChunk\",\n    H: \"preloadChunkHandlers\",\n    d: \"definePropertyGetters\",\n    r: \"makeNamespaceObject\",\n    t: \"createFakeNamespaceObject\",\n    n: \"compatGetDefaultExport\",\n    hmd: \"harmonyModuleDecorator\",\n    nmd: \"nodeModuleDecorator\",\n    h: \"getFullHash\",\n    w: \"wasmInstances\",\n    v: \"instantiateWasm\",\n    oe: \"uncaughtErrorHandler\",\n    nc: \"scriptNonce\",\n    l: \"loadScript\",\n    ts: \"createScript\",\n    tu: \"createScriptUrl\",\n    tt: \"getTrustedTypesPolicy\",\n    cn: \"chunkName\",\n    j: \"runtimeId\",\n    u: \"getChunkScriptFilename\",\n    k: \"getChunkCssFilename\",\n    hu: \"getChunkUpdateScriptFilename\",\n    hk: \"getChunkUpdateCssFilename\",\n    x: \"startup\",\n    X: \"startupEntrypoint\",\n    O: \"onChunksLoaded\",\n    C: \"externalInstallChunk\",\n    i: \"interceptModuleExecution\",\n    g: \"global\",\n    S: \"shareScopeMap\",\n    I: \"initializeSharing\",\n    R: \"currentRemoteGetScope\",\n    hmrF: \"getUpdateManifestFilename\",\n    hmrM: \"hmrDownloadManifest\",\n    hmrC: \"hmrDownloadUpdateHandlers\",\n    hmrD: \"hmrModuleData\",\n    hmrI: \"hmrInvalidateModuleHandlers\",\n    hmrS: \"hmrRuntimeStatePrefix\",\n    amdD: \"amdDefine\",\n    amdO: \"amdOptions\",\n    System: \"system\",\n    o: \"hasOwnProperty\",\n    y: \"systemContext\",\n    b: \"baseURI\",\n    U: \"relativeUrl\",\n    a: \"asyncModule\"\n  };\n  function getNamedRequire(webpackRequire) {\n    const namedRequireObj = {};\n    Object.getOwnPropertyNames(webpackRequire).forEach((key) => {\n      if (Object.prototype.hasOwnProperty.call(namedRequireMap, key)) {\n        namedRequireObj[namedRequireMap[key]] = webpackRequire[key];\n      }\n    });\n    return namedRequireObj;\n  }\n  function getSpacepack(chunkObject, logSuccess = false) {\n    function spacepack(module, exports, webpackRequire) {\n      if (logSuccess) {\n        if (!chunkObject) {\n          console.log(\"[wpTools] spacepack loaded\");\n        } else {\n          console.log(\"[wpTools] spacepack loaded in \" + chunkObject);\n        }\n      }\n      function findByExports(keysArg) {\n        if (!webpackRequire.c) {\n          throw new Error(\"webpack runtime didn't export its moduleCache\");\n        }\n        const keys = keysArg instanceof Array ? keysArg : [keysArg];\n        return Object.entries(webpackRequire.c).filter(([moduleId, exportCache]) => {\n          return !keys.some((searchKey) => {\n            return !(exportCache !== void 0 && exportCache !== window && (exports?.[searchKey] || exports?.default?.[searchKey]));\n          });\n        }).map(([moduleId, exportCache]) => {\n          return exportCache;\n        });\n      }\n      function findByCode(search) {\n        return Object.entries(webpackRequire.m).filter(([moduleId, moduleFunc]) => {\n          const funcStr = Function.prototype.toString.apply(moduleFunc);\n          return matchModule(funcStr, search);\n        }).map(([moduleId, moduleFunc]) => {\n          try {\n            return {\n              id: moduleId,\n              exports: webpackRequire(moduleId)\n            };\n          } catch (error) {\n            console.error(\"Failed to require module: \" + error);\n            return {\n              id: moduleId,\n              exports: {}\n            };\n          }\n        });\n      }\n      function findObjectFromKey(exports2, key) {\n        let subKey;\n        if (key.indexOf(\".\") > -1) {\n          const splitKey = key.split(\".\");\n          key = splitKey[0];\n          subKey = splitKey[1];\n        }\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] !== void 0) {\n            if (subKey) {\n              if (obj[key][subKey])\n                return obj;\n            } else {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromValue(exports2, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj == value)\n            return obj;\n          for (const subKey in obj) {\n            if (obj && obj[subKey] == value) {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromKeyValuePair(exports2, key, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] == value) {\n            return obj;\n          }\n        }\n        return null;\n      }\n      function findFunctionByStrings(exports2, ...strings) {\n        return Object.entries(exports2).filter(\n          ([index, func]) => typeof func === \"function\" && !strings.some(\n            (query) => !(query instanceof RegExp ? func.toString().match(query) : func.toString().includes(query))\n          )\n        )?.[0]?.[1] ?? null;\n      }\n      function inspect(moduleId) {\n        return webpackRequire.m[moduleId];\n      }\n      const exportedRequire = module.exports.default = exports.default = {\n        require: webpackRequire,\n        modules: webpackRequire.m,\n        cache: webpackRequire.c,\n        __namedRequire: getNamedRequire(webpackRequire),\n        findByCode,\n        findByExports,\n        findObjectFromKey,\n        findObjectFromKeyValuePair,\n        findObjectFromValue,\n        findFunctionByStrings,\n        inspect\n      };\n      if (chunkObject) {\n        exportedRequire.chunkObject = window[chunkObject];\n        exportedRequire.name = chunkObject;\n      }\n      if (window.wpTools) {\n        const runtimesRegistry = window.wpTools.runtimes;\n        if (runtimesRegistry[chunkObject]) {\n          console.warn(\"[wpTools] Multiple active runtimes for \" + chunkObject);\n          let currId = 0;\n          if (runtimesRegistry[chunkObject].__wpTools_multiRuntime_id) {\n            currId = runtimesRegistry[chunkObject].__wpTools_multiRuntime_id;\n          }\n          runtimesRegistry[chunkObject + \"_\" + currId] = runtimesRegistry[chunkObject];\n          currId++;\n          runtimesRegistry[chunkObject + \"_\" + currId] = exportedRequire;\n          runtimesRegistry[chunkObject] = exportedRequire;\n        }\n        runtimesRegistry[chunkObject] = exportedRequire;\n        window[\"spacepack_\" + chunkObject] = exportedRequire;\n      }\n      window[\"spacepack\"] = exportedRequire;\n    }\n    spacepack.__wpt_processed = true;\n    return spacepack;\n  }\n\n  // src/Patcher.js\n  var ConfigValidationError = class extends Error {\n  };\n  function validateProperty(name, object, key, required, validationCallback) {\n    if (!Object.prototype.hasOwnProperty.call(object, [key])) {\n      if (required) {\n        throw new ConfigValidationError(`Required property not found, missing ${key} in ${name}`);\n      } else {\n        return;\n      }\n    } else {\n      if (!validationCallback(object[key])) {\n        throw new ConfigValidationError(\n          `Failed to validate ${key} in ${name}. The following check failed: \n${validationCallback.toString()}`\n        );\n      }\n    }\n  }\n  var Patcher = class {\n    constructor(config) {\n      this._validateConfig(config);\n      this.name = config.name;\n      this.chunkObject = config.chunkObject;\n      this.webpackVersion = config.webpackVersion.toString();\n      this.patchAll = config.patchAll;\n      this.modules = new Set(config.modules ?? []);\n      for (const module of this.modules) {\n        this._validateModuleConfig(module);\n      }\n      this.patches = new Set(config.patches ?? []);\n      for (const patch of this.patches) {\n        this._validatePatchConfig(patch);\n      }\n      this.patchesToApply = /* @__PURE__ */ new Set();\n      if (this.patches) {\n        for (const patch of this.patches) {\n          if (patch.replace instanceof Array) {\n            for (const index in patch.replace) {\n              this.patchesToApply.add({\n                name: patch.name + \"_\" + index,\n                find: patch.find,\n                replace: patch.replace[index]\n              });\n            }\n            continue;\n          }\n          this.patchesToApply.add(patch);\n        }\n      }\n      this.modulesToInject = /* @__PURE__ */ new Set();\n      if (this.modules) {\n        for (const module of this.modules) {\n          if (module.needs !== void 0 && module.needs instanceof Array) {\n            module.needs = new Set(module.needs);\n          }\n          this.modulesToInject.add(module);\n        }\n      }\n      if (config.injectSpacepack !== false) {\n        this.modulesToInject.add({\n          name: \"spacepack\",\n          // This is sorta a scope hack.\n          // If we rewrap this function, it will lose its scope (in this case the match module import and the chunk object name)\n          run: getSpacepack(this.chunkObject),\n          entry: true\n        });\n      }\n      if (config.patchEntryChunk) {\n        this.modulesToInject.add({\n          name: \"patchEntryChunk\",\n          run: (module, exports, webpackRequire) => {\n            this._patchModules(webpackRequire.m);\n          },\n          entry: true\n        });\n        this.patchEntryChunk = true;\n      }\n    }\n    run() {\n      if (this.webpackVersion === \"4\" || this.webpackVersion === \"5\") {\n        this._interceptWebpackModern();\n      } else {\n        this._interceptWebpackLegacy;\n      }\n    }\n    _interceptWebpackModern() {\n      let realChunkObject = window[this.chunkObject];\n      const patcher = this;\n      Object.defineProperty(window, this.chunkObject, {\n        set: function set(value) {\n          realChunkObject = value;\n          if (patcher.patchEntryChunk) {\n            let newChunk = [[\"patchEntryChunk\"], {}];\n            patcher._injectModules(newChunk);\n            realChunkObject.push(newChunk);\n          }\n          if (!value.push.__wpt_injected) {\n            realChunkObject = value;\n            const realPush = value.push;\n            value.push = function(chunk) {\n              if (!chunk.__wpt_processed) {\n                chunk.__wpt_processed = true;\n                patcher._patchModules(chunk[1]);\n                patcher._injectModules(chunk);\n              }\n              return realPush.apply(this, arguments);\n            };\n            value.push.__wpt_injected = true;\n            if (realPush === Array.prototype.push) {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (before webpack runtime)\");\n            } else {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (at webpack runtime)\");\n            }\n          }\n        },\n        get: function get() {\n          return realChunkObject;\n        },\n        configurable: true\n      });\n    }\n    _interceptWebpackLegacy() {\n    }\n    _patchModules(modules) {\n      for (const id in modules) {\n        if (modules[id].__wpt_processed) {\n          continue;\n        }\n        let funcStr = Function.prototype.toString.apply(modules[id]);\n        const matchingPatches = [];\n        for (const patch of this.patchesToApply) {\n          if (matchModule(funcStr, patch.find)) {\n            matchingPatches.push(patch);\n            this.patchesToApply.delete(patch);\n          }\n        }\n        for (const patch of matchingPatches) {\n          funcStr = funcStr.replace(patch.replace.match, patch.replace.replacement);\n        }\n        if (matchingPatches.length > 0 || this.patchAll) {\n          let debugString = \"\";\n          if (matchingPatches.length > 0) {\n            debugString += \"Patched by: \" + matchingPatches.map((patch) => patch.name).join(\", \");\n          }\n          modules[id] = new Function(\n            \"module\",\n            \"exports\",\n            \"webpackRequire\",\n            `(${funcStr}).apply(this, arguments)\n// ${debugString}\n//# sourceURL=${this.chunkObject}-Module-${id}`\n          );\n          modules[id].__wpt_patched = true;\n        }\n        modules[id].__wpt_funcStr = funcStr;\n        modules[id].__wpt_processed = true;\n      }\n    }\n    _injectModules(chunk) {\n      const readyModules = /* @__PURE__ */ new Set();\n      for (const moduleToInject of this.modulesToInject) {\n        if (moduleToInject?.needs?.size > 0) {\n          for (const need of moduleToInject.needs) {\n            for (const wpModule of Object.entries(chunk[1])) {\n              if (need?.moduleId && wpModule[0] === need.moduleId || matchModule(wpModule[1].__wpt_funcStr, need)) {\n                moduleToInject.needs.delete(need);\n                if (moduleToInject.needs.size === 0) {\n                  readyModules.add(moduleToInject);\n                }\n                break;\n              }\n            }\n          }\n        } else {\n          readyModules.add(moduleToInject);\n        }\n      }\n      if (readyModules.size > 0) {\n        const injectModules = {};\n        const injectEntries = [];\n        for (const readyModule of readyModules) {\n          this.modulesToInject.delete(readyModule);\n          injectModules[readyModule.name] = readyModule.run;\n          if (readyModule.entry) {\n            injectEntries.push(readyModule.name);\n          }\n        }\n        if (chunk[1] instanceof Array) {\n          const origChunkArray = chunk[1];\n          chunk[1] = {};\n          origChunkArray.forEach((module, index) => {\n            chunk[1][index] = module;\n          });\n        }\n        chunk[1] = Object.assign(chunk[1], injectModules);\n        if (injectEntries.length > 0) {\n          switch (this.webpackVersion) {\n            case \"5\":\n              if (chunk[2]) {\n                const originalEntry = chunk[2];\n                chunk[2] = function(webpackRequire) {\n                  originalEntry.apply(this, arguments);\n                  injectEntries.forEach(webpackRequire);\n                };\n              } else {\n                chunk[2] = function(webpackRequire) {\n                  injectEntries.forEach(webpackRequire);\n                };\n              }\n              break;\n            case \"4\":\n              if (chunk[2]?.[0]) {\n                chunk[2]?.[0].concat([injectEntries]);\n              } else {\n                chunk[2] = [injectEntries];\n              }\n              break;\n          }\n        }\n      }\n    }\n    _validateConfig(config) {\n      validateProperty(\"siteConfigs[?]\", config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${name}]`, config, \"chunkObject\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"webpackVersion\", true, (value) => {\n        return [\"4\", \"5\"].includes(value.toString());\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchAll\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"modules\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patches\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"injectSpacepack\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchEntryChunk\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n    }\n    _validatePatchReplacement(replace, name, index) {\n      let indexStr = index === void 0 ? \"\" : `[${index}]`;\n      validateProperty(\n        `siteConfigs[${this.name}].patches[${name}].replace${indexStr}`,\n        replace,\n        \"match\",\n        true,\n        (value) => {\n          return typeof value === \"string\" || value instanceof RegExp;\n        }\n      );\n      validateProperty(`siteConfigs[${this.name}].patches[${name}].replace`, replace, \"replacement\", true, (value) => {\n        return typeof value === \"string\" || value instanceof Function;\n      });\n    }\n    _validatePatchConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].patches[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"find\", true, (value) => {\n        return (\n          // RegExp, String, or an Array of RegExps and Strings\n          typeof value === \"string\" || value instanceof RegExp || value instanceof Array && !value.some((value2) => {\n            !(typeof value2 === \"string\" || value2 instanceof RegExp);\n          })\n        );\n      });\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"replace\", true, (value) => {\n        return typeof value === \"object\";\n      });\n      if (config.replace instanceof Array) {\n        config.replace.forEach((replacement, index) => {\n          this._validatePatchReplacement(replacement, name, index);\n        });\n      } else {\n        this._validatePatchReplacement(config.replace, name);\n      }\n    }\n    _validateModuleConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].modules[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"needs\", false, (value) => {\n        return (value instanceof Array || value instanceof Set) && ![...value].some((value2) => {\n          !(typeof value2 === \"string\" || value2 instanceof RegExp || value2 instanceof Object && typeof value2.moduleId === \"string\");\n        });\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"run\", true, (value) => {\n        return typeof value === \"function\";\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"entry\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      if (config.entry === void 0) {\n        config.entry = false;\n      }\n    }\n  };\n\n  // src/spacepackEverywhere.js\n  function getWebpackVersion(chunkObject) {\n    if (chunkObject instanceof Array) {\n      return \"modern\";\n    } else {\n      return \"legacy\";\n    }\n  }\n  var onChunkLoaded = function(webpackRequire) {\n    webpackRequire(\"spacepack\");\n  };\n  onChunkLoaded[0] = [\"spacepack\"];\n  onChunkLoaded[Symbol.iterator] = function() {\n    return {\n      read: false,\n      next() {\n        if (!this.read) {\n          this.read = true;\n          return { done: false, value: 0 };\n        } else {\n          return { done: true };\n        }\n      }\n    };\n  };\n  function pushSpacepack(chunkObjectName) {\n    const chunkObject = window[chunkObjectName];\n    if (chunkObject.__spacepack_everywhere_injected) {\n      return;\n    }\n    const version = getWebpackVersion(chunkObject);\n    console.log(\"[wpTools] Got \" + chunkObjectName + \" using webpack \" + version + \" :)\");\n    switch (version) {\n      case \"modern\":\n        chunkObject.__spacepack_everywhere_injected = true;\n        chunkObject.push([[\"spacepack\"], { spacepack: getSpacepack(chunkObjectName, true) }, onChunkLoaded]);\n        break;\n      case \"legacy\":\n        console.log(\"[wpTools] Legacy is not currently supported. Please share this site to https://github.com/moonlight-mod/webpackTools/issues/1 to help with development of legacy support\");\n        break;\n    }\n  }\n  function spacepackEverywhere(config) {\n    if (config?.ignoreSites?.includes(window.location.host)) {\n      return;\n    }\n    for (const key of Object.getOwnPropertyNames(window)) {\n      if ((key.includes(\"webpackJsonp\") || key.includes(\"webpackChunk\") || key.includes(\"__LOADABLE_LOADED_CHUNKS__\")) && !key.startsWith(\"spacepack\") && !config?.ignoreChunkObjects?.includes(key)) {\n        pushSpacepack(key);\n      }\n    }\n  }\n\n  // src/entry/userscript.js\n  var globalConfig = window.__webpackTools_config;\n  delete window.__webpackTools_config;\n  var siteConfigs = /* @__PURE__ */ new Set();\n  for (let siteConfig of globalConfig.siteConfigs) {\n    if (siteConfig.matchSites?.includes(window.location.host)) {\n      siteConfigs.add(siteConfig);\n      break;\n    }\n  }\n  window.wpTools = {\n    globalConfig,\n    activeSiteConfigs: siteConfigs,\n    spacepackEverywhereDetect: () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    },\n    runtimes: {}\n  };\n  if (siteConfigs.size > 0) {\n    for (const siteConfig of siteConfigs) {\n      const patcher = new Patcher(siteConfig);\n      patcher.run();\n    }\n  } else if (globalConfig?.spacepackEverywhere?.enabled !== false) {\n    window.addEventListener(\"load\", () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    });\n  }\n})();\n\n//# sourceURL=wpTools";

    GM_addElement("script", {
        textContent: runtime,
    });

    // Display & Refresh Button
    function htmlToNode(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
    function addStatusTag() { // return true if freshly added
        if (document.getElementById("status_tag")) return false;
        var anchor = document.getElementsByClassName("categories-wrapper");
        if (anchor.length == 0) return false;
        var anchor = anchor[0];
        var target = anchor.getElementsByClassName("badge-category__name");
        if (target.length == 0) return false;
        var target = target[0];

        // var displayBar = htmlToNode('<li class="sidebar-section-link-wrapper"><a class="ember-view sidebar-section-link sidebar-row"><span class="sidebar-section-link-content-text" id="status_tag">话题</span></a></li>');
        var status = htmlToNode('<sup id="status_tag">1.00</sup>');
        target.appendChild(status);
        console.log('Status tag added successfully.');
        return true;
    }

    setInterval(addStatusTag, 1000);

    // add eruda for debugging
    if (window.location.href.includes("linux.do")) {
        var erudaScript = document.createElement('script');
        erudaScript.src = 'https://cdn.jsdelivr.net/npm/eruda';
        erudaScript.onload = function () {
            eruda.init();
        };
        document.body.appendChild(erudaScript);
    }
})();
