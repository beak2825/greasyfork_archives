// ==UserScript==
// @name         唯品会批量搜索销量
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在魔方罗盘创建批量搜索款号销量
// @author       QMSY
// @match        https://compass.vip.com/frontend/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vip.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521633/%E5%94%AF%E5%93%81%E4%BC%9A%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E9%94%80%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/521633/%E5%94%AF%E5%93%81%E4%BC%9A%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E9%94%80%E9%87%8F.meta.js
// ==/UserScript==



(function() {
    function t(t=0) {
        const e = 0 == t ? new Date((new Date).getTime() - 864e5) : new Date(t);
        return e.getFullYear() + ("0" + (e.getMonth() + 1)).slice(-2) + ("0" + e.getDate()).slice(-2);
    }
    setInterval(() => {
        "https://compass.vip.com/frontend/index.html#/product/details" == location.href && (document.querySelector("button[dltag='openButton']") || function() {
            let e = document.querySelector("div.ad-form-slot>div.ad-search-wrap>div.search-btn-box"),
                n = e.firstChild.cloneNode(!0);
            n.setAttribute("dltag", "openButton"), e.appendChild(n), n.querySelector("span").innerText = "批量搜索",
                n.addEventListener("click", (e => function() {
                    if (document.querySelector("style[dltag='mainStyle']") && document.querySelector("div[dltag='mainBack']"))
                        return void(document.querySelector("div[dltag='mainBack']").style.display = "block");
                    let e = document.createElement("div"), n = document.createElement("style");
                    n.setAttribute("dltag", "mainStyle"), e.setAttribute("dltag", "mainBack");
                    n.textContent = `
div[dltag='mainBack'] {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top: 0;
    left: 0;
    background-color: #00000050;
}

div[dltag='mainContainer'] {
    display: flex;
    width: 85%;
    height: 85%;
    background-color: #00000050;
    border-radius: 5px;
    margin: 5% auto;
    flex-wrap: wrap;
}

div[dltag='mainContainer']>div[dltag='resultCon'] {
    margin-left: 10px;
}

div[dltag].textareaCon {
    flex-basis: calc(40% - 10px);
    height: 80%;
}

div[dltag='statusCon'].textareaCon {
    flex-basis: calc(20% - 10px);
    height: 80%;
    margin-left:10px;
}

div[dltag].textareaCon>textarea {
    height: 100%;
    width: 100%;
    resize: none;
}

div[dltag='seatchBtnCon'] {
    flex-basis: 100%;
    padding: 30px;
}

div[dltag='seatchBtnCon']>button {
    width: 100%;
    height: 60px;
    font-size: 30px;
}
`;
                    e.innerHTML = `
<div dltag="mainContainer">
    <div dltag="searchCon" class="textareaCon"><textarea dltag="searchTarget"></textarea></div>
    <div dltag="resultCon" class="textareaCon"><textarea dltag="searchResult"></textarea></div>
    <div dltag="statusCon" class="textareaCon"><textarea dltag="searchStatus"></textarea></div>
    <div dltag="seatchBtnCon"><button>搜索</button></div>
</div>
`;
                    e.addEventListener("click", (e => function(e) {
                        return "DIV" == e.target.tagName && "mainBack" == e.target.getAttribute("dltag") ? void(e.target.style.display = "none") : "BUTTON" == e.target.tagName ? async function(e) {
                            let [n, a, i] = e.querySelectorAll("textarea"), l = t();
                            (new Date).getHours() < 9 && confirm("当前时间在上午九点之前，无法查询昨天销售量。是否转而查询前天的销售量？") && (l = t((new Date).getTime() - 1728e5));
                            let o = n.value.split("\n").filter((t => "" != t.trim()));
                            n.value = o.join("\n"), a.value = o.map(() => "查询中...").join("\n"), i.value = o.map(() => "查询中...").join("\n");
                            for (let t = 0; t < o.length; t++) {
                                let e = { brandStoreSn: "all", dtType: 0, calType: 1, startDt: l, endDt: l, queryHll: !1, pageNo: 1, pageSize: 50, channelType: 1, goodsNoSet: [o[t]] },
                                    d = await (await fetch("https://compass.vip.com/product/detail/getGoodsList", { method: "post", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) })).json(),
                                    r = 0;
                                for (let t = 0; t < d.data.goodsList.length; t++) {
                                    let e = d.data.goodsList[t];
                                    r += parseInt(e.goodsActureNum) || 0
                                }
                                console.log("合计销售数：", r, "销售链接列表：", d.data.goodsList);
                                let s = 0 == d.data.goodsList.length ? "商品下线" : "商品上线";
                                a.value = a.value.replace("查询中...", r), i.value = i.value.replace("查询中...", s)
                            }
                        }(e.target.parentElement.parentElement) : void 0
                    })(e)), document.head.append(n), document.body.append(e)
                })(e));
        }())
    }, 1e3);
})();