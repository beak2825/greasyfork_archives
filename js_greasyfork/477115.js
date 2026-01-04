// ==UserScript==
// @name         block-unwanted-pickpocketing-target
// @namespace    nodelore.torn.easy-market
// @version      1.3
// @description  Hide unwanted targets from pickpocketing crime page to avoid unintended operation.
// @author       nodelore[2786679]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477115/block-unwanted-pickpocketing-target.user.js
// @updateURL https://update.greasyfork.org/scripts/477115/block-unwanted-pickpocketing-target.meta.js
// ==/UserScript==

(function(){
    console.log(`[BUP] Block unwanted pickpocketing target!`)
    const $ = window.jQuery;
    const url = location.href;
    if(url.indexOf('pickpocketing') === -1){
        return;
    }
    let blockFlag = true;

    // According to https://www.torn.com/forums.php#/p=threads&f=61&t=16358739&b=0&a=0
    const safety_targets = [
        "Drunk man",
        "Drunk woman",
        "Homeless person",
        "Junkie",
        "Elderly man",
        "Elderly woman"
    ]

    // add targets you want to block here
    const block_targets = [
        "Gang member",
        "Thug",
        "Police officer",
        "Mobster",
    ]

    // add activities you want to block here
    const avoid_activities = [
        "Jogging",
        "Cycling",
        "Walking", // you can remove this to enable showing walking target
    ]

    const block_physicalprops = [
        "Muscular",
        "Athletic",
    ]

    const block_elements = [];

    const extractPhysical = function(physicalProps){
        if(physicalProps.length > 0){
            const allText = physicalProps.text();
            if(allText.length > 0){
                const splitProps = allText.split(',');
                if(splitProps.length > 0){
                    return splitProps[0].split(' ')[0];
                }
            }
        }
        return '';
    }

    const updatePocketState = function(crimeTitle){
        // update state
        const total = $('div.crime-option');
        let totalCount = 0;
        let blockCount = 0;
        total.each(function(){
            const clock = $(this).find("div[class^='clock']").text();
            if(clock === "0s"){
                $(this).hide();
                return;
            }
            else if($(this).css('display') === 'none'){
                blockCount += 1;
            }
            totalCount += 1;
        })
        // crimeTitle.find('span.pocket-state').text(`(${blockCount} of ${totalCount} blocked)`);
    }

    const updateCrimeOption = function(option){
        const crimeTitle = $("div[class^='crimeHeading'] div:eq(0)");
        if(crimeTitle.find("span.pocket-state").length < 1){
            const pocket_state = $(`<span class="pocket-state t-red" title="Click to toggle"></span>`);
            pocket_state.click(function(){
                blockFlag = !blockFlag;
                if(blockFlag){
                    for(let ele of block_elements){
                        if(ele){
                            ele.hide();
                        }
                    }
                    crimeTitle.find('span.pocket-state').text(`(Blocking Enabled)`);
                }
                else{
                    $('div.crime-option').each(function(){
                        if($(this).css('display') === 'none'){
                            $(this).show();
                            block_elements.push($(this));
                        }
                    });
                    crimeTitle.find('span.pocket-state').text(`(Blocking Disabled)`);
                }
                updatePocketState(crimeTitle);
            });
            crimeTitle.append(pocket_state);
        }

       updatePocketState(crimeTitle);
       if(blockFlag){
        crimeTitle.find('span.pocket-state').text(`(Blocking Enabled)`);
       }

       const titleProps = option.find("div[class^='titleAndProps'] div");
       const physicalProps = option.find("div[class^='titleAndProps'] button[class^='physicalPropsButton']");

       const activities = option.find("div[class^='activity']");
       if(titleProps.length > 0 && activities.length > 0){
        const title = titleProps.contents().filter(function(){
            return this.nodeType === 3;
        }).text();
        const physical = extractPhysical(physicalProps);
        const activity = activities.contents().filter(function(){
            return this.nodeType === 3;
        }).text();

        if(block_targets.indexOf(title) !== -1){
            block_elements.push(option);
            option.find("button[class*='commitButton']").css({
                border: '2px solid red'
            });
            if(blockFlag){
                option.hide();
            }
            console.log(`[BUP] Block ${title} who is ${activity} with physical status ${physical}`);
        }
        else if(avoid_activities.indexOf(activity) !== -1){
            block_elements.push(option);
            option.find("button[class*='commitButton']").css({
                border: '2px solid red'
            });
            if(blockFlag){
                option.hide();
            }
            console.log(`[BUP] Block ${title} who is ${activity} with physical status ${physical}`);
        }
        else if(block_physicalprops.indexOf(physical) !== -1){
            block_elements.push(option);
            option.find("button[class*='commitButton']").css({
                border: '2px solid red'
            });
            if(blockFlag){
                option.hide();
            }     
            console.log(`[BUP] Block ${title} who is ${activity} with physical status ${physical}`);
        }
        else if(safety_targets.indexOf(title) !== -1){
            option.find("button[class*='commitButton']").css({
                border: '2px solid #37b24d'
            });
            console.log(`[BUP] Highlight ${title} who is ${activity} with physical status ${physical}`);
        }
       }
    }

    waitForKeyElements('.crime-option', updateCrimeOption);
})();

function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
  ) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find(selectorTxt);
  
    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
            are new.
        */
      targetNodes.each(function () {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;
  
        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }
  
    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];
  
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function () {
          waitForKeyElements(
            selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }