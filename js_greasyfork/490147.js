// ==UserScript==
// @name         订单插件 - 链接版
// @version      1.3.0
// @namespace    https://dyyphdy.cjdz.com/newIndex/index.xhtml?*
// @description  自动检测订单
// @author       json
// @license      MIT

// @match        https://dyyphdy.cjdz.com/newIndex/index.xhtml?*
// @match        https://fxg.kuaidizs.cn/newIndex/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant window.onurlchange
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/490147/%E8%AE%A2%E5%8D%95%E6%8F%92%E4%BB%B6%20-%20%E9%93%BE%E6%8E%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/490147/%E8%AE%A2%E5%8D%95%E6%8F%92%E4%BB%B6%20-%20%E9%93%BE%E6%8E%A5%E7%89%88.meta.js
// ==/UserScript==

(function () {

    'use strict';
    GM_log('11111 download is running.');

    const getNum = (num) => {
        return num.toString().substr(0, 3);
    }
    // 去除可能的后缀的方法
    const removeSuffix = (value) => {
        // 根据具体需求去除后缀，这里示例去除下划线及其后面的数字
        return value.replace(/_\d+$/, '');
    }
    // 判断是否已经存在数组里，如果是就返回对应索引，为了将重复的号码归一组
    const getGroupIndex = (groupData, data) => {

        const _data = data.map(element => removeSuffix(element));
        // console.log(_data)

        // 用于存储找到的索引
        var foundIndexes = { threeDIndex: -1, twoDIndex: -1 };
        try {
            // 遍历三维数组
            groupData.forEach((twoDimensionalArray, i) => {
                // 遍历二维数组
                twoDimensionalArray.forEach((subArray, j) => {
                    // 检查是否存在匹配的值
                    // 取前3位，避免111_1这种
                    // console.log(subArray)
                    if (subArray.some(element => {
                        // 使用Array.includes方法检查另一个数组中是否包含相同的元素
                        const value = removeSuffix(element)
                        if (value == '9999' || value == '00') {
                            return false
                        }
                        return _data.includes(removeSuffix(element));
                    })) {
                        foundIndexes["threeDIndex"] = i;
                        foundIndexes["twoDIndex"] = j;
                        throw new Error('StopIteration');
                    }

                    // if (getNum(subArray[0]) === getNum(data[0]) || getNum(subArray[1]) === getNum(data[1])) {

                    // }
                })

            })
        } catch (error) {
            return foundIndexes
        }

        return foundIndexes;
    }

    let isToPageClick = false;
    function callInit() {
        setTimeout(() => {
            const isElShow = $('.item[data-act-name="searchCurrentStatusTrade"]').length > 0;
            if (isToPageClick == false && isElShow) {
                $('.item[data-act-name="searchCurrentStatusTrade"]').click();
                isToPageClick = true
            }

            if ($('.des--yhvi5').text().indexOf('读取') == -1) {
                if ($('.col--SgmmZ').size() > 0 && $('#toolBarByCC').size() == 0) {
                    init();
                } else {
                    callInit()
                }
            } else {
                callInit()
            }
        }, 500);



    }



    callInit();

    // 存储新生成的 ID
    var newIds = [];

    function checkAndInit() {
        if ($('.des--yhvi5:contains("读取")').length === 0) {
            if ($('.col--SgmmZ').length > 0 && $('#toolBarByCC').length === 0) {
                init();
            }
        }
    }

    const intervalId = setInterval(checkAndInit, 500);


    // 创建音频元素
    const audioElements = {};
    ['Zero', 'One', 'Two', 'Three', 'Four', 'More'].forEach((num) => {



        // const audio = new Audio();
        // audio.hidden = true;
        // audio.src = `https://hk3.zonn.xyz/music/${num.toLowerCase()}.mp3`; // 设置src属性
        // audioElements[`audio${num}ToolbarByCC`] = audio;
        // if (num == 'Four' || num == 'More') {
        //     for (let i = 0; i <= 10; i++) {
        //         const audio = new Audio();
        //         audio.hidden = true;
        //         audio.src = `https://hk3.zonn.xyz/music/9_${i}.mp3`; // 设置src属性
        //         audioElements[`audio9_${i}ToolbarByCC`] = audio;
        //     }
        // }
    });

    function chineseToUnicode(text) {
        let unicodeText = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            unicodeText += charCode.toString(16).padStart(4, '0') + ' '; // 转换为4位十六进制格式，并在左侧补0
        }
        return unicodeText.trim();
    }


    function init() {


        newIds = [];
        if (document.getElementById('toolBarByCC')) {
            document.getElementById('toolBarByCC').remvoe()
        }
        const trTotal = []

        const goodsGroup = [[], [], []];
        const goodsGroupOne = [];
        $('.position_wrap--rJCbU').map((rowIndex, row) => {
            const goodsRows = [];
            const randomNum = Math.round(Math.random() * 1000)
            goodsRows.push(randomNum)
            // 链接
            let isWNum = false;
            $('.row-order--F9dqJ', row).each((i, col) => {
                if ($('.checked--R3g0E', col).size() > 0) {
                    const str = $(col).text();

                    const regex = /[A-Za-z]+\d+/;
                    const match = str.match(regex);

                    if (match) {
                        const numId = match[0];
                        if (numId.indexOf('W') != -1) {
                            isWNum = true;
                        }
                        const multiple = $('.num-red--Odkce', col).text().substr(1)
                        if (multiple) {
                            for (var i = 0; i < multiple; i++) {
                                goodsRows.push(numId)
                            }
                        } else {
                            goodsRows.push(numId)
                        }



                        $(col).attr('id', `num_${numId}_byToolbar`);
                        //console.log(numId);  // 输出结果为 "B215"
                    }
                }

            })

            // 扣号
            let isCallNum = false;
            $('.buyer_memo_icon--k_YL3', row).each((index, span) => {
                isCallNum = true;
                // const num = $(span).next().get(0).innerText.match(/(\b\d{3}\b)/);

                // const numValue = num && num.length >= 1 ? num[0] : '9999';
                const text = $(span).next().get(0).innerText;
                // const match = text.match(/\b([a-z])\W*(\d{3})\b/i);
                const match = text.match(/(\b\d{3}\b)/);
                const numValue = match ? match[0] : '9999';
                const numId = getLabelNewNum(numValue);
                // if(index == 0){
                //     firstNum = numId;
                // }
                // if(index == 1){
                //     secondNum = numId;
                // }
                $(span).attr('id', `num_${numId}_byToolbar`);
                goodsRows.push(numId)
            });


            // const name = $('.message_con--_E51U', row).find('span').eq(0)
            $(row).attr('id', `num_${goodsRows.join('_')}_byToolbar`);
            if (goodsRows.length > 1) {
                if (goodsRows.length == 2) {
                    goodsGroup[1].push(goodsRows)
                } else if (isCallNum == true || isWNum == true) {
                    goodsGroup[0].push(goodsRows)
                } else {
                    goodsGroup[2].push(goodsRows)
                }
            }



        })
        // goodsGroup.forEach(group=>{
        //     group.sort((a,b)=>a.length - b.length)
        // })
        console.log(goodsGroup)
        // $('.package-orders-col--j1Eqc').map((ii,row)=>{

        //     const goodsRows = []

        //     $('.row-order--F9dqJ', row).each((i,col)=>{
        //         const str = $(col).text();

        //         const regex = /[A-Za-z]+\d+/;
        //         const match = str.match(regex);

        //         if (match) {
        //             const numId = match[0];
        //             goodsRows.push(numId)
        //             //console.log(numId);  // 输出结果为 "B215"
        //         } 
        //     })
        //     goodsGroup[12] = goodsRows

        // })



        // $('.col--SgmmZ').map((iindex, value) => {
        //     const htmlRows = [];

        //     let firstNum = 0;
        //     let secondNum = 0;
        //     const result = {};
        //     // const group = 
        //     const goodsRows = []
        //     $('.buyer_memo_icon--k_YL3', value).each((index, span) => {
        //         // const num = $(span).next().get(0).innerText.match(/(\b\d{3}\b)/);

        //         // const numValue = num && num.length >= 1 ? num[0] : '9999';
        //         const text = $(span).next().get(0).innerText;
        //         const match = text.match(/\b([a-z])\W*(\d{3})\b/i);

        //         const numValue = match ? match[1].toUpperCase() + match[2] : '9999';
        //         const numId = getLabelNewNum(numValue);
        //         if(index == 0){
        //             firstNum = numId;
        //         }
        //         if(index == 1){
        //             secondNum = numId;
        //         }
        //         $(span).attr('id', `num_${numId}_byToolbar`);
        //         goodsRows.push(numId)
        //     });


        //     // 没有编号用00代替
        //     const orderQuantity = $('.package-orders-col--j1Eqc').eq(iindex).find('.row-order--F9dqJ').size();
        //     const noteQuantity = $('.buyer_memo_icon--k_YL3', value).size();
        //     if (noteQuantity !== orderQuantity) {
        //         const n = orderQuantity - noteQuantity;
        //         for (let iii = 0; iii < n; iii++) {
        //             const numId = `00_${new Date().getTime().toString().substr(11, 2)}`;
        //             goodsRows.push(numId)
        //         }
        //     }


        //     let groupIndex = 0

        //     if(goodsRows.length==1){
        //         groupIndex = 11;
        //         goodsGroupOne.push(goodsRows)
        //     }else{
        //         const groupIndexs = getGroupIndex(goodsGroup, goodsRows)
        //         if(groupIndexs["threeDIndex"] != -1){
        //             groupIndex = groupIndexs["threeDIndex"]
        //         }else{

        //             groupIndex = String(firstNum)[2]
        //             // if(goodsGroup[groupIndex] && goodsGroup[groupIndex].length > 10){
        //             //     groupIndex = String(firstNum)[1]
        //             // }

        //         }
        //         // const groupIndex = groupIndexs["threeDIndex"] != -1 ? groupIndexs["threeDIndex"] : String(firstNum)[2];
        //         console.log(goodsRows)
        //         if(!goodsGroup[groupIndex]){
        //             goodsGroup[groupIndex] = [];
        //         }

        //         goodsGroup[groupIndex].push(goodsRows)


        //     }


        // })
        // if(!goodsGroup[11]){
        //     goodsGroup[11] = [];
        // }
        // goodsGroup[11].push(...goodsGroupOne)

        console.log(goodsGroup)





        const boxHTML = `
            <div id="toolBarByCC">
                <div class="search_bar_by_toolbar">
                    ${Object.keys(audioElements).map((key) => `<audio id="${key}" hidden="${audioElements[key].hidden}" src="${audioElements[key].src}"></audio>`).join('\n')}
                    <div class="btn_read_toolbar">
                        <!-- <input id="searchNumByCC" /> -->
                        <span class="search_result"></span>
                        <!-- <button id="btnCheckByToolbar">检查</button></button></button>
                        <!-- <button id="btnCancelByToolbar">取消</button> -->
                        <button id="btnSubmitByToolbar">捡货1</button></button></button>
                        <button id="btnSubmitByToolbar2">捡货2</button></button></button>
                        <button id="btnGroupByToolbar">一组</button>
                        <!-- <button id="btnDistributionByToolbar">配货</button> -->
                        <button id="btnUpdateOrders">更新发货</button>
                        <button id="btnGoods">自制款1</button>
                        <button id="btnGoods2">自制款2</button>
                        <select id="numberSelect">
                            <option value="4">4</option>
                            <option value="5" selected>5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                        
                       
                        
                    </div>
                </div>
                <div class="search_result_box">
                    <table>
                        <tr><td colspan="3">链接：</td></td></tr>
                        ${

            // goodsGroup.map((threeObj, groupNum) => {
            goodsGroup[2].map(twoObj => {
                let id = [];
                const rowCells = twoObj.map((numId, i) => {
                    if (i > 0) {
                        id.push(numId)
                        return `<td style="width:60px"><label>${numId}</label></td>`;
                    }

                }).join('');

                return `<tr id="label_${twoObj.join('_')}_byToolbar"><td>0</td><td><input name="Fruit" type="checkbox" value="" /></td>${rowCells}</tr>`;
            }).join('')


            // }).join('')

            // $('.col--SgmmZ').map((iindex, value) => {
            //     const htmlRows = [];
            //     let firstNum = 0;
            //     const result = {};
            //     // const group = 
            //     $('.buyer_memo_icon--k_YL3', value).each((index, span) => {
            //         const num = $(span).next().get(0).innerText.match(/(\b\d{3}\b)/);
            //         const numValue = num && num.length >= 1 ? num[0] : '9999';
            //         const numId = getLabelNewNum(numValue);
            //         if(firstNum == 0){
            //             firstNum = numId;
            //         }
            //         $(span).attr('id', `num_${numId}_byToolbar`);
            //         htmlRows.push(`<td style="width:60px" id="label_${numId}_byToolbar"><input name="Fruit" type="checkbox" value="" /><label>${numId}</label></td>`);
            //     });
            //     const orderQuantity = $('.package-orders-col--j1Eqc').eq(iindex).find('.row-order--F9dqJ').size();
            //     const noteQuantity = $('.buyer_memo_icon--k_YL3', value).size();
            //     if (noteQuantity !== orderQuantity) {
            //         const n = orderQuantity - noteQuantity;
            //         for (let iii = 0; iii < n; iii++) {
            //             const num = `00_${new Date().getTime().toString().substr(11, 2)}`;
            //             htmlRows.push(`<td style="width:60px" id="label_${num}_byToolbar"><input name="Fruit" type="checkbox" value="" /><label>${num}</label></td>`);
            //         }
            //     }
            //     let len = htmlRows.length;
            //     if(len>=4)len=4
            //     // if(trTotal[len-1]){
            //     //     trTotal[len-1]++
            //     // }else{
            //     //     trTotal[len-1] = 1
            //     // }
            //     const firstDigit = String(firstNum)[2];

            //     if (!result[firstDigit]) {
            //         result[firstDigit] = [];
            //     }

            //     if (result[firstDigit].length >= 5) {
            //         const secondDigit = String(firstNum)[1];

            //         if (!result[secondDigit]) {
            //             result[secondDigit] = [];
            //         }

            //         result[secondDigit].push({ value: firstNum });
            //         firstNum = secondDigit
            //     } else {
            //         result[firstDigit].push({ value: firstNum });
            //         firstNum = firstDigit
            //     }

            //     return `<tr><td>${firstNum}</td>${htmlRows.join('')}</tr>`;
            // }
            }
                        <tr><td colspan="3">扣号：</td></tr>
                        ${goodsGroup[0].map(twoObj => {
                let id = [];
                const rowCells = twoObj.map((numId, i) => {
                    if (i > 0) {
                        id.push(numId)
                        return `<td style="width:60px"><label>${numId}</label></td>`;
                    }
                }).join('');

                return `<tr id="label_${twoObj.join('_')}_byToolbar"><td>2</td><td><input name="Fruit" type="checkbox" value="" /></td>${rowCells}</tr>`;
            }).join('')
            }
                        <tr><td colspan="3">1单：</td></tr>
                        ${goodsGroup[1].map(twoObj => {
                let id = [];
                const rowCells = twoObj.map((numId, i) => {
                    if (i > 0) {
                        id.push(numId)
                        return `<td style="width:60px"><label>${numId}</label></td>`;
                    }
                }).join('');

                return `<tr id="label_${twoObj.join('_')}_byToolbar"><td>1</td><td><input name="Fruit" type="checkbox" value="" /></td>${rowCells}</tr>`;
            }).join('')
            }
                        
                    </table>
                </div>
            </div>`;
        $('.list_table--JKyS4').prepend(boxHTML);

        // tabler排序
        // const table = document.querySelector('#toolBarByCC table');
        // const rows = Array.from(table.querySelectorAll('tbody tr'));

        // // Sort rows based on the number of cells in each row
        // rows.sort((a, b) => a.children.length - b.children.length);

        // // Remove existing rows
        // const tbody = table.querySelector('tbody');
        // tbody.innerHTML = '';

        // // Append sorted rows back to the table
        // rows.forEach(row => tbody.appendChild(row));


        handleBackgroundColors();

        $('body').append(`<style>
            #container{margin-left:20rem}
            #toolBarByCC{position:fixed;top:0px;left:0;z-index:999}
            .cur_num_byToolbar{background:#9bdfff}
            .num_changed_byToolbar{color:#f00}
            .cur_num_byToolbar.error_tipsss{background:#2fff14;color:#365064}
            #toolBarByCC{height:90vh;width:20rem;height:90vh;background:#fff;border:1px solid #333;padding:20px;    box-sizing: border-box;}
            .search_result_box{height:80vh;overflow-y:scroll}
            .search_bar_by_toolbar{border:2px solid #fff;}
            #searchNumByCC{padding:5px;width:110px}
            .btn_read_toolbar{text-align:center}
            .btn_read_toolbar button{margin:0 5px}
            .error_tipsss{background:#f00;color:#fff}

        </style>`);

        $('#toolBarByCC label').click(function () {

            console.log($(this).text());


            let id = 'num_' + $(this).parents('tr').attr('id').replace('label_', '').replace('_byToolbar', '') + '_byToolbar';
            $(document).scrollTop($('#' + id).offset().top - 50);
        });

        $('#toolBarByCC input').click(function () {
            let id = 'num_' + $(this).parents('tr').attr('id').replace('label_', '').replace('_byToolbar', '') + '_byToolbar';
            let inputChecked = $(this).is(":checked");

            let o = $(`#${id} .merge_label--l6zik`);
            if (o.is(":checked") != inputChecked) {
                o.click();
                $(document).scrollTop($('#' + id).offset().top - 50);
            }

            // let total = $(`#label_${id}_byToolbar`).parent().find('td').size() - 1;
            // if (total > 1) {
            //     if ($(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').is(":checked") == false && $(`#label_${id}_byToolbar`).parent().find('input[type="checkbox"]:checked').size() > 0) {
            //         $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').click();
            //     }

            //     if ($(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').is(":checked") == true && $(`#label_${id}_byToolbar`).parent().find('input[type="checkbox"]:checked').size() == 0) {
            //         $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').click();
            //     }


            //     let dom = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.opt--sQWb4').eq(0);
            //     let isDomOpen = dom.text().indexOf('收起') > -1 ? true : false;
            //     if (isDomOpen == false) {
            //         dom.click();
            //         setTimeout(() => {
            //             $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').next().find('.goods_item--XquYR>input[type="checkbox"]').click();
            //         }, 100)


            //     }
            //     setTimeout(() => {
            //         let i = $(`#label_${id}_byToolbar`).index() - 1;
            //         let o = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').next().find('.goods_item--XquYR>input[type="checkbox"]').eq(i);
            //         if (o.is(":checked") != inputChecked) {
            //             o.click();
            //         }
            //     }, 150)

            // } else {
            //     let o = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik');
            //     if (o.is(":checked") != inputChecked) {
            //         o.click();
            //     }

            // }

        });

        $('#btnReadByToolbar').click(readToolBarValue);
        $('#btnResetByToolbar').click(resetToolBarValue);
        $('#btnCancelByToolbar').click(cancelToolBarChecked);
        $('#btnCheckByToolbar').click(checkToolBarChecked);
        $('#btnGroupByToolbar').click(selectGroup)

        $('#btnSubmitByToolbar').click(submitChecked.bind(this, 1))
        $('#btnSubmitByToolbar2').click(submitChecked.bind(this, 2))
        // $('#btnDistributionByToolbar').click(distribution)
        $('#btnUpdateOrders').click(updateOrders)
        $('#btnGoods').click(uploadOrderGoods.bind(this, 1));
        $('#btnGoods2').click(uploadOrderGoods.bind(this, 2));
        $('#numberSelect').change(function () {
            goodsGroupSize = $(this).val();
            console.log("Selected value: " + selectedValue);
            // 你可以在这里将值保存在一个变量里

            // 或者执行其他操作
        });

        let goodsGroupSize = 5;



        function uploadOrderGoods(pageNum) {
            fetch('https://api.zonn.xyz/goods_num/read_self_goods_no')
                .then(response => response.json())
                .then(data => {
                    const goodsNo = data.data;
                    // const BGoods = ['B755', 'B757', 'B758', 'B767', 'B768', 'B763', 'B761', 'B778', 'B783', 'B784', 'B785', 'B786', 'B790', 'B792', 'B791', 'B794', 'B413', 'B414',
                    //     'B415', 'B416', 'B418', 'B419', 'B420', 'B421', 'B422', 'B423', 'B424', 'B427', 'B428', 'B433', 'B443', 'B445', 'B448']

                    // const AGoods = ['A061', 'A062', 'A063', 'A067', 'A068', 'A072', 'A076', 'A112', 'A113', 'A111', 'A116', 'A121', 'A122', 'A123', 'A126', 'A012', 'A013', 'A015', 'A018', 'A019', 'A020', 'A031', 'A041', 'A080', 'A081', 'A082', 'A038']
                    // const CGoods = ['C851', 'C850', 'C858', 'G950', 'G951', 'G952', 'G957', 'G958']
                    // const tootleGoods = AGoods.concat(BGoods);
                    const orderList = {};
                    // $('.specifications--waPs8').each((i, item) => {
                    //     const noStr = $(item).find('.item_item_info--wYHNY').text().split(' ')[0];
                    //     const pattern = /\b[A-Za-z]{1,3}\d{3}\b/;
                    //     const match = noStr.match(pattern);
                    //     if (match) {
                    //         const no = match[0];
                    //         const count = $(item).find('.num--ZpS0_').text()

                    //         orderList[no] = count;
                    //         // console.log(orderList)
                    //     }

                    // });
                    $('.row-order--F9dqJ').each(function () {
                        if ($('.checked--R3g0E', this).size() > 0) {
                            const noStr = $('.order-content--hF71n', this).text().split(' ')[0];
                            const pattern = /\b[A-Za-z]{1,3}\d{3}\b/;
                            const match = noStr.match(pattern);
                            if (match) {
                                const no = match[0];
                                if (!orderList[no]) {
                                    orderList[no] = 0
                                }

                                orderList[no]++

                                // console.log(orderList)
                            }

                        }


                    })


                    console.log(orderList)
                    const allOrderGoods = {};
                    goodsNo.forEach(no => {

                        if (orderList[no] && orderList[no] > 0) {
                            allOrderGoods[no] = orderList[no];

                        }

                    });
                    const post_order_goods_url = pageNum == 2 ? 'https://api.zonn.xyz/goods_num/append_order_goods' : 'https://api.zonn.xyz/goods_num/write_order_goods'
                    fetch(post_order_goods_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(allOrderGoods)
                    })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));
                });





        }

        function updateOrders() {

            fetch('https://api.zonn.xyz/goods_num/read_file_orders')
                .then(response => response.json())
                .then(data => {
                    const orders = data.data;
                    console.log(orders)
                    $('.express_input--Acc7V').each(function (index) {
                        const value = $(this).val();
                        console.log(value)
                        // 检查value是否存在于orders数组中
                        const order = orders.find(order => order.orderNO === value);

                        if (order) {
                            // 打印出索引
                            $(this).parents('.position_wrap--rJCbU').find('.merge_label--l6zik').click()
                            console.log('OrderNO:', value, 'Index:', index);
                        }
                    });
                })
            // 弹出输入框
            // const userInput = prompt("请输入orderNO:");

            // if (userInput) {
            //     const orders = JSON.parse(userInput)

            //     $('.express_input--Acc7V').each(function(index) {
            //         const value = $(this).val();
            //         console.log(value)
            //         // 检查value是否存在于orders数组中
            //         const order = orders.find(order => order.orderNO === value);

            //         if (order) {
            //             // 打印出索引
            //             $(this).parents('.position_wrap--rJCbU').find('.merge_label--l6zik').click()
            //             console.log('OrderNO:', value, 'Index:', index);
            //         }
            //     });
            // }
        }
        function distribution() {
            const els = $('.search_result_box tr')
            let countObj = {};
            els.map((i, row) => {

                const groupData = [];
                $(row).find('td:gt(1)').each(function () {
                    // console.log($(this).text());
                    // groupData.push($(this).text())
                    const num = $(this).text()
                    if (num.indexOf('9999') == -1) {
                        if (countObj[num]) {
                            countObj[num]++;
                        } else {
                            countObj[num] = 1;
                        }
                    }


                });

                //   allNum.push(groupData)






            })
            const sortedKeys = Object.keys(countObj).sort();
            let combinedStringOutput = "";
            sortedKeys.forEach(key => {
                combinedStringOutput += `${key}: ${countObj[key]}\n`;
            });
            console.log(combinedStringOutput)
        }

        function submitChecked(type) {
            // const list = $('.search_result_box input:checked').parents('tr').get().reverse()
            // submitNum($(list))



            const goodsGroup = []
            const rows = $('.position_wrap--rJCbU').map((i, row) => { if ($('.merge_label--l6zik:checked', row).length > 0) { return row } })
            rows.map((i, row) => {
                const goodsRows = [];

                let KDNo = $('.express_input--Acc7V', row).val();
                const orderNum = $('.col--Gyg8q', row).eq(1).text();
                const orderNote = [];

                $('.buyer_memo_icon--k_YL3', row).each((i, el) => {
                    const code = $(el).next().text();
                    orderNote.push(code)

                });
                $('.mark_flag--JMDNm', row).each((i, el) => {
                    const code = $(el).next().text();
                    orderNote.push(code)

                });

                $('.row-order--F9dqJ', row).each((i, col) => {
                    debugger
                    if ($('.checkbox-icon--yMJDQ.checked--R3g0E', col).length == 0)
                        return
                    const str = $(col).text();
                    const isChecked = $('.checked--R3g0E', col).length > 0 ? true : false;
                    if (isChecked) {
                        const regex = /[A-Za-z]+\d+/;
                        const match = str.match(regex);

                        if (match) {
                            const numId = match[0];
                            const multiple = $('.num-red--Odkce', col).text().substr(1);

                            if (multiple) {
                                for (var i = 0; i < multiple; i++) {
                                    goodsRows.push(numId)
                                }
                            } else {
                                goodsRows.push(numId)
                            }




                            //console.log(numId);  // 输出结果为 "B215"
                        }
                    }

                })
                goodsGroup.push({ kdNo: KDNo, numId: goodsRows, pageSize: rows.length, orderNum: orderNum, orderNote: orderNote })

            })




            fetchGoodsNum(goodsGroup, type)

            // const checkTr =  $('.search_result_box input:checked').parents('tr')
            // const allGroupData = [];
            // checkTr.map((i, row)=>{
            //     if(i<28){
            //         const groupData = [];
            //         $(row).find('td:gt(1)').each(function() {
            //             // console.log($(this).text());
            //             groupData.push($(this).text())
            //           });
            //           if(groupData.length>1){
            //             allGroupData.push(groupData)
            //             if(!$('input', row).is(':checked')){
            //                 $('input', row).click();
            //             }
            //           }


            //     }

            // })
            // console.log(allGroupData)
        }

        function selectGroup() {
            submitNum($('.search_result_box tr[id]'))
            // const allGroupData = [];
            // $('.search_result_box tr[id]').map((i, row)=>{
            //     if(i<28){
            //         const groupData = [];
            //         $(row).find('td:gt(1)').each(function() {
            //             // console.log($(this).text());
            //             groupData.push($(this).text())
            //           });
            //           if(groupData.length>1){
            //             allGroupData.push(groupData)
            //             if(!$('input', row).is(':checked')){
            //                 $('input', row).click();
            //             }
            //           }


            //     }

            // })
            // console.log(333333, allGroupData)
            // fetch('https://api.zonn.xyz/goods_num/write_ini', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(allGroupData)
            // })
            // .then(response => response.json())
            // .then(data => console.log(data))
            // .catch(error => console.error('Error:', error));


        }




        function submitNum(els) {
            // $('.operate--YrAAc').click();
            const allGroupData = [];
            let groupDataLen = 0;
            els = $('.position_wrap--rJCbU')
            els.each(function (i) {
                if (i == 0) return;
                let isPrint = $(`.printMarkStatus--lNBkz`, this).size();
                if (isPrint == 0) {
                    const groupData = [];
                    const num = $('.packageItem--K9FcL>div', this).eq(2).text();

                    if (num == 1) {
                        const text = $('.order_message--h82R2', this).text();
                        const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
                        console.log(dateMatch, 1111111)

                        if (dateMatch) {
                            const extractedDate = new Date(dateMatch[0]);
                            const currentDate = new Date();

                            // 计算两个日期的时间差，得到的结果是毫秒数
                            const diffTime = currentDate - extractedDate;

                            // 将毫秒数转换为天数
                            const diffDays = diffTime / (1000 * 60 * 60 * 24);
                            const amountMatch = text.match(/订单金额(\d+\.\d+)元/);
                            const discountMatch = text.match(/总优惠金额: (\d+\.\d+)/);
                            const payMatch = text.match(/实付(\d+\.\d+)元/);

                            // console.log(payMatch)
                            if (diffDays >= 10) {
                                groupData.push($(this).text());
                                console.log("符合条件：大于等于10天");
                            } else if (diffDays >= 7 && payMatch[1] >= 3.99) {
                                groupData.push($(this).text());
                                console.log("大于7，价格>=3.99");
                            } else if (diffDays > 4 && payMatch[1] >= 6.99) {
                                groupData.push($(this).text());
                                console.log("大于4，价格>=6.99");
                            }else  if (payMatch[1] >= 9.99) {
                                groupData.push($(this).text());
                                console.log("价格>=9.99");
                            }



                            // if(diffDays >= 10){
                            //     groupData.push($(this).text());
                            //     console.log("超过10天了,价格小于2.99:", dateMatch[0]);
                            // }else if (diffDays > 4 && amountMatch[1] >= 6.99 && discountMatch<=3) {
                            //     groupData.push($(this).text())
                            //     console.log("超过4天了:", dateMatch[0]);
                            // } else if(amountMatch[1] >= 9.99) {
                                

                            //     groupData.push($(this).text())



                            //     console.log("日期在3天以内:", dateMatch[0]);
                            // }
                        } else {
                            console.log("未找到日期");
                        }
                    } else {
                        $('.row-order--F9dqJ', this).each(function () {
                            if ($('.checked--R3g0E', this).size() > 0) {

                                const str = $('.order-text--wMObF', this).text().split(' ')[0];
                                const regex = /[A-Za-z]+\d+/;
                                const match = str.match(regex);
                                // console.log('111111111111', str)
                                if (match) {
                                    const numId = match[0];
                                    groupData.push(numId)
                                }

                            }
                        })

                        console.log("多个");
                    }
                    if (groupData.length != 0) {
                        allGroupData.push(groupData);
                        let o = $(`.merge_label--l6zik`, this);
                        if (!o.is(":checked")) {
                            o.click();

                        }

                    }
                }

            });
            // $('.operate--YrAAc').click();
            // els.map((i, row) => {
            //     let id = 'num_' + $(row).attr('id').replace('label_', '').replace('_byToolbar', '') + '_byToolbar';
            //     let isPrint = $(`#${id} .printMarkStatus--lNBkz`).size();
            //     const productsNum = 36 * goodsGroupSize;
            //     if (isPrint == 0 && groupDataLen < productsNum) {
            //         groupDataLen++;
            //         const groupData = [];
            //         $(row).find('td:gt(1)').each(function () {
            //             // console.log($(this).text());
            //             groupData.push($(this).text())
            //         });
            //         if (groupData.length > 1) {
            //             allGroupData.push(groupData)
            //             if (!$('input', row).is(':checked')) {
            //                 $('input', row).click();
            //             }
            //         }


            //     }

            // })
            console.log(333333, allGroupData)
            // fetchGoodsNum(allGroupData, pageIndex);

        }

        function fetchGoodsNum(allGroupData, type) {
            // const pageIndex = $('.ant-pagination-item-active').text();
            const url = type == 1 ? 'https://api.zonn.xyz/goods_num/write_file' : 'https://api.zonn.xyz/goods_num/append_file';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(allGroupData)
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
        }

        function selectInputAndAddEventListener() {
            const input = document.querySelector('#searchNumByCC');

            document.addEventListener('keydown', function (event) {
                console.log(event.key);
                if (event.metaKey && event.key === 'f') {

                    console.log(1111);
                    input.focus();
                    input.select();
                    event.preventDefault();
                }
            });

            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    // 在这里执行您想要的操作



                    let id = $.trim($('#searchNumByCC').val());
                    if (id == 'send') {
                        $('.ant-btn.ant-btn-default.ant-btn-lg.btn-big-bold.bg-green').click();
                        setTimeout(function () {
                            $('.ant-btn.ant-btn-primary.ant-btn-sm.modal-confirm-footer-btn').click();
                        }, 500);
                        setTimeout(function () {
                            $('.print-btn[data-act-name="print_confirm_submit"]').get(0).click();
                        }, 1500);


                        cancelToolBarChecked();
                    } else {
                        let total = 0;
                        $('.search_result_box td').each((i, item) => {
                            if ($(item).text() == id) {
                                total++;
                            }
                            // console.log($(item).text())
                        })
                        // 创建新的 SpeechSynthesisUtterance 对象
                        var message = new SpeechSynthesisUtterance();

                        // 设置要朗读的文字内容
                        message.text = `${total}件`;

                        // 设置朗读的语言为中文（普通话）
                        message.lang = 'zh-CN';

                        // 获取所有可用的语音列表
                        var voices = window.speechSynthesis.getVoices();

                        // 找到一个中文（普通话）的男声语音
                        // var chineseMaleVoice = voices.find(voice => voice.lang === 'zh-CN' && voice.name.includes('男'));

                        // 设置朗读的语音为中文（普通话）的男声
                        // message.voice = chineseMaleVoice;

                        // 使用浏览器的 SpeechSynthesis API 朗读文字
                        window.speechSynthesis.speak(message);

                        // if (id.length >= 4) {
                        //     id = id.substr(1);
                        // }

                        // let total = $(`#label_${id}_byToolbar`).parent().find('td').size();
                        // if(total>0)total -= 1
                        // let userIndex = $(`#label_${id}_byToolbar`).parent().find('td').eq(0).text();
                        // if (total == 0) {
                        //     //$('#audioZeroToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/zero.mp3');
                        //     $('#audioZeroToolbarByCC').get(0).play();
                        // } else if (total == 1) {
                        //     //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                        //     $('#audioOneToolbarByCC').get(0).play();
                        // } else if (total == 2) {
                        //     //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                        //     // $('#audioTwoToolbarByCC').get(0).play();
                        //     $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        // } else if (total == 3) {
                        //     //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                        //     // $('#audioThreeToolbarByCC').get(0).play();
                        //     $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        // } else if (total == 4) {
                        //     //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                        //     // $('#audioFourToolbarByCC').get(0).play();
                        //     $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();

                        // } else if (total > 4) {
                        //     //$('#audioMoreToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/more.mp3');
                        //     // $('#audioMoreToolbarByCC').get(0).play();
                        //     $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        // }

                        // if (total > 0) {
                        //     if (total == 1) {
                        //         if (!$(`#label_${id}_byToolbar input`).is(':checked')) {
                        //             $(`#label_${id}_byToolbar input`).click();
                        //         }

                        //     }

                        //     $('#toolBarByCC td').removeClass('cur_num_byToolbar');
                        //     $(`#label_${id}_byToolbar`).addClass('cur_num_byToolbar').addClass('num_changed_byToolbar');

                        //     $('.search_result').text($(`#label_${id}_byToolbar`).size());


                        //     //锚点到编号
                        //     const boxTop = $('.search_result_box').scrollTop();
                        //     const toScrollTop = boxTop + $(`#label_${id}_byToolbar`).offset().top - 100
                        //     $('.search_result_box').scrollTop(toScrollTop);




                        //     let searchAllStr = localStorage.getItem('toolbarSearchValue');
                        //     let existingRecord = searchAllStr ? JSON.parse(searchAllStr) : {};
                        //     let currentDate = new Date().toISOString().split('T')[0];  // 获取当前日期，格式为 'YYYY-MM-DD'

                        //     // 检查是否存在当天的记录
                        //     // let existingRecord = searchAll.date === currentDate;
                        //     if (existingRecord.date === currentDate) {
                        //         // 当天的记录已存在，将 id 添加到已存在的记录中
                        //         let existingRecordById = existingRecord.ids.find(_id => _id === id);
                        //         if (existingRecordById === undefined) {
                        //             existingRecord.ids.push(id);
                        //         }

                        //     } else {
                        //         // 当天的记录不存在，创建新的记录对象
                        //         let newRecord = {
                        //             date: currentDate,
                        //             ids: [id]
                        //         };
                        //         existingRecord = newRecord;
                        //     }

                        //     localStorage.setItem('toolbarSearchValue', JSON.stringify(existingRecord));


                        //     // let searchAllStr = localStorage.getItem('toolbarSearchValue');
                        //     // let searchAll = searchAllStr ? JSON.parse(searchAllStr) : [];
                        //     // searchAll.push(id);
                        //     // localStorage.setItem('toolbarSearchValue',JSON.stringify(searchAll));


                        // }


                    }
                    $('#searchNumByCC').val('');
                    event.preventDefault();


                }
            });
        }

        function readToolBarValue() {
            let searchAllStr = localStorage.getItem('toolbarSearchValue');
            let searchAll = searchAllStr ? JSON.parse(searchAllStr) : {};
            searchAll.ids.forEach(id => {
                $(`#label_${id}_byToolbar`).addClass('num_changed_byToolbar');
            });

        }
        function resetToolBarValue() {
            localStorage.setItem('toolbarSearchValue', '');
        }
        function cancelToolBarChecked() {
            $("#toolBarByCC input:checked").click()
        }
        function checkToolBarChecked() {
            // 获取当前容器下的所有tr元素
            const trs = document.querySelector('.search_result_box').querySelectorAll('tr');

            // 遍历每个tr元素
            trs.forEach(tr => {
                // 获取当前行下的所有td元素
                const tds = tr.querySelectorAll('td:not(:first-child)');
                console.log(tds)
                // 检查是否所有的td元素都具有num_changed_byToolbar类
                let allTdsHaveClass = true;
                tds.forEach(td => {
                    if (!td.classList.contains('num_changed_byToolbar')) {
                        allTdsHaveClass = false;
                        return; // 如果有一个td没有类，则跳出循环
                    }
                });
                console.log(allTdsHaveClass)
                // 如果是，则将该行中的所有复选框选中
                if (allTdsHaveClass) {
                    const checkboxes = tr.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        if (!$(checkbox).is(':checked')) {
                            $(checkbox).click();
                        }
                    });
                }
            });
        }
        // selectInputAndAddEventListener();


        //监听订单列表变化，如果有更新重新加载控件
        var target = document.querySelector('.content.batch_box');
        var i = 0;
        var observe = new MutationObserver(function (mutations, observe) {
            debugger
            i++
            callInit();
        });
        observe.observe(target, { childList: true });

        // var target = document.querySelector('.table--T5hoR');
        // var i = 0;
        // var observe = new MutationObserver(function (mutations, observe) {
        //     debugger
        //     i++
        //     callInit();
        // });
        // observe.observe(target);




        //监听是否发货成功，发货成功dom会删除
        var target = document.querySelector('.table--T5hoR');
        var observe = new MutationObserver(function (mutations, observe) {
            $('#toolBarByCC input[type="checkbox"]:checked').each((i, item) => {
                $(item).parents('tr').remove()


            });
            $('#toolBarByCC').remove();
            callInit();
        });
        observe.observe(target, { childList: true });


        // 自动添加产品图
        // debugger
        // console.log(1111111111111, $('.order-content--hF71n .order-text--wMObF').size())
        $('.order-content--hF71n .order-text--wMObF').each(function () {
            const str = $(this).text().split(' ')[0];
            const regex = /[A-Za-z]+\d+/;
            const match = str.match(regex);
            // console.log('111111111111', str)
            if (match) {
                const numId = match[0];
                // console.log(numId)
                $(this).parent().prev().attr('src', `http://api.zonn.xyz/web/products/${numId}.jpg`).width(80).height(80);
            }

        });




    }

    function getLabelNewNum(num) {

        let random = 0;
        let id = `num_${num}_byToolbar`;
        let labelID = `label_${num}_byToolbar`;
        // label_999_byToolbar


        // 检查ID是否存在，如果存在则在num后面加_1
        if (document.getElementById(id) !== null) {
            random++;
            // id = `num_${num}_${random}_byToolbar`;

            num = `${num}_${random}`


            if (!newIds.includes(labelID)) {
                newIds.push(labelID);
            }
            // 将新的 ID 存储起来
            newIds.push(`label_${num}_byToolbar`);
        }

        return num;
    }



    // 在 init 函数中，处理背景色的逻辑
    function handleBackgroundColors() {
        // 循环遍历新的 ID，并为相应的 <td> 元素添加背景色
        newIds.forEach((id) => {
            $(`#${id}`).addClass('error_tipsss');
        });
    }







})();