// ==UserScript==
// @name         lib:indexeddb ls
// @version      10
// @description  none
// @license      GPLv3
// @run-at       document-start
// @author       rssaromeo
// @match        *://*/*
// @include      *
// @tag          lib
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @exclude      /livereload.net\/files\/ffopen\/index.html$/
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/491566/lib%3Aindexeddb%20ls.user.js
// @updateURL https://update.greasyfork.org/scripts/491566/lib%3Aindexeddb%20ls.meta.js
// ==/UserScript==
;(() => {
  function isFilesystemHandle(obj) {
    return (
      obj &&
      (obj instanceof FileSystemFileHandle ||
        obj instanceof FileSystemDirectoryHandle)
    )
  }
  var x = loadlib("libloader")
  const a = loadlib("allfuncs", "indexeddb ls")
  x.savelib("indexeddb ls", async function newdbproxy(name) {
    var db = await a.indexeddb_setup({
      storeName: name,
      keyPath: "id",
    })
    let indexedData = await a.indexeddb_getall(db)
    var localData = {}

    indexedData.forEach((item) => {
      localData[item.id] = item.val
    })

    function set(prop, val) {
      if (prop == "all") {
        return new Promise(async (done) => {
          await proxy.clear()
          Object.entries(val).forEach((item) => {
            localData[item[0]] = item[1]
          })
          await proxy.saveall()
          return done(true)
        })
      } else {
        localData[prop] = val
        a.indexeddb_set(db, { id: prop, val: val })
        // log("indexeddb ls", "setting", prop, "to", val)
      }
    }
    function remove(prop) {
      delete localData[prop]
      a.indexeddb_remove(db, prop)
    }

    const dbProxyHandler = {
      set(target, prop, value) {
        target[prop] = value
        set(prop, value)
        return true
      },
      get(target, prop) {
        switch (prop) {
          case Symbol.iterator:
            var ld = Object.entries(localData).map(([id, val]) => {
              return { id, val }
            })
            return function* () {
              for (var i in ld) {
                yield ld[i]
              }
            }
          case Symbol.toStringTag:
            return "ls"
          case "clear":
            return async function () {
              Object.keys(localData).forEach((key) => {
                Reflect.deleteProperty(localData, key)
              })
              await a.indexeddb_clearall(db)
              return localData
            }
          case "all":
            return localData
          case "loadall":
            return async function () {
              localData = {}
              var temp = await a.indexeddb_getall(db)
              temp.forEach((item) => {
                localData[item.id] = item.val
              })
              return localData
            }
          case "saveall":
            return async function () {
              Object.entries(localData)
                .map((e) => {
                  return { id: e[0], val: e[1] }
                })
                .forEach((item) => a.indexeddb_set(db, item))
            }
          default:
            var value = Reflect.get(target, prop)
            if (
              a.gettype(value, ["object", "array"]) &&
              !isFilesystemHandle(value)
            ) {
              value = new Proxy(
                value,
                newnestedProxyHandler(prop, value)
              )
            }
            return value
        }
      },
      deleteProperty(target, prop) {
        var val = Reflect.deleteProperty(target, prop)
        remove(prop)
        return val
      },
    }

    let proxy = new Proxy(localData, dbProxyHandler)
    function newnestedProxyHandler(mainprop, mainval) {
      return {
        mainprop,
        mainval,
        set(target, prop, value) {
          // trace(
          //   "nested",
          //   prop,
          //   value,
          //   this.mainprop,
          //   this.mainval,
          //   this
          // )
          target[prop] = value
          set(this.mainprop, this.mainval)
          return true
        },
        get(target, prop) {
          var val = target[prop]
          if (
            a.gettype(val, ["object", "array"]) &&
            !isFilesystemHandle(val)
          ) {
            return new Proxy(
              val,
              newnestedProxyHandler(mainprop, mainval)
            )
          }
          return val
        },
        deleteProperty(target, prop) {
          var val = Reflect.deleteProperty(target, prop)
          set(this.mainprop, this.mainval)
          return val
        },
      }
    }
    return proxy
  })
})()
