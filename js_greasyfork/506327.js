// ==UserScript==
// @name         HRM易景工时统计
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  易景加班统计
// @author       秦大哥
// @match        https://www.italent.cn/portal/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506327/HRM%E6%98%93%E6%99%AF%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/506327/HRM%E6%98%93%E6%99%AF%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isRightPage = false;
    const icuIcon = $(`<svg style="margin-left:10px" t="1725155675730" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1502" width="20" height="20"><path d="M144.308401 698.266746a49.551821 49.551821 0 0 1 5.023502-30.14101c8.198355 13.292186 19.923208 19.993537 35.164513 20.094007 157.305935 195.04248 344.85335 230.206992 562.632198 105.493537 90.814865-66.11933 141.049883-154.864513 150.705053-266.245594 13.322327-51.028731 9.976675-101.263749-10.047003-150.705053-20.174383-93.859107-70.409401-167.533784-150.705053-221.034078-147.439777-93.035253-294.789131-93.035253-442.068156 0l-20.094007 10.047003c-12.970682 2.38114-23.017685-0.964512-30.141011-10.047003v-10.047004C365.523326 56.052233 499.480024 30.934724 646.658579 70.329025 870.174267 160.54107 965.6208 326.316628 932.99818 567.6557 857.515042 819.041776 688.383784 927.880965 425.624501 894.183316c-120.564043-28.714336-214.332727-94.019859-281.3161-195.91657z" fill="#6A686B" opacity=".888" p-id="10930"></path><path d="M737.081611 155.728555c-14.638484 22.957403-34.732491 41.373561-60.282022 55.258519a2238.803941 2238.803941 0 0 0-110.517039 45.211516 1507.452412 1507.452412 0 0 0-105.493537 0 358.225911 358.225911 0 0 1-60.282021-30.14101l-10.047004 10.047003c-28.774618-12.076498-57.237779-30.492656-85.39953-55.258519-7.555347-6.731492-10.911046-15.110693-10.047003-25.117509 147.279025-93.035253 294.628379-93.035253 442.068156 0z" fill="#D9D7DA" p-id="10931"></path><path d="M244.778437 155.728555c7.123326 9.082491 17.170329 12.428143 30.141011 10.047003-1.10517 6.199001-4.46087 11.222503-10.047004 15.070506 44.005876 22.203878 70.791187 57.36839 80.376028 105.493537v30.141011c-2.411281 43.624089-5.756933 87.167803-10.047003 130.611046-9.082491 7.123326-12.428143 17.170329-10.047004 30.14101-13.392656 30.141011-13.392656 60.282021 0 90.423032 17.120094 45.472738 50.616804 65.566745 100.470036 60.282022 25.911222-1.064982 49.350881 5.626322 70.329025 20.094007 19.330435 15.974736 22.676087 34.40094 10.047003 55.258519a411.284137 411.284137 0 0 1-90.423032 5.023502c-12.970682-2.38114-23.017685 0.964512-30.14101 10.047003-70.399354 8.841363-135.704877-4.551293-195.91657-40.188014-4.008754 2.290717-5.676557 5.646416-5.023501 10.047004-15.241304-0.10047-26.966158-6.801821-35.164513-20.094007a49.551821 49.551821 0 0 0-5.023502 30.14101c-48.165335-34.70235-84.99765-78.236017-110.517039-130.611046v-341.59812c15.241304-0.10047 26.966158-6.801821 35.164513-20.094007l10.047003 20.094007c46.206169-43.845123 101.464689-67.284783 165.775559-70.329025z" fill="#6C6E72" opacity=".996" p-id="10932"></path><path d="M295.013455 155.728555c-0.864042 10.006816 2.491657 18.386016 10.047003 25.117509 28.161751 24.765864 56.624912 43.182021 85.39953 55.258519l10.047004-10.047003a358.225911 358.225911 0 0 0 60.282021 30.14101 1507.452412 1507.452412 0 0 1 105.493537 0 2238.803941 2238.803941 0 0 1 110.517039-45.211516c25.54953-13.884959 45.643537-32.301116 60.282022-55.258519 80.295652 53.500294 130.53067 127.174971 150.705053 221.034078-22.977497 22.244066-44.749354 18.888367-65.305523-10.047004-7.736193 11.03161-16.105347 11.03161-25.117509 0-18.416157-66.209753-61.959871-91.327262-130.611046-75.352526-42.458637 26.293008-62.552644 64.803173-60.282021 115.540541-64.51181 1.768273-124.793831 1.768273-180.846064 0 2.923678-61.387192-23.861633-101.575206-80.376029-120.564043-9.584841-48.125147-36.370153-83.289659-80.376028-105.493537 5.586134-3.848002 8.941833-8.871504 10.047004-15.070506l20.094007-10.047003z" fill="#CCCACD" p-id="10933"></path><path d="M244.778437 145.681551v10.047004c-64.31087 3.044242-119.569389 26.483901-165.775559 70.329025l-10.047003-20.094007c-8.198355 13.292186-19.923208 19.993537-35.164513 20.094007v-10.047004c57.750176-66.139424 128.079201-89.579084 210.987075-70.329025z" fill="#819297" opacity=".135" p-id="10934"></path><path d="M797.363632 366.715629c4.46087 44.668978-12.287485 78.165688-50.235018 100.470036-63.23584 18.627145-110.125206-1.466863-140.658049-60.282021-2.270623-50.737368 17.823384-89.247532 60.282021-115.540541 68.651175-15.974736 112.194889 9.142773 130.611046 75.352526z" fill="#6B3010" p-id="10935"></path><path d="M154.355405 205.963573c67.355112-15.231257 119.267979 4.86275 155.728555 60.282021a494.794831 494.794831 0 0 1 0 140.65805C241.734195 572.940424 296.992714 661.695653 475.859518 673.149238 262.561633 734.034079 126.927085 658.681552 68.955875 447.091658c-25.891128-101.615394 2.58208-181.991422 85.39953-241.128085z" fill="#CFE8F3" p-id="10936"></path><path d="M94.073384 286.339601c59.809812-1.286016 63.165511 5.415335 10.047003 20.094007-8.419389-3.436075-11.775088-10.12738-10.047003-20.094007z" fill="#9B5833" p-id="10937"></path><path d="M104.120387 306.433608c53.118508-14.678672 49.762809-21.380024-10.047003-20.094007 39.424442-51.219624 89.65946-66.290129 150.705053-45.211516 33.928731 24.665394 50.667039 58.152057 50.235018 100.470036a9637.517822 9637.517822 0 0 0-30.141011 175.822562 372.864396 372.864396 0 0 1 15.070505 120.564042c-34.90329 8.539953-66.712104 0.170799-95.446533-25.117509-85.19859-86.504701-111.983902-188.652586-80.376029-306.433608z" fill="#E3F4FC" p-id="10938"></path><path d="M184.496416 286.339601c19.923208-1.175499 36.671563 5.525852 50.235017 20.094007-10.378555 9.564747-22.103408 9.564747-35.164512 0-10.348414-3.375793-15.371915-10.077145-15.070505-20.094007z" fill="#9D5833" p-id="10939"></path><path d="M345.248472 286.339601c56.514395 18.988837 83.299706 59.176851 80.376029 120.564043-22.374677 39.082844-55.86134 62.53255-100.470036 70.329024-2.38114-12.970682 0.964512-23.017685 10.047004-30.14101 75.834783-37.676263 79.190482-81.20993 10.047003-130.611046v-30.141011z" fill="#6C3416" p-id="10940"></path><path d="M676.799589 316.480612c87.850999-0.874089 111.290658 37.636075 70.329025 115.54054-71.454289 25.660047-106.618802 0.542538-105.493537-75.352526a196.599765 196.599765 0 0 0 35.164512-40.188014z" fill="#F8F5F3" p-id="10941"></path><path d="M345.248472 316.480612c69.143478 49.401116 65.787779 92.934783-10.047003 130.611046 4.290071-43.443243 7.635723-86.986957 10.047003-130.611046z" fill="#E8E5E4" p-id="10942"></path><path d="M124.214394 336.574619c56.946416-8.630376 70.349119 9.785781 40.188015 55.258519-47.944301 8.138073-61.336957-10.278085-40.188015-55.258519z" fill="#943F13" p-id="10943"></path><path d="M797.363632 366.715629c9.012162 11.03161 17.381316 11.03161 25.117509 0 20.556169 28.93537 42.328026 32.291069 65.305523 10.047004 20.023678 49.441304 23.36933 99.676322 10.047003 150.705053-13.31228-14.598296-21.681434-11.252644-25.117509 10.047004l-10.047003-10.047004c-25.499295 23.861633-53.952409 30.562985-85.39953 20.094007-22.012985 13.784489-43.784841 17.140188-65.305523 10.047004-34.019154 5.897591-67.515864 12.598942-100.470036 20.094007a1927.547771 1927.547771 0 0 0-246.151587-5.023502c-13.392656 6.701351-13.392656 13.392656 0 20.094007l50.235018 10.047004a1784.54877 1784.54877 0 0 1 190.893068 15.070505c-62.190952-3.245182-122.472973 0.10047-180.846064 10.047004-49.853232 5.284724-83.349941-14.809283-100.470036-60.282022-3.265276-84.59577 28.553584-101.344125 95.446534-50.235017a2734.683848 2734.683848 0 0 1 200.940071 0c23.228672-4.571387 43.322679-14.61839 60.282021-30.141011 6.701351 26.795358 13.392656 26.795358 20.094007 0 18.657286 6.701351 33.727791 0 45.211516-20.094007 37.947532-22.304348 54.695887-55.801058 50.235018-100.470036z" fill="#C5C4C7" p-id="10944"></path><path d="M425.624501 406.903644c56.052233 1.768273 116.334254 1.768273 180.846064 0 30.532844 58.815159 77.422209 78.909166 140.658049 60.282021-11.483725 20.094007-26.55423 26.795358-45.211516 20.094007-6.701351 26.795358-13.392656 26.795358-20.094007 0-16.959342 15.52262-37.053349 25.569624-60.282021 30.141011a2734.683848 2734.683848 0 0 0-200.940071 0c-66.89295-51.109107-98.71181-34.360752-95.446534 50.235017-13.392656-30.141011-13.392656-60.282021 0-90.423032 44.608696-7.796475 78.095359-31.246181 100.470036-70.329024z" fill="#B0B1B6" p-id="10945"></path><path d="M897.833667 527.467686c-9.65517 111.381081-59.890188 200.126264-150.705053 266.245594-217.778849 124.713455-405.326264 89.548943-562.632198-105.493537-0.653055-4.400588 1.014747-7.756287 5.023501-10.047004 60.211692 35.636722 125.517215 49.029377 195.91657 40.188014-2.572033 23.037779 0.773619 44.809636 10.047003 65.305524 83.721681 6.701351 167.453408 6.701351 251.175089 0 9.946534-44.809636 8.278731-90.021152-5.023502-135.634548a147.610576 147.610576 0 0 0-35.164512-30.141011 1784.54877 1784.54877 0 0 0-190.893068-15.070505l-50.235018-10.047004c-13.392656-6.701351-13.392656-13.392656 0-20.094007a1927.547771 1927.547771 0 0 1 246.151587 5.023502c32.954172-7.495065 66.450881-14.196416 100.470036-20.094007 21.520682 7.093185 43.292538 3.737485 65.305523-10.047004 31.447121 10.468978 59.900235 3.767626 85.39953-20.094007l10.047003 10.047004c3.436075-21.299648 11.805229-24.6453 25.117509-10.047004z" fill="#CCC9CC" p-id="10946"></path><path d="M425.624501 627.937722c58.373091-9.946534 118.655112-13.292186 180.846064-10.047004 13.000823 7.937133 24.715629 17.984136 35.164512 30.141011 13.302233 45.613396 14.970035 90.824912 5.023502 135.634548-83.721681 6.701351-167.453408 6.701351-251.175089 0-9.273384-20.495887-12.619036-42.267744-10.047003-65.305524 7.123326-9.082491 17.170329-12.428143 30.14101-10.047003v50.235018h210.987075c1.376439-36.972973-5.324912-72.137485-20.094007-105.493538a612.264396 612.264396 0 0 0-110.517039-5.023501c-20.978143-14.467685-44.417803-21.158989-70.329025-20.094007z" fill="#6B3112" p-id="10947"></path><path d="M495.953526 648.031729a612.264396 612.264396 0 0 1 110.517039 5.023501c14.769095 33.356052 21.470447 68.520564 20.094007 105.493538h-210.987075v-50.235018a411.284137 411.284137 0 0 0 90.423032-5.023502c12.629083-20.857579 9.283431-39.283784-10.047003-55.258519z" fill="#CCCACC" p-id="10948"></path></svg>`)
    //显示工时弹窗
    function showResult() {
        let dialog = $(`
         <div class="qy_dialog">
               <div class="qy_table_container">
                    <div class="qy_total_row"  >
                        <span>ICU总时长：</span><span class="qy_total_icu"></span>
                    </div>
                    <div class="qy_table_content" >
                         <div class="qy_table_row qy_title">
                             <div class="qy_table_column">考勤日期</div>
                             <div class="qy_table_column">首打卡</div>
                             <div class="qy_table_column">末打卡</div>
                             <div class="qy_table_column">休息日</div>
                             <div class="qy_table_column">ICU时长</div>
                         </div>
                    </div>
               </div>
               <span class="common_help_prompt_info_close_icon qy_close_button" >
                   <svg width="1em" height="1em" viewBox="0 0 10 10" style="color: red;"><path d="M9.224.757a.5.5 0 010 .707L5.688 5l3.536 3.535a.5.5 0 01-.708.707L4.981 5.707 1.445 9.242a.5.5 0 11-.707-.707L4.274 5 .738 1.464a.5.5 0 01.707-.707l3.536 3.536L8.516.757a.5.5 0 01.708 0z" fill="currentColor" fill-rule="nonzero"></path></svg>
               </span>
         </div>
       `);
        $("body").append(dialog)
        $(".qy_close_button").click(() =>{
            dialog.remove()
        })
        //填充上班时间
        let dataSource = getICU();
        //console.log(dataSource)
        for(let item of dataSource){
            let isHoliday = item.DateType.value != 1;
            let dateStr = item.SwipingCardDate.value;

            let row = $(`<div class="qy_table_row"></div>`)
            //考勤日期
            row.append($(`<div class="restDay qy_table_column"><span class="staff-etra restDayText default_link_skin_color">${item.SwipingCardDate.text}</span><span class="shapeCopy" style="display:${isHoliday ? "inline-block":"none"}"></span></div>`))
            //上班时间
            row.append($(`<div class="qy_table_column"><span class="overflowEllipsis">${item.ActualForFirstCard?.text??"--"}</span></div>`));
            //下班时间
            row.append($(`<div class="qy_table_column"><span class="overflowEllipsis">${item.ActualForLastCard?.text??"--"}</span></div>`));
            //是否休息日
            //console.log("before = "+ isHoliday)
            let storedValue = localStorage.getItem(dateStr)
            if(storedValue != null){
                isHoliday = storedValue == "true"
                //console.log("after = "+ isHoliday)
            }
            item.isHoliday = isHoliday;
            let checkbox = $(`<input type="checkbox" >`).prop({"checked":isHoliday}).change(() =>{
                let checked = checkbox.prop("checked")
                localStorage.setItem(dateStr,checked)
                item.isHoliday = checked
                let newIcuValue = calRow(item)
                $($(row).find("#icuValue")).html(newIcuValue)
                showTotalIcu(dataSource)

            })
            row.append($(`<div class="qy_table_column"></div>`).append(checkbox))

            //加班时间
            let icuValue = calRow(item)
            row.append($(`<div class="qy_table_column"><span id="icuValue" class="overflowEllipsis">${icuValue}</span></div>`));
            $(".qy_table_content").append(row);
        }
        showTotalIcu(dataSource)

    }
    function calRow(item) {
        let icuValue = 0
        let onWorkDate = item.ActualForFirstCard != null ? new Date(item.ActualForFirstCard.value) : null;
        let offWorkDate = item.ActualForLastCard != null ? new Date(item.ActualForLastCard.value) : null;
        let dateStr = item.SwipingCardDate.value;
        if(!item.isHoliday && offWorkDate != null){//非工作日并且打了下班卡
            console.log("in icu")
            let icuStartDate = new Date(`${dateStr} 18:30:00`)
            icuValue = Number((parseInt(offWorkDate - icuStartDate)/1000.0/60/60).toFixed(2))
        }else if(onWorkDate != null && offWorkDate != null) {
            console.log("in icu")
            icuValue = Number((parseInt(offWorkDate - onWorkDate)/1000.0/60/60).toFixed(2))
        }
        if(icuValue < 0){
            icuValue = 0
        }
        item.icuValue = icuValue
        return icuValue
    }

    function showTotalIcu(dataSource) {
        const totalIcuValue =  dataSource.reduce((total,item) => item.icuValue + total,0).toFixed(2)
        $(".qy_total_icu").html(`${totalIcuValue}小时`)
        icuIcon.remove();
        if(Number(totalIcuValue) >= 50){
            $(".qy_total_row").append(icuIcon);
        }
    }

    //插入计算按钮
    function insertShowButton(){
        console.log("插入计算按钮")
        let showButton = $(`<div class="clearScreening" tabindex="999" style="position:absolute;right: 0px;display: block;margin-right: 50px;">计算</div>`);
        setTimeout(() => {
            $(".common-search-body").append(showButton)
            const dropDownBtn = $(".paging .drop-down-btn-list")[0];
            if(dropDownBtn){
                const prop = Object.keys(dropDownBtn).find(p => p.startsWith('__reactInternalInstance'));
                const item = dropDownBtn[prop]._currentElement._owner._instance.props.children[3]
                var click = new Event('click' ,{ "bubbles": true, "cancel" : true, "composed": true});
                if (!isRightPageSize()){
                    dropDownBtn[prop]._currentElement._owner._instance.itemClick(click,item)
                }
            }


        },2000)
        showButton.click(() =>{
            if (!isRightPageSize()) {
                alert("未选择100条/页，计算结果可能不全！");
            }
            showResult();
        })
    }

    function isRightPageSize(){
        const dropDownBtn = $(".paging .drop-down-btn-list")[0];
        return !dropDownBtn || dropDownBtn && $(".paging .drop-down-btn-list").text().indexOf("100条/页") != -1;
    }

    //判断进入出勤页面
    function checkRightPage() {
        let rightPageChecker = setInterval(()=>{
            var url = window.location.href;
            if(url.indexOf("viewName=Attendance.AttendanceDataRecordNavView") !== -1){
                //如果之前不在出勤页面则进入下一步
                if(!isRightPage){
                    console.log("进入出勤页面");
                    isRightPage = true;
                    insertShowButton();
                }
            }else {
                console.log("退出出勤页面");
                isRightPage = false;
            }
        },1000);
    }
    function getICU() {
        let table = $(".react-datagrid")[0];
        const prop = Object.keys(table).find(p => p.startsWith('__reactInternalInstance'));
        return table[prop]._currentElement._owner._instance.props.dataSource;
    }
    checkRightPage();
    $("head").append($(`
    <style>
         .qy_dialog{
             background-color: #00000088;
             z-index: 999;
             position: fixed;
             width: 100%;
             height: 100%;
             top: 0;
             display:flex;
             justify-content: center;
             align-items: center;
         }
         .qy_table_container {
             width: 80%;
             height: 80%;
             background: white;
             border-radius: 20px;
             display:flex;
             padding:20px;
             flex-flow:column;
         }

         .qy_table_content {
             overflow-y:auto;
             display:flex;
             flex-flow:column;
         }

         .qy_close_button {
             display: flex;
             width: 30px;
             height: 30px;
             background-color: white;
             border-radius: 100%;
             justify-content: center;
             align-items: center;
             cursor: pointer;
             margin: 30px;
             position:fixed;
             right:0;
             top:0
         }

         .qy_table_content .qy_title {
             display:flex;
             flex-flow:row;
             background-color:#e4ebf0
         }

         .qy_total_row {
             height:30px;
             display: flex;
             align-items: center;
             border-radius: 10px 10px 0 0;
             background-color: aliceblue;
             padding: 10px;
         }

         .qy_table_row {
            height:30px;
            padding:10px;
            align-items: center;
            display:flex;
            border-bottom: solid 1px #00000022;
         }

         .qy_table_column {
             flex:1;
         }

         .qy_title .qy_table_column {
             font-weight:600;
         }
    </style>
    `))



})();