// ==UserScript==
// @name         MDSteamCN
// @namespace    http://tampermonkey.net/
// @version      0.200
// @description  md化SteamCN
// @author       marioplus
// @match        https://steamcn.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at       document-body

// @downloadURL https://update.greasyfork.org/scripts/376423/MDSteamCN.user.js
// @updateURL https://update.greasyfork.org/scripts/376423/MDSteamCN.meta.js
// ==/UserScript==
(function () {

    // 执行一些公共操作
    const mdcolor = new Map([
        ['red', '#F44336'],
        ['red-50', '#FFEBEE'],
        ['red-100', '#FFCDD2'],
        ['red-200', '#EF9A9A'],
        ['red-300', '#E57373'],
        ['red-400', '#EF5350'],
        ['red-500', '#F44336'],
        ['red-600', '#E53935'],
        ['red-700', '#D32F2F'],
        ['red-800', '#C62828'],
        ['red-900', '#B71C1C'],
        // red（强调色)
        ['red-accent', '#FF5252'],
        ['red-a100', '#FF8A80'],
        ['red-a200', '#FF5252'],
        ['red-a400', '#FF1744'],
        ['red-a700', '#D50000'],
        // pink（主色)
        ['pink', '#E91E63'],
        ['pink-50', '#FCE4EC'],
        ['pink-100', '#F8BBD0'],
        ['pink-200', '#F48FB1'],
        ['pink-300', '#F06292'],
        ['pink-400', '#EC407A'],
        ['pink-500', '#E91E63'],
        ['pink-600', '#D81B60'],
        ['pink-700', '#C2185B'],
        ['pink-800', '#AD1457'],
        ['pink-900', '#880E4F'],
        // pink（强调色)
        ['pink-accent', '#FF4081'],
        ['pink-a100', '#FF80AB'],
        ['pink-a200', '#FF4081'],
        ['pink-a400', '#F50057'],
        ['pink-a700', '#C51162'],
        // purple（主色)
        ['purple', '#9C27B0'],
        ['purple-50', '#F3E5F5'],
        ['purple-100', '#E1BEE7'],
        ['purple-200', '#CE93D8'],
        ['purple-300', '#BA68C8'],
        ['purple-400', '#AB47BC'],
        ['purple-500', '#9C27B0'],
        ['purple-600', '#8E24AA'],
        ['purple-700', '#7B1FA2'],
        ['purple-800', '#6A1B9A'],
        ['purple-900', '#4A148C'],
        // purple（强调色)
        ['purple-accent', '#E040FB'],
        ['purple-a100', '#EA80FC'],
        ['purple-a200', '#E040FB'],
        ['purple-a400', '#D500F9'],
        ['purple-a700', '#AA00FF'],
        // deep-purple（主色)
        ['deep-purple', '#673AB7'],
        ['deep-purple-50', '#EDE7F6'],
        ['deep-purple-100', '#D1C4E9'],
        ['deep-purple-200', '#B39DDB'],
        ['deep-purple-300', '#9575CD'],
        ['deep-purple-400', '#7E57C2'],
        ['deep-purple-500', '#673AB7'],
        ['deep-purple-600', '#5E35B1'],
        ['deep-purple-700', '#512DA8'],
        ['deep-purple-800', '#4527A0'],
        ['deep-purple-900', '#311B92'],
        // purple（强调色)
        ['deep-purple-accent', '#7C4DFF'],
        ['deep-purple-a100', '#B388FF'],
        ['deep-purple-a200', '#7C4DFF'],
        ['deep-purple-a400', '#651FFF'],
        ['deep-purple-a700', '#6200EA'],
        // indigo（主色)
        ['indigo', '#3F51B5'],
        ['indigo-50', '#E8EAF6'],
        ['indigo-100', '#C5CAE9'],
        ['indigo-200', '#9FA8DA'],
        ['indigo-300', '#7986CB'],
        ['indigo-400', '#5C6BC0'],
        ['indigo-500', '#3F51B5'],
        ['indigo-600', '#3949AB'],
        ['indigo-700', '#303F9F'],
        ['indigo-800', '#283593'],
        ['indigo-900', '#1A237E'],
        // indigo（强调色)
        ['indigo-accent', '#536DFE'],
        ['indigo-a100', '#8C9EFF'],
        ['indigo-a200', '#536DFE'],
        ['indigo-a400', '#3D5AFE'],
        ['indigo-a700', '#304FFE'],
        // blue（主色)
        ['blue', '#2196F3'],
        ['blue-50', '#E3F2FD'],
        ['blue-100', '#BBDEFB'],
        ['blue-200', '#90CAF9'],
        ['blue-300', '#64B5F6'],
        ['blue-400', '#42A5F5'],
        ['blue-500', '#2196F3'],
        ['blue-600', '#1E88E5'],
        ['blue-700', '#1976D2'],
        ['blue-800', '#1565C0'],
        ['blue-900', '#0D47A1'],
        // blue（强调色)
        ['blue-accent', '#448AFF'],
        ['blue-a100', '#82B1FF'],
        ['blue-a200', '#448AFF'],
        ['blue-a400', '#2979FF'],
        ['blue-a700', '#2962FF'],
        // light-blue（主色)
        ['light-blue', '#03A9F4'],
        ['light-blue-50', '#E1F5FE'],
        ['light-blue-100', '#B3E5FC'],
        ['light-blue-200', '#81D4FA'],
        ['light-blue-300', '#4FC3F7'],
        ['light-blue-400', '#29B6F6'],
        ['light-blue-500', '#03A9F4'],
        ['light-blue-600', '#039BE5'],
        ['light-blue-700', '#0288D1'],
        ['light-blue-800', '#0277BD'],
        ['light-blue-900', '#01579B'],
        // light-blue（强调色)
        ['light-blue-accent', '#40C4FF'],
        ['light-blue-a100', '#80D8FF'],
        ['light-blue-a200', '#40C4FF'],
        ['light-blue-a400', '#00B0FF'],
        ['light-blue-a700', '#0091EA'],
        // cyan（主色)
        ['cyan', '#00BCD4'],
        ['cyan-50', '#E0F7FA'],
        ['cyan-100', '#B2EBF2'],
        ['cyan-200', '#80DEEA'],
        ['cyan-300', '#4DD0E1'],
        ['cyan-400', '#26C6DA'],
        ['cyan-500', '#00BCD4'],
        ['cyan-600', '#00ACC1'],
        ['cyan-700', '#0097A7'],
        ['cyan-800', '#00838F'],
        ['cyan-900', '#006064'],
        // cyan（强调色)
        ['cyan-accent', '#18FFFF'],
        ['cyan-a100', '#84FFFF'],
        ['cyan-a200', '#18FFFF'],
        ['cyan-a400', '#00E5FF'],
        ['cyan-a700', '#00B8D4'],
        // teal（主色)
        ['teal', '#009688'],
        ['teal-50', '#E0F2F1'],
        ['teal-100', '#B2DFDB'],
        ['teal-200', '#80CBC4'],
        ['teal-300', '#4DB6AC'],
        ['teal-400', '#26A69A'],
        ['teal-500', '#009688'],
        ['teal-600', '#00897B'],
        ['teal-700', '#00796B'],
        ['teal-800', '#00695C'],
        ['teal-900', '#004D40'],
        // teal（强调色)
        ['teal-accent', '#64FFDA'],
        ['teal-a100', '#A7FFEB'],
        ['teal-a200', '#64FFDA'],
        ['teal-a400', '#1DE9B6'],
        ['teal-a700', '#00BFA5'],
        // green（主色)
        ['green', '#4CAF50'],
        ['green-50', '#E8F5E9'],
        ['green-100', '#C8E6C9'],
        ['green-200', '#A5D6A7'],
        ['green-300', '#81C784'],
        ['green-400', '#66BB6A'],
        ['green-500', '#4CAF50'],
        ['green-600', '#43A047'],
        ['green-700', '#388E3C'],
        ['green-800', '#2E7D32'],
        ['green-900', '#1B5E20'],
        // green（强调色)
        ['green-accent', '#69F0AE'],
        ['green-a100', '#B9F6CA'],
        ['green-a200', '#69F0AE'],
        ['green-a400', '#00E676'],
        ['green-a700', '#00C853'],
        // light-green（主色)
        ['light-green', '#8BC34A'],
        ['light-green-50', '#F1F8E9'],
        ['light-green-100', '#DCEDC8'],
        ['light-green-200', '#C5E1A5'],
        ['light-green-300', '#AED581'],
        ['light-green-400', '#9CCC65'],
        ['light-green-500', '#8BC34A'],
        ['light-green-600', '#7CB342'],
        ['light-green-700', '#689F38'],
        ['light-green-800', '#558B2F'],
        ['light-green-900', '#33691E'],
        // light-green（强调色)
        ['light-green-accent', '#B2FF59'],
        ['light-green-a100', '#CCFF90'],
        ['light-green-a200', '#B2FF59'],
        ['light-green-a400', '#76FF03'],
        ['light-green-a700', '#64DD17'],
        // lime（主色)
        ['lime', '#CDDC39'],
        ['lime-50', '#F9FBE7'],
        ['lime-100', '#F0F4C3'],
        ['lime-200', '#E6EE9C'],
        ['lime-300', '#DCE775'],
        ['lime-400', '#D4E157'],
        ['lime-500', '#CDDC39'],
        ['lime-600', '#C0CA33'],
        ['lime-700', '#AFB42B'],
        ['lime-800', '#9E9D24'],
        ['lime-900', '#827717'],
        // lime（强调色)
        ['lime-accent', '#EEFF41'],
        ['lime-a100', '#F4FF81'],
        ['lime-a200', '#EEFF41'],
        ['lime-a400', '#C6FF00'],
        ['lime-a700', '#AEEA00'],
        // yellow（主色)
        ['yellow', '#FFEB3B'],
        ['yellow-50', '#FFFDE7'],
        ['yellow-100', '#FFF9C4'],
        ['yellow-200', '#FFF59D'],
        ['yellow-300', '#FFF176'],
        ['yellow-400', '#FFEE58'],
        ['yellow-500', '#FFEB3B'],
        ['yellow-600', '#FDD835'],
        ['yellow-700', '#FBC02D'],
        ['yellow-800', '#F9A825'],
        ['yellow-900', '#F57F17'],
        // yellow（强调色)
        ['yellow-accent', '#FFFF00'],
        ['yellow-a100', '#FFFF8D'],
        ['yellow-a200', '#FFFF00'],
        ['yellow-a400', '#FFEA00'],
        ['yellow-a700', '#FFD600'],
        // amber（主色)
        ['amber', '#FFC107'],
        ['amber-50', '#FFF8E1'],
        ['amber-100', '#FFECB3'],
        ['amber-200', '#FFE082'],
        ['amber-300', '#FFD54F'],
        ['amber-400', '#FFCA28'],
        ['amber-500', '#FFC107'],
        ['amber-600', '#FFB300'],
        ['amber-700', '#FFA000'],
        ['amber-800', '#FF8F00'],
        ['amber-900', '#FF6F00'],
        // amber（强调色)
        ['amber-accent', '#FFD740'],
        ['amber-a100', '#FFE57F'],
        ['amber-a200', '#FFD740'],
        ['amber-a400', '#FFC400'],
        ['amber-a700', '#FFAB00'],
        // orange（主色)
        ['orange', '#FF9800'],
        ['orange-50', '#FFF3E0'],
        ['orange-100', '#FFE0B2'],
        ['orange-200', '#FFCC80'],
        ['orange-300', '#FFB74D'],
        ['orange-400', '#FFA726'],
        ['orange-500', '#FF9800'],
        ['orange-600', '#FB8C00'],
        ['orange-700', '#F57C00'],
        ['orange-800', '#EF6C00'],
        ['orange-900', '#E65100'],
        // orange（强调色）
        ['orange-accent', '#FFAB40'],
        ['orange-a100', '#FFD180'],
        ['orange-a200', '#FFAB40'],
        ['orange-a400', '#FF9100'],
        ['orange-a700', '#FF6D00'],
        // deep-orange（主色）
        ['deep-orange', '#FF5722'],
        ['deep-orange-50', '#FBE9E7'],
        ['deep-orange-100', '#FFCCBC'],
        ['deep-orange-200', '#FFAB91'],
        ['deep-orange-300', '#FF8A65'],
        ['deep-orange-400', '#FF7043'],
        ['deep-orange-500', '#FF5722'],
        ['deep-orange-600', '#F4511E'],
        ['deep-orange-700', '#E64A19'],
        ['deep-orange-800', '#D84315'],
        ['deep-orange-900', '#BF360C'],
        // deep-orange（强调色）
        ['deep-orange-accent', '#FF6E40'],
        ['deep-orange-a100', '#FF9E80'],
        ['deep-orange-a200', '#FF6E40'],
        ['deep-orange-a400', '#FF3D00'],
        ['deep-orange-a700', '#DD2C00'],
        // Brown
        ['brown', '#795548'],
        ['brown-50', '#EFEBE9'],
        ['brown-100', '#D7CCC8'],
        ['brown-200', '#BCAAA4'],
        ['brown-300', '#A1887F'],
        ['brown-400', '#8D6E63'],
        ['brown-500', '#795548'],
        ['brown-600', '#6D4C41'],
        ['brown-700', '#5D4037'],
        ['brown-800', '#4E342E'],
        ['brown-900', '#3E2723'],
        // Grey
        ['grey', '#9E9E9E'],
        ['grey-50', '#FAFAFA'],
        ['grey-100', '#F5F5F5'],
        ['grey-200', '#EEEEEE'],
        ['grey-300', '#E0E0E0'],
        ['grey-400', '#BDBDBD'],
        ['grey-500', '#9E9E9E'],
        ['grey-600', '#757575'],
        ['grey-700', '#616161'],
        ['grey-800', '#424242'],
        ['grey-900', '#212121'],
        //Blue Grey
        ['blue-grey', '#607D8B'],
        ['blue-grey-50', '#ECEFF1'],
        ['blue-grey-100', '#CFD8DC'],
        ['blue-grey-200', '#B0BEC5'],
        ['blue-grey-300', '#90A4AE'],
        ['blue-grey-400', '#78909C'],
        ['blue-grey-500', '#607D8B'],
        ['blue-grey-600', '#546E7A'],
        ['blue-grey-700', '#455A64'],
        ['blue-grey-800', '#37474F'],
        ['blue-grey-900', '#263238'],
        ['black', '#000000'],
        ['white', '#FFFFFF'],
        ['transparent', 'TRANSPARENT']
    ])

// 随机配色
    function generateRandomColors(type, index) {
        // 主色调、副色调、强调色
        const colors = [
            // 日间主题
            [
                // 浅色
                ['red', 'white'],
                ['pink-400', 'white'],
                ['purple', 'white'],
                ['deep-purple', 'white'],
                ['indigo', 'white'],
                ['teal', 'white'],
                // 深色
                ['blue', 'black'],
                ['light-blue', 'black'],
                ['cyan', 'black'],
                ['green', 'black'],
                ['light-green', 'black'],
                ['lime', 'black'],
                ['yellow', 'black'],
                ['amber', 'black'],
                ['orange', 'black'],
                ['deep-orange', 'black'],
            ],

            // 夜间主题
            [
                // 浅色
                ['red', 'white'],
                ['pink', 'white'],
                ['purple', 'white'],
                ['deep-purple', 'white'],
                ['indigo', 'white'],
                ['teal', 'white'],
                // 深色
                ['blue', 'black'],
                ['light-blue', 'black'],
                ['cyan', 'black'],
                ['green', 'black'],
                ['light-green', 'black'],
                ['lime', 'black'],
                ['yellow', 'black'],
                ['amber', 'black'],
                ['orange', 'black'],
                ['deep-orange', 'black'],
            ]
        ]
        type = 0
        index = index === undefined ? Math.floor(Math.random() * colors[type].length) : index
        return {
            theme: colors[type][index][0],
            nav: colors[type][index][1],
        }
    }

// 加载css/js资源
    function loadResource(css) {
        $('head')
        // mdui
        .append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mdui/0.4.2/css/mdui.min.css"/>')
        .append('<script src="//cdnjs.cloudflare.com/ajax/libs/mdui/0.4.2/js/mdui.min.js"></script>')
        .append(css)
        // .append(initHomeCss())
    }

// 初始需要的css
    function initPostCss() {
        return `
<style>
    /* 帖子字体过大 */
    div#postlist {
        font-size: smaller;
    }
    
    /* region 帖子圆角 */
    
    div#postlist {
        border-radius: 10px;
    }
    div#postlist > table:nth-child(1){
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: none;
    }
    #postlist > div:nth-child(2) tr:nth-child(1) td.pls {
        border-top-left-radius: 10px;
    }
    #f_pst{
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    /*endregion 帖子圆角 */
        
    /*region 引用*/
    .pl .quote blockquote {
        background: #ffffff;
        width: 100%;
        height: 100%;
        font-size: 10px;
    }
    
    .pl .quote{
        background: #ffffff;
        border-left: 6px solid #009688;
        padding: 10px 20px;
        font-size: 10px;
    }
    /*endregion 引用*/
    
    /* 帖子下边按钮 */
    .pob em a {
        padding: 0; 
    }
    .pob.cl a {
        text-decoration: none;
    }
    /* 个人蒸汽、积分……展示的间隔线去掉 */
    .tns th{
        border: none;
    }
    
    /* 帖子宽度 */
    .wp{
        min-width: 1050px;
        max-width: 1050px;
    }
    
    /* 帖子边距 */
    .plc {
        padding: 12px 30px;
    }
    .pls {
        padding-top: 4px;
    }
    
    /* 回到顶部 */
    #J_ScrollTopBtn {
        display: none !important;
    }
    
    /* region回复 */
    #f_pst{
        border-top: 0;
        padding-bottom: 10px;
    }
    /*头像消失*/
    #f_pst .pls {
        display: none;
    }
    #f_pst .plc {
        padding:20px;
    }
    .tedt.mtn {
        border: none;
    }
    
    #f_pst .bar {
        height: 40px;
        line-height: 40px;
    }
    #f_pst .fpd {
        padding-left: 10px;
    }
    #f_pst .fpd a {
        margin: 10px 10px 0 0;
    }
    
    /* 回帖跳回最后一页 */
    label[for=fastpostrefresh]{
        margin-left: 20px;
        margin-bottom: -2px;
    }
    p.ptm.pnpost a.y {
        display: inline-block;
        height: 36px;
        line-height: 36px;
    }
    /*endregion*/
    
    /* region 页脚 */
    .subforunm_foot_text,
    .subforunm_foot_text_bottom,
    .subforunm_foot_intro {
        width: 1100px;
    }
    /* endregion 页脚 */
    
    /* 首页 */
    /*.slideshow > li,*/
    /*.slideshow img {*/
        /*width: 900px !important;*/
        /*height: 600px !important;*/
    /*}*/
</style>`
    }

// 初始主题
    function initTheme(color) {
        let themeName = color.theme
        if (/\d+$/.test(themeName)) {
            themeName = themeName.replace(/-[^-]+$/, '')
        }
        $('body').addClass(`mdui-theme-primary-${themeName} mdui-theme-accent-blue`)
    }

// appbar
    function generateAppbar(navColor) {

        // 解析数据格式
        const MENU_TYPE_CONTENT = 1, MENU_TYPE_DIVIDER = 0
        let data = {
            menu: [
                {
                    text: '平台',
                    icon: 'near_me',
                    color: 'blue',
                    item: [
                        {href: 'f161-1', text: '热点'},
                        {href: 'f319-1', text: '福利'},
                        {href: 'f234-1', text: '购物'},
                        {href: 'f271-1', text: '慈善包'},
                        {href: 'f257-1', text: '汉化'},
                        {href: 'f189-1', text: '资源'},
                        {href: 'f127-1', text: '研讨'},
                        {href: 'f235-1', text: '成就'},
                        {href: 'f129-1', text: '互鉴'},
                        {href: 'f254-1', text: '分享互赠'}
                    ]
                },
                {
                    text: '互助',
                    icon: 'enhanced_encryption',
                    color: 'deep-orange',
                    item: [
                        {href: 'f301-1', text: '技术'},
                        {href: 'f302-1', text: '购物'},
                        {href: 'f304-1', text: '社区'},
                        {href: 'f318-1', text: '资源'},
                        {href: 'f303-1', text: '游戏'},
                        {href: 'f322-1', text: '软硬'},
                        {href: 'f311-1', text: '魔法'},
                    ]
                },
                {
                    text: '友商',
                    icon: 'child_friendly',
                    color: 'green',
                    item: [
                        {href: 'f232-1', text: 'Origin'},
                        {href: 'f274-1', text: 'uPlay'},
                        {href: 'f276-1', text: 'GOG'},
                        {href: 'f316-1', text: '杉果'},
                        {href: 'f326-1', text: 'Windows'},
                        {href: 'f332-1', text: '方块'},
                        {href: 'f325-1', text: 'WeGame'},
                        {href: 'f275-1', text: '主机'},
                        {href: 'f328-1', text: '移动'},
                        {href: 'f277-1', text: '其他'},
                    ]
                },
                {
                    text: '休闲',
                    icon: 'exposure_plus_1',
                    color: 'brown',
                    item: [
                        {href: 'f148-1', text: '水区'},
                        {href: 'f259-1', text: '摄影'},
                        {href: 'f273-1', text: '美食'},
                        {href: 'f200-1', text: '软硬'},
                    ]
                },
                {
                    text: '服务',
                    icon: 'local_mall',
                    color: 'purple',
                    item: [
                        {href: 'f140-1', text: '公告'},
                        {href: 'f197-1', text: '反馈'},
                        {href: 'f238-1', text: '活动'},
                    ]
                },
                {
                    text: '社区',
                    icon: 'flag',
                    color: 'amber',
                    item: [
                        {href: 'f251-1', text: '综合交流 交换观点/资源'},
                        {href: 'f305-1', text: 'DOTA'},
                        {href: 'f299-1', text: 'CSGO'},
                        {href: 'f291-1', text: '生存类'},
                        {href: 'f312-1', text: 'GTA'},
                        {href: 'f244-1', text: '威乐'},
                        {href: 'f246-1', text: '艺电'},
                        {href: 'f245-1', text: '育碧'},
                        {href: 'f248-1', text: '动视暴雪'},
                    ]
                },
                {
                    text: '其乐',
                    icon: 'hot_tub',
                    color: 'red',
                    item: [
                        {href: 'https://www.keylol.com', text: '其乐'},
                    ]
                },
                {
                    text: '赠楼',
                    icon: 'view_carousel',
                    color: 'pink',
                    item: [
                        {href: 'f148-1', text: '互赠平台'},
                    ]
                },
                {
                    text: '交易',
                    icon: 'local_atm',
                    color: 'cyan',
                    item: [
                        {href: 'steamcn_gift-7l.html', text: '交易中心 便捷游戏市集'},
                    ]
                },
                {
                    text: '休闲',
                    icon: 'fingerprint',
                    color: 'green',
                    item: [
                        {href: 'steamcn_gift-7l.html', text: '水区'},
                    ]
                },
            ],
            nav: [
                {text: 'home', href: '/home'}
            ],
            userInfo: {
                isLogon: false,
                messageTagInfo: {
                    select: 'a.btn.btn-user-action:first > span',
                    href: 'home.php?mod=space&amp;do=pm',
                    icon: 'email',
                },
                remindTagInfo: {
                    select: 'a.btn.btn-user-action:last > span',
                    href: 'home.php?mod=space&amp;do=notice&amp;view=system',
                    icon: 'notifications',
                },
                avatar: {
                    img: '',
                    menu: [
                        {
                            type: MENU_TYPE_CONTENT,
                            href: 'javascript:;',
                            onclick: '',
                            text: ''
                        },
                        {
                            type: MENU_TYPE_DIVIDER
                        }
                    ]
                }
            }
        }

        parseData()
        replacerAppbar()

        // 解析数据
        function parseData() {
            parseNav()
            parseUserInfo()

            // 解析面包屑导航栏
            function parseNav() {
                data.nav = []
                $('.subforum_left_title_left_up > div > a').each((i, e) => {
                    data.nav.push({
                        href: e.getAttribute('href'),
                        text: e.innerText
                    })
                })
            }

            function parseUserInfo() {
                const $dropdown = $('.list-inline > .dropdown')

                if ($dropdown.length <= 0) {
                    data.userInfo.isLogon = false
                } else {
                    data.userInfo.isLogon = true
                    parseAvatarImg()
                    parseMenu()
                }

                // 解析头像
                function parseAvatarImg() {
                    data.userInfo.avatar.img = $('img.avatar.img-circle').attr('src')
                }

                // 解析菜单
                function parseMenu() {
                    data.userInfo.avatar.menu = []

                    // 单独添加个人中心
                    data.userInfo.avatar.menu.push({
                        type: MENU_TYPE_CONTENT,
                        href: $dropdown.find('a').attr('href'),
                        onclick: null,
                        text: '个人中心',
                    })

                    $dropdown.find('li').each((i, e) => {
                        let item = {}
                        if (e.getAttribute('class') !== 'divider') {
                            let find = e.getElementsByTagName('a')[0]
                            item = {
                                type: MENU_TYPE_CONTENT,
                                href: find.getAttribute('href'),
                                onclick: find.getAttribute('onclick'),
                                text: find.innerText
                            }
                        } else {
                            item = {type: MENU_TYPE_DIVIDER}
                        }
                        data.userInfo.avatar.menu.push(item)
                    })
                }
            }
        }

        // 替换 appbar
        function replacerAppbar() {
            // 面包屑导航
            function generateNav() {
                if (data.nav.length > 0) {
                    let tmp = ''
                    data.nav.forEach((e, i) => {
                        tmp += `<a class="mdui-text-color-${navColor}" href="${e.href}"><span>${e.text}</span></a>`
                        // html += `<span>${e.text}</span>`
                        if (i < data.nav.length - 1) {
                            tmp += `<span class="mdui-p-l-1 mdui-p-r-1">&gt;</span>`
                        }
                    })
                    return `
                    <a href="javascript:;" class="mdui-typo-title">
                        <div class="mdui-valign mdui-typo">${tmp}</div>
                    </a>
                    `
                }
                return ''
            }

            // 消息、提醒、头像
            function generateMsgAndRemindAndAvatar() {
                if (!data.userInfo.isLogon) {
                    return ''
                }
                return generateMsgAndRemind() + generateAvatarMenu()


                function generateMsgAndRemind() {
                    function gen(tagInfo) {
                        const $tag = $(tagInfo.select)
                        return `<a href="${tagInfo.href}" class="mdui-btn mdui-ripple${isNaN(parseInt($tag.text())) ? ' mdui-btn-icon' : ''}"><i class="mdui-icon material-icons">${tagInfo.icon}</i>&nbsp;${$tag.text()}</a>`
                    }

                    return gen(data.userInfo.messageTagInfo) + gen(data.userInfo.remindTagInfo)
                }

                // 头像菜单
                function generateAvatarMenu() {
                    let html = `
                    <img class="mdui-card-header-avatar"  mdui-menu="{target: '#avatarMenu'}" src="${data.userInfo.avatar.img}">
                    <ul class="mdui-menu" id="avatarMenu">
                    `
                    data.userInfo.avatar.menu.forEach((e) => {
                        if (e.type === MENU_TYPE_DIVIDER) {
                            html += '<li class="mdui-divider"></li>'
                        } else {
                            html += `<li class="mdui-menu-item"><a class="mdui-ripple" onclick="${e.onclick}" href="${e.href}">${e.text}</a></li>`
                        }
                    })
                    html += '</ul>'
                    return html
                }
            }

            //TODO: 待开发 登录、注册
            function generateLoginAndRegister() {
                console.log(2)
                return ''
            }

            // Appbar 菜单选项
            function generateAppbarMenu() {
                let html = ''
                data.menu.forEach((e) => {
                    html += `
                        <div class="mdui-collapse-item ">
                            <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
                                <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-${e.color}">${e.icon}</i>
                                <div class="mdui-list-item-content">${e.text}</div>
                                <i class="mdui-collapse-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
                            </div>
                            <div class="mdui-collapse-item-body mdui-list">
                        `

                    e.item.forEach((f) => {
                        html += `<a href="${f.href}" class="mdui-list-item mdui-ripple">${f.text}</a>`
                    })
                    html += '</div></div>'
                })
                return html
            }

            // 生成
            $('body').prepend(`
            <header class="mdui-appbar mdui-appbar-fixed mdui-appbar-scroll-hide">
                <div class="mdui-toolbar mdui-color-theme">
                    <a href="javascript:;" class="mdui-btn mdui-btn-icon" mdui-drawer="{target: '#left-drawer',overlay:true}"><i class="mdui-icon material-icons">menu</i></a>
                    <a href="https://steamcn.com" class="mdui-typo-headline">SteamCN</a>
                    ${generateNav()}
                    <div class="mdui-toolbar-spacer"></div>
                    <a href="https://steamcn.com/search.php?mod=forum" target="_blank" class="mdui-btn mdui-btn-icon mdui-ripple"><i class="mdui-icon material-icons">search</i></a>
                    ${data.userInfo.isLogon ? generateMsgAndRemindAndAvatar() : generateLoginAndRegister()}
                    
                </div>
            </header>
            <div class="mdui-drawer mdui-drawer-close mdui-color-white" id="left-drawer">
                <div class="mdui-list" mdui-collapse="{accordion: true}">
                    ${generateAppbarMenu()}
                </div>
            </div>
        `)

            $('#nav-menu').remove()
            $('.tb-container').remove()
        }
    }


    function tagState(selector, state) {
        if (typeof(selector) === 'string') {
            selector = [selector]
        }

        if (state) {
            return selector.join(state + ',') + state
        }
        return selector.join()
    }

// 生成css
// 链接下划线
    function mdui_typo_a(selector, height, color) {
        return `
    ${tagState(selector)} {
        position: relative;
        display: inline-block;
        overflow: hidden;
        text-decoration: none !important;
        vertical-align: top;
        outline: 0;
    }
    ${tagState(selector, ':before')} {
        position: absolute;
        top: auto;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ${height};
        content: ' ';
        background-color: ${color ? color : '#ff4081'};
        -webkit-transition: all .2s;
        transition: all .2s;
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden
    }
    ${tagState(selector, ':focus:before')}, ${tagState(selector, ':hover:before')} {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }
    `
    }

// 文本截断
    function mdui_text_truncate(selector) {
        return `
    ${tagState(selector)} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    `
    }

// 阴影1-24
    function mdui_shadow(selector, size) {

        let css = ''
        switch (size) {
            case 0:
                css = `
                -webkit-box-shadow: none;
                box-shadow: none;
			`
                break
            case 1:
                css = `
                -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12)
			`
                break
            case 2:
                css = `
                -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)
			`
                break
            case 3:
                css = `
                -webkit-box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px 0 rgba(0, 0, 0, .14), 0 1px 8px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px 0 rgba(0, 0, 0, .14), 0 1px 8px 0 rgba(0, 0, 0, .12)
			`
                break
            case 4:
                css = `
                -webkit-box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12)
			`
                break
            case 5:
                css = `
                -webkit-box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 5px 8px 0 rgba(0, 0, 0, .14), 0 1px 14px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 5px 8px 0 rgba(0, 0, 0, .14), 0 1px 14px 0 rgba(0, 0, 0, .12)
			`
                break
            case 6:
                css = `
                -webkit-box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
                box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12)
			`
                break
            case 7:
                css = `
                -webkit-box-shadow: 0 4px 5px -2px rgba(0, 0, 0, .2), 0 7px 10px 1px rgba(0, 0, 0, .14), 0 2px 16px 1px rgba(0, 0, 0, .12);
                box-shadow: 0 4px 5px -2px rgba(0, 0, 0, .2), 0 7px 10px 1px rgba(0, 0, 0, .14), 0 2px 16px 1px rgba(0, 0, 0, .12)
			`
                break
            case 8:
                css = `
                -webkit-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
                box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)
			`
                break
            case 9:
                css = `
                -webkit-box-shadow: 0 5px 6px -3px rgba(0, 0, 0, .2), 0 9px 12px 1px rgba(0, 0, 0, .14), 0 3px 16px 2px rgba(0, 0, 0, .12);
                box-shadow: 0 5px 6px -3px rgba(0, 0, 0, .2), 0 9px 12px 1px rgba(0, 0, 0, .14), 0 3px 16px 2px rgba(0, 0, 0, .12)
			`
                break
            case 10:
                css = `
                -webkit-box-shadow: 0 6px 6px -3px rgba(0, 0, 0, .2), 0 10px 14px 1px rgba(0, 0, 0, .14), 0 4px 18px 3px rgba(0, 0, 0, .12);
                box-shadow: 0 6px 6px -3px rgba(0, 0, 0, .2), 0 10px 14px 1px rgba(0, 0, 0, .14), 0 4px 18px 3px rgba(0, 0, 0, .12)
			`
                break
            case 11:
                css = `
                -webkit-box-shadow: 0 6px 7px -4px rgba(0, 0, 0, .2), 0 11px 15px 1px rgba(0, 0, 0, .14), 0 4px 20px 3px rgba(0, 0, 0, .12);
                box-shadow: 0 6px 7px -4px rgba(0, 0, 0, .2), 0 11px 15px 1px rgba(0, 0, 0, .14), 0 4px 20px 3px rgba(0, 0, 0, .12)
			`
                break
            case 12:
                css = `    
                -webkit-box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 12px 17px 2px rgba(0, 0, 0, .14), 0 5px 22px 4px rgba(0, 0, 0, .12);
                box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 12px 17px 2px rgba(0, 0, 0, .14), 0 5px 22px 4px rgba(0, 0, 0, .12)
			`
                break
            case 13:
                css = `
                -webkit-box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 13px 19px 2px rgba(0, 0, 0, .14), 0 5px 24px 4px rgba(0, 0, 0, .12);
                box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 13px 19px 2px rgba(0, 0, 0, .14), 0 5px 24px 4px rgba(0, 0, 0, .12)
			`
                break
            case 14:
                css = `
                -webkit-box-shadow: 0 7px 9px -4px rgba(0, 0, 0, .2), 0 14px 21px 2px rgba(0, 0, 0, .14), 0 5px 26px 4px rgba(0, 0, 0, .12);
                box-shadow: 0 7px 9px -4px rgba(0, 0, 0, .2), 0 14px 21px 2px rgba(0, 0, 0, .14), 0 5px 26px 4px rgba(0, 0, 0, .12)
			`
                break
            case 15:
                css = `
                -webkit-box-shadow: 0 8px 9px -5px rgba(0, 0, 0, .2), 0 15px 22px 2px rgba(0, 0, 0, .14), 0 6px 28px 5px rgba(0, 0, 0, .12);
                box-shadow: 0 8px 9px -5px rgba(0, 0, 0, .2), 0 15px 22px 2px rgba(0, 0, 0, .14), 0 6px 28px 5px rgba(0, 0, 0, .12)
			`
                break
            case 16:
                css = `
                -webkit-box-shadow: 0 8px 10px -5px rgba(0, 0, 0, .2), 0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12);
                box-shadow: 0 8px 10px -5px rgba(0, 0, 0, .2), 0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12)
			`
                break
            case 17:
                css = `
                -webkit-box-shadow: 0 8px 11px -5px rgba(0, 0, 0, .2), 0 17px 26px 2px rgba(0, 0, 0, .14), 0 6px 32px 5px rgba(0, 0, 0, .12);
                box-shadow: 0 8px 11px -5px rgba(0, 0, 0, .2), 0 17px 26px 2px rgba(0, 0, 0, .14), 0 6px 32px 5px rgba(0, 0, 0, .12)
			`
                break
            case 18:
                css = ` 
                -webkit-box-shadow: 0 9px 11px -5px rgba(0, 0, 0, .2), 0 18px 28px 2px rgba(0, 0, 0, .14), 0 7px 34px 6px rgba(0, 0, 0, .12);
                box-shadow: 0 9px 11px -5px rgba(0, 0, 0, .2), 0 18px 28px 2px rgba(0, 0, 0, .14), 0 7px 34px 6px rgba(0, 0, 0, .12)
			`
                break
            case 19:
                css = `
                -webkit-box-shadow: 0 9px 12px -6px rgba(0, 0, 0, .2), 0 19px 29px 2px rgba(0, 0, 0, .14), 0 7px 36px 6px rgba(0, 0, 0, .12);
                box-shadow: 0 9px 12px -6px rgba(0, 0, 0, .2), 0 19px 29px 2px rgba(0, 0, 0, .14), 0 7px 36px 6px rgba(0, 0, 0, .12)
			`
                break
            case 20:
                css = `
                -webkit-box-shadow: 0 10px 13px -6px rgba(0, 0, 0, .2), 0 20px 31px 3px rgba(0, 0, 0, .14), 0 8px 38px 7px rgba(0, 0, 0, .12);
                box-shadow: 0 10px 13px -6px rgba(0, 0, 0, .2), 0 20px 31px 3px rgba(0, 0, 0, .14), 0 8px 38px 7px rgba(0, 0, 0, .12)
			`
                break
            case 21:
                css = `       
                -webkit-box-shadow: 0 10px 13px -6px rgba(0, 0, 0, .2), 0 21px 33px 3px rgba(0, 0, 0, .14), 0 8px 40px 7px rgba(0, 0, 0, .12);
                box-shadow: 0 10px 13px -6px rgba(0, 0, 0, .2), 0 21px 33px 3px rgba(0, 0, 0, .14), 0 8px 40px 7px rgba(0, 0, 0, .12)
			`
                break
            case 22:
                css = `       
                -webkit-box-shadow: 0 10px 14px -6px rgba(0, 0, 0, .2), 0 22px 35px 3px rgba(0, 0, 0, .14), 0 8px 42px 7px rgba(0, 0, 0, .12);
                box-shadow: 0 10px 14px -6px rgba(0, 0, 0, .2), 0 22px 35px 3px rgba(0, 0, 0, .14), 0 8px 42px 7px rgba(0, 0, 0, .12)
			`
                break
            case 23:
                css = `       
                -webkit-box-shadow: 0 11px 14px -7px rgba(0, 0, 0, .2), 0 23px 36px 3px rgba(0, 0, 0, .14), 0 9px 44px 8px rgba(0, 0, 0, .12);
                box-shadow: 0 11px 14px -7px rgba(0, 0, 0, .2), 0 23px 36px 3px rgba(0, 0, 0, .14), 0 9px 44px 8px rgba(0, 0, 0, .12)
			`
                break
            case 24:
                css = `       
                -webkit-box-shadow: 0 11px 15px -7px rgba(0, 0, 0, .2), 0 24px 38px 3px rgba(0, 0, 0, .14), 0 9px 46px 8px rgba(0, 0, 0, .12);
                box-shadow: 0 11px 15px -7px rgba(0, 0, 0, .2), 0 24px 38px 3px rgba(0, 0, 0, .14), 0 9px 46px 8px rgba(0, 0, 0, .12)
			`
                break

        }
        return `${tagState(selector)} {${css}}`
    }

// 鼠标悬停 阴影
    function mdui_hoverable(selector) {
        return `
        ${tagState(selector)} {
            -webkit-transition: -webkit-box-shadow .25s cubic-bezier(.4, 0, .2, 1);
            transition: -webkit-box-shadow .25s cubic-bezier(.4, 0, .2, 1);
            transition: box-shadow .25s cubic-bezier(.4, 0, .2, 1);
            transition: box-shadow .25s cubic-bezier(.4, 0, .2, 1), -webkit-box-shadow .25s cubic-bezier(.4, 0, .2, 1);
            will-change: box-shadow
        }
        ${tagState(selector, ':focus')}, ${tagState(selector, ':hover')} {
            -webkit-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)
        }
    `
    }

    function initHomeCss(color) {
        return `
    <style type="text/css">
        body {
            padding-top: 80px;
            background: ${mdcolor.get(color.theme)};
        }
        #J_ScrollTopBtn{
            display: none !important;
        }
    
        /* region 整体 */
        .wp,
        #wp {
            min-width: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
        }
        
        ${mdui_typo_a('.subject_row_detail_text_up a', '2px', mdcolor.get(color.nav))}
        
        ${mdui_hoverable(['.subject_row_detail', '.subject_row_detail2'])}
        .subject_row_detail, 
        .subject_row_detail2 {
            width: 17%;
            padding: 16px;
            border-radius: 3px;
        }
         #wp > div {
            width: 100%;
            min-width: 1200px;
            height: unset !important;
            margin: 0;
            padding-top: 100px;
            padding-bottom: 100px;
        }
        
        /* 背景色 */
        #diy1 {
            width: 1200px;
            margin: 0 auto;
        }
        #wp > div:nth-child(2) {
            background: #3f51b5;
        }
        #wp > div:nth-child(3) {
            background: #b3e0e1;
        }
        #wp > div:nth-child(4) {
            background: #3f51b5;
        }
        #wp > div:nth-child(5) {
            background: #fafafa;
        }
        #wp > div:nth-child(6) {
            background: #e91e63;
        }
        #wp > div:nth-child(7) {
            background: #F7f7f7;
        }
        #wp > div:nth-child(8) {
            background: #607d8b;
        }
        /* 分区标题 */
        .index_subject_title div,
        .index_subject_title2 div {
            float: unset;
            width: 300px;
            height: 100px;
            font-size: 20px;
            left: calc((100% - 300px) / 2);
            
            top: unset;
            right: unset;
            bottom: unset;
            padding: unset;
            background-color: unset;
        }
        /* 分区居中 */
        .index_subject_row,
        .index_subject_row2 {
            position: static;
            top: auto;
            width: 1200px;
            margin: 0 auto;
        }
        .subject_row_detail,
        .subject_row_detail2,
        .index_middle_subject div,
        .index_foot_subjec div{
            margin-left: 0 !important;
        }
        /* endregion 整体 */
        
        /* region 0.关注重点 & 站点公告*/       
        .index_navi_left,
        .index_navi_right,
        .blue_dot,
        .floatcontainer.doc_header.wp.cl .dot {
            background: unset;
        }
        .floatcontainer.doc_header.wp.cl a {
            color: ${mdcolor.get(color.nav)};
        }
        ${mdui_typo_a('.floatcontainer.doc_header.wp.cl a', '2px', mdcolor.get(color.nav))}
        ${mdui_hoverable(['.index_navi_left', '.index_navi_right'])}

        /* endregion 0.关注重点 & 站点公告*/
        
        /* region 1.轮播图和tab */
        /* 布局 */
        ${mdui_shadow('#frameCX66dD', 2)}
        ${mdui_hoverable('#frameCX66dD')}
        
        .slideshow li,
        .slideshow img {
            width:544px !important;
            height: 370px !important;
        }
        .frame-1-1-r {
            width: auto;
            float: right;
        }
        .bbs_top {
            height: 371px;
        }
        .module.cl.xl.xl1 a {
            font-size: 9px;
            max-width: 450px;
        }
        .frame-tab .xl1 li {
            height: 36px;
            line-height: 36px;
            padding: 0 16px;
        }
        .frame-tab .tb li a {
            font-size: 14px;
        }
        /* tab */
        #tabPAhn0P_content,
        #tabPAhn0P_content * {
            background: unset;
            margin: 0;
        }
        .tab-title {
            background: none;
        }
        .xl ol > li {
            margin: 0;
        }
        .frame-tab .tb-c {
            padding: 0;
        }
        .xl ol > li:hover {
            background: #EBEBEB;
            transition: all .25s cubic-bezier(.4, 0, .2, 1);
        }
        ul.tb.cl > li {
            background: #3f51b5 ;
            color: white;
            transition: all .25s cubic-bezier(.4, 0, .2, 1);
        }
        ul.tb.cl > li:hover {
            background: #6876c5;
        }
        ul.tb.cl > li a {
            color: #9ca6d9;
        }
        .frame-tab .tb li.a a {
            color: white;
            background: none;
        }
        
        ${mdui_typo_a('.module.cl.xl.xl1 a:nth-child(even)', '2px', '#03A9F4')}
        ${mdui_text_truncate('.module.cl.xl.xl1 a')}
        .xl1 ol >li:nth-child(even) {
            background-color: #fafafa !important;
        }
        .xl1 ol >li:nth-child(odd) {
            background-color: #ECEFF1 !important;
        }
        
        
        #diy1 span.title {
            background: #3f51b5 !important;
            height: 46px !important;
            line-height: 46px !important;
        }
        #diy1 .slidebar {
            top: unset !important;
            left: unset !important;
            bottom: 53px !important;
            right: -107px; !important;
        }
        /* endregion 1.轮播图和tab */
        
        /* region 2.平台周边 */
        #wp > div:nth-child(3) .index_subject_title > div {
            color: #009688 !important;
            font-weight: bold;
        }
        #wp > div:nth-child(3) .forum-icon.hot,
        #wp > div:nth-child(3) .forum-icon {
            background: #009688;
        }
        #wp > div:nth-child(3) .subject_row_detail_text_up a {
            color: #009688;
        }
        #wp > div:nth-child(3) .forum_today_post {
            color: #004D40;
        }
        ${mdui_typo_a('#wp > div:nth-child(3) .subject_row_detail_text_up a', '2px', '#009688')}
        /* endregion 2.平台周边 */
        
        /* region 3.问题互助 */
        #wp > div:nth-child(4) .index_subject_title2 > div {
            color: #f06292 !important;
            font-weight: bold;
        }
        #wp > div:nth-child(4) .forum-icon.hot,
        #wp > div:nth-child(4) .forum-icon {
            background: #f06292;
        }
        #wp > div:nth-child(4) .subject_row_detail_text_up a {
            color: #f06292;
        }
        #wp > div:nth-child(4) .forum_today_post {
            color: #e91e63;
        }
        #wp > div:nth-child(4) .subject_row_detail_text_down {
            color: #9ca6d9;
        }
        ${mdui_typo_a('#wp > div:nth-child(4) .subject_row_detail_text_up a', '2px', '#f06292')}
        /* endregion 3.问题互助 */
        
        /* region 4.友商平台 */
        #wp > div:nth-child(5) .index_subject_title2 > div {
            color: #ffc107 !important;
            font-weight: bold;
        }
        #wp > div:nth-child(5) .forum-icon.hot,
        #wp > div:nth-child(5) .forum-icon {
            background: #ffc107;
        }
        #wp > div:nth-child(5) .subject_row_detail_text_up a {
            color: #ffc107;
        }
        #wp > div:nth-child(5) .forum_today_post {
            color: #ffa000;
        }
        ${mdui_typo_a('#wp > div:nth-child(5) .subject_row_detail_text_up a', '2px', '#ffc107')}
        /* endregion 4.友商平台 */
        
        /* region 5.游戏讨论 */
        #wp > div:nth-child(6) .index_subject_title > div {
            color: #3949ab !important;
            font-weight: bold;
        }
        #wp > div:nth-child(6) .forum-icon.hot,
        #wp > div:nth-child(6) .forum-icon {
            background: #3949ab;
        }
        #wp > div:nth-child(6) .subject_row_detail_text_up a {
            color: #3949ab;
        }
        #wp > div:nth-child(6) .forum_today_post {
            color: #0d47a1;
        }
        #wp > div:nth-child(6) .subject_row_detail_text_down {
            color: #ffffff;
        }
        ${mdui_typo_a('#wp > div:nth-child(6) .subject_row_detail_text_up a', '2px', '#3949ab')}
        /* endregion 5.游戏讨论 */
        
        /* region 6.汉化 */
        /* 居中 */
        #wp > div:nth-child(7) {
            width: calc(100% - (100% - 1200px) / 2);
            padding-left: calc((100% - 1200px) / 2);
        }
        #wp > div:nth-child(7) > div {
            width: calc(1200px / 3 - 20px);
            margin-top: unset;
            background: unset;
            height: unset;
        }
        ${mdui_hoverable('#wp > div:nth-child(7) > div')}
        #wp > div:nth-child(7) .middle_subject_row {
            padding-left: 20px;
        }
        .middle_subject_detail_right {
            font-size: 14px;
        }
        .middle_subject_detail_right > div:nth-child(1) {
            margin-top: 3px;
        }
        .middle_subject_detail_right > div:nth-child(3) {
            margin-top: -1px !important;
        }
        .middle_subject_detail_right a:nth-child(2){
            padding-right: 10px;
        }
        /* region 天邈汉化组 */
        #wp > div:nth-child(7) > div:nth-child(1) a{
            color: #900;    
        }
        #wp > div:nth-child(7) > div:nth-child(1) .dot {
            background: #900;
        }
        ${mdui_typo_a('#wp > div:nth-child(7) > div:nth-child(1) a', '2px', '#900')}
        /* endregion 天邈汉化组 */

        /* region 蒹葭汉化组 */
        #wp > div:nth-child(7) > div:nth-child(2) a{
            color: #f41645;    
        }
        #wp > div:nth-child(7) > div:nth-child(2) .dot {
            background: #f41645;
        }
        ${mdui_typo_a('#wp > div:nth-child(7) > div:nth-child(2) a', '2px', '#f41645')}
        /* endregion 蒹葭汉化组 */
        
        /* region 起源汉化组 */
        #wp > div:nth-child(7) > div:nth-child(3) a{
            color: #f49d36;    
        }
        #wp > div:nth-child(7) > div:nth-child(3) .dot {
            background: #f49d36;
        }
        ${mdui_typo_a('#wp > div:nth-child(7) > div:nth-child(3) a', '2px', '#f49d36')}
        /* endregion 起源汉化组 */
        
        /* endregion 6 */
        
        /* region 7.休闲、社区 */
        #wp > div:nth-child(8) {
            width: calc(100% - (100% - 1200px) / 2);
            padding-left: calc((100% - 1200px) / 2);
        }
        .foot_subject_left,.foot_subject_right {
            margin: 0;
            background: unset;
        }
        ${mdui_hoverable(['.foot_subject_right', '.foot_subject_left'])}
        ${mdui_typo_a('#wp > div:nth-child(8) a', '2px', '#01579b')}
        #wp > div:nth-child(8) .foot_subject_detail_right {
            font-size: 14px;
        }
        #wp > div:nth-child(8) .foot_subject_detail_right > div:nth-child(1) {
            margin-top: 2px !important;
        }
        #wp > div:nth-child(8) .foot_subject_detail_right > div:nth-child(3),
        #wp > div:nth-child(8) .foot_subject_detail_right > div:nth-child(4) {
            margin-top: -1px !important;
        }
        #wp > div:nth-child(8) .foot_right_subject > div{
            font-size: 14px;
            padding-top: 3px;
            margin: 0 !important;
        }
        
        #wp > div:nth-child(8) .forum-icon.hot,
        #wp > div:nth-child(8) .forum-icon,
        #wp > div:nth-child(8) .dot {
            background: #01579b;
        }
        #wp > div:nth-child(8) a {
            color: #01579b;
        }
        /* endregion 7 */
        
        /* region 8.人数 */
        .bbs_daily_stats {
            margin-top: unset;
            background: #424242;
            color: white;
        }
        .bbs_daily_stats a {
            color: #b3e5fc;
        }
        ${mdui_typo_a('.bbs_daily_stats a', '2px', '#b3e5fc')}
        /* endregion 8 */
        
        /* region 9.页脚 */
        .subforunm_foot_banner {
            padding-top: 30px;
            padding-bottom: 30px;
        }
        .subforunm_foot_bg img {
            display: none;
        }
        .subforunm_foot_banner,
        .subforunm_foot {
            background: #212121;
            margin-top: unset;
        }
        .subforunm_foot_banner > div {
            width: 1200px;
        }
        .subforunm_foot_intro {
            display: none;
        }
        ${mdui_typo_a('.subforunm_foot_banner a', '2px', 'white')}
        /* endregion 9 */
    </style>`
    }


    // 帖子标题 浏览数据
    function generatePostTitleAndAttr() {
        let data = {
            // 标题
            title: '',
            // 访问数据
            attr: {
                reply: {
                    text: '回复',
                    amount: '',
                    onclick: ''
                },
                view: {
                    text: '查看',
                    amount: ''
                },
                favorite: {
                    text: '收藏',
                    amount: '',
                    onclick: ''
                }
            }
        }

        parseData()
        remove()
        generate()

        function parseData() {
            data.title = $('a#thread_subject').attr('title')

            const $postData = $('div.subforum_right_title > div div:odd')
            const $postFavorite = $('#k_favorite')
            const $postReply = $('#post_reply')

            data.attr = {
                reply: {
                    text: '回复',
                    amount: $postData[0].innerText,
                    onclick: $postReply.attr('onclick')
                },
                view: {
                    text: '查看',
                    amount: $postData[1].innerText
                },
                favorite: {
                    text: '收藏',
                    amount: $postData[2].innerText,
                    onclick: `showWindow('k_favorite', '${$postFavorite.attr('href')}', 'get', 0);`
                }
            }
        }

        function remove() {
            $('#pgt, div.subforum').remove()
        }

        function generate() {
            $('body').prepend(`
            <div style="z-index: 99; width: 1050px; margin-bottom: 20px; margin-top: 200px; "
                    class="mdui-color-theme mdui-center">
                <div class="mdui-center"><h1 class="mdui-text-center mdui-text-truncate mdui-m-b-5" style="font-size: 40px" mdui-tooltip="{content: '${data.title}'}">${data.title}</h1></div>
                <div class="mdui-valign">
                    <button  class="mdui-btn mdui-btn-icon" mdui-tooltip="{content: '发帖'}" mdui-ripple mdui-menu="{target: '#menu-post'}">
                        <i class="mdui-icon  material-icons">create</i>
                    </button>
                    <ul class="mdui-menu" id="menu-post">
                        <li class="mdui-menu-item">
                        <a href="/forum.php?mod=post&action=newthread&fid=129" class="mdui-ripple">
                          <i class="mdui-menu-item-icon mdui-icon mdui-text-color-blue material-icons">create</i>
                          发表帖子
                        </a>
                      </li>
                      <li class="mdui-menu-item">
                        <a href="/forum.php?mod=post&action=newthread&fid=129&special=1" class="mdui-ripple">
                          <i class="mdui-menu-item-icon mdui-icon mdui-text-color-deep-orange material-icons">assessment</i>
                          发起投票
                        </a>
                      </li>
                      <li class="mdui-menu-item">
                        <a href="/forum.php?mod=post&action=newthread&fid=129&special=3" class="mdui-ripple">
                          <i class="mdui-menu-item-icon mdui-icon mdui-text-color-green material-icons">my_location</i>
                          发布悬赏
                        </a>
                      </li>
                    </ul>
                    <button class="mdui-btn mdui-ripple " mdui-tooltip="{content: '回复'}" onclick="${data.attr.reply.onclick}">
                        <i class="mdui-icon mdui-icon-left material-icons">chat</i> ${data.attr.reply.amount}
                    </button>
                    <button class="mdui-btn mdui-ripple" mdui-tooltip="{content: '查看'}" >
                        <i class="mdui-icon material-icons">remove_red_eye</i> ${data.attr.view.amount}
                    </button>
                    <button class="mdui-btn mdui-ripple" mdui-tooltip="{content: '收藏'}" onclick="${data.attr.favorite.onclick}">
                        <i class="mdui-icon material-icons">favorite</i> ${data.attr.favorite.amount}
                    </button>
                </div>
            </div>
        `)
        }
    }

// 帖子内容 md化
    function mdPost() {

        $('body').append(`<div class="mdui-color-theme mdui-container-fluid" style="min-width: 1050px;height: 450px; z-index: -1;position: absolute; top: 0;left: 0;right: 0; margin: 0"></div>`)

        mdContent()
        generateBtnGroup()
        mdReply()
        mdPostSelf()
        mdPostOthers()

        // 帖子
        function mdContent() {
            // 鼠标悬浮加深阴影 阴影
            $('#postlist').addClass('mdui-hoverable mdui-shadow-5')

            // 回复间隙 改为主题色
            $('.ad').addClass('mdui-color-theme')

            // 帖子-回复按钮
            $('.pob.cl a').addClass('mdui-btn mdui-ripple mdui-btn-dense')

        }

        // 回复页数 按钮组
        function generateBtnGroup() {
            // <div class="mdui-btn-group" style="width: 100%">
            //   <div style="float: right">
            //       <a class="mdui-btn-dense mdui-btn"><i class="mdui-icon material-icons">chevron_left</i></a>
            //       <a class="mdui-btn-dense mdui-btn">1</a>
            //       <a class="mdui-btn-dense mdui-btn mdui-btn-active">2</a>
            //       <a class="mdui-btn-dense mdui-btn">3</a>
            //       <a class="mdui-btn-dense mdui-btn">4</a>
            //       <a class="mdui-btn-dense mdui-btn">5</a>
            //       <a class="mdui-btn-dense mdui-btn">6</a>
            //       <a class="mdui-btn-dense mdui-btn">7</a>
            //       <a class="mdui-btn-dense mdui-btn">8</a>
            //       <a class="mdui-btn-dense mdui-btn">9</a>
            //       <a class="mdui-btn-dense mdui-btn">10</a>
            //       <a class="mdui-btn-dense mdui-btn">...32</a>
            //       <a class="mdui-btn-dense mdui-btn"><i class="mdui-icon material-icons">chevron_right</i></a>
            //     </div>
            // </div>

            // 查找特殊节点
            function findPage(cName) {
                const tmpNode = $(`.pg .${cName}`)
                if (tmpNode === undefined) {
                    return undefined
                }
                return {
                    text: tmpNode.text(),
                    href: tmpNode.attr('href')
                }
            }

            function addTextBtn(data, isActive) {
                return `<a href="${data.href}" class="mdui-btn-dense mdui-btn${isActive ? ' mdui-btn-active mdui-color-theme' : ''}">${data.text}</a>`
            }

            function addIconBtn(data, icon) {
                return `<a href="${data.href}" style="padding:0 6px" class="mdui-btn-dense mdui-btn"><i class="mdui-icon material-icons">${icon}</i></a>`
            }

            let pervPage = findPage('prev')
            let firstPage = findPage('first')
            let lastPage = findPage('last')
            let nextPage = findPage('nxt')

            let pageGroupHtml = `<div class="mdui-btn-group mdui-typo" style="width: 100%"><div style="float: right">`
            if (pervPage.href) {
                pageGroupHtml += addIconBtn(pervPage, 'chevron_left')
            }
            if (firstPage.href) {
                pageGroupHtml += addTextBtn(firstPage, false)
            }

            $('.pg > a:not(.first,.prev,.nxt,.last),.pg > strong').each((i, e) => {
                const date = {
                    href: e.href === undefined ? 'javascript:;' : e.href,
                    text: e.innerText
                }
                pageGroupHtml += addTextBtn(date, e.href === undefined)
            })

            if (lastPage.href) {
                pageGroupHtml += addTextBtn(lastPage, false)
            }
            if (nextPage.href) {
                pageGroupHtml += addIconBtn(nextPage, 'chevron_right')
            }
            pageGroupHtml += `</div></div>`

            $('#postlist').append(pageGroupHtml)
            // 隐藏默认
            $('.pgbtn,.pgs.mtm.mbm.cl').remove()

        }

        // 底部回复区域
        function mdReply() {
            // 回复按钮
            $('#f_pst').appendTo('#postlist')
            .prepend('<div class="mdui-color-theme" style="width: 100%; height: 5px"></div>')

            $('#fastpostsubmit').replaceWith('<button class="mdui-btn mdui-color-theme mdui-ripple mdui-btn-raised"><i class="mdui-icon mdui-icon-left material-icons">chat</i>回复</button>')

            // $('p.ptm.pnpost').addClass('mdui-valign')
            $('p.ptm.pnpost a.y').appendTo('p.ptm.pnpost')

            // 回帖跳转最后一页
            $('label[for=fastpostrefresh]').addClass('mdui-checkbox')
            .append('<i class="mdui-checkbox-icon"></i>')
        }

        // 帖子正文
        function mdPostSelf() {

            function genBtn(e, text) {
                return `<a class="mdui-btn mdui-ripple mdui-color-theme" href="${e.attr('href')}" id="${e.attr('id')}" onclick="${e.attr('onclick')}" mdui-tooltip="{content: '${e.attr('title')}'}" >${text}</a>`
            }

            // 收藏、评分按钮
            let $k_favorite = $('a#k_favorite')
            let $ak_rate = $('a#ak_rate')
            $k_favorite.replaceWith(genBtn($k_favorite, '收藏'))
            $ak_rate.replaceWith(genBtn($ak_rate, '评分'))
        }

        // 其回复
        function mdPostOthers() {

        }

    }

// 返回顶部按钮
    function generateScrollTopBtn() {
        $('body').append('<button id="my_ScrollTopBtn" class="mdui-fab mdui-fab-fixed mdui-fab-hide mdui-color-theme" onclick=""><i class="mdui-icon material-icons">keyboard_arrow_up</i></button>')
        let scrollTopHide = true
        $(window).scroll(() => {
            if ($(window).scrollTop() > 100) {
                // 显示
                if (scrollTopHide) {
                    scrollTopHide = !scrollTopHide
                    $('#my_ScrollTopBtn').removeClass('mdui-fab-hide')
                }
            } else {
                // 隐藏
                if (!scrollTopHide) {
                    scrollTopHide = !scrollTopHide
                    $('#my_ScrollTopBtn').addClass('mdui-fab-hide')
                }
            }
        })
        $(window).trigger('scroll')
        $('#my_ScrollTopBtn').on('click', () => {
            $('html,body').finish().animate({'scrollTop': '0px'}, 500)
        })
    }

    function mdOther() {

        generateScrollTopBtn()

    }

    const THEME_TYPE_DATLE = 0, THEME_TYPE_NIGHT = 1

    function init(css, randomColors) {
        loadResource(css)
        initTheme(randomColors)
        generateAppbar(randomColors.nav)
    }

// 判断4类不同的页面
    const locationHref = window.location
    if (/^https:\/\/steamcn.com\/(forum.php(\?gid=\d+)?)?$/.test(locationHref)) {
        /*
         * 首页
         * https://steamcn.com/
         * https://steamcn.com/forum.php/
         */
        console.log('home')
        let randomColors = generateRandomColors(THEME_TYPE_DATLE, 5)
        init(initHomeCss(randomColors), randomColors)
        generateScrollTopBtn()
    } else if (/^https:\/\/steamcn.com\/(f\d+)|(forum.php\?mod=forumdisplay)/.test(locationHref)) {
        /*
         * 目录
         * https://steamcn.com/f274-1
         * https://steamcn.com/forum.php?mod=forumdisplay&fid=274&filter=typeid&typeid=348
         */
        console.log('forum display')
    } else if (/^https:\/\/steamcn.com\/(t\d+)|(forum.php\?mod=viewthread)/.test(locationHref)) {
        /*
         * 帖子
         * https://steamcn.com/t368540-1-1
         * https://steamcn.com/forum.php?mod=viewthread&tid=368540&page=1#pid6102860
         */
        console.log('post')
        let randomColors = generateRandomColors(THEME_TYPE_DATLE)
        init(initPostCss(randomColors), randomColors)
        generatePostTitleAndAttr()
        mdPost()
        mdOther()
    } else if (/^https:\/\/steamcn.com\/home.php/.test(locationHref)) {
        /*
         * 个人页面
         * https://steamcn.com/t368540-1-1
         * https://steamcn.com/forum.php?mod=viewthread&tid=368540&page=1#pid6102860
         */
        console.log('profile')
    } else {
        console.log('unknown')
    }

})()
