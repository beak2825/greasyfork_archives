// ==UserScript==
// @name            AnimeBytes Bookmarks for Collages & Companies
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         29
// @description     Remember your favorite collages and companies!
// @match           https://animebytes.tv/collage.php*
// @match           https://animebytes.tv/bookmarks.php*
// @match           https://animebytes.tv/company.php*
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=26497&page=1#post1318696
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/453138/AnimeBytes%20Bookmarks%20for%20Collages%20%20Companies.user.js
// @updateURL https://update.greasyfork.org/scripts/453138/AnimeBytes%20Bookmarks%20for%20Collages%20%20Companies.meta.js
// ==/UserScript==
(function() {
  'use strict';

  unsafeWindow.abcb = {
    bookmarks: JSON.parse(GM_getValue("abcb", "{}"))
  }
  var bookmarks, header, text, a, linkbox, container

  function fetchPageForId(id, callback) {
    var url;
    if (id.match(/C.*/)) {
        id = id.substring(1)
        url = "https://animebytes.tv/company.php?id=" + id
    } else {
        url = "https://animebytes.tv/collage.php?id=" + id
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        var container = document.implementation.createHTMLDocument().documentElement;
        container.innerHTML = response.responseText;
        callback(container)
      }
    })
  }

  function buildBookmarkTab() {
    bookmarks = document.createElement("div")
    bookmarks.className = "thin"
    bookmarks.id = "bookmarks"
    header = document.createElement("h2")
    header.className = "center"
    text = document.createTextNode("Bookmarks")
    header.appendChild(text)
    bookmarks.appendChild(header)
    return bookmarks
  }

  function buildBookmarkTableAndSaveData() {
    let ret = {}
    let data = []
    let table, body, row, text, td
    table = document.createElement("table")
    table.width = "100%"


    body = table.createTBody();
    row = body.insertRow();
    row.className = "colhead"
    for (const header of ["Collage", "Torrents when Last Checked"]) {
      td = document.createElement("td");
      text = document.createTextNode(header);
      td.appendChild(text);
      row.appendChild(td);
    }
    var next = "rowa"
    for (const [key, value] of Object.entries(unsafeWindow.abcb.bookmarks)) {
      row = body.insertRow();
      row.className = next
      next = next == "rowa" ? "rowb" : "rowa"

      td = document.createElement("td");
      a = document.createElement("a");
      if (key.match(/C.*/)) {
          a.href = "/company.php?id=" + key.substring(1)
      } else {
          a.href = "/collage.php?id=" + key
      }
      text = document.createTextNode(value.title);
      td.appendChild(a);
      a.appendChild(text);
      row.appendChild(td);

      td = document.createElement("td");
      text = document.createTextNode(value.groups);
      td.appendChild(text);
      row.appendChild(td);
      data[key] = {
        id: key,
        groups: value.groups,
        td: td,
      }
    }
    ret.table = table
    ret.data = data
    return ret
  }

  function addBookmark(id, data) {
    unsafeWindow.abcb.bookmarks = JSON.parse(GM_getValue("abcb", "{}"))
    unsafeWindow.abcb.bookmarks[id] = data
    GM_setValue("abcb", JSON.stringify(unsafeWindow.abcb.bookmarks))
  }

  function deleteBookmark(id) {
    unsafeWindow.abcb.bookmarks = JSON.parse(GM_getValue("abcb", "{}"))
    delete unsafeWindow.abcb.bookmarks[id]
    GM_setValue("abcb", JSON.stringify(unsafeWindow.abcb.bookmarks))
  }

  function deleteAllBookmarks(id) {
    if (confirm('Click "OK" to permanently delete all your bookmarked collages.')) {
      unsafeWindow.abcb.bookmarks = {}
      GM_setValue("abcb", JSON.stringify(unsafeWindow.abcb.bookmarks))
      location.reload()
    }
  }

  function is404(doc) {
      return doc.querySelector("#content .thin h2").innerText === "Error 404 - Not Found"
  }

  const NO_ERROR = null
  const PAGE_NOT_FOUND = 2
  function getBookmarkDataFromDocument(doc) {
    if (is404(doc)) {
        return {
            error: PAGE_NOT_FOUND
        }
    }
    return {
      error: NO_ERROR,
      title: doc.querySelector("#content .thin h2").innerText,
      groups: doc.querySelector(".sidebar .stats.nobullet").firstElementChild.textContent.replace("Groups: ", "")
    }
  }

  function hideCollagesTab(add_history=true) {
    unsafeWindow.abcb.tab_bookmarks.style.display = "none";
    unsafeWindow.abcb.tab_collages.style.display = "block";
    if (add_history) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  function showCollagesTab(add_history=true) {
    unsafeWindow.abcb.tab_bookmarks.style.display = "block";
    unsafeWindow.abcb.tab_collages.style.display = "none";
    if (add_history) {
      history.pushState("", document.title, window.location.pathname + window.location.search + "#collages");
    }
  }

  function toggleCollagesTab() {
    if (isOnCollagesTab()) {
      hideCollagesTab()
    } else {
      showCollagesTab()
    }
  }

  function refreshBookmarkTable() {
    let b
    let i = 0
    for (let d of Object.values(unsafeWindow.abcb.table_data)) {
      d.td.innerHTML = "Checking..."
      setTimeout(function () { fetchPageForId(d.id, function(doc) {
        let b = getBookmarkDataFromDocument(doc)
        if (b.error === PAGE_NOT_FOUND) {
            d.td.innerHTML = ""
            let a = createLinkboxLink("Collage no longer exists. Click to forget.", function() {
                d.td.parentNode.remove()
                deleteBookmark(d.id)
            })
            d.td.appendChild(a)
        } else if (b.groups !== d.groups) {
          d.td.innerHTML = d.groups + " -> " + b.groups
          deleteBookmark(d.id)
          addBookmark(d.id, b)
          d.groups = b.groups
        } else {
          d.td.innerHTML = d.groups
        }
      })} , i * 1000)
      i++;
    }
  }

  function getCollageId() {
    let id = new URLSearchParams(document.location.search).get('id')
    if (document.location.pathname == '/company.php') {
        return "C" + id
    } else {
        return id
    }
  }

  function isViewingCollage() {
    return getCollageId() !== null
  }

  function isViewingBookmarks() {
    return document.location.pathname === "/bookmarks.php"
  }

  function setupAndGetCollageTab() {
    container = document.querySelector("#content .thin")
    container.id = "nonCollages"
    return container
  }

  function createLinkboxLink(text, callback) {
    a = document.createElement("a")
    a.addEventListener("click", callback, false)
    a.style = "cursor: pointer;"
    a.appendChild(document.createTextNode(text))
    return a
  }

  function getLinkbox() {
    return document.querySelectorAll("#content .thin .linkbox")[0]
  }

  function createLinkbox() {
    linkbox = document.createElement("div");
    linkbox.className = "linkbox"
    return linkbox
  }

  function idIsBookmarked(id) {
    unsafeWindow.abcb.bookmarks = JSON.parse(GM_getValue("abcb", "{}"))
    return unsafeWindow.abcb.bookmarks.hasOwnProperty(id)
  }

  function isOnCollagesTab() {
    return document.location.hash === "#collages"
  }

  function hasAnyBookmarks() {
    return Object.entries(unsafeWindow.abcb.bookmarks).length !== 0
  }

  if (isViewingCollage()) {
    linkbox = getLinkbox()
    let id = getCollageId()
    a = createLinkboxLink(idIsBookmarked(id) ? "[Bookmarked]" : "[Bookmark]", function(e) {
      if (idIsBookmarked(id)) {
        deleteBookmark(id)
        a.innerHTML = "[Bookmark]"
      } else {
        if (document.readyState === "complete") {
          let data = getBookmarkDataFromDocument(document)
          addBookmark(id, data)
          a.innerHTML = "[Bookmarked]"
        } else {
          a.innerHTML = "[Bookmarking...]"
          document.onreadystatechange = function() {
            if (document.readyState === 'complete') {
              let data = getBookmarkDataFromDocument(document)
              addBookmark(id, data)
              a.innerHTML = "[Bookmarked]"
            }
          }
        }
      }
    })
    let m = document.querySelector(".linkbox")
    m.append(" ", a)
  } else if (isViewingBookmarks()) {
    unsafeWindow.abcb.tab_bookmarks = buildBookmarkTab()
    unsafeWindow.abcb.tab_collages = setupAndGetCollageTab()

    let clone_linkbox = getLinkbox().cloneNode(true)
    clone_linkbox.style = "margin-bottom: 0;"
    clone_linkbox.innerHTML = '[<a href="/bookmarks.php"></a><a href="/bookmarks.php">Torrents</a>: <a href="/bookmarks.php?type=1">Anime</a> | <a href="/bookmarks.php?type=2">Music</a>] [<a href="/bookmarks.php?type=3">Threads</a>] [Collages & Companies]'
    unsafeWindow.abcb.tab_bookmarks.appendChild(clone_linkbox)

    // regular linkbox
    linkbox = getLinkbox()
    a = createLinkboxLink("Collages & Companies", function() {})
    a.href = "#collages"
    linkbox.append("[")
    linkbox.append(a)
    linkbox.append("]")

    if (hasAnyBookmarks()) {
      linkbox = createLinkbox()
      linkbox.style = "margin-top: 0;"
      a = createLinkboxLink("[Delete all]", deleteAllBookmarks)
      linkbox.prepend(" ")
      linkbox.prepend(a)
      a = createLinkboxLink("[Refresh torrent count]", refreshBookmarkTable)
      linkbox.prepend(" ")
      linkbox.prepend(a)
      unsafeWindow.abcb.tab_bookmarks.appendChild(linkbox)

      var table = buildBookmarkTableAndSaveData()
      unsafeWindow.abcb.table_data = table.data
      unsafeWindow.abcb.tab_bookmarks.appendChild(table.table)
    } else {
      let p = document.createElement("p")
      p.className = "center"
      p.prepend(document.createTextNode("You don't have any collages bookmarked!"))
      unsafeWindow.abcb.tab_bookmarks.appendChild(p)
    }
    var editor = createLinkboxLink("[Show Data Editor]", refreshBookmarkTable)

    unsafeWindow.abcb.tab_collages.insertAdjacentElement("beforebegin", unsafeWindow.abcb.tab_bookmarks)

    if (isOnCollagesTab()) {
      showCollagesTab(false)
    } else {
      hideCollagesTab(false)
    }

    window.onhashchange = function() {
      if (isOnCollagesTab()) {
        showCollagesTab(false)
      } else {
        hideCollagesTab(false)
      }
    }
  }
})();
