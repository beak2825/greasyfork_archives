// ==UserScript==
// @version      1.0
// @author       https://github.com/bababoyy
// @license      GPLv3
// ==/UserScript==
importScripts("https://greasyfork.org/scripts/465119-mxo-new-bot-librarys-depencens-image-converter-dither/code/Mxo%20New%20Bot%20LibrarysDepencens%20-%20Image%20Converter%3EDither.js");
const Colors = [
  { code: "0", rgb: [255, 255, 255] },
  { code: "1", rgb: [196, 196, 196] },
  { code: "2", rgb: [136, 136, 136] },
  { code: "3", rgb: [85, 85, 85] },
  { code: "4", rgb: [34, 34, 34] },
  { code: "5", rgb: [0, 0, 0] },
  { code: "6", rgb: [0, 102, 0] },
  { code: "7", rgb: [34, 177, 76] },
  { code: "8", rgb: [2, 190, 1] },
  { code: "10", rgb: [148, 224, 68] },
  { code: "11", rgb: [251, 255, 91] },
  { code: "12", rgb: [229, 217, 0] },
  { code: "13", rgb: [230, 190, 12] },
  { code: "14", rgb: [229, 149, 0] },
  { code: "15", rgb: [160, 106, 66] },
  { code: "16", rgb: [153, 83, 13] },
  { code: "17", rgb: [99, 60, 31] },
  { code: "18", rgb: [107, 0, 0] },
  { code: "19", rgb: [159, 0, 0] },
  { code: "20", rgb: [229, 0, 0] },
  { code: "22", rgb: [187, 79, 0] },
  { code: "23", rgb: [255, 117, 95] },
  { code: "24", rgb: [255, 196, 159] },
  { code: "25", rgb: [255, 223, 204] },
  { code: "26", rgb: [255, 167, 209] },
  { code: "27", rgb: [207, 110, 228] },
  { code: "28", rgb: [236, 8, 236] },
  { code: "29", rgb: [130, 0, 128] },
  { code: "31", rgb: [2, 7, 99] },
  { code: "32", rgb: [0, 0, 234] },
  { code: "33", rgb: [4, 75, 255] },
  { code: "34", rgb: [101, 131, 207] },
  { code: "35", rgb: [54, 186, 255] },
  { code: "36", rgb: [0, 131, 199] },
  { code: "37", rgb: [0, 211, 221] },
];
function generatePixif(img, width) {
  let output = "";
  for (let i = 0; i < img.length; i += 4) {
    if ((i / 4) % width === 0 && i != 0) {
      output += "\\n";
    }
    /**
     * @type {RGB}
     */
    const colorInfo = {
      r: img[i],
      g: img[i + 1],
      b: img[i + 2],
    };
    /**
     * @type {number}
     */
    let color;
    // #MXOB0 's red value is 186
    if (colorInfo.r == 186) {
      color = 64;
    }
    for (let pixelColor of Colors) {
      if (
        pixelColor.rgb[0] == colorInfo.r &&
        pixelColor.rgb[1] == colorInfo.g &&
        pixelColor.rgb[2] == colorInfo.b
      ) {
        color = pixelColor.code;
      }
    }
    if (color == undefined) {
      color = 64;
    }
    output += String.fromCharCode("0".charCodeAt(0) + parseInt(color));
  }
  return output.split("\\n");
}
function lookThroughTransparentPixel(pixels) {
  var transparent_index = [];
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] == 186 && pixels[i + 1] == 186 && pixels[i + 2] == 176) {
      transparent_index.push(i);
    }
  }
  return transparent_index;
}
onmessage = function (i) {
  var q = new RgbQuant({
    colors: 40,
    palette: Colors.map((x) => x.rgb),
    reIndex: true,
    dithKern: i.data.kernel,
    dithDelta: 0.05,
    useCache: false,
  });

  console.log(i);
  var transparent_index = lookThroughTransparentPixel(i.data.img.data);
  console.time("Image load");
  q.sample(i.data.img.data);
  console.timeLog("Image load");
  var r = q.reduce(i.data.img.data);
  console.timeLog("Image load");
  for (let index of transparent_index) {
    r[index] = 186;
    r[index + 1] = 186;
    r[index + 2] = 176;
  }
  var pixif = generatePixif(r, i.data.img.width);
  console.timeEnd("Image load");
  postMessage([r, pixif]);
};