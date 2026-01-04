// ==UserScript==
// @name fxstention
// @namespace http://tampermonkey.net/
// @version 3.54
// @description usefull features for fxp!
// @author כלבלב חמוד
// @license MIT
// @match https://www.fxp.co.il/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/476816/fxstention.user.js
// @updateURL https://update.greasyfork.org/scripts/476816/fxstention.meta.js
// ==/UserScript==
let selectFile = (contentType, multiple) => {
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.accept = contentType;
        input.onchange = _ => {
            let files = Array.from(input.files);
            if (multiple)
                resolve(files);
            else
                resolve(files[0]);
        };

        input.click();
    });
}


let usertitle = `מתכנת, מפתח fxstention, יוצר מילקי זל וראש הגאנג לשעבר`;
let popup_sound_code = "popup_sound_fxstention";
class Fxstention {
    constructor() { }
    general() {
        let observer = new window.MutationObserver(() => {
            Array.from(document.querySelectorAll(".user_nick_s1"))
                .filter(element => element.innerHTML === "כלבלב חמוד")
                .forEach(element => {
                element.classList.remove("user_nick_s1");
                element.classList.add("techuser");
                const closestAncestor = element.closest(".username_container, .profile, .posthead, #userinfo");
                if (closestAncestor) {
                    closestAncestor.querySelectorAll(".usertitle, .user_title").forEach(title => {
                        title.textContent = "";
                        let span = document.createElement("span");
                        span.classList.add("tih");
                        span.classList.add("mf");
                        span.textContent=usertitle;
                        title.append(span);
                    });
                }
            });
            document.querySelectorAll("#fxp-footer-ads-feed, .tbl-next-up, .top-ba, [id*='taboola'], [class*='taboola'], [src*='taboola'], [data*='taboola']").forEach((element) => {
                element.remove();
            });

console.log(Array.from(elements)); // Array of matching elements
        })
        observer.observe(document, {
            childList: true,
            subtree: true,
        })
        localStorage.getItem(popup_sound_code) || localStorage.setItem(popup_sound_code, "https://images4.fxp.co.il/nodejs/sound.mp3");
        window.addEventListener("DOMContentLoaded", () => {
            if (typeof getHistoryEmojiElement != "undefined") getHistoryEmojiElement = () => {
                let div_history = '';
                for (var i = history_Emoji_Array.length - 1; i >= 0; i--) {
                    if (history_Emoji_Array[i][3] === 'smileys') {
                        if (smileys_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="smileys"  class="normal_emoji emojione emojione-32-people _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'animals') {
                        if (animals_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="animals"  class="normal_emoji emojione emojione-32-nature _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'food_drink') {
                        if (food_drink_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="food_drink"  class="normal_emoji emojione emojione-32-food _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'activity') {
                        if (activity_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="activity"  class="normal_emoji emojione emojione-32-activity _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'travel_places') {
                        if (travel_places_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="travel_places"  class="normal_emoji emojione emojione-32-travel _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'objects') {
                        if (objects_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="objects"  class="normal_emoji emojione emojione-32-objects _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'symbols') {
                        if (symbols_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="symbols"  class="normal_emoji emojione emojione-32-symbols _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'flags') {
                        if (flags_Emoji_Array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span data-emj-id="' + history_Emoji_Array[i][0] + '" category="flags"  class="normal_emoji emojione emojione-32-flags _' + history_Emoji_Array[i][0] + '"></span>';
                        }
                    } else if (history_Emoji_Array[i][3] === 'fxp') {
                        if (fxp_Emoji_filename_array.includes(history_Emoji_Array[i][0])) {
                            div_history += '<span class="fxp_emoji"><img src="https://images4.fxp.co.il/smilies2/' + history_Emoji_Array[i][0] + '" class="sm"></span>';
                        }
                    }
                    else div_history += '<span class="fxp_emoji"><img src="' + history_Emoji_Array[i][0] + '" class="sm"></span>';
                }
                return div_history;
            }
            $("#yui-gen2").append(`<div class="fxp2020_row"><div class="setlinks"><a href="profile.php?do=fxstention">הגדרות fxtention</a></div></div>`);
            $(`<li id="fxstention_settings"><span style="position: relative;float: right;clear: left;top: 8px;padding-right: 3px;"><img src="//static.fcdn.co.il/mobile/svg2/set.svg" border="0" style="height: 25px;"></span><a style="font-size:11px; padding-right: 35px;" href="profile.php?do=fxstention">הגדרות fxstention<p style="font-size: 10px;">שינוי רקע בהודעות פרטיות, שינוי צליל התראה וניקוי היסטוריית אימוגים</p></a></li>`).insertAfter("#edit_settings")
            if (typeof send_sound_to_user != "undefined") send_sound_to_user = () => { };
            let events = ["newreply", "new_like", typeof send_sound_to_user == undefined ? "newpmonhomepage" : document.URL.includes("private_chat") ? "" : "newpm"];
            for (let event of events) {
                socket.on(event, () => {
                    if (document.cookie.includes('bbc_notisound=0')) {
                        var audio = {};
                        audio["newlive"] = new Audio();
                        audio["newlive"].src = localStorage.getItem(popup_sound_code);
                        audio["newlive"].play();
                    }
                })
            }
        });
    }
    showthread() {
        window.addEventListener("load", () => {
            if (typeof ISMOBILEFXP != "undefined") {
                let savedData = JSON.parse(localStorage.getItem("backups")) || {};
                let lastText;
                if (!$(`#restore_popup`)[0] && savedData[THREAD_ID_FXP]) {
                    $(".wysibb-text").append(`<div id="restore_popup"><button style="
background: #0e5ba7;
color: white;
font-size: xx-small;
" id="restore">שחזר טיוטה שמורה</button></div>`)
                }
                setInterval(() => {
                    lastText = $(".wysibb-text-editor").html().replace(/<span><\/span>/g, "");
                    if (lastText) savedData[THREAD_ID_FXP] = lastText;
                    localStorage.setItem("backups", JSON.stringify(savedData));
                }, 60000)
                $("#restore").click(() => {
                    $(".wysibb-text-editor").html(savedData[THREAD_ID_FXP]);
                    $("#restore_popup").remove()
                })
                $("#qr_submit").click(() => {
                    localStorage.setItem("backups", "{}");
                })
            }


            $(`<span class="cke_separator" role="separator"></span><span class="cke_button" id="song"><a href="javascript:void" title="העלה שיר"><span style="display: -webkit-inline-box;font-weight: bold;">העלאת שיר</span></a></span><span class="cke_separator" role="separator"></span>`).insertBefore("#cke_20 > span.cke_toolgroup > span:nth-child(5)")
            $("#cke_18 .cke_toolgroup").append(`<span id="spoiler" class="cke_button"><a title="תגי spoiler" href="javascript:void;">S</a></span>`);
            $(`<div class="wysibb-toolbar-btn" bis_skin_checked="1" style="text-align: -webkit-center;" id="song_mobile"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" style="
min-block-size: -webkit-fill-available;
padding-right: 3px;
padding-top: 3px;
padding-left: 3px;
padding-bottom: 3px;
"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"></path></svg></div>`).insertAfter('.wbb-smilebox:not(.wbb-gifbox)')

            $("#spoiler").click(() => vB_Editor['vB_Editor_QR'].editor.document.getBody()['$'].innerText += '[spoiler][/spoiler]')
            $("#song, #song_mobile").click(async () => {
                if (!confirm("נא  לזכור שאי אפשר להעלות שירים בפורמט שהוא לא .webm או ששוקלים יותר מ 10MB")) return;
                var audioBase64String;
                let reader = new FileReader();
                let file = await selectFile(".webm", false);
                reader.readAsDataURL(file);
                reader.onload = async function (event) {
                    audioBase64String = reader.result;
                    insertInfoRecord(300, audioBase64String);
                }
            })

            var lastActive;
            let fast = document.getElementById("input-textarea");
            $("div.smiley.chat-el").click(() => {
                lastActive = fast;
            })
            if (document.querySelector("#cke_19")) {
                document.querySelector("#cke_19").onclick = () => {
                    vB_Editor["vB_Editor_QR"].editor.document.removeAllListeners();
                    $(".send-element").hide();
                    $(".chat-text-input").css("display", "block")
                    lastActive = vB_Editor["vB_Editor_QR"].editor.document.getBody()["$"];
                    document.querySelector("#input-textarea").click();
                    openAndCloseEmojiKeyboard();
                };
                let insert = emoji_modal.insertText;
                emoji_modal.insertText = (emoji, id_el) => {
                    if (lastActive.id == id_el) insert(emoji, id_el);
                    else lastActive.innerHTML += emoji;
                }
            }
            $("body").append(`<style>.lazy:hover, img[alt=""]:hover{opacity:0.6;}</style>`);
            var selector = ".postbody img"
            let emojable = $(selector);
            emojable.click((e) => {
                if (confirm("להוסיף את זה כאימוגי?")) insertEmojiHistory(`<span data-emj-id="${e.target.src}" category="fxstention"></span>`)
            })
            $(document).ready($(`<a href="https://www.fxp.co.il/newthread.php?do=newthread&f=18&support=fxstention" class="newcontent_textcontrol" id="fxstention_top">תמוך בהרחבה!!</a>`).insertAfter("#newreplylink_top").css("margin-right", "6px"))
        })
    }
    private_chat() {
        document.addEventListener("DOMContentLoaded", () => {
            if (user_id_of_pm_sender == "1288469") text_of_user_title = usertitle;
            updateAndSaveSelectedColor = (color) => {
                if (!color) return;
                if (typeof isLocalStorageNameSupportedMobile === "function") {
                    if (isLocalStorageNameSupportedMobile() == false) {
                        return;
                    }
                }
                let body = $('body');
                body.css('background', color);
                body.css('background-size', "cover");
                body.css('background-repeat', "no-repeat");
                body.css('background-position', "center");
                body.css('background-attachment', "fixed");
                localStorage.setItem("chat-color", color);
            }
            loadChatBackgroundColorWhenPageLoad = () => {
                if (localStorage.getItem("chat-color") != null) {
                    var color = localStorage.getItem("chat-color");
                    let body = $('body');
                    body.css('background', color);
                    body.css('background-size', "cover");
                    body.css('background-repeat', "no-repeat");
                    body.css('background-position', "center");
                    body.css('background-attachment', "fixed");
                    $('div[style*="background-color:"]').css('background-color', "");
                } else {
                    var css_color = '#0568ab';
                    $('body').css('background', css_color);
                }
            }
            loadChatBackgroundColorWhenPageLoad()
            let choose = $('#cp-color-picker');
            $("#cp-color-picker").click(() => {
                if ($(".color-picker-box-is-up")[0]) return;
                let menu = $(".color-space");
                menu.append(`<div id="pic" class="color-choose" style="background: #def5cd url(https://static.thenounproject.com/png/4818782-200.png);background-size: cover;"></div>`)
                $("#pic").click(() => {
                    let color = prompt("תוסיף את ה CSS או את הקישור לתמונת רקע שאתה רוצה", "red")
                    if (color.startsWith("https://")) updateAndSaveSelectedColor(`url('${color}')`);
                    else updateAndSaveSelectedColor(color);
                })
            })
        })
    }
    newthread() {
        window.addEventListener("load", () => {
            if (document.URL.includes("support=fxstention")) {
                let message = `שלום :)<\/br>
רציתי להביע הערכה כלפי ההרחבה של  [taguser]1288469[\/taguser] לאתר בשם fxstention. אני חושב שהיא מוסיפה המון לאתר, כמו אימוג'ים מותאמים אישית ורקעים מותאמים אישית בצ'אט הפרטי. אשמח אם תשקלו לשלב את התוסף כחלק מן האתר עצמו, או לתת הכרה בהרחבה כמו שנתתם ל fxpplus. אני מאמין שלקהילה יש הרבה מה לתרום לאתר, והם רוצים לתרום לאתר, אתם רק צריכים להסכים לקבל כדי שכולנו נהיה מאושרים
אם אתם רוצים לבדוק את ההרחבה ניתן לראות אותה פה:
</br></br>
https://greasyfork.org/he/scripts/476816-fxstention?locale_override=1
</br></br>
מקווה שהמשוב יקדם שינוי חיובי באתר :flowers:`;
                $("#prefixfield").val("msh").change();
                $("#subject").val("fxstention").change();
                vB_Editor["vB_Editor_001"].editor.document.getBody()["$"].innerHTML = message;
            }
        }
        )
    }
    profile() {
        if (!document.URL.includes("do=fxstention")) return;
        let html = `<html dir="rtl" lang="he"><head>
<title>הגדרות fxstention</title>
<script src="https://static.fcdn.co.il/dyn/projects/js/desktop/set.js?v=7.8"></script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<base href="https://www.fxp.co.il/">
<link rel="stylesheet" href="https://static.fcdn.co.il/dyn/projects/css/desktop/mainfxp.css?v0.21=4120.518"><link rel="stylesheet" href="https://static.fcdn.co.il/dyn/projects/css/desktop/components/fxp_buttons.css?v0.05=4120.518"><link rel="stylesheet" href="https://static.fcdn.co.il/dyn/projects/css/desktop/header_2020.css?v1.31=4120.518">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.js"></script></head>
<body dir="rtl" style="all:unset">

<div style="width:100%; text-align:center">
<a href="https://www.fxp.co.il" title="fxp"><img src="https://i.imagesup.co/images2/0__05b24d5df47b94.jpg" width="156" height="162" alt="fxp" border="0"></a>
<div style="padding:0px 20px 0px 20px; font-family: arial; font-size: 16px">
<br>

<lable>קישור לשמע שתרצו שיקפוץ כאשר אתם מקבלים הודעה חדשה</lable>
<br><br><input id="${popup_sound_code}" type="text" placeholder="קישור לשמע" class="primary textbox" style="
margin-bottom: 5px;
"><input type="hidden" id="hidden_data"><br><button id="file" class="button">שיר מקובץ</button><button class="button" id="play">השמע</button> <br>
<div style="
margin-top: 10px;
">
<label>שמע פעיל:</label>
<span style="display:inline-block">
<div id="soundnoti" class="onset"></div></span>
</div>
<br><lable>CSS או קישור לתמונה כרקע להודעות פרטיות</lable><br><br><input id="chat-color" type="text" placeholder="CSS או קישור לתמונה" class="primary textbox"><br><br><button id="clear" class="button">נקה היסטוריית אימוג'ים</button><br><br>
<button id="save" class="button">שמור</button>




</div>
</div>
</body></html>`
        document.documentElement.innerHTML = html;
        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        document.cookie.includes("bbc_notisound=0") && document.getElementById("soundnoti").setAttribute("class", "onset ofset");
        document.getElementById("soundnoti").onclick = (e) => {
            let newClass = e.target.getAttribute("class").includes("ofset") ? "onset" : "onset ofset";
            e.target.setAttribute("class", newClass);
            setCookie("bbc_notisound", 0 + (newClass == "onset"), 9000)
        };

        document.getElementById("clear").onclick = () => {
            localStorage.setItem('emojihistory3', null);
            alert("היסטוריית האימוגים נמחקה!");
        }
        document.getElementById("save").onclick = () => {
            Array.from(document.getElementsByTagName("input")).forEach((e) => {
                if (e.type == "hidden") return;
                let value = (e.value.startsWith("https://") && e.id == "chat-color" ? `url('${e.value}')` : document.getElementById("hidden_data").value || e.value);
                e.value && localStorage.setItem(e.id, value);
            })
            alert("ההגדרות נשמרו!");
        }
        document.getElementById("play").onclick = () => {
            let input = document.getElementById(popup_sound_code);
            let data = document.getElementById("hidden_data").value || input.value;
            (new Audio(data)).play();
        }
        document.getElementById("file").onclick = async () => {
            let input = document.getElementById(popup_sound_code);
            let reader = new FileReader();
            let file = await selectFile(true, false);
            reader.readAsDataURL(file);
            reader.onload = async function (event) {
                input.setAttribute("value", file.name);
                document.getElementById("hidden_data").setAttribute("value", reader.result);
            }
        }
        document.getElementById(popup_sound_code).oninput = (e) => {
            document.getElementById("hidden_data").value = null;
        };

    }
}
let fxstention = new Fxstention();
fxstention.general();
let func = /www.fxp.co.il\/(.*?).php/.exec(document.URL)[1];
fxstention[func]();