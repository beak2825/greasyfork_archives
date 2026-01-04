// ==UserScript==
// @name         WME PlaceNames PLUS
// @version      2025.05.02.001
// @description  Show area and point place names in WME, color and highlight places by type and properties (waze-ua fork)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @copyright    Vinkoy, ragacs, waze-ua
// @namespace    https://greasyfork.org/uk/users/160654-waze-ukraine
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457557/WME%20PlaceNames%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/457557/WME%20PlaceNames%20PLUS.meta.js
// ==/UserScript==

/* jshint -W033 */
/* jshint esversion: 11 */

/* global W */
/* global $ */
/* global OpenLayers */
/* global require */
/* global I18n */

// global variables
var wmepn_NameLayer
var wmepn_uniqueLayerName = '__PlaceNamesPlusLayer'
var wmepn_scriptName = 'Place Names +'

var wmepn_translations = {
  'en':
    {
      enable_script: 'Enable script',
      enable_script_tooltip: 'Toggle highlighting and place names layer\nUse the Layer selector or Shift+N hot key to toggle names only',
      color_places: 'Color places',
      color_places_tooltip: 'Color the places like WMECH does',
      highlight_places: 'Highlight places without name/HN',
      highlight_places_tooltip: 'Highlight public places without name and private places without house number (yellow)',
      highlight_address: 'Places without address',
      highlight_address_tooltip: 'Highlight places without street or house number (dashed green)',
      highlight_dif_address: 'The name doesn\'t match the house number',
      highlight_dif_address_tooltip: 'Check if the name matches the house number. Highlights (Other and Public places), where the name doesn\'t match the house number (dashed red)',
      highlight_small: 'Place area less than',
      highlight_small_tooltip: 'Highlight places area less than specified (red). Small places may not be visible in app',
      highlight_linked: 'Linked places',
      highlight_linked_tooltip: 'Highlight places linked to Google (cyan)',
      highlight_not_linked: 'Not linked places',
      highlight_not_linked_tooltip: 'Highlight places NOT linked to Google (cyan)',
      show_address: 'Show address',
      show_address_tooltip: 'Show address under the name',
      show: 'Show',
      show_tooltip: 'Select desired names to show',
      option_area: 'Area',
      option_point: 'POI',
      option_residential: 'Residential',
      option_comments: 'Comments',
      filter: 'Filter',
      filter_tooltip: 'Filter only the names containing this string (you could use regex e.g. /school/i)',
      show_locklevel: 'Show lock level',
      show_locklevel_tooltip: 'Display lock level after the name, like [L3] or [L4]',
      stop_over: 'Stop over',
      stop_over_tooltip: 'Limit displayed place names to the specified value',
      option_unlimited: 'Unlimited',
      show_zoom: 'Zoom',
      show_zoom_tooltip: 'Minimum zoom to display the names',
      showing: 'Showing',
      place_names_and: {
        one: 'place name and',
        other: 'place names and'
      },
      house_numbers: {
        one: 'house number',
        other: 'house numbers'
      },
      enable_disable_script: 'Enable/Disable script',
      increase_square_to: 'Increase POI square up to',
      increase_square_to_2: 'm² (minimal square to display in app)',
      square: 'Square',
      square_m_2: 'm&#178;',
      hotkey: 'Hotkey',
      make: 'Make',
      translator: 'translated by [Your Waze Nickname]'
    },
  'hu':
    {
      enable_script: 'Szkript engedélyezése',
      enable_script_tooltip: 'A színezés, kiemelés és a Helynevek réteg bekapcsolása\nHasználd a rétegválasztót vagy a Shift+N forróbillentyűt, ha csak a neveket akarod kapcsolgatni',
      color_places: 'Helyek színezése',
      color_places_tooltip: 'Helyek színezése, ahogyan a WMECH teszi',
      highlight_places: 'Név/hsz nélküli helyek kiemelése',
      highlight_places_tooltip: 'Kiemeli (sárgával) a névtelen nyilvános helyeket és a házszám nélküli magánházakat',
      show: 'Mutasd',
      show_tooltip: 'Válaszd ki a megmutatni kívánt neveket',
      option_area: 'Csak terület',
      option_point: 'Terület és pont',
      option_residential: 'Csak pont',
      filter: 'Szűrő',
      filter_tooltip: 'Csak azokat a neveket mutassa, amik ezt a szöveget tartalmazzák (reguláris kifejezések használhatók, pl. /iskola/i)',
      show_locklevel: 'Védelem mutatása',
      show_locklevel_tooltip: 'Mutassa a védelmi szintet is a név után, pl. [L3] vagy [L4]',
      stop_over: 'Maximum',
      stop_over_tooltip: 'A képernyőn egyszerre látható név-feliratok számát korlátozza',
      option_unlimited: 'Korlátlan',
      showing: 'Látható',
      place_names_and: 'helynév és',
      house_numbers: 'házszám',
      enable_disable_script: '[translate_me]',
      increase_square_to: '[translate_me]',
      increase_square_to_2: 'm² ([translate_me])',
      square: '[translate_me]',
      square_m_2: 'm&#178;',
      hotkey: '[translate_me]',
      make: '[translate_me]',
      translator: 'fordította ragacs'
    },
  'cs':
    {
      enable_script: 'Povolit skript',
      enable_script_tooltip: 'Přepínač zvýraznění a jmen míst\nPoužijte menu Vrstvy nebo klávesovou zkratku Shift+N, aby se zobrazila jen jména míst',
      color_places: 'Barevné odlišení',
      color_places_tooltip: 'Barevné odlišení jako WMECH',
      highlight_places: 'Odlišit nepojmenovaná místa',
      highlight_places_tooltip: 'Odlišit nepojmenovaná veřejná místa a soukromá místa bez čísla domu (žlutě)',
      show: 'Zobrazit',
      show_tooltip: 'Zobrazit požadovaná jména',
      option_area: 'Jen plochy',
      option_point: 'Plochy a body',
      option_residential: 'Jen body',
      filter: 'Filtr',
      filter_tooltip: 'Filtrovat jen jména obsahující tento řetězec (lze použít regex např. /škola/i)',
      show_locklevel: 'Ukázat zámek',
      show_locklevel_tooltip: 'Zobrazit zámek za jménem místa (např. [L3] nebo [L4])',
      stop_over: 'Omezení',
      stop_over_tooltip: 'Omezit zobrazená místa na zadanou hodnotu',
      option_unlimited: 'Bez omezení',
      showing: 'Zobrazení',
      place_names_and: 'jména míst a',
      house_numbers: 'čísla domů',
      enable_disable_script: '[translate_me]',
      increase_square_to: '[translate_me]',
      increase_square_to_2: 'm² ([translate_me])',
      square: '[translate_me]',
      square_m_2: 'm&#178;',
      hotkey: '[translate_me]',
      make: '[translate_me]',
      translator: 'překládal bures'
    },
  'nl':
    {
      enable_script: 'Script inschakelen',
      enable_script_tooltip: 'De laag voor het weergeven en markeren van plaatsnamen beheren\nGebruik de laagselector of Shift+N om enkel de namen te beheren',
      color_places: 'Voeg kleur toe aan plaatsen',
      color_places_tooltip: 'Kleur de plaatsen in zoals het WMECH-script dit doet',
      highlight_places: 'Markeer plaatsen zonder naam of huisnummer',
      highlight_places_tooltip: 'Markeer publieke plaatsen zonder naam en private plaatsen zonder huisnummer (geel)',
      show: 'Weergave',
      show_tooltip: 'Selecteer welke namen er moeten weergegeven worden',
      option_area: 'Enkel gebieden',
      option_point: 'Gebieden en punten',
      option_residential: 'Enkel punten',
      filter: 'Filter',
      filter_tooltip: 'Toon enkel de plaatsen met de volgende naam (je kan ook een regex gebruiken zoals /school/i)',
      show_locklevel: 'Lock-level weergeven',
      show_locklevel_tooltip: 'Geef het lock-level weer achter de naam als [L3] of [L4]',
      stop_over: 'Beperk aantal plaatsnamen',
      stop_over_tooltip: 'Beperk het aantal weergegeven plaatsnamen tot dit aantal',
      option_unlimited: 'Onbeperkt',
      showing: 'Huidige weergave: ',
      place_names_and: {
        one: 'plaatsnaam en',
        other: 'plaatsnamen en'
      },
      house_numbers: {
        one: 'huisnummer',
        other: 'huisnummers'
      },
      enable_disable_script: '[translate_me]',
      increase_square_to: '[translate_me]',
      increase_square_to_2: 'm² ([translate_me])',
      square: '[translate_me]',
      square_m_2: 'm&#178;',
      hotkey: '[translate_me]',
      make: '[translate_me]',
      translator: 'vertaald door Glodenox'
    },
  'uk':
    {
      enable_script: 'Увімкнути скрипт',
      enable_script_tooltip: 'Увімкнути підсвічування та відображення імен POI',
      color_places: 'Кольорові POI',
      color_places_tooltip: 'Відображати кольорові POI в залежності від їх типу',
      highlight_places: 'POI без імені',
      highlight_places_tooltip: 'Підсвічувати POI без імені (жовтий)',
      highlight_address: 'POI без адреси',
      highlight_address_tooltip: 'Підсвічувати POI, у яких не заповнені поля адреси: вулиця і номер будинку (зелений пунктир)',
      highlight_dif_address: 'Ім\'я не збігається з номером будинку',
      highlight_dif_address_tooltip: 'Перевірка відповідності імені контура з номером будинку в адресі. Підсвічує POI (Інше / контур будівлі та Громадське місце), у яких ім\'я не збігається з номером будинку в адресі (червоний пунктир)',
      highlight_small: 'POI з площею менше ',
      highlight_small_tooltip: 'Підсвічування POI з площею менше зазначеної (червоний). Маленькі POI можуть не відображатися в застосунку',
      highlight_linked: 'Лінковані POI',
      highlight_linked_tooltip: 'Підсвічувати POI, що мають прив\'язку до адреси Google (блакитний)',
      highlight_not_linked: 'Нелінковані POI',
      highlight_not_linked_tooltip: 'Підсвічувати POI, без прив\'язки до адреси Google (блакитний)',
      show_address: 'Відображати адресу POI',
      show_address_tooltip: 'Відображати адресу POI під ім\'ям',
      show: 'Відображати ім\'я (адресу)',
      show_tooltip: 'Вибрати для відображення імені',
      option_area: 'Області',
      option_point: 'Точкові POI',
      option_residential: 'АТ',
      option_comments: 'Коментарі',
      filter: 'Фільтр',
      filter_tooltip: 'Фільтр відображення в назві (можна використовувати regex, наприклад / школа/i)',
      show_locklevel: 'Відображати рівень блокування',
      show_locklevel_tooltip: 'Відображати рівень блокування після імені, наприклад, [L3] або [L4]',
      stop_over: 'Кількість відображуваних імен',
      stop_over_tooltip: 'Обмеження кількості відображуваних імен на карті',
      option_unlimited: 'Без обмеження',
      show_zoom: 'Масштаб ',
      show_zoom_tooltip: 'Мінімальний масштаб для відображення імен',
      showing: 'Відображається',
      place_names_and: 'імен POI та',
      house_numbers: 'АТ',
      enable_disable_script: 'Увімкнути/Вимкнути скрипт',
      increase_square_to: 'Збільшити площу POI до',
      increase_square_to_2: 'м² (мінімальна площа для відображення у застосунку)',
      square: 'Площа',
      square_m_2: 'м&#178;',
      hotkey: 'Горяча клавіша',
      make: 'Зробити',
      translator: 'перекладено Vinkoy та waze-ua'
    },
  'ru':
    {
      enable_script: 'Включить скрипт',
      enable_script_tooltip: 'Включить подсветку и отображение имен POI',
      color_places: 'Цветные POI',
      color_places_tooltip: 'Отображать цветные POI в зависимости от их типа',
      highlight_places: 'POI без имени',
      highlight_places_tooltip: 'Подсвечивать POI без имени (желтый)',
      highlight_address: 'POI без адреса',
      highlight_address_tooltip: 'Подсвечивать POI, у которых не заполнены поля адреса: улица и номер дома (зеленый пунктир)',
      highlight_dif_address: 'Имя не совпадает с номером дома',
      highlight_dif_address_tooltip: 'Проверка соответствия имени контура с номером дома в адресе. Подсвечивает POI (Другое/контур здания и Общественное место), у которых имя не совпадает с номером дома в адресе (красный пунктир)',
      highlight_small: 'POI с площадью менее',
      highlight_small_tooltip: 'Подсветка POI с площадью меньше указанной (красный). Маленькие POI могут не отображаться в приложении',
      highlight_linked: 'Линкованные POI',
      highlight_linked_tooltip: 'Подсвечивать POI, имеющие привязку к адресу Google (голубой)',
      highlight_not_linked: 'Нелинкованные POI',
      highlight_not_linked_tooltip: 'Подсвечивать POI, без привязки к адресу Google (голубой)',
      show_address: 'Отображать адрес POI',
      show_address_tooltip: 'Отображать адрес POI под именем',
      show: 'Отображать имя (адрес)',
      show_tooltip: 'Выбрать для отображения имени',
      option_area: 'Области',
      option_point: 'POI-точки',
      option_residential: 'ПТ',
      option_comments: 'Комментарии',
      filter: 'Фильтр',
      filter_tooltip: 'Фильтр отображения по имени (можно использовать regex, например /школа/i)',
      show_locklevel: 'Отображать уровень блокировки',
      show_locklevel_tooltip: 'Отображать уровень блокировки после имени, например, [L3] или [L4]',
      stop_over: 'Количество отображаемых имен',
      stop_over_tooltip: 'Ограничение количества отображаемых имен на карте',
      option_unlimited: 'Без ограничения',
      show_zoom: 'Масштаб',
      show_zoom_tooltip: 'Минимальный масштаб для отображения имен',
      showing: 'Отображается',
      place_names_and: 'имен POI и',
      house_numbers: 'ПТ',
      enable_disable_script: 'Включить/выключить скрипт',
      increase_square_to: 'Увеличить площадь POI до',
      increase_square_to_2: 'м² (минимальная площадь для отображения в приложении)',
      square: 'Площадь',
      square_m_2: 'м&#178;',
      hotkey: 'Горячая клавиша',
      make: 'Сделать',
      translator: 'translated and modified by Vinkoy'
    }
}

