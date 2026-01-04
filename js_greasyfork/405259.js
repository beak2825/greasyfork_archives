// ==UserScript==
// @name         CSDN免登录
// @namespace    https://greasyfork.org/users/228931-system
// @version      0.3.4
// @description  CSDN免登录复制、自动展开、页面清洗、去除搜索词、移动端反APP、可选暗黑主题
// @run-at       document-start
// @author       System
// @match        *.csdn.net/*
// @license      GPL-3.0-only
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/405259/CSDN%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405259/CSDN%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 默认设置
    const defaultSettings={
        darksys:0,      //跟随系统
        darkmode:0,     //暗黑模式
        darkcode:0,     //暗黑代码块
    };
    const Settings=new Proxy(defaultSettings,{
        get(target,prop){return GM_getValue(prop)==null?target[prop]:GM_getValue(prop);},
        set(target,prop,value){GM_setValue(prop,value);return true;}
    })
    const style=document.createElement('style');
    document.documentElement.append(style);


    function genstyle(){

        const style=[
        `#recommend,.feed-Sign-weixin,#csdn-toolbar-write,.csdn-side-toolbar>:not(.option-box),.passport-login-tip-container,[class*=advert],.hide-preCode-box,.recommend-nps-box,.readall_box,.comment_read_more_box,.btn_open_app_prompt_div,.feed-Sign-span,.search-tag-box,.aside-header-fixed,.wap-shadowbox,.article-search-tip,#csdn-redpack,.csdn-reapck-select,.redpack-select-back,.toolbar-advert-default,.passport-login-container,[class^='banner-ad'],[id^='kp_box'],.post_feed_box,.signin,.more-toolbox,.right_box,div.container>nav,div.login-box,div.enterprise_blog,div.recommend-box,div.hide-article-box,aside,div#rightAside,div.write-guide,div.login-mark{display: none !important;}
        div.comment-list-box{max-height: unset !important;}
        div.article_content{height: auto !important;overflow:auto !important;}
        pre{height: auto !important;}
        main{margin: 0 auto !important;float: none !important;}
        main *,#main *{ max-height: unset !important;}
        #main{margin-top:0 !important;}
        body{min-width: 100% !important;}
        @media screen and (max-width: 1200px){
            .csdn-toolbar,.bottom-pub-footer  {
                display: none !important;
            }
        }
        #operate{height:auto !important;}
        #comment{max-height:none !important;}
        code,code *{user-select:text  !important;}

        `];
        if(Settings.darksys)
            style.push('@media (prefers-color-scheme: dark) {');
        if(Settings.darkmode){
                style.push(`:not([class*='hl']):not([class*='token']):not(code):not(pre):not(pre *):not([class*='pre-numbering']){ background-color:  #333 !important;color: white !important;};
                       code{color: black !important;}
                       .article_content .htmledit_views pre{ color: antiquewhite;}
                    `,
                    ".aliplayer-danmuku,.danmu,p.carousel-right-caption,.carousel-item .cover{background-color:unset !important;}");
            if(Settings.darkcode){
                style.push(`#content_views:not([class*=dark]) pre:not([class]) code,#content_views:not([class*=dark]) pre.prettyprint{filter:invert(1)}`)
            }


        }

        if(Settings.darksys)
            style.push('}');
        return style.join('\n');
    }
    function update(){style.innerHTML=genstyle();}
    update();

    const html=`
    <a class="option-box" data-type="app">
     <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" style=" fill:#888;"><path d="M 9.6660156 2 L 9.1757812 4.5234375 C 8.3516137 4.8342536 7.5947862 5.2699307 6.9316406 5.8144531 L 4.5078125 4.9785156 L 2.171875 9.0214844 L 4.1132812 10.708984 C 4.0386488 11.16721 4 11.591845 4 12 C 4 12.408768 4.0398071 12.832626 4.1132812 13.291016 L 4.1132812 13.292969 L 2.171875 14.980469 L 4.5078125 19.021484 L 6.9296875 18.1875 C 7.5928951 18.732319 8.3514346 19.165567 9.1757812 19.476562 L 9.6660156 22 L 14.333984 22 L 14.824219 19.476562 C 15.648925 19.165543 16.404903 18.73057 17.068359 18.185547 L 19.492188 19.021484 L 21.826172 14.980469 L 19.886719 13.291016 C 19.961351 12.83279 20 12.408155 20 12 C 20 11.592457 19.96113 11.168374 19.886719 10.710938 L 19.886719 10.708984 L 21.828125 9.0195312 L 19.492188 4.9785156 L 17.070312 5.8125 C 16.407106 5.2676813 15.648565 4.8344327 14.824219 4.5234375 L 14.333984 2 L 9.6660156 2 z M 11.314453 4 L 12.685547 4 L 13.074219 6 L 14.117188 6.3945312 C 14.745852 6.63147 15.310672 6.9567546 15.800781 7.359375 L 16.664062 8.0664062 L 18.585938 7.40625 L 19.271484 8.5917969 L 17.736328 9.9277344 L 17.912109 11.027344 L 17.912109 11.029297 C 17.973258 11.404235 18 11.718768 18 12 C 18 12.281232 17.973259 12.595718 17.912109 12.970703 L 17.734375 14.070312 L 19.269531 15.40625 L 18.583984 16.59375 L 16.664062 15.931641 L 15.798828 16.640625 C 15.308719 17.043245 14.745852 17.36853 14.117188 17.605469 L 14.115234 17.605469 L 13.072266 18 L 12.683594 20 L 11.314453 20 L 10.925781 18 L 9.8828125 17.605469 C 9.2541467 17.36853 8.6893282 17.043245 8.1992188 16.640625 L 7.3359375 15.933594 L 5.4140625 16.59375 L 4.7285156 15.408203 L 6.265625 14.070312 L 6.0878906 12.974609 L 6.0878906 12.972656 C 6.0276183 12.596088 6 12.280673 6 12 C 6 11.718768 6.026742 11.404282 6.0878906 11.029297 L 6.265625 9.9296875 L 4.7285156 8.59375 L 5.4140625 7.40625 L 7.3359375 8.0683594 L 8.1992188 7.359375 C 8.6893282 6.9567546 9.2541467 6.6314701 9.8828125 6.3945312 L 10.925781 6 L 11.314453 4 z M 12 8 C 9.8034768 8 8 9.8034768 8 12 C 8 14.196523 9.8034768 16 12 16 C 14.196523 16 16 14.196523 16 12 C 16 9.8034768 14.196523 8 12 8 z M 12 10 C 13.111477 10 14 10.888523 14 12 C 14 13.111477 13.111477 14 12 14 C 10.888523 14 10 13.111477 10 12 C 10 10.888523 10.888523 10 12 10 z"></path></svg>
      <span class="show-txt">脚本<br>设置</span>
      <div class="app-qr-box" style="right:-4px">
        <div class="bg-box" style="display: block;width: 180px;text-align: left;font-size: 14px;user-select: none;background: white;border-radius: 5px;border: 1px solid cadetblue;">
            <p style="text-align: center;"><strong>CSDN 暗黑模式调整</strong></p>
            <hr style="margin: 7px 0;">
            <p><label style="cursor: pointer; font-weight: normal; margin: 0;"><input type="checkbox" name="darkmode" style="margin: 0 10px;">暗黑模式</label></p>
            <p><label style="cursor: pointer; font-weight: normal; margin: 0;"><input type="checkbox" name="darksys" style="margin: 0 10px;">跟随系统</label></p>
            <p><label style="cursor: pointer; font-weight: normal; margin: 0;"><input type="checkbox" name="darkcode" style="margin: 0 10px;">暗黑代码框</label></p>
        </div>
      </div>
    </a>`;
    const div=document.createElement('div');
    div.innerHTML=html;
    const button=div.querySelector('a.option-box');
    const darkmode=div.querySelector('input[name="darkmode"]');
    const darkcode=div.querySelector('input[name="darkcode"]');
    const darksys=div.querySelector('input[name="darksys"]');
    darkmode.checked=Settings.darkmode;
    darkcode.checked=Settings.darkcode;
    darksys.checked=Settings.darksys;
    darkcode.disabled=!darkmode.checked;
    darksys.disabled=!darkmode.checked;
    darkmode.addEventListener('change',(e=>{Settings.darkmode=e.target.checked;darkcode.disabled=!e.target.checked;darksys.disabled=!e.target.checked;update();}));
    darkcode.addEventListener('change',(e=>{Settings.darkcode=e.target.checked;update();}));
    darksys.addEventListener('change',(e=>{Settings.darksys=e.target.checked;update();}));
    const setup=()=>{
        const bar=document.querySelector('.csdn-side-toolbar');
        if(bar&&bar.children[0]!=button)
            bar.insertBefore(button,bar.children[0]);
    }
    window.addEventListener('load',setup);
    document.addEventListener('copy',e=>e.stopImmediatePropagation(),true);

    const querySelectorAllAndSelf = (target, selector) => [...(target.matches(selector) ? [target] : []), ...target.querySelectorAll(selector)];
    new MutationObserver((mutations,observer)=>mutations.forEach(record=>record.addedNodes.forEach(target=>{
        if(target.nodeType==1){
            querySelectorAllAndSelf(target,'a[href*="so.csdn.net"]').forEach(link=>link.replaceWith(link.textContent));
        }
    }))).observe(document.documentElement,{subtree:true,childList:true});
})();