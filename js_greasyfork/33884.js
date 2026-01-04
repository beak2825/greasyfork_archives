// ==UserScript==
// @name         Dota2 Market Tool
// @namespace    https://coding.net/u/sffxzzp
// @version      1.06
// @description  A script that improves display in market list.
// @author       sffxzzp
// @match        *://steamcommunity.com/market/listings/570/*
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/33884/Dota2%20Market%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/33884/Dota2%20Market%20Tool.meta.js
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.createElement = function (data) {
            var node;
            if (data.node) {
                node = document.createElement(data.node);
                if (data.content) {
                    this.setElement({node: node, content: data.content});
                }
                if (data.html) {
                    node.innerHTML = data.html;
                }
            }
            return node;
        };
        util.setElement = function (data) {
            if (data.node) {
                for (let name in data.content) {
                    data.node.setAttribute(name, data.content[name]);
                }
                if (data.html!=undefined) {
                    data.node.innerHTML = data.html;
                }
            }
        };
        return util;
    })();
    var dotamt = (function () {
        function dotamt() {}
        dotamt.prototype.addBanner = function () {
            var listBanner = document.getElementsByClassName('market_listing_table_header')[0];
            var nameBanner = listBanner.children[2];
            var childBanner = util.createElement({node: "span", content: {style: "padding-left: 4vw;"}});
            nameBanner.appendChild(childBanner);
            childBanner = util.createElement({node: "span", content: {style: "width: 20%;", class: "market_listing_right_cell"}, html: "宝石"});
            listBanner.insertBefore(childBanner, nameBanner);
            childBanner = util.createElement({node: "span", content: {style: "width: 20%;", class: "market_listing_right_cell"}, html: "已解锁款式"});
            listBanner.insertBefore(childBanner, nameBanner);
        }
        dotamt.prototype.addPageCtl = function () {
            let oriPageCtl = document.getElementsByClassName('market_paging_summary')[0];
            let oriPageDiv = document.getElementById('searchResults_ctn');
            let newPageCtl = util.createElement({node: "div", content: {style: "float: right; padding-right: 20px;"}});
            let newPageInput = util.createElement({node: "input", content: {class: "filter_search_box market_search_filter_search_box", style: "width: 20px;", type: "text", autocomplete: "off"}});
            newPageCtl.appendChild(newPageInput);
            let newPageGo = util.createElement({node: "span", content: {class: "btn_darkblue_white_innerfade btn_small"}, html: "&nbsp;Go!&nbsp;"});
            newPageGo.onclick = function () {
                g_oSearchResults.GoToPage( (newPageInput.value-1), true );
                newPageInput.value = "";
            };
            newPageCtl.appendChild(newPageGo);
            oriPageDiv.insertBefore(newPageCtl, oriPageCtl);
            let newPageSizeCtl = util.createElement({node: "div", content: {class: "market_pagesize_options", style: "margin: 0 0 2em 0; font-size: 12px;"}, html: "每页显示数：		"});
            let newPageSizeInput = util.createElement({node: "input", content: {class: "filter_search_box market_search_filter_search_box", style: "width: 30px;", type: "text", autocomplete: "off"}});
            let newPageSizeGo = util.createElement({node: "span", content: {class: "btn_darkblue_white_innerfade btn_small"}, html: "&nbsp;修改&nbsp;"});
            newPageSizeGo.onclick = function () {
                if (g_oSearchResults.m_cPageSize != newPageSizeInput.value && newPageSizeInput.value < 101) {
                    let oldPageSize = g_oSearchResults.m_cPageSize;
                    g_oSearchResults.m_cPageSize = newPageSizeInput.value;
                    g_oSearchResults.m_cMaxPages = Math.ceil(g_oSearchResults.m_cTotalCount / newPageSizeInput.value);
                    g_oSearchResults.GoToPage(g_oSearchResults.m_iCurrentPage, true);
                }
                newPageSizeInput.value = "";
            };
            newPageSizeCtl.appendChild(newPageSizeInput);
            newPageSizeCtl.appendChild(newPageSizeGo);
            document.getElementById('searchResults_ctn').appendChild(newPageSizeCtl);
        }
        dotamt.prototype.load = function () {
            var _this=this;
            let isHandled = document.getElementsByClassName("market_listing_table_header")[0].children.length;
            if (isHandled > 3) {return false;}
            _this.addBanner();
            let itemDetails = g_rgAssets[570][2];
            let itemListInfo = g_rgListingInfo;
            let itemInfo = {};
            let reGemDes = /<span style="font-size: 18px;.+?">(.*?)<\/span><br>/gi;
            let reGemColor = /rgb\(.+?\)/gi;
            let reTour = /tournament_info/g;
            for (var listingid in itemListInfo) {
                itemInfo[itemListInfo[listingid].asset.id] = {};
            }
            for (let assetid in itemDetails) {
                let gems = "<div>";
                let lastCount = itemDetails[assetid].descriptions.length-1;
                let gemInfo = itemDetails[assetid].descriptions[lastCount].value;
                if (gemInfo.length > 1) {
                    let gemDes = gemInfo.match(reGemDes);
                    let gemColor = [];
                    if (gemDes === null) {
                        gemDes = gemInfo.match(reTour);
                        if (gemDes !== null) {
                            gemInfo = itemDetails[assetid].descriptions[lastCount-1].value;
                        }
                        gemDes = gemInfo.match(reGemDes);
                    }
                    if (gemDes !== null) {
                        for (let j = 0;j<gemDes.length;j++) {
                            gemColor[j] = gemDes[j].match(reGemColor)[0];
                            gemDes[j] = gemDes[j].replace(/<.+?>/g, '');
                            gems += "<span style=\"float: left; line-height: initial; width: 100%; color: "+gemColor[j]+"\">"+gemDes[j]+"</span>";
                        }
                    }
                    else {
                        gems += "<p></p>";
                    }
                }
                itemInfo[assetid].gems = gems + "</div>";
                let unlocks = "<div>";
                for (let k = 0; k < itemDetails[assetid].descriptions.length; k++) {
                    let unlockDes = itemDetails[assetid].descriptions[k].value;
                    let unlockColor = itemDetails[assetid].descriptions[k].color;
                    if (unlockColor == "9da1a9" || unlockColor == "6c7075") {
                        unlocks += "<span style=\"float: left; line-height: initial; width: 100%; color: #"+unlockColor+"\">"+unlockDes+"</span>";
                    }
                }
                itemInfo[assetid].unlocks = unlocks + "</div>";
            }
            let itemList = document.getElementsByClassName('market_recent_listing_row');
            let nameList;
            for (let i=0;i<itemList.length;i++) {
                let listingid = itemList[i].id.substring(8);
                let assetid = itemListInfo[listingid].asset.id;
                nameList = itemList[i].children[3];
                let itemGem = util.createElement({node: "span", content: {style: "width: 20%;", class: "market_listing_right_cell"}, html: itemInfo[assetid].gems});
                itemList[i].insertBefore(itemGem, nameList);
                let itemUnlock = util.createElement({node: "span", content: {style: "width: 20%;", class: "market_listing_right_cell"}, html: itemInfo[assetid].unlocks});
                itemList[i].insertBefore(itemUnlock, nameList);
            }
        }
        dotamt.prototype.run = function () {
            var _this = this;
            _this.load();
            _this.addPageCtl();
            var dotainv = document.getElementById("searchResultsRows");
            var observer = new MutationObserver(function (recs) {
                _this.load();
            });
            observer.observe(dotainv, { childList: true, subtree: true });
        }
        return dotamt;
    })();
    var script = new dotamt();
    script.run();
})();