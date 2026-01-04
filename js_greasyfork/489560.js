// ==UserScript==
// @name         GetBlogger++ by PJ
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Улучшение админки GetBlogger
// @author       PrometheuZ
// @license MIT
// @match        https://plus-manage.getblogger.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getblogger.ru

// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand

// @resource CUSTOM_STYLE https://pjst.ru/getblogger/style4.css
// @resource ICONS_CSS https://lostvale.fun/assets/css/LineIcons.2.0.css
// @resource NOTIE_CSS https://unpkg.com/notie/dist/notie.min.css
// @resource NAV_BAR https://pjst.ru/getblogger/navbar.html
// @require  https://unpkg.com/notie
// @require https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// @downloadURL https://update.greasyfork.org/scripts/489560/GetBlogger%2B%2B%20by%20PJ.user.js
// @updateURL https://update.greasyfork.org/scripts/489560/GetBlogger%2B%2B%20by%20PJ.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements*/

(function() {
    'use strict';

    const ICONS_CSS = GM_getResourceText("ICONS_CSS");

    GM_addStyle(ICONS_CSS);

    const NOTIE_CSS = GM_getResourceText("NOTIE_CSS") + '.notie-container \{z-index: 1000000 !important;\}';

    GM_addStyle(NOTIE_CSS);

    const CUSTOM_STYLE = GM_getResourceText("CUSTOM_STYLE");

    GM_addStyle(CUSTOM_STYLE);

    GM_registerMenuCommand("Hello, world (simple)", () => alert("Hello, world!"));

    document.body.onclick = function(anEvent) {
        changeURL();
    };

    document.onload = onLoadGBP();




      $(document).on('click', '.btn-promo', function() {
        copyToClip("Промокод скопирован: " + $(this).attr("data-clipboard-text"), $(this).attr("data-clipboard-text"));
    });

    $(document).on('click', '.btn-promo', function() {
        copyToClip("Промокод скопирован: " + $(this).attr("data-clipboard-text"), $(this).attr("data-clipboard-text"));
    });

    $(document).on('click', '.btn-creative', function() {
        chancheTextArea(500);
    });

    $(document).on('click', '.js-upload-creative', function() {
        chancheTextArea(2000);
    });

    $(document).on('click', '.js-copy-cpa-promolink', function() {

        copyToClip("Ссылка скопирована!", $(this).attr("data-clipboard-text"));
    });

     $(document).on('click', '.js-copy-yalink-result', function() {

        copyToClip("Ссылка скопирована!", $(this).attr("data-clipboard-text"));
    });

    $(document).on('click', '.btn-copyId', function() {

        let data = $(this).attr("data-clipboard-text").split(":");


        copyToClip("ID cкопирован: " + data[0], data[0].replace(/\s+/g, ''));
    });

    $(".add-time-project-custom").on("click", function(e) {
        e.preventDefault();
        var $button = $(this);
        var projectId = $(this).data("id");

        if (confirm('Вернуть в статус "Ожидает отправки креативов"?')) {
            $.ajax({
                url: "/bloggers/default/return-to-status-wait-upload-creatives",
                type: "POST",
                dataType: "json",
                data: {
                    project_id: projectId
                },
                success: function(response) {
                    if (response.result) {
                        var errorStr = '';
                        if (response.errors && response.errors.length > 0) {
                            $.each(response.errors, function(attribute, errors) {
                                $.each(errors, function(indx, error) {
                                    errorStr += error + '\n';
                                });
                            });
                        }
                        if (errorStr) {
                            errorStr = 'Замечания:\n' + errorStr;
                        }
                        alert('Успешно!' + errorStr);
                        window.location.reload();
                    } else {
                        showAjaxErrors(response.errors || [
                            ["Неизвестная ошибка!"]
                        ]);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showAjaxErrors([
                        [errorThrown]
                    ]);
                },
                complete: function(jqXHR, textStatus) {
                    $button.removeClass("disabled");
                },
                beforeSend: function() {
                    $button.addClass("disabled");
                }
            });
        }
    });

    $('.approve-project-custom').on('click', function(e) {
        e.preventDefault();

        var $button = $(this);

        $.ajax({
            url: '/offers/accept-project',
            type: 'post',
            dataType: 'json',
            data: {
                id: $button.data('id')
            },
            success: function(response) {
                console.log(response);
                if (response.result === true) {
                    notie.alert({
                        type: 1,
                        text: "Участие в оффере подтверждено!",
                        time: 3
                    })

                    $button.parent('.project-control').remove();

                } else {
                    showAjaxErrors(response.errors || 'Неизвестная ошибка!');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showAjaxErrors(errorThrown || textStatus);
            },
            complete: function(jqXHR, textStatus) {
                $button.removeClass("disabled").prop("disabled", false);
            },
            beforeSend: function() {
                $button.addClass("disabled").prop("disabled", true);
            }
        });
    });

})();



function chancheTextArea(time) {
    setTimeout(function() {


        var linkCopy = document.querySelectorAll(".js-copy-cpa-promolink");

        for (let linkBtn of linkCopy) {

            $(linkBtn).attr("onClick", "return false;");
        }

        var textAreas2 = document.querySelectorAll("[name^=edit-creative-description]");



        for (let element of textAreas2) {



            if ($(element).attr("rows") <= 3) {
                $(element).attr("style", "height: 319px; width: 705px; font-size: 12px;");

            }


        }

        var textAreas = document.querySelectorAll("[name^=add-creative-description]");
        for (let element of textAreas) {

            if ($(element).attr("rows") <= 3) {
                $(element).attr("style", "height: 319px; width: 705px; font-size: 12px;");

            }

        }


    }, time);
}

function copyToClip(text, copy) {

    navigator.clipboard.writeText(copy);

    notie.alert({
        type: 1,
        text: text,
        time: 3
    })


}

function changeURL() {

    $('textarea[name="accept-creative-comment"]').val('согласовано');

    //$('textarea[name="add-creative-description-*"]').setAttribute("style", "width: 731px; height: 381px;");

    var elements = document.querySelectorAll("a");

    for (let element of elements) {
        let newHref = element.href.replaceAll('https://plus-manage.getblogger.ru/bloggers/projects/get-image?url=', '');
        element.href = newHref;
    }

}


function updateURLParameter(url, param, paramVal)
{
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL)
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else
    {
         tmpAnchor = baseURL.split("#");
         TheParams = tmpAnchor[0];
            TheAnchor  = tmpAnchor[1];
        if(TheParams)
            baseURL = TheParams;
    }
    if(TheAnchor)
        paramVal += "#" + TheAnchor;
    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function onLoadGBP() {




    $('#involvementbloggerssearch-brandid').select2({
        placeholder: "Бренд",
        maximumSelectionLength: 2,
        language: "ru",
        allowClear: true
    });



    var promoBtns = document.querySelectorAll(".promo");
    for (let promoBtn of promoBtns) {

        let button = '<button type=\"button\" data-clipboard-text=\"' + promoBtn.innerHTML + '\" class=\"btn btn-sm btn-promo\" style=\"padding: 1px 6px;\"><i class=\"far fa-copy\"></i> ' + promoBtn.innerHTML + '</button><div style=\"height: 8px;\"></div>';
        promoBtn.parentNode.innerHTML += button;

    }

    var namesLine = document.querySelectorAll("div.username  > a");

    for (let name of namesLine) {
        let text = $(name).text();
        text = text.replaceAll(" ", "");
        let button = '<button type=\"button\" data-clipboard-text=\"' + text + '\" class=\"btn btn-sm btn-copyId\" style=\"padding: 1px 6px;\"><i class=\"far fa-copy\"></i> ID</button><div style=\"height: 8px;\"></div>';
        name.parentNode.innerHTML = button + name.parentNode.innerHTML;
       // console.log(text);
    }


    var logo = $(".logo");
    logo.remove();

    var sidebar = $(".main-sidebar");
    sidebar.remove();

    var navbar = $(".navbar");

    const new_navbar_html = GM_getResourceText("NAV_BAR");

    var navbar_custom = $(".navbar-custom-menu").html();

    navbar_custom = navbar_custom.replaceAll("Region_manager", "Региональный менеджер");

    navbar.html(new_navbar_html.replaceAll("%navbar_custom_menu%", "<div class=\"navbar-custom-menu\">" + navbar_custom + "</div>"));

    var elements_offers_id = document.querySelectorAll('a');
    for (let element of elements_offers_id) {
        let href = element.href;
        if (href.includes("/offers/edit?id=")) {
            let id = href.replaceAll("https://plus-manage.getblogger.ru/offers/edit?id=", "");
            // getOfferData(element, id);
        }
    }

    //    var elements_del = document.querySelectorAll("div.declined-accept");
    //   for (let element of elements_del) {
    //        $(element).remove();
    //   }


    var elem3 = document.querySelectorAll("div.offer  > div.project-info-row");

    for (let element of elem3) {
        let id = element.parentNode.getAttribute("data-project-id");
        let button_start = '<div class="project-control"><button type="button" class="btn approve-project-custom" style="position: absolute; bottom: -90px; left: 77px; font-weight: bold; color: black; background-color: #f8f9fa; border-color: #f8f9fa; height: 22px;" title="Подтвердить участие" data-id="' + id + '"><i class="fa fa-play" style="position: absolute; top: 4px; left: 8px;"></i></button></div>';
        let button_addtime = '<div class="project-control"><button type="button" class="btn add-time-project-custom" style="position: absolute; bottom: -90px; left: 77px; font-weight: bold; color: black; background-color: #f8f9fa; border-color: #f8f9fa; height: 22px;" title="Добавить время" data-id="' + id + '"><i class="fa fa-history" style="position: absolute; top: 4px; left: 5px;"></i></button></div>';

        if (element.parentNode.innerHTML.includes("Участие ожидает подтверждения")) {

            $(element.parentNode).attr("style", "background: linear-gradient(180deg, rgb(33 88 73) 0%, rgb(72 144 131) 100%);");

            element.innerHTML = button_start + element.innerHTML;
        }

        if (element.parentNode.innerHTML.includes("Креатив отклонен")) {
            $(element.parentNode).attr("style", "background: linear-gradient(180deg, rgb(88 33 74) 0%, rgb(144 72 93) 100%);");
            element.innerHTML = button_addtime + element.innerHTML;
        }

        if (element.parentNode.innerHTML.includes("Участие отклонено")) {
            $(element.parentNode).attr("style", "background: linear-gradient(180deg, rgba(103, 18, 31, 1) 0%, rgba(164, 52, 86, 1) 100%) !important;");
        }

            if (element.parentNode.innerHTML.includes("Креатив ожидает отправки")) {
            $(element.parentNode).attr("style", "background: linear-gradient(180deg, rgb(134 183 14 / 65%) 0%, rgb(175 166 62) 100%) !important;");
        }

    }




    var elements = document.querySelectorAll("div.without-repeat  > div.project-info-row");

    for (let element of elements) {
        let id = element.parentNode.getAttribute("data-project-id");
        let button = '<span><button type=\"button\" onclick=\"loadCreativesModalBody(' + id + ')\" class=\"btn btn-sm  btn-creative\" style=\"padding: 1px 6px;\">креатив</button></span>';
        element.innerHTML = button + element.innerHTML;
    }

    var elem2 = document.querySelectorAll("div.need-repeat  > div.project-info-row");
    for (let element of elem2) {
        let id = element.parentNode.getAttribute("data-project-id");
        let button = '<span><button type=\"button\" onclick=\"loadCreativesModalBody(' + id + ')\" class=\"btn btn-sm btn-creative\" style=\"padding: 1px 6px;\">креатив</button></span>';
        element.innerHTML = button + element.innerHTML;
    }



    //---


    let params = new URLSearchParams(document.location.search);
    let blogger_id = params.get("InvolvementBloggersSearch[bloggerId]");
    let brand_id = params.get("InvolvementBloggersSearch[brandId]");


         console.log(brand_id);


    if(brand_id == -1){

       let newUrls = updateURLParameter(window.location.href, 'InvolvementBloggersSearch[brandId]', '');


        window.location.replace(newUrls);


        console.log(newUrls);

    }

   // console.log(blogger_id);

    const max_elem = 4;

    if (blogger_id > 0) {
       // console.log("one work");


        var elem4 = document.querySelectorAll("div.offer");
        var index = 0;
        var rows = 1;
        var temp_elem;
        for (let element of elem4) {

            var s = 'test';
            var temp = document.createElement('div');
            temp.innerHTML = s;


            if (index % max_elem === 0) {
                if (index > 0) {
                    $("<br><br>").insertBefore(element);
                    temp_elem = element;

                }
            }


            index++;
        }

        rows = Math.ceil(index/max_elem);

        if (rows > 1) {
            var temp_height = (180 * rows) + 50;

            temp_elem.parentNode.setAttribute("style", "height: " + temp_height + "px !important;");
        }

        var temp_bloggers_list = $(".bloggers-list");

        $(".bloggers-list").remove();

        $(temp_bloggers_list).insertBefore($(".box-primary"));

        $(".bloggers-list").attr("style", "display: block;");

        $("<br>").insertBefore($(".box-primary"));

        $(".username").attr("style", "display: -webkit-inline-box; margin-left: 0px;");




        // Таким образом, сначала мы проверяем, не пуст ли объект, есть ли у него дети
        var children = $(".username").children();

        for (var i = 0; i < children.length; ++i) {

            if (i == 0) {} else {

               // console.log(children[i].innerHTML);


                if (children[i].innerHTML.includes("₽")) {
                    children[i].innerHTML = children[i].innerHTML.replaceAll(' ', '');
                    $(children[i]).attr("style", "");
                }

                if (children[i].innerHTML.includes("fa-calendar")) {
                    $(children[i]).attr("style", "font-size: 16px;");
                }

                if (children[i].innerHTML.includes("🔀")) {
                    $(children[i]).attr("style", "font-size: 16px;");
                }

                if (children[i].innerHTML.includes("💎")) {
                    $(children[i]).attr("style", "font-size: 16px;");
                }

                if (children[i].innerHTML.includes(":")) {
                    $(children[i]).attr("style", "font-size: 16px;");
                }


                if (children[i].innerHTML.includes("Скидки")) {
                    $(children[i]).remove();
                } else if (children[i].innerHTML.length < 1) {
                    $(children[i]).remove();
                } else {
                    $("<div style=\"width: 4px; background-color: #494d5b; margin-inline: 10px; border-radius: 25px; margin-top: -2px;\"></div>").insertBefore($(children[i]));
                }


            }
        }


        $(".summary").remove();

        $(".offers-list").attr("style", "width: 100% !important;");


        console.log(temp_height);

    }




    //---

}



function getOfferData(element, id) {

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://plus-manage.getblogger.ru/offers/edit?id=" + id,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            let pageContent = response.responseText;
            var $tempElement = $(pageContent);
            var elementsByClass = $tempElement.find('.allow-coupons-radio');

            for (let element of elementsByClass) {
                var isChecked = $(element).is(':checked');

                if (isChecked) {
                    console.log(id);
                    if ($(element).val() == 0) {
                        let button = '<span>Куппоники ЗАПРЕЩЕНЫ!</span>';
                        element.innerHTML = button + element.innerHTML;
                    }
                }
            }
        }
    });

}