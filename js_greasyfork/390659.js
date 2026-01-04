// ==UserScript==
// @name         MangaUpdates chapter links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows to add direct links to chapters in MangaUpdates release lists
// @author       You
// @match        https://www.mangaupdates.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/mithril/2.0.4/mithril.min.js
// @require      https://cdn.jsdelivr.net/npm/coffeescript@2.4.1/lib/coffeescript-browser-compiler-legacy/coffeescript.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/390659/MangaUpdates%20chapter%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/390659/MangaUpdates%20chapter%20links.meta.js
// ==/UserScript==

var inline_src = String.raw`

  GM_addStyle "html {background: black}   body {background: initial}
               .center-side-bar {background: rgba(0, 0, 0, 0.1)}
               button.inbox.-edit {height: 15px;  margin-right: 3px;  cursor: pointer}
               button.inbox[disabled] {opacity: .5;  cursor: not-allowed}
               button.-edit.-none {background: darkgrey}   a.-chapter:not([href]) {color: darkgrey}
               .-overlay {position: fixed;  top: 0;  left: 0;  height: 100%;  width: 100%;  z-index: 10000;  pointer-events: none}
               .-dialog {pointer-events: all;  position: absolute;  top: 50%;  left: 50%;  transform: translate(-50%, -50%);
                         background: rgba(0, 0, 0, .8);  color: white;  padding: 2em}
               .-row {margin: 20px;  display: block}   .-buttons {display: flex;  justify-content: space-between}
               .-dialog input {width: 500px}   .-menu button.inbox {cursor: pointer;  line-height: 1ex}"

  $merge = Object.assign
  merge = (os) -> $merge {}, ...os
  fromPairs = (xs) -> merge xs.map ([k, v]) -> k and [k]: v
  qstr  = (s) -> if not s.includes('?') then "" else s[1 + s.indexOf '?'..]
  query = (s) -> fromPairs (z.split('=').map(decodeURIComponent) for z in qstr(s).split('&') when z.includes '=')
  chunks = (n, l) -> (l[i ... i+n] for i in [0...l.length] by n)
  slug = (s) -> "#{s}".replace(/[^a-zA-Z]+/g, ' ').trim().replace(/ /g, '-')
  select = (o, ks...) -> o and merge ks.map((k) -> o[k] and {[k]: o[k]})
  fmt = (s, o) -> Object.keys(o).reduce ((s, k) -> s.replace '#{'+k+'}', o[k]), s

  $e     = (tag, options...) -> $merge document.createElement(tag), options...
  $get   = (xpath, e=document) -> document.evaluate(xpath, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  $find  = (selector, e=document) -> e.querySelector selector
  $find_ = (selector, e=document) -> Array.from e.querySelectorAll selector
  fullWidth = (e) -> e.classList.contains 'col-12'

  URI   = window.location.pathname
  QUERY = query window.location.search

  releaseTable = switch
    when URI is "/releases.html"                 then $get("div[2]/div", main_content)
    when URI is "/groups.html" and 'id' of QUERY then $get("div/div[3]/div[2]/div/div", main_content)

  if releaseTable
    console.log releaseTable
    releaseTable.style.position = 'relative'
    overlay = $e('div', className: '-overlay')
    document.body.appendChild overlay

    state = editing: null

    startEditing = (name, args...) -> -> $merge(state, editing: name, args...);  m.redraw()
    closeDialog = -> $merge(state, {editing: null})
    editName = -> switch state.editing
      when 'groupUrl' then "Group URL (#{state.groupName})"
      when 'titleUri' then "Title ID (#{state.titleName})"
    saveChanges = ->
      cfg = GM_getValue(state.groupId, {})
      switch state.editing
        when 'groupUrl' then cfg.url = state.value
        when 'titleUri' then cfg.titles = $merge cfg.titles or {}, {[state.titleId]: state.value or undefined}
      GM_setValue state.groupId, cfg
      closeDialog()
      setTimeout recalc

    chapterNumber = (s) -> s.match(/\d+/)?[0]
    $ensureButton = (e) ->
      btn = $find 'button', e
      unless btn
        btn = $e('button', className: "inbox -edit", title: "Edit", innerText: '*')
        e.insertBefore btn, e.firstChild
      btn
    $ensureHref = (e) ->
      href = $find 'a', e
      unless href
        href = $e('a', className: '-chapter', target: '_blank')
        href.appendChild e.firstChild while e.firstChild
        e.appendChild href
      href

    recalc = ->
      _configs = {}
      config = (id) -> _configs[id] or (_configs[id] = GM_getValue(id, {}))
      items = $find_ ":scope > *", releaseTable
      separator = items.findIndex fullWidth
      columns = items[...separator].map (e) -> e.innerText.trim()
      _items = items[separator+1..]
      pager = _items.findIndex fullWidth
      cells = _items[...pager]
      rows = chunks columns.length, cells
      title = columns.indexOf "Title"
      chapter = columns.indexOf "Chp"
      group = columns.indexOf "Groups"
      for row in rows
        [titleName, groupName] = [title, group].map (k) -> row[k].innerText.replace(/^\*/, '')
        [titleId, groupId] = [title, group].map (k) -> query($find('a', row[k])?.href or "").id
        chapterId = chapterNumber row[chapter].innerText.trim()
        cfg = config [groupId]
        titleUri = cfg.titles?[titleId]
        [titleBtn, groupBtn] = [row[title], row[group]].map $ensureButton
        groupBtn.classList[if cfg.url then 'remove' else 'add']('-none')
        groupBtn.onclick = startEditing 'groupUrl', {groupId, groupName}, value: cfg.url or ""
        titleBtn.classList[if titleUri then 'remove' else 'add']('-none')
        titleBtn.onclick = startEditing 'titleUri', {groupId, groupName, titleId, titleName}, value: titleUri or ""
        titleBtn.disabled = not titleId
        chapterLink = $ensureHref row[chapter]
        if cfg.url and titleUri
          chapterLink.href = fmt(cfg.url, chapter: chapterId, title: titleUri)
          chapterLink.classList.add '-none'
        else
          chapterLink.removeAttribute 'href'
          chapterLink.classList.remove '-none'

    recalc()

    load = do (input = $e('input', type: 'file', accept: 'application/json')) -> -> new Promise (resolve) ->
      input.onchange = -> do (file = input.files[0], reader = new FileReader) -> if file
        reader.onload = -> resolve JSON.parse @result
        reader.readAsText file
      input.click()
    save = (name, data) ->
      $e('a', download: name, href: "data:application/json;base64,#{btoa JSON.stringify(data, null, 2)}").click()
    exportData = (type=state.editing) -> switch type
      when 'groupUrl' then save "#{slug state.groupName}.json", [state.groupId]: GM_getValue(state.groupId, {})
      when 'titleUri' then save "#{slug state.groupName}_#{slug state.titleName}.json",
        do (o = GM_getValue(state.groupId, {})) -> [state.groupId]: {o..., titles: select(o.titles, state.titleId)}
      else save "MangaUpdates_#{new Date().toJSON()}.json", merge GM_listValues().map (k) -> {[k]: GM_getValue(k, {})}
    importData = -> load().then (data) ->
      bad = ({groupId, url} for groupId, {url} of data).find ({groupId, url}) -> url isnt GM_getValue(groupId, {url}).url
      if not bad or confirm "Non-matching group URL was found (##{bad.groupId}).\nGroups with a non-matching URL will be replaced."
        for groupId, {url, titles} of data
          oldValue = GM_getValue(groupId, {url})
          GM_setValue groupId, {url, titles: (if url isnt oldValue.url then titles else merge [oldValue.titles, titles])}
        recalc()

    importExport = $e 'div', className: '-menu', style: "position: absolute;  top: 0;  right: 0"
    m.render importExport, [m 'button.inbox', {title: "Export", onclick: -> exportData 'all'}, '↓'
                            m 'button.inbox', {title: "Import", onclick: importData},          '↑']
    releaseTable.appendChild importExport

    m.mount overlay, view: -> state.editing and m '.-dialog', [
      m 'label.-row', editName(state.editing),
        m 'input.inbox.-row', value: state.value, oninput: -> state.value = @value
      m '.-buttons.-row',
        m 'button.inbox', {onclick: closeDialog},     "Cancel"
        m 'button.inbox', {onclick: ->exportData()},  "Export"
        m 'button.inbox', {onclick: saveChanges},     "Ok"
    ]

`;
eval( CoffeeScript.compile(inline_src) );