// Using parts from highlight and route speed scripts by various authors

/* bootstrap, will call initialiseLandmarkNames() */
function bootstrapLandmarkNames() {
    /* begin running the code! */
    if (W?.userscripts?.state.isReady) {
        initialiseLandmarkNames();
    } else {
        document.addEventListener("wme-ready", initialiseLandmarkNames, {
            once: true
        });
    }
}

function wmepn_wordWrap(str, maxWidth) {
  function testWhite(x) {
    var white = new RegExp(/^[ \t\r\n\f]$/) // We are not using \s because it matches non-breaking space too
    return white.test(x.charAt(0))
  }

  var newLineStr = '\n'
  var done = false
  var res = ''
  do {
    var found = false
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('')
        str = str.slice(i + 1)
        found = true
        break
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found && str.length > maxWidth) {
      res += [str.slice(0, maxWidth), newLineStr].join('')
      str = str.slice(maxWidth)
    }

    if (str.length <= maxWidth) {
      res = res + str
      done = true
    }
  } while (!done)

  return res
}

function wmepn_addTextFeature(pt, wrappedText, showAddresses, yOffset, style, addressText, addrOffset) {
  var labelFeatures = []
  var attrs = {
    labelText: wrappedText,
    fontColor: '#F0F0F0',
    pointRadius: 0
  }
  if (yOffset) {
    attrs.yOffset = yOffset
  }
  if (style) {
    attrs.style = style
  }
  var textFeature = new OpenLayers.Feature.Vector(pt, attrs)
  labelFeatures.push(textFeature)

  if (showAddresses) {
    var addrAttrs = {
      labelText: addressText,
      style: 'italic',
      pointRadius: 0
    }
    if (addrOffset) {
      addrAttrs.yOffset = addrOffset
    }
    var addrFeature = new OpenLayers.Feature.Vector(pt, addrAttrs)
    labelFeatures.push(addrFeature)
  }
  wmepn_NameLayer.addFeatures(labelFeatures)
}

