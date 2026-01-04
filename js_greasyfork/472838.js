// ==UserScript==
// @name         IdlePixel AviusUiTweaks
// @namespace    com.avius.idlepixel.aviusuitweaks
// @version      0.0.20
// @description  IdlePixel Ui tweaks
// @author       Avius
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/472838/IdlePixel%20AviusUiTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/472838/IdlePixel%20AviusUiTweaks.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 
    class AviusUiTweaks extends IdlePixelPlusPlugin {
        constructor() {
            super("aviusuitweaks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                ]
            });
        }
 
        onLogin() {
            $("head").append(`
            <style id="avius-ui-tweaks">
                .avius-itembox {
                    position: relative;
                }
 
                .avius-badge {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    font-size: 0.69em; // nice
                }
 
                .avius-brewing-xp-total {
                    padding-bottom: 12px;
                }
 
                .avius-badge img {
                    width: 15px;
                    height: 15px;
                }
            </style>
            `);
 
            const makeBadge = function() {
                const el = $(this);
                el.addClass("avius-itembox");
                el.append(`<div class="avius-badge"></div>`);
            };
            
            const cookingRows = $("#cooks_book-table").children("tbody").first().children("tr");
            const cookingHeader = cookingRows.first();
            cookingHeader.children("th").each(function(){
                const el = $(this);
                el.attr({
                    width: (parseInt(el.attr("width").replace("%","")) - 1).toString() + "%"
                });
            });
            cookingHeader.append(`<th width="9%" class="p-2">RATIOS</th>`);
 
            cookingRows.not(":eq(0)").each(function(){
                const el = $(this);
                el.width(el.width()-1);
                el.append(`
                <td class="p-2 color-grey font-small" style="color: rgb(128, 128, 128);">
                    <div class="avius-cooking-meta-food">
                        <span class="avius-cooking-meta-food-ratio">-</span> <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/energy.png" title="energy"> per h
                    </div>
                    <div class="avius-cooking-meta-time">
                        <span class="avius-cooking-meta-time-ratio">-</span> xp per h
                    </div>
                </td>`);
            })
 
            $(`#panel-brewing itembox`).each(makeBadge);
            $(`#panel-gathering itembox`).each(makeBadge);
            $(`#panel-fishing itembox`).each(makeBadge);
 
            const first = $(`#panel-brewing itembox`).first();
            $(`<div class="avius-brewing-xp-total"></div>`).insertBefore(first);
        }
 
        getCookingRows(){
            return  $("#cooks_book-table").children("tbody").first().children("tr[data-cooks_book-item]");
        }
 
        onPanelChanged(panelBefore, panelAfter) {
            if(panelAfter == "brewing"){
                let total = 0;
                $(`#panel-${panelAfter} itembox`).each(function() {
                    const el = $(this);
                    
                    const key = el.attr("data-tooltip");
                    const amount = Items.getItem(key);
                    const value = Brewing.get_xp_from_materials(key, amount);
                    const badge = el.find(".avius-badge");
 
                    if (value == 0){
                        badge.text("");
                    }else{                        
                        total += value;
                        badge.text(`${value}xp`);
                    }
                });
                $(".avius-brewing-xp-total").text(`Total ingredient xp: ${total}`)
            } else if (panelAfter == "gathering"){
                $(`#panel-${panelAfter} itembox`).each(function() {
                    const el = $(this);
                    
                    const key = el.attr("data-item");
                    const amount = Items.getItem(key+"_total");
                    const badge = el.find(".avius-badge");
 
                    if (amount == 0){
                        badge.text("");
                    }else{              
                        badge.text(amount);
                    }
                });
            } else if (panelAfter == "fishing"){
                $(`#panel-${panelAfter} itembox`).each(function() {
                    const el = $(this);
                    
                    const key = el.attr("data-item");
                    const energy = Cooking.ENERGY_MAP[key];
                    const heat = Cooking.FOOD_HEAT_REQ_MAP[key];
 
                    if(energy !== undefined && energy !== undefined
                        && key.startsWith("raw_")){

                        const badge = el.find(".avius-badge");
 
                        const ratio = energy / heat;
                        const label = `${Math.trunc(ratio)} <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/energy.png" title="energy"> / <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/heat.png" title="heat">`;
                        badge.html(label);
                    }
 
                    
                });
            } else if (panelAfter == "cooking"){
                const hasChefHat = Items.getItem("chefs_hat") === 1;
                this.getCookingRows().each(function(){
                    const el = $(this);
                    const rows = el.children("td");
                    const energyEl = $(rows[4]);
                    const timeEl = $(rows[5]);
                    const xpEl = $(rows[6]);
                    const countEl = $(rows[7]);
                    const ratioRow = $(rows[8]);
                    const foodLabelEl = ratioRow.find(".avius-cooking-meta-food-ratio");
                    const xpLabelEl = ratioRow.find(".avius-cooking-meta-time-ratio");
 
                    let prepared = parseInt(countEl.text().trim().replaceAll(",",""));
                    let energy = parseInt(energyEl.text().trim().replaceAll(",",""));
                    let time = parseInt(timeEl.text().trim().replaceAll("h","").replaceAll(",",""));
                    let xp = parseInt(xpEl.text().trim().replaceAll(" xp","").replaceAll(",",""));
 
                    if(hasChefHat){
                        if(prepared >= 5)
                            time = time / 2;
                        if(prepared >= 10)
                            energy = energy * 2;
                    }
                    
                    const energyRatio = energy / time;
                    const xpRatio = xp / time;
 
                    foodLabelEl.text(Math.trunc(energyRatio));
                    xpLabelEl.text(Math.trunc(xpRatio));
                });
            }
        }
    }
 
    const plugin = new AviusUiTweaks();
    IdlePixelPlus.registerPlugin(plugin); 
})();