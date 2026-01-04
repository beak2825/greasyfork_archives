// ==UserScript==
// @name            Hangouts Design Theme for Google Chat Web
// @name:de         Hangouts Design Theme für Google Chat Web
// @version         1.0.5
// @description     Use Google Chat Web with the old Hangouts Design Theme
// @description:de  Google Chat Web mit dem alten Hangouts-Design-Theme verwenden
// @icon            https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_chat_r2.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/hangouts-design-theme-for-google-chat-web
// @license         MIT
// @match           https://mail.google.com/chat/*
// @match           https://chat.google.com/u/0/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/454610/Hangouts%20Design%20Theme%20for%20Google%20Chat%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/454610/Hangouts%20Design%20Theme%20for%20Google%20Chat%20Web.meta.js
// ==/UserScript==

(function ($, undefined) { // Safe jQuery import, Thanks to https://stackoverflow.com/a/29363547
    $(async function () {
        const BACKGROUNDS = [
            { // Bird
                src: "https://www.gstatic.com/chat/hangouts/bg/f466d78212377293b5b745200add730f-stclair.jpg",
                srcAlt: "",
                author: "Tim St. Clair",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/TimStClair.jpg",
                profileAlt: ""
            },
            { // Corn Field
                src: "https://www.gstatic.com/chat/hangouts/bg/8b5e7ba224b738d2230391a5a15802bb-davec.jpg",
                srcAlt: "",
                author: "Dave Cohen",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/DaveCohen.jpg",
                profileAlt: ""
            },
            { // Pink Flower with Bee
                src: "https://www.gstatic.com/chat/hangouts/bg/2f1c3d68387ec036b4e49469c3289dae-GregSpencerDude.jpg",
                srcAlt: "",
                author: "Greg Spencer",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/GregSpencer.jpg",
                profileAlt: ""
            },
            { // Green Plant with Dragonfly
                src: "https://www.gstatic.com/chat/hangouts/bg/1d1d6f6311e7950d18720796905a4cbd-AnushElangovan-02.jpg",
                srcAlt: "",
                author: "Anush Elangovan",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/AnushElangovan.jpg",
                profileAlt: ""
            },
            { // Mountains with Pink Sky
                src: "https://www.gstatic.com/chat/hangouts/bg/734d92065df4177a006d5438caa46ae1-AKrishnaswamy-01.jpg",
                srcAlt: "",
                author: "Aravind Krishnaswamy",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/AravindKrishnaswamy.jpg",
                profileAlt: ""
            },
            { // Sheep Flock with Dog
                src: "https://www.gstatic.com/chat/hangouts/bg/c08b5d898d4000793c509ed40f804e2a-Matiash-03.jpg",
                srcAlt: "",
                author: "Brian Matiash",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/BrianMatiash.jpg",
                profileAlt: ""
            },
            { // Tourist Spot: Moai
                src: "https://www.gstatic.com/chat/hangouts/bg/e4c50a95c0148bb14931a73c2ae80d35-AnushElangovan-01.jpg",
                srcAlt: "",
                author: "Anush Elangovan",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/AnushElangovan.jpg",
                profileAlt: ""
            },
            { // Lake with Dark Clouds
                src: "https://www.gstatic.com/chat/hangouts/bg/d737e8519d5e7d6e0fe5fec9e35b2e2c-echang.jpg",
                srcAlt: "",
                author: "Emily Chang",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/EmilyChang.jpg",
                profileAlt: ""
            },
            { // Orange Flower
                src: "https://www.gstatic.com/chat/hangouts/bg/74474c3fc567f4dd012954c96e58d8d6-ChristopherJohnson.jpg",
                srcAlt: "",
                author: "Christopher Johnson",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/ChristopherJohnson.jpg",
                profileAlt: ""
            },
            { // Mossy Tree with River
                src: "https://www.gstatic.com/chat/hangouts/bg/cbccbd84d54a52e3ba7b148f2711b629-Matiash-02.jpg",
                srcAlt: "",
                author: "Brian Matiash",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/BrianMatiash.jpg",
                profileAlt: ""
            },
            { // Two Lions
                src: "https://www.gstatic.com/chat/hangouts/bg/650ec88f5cc9e0c827fe6ac61117211d-VidyaNagarajan.jpg",
                srcAlt: "",
                author: "Vidya Nagarajan",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/VidyaNagarajan.jpg",
                profileAlt: ""
            },
            { // Nature Waterfall
                src: "https://www.gstatic.com/chat/hangouts/bg/bbafcf27dfe823a255e7fa549b5b6ba5-Matiash-01.jpg",
                srcAlt: "",
                author: "Brian Matiash",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/BrianMatiash.jpg",
                profileAlt: ""
            },
            { // Coast Line
                src: "https://www.gstatic.com/chat/hangouts/bg/a968e293d984aa05eee42df9a8d91dc2-AKrishnaswamy-03.jpg",
                srcAlt: "",
                author: "Aravind Krishnaswamy",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/AravindKrishnaswamy.jpg",
                profileAlt: ""
            },
            { // Snowy Valley
                src: "https://www.gstatic.com/chat/hangouts/bg/b4a063d93b237f1e21c1bd2ef77d2c45-PaulMoody.jpg",
                srcAlt: "",
                author: "Paul Moody",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/PaulMoody.jpg",
                profileAlt: ""
            },
            { // Three Light Aircrafts
                src: "https://www.gstatic.com/chat/hangouts/bg/47b6231b6b9171fefbdda2f4750f1fda-nbutko.jpg",
                srcAlt: "",
                author: "Nicholas Butko",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/NicholasButko.jpg",
                profileAlt: ""
            },
            { // Valley with big Lake
                src: "https://www.gstatic.com/chat/hangouts/bg/1cfdd2ae9f28d352d2853628cdb70659-TreyRatcliff.jpg",
                srcAlt: "",
                author: "Trey Ratcliff",
                profile: "https://www.gstatic.com/chat/hangouts/bg/photographer/TreyRatcliff.jpg",
                profileAlt: ""
            }
        ];
        const TRANSLATIONS = { en: "Photo by", de: "Foto von" };
        const LANG = navigator.language || navigator.userLanguage;
        const TRANSLATION = TRANSLATIONS[LANG] || TRANSLATIONS["en"];
        let intervalMain, intervalSidebarFrame;

        function insertStyle(styles) {
            const html = `
            <style>
                ${styles.trim()}
            </style>
            `.trim();

            const child = $.parseHTML(html);
            $("head").append(child);
        }

        function insertHTML(parent, html) {
            html = html.replace(/>\s+</g, '><').trim(); // Clean up formatted html, Thanks to https://stackoverflow.com/a/27841683
            const child = $.parseHTML(html);
            $(parent).prepend(child);
        }

        function insertBackground() {
            const ran = Math.floor(Math.random() * (BACKGROUNDS.length - 1));

            insertHTML("body", `
            <div class="HDfGC-bg">
                <div class="HDfGC-bg-img"></div>
                <div class="HDfGC-bg-grad"></div>
                <div class="HDfGC-bg-author">
                    <div class="HDfGC-bg-author-img"></div>
                    <div class="HDfGC-bg-author-name-wrapper">
                        <div class="HDfGC-bg-author-name">${TRANSLATION} ${BACKGROUNDS[ran].author}</div>
                    </div>
                </div>
            </div>`);

            insertStyle(`
            .HDfGC-bg {
                position: fixed;
                width: 100%;
                height: 100%
            }

            .HDfGC-bg-img {
                background-image: url("${BACKGROUNDS[ran].src}");
                background-size: cover;
                height: 100%
            }

            .HDfGC-bg-grad {
                background-image: -moz-linear-gradient(rgba(0,0,0,.4) 0%,rgba(0,0,0,.6) 75%,rgba(0,0,0,.8) 100%);
                background-image: linear-gradient(rgba(0,0,0,.4) 0%,rgba(0,0,0,.6) 75%,rgba(0,0,0,.8) 100%);
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0
            }

            .HDfGC-bg-author {
                right: 1.3vw;
                bottom: 1.3vw;
                position: absolute
            }

            .HDfGC-bg-author-img {
                background-image: url("${BACKGROUNDS[ran].profile}");
                background-size: cover;
                display: inline-block;
                height: 32px;
                vertical-align: middle;
                width: 32px;
                border-radius: 50%
            }

            .HDfGC-bg-author-name-wrapper {
                font-size: 13px;
                color: white;
                display: inline-block;
                margin-left: 16px;
                vertical-align: middle;
            }

            /* Background */
            .wl {
                background: inherit;
            }

            /* Sidebar Icon */
            #Layer_1 {
                display: none;
            }
            `);

            $('[role="complementary"]').css("display", "none");
        }

        function invertColors() {
            insertStyle(`
            /* Navbar Icons */
            .gb_Ka svg, .gb_Oc svg, .gb_ad .gb_id, .gb_0c .gb_id {
                color: #C8D2DF !important;
            }

            /* Online Status */
            .Yb.bax.bCd {
                background: none;
            }

            /* Online Status */
            .Yc.bax {
                color: white;
            }
            `);

            $("a img").eq(0).attr("srcset", "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_chat_dark_2x.png 2x ,https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_chat_dark_1x.png 1x")
        }

        function changeDetails() {
            insertHTML(".nH.bkK", `
            <button class="HDfGC-x">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" fill="none"></rect>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.3584 3.15631L3.15632 4.35839L6.79792 8L3.15631 11.6416L4.35839 12.8437L8.00001 9.20208L11.6416 12.8437L12.8437 11.6416L9.20209 8L12.8437 4.35842L11.6416 3.15633L8.00001 6.79792L4.3584 3.15631Z" class="WIVxDf KuRlUd"></path>
                </svg>
            </button>`);

            insertStyle(`
            .HDfGC-x {
                position: absolute;
                z-index: 1;
                right: 4.5rem;
                top: 2.5rem;
                background-color: initial;
                border: none;
                padding: 0px;
                cursor: pointer;
            }

            .HDfGC-x svg {
                fill: black;
            }

            /* Main */
            .nH.bkK {
                margin-left: 4vw;
                margin-top: 2.99vh;
                display: none;
            }

            .nH.bkK > .nH {
                background-color: initial;
            }

            /* Search Bar */
            #aso_search_form_anchor {
                background-color: initial;
            }

            #aso_search_form_anchor input {
                color: white;
            }

            #aso_search_form_anchor input::placeholder {
                color: #C8D2DF
            }

            #aso_search_form_anchor input::-ms-input-placeholder {
                color: #C8D2DF
            }

            /* Chats & Groups Nav */
            .aeN {
                max-width: none !important;
            }

            /* New Chat Button */
            .T-I-KE {
                margin-top: 8px;
            }
            `);

            $('[role="navigation"]').css("background-color", "white");
            $('[role="navigation"]').css("border-top-left-radius", "4px");
            $('[role="navigation"]').css("border-top-right-radius", "4px");
            $('[role="navigation"]').css("width", "20.83vw");
            $('[role="navigation"]').css("top", "3vh");
            $('[role="navigation"]').css("left", "3.5vw");
        }

        function toggleMain(visible) {
            if (visible) {
                $(".nH.bkK").css("display", "block");
            } else {
                $(".nH.bkK").css("display", "none");
            }
        }

        function initMain() {
            if ($("#loading").is(":visible")) { // Stop when not completely loaded
                return;
            }

            //console.log("initMain(): Run");

            window.clearInterval(intervalMain);
            //console.log("initMain(): Cleared Interval");

            insertBackground();
            invertColors();
            changeDetails();

            // Make Main toggable

            window.addEventListener("message", function (e) {
                if (typeof (e?.data?.toggleMain) != "undefined") {
                    toggleMain(e?.data?.toggleMain);
                }
            });

            $(".HDfGC-x").click(function (e) {
                toggleMain();
            });

            $("#aso_search_form_anchor button").each(function () {
                $(this).click(function (e) {
                    toggleMain(true);
                });
            });

            $("#aso_search_form_anchor input").keyup(function (e) {
                toggleMain(true);
            });

            // Set IFrame Chats Full Height

            const observer = new MutationObserver(function (mutationList) {
                mutationList.forEach(function (mutation) {
                    if (mutation.type == "attributes" && mutation.target.tagName == "IFRAME" && mutation.target.style?.height && parseInt(mutation.target.style.height) > 100 && mutation.target.style.height != "92.7vh") {
                        $(mutation.target).css("width", "20.83vw");
                        $(mutation.target).css("height", "92.7vh");
                        $(mutation.target).parent().parent().parent().parent().css("width", "21.33vw");
                    }
                });
            });

            observer.observe(document.querySelector(".no"), {
                subtree: true,
                attributes: true
            });

            $(".no").empty();
        }

        function initSidebarFrame() {
            if (!$('[role="list"] [role="listitem"] div').length) { // Stop when not completely loaded
                return;
            }

            //console.log("initFrame(): Run");

            window.clearInterval(intervalSidebarFrame);
            //console.log("initFrame(): Cleared Interval");

            $("#ucc-0").children().each(function () {
                $(this).click(function (e) {
                    window.parent.postMessage({ "toggleMain": true }, "*");
                });
            });

            window.setInterval(() => {
                $('[role="list"] [role="listitem"]').each(function () {
                    if ($(this).attr("jsaction")) {
                        $(this).removeAttr("jsaction");
                        const elem = $(this).find('button[jsaction]').get(0);
                        $(this).find('[role="link"]').children().eq(0).click(function (e) {
                            e.stopPropagation();
                            elem.click();
                        });
                    }
                });
            }, 1000);
        }

        // Start functions
        if (window.location.href.startsWith("https://mail.google.com/chat/u/0/") && window.top == window.self) { // Main Page
            if (! await GM.getValue("reload") || new Date().getTime() - await GM.getValue("reload") > 10 * 1000) { // Must be loaded without Cache otherwise the IFrames will not be injected
                await GM.setValue("reload", new Date().getTime());
                window.setTimeout(() => {
                    $.ajax({
                        url: window.location.href,
                        headers: {
                            "Pragma": "no-cache",
                            "Expires": -1,
                            "Cache-Control": "no-cache"
                        }
                    }).done(function () {
                        window.location.reload(true);
                    });
                }, 500);
            } else {
                await GM.deleteValue("reload");
                intervalMain = window.setInterval(initMain, 500);
            }
        } else if (window.location.href.startsWith("https://chat.google.com/u/0/frame") && window.top != window.self && window.location.href.indexOf("id=world") != -1) {
            intervalSidebarFrame = window.setInterval(initSidebarFrame, 500);
        }
    });
})(window.jQuery.noConflict(true));