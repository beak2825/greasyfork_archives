// ==UserScript==
// @name         Export-IOS-Information
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script could export table data to multiple map, by default, it will export iPhone data
// @author       BeiKeJieDeLiuLangMao
// @match        https://www.theiphonewiki.com/wiki/Models
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdn.jsdelivr.net/npm/table-to-json@0.13.0/lib/jquery.tabletojson.min.js
// @require https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/386673/Export-IOS-Information.user.js
// @updateURL https://update.greasyfork.org/scripts/386673/Export-IOS-Information.meta.js
// ==/UserScript==
(function() {
    'use strict';
     let tables = $('.wikitable')
     // Table9 is iPhone table
     var table = $(tables[9]).tableToJSON()
     let map = {}
     let modelMap = {}
     let identifierMap = {}
     for (let index in table) {
         let Generation = table[index].Generation
         let Identifier = table[index].Identifier
         let Finish = table[index].Finish
         let Storage = table[index].Storage
         let Model = table[index].Model.replace(/ /g,'').replace(/\[\d\]/g,'').split(',')
         if (!map.hasOwnProperty(Generation)) {
             map[Generation] = {}
         }
         if (!map[Generation].hasOwnProperty(Identifier)) {
             map[Generation][Identifier] = {}
         }
         if (!map[Generation][Identifier].hasOwnProperty(Finish)) {
             map[Generation][Identifier][Finish] = {}
         }
         if (!map[Generation][Identifier][Finish].hasOwnProperty(Storage)) {
             map[Generation][Identifier][Finish][Storage] = Model
         }
         for (let i in Model) {
             if (Model[i] !== '?') {
                 modelMap[Model[i]] = {
                      color: Finish,
                     storage: Storage,
                     identifier: Identifier,
                     generation: Generation
                 }
             }
         }
         identifierMap[Identifier] = Generation
     }
     let infoMap = {}
     axios.get('https://www.theiphonewiki.com/wiki/List_of_iPhones')
         .then(function(responseList) {
             for (let key in map) {
                 let phone = key.replace(/ /g,'_')
                 let infoUl
                 if (infoMap[key] === undefined) {
                     infoMap[key] = {}
                 }
                 infoUl = $(responseList.data).find('#' + phone).parent().next().next()
                 if(infoUl.prop("tagName") !== 'UL') {
                     infoUl = infoUl.next()
                 }
                 if(infoUl.prop("tagName") !== 'UL') {
                     infoUl = infoUl.next()
                 }
                 // console.log(phone, infoUl, $(infoUl.children()[0]).children().children()[0].innerText)
                 infoMap[key].batteryCapacity = $(infoUl.children()[0]).children().children()[0].innerText.split(':')[1].trim() + 'h'
                 if (key == 'iPhone 3G') {
                     infoMap[key].batteryVoltage = $(infoUl.children()[0]).children().children()[1].innerText.split(':')[1].trim()
                 } else {
                     infoMap[key].batteryVoltage = $(infoUl.children()[0]).children().children()[2].innerText.split(':')[1].trim()
                 }
                 infoMap[key].cpuHardware = $(infoUl.children()[5]).children().children()[0].innerText.split(':')[1].trim()
                 infoMap[key].cpuVersion = $(infoUl.children()[5]).children().children()[1].innerText.split(':')[1].trim()
                 infoMap[key].cpuFrequency = $(infoUl.children()[5]).children().children()[2].innerText.split(':')[1].trim()
                 if (infoMap[key].cpuFrequency === '? GHz' && infoMap[key].cpuVersion.indexOf('A12 Bionic') !== -1) {
                     infoMap[key].cpuFrequency = '2.49 GHz'
                 }
                 if (key === 'iPhone') {
                    infoMap[key].cpuFrequency = '400 MHz'
                 }
                 if (phone === 'iPhone_3G') {
                     phone = 'N82AP'
                 }
                 if (phone === 'iPhone_3GS') {
                     phone = 'N88AP'
                 }
                 if (phone === 'iPhone_4') {
                     phone = 'N90AP'
                     infoMap[key].ram = '512 MB'
                 }
                 if (phone === 'iPhone_4S') {
                     phone = 'N94AP'
                 }
                 if (phone === 'iPhone_6') {
                     phone = 'N61AP'
                 }
                 if (phone === 'iPhone_6_Plus') {
                     phone = 'N56AP'
                 }
                 if (phone === 'iPhone_XR') {
                     phone = 'N841AP'
                 }
                 if (phone === 'iPhone_XS') {
                     phone = 'D321AP'
                 }
                 axios.get('https://www.theiphonewiki.com/wiki/' + phone)
                     .then((response) => {
                     // handle success
                     let dataList = $(response.data).find('#Specifications').parent().next().children()
                     for (let index in dataList) {
                         let dataLine = dataList[index].innerText
                         if (dataLine !== undefined) {
                             let dataPart = dataLine.split(': ')
                             if (dataPart[0] === 'RAM') {
                                 infoMap[key].ram = dataPart[1].split(' ')[0] + ' ' + dataPart[1].split(' ')[1]
                             }
                             if (dataPart[0] === 'Size') {
                                 // console.log(dataPart[1],)
                                 let heightIndex = dataPart[1].indexOf('in')
                                 let sizeY = dataPart[1].substring(heightIndex - 5, heightIndex).trim()
                                 let widthIndex = dataPart[1].indexOf('in', heightIndex + 2)
                                 let sizeX = dataPart[1].substring(widthIndex - 5, widthIndex).trim()
                                 // console.log(widthIndex, heightIndex)
                                 infoMap[key].size = Math.sqrt(sizeY * sizeY + sizeX * sizeX).toFixed(2)
                                 // console.log(sizeX, sizeY, Math.sqrt(sizeY * sizeY + sizeX * sizeX).toFixed(2))
                                 if (infoMap[key].resolution !== undefined) {
                                     infoMap[key].xdpi = (infoMap[key].resolution.width / sizeX).toFixed(2)
                                     infoMap[key].ydpi = (infoMap[key].resolution.height / sizeY).toFixed(2)
                                 }
                             }
                             if (dataPart[0] === 'Display') {
                                 infoMap[key].resolution = {
                                     width: dataPart[1].split(' ')[1].split('x')[1],
                                     height: dataPart[1].split(' ')[1].split('x')[0],
                                 }
                                 let ppiIndex = dataPart[1].indexOf('ppi')
                                 infoMap[key].density = dataPart[1].substring(ppiIndex - 4, ppiIndex).trim()
                             }
                             // console.log(dataPart[0], dataPart[1])
                         }
                     }
                     //  iPhone_XS_Max is last one
                     if (phone === 'iPhone_XS_Max') {
                         console.log(JSON.stringify(infoMap))
                     }
                 })
             }
         })
     console.log(JSON.stringify(map))
     console.log(JSON.stringify(modelMap))
     console.log(JSON.stringify(identifierMap))
    // Your code here...
})();