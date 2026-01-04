// ==UserScript==
// @name         B站評論區修復
// @namespace    http://yuhang0000.github.io/
// @version      v1.18_2025-10-16
// @description  修复B站视频底下评论区 css 样式表。
// @author       欲行肆灵
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        none
// @license      GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACnklEQVRYR+2XX0hTURzHv9edXVuNNaFhm+CLiBXh8qXaUGRBD+YCX8oSwerm34cG+RKxMGlILxMEwYxuTVCazxV7S8Q0eskUscboIWOzWpDWck5n9rDuzXO3dbu4raA+cGHn+/ve8/vew93ZGfBXolIRNPd40P/kAzrcXmi0OqlFFo1Whw63F/2TYTT3eKBSEaklPZV1TRia3xQv58ikohAarQ7OkUlqjsq6JqkNAFKnystTUePSCis6B31wt9YgGvlM1aRotDp0DvpQWmGl9DQrwEgFAABRs7jiGUuaJDA9BXfbCUS/LFO6QLrmgekp3DxnQ3x9jdKRLgDw68lShVDq/8HPAETNwlbfBkvtWRSVHsSOndotvu2zuhJBMDCHp4/uY2z0lrAaiQAFhUW4PPAQxfsOUTdli4VXL9Dbbsen90EGRM2ia/RZzpoLLPhn0F1/hMB2ujXnzQGguMwM26kWAou9gSrMTvjAOzkshRcpfbvoDUZwLh7lVTWiZrE3MOBnYiBqVhQd1aaMNxfQG4zoGw+J4/hajFDNAWStOZA8N2HzU+5OuUQ+QHlVDTgXDwDgnRxmJ3wSB41CP4Oh+U1KaTpA74594yHoDUYAiSV0VJuouhQ5v6Sf/AoIk0k/p0OhXz5AlpEPsBReFJ9k+eM7STUZhX75AHevXQTn4vFtYwP3ulqk5SQU+uVfwkyj+CXMMv8DEMTX16jfA73BmLRnZ4rde/ZS49WVCMGb+ecoMR8VxQs37oB3cr/zFVJEQWERznffprRgYI7B8cZLaLzaRxVyxXCPgwFh8xNHsjKztJ5V3vpncb3+8B86lPpn0NtWmziUChA1i2Nn2mE92QhTyX7ka3ZtuWX7xKJfEXr9ElMPhvHYO5DqT8q/yXdT6gC1Lkc+ZAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/530637/B%E7%AB%99%E8%A9%95%E8%AB%96%E5%8D%80%E4%BF%AE%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/530637/B%E7%AB%99%E8%A9%95%E8%AB%96%E5%8D%80%E4%BF%AE%E5%BE%A9.meta.js
// ==/UserScript==

