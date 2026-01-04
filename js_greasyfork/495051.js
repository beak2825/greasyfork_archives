// ==UserScript==
// @name         lib:file opener
// @version      10
// @description  none
// @license      GPLv3
// @run-at       document-start
// @author       rssaromeo
// @match        *://*/*
// @include      *
// @tag          lib
// @exclude      /livereload.net\/files\/ffopen\/index.html$/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/495051/lib%3Afile%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/495051/lib%3Afile%20opener.meta.js
// ==/UserScript==
;(() => {
  const a = loadlib("allfuncs")
  const progressBar = loadlib("progress bar")
  const run = {
    file: runfile,
    folder: runfolder,
    globals: window.ERwkOoQYn9C3jxDZdovIZoZ2DmGt5wKyTMPU2uck ?? [],
  }
  delete window.ERwkOoQYn9C3jxDZdovIZoZ2DmGt5wKyTMPU2uck
  ;(async () => {
    var cac = {}
    async function newglobaljs(name, func = (e) => e, newname) {
      if ((newname ?? name).startsWith("blob:http")) return
      var text = cac[name] ?? (await (await fetch(name)).text())
      if (newname) name = newname
      cac[name] ??= text
      run.globals.push({
        text: func(text),
        name: name,
      })
    }
    run.newglobaljs = newglobaljs
  })()
  function hashformat({ isglobal, name }) {
    const hashformat = "#__isglobal: filename"
    if (isglobal == true) isglobal = "global"
    if (isglobal == false) isglobal = "local"
    return _replaceall(hashformat, [
      ["isglobal", isglobal],
      ["filename", name],
    ])
  }

  loadlib("libloader").savelib("file opener", run)
  async function runfile(file) {
    file = await formatfiles(await file.getFile())
    replaceglobalurls(file)
    await updateglobals(file)
    newurl(file, file.format)
    return openfile(file, file.name)
  }
  async function updateglobals(file) {
    const tempglobals = JSON.stringify([
      ...run.globals.map((e) => {
        return { name: e.name, text: e.text }
      }),
    ])
    //       .replaceAll("<", "&lt;")
    //       .replaceAll("&", "&amp;")
    if (file.name.endsWith(".html"))
      file.text =
        `<script>window.ERwkOoQYn9C3jxDZdovIZoZ2DmGt5wKyTMPU2uck = ${tempglobals}<\/script>` +
        file.text
  }
  async function runfolder(folder, mainfile = "index.html") {
    var files = await getfilesfromfolder(folder)
    const name = files[0].path.match(/^([^\/]+)\//, "")[1]
    files = await formatfiles(files)

    setupget(files)
    var index = files.get(mainfile)
    if (!index) {
      error(
        `folder ${name} doesn't contain ${mainfile}, searching for index.html instead`
      )
      index = files.get("index.html")
    }
    if (!index)
      throw new Error(`folder ${name} doesn't contain index.html`)
    var htmls = files.get(/\.html/i)
    //     error(a(files.get(/\.png/i)[0].file).readfile('DataURL'))
    var BAR = new progressBar(0, files.length + htmls.length)
    {
      for (var i in files) {
        var file = files[i]
        BAR.set(i, file.name)
        newurl(file, file.format)
        if (Number(i) % 15 == 0) await a.wait(0)
      }
      var f = files.get(/\./)
      f = f.filter((e) => ["js", "css"].includes(e.extension))
      for (var i in f) {
        var e = f[i]
        if (Number(i) % 15 == 0) {
          BAR.set(Number(i), e.name)
          await a.wait(0)
        }
        replaceallurls(e, files)
        replaceglobalurls(e)
        newurl(e)
      }
      for (var i in htmls) {
        var e = htmls[i]
        if (Number(i) % 15 == 0) {
          BAR.set(Number(i) + files.length, e.name)
          await a.wait(0)
        }
        replaceallurls(e, files)
        replaceglobalurls(e)
        newurl(e, "text/html")
      }
    }
    //     warn(index, index.path.split("/"))
    replaceallurls(index, files, true)
    await updateglobals(index)
    newurl(index, "text/html")
    BAR.remove()
    return openfile(index, name)
  }
  function openfile(file, name) {
    name ??= file?.file?.name
    return file.url
  }
  function getallgoodpaths(file, files, lll) {
    var p = file.path.split("/")
    var n = p.pop()
    return files.map((e) => {
      if (!e.path) error(e, file)
      var path = e.path.split("/")
      var name = path.pop()
      if (same(p, path)) {
        return { ...e, path: name }
      }
      var newpath = ""
      var rs = false
      p.forEach((e, i) => {
        if (same(e, path[i]) && !rs) return
        rs = true
        newpath += "../"
      })
      path.push("")
      return {
        ...e,
        path: newpath + path.join("/") + name,
      }
    })
    function same(a, s) {
      return JSON.stringify(a) == JSON.stringify(s)
    }
  }
  function replaceallurls(file, files, lll) {
    if (file.text.startsWith("#redirect")) {
      var redir = file.text.match(/^#redirect (.*)/)[1]
      var redirfile = files.get(redir)
      if (!redirfile)
        throw new Error(
          `failed to redirect from ${file.name} to ${redir}`
        )
      file.text =
        file.text.replace(`#redirect ${redir}`, "") +
        "\n" +
        redirfile.text
    }
    var goodfiles = getallgoodpaths(file, files, lll)
    goodfiles.forEach(({ path, url }) => {
      file.text = file.text.replaceAll(
        new RegExp(`(['"])(?:\\.\\/)*${regescape(path)}\\1`, "gi"),
        `"${url}${hashformat({ isglobal: false, name: path })}"`
      )
    })
    replaceglobalurls(file)
  }
  function regescape(reg) {
    return reg.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
  function newurl(file, type) {
    type ??= file.format
    var blob =
      type && type.startsWith("image/")
        ? new Blob([file.file], { type })
        : new Blob([file.text], { type })
    file.url = URL.createObjectURL(blob)
    return file
  }
  async function replaceglobalurls(file) {
    run.globals.forEach((e) => {
      if (!e.regex)
        e.regex = new RegExp(
          `(['"])(?:\\.?\\.\\/)*${regescape(e.name)}\\1`,
          "gi"
        )
      if (!e.url)
        e.url = URL.createObjectURL(
          new Blob([e.text], { type: "text/javascript" })
        )
      file.text = file.text.replaceAll(
        e.regex,
        `"${e.url}${hashformat({ isglobal: true, name: e.name })}"`
      )
    })
    return file
  }
  async function formatfiles(files) {
    if (!a.gettype(files, "array")) return await format(files)
    return await Promise.all(files.map(format))
    async function format(file) {
      var data = await a.readfile(file)
      //       if(file.name.match(/\.(\w+)$/)?.[1]=='svg'){
      //         error(file)
      //       }
      return {
        name: file.name,
        text: data,
        path: file?.path?.replace?.(/^[^\/]+\//, ""),
        extension: file.name.match(/\.(\w+)$/)?.[1],
        format: {
          js: "text/javascript",
          html: "text/html",
          css: "text/css",
          jpg: "image/jpg",
          jpeg: "image/jpeg",
          png: "image/png",
          svg: "image/svg+xml",
        }[file.name.match(/\.(\w+)$/)?.[1]],
        file,
      }
    }
  }
  function setupget(files) {
    files.get = function (name, skip = 0) {
      if (a.gettype(name, "string"))
        return files.find((e) => {
          return e.path == name
        })
      else return files.filter((e) => name.test(e.path))
    }
  }

  async function getfilesfromfolder(
    dirHandle,
    path = dirHandle.name
  ) {
    const dirs = []
    const files = []
    //     warn(path)
    for await (const entry of dirHandle.values()) {
      const nestedPath = `${path}/${entry.name}`
      if (
        nestedPath.startsWith(dirHandle.name + "/codemirror/mode/ja")
      )
        error(nestedPath, entry)
      if (entry.kind === "file") {
        files.push(
          entry.getFile().then((file) => {
            file.directoryHandle = dirHandle
            file.handle = entry
            Object.defineProperty(file, "path", {
              configurable: true,
              enumerable: true,
              get: () => nestedPath,
            })
            return Object.defineProperty(file, "webkitRelativePath", {
              configurable: true,
              enumerable: true,
              get: () => nestedPath,
            })
          })
        )
      } else if (entry.kind === "directory") {
        // warn(entry, nestedPath)
        dirs.push(getfilesfromfolder(entry, nestedPath))
      } else {
        error(entry.kind)
      }
    }
    return [
      ...(await Promise.all(dirs)).flat(),
      ...(await Promise.all(files)),
    ]
  }
  function _replaceall(q, w, e) {
    switch (a.gettype(w, "array") + " " + a.gettype(e, "array")) {
      case "true true":
        if (e.length == w.length) {
          w.forEach((ww, i) => {
            q = q.replaceAll(ww, e[i])
          })
          return q
        }
        throw new Error(
          "when both are arrays the length must be the same"
        )
        break
      case "true false":
        if (a.gettype(w[0], "array")) {
          w.forEach(([ww, e]) => {
            q = q.replaceAll(ww, e)
          })
        } else {
          w.forEach((ww) => {
            q = q.replaceAll(ww, e)
          })
        }
        return q
        break
      case "false false":
        return q.replaceAll(w, e)
        break
    }
  }
})()
