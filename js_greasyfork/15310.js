// ==UserScript==
// @name       WME PlaceNames Russian
// @version    0.76
// @description  Show area and point place names in WME, color and highlight places by type and properties
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @copyright           Vinkoy, ragacs
// @namespace           https://greasyfork.org/en/scripts/15310-wme-placenames-russian
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/15310/WME%20PlaceNames%20Russian.user.js
// @updateURL https://update.greasyfork.org/scripts/15310/WME%20PlaceNames%20Russian.meta.js
// ==/UserScript==

var wmepn_translations =
{
    "en":
    {
    enable_script: "Enable script",
    enable_script_tooltip: "Toggle highlighting and place names layer\nUse the Layer selector or Shift+N hotkey to toggle names only",
    color_places: "Color places",
    color_places_tooltip: "Color the places like WMECH does",
    highlight_places: "Highlight places without name/HN",
    highlight_places_tooltip: "Highlight public places without name and private places without house number (yellow)",
    highlight_address: "Places without address",
    highlight_address_tooltip: "Highlight places without street or housenumber (dashed green)",
    highlight_dif_address: "The name doesn't match the housenumber",
    highlight_dif_address_tooltip: "Check if the name mathes the housenumber. Highlights (Other and Public places), where the name doesn't match the housenumber (dashed red)",
    highlight_small: "Place area less than",
    highlight_small_tooltip: "Highlight places area less than specified (red). Small places may not be visible in app",
    highlight_linked: "Linked places",
    highlight_linked_tooltip: "Highlight places linked to Google (cyan)",
    highlight_not_linked: "Not linked places",
    highlight_not_linked_tooltip: "Highlight places NOT linked to Google (cyan)",
    show_address: "Show address",
    show_address_tooltip: "Show address under the name",
    show: "Show",
    show_tooltip: "Select desired names to show",
    option_area: "Area",
    option_point: "POI",
    option_residential: "Residential",
    option_comments: "Comments",
    filter: "Filter",
    filter_tooltip: "Filter only the names containing this string (you could use regex e.g. /school/i)",
    show_locklevel: "Show lock level",
    show_locklevel_tooltip: "Display lock level after the name, like [L3] or [L4]",
    stop_over: "Stop over",
    stop_over_tooltip: "Limit displayed place names to the specified value",
    option_unlimited: "Unlimited",
    show_zool: "Zoom",
    show_zool_tooltip: "Minimum zoom to display the names",
    showing: "Showing",
    place_names_and: {
        one: "place name and",
        other: "place names and" },
    house_numbers:  {
        one: "house number",
        other: "house numbers" },
    translator: "translated by [Your Waze Nickname]"
    },
    "hu":
    {
    enable_script: "Szkript engedélyezése",
    enable_script_tooltip: "A színezés, kiemelés és a Helynevek réteg bekapcsolása\nHasználd a rétegválasztót vagy a Shift+N forróbillentyűt, ha csak a neveket akarod kapcsolgatni",
    color_places: "Helyek színezése",
    color_places_tooltip: "Helyek színezése, ahogyan a WMECH teszi",
    highlight_places: "Név/hsz nélküli helyek kiemelése",
    highlight_places_tooltip: "Kiemeli (sárgával) a névtelen nyilvános helyeket és a házszám nélküli magánházakat",
    show: "Mutasd",
    show_tooltip: "Válaszd ki a megmutatni kívánt neveket",
    option_area: "Csak terület",
    option_point: "Terület és pont",
    option_residential: "Csak pont",
    filter: "Szűrő",
    filter_tooltip: "Csak azokat a neveket mutassa, amik ezt a szöveget tartalmazzák (reguláris kifejezések használhatók, pl. /iskola/i)",
    show_locklevel: "Védelem mutatása",
    show_locklevel_tooltip: "Mutassa a védelmi szintet is a név után, pl. [L3] vagy [L4]",
    stop_over: "Maximum",
    stop_over_tooltip: "A képernyőn egyszerre látható név-feliratok számát korlátozza",
    option_unlimited: "Korlátlan",
    showing: "Látható",
    place_names_and: "helynév és",
    house_numbers: "házszám",
    translator: "fordította ragacs"
    },
"cs":
{
    enable_script: "Povolit skript",
    enable_script_tooltip: "Přepínač zvýraznění a jmen míst\nPoužijte menu Vrstvy nebo klávesovou zkratku Shift+N, aby se zobrazila jen jména míst",
    color_places: "Barevné odlišení",
    color_places_tooltip: "Barevné odlišení jako WMECH",
    highlight_places: "Odlišit nepojmenovaná místa",
    highlight_places_tooltip: "Odlišit nepojmenovaná veřejná místa a soukromá místa bez čísla domu (žlutě)",
    show: "Zobrazit",
    show_tooltip: "Zobrazit požadovaná jména",
    option_area: "Jen plochy",
    option_point: "Plochy a body",
    option_residential: "Jen body",
    filter: "Filtr",
    filter_tooltip: "Filtrovat jen jména obsahující tento řetězec (lze použít regex např. /škola/i)",
    show_locklevel: "Ukázat zámek",
    show_locklevel_tooltip: "Zobrazit zámek za jménem místa (např. [L3] nebo [L4])",
    stop_over: "Omezení",
    stop_over_tooltip: "Omezit zobrazená místa na zadanou hodnotu",
    option_unlimited: "Bez omezení",
    showing: "Zobrazení",
    place_names_and: "jména míst a",
    house_numbers: "čísla domů",
    translator: "překládal bures"
},
    "nl" :
    {
        enable_script: "Script inschakelen",
        enable_script_tooltip: "De laag voor het weergeven en markeren van plaatsnamen beheren\nGebruik de laagselector of Shift+N om enkel de namen te beheren",
        color_places: "Voeg kleur toe aan plaatsen",
        color_places_tooltip: "Kleur de plaatsen in zoals het WMECH-script dit doet",
        highlight_places: "Markeer plaatsen zonder naam of huisnummer",
        highlight_places_tooltip: "Markeer publieke plaatsen zonder naam en private plaatsen zonder huisnummer (geel)",
        show: "Weergave",
        show_tooltip: "Selecteer welke namen er moeten weergegeven worden",
        option_area: "Enkel gebieden",
        option_point: "Gebieden en punten",
        option_residential: "Enkel punten",
        filter: "Filter",
        filter_tooltip: "Toon enkel de plaatsen met de volgende naam (je kan ook een regex gebruiken zoals /school/i)",
        show_locklevel: "Lock-level weergeven",
        show_locklevel_tooltip: "Geef het lock-level weer achter de naam als [L3] of [L4]",
        stop_over: "Beperk aantal plaatsnamen",
        stop_over_tooltip: "Beperk het aantal weergegeven plaatsnamen tot dit aantal",
        option_unlimited: "Onbeperkt",
        showing: "Huidige weergave: ",
    place_names_and: {
        one: "plaatsnaam en",
        other: "plaatsnamen en" },
    house_numbers:  {
        one: "huisnummer",
        other: "huisnummers" },
        translator: "vertaald door Glodenox"
    },
"uk":{
    enable_script: "Включити скрипт",
    enable_script_tooltip: "Включити підсвічування та відображення імен POI",
    color_places: "Кольорові POI",
    color_places_tooltip: "Відображати кольорові POI в залежності від їх типу",
    highlight_places: "POI без імені",
    highlight_places_tooltip: "Підсвічувати POI без імені (жовтий)",
    highlight_address: "POI без адреси",
    highlight_address_tooltip: "ППідсвічувати POI, у яких не заповнені поля адреси: вулиця і номер будинку (зелений пунктир)",
    highlight_dif_address: "Ім'я не збігається з номером будинку",
    highlight_dif_address_tooltip: "Перевірка відповідності імені контура з номером будинку в адресі. Підсвічує POI (Інша / контур будівлі та Громадське місце), у яких ім'я не збігається з номером будинку в адресі (червоний пунктир)",
    highlight_small: "POI з площею менше ",
    highlight_small_tooltip: "Підсвічування POI з площею менше зазначеної (червоний). Маленькі POI можуть не відображатися в застосунку",
    highlight_linked: "Лінковані POI",
    highlight_linked_tooltip: "Підсвічувати POI, що мають прив'язку до адреси Google (блакитний)",
    highlight_not_linked: "Нелінковані POI",
    highlight_not_linked_tooltip: "Підсвічувати POI, без прив'язки до адреси Google (блакитний)",
    show_address: "Відображати адресу POI",
    show_address_tooltip: "Відображати адресу POI під ім'ям",
    show: "Відображати ім'я (адресу)",
    show_tooltip: "Вибрати для відображення імені",
    option_area: "Області",
    option_point: "Точкові POI",
    option_residential: "АТ",
    option_comments: "Коментарі",
    filter: "Фільтр",
    filter_tooltip: "Фільтр відображення в назві (можна використовувати regex, наприклад / школа/i)",
    show_locklevel: "Відображати рівень блокування",
    show_locklevel_tooltip: "Відображати рівень блокування після імені, наприклад, [L3] або [L4]",
    stop_over: "Кількість відображуваних імен",
    stop_over_tooltip: "Обмеження кількості відображуваних імен на карті",
    option_unlimited: "Без обмеження",
    show_zool: "Масштаб ",
    show_zool_tooltip: "Мінімальний масштаб для відображення імен",
    showing: "Відображається",
    place_names_and: "імен POI та",
    house_numbers: "АТ",
    translator: "translated and modified by Vinkoy"
    },
    "ru":
    {
    enable_script: "Включить скрипт",
    enable_script_tooltip: "Включить подсветку и отображение имен POI",
    color_places: "Цветные POI",
    color_places_tooltip: "Отображать цветные POI в зависимости от их типа",
    highlight_places: "POI без имени",
    highlight_places_tooltip: "Подсвечивать POI без имени (желтый)",
    highlight_address: "POI без адреса",
    highlight_address_tooltip: "Подсвечивать POI, у которых не заполнены поля адреса: улица и номер дома (зеленый пунктир)",
    highlight_dif_address: "Имя не совпадает с номером дома",
    highlight_dif_address_tooltip: "Проверка соответствия имени контура с номером дома в адресе. Подсвечивает POI (Другое/контур здания и Общественное место), у которых имя не совпадает с номером дома в адресе (красный пунктир)",
    highlight_small: "POI с площадью менее",
    highlight_small_tooltip: "Подсветка POI с площадью меньше указанной (красный). Маленькие POI могут не отображаться в приложении",
    highlight_linked: "Линкованные POI",
    highlight_linked_tooltip: "Подсвечивать POI, имеющие привязку к адресу Google (голубой)",
    highlight_not_linked: "Нелинкованные POI",
    highlight_not_linked_tooltip: "Подсвечивать POI, без привязки к адресу Google (голубой)",
    show_address: "Отображать адрес POI",
    show_address_tooltip: "Отображать адрес POI под именем",
    show: "Отображать имя (адрес)",
    show_tooltip: "Выбрать для отображения имени",
    option_area: "Области",
    option_point: "POI-точки",
    option_residential: "ПТ",
    option_comments: "Комментарии",
    filter: "Фильтр",
    filter_tooltip: "Фильтр отображения по имени (можно использовать regex, например /школа/i)",
    show_locklevel: "Отображать уровень блокировки",
    show_locklevel_tooltip: "Отображать уровень блокировки после имени, например, [L3] или [L4]",
    stop_over: "Количество отображаемых имен",
    stop_over_tooltip: "Ограничение количества отображаемых имен на карте",
    option_unlimited: "Без ограничения",
    show_zool: "Масштаб",
    show_zool_tooltip: "Минимальный масштаб для отображения имен",
    showing: "Отображается",
    place_names_and: "имен POI и",
    house_numbers: "ПТ",
    translator: "translated and modified by Vinkoy"
    }
};

