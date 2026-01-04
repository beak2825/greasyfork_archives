// ==UserScript==
// @name         Trello
// @namespace    https://greasyfork.org/fr/scripts/38702-trello
// @version      0.2
// @description  Trello Filter Estimate or Not
// @author       Tguillaume
// @match        https://trello.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38702/Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/38702/Trello.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        $(".board-header").append('<a class="header-btn header-boards js-boards-menu"><span id="onlyEstimate" class="header-btn-text"> Only Estimate </span></a>');
        $(".board-header").append('<a class="header-btn header-boards js-boards-menu"><span id="onlyNotEstimate" class="header-btn-text"> Only Not Estimate </span></a>');
        $(".board-header").append('<a class="header-btn header-boards js-boards-menu"><span id="all" class="header-btn-text"> All </span></a>');

        /// GET FILTER ///
        function getFilter()
        {
            //filter = getUrlParameter('filter').split(",");
            filter = [];
            filterUser = [];
            $(".label-list-item.is-active").each(function(index){
                filter.push($(this).find("span.label-list-item-link-name").text());
            });

            $(".item.active.js-member-item").each(function(index){
                filterUser.push($(this).find("span.username").text());
            });
        }

        /*  function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1].replace(/\label:/g, '').replace(/\@/g, '');
                }
            }
        }*/


        function checkUser(attr)
        {
            bUser = true;
            if (filterUser.length > 0)
            {
                bUser = false;
                $(attr).parent().parent().find(".member-avatar").each(function(z){
                    user = $(this);
                    $.each(filterUser, function (i,v){
                        if (user.attr("title").indexOf(v) > 0)
                        {
                            bUser = true;
                            return false;
                        }
                    });
                });
            }
        }

        $("#onlyEstimate").click(function() {
            getFilter();
            $(".badge.badge-points.point-count").each(function(index)
                                                      {
                if ($($(".badge.badge-points.point-count").not(".consumed")[index]).text() != "")
                {
                    // Search card with filter service
                    $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().find(".mod-card-front").each(function(i){
                        if (filter.length > 0 || filterUser.length > 0)
                        {
                            checkUser($(this));
                            if (($.inArray($(this).text(), filter) >= 0 && bUser == true) || (filter.length == 0 && bUser == true))
                            {
                                $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                                return false;
                            }
                            else
                            {
                                $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().hide();
                            }
                        }
                        else
                        {
                            $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                            return false;
                        }
                    });
                }
                else
                {
                    $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().hide();
                }
            });
        });

        $("#onlyNotEstimate").click(function() {
            getFilter();
            $(".badge.badge-points.point-count").each(function(index){
                if ($($(".badge.badge-points.point-count").not(".consumed")[index]).text() == "")
                {
                    $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().find(".mod-card-front").each(function(i){
                        if (filter.length > 0 || filterUser.length > 0)
                        {
                            checkUser($(this));
                            if (($.inArray($(this).text(), filter) >= 0  && bUser == true)  || (filter.length == 0 && bUser == true))
                            {
                                $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                                return false;
                            }
                            else
                            {
                                $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().hide();
                            }
                        }
                        else
                        {
                            $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                            return false;
                        }
                    });
                }
                else
                {
                    $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().hide();
                }
            });
        });


        $("#all").click(function() {
            getFilter();
            $(".list-card-title").each(function(index){
                $(this).parent().find(".mod-card-front").each(function(i){
                    if (filter.length > 0 || filterUser.length > 0)
                    {
                        checkUser($(this));
                        if (($.inArray($(this).text(), filter) >= 0  && bUser == true)  || (filter.length == 0 && bUser == true))
                        {
                            $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                            return false;
                        }
                        else
                        {
                            $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().hide();
                        }
                    }
                    else
                    {
                        $($(".badge.badge-points.point-count").not(".consumed")[index]).parent().parent().parent().show();
                        return false;
                    }
                });
            });
        });
    });
})();