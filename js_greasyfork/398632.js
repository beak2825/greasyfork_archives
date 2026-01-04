// ==UserScript==
// @name         知乎夜间模式,黑色主题
// @namespace    *.zhihu.com/*
// @version      1.0.0
// @description  知乎夜间模式
// @author       houguang@sina.cn
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        *.zhihu.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/398632/%E7%9F%A5%E4%B9%8E%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%2C%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/398632/%E7%9F%A5%E4%B9%8E%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%2C%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jquery = jQuery.noConflict();
    let css = `

.Switch {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ebebeb;
    display: inline-block;
    width: 48px;
    height: 28px;
    line-height: 28px;
    background-color: #ebebeb;
    border-radius: 20px;
    -webkit-transition: all .3s cubic-bezier(.35,0,.25,1);
    transition: all .3s cubic-bezier(.35,0,.25,1);
    cursor: pointer
}

html[data-theme=dark] .Switch {
    border: 1px solid #2e2e2e;
    background-color: #2e2e2e
}

.Switch--focused {
    outline: none;
    -webkit-transition: -webkit-box-shadow .3s;
    transition: -webkit-box-shadow .3s;
    transition: box-shadow .3s;
    transition: box-shadow .3s,-webkit-box-shadow .3s
}

html[data-focus-visible] .Switch--focused {
    -webkit-box-shadow: 0 0 0 2px #fff,0 0 0 4px rgba(0,132,255,.3);
    box-shadow: 0 0 0 2px #fff,0 0 0 4px rgba(0,132,255,.3)
}

html[data-theme=dark][data-focus-visible] .Switch--focused {
    -webkit-box-shadow: 0 0 0 2px #1a1a1a,0 0 0 4px rgba(58,118,208,.6);
    box-shadow: 0 0 0 2px #1a1a1a,0 0 0 4px rgba(58,118,208,.6)
}

.Switch:after {
    position: absolute;
    left: 4px;
    top: 3px;
    content: " ";
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    -webkit-box-shadow: 0 1px 3px rgba(26,26,26,.26);
    box-shadow: 0 1px 3px rgba(26,26,26,.26);
    -webkit-transition: left .3s cubic-bezier(.35,0,.25,1);
    transition: left .3s cubic-bezier(.35,0,.25,1)
}

html[data-theme=dark] .Switch:after {
    background: #ebebeb;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.26);
    box-shadow: 0 1px 3px rgba(0,0,0,.26)
}

.Switch--checked {
    background: #0084ff
}

html[data-theme=dark] .Switch--checked {
    background: #3a76d0
}

.Switch--checked:after {
    left: 22px
}

.Switch--disabled {
    cursor: no-drop
}

.Switch--disabled:after {
    background: #d3d3d3
}

html[data-theme=dark] .Switch--disabled:after {
    background: #444
}

.Switch--disabled.Switch--checked {
    opacity: .4
}

.Switch--small {
    border: none;
    height: 20px;
    width: 32px
}

.Switch--small:after {
    -webkit-box-shadow: none;
    box-shadow: none;
    height: 18px;
    left: 1px;
    top: 1px;
    width: 18px
}

.Switch--small.Switch--checked:after {
    left: 13px
}

.Switch-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    clip: rect(0,0,0,0);
    pointer-events: none;
    position: absolute
}

.css-switch-theme{box-sizing:border-box;margin:0;min-width:0;
margin-right: 40px;
    height: 22px;
}

/*视频评论文字颜色*/
.CommentRichText,.UserLink-link {color:#999999;}
`;
    GM_addStyle(css);
    setInterval(function(){
            let theme = GM_getValue("theme","light");
            document.getElementsByTagName("html")[0].dataset.theme = theme;

            if(theme === "dark"){
                jquery(".diy-theme-switch").addClass("Switch--checked");
            }else{
                jquery(".diy-theme-switch").removeClass("Switch--checked");
            }
        },30);
    jquery(function(){
        let switch_html = `<div class="css-switch-theme"><label class="Switch Switch--small diy-theme-switch"><input type="checkbox" class="Switch-input"></label></div>`;
        jquery(".AppHeader-userInfo,.ColumnPageHeader-Button").prepend(switch_html);
        jquery(document).on('click','.diy-theme-switch',function(){
            let _this = jquery(this);
            if(_this.hasClass("Switch--checked")){
                _this.removeClass("Switch--checked");
                document.getElementsByTagName("html")[0].dataset.theme = "light";
                GM_setValue("theme","light");
            }else{
                _this.addClass("Switch--checked");
                document.getElementsByTagName("html")[0].dataset.theme = "dark";
                GM_setValue("theme","dark");
            }
            return false;
        })
    });
})();