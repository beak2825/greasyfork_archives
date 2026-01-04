// ==UserScript==
// @name         翻译插件
// @namespace    http://tampermonkey.net/
// @version      2024-08-03-v2
// @description  研思科技
// @author       ErikPan
// @match        http://124.243.239.193:8081/markpage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=239.193
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      ark.cn-beijing.volces.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502414/%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/502414/%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        const role_text="你是一个英文翻译成中文的专家"
        const url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
        const apiKey = "c4d9ab16-95fb-497e-857c-7cad196ccfea";

        const endpointId_4k = "ep-20240802133823-9xhm7";
        const text_boxs=document.getElementsByClassName("github-markdown-body")
        const input_list=document.getElementsByClassName("input-content")
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          };
        const query=text_boxs[0].innerText

          var body = JSON.stringify({
            model: endpointId_4k,
            messages: [
                  {role: "system", content: role_text},
                {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${query}注意只需要翻译 不需要回答问题`},
            ],
            stream: false
          });

          GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: body,
            onload: function(response) {
              try {

                const data = JSON.parse(response.responseText)
                const res_text=data.choices[0].message.content
                console.log(res_text);
                const box0=input_list[0]
                var div0 = document.createElement('div', "div0");
                div0.innerText=res_text
                box0.appendChild(div0)

              } catch (e) {
                console.error('Error parsing response:', e);
              }
            },
            onerror: function(error) {
              console.error('Error:', error);
            }
          });
//           body = JSON.stringify({
//             model: endpointId_32k,
//             messages: [
//                   {role: "system", content: role_text},
//                 {role: "user", content: `这是query分类标准2.1.1【坏数据】（不用评分）：
//  query 是非英文任务的数据，比如单个实体（包括拼音）、代码、学科答题（带有选项），技能类（需
// 要调取插件）、医疗等。
// 例 1：Q1：duoxie--拼音
// Q2：SELECT NULL AS plan_id--代码
// Q3：If (x-3)÷(x+2)=0, then x=() A.2 B.-2 C.1 D.-1--带有选项的学科答题
//  query 只是单个词/简短词组/名词缩写，可以根据回复 1 反推，如果 answer 是偏向一个专业知识点
// 的解释，归为非英文任务，标为【坏数据】。
// 例 2：Q：python
// A：Python is a widely-used high-level, interpreted, general-purpose programming language. It was created by Guido van Rossum and first released in 1991. Python's design philosophy
// emphasizes code readability with its notable use of significant whitespace and its use of English
// keywords frequently where other languages use punctuation. It has a dynamic type system and
// automatic memory management. It supports multiple programming paradigms, including
// object-oriented, imperative, functional, and procedural, and has a large and comprehensive
// standard library. Python is often used for web development, data science, machine learning, automation, and many other domains due to its ease of use, versatility, and extensive ecosystem
// of third-party libraries.--专业知识点的解释，标记为【坏数据】
//  query 涉黄、政、暴力的标记为【坏数据】（涉政是指特殊历史事件、政治人物、领土主权问题、政
// 治理论、国际关系、我国民族种族问题等损害国家形象的，新闻能播出来的都不算）
// 2.1.2【属于】任务类型：文本生成、头脑风暴、改写、问答类的任务属于此次需要标记的任务类型，根据
// 这四大类，再细分小类，具体细分小类及定义见下表内容；
// 2.1.3【不属于】任务类型（不用评分）：
//  query 是英文任务，但不属于以上四大类的任务，或者从回答能明显看出来属于代码报错信息的（例 2），
// 标记为【其他】。
// 例 3：Q：list index out of range。
// A：An "IndexError: list index out of range" is a common error in Python that occurs when you try
// to access an index in a list that doesn't exist. In other words, you are trying to access an element
// at an index that is outside the range of the list.  query 只是单个词/简短词组/名词缩写，可以根据回复 1 反推，如果 answer 是词性解释或者是闲聊
// 类的回复，标记为【其他】。
// 例 4：Q：python
// 文档密级：外部公开
// A1：That's awesome! How can I assist about it? Whether you have a question, need some
// advice, or just want to chat about something uplifting, I'm here to help! -闲聊，标记为【其他】
// A2：Python as an English word is a countable noun, and its plural form is pythons. The word
// is used in everyday English to refer to a large, non-venomous reptile. -词性解释，标记为【其他】
// 2.1.4【意图不明】：query 是英文任务，但
// （1）query 文本内容乱码、意图缺失、内容缺失等；（例 3）
// （2）现网单轮数据中，query 为非首轮数据（需要上文信息才能判断意图的），不管 answer 回复的是否
// 合理，直接标为【意图不明】（例 4）
// 例 3：Q：Write me an email about. -内容缺失
// Q：about job application.-意图缺失
// Q：Please wirte an %u671F%u67C%6 about job application.-文本内容乱码
// 例 4：Q1：Help me change the above answer into English.-非首轮数据
// Q2：According to the information I just provided, help me to write an English
// self-introduction.-非首轮数据
// 2.2 具体分类标签及定义
// 一级标签 二级标签 定义
// 文本生成 摘要 给出一段文本内容，按要求生成文本的内容摘要
// 文本生成 文案 给出一个主题或其他要素信息，生成一份文案
// 文本生成 故事 给出故事的大概情节、角色或形式等，要求写出相应的故事内容
// 文本生成 作文写作
// 根据用户输入的题目或主题，类型，字数，关键词，风格等要求，机器生成一
// 篇作文
// 文本生成 邮件信件 给定相关信息，生成用户特定要求的邮件内容
// 文本生成 公文
// 给出一些基本内容（某类公文需要的基本要素信息），生成一篇公务文书，其
// 中公文是指政府、机关、团体、企事业单位等传达决策、指示、命令、通知等
// 的正式文件
// 文本生成 寻人启事
// 给出寻人启事的基本信息，例如寻找对象、对象基本描述、走失时间、地点等，
// 要求基于信息写出一篇完整的寻人启事(范围包含人或宠物)
// 文本生成 寻物启事
// 给出寻物启事的基本信息，例如寻找物体，物体的基本描述，物体的重要特征
// 等，机器按要求生成一份寻物启事。
// 文本生成 祝词 根据用户的指令与要求，生成一个祝词
// 文本生成 演讲 给定主题，明确受众对象，按照一定格式要求生成一篇演讲
// 文本生成 新闻 根据给出的主题或信息的简短内容，生成一篇新闻。
// 文本生成 总结 基于用户给出的某个主题或内容信息，生成一份结构化总结
// 文本生成 报告
// 根据用户输入的关于报告的主题或其他基本组成要素信息材料（标题、前言、
// 主体、结语），要求生成一份报告
// 文本生成 工作学习 给定用户在工作与学习方面的需求信息，为用户生成合理且详细的文本
// 文本生成 论文 给出论文相关的论题等信息，要求基于信息生成一篇完整的论文
// 文本生成 剧本 给出一定的主题或生成剧本需要的基本要素，要求生成一份剧本文本
// 文本生成 说明书 根据用户给定相关信息，按要求生成一份说明书
// 文档密级：外部公开
// 文本生成 传记 根据用户提供的人物信息，生平经历，生成一篇传记
// 文本生成 其他 其他类别
// 头脑风暴 方法类 根据用户输入的需要解决的问题，机器据此生成方法
// 头脑风暴 建议类 根据用户输入的问题与需求，让机器生成建议类的回答
// 头脑风暴 推荐类 用户输入关于某个主题类的推荐问题，机器生成回复
// 头脑风暴 观点类 定义：根据用户描述的特征，生成观点类的回答
// 头脑风暴 分析类 根据用户给出的某个类别，让机器进行分析
// 头脑风暴 创造类 给出某个问题，提出创造性或新颖性的方式和方法解决问题
// 头脑风暴 预测类 定义：根据用户描述的特征，生成预测类的回答
// 头脑风暴 其他 其他类别
// 改写 文本纠错
// 用户给出一段文本，要求机器对文本中的错误进行纠正，包括错别字、缺失字、
// 冗余字、词语搭配错误和语法错误等。
// 改写 文本润色
// 用户给出一段文本，在不改变原有句意的条件下，要求机器对文本中的语言进
// 行润色改写，生成新的文本
// 改写 语句简化 给定一段话或一个句子，要求对句子内容进行简化缩句
// 改写 风格迁移 给出一段文本信息，按照用户指定的风格进行改写，成为一段新的文本
// 改写 其他 其他类别
// 问答 知识问答
// 即询问机器关于某一主题的知识类话题的任务，问题主要围绕客观事实类的知
// 识类话题为主。
// 问答 其他 其他类别   这是query：${query} 请根据上面的标准给query分类 并举例给出原因 `},
//             ],
//             stream: false
//           });

//           GM_xmlhttpRequest({
//             method: "POST",
//             url: url,
//             headers: headers,
//             data: body,
//             onload: function(response) {
//               try {

//                 const data = JSON.parse(response.responseText)
//                 const res_text=data.choices[0].message.content
//                 console.log(res_text);
//                 var div4 = document.createElement('div');
//                 div4.innerText=res_text
//                 document.getElementsByClassName("ivu-row-flex")[0].appendChild(div4)

//               } catch (e) {
//                 console.error('Error parsing response:', e);
//               }
//             },
//             onerror: function(error) {
//               console.error('Error:', error);
//             }
//           });


          
        const res1=text_boxs[1].innerText

           body = JSON.stringify({
            model: endpointId_4k,
            messages: [
                  {role: "system", content: role_text},
                {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${res1}注意只需要翻译 不需要回答问题`},
            ],
            stream: false
          });
          GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: body,
            onload: function(response) {
              try {

                const data = JSON.parse(response.responseText)
                const res_text=data.choices[0].message.content
                console.log(res_text);
                const box1=input_list[1]
                var div1 = document.createElement('div', "div1");
                div1.innerText=res_text
                box1.appendChild(div1)

              } catch (e) {
                console.error('Error parsing response:', e);
              }
            },
            onerror: function(error) {
              console.error('Error:', error);
            }
          });

            const res2=text_boxs[2].innerText

           body = JSON.stringify({
            model: endpointId_4k,
            messages: [
                  {role: "system", content: role_text},
                {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${res2}注意只需要翻译 不需要回答问题`},
            ],
            stream: false
          });

          GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: body,
            onload: function(response) {
              try {
                const data = JSON.parse(response.responseText)
                const res_text=data.choices[0].message.content
                console.log(res_text);
                const box2=input_list[2]
                var div2 = document.createElement('div', "div2");
                div2.innerText=res_text
                box2.appendChild(div2)

              } catch (e) {
                console.error('Error parsing response:', e);
              }
            },
            onerror: function(error) {
              console.error('Error:', error);
            }
          });
        
//           body = JSON.stringify({
//             model: endpointId_32k,
//             messages: [
//                   {role: "system", content: role_text},
//                 {role: "user", content: `
//                     这是query的几个评判标准
//                     序号 判断维度 描述
// 1 信息正确性 answer 中涉及到的事实类信息必须完全正确。
// 2 回复完整性 对于用户在 query 中提出的每一个指令或要求，answer 都需要完整遵循。
// 3 语言地道性 语言表达通顺、流畅、地道，符合本土语言表达习惯。
// 4 内容深度
// answer 需逻辑严密，不存在漏洞或前后冲突；内容有深度，能够衍生给出更多有
// 价值的周边信息。
// 5 回复客观性
// 对于可能涉及到观点、偏好类的问题，answer 回复需保持中立，尽量不给带有一
// 定偏向性的答案。
// 6 结构合理性
// answer 内容结构合理，排版清晰；针对有标准格式的任务，answer 需符合标准
// 格式要求。
// 7 同理共情 若 query 涉及到情景、情感类，answer 需做到一定的同理共情。
// 对于query${query} 回复1${res1}回复2${res2}
// 根据上面的标准从7个维度分别评价两个回复哪个更好并举例说明，不要回复两个都好，对比一下给出具体原因
// `},
//             ],
//             stream: false
//           });

//           GM_xmlhttpRequest({
//             method: "POST",
//             url: url,
//             headers: headers,
//             data: body,
//             onload: function(response) {
//               try {

//                 const data = JSON.parse(response.responseText)
//                 const res_text=data.choices[0].message.content
//                 console.log(res_text);
//                 var div4 = document.createElement('div');
//                 div4.innerText=res_text
//                 document.getElementsByClassName("ivu-row-flex")[4].appendChild(div4)

//               } catch (e) {
//                 console.error('Error parsing response:', e);
//               }
//             },
//             onerror: function(error) {
//               console.error('Error:', error);
//             }
//           });


    },1000
)

