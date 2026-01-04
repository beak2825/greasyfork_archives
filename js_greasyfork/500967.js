// ==UserScript==
// @name         CatEDU组内转种工具
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  CatEDU Int
// @author       CatEDU
// @match        http*://springsunday.net/upload.php*
// @match        http*://pterclub.com/upload.php*
// @match        http*://*.tjupt.org/upload.php*
// @match        http*://*.m-team.cc/upload*
// @match        http*://*.m-team.io/upload*
// @match        http*://star-space.net/p_torrent/video_upload.php*
// @match        http*://qingwapt.com/upload.php*
// @require      https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525
// @require      https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      Apache License 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500967/CatEDU%E7%BB%84%E5%86%85%E8%BD%AC%E7%A7%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/500967/CatEDU%E7%BB%84%E5%86%85%E8%BD%AC%E7%A7%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function helper(){
    //alert("")
    const catedu_subtitle = /CatEDU\s*([\u4e00-\u9fff]+)[ 第\*]+/i;
    const match_mediainfo = /^(.*)\[quote\][ \n\r]*?(General.*)\[\/quote\](.*)$/is;

    // SSD
    if (window.location.host == "springsunday.net" && window.location.pathname.includes("upload.php")){
        //let name = document.querySelector('input[name=name]').value.trim();
        //if (/H\.26/i.test(name)) document.querySelector('input[name=name]').value = name.replace("H.26", 'H26');

        let small_descr = document.querySelector('input[name=small_descr]').value.trim();

        document.querySelector('input[type="checkbox"]#selfrelease').checked = true;
        document.querySelector('input[type="checkbox"]#exclusive').checked = true;
        target_value_save(document.querySelector('select[name="team_sel"]'), 13);
        document.querySelector('input[type="checkbox"]#pack').checked = /期/i.test(small_descr)?false:true;
        document.querySelector('input[type="checkbox"][name="uplver"]').checked = true;

        let source_sel = document.querySelector('select[name="source_sel"]').value;
        const source_type = {0:false, 1:false, 3:false};
        if (/(国|双|三|四|多)[\u4e00-\u9fff]{0,5}语/i.test(small_descr) && !(source_sel in source_type)){
            document.querySelector('input[type="checkbox"]#mandarin').checked = true;
        }
        if (/中.?字/i.test(small_descr)){
            document.querySelector('input[type="checkbox"]#subtitlezh').checked = true;
        }
        let match = small_descr.match(catedu_subtitle);
        if (match){
            target_value_save(document.querySelector('select[name="type"]'), find_category("SSD", match[1]));
        }

        const ssd_descr = /\[img\](.+)\[\/img\]/i;
        let descr = document.querySelector('textarea[name="descr"]').value.trim();
        let descr_split = descr.split(ssd_descr);
        let douban = document.querySelector('input[name="url"]').value.trim();

        let url_vimages = document.querySelector('textarea[name="url_vimages"]').value.trim();
        if (url_vimages == ""){
            const regex = /https?:\/\/.+?\/(.+)/i;
            let fill = false;
            let matches = [];
            for (let value of descr_split) {
                if (regex.test(value)) {
                    match = value.match(regex);
                    if (match && match[1]) {
                        if (fill) matches.push(value);
                        if (match[1] == "images/GDJT.png") fill = true;
                    }
                }
            }
            document.querySelector('textarea[name="url_vimages"]').value = matches.join('\n')
        }

        if (douban.length == 0) {
            document.getElementsByTagName('iframe')[0].nextSibling.value = descr_split[0]+descr_split[2];
        }
        else {
            document.getElementsByTagName('iframe')[0].nextSibling.value = descr_split[0];
        }
    }
    //PTER
    else if (window.location.host == "pterclub.com" && window.location.pathname.includes("upload.php")){
        //let name = document.querySelector('input[name=name]').value.trim();
        //if (/H\.26/i.test(name)) document.querySelector('input[name=name]').value = name.replace("H.26", 'H26');

        let small_descr = document.querySelector('input[name=small_descr]').value.trim();
        let match = small_descr.match(catedu_subtitle);
        if (match){
            target_value_save(document.querySelector('select[name="type"]'), find_category("PTER", match[1]));
        }
        document.querySelector('input[type="checkbox"]#jinzhuan').checked = true;
        document.querySelector('input[type="checkbox"][name="uplver"]').checked = true;

        let descr = document.querySelector('textarea[name="descr"]').value.trim();
        if (match_mediainfo.test(descr)) {
            document.querySelector('textarea[name="descr"]').value = descr.replace(match_mediainfo, '$1[hide=mediainfo]\n$2[/hide]$3');
        }
    }
    //TJUPT
    else if (window.location.host == "www.tjupt.org" && window.location.pathname.includes("upload.php")){
        //let name = document.querySelector('input[name=name]').value.trim();
        //if (/H\.26/i.test(name)) document.querySelector('input[name=name]').value = name.replace("H.26", 'H26');

        let small_descr = document.querySelector('input[name=small_descr]').value.trim();
        let match = small_descr.match(catedu_subtitle);
        if (match){
            target_value_save(document.querySelector('select[name="type"]'), find_category("TJUPT", match[1]));
        }
        document.querySelector('input[type="checkbox"][name="internal_team"]').checked = true;
        document.querySelector('input[type="checkbox"][name="exclusive"]').checked = true;
        document.querySelector('input[type="checkbox"][name="uplver"]').checked = true;

        let language = document.querySelector('input[name=language]#language');
        if (/国[\u4e00-\u9fff]{0,3}语/i.test(small_descr)) {
            document.querySelector('input[type="checkbox"]#language1').checked = true;
            language.value += (language.value.trim() === '')?'国语':'/国语'
        }
        if (/英[\u4e00-\u9fff]{0,3}语/i.test(small_descr)) {
            document.querySelector('input[type="checkbox"]#language3').checked = true;
            language.value += (language.value.trim() === '')?'英语':'/英语'
        }

        alert('请补充 频道/国家/地区');
        $('#specificcat').parent().after(`<font size="3" color="red" class="notice"> 请补充 频道/国家/地区</font>`);
        //let r1 = doc.closest('').after(`<font color="red" class="notice"> 请补充 频道/国家/地区</font>`);

        let descr = document.querySelector('textarea[name="descr"]').value.trim();
        if (match_mediainfo.test(descr)) {
            document.querySelector('textarea[name="descr"]').value = descr.replace(match_mediainfo, '$1[mediainfo]\n$2[/mediainfo]$3');
        }

    }
    //QINGWA
    else if (window.location.host == "qingwapt.com" && window.location.pathname.includes("upload.php")){
        document.querySelector('input[type="checkbox"][value="1"]').checked = true;
        document.querySelector('input[type="checkbox"][value="9"]').checked = true;
        let name = document.querySelector('input[name=name]').value.trim();
        if (/10bit/i.test(name)) name = name.replace("10bit ", '');
        if (/HDTV/i.test(name)) if (/H\.26/i.test(name)) name = name.replace("H.26", 'H26');
        if (/ DD /i.test(name) || / DDP /i.test(name)) if (!/ \d\.\d/i.test(name)) name = name.replace(" DDP ", ' DDP 2.0 ').replace(" DD ", ' DD 2.0 ');
        document.querySelector('input[name=name]').value = name;
        //if (/H\.26/i.test(name)) document.querySelector('input[name=name]').value = name.replace("H.26", 'H26');
        if (/4320p/i.test(name)) target_value_save(document.querySelector('select[name="standard_sel[4]"]'), 6);
        if (/HDR/i.test(name)) document.querySelector('input[type="checkbox"][value="7"]').checked = true;
        if (/DoVi/i.test(name)) document.querySelector('input[type="checkbox"][value="12"]').checked = true;
        if (/HDR10+/i.test(name)) document.querySelector('input[type="checkbox"][value="13"]').checked = true;
    }
    //YING
    else if (window.location.host == "star-space.net" && window.location.pathname.includes("video_upload.php")){
        let small_descr = document.querySelector('input[name=small_desc]').value.trim();
        let match = small_descr.match(catedu_subtitle);
        if (match){
            target_value_save(document.querySelector('select[name="tr_category"]'), find_category("YING", match[1]));
        }

        if (/MP2/i.test(document.querySelector('input[name="name"]#name').value)) target_value_save(document.querySelector('select[name="tr_audio_codec"]'), 13);

        document.querySelector('input[type="checkbox"][name="tag_jz"]').checked = true;
        document.querySelector('input[type="checkbox"][name="tag_xiaozu"]').checked = true;
        target_value_save(document.querySelector('select[name="tr_team"]'), 8);
        if (/期/i.test(small_descr)){
            document.querySelector('input[type="checkbox"][name="tag_ep"]').checked = true;
            document.querySelector('input[type="checkbox"][name="tag_complete"]').checked = false;
        }
        else{
            document.querySelector('input[type="checkbox"][name="tag_ep"]').checked = false;
            document.querySelector('input[type="checkbox"][name="tag_complete"]').checked = true;
        }

        document.querySelector('input[type="checkbox"]#tag_chs_lang').checked = /([国|双])[\u4e00-\u9fff]{0,3}语/i.test(small_descr)
        document.querySelector('input[type="checkbox"]#tag_eng_lang').checked = /([英|双])[\u4e00-\u9fff]{0,3}语/i.test(small_descr)
        document.querySelector('input[type="checkbox"]#tag_chs_sub').checked = /中[\u4e00-\u9fff]{0,3}字/i.test(small_descr)
        document.querySelector('input[type="checkbox"]#tag_eng_sub').checked = /英[\u4e00-\u9fff]{0,3}字/i.test(small_descr)
    }
    //MT
    else if (window.location.host.includes("m-team") && window.location.pathname.includes("upload")){
        var i_evt = new Event("change", { bubbles: true, cancelable: false });
        i_evt.simulated = true;

        function setValue(input, value) {
            let lastValue = input.value;
            input.value = value;
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(i_evt);
        }
        trigger_select('category', '紀錄', 100, 0);
        setValue(document.getElementById('team'), 'CatEDU');
        //document.querySelector('input[type="search"]#team').value = "CatEDU";

        //let anonymous = document.querySelector('button[type="button"]#anonymous')
        //let a=1;
        //if (anonymous.aria-checked === false){ anonymous.aria-checked = true;}
    }
}

