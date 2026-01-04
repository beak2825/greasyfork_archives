// ==UserScript==
// @name         auto Upload tripSheet
// @namespace    http://Conanluo.com/
// @version      1.0.2
// @description  uploading
// @author       Conanluo
// @match        https://provider.nemtplatform.com/trips?k=4
// @match        https://awmt.transmedik.com/trips/trip-sheet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nemtplatform.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538682/auto%20Upload%20tripSheet.user.js
// @updateURL https://update.greasyfork.org/scripts/538682/auto%20Upload%20tripSheet.meta.js
// ==/UserScript==

(async function() {

    const workerUrl = 'https://tripsheetdata.conanluo.workers.dev/save';

    let driversTrip=[
        {id: "Han Yang Zhou",passengers: []},
        {id: "Rong Tang",passengers: []},
        {id: "Mauricio Reina",passengers: []},
        {id: "Jerry Higgins",passengers: []},
        {id: "Mingzhan Li",passengers: []},
        {id: "Fook Fung",passengers: []},
        {id: "Walter Mejia",passengers: []},
        {id: "Zhao Zhong Zheng",passengers: []},
        {id: "Jabari Tyler",passengers: []},
        {id: "Yingyang Chen",passengers: []},
        {id: "Bert Reid",passengers: []},
        {id: "Jie Qian",passengers: []},
        {id: "Jerald Alejandro",passengers: []},
        {id: "Wilson Ochoa",passengers: []},
        {id: "unknow Driver",passengers: []}
    ]

    // 函数：保存字符串和时间戳到 Cloudflare KV
    function saveToKV(content) {
        const timestamp = new Date().toISOString();
        GM_xmlhttpRequest({
            method: 'POST',
            url: workerUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({  timestamp, content }),
            onload: function(response) {
                if (response.status === 200) {
                    console.log('数据已保存到 KV:', response.responseText);
                } else {
                    console.error('错误:', response.status, response.responseText);
                }
            },
            onerror: function() {
                console.error('网络错误');
            }
        });
    }

    // 示例：获取字符串
    async function getTrips() {
        //如果不在规定时间(7:00-18:00),停止自动更新trip,直接return false
        let thisHour=new Date().getHours()
        if(thisHour<7 || thisHour>18) return false;

        let tripStr=""
        let drivers=JSON.parse(JSON.stringify(driversTrip));
        if($("tbody tr").length>0){


            $("table tbody tr").each(function(){
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
                //console.log(JSON.stringify(temp))
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
            })

            try {
                //console.log(111)
                await fetchLunchTimes(drivers);
            } catch (err) {
                console.error('失败:', err);
            }

            tripStr=JSON.stringify(drivers)

            return tripStr

        }else{
            return false
        }

        //return document.querySelector('#some-element').innerText; // 替换为你的选择器
    }

    // 主逻辑：每分钟运行
    async function run() {

        if($("#updateTripSheet").length==0){
            $(".flex.gap-2").eq(1).append(`<button id="updateTripSheet" class="btn btn-primary">update Trip Sheet</button>`)
            $("#updateTripSheet").click(async function(){
                $(this).removeClass("btn-primary","fast").addClass("btn-danger","fast")
                $(this).text("updating...")
                await run();
                $(this).removeClass("btn-danger","fast").addClass("btn-primary","fast")
                $(this).text("update Trip Sheet")

            })
        }
        const content = await getTrips();
        try{
            // 查找目标 修改 日期
            const targetInput = document.querySelector('input.form-control.w-52[placeholder="Select Date"]');

            if (targetInput) {
                //console.log('Found target input:', targetInput);

                // 获取今天的日期并格式化为 M/D/YYYY
                const today = new Date();
                const month = today.getMonth() + 1; // 月份从 0 开始，需加 1
                const day = today.getDate();
                const year = today.getFullYear();
                const formattedDate = `${month}/${day}/${year}`;
                const newValue = `${formattedDate} ~ ${formattedDate}`; // 例如 "6/7/2025 ~ 6/7/2025"

                if(newValue!==targetInput.value){

                    // 临时移除 readonly 属性（如果存在）
                    if (targetInput.hasAttribute('readonly')) {
                        targetInput.removeAttribute('readonly');
                    }

                    // 设置新值
                    targetInput.value = newValue;

                    // 触发 input 事件，通知 Angular 更新模型
                    const inputEvent = new Event('input', {
                        bubbles: true,
                        cancelable: true
                    });
                    targetInput.dispatchEvent(inputEvent);

                    // 触发 change 事件（某些情况下需要）
                    const changeEvent = new Event('change', {
                        bubbles: true,
                        cancelable: true
                    });
                    targetInput.dispatchEvent(changeEvent);

                    // 恢复 readonly 属性
                    targetInput.setAttribute('readonly', '');
                }
            } else {
                console.log('Target input not found');
            }


            $("button:contains('Reset')").click()
        }catch(e){
        }
        //console.log(content)

        if (content) {
            saveToKV(content);
        } else {
            console.error('未找到内容');
        }

    }

    await run(); // 立即运行
    setInterval(run, 60000); // 每分钟


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
    // Your code here...
})();