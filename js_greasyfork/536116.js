// ==UserScript==
// @name         NEMT Updated
// @namespace    http://conanluo.com/
// @version      v.1.1.2
// @description  Fixed New System
// @author       Conan
// @match        https://provider.nemtplatform.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nemtplatform.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536116/NEMT%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/536116/NEMT%20Updated.meta.js
// ==/UserScript==

(function() {
    const popUrl = "https://work.conanluo.com/popRoute.html?arr=";
    const routeColors=["000000","b51548","188225","f3f600","AAAA00","443ea1","b1f9d1","aa77aa","01b4fa","f685e6","e08536","dddddd"];
    const wander = [
        "Auyeung, Shum K",
        "Chan, Suk Ching",
        "Chen, Buoy Lan",
        "Chiang, Kuo Hsiun",
        "Chin, Ang Lin",
        "Chu, Pak",
        "Chung, Isaac I",
        "Hui, Wai Chun Ngai",
        "Hwang, Soon",
        "Chow, James",
        "Lee, Lap Chow",
        "Lee, Ngan Chu",
        "Lee, Sooja",
        "Mosier, Jessica",
        "Penry, Paul E",
        "Wong, Gam Fee",
        "Yuan, Fu Mei"
    ];

    const pmSpecialTime = [1400, 1430, 1500];

    const driverInfo = {
        "Han Yang Zhou": 0,
        "Jie Qian": 11,
//        "Rong Tang":1,
        "Mauricio Reina": 2,
        "Jerry Higgins": 3,
        "Mingzhan Li": 4,
        "Fook Fung": 5,
        "Walter Mejia": 6,
        "Zhao Zhong Zheng": 7,
        "Jabari Tyler": 8,
        "Yingyang Chen": 9,
        "Bert Reid": 10,
        "Jerald Alejandro": 5,
        "Wilson Ochoa": 12,
        "Rong Tang":1

    }
    let addrs;

    //更改title,用地址栏后面的座位title
    document.title=location.pathname.replace("/","")

    function delay(time){
        return new Promise((res,rej)=>{
            setTimeout(_=>res(),time)
        })
    }
    //**********隐藏alert 提示*******开始*******
    let toastLeftBottom=setInterval(function(){
        if($(".toast-top-right").length!=0){
            $(".toast-top-right").removeClass("toast-top-right")//.addClass("toast-bottom-left")
            clearInterval(toastLeftBottom)
        }
    },1000)
    //**********隐藏alert 提示******结束********

    //**********添加nav导航按钮******开始********

    let topNav=`
    <nav id='topNav' class="conan-added-on form-inline row" style="display: none;">
        <button id='routePrt' class='btn btn-primary'>routePrt</button>
        <button id='popAmRoute' class='btn btn-danger'>popAmRoute</button>
        <button id='popPmRoute' class='btn btn-danger'>popPmRoute</button>
    </nav>
    `;
    let addNavListener=setInterval(function(){
        if($("app-side-nav").length!=0){
            $("body").prepend(topNav);
            //添加监听按钮,显示与隐藏nav,默认隐藏
            $("app-side-nav div div div").eq(0).prepend($("app-side-nav div div div").eq(0).html()).find("a").eq(1).hide();//模仿side nav的头的标签建一个隐藏显示conan-added-on的功能
            $(".space-y-1").append(`<textarea id="conan-added-on-info" class="ng-pristine ng-valid ng-touched conan-added-on" style="display:none" rows="10"></textarea>`)//添加一个textarea 框负责输入一些资料(例如地址对象,等)
            $("app-side-nav a").eq(0).attr("href","javascript:").off("click").click(function(){
                $(".conan-added-on").toggle("fast")
                return false;
            })
            //添加am,pm 2个监听
            $("#popAmRoute").click(function(){
                const $table = $('table');
                const tableData = parseTableToData($table);
                const result = groupPatientsByDriver(tableData, driverInfo);
                let url=popUrl+JSON.stringify(result)
                window.open(url+`&rt= AM Route Sheet`)
                console.log(JSON.stringify(result));
            })
            $("#popPmRoute").click(function(){
                const $table = $('table');
                const tableData = parseTableToData($table,"pm");
                const result = groupPatientsByDriver(tableData, driverInfo);
                let url=popUrl+JSON.stringify(result)
                window.open(url+`&rt= PM Route Sheet`)
                console.log(JSON.stringify(result));
            })

            $("#routePrt").click(function(){
                let str=$("#conan-added-on-info").val();
                if(str=="") return;
                eval(addressFormat(str))

                if($("#show_route_color").length==0){
                    let spanColor=""
                    for(let i=0;i<routeColors.length;i++){
                        let x=i;
                        if(x==11 || x==0) x="Check Which Route"
                        else x="Route "+x
                        spanColor+=`<span style="padding:5px 30px; background-color:#${routeColors[i]};${i==5||i==0?"color:white;":""}">${x}</span>&nbsp;&nbsp;`
                    }
                    $("main").prepend(`<div id="show_route_color"><div class='panel-primary'><h3 class='panel-heading' style="background:#0d6efd;color:white;margin-bottom:10px">The Color For The Route</h3>${spanColor}</div><br><hr><br></div></div>`)
                }
                //把route上色
                $(".relative.h-full.ng-star-inserted").each(function(){
                    let $this=$(this);
                    let add1=addressFormat($this.find(".text-main-secondary").eq(1).text().split(" San Francisco")[0].split(" #")[0].trim())
                    let add2=addressFormat($this.find(".text-main-secondary").eq(2).text().split(" San Francisco")[0].split(" #")[0].trim())
                    //console.log($this.find(".text-main-secondary").length)
                    let tempColor=addrs[add1]?addrs[add1]:(addrs[add2]?addrs[add2]:0)
                    //console.log(tempColor)
                    $this.css("background","#"+routeColors[tempColor])
                })


                function addressFormat(addr){
                    return addr.replaceAll(" Street"," St").replaceAll(" Avenue"," Ave").replaceAll(" Boulevard"," Blvd")
                }

            })

            //清除添加监听
            clearInterval(addNavListener);
        }
    })

    


    //**********添加nav导航按钮*******结束*******






    //*****************处理am, pm Route 表 ********开始******
    /**
     * 解析表格数据，根据类型（上午或下午）筛选并格式化患者信息
     * @param {jQuery} $table - jQuery 选择的表格元素
     * @param {string} [type="am"] - 处理类型，"am" 为上午，"pm" 为下午
     * @returns {Array} - 包含司机和患者信息的对象数组
     */
    function parseTableToData($table, type = "am") {
        const data = [];

        // 遍历表格 tbody 中的每一行
        $table.find('tbody tr').each(function() {
            const $cells = $(this).find('td');
            // Driver 在第 4 列（索引 3），取第 3 个 div 的文本
            const driver = $cells.eq(3).find('div').eq(2).text().trim();
            // Patient 在第 12 列（索引 11）
            const rawPatient = $cells.eq(11).text().trim();
            // 格式化 Patient 名字：首字母大写，其他小写
            const patient = rawPatient.toLowerCase().replace(/(^|\s)\w/g, char => char.toUpperCase());
            // Pickup Address 在第 14 列（索引 13），用于下午筛选和时间提取
            const pickupAddress = $cells.eq(13).text().trim();
            const pickupAddressTime = $cells.eq(13).find('div').last().text().trim().slice(-4);
            // Dropoff Address 在第 15 列（索引 14），用于上午筛选
            const dropoffAddress = $cells.eq(14).text().trim();
            // Space Type 在第 8 列（索引 7）
            const spaceType = $cells.eq(7).text().trim();

            // 时间处理
            const timeValue = parseInt(pickupAddressTime, 10);
            if (isNaN(timeValue)) return; // 无效时间，跳过

            // 检查 Patient 是否在 wander 数组中（忽略大小写）
            const isWander = wander.some(w => w.toLowerCase() === rawPatient.toLowerCase());

            let isValid = false;
            let patientWithTags = patient;

            if (type === "am") {
                // 上午筛选条件：时间 < 10:30，Dropoff Address 包含 "3575 Geary"，Space Type 不含 "DME"
                const isBefore1030 = timeValue < 1030;
                const is2ndRound = timeValue < 1000;
                const hasGeary = dropoffAddress.toLowerCase().includes('3575 geary');
                const noDME = !spaceType.toLowerCase().includes('dme');

                if (driver && patient && isBefore1030 && hasGeary && noDME) {
                    isValid = true;
                    patientWithTags = patient +
                        (is2ndRound ? "" : " - @@" + pickupAddressTime) +
                        (!isWander ? "" : "__<b>Warning</b>");
                }
            } else if (type === "pm") {
                // 下午筛选条件：时间 >= 15:30 或在 pmSpecialTime 中，Pickup Address 包含 "3575 Geary"，Space Type 不含 "DME"
                const isAfter1530OrSpecial = timeValue >= 1530 || pmSpecialTime.includes(timeValue);
                const hasGeary = pickupAddress.toLowerCase().includes('3575 geary');
                const noDME = !spaceType.toLowerCase().includes('dme');

                if (driver && patient && isAfter1530OrSpecial && hasGeary && noDME) {
                    isValid = true;
                    const isSpecialTime = pmSpecialTime.includes(timeValue);
                    patientWithTags = patient +
                        (isSpecialTime ? " - @@" + pickupAddressTime : "") +
                        (!isWander ? "" : "__<b>Warning</b>");
                }
            }

            if (isValid) {
                data.push({ Driver: driver, Patient: patientWithTags });
            }
        });

        return data;
    }

    /**
     * 按司机分组患者，并按患者名字正序排序
     * @param {Array} tableData - 解析后的表格数据，包含司机和患者信息
     * @param {Object} driverInfo - 司机信息对象，键为司机名字，值为二维数组索引
     * @returns {Array} - 按 driverInfo 索引分配的二维数组，每个子数组包含排序后的患者名字
     */
    function groupPatientsByDriver(tableData, driverInfo) {
        // Step 1: 按 Driver 分组 Patient
        const patientGroups = {};

        tableData.forEach(row => {
            const driver = row.Driver;
            const patient = row.Patient;

            if (!patientGroups[driver]) {
                patientGroups[driver] = [];
            }
            patientGroups[driver].push(patient);
        });

        // Step 2: 对每个司机的 Patient 数组按名字正序排序（忽略大小写）
        for (const driver in patientGroups) {
            patientGroups[driver].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        }

        // Step 3: 创建二维数组
        const maxIndex = Math.max(...Object.values(driverInfo), -1) + 1;
        const result = Array(maxIndex).fill().map(() => []);

        for (const [driver, index] of Object.entries(driverInfo)) {
            result[index] = patientGroups[driver] || [];
        }

        return result;
    }

    //*****************处理am, pm Route 表 ********结束******


})();