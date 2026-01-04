// ==UserScript==
// @name         问卷星自动重复提交
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  自动重复提交问卷星问卷
// @author       xuhaibo
// @match        https://www.wjx.cn/*
// @icon         https://img.wxcha.com/m00/55/20/fb56b8fbf0b1da032771414c3dcee029.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511486/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E9%87%8D%E5%A4%8D%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/511486/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E9%87%8D%E5%A4%8D%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // ===============================================参数================================
    // 选中停留
    let time_interval = 200


    // ===============================================依赖数据================================
    // 读取和存放数据
    let user_obj = {
        get: function (key) {
            console.log('读取 key = ', key, ' value = ', JSON.parse(sessionStorage.getItem(key)))
            return JSON.parse(sessionStorage.getItem(key));
        },
        set: function (key, value) {
            console.log('存储 key = ', key, ' value = ', value)
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }

    // ===============================================创建元素================================
    let create_button = function (text, bottom, fun) {
        console.log('添加按钮 = ', text)
        // 创建按钮
        const button = document.createElement('button');
        // 设置按钮样式
        button.style.position = 'fixed'; // 固定定位
        button.style.zIndex = '9999999999';
        button.style.bottom = bottom + 'px'; // 距离底部20像素
        button.style.right = '20px'; // 距离右侧20像素
        button.style.maxWidth = '250px'; // 按钮宽度
        button.style.padding = '15px';
        button.style.backgroundColor = '#007bff'; // 背景颜色
        button.style.color = '#ffffff'; // 文字颜色
        button.style.border = 'none'; // 无边框
        button.style.borderRadius = '10px'; // 圆角
        button.style.cursor = 'pointer'; // 鼠标指针样式
        button.style.fontSize = '20px';
        button.innerText = text; // 按钮文本
        button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; // 添加阴影
        button.style.border = '2px solid white'; // 添加白色边框
        // 添加悬停效果
        button.style.transition = 'transform 0.5s ease'; // 将过渡时间设置为 1 秒

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)'; // 悬停放大

        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)'; // 还原大小
        });

        // 定义点击事件处理函数
        function handleClick() {
            console.log(text + '按钮被点击了！');
            fun(button);
            // button.style.backgroundColor = '#9dd4fa';
            // button.innerText = click_text;
            // 移除事件监听器
            // button.removeEventListener('click', handleClick);
        }

        // 添加点击事件
        button.addEventListener('click', handleClick);

        // 将按钮添加到页面
        document.body.appendChild(button);

        return button;
    }

    let create_input = function (text, bottom, id, fun = (input) => {
    }) {
        // 创建容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = '9999999999';
        container.style.bottom = bottom + 'px';
        container.style.right = '20px'; // 距离右侧20像素
        container.style.backgroundColor = '#3192fa'; // 设置背景颜色为蓝色
        container.style.color = '#ffffff';
        container.style.border = '2px solid white'; // 添加白色边框
        container.style.padding = '6px';
        container.style.borderRadius = '10px';
        // 创建标题
        const label = document.createElement('label');
        label.textContent = text + '：';

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 99999;
        input.style.width = '100px';
        input.style.fontSize = '18px';
        input.style.border = '2px solid white';
        input.id = id
        input.value = 100;
        // 添加输入事件监听器以限制输入值
        input.addEventListener('input', function () {
            // 转换输入值为数字
            console.log('触发输入事件 = ',)
            const value = Number(input.value);
            // 如果输入的值小于1或大于99999，则重置为空
            if (value < 1 || value > 9999999 || isNaN(value)) {
                input.value = '';
            }
        });

        // 将标题和输入框添加到容器中
        container.appendChild(label);
        container.appendChild(input);

        fun(input)

        // 将容器添加到网页中
        document.body.appendChild(container);

        return input
    }

    let create_input_min_max = function (text, bottom) {
        // 创建容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = '9999999999';
        container.style.bottom = bottom + 'px';
        container.style.right = '20px'; // 距离右侧20像素
        container.style.backgroundColor = '#3192fa'; // 设置背景颜色为蓝色
        container.style.color = '#ffffff';
        container.style.border = '2px solid white'; // 添加白色边框
        container.style.padding = '6px';
        container.style.borderRadius = '10px';
        // 创建标题
        const label = document.createElement('label');
        label.textContent = text + '：';

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 99999;
        input.style.width = '100px';
        input.style.fontSize = '18px';
        input.style.border = '2px solid white';
        input.value = 1;
        input.style.width = '50px';
        input.style.display = 'inline-block'; // 设置为行内块元素
        input.style.marginLeft = '10px'; // 左边距为10px
        // 添加输入事件监听器以限制输入值
        input.addEventListener('input', function () {
            // 转换输入值为数字
            console.log('触发输入事件 = ',)
            const value = Number(input.value);
            // 如果输入的值小于1或大于99999，则重置为空
            if (value < 1 || value > 9999999 || isNaN(value)) {
                input.value = '';
            }
        });

        // 创建输入框
        const input2 = document.createElement('input');
        input2.type = 'number';
        input2.min = 1;
        input2.max = 99999;
        input2.style.fontSize = '18px';
        input2.style.border = '2px solid white';
        input2.style.width = '50px';
        input2.style.display = 'inline-block'; // 设置为行内块元素
        input2.style.marginLeft = '10px'; // 左边距为10px
        input2.value = 2;
        // 添加输入事件监听器以限制输入值
        input2.addEventListener('input', function () {
            // 转换输入值为数字
            console.log('触发输入事件 = ',)
            const value = Number(input.value);
            // 如果输入的值小于1或大于99999，则重置为空
            if (value < 1 || value > 9999999 || isNaN(value)) {
                input2.value = '';
            }
        });

        // 创建伪类内容（文本）
        const span = document.createElement('span');
        span.textContent = '到'; // 伪类内容
        span.style.marginLeft = '7px'; // 左边距
        span.style.color = 'white'; // 文字颜

        // 将标题和输入框添加到容器中
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(span);
        container.appendChild(input2);

        // 将容器添加到网页中
        document.body.appendChild(container);

        return function () {
            return [Number(input.value), Number(input2.value)]
        }
    }


    // 处理选项，思路是取当前提交的数据，为下一次选择做参数
    // ===============================================处理单选================================
    let save_ui_radio_value = function () {
        let arr_ui_radio_value = []
        let arr_ui_radio_checked = document.querySelectorAll('.ui-radio.checked')

        for (let i = 0; i < arr_ui_radio_checked.length; i++) {
            arr_ui_radio_value.push(arr_ui_radio_checked[i].innerText)
        }
        user_obj.set('arr_ui_radio_value', arr_ui_radio_value);
    }


    let auto_do_ui_radio = async function () {
        let arr_value = user_obj.get('arr_ui_radio_value')
        let arr_note_ui_radio = document.querySelectorAll('.ui-radio')

        for (let note of arr_note_ui_radio) {
            if (!arr_value.length) return
            if (note.innerText == arr_value[0]) {

                // 闭包
                await new Promise((resolve) => {
                    setTimeout(() => {
                        note.click()
                        resolve()
                    }, time_interval)
                })

                console.log('单选选中 = ', note.innerText)

                arr_value.shift()
            }
        }
    }

    // ===============================================处理多选================================
    let save_ui_checkbox_value = function () {
        let arr_ui_checkbox_value = []
        let arr_note_ui_checkbox_value = document.querySelectorAll('.ui-checkbox.checked')
        console.log(' arr_note_ui_checkbox_value= ', arr_note_ui_checkbox_value)

        for (let i = 0; i < arr_note_ui_checkbox_value.length; i++) {
            arr_ui_checkbox_value.push(arr_note_ui_checkbox_value[i].innerText)
        }
        user_obj.set('arr_ui_checkbox_value', arr_ui_checkbox_value);
    }


    let auto_do_ui_checkbox = async function () {
        let arr_value = user_obj.get('arr_ui_checkbox_value')
        let arr_note_ui_checkbox = document.querySelectorAll('.ui-checkbox')

        for (let note of arr_note_ui_checkbox) {
            if (!arr_value.length) return
            if (note.innerText == arr_value[0]) {

                // 闭包
                await new Promise((resolve) => {
                    setTimeout(() => {
                        note.click()
                        resolve()
                    }, time_interval)
                })


                console.log('多选选中 = ', note.innerText)

                arr_value.shift()
            }
        }
    }
    // ===============================================处理评分================================
    // rate-off rate-on rate-ontxt
    let save_rate_value = function () {
        let arr_value = []
        let arr_note = document.querySelectorAll('.rate-off.rate-on.rate-ontxt')

        for (let i = 0; i < arr_note.length; i++) {
            arr_value.push(arr_note[i].innerText)
        }
        user_obj.set('arr_rate_value', arr_value);
    }


    let auto_do_rate = async function () {
        let arr_value = user_obj.get('arr_rate_value')
        let arr_note = document.querySelectorAll('.scale-rating')
        console.log('arr_note = ', arr_note)
        for (let i = 0; i < arr_note.length; i++) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    arr_note[i].querySelector('ul').querySelectorAll('li')[arr_value[i] - 1].click()
                    resolve()
                }, time_interval)
            })
        }
    }
    // ========================================流程控制=========================================

    // 通过智能点击验证
    let pass_sure = async function () {
        new Promise((resolve) => {
            let time_id = setInterval(() => {
                console.log('找智能按钮认证按钮')
                let pass_bt = document.querySelector('#SM_BTN_1')
                if (pass_bt) {
                    pass_bt.click()
                    console.log('能按钮认 = ', pass_bt)
                    clearInterval(time_id)
                    resolve()
                }
            }, 200)
        })
    }

    // 通过滑块
    let pass_slide = async function () {
        var btn = ''

        await new Promise((resolve) => {
            let time_id = setInterval(() => {
                console.log('找滑块找滑块 = ')
                btn = document.querySelector("#nc_1_n1z");
                if (btn) {
                    console.log('找到滑块btn = ', btn)
                    clearInterval(time_id)
                    resolve()
                }
            }, 200)
        })

        const rect = btn.getBoundingClientRect();
        const startX = rect.left + window.scrollX; // 计算滑块的起始位置
        const startY = rect.top + window.scrollY;

        // 模拟鼠标按下
        btn.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: startX,
            clientY: startY,
        }));

        let dx = 0;
        const totalDistance = 308; // 滑块需要移动的总距离
        const interval = setInterval(() => {
            const mouseX = startX + dx;

            // 模拟鼠标移动
            btn.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                clientX: mouseX,
                clientY: startY,
            }));
            dx += Math.ceil(Math.random() * 50); // 随机增加移动距离
        }, 60);
    }

    // 取消叫去点验证对话框
    let pass_dialog = function () {
        let time_id = setInterval(() => {
            let note = document.querySelector('.layui-layer.layui-layer-dialog')
            if (note) {
                note = note.querySelector('.layui-layer-btn0')
                if (note) {
                    note.click()
                    clearInterval(time_id)
                }
            }
        }, 200)
    }

    // 取消上一次记录
    let pass_dialog_before = function () {
        let time_id = setInterval(() => {
            let note = document.querySelector('.layui-layer.layui-layer-dialog')
            if (note) {
                note = note.querySelector('.layui-layer-btn1')
                if (note) {
                    console.log('取消上一次填写记录 = ')
                    note.click()
                    clearInterval(time_id)
                }
            }
        }, 200)
        setTimeout(() => {
            clearInterval(time_id)
        }, 5000)
    }

    // 确认提交
    let sure_submit = async function () {
        await new Promise(async (resolve) => {
            setTimeout(async () => {
                document.querySelector('.submitbtn.mainBgColor').click()

                // 关闭提示点智能验证
                pass_dialog()
                // 等点智能验证
                await pass_sure()
                // 滚动条，这个之后就结束了
                pass_slide()
                resolve()

            }, 200)
        })
    }

    // 是否存在必填未填
    let hasErrorMessage = function () {
        return new Promise(async (resolve, reject) => {
            setTimeout(() => {

                let arr_field = document.querySelectorAll('.field.ui-field-contain')

                //  ==================是否选过了一个
                let has_one_checked = false
                for (let i = 0; i < arr_field.length; i++) {
                    let temp = arr_field[i].querySelector('.checked')
                    if (temp) {
                        console.log('填写了 = ', temp)
                        has_one_checked = true
                    }
                }
                if (!has_one_checked) {
                    console.log('一个都没有填写！！！！！！！！！！！！！ = ')
                    return reject('先填写完所有必填选项噢，填后点我重试')
                }

                // ==================如果有东西没填写
                for (let i = 0; i < arr_field.length; i++) {
                    let temp = arr_field[i].querySelector('.errorMessage')
                    temp = temp.style.display
                    if (temp == 'block') {
                        console.log('必填未填 = ', temp)
                        return reject('你的必填选项未填噢，填后点我重试')
                    }
                }

                return resolve()

            }, 300 + 100)
        })
    }

    // 移除原来的确认框
    let remove_divSubmit = function () {
        let divSubmit = document.querySelector('#divSubmit')
        divSubmit.style.visibility = 'hidden'
    }


    // 开启脚本
    let start_script = function () {
        // 开启自动选中
        let auto_select = async function () {
            await auto_do_ui_radio()
            await auto_do_ui_checkbox()
            await auto_do_rate()
            await sure_submit()
        }

        // 保存当前选中的数据
        let save_data = function () {
            save_ui_radio_value()
            save_ui_checkbox_value()
            save_rate_value()
        }

        // 是否开启自动提交
        let start_auto = user_obj.get('start_auto')

        if (start_auto) {
            // 创建按钮
            create_button('🔵自动提交中....点我停止自动提交', 50, (button) => {
                user_obj.set('start_auto', false)
                button.innerText = '🟦提交完这份后就会停止'
                button.style.backgroundColor = '#a4dcf5'
                let note_auto_do_num = document.querySelector('#auto_do_num')
                note_auto_do_num.value = '1'
            })

            // 获取数量
            let auto_do_num = user_obj.get('auto_do_num')
            create_input('剩余提交数量', 150, 'auto_do_num', (input) => {
                input.value = auto_do_num
                input.readOnly = true; // 设置输入框为只读
            })

            // 获取数量
            let finish_do_num = user_obj.get('finish_do_num')
            create_input('已提交的数量', 200, 'finish_do_num', (input) => {
                input.value = finish_do_num
                input.readOnly = true; // 设置输入框为只读
            })

            let getRandomInt = function (n, m) {
                console.log('放进来 = ', n, m)
                if(n == m) return 0
                // 确保 n 小于等于 m
                if (n > m) {
                    [n, m] = [m, n];
                }
                return Math.floor(Math.random() * (m - n + 1)) + n;
            }

            if (auto_do_num < 2) {
                // 下次停止
                user_obj.set('start_auto', false)
            } else {
                // 每次减1
                user_obj.set('auto_do_num', auto_do_num - 1)
                // 加1
                user_obj.set('finish_do_num', finish_do_num + 1)
            }

            // Nan和0为false
            let stop_time = getRandomInt( Number(user_obj.get('min_time')), Number(user_obj.get('max_time')))

            if (stop_time) {
                console.log(' 时间限制 = ', stop_time)
                let note_input = ''
                create_input('停留倒计时', 250, 'stop_time', (input) => {
                    input.value = stop_time
                    input.readOnly = true; // 设置输入框为只读
                    note_input = input
                })

                // 显示倒计时
                let time_id = setInterval(function () {
                    stop_time--
                    note_input.value = stop_time
                    if (stop_time == 0) {
                        clearInterval(time_id)
                        auto_select()
                    }
                }, 1000)
            } else {
                console.log('没有时间限制 = ')
                auto_select()
            }

        } else {

            // 获取数量
            // let finish_do_num = user_obj.get('finish_do_num')
            // if(finish_do_num){
            //     create_input('上次完成提交数', 200, 'finish_do_num', (input) => {
            //         input.value = finish_do_num
            //         input.readOnly = true; // 设置输入框为只读
            //     })
            // }

            let get_min_max = create_input_min_max('随机停留时间区间(秒)', 200)

            // let note_stop_time = create_input('提交停留时间(秒)', '200', 'stop_time', (input) => {
            //     input.value = 5
            // })

            let note_auto_do_num = create_input('提交数量', 150, 'auto_do_num')

            create_button('👉点我自动重复提交', 50, async (button) => {
                document.querySelector('.submitbtn.mainBgColor').click()
                hasErrorMessage().then(
                    () => {

                        button.innerText = '✅成功！开启自动提交.........'

                        let [min_time, max_time] = get_min_max()

                        // 保存数据
                        user_obj.set('auto_do_num', note_auto_do_num.value - 1)
                        user_obj.set('min_time',min_time)
                        user_obj.set('max_time',max_time)
                        user_obj.set('finish_do_num', 1)
                        user_obj.set('start_auto', true)
                        save_data()

                        // 最后再通过
                        pass_sure()
                        pass_slide()
                    },
                    err => {
                        button.innerText = '✖️'+err
                    }
                )
            })
        }
    }


    // ===============================================程序入口================================
    let id = setInterval(function () {

        // 跳转界面
        let go_write_Page = function () {
            let writePage = user_obj.get('writePage')
            console.log('跳转 writePage= ', writePage)
            window.location.href = writePage; // 跳转到保存的页面
        }

        // 记录当前界面
        let save_write_Page = function () {
            let writePage = window.location.href;
            user_obj.set('writePage', writePage)
        }

        // 广告界面
        let divContent2 = document.querySelector('.chuangGuanWrap.wrapmargin')
        if (divContent2) {
            // 先选中页面
            go_write_Page()
            clearInterval(id)
        } else {
            // 不是广告界面
            let divContent = document.querySelector('.divContent')
            if (divContent) {
                console.log('获取元素成功，开启脚本')

                // 保存界面
                save_write_Page()

                // 取消上次
                pass_dialog_before()

                // 移除提交
                // remove_divSubmit()

                // 开启脚本
                start_script()

                clearInterval(id)
            } else {
                console.log('页面没加载完！！！！进入下一次查询 = ',)
            }
        }
    }, 100)

})();













