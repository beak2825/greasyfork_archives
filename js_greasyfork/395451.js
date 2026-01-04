// ==UserScript==
// @name         Create & copy release content for coding project.
// @namespace    https://greasyfork.org/zh-CN/scripts/395451
// @version      1.9.0
// @description  Make your release real quick!
// @author       You
// @match        https://*.coding.net/p/*/d/*/git/compare/*
// @match        https://*.codingcorp.net/p/*/d/*/git/compare/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395451/Create%20%20copy%20release%20content%20for%20coding%20project.user.js
// @updateURL https://update.greasyfork.org/scripts/395451/Create%20%20copy%20release%20content%20for%20coding%20project.meta.js
// ==/UserScript==

(function () {
    const PageRegExp = /\/p\/(.*)[\/d\/(.*)]?\/git\/compare\/(.*)\.\.\.(.*)/;

    const getDateStr = () => {
        const t = new Date()
        const y = t.getUTCFullYear();
        const m = `0${t.getUTCMonth() + 1}`.slice(-2);
        const d = `0${t.getUTCDate()}`.slice(-2);
        const dateStr = `${y}-${m}-${d}`;
        const tag = `${y}${m}${d}.1`;
        return [dateStr, tag];
    }

    const getContent = (source, target, content, date, tag, depot, project, corp) => `# 更新日期

> 开始时间：${date} 10:00
> 结束时间：


# 发布类型

常规发布


# 负责人

@name


# 改动说明

${content}


# ${depot} diff

https://${corp}.coding.net/p/${project}/d/${depot}/git/compare/${source}...${target}


# 更新服务

服务 | 标签 | 顺序
:---------- | :----------: | ----------:
e-${depot}  |  ${tag}  |  1


# 发布后 ${depot} master 指向

\`\`\`
${target}
\`\`\`


# Checklist

# 测试链接

http://codingcorp.coding.testing-1-corp.coding.io/?buffet=${target}
http://codingcorp.staging-corp.coding.io/?buffet=${target}
https://codingcorp.coding.net/?buffet=${target}


`;

    const getCompareResult = (source, target, depot, project, corp) =>
        fetch(`/api/user/${corp}/project/${project}/depot/${depot}/git/compare_v2?source=${source}&target=${target}&w=&prefix=`);

    const getMRId = url => {
        const match = url.match(/\d+(\/)?$/) || [];
        return match.shift() || 0;
    }

    const matchFromPath = () => {
        const { pathname, host } = window.location;
        const match = pathname.match(/\/p\/(.*)[\/d\/(.*)]?\/git\/compare\/(.*)\.\.\.(.*)/) || [];

        const len = match.length;
        if (len < 3 || !match[1]) {
            throw new Error(`failed to parse url.`);
        }

        const [project, depot] = match[1].split(`/d/`);

        return [
            ...match.slice(-2),
            depot || project,
            project,
            window.location.host.split('.').shift(),
        ];
    }

    async function makeRelease() {
        const [source, target, depot, project, corp] = matchFromPath()
        const res = await getCompareResult(source, target, depot, project, corp);
        const { data: { commits = [] } } = await res.json()
        const mrs = commits.filter(c => c.rawMessage.startsWith(`Accept Merge Request #`))

        const list = mrs.map(m => {
            const arr = m.rawMessage.split('\n');
            const title = arr.find(i => i.includes(`Merge Request:`)).replace(`Merge Request:`, '').trim();
            const creator = arr.find(i => i.includes(`Created By:`)).replace(`Created By:`, '').trim();
            const link = arr.find(i => i.includes(`URL:`)).replace(`URL:`, '').trim();
            const mrId = getMRId(link);
            const mrText = `<a href="${link}">#${mrId}</a>`;
            return `- ` + [title, creator, mrText].join(`, `);
        });
        const content = list.join(`\n`);

        const [date, tag] = getDateStr();
        const text = getContent(source, target, content, date, tag, depot, project, corp);
        GM_setClipboard(text, `text`);
        GM_notification(`Copied to 📝`, `💯`);
    }

    const style = `button#create-copy-release-btn {
z-index: 100;
position: absolute;
right: 200px;
top: 46px;
display: inline-block;
border: none;
padding: 1rem 2rem;
margin: 0;
text-decoration: none;
background: #0069ed;
color: #ffffff;
font-family: sans-serif;
font-size: 1rem;
cursor: pointer;
text-align: center;
transition: background 250ms ease-in-out,
transform 150ms ease;
-webkit-appearance: none;
-moz-appearance: none;
}

button#create-copy-release-btn:hover,
button#create-copy-release-btn:focus {
background: #0053ba;
}

button#create-copy-release-btn:focus {
outline: 1px solid #fff;
outline-offset: -4px;
}

button#create-copy-release-btn:active {
transform: scale(0.99);
}`;
    GM_addStyle(style);

    const btn = document.createElement('button');
    btn.innerText = `Create & Copy Release`;
    btn.id = `create-copy-release-btn`;
    btn.onclick = makeRelease;

    let timer = null;
    let inserted = false;
    timer = setInterval(() => {
        const isComparePage = PageRegExp.test(window.location.pathname);

        if (inserted) {
            if (isComparePage) return;
            btn.parentNode.removeChild(btn);
            inserted = false;
            return;
        }

        if (!isComparePage) {
            return;
        }

        const s = document.querySelector(`[class*=ref-selector]`);
        if (!s) return;

        if (!inserted) {
            s.parentNode.appendChild(btn);
            inserted = true;
        }
        // clearInterval(timer);
    }, 200);
})()
