// ==UserScript==
// @name         eBAY Product reviews
// @name:ru      eBAY Отзывы о товарах
// @namespace    https://github.com/AlekPet/
// @version      0.3.1
// @description  Ebay check sellers
// @description:ru  Ebay проверка продавцов
// @author       AlekPet 2017
// @copyright    2018, AlekPet (https://github.com/AlekPet)
// @license     MIT; https://opensource.org/licenses/MIT
// @match        http*://www.ebay.com/itm/*
// @icon         https://raw.githubusercontent.com/AlekPet/Ebay-User-Reviews-products-by-seller/master/assets/images/icon.png
// @run-at document-end
// @noframes
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370165/eBAY%20Product%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/370165/eBAY%20Product%20reviews.meta.js
// ==/UserScript==

GM_addStyle(`
.ebay_review{margin-top: 20px;border: 2px dotted #999;width: 95%;}
.old_vers_button {cursor: pointer;border: 1px solid #9a9595;padding: 5px;background: linear-gradient(#5b6f88,#0d425f);color: white;font-weight: bold;margin: 0 auto;width: 65%;border-radius: 3px;}
.old_vers_button:hover{background:linear-gradient(#5cf8fc, grey);}
#inp_eb {vertical-align: middle;background: linear-gradient(white,#78efef);border-radius: 5px;color: #6b95a3;font-weight: bold;margin: 10px 0px;}
#ver_feedbackselector_form {text-align: center;display: table;margin: 0 auto;padding-bottom: 10px;border-bottom: 2px dotted silver;}
.ver_feedback_cell {display: table-row;}

.ebay_review_box{text-align: center;color:white;width: 90%;margin: 10px auto;}
.ebay_review_title{background: #5b6f88;font-family: Skin-market-sans;padding: 5px;color: white;font-size: 1em;}
.ebay_review_pages{background: white;padding: 5px;color:gray;border-bottom: 1px solid silver;}
.ebay_review_list{width: 95%;margin: 0 auto;overflow-y: auto;    max-height: 300px;}
.ebay_review_item{margin: 8px auto;color: white;display: table;font-size: 0.5vw;width: 90%;box-shadow: 4px 4px 10px 0px #65656594;border-radius: 4px;}
.ebay_review_item_raiting{display: table-cell;vertical-align: middle;padding: 5px;    width: 50px;text-transform: uppercase;}
.ebay_review_item_otziv{color: white;background: #046061;padding: 5px;border-radius: 0px 4px 0 0;word-break: break-all;}
.ebay_review_item_tovarname{color: #02026f;padding: 5px;background: #87f4f5;border-radius: 0 0 4px 0px; word-break: break-all;}
.ebay_review_foot{font-family: Skin-market-sans;padding: 5px;background: #364a63;margin-top: 10px;line-height: 15px;min-height: 15px;font-size: 0.8em;}
.ebay_review_pages_item{padding: 0px 5px;display: inline-block;}
.ebay_review_list_load{display:none;color: white;padding: 5px 0;border: 1px solid silver;width: 40%;margin: 6px auto;background: linear-gradient(#00ff28,#136107);border-radius: 4px;box-shadow: 4px 4px 5px #c0c0c0cf;transition: 1s all;cursor:pointer;    user-select: none;}
.ebay_review_list_load:hover{background: linear-gradient(#00ffd8,#074261);transition: 1s all;width: 45%;}

.ebay_review_list .result_empty{color: #5b6f88;border: 1px dotted silver;width: 50%;margin: 5px auto;padding: 5px;background: #e2e2e2;font-family: monospace;}

.ebay_review_box .ajax_button_search {border: 1px solid white;padding: 3px;background: lightslategray;border-radius: 3px;width: 65%;margin: 0 auto;box-shadow: 2px 2px 5px #00000099;user-select: none;cursor: pointer;transition: 1s all;}
.ajax_button_search:hover {transition: 1s all;background: lightgray;color: #5a5a5a;}
.ebay_review_container{display:none;}
`);

