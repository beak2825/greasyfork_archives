// ==UserScript==
// @name          雲科一鍵填寫工作日誌
// @namespace     Anong0u0
// @version       2.0.9
// @description   😎輕鬆一鍵自動填寫
// @author        Anong0u0
// @match         *://*/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=www.yuntech.edu.tw
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_addValueChangeListener
// @grant         GM_openInTab
// @grant         window.focus
// @grant         window.close
// @grant         GM_xmlhttpRequest
// @connect       webapp.yuntech.edu.tw
// @require       https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js
// @noframes
// @license       Beerware
// @downloadURL https://update.greasyfork.org/scripts/499328/%E9%9B%B2%E7%A7%91%E4%B8%80%E9%8D%B5%E5%A1%AB%E5%AF%AB%E5%B7%A5%E4%BD%9C%E6%97%A5%E8%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/499328/%E9%9B%B2%E7%A7%91%E4%B8%80%E9%8D%B5%E5%A1%AB%E5%AF%AB%E5%B7%A5%E4%BD%9C%E6%97%A5%E8%AA%8C.meta.js
// ==/UserScript==

const Enum = (descriptions) =>
{
  const result = {};
  Object.keys(descriptions).forEach((description) =>{
    result[description] = descriptions[description];
  });
  return Object.freeze(result);
}

const controlState = Enum({
    self:"SCRIPT_CONTROL_STATE",
    checkLogin: "checking_login",
    fillWork: "fill_work",
    none: null,
    value: {
        now: GM_getValue("SCRIPT_CONTROL_STATE", null),
        is(state) {return this.now===state},
        not(state) {return this.now!==state}
    },
    change(state) {GM_setValue(this.self, state)},
})
const workState = Enum({
    waiting: "🕐待填寫",
    done: "✅填寫完成",
    error: "❌填寫錯誤"
})

const FILL_WORK_URL = `https://webapp.yuntech.edu.tw/workstudy/StudWorkRecord/ContractList?date=${new Date().getMonth()+1}%2F1`;

const iziToastCSS = document.createElement("link")
iziToastCSS.rel="stylesheet"
iziToastCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css"

const iziToastProxy = new Proxy(iziToast, {
  get(target, propKey, receiver) {
    const originalProperty = Reflect.get(target, propKey, receiver);
    if (typeof originalProperty !== 'function') return originalProperty

    return (...args) => {
      document.head.append(iziToastCSS)
      return Reflect.apply(originalProperty, target, args);
    };
  }
});

const GM_XHR = (method, url, data = null, headers = {}) =>
new Promise((resolve) => {
    GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: headers,
        data: data,
        onload: resolve
    });
});

const checkIsLogin = () =>
new Promise(async (r) => {
    const result = await GM_XHR("HEAD", FILL_WORK_URL)
    if(result.finalUrl.includes(FILL_WORK_URL)===false)
    {
        controlState.change(controlState.checkLogin)
        GM_addValueChangeListener(controlState.self, ()=>{window.focus(); r()})
        GM_openInTab(FILL_WORK_URL, false)
    }
    else r()
})

const getWorkContent = async (planName) =>
{
    const t = GM_getValue(planName)
    if(t)
    {
        if(!("timeout" in t) || t.timeout < Date.now()) GM_deleteValue(planName)
        else return t
    }

    await checkIsLogin()
    const workListHTML = (await GM_XHR("GET", `/workstudy/StudWorkRecord/ContractList?date=${new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString("ja").replace(/\//g,"%2F")}`)).responseXML,
          workInfoHTML = (await GM_XHR("GET", "/workstudy/Stud/ContractList")).responseXML,
          workInfo = {}

    for(const e of [...workInfoHTML.querySelectorAll("tbody > tr")].map((tr)=>[...tr.querySelectorAll("td")].map((e)=>e?.innerText.trim() || e.querySelector("a")?.href.match(/(?<=ApplyId=)\d+/))).reverse())
    {
        const text = (await GM_XHR("GET", `/workstudy/Stud/JobContractInfo?ApplyId=${e[10]}`)).responseText,
              desc = String(text.match(/(?<=工作內容：\r\n).+/)).trim()
        workInfo[e[2]] = desc
    }
    for(const tr of workListHTML.querySelectorAll("tbody > tr"))
    {
        const workList = [...tr.querySelectorAll("td")].map((e)=>e.innerText.trim() || e.querySelector("a").href.match(/(?<=ContractId=)\d+/)[0])
        const pn = workList[2],
        workID = workList[8]

        GM_setValue(pn, {id:workID, desc:workInfo[pn], timeout: new Date(new Date().getFullYear(), new Date().getMonth()+1, 1).getTime()})
    }
    return GM_getValue(planName)
}

