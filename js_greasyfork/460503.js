// ==UserScript==
// @name         B站直播SC悬浮窗
// @namespace    https://gitee.com/zhangsongqiang/userscript/
// @version      0.5
// @description  将B站直播的SC部分展开显示到一个悬浮窗
// @author       Zhangsq37
// @match        https://live.bilibili.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @license MIT
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460503/B%E7%AB%99%E7%9B%B4%E6%92%ADSC%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/460503/B%E7%AB%99%E7%9B%B4%E6%92%ADSC%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function () {

    const styles_superchat_items = `
   div.superchatItem {
           width: 85%;
           height: auto;
           border: 2px solid gray;
           border-radius: 10px;
           padding: 0%;
           margin: 5%;
           margin-right: 10%;
   
           transition: background-color 2s;
       }
   
       div.superchatItem>div.sc_title {
           width: 100%;
           padding-top: 4px;
           padding-bottom: 4px;
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           background-color: #ffffffe0;
   
           border-top-left-radius: 10px;
           border-top-right-radius: 10px;
       }
   
       div.superchatItem>div.sc_title>div.sc_sender {
           min-width: 60%;
           max-width: 65%;
           height: 20px;
           display: flex;
           padding-left: 5px;
   
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
       }
   
       div.superchatItem>div.sc_title>div.sc_sender>div.sender_fans_medal_label {
           border-top-left-radius: 6px;
           border-bottom-left-radius: 6px;
           padding-left: 4px;
           padding-right: 4px;
           padding-bottom: 4px;
           /*text-align: center;
           text-justify: auto;*/
           color: white;
       }
   
       div.superchatItem>div.sc_title>div.sc_sender>div.sender_fans_medal_level {
           border-top-right-radius: 6px;
           border-bottom-right-radius: 6px;
           padding-left: 4px;
           padding-right: 4px;
           /*text-align: center*/
           ;
       }
   
       div.superchatItem>div.sc_title>div.sc_sender>div.sender_uname>a {
           text-decoration: none;
           padding-left: 10px;
           color: #a70404bd;
   
       }
   
       div.superchatItem>div.sc_title>div.sc_info {
           width: 30%;
           display: flex;
           flex-wrap: nowrap;
           justify-content: flex-end;
       }
   
       div.superchatItem>div.sc_title>div.sc_info>div.sc_sendtime {
           color: #000000ae;
           font-weight: bold;
           padding-left: 20px;
           padding-right: 20px;
           display: inline-block;
       }
   
       div.superchatItem>div.sc_title>div.sc_info>div.sc_price {
           color: #00000050;
           font-weight: bold;
           padding-right: 5px;
           display: inline-block;
       }
   
   
       div.superchatItem>div.sc_content {
           padding: 5px;
           text-align: left;
           padding-left: 10px;
           padding-right: 10px;
           border-bottom-left-radius: 10px;
           border-bottom-right-radius: 10px;
           word-break: break-all;
           /* 只对英文起作用，以字母作为换行依据 */
           word-wrap: break-word;
           /* 只对英文起作用，以单词作为换行依据 */
           white-space: pre-wrap;
           /* 只对中文起作用，强制换行 */
       }
   
       div.superchatItem>div.superchat_progress {
           width: 100%;
           height: 3px;
           border-radius: 2px;
       }
   
       div.superchatItem>div.superchat_progress>div.superchat_progress_value {
           width: 100%;
           height: 3px;
           border-radius: 1px;
           background-color: #00000060;
           transition: width 1s linear;
       }
   `;

    class SuperChatMonitor {
        Monitor(ChatPanelContainer = null) {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            const options = { childList: true };
            this.ChatPanelContainer = ChatPanelContainer;
            const chat_mutation = new MutationObserver(this.monitor_callback);
            chat_mutation.observe(this.ChatPanelContainer, options);
            this.SuperchatHistroy = [];
            this.handle_new_superchat_data = (superchat_data) => { };
        }

        monitor_callback = (mutationRecoards, observer) => {
            mutationRecoards.forEach(mutationRecoard => {
                if (mutationRecoard.type == "childList") {
                    mutationRecoard.addedNodes.forEach(
                        addnode => {
                            if (addnode.classList.contains("superChat-card-detail")) {//是SC
                                this.parse_new_superchat_callback(addnode);
                                console.info(addnode);
                            }
                        }
                    );
                }
                else {
                    console.error(mutationRecoard);
                }
            });
        }

        parse_new_superchat_callback(new_superchat) {
            console.log('new superchat');
            var send_time = parseInt(new_superchat.getAttribute("data-ts")) * 1000;
            var sender_uname = new_superchat.getAttribute("data-uname");
            var sender_uid = new_superchat.getAttribute("data-uid");
            var send_content = new_superchat.getAttribute("data-danmaku");
        
            var superChatPrice = parseInt(new_superchat.querySelector("div.card-item-top-right").innerText.split("0电池")[0]);
            var sender_fans_medal_label = new_superchat.querySelector("span.fans-medal-content");
            var sender_fans_medal_level = new_superchat.querySelector("div.fans-medal-level");
            if (sender_fans_medal_label) {
                sender_fans_medal_label = sender_fans_medal_label.innerText;
                sender_fans_medal_level = sender_fans_medal_level.innerText;
            }
            var superchat_data = { sender_uname, sender_uid, send_content, superChatPrice, sender_fans_medal_label, sender_fans_medal_level, send_time };
            this.SuperchatHistroy.push(superchat_data);

            this.handle_new_superchat_data(superchat_data); //回调函数，用于处理解析出的数据
        }

        send_history_superchat() {
            this.SuperchatHistroy.forEach(
                (history_sc_data) => {
                    this.handle_new_superchat_data(history_sc_data);
                }
            )
        }
    }

    class SuperChatItem {
        constructor(superchat_data) {
            this.sender_uname = superchat_data.sender_uname;
            this.sender_uid = superchat_data.sender_uid;
            this.sender_fans_medal_label = superchat_data.sender_fans_medal_label;
            this.sender_fans_medal_level = superchat_data.sender_fans_medal_level;
            this.send_content = superchat_data.send_content;
            this.superChatPrice = superchat_data.superChatPrice;
            this.send_time = superchat_data.send_time;
        }
        generateNode() {
            var div_superchatItem = document.createElement("div");
            div_superchatItem.className = "superchatItem";
            div_superchatItem.style.backgroundColor = this.get_sc_background_color();
            var div_sc_title = document.createElement("div");
            div_sc_title.className = "sc_title";
            var div_sc_sender = document.createElement("div");
            div_sc_sender.className = "sc_sender";
            var div_sender_fans_medal_label = document.createElement("div");
            div_sender_fans_medal_label.className = "sender_fans_medal_label";
            var div_sender_fans_medal_level = document.createElement("div");
            div_sender_fans_medal_level.className = "sender_fans_medal_level";

            if (this.sender_fans_medal_label) {
                var fans_medal_color = this.get_fans_medal_color();
                div_sender_fans_medal_label.style.border = "1px solid " + fans_medal_color;
                div_sender_fans_medal_label.style.backgroundColor = fans_medal_color;
                div_sender_fans_medal_label.innerText = this.sender_fans_medal_label;

                div_sender_fans_medal_level.style.border = "1px solid " + fans_medal_color;
                div_sender_fans_medal_level.style.color = fans_medal_color;
                div_sender_fans_medal_level.innerText = this.sender_fans_medal_level;
            }
            else {
                div_sender_fans_medal_label.style.visibility = "hidden";
                div_sender_fans_medal_level.style.visibility = "hidden";

            }
            var div_sender_uname = document.createElement("div");
            div_sender_uname.className = "sender_uname";


            var a_uname = document.createElement("a");
            a_uname.href = "https://space.bilibili.com/" + this.sender_uid;
            a_uname.target = "_blank";
            a_uname.innerText = this.sender_uname;
            a_uname.title = this.sender_uname;

            div_sender_uname.appendChild(a_uname);
            div_sc_sender.appendChild(div_sender_fans_medal_label);
            div_sc_sender.appendChild(div_sender_fans_medal_level);
            div_sc_sender.appendChild(div_sender_uname);

            var div_sc_info = document.createElement("div");
            div_sc_info.className = "sc_info";

            var div_sc_sendtime = document.createElement("div");
            div_sc_sendtime.className = "sc_sendtime";
            div_sc_sendtime.setAttribute("send-time", this.send_time.toString());
            div_sc_sendtime.innerText = (new Date(this.send_time)).toLocaleTimeString();

            var div_sc_price = document.createElement("div");
            div_sc_price.className = "sc_price";
            div_sc_price.innerText = "￥" + this.superChatPrice;

            div_sc_info.appendChild(div_sc_sendtime);
            div_sc_info.appendChild(div_sc_price);

            div_sc_title.appendChild(div_sc_sender);
            div_sc_title.appendChild(div_sc_info);

            var div_sc_content = document.createElement("div");
            div_sc_content.className = "sc_content";
            div_sc_content.innerHTML = this.send_content + '&nbsp;';

            var div_superchat_progress = document.createElement("div");
            div_superchat_progress.className = "superchat_progress";

            var div_superchat_progress_value = document.createElement("div");
            div_superchat_progress_value.className = "superchat_progress_value";
            div_superchat_progress.appendChild(div_superchat_progress_value);

            div_superchatItem.appendChild(div_sc_title);
            div_superchatItem.appendChild(div_sc_content);
            div_superchatItem.appendChild(div_superchat_progress);

            this.progress = div_superchat_progress_value;
            this.set_progress();
            this.div_superchatItem = div_superchatItem;
            return div_superchatItem;
        }

        get_sc_background_color() {
            let price = this.superChatPrice;
            if ((price >= 30) && (price < 50)) {
                return "#2c64b4";
            } else if ((price >= 50) && (price < 100)) {
                return "#447c9c";
            } else if ((price >= 100) && (price < 500)) {
                return "#c89c24";
            } else if ((price >= 500) && (price < 1000)) {
                return "#e49444";
            } else if ((price >= 1000) && (price < 2000)) {
                return "#e44c4c";
            } else if (price >= 2000) {
                return "#ac1c34";
            } else {
                return "#ffffff";
            }
        }

        get_sc_show_time() {
            let price = this.superChatPrice;
            if ((price >= 30) && (price < 50)) {
                return 60;
            } else if ((price >= 50) && (price < 100)) {
                return 120;
            } else if ((price >= 100) && (price < 500)) {
                return 300;
            } else if ((price >= 500) && (price < 1000)) {
                return 1800;
            } else if ((price >= 1000) && (price < 2000)) {
                return 3600;
            } else if (price >= 2000) {
                return 7200;
            } else {
                return 1;
            }
        };

        get_fans_medal_color() {
            let fans_medal_level = this.sender_fans_medal_level;
            if ((fans_medal_level > 0) && (fans_medal_level <= 4)) {
                return "#5c968e";
            } else if ((fans_medal_level > 4) && (fans_medal_level <= 8)) {
                return "#5d7b9e";
            } else if ((fans_medal_level > 8) && (fans_medal_level <= 12)) {
                return "#8c7ca4";
            } else if ((fans_medal_level > 12) && (fans_medal_level <= 16)) {
                return "#bc6484";
            } else if ((fans_medal_level > 16) && (fans_medal_level <= 20)) {
                return "#c49c24";
            } else if ((fans_medal_level > 20) && (fans_medal_level <= 24)) {
                return "#2c6a61";
            } else if ((fans_medal_level > 24) && (fans_medal_level <= 28)) {
                return "#142464";
            } else if ((fans_medal_level > 28) && (fans_medal_level <= 32)) {
                return "#442474";
            } else if ((fans_medal_level > 32) && (fans_medal_level <= 36)) {
                return "#942347";
            } else if ((fans_medal_level > 36) && (fans_medal_level <= 40)) {
                return "#fc7424";
            } else {
                return "#000000";
            }
        };

        set_progress() {
            this.sc_show_time = this.sc_leave_time = this.get_sc_show_time();
            this.timer = setInterval(() => {
                this.sc_leave_time -= 1;
                if (this.sc_leave_time == 0) {
                    this.progress.style.width = "0%";
                    this.div_superchatItem.style.backgroundColor = "lightgray";
                    clearInterval(this.timer);
                }
                else {
                    this.progress.style.width = (this.sc_leave_time * 100 / this.sc_show_time).toString() + "%";
                }
            }, 1000);
        }

        static set_styles() {
            GM_addStyle(styles_superchat_items);
        }
    }

    class FloatingWindow {
        constructor() {
            if (document.querySelector("div#superChat_Display_Panel")) {
                console.warn("悬浮窗口已存在！！！");
            }
            else {
                console.log("创建悬浮窗口");
                //顶栏的控制栏
                var checkbox_superchat_auto_scroll = document.createElement("input");
                checkbox_superchat_auto_scroll.id = "checkbox_superchat_auto_scroll";
                checkbox_superchat_auto_scroll.type = "checkbox";

                var label_for_superchat_auto_scroll_heckbox = document.createElement("label");
                label_for_superchat_auto_scroll_heckbox.setAttribute("for", "checkbox_superchat_auto_scroll");
                label_for_superchat_auto_scroll_heckbox.innerText = "SC自动滚动";

                checkbox_superchat_auto_scroll.onchange = () => {
                    if (checkbox_superchat_auto_scroll.checked) {
                        superChat_Display_Panel.scrollTo(0, 999999999);
                    }
                };

                var div_checkbox_superchat_auto_scroll = document.createElement("div");
                div_checkbox_superchat_auto_scroll.className = "div_checkbox_superchat_auto_scroll";
                div_checkbox_superchat_auto_scroll.style.paddingLeft = "10px";
                div_checkbox_superchat_auto_scroll.appendChild(checkbox_superchat_auto_scroll);
                div_checkbox_superchat_auto_scroll.appendChild(label_for_superchat_auto_scroll_heckbox);

                var superChat_Display_Panel_CtrlBar = document.createElement("div");
                superChat_Display_Panel_CtrlBar.id = "superChat_Display_Panel_CtrlBar";
                superChat_Display_Panel_CtrlBar.appendChild(div_checkbox_superchat_auto_scroll);

                //主体显示区
                var superChat_Display_Panel = document.createElement("div");
                superChat_Display_Panel.id = "superChat_Display_Panel";
                superChat_Display_Panel.style.width = "100%";
                superChat_Display_Panel.style.border = "1px solid gray";

                //包含和插入的容器
                var superChat_Display_Container = document.createElement("div");
                superChat_Display_Container.id = "superChat_Display_Container";
                superChat_Display_Container.style.width = "400px";
                superChat_Display_Container.style.height = "220px";
                superChat_Display_Container.style.border = "1px solid black";
                superChat_Display_Container.style.borderRadius = "10px";
                superChat_Display_Container.style.zIndex = "999999999";
                superChat_Display_Container.appendChild(superChat_Display_Panel_CtrlBar);
                superChat_Display_Container.appendChild(superChat_Display_Panel);

                document.body.appendChild(superChat_Display_Container);

                FloatingWindow.dragToMove(superChat_Display_Panel_CtrlBar, superChat_Display_Container);

                this.superChat_Display_Panel = superChat_Display_Panel;
                this.superChat_Display_Container = superChat_Display_Container;
                this.checkbox_superchat_auto_scroll = checkbox_superchat_auto_scroll;
            }
        }

        remove() {
            this.superChat_Display_Container.remove();
        }

        add_new_superchat_item(new_superchatItem) {
            this.superChat_Display_Panel.appendChild(new_superchatItem);
            if (this.checkbox_superchat_auto_scroll.checked) {
                this.superChat_Display_Panel.scrollTo(0, 999999999);
            }
        }

        static set_styles() {
            const styles_superchat_panel = `div#superChat_Display_Panel_CtrlBar {
               width: 100%;
               height: 20px;
               display: flex;
               flex-wrap: nowrap;
               justify-content: space-between;
           }
       
           div#superChat_Display_Panel {
               margin-bottom: 10px;
               overflow-y: scroll;
               min-height: 260px;
               height: calc(100% - 40px);
           }
       
           div#superChat_Display_Container {
               min-width: 400px;
               min-height: 300px;
               padding-bottom: 10px;
               resize: both;
               overflow-x: hidden;
               overflow-y: auto;
       
               position: absolute;
       
               top:150px;
               right: 0px;
       
           }`;
            GM_addStyle(styles_superchat_panel);
        }

        static dragToMove(dragNode, moveNode) {//（被拖动的Part,被移动的整体）
            dragNode.onmousedown = function (event) {
                event = event || window.event
                //获取鼠标按下时的坐标
                let x = event.clientX
                let y = event.clientY
                //获取鼠标按下时距离div边框的距离
                let ol = x - moveNode.offsetLeft
                let ot = y - moveNode.offsetTop
                //使用document的原因:防止用户拖拽速度过快导致元素的onmousemove事件失效，所以把onmousemove事件绑定在document上就能避免失效
                document.onmousemove = function (event) {
                    event = event || window.event
                    moveNode.style.left = event.clientX - ol + 'px'
                    moveNode.style.top = event.clientY - ot + 'px'
                }
                //取消onmousemove事件和onmouseup事件
                document.onmouseup = function () {
                    document.onmousemove = 'null'
                    document.onmouseup = 'null'
                }
            }
        };

    }

    const new_window_html =
        `
       <!DOCTYPE html>
       <html lang="en">
       <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
       </head>
       <body>
           <style id="styles_superchat_items"></style>
           <style>
               :root {
                   height: 100%;
               }
       
               body {
                   margin: 0px;
                   height: 100%;
               }
       
               div#ctrlbar {
                   position: fixed;
                   margin: 0px;
                   padding: 0px;
                   width: 100%;
                   height: 5%;
                   bottom: 0%;
                   border: 1px solid;
               }
       
               div#superchat-item-area {
                   height: 95%;
                   overflow-y: scroll;
               }
           </style>
           <div id="superchat-item-area">
       
           </div>
           <div id="ctrlbar">
               <input type="checkbox" name="" id="check_auto_scroll">
               <label for="check_auto_scroll">SC自动滚动</label>
               &nbsp;
               &nbsp;
               &nbsp;
               &nbsp;
               <span id = 'ScCount'></span>
           </div>
           <script>
               
               //window.onload = window.onresize = () => {
               //    var devicewidth = document.documentElement.clientWidth;
               //    var scale = devicewidth / 1920;
               //    document.body.style.zoom = scale;
               //};

               var superchat_display_panel = document.querySelector("div#superchat-item-area");
               var check_auto_scroll = document.querySelector("input#check_auto_scroll");
               check_auto_scroll.onchange = () => {
                   if (check_auto_scroll.checked) {
                       superchat_display_panel.scrollTo(0, 99999999999999999);
                   }
               }
               var add_new_superchat_item = (sc_item) => {
                   superchat_display_panel.appendChild(sc_item);
                   if (check_auto_scroll.checked) {
                       superchat_display_panel.scrollTo(0, 99999999999999999);
                   }
               }
               var set_styles = (stylesheet) => {
                   document.querySelector("style#styles_superchat_items").innerHTML = stylesheet;
               }
           </script>
       </body>
       </html>
   `;

    class NewWindow {
        constructor() {
            this.display_window = window.open("", 'newwindow', 'height=100, width=400, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
            this.display_window.resizeTo(400, 600);
            this.display_window.document.write(new_window_html);
            this.set_styles();
            this.sc_count_element = this.display_window.document.querySelector('span#ScCount');
        }

        add_new_superchat_item(sc_item) {
            this.display_window.add_new_superchat_item(sc_item);
        }

        set_superchat_count(cnt) {
            this.sc_count_element.innerText = '共计' + cnt + '个SC';
        }

        set_styles() {
            this.display_window.set_styles(styles_superchat_items);
        }
        remove() {
            if (!this.display_window.closed) {
                this.display_window.close();
            }
        }
    }

    class SuperchatDisplayManager {
        constructor(ChatPanelContainer) {
            this.sc_monitor = new SuperChatMonitor();
            this.sc_monitor.Monitor(ChatPanelContainer);
            this.sc_display = null;
        }

        DisplayInFloatingWindow() {
            if (this.sc_display) {
                if (this.sc_display.constructor.name == "FloatingWindow") {
                    return;
                }
                else {
                    this.sc_display.remove();
                }
            }
            this.sc_display = new FloatingWindow();
            this.sc_monitor.handle_new_superchat_data = (sc_data) => { this.sc_display.add_new_superchat_item(new SuperChatItem(sc_data).generateNode()); }   //设置处理SC的回调函数
            this.sc_monitor.send_history_superchat();//恢复历史记录
        }

        DisplayInNewWindow() {
            if (this.sc_display) {
                if (this.sc_display.constructor.name == "NewWindow") {
                    return;
                }
                else {
                    this.sc_display.remove();
                }
            }
            this.sc_display = new NewWindow();
            this.sc_monitor.handle_new_superchat_data = (sc_data) => { this.sc_display.add_new_superchat_item(new SuperChatItem(sc_data).generateNode()); this.sc_display.set_superchat_count(this.sc_monitor.SuperchatHistroy.length); };   //设置处理SC的回调函数
            this.sc_monitor.send_history_superchat();//恢复历史记录
        }

        close() {
            if (!this.sc_display) {
                return;
            }
            else {
                this.sc_monitor.handle_new_superchat_data = null;
                this.sc_display.remove();
            }
        }
    }

    SuperChatItem.set_styles();
    FloatingWindow.set_styles();

    var ChatPanelContainer = document.querySelector("div#chat-history-list>div#chat-items");
    if (ChatPanelContainer) {
        var sc_manager = new SuperchatDisplayManager(ChatPanelContainer);
        GM_registerMenuCommand("以悬浮窗展示", () => { sc_manager.DisplayInFloatingWindow(); });
        GM_registerMenuCommand("以新窗口展示", () => { sc_manager.DisplayInNewWindow(); });
        GM_registerMenuCommand("关闭SC窗口", () => { sc_manager.close() });
    };
})();