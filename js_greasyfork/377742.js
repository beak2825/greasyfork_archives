// ==UserScript==
// @name         屏蔽斗鱼板块
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽斗鱼指定板块 tag 可指定某些主播除外 dy-name
// @author       Vipcw
// @match        https://www.douyu.com/directory/all
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377742/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E6%9D%BF%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/377742/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E6%9D%BF%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        shieldAnchor()
        shieldPlate()
        addPlate()
    }, 400);

    // 屏蔽某些直播间
    function shieldAnchor(){
        // 屏蔽板块列表
        let shieldList = [
            '绝地求生',
            '王者荣耀',
            '刺激战场',
            '穿越火线'
        ]
        // 屏蔽项目中解封特殊主播
        let exemptionList = [
            '呆妹儿小霸王',
            '错觉老中医',
            '指法芬芳张大仙',
        ]
        // 已屏蔽列表
        let isShieldList = []

        // 屏蔽板块中所有主播
        shieldList.map(shieldItem=>{
            // 已屏蔽列表添加项目
            isShieldList.push({
                name: shieldItem, // 项目名
                number: 0, // 项目屏蔽数
                anchors: []
            })

            // 所有房间列表
            $('.DyListCover-zone').map((index, item)=>{
                if(shieldItem === $(item).html()){
                    // 匹配到了之后找到他的祖先级 .play-list-link 的父级 li 隐藏
                    $(item).parents('.DyListCover').parent().hide()
                    // 已屏蔽列表对应项目中数量加1
                    isShieldList[isShieldList.length - 1].number++
                    // 已屏蔽列表对应项目中添加主播名字
                    isShieldList[isShieldList.length - 1].anchors.push(
                        $(item).parents('.DyListCover').find('.DyListCover-user').html()
                    )
                }
            })
        })

        // 解封特殊主播
        exemptionList.map(exemptionItem=>{
            $('.DyListCover-user').map((index, item)=>{
                if(exemptionItem === $(item).html()){
                    $(item).parents('.DyListCover').parent().show()
                }
            })
        })

        console.log(isShieldList)
        console.log(exemptionList)
    }

    // 屏蔽网页上某些板块
    function shieldPlate(){
        // 顶部 推荐 banner
        $('.layout-Cover--withAside').hide()
        // 登陆即领 热门视频
        $('.layout-Module-extra').hide()
        // 除了全部 屏蔽其他的
        $('.layout-Module-label').hide()
        $('.layout-Module-label').eq(0).show()
    }

    // 添加切换 banner
    function addPlate(){
        $('.layout-Module-filter-list').append(
            `<a class="layout-Module-label" href="https://www.douyu.com/directory/myFollow">
                <strong>
                    <span>关注</span>
                </strong>
            </a>`
        )
        $('.layout-Module-filter-list').append(
            `<a class="layout-Module-label" href="https://www.douyu.com/g_tianya">
                <strong>
                    <span>天涯明月刀</span>
                </strong>
            </a>`
        )
    }
})();