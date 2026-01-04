// ==UserScript==
// @license      MIT
// @name         Auto Parcours Global Exam
// @namespace    https://global-exam.com/
// @version      0.1
// @description  Global Exam Parcours Auto Script
// @author       Adrien Roux
// @match        https://exam.global-exam.com/user-plannings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=global-exam.com
// @grant       GM_log
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/457062/Auto%20Parcours%20Global%20Exam.user.js
// @updateURL https://update.greasyfork.org/scripts/457062/Auto%20Parcours%20Global%20Exam.meta.js
// ==/UserScript==

const timer = 120; // Seconds

function $x(path){
    var xpath = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var temp = [];
    for (var i = xpath.snapshotLength - 1; i >= 0; i--) {
        temp.push(xpath.snapshotItem(i));
    }
    return temp;
}

const intervalAction = async () => {
    console.log("Execution");
    $x("//label[contains(.,'A')]").forEach(e => {
        e.click();
    });
    $x("//label[contains(.,'B')]").forEach(e => {
        if (Math.random() > 0.3) { e.click(); }
    });
    $x("//label[contains(.,'C')]").forEach(e => {
        if (Math.random() > 0.3) { e.click(); }
    });
    $x("//label[contains(.,'D')]").forEach(e => {
        if (Math.random() > 0.3) { e.click(); }
    });
    $x("//span[contains(.,'Voir la correction')]").forEach(e => {
        e.click();
    });
    await setTimeout(()=>{},100);
    $x("//label[contains(@class,'bg-success')]").forEach(e => {
        if (Math.random() > 0.3) { e.click(); }
    });
    $x("//span[contains(.,'Voir la correction')]").forEach(e => {
        e.click();
    });
    await setTimeout(()=>{},100);

    if($x("//button[contains(.,'Valider')]")[0]!=undefined){
        $x("//button[contains(.,'Valider')]")[0].click();
    } else if($x("//button[contains(.,'Suivant')]")[0]!=undefined){
        while($x("//button[contains(.,'Suivant')]")[0]!=undefined){
            await setTimeout(()=>{},100);
            $x("//button[contains(.,'Suivant')]")[0].click();
        }
        await setTimeout(()=>{},100);
        $x("//button[contains(.,'Terminer')]")[0].click();
    } else if($x("//button[contains(.,'Passer')]")[0]!=undefined){
        while($x("//button[contains(.,'Passer')]")[0]!=undefined){
            await setTimeout(()=>{},100);
            $x("//button[contains(.,'Passer')]")[0].click();
        }
        await setTimeout(()=>{},100);
        $x("//button[contains(.,'Terminer')]")[0].click();
    } else if($x("//button[contains(.,'Terminer')]")[0]!=undefined){
        $x("//button[contains(.,'Terminer')]")[0].click();
    } else if($x("//button[contains(.,'Activité suivante')]")[0]!=undefined){
        $x("//button[contains(.,'Activité suivante')]")[0].click();
    }

    if($x("//span[not(span[contains(@class,'shadow')]) and img[not(contains(@src,'writing.png') or contains(@src,'speaking'))]]")[0]!=undefined){
        $x("//span[not(span[contains(@class,'shadow')]) and img[not(contains(@src,'writing.png') or contains(@src,'speaking'))]]")[0].click();
    }else if($x("//a[contains(@href,'user-pla')]")[0]!=undefined){
        $x("//a[contains(@href,'user-pla')]")[0].click();
    }
}

setTimeout(intervalAction, 3000);
setInterval(intervalAction, timer * 1000);
