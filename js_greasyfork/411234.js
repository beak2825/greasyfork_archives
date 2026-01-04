// ==UserScript==
// @name         饰品比例列表计算
// @namespace    sourcewater
// @version      0.1.23
// @description  饰品比例列表计算查看
// @author       sourcewater
// @match        https://buff.163.com/market/?game=*
// @match        https://www.c5game.com/dota.html*
// @match        https://www.c5game.com/csgo/default/*
// @match        https://www.igxe.cn/dota2/*
// @match        https://www.igxe.cn/csgo/*
// @grant        GM_xmlhttpRequest
// @connect      www.c5game.com
// @connect      buff.163.com
// @connect      steamcommunity.com
// @connect      steamcommunity-a.akamaihd.net
// @downloadURL https://update.greasyfork.org/scripts/411234/%E9%A5%B0%E5%93%81%E6%AF%94%E4%BE%8B%E5%88%97%E8%A1%A8%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/411234/%E9%A5%B0%E5%93%81%E6%AF%94%E4%BE%8B%E5%88%97%E8%A1%A8%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {

    let log={
        DEBUG:1,
        INFO:5,
        level:1,
        setLevel:function(level){
            this.level=level;
        },
        log:function(msg,level,prefix){
            let date=new Date();
            let time=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            if(level>=this.level){
                console.log(prefix+time+" >>>> "+msg);
            }
        },
        info:function (msg){
            this.log(msg,this.INFO,"info: ");
        },
        debug:function(msg){
            this.log(msg,this.DEBUG,"debug: ");
        }
    };
    log.setLevel(log.INFO);
    let priceCSSEle=document.createElement("style");
    priceCSSEle.setAttribute("type","text/css");
    const displaySuccessClass="s_s_s_s_display_success";
    const itemidAttr="s_s_s_s_item_id";
    const successAttr="s_s_s_s_success";
    const linkRegAttr="s_s_s_s_click_register";
    const contentChangeAttr="s_s_s_s_content_change";
    const progressDivId="s_s_s_s_progress_div";
    const progressDivAttr="s_s_s_s_progress_init_success";
    const waitingDivId="s_s_s_s_waiting_div";
    const appidList={"csgo":730,"dota2":570};
    const buffUrlReg=/buff\.163\.com\//;
    const c5UrlReg=/c5game\.com\//;
    const igxeUrlReg=/igxe\.cn/;
    const timeout=6000;
    let index=0;
    let progressDivEle=document.createElement("div");
    progressDivEle.setAttribute("id",progressDivId);
    progressDivEle.setAttribute("style","z-index: 999;border-radius:4px; border: 4px solid white; text-align: center;position: absolute;left: 50%;top: 55%;transform: translate(-50%, -50%);background:white;padding:5px;");
    progressDivEle.innerHTML=`
	<p>
	  <strong style="color:black;">正在初始化</strong><br>
	  <progress style="width:200px;height:25px;"></progress>
	</p>
	`;
    document.body.appendChild(progressDivEle);
    let priceCSS=`
        .s_s_s_s_display_success{
            display:block;
        }
        .s_s_s_s_cell_right,
        .s_s_s_s_cell_link,
        .s_s_s_s_cell_after_fee,
        .s_s_s_s_cell_rate,
        .s_s_s_s_cell_rate_high{
            width:50px;
            text-align:right;
        }
        .s_s_s_s_cell_left{
            display:inline-block;
            width:50px;
            text-align:left;
        }
        .s_s_s_s_cell_right{
            color:#eea20e;
        }
        .s_s_s_s_cell_link{
            color:black;
        }
        .s_s_s_s_cell_rate{
            color:green;
        }
        .s_s_s_s_cell_rate_high{
            color:red;
        }
    `;
    let customPriceCss;
    if(buffUrlReg.test(window.location.href)){
        customPriceCss=`
        .s_s_s_s_cell_left{
            color:black;
        }
        .s_s_s_s_display_success{
            margin-left:15px;
            height:167px;
        }
        .s_s_s_s_cell_after_fee{
            color:purple;
        }
        `;
        /*
        let enLocale="Locale-Supported=en;";
        if(document.cookie.lastIndexOf(enLocale)<0){
            document.cookie=enLocale+"path=/";
            window.location.reload();
        }
        */
    }else if(c5UrlReg.test(window.location.href)){
        customPriceCss=`
        .s_s_s_s_cell_left{
            color:white;
        }
        .s_s_s_s_display_success{
            margin-left:15px;
            height:205px;
        }
        .s_s_s_s_cell_after_fee{
            color:#55aa88;
        }
        `;
    }else if(igxeUrlReg.test(window.location.href)){
        customPriceCss=`
        .s_s_s_s_cell_left{
            color:white;
        }
        .s_s_s_s_display_success{
            margin-left:15px;
            height:205px;
        }
        .s_s_s_s_cell_after_fee{
            color:#55aa88;
        }
        `;
    }
    priceCSSEle.innerHTML=priceCSS+customPriceCss;
    document.head.appendChild(priceCSSEle);
    function checkInitCalculate(){
        if(!progressDivEle.getAttribute(progressDivAttr)){
            initCalculate();
            return;
        }
        log.info("init successfully!");
    }
    function initCalculate(){
        setTimeout(function(){checkInitCalculate();},timeout);
        let steamMarketUrl="https://steamcommunity.com/market/";
        let walletVariable="var g_rgWalletInfo = ";
        GM_xmlhttpRequest({
            url: steamMarketUrl,
            method: 'GET',
            //timeout:10000,
            onload: function(res){
                if(res.status === 200){
                    let html=res.responseText;
                    walletVariable+=html.match(/var g_rgWalletInfo(.|\n)*?(\{+?(.|\n)*?\}+?)+/)[2];
                    let varScriptEle=document.createElement("script");
                    varScriptEle.setAttribute("type","text/javascript");
                    varScriptEle.innerHTML=walletVariable;
                    document.body.appendChild(varScriptEle);
                    let calculateJSUrl="https://steamcommunity-a.akamaihd.net/public/javascript/economy_common.js?v=tsXdRVB0yEaR&l=schinese&_cdn=china_pinyuncloud";
                    GM_xmlhttpRequest({
                        url: calculateJSUrl,
                        method: 'GET',
                        //timeout:10000,
                        onload: function(res){
                            if(res.status === 200){
                                let calculateScript=res.responseText;
                                let calScriptEle=document.createElement("script");
                                calScriptEle.setAttribute("type","text/javascript");
                                calScriptEle.innerHTML=calculateScript;
                                document.head.appendChild(calScriptEle);
                                progressDivEle.setAttribute(progressDivAttr,"success");
                                start(window.location.href);
                                document.body.removeChild(progressDivEle);
                            }else{
                                log.info("initCalculate(): 访问Steam市场错误！");
                            }
                        },onerror : function(err){
                            log.info("initCalculate(): 访问Steam市场超时！");
                        },ontimeout : function(err){
                            log.info("initCalculate(): 访问超时");
                        }
                    });
                }else{
                    log.info("initCalculate(): 访问Steam市场错误！");
                }
            },onerror : function(err){
                log.info("initCalculate(): 访问Steam市场超时！");
            },ontimeout : function(err){
                log.info("initCalculate(): 访问超时");
            }
        });

    }
    initCalculate();
    function getPriceValueAsInt(value){
        if(!isNaN(value)){
            value=value.toString();
            if(value.lastIndexOf(".")<0){
                value=value+"00";
            }else if(value.length-value.lastIndexOf(".") == 2){
                value+="0";
            }
        }
        return parseInt(value.replace(".",""));
    }
    function receivePrice(price){
        if(typeof price != 'undefined'){
            return (getPriceValueAsInt(price)-parseInt(CalculateFeeAmount(getPriceValueAsInt(price),g_rgWalletInfo["wallet_publisher_fee_percent_default"]).fees))/100;
        }
        return 0;
    }
    function queryPrice(currentIndex,appid,name,updateView,args){
        log.info("new task index: "+currentIndex);
        if(currentIndex<index){
            log.debug("stop previous check update for index: "+currentIndex);
            return;
        }
        function checkUpdate(currentIndex,item_nameid,steamUrl,element){
            if(currentIndex<index){
                log.debug("stop previous check update for index: "+currentIndex);
                return;
            }
            if(!args.element.getAttribute(successAttr)){
                update(item_nameid,steamUrl);
                log.debug("retry get price >>>> "+item_nameid);
            }
            log.debug(item_nameid+" >>>> get price finish!");
        }
        function update(item_nameid,steamUrl){
            if(currentIndex<index){
                log.debug("stop previous check update for index: "+currentIndex);
                return;
            }
            let buyPrice=-1;
            let sellPrice=-1;
            setTimeout(function(){checkUpdate(currentIndex,item_nameid,steamUrl,args.element);},timeout);
            log.debug(`update: "https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${item_nameid}&two_factor=0"`);
            GM_xmlhttpRequest({
                url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${item_nameid}&two_factor=0`,
                method: 'GET',
                //timeout:10000,
                responseType: 'json',
                onload: function(res){
                    if(res.status === 200){
                        let data=res.response;
                        if(data.success==1){
                            if(data.buy_order_graph.length>0&&data.buy_order_graph[0].length>0){
                                buyPrice=data.buy_order_graph[0][0];
                            }
                            if(data.sell_order_graph.length>0&&data.sell_order_graph[0].length>0){
                                sellPrice=data.sell_order_graph[0][0];
                            }
                            args.sellPrice=sellPrice;
                            args.buyPrice=buyPrice;
                            args.steamUrl=steamUrl;
                            updateView(args);
                        }
                    }else{
                        log.info("update(): "+res.status+" :访问Steam市场错误！");
                    }
                },onerror : function(err){
                    log.info("update(): 访问Steam市场超时！");
                },ontimeout : function(err){
                    log.info("update(): 访问超时");
                }
            });
        }
        function checkFetchInfo(currentIndex,item_nameid){
            if(currentIndex<index){
                log.debug("stop previous check fetch info for index: "+currentIndex);
                return;
            }
            if(!args.element.getAttribute(itemidAttr)){
                fetchInfo();
                log.debug("retry get item name id.");
            }
            log.debug(item_nameid+" >>>> get item name id finish!");
        }
        function fetchInfo(){
            let item_nameid="";
            if(currentIndex<index){
                log.debug("stop previous check update for index: "+currentIndex);
                return;
            }
            let steamUrl=`https://steamcommunity.com/market/listings/${appid}/${name}`;
            setTimeout(function(){checkFetchInfo(currentIndex,item_nameid);},timeout);
            GM_xmlhttpRequest({
                method: "get",
                url: steamUrl,
                //timeout:10000,
                async: false,
                onload: function(res){
                    if(res.status === 200){
                        let response=res.responseText;
                        let nameidMatchs=response.match(/Market_LoadOrderSpread\(.*?([\d]+).*?\);/);
                        log.debug("<nameidMatchs: "+nameidMatchs+">");
                        if(nameidMatchs){
                            item_nameid=nameidMatchs.length == 2 ? nameidMatchs[1] : "";
                            log.debug("<item_nameid: "+item_nameid+">");
                            if(item_nameid!=""){
                                args.element.setAttribute(itemidAttr,"success");
                                update(item_nameid,steamUrl);
                            }
                        }else{
                            args.element.querySelector("#"+waitingDivId).innerHTML=`<span style="color: red;display:block;text-align: center;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);">此物品不在货架上。</span>`;
                            args.element.querySelector("#"+waitingDivId).setAttribute("class",displaySuccessClass);
                            args.element.setAttribute(itemidAttr,"success");
                            args.element.setAttribute(successAttr,"true");
                        }
                    }else{
                        log.info("fetchInfo(): Error Code: "+res.status);
                    }
                },onerror : function(err){
                    log.info("fetchInfo(): 访问Steam市场错误！");
                },ontimeout : function(err){
                    log.info("fetchInfo(): 访问超时");
                }
            });
        }
        fetchInfo();
    }
    function updateView(args){
        let purchasePrice,sellRate,buyRate;
        let priceSpan=document.createElement("span");
        let success=true;
        if(buffUrlReg.test(args.url)&&!args.element.getAttribute(successAttr)){
            purchasePrice=parseFloat(args.element.querySelector("strong.f_Strong").innerHTML.match(/[\d\.]/g).join(""));
        }else if(c5UrlReg.test(args.url)&&!args.element.getAttribute(successAttr)){
            purchasePrice=parseFloat(args.element.querySelector("span.price").innerHTML.match(/[\d\.]/g).join(""));
        }else if(igxeUrlReg.test(args.url)&&!args.element.getAttribute(successAttr)){
            purchasePrice=parseFloat(args.element.querySelector(".price.fl").textContent.match(/[\d\.]+/g).join(""));
        }else{
            success=false;
        }
        if(success){
            sellRate=(purchasePrice/receivePrice(args.sellPrice)).toFixed(2);
            buyRate=(purchasePrice/receivePrice(args.buyPrice)).toFixed(2);
            args.element.removeChild(args.element.querySelector("#"+waitingDivId));
            priceSpan.setAttribute("class",displaySuccessClass);
            let priceContent=`
                <br><span class="s_s_s_s_cell_left">卖出：</span><span class="s_s_s_s_cell_right">${(args.sellPrice == -1 ? "无" : args.sellPrice)}</span>
                <br><span class="s_s_s_s_cell_left">税后：</span><span class="s_s_s_s_cell_after_fee">${args.sellPrice == -1 ? "无" : receivePrice(args.sellPrice)}</span>
                <br><span class="s_s_s_s_cell_left">比例：</span><span class="${ sellRate > 0.7 ? "s_s_s_s_cell_rate_high": "s_s_s_s_cell_rate"}">${args.sellPrice == -1 ? "无" : sellRate}</span>
                <br><br><span class="s_s_s_s_cell_left">买入：</span><span class="s_s_s_s_cell_right">${(args.buyPrice == -1 ? "无" : args.buyPrice)}</span>
                <br><span class="s_s_s_s_cell_left">税后：</span><span class="s_s_s_s_cell_after_fee">${args.buyPrice == -1 ? "无" : receivePrice(args.buyPrice)}</span>
                <br><span class="s_s_s_s_cell_left">比例：</span><span class="${ buyRate > 0.9 ? "s_s_s_s_cell_rate_high": "s_s_s_s_cell_rate"}">${args.buyPrice == -1 ? "无" : buyRate}</span>
                <br><br>
                <span class="s_s_s_s_cell_link"><a href="${args.steamUrl}" target="_blank">Steam链接</a></span>
        `;
            priceSpan.innerHTML=priceContent;
            args.element.setAttribute(successAttr,"true");
            args.element.appendChild(priceSpan);
            log.debug("update view successfully!");
        }
    }
    function waitForElement(selector,task){
        if(document.querySelector(selector)){
            task();
        }else{
            setTimeout(function(){waitForElement(selector,task);},100);
        }
    }
    let missionStart=false;
    function start(url){
        let cards;
        let cardClass;
        let appid;
        if(buffUrlReg.test(url)){
            let buffCSGOReg=/game=csgo/;
            let buffDotaReg=/game=dota2/;
            if(buffCSGOReg.test(url)){
                cardClass=".card_csgo";
                appid=appidList.csgo;
            }else if(buffDotaReg.test(url)){
                cardClass=".card_dota2";
                appid=appidList.dota2;
            }
            waitForElement(cardClass,function(){
                cards=document.querySelector(cardClass).querySelectorAll("li");
                startQuery();
            });

        }else if(c5UrlReg.test(url)){
            let c5CSGOReg=/\/csgo\//;
            let c5DotaReg=/dota\.html/;
            cardClass=".list-item4";
            if(c5DotaReg.test(url)){
                appid=appidList.dota2;
            }else if(c5CSGOReg.test(url)){
                appid=appidList.csgo;
            }
            waitForElement(cardClass,function(){
                cards=document.querySelector(cardClass).querySelectorAll("li");
                startQuery();
            });
        }else if(igxeUrlReg.test(url)){
            let igxeCSGOReg=/\/csgo\//;
            let igxeDotaReg=/\/dota2\//;
            cardClass=".dataList";
            if(igxeDotaReg.test(url)){
                appid=appidList.dota2;
            }else if(igxeCSGOReg.test(url)){
                appid=appidList.csgo;
            }
            waitForElement(cardClass,function(){
                cards=document.querySelector(cardClass).querySelectorAll("a");
                startQuery();
            });
        }
        function startQuery(){
            ++index;
            if(buffUrlReg.test(url)){
                for(let i=0;i<cards.length;++i){
                    let card=cards[i];
                    let currentIndex=index;
                    let progressEleDiv=document.createElement("div");
                    progressEleDiv.setAttribute("id",waitingDivId);
                    card.setAttribute("style","height:399px!important;");
                    progressEleDiv.setAttribute("style","width:208px;height:120px;");
                    progressEleDiv.innerHTML=`<progress style="text-align: center;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);"></progress>`;
                    let buffItemEnNameAttr="s_s_s_s_buff_item_en_name_attr";
                    let decodeTextEle=document.createElement("textarea");
                    card.appendChild(progressEleDiv);
                    function checkItemEnName(card,currentIndex){
                        if(!card.getAttribute(buffItemEnNameAttr)){
                            getItemEnName(card,currentIndex);
                            log.debug("Buff: retry get the en name!");
                        }
                        log.debug("Buff: got the en name!");
                    }
                    function getItemEnName(card,currentIndex){
                        setTimeout(function(){checkItemEnName(card,currentIndex);},5000);
                        GM_xmlhttpRequest({
                            url: `${card.querySelector("a").href}`,
                            method: 'GET',
                            //timeout:10000,
                            onload: function(res){
                                if(res.status === 200){
                                    let html=res.responseText;
                                    let steamLinkReg=/"https:\/\/steamcommunity.com\/market\/listings\/(.*?)"/;
                                    let steamLink=html.match(/"https:\/\/steamcommunity.com\/market\/listings\/(.*?)"/);
                                    if(steamLink.length>0){
                                        decodeTextEle.innerHTML=steamLink[1].substring(steamLink[1].lastIndexOf("\/")+1);
                                        let enName=decodeTextEle.value;
                                        queryPrice(currentIndex,appid,enName,updateView,{"url":url,"element":card});
                                        card.setAttribute(buffItemEnNameAttr,"success");
                                    }
                                }else{
                                    log.info("访问Buff页面错误: error code: "+res.status);
                                }
                            },onerror : function(err){
                                log.info("访问Buff页面错误！");
                            },ontimeout : function(err){
                                log.info("访问Buff页面超时！");
                            }
                        });
                    }
                    getItemEnName(card,currentIndex);
                }
                let marketCard=document.querySelector("#j_market_card");
                if(!missionStart){
                    let marketCardConfig = { childList: true };
                    let observer = new MutationObserver(function(){
                        if(!document.querySelector(cardClass)){
                            if(!marketCard.getAttribute(contentChangeAttr)){
                                marketCard.setAttribute(contentChangeAttr,"true");
                            }
                        }
                    });
                    observer.observe(marketCard, marketCardConfig);
                    let marketCardConfigAttr={ attributes: true };
                    let observerAttr = new MutationObserver(function(){
                        if(marketCard.getAttribute(contentChangeAttr)){
                            marketCard.removeAttribute(contentChangeAttr);
                            start(window.location.href);
                        }
                    });
                    observerAttr.observe(marketCard, marketCardConfigAttr);
                    missionStart=true;
                }
            }
            else if(c5UrlReg.test(url)){
                let c5ItemEnNameAttr="s_s_s_s_c5_item_en_name_attr";
                let decodeTextEle=document.createElement("textarea");
                function runPart(start,end){
                    for(let i=start;i<end;++i){
                        let currentIndex=index;
                        let card=cards[i];
                        let progressEleSpan=document.createElement("span");
                        progressEleSpan.setAttribute("style","height:205px;display:block;");
                        progressEleSpan.setAttribute("id",waitingDivId);
                        progressEleSpan.innerHTML=`<progress style="text-align: center;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);"></progress>`;
                        card.appendChild(progressEleSpan);
                        function checkItemEnName(card,currentIndex){
                            if(!card.getAttribute(c5ItemEnNameAttr)){
                                getItemEnName(card,currentIndex);
                                log.debug("c5: retry get the en name!");
                            }
                            log.debug("c5: got the en name!");
                        }
                        function getItemEnName(card,currentIndex){
                            setTimeout(function(){checkItemEnName(card,currentIndex);},5000);
                            GM_xmlhttpRequest({
                                url: `${card.querySelector("a").href}`,
                                method: 'GET',
                                //timeout:10000,
                                onload: function(res){
                                    if(res.status === 200){
                                        let html=res.responseText;
                                        let steamLinkReg=/"https:\/\/steamcommunity.com\/market\/listings\/(.*?)"/;
                                        let steamLink=html.match(/"https:\/\/steamcommunity.com\/market\/listings\/(.*?)"/);
                                        if(steamLink.length>0){
                                            decodeTextEle.innerHTML=steamLink[1].substring(steamLink[1].lastIndexOf("\/")+1);
                                            let enName=decodeTextEle.value;
                                            queryPrice(currentIndex,appid,enName,updateView,{"url":url,"element":card});
                                            card.setAttribute(c5ItemEnNameAttr,"success");
                                        }
                                    }else{
                                        log.info("访问C5页面错误: error code: "+res.status);
                                    }
                                },onerror : function(err){
                                    log.info("访问C5页面错误！");
                                },ontimeout : function(err){
                                    log.info("访问C5页面超时！");
                                }
                            });
                        }
                        getItemEnName(card,currentIndex);
                    }
                }
                let half=cards.length>32 ? parseInt(cards.length/2) : cards.length;
                if(half!=0&&half<cards.length){
                    let intervalId=setInterval(function(){
                        let count=document.querySelectorAll("."+displaySuccessClass).length;
                        if(count==half){
                            clearInterval(intervalId);
                            log.info("run part 2!");
                            let part2notifyId="s_s_s_s_c5_part2_notify";
                            let width=200;
                            let height=25;
                            let left=document.documentElement.scrollLeft + (document.documentElement.clientWidth - width) / 2;
                            let top=document.documentElement.scrollTop + (document.documentElement.clientHeight - height) / 2;
                            let notifyEle=document.createElement("div");
                            notifyEle.setAttribute("id",part2notifyId);
                            notifyEle.setAttribute("style","z-index: 999;border-radius:4px; border: 4px solid white; text-align: center;position: absolute;left: "+left+"px;top: "+top+"px;transform: translate(-50%, -50%);background:white;padding:5px;");
                            notifyEle.innerHTML=`
                                    <strong style="color:black;">请等待10秒后加载第二部分！</strong><br>
                                    <progress style="width:${width}px;height:${height}px;"></progress>
                                `;
                            document.body.appendChild(notifyEle);
                            setTimeout(function(){
                                document.body.removeChild(document.querySelector("#"+part2notifyId));
                                runPart(half,cards.length);
                            },10000);
                        }
                    },1000);
                }
                log.info("run part 1!");
                runPart(0,half);
            }
            else if(igxeUrlReg.test(url)||c5UrlReg.test(url)){
                const itemEnNameAttr="s_s_s_s_item_enName_success";
                function checkGetEnNameAndQuery(appid,cnName,progressEleSpan,card){
                    if(!card.getAttribute(itemEnNameAttr)){
                        getEnNameAndQuery(appid,cnName,progressEleSpan,card);
                        log.debug("retry get en name");
                    }
                    log.debug("get en name for "+cnName+" successfully!");
                }
                function getEnNameAndQuery(appid,cnName,progressEleSpan,card){
                    setTimeout(function(){checkGetEnNameAndQuery(appid,cnName,progressEleSpan,card);},timeout);
                    GM_xmlhttpRequest({
                        //url: `https://steamcommunity.com/market/search?appid=${appid}&q=${cnName}`,
                        url: `https://steamcommunity.com/market/search/render/?query=${cnName}&start=0&count=1&appid=${appid}&norender=1`,
                        method: 'GET',
                        responseType: 'json',
                        onload: function(res){
                            if(res.status === 200){
                                let data=res.response;
                                let linkList=data.results;
                                let enName="";
                                if(linkList&&linkList.length>0){
                                    for(let i=0;i<linkList.length;++i){
                                        let matchCNName=linkList[i].name;
                                        if(matchCNName==cnName){
                                            enName=linkList[i].hash_name;
                                        }
                                    }
                                    if(enName!=""){
                                        queryPrice(index,appid,enName,updateView,{"url":url,"element":card});
                                    }else{
                                        progressEleSpan.innerHTML=`<span style="color: red;display:block;text-align: center;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);">此物品不在货架上。</span>`;
                                        progressEleSpan.setAttribute("class",displaySuccessClass);
                                        card.setAttribute(itemidAttr,"success");
                                    }
                                    card.setAttribute(itemEnNameAttr,"success");
                                }
                            }else{
                                log.info("startQuery(): 访问Steam市场错误！Code: "+res.status);
                            }
                        },onerror : function(err){
                            log.info("startQuery(): 访问Steam市场错误！");
                        },ontimeout : function(err){
                            log.info("startQuery(): 访问超时");
                        }
                    });
                }
                for(let i=0;i<cards.length;++i){
                    let progressEleSpan=document.createElement("span");
                    progressEleSpan.setAttribute("style","height:205px;display:block;");
                    progressEleSpan.setAttribute("id",waitingDivId);
                    let card=cards[i];
                    let cnName=card.querySelector(".name").title;
                    card.setAttribute("style","height: 450px;");
                    progressEleSpan.innerHTML=`<progress style="text-align: center;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);"></progress>`;
                    card.appendChild(progressEleSpan);
                    getEnNameAndQuery(appid,cnName,progressEleSpan,card);
                }
            }
        }
    }
})();