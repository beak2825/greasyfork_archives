// ==UserScript==
// @name         steam游戏 用户评测信息显示
// @name:en      steam_game_review_summary_show
// @name:zh-TW   steam遊戲 用戶評測資訊顯示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  steam游戏列表 用户评测信息显示
// @description:en steam game list show review summary 
// @description:zh-TW steam遊戲清單 用戶評測資訊顯示
// @author       wsz987
// @match        https://store.steampowered.com/*
// @icon      	 https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449523/steam%E6%B8%B8%E6%88%8F%20%E7%94%A8%E6%88%B7%E8%AF%84%E6%B5%8B%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449523/steam%E6%B8%B8%E6%88%8F%20%E7%94%A8%E6%88%B7%E8%AF%84%E6%B5%8B%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {

    const configOptions = {
        "好评率": true,
        "评价状态": true,
        "评测数量": true,
    };

    let cacheMenu =[]

    for (const [key, defaultValue] of Object.entries(configOptions)) {
        if (GM_getValue(key) === undefined) {
            GM_setValue(key, defaultValue);
        }
    }

    const showScore = ()=> GM_getValue("好评率")
    const showState = ()=> GM_getValue("评价状态")
    const showNum = ()=> GM_getValue("评测数量")

    // 创建菜单命令
    function createMenu() {
        cacheMenu.forEach(GM_unregisterMenuCommand) && (cacheMenu = [])
        for (const key of Object.keys(configOptions)) {
            console.log(key)
            const currentValue = GM_getValue(key);
            const target = GM_registerMenuCommand(`${key}: ${currentValue ? '开' : '关'}`, () => {
                GM_setValue(key, !currentValue);
                createMenu();
            });
            cacheMenu.push(target)
        }
    }

    // 初始化菜单
    createMenu();
    GM_addStyle(`
.game_review_summary_script{
    display: block;
    float: left;
    font-size: 14px;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 1px;
    margin-right: 12px;
    background-color: rgba( 38, 54, 69, 0.6);
    z-index:999;
}
.search_reviewscore_script{
    float: right;
    //opacity: 0.5;
    margin-right: 10px;
    padding: 0 4px;
    border-radius: 1px;
    background-color: rgba( 38, 54, 69, 0.6);
    display: inline-flex;
}
    `)
    var menuCmdId,isSearchPage = location.pathname.includes('search')

    apply_searchPage_switch()

    $J(".home_tab, .tab_filler, .paged_items_paging_controls").on('click',()=>{
        mount()
    })
    let active_column_className = $J(".tab_filler.active")[0]?.id.split('tab_select_')[1]
    $J(`#${active_column_className}_start`).bind('DOMNodeInserted',()=>{
        mount()
    })

    !isSearchPage && mount()
    isSearchPage && GM_getValue('hasApply') && mount()

    function mount(){
        let active_column_className = $J(".home_tab.active")[0]?.id.split('_trigger')[0] || $J(".tab_filler.active")[0]?.id.split('tab_select_')[1]
        $J(`#${active_column_className} a.tab_item, #${active_column_className}Table  a.tab_item,#search_result_container a.search_result_row`).each((index,el)=>{
            let element = $J(el)
            if(element.find('.game_review_summary_script,.search_reviewscore_script').length!=0) return true
            const { item:rgData } = GStoreItemData.GetStoreItemDataForElement( element )
            if ( rgData&&rgData['review_summary'] )
            {
                const pref = ( !GDynamicStore.s_preferences['review_score_preference'] ? 0 : GDynamicStore.s_preferences['review_score_preference'] );
                const reviewSummary = pref != 1 ? rgData['review_summary_filtered'] : rgData['review_summary'];
                const $elReviewData = $J('<div>', {'class': 'game_review_summary_script','style':rgData["discount_block"].includes('discount_pct')?'margin-top:8px':'', "data-tooltip-html": reviewSummary['sReviewScoreTooltip'] } );
                showState() && $elReviewData.append( $J('<span>', {'class': 'game_review_summary ' + reviewSummary['sReviewSummaryClass']}).text(reviewSummary['reviewSummaryDesc']) );
                if ( reviewSummary['reviewScore'] > 0 )
                {
                    showScore() && $elReviewData.prepend( $J('<span>', {'class': 'game_review_summary ' + reviewSummary['sReviewSummaryClass']}).html(parseInt(reviewSummary['cRecommendationsPositive']/reviewSummary['cReviews']*100)+'% '));
                    showNum() && $elReviewData.append( $J('<span>').html('&nbsp;(' + v_numberformat( reviewSummary['cReviews'] ) + ')') );
                }
                if ( rgData['review_anomaly'] )
                {
                    $elReviewData.append( $J( '<span class="review_anomaly_icon">&nbsp;*</span>' ) );
                }

                element.find('.tab_item_discount').css({"width": "auto"}).prepend( $elReviewData );
            }else{
                let row = element.find('.search_review_summary')
                if(row.length!=0){
                    let { tooltipHtml } = row[0]?.dataset
                    if(tooltipHtml) {
                        let textColorClass = handle_color(tooltipHtml)
                        tooltipHtml = tooltipHtml.split('<br>')
                        let reviewscore = tooltipHtml[1].split(' ').find(el=>el.includes('%'))
                        let review_num = tooltipHtml[1].split(' ').find(el=>/\d/.test(el) && !el.includes('%'))
                        let game_review_summary = tooltipHtml[0]
                        element.find('.platform_img:last').after(`<span class="search_reviewscore_script"><span class="game_review_summary script ${textColorClass}">${showScore() ? reviewscore + '&nbsp;': ''}${showState() ? game_review_summary :''}</span>${showNum() ? `&nbsp;(${review_num})`: ''}</span>`)
                        return
                    }
                }
                const { dsAppid } = element?.context?.dataset
                if(element.find('.game_review_summary_script,.search_reviewscore_script').length!=0) return true
                dsAppid&&GM_xmlhttpRequest({
                    method: "GET",
                    responseType: "json",
                    url:`https://store.steampowered.com/apphover/${dsAppid}?json=1`,
                    onload: ({DONE,status,response})=>{
                        if(DONE == 4 && status==200){
                            try{
                                const {ReviewSummary:reviewSummary} = response
                                if(!reviewSummary) return console.log(dsAppid + "fail mounted")
                                const $elReviewData = $J('<div>', {'class': isSearchPage?'search_reviewscore_script':'game_review_summary_script','style':rgData&&rgData["discount_block"].includes('discount_pct')?'margin-top:8px':'' } );
                                const quality = reviewSummary['strReviewSummary']
                                let textColorClass = handle_color(quality)
                                showState() && $elReviewData.append( $J('<span>', {'class': 'game_review_summary '+textColorClass}).text(quality) );
                                if ( reviewSummary['nReviewScore'] > 0 )
                                {
                                    showScore() && $elReviewData.prepend( $J('<span>').html(parseInt(reviewSummary['cRecommendationsPositive']/reviewSummary['cReviews']*100)+'% '));
                                    showNum() && $elReviewData.append( $J('<span>').html('&nbsp;(' +  reviewSummary['cReviews']  + ')') );
                                }
                                if(element.find('.game_review_summary_script,.search_reviewscore_script').length!=0) return true
                                isSearchPage ? element.find('.platform_img:last').after($elReviewData):element.find('.tab_item_discount').css({"width": "auto"}).prepend( $elReviewData );
                                console.log(dsAppid + " mounted")
                            }catch{
                                let emptyDom= `<div class="search_reviewscore_script"></div>`
                                isSearchPage ? element.find('.platform_img:last').after(emptyDom):element.find('.tab_item_discount').css({"width": "auto"}).prepend(emptyDom);
                            }
                        }
                    }
                });
            }
        })
    }
    function apply_searchPage_switch(status=null){
        status && GM_unregisterMenuCommand(menuCmdId)
        const hasApply = GM_getValue('hasApply', true)
        status&& GM_setValue('hasApply', !hasApply)
        const new_hasApply = GM_getValue('hasApply')
        menuCmdId = GM_registerMenuCommand(`搜索页面${new_hasApply?'已':'未'}应用`, apply_searchPage_switch);
        new_hasApply && isSearchPage && extend()
        new_hasApply && mount()
    }

    function handle_color(ctx){
        let textColorClass = ''
        if(ctx.indexOf("不一")>-1||ctx.indexOf("Mixed")>-1){
            textColorClass="mixed";
        }else if(ctx.indexOf("差评")>-1||ctx.indexOf("負評")>-1||ctx.indexOf("Negative")>-1){
            textColorClass="";
        }else if(ctx.indexOf("好评")>-1||ctx.indexOf("好評")>-1||ctx.indexOf("Positive")>-1){
            textColorClass='positive';
        }else{
            textColorClass='no_reviews';
        }
        return textColorClass
    }

    function extend(){
        CAjaxInfiniteScrollingControls.prototype.OnScroll = function()
        {
            if ( this.m_bLoading )
                return;

            var iNow = new Date().getTime();

            // How soon can we scroll?
            var iScrollWait = this.m_iCooldownTime - iNow;

            // If we haven't reached our cooldown, do nothing.
            if ( iScrollWait > 0 )
            {
                // console.log("InfiniScrolling too fast; engaging throttle");

                // Schedule a scroll event for when they would be allowed to scroll. Without this, the
                // user needs to jiggle their scrollbar.
                if ( this.m_oScheduledScroll == null )
                {
                    this.m_oScheduledScroll = setTimeout( this.m_fnRawScrollHandler, iScrollWait );
                    this.ShowThrobber(); // Show throbber while waiting to begin load.
                }

                return;
            }

            this.m_oScheduledScroll = null;

            // The bottom of our screen is equal to how far we've scrolled, plus the height of our window.
            var nCurrentScroll = $J(window).scrollTop() + $J(window).height();

            var rows = $J('#' + this.m_StrRowsId);
            var offset = rows.offset();

            // The bottom of our content is the height of our results, plus its offset from the top of the page.
            // We want to trigger a load this.m_iTriggerHeight before the user sees that.
            var nTriggerPoint = rows.height() + offset.top - this.m_iTriggerHeight;
            if ( nCurrentScroll >  nTriggerPoint )
            {
                this.m_iCooldownTime = iNow + this.m_iCooldownInterval;

                this.NextPage();
            }
            if ( nCurrentScroll+800 >  nTriggerPoint ){
                mount()
            }
        };
    }

})();
