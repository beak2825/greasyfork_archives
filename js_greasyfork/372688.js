// ==UserScript==
// @name         干死黄旭东
// @namespace    http://tampermonkey.net/
// @version      1.0
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @description  斗鱼我的关注第一个永远是黄旭东
// @author       jason19659
// @match        https://www.douyu.com/directory/myFollow
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/372688/%E5%B9%B2%E6%AD%BB%E9%BB%84%E6%97%AD%E4%B8%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/372688/%E5%B9%B2%E6%AD%BB%E9%BB%84%E6%97%AD%E4%B8%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list = $(".layout-Cover-list")
    var followli = " <li class=\"layout-Cover-item\">   <div class=\"layout-Cover-card\">"
        +"        <div class=\"DyLiveCover DyCareCover FollowList-cover  is-href\" hasvid=\"0\" showtime=\"1560751835\" tid=\"195\""
        +"            subdata=\"[object Object]\" delay=\"100\"><a href=\"/3484\" target=\"_blank\" class=\"DyLiveCover-wrap\">"
        +"                <div class=\"DyLiveCover-imgWrap\">"
        +"                    <div class=\"LazyLoad is-visible DyImg DyLiveCover-pic\"><img"
        +"                            src=\"https://rpic.douyucdn.cn/asrpic/180929/3484_1920.jpg/dy1\""
        +"                            class=\"DyImg-content is-normal \"></div>"
        +"                    <div class=\"DyLiveCover-superscript\"><span class=\"u-specIcon DyCareCover-addSpecCare is-add\""
        +"                            title=\"添加特别关注\"><i><svg>"
        +"                                    <use xlink:href=\"#add-spec_a520394\"></use>"
        +"                                </svg></i><i><svg>"
        +"                                    <use xlink:href=\"#add-spec-hover_ed50e1e\"></use>"
        +"                                </svg></i></span></div>"
        +"                </div>"
        +"                <div class=\"DyLiveCover-content\">"
        +"                    <div class=\"DyLiveCover-contentWrapper\">"
        +"                        <div class=\"DyLiveCover-avatartLeft\">"
        +"                            <div class=\"LazyLoad is-visible DyImg DyLiveCover-avatarImg\"><img"
        +"                                    src=\"https://apic.douyucdn.cn/upload/avatar/000/11/77/61_avatar_small.jpg?x-oss-process=image/format,webp\""
        +"                                    class=\"DyImg-content is-normal \"></div>"
        +"                        </div>"
        +"                        <div class=\"DyLiveCover-infoWrapper\">"
        +"                            <div class=\"DyLiveCover-info\"><span class=\"DyLiveCover-zone\">相声</span>"
        +"                                <h3 class=\"DyLiveCover-intro\" title=\"干死黄旭东\">干死黄旭东</h3>"
        +"                            </div>"
        +"                            <div class=\"DyLiveCover-info\"><span class=\"DyLiveCover-hot\"><svg"
        +"                                        class=\"DyLiveCover-hotIcon\">"
        +"                                        <use xlink:href=\"#icon-hot_889d4a1\"></use>"
        +"                                    </svg>99.9亿</span>"
        +"                                <h2 class=\"DyLiveCover-user\" title=\"旭东老仙，法力无边，奶死自己，就在今天！\">旭东老仙，法力无边，奶死自己，就在今天！</h2>"
        +"                            </div>"
        +"                        </div>"
        +"                    </div>"
        +"                </div>"
        +"            </a><a href=\"/3484\" target=\"_blank\"></a></div>"
        +"    </div></li>"

    var timer = setInterval(function() {
        list = $(".layout-Cover-list")
        if(list.length != 0) {
            list.prepend(followli)
            clearInterval(timer);
        }
    },100)


})();