// Using parts from highlight and route speed scripts by various authors

/* bootstrap, will call initialiseLandmarkNames() */
function bootstrapLandmarkNames()
{
    /* begin running the code! */
    if (typeof W === "undefined" ||
        typeof W.map === "undefined" ||
        typeof W.selectionManager === "undefined" ||
        typeof W.model.countries === "undefined" ||
        typeof I18n === "undefined" ||
        typeof I18n.translations === "undefined") {
        setTimeout(bootstrapLandmarkNames, 700);
        return;
    }
    initialiseLandmarkNames();
}

function wmepn_wordWrap(str, maxWidth) {
    function testWhite(x) {
        var white = new RegExp(/^[ \t\r\n\f]$/); // We are not using \s because it matches non-breaking space too
        return white.test(x.charAt(0));
    }

    var newLineStr = "\n"; done = false; res = '';
    do {
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found && str.length > maxWidth) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
        {
            res = res + str;
            done = true;
        }
    } while (!done);

    return res;
}

function wmepn_resetLandmarks()
{
    var venues = W.model.venues;
    for (var mark in venues.objects) {
        var venue = venues.getObjectById(mark);
        var poly = wmepn_getId(venue.geometry.id);
        if (poly !== null) {
            if (poly.getAttribute("stroke-opacity") != 1) {
                poly.setAttribute("fill","#d191d6");
                poly.setAttribute("stroke","#d191d6");
                poly.setAttribute("fill-opacity",0.3);
                poly.setAttribute("stroke-opacity",1);
            }
        }
    }
    wmepn_showLandmarkNames();
}

