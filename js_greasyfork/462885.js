// ==UserScript==
// @name 虎扑 - 自定义样式
// @namespace https://greasyfork.org/en/scripts/462885/
// @version 1.0.6
// @description **需要**配合另一个脚本使用的css文件
// @author 云浮鱼
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[a-z]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[a-z]{1,}\-[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[0-9]{1,}\.html)$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\_[0-9]{1,}\.html)$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\.html)$/
// @downloadURL https://update.greasyfork.org/scripts/462885/%E8%99%8E%E6%89%91%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462885/%E8%99%8E%E6%89%91%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    :root {
        -ms-overflow-style: none;
        /* IE and Edge */
        scrollbar-width: none;
        /* Firefox */
    }

    :root {
        /*light version*/
        --theme-color: #5C8879;
        --text-color: #897862;
        --1st-bg-color: #A6C4CF;
        --2nd-bg-color: #FAFCFC;
        --3rd-bg-color: #D6DEE4;
        --link-color: var(--theme-color);
        --title-color: var(--theme-color);
        --visited-color: #85897A;
        --bold-color: #47C3B1;
        --h2-color: #47C3B1;
        --hr-line: #d7e4ea;
        --vote-left: #da9c2c;
        --vote-right: #36708a;
        --vote-left-fill: var(--2nd-bg-color);
        --vote-right-fill: var(--2nd-bg-color);
        --shadow-color: 0, 0, 0;
        /*dark version*/
        /*
        --theme-color: #569d70;
        --text-color: #b8c2b3;
        --1st-bg-color: #22282C;
        --2nd-bg-color: #2F383E;
        --3rd-bg-color: #272F34;
        --link-color: var(--theme-color);
        --visited-color: #85897A;
        --title-color: var(--theme-color);
        --bold-color: #B3C6AA;
        --h2-color: #899C40;
        --hr-line: #374247;
        --vote-left: #ffc0cb;
        --vote-right: #4b9abe;
        --vote-left-fill: var(--2nd-bg-color);
        --vote-right-fill: var(--2nd-bg-color);
        --shadow-color: 0, 0, 0;
        */
    }

    body {
        --font-size: 14px;
        --font-family: PingFangSC-Regular, sans-serif;
        --border-radius: 0.5rem;
        --box-shadow: 2px 2px rgba(var(--shadow-color), 0.08);
    }

    * {
        box-sizing: border-box !important;
        padding: 0;
        margin: 0;
        vertical-align: unset !important;
        font-family: var(--font-family);
        /*transition: all 0.2s ease 0s;*/
        color: var(--text-color);
        font-size: var(--font-size);
        list-style: none;
    }

    a {
        cursor: pointer;
        text-decoration: none;
        color: var(--text-color);
        border-bottom: 2px solid transparent;
    }

    a:hover {
        color: var(--theme-color);
        border-color: var(--theme-color);
    }

    button {
        background: var(--3rd-bg-color);
        border: 2px solid var(--3rd-bg-color);
        box-shadow: var(--box-shadow);
        ;
    }

    button:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    button:hover span {
        color: var(--theme-color);
    }

    /*=================================================
            wth
    =================================================*/
    .hp-pc-breadcrumb a {
        font-size: unset;
        color: unset;
    }

    .bbs-sl-web-post-header {
        background-color: unset;
        border-bottom: unset;
        font-family: unset;
        color: unset;
    }

    /*=================================================*/
    /*===============================
            Overall Grid Layout
    =================================*/
    body {
        background: var(--1st-bg-color);
        height: auto;
    }

    body > #container {
        background: var(--1st-bg-color);
        display: grid;
        justify-content: space-around;
    }

    .bbs-sl-web {
        display: grid;
        grid-template-rows: min-content 1fr min-content;
        grid-gap: 10px;
        grid-template-areas: " nav " " body " " footer ";
        justify-content: center;
        margin: 0 8vw;
    }

    section.hp-pc-menu {
        grid-area: nav;
        background: pink;
        background: transparent;
    }

    .bbs-sl-web-holder {
        grid-area: body;
        background: aliceblue;
        background: transparent;
    }

    section.hp-pc-footer {
        grid-area: footer;
        background: wheat;
        background: transparent;
        box-shadow: var(--box-shadow);
    }

    /*===============================
          Navbar Section - Start
    =================================*/
    .hp-pc-rc-TopMenu {
        display: grid;
        grid-template-rows: max-content 1fr;
        grid-template-areas: " upper " " lower";
        margin-top: 0.5rem;
    }

    /*===============
       Upper - Start
    ===============*/
    .hp-pc-rc-TopMenu-top-container {
        grid-area: upper;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        padding: 0.25rem;
    }

    .hp-pc-rc-TopMenu-top {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0.25rem;
    }

    /*hupuLogo*/
    .bannerlogonew img {
        height: 2rem;
        margin: 0 1rem;
        cursor: pointer;
        display: none
    }

    .bannerlogonew {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: var(--theme-color);
        -webkit-mask: url("https://w1.hoopchina.com.cn/channel/website/static/images/basketball-nba-logo.png") no-repeat center/contain;
        margin: 0 1rem
    }

    /*loginStuff*/
    ul.hasLogin {
        display: flex;
        align-items: center;
        list-style: none;
        padding: 0.25rem 0;
        border-radius: var(--border-radius);
    }

    .hasLogin * {
        font-size: 1rem;
    }

    ul.hasLogin li {
        font-size: 1rem;
        font-weight: bold;
        margin: 0 1rem;
        border-radius: var(--border-radius);
    }

    .myHome:nth-child(3),
    li[class="line"] {
        display: none !important;
    }

    .hasLogin a {
        border-bottom: 2px solid transparent;
    }

    .hasLogin a:hover {
        border-color: var(--theme-color);
    }

    .hp-set {
        display: flex;
        align-items: center;
    }

    .hp-set > span {
        border-bottom: 2px solid transparent;
        cursor: pointer;
    }

    .hp-set > span:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    .hp-set > i > span {
        margin-left: 0.25rem;
        color: var(--title-color);
        cursor: pointer;
    }

    /*searchBar*/
    div[class*=search] {
        display: flex;
        margin-right: auto;
        border-radius: var(--border-radius);
        background: var(--2nd-bg-color);
        overflow: hidden;
        border: 2px solid var(--3rd-bg-color);
        align-items: center;
        justify-content: space-between;
    }

    div[class*=search] input {
        border: none;
        background: var(--2nd-bg-color);
        vertical-align: middle;
        color: var(--text-color);
        height: 100%;
        width: 100%;
        font-size: 1.1rem;
        padding: 0.25rem 0.25rem;
    }

    div[class*=search] input:focus {
        outline: none;
    }

    div[class*=search]:hover {
        border-color: var(--theme-color);
    }

    div[class*=search]:hover i {
        color: var(--theme-color)
    }

    div[class*=search] i {
        padding: 0 5px;
    }

    /*dropdown settings*/
    .hasLogin .top-userSetUp .setup-dropdown {
        position: absolute;
        background-color: var(--2nd-bg-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        display: none;
        padding: 0.5rem;
        right: 8vw;
        box-shadow: var(--box-shadow);
    }

    .hasLogin .top-userSetUp:hover .setup-dropdown {
        display: flex;
        flex-direction: column;
    }

    /*===============
       Upper - End
       Lower - Start // Lower has been display none-ed so no need to worry about this bs anymore
    ===============*/
    .hp-pc-rc-TopMenu-banner {
        grid-area: lower;
        background: lightcoral;
        display: flex;
        justify-content: space-around;
        align-items: center;
        display: none;
    }

    ul.hp-quickNav {
        display: none;
    }

    .gamecenter {
        display: none;
    }

    /*===============
       Lower - End
    ===============*/
    .hp-pc-menu-sub-menu {
        display: none;
    }

    /*===============================
          Navbar Section - End
          Content Holder - Start
    =================================*/
    .bbs-sl-web-body {
        display: grid;
        grid-template-columns: minmax(13rem, 1fr) 5fr;
        grid-gap: 0.5rem;
        grid-template-areas: "  sideNav headernPost ";
        
    }

    .bbs-sl-web-nav {
        grid-area: sideNav;
        background: Lavender;
                box-shadow: var(--box-shadow);

    }

    .bbs-sl-web-topic-wrap {
        grid-area: headernPost;
        background: var(--3rd-bg-color);
        display: grid;
        grid-gap: 0.5rem;
        padding: 0.5rem;
        border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);

    }

    .bbs-sl-web-intro-avatar {
        width: 76px;
        height: 76px;
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    .bbs-sl-web-intro-avatar img {
        width: 100%;
        height: 100%;
    }

    /*===============
       sideNav - Start
    ===============*/
    .bbs-sl-web-nav {
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.25rem;
    }

    .hu-pc-navigation-type {
        background: var(--2nd-bg-color);
        padding: 0.75rem;
        margin: 0.5rem 0.25rem;
        border-radius: var(--border-radius);
    }

    .hu-pc-navigation-my-focus-item {
        padding: 0.75rem 0.25rem;
    }

    .extra {
        float: right;
        cursor: pointer;
    }

    .hu-pc-navigation-type > a.iconshezhi {
        margin-left: 0.5rem;

    }

    /*subscribedSection*/
    .hu-pc-navigation-my-focus-item > a {
        display: flex;
        align-items: center;
        border: 0;
    }

    .hu-pc-navigation-my-focus-item > a > .title {
        border-bottom: 2px solid transparent;
    }

    .hu-pc-navigation-my-focus-item > a > .title:hover {
        color: var(--theme-color);
        border-color: var(--theme-color);
    }

    .hu-pc-navigation-my-focus-item > a > .hot {
        display: none;
    }

    .hu-pc-navigation-my-focus-item > a > .logo {
        margin-right: 0.5rem;
        width: 1.25rem;
        height: 1.25rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        /*border-radius: var(--border-radius);*/
        border-radius: 0.25rem;
    }

    .bbs-sl-web-body .hu-pc-navigation-type {
        font-weight: bold;
        color: var(--bold-color);
    }

    .bbs-sl-web-body .hu-pc-navigation-type > * {
        font-weight: normal;
    }

    .add-more {
        cursor: pointer;
    }

    .add-more > div {
        display: flex;
        align-items: center;
    }

    .add-more .add-more-plugs {
        padding-right: 0.25rem;
        line-height: 1rem;
        font-size: 1.5rem;
    }

    /*gachiNavSection*/
    .hu-pc-navigation-topic-type-wrap {
        position: relative;
        border: 2px solid transparent;
        padding: 0.75rem 0.25rem;
        margin: 0.25rem 0;
        background: var(--2nd-bg-color);
        border-radius: var(--border-radius);
    }

    .hu-pc-navigation-topic-type-wrap:hover {
        border: 2px solid var(--theme-color);
        background: var(--3rd-bg-color);
    }

    .hu-pc-navigation-topic-type-wrap:hover .hu-pc-navigation-topic-type-popups {
        opacity: 1;
        visibility: visible
    }

    .hu-pc-navigation-topic-type-title {
        display: flex;
        padding: 0 0.25rem;
        align-content: center;
        border: 0;
    }

    .hu-pc-navigation-topic-type-title > .topic-icon {
        margin-right: 0.5rem;
        width: 1.25rem;
        height: 1.25rem;
        background-repeat: no-repeat;
        background-size: 100% 100%
    }

    .hu-pc-navigation-topic-type-popups {
        display: grid;
        position: absolute;
        left: 100%;
        border: 2px solid var(--theme-color);
        background-color: var(--3rd-bg-color);
        visibility: hidden;
        opacity: 0;
        z-index: 1;
        border-radius: var(--border-radius);
        grid-template-columns: repeat(5, minmax(5rem, 1fr));
        gap: 1rem;
        padding: 1rem
    }

    a.topic-item {
        border: 0;
        text-align: center;
    }

    a.topic-item:hover {
        border: 0;
    }

    .topic-item-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .topic-item-name:hover {
        color: var(--theme-color);
    }

    .hu-pc-navigation-topic-type-popups .topic-item-icon {
        display: block;
        margin: 0 auto;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 4px;
        background-repeat: no-repeat;
        background-size: 100% 100%
    }

    .topic-item-heat {
        font-size: 0.75rem;
    }

    .hu-pc-navigation-topic-type-link > a {
        font-size: 0.8rem;
        color: var(--text-color);
        border: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .hu-pc-navigation-topic-type-link > a:hover {
        color: var(--theme-color);
    }

    .hu-pc-navigation-topic-type-link {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.25rem
    }

    .hu-pc-navigation-topic-type-wrap {
        margin: 0.5rem 0;
        background: var(--3rd-bg-color);
    }

    .hu-pc-navigation-topic-type-link {
        margin: 0.5rem 0;
        padding-left: 0.5rem;
    }

 /*subbox desu - Start*/
        .topic-list-wrap > .topic-item .setting-item-click,
        .modalWrap_3cdEO .bbs-setting-recommend-wrap,
        .modelContent_J-FKS > .bbs-setting-recommend-wrap > .hu-pc-navigation-type,
        .modelContent_J-FKS > .bbs-setting-topic-wrap > .hu-pc-navigation-type {
            display: none;
        }

        .bbs-setting-my-focus-wrap {
            width: unset !important;
        }

        .mask_1hQZJ {
            background-color: rgba(var(--shadow-color), .45)
        }

        .mask_1hQZJ,
        .modal_2zjFG {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
        }

        .modal_2zjFG .modalWrap_3cdEO {
            position: absolute;
            width: fit-content !important;
            height: fit-content !important;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            transition: all .2s;
            padding: 0.5rem;
            background-color: var(--1st-bg-color);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }

        .mask_YJsnK {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
        }

        .modelContent_J-FKS > div {
            background: var(--2nd-bg-color);
            border-radius: var(--border-radius);
            padding: 0.25rem;
            margin-bottom: 0.5rem;
        }

        .bbs-setting-topic-type {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: var(--3rd-bg-color);
            padding: 0.5rem;
            border-radius: var(--border-radius);
            flex-wrap: wrap;
            margin-bottom: 0.5rem;
        }

        .topic-list-wrap > .topic-item.my-focus:hover:after {
            content: "\\E65E";
            transform: rotate(-45deg);
            color: var(--theme-color);
        }

        .bbs-setting-my-focus-wrap > *:first-child {
            background-color: var(--3rd-bg-color);
            display: flex;
            font-weight: bold;
        }

        .bbs-setting-my-focus-wrap .subText {
            margin-left: auto;
            margin-right: 30px;
            font-weight: bold;
        }

        .topic-list-wrap > .topic-item.focus {
            border: 2px solid var(--theme-color);
        }

        .topic-list-wrap > .topic-item.focus:after {
            content: "\\E679";
            color: var(--theme-color);
            margin-top: 4px;
            transform: scale(.9)
        }

        .topic-list-wrap > .topic-item.focus:hover {
            border: 2px solid #e3e3e3;
        }

        .topic-list-wrap > .topic-item.focus:hover:after {
            content: "\\E65E";
            transform: rotate(-45deg);
            color: var(--theme-color);
        }

        .hupu-modal-content .setting-close {
            position: absolute;
            top: 30px;
            right: 30px;
            cursor: pointer;
            z-index: 9;
        }

        .topic-list-wrap > .topic-item:after {
            position: absolute;
            right: 6px;
            font-family: iconfont!important;
            font-size: 12px;
        }

        .topic-list-wrap > .topic-item:hover {
            color: var(--theme-color);
            border-color: var(--theme-color);
            cursor: pointer;
        }

        .topic-list-wrap > .topic-item:hover:after {
            content: "\\E65E"
        }

        .topic-list-wrap {
            display: grid;
            grid-template-columns: repeat(5, minmax(5rem, 1fr));
            grid-gap: 0.25rem;
        }

        .topic-empty {
            grid-area: 1/1/-1/-1;
        }

        .topic-list-wrap > .topic-item {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border: 2px solid transparent;
            border-radius: var(--border-radius);
        }

        .bbs-setting-topic-type > * {
            color: var(--text-color);
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }

        .bbs-setting-topic-type-item.active {
            border-color: var(--theme-color);
            color: var(--theme-color);
            font-weight: bold;
        }

        ul > .add-more,
        ul > .see-more {
            cursor: pointer;
        }

        .see-more:hover > .hu-pc-navigation-topic-type-popups {
            opacity: 1 !important;
            visibility: visible;
            left: 100%
        }

        .hu-pc-navigation-my-focus-item.see-more {
            position: relative;
            margin: 0;
        }

        /*subbox desu - End*/
    /*===============
        sideNav - End
       Metadata - Start
    ===============*/
    .hp-pc-breadcrumb > span:last-child > a {
        font-weight: bold;
    }

    .bbs-sl-web-intro {
        display: flex;
        background: var(--2nd-bg-color) !important;
        border-radius: var(--border-radius);
        padding: 0.75rem;
    }

    .bbs-sl-web-intro-detail {
        flex: 1 1;
        margin-left: 1rem;
    }

    .bbs-sl-web-intro-detail-title-wrap {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .bbs-sl-web-intro-detail-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--title-color);
    }

    .bbs-sl-web-intro-detail-button {
        border-radius: var(--border-radius);
        cursor: pointer;
        padding: 0.1rem 1rem;
        /*        margin-right: 0.5rem;
*/
    }

    .bbs-sl-web-intro-icon {
        padding-right: 0.25rem;
    }

    .bbs-sl-web-intro-detail-button.active:after {
        content: "\\5DF2\\5173\\6CE8"
    }

    .bbs-sl-web-intro-detail-button.active:hover:after {
        content: "\\53D6\\6D88\\5173\\6CE8"
    }

    .bbs-sl-web-intro-detail-desc {
        display: flex;
        margin-top: 0.5rem;
        line-height: 1rem;
    }

    .bbs-sl-web-intro-detail-desc-title {
        flex: 0 0 4rem;
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--bold-color);
    }

    .bbs-sl-web-admin-detail-desc-text span a,
    .bbs-sl-web-intro-detail-desc-text {
        font-size: 0.75rem;
    }

    /*===============
       Metadata - End
       postNav - Start
    ===============*/
    .bbs-sl-web-type-wrap {
        background: var(--2nd-bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.75rem 0;
        border-radius: var(--border-radius);
        flex-wrap: wrap;
    }

    .bbs-sl-web-type {
        margin-right: 1rem;
        border-bottom: 2px solid transparent;
        font-weight: bold;
    }

    .bbs-sl-web-type:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
        cursor: pointer;
    }

    .bbs-sl-web-type.active {
        border-bottom: 2px solid var(--theme-color);
        color: var(--theme-color)
    }

    /*===============
       postNav - End
       postContent - Start
    ===============*/
    .bbs-sl-web-post {
        background: var(--2nd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.75rem;
    }

    .bbs-sl-web-post-layout {
        display: grid;
        align-items: center;
        grid-template-columns: 5fr 1fr 1fr 1fr;
        padding: 0.75rem 0.25rem;
        border: 0.5px solid transparent;
        border-bottom: 2px solid var(--hr-line);
    }

    .bbs-sl-web-post-layout:hover {
        background: var(--3rd-bg-color);
    }

    a.p-title:visited {
        color: var(--visited-color);
    }

    a.p-title:visited:hover {
        color: var(--theme-color);
    }

    .bbs-sl-web-post-layout > * > span {
        margin-left: 0.5rem;
    }

    .bbs-sl-web-post-layout > * > span > i {
        margin-right: 0.25rem;
    }

    .bbs-sl-web-post-header > * {
        font-weight: bold;
        color: var(--bold-color);
    }

    .bbs-sl-web-post-header {
        padding-top: 0;
    }

    .bbs-sl-web-post-header:hover {
        background: var(--2nd-bg-color);
    }

    .bbs-sl-web-post > .bbs-sl-web-post-layout > div:nth-child(2),
    .bbs-sl-web-post > .bbs-sl-web-post-layout > div:nth-child(3),
    .bbs-sl-web-post > .bbs-sl-web-post-layout > div:nth-child(4) {
        justify-self: center;
    }

    .post-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .post-datum {
        justify-self: center;
        font-weight: bold;
        color: var(--theme-color);
    }

    .post-auth {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }

    .post-time {
        justify-self: center;
        white-space: nowrap;
    }

    /*===============
       postContent - End
       Pagination - Start
    ===============*/
    .hupu-rc-pagination {
        display: flex;
        list-style: none;
        align-items: center;
        justify-content: center;
        background: var(--2nd-bg-color);
        flex-wrap: wrap;
        border-radius: var(--border-radius);
        padding: 0.25rem 0;
    }

    .hupu-rc-pagination li {
        border: 2px solid var(--3rd-bg-color);
        border-radius: var(--border-radius);
        margin: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: var(--3rd-bg-color);
        cursor: pointer;
    }

    .hupu-rc-pagination li:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    .hupu-rc-pagination li[class*=active] {
        background: var(--theme-color);
        border-color: var(--theme-color);
    }

    .hupu-rc-pagination li[class*=active]:hover a,
    .hupu-rc-pagination li[class*=active] a {
        color: var(--3rd-bg-color);
    }

    .hupu-rc-pagination [class*=left] {
        display: inline-block;
        rotate: 180deg;
    }

    .hupu-rc-pagination [aria-disabled=true] {
        cursor: not-allowed;
    }

    .hupu-rc-pagination [aria-disabled=true]:hover {
        border-color: var(--3rd-bg-color);
        color: var(--text-color);
    }

    /*===============
       Pagination - End
    ===============*/
    /*===============================
          Content Holder - End
          Footer - Start
    =================================*/
    section.hp-pc-footer {
        display: flex;
        flex-direction: column;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.75rem 0;
        margin-bottom: 0.5rem;
    }

    section.hp-pc-footer * {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .hp-pc-footer-mod_menu ul li {
        margin: 0 0.25rem;
    }

    .hp-pc-footer p {
        flex-direction: column;
    }

    .backToTop_2mZa6 {
        display: none !important;
    }

    /*===============================
          Footer - End
    =================================*/
    /*========photoview moto code desuwa - Start========*/
    @-webkit-keyframes PhotoView__fade {
        0% {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    @keyframes PhotoView__fade {
        0% {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    .PhotoView-PhotoSlider__Backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
        z-index: -1
    }

    .PhotoView-PhotoSlider__fadeIn {
        opacity: 0;
        -webkit-animation: PhotoView__fade .4s linear both;
        animation: PhotoView__fade .4s linear both
    }

    .PhotoView-PhotoSlider__fadeOut {
        opacity: 0;
        animation: PhotoView__fade .4s linear reverse both
    }

    .PhotoView-PhotoSlider__BannerWrap {
        position: absolute;
        left: 0;
        top: 0;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-align: center;
        align-items: center;
        width: 100%;
        height: 44px;
        color: #fff;
        background-color: rgba(0, 0, 0, .5);
        -webkit-transition: opacity .2s ease-out;
        -o-transition: opacity .2s ease-out;
        transition: opacity .2s ease-out;
        z-index: 20
    }

    .PhotoView-PhotoSlider__Counter {
        padding: 0 10px;
        font-size: 14px;
        opacity: .75
    }

    .PhotoView-PhotoSlider__BannerRight {
        height: 100%
    }

    .PhotoView-PhotoSlider__Close {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 10px;
        opacity: .75;
        cursor: pointer;
        -webkit-transition: opacity .2s linear;
        -o-transition: opacity .2s linear;
        transition: opacity .2s linear
    }

    .PhotoView-PhotoSlider__Close:hover {
        opacity: 1
    }

    .PhotoView-PhotoSlider__FooterWrap {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 10px;
        width: 100%;
        min-height: 44px;
        line-height: 1.5;
        font-size: 14px;
        color: #ccc;
        background-color: rgba(0, 0, 0, .5);
        text-align: justify;
        -webkit-transition: opacity .2s ease-out;
        -o-transition: opacity .2s ease-out;
        transition: opacity .2s ease-out;
        z-index: 20
    }

    .PhotoView-SlideWrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        overflow: hidden
    }

    @-webkit-keyframes PhotoView__animateIn {
        0% {
            opacity: .4;
            -webkit-transform: scale(.2);
            transform: scale(.2)
        }

        to {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1)
        }
    }

    @keyframes PhotoView__animateIn {
        0% {
            opacity: .4;
            -webkit-transform: scale(.2);
            transform: scale(.2)
        }

        to {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1)
        }
    }

    @-webkit-keyframes PhotoView__animateOut {
        0% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1)
        }

        to {
            opacity: 0;
            -webkit-transform: scale(.2);
            transform: scale(.2)
        }
    }

    @keyframes PhotoView__animateOut {
        0% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1)
        }

        to {
            opacity: 0;
            -webkit-transform: scale(.2);
            transform: scale(.2)
        }
    }

    .PhotoView__animateIn {
        opacity: .4;
        -webkit-animation: PhotoView__animateIn .4s cubic-bezier(.25, .8, .25, 1) both;
        animation: PhotoView__animateIn .4s cubic-bezier(.25, .8, .25, 1) both
    }

    .PhotoView__animateOut {
        opacity: 1;
        -webkit-animation: PhotoView__animateOut .4s cubic-bezier(.25, .8, .25, 1) both;
        animation: PhotoView__animateOut .4s cubic-bezier(.25, .8, .25, 1) both
    }

    .PhotoView__PhotoWrap {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-align: center;
        align-items: center;
        z-index: 10;
        overflow: hidden
    }

    .PhotoView__PhotoMask,
    .PhotoView__PhotoWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%
    }

    .PhotoView__PhotoMask {
        z-index: -1
    }

    .PhotoView__Photo {
        will-change: transform;
        cursor: -webkit-grab;
        cursor: grab
    }

    .PhotoView__Photo:active {
        cursor: -webkit-grabbing;
        cursor: grabbing
    }

    @-webkit-keyframes PhotoView__rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }

        to {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn)
        }
    }

    @keyframes PhotoView__rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }

        to {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn)
        }
    }

    @-webkit-keyframes PhotoView__delayShow {
        0%,
        50% {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    @keyframes PhotoView__delayShow {
        0%,
        50% {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    .PhotoView__Spinner {
        -webkit-animation: PhotoView__delayShow .4s linear both;
        animation: PhotoView__delayShow .4s linear both
    }

    .PhotoView__Spinner svg {
        -webkit-animation: PhotoView__rotate .6s linear infinite;
        animation: PhotoView__rotate .6s linear infinite
    }

    /*========photoview moto code desuwa - End========*/
    /*=========================
        PostDesu! - Start
    =========================*/
    p[class*="image-wrapper"] {
        max-width: 8% !important;
    }

    .post-operate-comp.main-operate > div.post-operate-comp-main:nth-child(1) > div.post-operate-comp-main-share.todo-list:nth-child(4),
    div #\\33 800000302,
    div #\\33 800000202,
    div #\\33 800000402,
    [class*="right-wrapper"],
    .post-user_post-user-comp-info-bottom__CqR2O,
    .index_post-wrapper__IXkg_,
    .hp-pc-rc-SuperMenu-sub-menu,
    .rc-menu-submenu,
    .seo-dom {
        display: none;
    }

    .index_bbs-post-web__2_mmZ {
        margin: 0 8vw;
    }

    .index_bbs-post-web-main__D_K6v {
        display: grid;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        grid-gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        box-shadow: var(--box-shadow);
    }

    .index_bbs-post-web-main__D_K6v > * {
        background: var(--2nd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.5rem;
    }

    /*fastReply*/
    #hupu-compact-editor {
        background: var(--2nd-bg-color) !important;
    }

    #hupu-compact-editor .index_editor__j_5aB {
        background: var(--1st-bg-color);
        border-radius: var(--border-radius);
        padding: 0.5rem;
    }

    .index_main__XrCzy {
        width: 100%;
    }

    .index_editor__j_5aB > div:first-child > *:first-child {
        background: var(--3rd-bg-color);
        padding: 0.5rem;
        height: 10rem;
        border-radius: var(--border-radius);
        outline: 0;
    }

    #hupu-compact-editor .index_compact__osaGi {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
        margin-top: 0.5rem;
    }

    .index_photo__NKQOy {
        height: 3.5rem;
    }

    #hupu-compact-editor .index_compact__osaGi > *:first-child > * {
        border-radius: var(--border-radius);
    }

    .index_tips__wBYZt {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .index_tips__wBYZt > *:first-child {
        cursor: pointer;
    }

    .index_tips__wBYZt > *:first-child:hover .index_btn__1h9VY > * {
        color: var(--theme-color);
    }

    .index_actions__uc_5L {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin: 0.5rem;
        align-items: center;
    }

    .index_actions__uc_5L > *:nth-child(2) > * > div {
        border-bottom: 2px solid transparent;
    }

    .index_actions__uc_5L > *:nth-child(2):hover > * > div {
        cursor: pointer;
        color: var(--theme-color);
        border-color: var(--theme-color);
    }

    /*================================
              Starting Point
    ================================*/
    /*===============
        Breadcrumb n' Title - Start
    ===============*/
    .index_bbs-post-web-main-title-provider__uHAn9 {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .index_name__M5qqs {
        margin-right: auto;
        font-size: 1.25rem;
        color: var(--title-color);
    }

    .index_read__7h1Dm {
        margin-left: 1rem;
    }

    /*===============
        Breadcrumb n' Title - End
        Pagination - Start
    ===============*/
    .index_pagination__wvE_f {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .index_jumpToPage__GC8jx {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .index_jumpToPage__GC8jx > *:first-child {
        margin-left: 0.5rem;
    }

    .index_input__9ge6K {
        border: 2px solid transparent;
        border-radius: var(--border-radius);
        background: var(--3rd-bg-color);
        color: var(--text-color);
        padding: 0.25rem 0.25rem;
        width: 3rem;
    }

    .index_input__9ge6K:focus-visible,
    .index_input__9ge6K:hover {
        border-color: var(--theme-color);
    }

    .index_input__9ge6K:focus {
        outline: none;
    }

    .index_button__KWQvz {
        border: 2px solid transparent;
        border-radius: var(--border-radius);
        background: var(--3rd-bg-color);
        color: var(--text-color);
        padding: 0.25rem 0.25rem;
    }

    .index_button__KWQvz:hover {
        cursor: pointer;
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    /*===============
        Pagination - End
        contentInPost - Start
    ===============*/
    .post-content_bbs-post-content__cy7vN > * {
        padding: 0.5rem;
    }

    .post-user_post-user-comp__3azJ2 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .post-user_post-user-comp__3azJ2 > a {
        border: 0;
    }

    .post-user_post-user-comp__3azJ2 > * > * > img {
        width: 3.5rem;
        border-radius: var(--border-radius);
    }

    .post-user_user-base-info__AxpCI {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .post-user_user-base-info__AxpCI > *:first-child {
        color: var(--theme-color);
    }

    .post-user_user-base-info__AxpCI * {
        font-size: 1.0rem
    }

    /*format settings - start*/
    .thread-content-detail h1 {
        margin: 0 !important;
        font-size: unset !important;
        padding: 0.3rem 0;
    }

    .thread-content-detail h1 > * {
        font-size: 1.5rem;
        color: var(--bold-color);
        padding: 0.3rem 0;
    }

    .thread-content-detail h2 {
        font-size: 1.25rem !important;
        color: var(--h2-color);
        padding: 0.25rem 0;
        margin: 0 !important;
    }

    .thread-content-detail > p {
        padding: 0.25rem 0;
    }

    .thread-content-detail > .slate-image {
        padding: 0.25rem 0;
    }

    .thread-content-detail a {
        color: var(--link-color);
    }

    hr {
        background-color: var(--visited-color) !important;
        margin-bottom: 1rem;
    }

    /*idontfreakingknowwhatisBARiscalled - start*/
    .post-operate-comp {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        flex-wrap: wrap;
    }

    .post-operate-comp i.iconfont:hover {
        line-height: 1;
        color: var(--theme-color);
    }

    .post-operate-comp-other > *,
    .post-operate-comp-main > * {
        cursor: pointer
    }

    .main-operate .todo-list {
        display: flex;
        align-items: center;
        padding: 0.5rem;
    }

    .main-operate .todo-list .todo-list-icon {
        font-size: 1.25rem;
        margin-right: 0.25rem;
    }

    .post-operate-comp [class*="active"] > i {
        color: var(--theme-color);
    }

    .post-operate-comp [class*="active"] > i:hover {
        color: var(--theme-color);
    }

    .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp-main,
    .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp-simple {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp-other {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        margin-left: 0.5rem;
    }

    /*idontfreakingknowwhatisBARiscalled - end*/
    /*===============
        * - End
        Footer - Start
    ===============*/
    .index_hp-pc-footer__TyFBc {
        display: flex;
        flex-direction: column;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.75rem 0;
        margin: 0.5rem 0;
        box-shadow: var(--box-shadow);
    }

    .index_hp-pc-footer__TyFBc * {
        display: flex;
        justify-content: center;
    }

    .index_hp-pc-footer-mod_copyright__2P_lo > p {
        display: flex;
        flex-wrap: wrap;
    }

    .index_backToTop__rx3__ {
        display: none;
    }

    .index_hp-pc-footer__TyFBc ul {
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }

    /*===============
        Footer - End
    ===============*/
    /*comment in post - start*/
    .post-reply-list .post-reply-list-container {
        display: grid;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: var(--border-radius);
        background: var(--3rd-bg-color);
        gap: 1rem;
        grid-template-columns: max-content 1fr;
    }

    img[class="avatar "] {
        border-radius: var(--border-radius);
        width: 3.5rem;
    }

    .hupu-custom-emoji {
        height: 1rem;
    }

    .post-reply-list-user-info-top {
        display: flex;
        align-items: center;
    }

    .user-base-info {
        margin-right: auto;
    }

    .user-base-info > * {
        margin-right: 0.5rem;
    }

    .post-reply-list-user-info-top .user-operate {
        flex-wrap: wrap;
        display: flex;
    }

    .user-operate > * {
        margin-left: 0.5rem;
        border-bottom: 2px solid transparent;
    }

    .user-operate > span:hover {
        color: var(--theme-color);
        border-color: var(--theme-color);
        cursor: pointer;
    }

    .post-reply-list-user-info-top-name {
        color: var(--theme-color);
    }

    .post-reply-list-operate {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.5rem;
    }

    .post-reply-list-operate > div:hover {
        cursor: pointer;
    }

    .post-reply-list-operate > div:hover > * {
        color: var(--theme-color);
    }

    .post-reply-list-operate > div > * {
        margin-right: 0.25rem;
    }

    /*quotenquote*/
    .index_bbs-thread-comp-container__QkBRG {
        background: var(--1st-bg-color);
        padding: 0.5rem;
        border-radius: var(--border-radius);
        margin: 0.5rem 0;
    }

    .index_quote-text__HggrH {
        display: flex;
        align-items: center;
    }

    .index_quote-text__HggrH > *:first-child {
        margin-right: auto;
    }

    .index_quote-text__HggrH > *:first-child > a {
        color: var(--theme-color);
    }

    * > p {
        padding: 0.25rem 0;
    }

    .reply-detail-wrapper {
        background: var(--1st-bg-color);
        border-radius: var(--border-radius);
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .reply-detail-wrapper > * > div {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        background: var(--3rd-bg-color);
        border-radius: var(--border-radius);
        padding: 0.5rem;
    }

    .reply-detail-wrapper .reply-detail-list-operate {
        display: flex;
        gap: 1rem;
    }

    .reply-detail-wrapper .reply-detail-list-operate > * {
        display: flex;
        gap: 0.25rem;
    }

    .reply-detail-wrapper .reply-hide {
        cursor: pointer;
    }

    .reply-detail-wrapper .reply-hide i {
        rotate: 180deg;
    }

    .reply-detail-wrapper .user-base-info {
        display: flex;
        align-items: center;
    }

    .reply-detail-wrapper .user-base-infow a {
        color: var(--theme-color);
    }

    .index_toggle-thread__WDynE {
        cursor: pointer;
    }

    .post-wrapper_bbs-post-wrapper-title__TLQdd {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .post-wrapper_bbs-post-wrapper-title__TLQdd > *:first-child {
        font-weight: bold;
        color: var(--title-color);
        font-size: 1.25rem
    }

    .post-wrapper_bbs-post-wrapper-title__TLQdd > *:nth-child(2) {
        cursor: pointer;
    }

    .post-wrapper_bbs-post-wrapper-title__TLQdd .post-wrapper_close__TRqmA {
        display: inline-block;
        rotate: 180deg
    }

    /*comment in post -end */
    /*wtf report - Start*/
    .index_modal-comp__NCg8T .index_mask__gIg7P {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .45);
        z-index: 9;
    }

    /* why not use <dialog> */
    .index_modal__avOE9 > * {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: fit-content;
        height: fit-content;
        margin: auto;
        z-index: 99;
        background: var(--1st-bg-color);
        border-radius: var(--border-radius);
        padding: 0.75rem;
        border: 2px solid var(--theme-color);
    }

    .index_modalTitle__zAKNI {
        text-align: center;
    }

    .index_modalTitle__zAKNI .index_title__EBxtS {
        font-weight: bold;
        font-size: 1.25rem;
        margin-right: 0.5rem;
    }

    .post-radio_bbs-post-radio__3iHkw {
        border-radius: 50%;
        overflow: hidden;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center
    }

    .post-radio_bbs-post-radio__3iHkw.unselect {
        border: 2px solid var(--hr-line);
    }

    .post-report_radio__UJJMX {
        margin-right: 0.5rem;
    }

    .post-radio_bbs-post-radio-range__qaD_j {
        width: 10px;
        height: 10px;
        opacity: 0;
        background: var(--theme-color);
        visibility: hidden;
        transition: background .2s ease-in, box-shadow .3s ease-in, -webkit-box-shadow .3s ease-in;
        border-radius: 50%;
        backface-visibility: hidden;
        box-shadow: 0 0 0 2px var(--hr-line), 0 0 0 8px var(--theme-color);
    }

    .post-radio_bbs-post-radio__3iHkw.post-radio_active__YBMBX {
        border: none
    }

    .post-radio_bbs-post-radio-range__qaD_j {
        background: var(--theme-color);
        opacity: 1;
        transform: scale(1);
        visibility: visible
    }

    .post-report_report-list__1Pd0i {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
    }

    .post-report_report-list__1Pd0i:hover {
        background: var(--2nd-bg-color);
    }

    .post-report_report-list__1Pd0i:hover .post-report_title__Ap1y2 {
        color: var(--theme-color);
    }

    .post-report_title__Ap1y2 {
        padding: 0.5rem 0;
    }

    .post-report_report-btn__4C0J6 {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: var(--2nd-bg-color);
        margin: 0 35%;
        padding: 0.25rem;
        border-radius: var(--border-radius);
        border: 2px solid transparent;
    }

    .post-report_report-btn__4C0J6:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    .index_modelContent__g8s1u {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .index_modelContent__g8s1u > *:first-child {
        margin: 0.5rem 0;
        color: var(--visited-color);
    }

    .post-report_disabled__hXAJ9:hover {
        border-color: transparent;
        color: var(--text-color);
        cursor: not-allowed;
    }

    /*idkWTFthis is either*/
    /*
    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw {
        position: relative;
        font-family: PingFangSC-Regular;
        margin: 20px 0 40px
    }

 
    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw .post-report_title__Ap1y2 .post-report_succes__wd2mK {
        color: #c60100;
        margin-right: 8px;
        font-size: 16px
    }

    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw .post-report_disc__n_YR6 {
        font-size: 14px;
        color: #7b7e86;
        letter-spacing: 0;
        text-align: center;
        margin-top: 5px
    }

    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw .post-report_disc-wrapper__Ksd8K {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px
    }

    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw .post-report_disc-wrapper__Ksd8K .succes {
        color: #c60100;
        margin-right: 8px;
        font-size: 16px
    }

    .post-report_report-dialog-body__hFp8j .post-report_report-result__VrLLw .post-report_disc-wrapper__Ksd8K .post-report_disc__n_YR6 {
        margin: 0
    }*/
    /*wtf report - End*/
    /*sticky title - Start*/
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title {
        background: var(--1st-bg-color);
        box-shadow: var(--box-shadow);
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 99;
        padding: 0 8vw;
    }

    .main-c {
        display: flex;
        align-items: center;
    }

    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-title {
        color: var(--theme-color);
        font-weight: bold;
        font-size: 1.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.5rem;
    }

    .post-fix-title-config {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-left: auto;
    }

    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn {
        width: 5rem;
        padding: 0.25rem;
        border: 2px solid transparent;
        display: flex;
        justify-content: center;
        border-radius: var(--border-radius);
        background: var(--2nd-bg-color);
        user-select: none;
        cursor: pointer;
        color: var(--text-color);
    }

    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn:hover {
        color: var(--theme-color);
        border-color: var(--theme-color);
    }

    /*sticky title - End*/
    /*normal vote desu - Start*/
    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote {
        padding: 1rem;
        background: var(--1st-bg-color);
        border-radius: var(--border-radius);
    }

    .post-comp-vote-select-item {
        cursor: default
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .progress {
        background: var(--theme-color);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .detail {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        z-index: 9;
        position: relative;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .detail > *:nth-child(2) {
        margin-left: auto;
        margin-right: 1rem;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote.selected .post-comp-vote-submit {
        background: var(--2nd-bg-color);
        color: var(--theme-color);
        cursor: default;
    }

    /*==*/
    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-title {
        font-size: 1.1rem;
        padding-bottom: 1rem;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-select-item {
        background: var(--2nd-bg-color);
        border-radius: 2px;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0.75rem;
        border: 2px solid transparent;
        cursor: pointer;
        position: relative;
        transition: border .3s
    }

    .post-comp-vote-select-item:hover {
        border-color: var(--text-color);
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-select-item.active {
        border-color: var(--theme-color);
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-select-item.flex {
        display: flex;
        align-items: center
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-select-item.flex .name {
        flex: 1 1 auto
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-select-item.flex .radio {
        display: none;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-submit {
        background: var(--2nd-bg-color);
        border-radius: var(--border-radius);
        text-align: center;
        margin: 0 40%;
        padding: 0.5rem;
        cursor: pointer;
        border: 2px solid transparent;
    }

    .post-vote_post-comp-vote-wrapper__0BXk_ .post-comp-vote-submit:hover {
        border-color: var(--theme-color);
        color: var(--theme-color);
    }

    /*noraml vote desu - End*/
    /*image vote desu - Start*/
    .index_image-vote-wrapper__9tx6A .image-vote {
        background-color: var(--1st-bg-color);
        box-shadow: 0 2px 5px rgba(0, 0, 0, .15);
        border-radius: var(--border-radius);
        padding: 1rem;
    }

    .index_image-vote-wrapper__9tx6A {
        margin: 0.5rem 0;
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-image-box {
        display: flex;
        justify-content: center;
    }

    .image-vote-choice-image-box > img {
        height: 100%;
        width: 100%;
        max-height: 30vw;
        /*idk why i use vw for height but it works*/
        border-radius: var(--border-radius);
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-image-box .image-vote-choice-image {
        object-fit: cover;
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-image-box .image-vote-choice-image.left-choice {
        z-index: 9;
        border-radius: 2px 0 0 2px;
        clip-path: polygon(0 0, 100% 0, calc(100% - 1rem) 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-image-box .image-vote-choice-image.right-choice {
        right: 0;
        z-index: 2;
        border-radius: 0 2px 2px 0;
        clip-path: polygon(1rem 0, 100% 0, 100% 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box {
        cursor: pointer;
        position: relative;
        display: flex;
        height: 2.5rem;
        margin-top: 1rem;
        overflow: hidden;
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-left-percent-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 50%;
        color: var(--vote-left);
        background: var(--vote-left-fill);
        border: 2px solid var(--vote-left);
        border-right: 0;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        transition: all .5s;
        clip-path: polygon(0 0, 100% 0, calc(100% - 4px) 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-right-percent-bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: 50%;
        color: var(--vote-right);
        background: var(--vote-right-fill);
        border: 2px solid var(--vote-right);
        border-left: 0;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        transition: all .5s;
        -webkit-clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%);
        clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-left-percent-title,
    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-right-percent-title {
        position: absolute;
        top: 50%
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-left-percent-title .my-selected-choice-icon,
    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-right-percent-title .my-selected-choice-icon {
        opacity: 0
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-left-percent-title {
        left: 25%;
        z-index: 3;
        color: var(--vote-left);
        text-align: center;
        -webkit-transform: translateY(-50%) translateX(-50%);
        -ms-transform: translateY(-50%) translateX(-50%);
        transform: translateY(-50%) translateX(-50%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .image-vote-right-percent-title {
        right: 25%;
        z-index: 4;
        color: var(--vote-right);
        text-align: center;
        -webkit-transform: translateY(-50%) translateX(50%);
        -ms-transform: translateY(-50%) translateX(50%);
        transform: translateY(-50%) translateX(50%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-left-percent-bg {
        -webkit-clip-path: polygon(0 0, 100% 0, 99.7% 100%, 0 100%);
        clip-path: polygon(0 0, 100% 0, 99.7% 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-right-percent-bg {
        -webkit-clip-path: polygon(.03% 0, 100% 0, 100% 100%, 0 100%);
        clip-path: polygon(.03% 0, 100% 0, 100% 100%, 0 100%)
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-left-percent-title,
    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-right-percent-title {
        top: 3px;
        -webkit-transform: unset;
        -ms-transform: unset;
        transform: unset;
        font-size: 14px;
        line-height: 18px
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-left-percent-title .my-selected-choice-icon,
    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-right-percent-title .my-selected-choice-icon {
        margin: 0 5px;
        font-size: 14px;
        opacity: 1
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-left-percent-title {
        left: 8px;
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-right-percent-title {
        right: 8px;
        -webkit-transform: unset;
        -ms-transform: unset;
        transform: unset
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-left-percent-data {
        position: absolute;
        bottom: 3px;
        left: 8px;
        z-index: 5;
        color: var(--vote-left);
        opacity: 1;
        font-size: 12px;
        line-height: 17px
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box.show-image-vote-result .image-vote-right-percent-data {
        position: absolute;
        right: 8px;
        bottom: 3px;
        z-index: 6;
        color: var(--vote-right);
        opacity: 1;
        font-size: 12px;
        line-height: 17px
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .center-stealth-split-border {
        position: absolute;
        top: 50%;
        bottom: 0;
        left: 50%;
        z-index: 20;
        width: 9px;
        height: 130%;
        background-color: var(--1st-bg-color);
        border-right: 2px solid var(--vote-right);
        border-left: 2px solid var(--vote-left);
        transform: translateX(-50%) translateY(-50%) rotate(14deg);
        opacity: 1;
        transition: all 2s;
        content: ""
    }

    .index_image-vote-wrapper__9tx6A .image-vote-choice-percent-box .center-stealth-split-border.hidden-center-split {
        opacity: 0;
        transition: all .3s
    }

    /*image vote desu - End*/
    /*inlinevideodesu - Start*/
    .post-content_main-post-info__qCbZu section.undefined {
        display: flex;
        justify-content: center;
    }

    .post-content_main-post-info__qCbZu section.undefined > video {
        max-height: 30vw;
        /*stilllllllll dont know why vw works on height*/
    }

    /*=========================
        PostDesu! - End
    =========================*/
    /*===============================
          Media Query - Start
    =================================*/
    @media (max-width: 720px) {
        .bbs-sl-web-nav {
            display: none;
        }

        .bbs-sl-web-topic-wrap {
            grid-column: 1 / -1;
        }

        ul.hasLogin {
            display: none;
        }

        .post-reply-list-user-info-top .user-operate {
            display: none;
        }
    }

    @media (max-width: 992.6px) {
        .hasLogin .top-userSetUp .setup-dropdown {
            right: unset;
        }
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
