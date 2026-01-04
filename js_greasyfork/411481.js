// ==UserScript==
// @name         Sprimont points
// @namespace    https://www.tomputtemans.com/
// @version      0.1
// @description  Show markers on the map
// @author       Tom 'Glodenox' Puttemans
// @include        /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411481/Sprimont%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/411481/Sprimont%20points.meta.js
// ==/UserScript==

var data = `{
"type": "FeatureCollection",
"name": "BEWAPP2020-projected",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::900913" } },
"features": [
{ "type": "Feature", "properties": { "Localisation": "Rue de Rivage " }, "geometry": { "type": "Point", "coordinates": [ 621775.98151, 6530782.1475 ] } },
{ "type": "Feature", "properties": { "Localisation": "Rue de Fraiture 92" }, "geometry": { "type": "Point", "coordinates": [ 623453.076, 6530593.94713 ] } },
{ "type": "Feature", "properties": { "Localisation": "Carrefour Rue de Pierreuxchamp et Rue de Fraiture et rue de l'Entente  " }, "geometry": { "type": "Point", "coordinates": [ 623987.51865, 6531223.7251 ] } },
{ "type": "Feature", "properties": { "Localisation": "Rue de Fraiture " }, "geometry": { "type": "Point", "coordinates": [ 624926.21304, 6531486.8861 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la Rue de Presseux 2" }, "geometry": { "type": "Point", "coordinates": [ 626472.0914, 6532562.24219 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la Rue des Comines 3" }, "geometry": { "type": "Point", "coordinates": [ 628205.33571, 6531624.50877 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la Rue du Hollu 22" }, "geometry": { "type": "Point", "coordinates": [ 628855.30088, 6530950.13181 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la Rue du Houmier 24" }, "geometry": { "type": "Point", "coordinates": [ 629280.76535, 6531721.62472 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour Rue de l'Eglise et Cour Gillard " }, "geometry": { "type": "Point", "coordinates": [ 630835.04611, 6531356.59636 ] } },
{ "type": "Feature", "properties": { "Localisation": "Rue Vieille Chera 9" }, "geometry": { "type": "Point", "coordinates": [ 631120.5502, 6531100.00975 ] } },
{ "type": "Feature", "properties": { "Localisation": "Carrefour de la rue des Tilleuls et de la Rue du Tige " }, "geometry": { "type": "Point", "coordinates": [ 631665.75265, 6532828.82642 ] } },
{ "type": "Feature", "properties": { "Localisation": "Carrefour de la Rue de Foccroulle et de la rue du Tige " }, "geometry": { "type": "Point", "coordinates": [ 629897.41465, 6532635.29567 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du parking situ‚ rue des Broux " }, "geometry": { "type": "Point", "coordinates": [ 630913.73233, 6533707.54023 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue Ferrer et la rue du Centre " }, "geometry": { "type": "Point", "coordinates": [ 630392.76701, 6533711.94611 ] } },
{ "type": "Feature", "properties": { "Localisation": "Parc de l'administation communale " }, "geometry": { "type": "Point", "coordinates": [ 630322.33721, 6534336.4151 ] } },
{ "type": "Feature", "properties": { "Localisation": "en face du 28 rue Joseph Potier " }, "geometry": { "type": "Point", "coordinates": [ 630580.86225, 6534374.26358 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 14 Rue de Hotchamps " }, "geometry": { "type": "Point", "coordinates": [ 635644.11646, 6533585.50817 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue de Cornemont et la Rue Haute Folie " }, "geometry": { "type": "Point", "coordinates": [ 635055.50969, 6535516.93569 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité rue de la l‚gende 16" }, "geometry": { "type": "Point", "coordinates": [ 635273.04336, 6536606.81472 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la Rue d'Adzeux et l'all‚e des cerfs " }, "geometry": { "type": "Point", "coordinates": [ 638412.29211, 6536528.87723 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue d'Adzeux 74" }, "geometry": { "type": "Point", "coordinates": [ 638213.66994, 6536929.97658 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité des bulles rue Jean Paul II " }, "geometry": { "type": "Point", "coordinates": [ 639575.20683, 6540001.72421 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de l'église place du village " }, "geometry": { "type": "Point", "coordinates": [ 638907.22876, 6540559.90823 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour rue du Doyard " }, "geometry": { "type": "Point", "coordinates": [ 637103.51537, 6540690.52349 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue du Doyard et la rue d'Andoumont " }, "geometry": { "type": "Point", "coordinates": [ 636441.272, 6541377.20247 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue d'Andoumont 104" }, "geometry": { "type": "Point", "coordinates": [ 635373.51808, 6541621.48306 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la Salle le Tilleul rue d'Andoumont " }, "geometry": { "type": "Point", "coordinates": [ 633660.12022, 6541147.98139 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue de la Drève 30" }, "geometry": { "type": "Point", "coordinates": [ 631719.0298, 6540516.50313 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue Cochetay (au niveau du croisement de l'autoroute)" }, "geometry": { "type": "Point", "coordinates": [ 630519.77079, 6540760.17021 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue d'Aywaille 40" }, "geometry": { "type": "Point", "coordinates": [ 628871.80366, 6541637.31057 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour entre l'allée des Bouleaux et la rue Gros Confins " }, "geometry": { "type": "Point", "coordinates": [ 630190.26277, 6539765.34183 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue Piretfontaine et le route de Hayen " }, "geometry": { "type": "Point", "coordinates": [ 628322.52419, 6540202.48645 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 9 route de Hayen " }, "geometry": { "type": "Point", "coordinates": [ 625879.89243, 6540836.41062 ] } },
{ "type": "Feature", "properties": { "Localisation": "en face du 2 hayen " }, "geometry": { "type": "Point", "coordinates": [ 624832.43714, 6540943.86416 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 34 Betgné " }, "geometry": { "type": "Point", "coordinates": [ 624232.65879, 6538027.75778 ] } },
{ "type": "Feature", "properties": { "Localisation": "sur le parking de la rue Rodolphe Bernard en face du nø38" }, "geometry": { "type": "Point", "coordinates": [ 622992.89352, 6533605.12848 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue du Fays et la rue de l'Epargne " }, "geometry": { "type": "Point", "coordinates": [ 626090.12286, 6535517.29642 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue de la Préalle et de la rue Henri Simon " }, "geometry": { "type": "Point", "coordinates": [ 626792.48286, 6535280.2703 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 11 rue de l'Enseignement " }, "geometry": { "type": "Point", "coordinates": [ 626841.27959, 6535565.90501 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue houreuse et le rue de m‚ry " }, "geometry": { "type": "Point", "coordinates": [ 626841.27959, 6535565.90501 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 15 rue jean doinet " }, "geometry": { "type": "Point", "coordinates": [ 626037.12429, 6539635.24647 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue de wachiboux et la rue de la pˆcherie " }, "geometry": { "type": "Point", "coordinates": [ 627700.4153, 6539052.05566 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue bawepuce et la rue de chanxhe " }, "geometry": { "type": "Point", "coordinates": [ 628877.67472, 6534410.78188 ] } },
{ "type": "Feature", "properties": { "Localisation": "en face de la rue pionfosse 1" }, "geometry": { "type": "Point", "coordinates": [ 626735.44836, 6536175.30367 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de chez Hubo - rue de beaufays " }, "geometry": { "type": "Point", "coordinates": [ 629786.78022, 6537778.05801 ] } },
{ "type": "Feature", "properties": { "Localisation": "au carrefour de la rue des Fosses et la rue du Brouckay" }, "geometry": { "type": "Point", "coordinates": [ 629459.76427, 6536846.25737 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 2 Rue Lileutige " }, "geometry": { "type": "Point", "coordinates": [ 629319.46856, 6536267.80787 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 41 rue vieille voie de liŠge " }, "geometry": { "type": "Point", "coordinates": [ 629817.6142, 6535571.26609 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité de la rue de la fagne 27" }, "geometry": { "type": "Point", "coordinates": [ 630334.46702, 6537180.82877 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue de sendrogne et rue du bois de gomz‚" }, "geometry": { "type": "Point", "coordinates": [ 630390.56166, 6536888.63027 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du camping du Tultay " }, "geometry": { "type": "Point", "coordinates": [ 630481.89019, 6535225.98103 ] } },
{ "type": "Feature", "properties": { "Localisation": "rue de coreux  proximité du 5 rue du tultay " }, "geometry": { "type": "Point", "coordinates": [ 631117.05007, 6535253.04707 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 52 rue de néronry " }, "geometry": { "type": "Point", "coordinates": [ 631043.78354, 6536439.77509 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue de sendrogne et rue de la chera " }, "geometry": { "type": "Point", "coordinates": [ 632956.30481, 6537484.32863 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du chƒteau de blindef (arret de bus place de blindef) " }, "geometry": { "type": "Point", "coordinates": [ 634006.88971, 6537710.68281 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue ferreuse(petit chemin) et la rue de stinval " }, "geometry": { "type": "Point", "coordinates": [ 633453.42869, 6538767.59333 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 42 rue de liège " }, "geometry": { "type": "Point", "coordinates": [ 634891.08839, 6539598.44509 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue des montys et la rue du pérréon" }, "geometry": { "type": "Point", "coordinates": [ 635246.07718, 6538902.29772 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 54 rue de la Gendarmerie" }, "geometry": { "type": "Point", "coordinates": [ 635424.07157, 6537580.2264 ] } },
{ "type": "Feature", "properties": { "Localisation": "au croisement de la rue du Pérréon et la place du Tilleul " }, "geometry": { "type": "Point", "coordinates": [ 636129.68226, 6538670.78245 ] } },
{ "type": "Feature", "properties": { "Localisation": " proximité du 27 rue troleu " }, "geometry": { "type": "Point", "coordinates": [ 636282.42598, 6538115.09089 ] } }
]
}`;

var pointStyle = new OpenLayers.Style({
  pointRadius: 10,
  fillColor: "#ffcc66",
  strokeColor: "#ff9933",
  strokeWidth: 2,
  title: "${Localisation}"
});

function init(e) {
  console.log('Sprimont data');
  if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof W.prefs === 'undefined' || typeof W.app.modeController === 'undefined') {
    setTimeout(init, 300);
    return;
  }
  if (typeof OpenLayers === 'undefined') {
    setTimeout(init, 300);
    return;
  }
  if (typeof W.loginManager === 'undefined') {
    setTimeout(init, 300);
    return;
  }

  console.log('Starting to add Sprimont data layer');
  var geojsonFormat = new OpenLayers.Format.GeoJSON();
  var features = geojsonFormat.read(data);

  var layer = new OpenLayers.Layer.Vector("Sprimont data", {
    styleMap: new OpenLayers.StyleMap(pointStyle)
  });
  layer.addFeatures(features);
  W.map.addLayer(layer);
  console.log('Sprimont data', layer);
}

init();