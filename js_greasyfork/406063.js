// ==UserScript==
// @name         The West Sleeper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include https://*.the-west.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406063/The%20West%20Sleeper.user.js
// @updateURL https://update.greasyfork.org/scripts/406063/The%20West%20Sleeper.meta.js
// ==/UserScript==


var maxCount = 4;
var setId = -1;
async function readCookie(){
    try{
        setId = document.cookie.split("setId=")[1].split(";")[0] - 0;
    } catch(err){}
}
async function init(){
    await new Promise(r => setTimeout(r, (1000 * (5 + Math.floor(Math.random() * 10)))));
    Premium.checkEndTimes();
    await new Promise(r => setTimeout(r, (1000 * (1 + Math.floor(Math.random() * 3)))));
    if(Premium.endTimes["automation"] != null)
    {
        maxCount = 9;
    }
    readCookie();
    addButtonForStart();
    addButtonForEquipSelection();
}

async function selectSet(){
    var setName = prompt('Setname für den Job', "arbeit ... produkte..");
    for(var i = 0; i < EquipManager.list.length ; i ++)
    {
        if(EquipManager.list[i].name.toLowerCase() == setName.toLowerCase())
        {
            setId = EquipManager.list[i].equip_manager_id;
            document.cookie = ("setId=" + setId);
            document.getElementById("setSelect").innerHTML = "mit Set: " + setName;
        }
    }
}

async function addButtonForStart(){
    var sleepWell = document.createElement('div');
    sleepWell.setAttribute('id', 'sleepWell');
    sleepWell.innerHTML = "Job nach Schlaf ausführen"
    sleepWell.setAttribute('style', 'position:absolute;width:110px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:1px;background:#1818B9 no-repeat scroll 0px -7px');
    sleepWell.onclick = function()	{
        checkRefilledState();
        document.getElementById("sleepWell").innerHTML = "1. Job wird nach dem Schlaf mehrfach ausgeführt";
    }
    document.body.appendChild(sleepWell);
}

async function addButtonForEquipSelection(){
    var sleepWell = document.createElement('div');
    sleepWell.setAttribute('id', 'setSelect');
    sleepWell.innerHTML = "Set auswählen";
    sleepWell.setAttribute('style', 'position:absolute;width:110px;z-index:1;text-align:center;color:#fff;font-size:12px;padding: 1px 1px 1px 0px;left:186px;top:32px;background:#18A918 no-repeat scroll 0px -7px');
    sleepWell.onclick = function()	{
        EquipManager.showPopup();
        selectSet();
    }
    document.body.appendChild(sleepWell);
}

async function wearBestClothesForJob(){
    var job = new JobWindow(TaskQueue.queue[0].data.job.id, TaskQueue.queue[0].data.x, TaskQueue.queue[0].data.y);
    await new Promise(r => setTimeout(r, (100 * (5 + Math.floor(Math.random() * 10)))));
    job.bestWearButtonClicked();
    await new Promise(r => setTimeout(r, (100 * (5 + Math.floor(Math.random() * 10)))));
    Inventory.instantWear();
    await new Promise(r => setTimeout(r, (1000 * (5 + Math.floor(Math.random() * 10)))));
}

async function redoJob()
{
    if(TaskQueue.queue.length == 1) {
        await wearBestClothesForJob();
        for(var i = 1; i < maxCount; i++){
            TaskQueue.add(new TaskJob(TaskQueue.queue[0].data.job.id, TaskQueue.queue[0].data.x, TaskQueue.queue[0].data.y, 3600));
        }
        if(setId > 0){
            await new Promise(r => setTimeout(r, (1000 * (5 + Math.floor(Math.random() * 10)))));
            EquipManager.switchEquip(setId);
        }
    }
}
async function cancelSleep()
{
    TaskQueue.cancel(0);
    await new Promise(r => setTimeout(r, (1000 * (3 + Math.floor(Math.random() * 10)))));
}

async function checkRefilledState(){
    if(Character.energy > maxCount * 12 && TaskQueue.queue[0].type.includes("sleep") && TaskQueue.queue.length > 1)
    {
        await cancelSleep();
        await redoJob();
        addButtonForStart();
    }
    else{
        await new Promise(r => setTimeout(r, (1000 * 60 * (1 + Math.floor(Math.random() * 10)))));
        checkRefilledState();
    }
}
init();