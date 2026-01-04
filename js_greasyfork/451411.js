// ==UserScript==
// @name         聯盟戰棋 TFT翻譯
// @namespace    https://txacg.moe/
// @version      12.17b
// @description  翻譯 https://tftactics.gg/ 的英文單字為繁體中文
// @author       txacg
// @match        https://tftactics.gg/*

// @exclude      *://docs.google.com/*
// @exclude      *://drive.google.com/*
// @exclude      *://mail.google.com/*

// @require      https://code.jquery.com/jquery-3.4.1.min.js

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451411/%E8%81%AF%E7%9B%9F%E6%88%B0%E6%A3%8B%20TFT%E7%BF%BB%E8%AD%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/451411/%E8%81%AF%E7%9B%9F%E6%88%B0%E6%A3%8B%20TFT%E7%BF%BB%E8%AD%AF.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

(function () {
    'use strict';

    if(0){/*
last update: 7/04/2020

== todo ==
1. comment on iframes.
1. script execution flow with FHD.
1. separate counter for each execution instance.

10. case: 2 text nodes have the same parent block.

== issues ==
- certain text nodes aren't accessed with markCheckedElement enabled. (multiple text nodes)

== how it works ==
1a. calls processPage() once for each major run.
1b. creates list of specific text nodes then checks each against all rules.
1ba. with special replace enabled, if delete or full replace match, check stops after the first special match.
- this excludes elements previously checked.
- changes text based on matches.
1c. after checking a text node against all rules, applies a 'checked' class to the element containing the text node.

2a. dlt1 and dlt2 completely replaces text by default, option to change.

== notification notes ==
1e. elements checked by title attributes are processed in a separate block.
5a. notifications only work for those sites enabled with filters.

== version history ==
== 1.05.03 ==
- custom execution time
- some clean up.

== code markers ==
AA. initial setup
AB. replace rules
AC. special rules
BA. script options
BB. notif code block
CA. processPage()
CB. execution control
DA. script button
DB. support functions
    */}

    // ==== AA. initial setup =====================================================================|

    const scriptPrefix = "rplt-";
    const scriptTag = "RPLT";

    let runScript = 1;
    runScript = getOptionState("enable-"+ scriptPrefix +"script", runScript);

    if (runScript) {

        let enableConsoleMessages = 1; // default 0; set to 1 to show console messages.
        enableConsoleMessages = getOptionState("log-"+ scriptPrefix +"msg", enableConsoleMessages);

        let enabledMessages =
            //"MA|"+ // any rule matches
            "TT-MA|"+ // page title match.
            "TXT-MA|"+ // all text matches.
            "DLT1|"+ // delete1 matches.
            "DLT2|"+ // delete2 matches
            "FR1|"+ // full replace matches.
            //"CH-TT|"+ // changed text.

            "RUNT|"+ // runtime messages (amount of time to execute)
            "EXEC|"+ // execution messages (when code is executed)
            "\\bST\\b|"+ //script option change update
            "GEN$|"+ // general messages
            "^1"; // high priority messages
        let logAll = 0; // if 1, logs all titles from blocks.
        logAll = getOptionState("log-"+ scriptPrefix +"all", logAll);
        if (logAll) {
            enabledMessages = enabledMessages.concat("|title");
        }
        const enabledMessagesRegex = new RegExp(enabledMessages); // used in consolelog().

        consolelog("#### ("+ scriptTag +") text replace script began. ####", "EXEC");

        // ==== AB. replace rules =================================================================|

        let replaceRules = [
            //[//i, ""], // rule template

            // basic examples:
            [/Lulu/i, "露璐"],[/Jinx/i, "吉茵珂絲"],[/Qiyana/i, "姬亞娜"],[/Yone/i, "犽凝"],[/Shen/i, "慎"],[/Diana/i, "黛安娜"],[/Olaf/i, "歐拉夫"],[/Sylas/i, "賽勒斯"],[/Ornn/i, "鄂爾"],[/Yasuo/i, "犽宿"],[/Tristana/i, "崔絲塔娜"],[/Pantheon/i, "潘森"],
            [/Hecarim/i, "赫克林"],[/Corki/i, "庫奇"],[/Sona/i, "索娜"],[/Bard/i, "巴德"],[/Idas/i, "埃達斯"],[/Zoe/i, "柔伊"],[/Aurelion Sol/i, "翱銳龍獸"],[/Ezreal/i, "伊澤瑞爾"],[/Skarner/i, "史加納"],[/Twitch/i, "圖奇"],[/Varus/i, "法洛士"],
            [/Illaoi/i, "伊羅旖"],[/Xayah/i, "剎雅"],[/Braum/i, "布朗姆"],[/Lillia/i, "莉莉亞"],[/Pyke/i, "派克"],[/Neeko/i, "妮可"],[/Ao Shin/i, "敖興"],[/Elise/i, "伊莉絲"],[/Syfen/i, "賽焚"],[/Ryze/i, "雷茲"],[/Nami/i, "娜米"],
            [/Vladimir/i, "弗拉迪米爾"],[/Heimerdinger/i, "漢默丁格"],[/Sett/i, "賽特"],[/Shyvana/i, "希瓦娜"],[/Senna/i, "姍娜"],[/Sejuani/i, "史瓦妮"],[/Talon/i, "塔龍"],[/Thresh/i, "瑟雷西"],[/Anivia/i, "艾妮維亞"],[/Soraka/i, "索拉卡"],[/Shi Oh Yu/i, "襲奧玉"],
            [/Kayn/i, "慨影"],[/Lee Sin/i, "李星"],[/Ashe/i, "艾希"],[/Taric/i, "塔里克"],[/Leona/i, "雷歐娜"],[/Karma/i, "卡瑪"],[/Nunu/i, "努努"],[/Daeja/i, "戴枷"],[/Swain/i, "斯溫"],[/Gnar/i, "吶兒"],[/Volibear/i, "弗力貝爾"],[/Nidalee/i, "奈德麗"],[/Tahm Kench/i, "貪啃奇"],
            [/Rell/i, "銳兒"],[/Rakan/i, "銳空"],[/Terra/i, "泰拉"],[/Malphite/i, "墨菲特"],[/Taliyah/i, "塔莉雅"],[/Kaisa/i, "凱莎"],[/Lux/i, "拉克絲"],[/Zeri/i, "捷莉"],[/Aphelios/i, "亞菲利歐"],[/Nomsy/i, "嚼嚼"],[/Graves/i, "葛雷夫"],[/Jayce/i, "杰西"],[/Nilah/i, "倪菈"],
            [/Seraphine/i, "瑟菈紛"],[/Zyra/i, "枷蘿"],[/Rengar/i, "雷葛爾"],[/Sohm/i, "頌沐"],[/Zac/i, "札克"],[/Jax/i, "賈克斯"],[/xxxxxx/i, "橘皮"],[/Wukong/i, "悟空"],

            [/Slow Roll \(7\)/i, "慢速 卡 7 等 抓棋三星"],[/Slow Roll \(6\)/i, "慢速 卡 6 等 抓棋三星"],[/Standard/i, "正常"],[/Fast 8/i, "快速 升 8"],[/Hyper Roll/i, "賭狗"],

            [/Filters/i, "篩選"],[/Reset/i, "重置"],[/Playstyle/i, "運營風格"],[/Patch/i, "版本"],[/Tier Up/i, "階級上升"],[/Tier Down/i, "階級下降"],[/New/i, "新組合"],

            [/Early Comp/i, "前期代用"],[/Traits/i, "特性"],[/Carousel/i, "裝備優先順序"],[/Options/i, "替換或代用"],[/Positioning/i, "基本擺陣"],[/LVL UP/i, "多餘人口"],

            [/B.F. Sword/i, "暴風大劍"],[/Tear of the Goddess/i, "水滴"],[/Chain Vest/i, "鎖子甲"],[/Recurve Bow/i, "反曲弓"],[/Rapid Firecannon/i, "火炮"],[/Needlessly Large Rod/i, "巨型魔棒"],[/Hextech Gunblade/i, "科技槍"],[/Bloodthirster/i, "噬血者"],[/Ornn/i, "鄂爾"],[/Yasuo/i, "犽宿"],[/Tristana/i, "崔絲塔娜"],
            [/Hecarim/i, "赫克林"],[/Corki/i, "庫奇"],[/Sona/i, "索娜"],[/Bard/i, "巴德"],[/Idas/i, "埃達斯"],[/Zoe/i, "柔伊"],[/Aurelion Sol/i, "翱銳龍獸"],[/Ezreal/i, "伊澤瑞爾"],[/Skarner/i, "史加納"],[/Twitch/i, "圖奇"],[/Varus/i, "法洛士"],
            [/Illaoi/i, "伊羅旖"],[/Xayah/i, "剎雅"],[/Braum/i, "布朗姆"],[/Lillia/i, "莉莉亞"],[/Pyke/i, "派克"],[/Neeko/i, "妮可"],[/Ao Shin/i, "敖興"],[/Elise/i, "伊莉絲"],[/Syfen/i, "賽焚"],[/Ryze/i, "雷茲"],[/Nami/i, "娜米"],
            [/Vladimir/i, "弗拉迪米爾"],[/Heimerdinger/i, "漢默丁格"],[/Sett/i, "賽特"],[/Shyvana/i, "希瓦娜"],[/Senna/i, "姍娜"],[/Sejuani/i, "史瓦妮"],[/Talon/i, "塔龍"],[/Thresh/i, "瑟雷西"],[/Anivia/i, "艾妮維亞"],[/Soraka/i, "索拉卡"],[/Shi Oh Yu/i, "襲奧玉"],
            [/Kayn/i, "慨影"],[/Lee Sin/i, "李星"],[/Ashe/i, "艾希"],[/Taric/i, "塔里克"],[/Leona/i, "雷歐娜"],[/Karma/i, "卡瑪"],[/Nunu/i, "努努"],[/Daeja/i, "戴枷"],[/Swain/i, "斯溫"],[/Gnar/i, "吶兒"],[/Volibear/i, "弗力貝爾"],

            [/Bruiser/i, "蠻勇鬥士"],[/Warrior/i, "戰士"],[/Swiftshot/i, "輕靈射手"],[/Assassin/i, "刺客"],[/Cannoneer/i, "重砲兵"],[/Guardian/i, "守護者"],[/Mage/i, "法師"],[/Mystic/i, "秘術大師"],[/Evoker/i, "飲魔師"],[/Shapeshifter/i, "變形師"],[/Cavalier/i, "重騎兵"],
            [/Dragonmancer/i, "龍恩選召者"],[/Legend/i, "傳說"],[/Bard/i, "巴德"],[/Astral/i, "星界化身"],[/Ragewing/i, "怒翼使者"],[/Whispers/i, "低語邪靈"],[/Jade/i, "翠玉使者"],[/Shimmerscale/i, "微光龍鱗"],[/Mirage/i, "幻境化身"],[/Trainer/i, "馴龍高手"],[/Scalescorn/i, "滅龍軍團"],
            [/Revel/i, "喜慶使者"],[/Guild/i, "冒險者公會"],[/Tempest/i, "風暴使者"],[/Dragon/i, "龍族"],[/Spell-Thief/i, "法術竊盜"],[/Starcaller/i, "喚星女神"],[/Darkflight/i, "闇夜惡靈"],[/Lagoon/i, "碧水行者"],[/Prodigy/i, "非凡成龍"],[/Monolith/i, "巨岩壁壘"],

            //[/branch/i, "turtle"],
            //[/file/i, "birdie"],
            //[/\w/g, "a"], //replaces all characters with "a".
            //[/(.|\W)+/i, "text"], //replaces all text instances with "text".
        ];

        // ==== AC. special rules =================================================================|

/*         const enableSpecialRules = 1;
        if (enableSpecialRules) {
            // example of including a rule list defined in a spearate script.
            if (unsafeWindow.globalListName) {
                replaceRules = replaceRules.concat(unsafeWindow.globalListName);
            }
        } */
        //consolelog(replaceRules,"all rules"); //test: double check rule contents

        // ==== BA. script options ================================================================|

        const classWhitelist = /notif-hidden|notif-text|tag-inst|-counter/i;
        // text nodes with parent elements with these classes are excluded.

        const generateRecheckButton = 1;

        let dynamicChecking = 1; // default 1; set to 1 to run the script automatically when new image elements are detected.
        dynamicChecking = getOptionState("enable-"+ scriptPrefix +"dynamic-checking", dynamicChecking);
        // setting to 0 would make this run a few more times when dynamically checking.

        // ==== checked in processPage() ====
        // managable with optional Script Options userscript.
        let logRuntimes = 1; // default 0; set to 1 to log function runtimes to the console.
        let markCheckedElements = 1; // default 1; set to 0 if certain sites start appearing weirdly.

        let enableSpecialReplace = 1;
        let fullDelete = 0; // default 1; if 1, text is completely replaced.
        let addTag = 1; // if fullDelete is active, adds a tag without replacing.

        // ==== BB. notif code ====================================================================|

        // 'script options' options
        let enableExecCounter = 0;
        enableExecCounter = getOptionState("enable-"+ scriptPrefix +"counter", enableExecCounter);
        let enableNotifications = 0;
        enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
        let autohideNotifs = 0; // default 0; notifs disappear after a set period of time. used in createNotif()
        let startCollapsed = 1; //default 1;

        // notif css variables.
        const notifsHex = "#ddd";
        const notifsOpacity = .4; // default .4; set to a value between 0 and 1, 1 is no transparency, .5 is 50% transparency.
        const notifsWidth = 120; // default 120; width in pixels of each notification.

        let notifContainerId = "notif-main-container";

        // generate notif container if needed.
        if ((enableExecCounter || enableNotifications) && !jQuery("#"+ notifContainerId).length) {

            // ==== setting/checking initial visual state of notifs ====

            // constrolled exclusively by local storage or the default value.
            const localStorageName = "notif start collapsed";
            if (window.localStorage.getItem(localStorageName)) {
                startCollapsed = window.localStorage.getItem(localStorageName);
                startCollapsed = (startCollapsed == "true");
            }

            const visibleClass = "notif-visible";
            const hiddenClass = "notif-hidden1";
            let startingStateClass = visibleClass;
            let otherStartingStateClass = hiddenClass;
            if (startCollapsed) {
                startingStateClass = hiddenClass;
                otherStartingStateClass = visibleClass;
            }

            // ==== create container ==============================================================|
            /*
            [ notif main container
                [notif1] - counters
                [hide] - button
                [open] - button
                [close] - button
                [clear] - button
                [notif2
                    [dlt-container]
                    [ll-container]
                    [ot-container]
                ]

            ]
            - hide: makes visible open | hides close, clear, notif2
            - open: makes visible hide, close, clear, notif2 | hides open
            - close: deletes notif main container.
            - clear: empties notif-container2
            */

            const openButtonId = "notif-open";
            const hideButtonId = "notif-hide";

            let notificationsElement =
                "<div id='"+ notifContainerId +"'>"+
                "<div id='notif-container1'></div>"+
                "<div id='"+ hideButtonId +"' class='notif-red notif-rounded-block "+ startingStateClass +"'>notif hide</div>"+
                "<div id='"+ openButtonId +"' class='notif-green notif-rounded-block "+ otherStartingStateClass +"'>notif open</div>"+
                "<div id='notif-close' class='notif-gray notif-rounded-block "+ startingStateClass +"'>close notif[]</div>"+
                "<div id='notif-clear' class='notif-orange notif-rounded-block "+ startingStateClass +"'>clear notif</div>"+
                "<div id='notif-container2' class=' "+ startingStateClass +"'>"+
                    "<div id='dlt-container'></div>"+
                    "<div id='ll-container' class='notif-hidden1'></div>"+
                    "<div id='ot-container' class='notif-hidden1'</div>"+
                "</div>"+
                "</div>";
            jQuery("body").prepend(notificationsElement);

            let textReaderElement =
                "<div id='notif-text-overlay' class='notif-text-hidden'></div>";
            jQuery("body").prepend(textReaderElement);

            jQuery('#notif-container2').on( {
                mouseenter: function () {
                    let notifText = jQuery(this).find(".notif-text").text();
                    let notifClassList = this.className;
                    if (/red/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-red");
                    }else if (/orange/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-orange");
                    }else if (/yellow/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-yellow");
                    }else {
                        jQuery("#notif-text-overlay").addClass("notif-gray");
                    }
                    jQuery("#notif-text-overlay").text(notifText);
                    jQuery("#notif-text-overlay").addClass("notif-text-visible");
                },
                mouseleave: function () {
                    jQuery("#notif-text-overlay").removeClass("notif-text-visible");
                    jQuery("#notif-text-overlay").removeClass("notif-red");
                    jQuery("#notif-text-overlay").removeClass("notif-orange");
                }
            }, '.notif-instance');

            // ==== close ====
            jQuery("#notif-close").click(function(){
                jQuery("#"+notifContainerId).remove();
                //console.log("RPL notif close clicked. ("+notifContainerId+")");
            });

            // ==== clears container2 which contains notif instances. ====
            function clearNotif(){
                jQuery("#notif-container2").empty();
            }
            jQuery("#notif-clear").click(clearNotif);

            // ==== open/hide events ==============================================================|

            const mainSelector = "#notif-container2, #"+ hideButtonId +", #notif-close, #notif-clear";

            jQuery("#"+ hideButtonId).click(function () {
                //console.log(hideButtonId);
                window.localStorage.setItem(localStorageName, true);

                switchClasses(
                    mainSelector,
                    "#"+ openButtonId,
                    visibleClass,
                    hiddenClass
                );
            });

            jQuery("#"+ openButtonId).click(function () {
                //console.log(openButtonId);
                window.localStorage.setItem(localStorageName, false);

                switchClasses(
                    mainSelector,
                    "#"+ openButtonId,
                    hiddenClass,
                    visibleClass
                );
            });

            function switchClasses(mainSelector, subSelector, removedClass, newClass) {
                jQuery(mainSelector).removeClass(removedClass);
                jQuery(mainSelector).addClass(newClass);
                jQuery(subSelector).removeClass(newClass);
                jQuery(subSelector).addClass(removedClass);
            }

            // ==== CSS ===========================================================================|
            if(1){var notifsCss =
    `<style type="text/css">
        #`+ notifContainerId +` {
            width: `+ notifsWidth +`px;
            max-height: 50%;
            margin: 0 2px 2px;
            display: block;

            line-height: initial;
            color: #000;
            opacity: `+ notifsOpacity +`;
            position: fixed;
            top: 0px;
            right: 0px;
            z-index: 9999;
            overflow-y: auto;
        }
        #`+ notifContainerId +`:hover {
            opacity: 1;
        }

        .notif-rounded-block {
            display: block;
            padding: 2px;
            border-radius: 3px;
            margin-top: 2px;

            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .s-counter {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: #ddd;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
        }

        .notif-text-hidden {
            display:none;
        }
        .notif-text-visible {
            display: block;
            max-width: 50%;
            padding: 5px;
            border: #999 solid 2px;
            border-radius: 10px;

            position: fixed;
            top: 5px;
            left: 5px;
            z-index: 999999;


            font-size: 15px !important;
            font-weight: bold !important;
            text-align: center !important;
            color: black !important;
        }

        .notif-instance {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: `+ notifsHex +`;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .notif-instance div{/* div holding the rule.*/
            max-height: 12px;
            padding: 0px;
            margin: 0px;
            border: 0px;

            overflow: hidden;
            word-break: break-all;
        }
        .notif-hidden{ /* meant to hide the rule */
            opacity: .1;
        }
        .notif-hidden:hover {
            opacity: 1;
        }

        .notif-red {
            background: #f67066;
        }
        .notif-orange {
            background: #ffc107; //yellowish
        }
        .notif-yellow {
            background: #ffc107; //yellowish
        }
        .notif-green {
            background: #62bb66;
        }
        .notif-gray {
            background: #777;
        }

        /* collapsible classes */
        .notif-hidden1 {
            display: none !important;
        }
        .notif-visible {
            display: block !important;
        }

        div#ll-container, div#ot-container {
            border-top: solid black 3px;
        }
    </style>`;
            }
            jQuery(document.body).append(notifsCss);
        }

        if(enableExecCounter) {
            jQuery("#notif-container1").prepend("<div id='"+ scriptTag +"-counter' class='s-counter .notif-rounded-block'>T No text nodes found.</div>");
        }

        // resets lastIndex on tests with global modifiers.
        RegExp.prototype.regexTest = function(testString){
            //consolelog("## regexTest() ##", 1);
            if (this.test(testString)) {
                if (/.\/i?g/.test(this) && this.lastIndex) {//regex global modifier needs to be reset.
                    //consolelog("## last index: "+ this.lastIndex +" ##", 1);
                    this.lastIndex = 0;
                }
                return true;
            }
            return false;
        };

        NodeList.prototype.forEach = Array.prototype.forEach;

        // ==== CA. processPage() =================================================================|

        // ==== processPage() globals ====
        let titleChecked = 0; // if the page title was checked or not.
        let fullCheck = 0;

        // ==== counters ====
        let nodeCounter = 0; // counts text nodes.
        let deleteMatches = 0;
        let fullReplaceMatches = 0;
        let executionCounter = 0; // the number of times processPage() was executed.

        function processPage() {
            executionCounter++;

            logRuntimes = getOptionState("log-"+ scriptPrefix +"runtimes", logRuntimes);
            if (logRuntimes) {
                var startTime = performance.now();
            }

            let rulesNum = replaceRules.length;

            // per element variables
            let ruleMatched = 0;

            // ==== checks the title of the page ==================================================|
            if(1){
                let titleText = jQuery("title").text();
                if (titleText && !titleChecked) {
                    for (let index = 0; index < rulesNum; index++) {
                        if (replaceRules[index][0].regexTest(titleText)) {
                            consolelog(scriptTag +" (title match): "+ titleText +" | "+ replaceRules[index][0], "TT-MA");
                            titleText = titleText.replace(replaceRules[index][0], replaceRules[index][1]);
                            jQuery("title").text(titleText);
                        }
                    }
                    titleChecked = 1;
                }
            }

            // ==== selects specified text elements ===============================================|
            if(1){
                const excludedElements = /CODE|SCRIPT|STYLE|TEXTAREA/i;
                const checkClassRegex = new RegExp(scriptPrefix +"node","i");
                var textWalker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: function (node) {
                            if (node.nodeValue.trim() &&
                                !excludedElements.test(node.parentNode.nodeName) && // exclude scripts and style elements
                                (fullCheck || !checkClassRegex.test(node.parentNode.classList)) && // exclude checked elements
                                !classWhitelist.test(node.parentNode.classList)) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                            return NodeFilter.FILTER_SKIP;
                        }
                    },
                    false
                );
            }
            let textNode = textWalker.nextNode();
            let previousParent;

            // ==== for each textNode =============================================================|
            while (textNode) {

                let nodeText = textNode.nodeValue; // is changed based on matches.
                if (!fullCheck) {
                    let immediateParentNode = textNode.parentNode; // element containing the text node.
                    nodeCounter++;

                    // common case: new parent is different than previous.
                    if (previousParent && !(previousParent == immediateParentNode) ) {
                        markCheckedElements = getOptionState(scriptPrefix +"mark-checked", markCheckedElements);
                        if (markCheckedElements) {
                            // only sets checked class if previous parent is different.
                            previousParent.classList.add(scriptPrefix +"node-"+ nodeCounter);
                        }
                        previousParent = immediateParentNode;
                    }else if (!previousParent) {
                        previousParent = immediateParentNode;
                    }
                }

                // ==== for each rule =============================================================|
                for (let index = 0; index < rulesNum; index++) {

                    let currentRuleRegex = replaceRules[index][0];
                    let replacementValue = replaceRules[index][1];

                    if (currentRuleRegex.regexTest(nodeText.trim())) {
                        ruleMatched = 1;
                        let matchPrefix = "GEN0";
                        consolelog("("+ scriptTag +") (n)"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, "TXT-MA");

                        const disableReplace = 0; // test: check what is checked through each run.
                        if (!disableReplace) {

                            enableSpecialReplace = getOptionState("enable-special-replace", enableSpecialReplace);
                            // ==== delete1 match =================================================|
                            if (enableSpecialReplace && (/DELETE1/.test(replacementValue) || /DELETE2/.test(replacementValue)) ) {
                                deleteMatches++;

                                matchPrefix = "DLT99";
                                if (/DELETE1/.test(replacementValue) && !/DELETE1/.test(nodeText)) {
                                    matchPrefix = "DLT1";
                                }else if (/DELETE2/.test(replacementValue) && !/DELETE2/.test(nodeText)) {
                                    matchPrefix = "DLT2";
                                }

                                consolelog("("+ scriptTag +") ("+ matchPrefix +") n"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, matchPrefix);
                                createNotif(nodeCounter +" "+ matchPrefix, currentRuleRegex, nodeText);

                                fullDelete = getOptionState("enable-full-delete", fullDelete);
                                addTag = getOptionState("add-tag", addTag);
                                const tagRegex = new RegExp("^\\["+matchPrefix);

                                if (fullDelete) {
                                    nodeText = "## "+ matchPrefix +" ##"; // replaces the text completely.
                                    break;
                                }else if (addTag && !tagRegex.text(nodeText)) {
                                    nodeText = "["+ matchPrefix +"]: " + nodeText; // prepends DLT1 or DLT2
                                }
                            }
                            // ==== full replace match ============================================|
                            if (enableSpecialReplace && /^FR1/.test(replacementValue)) {
                                fullReplaceMatches++;
                                matchPrefix = "FR1";
                                consolelog("("+ scriptTag +") ("+ matchPrefix +") n"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, matchPrefix);
                                createNotif(nodeCounter +" "+ matchPrefix, currentRuleRegex, nodeText);

                                nodeText = replacementValue;
                                break;
                            }
                            // ==== base case =====================================================|
                            nodeText = nodeText.replace(currentRuleRegex, replacementValue);
                        } // end if (!disableReplace)
                    }
                } // end for (each rule) ==========================================================|

                if (ruleMatched) { // modify text block.
                    ruleMatched = 0;
                    textNode.nodeValue = nodeText;
                    consolelog("("+ scriptTag +") (n)"+ nodeCounter +" (text): "+ nodeText.trim(), "CH-TT");
                }
                textNode = textWalker.nextNode();
            } // end while (textNode) =============================================================|

            if (!fullCheck) {
                // ==== update counter ====
                let counterText = "T DLT:"+ deleteMatches +" | FR:"+ fullReplaceMatches +" | N:"+ nodeCounter + " | EX:"+ executionCounter;
                jQuery("#"+ scriptTag +"-counter").text(counterText);
                if (nodeCounter) {
                    jQuery("#"+ scriptTag +"-counter").addClass("notif-green");
                }
            }else { //end fullCheck.
                fullCheck = 0;
            }

            //consolelog("## ("+ scriptTag +") execution #"+ executionCounter +" ##", "EXEC");
            // script option handles if this is displayed or not.
            if (logRuntimes) {
                const endTime = performance.now();
                const runTime = ((endTime - startTime) / 1000).toFixed(2);
                if (runTime > 1) {
                    consolelog('('+ scriptTag +') finished after ' + runTime + ' seconds.', "RUNT");
                }else {
                    consolelog('('+ scriptTag +') finished in less than 1 second.', "RUNT");
                }
            }
        } //end function function replaceText()

        // ==== CB. execution control =============================================================|

        //console.log("("+ scriptTag +") EXEC: Initial run.");
        //processPage();
        let runWhenReady = 0;
        runWhenReady = getOptionState("run-when-ready", runWhenReady);
        if (runWhenReady) {
            jQuery(document).ready(function() { //after DOM has loaded.
                consolelog("("+ scriptTag +") EXEC: document.ready()", "EXEC");
                //fullCheck = 1;
                processPage();
            });
        }

        let runWhenLoaded = 1;
        runWhenLoaded = getOptionState("run-when-loaded", runWhenLoaded);
        if (runWhenLoaded) {
            jQuery(window).on("load", function() { //after all initial images are loaded.
                consolelog("("+ scriptTag +") EXEC: window.load()", "EXEC");
                //fullCheck = 1;
                processPage();
            });
        }
        if (dynamicChecking) {
            jQuery(document).ready(waitForKeyElements("img", processPage));
        }

        // ==== DA. script button =================================================================|

        let buttonsContainerId = "ctb-container1";
        if (generateRecheckButton && jQuery("#"+ buttonsContainerId).length) {
            jQuery("#"+ buttonsContainerId).prepend("<div id='"+ scriptTag +"-reset' class='ctb-blue ctb-rounded-block'>run "+ scriptTag +"</div>"); //added to beginning
            //jQuery("#"+ scriptTag +"-reset").click(processPage);
            jQuery("#"+ scriptTag +"-reset").click(function() {
                fullCheck = 1;
                processPage();
            });
        }

        // ==== DB. support functions =============================================================|

        function createNotif(notifLabel, notifRule, notifText) { //msg1 needs to match notifTypes
            enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
            if (enableNotifications) {
                let additionalClass = "notif-gray";
                let notifContainer = "ot-container";
                if (/dlt/i.test(notifLabel)) {
                    additionalClass = "notif-red";
                    notifContainer = "dlt-container";
                }

                let newNotif =
                    "<div class='notif-instance "+ additionalClass +"'><div>t n"+ notifLabel +"</div>"+
                        "<div class='notif-hidden'>"+ notifRule +"</div>"+
                        "<div class='notif-text' hidden>"+ notifText+"</div>"+ // to be displayed at the bottom left.
                    "</div>";

                let enabledNotifTypesRegex = /./;
                if (enabledNotifTypesRegex.test(notifLabel)) {
                    jQuery("#"+ notifContainer).append(newNotif);
                    jQuery(".notif-instance").click(function(){
                        jQuery("#notif-container2").empty();
                    });

                    if (!/dlt/i.test(notifLabel)) {
                        jQuery("#ot-container").removeClass("notif-hidden1");
                    }

                    autohideNotifs = getOptionState("autohide-notifications", autohideNotifs);
                    if (autohideNotifs) {
                        const notifDuration = 10; // default 10; amount of seconds notifications are displayed before disappearing.
                        setTimeout(function() {
                            jQuery(".notif-instance").remove();
                        }, notifDuration*1000);
                    }
                }
            }
        } // end function creatNotif()

        function consolelog(text, messageType) {
            if (enableConsoleMessages && enabledMessagesRegex.test(messageType)) {
                console.log(text);
            }
        }

        // ==== script end ========================================================================|
        consolelog("#### ("+ scriptTag +") text replace script is active. ####", "EXEC");

    } // end if (runScript)

    // ============================================================================================|

    // = getOptionState(, );
    // used to update option if 'script option' is set.
    function getOptionState(idName, currentState) {
        if (document.getElementById(idName)) {
            return document.getElementById(idName).checked;
        }
        return currentState;
    }
})();