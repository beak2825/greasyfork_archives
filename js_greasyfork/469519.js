// ==UserScript==
// @name         GGn Pet Filter
// @namespace    https://greasyfork.org
// @version      1.0
// @license      MIT
// @description  Pet Inventory Display
// @author       drlivog
// @match        https://gazellegames.net/user.php?*action=inventory*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/469519/GGn%20Pet%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/469519/GGn%20Pet%20Filter.meta.js
// ==/UserScript==

/* globals $ */

let KEY = '';
let USER_ID=''; //optional, if empty, will obtain userid from the page
let EXP_CUTOFF = 1;
let sort = 'alphabetical';
const p_list = [2529, 2522, 2521, 3170, 3169, 2929, 2928, 2927, 2514, 2512, 2509, 2510, 2511, 2513, 2515, 3216, 3214, 3215, 3213, 2523, 2933, 2583, 2507, 3322, 3323, 3324, 3369, 3370, 3371, 3373, 2525, 2524, 3237];

$(window).load(function() {
    $('<input type="button" value="Pet Info" id="PI_but">&nbsp;&nbsp;&nbsp;&nbsp;EXP Cutoff: <input type="text" value='+EXP_CUTOFF+
      ' id="XPC" size="7"><select id="PI_sort"><option id="sort_alpha" value="alphabetical">Alphabetical</option><option id="sort_list" value="list">List</option>'+
      '<option id="sort_itemid" value="itemid">Item Id</option></select>').insertBefore('#items_list');
    $('#items_list').prepend('<li id="highpets" class="item_li outputlist" style="display: none"><h3 class="center">Leveled Pets:</h3></li><li id="lowpets" class="item_li outputlist" style="display: none"><h3 class="center">Low-level Pets (XP<'+EXP_CUTOFF+'):</h3></li>');
    $('.outputlist').css({"max-height": "200px", "overflow": "auto"});
    $('#PI_but').click(function() {
        checkAPIKey();
        if ($('#PI_but').val() === "Pet Info") {
            petInventory();
            $('#PI_but').val("Hide Pet Info");
        } else {
            $('#highpets').css('display', 'none');
            $('#lowpets').css('display', 'none');
            $('#PI_but').val("Pet Info");
        }
    });
    $('#PI_sort').val(sort.toLowerCase()).prop('selected', true);
});

function petInventory() {
    if (USER_ID === null || USER_ID === "") {
        USER_ID = $('#items_list').attr('data-userid');
    }
    ajax("https://gazellegames.net/api.php?request=items&type=users_equippable&include_info=true&userid="+USER_ID+"&key="+KEY, null,
         function(response) {
            var lowpets = {};
            var highpets = {};
            response = JSON.parse(response.responseText);
            EXP_CUTOFF = parseInt($('#XPC').val());
            sort = $('#PI_sort').val();
            console.log(sort);
            if (response.status === 'success') {
               for (let i=0; i<response.response.length; i++) {
                   let equip = response.response[i];
                   if ('item' in equip) {
                       if (equip.item.equipTypeName === 'Pet') {
                           if (parseInt(equip.experience) >= EXP_CUTOFF) {
                               if (equip.itemid in highpets) {
                                   highpets[equip.itemid].list.push({'level': equip.level, 'experience': equip.experience});
                               }
                               else {
                                   highpets[equip.itemid] = {'name': equip.item.name, 'list': [{'level': equip.level, 'experience': equip.experience}]};
                               }
                           } else {
                               if (equip.itemid in lowpets) {
                                   lowpets[equip.itemid].list.push({'level': equip.level, 'experience': equip.experience});
                               }
                               else {
                                   lowpets[equip.itemid] = {'name': equip.item.name, 'list': [{'level': equip.level, 'experience': equip.experience}]};
                               }
                           }
                       }
                   }
               }
               //console.log(highpets);
               //console.log(lowpets);
               let highoutput="<h3 class='center'>Leveled Pets:</h3>";
               let lowoutput="<h3 class='center'>Low-level Pets (XP<"+EXP_CUTOFF+"):</h3>";
               if (sort === 'list') {
                   let ret = outputlistorder(highpets,lowpets);
                   highoutput+=ret[0];
                   lowoutput+=ret[1];
               }
               else if (sort === 'alphabetical') {
                   let ret = outputalphabetical(highpets,lowpets);
                   highoutput+=ret[0];
                   lowoutput+=ret[1];
               } else if (sort === 'itemid') {
                   let ret = outputitemid(highpets,lowpets);
                   highoutput+=ret[0];
                   lowoutput+=ret[1];
               }
               if (Object.keys(highpets).length === 0) {
                   highoutput+="<li>None</li>";
               }
               console.log(Object.keys(lowpets).length);
               if (Object.keys(lowpets).length === 0) {
                   lowoutput+="<li>None</li>";
               }
               highoutput+="</ul>";
               lowoutput+="</ul>";
               $('#highpets').html(highoutput).css('display','block');
               $('.highpetdlg').click(function(event) {
                   const that = $(this);
                   ItemInfo(that.attr('id'), that.text());
                   event.preventDefault();
               });
               $('#lowpets').html(lowoutput).css('display','block');
               $('#PI_hide').css('display', 'block');
            }
        });
}

function compareEquipName( a, b ) {
  if ( a[1].name < b[1].name ){
    return -1;
  }
  if ( a[1].name > b[1].name ){
    return 1;
  }
  return 0;
}

