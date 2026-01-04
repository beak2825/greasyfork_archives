// ==UserScript==
// @name         林子卡顿修复和功能优化
// @namespace    http://your.homepage/
// @version      0.10
// @description  林子卡顿修复和功能优化。
// @author       JMRY
// @match        https://*/video_list.php*
// @match        https://*/video_detail_old.php*
// @match        https://*/video_detail.php*
// @match        https://yhbsy.app/*
// @match        https://www.yaohuba.com/*
// @match        https://yaohuba.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499517/%E6%9E%97%E5%AD%90%E5%8D%A1%E9%A1%BF%E4%BF%AE%E5%A4%8D%E5%92%8C%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499517/%E6%9E%97%E5%AD%90%E5%8D%A1%E9%A1%BF%E4%BF%AE%E5%A4%8D%E5%92%8C%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/*
0.10
- 优化原创标记算法，自动写入作者。
0.9
- 加入视频列表显示上传时间功能。
- 加入视频列表复制名字功能。
- 优化视频列表显示效果。
0.8.1
- 修复标题信息丢失的bug。
0.8 20240127
- 加入新域名的处理。
- 加入详情显示上传时间功能。
- 优化暗黑模式和普通模式页面显示。
- 优化中键点击头像右侧视频、图片的体验。
0.7 20240118
- 修复不兼容早期视频图片文件名的bug。
0.6 20240105
- 加入视频列表样式优化。
- 修复&等符号被替换成转义符的bug。
0.5 20240101
- 加入上传时间捕获功能。
0.4 20230624
- 对新版页面进行诸多改进。
- 加入标题加粗效果。
- 加入显示作者功能，并可点击链接打开作者主页。
- 加入描述中带格式的显示功能。
- 加入自动去除促销文本的功能。
- 加入显示购买状态的提示文字。

0.3 20230608
- 修复“+关注我”未被替换的bug。