(() =>
{
    const workQueue = GM_getValue("workQueue", []);
    if(GM_getValue("workQueueTimeout") < Date.now())
    {
        workQueue.length = 0
        GM_setValue("workQueue", [])
        GM_deleteValue("workQueueTimeout")
    }
    (async () =>
    {
        if (controlState.value.not(controlState.none)) return;
        let needUpdate = false;
        for (const work of workQueue)
        {
            const {state, planName, date, start, end, hour, desc} = work
            if(work.state !== workState.waiting || Date.now() < Number(new Date(`${date} ${end}`)) + 60000) continue;
            await checkIsLogin()
            const body = `DateContract=${date.replace(/\//g,"%2F")}%2C${(await getWorkContent(planName))?.id}&`+
                  `StartHour=${Number(start.split(":")[0])}&StartMin=${Number(start.split(":")[1])}&`+
                  `EndHour=${Number(end.split(":")[0])}&EndMin=${Number(end.split(":")[1])}&`+
                  `IsAnnualLeave=false&WorkContent=${encodeURIComponent(desc)}&Hours=${hour}`;
            const result = (await GM_XHR("POST", "https://webapp.yuntech.edu.tw/workstudy/StudWorkRecord/ApplyAction", body, {"content-type": "application/x-www-form-urlencoded"})).responseText;
            work.fillTime = new Date().toLocaleString("pa").replace(/-/g, "/")

            const content = {
                drag: false,
                timeout: 30000,
            }
            if(result.includes("填寫完成"))
            {
                work.state = workState.done
                content.title = work.state
                content.message = `${planName} ${date} ${desc} ${start}-${end} 共${hour}小時`
                iziToastProxy.success(content)
            }
            else
            {
                work.state = workState.error
                work.errorMessage = String(result.match(/(?<=×<\/button>)[^<]+/)??"未知錯誤(可能已超時)").trim()
                content.title = work.state
                content.message = `<b>原因：${work.errorMessage}</b> ${planName} ${date} ${desc} ${start}-${end} 共${hour}小時`
                iziToastProxy.error(content)
            }
            needUpdate = true;
        }
        if(needUpdate)
        {
            iziToastProxy.info({
                title: "[雲科工作日誌]",
                message: "已觸發自動填寫",
                drag: false,
                timeout: 45000,
                buttons: [
                    ["<button>前往查看填寫佇列</button>",
                     () => {
                         GM_openInTab(FILL_WORK_URL, false);
                         iziToastProxy.destroy()
                     }
                    ]
                ]
            })
            GM_setValue("workQueue", workQueue)
        }
    })()

    if (workQueue.length < 1 && controlState.value.is(controlState.none) && Date.now() > GM_getValue("dont_notify",0)) {
        const warning = {
            title: "[雲科工作日誌]",
            message: "本月未設置自動填寫佇列，是否前往設置？",
            close: false,
            drag: false,
            timeout: 10000,
            buttons: [
                [
                    "<button style='background-color:lightgreen'>前往設置</button>",
                    (instance, toast) => {
                        controlState.change(controlState.fillWork);
                        GM_openInTab(FILL_WORK_URL, false);
                        instance.hide({}, `#${toast.id}`)
                    },
                    true
                ],
                [
                    "<button style='background-color:#BBB'>關閉</button>",
                    (instance, toast) => instance.hide({}, `#${toast.id}`)
                ],
                [
                    "<button style='background-color:lightblue'>延後一天提醒</button>",
                    (instance, toast) => {
                        instance.hide({}, `#${toast.id}`)
                        GM_setValue("dont_notify", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1).getTime())
                        iziToastProxy.info({
                            title: "[雲科工作日誌]",
                            message: "延後至明天提醒✅",
                            position: "center",
                            drag: false,
                        });
                    }
                ],
                [
                    "<button style='background-color:Salmon'>本月不再提醒</button>",
                    (instance, toast) => {
                        instance.hide({}, `#${toast.id}`)
                        iziToastProxy.question({
                            timeout: 20000,
                            close: false,
                            overlay: true,
                            title: '[雲科工作日誌]',
                            message: '是否本月之內不再提醒"工作日誌自動填寫"？',
                            position: 'center',
                            drag: false,
                            buttons: [
                                ['<button>確定</button>', (instance, toast) => {
                                    GM_setValue("dont_notify", new Date(new Date().getFullYear(), new Date().getMonth()+1, 1).getTime())
                                    instance.hide({}, `#${toast.id}`);
                                    iziToastProxy.info({
                                        title: "[雲科工作日誌]",
                                        message: "本月之內將不再提醒",
                                        position: "center",
                                        drag: false,
                                    });

                                }],
                                ['<button><b>取消</b></button>', (instance, toast) => {
                                    instance.hide({}, `#${toast.id}`);
                                    iziToastProxy.warning(warning);
                                }, true],
                            ],
                        });
                    }
                ]
            ]
        }
        iziToastProxy.warning(warning);
    }

    if (location.pathname.includes("/workstudy/StudWorkRecord")===false)
    {
        if (controlState.value.not(controlState.none))
        {
            if (location.pathname.includes("/YuntechSSO/Account/Login"))
            {
                iziToastProxy.info({
                    title: "[雲科工作日誌]",
                    message: "檢測到單一未登入，請登入單一",
                    position: "topCenter",
                    drag: false,
                    timeout:10000
                });
            }
            else location.replace(FILL_WORK_URL);
        }
        return;
    }
    controlState.change(controlState.none);
    if (controlState.value.is(controlState.checkLogin)) window.close()

    const btn = document.createElement("input"),
          YM = new Date().toLocaleDateString("en-za").slice(0,-3),
          autoFillForm = document.createElement("div")
    btn.type = "button"
    btn.value = `😎一鍵填寫 ${YM} 工作日誌`
    btn.className = "btn btn-success"
    const footer = document.querySelector(".panel-footer")
    footer.append(btn)
    const initAutoFillForm = () =>
    {
        const tableText = workQueue.map(work =>
        {
            const { state, planName, date, start, end, hour, desc, errorMessage, fillTime } = work;
            return `
              <tr>
                <td>${state}${state === workState.error ? "，原因：" + errorMessage : ""}</td>
                <td>${state !== workState.waiting ? fillTime : "-"}</td>
                <td>${planName}</td>
                <td>${date}</td>
                <td>${start}-${end}</td>
                <td>${hour}</td>
                <td>${desc}</td>
              </tr>`;
        }).join("");

        autoFillForm.innerHTML = `
            <style>td>input {width:100% !important}</style>
            <div class="dataTables_wrapper form-inline dt-bootstrap no-footer" style="padding-bottom:16px">
                <h4><b>自動填寫佇列📬</b></h4>
                <table class="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                    <thead>
                        <tr>
                            <th>狀態</th>
                            <th>填寫時間</th>
                            <th>計畫</th>
                            <th>工作日期</th>
                            <th>工作期間</th>
                            <th>時數</th>
                            <th>工作內容</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableText}
                    </tbody>
                </table>
            </div>`
    }
    initAutoFillForm()
    document.querySelector(":is(form[action='/workstudy/StudWorkRecord/ApplyAction'],#page-wrapper > :last-child)").insertAdjacentElement("afterend", autoFillForm)

    btn.onclick = async () =>
    {
        btn.value = "🔄載入資料中..."
        btn.disabled = true
        autoFillForm.hidden = true
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth()+1, 1);
        let allWork = (await fetch("/workstudy/Stud/CalendarData").then((e)=>e.json())).filter((e)=>(!e.backgroundColor || e.title.indexOf("月保:")===0) && new Date(e.start)>monthStart && new Date(e.start)<monthEnd)
        if (allWork?.[0]?.title.indexOf("月保:")===0)
        {
            const title = allWork[0].title.replace("月保:", ""),
                  year = new Date().getFullYear(),
                  month = new Date().getMonth()
            allWork = Array(new Date(year, month + 1, 0).getDate()-1)
                .fill().map((_, i) => new Date(year, month, i + 2, 8))
                .filter(day => day.getDay() % 6 !== 0).map((day)=>{return {title: title, start: day.toISOString(), end:new Date(year, month, day.getDate(), 17).toISOString()}});
        }

        let tableText = ""
        for(const work of allWork)
        {
            const start = Number(new Date(work.start)),
                  end = Number(new Date(work.end)),
                  planName = work.title.split("by")[0].trim()
            let remain = (end-start)/3600000,
                offset = 0
            while(remain>0)
            {
                const t = Math.min(remain, 4)
                const s = new Date(start+offset*3600000-Math.ceil((Math.random()*5))*60000).toLocaleTimeString("sv").slice(0,-3),
                      e = new Date(start+(t+offset)*3600000+Math.ceil((Math.random()*5))*60000).toLocaleTimeString("sv").slice(0,-3)
                remain -= t
                offset += t
                if(t==4)
                {
                    offset++
                    remain--
                }
                tableText += `
                <tr>
                    <td>${planName}</td>
                    <td>${new Date(start).toLocaleDateString("en-za")}</td>
                    <td><input class="form-control time start" value="${s}"></td>
                    <td><input class="form-control time end" value="${e}"></td>
                    <td class="hour">${t}</td>
                    <td><input class="form-control workDesc" value="${(await getWorkContent(planName))?.desc}"></td>
                </tr>`
            }
        }
        const form = document.createElement("div")
        form.innerHTML = `
        <style>td>input {width:100% !important}</style>
        <div class="dataTables_wrapper form-inline dt-bootstrap no-footer" style="padding-bottom:16px">
            <h4><b>${YM}</b> 預計填寫內容💌　　(${new Date(Math.max(Date.now()-604800000, monthStart)).toLocaleDateString("en-za").slice(5)}-${new Date().toLocaleDateString("en-za").slice(5)}以外時間可能無法正常填寫)</h4>
            <table class="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                <thead>
                    <tr>
                        <th>計畫</th>
                        <th>工作日期</th>
                        <th>開始時間</th>
                        <th>結束時間</th>
                        <th>時數</th>
                        <th>工作內容</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableText}
                </tbody>
            </table>
        </div>`
        form.querySelectorAll("tbody > tr").forEach((tr)=>
        {
            const start = tr.querySelector(".start"),
                  end = tr.querySelector(".end"),
                  hour = tr.querySelector(".hour")
            start.oninput = () =>
            {
                hour.innerText = Math.floor((new Date(`2000/1/1 ${end.value}`)-new Date(`2000/1/1 ${start.value}`))/3600000) || "錯誤"
            }
            end.oninput = start.oninput
        })
        document.querySelector(":is(form[action='/workstudy/StudWorkRecord/ApplyAction'],#page-wrapper > :last-child").insertAdjacentElement("afterend", form)
        window.scrollTo(0, document.body.scrollHeight);

        btn.value = "🔽等待確認中..."

        const btnArray = Array(5).fill().map(()=>document.createElement("input"))
        const [cancel,enqueue,submit,change,del] = btnArray
        cancel.className = "btn btn-danger"
        cancel.value = "🤔取消"
        enqueue.className = "btn btn-success"
        enqueue.value = "📆放入自動填寫佇列"
        submit.className = "btn btn-primary"
        submit.value = "📝直接填寫"
        change.className = "btn btn-info"
        change.value = "🧐修改所有工作內容描述"
        del.className = "btn btn-danger"
        del.value = "😮刪除特定工作"
        btnArray.forEach((e)=>
        {
            e.type = "button"
            e.style.marginLeft = "4px"
            footer.append(e)
        })
        del.onclick = () =>
        {
            const desc = prompt(`輸入需刪除的工作，可匹配所有欄位\n✅支援正規表達式\n刪除14-27號範例：${YM}/(1[4-9]|2[0-7])`, `${YM}/(1[4-9]|2[0-7])`)
            if(!desc) return
            let checkText = "", delArray = []
            form.querySelectorAll("tbody > tr").forEach((tr)=>
            {
                const work = [...tr.querySelectorAll("td")].map((e)=>e.innerText || e.querySelector("input")?.value)
                if(work.join("\n").match(desc))
                {
                    checkText += `${work[0]}-${work[1]}-${work[2]}\n`
                    delArray.push(tr)
                }
            })
            if(delArray.length==0) return
            checkText = `檢測到${delArray.length}筆刪除資料，是否繼續刪除?\n` + checkText
            if(confirm(checkText)) delArray.forEach((e)=>e.remove())
        }
        change.onclick = () =>
        {
            const desc = prompt("輸入需修改的描述", document.querySelector(".workDesc").value)
            if(desc) document.querySelectorAll(".workDesc").forEach((e)=>{e.value=desc})
        }
        cancel.onclick = () =>
        {
            btnArray.forEach((e)=>e.remove())
            form.remove()
            btn.value = `😎一鍵填寫 ${YM} 工作日誌`
            btn.disabled = false
        }
        enqueue.onclick = ()=>
        {
            btnArray.forEach((e)=>e.remove())
            btn.value = "😎已放入自動填寫佇列"
            iziToastProxy.success({title:"[雲科工作日誌]", message:"已放入自動填寫佇列", position: "topCenter"})
            workQueue.length = 0;
            form.querySelectorAll("tbody > tr").forEach((tr)=>
            {
                const [planName, date, start, end, hour, desc] = [...tr.querySelectorAll("td")].map((e)=>e.innerText || e.querySelector("input")?.value)
                workQueue.push({state: workState.waiting, planName, date, start, end, hour, desc})
            })
            initAutoFillForm()
            autoFillForm.hidden = false
            GM_setValue("workQueueTimeout", monthEnd.getTime())
            GM_setValue("workQueue", workQueue)
        }
        submit.onclick = async () =>
        {
            if([...form.querySelectorAll(".time")].some((e)=>!e.value.match(/^\d{2}:\d{2}$/)) || [...form.querySelectorAll(".hour")].some((e)=>!Number(e.innerText))) if(!confirm("偵測到填寫錯誤，是否繼續送出?")) return
            btnArray.forEach((e)=>e.remove())
            btn.value = "😋處理送出中..."
            for(const tr of form.querySelectorAll("tbody > tr"))
            {
                const [planName, date, start, end, hour, desc] = [...tr.querySelectorAll("td")].map((e)=>e.innerText || e.querySelector("input")?.value)
                const body = `DateContract=${date.replace(/\//g,"%2F")}%2C${(await getWorkContent(planName))?.id}&`+
                    `StartHour=${Number(start.split(":")[0])}&StartMin=${Number(start.split(":")[1])}&`+
                    `EndHour=${Number(end.split(":")[0])}&EndMin=${Number(end.split(":")[1])}&`+
                    `IsAnnualLeave=false&WorkContent=${encodeURIComponent(desc)}&Hours=${hour}`;
                tr.querySelector("td").innerText += await fetch("https://webapp.yuntech.edu.tw/workstudy/StudWorkRecord/ApplyAction", {
                    "headers": {"content-type": "application/x-www-form-urlencoded",},
                    "body": body,
                    "method": "POST",
                }).then((e)=>e.text()).then((e)=>e.includes("填寫完成") ? "✅":`　❌${String(e.match(/(?<=×<\/button>)[^<]+/)??"未知錯誤(可能已超時)").trim()}`);
            }
            btn.value = "😎填寫完成"
        }
    }

    console.log("it's works!")
})()






