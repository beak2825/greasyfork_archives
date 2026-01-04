// ==UserScript==
// @name         Zotero GPT Connector
// @description  Zotero GPT Pro: Supports virtually all the AI platforms you know.
// @namespace    http://tampermonkey.net/
// @icon         https://github.com/MuiseDestiny/zotero-gpt/blob/bootstrap/addon/chrome/content/icons/favicon.png?raw=true
// @noframes
// @version      4.4.8
// @author       Polygon
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://poe.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://chatglm.cn/*
// @match        https://yiyan.baidu.com/*
// @match        https://qianwen.aliyun.com/*
// @match        https://claude.ai/*
// @match        https://mytan.maiseed.com.cn/*
// @match        https://mychandler.bet/*
// @match        https://chat.deepseek.com/*
// @match        https://www.doubao.com/chat/*
// @match        https://*.chatshare.biz/*
// @match        https://chat.kelaode.ai/*
// @match        https://chat.rawchat.cn/*
// @match        https://chat.sharedchat.*/*
// @match        https://node.dawuai.buzz/*
// @match        https://aistudio.google.com/*
// @match        https://claude.ai0.cn/*
// @match        https://grok.com/*
// @match        https://china.aikeji.vip/*
// @match        https://chatgtp.chat/*
// @match        https://iai.aichatos8.com.cn/*
// @match        https://share.mosha.cloud/*
// @include      /.+gpt2share.+/
// @include      /.+rawchat.+/
// @include      /.+kimi.+/
// @include      /.+freeoai.+/
// @include      /.+chatgpt.+/
// @include      /.+claude.+/
// @include      /.+qwen.+/
// @include      /.+coze.+/
// @include      /.+grok.+/
// @include      /.+tongyi.+/
// @include      /.+chatopens.+/
// @include      /.+kelaode.+/
// @match        https://github.com/copilot/*
// @match        https://shareai.cfd/*
// @match        https://lmarena.ai/*
// @match        https://*.mjpic.cc/*
// @match        https://chat.minimaxi.com/*
// @match        https://*.mjpic.cc/*
// @match        https://www.zaiwen.top/chat/*
// @match        https://chat.aite.lol/*
// @match        https://yuanbao.tencent.com/chat/*
// @match        https://chatgptup.com/*
// @match        https://ihe5u7.aitianhu2.top/*
// @match        https://cc01.plusai.io/*
// @match        https://arc.aizex.me/*
// @match        https://www.chatwb.com/*
// @match        https://www.xixichat.top/*
// @match        https://zchat.tech/*
// @match        https://*.sorryios.*/*
// @match        https://monica.im/*
// @match        https://copilot.microsoft.com/*
// @match        https://gptsdd.com/*
// @match        https://max.bpjgpt.top/*
// @match        https://nbai.tech/
// @match        https://x.liaobots.work/*
// @match        https://x.liaox.ai/*
// @match        https://chat.qwenlm.ai/*
// @match        https://lke.cloud.tencent.com/*
// @match        https://dazi.co/*
// @match        https://www.wenxiaobai.com/*
// @match        https://www.techopens.com/*
// @match        https://xiaoyi.huawei.com/*
// @match        https://chat.baidu.com/*
// @match        https://qrms.com/*
// @match        https://www.perplexity.ai/*
// @match        https://sider.ai/*
// @match        https://saas.ai1.bar/*
// @match        https://sx.xiaoai.shop/*
// @match        https://oai.liuliangbang.vip/*
// @match        https://*.dftianyi.com/*
// @match        https://notebooklm.google.com/notebook/*
// @match        https://chat.bpjgpt.top/*
// @match        https://*.plusai.io/*
// @match        https://*.plusai.me/*
// @match        https://*.yrai.cc/*
// @connect      *
// @connect      https://kimi.moonshot.cn/*
// @connect      https://chatglm.cn/*
// @connect      https://chat.deepseek.com/*
// @connect      https://chatgpt.com/*
// @connect      http://127.0.0.1:23119/zoterogpt
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480616/Zotero%20GPT%20Connector.user.js
// @updateURL https://update.greasyfork.org/scripts/480616/Zotero%20GPT%20Connector.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  let isRunning = true
  let AI = "ChatGPT"
  const host = location.host
  if (host == 'chatgpt.com') {
    AI = "ChatGPT"
  } else if (host == 'gemini.google.com') {
    AI = "Gemini"
  } else if (host == 'poe.com') {
    AI = "Poe"
  } else if (host == 'kimi.moonshot.cn' || host == 'www.kimi.com') {
    AI = "Kimi"
  } else if (host.includes('coze')) {
    AI = "Coze"
  } else if (host == "chatglm.cn") {
    AI = "Chatglm"
  } else if (host == 'yiyan.baidu.com') {
    AI = "Yiyan"
  } else if (host.includes('tongyi')) {
    AI = "Tongyi"
  } else if (["claude", "kelaode", "yrai", "aikeji", "gpt2share"].find(i=>host.includes(i)) ) {
    AI = "Claude"
  } else if (host == 'mytan.maiseed.com.cn') {
    AI = "MyTan"
  } else if (host == 'mychandler.bet') {
    AI = "ChanlderAi"
  } else if (host == 'chat.deepseek.com') {
    AI = "DeepSeek"
  } else if (host == "www.doubao.com") {
    AI = "Doubao"
  } else if (host == 'aistudio.google.com') {
    AI = "AIStudio"
  } else if (host == "www.zaiwen.top") {
    AI = "Zaiwen"
  } else if (host == 'yuanbao.tencent.com') {
    AI = "Yuanbao"
  } else if (host == "www.tiangong.cn") {
    AI == "Tiangong"
  } else if (host == 'monica.im') {
    AI = "Monica"
  } else if (host == 'copilot.microsoft.com') {
    AI = "Copilot"
  } else if (location.host.includes('qwen')) {
    AI = "Qwen"
  } else if (location.host == 'lke.cloud.tencent.com') {
    AI = "TencentDeepSeek"
  } else if (location.host == 'dazi.co') {
    AI = "AskManyAI"
  } else if (location.host == 'www.wenxiaobai.com') {
    AI = "Wenxiaobai"
  } else if (location.host.includes('grok')) {
    AI = "Grok"
  } else if (location.host == 'xiaoyi.huawei.com') {
    AI = "Xiaoyi"
  } else if (location.host == 'chat.baidu.com') {
    AI = "Baidu"
  } else if (location.host == 'www.perplexity.ai') {
    AI = "Perplexity"
  } else if (location.host == 'sider.ai') {
    AI = "Sider"
  } else if (host == 'notebooklm.google.com') {
    AI = "GoogleNotebookLM"
  } else if (host == 'chat.minimaxi.com') {
    AI = "MinMax"
  } else if (host == 'lmarena.ai') {
    AI = "LMArena"
  } else if (host == 'github.com') {
    AI = "GitHubCopilot"
  }

  const getOutputText = (resp = "", think= "") => {
    let text = ""
    if (think) {
      text += ("<think>" + think)
      if (resp) { text += "</think>"}
    }
    text += resp
    return text
  }
  const requestPatchArr = [
    {
      AI: "Kimi",
      regex: /ChatService\/Chat/,
      extract: function (text, allText) {
        console.log(allText)
        let think="", resp = ""
        const arr = allText.split(/\x00\x00\x00\x00[^\{]+/).filter(Boolean).map(i=>{
          try{return JSON.parse(i)} catch {return {}}
        })
        for (let data of arr) {
          if (data.op != "append") {continue}
          if (data.mask == "block.think.content") {
            think += data.block.think.content || ""
          } else if (data.mask == "block.text.content") {
            resp += data.block.text.content || ""
          }
        }
        this.text = getOutputText(resp, think)
      },
      text: ""
    },
    {
      AI: "Tongyi",
      regex: /dialog\/conversation/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let s of allText.split("\n")) {
          try {
            if (!s || !s.startsWith("data: {")) { continue }
            const data = JSON.parse(s.slice(5))
            if (data.contents[0].contentType == "text") {
              if (data.contents[0].incremental) {
                resp += data.contents[0].content || ""
              } else {
                resp = data.contents[0].content || ""
              }
            } else if (data.contents[0].contentType == "think") {
              think += JSON.parse(data.contents[0].content).content || ""
            }
          } catch (e) {console.log(e)}
        }
        this.text = getOutputText(resp, think)
      },
      text: ""
    },
    {
      AI: "AIStudio",
      regex: /GenerateContent$/,
      extract: function (text) {
        let data
        while (!data) {
          try {
            data = JSON.parse(text)
          }catch {
            text += "]"
          }
        }
        console.log(data)
        let think = "", resp = ""
        for (let i of data[0]) {
          try {
            let s = i[0][0][0][0][0][1]
            if (i[0][0][0][0][0][12]) {
              think += s 
            } else {
              resp += s 
            }
          } catch {}
        }
        this.text = getOutputText(resp, think)
      },
      text: "",
    },
    {
      AI: "ChatGPT",
      regex: /conversation$/,
      extract: function (text) {
        for (let line of text.split("\n")) {
          console.log("line", line)
          if (line.startsWith('data: {"message')) {
            try { JSON.parse(line.split("data: ")[1]) } catch { continue }
            const data = JSON.parse(line.split("data: ")[1])
            if (data.message.content.content_type == "text") {
              this.text = data.message.content.parts[0]
            }
          } else if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data: ")[1]) } catch { continue }
            const data = JSON.parse(line.split("data: ")[1])
            console.log(data, this.p)
            const streamPath = "/message/content/parts/0"
            if (Object.keys(data).length == 1 && typeof (data.v) == "string" && this.p == streamPath) {
              this.text += data.v
              console.log("text", this.text)
            } else if ((this.p == streamPath || data.p == streamPath)) {
              this.p = streamPath
              if (data.o && data.o == "add") {
                this.text = ""
              }
              if (typeof (data.v) == "string") {
                this.text += data.v
              } else if (Array.isArray(data.v)) {
                const d = data.v.find(i => i.p == streamPath)
                if (d && typeof (d.v) == "string") {
                  this.text += d.v
                }
              }
            } else {
              this.p = ""
            }
          } else if (line.startsWith("data: [")) {
            try {
              const delta = JSON.parse(line.replace(/^data:\s/, "")).slice(-1)[0]
              if (typeof (delta) == "string" ) {
                this.text += delta
              }
            } catch {}
          }
        }
      },
      p: "",
      text: ""
    },
    {
      AI: "Claude",
      regex: /chat_conversations\/.+\/completion/,
      extract: function (text) {
        for (let line of text.split("\n")) {
          if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data: ")[1]) } catch { continue }
            const data = JSON.parse(line.split("data: ")[1])
            if (data.type && data.type == "completion") {
              this.text += data.completion || ""
            } else if (data.type && data.type == "content_block_delta") {
              this.text += data.delta.text || ""
            }
          }
        }
      },
      text: ""
    },
    {
      AI: "Chatglm",
      regex: /stream/,
      extract: function (text) {
        for (let line of text.split("\n")) {
          if (line.startsWith("data:")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              if (data.parts && data.parts[0] && data.parts[0].content[0].type == "text") {
                this.text = data.parts[0].content[0].text
              }
            } catch (e) { console.log("extract", e) }
          }
        }
      },
      text: ""
    },
    {
      AI: "Zaiwen",
      regex: /admin\/chatbot$/,
      extract: function (text) {
        this.text = text

      },
      text: ""
    },
    {
      AI: "Yuanbao",
      regex: /api\/chat\/.+/,
      extract: function (allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data: ")[1]) } catch { continue }
            const data = JSON.parse(line.split("data: ")[1])
            try {
              if (data.type == "text") {
                resp += (data.msg || "")
              } else if (data.type == "think") {
                think += (data.content || "")
              } else if (data.type == "replace") {
                resp += `![](${data.replace.multimedias[0].url})\n${data.replace.multimedias[0].desc}`
              }
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)
      },
      text: ""
    },
    {
      AI: "DeepSeek",
      regex: /completion$/,
      extract: function (text) {
        let resp = "", think = ""
        for (let line of text.split("\n")) {
          if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data: ")[1]) } catch { continue }
            const data = JSON.parse(line.split("data: ")[1])
            try {
              if (data.choices) {
                if (data.choices[0].delta.type == "thinking") {
                  think += (data.choices[0].delta.content || "")
                } else if (data.choices[0].delta.type == "text") {
                  resp += (data.choices[0].delta.content || "")
                }
              } else {
                if (Array.isArray(data.v) && data.v[0].type) {
                  this.type = data.v[0].type
                  data.v = data.v[0].content
                }
                if (typeof (data.v) == "string") {
                  if (this.type == "THINK") {
                    think += data.v || ""
                  } else if (this.type == "RESPONSE") {
                    resp += data.v || ""
                  }
                }
              }
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)
      },
      text: "",
    },
    {
      AI: "ChanlderAi",
      regex: /api\/chat\/Chat$/,
      extract: function (text) {
        for (let line of text.split("\n")) {
          console.log("line", line)
          if (line.startsWith("data:{")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              this.text += data.delta
            } catch (e) { console.log("extract", e) }
          }
        }

      },
      text: ""
    },
    {
      AI: "Yiyan",
      regex: /chat\/conversation\/v2$/,
      extract: function (text, allText) {
        let delta = ""
        for (let line of allText.split("\n\nevent:message\n")) {
          if (line.startsWith("data:{")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              delta += data.data.text || ""
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = delta
      },
      text: "",
    },
    {
      AI: "Doubao",
      regex: /samantha\/chat\/completion/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(JSON.parse(line.slice(5)).event_data)
              const data1 = JSON.parse(data.message.content)

              if (![1, 5, 6].includes(data1.type) ) {
                if (data1.text) {
                  resp += data1.text
                } else if (data1.think) {
                  think += data1.think
                }
              }
            } catch {}
          }
        }
        this.text = getOutputText(resp, think)
      },
      text: "",
    },
    {
      AI: "Monica",
      regex: /api.monica.im\/api\/custom_bot\/chat/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data:")) {
            const data = JSON.parse(line.slice(5))
            if (Boolean(data.agent_status) && Boolean(data.agent_status.type == "thinking_detail_stream")) {
              think += (data.agent_status.metadata.reasoning_detail || "")
            }
            resp += data.text
          }
        }
        this.text = getOutputText(resp, think)
      },
      text: "",
    },
    {
      AI: "Qwen",
      regex: /chat\/completions/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              if (data.choices[0].delta.phase == "think") {
                think += data.choices[0].delta.content
              } else if (data.choices[0].delta.phase == "answer") {
                resp += data.choices[0].delta.content
              }
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "AskManyAI",
      regex: /engine\/sseQuery/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data: {")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              if (data.content.startsWith("[HIT-REF]")) { continue}
              if (data.event == "thinking") {
                think += data.content
              } else if (data.event == "resp") {
                resp += data.content
              }
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "Wenxiaobai",
      regex: /conversation\/chat\/v\d$/,
      extract: function (_, allText) {
        if (!allText) { return }
        let resp = ""
        for (let line of allText.replace(/event:message\ndata/g, "message").split("\n")) {
          if (line.startsWith("message:{")) {
            try { JSON.parse(line.split("message:")[1]) } catch { continue }
            const data = JSON.parse(line.split("message:")[1])
            try {
                resp += data.content || ""
            } catch (e) { console.log("extract", e) }
          }
        }
        console.log(resp)
        resp = resp.replace(/^```ys_think[\s\S]+?\n\n```\n/, "").replace(/[\s\S]+?```ys_think/, "```ys_think")
        if (resp.includes("```ys_think")) {
          resp = ">"+resp.split("\n").slice(3).join("\n>")
        }
        this.text = resp
      },
      text: "",
    },
    {
      AI: "Coze",
      regex: /conversation\/chat/,
      extract: function (text, allText) {
        for (let line of text.split("\n")) {
          if (line.startsWith("data:{")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              if (data.message.type == "answer") {

                this.text += data.message.content || ""
              }
            } catch (e) { console.log("extract", e) }
          }
        }
      },
      text: "",
    },
    {
      AI: "Grok",
      regex: /(conversations\/new|responses)$/,
      extract: function (text, allText) {
        console.log(text)
        let resp="", think=""
        for (let t of allText.split("\n") ) {
          let data
          try {
            data = JSON.parse(t).result
            if (data.response) {data = data.response}
            if (data.isThinking) {
              think += data.token || ""
            } else{
              resp += data.token || ""
            }
          } catch {continue}
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "Baidu",
      regex: /conversation$/,
      extract: function (text, allText) {
        let resp = "", think = ""
        for (let t of allText.split("\n")) {
          if (!t.startsWith("data:")) {continue}
          let data
          console.log(t.slice(5))
          try {
            data = JSON.parse(t.slice(5)).data
          } catch { continue }
          console.log(data)
          if (!data) { continue}
          if (data.message.metaData.state == "generating-resp") {
            if (data.message.content.generator.component == "reasoningContent") {
              think += data.message.content.generator.data.value || ""
            } else if (data.message.content.generator.component == "markdown-yiyan"){
              resp += data.message.content.generator.data.value || ""
            }
          }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "MyTan",
      regex: /messages$/,
      extract: function (text, allText) {
        for (let line of text.split("\n")) {
          if (line.startsWith("data:")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
                this.text += data.choices[0].delta.content
              
            } catch (e) { console.log("extract", e) }
          }
        }
      },
      text: "",
    },
    {
      AI: "Perplexity",
      regex: /perplexity_ask$/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of text.split("\n")) {
          if (line.startsWith("data:")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              if (data.blocks) {
                for (let block of data.blocks) {
                  console.log(data.blocks)
                  if (block.intended_usage == "ask_text"){
                    if (block.markdown_block && block.markdown_block.answer) {
                      resp = block.markdown_block.answer || ""
                    } else if (block.diff_block && block.diff_block.field == "markdown_block") {
                      for (let patch of block.diff_block.patches){
                        if (patch.op == "replace" && patch.path == "/answer") {
                          resp = patch.value || ""
                        }
                      }
                    }
                  }
                }
              }

            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "Sider",
      regex: /(completions|chat\/wisebase)/,
      extract: function (text, allText) {
        let think = "", resp = ""
        for (let line of allText.split("\n")) {
          if (line.startsWith("data:")) {
            try { JSON.parse(line.split("data:")[1]) } catch { continue }
            const data = JSON.parse(line.split("data:")[1])
            try {
              console.log(data)
              if (data.data.type == "reasoning_content") {
                think += data.data.reasoning_content.text || ""
              } else if (data.data.type == "text") {
                resp += data.data.text || ""
              }
            } catch (e) { console.log("extract", e) }
          }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "Gemini",
      regex: /BardFrontendService\/StreamGenerate/,
      extract: function (text) {
        let think = "", resp = ""
        for (let line of text.split(/\n\d+\n/)) {
          try {
            const data = JSON.parse(line)
            if (data[0][0] == "wrb.fr") {
              const data1 = JSON.parse(data[0][2])[4][0]
              resp = data1[1][0]
              think = data1[37][0][0]
            }
          } catch {}
        }
        this.text = getOutputText(resp.replace(/\[cite.+?\]/g, ""), think)

      },
      text: "",
    },
    {
      AI: "GoogleNotebookLM",
      regex: /data\/batchexecute/,
      extract: function (text) {
        let think = "", resp = ""
        for (let line of text.split(/\n\d+\n/)) {
          console.log(line)
          try {
            const data = JSON.parse(line)
            console.log(data)
            if (data[0][0] == "wrb.fr") {
              const data1 = JSON.parse(data[0][2])
              console.log(data1)

              resp = data1[0][0]
              // think = data1[37][0][0]
            }
          } catch { }
        }
        this.text = getOutputText(resp, think)

      },
      text: "",
    },
    {
      AI: "MinMax",
      regex: /api\/chat\/msg/,
      extract: function (text) {
        let resp = "", think = ""

        try {
          const s = text.split("\n").find(i => i.startsWith("data:"))
          const data = JSON.parse(s.slice(5))
          const content = data.data.messageResult.content
          if (content.startsWith("<think>")) {
            if (content.includes("</think>")) {
              const res = content.match(/<think>([\s\S]*?)<\/think>([\s\S]*)/)
              think = res[1] || ""
              resp = res[2] || ""
            } else {
              think = content.replace(/^<think>/, "")
            }
          } else {
            resp = content
          }
        } catch (e) {
          console.log("error", e,text)
        }
        this.text = getOutputText(resp, think)
      },
      text: "",
    },
    {
      AI: "LMArena",
      regex: /stream\/post-to-evaluation/,
      extract: function (text) {
        try {
          for (let line of text.split("\n")) {
            if (line.startsWith("a0:")) {
              this.text += JSON.parse(line.slice(3))
            }
          }

        } catch (e) {
          console.log("error", e, text)
        }
        this.text = getOutputText(this.text)
      },
      text: "",
    },
    {
      AI: "GitHubCopilot",
      regex: /github\/chat\/threads\/.+\/messages/,
      extract: function (text) {
        try {
          for (let line of text.split("\n")) {
            if (line.startsWith("data:")) {
              const data = JSON.parse(line.slice(5))
              if (data.type == "content") {
                this.text += data.body
              }
            }
          }
        } catch (e) {
          console.log("error", e, text)
        }
        this.text = getOutputText(this.text)
      },
      text: "",
    },
  ]

  // 数据拦截，部分网站需要
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async) {
    this.addEventListener('readystatechange', async function () {
      let requestPatch
      if ((requestPatch = requestPatchArr.find(i => i.AI == AI && i.regex.test(url)))) {
        execInZotero(`
            let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length - 1];
            task.responseText = ${JSON.stringify(requestPatch.text || "")};
            task.responseType = "markdown";
        `);
        if (this.readyState === 3) {
          try {
            requestPatch.extract(this.responseText)
          } catch(e) {
            console.log("error extract", e, this.responseText)
          }
          await execInZotero(`
              let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
              task.responseText = ${JSON.stringify(requestPatch.text || "")};
              task.type = "pending";
              task.responseType = "markdown"
            `)
        } else if ([0, 4].includes(this.readyState)) {
          await execInZotero(`
            let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
            task.responseText = ${JSON.stringify(requestPatch.text || "")};
            task.type = "done";
            task.responseType = "markdown"
          `)
          requestPatch.text = ""
        }
      }
    });
    originalXhrOpen.apply(this, arguments);
  };


  const originalFetch = window.fetch;
  unsafeWindow.fetch = async function () {
    // console.log("fetch")
    const response = await originalFetch.apply(this, arguments);
    let clonedResponse = response.clone();
    window.setTimeout(async () => {
      const url = response.url
      const requestPatch = requestPatchArr.find(i => i.AI == AI && i.regex.test(url))
      if (requestPatch) {
        requestPatch.text = ""
        execInZotero(`
                let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length - 1];
                task.responseText = ${JSON.stringify(requestPatch.text)};
                task.responseType = "markdown";
            `);
        console.log("requestPatch", requestPatch)
        console.log(clonedResponse)
        const reader = clonedResponse.body.getReader();
        const decoder = new TextDecoder()
        let allText = ""
        function processStream() {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log("requestPatch.text", requestPatch.text)
              // if (requestPatch.text.length > 0) {
                execInZotero(`
                      let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length - 1];
                      task.responseText = ${JSON.stringify(requestPatch.text || "")};
                      task.type = "done";
                      task.responseType = "markdown";
                  `);
                requestPatch.text = ""
              // }
              return;
            }

            // 将 Uint8Array 转为字符串
            const text = decoder.decode(value, { stream: true });
            allText += text
            try {
              requestPatch.extract(text, allText)
            } catch (e) { console.log("requestPatch.extract(text)", e) }
            execInZotero(`
                  let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length - 1];
                  task.responseText = ${JSON.stringify(requestPatch.text || "")};
                  task.responseType = "markdown";
              `);

            // 递归调用，继续读取流数据
            processStream();
          }).catch(error => {
            // 捕获所有错误，包括 AbortError
            console.log("Error when Patch", error)
            execInZotero(`
                  let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length - 1];
                  task.responseText = ${JSON.stringify(requestPatch.text || "")};
                  task.type = "done";
                  task.responseType = "markdown";
              `);
            requestPatch.text = ""
          });
        }

        // 开始处理流
        processStream();
        clonedResponse = null
      }
    })
    return response
  };


  // 在Zotero中执行代码
  async function execInZotero(code) {
    code = `
      if (!window.Meet.Connector){
        window.Meet.Connector = ${JSON.stringify({
          AI, time: Date.now() / 1e3, tasks: []
        })};
      } else {
        window.Meet.Connector.time = ${Date.now() / 1e3};
        window.Meet.Connector.AI = "${AI}";
      }
    ${code}`
    try {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: "http://127.0.0.1:23119/zoterogpt",
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "json",
          data: JSON.stringify({ code }),
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.response.result);
            } else {
              reject(new Error(`Request failed with status: ${response.status}`));
            }
          },
          onerror: function (error) {
            reject(new Error('Network error'));
          }
        });
      });
    } catch (e) {
      window.alert("execInZotero error: " + code);
      return ""
    }
  }
  return 1
  // 设定ChatGPT输入框文本并发送
  const setText = async (text) => {
    const dispatchInput = (selector) => {
      // 获取 input 输入框的dom对象
      var inputNode = document.querySelector(selector);
      if (!inputNode) { return }
      // 修改input的值

      inputNode.value = text;
      // plus
      try {
        inputNode.innerHTML = text.split("\n").map(i => `<p>${i}</p>`).join("\n");
      } catch { }
      // 设置输入框的 input 事件
      var event = new InputEvent('input', {
        'bubbles': true,
        'cancelable': true,
      });
      inputNode.dispatchEvent(event);
    }
    const setTextareaValue = async (textarea) => {
      const props = Object.values(textarea)[1]

      // 获取目标 DOM 节点（假设 temp2 是 DOM 元素引用）
      const targetElement = textarea;

      // 创建伪事件对象
      const e = {
        target: targetElement,
        currentTarget: targetElement,
        type: 'change',
      };

      // 手动设置值（需同时更新 DOM 和 React 状态）
      targetElement.value = text;

      // 触发 React 的 onChange 处理
      await props.onChange(e);
    }
    const setEditorText = async () => {
      const editor = document.querySelector('[data-lexical-editor][role=textbox]').__lexicalEditor
      await editor.setEditorState(
        editor.parseEditorState(
          {
            "root": {
              "children": [
                {
                  "children": [
                    {
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "text": text,
                      "type": "text",
                      "version": 1
                    }
                  ],
                  "direction": null,
                  "format": "",
                  "indent": 0,
                  "type": "paragraph",
                  "version": 1,
                  "textFormat": 0
                }
              ],
              "direction": null,
              "format": "",
              "indent": 0,
              "type": "root",
              "version": 1
            }
          }
        )
      )
    }
    if (AI == "ChatGPT") {
      dispatchInput('#prompt-textarea')
      await sleep(100)
      await send("article", () => {
        const button = document.querySelector('[data-testid="send-button"]');
        button.click()
      })
    } else if (AI == "Gemini") {
      // 获取 input 输入框的dom对象
      const element_input = document.querySelector('rich-textarea .textarea');
      if (!element_input) {
        return
      }
      // 修改input的值
      element_input.textContent = text;
      await sleep(100)
      await send(".conversation-container", () => {
        const button = document.querySelector('.send-button');
        button.click()
      })
    } else if (AI == "Poe") {
      dispatchInput('textarea[class*=GrowingTextArea_textArea]')
      await send("[class^=Message_selectableText]", () => {
        const button = document.querySelector('[data-button-send=true]');
        button.click()
      })
    } else if (AI == "Kimi") {
      await setEditorText()
      await send(".chat-content-item", () => {
        const button = document.querySelector('.send-button');
        button.click()
      })

    } else if (AI == "Coze") {
      const textarea = document.querySelector("textarea.rc-textarea")
      await setTextareaValue(textarea)
      await sleep(100)
      await send("[data-message-id]", () => {
        const button = document.querySelector('button[data-testid="bot-home-chart-send-button"]');
        button.click()
      })
    } else if (AI == "Chatglm") {
      dispatchInput(".input-box-inner textarea")
      await send(".item.conversation-item", () => {
        const button = document.querySelector('.enter img');
        if (button) {
          const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true
          });
          button.dispatchEvent(mouseDownEvent);
        }
      })
    } else if (AI == "Yiyan") {
      const node = document.querySelector(".oeNDrlEA")
      await node[Object.keys(node)[1]].children[2].props.children[0].props.onChange(text)
      await sleep(1e3)
      await send(".dialogue_card_item", () => {
        document.querySelector("#sendBtn").click()
      },1e3)
    } else if (AI == "Tongyi") {
      setTextareaValue(document.querySelector("textarea.ant-input"))
      await send("[class^=questionItem]", () => {
        const node2 = document.querySelector(".operateBtn--qMhYIdIu");
        node2[Object.keys(node2)[1]].onClick()
      })
    } else if (AI == "Claude") {
      dispatchInput('[contenteditable="true"]')
      await sleep(100)
      
      await send('[data-test-render-count]', () => {
        document.querySelector("button[aria-label='Send message']").click();

      })
    } else if (AI == "MyTan") {
      dispatchInput(".talk-textarea")
      await sleep(100)
      await send(".message-container .mytan-model-avatar", () => {
        const button = document.querySelector('.send-icon');
        button.click()
      })
    } else if (AI == "ChanlderAi") {
      dispatchInput(".chandler-content_input-area")
      await sleep(100)
      await send(".chandler-ext-content_communication-group", () => {
        const button = document.querySelector('.send');
        button.click()
      })
    } else if (AI == "DeepSeek") {
      const textarea = document.querySelector("textarea")

      setTextareaValue(textarea)
      await sleep(100)
      await send("._4f9bf79", () => {
        const button = document.querySelector('._7436101');
        button.click()
      })
    } else if (AI == "Doubao") {
      setTextareaValue(document.querySelector('[data-testid="chat_input_input"]'))
      await sleep(100)
      await send("[class^=message-block-container]", () => {
        const button = document.querySelector("button#flow-end-msg-send");
        button.click()
      })
    } else if (AI == "AIStudio") {
      dispatchInput(".text-wrapper textarea")
      await sleep(100)
      await send("ms-chat-turn", () => {
        const button = document.querySelector('ms-run-button button');
        button.click()
      })
    } else if (AI == "Zaiwen") {
      dispatchInput('textarea.arco-textarea')
      await sleep(100)
      await send(".sessions .item", () => {
        const button = document.querySelector('img.send');
        button.click()
      });
    } else if (AI == "Yuanbao") {
      dispatchInput('.chat-input-editor .ql-editor')
      await sleep(100)
      await send(".agent-chat__bubble__content", () => {
        const button = document.querySelector('.icon-send');
        button.click()
      })
    } else if (AI == "Monica") {
      const elements = document.querySelectorAll(".chat--PCM74");

      const visibleElements = [];

      // 遍历所有元素
      elements.forEach(element => {
        if (element.style.display !== 'none') {
          // 如果不是 'none'，将其添加到数组
          visibleElements.push(element);
        }
      });

      visibleElements.forEach(element => {
        element.parentNode.insertBefore(element, element.parentNode.firstChild);
      });

      const textarea = document.querySelector('textarea.ant-input')
      textarea[Object.keys(textarea)[1]].onChange({ target: { value: text }, currentTarget: { value: text } })
      await sleep(100)
      await send("[class^=chat-message]", () => {
        const button = document.querySelector('[class^=input-msg-btn]')
        button[Object.keys(button)[1]].onClick({ isTrusted: true, stopPropagation: () => { } })
      })
    } else if (AI == "Copilot") {
      const node = document.querySelector("textarea#userInput").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      node[Object.keys(node)[1]].children[1].props.onSubmit(text)
    } else if (AI == "Qwen") {
      dispatchInput("#chat-input")
      await sleep(100)
      await send("[id^=message]", () => {
        const button = document.querySelector('#send-message-button');
        button.click()
      })
    } else if (AI == "TencentDeepSeek") {
      document.querySelector(".question-input").__vue__.onStopStream()
      const div = document.querySelector(".question-input-inner__textarea")
      await div.__vue__.onChange(text.slice(0,10000))
      const chatDiv = document.querySelector(".client-chat");
      const total = chatDiv.__vue__.msgList.length
      // 等待新回答
      while (chatDiv.__vue__.msgList.length - total < 1) {
        document.querySelector(".question-input").__vue__.onSendQuestion()
        await sleep(100)
      }
      // 等待新回答
      while (chatDiv.__vue__.msgList.length - total < 2) {
        await sleep(100)
      }
    } else if (AI == "AskManyAI") {
      dispatchInput('textarea.textarea_input')
      await sleep(100)
      await send(".main-chat-view .bubble-ai", () => {
        const button = document.querySelector('.chat-input-button-inner .fs_button');
        button.click()
      })
    } else if (AI == "Wenxiaobai") {
      const textarea = document.querySelector('[class^=MsgInput_input_box] textarea')
      await setTextareaValue(textarea)
      await sleep(100)
      await send("[class^=Answser_answer_content]", async () => {
        document.querySelector("[class*=MsgInput_send_btn]").parentNode.click()
      })
    } else if (AI == "Grok") {
      const textarea = document.querySelector('textarea')
      const div = document.querySelector("form [contenteditable]") 
      if (div) {
        div.innerHTML = `<p>${text}</p>`
      } else {
        await setTextareaValue(textarea)
      }
      await sleep(100)
      await send(".items-center .items-start", async () => {
        document.querySelector("button[type=submit]")?.click()
      })
    } else if (AI == "Xiaoyi") {
      dispatchInput('textarea')
      await sleep(100)
      await send(".receive-box", () => {
        const button = document.querySelector('.send-button');
        button.click()
      })
    } else if (AI == "Baidu") {
      document.querySelector("#chat-input-box").innerText = text
      await sleep(100)
      await send("[class^=index_answer-container]", () => {
        const button = document.querySelector('.send-icon');
        button.click()
      })
    } else if (AI == "Perplexity") {
      setEditorText()
      await send(".-inset-md", () => {
        const node = document.querySelector("button[aria-label=Submit]");
        node.click()
      })
    } else if (AI == "Sider") {
      setTextareaValue(document.querySelector("textarea.chatBox-input"))
      await sleep(100)
      await send(".message-item", () => {
        const button = document.querySelector('.send-btn');
        button.click()
      })
    } else if (AI == "Microsoft") {
      await setEditorText()
      await sleep(1000)
      await send("[id^=chatMessageResponser]", () => {
        const button = document.querySelector('button[type="submit"]');
        button.click()
      })
    } else if (AI == "GoogleNotebookLM") {
      dispatchInput("textarea.query-box-input")
      await sleep(1000)
      await send("chat-message", () => {
        const button = document.querySelector('button[type="submit"]');
        button.click()
      })
    }  else if (AI == "MinMax") {
      setTextareaValue(document.querySelector("#chat-input"))
      await send("section.chat-card-list-wrapper .chat-card-item-wrapper", () => {
        const button = document.querySelector('#input-send-icon div');
        button.click()
      })
    } else if (AI == "LMArena") {
      setTextareaValue(document.querySelector("form textarea"))
      await send("main ol div", () => {
        const button = document.querySelector('button[type="submit"]');
        button.click()
      })
    } else if (AI == "GitHubCopilot") {
      const textarea = document.querySelector("textarea#copilot-chat-textarea");
      textarea[Object.keys(textarea)[0]].pendingProps.onChange({ target: { value: text }, isDefaultPrevented: () => false })
      await send(".message-container", () => {
        const button = document.querySelector('[class^=ChatInput-module__toolbarButtons] button');
        button.click()
      })
    }

  }

  // 连续发送
  const send = async (selector, callback, delatTime=500) => {
    const oldNumber = document.querySelectorAll(selector).length;
    callback();
    await sleep(delatTime);
    while (document.querySelectorAll(selector).length == oldNumber) {
      try {
        callback();
        await sleep(delatTime);
      } catch {break}
    }
  }

  const uploadFile = async (base64String, fileName) => {
    try {
      let fileType;
      if (fileName.endsWith("pdf")) {
        fileType = "application/pdf";
      } else if (fileName.endsWith("png")) {
        fileType = "image/png";
      } else if (fileName.endsWith("txt") || fileName.endsWith("md")) {
        fileType = "text/plain";
      }
      function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }

      const AIData = {
        ChatGPT: {
          method: "input",
          selector: "input[type=file]",
        },
        Tongyi: {
          method: "drag",
          selector: "[class^=chatInput]",
        },
        Kimi: {
          method: "input",
          selector: "input[type=file]"
        },
        Claude: {
          method: "input",
          selector: "input[type=file]",
        },
        AIStudio: {
          method: "drag",
          selector: ".text-wrapper",
        },
        Chatglm: {
          method: "input",
          selector: "input[type=file]",
        },
        Doubao: {
          method: "input",
          selector: "input[type=file]",
        },
        Zaiwen: {
          method: "drag",
          selector: ".arco-upload-draggable",
        },
        DeepSeek: {
          method: "drag",
          selector: ".bf38813a",
        },
        Yuanbao: {
          method: "drag",
          selector: ".agent-chat__input-box"
        },
        ChanlderAi: {
          method: "input",
          selector: "input[type=file]",
        },
        Yiyan: {
          method: "drag",
          selector: ".UxLYHqhv",
        },
        Poe: {
          method: "drag",
          selector: ".ChatDragDropTarget_dropTarget__1WrAL"
        },
        Monica: {
          method: "drag",
          selector: "[class^=chat-input-v2]"
        },
        Copilot: {
          method: "input",
          selector: "input[type=file]",
        },
        Qwen: {
          method: "input",
          selector: "input[type=file]",
        },
        TencentDeepSeek: {
          method: "input",
          selector: "input[type=file]",
        },
        AskManyAI: {
          method: "input",
          selector: "input[type=file]",
        },
        Wenxiaobai: {
          method: "input",
          selector: "input[type=file]",
        },
        Coze: {
          method: "input",
          selector: "input[type=file]",
        },
        Baidu: {
          method: "drag",
          selector: "[class^=chat-bottom-wrapper]"
        },
        Gemini: {
          method: "input",
          selector: 'input[type=file]',
        },
        GoogleNotebookLM: {
          method: "input",
          selector: 'input[type=file]',
        },
        Gemini: {
          method: "input",
          selector: 'input[type=file]',
          // 点开元素
          before: async () => {
            console.log("before")
            document.querySelector("uploader .upload-card-button").click();
            while (!document.querySelector('[data-test-id="local-image-file-uploader-button"]')) {
              console.log("等待弹窗")
              await sleep(100)
            }

            const button = document.querySelector('[data-test-id="local-image-file-uploader-button"]')
            setTimeout(() => {
              console.log("延迟点击", button);
              button.click();
            }, 100);
            
          },
          after: async ()=>{
            console.log("after")
            document.querySelector("uploader .upload-card-button").click();
            await sleep(1000)
            while (document.querySelector('uploader-file-preview-container [role="progressbar"]') ) {
              console.log("wait...")
              await sleep(1000)
            }
          }
        }
      };
      if (!AIData[AI]) {
        AIData[AI] = {
          method: "input",
          selector: 'input[type=file]',
        }
      }
      if (AIData[AI].beforeCallback) {
        AIData[AI].beforeCallback()
        await sleep(3e3)
      }

      if (AIData[AI]) {
        const { method, selector, until, before, after } = AIData[AI];
        if (method === "input") {
          // 创建一个虚拟的文件对象
          const fileContent = base64ToArrayBuffer(base64String);
          const file = new File([fileContent], fileName, { type: fileType });

          // 创建一个DataTransfer对象，并添加文件
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          if (before) {
            await before()
            while (!document.querySelector(selector)) {
              console.log("等待", selector)
              await sleep(1e3)
            }
          }
          let fileInput
          let fileInputs = document.querySelectorAll(selector);
          if (fileInputs.length == 1) {
            fileInput = fileInputs[0]
          } else {
            fileInput = [...fileInputs].find(i => i.accept.includes(fileType) || i.multiple)
          }
          if (fileInput) {
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            window.alert(AI + "上传失败，请刷新网页后重试。若多次重试仍无法上传，请检查更新脚本，更新后仍如此，请联系开发者修复。")
          }
          if (after) {
            await after()
          }
        } else if (method === "drag") {
          // 创建一个虚拟的文件对象
          const fileContent = base64ToArrayBuffer(base64String);
          const file = new File([fileContent], fileName, { type: fileType });

          // 创建一个DataTransfer对象，并添加文件
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // 查找可拖放的区域或上传区域
          const dropZone = document.querySelector(selector); // 使用提供的选择器查找拖放区域
          if (!dropZone) {
            window.alert(AI + "未获取到dropZone，请联系开发者修复")
          }
          // 创建dragenter, dragover, drop事件
          const dragStartEvent = new DragEvent("dragstart", {
            bubbles: true,
            dataTransfer: dataTransfer,
            cancelable: true
          });
          const dropEvent = new DragEvent("drop", {
            bubbles: true,
            dataTransfer: dataTransfer,
            cancelable: true
          });
          
          // 依次派发事件，模拟拖放过程
          dropZone.dispatchEvent(dragStartEvent);
          dropZone.dispatchEvent(dropEvent);
        }
        if (until) {
          await sleep(100)
          while (!until()) {
            await sleep(100)
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };


  // 阻塞
  function sleep(ms) {
    execInZotero()
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 支持：多个联动页面打开
  const LOCK_KEY = 'gpt_connector_running';
  const TAB_ID = Math.random().toString(36).substr(2, 9);  // Unique ID for each tab

  GM_registerMenuCommand('⭐️ 优先', () => {
    isRunning = true
    releaseLock()
    acquireLock()
    window.alert("⭐️ 优先")
  });

  GM_registerMenuCommand('🔗 运行', () => {
    isRunning = true
    window.alert("🔗 已运行")
  });

  GM_registerMenuCommand('🎊 断开', () => {
    isRunning = false
    releaseLock()
    window.alert("🎊 断开")
  });


  function acquireLock() {
    let lockInfo = JSON.parse(GM_getValue(LOCK_KEY, "{}"));

    if (lockInfo && lockInfo.isLocked) {
      if (lockInfo.tabId === TAB_ID) {
        // The current tab already holds the lock
        // console.log('This tab already holds the lock:', TAB_ID);
        return true;
      } else {
        // Lock is held by another tab
        // console.log('Another tab is already running the script. Exiting...');
        return false;
      }
    } else {
      // Lock is not set, acquire it for this tab
      GM_setValue(LOCK_KEY, JSON.stringify({ isLocked: true, tabId: TAB_ID }));
      // console.log('Lock acquired by tab:', TAB_ID);
      return true;
    }
  }

  function releaseLock() {
    GM_setValue(LOCK_KEY, JSON.stringify({ isLocked: false, tabId: null }));
  }

  // Add an event listener to release the lock when the page is unloaded
  window.addEventListener('beforeunload', releaseLock);
  window.addEventListener('reload', releaseLock);

  releaseLock()
  // 通信
  while (true) {
    if (!acquireLock()) {
      await sleep(1000)
      continue;
    }
    if (!isRunning) {
      await execInZotero(`
        window.Meet.Connector.time = 0;
      `)
      await sleep(1000)
      continue;
    }
    try {
      const tasks = (await execInZotero(`
        window.Meet.Connector
      `)).tasks

      if (!tasks || tasks.length == 0) {
        await sleep(500)
        continue
      }
      const task = tasks.slice(-1)[0]
      if (task.type == "pending") {
        if (task.file || task.files && task.responseText == undefined) {
          await execInZotero(`
            let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
            task.type = "done"
          `)
          if (task.file) {
            await uploadFile(task.file.base64String, task.file.name)
          } else if (task.files){
            for (let file of task.files) {
              await uploadFile(file.base64String, file.name)
            }
          }
        } else if (task.requestText) {
          await setText(task.requestText)
          // 操作浏览器提问
          await execInZotero(`
            let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
            task.requestText = "";
            task.responseText = "<p>Waiting ${AI}...</p>";
          `)
        } else {
          let isDone = false, text = "", type = "html"
          const setZoteroText = async () => {
            if (typeof (text) !== "string") { return }
            await execInZotero(`
              let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
              task.responseText = ${JSON.stringify(text)};
              task.type = ${isDone} ? "done" : "pending";
              task.responseType = "${type}"
            `)
            if (isDone) {
              await sleep(1000)
              await execInZotero(`
                let task = window.Meet.Connector.tasks[window.Meet.Connector.tasks.length-1]
                task.responseText = ${JSON.stringify(text)};
            `)
            }
          }
          if (AI == "Poe") {
            type = "markdown"
            const lastNode = [...document.querySelectorAll("[class^=ChatMessage_chatMessage] [class^=Message_selectableText]")].slice(-1)[0]
            console.log("lastNode[Object.keys(lastNode)[1]]", lastNode[Object.keys(lastNode)[1]])
            const props = lastNode[Object.keys(lastNode)[0]].alternate.child.memoizedProps
            text = props.text
            isDone = Boolean(lastNode.closest("[class^=ChatMessagesView_messageTuple]").querySelector("[class^=ChatMessageActionBar_actionBar]"))
            await setZoteroText()
          
          } else if (AI == "Copilot") {
            const lastAnwser = [...document.querySelectorAll('[data-content=ai-message]')].slice(-1)[0]
            type = "markdown"
            const props = lastAnwser[Object.keys(lastAnwser)[0]].pendingProps.children[1][0].props  
            text = props.item.text
            isDone = props.isStreamingComplete
            await setZoteroText()
          } else if (AI == "TencentDeepSeek") {
            const div = document.querySelector(".client-chat");
            const msg = div.__vue__.msgList.slice(-1)[0]
            isDone = msg.is_final
            const content = div.__vue__.msgList.slice(-1)[0].content
            if (!content) {
              text = "> " + div.__vue__.msgList.slice(-1)[0].agent_thought.procedures[0].debugging.content.trim().replace(/\n+/g, "\n")
            } else {
              text = content
            }
            type = "markdown"
            await setZoteroText()
          } else if (AI == "Xiaoyi") {
            const div = [...document.querySelectorAll(".receive-box")].slice(-1)[0];
            isDone = Boolean(div.closest(".msg-content") && div.closest(".msg-content").querySelector(".tool-bar"))
            text = div.querySelector(".answer-cont").innerHTML
            type = "html"

            await setZoteroText()
          } else if (AI == "Microsoft") {
            const div = document.querySelector('[id^=chatMessageResponser]')
            if (!div) { return }
            text = div[Object.keys(div)[1]].children[0].props.text
            isDone = div.closest('[role="article"]').querySelector(".fai-CopilotMessage__footnote")
            type = "markdown"

            await setZoteroText()
            
          }
        }
      }
    } catch (e) {
      if (String(e).includes("Network error")) {
        await sleep(1e3)
      } else {
        console.log(e)
      }
    }
    await sleep(100)
  }
})();