function find_category(site, category) {
    if (site === 'SSD'){
        if (category === '电影') return 501;
        else if (category === '电视剧') return 502;
        else if (category === '纪录片') return 503;
        else if (category === '动画片') return 504;
        else if (category === '综艺') return 505;
        else if (category === '体育') return 506;
        else if (category === '音乐剧') return 507;
        else if (category === '有声书') return 508;
    }
    else if (site === 'PTER'){
        if (category === '电影') return 401;
        else if (category === '电视剧') return 404;
        else if (category === '动画') return 403;
        else if (category === '综艺') return 405;
        else if (category === '音乐短片') return 413;
        else if (category === '音乐') return 406;
        else if (category === '音乐剧') return 418;
        else if (category === '纪录片') return 402;
        else if (category === '体育') return 407;
        else if (category === '电子书') return 408;
        else if (category === '软件') return 410;
        else if (category === '学习') return 411;
    }
    else if (site === 'TJUPT'){
        if (category === '电影') return 401;
        else if (category === '电视剧') return 402;
        else if (category === '综艺') return 403;
        else if (category === '资料') return 404;
        else if (category === '动漫') return 405;
        else if (category === '音乐') return 406;
        else if (category === '体育') return 407;
        else if (category === '软件') return 408;
        else if (category === '游戏') return 409;
        else if (category === '纪录片') return 411;
        else if (category === '移动视频') return 412;
    }
    else if (site === 'YING'){
        switch(category){
            case '电影': return 'mo';
            case '电视剧': return 'tv';
            case '动画': return 'an';
            case '纪录片': return 'do';
            case '音乐剧': return 'mv';
            case '体育': return 'sp';
            case '综艺': return 'ot';
        }
        if (category === '电影') return 'mo';
        else if (category === '电视剧') return 'tv';
        else if (category === '动画') return 'an';
        else if (category === '纪录片') return 'do';
        else if (category === '音乐剧') return 'mv';
        else if (category === '体育') return 'sp';
        else if (category === '综艺') return 'ot';
    }
    else if (site === 'MT'){

    }
    return 0;
}

