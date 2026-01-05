// ==UserScript==
// @name        WME OpenMaps
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Add additional maps that are released as open data to the Waze Map Editor
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/editor*
// @include     https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user*
// @exclude     https://www.waze.com/*/user*
// @connect     wallonie.be
// @connect     geo.api.vlaanderen.be
// @connect     opendata.apps.mow.vlaanderen.be
// @connect     geoserver.gis.cloud.mow.vlaanderen.be
// @connect     www.mercator.vlaanderen.be
// @connect     irisnet.be
// @connect     data.mobility.brussels
// @connect     ccff02.minfin.fgov.be
// @connect     eservices.minfin.fgov.be
// @connect     nationaalgeoregister.nl
// @connect     geo.rijkswaterstaat.nl
// @connect     rj.gov.br
// @connect     wvgis.wvu.edu
// @connect     nsdig2gapps.ncsi.gov.om
// @connect     vginmaps.vdem.virginia.gov
// @connect     tnmap.tn.gov
// @connect     apps.pasda.psu.edu
// @connect     services.nationalmap.gov
// @connect     imagery.nationalmap.gov
// @connect     service.pdok.nl
// @connect     geoportal.dgu.hr
// @connect     di-ingov.img.arcgis.com
// @connect     mdgeodata.md.gov
// @connect     wmts1.geoportail.lu
// @connect     *
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAMAAACfBSJ0AAABuVBMVEVHcEwOdZgIbZYNcpUPdJgJcZcLcZYXb5UOcJcOc5oNcpcOdZoPdZkLcpcKcJYLbpRHnKkrhKMohaIRcJQTbpEYtdYHg5Cl2sBrxpqJwMcvuXaT17VUu4k4uHsPcZoHgq4gomWZ17is3MVq0KFJvISe2Lw0vnqA06pEw4UjttdVyZGM1bKG1K4tsXJXwo1hxZRh0Zo6x4Ijq2k7wIBX0JRFtskLfqwNiJRBuoALipt6yqN0x6BOwolKx4px0KAJhaYVnrUMdqK13stSwb59vsmS0rMIg5o1tHUcjZovwapByohfypcxuNa/4tMfq8aCzKhNzY07uNFErLwqq24RlaqUy8Rfv5GMz64vtc05obEalIwlmKk2mqnL6dovk6AZoHYat8pVn68NkKN40aYlsZJos79fq7N+vMN1tbqTx9AZj6GAyL0pqoBGkKsTiLI8q4u31tg1q78no7ghurhexrVzv8VWpLtpq7iizsqlydeaydpxtccvhKMWf4QXmYEtv52IycRln7N0xbQUfpI0wo9Dwbl7rL9LorKu0dJOyaCDzK9jvLUVmJobo6Ygd5pVsKgonpEUe6SJu7z3kfFBAAAAE3RSTlMAwj7t2TFmBxIgp0+aeou4/vTT3cYvbAAABk5JREFUSMeNlvk/Yl0YwKU9KdxbKiUjE7JHpUFJiiTbiIQWZZkWoVLz2veMdfzF73POvRpmmPG9fW798Hx7nuece+45JSVvwuVyeXw+nwff3JIPAgZHWFW5j/jJYojKeB9ReezyqsCafGt5eQvxXZ5LVgrK+P9QeaXCZC6/vOzxLH9/plCQX1Vx+H/TSoUVG4WtQsED2f4r8n15OR+u4vDebay8Kpf3bG2B5SnkvxX5Dtk9T0lB6dsaX1DxlC9AzPJQ3it/xlvID3k88PGeVHHe0tiM8JNc/u2b3OuVrxc1eR6cIUz+slL0Rmusk8vL4eH19bx3HTFMsX5cT1n1Q/X1T5XCP7JhbW9jY2N9HT7Dx17K83rrX/D0e0YeI3x5ube3kQNxL7uXrYYgbxbsavSr+pnPG5Xlrzxh8iS3t5rL5VYRx9X1IBwff6aCqTvmU471clQ5lScnq7m1NfA2sqvx6ur4MYr8FY5xfHI4npIM3ouhTJ7s7q4BufhpdjXr9WaPqXh00RLF/Ml++a/53g/v7obD4bW11Xh8NZ6NZx10dM2nGoBWHPPz8z82ksVK2SzwQHu42l07jcdr4vE4Dke01LQg5jGT85Onu8l7EZdOd5/cvaqouLranblxOH4zWlpbWhGTFF/6wvssNvV8se6ToIF4enNT42hxUNFUeGtja2PjZCPlIPrW9gkOTlhG3CcXlioqFh4c8z+A1qIACiLSGIlQDkIWIBhoUXGFxP3SUmBpaeHL/I8bg/30FMXasZDJRDIRwNKHrj5ZnwxIkQQqlMckfy4GkPdwM2MwTGfsINqnDfZIJGPXRDIWoM9ikVHMyeZSZ7hQNkEaY4FA4AHVcWM32O2nGo3dbp+2WzSGjEWDkGlksg645gAleAKYew5BqJ2jgYc+3EIGCXaURKOxWOwXIHXKOt1udweAtd6Uk2CBJyJq1VL/HN10Znx8enzcgLNoOi8MnQhKa0coe1WPVv8Zv4QrIGxqaUpG9WyRXYz7fOPNvovrThp3T4/OrdPpsAVawmT0n7FLuAzw/Mq5Dtx2h8x9ce2+8Pl8F5TVA+h0UzpdP6KhV6VKONVnZ6UlXBZhsz5C4e1zqAV3BxTl1l1f9xSZmpoaGBgACVmqkTa/upYow95sCmlQB4g6RI+O8lyua8oaaGpq6u5W3SVGRkYSK8/eonJO2a4Er7+9H2lTuqm0C4QplyTtch25XOcgdWu10cHbRNtIW+wMeWLkAdB0e38/1IP+fsoVGgNvDKx0SCIJHZ1rtVrV4Ozs7WHQb8XjAuNpTSFRiVvH2sDYWDo9hunqAk8iOQLtbnB2xew/dBrRPJSUw/w9gtWgbAD6mxAQnw6dY6vrCGmStFYRHcRe0Gw8ZPLRciDUoylaa2ii6TqXuLq6ippEEqU96aH/NojeMXx4Pq3+3oZnsAWkQ+juojVJGrzZWbMpGDSbDtCK5zFIeGCk/scUTFBvU283Rdd5+ujchXuTNDc3T0xEo1FIZ5IG9QcwnOg1AQ06pSbzSqoX0U2b2vNQKB2itWbfxMTdHSpTajo8YOIXBVpIVqnUvIJEFYgqNFcUaWyNwzM7sbOD25OqbaQQv0J5YigUJ0yoaGhLcURZ49M+3/b2zuJszCR1GglcJn7BECihyUx7WoVKoVUA0RDWpqenDQbkxUZNTkjHoPdsPoNEHUrN/hGMYkSheKUZDIaZme0F5FkhXXH75BB4SKXmBC0q2uCKhqBKH6WBt7C0CNpmLSkuHhF4AhJXKvWPtBVJTCBgJVIaeIHR0c2fJLPs5a4JlSLx67Olb4tib2J7ewZDaUaSeLXlcpiU+JVCr2/TJwaBnZ2dbWQuIC22uUmQjNfHERGBRdpCBO9ocQGkpQDWSJLeG34hQKLar6/T0wRhsSVuZxcxUGNs00iQzD/PMCDC4ATrAJDrguaVQ33wdiUWi40iNmFI3tJgj2eSpM1cR+OER19/aDZhzNZNYy1JsN4+MXFYJEkcUFoQBjeIblKp02lVG22QTPze2Y4tgJRYPLQ6nU6kOK1WNbZIVvn7Z0kuR0yQB4DNaFQjjEajzUZAGUwh+68HUD5HwCQgkCRqMfgnwRKV/vPMyy8tF4OKZRJ9s4Qc9ocO2Vw+u4wjEogZYrFAxCnl80o+DpznMe8l+h9u1SIwib9KHQAAAABJRU5ErkJggg==
// @supportURL  https://github.com/Glodenox/wme-om/issues
// @version     3.2.35
// @require     https://bowercdn.net/c/html.sortable-0.4.4/dist/html.sortable.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13334/WME%20OpenMaps.user.js
// @updateURL https://update.greasyfork.org/scripts/13334/WME%20OpenMaps.meta.js
// ==/UserScript==

/* global W, I18n, sortable, OpenLayers, Proj4js, $ */

var styleElement;

