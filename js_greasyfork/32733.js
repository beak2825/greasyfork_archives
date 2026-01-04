// ==UserScript==
// @name         RFG.
// @version      0.3
// @description  raid finder for pc
// @author       alice
// @match        http://game.granbluefantasy.jp/
// @namespace https://greasyfork.org/users/151032
// @downloadURL https://update.greasyfork.org/scripts/32733/RFG.user.js
// @updateURL https://update.greasyfork.org/scripts/32733/RFG.meta.js
// ==/UserScript==

const addBox = function () {
    // twitterカード埋め込み.
    let e = document.querySelector("._17dMgAo68TFTGwwXdUO8pF");
    if (!e) {
        e = document.querySelector(".ioihVUfTYy7DQYRGwsVXd");
    }
    e.textContent = null;
    e.innerHTML =
        "<select id='bossSelect' style='margin: 10px;'>" +
        "<option value='903068608514867200'>シュヴァリエ・マグナ Lv75</option>" +
        "<option value='903068859573256192'>セレスト・マグナ Lv75</option>" +
        "<option value='902867027450146818'>フラムグラス Lv100</option>" +
        "<option value='902923432895037440'>マキュラ・マリウス Lv100</option>" +
        "<option value='903069020378677250'>ジ・オーダー・グランデ Lv100</option>" +
        "<option value='903068414758993920'>ユグドラシル・マグナ Lv60</option>" +
        "<option value='903068121384157187'>リヴァイアサン・マグナ Lv60</option>" +
        "<option value='903067045125775361'>コロッサス・マグナ Lv70</option>" +
        "<option value='903066569281912832'>ティアマト・マグナ Lv50</option>" +
        "</select>" +
        "<div id='bossReload' style='margin-top:5px;text-align:right;width:32px;display:inline-block;'><svg version='1.1' id='_x32_' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='width: 16px; height: 16px; opacity: 0.8; vertical-align: bottom;' xml:space='preserve'><style type='text/css'>	.st0{fill:#4B4B4B;}</style><g>	<path class='st0' d='M255.996,0.005C114.615,0.005,0,114.62,0,256c0,141.38,114.615,255.996,255.996,255.996C397.39,511.995,512,397.38,512,256C512,114.62,397.39,0.005,255.996,0.005z M308.86,377.124l-87.064,45.899l1.878-35.924c-23.849-5.799-45.64-18.064-63.186-35.609c-25.489-25.44-39.525-59.346-39.525-95.49c0-18.633,3.746-36.714,11.132-53.741l1.435-3.299l31.959,13.879l-1.426,3.298c-5.466,12.633-8.238,26.047-8.238,39.863c0,26.766,10.422,51.926,29.344,70.84c11.374,11.378,25.261,19.835,40.381,24.625l1.487-28.072l90.876,48.916L308.86,377.124z M379.892,309.733l-1.43,3.298l-31.963-13.879l1.434-3.298c5.461-12.589,8.233-25.994,8.233-39.855c0-26.766-10.422-51.925-29.344-70.848c-11.427-11.387-25.314-19.844-40.38-24.625l-1.488,28.072l-90.95-48.925l9.194-4.816l17.146-9.08l69.852-36.801l-1.877,35.871c23.87,5.842,45.662,18.133,63.184,35.652c25.533,25.538,39.569,59.452,39.526,95.499C391.029,274.668,387.283,292.749,379.892,309.733z' style='fill: rgb(255, 255, 255);'></path></g></svg></div>" +
        "<div id='bossTweet'></div>";
    $("#bossReload").on('click', function() {
        let raidFinderPC = JSON.parse(localStorage.getItem("raidFinderPC") || "{}");
        addTwitter(raidFinderPC.selectedBossId);
    });
    let raidFinderPC = JSON.parse(localStorage.getItem("raidFinderPC") || "{}");
    raidFinderPC.windowOpen = true;
    if (!raidFinderPC.selectedBossId) {
        raidFinderPC.selectedBossId = 903068608514867200;
    }
    $("select#bossSelect").val(raidFinderPC.selectedBossId);
    localStorage.setItem("raidFinderPC", JSON.stringify(raidFinderPC));
    addTwitter(raidFinderPC.selectedBossId);
    $(function() {
        $("select#bossSelect").change(function() {
            let raidFinderPC = JSON.parse(localStorage.getItem("raidFinderPC") || "{}");
            raidFinderPC.selectedBossId = $(this).val();
            localStorage.setItem("raidFinderPC", JSON.stringify(raidFinderPC));
            addTwitter(raidFinderPC.selectedBossId);
        });
    });
};

