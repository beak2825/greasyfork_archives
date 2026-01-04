// ==UserScript==
// @name         scratch extension loader
// @version      4
// @description  none
// @run-at       document-start
// @tag          lib loader
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @sandbox dom
// @icon         data:image/png;base64,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
// @require https://update.greasyfork.org/scripts/491829/1356221/tampermonkey%20storage%20proxy.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524950/scratch%20extension%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/524950/scratch%20extension%20loader.meta.js
// ==/UserScript==

// add get turbomode state
// add way to toggle on and off extensions
// how to change the properties of a menu baised on the value of another menu
//
// add set var
// add get var
// add return project id
;(async () => {
  var menus = {}
  var extensionerrors = []
  unsafeWindow.ee = extensionerrors
  var projectid =
    location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
  // debugger
  var sp = new storageproxy("extensionoptions")
  // debugger
  var bt = {
    cmd: "command",
    ret: "reporter",
    hat: "hat",
    bool: "Boolean",
  }
  var inp = {
    int: "number",
    num: "number",
    str: "string",
  }
  var menufuncs = class {
    menu_varnames(targetid) {
      try {
        var name = vm.runtime.targets.find((e) => e.id == targetid)
          .sprite.name
        if (!gettarget(name).runtime.ioDevices.cloud.stage)
          return [" "]
        var globalvars = Object.values(
          gettarget(name).runtime.ioDevices.cloud.stage.variables
        )
        var localvars = Object.values(gettarget(name).variables)
        globalvars = globalvars.filter((e) => e.type == "")
        localvars = localvars.filter((e) => e.type == "")
        // log(globalvars, localvars)
        var arr = [
          ...localvars.map((e) => ({
            text: "__local " + e.name,
            value: JSON.stringify([name, e.name]),
          })),
          ...globalvars.map((e) => ({
            text: "__global " + e.name,
            value: JSON.stringify([undefined, e.name]),
          })),
        ]
        return arr.length ? arr : [" "]
      } catch (e) {
        error("error from menu_varnames", e)
        return [" "]
      }
    }
    menu_listnames(targetid) {
      try {
        // if (!gettarget(name)) return [" "]
        var name = vm.runtime.targets.find((e) => e.id == targetid)
          .sprite.name
        if (!gettarget(name).runtime.ioDevices.cloud.stage)
          return [" "]
        var globalvars = Object.values(
          gettarget(name).runtime.ioDevices.cloud.stage.variables
        )
        var localvars = Object.values(gettarget(name).variables)
        globalvars = globalvars.filter((e) => e.type == "list")
        localvars = localvars.filter((e) => e.type == "list")
        // log(globalvars, localvars)
        var arr = [
          ...localvars.map((e) => ({
            text: "__local " + e.name,
            value: JSON.stringify([name, e.name]),
          })),
          ...globalvars.map((e) => ({
            text: "__global " + e.name,
            value: JSON.stringify([undefined, e.name]),
          })),
        ]

        return arr.length ? arr : [" "]
      } catch (e) {
        error("error from menu_listnames", e)
        return [" "]
      }
    }
    menu_spritelistwithglobal(targetid) {
      try {
        var spritenames = Object.values(vm.runtime.targets).map(
          (e) => e.sprite.name
        )
        var name = Object.values(vm.runtime.targets).find(
          (e) => e.id == targetid
        ).sprite.name
        return [
          name,
          { text: "--- global list ---", value: "" },
          ...spritenames.filter((e) => e !== name && e !== "Stage"),
        ]
      } catch (e) {
        error("error from menu_spritelistwithglobal", e)
        return [" "]
      }
    }
    menu_spritelistwithoutglobal(targetid) {
      try {
        var spritenames = Object.values(vm.runtime.targets).map(
          (e) => e.sprite.name
        )
        var name = Object.values(vm.runtime.targets).find(
          (e) => e.id == targetid
        ).sprite.name
        return [
          name,
          ...spritenames.filter((e) => e !== name && e !== "Stage"),
        ]
      } catch (e) {
        error("error from menu_spritelistwithoutglobal", e)
        return [" "]
      }
    }
    menu_fullkeylist() {
      return [
        "escape",
        "enter",
        "up arrow",
        "down arrow",
        "left arrow",
        "right arrow",
        "tab",
        "control",
        "alt",
        "shift",
        "win",
        "delete",
        "insert",
        "home",
        "end",
        "page up",
        "page down",
        "caps lock",
        "scroll lock",
        ...Array.from({ length: 24 }, (_, i) => i + 1).map((e) => ({
          text: "F" + e,
          value: "f" + e,
        })),
        { text: "space", value: " " },
        ..."~`abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]\\|;:'\",<.>/?{}",
        "contextmenu",
        "mediaplaypause",
        "audiovolumemute",
        "audiovolumedown",
        "audiovolumeup",
        "launchapplication2",
        "launchmediaplayer",
        "mediatracknext",
        "mediatrackprevious",
        "Meta",
      ]
    }
    menu_fullkeylistandany() {
      return ["any", ...this.menu_fullkeylist()]
    }
  }
  var a = loadlib("newallfuncs")
  var enabledextensions = sp.get() ?? {
    extensionmanagercreatedbyrssaromeo: true,
  }
  var extensionclasses = []
  // unsafeWindow.extensionclasses = extensionclasses
  newext(
    "extension manager",
    "rssaromeo",
    class {
      getlasterror() {
        return String(
          extensionerrors[extensionerrors.length - 1]?.message ??
            false
        )
      }
      getlasterrorextensionid() {
        return String(
          extensionerrors[extensionerrors.length - 1]?.extensionid ??
            false
        )
      }
      getlasterrorblockid() {
        return String(
          extensionerrors[extensionerrors.length - 1]?.blockid ??
            false
        )
      }
      puterrorsintolist({ listname }) {
        var [sprite, listname] = JSON.parse(listname)
        scratchlist(
          listname,
          extensionerrors.map((e) => JSON.stringify(e)),
          sprite
        )
      }
    },
    [
      newblock(
        bt.ret,
        "getlasterrorextensionid",
        "lasterror: extension id"
      ),
      newblock(bt.ret, "getlasterror", "lasterror: message"),
      newblock(bt.ret, "getlasterrorblockid", "lasterror: block id"),
      newblock(
        bt.cmd,
        "puterrorsintolist",
        "put errors into list [listname]",
        [newmenu("listnames", { defaultValue: "" })]
      ),
    ]
  )
  loadlib("libloader").savelib("scratchextesnsionmanager", {
    newmenu,
    newext,
    newblock,
    bt,
    inp,
    gettarget,
    totype,
    scratch_math,
    projectid,
    canvas,
    scratchvar,
    scratchlist,
  })
  // unsafeWindow.sp = sp
  await loadlib("libloader").waitforlib("scratch")
  await a.waituntil(canvas)

  var vm = loadlib("scratch").vm
  loadallextensions()
  function loadallextensions() {
    // debugger
    for (var __class of extensionclasses) {
      var extensionInstance = new __class(
        vm.extensionManager.runtime,
        __class.thisExtensionIsEnabled
      )
      vm.extensionManager._loadedExtensions.set(
        extensionInstance.getInfo().id,
        vm.extensionManager._registerInternalExtension(
          extensionInstance
        )
      )
    }
  }

  function newblock(blockType, opcode, text, args) {
    var arguments = Object.fromEntries(
      [...(text.match(/(?<=\[)\w+(?=\])/g) || [])].map((_, i) => [
        _,
        typeof args?.[i] == "object"
          ? {
              type: args?.[i]?.type || args?.[i] || inp.str,
              disableMonitor: false,
              // defaultValue: false,
              // filter: [Scratch.TargetType.SPRITE],
              // filter: [Scratch.TargetType.STAGE],
              // isTerminal: false,
              // shouldRestartExistingThreads: true,
              // isEdgeActivated: false,
              ...(0 in args[i] && 1 in args[i]
                ? {
                    type: args[i][0] ?? inp.str,
                    defaultValue: args[i][1],
                  }
                : args[i]),
            }
          : {
              type: args?.[i]?.type || args?.[i] || inp.str,
              // defaultValue: false,
              disableMonitor: false,
            },
      ])
    )
    // log(arguments)
    return {
      hideFromPalette: false,
      blockType,
      opcode,
      text,
      arguments,
    }
  }

  function newmenu(name, opts = {}) {
    var data = {
      acceptReporters: true,
      items: "menu_" + name,
      ...opts,
    }
    menus[name] = data
    return { menu: name, ...opts }
  }

  function newext(
    name,
    username,
    _class,
    blockinfo,
    blockcolor = "#777777",
    menuicon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY0IDY0IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPgoJPHRpdGxlPk5ldyBQcm9qZWN0PC90aXRsZT4KCTxkZWZzPgoJCTxpbWFnZSAgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBpZD0iaW1nMSIgaHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQkFNQUFBQllSMnp0QUFBQUFYTlNSMElCMmNrc2Z3QUFBQ1JRVEZSRkFBQUFBT05sLy8vL0FPTmwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL0I2Y0NhQUFBQUF4MFVrNVRBUDhBQUFJRUR4TUJBd1VIM0Q5UFB3QUFBRVZKUkVGVWVKeGpaRUFHakFKQTR2OEhGS0ZSQmFNS1JoWFFRb0VnQTM0d3FvQllCVXJJUEhBb2c4T2JCQVhHWU9yOXFJSkJyMEJaQ2ErQ3RMMmhCd2RGN2g0WkNnRFBCSCtKaSsyWXRnQUFBQUJKUlU1RXJrSmdnZz09Ii8+Cgk8L2RlZnM+Cgk8c3R5bGU+Cgk8L3N0eWxlPgoJPHVzZSBpZD0iQmFja2dyb3VuZCIgaHJlZj0iI2ltZzEiIHg9IjAiIHk9IjAiLz4KPC9zdmc+",
    blockimg = ""
  ) {
    var bg = "#282828"
    if (blockcolor[0] != "#") blockcolor = "#" + blockcolor
    blockinfo = {
      color1: /https?:\/\/turbowarp\.org/.test(location.href)
        ? blockcolor
        : bg,
      color2: bg,
      color3: blockcolor,

      menuIconURI: menuicon,
      blockIconURI: blockimg,

      blocks: blockinfo,
    }
    blockinfo.id =
      name.replaceAll(/[^a-z]+/gi, "") + "createdby" + username
    blockinfo.name = name.replaceAll(/ /gi, " ") //+ " - by " + username
    blockinfo.menus = menus
    // warn(enabledextensions)
    GM_registerMenuCommand(
      (enabledextensions[blockinfo.id] ? "enabled" : "dissabled") +
        (": " + blockinfo.name),
      () => {
        // warn(enabledextensions[blockinfo.id])
        enabledextensions[blockinfo.id] =
          !enabledextensions[blockinfo.id]
        // warn(enabledextensions[blockinfo.id])
      }
    )
    // log("menus", menus.spritelistwithoutglobal.items)
    blockinfo.blocks.unshift(
      newblock(
        bt.bool,
        "thisextensionexists",
        "the extension {" + blockinfo.name + "} is enabled"
      )
    )
    function Classes(bases) {
      class Bases {
        constructor() {
          bases.forEach((base) => Object.assign(this, new base()))
        }
      }
      bases.forEach((base) => {
        Object.getOwnPropertyNames(base.prototype)
          .filter((prop) => prop != "constructor")
          .forEach(
            (prop) => (Bases.prototype[prop] = base.prototype[prop])
          )
      })
      return Bases
    }
    var enabled = enabledextensions[blockinfo.id]
    if (!enabled) {
      const properties = Object.getOwnPropertyNames(_class.prototype)
      for (const property of properties) {
        if (typeof _class.prototype[property] === "function") {
          _class.prototype[property] = function () {
            return false
          }
        }
      }
      _class.prototype.thisextensionexists = () => {
        return false
      }
    } else {
      _class.prototype.thisextensionexists = () => {
        return true
      }
    }
    function tryCatchDecorator(constructor) {
      const prototype = constructor.prototype
      const originalPrototype = Object.getPrototypeOf(prototype)

      for (let key of [
        ...Object.getOwnPropertyNames(prototype),
        ...Object.getOwnPropertyNames(originalPrototype),
      ]) {
        if (typeof prototype[key] === "function") {
          let originalMethod = prototype[key]
          prototype[key] = function (...args) {
            try {
              return originalMethod.apply(this, args)
            } catch (e) {
              extensionerrors.push({
                extensionid: blockinfo.id,
                blockid: key,
                message: e.message,
              })
              console.error("error from " + key, e)
              return false
            }
          }
        }
      }

      return constructor
    }
    // log("blockinfo.blocks", blockinfo.blocks)
    var __class = tryCatchDecorator(
      class extends Classes([_class, menufuncs]) {
        constructor(runtime, enabled) {
          super(runtime)
          if (enabled !== undefined)
            this.thisExtensionIsEnabled = enabled
          this.runtime = runtime
        }
        getInfo() {
          // log("getInfo", blockinfo)
          return blockinfo
        }
      }
    )
    extensionclasses.push(__class)
    sp.enabledextensions = enabledextensions
  }

  function scratchvar(varname, value, spritename) {
    if (value !== undefined) {
      if (gettarget(spritename)?.getvar(varname))
        gettarget(spritename).getvar(varname).value = String(value)
      else {
        console.warn(`var "${varname}" does not exist`)
      }
    }
  }

  function totype(inp, type, forced) {
    //number, string, list, object, json, bool
    inp = String(inp)
    try {
      switch (type) {
        // case "regex":
        //   try {
        //     return new RegExp(inp)
        //   } catch (e) {
        //     return fail(inp, type, forced)
        //   }
        case "string":
          return String(inp)
        case "number":
          if (inp == "true") inp = 1
          if (inp == "false") inp = 0
          if (/^-?[0-9]*\.?[0-9]+$/.test(inp)) return Number(inp)
          if (inp === "NaN" || inp == "nan") return NaN
          return fail(inp, type, forced)
        case "list":
          if (scratchlist(inp)) return scratchlist(inp)
          inp = JSON.parse(inp)
          if (inp.reverse) return inp
          return fail(inp, type, forced)
        case "object":
          inp = JSON.parse(inp)
          // if (/^[\-0-9]+$/.test(inp) || inp === true || inp === false)
          //   return undefined
          if (
            Object.keys(inp).length !== undefined &&
            inp.length === undefined &&
            !Array.isArray(inp)
          )
            return inp
          return fail(inp, type, forced)
        case "bool":
          if (inp === "1" || inp === "true") return true
          if (inp === "0" || inp === "false") return false
          return fail(inp, type)
        // case "json":
        //   if (
        //     totype(inp, "object") !== undefined ||
        //     totype(inp, "list") !== undefined
        //   )
        //     return totype(inp, "object") || totype(inp, "list")
        //   else {
        //     fail(inp, type, forced)
        //   }
      }
    } catch (s) {
      return fail(inp, type, forced)
    }

    function fail(inp, type, forced) {
      if (forced) {
        throw new Error(`"${inp}" must be of type "${type}"`)
      } else return undefined
    }
  }

  // listen(window, "keydown", (e) => {
  //   var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(
  //     e.key.toUpperCase(),
  //   )
  //   if (index !== -1) {
  //     vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
  //   }
  //   vm.runtime.ioDevices.keyboard._keysPressed.push(e.key.toUpperCase())
  // })
  // listen(window, "keyup", (e) => {
  //   var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(
  //     e.key.toUpperCase(),
  //   )
  //   if (index !== -1) {
  //     vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
  //   }
  // })

  function gettarget(sprite) {
    if (sprite)
      var x =
        vm.runtime.getSpriteTargetByName(sprite) ||
        vm.runtime.getTargetForStage()
    else var x = vm.runtime.getTargetForStage()
    x.getvar = x?.lookupVariableByNameAndType
    return x
  }

  function scratchlist(listname, value, spritename) {
    //fix regex?
    if (value === undefined && /^\[\]$/.test(listname))
      return JSON.parse(listname)
    if (value !== undefined) {
      if (gettarget(spritename)?.getvar(listname, "list"))
        gettarget(spritename).getvar(listname, "list").value = [
          ...value,
        ]
      else console.warn(`list "${listname}" does not exist`)
    } else {
      return gettarget(spritename)?.getvar(listname, "list")?.value
    }
  }

  function scratch_math(operator, n) {
    switch (operator) {
      case "sin":
        return Math.round(Math.sin((Math.PI * n) / 180) * 1e10) / 1e10
      case "cos":
        return Math.round(Math.cos((Math.PI * n) / 180) * 1e10) / 1e10
      case "asin":
        return (Math.asin(n) * 180) / Math.PI
      case "acos":
        return (Math.acos(n) * 180) / Math.PI
      case "atan":
        return (Math.atan(n) * 180) / Math.PI
      case "log":
        return Math.log(n) / Math.LN10
    }
    return 0
  }

  function canvas() {
    return (
      window?.vm?.runtime?.renderer?.canvas ||
      document.querySelector(
        "#app > div > div.gui_body-wrapper_-N0sA.box_box_2jjDp > div > div.gui_stage-and-target-wrapper_69KBf.box_box_2jjDp > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas"
      ) ||
      document.querySelector(
        "#view > div > div.inner > div:nth-child(2) > div.guiPlayer > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas"
      ) ||
      document.querySelector(
        "#app > div > div > div > div.gui_body-wrapper_-N0sA.box_box_2jjDp > div > div.gui_stage-and-target-wrapper_69KBf.box_box_2jjDp > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas"
      ) ||
      document.querySelector(
        ".stage_stage_yEvd4 > div:nth-child(1) > canvas:nth-child(1)"
      )
    )
  }
})()
