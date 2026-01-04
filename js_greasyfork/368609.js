// ==UserScript==
// @name     github Git2It
// @version    0.0.5
// @description  Put "git clone https://github.com/*/*.git" into page.
// @author     1xin
// @require     http://code.jquery.com/jquery-latest.js
// @noframes
// @match    *://github.com/*
// @grant    GM_addStyle
// @grant    GM.getValue
// @grant    GM_setClipboard
// @namespace https://greasyfork.org/users/183871
// @downloadURL https://update.greasyfork.org/scripts/368609/github%20Git2It.user.js
// @updateURL https://update.greasyfork.org/scripts/368609/github%20Git2It.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#next_video_btn{color:#fa7d3c;}');
    //获取下一个视频地址
    //getUrl()获取下一个视频地址
    var getUrl = {
        getGitUrl:function(){
            var git_url;
            var input_lable=$("div.clone-options.https-clone-options > div > input");
            git_url=input_lable.attr("value");
            return git_url;
        }
    };

    //增加下一个按钮，防止程序出错
    //addNextButton()增加下一个视频按钮
    //toNextButton()转到下一个视频地址
    //addTips()提示信息
    var addButton={
        thisButton:null,
        addButton:function(){
            var next_btn_html = '';
            next_btn_html += '<a class="btn btn-sm BtnGroup-item" id ="me">';
            next_btn_html +='<font color="red">';
            next_btn_html += 'Git Clone It';
            next_btn_html +='</font>';
            next_btn_html += '</a>';
            //增加下一个视频按钮
            var flag_tag = $("div.BtnGroup > form");
            if (flag_tag) {
                flag_tag.append(next_btn_html);
            }
        },
        buttonClick:function(gitUrl){
            $("#me").click(function(){
                alert("Copy to clipboard!");
                GM_setClipboard(gitUrl, 'text');
            });
        }
    };
    var t="git clone " + getUrl.getGitUrl();
    addButton.addButton();
    addButton.buttonClick(t);
})();