const addTwitter = function (widgetId) {
    if (document.getElementById("twitter-wjs")) {
        document.getElementById("twitter-wjs").remove();
    }
    // twitterカード埋め込み.
    let e = document.querySelector("#bossTweet");
    e.innerHTML = '<a class="twitter-timeline" href="https://twitter.com/" data-chrome="noheader nofooter" data-widget-id="' + widgetId + '"></a>';
    twttr.widgets.load();
};

(function() {
    'use strict';

    const finder = document.createElement("li");
    const child = document.createElement("span");
    const img = document.createElement("img");
    img.setAttribute("src", "http://icooon-mono.com/i/icon_10826/icon_108260.svg");
    img.setAttribute("width", "20px");
    child.appendChild(img);
    finder.appendChild(child);
    finder.setAttribute("data-menubar-sidebutton", "Finder");
    finder.setAttribute("class", "BH29UqMRA7nnSLfpZ1Yxk");
    finder.onclick = function () {
        let raidFinderPC = JSON.parse(localStorage.getItem("raidFinderPC") || "{}");
        // 開閉.
        const prev = document.querySelector("._2F2WtUWGF4xxBolvuHkKj5");
        if (prev) {
            prev.classList.remove("_2F2WtUWGF4xxBolvuHkKj5");
        }
        const b = document.querySelector("._3MiWO7UtNqe57Tl--52i9w");
        let ml = b.style.marginLeft;
        if (ml === "0px" && !prev) {
            raidFinderPC.windowOpen = false;
            ml = "-270px";
        } else {
            raidFinderPC.windowOpen = true;
            ml = "0px";
            addBox();
        }
        b.style.marginLeft = ml;
        localStorage.setItem("raidFinderPC", JSON.stringify(raidFinderPC));
    };
    window.onload = function () {
        document.querySelector("._180vpDZNW_DakLLTgpbnoB").appendChild(finder);
        // twitter
        $.getScript('https://platform.twitter.com/widgets.js', function(){
            //calling method load
            twttr.ready(function() {
                twttr.events.bind('rendered', function (event) {
                    // 対象ノードを選択
                    let target = event.target.contentDocument.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[3].childNodes[1];
                    const nodes = [].slice.call(target.children);
                    nodes.forEach(function(e) {
                        e.onclick = function() {
                            $(".frm-battle-key")[0].value = e.innerText.match(/参戦ID：.*/)[0].replace("参戦ID：", "");
                            console.log($(".frm-battle-key")[0].value);
                            $(".btn-post-key").trigger("tap");
                        };
                    });
                    if(!target){
                        setTimeout(arguments.callee, 1000);
                        return false;
                    }
                    // オブザーバインスタンスを作成
                    let observer = new MutationObserver(function(mutations) {
                        if(mutations.some(x => x.addedNodes && x.addedNodes instanceof NodeList && x.addedNodes.length > 0 && x.type == 'childList')) {
                            mutations[0].addedNodes.forEach(function(e) {
                                e.onclick = function() {
                                    $(".frm-battle-key")[0].value = e.innerText.match(/参戦ID：.*/)[0].replace("参戦ID：", "");
                                    console.log($(".frm-battle-key")[0].value);
                                    $(".btn-post-key").trigger("tap");
                                };
                            });
                        }
                    });
                    // 対象ノードとオブザーバの設定を渡す
                    observer.observe(target, { childList: true, subtree: true });
                });
            });
        });
        setTimeout(function() {
            let raidFinderPC = JSON.parse(localStorage.getItem("raidFinderPC") || "{}");
            const b = document.querySelector("._3MiWO7UtNqe57Tl--52i9w");
            if (b.style.marginLeft !== "0px") {
                raidFinderPC.windowOpen = false;
                localStorage.setItem("raidFinderPC", JSON.stringify(raidFinderPC));
                return;
            }
            if (raidFinderPC && raidFinderPC.windowOpen) {
                const prev = document.querySelector("._2F2WtUWGF4xxBolvuHkKj5");
                if (prev) {
                    prev.classList.remove("_2F2WtUWGF4xxBolvuHkKj5");
                    document.querySelector("._3MiWO7UtNqe57Tl--52i9w").style.marginLeft = "0px";
                    addBox();
                }
            }
        }, 1000);
    };
})();