function wmepn_setDefaultVenuesAttributes(fill, stroke, fillOpacity, strokeOpacity, strokeDasharray) {
  let venues = W.model.venues
  for (let mark in venues.objects) {
    let poly = null
    if (W.map.venueLayer.featureMap.has(mark)) {
        let domID = W.map.venueLayer.featureMap.get(mark).geometry.id
        poly = wmepn_getId(domID)
    } else {
        let venue = venues.getObjectById(mark)
        poly = wmepn_getId(venue.getOLGeometry().id)
    }
    if (poly !== null) {
      if (poly.getAttribute('stroke-opacity') != 1) {
        poly.setAttribute('fill', fill)
        poly.setAttribute('stroke', stroke)
        poly.setAttribute('fill-opacity', fillOpacity)
        poly.setAttribute('stroke-opacity', strokeOpacity)
        poly.setAttribute('stroke-dasharray', strokeDasharray)
      }
    }
  }
}

function wmepn_resetLandmarks() {
  wmepn_setDefaultVenuesAttributes('#d191d6', '#d191d6', 0.3, 1, 'none')
  wmepn_showLandmarkNames()
}

function wmepn_showLandmarkNames() {
  wmepn_NameLayer.removeAllFeatures()
  if (typeof W.model.venues == 'undefined' || !wmepn_getId('_cbLandmarkNamesEnable') || wmepn_getId('_cbLandmarkNamesEnable').checked === false) {
    if (wmepn_getId('_stLandmarkNumber')) wmepn_getId('_stLandmarkNumber').innerHTML = 0
    if (wmepn_getId('_stLandmarkHNNumber')) wmepn_getId('_stLandmarkHNNumber').innerHTML = 0
    return
  }
  var venues = W.model.venues
  var streets = W.model.streets
  var showNames = wmepn_NameLayer.getVisibility() && W.map.getLayerByUniqueName('venues').getVisibility()

  // if checkbox unticked, reset places to original style
  if (!showNames &&
    !wmepn_getId('_cbLandmarkColors').checked &&
    !wmepn_getId('_cbLandmarkhighlightNoName').checked &&
    !wmepn_getId('_cbLandmarkhighlightNoAddress').checked &&
    !wmepn_getId('_cbLandmarkhighlightDifHN').checked &&
    !wmepn_getId('_cbLandmarkhighlightSmall').checked) {

    wmepn_setDefaultVenuesAttributes('#d191d6', '#d191d6', 0.3, 1, 'none')

    wmepn_getId('_stLandmarkNumber').innerHTML = 0
    wmepn_getId('_stLandmarkHNNumber').innerHTML = 0
    return
  }

  var highlightNoName = wmepn_getId('_cbLandmarkhighlightNoName').checked
  var colorLandmarks = wmepn_getId('_cbLandmarkColors').checked
  var highlightNoAddress = wmepn_getId('_cbLandmarkhighlightNoAddress').checked
  var highlightDifHN = wmepn_getId('_cbLandmarkhighlightDifHN').checked
  var highlightSmall = wmepn_getId('_cbLandmarkhighlightSmall').checked
  var highlightLinked = wmepn_getId('_cbShowLinked').checked
  var highlightNotLinked = wmepn_getId('_cbShowNotLinked').checked
  var showAddresses = wmepn_getId('_cbLandmarkShowAddresses').checked
  var minArea = wmepn_getId('_minArea').value
  var showPoints = wmepn_getId('_cbShowPoi').checked
  var showAreas = wmepn_getId('_cbShowArea').checked
  var showResidentials = wmepn_getId('_cbShowRH').checked
  var showComments = wmepn_getId('_cbShowComment').checked
  var showLockLevel = wmepn_getId('_cbLandmarkLockLevel').checked
  var limitNames = wmepn_getId('_seLandmarkLimit').value
  var nameFilterArray = wmepn_getId('_inLandmarkNameFilter').value.split('/')
  var nameFilter = (nameFilterArray.length > 1 ? nameFilterArray[1] : nameFilterArray[0])
  var nameFilterOptions = nameFilterArray[2]
  var nameFilterRegEx = (nameFilterArray.length > 1 ? new RegExp(nameFilter, nameFilterOptions) : null)
  var doFilter = function (name) {
    if (nameFilter.length === 0) {
      return true // show all when no filter entered
    }
    if (nameFilterRegEx === null) {
      return (name.indexOf(nameFilter) >= 0)
    } else {
      return nameFilterRegEx.test(name)
    }
  }

  var drawnNames = 0
  var drawnHNs = 0

  for (let mark in venues.objects) {
    let venue = venues.getObjectById(mark)
    let olGeom = venue.getOLGeometry()
    let isPoint = (olGeom.toString().match(/^POINT/) != null)
    let isArea = (olGeom.toString().match(/^POLYGON/) != null)
    let isRH = venue.attributes.residential
    let houseNumber = venue.attributes.houseNumber ? venue.attributes.houseNumber : ''
    let trimmedName = isRH ? houseNumber : venue.attributes.name.trim()
    let noTrName = (trimmedName.length === 0)
    if (showLockLevel) trimmedName += (noTrName ? '' : '\n') + '[L' + (venue.attributes.lockRank + 1) + ']'

    let poly = null
    if (W.map.venueLayer.featureMap.has(mark)) {
        let domID = W.map.venueLayer.featureMap.get(mark).geometry.id
        poly = wmepn_getId(domID)
    } else {
        poly = wmepn_getId(olGeom.id)
    }
    if (poly !== null) {
      let venueStreet = streets.getObjectById(venue.attributes.streetID)
      let haveNoName = (isRH ? (houseNumber.length === 0) : noTrName)
      let hasHN = houseNumber !== '' && houseNumber != null
      let hasStreet = venueStreet != null && venueStreet.attributes.name != null && venueStreet.attributes.name !== ''
      let haveNoAddress = !hasHN || !hasStreet

      if (showNames && (showAreas || showPoints || showResidentials) && (limitNames == 0 || drawnNames < limitNames) &&
        (W.map.zoom >= wmepn_getId('_zoomLevel').value)) {

        let wrappedText = wmepn_wordWrap(trimmedName, 30)
        let addressText = ''
        let words = 1

        if (showAddresses && (showAreas && isArea || showPoints && isPoint || showResidentials && isRH)) {
          // how many words in POI name (needed to determine offsetY below)
          words = wrappedText.replace(/\n/g, ' ') + ' '
          words = words.split(/\s* \s*/).length - 1
          addressText = hasStreet ? venueStreet.attributes.name.trim() : addressText
          addressText = hasHN ? (hasStreet ? (addressText + ', ' + houseNumber) : houseNumber) : addressText
          addressText = (addressText.length > 0) ? ('(' + addressText + ')') : addressText
        }
        let filterMatched = (!noTrName && doFilter(trimmedName)) || (hasHN && isRH && doFilter(houseNumber)) || (showAddresses && doFilter(addressText))
        let pt
        let addrOffset
        if (showAreas && isArea && filterMatched) {
          // Add label texts
          //var bounds = olGeom.bounds;
          //if(bounds.getWidth() * bounds.getHeight() * .3 > olGeom.getArea() && venue.attributes.entryExitPoints.length > 0)
          //    pt = venue.attributes.entryExitPoints[0].point;
          //else
          pt = olGeom.getCentroid()

          addrOffset = wmepn_getYoffset(words, wrappedText.length)
          wmepn_addTextFeature(pt, wrappedText, showAddresses, null, null, addressText, addrOffset)

          drawnNames++
        }

        pt = new OpenLayers.Geometry.Point(olGeom.x, olGeom.y)
        if (showPoints && isPoint && !isRH && filterMatched) {
          // Add label texts
          addrOffset = wmepn_getYoffset(words, wrappedText.length)
          wmepn_addTextFeature(pt, wrappedText, showAddresses, 15, null, addressText, addrOffset)

          drawnNames++
        }
        if (showResidentials && isPoint && isRH && filterMatched) {
          // Add label texts
          wmepn_addTextFeature(pt, wrappedText, showAddresses, 15, 'italic', addressText, -15)

          drawnHNs++
        }
      }

      wmepn_getId('_stLandmarkNumber').innerHTML = drawnNames
      wmepn_getId('_stLandmarkHNNumber').innerHTML = drawnHNs

      if (W.selectionManager.hasSelectedFeatures() && W.selectionManager.getSelectedFeatures()[0].featureType === 'venue') {
        let area_poi = wmepn_getId('WME.PlaceNames-Square')
        if (!area_poi) {
          let wcp = document.getElementsByClassName('additional-attributes list-unstyled')
          if (wcp && wcp.length > 0) {
            let li = document.createElement('LI')
            li.setAttribute('id', 'WME.PlaceNames-Square')
            wcp[0].appendChild(li)
            area_poi = wmepn_getId('WME.PlaceNames-Square')
          }
        }

        if (area_poi) {
          let v_id = W.selectionManager.getSelectedDataModelObjects()[0].attributes.id
          let getv = W.model.venues.getObjectById(v_id)
          if (typeof getv === 'undefined' || typeof getv.getOLGeometry().getGeodesicArea === 'undefined') {
            area_poi.innerHTML = ''
          } else {
            let square = getv.getOLGeometry().getGeodesicArea(W.map.getProjectionObject())
            area_poi.style = (square < minArea) ? 'color: red;' : 'color: black;'
            area_poi.innerHTML = I18n.t('wmepn.square') + ': ' + square.toFixed(2) + ' ' +
              I18n.t('wmepn.square_m_2') + ' (<a href=\'#\' id=\'_modifyArea\' title=\'' +
              I18n.t('wmepn.hotkey') + ' "Y"\'>' + I18n.t('wmepn.make') + ' ~' + minArea + I18n.t('wmepn.square_m_2') + '</a>)'
            $('#_modifyArea').click(modifyArea)
          }
        }
      }

      // Production polygons: #d191d6, Beta editor polygons: #c290c6
      if ((poly.getAttribute('fill') == '#d191d6' || poly.getAttribute('fill') == '#c290c6') && poly.getAttribute('stroke-opacity') == 1) {
        var categories = venue.attributes.categories
        var colored = false

        if (colorLandmarks) {
          // gas station = orange
          if (categories.indexOf('GAS_STATION') > -1) {
            poly.setAttribute('fill', '#f90')
            poly.setAttribute('stroke', '#f90')
            colored = true
          }
          // parking lot = cyan
          else if (categories.indexOf('PARKING_LOT') > -1) {
            poly.setAttribute('fill', '#099')
            poly.setAttribute('stroke', '#0cc')
            colored = true
          }
          // water = blue
          else if (categories.indexOf('RIVER_STREAM') > -1 ||
            categories.indexOf('SEA_LAKE_POOL') > -1) {
            poly.setAttribute('fill', '#09f')
            poly.setAttribute('stroke', '#06c')
            colored = true
          }
          // park/grass/trees = green
          else if (categories.indexOf('PARK') > -1 ||
            categories.indexOf('FARM') > -1 ||
            categories.indexOf('FOREST_GROVE') > -1 ||
            categories.indexOf('GOLF_COURSE') > -1) {
            poly.setAttribute('fill', '#4f4')
            poly.setAttribute('stroke', '#6a6')
            colored = true
          }
        }

        poly.setAttribute('stroke-opacity', 0.97)
        poly.setAttribute('stroke-dasharray', 'none')

        var isNature = 0
        isNature = (
          (venue.attributes.categories[0] === 'PARKING_LOT') ||
          (venue.attributes.categories[0] === 'RIVER_STREAM') ||
          (venue.attributes.categories[0] === 'SEA_LAKE_POOL') ||
          (venue.attributes.categories[0] === 'PARK') ||
          (venue.attributes.categories[0] === 'FARM') ||
          (venue.attributes.categories[0] === 'FOREST_GROVE') ||
          (venue.attributes.categories[0] === 'GOLF_COURSE')
        )

        // highlight places with place surface area less than _minArea
        if (highlightSmall && isArea && (W.map.zoom >= 3) &&
          (olGeom.getGeodesicArea(W.map.getProjectionObject()) < minArea)) {
          poly.setAttribute('fill', '#f00')
          poly.setAttribute('stroke', '#f00')
        }
        // then highlight places which have no name and not colored
        else if (highlightNoName && haveNoName && (colored === false)) {
          poly.setAttribute('fill', '#ff8')
          poly.setAttribute('stroke', '#cc0')
        }
        // if was yellow and now not yellow, reset
        else if (poly.getAttribute('fill') == '#ff8' && (!highlightNoName || !haveNoName)) {
          poly.setAttribute('fill', '#d191d6')
          poly.setAttribute('stroke', '#d191d6')
          poly.setAttribute('stroke-opacity', 1)
        }

        // highlight places with linked Google address
        if (highlightLinked && venue.attributes.externalProviderIDs.length > 0) {
          poly.setAttribute('stroke', '#0ff')
          colored = true
        }
        // highlight places without linked Google address
        else if (highlightNotLinked && !isRH && venue.attributes.externalProviderIDs.length === 0) {
          poly.setAttribute('stroke', '#0ff')
          colored = true
        }
        // highlight places which have no address
        else if (highlightNoAddress && !isNature && haveNoAddress &&
          (W.map.zoom >= wmepn_getId('_zoomLevel').value)) {
          poly.setAttribute('stroke', '#0f0')
          poly.setAttribute('stroke-dasharray', '4 7')
          colored = true
        }
        // highlight places which have different name and HN
        else if (highlightDifHN && (colored == false) && (W.map.zoom >= wmepn_getId('_zoomLevel').value) && hasHN && !haveNoName &&
          ((venue.attributes.categories[0] === 'OTHER') || (venue.attributes.categories[0] === 'PROFESSIONAL_AND_PUBLIC')) &&
          (!(houseNumber == venue.attributes.name.trim() || houseNumber == venue.attributes.name.trim().split(',')[0]))) {
          poly.setAttribute('stroke', '#f00')
          poly.setAttribute('stroke-dasharray', '4 7')
          colored = true
        }
      }
    }
  }
  if (W.map.getLayerByUniqueName('mapComments')?.getVisibility()) {
    for (let mark in W.model.mapComments.objects) {
      let comment = W.model.mapComments.getObjectById(mark)
      let olGeom = comment.getOLGeometry()
      let isPoint = olGeom.toString().match(/^POINT/)
      let isArea = olGeom.toString().match(/^POLYGON/)
      let isComment = comment.type === 'mapComment'
      let trimmedName = comment.attributes.subject
      let noTrName = (trimmedName.length === 0)
      if (showLockLevel) trimmedName += (noTrName ? '' : '\n') + '[L' + (comment.attributes.lockRank + 1) + ']'

      let poly = null
      if (W.map.commentLayer.featureMap.has(mark)) {
        let domID = W.map.commentLayer.featureMap.get(mark).geometry.id
        poly = wmepn_getId(domID)
      } else {
        poly = wmepn_getId(olGeom.id)
      }
      if (poly !== null) {
        if (showComments && (limitNames == 0 || drawnNames < limitNames) &&
          (W.map.zoom >= wmepn_getId('_zoomLevel').value)) {
          let wrappedText = wmepn_wordWrap(trimmedName, 30)
          let commentBody = ''
          let words = 1
          let commentsWords = 1

          if (showAddresses && (showComments && isComment)) {
            // how many words in Comment subject (needed to determine offsetY below)
            words = wrappedText.replace(/\n/g, ' ') + ' '
            words = words.split(/\s* \s*/).length - 1
            commentBody = comment.attributes.body === '' || comment.attributes.body === 'undefined' ? commentBody : wmepn_wordWrap(comment.attributes.body, 30)
            commentsWords = commentBody.replace(/\n/g, ' ') + ' '
            commentsWords = commentsWords.split(/\s* \s*/).length - 1
          }
          let filterMatched = (!noTrName && doFilter(trimmedName)) || (showAddresses && doFilter(commentBody))
          if (showComments && ((showAreas && isArea) || (!showAreas && !showPoints)) && filterMatched) {
            // Add label texts
            //let bounds = olGeom.bounds;
            let pt = olGeom.getCentroid()

            let offsetY = wmepn_getYoffset(words, wrappedText.length)
            offsetY += wmepn_getYoffset(commentsWords, commentBody.length)

            wmepn_addTextFeature(pt, wrappedText, showAddresses, null, null, commentBody, offsetY)

            drawnNames++
          }

          if (showComments && ((showPoints && isPoint) || (!showAreas && !showPoints)) && filterMatched) {
            // Add label texts
            let pt = new OpenLayers.Geometry.Point(olGeom.x, olGeom.y)

            let offsetY = wmepn_getYoffset(words, wrappedText.length)
            offsetY += wmepn_getYoffset(commentsWords, commentBody.length)

            wmepn_addTextFeature(pt, wrappedText, showAddresses, 15, null, commentBody, offsetY)

            drawnNames++
          }
        }
      }
    }
  }
  wmepn_getId('_stLandmarkNumber').innerHTML = '<i>' + drawnNames + '</i> ' + I18n.t('wmepn.place_names_and', { count: drawnNames })
  wmepn_getId('_stLandmarkHNNumber').innerHTML = '<i>' + drawnHNs + '</i> ' + I18n.t('wmepn.house_numbers', { count: drawnHNs })
}