function target_value_save(target_options, target_value) {
    for (let i = 0; i < target_options.options.length; i++) {
        if (target_options.options[i].value == target_value) {
            target_options.options[i].selected = true;
            break;
        }
    }
}

this.$ = this.jQuery = jQuery.noConflict(true);

jQuery.fn.wait = function (func, times, interval) {
    var _times = times || 100, //100次
        _interval = interval || 20, //20毫秒每次
        _self = this,
        _selector = this.selector, //选择器
        _iIntervalID; //定时器id
    if( this.length ){ //如果已经获取到了，就直接执行函数
        func && func.call(this);
    } else {
        _iIntervalID = setInterval(function() {
            if(!_times) { //是0就退出
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--; //如果是正数就 --
            _self = $(_selector); //再次选择
            if( _self.length ) { //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
    return this;
}

function trigger_select(tid, value, time, order) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('mousedown', true, true);
    $(`#${tid}`).wait(function() {
        document.getElementById(tid).dispatchEvent(clickEvent);
        setTimeout(function(){
            if (value == 'DTS') {
                $(`div.ant-select-item-option-content:contains("${value}"):eq(0)`).click();
            } else if (value == 'TrueHD') {
                $(`div.ant-select-item-option-content:contains("${value}"):eq(0)`).click();
            } else if (value !== 'Other') {
                $(`div.ant-select-item-option-content:contains("${value}")`).wait(function(){
                    $(`div.ant-select-item-option-content:contains("${value}")`).click();
                });
            } else {
                $(`div.ant-select-item-option-content:contains("${value}"):eq(${order})`).click();
            }
        }, time);
    });
}


(function() {
    'use strict';

    var button = document.createElement('button');
    button.innerHTML = 'CatEDU转种助手';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';

    button.onclick = function(event) {
        event.preventDefault();
        helper();
    };
    document.body.appendChild(button);

})();

