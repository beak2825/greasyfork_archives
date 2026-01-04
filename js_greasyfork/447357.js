// ==UserScript==
// @name         人生只若如初见
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  让TA们重新走进你的生活。
// @author       boynextdesk
// @match        https://t.bilibili.com/*
// @icon         none
// @grant        none
// @license      GPL V3.0
// @downloadURL https://update.greasyfork.org/scripts/447357/%E4%BA%BA%E7%94%9F%E5%8F%AA%E8%8B%A5%E5%A6%82%E5%88%9D%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/447357/%E4%BA%BA%E7%94%9F%E5%8F%AA%E8%8B%A5%E5%A6%82%E5%88%9D%E8%A7%81.meta.js
// ==/UserScript==

// https://greasyfork.org/zh-CN/scripts/447357-%E4%BA%BA%E7%94%9F%E5%8F%AA%E8%8B%A5%E5%A6%82%E5%88%9D%E8%A7%81
(async function() {
    'use strict';

    // todo: [] live room simulation
    // todo: [] generate pseudo-stream time schedule
    // todo: [] more ways to show livers' pseudo-existence
    //      人话：不仅在动态侧边栏，也在首页导航栏和live.bilibili.com下的页面显示（可行性存疑
    const COOKIE_CONFIG_LIVER_NUMBER = "FAKE_STREAMER_LIVER_TOTAL_NUMBER"
    const COOKIE_LIVER_LIST = "FAKE_STREAMER_LIST"
    const COOKIE_LIVER_CONFIG_PREFIX = "FAKE_STREAMER_"
    const COOKIE_WAY_BACK_DAY = "FAKE_STREAMER_WAY_BACK_DAY"
    const COOKIE_WAY_BACK_HOUR = "FAKE_STREAMER_WAY_BACK_HOUR"
    const COOKIE_WAY_BACK_MINUTE = "FAKE_STREAMER_WAY_BACK_MINUTE"
    const COOKIE_SHOW_MORE = "FAKE_STREAMER_SHOW_REAL_TIME"
    const SPLIT_WORD = "!"
    const FIRST_TITLE_DEFAULT_FONT_SIZE = "18px"
    const SECOND_TITLE_DEFAULT_PADDING_SIZE = "5px"
    const DATE_SELECTOR_ID = "fake-streamer-way-back-selector"
    const DATE_SELECTOR_CONFIRM_BTN_ID = "fake-streamer-way-back-confirm-button"
    const SECTION_ID = "fake-streamer-settings-section"
    const LEFT_STREAMER_ITEM_ID = "fake-streamer-dyn-item"
    const STREAMER_SPECIFIC_WAY_BACK_ID = "fake-streamer-way-back"

    let date_selector_count = 0
    let left_streamer_item_count = 0
    let date_selector_confirm_btn_count = 0

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function log_sep() {
        console.log("---------------------------")
    }
    // easier to code yet not very elegant
    Number.prototype.toLeadZeroString = function (len) {
        let result = String(this)
        if(result.length >= len){
            return result
        }
        len = len - result.length
        for(let i = 0 ; i < len ; i++){
            result = "0" + result
        }
        return result
    }

    // www.runoob.com
    function setCookie(cname,cvalue,exdays=365000){
        const d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        const expires = "expires=" + d.toUTCString()
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    function getCookie(cname){
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++) {
            const c = ca[i].trim();
            if (c.indexOf(name)===0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
    function gen_liver_storage_id(liverBase64){
        return COOKIE_LIVER_CONFIG_PREFIX + liverBase64
    }
    function gen_date_selector_id(){
        return DATE_SELECTOR_ID + "-" + date_selector_count++
    }
    function gen_date2dateSelectorValue(date){
        return `${date.getFullYear().toLeadZeroString(4)}-${(date.getMonth() + 1).toLeadZeroString(2)}-${date.getDate().toLeadZeroString(2)}T${date.getHours().toLeadZeroString(2)}:${date.getMinutes().toLeadZeroString(2)}`
    }
    function gen_dateSelectorValue2date(dateSelectorValue){
        dateSelectorValue = dateSelectorValue.split('T')
        if(dateSelectorValue.length < 2){
            console.log("invalid value")
            return
        }
        let date = dateSelectorValue[0].split('-')
        let time = dateSelectorValue[1].split(':')
        if(date.length < 3 || time.length < 2){
            console.log("invalid value")
            return
        }
        let dateObj = new Date()
        dateObj.setFullYear(Number(date[0]), Number(date[1]) - 1, Number(date[2]))
        dateObj.setHours(Number(time[0]), Number(time[1]))
        return dateObj
    }
    function gen_left_streamer_item_id(){
        return LEFT_STREAMER_ITEM_ID + "-" + left_streamer_item_count++
    }
    function gen_left_streamer_item_id_manual(num){
        return LEFT_STREAMER_ITEM_ID + "-" + num
    }
    function gen_streamer_specific_way_back_id(streamer_id){
        return  STREAMER_SPECIFIC_WAY_BACK_ID + "-" + streamer_id
    }
    function gen_date_selector_confirm_btn_id(){
        return DATE_SELECTOR_CONFIRM_BTN_ID + "-" + date_selector_confirm_btn_count++
    }
    function get_show_more_state() {
        return getCookie(COOKIE_SHOW_MORE) === ""
    }
    function set_show_more_state(new_state){
        if(!!new_state)
            setCookie(COOKIE_SHOW_MORE, "true")
        else
            setCookie(COOKIE_SHOW_MORE, "")
    }

    function add_left_section_streamer(inputLiverName, inputLiveTitle, inputLiveUrl, inputLiverAvatarAttr, startTime = null, endTime = null) {
        // create new item
        let liveBody = document.getElementsByClassName("bili-dyn-live-users__body")[0]
        if (liveBody == null) {
            console.log("No live-body found")
            return
        }
        const liveNewItemRawStringNewVersion = "<div class=\"bili-dyn-live-users__item\">" +
            "    <div class=\"bili-dyn-live-users__item__left\">" +
            "        <div class=\"bili-dyn-live-users__item__face-container\">" +
            "            <div class=\"bili-dyn-live-users__item__face\">" +
            "                <div class=\"bili-awesome-img\"></div>" +
            "            </div>" +
            "        </div>" +
            "    <div class=\"bili-dyn-live-users__item__living\"><span>直播中</span></div>" +
            "    </div>" +
            "    <div class=\"bili-dyn-live-users__item__right\">" +
            "        <div class=\"bili-dyn-live-users__item__uname bili-ellipsis\"></div>" +
            "        <div class=\"bili-dyn-live-users__item__title bili-ellipsis\"></div>" +
            "    </div>" +
            "</div>"
        const liveNewItemRawStringOldVersion = "<div class=\"bili-dyn-live-users__item\">" +
            "    <div class=\"bili-dyn-live-users__item__left\">" +
            "        <div class=\"bili-dyn-live-users__item__face-container\">" +
            "            <div class=\"bili-dyn-live-users__item__face\">" +
            "                <div class=\"bili-awesome-img\"></div>" +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "    <div class=\"bili-dyn-live-users__item__right\">" +
            "        <div class=\"bili-dyn-live-users__item__uname bili-ellipsis\"></div>" +
            "        <div class=\"bili-dyn-live-users__item__title bili-ellipsis\"></div>" +
            "    </div>" +
            "</div>"
        let liveNewItemParent = document.createElement("div")
        if(document.getElementsByClassName("bili-dyn-live-users__item__living").length == 0){
            liveNewItemParent.innerHTML = liveNewItemRawStringOldVersion
        }
        else{
            liveNewItemParent.innerHTML = liveNewItemRawStringNewVersion
        }
        let liveNewItem = liveNewItemParent.firstChild
        liveBody.appendChild(liveNewItem)

        liveNewItem = liveBody.getElementsByClassName("bili-dyn-live-users__item")
        liveNewItem = liveNewItem[liveNewItem.length - 1]
        liveNewItem.setAttribute("id", gen_left_streamer_item_id())
        // modify new item - image
        let liveNewItemAvatar = liveNewItem.firstElementChild.firstElementChild.firstElementChild.firstElementChild
        liveNewItemAvatar.setAttribute("style", "background-image: url(\"" + inputLiverAvatarAttr + "\");")
        // modify new item - nickname
        let liveNewItemNickname = liveNewItem.lastChild.firstElementChild
        let newNicknameNode = document.createTextNode(inputLiverName)
        liveNewItemNickname.appendChild(newNicknameNode)
        // modify new item - title
        let liveNewItemTitle = liveNewItem.lastChild.lastElementChild
        let newTitleNode = document.createTextNode(inputLiveTitle)
        liveNewItemTitle.appendChild(newTitleNode)

        // update livers' number
        let liveTitle = document.getElementsByClassName("bili-dyn-live-users__title")
        if (liveTitle.length == 0) {
            console.log("No title found")
            return
        }
        liveTitle = liveTitle[0]
        let liveTitleOldNode = liveTitle.lastChild.firstChild;

        if(liveTitleOldNode){
            let livingNum = liveTitleOldNode.nodeValue.slice(1, -1)
            livingNum = Number(livingNum) + 1
            let liveTitleNewNode = document.createTextNode("（" + String(livingNum) + "）")
            liveTitle.lastChild.replaceChild(liveTitleNewNode, liveTitleOldNode)
        }else{
            console.debug("新版取消了正在直播的计数")
        }
        // register event
        liveNewItem.addEventListener("click", function () {
            if(endTime == null || startTime == null){
                window.open(inputLiveUrl)
                return
            }
            let nowTime = new Date()
            if(nowTime >= endTime){
                alert("主播正在觅食~")
                return
            }
            let offset = parseInt(nowTime - startTime) / 1000.0
            let isArgExisting = inputLiveUrl.includes('?')
            if(isArgExisting){
                let url = inputLiveUrl + "&t=" + offset
                window.open(url)
                return
            }
            window.open(inputLiveUrl + "?t=" + offset)
        })
    }

    // register new settings to user_face to control its visibility
    function add_new_setting(click_listener, title = null, item = null) {
        let dyn_item = item
        if (dyn_item == null){
            return
        }
        dyn_item.setAttribute("style", "display: none;")
        // register show listener
        let face_status = 0
        let face = document.getElementsByClassName("bili-dyn-my-info__face")
        if(face.length == 0){
            face = document.getElementsByClassName("avatar")
        }
        if(face.length == 0){
            console.log("获取用户头像组件失败！")
            return
        }
        face = face[0]
        face.addEventListener("mouseenter", function () {
            face_status = 1 - face_status
            if(face_status){
                dyn_item.setAttribute("style", "display: flex;")
            }else{
                dyn_item.setAttribute("style", "display: none;")
            }
        })
        // register click listener
        dyn_item.addEventListener("click", click_listener)
        return dyn_item
    }

    function create_setting_panel_item(panel, inputLiverName, inputLiveTitle, inputLiverAvatarAttr, buttonListener) {
        // append child
        const liveNewItemRawString = "<div class=\"bili-dyn-live-users__item\">" +
            "    <div class=\"bili-dyn-live-users__item__left\">" +
            "        <div class=\"bili-dyn-live-users__item__face-container\">" +
            "            <div class=\"bili-dyn-live-users__item__face\">" +
            "                <div class=\"bili-awesome-img\"></div>" +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "    <div class=\"bili-dyn-live-users__item__right\">" +
            "        <div class=\"bili-dyn-live-users__item__uname\"></div>" +
            "        <div class=\"bili-dyn-live-users__item__title\"></div>" +
            "    </div>" +
            "   <button class = \"bili-dyn-live-users__item__reset\">" +
            "       重置" +
            "   </button>" +
            "</div>"
        let liveNewItem = document.createElement("div")
        liveNewItem.innerHTML = liveNewItemRawString
        panel.appendChild(liveNewItem.firstChild)

        liveNewItem = document.getElementsByClassName("bili-dyn-live-users__item")
        liveNewItem = liveNewItem[liveNewItem.length - 1]
        // modify new item - image
        let liveNewItemAvatar = liveNewItem.firstElementChild.firstElementChild.firstElementChild.firstElementChild
        liveNewItemAvatar.setAttribute("style", "background-image: url(\"" + inputLiverAvatarAttr + "\");")
        // modify new item - nickname
        let liveNewItemNickname = liveNewItem.children.item(1).firstElementChild
        let newNicknameNode = document.createTextNode(inputLiverName)
        liveNewItemNickname.appendChild(newNicknameNode)
        // modify new item - title
        let liveNewItemTitle = liveNewItem.children.item(1).lastElementChild
        let newTitleNode = document.createTextNode(inputLiveTitle)
        liveNewItemTitle.appendChild(newTitleNode)
        // modify new item - button
        let liveNewItemBtn = liveNewItem.lastElementChild
        liveNewItemBtn.addEventListener('click', buttonListener)

        return liveNewItem
    }



    function create_panel() {
        // create new banner panel
        let banners = document.getElementsByClassName("bili-dyn-banner")
        let refChild = document.getElementsByClassName("sticky")
        let right = document.getElementsByClassName("right")[0]
        let banner = banners[banners.length - 1]
        let panel_section = document.createElement("section")
        panel_section.setAttribute("id", SECTION_ID)
        refChild = refChild[refChild.length - 1]
        banner = banner.cloneNode(false)
        panel_section.appendChild(banner)
        right.insertBefore(panel_section, refChild)
        // padding
        banner.setAttribute("style", "padding: 12px 16px 16px;")

        if(get_show_more_state()){
            // title
            let panel_title = document.getElementsByClassName("bili-dyn-banner__title")
            if(panel_title.length == 0){
                panel_title = document.getElementsByClassName("bili-dyn-live-users__title")
            }
            if(panel_title.length == 0){
                console.log("获取面板标题控件失败")
                return
            }
            console.log(panel_title)
            panel_title = panel_title[0]
            let panel_title_node = document.createTextNode("插件设置")
            panel_title = panel_title.cloneNode(false)
            panel_title.appendChild(panel_title_node)
            banner.appendChild(panel_title)

            // config 0: input file
            let config0_text_node = document.createTextNode("导入json配置文件")
            let config0_title_div = document.createElement("div")
            config0_title_div.style.setProperty("font-size", FIRST_TITLE_DEFAULT_FONT_SIZE)
            config0_title_div.appendChild(config0_text_node)
            banner.appendChild(config0_title_div)

            let config0_chooser = document.createElement("input")
            config0_chooser.setAttribute("type", "file")
            config0_chooser.setAttribute("id", "configFileInput")
            config0_chooser.setAttribute("accept", ".json")
            banner.appendChild(config0_chooser)

            config0_chooser.addEventListener("change", function () {
                if(this.files.length === 0){
                    console.log("没有导入文件")
                    return
                }
                if(!window.localStorage){
                    alert("导入失败：浏览器不支持localStorage")
                    return
                }
                const reader = new FileReader()
                reader.onerror = function () {
                    alert("导入失败：文件读取失败")
                }
                reader.onloadend = function () {
                    let rawData = reader.result
                    let rawJson = JSON.parse(rawData)
                    // read liver's name
                    let liver_name = rawJson.liver_name
                    if(liver_name == null){
                        alert("导入失败：缺少主播名称")
                        return
                    }
                    console.log(liver_name)
                    let liver_name_base64 = window.btoa(window.encodeURI(liver_name))
                    // storage it into list
                    let liver_list = window.localStorage[COOKIE_LIVER_LIST]
                    if (liver_list == null){
                        window.localStorage[COOKIE_LIVER_LIST] = liver_name_base64
                    }else{
                        let livers = liver_list.split(SPLIT_WORD)
                        for(let i = 0 ; i < livers.length ; i++)
                        {
                            if (livers[i] === liver_name_base64)
                            {
                                alert("导入失败：已经导入过")
                                return
                            }
                        }
                        liver_list += SPLIT_WORD + liver_name_base64
                        window.localStorage[COOKIE_LIVER_LIST] = liver_list
                        if (window.localStorage[COOKIE_LIVER_LIST] == null){
                            alert("导入失败：localStorage大小限制为4M，大小可能已经超出限制")
                            return
                        }
                    }
                    // storage it into localStorage
                    let storage_id = gen_liver_storage_id(liver_name_base64)
                    window.localStorage[storage_id] = rawData

                    alert("导入完成")
                    update_panel()
                }
                reader.readAsText(this.files[0])
            })
            // config 1: reset
            let reset_title_node = document.createTextNode("删除所有数据")
            let reset_title_div = document.createElement("div")
            reset_title_div.appendChild(reset_title_node)
            reset_title_div.style.setProperty("font-size", FIRST_TITLE_DEFAULT_FONT_SIZE)
            banner.appendChild(reset_title_div)

            let div1 = document.createElement("div")
            let btn_reset = document.createElement("button")
            btn_reset.appendChild(document.createTextNode("重置"))
            div1.appendChild(btn_reset)
            banner.appendChild(div1)

            btn_reset.addEventListener("click", function () {
                let yes = confirm("确定全部清除吗？")
                if(!yes)
                    return
                setCookie(COOKIE_CONFIG_LIVER_NUMBER, 0)
                setCookie(COOKIE_WAY_BACK_DAY, "")
                setCookie(COOKIE_WAY_BACK_HOUR, "")
                let liver_list = window.localStorage[COOKIE_LIVER_LIST]
                if(liver_list != null){
                    let livers = liver_list.split(SPLIT_WORD)
                    for(let i = 0 ; i < livers.length; i++)
                    {
                        let liver_name_storage_id = gen_liver_storage_id(livers[i])
                        window.localStorage.removeItem(liver_name_storage_id)
                    }
                    window.localStorage.removeItem(COOKIE_LIVER_LIST)
                    alert("清除完毕")
                    update_panel()
                    return
                }
                alert("清除失败：列表为null")
            })
            // config 2: way back time
            let way_back_node = document.createTextNode("全局设置时空倒流时间")
            let way_back_div = document.createElement("div")
            let way_back_day = getCookie(COOKIE_WAY_BACK_DAY)
            let way_back_hour = getCookie(COOKIE_WAY_BACK_HOUR)
            let way_back_minute = getCookie(COOKIE_WAY_BACK_MINUTE)
            way_back_div.appendChild(way_back_node)

            way_back_div.style.setProperty("font-size", FIRST_TITLE_DEFAULT_FONT_SIZE)
            banner.appendChild(way_back_div)

            way_back_node = document.createTextNode("注：如果为某个主播单独进行设置，则会覆盖掉全局设置")
            banner.appendChild(way_back_node)
            //      one-step setting
            let way_back_all = document.createElement("div")
            let way_back_all_id = gen_date_selector_id()
            let way_back_all_btn_id = gen_date_selector_confirm_btn_id()
            let way_back_time_now = new Date()
            if(way_back_minute !== ""){
                way_back_time_now.setMinutes(way_back_time_now.getMinutes() - Number(way_back_minute))
            }
            if(way_back_hour !== ""){
                way_back_time_now.setHours(way_back_time_now.getHours() - Number(way_back_hour))
            }
            if(way_back_day !== ""){
                way_back_time_now.setDate(way_back_time_now.getDate() - Number(way_back_day))
            }
            let way_back_selector_default_value = gen_date2dateSelectorValue(way_back_time_now)
            if(get_show_more_state()){
                way_back_all.innerHTML = "<p>你要回到哪一刻？</p>" +
                    "<input id='"+ way_back_all_id + "' type='datetime-local' value='" + way_back_selector_default_value +"' />" +
                    "<button id='"+ way_back_all_btn_id +"'>确认更改到这个日期</button>"
                banner.appendChild(way_back_all)

                let way_back_datetime_input = document.getElementById(way_back_all_id)
                let way_back_datetime_input_confirm_btn = document.getElementById(way_back_all_btn_id)
                way_back_datetime_input.onchange = function () {
                    way_back_time_now = gen_dateSelectorValue2date(this.value)
                }
                way_back_datetime_input_confirm_btn.addEventListener("click", function () {
                    let std_date = way_back_time_now
                    let time_now = new Date()
                    let diff_s = Math.floor((time_now - std_date) / 1000)
                    let diff_minutes =  Math.floor(diff_s % 3600 / 60)
                    let diff_hours =  Math.floor(diff_s % (3600 * 24) / 3600)
                    let diff_days =  Math.floor(diff_s / (3600 * 24))
                    console.log(`way_back_datetime_input: ${diff_days} d ${diff_hours} h ${diff_minutes} min BACK`)
                    setCookie(COOKIE_WAY_BACK_DAY, diff_days)
                    setCookie(COOKIE_WAY_BACK_HOUR, diff_hours)
                    setCookie(COOKIE_WAY_BACK_MINUTE, diff_minutes)
                    alert("更新完毕")
                    update_panel()
                })
            }
            //      day
            if(way_back_day !== "") {
                let way_back_day_ele = document.createElement("div")
                way_back_day_ele.appendChild(document.createTextNode("当前时空倒流天数: " + way_back_day))
                way_back_day_ele.style.setProperty("padding-left", SECOND_TITLE_DEFAULT_PADDING_SIZE)
                banner.appendChild(way_back_day_ele)
            }

            let div_day = document.createElement("div")
            let btn_way_back_day = document.createElement("button")
            btn_way_back_day.appendChild(document.createTextNode("单独设置天数"))
            div_day.appendChild(btn_way_back_day)
            banner.appendChild(div_day)

            btn_way_back_day.addEventListener('click', function () {
                let day = prompt("请设置时间倒流天数")
                if(day != null){
                    day = Number(day)
                    setCookie(COOKIE_WAY_BACK_DAY, day)
                    alert("设置成功")
                    update_panel()
                    // if vue...
                }
            })
            //      hour
            if(way_back_hour !== "") {
                let way_back_hour_ele = document.createElement("div")
                way_back_hour_ele.appendChild(document.createTextNode("当前时空倒流小时数: "+ way_back_hour))
                way_back_hour_ele.style.setProperty("padding-left", SECOND_TITLE_DEFAULT_PADDING_SIZE)
                banner.appendChild(way_back_hour_ele)
            }

            let div_hour = document.createElement("div")
            let btn_way_back_hour = document.createElement("button")
            btn_way_back_hour.appendChild(document.createTextNode("单独设置小时"))
            div_hour.appendChild(btn_way_back_hour)
            banner.appendChild(div_hour)

            btn_way_back_hour.addEventListener('click', function () {
                let hour = prompt("请设置时间倒流小时数")
                if(hour != null){
                    hour = Number(hour)
                    setCookie(COOKIE_WAY_BACK_HOUR, hour)
                    alert("设置成功")
                    update_panel()
                }
            })
            //      minutes
            if(way_back_minute !== "") {
                let way_back_minute_ele = document.createElement("div")
                way_back_minute_ele.appendChild(document.createTextNode("当前时空倒流分钟数: "+ way_back_minute))
                way_back_minute_ele.style.setProperty("padding-left", SECOND_TITLE_DEFAULT_PADDING_SIZE)
                banner.appendChild(way_back_minute_ele)
            }

            let div_minute = document.createElement("div")
            let btn_way_back_minute = document.createElement("button")
            btn_way_back_minute.appendChild(document.createTextNode("单独设置分钟"))
            div_minute.appendChild(btn_way_back_minute)
            banner.appendChild(div_minute)

            btn_way_back_minute.addEventListener('click', function () {
                let minute = prompt("请设置时间倒流分钟数")
                if(minute != null){
                    minute = Number(minute)
                    setCookie(COOKIE_WAY_BACK_MINUTE, minute)
                    alert("设置成功")
                    update_panel()
                }
            })

            // config 3: list
            let list_title_node = document.createTextNode("已导入的主播")
            let list_title_div = document.createElement("div")
            list_title_div.appendChild(list_title_node)
            list_title_div.style.setProperty("font-size", FIRST_TITLE_DEFAULT_FONT_SIZE)
            banner.appendChild(list_title_div)

            let live_list = window.localStorage[COOKIE_LIVER_LIST]
            if (live_list == null){
                return panel_section
            }
            let livers = live_list.split('!')
            for(let i = 0 ;  i < livers.length ; i++)
            {
                let liver_storage_id = livers[i]
                let rawData = window.localStorage[gen_liver_storage_id(liver_storage_id)]
                if(rawData == null){
                    continue
                }
                let rawJson = JSON.parse(rawData)
                let newItem = create_setting_panel_item(panel_section,
                    rawJson.liver_name, rawJson.extra_info, rawJson.liver_avatar_url,
                    function () {
                        let yes = confirm(`确定清除 ${rawJson.liver_name} 的配置信息吗？`)
                        if(!yes)
                            return
                        window.localStorage.removeItem(liver_storage_id)
                        window.localStorage.removeItem(gen_streamer_specific_way_back_id(livers[i]))
                        let live_list_now = window.localStorage[COOKIE_LIVER_LIST]
                        if (live_list_now != null){
                            let livers_now = live_list_now.split(SPLIT_WORD)
                            let livers_after = ""
                            for(let j = 0 ; j < livers_now.length ; j++)
                            {
                                if(livers_now[j] === liver_storage_id){
                                    continue
                                }
                                if(j === 0){
                                    livers_after = livers_now[j]
                                }else{
                                    livers_after += SPLIT_WORD + livers_now[j]
                                }
                            }
                            window.localStorage[COOKIE_LIVER_LIST] = livers_after
                        }
                        alert("清除完成")
                        update_panel()
                    })
                banner.appendChild(newItem)
                // new: independent rollback time
                if(get_show_more_state()){
                    let specific_way_back_id = gen_streamer_specific_way_back_id(livers[i])
                    let specific_time_back = window.localStorage[specific_way_back_id]
                    let specific_way_back_value = way_back_selector_default_value
                    if(!!specific_time_back){
                        specific_way_back_value = specific_time_back
                    }
                    let specific_way_back_ele = document.createElement("div")
                    let specific_way_back_ele_id = gen_date_selector_id()
                    let specific_way_back_btn_id = gen_date_selector_confirm_btn_id()
                    specific_way_back_ele.innerHTML =
                        "<input id='"+ specific_way_back_ele_id + "' type='datetime-local' value='" + specific_way_back_value +"' />" +
                        "<button id='"+ specific_way_back_btn_id +"'>确认更改到这个日期</button>"
                    banner.appendChild(specific_way_back_ele)
                    let specific_selector = document.getElementById(specific_way_back_ele_id)
                    let specific_btn = document.getElementById(specific_way_back_btn_id)
                    specific_btn.addEventListener("click", function () {
                        window.localStorage[specific_way_back_id] = specific_selector.value
                        alert("设置完成")
                        update_panel()
                    })
                    banner.appendChild(specific_way_back_ele)
                }
            }
        }

        return panel_section
    }

    function update_left_section() {
        let liver_list = window.localStorage[COOKIE_LIVER_LIST]
        if (liver_list == null){
            return null
        }
        let livers = liver_list.split(SPLIT_WORD)
        let gen_info_bundle = new Map()
        let time_now = new Date()
        for(let i = 0 ; i < livers.length ; i++)
        {
            let rawData = window.localStorage[gen_liver_storage_id(livers[i])]
            if(rawData == null){
                continue
            }
            let rawJson = JSON.parse(rawData)
            let ava_url = rawJson.liver_avatar_url
            let way_back_video = null
            let way_back_time_start = null
            let way_back_time_end = null
            let back_day = getCookie(COOKIE_WAY_BACK_DAY)
            let back_hour = getCookie(COOKIE_WAY_BACK_HOUR)
            let back_minute = getCookie(COOKIE_WAY_BACK_MINUTE)
            let nearest_next_video = null
            let nearest_time = null
            let nearest_real_time = null
            let fake_liver_name = rawJson.liver_name
            // specific way back
            let specific_way_back_id = gen_streamer_specific_way_back_id(livers[i])
            let specific_time_back = window.localStorage[specific_way_back_id]
            if(!!specific_time_back){
                specific_time_back = gen_dateSelectorValue2date(specific_time_back)
                let diff = time_now - specific_time_back
                let diff_s = Math.floor((time_now - specific_time_back) / 1000)
                let diff_minutes =  Math.floor(diff_s % 3600 / 60)
                let diff_hours =  Math.floor(diff_s % (3600 * 24) / 3600)
                let diff_days =  Math.floor(diff_s / (3600 * 24))
                back_day = diff_days
                back_hour = diff_hours
                back_minute = diff_minutes
            }
            // way back day
            if(back_day === ""){
                back_day = 0
            }else{
                back_day = Number(back_day)
            }
            // way back hour
            if(back_hour === ""){
                back_hour = 0
            }else{
                back_hour = Number(back_hour)
            }
            // way back minute
            if(back_minute === ""){
                back_minute = 0
            }else{
                back_minute = Number(back_minute)
            }

            for(let j = 0 ; j < rawJson.video_list.length ; j++){
                let publish_year = rawJson.video_list[j].video_publish_year
                let publish_month = rawJson.video_list[j].video_publish_month
                let publish_day = rawJson.video_list[j].video_publish_day
                let publish_hour = rawJson.video_list[j].video_publish_hour
                let video_length = rawJson.video_list[j].video_length
                video_length = video_length.split(':')
                // setFullYear这个月份设置...
                // real start / end
                let real_live_start_time = new Date()
                real_live_start_time.setFullYear(Number(publish_year), Number(publish_month) - 1, Number(publish_day))
                real_live_start_time.setHours(Number(publish_hour), 0, 0)
                let real_live_end_time = new Date()
                real_live_end_time.setFullYear(Number(publish_year), Number(publish_month) - 1, Number(publish_day))
                if (video_length.length >= 3){
                    real_live_end_time.setHours(Number(publish_hour) + Number(video_length[0]), Number(video_length[1]), Number(video_length[2]))
                }else{
                    real_live_end_time.setHours(Number(publish_hour), Number(video_length[0]), Number(video_length[1]))
                }
                // start time
                let live_start_time = new Date()
                live_start_time.setFullYear(Number(publish_year), Number(publish_month) - 1, Number(publish_day) + back_day)
                live_start_time.setHours(Number(publish_hour) + back_hour, back_minute, 0)
                // end time
                let live_end_time = new Date()
                live_end_time.setFullYear(Number(publish_year), Number(publish_month) - 1, Number(publish_day) + back_day)
                if (video_length.length >= 3){
                    live_end_time.setHours(Number(publish_hour) + Number(video_length[0]) + back_hour, Number(video_length[1]) + back_minute, Number(video_length[2]))
                }else{
                    live_end_time.setHours(Number(publish_hour) + back_hour, Number(video_length[0]) + back_minute, Number(video_length[1]))
                }
                // time now
                if(time_now < live_start_time){
                    if(nearest_time == null || live_start_time < nearest_time){
                        nearest_next_video = rawJson.video_list[j]
                        nearest_time = live_start_time
                        nearest_real_time = real_live_start_time
                    }
                    continue
                }
                if(time_now >= live_start_time && time_now <= live_end_time){
                    let desc = []
                    desc[0] = ` ${fake_liver_name} 正在直播: ${rawJson.video_list[j].video_title}`
                    if(get_show_more_state()){
                        desc[1] = `直播开始时间: ${live_start_time}`
                        desc[2] = `[原始时间 ${real_live_start_time}]`
                        desc[3] = `页面加载时间: ${time_now}`
                        desc[4] = `[原始时间 ${new Date(time_now.getTime() - live_start_time.getTime() + real_live_start_time.getTime())}]`
                        desc[5] = `直播结束时间: ${live_end_time}`
                        desc[6] = `[原始时间 ${real_live_end_time}]`
                    }else{
                        desc[1] = `直播开始时间: ${live_start_time}`
                        desc[2] = `页面加载时间: ${time_now}`
                        desc[3] = `直播结束时间: ${live_end_time}`
                    }

                    log_sep()
                    for(let k = 0 ; k < desc.length ; k++)
                        console.log(desc[k])
                    log_sep()

                    gen_info_bundle.set(fake_liver_name, desc)

                    way_back_video = rawJson.video_list[j]
                    way_back_time_start = live_start_time
                    way_back_time_end = live_end_time
                    break
                }
            }
            if (way_back_video == null){
                let desc = []
                desc[0] = `${fake_liver_name} 未直播`
                if(nearest_next_video != null && nearest_time != null){
                    desc[1] = `${fake_liver_name} 的下一次直播消息: `
                    desc[2] = `标题: ${nearest_next_video.video_title}`
                    if(get_show_more_state()){
                        desc[3] = `直播开始时间: ${nearest_time}`
                        desc[4] = `[原始时间 ${nearest_real_time}]`
                    }else{
                        desc[3] = `直播开始时间: ${nearest_time}`
                    }

                }else{
                    desc[1] = `${fake_liver_name} 的所有直播已经推送完毕`
                }
                log_sep()
                for(let k = 0 ; k < desc.length ; k++)
                    console.log(desc[k])
                log_sep()

                gen_info_bundle.set(fake_liver_name, desc)
                continue
            }

            let fake_live_title = way_back_video.video_title
            let fake_live_url = way_back_video.video_url
            add_left_section_streamer(fake_liver_name, fake_live_title, "https://" + fake_live_url, ava_url, way_back_time_start, way_back_time_end)
        }
        return gen_info_bundle
    }

    function add_live_info_into_panel(panel, info){
        let banner = panel.firstElementChild
        if(banner == null || info == null ||info.keys() == null){
            console.log("参数错误")
            return
        }
        // title
        let title = document.createElement("div")
        let title_text = document.createTextNode("直播相关信息")
        title.style.setProperty("font-size", FIRST_TITLE_DEFAULT_FONT_SIZE)
        title.appendChild(title_text)
        banner.appendChild(title)
        // extra settings
        let show_more_btn = document.createElement("button")
        show_more_btn.appendChild(document.createTextNode("显示/隐藏更多信息"))
        show_more_btn.addEventListener("click", function () {
            if(get_show_more_state()){
                set_show_more_state(true)
            }else{
                set_show_more_state(false)
            }
            update_panel()
        })
        banner.appendChild(show_more_btn)
        // blank
        banner.appendChild(document.createElement("p"))
        // info
        let keys = info.keys()
        for(let key = keys.next().value ; key != null ; key = keys.next().value){
            // sub title
            let sub_title = document.createElement("div")
            let sub_title_node = document.createTextNode(key)
            sub_title.appendChild(sub_title_node)
            sub_title.style.setProperty("color", "rgb(251, 114, 153)")
            banner.appendChild(sub_title)
            // info
            let desc = info.get(key)
            if(desc.length == null){
                console.log("参数错误")
                return
            }
            for(let j = 0 ; j < desc.length ; j++){
                let info_ele = document.createElement("p")
                let info_node = document.createTextNode(desc[j])
                info_ele.appendChild(info_node)
                banner.appendChild(info_ele)
            }
            // blank
            banner.appendChild(document.createElement("p"))
        }
        return panel
    }

    // 实际上我觉得可以把每个按钮监听器另外封装，然后把这个更新面板的函数做成每个监听器后面的一个钩子（然而还是懒
    function update_panel() {
        // remove old panel
        let panel_sections = document.getElementsByClassName("right")[0]
        let old_panel = document.getElementById(SECTION_ID)
        if(!panel_sections || !old_panel){
            console.log("panel not found")
            return
        }
        panel_sections.removeChild(old_panel)
        // remove old dyn items
        let dyn_body = document.getElementsByClassName("bili-dyn-live-users__body")[0]
        if(!dyn_body){
            console.log("dyn body not found")
            return
        }
        for(let i = 0 ; i < left_streamer_item_count ; i++){
            let old_item = document.getElementById(gen_left_streamer_item_id_manual(i))
            if(!old_item){
                break
            }
            dyn_body.removeChild(old_item)
        }
        left_streamer_item_count = 0
        // create new panel
        let new_panel = create_panel()
        add_new_setting(null, null, new_panel)
        let live_info = update_left_section()
        add_live_info_into_panel(new_panel, live_info)
        new_panel.setAttribute("style", "display: flex;")
    }

    let page_loaded = false

    function sleep_and_check(){
        sleep(300).then( async () => {
            page_loaded = document.getElementsByClassName("bili-dyn-live-users__body")[0] != null
            if(page_loaded)
                sleep_and_exec()
            else
                sleep_and_check()
        })
    }

    function sleep_and_exec(){
        sleep(50).then( async () => {
            let panel = create_panel()
            add_new_setting(null, null,  panel)
            let live_info = update_left_section()
            add_live_info_into_panel(panel, live_info)
        })
    }

    // main
    sleep_and_check()
})();