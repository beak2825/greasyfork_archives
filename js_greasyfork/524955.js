// ==UserScript==
// @name         scratch extesion: var manip by rssaromeo
// @version      4
// @description  none
// @tag          lib
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAzpJREFUeF7tm9FtHDEMRH2AS3ApqSGdpIekgqSHdJIaUkpKMJBABhToZJEzQ1GrXdv3u3eS5nFIcbV7t4cFnz/fHv8uGPbh6fvzLXvctAFXibYEZ8FIAXC0+AolA8IUgF3Ce1fMgAgDiIj/+dsvDV8+hZcTrg/yjIpwJBgVtAgQ1Q0SAFb8rPAejApCgUADQOKzRVvuYGGwECgAZxFfoWRCgAA88UdFfcYNyAkugDOLV9zgQTABXEF86wyUFhaEIYCriWfdMIIgAdid86hvKNc9J1AAotH/+uv51fp+fH5k1pz+HQXCnQMyxfeqjobBQqAAWNYfRd0LpwXBGseDhhwnA1Cjr4ovYEaCvHFmALD14MUBR4gfAUAQVQCjtENOcAGMrI8WraQAGuvdAmALJgvQckHZFm+K/dGEaD9rhUVzv52DWU+Z00sDE8Cs/VEUMwAUGAhCXYcFIRUAEl2jlyWecUMIgLrvs8J3AGh3n5ELhg7YBaCARA3OyPY1AKihWgJAjb6XtwwAD9AlAKD890Qggeg65QDvlpexJ9oKowCYBgsBGLXHr2qACoBZGFP82mKFtrZ2Tqa3aL/Tu+ADQN8JXskBfQG+dAqwYiz7o93FOjc8TQqoZwXK+cIlakAEAHvGsBSA0gihLZDp7b2zxpQaUCZQWuFsAMoWWGFcqhVGLvgAMHi+gLrLN+8ARiBylnVKPH0gotQAdILDjtWLte4i2xqx7ESIXTRb4VeNJwMY7QYZd4PIBVaDY9UBVDThoWgZ2DoZ7rfDowAoEKK5X+Z4ORZXAKBqrF5nFu+NyUTfKn4UAK8pUsWOvr8SADoNvgPguWAXBKYYIoDouWDR9v/xuPKEKCP6dYyZuoJ+6z0Sq/NT7wesdkEm0DoWE/07B9Qf7nJCJgRW/LsDQL0ktbMgZrhAif7QAVdOBVV8GECFdJb3BqNviboAUCqcBcKMeAiAhbBjm0TCa6eH6gp8Xf6MELLEUw5giuKIcnZ9YESzUW/XSzkgCiEjNVjhEfGSA1pq6C80Xt4hZyiC6zzoXyHeeiQHZEFAhUm5PiM+7IAzgJgVXjWEHbATQpb4FAf0dp2pD571M0W38/wDGeDbTwDQVuQAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524955/scratch%20extesion%3A%20var%20manip%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524955/scratch%20extesion%3A%20var%20manip%20by%20rssaromeo.meta.js
// ==/UserScript==
;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  const {
    newext,
    newmenu,
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
  } = loadlib("scratchextesnsionmanager")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  newext(
    "var manip",
    "rssaromeo",
    class {
      // deletevar({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "")?.id) {
      //     gettarget(sprite).deleteVariable(
      //       gettarget(sprite).getvar(varname, "").id
      //     )
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      // deletelist({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "list")?.id) {
      //     gettarget(sprite).deleteVariable(
      //       gettarget(sprite).getvar(varname, "list").id
      //     )
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      // showvar({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "")?.id) {
      //     vm.runtime._primitives.data_showvariable({
      //       VARIABLE: gettarget(sprite).getvar(varname, ""),
      //     })
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      // showlist({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "list")?.id) {
      //     vm.runtime._primitives.data_showlist({
      //       LIST: gettarget(sprite).getvar(varname, "list"),
      //     })
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      // hidevar({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "")?.id) {
      //     vm.runtime._primitives.data_hidevariable({
      //       VARIABLE: gettarget(sprite).getvar(varname, ""),
      //     })
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      // hidelist({ varname, sprite }) {
      //   // if (!gettarget(sprite))
      //   //   return scratchvar("__error", "sprite does not exist")
      //   if (gettarget(sprite).getvar(varname, "list")?.id) {
      //     vm.runtime._primitives.data_hidelist({
      //       LIST: gettarget(sprite).getvar(varname, "list"),
      //     })
      //     // return true
      //   } else {
      //     // return false
      //   }
      // }
      deletevar({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "")?.id) {
          gettarget(sprite).deleteVariable(
            gettarget(sprite).getvar(varname, "").id
          )
        }
      }
      createlist({ varname, sprite }) {
        log("sprite", sprite)
        gettarget(sprite).createVariable(
          varname,
          varname,
          "list",
          sprite
        )
      }
      deletelist({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "list")?.id) {
          gettarget(sprite).deleteVariable(
            gettarget(sprite).getvar(varname, "list").id
          )
        }
      }
      showvar({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "")?.id) {
          vm.runtime._primitives.data_showvariable({
            VARIABLE: gettarget(sprite).getvar(varname, ""),
          })
        }
      }

      createvar({ varname, sprite }) {
        log("sprite", sprite)
        gettarget(sprite).createVariable(varname, varname, "", sprite)
      }
      showlist({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "list")?.id) {
          vm.runtime._primitives.data_showlist({
            LIST: gettarget(sprite).getvar(varname, "list"),
          })
        }
      }
      hidevar({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "")?.id) {
          vm.runtime._primitives.data_hidevariable({
            VARIABLE: gettarget(sprite).getvar(varname, ""),
          })
        }
      }
      hidelist({ varname }) {
        var [sprite, varname] = JSON.parse(varname)
        if (gettarget(sprite).getvar(varname, "list")?.id) {
          vm.runtime._primitives.data_hidelist({
            LIST: gettarget(sprite).getvar(varname, "list"),
          })
        }
      }
    },
    [
      // newblock(bt.cmd, "hidelist", "hide list [varname] in sprite [sprite]", [
      //   newmenu("listnames", { defaultValue: "" }),
      //   newmenu("spritelistwithglobal", { defaultValue: "" }),
      // ]),
      // newblock(bt.cmd, "showlist", "show list [varname] in sprite [sprite]", [
      //   newmenu("listnames", { defaultValue: "" }),
      //   newmenu("spritelistwithglobal", { defaultValue: "" }),
      // ]),
      // newblock(bt.cmd, "hidevar", "hide var [varname] in sprite [sprite]", [
      //   newmenu("varnames", { defaultValue: "" }),
      //   newmenu("spritelistwithglobal", { defaultValue: "" }),
      // ]),
      // newblock(bt.cmd, "showvar", "show var [varname] in sprite [sprite]", [
      //   newmenu("varnames", { defaultValue: "" }),
      //   newmenu("spritelistwithglobal", { defaultValue: "" }),
      // ]),
      newblock(bt.cmd, "hidelist", "hide list [varname]", [
        newmenu("listnames", { defaultValue: "" }),
        newmenu("spritelistwithglobal", { defaultValue: "" }),
      ]),
      newblock(bt.cmd, "showlist", "show list [varname]", [
        newmenu("listnames", { defaultValue: "" }),
        newmenu("spritelistwithglobal", { defaultValue: "" }),
      ]),
      newblock(bt.cmd, "hidevar", "hide var [varname]", [
        newmenu("varnames", { defaultValue: "" }),
        newmenu("spritelistwithglobal", { defaultValue: "" }),
      ]),
      newblock(bt.cmd, "showvar", "show var [varname]", [
        newmenu("varnames", { defaultValue: "" }),
        newmenu("spritelistwithglobal", { defaultValue: "" }),
      ]),
      // newblock(
      //   bt.cmd,
      //   "deletelist",
      //   "broken: delete list [varname] in sprite [sprite]",
      //   [
      //     newmenu("listnames", { defaultValue: "" }),
      //     newmenu("spritelistwithglobal", { defaultValue: "" }),
      //   ]
      // ),
      // newblock(
      //   bt.cmd,
      //   "deletevar",
      //   "broken: delete var [varname] in sprite [sprite]",
      //   [
      //     newmenu("varnames", { defaultValue: "" }),
      //     newmenu("spritelistwithglobal", { defaultValue: "" }),
      //   ]
      // ),
      newblock(
        bt.cmd,
        "createlist",
        "create list [varname] in sprite [sprite]",
        [
          inp.str,
          newmenu("spritelistwithglobal", { defaultValue: "" }),
        ]
      ),
      newblock(
        bt.cmd,
        "createvar",
        "create var [varname] in sprite [sprite]",
        [
          inp.str,
          newmenu("spritelistwithglobal", { defaultValue: "" }),
        ]
      ),
    ],
    "ec7904",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAzpJREFUeF7tm9FtHDEMRH2AS3ApqSGdpIekgqSHdJIaUkpKMJBABhToZJEzQ1GrXdv3u3eS5nFIcbV7t4cFnz/fHv8uGPbh6fvzLXvctAFXibYEZ8FIAXC0+AolA8IUgF3Ce1fMgAgDiIj/+dsvDV8+hZcTrg/yjIpwJBgVtAgQ1Q0SAFb8rPAejApCgUADQOKzRVvuYGGwECgAZxFfoWRCgAA88UdFfcYNyAkugDOLV9zgQTABXEF86wyUFhaEIYCriWfdMIIgAdid86hvKNc9J1AAotH/+uv51fp+fH5k1pz+HQXCnQMyxfeqjobBQqAAWNYfRd0LpwXBGseDhhwnA1Cjr4ovYEaCvHFmALD14MUBR4gfAUAQVQCjtENOcAGMrI8WraQAGuvdAmALJgvQckHZFm+K/dGEaD9rhUVzv52DWU+Z00sDE8Cs/VEUMwAUGAhCXYcFIRUAEl2jlyWecUMIgLrvs8J3AGh3n5ELhg7YBaCARA3OyPY1AKihWgJAjb6XtwwAD9AlAKD890Qggeg65QDvlpexJ9oKowCYBgsBGLXHr2qACoBZGFP82mKFtrZ2Tqa3aL/Tu+ADQN8JXskBfQG+dAqwYiz7o93FOjc8TQqoZwXK+cIlakAEAHvGsBSA0gihLZDp7b2zxpQaUCZQWuFsAMoWWGFcqhVGLvgAMHi+gLrLN+8ARiBylnVKPH0gotQAdILDjtWLte4i2xqx7ESIXTRb4VeNJwMY7QYZd4PIBVaDY9UBVDThoWgZ2DoZ7rfDowAoEKK5X+Z4ORZXAKBqrF5nFu+NyUTfKn4UAK8pUsWOvr8SADoNvgPguWAXBKYYIoDouWDR9v/xuPKEKCP6dYyZuoJ+6z0Sq/NT7wesdkEm0DoWE/07B9Qf7nJCJgRW/LsDQL0ktbMgZrhAif7QAVdOBVV8GECFdJb3BqNviboAUCqcBcKMeAiAhbBjm0TCa6eH6gp8Xf6MELLEUw5giuKIcnZ9YESzUW/XSzkgCiEjNVjhEfGSA1pq6C80Xt4hZyiC6zzoXyHeeiQHZEFAhUm5PiM+7IAzgJgVXjWEHbATQpb4FAf0dp2pD571M0W38/wDGeDbTwDQVuQAAAAASUVORK5CYII="
  )
})()
