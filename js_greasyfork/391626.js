// ==UserScript==
// @name         diamond spaceship
// @namespace    FileFace
// @version      13.69
// @description  thingies for diamond hunt mobile
// @author       shtos
// @match        *.diamondhunt.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391626/diamond%20spaceship.user.js
// @updateURL https://update.greasyfork.org/scripts/391626/diamond%20spaceship.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */

(function() {
    'use strict';

//-------------------------------------------------------------------------------
//           array of items to show, EDIT THIS WITH YOUR WEAPONS
//           AFTER YOU ADD THINGS YOU LIKE COPY THIS BECAUSE IT'S GONNA RESET WHEN NEW UPDATE COMES
        var weaponsArray = ["superPoisonTrident","enchantedSkeletonSword","enchantedSuperBow","arrows","iceArrows","fireArrows","superPoisonArrows","offhandIronDagger","knightsShield","lightbulb","lizardskinCape"]
//           array of items to show, EDIT THIS WITH YOUR WEAPONS
//-------------------------------------------------------------------------------
// arrays and stuff

        var zones = ["fields","forests","caves","volcano","northernFields","hauntedMansion","desert","ocean","jungle","dungeonEntrance","dungeon","dungeonCoffin","castle","cemetery","factory","hauntedWoods","deepOcean","bloodMoon"];
        var energyCost = ["50","250","1,000","5,000","8,000","20,000","50,000","120,000","200,000","500,000","1,000,000","0","3,000,000","7,000,000","10,000,000","14,000,000","20,000,000","0"]
        var zonesLevel = ["1","10","30","50","75","110","160","200","250","300","400","480","530","600","700","800","1000","1250"]
        var equipmentImages = ["exploringSkill","rustySword","arrows","bearFurMask","knightsCape","boneAmulet","boneRing","skeletonShield"]
        //var weaponsSorting = $('#item-section-exploring-2').find('[id*="Mask"],[id*="Body"],[id*="Legs"],[id*="Helmet"],[id*="Gloves"],[id*="Hood"],[id*="Top"],[id*="Bottom"],[id*="Cape"],[id*="Tank"],[id*="Feed"],[id*="Shield"],[id*="offhand"],[id*="Ring"],[id*="Amulet"],[id*="bulb"]').css('display','none')
        //var armourSorting = $('#item-section-exploring-2').find('[id*="Mask"],[id*="Body"],[id*="Legs"],[id*="Helmet"],[id*="Gloves"],[id*="Hood"],[id*="Top"],[id*="Bottom"]').css('display','none')
        //var equipmentStuff = Array.from($('#item-section-exploring-2').find('div:not([id*="Tab"]):not([style*="display: "])'))

// pogchamp
    function pogchamp(){
        lumberjackNotifClick()
        timeMachineButtonInExploringTab()
        totalOilUsed()
        zonesDropList()
        customItemsInCombat()
        //dpsMeter()
        equipmentSorting()
    }
// checking if logged in
    const func = () => {
        if(window.username){
            console.log('69')
            pogchamp();
        }else{
            console.log('login please')
            setTimeout(func,1000)
        }
    }
    func();

// comma function
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

// lumberjack click notification
    function lumberjackNotifClick(){
        var treeNotificationOnclick = document.getElementById('notification-treeNotification')
        let newOnclickAttribute = document.createAttribute("onclick");
        newOnclickAttribute.value = "clicksItem('lumberjack');navigateAndLoadImages('woodcutting','item-section-woodcutting-1');"
        treeNotificationOnclick.setAttributeNode(newOnclickAttribute)
    }
// time machine button
    function timeMachineButtonInExploringTab(){
        if (window.isHardcore == 0){
            var exploringTab = document.getElementById("main-button-quests-tr");
            var timeMachineButton = document.createElement("td");
            timeMachineButton.id = "time-machine-explore";
            timeMachineButton.style.width = "40px";
            timeMachineButton.style.textAlign = "center";
            timeMachineButton.style.borderLeft = "1px solid silver"
            timeMachineButton.style.cursor ="pointer"
            timeMachineButton.innerHTML = '<img src="images/timeMachine.png" height="30" width="30">'
            let newOnclickAttribute = document.createAttribute("onclick");
            newOnclickAttribute.value = "if (bloodCrystals > 4){sendBytes('OPERATE_TIME_MACHINE=5');}else{alert('git gud')}"
            timeMachineButton.setAttributeNode(newOnclickAttribute)
            $(timeMachineButton).insertBefore(document.getElementById('combat-resetPotion-button'))
        }
    }
// total oil consumed
    function totalOilUsed(){
        var totalOilUsedSpan = document.createElement("span");
        var oilBr = document.createElement("br");
        $(oilBr).insertAfter(document.getElementById('oil-out-label'));
        $(totalOilUsedSpan).insertAfter(oilBr);
        setInterval(()=>{
            var totalOilUsed = ((window.crushersXpTotal/0.2)+(window.giantDrillsXpTotal/0.25)+(window.roadHeadersXpTotal/0.13)+(window.excavatorsXpTotal/0.1)+(window.drillsXpTotal/0.1)+(window.giantExcavatorsXpTotal/0.1))
            totalOilUsedSpan.id = "totalOilUsed";
            totalOilUsedSpan.innerHTML = '<b>Total oil used: </b>'+numberWithCommas(totalOilUsed.toFixed(0));
            totalOilUsedSpan.style.fontSize = '13px'
        },5000);
    }
// zones droplist
    function zonesDropList(){
        //main div
        var zoneListDiv = document.createElement('div')
        zoneListDiv.id = 'zoneListDiv'
        zoneListDiv.className = 'main-button'
        $(zoneListDiv).insertBefore(document.getElementById('xp-display-in-exploring'))
        var zoneListTable = document.createElement('tbody')
        zoneListTable.id = 'zoneListTable'
        document.getElementById("zoneListDiv").appendChild(zoneListTable)
        document.getElementById('zoneListTable').insertRow()
        let numberX = 0
        var zoneListRow = document.getElementById('zoneListTable').childNodes[numberX]
        for (let i = 0; i < zones.length; i++) {
            if (zoneListRow.childNodes[2] != null){
                document.getElementById("zoneListTable").insertRow()
                numberX+=1
                zoneListRow = document.getElementById('zoneListTable').childNodes[numberX]
            }
            let option = document.createElement("button");
            let zonesThing = zones[i]
            let levelThing = zonesLevel[i]
            let energyThing = energyCost[i].replaceAll(',','')
            if (window.totalDonations >= 32){energyThing *= 0.8}
            option.id = 'zonesListOption'+i
            let text = zones[i].charAt(0).toUpperCase() + zones[i].slice(1)
            option.innerHTML = text.replace(/([A-Z])/g, ' $1').trim()
            option.style.width = '156px'
            option.style.height = '21'
            option.style.backgroundColor = '#485761'
            option.style.color = '#FFFFFF'
            option.style.fontFamily = 'Courier New'
            option.style.fontWeight = 'bold'
            option.style.border = '1px solid #A9A9A9'
            option.style.borderRadius = '4px'
            if (numberX == 0){
                option.style.marginTop = '4px'
                option.style.marginBottom = '4px'
            }else{
                option.style.marginBottom = '4px'
            }
            if (i==0 || i==3 || i==6 || i==9 || i==12 || i==15 || i==18){
                option.style.marginLeft = '8px'
            }
            if (zones[i] != 'bloodMoon'){
                let mapCheck = zones[i-1]
                let newOnclickAttribute = document.createAttribute("onclick");
                if (i==0){
                    newOnclickAttribute.value = "buyFromShop('"+zonesThing+"',['images/exploringSkill.png','images/steak.png'],['Level "+levelThing+"', "+ energyThing+"],["+levelThing+" <= "+getLevel(exploringXp)+", "+energyThing+" <= "+energy+"],'EXPLORE','Explore')"
                }else{
                    newOnclickAttribute.value = "if(eval("+mapCheck+"Map)>0){buyFromShop('"+zonesThing+"',['images/exploringSkill.png','images/steak.png'],['Level "+levelThing+"', "+ energyThing+"],["+levelThing+" <= "+getLevel(exploringXp)+", "+energyThing+" <= "+energy+"],'EXPLORE','Explore')}else{alert('Get a map from previous zone first')}"
                }
                option.setAttributeNode(newOnclickAttribute)
            }else{
                option.style.backgroundColor = '#780f0f'
                let newOnclickAttribute = document.createAttribute("onclick");
                newOnclickAttribute.value = "clicksBloodMoonExploring()"
                option.setAttributeNode(newOnclickAttribute)
            }
            zoneListRow.appendChild(option)
        }
    }

//items in combat
    function customItemsInCombat(){
        let potionsTable = $('#tab-combat [width*=100]').children().eq(0).children().eq(2)
        let potionsRow = document.createElement('tr')
        potionsRow.id = 'weaponsTable'
        potionsRow.align = 'center'
        potionsRow.style.borderBottom = '1px solid silver'
        $(potionsRow).insertBefore(potionsTable)
        let weaponsTable = document.createElement('tbody')
        weaponsTable.style.textAlign = 'center'
        potionsRow.appendChild(weaponsTable)
        document.getElementById('weaponsTable').childNodes[0].insertRow()
        let numberX = 0
        let weaponsRow = document.getElementById('weaponsTable').childNodes[0].childNodes[0]
        for (let i=0;i<=weaponsArray.length-1;i++){
            if (weaponsRow.childNodes[5] != null){
                document.getElementById("weaponsTable").firstChild.insertRow()
                numberX+=1
                weaponsRow = document.getElementById('weaponsTable').childNodes[0].childNodes[numberX]
            }
            let weaponsTd = document.createElement("td");
            weaponsRow.appendChild(weaponsTd)
            let button = document.createElement("img");
            button.id = weaponsArray[i]+'Id';
            button.className = 'img-small potion-in-combat-td not-draggable'
            let weaponOnclick = weaponsArray[i];
            let newOnclickAttribute = document.createAttribute("onclick");
            newOnclickAttribute.value = "clicksItem('"+weaponOnclick+"')"
            button.setAttributeNode(newOnclickAttribute)
            if (weaponsArray[i].includes("enchanted",0)){
                button.src = 'images/'+weaponsArray[i]+'.gif'}
            else{
                button.src = 'images/'+weaponsArray[i]+'.png'
            }
            weaponsTd.appendChild(button)
        }
        // highlights what you have equiped
        setInterval(()=>{
            for (let i=0;i<=weaponsArray.length-1;i++){
                let check = weaponsArray[i]
                if (equipedArrows == check || weapon == check || shield == check || cape == check){document.getElementById(check+'Id').style.border = '2px solid #7FFF00'}
                else{document.getElementById(check+'Id').style.border = '1px solid #A9A9A9'}
            }
        },100);
        $('#tab-combat [width*=100]').children().eq(0).children().eq(1).children().eq(0).css('border-bottom','')
        $('#tab-combat [width*=100]').children().eq(0).children().eq(3).children().children().width('100%')
        $('#tab-combat [width*=100]').children().eq(0).children().eq(3).children().children().css('border-top','1px solid grey')
    }
//dps meter
    function dpsMeter(){
        //dps meter parent eleement
        var heroStatElement = document.getElementById('hero-defence').parentElement.children[5]
        var dpsMeter = document.createElement('span')
        dpsMeter.id = 'DPSMeter'
        $(dpsMeter).insertAfter(heroStatElement)

        //image for dpsmeter
        var dpsMeterImage = document.createElement("img")
        dpsMeterImage.src = "images/attack.png"
        dpsMeterImage.className = "img-small"
        dpsMeterImage.id = "dpsMeterImg"
        dpsMeter.appendChild(dpsMeterImage)

        //text for dpsmeter
        var dpsMeterText = document.createElement("span")
        dpsMeterText.id = 'dpsMeterText'
        dpsMeterText.style.paddingRight = '10px'
        dpsMeterText.style.paddingLeft = '2px'
        dpsMeter.appendChild(dpsMeterText)
        //dps meter
        var damageDone = 0
        var fightTimer = 0
        var dps = 0
        var xD = 0
        var hpCheck = 0
        var damageLastHit = 0
        setInterval(()=>{
            if (window.monsterName != 'none' && window.monsterName != 'dungeonCoffin'){
                if(hpCheck>0){
                    damageLastHit = hpCheck - window.monsterHp
                }
                damageDone += damageLastHit
                if(xD!=damageDone){xD += damageDone}
                if(fightTimer>0){
                    dps = Math.floor(damageDone/fightTimer)
                }
                dpsMeterText.innerHTML = dps.toFixed(0) +' DpS'
                hpCheck = window.monsterHp
                fightTimer += 1
                console.log('hpCheck '+hpCheck+' damage '+damageLastHit+' damagedone '+ damageDone+ ' fightTimer '+fightTimer+' dps '+dps+' all damage '+xD)
            }else{
                if(dps>0){
                    console.log('Last fight took '+fightTimer+' seconds. DpS done in last fight: '+dps)
                }
                damageLastHit = 0
                hpCheck = 0
                dps = 0
                damageDone = 0
                fightTimer = 0
                xD=0
            }
        },1000)
    }
//inventory sort
    function equipmentSorting(){
        //creating buttons
        var equipmentTab = document.getElementById('item-section-exploring-2');
        var sortingDiv = document.createElement('div')
        sortingDiv.id = 'equipmentSorting'
        sortingDiv.className = 'main-button'
        sortingDiv.style.borderSpacing = '5px'
        sortingDiv.style.align = 'center'
        //sortingDiv.style.paddingTop = '3px'
        $(sortingDiv).insertBefore(equipmentTab)
        var sortingTable = document.createElement('tbody')
        $(sortingDiv).append(sortingTable)
        var sortingRow = document.createElement('tr')
        $(sortingTable).append(sortingRow)
        for (let i=0;i<equipmentImages.length;i++){
            let button = document.createElement("td")
            button.id = 'sortingButton'+i
            button.style.width = "50px"
            button.style.height = "50px"
            button.style.border = '1px solid #A9A9A9'
            button.style.borderRadius = '10px'
            button.style.cursor = 'pointer'
            button.style.backgroundColor = '#1a1a1a'
            $(sortingRow).append(button)
            let imageTest = document.getElementById('sortingButton'+i)
            let image = document.createElement("img")
            image.style.height = '50px'
            image.style.width = '50px'
            image.style.filter = "grayscale(100%)"
            image.src = 'images/'+equipmentImages[i]+'.png'
            $(imageTest).append(image)
        }
    // making buttons work
    // show all button
    let buttonClick0 = document.getElementById('sortingButton0')
    let newOnclickAttribute0 = document.createAttribute("onclick");
    newOnclickAttribute0.value = "for(let i=0;i<array_item_section_exploring_2.length;i++){let test = array_item_section_exploring_2[i];if ($('#item-img-'+test).attr('src') != 'images/empty100_100.png'){if (eval(test)>0){$('#item-box-'+test).css('display','');$('#item-box-amount-'+test).css('display','');$('#item-img-'+test).css('display','');}}}"
    buttonClick0.setAttributeNode(newOnclickAttribute0)
    // show weapons
    let buttonClick1 = document.getElementById('sortingButton1')
    let newOnclickAttribute1 = document.createAttribute("onclick");
    newOnclickAttribute1.value = "$('#sortingButton0').click();$('#item-box-arrows').nextAll().andSelf().css('display', 'none');"
    buttonClick1.setAttributeNode(newOnclickAttribute1)
    // show arrows
    let buttonClick2 = document.getElementById('sortingButton2')
    let newOnclickAttribute2 = document.createAttribute("onclick");
    newOnclickAttribute2.value = "$('#sortingButton0').click(); $('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=amount]):not([id*=rrows])').css('display','none')"
    buttonClick2.setAttributeNode(newOnclickAttribute2)
    // show armours
    let buttonClick3 = document.getElementById('sortingButton3')
    let newOnclickAttribute3 = document.createAttribute("onclick");
    newOnclickAttribute3.value = "$('#sortingButton0').click(); $('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=Mask]):not([id*=Body]):not([id*=Legs]):not([id*=Helmet]):not([id*=Gloves]):not([id*=Hood]):not([id*=Top]):not([id*=Bottom])').css('display','none')"
    buttonClick3.setAttributeNode(newOnclickAttribute3)
    // show capes
    let buttonClick4 = document.getElementById('sortingButton4')
    let newOnclickAttribute4 = document.createAttribute("onclick");
    newOnclickAttribute4.value = "$('#sortingButton0').click();$('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=Cape]):not([id*=bulb]):not([id*=Tank])').css('display','none')"
    buttonClick4.setAttributeNode(newOnclickAttribute4)
    // show amulets
    let buttonClick5 = document.getElementById('sortingButton5')
    let newOnclickAttribute5 = document.createAttribute("onclick");
    newOnclickAttribute5.value = "$('#sortingButton0').click();$('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=Amulet])').css('display','none')"
    buttonClick5.setAttributeNode(newOnclickAttribute5)
    // show rings
    let buttonClick6 = document.getElementById('sortingButton6')
    let newOnclickAttribute6 = document.createAttribute("onclick");
    newOnclickAttribute6.value = "$('#sortingButton0').click();$('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=Ring])').css('display','none')"
    buttonClick6.setAttributeNode(newOnclickAttribute6)
    // show offhands
    let buttonClick7 = document.getElementById('sortingButton7')
    let newOnclickAttribute7 = document.createAttribute("onclick");
    newOnclickAttribute7.value = "$('#sortingButton0').click();$('#item-section-exploring-2').find('[id*=item-box]:not([id*=Tab]):not([id*=offhand]):not([id*=Feed]):not([id*=Shield])').css('display','none')"
    buttonClick7.setAttributeNode(newOnclickAttribute7)
    }
})();