async function onWmeReady() {
  if (typeof OpenLayers == 'undefined') {
    log('WME Ready, but OpenLayers is still undefined');
    setTimeout(onWmeReady, 300);
    return;
  }
  //#region Set up translations
  var translations = {
    en: {
      tab_title: 'Open Maps',
      maps_title: 'Active Maps',
      no_local_maps: 'No maps found for this area',
      hide_tooltips: 'Hide help',
      show_tooltips: 'Show help',
      expand: 'Click to expand',
      collapse: 'Click to collapse',
      hideshow_layer: 'Hide/Show map',
      query_window_title: 'Map Location Query',
      query_window_loading: 'Retrieving information from map service...',
      query_window_switch: 'Toggle between the processed and the original data',
      query_window_query: 'Perform this query again elsewhere on the map',
      query_empty_response: 'No response received from map service at this location. Perhaps try somewhere else or try querying another layer?',
      query_empty_response_advice: 'ℹ️ If this issue persists, you may want to check whether the page has a zoom applied to it, as this can break querying. You can press {hotkey} to reset the zoom.',
      query_table_property: 'Property',
      query_table_value: 'Value',
      retrieving_error: 'Retrieving error...',
      query_layer: 'Query a certain location of this map for more information by clicking somewhere on the map',
      external_link_tooltip: 'Show this location in this map\'s viewer',
      edit_layer: 'Edit map',
      remove_layer: 'Remove map',
      layer_out_of_range: 'Map might not display at the current zoom level',
      satellite_imagery: 'Display satellite imagery',
      select_map: 'Select a map to add',
      opacity_label: 'Opacity',
      opacity_label_tooltip: 'Adjust how transparant the layer is',
      transparent_label: 'Transparent',
      transparent_label_tooltip: 'Make the map background transparent',
      map_improvement_label: 'Improve map display',
      map_improvement_label_tooltip: 'Apply several improvements to the received map tiles',
      map_layers_title: 'Map layers',
      errors: {
        network: 'Network error',
        network_description: 'Received the following status code when retrieving information: ',
        see_console: 'See web console for more details',
        timeout: 'Timeout',
        timeout_description: 'Retrieving response took more than 10s, probably network issue',
        parse_fail: 'Could not parse error message'
      },
      areas: {
        BE: 'Belgium',
        BR: 'Brazil',
        LU: 'Luxembourg',
        NL: 'The Netherlands',
        OM: 'Oman',
        US: 'United States',
        HR: 'Croatia'
      },
      update: {
        message: 'WME Open Maps has been updated! Changelog:',
        v2_3_0: 'Complete rework of the userscript\n- Display multiple maps at the same time\n- Make it possible to query map layers',
        v2_3_1: '- Fixes loading and saving of map state\n- Fixed some bugs concerning map ordering\n- Gray background added to map loading indicator\n- Adjusted BAG map queryability',
        v2_3_2: '- Fixes bug where removing a map also internally removed the maps below\n- Layer querying will only now only take place on visible queryable layers\n- Small changes to boundary and querying options in some maps',
        v2_3_3: '- Fixes to map layer reordering',
        v2_3_4: '- Small UI improvements and internal code refactoring',
        v2_3_5: '- Slightly improved map query response handling\n- Fixed TamperMonkey notices about accessing external resources',
        v2_3_6: '- Fix behaviour on WME beta\n- Group maps by country\n- Add Hectopunten map for The Netherlands',
        v2_3_7: '- Fixed map layer sorting\n- Defunct layer cleanup\n- Add Wegenregister map for Belgium',
        v2_3_8: '- Added indication for unsupported zoom levels\n- Added new layer to the PDOK map in the Netherlands',
        v2_3_9: '- Support new URL for WME beta',
        v2_3_10: '- Updated layers for GBO Provincies satellite imagery',
        v2_3_11: '- Bug fix for WME beta that caused the script to halt\n(layer drawer will be adjusted later on)',
        v2_4_0: '- Support new layer drawer\n- Updated Orthomozaïek Vl. Tijdsreeksen to default to 2016\n- Added map with administrative borders for Flanders',
        v2_5_0: '- Restyling and rework of query result window\n- Several layer preference and location fixes',
        v2_5_1: '- Allow minimizing of query result window\n- You can now see the original data as well',
        v2_5_2: '- Queries can now be repeated from their results window\n- Query results ordering has been improved\n- Query results display better within house number editing mode',
        v2_6_0: '- Added basic map for Rio de Janeiro\n- Improved translations while adding support for Portuguese',
        v2_6_1: '- Fixed PICC map as some road layers were renamed',
        v2_6_2: '- Added new satellite source for Flanders, Belgium',
        v2_7_0: '- Improve UI in various locations\n- Provide links to external map viewers\n- Allow hiding of help messages',
        v2_7_1: '- Bugfix: tooltips hiding edge case solved\n- Bugfix: Wrong indication of missing map data at certain zoom levels',
        v2_7_2: '- Fix text overflow in layer menu\n- Fix script activation on missing trailing slash in URL\n- Changed map query icon to pointing hand',
        v2_7_3: '- Internal fix for beta (hasUser function was removed)',
        v2_7_4: '- Recover from changing distance unit\n- Updated Orthofotomozaïek Tijdsreeksen map (Belgium)',
        v2_7_5: '- Added new CRAB Adrespunten map\n- Fixed tooltips being partially covered in new layout\n- Attempt at fixing maps invisible at zoom 100%\n- Recover layers menu when using the events mode',
        v2_7_6: '- Fix BAG map constraints\n- Fix opacity slider that was stuck at 100%',
        v2_7_7: '- Fix an internal issue that would otherwise pop up in two months',
        v2_8_0: '- Adjust query window location\n- Replace GBO Provincies map with PDOK\n- Remove unsafeWindow code',
        v2_8_1: '- Fixed Hectopunten map (NL)\n- Added Kadastrale Kaart (NL)\n- Removed deprecated BGT map (NL)',
        v2_8_2: '- Added Ortho Vl. 2013-2015 Grootschalig (BE)\n- Added Snelheidsregimes en referentiepunten AWV (BE)',
        v2_8_3: '- Removed Waze April Fools button\n- Added N23 Westfrisiaweg map (NL)',
        v2_8_4: '- Added Administrative Borders Map (BE)',
        v2_8_5: '- Updated CIRB map (BE)',
        v2_8_6: '- Added GIPOD Actueel (BE)',
        v2_8_7: '- Updated Orthomozaïek Vlaanderen (BE)',
        v2_8_8: '- Added Orthophotos 2016 and Réseau routier régional (BE)',
        v3_0_0: '- Added support for new map types\n- Adjusted to new layer menu layout',
        v3_0_1: '- Revert BAG map (NL)',
        v3_0_2: '- Reverted release 3.0 as there were too many breaking bugs',
        v3_0_3: '- Adjusted to new layer menu layout\n- Allow proper removal of broken map layers',
        v3_0_4: '- Fixes for recent WME update\n- Fixed map loading progress bar',
        v3_0_5: '- Added West Virginia Leaves Off map (US)\n- Added Maximumsnelheden map (NL)',
        v3_0_6: '- Added Verkeersborden en Afgeleide Snelheidslimieten maps (BE)\n- Fixed Snelheidsregimes en referentiepunten AWV (BE)',
        v3_0_7: '- Several UI fixes\n- Updated West Virginia Leaves Off map (US)',
        v3_1_0: '- Added Oman map\n- Added various graphical improvements\n- Improved layout\n- Updated/fixed various other maps',
        v3_1_1: '- Hide blank map tiles\n- Various minor layout changes and bugfixes',
        v3_1_2: '- Small performance improvements',
        v3_1_3: '- Added a couple of maps for Brussels (BE)',
        v3_1_4: '- Added traffic signs map for Flanders (BE)',
        v3_1_5: '- Enabled some extra layers by default for Wegenregister map (BE)\n- Improvements for latest WME version',
        v3_1_6: '- Upgrade BAG map and fix Kadastrale kaart map (NL)',
        v3_1_7: '- Added USDA NAIP map',
        v3_1_8: '- Corrected WV Leaves Off layers and added transparency to WV Leaves Off\n- Added more recent Orthophoto maps for Wallonia (BE)',
        v3_1_9: '- WV Leaves Off layers updated\n- Renamed some layers for Brussels',
        v3_1_10: '- WV Leaves Off layers updated\n- Fixed several Brussels maps',
        v3_1_11: '- Added Cadastral Borders map (BE)',
        v3_1_12: '- Added aerial imagery of Virginia (US)\n- Updated PICC and Brussels Future speed limits maps (BE)\n- Updated Oman National Basemap maps',
        v3_1_13: '- Added aerial imagery of Tennessee (US)',
        v3_1_14: '- WV Leaves Off layers updated (US)',
        v3_1_15: '- Fix for upcoming WME version',
        v3_1_16: '- Move Virginia map to new hosting location (US)',
        v3_1_17: '- Added aerial imagery of Pennsylvania (US)\n- Tennessee map bounding box correction (US)',
        v3_1_18: '- Added NAIP+ imagery for US territories, Alaska, and Hawaii\n- Added gray pixel tracing for Oman maps',
        v3_1_19: '- Fixed Luchtfoto (NL) by using PDOK directly',
        v3_1_20: '- Adjustments for WME v2.83',
        v3_1_21: '- Updated BAG (NL)\n- Updated luchtfoto (NL)',
        v3_1_22: '- WV Leaves Off layers updated (US)',
        v3_1_23: '- Updated for new WME layout',
        v3_1_24: '- Added North Carolina NC One Map (US)',
        v3_1_25: '- Migrated Flanders map services to new endpoint (BE)\n- Updated PDOK Luchtbeelden (NL)',
        v3_1_26: '- Updated for new WME version',
        v3_2_1: '- Adjust layout for new WME',
        v3_2_2: '- WV Leaves Off layers updated (US)',
        v3_2_3: '- Migrate Maximumsnelheden map (NL)',
        v3_2_4: '- Replace NAIP with NAIP+ map (US)',
        v3_2_5: '- Migrate to new Waze API for creating tabs',
        v3_2_6: '- WV Leaves Off layers updated (US)',
        v3_2_7: '- PICC map layers updated (BE)',
        v3_2_8: '- WV Leaves Off layers updated (US)',
        v3_2_9: '- Cadastral borders map replaced (BE)',
        v3_2_10: '- Fixed spacing issue in query window results\n- Added VLAIO map (BE)',
        v3_2_11: '- Added Publieke oplaadpunten map (BE)',
        v3_2_12: '- Take into account the Additional imagery map layers',
        v3_2_13: '- Replace Adrespunten map with Adressenregister (BE)\n- Fix Maximumsnelheden query results (NL)',
        v3_2_14: '- Fix Nationaal Wegen Bestand map and removed duplicate Hectopunten map (NL)',
        v3_2_15: '- Migrate GIPOD to new endpoint with extra map layers (BE)',
        v3_2_16: '- Block duplicate map adding (to be supported in the future)\n- Migrate and update Weggegevens and Kadastrale Kaart map layers (NL)',
        v3_2_17: '- Added maps for Croatia (HR)',
        v3_2_18: '- Fix Brussels Ortho map location (BE)',
        v3_2_19: '- Prepare for changes in WME beta',
        v3_2_20: '- Fix map retrieval breakage due to unexpected changes',
        v3_2_21: '- Fix WV Leaves off and USGS NAIP+ layers (US)',
        v3_2_22: '- Added IndianaMap (US)',
        v3_2_23: '- Fix Virginia Aerial Imagery map (US)\n- Added advice on what to do if querying never gives a result.',
        v3_2_24: '- WV Leaves Off layers updated (US)',
        v3_2_25: '- IndianaMap updated (US)',
        v3_2_26: '- IndianaMap updated (US)\n- WV Leaves Off layers updated (US)',
        v3_2_27: '- Updated Yearly Orthomaps (BE and NL)',
        v3_2_28: '- Fixed CIRB map (BE)',
        v3_2_29: '- Added Maryland iMAP (US)',
        v3_2_30: '- Added Luxembourg maps (LU)',
        v3_2_31: '- Fixed Brussels maps (BE)',
        v3_2_32: '- WV Leaves Off layers updated (US)',
        v3_2_33: '- Fixed Luchtfoto 2025 map layers (NL)',
        v3_2_34: '- Fixed broken map layer reordering',
        v3_2_35: '- WV Leaves Off layers updated (US)'
      }
    },
    nl: {
      tab_title: 'Open Maps',
      maps_title: 'Actieve kaarten',
      no_local_maps: 'Geen lokale kaarten gevonden',
      map_already_selected: 'Deze kaart is al toegevoegd',
      hide_tooltips: 'Hulp verbergen',
      show_tooltips: 'Hulp weergeven',
      expand: 'Klik om uit te breiden',
      collapse: 'Klik om te verbergen',
      hideshow_layer: 'Verberg/Toon kaart',
      query_window_title: 'Kaartlocatie doorzoeken',
      query_window_loading: 'Informatie aan het opvragen bij kaartdienst...',
      query_window_switch: 'Wissel tussen de verwerkte en onbewerkte gegevens',
      query_window_query: 'Voeg deze opvraging elders op de kaart opnieuw uit',
      query_empty_response: 'Geen antwoord ontvangen van de kaartdienst op deze locatie. Misschien kan je een andere locatie proberen of een andere laag bevragen?',
      query_empty_response_advice: 'ℹ️ Als dit onverwacht blijft gebeuren, kan je best eens kijken of er toevallig een zoom ingesteld staat op de pagina, want dit kan het opvraagsysteem breken. Je kan {hotkey} gebruiken om de zoom te resetten.',
      query_table_property: 'Eigenschap',
      query_table_value: 'Waarde',
      retrieving_error: 'Fout aan het ophalen...',
      query_layer: 'Doorzoek een bepaalde locatie op deze kaart voor meer informatie door ergens op de kaart te klikken',
      edit_layer: 'Pas de kaart aan',
      remove_layer: 'Verwijder kaart',
      layer_out_of_range: 'Deze kaart wordt mogelijk niet weergegeven op dit zoomniveau',
      satellite_imagery: 'Geef satellietbeelden weer',
      select_map: 'Selecteer een kaart om toe te voegen',
      opacity_label: 'Doorzichtigheid',
      opacity_label_tooltip: 'Wijzig de doorzichtigheid van de kaart',
      transparent_label: 'Transparent',
      transparent_label_tooltip: 'Maak de achtergrond van de kaart transparent',
      map_improvement_label: 'Kaartweergave verbeteren',
      map_improvement_label_tooltip: 'Pas allerhande verbeteringen toe op de kaarttegels',
      map_layers_title: 'Kaartlagen',
      errors: {
        network: 'Networkfout',
        network_description: 'Bij het opvragen van informatie werd de volgende statuscode ontvangen: ',
        see_console: 'Bekijk de browserconsole voor meer informatie',
        timeout: 'Time-out',
        timeout_description: 'Antwoord verkrijgen duurde langer dan 10 seconden, waarschijnlijk netwerkprobleem',
        parse_fail: 'Kan foutmelding niet verwerken'
      },
      areas: {
        BE: 'België',
        BR: 'Brazilië',
        LU: 'Luxemburg',
        NL: 'Nederland',
        OM: 'Oman',
        US: 'Verenigde Staten',
        HR: 'Kroatië'
      },
      update: {
        message: 'Nieuwe versie van WME Open Maps geïnstalleerd! Veranderingen:',
        v2_3_0: 'Complete herwerking van het userscript\n- Geef meerdere kaarten tegelijk weer\n- Maak het mogelijk om kaarten te doorzoeken',
        v2_3_1: '- Het inladen en opslagen van de kaarten is opgelost\n- Enkele bugs geplet rond het ordenen van kaarten\n- Een grijze achtergrond toegevoegd aan de laadindicator voor kaarten\n- De doorzoakbaarheid van de BAG-kaart is aangepast',
        v2_3_2: '- Probleem opgelost waarbij het verwijderen van een kaart alle onderliggende kaarten ook verwijderde\n- Het bevragen van een kaart gebeurt nu enkel op zichtbare bevraagbare lagen\n- Kleine veranderingen aan de grenzen en bevragingsinstellingen van sommige kaarten',
        v2_3_3: '- Het verplaatsen van lagen van een kaart is hersteld',
        v2_3_4: '- Kleine veranderingen aan de UI en interne herwerking van code',
        v2_3_5: '- Licht verbeterde verwerking van kaartopzoekingen\n- Probleem opgelost met TamperMonkey-meldingen over het gebruik van externe bronnen',
        v2_3_6: '- Werking op WME beta verbeterd\n- Groupeer kaarten per land\n- Toevoeging van Hectopuntenkaart in Nederland',
        v2_3_7: '- Sorteren van kaartlagen hersteld\n- Opschonen van onbestaande kaartlagen\n- Wegenregister toegevoegd voor België',
        v2_3_8: '- Aanduiding toegevoegd voor niet ondersteunde zoomniveaus\n- Nieuwe laag toegevoegd aan de PDOK-kaart in Nederland',
        v2_3_9: '- Ondersteun de nieuwe URL voor de WME beta',
        v2_3_10: '- Kaartlagen van GBO Provincies vernieuwd',
        v2_3_11: '- Bugfix voor de WME beta waarbij de uitvoering van het script stopte\n(de toevoeging van de lagen in het nieuwe menu volgt later)',
        v2_4_0: '- Ondersteuning voor nieuwe laagselector\n- Orthomozaïek Vl. Tijdsreeksen aangepast om standaard de kaart van 2016 te tonen\n- Kaart met administratieve grenzen van Vlaanderen toegevoegd',
        v2_5_0: '- Het venster met zoekresultaten werd vernieuwd\n- De locaties en voorkeuren voor meerdere kaarten werden bijgewerkt',
        v2_5_1: '- Laat het minimaliseren van zoekresultaten toe\n- Je kan nu ook de originele data zien in plaats van de verwerkte data',
        v2_5_2: '- Je kan nu een nieuwe zoekopdracht starten vanuit het resultatenscherm\n- De volgorde van de zoekresultaten werd verbeterd\n- Zoekresultaten worden nu beter weergegeven tijdens het aanpassen van huisnummers',
        v2_6_0: '- Basiskaart toegevoegd voor Rio de Janeiro\n- Vertalingen verbeterd tijdens het toevoegen van het Portugees',
        v2_6_1: '- PICC kaart voor Wallonië bijgewerkt omdat de kaartlaag met straatnamen hernoemd werd',
        v2_6_2: '- Nieuwe mapdienst voor satellietbeelden in Vlaanderen en Brussel toegevoegd',
        v2_7_0: '- Verschillende verbeteringen aan de interface\n- Toegang tot de externe website van een kaart\n- Mogelijkheid tot verbergen van hulpberichten',
        v2_7_1: '- Bugfix: verbergen van tooltips werkte soms niet goed\n- Bugfix: foutieve aanduiding van probleem weergave op bepaalde zoomniveaus',
        v2_7_2: '- Verbeterde weergave voor te lange tekst in laagselectiemenu\n- Probleem met scriptactivering opgelost wanneer er geen schuine streep in de URL staat\n- Symbool voor map query aangepast naar wijsvinger',
        v2_7_3: '- Interne bugfix voor beta (hasUser functie werd verwijderd)',
        v2_7_4: '- Herstel van een verandering van afstandseenheid\n- Orthofotomozaïek Tijdsreeksen bijgewerkt (België)',
        v2_7_5: '- Nieuwe CRAB Adrespunten kaart\n- Het gedeeltelijk verbergen van tooltips in de nieuwe layout werd opgelost\n- Poging om probleem van onzichtbare kaart bij 100% zichtbaarheid op te lossen\n- Genereer laagmenu opnieuw bij gebruik van evenementmodus',
        v2_7_6: '- Gebied van BAG kaart bijstellen\n- De doorzichtigheid van kaarten zat vast op 100%',
        v2_7_7: '- Een intern probleem opgelost dat over 2 maanden zichtbaar zou worden',
        v2_8_0: '- Locatie van zoekvenster aangepast\n- GBO Provincies kaart werd vervangen door PDOK\n- Code met unsafeWindow verwijderd',
        v2_8_1: '- Hectopunten kaart hersteld (NL)\n- Kadastrale Kaart toegevoegd (NL)\n- BGT kaart verwijderd (NL)',
        v2_8_2: '- Kaart Ortho Vl. 2013-2015 Grootschalig toegevoegd (BE)\n- Kaart Snelheidsregimes en referentiepunten AWV toegevoegd (BE)',
        v2_8_3: '- 1 Aprilgrap van Waze verwijderd\n- N23 Westfrisiaweg kaart toegevoegd (NL)',
        v2_8_4: '- Kaart Administrative Grenzen toegevoegd (BE)',
        v2_8_5: '- CIRB kaart geüpdatet (BE)',
        v2_8_6: '- GIPOD Actueel toegevoegd (BE)',
        v2_8_7: '- Orthomozaïek Vlaanderen bijgewerkt (BE)',
        v2_8_8: '- Orthophotos 2016 en Réseau routier régional toegevoegd (BE)',
        v3_0_0: '- Ondersteuning voor nieuwe maptypes\n- Ondersteunen nieuwe layer menu layout',
        v3_0_1: '- Aanpassingen aan BAG-kaart ongedaan gemaakt (NL)',
        v3_0_2: '- Reverted release 3.0 as there were too many breaking bugs',
        v3_0_3: '- Ondersteunen nieuwe layer menu layout\n- Verwijderen van defecte kaartlagen mogelijk gemaakt',
        v3_0_4: '- Correctie aanpassingen laatste WME update\n- Laadbalken voor inladen kaarttegels hersteld',
        v3_0_5: '- West Virginia Leaves Off kaart toegevoegd (US)\n- Maximumsnelhedenkaart toegevoegd (NL)',
        v3_0_6: '- Verkeersborden en Afgeleide Snelheidslimieten kaarten toegevoegd (BE)\n- Snelheidsregimes en referentiepunten AWV hersteld (BE)',
        v3_0_7: '- Meerdere UI verbeteringen\n- West Virginia Leaves Off kaart bijgewerkt (US)',
        v3_1_0: '- Kaart voor Oman toegevoegd\n- Meedere verbeteringen in kaartweergave\n- Verbeterde layout\n- Andere kaarten aangepast/hersteld',
        v3_1_1: '- Verberg lege kaarttegels\n- Meerdere kleine lay-out en bug fixes',
        v3_1_2: '- Kleine verbeteringen in performantie toegepast',
        v3_1_3: '- Enkele kaarten toegevoegd voor Brussel (BE)',
        v3_1_4: '- Verkeersbordenkaart toegevoegd voor Vlaanderen (BE)',
        v3_1_5: '- Toevoeging van enkele standaardlagen in Wegenregister-kaart (BE)\n- Verbeteringen voor meest recente versie van WME',
        v3_1_6: '- Upgrade naar BAG versie 1.1 en Kadastrale kaart versie 4 (NL)',
        v3_1_7: '- USDA NAIP kaart toegevoegd',
        v3_1_8: '- Gecorrigeerde WV Leaves Off-lagen en transparantie toegevoegd aan WV Leaves Off\n- Meer recente Orthophoto-kaarten toegevoegd voor Wallonië (BE)',
        v3_1_9: '- WV Leaves Off laag updates\n- Enkele Brusselse kaarten hernoemd',
        v3_1_10: '- WV Leaves Off laag updates\n- Enkele Brusselse kaarten hersteld',
        v3_1_11: '- Kaart met kadastrale grenzen toegevoegd (BE)',
        v3_1_12: '- Luchtfoto\'s van Virginia toegevoegd\n- PICC en Brussels Future speed limits kaarten bijgewerkt (BE)\n- Oman National Basemap bijgewerkt',
        v3_1_13: '- Luchtfoto\'s van Tennessee toegevoegd',
        v3_1_14: '- WV Leaves Off laag updates',
        v3_1_15: '- Verbetering voor toekomstige versie van WME',
        v3_1_16: '- Verplaats de kaart van Virginia naar de nieuwe server (US)',
        v3_1_17: '- Luchtfoto\'s van Pennsylvania toegevoegd (US)\n- Correctie aan de begrenzing van de kaart van Tennessee',
        v3_1_18: '- NAIP+-beelden toegevoegd voor Amerikaans grondgebied, Alaska en Hawaii\n- Overtrekken van grijze pixels toegevoegd bij kaarten van Oman',
        v3_1_19: '- Luchtfoto (NL) hersteld door PDOK rechtstreeks op te roepen',
        v3_1_20: '- Aanpassingen voor WME v2.83',
        v3_1_21: '- BAG aangepast (NL)\n- Luchtfoto aangepast (NL)',
        v3_1_22: '- WV Leaves Off laag updates',
        v3_1_23: '- Aanpassingen voor nieuwe lay-out WME',
        v3_1_24: '- North Carolina NC One Map toegevoegd (US)',
        v3_1_25: '- Migratie Vlaamse kaartdiensten naar nieuwe website (BE)\n- PDOK Luchtbeelden bijgewerkt (NL)',
        v3_1_26: '- Aanpassingen voor nieuwe lay-out WME',
        v3_2_1: '- Layout aanpassen voor nieuwe WME',
        v3_2_2: '- WV Leaves Off laag updates',
        v3_2_3: '- Verwijs naar nieuwe Maximumsnelhedenkaart (NL)',
        v3_2_4: '- Vervang NAIP door NAIP+ kaart (US)',
        v3_2_5: '- Maak gebruik van de nieuwe Waze API om tabs aan te maken',
        v3_2_6: '- WV Leaves Off laag updates',
        v3_2_7: '- PICC kaartlagen aangepast (BE)',
        v3_2_8: '- WV Leaves Off laag updates',
        v3_2_9: '- Cadastral borders map vervangen (BE)',
        v3_2_10: '- Probleem met witruimte opgelost in query scherm\n- VLAIO kaart toegevoegd (BE)',
        v3_2_11: '- Publieke oplaadpunten kaart toegevoegd (BE)',
        v3_2_12: '- Hou rekening met het extra beeldmateriaal',
        v3_2_13: '- Adrespunten kaart vervangen met het Adressenregister (BE)\n- Opvragen van data uit Maximumsnelhedenkaart opgelost (NL)',
        v3_2_14: '- Nationaal Wegen Bestand kaart hersteld en dubbele Hectopuntenkaart verwijderd (NL)',
        v3_2_15: '- Migreer GIPOD naar nieuwe locatie met extra kaartlagen (BE)',
        v3_2_16: '- Blokkeer het dupliceren van een kaartlaag (in de toekomst te ondersteunen)\n- Migreer en update Weggegevens en Kadastrale Kaart kaartlagen (NL)',
        v3_2_17: '- Kaarten toegevoegd voor Kroatië (HR)',
        v3_2_18: '- Herstel Brussels Ortho kaart (BE)',
        v3_2_19: '- Voorbereiding voor wijzigingen in WME beta',
        v3_2_20: '- Fix map retrieval breakage due to unexpected changes',
        v3_2_21: '- Fix WV Leaves off and USGS NAIP+ layers (US)',
        v3_2_22: '- IndianaMap toegevoegd (US)',
        v3_2_23: '- Herstel Virginia Aerial Imagery map (US)\n- Advies toegevoegd voor wanneer het queryen nooit een resultaat geeft.',
        v3_2_24: '- WV Leaves Off laag updates (US)',
        v3_2_25: '- IndianaMap updates (US)',
        v3_2_26: '- IndianaMap updates (US)\n- WV Leaves Off laag updates (US)',
        v3_2_27: '- Update van de jaarlijkse orthografische kaarten (BE en NL)',
        v3_2_28: '- CIRB kaart hersteld (BE)',
        v3_2_29: '- Maryland iMAP toegevoegd (US)',
        v3_2_30: '- Kaarten Luxemburg toegevoegd (LU)',
        v3_2_31: '- Brusselse kaarten hersteld (BE)',
        v3_2_32: '- WV Leaves Off laag updates (US)',
        v3_2_33: '- Luchtfoto 2025 kaartlagen hersteld (NL)',
        v3_2_34: '- Rangschikken van kaartlagen hersteld',
        v3_2_35: '- WV Leaves Off layers updated (US)'
      }
    },
    fr: {
      tab_title: 'Open Maps',
      maps_title: 'Cartes Actives',
      no_local_maps: 'Aucune carte disponible ici',
      opacity_label: 'Opacité',
      areas: {
        BE: 'Belgique',
        BR: 'Brésil',
        LU: 'Luxembourg',
        NL: 'Pays-Bas',
        OM: 'Oman',
        US: 'États Unis',
        HR: 'Croatie'
      },
    },
    'pt-BR': {
      tab_title: 'Open Maps',
      maps_title: 'Ativar Mapas',
      no_local_maps: 'Não foram encontrados mapas para esta área',
      expand: 'Clique para expandir',
      collapse: 'Clique para colapsar',
      hideshow_layer: 'Ocultar/Mostrar mapa',
      query_window_title: 'Consulta de Localização do Mapa',
      query_window_loading: 'Resgatando informação do serviço do mapa...',
      query_window_switch: 'Alternar entre dados processados e originais',
      query_window_query: 'Realize essa consulta novamente em outro lugar no mapa',
      query_empty_response: 'Nenhuma resposta recebida do serviço do mapa neste local. Talvez tente em outro local ou tente consultar outra camada?',
      query_empty_response_advice: 'ℹ️ Se esse problema persistir, você pode querer verificar se a página tem um zoom aplicado a ela, pois isso pode quebrar a consulta. Você pode pressionar {hotkey} para redefinir o zoom.',
      query_table_property: 'Propriedade',
      query_table_value: 'Valor',
      retrieving_error: 'Resgatando erro...',
      query_layer: 'Consulte uma determinada localização deste mapa para obter mais informações clicando em algum lugar no mapa',
      edit_layer: 'Editar mapa',
      remove_layer: 'Remover mapa',
      layer_out_of_range: 'Mapa não pode ser exibido no nível de zoom atual',
      satellite_imagery: 'Mostrar imagem satélite',
      select_map: 'Selecione o mapa para adicionar',
      opacity_label: 'Opacidade',
      opacity_label_tooltip: 'Ajustar a transparência da camada',
      transparent_label: 'Transparência',
      transparent_label_tooltip: 'Fazer o mapa de plano de fundo transparente',
      map_improvement_label: 'Melhorar a exibição do mapa',
      map_improvement_label_tooltip: 'Aplique várias melhorias nos blocos de mapa',
      map_layers_title: 'Camadas do mapa',
      errors: {
        network: 'Erro na rede',
        network_description: 'Recebido o seguinte código de status ao recuperar informações: ',
        see_console: 'Olhe o console da web para mais detalhes',
        timeout: 'Tempo esgostado',
        timeout_description: 'Resgatando resposta demorou mais de 10s, provavelmente problema na rede',
        parse_fail: 'Não foi possível analisar a mensagem de erro'
      },
      areas: {
        BE: 'Bélgica',
        BR: 'Brasil',
        LU: 'Luxemburgo',
        NL: 'Países Baixos',
        OM: 'Omã',
        US: 'Estados Unidos',
        HR: 'Croácia'
      }
    }
  };
  translations['en-GB'] = translations['en-US'] = translations.en;
  I18n.translations[I18n.currentLocale()].openmaps = translations.en;
  Object.keys(translations).forEach(function(locale) {
    if (I18n.currentLocale() == locale) {
      addFallbacks(translations[locale], translations.en);
      I18n.translations[locale].openmaps = translations[locale];
    }
  });
  function addFallbacks(localeStrings, fallbackStrings) {
    Object.keys(fallbackStrings).forEach(function(key) {
      if (!localeStrings[key]) {
        localeStrings[key] = fallbackStrings[key];
      } else if (typeof localeStrings[key] === 'object') {
        addFallbacks(localeStrings[key], fallbackStrings[key]);
      }
    });
  }
  //#endregion

  //#region List of available maps
  let maps = new Map();
  [
    {
      id: 101,
      title: 'WV Leaves Off',
      type: 'WMS',
      url: 'https://services.wvgis.wvu.edu/arcgis/services/Imagery_BaseMaps_EarthCover/wv_imagery_WVGISTC_leaf_off_mosaic/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-82.723357, 37.134443, -77.624583, 40.659337],
      format: 'image/jpeg',
      area: 'US',
      abstract: 'Satellite imagery of West Virginia',
      attribution: 'West Virginia University',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['1', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '19', '23', '27', '30', '31', '32', '33', '34', '35', '36', '37', '39', '42', '44', '47', '48', '49', '50', '51', '52', '54', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76'],
      layers: {
        '1': { queryable: true, title: 'Mason_2018', abstract: '' },
        '4': { queryable: true, title: 'Gilmer_2019', abstract: '' },
        '5': { queryable: true, title: 'Clay_2019', abstract: '' },
        '6': { queryable: true, title: 'Braxton_2019', abstract: '' },
        '7': { queryable: true, title: 'Pleasants_2020', abstract: '' },
        '8': { queryable: true, title: 'Webster_2020', abstract: '' },
        '9': { queryable: true, title: 'Mingo_2020', abstract: '' },
        '10': { queryable: true, title: 'Boone_2020', abstract: '' },
        '11': { queryable: true, title: 'Pendleton_2021', abstract: '' },
        '12': { queryable: true, title: 'Hancock_2021', abstract: '' },
        '13': { queryable: true, title: 'Randolph_2022', abstract: '' },
        '14': { queryable: true, title: 'Raleigh_2022', abstract: '' },
        '15': { queryable: true, title: 'Marshall_2022', abstract: '' },
        '16': { queryable: true, title: 'Hampshire_2022', abstract: '' },
        '17': { queryable: true, title: 'Wood_2023', abstract: '' },
        '19': { queryable: true, title: 'McDowell_2023', abstract: '' },
        '23': { queryable: true, title: 'Mercer_2024', abstract: '' },
        '27': { queryable: true, title: 'Logan_2024', abstract: '' },
        '30': { queryable: true, title: 'Wirt_2024', abstract: '' },
        '31': { queryable: true, title: 'Wayne_2024', abstract: '' },
        '32': { queryable: true, title: 'Tucker_2024', abstract: '' },
        '33': { queryable: true, title: 'Roane_2024', abstract: '' },
        '34': { queryable: true, title: 'Morgan_2024', abstract: '' },
        '35': { queryable: true, title: 'Marion_2024', abstract: '' },
        '36': { queryable: true, title: 'Hardy_2024', abstract: '' },
        '37': { queryable: true, title: 'Greenbrier_2024', abstract: '' },
        '39': { queryable: true, title: 'Fayette_2024', abstract: '' },
        '42': { queryable: true, title: 'Lincoln_2024', abstract: '' },
        '44': { queryable: true, title: 'Wyoming_2024', abstract: '' },
        '47': { queryable: true, title: 'Monroe_2024', abstract: '' },
        '48': { queryable: true, title: 'Grant_2024', abstract: '' },
        '49': { queryable: true, title: 'Barbour_2024', abstract: '' },
        '50': { queryable: true, title: 'Summers_2024', abstract: '' },
        '51': { queryable: true, title: 'Wetzel_2025', abstract: '' },
        '52': { queryable: true, title: 'Ohio_2025', abstract: '' },
        '54': { queryable: true, title: 'Kanawha_2025', abstract: '' },
        '57': { queryable: true, title: 'Upshur_2025', abstract: '' },
        '58': { queryable: true, title: 'Tyler_2025', abstract: '' },
        '59': { queryable: true, title: 'Taylor_2025', abstract: '' },
        '60': { queryable: true, title: 'Ritchie_2025', abstract: '' },
        '61': { queryable: true, title: 'Putnam_2025', abstract: '' },
        '62': { queryable: true, title: 'Preston_2025', abstract: '' },
        '63': { queryable: true, title: 'Pocahontas_2025', abstract: '' },
        '64': { queryable: true, title: 'Nicholas_2025', abstract: '' },
        '65': { queryable: true, title: 'Monongalia_2025', abstract: '' },
        '66': { queryable: true, title: 'Mineral_2025', abstract: '' },
        '67': { queryable: true, title: 'Lewis_2025', abstract: '' },
        '68': { queryable: true, title: 'Jefferson_2025', abstract: '' },
        '69': { queryable: true, title: 'Jackson_2025', abstract: '' },
        '70': { queryable: true, title: 'Harrison_2025', abstract: '' },
        '71': { queryable: true, title: 'Doddridge_2025', abstract: '' },
        '72': { queryable: true, title: 'Calhoun_2025', abstract: '' },
        '73': { queryable: true, title: 'Cabell_2025', abstract: '' },
        '74': { queryable: true, title: 'Brooke_2025', abstract: '' },
        '75': { queryable: true, title: 'Berkeley_2025', abstract: '' },
        '76': { queryable: true, title: 'CountiesImagery_Year', abstract: '' }
      }
    },
    {
      id: 102,
      title: 'USDA NAIP+ Imagery',
      type: 'WMS',
      url: 'https://imagery.nationalmap.gov:443/arcgis/services/USGSNAIPPlus/ImageServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-179.297176, -14.629169, 179.825647, 71.498685],
      format: 'image/jpeg',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of the Continuous US',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['USGSNAIPPlus'],
      layers: {
        'USGSNAIPPlus': {
          queryable: true,
          title: 'USGSNAIPPlus'
        }
      }
    },
    {
      id: 104,
      title: 'Virginia Aerial Imagery',
      type: 'WMS',
      url: 'https://vginmaps.vdem.virginia.gov/arcgis/services/VBMP_Imagery/MostRecentImagery_WGS/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-84.09707, 36.06439, -74.820609, 39.927717],
      format: 'image/jpeg',
      area: 'US',
      abstract: 'Most recent aerial imagery from Virginia Geographic Information Network',
      attribution: 'Virginia Geographic Information Network',
      pixelManipulations: ['vaBlankTiles2Transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'VBMP most recent imagery',
          abstract: 'Orthoimagery collected in Spring 2013, 2014, 2015 and 2017 (whichever is most recently available) by the VBMP program for Virginia. The imagery is displayed in true color (RED, GREEN, BLUE). The spatial reference is WGS 1984 Web Mercator (Auxiliary Sphere). The imagery is tiled at 12 levels from 1:4,622,324 to 1:2,257. The imagery was collected to meet ASPRS Class 1 orthoimagery standards. Most areas were collected at a 1-ft ground sample distance (GSD), with some urban areas upgraded to 6-inch and 3-inch GSD. - "Any determination of topography or contours, or any depiction of physical improvements, property lines or boundaries is for general information only and shall not be used for the design, modification, or construction of improvements to real property or for flood plain determination." Subsection C of § 54.1-402.'
        }
      }
    },
    {
      id: 105,
      title: 'Tennessee Aerial Imagery',
      type: 'WMS',
      url: 'https://tnmap.tn.gov/arcgis/services/BASEMAPS/IMAGERY_WEB_MERCATOR/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-90.350458, 34.961664, -81.609963, 36.686075],
      format: 'image/png',
      area: 'US',
      abstract: 'Tennessee Department of Transportation(TDOT) Imagery Product',
      attribution: 'TDOT',
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'TDOT Imagery',
          abstract: 'TDOT Imagery Product'
        }
      }
    },
    {
      id: 106,
      title: 'Pennsylvania Aerial Imagery',
      type: 'WMS',
      url: 'https://apps.pasda.psu.edu/arcgis/services/PEMAImagery2018_WEB/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-80.589716, 39.679911, -74.682489, 42.29279],
      format: 'image/png',
      area: 'US',
      abstract: 'Aerial Imagery from PEMA, 2018-2020',
      attribution: 'PASDA',
      queryable: false,
      default_layers: ['1', '5', '9', '13', '17', '21', '25', '29', '33', '37', '41', '45', '49', '53', '57', '61', '65', '69', '73', '77', '81', '85', '89', '93', '97', '101', '105', '109', '113', '117', '121', '125', '129', '133', '137', '141', '145', '149', '153', '157', '161', '165', '169', '173', '177', '181', '185', '189', '193', '197', '201', '205', '209', '213', '217'],
      layers: {
        '1': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_YorkCounty_Mosaic2018_1'
        },
        '5': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_WyomingCounty_Mosaic2020'
        },
        '9': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_WayneCounty_Mosaic2020'
        },
        '13': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_WashingtonCounty_Mosaic2018'
        },
        '17': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_UnionCounty_Mosaic2020'
        },
        '21': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_SusquehannaCounty_Mosaic2020'
        },
        '25': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_SullivanCounty_Mosaic2020'
        },
        '29': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_SomersetCounty_Mosaic2020'
        },
        '33': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_SnyderCounty_Mosaic2020'
        },
        '37': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_SchuylkillCounty_Mosaic2018'
        },
        '41': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_PotterCounty_Mosaic2020'
        },
        '45': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_PhiladelphiaCounty_Mosaic2018'
        },
        '49': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_PerryCounty_Mosaic2018'
        },
        '53': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_NorthumberlandCounty_Mosaic2018'
        },
        '57': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_NorthamptonCounty_Mosaic'
        },
        '61': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_MontourCounty_Mosaic2018_gdb'
        },
        '65': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_MontgomeryCounty_Mosaic2018'
        },
        '69': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_MonroeCounty_Mosaic2018'
        },
        '73': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_McKeanCounty_Mosaic2019_JP2'
        },
        '77': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_MifflinCounty_Mosaic2020'
        },
        '81': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LycomingCounty_Mosaic2020'
        },
        '85': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LuzerneCounty_Mosaic2018'
        },
        '89': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LehighCounty_Mosaic2018'
        },
        '93': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LebanonCounty_Mosaic2018'
        },
        '97': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LawrenceCounty_Mosaic2020'
        },
        '101': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LancasterCounty_Mosaic2018'
        },
        '105': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_LackawannaCounty_Mosaic2020'
        },
        '109': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_JuniataCounty_Mosaic2020'
        },
        '113': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_JeffersonCounty_Mosaic2018'
        },
        '117': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_HuntingdonCounty_Mosaic2020'
        },
        '121': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_GreeneCounty_Mosaic2018_gdb'
        },
        '125': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_FultonCounty_Mosaic2020'
        },
        '129': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_FranklinCounty_Mosaic2018'
        },
        '133': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_FayetteCounty_Mosaic2020'
        },
        '137': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ErieCounty_Mosaic2018_JP2'
        },
        '141': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ElkCounty_Mosaic2019_JP2'
        },
        '145': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_DelawareCounty_Mosaic2018'
        },
        '149': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_DauphinCounty_Mosaic2018'
        },
        '153': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CumberlandCounty_Mosaic2018_JP2'
        },
        '157': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CrawfordCounty_Mosaic2018_JP2'
        },
        '161': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ColumbiaCounty_Mosaic2018'
        },
        '165': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ClintonCounty_Mosaic2020'
        },
        '169': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ClearfieldCounty_Mosaic2018'
        },
        '173': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_ChesterCounty_Mosaic2020'
        },
        '177': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CentreCounty_Mosaic2020'
        },
        '181': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CarbonCounty_Mosaic2018'
        },
        '185': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CameronCounty_Mosaic2019_JP2'
        },
        '189': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_CambriaCounty_Mosaic2018'
        },
        '193': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_BucksCounty_Mosaic'
        },
        '197': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_BradfordCounty_Mosaic2020'
        },
        '201': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_BlairCounty_Mosaic2020'
        },
        '205': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_BerksCounty_Mosaic2020'
        },
        '209': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_BeaverCounty_Mosaic2020'
        },
        '213': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_AlleghenyCounty_Mosaic2018'
        },
        '217': {
          queryable: true,
          title: 'Image',
          abstract: 'PEMA_AdamsCounty_Mosaic2018_JP2'
        }
      }
    },
    {
      id: 107,
      title: 'USDA NAIP+ Puerto Rico',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-67.95584, 17.865141, -65.21849, 18.522609],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of Puerto Rico',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['1'],
      layers: {
        '1': {
          queryable: false,
          title: 'USDA NAIP+ Puerto Rico',
          abstract: 'USDA NAIP+ Imagery of the Puerto Rico'
        }
      }
    },
    {
      id: 108,
      title: 'USDA NAIP+ Virgin Islands',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-65.077787, 17.654595, -64.546763, 18.427245],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of Virgin Islands',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['5'],
      layers: {
        '5': {
          queryable: false,
          title: 'USDA NAIP+ Virgin Islands',
          abstract: 'USDA NAIP+ Imagery of the Virgin Islands'
        }
      }
    },
    {
      id: 109,
      title: 'USDA NAIP+ Hawaii',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-160.678325, 17.356606, -152.847819, 23.203373],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of Hawaii',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['9'],
      layers: {
        '9': {
          queryable: false,
          title: 'USDA NAIP+ Hawaii',
          abstract: 'USDA NAIP+ Imagery of the Hawaii'
        }
      }
    },
    {
      id: 110,
      title: 'USDA NAIP+ American Samoa',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-170.851656, -14.377607, -169.40573, -14.143065],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of American Samoa',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['13'],
      layers: {
        '13': {
          queryable: false,
          title: 'USDA NAIP+ American Samoa',
          abstract: 'USDA NAIP+ Imagery of the American Samoa'
        }
      }
    },
    {
      id: 111,
      title: 'USDA NAIP+ Guam/Northern Mariana Islands',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [144.549128, 13.165851, 146.125274, 20.625758],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of Guam/Northern Mariana Islands',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['17'],
      layers: {
        '17': {
          queryable: false,
          title: 'USDA NAIP+ Guam/Northern Mariana Islands',
          abstract: 'USDA NAIP+ Imagery of the Guam/Northern Mariana Islands'
        }
      }
    },
    {
      id: 112,
      title: 'USDA NAIP+ St. John',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-64.806465, 18.268151, -64.635387, 18.37756],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of St. John',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['21'],
      layers: {
        '21': {
          queryable: false,
          title: 'USDA NAIP+ St. John',
          abstract: 'USDA NAIP+ Imagery of the St. John'
        }
      }
    },
    {
      id: 113,
      title: 'USDA NAIP+ Alaska',
      type: 'WMS',
      url: 'https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-173.25, 54.383756, -129.786987, 71.506811],
      format: 'image/png',
      area: 'US',
      abstract: 'USDA NAIP+ Imagery of Alaska',
      attribution: 'USDA',
      queryable: false,
      default_layers: ['29'],
      layers: {
        '29': {
          queryable: false,
          title: 'USDA NAIP+ Alaska',
          abstract: 'USDA NAIP+ Imagery of the Alaska'
        }
      }
    },
    {
      id: 114,
      title: 'NC OneMap',
      type: 'WMS',
      url: 'https://services.nconemap.gov/secure/services/Imagery/Orthoimagery_Latest/ImageServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-84.262261, 33.695574, -75.399761, 36.590526],
      format: 'image/png',
      area: 'US',
      abstract: 'Most recent aerial imagery from NC OneMap',
      attribution: 'NC OneMap', // https://www.nconemap.gov/pages/terms
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'Orthoimagery_Latest',
          abstract: 'Imagery/Orthoimagery_Latest'
        }
      }
    },
    {
      id: 115,
      title: 'IndianaMap',
      type: 'WMS',
      url: 'https://di-ingov.img.arcgis.com/arcgis/services/DynamicWebMercator/Indiana_Current_Imagery/ImageServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-88.165560, 37.762766, -84.698567, 41.813054],
      format: 'image/png',
      area: 'US',
      abstract: 'State of Indiana Current Orthophotography',
      attribution: 'IndianaMap', // https://www.indianamap.org/pages/faqs-and-guides
      queryable: false,
      default_layers: ['Indiana_Current_Imagery'],
      layers: {
        'Indiana_Current_Imagery': {
          queryable: false,
          title: 'Indiana_Current_Imagery',
          abstract: 'Indiana_Current_Imagery'
        }
      }
    },
    {
      id: 116,
      title: 'Maryland iMAP Three-Inch',
      type: 'WMS',
      url: 'https://mdgeodata.md.gov/imagery/services/ThreeInch/MD_ThreeInchImagery/ImageServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-77.265544, 37.943615, -75.031378, 39.737316],
      format: 'image/png',
      area: 'US',
      abstract: 'Three-inch imagery from Maryland iMAP',
      attribution: 'MD iMAP', // Attribution added by Waze https://support.google.com/waze/answer/12075833?hl=en
      queryable: false,
      default_layers: ['MD_ThreeInchImagery'],
      layers: {
        'MD_ThreeInchImagery': {
          queryable: false,
          title: 'MD_ThreeInchImagery',
          abstract: 'MD_ThreeInchImagery'
        }
      }
    },
    {
      id: 117,
      title: 'Maryland iMAP Six-Inch',
      type: 'WMS',
      url: 'https://mdgeodata.md.gov/imagery/services/SixInch/SixInchImagery/ImageServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [-79.507413, 37.880890, -75.031378, 39.737316],
      format: 'image/png',
      area: 'US',
      abstract: 'Six-inch imagery from Maryland iMAP',
      attribution: 'MD iMAP', // Attribution added by Waze https://support.google.com/waze/answer/12075833?hl=en
      queryable: false,
      default_layers: ['SixInchImagery'],
      layers: {
        'SixInchImagery': {
          queryable: false,
          title: 'SixInchImagery',
          abstract: 'SixInchImagery'
        }
      }
    },
    {
      id: 3101,
      title: 'BAG',
      type: 'WMS',
      url: 'https://service.pdok.nl/lv/bag/wms/v2_0',
      crs: 'EPSG:3857',
      bbox: [3.206231, 50.733604, 7.245263, 53.58298],
      format: 'image/png',
      area: 'NL',
      abstract: 'De gegevens bestaan uit BAG-panden en een deelselectie van BAG-gegevens van deze panden en de zich daarin bevindende verblijfsobjecten. Ook de ligplaatsen en standplaatsen zijn hierin opgenomen met een deelselectie van BAG-gegevens. De gegevens van de nummeraanduiding zijn in deze services onderdeel van de adresseerbare objecten, hierbij wordt slechts 1 adres opgenomen, dus objecten met meerdere adressen (hoofd- en nevenadressen) zijn niet compleet. In deze services zitten dus niet alle BAG adressen. Wij adviseren u, aangezien er sprake is van beperkte gegevens, om in de webservice BAG Bevragen de actuele gegevens te controleren. Dit kan ook in een van de andere BAG producten: BAG Web, BAG Extract of BAG Compact. BAG Bevragen: http://www.kadaster.nl/web/artikel/productartikel/BAG-Bevragen.htm Andere BAG producten: http://www.kadaster.nl/web/Themas/Registraties/BAG/BAGartikelen/BAG-producten.htm De service wordt dagelijks geactualiseerd.',
      attribution: 'BAG',
      getExternalUrl: () => 'https://bagviewer.kadaster.nl/lvbag/bag-viewer/index.html',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['ligplaats', 'pand', 'verblijfsobject', 'woonplaats', 'standplaats'],
      layers: {
        'ligplaats': {
          queryable: false,
          title: 'ligplaats'
        },
        'pand': {
          queryable: false,
          title: 'pand'
        },
        'standplaats': {
          queryable: false,
          title: 'standplaats'
        },
        'verblijfsobject': {
          queryable: true,
          title: 'verblijfsobject'
        },
        'woonplaats': {
          queryable: false,
          title: 'woonplaats'
        }
      }
    },
    {
      id: 3103,
      title: 'Weggegevens',
      type: 'WMS',
      url: 'https://service.pdok.nl/rws/weggeg/wms/v1_0',
      crs: 'EPSG:3857',
      bbox: [3.460993, 50.740995, 7.239002, 53.443005],
      format: 'image/png',
      area: 'NL',
      abstract: 'De service van Weggegevens bevat op dit moment de lagen maximum snelheden en rijstroken van de rijkswegen.',
      attribution: 'PDOK',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['WegvakRijstroken', 'WegvakMaxSnelheden'],
      layers: {
        'WegvakRijstroken': {
          queryable: true,
          title: 'Weggegevens aantal rijbanen'
        },
        'WegvakMaxSnelheden': {
          queryable: true,
          title: 'Weggegevens maximumsnelheden'
        }
      }
    },
    {
      id: 3105,
      title: 'Nationaal Wegen Bestand',
      type: 'WMS',
      url: 'https://service.pdok.nl/rws/nwbwegen/wms/v1_0',
      crs: 'EPSG:3857',
      bbox: [3.000000, 50.740995, 7.000000, 53.000000],
      zoomRange: [14, 22],
      format: 'image/png',
      area: 'NL',
      abstract: 'Deze dataset bevat alleen de wegvakken en hectometerpunten. Het Nationaal Wegen Bestand - Wegen is een digitaal geografisch bestand van alle wegen in Nederland. Opgenomen zijn alle wegen die worden beheerd door wegbeheerders als het Rijk, provincies, gemeenten en waterschappen, echter alleen voor zover deze zijn voorzien van een straatnaam of nummer',
      attribution: 'PDOK',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['hectopunten', 'wegvakken'],
      layers: {
        'hectopunten': {
          queryable: true,
          title: 'NWB Wegen hectopunten',
          abstract: 'Deze laag bevat de hectopunten uit het Nationaal Wegen Bestand (NWB) en geeft gedetailleerde informatie per hectopunt zoals hectometrering, afstand, zijde en hectoletter weer.'
        },
        'wegvakken': {
          queryable: true,
          title: 'NWB Wegen wegvakken',
          abstract: 'Deze laag bevat de wegvakken uit het Nationaal Wegen bestand (NWB) en geeft gedetailleerde informatie per wegvak zoals straatnaam, wegnummer, routenummer, wegbeheerder, huisnummers, enz. weer.'
        }
      }
    },
    {
      id: 3106,
      title: 'Luchtfoto (PDOK)',
      type: 'WMS',
      url: 'https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0',
      crs: 'EPSG:3857',
      bbox: [-1.657293, 48.040499, 12.431731, 56.110592],
      format: 'image/jpeg',
      area: 'NL',
      abstract: 'Een jaarlijks te vernieuwen dataset van luchtopnamen van Nederland in hoge en lage resolutie.',
      attribution: 'PDOK',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['Actueel_orthoHR'],
      layers: {
        'Actueel_orthoHR': {
          queryable: false,
          title: 'Luchtfoto Actueel HR',
          abstract: 'Landsdekkende dataset in 8cm resolutie kleuren luchtfoto\'s van de meest recente jaargang.'
        },
        'Actueel_ortho25': {
          queryable: false,
          title: 'Luchtfoto Actueel 25cm',
          abstract: 'Landsdekkende 25cm resolutie dataset kleuren luchtfoto\'s van de meest recente jaargang.'
        },
        '2025_orthoHR': {
          queryable: false,
          title: 'Luchtfoto 2025 Ortho 8cm RGB',
          abstract: 'Landsdekkende dataset in 8cm resolutie kleuren luchtfoto\'s van 2025'
        },
        '2025_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2025 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset in 25cm resolutie kleuren luchtfoto\'s van 2025'
        },
        '2024_orthoHR': {
          queryable: false,
          title: 'Luchtfoto 2024 Ortho 8cm RGB',
          abstract: 'Landsdekkende dataset in 8cm resolutie kleuren luchtfoto\'s van 2024'
        },
        '2023_orthoHR': {
          queryable: false,
          title: 'Luchtfoto 2023 Ortho HR',
          abstract: 'Landsdekkende dataset in hoge resolutie kleuren luchtfoto\'s van 2023.'
        },
        '2023_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2023 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2023.'
        },
        '2022_orthoHR': {
          queryable: false,
          title: 'Luchtfoto 2022 Ortho HR',
          abstract: 'Landsdekkende dataset in hoge resolutie kleuren luchtfoto\'s van 2022.'
        },
        '2022_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2022 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2022.'
        },
        '2021_orthoHR': {
          queryable: false,
          title: 'Luchtfoto 2021 Ortho HR',
          abstract: 'Landsdekkende dataset in hoge resolutie kleuren luchtfoto\'s van 2021.'
        },
        '2020_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2020 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2019.'
        },
        '2019_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2019 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2019.'
        },
        '2018_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2018 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2018.'
        },
        '2017_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2017 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2017.'
        },
        '2016_ortho25': {
          queryable: false,
          title: 'Luchtfoto 2016 Ortho 25cm RGB',
          abstract: 'Landsdekkende dataset 25cm resolutie kleuren luchtfoto\'s van 2016.'
        }
      }
    },
    {
      id: 3107,
      title: 'Kadastrale kaart',
      type: 'WMS',
      url: 'https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0',
      crs: 'EPSG:3857',
      bbox: [3.460993, 50.740995, 7.239002, 53.443005],
      format: 'image/png',
      area: 'NL',
      abstract: 'Overzicht van de ligging van de kadastrale percelen in Nederland. Fungeert als schakel tussen terrein en registratie, vervult voor externe gebruiker vaak een referentiefunctie, een ondergrond ten opzichte waarvan de gebruiker eigen informatie kan vastleggen en presenteren.',
      attribution: 'PDOK',
      pixelManipulations: ['removePartialBlackTransparency', 'traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['KadastraleKaart'],
      layers: {
        'KadastraleKaart': {
          queryable: true,
          title: 'Kadastrale kaart',
          abstract: 'Bevat alle andere kaartlagen'
        },
        'Bebouwing': {
          queryable: true,
          title: 'Bebouwing',
          abstract: 'Bevat Bebouwingsvlak en Nummeraanduidingsreeks'
        },
        'Bebouwingvlak': {
          queryable: true,
          title: 'Bebouwingvlak'
        },
        'Nummeraanduidingreeks': {
          queryable: true,
          title: 'Nummeraanduidingreeks'
        },
        'OpenbareRuimteNaam': {
          queryable: true,
          title: 'Naam openbare ruimte'
        },
        'Perceel': {
          queryable: true,
          title: 'Perceel',
          abstract: 'Bevat Perceelvlak, Label en Bijpijling. Een perceel is een stuk grond waarvan het Kadaster de grenzen heeft gemeten of gaat meten en dat bij het Kadaster een eigen nummer heeft. Een perceel is een begrensd deel van het Nederlands grondgebied dat kadastraal geïdentificeerd is en met kadastrale grenzen begrensd is.'
        },
        'Perceelvlak': {
          queryable: true,
          title: 'Perceelvlak'
        },
        'Label': {
          queryable: true,
          title: 'Label perceel'
        },
        'Bijpijling': {
          queryable: true,
          title: 'Bijpijling'
        },
        'KadastraleGrens': {
          queryable: true,
          title: 'Kadastrale grens'
        }
      }
    },
    {
      id: 3108,
      title: 'Maximumsnelheden',
      type: 'WMS',
      url: 'https://geo.rijkswaterstaat.nl/services/ogc/gdr/maximum_snelheden_wegen/ows',
      crs: 'EPSG:3857',
      bbox: [3.253348, 50.73394, 7.246081, 53.549177],
      format: 'image/png',
      area: 'NL',
      abstract: 'Maximumsnelhedenkaart van alle wegen in Nederland, voorzien door Rijkswaterstaat',
      attribution: 'Rijkswaterstaat',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['max_snelheden_overdag', 'max_snelheden_nacht'],
      layers: {
        'max_snelheden_overdag': {
          title: 'Maximumsnelheden overdag',
          queryable: true
        },
        'max_snelheden_nacht': {
          title: 'Maximumsnelheden \'s nachts',
          queryable: true
        },
        'max_snelheden_advies': {
          title: 'Adviessnelheden per wegvak',
          abstract: 'De wegkenmerkendatabase voor snelheden bevat ook de adviessnelheden dat geldt voor een bepaald wegvak of een deel daarvan.\nNu zijn alleen adviessnelheden voor de rijkswegen opgenomen in het bestand, maar in de toekomst wordt dit uitgebreid met de adviessnelheden voor het onderliggend wegennet.',
          queryable: true
        }
      }
    },
    {
      id: 3201,
      title: 'GRB Vlaanderen',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/GRB/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.940002, 51.510003],
      format: 'image/png',
      area: 'BE',
      abstract: 'Opvragen en visualiseren van het Grootschalig Referentiebestand (GRB) als een kaart. Omvat alle GRB-gegevens gebaseerd op het GRBgis product. De gebruiker kan selecteren welke GRB-gegevens gevisualiseerd moeten worden en in welke volgorde. Voor een gedetailleerde databeschrijving van het GRB raadpleegt u best het GRB-objectenhandboek via www.agiv.be/producten/grb/objectcatalogus/entiteiten.',
      attribution: 'Agentschap Informatie Vlaanderen',
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&kaart=Basiskaart - GRB: volledige kaart&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: false,
      default_layers: ['GRB_BSK'],
      layers: {
        'GRB_BSK': {
          queryable: false,
          title: 'GRB-basiskaart',
          abstract: 'Deze laag omvat alle (GRB-) entiteiten die zichtbaar zijn in de GRB-basiskaart'
        }
      }
    },
    {
      id: 3202,
      title: 'Orthomozaïek Vlaanderen',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/OMWRGBMRVL/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.940002, 51.510003],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'WMS die de compilatie weergeeft van de meest recente middenschalige orthofotomozaïeken uit de wintervluchten die voor ieder deel van Vlaanderen beschikbaar zijn die wordt bijgewerkt telkens er een nieuw deel beschikbaar is.',
      attribution: 'Agentschap Informatie Vlaanderen',
      pixelManipulations: ['whiteTiles2transparent'],
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&kaart=Opnamedatum meest recente luchtfoto in achtergrondkaart&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['Ortho', 'Vliegdagcontour'],
      layers: {
        'Ortho': {
          queryable: false,
          title: 'Orthofotomozaïek, middenschalig, winteropnamen, kleur, meest recent, Vlaanderen',
          abstract: 'Deze rasterlaag is een compilatie van de meest recente orthofotomozaëken (winteropnamen) die voor ieder deel  van Vlaanderen beschikbaar zijn en wordt  bijgewerkt telkens er een nieuw deel ingewonnen is. De compilatie heeft een grondresolutie van 25 cm.'
        },
        'Vliegdagcontour': {
          queryable: true,
          title: 'Vliegdagcontour Orthofotomozaïek',
          abstract: 'Deze vectorlaag geeft voor ieder deel van de rastercompilatie de opnamedatum weer.'
        }
      }
    },
    {
      id: 3203,
      title: 'PICC, Service de visualisation',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/TOPOGRAPHIE/PICC_VDIFF/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.654315, 6.636506, 57.020365, 51.110628],
      zoomRange: [16, 22],
      format: 'image/png',
      area: 'BE',
      abstract: 'Service de visualisation du Projet Informatique de Cartographie Continue (PICC)',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['traceGrayscalePixels'],
      getExternalUrl: () => 'http://geoportail.wallonie.be/walonmap',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['1', '3', '4', '5', '7', '9', '10', '11', '12', '13', '14', '16', '17', '18', '19', '21', '22', '23', '24', '26', '27', '28', '29', '30', '31', '32'],
      layers: {
        '1': {
          queryable: true,
          title: 'Relief: ligne'
        },
        '3': {
          queryable: true,
          title: 'Hydrographie: emprise'
        },
        '4': {
          queryable: true,
          title: 'Hydrographie: bord'
        },
        '5': {
          queryable: true,
          title: 'Hydrographie: axe'
        },
        '7': {
          queryable: true,
          title: 'Reseau ferroviaire: ligne'
        },
        '9': {
          queryable: true,
          title: 'Voirie: surface'
        },
        '10': {
          queryable: true,
          title: 'Voirie: axe (>= 50k)'
        },
        '11': {
          queryable: true,
          title: 'Voirie: axe (5k-50k)'
        },
        '12': {
          queryable: true,
          title: 'Voirie: axe'
        },
        '13': {
          queryable: true,
          title: 'Voirie: ligne'
        },
        '14': {
          queryable: true,
          title: 'Voirie: noeud'
        },
        '16': {
          queryable: true,
          title: 'Occupation du sol: surface'
        },
        '17': {
          queryable: true,
          title: 'Occupation du sol: bord'
        },
        '18': {
          queryable: true,
          title: 'Occupation du sol: ligne'
        },
        '19': {
          queryable: true,
          title: 'Occupation du sol: point'
        },
        '21': {
          queryable: true,
          title: 'Construction: emprise d\'ouvrage d\'art'
        },
        '22': {
          queryable: true,
          title: 'Construction: emprise du batiment'
        },
        '23': {
          queryable: true,
          title: 'Construction: ouvrage d\'art: bord'
        },
        '24': {
          queryable: true,
          title: 'Construction: bord du batiment'
        },
        '26': {
          queryable: true,
          title: 'Equipement: surface'
        },
        '27': {
          queryable: true,
          title: 'Equipement: axe'
        },
        '28': {
          queryable: true,
          title: 'Equipement: ligne'
        },
        '29': {
          queryable: true,
          title: 'Equipement: point'
        },
        '30': {
          queryable: true,
          title: 'Symbologie'
        },
        '31': {
          queryable: true,
          title: 'Adresses'
        },
        '32': {
          queryable: true,
          title: 'Toponymie'
        }
      }
    },
    {
      id: 3204,
      title: 'Brussels CIRB (NL)',
      type: 'WMS',
      url: 'https://geoservices-urbis.irisnet.be/geoserver/BaseMaps/ows',
      crs: 'EPSG:31370',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Brusselse kaartgegevens',
      attribution: 'Irisnet GIS',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['BaseMaps:UrbISDutchLabeledColor'],
      layers: {
        'BaseMaps:UrbISDutchLabeledColor': {
          queryable: false,
          title: 'Urbis Base Map NL',
          abstract: 'This layer represents the base map in dutch.'
        },
        'BaseMaps:UrbISDutchLabeledGray': {
          queryable: false,
          title: 'Urbis Base Map Gray NL',
          abstract: 'This layer represents the gray base map in dutch.'
        },
        'urbisvector:StreetAxes': {
          queryable: true,
          title: 'Labeled Street Axe',
          abstract: 'Labeled StreetAxe for OSIRIS'
        },
        'urbisvector:StreetAxes_Underground': {
          queryable: true,
          title: 'Labeled Street Axe Underground',
          abstract: 'Labeled StreetAxe for OSIRIS'
        },
        'inspire:AD.Address': {
          queryable: true,
          title: 'Address points (INSPIRE)',
          abstract: 'This layer is the localization of address points of the Brussels Region'
        },
        'urbisvector:AddressNumbers': {
          queryable: true,
          title: 'Address points',
          abstract: 'This layer is the localization of address points of the Brussels Region'
        },
        'inspire:Bu': {
          queryable: true,
          title: 'Buildings (INSPIRE)',
          abstract: 'This layer represents the buildings of the Brussels Region'
        },
        'urbisvector:Buildings': {
          queryable: true,
          title: 'Buildings',
          abstract: 'This layer represents the buildings of the Brussels Region'
        },
        'urbisvector:MonitoringDistricts': {
          queryable: true,
          title: 'Monitoring districts',
          abstract: 'This layer reprensent the monitoring districts of the Brussels Region'
        },
        'urbisvector:Municipalities': {
          queryable: true,
          title: 'Municipalities',
          abstract: 'This layer represents the municipalities of the Brussels Region'
        },
        'urbisvector:StreetSurfaces': {
          queryable: false,
          title: 'Street surfaces',
          abstract: 'This layer represents the street sections of the Brussels Region'
        },
        'urbisvector:StreetSurfaces_Underground': {
          queryable: false,
          title: 'Street surfaces Underground',
          abstract: 'This layer represents the street sections of the Brussels Region'
        },
        'urbisvector:Region': {
          queryable: false,
          title: 'Region',
          abstract: 'This layer is the Brussels Region'
        },
        'urbisvector:StatisticalSectors': {
          queryable: true,
          title: 'Statistical sectors',
          abstract: 'This layer represents the limit of the statistical districts of the Brussels Region'
        },
        'urbisvector:StreetNodes': {
          queryable: false,
          title: 'Street nodes',
          abstract: 'This layer represents the street nodes. Each node is an intersection or an extremity of a street axe'
        },
        'urbisvector:TrainNetwork': {
          queryable: false,
          title: 'Rail tracks',
          abstract: 'This layer represents the rails tracks.'
        },
        'urbisvector:TrainNetwork_Underground': {
          queryable: false,
          title: 'Rail tracks Underground',
          abstract: 'This layer represents the rails tracks.'
        },
        'inspire:GN.GeographicalNames': {
          queryable: true,
          title: 'Geographical Names',
          abstract: 'This layer represents the toponymy of public places.'
        },
        'urbisvector:PointsOfInterest': {
          queryable: true,
          title: 'Points of interest',
          abstract: 'This layer represents the point of zone of interest.'
        },
        'urbistopo:TopoLines': {
          queryable: false,
          title: 'Urbis Topo Lines',
          abstract: 'This layer represents the topo lines.'
        },
        'urbistopo:TopoPoints': {
          queryable: true,
          title: 'Urbis Topo Points',
          abstract: 'This layer represents the topo points.'
        }
      }
    },
    {
      id: 3206,
      title: 'Ortho Vlaanderen Tijdsreeksen',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/OMW/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.940002, 51.510003],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Tijdsreeks van middenschalige orthofotomozaïeken met een resolutie van 25cm, gebiedsdekkend voor Vlaanderen',
      attribution: 'Agentschap Informatie Vlaanderen',
      pixelManipulations: ['whiteTiles2transparent'],
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['OMWRGB22VL', 'OMWRGB22VL_VDC'],
      layers: {
        'OMWRGB22VL': {
          queryable: false,
          title: 'Winteropnamen, 2022',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2022 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB22VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2022, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB21VL': {
          queryable: false,
          title: 'Winteropnamen, 2021',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2021 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB21VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2021, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB20VL': {
          queryable: false,
          title: 'Winteropnamen, 2020',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2020 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB20VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2020, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB19VL': {
          queryable: false,
          title: 'Winteropnamen, 2019',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2019 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB19VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2019, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB18VL': {
          queryable: false,
          title: 'Winteropnamen, 2018',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2018 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB18VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2018, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB17VL': {
          queryable: false,
          title: 'Winteropnamen, 2017',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2017 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB17VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2017, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB16VL': {
          queryable: false,
          title: 'Winteropnamen, 2016',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2016 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB16VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2016, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB15VL': {
          queryable: false,
          title: 'Winteropnamen, 2015',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2015 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB15VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2015, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB14VL': {
          queryable: false,
          title: 'Winteropnamen, 2014',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2014 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB14VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2014, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB13VL': {
          queryable: false,
          title: 'Winteropnamen, 2013',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2013 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB13VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2013, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB12VL': {
          queryable: false,
          title: 'Winteropnamen, 2012',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in 2012 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB12VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2012, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB08_11VL': {
          queryable: false,
          title: 'Winteropnamen, 2008-2011',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in de periode 2008-2011 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB08_11VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2008-2011, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB05_07VL': {
          queryable: false,
          title: 'Winteropnamen, 2005-2007',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in de periode 2005-2007 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB05_07VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2005-2007, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        },
        'OMWRGB00_03VL': {
          queryable: false,
          title: 'Winteropnamen, 2000-2003',
          abstract: 'Deze rasterlaag is een compilatie van de orthofotomozaïeken (winteropnamen) die voor Vlaanderen in de periode 2000-2003 werden aangemaakt. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OMWRGB00_03VL_VDC': {
          queryable: true,
          title: 'Winteropnamen, 2000-2003, vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        }
      }
    },
    {
      id: 3207,
      title: 'Wegenregister',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/Wegenregister/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.939993, 51.509997],
      format: 'image/png',
      area: 'BE',
      abstract: 'De wegen in het Wegenregister. Het Wegenregister is een middenschalig referentiebestand van de wegen in Vlaanderen. Het bevat alle wegen van Vlaanderen, met bijhorende attribuutgegevens.',
      attribution: 'Agentschap Informatie Vlaanderen',
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&kaart=wegennet&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['AUTOSWEG', 'WEGGESCH', 'WEGEEN', 'ROT', 'SPECSIT', 'VERKPLEIN', 'OPAFOGKR', 'OPAFGGKR', 'PLLWEG', 'VENTWEG', 'INUITP', 'INUITD', 'VOETGANGERSZONE', 'WANDFIETS', 'TRAMWEG', 'DIENSTWEG', 'AARDEWEG', 'VEER', 'TYPENTG', 'LABELS'],
      layers: {
        'AUTOSWEG': {
          queryable: true,
          title: 'Autosnelweg',
          abstract: 'Een "autosnelweg" heeft typisch twee gescheiden parallelle rijbanen met tegengestelde toegelaten rijrichtingen. Op een autosnelweg komen geen gelijkgrondse kruisingen voor. Kruisingen met andere wegen gebeuren steeds ofwel over bruggen of in tunnels.'
        },
        'WEGGESCH': {
          queryable: true,
          title: 'Weg met gescheiden rijbanen',
          abstract: '"Een weg met gescheiden rijbanen die geen autosnelweg is" wordt gekenmerkt door de aanwezigheid van minstens twee rijbanen (onafhankelijk van het aantal rijstroken) die fysiek gescheiden zijn en tegengestelde toegelaten rijrichtingen hebben.'
        },
        'WEGEEN': {
          queryable: true,
          title: 'Weg met één rijbaan',
          abstract: 'Wegsegmenten die behoren tot een hoofdcirculatiezone die gekenmerkt wordt door de aanwezigheid van slechts één circulatievak in de dwarsrichting.'
        },
        'ROT': {
          queryable: true,
          title: 'Rotonde',
          abstract: 'Wegsegmenten die tot de rotonde behoren vormen een gesloten ringvormige structuur. Op deze wegsegmenten is enkel éénrichtingsverkeer toegelaten.'
        },
        'SPECSIT': {
          queryable: true,
          title: 'Speciale verkeerssituatie',
          abstract: 'Wegsegmenten die behoren tot een min of meer cirkelvormige constructie die geen rotonde is.'
        },
        'VERKPLEIN': {
          queryable: true,
          title: 'Verkeersplein',
          abstract: 'Wegsegmenten die worden opgenomen in gebieden waar het verkeer ongestructureerd verloopt. Het gaat typisch om marktpleinen, parkeerterreinen of terreinen met een andere functie dan een zuivere verkeersfunctie'
        },
        'OPAFOGKR': {
          queryable: true,
          title: 'Oprit of afrit behorende tot een nietgelijkgrondse kruising',
          abstract: 'Een "op- of afrit, behorende tot een niet-gelijkgrondse kruising" verzorgt de verbinding tussen twee wegen die zich niet-gelijkgronds kruisen. Alle op- en afritten van autosnelwegen en verkeerswisselaars worden eveneens tot deze klasse gerekend.'
        },
        'OPAFGGKR': {
          queryable: true,
          title: 'Oprit of afrit  behorende tot een gelijkgrondse kruising',
          abstract: 'Een "op- of afrit, behorende tot een gelijkgrondse kruising" verzorgt de verbinding tussen twee wegen die geen autosnelweg zijn. Zonder de op- of afrit bestaat er nog steeds een topologische verbinding tussen de wegsegmenten waarbij de op- of afrit hoort.'
        },
        'PLLWEG': {
          queryable: true,
          title: 'Parallelweg',
          abstract: 'Een "parallelweg" is een op- of afrit waarvan de begin- en eindpositie verbonden is met dezelfde autosnelweg. Een "parallelweg" heeft een rechtstreekse verbinding of een verbinding via op- of afritten van een ander type met de bijhorende autosnelweg.'
        },
        'VENTWEG': {
          queryable: true,
          title: 'Ventweg',
          abstract: 'Een "ventweg" loopt parallel aan een weg met een belangrijke verkeersfunctie die geen autosnelweg is. De weg biedt toegang tot minder belangrijke aanpalende wegen, bestemmingen of adressen en wordt van de hoofdweg gescheiden door kleine constructies.'
        },
        'INUITP': {
          queryable: true,
          title: 'Inrit of uitrit van een parking',
          abstract: 'Een "in- of uitrit van een parking" is een weg die speciaal ontworpen is om een parkeerterrein of parkeergarage te bereiken of te verlaten.'
        },
        'INUITD': {
          queryable: true,
          title: 'Inrit of uitrit van een dienst',
          abstract: 'Een "in- of uitrit van een dienst" is een weg die speciaal ontworpen is om een dienst (voorbeeld: luchthaven, station, ziekenhuis, brandweerkazerne, politie, openbare dienst, hotel, restaurant) te bereiken of te verlaten.'
        },
        'VOETGANGERSZONE': {
          queryable: true,
          title: 'Voetgangerszone',
          abstract: 'Gebied met een wegennet dat speciaal ontworpen is voor gebruik door voetgangers (meestal gesitueerd in stedelijke gebieden). In voetgangerszones is enkel voetgangersverkeer toegelaten (uitzondering: prioritaire voertuigen en leveringen).'
        },
        'WANDFIETS': {
          queryable: true,
          title: 'Wandel- of fietsweg',
          abstract: 'Op een "wandel- en/of fietsweg" is de verkeerstoegang beperkt tot voetgangers en/of fietsers. De fysieke kenmerken van een "wandel- en/of fietsweg" laten de toegang van andere voertuigen niet toe (smaller dan 2.5m).'
        },
        'TRAMWEG': {
          queryable: true,
          title: 'Tramweg',
          abstract: 'Een "tramweg" is een weg die speciaal ontworpen is voor het tramverkeer. De fysieke kenmerken van een "tramweg" laten de toegang van andere voertuigen niet toe.'
        },
        'DIENSTWEG': {
          queryable: true,
          title: 'Dienstweg',
          abstract: 'Een "tramweg" is een weg die speciaal ontworpen is voor het tramverkeer. De fysieke kenmerken van een "tramweg" laten de toegang van andere voertuigen niet toe.'
        },
        'AARDEWEG': {
          queryable: true,
          title: 'Aardeweg',
          abstract: 'Een "aardeweg" is een weg zonder wegverharding die op zijn minst berijdbaar is voor bepaalde vierwielige motorvoertuigen (bv. terreinwagens, landbouwvoertuigen,...)'
        },
        'VEER': {
          queryable: true,
          title: 'Veer',
          abstract: 'Een "veer" is bedoeld voor het transport van passagiers, voertuigen of vracht over het water en verbindt vaak twee of meerdere landwegen'
        },
        'TYPENTG': {
          queryable: true,
          title: 'Type weg niet gekend',
          abstract: 'Wegtype is niet gekend'
        },
        'LABELS': {
          queryable: false,
          title: 'Straatnamen',
          abstract: 'Straatnamen volgens CRAB'
        }
      }
    },
    {
      id: 3208,
      title: 'Administratieve eenheden',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/Administratieve_Eenheden/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.939993, 51.509997],
      format: 'image/png',
      area: 'BE',
      abstract: 'Vlaamse administratieve eenheden',
      attribution: 'AIV',
      pixelManipulations: ['traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['Refarr', 'Refprv', 'Refgew', 'RefgemGrens', 'RefgemBron', 'RefgemLabel'],
      layers: {
        'Refgem': {
          queryable: true,
          title: 'Gemeenten',
          abstract: 'Ligging en afgrenzing van de vastgestelde territoria van gemeenten. Gemeenten zijn de laagste bestuurlijke eenheden in België. Gemeenten zijn gegroepeerd in bestuurlijke arrondissementen en provincies. Door het samenwerkingsverband GDI-Vlaanderen als voorlopige referentie gehanteerde geografische dataset van het grondgebied van Vlaanderen met de begrenzing van de Vlaamse gemeenten met bijhorende identificerende informatie.'
        },
        'Refarr': {
          queryable: true,
          title: 'Arrondissementen - Grenzen',
          abstract: 'Afgrenzing van bestuurlijke arrondissementen in Vlaanderen. Bestuurlijke arrondissementen vormen een administratieve indeling van de provincies. Het gaat om een groepering van een aantal gemeenten. Door het samenwerkingsverband GDI-Vlaanderen als voorlopige referentie gehanteerde geografische dataset van het grondgebied met de begrenzing van Vlaamse bestuurlijke indelingen.'
        },
        'Refprv': {
          queryable: true,
          title: 'Provincies - Grenzen',
          abstract: 'Afgrenzing van provincies in Vlaanderen. Provincies vormen een administratieve indeling van het Vlaams Gewest. De provincies vormen het bestuurlijke niveau tussen de gemeenten en arrondissementen enerzijds en het Vlaams Gewest anderzijds. Door het samenwerkingsverband GDI-Vlaanderen als voorlopige referentie gehanteerde geografische dataset van het grondgebied van Vlaanderen met bestuurlijke indelingen.'
        },
        'Refgew': {
          queryable: true,
          title: 'Gewest - Grens',
          abstract: 'Grens van het Vlaams Gewest. Door het samenwerkingsverband GDI-Vlaanderen als voorlopig referentie gehanteerde geografische dataset van het grondgebied en de afgrenzing van het Vlaams Gewest'
        },
        'RefgemGrens': {
          queryable: true,
          title: 'Gemeenten - Grenzen',
          abstract: 'Grenzen van de vastgestelde territoria van gemeenten. Gemeenten zijn de laagste bestuurlijke eenheden in België. Gemeenten zijn gegroepeerd in bestuurlijke arrondissementen en provincies. Door het samenwerkingsverband GDI-Vlaanderen als voorlopige referentie gehanteerde geografische dataset van het grondgebied van Vlaanderen met de begrenzing van de Vlaamse gemeenten met bijhorende identificerende informatie.'
        },
        'RefgemBron': {
          queryable: true,
          title: 'Gemeenten - Grenzen - Bron Geometrie',
          abstract: 'Informatie over de herkomst van de geometrische informatie van (een deel van) een gemeentegrens.'
        },
        'RefgemLabel': {
          queryable: true,
          title: 'Gemeenten - Namen',
          abstract: 'Label met de naam van de gemeente. Gemeenten zijn de laagste bestuurlijke eenheden in België. Gemeenten zijn gegroepeerd in bestuurlijke arrondissementen en provincies. Door het samenwerkingsverband GDI-Vlaanderen als voorlopige referentie gehanteerde geografische dataset van het grondgebied van Vlaanderen met de begrenzing van de Vlaamse gemeenten met bijhorende identificerende informatie.'
        }
      }
    },
    {
      id: 3209,
      title: 'Orthofotowerkbestand Vlaanderen',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/ofw/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.940002, 51.510003],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Compilatie van de meest recente orthofotowerkbestanden voor Vlaanderen',
      attribution: 'Agentschap Informatie Vlaanderen',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['OFW', 'OFW_vdc'],
      layers: {
        'OFW': {
          queryable: false,
          title: 'Orthofotowerkbestand',
          abstract: 'Deze rasterlaag is een compilatie van de meest recente orthofotowerkbestanden die voor Vlaanderen  beschikbaar zijn. De compilatie heeft een grondresolutie van 25cm.'
        },
        'OFW_vdc': {
          queryable: true,
          title: 'Vliegdagcontour',
          abstract: 'Vectorlaag die voor ieder deel van het bijhorende product de opnamedatum weergeeft.'
        }
      }
    },
    {
      id: 3211,
      title: 'Ortho Vl. 2013-2015 Grootschalig',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/OGW/wms',
      crs: 'EPSG:3857',
      bbox: [2.519999, 50.639999, 5.940002, 51.510003],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Tijdsreeks van grootschalige orthofotomozaïeken met een resolutie van 10cm, gebiedsdekkend voor Vlaanderen',
      attribution: 'Agentschap Informatie Vlaanderen',
      pixelManipulations: ['whiteTiles2transparent'],
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&kaart=Luchtfoto Vlaanderen, winter 2013-2015 - kleur&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['OGWRGB13_15VL', 'OGWRGB13_15VL_vdc'],
      layers: {
        'OGWRGB13_15VL': {
          queryable: false,
          title: 'Orthofotomozaïek, grootschalig, winteropnamen, kleur, 2013-2015, Vlaanderen',
          abstract: 'Deze rasterlaag is een compilatie van de grootschalige orthofotomozaïeken (winteropnamen) die voor Vlaanderen in de periode 2013-2015 werden aangemaakt. De compilatie heeft een grondresolutie van 10cm.'
        },
        'OGWRGB13_15VL_vdc': {
          queryable: true,
          title: 'Vliegdagcontour, grootschalig, winteropnamen, kleur, 2013-2015, Vlaanderen'
        }
      }
    },
    {
      id: 3212,
      title: 'Snelheidsregimes en referentiepunten AWV',
      type: 'WMS',
      url: 'https://opendata.apps.mow.vlaanderen.be/opendata-geoserver/awv/ows',
      crs: 'EPSG:3857',
      bbox: [2.539465, 50.681421, 5.892607, 51.500095],
      format: 'image/png',
      area: 'BE',
      abstract: 'Snelheidsregimes langs de genummerde wegen in beheer van AWV',
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Geopunt-kaart_app&kaart=Snelheidsregimes&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      attribution: 'Agentschap Informatie Vlaanderen',
      pixelManipulations: ['removePartialBlackTransparency', 'traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['awv:Snelheidsregimes', 'awv:Referentiepunten'],
      layers: {
        'awv:Snelheidsregimes': {
          queryable: true,
          title: 'Snelheidsregimes langs de genummerde wegen in beheer van AWV',
          abstract: 'Snelheidsregimes zijn delen van een genummerde weg met een uniforme maximale snelheid. De snelheidsregimes zijn lineaire weergaves van een (deel van) de wegen met aanduiding van een uniforme maximum snelheid.'
        },
        'awv:Referentiepunten': {
          queryable: true,
          title: 'Km en hm referentiepunten',
          abstract: 'Posities van de km en hm referentiepunten langs de Vlaamse autosnelwegen en gewestwegen met de bijbehorende kilometer-/ hectometeraanduidingen'
        }
      }
    },
    {
      id: 3216,
      title: 'Orthophotos 2016',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2016/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.832011, 49.434306, 6.465498, 50.880207],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Service de visualisation INSPIRE permettant la visualisation de l\'image orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm pour l\'année 2016.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2016 et le 1er novembre 2016. Ce service affiche 3 des 4 bandes disponibles (rouge, vert et bleu) en couleurs naturelles.\nCe service n\'est pas tuilé.',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'ORTHO_2016',
          abstract: 'Imagerie orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2016 et le 1er novembre 2016. Quatre bandes spectrales sont disponibles (rouge, vert, bleu et le proche infra-rouge).\nLe recouvrement longitudinal minimal des photos successives d’une même bande est de 60% avec une tolérance de 5%. D’autre part, le recouvrement latéral minimal entre bandes parallèles successives est de 30%, avec une tolérance de 5%. Les mailles sont de 2 km sur 2km.\nLes métadonnées des orthophotos (date et heure de prise de vue, angle solaire, etc.) sont disponibles sous forme de données attributaires dans la donnée "Orthophotos 2016 - Tuilage".'
        }
      }
    },
    {
      id: 3217,
      title: 'Réseau routier régional',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/MOBILITE/RES_ROUTIER_REGIONAL/MapServer/WmsServer',
      crs: 'EPSG:3857',
      bbox: [2.654315, 49.426121, 6.651405, 51.110628],
      format: 'image/png',
      area: 'BE',
      abstract: 'Consultation, recherche et identification des données relatives au Réseau routier régional wallon et aux bornes kilométriques.',
      attribution: 'Service publique de Wallonie',
      pixelManipulations: ['traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['1', '2', '3', '5', '6'],
      layers: {
        '1': {
          queryable: true,
          title: 'Nationales',
          abstract: 'Pour plus d\'informations sur cette donnée, consultez http://geoportail.wallonie.be/catalogue/bdcb789c-4b02-4c0c-863a-98dac4ed0240.html'
        },
        '2': {
          queryable: true,
          title: 'Rings',
          abstract: 'Pour plus d\'informations sur cette donnée, consultez http://geoportail.wallonie.be/catalogue/bdcb789c-4b02-4c0c-863a-98dac4ed0240.html'
        },
        '3': {
          queryable: true,
          title: 'Autoroutes',
          abstract: 'Pour plus d\'informations sur cette donnée, consultez http://geoportail.wallonie.be/catalogue/bdcb789c-4b02-4c0c-863a-98dac4ed0240.html'
        },
        '5': {
          queryable: true,
          title: 'Bornes kilométriques',
          abstract: 'Pour plus d\'informations sur cette donnée, consultez http://geoportail.wallonie.be/catalogue/b1882436-3016-421e-9dfd-0326cca998f2.html'
        },
        '6': {
          queryable: true,
          title: 'Bornes hectométriques',
          abstract: 'Pour plus d\'informations sur cette donnée, consultez http://geoportail.wallonie.be/catalogue/b1882436-3016-421e-9dfd-0326cca998f2.html'
        }
      }
    },
    {
      id: 3220,
      title: 'Verkeersborden Vlaanderen',
      type: 'WMS',
      url: 'https://opendata.apps.mow.vlaanderen.be/opendata-geoserver/awv/ows',
      crs: 'EPSG:3857',
      bbox: [2.50727, 50.661802, 5.957286, 51.519573],
      format: 'image/png',
      area: 'BE',
      abstract: 'Puntvoorstelling van de verkeersborden uit de toepassing Verkeersborden.Vlaanderen',
      attribution: 'MOW Vlaanderen',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['awv:Verkeersborden.Vlaanderen_Borden'],
      layers: {
        'awv:Verkeersborden.Vlaanderen_Borden': {
          title: 'Verkeersborden.Vlaanderen',
          queryable: true
        }
      }
    },
    {
      id: 3221,
      title: 'Afgeleide snelheidsregimes',
      type: 'WMS',
      url: 'https://opendata.apps.mow.vlaanderen.be/opendata-geoserver/awv/ows',
      crs: 'EPSG:3857',
      bbox: [2.52988, 50.629179, 5.971281, 51.505513],
      format: 'image/png',
      area: 'BE',
      abstract: 'Kaart van de afgeleide snelheidsregimes op wegen gelegen in het Vlaams gewest. Het basis van het wegenbestand waarop de snelheidsregimes zijn geprojecteerd is steeds de laatste versie van het Wegenregister zoals gepubliceerd op de website van Informatie Vlaanderen. De opstellingen in de Verkeersborden.Vlaanderen databank dienen als basisbestand voor de afgeleide data. De kwaliteit van de afgeleide data hangt af van de correctheid van zowel het Wegenregister als de data is Verkeersborden.Vlaanderen.',
      attribution: 'MOW Vlaanderen',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['awv:Afgeleide_snelheidsregimes'],
      layers: {
        'awv:Afgeleide_snelheidsregimes': {
          title: 'Afgeleide snelheidsregimes',
          queryable: true
        }
      }
    },
    {
      id: 3222,
      title: 'Brussels CIRB (FR)',
      type: 'WMS',
      url: 'https://geoservices-urbis.irisnet.be/geoserver/BaseMaps/ows',
      crs: 'EPSG:31370',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Données de carte Bruxelloises',
      attribution: 'Irisnet GIS',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['BaseMaps:UrbISFrenchLabeledColor'],
      layers: {
        'BaseMaps:UrbISFrenchLabeledColor': {
          queryable: false,
          title: 'Urbis Base Map FR',
          abstract: 'This layer represents the base map in french.'
        },
        'BaseMaps:UrbISFrenchLabeledGray': {
          queryable: false,
          title: 'Urbis Base Map Gray FR',
          abstract: 'This layer represents the gray base map in french.'
        },
        'urbisvector:StreetAxes': {
          queryable: true,
          title: 'Labeled Street Axe',
          abstract: 'Labeled StreetAxe for OSIRIS'
        },
        'urbisvector:StreetAxes_Underground': {
          queryable: true,
          title: 'Labeled Street Axe Underground',
          abstract: 'Labeled StreetAxe for OSIRIS'
        },
        'inspire:AD.Address': {
          queryable: true,
          title: 'Address points (INSPIRE)',
          abstract: 'This layer is the localization of address points of the Brussels Region'
        },
        'urbisvector:AddressNumbers': {
          queryable: true,
          title: 'Address points',
          abstract: 'This layer is the localization of address points of the Brussels Region'
        },
        'inspire:Bu': {
          queryable: true,
          title: 'Buildings (INSPIRE)',
          abstract: 'This layer represents the buildings of the Brussels Region'
        },
        'urbisvector:Buildings': {
          queryable: true,
          title: 'Buildings',
          abstract: 'This layer represents the buildings of the Brussels Region'
        },
        'urbisvector:MonitoringDistricts': {
          queryable: true,
          title: 'Monitoring districts',
          abstract: 'This layer reprensent the monitoring districts of the Brussels Region'
        },
        'urbisvector:Municipalities': {
          queryable: true,
          title: 'Municipalities',
          abstract: 'This layer represents the municipalities of the Brussels Region'
        },
        'urbisvector:StreetSurfaces': {
          queryable: false,
          title: 'Street surfaces',
          abstract: 'This layer represents the street sections of the Brussels Region'
        },
        'urbisvector:StreetSurfaces_Underground': {
          queryable: false,
          title: 'Street surfaces Underground',
          abstract: 'This layer represents the street sections of the Brussels Region'
        },
        'urbisvector:Region': {
          queryable: false,
          title: 'Region',
          abstract: 'This layer is the Brussels Region'
        },
        'urbisvector:StatisticalSectors': {
          queryable: true,
          title: 'Statistical sectors',
          abstract: 'This layer represents the limit of the statistical districts of the Brussels Region'
        },
        'urbisvector:StreetNodes': {
          queryable: false,
          title: 'Street nodes',
          abstract: 'This layer represents the street nodes. Each node is an intersection or an extremity of a street axe'
        },
        'urbisvector:TrainNetwork': {
          queryable: false,
          title: 'Rail tracks',
          abstract: 'This layer represents the rails tracks.'
        },
        'urbisvector:TrainNetwork_Underground': {
          queryable: false,
          title: 'Rail tracks Underground',
          abstract: 'This layer represents the rails tracks.'
        },
        'inspire:GN.GeographicalNames': {
          queryable: true,
          title: 'Geographical Names',
          abstract: 'This layer represents the toponymy of public places.'
        },
        'urbisvector:PointsOfInterest': {
          queryable: true,
          title: 'Points of interest',
          abstract: 'This layer represents the point of zone of interest.'
        },
        'urbistopo:TopoLines': {
          queryable: false,
          title: 'Urbis Topo Lines',
          abstract: 'This layer represents the topo lines.'
        },
        'urbistopo:TopoPoints': {
          queryable: true,
          title: 'Urbis Topo Points',
          abstract: 'This layer represents the topo points.'
        }
      }
    },
    {
      id: 3223,
      title: 'Brussels Ortho',
      type: 'WMS',
      url: 'https://geoservices-urbis.irisnet.be/geoserver/urbisgrid/ows',
      crs: 'EPSG:31370',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Orthographic map of Brussels',
      attribution: 'Irisnet GIS',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['Ortho'],
      layers: {
        'Ortho': {
          queryable: false,
          title: 'Latest Ortho',
          abstract: 'This layer always shows the most recent available orthographic images'
        },
        'Ortho2024Eo': {
          queryable: false,
          title: 'Ortho 2024 East-West',
          abstract: 'Orthographic imagery for the year 2024 from a flight on an east-west axis within the Brussels region'
        },
        'Ortho2024NirEo': {
          queryable: false,
          title: 'Ortho 2024 Near Infrared',
          abstract: 'NI (Near Infrared) orthophotos for the year 2024 from a flight on an east-west axis within the Brussels region'
        },
        'Ortho2024NirNs': {
          queryable: false,
          title: 'Ortho 2024 Near Infrared North-South',
          abstract: 'Orthographic imagery for the year 2024 from a flight on an north-south axis within the Brussels region'
        },
        'Ortho2024Ns': {
          queryable: false,
          title: 'Ortho 2024 North-South',
          abstract: 'Orthographic imagery for the year 2024 from a flight on an north-south axis within the Brussels region'
        },
        'Ortho2023Nir': {
          queryable: false,
          title: 'Ortho 2023 Near Infrared',
          abstract: 'NI (Near Infrared) orthophotos for the year 2023 within the Brussels region'
        },
        'Ortho2023': {
          queryable: false,
          title: 'Ortho 2023',
          abstract: 'Orthographic imagery for the year 2023 within the Brussels region'
        },
        'Ortho2022Ns': {
          queryable: false,
          title: 'Ortho 2022 North-South',
          abstract: 'Orthographic imagery for the year 2022 from a flight on an north-south axis within the Brussels region'
        },
        'Ortho2022Eo': {
          queryable: false,
          title: 'Ortho 2022 East-West',
          abstract: 'Orthographic imagery for the year 2022 from a flight on an east-west axis within the Brussels region'
        },
        'Ortho2021Ns': {
          queryable: false,
          title: 'Ortho 2021 North-South',
          abstract: 'Orthographic imagery for the year 2021 from a flight on an north-south axis within the Brussels region'
        },
        'Ortho2021Eo': {
          queryable: false,
          title: 'Ortho 2021 East-West',
          abstract: 'Orthographic imagery for the year 2021 from a flight on an east-west axis within the Brussels region'
        },
        'Ortho2020': {
          queryable: false,
          title: 'Ortho 2020',
          abstract: 'Orthographic imagery for the year 2020 within the Brussels region'
        },
        'Ortho2019': {
          queryable: false,
          title: 'Ortho 2019',
          abstract: 'Orthographic imagery for the year 2019 within the Brussels region'
        },
        'Ortho2018': {
          queryable: false,
          title: 'Ortho 2018',
          abstract: 'Orthographic imagery for the year 2018 within the Brussels region'
        },
        'Ortho2017': {
          queryable: false,
          title: 'Ortho 2017',
          abstract: 'Orthographic imagery for the year 2017 within the Brussels region'
        },
        'Ortho2016': {
          queryable: false,
          title: 'Ortho 2016',
          abstract: 'Orthographic imagery for the year 2016 within the Brussels region'
        },
        'Ortho2015': {
          queryable: false,
          title: 'Ortho 2015',
          abstract: 'Orthographic imagery for the year 2015 within the Brussels region'
        },
        'Ortho2014': {
          queryable: false,
          title: 'Ortho 2014',
          abstract: 'Orthographic imagery for the year 2014 within the Brussels region'
        },
        'Ortho2012': {
          queryable: false,
          title: 'Ortho 2012',
          abstract: 'Orthographic imagery for the year 2012 within the Brussels region'
        },
        'Ortho2009': {
          queryable: false,
          title: 'Ortho 2009',
          abstract: 'Orthographic imagery for the year 2009 within the Brussels region'
        },
        'Ortho2004': {
          queryable: false,
          title: 'Ortho 2004',
          abstract: 'Orthographic imagery for the year 2004 within the Brussels region'
        }
      }
    },
    {
      id: 3224,
      title: 'Brussels Road Hierarchy',
      type: 'WMS',
      url: 'https://data.mobility.brussels/geoserver/bm_network/wms',
      crs: 'EPSG:3857',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Road hierarchy maintained by Brussels Mobility',
      attribution: 'Brussels Mobility',
      pixelManipulations: ['brusselsSwapColours'],
      queryable: false,
      default_layers: ['specialisation_vp'],
      layers: {
        'specialisation_vp': {
          queryable: false,
          title: 'Road hierarchy'
        }
      }
    },
    {
      id: 3225,
      title: 'Brussels Zone 30',
      type: 'WMS',
      url: 'https://data.mobility.brussels/geoserver/bm_network/wms',
      crs: 'EPSG:3857',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Road speed limit data maintained by Brussels Mobility',
      attribution: 'Brussels Mobility',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['Zones_30_polygon'],
      layers: {
        'Zones_30_polygon': {
          queryable: true,
          title: 'Zone 30'
        }
      }
    },
    {
      id: 3226,
      title: 'Brussels Low Emission Zone',
      type: 'WMS',
      url: 'https://data.mobility.brussels/geoserver/bm_network/wms',
      crs: 'EPSG:3857',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      format: 'image/png',
      area: 'BE',
      abstract: 'Defines the contours of the low emission zone active in Brussels',
      attribution: 'Brussels Mobility',
      queryable: false,
      default_layers: ['lez_zone'],
      layers: {
        'lez_zone': {
          queryable: false,
          title: 'Low Emission Zone'
        }
      }
    },
    {
      id: 3227,
      title: 'Verkeersborden Vlaanderen Visualisatie',
      type: 'WMS',
      url: 'https://opendata.apps.mow.vlaanderen.be/opendata-geowebcache/service/wms',
      crs: 'EPSG:3857',
      bbox: [2.50727, 50.661802, 5.957286, 51.519573],
      format: 'image/png',
      area: 'BE',
      abstract: 'Grafische voorstelling van de verkeersborden uit de toepassing Verkeersborden.Vlaanderen',
      attribution: 'MOW Vlaanderen',
      pixelManipulations: ['addTranslucentOverlay'],
      queryable: false,
      default_layers: ['verkeersborden'],
      layers: {
        'verkeersborden': {
          title: 'Grafische voorstelling verkeersborden',
          queryable: false
        }
      }
    },
    {
      id: 3228,
      title: 'Orthophotos Récentes',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_LAST/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.832011, 49.434306, 6.465498, 50.880207],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Service de visualisation WMS référençant la dernière campagne disponible des images orthorectifiées couvrant le territoire de la Région Wallonne.',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'ORTHO',
          abstract: 'Dernière campagne disponible d\'imagerie orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm. Leur but initial était de servir de base au contrôles liés à la mise en oeuvre de la Politique Agricole Commune (PAC). Quatre bandes spectrales sont disponibles (Rouge, Vert, Bleu et Infra-rouge).'
        }
      }
    },
    {
      id: 3229,
      title: 'Orthophotos 2017',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2017/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.832011, 49.434306, 6.465498, 50.880207],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Service de visualisation INSPIRE permettant la visualisation de l\'image orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm pour l\'année 2017.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2017 et le 1er novembre 2017. Ce service affiche 3 des 4 bandes disponibles (rouge, vert et bleu) en couleurs naturelles.\nCe service n\'est pas tuilé.',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'ORTHO_2017',
          abstract: 'Imagerie orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2017 et le 1er novembre 2017. Quatre bandes spectrales sont disponibles (rouge, vert, bleu et le proche infra-rouge).\nLe recouvrement longitudinal minimal des photos successives d’une même bande est de 60% avec une tolérance de 5%. D’autre part, le recouvrement latéral minimal entre bandes parallèles successives est de 30%, avec une tolérance de 5%. Les mailles sont de 2 km sur 2km.\nLes métadonnées des orthophotos (date et heure de prise de vue, angle solaire, etc.) sont disponibles sous forme de données attributaires dans la donnée "Orthophotos 2017 - Tuilage".'
        }
      }
    },
    {
      id: 3230,
      title: 'Orthophotos 2018',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2018/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.832011, 49.434306, 6.465498, 50.880207],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Service de visualisation INSPIRE permettant la visualisation de l\'image orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm pour l\'année 2018.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2018 et le 1er novembre 2018. Ce service affiche 3 des 4 bandes disponibles (rouge, vert et bleu) en couleurs naturelles.\nCe service n\'est pas tuilé.',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'ORTHO_2018',
          abstract: 'Imagerie orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2018 et le 1er novembre 2018. Quatre bandes spectrales sont disponibles (rouge, vert, bleu et le proche infra-rouge).\nLe recouvrement longitudinal minimal des photos successives d’une même bande est de 60% avec une tolérance de 5%. D’autre part, le recouvrement latéral minimal entre bandes parallèles successives est de 30%, avec une tolérance de 5%. Les mailles sont de 2 km sur 2km.\nLes métadonnées des orthophotos (date et heure de prise de vue, angle solaire, etc.) sont disponibles sous forme de données attributaires dans la donnée "Orthophotos 2018 - Tuilage".'
        }
      }
    },
    {
      id: 3231,
      title: 'Orthophotos 2019',
      type: 'WMS',
      url: 'https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2019/MapServer/WMSServer',
      crs: 'EPSG:3857',
      bbox: [2.832011, 49.434306, 6.465498, 50.880207],
      format: 'image/jpeg',
      area: 'BE',
      abstract: 'Service de visualisation INSPIRE permettant la visualisation de l\'image orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm pour l\'année 2019.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2019 et le 1er novembre 2019. Ce service affiche 3 des 4 bandes disponibles (rouge, vert et bleu) en couleurs naturelles.\nCe service n\'est pas tuilé.',
      attribution: 'Service public de Wallonie',
      pixelManipulations: ['whiteTiles2transparent'],
      queryable: false,
      default_layers: ['0'],
      layers: {
        '0': {
          queryable: false,
          title: 'ORTHO_2019',
          abstract: 'Imagerie orthorectifiée et mosaïquée couvrant l\'entièreté du territoire wallon à une résolution de 25 cm.\nLes prises de vue ont été effectuées verticalement entre le 10 juin 2019 et le 1er novembre 2019. Quatre bandes spectrales sont disponibles (rouge, vert, bleu et le proche infra-rouge).\nLe recouvrement longitudinal minimal des photos successives d’une même bande est de 60% avec une tolérance de 5%. D’autre part, le recouvrement latéral minimal entre bandes parallèles successives est de 30%, avec une tolérance de 5%. Les mailles sont de 2 km sur 2km.\nLes métadonnées des orthophotos (date et heure de prise de vue, angle solaire, etc.) sont disponibles sous forme de données attributaires dans la donnée "Orthophotos 2019 - Tuilage".'
        }
      }
    },
    {
      id: 3232,
      title: 'Ville 30/Stad 30',
      type: 'WMS',
      url: 'https://data.mobility.brussels/geoserver/bm_network/wms',
      crs: 'EPSG:3857',
      bbox: [4.236257, 50.760569, 4.487579, 50.915368],
      zoomRange: [15, 22],
      format: 'image/png',
      area: 'BE',
      abstract: 'Future speed limits in Brussels Mobility (green/blue: 30, orange: 50, pink: 70, black: 90/120)',
      attribution: 'Brussels Mobility',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['ville30_detailed'],
      layers: {
        'ville30_detailed': {
          queryable: true,
          title: 'Road speeds'
        }
      }
    },
    {
      id: 3234,
      title: 'Cadastral Borders',
      type: 'WMS',
      url: 'https://ccff02.minfin.fgov.be/geoservices/arcgis/services/WMS/Cadastral_Layers/MapServer/WmsServer',
      crs: 'EPSG:3857',
      bbox: [2.541334, 6.408098, 49.496885, 51.505116],
      format: 'image/png',
      area: 'BE',
      abstract: 'Map of cadastral borders as they are defined at FPS Finances. This can often be used to find town borders.',
      attribution: 'FPS Finances - General Administration of Patrimonial Documentation',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: [ 'Regional_building', 'Cadastral_building', 'Cadastral_parcel', 'Polder_wateringue_zone', 'Address', 'Property_stone', 'Cadastral_block', 'Cadastral_section', 'Cadastral_division', 'Municipality', 'District', 'Province', 'Region', 'Country' ],
      layers: {
        'Regional_building': {
          queryable: true,
          title: 'Regional building',
          abstract: 'A regional building is a building managed by the Region.It comes from large-scale referentials (GRB for Flanders, Urbis for Brussel and PICC for Wallonia).'
        },
        'Cadastral_building': {
          queryable: true,
          title: 'Cadastral building',
          abstract: 'A cadastral building is a building whose GAPD (via the commune, the citizen, the site visit,...) has established that it has been put into service. A building has been put into service from the moment it is used according to its destination'
        },
        'Cadastral_parcel': {
          queryable: true,
          title: 'Cadastral parcel',
          abstract: 'A part of the Belgian territory, geographically defined and identified by the GAPD on the cadastral parcel plan, which corresponds to the surface area of one or more patrimonial cadastral parcels'
        },
        'Polder_wateringue_zone': {
          queryable: true,
          title: 'Polder wateringue zone',
          abstract: 'Polder and wateringue zone'
        },
        'Address': {
          queryable: true,
          title: 'Address',
          abstract: 'Police number of BestAdress'
        },
        'Property_stone': {
          queryable: true,
          title: 'Property stone',
          abstract: 'Property stone that have been placed to delimit a parcel'
        },
        'Cadastral_block': {
          queryable: true,
          title: 'Cadastral block',
          abstract: 'A cadastral parcel block is a set of adjacent parcels delimited by the public domain or by municipal boundaries'
        },
        'Cadastral_section': {
          queryable: true,
          title: 'Cadastral section',
          abstract: 'The cadastral sections  are divisions or parts of cadastral divisions'
        },
        'Cadastral_division': {
          queryable: true,
          title: 'Cadastral division',
          abstract: 'The cadastral divisions correspond with cadastral zones consisting of municipalities or parts of municipalities'
        },
        'Municipality': {
          queryable: true,
          title: 'Municipality',
          abstract: 'The boundaries of the municipalities are administrative units based on the administrative boundaries who delimit of the administrative entities at different hierarchical levels, in particular the municipalities, the districts, the provinces, the regions and the country'
        },
        'District': {
          queryable: true,
          title: 'District',
          abstract: 'The boundaries of the districts are administrative units based on the administrative boundaries who delimit the administrative entities on different hierarchical levels, particular the municipalities, the districts, the provinces, the regions and the country'
        },
        'Province': {
          queryable: true,
          title: 'Province',
          abstract: 'The boundaries of the provinces are administrative units based on the administrative boundaries who gives the delimitation of the administrative entities at different hierarchical levels, in particular the municipalities, the districts, the provinces, the regions and the country'
        },
        'Region': {
          queryable: true,
          title: 'Region',
          abstract: 'The boundaries of the regions are administrative units based on the administrative boundaries who delimit of the administrative entities at different hierarchical levels, in particular the municipalities, the districts, the provinces, the regions and the country'
        },
        'Country': {
          queryable: true,
          title: 'Country',
          abstract: 'The national borders are administrative units based on the administrative boundaries who delimit of the administrative entities at different hierarchical levels, in particular the municipalities, the districts, the provinces, the regions and the country'
        }
      }
    },
    {
      id: 3235,
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/VLAIO/wms',
      crs: 'EPSG:3857',
      bbox: [2.50727, 50.661802, 5.957286, 51.519573],
      format: 'image/png',
      title: 'Agentschap Innoveren en Ondernemen',
      area: 'BE',
      abstract: 'Bevat de locaties van brownfieldconvenanten, steunzones en bedrijventerreinen',
      attribution: 'Agentschap Digitaal Vlaanderen',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: [ 'Brownf', 'Steunzone', 'Bedrplan', 'Bedrter', 'Bedrontw', 'Bedrperc', 'Bedrpercab', 'Bedrbeh' ],
      layers: {
        'Brownf': {
          queryable: true,
          title: 'Brownfieldconvenanten',
          abstract: 'De Vlaamse Regering wenst de herontwikkeling van verlaten bedrijventerreinen (zg. brownfields ) te stimuleren en te faciliteren door het afsluiten van convenanten met projectontwikkelaars en investeerders. Via zo\'n convenant krijgen projectontwikkelaars en investeerders een aantal juridisch-administratieve en financiële voordelen bij de ontwikkeling van braakliggende en onderbenutte bedrijventerreinen. Daarmee wil de Vlaamse Regering hen ertoe aanzetten bij voorkeur verlaten sites (brownfields) te hergebruiken in plaats van nieuwe gebieden (greenfields) aan te snijden voor de ontwikkeling van industriële activiteiten, woningbouw of recreatie.'
        },
        'Steunzone': {
          queryable: true,
          title: 'Steunzones - Gebieden waar inhouding van bedrijfsvoorheffing mogelijk is',
          abstract: 'Bedrijven die investeren in een afgebakende steunzone (ook wel "ontwrichte zone" genoemd) kunnen een vrijstelling van 25% van de doorstorting van bedrijfsvoorheffing bekomen, voor een periode van 2 jaar per extra arbeidsplaats die als gevolg van deze investering werd gecreëerd en die gedurende ten minste drie jaar (kmo\'s) of vijf jaar (grote ondernemingen) behouden blijft.'
        },
        'Bedrplan': {
          queryable: true,
          title: 'Planningszone met economische bestemming',
          abstract: 'De laag \'Planningszone met economische bestemming\' omvat een overzicht van toekomstige economische zones of omvorming van bestaande zones naar een niet-economische bestemming uit ontwerp-(her)bestemmingsplannen die een openbaar karakter hebben. Het zijn plannen in de fase waar de datum van de plenaire vergadering gekend is of waarvan de plenaire vergadering reeds heeft plaatsgevonden.'
        },
        'Bedrter': {
          queryable: true,
          title: 'Bedrijventerrein',
          abstract: 'De laag \'Bedrijventerrein\' omvat de som van alle ruimtelijke eenheden uit de ruimtelijke planningsprocedure en met een economische bestemming vanaf de dossierfase Publicatie in Belgisch Staatsblad. Een bedrijventerrein is altijd de unie van de percelen die ertoe behoren.'
        },
        'Bedrontw': {
          queryable: true,
          title: 'Ontwikkelbare bedrijvenzone',
          abstract: 'Een Ontwikkelbare Bedrijvenzone bevat de contouren van de Bedrijventerreinen vanaf de mijlpaal publicatie in het Belgisch Staatsblad tot aan de oplevering van de nutsvoorzieningen en infrastructuur. Deze zones kunnen nieuwe terreinen zijn of herontwikkelingstrajecten. Wanneer een (her)ontwikkeling in meerdere fasen gebeurt, dan wordt de ontwikkelbare zone opgesplitst volgens deze fasen.'
        },
        'Bedrperc': {
          queryable: true,
          title: 'Bedrijventerreinperceel',
          abstract: 'Een bedrijventerreinperceel is een ruimtelijke eenheid binnen een Bedrijventerrein met eenzelfde gebruik of functie.'
        },
        'Bedrpercab': {
          queryable: true,
          title: 'Bedrijventerreinperceelaanbieding',
          abstract: 'De laag \'bedrijventerreinperceelaanbieding\' bevat percelen die te koop of te huur worden aangeboden met een referentie naar het perceel, de aanbiedende organisatie en de website waar het perceel wordt aangeboden.'
        },
        'Bedrbeh': {
          queryable: true,
          title: 'Beheerde bedrijvenzone',
          abstract: 'Een beheerde bedrijvenzone is een ruimtelijke eenheid binnen een bedrijventerrein in het beheer van een agent.'
        }
      }
    },
    {
      id: 3236,
      title: 'Publieke oplaadpunten',
      url: 'https://geoserver.gis.cloud.mow.vlaanderen.be/geoserver/ows',
      crs: 'EPSG:3857',
      bbox: [2.50727, 50.661802, 5.957286, 51.519573],
      format: 'image/png',
      area: 'BE',
      abstract: 'Laadpunten voor elektrische voertuigen in Vlaanderen',
      attribution: 'MOW Vlaanderen',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['laadpunten_public'],
      layers: {
        'laadpunten_public': {
          queryable: true,
          title: 'Publieke laadpunten'
        }
      }
    },
    {
      id: 3237,
      title: 'Adressenregister Vlaanderen',
      url: 'https://geo.api.vlaanderen.be/Adressenregister/wms',
      crs: 'EPSG:3857',
      bbox: [2.52, 50.64, 5.94, 51.51],
      format: 'image/png',
      area: 'BE',
      abstract: 'In het adressenregister zijn alle adressen in Vlaanderen opgeslagen samen met één of meer puntgeometrieën. De adresgegevens worden beheerd door de gemeenten zoals bepaald in het CRAB-decreet.',
      attribution: 'Agentschap Informatie Vlaanderen',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['A_VOORGESTELD', 'A_INGEBRUIK'],
      layers: {
        'A_VOORGESTELD': {
          queryable: true,
          title: 'Voorgestelde adressen',
          abstract: 'Het adres werd voorgesteld (bv. door de dienst Ruimtelijke Ordening) maar nog niet goedgekeurd door de gemeenteraad'
        },
        'A_INGEBRUIK': {
          queryable: true,
          title: 'Adressen in gebruik',
          abstract: 'Het adres werd formeel goedgekeurd door de gemeenteraad en/of wordt actief gebruikt voor adressering'
        },
        'A_GEHISTOREERD': {
          queryable: true,
          title: 'Gehistoreerde adressen',
          abstract: 'Het adres werd formeel opgeheven door de gemeenteraad'
        },
        'A_AFGEKEURD': {
          queryable: true,
          title: 'Afgekeurde adressen',
          abstract: 'Het adres werd formeel afgekeurd door de gemeenteraad'
        }
      }
    },
    {
      id: 3238,
      title: 'GIPOD Actueel',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/GIPOD/wms',
      crs: 'EPSG:3857',
      bbox: [2.52, 50.64, 5.94, 51.51],
      format: 'image/png',
      area: 'BE',
      abstract: 'Overzicht van mobiliteitshinder vandaag. Meer kaartlagen (grondwerken, werken, evenementen) zijn beschikbaar in de instellingen',
      attribution: 'Agentschap Informatie Vlaanderen',
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Hinder_in_kaart_app&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['GIPOD_MOBHINDER_VNDG', 'GIPOD_MOBHINDER_VNDG_ICOON'],
      layers: {
        'GIPOD_MOBHINDER_VNDG': {
          queryable: true,
          title: 'Mobiliteitshinder vandaag',
          abstract: 'GIPOD mobiliteitshinder op het openbaar domein vandaag'
        },
        'GIPOD_MOBHINDER_VNDG_ICOON': {
          queryable: true,
          title: 'Mobiliteitshinder vandaag (icoon)',
          abstract: 'GIPOD mobiliteitshinder op het openbaar domein vandaag (icoon)'
        },
        'GIPOD_GRONDWERK_VNDG': {
          queryable: true,
          title: 'Grondwerken vandaag',
          abstract: 'GIPOD grondwerken op het openbaar domein vandaag'
        },
        'GIPOD_GRONDWERK_VNDG_ICOON': {
          queryable: true,
          title: 'Grondwerken vandaag (icoon)',
          abstract: 'GIPOD grondwerken op het openbaar domein vandaag (icoon)'
        },
        'GIPOD_WERK_VNDG': {
          queryable: true,
          title: 'Werken vandaag',
          abstract: 'GIPOD werken op het openbaar domein vandaag'
        },
        'GIPOD_WERK_VNDG_ICOON': {
          queryable: true,
          title: 'Werken vandaag (icoon)',
          abstract: 'GIPOD werken op het openbaar domein vandaag (icoon)'
        },
        'GIPOD_EVENEMENT_VNDG': {
          queryable: true,
          title: 'Evenementen vandaag',
          abstract: 'GIPOD evenementen op het openbaar domein vandaag'
        },
        'GIPOD_EVENEMENT_VNDG_ICOON': {
          queryable: true,
          title: 'Evenementen vandaag (icoon)',
          abstract: 'GIPOD evenementen op het openbaar domein vandaag (icoon)'
        }
      }
    },
    {
      id: 3239,
      title: 'GIPOD Komende Maand',
      type: 'WMS',
      url: 'https://geo.api.vlaanderen.be/GIPOD/wms',
      crs: 'EPSG:3857',
      bbox: [2.52, 50.64, 5.94, 51.51],
      format: 'image/png',
      area: 'BE',
      abstract: 'Overzicht van mobiliteitshinder komende maand. Meer kaartlagen (grondwerken, werken, evenementen) zijn beschikbaar in de instellingen',
      attribution: 'Agentschap Informatie Vlaanderen',
      getExternalUrl: (extent) => 'http://www.geopunt.be/kaart?app=Hinder_in_kaart_app&extent=' + extent.left + ',' + extent.right + ',' + extent.bottom + ',' + extent.top,
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['GIPOD_MOBHINDER_MAAND', 'GIPOD_MOBHINDER_MAAND_ICOON'],
      layers: {
        'GIPOD_MOBHINDER_MAAND': {
          queryable: true,
          title: 'Mobiliteitshinder komende maand',
          abstract: 'GIPOD mobiliteitshinder op het openbaar domein komende maand'
        },
        'GIPOD_MOBHINDER_MAAND_ICOON': {
          queryable: true,
          title: 'Mobiliteitshinder komende maand (icoon)',
          abstract: 'GIPOD mobiliteitshinder op het openbaar domein komende maand (icoon)'
        },
        'GIPOD_GRONDWERK_MAAND': {
          queryable: true,
          title: 'Grondwerken komende maand',
          abstract: 'GIPOD grondwerken op het openbaar domein komende maand'
        },
        'GIPOD_GRONDWERK_MAAND_ICOON': {
          queryable: true,
          title: 'Grondwerken komende maand (icoon)',
          abstract: 'GIPOD grondwerken op het openbaar domein komende maand (icoon)'
        },
        'GIPOD_WERK_MAAND': {
          queryable: true,
          title: 'Werken komende maand',
          abstract: 'GIPOD werken op het openbaar domein komende maand'
        },
        'GIPOD_WERK_MAAND_ICOON': {
          queryable: true,
          title: 'Werken komende maand (icoon)',
          abstract: 'GIPOD werken op het openbaar domein komende maand (icoon)'
        },
        'GIPOD_EVENEMENT_MAAND': {
          queryable: true,
          title: 'Evenementen komende maand',
          abstract: 'GIPOD evenementen op het openbaar domein komende maand'
        },
        'GIPOD_EVENEMENT_MAAND_ICOON': {
          queryable: true,
          title: 'Evenementen komende maand (icoon)',
          abstract: 'GIPOD evenementen op het openbaar domein komende maand (icoon)'
        }
      }
    },
    {
      id: 5501,
      title: 'Mapa basico Rio de Janeiro',
      type: 'WMS',
      url: 'http://pgeo3.rio.rj.gov.br/arcgis/services/Basicos/mapa_basico_UTM/MapServer/WmsServer',
      crs: 'EPSG:3857',
      bbox: [-43.846517, -23.122354, -43.064318, -22.729244],
      format: 'image/png',
      area: 'BR',
      abstract: 'Mapa urbano básico da Cidade do Rio de Janeiro',
      attribution: 'Cidade do Rio de Janeiro',
      pixelManipulations: ['rioTransparent'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      layers: {
        '0': {
          queryable: false,
          title: 'Limite do Estado do Rio de Janeiro',
          abstract: 'Divisão Política do Estado do Rio de Janeiro'
        },
        '1': {
          queryable: false,
          title: 'relevo'
        },
        '2': {
          queryable: false,
          title: 'Quadras'
        },
        '3': {
          queryable: true,
          title: 'Logradouros - Ruas'
        },
        '4': {
          queryable: false,
          title: 'Praças'
        },
        '5': {
          queryable: false,
          title: 'Areas Protegidas'
        },
        '6': {
          queryable: true,
          title: 'Favelas'
        },
        '7': {
          queryable: false,
          title: 'Loteamentos Irregulares e Clandestinos'
        },
        '8': {
          queryable: false,
          title: 'edificações'
        },
        '9': {
          queryable: false,
          title: 'Hidrografia - Rios'
        },
        '10': {
          queryable: false,
          title: 'Limite de Bairros'
        },
        '11': {
          queryable: false,
          title: 'Limite de Regiões Administrativas - RA'
        },
        '12': {
          queryable: false,
          title: 'Áreas de Planejamento - AP'
        },
        '13': {
          queryable: false,
          title: 'número de porta'
        },
        '14': {
          queryable: true,
          title: 'principais logradouros'
        },
        '15': {
          queryable: false,
          title: 'Locais de Referência'
        },
        '16': {
          queryable: false,
          title: 'Escolas Municipais'
        },
        '17': {
          queryable: false,
          title: 'Unidades de Saúde Estaduais e Federais'
        },
        '18': {
          queryable: false,
          title: 'Unidades de Saúde Municipais'
        },
        '19': {
          queryable: false,
          title: 'Corpo de Bombeiros'
        },
        '20': {
          queryable: false,
          title: 'Delegacias Policiais'
        },
        '21': {
          queryable: false,
          title: 'Estações de Bonde'
        },
        '22': {
          queryable: false,
          title: 'Estações Hidroviárias'
        },
        '23': {
          queryable: false,
          title: 'Estações Ferroviárias'
        },
        '24': {
          queryable: false,
          title: 'Estações do Metrô'
        },
        '25': {
          queryable: false,
          title: 'Aeroportos',
          abstract: 'principais aeroportos comerciais'
        }
      }
    },
    {
      id: 35201,
      title: 'Orthophotos Luxembourg',
      type: 'WMS',
      url: 'https://wmts1.geoportail.lu/opendata/service',
      crs: 'EPSG:3857',
      bbox: [5.71, 49.43, 6.55, 50.19],
      format: 'image/jpeg',
      area: 'LU',
      abstract: 'Orthophotos de Luxembourg par l\'Administration du cadastre et de la topographie du Grand-Duché du Luxembourg',
      attribution: 'Cadastre et topographie Grand-Duché du Luxembourg',
      queryable: false,
      default_layers: ['ortho_latest'],
      layers: {
        'ortho_latest': {
          queryable: false,
          title: 'Dernières Photographies aériennes orthorectifiées',
        },
        'ortho_2025_winter': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiesé 2025 hiver',
        },
        'ortho_2023': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2023',
        },
        'ortho_2022': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2022',
        },
        'ortho_2021': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2021',
        },
        'ortho_2020': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2020',
        },
        'ortho_2019_winter': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2019 hiver',
        },
        'ortho_2019_luref': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2019 en LUREF',
        },
        'ortho_2019': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2019',
        },
        'ortho_2018': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2018',
        },
        'ortho_2017': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2017',
        },
        'ortho_2016': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2016',
        },
        'ortho_2013': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2013',
        },
        'ortho_irc': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées infrarouges 2010',
        },
        'ortho_2010': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2010',
        },
        'ortho_2007': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2007',
        },
        'ortho_2004': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2004',
        },
        'ortho_2001': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 2001',
        },
        'ortho_1967': {
          queryable: false,
          title: 'Photographies aériennes orthorectifiées 1967',
        }
      }
    },
    {
      id: 35202,
      title: 'BD-Adresses Luxembourg',
      type: 'WMS',
      url: 'https://wmts1.geoportail.lu/opendata/service',
      crs: 'EPSG:3857',
      bbox: [5.71, 49.43, 6.55, 50.19],
      format: 'image/png',
      area: 'LU',
      abstract: 'La BD-Adresses est un sous-ensemble des adresses figurant dans le registre national des localités et des rues, enrichi par des coordonnées géographiques.',
      attribution: 'Cadastre et topographie Grand-Duché du Luxembourg',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['addresses'],
      layers: {
        'addresses': {
          queryable: true,
          title: 'Points adresse',
        }
      }
    },
    {
      id: 35203,
      title: 'Cadastre Luxembourg',
      type: 'WMS',
      url: 'https://wmts1.geoportail.lu/opendata/service',
      crs: 'EPSG:3857',
      bbox: [5.71, 49.43, 6.55, 50.19],
      format: 'image/png',
      area: 'LU',
      abstract: 'The BD-L-GeoBase is the official reference for geographic vector data produced by the Administration du Cadastre et de la Topographie for the entire territory of the Grand Duchy of Luxembourg.',
      attribution: 'Cadastre et topographie Grand-Duché du Luxembourg',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['parcels', 'parcels_labels', 'buildings', 'toponymes', 'cadastre'],
      layers: {
        'parcels': {
          queryable: true,
          title: 'Parcelles cadastrales',
        },
        'parcels_labels': {
          queryable: false,
          title: 'Numéros parcellaires',
        },
        'buildings': {
          queryable: false,
          title: 'Bâtiments du plan cadastral',
        },
        'toponymes': {
          queryable: false,
          title: 'Toponymes cadastraux',
        },
        'cadastre': {
          queryable: false,
          title: 'Plan cadastral complet',
        },
      }
    },
    {
      id: 35204,
      title: 'Réseau Routier Luxembourg',
      type: 'WMS',
      url: 'https://wmts1.geoportail.lu/opendata/service',
      crs: 'EPSG:3857',
      bbox: [5.71, 49.43, 6.55, 50.19],
      format: 'image/png',
      area: 'LU',
      abstract: 'Le réseau routier et les noms de rue.',
      attribution: 'Cadastre et topographie Grand-Duché du Luxembourg',
      queryable: false,
      default_layers: ['reseau_routier', 'road_names'],
      layers: {
        'reseau_routier': {
          queryable: false,
          title: 'Réseau routier',
        },
        'road_names': {
          queryable: false,
          title: 'Noms de rue',
        },
      }
    },
    {
      id: 38501,
      title: 'Digitalni ortofoto 2022',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/orthophoto_2022/ows',
      crs: 'EPSG:3765',
      bbox: [13.2858, 42.3982, 19.6392, 46.5321],
      format: 'image/png',
      area: 'HR',
      abstract: 'Digitalni ortofoto 2022. - WMS servis za anonimne korisnike (WMS)',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: false,
      default_layers: ['OI.OrthoimageCoverage'],
      layers: {
        'OI.OrthoimageCoverage': {
          queryable: false,
          title: 'Digitalni ortofoto 2022. - WMS servis za anonimne korisnike (WMS)',
          abstract: 'Digitalni ortofoto 2022. - WMS servis za anonimne korisnike (WMS)'
        }
      }
    },
    {
      id: 38502,
      title: 'Digitalni ortofoto 2021',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/orthophoto_2021/ows',
      crs: 'EPSG:3765',
      bbox: [15.3653, 42.3333, 19.5108, 46.5615],
      format: 'image/png',
      area: 'HR',
      abstract: 'Digitalni ortofoto 2021. - WMS servis za anonimne korisnike (WMS)',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: false,
      default_layers: ['OI.OrthoimageCoverage'],
      layers: {
        'OI.OrthoimageCoverage': {
          queryable: false,
          title: 'Digitalni ortofoto u mjerilu 1:5000_2021. godina',
          abstract: 'DOF5 izrađen na osnovi avio snimaka, prekriva 50% teritorija Republike Hrvatske (istočni i južni dio). Snimanja su izvršena u 2021. godini. DOF5 izrađen u RGB i CIR produkciji.'
        }
      }
    },
    {
      id: 38503,
      title: 'Digitalni ortofoto 2020',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/orthophoto_2020/ows',
      crs: 'EPSG:3765',
      bbox: [15.3653, 42.3333, 19.5108, 46.5615],
      format: 'image/png',
      area: 'HR',
      abstract: 'Digitalni ortofoto 2020. - WMS servis za anonimne korisnike (WMS)',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: false,
      default_layers: ['OI.OrthoimageCoverage'],
      layers: {
        'OI.OrthoimageCoverage': {
          queryable: false,
          title: 'Digitalni ortofoto u mjerilu 1:5000_2020. godina',
          abstract: 'DOF5 izrađen na osnovi avio snimaka, prekriva 50% teritorija Republike Hrvatske (istočni i južni dio). Snimanja su izvršena u 2021. godini. DOF5 izrađen u RGB i CIR produkciji.'
        }
      }
    },
    {
      id: 38504,
      title: 'Digitalni ortofoto 2019',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/orthophoto_2021/ows',
      crs: 'EPSG:3765',
      bbox: [15.3653, 42.3333, 19.5108, 46.5615],
      format: 'image/png',
      area: 'HR',
      abstract: 'Digitalni ortofoto 2019. - WMS servis za anonimne korisnike (WMS)',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: false,
      default_layers: ['OI.OrthoimageCoverage'],
      layers: {
        'OI.OrthoimageCoverage': {
          queryable: false,
          title: 'Digitalni ortofoto u mjerilu 1:5000_2019. godina',
          abstract: 'DOF5 izrađen na osnovi avio snimaka, prekriva 50% teritorija Republike Hrvatske (istočni i južni dio). Snimanja su izvršena u 2021. godini. DOF5 izrađen u RGB i CIR produkciji.'
        }
      }
    },
    {
      id: 38505,
      title: 'Digitalni ortofoto u mjerilu 1:1000 potres Zagreb',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/orthophoto_1000/wms',
      crs: 'EPSG:3765',
      bbox: [15.8022, 45.6633, 16.2458, 46.0467],
      format: 'image/png',
      area: 'HR',
      abstract: 'Mrežna usluga pregleda (WMTS) koja je nastala iz službenih DOF 1 karata Državne geodetske uprave, izrađenih iz aerofotogrametrijskog snimanja. Digitalna ortofotokarata u mjerilu 1:1000 (DOF1) za područje dijelova grada Zagreba, Krapinsko-zagorske i Zagrebačke županije. Površina snimanja je oko 77.000,00 ha.',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: false,
      default_layers: ['OI.OrthoimageCoverage'],
      layers: {
        'OI.OrthoimageCoverage': {
          queryable: false,
          title: 'Digitalni ortofoto u mjerilu 1:1000_potres Zagreb',
          abstract: 'Digitalna ortofotokarata u mjerilu 1:1000 (DOF1) za područje dijelova grada Zagreba, Krapinsko-zagorske i Zagrebačke županije. Površina snimanja je oko 77.000,00 ha.'
        }
      }
    },
    {
      id: 38506,
      title: 'Prometne mreže',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/tn/wms',
      crs: 'EPSG:3765',
      bbox: [13.7698, 43.0139, 19.2187, 46.5116],
      format: 'image/png',
      area: 'HR',
      abstract: 'Mrežna usluga pregleda (WMS) za INSPIRE temu Prometne mreže koja je nastala temeljem službenog skupa podataka Državne geodetske uprave. Mrežna usluga/podaci su dostupni za cijelo područje Republike Hrvatske.',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['TN.RoadTransportNetwork.RoadLink', 'TN.RoadTransportNetwork.RoadArea', 'TN.RoadTransportNetwork.RoadServiceArea'],
      layers: {
        'TN.AirTransportNetwork.RunwayArea': {
          queryable: true,
          title: 'Runway Area'
        },
        'TN.CableTransportNetwork.CablewayLink': {
          queryable: true,
          title: 'Cableway Link'
        },
        'TN.CommonTransportElements.TransportNode': {
          queryable: true,
          title: 'Transport Node'
        },
        'TN.RailTransportNetwork.RailwayArea': {
          queryable: true,
          title: 'Railway Area'
        },
        'TN.RailTransportNetwork.RailwayLink': {
          queryable: true,
          title: 'Railway Link'
        },
        'TN.RailTransportNetwork.RailwayStationArea': {
          queryable: true,
          title: 'Railway Station Area'
        },
        'TN.RoadTransportNetwork.RoadLink': {
          queryable: true,
          title: 'Road Link'
        },
        'TN.RoadTransportNetwork.RoadArea': {
          queryable: true,
          title: 'Road Area'
        },
        'TN.RoadTransportNetwork.RoadServiceArea': {
          queryable: true,
          title: 'Road Service Area'
        },
        'TN.WaterTransportNetwork.PortArea': {
          queryable: true,
          title: 'Port Area'
        },
        'TN.WaterTransportNetwork.WaterwayLink': {
          queryable: true,
          title: 'Waterway Link'
        }
      }
    },
    {
      id: 38507,
      title: 'Zgrade',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/bu/wms',
      crs: 'EPSG:3765',
      bbox: [13.2858, 42.3982, 19.6392, 46.5321],
      format: 'image/png',
      area: 'HR',
      abstract: 'Mrežna usluga pregleda (WMS) za INSPIRE temu Zgrade koja je nastala temeljem službenog skupa podataka Državne geodetske uprave. Mrežna usluga/podaci su dostupni za cijelo područje Republike Hrvatske.',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['BU.Building'],
      layers: {
        'BU.Building': {
          queryable: true,
          title: 'Building'
        }
      }
    },
    {
      id: 38508,
      title: 'Adrese',
      type: 'WMS',
      url: 'https://geoportal.dgu.hr/services/inspire/ad/ows',
      crs: 'EPSG:3765',
      bbox: [13.2858, 42.3982, 19.6392, 46.5321],
      format: 'image/png',
      area: 'HR',
      abstract: 'Usluga pregleda za INSPIRE temu Adrese (AD) je mrežna usluga za pregled podataka putem WMS usluge. Mrežna usluga/podaci su dostupni za cijelo područje Republike Hrvatske.',
      attribution: 'Državna geodetska uprava Republike Hrvatske',
      query_filters: [ applyAllTransformations ],
      queryable: false,
      default_layers: ['AD.Address'],
      layers: {
        'AD.Address': {
          queryable: false,
          title: 'Addresses',
          abstract: 'Izvor koji uključuje podatke o sljedećim prostornim jedinicama: kućni broj, zgrada, ulica, naselje.'
        }
      }
    },
    {
      id: 96801,
      title: 'Oman National Basemap (EN) Transparent with Major Landmarks',
      type: 'WMS',
      url: 'https://nsdig2gapps.ncsi.gov.om/arcgis1/services/Geoportal/BaseMapTransparentLandmarksEN/MapServer/WmsServer',
      crs: 'EPSG:3857',
      bbox: [46.23671, 12.997039, 66.795257, 30.129168],
      format: 'image/png',
      area: 'OM',
      abstract: 'National Basemap Transparent with Major Landmarks',
      attribution: 'NCSI',
      pixelManipulations: ['traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['1', '2', '3', '5', '6', '7', '8', '9', '10', '12', '13', '14', '15', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '33', '34', '35', '36', '37', '39', '40', '41', '42', '43', '45', '47', '48', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
      layers: {
        '1': {
          queryable: true,
          title: 'Name of Ocean',
          abstract: 'Name of Ocean'
        },
        '2': {
          queryable: true,
          title: 'World Ocean',
          abstract: 'World Ocean'
        },
        '3': {
          queryable: true,
          title: 'World Countries',
          abstract: 'World Countries'
        },
        '5': {
          queryable: true,
          title: 'Country Boundary',
          abstract: 'Country Boundary'
        },
        '6': {
          queryable: true,
          title: 'Governorate ',
          abstract: 'Governorate '
        },
        '7': {
          queryable: true,
          title: 'Willayat',
          abstract: 'Willayat'
        },
        '8': {
          queryable: true,
          title: 'Governorate Center',
          abstract: 'Governorate Center'
        },
        '9': {
          queryable: true,
          title: 'Willayat Center',
          abstract: 'Willayat Center'
        },
        '10': {
          queryable: true,
          title: 'Town Center',
          abstract: 'Town Center'
        },
        '12': {
          queryable: true,
          title: 'Rock',
          abstract: 'Rock'
        },
        '13': {
          queryable: true,
          title: 'Sand Dunes',
          abstract: 'Sand Dunes'
        },
        '14': {
          queryable: true,
          title: 'Builtup Area',
          abstract: 'Builtup Area'
        },
        '15': {
          queryable: true,
          title: 'Vegetation',
          abstract: 'Vegetation'
        },
        '17': {
          queryable: true,
          title: 'Reservoir',
          abstract: 'Reservoir'
        },
        '18': {
          queryable: true,
          title: 'Marsh Swamp',
          abstract: 'Marsh Swamp'
        },
        '19': {
          queryable: true,
          title: 'Sabkha',
          abstract: 'Sabkha'
        },
        '20': {
          queryable: true,
          title: 'Lake Pond',
          abstract: 'Lake Pond'
        },
        '21': {
          queryable: true,
          title: 'Lagoon',
          abstract: 'Lagoon'
        },
        '22': {
          queryable: true,
          title: 'Wadi Stream',
          abstract: 'Wadi Stream'
        },
        '23': {
          queryable: true,
          title: 'Wadi Spread',
          abstract: 'Wadi Spread'
        },
        '24': {
          queryable: true,
          title: 'Dam',
          abstract: 'Dam'
        },
        '25': {
          queryable: true,
          title: 'Foreshore',
          abstract: 'Foreshore'
        },
        '26': {
          queryable: true,
          title: 'Beach',
          abstract: 'Beach'
        },
        '27': {
          queryable: true,
          title: 'Ditch',
          abstract: 'Ditch'
        },
        '28': {
          queryable: true,
          title: 'Weir',
          abstract: 'Weir'
        },
        '29': {
          queryable: true,
          title: 'Sluice Gate',
          abstract: 'Sluice Gate'
        },
        '30': {
          queryable: true,
          title: 'Waterfall',
          abstract: 'Waterfall'
        },
        '31': {
          queryable: true,
          title: 'Spring',
          abstract: 'Spring'
        },
        '33': {
          queryable: true,
          title: 'Road Centre Lines',
          abstract: 'Road Centre Lines'
        },
        '34': {
          queryable: true,
          title: 'Road Centre Lines',
          abstract: 'Road Centre Lines'
        },
        '35': {
          queryable: true,
          title: 'Streets',
          abstract: 'Streets'
        },
        '36': {
          queryable: true,
          title: 'Minor Roads',
          abstract: 'Minor Roads'
        },
        '37': {
          queryable: true,
          title: 'Major Roads',
          abstract: 'Major Roads'
        },
        '39': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'Amusement Parks'
        },
        '40': {
          queryable: true,
          title: 'Golf Courses',
          abstract: 'Golf Courses'
        },
        '41': {
          queryable: true,
          title: 'Parks',
          abstract: 'Parks'
        },
        '42': {
          queryable: true,
          title: 'Racing Tracks',
          abstract: 'Racing Tracks'
        },
        '43': {
          queryable: true,
          title: 'Sports Fields',
          abstract: 'Sports Fields'
        },
        '45': {
          queryable: true,
          title: 'Archeological Sites',
          abstract: 'Archeological Sites'
        },
        '47': {
          queryable: true,
          title: 'Buildings',
          abstract: 'Buildings'
        },
        '48': {
          queryable: true,
          title: 'Wall and Fences',
          abstract: 'Wall and Fences'
        },
        '50': {
          queryable: true,
          title: 'Consulates',
          abstract: 'Consulates'
        },
        '51': {
          queryable: true,
          title: 'International Missions',
          abstract: 'International Missions'
        },
        '52': {
          queryable: true,
          title: 'Embassies',
          abstract: 'Embassies'
        },
        '53': {
          queryable: true,
          title: 'Money Exchange',
          abstract: 'Money Exchange'
        },
        '54': {
          queryable: true,
          title: 'Stock Exchange',
          abstract: 'Stock Exchange'
        },
        '55': {
          queryable: true,
          title: 'Banks',
          abstract: 'Banks'
        },
        '56': {
          queryable: true,
          title: 'Fuel Stations',
          abstract: 'Fuel Stations'
        },
        '57': {
          queryable: true,
          title: 'Department Stores',
          abstract: 'Department Stores'
        },
        '58': {
          queryable: true,
          title: 'Shopping Mall Locations',
          abstract: 'Shopping Mall Locations'
        },
        '59': {
          queryable: true,
          title: 'Market Locations',
          abstract: 'Market Locations'
        },
        '60': {
          queryable: true,
          title: 'Ambulance Station',
          abstract: 'Ambulance Station'
        },
        '61': {
          queryable: true,
          title: 'Civil Defense Centers',
          abstract: 'Civil Defense Centers'
        },
        '62': {
          queryable: true,
          title: 'Police Station',
          abstract: 'Police Station'
        },
        '63': {
          queryable: true,
          title: 'Government Offices',
          abstract: 'Government Offices'
        },
        '64': {
          queryable: true,
          title: 'College Locations',
          abstract: 'College Locations'
        },
        '65': {
          queryable: true,
          title: 'Training Centers',
          abstract: 'Training Centers'
        },
        '66': {
          queryable: true,
          title: 'University Locations',
          abstract: 'University Locations'
        },
        '67': {
          queryable: true,
          title: 'School Locations',
          abstract: 'School Locations'
        },
        '68': {
          queryable: true,
          title: 'Health Centers',
          abstract: 'Health Centers'
        },
        '69': {
          queryable: true,
          title: 'Hospital Locations',
          abstract: 'Hospital Locations'
        },
        '70': {
          queryable: true,
          title: 'Diagnostic Centers',
          abstract: 'Diagnostic Centers'
        },
        '71': {
          queryable: true,
          title: 'Churches',
          abstract: 'Churches'
        },
        '72': {
          queryable: true,
          title: 'Temples',
          abstract: 'Temples'
        },
        '73': {
          queryable: true,
          title: 'Shrines',
          abstract: 'Shrines'
        },
        '74': {
          queryable: true,
          title: 'Mosques',
          abstract: 'Mosques'
        },
        '75': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'Amusement Parks'
        },
        '76': {
          queryable: true,
          title: 'Beach Location',
          abstract: 'Beach Location'
        },
        '77': {
          queryable: true,
          title: 'Cinema Theaters',
          abstract: 'Cinema Theaters'
        },
        '78': {
          queryable: true,
          title: 'Skating Centers',
          abstract: 'Skating Centers'
        },
        '79': {
          queryable: true,
          title: 'Bowling Centers',
          abstract: 'Bowling Centers'
        },
        '80': {
          queryable: true,
          title: 'Theaters',
          abstract: 'Theaters'
        },
        '81': {
          queryable: true,
          title: 'Cultural Facilities',
          abstract: 'Cultural Facilities'
        },
        '82': {
          queryable: true,
          title: 'Museums',
          abstract: 'Museums'
        },
        '83': {
          queryable: true,
          title: 'Park Locations',
          abstract: 'Park Locations'
        },
        '84': {
          queryable: true,
          title: 'Convention Centers',
          abstract: 'Convention Centers'
        },
        '85': {
          queryable: true,
          title: 'Resturants',
          abstract: 'Resturants'
        },
        '86': {
          queryable: true,
          title: 'Hotels',
          abstract: 'Hotels'
        },
        '87': {
          queryable: true,
          title: 'Archeological Site Locations',
          abstract: 'Archeological Site Locations'
        },
        '88': {
          queryable: true,
          title: 'FerryTerminals',
          abstract: 'FerryTerminals'
        },
        '89': {
          queryable: true,
          title: 'Airport Locations',
          abstract: 'Airport Locations'
        },
        '91': {
          queryable: true,
          title: 'Consulates',
          abstract: 'Consulates'
        },
        '92': {
          queryable: true,
          title: 'International Missions',
          abstract: 'International Missions'
        },
        '93': {
          queryable: true,
          title: 'Embassies',
          abstract: 'Embassies'
        },
        '94': {
          queryable: true,
          title: 'Money Exchange',
          abstract: 'Money Exchange'
        },
        '95': {
          queryable: true,
          title: 'Stock Exchange',
          abstract: 'Stock Exchange'
        },
        '96': {
          queryable: true,
          title: 'Banks',
          abstract: 'Banks'
        },
        '97': {
          queryable: true,
          title: 'Fuel Stations',
          abstract: 'Fuel Stations'
        },
        '98': {
          queryable: true,
          title: 'Department Stores',
          abstract: 'Department Stores'
        },
        '99': {
          queryable: true,
          title: 'Shopping Mall Locations',
          abstract: 'Shopping Mall Locations'
        },
        '100': {
          queryable: true,
          title: 'Market Locations',
          abstract: 'Market Locations'
        },
        '101': {
          queryable: true,
          title: 'Ambulance Station',
          abstract: 'Ambulance Station'
        },
        '102': {
          queryable: true,
          title: 'Civil Defense Centers',
          abstract: 'Civil Defense Centers'
        },
        '103': {
          queryable: true,
          title: 'Police Station',
          abstract: 'Police Station'
        },
        '104': {
          queryable: true,
          title: 'Government Offices',
          abstract: 'Government Offices'
        },
        '105': {
          queryable: true,
          title: 'College Locations',
          abstract: 'College Locations'
        },
        '106': {
          queryable: true,
          title: 'Training Centers',
          abstract: 'Training Centers'
        },
        '107': {
          queryable: true,
          title: 'University Locations',
          abstract: 'University Locations'
        },
        '108': {
          queryable: true,
          title: 'School Locations',
          abstract: 'School Locations'
        },
        '109': {
          queryable: true,
          title: 'Health Centers',
          abstract: 'Health Centers'
        },
        '110': {
          queryable: true,
          title: 'Hospital Locations',
          abstract: 'Hospital Locations'
        },
        '111': {
          queryable: true,
          title: 'Diagnostic Centers',
          abstract: 'Diagnostic Centers'
        },
        '112': {
          queryable: true,
          title: 'Churches',
          abstract: 'Churches'
        },
        '113': {
          queryable: true,
          title: 'Temples',
          abstract: 'Temples'
        },
        '114': {
          queryable: true,
          title: 'Shrines',
          abstract: 'Shrines'
        },
        '115': {
          queryable: true,
          title: 'Mosques',
          abstract: 'Mosques'
        },
        '116': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'Amusement Parks'
        },
        '117': {
          queryable: true,
          title: 'Beach Location',
          abstract: 'Beach Location'
        },
        '118': {
          queryable: true,
          title: 'Cinema Theaters',
          abstract: 'Cinema Theaters'
        },
        '119': {
          queryable: true,
          title: 'Skating Centers',
          abstract: 'Skating Centers'
        },
        '120': {
          queryable: true,
          title: 'Bowling Centers',
          abstract: 'Bowling Centers'
        },
        '121': {
          queryable: true,
          title: 'Theaters',
          abstract: 'Theaters'
        },
        '122': {
          queryable: true,
          title: 'Cultural Facilities',
          abstract: 'Cultural Facilities'
        },
        '123': {
          queryable: true,
          title: 'Museums',
          abstract: 'Museums'
        },
        '124': {
          queryable: true,
          title: 'Park Locations',
          abstract: 'Park Locations'
        },
        '125': {
          queryable: true,
          title: 'Convention Centers',
          abstract: 'Convention Centers'
        },
        '126': {
          queryable: true,
          title: 'Resturants',
          abstract: 'Resturants'
        },
        '127': {
          queryable: true,
          title: 'Hotels',
          abstract: 'Hotels'
        },
        '128': {
          queryable: true,
          title: 'Archeological Site Locations',
          abstract: 'Archeological Site Locations'
        },
        '129': {
          queryable: true,
          title: 'FerryTerminals',
          abstract: 'FerryTerminals'
        },
        '130': {
          queryable: true,
          title: 'Airport Locations',
          abstract: 'Airport Locations'
        }
      }
    },
    {
      id: 96802,
      title: 'Oman National Basemap (AR) Transparent with Major Landmarks',
      type: 'WMS',
      url: 'https://nsdig2gapps.ncsi.gov.om/arcgis1/services/Geoportal/BaseMapTransparentLandmarksAR/MapServer/WmsServer',
      crs: 'EPSG:3857',
      bbox: [46.23671, 12.997039, 66.795257, 30.129168],
      format: 'image/png',
      area: 'OM',
      abstract: 'National Basemap Transparent with Major Landmarks',
      attribution: 'NCSI',
      pixelManipulations: ['traceGrayscalePixels'],
      queryable: true,
      query_filters: [ applyAllTransformations ],
      default_layers: ['1', '2', '3', '5', '6', '7', '8', '9', '10', '12', '13', '14', '15', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '33', '34', '35', '36', '37', '39', '40', '41', '42', '43', '45', '47', '48', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
      layers: {
        '1': {
          queryable: true,
          title: 'Name of Ocean',
          abstract: 'أسماء المحيطات'
        },
        '2': {
          queryable: true,
          title: 'World Ocean',
          abstract: 'المحيطات'
        },
        '3': {
          queryable: true,
          title: 'World Countries',
          abstract: 'دول العالم'
        },
        '5': {
          queryable: true,
          title: 'Country Boundary',
          abstract: 'حدود السلطنة'
        },
        '6': {
          queryable: true,
          title: 'Governorate ',
          abstract: 'المحافظات'
        },
        '7': {
          queryable: true,
          title: 'Willayat',
          abstract: 'الولايات'
        },
        '8': {
          queryable: true,
          title: 'Governorate Center',
          abstract: 'مركز المحافظة'
        },
        '9': {
          queryable: true,
          title: 'Willayat Center',
          abstract: 'مركز الولاية'
        },
        '10': {
          queryable: true,
          title: 'Town Center',
          abstract: 'مركز المدينة'
        },
        '12': {
          queryable: true,
          title: 'Rock',
          abstract: 'تجمعات صخرية'
        },
        '13': {
          queryable: true,
          title: 'Sand Dunes',
          abstract: 'الكثبان الرملية'
        },
        '14': {
          queryable: true,
          title: 'Builtup Area',
          abstract: 'الإمتدادات العمرانية'
        },
        '15': {
          queryable: true,
          title: 'Vegetation',
          abstract: 'الغطاء النباتي'
        },
        '17': {
          queryable: true,
          title: 'Reservoir',
          abstract: 'خزانات المياه'
        },
        '18': {
          queryable: true,
          title: 'Marsh Swamp',
          abstract: 'مستنقعات'
        },
        '19': {
          queryable: true,
          title: 'Sabkha',
          abstract: 'السبخات'
        },
        '20': {
          queryable: true,
          title: 'Lake Pond',
          abstract: 'برك المياه'
        },
        '21': {
          queryable: true,
          title: 'Lagoon',
          abstract: 'بحيرات ملحية'
        },
        '22': {
          queryable: true,
          title: 'Wadi Stream',
          abstract: 'مسارات الأودية'
        },
        '23': {
          queryable: true,
          title: 'Wadi Spread',
          abstract: 'الأودية'
        },
        '24': {
          queryable: true,
          title: 'Dam',
          abstract: 'سدود'
        },
        '25': {
          queryable: true,
          title: 'Foreshore',
          abstract: 'حد الساحل'
        },
        '26': {
          queryable: true,
          title: 'Beach',
          abstract: 'الشواطئ'
        },
        '27': {
          queryable: true,
          title: 'Ditch',
          abstract: 'خنادق'
        },
        '28': {
          queryable: true,
          title: 'Weir',
          abstract: 'مصدات المياه'
        },
        '29': {
          queryable: true,
          title: 'Sluice Gate',
          abstract: 'بوابات التصريف'
        },
        '30': {
          queryable: true,
          title: 'Waterfall',
          abstract: 'الشلالات'
        },
        '31': {
          queryable: true,
          title: 'Spring',
          abstract: 'ينابيع'
        },
        '33': {
          queryable: true,
          title: 'Road Centre Lines',
          abstract: 'خطوط منتصف الطرق'
        },
        '34': {
          queryable: true,
          title: 'Road Centre Lines',
          abstract: 'خطوط منتصف الطرق'
        },
        '35': {
          queryable: true,
          title: 'Streets',
          abstract: 'الشوارع'
        },
        '36': {
          queryable: true,
          title: 'Minor Roads',
          abstract: 'الطرق الثانوية'
        },
        '37': {
          queryable: true,
          title: 'Major Roads',
          abstract: 'الطرق الرئيسية'
        },
        '39': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'المتنزهات الترفيهية'
        },
        '40': {
          queryable: true,
          title: 'Golf Courses',
          abstract: 'ملاعب الجولف'
        },
        '41': {
          queryable: true,
          title: 'Parks',
          abstract: 'الحدائق'
        },
        '42': {
          queryable: true,
          title: 'Racing Tracks',
          abstract: 'مضامير السباق'
        },
        '43': {
          queryable: true,
          title: 'Sports Fields',
          abstract: 'الملاعب الرياضية'
        },
        '45': {
          queryable: true,
          title: 'Archeological Sites',
          abstract: 'المواقع الأثرية'
        },
        '47': {
          queryable: true,
          title: 'Buildings',
          abstract: 'المباني'
        },
        '48': {
          queryable: true,
          title: 'Wall and Fences',
          abstract: 'الأسوار والأسيجة'
        },
        '50': {
          queryable: true,
          title: 'Consulates',
          abstract: 'الهيئات الدبلوماسية'
        },
        '51': {
          queryable: true,
          title: 'International Missions',
          abstract: 'السفارات'
        },
        '52': {
          queryable: true,
          title: 'Embassies',
          abstract: 'القنصليات'
        },
        '53': {
          queryable: true,
          title: 'Money Exchange',
          abstract: 'سوق الأوراق المالية'
        },
        '54': {
          queryable: true,
          title: 'Stock Exchange',
          abstract: 'شركات الصرافة'
        },
        '55': {
          queryable: true,
          title: 'Banks',
          abstract: 'البنوك'
        },
        '56': {
          queryable: true,
          title: 'Fuel Stations',
          abstract: 'محطات الوقود'
        },
        '57': {
          queryable: true,
          title: 'Department Stores',
          abstract: 'مواقع الاسواق'
        },
        '58': {
          queryable: true,
          title: 'Shopping Mall Locations',
          abstract: 'المتاجر متعددة الأقسام'
        },
        '59': {
          queryable: true,
          title: 'Market Locations',
          abstract: 'مواقع المراكز التجارية'
        },
        '60': {
          queryable: true,
          title: 'Ambulance Station',
          abstract: 'مراكز الاسعاف'
        },
        '61': {
          queryable: true,
          title: 'Civil Defense Centers',
          abstract: 'مراكز الدفاع المدني'
        },
        '62': {
          queryable: true,
          title: 'Police Station',
          abstract: 'مراكز الشرطة'
        },
        '63': {
          queryable: true,
          title: 'Government Offices',
          abstract: 'مواقع الجهات الحكومية'
        },
        '64': {
          queryable: true,
          title: 'College Locations',
          abstract: 'مراكز التدريب والتأهيل'
        },
        '65': {
          queryable: true,
          title: 'Training Centers',
          abstract: 'مواقع الكليات'
        },
        '66': {
          queryable: true,
          title: 'University Locations',
          abstract: 'مواقع الجامعات'
        },
        '67': {
          queryable: true,
          title: 'School Locations',
          abstract: 'مواقع المدارس'
        },
        '68': {
          queryable: true,
          title: 'Health Centers',
          abstract: 'المراكز الصحية'
        },
        '69': {
          queryable: true,
          title: 'Hospital Locations',
          abstract: 'مواقع المستشفيات'
        },
        '70': {
          queryable: true,
          title: 'Diagnostic Centers',
          abstract: 'مراكز التشخيص الطبي'
        },
        '71': {
          queryable: true,
          title: 'Churches',
          abstract: 'الأضرحة'
        },
        '72': {
          queryable: true,
          title: 'Temples',
          abstract: 'الكنائس'
        },
        '73': {
          queryable: true,
          title: 'Shrines',
          abstract: 'المعابد'
        },
        '74': {
          queryable: true,
          title: 'Mosques',
          abstract: 'المساجد'
        },
        '75': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'المتنزهات الترفيهية'
        },
        '76': {
          queryable: true,
          title: 'Beach Location',
          abstract: 'مواقع الشواطئ'
        },
        '77': {
          queryable: true,
          title: 'Cinema Theaters',
          abstract: 'دور السينما'
        },
        '78': {
          queryable: true,
          title: 'Skating Centers',
          abstract: 'مراكز التزلج'
        },
        '79': {
          queryable: true,
          title: 'Bowling Centers',
          abstract: 'مراكز البولينج'
        },
        '80': {
          queryable: true,
          title: 'Theaters',
          abstract: 'المسارح'
        },
        '81': {
          queryable: true,
          title: 'Cultural Facilities',
          abstract: 'المواقع الثقافية'
        },
        '82': {
          queryable: true,
          title: 'Museums',
          abstract: 'المتاحف'
        },
        '83': {
          queryable: true,
          title: 'Park Locations',
          abstract: 'مواقع الحدائق'
        },
        '84': {
          queryable: true,
          title: 'Convention Centers',
          abstract: 'مراكز المؤتمرات'
        },
        '85': {
          queryable: true,
          title: 'Resturants',
          abstract: 'المطاعم'
        },
        '86': {
          queryable: true,
          title: 'Hotels',
          abstract: 'الفنادق'
        },
        '87': {
          queryable: true,
          title: 'Archeological Site Locations',
          abstract: 'المواقع الأثرية - النقاط'
        },
        '88': {
          queryable: true,
          title: 'FerryTerminals',
          abstract: 'محطات العبارات'
        },
        '89': {
          queryable: true,
          title: 'Airport Locations',
          abstract: 'المطارات'
        },
        '91': {
          queryable: true,
          title: 'Consulates',
          abstract: 'الهيئات الدبلوماسية'
        },
        '92': {
          queryable: true,
          title: 'International Missions',
          abstract: 'السفارات'
        },
        '93': {
          queryable: true,
          title: 'Embassies',
          abstract: 'القنصليات'
        },
        '94': {
          queryable: true,
          title: 'Money Exchange',
          abstract: 'سوق الأوراق المالية'
        },
        '95': {
          queryable: true,
          title: 'Stock Exchange',
          abstract: 'شركات الصرافة'
        },
        '96': {
          queryable: true,
          title: 'Banks',
          abstract: 'البنوك'
        },
        '97': {
          queryable: true,
          title: 'Fuel Stations',
          abstract: 'محطات الوقود'
        },
        '98': {
          queryable: true,
          title: 'Department Stores',
          abstract: 'مواقع الاسواق'
        },
        '99': {
          queryable: true,
          title: 'Shopping Mall Locations',
          abstract: 'المتاجر متعددة الأقسام'
        },
        '100': {
          queryable: true,
          title: 'Market Locations',
          abstract: 'مواقع المراكز التجارية'
        },
        '101': {
          queryable: true,
          title: 'Ambulance Station',
          abstract: 'مراكز الاسعاف'
        },
        '102': {
          queryable: true,
          title: 'Civil Defense Centers',
          abstract: 'مراكز الدفاع المدني'
        },
        '103': {
          queryable: true,
          title: 'Police Station',
          abstract: 'مراكز الشرطة'
        },
        '104': {
          queryable: true,
          title: 'Government Offices',
          abstract: 'مواقع الجهات الحكومية'
        },
        '105': {
          queryable: true,
          title: 'College Locations',
          abstract: 'مراكز التدريب والتأهيل'
        },
        '106': {
          queryable: true,
          title: 'Training Centers',
          abstract: 'مواقع الكليات'
        },
        '107': {
          queryable: true,
          title: 'University Locations',
          abstract: 'مواقع الجامعات'
        },
        '108': {
          queryable: true,
          title: 'School Locations',
          abstract: 'مواقع المدارس'
        },
        '109': {
          queryable: true,
          title: 'Health Centers',
          abstract: 'المراكز الصحية'
        },
        '110': {
          queryable: true,
          title: 'Hospital Locations',
          abstract: 'مواقع المستشفيات'
        },
        '111': {
          queryable: true,
          title: 'Diagnostic Centers',
          abstract: 'مراكز التشخيص الطبي'
        },
        '112': {
          queryable: true,
          title: 'Churches',
          abstract: 'الأضرحة'
        },
        '113': {
          queryable: true,
          title: 'Temples',
          abstract: 'الكنائس'
        },
        '114': {
          queryable: true,
          title: 'Shrines',
          abstract: 'المعابد'
        },
        '115': {
          queryable: true,
          title: 'Mosques',
          abstract: 'المساجد'
        },
        '116': {
          queryable: true,
          title: 'Amusement Parks',
          abstract: 'المتنزهات الترفيهية'
        },
        '117': {
          queryable: true,
          title: 'Beach Location',
          abstract: 'مواقع الشواطئ'
        },
        '118': {
          queryable: true,
          title: 'Cinema Theaters',
          abstract: 'دور السينما'
        },
        '119': {
          queryable: true,
          title: 'Skating Centers',
          abstract: 'مراكز التزلج'
        },
        '120': {
          queryable: true,
          title: 'Bowling Centers',
          abstract: 'مراكز البولينج'
        },
        '121': {
          queryable: true,
          title: 'Theaters',
          abstract: 'المسارح'
        },
        '122': {
          queryable: true,
          title: 'Cultural Facilities',
          abstract: 'المواقع الثقافية'
        },
        '123': {
          queryable: true,
          title: 'Museums',
          abstract: 'المتاحف'
        },
        '124': {
          queryable: true,
          title: 'Park Locations',
          abstract: 'مواقع الحدائق'
        },
        '125': {
          queryable: true,
          title: 'Convention Centers',
          abstract: 'مراكز المؤتمرات'
        },
        '126': {
          queryable: true,
          title: 'Resturants',
          abstract: 'المطاعم'
        },
        '127': {
          queryable: true,
          title: 'Hotels',
          abstract: 'الفنادق'
        },
        '128': {
          queryable: true,
          title: 'Archeological Site Locations',
          abstract: 'المواقع الأثرية - النقاط'
        },
        '129': {
          queryable: true,
          title: 'FerryTerminals',
          abstract: 'محطات العبارات'
        },
        '130': {
          queryable: true,
          title: 'Airport Locations',
          abstract: 'المطارات'
        }
      }
    }
  ].sort((a, b) => a.title.localeCompare(b.title))
    .sort((a, b) => a.area.localeCompare(b.area))
    .forEach((map) => maps.set(map.id, map));
  //#endregion

  //#region Utility classes
  var Settings = {
    'get': function() {
      var settings;
      if (localStorage.OpenMaps) {
        settings = JSON.parse(localStorage.OpenMaps);
      }
      if (!settings) {
        settings = {};
      }
      if (typeof settings.tooltips == 'undefined') {
        settings.tooltips = true;
      }
      if (!settings.state) {
        settings.state = {};
      }
      if (!settings.state.active) {
        settings.state.active = [];
      }
      return settings;
    },
    'put': function(obj) {
      localStorage.OpenMaps = JSON.stringify(obj);
    },
    'set': function(setting, value) {
      var settings = this.get();
      settings[setting] = value;
      this.put(settings);
    },
    'exists': function() {
      return typeof localStorage.OpenMaps != 'undefined';
    }
  };

  var Tooltips = (function() {
    var elements = [];
    return {
      'add': function(element, text, force) {
        if (Settings.get().tooltips || force) {
          element.title = text;
          $(element).tooltip({
            trigger: 'hover'
          });
        }
        if (!force) {
          element.dataset.title = text;
          elements.push(element);
        }
      },
      'remove': function(element) {
        $(element).tooltip('destroy');
        element.title = '';
        var toRemoveIdx = elements.findIndex(function(el) { return el == element; });
        if (toRemoveIdx !== -1) {
          elements.splice(toRemoveIdx, 1);
        }
      },
      'enabled': function() {
        return Settings.get().tooltips;
      },
      'toggle': function() {
        var isEnabled = Settings.get().tooltips;
        Settings.set('tooltips', !isEnabled);
        if (isEnabled) {
          elements.forEach(function(element) {
            $(element).tooltip('destroy');
            element.title = '';
          });
        } else {
          elements.forEach(function(element) {
            element.title = element.dataset.title;
            $(element).tooltip({
              trigger: 'hover'
            });
          });
        }
      }
    };
  })();

  var IDGenerator = (function() {
    var counter = 0;
    return {
      getNext: function() {
        return counter++;
      }
    };
  })();
  //#endregion

  //#region Check version
  // Convert from old storage object
  if (localStorage.OpenMaps_version) {
    Settings.set('version', localStorage.OpenMaps_version);
    localStorage.removeItem('OpenMaps_version');
  }
  var version = Settings.get().version,
      scriptVersion = GM_info.script.version;
  if (!version) {
    Settings.set('version', scriptVersion);
  } else if (version !== scriptVersion) {
    var versions = Object.keys(translations.en.update).map((version) => version.replace('v', '').replaceAll('_', '.'));
    if (versions.indexOf(version) === -1) {
      // The version has been tampered with if we arrive here, just set to current version
      log('The version number seems to have been tampered with? Ignoring and resetting');
      Settings.set('version', scriptVersion);
      return;
    }
    var message = I18n.t('openmaps.update.message');
    for (var i = versions.indexOf(version)+1; i < versions.length; i++) {
      message += '\nv' + versions[i] + ':\n' + I18n.t('openmaps.update.v' + versions[i].replace(/\./g, '_'));
    }
    Settings.set('version', scriptVersion);
    alert(message);
  }
  //#endregion

  // Adjust map tile reload attempts (by default set to 0). This also makes OpenLayers attempt to load tiles a second time in other layers
  OpenLayers.IMAGE_RELOAD_ATTEMPTS = 1;

  // List of map handles
  var handles = [];

  //#region Create tab and layer group
  var tab = await (async function() {
    const {tabLabel, tabPane} = W.userscripts.registerSidebarTab('openMaps');

    tabLabel.innerHTML = '<span class="fa"></span>';
    tabLabel.title = I18n.t('openmaps.tab_title');
    tabPane.id = 'sidepanel-openMaps';

    await W.userscripts.waitForElementConnected(tabPane);

    return Promise.resolve(tabPane);
  })();

  // New map layer drawer group
  var omGroup = createLayerToggler(null, true, 'Open Maps', null);

  // Satellite imagery toggle
  var satImagery = document.createElement('wz-checkbox');
  satImagery.checked = W.map.getLayerByName('satellite_imagery').getVisibility();
  // It seems that wz-checkbox can't handle being checked twice, even if the state remains the same
  var checkboxSemaphore = false;
  satImagery.addEventListener('click', function() {
    checkboxSemaphore = true;
    W.map.getLayerByName('satellite_imagery').setVisibility(!W.map.getLayerByName('satellite_imagery').getVisibility());
    checkboxSemaphore = false;
  });
  W.map.getLayerByName('satellite_imagery').events.register('visibilitychanged', null, function() {
    if (checkboxSemaphore) {
      return;
    }
    satImagery.checked = W.map.getLayerByName('satellite_imagery').getVisibility();
  });
  satImagery.textContent = I18n.t('openmaps.satellite_imagery');
  tab.appendChild(satImagery);

  // Implement tab content
  var title = document.createElement('h4');
  title.textContent = I18n.t('openmaps.maps_title');
  tab.appendChild(title);
  var handleList = document.createElement('div');
  handleList.className = 'openmaps-map-list';
  sortable(handleList, {
    forcePlaceholderSize: true,
    placeholderClass: 'result',
    handle: '.fa-reorder'
  })[0].addEventListener('sortupdate', function(e) {
    var movedHandle = handles.splice(e.detail.oldElementIndex, 1)[0];
    handles.splice(e.detail.elementIndex, 0, movedHandle);
    var layerGroups = handleList.childNodes;
    if (e.detail.elementIndex == layerGroups.length-1) {
      layerGroups[e.detail.oldElementIndex].parentNode.appendChild(layerGroups[e.detail.oldElementIndex]);
    } else {
      layerGroups[e.detail.oldElementIndex].parentNode.insertBefore(layerGroups[e.detail.oldElementIndex], layerGroups[e.detail.elementIndex]);
    }
    if (e.detail.elementIndex >= 0 && e.detail.elementIndex < handles.length) { // sanity check
      var aerialImageryIndex = Math.max.apply(null, W.map.layers.map(layer => layer.project == 'earthengine-legacy' ? W.map.getLayerIndex(layer) : 0));
      W.map.getOLMap().setLayerIndex(movedHandle.layer, (aerialImageryIndex >= 0 ? aerialImageryIndex : 0) + e.detail.elementIndex + 1);
    }
    saveMapState();
  });
  tab.appendChild(handleList);

  // Select box to add new Open Maps maps
  var addMapSelect = document.createElement('select');
  addMapSelect.className = 'form-control';
  updateMapSelector();
  W.map.events.register('moveend', null, updateMapSelector);
  addMapSelect.addEventListener('change', function() {
    if (addMapSelect.selectedIndex != 0) {
      var mapId = addMapSelect.options[addMapSelect.selectedIndex].value;
      handles.push(new MapHandle(maps.get(parseInt(mapId))));
      saveMapState();
      addMapSelect.selectedIndex = 0;
      updateMapSelector();
    }
  });
  tab.appendChild(addMapSelect);

  var footer = document.createElement('p');
  var hideTooltips = document.createElement('a');
  hideTooltips.textContent = (Settings.get().tooltips ? I18n.t('openmaps.hide_tooltips') : I18n.t('openmaps.show_tooltips'));
  hideTooltips.style.float = 'right';
  hideTooltips.style.cursor = 'pointer';
  hideTooltips.addEventListener('click', function() {
    Tooltips.toggle();
    hideTooltips.textContent = (Settings.get().tooltips ? I18n.t('openmaps.hide_tooltips') : I18n.t('openmaps.show_tooltips'));
  });
  footer.appendChild(hideTooltips);
  try {
    footer.appendChild(document.createTextNode(GM_info.script.name + ': v' + GM_info.script.version));
  } catch (e) {
    // Probably no support for GM_info, ignore
  }
  footer.style.fontSize = '11px';
  tab.appendChild(footer);
  //#endregion

  //#region Reload previous map(s)
  if (Settings.exists()) {
    var settings = Settings.get();
    settings.state.active.forEach(function(mapHandle, i) {
      if (!maps.has(mapHandle.mapId)) { // no strict equal as null should fail as well
        settings.state.active.splice(i, 1);
        Settings.put(settings);
        return;
      }
      handles.push(new MapHandle(maps.get(mapHandle.mapId), {
        opacity: mapHandle.opacity,
        layers: mapHandle.layers,
        hidden: mapHandle.hidden,
        transparent: mapHandle.transparent,
        improveMap: mapHandle.improveMap
      }));
      saveMapState();
    });
  }
  //#endregion

  //#region Implement map query support
  // Add the control to catch a click on the map area for retrieving map information
  var queryWindowContent, queryWindowOriginalContent;
  var queryWindow = document.createElement('div');
  queryWindow.className = 'open-maps-query-window';
  queryWindow.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  var styleObserver = new MutationObserver(function() {
    if (queryWindow.style.height != '') {
      Settings.set('queryWindowHeight', queryWindow.style.height);
    }
  });
  styleObserver.observe(queryWindow, { attributes: true, attributeFilter: ['style'] });
  var mapObserver = new MutationObserver(function() {
    if (document.getElementById('map').classList.contains('lightboxShown')) {
      queryWindow.style.top = '';
      queryWindow.style.bottom = '35px';
    } else {
      queryWindow.style.top = '40px';
      queryWindow.style.bottom = '';
    }
  });
  mapObserver.observe(document.getElementById('map'), { attributes: true, attributeFilter: ['class'] });
  var queryWindowSwitch = document.createElement('span');
  queryWindowSwitch.className = 'fa fa-fw fa-2x fa-retweet open-maps-query-window-button-left';
  queryWindowSwitch.dataset.placement = 'right';
  Tooltips.add(queryWindowSwitch, I18n.t('openmaps.query_window_switch'));
  queryWindowSwitch.addEventListener('click', function() {
    queryWindowOriginalContent.classList.toggle('hidden');
    queryWindowContent.classList.toggle('hidden');
    var settings = Settings.get();
    settings.queryWindowDisplay = (settings.queryWindowDisplay == undefined || settings.queryWindowDisplay == 'processed' ? 'original': 'processed' );
    Settings.put(settings);
  });
  queryWindow.appendChild(queryWindowSwitch);
  var queryWindowQuery = document.createElement('span');
  queryWindowQuery.className = 'fa fa-fw fa-2x fa-hand-pointer-o open-maps-query-window-button-left';
  queryWindowQuery.dataset.placement = 'right';
  Tooltips.add(queryWindowQuery, I18n.t('openmaps.query_window_query'));
  queryWindowQuery.addEventListener('click', function() {
    if (!getFeatureInfoControl.active) {
      if (getFeatureInfoControl.params) {
        queryWindowQuery.style.color = 'blue';
        getFeatureInfoControl.params.callback = function() {
          queryWindowQuery.style.color = '';
        };
        getFeatureInfoControl.activate();
      } else {
        log('Could not find previous query parameters, weird.');
      }
    } else {
      getFeatureInfoControl.deactivate();
    }
  });
  queryWindow.appendChild(queryWindowQuery);
  var queryWindowClose = document.createElement('span');
  queryWindowClose.className = 'fa fa-fw fa-2x fa-window-close open-maps-query-window-button-right';
  queryWindowClose.addEventListener('click', function() {
    queryWindow.style.display = 'none';
  });
  queryWindow.appendChild(queryWindowClose);
  var queryWindowMinimize = document.createElement('span');
  queryWindowMinimize.className = 'fa fa-fw fa-2x fa-toggle-up open-maps-query-window-button-right';
  queryWindowMinimize.addEventListener('click', function() {
    var isMinimized = queryWindow.style.height != '';
    queryWindow.style.height = (isMinimized ? '' : Settings.get().queryWindowHeight || '185px');
    queryWindow.style.resize = (isMinimized ? 'none' : 'vertical');
    queryWindowMinimize.classList.toggle('fa-toggle-up', isMinimized);
    queryWindowMinimize.classList.toggle('fa-toggle-down', !isMinimized);
  });
  queryWindow.appendChild(queryWindowMinimize);
  var queryWindowTitle = document.createElement('h2');
  queryWindowTitle.textContent = I18n.t('openmaps.query_window_title');
  queryWindow.appendChild(queryWindowTitle);
  var queryWindowLoading = document.createElement('p');
  queryWindowLoading.style.textAlign = 'center';
  queryWindowLoading.style.fontSize = '21px';
  var queryWindowLoadingSpinner = document.createElement('span');
  queryWindowLoadingSpinner.className = 'fa fa-spinner fa-pulse';
  queryWindowLoading.appendChild(queryWindowLoadingSpinner);
  queryWindowLoading.appendChild(document.createTextNode(' ' + I18n.t('openmaps.query_window_loading')));
  queryWindow.appendChild(queryWindowLoading);
  queryWindowContent = document.createElement('div');
  queryWindowContent.style.fontSize = '14px';
  var queryWindowDisplay = Settings.get().queryWindowDisplay;
  queryWindowContent.classList.toggle('hidden', queryWindowDisplay == 'original');
  queryWindow.appendChild(queryWindowContent);
  queryWindowOriginalContent = document.createElement('div');
  queryWindowOriginalContent.style.fontSize = '14px';
  queryWindowOriginalContent.className = 'hidden';
  queryWindowOriginalContent.classList.toggle('hidden', queryWindowDisplay != 'original');
  queryWindow.appendChild(queryWindowOriginalContent);
  document.getElementById('WazeMap').appendChild(queryWindow);
  var querySymbol = document.createElement('span');
  querySymbol.className = 'fa fa-exclamation-triangle fa-4x';
  querySymbol.style.float = 'left';
  querySymbol.style.margin = '0 15px 30px';
  var getFeatureInfoControl = new OpenLayers.Control({
    id: 'GetFeatureInfoControl',
    eventListeners: {
      'activate': function() {
        document.getElementById('WazeMap').style.cursor = 'help';
      },
      'deactivate': function() {
        document.getElementById('WazeMap').style.cursor = '';
      }
    }
  });
  W.map.addControl(getFeatureInfoControl);
  var clickHandler = new OpenLayers.Handler.Click(getFeatureInfoControl, {
    'click': function(e) {
      getFeatureInfoControl.deactivate();
      getFeatureInfoControl.params.callback();
      var queryUrl = getFeatureInfoControl.params.url + '?SERVICE=WMS&REQUEST=GetFeatureInfo&STYLES=&BBOX=' + getMapExtent().toBBOX() +
          '&LAYERS=' + getFeatureInfoControl.params.layers + '&QUERY_LAYERS=' + getFeatureInfoControl.params.layers +
          '&HEIGHT=' + W.map.getSize().h + '&WIDTH=' + W.map.getSize().w +
          '&VERSION=1.3.0&CRS=EPSG:3857&I=' + e.xy.x + '&J=' + e.xy.y + '&INFO_FORMAT=text/html';
      var mapId = getFeatureInfoControl.params.id;
      queryWindowLoading.style.display = 'block';
      while (queryWindowContent.firstChild) {
        queryWindowContent.removeChild(queryWindowContent.firstChild);
      }
      while (queryWindowOriginalContent.firstChild) {
        queryWindowOriginalContent.removeChild(queryWindowOriginalContent.firstChild);
      }
      queryWindow.style.display = 'block';
      GM_xmlhttpRequest({
        method: 'GET',
        headers: {
          Accept: 'text/xml'
        },
        url: queryUrl,
        timeout: 10000,
        onload: function(response) {
          queryWindowLoading.style.display = 'none';
          if (response.status == 200) {
            if (!response.responseXML) {
              response.responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
            }
            // While probably not 100% waterproof, at least this should counter most XSS vectors
            var unwantedNodes = response.responseXML.querySelectorAll('javascript,iframe,frameset,applet,embed,object,style');
            for (let i = 0; i < unwantedNodes.length; i++) {
              unwantedNodes[i].parentNode.removeChild(unwantedNodes[i]);
            }
            var body = response.responseXML.querySelector('body');
            var content = body ? body.textContent.trim() : '';
            if (body && content.length != 0) {
              removeUnsafeAttributes(body);
              queryWindowOriginalContent.innerHTML = body.innerHTML;
              setBorders(queryWindowOriginalContent)
              queryWindowContent.innerHTML = body.innerHTML;
              maps.get(mapId).query_filters.forEach((func) => {
                func(queryWindowContent, maps.get(mapId));
              });
              queryWindow.style.display = 'block';
              var escHandler = function(e) {
                if (e.keyCode == 27) { // Esc key
                  if (queryWindow.style.display == 'block') {
                    queryWindow.style.display = 'none';
                    e.stopPropagation();
                  }
                  document.removeEventListener('keydown', escHandler);
                }
              };
              document.addEventListener('keydown', escHandler);
            } else {
              querySymbol.style.color = '#999';
              queryWindowContent.appendChild(querySymbol);
              var emptyResponse = document.createElement('p');
              emptyResponse.textContent = I18n.t('openmaps.query_empty_response');
              queryWindowContent.appendChild(emptyResponse);
              var emptyResponseAdvice = document.createElement('p');
              emptyResponseAdvice.innerHTML = I18n.t('openmaps.query_empty_response_advice').replace("{hotkey}", "<kbd>" + (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "Cmd" : "Ctrl") + "+0</kbd>");
              queryWindowContent.appendChild(emptyResponseAdvice);
            }
          } else {
            log(response);
            querySymbol.style.color = 'red';
            queryWindowContent.appendChild(querySymbol);
            var errorResponseTitle = document.createElement('p');
            errorResponseTitle.textContent = I18n.t('openmaps.errors.network');
            queryWindowContent.appendChild(errorResponseTitle);
            var errorResponse = document.createElement('p');
            errorResponse.textContent = I18n.t('openmaps.errors.network_description') + (response.statusText ? response.statusText : '<empty>') + ' (' + response.status + ')';
            queryWindowContent.appendChild(errorResponse);
          }
        },
        ontimeout: function(e) {
          log(e);
          queryWindowLoading.style.display = 'none';
          querySymbol.style.color = 'orange';
          queryWindowContent.appendChild(querySymbol);
          var timeoutResponse = document.createElement('p');
          timeoutResponse.textContent = I18n.t('openmaps.errors.timeout_description');
          queryWindowContent.appendChild(timeoutResponse);
        },
        onerror: function(e) {
          log(e);
          queryWindowLoading.style.display = 'none';
          querySymbol.style.color = 'red';
          queryWindowContent.appendChild(querySymbol);
          var errorResponseTitle = document.createElement('p');
          errorResponseTitle.textContent = I18n.t('openmaps.errors.network');
          queryWindowContent.appendChild(errorResponseTitle);
          var errorResponse = document.createElement('p');
          errorResponse.textContent = I18n.t('openmaps.errors.see_console');
          queryWindowContent.appendChild(errorResponse);
        }
      });
    }
  });
  getFeatureInfoControl.handler = clickHandler;

  function removeUnsafeAttributes(node) {
    if (node.nodeType == Node.ELEMENT_NODE) {
      for (let i = 0; i < node.attributes.length; i++) {
        var attrName = node.attributes[i].name.toLowerCase();
        if (attrName.startsWith('on') || attrName == 'style' || attrName == 'class' || (attrName == 'href' && node.attributes[i].value.trim().toLowerCase().startsWith('javascript:'))) {
          node.removeAttribute(attrName);
        }
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      removeUnsafeAttributes(node.childNodes[i]);
    }
  }

  function setBorders(body) {
    var tables = body.querySelectorAll('table');
    for (let i = 0; i < tables.length; i++) {
      tables[i].border = '1';
    }
  }

  // Turn the columns of the table into rows to make the table go from horizontal to vertical
  function transposeTables(body) {
    var tables = body.querySelectorAll('table');
    for (let i = 0; i < tables.length; i++) {
      var newTable = transposeTable(tables[i]);
      tables[i].parentNode.insertBefore(newTable, tables[i]);
      tables[i].parentNode.removeChild(tables[i]);
    }
    function transposeTable(table) {
      var newTable = document.createElement('table');
      newTable.className = 'table table-striped table-hover table-condensed';
      var caption = table.querySelector('caption');
      if (caption) {
        var header = document.createElement('h5');
        header.textContent = caption.textContent;
        table.parentNode.insertBefore(header, table);
        table.removeChild(caption);
      }
      var tableHead = document.createElement('thead');
      var tableHeadRow = document.createElement('tr');
      var propertyHead = document.createElement('th');
      propertyHead.textContent = I18n.t('openmaps.query_table_property');
      tableHeadRow.appendChild(propertyHead);
      var valueHead = document.createElement('th');
      valueHead.textContent = I18n.t('openmaps.query_table_value');
      tableHeadRow.appendChild(valueHead);
      tableHead.appendChild(tableHeadRow);
      newTable.appendChild(tableHead);
      var tableBody = document.createElement('tbody');
      var firstRow = table.querySelector('tr');
      for (let i = 0; i < firstRow.childNodes.length; i++) {
        if (firstRow.childNodes[i].nodeType == 1) { // Element nodes only
          tableBody.appendChild(document.createElement('tr'));
        }
      }
      var rows = table.querySelectorAll('tr');
      for (let i = 0; i < rows.length; i++) {
        distributeColumnsOverRows(rows[i].childNodes, tableBody);
      }
      newTable.appendChild(tableBody);
      return newTable;
    }
    function distributeColumnsOverRows(columns, tbody) {
      var skippedCols = 0;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].nodeType == 1) { // Element nodes only
          var cell = document.createElement('td');
          cell.textContent = columns[i].textContent;
          tbody.childNodes[i - skippedCols].appendChild(cell);
        } else {
          skippedCols++;
        }
      }
    }
  }

  // Remove table rows with an empty or null value
  function cleanTableRows(body) {
    var rows = body.querySelectorAll('table tr');
    for (let i = 0; i < rows.length; i++) {
      cleanRow(rows[i]);
    }
    function cleanRow(row) {
      var rowProperty = row.childNodes[0];
      if (rowProperty.textContent.indexOf('_') != -1) {
        rowProperty.textContent = rowProperty.textContent.replace(/_/g, ' ').replace(/  /g, ' ').trim();
      }
      var rowContent = row.childNodes[1].textContent.trim();
      if (rowContent == '' || rowContent.toLowerCase() == 'null') {
        row.parentNode.removeChild(row);
      }
    }
  }

  // Put certain rows at first place as they are more important
  function reorderTableRows(body, map) {
    var propertyOrder = {
      '3101': [ 'openbare ruimte', 'huisnummer', 'huisletter', 'woonplaats' ],
      '3105': [ 'sttNaam', 'gmeNaam', 'wegnummer' ],
      '3108': [ 'maxshd', 'betrwbheid', 'stt naam' ],
      '3202': [ 'OpnDatum' ],
      '3206': [ 'OpnDatum' ],
      '3207': [ 'linksStraatnaam', 'rechtsStraatnaam', 'lblMorfologie', 'lblBeheerder', 'lblOrganisatie' ],
      '3208': [ 'NAAM' ],
      '3209': [ 'OpnDatum' ],
      '3211': [ 'OpnDatum' ],
      '3212': [ 'Snelheidsbeperking', 'Variabel bord' ],
      '3217': [ 'NOM ROUTE', 'NUMERO ROUTE', 'TYPE DESC', 'SOUS TYPE DESC' ],
      '3220': [ 'bordcode' ],
      '3221': [ 'Snelheid' ],
      '3237': [ 'VolledigAdres', 'AdresStatus' ],
      '3238': [ 'HindranceDescription', 'HindranceStart', 'HindranceEnd', 'HindranceStatus', 'Consequences' ],
      '3239': [ 'HindranceDescription', 'HindranceStart', 'HindranceEnd', 'HindranceStatus', 'Consequences' ],
      '5501': [ 'COMPLETO' ]
    };
    if (!propertyOrder[map.id]) {
      return;
    }
    var rows = body.querySelectorAll('table tr');
    var priorityRows = [];
    for (var i = 0; i < rows.length; i++) {
      var location = propertyOrder[map.id].indexOf(rows[i].firstChild.textContent);
      if (location > -1) {
        priorityRows[location] = rows[i];
      }
    }
    priorityRows.reverse().forEach(function(priorityRow) {
      priorityRow.parentNode.insertBefore(priorityRow, priorityRow.parentNode.firstChild);
    });
  }

  // Turn links within table cells into anchors
  function transformUrlsToLinks(body) {
    var cells = body.querySelectorAll('tr td')
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].textContent.startsWith('http')) {
        var anchor = document.createElement('a');
        anchor.href = cells[i].textContent.replace(/&amp;&/g, '&'); // GIPOD issue. TODO: report.
        anchor.target = '_blank';
        anchor.textContent = anchor.href;
        cells[i].textContent = '';
        cells[i].appendChild(anchor);
      }
    }
  }

  // Put any available map layers into separate tabs
  function tabifyLayerBlocks(body, map) {
    var handles = document.createElement('ul');
    handles.className = 'nav nav-tabs';
    var containers = [];
    var currentNode = body.firstChild;
    while (currentNode != null) {
      if (currentNode.nodeName == 'H5') {
        addTab(currentNode);
        removeAndSetNextSibling();
      } else if (containers.length == 0) {
        removeAndSetNextSibling();
      } else {
        var toMove = currentNode;
        currentNode = currentNode.nextSibling;
        containers[containers.length - 1].appendChild(toMove);
      }
    }
    setActiveTab(handles.firstChild);
    body.appendChild(handles);
    for (var i = 0; i < containers.length; i++) {
      body.appendChild(containers[i]);
    }

    function removeAndSetNextSibling() {
      var toRemove = currentNode;
      currentNode = currentNode.nextSibling;
      toRemove.parentNode.removeChild(toRemove);
    }
    function addTab(header) {
      var nameMatch = /'([^']+)'/.exec(header.textContent);
      var layerName = document.createElement('a');
      layerName.style.cursor = 'default';
      if (nameMatch == null || nameMatch.length == 0 || nameMatch[1] == '') {
        layerName.textContent = header.textContent;
      } else if (map.layers[nameMatch[1]]) {
        layerName.textContent = map.layers[nameMatch[1]].title;
      } else {
        layerName.textContent = nameMatch[1];
      }
      var layerContainer = document.createElement('div');
      containers.push(layerContainer);
      var layerTab = document.createElement('li');
      layerTab.addEventListener('click', function() {
        setActiveTab(layerTab);
      });
      layerTab.appendChild(layerName);
      handles.appendChild(layerTab);
    }
    function setActiveTab(activeHandle) {
      for (var i = 0; i < handles.childNodes.length; i++) {
        var handle = handles.childNodes[i];
        handle.classList.toggle('active', handle == activeHandle);
        handle.firstChild.style.color = (handle == activeHandle ? '#3d3d3d' : '');
        handle.firstChild.style.fontWeight = (handle == activeHandle ? 700 : 400);
        var container = containers[i];
        container.classList.toggle('hidden', handle != activeHandle);
      }
    }
  }

  function applyAllTransformations(body, map) {
    transposeTables(body);
    transformUrlsToLinks(body);
    cleanTableRows(body);
    reorderTableRows(body, map);
    tabifyLayerBlocks(body, map);
  }
  //#endregion

  //#region UI support functions
  function createLayerToggler(parentGroup, checked, name, toggleCallback) {
    var normalizedName = name.toLowerCase().replace(/\s/g, '');
    if (parentGroup == null) {
      var group = document.createElement('li');
      group.className = 'group';
      var groupChildren = document.createElement('ul');
      var groupToggler = document.createElement('div');
      groupToggler.className = 'layer-switcher-toggler-tree-category';
      var groupCaret = document.createElement('i');
      groupCaret.className = 'toggle-category w-icon w-icon-caret-down';
      if (!checked) {
        groupCaret.classList.add('upside-down');
      }
      groupCaret.dataset.groupId = 'GROUP_' + normalizedName;
      groupToggler.appendChild(groupCaret);
      var groupSwitch = document.createElement('wz-toggle-switch');
      groupSwitch.className = 'layer-switcher-group_' + normalizedName;
      groupSwitch.id = 'layer-switcher-group_' + normalizedName;
      groupToggler.appendChild(groupSwitch);
      var groupSwitchLabel = document.createElement('label');
      groupSwitchLabel.className = 'label-text';
      groupSwitchLabel.htmlFor = groupSwitch.id;
      groupSwitchLabel.textContent = name;
      groupToggler.appendChild(groupSwitchLabel);
      group.appendChild(groupToggler);
      groupChildren.className = 'collapsible-GROUP_' + normalizedName;
      group.appendChild(groupChildren);
      document.querySelector('.list-unstyled.togglers').appendChild(group);
      groupCaret.addEventListener('click', function(e) {
        groupCaret.classList.toggle('upside-down');
        groupChildren.classList.toggle('collapse-layer-switcher-group');
      });
      groupSwitch.checked = checked;
      return group;
    } else {
      var layerItem = document.createElement('li');
      layerItem.innerHTML = `<wz-checkbox id="layer-switcher-${normalizedName}" value="off" checked="">${name}</wz-checkbox>`;
      var layerToggle = layerItem.querySelector('wz-checkbox');
      layerToggle.checked = false;
      parentGroup.querySelector('ul').appendChild(layerItem);
      var parentSwitch = parentGroup.querySelector('wz-toggle-switch');
      var parentObserver = new MutationObserver(() => {
        layerToggle.disabled = !parentSwitch.hasAttribute('checked');
        toggleCallback && toggleCallback(layerToggle.checked && parentSwitch.hasAttribute('checked'));
      });
      parentObserver.observe(parentSwitch, { attributes: true, attributeFilter: ['checked'] });
      layerToggle.addEventListener('click', e => toggleCallback(e.target.checked && parentSwitch.hasAttribute('checked')));
      layerToggle.checked = checked;
      return layerItem;
    }
  }

  function updateMapSelector() {
    var localMaps = [];
    let dataProjection = new OpenLayers.Projection('EPSG:4326');
    // TODO: decrease calculations by checking whether anything has changed instead of always refilling the select
    maps.forEach((map) => {
      let bounds = (new OpenLayers.Bounds(map.bbox)).transform(dataProjection, W.map.getProjectionObject());
      if (bounds.intersectsBounds(getMapExtent())) {
        localMaps.push(map);
      }
    });
    // Clear list
    while (addMapSelect.firstChild) {
      addMapSelect.removeChild(addMapSelect.firstChild);
    }
    if (localMaps.length == 0) {
      var noMaps = document.createElement('option');
      noMaps.text = I18n.t('openmaps.no_local_maps');
      addMapSelect.appendChild(noMaps);
    } else {
      var selectMap = document.createElement('option');
      selectMap.text = I18n.t('openmaps.select_map');
      addMapSelect.appendChild(selectMap);
      var optgroups = {};
      localMaps.forEach((map) => {
        if (!optgroups[map.area]) {
          optgroups[map.area] = document.createElement('optgroup');
          optgroups[map.area].label = I18n.t('openmaps.areas.' + map.area);
        }
        // Don't show option if the map is already added
        // TODO: instead allow users to rename maps and allow duplicates
        if (handles.some((handle) => map.id == handle.mapId)) {
          return;
        }
        var option = document.createElement('option');
        option.text = map.title;
        option.value = map.id;
        option.title = map.abstract;
        optgroups[map.area].appendChild(option);
      });
      Object.keys(optgroups).forEach(function(optgroup) {
        addMapSelect.appendChild(optgroups[optgroup]);
      });
    }
    // Have some active maps moved out of view?
    handles.forEach(function(handle) {
      var handleIsLocal = localMaps.some((map) => map.id == handle.mapId);
      if (handleIsLocal && handle.outOfArea) {
        handle.outOfArea = false;
        handle.layer.setVisibility(!handle.hidden);
        handle.updateVisibility();
      }
      if (!handleIsLocal && !handle.outOfArea) {
        handle.outOfArea = true;
        handle.layer.setVisibility(false);
        handle.updateVisibility();
      }
    });
  }

  function getMapExtent() {
    let mapExtent = W.map.getExtent();
    let dataProjection = new OpenLayers.Projection('EPSG:4326');

    return (new OpenLayers.Bounds(mapExtent)).transform(dataProjection, W.map.getProjectionObject());
  }
  //#endregion

  //#region Map tile support functions
  function loadTileError(tile, callback) {
    // Request the tile again to check the error (OpenLayers doesn't provide this information)
    GM_xmlhttpRequest({
      method: 'GET',
      url: tile.url,
      timeout: 10000,
      onload: function (response) {
        if (response.status == 200) {
          if (!response.responseXML) {
            response.responseXML = new DOMParser().parseFromString(response.responseText, 'text/xml');
          }
          var serviceException = response.responseXML.querySelector('ServiceException');
          if (serviceException) {
            callback({
              title: serviceException.getAttribute('code').replace(/([a-z])([A-Z])/g, '$1 $2'), // de-camelCase
              description: serviceException.textContent.trim()
            });
          } else {
            if (response.responseHeaders.indexOf('Content-Type: image') !== -1) {
              log('Seems like we got an image response, redraw tile');
              callback({
                ok: true
              });
              tile.clear();
              tile.draw();
              return;
            }
            log('Failed to parse response');
            log(response);
            callback({
              title: I18n.t('openmaps.errors.parse_fail'),
              description: I18n.t('openmaps.errors.see_console')
            })
          }
        } else {
          callback({
            title: I18n.t('openmaps.errors.network'),
            description: I18n.t('openmaps.errors.network_description') + response.statusText
          });
        }
      },
      ontimeout: function(e) {
        callback({
          title: I18n.t('openmaps.errors.timeout'),
          description: I18n.t('openmaps.errors.timeout_description')
        });
      },
      onerror: function(e) {
        log('Network error');
        log(e);
        callback({
          title: I18n.t('openmaps.errors.network'),
          description: I18n.t('openmaps.errors.see_console')
        });
      }
    });
  }

  var tileManipulations = {
    // Replace all fully black pixels with white pixels
    'black2white': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i + 0] == 0 && bitmap.data[i + 1] == 0 && bitmap.data[i + 2] == 0) {
          bitmap.data[i + 0] = bitmap.data[i + 1] = bitmap.data[i + 2] = 255;
          dirty = true;
        }
      }
      return dirty;
    },
    // For the Oman map: change the beige colour to transparent
    'omanTransparent': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i + 0] == 235 && bitmap.data[i + 1] == 232 && bitmap.data[i + 2] == 222) {
          bitmap.data[i + 3] = 0;
          dirty = true;
        }
      }
      return dirty;
    },
    // For the Rio de Janeiro map: change the beige colour to transparent
    'rioTransparent': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i + 0] == 235 && bitmap.data[i + 1] == 255 && bitmap.data[i + 2] == 242) {
          bitmap.data[i + 3] = 0;
          dirty = true;
        }
      }
      return dirty;
    },
    // Remove partial transparency, calculate colour as if it were on a white background
    'removePartialTransparency': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i + 3] > 0) {
          bitmap.data[i + 0] = Math.floor(255 - bitmap.data[i + 3] + (bitmap.data[i + 3] / 255) * bitmap.data[i + 0] + 0.5);
          bitmap.data[i + 1] = Math.floor(255 - bitmap.data[i + 3] + (bitmap.data[i + 3] / 255) * bitmap.data[i + 1] + 0.5);
          bitmap.data[i + 2] = Math.floor(255 - bitmap.data[i + 3] + (bitmap.data[i + 3] / 255) * bitmap.data[i + 2] + 0.5);
          bitmap.data[i + 3] = 255;
          dirty = true;
        }
      }
      return dirty;
    },
    // Replace the colours for the Brussels map with the corresponding colours used in the WME for road types
    'brusselsSwapColours': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i + 3] > 0 && bitmap.data[i] == bitmap.data[i + 1] && bitmap.data[i + 1] == bitmap.data[i + 2]) {
          bitmap.data[i + 0] = 255;
          bitmap.data[i + 1] = 252;
          bitmap.data[i + 2] = 208;
          dirty = true;
        } else if (bitmap.data[i + 3] > 0 && bitmap.data[i] >= bitmap.data[i + 2]) {
          bitmap.data[i + 0] = 69;
          bitmap.data[i + 1] = 184;
          bitmap.data[i + 2] = 209;
          dirty = true;
        } else if (bitmap.data[i + 3] > 0 && bitmap.data[i] < bitmap.data[i + 2]) {
          bitmap.data[i + 0] = 105;
          bitmap.data[i + 1] = 191;
          bitmap.data[i + 2] = 136;
          dirty = true;
        }
      }
      return dirty;
    },
    // Remove partial transparency for black pixels, calculate colour as if it were on a white background
    'removePartialBlackTransparency': bitmap => {
      var dirty = false;
      for (let i = 0; i < bitmap.data.length; i += 4) {
        if (bitmap.data[i] < 5 && bitmap.data[i + 1] < 5 && bitmap.data[i + 2] < 5 && bitmap.data[i + 3] > 0) {
          bitmap.data[i + 0] = 255 - bitmap.data[i + 3];
          bitmap.data[i + 1] = 255 - bitmap.data[i + 3];
          bitmap.data[i + 2] = 255 - bitmap.data[i + 3];
          bitmap.data[i + 3] = 255;
          dirty = true;
        }
      }
      return dirty;
    },
    // Add white pixels around any grayscale pixels
    'traceGrayscalePixels': bitmap => {
      var dirty = false;
      var surroundingPixels = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      var pixelsSinceTrace = 2; // How many pixels ago did we trace around a pixel?
      for (let i = 0; i < bitmap.data.length; i += 4) {
        pixelsSinceTrace++;
        // Find opaque, non-white grayscale pixels
        if (bitmap.data[i + 3] != 0 && bitmap.data[i] != 255 && bitmap.data[i] == bitmap.data[i + 1] && bitmap.data[i + 1] == bitmap.data[i + 2]) {
          // Do not check positions we know have been checked by a previous iteration
          var positionsToCheck = (pixelsSinceTrace == 1) ? 3 : ((pixelsSinceTrace == 2) ? 5 : 8);
          surroundingPixels.slice(-1 * positionsToCheck).forEach(pixelRelation => {
            var x = ((i / 4) % bitmap.width) + pixelRelation[0],
                y = Math.floor((i / 4) / bitmap.width) + pixelRelation[1],
                offset = (y * bitmap.width + x) * 4;
            if (x >= 0 && x < bitmap.width && y >= 0 && y < bitmap.height && bitmap.data[offset + 3] == 0) {
              bitmap.data[offset + 0] = bitmap.data[offset + 1] = bitmap.data[offset + 2] = 255;
              bitmap.data[offset + 3] = 200;
              dirty = true;
            }
          });
          pixelsSinceTrace = 0;
        }
      }
      return dirty;
    },
    // Turn white tiles transparent
    'whiteTiles2transparent': bitmap => {
      var dirty = false;
      var pixelArray = new Uint32Array(bitmap.data.buffer);
      var white = 0xFFFFFFFF;
      var transparent = 0x00FFFFFF;
      var whitePixels = 0;
      // Do some analysis of the top and bottom borders to see whether this run is actually needed?
      for (var i = 0; i < bitmap.width; i++) {
        if (pixelArray[i] == white) {
          whitePixels++;
        }
      }
      for (var i = pixelArray.length - bitmap.width; i < pixelArray.length; i++) {
        if (pixelArray[i] == white) {
          whitePixels++;
        }
      }
      if (whitePixels > bitmap.width / 2) { // More than a quarter of the pixels are white
        pixelArray.forEach((pixel, idx) => {
          if (pixel == white) {
            pixelArray[idx] = transparent;
            dirty = true;
          }
        });
      }
      return dirty;
    },
    // Turn blank tiles transparent - tuned to 0xFFFDFDFD for Virginia
    'vaBlankTiles2Transparent': bitmap => {
      var dirty = false;
      var pixelArray = new Uint32Array(bitmap.data.buffer);
      var white = 0xFFFFFFFF;
      var offwhite = 0xFFFDFDFD;
      var transparent = 0x00FFFFFF;
      var whitePixels = 0;
      // Do some analysis of the top and bottom borders to see whether this run is actually needed?
      for (var i = 0; i < bitmap.width; i++) {
        if (pixelArray[i] == white || pixelArray[i] == offwhite) {
          whitePixels++;
        }
      }
      for (var i = pixelArray.length - bitmap.width; i < pixelArray.length; i++) {
        if (pixelArray[i] == white || pixelArray[i] == offwhite) {
          whitePixels++;
        }
      }
      if (whitePixels > bitmap.width / 2) { // More than a quarter of the pixels are white
        pixelArray.forEach((pixel, idx) => {
          if (pixel == white || pixel == offwhite) {
            pixelArray[idx] = transparent;
            dirty = true;
          }
        });
      }
      return dirty;
    },
    // Add a semi-transparent white overlay to make map details visible on satellite imagery
    'addTranslucentOverlay': bitmap => {
      var dirty = false;
      var pixelArray = new Uint32Array(bitmap.data.buffer);
      var whiteTranslucent = 0x33FFFFFF;
      var transparent = 0x00000000;
      pixelArray.forEach((pixel, idx) => {
          if (pixel == transparent) {
            pixelArray[idx] = whiteTranslucent;
            dirty = true;
          }
        });
      return dirty;
    }
  }

  // Manipulate a map tile received from the source
  function manipulateTile(event, manipulations) {
    if (event.aborted || !event.tile || !event.tile.imgDiv) {
      return;
    }
    var newTile = document.createElement('canvas');
    newTile.width = event.tile.imgDiv.width;
    newTile.height = event.tile.imgDiv.height;
    var context = newTile.getContext('2d');
    context.drawImage(event.tile.imgDiv, 0, 0);
    var imageData = context.getImageData(0, 0, newTile.width, newTile.height);
    var replaceNeeded = false;
    manipulations.forEach(manipulation => {
      if (tileManipulations.hasOwnProperty(manipulation)) {
        replaceNeeded = replaceNeeded || tileManipulations[manipulation](imageData);
      }
    });
    if (replaceNeeded) {
      context.putImageData(imageData, 0, 0);
      event.tile.imgDiv.src = newTile.toDataURL('image/png');
    }
  }
  //#endregion

  //#region Map layer handling
  function saveMapState() {
    var settings = Settings.get();
    settings.state.active = [];
    handles.forEach(function(handle) {
      var handleState = {
        mapId: handle.mapId,
        opacity: handle.opacity,
        layers: handle.mapLayers,
        hidden: handle.hidden,
        transparent: handle.transparent,
        improveMap: handle.improveMap
      };
      settings.state.active.push(handleState);
    });
    Settings.put(settings);
  }

  function MapHandle(map, options) {
    var self = this;
    this.layer = null;
    this.mapId = map.id;
    this.mapLayers = [];
    this.opacity = (options && options.opacity ? options.opacity : "100");
    this.area = (new OpenLayers.Bounds(map.bbox)).transform(new OpenLayers.Projection('EPSG:4326'), W.map.getProjectionObject());
    this.outOfArea = !this.area.intersectsBounds(getMapExtent());
    this.hidden = (options && options.hidden ? true : false);
    this.transparent = (options && !options.transparent || map.format == 'image/jpeg' ? false : true);
    this.improveMap = (options && options.improveMap != undefined ? options.improveMap : true);
    var container = document.createElement('wz-card');
    var layerContainer = document.createElement('div');
    var title = document.createElement('div');
    var description = document.createElement('div');
    var editContainer = document.createElement('div');
    var remove, visibility, query, edit, externalLink, error, info;
    var loadedTiles = 0;
    var totalTiles = 0;
    var layerRedrawNeeded = false; // flag to set when a layer was made visibile/invisible
    // Deal with layers within map
    var layerKeys = Object.keys(map.layers);
    if (options && options.layers) {
      options.layers.forEach(function(oldLayer) { // Necessary if the map no longer contains certain layers that were still stored
        if (layerKeys.indexOf(oldLayer.name) != -1) {
          self.mapLayers.push(oldLayer);
          // Remove layer from map layers
          layerKeys.splice(layerKeys.indexOf(oldLayer.name), 1);
        }
      });
      // Add any new layers at the end of the checkboxes
      var isBlankLayer = self.mapLayers.length == 0;
      layerKeys.forEach(function(layerKey) {
        self.mapLayers.push({
          name: layerKey,
          visible: isBlankLayer ? (map.default_layers.indexOf(layerKey) != -1) : false // If all layers were removed, add the default layers
        });
      });
    } else { // Nothing found, apply its default layer(s)
      layerKeys.forEach(function(layerKey) {
        self.mapLayers.push({
          name: layerKey,
          visible: (map.default_layers.indexOf(layerKey) != -1)
        });
      });
    }
    var layerToggler = createLayerToggler(omGroup, !this.hidden, map.title, function(visible) {
      if (self.layer) {
        self.layer.setVisibility(visible);
      }
    });

    function updateTileLoader() {
      if (loadedTiles == totalTiles || totalTiles == 0) {
        loadedTiles = 0;
        totalTiles = 0;
        title.style.borderImage = 'none';
      } else {
        var percentage = parseInt(loadedTiles * 100 / totalTiles, 10);
        title.style.borderImage = 'linear-gradient(to right, #4f4, #4f4 ' + percentage + '%, #ddd ' + percentage + '%, #ddd) 100 4 stretch';
      }
    }

    function createIconButton(icon, title, forceTooltip) {
      var button = document.createElement('button');
      button.className = 'fa ' + icon + ' open-maps-icon-button';
      if (title) {
        button.dataset.container = '#sidebar';
        Tooltips.add(button, title, forceTooltip);
      }
      return button;
    }

    this.clearError = function() {
      Tooltips.remove(error);
      error.style.display = 'none';
    };

    this.updateVisibility = function() {
      title.style.color = (self.layer && self.layer.getVisibility() ? '' : '#999');
      description.style.color = (self.layer && self.layer.getVisibility() ? '' : '#999');
      var zoom = W.map.getZoom();
      info.style.display = (self.layer && self.layer.getVisibility() && map.zoomRange && (zoom < map.zoomRange[0] || zoom > map.zoomRange[1]) ? 'inline' : 'none');
      visibility.style.color = (self.outOfArea ? '#999' : '');
      visibility.style.cursor = (self.outOfArea ? 'default' : 'pointer');
    };

    this.updateLayers = function() {
      var visibleLayers = [];
      this.mapLayers.filter(mapLayer => mapLayer.visible).forEach(mapLayer => visibleLayers.push(mapLayer.name));
      if (visibleLayers && visibleLayers.length == 0 && this.layer && map.type == 'WMS') { // Hide map as it has no more layers
        this.layer.setVisibility(false);
      } else if (visibleLayers.length > 0 && !this.layer) { // Add map that received layers
        var params = {
          layers: visibleLayers.join(),
          transparent: self.transparent,
          format: map.format
        };
        var options = {
          transitionEffect: 'resize',
          attribution: map.attribution,
          isBaseLayer: false
        };
        options.projection = new OpenLayers.Projection(map.crs);
        options.tileSize = (map.tile_size ? new OpenLayers.Size(map.tile_size, map.tile_size) : new OpenLayers.Size(512, 512));
        // Support CORS for pixel manipulations
        if (map.pixelManipulations) {
          options.tileOptions = {crossOriginKeyword: 'anonymous'};
        }
        this.layer = new OpenLayers.Layer.WMS(map.title, map.url, params, options);
        this.layer.setOpacity(this.opacity / 100);
        this.layer.setVisibility(!this.hidden && !this.outOfArea);

        if (map.zoomRange) {
          this.layer.events.register('moveend', null, function(obj) {
            if (obj.zoomChanged) {
              var zoom = W.map.getZoom();
              info.style.display = (zoom < map.zoomRange[0] || zoom > map.zoomRange[1] ? 'inline' : 'none');
            }
          });
        }

        this.layer.events.register('tileerror', null, function(obj) {
          if (error.title != '') {
            return;
          }
          error.style.display = 'inline';
          Tooltips.add(error, I18n.t('openmaps.retrieving_error'), true);
          loadTileError(obj.tile, function(msg) {
            if (msg.ok) {
              self.clearError();
            } else {
              Tooltips.remove(error);
              Tooltips.add(error, msg.title + ': ' + msg.description, true);
            }
          });
        });
        this.layer.events.register('tileloadstart', null, function(evt) {
          totalTiles++;
          updateTileLoader();
        });
        this.layer.events.register('tileloaded', null, function(evt) {
          loadedTiles++;
          updateTileLoader();
          if (map.pixelManipulations && self.improveMap) {
            manipulateTile(evt, map.pixelManipulations);
          }
        });
        W.map.addLayer(this.layer);
        var aerialImageryIndex = Math.max.apply(null, W.map.layers.map(layer => layer.project == 'earthengine-legacy' ? W.map.getLayerIndex(layer) : 0));
        W.map.getOLMap().setLayerIndex(this.layer, (aerialImageryIndex >= 0 ? aerialImageryIndex : 0) + handles.length + 1);
        this.layer.events.register('visibilitychanged', null, function() {
          self.updateVisibility();
        });
      } else if (layerRedrawNeeded) { // Update layers if there's a change
        this.layer.mergeNewParams({
          layers: visibleLayers.join()
        });
        layerRedrawNeeded = false;
      }
      saveMapState();
    };

    var buttons = document.createElement('div');
    buttons.className = 'buttons';
    var handleContainer = document.createElement('div');
    handleContainer.innerHTML = '<i class="fa fa-reorder"></i>';
    buttons.appendChild(handleContainer);

    error = createIconButton('fa-exclamation-triangle');
    error.style.color = 'red';
    error.style.display = 'none';
    error.addEventListener('click', this.clearError);
    buttons.appendChild(error);

    info = createIconButton('fa-info-circle', I18n.t('openmaps.layer_out_of_range'), true);
    buttons.appendChild(info);

    if (map.queryable) {
      query = createIconButton('fa-hand-pointer-o', I18n.t('openmaps.query_layer'));
      query.addEventListener('click', function() {
        if (!getFeatureInfoControl.active) {
          this.style.color = 'blue';
          var queryLayers = [];
          self.mapLayers.forEach(function(mapLayer) {
            if (mapLayer.visible && map.layers[mapLayer.name].queryable) {
              queryLayers.push(mapLayer.name);
            }
          });
          getFeatureInfoControl.params = {
            url: map.queryUrl || map.url,
            id: map.id,
            layers: queryLayers.join(),
            callback: function() {
              query.style.color = '';
            }
          };
          getFeatureInfoControl.activate();
        } else {
          this.style.color = '';
          getFeatureInfoControl.deactivate();
        }
      });
      buttons.appendChild(query);
    }

    if (map.getExternalUrl) {
      externalLink = createIconButton('fa-external-link-square', I18n.t('openmaps.external_link_tooltip'));
      externalLink.addEventListener('click', function() {
        window.open(map.getExternalUrl(getMapExtent()), '_blank');
      });
      buttons.appendChild(externalLink);
    }

    visibility = createIconButton((self.hidden ? 'fa-eye-slash' : 'fa-eye'), I18n.t('openmaps.hideshow_layer'));
    visibility.addEventListener('click', function() {
      self.hidden = self.layer.getVisibility();
      self.layer.setVisibility(!self.hidden);
      layerToggler.querySelector('wz-checkbox').checked = !self.hidden;
      saveMapState();
    });
    visibility.addEventListener('mouseenter', function() {
      visibility.classList.toggle('fa-eye', self.hidden);
      visibility.classList.toggle('fa-eye-slash', !self.hidden);
    });
    visibility.addEventListener('mouseleave', function() {
      visibility.classList.toggle('fa-eye', !self.hidden);
      visibility.classList.toggle('fa-eye-slash', self.hidden);
    });
    buttons.appendChild(visibility);

    edit = createIconButton('fa-pencil', I18n.t('openmaps.edit_layer'));
    edit.addEventListener('click', function() {
      editContainer.style.display = (editContainer.style.display == 'none' ? 'block' : 'none');
    });
    buttons.appendChild(edit);

    remove = createIconButton('fa-times', I18n.t('openmaps.remove_layer'));
    remove.addEventListener('click', function(e) {
      if (self.layer != null) {
        W.map.removeLayer(self.layer);
      }
      Tooltips.remove(remove);
      layerToggler.parentNode.removeChild(layerToggler);
      handles.splice(handles.indexOf(self), 1);
      container.parentNode.removeChild(container);
      saveMapState();
      updateMapSelector();
    });
    buttons.appendChild(remove);
    container.appendChild(buttons);

    title.className = 'title';
    title.textContent = map.title;
    title.addEventListener('click', (event) => {
      visibility.dispatchEvent(new MouseEvent('click'));
      visibility.classList.toggle('fa-eye');
      visibility.classList.toggle('fa-eye-slash');
    });
    container.appendChild(title);
    description.className = 'additional-info';
    description.title = I18n.t('openmaps.expand');
    description.addEventListener('click', function() {
      this.title = (this.style.whiteSpace == 'nowrap' || this.style.whiteSpace == '' ? I18n.t('openmaps.collapse') : I18n.t('openmaps.expand'));
      this.style.whiteSpace = (this.style.whiteSpace == 'nowrap' || this.style.whiteSpace == '' ? 'normal' : 'nowrap');
    });
    description.textContent = map.abstract;
    container.appendChild(description);
    editContainer.className = 'edit-panel';
    if (map.format != 'image/jpeg') {
      var transparentCheck = document.createElement('wz-checkbox');
      transparentCheck.addEventListener('click', function() {
        self.transparent = !self.transparent;
        self.layer.mergeNewParams({
          transparent: self.transparent
        });
        saveMapState();
      });
      transparentCheck.checked = self.transparent;
      transparentCheck.textContent = I18n.t('openmaps.transparent_label');
      editContainer.appendChild(transparentCheck);
      Tooltips.add(transparentCheck, I18n.t('openmaps.transparent_label_tooltip'));
    }
    if (map.hasOwnProperty('pixelManipulations')) {
      var improveMapCheck = document.createElement('wz-checkbox');
      improveMapCheck.addEventListener('click', function() {
        self.improveMap = !self.improveMap;
        self.layer.redraw();
        saveMapState();
      });
      if (self.improveMap) {
        improveMapCheck.checked = true;
      }
      improveMapCheck.textContent = I18n.t('openmaps.map_improvement_label');
      editContainer.appendChild(improveMapCheck);
      Tooltips.add(improveMapCheck, I18n.t('openmaps.map_improvement_label_tooltip'));
    }
    var opacityLabel = document.createElement('div');
    opacityLabel.textContent = I18n.t('openmaps.opacity_label') + ':';
    Tooltips.add(opacityLabel, I18n.t('openmaps.opacity_label_tooltip'));
    var opacitySlider = document.createElement('input');
    opacitySlider.className = 'open-maps-opacity-slider';
    opacitySlider.type = 'range';
    opacitySlider.max = 100;
    opacitySlider.min = 5;
    opacitySlider.step = 5;
    opacitySlider.value = this.opacity;
    opacitySlider.addEventListener('input', function() {
      self.layer.setOpacity(Math.max(5, Math.min(100, this.value)) / 100);
      self.opacity = this.value;
      saveMapState();
    });
    opacityLabel.appendChild(opacitySlider);
    editContainer.appendChild(opacityLabel);
    if (self.mapLayers.length > 1) {
      var mapLayersTitle = document.createElement('p');
      mapLayersTitle.textContent = I18n.t('openmaps.map_layers_title') + ':';
      editContainer.appendChild(mapLayersTitle);
      layerContainer.className = 'openmaps-map-list';
      self.mapLayers.forEach(function(layerItem) {
        var mapLayer = map.layers[layerItem.name];
        var item = document.createElement('wz-card');
        item.className = 'result maps-menu-item list-item-card';
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        var layerHandleIcon = document.createElement('div');
        layerHandleIcon.innerHTML = '<i class="fa fa-reorder"></i>';
        buttonContainer.appendChild(layerHandleIcon);
        var layerTitle = document.createElement('p');
        var layerDescription = document.createElement('div');
        if (mapLayer.queryable) {
          var layerQuery = document.createElement('span');
          layerQuery = createIconButton('fa-hand-pointer-o');
          layerQuery.addEventListener('click', function() {
            this.style.color = 'blue';
            getFeatureInfoControl.params = {
              url: map.url,
              id: map.id,
              layers: layerItem.name,
              callback: function() {
                layerQuery.style.color = '';
              }
            };
            getFeatureInfoControl.activate();
          });
          buttonContainer.appendChild(layerQuery);
        }
        var visibility = document.createElement('span');
        visibility = createIconButton((layerItem.visible ? 'fa-eye' : 'fa-eye-slash'), I18n.t('openmaps.hideshow_layer'));
        visibility.addEventListener('mouseenter', function() {
          visibility.classList.toggle('fa-eye', !layerItem.visible);
          visibility.classList.toggle('fa-eye-slash', layerItem.visible);
        });
        visibility.addEventListener('mouseleave', function() {
          visibility.classList.toggle('fa-eye', layerItem.visible);
          visibility.classList.toggle('fa-eye-slash', !layerItem.visible);
        });
        visibility.addEventListener('click', function() {
          layerItem.visible = !layerItem.visible;
          layerTitle.style.color = (layerItem.visible ? '' : '#999');
          layerDescription.style.color = (layerItem.visible ? '' : '#999');
          layerRedrawNeeded = true;
          self.updateLayers(self);
        });
        buttonContainer.appendChild(visibility);
        item.appendChild(buttonContainer);
        layerTitle.className = 'title';
        layerTitle.style.cursor = 'default';
        layerTitle.style.color = (layerItem.visible ? '' : '#999');
        layerTitle.textContent = mapLayer.title;
        layerTitle.addEventListener('click', (event) => {
          visibility.dispatchEvent(new MouseEvent('click'));
          visibility.classList.toggle('fa-eye');
          visibility.classList.toggle('fa-eye-slash');
        });
        item.appendChild(layerTitle);
        if (mapLayer.abstract) {
          layerDescription.className = 'additional-info';
          layerDescription.title = I18n.t('openmaps.expand');
          layerDescription.style.color = (layerItem.visible ? '' : '#999');
          layerDescription.addEventListener('click', function() {
            this.title = (this.style.whiteSpace == 'nowrap' ? I18n.t('openmaps.collapse') : I18n.t('openmaps.expand'));
            this.style.whiteSpace = (this.style.whiteSpace == 'nowrap' || this.style.whiteSpace == '' ? 'normal' : 'nowrap');
          });
          layerDescription.textContent = mapLayer.abstract;
          item.appendChild(layerDescription);
        }
        layerContainer.appendChild(item);
      });
      editContainer.appendChild(layerContainer);
    }
    editContainer.style.display = 'none';
    container.appendChild(editContainer);
    container.className = 'result maps-menu-item list-item-card';
    handleList.appendChild(container);
    sortable(handleList); // refresh HTML5Sortable
    sortable(layerContainer, {
      forcePlaceholderSize: true,
      placeholderClass: 'result',
      handle: '.fa-reorder'
    })[0].addEventListener('sortupdate', function(e) {
      if (e.detail.elementIndex < 0 || e.detail.elementIndex >= self.mapLayers.length || e.detail.oldElementIndex < 0 || e.detail.oldElementIndex >= self.mapLayers.length) { // Sanity check
        log('Received an invalid element index when reordering map layers. Old index: ' + e.detail.oldElementIndex + ', new index: ' + e.detail.elementIndex);
        return;
      }
      self.mapLayers.splice(e.detail.elementIndex, 0, self.mapLayers.splice(e.detail.oldElementIndex, 1)[0]);
      layerRedrawNeeded = self.mapLayers[e.detail.elementIndex].visible; // Only redraw if it was a visible layer
      self.updateLayers(self);
    });

    this.updateLayers();
    this.updateVisibility();
  }
  //#endregion

  //#region Add style
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.textContent = `
#sidepanel-openMaps h4 {
  margin-bottom: 5px;
}

#sidepanel-openMaps .openmaps-map-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#sidepanel-openMaps select {
  background-color: var(--background_variant, #f2f4f7);
  height: 40px;
  margin-top: 1em;
}

.open-maps-query-window {
  display: none;
  top: 40px;
  left: 100px;
  right: 60px;
  max-height: calc(100% - 80px);
  overflow-y: auto;
  background-color: #fff;
  border: 2px solid #ddd;
  padding: 5px;
  color: #000;
  cursor: auto;
  z-index: 10000;
  position: absolute;
}

.open-maps-query-window .hidden {
  display: none;
}

.open-maps-query-window-button-left, .open-maps-query-window-button-right {
  cursor: pointer;
}
.open-maps-query-window-button-left {
  float: left;
}
.open-maps-query-window-button-right {
  float: right;
}

.open-maps-query-window h2 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.open-maps-query-window table td {
  user-select: text;
}

.open-maps-maximum-layers {
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
}

.open-maps-maximum-layers h3 {
  margin-bottom: 15px;
  font-size: 13px;
  font-weight: 700;
}

.open-maps-icon-button {
  border: none;
  background: none;
  padding: 4px;
  font-size: 14px;
  cursor: pointer;
  height: auto;
  outline: none;
}

.open-maps-icon-button.fa-info-circle {
  color: #337ab7;
  cursor: help;
  display: none;
}

#sidepanel-openMaps .fa-reorder {
  cursor: move;
  font-size: 20px;
}

input.open-maps-opacity-slider {
  vertical-align: middle;
  display: inline;
  margin-left: 8px;
  width: 100px;
}

#sidepanel-openMaps .additional-info {
  font-style: italic;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;

}

#sidepanel-openMaps .maps-menu-item {
  cursor: default;
}

#sidepanel-openMaps .maps-menu-item > .buttons {
  display: flex;
}

#sidepanel-openMaps .maps-menu-item > .buttons > div:first-child {
  flex-grow: 1;
}

#sidepanel-openMaps .maps-menu-item > div.edit-panel {
  border-radius: 8px;
  margin-top: 2px;
  padding: 8px;
  width: 100%;
  background-color: #eee;
  font-size: 14px;
}

#sidepanel-openMaps .maps-menu-item > div.edit-panel > p {
  font-weight: bold;
  padding-left: 0px;
  margin: 10px;
}

#sidepanel-openMaps .maps-menu-item .edit-panel .openmaps-map-list {
  overflow-y: scroll;
  max-height: 25vh;
}

#sidepanel-openMaps .maps-menu-item .edit-panel .openmaps-map-list .result {
  --wz-card-padding: 6px;
  padding-right: 2px;
}

#sidepanel-openMaps .title {
  cursor: default;
  border-width: 2px 0 0 0;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 14px;
}
`;
  }
  if (!styleElement.parentNode) {
    document.head.appendChild(styleElement);
  }
  //#endregion
}

function log(message) {
  if (typeof message === 'string') {
    console.log('%cWME Open Maps: %c' + message, 'color:black', 'color:#d97e00');
  } else {
    console.log('%cWME Open Maps:', 'color:black', message);
  }
}

function onWmeInitialized() {
  if (W.userscripts?.state?.isReady) {
    log('W is ready and in "wme-ready" state. Proceeding with initialization.');
    onWmeReady();
  } else {
    log('W is ready, but not in "wme-ready" state. Adding event listener.');
    document.addEventListener('wme-ready', onWmeReady, { once: true });
  }
}

function bootstrap() {
  if (!W) {
    log('W is not available. Adding event listener.');
    document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
  } else {
    onWmeInitialized();
  }
}

bootstrap();