function wmepn_showLandmarkNames() {
  wmepn_NameLayer.removeAllFeatures();
  if (typeof W.model.venues == "undefined" || wmepn_getId('_cbLandmarkNamesEnable').checked === false) {
    wmepn_getId('_stLandmarkNumber').innerHTML = 0;
    wmepn_getId('_stLandmarkHNNumber').innerHTML = 0;
    return;
  }
  var venues = W.model.venues;
  var streets = W.model.streets;
  var map = W.map;
  var showNames = wmepn_NameLayer.getVisibility() && map.getLayersBy("uniqueName", "venues")[0].getVisibility();
  // if checkbox unticked, reset places to original style
  if (!showNames
     && !wmepn_getId('_cbLandmarkColors').checked
     && !wmepn_getId('_cbLandmarkHiliteNoName').checked
     && !wmepn_getId('_cbLandmarkHiliteNoAddress').checked
     && !wmepn_getId('_cbLandmarkHiliteDifHN').checked
     && !wmepn_getId('_cbLandmarkHiliteSmall').checked ) {
    for (var mark in venues.objects) {
      var venue = venues.getObjectById(mark);
      var poly = wmepn_getId(venue.geometry.id);
      if (poly !== null) {
        if (poly.getAttribute("stroke-opacity") != 1) {
          poly.setAttribute("fill","#d191d6");
          poly.setAttribute("stroke","#d191d6");
          poly.setAttribute("fill-opacity",0.3);
          poly.setAttribute("stroke-opacity",1);
          poly.setAttribute("stroke-dasharray","none");
        }
      }
    }
    wmepn_getId('_stLandmarkNumber').innerHTML = 0;
    wmepn_getId('_stLandmarkHNNumber').innerHTML = 0;
    return;
  }

  var hiliteNoName = wmepn_getId('_cbLandmarkHiliteNoName').checked;
  var colorLandmarks = wmepn_getId('_cbLandmarkColors').checked;
  var hiliteNoAddress = wmepn_getId('_cbLandmarkHiliteNoAddress').checked;
  var hiliteDifHN = wmepn_getId('_cbLandmarkHiliteDifHN').checked;
  var hiliteSmall = wmepn_getId('_cbLandmarkHiliteSmall').checked;
  var hiliteLinked = wmepn_getId('_cbShowLinked').checked;
  var hiliteNotLinked = wmepn_getId('_cbShowNotLinked').checked;
  var showAddresses = wmepn_getId('_cbLandmarkShowAddresses').checked;
  var minArea = wmepn_getId('_minArea').value;
  var showPoints = wmepn_getId('_cbShowPoi').checked;
  var showAreas = wmepn_getId('_cbShowArea').checked;
  var showResidentials = wmepn_getId('_cbShowRH').checked;
  var showComments = wmepn_getId('_cbShowComment').checked;
  var showLockLevel = wmepn_getId('_cbLandmarkLockLevel').checked;
  var limitNames = wmepn_getId('_seLandmarkLimit').value;
  var nameFilterArray = wmepn_getId('_inLandmarkNameFilter').value.split("/");
  var nameFilter = (nameFilterArray.length > 1 ? nameFilterArray[1] : nameFilterArray[0]);
  var nameFilterOptions = nameFilterArray[2];
  var nameFilterRegEx = (nameFilterArray.length > 1 ? new RegExp(nameFilter, nameFilterOptions) : null);
  var doFilter = function (name) {
      if(nameFilter.length === 0)
          return true; // show all when no filter entered
      if(nameFilterRegEx === null)
      	return (name.indexOf(nameFilter) >= 0);
      else
      	return nameFilterRegEx.test(name);
  };

  var drawnNames = 0;
  var drawnHNs = 0;
  for (var mark in venues.objects) {
    var venue = venues.getObjectById(mark);
    var poly = wmepn_getId(venue.geometry.id);
    var isPoint = venue.geometry.toString().match(/^POINT/);
    var isArea = venue.geometry.toString().match(/^POLYGON/);
    var isRH = venue.attributes.residential;
    var houseNumber = venue.attributes.houseNumber;
    var trimmedName = isRH ? houseNumber : venue.attributes.name.trim();
    var noTrName = (trimmedName.length == 0);
    if(showLockLevel) trimmedName +=  (noTrName ? "" : "\n") + "[L" + (venue.attributes.lockRank+1) + "]";
    if (poly !== null) {
      var venueStreet = streets.getObjectById(venue.attributes.streetID);
      var haveNoName = (isRH ? (houseNumber.length == 0) : noTrName);
      var hasHN = houseNumber != "" && houseNumber != null;
      var hasStreet = venueStreet != null && venueStreet.name != null && venueStreet.name != "";
      var haveNoAddress = !hasHN || !hasStreet;

        if(showNames && (showAreas || showPoints || showResidentials) && (limitNames == 0 || drawnNames < limitNames)
            && (map.zoom >= wmepn_getId('_zoomLevel').value))
        {
		    var wrappedText = wmepn_wordWrap(trimmedName, 30);
            var addressText = "";

            if(showAddresses && ( showAreas && isArea || showPoints && isPoint || showResidentials && isRH) )
            {
                // how many words in POI name (needed to determine offsetY below)
                var words = wrappedText.replace(/\n/g,' ') + ' ';
                words = words.split(/\s* \s*/).length-1;
                addressText = hasStreet ? venueStreet.name.trim() : addressText;
                addressText = hasHN ? (hasStreet ? (addressText+", "+houseNumber) : houseNumber) : addressText;
                addressText = (addressText.length>0) ? ("("+addressText+")") : addressText;
            }
            var filterMatched = (!noTrName && doFilter(trimmedName))||(hasHN && isRH && doFilter(houseNumber))||(showAddresses && doFilter(addressText));
            if(showAreas && isArea && filterMatched)
            {
                // Add label texts
                var labelFeatures = [];
                var bounds = venue.geometry.bounds;
                var pt;
                //if(bounds.getWidth() * bounds.getHeight() * .3 > venue.geometry.getArea() && venue.attributes.entryExitPoints.length > 0)
                //	pt = venue.attributes.entryExitPoints[0].point;
                //else
                	pt = venue.geometry.getCentroid();
                var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, fontColor: '#F0F0F0', pointRadius: 0 });
                labelFeatures.push(textFeature);

                if(showAddresses)
                {
                    var offsetY =  wmepn_getYoffset(words, wrappedText.length);
                    var addrFeature = new OpenLayers.Feature.Vector( pt, {labelText: addressText, style: "italic", pointRadius: 0, yOffset: offsetY } );
                    labelFeatures.push(addrFeature);
                }
                wmepn_NameLayer.addFeatures(labelFeatures);
                drawnNames++;
        	}
            if(showPoints && isPoint && !isRH && filterMatched )
            {
                // Add label texts
                var labelFeatures = [];
                var pt = new OpenLayers.Geometry.Point(venue.geometry.x, venue.geometry.y);
                var isHouseNumber = !filterMatched;

                var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, fontColor: '#F0F0F0', pointRadius: 0, yOffset: 15 });
                labelFeatures.push(textFeature);

                if(showAddresses)
                {
                    var offsetY =  wmepn_getYoffset(words, wrappedText.length);
                    var addrFeature = new OpenLayers.Feature.Vector( pt, {labelText: addressText, style: "italic", pointRadius: 0, yOffset: offsetY } );
                    labelFeatures.push(addrFeature);
                }

                wmepn_NameLayer.addFeatures(labelFeatures);
                drawnNames++;
            }
            if(showResidentials && isPoint && isRH && filterMatched )
            {
                // Add label texts
                var labelFeatures = [];
                var pt = new OpenLayers.Geometry.Point(venue.geometry.x, venue.geometry.y);
                var isHouseNumber = !filterMatched;

                var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, style: "italic", fontColor: '#F0F0F0', pointRadius: 0, yOffset: 15 });
                labelFeatures.push(textFeature);

                if(showAddresses)
                {
                    var addrFeature = new OpenLayers.Feature.Vector( pt, {labelText: addressText, style: "italic", pointRadius: 0, yOffset: -15 } );
                    labelFeatures.push(addrFeature);
                }

                wmepn_NameLayer.addFeatures(labelFeatures);
                drawnHNs++;
            }
        }

      wmepn_getId('_stLandmarkNumber').innerHTML = drawnNames;
      wmepn_getId('_stLandmarkHNNumber').innerHTML = drawnHNs;

        if (W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager.getSelectedFeatures()[0].model.type === "venue")
        {
            var area_poi=document.getElementById('WME.PlaceNames-Square');
            if(!area_poi)
            {
                var wcp=document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
                if (wcp)
                {
                  var li=document.createElement("LI");
                  li.setAttribute('id', 'WME.PlaceNames-Square');
                  wcp[0].appendChild(li);
                  area_poi=document.getElementById('WME.PlaceNames-Square');
                }
            }

            if(area_poi)
            {
                var v_id=W.selectionManager.getSelectedFeatures()[0].model.attributes.id;
                var getv=W.model.venues.getObjectById(v_id);
                if (typeof getv === "undefined" || typeof getv.geometry.getGeodesicArea === "undefined")
                    area_poi.innerHTML="";
                else
                {
                    var square=W.model.venues.getObjectById(v_id).geometry.getGeodesicArea(W.map.getProjectionObject());
                    area_poi.style=(square < minArea)?"color: red;":"color: black;";
                    area_poi.innerHTML="Площадь: " + square.toFixed(2) + " м&#178;" + "<a href='#' id='_modifyArea' title='Горячая клавиша \"Y\"'> (Сделать ~"+minArea+"м&#178) </a>";
                    $('#_modifyArea').click(modifyArea);
                }
            }
        }

        // Production polygons: #d191d6, Beta editor polygons: #c290c6
        if ((poly.getAttribute("fill") == "#d191d6" || poly.getAttribute("fill") == "#c290c6") && poly.getAttribute("stroke-opacity") == 1) {
        var categories   = venue.attributes.categories;
		var colored = false;

        if(colorLandmarks)
        {
              // gas station = orange
              if (categories.indexOf("GAS_STATION") > -1) {
                  poly.setAttribute("fill","#f90");
                  poly.setAttribute("stroke","#f90");
                  colored = true;
              }

              // parking lot = cyan
              else if (categories.indexOf("PARKING_LOT") > -1) {
                  poly.setAttribute("fill","#099");
                  poly.setAttribute("stroke","#0cc");
                  colored = true;
              }

                  // water = blue
                  else if (categories.indexOf("RIVER_STREAM") > -1 ||
                           categories.indexOf("SEA_LAKE_POOL") > -1) {
                      poly.setAttribute("fill","#09f");
                      poly.setAttribute("stroke","#06c");
	                  colored = true;
                  }

                  // park/grass/trees = green
                  else if (categories.indexOf("PARK") > -1 ||
                           categories.indexOf("FARM") > -1 ||
                           categories.indexOf("FOREST_GROVE") > -1 ||
                           categories.indexOf("GOLF_COURSE") > -1) {
                      poly.setAttribute("fill","#4f4");
                      poly.setAttribute("stroke","#6a6");
	                  colored = true;
                  }
        }

        poly.setAttribute("stroke-opacity",0.97);
        poly.setAttribute("stroke-dasharray","none");

        var isNature = 0;
        isNature = ((venue.attributes.categories[0] === "PARKING_LOT")
            || (venue.attributes.categories[0] === "RIVER_STREAM")
            || (venue.attributes.categories[0] === "SEA_LAKE_POOL")
            || (venue.attributes.categories[0] === "PARK")
            || (venue.attributes.categories[0] === "FARM")
            || (venue.attributes.categories[0] === "FOREST_GROVE")
            || (venue.attributes.categories[0] === "GOLF_COURSE")
        );

        // highlight places with place surface area less than _minArea
        if (hiliteSmall && isArea && (W.map.zoom >= 3)
            && (venue.geometry.getGeodesicArea(W.map.getProjectionObject()) < minArea)) {
            poly.setAttribute("fill","#f00");
            poly.setAttribute("stroke","#f00");
        }
        // then highlight places which have no name and not colored
        else if (hiliteNoName && haveNoName && (colored === false) ) {
            poly.setAttribute("fill","#ff8");
            poly.setAttribute("stroke","#cc0");
        }
        // if was yellow and now not yellow, reset
        else if (poly.getAttribute("fill") == "#ff8" && (!hiliteNoName || !haveNoName)) {
            poly.setAttribute("fill","#d191d6");
            poly.setAttribute("stroke","#d191d6");
            poly.setAttribute("stroke-opacity",1);
        }

        // highlight places with linked Google address
        if (hiliteLinked && venue.attributes.externalProviderIDs.length > 0) {
            poly.setAttribute("stroke","#0ff");
            colored = true;
        }
        // highlight places without linked Google address
        else if (hiliteNotLinked && !isRH && venue.attributes.externalProviderIDs.length === 0) {
            poly.setAttribute("stroke","#0ff");
            colored = true;
        }
        // highlight places which have no address
        else if ( hiliteNoAddress && !isNature && haveNoAddress
            && (W.map.zoom >= wmepn_getId('_zoomLevel').value) ) {
            poly.setAttribute("stroke","#0f0");
            poly.setAttribute("stroke-dasharray","4 7");
            colored = true;
        }
		// highlight places which have different name and HN
		else if ( hiliteDifHN && (colored == false) && (map.zoom >= wmepn_getId('_zoomLevel').value) && hasHN && !haveNoName &&
            ((venue.attributes.categories[0] === "OTHER") || (venue.attributes.categories[0] === "PROFESSIONAL_AND_PUBLIC"))
            && ( !(houseNumber == venue.attributes.name.trim() || houseNumber == venue.attributes.name.trim().split(',')[0]) ) )
        {
            poly.setAttribute("stroke","#f00");
            poly.setAttribute("stroke-dasharray","4 7");
            colored = true;
        }
      }
    }
  }

  if (map.getLayersBy("uniqueName", "mapComments").length === 1 && map.getLayersBy("uniqueName", "mapComments")[0].getVisibility())
  {
    for (var mark in W.model.mapComments.objects)
    {
    var comment = W.model.mapComments.getObjectById(mark);
    var poly = wmepn_getId(comment.geometry.id);
    var isPoint = comment.geometry.toString().match(/^POINT/);
    var isArea = comment.geometry.toString().match(/^POLYGON/);
    var isComment = comment.type === "mapComment";
    var trimmedName = comment.attributes.subject;
    var noTrName = (trimmedName.length == 0);
    if(showLockLevel) trimmedName +=  (noTrName ? "" : "\n") + "[L" + (comment.attributes.lockRank+1) + "]";
    if (poly !== null) {
      var haveNoName = noTrName;

        if(showComments && (limitNames == 0 || drawnNames < limitNames)
            && (map.zoom >= wmepn_getId('_zoomLevel').value))
        {
		    var wrappedText = wmepn_wordWrap(trimmedName, 30);
            var commentBody = "";

            if(showAddresses && ( showComments && isComment) )
            {
                // how many words in Comment subject (needed to determine offsetY below)
                var words = wrappedText.replace(/\n/g,' ') + ' ';
                words = words.split(/\s* \s*/).length-1;
                commentBody = comment.attributes.body === "" || comment.attributes.body === "undefined" ? commentBody : wmepn_wordWrap(comment.attributes.body, 30);
                var commentsWords = commentBody.replace(/\n/g,' ') + ' ';
                commentsWords = commentsWords.split(/\s* \s*/).length-1;
            }
            var filterMatched = (!noTrName && doFilter(trimmedName))||(showAddresses && doFilter(commentBody));
            if(showComments && ( (showAreas && isArea) || (!showAreas && !showPoints)) && filterMatched)
            {
                // Add label texts
                var labelFeatures = [];
                var bounds = comment.geometry.bounds;
                var pt = comment.geometry.getCentroid();
                var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, fontColor: '#F0F0F0', pointRadius: 0 });
                labelFeatures.push(textFeature);

                if(showAddresses)
                {
                    var offsetY =  wmepn_getYoffset(words, wrappedText.length);
                    offsetY += wmepn_getYoffset(commentsWords, commentBody.length);
                    var addrFeature = new OpenLayers.Feature.Vector( pt, {labelText: commentBody, style: "italic", pointRadius: 0, yOffset: offsetY } );
                    labelFeatures.push(addrFeature);
                }
                wmepn_NameLayer.addFeatures(labelFeatures);
                drawnNames++;
        	}

            if(showComments && ( (showPoints && isPoint) || (!showAreas && !showPoints) ) && filterMatched )
            {
                // Add label texts
                var labelFeatures = [];
                var pt = new OpenLayers.Geometry.Point(comment.geometry.x, comment.geometry.y);

                var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, fontColor: '#F0F0F0', pointRadius: 0, yOffset: 15 });
                labelFeatures.push(textFeature);

                if(showAddresses)
                {
                    var offsetY =  wmepn_getYoffset(words, wrappedText.length);
                    offsetY += wmepn_getYoffset(commentsWords, commentBody.length);
                    var addrFeature = new OpenLayers.Feature.Vector( pt, {labelText: commentBody, style: "italic", pointRadius: 0, yOffset: offsetY } );
                    labelFeatures.push(addrFeature);
                }

                wmepn_NameLayer.addFeatures(labelFeatures);
                drawnNames++;
            }
        }
    }
  }
  }
  wmepn_getId('_stLandmarkNumber').innerHTML = '<i>' + drawnNames + '</i> ' + I18n.t("wmepn.place_names_and", {count: drawnNames});
  wmepn_getId('_stLandmarkHNNumber').innerHTML = '<i>' + drawnHNs + '</i> ' + I18n.t("wmepn.house_numbers", {count: drawnHNs});
  //map.getLayersBy("name", "Place Names")[0].setZIndex(730);
}

function wmepn_getYoffset (words, length) {

    return (words == 1) ? (-12) : (((words > 1) &&
            (length < 60 )) ? (-15) :
            (length <  90 ) ? (-20) :
            (length < 120 ) ? (-25) :
            (length < 150 ) ? (-30) :
            (length < 180 ) ? (-35) :
            (length < 210 ) ? (-40) :
            (length < 240 ) ? (-45) :
            (length < 270 ) ? (-50) : (-55));
}

var modifyArea = function () {
    var selectorManager = W.selectionManager;
    if (!selectorManager.hasSelectedFeatures()
        || selectorManager.getSelectedFeatures()[0].model.type !== "venue"
        || !selectorManager.getSelectedFeatures()[0].model.isGeometryEditable()) {
        return;
    }

    var requiredArea = parseInt(wmepn_getId('_minArea').value,10) + 5;
    var SelectedLandmark = selectorManager.getSelectedFeatures()[0];
    var oldGeometry = SelectedLandmark.geometry.clone();
    var newGeometry = SelectedLandmark.geometry.clone();
    var centerPT = newGeometry.getCentroid();
    var oldArea = oldGeometry.getGeodesicArea(W.map.getProjectionObject());

    var scale = Math.sqrt(requiredArea/oldArea);
    newGeometry.resize(scale,centerPT);

    var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
    var action = new wazeActionUpdateFeatureGeometry(SelectedLandmark.model, W.model.venues, oldGeometry, newGeometry);
    W.model.actionManager.add(action);

};

