// ==UserScript==
// @name         tampermonkey storage proxy
// @version      2
// @description  none
// @run-at       document-start
// @author       You
// @license      GPLv3
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==
class storageproxy {
  #mainstoragekey
  #lastGotData
  updateRequired = false
  onupdate
  constructor(mainstoragekey = "storageproxy") {
    this.#mainstoragekey = mainstoragekey
    this.updateRequired = false
    GM_addValueChangeListener(
      mainstoragekey,
      ((key, oldValue, newValue, remote) => {
        this.updateRequired = true
        this.onupdate?.(key, oldValue, newValue, remote)
      }).bind(this)
    )
  }
  update() {
    if (this.updateRequired) {
      this.updateRequired = false
      return this.get()
    }
    return this.#lastGotData
  }
  get() {
    var mainstoragekey = this.#mainstoragekey
    var mainobj = GM_getValue(mainstoragekey)
    if (mainobj) {
      mainobj = JSON.parse(mainobj)
    } else {
      GM_setValue(mainstoragekey, "{}")
      mainobj = {}
    }
    return (this.#lastGotData = p(mainobj))
    function p(container) {
      return new Proxy(container, {
        get(obj, prop) {
          var val = Reflect.get(obj, prop)
          if (
            ["[object Array]", "[object Object]"].includes(
              Object.prototype.toString.call(val)
            )
          )
            return p(val)
          return val
        },
        set(obj, prop, val) {
          if (prop == "__all") {
            GM_setValue(
              mainstoragekey,
              JSON.stringify((mainobj = val))
            )
            return val
          }
          var temp = Reflect.set(obj, prop, val)
          GM_setValue(mainstoragekey, JSON.stringify(mainobj))
          return temp
        },
        deleteProperty(obj, prop) {
          var temp = Reflect.deleteProperty(obj, prop)
          GM_setValue(mainstoragekey, JSON.stringify(mainobj))
          return temp
        },
      })
    }
  }
}