function ItemInfo(id, title) {
    var dialogOptions = {
        "title": $('<div/>').html(title).text(),
        "width": 800,
        "height": 620,
        "show": {
            effect: 'fold',
            duration: 'fast'
        },
        "hide": {
            effect: 'fold',
            duration: 'fast'
        },
        "resizable": true,
        "draggable": true,
        "position": {my: 'center', at: 'center'},
        "close": function () {
            $(this).dialog("close");
        }
    };
    var dialogExtendOptions = {
        "closable": true,
        "maximizable": true,
        "minimizable": true,
        "collapsable": false,
        "dblclick": "collapse",
        "icons": {"maximize": "ui-icon-arrow-4-diag"},
        "load" : function(){
            const that = this;
            const id = that.dataset.itemid;
            if(id) {
                let $itemlink = document.createElement('a');
                $itemlink.classList.add("ui-corner-all", "ui-state-default");
                $itemlink.style.width = "19px";
                $itemlink.style.height = "18px";
                $itemlink.role = "button";
                $itemlink.innerHTML = '<span class="ui-icon ui-icon-link">item link</span>';
                $itemlink.href = `/shop.php?ItemID=${id}`;
                $itemlink.target = '_blank';
                that.previousElementSibling.querySelector('.ui-dialog-titlebar-buttonpane').appendChild($itemlink);
            }
        },
    };
    $('#'+id).dialog("open",dialogOptions).dialogExtend(dialogExtendOptions);
}

function outputlistorder(highpets, lowpets) {
    let highoutput = "<ul class='outputlist2'>";
    let lowoutput = "<ul class='outputlist2'>";
    for (let j=0; j<p_list.length; j++) {
        let id = p_list[j];
        if (id in highpets) {
            highoutput+=`<li><a class="highpetdlg" id="highpetdlg${j}" href="#0" data-item-id="${id}">${highpets[id].name}</a>: `;
            for (let i=0; i<highpets[id].list.length; i++) {
                let v = highpets[id].list[i];
                highoutput+="Level "+v.level+" ("+v.experience+"XP)";
                if (i<highpets[id].list.length-1) {
                    highoutput+=", ";
                }
            }
            highoutput+="</li>";
        }
        if (id in lowpets) {
            lowoutput+="<li>"+lowpets[id].name+": "+lowpets[id].list.length+"x</li>";
            //                        for (let i=0; i<lowpets[id].list.length; i++) {
            //                            let v = lowpets[id].list[i];
            //                            lowoutput+="Level "+v.level+" ("+v.experience+"XP)";
            //                            if (i<lowpets[id].list.length-1) {
            //                                lowoutput+=", ";
            //                            }
            //                        }
        }
    }
    return [highoutput, lowoutput];
}

function outputalphabetical(highpets, lowpets) {
    let highoutput = "<ul class='outputlist2'>";
    let lowoutput = "<ul class='outputlist2'>";
    highpets = Object.entries(highpets).sort(compareEquipName);
    for (let i=0; i<highpets.length; i++) {
        let v=highpets[i];
        highoutput+=`<li><a class="highpetdlg" id="highpetdlg${i}" href="#0" data-item-id="${v[0]}">${v[1].name}</a>: `;
        for (let j=0; j<v[1].list.length; j++) {
            highoutput+="Level "+v[1].list[j].level+" ("+v[1].list[j].experience+"XP)";
            if (j<v[1].list.length-1) {
                highoutput+=", ";
            }
        }
        highoutput+="</li>";
    }
    lowpets = Object.entries(lowpets).sort(compareEquipName);
    for (let i=0; i<lowpets.length;i++) {
        lowoutput+="<li>"+lowpets[i][1].name+": "+lowpets[i][1].list.length+"x</li>";
    }
    highoutput+="</ul>";
    lowoutput+="</ul>";
    return [highoutput, lowoutput];
}

function outputitemid(highpets, lowpets) {
    let highoutput = "<ul class='outputlist2'>";
    let lowoutput = "<ul class='outputlist2'>";
    for (let id in highpets) {
        const v=highpets[id];
        highoutput+=`<li><a class="highpetdlg" id="highpetdlg${id}" href="#0" data-item-id="${id}">${v.name}</a>: `;
        for (let j=0; j<v.list.length; j++) {
            highoutput+="Level "+v.list[j].level+" ("+v.list[j].experience+"XP)";
            if (j<v.list.length-1) {
                highoutput+=", ";
            }
        }
        highoutput+="</li>";
    }
    for (let v in lowpets) {
        v = lowpets[v];
        lowoutput+="<li>"+v.name+": "+v.list.length+"x</li>";
    }
    highoutput+="</ul>";
    lowoutput+="</ul>";
    return [highoutput, lowoutput];
}

function checkAPIKey() {
    if (KEY=="" || KEY==null) {
        if (GM_getValue("API_KEY")) {
            KEY = GM_getValue("API_KEY");
            return true;
        } else {
            const input = window.prompt(`Please input your GGn API key.
If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
The API key must have "Inventory" permission.`);
            const trimmed = input.trim();
            if (/[a-f0-9]{64}/.test(trimmed)) {
                GM_setValue("API_KEY", trimmed);
                KEY = trimmed;
                return true;
            }
            else {
                console.log('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
                throw 'No API key found.';
                //return false;
            }
        }
    }
}

function ajax(url, data=null, returnCall=null) {
    let xhr = new XMLHttpRequest();
    xhr.open(data==null? 'GET':'POST', url);
    if (returnCall != null) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                returnCall(xhr);
            }
        };
    }
    if (data==null) {
        xhr.send();
    } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
    return xhr;
}