// ==UserScript==
// @name         customBackground
// @version      0.2
// @description  Set custom chat background
// @author       Phobos
// @match        https://anichat.ru/
// @icon         https://anichat.ru/default_images/icon.png?v=1528136794
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/694598
// @downloadURL https://update.greasyfork.org/scripts/449307/customBackground.user.js
// @updateURL https://update.greasyfork.org/scripts/449307/customBackground.meta.js
// ==/UserScript==
const customBackground = () => {
    const t = {
            url: "https://anichat.ru/default_images/background.jpg",
            opacity: 70,
            theme: "dark"
        },
        e = window.localStorage.getItem("customBackgroundImg");
    let a = JSON.parse(window.localStorage.getItem("customBackgroundOptions")) || t;
    const o = "#chat_logs_container,.background_player,.chat_footer,.chat_head,tr .input_item{color:#e0e0e0!important}@media(min-width:1260px){.user_count,.drop_control,.bustate,.user_lm_data .username.user,.wrap_right_data .panel_bar,.left_item{color:#e0e0e0!important}}",
        n = "#chat_logs_container,.background_player,.chat_footer,.chat_head,tr .input_item{color:#212121!important}@media(min-width:1260px){.user_count,.drop_control,.bustate,.user_lm_data .username.user,.wrap_right_data .panel_bar,.left_item{color:#212121!important}}",
        {
            head: r
        } = document,
        i = document.createElement("style");
    i.type = "text/css", i.id = "customBackgroundStyles", i.appendChild(document.createTextNode("::-webkit-scrollbar{background:rgba(0,0,0,.3)!important}html{background-size:cover;background-repeat:no-repeat;background-position:top}#input_table,#show_chat,.background_chat.chatheight,.chat_footer,.chat_head,.log2,.pheight{background-color:transparent!important}#container_show_chat,.background_player,.list_element,.panel_bar,.pheight{border:0!important}.ui-slider-range-min{background-color:#616161!important}.ui-slider{background-color:#bdbdbd!important}.ui-slider-handle{background-color:#e0e0e0!important}#content,#submit_button{background-color:rgba(0,0,0,.4)!important;border-radius:9rem!important}#content,#submit_button{border:.0625em solid #555!important}#content{padding:0 .9em!important}.sub_menu,#main_emoticon{background-color:rgba(0,0,0,.75)!important}.other_logs.seen{background:rgba(0,0,0,.3)!important}@media (max-width:1260px){.pheight{background-color:rgba(0,0,0,.4)!important}.user_count,.drop_control,.bustate,.user_lm_data .username.user,.wrap_right_data .panel_bar,.left_item{color:#e0e0e0!important}}[disabled]{opacity:.6}"));
    const d = document.createElement("style");
    d.type = "text/css", d.id = "backgroundThemeStyles", d.appendChild(document.createTextNode("dark" === a.theme ? o : n)), r.appendChild(i), r.appendChild(d), document.body.style.setProperty("background", `rgba(0, 0, 0, ${a.opacity/100}`, "important"), document.documentElement.style.setProperty("background-image", `url(${a.url||e})`, "important"), document.getElementById("chat_left_menu").innerHTML += '<div class="list_element left_item"><div id="customBack" class="left_item_in"><i id="customBackIcon" class="fa fa-tint menui"></i> Фон чата</div></div>';
    let l = "",
        c = "",
        s = "";
    document.body.addEventListener("click", r => {
        if (["customBack", "customBackIcon"].indexOf(r.target.id) > -1) {
            (a = JSON.parse(window.localStorage.getItem("customBackgroundOptions")) || t).url = a.url || e;
            const r = document.getElementById("small_modal");
            document.getElementById("small_modal_content").innerHTML = `<div class=pad_box><div class=boom_form><div class=chat_settings><p class=label>Загрузить изображение</p><input id=imgUpload type=file accept=image/*></div><div class=chat_settings><p class=label>Cсылка изображения</p><input id=imageUrl class=full_input name=imageUrl type=url value="${l||a.url}" placeholder="${t.url}"></div><div class=сhat_settings><p class=label>Затемнение фона (<span id=backgroundOpacitySpan>${c||a.opacity}</span>%)</p><input id=backgroundOpacity type=range min=0 max=100 value=${c||a.opacity} style=width:100%></div><div class=chat_settings><p class=label>Тема</p><select id=backgroundThemeSwitch><option value=light ${"light"===s||"light"===a.theme?"selected":""}>Светлая</option><option value=dark ${"dark"===s||"dark"===a.theme?"selected":""}>Тёмная</option></select></div></div><button id=setBackground class="reg_button theme_btn" style=margin-right:5px>Сохранить</button><button id=resetLiveSettings class="reg_button default_btn" style="transition:.3s ease-in-out" ${l||c||s?"":"disabled"}>Сбросить</button></div></div>`, r.style.display = "block";
            const i = document.getElementById("imageUrl"),
                d = document.getElementById("backgroundOpacity"),
                u = document.getElementById("backgroundOpacitySpan"),
                m = document.getElementById("setBackground"),
                p = document.getElementById("resetLiveSettings"),
                g = document.getElementById("backgroundThemeSwitch"),
                b = document.getElementById("backgroundThemeStyles"),
                h = document.getElementById("imgUpload");
            l || ({
                url: l
            } = a), c || ({
                opacity: c
            } = a), s || ({
                theme: s
            } = a), i.addEventListener("input", e => {
                const o = e.target.value || t.url;
                document.documentElement.style.setProperty("background-image", `url(${o})`, "important"), (l = o) === a.url && c === a.opacity && s === a.theme ? p.setAttribute("disabled", "") : p.removeAttribute("disabled")
            }), d.addEventListener("input", t => {
                document.body.style.setProperty("background", `rgba(0, 0, 0, ${t.target.value/100})`, "important"), ({
                    target: {
                        value: c,
                        value: u.innerHTML
                    }
                } = t), l === a.url && c === a.opacity && s === a.theme ? p.setAttribute("disabled", "") : p.removeAttribute("disabled")
            }), g.addEventListener("change", t => {
                "dark" === t.target.value ? (b.innerHTML = o, s = "dark") : "light" === t.target.value && (b.innerHTML = n, s = "light"), l === a.url && c === a.opacity && s === a.theme ? p.setAttribute("disabled", "") : p.removeAttribute("disabled")
            }), h.addEventListener("change", () => {
                let {
                    files: t
                } = h;
                if (t && t[0]) {
                    if ([t] = t, t.size > 5e6) return window.alert("Размер загруженного файла не должен превышать 5MB.");
                    const e = new FileReader;
                    e.onload = (t => {
                        const {
                            target: {
                                result: e
                            }
                        } = t;
                        document.documentElement.style.setProperty("background-image", `url(${e})`, "important"), i.value = e, l = e, e === a.url && c === a.opacity && s === a.theme ? p.setAttribute("disabled", "") : p.removeAttribute("disabled")
                    }), e.readAsDataURL(t)
                }
                return !1
            }), p.addEventListener("click", () => {
                document.documentElement.style.setProperty("background-image", `url(${a.url})`, "important"), document.body.style.setProperty("background", `rgba(0, 0, 0, ${a.opacity/100})`, "important"), ({
                    url: i.value,
                    opacity: d.value,
                    opacity: u.innerHTML,
                    theme: g.value
                } = a), b.innerHTML = "dark" === a.theme ? o : n, l = "", c = "", s = "", p.setAttribute("disabled", "")
            }), m.addEventListener("click", () => {
                let {
                    files: e
                } = h;
                const a = {};
                if (e && e[0]) {
                    if ([e] = e, e.size > 5e6) return window.alert("Размер загруженного файла не должен превышать 5MB.");
                    const t = new FileReader;
                    t.onload = (t => window.localStorage.setItem("customBackgroundImg", t.target.result)), t.readAsDataURL(e)
                } else a.url = i.value || t.url;
                return l = "", c = "", s = "", ({
                    value: a.opacity
                } = d), ({
                    value: a.theme
                } = g), window.localStorage.setItem("customBackgroundOptions", JSON.stringify(a)), r.style.display = "none", !1
            })
        }
    })
};
document.addEventListener("DOMContentLoaded", customBackground(), !1);