0.2 20230604
- 实现一键复制标题功能。
- 从数据丢失事故中重写。
*/
(function(){
    let blackListKeywords=[
        {origin:` -取消关注`,target:``},
        {origin:` +关注我`,target:``},
        {origin:` 原创原创`,target:`原创`},
    ];

    let customStyles=`
        textarea{
            resize:none;
            border:none;
            outline:none;
            width:100%;
            word-wrap:break-word;
            word-break:break-all;
            opacity:0.5;
            background:transparent;
        }
        .videoTitle{
            font-size:16px;
            white-space:normal;
            text-align:left;
            padding-left:8px;
            padding-right:8px;
            font-weight:bolder;
            border-bottom: 6px solid transparent;
        }
        .videoContent{
            font-weight:normal;
        }
        .videoAuthor{
            color:#007bff;
        }
        .videoAuthor:hover{
            color:#0056b3 !important;
        }
        /*针对视频页排序混乱的问题修正*/
        .item_video.isotope-item{
            position:unset !important;
            left:auto !important;
            top:auto  !important;
            transform:unset !important;
        }
        .container_page_1.isotope{
            height:auto !important;
            overflow:unset !important;
        }
        .video_duration, .save_to_icon{
            position:static !important;
            text-align:center !important;
        }
        .item_video_yuanchuang{
            position:relative !important;
            margin-top: -58px !important;
            top: 88px !important;
        }
        .new_video_icon{
            position: static !important;
            margin-top: -25px !important;
        }
    `;
    //新域名的处理
    const fetiSale=`FetiSale`;
    $(`title`).html($(`title`).html().replaceAll(`妖狐吧`,fetiSale));
    $(`.logo-text`).html(fetiSale);
    $(`.logo`).children(`img`).attr(`src`,`https://www.fetisale.com/images/logo/fetisale.png`);
    $(`link[rel=icon]`).attr(`href`,`https://www.fetisale.com/fav_fetisale.png`);

    //去除视频列表过长的title，防止卡顿
    $('*').attr('title','');
    //去除领金币功能
    $(`#fuli_container`).remove();
    //插入自定义样式
    $(`body`).append(`<style id="customStyles">${customStyles}</style>`);
    $(`body`).append(`<style id="dayNightStyles"></style>`);

    //明暗模式切换与监听
    applyDayNight();
    watchDayNight();

    //视频列表显示上传时间以及复制标题
    if(window.location.href.includes(`video_list.php`)){
        let videoEl=$(`.item_video`);
        for(let i=0; i<videoEl.length; i++){
            let cur=videoEl.eq(i);
            let curImgSrc=cur.children(`a`).children(`img`).attr(`src`);
            let curImgTime=getImgUploadTime(curImgSrc);
            console.log(curImgTime);
            if(curImgTime){
                cur.children(`.video_duration`).after(`<div class="video_duration video_uploadtime">上传时间：${curImgTime}</div>`);
            }
            let curLinkEl=cur.children(`.video_title`).children(`a`);
            let curLink=curLinkEl.attr(`href`);
            curLinkEl.after(`<button id="copyBu_${i}">复制名字</button>`);
            $(`#copyBu_${i}`).bind(`click`,function(){
                navigator.clipboard.writeText(curLinkEl.text().trim());
                $(`#copyBu_${i}`).html(`复制成功`);
            });
        }
    }

    //复制标题和内容功能
    let title=``;
    let content=``;
    let author=``;
    let newTitle=``;
    switch(true){
        //旧版页面
        case window.location.href.includes(`video_detail_old.php`):{
            title=trimBlacklist(trimHTML($(`h4`).eq(0).html()));
            content=trimBlacklist(trimHTML($(`.video_description`).html()));
            author=trimHTML($(`.uiu_username`).html().split(` [`)[0]);
            //处理标题中没有作者名的情况
            newTitle=title;
            /*
            if(!newTitle.includes(author)){
                newTitle=newTitle.replace(`[原创]`,`[${author}原创]`);
            }
            */
            newTitle=newTitle.replace(`[原创]`,`[${author}原创]`).replace(`原创原创`,`原创`);;
            //插入功能按钮
            $(`.video_detail_container_left`).prepend(`<button id="copyTitleBu">复制标题</button> <button id="copyOriginTitleBu">复制原始标题</button> <button id="copyFullBu">复制标题和内容</button>`);
            $(`.video_description`).after(`<textarea id="copyText"></textarea>`);
        }
        break;
        //新版页面
        case window.location.href.includes(`video_detail.php`):{
            //对标题的处理
            let titleElement=$(`.videoTitle`);
            let titleElementSpan=titleElement.children(`span`);
            let titleText=titleElement.html();
            if(titleElementSpan.length>1){ //有促销的情况
                titleText=titleText.replaceAll(titleElementSpan.eq(1).prop(`outerHTML`),``);
            }
            title=trimBlacklist(trimHTML(titleText));
            content=trimBlacklist(trimHTML($(`.descript_content`).html()));

            author=trimHTML($(`div[alt=uploader]`).children().eq(1).children().eq(0).html().trim().split(` [`)[0]);
            let authorUid=$(`div[data-uid]`).attr(`data-uid`);
            let videoInfo=$(`.video_baseinfo`).html();
            let boughtTag=$(`.favNavChildren2`).html().includes(`[已购]`);
            //处理标题中没有作者名的情况
            newTitle=title;
            /*
            if(!newTitle.includes(author)){
                newTitle=newTitle.replace(`[原创]`,`[${author}原创]`);
            }
            */
            newTitle=newTitle.replace(`[原创]`,`[${author}原创]`).replace(`原创原创`,`原创`);
            //处理上传时间
            //采用首张图片的文件名来捕获上传时间
            let firstImgUrl=$(`.preview-picture-slide`).eq(0).children(`img`).attr(`src`);
            let uploadTime=getImgUploadTime(firstImgUrl);
            if(uploadTime){
                uploadTime=`&nbsp;&nbsp;&nbsp;上传时间：${uploadTime}`;
            }
            //插入功能按钮
            $(`.videoTitle`).prepend(`<button id="copyTitleBu">复制标题</button> <button id="copyOriginTitleBu">复制原始标题</button> <button id="copyFullBu">复制标题和内容</button><br>`);
            $(`.videoTitle`).append(`<br>
            作者：<a href="video_list.php?uid=${authorUid}" class="videoContent videoAuthor" target="_blank" one-link-mark="no">${author}</a><br>
            <span class="videoContent">${$(`.descript_content`).html()}<br><br>
            ${videoInfo}${uploadTime}&nbsp;&nbsp;&nbsp;${boughtTag==true?`<span style="color:green;">已购买`:`<span style="color:red;">未购买`}</span>
            </span>`);
            $(`.videoTitle`).append(`<textarea id="copyText"></textarea>`);
            $(`.video_baseinfo`).html(`${videoInfo}${uploadTime}`);

            //用户视频、图片链接优化
            $('body').mousedown(function(e){if(e.button==1)return false});
            $(".interactToUserVideo").mouseup(function (e) {
                if (e.which == 2) {
                    console.log(e);
                    e.preventDefault();
                    e.stopPropagation();
                    var uid = $(this).parent().data("uid");
                    window.open('./video_list.php?uid=' + uid);
                    return false;
                }
            });
            $(".interactToUserPic").mouseup(function (e) {
                if (e.which == 2) {
                    e.preventDefault();
                    e.stopPropagation();
                    var uid = $(this).parent().data("uid");
                    window.open('./home.php?uid=' + uid);
                    return false;
                }
            });
        }
        break;
    }

    //绑定事件
    $(`#copyText`).after(`<span id="textCount"></span>`);
    $(`#copyTitleBu`).bind(`click`,function(){
        $(`#copyText`).val(newTitle.escapeHTML());
        copyText();
    });
    $(`#copyOriginTitleBu`).bind(`click`,function(){
        $(`#copyText`).val(title.escapeHTML());
        copyText();
    });
    $(`#copyFullBu`).bind(`click`,function(){
        $(`#copyText`).val(`${newTitle} ${content}`.escapeHTML());
        copyText();
    });

    function getImgUploadTime(src){
        let firstImgUrlSplit=src.split(`/`);
        let firstImgName=firstImgUrlSplit[firstImgUrlSplit.length-1];
        let firstImgNameSplit=firstImgName.split(`_`);
        if(firstImgNameSplit.length>3){ // 对于长度大于3的情况，删除前面的部分
            for(let i=0; i<firstImgNameSplit.length-3; i++){
                firstImgNameSplit.shift();
            }
        }
        let uploadTime=``;
        if(!isNaN(firstImgNameSplit[0]) && !isNaN(firstImgNameSplit[1])){
            let date=firstImgNameSplit[0];
            let time=firstImgNameSplit[1];
            uploadTime=`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)} ${time.slice(0,2)}:${time.slice(2,4)}:${time.slice(4,6)}`;
        }
        return uploadTime;
    }

    function watchDayNight(){
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                console.log('发生变化的元素：', mutation.target);
                console.log('变化类型：', mutation.type);
                applyDayNight();
            });
        });
        const switchColor=document.getElementById(`swich_color`);
        observer.observe(switchColor, {
            attributes: true,
        });
    }

    function applyDayNight(){
        let dayNightStyles=``;
        //夜间模式判断
        let color=`day`;
        if($(`#swich_color`).length>0 && $(`#swich_color`).attr(`href`).includes(`night`)){
            color=`night`;
        }
        if(color==`day`){
            dayNightStyles=`
            .videoTitle, .column_side_on_video, .column_side_on_video, #cdn_server_flag_phone{
                background-color:transparent !important;
                color:#000 !important;
            }
            .videoTitle{
                border-bottom: 6px solid #000;
            }
            #container_player{
                background:transparent !important;
            }
            .jw-preview{
                background: transparent no-repeat 50% 50%;
            }
            `;
        }else{
            dayNightStyles=``;
        }
        $(`#dayNightStyles`).html(dayNightStyles);
    }

    function copyText(){
        let lengthLimit=110;
        $(`#textCount`).html($(`#copyText`).val().length + `字` + ($(`#copyText`).val().length>lengthLimit?`，不应长于${lengthLimit}字！`:``) );
        $(`#copyText`).select();
        document.execCommand(`copy`);
    }

    function trimHTML(text){
        return text.replace(/<[^>]+>/g, ``).trim();
    }

    function trimBlacklist(text){
        let temp=text;
        for(let i=0; i<blackListKeywords.length; i++){
            let cur=blackListKeywords[i];
            temp=temp.replaceAll(cur.origin,cur.target);
        }
        return temp;
    }

    String.prototype.replaceAll=function(org,tgt){
        return this.split(org).join(tgt);
    }
    String.prototype.convertHTML=function() {
        let str=this;
        const symbols = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&apos;"
        }
        for (const symbol in symbols) {
            if (str.indexOf(symbol) >= 0) {
                const newStr = str.replaceAll(symbol, symbols[symbol])
                return newStr
            }
        }
        return str;
    }
    String.prototype.escapeHTML=function() {
        let str=this;
        const symbols = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": "\"",
            "&apos;": "'"
        }
        for (const symbol in symbols) {
            if (str.indexOf(symbol) >= 0) {
                const newStr = str.replaceAll(symbol, symbols[symbol])
                return newStr
            }
        }
        return str;
    }
})();