function wmepn_getYoffset(words, length) {

  return (words == 1) ? (-12) : (((words > 1) &&
    (length < 60)) ? (-15) :
    (length < 90) ? (-20) :
      (length < 120) ? (-25) :
        (length < 150) ? (-30) :
          (length < 180) ? (-35) :
            (length < 210) ? (-40) :
              (length < 240) ? (-45) :
                (length < 270) ? (-50) : (-55))
}

var modifyArea = function() {
  if (!W.selectionManager.hasSelectedFeatures() ||
    W.selectionManager.getSelectectionObjectType() !== 'venue' ||
    !W.selectionManager.getSelectedDataModelObjects()[0].isGeometryEditable()) {
    return
  }

  var requiredArea = parseInt(wmepn_getId('_minArea').value, 10) + 5
  var selectedLandmark = W.selectionManager.getSelectedDataModelObjects()[0]
  var oldGeometry = selectedLandmark.getOLGeometry().clone()
  var newGeometry = selectedLandmark.getOLGeometry().clone()
  var centerPT = newGeometry.getCentroid()
  var oldArea = oldGeometry.getGeodesicArea(W.map.getProjectionObject())

  var scale = Math.sqrt(requiredArea / oldArea)
  newGeometry.resize(scale, centerPT)

  var wazeActionUpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry')
  var action = new wazeActionUpdateFeatureGeometry(selectedLandmark, W.model.venues, oldGeometry, newGeometry)
  W.model.actionManager.add(action)
}

