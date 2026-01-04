// ==UserScript==
// @name         Ncore limit
// @description  Allows real time filtering of the listed torrents by specifying the minimum amount for the given column
// @namespace    http://tampermonkey.net/
// @version      0.5
// @match        https://ncore.pro/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397098/Ncore%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/397098/Ncore%20limit.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const descriptors = {
    s: ".box_s2 > .torrent",
    l: ".box_l2 > .torrent",
    dl: ".box_d2"
  };

  function addInputBoxes(header) {
    const dlContainer = header.querySelectorAll(".box_alap")[4].querySelectorAll(".alcim > tbody > tr > td")[1];
    const sContainer = header.querySelectorAll(".box_alap")[5].querySelectorAll(".alcim > tbody > tr > td")[1];
    const lContainer = header.querySelectorAll(".box_alap")[6].querySelectorAll(".alcim > tbody > tr > td")[1];

    dlContainer.innerHTML = "";
    sContainer.innerHTML = "";
    lContainer.innerHTML = "";

    const dl_input = createInput("dl_input", (text) => {
      s_input.value = ''
      l_input.value = ''

      dl_input.value = new Array(text.length + 1).join('+')
      hideBelowTreshold("dl", text.length)
    })
    const s_input = createInput("s_input", (text) => {
      l_input.value = ''
      dl_input.value = ''
      hideBelowTreshold("s", parseInt(text))
    })
    const l_input = createInput("l_input", (text) => {
      s_input.value = ''
      dl_input.value = ''
      hideBelowTreshold("l", parseInt(text))
    })

    dlContainer.appendChild(dl_input);
    sContainer.appendChild(s_input);
    lContainer.appendChild(l_input);
  }

  function createInput(className, callback) {
    const child = document.createElement("input");
    child.classList.add(className);
    child.classList.add("keresesMezo");
    child.style.width = "30px";
    child.style.padding = "0px";

    child.addEventListener('input', function () {
      callback(child.value)
    });

    return child
  }

  function hideBelowTreshold(descriptor, treshold) {
    let localTreshold = 0
    if (treshold) {
      localTreshold = treshold
    }

    document.querySelectorAll(".box_torrent").forEach(node => {
      node.style.display = "block"
      let parameterNode = node.querySelector(
        `.box_nagy > ${descriptors[descriptor]}`
      );
      if (!parameterNode) {
        parameterNode = node.querySelector(
          `.box_nagy2 > ${descriptors[descriptor]}`
        );
      }

      if (parameterNode) {
        if (descriptor === "dl") {
          if (parameterNode.innerHTML.length < treshold) {
            node.style.display = "none";
          }

          return;
        }

        const count = parseInt(parameterNode.innerHTML);
        if (count < treshold) {
          node.style.display = "none";
        }
      }
    });

    if (descriptor === "dl") {
      sortByMostPopular()
    } else {
      sortByDescriptor(descriptor)
    }
  }

  function sortByDescriptor(descriptor) {
    const boxTorrentNodes = Array.from(document.querySelectorAll(".box_torrent")).map(node => node.cloneNode(true))
    const expandMap = {}
    boxTorrentNodes.forEach(node => {
      const torrentId = getTorrentId(node)
      const expand = document.getElementById(torrentId)

      expandMap[torrentId] = expand
    })

    boxTorrentNodes.sort((first, second) => {
      const firstValue = getValue(first, descriptor)
      const secondValue = getValue(second, descriptor)

      let firstValueNum = 0
      if (firstValue !== null) {
        firstValueNum = Number(firstValue)
      }

      let secondValueNum = 0
      if (secondValue !== null) {
        secondValueNum = Number(secondValue)
      }

      return firstValueNum < secondValueNum
    })

    const boxTorrentAll = document.querySelector(".box_torrent_all")
    boxTorrentAll.innerHTML = ""

    boxTorrentNodes.forEach((node) => {
      const torrentId = getTorrentId(node)

      boxTorrentAll.appendChild(node)
      boxTorrentAll.appendChild(expandMap[torrentId])
    })
  }

  function sortByMostPopular() {
    const boxTorrentNodes = Array.from(document.querySelectorAll(".box_torrent")).map(node => node.cloneNode(true))
    const expandMap = {}
    boxTorrentNodes.forEach(node => {
      const torrentId = getTorrentId(node)
      const expand = document.getElementById(torrentId)

      expandMap[torrentId] = expand
    })

    boxTorrentNodes.sort((first, second) => {
      const firstSeeders = getValue(first, 's')
      const firstLeechers = getValue(first, 'l')

      const secondSeeders = getValue(second, 's')
      const secondLeechers = getValue(second, 'l')

      let firstPop = 0;
      if (firstSeeders !== null && firstLeechers !== null) {
        firstPop = Number(firstSeeders) + Number(firstLeechers)
      }


      let secondPop = 0;
      if (secondSeeders !== null && secondLeechers !== null) {
        secondPop = Number(secondSeeders) + Number(secondLeechers)
      }

      return firstPop < secondPop
    })

    const boxTorrentAll = document.querySelector(".box_torrent_all")
    boxTorrentAll.innerHTML = ""

    boxTorrentNodes.forEach((node) => {
      const torrentId = getTorrentId(node)

      boxTorrentAll.appendChild(node)
      boxTorrentAll.appendChild(expandMap[torrentId])
    })
  }

  function getValue(boxTorrentNode, descriptor) {
    let parameterNode = boxTorrentNode.querySelector(
      `.box_nagy > ${descriptors[descriptor]}`
    );
    if (!parameterNode) {
      parameterNode = boxTorrentNode.querySelector(
        `.box_nagy2 > ${descriptors[descriptor]}`
      );
    }

    if (parameterNode) {
      return parameterNode.innerHTML
    }

    return null
  }

  function getTorrentId(boxTorrentNode) {
    let parameterNode

    if (!parameterNode) {
      parameterNode = boxTorrentNode.querySelector(
        `.box_nagy2 > .box_nev2 > .tabla_szoveg > .torrent_txt > a`
      );
    }
    if (!parameterNode) {
      parameterNode = boxTorrentNode.querySelector(
        `.box_nagy > .box_nev2 > .tabla_szoveg > .torrent_txt > a`
      );
    }
    if (!parameterNode) {
      parameterNode = boxTorrentNode.querySelector(
        `.box_nagy > .box_nev2 > .tabla_szoveg > .torrent_txt2 > a`
      );
    }
    if (!parameterNode) {
      parameterNode = boxTorrentNode.querySelector(
        `.box_nagy2 > .box_nev2 > .tabla_szoveg > .torrent_txt2 > a`
      );
    }

    if (parameterNode) {
      return parameterNode.href.match(/(?:id=)(\d*)/)[1]
    }

    return null
  }

  const header = document.querySelector(".lista_all > .box_alcimek_all").cloneNode(true)
  header.querySelector(".box_tipus").innerHTML = ""
  header.querySelector(".box_nev").innerHTML = ""
  header.querySelector(".box_feltoltve").innerHTML = ""
  header.querySelector(".box_meret").innerHTML = ""
  header.querySelector(".box_feltolto").innerHTML = ""
  header.style.background = "transparent"

  const torrentek = document.querySelector(".lista_all > .box_torrent_all")
  document.querySelector(".lista_all").insertBefore(header, torrentek)

  addInputBoxes(header)
  //sortByMostPopular()

})();

