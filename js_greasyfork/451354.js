// ==UserScript==
// @name         Bilibili【哔哩哔哩】 用户成分标签
// @namespace    lycoris
// @version      2.6.2
// @description  根据 Bilibili 用户近期动态、粉丝勋章内容检测成分添加自定义标签，按规则屏蔽评论
// @author       Lyzoris
// @supportURL   https://github.com/lyzoris/Bilibili-UserComponentTag
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue 
// @grant        GM_listValues
// @grant        GM_setClipboard
// @require      https://greasyfork.org/scripts/448895-elementgetter%E5%BA%93/code/ElementGetter%E5%BA%93.js?version=1106656
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451354/Bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%20%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/451354/Bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%20%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==
(function () {
    "use surict";
    const elmGetter = new ElementGetter();
    const Cookie = document.cookie;
    const goOldVideo = Cookie.match(/(?<=go_old_video=)[-\d]{1,2}/);
    let isNew = true;
    if (Cookie && goOldVideo) {
        isNew = goOldVideo[0] === '-1';
    }
    let Page = '';
    const webType = { '^https:\/\/www.bilibili.com[\/]$': 'Main', 'https:\/\/(t|space).bilibili.com': 'Dynamic', 'https:\/\/www.bilibili.com\/video': 'Video' };
    Object.keys(webType).map(urlReg => { if (RegExp(urlReg).test(location.href)) {
        Page = webType[urlReg];
    } });
    const ApiUrl = {
        blog: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=',
        concerns: 'https://api.bilibili.com/x/relation/followings?vmid=',
        medal: 'https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id='
    };
    const childTagReg = new RegExp(/^(\[.*?\])(\[.*?\])*(\[.*?\])$/);
    const tagClassHide = {
        true: '.tag-class {display:none;}',
        false: '.tag-class {display:flex;}'
    };
    const Style_tagClassHide = elmGetter.create(`<style>${tagClassHide.false}</style>`);
    const ScriptStyle_STR = `
    <style>
   .adblock-tips{display:none!important}.userTag{display:inline-block;position:relative;text-align:center;border-width:0px;vertical-align:sub;margin-left:4px;margin-right:4px;cursor:default}.tag-name{border-color:rgba(169,195,233,0.1803921568627451);color:rgba(87,127,184,1);background-color:#9ebae833;float:left;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;border-width:0.5px;border-style:solid;border-bottom-left-radius:1px;border-top-left-radius:1px;height:16px}.tag-class{position:relative;border-bottom-right-radius:1px;border-top-right-radius:1px;float:left;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;box-sizing:content-box;border-width:0.5px;border-color:#f25d8e;border-style:solid;border-bottom-left-radius:1px;border-top-left-radius:1px;color:#f25d8e;height:16px}.tag-font{font-weight:400;font-size:10px}
   .script-hide{position:fixed;right:10px;bottom:10px;width:20px;height:20px;font-size:15px;line-height:20px;text-align:center;color:#009688;background-color:#e2e1e2b3;border-radius:5px;box-shadow:2px 0px 4px 0px #0000002b}.script-hide svg{width:100%;height:100%;vertical-align:unset}.script-hide:hover{background-color:#76cb9dc9;box-shadow:2px 0px 4px 0px #76cb9d91}.script-hide:hover svg path{fill:#ffffff}.script-like{display:none;position:fixed;right:10px;bottom:40px;width:20px;height:20px;font-size:15px;line-height:26px;text-align:center;color:#009688;background-color:#e2e1e2b3;border-radius:5px;box-shadow:2px 0px 4px 0px #0000002b}.script-like:hover{background-color:#76cb9dc9;box-shadow:2px 0px 4px 0px #76cb9d91}.script-like svg{width:80%;height:80%;margin-left:1px;vertical-align:unset}.script-like:hover svg path{fill:#ffffff}
   .tagbar-active{background-color:#ab85d1c9;box-shadow:2px 0px 4px 0px #c893e291}.tagbar-active svg path{fill:#ffffff}.script-main{display:none;position:fixed;z-index:999;right:65px;bottom:20px;background-color:#ffffff;color:#929292;height:320px;width:270px;border-radius:4px;box-sizing:border-box;box-shadow:0px 0px 4px 2px #0000002b;padding:10px}svg.icon{width:10px;height:10px}.tagbar-action{position:absolute;top:2px;width:15px;height:15px;line-height:15px;margin:0;border-radius:50%;background-color:#fff0;text-align:center;font-size:small;color:#929292}.script-main input[type="checkbox"],input[type="radio"]{appearance:auto}.tagbar-btn{background-color:#ffffff;color:#929292;height:20px;margin:5px 0px 5px 0;padding:0 4px 0 4px;border:none;border-radius:4px;font-weight:bold;transform-origin:center;transform:scale(0.9) translate(-10%,-10%);font-size:13px;text-align:center;box-shadow:#b1b1b13d 0px 0px 3px 2px}
   .tagbar-btn:hover{color:#37a279ab}.tagbar-btn:active{color:#b4b6ee}.input-tag,#input-comment-reg{margin-bottom:4px;width:74%;left:20%;border-radius:4px;border:solid 1px #b0b0b0}.input-tag:focus,#input-comment-reg:focus{outline:none;background-color:#d5d5d559}.tagbar-label{font-size:12px;display:inline-block;margin-right:10px}#input-tagcolor{width:52px;height:20px;border-radius:4px;border:solid 1px #b0b0b0}.tags{display:inline-block;width:40px;height:20px;font-size:12px;border-radius:5px;color:#49414b;text-align:center;transform-origin:center;transform:scale(0.9) translate(-10%,-10%);line-height:20px;background-color:#ededed;margin-top:5px;margin-left:5px;cursor:pointer;box-shadow:0px 1px 5px 0 #00000033}.tags:hover{background-color:#ced1d2c4}.delete-tag{position:relative;top:-3px;right:0;width:20px;height:20px;border-radius:50%;transform-origin:center;transform:scale(0.6) translate(-50%,-50%);font-size:20px;color:#ffffff00;line-height:18px;background-color:#ffffff00}
   .delete-tag:hover{color:white!important;background-color:crimson!important}.tags:hover > .delete-tag{color:#434343fa;background-color:#bbb5b54d}.tag-info{position:relative;margin-top:-20px;line-height:unset;font-weight:bold}.scriptBar{display:flex;flex-direction:column;margin-top:25px;height:92%}.tagbar-taglist,.tagbar-commentlist{margin-top:5px;width:100%;flex:auto;bottom:0px;border-radius:4px;background-color:rgb(243,238,233);overflow-y:auto;padding:4px;box-sizing:border-box}.tagbar-taglist::-webkit-scrollbar,.tagbar-commentlist::-webkit-scrollbar,.medal-table::-webkit-scrollbar,#import-area::-webkit-scrollbar{width:4px;height:4px}
   .tagbar-taglist::-webkit-scrollbar-thumb,.tagbar-commentlist::-webkit-scrollbar-thumb,.medal-table::-webkit-scrollbar-thumb,#import-area::-webkit-scrollbar-thumb{border-radius:5px;box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:rgba(0,0,0,0.2)}.tagbar-taglist::-webkit-scrollbar-track,.tagbar-commentlist::-webkit-scrollbar-track,.medal-table::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:0px;background:rgba(0,0,0,0.1)}.tagSize{margin:5px 0 5px 0}.tagSize-label{display:inline-block;text-align:center}.tagSize-radio{vertical-align:text-bottom}.set-label{font-size:12px;display:inline-block;margin:5px 0 5px 0}.medalTag{margin-left:5px;cursor:pointer}.medal-table{display:none;position:absolute;padding:5px;max-width:230px;max-height:160px;overflow-y:auto;font-size:12px;background-color:#fffefd;border-radius:5px;cursor:default;z-index:2;box-shadow:0px 0px 4px 2px #0000002b}
   .fans-tag{float:left;margin:4px 4px 4px 4px;border:solid 1px #6a99de;border-radius:2px}.fans-tag .tag-name{border:none;width:18px}#import-area{font-size:10px;margin:10px 0 0 0;max-width:244px;min-width:244px;height:40px;min-height:20px;max-height:40px;background-color:#f3f3f3;border-radius:5px}#import-area:focus{outline:none}.topnav{top:8px;left:5px;height:20px;line-height:20px;position:absolute;color:#8e8e8e;background-color:#ddddd98c;border-radius:4px;cursor:default}.topnav-active{color:#dd7a7a;background-color:#ffffff;border-radius:4px;height:16px;line-height:16px;box-shadow:0 0 3px 1px #3f3d3d80}.topnav-option{display:inline-block;font-size:12px;font-weight:bold;padding:0 5px 0 5px}.topnav-option:nth-child(2){margin:0 38px 0 38px}#dynamic-like svg{width:25px;height:25px;margin:0 0 0 25px}#dynamic-like:hover svg path{fill:#19aada}
   .search-btn{display:inline-block;font-size:15px;background-color:#eef1f3;color:#377f79b3;width:44px;border-radius:10px;text-align:center;margin:0 5px 0 5px!important;transform:scale(0.8) translate(-15%,0%);box-shadow:none;cursor:default}.search-btn:hover{color:#9c27b0;box-shadow:0px 0px 3px 1px #33323229}.block-btn{margin:0 20px 0 20px;cursor:pointer}.block-btn:hover{color:#00aeec}.search-btn:active{color:#dd4438}.close-btn{text-align:center;font-size:14px;color:#99a2aa;border-top:1px solid #e5e9ef;margin:0;overflow:hidden;padding:12px 0 10px;position:relative}.close-btn a{color:#99a2aa!important}.close-btn a:hover{color:#e132c2!important}#detectionMode,#blockUser{display:inline-block;font-size:14px;font-weight:bold;text-align:center;width:250px;margin:4px 0 8px 0;cursor:default}#detectionMode-input,#blockUser-input{display:none}
   #detectionMode-label{display:inline-block;width:50px;height:16px;border-radius:16px;background:#4fb153;border:1px solid #eee;cursor:pointer;position:relative;overflow:hidden;margin:0 8px 0 8px;vertical-align:text-bottom}#detectionMode-label::before,#blockUser-label::before{display:block;content:'';width:16px;height:16px;border-radius:50%;background:white;position:absolute;left:0px;top:50%;transform:translateY(-50%);transition:all .3s}#detectionMode-label::after{display:block;content:'';width:0;height:100%;background:#2695dc;transition:all .3s;border-radius:10px}#detectionMode-manual{color:#4fb153}#detectionMode-input:checked ~ #detectionMode-label::before{left:34px}#detectionMode-input:checked ~ #detectionMode-label::after{width:100%}#detectionMode-input:checked ~ #detectionMode-auto{color:#2695dc}#detectionMode-input:checked ~ #detectionMode-manual{color:#929292}
   #blockUser-label{display:inline-block;width:50px;height:16px;border-radius:16px;background:#929292;border:1px solid #eee;cursor:pointer;position:relative;overflow:hidden;margin:0 8px 0 8px;vertical-align:text-bottom}#blockUser-label::after{display:block;content:'';width:0;height:100%;background:#4fb153;transition:all .3s;border-radius:10px}#blockUser-input:checked ~ #blockUser-label::before{left:34px}#blockUser-input:checked ~ #blockUser-label::after{width:100%}#blockUser-input:checked ~ #blockUser-manual{color:#4fb153}#reg-ruler:hover{color:#81afc5}#reg-ruler:active{color:#cc6d89}#detect-page{height:5px;width:100px}#offset-page{padding-left:20px}
    </style>
    `;
    const ScriptBody_STR = `
    <div id='Script-Body'>
        <div class='script-like'>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z" fill="#459cdd"></path>
            </svg>
        </div>
        <div class='script-hide'>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M593.949942 770.425747c2.908236-4.233418 4.614088-9.380648 4.614088-14.892175s-1.705851-10.658757-4.614088-14.922874L431.084621 577.00041c-10.32209-10.324136-10.32209-27.042913 0-37.381375l158.601204-159.117974c5.376451-4.843308 8.771781-11.818163 8.771781-19.61371 0-14.602579-11.83249-26.433022-26.434046-26.433022-5.953595 0-11.420097 1.979074-15.835663 5.298679l-5.300726 5.299703L375.020744 520.936533c-20.650319 20.647249-20.650319 54.114478 0 74.763774l177.556928 177.590698 1.811252 1.794879c4.690836 4.264117 10.903328 6.884804 17.740036 6.884804C581.18829 781.968641 589.183382 777.399579 593.949942 770.425747z" fill="#009688"></path>
            </svg>
        </div>
        <div class='script-main'>
            <div class="topnav">
                <div class="topnav-option topnav-active" index=1 id="tag-btn">成分标签</div>
                <div class="topnav-option" id="comment-btn" index=2>评论屏蔽</div>
                <div class="topnav-option" id="setting-btn" index=0>脚本设置</div>
            </div>
            <div class="scriptBar setting-bar" style="display:none;">
                <div class="inputBar">
                    <input type="button" class="tagbar-btn" id="export-tag" value="导出配置" title="导出标签配置到剪切板" style="float:left; margin:0;">
                    <input type="button" class="tagbar-btn" id="import-tag" value="导入配置" title="导入配置到油猴存储&#10;请先将配置粘贴到下方并确认无误，再点击本按键&#10;导入配置后请刷新界面以应用配置" style="float:right; margin:0;">
                </div>
                <textarea id="import-area" placeholder="请在此处粘贴配置后点击【导入配置】"></textarea>
                <label class="set-label" title="用户标签检测内容（可多选）">检测选项
                    <label for="detect-repost" title="检测用户转发的动态内容（建议开启）" style="margin-left:20px">转发动态
                        <input type="checkbox" id="detect-repost" style="margin-left:5px;height:11px">
                    </label>
                    <label for="detect-concerns" title="检测用户关注列表" style="margin-left:20px">关注列表
                        <input type="checkbox" id="detect-concerns" style="margin-left:5px;height:11px">
                    </label>
                    <label for="detect-medal" title="检测用户的粉丝勋章&#10;开启后用户标签末尾出现【勋章】标签，&#10;点击【勋章】展开勋章栏显示所有勋章&#10;鼠标放上显示对应Up主，点击可跳转&#10;点击【勋章】或空白处收起" style="margin-left:72px">
                        粉丝勋章<input type="checkbox" id="detect-medal" style="margin-left:8px;height:11px">
                    </label>
                </label>
                <label class="set-label" for="detect-page" title="检测用户动态和关注列表页数&#10;越大加载时间越长">检测页数<span id="offset-page">1</span><input type="range" id="detect-page" value=1 max=10 min=1 step=1 style="margin-left:50px;height:11px"></label>
                <label class="set-label" for="tagClass-hide" title="不显示标签分类，建议开启&#10;出现标签样式错误时请开启此项">标签不显示分类<input type="checkbox" id="tagClass-hide" style="margin-left:50px;height:11px"></label>
                <label class="set-label" for="tag-merge" title="相同类型标签合并，只显示一个标签分类&#10;可能影响标签样式，建议同时打开【标签不显示分类】">同类型标签合并<input type="checkbox" id="tag-merge" style="margin-left:50px;height:11px"></label>
                <label class="set-label" for="link-delete" title="去除 评论区评论关键词蓝色点击跳转">去除关键词跳转<input type="checkbox" id="link-delete" style="margin-left:50px;height:11px"></label>
                <label class="set-label" for="close-comment" title="动态评论末尾添加【收起评论】按键">动态添加收起评论<input type="checkbox" id="close-comment" style="margin-left:38px;height:11px"></label>
                <label class="set-label" for="dynamic-btn" title="动态页面添加【批量点赞】按键">动态页批量点赞<input type="checkbox" id="dynamic-btn" style="margin-left:50px;height:11px"></label>
            </div>
            <div class="scriptBar tag-bar">
                <div class="inputBar">
                    <div id="detectionMode">
                        <input type="checkbox" id="detectionMode-input">
                        <span id="detectionMode-manual" title="手动点击‘检测’以检测用户标签&#10;请求量较少，比较安全">手动检测</span>
                        <label for="detectionMode-input" id="detectionMode-label"></label>
                        <span id="detectionMode-auto" title="自动检测所有评论用户标签&#10;请求量较大，存在封号风险">自动检测</span>
                    </div>
                    <label class="tagbar-label" for="input-tagname" title="标签的分类，比如游戏、Vtuber、主播、UP主等&#10;用来识别标签类型，尽量短一些">标签分类</label><input type="text" id="input-tagname" index=0 class="input-tag" autocomplete="off">
                    <label class="tagbar-label" for="input-tagtext" title="标签具体显示的内容，以区别每个标签">标签内容</label><input type="text" id="input-tagtext" index=1 class="input-tag" autocomplete="off">
                    <label class="tagbar-label" for="input-tagreg" title="匹配用户标签的关键词，使用 & 和 | 分隔，使用 ( ) 组合&#10;多关键词任一匹配：王者荣耀或王者 -&gt; 王者荣耀|王者 &#10;多关键词同时匹配：王者荣耀与吃鸡 -&gt; 王者荣耀&吃鸡 &#10;多关键词组合匹配：(王者|王者荣耀)&(吃鸡|和平精英)&#10;&#10;合并标签时填写 [子标签内容][子标签内容] 如[王者][原神]&#10;注意：面板中合并标签需在所有子标签之后">标签规则</label><input type="text" id="input-tagreg" index=2 class="input-tag" autocomplete="off">
                    <label class="tagbar-label" for="input-tagcolor" title="标签文字颜色，可在面板中预览">标签颜色</label><input type="color" name="" id="input-tagcolor">
                    <label class="tagbar-label" style="margin: 0 18px 0 10px ;" for="tag-hide" title="屏蔽该标签用户评论">屏蔽评论<input type="checkbox" id="tag-hide" style="margin-left:9px;height:11px"></label>
                    <input type="button" class="tagbar-btn" id="add-tag" value="+" style="width:30px">
                </div>
                <div class="tagbar-taglist"></div>
            </div>
            <div class="scriptBar comment-bar" style="display:none;">
                <div class="inputBar">
                    <label class="set-label" title="点击开启指定屏蔽功能（可多选）&#10;在对应页面生效">屏蔽选项
                        <label for="block-video" title="【主页】按规则屏蔽主页推荐视频" style="margin-left:20px">主页推荐
                            <input type="checkbox" id="block-video" style="margin-left:5px;height:11px">
                        </label>
                        <label for="block-dynamic" title="【动态、空间页】按规则屏蔽用户动态内容" style="margin-left:20px">用户动态
                            <input type="checkbox" id="block-dynamic" style="margin-left:5px;height:11px">
                        </label>
                        <label for="block-comment" title="【视频页】按规则屏蔽用户评论" style="margin-left:72px">
                            评论内容<input type="checkbox" id="block-comment" style="margin-left:8px;height:11px">
                        </label>
                        <label for="block-user" title="【动态、视频页】需先打开 “评论内容” 选项&#10;点击 “屏蔽” 按键以手动屏蔽用户&#10;同时添加用户id到黑名单" style="margin-left:20px">
                            用户屏蔽<input type="checkbox" id="block-user" style="margin-left:8px;height:11px">
                        </label>
                    </label>
                    <label class="tagbar-label" for="input-comment-reg" id="reg-ruler" title="正则表达式屏蔽规则&#10;可屏蔽首页视频推荐，用户动态，用户评论&#10;不了解正则表达式？按Alt点击跳转学习">屏蔽规则</label><input type="text" id="input-comment-reg" autocomplete="off" style="width:64%;">
                    <input type="button" class="tagbar-btn" id="add-comment-reg" style="float:right; margin:2px 0 5px 0; width:18px;" value="+">
                </div>
                <div class="tagbar-commentlist"></div>
            </div>
        </div>
    </div>`;
    const ScriptBody = elmGetter.create(ScriptBody_STR);
    const ScriptStyle = elmGetter.create(ScriptStyle_STR);
    const Head = document.head || document.querySelector('head');
    const Body = document.body || document.querySelector('body');
    Head.appendChild(ScriptStyle);
    Head.appendChild(Style_tagClassHide);
    Body.appendChild(ScriptBody);
    const scriptHide = ScriptBody.querySelector('.script-hide');
    const scriptMain = ScriptBody.querySelector('.script-main');
    const topNav = ScriptBody.querySelectorAll('.topnav-option');
    const scriptBar = ScriptBody.querySelectorAll('.scriptBar');
    const inputFields = ScriptBody.querySelectorAll('.input-tag');
    let tagClass_hide = ScriptBody.querySelector('#tagClass-hide');
    let tag_merge = ScriptBody.querySelector('#tag-merge');
    let detect_repost = ScriptBody.querySelector('#detect-repost');
    let detect_concerns = ScriptBody.querySelector('#detect-concerns');
    let detect_medal = ScriptBody.querySelector('#detect-medal');
    let detection_mode = ScriptBody.querySelector('#detectionMode-input');
    let detect_page = ScriptBody.querySelector('#detect-page');
    let offset_page = ScriptBody.querySelector('#offset-page');
    let link_delete = ScriptBody.querySelector('#link-delete');
    let close_comment = ScriptBody.querySelector('#close-comment');
    let import_area = ScriptBody.querySelector('#import-area');
    let tag_name = ScriptBody.querySelector('#input-tagname');
    let tag_text = ScriptBody.querySelector('#input-tagtext');
    let tag_reg = ScriptBody.querySelector('#input-tagreg');
    let tag_color = ScriptBody.querySelector('#input-tagcolor');
    let add_tag = ScriptBody.querySelector('#add-tag');
    let import_tag = ScriptBody.querySelector('#import-tag');
    let export_tag = ScriptBody.querySelector('#export-tag');
    let taglist = ScriptBody.querySelector('.tagbar-taglist');
    let tag_hide = ScriptBody.querySelector('#tag-hide');
    let add_comment = ScriptBody.querySelector('#add-comment-reg');
    let comment_reg = ScriptBody.querySelector('#input-comment-reg');
    let commentlist = ScriptBody.querySelector('.tagbar-commentlist');
    let dynamic_btn = ScriptBody.querySelector('#dynamic-btn');
    let script_like = ScriptBody.querySelector('.script-like');
    let reg_ruler = ScriptBody.querySelector('#reg-ruler');
    let block_user = ScriptBody.querySelector('#block-user');
    let block_comment = ScriptBody.querySelector('#block-comment');
    let block_dynamic = ScriptBody.querySelector('#block-dynamic');
    let block_video = ScriptBody.querySelector('#block-video');
    inputFields.forEach(e => {
        e.onkeyup = (event) => {
            let index = Number(event.target?.getAttribute('index'));
            if (['Enter', 'ArrowDown'].includes(event.key)) {
                index = index == 2 ? 0 : index + 1;
            } else if (event.key == 'ArrowUp') {
                index = index == 0 ? 2 : index - 1;
            }
            inputFields[index].focus();
        };
    });
    scriptHide.onclick = () => {
        if (scriptMain.style.display === 'block') {
            scriptMain.style.display = 'none';
            scriptHide.classList.remove('tagbar-active');
        } else {
            scriptMain.style.display = 'block';
            scriptHide.classList.add('tagbar-active');
        }
    };
    topNav.forEach(btn => {
        btn.onclick = () => {
            topNav.forEach(i => { i.classList.remove('topnav-active'); });
            btn.classList.add('topnav-active');
            scriptBar.forEach(i => { i.style.display = 'none'; });
            scriptBar[Number(btn.getAttribute('index'))].style.display = 'flex';
        };
    });
    reg_ruler.onclick = (event) => {
        event.altKey && window.open('https://gitee.com/thinkyoung/learn_regex');
    };
    block_user.onclick = () => {
        BlockOption.User = block_user.checked;
        GM_setValue('BlockOption', BlockOption);
    };
    block_video.onclick = () => {
        BlockOption.Video = block_video.checked;
        GM_setValue('BlockOption', BlockOption);
        if (block_video.checked && Page === 'Main') {
            mainPageBlock();
        }
    };
    block_dynamic.onclick = () => {
        BlockOption.Dynamic = block_dynamic.checked;
        GM_setValue('BlockOption', BlockOption);
        if (block_dynamic.checked && Page === 'Dynamic') {
            dynamicPageBlock();
        }
    };
    block_comment.onclick = () => {
        BlockOption.Comment = block_comment.checked;
        GM_setValue('BlockOption', BlockOption);
    };
    detection_mode.onclick = () => {
        AutoDetect = detection_mode.checked;
        GM_setValue('AutoDetect', AutoDetect);
    };
    dynamic_btn.onclick = () => {
        script_like.style.display = dynamic_btn.checked ? 'block' : 'none';
        GM_setValue('DynamicLike', dynamic_btn.checked);
    };
    script_like.onclick = dynamicBatchLike;
    tagClass_hide.onclick = () => {
        Style_tagClassHide.innerHTML = tagClassHide[String(tagClass_hide.checked)];
        GM_setValue('TagClassHide', tagClass_hide.checked);
    };
    detect_repost.onclick = () => {
        DetectOption.Repost = detect_repost.checked;
        GM_setValue('DetectOption', DetectOption);
    };
    detect_concerns.onclick = () => {
        DetectOption.Concerns = detect_concerns.checked;
        GM_setValue('DetectOption', DetectOption);
    };
    detect_medal.onclick = () => {
        DetectOption.Medal = detect_medal.checked;
        GM_setValue('DetectOption', DetectOption);
    };
    detect_page.onchange = () => {
        offset_page.innerText = detect_page.value;
        maxOffset = Number(detect_page.value);
        GM_setValue('MaxDetectPage', maxOffset);
    };
    tag_merge.onclick = () => {
        tagMerge = tag_merge.checked;
        GM_setValue('TagMerge', tagMerge);
    };
    link_delete.onclick = () => { GM_setValue('NoJump', link_delete.checked); };
    close_comment.onclick = () => {
        closeComment();
        GM_setValue('CloseComment', close_comment.checked);
    };
    add_tag.onclick = () => {
        if (tag_name.value && tag_text.value && tag_reg.value) {
            if (!/[\n\r"'{}、]/.test(tag_reg.value)) {
                addTag({
                    tag: tag_name.value,
                    text: tag_text.value,
                    reg: tag_reg.value,
                    color: tag_color.value,
                    hide: tag_hide.checked
                });
                tag_name.value = '';
                tag_text.value = '';
                tag_reg.value = '';
                tag_hide.checked = false;
            } else {
                alert(`标签规则不应该包含‘ “ 、" ' { } \\n \\r等字符`);
            }
        } else {
            alert('请将标签信息补充完整');
        }
    };
    add_comment.onclick = () => {
        if (comment_reg.value) {
            addKeyWord(comment_reg.value);
            comment_reg.value = '';
        } else {
            alert('请将关键词正则信息补充完整');
        }
    };
    function exportDataToClipboard() {
        let exportData = {};
        let key_storage = GM_listValues();
        key_storage.forEach(i => {
            exportData[i] = GM_getValue(i, null);
        });
        GM_setClipboard(JSON.stringify(exportData));
        alert('已导出标签数据到剪切板！');
    }
    function importDataToTemperMonkey() {
        if (import_area.value) {
            try {
                let importData = JSON.parse(import_area.value);
                Object.keys(importData).forEach(i => { GM_setValue(i, importData[i]); });
            }
            catch (e) {
                alert('导入配置出错，请检查配置项');
                return;
            }
            import_area.value = '';
            configInit();
        } else {
            alert('配置为空！请先在输入框粘贴配置并检查无误后点击【导入配置】');
        }
    }
    export_tag.onclick = exportDataToClipboard;
    import_tag.onclick = importDataToTemperMonkey;
    function addKeyWord(reg_text) {
        if (!keyword.includes(reg_text)) {
            let new_tag = insertTag(commentlist, reg_text);
            let keyword_index = Object.keys(temp_keyword).length;
            temp_keyword[keyword_index] = reg_text;
            keyword.push(reg_text);
            GM_setValue('Keyword', keyword);
            function deleteTag() {
                commentlist.removeChild(new_tag);
                delete temp_keyword[keyword_index];
                keyword = [];
                Object.keys(temp_keyword).map((key) => keyword.push(temp_keyword[key]));
                GM_setValue('Keyword', keyword);
            }
            ;
            new_tag.children[0].onclick = deleteTag;
            new_tag.children[1].ondblclick = () => {
                comment_reg.value = reg_text;
                deleteTag();
            };
        }
    }
    function addTag(tag_dic) {
        let new_tag = insertTag(taglist, tag_dic);
        let tag_index = Object.keys(tag).length;
        tag[tag_index] = tag_dic;
        tagList.push(tag, tag_index);
        function deleteTag() {
            taglist.removeChild(new_tag);
            delete tag[tag_index];
            let tag_temp = { ...tag };
            tag = {};
            Object.values(tag_temp).forEach((value, i) => { tag[i] = value; });
            tagList.pop(tag);
        }
        ;
        new_tag.children[0].onclick = deleteTag;
        new_tag.children[1].ondblclick = () => {
            tag_name.value = tag_dic.tag;
            tag_text.value = tag_dic.text;
            tag_reg.value = tag_dic.reg;
            tag_color.value = tag_dic.color;
            tag_hide.checked = tag_dic.hide;
            deleteTag();
        };
    }
    function insertTag(parentNode, tagInfo) {
        let title = '';
        let text = '';
        let color = '#1d1d1dbd';
        let border = 'none';
        if (typeof (tagInfo) === 'object') {
            if (childTagReg.test(tagInfo.reg)) {
                border = 'solid 1px #4fc3f7';
                title = `分类：${tagInfo.tag} （合并标签）&#10;子标签：${tagInfo.reg}&#10;隐藏评论：${tagInfo.hide}&#10;请放在待合并标签后`;
            } else {
                title = `分类：${tagInfo.tag}&#10;规则：${tagInfo.reg}&#10;隐藏评论：${tagInfo.hide}`;
            }
            text = tagInfo.text;
            color = tagInfo.color;
        } else {
            text = tagInfo;
        }
        let new_tag = elmGetter.create(`<div class="tags" style="color:${color}; width:${measureTextWidth("12px", text) + 8}px; border:${border}">
        <div class="delete-tag">x</div><p class="tag-info" title="${title}">${text}</p></div>`);
        parentNode.appendChild(new_tag);
        return new_tag;
    }
    function measureTextWidth(fontSize, text) {
        let fontFamily = 'PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif';
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = `${fontSize} ${fontFamily}`;
        let result = context.measureText(text);
        return result.width > 18 ? Math.ceil(result.width) : 18;
    }
    class Tag {
        constructor(tag_dic) {
            this.child_tag = [];
            this.tag_class = this.str2tagID(tag_dic.tag, 'class');
            this.text = tag_dic.text;
            this.tag_id = this.str2tagID(this.text, 'id');
            this.reg = Tag.multiReg(tag_dic.reg);
            this.hide = tag_dic.hide;
            this.tag_width = measureTextWidth('15px', tag_dic.tag);
            this.width = measureTextWidth('15px', this.text);
            this.list = new Set();
            this.nolist = new Set();
            this.childTag(tag_dic);
            this.tag_childNode = this.createElement(`<div class='tag-name ${this.tag_id}' style='color: ${tag_dic.color}; width:${this.width}px;'><div class='tag-font'>${this.text}</div></div>`);
            this.tagNode = this.createElement(`<div class='userTag ${this.tag_class}' title="${this.child_tag.join(' ')}"><div class='tag-class' style='border-color:#8da8e8;color:#5e80c4; width:${this.tag_width}px'><div class='tag-font'>${tag_dic.tag}</div></div><div class='tag-name ${this.tag_id}' style='color: ${tag_dic.color}; width:${this.width}px;'><div class='tag-font'>${this.text}</div></div></div>`);
        }
        createElement(dom_str) {
            return dom_str;
        }
        childTag(tag_dic) {
            if (childTagReg.test(tag_dic.reg)) {
                this.child_tag = tag_dic.reg.match(/(?<=\[)(.*?)(?=\])/g);
                let regs = [];
                tagList.list.filter(i => { if (this.child_tag.includes(i.text)) {
                    return i;
                } }).forEach(e => {
                    let new_reg = String(e.reg).match(/\((.*?)\){1,2}/g);
                    if (new_reg) {
                        regs.splice(0, 0, ...new_reg);
                    } else {
                        regs.push(`(?=.*(${String(e.reg).replace(/\//g, '')}))`);
                    }
                });
                this.reg = new RegExp(`^${regs.join('')}.*`);
            }
        }
        str2tagID(str, state) {
            let hex = '';
            for (let i = 0; i < str.length; i++) {
                hex += str.charCodeAt(i).toString(32);
            }
            return 'tag-' + state + '-' + hex;
        }
        static multiReg(query) {
            let regStr = query.indexOf('&') !== -1 ? `^${query.split('&').map(q => `(?=.*${q})`).join('')}.*` : query;
            return new RegExp(regStr);
        }
        checkUserTag(pid, userNode, replyNode) {
            if (this.list.has(pid)) {
                this.hide && removeUserComment(replyNode);
                if (!userNode.querySelector('.' + this.tag_id)) {
                    this.addUserTag(userNode);
                }
            }
        }
        detectNewUserTag(pid, userNode, replyNode, userInfo) {
            if (this.reg.test(userInfo)) {
                this.hide && removeUserComment(replyNode);
                if (!userNode.querySelector('.' + this.tag_id) && !this.list.has(pid) && !this.nolist.has(pid)) {
                    this.addUserTag(userNode);
                }
                this.combineChildTag(pid, userNode);
                this.list.add(pid);
            } else {
                this.nolist.add(pid);
            }
        }
        addUserTag(userNode) {
            if (userNode.querySelector('.' + this.tag_class) && tagMerge) {
                userNode.querySelector('.' + this.tag_class).innerHTML += this.tag_childNode;
            } else {
                userNode.innerHTML += this.tagNode;
            }
        }
        combineChildTag(pid, userNode) {
            if (this.child_tag.length != 0) {
                tagList.list.forEach(e => {
                    if (this.child_tag.includes(e.text)) {
                        let child_tag = userNode.querySelector('.' + e.tag_id)?.parentNode;
                        child_tag && userNode.removeChild(child_tag);
                        e.list.delete(pid);
                        e.nolist.add(pid);
                    }
                });
            }
        }
    }
    class TagList {
        constructor() {
            this.list = [];
        }
        push(tag, index) {
            this.list.push(new Tag(tag[index]));
            GM_setValue('Tag', tag);
        }
        pop(tag) {
            this.list = [];
            Object.values(tag).map(i => this.list.push(new Tag(i)));
            GM_setValue('Tag', tag);
        }
        checkUserInfo(pid, userNode, commentNode) {
            this.list.map(i => i.checkUserTag(pid, userNode, commentNode));
            if (DetectOption.Medal && this.isChecked(pid)) {
                this.addMedalWall(pid, userNode);
            }
        }
        isChecked(pid) {
            let tag0 = this.list[0];
            return (tag0.list.has(pid) || tag0.nolist.has(pid)) ? true : false;
        }
        detectNewUserInfo(pid, userNode, commentNode) {
            let p = [];
            const p1 = (resolve) => { Requests(ApiUrl.blog + pid, (data) => { resolve(data); }, 'blog', pid); };
            const p2 = (resolve) => { Requests(ApiUrl.medal + pid, (data) => { resolve(data); }, 'medal'); };
            const p3 = (resolve) => { Requests(`${ApiUrl.concerns}${pid}&pn=1&ps=50`, (data) => { resolve(data); }, 'concerns'); };
            if (DetectOption.Concerns && DetectOption.Medal) {
                p = [p1, p2, p3];
            } else if (DetectOption.Concerns && !DetectOption.Medal) {
                p = [p1, p3];
            } else if (!DetectOption.Concerns && DetectOption.Medal) {
                p = [p1, p2];
            } else {
                p = [p1];
            }
            Promise.all(p.map(i => new Promise(i))).then((result) => {
                this.list.map(i => i.detectNewUserTag(pid, userNode, commentNode, result.join('')));
                if (DetectOption.Medal && MedalShow) {
                    this.getMedalData(pid, userNode, result[1]);
                }
            }).catch(error => { console.log(error); });
        }
        getMedalData(pid, userNode, data) {
            let medal_list = JSON.parse(data).list;
            if (medal_list.length != 0) {
                let medalInfo = [];
                medal_list.forEach((e) => {
                    medalInfo.push({
                        targetName: e.target_name,
                        link: e.link,
                        medalName: e.medal_info.medal_name,
                        level: e.medal_info.level,
                        color: { start: '#' + e.medal_info.medal_color_start.toString(16).padStart(6, '0'),
                            end: '#' + e.medal_info.medal_color_end.toString(16).padStart(6, '0'),
                            border: '#' + e.medal_info.medal_color_border.toString(16).padStart(6, '0')
                        }
                    });
                });
                MedalDict[pid] = medalInfo;
                this.addMedalWall(pid, userNode);
            }
        }
        addMedalWall(pid, userNode) {
            if (userNode.querySelector('.medalTag')) {
                return;
            }
            RunOnce(() => {
                window.addEventListener('click', (event) => {
                    let e = event || window.event;
                    let targetClass = e.target?.classList;
                    if (!targetClass.contains('medal-font')) {
                        document.querySelectorAll('.medal-table').forEach(e => {
                            e.style.display = 'none';
                        });
                    }
                });
            });
            let medal = MedalDict[pid];
            if (medal) {
                let medal_list = '';
                medal.forEach((e) => {
                    medal_list += `
                    <div class="fans-tag">
                    <div class="tag-name" title="${e.targetName}" style="width:${measureTextWidth('15px', e.medalName)}px;background-image: linear-gradient(90deg, ${e.color.start}, ${e.color.end});">
                    <div class="tag-font"><a href="${e.link}" style="color:#fff;">${e.medalName}</a></div></div>
                    <div class="tag-class" style="color:${e.color.end};"><div class="tag-font">${e.level}</div></div>
                    </div>`;
                });
                let medalInner = `
                <div class="medalTag">
                    <div class='tag-name' style="color: #fff;width:28px;background-image: linear-gradient(90deg,#ffcaec,#a187ff);">
                    <div class='tag-font medal-font'>勋章</div></div>
                    <div class="medal-table">${medal_list}</div>
                </div>`;
                userNode.innerHTML += medalInner;
                let medalBtn = userNode.querySelector('.medalTag');
                let table = userNode.querySelector('.medal-table');
                medalBtn.onclick = () => {
                    let disp = table.style.display;
                    table.style.left = medalBtn.offsetLeft + 50 + 'px';
                    table.style.display = disp === 'block' ? 'none' : 'block';
                };
            }
        }
    }
    let RunOnce = function FunctionRunOnlyOnce(func) {
        func.apply(arguments);
        RunOnce = () => { };
    };
    function Requests(requestUrl, func, state, pid) {
        fetch(requestUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Concerns Gecko) Chrome/104.0.0.0 Safari/537.36'
            }
        })
            .then(response => response.json())
            .then(async (data) => {
                      let data_list = [];
            let data_json = [];
            let offset = '';
            let offsetNum = 1;
            let totalPage = 1;
            switch (state) {
                case 'blog':
                    data_json = data?.data?.items || [];
                    if (data_json.length === 0) {
                        return;
                    }
                    offset = data?.data.offset || '';
                    do {
                        if (offsetNum > 1) {
                            let nextPage = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${pid}`, {
                                credentials: 'include'
                            });
                            let nextPageData = await nextPage.json();
                            offset = nextPageData?.data.offset || '';
                            data_json = nextPageData?.data?.items || [];
                        }
                        data_json.map((blog) => {
                            let zhuanf_text = blog?.modules?.module_dynamic?.desc?.text || '';
                            let origin_text = blog?.orig?.modules?.module_dynamic?.desc?.text || '';
                            if (zhuanf_text) {
                                if (!DetectOption.Repost) {
                                    data_list.push({ 'text': zhuanf_text });
                                } else {
                                    data_list.push({ 'text': zhuanf_text, 'orig_text': origin_text });
                                }
                            }
                        });
                        offsetNum += 1;
                    } while (offset && offsetNum <= maxOffset);
                    data = JSON.stringify(data_list).replace(/\[.{1,12}\]/g, '');
                    break;
                case 'concerns':
                    if (data.code !== 0) {
                        break;
                    }
                    totalPage = data?.data.total / 50;
                    do {
                        if (offsetNum > 1) {
                            let nextPage = await fetch(`https://api.bilibili.com/x/relation/followings?vmid=${pid}&pn=${offsetNum}&ps=50&order=desc`);
                            data = await nextPage.json();
                        }
                        data_json = data?.data?.list || [];
                        data_json.length > 0 && data_json.map((i) => { data_list.push(i?.uname); });
                        offsetNum += 1;
                    } while (offsetNum <= totalPage && offsetNum <= maxOffset);
                    data = data_list.join(' ');
                    break;
                default:
                    data = JSON.stringify(data?.data || []);
            }
            func(data);
        })
            .catch(error => console.log(error));
    }
    function getUserID(userNode) {
        if (isNew) {
            return userNode?.querySelector('.user-name,.sub-user-name')?.dataset?.userId || userNode?.querySelector('.name')?.dataset?.usercardMid;
        } else {
            return userNode?.querySelector('.name')?.dataset?.usercardMid || userNode.children[0].href.replace(/[^\d]/g, "");
        }
    }
    function deleteJumpLink(comment) {
        if (link_delete.checked) {
            let jump_word = comment?.querySelectorAll('.jump-link.search-word');
            if (jump_word) {
                for (let link of jump_word) {
                    link.outerHTML = link.innerText;
                }
            }
        }
    }
    function closeComment() {
        if (close_comment.checked) {
            elmGetter.each('div.bottom-page.paging-box-big.center', document, (reply) => {
                let close_btn = elmGetter.create('<div class="close-btn"><a>收起评论</a></div>');
                reply.parentNode.insertBefore(close_btn, reply);
                close_btn.onclick = () => {
                    let comment_btn = reply?.parentNode?.parentNode?.parentNode?.parentNode?.querySelector('.bili-dyn-action.comment.active');
                    comment_btn.click();
                    comment_btn.scrollIntoView({ behavior: 'instant', block: 'center' });
                };
                if (!close_comment.checked) {
                    return false;
                }
            });
        }
    }
    function dynamicBatchLike() {
        let likebtns = document.querySelectorAll('div.like:not(.active)');
        let likebtnsiter = likebtns.entries();
        let clicktimer = setInterval(() => {
            let nextele = likebtnsiter.next();
            if (nextele.done) {
                clearInterval(clicktimer);
                return;
            }
            nextele.value[1].click();
        }, 600);
    }
    function mainPageBlock() {
        if (keyword.length === 0) {
            return;
        }
        elmGetter.each('.bili-video-card.is-rcmd', document, (reply) => {
            let author = reply?.querySelector('.bili-video-card__info--owner');
            let authorName = author.innerText;
            let authorHref = author?.href?.match(/(?<=https:\/\/space.bilibili.com\/)\d+$/);
            let authorID = authorHref ? authorHref[0] : '';
            let title = (reply?.querySelector('.bili-video-card__info--tit')).title;
            for (let reg of keyword) {
                if (RegExp(reg).test(title)) {
                    reply?.parentNode?.removeChild(reply);
                    console.log(`已屏蔽视频 %c${title}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return;
                }
            }
            if (blackList.has(authorID) || blackList.has(authorName) || keyword.includes(authorName)) {
                reply?.parentNode?.removeChild(reply);
                console.log(`已屏蔽视频 %c${title}  %c作者ID: %c${authorID}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
            }
            if (!BlockOption.Video) {
                return false;
            }
        });
    }
    function dynamicPageBlock() {
        elmGetter.each('.bili-dyn-list__item', document, (reply) => {
            let content = reply?.querySelector('.bili-rich-text__content')?.innerText || '';
            let title = reply?.querySelector('.bili-dyn-card-video__title.bili-ellipsis')?.innerText || '';
            let desc = reply?.querySelector('.bili-dyn-card-video__desc.bili-ellipsis')?.innerText || '';
            let all_content = content + title + desc;
            for (let reg of keyword) {
                if (RegExp(reg).test(all_content)) {
                    reply?.parentNode?.removeChild(reply);
                    console.log(`已屏蔽动态 %c${content}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return;
                }
            }
            if (!BlockOption.Dynamic) {
                return false;
            }
        });
    }
    function userCommentBlock(userID, reply, comment) {
        if (!BlockOption.Comment) {
            return;
        }
        let commentText = comment?.innerText;
        if (blackList.has(userID)) {
            removeUserComment(reply);
            console.log(`已屏蔽评论 %c${commentText}  %c用户ID: %c${userID}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
            return true;
        }
        if (keyword.length > 0 && commentText) {
            for (let reg of keyword) {
                if (RegExp(reg).test(commentText)) {
                    removeUserComment(reply);
                    console.log(`已屏蔽评论 %c${commentText}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return true;
                }
            }
        }
        if (BlockOption.User) {
            let blockBtn = elmGetter.create('<span class="block-btn btn-hover">屏蔽</span>');
            let replyInfo = reply?.querySelector('.reply-info,.sub-reply-info,.info');
            blockBtn.onclick = () => {
                blackList.add(userID);
                GM_setValue('BlackList', Array.from(blackList));
                console.log(`已屏蔽用户： %cID： %c${userID}`, 'color: #f44336; font-weight: bolder', 'color: #f44336; font-weight: bolder');
                replyInfo.removeChild(blockBtn);
                removeUserComment(reply);
            };
            replyInfo.insertBefore(blockBtn, replyInfo.childNodes[replyInfo.childNodes.length - 1]);
        }
        return false;
    }
    function removeUserComment(reply) {
        if (reply.getAttribute('class') === 'content-warp') {
            reply.parentNode?.parentNode?.parentNode?.removeChild(reply.parentNode?.parentNode);
        } else {
            reply.parentNode?.removeChild(reply);
        }
    }
    function detectUserTag(userID, userInfo, reply) {
        function detect(userID, userInfo, reply) {
            if (tagList.list.length == 0) {
                return;
            }
            tagList.checkUserInfo(userID, userInfo, reply);
            if (tagList.isChecked(userID)) {
                return;
            }
            tagList.detectNewUserInfo(userID, userInfo, reply);
        }
        if (!AutoDetect && !tagList.isChecked(userID)) {
            let searchBtn = elmGetter.create('<p class="search-btn">检测</p>');
            searchBtn.onclick = () => {
                detect(userID, userInfo, reply);
                userInfo.removeChild(searchBtn);
            };
            userInfo.insertBefore(searchBtn, userInfo.childNodes[2]);
            return;
        }
        detect(userID, userInfo, reply);
    }
    function tagInsertObserver() {
        elmGetter.each('.sub-reply-item,.content-warp,.list-item.reply-wrap,.reply-item.reply-wrap', document, (reply) => {
            let userInfo = reply?.querySelector('div.user-info:not(.section),.sub-user-info,div.user');
            let comment = reply?.querySelector('span.reply-content,p.text,span.text-con');
            let userID = getUserID(userInfo);
            if (userID) {
                if (userCommentBlock(userID, reply, comment)) {
                    return;
                }
                deleteJumpLink(comment);
                detectUserTag(userID, userInfo, reply);
            }
        });
    }
    function hideOption(option) {
        if (option.Medal) {
            MedalShow = false;
        }
        if (option.Comment) {
            close_comment.checked = false;
            close_comment.parentNode.style.display = 'none';
        }
        if (option.Like) {
            dynamic_btn.checked = false;
            dynamic_btn.parentNode.style.display = 'none';
            script_like.style.display = 'none';
        }
        if (option.Link) {
            link_delete.checked = false;
            link_delete.parentNode.style.display = 'none';
        }
    }
    function configInit() {
        tagClass_hide.checked = GM_getValue('TagClassHide', false);
        Style_tagClassHide.innerHTML = tagClassHide[String(tagClass_hide.checked)];
        AutoDetect = GM_getValue('AutoDetect', false);
        detection_mode.checked = AutoDetect;
        DetectOption = GM_getValue('DetectOption', { Repost: false, Concerns: false, Medal: false });
        ({ Repost: detect_repost.checked, Concerns: detect_concerns.checked, Medal: detect_medal.checked } = DetectOption);
        maxOffset = GM_getValue('MaxDetectPage', 1);
        detect_page.value = maxOffset.toString();
        offset_page.innerText = maxOffset.toString();
        BlockOption = GM_getValue('BlockOption', { User: false, Comment: false, Dynamic: false, Video: false });
        ({ User: block_user.checked, Comment: block_comment.checked, Dynamic: block_dynamic.checked, Video: block_video.checked } = BlockOption);
        blackList = new Set(GM_getValue('BlackList', []));
        tagMerge = GM_getValue('TagMerge', false);
        tag_merge.checked = tagMerge;
        link_delete.checked = GM_getValue('NoJump', false);
        close_comment.checked = GM_getValue('CloseComment', false);
        dynamic_btn.checked = GM_getValue('DynamicLike', false);
        script_like.style.display = dynamic_btn.checked ? 'block' : 'none';
        GM_getValue('Keyword', []).map((key) => addKeyWord(key));
        Object.values(GM_getValue('Tag', {})).map((i) => { addTag(i); });
    }
    const tagList = new TagList();
    const temp_keyword = {};
    const MedalDict = {};
    let tag = {};
    let keyword = [];
    let tagMerge = false;
    let MedalShow = false;
    let AutoDetect = false;
    let DetectOption = { Repost: false, Concerns: false, Medal: false };
    let BlockOption = { User: false, Comment: false, Dynamic: false, Video: false };
    let blackList = new Set();
    let maxOffset = 1;
    configInit();
    switch (Page) {
        case 'Main':
            mainPageBlock();
            hideOption({ Medal: true, Comment: true, Like: true, Link: true });
            break;
        case 'Dynamic':
            dynamicPageBlock();
            tagInsertObserver();
            closeComment();
            hideOption({ Medal: true, Comment: false, Like: false, Link: true });
            break;
        case 'Video':
            tagInsertObserver();
            hideOption({ Medal: false, Comment: true, Like: true, Link: false });
            break;
        default:
            tagInsertObserver();
            hideOption({ Medal: true, Comment: true, Like: true, Link: false });
    }
})();

