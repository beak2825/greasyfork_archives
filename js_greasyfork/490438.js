// ==UserScript==
// @name         知乎显示作者和发布时间
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  RT
// @author       Rain
// @match        https://www.zhihu.com/*
// @grant        none
// @icon         https://static.zhihu.com/static/img/favicon.ico
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-dateFormat/1.0/jquery.dateFormat.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490438/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BA%E4%BD%9C%E8%80%85%E5%92%8C%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/490438/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BA%E4%BD%9C%E8%80%85%E5%92%8C%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var question = $('.QuestionPage');
    var dateCreated = question.find('meta[itemprop="dateCreated"]').attr('content');
    var titleLabel = question.find('.QuestionHeader-title');

    var questions = JSON.parse($("#js-initialData").text()).initialState.entities.questions
    var authorInfo = questions[Object.keys(questions)[0]].author

    var nameExt = ""
    if (authorInfo.headline != "" ) {
        nameExt = "&nbsp;&nbsp; | &nbsp;&nbsp;" + authorInfo.headline
    }

    titleLabel.after(`<div class="AuthorInfo">
             <span class="UserLink AuthorInfo-avatarWrapper">
              <div class="css-1gomreu">
               <a href="//www.zhihu.com/people/${authorInfo.urlToken}" target=_blank class="UserLink-link" data-za-detail-view-element_name="User">
                <img class="Avatar AuthorInfo-avatar css-1hx3fyn" src="${authorInfo.avatarUrl}" alt="">
               </a>
              </div>
             </span>
             <div class="AuthorInfo-content"><div class="AuthorInfo-head">
               <span class="UserLink AuthorInfo-name">
                 <div class="css-1gomreu">
                   <a href="//www.zhihu.com/people/${authorInfo.urlToken}" target=_blank class="UserLink-link" data-za-detail-view-element_name="User">
                     ${authorInfo.name}<span style="font-size: 10px; font-weight: 300">${nameExt}<span>
                   </a>
                 </div>
               </span>
             </div>
             <div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="ztext AuthorInfo-badgeText css-14ur8a8">
             发布于 ${formatDate(dateCreated)}
             </div>
            </div>
           </div>
          </div>
         </div>`);


    function formatDate(inputDate){
        // 将UTC时间转换为当地时间
        var dt = new Date(inputDate);
        var localDate = new Date(dt.getTime());
        return $.format.date(localDate, "yyyy-MM-dd HH:mm");
    }
})();