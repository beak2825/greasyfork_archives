// ==UserScript==
// @name         知乎回答独立显示
// @namespace    KDX Group
// @version      1.3
// @description  沉浸式看知乎编的故事
// @author       AceKadoce
// @match        https://www.zhihu.com/question/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472317/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E7%8B%AC%E7%AB%8B%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/472317/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E7%8B%AC%E7%AB%8B%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    let reset = () => {
        $(".Question-sideColumn").remove();
        $(".Question-main").css("width", "800px");
        $(".Question-main").css("margin", "0 auto");
        $(".Question-mainColumn").css("width", "100%");

        let containerDiv = $(".Question-mainColumn").children();
        let contentDiv = null;
        if(containerDiv.length == 1){
            contentDiv = containerDiv[0];
        }else{
            for(let i = 0; i < containerDiv.length; i++){
                let preDiv = containerDiv[i];
                let handler = $(preDiv);
                let className = handler.attr('class');
                if(className == null){
                    continue;
                }
                if(className.search('AnswerCard') >= 0){
                    contentDiv = preDiv;
                }else if(className.search('MoreAnswers') >= 0){
                    handler.remove();
                }
            }
        }

        if(contentDiv != null){
            let contentChildren = $(contentDiv).children();

            for(let i = 0; i < contentChildren.length; i++){
                let preDiv = contentChildren[i];
                let handler = $(preDiv);
                console.log(handler.attr('class').search('QuestionInvitation'));

                if(handler.attr('class').search('QuestionInvitation') >= 0){
                    handler.remove();
                }else if(handler.attr('id') != 'QuestionAnswers-answers'){
                    let className = handler.attr("class");
                    if(className.startsWith('Card') && className.length > 4){
                        $(handler).css("position", "fixed");
                        $(handler).css("bottom", "10px");
                        $(handler).css("left", "10px");
                        $(handler).css("z-index", "10");
                        $(handler).css("max-width", "400px");

                        let progressItemContentDiv = $(handler).children("div")[1];
                        $(progressItemContentDiv).css("max-height", "700px");
                        $(progressItemContentDiv).css("overflow-y", "scroll");
                    }
                }
            }
        }

        $('.RichContent-actions').css('width', '800px');
        $('.RichContent-actions').css('left', $('.Question-mainColumn').offset().left + 'px');
        $(".ContentItem-meta .AuthorInfo").css('max-width', '800px');
    }

    $(() => {
        reset();
        $(".ViewAll a").click(function(e){
            console.log(this)
            e.preventDefault();
            let link = $(this).attr("href");
            window.location.href = link;
        })

        $(document).scroll(() => {
            $(".ContentItem-meta .AuthorInfo").css('max-width', '800px');
        })
    })
})();