// ==UserScript==
// @name         Humble librarian
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Quick management of owned HumbleBundle stuff
// @author       LeXofLeviafan
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/47e474eed38083df699b7dfd8d29d575e3398f1e.ico
// @match        *://www.humblebundle.com/*
// @require      https://unpkg.com/mreframe/dist/mreframe.min.js
// @require      https://cdn.jsdelivr.net/npm/ramda@0.28.0/dist/ramda.min.js
// @require      https://cdn.jsdelivr.net/npm/coffeescript@2.4.1/lib/coffeescript-browser-compiler-legacy/coffeescript.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391671/Humble%20librarian.user.js
// @updateURL https://update.greasyfork.org/scripts/391671/Humble%20librarian.meta.js
// ==/UserScript==

var inline_src = String.raw`

  MSEC   = 1
  SECOND = 1000*MSEC
  MINUTE = 60*SECOND
  DELAY = SECOND//4

  {reagent: r, reFrame: rf, atom: {deref, reset}, util: {keys, entries, dict, getIn, assoc, assocIn, merge, update}} = require 'mreframe'
  compact    = R.filter R.identity
  each       = R.flip R.forEach
  prefixOf   = R.flip R.startsWith
  sort       = R.sortBy R.identity
  descending = R.descend R.identity
  $merge     = Object.assign
  notEquals  = R.compose R.complement, R.equals
  notEmpty   = (x) -> not R.isEmpty (x or [])
  nilEmpty   = (x) -> if notEmpty x then x
  qstr  = (s) -> if not s.includes('?') then "" else s[1 + s.indexOf '?'..]
  query = (s) -> dict compact (l[1..] for l in qstr(s).split('&').map(R.match /([^=]+)=(.*)/) when l[0])

  $e       = (tag, options...) -> $merge document.createElement(tag), options...
  $get     = (xpath, e=document) -> document.evaluate(xpath, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  $find    = (selector, e=document) -> e.querySelector selector
  $find_   = (selector, e=document) -> Array.from e.querySelectorAll selector
  $text    = (e) -> e and (e.innerText or e.data or "").trim() or ""
  $content = (e) -> e and e.innerHTML or ""
  $timer   = (time, action, args...) -> setTimeout (-> action args...), time
  $inst    = -> "#{new Date} #{Math.random()}".replace /0\./, '#'
  $forever = (f) -> f();  setInterval f, SECOND//2
  $watcher = (f) -> new MutationObserver (xs) -> each xs, (x) -> each x.addedNodes, f
  $notNils = R.pickBy R.complement R.isNil
  auxclick = (f) -> {onauxclick: f, oncontextmenu: -> no}

  throttle = (delay, action, args...) -> do (last = 0) -> ->
    now = +new Date
    if now > last+delay
      last = now
      action args...
  debounce = (delay, action) -> do (last = null) -> ->
    clearTimeout last
    last = $timer delay, action
  cache = (expire, f) -> do (value = null) ->
    calc = throttle expire, -> value = f()
    -> calc();  value

  $storageCache = (key, default_) -> cache DELAY, -> GM_getValue key, default_
  $update = (key, data) -> GM_setValue key, merge((GM_getValue key), data)
  $storageUpdater = (key) -> do (changes = {}) ->
    push = debounce DELAY, -> console.warn {changes};  $update(key, changes);  changes = {};  rf.disp ['refresh']
    (k, v) -> changes[k] = $notNils merge(changes[k], v);  push()
  $updateData = (get, $update, key, value) ->
    data = get()[key] or {}
    R.whereEq($notNils(value), data) or $update key, merge(data, value)
  $storage = (key, default_) -> [$storageCache(key, default_), $storageUpdater(key)]
  [$libraryData,   $libraryPush]   = $storage 'library', {}
  [$purchasesData, $purchasesPush] = $storage 'purchases', {}
  $addGroup = (s) -> GM_setValue 'groups', sort R.union GM_getValue('groups', []), [s]
  $delGroup = (s) -> GM_setValue 'groups', R.without [s], GM_getValue('groups', [])
  groupExists = (s) -> s in GM_getValue 'groups', []

  EXECUTABLE = "Android Windows Linux Mac".split ' '
  TYPE       = "game software resource music tabletop puzzlebook fiction nonfiction tutorial other".split ' '
  EXEC_TYPES = ['game', 'software', undefined, null]  # type defaults to 'game'
  MONTH_FILTER = ['unclaimed', 'claimed', 'unseen']
  MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  CHOICE_BUNDLES = Array.from do (now = new Date) -> do (year = now.getFullYear(), month = now.getMonth()+1) ->
    while year > 2019 or month >= 12
      yield "#{year}-#{(""+month).padStart 2, '0'}"
      if month > 1 then month -= 1 else [year, month] = [year-1, 12]

  URL    = location.href
  HOST   = location.host
  PAGE   = location.pathname
  PARAMS = query location.search

  title_ = (x) -> x.title_ or x.title
  steamSearchUrl = (term) -> "https://store.steampowered.com/search/?term=#{encodeURIComponent term}"
  $steamLookup = (e, header) -> e and do (url = steamSearchUrl if R.is String, header then header else header.innerHTML.trim()) ->   # innerText may be capsed
    $merge e, title: "Look up on Steam", style: "cursor: pointer;  pointer-events: all", onclick: (e) -> open url, '_blank';  e.stopPropagation();  no
  groupList = (groups = GM_getValue 'groups', []) -> sort R.uniq [groups..., compact(R.map R.prop('group'), R.values $libraryData())...]
  matcher = (subs) -> do (z = R.toLower "#{subs}") -> (s) -> R.includes z, R.toLower "#{s}"
  parseDate = (s) -> new Date("#{s} UTC").toJSON().replace(/T.*/, '')
  htmlDecode = (s) -> s and new DOMParser().parseFromString(s, "text/html").documentElement.textContent

  if HOST is "www.humblebundle.com"
    purchases = dict ([x.title.replace(/^Humble [^ ]+ Bundle: /, '').replace(/^Humble (.+) Bundle$/, '$1'), x.date] for _, x of $purchasesData())
    GM_addStyle ".hb-lib-owned {color: limegreen !important}"
    $find_("a.bundle").forEach (e) -> do (name = $find(".name", e)) -> if htmlDecode(name?.innerHTML) of purchases
      name.classList.add 'hb-lib-owned'
      e.title = "Owned since #{purchases[name.innerHTML]}"

  if HOST is "www.humblebundle.com" then switch      # checking in case user wants to have overlay on other sites
    when PAGE.match "^/home/(library|purchases|keys|coupons)$"

      _iconUrl         = (s) -> s and s.match(/^url\("(.*)"\)$/)[1]
      _keyExpired      = (e) -> R.includes "expired", $text $find(".keyfield.redeemed .keyfield-value", e)
      _downloadVisible = (e) -> e.parentNode.style.display isnt 'none'
      _download        = (e) ->
        [caption, meta] = e.children
        [title, link] = R.map $text, caption.childNodes
        [info] = meta.childNodes
        {title, link, info: $text(info).replace(/ \|$/, "")}
      _downloads = (platform, downloads, audioDownloads) ->
        disabled = platform?.classList.contains 'disabled'
        category = platform and $text $find(".selected", platform)
        others   = unless platform then [] else $find_(".choice", platform).map $text
        noExec   = R.none ((s) -> s in EXECUTABLE), [category, others...]
        _files   = if category and (disabled or noExec)
                     R.mapObjIndexed R.map(_download), R.groupBy ((e) -> if _downloadVisible(e) then category else others[0]), downloads
        files    = _files and if noExec and others.length is 1 then _files else R.pick [category], _files
        audio    = notEmpty(audioDownloads) and compact audioDownloads.map _download
        (audio or category) and {categories: compact([audio and 'Audio', category, others...]).sort().join(' '), \
                                 files:      merge(audio and {Audio: audio}, files)}
      _keys = (platformSections) -> platformSections.flatMap (section) ->
        type     = R.find(notEquals('platform'), section.classList)
        platform = unless type is 'generic' then $text $find("h3", section)
        $find_(".key-redeemer", section).map (e) -> $notNils
          platform:     platform
          title:        $text $find(".heading-text h4", e)
          instructions: $content( $find(".custom-instruction", e) ) or null
          expiration:   $content( $find(".expiration-messaging", e) ) or null
          status:       switch
            when _keyExpired e                       then 'expired'
            when $find(".keyfield.redeemed",      e) then 'redeemed'
            when $find(".keyfield.redeemed-gift", e) then 'gifted'
            when $find(".keyfield.enabled",       e) then 'unused'
            else "???"			# this will appear if I missed something
      _links = (customLinks) -> customLinks.map (e) -> $text $find(".js-raw-html", e)
      _selector = R.applySpec
        icon:      (e) -> _iconUrl($find(".icon", e).style.backgroundImage) or null
        title:     (e) -> $text $find(".text-holder h2", e)
        publisher: (e) -> $text( $find(".text-holder p", e) ) or null
      _details  = R.applySpec
        title:     (e) -> $text $find(".details-heading .text-holder h2", e)
        url:       (e) -> $find(".details-heading a", e)?.href
        downloads: (e) -> _downloads $find(".select-holder .custom-select", e), ($find_(".#{s}-section .download-button", e) for s in ['download', 'audio'])...
        keys:      (e) -> nilEmpty _keys $find_(".key-redeemers .platform", e)
        links:     (e) -> nilEmpty _links $find_(".custom-html .show-whitebox", e)
      _purchase = R.applySpec
        id:    (e) -> e.getAttribute 'data-hb-gamekey'
        title: (e) -> $text $find(".product-name", e)
        date:  (e) -> parseDate $text $find(".order-placed", e)
        total: (e) -> do (s = $text $find(".total", e)) -> if s isnt "--" then s

      GM_addStyle ".hb-lib-downloads-steamicon {padding-right: 5px}"
      _steamLookups = debounce SECOND//4, ->
        each $find_(".platform.steam .key-redeemer .heading-text h4"), (e) -> do (icon = $e 'i', className: "hb hb-steam hb-lib-downloads-steamicon") ->
          $steamLookup icon, e
          e.prepend icon
      _initLib = R.once -> do (_update = (data) -> $updateData($libraryData, $libraryPush, data.title, data)) ->
        _syncList    = -> each $find_(".subproducts-holder > *"), (e) -> _update _selector e
        _syncDetails = (e) -> _steamLookups _update _details e
        $watcher(debounce 5*SECOND, _syncList).observe $find(".subproducts-holder"), childList: yes
        $watcher(_syncDetails).observe                 $find(".details-holder"),     childList: yes
      _initKeys = R.once -> do (_syncKeys = (e) -> $steamLookup $find(".platform .hb-steam", e), $find(".game-name h4", e)) ->
        R.map _syncKeys, $find_ ".unredeemed-keys-table tr"
        $watcher(_syncKeys).observe $find(".unredeemed-keys-table"), childList: yes, subtree: yes
      _regPurchase = (e) -> e.nodeName is 'DIV' and do (data = _purchase e) -> $updateData($purchasesData, $purchasesPush, data.id, data)
      _initPurchases = R.once ->
        R.map _regPurchase, $find_ ".js-purchase-holder .results .body .row"
        $watcher(_regPurchase).observe $find(".js-purchase-holder .results .body"), childList: yes
      $forever -> location.pathname is "/home/library"   and _initLib()
      $forever -> location.pathname is "/home/keys"      and _initKeys()
      $forever -> location.pathname is "/home/purchases" and _initPurchases()

    when PAGE.match "^/(software|games|books)/"

      GM_addStyle ".hb-lib-owned .item-title {color: limegreen !important}
                   .hb-lib-owned.item-details:hover .img-container:after {box-shadow: inset 0 0 0 2px limegreen}"
      each $find_(".tier-item-details-view"), (e) -> $steamLookup $find(".hb-steam", e), $find(".header-area .heading-medium", e)
      _convert = R.replace /\s+/g, " "
      _keys = new Set R.values( $libraryData() ).flatMap((x) -> (x.aliases or []).concat (x.keys or []).map R.prop 'title').map _convert
      each $find_(".item-details"), (e) -> do (title = $text($find ".item-title", e),  sub = $find(".item-flavor-text", e)) ->
        subtitle = $text((sub?.children.length is 0) and sub)
        if [title, "#{title} (#{subtitle})"].map(_convert).some (s) -> s of $libraryData() or _keys.has s
          e.classList.add 'hb-lib-owned'
          e.title = "Already in collection"

    when PAGE.match "^/membership/"

      each $find_(".content-choice"),    (e) -> $steamLookup $find(".hb-steam", e), $find(".content-choice-title", e)
      each $find_(".js-choice-details"), (e) -> $steamLookup $find(".hb-steam", e), $find(".title span", e)
      _watcher = $watcher (e) -> $steamLookup $find(".hb-steam", e), $find(".title span", e)
      _watcher.observe $find("#site-modal"), childList: yes, subtree: yes

      [_span, _decode] = [document.createElement('span'), ((s) -> _span.innerHTML = s.replace(/<[^>]*>/g, '');  _span.innerText)]
      each $find_(".js-content-choices"), (bundle) ->
        _month = $find(".content-choices-title span", bundle).getAttribute('data-machine-name').match(/([a-z]+)_([0-9]+)_choice/)
        if _month and _month[1] in MONTHS
          month = _month[2] + "-" + "#{MONTHS.indexOf(_month[1]) + 1}".padStart(2, "0")
          games = if $find(".js-initialize-multiselect", bundle)
                    dict $find_(".content-choice:not(.claimed)", bundle).map (e) ->
                      [$find(".choice-image-container", e).getAttribute('data-machine-name'),
                       title: _decode $find(".content-choice-title", e).innerHTML.trim()
                       image: $find("img", e).src or null
                       type: $find_(".delivery-methods i", e).map((it) -> it.getAttribute('aria-label')).join(" ") or null]
          GM_setValue 'choice', assoc(GM_getValue('choice'), month, games or {})

    when PAGE.match "^/store"

      each $find_(".entity"), (e) -> $steamLookup $find(".hb-steam", e), do (x = $find(".entity-title", e)) -> x?.title or x
      _watcher = $watcher (e) -> e.classList and each $find_(".entity, .entity-block-container", e), (x) ->
        $steamLookup $find(".hb-steam", x), $find(".entity-title", x)
      each [$find_('.entity-lists')..., $find('.search-results-holder')], (e) -> e and _watcher.observe e, childList: yes, subtree: yes
      _productWatcher = $watcher (e) -> if e.className is "product-details-page"
        each ($find(".#{s} .hb-steam", e) for s in ['platform-delivery', 'availability-section', 'user-rating-view']), (x) ->
          x and $steamLookup x, $find(".js-human-name .human_name-view")
        _watcher.observe $find(".recommendations-row", e), childList: yes, subtree: yes
      _productWatcher.observe $find(".js-page-content"), childList: yes

    when PAGE is "/downloads"

      GM_addStyle ".hb-lib-downloads-steamicon {padding-right: 5px}"
      [_keys, _downloads, _data] = [{}, {}, -> $purchasesData()[PARAMS.key] or {id: PARAMS.key, title: $find('#hibtext').childNodes[2].data?.trim()}]
      _keysWatcher = $watcher (section) -> do (data = _data(), keys = $find_(".key-redeemer h4", section), title = $text $find('h2', section)) ->
        $merge _keys, dict keys.map (e) -> [$text(e), if title is "Key" then "" else title]
        $updateData $purchasesData, $purchasesPush, data.id, update(data, 'keys', merge, _keys)
        if title is "Steam" then each keys, (e) -> do (icon = $e 'i', className: "hb hb-steam hb-lib-downloads-steamicon") ->
          $steamLookup icon, e;   e.prepend icon
      _downloadsWatcher = $watcher (root) -> each $find_(".whitebox-redux", root), (section) ->
        do (data = _data(), platforms = $find_(".js-platform-button", section).map $text) -> if platforms.length is 1
          $merge _downloads, dict $find_(".download-rows .row .title", section).map (e) -> [$text(e), platforms[0]]
          $updateData $purchasesData, $purchasesPush, data.id, update(data, 'downloads', merge, _downloads)
      _couponsWatcher = $watcher (e) -> do (name = $find(".coupon-name", e)?.innerText, icon = $find(".platforms .hb-steam", e)) ->
        name and icon and $steamLookup icon, name.replace(/^ *[0-9]+% off +/, "")
      _subproductsWatcher = $watcher (e) -> e.tagName and do (data = _data(), key = $text $find("h4", e)) ->
        $updateData $purchasesData, $purchasesPush, data.id, assocIn(data, ['keys', key], "Unique Links")
      do (e = $find ".key-container")                 -> e and _keysWatcher.observe        e, childList: yes
      do (e = $find ".js-all-downloads-holder")       -> e and _downloadsWatcher.observe   e, childList: yes
      do (e = $find ".js-coupon-whitebox-holder")     -> e and _couponsWatcher.observe     e, childList: yes
      do (e = $find ".js-subproduct-whitebox-holder") -> e and _subproductsWatcher.observe e, childList: yes


  GM_addStyle ".hb-lib-overlay {position: fixed;  top: 0;  right: 0;  z-index: 1000;  background: rgba(0, 0, 0, 0.8);  color: grey;
                                font-size: medium;  max-height: 80%;  max-width: 80%;  display: flex;  flex-direction: column;  margin-left: 75px}
               .hb-lib-overlay-toggle {display: inline-block;  padding: 1ex;  font-family: monospace;  cursor: pointer}
               .hb-lib-overlay-header {margin: 0 1ex}   .hb-lib-overlay-body {margin: 1ex;  overflow: hidden;  display: flex;  flex-direction: column}
               .hb-lib-tab {background: darkgrey;  border: none}   .hb-lib-tab:disabled {background: lightgrey}
               .hb-lib-grow {flex-grow: 1}   .hb-lib-overlay-header {display: flex;  font-size: large;  font-weight: bold}
               .hb-lib-scrollbox {overflow: auto;  margin-top: 1ex}   .hb-lib-group li {padding-right: 1em}   .hb-lib-icon {padding-right: 1ex}
               .hb-lib-selectable {cursor: pointer}   .hb-lib-selectable:hover {opacity: .5}   .hb-lib-purchase {padding-left: 1ex}
               .hb-lib-preview {height: 0;  position: relative;  left: -10ex;  top: 1ex}   .hb-lib-overlay .hidden {display: none}
               .hb-lib-custom-title, .hb-lib-custom-group, .hb-lib-row {display: flex}   .hb-lib-publisher {font-size: x-small}
               .hb-lib-select-types, .hb-lib-custom-type select, .hb-lib-custom-type option, .hb-lib-month {text-transform: capitalize}
               .hb-lib-select-types label {padding: 1ex;  cursor: pointer}   .hb-lib-category {padding-top: 1em}   .hb-lib-category ul {margin-top: 0}
               .hb-lib-preview-centered {position: fixed;  bottom: 0;  left: 0;  padding: 2em;  background: rgba(0, 0, 0, 0.8);  pointer-events: none}
               .banner .dismiss-button {top: auto;  bottom: 0}   .hb-lib-links a {color: cadetblue}   .hb-lib-links .unseen a {color: darkmagenta}"
  overlay = $e 'div', className: 'hb-lib-overlay'
  document.body.appendChild overlay
  _all = (ks) -> dict ([k, yes] for k in ks)
  defState = -> open: no, tab: 'lib', view: {}, expand: {}, item: null, filter: "", unused: no, types: _all(TYPE), status: _all(MONTH_FILTER)
  _stored = (o={}, open=o.open) -> merge o, if open
    lib: $libraryData(), purchases: $purchasesData(), groups: groupList(), prefixGroups: GM_getValue('groups', []), unclaimed: GM_getValue('choice', {})
  typeFilter = ({types, unused}) -> (item) -> types[item.type or 'game'] and (not unused or (item.keys or []).some R.propEq 'status', 'unused')
  itemFilter = (predicate) -> (o) -> do (_typeFilter = typeFilter o) -> (item) -> predicate(title_ item) and _typeFilter item
  purchaseFilter = ({keys={}, downloads={}, id}) -> (item) ->
    keys[item.title] in ["", "Unique Links"] or (item.keys or []).some((x) -> x.title of keys) or
      R.unnest(R.values item.downloads?.files or {}).some((x) -> x.title of downloads)
  purchaseUrl = (id) -> "https://www.humblebundle.com/downloads?key=#{id}"
  purchaseTitle = ({title, date}) -> title + (if date then " (#{date})" else "")
  monthId = (iso) -> do ([_, year, month] = iso.match /([0-9]+)-([0-9]+)/) -> "#{MONTHS[Number(month) - 1]}-#{year}"
  choiceBundleUrl = (month) -> "https://www.humblebundle.com/membership/#{monthId month}"
  choiceUrl = ({id, month}) -> "#{choiceBundleUrl month}/#{id}"
  {trust} = require 'mithril/hyperscript'

  rf.regSub 'lib', getIn
  rf.regSub 'purchases', getIn
  rf.regSub 'groups', getIn
  rf.regSub 'prefixGroups', getIn
  rf.regSub 'unclaimed', getIn
  rf.regSub 'open', getIn
  rf.regSub 'tab', getIn
  rf.regSub 'expand', getIn
  rf.regSub 'filter', getIn
  rf.regSub 'unused', getIn
  rf.regSub 'types', getIn
  rf.regSub 'status', getIn
  rf.regSub 'item', getIn
  rf.regSub 'view', getIn
  ['title', 'group', 'publisher', 'purchase'].forEach (k) -> rf.regSub k, '<-', ['view', k], R.identity
  rf.regSub 'sorted', '<-', ['lib'], (o) -> R.sortBy R.compose(R.toLower, title_), R.values o
  rf.regSub 'grouping', '<-', ['prefixGroups'], '<-', ['sorted'], ([groups, items]) ->
    R.groupBy ((x) -> x.group or groups.find(prefixOf title_ x) or ""), items
  rf.regSub 'group-names', '<-', ['grouping'], (o) -> sort compact keys o
  rf.regSub 'group-names*', '<-', ['group-names'], '<-', ['item', 'group'], ([xs, s]) -> xs.filter matcher s
  rf.regSub 'group-items', '<-', ['grouping'], '<-', ['group'], ([groups, k]) -> groups[k] or []
  rf.regSub 'unfiltered', '<-', ['grouping'], (groups, [_, title=""]) -> groups[title] or []
  rf.regSub 'title-filter', '<-', ['filter'], (filter) -> matcher filter or ""
  rf.regSub 'filtering', '<-', ['title-filter'], (p, [_, title]) -> p title
  rf.regSub 'predicate', '<-', ['title-filter'], '<-', ['types'], '<-', ['unused'], ([p, types, unused], [_, title]) ->
    (if p title then typeFilter else itemFilter p)({types, unused})
  rf.regSub 'filtered', (([_, k=""]) -> [['predicate', k], ['unfiltered', k]].map rf.subscribe),
            ([predicate, items]) -> items.filter predicate
  rf.regSub 'purchase-ids', '<-', ['purchases'], (o) -> R.sortBy ((k) -> o[k].date), keys o
  rf.regSub 'item-meta', (-> dict "title icon url publisher keys downloads".split(" ").map (k) -> [k, rf.subscribe ['item', k]]), R.identity
  rf.regSub 'item-categories', '<-', ['item', 'downloads', 'categories'], (s) -> s and s.split " "
  rf.regSub 'category-files', '<-', ['item', 'type'], '<-', ['item', 'downloads', 'files'], '<-', ['item-categories'],
            ([type, files, categories], [_, k]) -> (type not in EXEC_TYPES or k not in EXECUTABLE) and files[k]
  rf.regSub 'item-keys', '<-', ['item', 'keys'], (xs) -> R.groupBy R.propOr("Generic", 'platform'), (xs or [])
  rf.regSub 'item-keys*', '<-', ['item-keys'], (o) -> nilEmpty keys(o).sort().map (k) -> [k, o[k]]
  rf.regSub 'purchases-of-item', '<-', ['purchases'], '<-', ['purchase-ids'], '<-', ['item-meta'],
            ([purchases, ids, item]) -> ids.map((id) -> purchases[id]).filter (x) -> purchaseFilter(x) item
  rf.regSub 'items-in-purchase', (([_, id]) -> [['purchases', id], ['sorted']].map rf.subscribe),
            ([purchase, items]) -> items.filter purchaseFilter purchase
  rf.regSub 'items-by-publisher', '<-', ['sorted'], '<-', ['publisher'], ([xs, k]) -> xs.filter (x) -> x.publisher is k
  rf.regSub 'choice-bundles', '<-', ['unclaimed'], '<-', ['status'], ([o, {unseen, claimed, unclaimed}]) ->
    CHOICE_BUNDLES.filter (k) -> if not o[k] then unseen else if notEmpty o[k] then unclaimed else claimed
  rf.regSub '#unclaimed', '<-', ['unclaimed'], (o) -> R.sum R.values(o).map (x) -> keys(x).length
  rf.regSub 'unseen?', '<-', ['unclaimed'], (o) -> CHOICE_BUNDLES.some (k) -> k not of o
  rf.regSub 'unclaimed-month', '<-', ['unclaimed'], '<-', ['title-filter'], ([o, p], [_, month]) ->
    xs = o[month] and entries(o[month]).map(([id, x]) -> merge x, {id, month})
    [xs?.length, xs?.filter (x) -> p x.title]

  rf.regEventDb 'set', [rf.unwrap], merge
  rf.regEventFx 'open', [rf.unwrap, rf.path 'open'], (_, open) -> db: open, refresh: open
  rf.regEventDb 'set-tab', [rf.unwrap, rf.path 'tab'], (_, tab) -> tab
  rf.regEventFx 'refresh', [], ({db}) -> refresh: db.open and not db.item
  rf.regEventDb 'expand', [rf.trimV, rf.path 'expand'], (expand, [k, v=yes]) -> assoc expand, k, v
  rf.regEventDb 'type-filter', [rf.trimV, rf.path 'types'], (types, [k, v]) -> assoc types, k, v
  rf.regEventDb 'month-filter', [rf.trimV, rf.path 'status'], (status, [k, v]) -> assoc status, k, v
  rf.regEventDb '-lib', [rf.unwrap, rf.path 'lib'], (lib, o) -> merge lib, o
  _edit = (item) -> {db: item, lib: [item]}
  rf.regEventFx 'edit', [rf.unwrap, rf.path 'item'], ({db: item}, changes) -> _edit merge(item, changes)
  _editAlias = (f) -> ({db: item}, [_, args...]) -> _edit update(item, 'aliases', f, args...)
  rf.regEventFx 'add-alias', [rf.path 'item'], _editAlias (aliases) -> [(aliases or [])..., ""]
  rf.regEventFx 'del-alias', [rf.path 'item'], _editAlias (aliases, i) -> nilEmpty R.remove(i, 1, aliases)
  rf.regEventFx 'set-alias', [rf.path 'item'], _editAlias (aliases, i, s) -> R.update(i, s, aliases)
  rf.regEventFx 'toggle', [rf.trimV], (_, [checkbox, changes={}]) ->
   {refocus: checkbox,  dispatch: ['edit', if checkbox.checked then changes else dict(keys(changes).map (k) -> [k])]}
  rf.regEventFx 'set-types', [rf.trimV], (_, [items, type]) -> lib: items.map (x) -> merge x, {type}
  rf.regEventFx 'set-view', [rf.unwrap], ({db}, {title, group, ...view}, old=db.view.title) ->
    group = group or (getIn(db, ['items', title, 'group']) or R.findLast(((s) -> title.startsWith s), db.groups) or "" if title)
    db: merge(db, item: db.lib[title], view: merge(view, {title, group}))
    fx: [old and title isnt old and ['dispatch', ['set', lib: assoc(db.lib, old, db.item)]]]
    refresh: yes
  rf.regEventFx 'view-item', [rf.unwrap], (_, {title}) -> dispatch: ['set-view', {title}]
  rf.regEventFx 'add-prefix-group', [rf.path 'filter'], ({db: filter}) -> {db: "", addGroup: filter, refresh: yes}
  rf.regEventFx 'del-prefix-group', [rf.path 'view'], ({db: {group}}) -> {db: {}, delGroup: group, refresh: yes}
  rf.regEventFx 'rename-group', ({db}, [_, group, items]) -> do () ->
    db: update db, 'view', merge, {group}
    fx: unless db.view.group in db.prefixGroups then [] else [['delGroup', db.view.group], ['addGroup', group]]
    lib: items.map (x) -> x.group and merge(x, {group})

  rf.regFx 'lib', (items) -> do (items = compact items) -> each items, (x) -> $libraryPush x.title, x
  rf.regFx 'refocus', (checkbox, buddy=checkbox.parentNode.nextSibling) -> checkbox.checked and $timer DELAY, -> buddy.focus()
  rf.regFx 'addGroup', $addGroup
  rf.regFx 'delGroup', $delGroup
  rf.regFx 'refresh', (open=rf.dsub ['open']) -> rf.disp ['set', _stored({}, open)]

  ToggleableInput = (_disabled) -> (disabled, name, value, [key, default_], extra={}) ->
    if _disabled isnt disabled then _disabled = disabled;  disabled or setTimeout => @dom.lastChild.focus()
    toggle = [key]: if disabled then default_ else null
    [".hb-lib-custom-#{name}", title: "Custom #{name}"
      ['label', ['input[type=checkbox]', {checked: not disabled, onchange: -> rf.disp ['edit', toggle]}]]
      ['input.hb-lib-grow', {disabled, value, ...extra, oninput: -> rf.dispatchSync ['edit', [key]: @value]}]]

  ViewItem = -> do ([showGroups, hover] = [no, null].map r.atom) ->->
    [{title, url, icon, type, publisher, links, aliases=[]}] = [item, categories, platforms, group, groups] =
      [['item'], ['item-categories'], ['item-keys*'], ['group'], ['group-names*']].map rf.dsub
    ['<>',
      ['.hb-lib-overlay-header'
        icon and ['img.hb-lib-icon', src: icon]
        ['.hb-lib-entry-title.hb-lib-grow'
          ['a[target=_blank]', {href: url}, title]
          ['.hb-lib-publisher.hb-lib-selectable', {onclick: -> rf.disp ['set-view', {title, publisher}]}, publisher]]
        ['.hb-lib-overlay-toggle', {onclick: -> rf.disp ['set-view', {}]}, "⇚"]]
      ['.hb-lib-scrollbox'
        [ToggleableInput, R.isNil(item.title_), 'title', title_(item), ['title_', ""]]
        [ToggleableInput, R.isNil(item.group), 'group', item.group or group, ['group', group],
          {placeholder: "Custom group…", onfocus: (-> reset showGroups, yes), onblur: (-> $timer DELAY, -> reset showGroups, no)}]
        if deref showGroups
          ['<>', ...groups.map (s) -> ['.hb-lib-selectable', {key: s, onclick: -> reset(showGroups, no);  rf.disp ['edit', group: s]}, s]]
        ['.hb-lib-custom-type', title: "Type"
          ['label', "Type: "
            ['select', {onchange: -> rf.disp ['edit', type: @value or null]}
              ...TYPE.map (s) -> ['option', {selected: type is s, value: if s is 'game' then "" else s}, s]]]]
        ['.hb-lib-aliases', title: "Aliases can be used for additional key matching (in case of typos)"
          ['.hb-lib-row', ['.hb-lib-grow', "Aliases"], ['button', {onclick: -> rf.disp ['add-alias']}, "+"]]
          ...aliases.map (s, i) ->
            ['.hb-lib-row',
              ['input.hb-lib-grow', {title: s, value: s, oninput: -> rf.disp ['set-alias', i, @value]}]
              ['button', {onclick: -> rf.disp ['del-alias', i]}, "−"]]]
        ...rf.dsub(['purchases-of-item']).map (x) ->
          ['.hb-lib-row', "Found in:",
            ['.hb-lib-purchase.hb-lib-selectable', {onclick: -> rf.disp ['set-view', {title, purchase: x.id}]}, purchaseTitle x]]
        if categories
          ['.hb-lib-downloads'
            ['.hb-lib-category', "Downloads: ", categories.join ", "]
            ...compact categories.map (k) -> do (files = rf.dsub ['category-files', k]) -> if files
              ['.hb-lib-category', {key: k}, "#{k} downloads:"
                ['ul', ...files.map (x) -> ['li', "#{x.title} (#{x.link})", ['br'], "#{x.info}"]]]]
        if platforms
          ['<>', ...platforms.map ([k, xs]) ->
            ['.hb-lib-category', {key: k}, "#{k} keys:",
              ['ul', ...xs.map (x) ->
                ['li', {onmouseenter: -> reset hover, x.title}, "#{x.title} [#{x.status}]"
                  if deref(hover) is x.title then ['<>', trust(x.instructions), trust(x.expiration)]
                  else (x.instructions or x.expiration) and " (…)"]]]]
        if links
          ['.hb-lib-category', "Additional content:",
            ['ul', ...links.map (s, i) =>
              ['li', {onmouseenter: => reset hover, "link##{i}"}, unless deref(hover) is "link##{i}" then "(…)" else trust s]]]]]

  EditGroup = -> do ([title, items, prefixGroups] = [['group'], ['group-items'], ['prefixGroups']].map rf.dsub) ->
    ['<>'
      ['.hb-lib-overlay-header', title: "Title"
        ['input.hb-lib-grow', {value: title, onchange: -> rf.disp ['rename-group', @value, items]}]
        ['.hb-lib-overlay-toggle', {onclick: -> rf.disp ['set-view', {}]}, "⇚"]]
      title in prefixGroups and ['button', {onclick: -> rf.disp ['del-prefix-group', title]}, "Remove prefix group"]
      ['.hb-lib-custom-type', title: "Type"
        ['label', "Set type for all: "
          ['select', {onchange: -> rf.disp ['set-types', items, @value or null]}
            ['option', {selected: yes, disabled: yes}]
            ...TYPE.map (s) -> ['option', {value: if s is 'game' then "" else s}, s]]]]
      ['ul.hb-lib-scrollbox.hb-lib-group', ...items.map (x) -> ['li', {key: x.title, title: x.title}, title_(x), x.type and " [#{x.type}]"]]]

  ViewGroupItem = (item, preview, setPreview) -> do ({title, type, icon} = item) ->
    ['<>'
      ['li.hb-lib-selectable', {title, onclick: (-> rf.disp ['set-view', {title}]), onmouseenter: (-> setPreview title), onmouseleave: -> setPreview()}
        title_(item), type and " [#{type}]"]
      preview and icon and ['.hb-lib-preview', ['a', ['img', src: icon]]]]

  ViewGroup = -> do (preview = r.atom()) -> do (_setPreview = (s) -> setTimeout -> reset preview, s) -> (title) ->
    [items, filtering, open] = [['filtered', title], ['filtering', title], ['expand', title]].map rf.dsub
    do (_preview = deref preview) -> if notEmpty items
      ['.hb-lib-group'
        ['.hb-lib-overlay-header.hb-lib-selectable', not filtering and {onclick: => rf.disp ['expand', title, not open]},
          ['.hb-lib-grow', title and {title: "Right/middle click to edit", ...auxclick(-> rf.disp ['set-view', group: title])},
            title or "—", " [#{items.length}]"]
          not filtering and ['.hb-lib-overlay-toggle', if open then '−' else '+']]
        (open or filtering) and ['ul', ...items.map (x) -> r.with {key: x.title}, [ViewGroupItem, x, _preview is x.title, _setPreview]]]

  Choice = -> do (preview = r.atom()) ->-> do ([filter, status, bundles] = [['filter'], ['status'], ['choice-bundles']].map rf.dsub) ->
    ['<>',
      ['.hb-lib-row'
        ['input.hb-lib-grow', {title: "Filter", placeholder: "Search…", value: filter, oninput: -> rf.dispatchSync ['set', filter: @value]}]]
      ['.hb-lib-select-types', title: "Status filter"
        ...MONTH_FILTER.map (k) -> ['label', ['input[type=checkbox]', {checked: status[k], onchange: -> rf.disp ['month-filter', k, @checked]}], k]]
      ['.hb-lib-scrollbox.hb-lib-links', style: "padding-bottom: 18ex",
        ...bundles.map (month) -> do (id = monthId(month), [total, games] = rf.dsub ['unclaimed-month', month]) -> r.with {key: month},
          ['.hb-lib-group', class: {unseen: not games, claimed: total is 0, hidden: filter and R.isEmpty(games or [])}
            ['.hb-lib-overlay-header', title: "#{month} (#{if total then 'unclaimed' else if total? then 'claimed' else 'unseen'})"
              ['.hb-lib-grow.hb-lib-month',
                ['a[target=_blank]', {href: choiceBundleUrl month}, id.replace("-", " ")], " [#{if total? then total else '?'}]"]]
            ['ul', ...(games or []).map (x) -> r.with {key: x.id},
              ['<>'
                ['li', {title: x.title, onmouseenter: (-> reset preview, x.id), onmouseleave: -> reset preview},
                  ...(compact (x.type or "").split " ").map (k) -> ['<>', ["i.hb.hb-#{k}"], " "]
                  ['a[target=_blank]', {href: choiceUrl x}, x.title]]
                deref(preview) is x.id and x.image and ['.hb-lib-preview-centered', ['img', src: x.image]]]]]]]

  BrowsePurchase = -> do (preview = r.atom(), id = rf.dsub ['purchase']) ->->
    [purchase, items, title] = [['purchases', id], ['items-in-purchase', id], ['title']].map rf.dsub
    ['<>',
      ['.hb-lib-overlay-header.hb-lib-selectable',
        ['.hb-lib-grow', "Purchase: ", ['a[target=_blank]', {href: purchaseUrl id}, purchaseTitle purchase], " [#{items.length}]"]
        ['.hb-lib-overlay-toggle', {onclick: -> rf.disp ['set-view', {title}]}, "⇚"]]
      ['ul.hb-lib-group.hb-lib-scrollbox', {style: "padding-bottom: 22ex"}, ...items.map (x) -> r.with {key: x.title},
        ['<>',
          ['li.hb-lib-selectable'
            {title: x.title, onmouseenter: (-> reset preview, x.title), onmouseleave: (-> reset preview), onclick: -> rf.disp ['view-item', x]}
            title_(x), x.type and " [#{x.type}]"]
          deref(preview) is x.title and x.icon and ['.hb-lib-preview', ['a', ['img', src: x.icon]]]]]]

  BrowsePublisher = -> do (preview = r.atom()) ->->
    [name, items, title] = [['publisher'], ['items-by-publisher'], ['title']].map rf.dsub
    ['<>',
      ['.hb-lib-overlay-header'
        ['.hb-lib-grow', "Publisher: #{name} [#{items.length}]"]
        ['.hb-lib-overlay-toggle', {onclick: -> rf.disp ['set-view', {title}]}, "⇚"]]
      ['ul.hb-lib-group.hb-lib-scrollbox', {style: "padding-bottom: 22ex"}, ...items.map (x) => r.with {key: x.title},
        ['<>'
          ['li.hb-lib-selectable'
            {title: x.title, onmouseenter: (-> reset preview, x.title), onmouseleave: (-> reset preview), onclick: => rf.disp ['view-item', x]}
            title_(x), x.type and " [#{x.type}]"]
          deref(preview) is x.title and x.icon and ['.hb-lib-preview', ['a', ['img', src: x.icon]]]]]]

  Browse = -> do ([filter, unused, types, groups] = [['filter'], ['unused'], ['types'], ['group-names']].map rf.dsub) ->
    ['<>',
      ['.hb-lib-row'
        ['input.hb-lib-grow', {title: "Filter", placeholder: "Search…", value: filter, oninput: -> rf.dispatchSync ['set', filter: @value]}]
        ['button', {disabled: not filter, onclick: -> rf.disp ['add-prefix-group']}, "Add prefix group"]]
      ['.hb-lib-select-types', title: "Types",
        ...TYPE.map (k) -> ['label', ['input[type=checkbox]', {checked: types[k], onchange: -> rf.disp ['type-filter', k, @checked]}], k]
        ['button', {title: "Show unused keys", onclick: -> rf.disp ['set', unused: not unused]}, "#{if unused then '☑' else '☐'} Unused"]]
      ['.hb-lib-scrollbox', style: "padding-bottom: 18ex",
        ...groups.map (title) -> r.with {key: title}, [ViewGroup, title]
        r.with {key: ""}, [ViewGroup, ""]]]

  Header = -> do ([tab, unclaimed, unseen] = [['tab'], ['#unclaimed'], ['unseen?']].map rf.dsub) ->
    ['span.hb-lib-grow',
      ...entries(lib: "Humble library", choice: "Humble Choice (#{unclaimed}#{if unseen then '+?' else ''})").map ([k, s]) ->
        ['button.hb-lib-tab', {disabled: tab is k, onclick: -> rf.disp ['set-tab', k]}, s]]

  Overlay = -> do ([open, lib, tab] = [['open'], ['lib'], ['tab']].map rf.dsub) -> if notEmpty lib
    ['<>',
      ['h4.hb-lib-overlay-header'
        open and [Header]
        ['span.hb-lib-overlay-toggle', {onclick: -> rf.disp ['open', not open]}, if open then '×' else '+']]
      open and
        ['.hb-lib-overlay-body', switch
          when tab is 'choice'       then [Choice]
          when rf.dsub ['purchase']  then [BrowsePurchase]
          when rf.dsub ['publisher'] then [BrowsePublisher]
          when rf.dsub ['item']      then [ViewItem]
          when rf.dsub ['group']     then [EditGroup]
          else [Browse]]]

  rf.dispatchSync ['set', _stored(defState(), yes)]
  setInterval (-> rf.disp ['refresh']), MINUTE//4
  r.render [Overlay], overlay
  document.addEventListener 'keydown', (e) -> if e.key is 'Escape' then rf.disp ['set', _stored( defState() )]
`;
eval( CoffeeScript.compile(inline_src, {inlineMap: true}) );
