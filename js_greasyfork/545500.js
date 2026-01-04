// ==UserScript==
// @name         SHU选课界面优化
// @namespace    https://sfkgroup.github.io/
// @version      0.3
// @description  这是优化上海大学选课界面上课程表部分的脚本
// @author       SFKgroup
// @match        https://jwxt.shu.edu.cn/jwglxt/xsxk/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @icon         https://newsso.shu.edu.cn/static/images/ico.jpg
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/545500/SHU%E9%80%89%E8%AF%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/545500/SHU%E9%80%89%E8%AF%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    // 本程序仅适用于上海大学本科教学管理信息服务平台-自主选课页面
    var week2id = {
        '星期一': '1',
        '星期二': '2',
        '星期三': '3',
        '星期四': '4',
        '星期五': '5',
        '星期六': '6',
        '星期日': '7',
    }
    var lesson = [] // 全局课程变量
    var is_painting = false // 绘制锁

    // 文本哈希编码函数
    String.prototype.hashCode = function () {
        let hash = 0;
        if (this.length === 0) return hash;
        for (let i = 0; i < this.length; i++) {
            let char = this.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    // 获取课程的唯一颜色
    function get_colour(hash_data) {
        let h = Math.floor((hash_data / 179) % 360); // H 取值范围为[0,259]
        let s = Math.floor((hash_data / 997) % 47 + 53); // S 取值范围为[53,100]%
        let l = Math.floor((hash_data / 97) % 37 + 33); // L 取值范围为[33,70]%
        return `hsl(${h},${s}%,${l}%)`
    }

    // 绘制不存在课程
    function mk_lost_lesson(lesson){
        let class_name = lesson.name
        let hash_data = lesson.hash
        let teacher = lesson.teacher
        let lesson_time = lesson.raw_time.join('<br>')
        // <div id="right" class="outer_xkxx_list">
        let lesson_html = `<h6 id="${hash_data}">${class_name}<span class="pull-right"></span></h6>
        <table class="right_table_head"><thead><tr><td class="h_sxbj">选上否</td><td class="h_jxb">教学班</td><td class="h_teacher">教师</td><td class="h_time">上课时间</td><td class="h_time">操作</td></tr></thead></table>
        <ul id="right_ul" class="list-group" data-kklxdm="01" data-listidx="0">
        <li id="right_3463C024895BB241E063F0000A0A7DA9" class="list-group-item" data-itemidx="0"style="cursor: pointer;"><div class="item" style="cursor: pointer;"><table width="100%"><tbody><tr>
            <td><p class="sxbj"><font color="red">!被删选!</font></p></td>
            <td><p class="jxb popover-demo" title="${class_name}">${class_name.slice(0, 3)}...</p></td>
            <td><p class="teachers" title="${teacher}"><span>${teacher}</p></td>
            <td><p class="time">${lesson_time}</p></td>
            <td><p class="but"><button class="btn btn-danger btn-sm" id="unselect_${hash_data}"type="button">不再显示</button></p>
        </td></tr></tbody></table></div></li></ul>`
        let a_lesson_dom = document.createElement("div")
        a_lesson_dom.innerHTML = lesson_html
        a_lesson_dom.setAttribute("id", "right")
        a_lesson_dom.setAttribute("class", "outer_xkxx_list")
        document.querySelector(".right_div").appendChild(a_lesson_dom)
        a_lesson_dom.querySelector(`#unselect_${hash_data.replace(':','\\:')}`).addEventListener("click", function () {
            let recent_lessons = get_history_table()
            GM_log("Close "+recent_lessons[hash_data].name)
            delete recent_lessons[hash_data]
            set_history_table(recent_lessons)
            a_lesson_dom.remove()
        })
        return a_lesson_dom.querySelector("h6")
    }

    // 获取所有已选课程信息
    function get_lessons() {
        let lessons = get_history_table()
        // 遍历右边栏中的所有已选择课程
        let lesson_dom = document.querySelector(".right_div").children
        for (let i = 0; i < lesson_dom.length; i++) {
            let complex_time = []
            let name = ''
            let teacher = ''
            let hash_id = ''
            if (lesson_dom[i].querySelector("ul > li > div > table > tbody > tr > td:nth-child(1) > p").innerText == "!被删选!") {
                // GM_log("Pass "+lesson_dom[i])
                continue
            }
            try {
                // 提取原始课程时间信息
                complex_time = lesson_dom[i].querySelector("ul > li > div > table > tbody > tr > td:nth-child(6) > p").innerHTML.split('<br>')
                // 提取课程名称
                name = lesson_dom[i].querySelector("ul > li > div > table > tbody > tr > td:nth-child(4) > p").getAttribute('title')
                // 提取任课教师姓名
                teacher = lesson_dom[i].querySelector("ul > li > div > table > tbody > tr > td:nth-child(5) > p > span").innerText
                // 获取课程的hash值
                hash_id = 'CLASS:' + name.hashCode() + '-' + teacher.hashCode() + '-' + Math.floor((name + teacher).hashCode())
                // 为课程添加id(用作跳转的标记)
                lesson_dom[i].querySelector("h6").setAttribute('id', hash_id)
            } catch (e) {
                GM_log("Read Lesson Error")
            }

            let class_time = []
            // 按照 星期X第1-2节 {...} 为基本单元，遍历原始课程时间信息
            for (let j = 0; j < complex_time.length; j++) {
                // 忽略无时间信息的课程
                if (complex_time[j] == '--') {
                    class_time.push({
                        'date': null,
                        'time': null,
                        'week': null
                    })
                    break
                }
                // 提取课程时间格式为 星期X第1-2节 {...} 的课程时间的星期数和节数
                let res = {
                    'date': complex_time[j].split("第")[0],
                    'time': complex_time[j].split("第")[1].split('节')[0].split('-')
                }
                // 提取课程时间格式为 星期X第1-2节 {...} 的课程时间的周数
                // {...} 有 {1-8周} 和 {1周,3周,5周} 两种表示方式
                let week_raw = complex_time[j].split('{')[1].split('周')[0]
                if (week_raw.indexOf('-') != -1) { // 1-8 等连续表示的数据中含有'-'
                    res.week = week_raw.split('-')
                    res.continous = true // 连续地表示周数
                } else {
                    let weeks = complex_time[j].split('{')[1].replace('}', '').split(',')
                    for (let k = 0; k < weeks.length; k++) {
                        weeks[k] = weeks[k].replace('周', '') // JS一次replace智能替换掉一个“周”字
                    }
                    res.week = weeks
                    res.continous = false // 离散地表示周数
                }

                class_time.push(res)
            }
            // 添加单个课程的所有信息
            lessons[hash_id] = {
                'index': i,
                'name': name,
                'teacher': teacher,
                'time': class_time,
                'hash': hash_id,
                'colour': get_colour(name.hashCode()),
                'title_dom': lesson_dom[i].querySelector("h6"),
                'raw_time': complex_time,
                'is_history' : false
            }
        }
        set_history_table(lessons)
        // GM_log(lessons)
        return lessons
    }

    // 高亮课程(在跳转完成后用)
    function high_light(dom, colour) {
        let ori_style = dom.getAttribute("style")
        ori_style = dom.setAttribute("style", ori_style + ';background-color:' + colour)
        setTimeout((dom, ori_style) => {
            dom.setAttribute("style", ori_style)
        }, 2560, dom, ori_style) // 高亮时间为2560ms
    }

    // 初始化课表
    function init_table() {
        // 删除原有单元格的padding样式
        document.querySelector("#xskbtable").setAttribute("class", 'table table-bordered tab-bor-col-1')
        for (let i = 1; i <= 7; i++) {
            for (let j = 1; j <= 12; j++) {
                // 遍历所有单元格
                let ele = document.querySelector(`#td_${i}-${j}`)
                ele.setAttribute("style", "padding:0px")
                // 添加div确保水平排列
                let innerHtml = '<div style="display:flex">'
                // 添加16份子元素表示16周
                for (let k = 1; k <= 16; k++) {
                    // a标签负责跳转，嵌套div显示颜色 (无课程默认颜色为#ccc)
                    // 添加a标签id方便绘制课程的时候查询
                    innerHtml += `<a href="#" id="a_${i}-${j}-${k}" style="width:6.25%;height:32px;"><div style="width:100%;height:100%;background-color:#ccc"></div></a>`
                }
                ele.innerHTML = innerHtml + '</div>' // 结束div
            }
        }
        // 自动删除原有的图例
        let sign = document.querySelector("#xskbtable > tbody > tr:nth-child(14)")
        if (sign) sign.remove()
    }

    // 将课程绘制入课程表
    function paint(lessons) {
        // 遍历课程
        for (let key in lessons) {
            let lesson_now = lessons[key]
            // 油猴会在存储的Object里面加入我们不需要的key，所以这里判断一下
            if (!key.startsWith("CLASS:")) {
                // GM_log("Droup " + key)
                continue
            }
            // 判断是否为删选课程
            if (lesson_now.is_history) {
                if (document.getElementById(lesson_now.hash) == null) {
                    lesson_now.title_dom = mk_lost_lesson(lesson_now)
                }
                lesson_now.index = document.querySelector("#mCSB_1_container > div > div.right_div").children.length
            }
            // 遍历时间条数 (星期几)
            for (let t = 0; t < lesson_now.time.length; t++) {
                let lesson_time = lesson_now.time[t]
                if (lesson_time.date == null) continue;
                let date = week2id[lesson_time.date]
                // 遍历课程数 (第几节课)
                for (let c = 1 * lesson_time.time[0]; c <= 1 * lesson_time.time[1]; c++) {
                    // 判断课程是连续上几周的格式，还是离散上几周的格式
                    if (lesson_time.continous) {
                        // 遍历上的周数
                        for (let w = 1 * lesson_time.week[0]; w <= 1 * lesson_time.week[1]; w++) {
                            paint_cell(lesson_now, date, c, w)
                        }
                    } else {
                        // 遍历上的周数
                        for (let kw = 0; kw < lesson_time.week.length; kw++) {
                            paint_cell(lesson_now, date, c, lesson_time.week[kw])
                        }
                    }
                }
            }
        }
    }

    // 绘制最小的单元格
    function paint_cell(lesson_now, date, c, w) {
        // id格式：a_{周几}-{第几节课}-{第几周}
        let ele = document.querySelector(`#a_${date}-${c}-${w}`)
        // 如果没有该单元格则跳过绘制
        if (!ele) {
            GM_log(`#a_${date}-${c}-${w}`)
            return;
        }
        // 设置单元格颜色为课程颜色
        ele.querySelector("div").setAttribute("style", "width:100%;height:100%;background-color:" + (lesson_now.is_history ? "#666" : lesson_now.colour))
        // 设置单元格跳转课程链接
        ele.setAttribute("href", "#" + lesson_now.hash)
        // 设置鼠标悬停文本
        ele.setAttribute("title", lesson_now.name + ':' + lesson_now.teacher)
        // 添加点击事件，适配高亮行为
        ele.addEventListener('click', function () {
            // 高亮被跳转的课程
            high_light(lesson_now.title_dom, lesson_now.colour)
            // 修改侧边栏滚动位置(选课网站侧边栏的滚动不是靠页面滚动实现的，故而在传统标签跳转的基础上还要再修改一次页面位置)
            // 500px 为课程表高度,每个课程高度为150px
            document.querySelector("#mCSB_1_container").setAttribute('style', `position: relative; top: -${500 + 150 * lesson_now.index}px; left: 0px; width: 740px;`)
        })
    }

    // 渲染自定义的课表
    function main() {
        init_table();
        // 添加提示
        if (!document.getElementById("MonkeyINFO")) {
            let info_dom = document.createElement('h4');
            info_dom.innerText = "注:收起选课信息再展开可以刷新课表"
            info_dom.setAttribute("id", "MonkeyINFO")
            document.querySelector("#mCSB_1_container > div").prepend(info_dom);
        }
        paint(lesson);
        is_painting = false; // 取下绘制锁

    }

    // 获取课表并延时启动绘制
    function time_out_main() {
        // 确认右边栏的显示状态
        if (document.querySelector("#choosedBox > div > div.outer_left > span").getAttribute("class").indexOf('right') == -1) return;
        // GM_log("Paint")
        is_painting = true;// 加上绘制锁
        lesson = get_lessons();
        // 延时启动绘制(给原始课表渲染的时间)
        setTimeout(main, 300)
    }

    // 检查课表是否正常渲染
    function check_table() {
        if (is_painting) return; // 如果在绘制中则不检查
        // 如果右侧栏未展开则不检查
        if (document.querySelector("#choosedBox > div > div.outer_left > span").getAttribute("class").indexOf('right') == -1) return;
        // 检查周日最后一节课的课表渲染是否正常
        if (document.querySelector("#td_7-12 > div")) return;
        // 如果不正常则重新渲染
        time_out_main()
    }

    // 设置历史课表
    function set_history_table(lessons = {}){
        let lesson_copy = JSON.parse(JSON.stringify(lessons));
        for (let key in lesson_copy){
            lesson_copy[key].is_history = true
        }
        GM_setValue('lessons', lesson_copy)
        // GM_log(lessons)
    }

    // 读取历史课表
    function get_history_table(){
        let lessons = GM_getValue('lessons', [])
        return lessons
    }

    // 删选课程测试
    function test_lost_lesson(){
        let lesson = get_history_table()
        lesson["CLASS:114514-1919810-1145141919810"] = {"index": 0,"name": "周末摸鱼指南","teacher": "费雪","time": [{"date": "星期六","time": ["3","4"],"week": ["1","16"],"continous": true},{"date": "星期日","time": ["3","4"],"week": ["13","16"],"continous": true}],"hash": "CLASS:114514-1919810-1145141919810","colour": "rgb(102,204,255)","title_dom": {},"raw_time": ["星期六第3-4节{1-16周}","星期日第3-4节{13-16周}"],"is_history": false}
        set_history_table(lesson)
    }

    // 注册插件命令
    GM_registerMenuCommand("清空历史课表", set_history_table);
    GM_registerMenuCommand("保存当前课表", function () {
        set_history_table(get_lessons())
    });
    //GM_registerMenuCommand("删选课程测试", test_lost_lesson);

    // 主程序初始化阶段
    // 等待页面加载完成
    window.onload = function () {
        // 检查是否处于选课阶段
        let ban_info = document.querySelector("#innerContainer > div.panel.panel-info > div.panel-body > div > span")
        if (ban_info && ban_info.innerText.indexOf("不属于选课阶段") != -1) {
            GM_log("不属于选课阶段!");
            // 如非选课阶段则绘制该学生的课表
            let class_table_dom = document.createElement('iframe');
            class_table_dom.setAttribute("src", "/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151&layout=default")
            class_table_dom.setAttribute("style", "width:100%;height:300px;border:none;")
            document.querySelector("#innerContainer > div.panel.panel-info").appendChild(class_table_dom)
            return;
        }
        var wait_bar = setInterval(function () {
            if (document.querySelector("#choosedBox > div > div.outer_left")) {
                clearInterval(wait_bar)
                // 添加右边栏展开事件监听器
                document.querySelector("#choosedBox > div > div.outer_left").addEventListener('click', time_out_main)
                // 添加循环检测课表是否绘制正常(主要应对退选课程的刷新问题)
                setInterval(check_table, 200);
            }
        }, 1000);
    }
})();