// ==UserScript==
// @name         torn-crime-crack-helper
// @namespace    nodelore.torn.crack-helper
// @version      1.2.2
// @description  Utilize password database to crack torn cracking crime.
// @author       nodelore[2786679]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492864/torn-crime-crack-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492864/torn-crime-crack-helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // Avoid duplicate injection
    if (window.CRACK_HELPER_INJECTED) {
      return;
    }
    window.CRACK_HELPER_INJECTED = true;

    const cracker_record = {};
    const filter_history = {};

    const isMobile = () => {
        return window.innerWidth <= 768;
    }

    let inPDA = true;
    const PDAKey = "OHvCcbilr7VX9ZGT";
    if(PDAKey.charAt(0) !== "#"){
        inPDA = true;
    }

    const http_get = (url, success, failed)=>{
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            timeout: 30000,
            ontimeout: (err) => {
                failed(err);
            },
            onerror: (err) => {
                failed(err);
            },
            onload: (res) => {
                success(res);
            }
        });
    }

    // ========================= Configuration==============================================================================================================================
    const CRACKER_STATUS_KEY = "CRACKER_STATUS";
    const defaultSel = isMobile() ? "100k" : "1m";
    let CRACKER_SEL = localStorage.getItem(CRACKER_STATUS_KEY) || defaultSel;
    const LIMIT = 10;
    // add custom password list here, and set CRACKER_SEL to the one you want to choose
    const PASSWORD_DATABASE = {
        "10m": "https://raw.githubusercontent.com/ignis-sec/Pwdb-Public/master/wordlists/ignis-10M.txt",
        "1m": "https://raw.githubusercontent.com/ignis-sec/Pwdb-Public/master/wordlists/ignis-1M.txt",
        "1m_alter": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt",
        "100k": "https://raw.githubusercontent.com/ignis-sec/Pwdb-Public/master/wordlists/ignis-100K.txt",
        "100k_alter": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-100000.txt",
        "10k": "https://raw.githubusercontent.com/ignis-sec/Pwdb-Public/master/wordlists/ignis-10K.txt",
        "1k": "https://raw.githubusercontent.com/ignis-sec/Pwdb-Public/master/wordlists/ignis-1K.txt",
    }
    // =====================================================================================================================================================================

    window.CRACK_HELPER_INJECTED = true;
  
    if (GM) {
        window.GM_getValue = GM.getValue;
        window.GM_setValue = GM.setValue;
    }

    if(!PASSWORD_DATABASE[CRACKER_SEL]){
        console.log("Fail to fetch cracker password");
        return;
    }
    const CRACKER_HELPER_KEY = "CRACKER_HELPER_STORAGE";

    let cracker_helper = {
        "source": "",
        "data": [],
    }

    let titleInterval, updateInterval;
    let is_injected = false;

    const setCrackTitle = (title)=>{
        if(titleInterval){
            clearInterval(titleInterval);
        }
        titleInterval = setInterval(()=>{
            if($('div[class*=header___] div[class*=title___]').length > 0){
                $('div[class*=header___] div[class*=title___]').text(`CRACKING(${title})`)
                clearInterval(titleInterval);
                titleInterval = undefined;
            }
        }, 1000)
    }

    const fetch_action = (useCache=true)=>{
        setCrackTitle("Loading from network");
        http_get(PASSWORD_DATABASE[CRACKER_SEL],
            (res)=>{
                const text = res.responseText;
                cracker_helper.data = [];
                text.split('\n').forEach((pwd)=>{
                    cracker_helper.data.push(pwd.trim().replace('\n', ''));
                });
                cracker_helper.source = PASSWORD_DATABASE[CRACKER_SEL];
                if(useCache){
                    GM_setValue(CRACKER_HELPER_KEY, cracker_helper);
                }
                setCrackTitle("Loaded")
                updatePage();
    
                console.log('load cracker_helper from network:')
                console.log(cracker_helper)
            },
            (res)=>{
                console.error(`error: ${res}`);
            }
        )
    }
    
    const insertSelector = ()=>{
        let options = "";
        for(let abbr in PASSWORD_DATABASE){
            options += `<option value="${abbr}">${abbr}</option>`
        }

        const selector = $(`
            <div class="cracker-helper-selector">
                <label>Source:</label>
                <select name="crackerSel">
                    ${options}
                </select>
            </div>
        `)
        selector.find("select").val(CRACKER_SEL);

        selector.find("select").change(function(){
            CRACKER_SEL = $(this).val();
            localStorage.setItem(CRACKER_STATUS_KEY, CRACKER_SEL);
            $("div.cracker-helper-panel").each(function(){
                $(this).remove();
            })
            fetch_action();
        })

        if($("div.cracker-helper-selector").length == 0){
            $("h4[class*=heading___]").after(selector);
        }
    }

    const addStyle = ()=>{
        const styles = `
            .cracker-helper-selector{
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: bold;
            }
            .cracker-helper-selector select{
                background: transparent;
                text-align: center;
                border: none;
            }
            .dark-mode .cracker-helper-selector select{
                color: #F2F2F2 !important;
            }
            .dark-mode .cracker-helper-selector select option{
                background: #333 !important;
                color: #F2F2F2 !important;
            }
            .cracker-helper-panel{
                width: 100%;
                height: 30px;
                background: #F2F2F2;
                box-sizing: border-box;
                display: flex;
                padding: 5px;
                border-bottom: 1px solid rgba(1, 1, 1, .1);
            }
            .cracker-helper-panel:hover{
                background: #FFF;
            }
            .dark-mode .cracker-helper-panel{
                background: rgba(1, 1, 1, .15) !important;
                border-bottom: 1px solid #222 !important;
            }
            .dark-mode .cracker-helper-panel:hover{
                background: rgba(1, 1, 1, .15) !important;
            }

            .cracker-current-status{
                display: flex;
                flex-flow: column nowrap;
                border-right: 1px solid;
                border-image-source: linear-gradient(180deg,transparent,#ddd 53%,transparent);
                border-image-slice: 1;
                box-sizing: border-box;
                justify-content: center;
                padding-left: 5px;
            }
            .dark-mode .cracker-current-status{
                border-image-source: linear-gradient(180deg,transparent,#000,transparent);
            }
            .cracker-helper-panel-mobile .cracker-current-status{
                fotn-size: 5px !important;
            }
            .cracker-current-status div{
                width: 100%;
                color: #000;
                font: inherit;
                color: #666;
            }
            .cracker-status-count{
                color: #c66231 !important;
            }
            .cracker-current-result{
                flex: 1;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                border-image-source: linear-gradient(180deg,transparent,#ddd 53%,transparent);
                border-image-slice: 1;
                box-sizing: border-box;
                padding-left: 5px;
                font-size: 1.25em;
            }
            .dark-mode .cracker-current-result{
                border-image-source: linear-gradient(180deg,transparent,#000,transparent);
            }
            .cracker-result-item{
                border: 1px solid rgba(1, 1, 1, .1);
                height: 34px;
                line-height: 34px;
                font-size: 100%;
                text-align: center;
                margin-left: 6px;
                box-sizing: border-box;
            }
            .dark-mode .cracker-result-item{
                border-color: #F2F2F266 !important;
            }
            .cracker-helper-panel-mobile .cracker-result-item{
                margin-left: 3px !important;
            }

            .cracker-button-set{
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding-right: 5px;
            }
            .cracker-helper-panel-mobile .cracker-button-set{
                flex-flow: column nowrap !important;
            }
            .cracker-button-set button{
                text-align: center;
                height: 24px;
                line-height: 24px;
            }
            .cracker-helper-panel-mobile .cracker-button-set button{
                width: 60px;
                height: 18px !important;
                line-height: 18px !important;
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

    // under experiment
    const findCommonCandidates = (arr, target)=>{
        if(arr.length === 0){
            return arr;
        }
        const target_poses = [];
        for(let i = 0; i < target.length; i++){
            const c = target[i];
            if(c == "."){
                target_poses.push(i);
            }
        }

        const freqs = [];
        for(let pos of target_poses){
            const freq = {};
            for(let res of arr){
                const c = res[pos];
                if(!freq[c]){
                    freq[c] = 0;
                }
                freq[c] += 1;
            }
            const freq_list = Object.entries(freq);
            freq_list.sort((a, b)=>{
                if(a[1] > b[1]){
                    return -1;
                } else if(a[1] < b[1]){
                    return 1;
                }
                return 0;
            });
            freqs.push({
                pos: pos,
                char: freq_list[0][0],
                count: freq_list[0][1]
            });
        }

        freqs.sort((a, b)=>{
            if(a["count"] > b["count"]){
                return -1;
            } else if(a["count"] < b["count"]){
                return 1;
            }
            return 0;
        });

        const res = [];
        const highest = freqs[0];
        const highest_pos = highest["char"];
        const highest_char = highest["pos"];
        for(let c of arr){
            if(c[highest_pos] === highest_char){
                res.unshift(c);
            } else{
                res.push(c);
            }
        }
        return {
            res,
            highest_pos,
            highest_char
        }
    }

    let global_index = 0;
    const handleCrime = (item, extraInfo=undefined, panel_index=undefined)=>{
        let index = panel_index;
        if(index){
           index = parseInt(index); 
        }
        let target = "";
        if(extraInfo){
            target = extraInfo;
        }
        else{
            item.find("div[class*=charSlot_]").each(function(){
                const val = $(this).text().trim();
                if(val == ""){
                    target += "."
                }else{
                    target += val;
                }
            });
        }
        
        target = target.replaceAll("ø", "0");
        let targetRegex = new RegExp(`^${target}$`);

        // console.log(`target Regex is ${targetRegex}, index is ${index}, globalIndex: ${global_index}`);

        setCrackTitle("Calculating");

        let result = cracker_helper.data.filter(item => targetRegex.test(item));

        if(result.length === 0 && target.length > 6){
            let found = false;
            let splitIndex = 3;
            // when regex match does not work, we will split the regex and try to find out result for both side
            while(!found && splitIndex < 7 && splitIndex < target.length - 1){
                const regexLeft = new RegExp(`^${target.substring(0, splitIndex)}$`);
                const regexRight = new RegExp(`^${target.substring(splitIndex)}$`);

                splitIndex += 1;
                const leftResult = cracker_helper.data.filter(item => regexLeft.test(item));
                const rightResult = cracker_helper.data.filter(item => regexRight.test(item));

                if(leftResult.length > 0 && rightResult.length > 0){
                    const minSize = Math.min(leftResult.length, rightResult.length);
                    result = leftResult.map((item, index)=>{
                        if(index < minSize){
                            return item + rightResult[index];
                        } 
                    }).filter(item => item !== undefined);

                    if(result.length > 10){
                        found = true;
                    }
                }
            }
        }

        if(filter_history[index]){
            result = result.filter((item)=>{
                for(let history of filter_history[index]){
                    const char = history.char;
                    const charPos = history.charPos;
                    if(item && item[charPos] === char){
                        return false;
                    }
                }
                return true;
            })
        }

        result = result.slice(0, LIMIT);

        if(result.length > 0){
            if(index){
                cracker_record[index] = result;
            }
            else{
                cracker_record[global_index] = result;
            }
        }

        setCrackTitle("Done");
        
        
        let found = item.find('.cracker-helper-panel');
        const found_index = found.attr("data-attr");
        if(index && found_index && parseInt(found_index) !== index){
            console.log("Relocate cracker helper panel")
            found = $(`.cracker-helper-panel[data-attr=${index}]`);
        }

        if(found.length == 0){
            const detailPanel = $(`
                <div class="cracker-helper-panel" data-attr=${global_index}>
                    <div class="cracker-current-status">
                        <div class="cracker-status-count">Top ${result.length} candidates:</div>
                    </div>
                    <div class="cracker-current-result">
                        
                    </div>
                    <div class="cracker-button-set" data-index="0">
                        <button title="previous one" data-attr=${global_index} class="torn-btn cracker-button-prev" data-action="prev" >Prev</button>
                        <button title="next one" data-attr=${global_index} class="torn-btn cracker-button-next" data-action="next">Next</button>
                    </div>
                </div>
            `);

            if(index){
                detailPanel.attr("data-attr", index);
                detailPanel.find("button.cracker-button-prev").attr("data-attr", index);
                detailPanel.find("button.cracker-button-next").attr("data-attr", index);
            }
            else{
                global_index += 1;
            }

            if(window.innerWidth < 1800){
                detailPanel.addClass("cracker-helper-panel-minimize");
            }

            if(result[0]){
                for(let char of result[0]){
                    detailPanel.find(".cracker-current-result").append($(`
                        <div class="cracker-result-item" style="width: ${item.find('div[class*=charSlot]').width() + 2}px">
                            ${char.toUpperCase()}
                        </div>
                    `))
                }
            }

            detailPanel.find(".cracker-button-set").css({
                width: item.find("div[class*=guessesLeftSection]").width() + item.find("div[class*=commitButtonSection]").width() + 5,
                "padding-left": item.find("div[class*=guessesLeftSection]").width(),
            })

            if(isMobile()){
                detailPanel.addClass("cracker-helper-panel-mobile");
                detailPanel.find(".cracker-current-status").css({
                    width: "33px",
                    "font-size": "7px",
                    border: "none",
                })
            }
            else{
                detailPanel.find(".cracker-current-status").css({
                    width: item.find("div[class*=targetSection]").width() + 5,
                })
            }

            detailPanel.css({
                left: item.offset().left + item.width() + 10,
                top: item.offset().top,
                height: item.height(),
            })

            detailPanel.find(".cracker-button-set button").click(function(){
                const action = $(this).attr("data-action");
                const action_index = $(this).attr("data-attr");
                let current_index = parseInt($(this).parent().attr("data-index"));
                const action_record = cracker_record[action_index];
                if(action_record){
                    const record_length = action_record.length;
                    if(action === "next"){
                        if(current_index < record_length - 1){
                            current_index += 1;
                        }
                    } else if(action === "prev"){
                        if(current_index > 0){
                            current_index -= 1;
                        }
                    }
        
                    $(this).parent().attr("data-index", current_index);
                    $(this).parent().parent().find(".cracker-status-text").text(action_record[current_index]);
                    let index = 0;
                    if(action_record[current_index]){
                        for(let char of action_record[current_index]){
                            $(this).parent().parent().find(`div.cracker-result-item:eq(${index++})`).text(char.toUpperCase());
                        }
                    }
                } else{
                    console.error("Fail to fetch record detail")
                    console.log(`action_index: ${action_index}, action_record: ${action_record}`)
                    console.log(cracker_record)
                }
            });

            item.find("div[class*=sections]").after(detailPanel);
        } else{
            const currentIdx = parseInt(found.attr("data-attr"));
            if(index && currentIdx < 10000){
                found.attr("data-attr", index);
                found.find("button.cracker-button-prev").attr("data-attr", index);
                found.find("button.cracker-button-next").attr("data-attr", index);
                cracker_record[index] = cracker_record[currentIdx];
                delete cracker_record[currentIdx];
            }

            found.find('.cracker-info-text').text(targetRegex);
            found.find('.cracker-status-count').text(`Top ${result.length} candidates:`)
            let idx = 0;
            if(result[0]){
                for(let char of result[0]){
                    found.find(`div.cracker-result-item:eq(${idx++})`).text(char.toUpperCase());
                }
            }
            else{
                found.find(`div.cracker-result-item`).remove();
            }

            found.find('.cracker-button-set').attr("data-index", "0");
        }
    }

    const handlePage = (crimes)=>{
        for(let i = 0; i < crimes.length; i++){
            const target = initial_targets[i];
            let crime_id;
            if(target){
                crime_id = target["ID"];
            }
            handleCrime($(crimes[i]), undefined, crime_id);
        }
    }

    const updatePage = ()=>{
        if(location.href.endsWith("cracking")){
            inject_once();
            insertSelector();
            setCrackTitle("Loading");
            const crimes = $('.crime-option');
            if(crimes.length < 1){
                if(!updateInterval){
                    updateInterval = setInterval(()=>{
                        if($('.crime-option').length > 0 && cracker_helper.data.length > 0){
                            handlePage($('.crime-option'));
                            clearInterval(updateInterval);
                            updateInterval = undefined;
                        }
                    }, 1000);
                }
            } else{
                handlePage(crimes);
            }
        } else{
            $('.cracker-helper-panel').each(function(){
                $(this).remove();
            });
            $("div.cracker-helper-selector").remove();
        }
    }

    const handleCrackPerpare = (params, data)=>{
        const crimeValue = parseInt(params.get("value1"));
        if(!params.get("value2")){
            return
        }
        
        const char = params.get("value2").toLowerCase();
        const charPos = parseInt(params.get("value3"));

        const targets = data["DB"]["crimesByType"]["targets"];

        for(let i = 0; i < targets.length; i++){
            const target = targets[i];
            const target_id = target.ID;
            const target_panel = $(`.cracker-helper-panel:eq(${i})`)
            const target_index = parseInt(target_panel.attr('data-attr'));
            if(target_index < 10000){
                target_panel.attr('data-attr', target_id);
                target_panel.find("button.cracker-button-prev").attr("data-attr", target_id);
                target_panel.find("button.cracker-button-next").attr("data-attr", target_id);
                cracker_record[target_id] = cracker_record[target_index];
                delete cracker_record[target_index];
            }

            if(target_id === crimeValue){
                const currentChar = target["password"][charPos]["char"].toString();
                if(currentChar !== char){
                    if(!filter_history[target_id]){
                        filter_history[target_id] = []; 
                    }
                    filter_history[target_id].push({
                        char,
                        charPos,
                    });
                    handleCrime(target_panel.parent(), undefined, target_id)   
                }
            }
            
        }
    }

    const handleCrackAttempt = (params, data)=>{
        try{
            const crimeID = parseInt(params.get("crimeID"));
            if(crimeID === 205){
                const crimeValue = parseInt(params.get("value1"));
                const targets = data["DB"]["crimesByType"]["targets"];
                console.log(`during attempt, crimeValue: ${crimeValue}`)
    
                let targetChars = '';
    
                for(let i = 0; i < targets.length; i++){
                    const target = targets[i];
                    const target_id = target.ID;
                    const target_panel = $(`.cracker-helper-panel:eq(${i})`)
                    const target_index = parseInt(target_panel.attr('data-attr'));
                    if(target_index < 10000){
                        target_panel.attr('data-attr', target_id);
                        target_panel.find("button.cracker-button-prev").attr("data-attr", target_id);
                        target_panel.find("button.cracker-button-next").attr("data-attr", target_id);
                        cracker_record[target_id] = cracker_record[target_index];
                        delete cracker_record[target_index];
                    }

                    if(target_id === crimeValue){
                        for(let j = 0; j < target.password.length; j++){
                            const char = target.password[j].char;
                            if(char === '*' || char === undefined){
                                targetChars += '.';
                            } else{
                                targetChars += char;
                            }
                        }
                        handleCrime(target_panel.parent(), targetChars, target_id);
                    }
                }
            }
        }catch(err){
            console.log(err);
        }

    }

    let initial_targets = [];
    const handleCrackList = (data)=>{
        const targets = data["DB"]["crimesByType"]["targets"];
        if(initial_targets.length === 0){
            initial_targets = targets;
            if($(".cracker-helper-panel").length > 0){
                for(let i = 0; i < initial_targets.length; i++){
                    const target_id = initial_targets[i]["ID"];
                    const target_panel = $(`.cracker-helper-panel:eq(${i})`);
                    const target_index = parseInt(target_panel.attr('data-attr'));
                    target_panel.attr('data-attr', target_id);
                    target_panel.find("button.cracker-button-prev").attr("data-attr", target_id);
                    target_panel.find("button.cracker-button-next").attr("data-attr", target_id);
                    cracker_record[target_id] = cracker_record[target_index];
                    delete cracker_record[target_index];
                }
            }
        }
    }

    const interceptFetch = ()=>{
        const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const origFetch = targetWindow.fetch;
        targetWindow.fetch = async (...args) => {
            const rsp = await origFetch(...args);
            const url = new URL(args[0], location.origin);
            const params = new URLSearchParams(url.search);
        
            if (url.pathname === '/loader.php' && params.get('sid') === 'crimesData') {
                const step = params.get("step");
                const clonedRsp = rsp.clone();
                if(step === "prepare"){
                    handleCrackPerpare(params, await clonedRsp.json());
                }
                else if(step === "attempt"){
                    handleCrackAttempt(params, await clonedRsp.json());
                }
                else if(step === "crimesList"){
                    handleCrackList(await clonedRsp.json());
                }
            }
      
            return rsp;
        };
    }

    const inject_once = ()=>{
        if(is_injected){
            return;
        }
        addStyle();
        interceptFetch();
        try{
            if(inPDA){
                console.log(`Load password list for PDA`);
                fetch_action(false);
            }
            else{
                GM.getValue(CRACKER_HELPER_KEY, cracker_helper).then((cracker)=>{
                    cracker_helper = cracker;
                    
                    if(cracker_helper.source == PASSWORD_DATABASE[CRACKER_SEL]){
                        setCrackTitle("Loaded")
                        updatePage();
            
                        console.log('load cracker_helper from cache:')
                        console.log(cracker_helper)
                    } 
                    else{
                        fetch_action();
                    }
                }).catch(()=>{
                    fetch_action(false)
                })
            }

        }
        catch(err){
            console.log(err)
        }
        is_injected = true;
    }

    console.log('Userscript cracker helper starts');
    updatePage();
    window.onhashchange = ()=>{
        updatePage();
    }

    const bindEventListener = function(type) {
        const historyEvent = history[type];
        return function() {
            const newEvent = historyEvent.apply(this, arguments);
           const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newEvent;
        };
    };
    history.pushState = bindEventListener('pushState');
    window.addEventListener('pushState', function(e) {
        updatePage();
    });

})();