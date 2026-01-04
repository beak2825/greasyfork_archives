// ==UserScript==
// @name         MBTI测试转Prompt
// @namespace    https://github.com/Ocyss
// @description  我才不付费，nt
// @version      2024-09-08
// @author       Ocyss
// @match        https://iqeq.com.cn/*
// @match        https://iqeq.com/*
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqeq.com.cn

// @downloadURL https://update.greasyfork.org/scripts/507443/MBTI%E6%B5%8B%E8%AF%95%E8%BD%ACPrompt.user.js
// @updateURL https://update.greasyfork.org/scripts/507443/MBTI%E6%B5%8B%E8%AF%95%E8%BD%ACPrompt.meta.js
// ==/UserScript==


// https://mbti-16personalities.com/
// 86Q:   https://iqeq.com.cn/mbtics-v.html?mbti-16pf
// 126Q:  https://iqeq.com.cn/mbtics-v2.html?mbti-16pf
// 172Q:  https://iqeq.com.cn/mbtics-v3.html?mbti-16pf

(function() {
    const getPrompt = ()=>{
        const mbtidata = new URLSearchParams(document.cookie.split(';').find((v)=>v.trim().startsWith("mbtixinxi"))).get("mbtidata");
        const mbti = Array.from(mbtidata).reduce((o, v) => {
            o[v]++
            return o
        }, {"I":0,"E":0,"N":0,"S":0,"T":0,"F":0,"J":0,"P":0,"H":0,"Z":0})
        const data = `I内向(Intravert): ${mbti.I} E外向(Extravert): ${mbti.E}
N直觉(Intuition): ${mbti.N} S感觉(0bservant): ${mbti.S}
T思考(thinking): ${mbti.T} F情感(feeling): ${mbti.F}
J判断(Judging): ${mbti.J} P感知(perceiving): ${mbti.P}
H(Harmonious Traits): ${mbti.H} Z自我意识(Self-awareness): ${mbti.Z}
`
        return `## 角色
你是一位MBTI性格测试专家

## 目标
根据用户输入的MBTI测试数据进行分析，并输出结果

##  技能
- 拥有专业的MBTI性格分析能力
- 拥有较好的排版能力，能输出直观的结果

## workflow
- 分析：根据用户的MBTI进行分析，了解用户的性格
- 输出：根据提供的输出类型，进行填空


## Output
使用下列表单格式，其中内容使用md格式，注释不需要显示，只填上对应内容
其中性格偏比 使用1来表示偏比进度条，中间 | 表示中间， 如： 外向(E) 01111|10000 内向(I)  ， 直觉(N) 00011|11100 实感(S)

最后只输出下列格式，不要使用代码块 \`\`\` 来包裹，也不要携带思考过程等其他信息
\`\`\`输出
# 你的测试类型：
<!-- 格式： 表演家类型：INTP -->


# 性格偏比:

 - 外向(E) 00000|00000 内向(I)
 - 直觉(N) 00000|00000 实感(S)
 - 感性(F) 00000|00000 理性(T)
 - 判断(J) 00000|00000 知觉(P)

# 你的人格类型：
  <!-- 此类型的基础画像 -->

## 一.基本性格分析：

### 优缺点分析：

### 此类型的主要特质：

## 二.情感分析：

#### 1.恋爱:

#### 2.友谊:

#### 3.亲子:

#### 4.职场:


### 情感与人际交往的发展建议:

#### 1.在恋爱关系中:

#### 2.在婚姻关系中:

#### 3.在亲子关系中:

#### 4.在友谊关系中:

#### 5.在职场人际关系中:

## 三.职业分析:

### 职业优势:

### 职业劣势:

### 适合的岗位特质:

### 适合的职业领域:

### 适合的典型职业:

## 四.个人发展建议:
 1.
 2.
 3.
 ...
\`\`\`

## USER
\`\`\`MBTI测试数据
${data}
\`\`\`
`
    }
    GM_registerMenuCommand("复制提示词", () => {
        const textArea = document.createElement('textarea');
        textArea.value = getPrompt();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('文本已成功复制到剪贴板');
    });
    GM_registerMenuCommand("打印提示词", () => {
        console.log(getPrompt())
    });
})();