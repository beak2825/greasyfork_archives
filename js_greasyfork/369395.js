// ==UserScript==
// @name         SUMo direct update
// @namespace    graphen
// @version      1.0.16
// @description  Redirects from SUMo update pages directly to the download
// @author       graphen
// @match        https://www.kcsoftwares.com/sumo/view.php?uid=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369395/SUMo%20direct%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/369395/SUMo%20direct%20update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentSoftware = window.location.href.split("&",3);
    var softwareList = [
        ["ProductName=SUMo&Company=KC%20Softwares", "https://kcsoftwares.com/files/sumo_lite.exe"],
        ["ProductName=CCleaner (64 bits)&Company=Piriform Ltd", "https://www.ccleaner.com/ccleaner/download/standard"],
        ["ProductName=CCleaner&Company=Piriform Ltd", "https://www.ccleaner.com/ccleaner/download/standard"],
        ["ProductName=Speccy (64 bits)&Company=Piriform Ltd", "https://www.ccleaner.com/speccy/download/standard"],
        ["ProductName=TreeSize Free&Company=JAM Software", "https://www.jam-software.de/treesize_free/TreeSizeFreeSetup.exe"],
        ["ProductName=Mp3tag&Company=Florian Heidenreich", "https://www.mp3tag.de/dodownload.html"],
        ["ProductName=MyPhoneExplorer&Company=F.J. Wechselberger", "https://www.fjsoft.at/download.php?id=1"],
        ["ProductName=CrystalDiskMark&Company=Crystal Dew World", "https://crystalmark.info/redirect.php?product=CrystalDiskMarkInstaller"],
        ["ProductName=LibreOffice&Company=The Document Foundation", "https://de.libreoffice.org/download/libreoffice-fresh/"],
        ["ProductName=LibreOffice (64 bits)&Company=The Document Foundation", "https://de.libreoffice.org/download/libreoffice-fresh/"],
        ["ProductName=FreeFileSync&Company=FreeFileSync", "https://freefilesync.org/download.php"],
        ["ProductName=calibre (64 bits)&Company=calibre-ebook.com", "https://calibre-ebook.com/dist/win64"],
        ["ProductName=CrystalDiskInfo&Company=Crystal Dew World", "https://crystalmark.info/redirect.php?product=CrystalDiskInfo"],
        ["ProductName=CrystalDiskInfo (64 bits)&Company=Crystal Dew World", "https://crystalmark.info/redirect.php?product=CrystalDiskInfo"]
        ];

    for (var i=0; i < softwareList.length; i++){

        console.log("# currentSoftware:");
        console.log(currentSoftware[1] + "&" + currentSoftware[2]);
        console.log("# softwareList[i][0]:");
        console.log(encodeURI(softwareList[i][0]).replace(/\)/g,"%29").replace(/\(/g,"%28").replace(/%25/g,"%"));
/**/
        if(encodeURI(softwareList[i][0]).replace(/\)/g,"%29").replace(/\(/g,"%28").replace(/%25/g,"%")
           == currentSoftware[1] + "&" + currentSoftware[2]){
            window.location.replace(softwareList[i][1]);
        }
    }

})();
