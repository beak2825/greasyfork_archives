// ==UserScript==
// @name         谷歌搜索自定义风格总结
// @description  多风格、多模型可选/添加 预定义角色可选/添加 + 可拖拽面板 + TTS + 用的硅基API，国内模型对某些风格并不支持，你们可以自行修改，而且其他浏览器你们也可以扩展下
// @author       songmile
// @version      1.4
// @license      MIT
// @namespace    http://tampermonkey.net/
// @match        https://www.google.com/search*
// @run-at       document-end
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/523342/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A3%8E%E6%A0%BC%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/523342/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A3%8E%E6%A0%BC%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(async () => {

  let defaultEndpoint = "https://api.siliconflow.cn/v1/chat/completions"
  let defaultToken    = "<token>"
  let qwenEndpoint = await GM.getValue("QWEN_API_ENDPOINT", defaultEndpoint)
  let qwenToken    = await GM.getValue("QWEN_BEARER_TOKEN", defaultToken)

  let modelList = [
    "Qwen/Qwen2.5-7B-Instruct",
    "deepseek-ai/DeepSeek-V2.5",
    "Qwen/QVQ-72B-Preview"
  ]
  let modelMode = modelList[0]

  let rolePrompts = {
    "猫娘风格": "以猫娘口吻写作，大约 100 字，用中文。专业但可爱，常用“喵、嗯、好耶，好棒”一类语气词，对观点进行小短评。",
    "导师PUA风": "使用强烈的批评和打击，带一点激励，整体像导师对不满意的研究生。参考示例：“说实话，我对你最近的表现很失望。当初破格收你进实验室，是看中你的潜力的……你要是再发不出一作，明年的开题就别想了。”语言中带威胁、讽刺、贬低，且强调科研思维和独立思考的重要性。约100字，不要太温和。",
    "学术妲己风": "结合妲己的妩媚撩人腔调，但暗含一定学术严谨。说话时既能撒娇，也能引用文献式表达，不要低俗，可做出一些“嗯哼~ 这篇论文，姐姐觉得似乎欠了点火候”之类的表述。",
    "玩梗狂魔风": "大量使用互联网梗、鬼畜梗、弹幕梗。段落轻松幽默，可出现“哈哈哈”、“笑死我了”或表情包文字。适度融入段子，让人会心一笑。",
    "霸道总裁风": "模拟“霸道总裁”的语气，讲话自带命令和冷酷，但也偶尔流露关心。例如：“我不想再说第二遍，这个项目我势在必得。你要做的，就是搞定一切，否则后果自负。”注意保持精英口吻，带点强势，字里行间有一点甜宠也行。"
  }
  let roleMode = "猫娘风格"

  let allSummaries = []
  let currentUtter = null
  let isPaused      = false

  function createControlPanel() {
    const panel = document.createElement("div")
    panel.id = "qwen-panel"
    panel.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 420px;
      background: #fff;
      border: 2px solid #ccd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 999999;
      user-select: none;
      font-family: sans-serif;
    `
    const titleBar = document.createElement("div")
    titleBar.style.cssText = `
      background: linear-gradient(45deg, #aaf, #eef);
      padding: 6px 10px;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 6px 6px 0 0;
    `
    const titleText = document.createElement("span")
    titleText.innerText = "谷歌搜索自定义总结 || 公众号：Songmile"
    titleText.style.fontWeight = "bold"
    const toggleBtn = document.createElement("button")
    toggleBtn.innerText = "收起"
    toggleBtn.style.cursor = "pointer"
    toggleBtn.addEventListener("click", () => {
      if (panel.classList.contains("collapsed")) {
        panel.classList.remove("collapsed")
        content.style.display = "block"
        toggleBtn.innerText = "收起"
      } else {
        panel.classList.add("collapsed")
        content.style.display = "none"
        toggleBtn.innerText = "展开"
      }
    })
    titleBar.appendChild(titleText)
    titleBar.appendChild(toggleBtn)
    panel.appendChild(titleBar)

    const content = document.createElement("div")
    content.style.cssText = "padding:8px; display:block;"

    const endpointLabel = document.createElement("label")
    endpointLabel.innerText = "API Endpoint: "
    const endpointInput = document.createElement("input")
    endpointInput.type = "text"
    endpointInput.style.width = "100%"
    endpointInput.value = qwenEndpoint
    endpointInput.addEventListener("change", async () => {
      qwenEndpoint = endpointInput.value.trim()
      await GM.setValue("QWEN_API_ENDPOINT", qwenEndpoint)
    })

    const tokenLabel = document.createElement("label")
    tokenLabel.innerText = "Bearer Token: "
    const tokenInput = document.createElement("input")
    tokenInput.type = "text"
    tokenInput.style.width = "100%"
    tokenInput.value = qwenToken
    tokenInput.addEventListener("change", async () => {
      qwenToken = tokenInput.value.trim()
      await GM.setValue("QWEN_BEARER_TOKEN", qwenToken)
    })

    const apiBox = document.createElement("div")
    apiBox.style.marginBottom = "6px"
    apiBox.appendChild(endpointLabel)
    apiBox.appendChild(document.createElement("br"))
    apiBox.appendChild(endpointInput)
    apiBox.appendChild(document.createElement("br"))
    apiBox.appendChild(tokenLabel)
    apiBox.appendChild(document.createElement("br"))
    apiBox.appendChild(tokenInput)

    const modelBox = document.createElement("div")
    modelBox.style.marginBottom = "8px"
    const modelLabel = document.createElement("label")
    modelLabel.innerText = "模型选择："
    const modelSelect = document.createElement("select")
    modelList.forEach(m => {
      const opt = document.createElement("option")
      opt.value = m
      opt.textContent = m
      modelSelect.appendChild(opt)
    })
    modelSelect.value = modelMode
    modelSelect.addEventListener("change", async () => {
      modelMode = modelSelect.value
      await reAnnotateAll()
    })
    const addModelInput = document.createElement("input")
    addModelInput.type = "text"
    addModelInput.placeholder = "输入新模型名称"
    addModelInput.style.width = "66%"
    addModelInput.style.marginRight = "4px"
    const addModelBtn = document.createElement("button")
    addModelBtn.textContent = "添加模型"
    addModelBtn.addEventListener("click", () => {
      const newModel = addModelInput.value.trim()
      if (!newModel) return
      modelList.push(newModel)
      const opt = document.createElement("option")
      opt.value = newModel
      opt.textContent = newModel
      modelSelect.appendChild(opt)
      addModelInput.value = ""
      alert("模型已添加到列表")
    })
    modelBox.appendChild(modelLabel)
    modelBox.appendChild(modelSelect)
    modelBox.appendChild(document.createElement("br"))
    modelBox.appendChild(addModelInput)
    modelBox.appendChild(addModelBtn)

    const roleBox = document.createElement("div")
    roleBox.style.marginBottom = "8px"
    const roleLabel = document.createElement("label")
    roleLabel.innerText = "角色风格："
    const roleSelect = document.createElement("select")
    Object.keys(rolePrompts).forEach(r => {
      const opt = document.createElement("option")
      opt.value = r
      opt.textContent = r
      roleSelect.appendChild(opt)
    })
    roleSelect.value = roleMode
    roleSelect.addEventListener("change", async () => {
      roleMode = roleSelect.value
      await reAnnotateAll()
    })
    const addRoleNameInput = document.createElement("input")
    addRoleNameInput.type = "text"
    addRoleNameInput.placeholder = "角色名称"
    addRoleNameInput.style.width = "33%"
    const addRolePromptInput = document.createElement("input")
    addRolePromptInput.type = "text"
    addRolePromptInput.placeholder = "角色Prompt"
    addRolePromptInput.style.width = "33%"
    const addRoleBtn = document.createElement("button")
    addRoleBtn.textContent = "添加角色"
    addRoleBtn.addEventListener("click", async () => {
      const rName = addRoleNameInput.value.trim()
      const rPrompt = addRolePromptInput.value.trim()
      if (!rName || !rPrompt) return
      rolePrompts[rName] = rPrompt
      const opt = document.createElement("option")
      opt.value = rName
      opt.textContent = rName
      roleSelect.appendChild(opt)
      addRoleNameInput.value = ""
      addRolePromptInput.value = ""
      alert("角色已添加到列表")
    })
    roleBox.appendChild(roleLabel)
    roleBox.appendChild(roleSelect)
    roleBox.appendChild(document.createElement("br"))
    roleBox.appendChild(addRoleNameInput)
    roleBox.appendChild(addRolePromptInput)
    roleBox.appendChild(addRoleBtn)

    const aggBtn = document.createElement("button")
    aggBtn.textContent = "生成搜索综合"
    aggBtn.style.marginRight = "6px"
    aggBtn.addEventListener("click", async () => {
      if (!allSummaries.length) {
        alert("暂无摘要可汇总")
        return
      }
      const combinedText = allSummaries
        .map((obj, i) => `(${i+1})【${obj.title}】：${obj.summary}`)
        .join("\n\n")
      const aggregatorPrompt = `
        我收集了以下搜索结果的简要内容，请你以角色【${roleMode}】，再用模型【${modelMode}】写1~2段综合，
        以下是所有摘要：
        ${combinedText}
      `
      const finalSummary = await callQwen(aggregatorPrompt)
      if (finalSummary) displayGlobalSummary(finalSummary)
    })

    const mdBtn = document.createElement("button")
    mdBtn.textContent = "导出MD"
    mdBtn.style.marginRight = "6px"
    mdBtn.addEventListener("click", () => {
      if (!allSummaries.length) {
        alert("暂无可导出的摘要")
        return
      }
      const lines = allSummaries.map(
        (o, i) => `## ${i+1}. ${o.title}\n\n${o.summary}`
      )
      alert("Markdown:\n\n" + lines.join("\n\n---\n\n"))
    })

    const clearBtn = document.createElement("button")
    clearBtn.textContent = "清空数据"
    clearBtn.style.color = "red"
    clearBtn.addEventListener("click", () => {
      if (confirm("确定清空所有摘要吗")) {
        allSummaries = []
        alert("已清空")
      }
    })

    const btnBox = document.createElement("div")
    btnBox.style.marginBottom = "8px"
    btnBox.appendChild(aggBtn)
    btnBox.appendChild(mdBtn)
    btnBox.appendChild(clearBtn)

    const ttsControl = document.createElement("div")
    ttsControl.style.cssText = "background:#eef; padding:4px; border-radius:4px;"
    const ttsTitle = document.createElement("div")
    ttsTitle.innerHTML = "<b>语音控制：</b>"

    const playBtn = document.createElement("button")
    playBtn.textContent = "播放/继续"
    playBtn.addEventListener("click", () => {
      if (currentUtter && isPaused) {
        window.speechSynthesis.resume()
        isPaused = false
      } else {
        alert("请先点击某条摘要的语音播报按钮")
      }
    })
    const pauseBtn = document.createElement("button")
    pauseBtn.textContent = "暂停"
    pauseBtn.addEventListener("click", () => {
      if (!currentUtter) {
        alert("暂无播放可暂停")
        return
      }
      window.speechSynthesis.pause()
      isPaused = true
    })
    const stopBtn = document.createElement("button")
    stopBtn.textContent = "停止"
    stopBtn.addEventListener("click", () => {
      window.speechSynthesis.cancel()
      currentUtter = null
      isPaused = false
    })

    ttsControl.appendChild(ttsTitle)
    ttsControl.appendChild(playBtn)
    ttsControl.appendChild(pauseBtn)
    ttsControl.appendChild(stopBtn)

    content.appendChild(apiBox)
    content.appendChild(modelBox)
    content.appendChild(roleBox)
    content.appendChild(btnBox)
    content.appendChild(ttsControl)

    panel.appendChild(content)
    document.body.appendChild(panel)

    let offsetX=0, offsetY=0
    let isDragging=false
    titleBar.addEventListener("mousedown", (e) => {
      isDragging=true
      offsetX = e.clientX - panel.offsetLeft
      offsetY = e.clientY - panel.offsetTop
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    })
    function onMove(e) {
      if (!isDragging) return
      panel.style.left = e.clientX - offsetX + "px"
      panel.style.top  = e.clientY - offsetY + "px"
    }
    function onUp() {
      isDragging=false
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
  }

  function displayGlobalSummary(summaryText) {
    const old = document.querySelector("#qwen-global-summary")
    if (old) old.remove()
    const div = document.createElement("div")
    div.id = "qwen-global-summary"
    div.style.cssText = `
      background: #fffbe6;
      border: 1px dashed #ccc;
      padding: 10px;
      margin: 10px auto;
      max-width: 800px;
      font-size: 15px;
      line-height: 1.6;
      color: #333;
    `
    div.textContent = "【综合】 " + summaryText
    document.body.insertBefore(div, document.body.firstChild)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function callQwen(promptText, attempt=1) {
    try {
      const ticker = document.querySelector("#qwen-ticker")
      ticker.classList.add("working")
      ticker.style.opacity = "1"
      const requestBody = {
        model: modelMode,
        messages: [
          { role: "user", content: promptText }
        ],
        stream: false,
        max_tokens: 512,
        stop: ["null"],
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1
      }
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${qwenToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
      const response = await fetch(qwenEndpoint, options)
      if (!response.ok) {
        if (response.status===429 && attempt===1) {
          await new Promise(r=>setTimeout(r,5000))
          return callQwen(promptText,2)
        }
        throw new Error(`status=${response.status}`)
      }
      const data = await response.json()
      const finalText = parseQwenResponse(data)
      ticker.classList.remove("working")
      setTimeout(()=>{ticker.style.opacity="0"},1200)
      return finalText
    } catch(err) {
      const ticker = document.querySelector("#qwen-ticker")
      ticker.classList.remove("working")
      ticker.style.opacity="0"
      return null
    }
  }

  function parseQwenResponse(jsonData) {
    if (!jsonData) return "[返回为空]"
    if (!jsonData.choices || !jsonData.choices.length) return "[choices为空]"
    const c = jsonData.choices[0]
    if (!c.message || typeof c.message.content!=="string") return "[content不是字符串]"
    return c.message.content.trim() || "[空]"
  }

  async function processArticle(article, title, url) {
    try {
      const userQuery  = document.querySelector("textarea")?.value || ""
      const rolePrompt = rolePrompts[roleMode] || rolePrompts["猫娘风格"]
      const promptText = `
        我正在搜索与【${userQuery}】相关的内容。
        有一篇文章大约100字的概括，用角色【${roleMode}】：
        ${rolePrompt}
        如果URL无法访问可不输出。
        标题：${title}
        链接：${url}
      `
      const summary = await callQwen(promptText)
      if (!summary) {
        insertError(article, "生成失败")
        return
      }
      let targetElement =
        article.parentElement.parentElement.parentElement.parentElement
          .nextSibling?.querySelectorAll("div>span")[1] ||
        article.parentElement.parentElement.parentElement.parentElement
          .nextSibling?.querySelectorAll("div>span")[0]
      if (!targetElement) return
      targetElement.parentElement.style.webkitLineClamp = "30"
      article.classList.add("qwen-annotated")
      targetElement.textContent=""

      const chunkSize=20
      let displayText="✦ "
      targetElement.textContent=displayText
      for (let i=0;i<summary.length;i+=chunkSize) {
        const chunk = summary.slice(i,i+chunkSize)
        const span = document.createElement("span")
        span.style.opacity="0"
        span.textContent=chunk
        targetElement.appendChild(span)
        await new Promise(r=>setTimeout(r,100))
        span.style.transition="opacity 1s ease-in-out"
        span.style.opacity="1"
      }
      allSummaries.push({ title, summary })
      const ttsBtn = document.createElement("button")
      ttsBtn.textContent="语音播报"
      ttsBtn.style.cssText="margin-left:6px; font-size:12px; cursor:pointer;"
      ttsBtn.addEventListener("click",()=>{
        if (!window.speechSynthesis) {
          alert("不支持TTS")
          return
        }
        window.speechSynthesis.cancel()
        isPaused=false
        currentUtter=new SpeechSynthesisUtterance(summary)
        window.speechSynthesis.speak(currentUtter)
      })
      targetElement.appendChild(ttsBtn)
    } catch(e) {
      insertError(article,"生成失败："+e?.message)
    }
  }

  function insertError(article, msg) {
    let targetElement =
      article.parentElement.parentElement.parentElement.parentElement
        .nextSibling?.querySelectorAll("div>span")[1] ||
      article.parentElement.parentElement.parentElement.parentElement
        .nextSibling?.querySelectorAll("div>span")[0]
    if (targetElement) targetElement.textContent = "[Qwen失败] "+msg
  }

  async function throttledProcessArticle(article, title, url, interval) {
    await new Promise(res=>setTimeout(res,interval))
    return processArticle(article, title, url)
  }

  function insertTickerElement() {
    const ticker = document.createElement("div")
    ticker.id = "qwen-ticker"
    ticker.style.cssText=`
      position: fixed;
      right:20px;
      bottom:10px;
      font-size:2em;
      color:#888;
      transition:opacity .3s;
      z-index:999999;
      pointer-events:none;
    `
    ticker.innerHTML="✦"
    document.body.appendChild(ticker)
    const style=document.createElement("style")
    style.textContent=`
      @keyframes rotateGlow {
        0% { transform: rotate(0deg) scale(1); color:#fc8; }
        25%{ transform: rotate(90deg) scale(1.2); color:#ff8;}
        50%{ transform: rotate(180deg) scale(1); color:#8cf;}
        75%{ transform: rotate(270deg) scale(1.2); color:#f8f;}
        100%{transform: rotate(360deg) scale(1); color:#fc8;}
      }
      #qwen-ticker.working {
        animation: rotateGlow 1.5s linear infinite;
      }
    `
    document.head.appendChild(style)
  }

  async function runAnnotation() {
    for (let j=0;j<30;j++){
      const articles = Array.from(document.querySelectorAll("#rso>div"))
        .map(div=>div.querySelector("span>a:not(.qwen-annotated)"))
      if (!articles.length) break
      const tasks=articles.map((link,i)=>{
        if (!link) return Promise.resolve()
        const href=link.getAttribute("href")
        const title=link.querySelector("h3")?.textContent||"无标题"
        if(!href)return Promise.resolve()
        return throttledProcessArticle(link,title,href,i*2500)
      })
      await Promise.all(tasks)
      document.querySelector("#qwen-ticker").style.opacity="0"
    }
    document.querySelector("#qwen-ticker").style.opacity="0"
  }

  async function reAnnotateAll() {
    document.querySelectorAll(".qwen-annotated").forEach(link=>{
      const container=link.parentElement?.parentElement?.parentElement?.parentElement?.nextSibling
      if(!container)return
      container.querySelectorAll("div>span").forEach(s=>s.textContent="")
      link.classList.remove("qwen-annotated")
    })
    allSummaries=[]
    await runAnnotation()
  }

  await new Promise(r=>setTimeout(r,1000))
  createControlPanel()
  insertTickerElement()
  await runAnnotation()

})()
