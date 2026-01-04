// ==UserScript==
// @name         破产插件2.0
// @namespace    http://tampermonkey.net/
// @version      2025-02-21.2
// @description  -后果自负-
// @author       破产大人
// @match        *://www.neopets.com/*
// @match        *://neopets.com/*
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/32238/%E7%A0%B4%E4%BA%A7%E6%8F%92%E4%BB%B620.user.js
// @updateURL https://update.greasyfork.org/scripts/32238/%E7%A0%B4%E4%BA%A7%E6%8F%92%E4%BB%B620.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let data = []



    if (GM_getValue("neo_db")) {
        if (Math.abs(Number(GM_getValue("neo_db_timestamp")) - Number(new Date())) <= 12 * 60 * 60 * 1000) {
            data = JSON.parse(GM_getValue("neo_db"))
        }
    }

    if (data.length === 0) {
        $.ajax({
            url: "https://neo.lichdkimba.com/output.json",
            success: function (output) {
                GM_setValue("neo_db", JSON.stringify(output))
                GM_setValue("neo_db_timestamp", Number(new Date()))
                data = output;
            },
        })
    }






    $(document).ready(function () {
        $("head").append(`<style>
        /* Basic styling for the tooltip */
        .po_chan_tooltip {
            position: absolute;
            background-color: rgba(0,0,0,0.6);
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
        }
        .po_chan_tooltip_list {
            position: absolute;
            left: 0;
            top: 0;
        }
        .po_chan_tooltip_left.po_chan_tooltip {
            cursor: default;
            padding: 1px 2px;
        }
        .info-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
        }
        .basic-icon {
            width: 32px;
        }
        .basic-info {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
    </style>
<style id="po_chan_hide"></style>

`)
        $("body").append(`<div id="po_chan_tooltip_list" class="po_chan_tooltip_list"></div><div id="po_chan_tooltip" class="po_chan_tooltip"></div>`)


        function get_file(obj) {
            if (obj.includes("/")) {
                return obj.split("/")[obj.split("/").length - 1]
            }
            return obj
        }

        function nFormatter(num, digits) {
            if (num < 1000) {
                return num
            }
            if (num < 10000) {
                return (num / 1000).toFixed(1) + 'K'
            }
            if (num < 1000000) {
                return (num / 1000).toFixed(0) + 'K'
            }
            if (num < 100000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
            return (num / 1000000).toFixed(0) + 'M'
        }

        function bind_dom(obj) {


            let temp_data = data
            if (obj.type === "name") {
                temp_data = {}
                for (const key in data) {
                    data[key].forEach(i => {
                        if (temp_data.hasOwnProperty(i.name)) {
                            temp_data[i.name].push(i)
                        } else {
                            temp_data[i.name] = [i]
                        }
                    })
                }
            }


            // 价格提示
            let targets = $(obj.dom)

            let temp_html = ``
            for (let i = 0; i < targets.length; i++) {
                let img = obj.imgFunc($(targets).eq(i))
                if (img === false) {
                    return 0
                }
                if (temp_data.hasOwnProperty(get_file(img))) {
                    const elementPosition = $(targets).eq(i).offset();

                    let get_price = () => {
                        if (temp_data[get_file(img)].length === 1) {
                            return nFormatter(temp_data[get_file(img)][0].price)
                        } else {
                            return "?"
                        }
                    }

                    temp_html += `<div class="po_chan_tooltip po_chan_tooltip_left" style="top: ${elementPosition.top - 15}px;
left: ${elementPosition.left - 15}px">
${get_price()}
</div>`


                }

            }
            $('#po_chan_tooltip_list').append(temp_html);

            // 浮窗
            $(document).on('mouseenter', obj.dom, function (event) {
                // Get the tooltip text from the data-tooltip attribute
                let img = obj.imgFunc($(this))
                if (img === false) {
                    return 0
                }
                let d_arr = [{
                    "price": "无数据",
                    "date": "无数据",
                    "name": "无数据",
                    "rarity": -1,
                    "id": -1
                }]
                if (temp_data.hasOwnProperty(get_file(img))) {
                    d_arr = temp_data[get_file(img)]
                } else {
                    return 0
                }
                let tooltipText = `<div class="basic-info"><img class="basic-icon" src="https://images.neopets.com/themes/h5/basic/images/v3/gallery-icon.svg" /><div>${get_file(img)} (共 ${d_arr.length} 个结果)</div></div>`
                d_arr.forEach(d => {
                    tooltipText += `<div class="info-container"><div class="basic-info"><img class="basic-icon" src="https://images.neopets.com/themes/h5/basic/images/v3/inventory-icon.svg">${d.name}</div>
<div class="basic-info"><img class="basic-icon" src="https://images.neopets.com/themes/h5/basic/images/level-icon.png"><div>${d.price} 于 ${d.date ? d.date.split("T")[0] : "无数据"}</div></div>
<div class="basic-info"><img class="basic-icon" src="https://images.neopets.com/themes/h5/basic/images/mood-icon.png" /><div>r${d.rarity}</div></div>
<div>
<a href="https://www.neopets.com/shops/wizard.phtml?string=${d.name.replaceAll(" ", "+")}">
<img class="basic-icon" src="http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png"></a>
<a href="https://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=${d.name.replaceAll(" ", "+")}">
<img class="basic-icon" src="http://images.neopets.com/themes/h5/basic/images/auction-icon.png">
</a>
<a href="https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=${d.name.replaceAll(" ", "+")}">
<img class="basic-icon" src="http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png">
</a>
<a href="https://www.neopets.com/safetydeposit.phtml?obj_name=${d.name.replaceAll(" ", "+")}">
<img class="basic-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAECklEQVRYhe1WS08jRxD+qj2PHQ8gbLB5SgaBQKDkyokDXPIbOOcX5RJFSi45RcovyCESIocoOawQSHhxQDwMEg/j4CEz4/FO90zlwIzXsMbrELTaw35SH2ZUVd/XVdVdDXzGZ3yKIKKPxwUAlmVNFAqFNcMwviwUChfZbPZ8b2/vLTP/PTg4eCuE8E9OTlgpxQDeAmgBYAB6EkcCiADESUzu4NASO5H8l8nitoCZmZmv19fXf3AcR0xNTcUDAwOy1WqBmZtE9I+U0t/Z2ckwc2wYhgOgngTIJiR+IirqEMAJ6SsANgADgALgE5F/c3PzZ7lc/lYTQmB6enpI3AOGYYhsNmtalgUAJoAcEWF2dhZhGMJ1Xei6DsMwwNy50f4QBAFM04RlWROVSuVHjYig67qdGjBze6WI4xhSSjSbTRQKBTSbTRSLRdi23ZWkG+I4xvX1NUzThFIKvu8PEVFWS0j1pxyFEDg6OsLW1haICBsbG1heXka5XEYURdD1J10fwPM85PN5LCwsYHt7G47jCACkJTsNezm7rotarYZMJgOlFEZHR5HP53F4eAjbtj9YCqUUTNPEysoKhBCpvQYgozEzWq2WSo9eFEXvBZBSPiBhZmQyGQwPD2NwcPCDAlJ/ImqXN5vNGpOTk5rGzFBKRUTUNngKhmHAMIwHQh73Szc8tmFmWJYlJicnNQ0AiOjJQjIz5ufnsbq6CiJCsVh8Vvd3gWDmjJZ85HsJyOVyKJVKcF0XQoiXIG8LSKMN9bLsTHUcx/+bOSl1JggCU+D+5tL6cSKirk36TBhRFL1KM9Azr8lJQRAEL0UOABkARkr85PgTQqBarWJzcxPlcrndgGlG/svqIkBPU99z/jqOg0ajAeDdPSGlhOd5iOO4r4tICIEoiqBp7WoLAFpfAjoDKaXQaDQwMTGBpaWlvt8OjUYDR0dHKJVKqQ8BoFRAz9bWNA1DQ0PI5XJoNBoYGRnB3Nxc33MAAEqlEqrVKvb39+G6bjsTGgAKw9BMd/L4mDEzSqUS1tbWwMw4PT2FlBKVSqVv8hREhHq9DsdxMD4+HgNQqQArbZRuAgYGBmBZFoiIdV2PPc9rF11KSVEUpd9xstLXkcL9oAuT7wwR2SMjI7bnebdhGNbTEnTtIiJCEAS4u7ur6rr+i+/7f4Rh6CYEDAC7u7u4uLgAEXHyX3WsEO9eSwr3T7McgGFmdqWU+10vICKCUgp3d3e1s7Ozn46Pj78/PT39y/O893qln2HUC10FuK7bvLy8/LVSqXxzfHz8++3trXw2Qz8CmJnDMIRSimu12ptarfbd69evfz4/P6+/xN3fCwSAbNv+amxs7IvFxcXg4ODgt6urqze+77/IzO0byYv4o3J+EvgX4yIhYBP/dWUAAAAASUVORK5CYII=">
</a>
<a href="https://items.jellyneo.net/search/?name=${d.name.replaceAll(" ", "+")}">
<img class="basic-icon" src="data:image/png;base64,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">
</a>
<a href="https://itemdb.com.br/item/${d.name.replaceAll(" ", "-")}/">
<img class="basic-icon" src="https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg">
</a>
</div>
<div class="timer"></div>
</div>
`;
                })



                let id = Math.random()
                // Set the tooltip content
                $('#po_chan_tooltip').html(tooltipText).show().attr('data-id', id);

                // Position the tooltip near the hovered element
                const elementPosition = $(this).offset();


                $('#po_chan_tooltip').css({
                    top: elementPosition.top + $(this).height() - 5, // 5px offset
                    left: elementPosition.left + $(this).width() - 5
                });


                let de_time = 1000
                let time = 5000

                $('#po_chan_tooltip').on('mouseenter', function (event) {
                    de_time = 0
                    time = 5000
                })
                $('#po_chan_tooltip').on('mouseleave', function (event) {
                    de_time = 1000
                })

                $(".timer").html(`(${time/1000} 秒后<a href="javascript:void(0)" class="close-btn">关闭</a>)`)
                let timer = setInterval(function () {
                    time -= de_time
                    $(`#po_chan_tooltip[data-id="${id}"] .timer`).html(`(${time/1000} 秒后<a href="javascript:void(0)" class="close-btn">关闭</a>)`)
                    if (time <= 0) {
                        clearInterval(timer)
                        $(`#po_chan_tooltip[data-id="${id}"]`).html("").hide()
                    }
                }, 1000)
                $("#po_chan_tooltip").on('click', ".close-btn", function () {
                    $(`#po_chan_tooltip[data-id="${id}"]`).html("").hide()
                })

            });
        }






        setInterval(() => {
            $('#po_chan_tooltip_list').html("");
            // 通用
            bind_dom({
                dom: "img",
                imgFunc: function (target) {
                    return target.attr("src");
                }
            })
            // 商店
            bind_dom({
                dom: ".item-img",
                imgFunc: function (target) {
                    if (target.attr("style").search("background-image") > -1) {
                        let url = target.get(0).style.backgroundImage
                        if (url.includes("url")) {
                            return url.split("/")[url.split("/").length - 1].replace('")', "")
                        }
                    }
                    return false
                }
            })

            // quickstock
            if (location.href.includes("quickstock")) {
                bind_dom({
                    dom: "#content > table > tbody > tr > td.content > form > table > tbody > tr > td:nth-child(1)",
                    imgFunc: function (target) {
                        return target.text()
                    },
                    type: "name"
                })
            }

        }, 500)



        let _show = true
        // 快捷键切换隐藏
        document.addEventListener('keydown', function(event) {
            if(event.key === "b" && event.ctrlKey) {
                _show = !_show
            }
            if (_show) {
                $("#po_chan_hide").html(``)
            } else {
                $("#po_chan_hide").html(`.po_chan_tooltip {display:none !important}`)
            }
        });





    });


    // Your code here...
})();
