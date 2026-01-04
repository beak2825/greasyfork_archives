// ==UserScript==
// @name         NEMT for IOA
// @namespace    http://conanluo.com/
// @version      v.1.6.6
// @description  Fixed New System
// @author       Conan
// @match        https://provider.nemtplatform.com/*
// @match        https://awmt.transmedik.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nemtplatform.com
// @downloadURL https://update.greasyfork.org/scripts/536448/NEMT%20for%20IOA.user.js
// @updateURL https://update.greasyfork.org/scripts/536448/NEMT%20for%20IOA.meta.js
// ==/UserScript==

(function($){

    //const _url='http://127.0.0.1:5500/ioa' //测试服
    const _url='https://work.conanluo.com' //正式服
    const popUrl = _url+"/popRoute.html?arr=";
    const routeColors=["000000","b51548","188225","f3f600","AAAA00","443ea1","b1f9d1","aa77aa","01b4fa","f685e6","e08536","dddddd"];
    const wander = [
        "Auyeung, Shum K",
        "Chan, Suk Ching",
        "Chen, Zong Liang",
        "Chiang, Kuo Hsiun",
        "Chin, Ang Lin",
        "Chu, Pak",
        "Chung, Isaac I",
        "Ho, Sandy",
        "Huang Tam, Gui Ying",
        "Hui, Wai Chun Ngai",
        "Hwang, Soon",
        "Lee, Lap Chow",
        "Lee, Ngan Chu",
        "Lee, Sooja",
        "Lin, Phyllis",
        "Mosier, Jessica",
        "Penry, Paul E",
        "Wong, Gam Fee",
        "Yuan, Fu Mei",
        "Chen, Yiqun",
        "Tam, Tsui Lin",
        "Lee, FungLin So"
    ];

    const pmSpecialTime = [1400, 1430, 1500];

    const driverInfo = {
        "Han Yang Zhou": 0,
        "Mauricio Reina": 1,
        "Mingzhan Li": 2,
        "Jerald Alejandro": 3,
        "Jerry Higgins": 4,
        "Zhao Zhong Zheng": 5,
        "Jabari Tyler": 6,
        "Yingyang Chen": 7,
        "Walter Mejia": 8,
        "Rong Tang":9,
        "Bert Reid": 10,
        "Jie Qian": 11,
        "Wilson Ochoa": 12,
        "Minjie Cao":13,
        "Dongxian Li":14,
        "Jialiang Luo":15
    }
    let addrs;

    let driversTrip=[
        {id: "Han Yang Zhou",passengers: []}, //0
        {id: "Mauricio Reina",passengers: []}, //1
        {id: "Mingzhan Li",passengers: []}, //2
        {id: "Jerald Alejandro",passengers: []},//3
        {id: "Jerry Higgins",passengers: []}, //4
        {id: "Zhao Zhong Zheng",passengers: []},//5
        {id: "Jabari Tyler",passengers: []},//6
        {id: "Yingyang Chen",passengers: []},//7
        {id: "Walter Mejia",passengers: []},//8
        {id: "Rong Tang",passengers: []},//9
        {id: "Bert Reid",passengers: []},//10
        {id: "Jie Qian",passengers: []},//11
        {id: "Wilson Ochoa",passengers: []},//12
        {id: "Minjie Cao",passengers: []},//13
        {id: "Dongxian Li",passengers: []},//14
        {id: "Jialiang Luo",passengers: []},//15
        {id: "unknow Driver",passengers: []}
    ]

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
<nav id='topNav' class="conan-added-on d-flex align-items-center flex-nowrap" style="display: none; width: 900px; overflow: hidden; justify-content: flex-start;">
    <button id='popAmRoute' class='btn btn-danger me-1'>popAmRoute</button>
    <button id='popPmRoute' class='btn btn-danger me-1'>popPmRoute</button>
    <button id='popTripSheet' class='btn btn-danger me-1'>popTripSheet</button>
    <button id='mapOnly' class='btn btn-primary me-1'>mapOnly</button>
    <button id='popUpCancellation' class='btn btn-primary me-1'>popUpCancellation</button>
    <button id="keepWander" class="btn btn-primary me-1">Wander</button>
    <input type="text" id="add_emoji_text" class="form-control" style="display: inline-block !important; width: 80px !important; flex: 0 0 40px; margin-right: 8px;">
    <button id='add_emoji' class='btn btn-primary me-2'>Add Emoji</button>
</nav>
    `;
    let addNavListener=setInterval(function(){
        if($("app-side-nav").length!=0){

            $(".pl-4.space-x-2.inline-block.flex-shrink-0").append(`<button class='btn btn-primary' onclick='$(".conan-added-on").toggle("fast")'>ok</button>`)

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
                console.log(tableData)
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

            //添加emoji 按钮监听
            $('#add_emoji').on('click', function() {
                // 禁用按钮防止重复点击
                $(this).prop('disabled', true).text('处理中...');

                processAllRows().finally(() => {
                    // 无论成功或失败，处理结束后都恢复按钮状态
                    $(this).prop('disabled', false).text('开始处理');
                });
            });


            //添加routePrt 监听器
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

            //显示地图
            $("#mapOnly").click(function(){

                $(`.inline-flex.w-full.items-center`).hide();
                $(".relative.z-0.h-96.overflow-y-auto.p-2").css("height","1100");$(".flex-shrink-0.border-r.border-main-base.flex.flex-col").hide()
            })


            //添加popTripSheet 监听器
            $("#popTripSheet").click(async function(){
                if($("tbody tr").length>0){
                    let tripStr=``
                    let drivers=JSON.parse(JSON.stringify(driversTrip));
                    $("tbody tr").each(function(){
                        let driver= $(this).find("td").eq(3).text().replace("Reassign","").trim()
                        let prt= $(this).find("td").eq(11).text().trim()
                        let pickup=$(this).find("td").eq(13).text().trim().slice(-4)
                        let dropoff=$(this).find("td").eq(14).text().trim().slice(-4)
                        let status=$(this).find("td").eq(2).text().trim()

                        let puaddress=$(this).find("td").eq(13).text().split("San Francisco")[0].trim()
                        let doaddress=$(this).find("td").eq(14).text().split("San Francisco")[0].trim()

                        prt=(status.includes("VIP")?"🔥":"")+prt

                        status=status.includes("Cancelled")?3:
                               status.includes("Finished")?2:
                               status.includes("Onboard")?1:0
                        let temp={id:prt,pickup,dropoff,status,puaddress,doaddress}
                        console.log(JSON.stringify(temp))
                        if(driver=="Han Yang Zhou"){
                            drivers[0].passengers.push(temp)
                        }else if(driver=="Mauricio Reina"){
                            drivers[1].passengers.push(temp)
                        }else if(driver=="Mingzhan Li"){
                            drivers[2].passengers.push(temp)
                        }else if(driver=="Jerald Alejandro"){
                            drivers[3].passengers.push(temp)
                        }else if(driver=="Jerry Higgins"){
                            drivers[4].passengers.push(temp)
                        }else if(driver=="Zhao Zhong Zheng"){
                            drivers[5].passengers.push(temp)
                        }else if(driver=="Jabari Tyler"){
                            drivers[6].passengers.push(temp)
                        }else if(driver=="Yingyang Chen"){
                            drivers[7].passengers.push(temp)
                        }else if(driver=="Walter Mejia"){
                            drivers[8].passengers.push(temp)
                        }else if(driver=="Rong Tang"){
                            drivers[9].passengers.push(temp)
                        }else if(driver=="Bert Reid"){
                            drivers[10].passengers.push(temp)
                        }else if(driver=="Jie Qian"){
                            drivers[11].passengers.push(temp)
                        }else if(driver=="Wilson Ochoa"){
                            drivers[12].passengers.push(temp)
                        }else if(driver=="Minjie Cao"){
                            drivers[13].passengers.push(temp)
                        }else if(driver=="Dongxian Li"){
                            drivers[14].passengers.push(temp)
                        }else if(driver=="Jialiang Luo"){
                            drivers[15].passengers.push(temp)
                        }else{
                            drivers[16].passengers.push(temp)
                        }
                    })

                    try {
                        console.log(111)
                        await fetchLunchTimes(drivers);
                    } catch (err) {
                        console.error('按钮点击失败:', err);
                    }

                    tripStr=JSON.stringify(drivers)

                    sendTrips(tripStr)
                }
            })

            //添加keepWander 监听器==========================
            // 1. 创建一个辅助函数，用于“标准化”名字
            // 它会移除所有空格、逗号和连字符，并转换为小写
            const normalizeName = (name) => {
                if (!name) return ""; // 防止单元格为空
                return name.toLowerCase().replace(/[\s,-]/g, '');
            };

            // 2. 为了提高效率，先把 wander 数组“标准化”并放入一个 Set 中
            // Set 的查询速度 ( .has() ) 远快于数组 ( .includes() )
            const normalizedWanderSet = new Set(wander.map(normalizeName));

            // 3. 绑定点击事件到 #formatTable 按钮
            $("#keepWander").on("click", function() {
                console.log("Filtering table...");

                // 4. 动态查找 "Patient" 列的索引
                let patientColumnIndex = -1;
                $("table thead th").each(function(index) {
                    // 使用 .trim() 和 .toLowerCase() 来确保能找到 ' Patient ' 这样的列
                    if ($(this).text().trim().toLowerCase() === "patient") {
                        patientColumnIndex = index;
                        return false; // 找到后停止 .each() 循环
                    }
                });

                // 5. 检查是否找到了 "Patient" 列
                if (patientColumnIndex === -1) {
                    console.error("Could not find the 'Patient' column.");
                    alert("错误：未找到 'Patient' 列！");
                    return; // 停止执行
                }

                // 6. 遍历表格主体 (tbody) 的每一行 (tr)
                $("table tbody tr").each(function() {
                    const $row = $(this); // 当前行

                    // 7. 根据索引找到对应的 "Patient" 单元格 (td)
                    const $patientCell = $row.find("td").eq(patientColumnIndex);
                    const patientName = $patientCell.text().trim();

                    // 8. "标准化" 表格中的名字
                    const normalizedPatientName = normalizeName(patientName);

                    // 9. 检查这个标准化的名字是否存在于 Set 中
                    if (!normalizedWanderSet.has(normalizedPatientName)) {
                        // 10. 如果存在，则从 DOM 中移除这一行
                        $row.remove();
                    }
                });

                console.log("Filtering complete.");
            });
            //监听 keepWander 结束===========================

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
            // 获取状态是否cancel
            const isCancel=$cells.eq(2).text().includes("Cancel")
            if(isCancel) return;
            // Driver 在第 4 列（索引 3），取第 3 个 div 的文本
            const driver = $cells.eq(3).find('div').eq(2).text().trim();
            // Patient 在第 12 列（索引 11）
            const rawPatient = $cells.eq(11).text().replaceAll("⚠️","").replaceAll("🔥","").trim();
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
                const isBefore1030 = timeValue <= 1030;
                const is2ndRound = timeValue >= 1000 && timeValue<1200;
                const hasGeary = dropoffAddress.toLowerCase().includes('3575 geary');
                const noDME = !spaceType.toLowerCase().includes('dme');

                if (driver && patient && isBefore1030 && hasGeary && noDME && !isCancel) {
                    isValid = true;
                    patientWithTags = patient +
                        (is2ndRound ? " - @@" + pickupAddressTime: "") +
                        (!isWander ? "" : "__<b>Warning</b>");
                }
            } else if (type === "pm") {
                // 下午筛选条件：时间 >= 15:30 或在 pmSpecialTime 中，Pickup Address 包含 "3575 Geary"，Space Type 不含 "DME"
                const isAfter1530OrSpecial = timeValue >= 1530 || pmSpecialTime.includes(timeValue);
                const hasGeary = pickupAddress.toLowerCase().includes('3575 geary');
                const noDME = !spaceType.toLowerCase().includes('dme');

                if (driver && patient && isAfter1530OrSpecial && hasGeary && noDME && !isCancel) {
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

    //*****************处理trip sheet ********开始******
    //传入trips(String 类型) 格式 `[{"id":"driverName","passengers":[{...},{...}]},....]
    //                       passengers里面的格式{"id":"prtName","pickup":"","dropoff":"",.....}这3个是一定要有
    function sendTrips(trips) {
      //const tripsInput = document.getElementById('trips').value;
      //const status = document.getElementById('status');
      try {
        const drivers = JSON.parse(trips);
        // 验证数据格式
        if (!Array.isArray(drivers) || !drivers.every(d => d.id && Array.isArray(d.passengers))) {
          throw new Error('Invalid drivers format');
        }
        // 目标地址（ 或本地测试）

        const targetUrl = _url+'/nemt/index.html';
        const targetOrigin = _url;
        const targetWindow = window.open(targetUrl, '_blank');
        if (!targetWindow) {
          //status.textContent = '无法打开目标页面，请检查浏览器弹出窗口设置！';
          console.error('Failed to open target window');
          return;
        }
        // 重试发送消息
        let attempts = 0;
        const maxAttempts = 10;
        const sendMessage = () => {
          if (attempts >= maxAttempts) {
            //status.textContent = '发送失败：目标页面未响应，请检查 index.html 是否加载';
            console.error('Failed to send trips data after max attempts');
            return;
          }
          attempts++;
          try {
            targetWindow.postMessage({
              type: 'tripsData',
              data: drivers
            }, targetOrigin);
            console.log(`Attempt ${attempts}: Sent trips data:`, drivers);
            //status.textContent = '数据发送成功！';
          } catch (e) {
            console.warn(`Retry ${attempts}/${maxAttempts}:`, e);
            setTimeout(sendMessage, 1000);
          }
        };
        setTimeout(sendMessage, 2000); // 初始延迟 2 秒
      } catch (error) {
        //status.textContent = '无效的 JSON 格式，请检查输入！';
        console.error('Error parsing trips input:', error);
      }
    }

    //用异步包装获取司机吃饭时间-----------------------开始
    const apiUrl = 'https://script.google.com/macros/s/AKfycbzBdbSd3xujI7CAwxPfD5b8KOktG6Z4VjqE_8q512q5Bc3MJjFRurs-aODOI-sIFzJR/exec';
    // 包装 GM_xmlhttpRequest 为 Promise
    function gmFetch(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: (response) => {
                    resolve(response);
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    }
    // 异步获取数据
    async function fetchLunchTimes(drivers) {
        try {
            const response = await gmFetch({
                method: 'GET',
                url: apiUrl
            });
            console.log('请求完成，状态码:', response.status);
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('数据获取成功:', data);
                    for(let i=1;i<data.length;i++){
                        let temp={"id":"Lunch","pickup":data[i][1]+"","dropoff":data[i][2]+""}
                        let driver=data[i][0]
                        if(driver=="Han Yang Zhou"){
                            drivers[0].passengers.push(temp)
                        }else if(driver=="Rong Tang"){
                            drivers[1].passengers.push(temp)
                        }else if(driver=="Mauricio Reina"){
                            drivers[2].passengers.push(temp)
                        }else if(driver=="Jerry Higgins"){
                            drivers[3].passengers.push(temp)
                        }else if(driver=="Mingzhan Li"){
                            drivers[4].passengers.push(temp)
                        }else if(driver=="Fook Fung"){
                            drivers[5].passengers.push(temp)
                        }else if(driver=="Walter Mejia"){
                            drivers[6].passengers.push(temp)
                        }else if(driver=="Zhao Zhong Zheng"){
                            drivers[7].passengers.push(temp)
                        }else if(driver=="Jabari Tyler"){
                            drivers[8].passengers.push(temp)
                        }else if(driver=="Yingyang Chen"){
                            drivers[9].passengers.push(temp)
                        }else if(driver=="Bert Reid"){
                            drivers[10].passengers.push(temp)
                        }else if(driver=="Jie Qian"){
                            drivers[11].passengers.push(temp)
                        }else if(driver=="Jerald Alejandro"){
                            drivers[12].passengers.push(temp)
                        }else if(driver=="Wilson Ochoa"){
                            drivers[13].passengers.push(temp)
                        }else{
                            drivers[14].passengers.push(temp)
                        }
                    }
                    //return data;
                } catch (e) {
                    console.error('解析 JSON 失败:', e, response.responseText);
                    throw new Error(`JSON 解析失败: ${e.message}`);
                }
            } else {
                console.error('请求失败，状态码:', response.status, '响应:', response.responseText);
                throw new Error(`请求失败，状态码: ${response.status}`);
            }
        } catch (err) {
            console.error('请求错误:', err);
            throw err;
        }
    }
    //用异步包装获取司机吃饭时间--------------------------结束

    //*****************处理trip sheet ********结束******


    //

    //*****************添加数据表功能,排序,隐藏等. ********开始******
    // 使用setInterval定期检查新生成的表格
    let resetTableBtnCheck=setInterval(function(){
        let isTrip=location.pathname==="/trips"
        if(isTrip && $(".min-h-full").length>0 && $("#formatTable").length==0){
            $(".min-h-full th").eq(0).prepend(`<button id="formatTable" class="btn-primary py-0.5 px-1 text-[20px] font-regular focus:ring-0">fix</button>`)
            $("#formatTable").click(function(){
                let resetArr=[4,5,6,7,8,9,10,15,16]
                for(let i=0;i<resetArr.length;i++){
                    let itemIndex=resetArr[i];
                    $(".min-h-full th").eq(itemIndex).toggle();
                }

                $(".min-h-full tr").each(function(){
                    for(let i=0;i<resetArr.length;i++){
                        let itemIndex=resetArr[i];
                        $(this).find("td").eq(itemIndex).toggle()
                    }
                })
            })
            //添加点击表头就排序的功能
            let currentSortColumn = -1;
            let sortDirection = 1; // 1 为升序，-1 为降序

            // 为表头添加点击事件，排除第一列和第二列
            $('.min-h-full thead th').each(function(index) {
                if (index === 0 || index === 1) return; // 跳过第一列（按钮）和第二列（Actions）

                // 设置内联样式：指针和悬停效果
                $(this).css({
                    'cursor': 'pointer',
                    'position': 'relative'
                }).hover(
                    function() { $(this).css('background-color', '#f0f0f0'); },
                    function() { $(this).css('background-color', ''); }
                );

                // 点击事件
                $(this).on('click', function() {
                    // 切换排序方向
                    if (currentSortColumn === index) {
                        sortDirection *= -1;
                    } else {
                        currentSortColumn = index;
                        sortDirection = 1;
                    }

                    // 获取所有行
                    let $tbody = $('.min-h-full tbody');
                    let rows = $tbody.find('tr').get();

                    // 排序函数：按完整字符串比较
                    rows.sort(function(a, b) {
                        let aValue = $(a).find('td').eq(index).text().trim() || '';
                        let bValue = $(b).find('td').eq(index).text().trim() || '';

                        // 空值处理：空字符串排在最后
                        if (!aValue && !bValue) return 0;
                        if (!aValue) return 1 * sortDirection;
                        if (!bValue) return -1 * sortDirection;

                        // 按完整字符串比较（逐字符）
                        return aValue.localeCompare(bValue) * sortDirection;
                    });

                    // 重新排序 DOM 节点（不清空 tbody）
                    $tbody.append(rows);

                    // 更新表头视觉提示（内联样式）
                    $('.min-h-full thead th').find('.sort-indicator').remove();
                    $(this).append(
                        $('<span>').addClass('sort-indicator').text(sortDirection === 1 ? '▲' : '▼').css({
                            'position': 'absolute',
                            'right': '5px',
                            'font-size': '12px',
                            'color': 'red'
                        })
                    );
                });
            });
        }
    },1000)

    //*****************添加数据表功能,排序,隐藏等. ********结束******

    //*****************添加cancellation report 功能*********开始**************
    let cancellationReport=setInterval(function(){

        if($("#popUpCancellation").length>0 && $(".min-h-full").length>0 && $("#popUpCancellation hasClickListener").length==0){
            $("popUpCancellation").addClass("hasClickListener")


            $('#popUpCancellation').on('click', function() {
                // 检查弹框是否已存在
                let $dialog = $('#cancellationDialog');
                if (!$dialog.length) {
                    // 创建弹框
                    $dialog = $('<div>').attr('id', 'cancellationDialog').css({
                        'position': 'fixed',
                        'top': '50%',
                        'left': '50%',
                        'transform': 'translate(-50%, -50%)',
                        'width': '1200px',
                        'height': '700px',
                        'background-color': '#fff',
                        'border': '1px solid #ccc',
                        'box-shadow': '0 4px 8px rgba(0,0,0,0.2)',
                        'z-index': '1000',
                        'display': 'flex',
                        'flex-direction': 'column'
                    });

                    // 创建弹框头部
                    let $header = $('<div>').css({
                        'background-color': '#666',
                        'color': '#fff',
                        'padding': '10px',
                        'border-bottom': '1px solid #ddd',
                        'display': 'flex',
                        'justify-content': 'space-between',
                        'align-items': 'center'
                    });

                    // 头部标题
                    let $title = $('<span>').text('Cancellation Table').css({
                        'font-weight': 'bold',
                        'font-size': '16px'
                    });

                    // 按钮容器
                    let $buttons = $('<div>');

                    // PopTxtFile 按钮
                    let $popTxtBtn = $('<button>').text('PopTxtFile').css({
                        'margin-right': '10px',
                        'padding': '5px 10px',
                        'cursor': 'pointer',
                        'background-color': '#555',
                        'color': '#fff',
                        'border': '1px solid #777',
                        'border-radius': '3px'
                    }).on('click', function() {
                        // 收集勾选的数据
                        let advance = [], atDoor = [], noShow = [], secondRun = [];
                        $('#cancellationTableBody tr').each(function(index) {
                            let $row = $(this);
                            let prtName = $row.find('td').eq(4).text().trim();
                            let reason = $row.find('td').eq(5).find("input").val().split("Cancelled By")[0].trim();
                            if ($row.find('input[data-col="0"]').prop('checked')) {
                                advance.push(prtName +"  -  " +reason);
                            }
                            if ($row.find('input[data-col="1"]').prop('checked')) {
                                atDoor.push(prtName +"  -  " +reason);
                            }
                            if ($row.find('input[data-col="2"]').prop('checked')) {
                                noShow.push(prtName +"  -  " +reason);
                            }
                            if ($row.find('input[data-col="3"]').prop('checked')) {
                                secondRun.push(prtName);
                            }
                        });

                        // 生成文件内容
                        let content = '';
                        content += 'Cancellation in advance:\n-----------------------------------\n';
                        content += advance.length ? advance.join('\n') : 'None at this time';
                        content += '\n\nCancel At the Door :\n-----------------------------------\n';
                        content += atDoor.length ? atDoor.join('\n') : 'None at this time';
                        content += '\n\nNo Show :\n-----------------------------------\n';
                        content += noShow.length ? noShow.join('\n') : 'None at this time';
                        content += '\n\n2nd Run:\n-----------------------------------\n';
                        content += secondRun.length ? secondRun.join('\n') : 'None at this time';

                        // 生成文件名（MMDDYYYY）
                        let today = new Date();
                        let mm = String(today.getMonth() + 1).padStart(2, '0');
                        let dd = String(today.getDate()).padStart(2, '0');
                        let yyyy = today.getFullYear();
                        let filename = `${mm}${dd}${yyyy}_CancellationReport.txt`;

                        // 创建并触发下载
                        let blob = new Blob([content], { type: 'text/plain' });
                        let link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                    // 最小化按钮
                    let $minimizeBtn = $('<button>').text('Minimize').css({
                        'padding': '5px 10px',
                        'cursor': 'pointer',
                        'background-color': '#555',
                        'color': '#fff',
                        'border': '1px solid #777',
                        'border-radius': '3px'
                    }).on('click', function() {
                        $dialog.hide();
                    });

                    $buttons.append($popTxtBtn, $minimizeBtn);
                    $header.append($title, $buttons);

                    // 创建表格容器
                    let $tableContainer = $('<div>').css({
                        'flex': '1',
                        'overflow-y': 'auto'
                    });

                    // 创建表格
                    let $table = $('<table>').attr('id', 'cancellationTable').css({
                        'width': '100%',
                        'border-collapse': 'collapse'
                    });

                    // 创建表头
                    let $thead = $('<thead>');
                    let $headerRow = $('<tr>');
                    let headers = ['Advance', 'At Door', 'No Show', '2nd Run', 'Prt Name', 'Reason'];
                    headers.forEach(function(header, index) {
                        let $th = $('<th>').text(header).css({
                            'border': '1px solid #ddd',
                            'padding': '8px',
                            'text-align': 'left',
                            'background-color': '#005577',
                            'color': '#fff',
                            'position': 'sticky',
                            'top': '0',
                            'z-index': '10',
                            'width': index < 4 ? '30px' : 'auto' // 前 4 列宽度 30px
                        });
                        $headerRow.append($th);
                    });
                    $thead.append($headerRow);
                    $table.append($thead);

                    // 创建表体
                    let $tbody = $('<tbody>').attr('id', 'cancellationTableBody');

                    $table.append($tbody);
                    $tableContainer.append($table);
                    $dialog.append($header, $tableContainer);
                    $('body').append($dialog);
                } else {
                    // 清空现有表格内容
                    $('#cancellationTableBody').empty();
                    $dialog.show(); // 确保弹框可见
                }

                // 获取并填充表格数据
                let rowsData = [];
                $('.min-h-full tbody tr').each(function() {
                    let $row = $(this);
                    let pickupAddress = $row.find('td').eq(13).text().trim().split('\n')[0].trim(); // Pickup Address
                    let dropoffAddress = $row.find('td').eq(14).text().trim().split('\n')[0].trim(); // Dropoff Address
                    let status = $row.find('td').eq(2).text().trim(); // Status
                    let prtName = $row.find('td').eq(11).text().trim(); // Patient
                    let reason = $row.find('td').eq(17).text().trim(); // Change Reason

                    // 筛选条件 1：Pickup Address 最后 4 位是 1000-1200 且 Dropoff Address 包含 "3575 Geary"
                    let lastFour = pickupAddress.slice(-4);
                    let isNumeric = /^\d+$/.test(lastFour);
                    let meetsCondition1 = isNumeric && parseInt(lastFour) >= 1000 && parseInt(lastFour) <= 1200 &&
                        dropoffAddress.toLowerCase().includes('3575 geary');

                    // 筛选条件 2：Status 包含 "Cancelled"
                    let meetsCondition2 = status.toLowerCase().includes('cancelled');

                    // 筛选条件 3：Pickup Address 最后 4 位小于 1200
                    let meetsCondition3 = isNumeric && parseInt(lastFour) < 1200;

                    // 满足（条件 1 或条件 2）且条件 3
                    if ((meetsCondition1 || meetsCondition2) && meetsCondition3) {
                        rowsData.push({ prtName: prtName, reason: reason });
                    }
                });

                // 按 Prt Name 排序
                rowsData.sort(function(a, b) {
                    return a.prtName.localeCompare(b.prtName);
                });

                // 生成表格行
                let $tbody = $('#cancellationTableBody');
                rowsData.forEach(function(data, index) {
                    let $tr = $('<tr>').css({
                        'background-color': index % 2 === 0 ? '#e4f0f7' : '#fff'
                    });

                    // 前 4 列：复选框（单选效果）
                    for (let i = 0; i < 4; i++) {
                        let $td = $('<td>').css({
                            'border': '1px solid #ddd',
                            'padding': '8px',
                            'width': '30px',
                            'text-align': 'center'
                        });
                        let $checkbox = $('<input>').attr({
                            'type': 'checkbox',
                            'data-row': index,
                            'data-col': i
                        }).on('change', function() {
                            // 取消同一行其他复选框的勾选
                            if ($(this).prop('checked')) {
                                $tbody.find(`input[data-row="${index}"]:not([data-col="${i}"])`).prop('checked', false);
                            }
                        });
                        $td.append($checkbox);
                        $tr.append($td);
                    }

                    // Prt Name 列
                    let $prtTd = $('<td>').text(data.prtName).css({
                        'border': '1px solid #ddd',
                        'padding': '8px'
                    });
                    $tr.append($prtTd);

                    // Reason 列（可编辑输入框，无边框）
                    let $reasonTd = $('<td>').css({
                        'border': '1px solid #ddd',
                        'padding': '8px'
                    });
                    let $reasonInput = $('<input>').attr({
                        'type': 'text',
                        'value': data.reason
                    }).css({
                        'border': 'none',
                        'width': '100%',
                        'padding': '0',
                        'background-color': 'transparent'
                    });
                    $reasonTd.append($reasonInput);
                    $tr.append($reasonTd);

                    $tbody.append($tr);
                });
            });
        }

    },1000)

    //*****************添加cancellation report 功能*********结束**************

    /******************修改药,laundry用的....开始****************** */

    const waitForElementWithJQuery = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            let attempts = 0, maxAttempts = timeout / 250, interval = 250;
            const tryFind = () => {
                const element = $(selector);
                if (element.length > 0) resolve(element);
                else if (attempts < maxAttempts) { attempts++; setTimeout(tryFind, interval); }
                else reject(new Error(`waitForElementWithJQuery: 超时, 未找到 "${selector}"`));
            };
            tryFind();
        });
    };
    const waitForElementToDisappear = (selector, timeout = 15000) => {
        return new Promise((resolve) => {
            let attempts = 0, maxAttempts = timeout / 100, interval = 100;
            const tryFind = () => {
                if (!document.querySelector(selector)) resolve();
                else if (attempts < maxAttempts) { attempts++; setTimeout(tryFind, interval); }
                else { console.warn(`waitForElementToDisappear: 等待 "${selector}" 消失超时，继续执行...`); resolve(); }
            };
            tryFind();
        });
    };
    const waitForFormReady = (formSelector, readyCheckSelector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            let attempts = 0, maxAttempts = timeout / 250, interval = 250;
            const tryFind = () => {
                const form = $(formSelector);
                const readyElement = $(readyCheckSelector);
                if (form.length > 0 && readyElement.length > 0 && readyElement.val() !== "") {
                    resolve(form);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(tryFind, interval);
                } else {
                    reject(new Error(`waitForFormReady: 等待表单数据加载超时。检查的选择器: ${readyCheckSelector}`));
                }
            };
            tryFind();
        });
    };

    // ==================================================================
    // == 您的核心代码 (已升级为从输入框读取 Emoji) ==
    // ==================================================================
    function updateForm(emoji) {
        (function() {
            'use strict';
            const waitForElement = (selector, callback, maxAttempts = 20, interval = 100) => {
                let attempts = 0;
                const tryFind = () => {
                    const element = document.querySelector(selector);
                    if (element) { callback(element); }
                    else if (attempts < maxAttempts) { attempts++; setTimeout(tryFind, interval); }
                    else { console.error(`updateForm内部的waitForElement找不到: ${selector}`); }
                };
                tryFind();
            };

            // 其他字段的填充逻辑保持不变
            waitForElement('#preScheduleTime', (input) => { input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); });
            waitForElement('#preAppointmentTime', (input) => { input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); });
            waitForElement('#contactNumber', (input) => { if(input.value =="") input.value = 'N/A'; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); });
            waitForElement('#preActualAppointmentTime', (input) => { waitForElement('#preAppointmentTime', (input2) => { input.value = input2.value; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); }) });

            // **关键改动**: 直接使用传入的 emoji
            waitForElement('#displayName', (input) => {
                const newValue = emoji + input.value;
                input.value = newValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });

            setTimeout(() => {
                $('div.border-t.border-main-base.flex.flex-wrap.justify-end.py-2.px-4.bg-container-base.gap-2 button:not(:contains("Cancel"))').click();
                console.log("已在 updateForm 内部尝试点击更新按钮。");
            }, 500);
        })();
    }

    // ==================================================================
    // == 自动循环点击的主函数 (从输入框读取 Emoji) ==
    // ==================================================================
    async function processAllRows() {
        const emojiInput = $('#add_emoji_text').val().trim();
        let finalEmoji = emojiInput; // 默认直接使用输入值

        // 智能判断逻辑
        if (emojiInput === '1' || emojiInput.toLowerCase() === 'med') {
            finalEmoji = '💊';
        } else if (emojiInput === '2' || emojiInput.toLowerCase() === 'laundry') {
            finalEmoji = '👕';
        }else if (emojiInput === '3' || emojiInput.toLowerCase() === 'wander') {
            finalEmoji = '⚠️';
        }

        if (!finalEmoji) {
            alert("Emoji 或关键词不能为空！");
            return;
        }

        const actionIcons = $('tbody tr.ng-star-inserted .flex.justify-end div a');
        console.log(`任务 Emoji: ${finalEmoji}。总共找到了 ${actionIcons.length} 行需要处理。`);

        for (let i = 0; i < actionIcons.length; i++) {
            // ... (循环内部逻辑与之前版本完全相同)
            const icon = actionIcons[i];
            const formSelector = '.flex-1.flex.flex-col.bg-main-base-100.overflow-hidden';
            const readyCheckSelector = '#displayName';

            console.log(`\n--- 开始处理第 ${i + 1} 行 ---`);
            try {
                icon.click();
                const editLink = await waitForElementWithJQuery(".rounded-md.ring-main-base a:contains('Edit')");
                editLink[0].click();
                await waitForFormReady(formSelector, readyCheckSelector);

                console.log(`表单已就绪！使用 Emoji [${finalEmoji}] 执行 updateForm()...`);
                updateForm(finalEmoji);

                await waitForElementToDisappear(formSelector);
                console.log(`第 ${i + 1} 行处理完毕！`);
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`处理第 ${i + 1} 行时发生严重错误:`, error);
                console.log("为防止意外，脚本已停止。");
                break;
            }
        }
        console.log(`\n🎉🎉🎉 任务 Emoji: ${finalEmoji}，全部处理完成！ 🎉🎉🎉`);
    }
    /******************修改药,laundry用的....结束 ****************** */

    
})($);