// ==UserScript==
// @name         Melvor Idle梅沃尔放置小工具。
// @namespace    https://xuz.sjzkz.com/
// @version      0.1
// @description  向游戏插入各种内置功能!为保持游戏乐趣，做了一些限制，金币每点击一次，加1M，祈祷、屠杀点击一次加1k，添加物品只能添加已获得过的物品。添加物品时，可输入物品ID，也可输入中文或英文名称。
// @author       xuz
// @match        https://www.melvoridle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442616/Melvor%20Idle%E6%A2%85%E6%B2%83%E5%B0%94%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/442616/Melvor%20Idle%E6%A2%85%E6%B2%83%E5%B0%94%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const delay = 5000;
    var ref;
    function searchDiv(){
        ref = $("#header-theme>.d-flex").eq(0);
        if(ref.length > 0){
            var injeDiv = $("<div class='d-flex align-item-left'></div>");
            ref.after(injeDiv);
            var addDpBtn = $("<button>金币</button>").addClass("btn btn-sm btn-success border-1x border-dark").click(function(){
                player.addGP(1000000);
            });
            var addPPBtn = $("<button>祈祷</button>").addClass("btn btn-sm btn-success border-1x border-dark").click(function(){
                player.addPrayerPoints(1000)
            });
            var addSCBtn = $("<button>屠杀</button>").addClass("btn btn-sm btn-success border-1x border-dark").click(function(){
                player.addSlayerCoins(1000)
            });
            injeDiv.append(addDpBtn);
            injeDiv.append(addPPBtn);
            injeDiv.append(addSCBtn);
            injeDiv.append($("<button>添加</button>").addClass("btn btn-sm btn-success border-1x border-dark").click(function(){
                let temp = $("#my-add-item");
                if(temp.length > 0){
                    temp.show();
                    return;
                }
                var x = $('#modal-item-log').clone().first();
                x.attr('id', "my-add-item");
                $('#modal-item-log').parent().append(x);
                var y = x.children().children().children().children('.font-size-sm');
                y.children().children().attr('id', "my-add-item-container");
                //var allButOne = SEMI.getItem(id + "-sell-one");
                var controlSection = $("\n        <div class=\"col-12 bg-gray-400\">\n            <div class=\"block block-rounded py-2 px-2\">\n                <div class=\"row row-deck gutters-tiny\">\n                              <div class=\"col-3 col-md-3\">\n                    <input class=\"form-control\" type=\"text\" id=\"my-add-item-which\" placeholder=\"name | id\">\n                </div>\n                              <div class=\"col-2 col-md-2\">\n                    <input class=\"form-control\" type=\"text\" id=\"my-add-item-amount\" placeholder=\"amount\">\n                </div>\n                <div class=\"col-2 col-md-2\">\n                    <button class=\"btn btn-md btn-danger SEMI-modal-btn\" id=\"my-add-item-button\">添加</button>\n                </div>\n                </div>\n            </div>\n        </div>");
                y.before(controlSection);
                $("#my-add-item .block-title").text("添加物品");
                var addBotton = $("#my-add-item-button")
                var witchInput = $("#my-add-item-which")
                var amountInput = $("#my-add-item-amount")
                var closeButton = $("#my-add-item > div > div > div > div.block-header.bg-primary-dark > div > button")
                closeButton.on('click', ()=> x.hide());
                addBotton.on("click",function(){
                    if(!witchInput.val() || !amountInput.val()) return;
                    if(isNaN(Number(amountInput.val()))) return;
                    let witchValue = witchInput.val();
                    let n = 0;
                    if(!isNaN(Number(witchValue))){
                        //是数字
                        n = Number(witchValue)
                    }else{
                        var pattern = new RegExp("^[A-Za-z_]+$");
                        if(pattern.test(witchValue)){
                            //是英文
                            if(!CONSTANTS.item.hasOwnProperty(witchValue)) return;
                            n = CONSTANTS.item[witchValue]
                        }else{
                            //是中文
                            let item = items.find(n1=> n1.name === witchValue)
                            n= item.id
                        }
                    }
                    if(itemsAlreadyFound.indexOf(n) > -1)
                        addItemToBank(n, Number(amountInput.val()))
                })
                x.show();
            }));
            //player.addSlayerCoins(amount)
        }
        else
            setTimeout(searchDiv,delay);
    }
    setTimeout(searchDiv,delay);
})();