/* helper function */
function wmepn_getId(node) {
  return document.getElementById(node)
}

/* =========================================================================== */

async function initialiseLandmarkNames() {
  // Some internationalization
  I18n.translations[I18n.locale].wmepn = wmepn_translations[I18n.locale] === undefined ? wmepn_translations[I18n.defaultLocale] : wmepn_translations[I18n.locale]
  I18n.translations[I18n.locale].layers.name[wmepn_uniqueLayerName] = wmepn_scriptName

  // add new box to left of the map
  var addon = document.createElement('section')
  var translator = I18n.defaultLocale == I18n.locale ? '' : 'title="' + I18n.t('wmepn.translator') + '"'

  addon.id = 'landmarkname-addon'
  addon.innerHTML = '<b>' +
    '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843" target="_blank" ' +
    translator + '>' + GM_info.script.name + '</a></b> &nbsp; v' + GM_info.script.version
  if (wmepn_translations[I18n.locale] === undefined) {
    addon.innerHTML += ' <small>[<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843&p=1302802#p1302802" target="_blank">translate me!</a>]</small>'
  }

  // highlight landmarks
  var section = document.createElement('p')
  section.style.padding = '8px 16px'
  //section.style.textIndent = "-16px";
  section.id = 'nameLandmarks'
  section.innerHTML =
    '<div title="' + I18n.t('wmepn.enable_script_tooltip') + '"><input type="checkbox" id="_cbLandmarkNamesEnable" /> <b>' + I18n.t('wmepn.enable_script') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.color_places_tooltip') + '"><input type="checkbox" id="_cbLandmarkColors" /> <b>' + I18n.t('wmepn.color_places') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_places_tooltip') + '"><input type="checkbox" id="_cbLandmarkhighlightNoName"/> <b>' + I18n.t('wmepn.highlight_places') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_address_tooltip') + '"><input type="checkbox" id="_cbLandmarkhighlightNoAddress"/> <b>' + I18n.t('wmepn.highlight_address') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_dif_address_tooltip') + '"><input type="checkbox" id="_cbLandmarkhighlightDifHN"/> <b>' + I18n.t('wmepn.highlight_dif_address') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_linked_tooltip') + '"><input type="checkbox" id="_cbShowLinked" /> <b>' + I18n.t('wmepn.highlight_linked') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_not_linked_tooltip') + '"><input type="checkbox" id="_cbShowNotLinked" /> <b>' + I18n.t('wmepn.highlight_not_linked') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.highlight_small_tooltip') + '"><input type="checkbox" id="_cbLandmarkhighlightSmall"/> <b>' + I18n.t('wmepn.highlight_small') +
    '</b><input id="_minArea" style="width: 40px;"/><b>' + I18n.t('wmepn.square_m_2') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.show_address_tooltip') + '"><input type="checkbox" id="_cbLandmarkShowAddresses"/> <b>' + I18n.t('wmepn.show_address') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.show_tooltip') + '"><b>' + I18n.t('wmepn.show') + ':</b></div>' +
    '<div title="' + I18n.t('wmepn.show') + ' ' + I18n.t('wmepn.option_area') + '" style="padding-left: 20px;"><input type="checkbox" id="_cbShowArea"> ' + I18n.t('wmepn.option_area') + '</div>' +
    '<div title="' + I18n.t('wmepn.show') + ' ' + I18n.t('wmepn.option_point') + '" style="padding-left: 20px;"><input type="checkbox" id="_cbShowPoi"> ' + I18n.t('wmepn.option_point') + '</div>' +
    '<div title="' + I18n.t('wmepn.show') + ' ' + I18n.t('wmepn.option_residential') + '" style="padding-left: 20px;"><input type="checkbox" id="_cbShowRH"> ' + I18n.t('wmepn.option_residential') + '</div>' +
    '<div title="' + I18n.t('wmepn.show') + ' ' + I18n.t('wmepn.option_comments') + '" style="padding-left: 20px;"><input type="checkbox" id="_cbShowComment"> ' + I18n.t('wmepn.option_comments') + '</div>' +
    '<div title="' + I18n.t('wmepn.filter_tooltip') + '"><b>' + I18n.t('wmepn.filter') + ':</b><input type="text" id="_inLandmarkNameFilter"/></div>' +
    '<div title="' + I18n.t('wmepn.show_locklevel_tooltip') + '"><input type="checkbox" id="_cbLandmarkLockLevel" /> <b>' + I18n.t('wmepn.show_locklevel') + '</b></div>' +
    '<div title="' + I18n.t('wmepn.stop_over_tooltip') + '"><b>' + I18n.t('wmepn.stop_over') + '</b> <select id="_seLandmarkLimit">' +
    '<option value="0">' + I18n.t('wmepn.option_unlimited') + '</option>' +
    '<option value="500">500</option>' +
    '<option value="200">200</option>' +
    '<option value="100">100</option>' +
    '<option value="50">50</option>' +
    '<option value="25">25</option>' +
    '<option value="10">10</option>' +
    '</select></div>' +
    '<div><small>' + I18n.t('wmepn.showing') + ' <span id="_stLandmarkNumber"></span> <span id="_stLandmarkHNNumber"></span></small></div>' +
    '<div title="' + I18n.t('wmepn.show_zoom_tooltip') + '"><b>' + I18n.t('wmepn.show_zoom') + '</b><input type="number" id="_zoomLevel"/></div>'
  addon.appendChild(section)

  const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("sidepanel-wmepn");

  tabLabel.innerText = wmepn_scriptName;
  tabLabel.title = wmepn_scriptName;

  tabPane.innerHTML = addon.innerHTML;

  await W.userscripts.waitForElementConnected(tabPane);
  
  // setup onclick handlers for instant update:
  wmepn_getId('_cbLandmarkColors').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkhighlightNoName').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkhighlightNoAddress').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkhighlightDifHN').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkhighlightSmall').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkNamesEnable').onclick = wmepn_resetLandmarks
  wmepn_getId('_inLandmarkNameFilter').oninput = wmepn_showLandmarkNames
  wmepn_getId('_cbLandmarkLockLevel').onclick = wmepn_showLandmarkNames
  wmepn_getId('_seLandmarkLimit').onchange = wmepn_showLandmarkNames
  wmepn_getId('_zoomLevel').onchange = wmepn_resetLandmarks
  wmepn_getId('_cbLandmarkShowAddresses').onclick = wmepn_resetLandmarks
  wmepn_getId('_minArea').onchange = wmepn_resetLandmarks
  wmepn_getId('_cbShowArea').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbShowPoi').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbShowRH').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbShowComment').onclick = wmepn_resetLandmarks
  wmepn_getId('_cbShowLinked').onclick = function () {
    if (wmepn_getId('_cbShowLinked').checked) {
      wmepn_getId('_cbShowNotLinked').checked = false
    }
    wmepn_resetLandmarks()
  }
  wmepn_getId('_cbShowNotLinked').onclick = function () {
    if (wmepn_getId('_cbShowNotLinked').checked) {
      wmepn_getId('_cbShowLinked').checked = false
    }
    wmepn_resetLandmarks()
  }

  // Create PlaceName layer
  var rlayers = W.map.getLayersBy('uniqueName', wmepn_uniqueLayerName)
  if (rlayers.length == 0) {
    var lname = wmepn_scriptName
    var style = new OpenLayers.Style({
      strokeDashstyle: 'solid',
      strokeColor: '${strokeColor}',
      strokeOpacity: 1.0,
      strokeWidth: '${strokeWidth}',
      fillColor: '#0040FF',
      fillOpacity: 1.0,
      pointRadius: '${pointRadius}',
      label: '${labelText}',
      fontFamily: 'Tahoma, Courier New',
      labelOutlineColor: '#FFEEEE',
      labelOutlineWidth: 2,
      labelAlign: 'cm',
      fontColor: '#301130',
      fontOpacity: 1.0,
      fontSize: '11px',
      display: 'block',
      labelYOffset: '${yOffset}',
      fontStyle: '${style}'
    })
    var nameLayer = new OpenLayers.Layer.Vector(lname, {
      displayInLayerSwitcher: true,
      uniqueName: wmepn_uniqueLayerName,
      shortcutKey: 'S+n',
      accelerator: 'toggle' + lname.replace(/\s+/g, ''),
      styleMap: new OpenLayers.StyleMap(style),
      visibility: true
    })
    W.map.addLayer(nameLayer)

    wmepn_NameLayer = nameLayer
  } else wmepn_NameLayer = rlayers[0]

  // restore saved settings
  if (localStorage.WMELandmarkNamesScript) {
    console.log('WME PlaceNames: loading options')
    var options = JSON.parse(localStorage.WMELandmarkNamesScript)

    wmepn_getId('_cbLandmarkColors').checked = options[1]
    wmepn_getId('_cbLandmarkhighlightNoName').checked = options[2]
    if (options[3] !== undefined)
      wmepn_getId('_cbShowArea').checked = options[3]
    wmepn_NameLayer.setVisibility(options[4])
    if (options[5] !== undefined)
      wmepn_getId('_cbLandmarkNamesEnable').checked = options[5]
    else wmepn_NameLayer.setVisibility(true)
    if (options[6] !== undefined)
      wmepn_getId('_inLandmarkNameFilter').value = options[6]
    if (options[7] !== undefined)
      wmepn_getId('_cbLandmarkLockLevel').checked = options[7]
    if (options[8] !== undefined)
      wmepn_getId('_seLandmarkLimit').value = options[8]
    else
      wmepn_getId('_seLandmarkLimit').value = 100
    if (options[9] !== undefined)
      wmepn_getId('_zoomLevel').value = options[9]
    else
      wmepn_getId('_zoomLevel').value = 17
    if (options[10] !== undefined)
      wmepn_getId('_cbLandmarkhighlightSmall').checked = options[10]
    if (options[11] !== undefined)
      wmepn_getId('_cbLandmarkhighlightNoAddress').checked = options[11]
    if (options[12] !== undefined)
      wmepn_getId('_cbLandmarkShowAddresses').checked = options[12]
    if (options[13] !== undefined)
      wmepn_getId('_cbLandmarkhighlightDifHN').checked = options[13]
    if (options[14] !== undefined)
      wmepn_getId('_minArea').value = options[14]
    else
      wmepn_getId('_minArea').value = 650
    if (options[15] !== undefined)
      wmepn_getId('_cbShowPoi').checked = options[15]
    if (options[16] !== undefined)
      wmepn_getId('_cbShowRH').checked = options[16]
    if (options[17] !== undefined)
      wmepn_getId('_cbShowLinked').checked = options[17]
    if (options[18] !== undefined)
      wmepn_getId('_cbShowNotLinked').checked = options[18]
    if (options[19] !== undefined)
      wmepn_getId('_cbShowComment').checked = options[19]

  } else {
    wmepn_getId('_cbLandmarkColors').checked = true
    wmepn_getId('_cbLandmarkhighlightNoName').checked = true
    wmepn_getId('_cbLandmarkhighlightNoAddress').checked = true
    wmepn_getId('_cbLandmarkhighlightDifHN').checked = true
    wmepn_getId('_cbLandmarkhighlightSmall').checked = true
    wmepn_getId('_cbLandmarkShowAddresses').checked = true
    wmepn_getId('_cbShowArea').checked = true
    wmepn_getId('_cbShowPoi').checked = true
    wmepn_getId('_cbShowRH').checked = true
    wmepn_getId('_cbShowComment').checked = true
    wmepn_NameLayer.setVisibility(true)
    wmepn_getId('_cbLandmarkNamesEnable').checked = true
    wmepn_getId('_cbLandmarkLockLevel').checked = false
    wmepn_getId('_cbShowLinked').checked = false
    wmepn_getId('_cbShowNotLinked').checked = false
    wmepn_getId('_seLandmarkLimit').value = 100
    wmepn_getId('_zoomLevel').value = 17
    wmepn_getId('_minArea').value = 650
  }

  // add layer to menu
  var $ul = $('.collapsible-GROUP_DISPLAY')
  var $li = document.createElement('li')
  var checkbox = document.createElement('wz-checkbox')
  checkbox.id = 'layer-switcher-item_placenames_plus'
  checkbox.className = 'hydrated'
  checkbox.type = 'checkbox'
  checkbox.checked = wmepn_NameLayer.getVisibility()
  checkbox.appendChild(document.createTextNode(wmepn_scriptName))
  checkbox.onclick = function () {
    wmepn_NameLayer.setVisibility(!wmepn_NameLayer.getVisibility())
  }
  $li.append(checkbox)
  $ul.append($li)

  if (typeof W.model.venues == 'undefined') {
    wmepn_getId('_cbLandmarkColors').checked = false
    wmepn_getId('_cbLandmarkhighlightNoName').checked = false
    wmepn_getId('_cbLandmarkhighlightNoAddress').checked = false
    wmepn_getId('_cbLandmarkhighlightDifHN').checked = false
    wmepn_getId('_cbLandmarkhighlightSmall').checked = false
    wmepn_getId('_cbLandmarkShowAddresses').checked = false
    wmepn_getId('_cbLandmarkColors').disabled = true
    wmepn_getId('_cbLandmarkhighlightNoName').disabled = true
    wmepn_getId('_cbLandmarkhighlightNoAddress').disabled = true
    wmepn_getId('_cbLandmarkhighlightDifHN').disabled = true
    wmepn_getId('_cbLandmarkhighlightSmall').checked = true
    wmepn_getId('_cbShowArea').checked = true
    wmepn_getId('_cbShowPoi').checked = true
    wmepn_getId('_cbShowRH').checked = true
    wmepn_getId('_cbShowComment').checked = true
    wmepn_getId('_cbLandmarkLockLevel').disabled = true
    wmepn_getId('_cbShowLinked').disabled = true
    wmepn_getId('_cbShowNotLinked').disabled = true
    wmepn_getId('_seLandmarkLimit').disabled = true
    wmepn_getId('_cbLandmarkShowAddresses').checked = true
  }

  // overload the WME exit function
  var wmepn_saveLandmarkNamesOptions = function () {
    if (localStorage) {
      console.log('WME PlaceNames: saving options')
      var options = []

      // preserve previous options which may get lost after logout
      if (localStorage.WMELandmarkNamesScript) {
        options = JSON.parse(localStorage.WMELandmarkNamesScript)
      }

      options[1] = wmepn_getId('_cbLandmarkColors').checked
      options[2] = wmepn_getId('_cbLandmarkhighlightNoName').checked
      options[3] = wmepn_getId('_cbShowArea').checked
      options[4] = wmepn_NameLayer.getVisibility()
      options[5] = wmepn_getId('_cbLandmarkNamesEnable').checked
      options[6] = wmepn_getId('_inLandmarkNameFilter').value
      options[7] = wmepn_getId('_cbLandmarkLockLevel').checked
      options[8] = wmepn_getId('_seLandmarkLimit').value
      options[9] = wmepn_getId('_zoomLevel').value
      options[10] = wmepn_getId('_cbLandmarkhighlightSmall').checked
      options[11] = wmepn_getId('_cbLandmarkhighlightNoAddress').checked
      options[12] = wmepn_getId('_cbLandmarkShowAddresses').checked
      options[13] = wmepn_getId('_cbLandmarkhighlightDifHN').checked
      options[14] = wmepn_getId('_minArea').value
      options[15] = wmepn_getId('_cbShowPoi').checked
      options[16] = wmepn_getId('_cbShowRH').checked
      options[17] = wmepn_getId('_cbShowLinked').checked
      options[18] = wmepn_getId('_cbShowNotLinked').checked
      options[19] = wmepn_getId('_cbShowComment').checked

      localStorage.WMELandmarkNamesScript = JSON.stringify(options)
    }
  }
  window.addEventListener('beforeunload', wmepn_saveLandmarkNamesOptions, false)

  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener('load', function () {
    var mapProblems = wmepn_getId('map-problems-explanation')
    if (mapProblems !== null) mapProblems.style.display = 'none'
  })

  // register some events...
  W.map.events.register('zoomend', null, wmepn_showLandmarkNames)
  W.map.events.register('changelayer', null, wmepn_showLandmarkNames)
  W.map.events.register('mouseout', null, wmepn_showLandmarkNames)
  W.selectionManager.events.register('selectionchanged', null, wmepn_showLandmarkNames)

  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_PlaceNames_enable =
    I18n.t('wmepn.enable_disable_script') + ' ' + wmepn_scriptName
  W.accelerators.addAction('WME_PlaceNames_enable', { group: 'default' })
  W.accelerators.events.register('WME_PlaceNames_enable', null, enablePlaceNames)
  W.accelerators._registerShortcuts({ 'S+n': 'WME_PlaceNames_enable' })

  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_PlaceNames_increase =
    I18n.t('wmepn.increase_square_to') + ' ' + wmepn_getId('_minArea').value.toString() + I18n.t('wmepn.increase_square_to_2')
  W.accelerators.addAction('WME_PlaceNames_increase', { group: 'default' })
  W.accelerators.events.register('WME_PlaceNames_increase', null, modifyArea)
  W.accelerators._registerShortcuts({ 'y': 'WME_PlaceNames_increase' })
}

var enablePlaceNames = function() {
  wmepn_getId('_cbLandmarkNamesEnable').click()
}

/* engage! =================================================================== */
bootstrapLandmarkNames()

/* end ======================================================================= */