function wmepn_toggleOptions () {
  return false;
}

/* helper function */
function wmepn_getId(node) {
  return document.getElementById(node);
}

/* =========================================================================== */

function initialiseLandmarkNames()
{
  // global variables
  wmepn_betaMode = location.hostname.match(/editor-beta.W.com/);
  wmepn_NameLayer = undefined;

    // helper fn
    function getElementsByClassName(classname, node) {
      if(!node) node = document.getElementsByTagName("body")[0];
      var a = [];
      var re = new RegExp('\\b' + classname + '\\b');
      var els = node.getElementsByTagName("*");
      for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
      return a;
    }

  // Some internationalization
  I18n.translations[I18n.locale].wmepn = wmepn_translations[I18n.locale];
  if(wmepn_translations[I18n.locale] === undefined) I18n.translations[I18n.locale].wmepn = wmepn_translations[I18n.locale];
  I18n.translations[I18n.locale].layers.name.__DrawPlaceNames = 'Place Names Rus';

  // add new box to left of the map
  var addon = document.createElement('section');
  var map = W.map;
  var translator="";
  addon.id = "landmarkname-addon";

  if(I18n.locale != I18n.locale)
    translator  = 'title="'+I18n.t("wmepn.translator")+'"';

  //if (navigator.userAgent.match(/Chrome/)) { }
  addon.innerHTML = '<b>'
                  + '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843" target="_blank" ' + translator + '>' + GM_info.script.name + '</a></b> &nbsp; v' + GM_info.script.version;
  if(wmepn_translations[I18n.locale] === undefined)
      addon.innerHTML += ' <small>[<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843&p=1302802#p1302802" target="_blank">translate me!</a>]</small>';


  // highlight landmarks
  var section = document.createElement('p');
  section.style.padding = "8px 16px";
  //section.style.textIndent = "-16px";
  section.id = "nameLandmarks";
section.innerHTML  = '<div title="'+I18n.t("wmepn.enable_script_tooltip")+'"><input type="checkbox" id="_cbLandmarkNamesEnable" /> <b>'+I18n.t("wmepn.enable_script")+'</b></div>'
  					+  '<div title="'+I18n.t("wmepn.color_places_tooltip")+'"><input type="checkbox" id="_cbLandmarkColors" /> <b>'+I18n.t("wmepn.color_places")+'</b></div>'
  					+  '<div title="'+I18n.t("wmepn.highlight_places_tooltip")+'"><input type="checkbox" id="_cbLandmarkHiliteNoName"/> <b>'+I18n.t("wmepn.highlight_places")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.highlight_address_tooltip")+'"><input type="checkbox" id="_cbLandmarkHiliteNoAddress"/> <b>'+I18n.t("wmepn.highlight_address")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.highlight_dif_address_tooltip")+'"><input type="checkbox" id="_cbLandmarkHiliteDifHN"/> <b>'+I18n.t("wmepn.highlight_dif_address")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.highlight_linked_tooltip")+'"><input type="checkbox" id="_cbShowLinked" /> <b>'+I18n.t("wmepn.highlight_linked")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.highlight_not_linked_tooltip")+'"><input type="checkbox" id="_cbShowNotLinked" /> <b>'+I18n.t("wmepn.highlight_not_linked")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.highlight_small_tooltip")+'"><input type="checkbox" id="_cbLandmarkHiliteSmall"/> <b>'+I18n.t("wmepn.highlight_small")+'</b><input id="_minArea" style="width: 40px;"/><b>м&#178;</b></div>'
            +  '<div title="'+I18n.t("wmepn.show_address_tooltip")+'"><input type="checkbox" id="_cbLandmarkShowAddresses"/> <b>'+I18n.t("wmepn.show_address")+'</b></div>'
            +  '<div title="'+I18n.t("wmepn.show_tooltip")+'"><b>'+I18n.t("wmepn.show")+':</b></div>'
  							+ '<div title="'+I18n.t("wmepn.show")+' '+I18n.t("wmepn.option_area")+'" style="padding-left: 20px;"><input type="checkbox" id="_cbShowArea"> '+I18n.t("wmepn.option_area")+'</div>'
  							+ '<div title="'+I18n.t("wmepn.show")+' '+I18n.t("wmepn.option_point")+'" style="padding-left: 20px;"><input type="checkbox" id="_cbShowPoi"> '+I18n.t("wmepn.option_point")+'</div>'
  							+ '<div title="'+I18n.t("wmepn.show")+' '+I18n.t("wmepn.option_residential")+'" style="padding-left: 20px;"><input type="checkbox" id="_cbShowRH"> '+I18n.t("wmepn.option_residential")+'</div>'
                            + '<div title="'+I18n.t("wmepn.show")+' '+I18n.t("wmepn.option_comments")+'" style="padding-left: 20px;"><input type="checkbox" id="_cbShowComment"> '+I18n.t("wmepn.option_comments")+'</div>'
  					+  '<div title="'+I18n.t("wmepn.filter_tooltip")+'"><b>'+I18n.t("wmepn.filter")+':</b><input type="text" id="_inLandmarkNameFilter"/></div>'
                    +  '<div title="'+I18n.t("wmepn.show_locklevel_tooltip")+'"><input type="checkbox" id="_cbLandmarkLockLevel" /> <b>'+I18n.t("wmepn.show_locklevel")+'</b></div>'
  					+  '<div title="'+I18n.t("wmepn.stop_over_tooltip")+'"><b>'+I18n.t("wmepn.stop_over")+'</b> <select id="_seLandmarkLimit">'
  							+ '<option value="0">'+I18n.t("wmepn.option_unlimited")+'</option>'
  							+ '<option value="500">500</option>'
  							+ '<option value="200">200</option>'
  							+ '<option value="100">100</option>'
  							+ '<option value="50">50</option>'
  							+ '<option value="25">25</option>'
  							+ '<option value="10">10</option>'
                            +'</select></div>'
                    +   '<div><small>'+I18n.t("wmepn.showing")+' <span id="_stLandmarkNumber"></span> <span id="_stLandmarkHNNumber"></span></small></div>'
  +  '<div title="'+I18n.t("wmepn.show_zool_tooltip")+'"><b>'+I18n.t("wmepn.show_zool")+'</b><input type="number" id="_zoomLevel"/></div>';
  addon.appendChild(section);

  var userTabs = wmepn_getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-landmarknames" data-toggle="tab">PlaceNames Rus</a>';
  navTabs.appendChild(newtab);

  addon.id = "sidepanel-landmarknames";
  addon.className = "tab-pane";
  tabContent.appendChild(addon);

  // setup onclick handlers for instant update:
    wmepn_getId('_cbLandmarkColors').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkHiliteNoName').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkHiliteNoAddress').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkHiliteDifHN').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkHiliteSmall').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkNamesEnable').onclick = wmepn_resetLandmarks;
    wmepn_getId('_inLandmarkNameFilter').oninput = wmepn_showLandmarkNames;
    wmepn_getId('_cbLandmarkLockLevel').onclick = wmepn_showLandmarkNames;
    wmepn_getId('_seLandmarkLimit').onchange = wmepn_showLandmarkNames;
    wmepn_getId('_zoomLevel').onchange = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkShowAddresses').onclick = wmepn_resetLandmarks;
    wmepn_getId('_minArea').onchange = wmepn_resetLandmarks;
    wmepn_getId('_cbShowArea').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbShowPoi').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbShowRH').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbShowComment').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbShowLinked').onclick    = function(){ if (wmepn_getId('_cbShowLinked').checked) wmepn_getId('_cbShowNotLinked').checked = false; wmepn_resetLandmarks(); };
    wmepn_getId('_cbShowNotLinked').onclick = function(){ if (wmepn_getId('_cbShowNotLinked').checked) wmepn_getId('_cbShowLinked').checked = false; wmepn_resetLandmarks(); };

    // Create PlaceName layer
    var rlayers = map.getLayersBy("uniqueName","__DrawPlaceNames");
    if(rlayers.length == 0) {
        var lname = "Place Names";
        var style = new OpenLayers.Style({
            strokeDashstyle: 'solid',
            strokeColor : "${strokeColor}",
            strokeOpacity: 1.0,
            strokeWidth: "${strokeWidth}",
            fillColor: '#0040FF',
            fillOpacity: 1.0,
            pointRadius: "${pointRadius}",
            label : "${labelText}",
            fontFamily: "Tahoma, Courier New",
            labelOutlineColor: '#FFEEEE',
            labelOutlineWidth: 2,
            labelAlign: 'cm',
            fontColor: "#301130",
            fontOpacity: 1.0,
            fontSize: "11px",
            display: 'block',
            labelYOffset: "${yOffset}",
            fontStyle: "${style}"
        });
        var nameLayer = new OpenLayers.Layer.Vector(lname, {
            displayInLayerSwitcher: true,
            uniqueName: "__DrawPlaceNames",
            shortcutKey: "S+n",
			accelerator: "toggle" + lname.replace(/\s+/g,''),
            styleMap: new OpenLayers.StyleMap(style)
        });
        nameLayer.setVisibility(true);
        //drc_mapLayer1.moveLayerToTop();
        map.addLayer(nameLayer);
        //var zLandmarks = map.getLayersBy("uniqueName", "landmarks")[0].getZIndex();
        //var zPlaceNames = drc_mapLayer1.getZIndex();
        //map.getLayersBy("uniqueName", "landmarks")[0].setZIndex(zPlaceNames);
        //drc_mapLayer1.setZIndex(zLandmarks);
        wmepn_NameLayer = nameLayer;
    }
    else wmepn_NameLayer = rlayers[0];

  // restore saved settings
  if (localStorage.WMELandmarkNamesScript) {
    console.log("WME LandmarkNames: loading options");
    options = JSON.parse(localStorage.WMELandmarkNamesScript);

    wmepn_getId('_cbLandmarkColors').checked   	    = options[1];
    wmepn_getId('_cbLandmarkHiliteNoName').checked  = options[2];
    if(options[3] !== undefined)
        wmepn_getId('_cbShowArea').checked    	    = options[3];
	wmepn_NameLayer.setVisibility(options[4]);
    if(options[5] !== undefined)
        wmepn_getId('_cbLandmarkNamesEnable').checked   = options[5];
    else wmepn_NameLayer.setVisibility(true);
    if(options[6] !== undefined)
        wmepn_getId('_inLandmarkNameFilter').value		= options[6];
    if(options[7] !== undefined)
        wmepn_getId('_cbLandmarkLockLevel').checked     = options[7];
    if(options[8] !== undefined)
        wmepn_getId('_seLandmarkLimit').value     = options[8];
    else
        wmepn_getId('_seLandmarkLimit').value     = 100;
    if(options[9] !== undefined)
        wmepn_getId('_zoomLevel').value		= options[9];
    else
        wmepn_getId('_zoomLevel').value     = 4;
    if(options[10] !== undefined)
        wmepn_getId('_cbLandmarkHiliteSmall').checked = options[10];
    if(options[11] !== undefined)
        wmepn_getId('_cbLandmarkHiliteNoAddress').checked = options[11];
    if(options[12] !== undefined)
        wmepn_getId('_cbLandmarkShowAddresses').checked     = options[12];
    if(options[13] !== undefined)
        wmepn_getId('_cbLandmarkHiliteDifHN').checked = options[13];
    if(options[14] !== undefined)
        wmepn_getId('_minArea').value = options[14];
    else
        wmepn_getId('_minArea').value     = 650;
    if(options[15] !== undefined)
        wmepn_getId('_cbShowPoi').checked    	    = options[15];
    if(options[16] !== undefined)
        wmepn_getId('_cbShowRH').checked    	    = options[16];
    if(options[17] !== undefined)
        wmepn_getId('_cbShowLinked').checked        = options[17];
    if(options[18] !== undefined)
        wmepn_getId('_cbShowNotLinked').checked     = options[18];
    if(options[19] !== undefined)
        wmepn_getId('_cbShowComment').checked    	    = options[19];


  } else {
    wmepn_getId('_cbLandmarkColors').checked = true;
    wmepn_getId('_cbLandmarkHiliteNoName').checked = true;
    wmepn_getId('_cbLandmarkHiliteNoAddress').checked = true;
    wmepn_getId('_cbLandmarkHiliteDifHN').checked = true;
    wmepn_getId('_cbLandmarkHiliteSmall').checked = true;
    wmepn_getId('_cbLandmarkShowAddresses').checked = true;
    wmepn_getId('_cbShowArea').checked = true;
    wmepn_getId('_cbShowPoi').checked  = true;
    wmepn_getId('_cbShowRH').checked   = true;
    wmepn_getId('_cbShowComment').checked   = true;
	wmepn_NameLayer.setVisibility(true);
    wmepn_getId('_cbLandmarkNamesEnable').checked = true;
    wmepn_getId('_cbLandmarkLockLevel').checked = false;
    wmepn_getId('_cbShowLinked').checked = false;
    wmepn_getId('_cbShowNotLinked').checked = false;
    wmepn_getId('_seLandmarkLimit').value = 100;
    wmepn_getId('_zoomLevel').value = 4;
    wmepn_getId('_minArea').value = 650;
  }

    var layerItem = '<li><div class="controls-container toggler"><input class="layer-switcher-item_placenames_rus toggle" id="layer-switcher-item_placenames_rus" type="checkbox"><label for="layer-switcher-item_placenames_rus"><span class="label-text">PlaceNames Rus</span></label></div></li>';
    $("#layer-switcher-group_places").parent().parent().children("ul.children").append(layerItem);
    $("#layer-switcher-item_placenames_rus").click(function() { wmepn_NameLayer.setVisibility(!wmepn_NameLayer.getVisibility()); });
    $("#layer-switcher-item_placenames_rus").prop("checked", wmepn_NameLayer.getVisibility());

  if (typeof W.model.venues == "undefined") {
    wmepn_getId('_cbLandmarkColors').checked = false;
    wmepn_getId('_cbLandmarkHiliteNoName').checked = false;
    wmepn_getId('_cbLandmarkHiliteNoAddress').checked = false;
    wmepn_getId('_cbLandmarkHiliteDifHN').checked = false;
    wmepn_getId('_cbLandmarkHiliteSmall').checked = false;
    wmepn_getId('_cbLandmarkShowAddresses').checked = false;
    wmepn_getId('_cbLandmarkColors').disabled = true;
    wmepn_getId('_cbLandmarkHiliteNoName').disabled = true;
    wmepn_getId('_cbLandmarkHiliteNoAddress').disabled = true;
    wmepn_getId('_cbLandmarkHiliteDifHN').disabled = true;
    wmepn_getId('_cbLandmarkHiliteSmall').checked = true;
    wmepn_getId('_cbShowArea').checked = true;
    wmepn_getId('_cbShowPoi').checked  = true;
    wmepn_getId('_cbShowRH').checked   = true;
    wmepn_getId('_cbShowComment').checked   = true;
    wmepn_getId('_cbLandmarkLockLevel').disabled = true;
    wmepn_getId('_cbShowLinked').disabled = true;
    wmepn_getId('_cbShowNotLinked').disabled = true;
    wmepn_getId('_seLandmarkLimit').disabled = true;
    wmepn_getId('_cbLandmarkShowAddresses').checked = true;
  }

  // overload the WME exit function
  wmepn_saveLandmarkNamesOptions = function() {
    if (localStorage) {
      console.log("WME LandmarkNames: saving options");
      var options = [];

      // preserve previous options which may get lost after logout
      if (localStorage.WMELandmarkNamesScript)
          options = JSON.parse(localStorage.WMELandmarkNamesScript);

        options[1] = wmepn_getId('_cbLandmarkColors').checked;
        options[2] = wmepn_getId('_cbLandmarkHiliteNoName').checked;
        options[3] = wmepn_getId('_cbShowArea').checked;
        options[4] = wmepn_NameLayer.getVisibility();
        options[5] = wmepn_getId('_cbLandmarkNamesEnable').checked;
        options[6] = wmepn_getId('_inLandmarkNameFilter').value;
        options[7] = wmepn_getId('_cbLandmarkLockLevel').checked;
        options[8] = wmepn_getId('_seLandmarkLimit').value;
        options[9] = wmepn_getId('_zoomLevel').value;
        options[10] = wmepn_getId('_cbLandmarkHiliteSmall').checked;
        options[11] = wmepn_getId('_cbLandmarkHiliteNoAddress').checked;
        options[12] = wmepn_getId('_cbLandmarkShowAddresses').checked;
        options[13] = wmepn_getId('_cbLandmarkHiliteDifHN').checked;
        options[14] = wmepn_getId('_minArea').value;
        options[15] = wmepn_getId('_cbShowPoi').checked;
        options[16] = wmepn_getId('_cbShowRH').checked;
        options[17] = wmepn_getId('_cbShowLinked').checked;
        options[18] = wmepn_getId('_cbShowNotLinked').checked;
        options[19] = wmepn_getId('_cbShowComment').checked;

      localStorage.WMELandmarkNamesScript = JSON.stringify(options);
    }
  };
  window.addEventListener("beforeunload", wmepn_saveLandmarkNamesOptions, false);

  // begin periodic updates
  //window.setInterval(wmepn_showLandmarkNames,500);

  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener("load", function(e) {
    var mapProblems = wmepn_getId('map-problems-explanation');
    if (mapProblems !== null) mapProblems.style.display = "none";
  });

  // register some events...
  map.events.register("zoomend", null, wmepn_showLandmarkNames);
  map.events.register("changelayer", null, wmepn_showLandmarkNames);
  map.events.register("mouseout", null, wmepn_showLandmarkNames);
  W.selectionManager.events.register("selectionchanged", null, wmepn_showLandmarkNames);

  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_PlaceNames_enable = "Включить/выключить скрипт PlaceNames Russian";
  W.accelerators.addAction("WME_PlaceNames_enable", {group: 'default'});
  W.accelerators.events.register("WME_PlaceNames_enable", null, enablePlaceNames);
  W.accelerators._registerShortcuts({ 'S+n' : "WME_PlaceNames_enable"});

  I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_PlaceNames_increase = "Увеличить площадь POI до "+wmepn_getId('_minArea').value.toString()+"м² (минимальная площадь для отображения в приложении)";
  W.accelerators.addAction("WME_PlaceNames_increase", {group: 'default'});
  W.accelerators.events.register("WME_PlaceNames_increase", null, modifyArea);
  W.accelerators._registerShortcuts({ 'y' : "WME_PlaceNames_increase"});
}

var enablePlaceNames = function () {
    wmepn_getId('_cbLandmarkNamesEnable').click();
};


/* engage! =================================================================== */
bootstrapLandmarkNames();

/* end ======================================================================= */