(function() {

    //总开关
    window.debug_comment = false;
    //window.debug_comment = true;
    //自动展开评论
    //window.biliautoclickreadmore = true;
    //笔记图片默认展示为原图
    //window.bilifiximg = true;

    //保存时, 需要隐藏 DOM 节点的清单.
    var sethidearray = new Array();

    //目标时间转时间戳
    function gettime(time) {
        if(time.indexOf(':') != -1){
            time = time.split(':');
            console.log(time.length);
            if(time.length > 2){
                time = (time[0] * 60 * 60) + (time[1] * 60) + Number(time[2]);
            }
            else{
                time = (time[0] * 60) + Number(time[1]);
            }
        }
        return time;
    }

    //这是延时
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //广告好恶心，必须砍了
    function delAD() {
        const AD1 = document.querySelectorAll('#bannerAd');
        if (AD1.length > 0) {
            AD1.forEach(btn => {
                //btn.parentNode.removeChild(btn);
                btn.style.display = 'none';
            });
        }
        const AD2 = document.querySelectorAll('.ad-report');
        //console.log(AD2.length);
        if (AD2.length > 0) {
            AD2.forEach(btn => {
                //btn.parentNode.removeChild(btn);
                btn.style.display = 'none';
            });
        }
        const AD3 = document.querySelectorAll('.slide-ad-exp');
        if (AD3.length > 0) {
            AD3.forEach(btn => {
                btn.style.display = 'none';
            });
        }

        /*
        const viewMoreBtns = document.querySelectorAll('span[class="toggle-btn-text"]');
        if (viewMoreBtns.length > 0) {
            viewMoreBtns.forEach(btn => {
                if (btn.textContent.trim() == '展开更多')
                {
                    btn.click();
                }
            });
        }
        */
    }

    //修建用户头像
    async function fixusericon(div,comment = false){
        let layernum = 0;
        let iconsize = '86.4px'
        if(comment == true){ //评论区楼主头像
            const user_avatar = div.shadowRoot.querySelector('[id="user-avatar"]');
            const bili_avatar = user_avatar.querySelector('#user-avatar bili-avatar');
            if(bili_avatar != null){
                user_avatar.setAttribute('style', `position: absolute;left: 20px;top: 22px;width: 48px;height: 48px;transform-origin: left top;transform: var(--bili-comments-avatar-size);`);
                bili_avatar.setAttribute('style', `display: inline-block;position: relative;width: 48px; height: 48px;`);
                const canvas = bili_avatar.shadowRoot.querySelector('div[id="canvas"]');
                //canvas.setAttribute('style', `width: 48px; height: 48px;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;`);
                const layerss = bili_avatar.shadowRoot.querySelectorAll('div.layers');
                //console.log(layerss.length);
                layernum = layerss.length;
                if(layernum < 1){
                    //console.log('等待');
                    await delay(10);
                    fixusericon(div,comment);
                    return;
                }
                if(canvas.getAttribute('style').indexOf('--avatar-canvas-width:') != -1){ //获取默认头像框尺寸
                    iconsize = canvas.getAttribute('style');
                    //iconsize = iconsize.substring(iconsize.indexOf('--avatar-canvas-width:') + 23,iconsize.indexOf('px;') + 2);
                    iconsize = iconsize.split(';');
                    for(let aaa of iconsize){
                        if(aaa.indexOf('--avatar-canvas-width:') != -1){
                            iconsize = aaa.substring(aaa.indexOf('--avatar-canvas-width:') + 23,aaa.indexOf('px') + 2);
                            break;
                        }
                    }
                }
                else if(canvas.style.width != null){ //如果已经写死的话，就直接沿用
                    iconsize = canvas.style.width;
                }
                canvas.setAttribute('style', `width: `+ iconsize + `;height: `+ iconsize + `;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;`);
                for(let layers of layerss){ //头饰
                    layers.setAttribute('style', `position: absolute;left: 0;right: 0;top: 0;bottom: 0;`);
                    const layer_centers = layers.querySelectorAll('div.layer.center');
                    for(let layer_center of layer_centers){
                        layer_center.setAttribute('style', layer_center.getAttribute('style') +
                        `left: 50%;top: 50%;transform: translate(-50%, -50%);position: absolute;isolation: isolate;overflow: hidden;`);
                        const layer_res = layer_center.querySelector('div.layer-res');
                        layer_res.setAttribute('style', layer_res.getAttribute('style') +
                        `width: 100%;height: 100%;isolation: isolate;overflow: hidden;background-size: cover;background-repeat: no-repeat;background-position: center;`);
                        const img = layer_center.querySelector('img');
                        if(img != null){
                            img.setAttribute('style', `width: 100%;height: 100%;`);
                            const source = layer_center.querySelector('source');
                            source.setAttribute('style', `width: 100%;height: 100%;`);
                        }
                    }
                    let layer_bigvip = layers.querySelector('div[class="layer"]'); //大会员
                    if(layer_bigvip != null){
                        layer_bigvip.setAttribute('style',layer_bigvip.getAttribute('style') + `position: absolute;isolation: isolate;overflow: hidden;`);
                        let layer_res = layer_bigvip.querySelector('div.layer-res');
                        layer_res.setAttribute('style',layer_res.getAttribute('style') + `width: 100%;height: 100%;isolation: isolate;overflow: hidden;background-size: cover;
                        background-repeat: no-repeat;background-position: center;`);
                        let pic = layer_res.querySelector('picture'); //默认这里显示的是大会员 icon , 如果 picture 存在的话, 就要显示其他图标了.
                        if(pic != null){
                            pic.setAttribute('style',`width: 100%;height: 100%;display: inline-block;`);
                            let img = pic.querySelector('img');
                            img.setAttribute('style', `width: 100%;height: 100%;`);
                        }
                    }
                }
            }
            //不存在的话, 也可能是回复楼里的用户头像
            else{
                user_avatar.setAttribute('style', `position: absolute;left: 0;width: 24px;height: 24px;`);
                let img = user_avatar.querySelector('img');
                img.setAttribute('style', `border-radius: 50%;`);
            }
        }
        else{ //文本框头像
            const user_avatar = div.shadowRoot.querySelector('[id="user-avatar"]');
            user_avatar.setAttribute('style', `flex-shrink: 0;width: 80px;height: 50px;display: flex;justify-content: center;align-items: center;`);
            const bili_avatar = div.shadowRoot.querySelector('#user-avatar bili-avatar');
            bili_avatar.setAttribute('style', `display: inline-block;position: relative;width: var(--avatar-width);height: var(--avatar-height);`);
            const canvas = bili_avatar.shadowRoot.querySelector('div[id="canvas"]');
            const layerss = bili_avatar.shadowRoot.querySelectorAll('div.layers');
            layernum = layerss.length;
            if(layernum < 1){
                //console.log('等待');
                await delay(10);
                fixusericon(div,comment);
                return;
            }
            if(canvas.getAttribute('style').indexOf('--avatar-canvas-width:') != -1){ //获取默认头像框尺寸
                iconsize = canvas.getAttribute('style');
                //iconsize = iconsize.substring(iconsize.indexOf('--avatar-canvas-width:') + 23,iconsize.indexOf('px;') + 2);
                iconsize = iconsize.split(';');
                for(let aaa of iconsize){
                    if(aaa.indexOf('--avatar-canvas-width:') != -1){
                        iconsize = aaa.substring(aaa.indexOf('--avatar-canvas-width:') + 23,aaa.indexOf('px') + 2);
                        break;
                    }
                }
            }
            else if(canvas.style.width != null){ //如果已经写死的话，就直接沿用
                iconsize = canvas.style.width;
            }
            canvas.setAttribute('style', `width: `+ iconsize + `;height: `+ iconsize + `;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;`);
            //canvas.setAttribute('style', canvas.getAttribute('style') + `;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;`);
            for(let layers of layerss){ //头饰
                layers.setAttribute('style', `position: absolute;left: 0;right: 0;top: 0;bottom: 0;`);
                const layer_centers = layers.querySelectorAll('div.layer.center');
                for(let layer_center of layer_centers){
                    layer_center.setAttribute('style', `isolation: isolate;overflow: hidden;left: 50%;top: 50%;transform: translate(-50%, -50%);width: 48px;height: 48px;opacity: 1;border-radius: 50%;
                    position: absolute;`);
                    const layer_res = layer_center.querySelector('div.layer-res');
                    layer_res.setAttribute('style', `width: 100%;height: 100%;isolation: isolate;overflow: hidden;background-size: cover;background-repeat: no-repeat;background-position: center;`);
                    const img = layer_center.querySelector('img');
                    if(img != null){
                        img.setAttribute('style', `width: 48px; height: 48px; opacity: 1; border-radius: 50%;`);
                        const source = layer_center.querySelector('source');
                        source.setAttribute('style', `width: 48px; height: 48px; opacity: 1; border-radius: 50%;`);
                    }
                }
                let layer_bigvip = layers.querySelector('div[class="layer"]'); //大会员
                if(layer_bigvip != null){
                    layer_bigvip.setAttribute('style',layer_bigvip.getAttribute('style') + `position: absolute;isolation: isolate;overflow: hidden;`);
                    let layer_res = layer_bigvip.querySelector('div.layer-res');
                    layer_res.setAttribute('style',layer_res.getAttribute('style') + `width: 100%;height: 100%;isolation: isolate;overflow: hidden;background-size: cover;
                    background-repeat: no-repeat;background-position: center;`);
                    let pic = layer_res.querySelector('picture'); //默认这里显示的是大会员 icon , 如果 picture 存在的话, 就要显示其他图标了.
                    if(pic != null){
                        pic.setAttribute('style',`width: 100%;height: 100%;display: inline-block;`);
                        let img = pic.querySelector('img');
                        img.setAttribute('style', `width: 100%;height: 100%;`);
                    }
                }
            }
        }
        return layernum;
    }

    //修建评论区文本框
    async function fixtextbox(div,active = true,styles){
        //console.log(div);
        fixusericon(div);
        div.style.display = 'flex';
        let comment_area = div.shadowRoot.querySelector("div[id='comment-area']");
        comment_area.setAttribute('style',`position: relative;width: calc(100% - 80px);`);
        let body = div.shadowRoot.querySelector("div[id='body']");
        body.setAttribute('style',`width: 100%;transition: height 0.2s;`);
        let editor = div.shadowRoot.querySelector("div[id='editor']");
        editor.setAttribute('style',`width: 100%;padding: 8px 0;border-style:solid;border-top-width: 0.8px;border-bottom-width: 0.8px;border-color: var(--Ga1);box-sizing: border-box;
        border-right-width: 0.8px;border-left-width: 0.8px;border-radius: 6px;background-color: var(--bg3);transition: 0.2s;cursor: text;`);
        let bili_comment_rich_textarea = div.shadowRoot.querySelector("bili-comment-rich-textarea");
        bili_comment_rich_textarea.setAttribute('style',`--bili-comment-textarea-bg: transparent;--bili-comment-textarea-color: var(--text1);--bili-comment-textarea-placeholder-color: var(--text3);
        --bili-comment-textarea-padding: 8px;--bili-comment-textarea-font-size: 14px;--brt-line-height: 32px;`);
        let input = bili_comment_rich_textarea.shadowRoot.querySelector("div[id='input']");
        input.setAttribute('style',`min-height: 32px;max-height: 100px;line-height: 32px;width: 100%;font-size: var(--bili-comment-textarea-font-size);font-family: inherit;box-sizing: border-box;
        color: var(--bili-comment-textarea-color);background-color: var(--bili-comment-textarea-bg);`);
        let brt_root = input.querySelector("div.brt-root"); //文本框上的提示词
        let brt_editor
        function fixbrt_root(){
            brt_root.setAttribute('style',`position: relative;`);
            let brt_placeholder = input.querySelector("div.brt-placeholder");
            brt_placeholder.setAttribute('style',`position: absolute;left: var(--brt-editor-padding-hrz, 8px);top: var(--brt-editor-padding-vtc, 0);font-size: var(--brt-font-size, 14px);
            color: var(--brt-placeholder-color, var(--text3, #9499a0));line-height: var(--brt-line-height, 20px);pointer-events: none;`);
            brt_editor = input.querySelector("div.brt-editor");
            brt_editor.setAttribute('style',`outline: none;border: none;box-sizing: border-box;padding: var(--brt-editor-padding-vtc, 0) var(--brt-editor-padding-hrz, 8px);overflow-y: auto;
            font-size: var(--brt-font-size, 14px);line-height: var(--brt-line-height, 20px);min-height: var(--brt-line-height, 20px);max-height: 100px;`);
            //如果文本框有文本存在就把提示词给隐藏掉
            if(brt_editor.innerText != ''){
               brt_placeholder.style.display = 'none';
            }
        }
        if(brt_root != null){
            fixbrt_root();
        }
        else{
            await delay(10);
            fixtextbox(div,active,styles);
            return;
        }
        //图片上载小预览窗, 开摆, 不做了。。。
        let bili_comment_pictures_upload = div.shadowRoot.querySelector("bili-comment-pictures-upload");
        bili_comment_pictures_upload.setAttribute('style',`margin-top: 8px;`);
        const wrapper = bili_comment_pictures_upload.shadowRoot.querySelector('div[id="wrapper"]');
        wrapper.setAttribute('style', `position: relative;padding: 0 8px;width: 100%;overflow: hidden;`);
        const shadow = bili_comment_pictures_upload.shadowRoot.querySelectorAll('div[id="shadow"]');
        shadow[0].setAttribute('style', `left: 0;background: linear-gradient(to right, #fff, #fff 28.5%, rgba(255, 255, 255, 0) 100%);display: none;position: absolute;top: 0;
        width: 20px;height: 100%;pointer-events: none;z-index: 1;`);
        shadow[1].setAttribute('style', `right: 0;background: linear-gradient(to left, #fff 28.5%, rgba(255, 255, 255, 0) 100%);display: none;position: absolute;top: 0;
        width: 20px;height: 100%;pointer-events: none;z-index: 1;`);
        const slide_btn = bili_comment_pictures_upload.shadowRoot.querySelectorAll('div[id="slide-btn"]');
        slide_btn[0].setAttribute('style', `left: 8px;transform: translateY(-50%);position: absolute;top: 50%;display: none;justify-content: center;align-items: center;
        width: 24px;height: 24px;border-radius: 50%;border: 1px solid var(--line_regular);background-color: #fff;color: var(--text3);cursor: pointer;z-index: 2;`);
        slide_btn[1].setAttribute('style', `right: 8px;transform: translateY(-50%) rotate(180deg);position: absolute;top: 50%;display: none;justify-content: center;height: 24px;
        align-items: center;width: 24px;border-radius: 50%;border: 1px solid var(--line_regular);background-color: #fff;color: var(--text3);cursor: pointer;z-index: 2;`);
        const content = bili_comment_pictures_upload.shadowRoot.querySelector('div[id="content"]');
        content.setAttribute('style', `width: fit-content;display: flex;flex-wrap: nowrap;transition: 0.2s ease-in-out;`);
        let footer = div.shadowRoot.querySelector("div[id='footer']"); //文本框地下那些工具栏
        if(styles != 'reply'){
            footer.setAttribute('style',`position: relative;margin-top: 10px;align-items: center;display: none;`);
        }
        else{
            editor.style.backgroundColor = 'var(--bg1)';
            editor.style.borderColor = 'var(--graph_weak)';
        }
        //表情, 转发, 发送
        let tool_btns = footer.querySelectorAll(".tool-btn");
        for(let tool_btn of tool_btns){
            tool_btn.setAttribute('style',`outline: none;border: none;display: flex;justify-content: center;align-items: center;position: relative;width: 32px;height: 26px;cursor: pointer;
            border: 1px solid var(--Ga1);background-color: var(--bg1);border-radius: 4px;color: var(--text2);margin-right: 6px;`);
            let bili_icon = tool_btn.querySelector("bili-icon");
            bili_icon.setAttribute('style',`display: inline-flex;align-items: center;`);
        }
        let bili_comment_mention_popover = footer.querySelector("bili-comment-mention-popover");
        bili_comment_mention_popover.setAttribute('style',`left: 38px;z-index: 2;--max-content-height: 282px;position: absolute;display: none;flex-direction: column;width: 219px;
        border: 1px solid var(--graph_bg_thick);border-radius: 6px;font-size: 12px;background-color: var(--bg1);box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 10px;`);
        //sethidearray[sethidearray.length] = bili_comment_mention_popover;
        let tool_at_who = bili_comment_mention_popover.shadowRoot.querySelector("div[id='title']");
        tool_at_who.setAttribute('style',`width: 100%;height: 41px;padding: 12px;color: var(--text2);font-size: 12px;box-sizing: border-box;`);
        let tool_optional = footer.querySelector("div[id='optional']");
        if(tool_optional != null){ //转发
            let bili_checkbox = tool_optional.querySelector("bili-checkbox");
            bili_checkbox.setAttribute('style',`transform: scale(0.8);--bili-checkbox-size: 16px;--bili-checkbox-font-size: 14px;--bili-checkbox-border-width: 1px;--bili-checkbox-border-radius: 2px;
            --bili-checkbox-checked-color: var(--brand_blue);--bili-checkbox-margin-inline-end: 8px;display: inline-flex;align-items: baseline;padding: 0;margin: 0;cursor: pointer;
            margin-inline-end: var(--bili-checkbox-margin-inline-end);`);
            let bili_checkbox_input = bili_checkbox.shadowRoot.querySelector("span[id='input']");
            bili_checkbox_input.setAttribute('style',`box-sizing: border-box;margin: 0;padding: 0;list-style: none;position: relative;display: inline-block;outline: none;cursor: pointer;
            align-self: center;border-radius: var(--bili-checkbox-border-radius);width: var(--bili-checkbox-size);height: var(--bili-checkbox-size);`);
            let bili_checkbox_inner = bili_checkbox.shadowRoot.querySelector("span[id='inner']");
            bili_checkbox_inner.setAttribute('style',`display: block;background-color: var(--bg1_float);border: 1px solid var(--text4);border-radius: var(--bili-checkbox-border-radius);
            box-sizing: border-box;width: 100%;height: 100%;transition: all .3s ease-in-out;`);
            let bili_checkbox_label = bili_checkbox.shadowRoot.querySelector("span[id='label']");
            bili_checkbox_label.setAttribute('style',`margin-left: 8px;font-size: var(--bili-checkbox-font-size);color: var(--text2);`);
            let bili_checkbox_input2 = bili_checkbox.shadowRoot.querySelector("input");
            bili_checkbox_input2.setAttribute('style',`bottom: 0;left: 0;margin: 0;opacity: 0;outline: none;position: absolute;right: 0;top: 0;z-index: -1;`);
        }
        let tool_post = footer.querySelector("div[id='pub']");
        tool_post.setAttribute('style',`height: 32px;width: 70px;margin-left: auto;`);
        let tool_post_button = tool_post.querySelector("button");
        tool_post_button.setAttribute('style',`cursor: pointer;border-radius: 4px;outline: none;border: none;width: 100%;height: 100%;font-size: 16px;color: var(--text_white);
        background-color: rgba(var(--brand_blue_rgb), 0.5);`);
        //监听按钮颜色变化
        if(input.getAttribute('fixed') != 'true'){
            input.setAttribute('fixed','true')
            function checktextboxupdate(){
                if(brt_editor == null){
                    return;
                }
                let ttttt = input.querySelector(".brt-editor");
                //console.log('输入内容: ', ttttt.innerText);
                //console.log('输入内容: ', ttttt.innerHTML);
                if(ttttt.innerText != ""){
                    tool_post_button.style.backgroundColor = "var(--brand_blue)";
                }
                else{
                    tool_post_button.style.backgroundColor = "rgba(var(--brand_blue_rgb), 0.5)";
                }
                /*if(bili_comment_mention_popover.style.display != 'flex'){
                    bili_comment_mention_popover.style.display = 'none';
                }*/
            }
            input.addEventListener('input', checktextboxupdate);
            //我不想看见 '选择或输入你想@的人', 好吧, 过于滥用 MutationObserver , 但真的很好用欸
            const obcheckatwho = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                        //console.log(bili_comment_mention_popover.style.display);
                        if(bili_comment_mention_popover.style.display != 'flex'){
                            bili_comment_mention_popover.style.display = 'none';
                        }
                    }
                });
            });
            obcheckatwho.observe(bili_comment_mention_popover, {attributes: true,attributeFilter: ['style'],});
            /*我不想看见 '选择或输入你想@的人'
            div.addEventListener('mouseout', function(){
                //console.log(bili_comment_mention_popover.style.display);
                if(bili_comment_mention_popover.style.display != 'flex'){
                    bili_comment_mention_popover.style.display = 'none';
                }
            });
            div.addEventListener('mouseover', function(){
                if(bili_comment_mention_popover.style.display != 'flex'){
                    bili_comment_mention_popover.style.display = 'none';
                }
            });
            bili_comment_rich_textarea.addEventListener('mouseout', function(){
                //console.log(bili_comment_mention_popover.style.display);
                if(bili_comment_mention_popover.style.display != 'flex'){
                    bili_comment_mention_popover.style.display = 'none';
                }
            });
            bili_comment_rich_textarea.addEventListener('mouseover', function(){
                if(bili_comment_mention_popover.style.display != 'flex'){
                    bili_comment_mention_popover.style.display = 'none';
                }
            });*/
        }
        /*input.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.keyCode === 83) {
                setdivhide();
            }
        });*/

        //鼠标移入移出动画
        if(active != true){
            //console.log('添加过了, 忽略');
            return bili_comment_mention_popover;
        }

        body.addEventListener('mouseover', function() {
            if(footer.className.indexOf('hidden') != -1){
                editor.style.backgroundColor = 'var(--bg1)';
                editor.style.borderColor = 'var(--graph_weak)';
            }
        });
        body.addEventListener('mouseout', function() {
            if(footer.className.indexOf('hidden') != -1){
                editor.style.backgroundColor = 'var(--bg3)';
                editor.style.borderColor = 'var(--bg3)';
            }
        });

        //监听 footer 变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if(footer.className.indexOf('hidden') != -1){
                        editor.style.backgroundColor = 'var(--bg3)';
                        editor.style.borderColor = 'var(--bg3)';
                        footer.style.display = 'none';
                        if(brt_root != null){
                            fixbrt_root();
                        }
                    }
                    else{
                        editor.style.backgroundColor = 'var(--bg1)';
                        editor.style.borderColor = 'var(--graph_weak)';
                        footer.style.display = 'flex';
                    }
                }
            });
        });
        observer.observe(footer, {attributes: true,attributeFilter: ['class'],});
        return bili_comment_mention_popover;
    }

    //修复 header 部分
    function fixbilicomment(bilicomment){
        let header = bilicomment.shadowRoot.querySelector("bili-comments-header-renderer");
        if(header == null){
            return false;
        }
        let notice = header.shadowRoot.querySelector("div[id='notice']");
        if(notice != null){
            notice.remove();
        }
        let navbar = header.shadowRoot.querySelector("div[id='navbar']");
        navbar.setAttribute('style',`display: flex;align-items: center;height: 28px;margin-bottom: 22px;margin-top: 10px;`);
        let title = navbar.querySelector("div[id='title']");
        title.setAttribute('style',`display: var(--bili-comments-title-display, flex);align-items: center;`);
        let h2 = navbar.querySelector("h2");
        h2.setAttribute('style',`margin: 0;color: var(--text1);font-weight: 500;font-size: var(--bili-comments-font-size-title, 20px);`);
        let count = navbar.querySelector("div[id='count']");
        count.setAttribute('style',`margin: 0 30px 0 6px;font-size: var(--bili-comments-font-size-count, 13px);font-weight: 400;color: var(--text3);`);
        let sort_actions = navbar.querySelector("div[id='sort-actions']");
        let more = navbar.querySelector("div[id='more']"); //开启评论精选&关闭评论
        if(more != null){
            more.setAttribute('style',`margin-left: auto;width: 24px;height: 24px;position: relative;`);
            let button = more.querySelector("button");
            button.setAttribute('style',`width: 24px;height: 24px;text-align: center;padding: 0px;outline: none;border: none;background: transparent;font-size: 13px;color: var(--text3);
            display: inline-flex;align-items: center;cursor: pointer;justify-content: end;`);
            let bili_icon = more.querySelector("bili-icon");
            bili_icon.setAttribute('style',`display: inline-flex;align-items: center;`);
            let bili_comment_menu = more.querySelector("bili-comment-menu");
            bili_comment_menu.setAttribute('style',`--bili-comment-menu-display: none;--bili-comment-menu-position: absolute;--bili-comment-menu-top: 20px;--bili-comment-menu-right: 0;`);
            let options = bili_comment_menu.shadowRoot.querySelector("#options");
            options.setAttribute('style',`display: var(--bili-comment-menu-display);position: var(--bili-comment-menu-position);top: var(--bili-comment-menu-top);
            right: var(--bili-comment-menu-right);margin: 0;padding: 0;z-index: 10;width: 120px;list-style: none;border-radius: 4px;font-size: 14px;color: var(--text2);
            background-color: var(--bg1_float);box-shadow: 0 0 5px #0003;overflow: hidden;`);
            let optionsss = options.querySelectorAll("li");
            for(let optionss of optionsss){
                optionss.setAttribute('style',`box-sizing: border-box;width: 100%;display: flex;align-items: center;height: 36px;padding: 0px 15px;cursor: pointer;user-select: none;`);
            }
            button.addEventListener("mouseover",function(){
                button.style.color = 'var(--brand_blue)';
            });
            button.addEventListener("mouseout",function(){
                button.style.color = 'var(--text3)';
            });
            button.addEventListener("click",function(){
                bili_comment_menu.setAttribute('style',`--bili-comment-menu-display: block;--bili-comment-menu-position: absolute;--bili-comment-menu-top: 20px;--bili-comment-menu-right: 0;`);
            });
            bili_comment_menu.addEventListener("mouseout",function(){
                bili_comment_menu.setAttribute('style',`--bili-comment-menu-display: none;--bili-comment-menu-position: absolute;--bili-comment-menu-top: 20px;--bili-comment-menu-right: 0;`);
            });
        }
        let sort_div = navbar.querySelector("div.sort-div");

        let commentisdisable = false; //false 为评论区已关闭;true 为精选评论

        function textboxdisable(){
            let commentbox = header.shadowRoot.querySelector("div[id='commentbox']");
            commentbox.setAttribute('style',`flex-shrink: 0;transition: height 0.2s;height: var(--bili-comments-commentbox-height, auto);`);
            let disabled_commentbox = commentbox.querySelector("div[id='disabled-commentbox']");
            if(disabled_commentbox == null){ //我服了, 假如找不到, 就说明那个文本框存在
                commentisdisable = true;
                console.log('评论被up主精选后, 对所有人可见');
                return;
            }
            disabled_commentbox.setAttribute('style',`display: flex;height: 50px;`);
            let user_avatar = commentbox.querySelector("div[id='user-avatar']");
            user_avatar.setAttribute('style',`flex-shrink: 0;width: 80px;height: 50px;display: flex;justify-content: center;align-items: center;`);
            let img = commentbox.querySelector("img");
            img.setAttribute('style',`border-radius: 50%;`);
            let edit = commentbox.querySelector("div[id='edit']");
            edit.setAttribute('style',`flex: 1 1 0%;height: 100%;border-radius: 6px;font-size: 12px;color: var(--text3);background-color: var(--bg3);display: flex;align-items: center;
            justify-content: center;`);
        }

        if(sort_div == null){ //如果是null, 则说明评论区受限: 关闭&精选
            textboxdisable();
            if(commentisdisable == false){
                let contents = bilicomment.shadowRoot.querySelector("div[id='contents']");
                contents.setAttribute('style',`display: none;padding-top: 14px;position: relative;`);
                let contents_end = bilicomment.shadowRoot.querySelector("div[id='end']"); //是否到底
                let bottombar = contents_end.querySelector("div.bottombar");
                if(contents_end.className == 'limit'){ //动态首页和个人主页, 这两个地方底部边距矮一点
                    bottombar.setAttribute('style',`padding-bottom: 20px;width: 100%;margin-top: 20px;font-size: 13px;color: var(--text3);text-align: center;user-select: none;`);
                }
                else{
                    bottombar.setAttribute('style',`padding-bottom: 100px;width: 100%;margin-top: 20px;font-size: 13px;color: var(--text3);text-align: center;user-select: none;`);
                }
                console.log('当前评论区已关闭');
                return 'disable';
            }
        }
        if(sort_div != null){ //两个排序按钮
            sort_div.setAttribute('style',`display: inline-block;height: 11px;margin: 0 3px;border-left: solid 1px var(--text3);vertical-align: -2px;`);
            let sort_div_button = navbar.querySelectorAll("bili-text-button");
            if(sort_div_button.length != 0){ //最热 | 最新
                function checkhotortime(){
                    if(sort_actions.className.indexOf("hot") != -1){
                        sort_button1.style.color = "var(--text1)";
                        sort_button2.style.color = "var(--text3)";
                    }
                    else{
                        sort_button1.style.color = "var(--text3)";
                        sort_button2.style.color = "var(--text1)";
                    }
                }
                sort_div_button[0].setAttribute('style',`--_container-height: 28px;--_leading-space: 6px;--_trailing-space: 6px;
                --_label-text-size: var(--bili-comments-font-size-sort, 13px);display: inline-flex;height: var(--_container-height);outline: none;font-family: var(--_label-text-font);
                font-size: var(--_label-text-size);line-height: var(--_label-text-line-height);font-weight: var(--_label-text-weight);-webkit-tap-highlight-color: transparent;vertical-align: middle;`);
                let sort_button1 = sort_div_button[0].shadowRoot.querySelector("button");
                sort_button1.setAttribute('style',`display: inline-flex;align-items: center;justify-content: center;box-sizing: border-box;border: none;outline: none;user-select: none;appearance: none;
                background: rgba(0, 0, 0, 0);text-decoration: none;inline-size: 100%;position: relative;z-index: 0;height: 100%;font: inherit;color: var(--text1);;
                padding-inline-start: var(--_leading-space);padding-inline-end: var(--_trailing-space);cursor: pointer;`);
                sort_div_button[1].setAttribute('style',`--_container-height: 28px;--_leading-space: 6px;--_trailing-space: 6px;
                --_label-text-size: var(--bili-comments-font-size-sort, 13px);display: inline-flex;height: var(--_container-height);outline: none;font-family: var(--_label-text-font);
                font-size: var(--_label-text-size);line-height: var(--_label-text-line-height);font-weight: var(--_label-text-weight);-webkit-tap-highlight-color: transparent;vertical-align: middle;`);
                let sort_button2 = sort_div_button[1].shadowRoot.querySelector("button");
                sort_button2.setAttribute('style',`display: inline-flex;align-items: center;justify-content: center;box-sizing: border-box;border: none;outline: none;user-select: none;appearance: none;
                background: rgba(0, 0, 0, 0);text-decoration: none;inline-size: 100%;position: relative;z-index: 0;height: 100%;font: inherit;color: var(--text3);;
                padding-inline-start: var(--_leading-space);padding-inline-end: var(--_trailing-space);cursor: pointer;`);
                sort_button1.addEventListener("click",checkhotortime);
                sort_button2.addEventListener("click",checkhotortime);
                sort_button1.addEventListener("mouseout",checkhotortime);
                sort_button2.addEventListener("mouseout",checkhotortime);
                sort_button1.addEventListener("mouseover",function(){
                    sort_button1.style.color = "var(--brand_blue)";
                });
                sort_button2.addEventListener("mouseover",function(){
                    sort_button2.style.color = "var(--brand_blue)";
                });
            }
        }

        let commentbox = header.shadowRoot.querySelector("div[id='commentbox']");
        commentbox.setAttribute('style',`flex-shrink: 0;transition: height 0.2s;height: var(--bili-comments-commentbox-height, auto);`);
        let bili_comment_box = header.shadowRoot.querySelector("bili-comment-box");
        if(bili_comment_box != null){ //如果文本框不存在, 说明你没有权限发送评论
            bili_comment_box.setAttribute('style',`display: flex;`);
            fixtextbox(bili_comment_box);
            /*//隐藏@谁
            fixtextbox(bili_comment_box).then((hideatwho) => {
                const obcheckatwho = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if(hideatwho.style.display != 'flex'){
                                hideatwho.style.display = 'none';
                            }
                        }
                    });
                });
                obcheckatwho.observe(hideatwho, {attributes: true,attributeFilter: ['style'],});
            });*/

            async function checkcommentbox(){
                try{
                    bili_comment_box = header.shadowRoot.querySelector("bili-comment-box");
                    bili_comment_box.setAttribute('style',`display: flex;`);
                    fixtextbox(bili_comment_box,false);
                }
                catch (ex){
                    await delay(1000);
                    //console.log('错误: \n' + ex.stack);
                    checkcommentbox();
                }
            }

            //监听 commentbox 位置变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((addedNode) => {
                            checkcommentbox();
                        });

                        mutation.removedNodes.forEach((removedNode) => {
                            checkcommentbox();
                        });
                    }
                });
            });
            observer.observe(commentbox, {childList: true,});
        }
        else{
            textboxdisable();
            console.log('当前评论区无法发送评论');
        }
        console.log('评论修复完成!');
    }

    //修复 comments 部分
    function fixcommentlist(bilicomment){
        let contents = bilicomment.shadowRoot.querySelector("div[id='contents']");
        if(contents == null){
            return false;
        }
        contents.setAttribute('style',`padding-top: 14px;position: relative;`);
        let new1 = contents.querySelector("div[id='new']");
        //TODO: 'new'

        let reply_commentbox = contents.querySelector("div[id='reply-commentbox']");
        reply_commentbox.setAttribute('style',`display: none;height: 0px;overflow: hidden;opacity: 0;`);
        let bili_comment_box = reply_commentbox.querySelector("bili-comment-box");
        let feed = contents.querySelector("div[id='feed']");

        //遍历评论
        async function findcomment(div){
            let commentlists = div.querySelectorAll("bili-comment-thread-renderer");
            console.log('评论数: ' + commentlists.length);
            for(let commentlist of commentlists){
                if(commentlist == null){
                    continue;
                }
                //let bili_comment_renderer = commentlist.shadowRoot.querySelector("bili-comment-renderer");
                //fixusericon(bili_comment_renderer,true); //用户头像
                //如果发送者本体已修复就跳过
                if(commentlist.getAttribute('fixed') != 'true'){
                    commentlist.setAttribute('fixed','true');
                    let line = commentlist.shadowRoot.querySelector("div[id='div']"); //分割线
                    if(line != null){
                        line.setAttribute('style',`padding-bottom: 14px;margin-left: 80px;border-bottom: 1px solid var(--graph_bg_thick);`);
                    }
                    //console.log(commentlist);
                    let bili_comment_renderer = commentlist.shadowRoot.querySelector("bili-comment-renderer");
                    async function imsolazeyss(){
                        if(bili_comment_renderer == null){
                            await delay(10);
                            bili_comment_renderer = commentlist.shadowRoot.querySelector("bili-comment-renderer");
                            imsolazeyss();
                            return;
                        }
                    }
                    await imsolazeyss();
                    //console.log(bili_comment_renderer);
                    if(bili_comment_renderer == null){
                        //debugger;
                    }
                    fixusercomment(bili_comment_renderer); //楼主评论
                    let checkreplyupdataworking = false;
                    fixuserreply(commentlist); //回复

                    //监听回复列表更新
                    async function checkreplyupdata(commentlist){
                        try{
                            fixuserreply(commentlist);
                        }
                        catch (ex){
                            await delay(1000);
                            console.log('错误: \n' + ex.stack);
                            checkreplyupdata();
                        }
                    }

                    let replies = commentlist.shadowRoot.querySelector("div[id='replies']");
                    let bili_comment_replies_renderer = replies.querySelector("bili-comment-replies-renderer");
                    let expander = bili_comment_replies_renderer.shadowRoot.querySelector("div[id='expander']");
                    let expander_contents = expander.querySelector("div[id='expander-contents']");

                    const obcommentreply = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach((addedNode) => {
                                    if(checkreplyupdataworking == false){
                                        console.log("回复列表更新啦~~~");
                                        checkreplyupdataworking = true;
                                        checkreplyupdata(commentlist);
                                    }
                                });

                                mutation.removedNodes.forEach((removedNode) => {
                                    if(checkreplyupdataworking == false){
                                        console.log("回复列表折叠啦~~~");
                                        checkreplyupdataworking = true;
                                        checkreplyupdata(commentlist);
                                    }
                                });
                            }
                        });
                    });
                    mainobservers[mainobservers.length] = obcommentreply;
                    obcommentreply.observe(expander_contents, {childList: true,});

                    //文本输入框
                    async function checkcommenttextbox(reply_container){
                        try{
                            let bili_comment_box = reply_container.querySelector("bili-comment-box");
                            if(bili_comment_box == null){
                                return;
                            }
                            fixtextbox(bili_comment_box,true,'reply');
                        }
                        catch (ex){
                            await delay(1000);
                            console.log('错误: \n' + ex.stack);
                            checkcommenttextbox(reply_container);
                        }
                    }
                    let reply_container = commentlist.shadowRoot.querySelector("div[id='reply-container']");
                    //监听文本框更新
                    const obcommentreplytextbox = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach((addedNode) => {
                                    checkcommenttextbox(reply_container);
                                });

                                /*mutation.removedNodes.forEach((removedNode) => {

                                });*/
                            }
                        });
                    });
                    mainobservers[mainobservers.length] = obcommentreplytextbox;
                    obcommentreplytextbox.observe(reply_container, {childList: true,});

                    //修复用户回复部分
                    async function fixuserreply(commentlist){
                        //回复
                        let replies = commentlist.shadowRoot.querySelector("div[id='replies']");
                        let bili_comment_replies_renderer = replies.querySelector("bili-comment-replies-renderer");
                        let expander = bili_comment_replies_renderer.shadowRoot.querySelector("div[id='expander']");
                        expander.setAttribute('style',`padding-left: 80px;margin-top: 2px;`);
                        let expander_contents = expander.querySelector("div[id='expander-contents']");
                        expander_contents.setAttribute('style',`position: relative;`);
                        //加载中的哪个啥???
                        let spinner = expander.querySelector("div[id='spinner']");
                        if(spinner != null){
                            spinner.setAttribute('style',`position: absolute;left: 0;top: 0;width: 100%;height: 100%;background: rgba(var(--bg1_rgb), 0.85);display: flex;align-items: center;
                            justify-content: center;`);
                            let bili_comments_spinner = spinner.querySelector("bili-comments-spinner");
                            let spinner2 = bili_comments_spinner.shadowRoot.querySelector("div[id='spinner']");
                            if(spinner2 != null){
                                spinner2.setAttribute('style',`padding: 20px 0px;width: 100%;text-align: center;font-size: 14px;color: var(--text3);`);
                                let spinner2_img = spinner2.querySelector("img");
                                spinner2_img.setAttribute('style',`margin-right: 8px;vertical-align: bottom;`);
                                //let spinner2_span = spinner2.querySelector("span");
                                //spinner2_span.setAttribute('style',`padding: 20px 0px;width: 100%;text-align: center;font-size: 14px;color: var(--text3);`);
                            }
                        }
                        //页数, 展开
                        let expander_footer = expander.querySelector("div[id='expander-footer']");
                        let expander_view_more = expander_footer.querySelector("div[id='view-more']"); //锐度更多
                        if(expander_view_more != null){
                            expander_view_more.setAttribute('style',`font-size: 13px;color: var(--text3);`);
                            let bili_text_button = expander_view_more.querySelector("bili-text-button");
                            bili_text_button.setAttribute('style',`vertical-align: unset;display: inline-flex;outline: none;`);
                            let bili_text_button2 = bili_text_button.shadowRoot.querySelector("button");
                            async function imsolazeys(){ //等 '展开更多' 加载完
                                if(bili_text_button2 == null){
                                    await delay(10);
                                    bili_text_button2 = bili_text_button.shadowRoot.querySelector("button");
                                    imsolazeys();
                                }
                            }
                            await imsolazeys();
                            bili_text_button2.setAttribute('style',`display: inline-flex;align-items: center;justify-content: center;box-sizing: border-box;border: none;outline: none;
                            appearance: none;background: rgba(0, 0, 0, 0);text-decoration: none;inline-size: 100%;position: relative;z-index: 0;height: 100%;font: inherit;color: var(--text3);
                            padding-inline-start: var(--_leading-space);padding-inline-end: var(--_trailing-space);cursor: pointer;user-select: none;`);
                            bili_text_button2.addEventListener('mouseover', function() {
                                bili_text_button2.style.color = "var(--brand_blue)";
                            });
                            bili_text_button2.addEventListener('mouseout', function() {
                                bili_text_button2.style.color = "var(--text3)";
                            });
                            //自动展开，如果有安装自动展开的脚本的话
                            if(window.biliautoclickreadmore == true){
                                bili_text_button2.click();
                            }

                        }
                        let expander_pagination = expander_footer.querySelector("div[id='pagination']"); //翻页
                        if(expander_pagination != null){
                            expander_pagination.setAttribute('style',`display: flex;align-items: center;font-size: 13px;color: var(--text1);`);
                            let expander_pagination_head = expander_footer.querySelector("div[id='pagination-head']"); //共 x 页
                            expander_pagination_head.setAttribute('style',`margin-right: 12px;`);
                            let expander_pagination_body = expander_footer.querySelector("div[id='pagination-body']"); //1,2,3...
                            expander_pagination_body.setAttribute('style',`display: flex;align-items: center;`);
                            let expander_pagination_foot = expander_footer.querySelector("div[id='pagination-foot']"); //收起
                            let expander_pagination_foot_button = expander_pagination_foot.querySelector("bili-text-button");
                            expander_pagination_foot_button.setAttribute('style',`margin-left: 8px;vertical-align: unset;outline: none;`);
                            let expander_pagination_foot_button2 = expander_pagination_foot_button.shadowRoot.querySelector("button");
                            if(expander_pagination_foot_button2 != null){
                                expander_pagination_foot_button2.setAttribute('style',`display: inline-flex;align-items: center;justify-content: center;box-sizing: border-box;border: none;
                                user-select: none;appearance: none;background: rgba(0, 0, 0, 0);text-decoration: none;inline-size: 100%;position: relative;z-index: 0;height: 100%;font: inherit;
                                padding-inline-start: var(--_leading-space);padding-inline-end: var(--_trailing-space);color: var(--_label-text-color);cursor: pointer;outline: none;`);
                                expander_pagination_foot_button2.addEventListener('mouseover', function() {
                                    expander_pagination_foot_button2.style.color = "var(--brand_blue)";
                                });
                                expander_pagination_foot_button2.addEventListener('mouseout', function() {
                                    expander_pagination_foot_button2.style.color = "var(--text1)";
                                });
                            }

                            let expander_pagination_nums = expander_pagination_body.querySelectorAll("bili-text-button");
                            for(let expander_pagination_num of expander_pagination_nums){
                                let pagination_num_style = expander_pagination_num.getAttribute('style');
                                if(pagination_num_style.indexOf('--_label-text-color:') != -1){
                                    pagination_num_style = pagination_num_style.substring(pagination_num_style.indexOf('--_label-text-color:'),pagination_num_style.indexOf(';')+1)
                                }
                                else{
                                    pagination_num_style = '';
                                }
                                expander_pagination_num.setAttribute('style',pagination_num_style +
                                `margin-left: 8px;vertical-align: unset;display: inline-flex;outline: none;-webkit-tap-highlight-color: transparent;`);
                                let expander_pagination_button = expander_pagination_num.shadowRoot.querySelector("button");
                                if(expander_pagination_button != null){
                                    expander_pagination_button.setAttribute('style',`display: inline-flex; align-items: center;justify-content: center;box-sizing: border-box;border: none;
                                    user-select: none;appearance: none;background: rgba(0, 0, 0, 0);text-decoration: none;inline-size: 100%;position: relative;z-index: 0;height: 100%;font: inherit;
                                    padding-inline-start: var(--_leading-space);padding-inline-end: var(--_trailing-space);color: var(--_label-text-color);cursor: pointer;outline: none;`);
                                    expander_pagination_button.addEventListener('mouseover', function() {
                                        expander_pagination_button.style.color = "var(--brand_blue)";
                                    });
                                    expander_pagination_button.addEventListener('mouseout', function() {
                                        expander_pagination_button.style.color = "var(--_label-text-color)";
                                    });
                                }
                            }
                        }


                        //回复列表
                        let comment_reply_lists;
                        //console.log(comment_reply_lists.length);
                        async function imsolazey(){
                            comment_reply_lists = expander.querySelectorAll("bili-comment-reply-renderer");
                            if(comment_reply_lists.length == 0 || comment_reply_lists == null){ //如果0人回复就跳过
                                return;
                            }
                            for(let comment_reply_list of comment_reply_lists){ //检查回复列表是否全部加载完成
                                let commentbody = comment_reply_list.shadowRoot.querySelector("div[id='body']");
                                if(commentbody == null){
                                    await delay(10);
                                    //console.log('重试');
                                    imsolazey(div);
                                    return;
                                }
                            }
                            //console.log('好了吗?');
                        }

                        await imsolazey();
                        for(let comment_reply_list of comment_reply_lists){
                            //console.log(comment_reply_list);
                            fixusercomment(comment_reply_list,true)
                        }
                        //console.log('好了');
                        checkreplyupdataworking = false;
                    }

                }

            }
            working = false;
            console.log('当前监听器总数: '+ mainobservers.length);
        }

        //修复用户评论部分
        function fixusercomment(bili_comment_renderer,isreply = false){
            let commentbody = bili_comment_renderer.shadowRoot.querySelector("div[id='body']");
            if(commentbody == null){
                //console.log(bili_comment_renderer);
                //debugger;
                //还没加载完
                return false;
            }
            if(commentbody.getAttribute('fixed') == 'true'){
                //不弄了 (╯‵□′)╯︵┻━┻
                return;
            }
            let bili_comment_user_info = commentbody.querySelector("bili-comment-user-info");
            bili_comment_user_info.setAttribute('style',`--bili-comment-user-info-name-color: var(--text2);`);
            let commentmain = commentbody.querySelector("div[id='main']");
            fixusericon(bili_comment_renderer,true); //用户头像

            if(isreply == false){
                commentbody.setAttribute('style',`position: relative;padding-left: 80px;padding-top: 22px;--bili-comment-hover-more-display: none;`);
                commentmain.setAttribute('style',`width: 100%;`);
                const bili_avatar1 = bili_comment_renderer.shadowRoot.querySelector('#user-avatar bili-avatar');
                const canvas1 = bili_avatar1.shadowRoot.querySelector('div[id="canvas"]');
                const obusericon = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((addedNode) => {
                                //console.log('用户头像更新啦~~~');
                                if(fixusericon(bili_comment_renderer,true) > 1){
                                    obusericon.disconnect(); //记得释放监听器
                                }
                            });
                        }
                    });
                });
                obusericon.observe(canvas1, {childList: true,});
            }
            else{
                commentbody.setAttribute('style',`position: relative;padding: 8px 0 8px 34px;border-radius: 4px;--bili-comment-hover-more-display: none;`);
                commentmain.setAttribute('style',`width: 100%;display: block;overflow: hidden;`);
            }
            //用户名称
            let header = commentbody.querySelector("div[id='header']");
            if(header != null){
                header.setAttribute('style',`margin-bottom: 4px;`);
            }
            let info = bili_comment_user_info.shadowRoot.querySelector("div[id='info']");
            /*if(info == null){
                console.log(commentbody);
                debugger;
            }*/
            info.setAttribute('style',`display: inline-flex;align-items: center;`);
            let user_name = info.querySelector("div[id='user-name']");
            user_name.setAttribute('style',`color: var(--bili-comment-user-info-name-color);font-size: var(--bili-comments-font-size-name, 13px);font-weight: 500;`);
            let user_name_a = info.querySelector("a");
            let user_name_color = user_name_a.style.color;
            if(user_name_color == null || user_name_color == ""){
                user_name_color = "inherit";
            }
            user_name_a.setAttribute('style', `color: ` + user_name_color +
            `;text-decoration-line: none;text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;`);
            let user_level = info.querySelector("div[id='user-level']"); //用户等级
            user_level.setAttribute('style',`margin-left: 5px;width: 30px;height: 30px;`);
            let user_medal = info.querySelector("div[id='user-medal']"); //原始粉丝 & 粉丝拍
            if(user_medal != null){
                let bili_comment_user_medal = user_medal.querySelector("bili-comment-user-medal");
                let contractor = bili_comment_user_medal.shadowRoot.querySelector("div[id='contractor']");
                if(contractor != null){
                    contractor.setAttribute('style',contractor.getAttribute('style') +
                    `height: 12px;padding: 0px 2px;border-radius: 2px;border-width: 0.5px;border-style: solid;box-sizing: border-box;`);
                    let name = contractor.querySelector("div[id='name']");
                    name.setAttribute('style',name.getAttribute('style') + `height: 11px;position: relative;display: flex;justify-content: center;align-items: center;`);
                    let name_text = contractor.querySelector("div[id='name-text']");
                    name_text.setAttribute('style',`position: absolute;top: 50%;left: 50%;white-space: nowrap;transform: scale(0.5) translate(-50%, -50%);transform-origin: 0px 0px;font-size: 16px;`);
                }
                let fans = bili_comment_user_medal.shadowRoot.querySelector("div[id='fans']");
                if(fans != null){
                    fans.setAttribute('style',fans.getAttribute('style') +
                    `;display: flex;align-items: center;margin-left: 5px;`);
                    let icon = fans.querySelector("div[id='icon']"); //大航海的 icon
                    if(icon != null){
                        icon.setAttribute('style',icon.getAttribute('style') + `display: flex;align-items: center;position: relative;`);
                        let first_icon = fans.querySelector("img[id='first-icon']");
                        first_icon.setAttribute('style',`position: absolute;left: -8px;width: 20px;height: 20px;`);
                    }
                    let bili_fans_medal;
                    async function waitbili_fans_medal(){
                        bili_fans_medal = fans.querySelector("div.bili-fans-medal");
                        if(bili_fans_medal == null){ //重試
                            await delay(10);
                            waitbili_fans_medal();
                            return;
                        }
                        else{
                            bili_fans_medal.setAttribute('style', bili_fans_medal.getAttribute('style') + ``);
                        }
                    }

                    //waitbili_fans_medal();
                }
            }
            let user_up = info.querySelector("div[id='user-up']"); //Up主标识
            if(user_up != null){
                user_up.setAttribute('style',`width: 24px;height: 24px;`);
            }
            let ornament = commentbody.querySelector("div[id='ornament']");
            if(ornament != null){ //评论背景小卡片
                ornament.setAttribute('style',ornament.getAttribute('style') + `position: absolute;right: 0px;top: 7px;user-select: none;`);
                let bili_comment_user_sailing_card = commentbody.querySelector("bili-comment-user-sailing-card");
                let card = bili_comment_user_sailing_card.shadowRoot.querySelector("div[id='card']");
                card.setAttribute('style',`width: 288px;height: 48px;position: relative;overflow: hidden;user-select: none;`);
                //默認[評論模板是帶有 #ornament 容器的, 但是 .cardBGRoot 並不存在, 僅當解析數據之後才會添加或者移除
                let cardBGRoot;
                async function waitcardBGRoot(){
                    if(card == null){ //上級容器沒了, 説明沒有小卡片
                        cardBGRoot = -1;
                        return;
                    }
                    cardBGRoot = card.querySelector("div div");
                    if(cardBGRoot == null){ //重試
                        //debugger;
                        await delay(10);
                        waitcardBGRoot();
                        return;
                    }
                    else{ //有小卡片
                        cardBGRoot.setAttribute('style',`height: 100%;max-width: 100%;`);
                        let cardBG = card.querySelector("div div div");
                        cardBG.setAttribute('style',`display: inline-block;position: relative;user-select: none;height: 48px;max-width: 288px;overflow: hidden;`);
                        let cardnum = card.querySelector("div div div div");
                        if(cardnum != null){
                            cardnum.setAttribute('style',cardnum.getAttribute('style') +
                            `position: absolute;right: 0;top: 0;height: 100%;font-size: 13px;line-height: 16px;transform: scale(.7);transform-origin: center center;
                            display: flex;flex-direction: column;justify-content: center;align-items: flex-start;`);
                        }
                    }
                }
                waitcardBGRoot();

            }
            //评论文本
            let content = commentbody.querySelector("div[id='content']");
            if(content != null){
                content.setAttribute('style',`font-size: var(--bili-comments-font-size-content);line-height: var(--bili-comments-line-height-content);color: var(--text1);width: 100%;
                display: block;overflow: hidden;`);
            }
            let bili_rich_text = commentbody.querySelector("bili-rich-text");
            if(isreply == true){
                bili_rich_text.setAttribute('style',`--bili-rich-text-line-height: 24px;--bili-rich-text-link-color: var(--Lb6);--bili-rich-text-display: inline;font-family: var(--bili-font-family);
                --bili-rich-text-icon-vertical-align: sub;--bili-rich-text-link-color: var(--text_link, #008AC5);--bili-rich-text-link-color-hover: var(--brand_blue, #00AEEC);
                --icon-vertical-align: var(--bili-rich-text-icon-vertical-align);color: var(--bili-rich-text-color, var(--text1, #18191C));font-size: var(--bili-rich-text-font-size, 15px);
                line-height: var(--bili-rich-text-line-height, 21px);--bili-rich-text-white-space: pre-line;--bili-rich-text-word-break: break-word;`);
            }
            else{
                bili_rich_text.setAttribute('style',`--bili-rich-text-display: inline;--bili-rich-text-white-space: pre-line;--bili-rich-text-word-break: break-word;
                --bili-rich-text-icon-vertical-align: sub;--bili-rich-text-link-color-hover: var(--brand_blue, #00AEEC);--bili-rich-text-link-color: var(--Lb6);
                --icon-vertical-align: var(--bili-rich-text-icon-vertical-align);color: var(--bili-rich-text-color, var(--text1, #18191C));font-size: var(--bili-rich-text-font-size, 15px);
                line-height: var(--bili-rich-text-line-height, 21px);font-family: var(--bili-font-family);--bili-rich-text-font-size: var(--bili-comments-font-size-content);
                --bili-rich-text-line-height: var(--bili-comments-line-height-content);`);
            }

            async function fixcontents(){ //如果文本是空白的话, 先等等
                let contents_temp = bili_rich_text.shadowRoot.querySelector("p[id='contents']");
                if(contents_temp.hasChildNodes() == true){
                    //麻烦, 明明已经把文本给更新完了, 破北站还得重新检索 "搜索词" 再创建 <a> 标签. aaa, 不管了, 直接搬出去不给用23333
                    let contents = document.createElement('p');
                    contents.setAttribute('id','contents');
                    contents.innerHTML = contents_temp.innerHTML;
                    contents_temp.setAttribute('fixed','old');
                    contents_temp.style.display = 'none';
                    bili_rich_text.shadowRoot.appendChild(contents);
                    contents.setAttribute('style',`margin-block-start: 0;margin-block-end: 0;margin-inline-start: 0;margin-inline-end: 0;display: var(--bili-rich-text-display);
                    white-space: var(--bili-rich-text-white-space);word-break: var(--bili-rich-text-word-break);-webkit-font-smoothing: antialiased;`);

                    //链接
                    let bili_rich_links = contents.querySelectorAll("a");
                    if(bili_rich_links != null){
                        for(let bili_rich_link of bili_rich_links){
                            bili_rich_link.setAttribute('style',bili_rich_link.getAttribute('style') + `;color: var(--bili-rich-text-link-color);
                            text-decoration: none;background-color: transparent;cursor: pointer;`);
                            async function fffff(){
                                let bili_rich_link_i = bili_rich_link.querySelector("i"); //icon没加载完就先等等
                                if(bili_rich_link_i != null){
                                    await delay(10);
                                    fffff();
                                    return;
                                }
                                let bili_rich_link_icon = bili_rich_link.querySelector("bili-icon");
                                if(bili_rich_link_icon != null){
                                    bili_rich_link_icon.setAttribute('style',`display: inline-flex;align-items: center;vertical-align: var(--bili-rich-text-icon-vertical-align);`);
                                }
                            }
                            fffff();

                            //视频播放时间跳转
                            if(bili_rich_link.getAttribute('data-type') == "seek"){
                                let video = document.querySelector('video');
                                bili_rich_link.addEventListener('click', function(){
                                    video.currentTime = bili_rich_link.getAttribute('data-video-time');
                                    video.play();
                                });
                            }
                        }
                    }
                    //<i>標簽, 一般是圖標
                    function createicon(type){
                        let img = document.createElement('img');
                        img.setAttribute('loading','lazy');
                        img.setAttribute('style','width:1.2em;height:1.2em;vertical-align:var(--icon-vertical-align);');
                        switch(type){
                            case 'BDC/video_circle_line/1':
                                img.src = "https://i0.hdslb.com/bfs/activity-plat/static/20201110/4c8b2dbaded282e67c9a31daa4297c3c/AeQJlYP7e.png";
                                break;
                            case 'BDC/chain_link_line/1':
                                img.src = "https://i0.hdslb.com/bfs/activity-plat/static/20221115/33208db4c24eef2890df876c57cc4123/FpFTK6bncr.png";
                                break;
                        }
                        return img
                    }
                    let i_s = contents.querySelectorAll("i");
                    if(i_s.length > 0){
                        for(let t of i_s){
                            if(t.classList.length < 1){
                                continue;
                            }
                            t.replaceWith(createicon(t.classList[t.classList.length - 1]));
                        }
                    }
                    //表情或者其他 <img> 標簽
                    let imgs = contents.querySelectorAll("img");
                    if(imgs.length > 0){
                        for(let img of imgs){
                            let imgstyle = '';
                            if(img.getAttribute('style') != null){
                                imgstyle = img.getAttribute('style');
                            }
                            img.setAttribute('style','display: inline-block;vertical-align: var(--bili-rich-text-icon-vertical-align);' + imgstyle);
                        }
                    }


                }
                else{
                    //console.log('先等等, 文本还是空白的');
                    await delay(10);
                    fixcontents();
                    return;
                }
            }

            fixcontents();

            //笔记那个图标
            let bili_rich_note = commentbody.querySelector("i[id='note']");
            if(bili_rich_note != null){
                bili_rich_note.setAttribute('style',`font-size: 12px;font-style: normal;width: 48px;height: 22px;display: inline-flex;justify-content: center;align-items: center;border-radius: 4px;
                color: var(--text3);background-color: var(--bg2);vertical-align: text-bottom;`);
                let bili_rich_note_bili_icon = bili_rich_note.querySelector("bili-icon");
                bili_rich_note_bili_icon.setAttribute('style',`display: inline-flex;align-items: center;`);
            }
            //评论带图
            let bili_rich_pictures = commentbody.querySelector("div[id='pictures']");
            if(bili_rich_pictures != null){
                bili_rich_pictures.setAttribute('style',`display: block;width: 100%;margin-top: 8px;`);
                let bili_comment_pictures_renderer = bili_rich_pictures.querySelector("bili-comment-pictures-renderer");
                let bili_comment_pictures_content = bili_comment_pictures_renderer.shadowRoot.querySelector("div[id='content']");
                bili_comment_pictures_content.setAttribute('style',`position: relative;display: flex;flex-wrap: wrap;gap: 4px;max-width: 364px;`);
                let bili_comment_picturess = bili_comment_pictures_content.querySelectorAll("img");
                for(let bili_comment_picturesss of bili_comment_picturess){
                    bili_comment_picturesss.setAttribute('style',`display: block;border-radius: var(--bili-comment-picutres-border-radius, 6px);cursor: zoom-in;`);
                    //如果开启了去除图像后缀的脚本的话
                    if(window.bilifiximg == true){
                        bili_comment_picturesss.src = bili_comment_picturesss.src.substring(0, bili_comment_picturesss.src.indexOf('@'));
                        bili_comment_picturesss.style.objectFit = 'cover';
                    }
                }
            }
            //置顶
            let bili_rich_top = commentbody.querySelector("i[id='top']");
            if(bili_rich_top != null){
                bili_rich_top.setAttribute('style',`display: inline-flex;justify-content: center;align-items: center;position: relative;width: 30px;height: 18px;border: 1px solid var(--brand_pink);
                border-radius: 3px;color: var(--brand_pink);vertical-align: text-bottom;margin-bottom: 0.0666em;font-size: 12px;font-style: normal;`);
            }
            //展开全文
            let bili_rich_expand = commentbody.querySelector("span[id='expand']");
            if(bili_rich_expand != null){
                bili_rich_expand.setAttribute('style',`color: var(--brand_blue);cursor: pointer;`);
            }

            //日期, IP属地, 点赞量, 回复
            let footer = commentbody.querySelector("div[id='footer']");
            let bili_comment_action_buttons_renderer = footer.querySelector("bili-comment-action-buttons-renderer");
            bili_comment_action_buttons_renderer.setAttribute('style',`width: 100%;display: flex;align-items: center;position: relative;margin-top: 3px;font-size: 13px;color: var(--text3);`);
            let pubdate = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='pubdate']");
            pubdate.setAttribute('style',`display: flex;align-items: center;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            let location = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='location']");
            if(location != null){
                location.setAttribute('style',`margin-left: 20px;display: flex;align-items: center;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            }
            let like = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='like']");
            like.setAttribute('style',`margin-left: 20px;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            //like.setAttribute('style',`margin-left: 20px;display: flex;align-items: center;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            let likebutton = like.querySelector("button");
            likebutton.setAttribute('style',`padding: 0;outline: none;border: none;background: transparent;height: 24px;font-size: 13px;color: var(--text3);display: inline-flex;
            align-items: center;cursor: pointer;`);
            let likebuttonicon = like.querySelector("bili-icon");
            likebuttonicon.setAttribute('style',likebuttonicon.getAttribute('style') + `display: inline-flex;align-items: center;`);
            let likebuttonnum = like.querySelector("span[id='count']");
            likebuttonnum.setAttribute('style',`margin-left: 5px;display: inline-block;`);
            let dislike = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='dislike']");
            dislike.setAttribute('style',`margin-left: 20px;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            let dislikebutton = dislike.querySelector("button");
            dislikebutton.setAttribute('style',`padding: 0;outline: none;border: none;background: transparent;height: 24px;font-size: 13px;color: var(--text3);display: inline-flex;
            align-items: center;cursor: pointer;`);
            let dislikebuttonicon = dislike.querySelector("bili-icon");
            dislikebuttonicon.setAttribute('style',dislikebuttonicon.getAttribute('style') + `display: inline-flex;align-items: center;`);
            let reply = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='reply']");
            reply.setAttribute('style',`margin-left: 20px;display: flex;align-items: center;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            let replybutton = reply.querySelector("button");
            replybutton.setAttribute('style',`padding: 0;outline: none;border: none;background: transparent;height: 24px;font-size: 13px;color: var(--text3);display: inline-flex;
            align-items: center;cursor: pointer;`);
            //三个点
            let more = bili_comment_action_buttons_renderer.shadowRoot.querySelector("div[id='more']");
            more.setAttribute('style',`margin-left: auto;margin-right: 20px;width: 24px;height: 24px;position: relative;`);
            let morebutton = more.querySelector("button");
            morebutton.setAttribute('style',`width: 24px;height: 24px;text-align: center;padding: 0;outline: none;border: none;background: transparent;font-size: 13px;
            color: var(--text3);align-items: center;cursor: pointer;display: none;`);
            let bili_comment_menu = more.querySelector("bili-comment-menu");
            bili_comment_menu.setAttribute('style',`width: 100%;display: flex;align-items: center;position: relative;margin-top: 0px;font-size: 13px;color: var(--text3);`);
            let more_options = bili_comment_menu.shadowRoot.querySelector("ul[id='options']");
            more_options.setAttribute('style',`display: none;position: absolute;top: 20px;right: 0;overflow: hidden;margin: 0;
            padding: 0;z-index: 10;width: 120px;list-style: none;border-radius: 4px;font-size: 14px;color: var(--text2);background-color: var(--bg1_float);box-shadow: 0 0 5px #0003;`);
            let more_optionss = more_options.querySelectorAll("li");
            for(let option of more_optionss){
                option.setAttribute('style',`box-sizing: border-box;width: 100%;display: flex;align-items: center;height: 36px;padding: 0 15px;cursor: pointer;user-select: none;`);
            }
            //up觉得很赞
            let tags = commentbody.querySelector("div[id='tags']");
            if(tags != null){
                tags.setAttribute('style',`margin-top: 6px;display: flex;align-items: center;`);
                let tag = tags.querySelector("div.tag");
                tag.setAttribute('style',tag.getAttribute('style') +
                `--bili-comment-tag-color: var(--bili-comment-tag-color-light);--bili-comment-tag-bg: var(--bili-comment-tag-bg-light);font-size: 12px;line-height: 1;
                color: var(--bili-comment-tag-color, --brand_pink);background-color: var(--bili-comment-tag-bg, ----brand_pink_thin);padding: 6px;border-radius: 2px;box-sizing: border-box;`);
            }

            //鼠标移入移出动画
            if(isreply == false){
                commentmain.addEventListener('mouseover', function() {
                    morebutton.style.display = "inline";
                });
                commentmain.addEventListener('mouseout', function() {
                    morebutton.style.display = "none";
                });
            }
            else{
                commentbody.addEventListener('mouseover', function() {
                    morebutton.style.display = "inline";
                });
                commentbody.addEventListener('mouseout', function() {
                    morebutton.style.display = "none";
                });
            }
            likebutton.addEventListener('mouseover', function() {
                likebutton.style.color = "var(--brand_blue)";
            });
            likebutton.addEventListener('mouseout', function() {
                likebutton.style.color = "var(--text3)";
            });
            dislikebutton.addEventListener('mouseover', function() {
                dislikebutton.style.color = "var(--brand_blue)";
            });
            dislikebutton.addEventListener('mouseout', function() {
                dislikebutton.style.color = "var(--text3)";
            });
            replybutton.addEventListener('mouseover', function() {
                replybutton.style.color = "var(--brand_blue)";
            });
            replybutton.addEventListener('mouseout', function() {
                replybutton.style.color = "var(--text3)";
            });
            morebutton.addEventListener('mouseover', function() {
                morebutton.style.color = "var(--brand_blue)";
            });
            morebutton.addEventListener('mouseout', function() {
                morebutton.style.color = "var(--text3)";
            });
            morebutton.addEventListener('click', function() {
                more_options.style.display = "inline";
            });
            more_options.addEventListener('mouseout', function() {
                more_options.style.display = "none";
            });
            //那个点赞点踩还得修改 style 属性值呀
            function clicklikeordislikeplus(){
                likebuttonicon.style.display = "inline-flex";
                likebuttonicon.style.alignItems = "center";
                dislikebuttonicon.style.display = "inline-flex";
                dislikebuttonicon.style.alignItems = "center";
            }
            async function clicklikeordislike(){
                await delay(100);
                clicklikeordislikeplus();
                await delay(500);
                clicklikeordislikeplus();
                await delay(1000);
                clicklikeordislikeplus();
            }
            likebutton.addEventListener('click', clicklikeordislike );
            dislikebutton.addEventListener('click', clicklikeordislike );

            //修完了标记一下
            commentbody.setAttribute('fixed','true');
        }

        fixtextbox(bili_comment_box);
        let working = false;
        let mainobservers = new Array();

        console.log('开始监听');

        async function checkcommentlist(){
            try{
                findcomment(feed);
            }
            catch (ex){
                await delay(1000);
                console.log('错误: \n' + ex.stack);
                checkcommentlist();
            }
        }

        //监听评论列表刷新
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        if(working == false || working == 2){
                            working = true;
                            checkcommentlist();
                        }
                    });

                    mutation.removedNodes.forEach((removedNode) => {
                        if(working == false){
                            working = 2;
                            console.log('评论区变更');
                            let dismainobserverssnum = mainobservers.length;
                            for(let mainobserverss of mainobservers){
                                mainobserverss.disconnect();
                            }
                            mainobservers = new Array();
                            console.log('已清除 ' + dismainobserverssnum + ' 个监听器');
                            //checkcommentlist();
                        }
                    });
                }
            });
        });
        observer.observe(feed, {childList: true,});

        //判断是否到达底部 判断评论区是否被重置
        function check2bottomplus(){ // '没有更多评论'
            let contents_end = bilicomment.shadowRoot.querySelector("div[id='end']");//是否到底
            if(contents_end != null){
                let bottombar = contents_end.querySelector("div.bottombar");
                if(contents_end.className == 'limit'){ //动态首页和个人主页, 这两个地方底部边距矮一点
                    bottombar.setAttribute('style',`padding-bottom: 20px;width: 100%;margin-top: 20px;font-size: 13px;color: var(--text3);text-align: center;user-select: none;`);
                }
                else{
                    bottombar.setAttribute('style',`padding-bottom: 100px;width: 100%;margin-top: 20px;font-size: 13px;color: var(--text3);text-align: center;user-select: none;`);
                }
                console.log("见底啦~~~");
            }
        }
        function shutoffcomment(aaaaa){ //关闭评论区
            //if(aaaaa == 'DIV' && removedDOMaction == false){
            if(aaaaa == '#comment' && removedDOMaction == false){
                removedDOMaction = true;
                for(let mainobserverss of mainobservers){ //清除全部监听器
                    mainobserverss.disconnect();
                }
                observer.disconnect();
                check2bottom.disconnect();
                bilicomment.setAttribute('fixed','false');
                console.log('评论区被重置 & 关闭!');
            }
        }
        let removedDOMaction = false;
        const check2bottom = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        //console.log('让我看看');
                        check2bottomplus();
                    });
                    mutation.removedNodes.forEach((removedNode) => {
                        //console.log(removedNode);
                        //console.log(removedNode.nodeName);
                        //console.log(removedNode.nodeValue);
                        //if(removedNode.getAttribute('id') == 'contents'){ //如果评论列表没了, 说明整个评论区被充值了
                        shutoffcomment(removedNode.nodeName);
                    });
                }
            });
        });
        check2bottom.observe(bilicomment.shadowRoot, {childList: true,});
        check2bottomplus(); //一上来就看看是否到底部

        findcomment(feed); //扫描评论列表

        async function audel(){ //啊, 怎么会有评论区一打开就手动关闭的情况欸
            //await delay(1000);
            let aaa = bilicomment.getBoundingClientRect();
            //console.log(aaa);
            if(aaa.bottom == 0 && aaa.height == 0 && aaa.left == 0 && aaa.right == 0 && aaa.top == 0 && aaa.width == 0 && aaa.x == 0 && aaa.y == 0){
               //console.log('你是不是把品论去给关了!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                shutoffcomment("DIV");
            }
        }
        audel();
    }

    //修复主函数
    async function runfixbilicomment(bilicomment){
        let commmentstate;
        async function tryfix(){
            commmentstate = ''; //记得在每次重试时, 先重置状态
            try{
                commmentstate = fixbilicomment(bilicomment);
                if(commmentstate == false){
                    console.log('重试 [文本框部分]');
                    await delay(1000);
                    tryfix();
                    return;
                }
                if(commmentstate != 'disable'){
                    tryfixlist();
                }
            }
            catch (ex){
                console.log("重试\n" + ex.stack);
                await delay(1000);
                tryfix();
            }
        }
        async function tryfixlist(){
            try{
                if(fixcommentlist(bilicomment) == false){
                    console.log('重试 [评论区列表部分]');
                    await delay(1000);
                    tryfixlist();
                    return;
                }
            }
            catch (ex){
                console.log("重试\n" + ex.stack);
                await delay(1000);
                tryfixlist();
            }
        }

        tryfix();

    }

    //查找评论区本体
    function findshadowDOMcomments(){
        if(window.debug_comment == false){
            return;
        }

        const biliCommentsElements = document.querySelectorAll('bili-comments');
        if(biliCommentsElements.length == 0){
            return;
        }
        //console.log(biliCommentsElements.length)
        for(let bilicomment of biliCommentsElements){
            if(bilicomment.getAttribute('fixed') == 'true'){
                continue;
            }
            bilicomment.setAttribute('fixed','true')
            runfixbilicomment(bilicomment);
        }
    }

    //重复运行
    (async function autorun() {
        await findshadowDOMcomments();
        setTimeout(autorun, 1000);
    })();

    // 你按了 Ctrl + S 对吧? 用来删除多余用户资讯小卡片
    function setdivhide(){
        delAD();
        let bili_user_profiles = document.querySelectorAll('bili-user-profile');
        if(bili_user_profiles.length > 0){
            for(let bili_user_profile of bili_user_profiles){
                bili_user_profile.style.display = 'none';
            }
        }
        if(sethidearray.length > 0){
            for(let div of sethidearray){
                if(div != null){
                    //console.log(div);
                    div.style.display = 'none';
                    //div.setAttribute('style',div.getAttribute('style') + `display:none;`);
                }
            }
        }
    }
    function handleKeyPress(event) {
        if (event.ctrlKey && event.keyCode === 83) {
            setdivhide();
        }
    }
    document.addEventListener('keydown', handleKeyPress, true);
    delAD();

})();