// ==UserScript==
// @name         huya & douyu clear script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       se7en
// @include      http*://www.huya.com*
// @include      http*://www.douyu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415807/huya%20%20douyu%20clear%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/415807/huya%20%20douyu%20clear%20script.meta.js
// ==/UserScript==

(function() {
    // huya.com
    if (window.location.host == "www.huya.com") {
        console.log("located in huya.com");
        if (window.location.href == "https://www.huya.com/") {
            console.log("localtion: home");

            let player_btn = setInterval(function () {
                let player_btn_class = $("#player-btn").attr("class");
                console.log(player_btn_class, "button_class");
                if (player_btn_class != "player-play-btn") $("#player-btn").click();
                else clearInterval(player_btn);
            }, 1000);
        } else {
            console.log("localtion: room");

            let full_page = setInterval(function () {
                let button_class = $("#player-fullpage-btn").attr("class");
                console.log(button_class, "button_class");
                if (button_class != "player-narrowpage") $("#player-fullpage-btn").click();
                else clearInterval(full_page);
            }, 1000);

            let clear_timer = setInterval(function () {
                let element_array = [$(".room-footer"), $(".accompany-icon"), $("#wrap-income"), $("#wrap-notice")];
                let stop_count = 0;
                for (let x in element_array) {
                    if (element_array[x].length > 0) element_array[x].remove();
                    else stop_count += 1;
                }

                if (stop_count == element_array.length) clearInterval(clear_timer);
            }, 3000);

            function videoType() {
                console.log("切换清晰度 -> ready");
                let player_videotype_list = setInterval(function () {
                    let video_type = $(".player-videotype-list");
                    let first_video_type = video_type.find("li").first();
                    let type_name = first_video_type.html();
                    if (first_video_type.attr("class") != "on") {
                        first_video_type.click();
                        console.log("切换清晰度 -> " + type_name + " -> click");
                    } else {
                        let player_btn_class = $("#player-btn").attr("class");
                        if (player_btn_class == "player-play-btn") $("#player-btn").click();
                        else {
                            console.log("切换清晰度 -> " + type_name + " -> success");
                            clearInterval(player_videotype_list);
                        }
                    }
                }, 500);
            }

            console.log("切换线路 -> ready");
            let player_videoline_list = setInterval(function () {
                let video_line = $(".player-videoline-list");
                let first_video_line = video_line.find("li").first();
                let line_name = first_video_line.html();
                if (line_name != "线路0") {
                    if (first_video_line.attr("class") != "on") {
                        console.log("切换线路 -> " + line_name + " -> click");
                        first_video_line.click();
                    } else {
                        console.log("切换线路 -> " + line_name + " -> success");
                        videoType();
                        clearInterval(player_videoline_list);
                    }
                }
            }, 500);

            let open_box = setInterval(function () {
                console.log("自动领取礼包 -> ready");
                let box = $(".player-box-stat3");
                if ($(box[5]).parent().children("p")[3].innerHTML == "") {
                    box.each(function () {
                        if (this.style.visibility == "visible") {
                            this.click();
                            $("#player-box")[0].style.display = "none";
                        }
                    });
                } else {
                    console.log("自动领取礼包 -> over");
                    clearInterval(open_box);
                }
            }, 30000);
        }
    }

    // douyu.com
    if (window.location.host == "www.douyu.com") {
        console.log("located in douyu.com");
        if (window.location.href == "https://www.douyu.com/") {
            console.log("localtion: home");

            let player_btn = setInterval(function () {
                let player_btn_obj = document.querySelector(".pause-c594e8");
                let player_btn_class = player_btn_obj.getAttribute("class");
                let player_btn_class_match = player_btn_class.match(/(removed-)/);
                if (!player_btn_class_match) player_btn_obj.click();
                else clearInterval(player_btn);
            }, 1500);
        } else {
            console.log("localtion: room");

            let full_page = setInterval(function () {
                let full_page_btn_obj = document.querySelector(".wfs-2a8e83");
                let full_page_btn_class = full_page_btn_obj.getAttribute("class");
                let full_page_btn_class_match = full_page_btn_class.match(/(removed-)/);
                if (!full_page_btn_class_match) full_page_btn_obj.click();
                else clearInterval(full_page);
            }, 1000);

            let close_danmu = setInterval(function () {
                let close_danmu_btn_obj = document.querySelector(".showdanmu-42b0ac");
                let close_danmu_btn_class = close_danmu_btn_obj.getAttribute("class");
                let close_danmu_btn_class_match = close_danmu_btn_class.match(/(removed-)/);
                if (!close_danmu_btn_class_match) close_danmu_btn_obj.click();
                else clearInterval(close_danmu);
            }, 1000);

            let clear_timer = setInterval(function () {
                let element_array = [document.querySelector(".layout-Player-guessgame"), document.querySelector(".layout-Bottom")];
                let stop_count = 0;
                for (let x in element_array) {
                    if (element_array[x]) {
                        let parent_obj = element_array[x].parentNode;
                        parent_obj.removeChild(element_array[x]);
                    } else stop_count += 1;
                }

                if (stop_count == element_array.length) clearInterval(clear_timer);
            }, 3000);

            console.log("切换清晰度 -> ready");
            let player_videotype_list = setInterval(function () {
                let video_type = document.getElementsByClassName("c5-6a3710");
                console.log(video_type);
                for (let x in video_type) {
                    let video_type_html = video_type[x].defaultValue;
                    if (video_type_html == "画质 ") {
                        let select = video_type[x].nextElementSibling;
                        let best_high = select.firstElementChild;
                        let type_name = best_high.innerText;
                        if (best_high.getAttribute("class")) {
                            console.log("切换清晰度 -> " + type_name + " -> success");
                            clearInterval(player_videotype_list);
                        } else {
                            best_high.click();
                            console.log("切换清晰度 -> " + type_name + " -> click");
                        }
                    }
                }
            }, 500);
        }
    }
})();