(function() {
    //========================== VARS ==========================
    var lang =
        {
            ru:
            {
                otziv:"Отзывы о товаре",
                iskat:"Искать",
                ajaxsearch: "Ajax Поиск",
                more: "Еще...",
                views: ["Показано: "," из "],
                pages: "Страниц найдено: ",
                review_type: ["Положительный", "Нейтральный","Отрицательный"],
                reviews: "отзывов",
                field_empty: "Поле с названием товара пустое!",
                Sitesearch: "Отзывы Ebay"
            },
            en:
            {
                otziv:"Product reviews",
                iskat:"Search",
                ajaxsearch: "Ajax Search",
                more: "More...",
                views: ["Showing: ", " of "],
                pages: "Pages found: ",
                review_type: ["Positive","Neutral","Negative"],
                reviews: "reviews",
                field_empty: "The field with the name of the product is empty!",
                Sitesearch: "Ebay reviews"
            }
        },

        yazik = lang.en,
        sel_yz = "en",

        OzObj = {
            otzivi:[],
            pages: 1,
            find_items_number: 0
        },

        days = [30,90,180,365],
        type = ['positive','neutral','negative','all'],
        page = 1,
        items = [25, 50, 100, 200],

        seller = "",
        tovar = "",
        debug = false;
    //========================== VARS END ==========================

    function log(){
        console.log(Array.prototype.slice.call(arguments));
    }

    function checkPole(){
        let varCheck = arguments[0];

        if(varCheck.length === 0 || /^\s*$/i.test(varCheck)) {
            if(debug) alert(yazik.field_empty);
            return false;
        } else {
            return true;
        }
    }

    //Обработка данныз из запроса
    function readData(__data){
        let content = $(__data),
            main_form = content.find(".FeedbackTabs").next().next(),
            find_items_full = content.find(".FeedBackStatusLine").text(),
            find_items_number = find_items_full.match(/\d+/)[0],
            pages = parseInt($(main_form).find("div.newPagination b.pg-num a:last-child").text()) || 1;

        OzObj.find_items_number = parseInt(find_items_number);
        OzObj.pages = parseInt(pages);

        $(".ebay_review_pages").empty();

        /*for(let p = 1,pagesBox; p < pages+1; p++){
            pagesBox = $('<div class="ebay_review_pages_item"></div>').text(p);
            $(".ebay_review_pages").append(pagesBox);
        }
             let pagesBox = $('<div class="ebay_review_pages_item"></div>').text(yazik.pages+pages);
            $(".ebay_review_pages").append(pagesBox);
        */


        let PreItem = null,

            otzovi_data = main_form.find(".FbOuterYukon tr:not(.info90daysMsg)").filter(function(i,val){

                let El = $(this),
                    Raiting,
                    Otziv,
                    TovarName;

                if(El[0].className !== "bot" && El.children(1).attr("class") !== "info90daysMsg"){

                    let getRaiting = El.find("td:eq(0) img").attr("src").match(/.*icon(.*)_16x16.*/)[1];

                    Raiting = getRaiting === "Pos" ? yazik.review_type[0] : getRaiting === "Neu" ? yazik.review_type[1] : yazik.review_type[2];

                    Otziv = El.find("td:eq(1)").text();

                    PreItem = {
                        "raiting": Raiting,
                        "otziv": Otziv,
                        "TovarName":""
                    };

                } else if(El.children(1).attr("class") !== "info90daysMsg"){
                    TovarName = El.find("td:eq(1)").text();

                    PreItem.TovarName = TovarName;

                    OzObj.otzivi.push(PreItem);
                    PreItem = null;
                }
            });
    }

    // Вывод полученных значений из запроса
    function pastReviewItems(){
        if(debug)console.log("Страниц: "+OzObj.pages, OzObj);

        let listItem = $(".ebay_review_box").find(".ebay_review_list"),
            colors = ["yellowgreen","red","silver"];

        if(OzObj.otzivi.length > 0) {
            for(var itemi of OzObj.otzivi){
                let setCol = itemi.raiting === yazik.review_type[0] ? colors[0] : itemi.raiting ===yazik.review_type[2] ? colors[1] : colors[2],
                    itemReview = $('<div class="ebay_review_item" style="background: '+setCol+';"></div>')
                .append('<div class="ebay_review_item_raiting">'+itemi.raiting+'</div>'+
                        '<div class="ebay_review_item_otziv">'+itemi.otziv+'</div>'/*+
                        '<div class="ebay_review_item_tovarname">'+itemi.TovarName+'</div>'*/);
                listItem.append(itemReview);
            }
        }else {
            if(debug) console.log("List empty!!!");
            listItem.append("<div class='result_empty'>0 "+yazik.reviews+"...</div>").fadeIn('slow');
        }

        $("div.ebay_review_box .ebay_review_foot").empty().append("<div>"+yazik.views[0]+OzObj.otzivi.length+yazik.views[1]+OzObj.find_items_number+'</div>');
    }

    // Ajax запрос
    function ajax(param)
    {
        let ret,
            days = param.days,
            type = param.type,
            page = param.page,
            items = param.items,
            seller_name = param.seller,
            tovar_name = param.tovar_name,

            // All otzivi seller
            //url_link = 'https://feedback.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&userid='+seller+'&iid=-1&de=off&items='+items+'&searchInterval=30&which='+type+'&interval='+days+'&page='+page;

            // Tolko tekuhiy tovar seller
            url_link = 'https://feedback.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&ftab=FeedbackForItem&userid='+seller_name+'&iid=-1&de=off&items='+items+'&searchInterval='+days+'&keyword='+encodeURI(tovar_name)+'&page='+page;

        ret = GM_xmlhttpRequest({
            method: "GET",
            url: url_link,
            onload: function(res) {
                try{
                    if(debug){
                        console.log("======= INFO =========");
                        console.log("Ссылка",url_link,"Страница", page);
                    }
                    readData(res.responseText);
                    pastReviewItems();
                    $(".ebay_review_container").fadeIn();
                    $(this).attr("loadedItems","0");

                } catch(e){console.log(e);}
            }
        });
    }

    // Создание главного меню, для отображения полученных запросов
    function AjaxMenuMake(){
        let ebay_review=$(".ebay_review").append('<div class="ebay_review_box">'+
                                                 '<div class="ebay_review_title"><div class="ajax_button_search">'+(navigator.userAgent.includes("Chrome")?yazik.ajaxsearch:yazik.Sitesearch)+'</div></div>'+
                                                 '<div class="ebay_review_container">'+
                                                 '<div class="ebay_review_pages"></div>'+
                                                 '<div class="ebay_review_list""></div>'+
                                                 '<div class="ebay_review_list_load" loadedItems="0">'+yazik.more+'</div>'+
                                                 '<div class="ebay_review_foot""></div>'+
                                                 '</div>'+
                                                 '</div>');

        $("div.ebay_review_box .ebay_review_list").scroll(function() {
            if($(this).scrollTop() >=  ($(this).prop("scrollHeight")-parseFloat($(this).css("height")))) {
                if(debug) console.log("Scroll end list...");
                $(this).next().fadeIn(1000);
            } else {
                $(this).next().fadeOut(1000);
            }
        });

        $("div.ebay_review_box .ebay_review_list_load").click(function(){
            if($(this).attr("loadedItems") !== "1"){
                $(".ebay_review_list").empty();
                $(this).attr("loadedItems","1");
                page = page + 1;
                ajax({seller:seller,tovar_name:$(".ver_feedback_cell:eq(0) input").val(),days:days[3],type:type[3],page:page,items:items[0]});
            }
        });

        $(".ebay_review_box .ajax_button_search").click(function(){
            if(navigator.userAgent.includes("Chrome")){
                $(".ebay_review_list").empty();
                let tovaAjax = $(".ver_feedback_cell:eq(0) input").val();

                if(checkPole(tovaAjax)){
                    ajax({seller:seller,tovar_name:tovaAjax,days:days[3],type:type[3],page:1,items:items[0]});
                }
            } else {
            if(debug) console.log("Firefox, ajax not working...(bug!)")
                if($("#byrfdbk_atf_lnk").length){
                    $("#byrfdbk_atf_lnk").click()
                } else{
                    alert("0 "+yazik.reviews+"...")
                }
            }
        });
    }

    // Поиск отзывов на сайте feedbackselector
    function ver_feedbackselector(){
        if($(".gh-eb-Geo-txt:eq(0)").length){
            sel_yz = $(".gh-eb-Geo-txt:eq(0)").text() === "Русский" ? "ru" : "en";
        }
        yazik = sel_yz === "ru" ? lang.ru : lang.en;

        seller = $(".mbg-nw:eq(0)").text();
        tovar = sel_yz === "ru" ? $(".it-sttl").prop("dataset").mtdes : $("#itemTitle").contents().filter(function(){ return this.nodeType === 3;}).text();

        let div = $('<div class="ebay_review"></div>'),
            Title = $('<div style="font-size:12pt;color:#0bc60b;padding: 5px; display: table-caption;"></div>').text(yazik.otziv),

            Input = $('<input>').attr({
                title:'Продавец: '+seller+'\nНазвание товара: '+tovar,
                value: tovar,
                id:'inp_eb',
                class: 'notranslate MaxBidClass'
            }),

            CellInp = $('<div class="ver_feedback_cell"></div>'),

            Button = $('<div class="old_vers_button"></div>').text(yazik.iskat).click(function(){
                if(checkPole(Input.val())){
                    window.open('http://www.feedbackselector.com/feedsearch.php?seller='+seller+'&itemName='+Input.val());
                }
            }),

            CellBut = CellInp.clone().append(Button),

            BodyInputiButton = $('<div id="ver_feedbackselector_form"></div>').append(Title,CellInp.append(Input),CellBut);

        div.append(BodyInputiButton);
        $(".si-inner").append(div);
    }

    function init(){
        ver_feedbackselector();
        AjaxMenuMake();
    }

    init();

})();
