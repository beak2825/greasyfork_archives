// ==UserScript==
// @name        Better pornolab.net search - search by size, descending
// @namespace   Violentmonkey Scripts
// @match       *://pornolab.net/forum/*
// @grant       none
// @version     2.0.3
// @author      -
// @description Improve pornolab.net search and quick search forms so they always default to searching by size in descending order; use better window titles; remove search_id issues; use GET URLs for search results. 2022-05-31 01:30:06
// @run-at document-idle
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/405750/Better%20pornolabnet%20search%20-%20search%20by%20size%2C%20descending.user.js
// @updateURL https://update.greasyfork.org/scripts/405750/Better%20pornolabnet%20search%20-%20search%20by%20size%2C%20descending.meta.js
// ==/UserScript==

// URL-decode the Windows-1251 codepage because apparently browsers are too idiotic to use the right encoding
// Don't ask me how this works, I got it from here:
// https://stackoverflow.com/a/69769015/389169
var URLDecodeWindows1251 = function (str) {
  var win1251 = new TextDecoder("windows-1251")
  return str.replace(/(?:%[0-9A-F]{2})+/g, s => win1251.decode(new Uint8Array(s.replace(/%/g, ",0x").slice(1).split(","))))
}
window.URLDecodeWindows1251 = URLDecodeWindows1251

// URL-encode to the Windows-1251 codepage
const UTF8ToWin1251Map = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190}

var URLEncodeWindows1251 = function(str) {
  var letters = []
  for (var i=0; i < str.length; i++) {
    var char = str.charAt(i)

    // Don't encode digits or latin characters.
    // encodeURIComponent gives us the wrong result for things that do need encoding,
    // but we're just using it to find out which things do not need encoding.
    if (char == encodeURIComponent(char)) {
      letters.push(char)
      continue
    }

    var ord = str.charCodeAt(i)
    if (!(ord in UTF8ToWin1251Map)) {
      throw "Character not supported by win1251: " + char
    }
    var charHex1251 = UTF8ToWin1251Map[ord].toString(16) // 16 is the radix when converting the integer to the string
    var encoded = ('%' + charHex1251).toUpperCase()
    letters.push(encoded)
  }
  return letters.join('')
}
window.URLEncodeWindows1251 = URLEncodeWindows1251

// Update a query parameter in a url, or insert it if it's not there already.
// If del is true, delete the parameter.
var updateParam = function(url, key, value, del, URLEncoder) {
  if(key.length == 0) {
    // we can't deal with zero-length keys
    return url
  }
  
  if (URLEncoder === undefined) {
    URLEncoder = encodeURIComponent
  }
  
  key = URLEncoder(key)
  value = URLEncoder(value)

  const urlAndQuery = url.split('?')
  paramFound = false
  paramsNew = []
  if (urlAndQuery.length > 1) {
    // there was a query string (there was a '?' character)
    var params = urlAndQuery[1].split('&') // params looks like ['key1=value1', 'key2=value2', ...]
    let i = 0

    for (; i < params.length; i++) {
      if ((params[i] == "key") && (del == true)) { // for parameters that don't contain a '=' character, which is possible
        continue // do not copy this one over
      }
      
      if (params[i].startsWith(key + '=')) {
        if (del == true) {
          continue // do not copy this one over
        }
        let kv = params[i].split('=') // split "key=value" into ["key", "value"]
        kv[1] = value
        paramsNew.push(kv.join('='))
        paramFound = true
        continue
      }
      
      paramsNew.push(params[i]) // by default, copy everything over
    }
  }

  if ((paramFound == false) && (del !== true)) {
    paramsNew.push([key, value].join('='))
  }

  let newQuery = paramsNew.join('&')
  var newUri = urlAndQuery[0]
  if (newQuery.length > 0) { // there were query parameters, you're free to add a '?' character, so we won't get a dangling '?' at the end
    newUri = [urlAndQuery[0], newQuery].join('?')
  }
  return newUri
}
window.updateParam = updateParam // make available from console

$("form#quick-search").ready(function () {
  // improvements to quick search form
  $("form#quick-search").append("<input type='hidden' name='o' value='7' />") // sort by size
  $("form#quick-search").append("<input type='hidden' name='s' value='2' />") // sort descending
  $("form#quick-search input[name='max']").remove() // prevents sorting of results
  $("form#quick-search input[name='to']").remove() // no idea what it is, we don't need it
  $("form#quick-search").attr("action", "tracker.php") // erm no idea how this even worked without that
  $("form#quick-search").attr("method", "get")
})

$("div#search_opt").ready(function () {
  // we are on the search page
  
  $("div#search_opt select#o").val(7) // sort by size when searching from main search form
  $("form#tr-form").attr("method", "get") // use get params, so the search can be remembered between browser restarts
  

  const params = new URLSearchParams(URLDecodeWindows1251(window.location.search))
  
  // set title
  searchTerms = params.get("nm")
  if (searchTerms !== null) {
    document.title = searchTerms + " - PornoLab.Net Search"
  }
  
  // fix pagination so it has all the right parameters and doesn't include search_id
  $("div.nav a.pg").each(function(idx, elm) {
    var href = elm.getAttribute("href")
    
    // add all the missing query parameters
    params.forEach(function (val, key) {
      if(key == "start") {
        return // we want to take pagination info from the pagination url, not from the current url
      }
      if(key == "search_id") {
        return // we don't want to add a search_id
      }
      
      href = updateParam(href, key, val, false, URLEncodeWindows1251)
    })
    
    // Remove search session param, that shit sucks. If you reload a URL with search_id in it after
    // that search_id has expired, you won't get the search results, you will only get an error message.
    href = updateParam(href, "search_id", "", true)
    
    elm.setAttribute("href", href)
  })
  
})












