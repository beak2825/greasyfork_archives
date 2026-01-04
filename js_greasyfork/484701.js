// ==UserScript==
// @name         shoplifting-watcher
// @namespace    nodelore.torn.shoplifting-watcher
// @version      0.3.3
// @description  Watch shoplifting status for players.
// @author       nodelore[2786679] Silmaril[2665762]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484701/shoplifting-watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/484701/shoplifting-watcher.meta.js
// ==/UserScript==

(function(){
    'use strict';
    
    // Avoid duplicated loading
    if(window.SHOPLIFTING_WATCHER){
        return;
    }
    window.SHOPLIFTING_WATCHER = true;

    // ============================= Configuration ==============================
    let API = localStorage.getItem("APIKey") || "";
    const CONFIG_STORAGE_KEY = "SHOPLIFTING_WATCHER"
    let watcher_config = {
        interval: 60, // second,
        enabled: [],
        collapsed: false,
        disabled: false,
        offset: [30, 30],
        both: [],
        sort: [],
    }
    // ==========================================================================
    let inPDA = false;
    const PDAKey = "###PDA-APIKEY###";
    if(PDAKey.charAt(0) !== "#"){
        inPDA = true;
        if(!API){
            API = PDAKey;
        }
    }
    if(localStorage.getItem(CONFIG_STORAGE_KEY)){
        const config = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
        if(config["collapsed"] === undefined || config["sort"] === undefined || config["both"] === undefined){
            update_config();
        } else{
            watcher_config = config;
        }
    }

    if(API && !localStorage.getItem("APIKey")){
        localStorage.setItem("APIKey", API);
    }

    // Ensure single instance, thanks to Silmaril :D
    const scriptIsRunningKey = 'nodelore.torn.shoplifting-watcher.is-running';
    const lastQueriedKey = "nodelore.torn.shoplifting-watcher.last-queried";

    const currentTimestamp = parseInt(new Date().getTime() / 1000);
    if(!localStorage.getItem(lastQueriedKey) || (currentTimestamp - parseInt(localStorage.getItem(lastQueriedKey)) > 5 * watcher_config.interval)){
        console.log("[ShopliftingWatcher] Reset running flag to false");
        localStorage.removeItem(scriptIsRunningKey);
    }

    if (localStorage.getItem(scriptIsRunningKey) === 'true') {
        console.log("[ShopliftingWatcher] Script is already running in another tab.");
        return;
    }

    console.log("[ShopliftingWatcher] Script started working.");
    localStorage.setItem(scriptIsRunningKey, 'true');

    window.addEventListener('beforeunload', () => {
        localStorage.removeItem(scriptIsRunningKey);
    });

    window.addEventListener('unload', () => {
        localStorage.removeItem(scriptIsRunningKey);
    });

    const update_config = ()=>{
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(watcher_config));
    }

    const notify = (notification)=>{
        if(inPDA){
            alert(notification);
            return;
        }
        try{
            if (Notification.permission === "granted") {
                new Notification(notification);
            } 
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                  if (permission === "granted") {
                    new Notification(notification);
                  }
                });
            }
        } catch(e){
        }
    }

    const addStyle = ()=>{
        const styles = `
            .dark-mode #shoplifting-body *{
                color: #000;
            }
            
            .dragging{
                opacity: .5;
            }

            .collapsed .shoplifting-status{
                overflow: hidden;
                height: auto;
            }

            .collapsed .shoplifting-item:not(.active){
                display: none;
            }

            .collapsed .shoplifting-item-detail:not(.active){
                display: none;
            }

            #shoplifting-body{
                display: flex;
                position: fixed;
                width: 300px;
                height: auto;
                background: #FFF;
                border-radius: 6px;
                box-sizing: border-box;
                padding: 10px 10px 0 10px;
                flex-flow: column nowrap;
                z-index: 1000000;
            }

            #shoplifting-body *{
                user-select: none;
            }

            #shoplifting-body.hidden{
                display: none !important;
            }

            .shoplifting-title{
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin-bottom: 10px;
            }

            .shoplifting-title div.heading{
                font-size: 15px;
                font-weight: bold;
                cursor: grab;
            }

            .shoplifting-title div.close-btn{
                margin-left: auto;
                cursor: pointer !important;;
            }

            .shoplifting-status{
                width: 100%;
                display: flex;
                height: 300px;
                flex-flow: column nowrap;
                overflow-y: scroll;
                padding-right: 15px;
            }

            .shoplifting-status::-webkit-scrollbar{
                width: 10px;
            }

            .shoplifting-status::-webkit-scrollbar-thumb {
                border-radius: 10px;
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                background: #a8bbbf;
                background-image: -webkit-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.2) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.2) 50%,
                    rgba(255, 255, 255, 0.2) 75%,
                    transparent 75%,
                    transparent
                );
            }

            .shoplifting-status:-webkit-scrollbar-track {
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                background-color: #ededed;
            }

            .shoplifting-item{
                width: 100%;
                display: flex;
                flex-flow: column nowrap;
                border-top: 1px solid rgba(1, 1, 1, .1);
                box-sizing: border-box;
                padding: 5px 0;
                position: relative;
            }

            .shoplifting-item-info{
                display: flex;
                flex-flow: column nowrap;
            }

            .shoplifting-item-name{
                font-weight: bold;
                height: 20px;
                line-height: 20px;
                display: flex;
                align-items: center;     
            }

            .shoplifting-item-name span{
                position: relative;
                font-size: 14px;
                cursor: pointer;
                text-indent: 24px;
                transition: .3s all ease-in-out;   
            }

            .shoplifting-item-name span:hover::after{
                opacity: 1;
            }
            
            .stick-top .shoplifting-item-name span::after{
                opacity: 1 !important;
            }

            .shoplifting-item-name span::after{
                opacity: 0;
                content: "\u21EE"; 
                position: absolute;
                left: -21px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px; 
                transition: .3s all ease-in-out;  
            }

            .shoplifting-item-detail{
                display: flex;
                align-items: center;
                margin-top: 3px;
            }

            .shoplifting-item-detail-name{
                font-size: 13px;
            }

            .shoplifting-item-toggle{
                display: flex;
                margin-left: auto;
                cursor: pointer;
                height: 100%;
            }

            .shoplifting-item-toggle div{
                width: 60px;
                height: 20px;
                line-height: 20px;
                box-shadow: 0 0 6px 3px rgba(1, 1, 1, .1);
                text-align: center;
                font-weight: bold;
                border-radius: 3px;
                color: #FFF;
                transition: .15s all ease-in-out;
                opacity: .3;
            }

            .shoplifting-item-toggle div.active{
                opacity: 1 !important;
            }

            .shoplifting-item-toggle div.active{
                opacity: 1;
            }

            .shoplifting-item-toggle div:hover{
                opacity: 1;
            }

            .shoplifting-item-toggle-on{
                background: #82c91e;
            }

            .shoplifting-item-toggle-off{
                background: #E54C19;
            }

            .shoplifting-apiusage{
                display: flex;
                align-items: center;
                border-top: 1px solid rgba(1, 1, 1, .1);
                box-sizing: border-box;
                padding: 5px 0 5px 0;
            }

            .shoplifting-apiusage div{
                font-weight: bold;
                font-size: 14px;
            }
            .shoplifting-apiusage input{
                color: rgba(1, 1, 1, .5);
                height: 20px;
                line-height: 20px;
                margin-left: auto;
                width: 120px;
                background: #F2F2F2;
                text-align: center;
                font-weight: bold;
            }

            .toggle-btn{
                position: absolute;
                right: 30px;
            }

            .shoplifting-status .toggle-btn{
                left: 150px;
            }

            .toggle-watcher{
                display: none;
            }

            .toggle-watcher:checked + label{
                background: #82c91e; 
            }

            .toggle-watcher:checked + label:after{
                left: calc(100% - 15px);
            }

            .toggle-watcher + label{
                display: inline-block;
                width: 40px;
                height: 15px;
                position: relative;
                transition: 0.15s;
                margin: 0px 20px;
                box-sizing: border-box;
                background: #ddd;
                border-radius: 20px;
                box-shadow: 1px 1px 3px #aaa;
            }

            .shoplifting-status .toggle-watcher + label:hover::before{
                opacity: 1;
            }

            .toggle-watcher + label:after{
                content: '';
                display: block;
                position: absolute;
                left: 0px;
                top: 0px;
                width: 15px;
                height: 15px;
                transition: 0.15s;
                cursor: pointer;
                background: #fff;
                border-radius: 50%;
                box-shadow: 1px 1px 3px #aaa;
            }

            .shoplifting-status .toggle-watcher + label:before{
                content: 'BOTH';
                position: absolute;
                right: -45px;
                line-height: 21px;
                height: 21px;
                font-size: 12px;
                color: #333;
                transition: .3s all ease-in-out;
                opacity: 0;
            }

            .shoplifting-collapsed{
                padding: 5px 0 5px 0;
                background: #F2F2F2;
                text-align: center;
                border-top: 1px solid rgba(1, 1, 1, .1);
                font-weight: bold;
                transition: .15s all ease-in-out;
                margin-bottom: 8px;
            }

            .shoplifting-collapsed:hover{
                background: #FFF;
                cursor: pointer;
            }

            .both-active{
                cursor: not-allowed !important;
            }

            .both-active div{
                background: #ddd;
                transition: none;
                box-shadow: none;
                color: #333;
                opacity: 1;
            }

            .both-active div:hover{
                opacity: 1;
            }
        `;
        const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
        if (isTampermonkeyEnabled){
            GM_addStyle(styles);
        } else {
            let style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = styles;
            document.head.appendChild(style);
        }
    }

    addStyle();

    let watcher_interval;
    let icon_interval;
    const insert_icon = ()=>{
        if($("ul[class*=status-icons]").length === 0){
            if(!icon_interval){
                icon_interval = setInterval(()=>{
                    insert_icon();
                    icon_interval = null;
                }, 500)
            }
            return;
        }
        if($("ul[class*=status-icons]").find(".shoplifting_watcher").length === 0){
            const icon = $("<li class='shoplifting_watcher' title='Shoplifting Watcher'></li>");
            icon.css({
                "background-image": "url(/images/v2/editor/emoticons.svg)",
                "cursor": "pointer",
                "background-position": "-74px -42px"
            });
            icon.click(function(){
                if($("div#shoplifting-body").hasClass("hidden")){
                    $("div#shoplifting-body").removeClass("hidden");
                } else{
                    $("div#shoplifting-body").addClass("hidden");
                }
                
            })
            $("ul[class*=status-icons]").prepend(icon);
        }
    }

    const is_active = (status)=>{
        for(let item of status){
            if(item === 0){
                return false;
            }
        }
        return true;
    }

    const mock_status = (shop_status, single=true)=>{
        for(let detail of shop_status){
            detail["disabled"] = true;
            if(single){
                break;
            }
        }
    }

    const update_watcher = ()=>{
        if(!API){
            return;
        }
        let update_flag = false;
        if($("#shoplifting-body .shoplifting-status div.shoplifting-item").length > 0){
            update_flag = true;
        }
        fetch(`https://api.torn.com/torn/?selections=shoplifting&key=${API}`).then((res)=>{
            if(res.ok){
                res.json().then((data)=>{
                    let notification = "";
                    const shoplifting_data = data["shoplifting"];

                    localStorage.setItem(lastQueriedKey, parseInt(new Date().getTime() / 1000))

                    for(let shop_name in shoplifting_data){
                        const shop_status = shoplifting_data[shop_name];
                        const status_record = [];
                        if(!update_flag){
                            const shoplifting_item = $(`
                                <div class="shoplifting-item" data-shop="${shop_name}">
                                </div>
                            `);

                            const shoplifting_name = $(`
                                <div class="shoplifting-item-name">
                                    <span>${shop_name}</span>
                                </div>
                            `);

                            shoplifting_name.find("span").click(function(){
                                const parent = $(this).parent().parent();
                                const shop_name = parent.attr("data-shop");
                                const shop_idx = watcher_config.sort.indexOf(shop_name);
                                if(shop_idx !== -1){
                                    watcher_config.sort.splice(shop_idx, 1);
                                } 
                                watcher_config.sort.unshift(shop_name);
                                if(watcher_config.sort.length > 3){
                                    const pop_item = watcher_config.sort.pop();
                                    const pop = $("#shoplifting-body").find(".shoplifting-status").find(`.shoplifting-item[data-shop=${pop_item}]`);
                                    if(pop.length > 0){
                                        pop.removeClass("stick-top");
                                    }
                                }

                                update_config();
                                if(!parent.hasClass("stick-top")){
                                    parent.addClass("stick-top");
                                }
                                $("#shoplifting-body").find(".shoplifting-status").prepend(parent);
                            });
                            
                            const checked = watcher_config.both.indexOf(shop_name) === -1 ? "" : "checked";
                            const toggle_both = $(`<div class="toggle-btn">
                                <input type="checkbox" class="toggle-watcher" id="${shop_name}-watcher" ${checked}>
                                <label for="${shop_name}-watcher"></label>
                            </div>`);
                    
                            toggle_both.find(`#${shop_name}-watcher`).change(function(){
                                const idx = watcher_config.both.indexOf(shop_name);
                                const parent = $(this).parent().parent().parent().find(".shoplifting-item-toggle");
                                if(idx !== -1){
                                    const idx = watcher_config.both.indexOf(shop_name);
                                    watcher_config.both.splice(idx, 1);
                                    if(parent.hasClass("both-active")){
                                        parent.removeClass("both-active");
                                    }
                                } else{
                                    watcher_config.both.push(shop_name);
                                    if(!parent.hasClass("both-active")){
                                        parent.addClass("both-active");
                                    }
                                }
                                update_config();
                            });
                    
                            shoplifting_name.append(toggle_both);
                    
                            shoplifting_item.append(shoplifting_name);

                            let active_flag = false;

                            for(let detail of shop_status){
                                const detail_item = $(`<div class="shoplifting-item-detail"></div>`)
                                let prefix = ""
                                const key = `${shop_name}_${detail["title"].toLowerCase().replace(" ", "_")}`;
                                if(detail["disabled"]){
                                    prefix = "❌";
                                    status_record.push(1);
                                    if(watcher_config.enabled.indexOf(key) !== -1 && watcher_config.both.indexOf(shop_name) === -1){
                                        if(notification.length > 0){
                                            notification += "\n";
                                        }
                                        notification += `【${shop_name}】【${detail["title"]}】 is disabled`;
                                    }
                                } else{
                                    prefix = "✅";
                                    status_record.push(0);
                                }
                                detail_item.append($(`<div class="shoplifting-item-detail-name" data-key="${key}">${prefix} ${detail["title"]}</div>`));
                                
                                let toggleOn = "";
                                let toggleOff = "";
                                if(watcher_config.enabled.indexOf(key) !== -1){
                                    toggleOn = " active";
                                    detail_item.addClass("active");
                                    active_flag = true;
                                } else{
                                    toggleOff = " active";
                                }
                                const toggle = $(`
                                    <div class="shoplifting-item-toggle" data-key="${key}">
                                        <div class="shoplifting-item-toggle-on${toggleOn}">ON</div>
                                        <div class="shoplifting-item-toggle-off${toggleOff}">OFF</div>
                                    </div>`
                                );

                                if(watcher_config.both.indexOf(shop_name) !== -1){
                                    toggle.addClass("both-active")
                                }
        
                                toggle.click(function(){
                                    const parent = $(this).parent();
                                    const item = parent.parent();
                                    const shop_name = item.attr("data-shop");
                                    const checked = watcher_config.both.indexOf(shop_name) === -1 ? "" : "checked";
                                    if(checked){
                                        return;
                                    }

                                    const key = $(this).attr("data-key");
                                    
                                    if(watcher_config.enabled.indexOf(key) !== -1){
                                        const index = watcher_config.enabled.indexOf(key);
                                        watcher_config.enabled.splice(index, 1);
                                        $(`div.shoplifting-item-toggle[data-key=${key}] .shoplifting-item-toggle-off`).addClass("active");
                                        $(`div.shoplifting-item-toggle[data-key=${key}] .shoplifting-item-toggle-on`).removeClass("active");
                                        parent.removeClass("active");
                                        let clear_flag = true;
                                        item.find(".shoplifting-item-detail").each(function(){
                                            if($(this).hasClass("active")){
                                                clear_flag = false;
                                            }
                                        });
                                        if(clear_flag){
                                            item.removeClass("active");
                                        }
                                    } else{
                                        watcher_config.enabled.push(key);
                                        $(`div.shoplifting-item-toggle[data-key=${key}] .shoplifting-item-toggle-off`).removeClass("active");
                                        $(`div.shoplifting-item-toggle[data-key=${key}] .shoplifting-item-toggle-on`).addClass("active");
                                        
                                        if(!parent.hasClass("active")){
                                            parent.addClass("active");
                                        }
                                        if(!item.hasClass("active")){
                                            item.addClass("active");
                                        }
                                    }
                                    update_config();
                                });
                                detail_item.append(toggle);
                                
                                shoplifting_item.append(detail_item)
                            }
                            
                            if(active_flag){
                                shoplifting_item.addClass("active");
                            }

                            if(watcher_config.sort.length === 0){
                                $("#shoplifting-body").find(".shoplifting-status").append(shoplifting_item);
                            } else{
                                let prev_item;
                                let found = false;
                                for(let i = 0; i < watcher_config.sort.length; i++){
                                    if(watcher_config.sort[i] === shop_name){
                                        const shop_idx = i - 1;
                                        if(shop_idx >= 0){
                                            prev_item = watcher_config.sort[shop_idx];
                                        }
                                        found = true;
                                        break;
                                    }
                                }

                                if(!found){
                                    $("#shoplifting-body").find(".shoplifting-status").append(shoplifting_item);
                                } else{
                                    shoplifting_item.addClass("stick-top");
                                    if(prev_item && $("#shoplifting-body").find(".shoplifting-status").find(`.shoplifting-item[data-shop=${prev_item}]`).length > 0){
                                        $("#shoplifting-body").find(".shoplifting-status").find(`.shoplifting-item[data-shop=${prev_item}]`).after(shoplifting_item)
                                    } else{
                                        $("#shoplifting-body").find(".shoplifting-status").prepend(shoplifting_item);
                                    }
                                }
                            }

                        }
                        else{
                            for(let detail of shop_status){
                                let prefix = "";
                                const key = `${shop_name}_${detail["title"].toLowerCase().replace(" ", "_")}`;
                                if(detail["disabled"]){
                                    prefix = "❌";
                                    status_record.push(1);
                                    if(watcher_config.enabled.indexOf(key) !== -1 && watcher_config.both.indexOf(shop_name) === -1){
                                        if(notification.length > 0){
                                            notification += "\n";
                                        }
                                        notification += `【${shop_name}】【${detail["title"]}】 is disabled`;
                                    }
                                } else{
                                    prefix = "✅";
                                    status_record.push(0);
                                }

                                const target = $(`.shoplifting-item-detail-name[data-key="${key}"]`);
                                target.text(`${prefix} ${detail["title"]}`);
                            }
                        }
                        if(watcher_config.both.indexOf(shop_name) !== -1 && is_active(status_record)){
                            // forbidden notification if any of both is not disabled
                            if(notification.length > 0){
                                notification += "\n";
                            }
                            notification += `【${shop_name}】 ALL securities disabled`;
                        }
                    }
                    if(notification.length > 0){
                        notify(notification);
                        $(".shoplifting_watcher").attr("title", `Shoplifting Watcher\n${notification}`)
                    }
                });
            }
        });
    }

    let is_dragging = false;
    let offset = watcher_config.offset;
    const insert_body = ()=>{
        const collapsed_class = watcher_config.collapsed ? " collapsed" : "";

        const watcher = $(`<div id="shoplifting-body" class="hidden${collapsed_class}">
            <div class="shoplifting-status">
            </div>
            <div class="shoplifting-apiusage">
                <div>Query interval: </div>
            </div>
        </div>`);

        watcher.offset({
            left: offset[0],
            top: offset[1],
        });
        
        const input = $(`<input type="number" class="shoplifting-interval-input" step="1" value="${watcher_config.interval}"/>`);
        input.keyup(function(){
            const new_val = parseInt($(this).val());
            if(new_val !== watcher_config.interval){
                watcher_config.interval = new_val;
                if(watcher_interval){
                    clearInterval(watcher_interval);
                    watcher_interval = setInterval(()=>{
                        update_watcher();
                    }, watcher_config.interval*1000)
                }
                update_config();
            }
        })

        watcher.find(".shoplifting-apiusage").append(input);

        let title_content = "Shoplifting watcher";
        if(!API){
            title_content = "No Public API"
        }
        const title = $(`
            <div class="shoplifting-title">
                
            </div>`
        );

        const heading = $(`<div class="heading">${title_content}</div>`);
        heading.mousedown(function(e){
            $("#shoplifting-body").addClass("dragging");
            is_dragging = true;
            offset = [
                $("#shoplifting-body").offset().left - e.pageX,
                $("#shoplifting-body").offset().top - e.pageY
            ]
        });

        heading.mousemove(function(e){
            if(is_dragging){
                $("#shoplifting-body").offset({
                    left: e.pageX + offset[0],
                    top: e.pageY + offset[1]
                })
            }
        })

        heading.mouseup(function(){
            $("#shoplifting-body").removeClass("dragging");
            is_dragging = false;
            watcher_config.offset = [$("#shoplifting-body").offset().left, $("#shoplifting-body").offset().top];
            update_config();
        });

        watcher.mouseleave(function(){
            $("#shoplifting-body").removeClass("dragging");
            is_dragging = false;
            watcher_config.offset = [$("#shoplifting-body").offset().left, $("#shoplifting-body").offset().top];
            update_config();
        })

        title.append(heading);

        const checked = watcher_config.disabled ? "" : "checked";

        const disabled_btn = $(`<div class="toggle-btn">
            <input type="checkbox" class="toggle-watcher" id="toggle-watcher" ${checked}>
            <label for="toggle-watcher"></label>
        </div>`);

        disabled_btn.find("#toggle-watcher").change(function(){
            const status = this.checked;
            if(status === true){
                update_watcher();
                if(!watcher_interval){
                    watcher_interval = setInterval(()=>{
                        update_watcher();
                    }, watcher_config.interval*1000);
                    if($("#shoplifting-body").hasClass("collapsed") && !watcher_config.collapsed){
                        $("#shoplifting-body").removeClass("collapsed");
                    }
                }
            } else{
                if(watcher_interval){
                    clearInterval(watcher_interval);
                    watcher_interval = null;
                    $("div.shoplifting-item").each(function(){
                        $(this).remove();
                    });
                    if(!$("#shoplifting-body").hasClass("collapsed")){
                        $("#shoplifting-body").addClass("collapsed");
                    }
                }
            }
            watcher_config.disabled = !status;
            update_config();
        });

        title.append(disabled_btn);

        const close_btn = $(`<div class='close-btn' title="Click to close">❌</div>`);

        close_btn.click(function(){
            $("div#shoplifting-body").addClass("hidden");
        });

        title.append(close_btn);
        watcher.prepend(title);

        const collapsed = $(`<div class="shoplifting-collapsed">${watcher_config.collapsed ? "Expand" : "Collapsed"}</div>`);
        collapsed.click(function(){
            if(watcher_config.collapsed === true){
                watcher_config.collapsed = false;
                $(this).text("Collapsed");
                if($("#shoplifting-body").hasClass("collapsed")){
                    $("#shoplifting-body").removeClass("collapsed");
                }
            } else{
                watcher_config.collapsed = true;
                $(this).text("Expand");
                if(!$("#shoplifting-body").hasClass("collapsed")){
                    $("#shoplifting-body").addClass("collapsed");
                }
            }
            update_config();
        })

        watcher.append(collapsed);

        $(body).append(watcher);

        if(!watcher_config.disabled){
            update_watcher();
            if(!watcher_interval){
                watcher_interval = setInterval(()=>{
                    update_watcher();
                }, watcher_config.interval*1000);
            }
    
        }

        insert_icon();

    }

    insert_body();

})();
