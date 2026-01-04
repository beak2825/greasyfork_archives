// ==UserScript==
// @name         lib:strict
// @version      7
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @include      *
// @exclude      /livereload.net\/files\/ffopen\/index.html$/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/492113/lib%3Astrict.user.js
// @updateURL https://update.greasyfork.org/scripts/492113/lib%3Astrict.meta.js
// ==/UserScript==

;(() => {
  const a = loadlib("allfuncs")
  function testformat(
    obj,
    format,
    options = {
      allowextras: false,
      extrastype: undefined,
      allowconversions: false,
      logerror: true,
      allowunset: false,
      throwerror: true,
      insideextras: undefined,
    },
    insideextras
  ) {
    if (options.extrastype) {
      if (a.gettype(options.extrastype, "string")) {
        options.extrastype = options.extrastype.split("|")
      }
    }
    if (options.allowunset) options.extrastype.push("none")
    var isvalid = true
    var unsets = []
    if (insideextras) {
      for (var i = 0; i < Object.keys(obj).length; i++) {
        format.push(insideextras)
      }
    }
    format.find(
      (
        {
          name,
          prop = name,
          type,
          inside,
          insideoptions = {},
          value = [],
          insideextras,
        },
        i
      ) => {
        prop ??= String(i)
        if (insideextras) inside ??= []
        insideoptions = { ...options, ...insideoptions }
        var realvalue = obj[prop]
        if (a.gettype(type, "string")) {
          type = type.split("|")
        }
        if (options.allowunset) type.push("none")
        if (!a.gettype(realvalue, type)) {
          if (options.allowconversions) {
            if (
              type.find((type) => {
                if (settype.test(realvalue, type)) {
                  obj[prop] = settype(realvalue, type)
                  return true
                }
              })
            ) {
              return false
            }
            if (type.includes("any")) return false
          }

          if (!type.includes(obj[prop]))
            if (options.logerror) {
              if (!(prop in obj))
                error(
                  `the object is missing the property "${prop}". the property "${prop}" should have a type of "${type.join(
                    "|"
                  )}"`
                )
              else
                error(
                  `the value "${prop}" is of type "${a.gettype(
                    obj[prop]
                  )}" when it should be a type of "${type.join("|")}"`
                )
              error("missing or invalid peram type", {
                prop,
                obj,
                type,
              })
            }
          if (options.throwerror)
            throw new Error("missing or invalid peram type")
          isvalid = false
          return true
        }
        if (!(prop in obj)) unsets.push(prop)
        if (inside) {
          if (
            !testformat(
              realvalue,
              inside,
              insideoptions,
              insideextras
            )
          ) {
            if (options.logerror) error("invalid inside", { obj })
            if (options.throwerror) throw new Error("invalid inside")
            isvalid = false
            return true
          }
        }
      }
    )
    var objnames = [...Object.keys(obj), ...unsets]
    var formatnames = Object.values(format).map(
      (e, i) => e.name ?? String(i)
    )
    var extras = objnames.filter(
      (prop) => !formatnames.includes(prop)
    )
    if (!options.allowextras) {
      if (extras.length) {
        if (options.logerror) {
          error(
            `the object has the following extra properties: ${JSON.stringify(
              extras
            )}`
          )
          error("extras found when allowextras is false", {
            obj,
            objnames,
            formatnames,
          })
        }
        if (options.throwerror)
          throw new Error("extras found when allowextras is false")

        isvalid = false
      }
    }
    if (extras?.[0]?.name == "__extras") {
      var extras = extras[0]
      extras.shift()
      if (!testformat(obj.inside, obj.__extras, options)) {
        isvalid = false
        return true
      }
    }

    if (options.extrastype) {
      extras.find((prop) => {
        if (!a.gettype(obj[prop], options.extrastype)) {
          if (options.allowconversions) {
            if (
              options.extrastype.find((type) => {
                if (settype.test(obj[prop], type)) {
                  obj[prop] = settype(obj[prop], type)
                  return true
                }
              })
            ) {
              return false
            }
            if (options.extrastype.includes("any")) return false
          }
          isvalid = false
          return true
        }
      })
    }
    return isvalid
  }
  function strictfunction(func, types, options = {}) {
    if (!!options === options) options = { allowconversions: options }
    return function (...args) {
      if (
        !testformat((args = [...args]), types, {
          ...options,
          throwerror: true,
          logerror: true,
        })
      )
        throw new Error("error when calling function")
      return func.call(this, ...args)
    }
  }

  function setformat(obj, options = {}) {
    if (obj[Symbol.for("setformat")]) obj = { ...obj }
    return new Proxy(obj, {
      get(_obj, prop) {
        if (prop == Symbol.for("setformat")) return true
        if (prop == Symbol.for("options")) return options
        return Reflect.get(_obj, prop)
      },
    })
  }
  var entire_object
  function newtestformat(
    obj,
    format,
    tempoptions = {
      allowextras: false,
      extrasformat: {},
      functionname: "no name given",
      // allowconversions: false,
    }
  ) {
    entire_object ??= obj
    var extrakeys = []
    var options = { ...tempoptions, ...format[Symbol.for("options")] }
    for (var objkey of Object.keys(obj)) {
      if (!(objkey in format))
        if (options.allowextras) extrakeys.push(objkey)
        else
          throw new Error(
            error("object has extra key", {
              function_name: options.functionname,
              extra_key: objkey,
              format,
              obj,
              entire_object,
            })
          )
    }
    for (var [formatkey, formatval] of Object.entries(format)) {
      checkformat(formatkey, formatval)
    }
    function checkformat(formatkey, formatval) {
      let currentcomparevalue = obj[formatkey]
      if (formatval[Symbol.for("condfunc")])
        formatval = formatval(obj, entire_object)
      if (!a.gettype(obj, ["object", "array"]))
        throw new Error(
          error(`obj is not an object`, {
            function_name: options.functionname,
            object_is_instead: obj,
            trying_to_read_property: formatkey,
            entire_object,
          })
        )
      if (!(formatkey in obj))
        if (
          (formatval && formatval[Symbol.for("optional")]) ||
          (formatval.type && formatval.type.includes("none")) ||
          (formatval.type && formatval.type.includes("undefined")) ||
          (formatval.value && formatval.value.includes(undefined))
        )
          return
        else {
          throw new Error(
            error(`obj is missing property`, {
              function_name: options.functionname,
              missing_property: formatkey,
              object: obj,
              entire_object,
              format: { ...format[formatkey] },
            })
          )
        }
      if (!formatval[Symbol.for("setformat")]) {
        newtestformat(currentcomparevalue, formatval, tempoptions)
      } else {
        for (var [typekey, currentcheck] of Object.entries(
          formatval
        )) {
          // log({ obj, currentcomparevalue, typekey, currentcheck, formatval })
          switch (typekey) {
            case "type":
              if (
                a.gettype(currentcomparevalue, currentcheck) ||
                currentcheck == "any" ||
                currentcheck?.includes?.("any")
              )
                break
              else
                throw new Error(
                  error("type missmatch", {
                    function_name: options.functionname,
                    property: formatkey,
                    object: obj,
                    entire_object,
                    current_value: currentcomparevalue,
                    type_of_current_value: a.gettype(currentcomparevalue),
                    type_should_be: currentcheck,
                  })
                )
            case "value":
              if (currentcheck.includes(currentcomparevalue)) break
              else
                throw new Error(
                  error("value missmatch", {
                    format_key: formatkey,
                    object: obj,
                    entire_object,
                    function_name: options.functionname,

                    current_compare_value: currentcomparevalue,
                    type_of_current_compare_value: a.gettype(currentcomparevalue),
                    current_check: currentcheck,
                  })
                )
            default:
              throw new Error(
                "invalid key in format",
                error({
                  function_name: options.functionname,
                  object: obj,
                  entire_object,
                  type_key: typekey,
                  format_val: formatval,
                })
              )
          }
        }
      }
    }
    for (var key of extrakeys) {
      if (!options.extrasformat)
        throw new Error(
          `options has allowextras options must also have extrasformat in function [${options.functionname}]`
        )
      // log(options.extrasformat, options)
      checkformat(key, setformat(options.extrasformat), 1)
    }
    entire_object = undefined
    return true
  }
  loadlib("libloader").savelib("strict", {
    strictfunction,
    oldtestformat: testformat,
    setformat,
    optional: function (obj) {
      return new Proxy(obj, {
        get(_obj, prop) {
          if (prop == Symbol.for("optional")) return true
          return Reflect.get(_obj, prop)
        },
      })
    },
    condfunc: function (func) {
      return new Proxy(func, {
        get(_obj, prop) {
          if (prop == Symbol.for("condfunc")) return true
          return Reflect.get(_obj, prop)
        },
      })
    },
    testformat: newtestformat,
  })
})()
