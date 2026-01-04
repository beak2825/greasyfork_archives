// ==UserScript==
// @name         gitlab-ci-batch
// @namespace    undefined
// @version      1.0
// @description  批量上线samza任务脚本
// @author       songyang
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @match        https://git.yidian-inc.com:8021/cpp-streaming/cpp-samza-*-ci/pipelines/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369674/gitlab-ci-batch.user.js
// @updateURL https://update.greasyfork.org/scripts/369674/gitlab-ci-batch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function finalFunc() {
        // css
        $(".left-margin")[0].style.width="600px";

        $.each( $(".left-margin .build"), function( key, value ) {

            $(value).css("width", "auto");
            $(value).css("height", "40px");

        });

        $.each( $(".left-margin .ci-job-component"), function( key, value ) {

            $(value).css("display", "inline-block");
            $(value).css("border", "1px solid #e5e5e5");
            $(value).css("background-color", " white");
            $(value).css("border-radius", "30px");
            $(value).css("height", "40px");
            $(value).css("padding", "8px 20px 10px 10px");

            $(value).find(".build-content")[0].style.border="0px";
            $(value).find(".build-content")[0].style.borderRadius="0px";
            $(value).find(".build-content")[0].style.padding="0px";
            $(value).find(".build-content")[0].style.width="auto";
            $(value).find(".build-content")[0].style.backgroundColor="transparent";


            $(value).find(".ci-status-text")[0].style.maxWidth="10000px";

            $(value).find(".ci-action-icon-container")[0].style.display="inline";
            $(value).find(".ci-action-icon-container")[0].style.position="static";
            $(value).find(".ci-action-icon-container")[0].style.right="";
            $(value).find(".ci-action-icon-container")[0].style.top="";
            $(value).find(".ci-action-icon-container")[0].style.border="0px";
            $(value).find(".ci-action-icon-container")[0].style.borderRadius="0px";
            $(value).find(".ci-action-icon-container")[0].style.marginLeft="8px";
            $(value).find(".ci-action-icon-container")[0].style.backgroundColor="transparent";

            $(value).find(".ci-action-icon-container svg")[0].style.top="0px";

            //console.log($(value).find(".ci-status-text"));
        });

        // click logic
        var selects = []
        $("a[data-original-title*='manual']").click(function() {
            var link = this.href + "/play";
            console.log("you found one " + link);
            var index = $.inArray(link, selects);
            if (index == -1) {
                selects.push(link);
                $(this).parent("div").css("background-color", "yellow");
            } else {
                selects.splice(index, 1);
                $(this).parent("div").css("background-color", "white");
            }
            return false;
        });

        $("div.content-wrapper").append('<div style="text-align: center"><button type="button" class="btn" id="submit-batch" style="width: 888px; background-color: green; height: 100px; border-radius: 30px">批量上线</button></div>');
        $("#submit-batch").click(function() {
            $.each(selects, function(index, val){
                console.log("index is " + index + ", val is " + val);
                var csrf_token = $('meta[name="csrf-token"]').attr('content');
                $.ajax({
                    url: val,
                    type: "post",
                    headers: {
                        'x-csrf-token': csrf_token
                    }
                });
            });
        })
    }

    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            console.log("wait 500ms");
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 500);
        }
    };

    waitForEl(".left-margin", finalFunc);
})();