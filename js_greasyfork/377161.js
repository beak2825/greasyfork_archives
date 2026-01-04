// ==UserScript==
// @name         巴哈姆特 - 改善留言顯示
// @namespace    -
// @author       LianSheng
// @include      https://forum.gamer.com.tw/C.php*
// @include      https://forum.gamer.com.tw/Co.php*
// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js
// @version      20200428
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @description  改善留言顯示；針對 Co 頁動態更新熱門樓層的留言討論，不用一直手動重新整理。
// @compatible   chrome >= 71
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377161/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E6%94%B9%E5%96%84%E7%95%99%E8%A8%80%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/377161/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E6%94%B9%E5%96%84%E7%95%99%E8%A8%80%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否開啓一鍵對齊留言框
    if(GM_getValue("align") == undefined){ GM_setValue("align", true); }

    // 是否開啓自動對齊新的留言
    if(GM_getValue("latest") == undefined){ GM_setValue("latest", true); }

    // 是否開啓熱門樓層動態更新留言
    if(GM_getValue("autorefresh") == undefined){ GM_setValue("autorefresh", true); }

    // 選項設定預設值
    if(GM_getValue("ar_interval") == undefined){ GM_setValue("ar_interval", 20); }
    if(GM_getValue("ar_auto_down") == undefined){ GM_setValue("ar_auto_down", false); }
    if(GM_getValue("ar_man_down") == undefined){ GM_setValue("ar_man_down", true); }
    if(GM_getValue("ar_effect") == undefined){ GM_setValue("ar_effect", true); }

    // 增加選項：一鍵對齊留言框
    let align_status;
    align_status = GM_getValue("align")? "關閉" : "開啓";
    GM_registerMenuCommand(`${align_status}一鍵對齊（會重新整理）`, function() {
        GM_setValue("align", !GM_getValue("align"));
        location.reload();
    });

    // 增加選項：對齊最新留言（但樓層被推一樣會被算入，暫無打算修正）
    let latest_status;
    latest_status = GM_getValue("latest")? "關閉" : "開啓";
    GM_registerMenuCommand(`${latest_status}對齊最新留言（會重新整理）`, function() {
        GM_setValue("latest", !GM_getValue("latest"));
        location.reload();
    });

    // 增加選項：熱門樓層留言動態更新（可手動立即更新，或是每 XX 秒自動更新一次）
    let auto_refresh_status;
    auto_refresh_status = GM_getValue("autorefresh")? "關閉" : "開啓";
    GM_registerMenuCommand(`${auto_refresh_status}熱門樓層留言動態更新（會重新整理）`, function() {
        GM_setValue("autorefresh", !GM_getValue("autorefresh"));
        location.reload();
    });

    let align = GM_getValue("align");
    let latest = GM_getValue("latest");
    let autorefresh = GM_getValue("autorefresh");

    let css = `
/*原始視窗高度 - navbar1 - navbar2 - 摺疊/收合按鈕 - 留言 - padding-top - padding-bottom - 彈性預留 */
div.commentsopen[id^=Commendlist_] {
max-height: calc(100vh - 35px - 40px - 24px - 54px - 12px - 24px - 4px);
width: 95%; overflow-y: scroll; }

/* 捲軸自定義樣式 - 開始（僅針對 Chrome 系列瀏覽器） */
div.commentsopen[id^=Commendlist_]::-webkit-scrollbar { width: 15px; }
div.commentsopen[id^=Commendlist_]::-webkit-scrollbar-track { background-color: #0006; }
div.commentsopen[id^=Commendlist_]::-webkit-scrollbar-thumb { border: 1px solid #fff8; background-color: #0008; }
div.commentsopen[id^=Commendlist_]::-webkit-scrollbar-button { display: none; }
div.commentsopen[id^=Commendlist_]::-webkit-scrollbar-corner { background-color: black; }
`;
    //調整留言區顏色
    let css_align = `
div.c-post__footer:hover { box-shadow: inset 0px 12px 8px -8px #f003, inset 0px -24px 16px -8px #f003; }`;

    // 展開更多留言
    document.querySelectorAll(".more-reply").forEach(function(element) {
        element.addEventListener("click", function(e){
            this.parentElement.nextElementSibling.classList.add('commentsopen');
        })
    });

    // 收合留言
    document.querySelectorAll(".hide-reply").forEach(function(element) {
        element.addEventListener("click", function(e){
            this.parentElement.nextElementSibling.classList.remove('commentsopen');
        })
    })

    addStyle(css);

    // 針對 Co 頁對齊特定留言
    if(location.hash.match(/comment[0-9]+/) != null){
        document.querySelector(".hide-reply").click();
        document.querySelector(".more-reply").click();

        // 特定留言自動定位
        let id = location.hash.match(/comment([0-9]+)/)[1];
        setTimeout(function(){
            let list_y = document.querySelector("div.commentsopen[id^=Commendlist_]").offsetTop;

            // 進入頁面的自動下滾確定無解。
            window.scrollTo(0, list_y - 18);

            let inner_y = document.querySelector(`div#Commendcontent_${id}`).offsetTop - list_y;
            document.querySelector("div.commentsopen[id^=Commendlist_]").scrollTo(0, inner_y);
            document.querySelector(`div#Commendcontent_${id}`).style.cssText = "animation: 5s ease 0s 1 normal none running highlight-comment;";
        }, 1000);
    }
    // 針對 Co 頁對齊最新留言
    else if(latest && location.href.match(/Co.php\?bsn=\d+&sn=\d+$/) != null) {
        setTimeout(function(){
            let list_y = document.querySelector("div[id^=Commendlist_]").offsetTop;
            window.scrollTo(0, list_y - 18);
            document.querySelector("div[id^=Commendlist_]").lastElementChild.style.cssText = "animation: 3s ease 0s 1 normal none running highlight-comment;";
        }, 100);
    }

    if(align){
        // 留言區點擊自動對齊
        document.querySelectorAll("div.c-post__footer.c-reply").forEach(function(element) {
            element.addEventListener("click", function(e){
                if(e.target.getAttribute("class") == "c-post__footer c-reply") {
                    let moveRangeY = this.getBoundingClientRect().top;
                    /* 扣除 navbar1, navbar2 */
                    window.scrollBy(0, moveRangeY-35-40);
                }
            })
        })

        addStyle(css_align);
    }

    // 僅針對 Co 頁面。（請專心在該樓層聊天吧~）
    // 考量到大型討論串數量可能相當可觀，故不支援留言編輯的更新。（只動新留言，舊留言有沒有更新不會判斷，就這樣 :P）
    // 針對特定熱門樓層自動更新留言而不必頻繁地手動重新整理網頁
    if(autorefresh && location.href.match(/Co.php\?bsn=\d+&sn=\d+(?:$|.+$)/) != null){
        let temp = location.href.match(/Co.php\?bsn=(\d+)&sn=(\d+)(?:$|.+$)/);
        let bsn = temp[1];
        let sn = temp[2];

        // 額外按鈕與更新時間
        addStyleLink("https://use.fontawesome.com/releases/v5.7.0/css/all.css");
        let ar_icon = `<a id="tm_auto_refresh" data-title="預設文字" title="左鍵點擊立即更新；中鍵點擊切換自動更新\n自動更新與手動更新不會衝突"><i class="fas fa-sync-alt"></i></a>`;
        let ar_datetime = `<div id="tm_auto_refresh_time" class="updated_highlight"></div>`;
        let ar_morelist = `
<div id="tm_auto_refresh_morelist">
  <div id="tm_list1"><div>選項設定</div></div>
</div>
`;
        let ar_css = `
a#tm_auto_refresh { display: inline-block; width: 24px; font-size: 18px; color: #bbb; cursor: pointer; width: max-content; height: max-content;}
a#tm_auto_refresh.now_auto_refresh { color: #7b7; }
a#tm_auto_refresh:hover { color: #f77; }
a#tm_auto_refresh:active { color: #77f; }

div#tm_auto_refresh_morelist { display: inline-block; width: 100px; font-size: 20px; color: #fff9; background-color: #333; position: relative; left: 550px; bottom: 65px; vertical-align: middle; user-select: none; border: 2px solid #777; border-radius: 10px; display: none;}
div[id^=tm_list] { margin: auto; padding: 4px; width: 90%; text-align: center; }
div[id^=tm_list] > div:hover { color: #fff; cursor: pointer;}

div#tm_auto_refresh_time { display: block; position: absolute; right: 40px; top: 50px; user-select: none; font-family: Courier New; }
div#tm_auto_refresh_time.updated_highlight { animation: 3s ease 0s 1 normal none running highlight-comment; }

`;
        // 設定的浮框，未來可能不只用來設定自動更新留言這個功能。
        let ar_setting = `
<div id="tm_setting_interface">
  <div id="tm_si_title">選項設定</div>
  <div id="tm_si_close">X</div>
  <div id="tm_si_content">
    <table id="tm_si_table"><tbody>
      <tr><td>手動更新同時置底<br>（預設開啓）</td>
          <td><label class="container"><input id="tm_si_mandown" type="checkbox" ${GM_getValue("ar_man_down")? 'checked="checked"' : ''}><span class="checkmark"></span></label></td></tr>
      <tr><td>自動更新同時置底<br>（預設關閉）</td>
          <td><label class="container"><input id="tm_si_autodown" type="checkbox" ${GM_getValue("ar_auto_down")? 'checked="checked"' : ''}><span class="checkmark"></span></label></td></tr>
      <tr><td>更新訊息時置底效果<br>（預設開啓）</td>
          <td><label class="container"><input id="tm_si_effect" type="checkbox" ${GM_getValue("ar_effect")? 'checked="checked"' : ''}><span class="checkmark"></span></label></td></tr>
      <tr><td>自動更新間隔（秒）<br><span style="color: #faa; font-size: 12px"><del>真的有這麼多留言需要每 15 秒更新一次嗎？</del></span></td>
          <td><input id="tm_si_range" type="range" min="15" max="60" value="${GM_getValue("ar_interval")}" class="tm_si_slider">
  <span id="tm_si_range_now">${GM_getValue("ar_interval")}</span></td></tr>
      <tr><td colspan="2" id="tm_si_hint">提示：這裡所有操作會立即存檔，設定後右上角關閉即可</td></tr>
    </tbody></table>
  </div>
</div>
`;
        let ar_setting_css = `
div#tm_setting_interface { margin: auto; position: fixed; width: 60vw; height: 60vh; top: 20vh; left: 20vw; z-index: 1000000; background-color: #111a; color: #dddd; font-size: 18px; padding: 4px; border: 5px solid #111c; border-radius: 10px; user-select: none; display: none; }
div#tm_si_title { margin: auto; position: fixed; width: 60vw; height: 3vh; top: 20vh; left: 20vw; z-index: 1000001; background-color: #111; color: #dddd; padding: 9px 4px 4px 4px; border: 5px solid #111c; border-radius: 10px; text-align: center; font-size: 20px; font-weight: bold; user-select: none; }
div#tm_si_close { margin: auto; position: fixed; width: 3vh; height: 3vh; top: 21.5vh; right: 18vw; z-index: 1000002; background-color: #b00; color: #fff; border: 1px solid #111c; border-radius: 3vh; text-align: center; font-size: 14px; font-weight: bold; user-select: none; cursor: pointer; }
div#tm_si_close:hover { background-color: #f00; }
div#tm_si_content { margin: auto; position: fixed; width: 60vw; height: 52vh; top: 28vh; left: 20vw; z-index: 1000000; font-size: 18px; padding: 4px; border: 5px solid #1110; }
table#tm_si_table { width: 100%; height: 100%; }
table#tm_si_table tr { height: 20%; }
table#tm_si_table td:first-child { text-align: center; line-height: 120%; }
.tm_si_slider { -webkit-appearance: none; width: 80%; height: 15px; border-radius: 5px; background: #d3d3d3; outline: none;}
.tm_si_slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 25px; height: 25px; border-radius: 50%; background: #4CAF50; cursor: pointer; }
.tm_si_slider::-moz-range-thumb { width: 25px; height: 25px; border-radius: 50%; background: #4CAF50; cursor: pointer; }

.container { display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; font-size: 22px; -webkit-user-select: none; -moz-user-select: none; user-select: none;}
.container input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;}
.checkmark { position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee;}
.container:hover input ~ .checkmark { background-color: #ccc;}
.container input:checked ~ .checkmark { background-color: #29f;}
.checkmark:after { content: ""; position: absolute; display: none;}
.container input:checked ~ .checkmark:after { display: block;}
.container .checkmark:after { left: 9px; top: 5px; width: 5px; height: 10px; border: solid white; border-width: 0 3px 3px 0; -webkit-transform: rotate(45deg); transform: rotate(45deg);}

td#tm_si_hint { color: #f77; font-size: bold; }
`;

        addHTML(ar_icon, "div.comment_icon", "afterbegin");
        addHTML(ar_morelist, "div.c-reply__editor");
        addHTML(ar_datetime, "div.c-reply__editor");
        addStyle(ar_css, "div.reply-input");

        // 設定界面
        addHTML(ar_setting);
        addStyle(ar_setting_css);

        // 設定選項自動儲存
        let save_hint = document.querySelector("td#tm_si_hint");
        // 修改自動更新時間
        document.querySelector("input#tm_si_range").addEventListener("input", function(){
            let set_value = this.value;
            document.querySelector("span#tm_si_range_now").innerText = set_value;
            GM_setValue("ar_interval", parseInt(set_value));
            save_hint.style.cssText = "";
            setTimeout(function(){
                save_hint.innerText = `已將自動更新間隔設定爲 ${GM_getValue("ar_interval")} 秒，重新整理後會生效。`;
                save_hint.style.cssText = "animation: 0.2s ease 0s 1 normal none running highlight-comment;";
            }, 50);
        });

        // 手動更新時是否置底
        document.querySelector("input#tm_si_mandown").addEventListener("input", function(){
            let set_value = this.checked;
            GM_setValue("ar_man_down", set_value);
            let temp = set_value? "開啓" : "關閉";
            save_hint.style.cssText = "";
            setTimeout(function(){
                save_hint.innerText = `手動更新置底功能已${temp}，重新整理後會生效。`;
                save_hint.style.cssText = "animation: 0.2s ease 0s 1 normal none running highlight-comment;";
            }, 50);
        });

        // 自動更新時是否置底
        document.querySelector("input#tm_si_autodown").addEventListener("input", function(){
            let set_value = this.checked;
            GM_setValue("ar_auto_down", set_value);
            let temp = set_value? "開啓" : "關閉";
            save_hint.style.cssText = "";
            setTimeout(function(){
                save_hint.innerText = `自動更新置底功能已${temp}，重新整理後會生效。`;
                save_hint.style.cssText = "animation: 0.2s ease 0s 1 normal none running highlight-comment;";
            }, 50);
        });

        // 更新時是否顯示效果
        document.querySelector("input#tm_si_effect").addEventListener("input", function(){
            let set_value = this.checked;
            GM_setValue("ar_effect", set_value);
            let temp = set_value? "開啓" : "關閉";
            save_hint.style.cssText = "";
            setTimeout(function(){
                save_hint.innerText = `更新訊息的效果已${temp}，重新整理後會生效。`;
                save_hint.style.cssText = "animation: 0.2s ease 0s 1 normal none running highlight-comment;";
            }, 50);
        });

        // 關閉選項設定
        document.querySelector("div#tm_si_close").addEventListener("click", function(){
            document.querySelector("div#tm_setting_interface").style.display = "none";
        });

        // 進入頁面時就會顯示最後更新時間
        latest_update();

        // 微調原生界面
        document.querySelector("textarea").style.cssText = "width: calc(100% - 36px)";

        // 自動更新留言按鈕的滑鼠事件控制
        let last_update = 0;
        document.querySelector("#tm_auto_refresh").addEventListener("mousedown", function(e) {
            // 0: 左，手動更新
            // 1: 中，切換自動更新
            // 2: 右，其他選單
            let type = e.button;

            if(type == 0){
                let click_time = Date.now();
                // 手動更新至少隔 5 秒
                if(click_time - last_update < 5000){
                    alert("你在著急什麼啦？");
                    return;
                } else {
                    last_update = click_time;
                    check_data();
                    latest_update();

                    // 手動更新時自動下滾至最末端
                    setTimeout(function(){
                        // 有些時候留言少會找不到指定物件
                        try{
                            if(GM_getValue("ar_man_down")){
                                document.querySelector("div.commentsopen[id^=Commendlist_]").scrollTo(0, 999999);
                                // 針對可能有 lazyload 圖片讀取導致對齊失誤
                                setTimeout(function(){
                                    document.querySelector("div.commentsopen[id^=Commendlist_]").scrollTo(0, 999999);
                                }, 300);
                            }
                        } catch(e) {}
                    }, 500);
                }
            } else if(type == 1){
                e.target.parentElement.classList.toggle("now_auto_refresh");
            } else if(type == 2) {
                let list = document.querySelector("div#tm_auto_refresh_morelist");
                list.style.display = "block";
            }
        });

        // 隱藏選單
        document.querySelector(":not(#tm_auto_refresh_morelist)").addEventListener("click", function(){
            if(document.querySelector("div#tm_auto_refresh_morelist").style.display == "block") {
                document.querySelector("div#tm_auto_refresh_morelist").style.display = "none";
            }
        });

        // 選單：選項設定
        document.querySelector("div#tm_list1").addEventListener("click", function(){
            document.querySelector("div#tm_setting_interface").style.display = "block";
        });

        // 取消原生右鍵選單
        document.querySelector("#tm_auto_refresh").addEventListener("contextmenu", function(e) {
            e.preventDefault();
        });

        // 懶的做循環設定與銷毀，乾脆讓它一直跑，只是要判斷目前是否爲自動更新
        setInterval(function(){
            if(document.querySelector(".now_auto_refresh") != null){
                check_data();
                latest_update();
            }
        }, parseInt(GM_getValue("ar_interval"))*1000);

        // 更新「最後更新時間」
        function latest_update(){
            let dt = new Date;
            let str = `最後更新時間: ${dt.getMonth()+1<10 ? "0" + parseInt(dt.getMonth()+1) : dt.getMonth()+1}/${dt.getDate()<10 ? "0" + dt.getDate() : dt.getDate()} ${dt.getHours()<10 ? "0" + dt.getHours() : dt.getHours()}:${dt.getMinutes()<10 ? "0" + dt.getMinutes() : dt.getMinutes()}:${dt.getSeconds()<10 ? "0" + dt.getSeconds() : dt.getSeconds()}`;
            document.querySelector("#tm_auto_refresh_time").innerText = str;
            document.querySelector("#tm_auto_refresh_time").classList.toggle("updated_highlight");

            // 必須延遲，否則瀏覽器不會渲染 CSS
            setTimeout(function(){
                document.querySelector("#tm_auto_refresh_time").classList.toggle("updated_highlight");
            }, 50);
        }

        // 確認留言筆數是否一致（不一致則執行動態更新）
        function check_data(){
            console.log(`[${Date.now()}] check_data`);
            fetch(`https://forum.gamer.com.tw/ajax/moreCommend.php?bsn=${bsn}&snB=${sn}`)
                .then(function(response) {
                return response.json();
            })
                .then(function(resp_obj) {
                try {
                    if(document.querySelector(".more-reply").style.display != "none"){
                        document.querySelector(".more-reply").click();
                    }
                    if(GM_getValue("ar_auto_down")){
                        setTimeout(function(){
                            document.querySelector("div.commentsopen[id^=Commendlist_]").scrollTo(0, 999999);
                            // 針對可能有 lazyload 圖片讀取導致對齊失誤
                            setTimeout(function(){
                                document.querySelector("div.commentsopen[id^=Commendlist_]").scrollTo(0, 999999);
                            }, 300);
                        }, 500);
                    }
                } catch(e){
                    console.log(`[${Date.now()}] fetch > try:\n${e}`);
                }

                let delta = (Object.keys(resp_obj).length - 1) - document.querySelector(`#Commendlist_${sn}`).childElementCount;
                if(delta > 0){
                    for(let i=delta-1; i>=0; i--){
                        dynamic_append_comment(resp_obj[i]);
                    }
                }
            });
        }

        // 動態更新留言
        function dynamic_append_comment(comment_obj){
            let comment_origin = comment_obj["comment"];
            let comment_real;

            // 若存在提及其他勇者/\[.+?:.+?\]/g
            if(comment_origin.match(/\[.+?:.+?\]/g) != null){
                // 取得所有提及的其他勇者
                let mentions = comment_origin.match(/\[.+?:.+?\]/g);

                for(let i=0; i<mentions.length; i++){
                    // 刪除無關符號、去掉空字串的陣列元素
                    let temp_array = mentions[i].split(/[\[\]:]/).filter(function(e){return e});
                    let mid = temp_array[0];
                    let mnick = temp_array[1];
                    comment_origin = comment_origin.replace(mentions[i], `<a target="_blank" href="https://home.gamer.com.tw/${mid}">${mnick}</a>`);
                    comment_real = comment_origin;
                }
            } else {
                comment_real = comment_origin;
            }

            comment_origin = comment_real;

            // 若存在圖片連結
            if(comment_origin.match(/https:\/\/.+?\.(jpg|JPG|png|PNG|gif|GIF|jpeg|JPEG)/g) != null){
                // 取得所有圖片連結
                let links = comment_origin.match(/https:\/\/.+?\.(jpg|JPG|png|PNG|gif|GIF|jpeg|JPEG)/g);

                for(let i=0; i<links.length; i++){
                    let link = links[i];
                    comment_origin = comment_origin.replace(link, `<a class="photoswipe-image" target="_blank" href="${link}"><img class=" lazyloaded" data-src="${link}" src="${link}"></a>`);
                }
            } else {
                comment_real = comment_origin;
            }

            comment_real = comment_origin;

            let append_comment = `
<div class="c-reply__item" id="Commendcontent_${comment_obj["sn"]}"
    data-comment='{"bsn":${comment_obj["bsn"]},"snB":${comment_obj["snB"]},"sn":${comment_obj["sn"]},"isLogin":true,"deletable":true,"editable":true,"content":"${comment_obj["content"]}"}''>
    <div>
        <!-- （更多選項，留言右側三點）因爲不知如何解，乾脆直接讓它消失 -->
        <!--<button type="button" class="more tippy-reply-menu" data-tooltipped="" aria-describedby="tippy-tooltip-22">
            <i class="material-icons"></i>
        </button>-->
        <a class="reply-avatar user--sm" href="//home.gamer.com.tw/${comment_obj["userid"]}" target="_blank"><img
                class="gamercard lazyloaded"
                data-src="https://avatar2.bahamut.com.tw/avataruserpic/${comment_obj["userid"].toLowerCase().slice(0, 1)}/${comment_obj["userid"].toLowerCase().slice(1, 2)}/${comment_obj["userid"].toLowerCase()}/${comment_obj["userid"].toLowerCase()}_s.png"
                data-gamercard-userid="${comment_obj["userid"]}" data-tooltipped="" aria-describedby="tippy-tooltip-24"
                src="https://avatar2.bahamut.com.tw/avataruserpic/${comment_obj["userid"].toLowerCase().slice(0, 1)}/${comment_obj["userid"].toLowerCase().slice(1, 2)}/${comment_obj["userid"].toLowerCase()}/${comment_obj["userid"].toLowerCase()}_s.png"></a>
        <div class="reply-content">
            <a class="reply-content__user" href="//home.gamer.com.tw/${comment_obj["userid"]}" target="_blank">${comment_obj["nick"]}</a>
            <article class="reply-content__article c-article "><span data-formatted="yes">${comment_real}</span></article>
            <div class="reply-content__footer">
                <div class="edittime" data-tooltipped="" aria-describedby="tippy-tooltip-23"
                    data-original-title="留言時間 ${comment_obj["wtime"]}">${comment_obj["time"]}</div>
                <div class="buttonbar">
                    <button type="button" onclick="Forum.C.commentGp(this);" class="gp" title="推一個！"><i
                            class="material-icons"></i></button>
                    <a data-gp="0" href="javascript:;" class="gp-count"></a>
                    <button type="button" onclick="Forum.C.commentBp(this);" class="bp" title="我要噓…"><i
                            class="material-icons"></i></button>
                    <a data-bp="0" href="javascript:;" class="bp-count"></a>
                    <button class="tag" type="button"
                        onclick="Forum.C.tagUser(${sn}, '${comment_obj["userid"]}', '${comment_obj["nick"]}');">回覆</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;
            addHTML(append_comment, `#Commendlist_${sn}`);
            // 若啓動更新訊息效果
            if(GM_getValue("ar_effect")){
                console.log(comment_obj["sn"]);
                setTimeout(function(){
                    document.querySelector(`div#Commendcontent_${comment_obj["sn"]}`).style.cssText = "animation: 3s ease 0s 1 normal none running highlight-comment;";
                }, 300);
            }
        }
    }
})();