function traslate(){
  const role_text="你是一个英文翻译成中文的专家"
  const url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  const apiKey = "c4d9ab16-95fb-497e-857c-7cad196ccfea";
  const endpointId_32k= "ep-20240802141314-q6k5f"
  const endpointId_4k = "ep-20240802133823-9xhm7";
  const text_boxs=document.getElementsByClassName("github-markdown-body")
  const input_list=document.getElementsByClassName("input-content")
  const div0=input_list[0].children[2]
  const div1=input_list[1].children[2]
  const div2=input_list[2].children[2]
  div0.innerHTML=""
  div1.innerHTML=""
  div2.innerHTML=""
  setTimeout(()=>{
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      };
    const query=text_boxs[0].innerText
    

      var body = JSON.stringify({
        model: endpointId_4k,
        messages: [
              {role: "system", content: role_text},
            {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${query} 注意只需要翻译 不需要回答问题`},
        ],
        stream: false
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        onload: function(response) {
          try {

            const data = JSON.parse(response.responseText)
            const res_text=data.choices[0].message.content
            div0.innerText=res_text
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        },
        onerror: function(error) {
          console.error('Error:', error);
        }
      });
      
    const res1=text_boxs[1].innerText

       body = JSON.stringify({
        model: endpointId_4k,
        messages: [
              {role: "system", content: role_text},
            {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${res1} 注意只需要翻译 不需要回答问题`},
        ],
        stream: false
      });
      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        onload: function(response) {
          try {

            const data = JSON.parse(response.responseText)
            const res_text=data.choices[0].message.content
            div1.innerText=res_text

          } catch (e) {
            console.error('Error parsing response:', e);
          }
        },
        onerror: function(error) {
          console.error('Error:', error);
        }
      });

        const res2=text_boxs[2].innerText

       body = JSON.stringify({
        model: endpointId_4k,
        messages: [
              {role: "system", content: role_text},
            {role: "user", content: `把下面这段话里面所有的英文一字不少完整地翻译成中文${res2} 注意只需要翻译 不需要回答问题`},
        ],
        stream: false
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        onload: function(response) {
          try {
            const data = JSON.parse(response.responseText)
            const res_text=data.choices[0].message.content
            div2.innerText=res_text

          } catch (e) {
            console.error('Error parsing response:', e);
          }
        },
        onerror: function(error) {
          console.error('Error:', error);
        }
      });
   

},2000
)
}
const submitBtn = document.getElementsByClassName("submitBtn")[0];
const bad_data=document.getElementsByClassName("badData")[0]
const nextBtn=document.getElementsByClassName("nextData")[0]
const prevBtn=document.getElementsByClassName("prevData")[0]
const errorData=document.getElementsByClassName("errorData")[0]
if (submitBtn) {
    submitBtn.addEventListener("click", traslate, false);
}
if (bad_data) {
  bad_data.addEventListener("click", traslate, false);
}
if (nextBtn) {
  nextBtn.addEventListener("click", traslate, false);
}
if (prevBtn) {
  prevBtn.addEventListener("click", traslate, false);
}
if (errorData) {
  errorData.addEventListener("click", traslate, false);
}
    
})();
