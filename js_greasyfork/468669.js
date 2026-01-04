// ==UserScript==
// @name         订单插件
// @version      1.9.6
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
// @require      https://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468669/%E8%AE%A2%E5%8D%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/468669/%E8%AE%A2%E5%8D%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_log('11111 download is running.');

    const getNum = (num) => {
        return num.toString().substr(0,3);
    }
    // 去除可能的后缀的方法
    const removeSuffix = (value) => {
        // 根据具体需求去除后缀，这里示例去除下划线及其后面的数字
        return value.replace(/_\d+$/, '');
    }
    // 判断是否已经存在数组里，如果是就返回对应索引，为了将重复的号码归一组
    const getGroupIndex = (groupData, data) =>{
       
        const _data = data.map(element => removeSuffix(element));
        // console.log(_data)

        // 用于存储找到的索引
        var foundIndexes = { threeDIndex: -1, twoDIndex: -1 };
        try {
            // 遍历三维数组
            groupData.forEach((twoDimensionalArray,i)=>{
                // 遍历二维数组
                twoDimensionalArray.forEach((subArray,j) => {
                    // 检查是否存在匹配的值
                    // 取前3位，避免111_1这种
                    // console.log(subArray)
                    if(subArray.some(element => {
                        // 使用Array.includes方法检查另一个数组中是否包含相同的元素
                        const value = removeSuffix(element)
                        if(value == '9999' || value == '00'){
                            return false
                        }
                        return _data.includes(removeSuffix(element));
                    })){
                        foundIndexes["threeDIndex"] = i;
                        foundIndexes["twoDIndex"] = j;
                        throw new Error('StopIteration');
                    }

                    // if (getNum(subArray[0]) === getNum(data[0]) || getNum(subArray[1]) === getNum(data[1])) {
                    
                    // }
                })
                
            })
        }catch (error) {
            return foundIndexes
        }
       
        return foundIndexes;
    }

    function callInit() {
        setTimeout(() => {
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
        


        const audio = new Audio();
        audio.hidden = true;
        audio.src = `https://hk3.zonn.xyz/music/${num.toLowerCase()}.mp3`; // 设置src属性
        audioElements[`audio${num}ToolbarByCC`] = audio;
        if(num=='Four' || num=='More'){
            for(let i=0;i<=10;i++){
                const audio = new Audio();
                audio.hidden = true;
                audio.src = `https://hk3.zonn.xyz/music/9_${i}.mp3`; // 设置src属性
                audioElements[`audio9_${i}ToolbarByCC`] = audio;
            }
        }
    });

    function init() {
        newIds = [];
        if(document.getElementById('toolBarByCC')){
            document.getElementById('toolBarByCC').remvoe()
        }
        const trTotal = []

        const goodsGroup = [];
        const goodsGroupOne = [];
        $('.col--SgmmZ').map((iindex, value) => {
            const htmlRows = [];
            
            let firstNum = 0;
            let secondNum = 0;
            const result = {};
            // const group = 
            const goodsRows = []
            $('.buyer_memo_icon--k_YL3', value).each((index, span) => {

                const num = $(span).next().get(0).innerText.match(/(\b\d{3}\b)/);
                
                // const numValue = num && num.length >= 1 ? num[0] : '9999';
               
                const text = $(span).next().get(0).innerText;
                const strMatch = text.match(/\b([a-z])\W*(\d{3})\b/i);

                const numValue = strMatch ? strMatch[1].toUpperCase() + strMatch[2] : (num && num.length >= 1 ? num[0] : '9999');
                const numId = getLabelNewNum(numValue);
                if(index == 0){
                    firstNum = numId;
                }
                if(index == 1){
                    secondNum = numId;
                }
                $(span).attr('id', `num_${numId}_byToolbar`);
                goodsRows.push(numId)
            });
           

            // 没有编号用00代替
            const orderQuantity = $('.package-orders-col--j1Eqc').eq(iindex).find('.row-order--F9dqJ').size();
            const noteQuantity = $('.buyer_memo_icon--k_YL3', value).size();
            if (noteQuantity !== orderQuantity) {
                const n = orderQuantity - noteQuantity;
                for (let iii = 0; iii < n; iii++) {
                    const numId = `00_${new Date().getTime().toString().substr(11, 2)}`;
                    goodsRows.push(numId)
                }
            }
           
           
            let groupIndex = 0

            if(goodsRows.length==1){
                groupIndex = 11;
                goodsGroupOne.push(goodsRows)
            }else{
                const groupIndexs = getGroupIndex(goodsGroup, goodsRows)
                if(groupIndexs["threeDIndex"] != -1){
                    groupIndex = groupIndexs["threeDIndex"]
                }else{
                    
                    groupIndex = String(firstNum)[2]
                    // if(goodsGroup[groupIndex] && goodsGroup[groupIndex].length > 10){
                    //     groupIndex = String(firstNum)[1]
                    // }
                    
                }
                // const groupIndex = groupIndexs["threeDIndex"] != -1 ? groupIndexs["threeDIndex"] : String(firstNum)[2];
                console.log(goodsRows)
                if(!goodsGroup[groupIndex]){
                    goodsGroup[groupIndex] = [];
                }
                
                goodsGroup[groupIndex].push(goodsRows)
                
                
            }

            
        })
        if(!goodsGroup[11]){
            goodsGroup[11] = [];
        }
        goodsGroup[11].push(...goodsGroupOne)

        console.log(goodsGroup)
        




        const boxHTML = `
            <div id="toolBarByCC">
                <div class="search_bar_by_toolbar">
                    ${Object.keys(audioElements).map((key) => `<audio id="${key}" hidden="${audioElements[key].hidden}" src="${audioElements[key].src}"></audio>`).join('\n')}
                    <div class="btn_read_toolbar">
                        <input id="searchNumByCC" />
                        <span class="search_result"></span>
                        <button id="btnCheckByToolbar">检查</button></button></button>
                        <button id="btnCancelByToolbar">取消</button>
                        <button id="btnReadByToolbar">读取</button>
                        <button id="btnResetByToolbar">重置</button>
                    </div>
                </div>
                <div class="search_result_box">
                    <table>
                        ${
                            
                            goodsGroup.map((threeObj, groupNum) => {
                                return threeObj.map(twoObj => {
                                    const rowCells = twoObj.map(numId => {
                                        return `<td style="width:60px" id="label_${numId}_byToolbar"><input name="Fruit" type="checkbox" value="" /><label>${numId}</label></td>`;
                                    }).join('');
                            
                                    return `<tr><td>${groupNum}</td>${rowCells}</tr>`;
                                }).join('');
                            }).join('')
                            
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
                    </table>
                </div>
            </div>`;
        $('.list_table--JKyS4').prepend(boxHTML);

        // tabler排序
        const table = document.querySelector('#toolBarByCC table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        // Sort rows based on the number of cells in each row
        rows.sort((a, b) => a.children.length - b.children.length);

        // Remove existing rows
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        // Append sorted rows back to the table
        rows.forEach(row => tbody.appendChild(row));


        handleBackgroundColors();

        $('body').append(`<style>
            #container{margin-left:600px}
            #toolBarByCC{position:fixed;top:0px;left:0;z-index:999}
            .cur_num_byToolbar{background:#9bdfff}
            .num_changed_byToolbar{color:#f00}
            .cur_num_byToolbar.error_tipsss{background:#2fff14;color:#365064}
            #toolBarByCC{height:90vh;width:600px;height:90vh;background:#fff;border:1px solid #333;padding:20px;    box-sizing: border-box;}
            .search_result_box{height:80vh;overflow-y:scroll}
            .search_bar_by_toolbar{border:2px solid #fff;}
            #searchNumByCC{padding:5px;width:110px}
            .btn_read_toolbar{text-align:center}
            .btn_read_toolbar button{margin:0 5px}
            .error_tipsss{background:#f00;color:#fff}

        </style>`);

        $('#toolBarByCC label').click(function () {

            console.log($(this).text());

            let id = 'num_' + $(this).text() + '_byToolbar';
            $(document).scrollTop($('#' + id).offset().top - 50);
        });

        $('#toolBarByCC input').click(function () {
            let id = $(this).next().text();
            let inputChecked = $(this).is(":checked");



            let total = $(`#label_${id}_byToolbar`).parent().find('td').size() - 1;
            if (total > 1) {
                if ($(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').is(":checked") == false && $(`#label_${id}_byToolbar`).parent().find('input[type="checkbox"]:checked').size() > 0) {
                    $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').click();
                }

                if ($(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').is(":checked") == true && $(`#label_${id}_byToolbar`).parent().find('input[type="checkbox"]:checked').size() == 0) {
                    $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik').click();
                }


                let dom = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.opt--sQWb4').eq(0);
                let isDomOpen = dom.text().indexOf('收起') > -1 ? true : false;
                if (isDomOpen == false) {
                    dom.click();
                    setTimeout(() => {
                        $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').next().find('.goods_item--XquYR>input[type="checkbox"]').click();
                    }, 100)


                }
                setTimeout(() => {
                    let i = $(`#label_${id}_byToolbar`).index() - 1;
                    let o = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').next().find('.goods_item--XquYR>input[type="checkbox"]').eq(i);
                    if (o.is(":checked") != inputChecked) {
                        o.click();
                    }
                }, 150)

            } else {
                let o = $(`#num_${id}_byToolbar`).parents('.packageItem--K9FcL').find('.merge_label--l6zik');
                if (o.is(":checked") != inputChecked) {
                    o.click();
                }

            }

        });

        $('#btnReadByToolbar').click(readToolBarValue);
        $('#btnResetByToolbar').click(resetToolBarValue);
        $('#btnCancelByToolbar').click(cancelToolBarChecked);
        $('#btnCheckByToolbar').click(checkToolBarChecked);


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



                    let id = $('#searchNumByCC').val().trim();
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
                        
                        if (id.length >= 4 && id[0] == '0') {
                            id = id.substr(1);
                        }

                        let total = $(`#label_${id}_byToolbar`).parent().find('td').size();
                        if(total>0)total -= 1
                        let userIndex = $(`#label_${id}_byToolbar`).parent().find('td').eq(0).text();
                        if (total == 0) {
                            //$('#audioZeroToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/zero.mp3');
                            $('#audioZeroToolbarByCC').get(0).play();
                        } else if (total == 1) {
                            //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                            $('#audioOneToolbarByCC').get(0).play();
                        } else if (total == 2) {
                            //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                            // $('#audioTwoToolbarByCC').get(0).play();
                            $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        } else if (total == 3) {
                            //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                            // $('#audioThreeToolbarByCC').get(0).play();
                            $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        } else if (total == 4) {
                            //$('#audioOneToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/one.mp3');
                            // $('#audioFourToolbarByCC').get(0).play();
                            $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                            
                        } else if (total > 4) {
                            //$('#audioMoreToolbarByCC').attr('src', 'https://hk3.zonn.xyz/music/more.mp3');
                            // $('#audioMoreToolbarByCC').get(0).play();
                            $(`#audio9_${userIndex}ToolbarByCC`).get(0).play();
                        }

                        if (total > 0) {
                            if (total == 1) {
                                if (!$(`#label_${id}_byToolbar input`).is(':checked')) {
                                    $(`#label_${id}_byToolbar input`).click();
                                }

                            }

                            $('#toolBarByCC td').removeClass('cur_num_byToolbar');
                            $(`#label_${id}_byToolbar`).addClass('cur_num_byToolbar').addClass('num_changed_byToolbar');

                            $('.search_result').text($(`#label_${id}_byToolbar`).size());


                            //锚点到编号
                            const boxTop = $('.search_result_box').scrollTop();
                            const toScrollTop = boxTop + $(`#label_${id}_byToolbar`).offset().top - 100
                            $('.search_result_box').scrollTop(toScrollTop);




                            let searchAllStr = localStorage.getItem('toolbarSearchValue');
                            let existingRecord = searchAllStr ? JSON.parse(searchAllStr) : {};
                            let currentDate = new Date().toISOString().split('T')[0];  // 获取当前日期，格式为 'YYYY-MM-DD'

                            // 检查是否存在当天的记录
                            // let existingRecord = searchAll.date === currentDate;
                            if (existingRecord.date === currentDate) {
                                // 当天的记录已存在，将 id 添加到已存在的记录中
                                let existingRecordById = existingRecord.ids.find(_id => _id === id);
                                if (existingRecordById === undefined) {
                                    existingRecord.ids.push(id);
                                }

                            } else {
                                // 当天的记录不存在，创建新的记录对象
                                let newRecord = {
                                    date: currentDate,
                                    ids: [id]
                                };
                                existingRecord = newRecord;
                            }

                            localStorage.setItem('toolbarSearchValue', JSON.stringify(existingRecord));


                            // let searchAllStr = localStorage.getItem('toolbarSearchValue');
                            // let searchAll = searchAllStr ? JSON.parse(searchAllStr) : [];
                            // searchAll.push(id);
                            // localStorage.setItem('toolbarSearchValue',JSON.stringify(searchAll));


                        }


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
        function checkToolBarChecked(){
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
        selectInputAndAddEventListener();


        //监听订单列表变化，如果有更新重新加载控件
        var target = document.querySelector('.content.batch_box');
        var i = 0;
        var observe = new MutationObserver(function (mutations, observe) {
            i++
            callInit();
        });
        observe.observe(target, { childList: true });


        //监听是否发货成功，发货成功dom会删除
        var target = document.querySelector('.table--T5hoR');
        var observe = new MutationObserver(function (mutations, observe) {
            $('#toolBarByCC input[type="checkbox"]:checked').each((i, item) => {
                $(item).parent().remove()

            })
        });
        observe.observe(target, { childList: true });





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